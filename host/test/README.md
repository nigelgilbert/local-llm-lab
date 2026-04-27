# A/B test harness — Ollama vs llama-server `claw`

Runs the same three suites against both backends back-to-back so you can compare wrap-rate and behaviour without poking around by hand. Tests are ESM and use Node 24's built-in test runner (`node --test`) — no Jest, no `npm install`.

```
┌────────────┐        ┌────────────────┐
│  jest in   │ ─POST→ │ LiteLLM bridge │
│  ephemeral │        │   (running)    │
│  Node      │        └───────┬────────┘
│  container │                │
│            │     ┌──────────┴──────────┐
│ + claw bin │     ▼                     ▼
└────────────┘  Ollama               llama-server
                (Phase A)            (Phase B)
```

Two phases per run, because both 26 GB GGUF runners can't be resident in 64 GB unified memory at once:

| Phase | Backend | How loaded                                                              |
|-------|---------|-------------------------------------------------------------------------|
| A     | Ollama  | `ollama create claw-test -f host/ollama/Modelfiles/claw.Modelfile`      |
| B     | llama-server | `launchctl load ~/Library/LaunchAgents/com.home-llm-lab.llama-server.plist` |

`run.sh` swaps them: unload llama-server, run Phase A, tear down `claw-test`, load llama-server, run Phase B. A `trap` restores production state on early exit.

## Suites

| File                                  | What it measures                                                                 |
|---------------------------------------|----------------------------------------------------------------------------------|
| `__tests__/wrap-rate.test.js`         | 10× `/v1/messages` streamed; counts `stop_reason: tool_use`. Headline metric.   |
| `__tests__/eval-a-hello.test.js`      | Spawns `claw -p "create hello.py..."`, asserts file content.                    |
| `__tests__/eval-b-parallel.test.js`   | Three-files-in-one-response; checks for duplicate-tool-call regression.         |

Per-backend wrap-rate floor lives in [`lib/backend.js`](lib/backend.js) (llama-server ≥ 0.9, Ollama ≥ 0.5).

## Prerequisites

- Bridge running: `cd host/litellm && docker compose up -d`
- claw image built: `cd client/claw-code && docker compose build`
- llama-server LaunchAgent installed (see [`../llama-server/README.md`](../llama-server/README.md))
- `ollama` CLI on host PATH

## Run

```sh
host/test/run.sh
```

That's it — the orchestrator handles backend swaps, container build, and cleanup.

## Single-phase run

If you only want one backend (debugging a specific path):

```sh
# Make sure the right backend is loaded yourself, then (note --env-file —
# compose-time ${LITELLM_MASTER_KEY} interpolation needs it from the host shell):
docker compose --env-file host/litellm/.env -f host/test/docker-compose.yml run --rm -e BACKEND=ollama       test
docker compose --env-file host/litellm/.env -f host/test/docker-compose.yml run --rm -e BACKEND=llama-server test
```

## What gets routed where

The bridge config carries four test-only routes (additive — production `claw` and `anthropic/claw` continue to point at llama-server):

| Bridge model name        | Upstream                         |
|--------------------------|----------------------------------|
| `claw-llama`             | `openai/claw` @ `LLAMA_SERVER_BASE` |
| `anthropic/claw-llama`   | `openai/claw` @ `LLAMA_SERVER_BASE` |
| `claw-ollama`            | `openai/claw-test` @ `OLLAMA_OPENAI_BASE` |
| `anthropic/claw-ollama`  | `openai/claw-test` @ `OLLAMA_OPENAI_BASE` |

`lib/backend.js` picks one pair based on `BACKEND` env.
