# Modelfile aliases

Six Modelfiles, one per profile, each binding an upstream model to a stable `<profile>` name with a `num_ctx` default. Run after [`../README.md`](../README.md) installs Ollama and stages the GGUFs.

Selection rationale (models, quants, sizes, `num_ctx` choices) lives in [`../../../profiles.md`](../../../profiles.md).

## Composition

```
general    ← FROM qwen3.6:27b-q8_0                                                          num_ctx=131072
fast       ← FROM ~/.ollama/gguf/Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf                            num_ctx=32768
reasoning  ← FROM ~/.ollama/gguf/nvidia_Llama-3_3-Nemotron-Super-49B-v1_5-Q6_K.gguf         num_ctx=65536
digest     ← FROM ~/.ollama/gguf/Qwen3-30B-A3B-Instruct-2507-UD-Q4_K_XL.gguf                num_ctx=262144
analyze    ← FROM ~/.ollama/gguf/Qwen3-30B-A3B-Thinking-2507-UD-Q6_K_XL.gguf                num_ctx=262144
claw       ← FROM hf.co/unsloth/Qwen3-Coder-30B-A3B-Instruct-GGUF:UD-Q6_K_XL                num_ctx=131072
```

Each profile is its own model. `fast` is a Qwen3.6-35B-A3B MoE (3B active per token) at unsloth Dynamic 2.0 Q4 — different shape from `general` (dense, full quality) for snappy triage. Thinking-off for `fast` is set via OWUI per-model config, not the Modelfile (Qwen3.6 doesn't support the `/no_think` soft switch).

`digest` and `analyze` are siblings on the same Qwen3-30B-A3B base, different post-training: `digest` (Instruct-2507) extracts/summarizes directly with no `<think>` block; `analyze` (Thinking-2507) reasons across the corpus before answering.

`claw` is the agentic-coding profile — Qwen3-Coder-30B-A3B-Instruct, MoE A3B, native tool-use, no thinking. Single-purpose: feeds [`../../../client/claw-code/`](../../../client/claw-code/) via the LiteLLM bridge's `anthropic/claw` route. Unlike the OWUI-facing five, `claw.Modelfile` carries a custom TEMPLATE override that does three things: (1) renames the `<tools>` definition wrapper to `<available_tools>` to remove a tag collision with the `<tool_call>` invocation format, (2) hardcodes the tool-use discipline rules inside the tools block where they survive any client-side system-prompt override (claw-code injects its own system prompt that would otherwise shadow `SYSTEM`), and (3) replays the assistant's prior turn with both the text content *and* its tool_calls so the model sees a coherent history (the upstream qwen3-coder template emits one or the other). See the comments in [`claw.Modelfile`](./claw.Modelfile) for what each tweak addresses.

Per-profile system prompts for the OWUI five live in Open WebUI's per-model config rather than baked into the Modelfile. The exception is `claw`, which is overfit to its harness and keeps its directives in the Modelfile.

## Apply

```sh
cd host/ollama/Modelfiles
ollama create general   -f general.Modelfile
ollama create fast      -f fast.Modelfile
ollama create reasoning -f reasoning.Modelfile
ollama create digest    -f digest.Modelfile
ollama create analyze   -f analyze.Modelfile
ollama create claw      -f claw.Modelfile     # only if you're using client/claw-code/
```

Idempotent — re-running after a Modelfile edit updates the alias in place.

> **`reasoning`, `fast`, `digest`, and `analyze` need GGUFs first.** All reference absolute paths in `~/.ollama/gguf/`. See [`../README.md`](../README.md) §3 for download commands.

> **`claw` pulls from HuggingFace via Ollama's `hf.co/...` shortcut** — no local GGUF needed; `ollama create claw -f claw.Modelfile` triggers the pull on first run (~24 GB).

> **Forking?** The `FROM` paths in `reasoning.Modelfile`, `fast.Modelfile`, `digest.Modelfile`, and `analyze.Modelfile` are hardcoded to this rig's username. Edit them to match your rig (Ollama Modelfile `FROM` does not expand `~` or `$HOME`). `general` and `claw` use registry tags, so they're rig-agnostic.

## Verify

```sh
ollama list
# Expected: general, fast, reasoning, digest, analyze (+ claw if installed)
#           plus the qwen3.6 base blob (the GGUFs get re-imported into Ollama's blob store)

ollama show reasoning
# Expected: num_ctx 65536

ollama show claw | grep -A4 Capabilities
# Expected: completion + tools (claw must declare `tools`, otherwise client/claw-code/ breaks)

ollama run general
# >>> hello
# Expected: chats normally
```

## Phase 1 acceptance gates

1. **All five aliases load.** `ollama run <profile>` opens a chat for each. If `reasoning`, `fast`, `digest`, or `analyze` fails with "no such file," the GGUF isn't where the Modelfile's `FROM` line expects.
2. **`general` accepts vision.** Once Open WebUI is up, attach a screenshot to a `general` chat — sensible response = vision works (spec §4.2).
3. **`reasoning` thinks visibly.** Ask a multi-step problem; expect a `<think>...</think>` block before the answer.
4. **`digest` swallows long context.** Paste a 50K-token document and ask for a summary; should not OOM or stall.
5. **`analyze` reasons over long context.** Paste a multi-document corpus and ask an interpretive question; expect a `<think>` block followed by a synthesis-style answer.

## Editing tips

- **Bumping `num_ctx`:** edit the relevant Modelfile, re-create just that alias.
- **Adding a SYSTEM prompt:** prefer Open WebUI's per-model config. Easier to iterate without `ollama create` cycles, and keeps the Modelfile minimal.
- **Swapping a quant:** drop the new GGUF in `~/.ollama/gguf/`, update the `FROM` line, re-create the alias.
