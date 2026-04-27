# Home LLM Lab — Architecture & Build Plan

## 0) Goal

Build a local-first AI rig around a **64 GB Apple Silicon MacBook Pro (M5 Max Pro)** that:

- runs **Ollama natively on the host** for best Apple unified-memory performance
- exposes **Open WebUI** on the LAN over **plain HTTP at port 80** via mDNS hostname `home-llm-lab.local`
- supports five task-based profiles — `general`, `fast`, `reasoning`, `digest`, `analyze` — each backed by an upstream model picked for that job
- ships a thin client-side shell CLI named `home-llm-lab` that orchestrates from laptops
- supports LAN guests in the browser without the CLI

> **Model selection lives in [`profiles.md`](profiles.md).** That file is the single source of truth for upstream tags, quant levels, sizes, `num_ctx`, and per-profile rationale. This spec defers all model-specific decisions to it.

### Validated assumptions

- mDNS resolution works cross-device on the home LAN (verified 2026-04-25)
- Mac's `LocalHostName` set to `home-llm-lab` → `http://home-llm-lab.local` resolves on any LAN client
- LAN is medium-security, gated by user's network device passport system. Per-device identity is established at the network layer before Open WebUI sees the request.

### Desired UX (MVP)

```sh
home-llm-lab chat                                 # open Open WebUI bare
home-llm-lab chat -p general                      # daily driver preselected
home-llm-lab chat -p fast                         # snappy triage preselected
home-llm-lab chat -p reasoning                    # math / planning preselected
home-llm-lab chat -p digest                       # long-context extract preselected
home-llm-lab chat -p analyze                      # long-context reasoning preselected
home-llm-lab chat -p digest -q "summarise..."     # preselect + prefilled query
home-llm-lab status                               # SSH host → home-llm-lab-hostctl status
home-llm-lab warm -p reasoning                    # preload model
```

### Profiles at a glance

- **`general`** — daily driver: chat, coding, quick questions.
- **`fast`** — snappy triage: one-liners, quick lookups, "no-think" answers via MoE.
- **`reasoning`** — hard thinking: math, multi-step analysis, structured planning, evaluating tradeoffs.
- **`digest`** — long-context extract: summarize / pull info from large documents and codebases (no `<think>`).
- **`analyze`** — long-context reasoning: interpret / synthesize across the same scale of input (with `<think>`).

Specific models, quants, and sizing are in [`profiles.md`](profiles.md). One profile runs at a time.

### Out of scope for MVP (deferred)

| Feature | Phase |
|---|---|
| `home-llm-lab wake` (Wake-on-LAN), `home-llm-lab cli` TTY tunnel | 2 |
| Tailscale `tailscale serve` for remote HTTPS | 2 |
| Caddy reverse proxy (only if auth / TLS / path routing wanted) | 2 |
| RAG sidecar-loader + corpora | 3 |
| Web search / SearXNG | 4 |
| Backups, hardening, observability | 5 |

---

## 1) Core design decisions

### 1.1 Ollama stays on the host, not in Docker

Best path to stable Apple unified-memory performance; simplest model storage and lifecycle; keeps the inference engine on the machine that owns the RAM.

### 1.2 Open WebUI in Docker; no Caddy in MVP

Open WebUI binds directly to host port 80 on the LAN interface. mDNS gives us `home-llm-lab.local` for free; no reverse proxy needed for hostname stability. LAN-only HTTP is acceptable security given the network passport gating. Caddy retrofits cleanly later — adding it does not break the URL contract.

### 1.3 Profiles are model swaps, not finetunes

Each profile is a different upstream model picked for a specific job (see [`profiles.md`](profiles.md)). We don't train anything. Profile assembly composes: Ollama Modelfile alias (binds an upstream tag + `num_ctx` + optional `SYSTEM`) → Open WebUI per-model config (system prompt, KBs, skills, group access, capability flags) → optional sidecar RAG (Phase 3+). The differences between profiles come from picking the right model for the task, not from layering tweaks on a shared base.

### 1.4 Open WebUI is the share layer

Multi-user with per-user private chats by default; profiles expose as models in the picker; KBs / prompts / skills / permissions / groups all live here; browser is the universal client.

### 1.5 Client CLI is a thin orchestrator

