# Manifesto

## Why this exists

A single LLM is a primitive. It is closer to a brain in a jar than a tool — pattern-matching, hallucinatory, with no memory and no agency. What people actually love — ChatGPT, Claude Code — is not "a model." It is an architecture: many models, retrieval, tools, routers, sidecars, agentic loops. The model is one neuron in a larger nervous system.

The frontier hides this. Consumers see a chat box and infer that "the model" is the product. So when they meet a local 30B Qwen they ask it to behave like a hosted system, are disappointed when it can't, and conclude small LLMs are toys.

**This project is the counter-argument.** On a single Apple Silicon Mac, with one model resident at a time, we build the architecture around the model: task-specific profile swaps, a long-context summarizer, a thinking-mode reasoner, an agentic coding loop wired through an Anthropic-API bridge, all behind a shared LAN UI. Small open models, well-orchestrated, are insanely useful — and most of the leverage was always in the orchestration, not the parameter count.

## Three reasons it matters

### 1. Democratization & education

A 64 GB Apple Silicon laptop is not a frontier datacenter, but it can run real, useful models — and a 16 GB MacBook Air is now within striking distance of capability that, a generation ago, lived behind an API key and a credit card. The point is to make that real, not theoretical.

This repo's worked reference is the 64 GB tier (M5 Max Pro). The **32 GB and 16 GB tiers are the explicit goal** — same architecture, same workflow, smaller profile set tuned to the unified-memory budget. The roadmap is to publish all three so a student, a hobbyist, or anyone with the laptop they already own can stand the rig up and learn by running it.

LLMs are about to be the substrate of how knowledge work happens. They should not be a thing you only get to touch through someone else's billing portal.

### 2. Resilience & sovereignty

Cloud LLMs assume good network, good power, and a friendly relationship with the vendor. Local inference assumes none of those.

A laptop with weights on disk and the Ollama runtime cached works:

- **Offline.** Travel, transit, planes, the field.
- **Grid-down or degraded.** Power outage, ISP outage, cell-tower congestion, disaster scenarios.
- **In hostile or non-permissive environments.** Places where the cloud provider is the threat model: blocked networks, surveilled networks, regulated jurisdictions, journalism, dissent.
- **For home automation and edge compute.** A local box on the LAN can drive smart-home reasoning without round-tripping every event to a third party.

On-edge compute is the only kind of compute you actually own. This rig is built so the LLM goes where you go, runs when the network can't, and answers to no one but the person whose laptop it lives on.

### 3. Architecture, not just inference

The mission isn't "run a model." It's to demonstrate that on a single laptop you can compose:

- **Profile-based model swapping** — `general`, `fast`, `reasoning`, `digest`, `analyze`, plus `claw` for agentic coding. Each profile is the *right model for the job*, not a finetune of one base. Picking models is the cheapest, highest-leverage tuning step.
- **Agentic coding loops** via `claw-code` through a LiteLLM Anthropic-API bridge. The same shape Claude Code has — tools, file edits, multi-turn — running entirely against a local model.
- **Long-context summarization and reasoning** with MoE models that prefill quickly enough to make 256K context windows usable on consumer hardware.
- **Retrieval-augmented memory** (Phase 3) — sidecar-loader feeds curated knowledge bases per profile, idempotently synced.
- **A LAN-shared, multi-user UI** so the rig is a shared family / lab resource, not a single-user tool.

That stack — swap + agent + retrieval + UI — is the same general shape the hosted products use. Doing it locally with small open models is the proof.

## What this project actually is

A reference build, fully spec'd, fully reproducible:

- **Host:** Ollama native on Apple Silicon for unified-memory throughput; one profile resident at a time.
- **UI:** Open WebUI in Docker, bound to LAN port 80 via mDNS (`mac-llm-lab.local`), with per-user accounts and a `Guests` group.
- **Agentic coding:** `claw-code` in Docker, talking to a LiteLLM bridge that translates Anthropic API calls into Ollama calls.
- **Five profiles + claw:** see [`profiles.md`](profiles.md) for the model picks, quants, and `num_ctx` settings; [`spec.md`](spec.md) for the architecture.
- **Phased roadmap:** MVP first, then Wake-on-LAN + Tailscale remote HTTPS, then RAG sidecars and curated corpora, then self-hosted search, then hardening.

You can fork it, rebrand it (see the README's fork checklist), and run it on your own LAN. That's the point.

## What this project is not

- Not a model release. We don't train.
- Not a frontier-capability claim. Nemotron 49B isn't GPT-5. The claim is that 49B + the right architecture is *enough* for an enormous fraction of real work.
- Not closed. MIT-licensed, and meant to be copied, modified, and used.
- Not a cloud product. The whole point is that it isn't.

## The bet

Most of the value people get from frontier AI today comes from architectures that small, local, open models can also be slotted into. The remaining gap closes every quarter. Build the architecture now, on hardware you already own, on a model you can read the weights of, and the next time the network goes down — or the vendor changes the rules — you still have the tools.
