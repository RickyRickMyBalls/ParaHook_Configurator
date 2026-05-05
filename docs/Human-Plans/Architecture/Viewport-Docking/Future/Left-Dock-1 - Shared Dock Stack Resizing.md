# Left-Dock-1 - Shared Dock Stack Resizing

## Doc Header

### Doc History
3. 2026-05-02 10:28:45: Implemented `Left-Dock-1 / Phase 1 - Read-Only Shared Stack Resizing Baseline` by adding shell-owned persisted stack-height and split-ratio state, wiring bottom-edge plus shared-divider drag behavior into the left-dock controller and shell, aligning the left-dock CSS height contract with real two-panel minimums, and proving Browser-only plus Browser/Meatball resize coverage with focused AppShell regressions
2. 2026-05-02 10:21:21: Prepped `Left-Dock-1 / Phase 1 - Read-Only Shared Stack Resizing Baseline` for implementation by grounding the first code cut in the live `PrimaryViewportLeftDock.tsx`, `useAppShellDockController.ts`, `useWorkspaceStore.ts`, `workspaceShellTypes.ts`, and existing AppShell left-dock test seams, while tightening handle visibility rules, likely files, stop rules, and focused verification expectations
1. 2026-05-02 10:16:10: Created this first `Left-Dock-1` family phase doc under `Viewport-Docking/Future/`, translating the new left-dock family into one narrow shared-stack resizing phase covering Browser-only bottom-edge height control, shared Browser/Meatball divider control, total hosted stack height control, and Runtime Inspector participation in the same dock contract

### Purpose

This doc defines the first implementation-ready family phase for the `Left Dock` family.

Use it to answer:
- what the first left-dock runtime slice should do
- what read-only behavior the shell should prove first
- which state the left dock should own directly
- how Browser, Meatball Editor, and Runtime Inspector should participate in the same stack contract
- which files are most likely to own the first implementation cut

Do not use it for:
- broad left-dock north-star reasoning that belongs in the vision doc
- later dock-surface expansion ideas beyond the first shared resizing baseline
- panel-content behavior changes inside Browser, Meatball Editor, or Runtime Inspector

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for preserving the shared workspace-shell direction

- `docs/Human-Plans/Architecture/Viewport-Docking/Left-Dock-Vision.md`
  - left-dock north-star and ownership boundaries
  - useful for what must stay true while implementing this phase

- `docs/Human-Plans/Architecture/Viewport-Docking/Left-Dock-Gen1-Index.md`
  - active generation index
  - useful for HLG mapping and family-phase position

## Doc Body

### Phase Summary

`Left-Dock-1` should be the first honest implementation phase for the hosted primary-left-dock stack.

The current dock already owns width and preview targeting, but it does not yet own vertical layout honestly enough.

Today the main left-dock stack still reads like:
- shared width is real
- Browser is the de facto default panel
- Meatball Editor expands through a layout special case
- there is no real explicit total stack-height owner
- there is no real explicit internal divider owner

This phase should fix that planning gap by introducing one narrow left-dock stack model.

### Current Code Read

Current left-dock structure is centered around:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - renders the shared left-dock shell
  - hosts the Browser and Meatball portal targets
  - currently exposes only the outer width resize handle
- `src/app/hosts/useAppShellDockController.ts`
  - owns current left-dock width dragging and resize-menu behavior
  - does not yet own vertical stack resizing
- `src/app/theme/shell/docks.css`
  - currently expresses the Browser/Meatball relationship as stacked flex targets
  - Browser is flexible
  - Meatball appears by switching to an occupied/preview-active flex state
- `src/app/hosts/BrowserDockHost.tsx`
  - owns Browser hosting behavior but not shared left-dock vertical layout truth
- `src/app/hosts/SpaghettiWindowHost.tsx`
  - participates in the dock-preview and docked Meatball hosting path but is not the right owner for shared left-dock stack layout rules

