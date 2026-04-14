# `Model-Viewport-1.2` - `Draft Preview Execution And Viewport Swap Rules`

## Doc Header

### Doc History
7. 2026-04-07 04:28: Marked `Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty` shipped after the repo wired the dead model-viewport `-` button into a real viewport-local `A / D / F` control, added the first selector-owned `Geometry: ...` HUD status line, and proved the new mode/status seams through focused workspace, selector, overlay, and shell tests
6. 2026-04-07 04:18: Tightened `Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty` into an implementation-ready slice by grounding the dead top-left control in the actual `WorkspaceViewportTree -> ViewportFrame` primary-button seam, locking the first model-viewport status surface to a viewport-visible badge downstream from the Phase 2 selector, and sharpening the exact `A / D / F` control plus honesty-copy rules for the next implementation
5. 2026-04-07 04:14: Marked `Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation` shipped after the repo added one selector-owned viewport result-state read model, moved `ViewerHost` onto that seam for draft/final/fallback selection, and added focused selector plus viewer tests proving `Final requested but unavailable` no longer silently behaves like `Auto`
4. 2026-04-06 17:35: Tightened `Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation` into an implementation-ready slice by grounding it in the current retained-geometry selectors, artifact-first preview VM path, and `ViewerHost` assembly seam, then locking the first pending/fallback answers so the next implementation can derive one explicit viewport-visible result state before any top-left mode UI lands
3. 2026-04-06 16:59: Marked `Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership` shipped after the repo added the viewport-local `viewportResultMode` seam, normalized and persisted that new mode alongside existing viewport-local chrome state, exposed explicit active/by-id result-mode selectors plus behavior helpers, and added focused workspace tests proving `Auto / Draft / Final` ownership without widening into swap derivation or UI wiring
2. 2026-04-06 16:52: Tightened `Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership` into an implementation-ready slice by locking the first ownership decision to viewport-local mode state, defining the first `Auto / Draft / Final` execution/display recommendations, and grounding the next seam in the current retained geometry-result selectors plus Browser build-trigger timing boundary
1. 2026-04-06 16:41: Created the dedicated `Model-Viewport 1.2` child doc, split the viewport-side follow-on into `Phase 1 - Viewport Result Mode Contract And Ownership`, `Phase 2 - Draft/Final Selection And Swap State Derivation`, and `Phase 3 - Top-Left Mode Control And User-Facing Status Honesty`, and grounded that ladder in the now-shipped `1.1` retained geometry-result seams plus the existing Browser build-policy timing boundary

### Purpose

Use this doc as the dedicated planning and execution surface for the `Model-Viewport-1 / Task 2` viewport-mode ladder.

The goal here is:
- lock how `Model Viewport` should choose between draft and final geometry
- keep that choice downstream from the shared retained geometry-result contract created in `1.1`
- keep Browser/Build-Path timing policy separate from viewport result presentation
- define the future top-left `Auto / Draft / Final` control as a real user-facing execution/display mode instead of a cosmetic toggle
- hand authoritative-engine and export work forward to `Model-Viewport-1.3` without leaving viewport swap behavior fuzzy

### Scope

This phase family covers:
- viewport-owned result preference and swap rules
- how retained draft geometry and later final geometry should be chosen for display
- how stale/loading/failure states should read in the viewport
- the current dead top-left three-state control as the first home for `Auto / Draft / Final`
- how viewport mode should relate to, but not redefine, Browser/Build-Path build-trigger policy

This phase family does not cover:
- redefining the shared geometry request/result contract from `1.1`
- final authoritative engine/library choice
- final `.step` export handoff
- unrelated camera-control or sketch-tool overlay behavior

## Doc Body

### Summary

`Model-Viewport-1.2` should be the dedicated viewport-behavior child under the broader `Model-Viewport-1` geometry-overhaul ladder.

Current baseline:
- `Model-Viewport-1.1` is now fully closed through `Phase 6`
- the repo now has one retained geometry-result contract at:
  - `src/shared/geometryResult.ts`
- graph-local runtime state now retains:
  - `acceptedGeometryResult`
  - `acceptedPreviewGeometryResult`
