# Transform Phase Transform-8 - Shared Transform Snap Controls

## Doc Header

### Doc History
3. 2026-03-27 12:16: Updated this phase doc after implementation so it now records the shipped `Transform 8` first pass: shared per-reference snap state for move / rotate / scale, canonical `Settings > Snap` Console ownership, mode-local `Snap` adapters, toolbar parity, and the deliberate v1 limit of one snap scalar per transform kind
2. 2026-03-27 11:36: Refreshed this `Transform 8` future phase after the shipped `Transform 7` cleanup so it now reads as the active next Transform task, explicitly inherits the newly shared shell-state pattern, and frames rotate-only snap as a partial seam that now needs family-wide move / rotate / scale coverage
1. 2026-03-27 09:26: Created this standalone `Transform 8` future phase doc under the Transform family, splitting the next follow-on around shared transform snap controls so move, rotate, and scale snap can stop drifting between partial toolbar support and missing Console ownership

### Purpose

This phase makes transform snap a first-class shared shell feature.

Use it to answer:
- which transform channels should own snap controls first
- where transform snap state should live
- how Console should expose move / rotate / scale snap
- how viewer, toolbar, and Console should stay aligned around that same snap truth

## Doc Body

## [x] Transform 8 - Shared Transform Snap Controls

### Summary

`Transform 8` starts after:
- `Transform 7`
  - shared `Local / World` space access

By this point, transform shell state should already be shared honestly across Console, toolbar, and viewer. Snap should follow that same rule.

This phase should:
- add explicit transform snap controls for move, rotate, and scale
- keep snap state shared across Console, toolbar, and viewer
- stop treating rotate-only snap as the finished transform-family answer

Phase outcome:
- move, rotate, and scale each gain shared snap state
- Console can inspect and adjust transform snap directly
- toolbar and viewer read the same snap truth
- snap changes update shell behavior without appending committed transform-history rows

### Owns

- shared transform snap state for move, rotate, and scale
- Console access to transform snap controls
- toolbar / viewer / Console sync around transform snap
- first-pass snap command grammar for the transform shell

### Does Not Own

- `Local / World` transform space
- toolbar `X` exit sync
- transform-history traversal
- broader non-transform snapping outside this shell

### Shipped Decisions

- Snap now lives in shared per-reference transform state with one `enabled + value` record each for move, rotate, and scale.
- The honest Console owner path is `Transform > Settings > Snap > Choose next [Move, Rotate, Scale]`.
- Mode roots accept direct numeric submit:
  - `Transform > Settings > Snap > Move > 10`
  - `Transform > Settings > Snap > Rotate > 15`
  - `Transform > Settings > Snap > Scale > 0.25`
- Each snap mode exposes `On`, `Off`, and `Back`, and `Off` preserves the stored value.
- Mode-local adapters ship from:
  - `Transform > Move > Snap`
  - `Transform > Rotate > Snap`
  - `Transform > Scale > Snap`
- Toolbar and Console are equal adapters over the same store-owned snap truth.
- Viewer reads the same active-reference snap state and pushes `translateMm`, `rotateDeg`, and `scale` into the gizmo together.
- Axis-specific `X / Y / Z` snap overrides are explicitly deferred because the current gizmo still consumes one scalar per transform kind.

### Implementation Direction

Primary targets:
- `src/app/store/useAppStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/stagedNavigation.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/app/viewerBridge.ts`
- `src/viewer/Viewer.ts`

Implemented shape:
- replaced the old rotate-only snap map with one per-reference `transformSnapByReferenceId` record
- preserved rotate timeline evaluation by projecting `rotate-snap` through the unified rotate snap mode
- routed Console snap edits and toolbar snap edits into the same generic store actions
- added one shared snap section to the reference transform toolbar with grouped `Move`, `Rotate`, and `Scale` rows

### Test Plan

Verification used:
- `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/components/ReferenceTransformToolbar.test.tsx src/app/components/ViewerHost.test.tsx src/app/console/stagedNavigation.test.ts src/app/console/ConsoleDock.test.tsx`
- `cmd /c npx tsc --noEmit`

### Assumptions

- snap remains shell state, not committed transform history
- the first pass stays reference-transform-first
- existing rotate snap behavior is now folded into the shared transform-family rule instead of staying a toolbar-only exception
