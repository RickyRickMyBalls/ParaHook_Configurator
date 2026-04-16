# Browser Phase Browser-13 - Phase 2 - Re-Adjustable Docked And Floating Browser Size

## Doc Header

### Doc History
6. 2026-04-15 15:02: Shipped `Phase 2.3` by re-homing the shared docked resize handle onto the full left-dock content edge, so the docked Browser/right-rail seam is now reachable where users expect it and the overall Browser `Phase 2` resize pass now reads as complete
5. 2026-04-15 15:00: Added `Phase 2.3 - Reachable Shared Right-Edge Dock Resize Seam` after read-only investigation showed the docked shared-width controller still works in code but the real user-facing seam likely sits in the wrong dock sub-container and may be clipped by overflow, so Browser needs one more docked follow-up to make the shared right-edge resize target actually reachable in the live UI
4. 2026-04-15 14:42: Added direct floating Browser resize handles and explicit stored width/height sizing to ship `Phase 2.2`, so the umbrella `Phase 2` pass now reads as complete across both the shared docked width seam and the floating resize affordance half
3. 2026-04-15 13:31:42: Split `Phase 2` into Codex-sized subphases so docked left-rail width behavior and floating Browser resize affordances can land one at a time through separate `2.1` and `2.2` slices instead of one oversized mixed implementation pass
2. 2026-04-15 13:27:44: Tightened the docked half of `Phase 2` by locking one explicit requirement that dragging the docked Browser resize seam must widen the whole primary left rail, including the ParaHook Generator title/status panel above Browser, rather than introducing a Browser-only inner width change
1. 2026-04-15 13:22:54: Created this standalone future Browser phase doc to track the second `Browser-13` follow-on, locking one implementation-ready resize pass that lets users re-adjust Browser size in both docked and floating modes while reusing the current workspace-shell ownership and persistence seams

### Purpose

This phase makes Browser size user-adjustable in the host modes where Browser already lives today.

Use it to:
- let users re-adjust docked Browser width in the left rail
- let users re-adjust floating Browser window size directly
- keep Browser size changes persisted through the existing workspace shell state
- improve Browser usability without reopening Browser hierarchy or host-mode architecture

## Doc Body

## [x] Browser-13 - Phase 2

### Summary

`Browser-13 - Phase 2` is the second concrete cleanup slice inside `Browser-13`.

`Phase 1` fixed the Browser's vertical containment and overflow behavior.

The next remaining usability gap is size control:
- when Browser is docked, users need a clear way to decide how wide the Browser should be
- when Browser is floating, users need a direct way to re-size the window instead of accepting only the default shell size

This phase keeps the scope narrow:
- use the existing left-dock width seam for docked Browser
- expose a normal floating-window resize affordance for floating Browser
- preserve current docking, popout, split, and Browser content behavior
- when Browser is docked, resizing should widen the full left rail so the ParaHook Generator title/status panel above Browser grows with it
- split implementation into Codex-sized follow-ons so docked and floating resize work can land independently

### Shipped Result

- docked Browser width stays on the shared `leftDockWidth` rail contract
- the docked shared resize seam is now reachable on the visible right edge of the Browser / whole left rail
- floating Browser now supports direct edge/corner resizing through the existing `browserShell.size` contract
- focused dock and floating resize proofs are in place without reopening Browser hierarchy or host-mode architecture

### Owns

- user-adjustable docked Browser width through the shared left-dock width seam
- user-adjustable floating Browser size through the existing Browser floating shell contract
- clamp and persistence behavior for Browser size changes in both modes
- Browser resize affordances that feel intentional and discoverable without changing Browser truth
- the rule that docked Browser resize affects the whole left rail presentation, not only the Browser body below the status panel

### Does Not Own

- Browser hierarchy or ownership changes
- new Browser host modes
- Browser content/body overflow behavior beyond what is required to keep resizing safe
- redesigning the entire app-shell docking system
- widening left-dock semantics beyond what Browser already shares with that rail

### Locked Direction

- keep docked Browser width on the current shared left-dock width contract:
  - do not create a second Browser-only dock-width state unless the shared seam proves impossible
  - the visible resize seam stays on the right edge of the whole left rail
  - widening the docked Browser should also widen the ParaHook Generator title/status panel above it because both live inside the same left-dock shell
- let floating Browser resize like a normal floating window:
  - prefer direct edge and/or corner drag affordances over hidden or menu-only sizing
- preserve the current Browser shell persistence:
  - size changes should keep using Browser workspace shell state instead of ephemeral local component state
- keep the phase resize-focused:
  - no hidden Browser hierarchy, row, or command changes inside the implementation

### Current Gap

Browser size behavior is only partially user-controlled today.

Current rough edges:
- docked Browser width depends on the shared left-dock seam, but this is not yet treated as an explicit Browser-sized usability phase
- the docked requirement needs to stay visually honest:
  widening Browser should widen the whole left rail instead of creating a narrower title/status panel above a wider Browser body
- floating Browser already stores a size contract, but users still need a direct resize affordance to actually adjust that size
- Browser size adjustments need to stay bounded so they do not break viewport space, left-dock split behavior, or drag/dock transitions

### Current Live Phase 2 Seams

- `src/app/workspace/useWorkspaceStore.ts`
  - `leftDockWidth` already exists as persisted workspace shell state
  - `browserShell.size` already exists as persisted floating Browser size state
  - `setLeftDockWidth` and `setBrowserFloatingSize` already round and persist those values
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - the docked Browser already lives in the primary left dock and already renders the shared `.PrimaryViewportLeftDockResizeHandle`
  - the ParaHook Generator title/status panel and Browser panel already share the same `PrimaryViewportLeftDock` width, so the correct docked implementation is to keep resizing the whole rail from its right edge
