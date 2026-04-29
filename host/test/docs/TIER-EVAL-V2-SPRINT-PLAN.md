# Tier-Eval Suite v2 — Sprint Plan

**Date:** 2026-04-29
**Status:** Engineering plan, accepted for execution. Sprint 0 in progress.
**Source:** Derived from `Tier-Eval Suite Improvement Plan V2` (study-owner / PhD-student
revised draft, 2026-04-29) plus the planning Q&A captured below.
**Audience:** Harness engineers continuing this work across sessions/compactions.
**Scope:** What this iteration will build, in what order, and what it explicitly
will not build.

---

## Plan philosophy

The strategy doc is correct and does not need redesign. The risk is sequencing:
if engineering starts production lower-tier sweeps before the canonical schema
exists, every row produced before the schema lands becomes legacy-asterisked
the moment the schema ships. Therefore Sprint 0 is a hard gate.

This iteration ships five things, in order. Anything not on this list is
explicitly deferred to a later iteration.

1. Phase 0 foundation — registry, manifests, decision rule, thermal policy.
2. One overnight cross-tier screen (Phase 1A) under the new schema.
3. Discrimination matrix v1 — screening labels only, no test drops yet.
4. Productivity grader **design** + calibration set — no productivity tests in
   the core matrix yet.
5. Hidden-holdout policy + Stage 0–4 model-trial funnel skeleton.

DOE/sampler comparisons, full agentive expansion, frontier stress tests, and
new coding test families are **next iteration**, not this one.

---

## Decisions captured in Q&A (2026-04-29)

These shaped the schema and budget; they are not up for re-litigation in
implementation sprints.

| Question | Decision |
|---|---|
| Tier emulation vs. physical hardware | Physical machines exist (tier-16 already confirmed working) but **only one is available for sweeps at a time** — three-machine parallel execution is not on the table for the foreseeable future. All sweeps run serially on a single M5 Max MBP, switching tier configuration between runs. Apple SoC unified-memory family is treated as homogeneous in latency/throughput dimensions until evidence shows otherwise. |
| Schema: `hardware_id` field | **Dropped.** Single physical machine per tier; no per-machine aggregation needed. |
| Schema: `soc_generation` field | **Dropped.** We can't synthesize an M1 result on an M5; the field would be decorative metadata only. Reintroduce a minimal `machine_label` if a future iteration adds a second physical unit at the same tier. |
| Canonical hardware fields | `hardware_tier` (16/32/64) and `memory_gb`. That's it. |
| Hidden-holdout storage | Restricted directory in this repo, gitignored. `host/test/__tests__/tier-eval-hidden/`. Stage 3 admission runner reads from this path; if missing, Stage 3 is skipped with a visible warning rather than silently passing. |
| Productivity judge model | **Opus** (`claude-opus-4-7`) via Claude API. Version recorded in every grader output row. Prompt caching enabled (system prompt + rubric cached, only candidate output varies). Local model never grades itself or its peers. |
| Sprint 1 execution model | **Single M5 Max MBP, serial.** Parallel-across-three-machines is not an option for the foreseeable future. Sprint 1 uses the strategy doc's §8 Phase 1A overnight recipe as written, including the "single-hardware config latency" caveat (latency must be labeled as single-hardware config latency, not final product-tier latency; pass/fail and trace tags remain informative). No open follow-ups blocking Sprint 1 kickoff. |

---

## Sprint 0 — Phase 0 foundation (the gating sprint)

**Goal:** every subsequent run lands in the registry with provenance. Production
lower-tier sweeps cannot start until all sign-off criteria below are met.

**Deliverables (concrete, named):**

