# Local LLM Profiles — 64GB RAM

Five Ollama profiles for a 64GB Apple Silicon box. The core three (`general`, `reasoning`, `digest`) come from the April 2026 cheat sheet by @gkisokay; `fast` and `analyze` are extensions on the same family lines for triage and corpus-reasoning use cases.

## Profile Spec

| Profile | Model | Quant | Size | `num_ctx` | Why |
|---|---|---|---|---|---|
| `general` | Qwen3.6-27B | Q8_0 | 28.60 GB | 131072 (128K) | "Best Overall" pick — near full-quality Q8, beats Llama 3.3 70B on reasoning benchmarks, Opus-adjacent coding quality. Daily driver for chat, coding, and quick questions. |
| `fast` | Qwen3.6-35B-A3B | UD-Q4_K_XL | 22.40 GB | 32768 (32K) | MoE 35B/3B for snappy triage. ~3B active params per token = bandwidth-cheap decode (~250 tok/s theoretical on M5 Max). Different shape than `general` — fast over thoughtful, no `<think>` blocks. |
| `reasoning` | Nemotron Super 49B v1.5 | Q6_K | 40.92 GB | 65536 (64K) | "Best Reasoning" — NVIDIA's pruned Llama 3.3 70B, the strongest reasoning specialist in the tier. Math, structured analysis, agent planning. |
| `digest` | Qwen3-30B-A3B-Instruct-2507 | UD-Q4_K_XL | 17.70 GB | 262144 (256K) | Long-context extract / summarize — 256K native context, MoE 30B/3B for fast prefill on huge documents and full codebases. No thinking, direct answers. |
| `analyze` | Qwen3-30B-A3B-Thinking-2507 | UD-Q6_K_XL | 25.00 GB | 262144 (256K) | Sibling of `digest`, Thinking post-train. Same long-context MoE, but reasons across the corpus before answering. Slower time-to-first-final-token, better multi-hop interpretation. |

## Sourcing

Most quants we want aren't published in the Ollama library — they live on HuggingFace as community GGUFs. Ollama imports local GGUFs via `Modelfile FROM /path/to/file.gguf`, so this is a one-time download per profile.

| Profile | Source | Pull / import |
|---|---|---|
| `general` | Ollama library | `ollama pull qwen3.6:27b-q8_0` |
| `fast` | [unsloth / HF](https://huggingface.co/unsloth/Qwen3.6-35B-A3B-GGUF) | download `Qwen3.6-35B-A3B-UD-Q4_K_XL.gguf` (22.4 GB) → `FROM /path` in Modelfile |
| `reasoning` | [bartowski / HF](https://huggingface.co/bartowski/nvidia_Llama-3_3-Nemotron-Super-49B-v1_5-GGUF) | download `nvidia_Llama-3_3-Nemotron-Super-49B-v1_5-Q6_K.gguf` (40.92 GB) → `FROM /path` in Modelfile |
| `digest` | [unsloth / HF](https://huggingface.co/unsloth/Qwen3-30B-A3B-Instruct-2507-GGUF) | download `Qwen3-30B-A3B-Instruct-2507-UD-Q4_K_XL.gguf` (17.7 GB) → `FROM /path` in Modelfile |
| `analyze` | [unsloth / HF](https://huggingface.co/unsloth/Qwen3-30B-A3B-Thinking-2507-GGUF) | download `Qwen3-30B-A3B-Thinking-2507-UD-Q6_K_XL.gguf` (25 GB) → `FROM /path` in Modelfile |

> **`reasoning` quant note:** bartowski also publishes `Q6_K_L` (41.43 GB) — same Q6_K weights with Q8_0 embed/output layers for a small fidelity uplift. Either is defensible; we pick plain `Q6_K` to match the cheat sheet. Switch is a one-line `FROM` change if we want to A/B.

> **MoE quant note (`fast`, `digest`, `analyze`):** we pick unsloth's **UD-XL** (Dynamic 2.0) variants over stock `Q*_K_M`. Per-layer quant tailoring (Q5+ on critical attention/MoE-router/embed matrices, Q4 on the rest) measurably outperforms the standard recipe — Unsloth's own KL-divergence numbers rank #1 on 21 of 22 model sizes against bartowski imatrix and stock quants. UD-Q4_K_XL is also typically *smaller* than stock Q4_K_M because the recipe doesn't waste bits where they don't help.

> **`analyze` quant uplift:** we pick UD-Q6_K_XL (25 GB) for `analyze` rather than the matching UD-Q4_K_XL (~16 GB). Reasoning over a corpus is more quant-sensitive than direct extraction — small errors in attention/router accumulate over multi-hop thinking. The extra 8 GB buys real interpretive quality. Drop to UD-Q4_K_XL if disk/RAM is tight.

## When to use which

- **`general`** — default for everything. Chat, coding, quick questions, day-to-day work.
- **`fast`** — triage and snappy one-liners. "What's the syntax for X", "give me the bash one-liner". Bandwidth-cheap MoE, no thinking.
- **`reasoning`** — when you need it to actually think hard. Math problems, multi-step analysis, structured planning, evaluating tradeoffs.
- **`digest`** — when you're feeding it a lot of source material and want a direct extract or summary. Long PDFs, full codebases, multi-document reading.
- **`analyze`** — same long-context capability as `digest`, but when you want it to *reason across* the material rather than extract. Comparative synthesis, multi-hop questions over a corpus, interpretive work.

## Context Window Settings

- **`general` → 128K (`num_ctx: 131072`)** — vendor's recommended floor for preserving thinking quality. Qwen3.6-27B at 28.6 GB leaves room for KV cache at this size. Drop to 64K if you want to free RAM for other apps.
- **`fast` → 32K (`num_ctx: 32768`)** — triage rarely needs deep context; smaller KV budget loads faster. Model native is 256K if you ever need it; vendor advises ≥128K only when running thinking-on, which `fast` doesn't.
- **`reasoning` → 64K (`num_ctx: 65536`)** — Nemotron is the biggest model at 40.92 GB, so KV cache budget is tight, but 64K is comfortable. Reasoning tasks rarely need huge context. Drop to 32K if memory pressure shows up.
- **`digest` → 256K (`num_ctx: 262144`)** — Qwen3-30B-A3B-Instruct-2507's native trained context. The 30B/3B MoE means only ~3B params fire per token, so prefill on huge inputs is unusually quick for a model of this caliber. UD-Q4_K_XL weights at 17.7 GB leave ~46 GB of headroom — enough for the full 256K KV cache with comfortable system overhead. Push higher only if you actually need it and accept the prefill cost.
- **`analyze` → 256K (`num_ctx: 262144`)** — same reasoning as `digest`. Q6_K_XL weights at 25 GB are heavier; full 256K KV cache still fits comfortably.

## Sizing Notes

- Only one profile is resident at a time, so RAM is not a concern when stacking profiles.
- Largest by weights: `reasoning` ~41 GB. Then: `general` ~29 GB, `analyze` ~25 GB, `fast` ~22 GB, `digest` ~18 GB. All comfortably within a 64GB box (leaves headroom for OS + KV cache + apps).

## Source

Cheat sheet by @gkisokay, April 2026: https://www.reddit.com/r/vibecoding/comments/1sv32zx/the_local_llm_cheat_sheet_for_your_64gb_ram_device/?utm_source=share&utm_medium=web3x&utm_name=web3xcss&utm_term=1&utm_content=share_button