- the Browser/Build-Path timing side already has a separate build-trigger family under:
  - `live`
  - `release`
  - `manual`
  - `off`
- what `1.2` needed to close was the viewport-side truth for:
  - which result class should be shown
  - how stale or missing final geometry should be represented
  - when draft should remain visible
  - what the top-left `Auto / Draft / Final` control actually means
- current internal status:
  - `Phase 1 - Viewport Result Mode Contract And Ownership`
    - shipped
  - `Phase 2 - Draft/Final Selection And Swap State Derivation`
    - shipped
  - `Phase 3 - Top-Left Mode Control And User-Facing Status Honesty`
    - shipped
- next handoff:
  - `Model-Viewport 1.3 - Authoritative Geometry Execution And Export Handoff`

Locked recommendation:
- keep this child focused on viewport-owned selection and swap behavior
- do not let `1.2` quietly redefine Build Path timing policy
- do not let Browser build policy become the hidden owner of draft-versus-final display semantics
- define one viewport-owned result-mode contract first, then derive one visible swap/status model from it

Why this order is healthier:
- `1.1` already established the shared request/result boundary
- the next risk is not geometry-contract drift anymore
- the next risk is the viewport inventing ad hoc display behavior before there is one explicit rule for choosing between:
  - retained draft geometry
  - retained final geometry
  - stale visible geometry
  - loading/failure fallback

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/shared/geometryResult.ts`
  - now owns the canonical retained geometry-result contract
  - is the shared seam `1.2` should consume for viewport result-class behavior
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - now exposes graph-local selectors for:
    - `selectViewerTargetGraphAcceptedGeometryResult`
    - `selectViewerTargetGraphAcceptedPreviewGeometryResult`
  - is the current state seam where viewport display can start reading retained geometry truth instead of only artifact bundles
- `src/app/components/ViewerHost.tsx`
  - is the main viewer-side assembly seam today
  - still reads accepted preview build outputs and preview-preparation more strongly than retained geometry-result truth
  - already applies one temporary draft-only override through `applyActiveDraftExtrudePreviewOverride(...)`, which proves the viewport can host draft-local display logic today
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
  - still derives the slot-based preview list from `PartArtifact[]`
  - is the clearest reminder that the current preview surface is still artifact-first rather than retained-geometry-first
- `src/app/store/useAppStore.ts`
  - already owns Browser build-trigger timing and interaction timing through:
    - `browserGraphBuildPolicyByGraphDocumentId`
    - `pendingBuildAfterRelease`
    - `requestBrowserGraphDocumentBuild(...)`
  - is the clearest proof that build timing already has a different owner than viewport display
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Build-Path/Build-Path-Index.md`
  - now explicitly says Build Path should own authoritative build-trigger timing while Model Viewport owns result presentation

### Phase Breakdown

1. `Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership`
Reason:
- before the repo wires any UI control, it needs one explicit viewport-owned meaning for:
  - `Auto`
  - `Draft`
  - `Final`
- this is the phase that should separate viewport result preference from Browser build-trigger timing
Current status:
- shipped in this doc

2. `Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation`
Reason:
- once mode meaning is explicit, the repo needs one derived selection/swap model that decides what geometry the viewport should show from the retained draft/final result family
- this is the phase that should lock stale/loading/failure fallback behavior
Current status:
- shipped in this doc

3. `Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty`
Reason:
- after mode meaning and selection rules are locked, the viewport needs a real user-facing control and status readout
- this is the phase that should claim the dead top-left three-state surface and make the visible viewport status honest
Current status:
- shipped in this doc

## [x] Model-Viewport 1.2 Phase 1 - Viewport Result Mode Contract And Ownership

### Summary

#### Purpose:
- lock what `Auto / Draft / Final` means before any UI or execution wiring lands

#### Current strongest read:
- the retained geometry-result contract now exists and is graph-local
- Browser build timing already exists and should stay separate
- the viewport currently has no explicit result-mode owner, so draft-versus-final display would drift if implemented directly in `ViewerHost.tsx` first

#### Locked direction:
- add one viewport-owned result-mode contract
- keep it distinct from Build Path trigger timing
- define meaning at both:
  - display time
  - execution-request preference time

