# TODO — markdown smush in prose output

Status: **closed 2026-04-27** (model side). Bug localized to claw's terminal
renderer; eval split into raw-bridge (assertive) and claw-rendered
(informational). Remaining fix is upstream in claw, not in this repo.

## Resolution

The smush reproduces **only when output flows through claw's terminal
markdown renderer**. The underlying model output is fine.

Evidence chain:

1. **Same prompt, same model, same sampler, same system prompt:** smushes
   via `runClaw()`, doesn't smush via `streamMessage()` against the bridge.
   Documented in
   [`host/test/__tests__/backend-ab/eval-c-prose.test.js`](../../test/__tests__/backend-ab/eval-c-prose.test.js)
   header.
2. **Visual fingerprint matches a renderer issue, not a model issue.**
   tier-64 sample: `What Are React Components?React components are…` —
   the `## ` header marker is gone but no `\n` was preserved in its
   place. That's a markdown→ANSI renderer dropping the line-break
   alongside the header glyph, not a model emitting glued tokens.
3. **Sampler intervention only helped the 14B.** Lowering
   `repeat-penalty 1.2 → 1.05` fixed tier-16 (where the sampler was
   actually suppressing `\n`) and was a no-op on tier-64 (where the
   model already emitted newlines and claw was eating them).
4. **MODEL-AB-RESULTS.md** confirms qwen3-coder passes prose-density
   under the llama-server stack at the threshold — borderline because
   the model output is *barely* enough structure for claw's renderer
   not to fully collapse it.

## What changed in the eval suite

[`host/test/__tests__/tier-eval/prose-quality.test.js`](../../test/__tests__/tier-eval/prose-quality.test.js)
now has two sub-suites:

- **`prose quality via raw bridge`** — assertive. Counts newlines/bullets
  in the streamed text directly from `streamMessage()`. Catches
  model-side regressions (sampler over-suppressing `\n`, template
  problems, etc.).
- **`prose quality via claw renderer`** — informational only. Same
  prompt via `runClaw()`, counts reported but no assertions. Visibility
  into what the user sees, without bisecting samplers to fix a
  downstream renderer bug.

## What's left

Not for this repo. Possible upstream paths in claw-code:

- Investigate claw's `with_output_style` builder / markdown→ANSI
  renderer. The pattern "`## ` removed but no `\n` substituted" is the
  classic pre-tokenization-strip bug.
- Forking claw to fix the renderer is in scope for
  [`client/claw-code/`](../../client/claw-code/) at some point, but the
  raw-bridge eval gives us coverage in the meantime.

## Sampler history (kept for reference)

`repeat-penalty 1.2 → 1.05` (2026-04-27, plist):

| Tier | newlines (3 runs) | bullets (3 runs) | Status |
|------|-------------------|------------------|--------|
| 16 (Qwen3-14B)              | **8 / 10 / 10** | **4 / 6 / 6** | model-side fixed ✔ |
| 32 (Qwen3-30B-A3B-Instr MoE)| 5 / 2 / 5       | 3 / 0 / 3     | renderer-side, not model |
| 64 (Qwen3-Coder-30B)        | 2 / 2 / 2       | 0 / 0 / 0     | renderer-side, not model |

The 14B's sampler-side improvement is preserved. Tier-32/64 numbers
through the claw renderer are now reported as informational; the
raw-bridge sub-suite is what asserts model-side behavior.

## Do NOT touch

`grammars/claw.gbnf`. It already permits `\n`
(`prose-char ::= [^<] | "<" [^t]`). Tightening grammar won't help and
risks regressing the tool-call wrap rate that's currently 100% on
tier-32/64. (Separate planned change to drop the optional `prelude` is
tracked in [`TODO-GRAMMAR-PRELUDE.md`](TODO-GRAMMAR-PRELUDE.md) — that's
about wrap-rate / token budget on tier-16, not about prose smush.)
