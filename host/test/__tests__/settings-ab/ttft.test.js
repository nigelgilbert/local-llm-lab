// Time to First Token (TTFT) — primary signal for --batch-size impact.
//
// claw's typical request payload (system prompt + 50+ tool definitions +
// user message) lands around 2200-2800 tokens — just above the llama.cpp
// default batch-size of 2048. With --batch-size 2048 the prefill needs two
// rounds; with --batch-size 4096 it fits in one. Expected gain: ~50-150ms
// off TTFT per request, visible as a lower median and tighter p95.
//
// We reproduce this with 25 synthetic tools (each with a multi-word
// description + 3 properties) to push the prompt reliably above 2048 tokens
// without coupling to claw's internal tool list.

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

const BRIDGE_URL     = process.env.BRIDGE_URL || 'http://host.docker.internal:4000';
const API_KEY        = process.env.ANTHROPIC_API_KEY;
const SETTINGS_LABEL = process.env.SETTINGS_LABEL || 'unknown';
const MODEL          = 'claw-llama';
const N              = Number(process.env.TTFT_N) || 10;
const TIMEOUT        = 300_000;

// 25 tools with realistic descriptions. Token count goal: each tool ≈ 80-100
// tokens (name + desc + 3-property schema + JSON wrapper), giving ~2000-2500
// tokens of tool payload, well above the 2048 batch threshold.
const TOOLS = [
  { name: 'read_file',         desc: 'Read the full contents of a file at the specified path and return them as a UTF-8 string. Fails if the file does not exist.' },
  { name: 'write_file',        desc: 'Write text content to a file at the given path, creating parent directories if needed. Overwrites existing content.' },
  { name: 'edit_file',         desc: 'Apply a precise in-place edit to a file: replace the first occurrence of old_string with new_string. Fails if old_string is not found.' },
  { name: 'list_directory',    desc: 'List entries of a directory, returning file names and types. Pass recursive=true to include all subdirectories.' },
  { name: 'create_directory',  desc: 'Create a directory at path, including all missing parent directories. Succeeds silently if the directory already exists.' },
  { name: 'delete_path',       desc: 'Permanently delete a file or directory at path. For directories, removes all contents recursively. Cannot be undone.' },
  { name: 'move_path',         desc: 'Move or rename a file or directory from src to dst. Overwrites dst if it already exists.' },
  { name: 'copy_path',         desc: 'Copy a file or directory from src to dst, preserving all contents and permissions. Recursively copies directories.' },
  { name: 'search_files',      desc: 'Recursively search for files whose names match a glob pattern under a base directory and return all matching paths.' },
  { name: 'grep_content',      desc: 'Search files under a directory for lines matching a regular expression. Returns matching lines with file name and line number.' },
  { name: 'run_shell',         desc: 'Execute a shell command in the workspace and return combined stdout and stderr. Fails if the command exits non-zero.' },
  { name: 'run_tests',         desc: 'Run the project test suite with an optional filter pattern and return the full output including pass/fail counts.' },
  { name: 'git_status',        desc: 'Return the current git status: staged changes, unstaged changes, and untracked files in the repository.' },
  { name: 'git_diff',          desc: 'Show the unified diff of changes in the working tree, or between two commits if refs are supplied.' },
  { name: 'git_commit',        desc: 'Stage all changes and create a commit with the supplied message. Returns the new commit hash.' },
  { name: 'git_log',           desc: 'Return the recent commit history as a list of entries with hash, author, date, and subject.' },
  { name: 'fetch_url',         desc: 'Fetch the body of a URL via HTTP GET and return the response as text. Follows redirects up to 5 times.' },
  { name: 'search_web',        desc: 'Perform a web search and return the top results including titles, URLs, and short snippets.' },
  { name: 'install_package',   desc: 'Install a dependency via npm, pip, or cargo, depending on the project type detected in the workspace.' },
  { name: 'get_file_stat',     desc: 'Return metadata for a path: size in bytes, last-modified timestamp, MIME type, and whether it is a file or directory.' },
  { name: 'find_definition',   desc: 'Locate the definition of a symbol (function, class, variable) by name across source files in the workspace.' },
  { name: 'find_references',   desc: 'Find all source locations that reference a given symbol name, returning file path and line number for each.' },
  { name: 'format_code',       desc: 'Run the project formatter (prettier, black, rustfmt) on the specified file and return the formatted content.' },
  { name: 'lint_code',         desc: 'Run the project linter on the specified file or directory and return any diagnostics.' },
  { name: 'summarise_file',    desc: 'Read a file and return a structured summary of its contents: language, top-level declarations, and a one-paragraph description.' },
].map(({ name, desc }) => ({
  name,
  description: desc,
  input_schema: {
    type: 'object',
    properties: {
      path:    { type: 'string',  description: 'Target file, directory, or URL.' },
      content: { type: 'string',  description: 'Content to write, pattern to search, or command to run.' },
      options: { type: 'object',  description: 'Additional flags specific to this operation.' },
    },
    required: ['path'],
  },
}));

