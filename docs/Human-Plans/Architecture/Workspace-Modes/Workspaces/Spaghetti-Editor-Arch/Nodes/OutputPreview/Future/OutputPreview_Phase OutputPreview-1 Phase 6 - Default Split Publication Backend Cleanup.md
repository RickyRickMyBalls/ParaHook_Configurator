# `OutputPreview-1 Phase 6` - `Default Split Publication Backend Cleanup`

## Doc Header

### Doc History
11. 2026-04-12 06:08:19: Marked `OutputPreview-1 Phase 6.5 - Proof Matrix And Family Handoff` shipped after the final backend-to-surface proof matrix gained explicit grouped-override and touched-legacy materialization coverage, the focused `OutputPreview` Phase 6 test set passed cleanly, and `Phase 6` closed without exposing another grouped-fallback follow-on seam
10. 2026-04-12 06:00:36: Tightened `OutputPreview-1 Phase 6.5 - Proof Matrix And Family Handoff` into an implementation-ready closeout by grounding it in the now-shipped backend default owner, legacy grouped compat materialization, selector/debug alignment, and preview/output proof seams, and by locking the final pass to proof-matrix consolidation plus family-doc closeout instead of more contract churn
9. 2026-04-12 05:55:50: Marked `OutputPreview-1 Phase 6.4 - Selector And Publication Surface Alignment` shipped after preview-preparation, selector, and debug-inspector reads stopped re-owning grouped fallback policy, focused proof passed, and the next handoff advanced to `Phase 6.5 - Proof Matrix And Family Handoff`
8. 2026-04-12 05:43:42: Tightened `OutputPreview-1 Phase 6.4 - Selector And Publication Surface Alignment` into an implementation-ready follow-on by grounding it in the live post-`6.3` grouped fallback reads inside `previewPreparation.ts`, `selectNodeVm.ts`, and `selectDebugInspectorVm.ts`, and by locking the next pass to removal of stale downstream grouped-default assumptions now that fresh split defaults and durable legacy grouped compat are both explicit
7. 2026-04-12 05:41:09: Marked `OutputPreview-1 Phase 6.3 - Legacy Graph Compat And Migration Handling` shipped after `ensureOutputPreviewSlots.ts` began materializing touched legacy omitted slot modes to explicit grouped rows while fresh split defaults stayed intact, focused compat proof passed, and the next handoff advanced to `Phase 6.4 - Selector And Publication Surface Alignment`
6. 2026-04-12 05:38:27: Tightened `OutputPreview-1 Phase 6.3 - Legacy Graph Compat And Migration Handling` into an implementation-ready follow-on by grounding it in the post-`6.2` seam where fresh defaults now serialize explicit split while legacy omitted slot mode still survives only through read-time grouped compat, and by locking the recommended direction that touched legacy `OutputPreview` params should materialize explicit grouped mode durably without yet reopening downstream selector or preview-surface cleanup
5. 2026-04-12 05:35:36: Marked `OutputPreview-1 Phase 6.2 - Backend Default Owner Flip` shipped after the canonical fresh-slot default in `outputPreviewNode.ts` changed from explicit grouped to explicit split while the legacy grouped compat owner stayed intact, focused backend system proof passed, and the next handoff advanced to `Phase 6.3 - Legacy Graph Compat And Migration Handling`
4. 2026-04-12 05:32:12: Tightened `OutputPreview-1 Phase 6.2 - Backend Default Owner Flip` into an implementation-ready follow-on by grounding it in the post-`6.1` seam where fresh `OutputPreview` defaults now serialize explicit grouped mode, legacy omitted slot mode already has one named grouped compat path, and the next change should flip only the fresh default owner to split without yet touching legacy compat or downstream selector/preview fallback cleanup
3. 2026-04-11 21:49:07: Marked `OutputPreview-1 Phase 6.1 - Default Contract Audit And Compat Lock` shipped after `outputPreviewNode.ts` split fresh explicit grouped defaults from legacy omitted-mode grouped compat, `ensureOutputPreviewSlots.ts` started seeding fresh synthesized slots with explicit grouped mode, focused system proof passed, and the next handoff advanced to `Phase 6.2 - Backend Default Owner Flip`
2. 2026-04-11 21:32:38: Tightened `OutputPreview-1 Phase 6.1 - Default Contract Audit And Compat Lock` into an implementation-ready first slice by grounding it in the live grouped fallback owners across `outputPreviewNode.ts`, `previewPreparation.ts`, `selectNodeVm.ts`, and `selectDebugInspectorVm.ts`, and by locking the recommended compat answer that legacy stored slots without explicit `publicationMode` should keep grouped through an explicit compat rule while fresh defaults flip later in `Phase 6.2`
1. 2026-04-11 21:32:38: Created this dedicated `OutputPreview-1 Phase 6` future plan doc to split the backend/default-contract cleanup for `SolidBodies` split publication into Codex-sized chunks, keeping the publication-mode default work separate from the earlier managed-row visual convergence passes

