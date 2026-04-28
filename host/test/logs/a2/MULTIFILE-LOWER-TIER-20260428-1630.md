# multi-file-rename at lower tiers (n=5 each)
started 2026-04-28 16:30:32

Closes 7B/14B reliability question in TODO-MULTI-FILE-RENAME-FLAKE.md.


## Tier 16GB (16:30:32)

### iter 1 — 16:30:35
```
 Container test-test-run-92eea26a0293 Creating 
 Container test-test-run-92eea26a0293 Created 

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=15403ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-16)
  ✔ claw renames across files and updates the call site (15443.786246ms)
✔ multi-file rename + signature change (tier=tier-16) (15444.30929ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 15471.270777
```

### iter 2 — 16:30:51
```
 Container test-test-run-4f6615a0902e Creating 
 Container test-test-run-4f6615a0902e Created 

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=72807ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-16)
  ✔ claw renames across files and updates the call site (72845.544569ms)
✔ multi-file rename + signature change (tier=tier-16) (72846.426292ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 72870.776474
```

### iter 3 — 16:32:04
```
 Container test-test-run-6d018d0ce59e Creating 
 Container test-test-run-6d018d0ce59e Created 

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=32970ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-16)
  ✔ claw renames across files and updates the call site (33007.55648ms)
✔ multi-file rename + signature change (tier=tier-16) (33008.079544ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 33031.346255
```

### iter 4 — 16:32:37
```
 Container test-test-run-50464c0f5a71 Creating 
 Container test-test-run-50464c0f5a71 Created 

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=33499ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-16)
  ✔ claw renames across files and updates the call site (33537.585332ms)
✔ multi-file rename + signature change (tier=tier-16) (33538.127147ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 33562.471485
```

### iter 5 — 16:33:11
```
 Container test-test-run-f92a5903c0c3 Creating 
 Container test-test-run-f92a5903c0c3 Created 

=== multi-file-rename (tier-16) ===
  claw: exit=0 elapsed=13829ms files=[".claw",".sandbox-home",".sandbox-tmp","index.js","lib.js","service.js"]
  node post-fix: exit=0 stderr=
▶ multi-file rename + signature change (tier=tier-16)
  ✔ claw renames across files and updates the call site (13867.2212ms)
✔ multi-file rename + signature change (tier=tier-16) (13869.086467ms)
ℹ tests 1
ℹ suites 1
ℹ pass 1
ℹ fail 0
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 13895.4559
```

## Tier 32GB (16:33:25)

### iter 1 — 16:33:30
```
 Container test-test-run-6be7a9e3cdbb Creating 
 Container test-test-run-6be7a9e3cdbb Created 

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=10390ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-32)
  ✖ claw renames across files and updates the call site (10432.055481ms)
✖ multi-file rename + signature change (tier=tier-32) (10432.873151ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 10458.56955

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (10432.055481ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:88:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

  iter exited non-zero
```

### iter 2 — 16:33:41
```
 Container test-test-run-b301c871b64b Creating 
 Container test-test-run-b301c871b64b Created 

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=5733ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-32)
  ✖ claw renames across files and updates the call site (5773.943645ms)
✖ multi-file rename + signature change (tier=tier-32) (5774.750273ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5797.472743

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (5773.943645ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:88:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

  iter exited non-zero
```

### iter 3 — 16:33:47
```
 Container test-test-run-0bd44e3b47da Creating 
 Container test-test-run-0bd44e3b47da Created 

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=5712ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-32)
  ✖ claw renames across files and updates the call site (5752.544847ms)
✖ multi-file rename + signature change (tier=tier-32) (5753.382976ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5778.476039

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (5752.544847ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:88:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

  iter exited non-zero
```

### iter 4 — 16:33:53
```
 Container test-test-run-7bc4b80f4305 Creating 
 Container test-test-run-7bc4b80f4305 Created 

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=5759ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-32)
  ✖ claw renames across files and updates the call site (5799.206166ms)
✖ multi-file rename + signature change (tier=tier-32) (5800.036587ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 5825.573484

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (5799.206166ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:88:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

  iter exited non-zero
```

### iter 5 — 16:33:59
```
 Container test-test-run-39d31c4f028a Creating 
 Container test-test-run-39d31c4f028a Created 

=== multi-file-rename (tier-32) ===
  claw: exit=0 elapsed=5942ms files=[".claw","index.js","lib.js","service.js"]
  node post-fix: exit=1 stderr=file:///workspace/service.js:1
import { compute } from './lib.js';
         ^^^^^^^
SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
    at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
    at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
    at async node:internal/modules/esm/loader:639:26
    at async asyncRunEntryPointW
▶ multi-file rename + signature change (tier=tier-32)
  ✖ claw renames across files and updates the call site (5978.866226ms)
✖ multi-file rename + signature change (tier=tier-32) (5979.784698ms)
ℹ tests 1
ℹ suites 1
ℹ pass 0
ℹ fail 1
ℹ cancelled 0
ℹ skipped 0
ℹ todo 0
ℹ duration_ms 6003.371734

✖ failing tests:

test at __tests__/tier-eval/multi-file-rename.test.js:66:3
✖ claw renames across files and updates the call site (5978.866226ms)
  AssertionError [ERR_ASSERTION]: index.js still fails after claw's edits:
  file:///workspace/service.js:1
  import { compute } from './lib.js';
           ^^^^^^^
  SyntaxError: The requested module './lib.js' does not provide an export named 'compute'
      at #asyncInstantiate (node:internal/modules/esm/module_job:326:21)
      at async ModuleJob.run (node:internal/modules/esm/module_job:429:5)
      at async node:internal/modules/esm/loader:639:26
      at async asyncRunEntryPointWithESMLoader (node:internal/modules/run_main:101:5)
  
  Node.js v24.15.0
  
  
  1 !== 0
  
      at TestContext.<anonymous> (file:///test/__tests__/tier-eval/multi-file-rename.test.js:88:12)
      at process.processTicksAndRejections (node:internal/process/task_queues:104:5)
      at async Test.run (node:internal/test_runner/test:1208:7)
      at async Promise.all (index 0)
      at async Suite.run (node:internal/test_runner/test:1619:7)
      at async startSubtestAfterBootstrap (node:internal/test_runner/harness:385:3) {
    generatedMessage: false,
    code: 'ERR_ASSERTION',
    actual: 1,
    expected: 0,
    operator: 'strictEqual',
    diff: 'simple'
  }

  iter exited non-zero
```

completed 2026-04-28 16:34:05