function stats(arr) {
  if (!arr.length) return { min: 0, median: 0, p95: 0, mean: 0 };
  const s = [...arr].sort((a, b) => a - b);
  const at = (q) => s[Math.min(s.length - 1, Math.floor(q * s.length))];
  return {
    min:    s[0],
    median: at(0.5),
    p95:    at(0.95),
    mean:   Math.round(arr.reduce((a, b) => a + b, 0) / arr.length),
  };
}

// Returns ms from request send to first content_block_delta SSE event
// (i.e. when the model emits its first output token after full prefill).
async function measureTTFT() {
  const ac    = new AbortController();
  const timer = setTimeout(() => ac.abort(), 30_000);
  const t0    = Date.now();

  try {
    const res = await fetch(`${BRIDGE_URL}/v1/messages`, {
      method: 'POST',
      headers: {
        'Content-Type':      'application/json',
        'x-api-key':         API_KEY,
        'anthropic-version': '2023-06-01',
      },
      body: JSON.stringify({
        model:      MODEL,
        max_tokens: 128,
        messages:   [{ role: 'user', content: "Use read_file to read hello.py" }],
        tools:      TOOLS,
        stream:     true,
      }),
      signal: ac.signal,
    });

    if (!res.ok) {
      const body = await res.text().catch(() => '');
      throw new Error(`bridge ${res.status}: ${body.slice(0, 300)}`);
    }

    const reader  = res.body.getReader();
    const decoder = new TextDecoder();
    let buf   = '';
    let ttfMs = null;

    outer: while (true) {
      const { value, done } = await reader.read();
      if (done) break;
      buf += decoder.decode(value, { stream: true });

      // Scan complete SSE events (\n\n delimited)
      let sep;
      while ((sep = buf.indexOf('\n\n')) !== -1) {
        const raw  = buf.slice(0, sep);
        buf        = buf.slice(sep + 2);
        // First content_block_delta = first output token = TTFT
        if (ttfMs === null && raw.includes('content_block_delta')) {
          ttfMs = Date.now() - t0;
        }
        // Stop reading after we have TTFT — drain the rest
        if (ttfMs !== null && raw.includes('message_stop')) {
          reader.cancel().catch(() => {});
          break outer;
        }
      }
    }

    return { ttfMs: ttfMs ?? Date.now() - t0, ok: true };
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('TTFT request timed out after 30s');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

describe(`TTFT — time to first token (settings=${SETTINGS_LABEL})`, () => {
  it(
    `${N} requests: all succeed, TTFT distribution reported`,
    { timeout: TIMEOUT },
    async () => {
      const ttfts  = [];
      const errors = [];

      for (let i = 0; i < N; i++) {
        try {
          const { ttfMs } = await measureTTFT();
          ttfts.push(ttfMs);
          console.log(`  [${i + 1}/${N}] ttft=${ttfMs}ms`);
        } catch (err) {
          errors.push(err.message);
          console.log(`  [${i + 1}/${N}] ERROR: ${err.message}`);
        }
      }

      const s = stats(ttfts);
      console.log(`\n=== TTFT (${SETTINGS_LABEL}) ===`);
      console.log(`  n=${ttfts.length} errors=${errors.length}`);
      console.log(`  min=${s.min}ms · median=${s.median}ms · p95=${s.p95}ms · mean=${s.mean}ms`);

      assert.equal(errors.length, 0, `${errors.length} request(s) failed: ${errors.join('; ')}`);
    },
  );
});