### Purpose

- define the dedicated backend/default-contract cleanup plan that makes aggregate `SolidBodies` publication default to split on `System/OutputPreview`
- keep the publication-mode default and legacy-graph compat work separate from the already-mostly-shipped managed-row visual refactor
- split the remaining backend cleanup into narrow chunks Codex can implement one by one without reopening unrelated node-surface styling work

### Scope

This phase covers:
- the default `publicationMode` contract for fresh and implicit `OutputPreview` `SolidBodies` slots
- backend normalization ownership in `System/OutputPreview`
- explicit compat or migration handling for older graphs that omit `publicationMode`
- selector, preview-preparation, and output-surface alignment so every read path agrees on the new default
- focused proof that one aggregate `SolidBodies` wire with many bodies now publishes many browser objects by default

This phase does not cover:
- more managed-row shell or color work from `Phase 5`, `Phase 5a`, or `Phase 5c`
- removing grouped publication support entirely unless the first audit proves that explicit grouped override should be retired
- broader Browser/content hierarchy work outside `OutputPreview`
- upstream geometry authorship semantics beyond relying on upstream nodes to author grouping when grouped output is desired

## Doc Body

## [x] `OutputPreview-1 Phase 6` - `Default Split Publication Backend Cleanup`

Purpose:
- make `SolidBodies` publish one object per body by default on `OutputPreview`, with authored grouping staying upstream in geometry or later boolean nodes instead of being silently imposed at the publication handoff

Owns:
- changing the default `OutputPreview` slot publication mode for `SolidBodies` from grouped to split
- normalization and default-param cleanup in the `System/OutputPreview` backend contract
- deciding and documenting compat or migration behavior for older graphs that omit explicit `publicationMode`
- selector, preview-preparation, and output-surface alignment so omitted `publicationMode` no longer silently reads as grouped by default
- focused proof that one aggregate `SolidBodies` wire with four bodies now yields four published objects by default

Does not own:
- the row-template convergence and calmer managed-row UX work from `Phase 5`
- the shared managed-row base refactor work from `Phase 5c`
- removing grouped publication support entirely if explicit grouped override still belongs in the product contract
- broader Browser/content hierarchy changes
- upstream geometry authorship semantics in `Extrude` or boolean nodes beyond relying on them for authored grouping when desired

Current seam read:
- split publication fan-out is already present in the lower layers when a slot explicitly uses `publicationMode: 'split'`
- `src/app/spaghetti/system/outputPreviewNode.ts` still owns the canonical default as `OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE = 'grouped'`
- `src/app/spaghetti/previewPreparation.ts` still falls back to grouped in multiple omitted-mode read paths, so preview identities and split member counts still assume grouped unless the slot is explicit
- `src/app/spaghetti/selectors/selectNodeVm.ts` still treats missing slot publication mode as grouped when building the visible `OutputPreview` row summaries
- focused explicit-split proof already exists in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
- that means the missing work is no longer split fan-out itself; it is the default contract, omitted-mode compat behavior, and the remaining scattered grouped fallbacks

