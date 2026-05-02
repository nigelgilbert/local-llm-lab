# P2 — Sourcing Decision Trail

**Stream:** P2 (provably-novel external port)
**Date locked:** 2026-05-02
**Pilot status:** pre-pilot

---

## Locked port

[**AtCoder ARC 216 C "Count Power of 2"**](https://atcoder.jp/contests/arc216/tasks/arc216_c)
- **Released:** 2026-03-22 (5 weeks after Qwen3.5's Feb 2026 release; provably post-training-freeze)
- **Score:** 800 points (AtCoder Regular Contest, problem C)
- **Statement:** Given non-negative integers A_1…A_N, count subarrays (l,r) where ∑ 2^A_i is a power of 2.
- **Constraints (original):** N ≤ 2×10⁵, A_i ≤ 2×10⁵
- **Constraints (presented to model):** N ≤ 100, A_i ≤ 100 — relaxed to admit a brute-force O(N² log) solution and honor the <10-min hand-solve rule
- **Axis:** spec_precision (bit-manipulation) + stateful_logic
- **Verifier:** author-written brute force using `BigInt` and `(s & (s-1n)) === 0n` power-of-2 check
- **Sample tests:** 8–10 hand-authored cases including edges (single element, all zeros, ascending distinct, consecutive equal pairs, long carry-merge chain, N=100 stress)

---

## Why one P2 port, not two

Initial design called for 2 P2 ports (one Codeforces, one AtCoder). After 4 candidate problems were manually browsed, 3 disqualified for axis or format reasons. Continuing the loop was high cost / low yield. **Locked on 1 P2 port; redirected the second slot to H4 (hand-authored gap-filler).** This preserves the unique value of P2 — a contamination-detection signal — without inflating the sourcing overhead.

The contamination-detection use case still works with one port: compare A3's pass rate to spec_precision-similar Aider ports. Systematic Aider over-performance is evidence of memorization on the P1 stream.

---

## Why not LiveCodeBench

The original plan called for "LCB v6 Hard JS-translated" ports as P2. Discovered during sourcing:

- **LCB v6 (current public release on HuggingFace):** problems dated up to **April 2025**.
- **Qwen3.5 model release:** **February 2026.**
- **No LCB v7+ public release exists.** All LCB v6 problems pre-date Qwen3.5 by ~10+ months.
- **Implication:** the post-cutoff dating that LCB markets as a contamination defense **does not apply** to our model. Every LCB v6 problem could be in Qwen3.5's training data.

This made LCB methodologically equivalent to (or weaker than) Aider/Exercism for our use case — we'd be paying overhead for a "post-cutoff" guarantee that doesn't hold. Pivoted to direct contest sourcing dated ≥ 2026-02-15 (two weeks post-Qwen3.5 release as a safety buffer), which gives a hard post-release contamination guarantee.

LCB's methodology (post-cutoff dating, contamination-controlled benchmarking) still informs our approach; LCB the benchmark is rejected for this specific use.

---

## Candidate evaluation trail

### CF 2207 D "Boxed Like a Fish" — REJECTED

- **URL:** [codeforces.com/contest/2207/problem/D](https://codeforces.com/contest/2207/problem/D)
- **Date:** 2026-03-08 (post-Feb-2026 ✓)
- **Why rejected:** Game-theoretic problem (two-player optimal-play decision on a tree). Output is YES/NO per testcase. Does not test coding capability — tests game-theory invariant-finding. Hand-solve time ≫ 10 min. Axis fit: weak (not spec_precision/stateful_logic in our taxonomy).

### CF 2211 E (Nebius Round 2) — REJECTED

- **URL:** [codeforces.com/contest/2211/problem/E](https://codeforces.com/contest/2211/problem/E)
- **Date:** 2026-03-28 (post-Feb-2026 ✓)
- **Why rejected:** Interactive problem (online: judge reveals tree node-by-node based on solution output, mandatory `flush` between turns). Our `runClaw` → `verify.js` post-script architecture is batch-only. Building an interactive harness is real work, not 1.21 scope. Hard fail on container/architecture grounds.

### CF Educational Round 187 C "Test Generator" — REJECTED

- **URL:** Round announcement [blog/151496](https://codeforces.com/blog/entry/151496)
- **Date:** 2026-02-25 (post-Feb-2026 ✓ — borderline; 10 days after Qwen3.5 release)
- **Why rejected:** Educational Round problem C is rated ~1300–1700, well below our 2200–2600 target band. Likely too easy → re-saturation risk on both tiers. Educational rounds get heavy editorial-blog discussion → marginally higher contamination than ARC.

### AtCoder ARC 216 C "Count Power of 2" — ACCEPTED ✓

- **URL:** [atcoder.jp/contests/arc216/tasks/arc216_c](https://atcoder.jp/contests/arc216/tasks/arc216_c)
- **Date:** 2026-03-22 (post-Feb-2026 ✓; 5-week buffer)
- **Why accepted:** Score 800 (ARC C, ~AtCoder-difficulty 1800–2200). Bottom edge of target band, but acceptable with the relaxed-N scope adjustment that shifts the test from "find the algorithmic trick" → "implement the spec precisely." Spec_precision + stateful_logic axis fit. Hand-solve trivial on relaxed N. Non-interactive, non-game-theory.

After 3 CF rejections in a row, we paused the CF loop and accepted the AtCoder pick. The rejection pattern (game-theory, interactive, below band) suggested CF Hard problems in 2026 trend toward formats that don't fit our axes; AtCoder's problem culture skews toward clean implementation + DP, much closer to what we need.

---

## Scope adjustment: relaxed N

Original problem constraints (N ≤ 2×10⁵, A_i ≤ 2×10⁵) require either:
1. Per-start sliding-window with merge-stack (amortized analysis required), or
2. Incremental bitset with carry-chain bookkeeping.

Both approaches exceed the <10-min hand-solve rule. The author cannot hand-solve the optimal version, which means the author cannot validate the verifier output — the rule's purpose.

**Resolution:** present the model with **relaxed constraints (N ≤ 100, A_i ≤ 100)**. This admits an O(N² log) brute force using `BigInt`. Hand-solve becomes trivial.

**What this changes:**
- The test now probes **spec_precision** (correctly implementing the multi-condition spec) rather than algorithmic ingenuity.
- The author can verify each test case independently with a 15-line `BigInt` calculation.
- The post-Feb-2026 contamination guarantee still holds — relaxation doesn't change the source's novelty.

**What this preserves:**
- The unique value of P2 (contamination-detection signal) — relaxation doesn't make memorization more likely; the problem is still novel.
- The axis fit — spec_precision is what we want to probe in this slot.

---

## Verifier sketch

```js
function brute(N, A) {
  let count = 0;
  for (let l = 0; l < N; l++) {
    let sum = 0n;
    for (let r = l; r < N; r++) {
      sum += 1n << BigInt(A[r]);
      if (sum > 0n && (sum & (sum - 1n)) === 0n) count++;
    }
  }
  return count;
}
```

### Sample tests

| Input | Expected | Source / why |
|---|---|---|
| `N=1, A=[0]` | 1 | Singleton; 2⁰=1 is a power of 2 |
| `N=4, A=[0,1,0,2]` | 6 | **Official sample 1** (problem statement) |
| `N=4, A=[100,100,100,100]` | 8 | **Official sample 2** — exercises the high-bit / large-power range; A_i = 100 sits at our relaxed-N upper bound. Hand-verified: 4 singletons (2¹⁰⁰) + 3 adjacent pairs (2¹⁰¹) + 1 full quad (2¹⁰²) = 8. |
| `N=10, A=[3,2,2,3,2,4,1,1,0,0]` | 19 | **Official sample 3** — multi-bit mixed exponents; exercises the carry-merge mechanic at non-trivial scale |
| `N=3, A=[0,0,0]` | 5 | Subarrays: 3 singletons (1=2⁰), 2 adjacent pairs (2=2¹), 1 full triple (3, not power of 2) → 5 |
| `N=4, A=[0,1,2,3]` | 4 | All distinct ascending — only the four singletons are powers of 2 |
| `N=4, A=[1,1,2,2]` | varies | Carry-merge mechanic exercise — hand-verify before commit |
| `N=5, A=[0,0,1,2,3]` | varies | Long carry chain — full sum is 2⁰+2⁰+2¹+2²+2³=16=2⁴ |
| `N=100, mixed` | (computed) | Sanity check at relaxed-N upper bound |

Three of the eight cases above are AtCoder's official samples; preserving them in the verifier exercises the canonical edge surface. Hand-verify all `varies` and `(computed)` expected values before commit.

---

## Contamination posture

- **Hard guarantee:** post-Feb-2026 contest problem; cannot be in Qwen3.5's training data.
- **Editorial:** [Official editorial by evima](https://atcoder.jp/contests/arc216/editorial/17808) posted ~2026-04-02 (one month before retrieval). Three other editorial slots listed (toam, editorial_admin, potato167) are still empty. Editorial publication is post-2026-03-22; not present in pre-cutoff training crawls.
- **Personal blogs / Twitter discussion:** post-Feb-2026; not present in pre-cutoff training crawls.
- **Editorial-vs-relaxed-N alignment:** the official editorial describes a probabilistic prefix-sum modular-hash O(N log² N) approach for the original constraints. Our relaxed N ≤ 100 admits brute-force `BigInt`, which is intentionally a *different* algorithm path. Even if the editorial leaks into a future training crawl, the optimal-algorithm content is mostly orthogonal to what the model needs to produce against our presented spec — strengthening the contamination defense.
- **Manifest `notes`:** must record contest URL + date for future audit trail.

This is a **hard** post-release guarantee, distinct from P1's mutation-based defense. As such, A3's pass rate functions as a contamination-detection control: compare A3 to spec_precision-similar Aider ports; systematic Aider over-performance is evidence of memorization on the P1 stream.

### Retrieval-time security note (2026-05-02)

The Chrome-Claude retrieval session that fetched the editorial flagged a "Stop Claude" prompt-injection string embedded in the AtCoder page footer (likely via a third-party AddToAny share-widget content slot). The retrieval agent correctly treated it as untrusted page content and ignored it. Captured here for the future-audit trail; no action required, but worth noting if AtCoder pages are scraped again.

---

## License

AtCoder problem statements are owned by AtCoder under their [Terms of Service](https://atcoder.jp/posts/regulations) (educational/research use permitted with attribution; no verbatim redistribution).

The committed test ships:
- A **paraphrased** problem statement (author-written; not verbatim)
- Author-written sample tests
- Author-written brute-force verifier

This constitutes a derivative work. Manifest `notes` records attribution:

```
"problem inspired by AtCoder ARC 216 C 'Count Power of 2' (2026-03-22),
https://atcoder.jp/contests/arc216/tasks/arc216_c — paraphrased; author-written sample tests"
```
