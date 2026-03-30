# 9 - Workspace 5.2 Spaghetti Editor Detached Popup Blank Surface

## Doc History
2. 2026-03-30 14:00: Added the focused child-window investigation read showing that the real Spaghetti subtree still binds most resize, pointer, and animation work to the opener's global `window`, while the current popup tests still mock `SpaghettiPanel`, so the remaining blank-popup bug is now most likely a child-window portability seam inside the real editor subtree rather than just popup wrapper lifecycle
1. 2026-03-30 13:54: Created this bug note to track the still-open post-`Workspace 5.2` detached Spaghetti Editor popup regression where the child window now opens and stays alive but still renders only a dark blank surface instead of the real editor UI

## Status

- `[investigating]`

## Summary

After the `Workspace 5.1` and `Workspace 5.2` editor pop-out work landed:
- clicking `PO` can now open the detached browser window
- the popup no longer immediately collapses back in most recent repair passes
- but the child window still renders as a dark blank surface instead of the real Spaghetti Editor UI

This no longer looks like the original popup-blocker or immediate-close problem.
It now looks like a detached-editor render ownership or child-window render-path failure that was exposed by the `Workspace 5.2` multi-surface widening.

## User-Facing Symptom

- user clicks `PO` on the Spaghetti Editor titlebar
- a new browser window opens with the expected title
- the popup URL remains `about:blank`
- the popup background color is correct or close to correct
- but the real editor surface never appears
- the main app window may remain alive, but the detached editor window is still visually blank

## Strongest Current Regression Read

The most likely root regression was introduced in `Workspace 5.2`, not `Workspace 5.3`.

`Workspace 5.2` widened editor ownership into two partially overlapping models:

- shared workspace placement and binding truth in:
  - `src/app/workspace/useWorkspaceStore.ts`
- legacy active-editor runtime truth still centered in:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
- detached editor rendering that still mixes both in:
  - `src/app/hosts/SpaghettiWindowHost.tsx`

That means the detached popup path can now fail even when:
- the popup window opens correctly
- the popup host element exists
- the old active-editor compatibility bridge still thinks one surface is dominant

The popup appears to be landing in an in-between state where:
- child-window lifecycle is good enough to open the popup
- but detached editor rendering is still not fully driven by one stable canonical detached-surface record

## Why `Workspace 5.2` Is The Most Likely Phase That Regressed This

The shipped `Workspace 5.2` cut explicitly changed:

- editor surface graph-binding truth to live in the shared workspace seam
- detached `separateWindow` editor surfaces to render per viewport instance
- the old single active-editor bridge to remain only as compatibility behavior

That was the correct direction for multiple live editor surfaces, but it also created a split-brain detached editor path:

- workspace store now owns detached placement truth
- spaghetti store still owns much of the live viewport/runtime identity
- `SpaghettiWindowHost` still mixes active viewport assumptions, ordered viewport derivation, and workspace placement truth

That mixed ownership explains why `Workspace 5.2` produced both:
- the startup dark blue-black regression
- this still-open detached popup blank-surface regression

## What We Have Tried So Far

### Attempt 1 - Startup selector-stability repair

Tracked in:
- `docs/CHANGELOG.md` entry `[742]`

What changed:
- removed the direct `useSpaghettiStore(selectOrderedEditorViewports)` subscription from `SpaghettiWindowHost`
- switched the host to stable `editorViewportsById` and `editorViewportOrder` slices with local `useMemo`

Outcome:
- helped fix the startup dark blue-black screen
- did not fix the detached popup blank-surface problem

### Attempt 2 - Pop-out gesture window claim repair

Tracked in:
- `docs/CHANGELOG.md` entry `[743]`

What changed:
- pre-opened the child window directly from the `PO` click gesture
- let the shared child-window hook claim that already-opened popup

Outcome:
- addressed popup-blocker and immediate-close behavior
- did not make the real editor UI appear in the popup

### Attempt 3 - StrictMode-safe child-window lifecycle

Tracked in:
- `docs/CHANGELOG.md` entry `[744]`

What changed:
- added a child-window registry keyed by `childWindowId`
- delayed cleanup-close so React `StrictMode` remount could reclaim the popup

Outcome:
- reduced or removed the immediate-close-on-open behavior
- did not solve the blank detached surface

### Attempt 4 - Popup freeze-loop callback stability

Tracked in:
- `docs/CHANGELOG.md` entry `[745]`

What changed:
- stabilized callback identities passed into the popup host path

Outcome:
- helped stop cross-window freeze behavior
- did not make the detached editor content render

### Attempt 5 - Popup focus-loop removal

Tracked in:
- `docs/CHANGELOG.md` entry `[746]`

What changed:
- stopped refocusing already-open popup windows on rerender

Outcome:
- improved responsiveness and avoided repeated focus churn
- popup still remained visually blank

### Attempt 6 - Pop-out editor shell layout parity

Tracked in:
- `docs/CHANGELOG.md` entry `[747]`

