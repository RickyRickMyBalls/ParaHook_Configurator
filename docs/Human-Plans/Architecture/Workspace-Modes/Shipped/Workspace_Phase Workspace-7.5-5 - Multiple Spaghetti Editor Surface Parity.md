# Workspace Phase Workspace-7.5-5 - Multiple Spaghetti Editor Surface Parity

## Doc Header

### Doc History
1. 2026-04-30 19:54:12: Closed `Workspace 7.5-5` as shipped after the final user confidence read confirmed multiple `Spaghetti Editor` surfaces can stay open together, reconciled the remaining stale phase markers against the existing `docs/CHANGELOG.md` implementation trail through `Phase 9C`, treated `Phase 6` as a reserve runtime/store lane that was not needed after the Browser/viewer identity trace, and prepared this record to move from `Future/` to `Shipped/`
1. 2026-04-01 15:41: Tightened `Phase 10 - Final Confidence And Close-Out` into an implementation-ready final pass after the user confirmed the latest Browser duplication fix feels good, replacing the leftover earlier-phase residue in that section with a smaller close-out matrix centered on manual confidence, one narrow residue gate, honest deferred-work logging, and explicit criteria for when `Workspace 7.5-5` can be checked off without widening into a new cleanup phase
1. 2026-04-01 15:33: Recorded the `Phase 9C` follow-up duplication fix after the live two-graph repro showed that Browser could still replay copied adopted content when top-level authored assemblies were being mirrored into the runtime root during project-content rebuild and saved child-order ids still carried duplicates, then noted that top-level assemblies now stay out of the runtime root and ordered Browser child ids now self-heal repeated entries instead of rendering copied assembly/component/object rows after sync
1. 2026-04-01 15:20: Recorded the shipped `Phase 9C - Output Preview Ownership Alignment` slice after tightening `useAppStore` so Browser-facing component membership now follows actual object parentage first and empty runtime-backed published-component shells disappear once all of their published objects have been reorganized elsewhere, closing the narrow “Preview reads adopted Browser truth first” cut while explicitly leaving any future `Output Preview` authoring ambitions outside `Workspace 7.5-5`
1. 2026-04-01 15:10: Reworked `Phase 9C` from a vague reserve cleanup bucket into an implementation-ready `Output Preview` ownership-alignment slice after the live user observation that preview is still implying stale graph-local component ownership even after Browser reorganization, locking the next cut as a narrow “Preview reads adopted Browser truth first” seam while explicitly pushing the bigger future “Output Preview also authors assemblies/components/objects” work out of `Workspace 7.5-5`
1. 2026-04-01 15:03: Recorded the shipped `Phase 9B - ConsoleDock And Spaghetti Editor Context Sync Hardening` slice after tightening `ConsoleDock` graph, viewport, object, and reference context resolution around selected-target and staged-session truth, noting that graph-root and graph-canvas actions now prefer deliberate workspace context over ambient active-editor fallbacks while preserving the existing command surface and leaving `Phase 9C` as optional reserve cleanup only if it still earns itself
1. 2026-04-01 14:32: Tightened `Phase 9B - ConsoleDock And Spaghetti Editor Context Sync Hardening` into an implementation-ready follow-on after a focused code read through `ConsoleDock` and the live `useSpaghettiStore` viewport selectors, locking that the remaining drift is a narrow context-resolution problem around local fallback chains such as `resolveSelectedObjectPartKeyForZoom(...)`, `resolveSelectionSetForZoom(...)`, `resolveEditorViewportIdForGraphDocument(...)`, and `ensureSpaghettiEditorVisibleForGraphRoot(...)`, and recording that the next cut should consolidate those paths onto one helper seam using the shipped `Phase 9A` rendered-project-parts truth plus per-viewport graph-selection selectors instead of ambient active-graph fallbacks
1. 2026-04-01 14:29: Recorded the shipped `Phase 9A - Canonical Rendered Project Parts Truth` slice after adding `selectRenderedProjectPartSet(...)` in `useAppStore` and moving both Browser-facing current-project content rows plus shared `ViewerHost` composition onto that same selector-backed rendered truth, then tightened the remaining `Phase 9` read so shared model-viewer rendering now follows project-content adoption instead of parallel runtime-only derivation while `Phase 9B` stays the next narrow gated follow-on
1. 2026-04-01 14:19: Tightened `Phase 9 - Supporting Refactor And Ownership Hardening` into a more implementation-ready and more responsibly chunked follow-on after Phase 8 closed green, splitting the remaining cleanup into an explicit first cut around one canonical rendered project-parts selector, a second narrow `ConsoleDock` plus `Spaghetti Editor` context-sync pass, and only then a reserve host-helper cleanup slice if the earlier two cuts still leave justified residue
1. 2026-04-01 14:10: Recorded the shipped `Phase 8 - Build Failure Triage And Blocking Fixes` pass after `npm run build` triage proved the root blocker was a self-referential `useWorkspaceStore` typing collapse that was degrading workspace-shell selectors into `any` or `unknown`, then noted that the remaining error wall reduced to dead-local cleanup and stale `ConsoleDock` viewer-key expectations so the build and focused workspace-shell test slice are now green before the later Phase 9 ownership hardening
1. 2026-04-01 14:04: Tightened the later close-out ladder after the recent Phase 7 regressions, turning `Phase 8 - Build Failure Triage And Blocking Fixes` into a more implementation-ready build-cleanup slice with a concrete classify-first execution order and adding an explicit `Phase 9 - Supporting Refactor And Ownership Hardening` carry note that Browser, project-content, and shared viewer composition still need one canonical rendered project-parts truth instead of several overlapping preview, runtime, and content projections
1. 2026-04-01 14:01: Recorded the next `Phase 7 - Browser And Viewer Object Identity Cleanup` implementation slice after fixing the new-graph first-publish regression, noting that shared multi-graph `ViewerHost` composition now uses published runtime output instead of preview-only output so Browser content and the main model viewer stay aligned when a newly added graph publishes its first object
1. 2026-04-01 13:46: Recorded the next `Phase 7 - Browser And Viewer Object Identity Cleanup` implementation slice after fixing the Browser policy sync regression that was teleporting moved graph-backed content back to root ownership, noting that runtime-backed Browser objects and components now preserve authored assembly or component placement across `syncCurrentProjectFromSpaghetti()` rebuilds by storing placement separately from graph provenance while keeping current suppression and policy-inheritance behavior intact
1. 2026-04-01 13:30: Recorded the first real `Phase 7 - Browser And Viewer Object Identity Cleanup` implementation slice after changing graph-row `Reveal` into a presentation-layer frame action over the Browser-owned rendered set instead of a pseudo viewer-target owner switch, updating the phase read so Browser build policy remains the load truth while reveal now frames the currently rendered parts for that graph
1. 2026-04-01 13:23: Re-sequenced the post-`Phase 5` execution ladder after the live Browser-owned multi-graph viewer fix, recording that the runtime/store refactor lane is no longer the next cut by default, tightening `Phase 7 - Browser And Viewer Object Identity Cleanup` into the immediate implementation-ready follow-on, and adding an explicit later `ConsoleDock` plus `Spaghetti Editor` sync carry note under `Phase 9 - Supporting Refactor And Ownership Hardening`
1. 2026-04-01 13:10: Closed `Phase 5 - Preview And Output Ownership Trace` after a code-backed trace and focused implementation pass proved the remaining multi-graph collapse was not the top-level runtime surface but the Browser and viewer identity seam still leaking bare slot-based part keys, then recorded the landed graph-qualified viewer-key fix across `useAppStore`, `selectBrowserGraphRows`, `ViewerHost`, and their focused regressions
1. 2026-04-01 12:58: Expanded the open tail of `Workspace 7.5-5` into a fuller responsible-sized ladder after clarifying that this work is carrying three parallel concerns, keeping the real multi-graph output fix in `Phases 5` through `7` while adding an explicit `Phase 8 - Build Failure Triage And Blocking Fixes`, `Phase 9 - Supporting Refactor And Ownership Hardening`, and `Phase 10 - Final Confidence And Close-Out` so parity work, `npm run build` cleanup, and broader seam reduction no longer compete inside one overloaded final bucket
1. 2026-04-01 12:44: Tightened `Phase 5 - Preview And Output Ownership Trace` into an implementation-ready slice after a live read across `useSpaghettiStore`, `outputSurface`, `outputPreviewNode`, `useBrowserPanelController`, `selectBrowserGraphRows`, and `ConsoleDock`, locking the strongest current clue that graph-level output surfaces are already per-document while published object identity still likely collapses later because Output Preview object ids default to slot-based ids such as `output-object:s001` and the Browser or viewer visibility layer may still be treating those ids as globally shared
1. 2026-04-01 12:39: Split the still-open post-`Phase 4` tail of `Workspace 7.5-5` into smaller responsible chunks based on the real remaining seams instead of keeping one oversized `Phase 5` bucket, separating preview/output ownership tracing, supporting runtime/store refactor, Browser or viewer object-identity cleanup if needed, and final close-out so the next execution ladder now follows the actual shape of the unresolved multi-graph output problem
1. 2026-04-01 12:33: Reworked the open tail of `Workspace 7.5-5` after confirming that separate graph documents still cannot keep two distinct output-preview objects alive at the same time, keeping `Phase 4` focused on the current runtime cleanup while expanding `Phase 5` into an explicit supporting refactor lane and adding a new `Phase 6 - Final Confidence And Close-Out` reserve section so any AppShell or host cleanup now stays inside the `7.5-5` execution ladder instead of spinning out into a separate AppShell phase
1. 2026-04-01 12:25: Recorded the first real `Phase 4 - Per-Viewport Runtime Isolation` implementation slice after moving live `Spaghetti Editor` node, edge, and preview selection ownership onto concrete editor viewports in `useSpaghettiStore`, `SpaghettiPanel`, and `SpaghettiCanvas`, marking the targeted runtime-selection audit and regression items complete while leaving the distinct output-preview object carry item open until that graph-bound preview isolation is verified separately
1. 2026-04-01 12:14: Tightened `Phase 4 - Per-Viewport Runtime Isolation` into an implementation-ready slice after a focused read across `SpaghettiPanel`, `SpaghettiEditor`, `SpaghettiCanvas`, and `useSpaghettiStore`, locking the strongest remaining global-runtime seams around shared node selection, console preview ownership, and active-graph update helpers so the next cut now has a concrete boundary instead of a generic later-cleanup description
1. 2026-04-01 12:13: Marked `Phase 3 - Floating Shell Stability` as complete after manual confirmation that two different floating `Spaghetti Editor` windows can now stay open on different graph documents at the same time, closing the final checklist item and leaving `Phase 4 - Per-Viewport Runtime Isolation` as the next remaining carry lane
1. 2026-04-01 12:04: Recorded the next real `Phase 3 - Floating Shell Stability` implementation slice after removing the last active-viewport fallback from the floating host geometry helpers, switching floating-shell cleanup to "any floating editor exists" truth, and adding a focused `SpaghettiWindowHost` regression that proves two floating editors on different graph documents keep their own frame geometry when active focus flips, while the broader end-to-end corrected repro still remains open pending manual acceptance
1. 2026-04-01 12:00: Added a new Phase 4 carry note that separate graph documents should be able to produce distinct output-preview objects at the same time, capturing the user observation that `Graph 1` and `Graph 2` still appear to fight over one preview/output result as another sign that graph-bound runtime ownership is not yet fully isolated per editor surface
1. 2026-04-01 11:57: Updated the `Phase 3 - Floating Shell Stability` checklist after the first landed cross-graph cleanup slice, marking the canonical repro lock, the initial `SpaghettiWindowHost` audit, and the minimum `SpaghettiPanel` shared-state audit as complete while leaving the broader end-to-end floating-shell fix and exact corrected-repro regression work visibly open
1. 2026-04-01 11:51: Moved the new `Phase 3` through `Phase 5` checklist and verification sections into the end of their matching phase blocks so the open `Workspace 7.5-5` slices now read like the earlier shipped sections instead of leaving those execution details grouped later in the file
1. 2026-04-01 11:49: Added explicit checklist and verification sections for the still-open `Phase 3` through `Phase 5` slices so the remaining `Workspace 7.5-5` execution ladder now matches the staged discipline used by the earlier shipped sections and each open phase has a clearer implementation-ready done shape
1. 2026-04-01 11:45: Normalized the visible `Workspace 7.5-5` phase ladder to match the staged section style used in `Workspace 7.5-3`, promoting the planned phase headings into explicit `[x]` and `[ ]` section titles so shipped Phases 1 and 2 plus the open Phases 3 through 5 now read as one clear checklist-style execution ladder
1. 2026-04-01 11:37: Recorded the first real cross-graph `Phase 3 - Floating Shell Stability` implementation slice after guarding `SpaghettiPanel` workspace-target sync behind the active editor viewport, noting that inactive editor panels should no longer overwrite shared graph selection while several editor surfaces are rendered and that the broader Phase 3 floating-shell repair remains open until the corrected different-graph floating repro is fully verified
1. 2026-04-01 11:31: Tightened `Phase 3 - Floating Shell Stability` after the repro was clarified, changing the canonical target from “any two floating editors” to the narrower and more accurate “two floating editors bound to different graph documents,” and updated the code read plus locked answers so Phase 3 now aims first at cross-graph floating instability before later Phase 4 runtime-isolation cleanup
1. 2026-04-01 11:22: Locked the main Phase 3 floating-shell questions and decisions inside `Workspace 7.5-5`, turning `Phase 3 - Floating Shell Stability` into an implementation-ready slice with a canonical repro, narrower in-scope boundary, concrete `SpaghettiWindowHost` first-fix ownership, and an explicit done shape centered on eliminating the multi-floating blank-screen bug before Phase 4 runtime isolation work begins
1. 2026-04-01 11:13: Reworked the open tail of `Workspace 7.5-5` into smaller responsible post-Phase-2 subphases, keeping shipped Phases 1 and 2 intact while replacing the single broad `Phase 3` cleanup bucket with separate floating-shell stability, per-viewport runtime isolation, and final close-out slices after the new multi-floating blank-screen bug clarified that the remaining work is larger than a generic residue pass
1. 2026-04-01 10:42: Recorded the first small `Phase 3 - Residue Cleanup And Close-Out` implementation slice after fixing the overlapping floating-window spawn case, noting that newly opened `Spaghetti Editor` floating surfaces now stagger from the current top window instead of perfectly covering it while the broader Phase 3 residue pass remains open
1. 2026-04-01 10:26: Marked `Phase 2 - Multi-Surface Lifecycle Parity` as shipped after moving live `Spaghetti Editor` shell rendering to per-viewport placement truth, preserving viewport-scoped settings state through slotted and meatball-backed render paths, tightening split-view migration and in-app shell presence checks in `AppShell`, and verifying the focused `AppShell` plus `SpaghettiWindowHost` suites now keep several editor surfaces alive honestly together
1. 2026-04-01 09:09: Tightened `Phase 2 - Multi-Surface Lifecycle Parity` into an implementation-ready second slice after a focused read across `useSpaghettiStore`, `AppShell`, and `SpaghettiWindowHost`, locking the live close, fallback, host-mode restore, and remaining `separateWindow` seams that still decide whether several editor surfaces can stay alive honestly together after the shipped Phase 1 targeting cleanup
1. 2026-04-01 09:06: Marked `Phase 1 - Per-Surface Shell Targeting` as shipped after repointing the floating `Spaghetti Editor` split menu and main shell titlebar actions away from ambient active-editor ownership, threading the concrete editor surface id through the shared split-menu state, and adding focused regressions that prove the clicked editor surface remains the action target even if global active-editor focus changes afterward
1. 2026-04-01 08:41: Tightened `Phase 1 - Per-Surface Shell Targeting` into an implementation-ready first slice after a focused handler audit across `AppShell` and `SpaghettiWindowHost`, locking the exact active-editor-driven titlebar and split-menu paths to repoint first, clarifying the narrow boundary versus later lifecycle work, and adding a sharper Phase 1 checklist plus verification shape
1. 2026-04-01 08:39: Broke `Workspace 7.5-5` into staged in-doc subphases so the multi-editor parity work now executes as smaller phase sections inside the same planning surface, separating per-surface shell targeting, multi-surface lifecycle parity, and final cleanup instead of implying one all-at-once implementation cut
1. 2026-04-01 08:35: Tightened this native `Workspace 7.5-5` phase doc into an implementation-ready spec after a live code read across `useSpaghettiStore`, `AppShell`, and `SpaghettiWindowHost`, locking the exact store-versus-shell mismatch, the first execution boundary around per-surface shell targeting, the concrete likely seams, and the focused verification shape for honest multiple open editor surfaces
1. 2026-04-01 08:35: Added this native `Workspace 7.5-5` future phase doc to split the next `Spaghetti Editor` multi-surface cleanup out of the broader `7.5-4` parity lane, grounding it in the current store-versus-shell mismatch where multiple editor viewport records already exist but `AppShell` and `SpaghettiWindowHost` still route too much ownership through one active editor

