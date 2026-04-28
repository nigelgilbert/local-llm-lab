# Memo: Qwen3.6-35B-A3B sniff test on tier-64 — 2026-04-28

Continuation of [`TIER-EVAL-MEMO-20260427-evening.md`](TIER-EVAL-MEMO-20260427-evening.md).
This session sniff-tested **Qwen3.6-35B-A3B-UD-Q4_K_XL** (unsloth Dynamic 2.0,
~21 GB) as a candidate replacement for the production tier-64 model
(Qwen3-Coder-30B-A3B-Instruct UD-Q6_K_XL). All numbers are n=1 — directional,
not verdict.

## TL;DR

| Run | Sampler | Thinking | Pass | TTFT med | Tool-RT med |
|---|---|---|---|---|---|
| Baseline (Qwen3-Coder-30B prod) | temp=0.4, top_p=0.8, rep=1.05 | (off, training) | 17/20 | 81 ms | 396 ms |
| Pass 1 (3.6, claw sampler, think on) | temp=0.4, top_p=0.8, rep=1.05 | on | 15/20 | 56 ms | 1357 ms |
| Knob 1 (3.6, vendor think sampler) | temp=0.6, top_p=0.95 | on | 14/20 | 64 ms | 1212 ms |
| **Knob 2 (3.6, vendor non-think sampler)** | **temp=0.7, top_p=0.8, rep=1.0, pres=1.5** | **off** | **20/20** | **137 ms** | **514 ms** |

**Recommendation: design the n≥5 A/B for tier-64 with this configuration.**
Single-shot 20/20 cleared the suite — every test the production Coder-30B
sometimes fails (multi-file-rename 240 s timeout; deep-equal flake;
prose-quality:bridge chronic ✖) passed clean. Latency cost is ~118 ms on
tool-roundtrip vs production; capability gain is +3 tests.

## The case for swapping tier-64 to Qwen3.6-35B-A3B

