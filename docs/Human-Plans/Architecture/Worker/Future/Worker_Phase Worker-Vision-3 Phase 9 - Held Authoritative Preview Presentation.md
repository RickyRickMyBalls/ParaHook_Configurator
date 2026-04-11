# Worker Phase Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation

## Doc Header

### Doc History
13. 2026-04-10 15:10: Tightened `Worker-Vision-3 Phase 9.6 - Runtime Narration And Hardening Proof` into an implementation-ready closeout slice by grounding it in the live `TitleStatusBar.tsx` presentation labels, the current `selectViewportResultStatus.ts` coarse `Draft / Final / Building Final` HUD wording, and the existing `selectViewportResultState.ts` preview-kind plus accepted-state contract that the final narration pass should now consume without reopening render timing or Browser policy
12. 2026-04-10 14:52: Marked `Worker-Vision-3 Phase 9.2 - Presentation Controls UI Surface` complete in this planning surface after the three presentation controls landed behind a compact hidden `i` menu inside the runtime inspector header, so the live Phase 9 follow-on now narrows down to the final `9.6` wording and proof closeout only
11. 2026-04-10 14:39: Marked `Worker-Vision-3 Phase 9.5 - Preview Timing And 75 Percent Promotion` and `Worker-Vision-3 Phase 9.5b - Distinct Authoritative Preview Lane And Auto Layered Promotion` complete in this planning surface after the selector timing pass and the staged authoritative preview-ready plus `Auto` retained-base layering follow-through both landed in code, so the held-authoritative behavior is now recorded as shipped before the later `9.2` controls UI and `9.6` wording closeout
10. 2026-04-10 14:23: Tightened `Worker-Vision-3 Phase 9.5b - Distinct Authoritative Preview Lane And Auto Layered Promotion` into an implementation-ready bridge slice by grounding it in the live `useSpaghettiStore.ts` viewer-target accepted-versus-committed authoritative selectors, the current `selectViewportResultState.ts` non-synthesized `previewBrep` rule, and the missing `ViewerHost.tsx` `Auto` retained-final-plus-final-overlay branch needed for held `lastLoaded 100% + previewBrep 75%` layering
9. 2026-04-10 14:17: Added `Worker-Vision-3 Phase 9.5b - Distinct Authoritative Preview Lane And Auto Layered Promotion` after code review of the shipped `9.5` selector timing pass showed two remaining seams still block the full held-authoritative behavior: the live store does not yet expose a truly newer non-accepted authoritative preview result distinct from the committed lane, and `ViewerHost.tsx` does not yet render `Auto` as retained `lastLoaded` base plus `previewBrep` overlay when that newer authoritative preview becomes ready during the same held interaction
8. 2026-04-10 14:02: Marked `Worker-Vision-3 Phase 9.1 - Presentation Settings Schema And Ownership`, `9.3 - Viewport Presentation State Contract`, and `9.4 - Viewer Application Of Presentation Controls` complete in this planning surface after the app-owned settings seam, widened selector contract, and style-aware host/viewer application all landed in code, while leaving `9.2`, `9.5`, and `9.6` open as the remaining work
7. 2026-04-10 13:59: Tightened `Worker-Vision-3 Phase 9.5 - Preview Timing And 75 Percent Promotion` into an implementation-ready behavior slice by grounding it in the live `selectViewportResultState.ts` preview-state resolver, the now-shipped style-aware `ViewerHost.tsx` / `Viewer.ts` render seam, and one explicit direction for when `previewMesh`, `previewBrep`, and accepted presentation should replace one another across Browser `live / release / manual / off`
6. 2026-04-10 13:41: Tightened `Worker-Vision-3 Phase 9.4 - Viewer Application Of Presentation Controls` into an implementation-ready rendering-only slice by grounding it in the live `ViewerHost.tsx` layered handoff, the current `ViewerViewportRenderLayers` base-versus-overlay seam in `Viewer.ts`, and one explicit direction for applying `lastLoaded / previewMesh / previewBrep` style settings without changing preview timing or accepted-truth ownership
5. 2026-04-10 13:19: Reworked `Worker-Vision-3 Phase 9` into a broader preview-timing and acceptance ladder so `50%` now means live in-interaction preview only, `75%` means preview-ready but not yet accepted, `100%` remains accepted visible truth, and the phase now explicitly maps `Auto / Draft / Final` against Browser `live / release / manual / off` timing without exposing user customization before the preview-state contract and behavior are honest
4. 2026-04-10 11:55: Tightened `Worker-Vision-3 Phase 9.1 - Presentation Settings Schema And Ownership` into an implementation-ready first slice by grounding it in the live app-owned settings seams, naming one explicit `lastLoaded / previewMesh / previewBrep` presentation-settings contract with opacity-plus-color values, and locking the pass to schema ownership plus persistence only before later UI, selector, and viewer application work
3. 2026-04-10 11:44: Split `Worker-Vision-3 Phase 9` again into a finer `9.1` through `9.6` ladder so each Codex-sized pass now owns only one step: settings schema, controls UI, viewport-state contract, viewer application, held-authoritative promotion, and final narration/proof hardening
2. 2026-04-10 11:44: Split `Worker-Vision-3 Phase 9` into explicit `9.1`, `9.2`, and `9.3` Codex-sized slices after direction clarified that users should get authored transparency and color controls for last-loaded geometry, draft preview mesh, and held authoritative preview B-rep separately before the full `75%` held-authoritative promotion behavior lands
1. 2026-04-10 11:44: Added this standalone `Worker-Vision-3 Phase 9` planning surface so the next Worker follow-on can introduce an explicit `75%` held-authoritative preview state during active interaction without widening Browser build policy or weakening the accepted-versus-current viewport truth contract established in `Phase 8`

### Purpose

This doc defines the standalone execution direction for `Worker-Vision-3 Phase 9`.

Use it to answer:
- how preview timing should differ between Browser `live`, `release`, `manual`, and `off`
- how the viewport should map `50%`, `75%`, and `100%` across `Auto`, `Draft`, and `Final`
- which seams should own preview-ready versus accepted truth and later render styling
- how to keep this change presentation-only without splitting Browser build policy into separate mesh-versus-final controls

Do not use it to:
- redefine Browser build policy
- add a second user-facing execution policy for mesh versus authoritative geometry
- weaken the Phase 8 `Draft / Final / Auto` truth contract
- reopen worker scheduling ownership beyond the narrow readiness read needed for presentation

### Why This Doc Exists

`Worker-Vision-3 Phase 8` standardized one `50%` in-progress overlay rule and made selector truth plus viewer layering explicit, but it still treats preview timing too narrowly and still assumes the most important distinction is only "while dragging" versus "released".

That is good enough for first honest layering, but not yet good enough to distinguish:
- draft mesh that is still provisional while the user is dragging
- preview results that become ready only after release under Browser `release`
- authoritative B-rep geometry that is already ready before acceptance
- fully released and accepted presentation after the interaction boundary ends

This standalone Phase 9 exists so the next pass can add one explicit intermediate presentation state without:
- inventing a second hidden owner of geometry truth
- collapsing preview-ready versus accepted state together
- or widening Browser policy into separate user-facing mesh and final controls

