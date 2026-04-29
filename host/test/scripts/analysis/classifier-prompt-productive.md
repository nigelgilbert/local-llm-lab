# W4 productive-iteration classifier prompt — agentic Pass 1 (successful-tail)

You are classifying a single agent-loop run from the **successful-tail**
stratum (`terminal_status == "done"` AND `exit_code == 0`). The run
finished correctly but used many iterations — the question is *what kind
of long-but-successful pattern* it is. You will be given:

1. The run's `w4-packet.md` (run summary, iteration table, selected
   excerpts, files touched).
2. The frozen productive-iteration taxonomy at
   `host/llama-server/docs/W4-TAXONOMY-PRODUCTIVE.md` (classes P1–P5).

This is a *parallel* taxonomy to the failure taxonomy in W4-TAXONOMY.md
(A–F). Do **not** apply A–F here. Use only P1–P5.

## Output format

A single CSV row appended to
`host/llama-server/docs/W4-pass1-productive-agent.csv` with header
`run_id,class,primary_signal,justification`.

`class` is one letter+number from {P1, P2, P3, P4, P5}. Use the exact
taxonomy labels.

`primary_signal` is the iteration index range (or indices) where the
pattern is clearest, plus the field/value that distinguishes the class.
Examples:
- `iters=9-13: five consecutive bash with workspace_changed=False, then iter=18 write_file output_tokens=1711` → P2
- `iters=3-11: alternating write/edit with bash-verify every 2 iters; ws_changed at 3,5,8,10` → P1
- `iter_count=20, workspace_changed_count=8, write_file count=6, edit_file count=2` → P4
- `iters=18-25: 6 trailing iterations of bash + read with no workspace_changed and no error_signature change` → P3

`justification` is one sentence (≤ 160 chars).

## Rules

1. **Earliest dominant pattern wins.** A run may show traces of multiple
   classes; pick the one that explains the *most* iteration count.
2. **P5 counts toward the unclassified rate.** Use it only for genuinely
   unidentifiable cases — not as a release valve when P1–P4 are all
   partial matches.
3. **Walk the iteration table top to bottom.** Apply the earliest
   dominant pattern.
4. Do NOT cross-reference other runs, other classifications, or the
   sampler arm. Classify each run on its own merits.

## Process

1. Read the frozen taxonomy at `host/llama-server/docs/W4-TAXONOMY-PRODUCTIVE.md`.
2. Read the run's packet.
3. Walk the iteration table from top to bottom looking for: long
   bash-only stretches (P2 signal), tight write/bash alternation (P1
   signal), trailing pure-verify tail (P3 signal), high write_file count
   without proportional edit_file (P4 signal).
4. Apply the earliest-dominant-pattern rule.
5. Emit the CSV row.

If trace evidence is insufficient (very short trace, censored run,
missing fields, ambiguous signature), emit P5 with a clear
`primary_signal` explaining the missing evidence.
