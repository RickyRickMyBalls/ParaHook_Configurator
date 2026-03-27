# Transform Phase Transform-10 - Ratio Locked Per Axis Snap

## Summary

`Transform 10` shipped the full per-axis snap pass for reference transform.

This phase replaced the first scalar-only move / rotate / scale snap model with shared per-reference snap state that now carries:
- `enabled`
- `xyzLocked`
- `x / y / z` values

It also widened the viewer / gizmo seam in the same pass so unlocked per-axis snap values are real runtime behavior instead of stored-only UI metadata.

## Locked Outcome

- `Move`, `Rotate`, and `Scale` snap now all persist as shared per-axis state per reference
- `Lock` defaults on
- unlock preserves the current vector
- re-lock preserves the current vector exactly
- while locked, editing one axis rescales the other two proportionally
- zero axes stay pinned at `0` during linked scaling
- mode-root numeric submit still writes all three axes equally
- Console mode roots now expose:
  - `On`
  - `Off`
  - `snapXYZ:Lock` or `snapXYZ:Unlock`
  - `Move X / Y / Z` style children
  - `Back`
- toolbar snap rows now show:
  - `On / Off / Lock / Q`
  - one root slider while locked
  - collapsed `Vec3` plus expandable per-axis rows while unlocked
- viewer / gizmo execution now consumes the same per-axis snap state the toolbar and Console author

## Timeline Compatibility

- `rotate-snap` timeline stays tied to the `X` driver value
- if rotate snap becomes unlocked, `rotate-snap` falls back to `basic`
- this phase did not widen snap timelines beyond that compatibility path

## Main Seams

- `src/app/store/useAppStore.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/radioCommandIdentity.ts`
- `src/app/components/ReferenceTransformToolbar.tsx`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/viewer/gizmo/TransformGizmo.ts`

## Verification

- `cmd /c npx vitest run src/app/store/useAppStore.test.ts src/app/console/stagedNavigation.test.ts src/app/console/ConsoleDock.test.tsx src/app/components/ReferenceTransformToolbar.test.tsx src/app/components/ViewerHost.test.tsx`
- `cmd /c npx tsc --noEmit`