### Scope

This doc covers:
- one preview-timing and acceptance ladder for draft and authoritative preview results
- authored user controls for transparency and color of the three relevant viewport presentation states
- the opacity and promotion contract for `50% -> 75% -> 100%`
- the selector/read facts needed to distinguish live preview, preview-ready-not-accepted, and released accepted presentation
- the viewer/host proof needed so opacity remains honest across `Auto`, `Draft`, and `Final`

This doc does not cover:
- a new build policy family
- export behavior
- new worker lanes
- theme/material redesign beyond the narrow opacity-state cue

## Doc Body

## [ ] Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation

### Header

Purpose:
- add one explicit preview-timing and acceptance presentation ladder across Browser policy timing and viewport mode

Owns:
- the preview-ready versus accepted presentation contract
- the authored control surface for tuning transparency and color of:
  - last loaded geometry during churn
  - draft preview mesh during active change
  - preview B-rep when authoritative geometry is available before acceptance
- the `50%` live-preview versus `75%` preview-ready-not-accepted versus `100%` released-accepted opacity ladder
- the selector/read distinction between accepted current truth and preview-ready non-accepted truth
- the proof that this new state stays presentation-only and does not create a second execution-policy system

Does not own:
- Browser build policy
- worker dispatch policy
- accepted result ownership
- broad viewer redesign

### Current Constraints

This phase starts from the already-shipped `Phase 8` direction in:
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation.md`

It should stay aligned with:
- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 - Authoritative Scheduling And Final Acceptance Rules.md`

Locked starting constraints:
- keep one user-facing Browser build policy system
- do not split user-facing policy into separate mesh versus authoritative controls
- accepted geometry truth remains distinct from any live-preview or preview-ready presentation state
- `100%` opacity should remain reserved for released accepted presentation only
- `50%` should mean live in-interaction preview only
- `75%` should mean preview-ready but not yet accepted
- if users get controls, those controls should tune presentation only and must not become hidden execution-policy owners

Current live seams still expected to matter:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/viewer/Viewer.ts`
- `src/app/store/useAppStore.ts`

### Locked Direction

#### 1. Keep one Browser build policy and add one internal presentation state only

Recommended first rule:
- keep `live / release / manual / off` as the only user-facing Browser build policy system
- treat the new `75%` state as a viewport presentation/read contract layered on top of the existing draft and authoritative execution lanes

Important rule:
- do not add separate user-facing mesh and final policy chips
- do not make the Browser explain combinations such as `mesh live, authoritative manual`

#### 2. Standardize one three-step opacity ladder by preview state, not by one narrow lane name

Recommended first rule:
- `0.5`
  - live in-interaction preview only
  - use it only while the user is actively changing a value and preview is allowed during interaction
- `0.75`
  - preview-ready but not yet accepted
  - this may happen during interaction under Browser `live`, or after release under Browser `release`
- `1.0`
  - released accepted presentation only

Important rule:
- `0.5` should not appear after release
- `0.75` should not be narrated as accepted or committed
- `1.0` must not appear before the normal release-plus-acceptance boundary

#### 2A. User controls should exist for all three visual states, but remain presentation-only

Recommended first rule:
- users may tune transparency and color independently for:
  - `Last loaded geometry`
  - `Preview mesh while changing param`
  - `Preview B-rep while changing param`

Important rule:
- these controls should not change dispatch timing or scheduling policy
- the controls should map onto explicit viewport presentation states rather than vaguely named style buckets

#### 3. The `75%` state means preview-ready, not accepted truth

Recommended first rule:
- selector/store reads should distinguish:
  - accepted current result
  - preview-ready current result that is not yet accepted
  - live in-progress preview during interaction

Important rule:
- do not let preview-ready state masquerade as accepted current truth
- do not advance committed/accepted revision facts just because a preview result exists

#### 4. Promotion timing should follow Browser policy and acceptance, not just worker completion

Recommended first rule:
- Browser `live`
  - may show `0.5` during interaction when the eligible preview lane is still in-progress
  - may upgrade to `0.75` as soon as that preview lane becomes ready
- Browser `release`
  - should not show `0.5` during interaction
  - should first show `0.75` only after release, once the eligible preview lane becomes ready
- Browser `manual`
  - should wait for explicit build
- Browser `off`
  - should suppress worker preview/result updates for the scoped target
- any preview result should promote to `1.0` only when the normal release-plus-acceptance path says it is now visible accepted truth

Important rule:
- release remains the semantic commit boundary for on-release behavior
- do not let the viewport silently auto-commit merely because the B-rep path finished quickly

#### 5. `Draft`, `Final`, and `Auto` should decide eligible preview lanes, not rewrite the opacity meanings

Recommended first rule:
- `Auto`
  - Browser `live`
    - while dragging, show draft mesh preview at `0.5` as soon as possible
    - if authoritative preview becomes ready before acceptance, upgrade that preview to `0.75`
  - Browser `release`
    - show no drag preview
    - after release, show the first eligible preview result at `0.75`
- `Draft`
  - should stay draft-pure and should not pretend draft mode is showing accepted final truth
  - Browser `live`
    - during interaction, show draft mesh at `0.5`
    - after release and draft acceptance, the visible draft result may become the `1.0` accepted presentation for Draft mode
  - Browser `release`
    - show no drag preview
    - show draft preview after release when ready
- `Final`
  - Browser `live`
    - do not fall back to ordinary draft mesh
    - if authoritative preview is available during interaction, show it at `0.75`
  - Browser `release`
    - show no drag preview
    - after release, show authoritative preview at `0.75` when ready
  - promote to `1.0` only on release plus authoritative acceptance

Important rule:
- do not reintroduce ordinary draft fallback into `Final`
- do not use `0.5` for Final authoritative preview just because there is no mesh lane
- do not make `Draft` look accepted-final merely because opacity increased

#### 6. Runtime narration and inspector copy should expose the distinction directly

Recommended first rule:
- runtime/inspector wording should distinguish:
  - `Live preview`
  - `Preview ready`
  - `Released accepted result`

Important rule:
- do not keep calling the `75%` state just `final` or `accepted`
- the user should be able to tell the difference between ready and committed

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

Likely supporting files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`

### Verification Bar

Required focused proof:
- Browser `live` with only draft-ready preview still renders at `50%` during interaction
- Browser `live` upgrades a ready preview result from `50%` to `75%` without marking it accepted
- Browser `release` shows no `50%` drag preview and first shows preview-ready results at `75%` after release
- the same preview-ready result does not become `100%` until release plus acceptance
- `100%` remains reserved for released accepted presentation
- Browser build policy remains one user-facing system without mesh-versus-authoritative split controls
- runtime/inspector wording stays honest about `ready` versus `accepted`
- user controls only affect color/opacity presentation for the three states and do not affect execution policy

### Sub-Phase Breakdown

## [x] Worker-Vision-3 Phase 9.1 - Presentation Settings Schema And Ownership

### Purpose