#### Locked recommendation:
- use:
  - `Auto`
  - `Draft`
  - `Final`
- `Auto` means:
  - allow draft to appear immediately when available
  - allow final to replace draft when ready
- `Draft` means:
  - prefer draft geometry only
  - do not replace the visible viewport with final while this mode stays active
- `Final` means:
  - prefer authoritative/final geometry only
  - skip draft work when the execution path is capable of honoring that request

#### Important boundary rule:
- `Build Path` owns when authoritative builds trigger:
  - `live`
  - `release`
  - `manual`
  - `off`
- `Model Viewport` owns which result class the user is allowed to see
- `1.2` may define how viewport mode influences build-request preference, but it should not redefine the timing-policy family itself

### Questions / Decisions

#### [x] Question 1 - Should viewport result mode be viewport-local, shared-viewer-local, or project-global?

##### Locked answer
- the first implementation should be viewport-local
- shared-viewer composition should read the hosting viewport's mode for now
- project-global defaults may come later, but should not be the first owner

##### Why
- this keeps the first implementation aligned with the wider workspace direction where different model viewports may eventually behave differently
- it avoids one heavy or conservative viewport forcing every other viewport into the same result preference
- it keeps the first state seam small enough to live near existing viewport-local workspace/viewer ownership

##### Locked rules
- whether each model viewport may choose a different result mode
- whether shared-viewer composition should force one common result mode
- whether the first implementation can stay viewport-local even if later project presets exist
- first implementation answer:
  - yes, each viewport may choose its own result mode
  - shared-viewer composition uses the hosting viewport's mode
  - no project-global mode owner yet

#### [x] Question 2 - How should viewport mode influence execution requests?

##### Locked answer
- `Auto`
  - allow draft display immediately when available
  - still allow final execution according to Build Path timing
  - allow final to replace draft when it becomes ready
- `Draft`
  - show draft-only display while active
  - suppress final replacement while active
  - may still allow final execution in the background if Build Path timing requests it
- `Final`
  - prefer final-only display
  - request no draft work when the execution path is capable of honoring that preference
  - if final is unavailable, fall back to an explicit pending/fallback state rather than silently behaving like `Auto`

##### Why
- this keeps `Build Path` as the owner of when final builds happen
- it lets `Model Viewport` own what result classes are worth displaying for that viewport
- it keeps `Draft` from secretly turning into `Auto`
- it makes `Final` the only mode that actively asks to skip draft work

##### Locked rules
- whether `Final` should request final-only work immediately
- whether `Draft` should suppress final replacement only, or also suppress final execution while active
- whether `Auto` should be the only mode allowed to show both result classes over time
- first implementation answer:
  - yes, `Final` should prefer final-only work
  - `Draft` should suppress final replacement, but not necessarily ban final execution forever
  - yes, `Auto` is the only mode allowed to visibly transition from draft to final over time

### Implementation Spec

