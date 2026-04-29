// Latency: TTFT + end-to-end tool-call roundtrip for each tier.
//
// Two sub-suites in one file so a single pass gives the full latency picture:
//
//   TTFT (N=10)          — ms from request send to first content_block_delta.
//                          Uses a 25-tool prompt (~2200-2500 tokens) to exercise
//                          prefill fully. Smaller models prefill faster; MoE
//                          (32GB) may behave differently than dense models.
//
//   Tool roundtrip (N=20) — ms from request send to stop_reason=tool_use.
//                           Single write_file tool (small prompt) → decode-speed
//                           signal. Smaller quantisation (16GB) may be faster
//                           per-token but produce fewer tokens per call.
//
// Neither sub-suite asserts a latency threshold — the numbers are informational
// for the comparison table. The roundtrip suite does assert wrap rate ≥ 0.9
// as a grammar-health sanity check, computed only over requests that actually
// produced a response: transport-level failures (undici/OrbStack socket blips)
// are tracked separately and only fail the test if they exceed FETCH_FAIL_MAX,
// so a network hiccup mid-sweep doesn't masquerade as a grammar regression.

/** @manifest
 * {
 *   "test_id": "latency",
 *   "test_version": "v1",
 *   "primary_axis": "local_usability",
 *   "secondary_axes": [
 *     "tool_discipline"
 *   ],
 *   "suite_layer": "A",
 *   "difficulty_band": "easy",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Never drop \u2014 Layer-A health metric. Latency numbers are informational; only wrap-rate >= 0.9 is asserted.",
 *   "expected_tier_signature": "tier_insensitive",
 *   "known_confounds": [],
 *   "notes": "Layer A: results must not be aggregated into model pass-rate comparisons."
 * }
 */

import { describe, it } from 'node:test';
import assert from 'node:assert/strict';

import { streamMessage } from '../../lib/bridge.js';
import { bridgeModel, TIER_LABEL } from '../../lib/tier.js';

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://host.docker.internal:4000';
const API_KEY    = process.env.ANTHROPIC_API_KEY;

const TTFT_N         = Number(process.env.TTFT_N)  || 10;
const ROUNDTRIP_N    = Number(process.env.WRAP_N)   || 20;
const WRAP_THRESHOLD = 0.9;
// Allow up to 20% transport-level failures before treating the suite as a
// transport problem rather than a grammar problem. Above that, the run is
// untrustworthy; below, surface as informational and assert grammar over
// requests that actually came back.
const FETCH_FAIL_MAX = 0.2;
const TIMEOUT        = 300_000;

