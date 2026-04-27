// Streamed Anthropic /v1/messages client used by wrap-rate.
//
// We could use the official @anthropic-ai/sdk, but the wrap-rate metric needs
// us to inspect the *event stream* (specifically: did `message_delta` carry
// `stop_reason: tool_use`?), so a small SSE parser is simpler and dependency-
// free. The bridge speaks the standard Anthropic event shape thanks to the
// streaming_iterator.py shim in host/litellm/patches/.

const BRIDGE_URL = process.env.BRIDGE_URL || 'http://host.docker.internal:4000';
const API_KEY    = process.env.ANTHROPIC_API_KEY;

if (!API_KEY) {
  throw new Error('ANTHROPIC_API_KEY not set — docker-compose.yml should pull this from ../litellm/.env');
}

async function streamMessage({ model, messages, tools, system, maxTokens = 512 }) {
  const res = await fetch(`${BRIDGE_URL}/v1/messages`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': API_KEY,
      'anthropic-version': '2023-06-01',
    },
    body: JSON.stringify({
      model,
      max_tokens: maxTokens,
      messages,
      ...(tools  ? { tools }  : {}),
      ...(system ? { system } : {}),
      stream: true,
    }),
  });

  if (!res.ok) {
    const body = await res.text().catch(() => '');
    throw new Error(`bridge ${res.status} ${res.statusText}: ${body.slice(0, 500)}`);
  }

  const events = [];
  const blocks = [];          // accumulated content blocks, indexed
  let stopReason = null;

  const reader  = res.body.getReader();
  const decoder = new TextDecoder();
  let buf = '';

  while (true) {
    const { value, done } = await reader.read();
    if (done) break;
    buf += decoder.decode(value, { stream: true });

    let sep;
    while ((sep = buf.indexOf('\n\n')) !== -1) {
      const raw = buf.slice(0, sep);
      buf = buf.slice(sep + 2);
      const evt = parseSSE(raw);
      if (!evt) continue;
      events.push(evt);

      // Accumulate enough state to expose a usable final message at end of stream.
      switch (evt.type) {
        case 'content_block_start': {
          blocks[evt.index] = { ...evt.content_block, _text: '', _json: '' };
          break;
        }
        case 'content_block_delta': {
          const b = blocks[evt.index] || (blocks[evt.index] = { type: 'text', _text: '', _json: '' });
          if (evt.delta.type === 'text_delta')        b._text += evt.delta.text || '';
          else if (evt.delta.type === 'input_json_delta') b._json += evt.delta.partial_json || '';
          break;
        }
        case 'message_delta': {
          if (evt.delta && evt.delta.stop_reason) stopReason = evt.delta.stop_reason;
          break;
        }
      }
    }
  }

  // Finalize block payloads.
  const content = blocks.filter(Boolean).map((b) => {
    if (b.type === 'tool_use') {
      let input = b.input;
      if ((!input || Object.keys(input || {}).length === 0) && b._json) {
        try { input = JSON.parse(b._json); } catch { /* leave raw _json visible for debugging */ }
      }
      return { type: 'tool_use', id: b.id, name: b.name, input };
    }
    if (b.type === 'text') {
      return { type: 'text', text: b._text };
    }
    return b;
  });

  return {
    events,
    stopReason,
    content,
    hasToolUse: content.some((c) => c.type === 'tool_use'),
  };
}

function parseSSE(raw) {
  let event = 'message';
  const dataLines = [];
  for (const line of raw.split('\n')) {
    if (line.startsWith('event:')) event = line.slice(6).trim();
    else if (line.startsWith('data:')) dataLines.push(line.slice(5).trim());
  }
  if (dataLines.length === 0) return null;
  const data = dataLines.join('\n');
  if (data === '[DONE]') return null;
  try {
    const parsed = JSON.parse(data);
    return { ...parsed, type: parsed.type || event };
  } catch {
    return null;
  }
}

module.exports = { streamMessage };
