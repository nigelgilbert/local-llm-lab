# Tier Eval Results — 2026-04-27 20:28

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-1436f0bd4118 Creating 
 Container test-test-run-1436f0bd4118 Created 

=== eval-a (llama-server) ===
  exit=0 elapsed=16989ms files=[".claw","hello.py"]
▶ eval A — single-file write (backend=llama-server, model=anthropic/claw-llama)
  ✔ claw creates hello.py with the requested content (16990.520955ms)
✔ eval A — single-file write (backend=llama-server, model=anthropic/claw-llama) (16991.108542ms)

=== eval-b (llama-server) ===
  exit=0 elapsed=18756ms files=[".claw","a.py","b.py","c.py"]
▶ eval B — three parallel writes (backend=llama-server, model=anthropic/claw-llama)
  ✔ claw creates a.py, b.py, c.py with matching contents (18758.025545ms)
✔ eval B — three parallel writes (backend=llama-server, model=anthropic/claw-llama) (18758.597882ms)
▶ prose density via claw (backend=llama-server, model=anthropic/claw-llama)
  ﹣ 3× markdown response: len ≥ 600, newlines ≥ 5, bullets ≥ 3 — KNOWN ISSUE, see header (0.278335ms) # SKIP
✔ prose density via claw (backend=llama-server, model=anthropic/claw-llama) (0.630838ms)

=== wrap-rate (llama-server) ===
  [1/10] ok=false stop=max_tokens tool_use=false 5197ms
  [2/10] ok=false stop=max_tokens tool_use=false 5067ms
  [3/10] ok=false stop=max_tokens tool_use=false 5112ms
  [4/10] ok=false stop=max_tokens tool_use=false 5104ms
  [5/10] ok=false stop=max_tokens tool_use=false 5110ms
  [6/10] ok=false stop=max_tokens tool_use=false 5135ms
  [7/10] ok=false stop=max_tokens tool_use=false 5119ms
  [8/10] ok=false stop=max_tokens tool_use=false 5114ms
  [9/10] ok=false stop=max_tokens tool_use=false 5078ms
  [10/10] ok=false stop=max_tokens tool_use=false 5154ms
  rate    = 0/10 = 0.00  (threshold 0.9)
  latency = min 5067ms · median 5114ms · p95 5197ms · mean 5119ms
▶ wrap-rate (backend=llama-server, model=claw-llama)
  ✖ 10 streamed calls land on stop_reason=tool_use ≥ 90% (51191.27932ms)
✖ wrap-rate (backend=llama-server, model=claw-llama) (51192.116158ms)

=== agent-parallel (unknown) ===
  exit=0 elapsed=11883ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (model=unknown, bridge=anthropic/claw-llama)
  ✔ claw creates a.py, b.py, c.py with matching contents (11885.601086ms)
✔ agent: parallel file writes (model=unknown, bridge=anthropic/claw-llama) (11886.198381ms)

=== agent-single (unknown) ===
  exit=0 elapsed=7729ms files=[".claw","hello.py"]
▶ agent: single-file write (model=unknown, bridge=anthropic/claw-llama)
  ✔ claw creates hello.py with the requested content (7731.323785ms)
✔ agent: single-file write (model=unknown, bridge=anthropic/claw-llama) (7731.974372ms)