Introduce one explicit app-owned settings contract for the three relevant viewport presentation states before any controls UI or viewport behavior changes.

### Owns

- naming the three presentation states clearly in the settings/state contract
- storing user-tunable color and transparency settings for:
  - last loaded geometry while current params differ
  - preview mesh while changing param
  - preview B-rep while changing param
- keeping those settings presentation-only

### Does Not Own

- visible controls UI
- held-authoritative readiness detection
- viewport selector/host/viewer application
- `75%` promotion behavior

### Implementation Target

After this slice:
- the three presentation-state settings exist in one explicit owner
- defaults are defined for color and opacity
- no visible controls or viewport behavior changes land yet

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/store/useAppStore.ts`
  - already owns app-level persisted/toggleable workspace-facing state such as Browser policy, panel state, and other user-adjustable app settings
  - is the strongest current owner for presentation settings that must stay outside viewer-only transient state
- `src/app/components/ViewportOverlay.tsx`
  - already acts as a user-facing viewport-adjacent controls surface
  - should remain a later caller/consumer of the settings contract rather than the owner of the settings schema itself
- `src/app/components/ViewerHost.tsx`
  - already bridges selector/view state into viewer render inputs
  - should remain a later consumer of presentation settings rather than inventing ad hoc fallback values locally
- `src/viewer/Viewer.ts`
  - already owns material/color/opacity application
  - should consume normalized settings later, not define the settings contract here

Important current limitation:
- there is not yet one explicit settings owner for the three desired presentation states
- opacity and color cues are currently encoded as behavior defaults rather than user-owned presentation settings
- without a first schema pass, later UI and viewer work would risk inventing duplicate keys or burying fallback values in multiple layers

### Locked Direction

#### 1. `9.1` should add schema ownership only, not visible controls

Recommended first rule:
- this pass should stop at one app-owned settings contract plus defaults
- do not add any visible controls UI yet

Important rule:
- `9.1` should not widen into overlay widgets, selector changes, or viewer styling work

#### 2. The settings contract should name exactly three presentation states

Recommended first rule:
- define one explicit contract keyed by:
  - `lastLoaded`
  - `previewMesh`
  - `previewBrep`

Important rule:
- do not use vague buckets such as `primary`, `secondary`, or `overlay`
- the keys should describe the visual state users are actually controlling

#### 3. Each state should own both opacity and color

Recommended first rule:
- each presentation-state entry should include:
  - `opacity`
  - `color`

Recommended first default read:
- `lastLoaded`
  - opacity: `1`
  - color: neutral current geometry tint / no authored shift
- `previewMesh`
  - opacity: `0.5`
  - color: current draft-preview tint
- `previewBrep`
  - opacity: `0.75`
  - color: current authoritative-ready tint

Important rule:
- these defaults are presentation defaults only
- this pass must not interpret them as execution-policy or scheduling hints

#### 4. Settings should be normalized and viewer-ready

Recommended first rule:
- opacity should store normalized numeric values suitable for direct viewer use later
- color should store one stable explicit format rather than multiple ad hoc shapes

Recommended first shape:
- opacity:
  - finite number clamped to `[0, 1]`
- color:
  - one canonical CSS-safe string such as hex

Important rule:
- do not widen this pass into a broad theming/token system
- keep the first shape narrow enough that later viewer application can read it directly

#### 5. The settings owner must stay presentation-only

Recommended first rule:
- store the settings in app-owned presentation state only
- keep them out of build request contracts, graph truth, and worker policy seams

Important rule:
- these settings must not affect:
  - build policy
  - request timing
  - accepted-result ownership
  - latest-intent scheduling

### First Proof

- one app-owned settings object exists for `lastLoaded`, `previewMesh`, and `previewBrep`
- each state stores both opacity and color with normalized defaults
- settings read/write does not require any viewer instance or worker runtime participation
- changing these settings does not mutate Browser policy or build-request behavior

### Settings Contract

Recommended first contract shape:
- `viewportPresentationSettings`
  - `lastLoaded`
    - `opacity`
    - `color`
  - `previewMesh`
    - `opacity`
    - `color`
  - `previewBrep`
    - `opacity`
    - `color`

Recommended first field semantics:
- `lastLoaded`
  - the previously accepted geometry that stays visible while current params differ
- `previewMesh`
  - the draft mesh shown while the user is actively changing a param
- `previewBrep`
  - the authoritative/B-rep preview shown while the user is actively changing a param and authoritative geometry is already ready

Important rule:
- `previewBrep` means held authoritative ready, not accepted
- `lastLoaded` means retained visible geometry, not newly recomputed current truth

### Expected File Targets

Primary implementation files:
- `src/app/store/useAppStore.ts`

Likely supporting files:
- `src/app/store/useAppStore.test.ts`

### Verification Bar

- settings persist/read through one explicit app-owned seam
- defaults stay presentation-only and do not modify build policy or worker dispatch behavior

### Implementation Spec

Recommended reading order:
1. `src/app/store/useAppStore.ts`
2. `src/app/store/useAppStore.test.ts`
3. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation.md`
4. `src/app/components/ViewportOverlay.tsx`
5. `src/app/components/ViewerHost.tsx`

Recommended execution order:
1. identify the strongest existing app-owned settings seam in `useAppStore.ts`
2. add one explicit `viewportPresentationSettings` owner with `lastLoaded`, `previewMesh`, and `previewBrep`
3. normalize default `opacity` and `color` values in that one owner
4. add narrow selectors or read helpers only if needed so later phases do not reach directly into raw state shape
5. add focused app-store tests proving defaults, updates, normalization, and presentation-only ownership

Recommended implementation-grade scenarios:
- `app state initializes one default viewport presentation settings object with lastLoaded, previewMesh, and previewBrep entries`
- `updating previewMesh opacity changes only presentation settings and does not touch Browser build policy`
- `updating previewBrep color changes only presentation settings and does not touch accepted or in-flight graph runtime truth`

## [x] Worker-Vision-3 Phase 9.2 - Presentation Controls UI Surface

### Purpose

Expose the new presentation settings to the user through a small control surface only after the preview-state contract is honest enough that the labels map to real visible behavior.

### Owns

- the actual controls UI for transparency and color of the three states
- labels that match the intended presentation meaning:
  - `Last loaded geometry`
  - `Preview mesh while changing param`
  - `Preview B-rep while changing param`
- binding UI edits into the app-owned settings contract from `9.1`

### Does Not Own

- viewport selector/host/viewer state mapping
- held-authoritative promotion behavior
- scheduling policy

### Implementation Target

After this slice:
- users can see and edit the three presentation-state control groups
- the UI writes into the settings owner from `9.1`
- this slice still does not own preview-state truth or timing behavior itself

### Expected File Targets

Primary implementation files:
- `src/app/components/ViewportOverlay.tsx`