| # | Deliverable | Lands in |
|---|---|---|
| 0.1 | `run_registry.schema.json` — fields per §6.2 of strategy doc, minus `hardware_id` and `soc_generation`. Includes `canonical_status` enum (`canonical` / `legacy-compatible` / `legacy-asterisked` / `excluded`) and `thermal_status` enum (`clean` / `warning` / `contaminated` / `unknown`). | `host/test/lib/registry.js` (new) + JSON schema sidecar. |
| 0.2 | `model_config.schema.json` — 9 fields per §5.3 (`model_id`, `model_family`, `parameter_count`, `quantization`, `context_limit`, `runtime_backend`, `sampler_config_id`, `harness_version`, `prompt_pack_version`). | `host/test/lib/`. |
| 0.3 | `test_manifest.schema.json` — primary axis, secondary axes, suite layer (A/B/C/D), difficulty band, oracle type, known confounds, keep/drop rule. | `host/test/lib/`. |
| 0.4 | Migrate the 35 tier-eval files to declare a manifest header (axis tags + suite layer). Test bodies untouched. | `host/test/__tests__/tier-eval/*.test.js`. |
| 0.5 | Historical-data bucketing pass: every existing CSV/run gets `canonical` / `legacy-compatible` / `legacy-asterisked` / `excluded`. Output: `historical_bucketing.csv` index. | `host/test/docs/`. |
| 0.6 | Statistical decision rule, written. The §9.2 rule: 25 pp point spread + non-overlapping 80% Wilson intervals. New label `provisional_discriminator` for borderline cases. | `host/test/docs/EVAL-DESIGN.md` addendum. |
| 0.7 | Thermal telemetry hook: capture start/end/peak SoC temp + tokens/sec into the registry. Best-effort on macOS (`powermetrics` or sudo-free fallback). | `host/test/lib/claw.js` or new `host/test/lib/telemetry.js`. |
| 0.8 | Hidden-holdout policy memo. Storage = `host/test/__tests__/tier-eval-hidden/` (gitignored). Access rules, rotation cadence, who can author/view. **Decision document only — no holdouts authored yet.** | `host/test/docs/`. |
| 0.9 | Productivity-grader design memo. Judge pinned to `claude-opus-4-7`. Calibration set spec, human review loop, prompt-caching plan, Opus API budget per cycle and per production run. **Design only — no graders built yet.** | `host/test/docs/`. |

**Sign-off gate (do not run Sprint 1 until ALL of these pass):**

- A single dry-run lands in the registry with all mandatory fields populated.
- Smoke run on each tier emits `thermal_status` and a `model_config_id` that
  resolves against the model-config manifest.
- Historical bucketing index reviewed; legacy comparisons in any future
  dashboard show their bucket label visibly.
- §9.2 decision rule signed off in writing.

**Scope discipline:** Sprint 0 does **not** touch test bodies beyond adding
manifest headers. No new tests. No new graders. No model trials.

---

## Sprint 1 — Overnight cross-tier screen (Phase 1A)

**Goal:** produce the first cross-tier signal honestly, under the new schema.

**Recipe (locked):**

| Setting | Value |
|---|---|
| `run_kind` | `overnight_screen`. |
| Hardware | **Single M5 Max MBP, serial.** tier-16 / tier-32 / tier-64 are realized by switching model/config/context between runs — three-machine parallel is not available. |
| Tier coverage | Full tier-16 + tier-32 screen. tier-64 reused from canonical-compatible historical data when available, plus a small anchor panel (5 tests × n=5–10) to detect drift. No-reuse fallback if historical tier-64 isn't compatible: tier-16 + tier-32 + tier-64 at n=8. |
| Tests | Existing telemetry-compatible 35-test set, manifests applied. **No new productivity/agentive families in this run.** |
| Sampler | One — current product/default sampler. No v3-deterministic in this pass. |
| n | 10 per cell preferred; drop to 8 globally if projected runtime > overnight budget. |
| Order | Interleave by tier × test × seed. |
| Thermal | Telemetry only, no blanket cooldown (a 60s blanket cooldown would consume a meaningful fraction of an overnight budget on serial hardware). Flag warning/contaminated rows. |
| Latency labeling | Mandatory: every row records latency as **single-hardware config latency**, not final product-tier latency. Pass/fail and trace tags are still treated as informative. |
| Hard stop | If wall clock projects past the next workday, finish coverage at lower n rather than deepening any cell. |
| Output label | `screening_only=true` on every row. |

**Tight-night fallback subset** (used if budget collapses): keep one test per
axis from the §8 Phase 1A priority subset table in the strategy doc. Substitute
the closest sibling on the same axis if a named test is unavailable.

**Allowed conclusions from this run:**

- "This test is a candidate discriminator worth confirming."
- "This test appears ceiling/floor under the current model/config; needs confirmation."
- "This axis appears tier-sensitive and deserves deeper sampling."
- "This run was contaminated and should be rerun."

**Forbidden conclusions:**

