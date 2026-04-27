// Spawn the `claw` agent CLI in one-shot mode and capture stdout/stderr.
//
// claw inherits ANTHROPIC_BASE_URL and ANTHROPIC_API_KEY from our env (set by
// docker-compose.yml from ../litellm/.env), so it talks to the bridge with
// the right credentials with no additional plumbing.
//
// We invoke `claw -p "<prompt>" --model <name>` (one-shot print mode), with
// CWD pinned to /workspace so any tool calls write into the testable tree.

const { spawn } = require('child_process');
const { WORKSPACE } = require('./workspace');

function runClaw({ prompt, model, timeoutMs = 240000, extraArgs = [] }) {
  return new Promise((resolve, reject) => {
    const args = ['-p', prompt, '--model', model, ...extraArgs];

    const started = Date.now();
    const child = spawn('claw', args, {
      cwd: WORKSPACE,
      env: process.env,
      stdio: ['ignore', 'pipe', 'pipe'],
    });

    let stdout = '';
    let stderr = '';
    child.stdout.on('data', (b) => { stdout += b.toString('utf8'); });
    child.stderr.on('data', (b) => { stderr += b.toString('utf8'); });

    const timer = setTimeout(() => {
      child.kill('SIGKILL');
      reject(new Error(`claw timed out after ${timeoutMs}ms\nstderr:\n${stderr.slice(-1000)}`));
    }, timeoutMs);

    child.on('error', (err) => {
      clearTimeout(timer);
      reject(err);
    });

    child.on('close', (code, signal) => {
      clearTimeout(timer);
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

module.exports = { runClaw };
