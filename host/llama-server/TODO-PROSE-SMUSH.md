# TODO — markdown smush in prose output

Status: **partially fixed** (2026-04-27). Open for tier-32 and tier-64.

## Update 2026-04-27 — `repeat-penalty 1.2 → 1.05` experiment

Applied. Results from `TIER-EVAL-RESULTS-20260427-2059.md`:

| Tier | newlines (3 runs) | bullets (3 runs) | Status |
|------|-------------------|------------------|--------|
| 16 (Qwen3-14B)              | **8 / 10 / 10** | **4 / 6 / 6** | **fixed** ✔ |
| 32 (Qwen3-30B-A3B-Instr MoE)| 5 / **2** / 5   | 3 / **0** / 3 | partial — still ✖ |
| 64 (Qwen3-Coder-30B)        | 2 / 2 / 2       | 0 / 0 / 0     | unchanged — still ✖ |

Hypothesis A is **confirmed for the 14B**, **partially true for the MoE**, and
**disproved for the 30B coder**. The penalty was holding back `\n` *and* the
wrapper-format chars (`<`, `>`, `"`, `{`, `}`) on the 14B — bonus win:
tier-16's tool-discipline went 0/10 → 10/10 and tool-roundtrip 2/20 → 20/20
in the same change. tier-32 sees variance reduction; tier-64 is unchanged.

### What's left

For tier-64 specifically, the smush is deterministic and persistent regardless
of the sampler. Move to **Hypothesis B** (claw renderer) next:

- Bypass claw and call `host/test/lib/bridge.js` `streamMessage()` directly
  with the same prose prompt against `claw-llama`. If the raw bridge stream
  contains `\n`, claw is eating them in the renderer.
- If the bridge is also missing `\n`, escalate to **Hypothesis C** (chat
  template). The qwen3-coder template applied by llama-server may not be
  priming the assistant turn with a leading newline.

Tier-32 likely has the same B/C cause as tier-64, layered on top of a residual
sampler effect — hence its "partial" pattern.

## Symptom

When asked for structured markdown (headers, bullets, paragraphs) the model
produces all the structure tokens but skips the `\n` separators. Output
collapses into a single-line wall of text. Sample from tier-64
(Qwen3-Coder-30B Q6_K_XL) on 2026-04-27:

> `React Components ExplainedReact components are the fundamental building blocks of any React application…What Are React Components?• Components are functions or classes…`

The bullets and headers are *there* — just glued. This affects production
(tier-64) and tier-32; tier-16 has higher variance and sometimes formats
correctly.

Reproduce: `EVAL_TIERS="64" ./host/test/run-tier-eval.sh`, look at
`=== prose-quality (tier-64) ===` block. Pass threshold is `\n ≥ 5` per run.

## Evidence

Per-tier newline counts across the 3 prose-quality runs from the 2026-04-27
eval (`host/test/TIER-EVAL-RESULTS-20260427-2034.md`):

| Tier | Model                              | Run 1 | Run 2 | Run 3 |
|------|------------------------------------|-------|-------|-------|
| 16   | Qwen3-14B Q4_K_M                   | 17    | 10    | 4     |
| 32   | Qwen3-30B-A3B-Instruct-2507 MoE    | 2     | 2     | 2     |
| 64   | Qwen3-Coder-30B Q6_K_XL            | 2     | 5     | 2     |

The variance — tier-64 going 2 → 5 → 2 inside a single eval — is the
load-bearing signal. Sampler bugs are stochastic; grammar / renderer bugs
would be deterministic across runs.

## Candidate causes (ranked by likelihood)

**A. Sampler (most likely).** `repeat-penalty=1.2` over `repeat-last-n=256`
is set in `launchd/com.home-llm-lab.llama-server.plist`. `\n` appears 8–15
times in a structured 250-word response — all inside the 256-token window.
Penalty `1.2` reduces those logits enough that the model substitutes "no
separator" mid-stream. Variance fits.

**B. claw renderer.** The eval captures `runClaw().stdout` post-render. The
renderer could be collapsing `\n\n`. Diagnostic: byte-compare the same prompt
via `host/test/lib/bridge.js`'s `streamMessage()` vs `host/test/lib/claw.js`'s
`runClaw()`. If bridge has `\n` and claw doesn't, claw is eating them.

**C. Chat template.** If qwen3-coder's template doesn't prime the assistant
turn with a leading `\n`, the model gets no signal that newlines belong in
this stream. Only worth investigating if A and B both disprove.

## Order of attack

1. ~~Lower `repeat-penalty` 1.2 → 1.05~~ — **done 2026-04-27**. Fixed tier-16
   completely; partial on tier-32; null on tier-64. See update at top.
2. **Bridge-vs-claw byte diagnostic** for tier-64 (next step). Compare a
   direct `streamMessage()` call against the same prompt through
   `runClaw()`. If the bridge has `\n` and claw doesn't, the claw renderer
   is collapsing them.
3. If (2) shows the bridge already missing `\n`: chat-template investigation
   (C).

## Do NOT touch

`grammars/claw.gbnf`. It already permits `\n`
(`prose-char ::= [^<] | "<" [^t]`). Tightening grammar won't help and risks
regressing the tool-call wrap rate that's currently 100 % on tier-32/64.
