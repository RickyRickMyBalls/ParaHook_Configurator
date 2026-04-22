# Edit History Gen2-4 - Sampler And Import Setting Undo Candidates

## Doc Header

### Doc History
5. 2026-04-22 09:50:25: Manager accepted proof-only `Edit-History-Gen2-4 / Phase 1 - Committed Setting Boundary Proof` after rerunning focused sampler/import readiness, audio sampler store, accepted Import/Catalog history, staged import transform, and production build verification; closed `Edit-History-Gen2-CLG-4`, `Edit-History-Gen2-HLG-4`, and current Gen2-4 scope with future sampler/import setting work deferred until a durable sampler arrangement/output owner or independent committed import-setting owner exists.
4. 2026-04-22 09:47:43: Implemented proof-only Phase 1 with focused readiness coverage for representative raw sampler/radio settings, raw staged import draft settings, accepted staged import transform output through the Gen 1 `Accept Import` seam, adjacent sampler/import regressions, production build verification, and a recommendation to close current Gen2-4 scope after Manager acceptance.
3. 2026-04-22 09:45:02: Manager approved the prepped `Edit-History-Gen2-4 / Phase 1 - Committed Setting Boundary Proof` spec after live seam review confirmed current sampler controls are optional background runtime state and staged import settings become durable authored output only through the existing Gen 1 `Accept Import` history seam.
2. 2026-04-22 09:43:44: Tightened Phase 1 into a proof-only Worker-ready spec after researching live audio sampler store/panel seams, staged import draft/preview/acceptance seams, accepted Import/Catalog Gen 1 boundaries, and sampler/import runtime/staging exclusions.
1. 2026-04-22 04:12:09: Created this Gen 2 future planning surface for sampler and import setting undo candidates before any runtime implementation starts.

### Purpose

This doc routes sampler/import settings that might later become canonical undo entries.

## Doc Body

### Owns

- committed sampler/import settings only when they affect durable authored output
- accepted settings that are stored as project/user authored state after ownership is explicit
- exclusion proof for playhead/runtime transport, waveform/cache/provider/source browsing, upload/session status, staged preview state, and unaccepted import sessions

### Does Not Own

- playhead or runtime transport movement
- waveform caches, provider/source browsing, preview sessions, upload status, staged import drafts, unaccepted import sessions, or temporary sampler UI state
- accepted Import/Catalog project-content commits already covered by Gen 1
- Browser/project organization, Build Path UI, history panel UI, persistence, checkpoints, optional branching, collaboration, or broad import architecture

### Ownership / Storage Questions

- Which sampler/import settings are durable authored output settings versus staging/session options?
- Are settings project-owned, user-owned, import-session-owned, or provider-owned?
- What confirms a setting change: select, blur, accept, save, or explicit commit?
- Which settings affect accepted output, and which only affect preview/browsing?
- Can undo/redo restore committed settings without rewinding upload/session/provider/cache/source state?

### Acceptance Read

This candidate is implementation-ready only when a prep pass identifies concrete committed setting owners, accepted commit APIs, restore payloads, and focused exclusion proof for playhead/runtime/source/provider/cache/session state.

### No-Widening Rule

Do not implement sampler/import setting undo until ownership, storage, and accepted commit boundaries are explicit. Do not capture playhead/runtime transport, waveform/cache/provider/source browsing, upload/session status, preview state, or unaccepted staging state.

## Wishlist Organization

### High Level Goals

- [x] `Edit-History-Gen2-HLG-4` - Evaluate sampler/import settings as authored undo candidates only when committed settings affect durable output and staging/runtime state is excluded.

### Codex Level Goals

- [x] `Edit-History-Gen2-CLG-4` - Define sampler/import setting ownership, accepted commit boundaries, and staging/runtime/source browsing exclusion proof before implementation.

## [x] Edit-History-Gen2-4 / Phase 1 - Committed Setting Boundary Proof

### Phase 1 Summary