Likely supporting files:
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewportOverlay.test.tsx`

### Verification Bar

- the UI exposes exactly three presentation-state control groups
- labels match the intended state meaning
- changing the controls does not modify build policy or worker dispatch behavior

## [x] Worker-Vision-3 Phase 9.3 - Viewport Presentation State Contract

### Purpose

Make selector/view-model reads explicit enough that preview timing, preview-ready state, and accepted state can be addressed honestly before user customization is treated as the next important follow-on.

### Owns

- naming and exposing the three relevant presentation states in viewport result/read contracts
- mapping Browser `live / release / manual / off` timing into honest preview-state eligibility reads
- mapping authored control settings onto the correct state without mislabeling accepted versus preview-ready truth
- keeping accepted ownership separate from preview-ready state

### Does Not Own

- viewer material/render application
- the actual `75%` promotion behavior
- final runtime narration polish

### Implementation Target

After this slice:
- selector/host-facing seams can distinguish:
  - last loaded geometry during current churn
  - live in-interaction preview
  - preview-ready not-yet-accepted result
  - released accepted result
- each state can receive its own color/opacity settings from the new control surface

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`

Likely supporting files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`

### Verification Bar

- the viewport result contract exposes the three presentation states explicitly
- Browser `live` versus `release` timing changes which preview states are eligible without changing accepted truth ownership
- authored controls apply to the correct state without changing truth ownership
- accepted and preview-ready reads remain distinct

## [x] Worker-Vision-3 Phase 9.4 - Viewer Application Of Presentation Controls

### Purpose

Apply the three-state color/opacity settings in the host/viewer seam without changing held-authoritative promotion logic yet.

### Owns

- host/viewer application of the three presentation-state settings
- explicit mapping from view-model state ids to viewer material/style inputs
- keeping this pass limited to rendering behavior only

### Does Not Own

- held-authoritative readiness detection
- `75%` promotion timing
- runtime narration

### Implementation Target

After this slice:
- last-loaded geometry, preview mesh, and held-authoritative preview can each render with their own user-authored style
- the viewer honors those settings when the corresponding state is present
- behavior still does not change which state is shown when

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/components/ViewerHost.tsx`
  - already reads the widened `9.3` selector contract
  - already converts selector output into `ViewerViewportRenderLayers`
  - is the strongest current owner for mapping presentation-state ids to viewer-facing style inputs
- `src/viewer/Viewer.ts`
  - already owns material creation, per-part mesh construction, and the current base-versus-overlay opacity application
  - is the strongest current owner for actually applying normalized color and opacity values to rendered meshes
- `src/app/store/useAppStore.ts`
  - already owns one explicit `viewportPresentationSettings` contract for `lastLoaded`, `previewMesh`, and `previewBrep`
  - should remain the read-only style source for this slice rather than growing render logic here
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already exposes `visiblePresentationStateId`, `retainedBasePresentationStateId`, `overlayPresentationStateId`, `lastLoadedState`, and `previewState`
  - should remain the owner of presentation-state meaning rather than re-deriving those mappings inside the viewer

Important current limitation:
- `ViewerHost.tsx` still hardcodes one `overlayOpacity: 0.5` fallback and does not yet pass state-specific style values into the viewer
- `ViewerViewportRenderLayers` in `Viewer.ts` still only knows `baseParts`, `overlayParts`, and one shared `overlayOpacity`
- the viewer currently multiplies overlay opacity only and does not have a first-class style input for distinct base-versus-overlay color or for a non-overlay styled accepted layer
- without a narrow `9.4` pass, the new `lastLoaded / previewMesh / previewBrep` settings exist in app state and selector truth but still do not affect visible rendering

### Locked Direction

#### 1. `9.4` should apply style only, not change timing or state selection

Recommended first rule:
- this pass should consume the already-selected presentation-state ids from `9.3`
- do not change which layer is visible or when a preview-ready state appears

Important rule:
- do not widen this slice into `50% -> 75% -> 100%` promotion behavior
- do not re-open accepted-versus-preview truth ownership in `ViewerHost.tsx` or `Viewer.ts`

#### 2. The host should map style settings by explicit state id

Recommended first rule:
- `ViewerHost.tsx` should resolve style settings by:
  - `retainedBasePresentationStateId`
  - `overlayPresentationStateId`
  - and the visible layer's `visiblePresentationStateId` when the render falls back to one single-layer presentation

Important rule:
- do not infer style buckets from `draft`, `final`, or `overlay` alone
- the style mapping should stay keyed by `lastLoaded`, `previewMesh`, and `previewBrep`

#### 3. The viewer render-layer handoff should become style-aware in one narrow explicit way

Recommended first rule:
- replace the current one-number `overlayOpacity` handoff with one explicit render-layer style shape that can carry:
  - base layer opacity
  - base layer color
  - overlay layer opacity
  - overlay layer color

Recommended first shape:
- `ViewerViewportRenderLayers`
  - `baseParts`
  - `baseStyle`
    - `opacity`
    - `color`
  - `overlayParts`
  - `overlayStyle`
    - `opacity`
    - `color`

Important rule:
- keep the first style shape narrow and viewer-ready
- do not widen this pass into theme tokens, multiple overlay lanes, or arbitrary material presets

#### 4. `lastLoaded`, `previewMesh`, and `previewBrep` should style the layer they actually occupy

Recommended first rule:
- if `lastLoaded` is the retained base, apply the `lastLoaded` settings to the base layer
- if `previewMesh` is the live or preview-ready overlay, apply the `previewMesh` settings to the overlay layer
- if `previewBrep` is the live or preview-ready overlay, apply the `previewBrep` settings to the overlay layer
- if one of those states becomes the sole visible layer in the current selector contract, apply that state's settings to the base layer for that render pass

Important rule:
- do not assume `lastLoaded` always means `100%`
- do not assume `previewBrep` always lives in overlay forever
- the rendered layer should use the style for the state id currently occupying that layer

#### 5. Viewer material application should stay presentation-only and deterministic

Recommended first rule:
- the viewer should apply the provided opacity and color directly when building each layer's materials
- base-layer and overlay-layer material treatment should remain deterministic and local to the viewer

Important rule:
- applying style must not mutate app state, Browser policy, selector truth, or accepted-result ownership
- do not let the viewer silently clamp semantics into different meanings than the app-owned settings contract already defines

### First Proof

- one visible render-layer style path exists for `lastLoaded`, `previewMesh`, and `previewBrep`
- `ViewerHost.tsx` reads the app-owned presentation settings and maps them to the correct visible layer by presentation-state id
- `Viewer.ts` applies both opacity and color for base and overlay layers without changing which states are visible
- no timing or acceptance behavior changes are required for the style application proof

### Expected Render Mapping

Recommended first examples:
- retained base only
  - `baseParts = lastLoaded or accepted current`
  - `baseStyle = settings for the state id occupying that base`
- retained `lastLoaded` plus live `previewMesh`
  - `baseStyle = lastLoaded`
  - `overlayStyle = previewMesh`
- retained `lastLoaded` plus ready `previewBrep`
  - `baseStyle = lastLoaded`
  - `overlayStyle = previewBrep`
- visible single-layer `previewMesh`
  - `baseStyle = previewMesh`
- visible single-layer `previewBrep`
  - `baseStyle = previewBrep`