That means the first honest owner for this phase should stay with the left-dock shell and workspace-shell state rather than being pushed into Browser- or Meatball-specific hosts.

### Implementation Direction

The first implementation cut should introduce one shared left-dock vertical layout model with:
- total hosted stack height
- internal split ratio between active hosted participants
- minimum-height rules per participant
- conditional resize-handle visibility based on actual occupancy

Recommended first model:
- `leftDockWidth`
  - keep existing ownership
- `leftDockStackHeight`
  - new shared owner for total visible hosted stack height below the title/status area
- `leftDockStackSplitRatio`
  - new shared owner for the Browser versus lower-panel relationship when more than one hosted participant is present

Recommended first behavior:
- Browser only
  - user can drag the bottom edge to change Browser height
- Browser + Meatball Editor
  - user can drag the shared middle divider to change the Browser/Meatball split
  - user can drag the bottom edge to change the total stack height
- Browser + Runtime Inspector
  - same contract as Browser + Meatball
- Browser + Meatball + Runtime Inspector
  - do not widen into a three-divider solution in this first phase unless the real layout model stays simple and explicit

Important first-phase rule:
- Runtime Inspector must be planned against the same contract from the start, but this phase should still avoid turning the first code cut into a full arbitrary stack-layout engine

### Likely Files

Most likely first-phase owners:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/theme/shell/docks.css`
- focused left-dock AppShell / dock-host tests

Possible later-touch files if required by the exact hosted-panel path:
- `src/app/AppShell.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`

### Phase Boundaries

This phase should own:
- shared left-dock stack-height state
- shared left-dock internal-divider state
- shell resize-handle rendering rules
- read-only shell validation for the first pass if it proves the real ownership model
- Runtime Inspector participation planning in the same dock contract

This phase should not own:
- Browser feature behavior changes
- Meatball Editor feature behavior changes
- Runtime Inspector content changes
- arbitrary left-dock panel reordering
- generalized multi-slot stack composition beyond what the first narrow layout model can support honestly

## Wishlist Organization

### High Level Goals

- [x] `LD-G1-HLG-1 - Make the primary left dock a real shared stack layout instead of a Browser-first column with one-off hosted panel expansion rules.`
- [x] `LD-G1-HLG-2 - Give users honest control over total left-dock stack height and internal panel relationships when multiple hosted surfaces are present.`
- [x] `LD-G1-HLG-3 - Keep Browser, Meatball Editor, and Runtime Inspector on one shared dock contract with persistence-ready ownership instead of surface-local resize hacks.`

### `Left-Dock-1 Phase 1`

- [x] `LD-G1-HLG-1` Add explicit shell-owned left-dock stack-height and shared-divider state planning before runtime changes widen further.
- [x] `LD-G1-HLG-2` Define the first read-only shell interaction contract for:
  - Browser-only bottom-edge resize
  - Browser/Meatball shared-divider resize
  - Browser/Meatball total stack bottom-edge resize
- [x] `LD-G1-HLG-3` Keep Runtime Inspector in the same participant contract and file-owner model even if its first runtime hookup lands after the shell baseline.

## [x] `Left-Dock-1` - `Phase 1 - Read-Only Shared Stack Resizing Baseline`

### Phase 1 Summary

First implementation step:
- prove the left-dock shell can own total stack height and shared-divider behavior honestly before any deeper hosted-panel expansion

What Phase 1 should make true:
- left-dock stack-height state exists explicitly
- left-dock shared-divider state exists explicitly
- the left-dock shell renders the necessary bottom-edge and shared-divider handles only when appropriate
- the first interaction pass can be validated in read-only form without faking ownership in Browser or Meatball hosts

### Phase 1 Implementation Spec

Suggested first cut:
1. Add new left-dock layout state to the workspace shell layer.
2. Teach `PrimaryViewportLeftDock.tsx` to render:
   - a bottom-edge stack-height handle
   - a shared middle divider when both upper and lower participants are active
3. Extend `useAppShellDockController.ts` with vertical drag handling for:
   - total stack height
   - shared split ratio
4. Update dock CSS so Browser, Meatball, and later Runtime Inspector can participate through explicit sized regions instead of implicit flex-open behavior alone.
5. Add focused tests that prove the shell exposes the right handles for:
   - Browser only
   - Browser + Meatball
   - Runtime Inspector participation planning path

Locked owner read for Phase 1:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
  - should stay the visual owner for left-dock vertical handle rendering
  - should not push shared stack-height ownership into `BrowserDockHost.tsx` or `SpaghettiWindowHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
  - should become the shared pointer/drag owner for the new vertical resize interactions
  - should extend the current left-dock width seam rather than inventing a second left-dock controller
