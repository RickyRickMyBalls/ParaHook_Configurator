# Catalog Gen0 Phase 5 Dispatch Plan

## Summary

This doc is the manager-facing dispatch plan for finishing `Catalog-Gen0 / Phase 5`.

Use it to cycle one Codex through each remaining `Phase 5` subphase in order, keeping each subphase on the same repeatable loop:

- prep the subphase
- implement the first remaining internal slice
- prep the next remaining internal slice
- implement it
- repeat until the subphase is fully complete
- write one final `docs/CHANGELOG.md` entry when that subphase is complete

Default rule:
- use one Codex per subphase
- keep the Codex with that subphase until it is fully complete
- do not parallelize prep and implement for the same subphase

## Dispatch Order

Run the remaining `Phase 5` ladder in this order:

1. `Phase 5.3 - Hooks Asset Migration`
2. `Phase 5.4 - Footpads Asset Migration`
3. `Phase 5.5 - Shared Consumer Path Rewire`
4. `Phase 5.6 - Legacy ReferenceModels Retirement`

Completed already:

- `Phase 5.1 - Catalog Family Folder Contract`
- `Phase 5.2 - Shoes Asset Migration`

## Shared Rules

Every dispatched Codex should follow these rules:

- repo: `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook`
- follow `AGENTS.md`
- follow the completed contract in `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen0-Index.md`
- do not revert edits made by others
- keep scope to the owned subphase only
- prefer one final changelog entry when the full subphase is complete
- update:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Gen0-Index.md`
  - `docs/Doc-Log.md`
  - `docs/CHANGELOG.md` when the subphase is complete
- do not run tests unless truly necessary
- use `apply_patch` for manual edits

## Subphase Checklist

### `Phase 5.3 - Hooks Asset Migration`

Goal:
- move repo-backed hook assets into `public/Catalog/hooks`
- repoint manifest and Catalog seed hook paths
- keep the hooks family usable after the move

Internal cycle targets:
- confirm live hook inventory and the locked destination `public/Catalog/hooks`
- move or copy remaining legacy hook assets into `public/Catalog/hooks`
- repoint manifest hook paths
- repoint and expand Catalog seed hook entries as needed
- update phase tracking docs
- add one final changelog entry when `5.3` is complete

Done when:
- legacy repo hook assets live in `public/Catalog/hooks`
- manifest hook paths point to `Catalog/hooks/...`
- Catalog seed hook paths point to `Catalog/hooks/...`
- `Catalog-Gen0-Index.md` marks `5.3` complete

### `Phase 5.4 - Footpads Asset Migration`

Goal:
- move repo-backed footpad assets into `public/Catalog/footpads`
- carry any required companion files honestly
- repoint manifest and Catalog seed footpad paths

Internal cycle targets:
- confirm live footpad inventory and the locked destination `public/Catalog/footpads`
- move or copy the footpad asset set and any required companion files into `public/Catalog/footpads`
- repoint manifest footpad paths
- repoint and expand Catalog seed footpad entries as needed
- update phase tracking docs
- add one final changelog entry when `5.4` is complete

Done when:
- legacy repo footpad assets and required companions live in `public/Catalog/footpads`
- manifest footpad paths point to `Catalog/footpads/...`
- Catalog seed footpad paths point to `Catalog/footpads/...`
- `Catalog-Gen0-Index.md` marks `5.4` complete

### `Phase 5.5 - Shared Consumer Path Rewire`

Goal:
- remove remaining shared runtime reads that still assume `ReferenceModels/...`
- normalize shared consumers onto the Catalog-owned family homes

Internal cycle targets:
- confirm remaining shared `ReferenceModels/...` consumers after `5.3` and `5.4`
- rewire surviving shared reads to `Catalog/...`
- keep scope to shared consumer cleanup only
- update phase tracking docs
- add one final changelog entry when `5.5` is complete

Done when:
- remaining shared consumers no longer depend on `ReferenceModels/...` for the migrated families
- `Catalog-Gen0-Index.md` marks `5.5` complete

### `Phase 5.6 - Legacy ReferenceModels Retirement`

Goal:
- retire old family folders after the migrations and shared rewires are complete
- leave `Gen0` with one honest Catalog-owned repo asset home

Internal cycle targets:
- confirm which legacy family folders can now be removed or intentionally emptied
- retire the old `ReferenceModels` family folders for the migrated families
- do one final repo-cleanup honesty pass
- update phase tracking docs
- add one final changelog entry when `5.6` is complete

Done when:
- migrated family folders no longer depend on the old `public/ReferenceModels/...` homes
- `Catalog-Gen0-Index.md` marks `5.6` complete
- `Gen0` can honestly claim one clean Catalog-owned repo asset home for these families

## Dispatch Template

Use this manager prompt shape for each remaining subphase:

```text
Continue in repo `C:\Users\Rubbe\Desktop\ParaHookConfig\20\parahook` and now own `Catalog-Gen0 / Phase <N> - <Title>`.

Follow `AGENTS.md` and the `Catalog-Gen0-Index.md` contract. You are not alone in the codebase. Do not revert others' edits.

Your task is to implement `Phase <N>` as a sequential loop until the whole phase is complete.

Use a prep->implement loop for internal slices:
- prep the first remaining slice
- implement it
- prep the next remaining slice
- implement it
- repeat until the whole subphase is complete

Constraints:
- keep scope to `Phase <N>` only
- prefer one final changelog entry when the whole subphase is complete
- update `docs\Human-Plans\Architecture\Workspace-Modes\Workspaces\Catalog\Catalog-Gen0-Index.md`
- update `docs\Doc-Log.md`
- update `docs\CHANGELOG.md` when the phase is complete
- do not run tests unless truly necessary
- use apply_patch for manual edits

Please finish the full phase end-to-end and summarize:
- whether the phase is fully complete
- what files changed
- whether the owned family now lives in its Catalog-owned home
- whether manifest and Catalog seed paths now point to Catalog-owned homes
- whether you used one final changelog entry or multiple, and why
```

## Manager Loop

Use this simple cycle across the rest of `Phase 5`:

1. dispatch one Codex to the next subphase
2. let that Codex finish prep and implementation for the full subphase
3. confirm the final response says the subphase is fully complete
4. move to the next subphase in order
5. stop after `Phase 5.6` is complete

Do not start the next subphase until the current one is closed.
