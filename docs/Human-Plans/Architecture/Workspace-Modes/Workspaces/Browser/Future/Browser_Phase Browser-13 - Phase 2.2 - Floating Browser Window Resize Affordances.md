# Browser Phase Browser-13 - Phase 2.2 - Floating Browser Window Resize Affordances

## Doc Header

### Doc History
3. 2026-04-15 14:42: Added direct floating Browser edge/corner resize affordances in `BrowserDockHost`, switched the floating shell onto explicit stored width plus height sizing instead of the older implicit height-sync path, and covered the new resize plus clamp behavior with focused Browser host tests while the two existing popup split-menu failures in the untouched popout path remained unchanged
2. 2026-04-15 13:36:41: Tightened `Phase 2.2` into an implementation-ready slice by grounding it in the live floating Browser host, where `browserShell.size`, `setBrowserFloatingSize`, and `clampBrowserFloatingSize` already exist but the rendered floating shell still applies width-only inline sizing and lacks direct resize handles, so the next pass can focus on one explicit pointer-resize interaction and regression coverage
1. 2026-04-15 13:31:42: Created this standalone future Browser subphase doc to isolate the floating half of `Phase 2`, locking one Codex-sized slice around adding real floating Browser resize affordances on top of the already-persisted `browserShell.size` and existing floating-size clamp logic

### Purpose

This subphase adds direct user-facing resizing to the floating Browser window.

Use it to:
- add visible floating Browser resize affordances
- route resize changes through the existing `browserShell.size` state
- preserve floating Browser clamp, drag, dock, popout, and split behavior

## Doc Body

## [x] Browser-13 - Phase 2.2

### Summary

`Browser-13 - Phase 2.2` isolates the floating Browser half of `Phase 2`.

The storage and clamp contract already exists:
- floating Browser already persists `browserShell.size`
- `BrowserDockHost.tsx` already owns `clampBrowserFloatingSize`

The missing piece is direct user control:
- the floating Browser needs a normal resize seam or handle set so users can intentionally change width and height

### Shipped Result

- floating Browser now exposes direct edge and corner resize affordances
- pointer-driven resize updates the persisted `browserShell.size` contract directly
- floating Browser now renders with explicit stored width and height instead of relying on the older indirect floating-height sync seam
- focused Browser host tests now prove direct resize and clamp behavior
- the two pre-existing popup split-menu failures in the untouched popout path remain outside this phase and were not introduced by the resize work

### Owns

- floating Browser edge and/or corner resize affordances
- pointer behavior that updates `browserShell.size`
- clamp and persistence verification for floating Browser size changes

### Does Not Own

- docked Browser width behavior
- Browser hierarchy or content behavior
- broad floating-window standardization outside the Browser slice

### Current Live Seams

- `src/app/hosts/BrowserDockHost.tsx`
  - floating Browser already reads `browserShell.size`
  - `setBrowserFloatingSize` already exists
  - `clampBrowserFloatingSize` already constrains size against the live app-shell frame
  - the floating shell render already applies `left`, `top`, and `width`, but not an explicit stored `height` style
  - height is currently fed back into state through the existing `ResizeObserver`, which means visible resize interaction is still the missing top-level seam
- `src/app/theme/shell/windows.css`
  - `.BrowserFloatingWindow` already has min/max shell bounds
- `src/app/workspace/useWorkspaceStore.ts`
  - `browserShell.size` already persists width and height
- `src/app/hosts/BrowserDockHost.test.tsx`
  - current coverage already proves floating Browser window presence, drag-out, re-dock, and width clamping behavior
  - the missing coverage is direct user resize interaction

### Implementation Direction

1. Add visible floating Browser resize affordances at the window edge and/or corners.
2. Route pointer-driven size changes through `setBrowserFloatingSize`.
3. Reuse `clampBrowserFloatingSize` instead of inventing a second floating-size ruleset.
4. Verify that drag-to-move, quick dock, popout, and split transitions still work after floating resize lands.

