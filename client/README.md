# home-llm-lab client CLI

Thin POSIX-shell wrapper for the LLM Lab LAN AI lab. Runs on power-user laptops; opens the browser to the right Open WebUI deep-link and SSHes the host for control actions.

Spec ref: [`spec.md` §13](../spec.md), step 6.

## Install

```sh
# 1. Drop the script anywhere in $PATH
cp client/home-llm-lab ~/.local/bin/home-llm-lab
chmod +x ~/.local/bin/home-llm-lab

# 2. Set up config
mkdir -p ~/.config/home-llm-lab
cp client/config.env.example ~/.config/home-llm-lab/config.env
$EDITOR ~/.config/home-llm-lab/config.env
```

## Prerequisites

- SSH access to `home-llm-lab.local` (host has Remote Login enabled, your key in `~/.ssh/authorized_keys` on the host)
- Host-side `home-llm-lab-hostctl` symlinked into `$PATH` — see [`../host/scripts/README.md`](../host/scripts/README.md)
- `python3` (used for URL-encoding queries; macOS ships it)

Verify SSH:
```sh
ssh ngilbert@home-llm-lab.local "home-llm-lab-hostctl --help"
```

## Usage

```sh
home-llm-lab chat                            # open Open WebUI bare
home-llm-lab chat -p general                 # daily driver
home-llm-lab chat -p fast                    # snappy triage (MoE, no <think>)
home-llm-lab chat -p reasoning               # math / planning
home-llm-lab chat -p digest                  # long-context extract
home-llm-lab chat -p analyze                 # long-context reasoning (with <think>)
home-llm-lab chat -p digest -q "Why..."      # preselect + prefill query
home-llm-lab status                          # host health summary
home-llm-lab warm -p reasoning               # preload model on host
```

When you call `chat -p <profile>`, the client also fires a fire-and-forget warm against the host so the model is hot by the time the browser finishes loading. Best-effort — if SSH fails, you still get a working browser open (just a slower first response).

## Config schema

`~/.config/home-llm-lab/config.env` (also see `config.env.example`):

| Var | Default | Purpose |
|---|---|---|
| `HOME_LLM_LAB_HOST` | `home-llm-lab.local` | mDNS hostname or LAN IP of host |
| `HOME_LLM_LAB_USER` | `$USER` | SSH user on host |
| `HOME_LLM_LAB_OPENUI_BASE` | `http://home-llm-lab.local` | Browser deep-link base |
| `HOME_LLM_LAB_HOSTCTL` | `home-llm-lab-hostctl` | Host-side script (resolved via host's `$PATH`) |

## Phase 2 ideas (not implemented)

- `home-llm-lab wake` — Wake-on-LAN packet to host MAC
- `home-llm-lab cli` — TTY chat tunnel (`ssh host ollama run`)
- Tailscale-hosted variant: just point `HOME_LLM_LAB_OPENUI_BASE` at the `*.ts.net` URL

See [`../spec.md`](../spec.md) §11.
