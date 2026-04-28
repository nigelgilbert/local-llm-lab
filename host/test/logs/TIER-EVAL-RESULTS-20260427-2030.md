# Tier Eval Results — 2026-04-27 20:30

Tiers: 16 32 64

Models (per models.conf):
- 16GB → Qwen3-14B Q4_K_M
- 32GB → Qwen3-30B-A3B-Instruct-2507 Q4_K_XL (MoE)
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 16GB

```
 Container test-test-run-c09ed12229b6 Creating 
 Container test-test-run-c09ed12229b6 Created 

=== agent-parallel (tier-16) ===
  exit=0 elapsed=22853ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-16)
  ✔ claw creates a.py, b.py, c.py with matching contents (22854.235413ms)
✔ agent: parallel file writes (tier=tier-16) (22854.838184ms)

=== agent-single (tier-16) ===
  exit=0 elapsed=24254ms files=[".claw","hello.py"]
▶ agent: single-file write (tier=tier-16)
  ✔ claw creates hello.py with the requested content (24256.232103ms)
✔ agent: single-file write (tier=tier-16) (24256.873375ms)

=== code-self-test (tier-16) ===
  claw: exit=0 elapsed=42423ms files=[".claw","fib.js"]
  node: exit=0 stdout= stderr=
▶ code self-test: fibonacci implementation (tier=tier-16)
  ✔ claw writes fib.js that passes its own assertions under node (42440.60273ms)
✔ code self-test: fibonacci implementation (tier=tier-16) (42441.171448ms)
  [1/10] ttft=3270ms
  [2/10] ttft=124ms
  [3/10] ttft=128ms
  [4/10] ttft=124ms
  [5/10] ttft=118ms
  [6/10] ttft=126ms
  [7/10] ttft=130ms
  [8/10] ttft=128ms
  [9/10] ttft=128ms
  [10/10] ttft=119ms

=== TTFT (tier-16) ===
  n=10 errors=0
  min=118ms · median=128ms · p95=3270ms · mean=440ms
▶ TTFT — time to first token (tier=tier-16)
  ✔ 10 requests with 25-tool prompt: all succeed, distribution reported (44372.770592ms)
✔ TTFT — time to first token (tier=tier-16) (44373.502274ms)
  [1/20] ok=false stop=max_tokens 8236ms
  [2/20] ok=false stop=max_tokens 7723ms
  [3/20] ok=false stop=max_tokens 7949ms
  [4/20] ok=true stop=tool_use 3995ms
  [5/20] ok=false stop=max_tokens 7647ms