- "Drop this test permanently."
- "This model passes admission."
- "Tier-32 is definitively better/worse by X percentage points."
- "Sampler A beats sampler B." (Sampler comparisons are out of scope here.)

---

## Sprint 2 — Discrimination matrix v1 + confirmatory plan

**Goal:** classify tests as screening candidates and decide which deserve a
confirmatory night.

**Deliverables:**

- `discrimination_matrix_v1.csv` with all §8 Phase 2 columns: pass rates +
  Wilson CIs, point spread, credible-spread flag, monotonicity, harness-error
  rate, thermal-contamination rate, p90 iters/wallclock, dominant trace tags,
  oracle type.
- Per-test classification using §9.2: `core_discriminator_candidate`,
  `provisional_discriminator`, `likely_ceiling`, `likely_floor`,
  `noisy_diagnostic`, `harness_contaminated`, `thermal_contaminated`. **No
  keep/drop decisions yet — all labels are screening-only.**
- Confirmatory-night plan: top ~6–10 `provisional_discriminator` cells, n
  derived from §9.3 power calculation against a 25 pp target, paired seeds.
- Axis scorecard v1 (§8 Phase 3 table) with explicit "Not measured" for
  productivity. **No aggregate score.**

**Visible-everywhere rule for this iteration:** "tier-32 scored X%" is forbidden
in any leadership-facing artifact.

---

## 6. Sprint 3 — Productivity grader + calibration set (design lands, tests don't)

**Goal:** make productivity grading credible **before** it enters the matrix.
Per §10.3 this is 1–2 sprint weeks of dedicated infra work.

**Deliverables:**

- Pinned judge: `claude-opus-4-7` via Claude API. Version recorded per row.
- Calibration set: ~30 examples per family across pass/fail/borderline. Start
  with the two cheapest §10.1 families: changelog summarization + email rewrite.
- Two humans grade the calibration set; disagreement adjudication recorded.
- Judge–human agreement measured; threshold for "trust the judge at scale"
  written down.
- Hybrid grader scaffolding (deterministic checks + semantic match + judge),
  wired to two pilot productivity tests run as `run_kind=pilot`. **Not added to
  the core matrix yet.**
- Prompt caching enabled (system prompt + rubric cached; only candidate output
  varies per call).

Productivity enters Layer B core only after this sprint's review confirms
judge-human agreement is acceptable.

---

## Sprint 4 — Hidden holdouts + model-trial protocol skeleton

**Goal:** make §15's Stage 0–4 funnel implementable so the next model trial
doesn't enter through ad-hoc tuning.

**Deliverables:**

- `host/test/__tests__/tier-eval-hidden/` created. Added to `.gitignore`.
- One hidden sibling per Layer-B core test (small reserve pool), authored from
  the §7.4 generalization patterns: similar task / new inputs, same spec /
  unseen edge combinations, etc.
- Rotation cadence committed in writing.
- `host/test/run-model-trial.sh` skeleton invoking Stage 0 (fit/harness gate) →
  Stage 1 (public core) → Stage 3 (hidden admission). Stage 2 (config tuning)
  is **deliberately not automated** — kept manual/intentional.
- If `tier-eval-hidden/` is empty/missing, Stage 3 emits a visible warning
  rather than silently passing.

Sprint 4 can run in parallel with Sprint 3 once Sprint 0 lands.

---

## Out of scope for this iteration

To prevent scope creep, this iteration does **not** include:

- Sampler/prompt DOE experiments (strategy §14.3) — needs the baseline matrix first.
- New coding test families from §12 (query-filter evaluator, template renderer,
  mini dependency resolver, log parser, markdown table transformer) — defer
  until the discrimination matrix shows where new edge surfaces are needed.
- Frontier/stress suite expansion (Layer D) — defer.
- Multi-physical-machine thermal isolation beyond telemetry + flagging — defer.
- Public leadership-facing scorecard. Every output this iteration is internal
  R&D evidence.

---

## Rough timeline envelope (planning, not commitment)

| Sprint | Wall clock | Notes |
|---|---|---|
| Sprint 0 | 1.5–2 weeks | Schema + migration + manifest tagging is the long pole. |
| Sprint 1 | 1 night + 1 day analysis | Triggered the moment Sprint 0 sign-off lands. |
| Sprint 2 | 3–5 days | Plus 1 confirmatory night. |
| Sprint 3 | 1.5–2 weeks | Calibration is gated on human reviewer availability. |
| Sprint 4 | 1 week | Can run in parallel with Sprint 3 once Sprint 0 lands. |

