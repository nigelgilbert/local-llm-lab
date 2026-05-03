# Overnight Cross-Tier Screen — explore-c5-20260503-1338

- Date: 2026-05-03 13:38
- Tiers: 16 32
- Reps per tier: 3
- Harness git SHA: 726b3c6
- Registry: /Users/nigel/Desktop/bench/mac-llm-lab-1/host/test/.claw-runtime/run_registry.explore-c5-20260503-1338.jsonl
- Hint file: MISSING — thermal_status will be throughput-drift only
- Order: rep-outer × tier-middle × test-inner (cheap interleave)

## rep=1 tier=16

```
 Container test-test-run-6aaa8080a216 Creating 
 Container test-test-run-6aaa8080a216 Created 

=== needle-haystack (tier-16) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=8866ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16)
  ✔ claw locates REGION_KEY and writes solve.js (8903.649758ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16) (8904.469426ms)
[run-registry] emit failed for /workspace/.claw-runtime/a5cb5a5a-6706-4da6-945a-cd239f1717e5: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/needle-haystack.test.js failed validation: field secondary_axes: array value "retrieval_over_distance" not in enum
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:223:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 8933.427073
```

Exit code: 0 (rep=1 tier=16)

## rep=1 tier=32

```
 Container test-test-run-406f48789cdd Creating 
 Container test-test-run-406f48789cdd Created 

=== needle-haystack (tier-32) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=8935ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] emit failed for /workspace/.claw-runtime/077f9cca-2712-4172-8751-f2862c71c4cf: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/needle-haystack.test.js failed validation: field secondary_axes: array value "retrieval_over_distance" not in enum
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:223:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-32)
  ✔ claw locates REGION_KEY and writes solve.js (8973.02748ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-32) (8973.48298ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 8997.322373
```

Exit code: 0 (rep=1 tier=32)

## rep=2 tier=16

```
 Container test-test-run-e5da3b96adb1 Creating 
 Container test-test-run-e5da3b96adb1 Created 

=== needle-haystack (tier-16) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=10601ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] emit failed for /workspace/.claw-runtime/e0e7bd4c-d94d-4b9c-89c4-878de658c773: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/needle-haystack.test.js failed validation: field secondary_axes: array value "retrieval_over_distance" not in enum
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:223:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16)
  ✔ claw locates REGION_KEY and writes solve.js (10634.104954ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16) (10634.601038ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10660.41435
```

Exit code: 0 (rep=2 tier=16)

## rep=2 tier=32

```
 Container test-test-run-8f71d9645fdc Creating 
 Container test-test-run-8f71d9645fdc Created 

=== needle-haystack (tier-32) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=7979ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] emit failed for /workspace/.claw-runtime/6d73d042-9340-4b7f-a406-3cbdd0569dd9: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/needle-haystack.test.js failed validation: field secondary_axes: array value "retrieval_over_distance" not in enum
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:223:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-32)
  ✔ claw locates REGION_KEY and writes solve.js (8016.007268ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-32) (8016.525018ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 8045.288166
```

Exit code: 0 (rep=2 tier=32)

## rep=3 tier=16

```
 Container test-test-run-5025597ec96f Creating 
 Container test-test-run-5025597ec96f Created 

=== needle-haystack (tier-16) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=10252ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] emit failed for /workspace/.claw-runtime/a2d4bf82-2c7d-478e-8694-9d4b1b59ff66: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/needle-haystack.test.js failed validation: field secondary_axes: array value "retrieval_over_distance" not in enum
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:223:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16)
  ✔ claw locates REGION_KEY and writes solve.js (10284.954387ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-16) (10285.449887ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10310.402657
```

Exit code: 0 (rep=3 tier=16)

## rep=3 tier=32

```
 Container test-test-run-41ac59e8e0b1 Creating 
 Container test-test-run-41ac59e8e0b1 Created 

=== needle-haystack (tier-32) ===
  needle: lib/handlers/auth.js = '2298e9'
  claw: exit=0 elapsed=7573ms solve.js=true
  verify: exit=0 stdout=all-pass stderr=
[run-registry] emit failed for /workspace/.claw-runtime/70f496c2-8602-4ad2-9544-e0e9927cc5c0: TestManifestValidationError: test manifest in /test/__tests__/tier-eval/needle-haystack.test.js failed validation: field secondary_axes: array value "retrieval_over_distance" not in enum
    at readManifest (file:///test/lib/test_manifest.js:126:28)
    at maybeEmitRegistryRow (file:///test/lib/claw.js:239:20)
    at writeAssertionResult (file:///test/lib/claw.js:213:7)
    at TestContext.<anonymous> (file:///test/__tests__/tier-eval/needle-haystack.test.js:223:5)
    at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
    at async Test.run (node:internal/test_runner/test:1208:7)
    at async Promise.all (index 0)
    at async Suite.run (node:internal/test_runner/test:1619:7)
    at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3)
▶ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-32)
  ✔ claw locates REGION_KEY and writes solve.js (7608.383655ms)
✔ needle-haystack: 30-file NIAH apply-the-needle (tier=tier-32) (7608.884198ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 7633.969384
```

Exit code: 0 (rep=3 tier=32)