Locked direction:
- fresh `OutputPreview` nodes and fresh implicit `SolidBodies` slots should default to split publication
- explicit `publicationMode: 'grouped'` should remain supported unless the audit in `Phase 6.1` proves that override no longer belongs in the product contract
- omitted `publicationMode` behavior for older graphs must become intentional and documented before the backend default flips
- the backend should expose one clear default owner instead of repeating grouped fallbacks across selectors and preview preparation

Likely files:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/outputSurface.ts`
- possibly `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` if debug reads should mirror the new default cleanly
- focused tests in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
  - preview-preparation or preview-render tests that currently assume grouped fallback

Suggested implementation order:
1. Audit every omitted-mode grouped fallback and lock the compat answer for older graphs.
2. Flip the backend default owner for fresh and implicit `OutputPreview` slots.
3. Implement the chosen legacy-graph compat or migration behavior.
4. Align selector, preview-preparation, and output-surface reads with the backend default owner.
5. Re-run a focused proof matrix for fresh split-default slots, explicit grouped override, and multi-body publication fan-out.

Acceptance checks:
- a newly created `OutputPreview` slot no longer defaults to grouped publication for `SolidBodies`
- one aggregate `SolidBodies` wire with four bodies publishes four objects by default
- backend normalization, selector reads, preview preparation, and output surface all agree on the same default
- compat or migration behavior for older graphs without explicit `publicationMode` is intentional and documented rather than accidental
- the phase does not drift back into `Phase 5` UI work

Shipped result:
- `src/app/spaghetti/system/outputPreviewNode.ts`, `src/app/spaghetti/system/ensureOutputPreviewSlots.ts`, `src/app/spaghetti/previewPreparation.ts`, `src/app/spaghetti/selectors/selectNodeVm.ts`, and `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` now leave one explicit publication-mode ownership split in place: fresh slots default to explicit split, explicit grouped override still works, and legacy omitted slot mode stays grouped through the named compat plus materialization path
- the final proof matrix now covers that contract across backend normalization, repair paths, selector/debug reads, preview preparation, and output surface, including the touched-legacy repair path and the durable trailing empty split-slot invariant
- no additional grouped-fallback owner surfaced during the closeout proof, so `Phase 6` closes cleanly without an immediate `Phase 6.6` follow-on

## [x] `OutputPreview-1 Phase 6.1` - `Default Contract Audit And Compat Lock`

Purpose:
- isolate the exact omitted-mode owners and lock the intentional compat answer before any backend behavior flips

Owns:
- auditing every place where missing `publicationMode` still falls back to grouped
- deciding whether older graphs without explicit `publicationMode` should preserve grouped behavior through an explicit compat rule or migrate to the new split default
- locking one backend owner for the default publication-mode contract

Does not own:
- changing the runtime default yet
- selector or output-surface wording cleanup beyond whatever tiny clarification is needed to lock the contract

Current seam read:
- the grouped fallback is still duplicated instead of having one obvious owner:
  - `src/app/spaghetti/system/outputPreviewNode.ts`
  - `src/app/spaghetti/previewPreparation.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.ts`
- the real omitted-mode owners are now clearer:
  - `OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE = 'grouped'` still lives in `src/app/spaghetti/system/outputPreviewNode.ts`
  - `createOutputPreviewNode()` and `OUTPUT_PREVIEW_DEFAULT_PARAMS` still create fresh slots as `{ slotId: 's001' }`, which later normalize through that grouped backend default
  - `normalizeOutputPreviewParams(...)` still upgrades missing slot mode to grouped for both fresh and legacy params
  - `prepareGraphPreviewPreparation(...)` in `src/app/spaghetti/previewPreparation.ts` still builds `publicationModeBySlotId` with `slot.publicationMode ?? 'grouped'`
  - `getPreviewPreparationEntriesForSlot(...)` still falls back to grouped again when preview-preparation metadata omits the slot mode
  - `buildOutputPreviewSlotRows(...)` in `src/app/spaghetti/selectors/selectNodeVm.ts` still reads `slot.publicationMode ?? 'grouped'` for visible slot summaries
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` still falls back to grouped in debug-only reads, so inspector truth would drift if the backend owner changes and debug is not updated deliberately
- explicit split already works, so the highest-risk mistake now is silently changing old omitted-mode graphs without deciding whether that break is acceptable

