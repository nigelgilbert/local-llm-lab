// Spawn the `claw` agent CLI in one-shot mode and capture stdout/stderr.
//
// claw inherits ANTHROPIC_BASE_URL and ANTHROPIC_API_KEY from our env (set by
// docker-compose.yml from ../litellm/.env), so it talks to the bridge with
// the right credentials with no additional plumbing.
//
// We invoke `claw -p "<prompt>" --model <name>` (one-shot print mode), with
// CWD pinned to /workspace so any tool calls write into the testable tree.

import { spawn } from 'node:child_process';
import { WORKSPACE } from './workspace.js';

export function runClaw({ prompt, model, timeoutMs = 240_000, extraArgs = [] }) {
  return new Promise((resolve, reject) => {
    const args = ['-p', prompt, '--model', model, ...extraArgs];
    const started = Date.now();

    // AbortController + killSignal lets Node manage the timeout cleanly:
    // on abort it sends SIGKILL and the 'close' handler observes signal.aborted.
    const ac = new AbortController();
    const timer = setTimeout(() => ac.abort(), timeoutMs);

    const child = spawn('claw', args, {
      cwd: WORKSPACE,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
      signal: ac.signal,
      killSignal: 'SIGKILL',
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (b) => { stdout += b.toString('utf8'); });
    child.stderr.on('data', (b) => { stderr += b.toString('utf8'); });

    child.on('error', (err) => {
      // AbortError is the timeout path — let 'close' handle it via signal.aborted.
      if (err.name === 'AbortError') return;
      clearTimeout(timer);
      reject(err);
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
      if (ac.signal.aborted) {
        reject(new Error(`claw timed out after ${timeoutMs}ms\nstderr:\n${stderr.slice(-1000)}`));
        return;
      }
      resolve({
        code,
        signal,
        stdout,
        stderr,
        elapsedMs: Date.now() - started,
      });
    });
  });
}