`home-llm-lab` on client machines is a small POSIX shell helper. Heavy logic lives on the host as `home-llm-lab-hostctl`. Compose paths, model names, health checks all evolve on the host without forcing client updates.

### 1.6 mDNS is the LAN hostname strategy (validated)

Mac `LocalHostName=home-llm-lab`; `home-llm-lab.local` resolves cross-device on this LAN (verified 2026-04-25 — Bonjour discovery works through the AT&T gateway on the main SSID). **Fallback:** stable LAN IP via router DHCP reservation by MAC, in case mDNS fails on a guest device or guest SSID.

---

## 2) High-level architecture

```text
+-------------------+          +-------------------------------------------+
| Client machine(s) |          | Host MBP (Apple Silicon M5 Max Pro, 64GB) |
|-------------------|          |-------------------------------------------|
| home-llm-lab CLI       | --SSH--> | Remote Login (SSH)                        |
| browser           | --HTTP-> | Open WebUI :80 (Docker, v0.9.2)           |
+-------------------+          |     |                                     |
                               |     v  host.docker.internal:11434         |
                               | Ollama (host native, :11434)              |
                               |   - general   (→ Qwen3.6-27B)             |
                               |   - fast      (→ Qwen3.6-35B-A3B MoE)     |
                               |   - reasoning (→ Nemotron 49B)            |
                               |   - digest    (→ Qwen3-30B-A3B Instruct)  |
                               |   - analyze   (→ Qwen3-30B-A3B Thinking)  |
                               +-------------------------------------------+

Phase 2+ retrofits: home-llm-lab wake (WoL), tailscale serve (remote HTTPS),
Caddy (LAN auth), sidecar-loader (RAG), SearXNG (search).
```

Concrete upstream tags, quants, and `num_ctx` per profile: [`profiles.md`](profiles.md).

### Network shape

- LAN access: `http://home-llm-lab.local` (port 80)
- Mac hostname set via `sudo scutil --set LocalHostName home-llm-lab`
- DHCP reservation by MAC strongly recommended for stable IP fallback
- Ollama bound to `0.0.0.0:11434` so the Docker bridge reaches it via `host.docker.internal` — LAN guard is the primary protection
- Open WebUI ↔ Ollama: `OLLAMA_BASE_URL=http://host.docker.internal:11434`

---

## 3) Component split

### 3.1 Host-side components (MVP)

#### A. Ollama (native host service)

Responsibilities:
- run the three profile models (one resident at a time)
- hold model blobs at `~/.ollama/models`
- expose API for list / running / preload / inference

Configuration:
- launchd plist (or login item) with env: `OLLAMA_HOST=0.0.0.0:11434`, `OLLAMA_KEEP_ALIVE=30m`
- (optional) `OLLAMA_KV_CACHE_TYPE=q8_0` if multi-user pressure on `general` shows up

#### B. Open WebUI (Docker)

Responsibilities:
- browser UI
- user accounts (admin + Guests group), open signup auto-Guests
- model picker, system-prompt-per-model, attached knowledge / skills

Pinned image: `ghcr.io/open-webui/open-webui:v0.9.2`. Bound to host :80. Named volume for `/app/backend/data` (preserves backup option for Phase 5).

Compose env:
- `OLLAMA_BASE_URL=http://host.docker.internal:11434`
- `WEBUI_AUTH=true`
- port mapping `- "80:8080"` (host port 80 → container port 8080)

### 3.2 Phase-deferred components

| Component | Phase | Purpose |
|---|---|---|
| Caddy (Docker) | 2 | auth / path routing / TLS — only if needed |
| Tailscale + `tailscale serve` | 2 | remote HTTPS via `*.ts.net`, no port forwarding |
| sidecar-loader (Docker) | 3 | RAG ingestion automation |
| SearXNG (Docker) | 4 | self-hosted search backend |

### 3.3 Client-side components

- **`home-llm-lab` shell CLI.** Reads `~/.config/home-llm-lab/config.env`. SSHes host for control actions (`home-llm-lab-hostctl up | status | warm`). Opens browser to deep-link URL. Phase 2+: WoL packet, TTY chat tunnel.
- **Browser.** Power user via deep-link, guests via bookmark.

---

## 4) Profiles: how they should work

