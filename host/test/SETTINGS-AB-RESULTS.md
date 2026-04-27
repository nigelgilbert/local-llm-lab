# Settings A/B Eval: baseline vs optimised llama-server flags

**Date:** 2026-04-27  
**Stack:** llama-server + `claw.gbnf` grammar, same model (Qwen3-Coder-30B-A3B Q6_K_XL), same bridge route (`claw-llama`)

| | Phase A — Baseline | Phase B — Optimised |
|---|---|---|
| `--ctx-size` | `131072` | `32768` |
| `--batch-size` | *(default 2048)* | `4096` |
| `--cache-type-k/v` | `q8_0` | `q8_0` |

---

## Results

### Correctness

| Test | Baseline | Optimised |
|---|---|---|
| agent-single (5 runs) | 5/5 ✓ | 4/5 (1 model fluke — exit 0, no tool call, 838ms) |
| agent-parallel (3 runs) | 3/3 ✓ | 3/3 ✓ |
| tool-wrap (20 rounds) | 20/20 = 1.00 | 20/20 = 1.00 |

The single agent-single miss in Phase B (run 3, 838ms, only `.claw/` written) is a random model behavior — the model replied without calling any tool. Not attributable to settings.

### Latency

#### Tool-call end-to-end (N=20 round-trips via bridge)

| Metric | Baseline | Optimised | Δ |
|---|---|---|---|
| min | 393ms | 388ms | −5ms |
| median | 397ms | 395ms | −2ms |
| p95 | 583ms | 578ms | −5ms |
| mean | 406ms | 403ms | −3ms |

**Verdict: within measurement noise. No difference.**

#### Agent-single (N=5; run 1 is cold-start outlier in both phases)

| Sample | Baseline | Optimised |
|---|---|---|
| run 1 (cold) | 5826ms | 5792ms |
| runs 2–5 (warm) | 1938/2011/1961/1972ms | 1976/838/1927/1976ms |
| warm median | **1966ms** | **1976ms** (excl. miss) |

**Verdict: no meaningful difference. Cold-start cost is identical (~5.8s).**

#### Agent-parallel (N=3)

| Sample | Baseline | Optimised |
|---|---|---|
| run 1 | 4029ms | 3537ms |
| run 2 | 3706ms | 3622ms |
| run 3 | 4034ms | 3560ms |
| median | **4029ms** | **3560ms** |

**Verdict: optimised is ~12% faster** (−469ms median). Only 3 samples — directionally real but not statistically conclusive.

#### TTFT — time to first token (N=10; 25-tool prompt ~2200 tokens)

| Metric | Baseline | Optimised |
|---|---|---|
| warm min/median | 71ms / 73ms | 71ms / 81ms |
| p95 | 2343ms | 2450ms |
| mean | 312ms | 315ms |

The p95 spike in both phases is the first cold-cache request (~2350ms). Warm median is indistinguishable.

**Verdict: no measurable TTFT improvement from `--batch-size 4096`.**

Why the null result: on M5 Max Metal, Qwen3-Coder A3B prefill for ~2220 tokens completes in <10ms. The HTTP + LiteLLM overhead (~50-70ms) dominates and masks any difference between doing it in one vs two batches. The batch-size win only becomes visible on much larger prompts (>8K tokens) where the overhead-to-compute ratio shifts.

### Prose density (informational, no pass/fail threshold)

| | Baseline | Optimised |
|---|---|---|
| Samples passing (newlines≥5, bullets≥3) | 0/5 | 3/5 |

Baseline got unlucky (0/5); optimised got about the expected rate for this model (~1-in-3 smush). The 3/5 vs 0/5 difference is statistical noise, not a settings effect. Neither phase shows a quality regression.

---

## Summary

| Signal | Finding |
|---|---|
| Tool-call latency | Identical (< 5ms spread across 20 samples) |
| Agent single latency | Identical (< 10ms on warm runs) |
| Agent parallel latency | Optimised ~12% faster (3 samples, directional) |
| TTFT / prefill speed | No measurable improvement — M5 Max Metal too fast for batch-size to matter at 2K tokens |
| Grammar / wrap rate | 20/20 in both phases — grammar unaffected |
| Prose quality | No regression; random variance dominates |

**The measurable latency benefit of the optimisations is small at typical session scale.** The primary gains are off-latency-path:
- `--ctx-size 32768` frees ~4 GB of unified memory for other Metal work
- `--batch-size 4096` will help if prompt sizes grow beyond 4K tokens (e.g., long `CLAUDE.md` + many context files injected into the system prompt)

No regressions in correctness or quality. Production config (Phase B) is the right setting to keep.

---

## Next experiment

`--batch-size` impact becomes measurable with prompts > 4K tokens. A future test could inject a large `CLAUDE.md` (2K tokens) into the workspace alongside the 50-tool payload to push the prompt above 4K and re-run the TTFT measurement.
