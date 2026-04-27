// Eval A: minimum-viable agent loop. One tool call, one file, done.
// If this fails, the backend isn't usable for any agent work at all.

const { runClaw }   = require('../lib/claw');
const workspace     = require('../lib/workspace');
const { clawModel, BACKEND } = require('../lib/backend');

const PROMPT = "create hello.py with one line: print('hello')";

describe(`eval A — single-file write (backend=${BACKEND}, model=${clawModel})`, () => {
  beforeEach(() => workspace.reset());

  test('claw creates hello.py with the requested content', async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    /* eslint-disable no-console */
    console.log(`\n=== eval-a (${BACKEND}) ===`);
    console.log(`  exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  stderr (tail):\n${r.stderr.slice(-1500)}`);
    /* eslint-enable no-console */

    expect(r.code).toBe(0);
    expect(workspace.exists('hello.py')).toBe(true);
    expect(workspace.read('hello.py')).toMatch(/print\(\s*['"]hello['"]\s*\)/);
  });
});