### Implementation Prep

#### Current live 2.2 seams

- `src/app/hosts/BrowserDockHost.tsx`
  - already owns the floating Browser window node, drag state, clamp logic, and store writes
  - this is the clear primary owner for resize handles and pointer-resize state
  - because drag already uses the title bar, resize should stay on dedicated edge/corner affordances instead of overloading the title bar gesture
- `src/app/theme/shell/windows.css`
  - already gives `.BrowserFloatingWindow` shell-local bounds and overflow behavior
  - this is the likely home for handle positioning and resize cursor styling
- `src/app/workspace/useWorkspaceStore.ts`
  - already persists both width and height, so no new Browser persistence model should be needed
- `src/app/hosts/BrowserDockHost.test.tsx`
  - already has the right harness and geometry mocks for floating Browser behavior
  - this is the right place to add pointer-driven resize tests without widening AppShell unnecessarily

#### Locked 2.2 in-scope

- adding direct floating Browser resize affordances
- updating `browserShell.size` through pointer interaction
- preserving existing clamp behavior and persistence
- adding focused floating Browser resize tests

#### Locked 2.2 out-of-scope

- docked Browser width work
- redesigning Browser drag-to-move
- floating Browser visual redesign beyond what resize affordances require
- broader floating-window standardization for other surfaces

#### Preferred 2.2 implementation shape

1. Add one small set of explicit resize handles on the floating Browser shell.
2. Keep drag-to-move on the title bar and resize on the dedicated handles.
3. Route every resize step through `clampBrowserFloatingSize`.
4. Apply both width and height explicitly on the floating shell once resize becomes user-driven, instead of relying on indirect height sync alone.
5. Add focused BrowserDockHost tests for resize, clamp, and non-regression.

#### Concrete implementation targets

Primary expected edits:
- `src/app/hosts/BrowserDockHost.tsx`
  - add resize-handle DOM, pointer-resize state, and store updates
  - apply explicit floating shell height alongside width if needed once resize becomes direct
- `src/app/theme/shell/windows.css`
  - add resize-handle positioning, hit areas, and cursors
- `src/app/hosts/BrowserDockHost.test.tsx`
  - add direct pointer-resize coverage

Supporting edits if needed:
- `src/app/workspace/useWorkspaceStore.ts`
  - only if a small helper or normalization seam makes Browser size writes cleaner
- `src/app/AppShell.test.tsx`
  - only if one end-to-end proof is useful after the host-level tests land

### Concrete Implementation Targets

Primary expected targets:
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/theme/shell/windows.css`
- `src/app/hosts/BrowserDockHost.test.tsx`

Supporting targets if needed:
- `src/app/AppShell.test.tsx`
- `src/app/workspace/useWorkspaceStore.ts`

### Tests

- users can resize the floating Browser directly
- width and height changes persist in `browserShell.size`
- floating Browser remains clamped to sane min/max bounds
- floating Browser drag-to-move still works
- quick dock, popout, and split transitions still work after resizing

### Verification

- passed `npm.cmd test -- BrowserDockHost.test.tsx -t "lets the user resize the floating browser from the south-east handle and persists width and height"`
- passed `npm.cmd test -- BrowserDockHost.test.tsx -t "clamps floating browser resize within the app shell frame"`
- passed `npm.cmd test -- BrowserDockHost.test.tsx -t "shows separate quick dock and popout controls for a floating browser"`
- full `npm.cmd test -- BrowserDockHost.test.tsx` still reports the same two existing popup split-menu failures in untouched popout-path tests:
  - `lets a popped-out browser split from the popup workspace titlebar menu`
  - `opens the popup split menu from the browser pane top strip even when the precise header target is missed`

### Assumptions

- the floating half is the higher-risk implementation slice, so it should land separately from the docked seam verification
- most of the runtime state work already exists, so the main implementation burden is the resize interaction and its regression coverage