### Purpose

Use this phase to make more than one `Spaghetti Editor` surface stay open honestly at once as a first-class workspace behavior.

The goal is not to invent a second multi-graph architecture.
The goal is to let the existing editor-surface model behave honestly at the shell layer:
- more than one editor surface may stay open at the same time
- shell actions should target the editor surface the user actually interacted with
- `activeEditorViewportId` should stay focus truth, not one-editor ownership truth

### Scope

This phase covers:
- multiple honest open `Spaghetti Editor` surfaces in the workspace shell
- per-surface shell targeting for float, popout, redock, split, and close actions
- reducing remaining shell ownership that still collapses toward one active editor
- preserving graph binding per editor surface while several editor surfaces remain alive

This phase does not cover:
- the user-facing `Open Editors` product UX tracked elsewhere under `Workspace 5.3`
- a broad rewrite of graph document behavior
- forced Browser or Console behavior changes unrelated to editor-surface parity
- a general visual redesign of editor chrome

## Doc Body

### Summary

`Workspace 7.5-5` is the next dedicated follow-on after `7.5-4`.

It exists because the underlying `Spaghetti Editor` data model is already ahead of the shell:
- `useSpaghettiStore` already has `editorViewportsById`
- `useSpaghettiStore` already has `editorViewportOrder`
- editor surfaces already carry placement and graph-binding metadata

But the live shell still acts too much like there is one main editor:
- `AppShell` still derives several behaviors from `activeEditorViewportId`
- `SpaghettiWindowHost` still routes some titlebar and host actions through the active editor path instead of the interacted surface
- some restore and rehome behavior still assumes one main editor shell owner

This phase should close that gap.

### Locked Direction

`Workspace 7.5-5` should be:
- a shell-parity cleanup for `Spaghetti Editor`
- a multi-surface honesty phase
- a per-surface targeting phase

`Workspace 7.5-5` should not be:
- a replacement for `Workspace 5.3`
- a new graph-session model
- a broad Browser or Console cleanup lane

### Current Code Read