Purpose:
- prove whether any current sampler/import settings are committed durable authored output settings outside accepted Import/Catalog Gen 1 project-content history
- keep sampler runtime/playhead/audio transport, waveform/provider/cache/source browsing, staged import drafts, preview organization, object URLs, upload/session status, and unaccepted import sessions out of canonical undo

Owns:
- proof-only ownership/storage mapping for current audio sampler and import setting seams
- raw no-entry/redo-preserving proof for sampler controls that currently live in `useAudioSamplerStore`
- raw no-entry/redo-preserving proof for staged import draft settings before acceptance
- explicit mapping from staged import up-axis/scale settings to the existing Gen 1 `Accept Import` authored-content commit boundary
- closeout recommendation for `Edit-History-Gen2-CLG-4` and `Edit-History-Gen2-HLG-4` based on the proof

Does Not Own:
- runtime sampler/import setting undo wrappers or canonical entries
- accepted Import/Catalog project-content commits already handled by Gen 1 (`Accept Import` and direct Catalog Add To Project)
- sampler playback, playhead, transport, waveform, radio provider/cache/source browsing, preview requests, toolbar panel geometry, or optional background runtime state
- staged import preview organization, column widths, selection, drag/drop preview, structure-inspection loading/error status, source object URLs, browser upload/session status, or unaccepted import sessions
- broad import architecture, provider lifecycle, persistence architecture, Browser/project organization, Build Path, history UI, checkpoints, optional branching, collaboration, Catalog/Pubwheel unrelated work, or command transcript/recall

Current Live Seams:
- `src/app/store/audioSamplerStore.ts` owns an optional-background-runtime sampler/radio Zustand store. It exposes `setSamplerStepCount(...)`, `setSamplerBpm(...)`, `setSamplerStepCueRatio(...)`, `setSamplerStepPlaybackShape(...)`, `rerollSamplerStep(...)`, `rerollAllSamplerSteps(...)`, `toggleSamplerStepEnabled(...)`, `toggleSamplerStepLocked(...)`, `setSamplerNoteRepeatEnabled(...)`, `setSamplerNoteRepeatCount(...)`, `setSamplerNoteRepeatRate(...)`, plus runtime radio/source/waveform/transport/seek/reload/preview request actions. The store has reset/test coverage but no persistence owner or edit-history integration.
- `src/app/panels/AudioSamplerPanel.tsx` wires sampler controls directly to raw sampler store actions. Step count, BPM, and note-repeat controls use `ParaSlider.onChange(...)`; step enable/reroll and reroll-all are discrete buttons. Panel position/size are local React state.
- `src/app/store/audioSamplerStore.test.ts` and `src/app/panels/AudioSamplerPanel.test.tsx` already prove sampler runtime behavior and give focused test seams for future no-entry/redo proof.
- `src/app/references/importReferenceFile.ts` creates source file/object URL records and external-catalog attribution; it is source/session selection plumbing, not an undoable setting owner.
- `src/app/references/stagedImportTransforms.ts` resolves staged import `upAxis`, `scaleAlignment`, and `scaleMultiplier` into accepted transform values. Its tests cover the deterministic conversion helpers.
- `src/app/store/useAppStore.ts` owns `referenceWorkspace.stagedImportDraft`, including `setStagedImportFileMode(...)`, `setStagedImportFileUpAxis(...)`, `setStagedImportFileScaleAlignment(...)`, `setStagedImportFileScaleMultiplier(...)`, `setStagedImportPutAcceptedInNewAssembly(...)`, preview owner organization actions, structure-inspection actions, `commitStagedImportDraft(...)`, and `commitStagedImportDraftWithHistory(...)`.
- `commitStagedImportDraftWithHistory(...)` already creates the Gen 1 `Accept Import` entry after accepted references/project content are created. Staged up-axis/scale choices affect accepted reference transform overrides through `resolveStagedImportAcceptedTransformOverride(...)`, so the authored output is already owned by the accepted-content commit, not by per-staged-setting Gen 2 entries.
- `src/app/panels/BrowserPanel.tsx` and `src/app/panels/useBrowserPanelController.ts` route the import dialog controls to raw staged import draft setters and route accept through `onCommitStagedImportDraft`.
- `src/app/panels/StagedImportPreviewViewport.tsx` renders selected staged files with staged up-axis/scale transforms in a transient Three.js preview runtime and owns local grid-visible preview state.
- `src/app/store/importCatalogEditHistoryStore.test.ts` proves Gen 1 `Accept Import` and Catalog Add To Project canonical history behavior, including raw/failed-only staged import commits staying no-entry.