- `src/app/workspace/useWorkspaceStore.ts`
  - should own the new persisted stack-height and split-ratio state
- `src/app/workspace/workspaceShellTypes.ts`
  - should define the new left-dock layout state shape and defaults

Exact first-pass handle rules:
- Browser only
  - show the existing right-edge width handle
  - show a new bottom-edge stack-height handle
  - do not show a shared middle divider
- Browser + Meatball
  - show the existing right-edge width handle
  - show the bottom-edge stack-height handle
  - show a shared middle divider between Browser and Meatball
- Browser + Runtime Inspector
  - same handle rules as Browser + Meatball
- Browser + Meatball + Runtime Inspector
  - Phase 1 should not promise two independent internal dividers
  - if the current runtime hookup would force that widening immediately, stop and split a follow-on instead of broadening the first cut silently

Runtime Inspector honesty rule:
- Phase 1 does not need to ship the Runtime Inspector content hookup
- Phase 1 does need to keep its participant contract explicit in state shape, naming, and handle logic so the later hookup does not require a second layout model

Verification expectation:
- focus on shell-level layout and handle visibility first
- do not block the phase on Runtime Inspector content behavior if the shared dock contract is already proven honestly

Stop rule:
- if the first pass starts turning into a fully arbitrary multi-panel stack engine, stop and split a `Left-Dock-2` follow-on instead of smuggling that widening into this baseline phase
- if implementing the shared divider requires moving panel-content ownership into Browser- or Meatball-specific hosts, stop and re-tighten the shell-owner seam before continuing

Likely file change set for Phase 1:
- `src/app/workspace/PrimaryViewportLeftDock.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/theme/shell/docks.css`
- `src/app/AppShell.tsx`
- `src/app/AppShell.test.tsx`

Focused verification target for Phase 1:
- extend the existing left-dock AppShell test band that already proves:
  - left-dock width resizing
  - left-dock resize menu behavior
  - docked Meatball occupancy behavior
- add explicit shell-level assertions for:
  - Browser-only bottom-edge handle visibility
  - Browser + Meatball shared-divider visibility
  - shared stack-height state changing through controller-driven pointer drags
  - no accidental widening into a second independent multi-panel divider model

### Phase 1 Result

Implemented outcome:
- the workspace shell now persists explicit `leftDockStackHeight` and `leftDockStackSplitRatio` state alongside width
- the left-dock shell now renders a bottom-edge stack-height handle for Browser-only hosting and a shared middle divider plus bottom-edge height handle when Browser and Meatball are stacked
- the shared controller now owns width, stack-height, and shared-divider pointer drags through one left-dock seam
- the shell and CSS now agree on a real two-panel minimum-height contract instead of relying on flex-open behavior alone
- Runtime Inspector remains unhooked for content in this phase, but the state naming and participant contract stay shared so its future hookup does not require a second layout model

Verification read:
- `npm.cmd exec -- tsc --noEmit`
- `npm.cmd exec -- vitest run src/app/AppShell.test.tsx:9240 src/app/AppShell.test.tsx:9293`
