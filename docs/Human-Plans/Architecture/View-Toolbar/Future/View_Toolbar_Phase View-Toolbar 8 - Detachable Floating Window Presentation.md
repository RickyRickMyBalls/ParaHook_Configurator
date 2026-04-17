# `View-Toolbar 8` - `Detachable Floating Window Presentation`

## Doc Header

### Doc History
24. 2026-04-17 15:04:48: Added `View-Toolbar 8 / Phase 6 - Shared Floating Shell Resize Parity` as the next explicit follow-on after the shipped `Phase 5` polish pass, capturing that all-edge and corner resize currently lives only inside `ViewToolbar.tsx` and planning the honest widening step that extends the same resize affordance to the other real floating shell users instead of pretending the existing resize logic is already shared
23. 2026-04-17 14:59:15: Implemented `View-Toolbar 8 / Phase 5 - Floating Shell Chrome Theme Parity And Quick-Dock Styling` by introducing one shared floating-shell quick-dock icon button plus explicit header-action theme rules, replacing the visible floating `Quick Dock` text label with an accessible dock icon, widening the shared owner across the real floating shell users in `ViewToolbar`, `DashboardWindowHost`, `NotepadWindowHost`, and detached viewer floating windows, and adding focused toolbar plus app-shell proof without reopening floating-window behavior work
22. 2026-04-17 14:52:50: Prepped `View-Toolbar 8 / Phase 5 - Floating Shell Chrome Theme Parity And Quick-Dock Styling` for implementation by grounding the polish cut in the live floating `ViewToolbar` header-action seam, the current `.V15Panel button` theme limitation, the neighboring `DashboardWindowHost` floating-shell pattern, and the need to replace the visible `Quick Dock` text label with a compact dock icon without reopening floating-window behavior work
21. 2026-04-17 14:51:06: Refined `View-Toolbar 8 / Phase 5 - Floating Shell Chrome Theme Parity And Quick-Dock Styling` so the polish lane now also explicitly owns replacing the floating `Quick Dock` text label with a dock icon affordance, keeping the shell-chrome decision aligned with the same likely shared floating-header action owner
20. 2026-04-17 14:48:12: Added `View-Toolbar 8 / Phase 5 - Floating Shell Chrome Theme Parity And Quick-Dock Styling` as a follow-on polish lane after the detachable floating-window implementation closed, capturing the dark-theme mismatch on the floating `Quick Dock` button, the fact that the header action sits outside `.V15Panel` button styling, and the likelihood that the same shell-chrome issue also exists in `DashboardWindowHost`
19. 2026-04-17 14:43:47: Implemented `View-Toolbar 8 / Phase 4 - Persistence, Multi-Viewport Proof, And Cleanup` by widening the final proof surfaces instead of widening the feature set, adding focused multi-viewport toolbar proof plus representative workspace round-trip proof that the shipped floating-toolbar contract stays viewport-local, survives persistence honestly, and lets one viewport quick-dock without disturbing another
18. 2026-04-17 14:40:11: Prepped `View-Toolbar 8 / Phase 4 - Persistence, Multi-Viewport Proof, And Cleanup` for implementation by expanding the final pass into the full summary-plus-spec shape, grounding it in the shipped floating host-mode, drag, resize, and context-menu seams plus the existing viewport-local persistence path and focused toolbar or workspace proof surfaces while keeping the lane honest as a proof-and-cleanup pass instead of a hidden feature widening
17. 2026-04-17 14:38:28: Implemented `View-Toolbar 8 / Phase 3.2 - Floating Shell Context Menu Parity` by reusing the existing view-toolbar context-menu owner seam in the floating shell, keeping menu anchoring on the shared local coordinate path, preserving interactive-control guards so shell-level right-click does not steal button behavior, and adding focused proof that floating right-click parity lands without disturbing drag, resize, or quick-dock behavior
16. 2026-04-17 14:31:00: Prepped `View-Toolbar 8 / Phase 3.2 - Floating Shell Context Menu Parity` for implementation by grounding the right-click parity cut in the existing docked shell context-menu owner seam, the floating-window host surface, the shared `openViewToolbarContextMenu(...)` coordinate path, and the focused `ViewToolbar.test.tsx` proof surface while keeping persistence and multi-viewport cleanup deferred to `Phase 4`
15. 2026-04-17 14:20:38: Added `View-Toolbar 8 / Phase 3.2 - Floating Shell Context Menu Parity` as the next explicit follow-on after the shipped resize cut so the floating `View` toolbar can expose the same right-click presentation menu and shell-level context behavior as the docked toolbar before the later persistence and multi-viewport cleanup lane
14. 2026-04-17 14:16:24: Implemented `View-Toolbar 8 / Phase 3.1 - Floating Resize Handles, Clamp, And Minimums` by adding floating-shell resize handles on all sides and corners, keeping resize geometry on the same viewport-local `viewToolbarFloatingRect` path as drag, enforcing viewport clamp and minimum size rules, and adding focused proof that resize, drag, and quick-dock all stay live before the later persistence and multi-viewport cleanup pass
13. 2026-04-17 14:10:52: Prepped `View-Toolbar 8 / Phase 3.1 - Floating Resize Handles, Clamp, And Minimums` for implementation by grounding the resize cut in the shipped floating-shell wrapper, the existing viewport-local `viewToolbarFloatingRect` geometry path, the current viewport-host clamp seam, and the focused `ViewToolbar.test.tsx` proof surface while keeping persistence and multi-viewport cleanup deferred to `Phase 4`
12. 2026-04-17 14:08:37: Added `View-Toolbar 8 / Phase 3.1 - Floating Resize Handles, Clamp, And Minimums` as the next explicit follow-on after the shipped floating-shell cut, separating all-side and corner resize work from later persistence and multi-viewport cleanup so the next implementation slice stays viewport-local, rect-driven, and small enough to land cleanly
11. 2026-04-17 14:03:04: Implemented `View-Toolbar 8 / Phase 3 - Floating Shell, Drag, Clamp, And Quick Dock` by letting the docked `View` toolbar drag out into one viewport-local floating shell, reusing the shared `ViewToolbarBody` content tree, clamping drag movement to the owning viewport host, and adding quick-dock return behavior plus focused toolbar proof for floating render, drag, clamp, and dock return
10. 2026-04-17 13:40:53: Prepped `View-Toolbar 8 / Phase 3 - Floating Shell, Drag, Clamp, And Quick Dock` for implementation by grounding the next cut in the newly shared `ViewToolbarBody` seam, the viewport-owned `ViewportWorkspaceHost` mount path, the current viewport-local host-mode and floating-rect state, and the live `DashboardWindowHost.tsx` drag-and-clamp pattern while keeping multi-viewport persistence proof deferred to `Phase 4`
9. 2026-04-17 13:31:07: Implemented `View-Toolbar 8 / Phase 2 - Shared Toolbar Body Extraction` by extracting one shared `ViewToolbarBody` plus per-section wrapper seam inside `ViewToolbar.tsx`, keeping the docked shell as the owner of refs, height-sync, and context-menu behavior, and adding focused classic-mode proof so the shared body is now ready for the floating-shell work deferred to `Phase 3`
8. 2026-04-17 13:26:44: Prepped `View-Toolbar 8 / Phase 2 - Shared Toolbar Body Extraction` for implementation by grounding the next cut in the live `ViewToolbar.tsx` shell-plus-body mix, the current section-definition array, the tabs/classic section-wrapper duplication, the scroll-height shell refs, and the focused `ViewToolbar.test.tsx` proof seams while keeping floating-shell rendering deferred to `Phase 3`
7. 2026-04-17 13:08:26: Implemented `View-Toolbar 8 / Phase 1 - Viewport-Local Host Mode And Floating Rect Groundwork` by adding viewport-local `viewToolbarHostMode` and `viewToolbarFloatingRect` state, extending the existing viewport-chrome persistence path to serialize and normalize those fields safely, and adding focused workspace-store proof that the new groundwork stays per-viewport and round-trips without changing the visible docked toolbar shell
6. 2026-04-17 12:51:49: Prepped `View-Toolbar 8 / Phase 1 - Viewport-Local Host Mode And Floating Rect Groundwork` for implementation by grounding the first cut in the live viewport-local workspace state, persistence normalization, `setViewportLocalViewState(...)` mutation path, current `ViewToolbar` shell read, and focused workspace-store plus persistence proof seams while keeping visible floating-shell UI deferred to later phases
5. 2026-04-17 12:45:06: Refined `## Wishlist Organization` again so it now separates the user-provided wishlist into one `### High Level Goals` block, removes the redundant `implementation target` lines, and lets each phase checklist explicitly mark which `HLG` items it advances
4. 2026-04-17 12:39:05: Reworked this doc again to match the stronger shipped `Import-3` planning shape, renaming the wishlist section to `## Wishlist Organization`, converting wishlist ownership into phase-local `- [ ]` checklist items plus `implementation target` notes, and rewriting every top-level phase heading into the `[ ]` family-phase title format
3. 2026-04-17 12:30:36: Reworked the `## Wishlist Tracking` section into the newer simpler phase-first format so the doc now lists `### Phase N` entries there and marks which user-provided wishlist items each phase achieves instead of organizing the tracking block by wishlist item first
2. 2026-04-17 12:30:36: Reworked this phase doc to follow the newer architecture setup format, adding the required top-level `## Wishlist Tracking` section, rewriting the plan into top-level `## Phase 1` through `## Phase 4` slices, and aligning the wishlist coverage directly to the user-provided goals instead of keeping the ladder only as an internal section inside `Doc Body`
1. 2026-04-17 11:58:05: Created this standalone future phase doc for `View-Toolbar 8`, giving drag-out floating toolbar presentation a dedicated planning home grounded in the current viewport-local `ViewToolbar` shell, the existing workspace floating-window template, and the rule that shell placement must widen through shared workspace host patterns instead of a toolbar-only drag hack

