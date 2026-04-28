# Model A/B Eval: qwen3-coder vs qwen3.6-35B

**Date:** 2026-04-27  
**Stack:** llama-server + `claw.gbnf` grammar, identical sampler settings, same bridge route (`anthropic/claw-llama`)

| | Phase A | Phase B |
|---|---|---|
| Model | Qwen3-Coder-30B-A3B Q6_K_XL | Qwen3.6-35B-A3B Q4_K_XL |
| Thinking mode | No | Yes (tokens hidden by claw) |

---

## Results

Both models: **4/4 pass, 0 failures, 0 skips.**

### Latency

| Test | qwen3-coder | qwen3.6-35B |
|---|---|---|
| Tool-wrap median (N=10) | **399 ms** | 1306 ms — 3.3× slower |
| agent-single | **2088 ms** | 3954 ms — 1.9× slower |
| agent-parallel (3 files) | **7808 ms** | 10517 ms — 1.35× slower |

The gap compresses as tasks grow. A real coding session with several tool calls lands around **1.5–2× slower** end-to-end. The main driver is qwen3.6's thinking mode: reasoning tokens are hidden but still generated on every request, even trivial ones.

### Tool-call wrapping

Both score **10/10 (1.00)** under the grammar — no compliance issues with qwen3.6's native tool format.

### Prose density

qwen3-coder passes with newlines=5 and bullets=3 (exactly at threshold). qwen3.6 writes ~40% more text with more structure (avg newlines=7.3). Both pass.

**Notable:** qwen3-coder passes prose-density under llama-server + grammar. This means the `it.skip` in `backend-ab/eval-c-prose.test.js` is an **Ollama-backend issue, not a model issue** — the smush doesn't reproduce through the llama-server stack.

---

## Verdict

**qwen3-coder stays as the claw-code daily driver.** Identical correctness, 1.5–3× faster per call, purpose-built for code. The GBNF grammar neutralises any tool-format edge from the larger model.

**qwen3.6-35B** is worth reaching for when output depth beats speed — documentation, research, reasoning-heavy tasks. Consider a dedicated on-demand plist for those cases.

**Next experiment worth running:** qwen3.6-35B with thinking disabled, to see the latency floor without the reasoning overhead.