First-Pass Decisions:
- Phase 1 should be proof-only. The live sampler settings are runtime/background-playback state with no durable authored-output persistence owner, and import settings are staged draft/session state until accepted into the existing Gen 1 import commit.
- No narrow Gen2-4 runtime slice is safe yet because there is no current setting that is both committed independently and durable authored output outside Gen 1 accepted content.
- Staged import up-axis/scale are important authored-output inputs, but their durable result is the accepted reference transform override created during `Accept Import`; undo/redo should continue to use the accepted-content history owner.
- Sampler BPM, step count, cue ratios, locks, note-repeat, playback shaping, radio source, waveform, transport, seek/reload, and preview requests stay excluded until a future durable sampler arrangement/output owner exists.

Decision Table:
- Audio sampler BPM / step count / note repeat / step enabled / lock / cue / fade / scooch: runtime sampler state in `useAudioSamplerStore`; proof-only no-entry/redo-preserving; no runtime undo until a durable sampler arrangement/output owner exists.
- Radio URL / waveform / transport / seek / reload / burst / preview requests: provider/runtime/session state; excluded from canonical undo.
- Audio sampler panel position/size/section expansion: local/session UI state or runtime store disclosure; excluded.
- Import source file selection and object URLs: upload/source-session plumbing in `importReferenceFile.ts`; excluded.
- Staged import mode / up-axis / scale alignment / scale multiplier / put accepted in new assembly: staged draft/session settings in `referenceWorkspace.stagedImportDraft`; proof-only no-entry/redo-preserving before accept; durable accepted effects are owned by Gen 1 `Accept Import`.
- Staged import preview organization / preview selection / column widths / preview viewport grid / structure-inspection status: staging/preview/session state; excluded.
- Accepted Import/Catalog project-content additions: already Gen 1 canonical entries; out of Gen2-4 runtime scope.

### Phase 1 Implementation Spec

Exact First Proof Cut:
- Add a focused readiness proof, likely `src/app/store/samplerImportSettingEditHistoryReadiness.test.ts`, unless extending existing focused store suites is cleaner.
- Seed redo with a minimal canonical entry through `editHistoryStore`, then call representative raw sampler actions from `useAudioSamplerStore`: `setSamplerStepCount(...)`, `setSamplerBpm(...)`, `toggleSamplerStepEnabled(...)`, `toggleSamplerStepLocked(...)`, `setSamplerStepCueRatio(...)`, `setSamplerStepPlaybackShape(...)`, `setSamplerNoteRepeatEnabled(...)`, `setSamplerNoteRepeatCount(...)`, `setSamplerNoteRepeatRate(...)`, `setRadioUrl(...)`, `setRadioTransportState(...)`, `setRadioWaveformState(...)`, `requestRadioSeek(...)`, `requestRadioReload(...)`, and `requestSamplerStepPreview(...)` as practical. Assert the sampler state changes, no canonical undo entry is created, and redo remains available.
- Seed redo, then call representative raw staged import draft actions from `useAppStore`: `openStagedImportDraft(...)`, `appendStagedImportDraftFiles(...)`, `setStagedImportFileMode(...)`, `setStagedImportFileUpAxis(...)`, `setStagedImportFileScaleAlignment(...)`, `setStagedImportFileScaleMultiplier(...)`, `setStagedImportPutAcceptedInNewAssembly(...)`, preview owner create/move/remove actions where feasible, and structure-inspection begin/resolve/fail actions. Assert staged draft/session state changes, no canonical undo entry is created, and redo remains available.
- Add focused proof that `commitStagedImportDraftWithHistory(...)` remains the only canonical authored-output handoff for accepted staged import output. Use existing `importCatalogEditHistoryStore.test.ts` helpers or a narrow readiness assertion to show accepted up-axis/scale produce durable reference transform override state through the `Accept Import` entry, not through individual staged-setting entries.
- Keep existing raw `commitStagedImportDraft(...)` history-free and keep failed/no accepted output commits no-entry.