Suggested answer:
- yes, `Phase 6.1` should lock compat before any default flip lands
- preserve legacy grouped behavior for already-stored graphs whose `OutputPreview` slots omit explicit `publicationMode`
- implement that legacy behavior through one explicit compat rule instead of continuing to rely on scattered `?? 'grouped'` fallbacks
- reserve the fresh-default flip for `Phase 6.2`, where new `OutputPreview` nodes and fresh implicit slots can move to split without retroactively rewriting old saved graphs

Why:
- old graphs already exist with `slots: [{ slotId: 's001' }]` and likely authored around grouped publication
- a blind default flip in `outputPreviewNode.ts` would silently turn those old graphs into split-publication graphs
- the vision direction favors more explicit publication ownership, so the right move is not hidden drift; it is one intentional compat read plus one intentional fresh-default owner

Locked implementation direction:
- `Phase 6.1` should produce one explicit legacy-compat rule keyed off omitted stored `publicationMode`, not just a doc note
- later chunks should stop using repeated grouped fallbacks as accidental compat
- after this audit, every remaining grouped fallback should be classified as one of:
  - canonical backend default owner to change in `6.2`
  - deliberate legacy compat read to preserve in `6.3`
  - stale fallback to delete in `6.4`

Expected output:
- one locked answer for omitted `publicationMode` on older graphs
- one explicit inventory of the grouped fallback owners that later chunks must change
- one narrowed implementation handoff for the backend default flip
- one recommendation for which fallback owner should remain authoritative after the audit:
  - backend default owner for fresh nodes
  - explicit compat branch for legacy omitted-mode nodes

Likely files:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- focused tests in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - debug or selector proof only if the audit chooses to codify compat in code immediately

Suggested implementation order:
1. Re-read the fresh-node default owner in `outputPreviewNode.ts` and separate it from legacy omitted-mode reads.
2. Inventory every `?? 'grouped'` read and classify it as backend owner, legacy compat, or stale fallback.
3. Lock the explicit compat recommendation for stored graphs whose slots omit `publicationMode`.
4. Update this doc so `Phase 6.2` can change only the fresh default owner without guessing about legacy behavior.

Acceptance checks:
- the doc and codebase have one explicit compat answer instead of an implied default drift
- later chunks can implement the split-default cleanup without guessing which omitted-mode reads are intentional
- the audit names the exact grouped fallback owners that `6.2`, `6.3`, and `6.4` will each own, instead of leaving those boundaries fuzzy

Shipped result:
- `src/app/spaghetti/system/outputPreviewNode.ts` now codifies the legacy compat rule directly through `readOutputPreviewSlotPublicationMode(...)`, which distinguishes explicit stored `grouped` or `split` from omitted legacy slot mode and normalizes omitted stored mode to grouped through one named compat path instead of anonymous fallback drift
- fresh default `OutputPreview` slots now serialize with explicit grouped mode through `buildDefaultOutputPreviewSlot(...)` and `OUTPUT_PREVIEW_DEFAULT_PARAMS`, so newly created nodes are no longer indistinguishable from legacy omitted-mode graphs
- `src/app/spaghetti/system/ensureOutputPreviewSlots.ts` now seeds or appends fresh synthesized slots with explicit grouped mode, while untouched legacy stored slots may remain omitted and continue to read through the compat path
- focused proof landed in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
- the next implementation-ready handoff is `OutputPreview-1 Phase 6.2 - Backend Default Owner Flip`

## [x] `OutputPreview-1 Phase 6.2` - `Backend Default Owner Flip`

Purpose:
- change the canonical `System/OutputPreview` default so fresh and implicit `SolidBodies` slots normalize to split publication

Owns:
- updating `OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE`
- updating fresh node/default param helpers so new `OutputPreview` nodes inherit the split default honestly
- updating backend normalization so implicit slot reads use the new default owner instead of grouped

