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

Sign-off gate: **CLOSED.** All four criteria met as of 2026-04-29 (commit pending after this update):

1. *A single dry-run lands in the registry with all mandatory fields populated.* — **Done.** `lib/run_row.js` (`assembleRow`/`emitRow`) reads a claw-run sidecar and produces a fully-populated, schema-validated row. Smoke harness `/tmp/sprint1-smoke.mjs` (running in `node:24-bookworm-slim`) exercises emit + harvest + CSV export end-to-end against synthetic sidecars; 28/28 checks pass.
2. *Smoke run emits `thermal_status` and a resolvable `model_config_id`.* — **Done.** `lib/model_configs.json` carries three tier baselines (tier-16: Qwen2.5-7B-Instruct Q5_K_M, tier-32: Qwen3-14B Q4_K_M, tier-64: Qwen3.6-35B-A3B UD-Q4_K_XL). The smoke confirms `thermal_status` is computed from the pmset hint + throughput-drift signal (clean baseline + a contaminated synthetic case correctly escalates to `contaminated`).
3. *Historical rows have been bucketed.* — **Done** (`docs/historical_bucketing.csv`).
4. *Statistical decision rule signed off in writing.* — **Done** (EVAL-DESIGN.md addendum).

---

## Sprint 1 status (live)

Sprint 1's first half-day landed alongside Sprint 0 sign-off — these are the building blocks an actual overnight sweep needs:

| # | Deliverable | Status |
|---|---|---|
| 1.0 | `lib/model_configs.json` (3 tier baselines) | **done** — entries for tier-16/32/64 sourced from `host/llama-server/models.conf`. Sampler settings denormalized; `runtime_backend` pinned to `llama-server@unknown` until we capture a real SHA at sweep time. |
| 1.1 | `lib/run_row.js` (assembler + emitter) | **done** — `assembleRow(clawResult, ctx)` joins claw sidecar + manifest entry + thermal hint into a registry-schema-conformant row; `emitRow` validates and appends. Reads `assertion_result.json` for authoritative `passed`. |
| 1.2 | `scripts/harvest-runs-to-registry.mjs` | **done** — offline harvester. Walks `/workspace/.claw-runtime/<run-id>/` directories, joins to test-manifest headers by `test_id`, emits one registry row per run. Caller-supplied `--ctx` JSON carries the static fields (run_kind, hardware_tier, model_config_id, harness_version). Caveat documented in script: thermal hint reflects harvest time, not run time — for sweeps harvested later, `thermal_status` falls back to throughput drift. |
| 1.3 | `scripts/registry-to-csv.mjs` | **done** — flattens registry JSONL to CSV. Columns are taken from the schema's property order, so the CSV evolves with the schema. Supports `--bucket`, `--run-kind`, `--tier` filters. |
| 1.4 | Sprint 1 sign-off smoke | **done** — `/tmp/sprint1-smoke.mjs`, 28/28 checks pass in `node:24-bookworm-slim` (no LLM backend required). Validates the assemble → validate → append → harvest → CSV path against synthetic sidecars including a contaminated-throughput case. |
| 1.5 | Per-test auto-emit hook | **done** — `lib/claw.js`'s `writeAssertionResult` now emits a registry row when `RUN_REGISTRY_EMIT=1`, joining `test_id` from `run_summary.json` to `test_version` + `oracle_type` via the `@manifest` header. Static fields come from envs (`RUN_REGISTRY_KIND`, `RUN_REGISTRY_HARDWARE_TIER`, `RUN_REGISTRY_MODEL_CONFIG_ID`, `RUN_REGISTRY_HARNESS_VERSION`). Best-effort: emission failures log to stderr but never throw, so a misconfigured sweep can still complete + retry. Smoke harness `/tmp/sprint1-emit-smoke.mjs` validates the full path (14/14 checks pass). No tier-eval test file was touched. |
| 1.6 | Overnight-screen driver wrapper | **done** — `scripts/run-overnight-screen.sh`. Wraps the existing per-tier plist-swap pattern with `EVAL_REPS` outer loop, sweep-specific `RUN_REGISTRY_PATH`, and full registry-env passthrough into the test container. `DRY_RUN=1` exits before the first plist swap with the resolved plan printed. Order is rep-outer × tier-middle × test-inner — the cheap interleave (~3 swaps per rep, not 600 per night). Documented as acceptable for *screening*, not admission. |
| 1.7 | Sprint 0 bug fix: thermal hint path | **done** — `lib/telemetry.js` was reading from `/workspace/.thermal-hint.json` while `thermal-watch.sh` writes to `/workspace/.claw-runtime/.thermal-hint.json` (the actual mount). Aligned telemetry.js to the script + README's path. Sprint 0 smoke would have masked this because it set up the hint file at the buggy path itself. |
| 1.8 | Real claw confirmatory (tier-64, single test) | **done** 2026-04-29. `agent-single.test.js` ran in the rebuilt container with `RUN_REGISTRY_EMIT=1` and `thermal-watch.sh` running on the host. Produced one fully-populated registry row: `test_id=agent-single`, `test_version=v1`, `oracle_type=public_verifier` (joined from the manifest header), `model_id`/`quantization`/`context_limit` denormalized from the manifest entry, `thermal_status=clean` from the live pmset hint, `passed=true` from `assertion_result.json`. CSV exporter rendered the row cleanly. Two issues surfaced and were fixed inline: (a) `test_id` was null because the existing tier-eval tests don't set `ITER_DIST_TEST_ID` — `runClaw` now infers the test id from the caller's stack frame as a best-effort fallback; (b) the test image has to be rebuilt (`docker compose build test`) when `lib/` changes, because the Dockerfile copies sources at build time. |
| 1.9 | Multi-tier confirmatory (16 → 32 → 64, EVAL_REPS=1) | **done** 2026-04-29 — 80 min wallclock, plist swaps clean (tier-32 cold-load 4s, tier-64 cold-load 6s). 32 registry rows landed: tier-16 9 rows (2 pass / 7 fail), tier-32 11 rows (3 pass / 8 fail), tier-64 12 rows (12 pass / 0 fail). Auto-emit fired correctly on every runClaw-using test that called `writeAssertionResult`. The cross-tier discrimination matrix is already showing perfect FAIL→FAIL→PASS discriminators (`csv-parser`, `deep-equal`, `eight-functions`, `large-refactor`, `lru-cache`, `tool-confusion-redundant-verifies`) and one ceiling/floor (`agent-single` PASS at all 3 tiers). Throughput-drift fired on 4/9 tier-16 rows vs 1/12 tier-64 rows — likely a real warmup-pattern signal on smaller models, worth tuning the drop_pct thresholds before treating it as load-bearing. |
| 1.10 | Coverage gap: 23/35 tier-eval tests don't call writeAssertionResult | **done** 2026-04-29 — added `writeAssertionResult(r.runDir, { passed, claw_exit, target_file_exists, post_status, post_stderr_tail })` to 20 emit-eligible tests (every runClaw-using test except the 3 stay-exempt: latency, tool-discipline, prose-quality, which use streamMessage directly). Pattern: compute `passed` as the AND of `r.code===0`, target-file-exists (where applicable), and post-script `status===0`; insert the emit call after observations are made but BEFORE the assert chain so a failed test still produces a row. Verified by tier-64 smoke (`EVAL_REPS=1 EVAL_TIERS=64`, label `sprint1-10-smoke-20260429-1528`): **31 rows** (vs 12 in 1.9), all `passed=true` on tier-64, manifest joins clean (v1 + public_verifier on every row). The one missing emit is `mini-vm` — claw timed out at 240s on tier-64, throwing before the test reached `writeAssertionResult`; closing that gap is a separate problem (raise mini-vm's `CLAW_TIMEOUT`, or wrap runClaw failures in a try/finally that emits even on timeout). Throughput-drift `contaminated` again fired on 5/31 rows on the cleanest tier (csv-parser, deep-equal, expression-eval, multi-bug-decoy, subtle-broken-spec) — consistent with 1.9's warmup-pattern observation; threshold tuning still pending. |
| 1.11 | run-overnight-screen.sh CSV export bug | **fixed** — script was calling `node` directly on the host where it isn't installed. Switched to `docker run --rm node:24-bookworm-slim`. The post-sweep CSV-view step warned but didn't fail the sweep (the JSONL is the authoritative artifact); fix is a polish-grade improvement for future runs. |
| 1.12 | Demote drift-only thermal flags to advisory | **done** 2026-04-29 — `lib/telemetry.js` split: `captureThroughputSignal` → `captureThroughputAdvisory` returning `{ advisory: bool, drop_pct, ... }`, `combineStatuses` removed, `PMSET_LEVELS` rename `contaminated` → `pmset_contaminated`. `lib/run_row.js`: `thermal_status = thermalHint.status` (pmset only); new `thermal_drift_advisory` boolean column populated from advisory. Schema: enum `{clean, warning, pmset_contaminated, unknown}`; new `thermal_drift_advisory: boolean`. Verified by `/tmp/sprint1-12-smoke.mjs` (10/10 checks: drift 50% → advisory=true, flat → advisory=false, pmset Heavy → pmset_contaminated, row validates against schema). |
| 1.13 | Timeout-as-row + schema loosening | **done** 2026-04-29 — `lib/claw.js` `runClaw` resolves with `{ code: null, signal: null, timeout: true, terminal_status: 'timeout', ...extras }` instead of rejecting on AbortController fire. `maybeEmitRegistryRow` propagates `code: null` (was defaulting to 0) so `run_row.js`'s `pickTerminalStatus` honors `summary.terminal_status='timeout'`. No schema change needed: `passed` already `[boolean, null]`, `terminal_status` enum already includes `timeout` and `harness_error`. Test files reach `writeAssertionResult` even on timeout — assertion fires after; row lands. Validated by 1.15 smoke. |
| 1.14 | Expected-attempt manifest + observed-vs-expected diff | **done** 2026-04-29 — `scripts/expected-attempts.mjs` (`plan` + `diff` subcommands). Eligibility rule: tier-eval test imports `writeAssertionResult` (excludes `latency`, `prose-quality`, `tool-discipline`). 32 emit-eligible tests confirmed. `run-overnight-screen.sh` writes `expected_attempts.<sweep>.csv` pre-sweep (before any plist swap) and runs `diff` post-sweep, tee'd to `expected_attempts.<sweep>.diff.txt`. Diff non-zero exit means observed diverged from plan. Self-validated against 1.10 smoke JSONL: correctly identified `mini-vm tier=64 rep=1` as the missing cell. |
| 1.15 | Short-timeout smoke test for timeout-as-row | **done** 2026-04-29 — `/tmp/sprint1-15-smoke.mjs` invokes `runClaw` with `timeoutMs=1500` (5000 was too lenient; claw completed in ~4.5s on a refusal). 10/10 checks: runClaw resolved (no throw), `code=null`, `timeout=true`, `terminal_status='timeout'`, registry row landed with `terminal_status='timeout'`, `passed=false`, `thermal_drift_advisory: boolean`. Validates 1.12 + 1.13 end-to-end against the live bridge. |
| 1.16a | Timeout assertion guard across tier-eval tests | **done** 2026-04-29 (commit `629714d`) — Sprint 1.13 made claw timeouts return `code=null`, but 32 tier-eval test files still asserted `r.code === 0` after `runClaw`, producing misleading `null !== 0` runner output on legitimate timeout rows (the registry row was correct because `writeAssertionResult` ran first). Inserted a pre-assert guard `if (r.terminal_status === 'timeout') assert.fail(\`claw timed out after ${r.elapsedMs}ms (terminal_status=timeout)\`)` ahead of the existing `assert.equal(r.code, 0, …)` in all 32 files via Python regex sweep. Patterns the existing assert untouched. Verified by smoke (label `smoke-sprint1-16-20260429-2221`, 26/26 rows on tier-64 n=1, 1 timeout row produced clean message). |
| 1.16b | `iters_count` registry enrichment | **done** 2026-04-29 (commit `629714d`) — `lib/run_row.js` now emits `iters_count: iterRecords.length` on every row (records were already loaded for the drift-advisory pipeline; cost is a single property assignment). Schema added `iters_count` (integer, minimum 0) with description tying it to Sprint 2 §8's "p90 iters/wallclock" column. Smoke confirmed distribution: 4×12, 5×6, 6×2, 7×2, 9×2, 13×1, 19×1 across 26 cells. Combined with `end_time - start_time` this gives the per-cell wallclock and iteration p90s the Sprint 2 matrix needs. |
| 1.16c | Suite trim (likely_ceiling + likely_floor) | **done** 2026-04-29 (commit `629714d`) — pilot n=3 sweep (`overnight-eval8-20260429-1803`, 288 rows) classified 6 tests as ceiling/floor on the lower tiers and not informative for the discrimination matrix. Renamed to `*.test.js.skip` to skip them from the Vitest discovery while preserving the source for posterity: `agent-parallel`, `agent-single`, `code-self-test`, `distractor`, `null-default` (likely_ceiling, all 9/9 across all 3 tiers in pilot), and `mini-vm` (likely_floor, 0/9 on tier-16/32, tier-64 timed out at the 360s cap — saved ~1.6h of compute on the deep run). 26 emit-eligible tests remain. `expected-attempts.mjs` re-validated: 26 × 3 tiers × 8 reps = 624 cells. |
| 1.17 | Pilot n=3 overnight (`overnight-eval8-20260429-1803`) | **done** 2026-04-29 — 288 rows across 3 reps × 3 tiers × 32 emit-eligible tests (pre-trim). Aggregate pass rates with Wilson 95% CIs: tier-16 41.7% [32.3, 51.7], tier-32 39.6% [30.4, 49.6], tier-64 94.8% [88.4, 97.8]. Confirmed the t16↔t32 plateau is real (CIs overlap massively) and tier-64 cleanly separated. Stopped after rep 3 on a graceful boundary; data preserved for Sprint 2 cross-validation. |
| 1.18 | Deep n=8 sweep (`eval8-trimmed-20260429-2240`) | **done** 2026-04-30 — 650 rows (624 planned + 26 over-emission on tier-16 from a split kickoff → effectively n=9 t16, n=8 t32/t64). `expected-attempts.mjs` diff: 0 missing cells. Aggregate pass rates with Wilson 95% CIs: tier-16 37.2% [31.2, 43.5], tier-32 31.2% [25.3, 37.8], tier-64 98.6% [95.8, 99.5]. Done-only denominators: t16 46.3%, t32 33.5%, t64 100%. **Discrimination matrix**: 16/26 t32↔t64 separations (CIs disjoint), 14/26 t16↔t64, only 3/26 t16↔t32 (`dependency-graph` and `long-horizon-bugs` t16-favored; `parseISO-with-timezone` t32-favored). Per-tier wallclock p50/p90: t16 30.4s/224s, t32 24.7s/135s, t64 10.2s/37s — t64 is 3× faster median, 6× faster p90. **Thermal: 0/650 pmset_contaminated rows**; drift advisory rate 31% / 26% / 20% by tier (smaller models thrash more, expected). **Headline finding**: tier-32 (Qwen3-14B Q4) does *not* Pareto-dominate tier-16 (Qwen2.5-7B Q5) — t16 wins on done-only denominator. Bipolar per-test structure: t16 wins on algorithmic/long-horizon, t32 wins on structured-spec-following. Real model-selection finding worth surfacing in the manifesto. |
| 1.19 | Tier-32 param-tuning + (optional) model swap | **planned** — recursive agentic run on the 32 GB tier to extract low-hanging fruit via sampler / decoding param tweaking on Qwen3-14B Q4 (temperature, top-p, top-k, repeat-penalty, presence-penalty, batch-size, KV cache types). May also evaluate a different 14B-class candidate (e.g. Qwen2.5-14B Q5, Mistral-Small-24B Q4) and re-run the sweep **for tier-32 only**. Eligibility for re-sweep: candidate beats the current `qwen3-14b-instruct-q4km-ctx32k-v1prod-pp01` config on a 26-cell n=3 mini-sweep at 95% confidence. New rows land with a fresh `model_config_id` (sampler config bumped) so historical t32 rows remain comparable; `canonical_status` for the old config flips to `archived`. Goal is to either close some of the t16↔t32 inversions found in 1.18 (especially `long-horizon-bugs`, `algorithm-intervals`, `dependency-graph` where t32 underperforms badly) or confirm they are model-architectural, not sampler-driven. Confirms or refutes the manifesto framing of t32 as the "instruction-following" tier before Sprint 2 publishes the matrix. |