What changed:
- wrapped popup content in the same editor shell structure as the in-app floating editor

Outcome:
- made the structural popup shell path more correct
- no visible editor UI appeared yet

### Attempt 7 - Detached popup non-overlay layout override

Tracked in:
- `docs/CHANGELOG.md` entry `[748]`

What changed:
- overrode the in-app floating overlay layout rules for popup content
- made the child window fill itself more like a real window surface

Outcome:
- improved popup layout assumptions
- blank popup still remained

### Attempt 8 - Detached popup render ownership fallback

Tracked in:
- `docs/CHANGELOG.md` entry `[749]`

What changed:
- widened detached popup discovery so `SpaghettiWindowHost` can derive separate-window surfaces from shared workspace placement truth even if the old ordered viewport path drifts

Outcome:
- this is the closest repair to the likely `Workspace 5.2` regression seam
- but the user still reports the popup is blank after the patch

## Current Best Read

This is probably no longer a pure popup lifecycle bug.

The strongest remaining read is:
- the popup document and host now exist
- the detached surface is at least partially recognized
- but the real Spaghetti Editor subtree still is not painting correctly in the child-window path

That means the next debugging step should focus on:
- the detached editor render path inside `SpaghettiWindowHost`
- the `SpaghettiPanel` / `SpaghettiEditor` / `ExpandedEditor` / `SpaghettiCanvas` subtree under a child-window document
- any remaining assumption that a live editor surface must still be rooted in the main app window or the dominant active viewport bridge

## Most Suspicious Code Seam

- `src/app/hosts/SpaghettiWindowHost.tsx`
  - detached popup surface discovery
  - popup render loop
  - detached surface activation path
- `src/app/workspace/useWorkspaceChildWindow.ts`
  - shared popup lifecycle and host mounting
- `src/app/panels/SpaghettiPanel.tsx`
  - main editor shell composition
- `src/app/spaghetti/ui/ExpandedEditor.tsx`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - likely child-window-sensitive editor render/runtime seam

## Focused Investigation Findings

The strongest new code-read finding is that the real detached editor subtree is still not child-window-native.

### Finding 1 - `SpaghettiPanel` still binds window-scoped behavior to the opener window

`src/app/panels/SpaghettiPanel.tsx` still uses the global module `window` for:
- resize listeners
- pointermove / pointerup drag cleanup
- toolbar resize behavior
- window-settings resize behavior
- debug drawer resize behavior

That means when the panel is portaled into a child browser window, these effects and drag listeners still bind to the opener window instead of the popup's `ownerDocument.defaultView`.

### Finding 2 - `SpaghettiCanvas` is even more heavily tied to the opener window

`src/app/spaghetti/canvas/SpaghettiCanvas.tsx` still uses the global module `window` for:
- `requestAnimationFrame` / `cancelAnimationFrame`
- resize listeners
- pointerdown / pointermove / pointerup / pointercancel listeners
- drag session cleanup
- node add menu focus timing
- temporary viewer drag helpers

This is now the strongest child-window portability risk in the real editor subtree.

### Finding 3 - current popup coverage does not exercise the real editor subtree

`src/app/hosts/SpaghettiWindowHost.test.tsx` currently mocks `SpaghettiPanel`.

That means the popup tests do prove:
- popup shell lifecycle
- detached surface discovery
- popup host rendering

But they do not prove:
- real `SpaghettiPanel` behavior in a child window
- real `SpaghettiCanvas` behavior in a child window
- whether the actual editor subtree throws, stalls, or silently fails to paint inside a popup document

### Current Best Read After This Investigation

The remaining popup bug is now most likely:
- not another pure popup shell lifecycle issue
- not just a blank host discovery issue
- but a child-window portability seam inside the real Spaghetti editor subtree

The next repair should likely normalize window/document ownership by reading from:
- `panelRef.current?.ownerDocument?.defaultView`
- `viewportRef.current?.ownerDocument?.defaultView`

instead of binding editor behavior directly to the opener's global module `window`.

## Likely Next Fix Direction

Do not jump to `Workspace 5.3` first.

Next fix work should instead:

1. finish the `Workspace 5.2` detached editor host seam so one detached editor can render honestly and stably
2. confirm the real editor subtree paints inside the popup document
3. only then continue to `Workspace 5.3` multi-graph UX widening

## Verification To Run

- click `PO` on the Spaghetti Editor
- verify the new child window opens
- verify the popup renders the real editor titlebar and graph UI instead of a dark blank surface
- verify the popup remains responsive
- verify closing the popup docks the editor back correctly

## Related Docs

- `docs/Bugs/8_Workspace-5.2-SpaghettiWindowHost-OrderedViewport-Selector-BlackScreen.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.2 - Multiple Editor Surface Instances And Graph Binding.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.1 - Spaghetti Editor Child-Window Pop-Out And Dock-Back Restore.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5.3 - Open Editors Multi-Graph Workspace UX And Session Truth.md`
