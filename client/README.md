# cyberia client CLI

Thin POSIX-shell wrapper for the Cyberia LAN AI lab. Runs on power-user laptops; opens the browser to the right Open WebUI deep-link and SSHes the host for control actions.

Spec ref: [`spec.md` §13](../spec.md), step 6.

## Install

```sh
# 1. Drop the script anywhere in $PATH
cp client/cyberia ~/.local/bin/cyberia
chmod +x ~/.local/bin/cyberia

# 2. Set up config
mkdir -p ~/.config/cyberia
cp client/config.env.example ~/.config/cyberia/config.env
$EDITOR ~/.config/cyberia/config.env
```

## Prerequisites

- SSH access to `cyberia.local` (host has Remote Login enabled, your key in `~/.ssh/authorized_keys` on the host)
- Host-side `cyberia-hostctl` symlinked into `$PATH` — see [`../host/scripts/README.md`](../host/scripts/README.md)
- `python3` (used for URL-encoding queries; macOS ships it)

Verify SSH:
```sh
ssh ngilbert@cyberia.local "cyberia-hostctl --help"
```

## Usage

```sh
cyberia chat                            # open Open WebUI bare
cyberia chat -p general                 # daily driver
cyberia chat -p fast                    # snappy triage (MoE, no <think>)
cyberia chat -p reasoning               # math / planning
cyberia chat -p digest                  # long-context extract
cyberia chat -p analyze                 # long-context reasoning (with <think>)
cyberia chat -p digest -q "Why..."      # preselect + prefill query
cyberia status                          # host health summary
cyberia warm -p reasoning               # preload model on host
```

When you call `chat -p <profile>`, the client also fires a fire-and-forget warm against the host so the model is hot by the time the browser finishes loading. Best-effort — if SSH fails, you still get a working browser open (just a slower first response).

## Config schema

`~/.config/cyberia/config.env` (also see `config.env.example`):

| Var | Default | Purpose |
|---|---|---|
| `CYBERIA_HOST` | `cyberia.local` | mDNS hostname or LAN IP of host |
| `CYBERIA_USER` | `$USER` | SSH user on host |
| `CYBERIA_OPENUI_BASE` | `http://cyberia.local` | Browser deep-link base |
| `CYBERIA_HOSTCTL` | `cyberia-hostctl` | Host-side script (resolved via host's `$PATH`) |

## Phase 2 ideas (not implemented)

- `cyberia wake` — Wake-on-LAN packet to host MAC
- `cyberia cli` — TTY chat tunnel (`ssh host ollama run`)
- Tailscale-hosted variant: just point `CYBERIA_OPENUI_BASE` at the `*.ts.net` URL

See [`../spec.md`](../spec.md) §11.