### Purpose

This doc locks the eighth `View-Toolbar` phase.

Use it to answer:
- how the `View` toolbar should detach from its docked position into one floating window
- which state should stay viewport-local versus shared workspace shell state
- how to reuse the repo's current floating-window templates without promoting the toolbar into the wrong family
- how docked and floating presentations should share one command body
- which small real phases should land one by one

### Why This Phase Exists

The current `View` toolbar already has:
- viewport-local presentation state
- viewport-local dock state
- one shared body for `Classic` versus `Tabs`
- one top-right dock relationship with the axis widget and HUD

What it does not yet have is a way to leave that dock and behave like a draggable floating window.

That capability fits the repo direction, but only if it stays honest about ownership:
- the toolbar still belongs to one model viewport
- shell placement still belongs to shared workspace hosting patterns
- command meaning must stay identical whether the toolbar is docked or floating

### Scope

This phase covers:
- a viewport-local `docked` versus `floating` host-mode seam for the `View` toolbar
- persisted floating-window rect state for the toolbar
- a draggable floating titlebar and quick-dock path
- reuse of one shared toolbar body across docked and floating presentations
- clamp and collision guidance for a floating toolbar that still belongs to one viewport

This phase does not cover:
- promoting the toolbar into a full `WorkspaceSurfaceKind`
- viewport-slot split, float, or popout menu entries for the toolbar
- command or section behavior changes inside the toolbar body
- a second global toolbar not attached to a viewport
- toolbar popout into a browser window

## Doc Body

### Goal

Let the `View` toolbar drag out of its docked top-right home and behave like one floating window for the active viewport without forking command ownership.

### Boundaries

This phase should:
- keep the docked toolbar as the default and honest fallback
- keep the floating toolbar attached to its owning viewport
- reuse workspace floating-window patterns where that helps
- stop before widening into slot menus, split behavior, or popout support

This phase should not:
- turn the toolbar into a peer workspace surface like `Browser` or `Console`
- overload `viewToolbarDockMode` with floating semantics
- duplicate the toolbar body into separate docked and floating command trees

### Architecture Direction

The right architectural read for this phase is:
- `View-Toolbar` owns the content and control meaning
- `Workspace-Modes` lends the floating shell pattern
- the toolbar remains viewport-local chrome for one model viewport

Suggested state shape:
- `viewToolbarHostMode: 'docked' | 'floating'`
- `viewToolbarDockMode: 'below-axis' | 'top-right-cluster'`
- `viewToolbarFloatingRect: WorkspaceFloatingRect | null`

Important rule:
- keep host mode separate from dock mode

### Current Live Read

Current viewport owner seam:
- [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx)
  - mounts `ViewportOverlay` and `ViewToolbar` together under one viewport host
  - already gives the toolbar a concrete `viewportId` owner

Current toolbar shell and body seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - still owns both the docked shell and the toolbar body
  - already persists viewport-local `Presentation`, `Dock`, and active-tab state

Current viewport-local state seam:
- [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts)
  - `WorkspaceViewportLocalViewState` already owns:
    - `viewToolbarOpen`
    - `viewToolbarExpandedPresentationMode`
    - `viewToolbarDockMode`
    - `viewToolbarActiveTab`
    - axis-widget sizes
  - does not yet own toolbar host mode or floating rect

Current persistence seam:
- [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts)
  - already normalizes and persists the existing toolbar-local viewport state

Current reusable floating shell reference:
- [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx)
  - already demonstrates:
    - one floating rect per detached surface
    - drag-titlebar behavior
    - viewport-relative clamp logic
    - quick-dock actions

### Acceptance Read

This phase is healthy when:
- the toolbar can be docked or floating per viewport
- the floating toolbar still belongs to the viewport that spawned it
- the same body renders in both host modes
- the floating window can be dragged around the viewport safely
- the persisted rect and host mode survive workspace round-trips
- the phase does not widen into a false workspace-surface migration

## Wishlist Organization

### High Level Goals

- [x] `HLG 1. Drag View Toolbar Off Docked Position`
- [x] `HLG 2. Allow User To Drag Around Screen As Float Window`
- [x] `HLG 3. Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 1`

- [x] `0. View Toolbar Gets A Viewport-Local Host Mode`
- [x] `1. View Toolbar Floating Rect Is Stored Per Viewport`
- [x] `2. View Toolbar Stays Owned By Its Model Viewport`
- [x] `3. Dock Mode Stays Separate From Floating Host Mode`
- [x] `HLG 3. Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 2`

- [x] `4. Docked And Floating Presentation Share One Toolbar Body`
- [x] `5. Classic And Tabs Behavior Stay Identical Across Host Modes`
- [x] `6. Floating Shell Reuses Shared Toolbar Content Instead Of A Forked Copy`
- [x] `HLG 3. Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 3`

- [x] 7. `Drag View Toolbar Off Docked Position`
- [x] 8. `Allow User To Drag Around Screen As Float Window`
- [x] 9. `Floating View Toolbar Clamps To The Owning Viewport`
- [x] 10. `Floating View Toolbar Can Quick-Dock Back Into Its Docked Home`
- [x] HLG 1. `Drag View Toolbar Off Docked Position`
- [x] HLG 2. `Allow User To Drag Around Screen As Float Window`

### `View-Toolbar 8 Phase 3.1`

- [x] 11. `Floating View Toolbar Resizes From All Sides`
- [x] 12. `Floating View Toolbar Resizes From All Corners`
- [x] 13. `Floating Resize Updates The Same Viewport-Local Floating Rect`
- [x] 14. `Floating Resize Stays Clamped To The Owning Viewport`
- [x] 15. `Floating Resize Respects Minimum Width And Height`
- [x] HLG 2. `Allow User To Drag Around Screen As Float Window`
- [x] HLG 3. `Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 3.2`

- [x] 16. `Floating View Toolbar Exposes The Same Right-Click Menu As Docked`
- [x] 17. `Floating Shell Context Menu Anchors To The Floating Window Correctly`
- [x] 18. `Floating Shell Keeps Menu Behavior Separate From Titlebar Drag And Resize`
- [x] 19. `Floating Right-Click Parity Stays Architecturally Smart`
- [x] HLG 3. `Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 4`

- [x] 20. `Floating Toolbar Host Mode Survives Workspace Round-Trips`
- [x] 21. `One Viewport Can Float While Another Stays Docked`
- [x] 22. `Final Structure Stays Architecturally Smart`
- [x] HLG 3. `Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 5`

- [x] 23. `Floating Quick Dock Uses Proper Dark Theme Styling`
- [x] 24. `Floating Quick Dock Uses A Dock Icon Instead Of The Quick Dock Text Label`
- [x] 25. `Floating Shell Header Actions Stop Relying On Body-Only V15 Button Styling`
- [x] 26. `If Dashboard Floating Shell Shares The Same Styling Bug, The Owner Widens Cleanly`
- [x] 27. `Floating Shell Chrome Theme Polish Stays Architecturally Smart`
- [x] HLG 3. `Set Up Architecturally Smart`

### `View-Toolbar 8 Phase 6`

- [ ] 28. `All Floating Window Shells Resize From All Sides`
- [ ] 29. `All Floating Window Shells Resize From All Corners`
- [ ] 30. `Shared Floating Resize Uses One Honest Shell-Level Owner Instead Of Toolbar-Only Logic`
- [ ] 31. `Dashboard, Notepad, And Detached Viewer Match The Toolbar Resize Contract`
- [ ] 32. `Shared Floating Resize Parity Stays Architecturally Smart`
- [ ] HLG 3. `Set Up Architecturally Smart`

## [x] `View-Toolbar 8` - `Phase 1 - Viewport-Local Host Mode And Floating Rect Groundwork`

### Phase 1 Summary
#### Purpose

Add the minimum state and persistence truth for a floating toolbar without visible shell changes yet.

#### Owns

- `viewToolbarHostMode`
- `viewToolbarFloatingRect`
- viewport-local defaults
- persistence round-trip for those new fields

#### Does Not Own

- visible floating shell UI
- titlebar drag behavior
- quick-dock actions
- toolbar body extraction

#### Current Live Read

