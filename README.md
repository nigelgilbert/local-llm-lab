# mac-llm-lab

Local-first AI rig: **Ollama on the host** (native Apple Silicon, unified memory) + **Open WebUI in Docker** (LAN browser UI) + **[`claw-code`](https://github.com/ultraworkers/claw-code) in Docker** (agentic coding, via a LiteLLM Anthropic-API bridge), wired to a five-profile OWUI lineup plus a dedicated `claw` coding profile, picked for a 64 GB box. Branded `mac-llm-lab` here; one rename away from any other handle (see [Fork checklist](#fork-checklist)).

Full plan: [`spec.md`](spec.md). Model selection: [`profiles.md`](profiles.md).

## Profiles

| Profile | Use it for | Backing model |
|---|---|---|
| `general` | daily driver — chat, code, vision | Qwen3.6-27B Q8_0 |
| `fast` | snappy triage, no `<think>` | Qwen3.6-35B-A3B MoE Q4 |
| `reasoning` | hard thinking, planning | Nemotron Super 49B v1.5 Q6 |
| `digest` | long-context extract | Qwen3-30B-A3B-Instruct-2507 Q4 |
| `analyze` | long-context reasoning | Qwen3-30B-A3B-Thinking-2507 Q6 |

One profile resident at a time. Full rationale in [`profiles.md`](profiles.md).

## Setup

In order, each directory has its own README:

1. [`host/ollama/`](host/ollama/) — install Ollama, stage GGUFs
2. [`host/ollama/Modelfiles/`](host/ollama/Modelfiles/) — `ollama create` the aliases
3. [`host/`](host/) — Open WebUI Docker stack, groups, per-model config
4. [`host/litellm/`](host/litellm/) — LiteLLM bridge (Anthropic API ↔ Ollama), required by `claw-code`
5. [`host/scripts/`](host/scripts/) — install `mac-llm-lab-hostctl` for orchestration
6. [`client/`](client/) — install the `mac-llm-lab` CLI on your laptop
7. [`client/claw-code/`](client/claw-code/) — containerised `claw-code`, pointed at the bridge

## Fork checklist

```sh
# 1. Brand: replace `mac-llm-lab` everywhere (LAN hostname, script names, plist Label)
grep -rl 'mac-llm-lab\|LLM Lab' . | xargs sed -i '' 's/mac-llm-lab/your-brand/g; s/LLM Lab/Your-Brand/g'

# 2. Rig username: Modelfile FROM paths point to /Users/nigel/.ollama/gguf/
sed -i '' "s|/Users/nigel/|/Users/$USER/|g" host/ollama/Modelfiles/*.Modelfile

# 3. Repo path: mac-llm-lab-hostctl defaults to ~/Desktop/bench/mac-llm-lab.
#    Either clone there, or set `HOST_REPO=/your/path` in your shell profile.
```

After step 1, also rename `host/ollama/launchd/com.mac-llm-lab.ollama-env.plist` to match.

## Browser

Use Chrome or Firefox for long Open WebUI sessions. Safari WebContent retains 10+ GB after closing thinking-mode chats.

## License

MIT — see [`LICENSE`](LICENSE).