Does not own:
- legacy-graph compat branches beyond the minimum seam needed for the chosen `6.1` answer
- selector/output-surface wording cleanup

Current seam read:
- `src/app/spaghetti/system/outputPreviewNode.ts` is the cleanest owner for the canonical default flip
- after `Phase 6.1`, the key backend ownership split is now explicit:
  - fresh defaults flow through `buildDefaultOutputPreviewSlot(...)` and `OUTPUT_PREVIEW_DEFAULT_PARAMS`
  - legacy omitted stored slot mode flows through `readOutputPreviewSlotPublicationMode(...)` and `OUTPUT_PREVIEW_LEGACY_COMPAT_PUBLICATION_MODE`
- that means `6.2` no longer needs to solve legacy compat first; it can change the fresh default owner directly without also rewriting old saved graphs
- newly synthesized trailing slots already flow through the same fresh default helper in `src/app/spaghetti/system/ensureOutputPreviewSlots.ts`, so flipping that helper should also flip the auto-appended-slot default honestly
- selector, preview-preparation, and output-surface code can continue reading explicit split from normalized params after this flip, even if their remaining grouped compat fallbacks are not cleaned up until `6.4`

Locked implementation direction:
- change `OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE` from grouped to split
- keep `OUTPUT_PREVIEW_LEGACY_COMPAT_PUBLICATION_MODE` grouped
- keep `readOutputPreviewSlotPublicationMode(...)` distinguishing explicit stored mode from omitted legacy compat
- make fresh defaults and fresh synthesized slots serialize explicit split mode
- do not yet remove the downstream grouped fallback reads that still support legacy compat until `6.4`

Expected output:
- newly created `OutputPreview` nodes now store `publicationMode: 'split'` explicitly on fresh slots
- newly synthesized trailing `OutputPreview` slots also store explicit split mode
- legacy saved graphs whose slots omit `publicationMode` still normalize to grouped through the named compat path from `6.1`
- explicit grouped override remains valid and visible

Likely files:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/system/outputPreviewNode.test.ts`
- `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
- `src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`

Suggested implementation order:
1. Flip the fresh default owner in `outputPreviewNode.ts` from grouped to split.
2. Confirm `buildDefaultOutputPreviewSlot(...)`, `OUTPUT_PREVIEW_DEFAULT_PARAMS`, and `createOutputPreviewNode()` all now serialize explicit split mode.
3. Re-prove that auto-seeded and auto-appended `OutputPreview` slots inherit the new explicit split default without touching legacy omitted-mode compat.
4. Leave selector, preview-preparation, and output-surface cleanup for `6.4` unless the tests prove a tiny follow-on seam is required.

Acceptance checks:
- newly created `OutputPreview` nodes normalize to split publication by default
- fresh synthesized slots now read split unless an explicit grouped override is present
- legacy omitted-mode graphs still read grouped through the explicit compat path from `6.1`
- the chunk leaves behind one obvious backend owner for the default publication mode

Shipped result:
- `src/app/spaghetti/system/outputPreviewNode.ts` now treats explicit split as the canonical fresh default through `OUTPUT_PREVIEW_DEFAULT_PUBLICATION_MODE = 'split'`, while `OUTPUT_PREVIEW_LEGACY_COMPAT_PUBLICATION_MODE = 'grouped'` still preserves the older omitted-mode read path
- fresh `OutputPreview` nodes created through `createOutputPreviewNode()` and `OUTPUT_PREVIEW_DEFAULT_PARAMS` now serialize `publicationMode: 'split'` explicitly instead of relying on grouped-first omission
- `src/app/spaghetti/system/ensureOutputPreviewSlots.ts` now seeds and appends fresh trailing slots with explicit split mode through the same shared default helper, while untouched legacy omitted slots remain eligible for grouped compat
- focused proof landed in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
- the next implementation-ready handoff is `OutputPreview-1 Phase 6.3 - Legacy Graph Compat And Migration Handling`

## [x] `OutputPreview-1 Phase 6.3` - `Legacy Graph Compat And Migration Handling`

