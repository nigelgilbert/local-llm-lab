# Tier Eval Results — 2026-04-28 04:27

Tiers: 64

Models (per models.conf):
- 16GB → Qwen2.5-7B-Instruct Q5_K_M
- 32GB → Qwen3-14B Q4_K_M
- 64GB → Qwen3-Coder-30B Q6_K_XL

## Tier 64GB

```
 Container test-test-run-ab34c218472b Creating 
 Container test-test-run-ab34c218472b Created 

=== adversarial-input (tier-64) ===
  claw: exit=0 elapsed=9810ms files=[".claw",".sandbox-home",".sandbox-tmp","slugify.js","verify.js"]
  node post-fix: exit=0 stderr=
▶ adversarial inputs: slugify (tier=tier-64)
  ✔ claw implements slugify robustly enough for adversarial inputs (9834.156244ms)
✔ adversarial inputs: slugify (tier=tier-64) (9834.628768ms)

=== agent-parallel (tier-64) ===
  exit=0 elapsed=2838ms files=[".claw","a.py","b.py","c.py"]
▶ agent: parallel file writes (tier=tier-64)
  ✔ claw creates a.py, b.py, c.py with matching contents (2840.887708ms)
✔ agent: parallel file writes (tier=tier-64) (2841.749631ms)
