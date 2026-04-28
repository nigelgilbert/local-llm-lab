# Writing good evals — a brief field guide

Notes for the lab. We've felt every one of these the hard way:

- An "always-pass" eval (every model 5/5) gives no signal — kill it.
- An "always-fail" eval (timeouts on the strongest model too) is measuring the harness, not the model — fix it before trusting it.
- An n=1 verdict is a coin flip on agentic tasks. Run more, or don't conclude.

Distilled from SWE-bench Verified, METR's task-design memos, BigCodeBench, LiveCodeBench, Aider's leaderboard methodology, EvalPlus, Inspect AI, and the eval cookbooks at OpenAI/Anthropic.

## Eight rules

**1. Verify the eval before you trust the model.** SWE-bench's 2024 audit found ~30% of original tasks were under-specified or had broken tests; *Verified* is the human-screened survivor set. Hand-solve every test from prompt + seed *yourself* in <10 minutes before checking it in. If you have to guess intent, the prompt is broken. → see [SWE-bench Verified](https://openai.com/index/introducing-swe-bench-verified/).

**2. Run n≥5; report pass-rate and Wilson interval, not pass@1.** METR's RE-Bench and Inspect AI both bake repeated trials in. Anything in the [0.2, 0.8] band at n=5 needs more n before you call a winner. Single-shot verdicts on agentic tasks are noise. → see [METR R&D capabilities](https://metr.org/blog/2024-11-22-evaluating-r-d-capabilities-of-llms/).

**3. Aim for the discriminative middle: strong ~60–90%, weak <30%.** LiveCodeBench and BigCodeBench retired toy snippets in 2024 because HumanEval saturated at ~99%. If your strongest model passes 5/5 *and* the smallest also passes ≥3/5, the test isn't separating anything. → see [BigCodeBench](https://bigcode-bench.github.io/), [LiveCodeBench](https://livecodebench.github.io/).

**4. Separate agent-noise from capability-noise.** A 240s timeout on the strongest model isn't "model can't code" — it's claw retry-storming. Aider's leaderboard reports edit-format failures separately from logic failures for exactly this reason. Log token counts, tool-call counts, and timeout reason; if the strongest model times out >25% of runs, the test is measuring the harness. → see [Aider polyglot leaderboard](https://aider.chat/docs/leaderboards/).

**5. Pick one sampling regime per suite.** Temperature-0 for capability (low variance, masks brittleness); realistic temperature for robustness (exposes prompt sensitivity). Don't mix in the same suite — you'll average across two distributions and learn nothing. → see [OpenAI evals cookbook](https://cookbook.openai.com/examples/evaluation/getting_started_with_openai_evals).

**6. Calibrate difficulty with explicit knobs.** SWE-bench Verified tags tasks by estimated human time. Useful local knobs: *files to read before writing*, *plausible-but-wrong distractor code in the seed*, *edge cases not mentioned in the prompt*, *requires deleting* (consistently harder than adding). Tier tests by `files × hidden-edges`; 1×0 is hello-world, 3×2 is your sweet spot for the 7B–30B band.

**7. Assert on behavior, never on text.** EvalPlus showed thin test suites let wrong-for-the-right-reason solutions through. For agents, watch the dual: right-for-the-wrong-reason — model patches the wrong file but the harness imports the wrong file too and passes anyway. Always `import` the prompt-specified path; assert with adversarial inputs the prompt didn't mention; never `grep` for keywords. → see [EvalPlus](https://evalplus.github.io/).

**8. Don't leak the answer.** Inspect AI and METR both call out: filenames, comments, and assertion messages leak intent. If a seed is named `buggy_parser.js` with `// FIXME: off-by-one`, you're testing reading comprehension. Strip `TODO` / `FIXME` from seeds. Use neutral filenames. Keep assertion messages generic (`"output mismatch"`, not `"expected sorted ascending"`).

## Red flags

- Pass-rate is 0/5 or 5/5 on *every* tier → no signal, retire or harden.
- Strongest model times out >25% of runs → measuring the harness.
- Pass-rate swings >40 points between consecutive n=5 batches → flaky, not discriminative.
- A human can't solve it from the prompt + seed alone in 10 min → under-specified.
- Test passes when the model writes the fix to the wrong file → assertion too loose.
- Seed contains `TODO` / `FIXME` / hint-y comments → answer leaks.
- Assertion message contains the expected value → answer leaks.
- Post-condition depends on wall-clock, unseeded RNG, or network → non-deterministic.
- Same seed + temp=0 gives different verdicts → agent-loop nondeterminism, isolate first.
- Difficulty was set by "feels about right" not by `files × hidden-edges` → calibrate.

## How to add a test in this repo

1. Drop a new `__tests__/tier-eval/<name>.test.js` mirroring `refactor.test.js`'s shape.
2. Hand-solve it from the prompt before committing (rule #1).
3. Run it ≥5 times against the production tier (64) — must be ≥4/5. Then ≥3 times on tier-32, tier-16. Verify the pass-rate gradient.
4. Rebuild the test image: `(cd host/test && docker compose build)`.
5. Add it to the `tier-eval` suite list in `run-tier-eval.sh` header comment for posterity.
6. If pass-rate is the same on every tier, retire it.
