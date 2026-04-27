# Host scripts

Two scripts live here:
- [`cyberia-hostctl`](cyberia-hostctl) — daily orchestration (up / down / status / warm / openui-url). Symlinked into `$PATH`.
- [`set-local-hostname`](set-local-hostname) — one-shot helper to claim `<name>.local` via mDNS. Run from the repo path; not symlinked.

## Install `cyberia-hostctl` on the target host

```sh
sudo ln -s ~/Desktop/bench/local-llm-lab/host/scripts/cyberia-hostctl /usr/local/bin/cyberia-hostctl
```

(Adjust the path if you cloned the repo elsewhere. The script already has the executable bit set in the repo.)

Test:
```sh
cyberia-hostctl --help
cyberia-hostctl status
```

---

## `cyberia-hostctl` — subcommands

| | |
|---|---|
| `up` | `docker compose up -d`, then verify OWUI + Ollama healthy. Exits non-zero if OWUI doesn't come healthy within 30s. |
| `down` | `docker compose down` (volume preserved). |
| `status` | Container state + OWUI health + Ollama API + `ollama ps`. |
| `warm <profile>` | Preload a profile. `claw` hits llama-server (always-resident probe); the rest POST `/api/generate` to Ollama with `keep_alive=30m`. |
| `openui-url [-p P] [-q "..."]` | Print the canonical browser URL. URL-encodes `-q`. |

Profiles: `general`, `fast`, `reasoning`, `digest`, `analyze`, `claw`.

## Env overrides

```
HOST_REPO          repo root (default: ~/Desktop/bench/local-llm-lab)
COMPOSE_DIR        compose dir (default: $HOST_REPO/host)
OPENUI_BASE        external OWUI URL (default: http://cyberia.local)
OLLAMA_API         local Ollama API (default: http://127.0.0.1:11434)
LLAMA_SERVER_API   local llama-server API (default: http://127.0.0.1:11435)
KEEP_ALIVE         Ollama warm duration (default: 30m); claw is always resident.
```

Useful when running from a non-default repo path, or if you change any port.

---

## `set-local-hostname` — claim `<name>.local`

Sets `LocalHostName` via `scutil`. Default `cyberia`. On LAN conflict, macOS auto-bumps to `<name>-2` and the script exits non-zero.

```sh
sudo ./host/scripts/set-local-hostname          # claim 'cyberia'
sudo ./host/scripts/set-local-hostname my-rig   # claim a different name
```