// 25 tools — same payload as settings-ab/ttft.test.js (pushes prompt above 2048
// tokens to make prefill the dominant cost rather than HTTP overhead).
const TOOLS = [
  { name: 'read_file',        desc: 'Read the full contents of a file at the specified path and return them as a UTF-8 string. Fails if the file does not exist.' },
  { name: 'write_file',       desc: 'Write text content to a file at the given path, creating parent directories if needed. Overwrites existing content.' },
  { name: 'edit_file',        desc: 'Apply a precise in-place edit to a file: replace the first occurrence of old_string with new_string. Fails if old_string is not found.' },
  { name: 'list_directory',   desc: 'List entries of a directory, returning file names and types. Pass recursive=true to include all subdirectories.' },
  { name: 'create_directory', desc: 'Create a directory at path, including all missing parent directories. Succeeds silently if it already exists.' },
  { name: 'delete_path',      desc: 'Permanently delete a file or directory at path. For directories, removes all contents recursively. Cannot be undone.' },
  { name: 'move_path',        desc: 'Move or rename a file or directory from src to dst. Overwrites dst if it already exists.' },
  { name: 'copy_path',        desc: 'Copy a file or directory from src to dst, preserving all contents and permissions. Recursively copies directories.' },
  { name: 'search_files',     desc: 'Recursively search for files whose names match a glob pattern under a base directory and return all matching paths.' },
  { name: 'grep_content',     desc: 'Search files under a directory for lines matching a regular expression. Returns matching lines with file name and line number.' },
  { name: 'run_shell',        desc: 'Execute a shell command in the workspace and return combined stdout and stderr. Fails if the command exits non-zero.' },
  { name: 'run_tests',        desc: 'Run the project test suite with an optional filter pattern and return the full output including pass/fail counts.' },
  { name: 'git_status',       desc: 'Return the current git status: staged changes, unstaged changes, and untracked files in the repository.' },
  { name: 'git_diff',         desc: 'Show the unified diff of changes in the working tree, or between two commits if refs are supplied.' },
  { name: 'git_commit',       desc: 'Stage all changes and create a commit with the supplied message. Returns the new commit hash.' },
  { name: 'git_log',          desc: 'Return the recent commit history as a list of entries with hash, author, date, and subject.' },
  { name: 'fetch_url',        desc: 'Fetch the body of a URL via HTTP GET and return the response as text. Follows redirects up to 5 times.' },
  { name: 'search_web',       desc: 'Perform a web search and return the top results including titles, URLs, and short snippets.' },
  { name: 'install_package',  desc: 'Install a dependency via npm, pip, or cargo, depending on the project type detected in the workspace.' },
  { name: 'get_file_stat',    desc: 'Return metadata for a path: size in bytes, last-modified timestamp, MIME type, and whether it is a file or directory.' },
  { name: 'find_definition',  desc: 'Locate the definition of a symbol (function, class, variable) by name across source files in the workspace.' },
  { name: 'find_references',  desc: 'Find all source locations that reference a given symbol name, returning file path and line number for each.' },
  { name: 'format_code',      desc: 'Run the project formatter (prettier, black, rustfmt) on the specified file and return the formatted content.' },
  { name: 'lint_code',        desc: 'Run the project linter on the specified file or directory and return any diagnostics.' },
  { name: 'summarise_file',   desc: 'Read a file and return a structured summary of its contents: language, top-level declarations, and a one-paragraph description.' },
].map(({ name, desc }) => ({
  name,
  description: desc,
  input_schema: {
    type: 'object',
    properties: {
      path:    { type: 'string', description: 'Target file, directory, or URL.' },
      content: { type: 'string', description: 'Content to write, pattern to search, or command to run.' },
      options: { type: 'object', description: 'Additional flags specific to this operation.' },
    },
    required: ['path'],
  },
}));

const SINGLE_TOOL = {
  name: 'write_file',
  description: 'Write text content to a file.',
  input_schema: {
    type: 'object',
    properties: {
      path:    { type: 'string', description: 'File path.' },
      content: { type: 'string', description: 'Content to write.' },
    },
    required: ['path', 'content'],
  },
};

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
        model:      bridgeModel,
        max_tokens: 128,
        messages:   [{ role: 'user', content: 'Use read_file to read hello.py' }],
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

      let sep;
      while ((sep = buf.indexOf('\n\n')) !== -1) {
        const raw = buf.slice(0, sep);
        buf       = buf.slice(sep + 2);
        if (ttfMs === null && raw.includes('content_block_delta')) {
          ttfMs = Date.now() - t0;
        }
        if (ttfMs !== null && raw.includes('message_stop')) {
          reader.cancel().catch(() => {});
          break outer;
        }
      }
    }

    return ttfMs ?? Date.now() - t0;
  } catch (err) {
    if (err.name === 'AbortError') throw new Error('TTFT request timed out after 30s');
    throw err;
  } finally {
    clearTimeout(timer);
  }
}