1. **Capability ceiling is higher.** Production Coder-30B's known weak spots
   (`multi-file-rename` claw timeout per
   [`TODO-MULTI-FILE-RENAME-FLAKE.md`](../../llama-server/docs/TODO-MULTI-FILE-RENAME-FLAKE.md);
   `prose-quality:bridge` chronic ✖) all cleared on knob 2. The 35B-A3B isn't
   a coder-specialist (it's a multimodal hybrid attention/SSM MoE) but it
   reasons through code tasks more reliably.

2. **Latency is competitive.** Tool-roundtrip 514 ms vs production's 396 ms —
   118 ms slower, well under the 1 s "feels laggy" threshold. TTFT 137 ms
   is higher than production's 81 ms but still snappy. Hybrid SSM decode
   keeps per-token cost low.

3. **Wrap discipline is identical.** 20/20 tool-roundtrip wrap, 10/10
   tool-discipline, both at 1.00 wrap-rate. The same `claw.gbnf` grammar
   works against this model — no tool-format change needed.

4. **Memory headroom improves.** 21 GB vs production's 24 GB; +3 GB free for
   KV cache or larger context if needed. Same A3B class so decode active
   parameters are identical.

5. **Architectural diversity.** Production lineup is currently three
   pure-transformer Qwens. Adding hybrid attention/SSM at the top tier gives
   future evals a structural axis to compare against.

### Caveats — what an n≥5 A/B must verify

- **Knob 2's 20/20 is single-shot.** Per [`EVAL-DESIGN.md`](EVAL-DESIGN.md)
  rule #2, n=1 verdicts on agentic tasks are coin flips. The harder evals
  (multi-bug, two-step-refactor, deep-equal) need ≥5 runs each before we
  call this confirmed.
- **`adversarial-input` was a regression in pass 1 and a win in knobs 1 and
  2** — it might be variance-prone on this model. Worth special attention
  in n=5.
- **The model is multimodal** (`pipeline_tag: image-text-to-text`). We're
  sending text-only prompts so the vision tower is dead weight in RAM. If
  someone later adds a multimodal eval to the suite, this model is
  *over-qualified*; production Coder-30B can't do that at all.
- **Temp=0.7 increases run-to-run variance.** Production runs at 0.4 by
  design. Expect a wider distribution at n=5; this is expected, not a flaw.

## 20/20 reference configuration

Captured here verbatim so a follow-up agent can implement the swap or
reproduce the run.

### Model

- **GGUF:** `~/.ollama/gguf/Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf`
- **Source:** unsloth, Dynamic 2.0 quant
  (https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF — file
  `Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf`, ~21 GB)
- **Architecture:** `qwen35moe` (hybrid attention + SSM, 40 blocks, 256
  experts / 8 active, 4-block full-attention interval). VLM with vision
  tower; we don't exercise it.

### llama-server plist sampler

Replaces the production `claw.Modelfile`-mirror block in
[`host/llama-server/launchd/com.mac-llm-lab.llama-server.plist`](../../llama-server/launchd/com.mac-llm-lab.llama-server.plist):

```xml
<!-- sampler — Qwen3.6 vendor non-thinking profile (fast.Modelfile mirror). -->
<string>--temp</string>
<string>0.7</string>
<string>--top-p</string>
<string>0.8</string>
<string>--top-k</string>
<string>20</string>
<string>--repeat-penalty</string>
<string>1.0</string>
<string>--presence-penalty</string>
<string>1.5</string>
<string>--repeat-last-n</string>
<string>256</string>
```

Diff vs production plist: `temp 0.4 → 0.7`, `repeat-penalty 1.05 → 1.0`,
`presence-penalty 0 → 1.5` (new flag).

### LiteLLM bridge — thinking suppression

Required because Qwen3.6 thinks by default and the test budgets aren't
sized for `<think>` blocks. Inject on `claw-llama` test routes only,
NOT on production `claw` (lines 47-57 — Coder-30B is trained non-thinking
so the kwarg is a no-op for it but we keep the routes clean):

```yaml
- model_name: claw-llama
  litellm_params:
    model: openai/claw
    api_base: os.environ/LLAMA_SERVER_BASE
    api_key: llama-server-no-auth
    extra_body:
      chat_template_kwargs:
        enable_thinking: false
- model_name: anthropic/claw-llama
  litellm_params:
    model: openai/claw
    api_base: os.environ/LLAMA_SERVER_BASE
    api_key: llama-server-no-auth
    extra_body:
      chat_template_kwargs:
        enable_thinking: false
```

After editing: `(cd host/litellm && docker compose restart)`.

### models.conf entry

```bash
TIER_64_GGUF="$HOME/.ollama/gguf/Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf"
TIER_64_CTX=32768
TIER_64_BATCH=4096
```

Ctx and batch unchanged from production (32K / 4096).

### Smoke verification

After install + bridge restart:

```bash
KEY=$(grep "^LITELLM_MASTER_KEY=" host/litellm/.env | cut -d= -f2-)
curl -s http://127.0.0.1:4000/v1/chat/completions \
  -H 'Content-Type: application/json' \
  -H "Authorization: Bearer $KEY" \
  -d '{"model":"claw-llama","messages":[{"role":"user","content":"reply with the single word OK"}],"max_tokens":256}'
```

Expected: `content: "OK"`, ~2 completion tokens, ~20 ms predicted_ms.
**Failure mode to watch for:** `content` empty + `reasoning_content`
populated → kwarg didn't reach the model; check `extra_body` forwarding
through LiteLLM (suspect `drop_params: true` at line 113 of bridge config).

## Why these settings — short version

- **temp 0.7**: Qwen3.6 is general-purpose; needs warmer sampling than the
  Coder specialist to commit to actions. At 0.4 we observed
  "stream produced no content" failures at 5–10 s — thinking finished but
  the model never decisively emitted a tool call. Warmer sampling resolves.
- **top_p 0.8**: vendor's non-thinking recipe (vendor *thinking* recipe is
  0.95; we don't want thinking).
- **repeat_penalty 1.0** (off) + **presence_penalty 1.5**: vendor's
  recommended regularization for instruct tuning. presence_penalty counts
  each token once instead of penalizing per-occurrence — works better for
  this model's chat tuning. Production's 1.05 repeat-penalty was selected
  to avoid suppressing `\n` in structured prose ([`TODO-PROSE-SMUSH.md`](../../llama-server/docs/TODO-PROSE-SMUSH.md)),
  but with this model the prose-quality test passed clean at the vendor
  config — the prose-smush concern doesn't reproduce.
- **enable_thinking=false**: Qwen3.6 explicitly does not honor `/think`
  `/nothink` soft switches (per its model card and the existing
  [`fast.Modelfile`](../../ollama/Modelfiles/fast.Modelfile) note); the
  `chat_template_kwargs` path is the documented disable mechanism. Mirrors
  what Open WebUI does for the `fast` profile.

## What this exposed about the plist template

The current plist hardcodes a single sampler for all tiers. To run both
models without per-swap edits, the plist needs per-tier sampler vars in
`models.conf` (`TIER_N_TEMP`, `TIER_N_TOP_P`, etc.) plus extra placeholders
in the plist template (`__TEMP__`, `__TOP_P__`, ...) rendered by
`scripts/install`. This is a real refactor and worth doing as part of the
n≥5 A/B prep — without it we can't easily swap between Coder-30B and
3.6-35B-A3B for repeat runs.

Tracked here as the principal blocker for the next agent.

## Config swap surface — what was touched and why each is fragile

Documenting the exact files and edit churn from this session so the next
agent knows the live change surface. Three files were edited; one symlink
was created/deleted; the bridge was restarted once. Each is annotated with
why it can't be skipped and what gotchas to watch for.

### 1. `host/llama-server/models.conf` — touched 3×

Path: [`host/llama-server/models.conf:36-39`](../../llama-server/models.conf#L36-L39).

```
edit 1 (FAILED): TIER_64_GGUF → Qwen3.6-27B-Q8_0.gguf (Ollama-converted VLM blob)
                  → llama.cpp loader rejected: 3-element rope.dimension_sections array
                  → (also tried to revert, blocked, then re-edited)
edit 2 (REVERT): TIER_64_GGUF → Qwen3-Coder-30B-A3B-Instruct-UD-Q6_K_XL.gguf (production)
edit 3 (CURRENT): TIER_64_GGUF → Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf (the working one)
```

**Why fragile:** the cleanup trap in [`run-tier-eval.sh:56-64`](../run-tier-eval.sh#L56-L64)
re-runs `LLAMA_TIER=64 install` on every exit, which re-renders the plist
from whatever `TIER_64_GGUF` currently points at. So leaving this in a
half-edited state will silently install the wrong model on the *next* tier
eval run, even if no one runs the eval suite — `launchctl bootstrap` on
boot will pick it up too.

**Watch for:** comments in the file currently say `TEMP — REVERT after this run`.
That's a load-bearing TODO. Either restore the production line or commit
the swap as durable.

### 2. `host/llama-server/launchd/com.mac-llm-lab.llama-server.plist` — touched 2×

Path: [`host/llama-server/launchd/com.mac-llm-lab.llama-server.plist:44-60`](../../llama-server/launchd/com.mac-llm-lab.llama-server.plist#L44-L60).

```
edit 1 (Knob 1): temp 0.4 → 0.6, top-p 0.8 → 0.95 (vendor thinking sampler)
edit 2 (Knob 2 = CURRENT): full block rewritten —
                  temp 0.7, top-p 0.8, top-k 20, repeat-penalty 1.0,
                  + new --presence-penalty 1.5 flag, repeat-last-n 256
```

**Why fragile:** the plist is **global across all three tiers**. We've been
running `EVAL_TIERS=64` only, so tiers 16/32 don't see it — but if anyone
runs the full sweep right now, tier-16 (Qwen2.5-7B) and tier-32 (Qwen3-14B)
will both load with the Qwen3.6 vendor sampler, which is wrong for them.
This is the principal reason to do the per-tier-sampler refactor before
n≥5 A/B work.

**Also:** `--presence-penalty` is a *new flag* that wasn't in the original
plist template. Production sampler doesn't use it. Reverting requires
removing both `<string>--presence-penalty</string>` lines, not just
changing the value.

### 3. `host/litellm/litellm-config.yaml` — touched 1×, bridge restarted

Path: [`host/litellm/litellm-config.yaml:63-78`](../../litellm/litellm-config.yaml#L63-L78).

```
edit 1 (Knob 2 = CURRENT): added extra_body.chat_template_kwargs.enable_thinking=false
                            to claw-llama AND anthropic/claw-llama routes (test routes only)
followed by: (cd host/litellm && docker compose restart)
```

**Why fragile:** the bridge runs in a Docker container; the config file is
volume-mounted, so edits persist across restarts. But LiteLLM only reads
the config on startup — every change requires a bridge restart, which
invalidates any in-flight prompt cache (~5 min warmup loss).

**Watch for:** production `claw` route at line 47 was deliberately *not*
modified. Coder-30B is non-thinking by training so the kwarg would be a
no-op for it, but keeping the routes asymmetric makes it explicit that
this config knob is test-only. Don't unify them.

### 4. Symlink (transient — safe to ignore)

`~/.ollama/gguf/Qwen3.6-27B-Q8_0.gguf` was created (pointing at the Ollama
27B-VL blob) for the first failed pass, then `rm`'d after the model
wouldn't load. Nothing to revert.

### Summary of revert commands

If the next agent wants to take the rig fully back to pre-session state:

```bash
# 1. models.conf — restore production TIER_64_GGUF
#    (manual edit; see the comment block in the file)

# 2. plist — restore production sampler
#    (manual edit; see the comment block at line 45 of the plist)

# 3. litellm-config.yaml — drop the extra_body on claw-llama routes
#    (manual edit; lines 63-78 area)
(cd host/litellm && docker compose restart)

# 4. Reinstall production tier-64 plist
launchctl bootout "gui/$(id -u)/com.mac-llm-lab.llama-server" 2>/dev/null || true
LLAMA_TIER=64 ./host/llama-server/scripts/install
curl -fsS http://127.0.0.1:11435/health
```

A topic branch (`git checkout -b sniff-qwen36-restore`) makes step 4
single-command via `git checkout main && LLAMA_TIER=64 ./scripts/install` —
strongly recommended if you're going to do n≥5 A/B work where you'll be
flipping back and forth.

## Open questions for the next agent

1. **n≥5 confirmation.** Run knob-2 config 5× on tier-64. Compute pass-rate
   per test with Wilson interval; flag any test with rate < 0.8 as
   regression risk. Same for production baseline.
2. **Per-tier sampler plumbing.** Refactor `models.conf` + plist template +
   `scripts/install` so each tier carries its own sampler. Without this,
   A/B reruns require manual plist edits.
3. **Production swap decision.** If knob-2 holds at ≥18/20 mean, swap
   tier-64 to 3.6-35B-A3B in `models.conf`. Update [`README.md`](../../llama-server/README.md)
   tier table, [`profiles.md`](../../../profiles.md) if affected, and
   [`TIER-EVAL-REPORT.md`](TIER-EVAL-REPORT.md).
4. **Latency regression check.** TTFT went from 81 ms → 137 ms. Verify this
   isn't a chat_template_kwargs forwarding overhead at the bridge that
   could be optimized — measure llama-server `/v1/chat/completions` direct
   vs through LiteLLM.

## Result files (this session)

- [`TIER-EVAL-RESULTS-20260428-0324.md`](../logs/TIER-EVAL-RESULTS-20260428-0324.md) — Pass 1, thinking on, claw sampler. 15/20.
- [`TIER-EVAL-RESULTS-20260428-0334.md`](../logs/TIER-EVAL-RESULTS-20260428-0334.md) — Knob 1, thinking on, vendor sampler. 14/20.
- [`TIER-EVAL-RESULTS-20260428-0341.md`](../logs/TIER-EVAL-RESULTS-20260428-0341.md) — **Knob 2, thinking off, vendor non-thinking sampler. 20/20.**

## Current rig state

- llama-server: loaded with knob-2 config (Qwen3.6-35B-A3B, vendor
  non-thinking sampler).
- `models.conf`: `TIER_64_GGUF` points at the 3.6 GGUF (TEMP — see comment
  in file).
- `litellm-config.yaml`: `chat_template_kwargs.enable_thinking=false` on
  `claw-llama` test routes.
- Plist: vendor non-thinking sampler.
- Production tier-64 (Qwen3-Coder-30B-A3B): **NOT restored.**

If the next agent wants to start from a clean baseline, restore production
first:
1. Revert `host/llama-server/models.conf` `TIER_64_GGUF` to
   `Qwen3-Coder-30B-A3B-Instruct-UD-Q6_K_XL.gguf`.
2. Revert plist sampler to `temp=0.4, top_p=0.8, repeat_penalty=1.05`,
   remove `--presence-penalty`.
3. Revert `litellm-config.yaml` — drop the `extra_body` blocks on
   `claw-llama` routes.
4. `(cd host/litellm && docker compose restart)`.
5. `LLAMA_TIER=64 ./host/llama-server/scripts/install`.
6. Smoke prompt with thinking-off kwarg removed; should still get clean
   "OK" because Coder-30B doesn't think.
