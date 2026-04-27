# LiteLLM bridge

Anthropic-protocol shim in front of Ollama. Lets `claw-code` and any other Anthropic-shaped CLI talk to local models without touching the Ollama API directly.

The goal of this architecture — LiteLLM shim + llama-server back-end — is to improve real-world coding quality: keep the Anthropic tool-use protocol intact end-to-end so agentic coding tools work the same way locally as they do against the cloud API.

```
┌────────────────┐  Anthropic API   ┌──────────┐    Ollama     ┌────────┐
│  claw / aider  │ ───────────────▶ │ LiteLLM  │ ────────────▶ │ Ollama │
│  /any LAN cli  │   /v1/messages   │  :4000   │               │ :11434 │
└────────────────┘                  └──────────┘               └────────┘
```

Two upstream paths to Ollama, picked per route in [`litellm-config.yaml`](./litellm-config.yaml):
- **`openai/<name>`** → `/v1/chat/completions` (OpenAI-compat) — used for routes that need to stream **tool calls**. The native Ollama provider (`ollama_chat/*`) drops `tool_calls.arguments` in its Anthropic SSE translation, so anything tool-using *must* go via `openai/`. The `litellm_settings.use_chat_completions_url_for_anthropic_messages: true` flag pins Anthropic-input traffic to `/v1/chat/completions`; without it LiteLLM auto-routes to `/v1/responses` where Ollama's tool-call parser falls back to text content for large request shapes (50+ tools). See the [`claw` route comment in litellm-config.yaml](./litellm-config.yaml).
- **`ollama_chat/<name>`** → `/api/chat` — fine for plain chat-only routes.

### Streaming patch

[`./patches/streaming_iterator.py`](./patches/streaming_iterator.py) overrides `litellm/llms/anthropic/experimental_pass_through/adapters/streaming_iterator.py` via a docker volume mount. The upstream file drops tool-call arguments when the OpenAI-compat upstream emits a tool_call as a single chunk with the args fully populated — which is what Ollama does, since the `<tool_call>...</tool_call>` block (qwen3-coder, qwen2.5-coder, llama3.2-with-tools, mistral-with-tools, etc.) is parsed atomically. The patch re-emits the trigger chunk as a `content_block_delta(input_json_delta)` after `content_block_start`, so Anthropic clients (claw-code, etc.) see the args.

**Scope:** the patch is model-agnostic at the Ollama layer. Swapping `claw` for any other tool-using Ollama model — any other Qwen variant, llama3.2, mistral, gemma, etc. — needs no patch changes; the bug and fix live in LiteLLM, not the model. Same patch also fixes the analogous less-obvious bug for true OpenAI streaming (first args chunk dropped → corrupted JSON). Plain text completions and Anthropic-native passthrough are untouched. Header comment in [`patches/streaming_iterator.py`](./patches/streaming_iterator.py) has the full scope/safety analysis.

**On LiteLLM image upgrade**, re-snapshot upstream and re-apply the marked patches:
```sh
docker exec cyberia-litellm cat /usr/lib/python3.13/site-packages/litellm/llms/anthropic/experimental_pass_through/adapters/streaming_iterator.py > /tmp/upstream.py
diff host/litellm/patches/streaming_iterator.py /tmp/upstream.py
# re-apply the PATCH (cyberia local-llm-lab) blocks into a fresh copy, mv into place, docker compose up -d --force-recreate.
```
If upstream fixes the bug, delete the patch file and the volume mount.

**Quick verification:**
```sh
docker exec cyberia-litellm grep -c "PATCH (cyberia local-llm-lab)" \
  /usr/lib/python3.13/site-packages/litellm/llms/anthropic/experimental_pass_through/adapters/streaming_iterator.py
# Expect: 3  (header marker + sync iterator + async iterator)
```

Runs on the lab host alongside Ollama and Open WebUI. Independent compose stack — bouncing it doesn't touch OWUI.

## Setup

```sh
cd host/litellm
cp .env.example .env
$EDITOR .env             # set LITELLM_MASTER_KEY
docker compose up -d
```

Verify:
```sh
curl -fsS http://localhost:4000/health/liveliness
# {"status":"healthy"}

curl -fsS http://cyberia.local:4000/health/liveliness
# same — confirms LAN reachability
```

End-to-end smoke (Anthropic-format request → Ollama):
```sh
curl -sS http://localhost:4000/v1/messages \
  -H "x-api-key: $(grep ^LITELLM_MASTER_KEY= .env | cut -d= -f2)" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"general","max_tokens":64,"messages":[{"role":"user","content":"say hi"}]}'
```

Tool-use smoke (only meaningful against tool-capable models — `claw` or `general`):
```sh
curl -sS http://localhost:4000/v1/messages \
  -H "x-api-key: $(grep ^LITELLM_MASTER_KEY= .env | cut -d= -f2)" \
  -H "anthropic-version: 2023-06-01" \
  -H "content-type: application/json" \
  -d '{"model":"anthropic/claw","max_tokens":256,
       "tools":[{"name":"echo","description":"echo input","input_schema":{"type":"object","properties":{"msg":{"type":"string"}},"required":["msg"]}}],
       "messages":[{"role":"user","content":"call echo with msg=\"hi\""}]}' \
  | python3 -m json.tool
# Expect: stop_reason=tool_use, content[1].input populated.
```

## Operations

```sh
docker compose ps
docker compose logs -f          # request/response visible here
docker compose restart          # apply litellm-config.yaml edits
docker compose down
```

## Routing model

Three layers of model_list entries in [`litellm-config.yaml`](./litellm-config.yaml):

1. **Bare profile names** (`general`, `fast`, `reasoning`, `digest`, `analyze`) routed via `ollama_chat/*` — for direct curl / non-tool clients.
2. **`anthropic/<profile>`** mirrors of all five plus `claw` — required because `claw-code`'s `--model` parser only accepts `provider/model` syntax. The `anthropic/claw` route uses `openai/claw` upstream (tool-use streaming); the others use `ollama_chat/*`.
3. **`"*"` wildcard** catches any unmapped model name (e.g. claw's default `claude-opus-4-6` alias) and routes to `general` so requests don't 404.

### Adding a route

1. Add an entry to [`litellm-config.yaml`](./litellm-config.yaml) pointing at an existing Ollama model name.
2. Pick the upstream provider:
   - `openai/<name>` if the client streams tool calls (Anthropic SSE / `claw-code` / similar agent harnesses).
   - `ollama_chat/<name>` if it's plain chat or non-streaming.
3. `docker compose restart`.

## Security note

Port `4000` is LAN-exposed. Same threat model as the Ollama port (`:11434`): anything that can reach the LAN can hit the bridge. Keep the network guard / passport that already protects `:11434` covering `:4000` too. The `LITELLM_MASTER_KEY` is the *only* gate between LAN and free model access — rotate if it leaks.

## Pairs with

- [`../../client/claw-code/`](../../client/claw-code/) — claw-code in Docker, points at this bridge.
- `cyberia warm -p <profile>` from [`../../client/`](../../client/) preheats whichever Ollama model the bridge will route to.
