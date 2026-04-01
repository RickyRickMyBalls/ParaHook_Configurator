# 11 - Workspace 7.5-5 Multi Floating Spaghetti Blank Screen

## Doc History
1. 2026-04-01 10:42: Created this bug note to track the new post-`Workspace 7.5-5` regression where opening a second floating `Spaghetti Editor` in the model viewport can collapse the visible app into the same dark blank-screen family seen in the earlier workspace regressions

## Status

- `[investigating]`

## Summary

After the recent multi-surface `Spaghetti Editor` work, the app can still fail badly when the user opens two floating editor windows in the model viewport.

The user-facing result is not just normal overlap:
- the screen can collapse into a dark blank view
- the expected interactive shell becomes effectively invisible
- the failure looks like the same broad blank-screen family as the earlier workspace regressions

This means the earlier floating spawn-offset cleanup was not sufficient.
The stronger current read is that the second floating editor path is still destabilizing the live render/layout state somewhere in the shared shell.

## User-Facing Symptom

- open one floating `Spaghetti Editor`
- open a second floating `Spaghetti Editor` in the same model viewport
- instead of seeing two usable floating editor windows, the app can visually collapse into a dark blank screen
- the browser tab remains alive, but the visible interactive shell appears missing or fully covered

## Important Clarification

This bug is not being logged as a simple overlap complaint.

The earlier cleanup attempted to stagger new floating editor spawn positions so one window would not perfectly cover another.
The user now reports that the real bug still persists and the screen can go blank in a way that matches the broader black-screen regression family.

That means the stronger issue is still open:
- either the second floating editor path is triggering a render/layout destabilization
- or one of the new multi-surface floating shells is still taking over the viewport in a way that effectively blanks the app

## Strongest Current Likely Cause

The strongest current code-backed suspicion is still inside the shared multi-floating `SpaghettiWindowHost` path:

- `SpaghettiWindowHost` now renders several in-app floating editor windows from `floatingViewportStates`
- each floating shell derives size, position, active state, and mode-specific layout from both viewport state and shared shell frame geometry
- the blank-screen symptom suggests one of those per-viewport floating render branches is still entering a bad full-viewport state or destabilizing the React tree when a second floating surface appears

The highest-suspicion seam is:

- `src/app/hosts/SpaghettiWindowHost.tsx`
  - `floatingViewportStates`
  - `getFloatingShellFrame()`
  - the mapped `.SpaghettiFloatingWindow` render branch
  - maximized / collapsed / essentials state interactions when more than one floating surface exists

Secondary suspicion:

- `src/app/AppShell.tsx`
  - any live shell-visibility or active-surface clearing logic that still behaves as if one in-app editor shell owns the viewport

This also still belongs to the same broad family as earlier bugs where:
- the browser page stays alive
- dark workspace styling remains visible
- but the expected interactive React shell is gone or effectively blank

## Most Suspicious Code Seams

- `src/app/hosts/SpaghettiWindowHost.tsx`
  - `orderedViewportStates`
  - `floatingViewportStates`
  - `getFloatingShellFrame()`
  - floating shell `style` derivation for left/top/width/height/zIndex
  - any `windowMode === 'maximized'` branch that can cover the viewport when several floating windows coexist
- `src/app/AppShell.tsx`
  - visible in-app spaghetti shell presence checks
  - any active-surface clearing behavior that may hide or suppress surviving shells
- `src/app/spaghetti/store/useSpaghettiStore.ts`
  - new viewport spawn and focus sequencing if the second floating surface inherits a bad mode or stale geometry

## What Was Already Tried

The recent cleanup already changed new floating editor viewport spawn positions so a second floating editor should no longer open at the exact same coordinates as the first one.

That was useful, but it did not fix the actual user-reported failure.

So the live bug is now narrowed:
- not just "second floating editor covers the first"
- but "opening a second floating editor can still blank the app"

## Likely Fix Direction

Follow the same rule used in the earlier blank-screen bug family:

1. Reproduce the exact second-floating-editor path while watching for render errors, unstable layout state, or a full-viewport shell takeover.
2. Audit the multi-floating render branch in `SpaghettiWindowHost` for any mode path that can expand a second floating shell into an effective full-screen overlay.
3. Check whether any active-surface or visibility-clearing logic in `AppShell` still assumes there is only one meaningful in-app editor shell.
4. Add one focused regression that proves two floating editor windows remain visibly rendered together without blanking the viewport.

## Likely Files

- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/hosts/SpaghettiWindowHost.test.tsx`
- `src/app/AppShell.test.tsx`

## Verification To Run

- launch the app normally at `http://localhost:5173/ParaHook_Configurator/`
- open one floating `Spaghetti Editor`
- open a second floating `Spaghetti Editor` in the same model viewport
- verify the app does not collapse into a dark blank screen
- verify both floating editor windows remain visibly discoverable and interactive
- verify no new render-loop or fatal React errors appear in the console during the repro

## Related Docs

- `/docs/Bugs/8_Workspace-5.2-SpaghettiWindowHost-OrderedViewport-Selector-BlackScreen.md`
- `/docs/Bugs/9_Workspace-5.2-SpaghettiEditor-Detached-Popup-Blank.md`
- `/docs/Bugs/10_Workspace-5.2-SpaghettiPopup-Mixed-Ownership-Vs-Console.md`
- `/docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-5 - Multiple Spaghetti Editor Surface Parity.md`

## Notes

The important project-level read is that this still looks more like a real blank-screen regression than a small visual polish issue.

So the next pass should investigate it like the earlier serious workspace failures:
- assume render/layout destabilization first
- prove the exact trigger path
- then tighten the floating-shell branch with a regression that matches the real user repro