Likely Files:
- `src/app/store/samplerImportSettingEditHistoryReadiness.test.ts` for the new readiness proof.
- `src/app/store/audioSamplerStore.test.ts` only if raw sampler semantics need adjacent assertion cleanup.
- `src/app/store/importCatalogEditHistoryStore.test.ts` only if the accepted import handoff proof is clearer there.
- `src/app/references/stagedImportTransforms.test.ts` only if transform conversion proof needs a narrow addition.
- `src/app/panels/AudioSamplerPanel.test.tsx`, `src/app/panels/BrowserPanel.test.tsx`, and `src/app/panels/StagedImportPreviewViewport.test.tsx` are optional UI proof seams; avoid them unless the store-level proof is insufficient.
- `docs/CHANGELOG.md`, this phase doc, and `docs/Doc-Log.md` for any proof/test implementation follow-up.

No-Widening Rule:
- Do not implement sampler/import setting runtime undo entries in Phase 1.
- Do not make raw sampler store actions, raw staged import draft setters, file-import helpers, preview viewport state, structure-inspection status, or provider/runtime callbacks historyful.
- Do not capture full `referenceWorkspace`, full `projectContent`, provider/cache/source state, object URL lifecycle, preview renderer state, browser selection, column widths, staged preview drag state, sampler transport, waveform, panel geometry, command transcript/recall, Catalog/Pubwheel unrelated work, or broad import architecture.
- Do not create a durable sampler persistence owner, sampler arrangement schema, or import setting schema in this phase.

No-Op / Redo Rules:
- Raw sampler and staged import setting calls must create no canonical undo entries and must preserve redo availability.
- Missing staged draft, missing staged file, invalid custom scale alignment, invalid/non-finite scale multiplier, unavailable preview organization actions, failed-only import commits, disabled radio preview requests, and no-op sampler/staged setting calls must remain no-entry and redo-preserving.
- A real accepted import commit with durable reference/project-content output may invalidate redo through the existing Gen 1 `Accept Import` entry; Phase 1 must not add a second setting-level entry for the same accepted output.

Checklist:
- [x] Add focused sampler/import setting readiness proof.
- [x] Prove representative raw sampler/radio actions are no-entry and redo-preserving.
- [x] Prove representative raw staged import draft actions are no-entry and redo-preserving before accept.
- [x] Prove accepted staged import settings become durable authored output through the existing Gen 1 `Accept Import` seam.
- [x] Keep raw sampler settings, radio transport/playhead/waveform/source state, staged import preview/session state, source object URLs, failed/no-output imports, and accepted Import/Catalog content outside new Gen2-4 runtime undo.
- [x] Record focused verification and production build result.

Focused verification:
- `npm.cmd test -- --run src/app/store/samplerImportSettingEditHistoryReadiness.test.ts` if the proof file is added.
- `npm.cmd test -- --run src/app/store/audioSamplerStore.test.ts` if raw sampler behavior is touched or relied on.
- `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts` if accepted import handoff proof is added there or relied on.
- `npm.cmd test -- --run src/app/references/stagedImportTransforms.test.ts` if transform conversion assertions are touched.
- `npm.cmd run build`.

Build Gate:
- Run `npm.cmd run build` for the proof implementation. Docs-only prep does not require tests/build.

Tracking Docs:
- Proof/test implementation must update `docs/CHANGELOG.md` with a permanent numbered body entry.
- Any phase-doc closeout must update this doc and `docs/Doc-Log.md`.
- Do not update the Gen2 index or Dispatch run-state during Worker implementation unless Manager explicitly requests it.

