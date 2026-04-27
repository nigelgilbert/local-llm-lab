// Eval B: parallel tool emission. The previous default-sampling claw
// (temperature 0.7, repeat_penalty 1.05) duplicated tool calls under load —
// "create three files" frequently produced 4–5 write_file blocks for one of
// the three. The current Modelfile / grammar combo ought to issue exactly
// three distinct write_files. We verify the *outcome* (three correct files);
// duplicate-call avoidance shows up as a faster wall time.

const { runClaw }   = require('../lib/claw');
const workspace     = require('../lib/workspace');
const { clawModel, BACKEND } = require('../lib/backend');

const PROMPT =
  "Use write_file to create three files in parallel: " +
  "a.py with print(1), b.py with print(2), c.py with print(3). " +
  "Issue all three tool calls in one response.";

const EXPECTED = [
  { file: 'a.py', match: /print\(\s*1\s*\)/ },
  { file: 'b.py', match: /print\(\s*2\s*\)/ },
  { file: 'c.py', match: /print\(\s*3\s*\)/ },
];

describe(`eval B — three parallel writes (backend=${BACKEND}, model=${clawModel})`, () => {
  beforeEach(() => workspace.reset());

  test('claw creates a.py, b.py, c.py with matching contents', async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    /* eslint-disable no-console */
    console.log(`\n=== eval-b (${BACKEND}) ===`);
    console.log(`  exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  stderr (tail):\n${r.stderr.slice(-1500)}`);
    /* eslint-enable no-console */

    expect(r.code).toBe(0);
    for (const { file, match } of EXPECTED) {
      expect(workspace.exists(file)).toBe(true);
      expect(workspace.read(file)).toMatch(match);
    }
  });
});