Important rule:
- the host should not invent extra style rules beyond the selector-exposed state ids plus app-owned settings
- `accepted` without a special preview-state id may continue using the ordinary viewer/base material behavior in this slice unless the live selector contract explicitly maps it to one of the three state ids

### Expected File Targets

Primary implementation files:
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

- all three states can receive distinct color/opacity settings in the viewer
- viewer application does not change scheduling or selector truth

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/selectors/selectViewportResultState.ts`
2. `src/app/store/useAppStore.ts`
3. `src/app/components/ViewerHost.tsx`
4. `src/viewer/Viewer.ts`
5. `src/app/components/ViewerHost.test.tsx`
6. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation.md`

Recommended execution order:
1. inspect the current `ViewerViewportRenderLayers` shape and identify the narrowest style extension needed for base plus overlay color/opacity
2. update `ViewerHost.tsx` to read `viewportPresentationSettings` and map selector presentation-state ids onto the corresponding layer styles
3. update `Viewer.ts` so the render-layer handoff applies base-layer and overlay-layer color plus opacity directly when building materials
4. keep fallback behavior stable for layers that have no presentation-state id in the current pass
5. add focused tests proving that `lastLoaded`, `previewMesh`, and `previewBrep` each affect the correct layer without changing visibility timing

Recommended implementation-grade scenarios:
- `retained lastLoaded base plus previewMesh overlay renders with lastLoaded base style and previewMesh overlay style`
- `retained lastLoaded base plus previewBrep overlay renders with lastLoaded base style and previewBrep overlay style`
- `single-layer previewMesh visible state applies previewMesh settings to the base render layer when no overlay is present`
- `single-layer previewBrep visible state applies previewBrep settings to the base render layer when no overlay is present`
- `changing viewport presentation settings alters viewer appearance only and does not change selector-chosen visible state`

## [x] Worker-Vision-3 Phase 9.5 - Preview Timing And 75 Percent Promotion

### Purpose

Land the real preview-timing behavior so Browser `live` and `release` produce the intended `50% -> 75% -> 100%` ladder without inventing a second policy system.

### Owns

- the `50% -> preview-ready -> accepted` timing and promotion behavior across `Auto`, `Draft`, and `Final`
- the proof that preview-ready state stays non-accepted until release plus acceptance
- preserving the release boundary as the only path to accepted presentation

### Does Not Own

- new user-facing controls
- broad viewer redesign
- final narration/hardening polish

### Implementation Target

After this slice:
- Browser `live` shows live preview during interaction only where that mode/lane is eligible
- Browser `release` suppresses drag preview and first shows preview-ready results only after release
- released acceptance promotes into accepted presentation only after release

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already owns preview-state meaning and Browser timing reads
  - already distinguishes `live-preview`, `preview-ready`, `acceptedState`, `lastLoadedState`, and the presentation-state ids that 9.4 now renders
  - is the strongest current owner for promotion timing because the remaining gap is no longer styling, it is when the selector should surface or suppress each state
- `src/app/components/ViewerHost.tsx`
  - already consumes the selector contract and maps each visible state id onto style-aware base-versus-overlay viewer layers
  - should remain a consumer of selector timing truth rather than becoming the owner of promotion rules
- `src/viewer/Viewer.ts`
  - already applies per-layer color and opacity once the host tells it which state is on which layer
  - should remain presentation-only in this slice
- `src/app/store/useAppStore.ts`
  - already owns Browser timing facts such as effective `live / release / manual / off`, interaction state, and delayed draft/authoritative placeholders
  - should continue providing narrow timing facts to the selector rather than hosting viewport-promotion policy itself
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - already owns the accepted-current versus committed-retained geometry lanes that 9.3 and 9.4 consume
  - may need only a narrow widen if implementation proves the current accepted lanes are not enough to express a truly newer preview-ready authoritative result without accepted promotion

Important current limitation:
- `resolvePreviewState(...)` currently chooses preview states from a blend of accepted-current geometry, committed-retained geometry, and delayed-placeholder facts, but it still does not fully own the semantic handoff from `50%` live preview to `75%` preview-ready to `100%` accepted
- the current contract can express `preview-ready`, but the visible result and accepted-state relationship still need one stricter timing rule so `100%` never appears before release-plus-acceptance
- if the runtime does not expose a truly newer pre-acceptance authoritative result distinct from the current accepted lane, 9.5 may discover one more narrow store fact is needed

### Locked Direction

#### 1. `9.5` should change timing and promotion only, not style ownership

Recommended first rule:
- keep `ViewerHost.tsx` and `Viewer.ts` on their current `9.4` role of consuming the selector's state ids and styles
- land the remaining behavior by changing selector timing and promotion reads first

Important rule:
- do not widen this slice into a control-surface pass or narration pass
- do not re-open the app-owned presentation settings contract

#### 2. `100%` must mean accepted-visible truth only

Recommended first rule:
- if the selector surfaces `visiblePresentationStateId` as `previewMesh` or `previewBrep`, that state must remain non-accepted even if it visually occupies the primary layer
- accepted presentation should be visible only when the selector chooses ordinary accepted truth with no preview-state id occupying the visible layer

Important rule:
- do not let a ready authoritative result become visually `100%` just because it is the only visible layer
- do not let `acceptedState.isVisible` become true while a preview-state id still owns the visible layer

#### 3. Browser `live` should allow `50% -> 75%` during interaction when the better preview actually exists

Recommended first rule:
- `Auto + live`
  - while interaction is active and only draft preview is available, show `previewMesh`
  - while interaction is still active, upgrade to `previewBrep` only if a distinct authoritative preview is truly available
- `Draft + live`
  - stay draft-pure and keep `previewMesh` as the only ordinary live preview path
- `Final + live`
  - never borrow ordinary draft preview
  - show `previewBrep` only when authoritative preview is actually available

Important rule:
- do not synthesize `previewBrep` from stale committed final merely because the selector has a retained base
- if the implementation cannot prove a distinct newer authoritative preview exists, keep the state at `previewMesh` or `none` rather than silently over-promoting

#### 4. Browser `release` should suppress drag preview and surface preview-ready only after release

Recommended first rule:
- while `isInteractionActive === true` and Browser policy is `release`, surface no ordinary `previewMesh` or `previewBrep`
- after release, if a delayed or newly accepted preview result exists, surface the first eligible preview state at `75%`

Important rule:
- do not show `0.5` live preview in `release`
- do not promote directly from retained base to accepted visibility without the intermediate preview-ready read when that result is ready-but-not-yet-accepted

#### 5. Placeholder and runtime reads should distinguish “waiting to preview” from “nothing available”

Recommended first rule:
- keep using delayed draft and delayed authoritative placeholders to express that Browser policy or interaction timing is holding work back
- if implementation confirms that accepted-current lanes are insufficient for 9.5, widen only the minimal runtime/store seam needed to expose a newer preview-ready authoritative result without marking it accepted

Important rule:
- do not guess preview readiness from styling or from presence of a retained base alone
- prefer one narrow explicit store fact over implicit reach-in behavior

#### 6. Mode semantics should stay strict while promotion timing gets honest