Current likely seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`

Important current mismatch:
- the store already supports multiple editor viewport records
- the shell still treats one active editor as the main owner in too many places

Concrete read from the current code:
- `useSpaghettiStore` already owns `editorViewportsById`, `editorViewportOrder`, `activeEditorViewportId`, `openGraphDocumentInNewViewport(...)`, `bindEditorViewportToGraphDocument(...)`, and `closeEditorViewport(...)`
- `AppShell` still derives too much shell behavior from `activeEditorViewportId`, `activeEditorViewport`, and `activeEditorSlot`
- `AppShell` still uses `createDuplicatedEditorSurfaceInstanceId(...)` as one entry point for creating additional editor surfaces, but much of the surrounding shell logic still assumes one active editor host
- `SpaghettiWindowHost` still derives too much UI and host behavior from `activeEditorViewportId`, `activeEditorSurface`, and `activeEditorSlot`
- `SpaghettiWindowHost` still routes several shell actions through active-editor state even when the user is interacting with a concrete editor surface instance
- the store is already capable of focusing, binding, and closing by concrete `editorViewportId`, which means the main remaining work is shell targeting honesty rather than new multi-editor data modeling

Practical read:
- opening, duplicating, floating, splitting, or popping out an editor surface should not collapse back toward one editor shell owner
- titlebar and host actions should act on the exact surface instance the user clicked or dragged
- focus can still update `activeEditorViewportId`, but that should not rewrite ownership of other open editor surfaces

Additional current read after the latest Phase 7 fix:
- Browser policy sync was rebuilding `projectContent` too aggressively from graph-owned runtime output and could erase user-authored parentage for moved published objects or components
- the live fix now keeps runtime placement separate from graph provenance so Browser policy toggles can still suppress or restore runtime output without reparenting it back to the root assembly
- shared multi-graph viewer composition had still been sourcing rendered parts from preview-only output timing while Browser content was already using published runtime output, which is why a newly added graph could show up in Browser before its first object appeared in the main viewer
- the broader `npm run build` wall turned out not to be many separate architectural breaks; the root blocker was `useWorkspaceStore` collapsing its own inferred type by referencing `useWorkspaceStore.getState()` during initialization, which then degraded host and test selectors into `any` or `unknown` until that store seam was corrected

### Locked Implementation Direction

`Workspace 7.5-5` should:
- keep the existing multi-editor store model
- re-target shell behavior to concrete editor surface instances
- demote `activeEditorViewportId` to focus truth only
- preserve the existing shared workspace host contract instead of inventing a new editor-only shell system

`Workspace 7.5-5` should not:
- add another editor-specific placement model
- re-open the old `split view` or `separateWindow` shell truth problem
- widen into the user-facing `Open Editors` UX tracked under `Workspace 5.3`

### Locked In-Scope Boundary

This phase should handle:
- per-surface float, popout, redock, split, and close targeting for editor surfaces
- duplicate or second editor surfaces staying alive at the same time
- focus updates that do not steal shell ownership away from other open editor surfaces
- restore behavior that keeps several editor surfaces distinct

This phase should not handle:
- redesigning graph-open UX
- changing which graph a new editor should open by product default beyond current behavior
- broad Browser, Console, or viewport-shell cleanup except where safety requires a shared helper touch

### Locked Questions / Decisions

#### [x] Question 1 - What is the actual problem to solve first?

##### Locked Answer
- the first problem is shell targeting, not store modeling
- the store already supports multiple editor viewport records
- the shell still routes too many actions through one active-editor read

##### Why
- solving the wrong layer would duplicate data structures the repo already has

#### [x] Question 2 - What should `activeEditorViewportId` mean after this phase?

##### Locked Answer
- it should remain focus truth only
- it should not decide which other editor surface is the real shell owner

##### Why
- focus is useful global state
- ownership of float, popout, split, and close should stay attached to the interacted surface instance

#### [x] Question 3 - What is the first safe implementation cut?

##### Locked Answer
- repoint titlebar and host actions first
- keep the store shape additive
- then verify duplicate, slotted, floating, and popped-out editor surfaces can stay alive together

##### Why
- that changes the least risky layer first and proves the real parity goal without broad feature churn

#### [x] Question 4 - What should stay out of scope here?

##### Locked Answer
- the user-facing `Open Editors` launcher and switcher UX
- new graph-session semantics
- broad visual redesign

##### Why
- `7.5-5` should make the shell honest first and let later UX work build on that truth

### In Scope

- make multiple `Spaghetti Editor` surfaces stay open honestly at once
- keep per-surface graph binding and placement intact while several surfaces exist
- re-target shell actions so they operate on the interacted editor surface instance
- reduce live shell code that still assumes only one active editor shell owner

### Out Of Scope

- redesigning the `Open Editors` UX
- changing how graph documents themselves are authored
- broad shell cleanup for non-editor surfaces unless needed for safety
- adding a new visual presentation mode system

### Likely Files

- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

High-signal live seams:
- `src/app/AppShell.tsx`
  - `activeEditorViewport`
  - `activeEditorViewportId`
  - `activeEditorSlot`
  - `createDuplicatedEditorSurfaceInstanceId(...)`
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - `activeEditorViewportId`
  - `activeEditorSurface`
  - `activeEditorSlot`
  - titlebar action handlers that still target the active editor path
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `openGraphDocumentInNewViewport(...)`
  - `bindEditorViewportToGraphDocument(...)`
  - `closeEditorViewport(...)`
  - focus and placement helpers that already operate by concrete `editorViewportId`

### First Implementation Cut

The first cut should land in this order:

1. Audit and isolate every `Spaghetti Editor` shell action that still targets `activeEditorViewportId` by default.
2. Repoint those actions so they act on the concrete editor surface instance the user interacted with.
3. Keep `activeEditorViewportId` updates as focus behavior only.
4. Verify that several editor surfaces can remain alive together across slot, float, and popout host modes.
5. Add focused regressions before widening into any later UX cleanup.

### Phase Sections

## [x] Phase 1 - Per-Surface Shell Targeting
### info
Purpose:
- stop routing live editor shell actions through `activeEditorViewportId` by default
- make float, popout, redock, split, and close target the concrete editor surface instance the user interacted with

Main work:
- audit every titlebar and host action in `AppShell` and `SpaghettiWindowHost`
- repoint those actions to concrete `editorViewportId` targeting
- keep `activeEditorViewportId` only as focus truth

Current live Phase 1 seams:
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - `handleSplitToggle(...)`
  - `handleViewportSplitToggle(...)`
  - `handleTogglePopout(...)`
  - `handleViewportDockFromPopout(...)`
  - `handleCloseEditor(...)`
  - the shared `activeEditorSurface`, `activeEditorSlot`, and `activeEditorViewportId` reads that still back the main titlebar path
- `src/app/AppShell.tsx`
  - `handleSetSplitDirection(...)`
  - `handleResetSplitRatio(...)`
  - `handleSetSplitPriority(...)`
  - `handleCloseSplitFromMenu(...)`
  - the `activeEditorSurface`, `activeEditorSlot`, and `activeEditorViewportId` reads that still back the floating split menu

Locked Phase 1 direction:
- Phase 1 should convert the live shell actions that currently default to the active editor
- Phase 1 should do that by threading or deriving the concrete `editorViewportId` for the interacted surface
- Phase 1 should not yet widen into full several-surface restore and fallback logic unless a small safety adjustment is required

Locked Phase 1 in-scope:
- titlebar shell actions on `SpaghettiWindowHost`
- floating split-menu shell actions in `AppShell`
- the minimum supporting helper changes needed to target a concrete editor surface instance cleanly

Locked Phase 1 out-of-scope:
- broad restore behavior
- fallback focus rules after one of several open editors closes
- full multi-surface lifecycle parity across every host mode
- `Open Editors` UX work

Phase 1 execution order:
1. Identify every shell action that still defaults to `activeEditorViewportId` or `activeEditorSlot`.
2. Repoint those actions to a concrete `editorViewportId`.
3. Keep focus updates intact without letting them re-own unrelated editor surfaces.
4. Add focused regressions proving that the clicked editor surface is the one that moves, pops out, splits, or closes.

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`

Done shape:
- per-surface shell actions no longer act on whichever editor happens to be globally active
- clicking a surface's controls moves or closes that exact surface
- the main active-editor-only titlebar and split-menu assumptions are removed or materially reduced

Shipped read:
- `SpaghettiWindowHost` main shell split, popout, and close actions now delegate through concrete `editorViewportId` targeting instead of relying on ambient active-editor ownership
- the shared floating split menu now stores the `Spaghetti Editor` surface id that opened it, so later menu actions still hit that surface even if `activeEditorViewportId` changes before the user clicks
- the first focused regressions now prove floating split-menu targeting survives an active-editor switch between menu open and menu click

## [x] Phase 2 - Multi-Surface Lifecycle Parity
### info

Purpose:
- make multiple editor surfaces stay alive honestly at once across the real workspace host modes

Main work:
- verify duplicate or second editor surfaces can stay open together
- keep slot, float, popout, redock, split, and close behavior honest when several editor surfaces exist
- make close and fallback behavior operate on the targeted editor surface only
- keep restore behavior from collapsing several editor surfaces back into one live owner

Current live Phase 2 seams:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `openGraphDocumentInNewViewport(...)`
  - `closeEditorViewport(...)`
  - the fallback update of `activeEditorViewportId` after one viewport closes
  - the current interaction between `editorViewportOrder`, `editorViewportsById`, and focus after add or close
  - `setEditorViewportWindowMode(...)` and `restoreEditorViewportFromSeparateWindow(...)` where host-mode state can still collapse back toward one main editor path
- `src/app/AppShell.tsx`
  - startup and persistence hydration loops that rebuild editor host modes from placement plus viewport state
  - the remaining restore paths that still derive behavior from `editorViewportsById`, `activeEditorViewportId`, and placement state together
  - `createDuplicatedEditorSurfaceInstanceId(...)` as the current shell entry point for creating additional editor surfaces
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - `handleViewportDockFromPopout(...)`
  - detached popup rendering and dock-back behavior for several live editor surfaces
  - the remaining use of `activeEditorSurface` and `activeEditorSlot` to decide whether one surface is floating, slotted, or popped out while others also exist

Locked Phase 2 direction:
- Phase 2 should prove that several editor surfaces can remain alive together without stale ownership side effects
- Phase 2 should keep focus fallback separate from ownership truth
- Phase 2 should preserve explicit surface identity across slot, float, popout, close, and restore transitions
- Phase 2 should not yet expand into broad UX or visual cleanup

Locked Phase 2 in-scope:
- duplicate or second editor surfaces staying alive across slotted, floating, and popped-out host modes
- close behavior and focus fallback when several editor surfaces exist
- restore and dock-back behavior that keeps several editor surfaces distinct instead of collapsing them
- the minimum store and shell cleanup needed to keep multi-surface lifecycle honest

Locked Phase 2 out-of-scope:
- redesigning graph-open product defaults
- `Open Editors` launcher and switcher UX
- broad cleanup for Browser, Console, or unrelated workspace surfaces
- visual polish that does not improve surface-lifecycle honesty

Phase 2 execution order:
1. Re-check add and close flows in `useSpaghettiStore` so lifecycle fallback updates focus without stealing ownership.
2. Re-check floating, slotted, and popped-out restore behavior in `AppShell` and `SpaghettiWindowHost`.
3. Make sure a duplicate or second editor can stay alive while another surface closes, docks back, or changes host mode.
4. Add focused regressions for close, fallback, popout dock-back, and several-open-surface restore behavior.

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/useWorkspaceStore.ts`

Done shape:
- multiple editor surfaces can remain open together without stale ownership side effects
- closing one surface leaves the others alive and correctly focused
- restore preserves several editor surfaces as separate instances
- host-mode transitions no longer quietly collapse several editor surfaces back toward one live owner

Shipped read:
- `SpaghettiWindowHost` now renders in-app editor shells from per-viewport placement truth instead of treating the active editor as the only live in-app shell owner, while detached popouts still render and dock back per concrete viewport id.
- `AppShell` now treats visible in-app Spaghetti presence as "any live in-app editor shell exists", preserves split-view compatibility orientation and bottom-inset shape during migration, and keeps restored toolbar Browser layouts visible unless the docked Browser was actually projected into the slot tree during the live session.
- `ViewportSurfaceRegistry` now receives viewport-scoped window-settings state, so the same editor viewport keeps that UI state when it moves from floating into slotted or meatball-backed presentation modes.
- Focused verification through `.\node_modules\.bin\tsc.cmd --noEmit`, `npm.cmd run test -- src/app/hosts/SpaghettiWindowHost.test.tsx`, and `npm.cmd run test -- src/app/AppShell.test.tsx` now proves the main multi-surface lifecycle seams stay alive together.

## [x] Phase 3 - Floating Shell Stability
### Header
Purpose:
- stabilize the in-app floating `Spaghetti Editor` shell now that Phase 2 proved several surfaces can exist but the new multi-floating blank-screen bug shows the floating branch is still not safe enough

Main work:
- reproduce and fix the multi-floating blank-screen failure tracked in `docs/Bugs/11_Workspace-7.5-5-Multi-Floating-Spaghetti-Blank-Screen.md`
- audit the mapped floating render branch in `SpaghettiWindowHost` for any per-viewport shell that can still take over the full frame or destabilize the shared floating dock when different graph documents are live at once
- tighten regressions so two floating editor windows bound to different graph documents remain visibly rendered and interactive together in the model viewport

Likely files:
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Bugs/11_Workspace-7.5-5-Multi-Floating-Spaghetti-Blank-Screen.md`

Done shape:
- opening a second floating `Spaghetti Editor` on a different graph document no longer blanks or visually takes over the app shell
- two or more floating editor surfaces remain visibly discoverable and usable together even when different graph documents are loaded at once
- the floating shell branch has explicit regression coverage for the real user repro path

Current cleanup read:
- newly opened floating `Spaghetti Editor` surfaces should no longer spawn directly on top of the previous floating editor surface
- the first small cleanup slice now cascades new floating editor viewport spawn positions so several floating windows remain visually discoverable without adding a full tiling system
- the next small stability slice now prevents inactive `SpaghettiPanel` instances from pushing shared workspace graph-target sync while another editor viewport is actually focused, reducing one likely cross-graph floating conflict without yet claiming the whole corrected repro is closed
- the latest host-side slice now removes active-viewport geometry fallback from floating helper resolution and keeps floating-host cleanup keyed to whether any in-app floating editor exists, so a focus change between two floating editors should no longer rewrite a sibling window's frame truth
- manual confirmation now says two different floating editor windows can stay open together on separate graph documents without reproducing the earlier blank-screen failure, which closes the original Phase 3 bug target