- `src/app/hosts/useAppShellDockController.ts`
  - the shared left-dock resize controller already owns pointer-driven dock-width updates
- `src/app/hosts/BrowserDockHost.tsx`
  - floating Browser already reads `browserShell.size`
  - `clampBrowserFloatingSize` already constrains floating Browser width and height against the live app-shell/viewport frame
  - `setBrowserFloatingSize` is already used by the host, so the storage path is real
- `src/app/theme/shell/windows.css`
  - `.BrowserFloatingWindow` already declares min/max shell bounds, which means the likely missing work is the visible resize seam rather than a new Browser size model

### Locked Phase 2 In-Scope

- making docked Browser width adjustment an explicit, supported Browser usability path through the shared left-dock width seam
- preserving the shared-width behavior so the top title/status panel grows together with the docked Browser
- adding or refining a user-facing floating Browser resize affordance
- preserving and verifying Browser size persistence and clamping in both modes
- adding or refining tests around Browser resize behavior

### Locked Phase 2 Out-Of-Scope

- introducing a separate Browser-only dock width state
- redesigning the left-dock resize menu beyond what is needed for Browser sizing
- changing Browser content semantics, row rendering, or Browser-local commands
- broad app-shell floating window standardization outside the Browser slice

### Implementation Direction

1. Keep docked Browser width on the existing shared left-dock width seam.
2. Keep the docked visible resize seam on the right edge of the full left rail so the ParaHook Generator title/status panel and Browser widen together.
3. Treat that dock-width path as Browser-owned usability when Browser is docked, rather than duplicating width storage.
4. Add a direct floating Browser resize seam or handle path that updates `browserShell.size`.
5. Reuse the existing Browser floating clamp logic instead of adding a second floating-size ruleset.
6. Verify that docked/floating size changes survive mode transitions where appropriate and do not destabilize console anchoring, split previews, or Browser drag behavior.

### Tracked Subphases

- `Browser-13 - Phase 2.1 - Docked Browser Width Uses The Shared Left Rail Resize Seam`
  - lock the docked Browser half to the existing shared left-dock width path
  - prove that dragging the right edge widens the whole left rail, including the ParaHook Generator title/status panel above Browser
  - keep this slice mostly about explicit Browser ownership, tests, and any light dock-polish needed for clarity
- `Browser-13 - Phase 2.2 - Floating Browser Window Resize Affordances`
  - shipped:
    floating Browser now exposes direct edge/corner resize handles, writes explicit width plus height through the existing `browserShell.size` and clamp contract, and has focused Browser host proof for direct resize plus shell-bound clamping while the two older popup split-menu failures in untouched popout-path tests remain unchanged
- `Browser-13 - Phase 2.3 - Reachable Shared Right-Edge Dock Resize Seam`
  - shipped:
    the shared docked resize handle now lives on the full left-dock content edge instead of the inner Browser stack shell, so users can grab the visible Browser/right-rail edge while the existing shared `leftDockWidth` controller and focused dock-resize proofs remain intact

### Concrete Implementation Targets

Primary expected targets:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/theme/shell/windows.css`
- `src/app/theme/shell/docks.css`
- `src/app/workspace/useWorkspaceStore.ts`

Supporting targets if needed:
- `src/app/AppShell.test.tsx`
- `src/app/hosts/BrowserDockHost.test.tsx`
- `src/app/workspace/PrimaryViewportLeftDock.tsx`

### Tests

- docked Browser width:
  - users can re-adjust the left-docked Browser width through the shared left-dock seam
  - the resulting width persists in workspace state
  - the ParaHook Generator title/status panel above Browser widens together with the Browser because both still share the same left-rail width
  - console/list anchoring and left-dock split behavior still respect the new width
- floating Browser size:
  - users can directly resize the floating Browser
  - the new width/height persist in `browserShell.size`
  - floating Browser stays clamped to sane min/max bounds inside the app shell
- non-regression:
  - Browser drag-to-move still works in floating mode
  - dock, popout, quick-dock, and split transitions still work after resize changes
  - docked Browser overflow behavior from `Phase 1` stays intact after width changes

### Questions / Decisions

#### [ ] q1 - Should docked Browser continue to use the shared left-dock width state instead of a Browser-only width state?

Question:
- when Browser is docked, should width continue to be stored only through `leftDockWidth` instead of adding a new Browser-specific dock-width field?

Suggestion:
- yes
- keep one left-rail width contract

#### [ ] q1.1 - Should the docked resize seam remain the full left-rail right edge so the title/status panel widens too?

Question:
- when the user widens the docked Browser, should that still happen by dragging the right edge of the whole left rail so the ParaHook Generator title/status panel above Browser grows too?

Suggestion:
- yes
- keep the docked resize visually honest to the shared left-rail shell

#### [ ] q2 - Should floating Browser expose direct edge/corner resizing in the first pass?

Question:
- should the first implementation pass give floating Browser a normal draggable resize affordance at the window edge/corners rather than waiting for a menu or preset-based follow-on?

Suggestion:
- yes
- match normal floating-window expectations first

#### [ ] q3 - Should the phase keep docked and floating Browser resize together instead of splitting them into separate subphases?

Question:
- since both behaviors are part of one Browser sizing story, should `Phase 2` keep docked-width and floating-size adjustment together unless the implementation proves too large?

Suggestion:
- yes
- one phase is cleaner if the work stays bounded

### Assumptions

- the Browser already has enough state and clamp infrastructure that this phase can stay small and mostly UI/host-plumbing focused
- docked Browser should benefit from the existing shared left-dock width seam rather than diverging from it
- the correct docked behavior is one shared left-rail width for both the title/status panel and the Browser panel beneath it
- floating Browser resizing should feel like a normal shell affordance and should not require a new Browser-specific persistence model
