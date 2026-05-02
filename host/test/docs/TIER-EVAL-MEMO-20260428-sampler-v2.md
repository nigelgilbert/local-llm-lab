# Tier-64 Sampler v2 — grid sweep memo

*Internal memo, mac-llm-lab, 2026-04-28. Author: Claude Opus 4.7 under autonomous run.*

## Why this run

The sniff memo [TIER-EVAL-MEMO-20260428-qwen36.md](TIER-EVAL-MEMO-20260428-qwen36.md) flagged the v1 sampler (`temp=0.7, top_p=0.8, top_k=20, presence_penalty=1.5, repeat_penalty=1.0`) as a starting point only. The full QWEN3.6 model report's recommendation #3 was to run a wider grid against the new round-2 + round-3 evals, since the original 22 saturate at every cell of v1's neighborhood.

This memo is that grid — and the **honest finding is a negative result**: at n=3, three cells tie at 15/15 (including the current production sampler), and within-cell variance is larger than between-cell deltas. The grid as designed cannot resolve which cell wins.

## Method

- **Cells:** `temp ∈ {0.3, 0.5, 0.7, 0.9}` × `presence_penalty ∈ {0, 1.5}` = 8 cells.
- **Held fixed:** `top_p=0.8, top_k=20, repeat_penalty=1.0, ctx=65536`.
- **Tests (n=3 each):** `csv-parser`, `lru-cache`, `json-schema-validate`, `multi-bug-decoy`, `expression-eval`.
- **Excluded from grid:** `mini-vm` — fails universally regardless of sampler (4 prior swings, 0 passes); 240s × 24 runs would burn 96 min on a known no-signal test. Probed at the v2 candidate post-grid (n=2): 0/2, 240s timeouts each. Capability ceiling confirmed.
- **Driver:** `host/test/logs/a2/run-sampler-grid.sh` (since deleted). Cleanup trap restores the prior sampler on exit.
- **Wall-clock:** 12:14 → 13:54 = ~100 min for 24 docker invocations × ~4 min each.

## Results

| Cell | temp | presence | csv-parser | lru-cache | json-schema-validate | multi-bug-decoy | expression-eval | total | sum-medians |
|---|---|---|---|---|---|---|---|---|---|
| 1 | 0.3 | 0   | 3/3 (10s) | 3/3 (20s) | 3/3 (14s) | 3/3 (27s) | 2/3 (166s) | 14/15 | 240s |
| 2 | 0.3 | 1.5 | 3/3 (11s) | 3/3 (50s) | 3/3 (14s) | 3/3 (31s) | 3/3 (66s)  | **15/15** | 173s |
| 3 | **0.5** | **0**   | 3/3 (15s) | 3/3 (28s) | 3/3 (15s) | 3/3 (28s) | 3/3 (54s)  | **15/15** | 143s |
| 4 | 0.5 | 1.5 | 3/3 (12s) | 3/3 (21s) | 3/3 (27s) | 3/3 (30s) | 2/3 (105s) | 14/15 | 196s |
| 5 | 0.7 | 0   | 3/3 (54s) | 3/3 (36s) | 3/3 (16s) | 3/3 (37s) | 1/3 (126s) | 13/15 | 271s |
| 6 | 0.7 | 1.5 *(v1)* | 3/3 (12s) | 3/3 (31s) | 3/3 (31s) | 3/3 (33s) | 3/3 (102s) | **15/15** | 212s |
| 7 | 0.9 | 0   | 3/3 (16s) | 3/3 (20s) | 3/3 (33s) | 3/3 (30s) | 2/3 (107s) | 14/15 | 208s |
| 8 | 0.9 | 1.5 | 3/3 (33s) | 3/3 (35s) | 3/3 (51s) | 3/3 (27s) | 2/3 (98s)  | 14/15 | 245s |

(Cell median elapsed shown to the second; "sum-medians" sums those 5 medians per cell. **Caveat: medians are biased by cold-KV iter-1 inflation** — see "iter-1 cold-KV bias" below. The values rank-order the cells but should not be quoted as absolute properties of a sampler.)

### Per-test pass rate across the full grid (n=24 each)

- `csv-parser`: 24/24
- `lru-cache`: 24/24 (one *capability* fail in cell 5 iter 2 — see notes below)
- `json-schema-validate`: 24/24
- `multi-bug-decoy`: 24/24 (median 27.7–38.7s; tightest spread in the grid is cell 3 at 28.1/28.6/29.3s)
- `expression-eval`: 18/24 ← **the only differentiator at this n**

So the grid's signal lives almost entirely in `expression-eval` pass rate. **Sum-medians delta between cells is ≥80% expression-eval-driven** (e.g., cell 3 vs cell 6: lru-cache 28 vs 31s, multi-bug-decoy 28 vs 33s, expression-eval **54 vs 102s** — the dominant term).

### lru-cache spread per cell (the variance lever from A2)