Likely files:
- `src/app/components/ViewerHost.tsx`
- `src/shared/geometryResult.ts`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewToolbar.tsx`
- nearby viewport-local workspace state seams
- nearby viewport/workspace state seams for per-viewport settings as needed

Implementation-ready recommendation:
1. Add one viewport-local result-mode state seam with the first values:
   - `auto`
   - `draft`
   - `final`
2. Keep that state distinct from Browser build-trigger timing and do not widen `BrowserBuildPolicy` to carry viewport-mode meaning.
3. Add one small selector/helper that can answer:
   - the active viewport result mode
   - whether that mode allows draft display
   - whether that mode allows final replacement
   - whether that mode prefers skipping draft work
4. Keep shared-viewer composition on the hosting viewport's mode for the first cut instead of introducing a second composition-owned mode seam.
5. Leave Phase 2 to derive actual visible geometry choice and swap behavior from that mode contract.

Scope honored:
- keep this phase on mode contract and ownership only
- do not implement swap-state derivation here
- do not implement the top-left control UI here
- do not widen into authoritative engine or export behavior here

Focused verification target:
- the repo has one explicit viewport-local result-mode state seam
- `Auto / Draft / Final` meaning is testable without needing final-geometry runtime support yet
- Browser build-trigger timing remains a separate owner from viewport result mode

Definition of done:
- the repo has one explicit viewport result-mode contract
- that contract is separate from Build Path trigger timing
- `Auto / Draft / Final` meaning is locked before any selection or UI wiring widens further

## [x] Model-Viewport 1.2 Phase 2 - Draft/Final Selection And Swap State Derivation

### Summary

#### Purpose:
- derive one honest viewport-visible result-selection and swap model from the retained geometry-result family

#### Current strongest read:
- the viewport can already read:
  - accepted build outputs
  - accepted preview build outputs
  - retained geometry results
  - viewport-local result mode and behavior flags
- but current rendering still routes more strongly through:
  - `PartArtifact[]`
  - `previewPreparation`
  - slot/output-entry preview mapping
- and `ViewerHost.tsx` still composes those surfaces directly
- so `1.2` needs one explicit selector/read-model seam before UI polish or top-left mode controls widen further

#### Locked direction:
- define one derived viewport result state that can answer:
  - visible result class
  - visible geometry source
  - stale/loading/failure state
  - whether the viewport should keep showing prior geometry while newer geometry is pending

#### Locked recommendation:
- keep stale geometry visible by default when it is still the last accepted usable result
- avoid replacing usable visible geometry with a blank loading state unless:
  - the selected mode disallows the only currently available result class
  - or the graph has no accepted geometry yet
- let final replace draft only when:
  - final exists
  - viewport mode allows it
- keep failure/fallback truth explicit instead of quietly reusing draft without a visible state marker
- keep the first selector honest to the current runtime truth:
  - retained geometry currently only supports `draft + ok`
  - so the first derived state must still be able to say `final requested but unavailable` without pretending authoritative runtime support already exists

### Questions / Decisions

#### [x] Question 1 - What should the viewport show while final geometry is still pending?

##### Locked answer
- `Auto`
  - keep the last usable draft visible while final is pending
  - mark the derived state as `pendingFinal` instead of blanking the viewport
- `Final`
  - keep the last usable final visible while a newer final is pending
  - if no final has ever been accepted, do not silently fall back to draft display
  - instead return an explicit final-pending / final-unavailable fallback state
- `Draft`
  - keep draft visible and suppress final replacement while active

##### Why
- this preserves visual continuity during heavy builds without letting `Final` secretly behave like `Auto`
- it matches the already-locked rule that `Auto` is the only mode allowed to visibly transition from draft to final over time
- it keeps the viewport honest about the current runtime limitation that no authoritative/final result family exists yet

##### Locked rules
- `Auto` may keep the last usable draft visible while final work is pending
- `Final` may keep the last usable final visible while a newer final is pending
- `Final` may not silently display draft as if it were final when no final exists
- a hard empty state is only correct when:
  - the selected mode disallows the only available result class
  - or the graph has no accepted usable geometry at all

#### [x] Question 2 - What should the first derived viewport result state contain?

##### Locked answer
- the first derived viewport result state should answer:
  - `requestedMode`
  - `visibleResultClass`
  - `visibleSourceKind`
  - `geometryResult`
  - `artifactBuildOutputs`
  - `previewPreparation`
  - `isPendingFinal`
  - `isUsingFallback`
  - `fallbackReason`
- `visibleSourceKind` should distinguish at least:
  - `retained-draft`
  - `retained-final`
  - `artifact-preview`
  - `none`
- `fallbackReason` should distinguish at least:
  - `final-unavailable`
  - `no-accepted-geometry`
  - `mode-disallows-available-result`

##### Why
- `ViewerHost.tsx` currently needs both retained-geometry truth and the older artifact/preview-preparation path
- the first implementation still has to bridge those two worlds honestly instead of pretending the retained geometry path already renders everything directly
- keeping both the chosen source kind and the fallback reason explicit will make `Phase 3` status text straightforward later

##### Locked rules
- the first selector should be a read model, not a renderer
- it should return enough information for `ViewerHost.tsx` to decide what to render without re-deriving mode semantics there
- it may include both retained-geometry references and artifact fallback references during the transition
- it should not claim failure-status support beyond the current runtime truth if the underlying contracts still only emit `ok`

### Implementation Spec

Likely files:
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/viewer/selectPreviewRenderList.ts`
- `src/app/spaghetti/selectors/selectPreviewRenderVm.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- new nearby selectors/helpers for viewport result derivation as needed

Implementation-ready recommendation:
1. Add one selector-owned viewport result read model near the existing spaghetti/viewer selectors instead of deriving swap behavior inline in `ViewerHost.tsx`.
2. Make that selector consume:
   - active viewport result mode / behavior
   - retained draft geometry
   - retained final geometry when it exists later
   - accepted preview build outputs
   - preview preparation
3. Keep the first visible-source bridge honest by allowing:
   - retained geometry references for result-class truth
   - artifact/preview-preparation fallback for the current render path
4. Return explicit `pendingFinal` and `fallbackReason` fields so `Phase 3` status copy can stay downstream from this selector instead of inventing separate UI heuristics.
5. Keep this phase on derived selection/swap state only.
   - do not wire the top-left mode control yet
   - do not widen into authoritative engine work
   - do not force the retained geometry bundle to become the immediate direct viewer render path if the current viewer still needs artifact fallback

Focused verification target:
- the repo has one explicit viewport result-selection selector/read-model seam
- `ViewerHost.tsx` no longer invents draft/final swap rules inline
- `Auto / Draft / Final` produce different derived visible states from the same retained/result inputs
- `Final requested but unavailable` is representable without silently behaving like `Auto`

Definition of done:
- the repo has one explicit viewport result-selection model
- draft/final swap and stale/loading/failure behavior no longer live as ad hoc component logic
- the viewport can explain what it is showing before the top-left mode control is wired

## [x] Model-Viewport 1.2 Phase 3 - Top-Left Mode Control And User-Facing Status Honesty

### Summary

#### Purpose:
- make the viewport-mode contract visible and honest to the user

#### Current strongest read:
- the current dead top-left three-state control is the intended first home for this feature
- that control is not in `ViewerHost.tsx`
- it actually lives at:
  - `src/app/workspace/ViewportFrame.tsx`
  - with `WorkspaceViewportTree.tsx` currently deciding its label, click meaning, aria copy, and which surface kinds get to use it
- the repo already has one selector-owned viewport result read model at:
  - `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `ViewerHost.tsx` already consumes that selector, so Phase 3 should stay downstream from that read model instead of re-deriving mode or fallback meaning in UI chrome