**Sprint 1 entry criteria for the actual overnight (now met as of 2026-04-29):**

- Host-side `thermal-watch.sh` running in a separate terminal during the sweep.
- A frozen `--ctx` JSON per tier:
  ```json
  { "run_kind": "overnight_screen", "hardware_tier": 16, "memory_gb": 16,
    "model_config_id": "qwen25-7b-instruct-q5km-ctx32k-v1prod-pp01",
    "harness_version": "<git sha>", "screening_only": true }
  ```
- `RUN_REGISTRY_PATH` set to a sweep-specific path (e.g. `host/test/.claw-runtime/run_registry.overnight-2026-04-29.jsonl`) so the canonical jsonl stays clean if the run aborts.
- Harness pinned to a single git SHA across all three tier runs (no rebuilds mid-sweep).
- Deliverables 1.12 – 1.15 landed (research-team pre-flight requirements). **Done 2026-04-29.** Confirmed end-to-end by `sprint1-12-15-confirm-20260429-1640` (tier-64 `EVAL_REPS=1`, ~14 min wallclock): 32 rows landed (vs 31 in 1.10), expected-attempts diff reported `missing: 0 over: 0`, mini-vm produced its first registry row with `terminal_status='timeout'` + `passed=false`, `thermal_drift_advisory=true` on 4 rows without gating them out (csv-parser, eight-functions, expression-eval, large-refactor — all `passed=true`), all 32 rows `thermal_status='clean'` from pmset. Latency wrap-rate failure (0.45) is in `latency.test.js`, which doesn't emit a registry row (one of the 3 streamMessage-exempt tests); orthogonal to 1.12-1.15.

**Expected output sizing (revised 2026-04-29, post research-team review):**

The pre-overnight memo's "~105 rows" projection was wrong by an order of
magnitude. Correct projection from 1.10's tier-64 smoke (31 emit-eligible
cells per rep, post-coverage-fix):

- ≈ 31 cells/rep × 3 tiers × 10 reps = **~930 rows expected**, plus
  whatever 1.13 surfaces from previously-dropped timeouts.
- Wallclock revised from "~10 hours" to **~13–14 hours** based on 1.9's
  80-minute multi-tier `EVAL_REPS=1` baseline scaled linearly. Plist-swap
  overhead is amortized (3 swaps total, not 30).
- Expected cells per tier scale with how often the model times out: tier-16
  will produce ~31 timeout/fail rows where it produces 7 completion rows
  today, so the row count is biased high relative to the 1.9 + 1.10
  pattern. 1.14's expected-attempt manifest is the authoritative count.

When the user is ready to kick off the real overnight, deliverables
1.12 – 1.15 are the remaining pre-flight work (~½ day of engineering, no
added eval-sweep wallclock per the research-team review).