A profile is a named bundle of: upstream Ollama model + per-model `num_ctx` + optional system prompt + Open WebUI per-model config (KBs, skills, group access). Model selection per profile is fixed in [`profiles.md`](profiles.md).

### 4.1 Composition layers

| Layer | Where | When |
|---|---|---|
| Ollama Modelfile alias | `host/ollama/Modelfiles/*.Modelfile` (one per profile: `FROM <upstream>` + `PARAMETER num_ctx` + optional `SYSTEM`) | MVP |
| Open WebUI per-model config | OWUI workspace UI (system prompt, KBs, tools, group access, capability flags) | MVP |
| Sidecar knowledge (RAG) | sidecar-loader → OWUI Knowledge | Phase 3+ |
| Custom Python (Pipes / Filters / Actions) | OWUI Functions | avoid early |

### 4.2 Per-model capabilities

Capability differences (vision, thinking, tool use) live with the underlying model — we don't toggle them per profile.

- **`general`** — has a vision encoder; thinking is the model default. Both stay on. Smoke-test vision in Phase 1 (gate below).
- **`fast`** — text-only; thinking off via OWUI per-model config (Qwen3.6 doesn't support the `/no_think` soft switch).
- **`reasoning`** — text-only; thinking is the defining behaviour, leave default.
- **`digest`** — text-only; long context is the point of the pick. Instruct post-train, no `<think>` blocks.
- **`analyze`** — text-only; same long-context capability as `digest`, Thinking post-train. `<think>` blocks always emitted.

**Vision verification gate (Phase 1 acceptance):** attach a screenshot to a `general` chat → model responds sensibly (not "I can't see images"). If it fails, document the gap in [`profiles.md`](profiles.md); vision lights up automatically when Ollama ships full image support for the underlying model.

---

## 5) Initial profiles

| Profile | Intent |
|---|---|
| `general` | Daily driver — chat, coding, debugging, quick answers. |
| `fast` | Snappy triage — one-liners, quick lookups, no `<think>`. |
| `reasoning` | Hard thinking — math, multi-step analysis, planning, evaluating tradeoffs. |
| `digest` | Long-context extract — summarize / pull info from documents and codebases. |
| `analyze` | Long-context reasoning — interpret / synthesize across the same scale of input. |

Model, quant, size, and `num_ctx` for each are in [`profiles.md`](profiles.md). Per-profile system prompts are stubbed in Phase 1 and iterated over time. Phase 3+ KB attachments are deferred.

All five profiles are visible to admin + `Guests` group.

---

## 6) RAG / sidecar memory design (Phase 3+)

Use retrieval-backed sidecars, not always-injected prompts.

- **Focused retrieval (RAG)** for large corpora: docs collections, wiki subsets, repo notes
- **Full context** for short style guides / profile-permanent rules — bake into system prompt instead

The sidecar-loader idempotently syncs configured local source folders → Open WebUI Knowledge via API, keyed on a hash-manifest to skip unchanged files (scan → normalize → upload → poll → attach → record hash).

Corpora roadmap: **Phase 3** = curated dev docs (Python stdlib, JS/TS handbook extracts, repo notes) attached to `general`; curated knowledge bases (`kb-wiki-lite`, `kb-curated-notes`) attached to `digest` and `analyze`. **Phase 4** = `wiki-lite` curated subset. **Phase 4+** = SearXNG-backed web search. Full English Wikipedia is not an MVP requirement; start curated. `reasoning` and `fast` typically don't need KBs — `reasoning` is largely intrinsic, `fast` is meant to be lightweight.

---

## 7) LAN sharing & access model

### 7.1 Network security model

LAN-gated by user's network device passport system. Devices are admitted to the LAN at the router/firewall layer, before Open WebUI sees the request. Implications:

- Plain HTTP on LAN is acceptable for MVP
- Open WebUI signup acts as identity-attribution, not primary security
- Ollama on `0.0.0.0:11434` is acceptable (network guard mediates)

### 7.2 User modes

- **Power-user mode** — you. `home-llm-lab` CLI from your laptop.
- **Guest mode** — LAN guests. Browser only, bookmark `http://home-llm-lab.local`.

### 7.3 Open WebUI account policy

- First account = admin (you) — first user to sign up at `home-llm-lab.local` automatically becomes admin
- Signup **enabled**, **no approval required**, new users auto-added to **`Guests`** group (`DEFAULT_USER_ROLE=user`)
- `Guests` group has access to: `general`, `fast`, `reasoning`, `digest`, `analyze`, no admin functions
- Per-user chats are private by default (you do not see guests' chats; admins see admin functions, not other users' conversations)
- Rationale: your LAN guard already gates network access at the device-passport layer — Open WebUI approval would be duplicative friction. Account creation exists purely for **identity attribution and per-user history**, not as a security gate. Individuals can be revoked later via the admin panel.

### 7.4 Exposure rules

| Service | LAN exposure |
|---|---|
| Open WebUI :80 | yes (intentional) |
| Ollama :11434 | reachable on LAN; LAN guard mediates |
| SSH :22 | yes (CLI orchestration) |
| Docker daemon | no |

### 7.5 TLS / remote access (Phase 2)

- **LAN:** stays plain HTTP
- **Remote:** Tailscale on host + `tailscale serve` puts Open WebUI on a `*.ts.net` hostname with **automatic real HTTPS** (no internal CA, no per-device cert install). Free for personal use, no port forwarding.

Caddy is only needed if we want LAN-side auth or path routing on top of Open WebUI's own auth.

---

## 8) Wake / warm / open flows

### 8.1 MVP — assume rig is on

WoL is Phase 2. Two viable patterns for MVP:

- **Always-on:** Mac runs with display sleep enabled; containers stay resident.
- **Manual on:** turn on before use; "Wake for network access" enabled for sleep cycles.

`home-llm-lab chat -p X` flow (no wake):
1. SSH host → `home-llm-lab-hostctl up` (idempotent — verifies Open WebUI + Ollama healthy)
2. SSH host → `home-llm-lab-hostctl warm <profile>` (preloads via Ollama API with `keep_alive=30m`)
3. Open browser → `http://home-llm-lab.local/?model=<profile>`

### 8.2 `home-llm-lab chat` URL contract

```text
http://home-llm-lab.local/                                       # bare bookmark
http://home-llm-lab.local/?model=general                         # profile preselect
http://home-llm-lab.local/?model=digest&q=Summarise...           # profile + prefilled query
```

Verify exact URL param names against Open WebUI v0.9.2 docs during implementation.

### 8.3 Warming behavior

`home-llm-lab-hostctl warm <profile>` calls Ollama's `/api/generate` with empty prompt + `keep_alive=30m`. Verify with `ollama ps` / `/api/ps`.

### 8.4 Phase 2 — `home-llm-lab wake`

- Wake-on-LAN magic packet to host MAC
- Wired Ethernet recommended (Wi-Fi WoWLAN is flaky on macOS)
- Or: skip WoL entirely and stay always-on

---

## 9) Host control commands

`home-llm-lab` (client) calls `home-llm-lab-hostctl` (host) over SSH.

```sh
home-llm-lab-hostctl up              # docker compose up -d, verify Open WebUI + Ollama
home-llm-lab-hostctl down            # docker compose down
home-llm-lab-hostctl status          # health (services + ollama ps)
home-llm-lab-hostctl warm <profile>  # preload mapped model via Ollama API
home-llm-lab-hostctl openui-url      # print canonical browser URL
```

---

## 10) Repo layout

Monorepo. Single source of truth for client + host.

```text
home-llm-lab/
  spec.md                        # this doc — architecture & build plan
  profiles.md                    # model selection (single source of truth)

  host/
    docker-compose.yml
    .env.example
    scripts/
      home-llm-lab-hostctl
      healthcheck.sh
      ensure-models.sh
    ollama/Modelfiles/
      general.Modelfile
      fast.Modelfile
      reasoning.Modelfile
      digest.Modelfile
      analyze.Modelfile

  client/
    home-llm-lab                        # single-file POSIX shell client
    config.env.example
    README.md

  # Phase 3+
  sidecar-loader/
    Dockerfile
    app/{sync,manifest,config}.py
  corpora/{python,js-ts,notes}/

  docs/
    architecture.md
    runbook.md
```

---

## 11) Implementation plan

- **Phase 1 — MVP (current target):** see §13 for the concrete checklist + acceptance.
- **Phase 2 — Wake + Remote:** WoL flow (`home-llm-lab wake`); Tailscale + `tailscale serve` for remote HTTPS; Caddy retrofit if needed; `home-llm-lab cli` TTY tunnel.
- **Phase 3 — RAG sidecar:** `sidecar-loader` container; hash-manifest idempotent re-sync; initial corpora; per-profile KB attachments via OWUI API.
- **Phase 4 — Better search:** OWUI web-search toggle; optional SearXNG; `wiki-lite` curated subset.
- **Phase 5 — Hardening:** backup script (snapshot named volume); logging/observability; stricter auth/TLS if needed; restart policies; sleep-survival validation; permission audit.

---

## 12) Implementation notes

### 12.1 Pin upstream tags per profile

Each Modelfile pins an explicit upstream Ollama tag (see [`profiles.md`](profiles.md)). Upgrades happen by editing the `FROM` line and re-running `ollama create`, never by drift.

### 12.2 RAM and KV cache budgeting

Only one profile is resident at a time, so the live limit is the largest profile's weights + its KV cache at the configured `num_ctx`. With weights in the 28–41 GB range and a 64 GB host, headroom under the per-profile defaults in [`profiles.md`](profiles.md) is comfortable. Levers if pressure shows up:

- **Multi-user `general`:** set `OLLAMA_KV_CACHE_TYPE=q8_0`.
- **`reasoning`:** drop `num_ctx` (32K → 16K) if memory pressure shows up.
- **`digest` / `analyze`:** Qwen3-30B-A3B's MoE (3B active per token) keeps prefill fast even at 256K. `digest` weights at ~18 GB, `analyze` at ~25 GB — both leave room for the full KV cache. Pushing past 256K means YaRN-extending the model and accepting prefill slowdown.

### 12.3 Networking on Mac

- Open WebUI port mapping: `- "80:8080"` (host port 80 → container 8080)
- OrbStack auto-resolves `host.docker.internal` to the Mac host
- macOS Application Firewall: allow inbound :80 from LAN; :11434 sits behind the LAN guard

### 12.4 Prefer skills + KB before custom Python

Lower operational risk; easier to share with guests. Only add Pipes / Filters / Actions when there's a clear need.

### 12.5 mDNS gotchas

If guest SSID isolation breaks `home-llm-lab.local` resolution, look for "mDNS reflector" / "Bonjour gateway" setting on the AT&T residential gateway.

---

## 13) First milestone (concrete checklist)

Deliver Phase 1 in this order. Each step is a discrete commit.

1. **Mac prep**
   - Install Ollama.app from [ollama.com/download](https://ollama.com/download)
   - Install OrbStack (downloaded directly from orbstack.dev — faster and lighter on Apple Silicon than Docker Desktop)
   - `LocalHostName=home-llm-lab` (done 2026-04-25)
   - Enable Remote Login (System Settings → General → Sharing → Remote Login)
   - DHCP reservation by MAC at router for stable IP fallback

2. **Ollama base + Modelfiles**
   - Pull each profile's upstream tag (see [`profiles.md`](profiles.md))
   - Write `host/ollama/Modelfiles/{general,fast,reasoning,digest,analyze}.Modelfile`
   - `ollama create general -f general.Modelfile` (and fast, reasoning, digest, analyze)
   - Verify: `ollama list`, `ollama run general "hello"`

3. **Docker stack**
   - `host/docker-compose.yml` — Open WebUI v0.9.2, host :80, named volume
   - `host/.env.example` with `OLLAMA_BASE_URL=http://host.docker.internal:11434`
   - `docker compose up -d`; verify `curl http://home-llm-lab.local`

4. **Open WebUI config**
   - First signup → admin (you)
   - Settings → signups enabled, no approval, default role = `user`
   - Create `Guests` group with access to `general`, `fast`, `reasoning`, `digest`, `analyze`
   - Default group for new signups → `Guests`
   - Configure model entries for all three profiles (system prompts, descriptions)

5. **Host control script**
   - `host/scripts/home-llm-lab-hostctl` (POSIX sh): up, down, status, warm, openui-url
   - Idempotent up; status returns clean text/JSON

6. **Client CLI**
   - `client/home-llm-lab` (POSIX sh): chat, status, warm
   - `client/lib/{config,ssh,openui,profiles}.sh`
   - `~/.config/home-llm-lab/config.env` schema documented

7. **End-to-end acceptance**
   - `home-llm-lab chat -p general` → browser opens with `general` preselected; conversation works
   - `home-llm-lab chat -p digest -q "..."` → preselects + prefills query
   - LAN guest device → `http://home-llm-lab.local` → signs up → immediately chats with all five profiles
   - The profiles behave differently — `reasoning` and `analyze` show `<think>` blocks, `digest` accepts long input without OOM, `general` and `fast` respond quickly
   - **Vision smoke test:** attach a screenshot to a `general` chat → model responds sensibly
   - Restart: `home-llm-lab-hostctl down && up` → state preserved (named volume)
   - Sleep cycle: Mac sleeps and wakes → stack still healthy

### Explicitly NOT in Milestone 1

WoL · Tailscale · Caddy · RAG sidecars · corpora · Wikipedia · web search · custom Python pipes · backup automation · TLS

---

## 14) Open TODOs (settle during implementation)

- [x] ~~Verify exact Q5_K_M tag for Qwen3.6~~ — settled in [`profiles.md`](profiles.md) (`general` uses Q8_0)
- [x] ~~Pick Docker Desktop vs OrbStack~~ — settled: **OrbStack** (faster on Apple Silicon, lighter footprint)
- [x] ~~Confirm Ollama support per profile on Apple Silicon~~ — settled 2026-04-25: `general` (Qwen3.6 loads, runs, vision works), `reasoning` (Nemotron Super 49B v1.5 loads with `<think>` blocks), `digest` (Qwen3-30B-A3B-Instruct-2507 UD-Q4_K_XL — see [`profiles.md`](profiles.md) for the swap-from-Kimi rationale). `fast` and `analyze` added 2026-04-26.
- [ ] **Kimi-Linear staged but not load-bearing.** The Kimi-Linear-48B-A3B GGUF is parked at `~/.ollama/gguf/` from an earlier long-context plan; it doesn't run on Ollama 0.21.2 (kimi-linear runtime not yet shipped). The long-context slot is now `digest` / `analyze` (Qwen3-30B-A3B Instruct/Thinking) — fully working today. Decision deferred: when Ollama eventually ships kimi-linear runtime, evaluate whether to revisit (Kimi's linear attention may give better KV-cache scaling at >256K) or delete the staged GGUF. Keep `~/.ollama/gguf/README.md` in sync as the on-rig record of what's parked and why.
- [ ] Confirm vision works in the `general` profile's upstream model — smoke-test via `ollama run` with image attach before locking the Modelfile
- [ ] Verify Open WebUI URL params (`?model=`, `?q=`) against v0.9.2 docs (resolve at compose-step)
- [ ] Draft initial system prompts for each profile (stub now, iterate)
- [ ] DHCP reservation at router (parallel task; Ethernet + Wi-Fi MACs both reserved to `home-llm-lab`)
- [ ] Pin Ollama version once stack is stable (Ollama.app updates are user-initiated; just avoid clicking "Update" when something's mid-flight)

---

## 15) Reference docs

**Ollama:** [Modelfile](https://docs.ollama.com/modelfile) · [API](https://docs.ollama.com/api) · [keep_alive / FAQ](https://docs.ollama.com/faq) · [CLI](https://docs.ollama.com/cli)

**Profile models:** see [`profiles.md`](profiles.md) for upstream tags, model cards, and the source cheat sheet.

**Open WebUI v0.9.2:** [env config](https://docs.openwebui.com/reference/env-configuration) · [URL params](https://docs.openwebui.com/features/chat-conversations/chat-features/url-params/) · [groups / RBAC](https://docs.openwebui.com/features/authentication-access/rbac/groups/) · [hardening](https://docs.openwebui.com/getting-started/advanced-topics/hardening) · [SearXNG provider](https://docs.openwebui.com/features/chat-conversations/web-search/providers/searxng/)

**Phase 2 prep:** [tailscale serve](https://tailscale.com/kb/1242/tailscale-serve) · [Apple wake-for-network](https://support.apple.com/my-mm/guide/mac-help/mh27905/mac)