Current viewport-local state seam:
- [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts)
  - `WorkspaceViewportLocalViewState` already owns the current per-viewport toolbar state:
    - `viewToolbarOpen`
    - `viewToolbarExpandedPresentationMode`
    - `viewToolbarDockMode`
    - `viewToolbarActiveTab`
    - axis-widget sizing
  - `createDefaultWorkspaceViewportLocalViewState()` is already the single default-owner seam that should grow to include:
    - `viewToolbarHostMode: 'docked' | 'floating'`
    - `viewToolbarFloatingRect: WorkspaceFloatingRect | null`

Current mutation seam:
- [src/app/workspace/useWorkspaceStore.ts](./../../../../../../src/app/workspace/useWorkspaceStore.ts)
  - `setViewportLocalViewState(viewportId, patch)` already merges partial per-viewport toolbar patches onto the default local-view shape
  - this is the right first-phase mutation seam because it already preserves viewport-local ownership and auto-creates missing viewport chrome records

Current persistence seam:
- [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts)
  - `cloneViewportChromeState(...)` already carries local toolbar state through serialization
  - `normalizeViewportChromeRecord(...)` already validates and falls back:
    - `viewToolbarExpandedPresentationMode`
    - `viewToolbarDockMode`
    - `viewToolbarActiveTab`
  - Phase 1 should widen that same normalization path for:
    - valid `viewToolbarHostMode`
    - safe persisted `viewToolbarFloatingRect`
  - this keeps toolbar-local persistence inside the existing viewport-chrome contract instead of inventing a new detached surface store

Current toolbar shell read:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - currently reads `localViewState` for:
    - open or closed state
    - expanded presentation mode
    - dock mode
    - active tab
  - currently renders only the docked `RightDock` shell
  - does not yet read host mode or floating rect
  - should stay behaviorally unchanged in Phase 1 even after the new state fields exist

Current viewport owner seam:
- [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx)
  - still mounts `ViewToolbar` directly under the owning viewport host
  - is the key reason Phase 1 should stay viewport-local and state-only rather than widening into generic workspace-surface placement yet

Current proof seams:
- [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts)
  - already proves per-viewport toolbar-local separation and persistence behavior for existing toolbar fields
  - is the strongest seam for adding state and serialization proof for the new fields
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
  - already proves dock-mode reads and per-viewport toolbar-local behavior
  - may receive one narrow no-visible-regression assertion if Phase 1 touches the `ViewToolbar` read path at all

#### First Pass Decisions

- keep `Phase 1` state-only and persistence-only
- add exactly two new viewport-local fields:
  - `viewToolbarHostMode`
  - `viewToolbarFloatingRect`
- default every current toolbar to:
  - `viewToolbarHostMode: 'docked'`
  - `viewToolbarFloatingRect: null`
- use the existing shared `WorkspaceFloatingRect` type instead of inventing toolbar-only geometry fields
- keep `viewToolbarDockMode` exactly as a docked-layout-only decision
- do not render a floating toolbar shell in this phase
- do not add drag state, pointer handling, titlebar state, or quick-dock commands in this phase
- do not promote the toolbar into `surfacePlacementById`, `WorkspaceSurfacePlacementState`, or `WorkspaceSurfaceKind` in this phase
- prefer widening the existing viewport-chrome persistence path over creating a second toolbar-specific persistence owner

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. In [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts), add the new viewport-local toolbar state fields and seed their defaults in `createDefaultWorkspaceViewportLocalViewState()`.
2. In [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts), teach the viewport-chrome clone and normalize path to serialize, validate, and safely fall back:
   - `viewToolbarHostMode`
   - `viewToolbarFloatingRect`
3. Keep [src/app/workspace/useWorkspaceStore.ts](./../../../../../../src/app/workspace/useWorkspaceStore.ts) on the same `setViewportLocalViewState(...)` patch path, without adding a new toolbar-specific mutation API unless the implementation proves the existing patch seam is insufficient.
4. Add focused proof in [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts) that:
   - one viewport can store floating-toolbar state without affecting another
   - the new fields survive serialize and normalize round-trips
   - invalid persisted host-mode or floating-rect values fall back safely
5. Only if needed, add one narrow assertion in [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) proving that the docked toolbar still renders normally while the new fields exist on local viewport state.

#### Likely Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/useWorkspaceStore.test.ts`
- possible no-change or tiny-read seam:
  - `src/app/workspace/useWorkspaceStore.ts`
  - `src/app/components/ViewToolbar.tsx`
  - `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not render a floating toolbar shell in `Phase 1`
- do not add drag behavior in `Phase 1`
- do not add quick-dock actions in `Phase 1`
- do not add a new workspace surface kind for the toolbar in `Phase 1`
- do not move toolbar state into generic workspace detached-surface placement in `Phase 1`
- do not change the visible docked toolbar behavior in `Phase 1`
- do not mix floating semantics into `viewToolbarDockMode`

#### Implementation Risks

- widening too early from viewport-local toolbar state into the shared workspace-surface placement model
- storing floating geometry in a toolbar-only ad hoc shape instead of the existing `WorkspaceFloatingRect` language
- letting persisted invalid host-mode or rect values survive normalization and create unstable later floating-shell reads
- touching `ViewToolbar.tsx` enough to create visible behavior changes during a phase that is supposed to be state groundwork only
- conflating `host mode` and `dock mode`, which would make later dock return behavior harder to reason about

#### Checklist

- [x] add `viewToolbarHostMode` to `WorkspaceViewportLocalViewState`
- [x] add `viewToolbarFloatingRect` to `WorkspaceViewportLocalViewState`
- [x] seed both new fields in `createDefaultWorkspaceViewportLocalViewState()`
- [x] serialize and normalize the new fields through the existing viewport-chrome persistence path
- [x] validate persisted host-mode values and fall back invalid values to `docked`
- [x] validate persisted floating-rect values and fall back invalid values to `null` or safe rounded numbers
- [x] prove one viewport can hold floating-toolbar groundwork state without affecting another
- [x] prove the new fields survive persistence round-trips
- [x] keep the visible toolbar shell unchanged in this phase

#### Verification Shape

Minimum verification for this phase should cover:

- `WorkspaceViewportLocalViewState` defaults now include:
  - `viewToolbarHostMode: 'docked'`
  - `viewToolbarFloatingRect: null`
- setting the new toolbar-local fields on one viewport does not mutate another viewport's local toolbar state
- serialized workspace layout preserves the new toolbar-local fields
- normalized persisted workspace layout restores valid values and falls back invalid ones safely
- the docked toolbar still reads normally when the new fields stay at their defaults

#### Done Shape

`Phase 1` is done when:

- the workspace state has one explicit viewport-local host-mode seam for the `View` toolbar
- the workspace state has one persisted viewport-local floating-rect seam for the `View` toolbar
- both seams survive the existing workspace persistence round-trip
- the visible toolbar still behaves exactly like the current docked toolbar because floating presentation has not landed yet
- `Phase 2` can extract the shared toolbar body without reopening state ownership questions

#### Implemented Result

- [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts) now adds viewport-local `viewToolbarHostMode` plus `viewToolbarFloatingRect` and seeds them to `docked` plus `null` in the default local-view state.
- [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts) now clones, rounds, validates, and restores those two new toolbar-local fields through the existing viewport-chrome persistence path.
- [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts) now proves:
  - one viewport can hold floating-toolbar groundwork state without affecting another
  - valid floating-toolbar host data survives persistence round-trips
  - invalid persisted host-mode and floating-rect values fall back safely
- the visible docked toolbar shell stayed unchanged in this phase because no floating presentation work landed yet

Current status:
- `Phase 1` is implemented
- `Phase 2` is now the next active `View-Toolbar 8` code cut
- visible floating-shell work remains deferred to `Phase 3`

## [x] `View-Toolbar 8` - `Phase 2 - Shared Toolbar Body Extraction`
### Phase 2 Summary
#### Purpose

Split the toolbar shell from the toolbar body so docked and floating presentation can reuse one control tree.

#### Owns

- one shared toolbar body/render-definition seam
- mounting that same body under docked and floating wrappers
- reducing shell and body coupling inside `ViewToolbar.tsx`

#### Does Not Own

- final drag behavior
- split or popout support
- camera or environment feature changes
- visible floating-window presentation

#### Current Live Read

Current shell-plus-body mix:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - still owns all of these concerns in one component:
    - viewport-local store reads
    - shell refs such as:
      - `rightPanelStackRef`
      - `viewToolbarRootRef`
      - `viewToolbarPanelRef`
    - shell-only height-sync and overflow behavior
    - context-menu handling for presentation switching
    - section-definition construction through `viewToolbarSections`
    - the classic `details` section tree
    - the tabs rail plus active-tab resolution
  - this is the strongest sign that Phase 2 should extract one reusable body seam before Phase 3 adds a second shell

Current section-definition seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - `type ViewToolbarSectionDefinition` plus `viewToolbarSections`
  - already centralizes:
    - section keys
    - section labels
    - `renderBody()` functions
  - gives Phase 2 a natural first extraction boundary:
    - shared section definitions
    - shared section-wrapper rendering
    - shared tabs/classic content rendering

Current tabs/classic duplication seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - the component already derives `isTabsPresentation` and `resolvedViewToolbarActiveTab`
  - then manually renders:
    - one tabs rail from `viewToolbarSections`
    - one repeated `details` wrapper per section for the actual section content
  - this means the body extraction should preserve one authoritative section list and one authoritative section-body rendering path rather than copying the current tree into a floating branch later

Current proof seams:
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
  - already proves:
    - tabs-mode rail rendering
    - active-tab persistence
    - per-viewport presentation-mode separation
    - per-viewport dock-mode separation
    - camera command behavior staying live
  - is the strongest seam for proving that a body extraction does not regress docked behavior before floating presentation exists

#### First Pass Decisions

- keep `Phase 2` entirely inside the docked toolbar presentation
- extract one shared body seam before any floating shell exists
- preserve one authoritative section-definition list instead of creating docked and floating copies
- preserve current `Classic` and `Tabs` behavior exactly
- let the docked shell continue to own:
  - outer `<aside>`
  - shell refs
  - height-sync logic
  - context-menu ownership
- move the reusable content surface into a shared body helper that can later mount under both docked and floating shells
- prefer extracting both:
  - section-definition creation
  - section-wrapper rendering
  rather than only moving a shallow JSX fragment
- do not make Phase 2 depend on drag state, floating rect reads, or titlebar behavior

### Phase 2 Implementation Spec

#### Exact First Code Cut

1. In [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx), extract one shared body seam such as `ViewToolbarBody` or an equivalent local helper that receives:
   - the resolved section definitions
   - presentation mode
   - active tab
   - tab-change callback
2. Move the repeated tabs/classic content rendering into that shared body seam so the docked shell only mounts the body instead of owning the section tree directly.
3. Keep shell-only ownership in the outer docked wrapper:
   - outer `<aside>`
   - shell refs and height-sync logic
   - root `details` open or close behavior
   - context-menu ownership
4. Keep all section labels, section order, command handlers, and active-tab behavior exactly the same while the body extraction lands.
5. Add focused proof in [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) that:
   - docked classic rendering still shows the same section content
   - docked tabs rendering still shows the full rail and switches sections the same way
   - per-viewport presentation and active-tab state still stay local after remount

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- possible no-change seam:
  - `src/app/workspace/useWorkspaceStore.test.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not render a floating toolbar shell in `Phase 2`