Purpose:
- implement the intentional omitted-mode behavior for older graphs using the answer locked in `Phase 6.1`

Owns:
- the read-time compat rule or migration path for graphs whose stored `OutputPreview` slots omit `publicationMode`
- any required helper or normalization branch that keeps old graphs from changing behavior accidentally
- focused proof for the chosen compat path

Does not own:
- broader selector or UI cleanup beyond the compat behavior itself
- removing explicit grouped override support if the contract still keeps it

Current seam read:
- older graphs may still store `slots: [{ slotId: 's001' }]` without explicit mode, and after `6.2` those graphs now depend on the named grouped compat reader in `src/app/spaghetti/system/outputPreviewNode.ts` to avoid silently flipping to split
- that means the legacy behavior is intentional, but it is still not durable in stored params:
  - untouched legacy graphs stay omitted on disk
  - any future cleanup that removes grouped fallback reads in selectors or preview prep will rely on the backend seam having already materialized old grouped intent somewhere safer than anonymous omission
- `src/app/spaghetti/system/ensureOutputPreviewSlots.ts` and related repair/normalization paths already rewrite `OutputPreview` params when nodes are touched, so they are the most natural place to convert legacy omitted slots into explicit grouped slots without forcing a whole-graph migration up front

Locked implementation direction:
- preserve grouped behavior for legacy omitted-mode graphs
- when a legacy `OutputPreview` node is normalized or repaired through a write path, materialize omitted legacy slots to explicit `publicationMode: 'grouped'`
- keep untouched legacy graphs readable through the named compat path until they are touched
- do not yet change selector, preview-preparation, or output-surface fallback cleanup; that still belongs to `6.4`

Expected output:
- one explicit write-path behavior for legacy omitted slots instead of indefinite hidden omission
- touched legacy `OutputPreview` params become durable and self-describing with explicit grouped slot mode
- fresh split defaults and explicit grouped legacy compat can now coexist without depending on permanent silent omission

Likely files:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/system/ensureOutputPreviewSlots.ts`
- possibly other `OutputPreview` write/repair seams that currently preserve raw omitted slots
- focused tests in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
  - any repair-path tests that should now prove legacy omission gets materialized on touch

Acceptance checks:
- omitted-mode legacy graphs behave according to the explicit `6.1` decision instead of inheriting accidental drift
- fresh graphs and legacy graphs are distinguishable in code where necessary, without scattering more hidden defaults
- touched legacy `OutputPreview` params no longer stay silently omitted; they become explicit grouped rows through the chosen compat write path

Shipped result:
- `src/app/spaghetti/system/ensureOutputPreviewSlots.ts` now materializes touched legacy omitted slot modes to explicit grouped rows by reusing the normalized compat slots whenever the repair path encounters legacy omitted `publicationMode`
- untouched legacy graphs can still remain omitted on disk until a repair/normalization write path touches them, so the compat behavior stays read-safe without forcing whole-graph migration up front
- fresh split defaults from `6.2` remain intact because only legacy compat slots are rewritten to explicit grouped mode during this pass
- focused proof landed in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
- the next implementation-ready handoff is `OutputPreview-1 Phase 6.4 - Selector And Publication Surface Alignment`

## [x] `OutputPreview-1 Phase 6.4` - `Selector And Publication Surface Alignment`

Purpose:
- make the higher-level read models agree with the backend default and compat behavior

Owns:
- selector alignment in `src/app/spaghetti/selectors/selectNodeVm.ts`
- preview-preparation alignment in `src/app/spaghetti/previewPreparation.ts`
- publication/output-surface alignment in `src/app/spaghetti/outputSurface.ts`
- any tiny debug-inspector read cleanup needed to keep the surface honest

Does not own:
- new publication fan-out algorithms
- node-surface template restyling

Current seam read:
- after `6.2` and `6.3`, the backend contract is now explicit enough that the remaining grouped-default drift is mostly downstream:
  - `prepareGraphPreviewPreparation(...)` in `src/app/spaghetti/previewPreparation.ts` still builds `publicationModeBySlotId` with `slot.publicationMode ?? 'grouped'`
  - `getPreviewPreparationEntriesForSlot(...)` still falls back to grouped again when preview-preparation metadata omits the slot mode
  - `buildOutputPreviewSlotRows(...)` in `src/app/spaghetti/selectors/selectNodeVm.ts` still reads `slot.publicationMode ?? 'grouped'` for visible `OutputPreview` row summaries
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` still falls back to grouped in debug reads
- touched legacy omitted slots now materialize to explicit grouped on the write path from `6.3`, while untouched legacy graphs still normalize through the named backend compat reader, so these downstream grouped fallbacks are no longer the right owner for compat
- that means the next drift is not backend default ownership anymore; it is that selectors and preview-preparation still carry stale grouped-first assumptions even though the backend can already hand them explicit split or explicit grouped values