Locked Phase 5 result:
- the graph-level runtime and project-content layers were already distinct enough by `graphDocumentId` to keep separate output surfaces alive through the first ownership seam
- the real active collapse was later, where Browser highlight keys, grouped selection payloads, visibility part keys, and the single-viewer preview path still leaked bare slot ids as shared viewer identity
- the smallest honest implementation cut was to qualify viewer-facing part keys as `${graphDocumentId}:${slotId}` through `useAppStore`, `selectBrowserGraphRows`, and the single-viewer `ViewerHost` path
- focused regressions now cover the graph-qualified identity contract in `src/app/store/useAppStore.test.ts`, `src/app/panels/selectBrowserGraphRows.test.ts`, and `src/app/components/ViewerHost.test.tsx`

Locked Phase 5 result:
- the graph-level runtime and project-content layers were already distinct enough by `graphDocumentId` to keep separate output surfaces alive through the first ownership seam
- the real active collapse was later, where Browser highlight keys, grouped selection payloads, visibility part keys, and the single-viewer preview path still leaked bare slot ids as shared viewer identity
- the smallest honest implementation cut was to qualify viewer-facing part keys as `${graphDocumentId}:${slotId}` through `useAppStore`, `selectBrowserGraphRows`, and the single-viewer `ViewerHost` path
- focused regressions now cover the graph-qualified identity contract in `src/app/store/useAppStore.test.ts`, `src/app/panels/selectBrowserGraphRows.test.ts`, and `src/app/components/ViewerHost.test.tsx`

Current code-backed read:
- the store-side second-viewport creation path in `useSpaghettiStore` now appears mostly sane, including staggered spawn offset and concrete viewport creation
- the stronger remaining suspicion is the shared in-app floating render branch in `SpaghettiWindowHost`, where several floating editor shells now coexist inside one floating dock but some shell behavior still pivots through active-viewport-derived reads
- the corrected repro suggests the branch is more sensitive to two different live graph bindings than to merely having two floating shells on the same graph
- this still looks like a real floating-shell stability bug, but now one with likely cross-graph or shared-runtime pressure rather than placement-only overlap

### Locked Phase 3 questions / decisions:

#### [x] Question 1 - What is the actual failure class?

##### Locked Answer
- treat this as a real floating-shell stability bug in the shared in-app `SpaghettiWindowHost` floating branch
- do not treat it as a simple overlap or spawn-position issue

##### Why
- the user-visible symptom is a dark blank screen where the tab stays alive but the interactive shell appears missing or fully covered
- the recent spawn-cascade cleanup helped discoverability but did not remove the actual failure

#### [x] Question 2 - What exact repro is Phase 3 responsible for fixing first?

##### Locked Answer
- the canonical Phase 3 repro is:
  - open one floating `Spaghetti Editor`
  - bind that first floating editor to `Graph 1`
  - open a second floating `Spaghetti Editor` in the same model viewport
  - bind the second floating editor to `Graph 2`
  - verify the app remains visible
  - verify both floating editor windows remain visible and interactive
  - verify the failure does not reproduce when two floating editors both remain on the same graph, so the regression stays narrowly aimed at the real cross-graph path

##### Why
- this is the narrowest real user repro that matches the clarified bug and gives Phase 3 a crisp pass/fail target

#### [x] Question 3 - Which code seam owns the first fix?

##### Locked Answer
- the first fix should start in `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/panels/SpaghettiPanel.tsx` is now an immediate secondary seam to audit if the floating-host pass alone does not explain the cross-graph failure
- `useSpaghettiStore` and `AppShell` should only receive smaller supporting touches if the host or panel investigation proves they are necessary

##### Why
- the store-side second-viewport creation path now looks more stable than the shared floating render branch
- the highest-suspicion seam is still the mapped floating-shell render path in `SpaghettiWindowHost`, but the corrected repro makes shared graph-bound panel behavior more suspicious than before

#### [x] Question 4 - What is in scope for Phase 3?

##### Locked Answer
- floating in-app shell rendering
- floating frame math
- active-versus-per-viewport shell behavior in the floating branch
- the minimum graph-bound panel/runtime audit needed to explain why the failure appears when different graph documents are live in two floating windows
- the minimum supporting `AppShell` or store cleanup needed to keep the floating branch stable
- focused regressions for the real blank-screen repro

##### Why
- this keeps Phase 3 responsible for the real cross-graph floating bug without widening into the broader runtime-isolation work reserved for Phase 4

#### [x] Question 5 - What stays out of scope for Phase 3?

##### Locked Answer
- broad `SpaghettiPanel` runtime redesign beyond the minimum cross-graph audit needed for the real repro
- graph-open UX changes
- general Browser or Console cleanup
- new placement or session models

##### Why
- those are not needed to make the floating shell stable enough for the reported repro
- if deeper editor-runtime shared-state cleanup is still required after the floating shell is stable, that belongs in Phase 4

#### [x] Question 6 - What is the main architectural suspicion to prove or disprove first?

##### Locked Answer
- assume the mapped `floatingViewportStates` branch is still partly single-owner in practice even though it now renders several surfaces
- prove or disprove whether one active-viewport path or one shared graph-bound panel path can still drive shell behavior too broadly across the shared floating dock when two different graph documents are active at once

##### Why
- that matches both the code read and the user-facing symptom where the app appears visually taken over rather than simply mispositioned

#### [x] Question 7 - What concrete bad behavior is most likely?

##### Locked Answer
- one floating shell is likely entering an effective full-frame or bad-frame state that visually dominates the floating dock
- alternatively, one active-viewport-driven or graph-bound shared-state branch is destabilizing the floating render layer when the second floating editor switches to a different graph document

##### Why
- the shared `SpaghettiFloatingDock` spans the whole viewport, so one bad branch there can hide the rest of the app without the tab actually crashing

#### [x] Question 8 - Does Phase 3 include maximized-path auditing?

##### Locked Answer
- yes
- any accidental, stale, or mis-restored maximized-like behavior inside the floating branch is in scope for Phase 3

##### Why
- a bad maximized path is one of the most plausible ways a floating shell could visually cover the whole viewport

#### [x] Question 9 - Does Phase 3 include an `AppShell` audit?

##### Locked Answer
- yes, but as a secondary seam
- `SpaghettiWindowHost` owns the first fix, while `AppShell` should be audited only for shell-activation or visibility-clearing behavior that can suppress surviving in-app shells

##### Why
- this keeps fix ownership narrow without ignoring the last shell-level suppressors that still live above the host

#### [x] Question 10 - What counts as done for Phase 3?

##### Locked Answer
- opening a second floating editor on a different graph document must no longer blank the app
- both floating editor windows must remain visible and interactive
- focus may move between them without hiding the workspace shell
- a focused regression must prove the canonical repro stays stable

##### Why
- “it looked fine once” is not enough for a bug in this family
- the done shape should be explicit enough that Phase 4 starts from a stable floating shell instead of a maybe-fixed one

Locked Phase 3 direction:
- treat the real bug as cross-graph floating-shell stability first, not broad runtime isolation first
- fix the shared in-app floating render branch first, while allowing the minimum `SpaghettiPanel` audit needed if the cross-graph repro clearly reaches into graph-bound panel state
- keep Phase 3 narrow enough to land one responsible stability slice with a direct repro test

Locked Phase 3 in-scope:
- `SpaghettiWindowHost` floating-shell rendering and per-viewport frame derivation
- the interaction between floating viewport state, active viewport reads, and shared floating-dock rendering
- the minimum graph-bound panel/runtime seam inspection needed for the corrected cross-graph repro
- small supporting `AppShell` or store touches required to keep the floating shell stable
- focused regression coverage for the different-graph two-floating-editor blank-screen repro

Locked Phase 3 out-of-scope:
- broad per-viewport runtime-state refactors in `SpaghettiPanel` and `SpaghettiCanvas` beyond what is required to fix the corrected repro
- general `Open Editors` product cleanup
- Browser or Console behavior changes not directly required for the floating-shell fix
- any new editor placement model or session model

Phase 3 execution order:
1. Reproduce the corrected cross-graph floating blank-screen path and keep that as the canonical regression target.
2. Audit `SpaghettiWindowHost` floating-shell derivation, especially `floatingViewportStates`, floating frame reads, and any active-viewport-only behavior that still influences several floating shells at once.
3. If the host audit alone is insufficient, inspect the minimum `SpaghettiPanel` graph-bound shared-state seams needed to explain why same-graph floating survives while different-graph floating fails.
4. Apply the smallest fix that prevents cross-graph floating shells from visually taking over or destabilizing the workspace shell.
5. Add a focused regression proving two floating editor windows bound to different graph documents remain visible and interactive together in the model viewport.
6. Re-check `AppShell` only for any remaining shell-visibility or activation logic that could still suppress surviving in-app floating shells after the host fix.

### Phase 3 Checklist

- [x] Reproduce and lock the corrected different-graph floating blank-screen path as the canonical `Phase 3` target
- [x] Audit `SpaghettiWindowHost` floating-shell derivation for any active-viewport or bad-frame logic that can still dominate the shared floating dock
- [x] Re-check the minimum `SpaghettiPanel` graph-bound shared-state seams needed to explain why same-graph floating survives while different-graph floating fails
- [x] Apply the smallest fix that keeps two floating editor windows on different graph documents visible and interactive together
- [x] Add focused regression coverage for the corrected cross-graph floating-shell repro

### Phase 3 Verification Shape

Minimum verification for `Phase 3` should cover:
- one floating editor on `Graph 1` plus a second floating editor on `Graph 2` coexisting without blanking or visually suppressing the app shell
- both floating editor windows remaining visible and interactive after focus moves between them
- the same-graph floating path still remaining stable so the regression stays tied to the real different-graph failure
- any maximized-like or full-frame floating branch no longer taking over the shared floating dock accidentally

## [x] Phase 4 - Per-Viewport Runtime Isolation
### Header

Purpose:
- reduce the remaining runtime assumptions inside the live editor subtree that still act like there is one real active editor even when several editor surfaces exist

Main work:
- audit `SpaghettiPanel`, `SpaghettiEditor`, and related editor runtime seams for shared global state that should behave per viewport
- separate true viewport-local editor behavior from global focus-only behavior where the current code still mixes them
- prevent one active editor surface from implicitly re-owning shared editor UI behavior inside another live editor shell

