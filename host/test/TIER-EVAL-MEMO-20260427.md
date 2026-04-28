# Memo: Tier eval run — 2026-04-27

## What we ran

Three tiers, one suite of 8 tests each, two passes:

1. **Baseline pass** — Qwen3-14B (16 GB) / Qwen3-30B-A3B-Instruct MoE (32 GB) /
   Qwen3-Coder-30B Q6_K_XL (64 GB), all on `repeat-penalty=1.2`.
2. **Fix pass** — same models, `repeat-penalty=1.05`.

A side experiment swapped tier-16 to Qwen2.5-Coder-14B-Instruct-Q4_K_M and was
rejected mid-run.

## Result

| Tier | Baseline | After fix | Notes |
|------|----------|-----------|-------|
| 16   | 5 / 8    | **8 / 8** | one-line plist change took it from worst to clean sweep |
| 32   | 7 / 8    | 7 / 8     | prose-quality still flaky (newlines 5/2/5, was 2/2/2) |
| 64   | 7 / 8    | 7 / 8     | prose-quality unchanged (newlines 2/2/2, was 2/5/2) |

Raw transcripts:
- [TIER-EVAL-RESULTS-20260427-2034.md](TIER-EVAL-RESULTS-20260427-2034.md) — baseline
- [TIER-EVAL-RESULTS-20260427-2056.md](TIER-EVAL-RESULTS-20260427-2056.md) — Qwen2.5-Coder side experiment (rejected)
- [TIER-EVAL-RESULTS-20260427-2059.md](TIER-EVAL-RESULTS-20260427-2059.md) — fix pass

## What changed (committed)

- `host/llama-server/launchd/com.home-llm-lab.llama-server.plist` —
  `repeat-penalty 1.2 → 1.05`. Comment added pointing at the TODO memo.
- `host/llama-server/models.conf` — comment-only annotation logging the
  Qwen2.5-Coder rejection so we don't repeat it.
- `host/llama-server/TODO-PROSE-SMUSH.md` — new TODO memo capturing the
  remaining tier-32 / tier-64 prose smush, with an updated experiment trail.
- `host/test/run-tier-eval.sh` — `set -o pipefail` around the docker run so
  per-tier exit codes propagate truthfully.
- `host/test/TIER-EVAL-REPORT.md` — updated with the after-fix scoreboard
  and the Qwen2.5-Coder writeup.

## Bugs fixed during the run

1. **`declare -A` on macOS bash 3.2** — orchestrator died on first invocation;
   replaced with indirect-variable lookup `tier_rc_var()`.
2. **`launchctl bootstrap` race after `bootout`** — `Bootstrap failed: 5`
   because the install script's bootout returns before the agent fully exits.
   Added an explicit "wait until `launchctl print` fails" loop in the
   orchestrator before invoking `install`.
3. **Stale Docker image** — the test image baked an `entrypoint.sh` without
   the `tier-eval` case, so the first real pass executed every test under
   `__tests__/` instead of just the tier-eval subset. Rebuilt with
   `docker compose build`. `entrypoint.sh` is `COPY`'d, not bind-mounted —
   any future change to it needs a rebuild.
4. **`| tee` swallowing `docker compose` exit code** — the per-tier
   "Exit code: 0" was lying (tier-16 had 3 fails but reported 0). Fixed with
   `set -o pipefail`. Visible in the fix-pass results.

## Key findings

- **`repeat-penalty=1.2` over `repeat-last-n=256` was over-suppressing two
  classes of recurring tokens at once.** First, `\n` (8–15 occurrences in a
  structured 250-word reply, all in the penalty window) — that's the prose
  smush. Second, the wrapper-format chars `<`, `>`, `"`, `{`, `}` that recur
  in `<tool_call>{"name":...,"arguments":{...}}</tool_call>` — that's why
  tier-16 was hitting `stop=max_tokens` on every wrap test. Lowering the
  penalty to 1.05 released both at once. tier-16 went from 5/8 → 8/8 with no
  other change.
- **Qwen2.5-Coder-14B is not a drop-in for tier-16.** It emits Hermes-style
  tool calls (`<|tool_call_begin|>`), which `claw.gbnf` blocks. Under our
  grammar the model dives into the prose branch and ends the turn cleanly —
  claw thinks "done" and exits without writing files. 1/8 pass, only TTFT.
  Keep the 8.4 GB GGUF on disk; not currently usable.
- **Tier-32 (MoE, 3B active) remains the speed king on agent tasks.**
  `hello.py` write 1.4 s, `fib.js` self-test 6.9 s, refactor 8.1 s — all
  faster than tier-64. tier-64 only beats it on raw TTFT (84 ms vs 119 ms
  median), since prefill activates all experts.
- **The smush bug is not a single phenomenon.** The 14B fixes with sampler;
  the MoE half-fixes; the 30B coder doesn't fix at all. The differential
  rules out sampler as the *only* cause and points at the claw renderer or
  chat template for the residual cases. Next-step diagnostic is documented
  in [`host/llama-server/TODO-PROSE-SMUSH.md`](../llama-server/TODO-PROSE-SMUSH.md).

## What's left

One open issue: prose-quality on tier-32 and tier-64. Tracked in the TODO
memo. Pick it up by running a direct `streamMessage()` against `claw-llama`
and byte-comparing against `runClaw()` output for the same prompt.