Recommended first rule:
- `Auto`
  - may move across `lastLoaded -> previewMesh -> previewBrep -> accepted`
- `Draft`
  - may move across `lastLoaded -> previewMesh -> accepted draft`
- `Final`
  - may move across `lastLoaded -> previewBrep -> accepted final`

Important rule:
- `Final` must not fall back to ordinary draft preview just to stay responsive
- `Draft` must not be narrated or styled as accepted final

### First Proof

- one selector timing path exists for `50% -> 75% -> 100%` that does not depend on viewer-local logic
- `previewMesh` and `previewBrep` remain non-accepted until the normal release-plus-acceptance boundary
- `acceptedState.isVisible` stays false whenever a preview-state id still owns the visible layer
- Browser `live` and `release` differ only in timing and promotion, not in who owns style or accepted truth

### Expected Promotion Mapping

Recommended first examples:
- `Auto + live + active + draft preview only`
  - retained base may remain `lastLoaded`
  - visible preview = `previewMesh`
  - accepted visible truth = still false
- `Auto + live + active + distinct authoritative preview ready`
  - retained base may remain `lastLoaded`
  - visible preview upgrades from `previewMesh` to `previewBrep`
  - accepted visible truth = still false
- `Auto + release + active`
  - no visible `previewMesh`
  - no visible `previewBrep`
  - retained base may stay visible if relevant
- `Auto + release + released + preview ready but not accepted`
  - visible preview = `previewMesh` or `previewBrep` at `75%`, depending on the best eligible ready result
  - accepted visible truth = still false
- `Any mode + released + accepted current result`
  - preview-state id clears from the visible layer
  - accepted visible truth becomes the sole `100%` presentation

Important rule:
- the promotion ladder should be driven by selector truth, not by the viewer observing opacity or color
- a retained base is a support state, not proof that a newer preview-ready result exists

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`

Likely supporting files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

- `Auto live` shows draft preview at `50%`, then `75%` when a better preview result becomes ready
- `Auto release` shows no drag preview and first shows released preview-ready results at `75%`
- `Draft live` remains draft-pure while `Final live` never falls back to ordinary draft preview
- the same geometry does not promote to accepted styling until release plus acceptance

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/selectors/selectViewportResultState.ts`
2. `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
3. `src/app/store/useAppStore.ts`
4. `src/app/spaghetti/store/useSpaghettiStore.ts`
5. `src/app/components/ViewerHost.tsx`
6. `src/app/components/ViewerHost.test.tsx`
7. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation.md`

Recommended execution order:
1. inspect `resolvePreviewState(...)`, `resolveAcceptedState(...)`, and visible-layer mapping in `selectViewportResultState.ts`
2. tighten selector timing rules so `previewMesh`, `previewBrep`, and accepted visibility replace one another only at the intended Browser timing boundaries
3. verify whether the current accepted-current and committed-retained runtime lanes are enough to express a distinct newer authoritative preview-ready result
4. only if needed, add one narrow store read to expose that preview-ready authoritative fact without promoting it to accepted truth
5. update focused selector tests first, then add host-level proof only if the visible-layer handoff changes materially

Recommended implementation-grade scenarios:
- `Auto live keeps previewMesh visible at 50 percent during interaction until a distinct authoritative preview-ready result exists`
- `Auto live upgrades to previewBrep at 75 percent during interaction without making acceptedState visible`
- `Auto release shows no previewMesh during interaction and first surfaces preview-ready state only after release`
- `Final live never borrows ordinary draft preview but may show previewBrep when a real authoritative preview-ready result exists`
- `When accepted current truth catches up after release, preview-state ownership clears and accepted visible truth becomes the only 100 percent presentation`

## [x] Worker-Vision-3 Phase 9.5b - Distinct Authoritative Preview Lane And Auto Layered Promotion

### Purpose

Close the remaining held-authoritative gap left after `9.5` by adding one real non-accepted authoritative preview-ready read and by rendering that newer ready result as a `75%` overlay above retained accepted truth in `Auto` while the user is still holding the interaction.

### Owns

- one narrow runtime/store read that can distinguish:
  - accepted authoritative truth
  - committed retained authoritative truth
  - newer authoritative preview-ready truth that is not yet accepted
- the `Auto` viewport layering proof for:
  - retained `lastLoaded` accepted base at `100%`
  - `previewBrep` overlay at `75%`
  - while the interaction is still active under Browser `live`
- the host/viewer handoff needed so `previewBrep` can occupy the overlay lane in `Auto` without pretending the accepted base already changed

### Does Not Own

- new Browser build-policy controls
- final narration wording
- broad worker-scheduling redesign beyond the narrow preview-ready read seam

### Implementation Target

After this slice:
- the app can prove when a newer authoritative preview-ready result exists before acceptance
- `Auto + live` can keep accepted `lastLoaded` truth visible at `100%` while showing the newer authoritative preview-ready result at `75%`
- the same held interaction no longer collapses into either:
  - stale accepted final masquerading as `previewBrep`
  - or single-layer `previewBrep` replacing the retained accepted base too early

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - currently exposes:
    - `selectViewerTargetGraphAcceptedGeometryResult(...)`
    - `selectViewerTargetGraphCommittedAuthoritativeGeometryResult(...)`
  - but those selectors still read from the same `acceptedAuthoritativeGeometryResult` lane, with the accepted version only adding the current-revision gate
  - this means the live app still cannot prove a truly newer authoritative preview-ready result that is distinct from accepted truth
  - is the strongest current owner for one narrow widen because the missing fact is runtime/result identity, not viewer styling
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - now correctly refuses to synthesize `previewBrep` from unchanged committed authoritative geometry
  - already keeps `previewBrep` non-accepted when a distinct newer authoritative preview can be proven
  - should consume the new runtime fact rather than inventing implicit reach-in logic
  - already contains the strongest current proof surface because `resolvePreviewState(...)` and `acceptedState.isVisible` capture the exact held-authoritative semantics we need to harden
- `src/app/components/ViewerHost.tsx`
  - already renders retained `lastLoaded` base plus `previewMesh` overlay in `Auto`
  - already renders retained final plus final overlay in strict `Final`
  - but does not yet render retained final base plus `previewBrep` overlay in `Auto`
  - is therefore the narrowest place to add the missing `Auto` final-overlay branch without reopening selector timing ownership
- `src/viewer/Viewer.ts`
  - already applies state-owned base and overlay styles deterministically once the host provides the correct layer mapping
  - should remain presentation-only in this slice

Important current limitation:
- `9.5` hardened the selector timing rules, but the real app still lacks a distinct authoritative preview-ready runtime lane
- because of that missing lane, the held-drag `20 accepted at 100% + 50 authoritative preview at 75%` behavior cannot yet be proven honestly in the live app
- even if the selector could see that newer ready result, `ViewerHost.tsx` still lacks the `Auto` branch that would render retained `lastLoaded` base plus `previewBrep` overlay together

### Locked Direction

#### 1. `9.5b` should add one narrow preview-ready authoritative read, not a second acceptance owner