Total: ~5–6 weeks if Sprints 3 and 4 overlap. Strategy §9.3 caution applies —
`n=40` is a starting point for confirmatory runs, not a universal power
guarantee; recompute per comparison.

---

## Resume cheatsheet (for fresh sessions / post-`/compact`)

If you arrive at this document cold:

1. Read sections 1–2 to load the strategic frame and locked decisions.
2. Check the todo list (or section 11 below) for current sprint position.
3. The **only** thing in flight before any tests are written is **Sprint 0**.
   Do not skip ahead.
4. If Sprint 0 is partially done, resume at the lowest-numbered deliverable
   marked incomplete in §11.
5. Before running any sweep, verify the Sprint 0 sign-off gate (§3, last block).
6. Sprint 1 execution model is **single M5 Max MBP, serial** — confirmed
   2026-04-29. Three-machine parallel is not available for the foreseeable
   future. Do not re-pitch parallel execution.

Useful repo landmarks:

- Tier-eval test bodies: `host/test/__tests__/tier-eval/` (35 files)
- Runner library: `host/test/lib/` (`claw.js`, `tier.js`, `model.js`,
  `backend.js`, `bridge.js`, `workspace.js`)
- Entry script: `host/test/run-tier-eval.sh`
- Existing telemetry / iteration distribution work: `host/test/lib/claw.js`
  (W1 schema v1 — sidecar layout under `/workspace/.claw-runtime/<run-id>/`)
- Existing planning docs: `host/test/docs/EVAL-DESIGN.md`,
  `EVAL-CALIBRATION-REPORT.md`, `NEW-EVALS-REPORT.md`,
  `TIER-EVAL-MEMO-20260428-*.md`

---

## Sprint 0 status (live)

Update this section as work progresses. One row per deliverable.

