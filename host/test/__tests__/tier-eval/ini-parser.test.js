/** @manifest
 * {
 *   "test_id": "ini-parser",
 *   "test_version": "v1",
 *   "primary_axis": "spec_precision",
 *   "secondary_axes": ["stateful_logic"],
 *   "suite_layer": "B",
 *   "difficulty_band": "hard",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Drop if t16 pass rate ≥85% across two consecutive confirmatory sweeps.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": [],
 *   "introduced_in": "1.21",
 *   "notes": "H4 hand-authored — axis was TBD-post-pilot per PLAN.md; locked at authoring time as spec_precision + stateful_logic via an INI-style config parser. Probes line-by-line state tracking under edge surface (top-level keys, comments, blank lines, quoted values with internal '=', duplicate keys, section reentry). Distinct from existing csv-parser/json-schema-validate by virtue of the section-state-machine pattern."
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import fs from 'node:fs';
import path from 'node:path';
import { spawnSync } from 'node:child_process';
import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { parseIni } from './ini-parser.js';

// Empty input → empty top-level section only
assert.deepEqual(parseIni(''),    { '': {} }, 'empty input');
assert.deepEqual(parseIni('   '), { '': {} }, 'whitespace-only input');
assert.deepEqual(parseIni('\\n\\n\\n'), { '': {} }, 'blank lines only');

// Top-level keys (no section header)
assert.deepEqual(
  parseIni('foo=bar\\nbaz=qux'),
  { '': { foo: 'bar', baz: 'qux' } },
  'top-level keys go under empty-string section'
);

// Single section
assert.deepEqual(
  parseIni('[main]\\nfoo=1\\nbar=2'),
  { '': {}, main: { foo: '1', bar: '2' } },
  'single section'
);

// Multiple sections
assert.deepEqual(
  parseIni('[a]\\nx=1\\n[b]\\ny=2'),
  { '': {}, a: { x: '1' }, b: { y: '2' } },
  'two sections'
);

// Mixed: top-level keys + section keys
assert.deepEqual(
  parseIni('top=yes\\n[s]\\nin=here'),
  { '': { top: 'yes' }, s: { in: 'here' } },
  'top-level then section'
);

// Comments: ; and # at line start
assert.deepEqual(
  parseIni('; comment\\nfoo=bar\\n# another\\nbaz=qux'),
  { '': { foo: 'bar', baz: 'qux' } },
  'line-leading semicolon and hash comments'
);

// Comments must be at the start of a line; '#' inside a value is NOT a comment
assert.deepEqual(
  parseIni('color=#ff0000'),
  { '': { color: '#ff0000' } },
  'hash inside value is part of value'
);

// Whitespace around key and value is trimmed
assert.deepEqual(
  parseIni('  spaced  =  value  '),
  { '': { spaced: 'value' } },
  'trim whitespace around key and value'
);

// '=' inside value: only the FIRST '=' is the separator
assert.deepEqual(
  parseIni('expr=a=b=c'),
  { '': { expr: 'a=b=c' } },
  'only first = splits key from value'
);

// Quoted value: surrounding double quotes are stripped, and any '#'/';' inside is preserved
assert.deepEqual(
  parseIni('msg="hello; world"'),
  { '': { msg: 'hello; world' } },
  'double-quoted value preserves semicolon'
);
assert.deepEqual(
  parseIni('path="/etc/conf"'),
  { '': { path: '/etc/conf' } },
  'double-quoted simple value strips quotes'
);

// Empty value
assert.deepEqual(
  parseIni('empty='),
  { '': { empty: '' } },
  'empty value after ='
);

// Duplicate keys: LATER wins
assert.deepEqual(
  parseIni('foo=1\\nfoo=2\\nfoo=3'),
  { '': { foo: '3' } },
  'duplicate keys: later overwrites earlier'
);

// Section reentry: keys merge into the same section object
assert.deepEqual(
  parseIni('[s]\\na=1\\n[t]\\nb=2\\n[s]\\nc=3'),
  { '': {}, s: { a: '1', c: '3' }, t: { b: '2' } },
  'section reentry merges keys'
);

// Section-reentry duplicate-key: LATER wins across the merged result
assert.deepEqual(
  parseIni('[s]\\na=1\\n[t]\\nb=2\\n[s]\\na=99'),
  { '': {}, s: { a: '99' }, t: { b: '2' } },
  'reentry overwrites prior key'
);

// Section header with surrounding whitespace
assert.deepEqual(
  parseIni('  [main]  \\nfoo=bar'),
  { '': {}, main: { foo: 'bar' } },
  'section header with surrounding whitespace'
);

// Lines without '=' (and not section/comment) are ignored
assert.deepEqual(
  parseIni('foo=1\\njust a stray line\\nbar=2'),
  { '': { foo: '1', bar: '2' } },
  'malformed lines are ignored'
);

// CRLF line endings
assert.deepEqual(
  parseIni('foo=1\\r\\n[s]\\r\\nbar=2'),
  { '': { foo: '1' }, s: { bar: '2' } },
  'CRLF line endings'
);

// Realistic mixed input
{
  const input = [
    '; global config',
    'app=demo',
    'version=1.0',
    '',
    '[server]',
    'host=localhost',
    'port=8080',
    '# auth subsection follows',
    '[auth]',
    'token="secret;ish"',
    'realm=app=prod',     // value contains '='
    '[server]',           // re-enter server
    'host=production.example',
  ].join('\\n');
  assert.deepEqual(parseIni(input), {
    '': { app: 'demo', version: '1.0' },
    server: { host: 'production.example', port: '8080' },
    auth: { token: 'secret;ish', realm: 'app=prod' },
  }, 'realistic mixed input');
}
`;

const PROMPT = `\
Create ini-parser.js that exports \`parseIni(text)\` returning a parsed
configuration object.

INI-style format:

  ; comment line (semicolon)
  # comment line (hash)
  foo=bar               (top-level key)

  [section]
  key=value             (key inside section)

  [other]
  another=thing

Output shape:
  An object whose keys are section names. Top-level keys (those before any
  section header) live under the empty-string section "". Every parsed
  output must contain the empty-string section, even if empty.

  Example:
    parseIni('foo=bar\\n[s]\\nx=1') →
      { '': { foo: 'bar' }, s: { x: '1' } }

Rules:
  - Trim whitespace around keys, values, and section names.
  - Section names are case-sensitive; keys are case-sensitive.
  - Comments: a line whose FIRST non-whitespace character is ';' or '#' is
    a comment and is ignored. A '#' or ';' INSIDE a value is part of the
    value, not a comment.
  - Only the FIRST '=' on a line splits key from value. So
    \`expr=a=b=c\` parses to key='expr', value='a=b=c'.
  - Empty value (\`key=\`) is allowed and yields the empty string.
  - Double-quoted values: if the value (after trimming) is wrapped in
    matching double quotes, strip the outer quotes and use the inner
    string verbatim (do not interpret escapes).
  - Duplicate keys within the same section: the LATER assignment wins.
  - Section reentry: if a section header repeats, subsequent keys merge
    into that section's existing object (still applying "later wins").
  - Lines that are not blank, not comments, not section headers, and
    contain no '=' must be silently ignored (do not throw).
  - Accept both '\\n' and '\\r\\n' line endings.

All values returned are strings. Do not coerce numbers or booleans.

Then ensure \`node verify.js\` exits 0. Do not edit verify.js.`;

const CLAW_TIMEOUT = 240_000;

describe(`ini-parser: line-by-line config parser with section reentry (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw solves the task', { timeout: CLAW_TIMEOUT + 20_000 }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel, timeoutMs: CLAW_TIMEOUT });

    const targetExists = workspace.exists('ini-parser.js');
    let post = null;
    if (r.code === 0 && targetExists) {
      post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
        encoding: 'utf8',
        timeout: 10_000,
      });
    }
    const passed = r.code === 0 && targetExists && post?.status === 0;

    console.log(`\n=== ini-parser (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);
    if (post) console.log(`  verify: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    writeAssertionResult(r.runDir, {
      passed,
      claw_exit: r.code,
      target_file_exists: targetExists,
      post_status: post?.status ?? null,
      post_stderr_tail: post?.stderr?.slice(0, 800) ?? null,
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(targetExists, true, 'ini-parser.js must be created');
    assert.equal(post?.status, 0, `verify.js failed:\n${post?.stderr?.slice(0, 800)}`);
  });
});