Likely files:
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/spaghetti/ui/SpaghettiEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`

Done shape:
- multiple live editor panels no longer share runtime behavior in ways that assume one active shell owner
- viewport-local editor interactions behave predictably even when another editor surface is focused
- the remaining `activeEditorViewportId` usage reads clearly as focus truth instead of hidden ownership truth

Important carry note:
- if `Graph 1` and `Graph 2` are open in separate editor surfaces, their output previews should be able to create distinct preview objects at the same time instead of appearing to fight over one shared output result
- treat that as a strong Phase 4 clue that graph-bound runtime or preview-output ownership is still leaking across editor surfaces even after the earlier shell-parity fixes

Current code-backed read:
- `SpaghettiPanel` no longer reads node selection from one shared active-editor field; it now derives focus-node UI from the concrete `editorViewportId`
- `SpaghettiCanvas` no longer reads or writes selected node or selected edge state through one shared runtime path; those editor-local interactions now route through explicit viewport-scoped selectors and setters
- `useSpaghettiStore` now keeps viewport-local node, edge, and console-preview selection maps while still mirroring the active viewport back into the older global fields for compatibility
- the main remaining Phase 4 clue is still the user observation that different graph documents may not yet produce distinct output-preview objects at the same time, which suggests preview/output ownership may still leak beyond the newly isolated selection layer

Locked Phase 4 questions / decisions:

#### [x] Question 1 - What is the real problem to solve in Phase 4?

##### Locked Answer
- the main problem is runtime ownership inside the live editor subtree, not shell placement anymore
- Phase 4 should reduce the global editor state that still makes two live editor panels behave like one active graph session

##### Why
- Phase 3 closed the floating-host blank-screen bug, but the code still shows shared runtime state that is not scoped per viewport

#### [x] Question 2 - What are the strongest first seams?

##### Locked Answer
- start with global node and edge selection plus console-preview ownership
- specifically audit `selectedNodeId`, `selectedEdgeId`, `consolePreviewNodeId`, and closely related canvas or panel behaviors before widening further

##### Why
- those reads and writes are already visible in both `SpaghettiPanel` and `SpaghettiCanvas`
- they are the clearest current examples of editor-local behavior leaking through shared store truth

#### [x] Question 3 - What should Phase 4 treat as local versus global?

##### Locked Answer
- per-viewport graph binding, selected node, selected edge, fit requests, and editor-local preview interactions should become viewport-local or explicitly routed by viewport id
- `activeEditorViewportId` should remain global focus truth
- shared viewer composition and other intentionally shared workspace features may remain global when their contract is explicitly cross-viewport

##### Why
- this preserves the useful shared workspace signals while moving editor-local runtime behavior to the surface that actually owns it

#### [x] Question 4 - Does Phase 4 include output-preview ownership?

##### Locked Answer
- yes, but only to the extent needed so separate graph documents can keep distinct preview/output runtime behavior while several editor surfaces are open
- do not redesign the whole preview/build pipeline if a narrower ownership refactor is sufficient

##### Why
- the user-facing symptom is already telling us output-preview ownership still leaks across graph sessions
- that is too important to defer beyond the runtime-isolation phase

#### [x] Question 5 - What stays out of scope for Phase 4?

##### Locked Answer
- no Browser graph-open UX changes
- no broad shell or floating-host redesign
- no new session model
- no speculative rewrite of all compile/runtime data structures beyond what the viewport-local runtime cut actually needs

##### Why
- Phase 4 should isolate runtime ownership, not reopen solved shell work or invent a second graph architecture

Locked Phase 4 direction:
- Phase 4 should replace the remaining hidden global editor-runtime ownership with explicit per-viewport runtime ownership where the behavior is editor-local
- the first implementation cut should target node selection, edge selection, console preview, and related fit or focus requests before widening into deeper output-preview or compile-surface cleanup
- active focus should still be global, but switching focus should no longer rewrite another editor surface's local runtime state

Locked Phase 4 in-scope:
- `SpaghettiPanel` focus-node and graph-local UI state that still mirrors global selection
- `SpaghettiCanvas` node, edge, console-preview, and related interaction state that should be isolated per viewport
- the minimum store refactor needed to move those behaviors off shared active-graph truth and onto viewport-local runtime truth
- focused regressions proving two graph documents can stay open without runtime bleed between their editor surfaces

Locked Phase 4 out-of-scope:
- Browser or Console product-flow redesign
- shell-layout, popout, or floating-host behavior already closed in earlier phases
- broad compile pipeline rewrites beyond the minimum ownership change needed for distinct viewport-local preview behavior
- a new persistence or schema model

Phase 4 execution order:
1. Audit the current shared editor-runtime state in `useSpaghettiStore`, starting with `selectedNodeId`, `selectedEdgeId`, `consolePreviewNodeId`, and fit-request helpers.
2. Repoint `SpaghettiPanel` and `SpaghettiCanvas` to explicit viewport-local runtime reads and writes for editor-local interactions.
3. Preserve `activeEditorViewportId` only as focus truth and keep intentionally shared features, such as shared viewer composition, explicitly global.
4. Verify that two open editor surfaces on different graph documents can keep distinct node or preview state without one surface re-owning the other.
5. Add focused regressions for the main runtime-isolation seams before widening into any final close-out work.

### Phase 4 Checklist

- [x] Audit `SpaghettiPanel`, `SpaghettiEditor`, and adjacent editor-runtime seams for state that still behaves as one active editor owning multiple live panels
- [x] Separate viewport-local editor behavior from global focus-only behavior where the current runtime still mixes them
- [x] Reduce remaining hidden ownership reads of `activeEditorViewportId` so they read clearly as focus truth only
- [x] Verify that editor-local interactions in one surface do not silently re-own or destabilize another live editor surface
- [x] Add focused regressions for the main per-viewport runtime-isolation seams that remain after `Phase 3`
- [x] Verify that separate graph documents can keep distinct output-preview objects or other graph-bound preview/runtime ownership at the same time without one live editor surface re-owning the other

### Phase 4 Verification Shape

Minimum verification for `Phase 4` should cover:
- two live editor surfaces on different graph documents keeping their local runtime behavior predictable while focus moves between them
- editor-local interactions in one viewport not silently rewriting another viewport's active graph-bound UI state
- the remaining `activeEditorViewportId` reads behaving like focus truth instead of hidden shell or runtime ownership
- floating and slotted editor surfaces coexisting without graph-bound runtime bleed between the viewports

## [x] Phase 5 - Preview And Output Ownership Trace
### Header

Purpose:
- lock the exact seam where separate graph documents still collapse onto one effective preview or output object identity

Main work:
- trace accepted preview outputs, output surfaces, Browser object rows, and visibility ownership through the live code
- determine whether the collapse is happening in store/runtime output ownership, Browser/viewer object identity, or both
- tighten the next implementation cut around the real seam instead of guessing

Likely files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- this phase doc

Done shape:
- the repo has one concrete code-backed explanation for why two graph documents still act like one output object
- the next implementation phase can be scoped around that actual seam
- the remaining open work is smaller and more honest than one generic refactor bucket
- the live Browser and viewer identity seam now uses graph-qualified part keys instead of leaking one shared bare-slot visibility owner

### Phase 5 Checklist

- [x] Trace accepted preview outputs and output-surface ownership per `graphDocumentId`
- [x] Trace Browser object-row identity and visibility ownership for separate graph documents
- [x] Confirm whether the current collapse is one store/runtime seam, one Browser/viewer seam, or two distinct seams
- [x] Turn the real remaining seam into the next implementation-ready phase without widening into a separate AppShell track

Important future-error carry:
- the current full `npm run build` failure set also shows a broader typed host-surface cleanup cluster around `AppShell`, `BrowserDockHost`, `SpaghettiWindowHost`, workspace slot helpers, and their tests
- treat that cluster as future `Workspace 7.5-5` work only where it directly overlaps the real remaining preview/output ownership seam during `Phases 5` through `7`
- route the broader build-failure cleanup into the dedicated `Phase 8 - Build Failure Triage And Blocking Fixes` slice instead of letting it blur the trace-first work
- do not let those broader typed host cleanups distract from first tracing where the multi-graph output collapse actually happens

### Phase 5 Verification Shape

Minimum verification for `Phase 5` should cover:
- two graph documents with visible Browser rows being traced back to their underlying runtime/output identity
- the current “hide one object and both disappear” symptom being explainable from the code path
- a clear decision on whether the next implementation cut belongs in store/runtime, Browser/viewer identity, or both

Current code-backed read:
- `useSpaghettiStore` already keeps `acceptedBuildOutputs`, `acceptedPreviewBuildOutputs`, and `outputSurface` per `graphDocumentId`, which means the graph-level runtime was not the first collapse seam
- `buildGraphOutputSurface(...)` in `src/app/spaghetti/outputSurface.ts` produces a `GraphOutputSurface` that is explicitly tagged with `graphDocumentId`
- `buildGraphPublishedContentSurface(...)` still carries `objectId` from Output Preview params, but `useAppStore` later wraps project object identity with `buildProjectObjectId(projectFileId, graphDocumentId, objectId)`, so project-content objects are already graph-qualified even when Output Preview defaults reuse slot-shaped ids
- `selectBrowserGraphRows(...)` already builds graph rows per `graphDocumentId`, so the higher-level graph list itself was not the main collapse point
- the real active seam was later: Browser highlight keys, visibility part keys, grouped content part keys, and the single-viewer preview path were still using bare slot ids alongside or instead of graph-qualified viewer keys
- shared viewer composition was already graph-qualified, but the single-viewer `ViewerHost` path still let bare slot ids leak into `viewerParts`, grouped content selection, and visibility behavior
- the landed fix now qualifies viewer-facing part identity as `${graphDocumentId}:${slotId}` through Browser rows, content visibility helpers, grouped selection payloads, and single-viewer preview rendering so separate graphs no longer alias one visibility owner just because they reuse the same slot ids

Locked Phase 5 questions / decisions:

#### [x] Question 1 - What is the strongest current Phase 5 clue?

##### Locked Answer
- the strongest clue was right in direction but narrower in the final answer: graph-level output surfaces were already per `graphDocumentId`, and the real remaining collision lived in Browser or viewer part identity still leaking bare slot ids after the graph-scoped runtime surface was built

##### Why
- this matches the user symptom where two Browser rows appear, but hiding one makes both disappear, which feels more like shared presentation identity than one missing graph row

#### [x] Question 2 - What should Phase 5 prove before we refactor anything?

##### Locked Answer
- Phase 5 proved that the active collapse was primarily a Browser or viewer identity seam, not a first-order runtime-store ownership failure

##### Why
- the repo already has enough per-graph runtime structure that a blind refactor would risk touching the wrong seam first

#### [x] Question 3 - What is in scope for Phase 5?

##### Locked Answer
- trace the live ownership seam across `useSpaghettiStore`, `outputSurface`, `outputPreviewNode`, `useBrowserPanelController`, `selectBrowserGraphRows`, `ConsoleDock`, and the directly connected viewer identity helpers
- allow the smallest supporting implementation slice required to prove and correct the traced seam honestly

##### Why
- this kept the phase implementation-ready without collapsing immediately into a big store or Browser rewrite, while still allowing the smallest graph-qualified identity fix once the collapse point was proven

#### [x] Question 4 - What stays out of scope for Phase 5?

##### Locked Answer
- no broad AppShell cleanup
- no shell-layout redesign
- no speculative multi-system refactor before the collapse point is proven

##### Why
- the next slice should answer “where is the ownership collapsing?” before it answers “how do we rewrite it?”

Locked Phase 5 direction:
- start from the existing per-graph `outputSurface` and follow published object identity outward toward Browser and viewer presentation
- treat graph-qualified viewer part keys, not bare slot ids, as the canonical identity contract once a published object leaves the runtime surface and enters Browser or viewer visibility state
- do not widen into the typed host-surface cleanup cluster unless a tiny supporting fix is needed to complete the trace

Locked Phase 5 in-scope:
- `useSpaghettiStore` output-surface and accepted-output ownership reads
- `outputSurface.ts` published content-surface object identity
- `outputPreviewNode.ts` default and normalized object-id behavior
- Browser graph-row or object-row identity and visibility traces that directly touch the user-visible bug
- the minimum viewer identity seam read needed to explain why hiding one object hides both

Locked Phase 5 out-of-scope:
- changing floating, split, popout, or slotted shell behavior
- broad AppShell cleanup unrelated to the multi-graph output collapse
- refactoring the full compile/build pipeline before the trace proves it is necessary

Phase 5 execution order:
1. Trace `outputSurface` and accepted-output ownership per `graphDocumentId` to confirm the graph-level runtime is still distinct.
2. Trace how published object ids are derived from Output Preview params, especially the default slot-based ids like `output-object:s001`.
3. Trace how Browser and viewer identity or visibility ownership consumes those object ids and any related accepted artifact keys.
4. Decide whether the real next implementation seam belongs in runtime/store ownership, Browser/viewer identity, or both.
5. Turn that proven seam into the next implementation-ready phase without widening into a separate AppShell track.

Phase 5 landed answer:
1. The graph-level runtime and project-content layers already keep enough `graphDocumentId` ownership to distinguish separate output surfaces.
2. The real active collapse was Browser and viewer identity still using bare slot ids as shared visibility keys.
3. The smallest honest fix was to graph-qualify viewer-facing keys in `useAppStore`, `selectBrowserGraphRows`, and `ViewerHost`.
4. Any remaining cleanup after this slice belongs in later supporting Browser or refactor phases, not in a new broad runtime rewrite by default.

## [x] Phase 6 - Runtime And Store Ownership Refactor
### Header

Purpose:
- refactor the store and runtime ownership seams if the Phase 5 trace shows the main collapse is happening before Browser or viewer presentation

Current read after `Phase 5`:
- this is no longer the next implementation cut by default because `Phase 5` proved the live collapse was primarily in Browser or viewer presentation identity
- keep `Phase 6` as a reserve lane only if a later repro shows another genuine runtime-store ownership seam that the current Browser-owned viewer composition still does not explain

Closed read:
- no later repro required this reserve runtime/store refactor lane after the Browser/viewer identity fixes, build-green pass, and supporting ownership hardening landed
- the implementation trail therefore closes `Phase 6` as not needed rather than pretending a separate runtime/store rewrite shipped here

Main work:
- separate per-graph preview or accepted-output ownership where the current runtime still collapses distinct graph documents together
- keep any required `AppShell` or host cleanup tightly coupled to that runtime seam instead of widening into a shell-only cleanup
- preserve the earlier `7.5-5` multi-surface parity wins while the deeper output/runtime ownership is fixed

Likely files:
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.test.ts`
- this phase doc