// ---- TTFT ----
describe(`TTFT — time to first token (tier=${TIER_LABEL})`, () => {
  it(
    `${TTFT_N} requests with 25-tool prompt: all succeed, distribution reported`,
    { timeout: TIMEOUT },
    async () => {
      const ttfts  = [];
      const errors = [];

      for (let i = 0; i < TTFT_N; i++) {
        try {
          const ttfMs = await measureTTFT();
          ttfts.push(ttfMs);
          console.log(`  [${i + 1}/${TTFT_N}] ttft=${ttfMs}ms`);
        } catch (err) {
          errors.push(err.message);
          console.log(`  [${i + 1}/${TTFT_N}] ERROR: ${err.message}`);
        }
      }

      const s = stats(ttfts);
      console.log(`\n=== TTFT (${TIER_LABEL}) ===`);
      console.log(`  n=${ttfts.length} errors=${errors.length}`);
      console.log(`  min=${s.min}ms · median=${s.median}ms · p95=${s.p95}ms · mean=${s.mean}ms`);

      assert.equal(errors.length, 0, `${errors.length} TTFT request(s) failed: ${errors.join('; ')}`);
    },
  );
});

// ---- Tool-call roundtrip ----
describe(`tool-call roundtrip latency (tier=${TIER_LABEL})`, () => {
  it(
    `${ROUNDTRIP_N} round-trips: wrap rate ≥ ${WRAP_THRESHOLD * 100}%, latency distribution reported`,
    { timeout: TIMEOUT },
    async () => {
      const results = [];

      for (let i = 0; i < ROUNDTRIP_N; i++) {
        const t0 = Date.now();
        try {
          const r = await streamMessage({
            model:     bridgeModel,
            messages:  [{ role: 'user', content: "Use the write_file tool to create hello.py with exactly: print('hi')" }],
            tools:     [SINGLE_TOOL],
            maxTokens: 256,
          });
          const ms = Date.now() - t0;
          const ok = r.stopReason === 'tool_use' && r.hasToolUse;
          results.push({ ok, stopReason: r.stopReason, ms });
          console.log(`  [${i + 1}/${ROUNDTRIP_N}] ok=${ok} stop=${r.stopReason} ${ms}ms`);
        } catch (err) {
          results.push({ ok: false, error: err.message, ms: Date.now() - t0 });
          console.log(`  [${i + 1}/${ROUNDTRIP_N}] ERROR: ${err.message}`);
        }
      }

      const fetchFails = results.filter((r) => r.error).length;
      const wraps      = results.filter((r) => r.ok).length;
      const responded  = ROUNDTRIP_N - fetchFails;
      const rate       = responded > 0 ? wraps / responded : 0;
      const fetchFailRate = fetchFails / ROUNDTRIP_N;
      // Latency stats over responses that actually returned; fetch-failures
      // come back in <10ms and would skew the distribution.
      const s = stats(results.filter((r) => !r.error).map((r) => r.ms));

      console.log(`\n=== tool-roundtrip (${TIER_LABEL}) ===`);
      console.log(`  wrap rate     = ${wraps}/${responded} = ${rate.toFixed(2)}  (threshold ${WRAP_THRESHOLD}, over responded)`);
      console.log(`  fetch fails   = ${fetchFails}/${ROUNDTRIP_N} = ${fetchFailRate.toFixed(2)}  (max ${FETCH_FAIL_MAX})`);
      console.log(`  latency       = min ${s.min}ms · median ${s.median}ms · p95 ${s.p95}ms · mean ${s.mean}ms`);

      // Transport instability is a separate failure mode from grammar regression
      // — surface it with its own message so the overnight log is interpretable.
      assert.ok(
        fetchFailRate <= FETCH_FAIL_MAX,
        `transport unstable: ${fetchFails}/${ROUNDTRIP_N} requests failed before reaching the bridge (rate ${fetchFailRate.toFixed(2)} > ${FETCH_FAIL_MAX}) — not a grammar issue, retry or investigate undici/OrbStack`,
      );
      assert.ok(
        responded > 0,
        'no requests responded — cannot evaluate grammar',
      );
      assert.ok(
        rate >= WRAP_THRESHOLD,
        `wrap rate ${rate.toFixed(2)} below threshold ${WRAP_THRESHOLD} over ${responded} responded requests — grammar may have regressed`,
      );
    },
  );
});
