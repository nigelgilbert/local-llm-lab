# W4 classifier prompt — agentic Pass 1

You are classifying a single agent-loop run against a frozen 6-class
taxonomy. You will be given:

1. The run's `w4-packet.md` (run summary, iteration table, selected
   excerpts, files touched).
2. The frozen taxonomy at `host/llama-server/docs/W4-TAXONOMY.md`.

## Output format

A single CSV row appended to `host/llama-server/docs/W4-pass1-agent.csv`
with header
`run_id,class,primary_signal,justification`.

`class` is one letter from {A, B, C, D, E, F}. Use the exact taxonomy
labels — not synonyms.

`primary_signal` is the iteration index (or comma-separated indices) where
the trace evidence is clearest, plus the field/value that distinguishes
the class. Examples:
- `iter=4,5,6: result_error_signature='AssertionError'×3, no workspace_changed=true between`
- `iter=2: result_error_class='module_not_found'; iter=3,4 spent on package.json edits`
- `iter=8: input_tokens=49000 (~75% of ctx), reread README.md from iter=2 with no intervening edit`
- `iter=6,7,8: same arg_hash, result_changed_vs_previous_same_call=false, workspace_changed=false`
- `iter=3: model_elapsed_ms=180000 (cell p90 was 22000), iter_count=4 (cell p75 was 6)`

`justification` is one sentence (≤ 160 chars).

## Rules

1. **Earliest identifiable root cause wins.** If wrong-module-shape (B)
   causes a verify-loop (A), label it B unless the module issue is
   incidental and verify-loop dominates the iteration count.
2. **Class F counts toward the unclassified rate.** Use it only for
   genuinely unidentifiable cases — not as a release valve when classes
   A–E are all partial matches.
3. **Look at all the trace evidence — but if you find sufficient signal
   for one class within the first 3 iterations, stop and label.**
4. Do NOT cross-reference other runs, other classifications, or the
   sampler arm. Classify each run on its own merits.

## Process

1. Read the frozen taxonomy.
2. Read the run's packet.
3. Walk the iteration table from top to bottom.
4. Apply the earliest-root-cause rule.
5. Emit the CSV row.

If trace evidence is insufficient (very short trace, censored run, missing
fields, ambiguous signature), emit class F with a clear `primary_signal`
explaining the missing evidence (e.g., `iter_count=2,
terminal_status=harness_error: claw exited before any tool call`).