- do not add drag behavior in `Phase 2`
- do not add titlebar behavior in `Phase 2`
- do not change toolbar section order or labels in `Phase 2`
- do not move shell height-sync ownership out of the docked shell unless the extraction strictly requires a tiny adapter
- do not turn the extraction into a broad View Toolbar cleanup or control rewrite

#### Implementation Risks

- extracting too little and leaving the future floating shell with no real reusable body seam
- extracting too much and destabilizing shell-only behavior such as height-sync, overflow, or context-menu placement
- accidentally duplicating the section-definition list so docked and future floating presentations can drift
- regressing tabs-mode active section rendering while refactoring the repeated `details` wrapper tree
- widening the pass into visual cleanup or section reorganization instead of keeping it structural

#### Checklist

- [x] extract one shared toolbar body seam from `ViewToolbar.tsx`
- [x] keep shell-only refs and height-sync logic on the docked shell side
- [x] keep one authoritative section-definition list
- [x] keep classic-mode section rendering behavior unchanged
- [x] keep tabs-mode rail and active-tab behavior unchanged
- [x] avoid creating separate docked and floating command trees
- [x] prove docked rendering still works after the extraction
- [x] prove tabs-mode interaction still works after the extraction
- [x] keep floating-shell work deferred to `Phase 3`

#### Verification Shape

Minimum verification for this phase should cover:

- the docked toolbar still renders the same section content in `classic` mode
- the docked toolbar still renders the same tab rail and active-tab behavior in `tabs` mode
- camera and other representative section actions still route through the same existing command or state seams
- per-viewport presentation-mode and active-tab state still remain local after remount
- the extraction leaves one shared body seam ready for a later floating shell

#### Done Shape

`Phase 2` is done when:

- the docked toolbar shell no longer directly owns the full section-content tree
- one shared toolbar body seam exists and is clearly reusable by a later floating shell
- current docked `Classic` and `Tabs` behavior stays unchanged
- `Phase 3` can add the floating shell by mounting the shared body instead of forking toolbar content

Current status:
- `Phase 2` is implemented
- `Phase 3` is now the next active `View-Toolbar 8` code cut
- visible floating-shell rendering remains deferred to `Phase 3`

#### Implemented Result

- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) now extracts one shared `ViewToolbarBody` plus `ViewToolbarSection` seam so the docked shell mounts one reusable toolbar content tree instead of owning the repeated tabs rail and section wrapper JSX directly.
- the docked `ViewToolbar` shell still owns:
  - outer `<aside>`
  - shell refs
  - height-sync and overflow behavior
  - root `details` open or close behavior
  - presentation context-menu ownership
- the authoritative `viewToolbarSections` list still lives in one place and now feeds both:
  - the tabs rail
  - the section-content wrapper rendering
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) now adds focused classic-mode proof that the shared body seam preserves the same section order without rendering a tab rail, while the existing tabs-mode and remount proof continues to cover tab interaction and per-viewport active-tab behavior.

## [x] `View-Toolbar 8` - `Phase 3 - Floating Shell, Drag, Clamp, And Quick Dock`

### Phase 3 Summary
#### Purpose

Make the floating toolbar feel like a real movable window inside the owning viewport host.

#### Owns

- floating shell wrapper
- floating titlebar
- drag loop
- viewport clamp behavior
- quick-dock return path

#### Does Not Own

- toolbar popout
- toolbar split hosting
- new toolbar content features

#### Current Live Read

Current shared body seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - now already has one reusable `ViewToolbarBody` plus `ViewToolbarSection` seam
  - is now structurally ready to mount:
    - under the existing docked shell
    - under one new floating shell
  - still only renders the docked `RightDock` presentation

Current viewport-local floating groundwork:
- [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts)
  - already owns:
    - `viewToolbarHostMode`
    - `viewToolbarFloatingRect`
  - keeps those fields viewport-local rather than turning the toolbar into a detached workspace surface
- [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts)
  - already serializes and normalizes those fields through the viewport-chrome path
  - means `Phase 3` can read and mutate existing floating-toolbar state instead of inventing new ownership

Current viewport owner seam:
- [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx)
  - still mounts `ViewerHost`, `ViewportOverlay`, and `ViewToolbar` together under one viewport host
  - is the key reason the floating toolbar should clamp to one owning viewport host instead of the whole workspace shell

Current reusable floating shell reference:
- [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx)
  - already shows the live repo pattern for:
    - default floating rect seeding
    - viewport-relative clamp logic
    - titlebar-only drag start
    - global pointermove and pointerup listeners
    - quick-dock affordance
  - is the best architectural template for this phase even though the `View` toolbar stays viewport-local instead of becoming a detached dashboard surface

Current proof seams:
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
  - already proves:
    - docked classic rendering
    - tabs-mode rail behavior
    - active-tab persistence
    - dock-mode behavior
    - shell height-sync behavior
  - is the strongest place to add floating-host rendering and drag/quick-dock proof
- [src/app/workspace/ViewportWorkspaceHost.test.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.test.tsx)
  - already proves viewport host ownership seams in a narrow way
  - may need one small assertion only if `Phase 3` requires a tiny viewport-host adapter such as an anchoring ref or positioning contract

#### First Pass Decisions

- keep the floating toolbar inside the existing viewport-local `ViewToolbar` ownership model
- render exactly one host mode at a time:
  - `docked`
  - `floating`
- reuse the shared `ViewToolbarBody` from `Phase 2` instead of forking any command or section tree
- make the floating titlebar the only drag affordance
- keep pointer handling away from controls inside the toolbar body
- clamp the floating rect to the owning viewport host instead of the whole app shell
- make quick-dock switch the same toolbar instance back to `viewToolbarHostMode: 'docked'`
- keep `viewToolbarDockMode` meaningful only for the docked presentation
- do not widen into:
  - workspace split menus
  - popout windows
  - toolbar promotion into `WorkspaceSurfaceKind`
  - multi-viewport persistence cleanup in this phase

### Phase 3 Implementation Spec

#### Exact First Code Cut

1. In [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx), add one floating-shell presentation that mounts the existing shared `ViewToolbarBody` when `viewToolbarHostMode === 'floating'`.
2. Keep the existing docked `RightDock` presentation for `viewToolbarHostMode === 'docked'`, without changing its section behavior or dock-mode semantics.
3. Add a floating titlebar that:
   - starts drag only from the titlebar region
   - ignores button clicks inside the titlebar
   - exposes one quick-dock action