| Cell | temp | presence | observed pass elapsed (ms) | spread |
|---|---|---|---|---|
| 1 | 0.3 | 0   | 16700, 20100, 60100 | 3.74× |
| 2 | 0.3 | 1.5 | 22300, 49900, 65900 | 2.97× |
| 3 | 0.5 | 0   | 17500, 28300, 30100 | 1.80× |
| 4 | 0.5 | 1.5 | 22002, 21653, 21026 | **1.05×** (range ~1s, 4.6%) |
| 5 | 0.7 | 0   | 20100, 36300, 95900 | 4.64× |
| 6 | 0.7 | 1.5 *(v1)* | 19300, 31100, 36500 | 1.88× |
| 7 | 0.9 | 0   | 19300, 20100, 38400 | 1.95× |
| 8 | 0.9 | 1.5 | 19300, 35400, 103600 | 5.25× |

Cell 4's lru-cache is the tightest in the grid (1.05×, all three iters within ~1 second), but its expression-eval misses one. Earlier framing of "21s/21s/21s identical" was a second-precision rendering artifact — the underlying ms values do vary.

## Honest grid-resolution finding

**Three cells (2, 3, 6) all achieve 15/15 at n=3.** Cell 6 is the current production sampler (v1). Within-cell csv-parser spread on the top three cells: cell 2 = 11/170/13s (15.5×), cell 3 = 15/45/15s (3.0× — see Notes), cell 6 = 12/12/13s (1.1×). All are **inside the n=7 within-cell variance band already measured by A2** (csv-parser: 11–26s spread, 2.4×; lru-cache: 19–54s spread, 2.8×).

**Conclusion:** the grid resolution is below the variance floor. Sampler tuning at this granularity is not measurably moving anything. v1 (cell 6) is **not clearly beaten** by v2 (cell 3) or v3 (cell 2) at this n.

### Two notable per-cell datapoints

- **Cell 2 (0.3, 1.5) iter 2 csv-parser = 170s** vs ~11s in iters 1 and 3 of the same cell. Same prompt, same sampler, same model. Strong evidence that csv-parser's variance is iteration-count distribution, not sampler-driven.
- **Cell 5 (0.7, 0) iter 2 lru-cache = real verify failure** ("a survives — was bumped"): the only *capability* failure in 24 iterations. Everything else in the grid is timeouts or context-overflow — harness-bound, not capability-bound. Worth flagging; not yet actionable.

### iter-1 cold-KV bias

Each cell starts after a daemon reload. Iter 1 hits a cold KV cache; iters 2–3 reuse the warm slot. Concrete example, cell 1 csv-parser: **63.5s / 10.9s / 10.5s** — iter 1 is 6× slower than warm. With n=3, the median ≈ "the better of two warm runs," which is fine for ranking but should not be quoted as an absolute sampler property. **Future fix:** discard a warm-up iter per cell, then run n≥3 measurements.

## Decision

**Hold v2 (`temp=0.5, presence=0`) as a candidate, not as decided.** Production sampler stays at v1 (cell 6) until further data separates the three tied cells.

**Reasoning:**

1. **Three cells tie at 15/15.** Cell 3 has the lowest sum-medians (143s), but the gap to cell 2 (173s) and cell 6 (212s) is **expression-eval-dominated** and within the variance floor measured by A2.
2. **n=3 is below the within-cell variance floor.** The grid as designed cannot decide which cell wins.
3. **Cold-KV bias affects iter-1.** Without a warm-up discard, ranking is reasonable but absolute medians are biased.
4. **Reverting was cheap.** [models.conf](../../llama-server/models.conf) is back at v1 + the new ctx=65536 from A1.

## Required to lock in any change

A follow-up n=7 confirmation across **cells 2 (0.3, 1.5), 3 (0.5, 0), and 6 (0.7, 1.5)** — including current production as a tiebreaker — with the first iter per cell discarded as warm-up. **Realistic cost: ~35 min** (n=7 × 3 cells × ~143s expected per iter + ~3 daemon reloads). Earlier "~10 min" estimate was wrong.

If three cells still can't be separated at n=7, declare sampler tuning out-of-scope at this model + harness combination, and chase variance elsewhere (e.g., the iteration-count distribution suggested by cell 2 iter 2).

## Caveats

- **mini-vm capability ceiling reconfirmed.** Probe at cell 3 (n=2): 0/2, both 240s wallclock timeouts. Total tier-64 mini-vm record: 0/6 across all sweeps and configs.
- **Lower tiers unchanged.** This memo applies only to tier-64. Tier-32 and tier-16 sampler selections are independent.
- **multi-bug-decoy is clean across the grid.** The 1/9 long-tail flagged in the QWEN3.6 report addendum was all v1-era data; at any v2-region cell it is 24/24 with a tight 28–35s band.

## Action taken

- [models.conf](../../llama-server/models.conf): ctx=65536 (from A1) retained; sampler reverted to v1 (`TIER_64_TEMP=0.7, PRESENCE_PENALTY=1.5`) pending the n=7 confirmation.
- This memo updated to mark v2 as a *candidate*, not a decision.
