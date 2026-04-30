// Dependency graph: implement topological sort with cycle detection.
//
// Difficulty knob: graph algorithm + edge-case correctness. Inputs include
// a DAG (must produce a valid topological order), a graph with a cycle
// (must throw with "cycle" in the message), and a disconnected graph
// (must include every node). The "valid order" check is structural — any
// topo order is accepted — so the model can pick DFS or Kahn's, but it
// must handle all three cases.
//
// Target: hard.

/** @manifest
 * {
 *   "test_id": "dependency-graph",
 *   "test_version": "v1",
 *   "primary_axis": "stateful_logic",
 *   "secondary_axes": [
 *     "spec_precision"
 *   ],
 *   "suite_layer": "B",
 *   "difficulty_band": "medium",
 *   "oracle_type": "public_verifier",
 *   "keep_drop_rule": "Keep \u2014 graph algorithm with cycle/disconnected/DAG branches.",
 *   "expected_tier_signature": "monotonic_improving",
 *   "known_confounds": []
 * }
 */

import { describe, it, beforeEach } from 'node:test';
import assert from 'node:assert/strict';
import { spawnSync } from 'node:child_process';
import fs from 'node:fs';
import path from 'node:path';

import { runClaw, writeAssertionResult } from '../../lib/claw.js';
import * as workspace from '../../lib/workspace.js';
import { clawModel, TIER_LABEL } from '../../lib/tier.js';

const VERIFY_JS = `\
import assert from 'node:assert/strict';
import { topoSort } from './graph.js';

function isValidTopoOrder(graph, order) {
  const pos = new Map(order.map((n, i) => [n, i]));
  for (const [node, deps] of Object.entries(graph)) {
    if (!pos.has(node)) return false;
    for (const d of deps) {
      if (!pos.has(d)) return false;
      // d must come BEFORE node (d is a prerequisite)
      if (pos.get(d) >= pos.get(node)) return false;
    }
  }
  return order.length === Object.keys(graph).length;
}

// DAG: a depends on b,c; b depends on c; c depends on nothing; d depends on nothing.
const dag = { a: ['b', 'c'], b: ['c'], c: [], d: [] };
const order1 = topoSort(dag);
assert.ok(Array.isArray(order1),                'returns array for DAG');
assert.ok(isValidTopoOrder(dag, order1),        'returns a valid topo order');

// Disconnected graph: two independent chains.
const disc = { a: ['b'], b: [], x: ['y'], y: [] };
const order2 = topoSort(disc);
assert.ok(isValidTopoOrder(disc, order2),       'handles disconnected graph');

// Cycle: a -> b -> a.
const cyclic = { a: ['b'], b: ['a'] };
assert.throws(() => topoSort(cyclic), /cycle/i, 'throws on cycle with message containing "cycle"');

// Self-loop is a cycle.
const selfLoop = { a: ['a'] };
assert.throws(() => topoSort(selfLoop), /cycle/i, 'self-loop is a cycle');

// Empty graph.
assert.deepEqual(topoSort({}), [], 'empty graph returns empty array');

// Single node, no deps.
assert.deepEqual(topoSort({ a: [] }), ['a'], 'single node');
`;

const PROMPT =
  'Create graph.js that exports `topoSort(graph)`. The input is an object ' +
  'mapping each node name to an array of node names it depends on (its ' +
  'prerequisites). Return an array of all node names in a valid ' +
  'topological order: a node must appear after all of its prerequisites. ' +
  'If the graph contains a cycle (including a self-loop), throw an Error ' +
  'whose message contains the word "cycle". An empty graph returns an ' +
  'empty array. Then ensure `node verify.js` exits 0. Do not edit verify.js.';

const TIMEOUT = 300_000;

describe(`dependency-graph: topological sort with cycle detection (tier=${TIER_LABEL})`, () => {
  beforeEach(() => {
    workspace.reset();
    fs.writeFileSync(path.join(workspace.WORKSPACE, 'verify.js'), VERIFY_JS);
  });

  it('claw implements topoSort handling DAG, cycle, and disconnected', { timeout: TIMEOUT }, async () => {
    const r = await runClaw({ prompt: PROMPT, model: clawModel });

    console.log(`\n=== dependency-graph (${TIER_LABEL}) ===`);
    console.log(`  claw: exit=${r.code} elapsed=${r.elapsedMs}ms files=${JSON.stringify(workspace.list())}`);
    if (r.code !== 0) console.log(`  claw stderr (tail):\n${r.stderr.slice(-1500)}`);

    const targetExists = workspace.exists('graph.js');
    const post = spawnSync('node', [path.join(workspace.WORKSPACE, 'verify.js')], {
      encoding: 'utf8',
      timeout:  5_000,
    });

    console.log(`  node post-fix: exit=${post.status} stderr=${post.stderr.slice(0, 400).trim()}`);

    writeAssertionResult(r.runDir, {
      passed: r.code === 0 && targetExists && post.status === 0,
      claw_exit: r.code,
      target_file_exists: targetExists,
      post_status: post.status,
      post_stderr_tail: post.stderr.slice(0, 800),
    });

    if (r.terminal_status === 'timeout') assert.fail(`claw timed out after ${r.elapsedMs}ms (terminal_status=timeout)`);

    assert.equal(r.code, 0, 'claw must exit cleanly');
    assert.equal(targetExists, true, 'graph.js must be created');
    assert.equal(post.status, 0, `verify.js failed:\n${post.stderr.slice(0, 800)}`);
  });
});