4. Reuse the repo's existing floating-window pattern language from [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx) to add:
   - default floating-rect seeding when the stored rect is `null`
   - viewport-relative clamp logic
   - `window`-level `pointermove` and `pointerup` drag listeners
5. Update the floating drag path to write back through the existing viewport-local state seam so `viewToolbarFloatingRect` stays the source of truth during drag.
6. Make quick-dock return the toolbar to `viewToolbarHostMode: 'docked'` without clearing the remembered floating rect unless implementation friction proves that reset is necessary.
7. Add focused proof in [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) that:
   - the floating shell renders when the host mode is `floating`
   - the shared body still exposes the same representative controls in floating mode
   - titlebar drag updates the floating rect and visible position
   - quick-dock returns to the docked shell cleanly
   - docked fallback still behaves correctly in both `below-axis` and `top-right-cluster`
8. Only if needed, add one narrow host-ownership assertion in [src/app/workspace/ViewportWorkspaceHost.test.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.test.tsx) if the floating shell requires a small viewport-host anchoring seam.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- possible tiny host adapter:
  - `src/app/workspace/ViewportWorkspaceHost.tsx`
  - `src/app/workspace/ViewportWorkspaceHost.test.tsx`
- likely no-change seams:
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
  - `src/app/workspace/useWorkspaceStore.test.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not promote the toolbar into `WorkspaceSurfaceKind` in `Phase 3`
- do not add split-menu or popout behavior in `Phase 3`
- do not widen this pass into multi-viewport persistence cleanup in `Phase 3`
- do not fork the toolbar body into separate docked and floating implementations
- do not overload `viewToolbarDockMode` with floating semantics
- do not move command ownership away from the current viewport-local toolbar
- do not turn this pass into a broader toolbar feature cleanup

#### Implementation Risks

- mounting the floating shell outside the owning viewport and breaking the viewport-local ownership model
- letting drag start from body controls instead of the titlebar and creating input conflicts
- clamping against the wrong rectangle, especially the whole app shell instead of the owning viewport host
- accidentally rendering both host modes at once instead of switching cleanly between them
- clearing or mutating dock-only state during quick-dock in a way that makes return behavior inconsistent
- widening the phase into persistence or multi-viewport polish that belongs in `Phase 4`

#### Checklist

- [x] render one floating shell when `viewToolbarHostMode` is `floating`
- [x] keep the existing docked shell for `viewToolbarHostMode: 'docked'`
- [x] mount the shared `ViewToolbarBody` in the floating shell instead of forking content
- [x] add a floating titlebar drag affordance
- [x] clamp the floating rect to the owning viewport host
- [x] write drag updates back through `viewToolbarFloatingRect`
- [x] add a quick-dock action that returns to docked mode cleanly
- [x] keep dock-mode behavior honest when the toolbar returns from floating
- [x] prove floating render, drag, clamp, and quick-dock behavior with focused tests
- [x] keep multi-viewport persistence cleanup deferred to `Phase 4`

#### Verification Shape

Minimum verification for this phase should cover:

- the toolbar renders as a floating window when the viewport-local host mode is `floating`
- the floating shell still exposes the same shared toolbar controls and tab behavior
- dragging from the titlebar changes the floating window position
- body controls do not accidentally initiate drag
- the floating rect clamps safely inside the owning viewport host
- quick-dock returns the toolbar to the docked shell cleanly
- docked fallback still works in both `below-axis` and `top-right-cluster`

#### Done Shape

`Phase 3` is done when:

- one viewport-local floating `View` toolbar shell exists
- that shell reuses the shared toolbar body from `Phase 2`
- the floating toolbar can be dragged around its owning viewport safely
- quick-dock returns the same toolbar back to its docked presentation cleanly
- the phase still stays honest about ownership and does not widen into a generic workspace surface

Current status:
- `Phase 3` is implemented
- `Phase 3.2` is now the next active `View-Toolbar 8` code cut
- multi-viewport persistence proof and cleanup remain deferred to `Phase 4`

#### Implemented Result

- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) now renders exactly one host mode at a time:
  - the existing docked `RightDock`
  - one viewport-local floating toolbar window when `viewToolbarHostMode === 'floating'`
- the docked toolbar summary can now drag out past the threshold and convert directly into a floating toolbar instead of requiring a hidden state switch.
- the floating shell reuses the shared `ViewToolbarBody` from `Phase 2`, so the same command tree, tabs behavior, and section content stay live in both host modes.
- floating drag now runs from the floating titlebar only, writes position updates back through viewport-local `viewToolbarFloatingRect`, and clamps movement inside the owning viewport host.
- the floating shell now exposes one `Quick Dock` action that returns the same toolbar back to the docked presentation while preserving the floating rect for later reuse.
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) now proves:
  - floating-shell render through the shared body
  - titlebar drag updates and viewport clamp behavior
  - docked-summary drag-out into floating mode
  - quick-dock return to the docked shell

## [x] `View-Toolbar 8` - `Phase 3.1 - Floating Resize Handles, Clamp, And Minimums`

### Phase 3.1 Summary
#### Purpose

Make the floating `View` toolbar feel like a real resizable window while keeping its ownership and state model exactly the same.

#### Owns

- edge resize handles
- corner resize handles
- width and height minimums
- resize-time clamp behavior
- resize writes through the existing floating rect

#### Does Not Own

- new toolbar commands or sections
- toolbar popout or split hosting
- per-viewport persistence proof across multiple viewports
- promotion into `WorkspaceSurfaceKind`

#### Current Live Read

Current floating-shell seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - already renders one viewport-local floating shell when `viewToolbarHostMode === 'floating'`
  - already owns:
    - floating titlebar drag
    - quick-dock return
    - clamp logic through the existing floating rect helpers
  - is the right place to add resize affordances because the shell wrapper already owns visible window geometry

Current floating-rect source of truth:
- [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts)
  - already keeps `viewToolbarFloatingRect` viewport-local
- [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts)
  - already serializes and normalizes the same rect
  - means Phase 3.1 should reuse that exact rect instead of inventing resize-only geometry state

Current floating-shell pattern language:
- [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx)
  - already demonstrates the repo's pointer-driven floating-window shell behavior
  - is still the best style reference for resize pointer ownership, even though the toolbar remains viewport-local instead of becoming a detached workspace surface

Current proof seams:
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
  - already proves:
    - floating-shell render
    - titlebar drag and clamp
    - docked drag-out
    - quick-dock return
  - is the strongest place to widen proof for resize handles, resize clamp, and minimum-size behavior

#### First Pass Decisions

- keep all resize behavior inside the existing floating `ViewToolbar` shell
- add resize handles for:
  - `n`
  - `s`
  - `e`
  - `w`
  - `ne`
  - `nw`
  - `se`
  - `sw`
- keep `viewToolbarFloatingRect` as the only geometry source of truth during resize
- preserve the current floating titlebar drag behavior instead of replacing it with a generic move or resize controller
- clamp resize results to the owning viewport host, not the whole workspace shell
- keep explicit minimum width and height for the floating shell so the shared toolbar body stays usable
- do not widen this pass into multi-viewport persistence cleanup or general toolbar polish

### Phase 3.1 Implementation Spec

#### Exact First Code Cut

1. In [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx), add resize handles on all four sides and all four corners of the floating toolbar shell.
2. Reuse the existing pointer-driven floating-shell interaction pattern so resize begins from the handle regions while titlebar drag continues to own move behavior.
3. Update resize interactions to write back through the same viewport-local `viewToolbarFloatingRect` state seam already used for drag.
4. Extend the existing clamp helper or equivalent geometry helper so resize:
   - respects minimum width and height
   - keeps the floating shell inside the owning viewport host
   - preserves the opposite anchored edge correctly during left, top, and corner resizes
5. Keep the docked host mode, toolbar body content tree, and quick-dock behavior unchanged while resize support lands.
6. Add focused proof in [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) that:
   - an edge resize updates width or height correctly
   - a corner resize updates both size and anchored position correctly
   - resize clamp keeps the shell inside the owning viewport host
   - minimum width and height are enforced
   - titlebar drag and quick-dock still work after the resize handles land

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- likely no-change seams:
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/workspacePersistence.ts`
  - `src/app/workspace/useWorkspaceStore.test.ts`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not promote the toolbar into `WorkspaceSurfaceKind` in `Phase 3.1`
- do not move the toolbar into a separate workspace mode in `Phase 3.1`
- do not widen this pass into multi-viewport persistence cleanup in `Phase 3.1`
- do not fork the shared `ViewToolbarBody` to solve resize layout issues
- do not add popout or split-host behavior in `Phase 3.1`
- do not turn this pass into visual restyling of the floating shell beyond what resize affordances require

#### Implementation Risks

- handling left and top resize incorrectly and letting the shell jump because the anchored edge is not preserved
- clamping position without clamping width and height consistently, which can create jitter at the viewport boundary
- making resize handles too large or too invasive and stealing normal toolbar interactions from the body
- creating a second floating-geometry path instead of reusing `viewToolbarFloatingRect`
- widening the pass into persistence and multi-viewport proof that belong in `Phase 4`

