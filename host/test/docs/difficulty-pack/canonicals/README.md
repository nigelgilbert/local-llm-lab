# Exercism canonicals — retrieval log

Snapshot of upstream Exercism JS exercise files for the 7 P1 picks.
Pulled verbatim from `raw.githubusercontent.com/exercism/javascript/main/`
on **2026-05-02** via `curl`. Files committed unmodified.

## Why these files live in-repo

1. **R8 memorization audit reference** ([`../PLAN.md`](../PLAN.md) §Calibration
   protocol). After pilot, if any P1 port hits t16 ≥ 70%, hand-compare the
   model's produced solution against `<slug>/proof.ci.js` here. Structural
   identity → memorization → mutate harder.
2. **Mutation spec inputs** ([`../p1-picks.md`](../p1-picks.md) §Mutation
   specs). Mutation design (rename map, edge shifts, return-shape changes)
   needs the canonical spec (`instructions.md`) and the canonical solve
   (`proof.ci.js`) side by side.
3. **License attribution.** Per-pick `config.json` carries the source +
   author metadata required for derivative-work attribution in the test
   manifest `notes` field.

## Contents

| File | Origin path under each `<slug>/` |
|---|---|
| `instructions.md` | `.docs/instructions.md` |
| `instructions.append.md` | `.docs/instructions.append.md` (only book-store, two-bucket) |
| `config.json` | `.meta/config.json` |
| `proof.ci.js` | `.meta/proof.ci.js` (canonical solution) |
| `tests.toml` | `.meta/tests.toml` (canonical test-case enable list) |

## License

Per Exercism repo root ([github.com/exercism/javascript/blob/main/LICENSE](https://github.com/exercism/javascript/blob/main/LICENSE)):

> The MIT License (MIT)
> Copyright (c) 2015 Exercism

Per-exercise `config.json` may name additional authors and an upstream
inspiration source — see each file's `authors` and `source` fields. After
mutation (per [`../PLAN.md`](../PLAN.md) §P1), our committed test is a
derivative work; attribution preserved in test-file manifest `notes`.

## Re-fetch

```sh
BASE="https://raw.githubusercontent.com/exercism/javascript/main/exercises/practice"
for slug in book-store wordy alphametics word-search forth grade-school two-bucket; do
  for src in .meta/config.json .meta/proof.ci.js .meta/tests.toml \
             .docs/instructions.md .docs/instructions.append.md; do
    curl -sf -o "$slug/$(basename "$src")" "$BASE/$slug/$src" && echo "OK $slug/$src"
  done
done
```

Files in this directory are read-only references; do not edit.
