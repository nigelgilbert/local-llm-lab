# claw-code (containerised, points at the lab's bridge)

Self-hosted [`claw-code`](https://github.com/ultraworkers/claw-code) in Docker, talking to the lab's LiteLLM bridge over the LAN. Each client runs only this; the bridge and Ollama live once on the host.

```
┌──────────┐  Anthropic API   ┌──────────────────┐  Ollama API   ┌────────┐
│   claw   │ ───────────────▶ │   LiteLLM        │ ────────────▶ │ Ollama │
│ (in box) │   /v1/messages   │ home-llm-lab.local    │               │ :11434 │
│          │                  │ :4000            │               │        │
└──────────┘                  └──────────────────┘               └────────┘
   client                            host
```

Profile selection is a claw flag (`--model anthropic/<profile>`); the URL is fixed. `claw` is the agentic-coding profile (Qwen3-Coder-30B-A3B), authored specifically for tool-use loops — that's the one you want for actual coding work. The five OWUI profiles (`general`, `fast`, `reasoning`, `digest`, `analyze`) are also routable but only `general` declares the `tools` capability natively. `home-llm-lab warm -p <profile>` from [`../`](../) preheats the model before a session — pairs naturally but isn't required.

## Prerequisites

- The bridge is running on the lab host: see [`../../host/litellm/README.md`](../../host/litellm/README.md).
- You know the bridge's `LITELLM_MASTER_KEY` (operator hands it to you).
- `home-llm-lab.local` resolves from your laptop (`ping home-llm-lab.local`), or you have the DHCP-reserved IP.

## Setup

```sh
cd client/claw-code
cp .env.example .env
$EDITOR .env                  # set WORKSPACE, BRIDGE_HOST, LITELLM_MASTER_KEY
mkdir -p "$(grep ^WORKSPACE= .env | cut -d= -f2)"
docker compose up -d --build  # ~5–10 min on first build (cargo --release)
```

`BRIDGE_HOST` defaults to `home-llm-lab.local`. If you're running this on the lab box itself, set `BRIDGE_HOST=host.docker.internal` instead.

## Usage

```sh
# Health check (run this first, every time)
docker compose exec claw claw doctor

# Interactive REPL — pick `anthropic/claw` for actual coding work
docker compose exec -it claw claw --model anthropic/claw

# One-shot prompt
docker compose exec claw claw --model anthropic/claw prompt "make hello.py with print(\"hi\")"

# Drop into a shell inside the workspace
docker compose exec -it claw bash
```

Files written under `/workspace` land on the host at whatever you set `WORKSPACE=` to.

### Model-name syntax

Claw's `--model` flag rejects bare profile names. Two forms work:

| Form | Example | Routes to |
|---|---|---|
| `anthropic/<profile>` | `--model anthropic/claw` | the named Ollama profile via an explicit bridge route |
| Built-in alias | `--model sonnet` (or `opus`, `haiku`) | `general` via the bridge's `"*"` wildcard fallback |

If you omit `--model`, claw uses its default alias (typically a `claude-*` ID) — caught by the wildcard, lands on `general`. **Use `anthropic/claw` for tool-using sessions** — it's the only profile authored for agent-loop work; the others are tuned for OWUI chat. `general` will also work (it has the `tools` capability) but it thinks-by-default and burns time.

## Operations

```sh
docker compose ps
docker compose logs -f claw             # claw stdout (sleep loop unless exec'd)
docker compose down                     # stop, keep image
docker compose down --rmi local         # also remove the locally-built claw image
```

## Configuration

### Pinning the claw build

Set `CLAW_REF` in `.env` to a commit SHA or tag, then `docker compose build --no-cache claw && docker compose up -d`. `main` rebuilds against upstream HEAD on each `--build`.

### Tightening the volume

Default is one read-write bind. To make a reference tree read-only, add a second mount:

```yaml
    volumes:
      - ${WORKSPACE}:/workspace
      - /path/to/refs:/refs:ro
```

### Routing more model names

Model routing lives on the bridge, not here. Edit [`../../host/litellm/litellm-config.yaml`](../../host/litellm/litellm-config.yaml) on the host and `docker compose restart` over there.

### Per-workspace rules via `CLAUDE.md`

claw has no `--system` flag and the static system-prompt sections are hardcoded in its source. The supported customisation point is `CLAUDE.md` (or `.claw/CLAUDE.md`, `CLAUDE.local.md`, `.claw/instructions.md`) in the workspace — claw discovers these from `cwd` and its parents and appends them under a `# Claude instructions` section. Verify with `docker compose exec claw claw system-prompt`.

The `claw` Ollama profile already enforces tool-use discipline at the Modelfile-template layer (rules ride inside the tools block where they survive any client system override), so a workspace `CLAUDE.md` is optional and is the right place for project-specific guidance rather than core agent rules.

## Troubleshooting

**`claw doctor` reports auth failure**
`LITELLM_MASTER_KEY` here doesn't match the value in `host/litellm/.env` on the bridge box. Sync them.

**`claw doctor` can't reach the bridge**
```sh
docker compose exec claw curl -fsS "http://${BRIDGE_HOST}:${BRIDGE_PORT}/health/liveliness"
```
Failure modes: `BRIDGE_HOST` doesn't resolve from inside the container (LAN mDNS flake — use the IP), bridge container is down (check on the host), or LAN firewall blocking `:4000`.

**Bridge is up but the model errors**
Ollama isn't reachable from the bridge. Diagnose on the host side per [`../../host/litellm/README.md`](../../host/litellm/README.md).

**First build is slow**
Expected — `cargo build --release --workspace` takes 5–10 min. Subsequent rebuilds are layer-cached unless `CLAW_REF` changes.

**`write_file` fires repeatedly with the same content**
Historic qwen3-coder failure mode where the model would emit 3+ duplicate `write_file` calls per response and loop across turns. Two root causes were addressed: (1) claw-code injects its own system prompt that overrode the Modelfile `SYSTEM` discipline rules — fixed by hardcoding the rules into the Modelfile `TEMPLATE`'s tools block where they survive any client override; (2) LiteLLM auto-routed `openai/*` + Anthropic input through `/v1/responses`, where Ollama's tool-call parser dropped to text content for claw's 50+ tool requests — fixed via `use_chat_completions_url_for_anthropic_messages: true` in litellm-config.yaml. If you still see this with `anthropic/claw`, check that the Modelfile and bridge config match what's in this repo and reload (`ollama create claw -f host/ollama/Modelfiles/claw.Modelfile`).

**Tool call shows up as raw text instead of executing (`<tools>` or bare JSON in the response)**
Shouldn't happen with `--model anthropic/claw` (template override eliminates the `<tools>` tag collision; bridge pins requests to `/v1/chat/completions` so the tool-call parser fires correctly). If it does happen on another profile, that profile's Modelfile doesn't declare the `tools` capability — only `general` and `claw` do.

## Phase 2 — `home-llm-lab claw` subcommand

The vision: friends install [`../home-llm-lab`](../home-llm-lab) plus this image and drive it from their laptops. Today the lifecycle is raw `docker compose`; a future `home-llm-lab claw up | down | shell | doctor` would wrap it. Schema is intentionally compose-driven so the wrapper stays thin.