#### Checklist

- [x] add floating resize handles for all four sides
- [x] add floating resize handles for all four corners
- [x] keep titlebar drag behavior working after resize handles land
- [x] write resize updates back through `viewToolbarFloatingRect`
- [x] enforce minimum floating width and height
- [x] clamp resized geometry to the owning viewport host
- [x] preserve anchored-edge behavior for left, top, and corner resize
- [x] keep quick-dock behavior unchanged
- [x] prove edge resize, corner resize, clamp, and minimum-size behavior with focused tests

#### Verification Shape

Minimum verification for this phase should cover:

- the floating toolbar resizes from each edge family without breaking normal body interaction
- corner resize changes both size and anchored position correctly
- resize results clamp safely inside the owning viewport host
- minimum width and height keep the toolbar usable
- titlebar drag still moves the resized toolbar correctly
- quick-dock still returns the resized toolbar to the docked shell cleanly

#### Done Shape

`Phase 3.1` is done when:

- the floating `View` toolbar resizes from all four sides
- the floating `View` toolbar resizes from all four corners
- resize writes through the same viewport-local floating rect used by drag
- the shell stays clamped and usable inside the owning viewport
- the toolbar still stays honest about ownership and avoids widening into a generic workspace surface

Current status:
- `Phase 3.1` is implemented
- `Phase 3.2` is now the next active `View-Toolbar 8` code cut
- multi-viewport persistence proof and final cleanup remain deferred to `Phase 4`

#### Implemented Result

- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) now renders floating resize handles on all four sides and all four corners of the viewport-local floating toolbar shell.
- floating resize now reuses the same viewport-local `viewToolbarFloatingRect` path already used by drag, so move and resize continue to share one rect source of truth instead of widening into a separate floating geometry system.
- resize now enforces the floating toolbar minimum width and height while clamping the shell inside the owning viewport host, including anchored-edge behavior for left, top, and corner resize.
- floating titlebar drag and `Quick Dock` stay live after the resize handles land because the new resize path stays isolated to handle regions and clears cleanly on pointer release or dock return.
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) now proves:
  - edge resize updates floating width and preserves later drag plus quick-dock behavior
  - north-west corner resize clamps to the viewport and enforces minimum width and height

## [x] `View-Toolbar 8` - `Phase 3.2 - Floating Shell Context Menu Parity`

### Phase 3.2 Summary
#### Purpose

Bring the docked `View` toolbar right-click behavior over to the floating shell so the same presentation menu and shell-level context flow stay available after detach.

#### Owns

- floating-shell right-click entry
- floating-shell menu anchoring
- parity with the docked toolbar presentation menu
- separation between context-menu handling and drag or resize pointer ownership

#### Does Not Own

- new menu items beyond the current docked toolbar menu
- multi-viewport persistence proof
- toolbar popout or split hosting
- general floating-shell polish outside context-menu parity

#### Current Live Read

Current docked context-menu seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - the docked shell already owns shell-level `onContextMenu` handling through `openViewToolbarContextMenu(...)`
  - already ignores interactive controls through `shouldIgnoreViewToolbarShellContextMenu(...)`
  - already mounts the shared `SpaghettiContextMenu` with presentation-mode and dock-mode items

Current floating-shell seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - the floating shell already owns:
    - titlebar drag
    - quick-dock return
    - edge and corner resize handles
  - does not yet expose shell-level right-click menu parity with the docked toolbar

Current menu anchoring seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - `openViewToolbarContextMenu(...)` already resolves local menu coordinates relative to:
    - the floating shell container when host mode is `floating`
    - the docked panel stack when host mode is `docked`
  - this means the first implementation cut should likely widen event ownership rather than inventing a second floating-menu mount path

Current proof seam:
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
  - already proves floating render, drag, clamp, resize, and quick-dock behavior
  - is the strongest place to add focused proof that floating-shell right-click opens the same menu cleanly without stealing drag or resize behavior

#### First Pass Decisions

- reuse the existing `openViewToolbarContextMenu(...)` and `SpaghettiContextMenu` owner seam
- keep floating-shell menu contents identical to the docked toolbar unless a later phase explicitly widens them
- let shell-level right-click work from the floating shell surface while still ignoring interactive child controls
- keep titlebar drag on pointer-down and context menu on right-click clearly separated
- keep resize handles and right-click ownership separate so resize regions do not create stray context behavior
- do not widen this pass into menu redesign or new toolbar features

### Phase 3.2 Implementation Spec

#### Exact First Code Cut

1. In [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx), add shell-level `onContextMenu` handling for the floating toolbar window so it opens the same view-toolbar context menu currently available on the docked shell.
2. Reuse the existing `shouldIgnoreViewToolbarShellContextMenu(...)` guard so interactive controls inside the floating body do not accidentally trigger shell-level menu behavior.
3. Keep the floating menu anchored through the existing `openViewToolbarContextMenu(...)` coordinate path rather than inventing a floating-only menu container.
4. Make sure right-click handling stays compatible with:
   - titlebar drag on primary-button pointer-down
   - resize handles on primary-button pointer-down
   - quick-dock button interaction
5. Add focused proof in [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) that:
   - right-click on the floating shell opens the menu
   - the floating menu still exposes the same representative presentation items as the docked shell
   - right-click on interactive controls does not wrongly trigger shell-level menu behavior
   - titlebar drag and resize still work after floating context-menu parity lands

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not add new context-menu items in `Phase 3.2`
- do not redesign the floating shell visual treatment in `Phase 3.2`
- do not widen this pass into multi-viewport persistence cleanup in `Phase 3.2`
- do not fork the menu owner seam into separate docked and floating menu systems
- do not turn this pass into general toolbar interaction cleanup beyond what right-click parity requires

#### Implementation Risks

- attaching the floating-shell context menu at the wrong layer and stealing right-click from interactive body controls
- creating a second floating-only menu anchoring path instead of reusing the existing local coordinate seam
- letting right-click handling interfere with titlebar drag or resize affordances
- widening the pass into new menu features instead of keeping it as parity work

#### Checklist

- [x] add shell-level right-click handling to the floating toolbar window
- [x] reuse the existing view-toolbar menu owner seam
- [x] keep floating menu items aligned with the docked toolbar menu
- [x] ignore interactive child controls when deciding shell-level right-click behavior
- [x] keep titlebar drag working after floating context-menu parity lands
- [x] keep resize handles working after floating context-menu parity lands
- [x] prove floating-shell right-click parity with focused tests

#### Verification Shape

Minimum verification for this phase should cover:

- right-click on the floating shell opens the same toolbar context menu used by the docked shell
- menu positioning stays correct relative to the floating shell
- interactive controls inside the floating toolbar body do not accidentally open the shell-level menu
- titlebar drag still works after the context-menu change
- resize handles still work after the context-menu change

#### Done Shape

`Phase 3.2` is done when:

- the floating `View` toolbar exposes the same shell-level right-click menu as the docked toolbar
- menu anchoring stays correct for the floating shell
- drag, resize, and quick-dock continue to work after the parity pass
- the change stays inside the existing viewport-local toolbar and menu-owner seams

Current status:
- `Phase 3.2` is implemented
- `Phase 4` is now the next active `View-Toolbar 8` code cut
- multi-viewport persistence proof and final cleanup remain deferred to `Phase 4`

#### Implemented Result

- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) now reuses one shared `viewToolbarContextMenuElement` in both host modes so the floating shell exposes the same `Classic` and `Tabs` presentation menu as the docked toolbar without forking the menu-owner seam.
- the floating toolbar window now opens that menu through shell-level `onContextMenu` handling while preserving the existing `shouldIgnoreViewToolbarShellContextMenu(...)` guard, so interactive controls like `Quick Dock` do not wrongly trigger shell-level menu behavior.
- floating-shell menu anchoring still runs through the shared `openViewToolbarContextMenu(...)` coordinate path, which keeps local menu positioning relative to the floating window instead of inventing a floating-only menu container.
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) now proves floating-shell right-click parity by showing that shell-level right-click opens the same presentation items, interactive controls remain ignored, and the floating toolbar stays in floating host mode after the parity interaction.

## [x] `View-Toolbar 8` - `Phase 4 - Persistence, Multi-Viewport Proof, And Cleanup`

### Phase 4 Summary
#### Purpose

Prove the new host mode behaves honestly in real workspace conditions and clean up any remaining structural rough edges.

#### Owns

- per-viewport proof
- persistence proof
- cleanup of any remaining structural drift after the floating shell lands

#### Does Not Own

- toolbar promotion into `WorkspaceSurfaceKind`
- popout follow-on work

#### Current Live Read

Current viewport-local toolbar state seam:
- [src/app/workspace/workspaceShellTypes.ts](./../../../../../../src/app/workspace/workspaceShellTypes.ts)
  - already keeps the full floating-toolbar contract viewport-local through:
    - `viewToolbarHostMode`
    - `viewToolbarFloatingRect`
    - `viewToolbarDockMode`
    - `viewToolbarExpandedPresentationMode`
    - `viewToolbarActiveTab`
  - is the key reason `Phase 4` should prove per-viewport separation instead of widening into shared workspace-surface placement