Done shape:
- separate graph documents no longer collapse onto one runtime/output owner before Browser or viewer presentation
- any required supporting host or `AppShell` cleanup stays narrow and directly justified by the runtime seam
- only Browser/viewer identity cleanup, build-failure cleanup, supporting refactor, or final confidence remains afterward

### Phase 6 Checklist

- [x] Confirm that no separate runtime/store ownership refactor was needed after `Phase 5` proved the active collapse was presentation-side
- [x] Keep any required AppShell or host cleanup out of this reserve lane unless a later runtime repro proves it necessary
- [x] Treat the graph-qualified Browser/viewer identity and rendered-project-parts regressions from later phases as the real proof path instead of adding speculative runtime/store tests here
- [x] Leave only Browser/viewer identity cleanup, build-failure cleanup, supporting refactor, or final confidence for the next phase

### Phase 6 Verification Shape

Minimum verification for `Phase 6` should cover:
- separate graph documents keeping distinct runtime or accepted-output ownership before Browser visibility toggles are applied
- the earlier floating, slotted, and focus-isolation wins staying green after the runtime refactor
- the remaining open work, if any, being clearly presentation-identity cleanup, build-failure cleanup, or later seam hardening rather than another hidden runtime seam

## [x] Phase 7 - Browser And Viewer Object Identity Cleanup
### Header

Purpose:
- fix Browser row identity, viewer object identity, and visibility ownership if Phase 5 shows that separate graph outputs are still being collapsed at the presentation layer

Main work:
- make Browser object rows and viewer visibility toggles resolve against distinct per-graph object ownership
- prevent one object row from hiding another graph document’s live output
- keep this as a presentation-identity cleanup, not a second runtime rewrite
- preserve the newly corrected rule that Browser build policy, not focused Spaghetti editor state, decides whether a graph's output is rendered unless that graph is explicitly suppressed

Likely files:
- `src/app/panels/BrowserPanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/browserInteractions.test.ts`
- this phase doc

Done shape:
- hiding one graph-owned object row no longer hides another graph document’s live output
- Browser and viewer identity are explicit enough that separate graph documents can coexist honestly at the object level
- Browser-driven render ownership stays stable even when active editor focus, Console context, or viewer reveal targeting changes
- only build-failure cleanup, supporting refactor, and final confidence remain

### Phase 7 Checklist

- [x] Refactor Browser or viewer object identity so separate graph outputs do not alias the same effective visibility owner
- [x] Verify that Browser-enabled outputs stay rendered even when a different Spaghetti editor is focused, and disappear only when their graph build policy is `off`
- [x] Verify that hiding one graph-owned object does not hide another graph document's live output
- [x] Add focused regressions for the corrected Browser/viewer object-identity behavior
- [x] Leave only build-failure cleanup, supporting refactor, and final confidence work for the next phases

### Phase 7 Verification Shape

Minimum verification for `Phase 7` should cover:
- two graph documents each showing a distinct live object in Browser or viewer presentation
- switching active editor focus without dropping still-enabled graph outputs from the viewer
- hiding one object leaving the other graph document’s object visible
- the earlier runtime and shell parity behavior staying green after the Browser/viewer cleanup

Current implementation-ready read:
- `Phase 7` is now the real next execution lane because `Phase 5` proved the live remaining ownership risk is presentation-side, not a first-order runtime-store seam
- the highest-signal remaining seams are Browser row interaction paths, viewer highlight and reveal behavior, and any `ConsoleDock` handoff that still assumes the focused editor should own what the viewer is rendering
- the next implementation cut should stay centered on the exact Browser or viewer identity paths that can still desync hide/show, reveal, or selection behavior after the new Browser-owned multi-graph viewer composition rule

Locked Phase 7 direction:
- treat Browser build policy as the source of truth for whether a graph's output should be rendered
- treat viewer reveal, highlight, and selection state as presentation behavior layered on top of that rendered set, not as ownership of what is loaded
- keep any `ConsoleDock` touch narrow and defer broader Browser-to-Console or Console-to-Spaghetti sync cleanup into `Phase 9`

First landed `Phase 7` slice:
- graph-row `Reveal` now acts as a presentation-layer frame command over the currently rendered graph parts instead of pretending to retarget the loaded viewer owner
- reveal is no longer disabled just because shared viewer composition is active; it remains useful as long as the graph is still Browser-enabled
- the next remaining `Phase 7` carry is the rest of the Browser, viewer, and narrow `ConsoleDock` hide-show or reveal-sync behavior that could still drift after this first slice

### Phase 7 - Fix Runtime Object Reparenting Loss On Browser Policy Sync

#### Summary
Fix the bug where a graph-published object or component that the user has moved under an authored assembly/component snaps back to a graph/root-owned location when Browser build policy changes trigger `syncCurrentProjectFromSpaghetti()`.

The implementation should separate:
- **content-tree placement**: user-authored parent assembly/component
- **runtime provenance**: `ownerGraphDocumentId`, `sourceGraphDocumentId`, output/slot identity
- **effective build policy**: self override, then parent component, then parent assembly, then graph fallback

This fix should preserve the current visibility/suppression model unless explicitly changed later: a suppressed graph output may still disappear, but when it comes back it must return to the same parent container.

#### Key Changes
- Add a small persisted placement overlay for runtime-backed Browser content, keyed by stable row id/object id/component id.
  - Store `parentAssemblyId` and `parentComponentId`.
  - Update this overlay whenever `moveProjectContentOwner()` reparents a runtime-backed object/component.
  - Keep it outside transient `projectContent` rebuild output so policy-driven suppression does not erase placement history.

- Update `buildProjectContentState(...)` to reapply preserved placement when recreating:
  - published objects
  - published components
  - receive-link objects
  - Use runtime/source data for provenance and labels, but placement from the preserved overlay when present.
  - Fall back to current root/default placement only when no preserved placement exists.

- Recompute container membership from resolved parentage after all rows are rebuilt.
  - Build `assembly.childRowIds` from actual current children, not just “all runtime rows at root + authored components”.
  - Build `component.childObjectIds` from object `parentComponentId`, so moved objects stay in their adopted component.
  - Preserve authored assemblies as today, but allow runtime children to live under them if placement says so.

- Keep Browser policy inheritance behavior aligned with current UI semantics.
  - Object effective policy remains `self > parent component > parent assembly > graph > default`.
  - Component effective policy remains `self > parent assembly > graph > default`.
  - Graph ownership remains provenance/build ownership, not placement ownership.

- Add overlay cleanup rules.
  - Remove preserved placement entries when the underlying graph document is removed permanently.
  - Remove entries when the runtime row identity no longer exists due to actual source deletion, not just temporary suppression.
  - Do not clear entries on `off`/`release` toggles alone.

#### Test Plan
- Add a regression test where a published object is moved into an authored component, then an assembly Browser build policy is toggled through `release` and `off`; the object must keep the same parent and must not jump back to root or another assembly.
- Add a regression test where a published object is moved under an authored assembly, then `syncCurrentProjectFromSpaghetti()` runs from Browser policy changes; rebuilt `projectContent` must preserve `parentAssemblyId`/`parentComponentId`.
- Add a regression test where a moved runtime-backed object disappears because its graph is `off`, then returns when re-enabled; it must come back under the same adopted parent.
- Add a regression test for moved published components as well as loose published objects.
- Keep an assertion that explicit object policy still overrides inherited parent policy after the move.
- Keep existing Browser graph suppression tests passing so this fix does not silently change the current “off hides graph output” contract.

#### Assumptions
- This fix does **not** introduce unresolved placeholder rows for suppressed graph output; it preserves placement only.
- Runtime-backed content may still be hidden when its effective execution policy is `off`; the key change is that parentage survives and is restored correctly.
- The object/component is treated as a child of its content-tree parent for placement and policy inheritance, while the graph remains the source/provenance owner.
- No user-facing API changes are required; this is an internal state-model correction in the app store and Browser content rebuild path.


## [x] Phase 8 - Build Failure Triage And Blocking Fixes
### Header