| # | Deliverable | Status |
|---|---|---|
| 0.1 | `run_registry.schema.json` + `registry.js` | **done** — schema at `host/test/lib/schemas/run_registry.schema.json` (26 fields, 12 required), validator at `host/test/lib/registry.js` (append-only JSONL, structural validation only, registry path overridable via `RUN_REGISTRY_PATH`). End-to-end exercise deferred to Sprint 0 sign-off dry run. |
| 0.2 | `model_config.schema.json` | **done** — schema at `host/test/lib/schemas/model_config.schema.json` (9 required + 4 optional fields including `sampler_settings` and `tier_compatibility`), accessor at `host/test/lib/model_config.js` (loads `lib/model_configs.json`, validates on read, exposes `resolveConfig` / `listConfigs`). Manifest file itself not authored yet — empty/missing manifest is treated as "no configs registered". |
| 0.3 | `test_manifest.schema.json` | **done** — schema at `host/test/lib/schemas/test_manifest.schema.json` (7 required + 5 optional fields). Header convention: each test file declares its manifest in a `/** @manifest { ... } */` JSDoc block. Accessor at `host/test/lib/test_manifest.js` parses the header without importing the test (avoids `node:test` registration side effects), validates against the schema, and rejects manifests where `secondary_axes` includes `primary_axis`. |
| 0.4 | Tier-eval test manifest headers (35 files) | **done** — all 35 tests under `host/test/__tests__/tier-eval/` carry an `@manifest` JSDoc block. Migration script: `/tmp/insert_manifests.py` (idempotent — re-running replaces any existing block). All 35 parse cleanly and validate against the Sprint 0.3 schema. Distribution: primary_axis = spec_precision 12 / convergence 7 / tool_discipline 5 / stateful_logic 5 / multi_file_context 4 / local_usability 1 / **productivity 1** (only `prose-quality` — confirms strategy doc §2.2's biggest-gap diagnosis). Suite layer = B 32, A 2 (`latency`, `tool-discipline`), C 1 (`long-horizon-bugs`). Oracle = public_verifier 33, rubric 2. |
| 0.5 | `historical_bucketing.csv` | **done** — index at `host/test/docs/historical_bucketing.csv` (9 rows). Headline: 120-row production CSV is `legacy-compatible` (needs assumed `hardware_tier=64`, `oracle_type=public_verifier`, `thermal_status=unknown`, and a backfilled `model_config_id`); the 2026-04-28 archive copy is `legacy-asterisked`; W4 packet indices and the 0-row partial-sweep artifact are `excluded`. The ~351 run-id directories under `.claw-runtime/` are `legacy-compatible` and remain the source of truth for any trace-tag calibration. |
| 0.6 | EVAL-DESIGN.md decision-rule addendum | **done** — appended a "Tier-Eval v2 addendum: statistical decision rules" section to `host/test/docs/EVAL-DESIGN.md`. Codifies the two-stage screen-then-confirm protocol, the 25 pp + non-overlapping 80% Wilson rule, the seven discrimination-matrix labels (incl. `provisional_discriminator`), power-derived-N requirements for admission decisions, and the prohibition on single-number aggregate scores in external-facing artifacts. Existing eight-rules section is unchanged — the addendum complements it rather than replacing it. |
| 0.7 | Thermal telemetry hook | **done (library-only)** — `host/test/lib/telemetry.js` exposes `captureThermalStatus()` (reads `host/test/.claw-runtime/.thermal-hint.json`) and `captureThroughputSignal()` (tokens/sec drift from W1 iteration records). Host-side data source: `host/test/scripts/thermal-watch.sh` polls `pmset -g therm` once/sec, sudo-free, smoke-tested live (returned `clean` against the empty-events baseline). Documentation: `host/test/scripts/README.md`. **Wiring into the registry-row assembly path is deferred to Sprint 1** — Sprint 0 only ships the building blocks. The end-to-end sign-off gate ("smoke run emits `thermal_status`") is exercised when Sprint 1's overnight-screen driver lands. |
| 0.8 | Hidden-holdout policy memo | **done** — memo at `host/test/docs/HIDDEN-HOLDOUT-POLICY.md`. Locks the storage location (`host/test/__tests__/tier-eval-hidden/`, gitignored), naming convention (`<public_test_id>-h`), authorship/access rules, quarterly rotation cadence with per-axis reserve pool of ≥2, retirement-on-suspicion rule, the exploratory-vs-admission split, the no-leak result reporting contract, and the Sprint-4 Stage-3 runner contract (visible warning + `admission_status=skipped` if the directory is empty — silent passes are forbidden). No holdouts authored yet — that's Sprint 4. |
| 0.9 | Productivity-grader design memo | **done** — memo at `host/test/docs/PRODUCTIVITY-GRADER-DESIGN.md`. Locks: pinned judge `claude-opus-4-7` (re-calibrate on any revision change); prompt-cache discipline (system + rubric + exemplars cached, candidate-only varies, cache-hit-rate ≥ 0.9 SLO); four-component hybrid grader (deterministic checks → semantic match → pinned judge → human override); κ ≥ 0.7 calibration threshold gating core-matrix entry; rubric versioning round-tripped through the registry's `prompt_pack_version` field; per-grade Opus cost cap of $0.05; pilot families = changelog summarization + email rewrite; productivity column forbidden in any leadership-facing artifact until Sprint 3 sign-off. |

Sign-off gate: **building-blocks complete; end-to-end exercise pending Sprint 1.** All nine deliverables shipped. The four signoff criteria from §3:

1. *A single dry-run lands in the registry with all mandatory fields populated.* — **Pending Sprint 1.** The registry writer (`lib/registry.js`) is in place and validates rows; what's missing is the driver that assembles a row from a claw run and calls `appendRow`. That wiring is the first piece of Sprint 1's overnight-screen driver.
2. *Smoke run on each tier emits `thermal_status` and a resolvable `model_config_id`.* — **Pending Sprint 1.** Both building blocks exist (`lib/telemetry.js`, `lib/model_config.js`); they need a driver to call them and a populated `lib/model_configs.json` (one entry per tier baseline config).
3. *Historical rows have been bucketed.* — **Done** (`docs/historical_bucketing.csv`).
4. *Statistical decision rule signed off in writing.* — **Done** (EVAL-DESIGN.md addendum).

Net: Sprint 1 must ship a tiny driver that (a) populates `model_configs.json` with the three tier baselines, (b) runs one smoke claw call per tier, (c) appends a registry row per call with `thermal_status` populated, (d) writes the result to a CSV view. That's the first ~half-day of Sprint 1 and satisfies criteria 1 and 2 simultaneously.