Locked implementation direction:
- make `previewPreparation.ts`, `selectNodeVm.ts`, and `selectDebugInspectorVm.ts` trust normalized backend slot publication mode instead of re-owning grouped fallback policy
- keep using backend normalization/read helpers as the single owner for fresh split defaults and legacy grouped compat
- remove stale grouped fallback assumptions wherever the normalized backend contract is already sufficient
- keep explicit grouped override readable and visible
- do not reopen backend default ownership or legacy write-path behavior; those are already handled by `6.2` and `6.3`

Expected output:
- visible `OutputPreview` slot summaries now default to split whenever the backend-normalized slot says split
- preview-preparation identities and member counts now fan out from the same backend-normalized slot contract instead of locally assuming grouped
- debug-inspector reads match the same normalized publication-mode truth as the visible node and preview preparation
- downstream grouped fallback policy is reduced or removed because compat now belongs to backend normalization instead of surface-local guessing

Likely files:
- `src/app/spaghetti/previewPreparation.ts`
- `src/app/spaghetti/selectors/selectNodeVm.ts`
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts`
- possibly `src/app/spaghetti/outputSurface.ts` only if proof shows another stale grouped read on the publication-surface side
- focused tests in:
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
  - preview-preparation or preview-render tests
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`

Suggested implementation order:
1. Remove stale grouped fallback ownership from `previewPreparation.ts` while preserving the normalized backend slot contract.
2. Align `selectNodeVm.ts` row summaries to that same backend-normalized publication mode.
3. Align `selectDebugInspectorVm.ts` so debug reads report the same publication-mode truth.
4. Re-run focused selector, preview-preparation, and output-surface proof for:
   - fresh split defaults
   - explicit grouped override
   - untouched legacy omitted slot mode that still reads grouped through backend compat
5. Touch `outputSurface.ts` only if the proof shows another stale grouped-first assumption there.

Acceptance checks:
- visible `OutputPreview` row summaries now default to split publication when the backend default says split
- preview-preparation and output-surface identities now fan out by default for aggregate `SolidBodies` slots
- explicit grouped override still reads honestly if the contract keeps it
- legacy grouped compat still survives through backend normalization rather than through fresh downstream `?? 'grouped'` assumptions