Purpose:
- clear the `npm run build` failure cluster in responsible chunks after the main multi-graph behavior seam is understood, without letting unrelated typed cleanup hide the actual parity bug

Main work:
- classify the live build failures into parity-blocking, parity-adjacent, and unrelated groups
- fix the blocking or clearly adjacent build failures in a stable order instead of treating the whole error wall as one task
- turn any still-unrelated compile failures into explicit carry notes instead of leaving them mixed into the parity execution track
- keep this phase disciplined as build-triage work only, not as a hidden Browser or viewer architecture rewrite

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspaceSlots.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/workspace/workspaceSurfaceActions.test.ts`
- this phase doc

Done shape:
- the current `npm run build` failure set is either green or reduced to a clearly documented non-`7.5-5` carry set
- the parity implementation no longer sits on top of known build breakage in the same touched surface area
- only supporting seam hardening and final confidence remain

Phase 8 execution order:
1. Run `npm run build` and group the errors into:
   - parity-blocking
   - parity-adjacent
   - unrelated
2. Fix the smallest parity-blocking host, viewer, Browser, or workspace typing errors first so the active `7.5-5` seam compiles cleanly.
3. Re-run `npm run build` after each cluster instead of banking a large typed cleanup wall.
4. If a remaining error cluster is clearly not needed for `7.5-5`, record it explicitly and stop widening this phase.

### Phase 8 Checklist

- [x] Run and classify the live `npm run build` failures into parity-blocking, parity-adjacent, and unrelated groups
- [x] Fix the blocking or clearly adjacent typed host-surface failures in a stable smallest-first order
- [x] Re-run `npm run build` after each cleanup slice until the active `7.5-5` area is green or the remaining failures are proven unrelated
- [x] Turn any remaining unrelated failure cluster into an explicit follow-on carry note instead of leaving it implied

### Phase 8 Verification Shape

Minimum verification for `Phase 8` should cover:
- `npm run build` passing for the touched `Workspace 7.5-5` surface area, ideally fully green repo-wide
- the parity or output-ownership fixes still compiling cleanly after the typed cleanup
- any remaining failure set being explicit enough that it can be moved to a separate task without hiding inside `7.5-5`

Shipped result:
- `npm run build` is green repo-wide after the `useWorkspaceStore` typing seam was corrected and the remaining host-shell residue was cleaned up.
- Focused workspace-shell verification is also green across `useWorkspaceStore`, `AppShell`, `BrowserDockHost`, `SpaghettiWindowHost`, and `ConsoleDock`.

## [x] Phase 9 - Supporting Refactor And Ownership Hardening
### Header

Purpose:
- shrink the remaining ownership and helper complexity after the bug fixes and build cleanup are in place so the next workspace work does not have to rediscover the same hidden seams

Main work:
- extract or normalize the helper seams that proved too tangled while landing the multi-surface and multi-graph fixes
- reduce compatibility-only branches, repeated ownership lookups, and ambiguous host-vs-store responsibility where the earlier phases showed they are still drift-prone
- keep this phase on directly justified seam hardening rather than widening into an unrelated architecture rewrite
- tighten `ConsoleDock` and `Spaghetti Editor` context-sync helpers where the earlier parity fixes still leave them feeling more loosely coupled or indirect than they should be
- unify Browser content, project-content ownership, and shared viewer composition behind one clearer rendered project-parts truth so later fixes do not keep bouncing between preview state, runtime state, and Browser projection

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- this phase doc

Done shape:
- the main ownership seams touched by `Workspace 7.5-5` are easier to read and less likely to regress
- helper boundaries between store, host, Browser, and viewer identity are clearer than they were during the bug-fix slices
- shared model-viewer composition no longer has to guess between preview truth, runtime truth, and Browser projection truth for the same rendered object set
- only final confidence and explicit documentation residue remain

Locked direction for `Phase 9`:
- do not try to land all supporting cleanup in one refactor pass
- make one canonical rendered project-parts seam first because that is the highest-value repeated ambiguity left after `Phases 5` through `8`
- keep `ConsoleDock` plus `Spaghetti Editor` sync cleanup as a second narrow pass on top of that clearer rendered-truth seam
- leave broad host-helper cleanup as a reserve third cut only if the first two slices still leave directly justified residue

Current read after the shipped `Phase 9A` slice:
- `useAppStore` now owns a canonical `selectRenderedProjectPartSet(...)` seam for current-project rendered parts, and both Browser content rows plus shared `ViewerHost` composition now consume it
- shared model-viewer rendering no longer gets to run ahead of current project-content adoption just because graph runtime already has build output
- the next real follow-on is now `Phase 9B`, where `ConsoleDock` plus `Spaghetti Editor` context handoff can tighten against this clearer rendered ownership model instead of layering on more local exceptions

Current read after the shipped `Phase 9B` slice:
- `ConsoleDock` now resolves graph-root, graph-canvas, object-zoom, multi-select zoom, and reference zoom context through narrower shared graph and viewport fallback helpers instead of letting each command branch rebuild a different active-editor-biased chain
- surface-driven console context sync now aligns `Spaghetti Editor` graph focus more deliberately to the graph implied by the selected workspace target or staged session when multiple editor viewports are open
- the remaining `Phase 9` work is no longer generic reserve cleanup; the next justified seam is that `Output Preview` still implies graph-local component or object ownership even after Browser has already reorganized the same published content
- the narrow follow-on is therefore `Phase 9C`, where preview should read adopted Browser or project-content ownership first instead of presenting a second authoritative tree for the same objects and components

Current read after the shipped `Phase 9C` slice:
- Browser-facing current-project content no longer trusts stale published-component membership snapshots after a move; component rows now derive their object membership from actual object parentage first
- empty runtime-backed published-component shells now disappear once Browser truth has moved all of their published objects elsewhere, so the old graph-default grouping no longer survives as a misleading duplicate ownership story
- top-level authored assemblies no longer get mirrored into the runtime root assembly during project-content rebuild, which was one of the remaining ways Browser could replay reorganized content as if it had been copied after a later Spaghetti sync
- Browser tree ordering now self-heals duplicate child ids instead of replaying the same adopted assembly, component, or object row several times when saved Browser order drifted
- the bigger future idea that `Output Preview` itself should become a real assembly or component authoring surface remains intentionally deferred outside `Workspace 7.5-5`

Focused code-backed read for `Phase 9B`:
- `ConsoleDock` still owns several local compatibility-shaped context resolvers, especially `resolveSelectedObjectPartKeyForZoom(...)`, `resolveSelectionSetForZoom(...)`, `resolveSelectedReferenceIdForZoom(...)`, `resolveEditorViewportIdForGraphDocument(...)`, and `ensureSpaghettiEditorVisibleForGraphRoot(...)`
- those helpers currently mix `selectedPartKey`, `workspaceSelection.selectedTarget`, `workspaceSelection.explicitSelectedTargets`, `workspaceSelection.resolvedContentSelection`, `activeGraphDocumentId`, `activeEditorViewportId`, and global `selectedNodeId` in slightly different ways depending on the command path
- the highest-risk remaining drift is no longer Browser or viewer identity; it is that `ConsoleDock` can still fall back to ambient active-editor or active-graph truth when the staged session or selected workspace target already names a more precise graph, object, or viewport
- the safest next cut is therefore a narrow context-resolution consolidation, not a command redesign and not a broad host rewrite

Phase 9 should execute in these responsible chunks:

#### [x] Phase 9A - Canonical Rendered Project Parts Truth
- create one clearer selector or helper seam that answers which rendered project parts currently exist, are viewer-addressable, and are Browser-visible
- make Browser content and shared viewer composition consume that same rendered-project-parts truth instead of deriving overlapping answers from separate runtime, preview, and projection layers
- keep this cut focused on the selector and consumer seam, not on general host cleanup

#### [x] Phase 9B - `ConsoleDock` And `Spaghetti Editor` Context Sync Hardening
- tighten the selected-target, graph-focus, and viewer-selected-object handoff so console navigation is reading from the same deliberate ownership model instead of compatibility-shaped fallback chains
- keep this cut behavior-preserving where possible and avoid widening it into command UX redesign
- use the clearer rendered-project-parts seam from `Phase 9A` instead of adding new local viewer-or-Browser exceptions

Locked direction for `Phase 9B`:
- do not redesign console commands, staged navigation shape, or radio-command identity
- keep the change centered on one small helper or selector seam that resolves the console workspace context for graph, object, and reference actions
- route existing zoom, graph-root reveal, and object-selection flows through that seam instead of letting each branch rebuild its own fallback chain
- prefer per-viewport graph selection helpers from `useSpaghettiStore` over ambient global `selectedNodeId` or `activeGraphDocumentId` when a concrete graph or viewport is already known

Likely `Phase 9B` files:
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`

Highest-signal `Phase 9B` seams:
- `src/app/console/ConsoleDock.tsx`
  - `ensureSpaghettiEditorVisibleForGraphRoot(...)`
  - `resolveSelectedObjectPartKeyForZoom(...)`
  - `resolveSelectionSetForZoom(...)`
  - `resolveSelectedReferenceIdForZoom(...)`
  - `resolveEditorViewportIdForGraphDocument(...)`
  - `executeCanvasZoomAction(...)`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `selectEditorViewportSelectedNodeId(...)`
  - `selectEditorViewportById(...)`
  - `selectViewerTargetGraphDocumentId(...)`
- `src/app/store/useAppStore.ts`
  - `selectRenderedProjectPartSet(...)`
  - workspace-selection selectors and content-selection helpers already feeding Browser and viewer ownership

Concrete `Phase 9B` implementation cut:
1. Lock the smallest helper seam that resolves the console action context for the currently selected graph, object, reference, and editor viewport.
2. Move object zoom and multi-select zoom to that seam so object part-key and selection-set resolution stop rebuilding ad-hoc fallback chains inside `ConsoleDock`.
3. Move graph-root reveal and graph canvas zoom onto that same seam so they use the selected or staged graph and the resolved editor viewport, not only ambient `activeGraphDocumentId`.
4. When a graph canvas object action needs a node, use the resolved viewport-scoped node-selection selector instead of the global `selectedNodeId` fallback.
5. Keep every command label and user-facing console flow behaviorally equivalent unless a stale fallback was provably wrong.

#### [x] Phase 9C - `Output Preview` Ownership Alignment
- make `Output Preview` read adopted Browser or project-content ownership first for published objects and components instead of implying a second graph-local authoritative tree
- keep this cut narrow and read-oriented: align preview presentation with Browser truth without turning `Output Preview` into a full project organizer
- use Browser or project-content parentage as the canonical answer for where a published object currently lives once the user has reorganized it

Locked direction for `Phase 9C`:
- do not make `Output Preview` a full assemblies/components/objects authoring surface inside `Workspace 7.5-5`
- keep `Output Preview` responsible for graph provenance, published slot or output identity, and default fallback structure only when no adopted Browser mapping exists yet
- make Browser or project content responsible for real assembly or component placement, parentage, and effective inherited build policy
- stop `Output Preview` from implying `Object 1 -> Component 1` as authoritative after Browser has already moved that same published object under `Component 2` or `Component 3`