Current persistence seam:
- [src/app/workspace/workspacePersistence.ts](./../../../../../../src/app/workspace/workspacePersistence.ts)
  - already serializes and normalizes the viewport-local host mode and floating rect
  - now needs final proof that the shipped floating shell behaves honestly after full workspace round-trips, not just at the raw field level
- [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts)
  - already proves the groundwork persistence path for the viewport-local floating-toolbar state
  - is the strongest seam for widening the persistence proof to the full shipped host-mode contract

Current floating-shell interaction seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - already ships:
    - floating host-mode rendering
    - docked drag-out
    - titlebar drag
    - edge and corner resize
    - quick-dock return
    - floating-shell context-menu parity
  - means the remaining work is now mostly final proof and cleanup, not new feature behavior

Current viewport-owner seam:
- [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx)
  - still mounts each `ViewToolbar` under one owning viewport host
  - is the seam that should stay honest when one viewport floats while another remains docked

Current proof seams:
- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
  - already proves the main floating-shell behaviors one viewport at a time
  - is the strongest surface for adding final multi-viewport host-mode interaction proof
- [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts)
  - already proves viewport-local persistence and separation at the state level
  - should be widened only as much as needed for final floating-toolbar round-trip truth
- [src/app/workspace/ViewportWorkspaceHost.test.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.test.tsx)
  - may need one narrow assertion only if the viewport-host ownership contract is not already clear enough from the toolbar tests

#### First Pass Decisions

- one viewport must be able to float its toolbar while another stays docked
- preserve the existing viewport-local ownership model
- keep the final structure ready for later work without widening into a separate workspace mode
- prefer proof and cleanup over new behavior in this phase
- keep the final cleanup focused on:
  - viewport-local separation
  - workspace round-trip truth
  - safe dock return after persisted floating state
  - removing any small remaining structural duplication or drift only if the tests expose it
- do not treat this phase as a place to add popout, split hosting, or new toolbar features

### Phase 4 Implementation Spec

#### Exact First Code Cut

1. In [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx), add focused proof that:
   - one viewport can stay `floating` while another remains `docked`
   - each viewport keeps its own floating rect, presentation mode, and active tab without cross-talk
   - quick-docking one viewport does not disturb another viewport's floating toolbar
2. In [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts), widen the persistence proof so the shipped floating-toolbar state contract survives serialize and normalize round-trips with representative real values for:
   - `viewToolbarHostMode`
   - `viewToolbarFloatingRect`
   - `viewToolbarDockMode`
   - `viewToolbarExpandedPresentationMode`
   - `viewToolbarActiveTab`
3. Only if the proof exposes real friction, make narrow cleanup edits in [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) or [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx) to remove small structural drift without widening the feature set.
4. Only if needed, add one narrow viewport-owner assertion in [src/app/workspace/ViewportWorkspaceHost.test.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.test.tsx) to keep the owning viewport contract explicit.
5. Keep `Phase 4` as a proof-and-cleanup pass; do not add any new visible toolbar capability unless a failing proof reveals a small missing correctness fix.

#### Likely Files

- widen [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx)
- widen [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts)
- widen [src/app/workspace/ViewportWorkspaceHost.test.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.test.tsx) if needed
- possible narrow cleanup seam if proof exposes friction:
  - [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx)
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not add new visible toolbar features in `Phase 4`
- do not promote the toolbar into `WorkspaceSurfaceKind` in `Phase 4`
- do not widen into popout or split hosting in `Phase 4`
- do not rewrite the floating-shell architecture unless the proof exposes a real correctness issue
- do not use this cleanup pass to redesign toolbar presentation or menu contents

#### Implementation Risks

- widening a proof pass into speculative refactor work that does not materially improve the shipped toolbar contract
- adding too much new test scaffolding when narrow representative multi-viewport proof would be enough
- confusing raw persistence-field proof with true end-to-end viewport-local behavior proof
- accidentally introducing cross-viewport coupling while trying to add final cleanup or assertions

#### Checklist

- [x] prove one viewport can float while another stays docked
- [x] prove floating and docked toolbars keep their local presentation state separated per viewport
- [x] prove floating-toolbar state survives workspace round-trips with representative real values
- [x] prove quick-dock on one viewport does not disturb another viewport
- [x] clean up any remaining small structural drift revealed by the proof
- [x] keep the final structure architecturally honest and viewport-local

#### Verification Shape

Minimum verification for this phase should cover:

- one viewport can render a floating toolbar while another still renders a docked toolbar
- each viewport keeps its own:
  - host mode
  - floating rect
  - presentation mode
  - active tab
- serialized workspace layout preserves representative floating-toolbar state across round-trips
- quick-dock and persisted return behavior stay scoped to the owning viewport
- no hidden widening into workspace-surface promotion appears during the cleanup pass

#### Done Shape

`Phase 4` is done when:

- the full floating-toolbar contract is proven to stay viewport-local across multiple viewports
- the shipped floating-toolbar state survives workspace persistence round-trips honestly
- any small structural drift exposed by the proof is cleaned up without widening the feature set
- `View-Toolbar 8` can be treated as structurally complete for the current detachable floating-window presentation lane

Current status:
- `Phase 4` is implemented
- the detachable floating-window behavior lane is structurally complete
- `Phase 5` is now the next active `View-Toolbar 8` follow-on polish cut

#### Implemented Result

- [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) now proves that one viewport can keep a floating `View` toolbar while another stays docked, that their host mode, tab state, dock mode, and floating rect stay separated, and that quick-docking the floating toolbar only affects its owning viewport.
- [src/app/workspace/useWorkspaceStore.test.ts](./../../../../../../src/app/workspace/useWorkspaceStore.test.ts) now widens the workspace round-trip proof so representative floating and docked toolbar state survives serialize and normalize across multiple viewports without cross-talk.
- the final proof pass did not expose production-code drift that required changes in [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) or [src/app/workspace/ViewportWorkspaceHost.tsx](./../../../../../../src/app/workspace/ViewportWorkspaceHost.tsx), which confirms the shipped floating host-mode, resize, and context-menu work already holds together under multi-viewport and persistence pressure.

## [x] `View-Toolbar 8` - `Phase 5 - Floating Shell Chrome Theme Parity And Quick-Dock Styling`

### Phase 5 Summary
#### Purpose

Fix the floating-shell header action styling so the dock affordance matches the dark viewport chrome and uses a compact dock icon instead of the `Quick Dock` text label.

#### Owns

- floating `Quick Dock` button theme parity
- replacing the floating `Quick Dock` text label with a dock icon affordance
- floating-shell header action styling
- deciding whether the real owner is `ViewToolbar` only or a shared floating-shell chrome rule also used by `DashboardWindowHost`

#### Does Not Own

- new floating-toolbar behavior
- new context-menu items
- workspace-surface promotion
- split or popout behavior

#### Current Live Read

Current `ViewToolbar` floating-shell seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - the floating shell uses inline chrome styles for:
    - shell background
    - header background
    - header text
  - the `Quick Dock` button sits in `.ViewToolbarFloatingWindowHeader`, outside the `.V15Panel ViewToolbarRoot ViewToolbarFloatingWindowBody` region
  - that means the dark button theme from `.V15Panel button` does not apply to `Quick Dock`
  - the same header action also still uses the full `Quick Dock` text string instead of a compact dock icon affordance

Current shared button-theme seam:
- [src/app/theme/foundation/base.css](./../../../../../../src/app/theme/foundation/base.css)
  - the dark button contract currently comes from `.V15Panel button`
  - this explains why the floating header action looks light while the body buttons look correct

Current neighboring floating-shell seam:
- [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx)
  - uses the same general floating-window shell pattern:
    - floating root with inline dark shell styles
    - header row
    - `Quick Dock` button in the header
  - suggests the styling owner may need to widen to shared floating-shell chrome instead of a `ViewToolbar`-only patch if the same mismatch exists there

#### First Pass Decisions

- keep the first cut focused on shell chrome styling plus the dock affordance shape only
- treat the floating header action as separate from the body button surface because it lives outside `.V15Panel`
- inspect `DashboardWindowHost` as part of the same pass and widen only if the same theme bug is truly shared
- prefer one explicit floating-shell header action class or shared shell-chrome rule over per-button inline style hacks
- prefer a compact icon button with accessible labeling over the visible `Quick Dock` text string
- do not widen this pass into structural floating-shell behavior changes

### Phase 5 Implementation Spec

#### Exact First Code Cut