- the viewport also already has a visible overlay/HUD surface through:
  - `src/app/components/ViewportOverlay.tsx`
- what is still missing is a dedicated model-viewport mode control and a visible status treatment that says whether the user is seeing:
  - draft
  - final
  - loading pending final
  - failure/fallback

#### Locked direction:
- claim the dead top-left three-state control for:
  - `Auto`
  - `Draft`
  - `Final`
- implement that control through the existing `ViewportFrame` primary button for `modelViewer` surfaces only
- pair that control with one small visible status label or badge in the viewport-visible surface instead of relying on the single-letter button alone
- keep the visible status downstream from the derived selection model from Phase 2

#### Locked recommendation:
- short labels in the control may be:
  - `A`
  - `D`
  - `F`
- but the underlying visible state copy should still use the full terms:
  - `Auto`
  - `Draft`
  - `Final`
- add one visible status read such as:
  - `Draft`
  - `Final`
  - `Building Final...`
  - `Final Unavailable`
- first status-home recommendation:
  - keep the lettered mode control in `ViewportFrame` header chrome
  - keep the richer honesty badge in the viewport-visible overlay/HUD layer so it stays close to the geometry the user is actually seeing

### Questions / Decisions

#### [x] Question 1 - Where should the first user-facing viewport mode control live?

##### Locked answer
- the first user-facing viewport mode control should live in the existing `ViewportFrame` primary button for `modelViewer`
- `WorkspaceViewportTree.tsx` should become the owner that maps viewport-local `auto / draft / final` mode state into:
  - `primaryButtonLabel`
  - `primaryButtonAriaLabel`
  - `primaryButtonTitle`
  - `onPrimaryButtonClick`