Likely `Phase 9C` files:
- `src/app/spaghetti/system/outputPreviewNode.ts`
- `src/app/spaghetti/outputSurface.ts`
- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/app/spaghetti/system/outputPreviewNode.test.ts`
- `src/app/store/useAppStore.test.ts`

Highest-signal `Phase 9C` seams:
- `src/app/spaghetti/system/outputPreviewNode.ts`
  - default object and component identity
  - preview tree row shaping
  - any current graph-local component or object parent claims
- `src/app/spaghetti/outputSurface.ts`
  - published output projection into Browser or project-content adoption
- `src/app/store/useAppStore.ts`
  - adopted project-content objects and components
  - preserved parentage and Browser-owned placement truth
  - selectors that can map graph provenance back onto adopted Browser rows
- `src/app/components/ViewerHost.tsx`
  - keep rendered composition on the same adopted Browser truth instead of preview-local ownership hints

Concrete `Phase 9C` implementation cut:
1. Lock the smallest selector or helper seam that maps a graph-published preview object or component back to an adopted Browser or project-content row when one exists.
2. Update `Output Preview` tree shaping so adopted Browser parentage wins over graph-local default component placement.
3. Keep graph-local default preview structure only for outputs that have not yet been adopted into current project content.
4. Make sure preview rendering and selection metadata point at the adopted Browser object or component identity instead of inventing a duplicate preview-owned tree row for the same published content.
5. Preserve graph provenance fields so future preview authoring work can still know where the published content came from.

Out of scope for `Phase 9C`:
- creating, deleting, or reparenting assemblies and components directly from `Output Preview`
- turning `Output Preview` into a second Browser
- broader product UX for managing project organization from inside preview

Deferred follow-on after `Workspace 7.5-5`:
- if we still want `Output Preview` to author assemblies, components, and object placement directly, that should become a separate future phase after this one closes instead of being smuggled into `9C`

Phase 9 execution order:
1. Define and land the smallest useful rendered-project-parts selector or helper seam.
2. Move shared viewer composition and Browser-facing rendered-content consumers onto that seam.
3. Re-verify that multi-graph output, Browser visibility, and graph build-policy behavior still match the shipped Phase 7 and 8 behavior.
4. Only then tighten `ConsoleDock` and `Spaghetti Editor` context handoff around the now-clearer ownership model.
5. Then align `Output Preview` so it reads adopted Browser ownership truth instead of implying a second authoritative tree for reorganized published content.
6. Any broader `Output Preview` authoring or organizer product work should move to a later follow-on phase after `Workspace 7.5-5`.

### Phase 9 Checklist

- [x] Lock the exact smallest selector or helper seam that should become the canonical rendered project-parts truth
- [x] Land `Phase 9A` first and make Browser plus shared viewer consume that same rendered-project-parts seam
- [x] Re-verify shipped multi-graph, Browser-visibility, and build-policy behavior before widening into any second cleanup slice
- [x] Lock the exact small `ConsoleDock` context-resolution seam for `Phase 9B` instead of treating the remaining drift as a broad console rewrite
- [x] Land `Phase 9B` as a narrow `ConsoleDock` plus `Spaghetti Editor` context-handoff hardening pass only after `Phase 9A` is stable
- [x] Keep helper extraction or type cleanup tied to proven pain points from the shipped parity work instead of using `Phase 9` as a broad architecture rewrite
- [x] Lock the exact small `Output Preview` ownership-alignment seam for `Phase 9C` instead of treating the remaining preview drift as a broad feature rewrite
- [x] Land `Phase 9C` as a narrow “Preview reads Browser truth first” pass without turning preview into a second Browser
- [x] Push any bigger `Output Preview` authoring or organizer ambition into a later follow-on phase instead of widening `Workspace 7.5-5`
- [x] Leave the repo in a state where later workspace or Browser work does not need to untangle the same ownership path again

### Phase 9 Verification Shape

Minimum verification for `Phase 9` should cover:
- the touched ownership helpers staying behaviorally equivalent after refactor
- the earlier multi-surface, multi-graph, and build-fix gains staying green after seam hardening
- Browser content and shared viewer composition now agreeing about what rendered project objects exist without needing separate bug-fix logic at each layer
- the remaining surface area reading as deliberate structure instead of emergency carry cleanup

Focused verification target for `Phase 9B`:
- Browser-selected object targets still sync into object scope and keep object-local console summary truth when the selected object changes
- object-local zoom still works when `selectedPartKey` is null by resolving through the current workspace selection and the shipped rendered-project-parts seam
- graph-root or graph-canvas actions open or focus the correct graph editor based on the selected or staged graph, not only the ambient active graph
- graph canvas object zoom uses the resolved viewport-scoped selected node for that graph instead of the global active-editor node fallback
- existing `ConsoleDock` regressions around selected-object context and browser-to-console sync remain green without needing new Browser- or viewer-only exceptions

Focused verification target for `Phase 9C`:
- when the user moves a published object from Browser into `Component 2` or `Component 3`, `Output Preview` no longer shows that object as if it still lives under the old graph-local default component
- reorganized published objects and components do not appear duplicated between Browser truth and preview-local default tree shaping
- outputs with no adopted Browser mapping yet still show a sensible fallback preview structure so unadopted graphs remain understandable
- viewer selection, Browser selection, and preview selection for the same published object all point at the same adopted project identity once that object has been reorganized in Browser

Implementation-ready read:
- `Phase 9A` is now shipped and should be treated as the canonical rendered-truth baseline for the rest of this phase.
- `Phase 9B` is now shipped as the narrow console-context resolution follow-on over the locked helper seams above.
- `Phase 9C` is now shipped as the narrow `Output Preview` ownership-alignment follow-on over the stale published-component seam.
- broader `Output Preview` authoring or organizer work is explicitly deferred to a later phase after `Workspace 7.5-5`.

## [x] Phase 10 - Final Confidence And Close-Out
### Header

Purpose:
- finish `Workspace 7.5-5` cleanly after the floating-shell, runtime-isolation, Browser/viewer ownership, build-green, and supporting hardening slices are now materially landed

Main work:
- run one honest final confidence sweep across the now-shipped multi-surface and multi-graph behavior
- allow at most one last narrow residue fix if the confidence sweep still finds a real bug-shaped seam
- document what is intentionally deferred so `Workspace 7.5-5` can close without pretending it solved later product work

Likely files:
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`
- this phase doc

Done shape:
- `Workspace 7.5-5` reads as honestly closed, with only explicitly deferred future work left open
- multi-surface `Spaghetti Editor` behavior and multi-graph Browser/output behavior are stable enough that later UX work does not need to rediscover hidden ownership seams
- any remaining residue is either fixed now as one narrow final slice or documented as intentional follow-on work instead of being left vague

### Phase 10 Checklist

- [x] Run the final manual confidence sweep across multi-surface editor behavior, Browser organization, and multi-graph output coexistence
- [x] Re-run the highest-signal focused automated checks that cover the shipped `Phase 7` through `Phase 9C` seams
- [x] Fix at most one last narrow residue bug only if the confidence sweep still proves a real issue
- [x] Record any intentionally deferred follow-on work instead of widening this phase into another general cleanup pass
- [x] Mark `Workspace 7.5-5` fully closed only when the confidence read matches the shipped behavior and the remaining deferred work is explicit

### Phase 10 Verification Shape

Minimum verification for `Phase 10` should cover:
- several editor surfaces coexisting across floating, slotted, meatball, and popped-out host modes without stale ownership side effects
- close, popout, dock-back, split, and restore behavior all staying attached to the targeted editor surface instance
- separate graph documents keeping distinct output objects alive without Browser visibility aliasing
- Browser-owned organization surviving editor reopen, graph rebuild, and policy toggles without duplicated assemblies, components, or objects
- the remaining multi-editor shell and multi-graph runtime model being explicit enough that later UX work does not need to rediscover hidden ownership seams

Focused manual confidence sweep:
1. Keep two editor surfaces open on different graph documents, then switch focus, split, float, redock, and close one without disturbing the other.
2. Keep two graphs publishing objects with overlapping output slot names and confirm Browser plus viewer still show them as distinct objects.
3. Move graph-published objects into authored Browser components and assemblies, reopen or refocus the editor, and confirm Browser does not recreate copied rows.
4. Toggle Browser build policy through `live`, `release`, `manual`, and `off` for graphs and adopted content, then confirm objects hide or return without teleporting or duplicating.
5. Use Browser `Reveal`, selection, and viewer highlight on multiple graph outputs and confirm these presentation actions do not change ownership or loaded-graph truth.

Focused automated confidence target:
- `src/app/AppShell.test.tsx`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/components/ViewerHost.test.tsx`
- `src/app/store/useAppStore.test.ts`

Locked residue gate:
- if the confidence sweep is clean, close `Workspace 7.5-5` without inventing more cleanup
- if one last bug appears, only fix it here if it is a narrow, clearly related residue seam
- if the next issue is broader than one narrow residue fix, stop and spin it into a new future phase instead of widening `Phase 10`

Explicit deferred work after close:
- the larger AppShell architecture refactor stays out of `Workspace 7.5-5`
- any future `Output Preview` authoring or organizer UX stays out of `Workspace 7.5-5`
- any broader Browser/Console/AppShell product cleanup that is no longer directly bug-shaped should become its own later phase

Closed read:
- user confidence on 2026-04-30 confirmed the core goal is met: two `Spaghetti Editor` surfaces can stay open together
- the existing changelog entries `[842]` through `[858]` provide the implementation and verification trail for the shipped slices through `Phase 9C`
- no new implementation was required for this closeout pass; the remaining work was documentation state reconciliation and moving the completed record into `Shipped/`

### Phase 1 Checklist

- [x] Repoint `SpaghettiWindowHost` titlebar actions away from active-editor-only targeting
- [x] Repoint `AppShell` floating split-menu actions away from active-editor-only targeting
- [x] Keep `activeEditorViewportId` as focus truth without using it as the fallback shell owner for the clicked action
- [x] Add focused regressions for per-surface split, popout or dock-back, and close targeting

### Phase 1 Verification Shape

Minimum verification for `Phase 1` should cover:
- clicking split on one editor surface affects that surface, not whichever editor is globally active
- clicking popout or dock-back on one editor surface affects that surface
- clicking close on one editor surface closes that surface only
- floating split-menu actions operate on the intended editor surface instance

### Phase 2 Checklist

- [x] Verify that opening or duplicating another editor surface keeps both surfaces alive with distinct host-mode state
- [x] Re-check `closeEditorViewport(...)` fallback so closing one editor does not collapse another editor's shell ownership
- [x] Re-check popout dock-back and `separateWindow` restore behavior with several live editor surfaces
- [x] Re-check hydration or restore behavior so several editor surfaces come back as distinct surfaces instead of one active-owner shell
- [x] Verify focused regressions for close, fallback, popout dock-back, and restore behavior with multiple editor surfaces

### Phase 2 Verification Shape

Minimum verification for `Phase 2` should cover:
- two editor surfaces staying alive at the same time
- closing one editor while another remains open
- a popped-out editor docking back while another editor stays alive in-app
- slotted and floating editor surfaces coexisting without stale ownership bleed
- restore behavior that keeps several editor surfaces distinct after hydration