1. In [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx), move the floating dock action styling onto an explicit shell-chrome class or shared header-action style so it picks up the intended dark theme.
2. Replace the visible `Quick Dock` text label with a dock icon affordance while keeping accessible labeling explicit through `aria-label`, tooltip text, or equivalent shell-chrome semantics.
3. Check [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx) for the same header-button mismatch and widen the owner only if the same issue is real there.
4. Add or widen the owning theme rules in the appropriate stylesheet, likely under shared foundation or viewport-overlay shell chrome, so floating header actions no longer depend on `.V15Panel button`.
5. Add focused proof in [src/app/components/ViewToolbar.test.tsx](./../../../../../../src/app/components/ViewToolbar.test.tsx) that the floating dock action receives the intended themed class contract, uses the icon affordance, and keeps drag, resize, and quick-dock behavior intact after the styling move.
6. Only if the bug is shared, add narrow proof for the `DashboardWindowHost` shell so the widened styling owner stays explicit.

#### Likely Files

- `src/app/components/ViewToolbar.tsx`
- possible shared-owner seam:
  - `src/app/hosts/DashboardWindowHost.tsx`
- likely theme owner:
  - `src/app/theme/foundation/base.css`
  - or `src/app/theme/surfaces/viewport-overlay.css`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
  - possible narrow shared-shell proof:
    - `src/app/hosts/DashboardWindowHost.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not change floating toolbar behavior in `Phase 5`
- do not widen this pass into resize, drag, or context-menu feature work
- do not add one-off inline light or dark color fixes per button if a real shared shell owner is clearer
- do not widen into a broad viewport-theme refactor

#### Implementation Risks

- fixing the `ViewToolbar` button locally while leaving the identical shell bug in `DashboardWindowHost`
- widening too far into a generic floating-window component refactor when the real need is only shared header-action theming
- attaching the new style contract to `.V15Panel` again and recreating the same body-only limitation

#### Checklist

- [ ] make floating `Quick Dock` match the dark shell theme
- [ ] replace the floating `Quick Dock` text label with a dock icon affordance
- [ ] stop relying on `.V15Panel button` for floating header actions
- [ ] inspect `DashboardWindowHost` for the same shell-chrome issue
- [ ] widen the owner only if the bug is genuinely shared
- [ ] keep floating drag, resize, and quick-dock behavior unchanged

#### Verification Shape

Minimum verification for this phase should cover:

- the floating `Quick Dock` button no longer renders with the default light browser button look
- the floating dock affordance now renders as an icon instead of the `Quick Dock` text string while keeping accessible labeling
- the owning style contract is explicit and not dependent on body-only `.V15Panel` button rules
- floating toolbar behavior remains unchanged after the style move
- if the style owner widens, the neighboring floating shell matches too

#### Done Shape

`Phase 5` is done when:

- the floating dock affordance visually matches the dark shell chrome
- the floating dock affordance uses an icon instead of the `Quick Dock` text label
- the shell-chrome owner for floating header actions is explicit
- any genuinely shared floating-shell header-action styling bug is fixed at the correct owner seam
- the pass stays a polish cut rather than reopening floating-window behavior work

Current status:
- `Phase 5` is implemented
- the floating shell quick-dock affordance now uses one shared icon-button owner across the real floating shell users
- `Phase 6` is now the next active `View-Toolbar 8` follow-on for shared resize parity across the other floating shell users

## [ ] `View-Toolbar 8` - `Phase 6 - Shared Floating Shell Resize Parity`

### Phase 6 Summary
#### Purpose

Extend the all-edge and corner resize affordance from the floating `View` toolbar to the other real floating window shells through one honest shared shell-level resize owner.

#### Owns

- shared floating-shell resize ownership
- all-edge and corner resize parity for floating `Dashboard`, `Notepad`, and detached model viewport shells
- shared clamp and minimum-size behavior where the shell contract is genuinely common
- keeping the widened resize lane aligned with the existing floating-shell drag and quick-dock patterns

#### Does Not Own

- new floating shell kinds
- popout resize changes
- toolbar-body behavior changes
- unrelated viewport-shell theming
- a giant generic floating-window framework refactor

#### Current Live Read

Current toolbar-only resize seam:
- [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx)
  - already owns:
    - all-edge and corner resize handles
    - resize pointer state
    - shared clamp math for the floating toolbar rect
  - this is still a `ViewToolbar`-local implementation, not a shared floating shell contract

Current neighboring floating shell seams:
- [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx)
  - owns a floating rect plus titlebar drag
  - does not yet render resize handles or run resize pointer logic
- [src/app/hosts/NotepadWindowHost.tsx](./../../../../../../src/app/hosts/NotepadWindowHost.tsx)
  - owns a floating rect plus titlebar drag
  - does not yet render resize handles or run resize pointer logic
- [src/app/AppShell.tsx](./../../../../../../src/app/AppShell.tsx)
  - detached floating model viewport shell owns a floating rect plus titlebar drag
  - does not yet render resize handles or run resize pointer logic

Current shared shell polish seam:
- [src/app/components/FloatingWindowQuickDockButton.tsx](./../../../../../../src/app/components/FloatingWindowQuickDockButton.tsx)
  - proves the repo already has one small shared floating-shell chrome owner for a sibling concern
  - suggests `Phase 6` should widen resize through a similarly honest shared seam instead of copying the `ViewToolbar` resize block into every host

#### First Pass Decisions

- treat the current all-edge and corner resize behavior as `ViewToolbar`-local truth, not as already-shared infrastructure
- widen only as far as needed to give the other real floating shells the same resize affordance
- prefer one shared shell-level helper, component, or hook for resize ownership instead of copy-pasting the toolbar logic
- preserve each host's own min-size and clamp differences where those differences are real
- keep popout windows out of scope for this pass
- keep the widening focused on floating shells that already exist in the main viewport area

### Phase 6 Implementation Spec

#### Exact First Code Cut

1. Extract the reusable parts of the floating toolbar resize contract from [src/app/components/ViewToolbar.tsx](./../../../../../../src/app/components/ViewToolbar.tsx) into one honest shared shell-level owner, likely a helper, component, or hook that can render handles and drive resize state without taking over unrelated host behavior.
2. Apply that shared resize owner to the floating shells in [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../src/app/hosts/DashboardWindowHost.tsx), [src/app/hosts/NotepadWindowHost.tsx](./../../../../../../src/app/hosts/NotepadWindowHost.tsx), and the detached viewer floating shell in [src/app/AppShell.tsx](./../../../../../../src/app/AppShell.tsx).
3. Keep shell-specific minimum sizes and clamp boundaries honest so widening the owner does not flatten real differences between toolbar, dashboard, notepad, and detached viewer shells.
4. Add focused proof that each widened floating shell now resizes from edges and corners while preserving existing drag and quick-dock behavior.
5. Only if the shared owner remains small and clear, let `ViewToolbar` consume the same seam too so the resize system stops living as a toolbar-only branch.

#### Likely Files

- likely shared owner:
  - `src/app/components/`
  - or `src/app/hosts/`
- current toolbar resize owner:
  - `src/app/components/ViewToolbar.tsx`
- widening targets:
  - `src/app/hosts/DashboardWindowHost.tsx`
  - `src/app/hosts/NotepadWindowHost.tsx`
  - `src/app/AppShell.tsx`
- likely shared shell styling owner:
  - `src/app/theme/foundation/base.css`
  - or `src/app/theme/surfaces/viewport-overlay.css`
- focused proof:
  - `src/app/components/ViewToolbar.test.tsx`
  - `src/app/AppShell.test.tsx`
- docs update targets after implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not widen into popout-window resize work
- do not refactor every floating shell concern at once
- do not erase real host-specific min-size or clamp rules just to force one shape
- do not copy-paste the toolbar resize implementation into every host if a real shared owner is clear

#### Implementation Risks

- pretending the current toolbar resize logic is already generic when it is still local to `ViewToolbar`
- widening too far into a giant floating-window framework instead of landing resize parity
- over-normalizing shell min sizes and clamp rules that should stay host-specific
- landing resize in one sibling shell but leaving the other floating hosts behind

#### Checklist

- [ ] identify the honest shared owner for resize handles plus resize pointer state
- [ ] extend all-edge resize to `Dashboard`, `Notepad`, and detached floating viewer shells
- [ ] extend all-corner resize to `Dashboard`, `Notepad`, and detached floating viewer shells
- [ ] preserve drag and quick-dock behavior in every widened shell
- [ ] keep host-specific minimum size and clamp rules honest
- [ ] avoid a fake genericization that only moves copy-paste around

#### Verification Shape

Minimum verification for this phase should cover:

- floating `Dashboard` resizes from edges and corners
- floating `Notepad` resizes from edges and corners
- detached floating model viewport resizes from edges and corners
- drag and quick-dock still work after resize on each widened shell
- the shared owner is explicit enough that resize no longer lives only inside `ViewToolbar`

#### Done Shape

`Phase 6` is done when:

- all real floating shells in the main viewport area support the same resize affordance shape as the `View` toolbar
- the owner for floating resize is no longer toolbar-only
- shell-specific clamp and minimum-size differences still read honestly
- the pass lands as a clean shared-shell widening step instead of a sprawling floating-window rewrite

Current status:
- `Phase 6` is planned, not started
- the current all-edge and corner resize contract still lives only in `ViewToolbar.tsx`
- the next honest widening step is to extend that affordance to the other floating shell users through one explicit shared owner