Recommended first rule:
- widen the runtime/store seam just enough to expose a newer authoritative preview-ready result that is distinct from accepted truth
- keep accepted ownership where it already lives

Important rule:
- do not let the new read mutate accepted revision facts
- do not let a ready authoritative result silently become committed just because the selector can now see it

#### 2. The new authoritative preview-ready read must be explicit, not inferred from retained base or styling

Recommended first rule:
- add one explicit read or lane whose semantics are:
  - renderable authoritative preview for the current revision exists
  - it is newer than the committed accepted authoritative lane
  - it is not yet accepted-visible truth

Recommended first read shape:
- one viewer-target selector with semantics like:
  - `accepted authoritative for current revision`
  - `committed accepted authoritative regardless of current revision`
  - `authoritative preview-ready for current revision when distinct from committed accepted authoritative`

Important rule:
- do not guess this from:
  - `retainedBaseState`
  - presence of `meshPreview` alone
  - color/opacity styling
- do not widen this into a generic history/archive system when one explicit preview-ready authoritative read will do

#### 3. `Auto + live` should layer retained accepted base plus ready authoritative overlay during the same held interaction

Recommended first rule:
- when Browser policy is `live`
- and interaction is still active
- and the selector can prove a distinct newer authoritative preview-ready result
- `Auto` should render:
  - retained accepted `lastLoaded` as the base layer
  - `previewBrep` as the overlay layer

Important rule:
- the retained accepted base should remain the visible `100%` truth during that held interaction
- `previewBrep` should stay the `75%` non-accepted overlay until release plus acceptance

#### 4. `Final` and `Auto` should both be able to consume the real authoritative preview-ready read without collapsing semantics together

Recommended first rule:
- `Final + live`
  - may still use the ready authoritative preview as the visible preview-owned state when no retained-base layering is needed
- `Auto + live`
  - should prefer retained accepted base plus ready authoritative overlay when both are relevant

Important rule:
- do not force `Auto` to reuse the strict `Final` single-layer behavior
- do not weaken `Final` by reintroducing ordinary draft fallback

#### 5. The host should add only the missing `Auto` final-overlay branch

Recommended first rule:
- extend `ViewerHost.tsx` with one explicit layered branch for:
  - retained base result class `final`
  - overlay result class `final`
  - requested mode `auto`
- map:
  - `baseStyle = lastLoaded`
  - `overlayStyle = previewBrep`
  - `baseParts = retainedBaseRenderVm`
  - `overlayParts = overlayRenderVm`

Important rule:
- do not widen the host into a second owner of preview timing
- it should still consume selector truth rather than deciding when `previewBrep` exists
- keep the ordinary single-layer fallback path unchanged for states that do not satisfy the layered `Auto` case

### First Proof

- one runtime/store fact exists for a distinct non-accepted authoritative preview-ready result
- `Auto + live + held interaction + retained accepted final + newer authoritative preview-ready result` renders:
  - retained accepted base as `lastLoaded`
  - newer authoritative preview as `previewBrep`
- `acceptedState.isVisible` stays false while `previewBrep` still owns the overlay lane
- the same geometry only becomes `100%` accepted after release plus acceptance

### Expected File Targets

Primary implementation files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
- `src/app/components/ViewerHost.tsx`