Shipped result:
- `src/app/spaghetti/previewPreparation.ts` now builds slot publication metadata directly from backend-normalized `OutputPreview` slots, and its shared entry reader now treats the normalized mode as the owner instead of reintroducing a fresh grouped-default branch
- `src/app/spaghetti/selectors/selectNodeVm.ts` now reads visible `OutputPreview` row publication mode from the normalized backend slot contract instead of keeping a local grouped-first assumption in the row-summary builder
- `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` now reports slot and extrude-linked publication mode from the same normalized backend truth, so debug surfaces stay aligned with selector and preview-preparation reads
- focused proof landed in:
  - `src/app/spaghetti/previewPreparation.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
- the proof did not require an `outputSurface.ts` behavior change, so `Phase 6.4` closes with output-surface alignment confirmed through the existing surface contract rather than another publication-surface rewrite
- the next implementation-ready handoff is `OutputPreview-1 Phase 6.5 - Proof Matrix And Family Handoff`

## [x] `OutputPreview-1 Phase 6.5` - `Proof Matrix And Family Handoff`

Purpose:
- close the backend default-split cleanup with one explicit proof matrix and a clean `OutputPreview` family handoff now that fresh split defaults, legacy grouped compat, and downstream read alignment are all already shipped

Owns:
- focused proof across backend normalization, legacy write-path materialization, selector/debug reads, preview preparation, and output surface
- proof for the three contract lanes that now define `OutputPreview` publication honesty:
  - fresh split-default slots
  - explicit grouped override
  - legacy omitted-mode grouped compat, including durable grouped materialization when touched
- final family-doc closeout after that proof confirms there is no remaining accidental grouped fallback owner

Does not own:
- new backend/default-contract behavior beyond what `Phase 6.1` through `6.4` already locked
- row-template or UI polish work
- broader family follow-on planning unless focused proof exposes one real new seam

Current seam read:
- `Phase 6.1` through `6.4` already moved the behavior:
  - `src/app/spaghetti/system/outputPreviewNode.ts` now owns the fresh split default plus the named grouped legacy-compat read
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.ts` now materializes touched legacy omitted slots to explicit grouped mode
  - `src/app/spaghetti/previewPreparation.ts`, `src/app/spaghetti/selectors/selectNodeVm.ts`, and `src/app/spaghetti/selectors/selectDebugInspectorVm.ts` now read backend-normalized publication mode instead of re-owning grouped fallback
  - `src/app/spaghetti/outputSurface.ts` already agreed with that contract, so `6.4` closed through proof instead of another runtime rewrite
- the remaining risk is therefore not another obvious behavior seam; it is that the proof is still spread across chunk-local tests instead of being closed as one explicit end-to-end matrix
- the backend and surface tests already cover most of the needed contract:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
  - `src/app/spaghetti/previewPreparation.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
- what is still missing is one explicit closeout pass that proves the same publication-mode answer across those seams before the family declares `Phase 6` done

Locked implementation direction:
- prefer augmenting the focused existing tests over reopening runtime behavior
- prove the same three publication-mode lanes everywhere:
  - fresh split default
  - explicit grouped override
  - legacy omitted-mode grouped compat, including the touched legacy materialization path
- confirm selector rows, debug reads, preview preparation, and output surface all agree with the backend-normalized slot contract for those lanes
- if that proof reveals one last accidental grouped fallback owner, fix only that narrow seam; otherwise keep this pass to proof and closeout

Acceptance checks:
- the focused proof matrix explicitly covers:
  - fresh split-default slots
  - explicit grouped override
  - untouched legacy omitted-mode grouped compat
  - touched legacy grouped materialization through the repair/write path
- backend helpers, repair paths, selectors, debug reads, preview preparation, and output surface all agree on the same publication-mode contract
- the `OutputPreview` family docs can close `Phase 6` cleanly without inventing another follow-on unless proof exposes a real new seam
- the phase closes on backend/default-contract honesty rather than another round of UI polish

Shipped result:
- `src/app/spaghetti/previewPreparation.test.ts` now proves explicit grouped override directly alongside the already-shipped fresh split default and untouched legacy grouped-compat lanes, so preview-preparation proof now reads the full publication-mode matrix instead of only two corners of it
- `src/app/spaghetti/outputSurface.test.ts` now proves that the touched legacy repair path materializes explicit grouped mode while preserving the trailing empty split slot, and that preview-preparation plus output-surface building stay aligned with that normalized contract all the way to emitted output entries
- focused proof re-ran cleanly in:
  - `src/app/spaghetti/system/outputPreviewNode.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSingleton.test.ts`
  - `src/app/spaghetti/system/ensureOutputPreviewSlots.test.ts`
  - `src/app/spaghetti/previewPreparation.test.ts`
  - `src/app/spaghetti/selectors/selectNodeVm.test.ts`
  - `src/app/spaghetti/selectors/selectDebugInspectorVm.test.ts`
  - `src/app/spaghetti/outputSurface.test.ts`
- the proof did not expose another runtime seam, so `Phase 6.5` closes as the final `Phase 6` closeout instead of opening a fresh follow-on