- right-click behavior on that same button should stay what it already is:
  - open the viewport-type picker
- any future duplicate menu/settings control should be secondary, not the primary owner

##### Why
- this reuses the exact dead top-left surface already visible in the workspace shell instead of inventing a second mode owner in the overlay or toolbar
- `WorkspaceViewportTree.tsx` already routes the browser `- / e / +` button through this same prop seam, so the first model-viewport cut can follow the same shell-owned pattern without widening `ViewerHost.tsx`
- keeping the control in frame chrome preserves the difference between:
  - choosing viewport mode
  - reading current visible result status

##### Locked rules
- the first mode control is header-chrome-local, not a floating overlay button
- the control should only replace the dead model-viewport `-` button, not alter browser or other surface-kind button semantics
- later menu duplication is allowed, but those later menus must read/write the same viewport-local mode state instead of becoming another owner

#### [x] Question 2 - What user-facing honesty text should accompany the control?

##### Locked answer
- the single-letter control is not enough by itself
- Phase 3 should add one separate visible status badge or label downstream from `selectViewportResultState(...)`
- the first status copy should stay small and deterministic:
  - visible draft:
    - `Draft`
  - visible final:
    - `Final`
  - draft visible while final is pending in `Auto`:
    - `Building Final...`
  - `Final` requested with no accepted final result:
    - `Final Unavailable`
  - no accepted geometry yet:
    - `Waiting For Geometry`
- the first cut should not invent extra prose by guessing beyond the selector-owned state; if needed, map directly from:
  - `visibleResultClass`
  - `isPendingFinal`
  - `isUsingFallback`
  - `fallbackReason`

##### Why
- the control tells the user what mode they asked for, but it does not tell them what they are actually seeing
- the Phase 2 selector already carries the right truth for pending and fallback states, so the status copy should stay downstream from that seam instead of adding fresh UI heuristics
- a small stable badge is easier to keep honest than a larger sentence-level status panel in the first cut

##### Locked rules
- Phase 3 should show both:
  - requested mode in the top-left control
  - actual visible result state in one nearby viewport-visible status read
- `Final` mode may not silently look like `Draft`
- fallback wording should describe the current visible/result limitation, not promise authoritative runtime support the repo does not yet have

### Implementation Spec

Likely files:
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/ViewportFrame.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceViewportResultMode.ts`
- focused workspace / viewport UI tests as needed

Implementation-ready recommendation:
1. Reuse the existing `ViewportFrame` primary button for `modelViewer` surfaces by making `WorkspaceViewportTree.tsx` map the active viewport's `viewportResultMode` to:
   - visible label:
     - `A`
     - `D`
     - `F`
   - aria/title copy using the full terms:
     - `Auto`
     - `Draft`
     - `Final`
   - click behavior:
     - cycle `auto -> draft -> final -> auto`
2. Leave right-click behavior on that same button unchanged so the viewport-type picker still works.
3. Add one small viewport-visible status badge or label that reads from the Phase 2 selector-owned result state instead of recomputing fallback meaning in `ViewportFrame` or `ViewportOverlay`.
4. Keep the first status mapper narrow and deterministic:
   - `draft + not pending` -> `Draft`
   - `draft + pending final` -> `Building Final...`
   - `final` -> `Final`
   - `fallbackReason = final-unavailable` -> `Final Unavailable`
   - `fallbackReason = no-accepted-geometry` -> `Waiting For Geometry`
5. Keep this phase on control wiring and honesty copy only.
   - do not widen into Build Path timing changes
   - do not widen into authoritative engine support
   - do not widen into menu duplication or larger settings surfaces

Focused verification target:
- the dead model-viewport `-` button becomes a working `A / D / F` mode control
- the control is viewport-local and only affects `modelViewer` surfaces
- the viewport shows one small honest status read that changes with the selector-owned result state
- `Final requested but unavailable` is visible to the user instead of silently behaving like `Auto`

Definition of done:
- the viewport mode is user-visible
- the top-left three-state control has a real honest meaning
- the viewport visibly communicates whether the user is looking at draft, final, or a pending/fallback state