Likely supporting files:
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/components/ViewportOverlay.tsx`

### Verification Bar

- `Auto live` can keep accepted `lastLoaded` geometry visible at `100%` while a newer authoritative preview-ready result shows at `75%` during the same held interaction
- `previewBrep` does not appear unless the runtime can prove a distinct newer authoritative preview-ready result
- `Final live` still never borrows ordinary draft preview
- accepted truth still promotes only after release plus acceptance
- the retained accepted base does not update mid-drag just because the authoritative preview-ready overlay changed

### Implementation Spec

Recommended reading order:
1. `src/app/spaghetti/store/useSpaghettiStore.ts`
2. `src/app/spaghetti/selectors/selectViewportResultState.ts`
3. `src/app/components/ViewerHost.tsx`
4. `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
5. `src/app/components/ViewerHost.test.tsx`
6. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 9 - Held Authoritative Preview Presentation.md`

Recommended execution order:
1. inspect the live viewer-target authoritative selectors in `useSpaghettiStore.ts` and replace the shared accepted-versus-committed read with one explicit distinct preview-ready authoritative selector
2. thread that new selector into the viewer-target state read so `selectViewportResultState.ts` can consume an actual newer authoritative preview-ready result instead of inferring one from the currently shared lane
3. update `selectViewportResultState.ts` so `previewBrep` plus retained accepted `lastLoaded` can coexist honestly in `Auto + live + active` when the new runtime read is present
4. add the missing `ViewerHost.tsx` `Auto` layered branch for retained final base plus final overlay, mapping `lastLoaded` style to base and `previewBrep` style to overlay
5. add focused selector proof first, then host/viewer layering proof for the exact held-interaction case and one negative case where stale accepted final must not produce `previewBrep`

Recommended implementation-grade scenarios:
- `Auto live keeps retained accepted depth 20 visible at 100 percent while a newer authoritative preview-ready depth 50 appears at 75 percent during the same held drag`
- `Auto live does not surface previewBrep when the only authoritative geometry available is the already-accepted committed result`
- `Auto live keeps retained accepted depth 20 as lastLoaded even while multiple held-drag authoritative preview-ready updates replace one another on the 75 percent overlay`
- `When release plus acceptance occurs, the retained base clears and the newer authoritative result becomes the sole accepted 100 percent presentation`
- `Final live can still show authoritative preview-ready state without borrowing ordinary draft preview`

## [ ] Worker-Vision-3 Phase 9.6 - Runtime Narration And Hardening Proof

### Purpose

Close the family by making runtime narration, inspector wording, and proof surfaces honest about `preview mesh`, `authoritative preview ready`, and `accepted`.

### Owns

- runtime/inspector wording for the three presentation states
- final proof that user controls remain presentation-only
- final hardening that `ready` and `accepted` are never conflated in UI narration

### Does Not Own

- new render behavior
- new scheduling policy
- export behavior

### Implementation Target

After this slice:
- user-facing wording distinguishes the three states clearly
- proof exists that control settings do not alter build policy
- the Phase 9 family can close on one honest controllable presentation ladder

### Current Strongest Read

The live code now provides these strongest seams:
- `src/app/spaghetti/selectors/selectViewportResultState.ts`
  - already exposes the key truth `9.6` should narrate rather than reinvent:
    - `previewState.kind` with explicit `live-preview` versus `preview-ready`
    - `acceptedState` with explicit accepted ownership
    - visible, retained-base, and overlay presentation-state ids
  - is therefore the strongest current owner for narration inputs, not for new wording output
- `src/app/components/TitleStatusBar.tsx`
  - already contains the user-facing labels and descriptions for:
    - `Last loaded geometry`
    - `Preview mesh while changing param`
    - `Preview B-rep while changing param`
  - already tells users the settings are `Visual only`
  - is the strongest current surface for runtime-inspector wording hardening
- `src/app/components/ViewportOverlay.tsx`
  - already renders the compact `Geometry: ...` HUD line
  - currently depends on `selectViewportResultStatus.ts` for short status wording
  - is therefore the strongest current compact-status surface for the `ready` versus `accepted` distinction
- `src/app/spaghetti/selectors/selectViewportResultStatus.ts`
  - currently still collapses status down to coarse labels such as:
    - `Draft`
    - `Final`
    - `Building Final...`
    - `Final Unavailable`
  - does not yet expose the Phase 9 distinction between live preview, preview ready, and accepted
- `src/app/store/runtimeInspectorVm.ts`
  - already owns the runtime-inspector shell labels and bottom hint text
  - currently keeps the hint focused on accepted build lifecycle and viewer samples, not Phase 9 preview-state narration
  - is the strongest current owner for any compact explanatory hint that should stay aligned with the selector truth

Important current limitation:
- the shipped presentation behavior is now more honest than the shortest user-facing wording
- the runtime inspector labels are close, but the compact HUD status still risks conflating `preview-ready authoritative` with ordinary `Final`
- the final closeout still needs explicit proof that tuning `lastLoaded / previewMesh / previewBrep` presentation never changes Browser build timing or accepted-truth ownership

### Locked Direction

#### 1. `9.6` should consume existing selector truth, not invent a second narration model

Recommended first rule:
- derive wording from the already-shipped `selectViewportResultState.ts` facts for:
  - `live-preview`
  - `preview-ready`
  - `accepted`

Important rule:
- do not add a second hidden state machine in UI code just to choose labels
- keep selector/store ownership of timing truth where it already lives

#### 2. Runtime-inspector wording should name readiness versus acceptance directly

Recommended first rule:
- strengthen the inspector copy so the three controllable presentation rows and any nearby helper text use the same plain language:
  - `Last loaded`
  - `Preview mesh`
  - `Authoritative preview ready`
  - `Accepted`

Important rule:
- do not keep any inspector wording that implies the held authoritative preview is already accepted
- do not let `preview B-rep` read like a generic synonym for final committed truth

#### 3. The compact `Geometry:` HUD should stop collapsing preview-ready authoritative state into plain `Final`

Recommended first rule:
- update the short status path so the HUD can distinguish at least:
  - live draft preview
  - preview-ready authoritative result
  - accepted result
  - unavailable / waiting states

Important rule:
- the compact status can stay short, but it must remain honest
- do not reuse `Final` for a non-accepted preview-ready authoritative state

#### 4. Keep the proof centered on presentation-only ownership

Recommended first rule:
- add focused proof that changing presentation controls:
  - updates only `viewportPresentationSettings`
  - does not mutate Browser build policy
  - does not mutate accepted runtime/result ownership

Important rule:
- do not widen this into a new behavior pass
- if implementation reveals a behavior mismatch, record it separately rather than silently folding it into `9.6`

#### 5. Prefer one small wording pass across the real active surfaces

Recommended first rule:
- focus this slice on:
  - `TitleStatusBar.tsx`
  - `ViewportOverlay.tsx`
  - `selectViewportResultStatus.ts`
  - `runtimeInspectorVm.ts`

Important rule:
- do not reopen `ViewerHost.tsx`, `Viewer.ts`, or Browser scheduling unless the wording pass proves they are still exposing stale semantics directly

### First Proof

- the runtime inspector and compact HUD both distinguish `preview ready` from `accepted`
- `Final` wording appears only when the visible state is actually accepted-visible truth
- changing `lastLoaded`, `previewMesh`, or `previewBrep` presentation settings leaves Browser policy and accepted runtime truth unchanged
- `Auto live` held-authoritative behavior still narrates retained accepted base plus non-accepted authoritative preview honestly after the wording pass

### Expected File Targets

Primary implementation files:
- `src/app/components/TitleStatusBar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/spaghetti/selectors/selectViewportResultStatus.ts`
- `src/app/store/runtimeInspectorVm.ts`

Likely supporting files:
- `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/store/useAppStore.test.ts`
- `src/app/spaghetti/selectors/selectViewportResultState.test.ts`
- `src/app/components/ViewerHost.test.tsx`

### Verification Bar

- runtime wording distinguishes `last loaded`, `preview mesh`, `authoritative preview ready`, and `accepted`
- the compact `Geometry:` HUD no longer labels preview-ready authoritative state as plain `Final`
- user controls are proven presentation-only
- no wording path calls held-authoritative-ready geometry `accepted`

### Implementation Spec

Recommended reading order:
1. `docs/Human-Plans/Architecture/Worker/Future/Worker_Phase Worker-Vision-3 Phase 8 - Viewport Result Layering And Relevance Presentation.md`
2. `src/app/spaghetti/selectors/selectViewportResultState.ts`
3. `src/app/spaghetti/selectors/selectViewportResultStatus.ts`
4. `src/app/components/TitleStatusBar.tsx`
5. `src/app/store/runtimeInspectorVm.ts`
6. `src/app/components/ViewportOverlay.tsx`
7. `src/app/workspace/PrimaryViewportLeftDock.test.tsx`
8. `src/app/components/ViewportOverlay.test.tsx`
9. `src/app/store/useAppStore.test.ts`

Recommended execution order:
1. inspect the current inspector copy in `TitleStatusBar.tsx` and the short HUD status path in `selectViewportResultStatus.ts` to identify every remaining place that still collapses `preview-ready` into `Final` or otherwise hides the ready-versus-accepted distinction
2. tighten the short status contract so `ViewportOverlay.tsx` can narrate live preview, preview-ready, accepted, and unavailable states honestly without becoming a second owner of timing truth
3. harden any runtime-inspector helper text in `TitleStatusBar.tsx` and `runtimeInspectorVm.ts` so the compact copy matches the shipped `lastLoaded / previewMesh / previewBrep` ladder and explicitly stays presentation-only where appropriate
4. add focused tests in `PrimaryViewportLeftDock.test.tsx` and `ViewportOverlay.test.tsx` for the positive wording cases and one negative case where preview-ready authoritative state must not read as accepted
5. re-run the existing store/selector proof that changing presentation controls only touches `viewportPresentationSettings` and leaves Browser policy plus accepted runtime truth alone

### Implementation-Grade Scenarios

- `Users can tune transparency and color independently for last loaded geometry, preview mesh, and preview B-rep without altering build policy`
- `Auto live with retained accepted base plus preview-ready authoritative overlay never labels the visible state as accepted before release-plus-acceptance`
- `The compact Geometry HUD can say preview ready without collapsing that state to Final`
- `The runtime inspector presentation descriptions stay aligned with the same ready-versus-accepted vocabulary used by the HUD`
- `Auto live shows draft mesh at 50 percent during drag, then upgrades to 75 percent when a preview-ready result becomes available without becoming accepted`
- `Auto release shows no drag preview, then shows the first preview-ready result at 75 percent only after release`
- `Draft live remains draft-pure while Final live does not borrow ordinary draft preview just to stay responsive`
- `When the user releases, the same preview-ready result promotes into accepted presentation only if it is accepted for the current revision`
- `Browser policy remains one control surface and does not split into separate mesh and authoritative execution toggles`