Stop Conditions:
- Stop before runtime implementation if proof finds a sampler or import setting that is independently durable but lacks an explicit committed owner, restore payload, or completion boundary.
- Stop before widening if accepted import setting undo would require snapshotting broad `referenceWorkspace`, `projectContent`, provider/cache/source state, staged preview/session state, or object URL lifecycle.
- Stop if a future sampler arrangement/output owner appears but its persistence and authored-output boundaries are not explicit.

Done shape:
- focused proof shows current sampler/import setting seams are raw/no-entry/redo-preserving until accepted output exists
- focused proof shows accepted staged import settings are durable only through existing Gen 1 `Accept Import` project-content/reference entries
- no runtime Gen2-4 wrappers or setting entries are added
- docs record explicit deferrals for sampler arrangement/output settings, runtime/playhead/audio transport, waveform/cache/provider/source browsing, upload/session status, staged preview/draft state, and unaccepted import sessions

Acceptance Mapping:
- `Edit-History-Gen2-CLG-4` can be recommended complete after Phase 1 proof passes and Manager accepts that current sampler/import setting ownership has been classified with focused exclusion coverage.
- `Edit-History-Gen2-HLG-4` can be recommended closed for current explicit scope if Manager accepts that no live Gen2-4 runtime setting entries exist outside Gen 1 accepted Import/Catalog content. Otherwise keep it open only as a future-owner placeholder for a later durable sampler arrangement/output or committed import-setting owner.

Implementation closeout:
- Added `src/app/store/samplerImportSettingEditHistoryReadiness.test.ts`.
- Proved representative raw sampler/radio actions from `useAudioSamplerStore` mutate runtime sampler/radio state while creating no canonical edit-history entries and preserving seeded redo.
- Proved representative raw staged import draft actions from `useAppStore` mutate staged draft/session state while creating no canonical edit-history entries and preserving seeded redo.
- Proved staged import up-axis/scale settings become durable authored output through the existing Gen 1 `commitStagedImportDraftWithHistory(...)` / `Accept Import` seam by asserting the accepted reference transform override and the single `Accept Import` entry.
- Confirmed no Gen2-4 runtime wrappers, durable sampler persistence, sampler arrangement schema, import setting schema, broad import architecture, full `referenceWorkspace`/`projectContent` snapshots, provider/cache/source capture, preview renderer capture, browser selection/column-width capture, command transcript/recall capture, or unrelated Catalog/Pubwheel work were added.

Verification:
- `npm.cmd test -- --run src/app/store/samplerImportSettingEditHistoryReadiness.test.ts` passed: 3 tests.
- `npm.cmd test -- --run src/app/store/audioSamplerStore.test.ts` passed: 17 tests.
- `npm.cmd test -- --run src/app/store/importCatalogEditHistoryStore.test.ts` passed: 5 tests.
- `npm.cmd test -- --run src/app/references/stagedImportTransforms.test.ts` passed: 4 tests.
- `npm.cmd run build` passed with known Vite warnings about externalized `path`/`crypto` from `occt-import-js` and large chunk size.

Done shape:
- Phase 1 proof-only scope is implemented and verified.
- Recommend Manager mark `Edit-History-Gen2-CLG-4` complete after reviewing this proof.
- Recommend Manager close `Edit-History-Gen2-HLG-4` and Gen2 for current explicit scope because sampler/import setting seams are either runtime/session excluded or already durable through Gen 1 accepted Import/Catalog content. Reopen only if a future durable sampler arrangement/output owner or independent committed import-setting owner is introduced.

Manager acceptance:
- Manager reran focused sampler/import readiness, audio sampler store, accepted Import/Catalog history, staged import transform, and production build verification on 2026-04-22 09:50.
- Accepted current sampler/import setting seams as runtime/session excluded or already durable through Gen 1 accepted Import/Catalog content.
- Closed `Edit-History-Gen2-CLG-4`, `Edit-History-Gen2-HLG-4`, and current Gen2-4 scope.
