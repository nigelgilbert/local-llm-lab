# local-llm-lab

Local-first AI rig: **Ollama on the host** (native Apple Silicon, unified memory) + **Open WebUI in Docker** (LAN browser UI), wired to a five-profile model lineup picked for a 64 GB box. Branded `cyberia` here; one rename away from any other handle (see [Fork checklist](#fork-checklist)).

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
4. [`host/scripts/`](host/scripts/) — install `cyberia-hostctl` for orchestration
5. [`client/`](client/) — install the `cyberia` CLI on your laptop

## Fork checklist

```sh
# 1. Brand: replace `cyberia` everywhere (LAN hostname, script names, plist Label)
grep -rl 'cyberia\|Cyberia' . | xargs sed -i '' 's/cyberia/your-brand/g; s/Cyberia/Your-Brand/g'

# 2. Rig username: Modelfile FROM paths point to /Users/nigel/.ollama/gguf/
sed -i '' "s|/Users/nigel/|/Users/$USER/|g" host/ollama/Modelfiles/*.Modelfile

# 3. Repo path: cyberia-hostctl defaults to ~/Desktop/bench/local-llm-lab.
#    Either clone there, or set `HOST_REPO=/your/path` in your shell profile.
```

After step 1, also rename `host/ollama/launchd/com.cyberia.ollama-env.plist` to match.

## Browser

Use Chrome or Firefox for long Open WebUI sessions. Safari WebContent retains 10+ GB after closing thinking-mode chats.

## License

MIT — see [`LICENSE`](LICENSE).
