# Bug 22 - Imported References Disappear After Model Viewport Remount

## Doc History

3. 2026-04-21 11:36:42: Marked Bug 22 fixed at the store-to-current-viewer remount seam after `Catalog-Gen2-14` Phases 1-4 shipped the Viewer runtime possession query, ViewerHost loaded-but-missing rehydration, focused PubParts ZIP-attributed and normal `.obj` accepted-reference remount proof, and build verification while keeping full UI click-through and direct split/exploded possession hardening as optional future QA surfaces.
2. 2026-04-21 11:09:56: Routed this bug into `Catalog-Gen2-14 - Imported Reference Ownership And Viewport Rehydration`, with Phase 1 for a current-viewer possession query, Phase 2 for `ViewerHost` rehydration when global state is loaded but the current runtime object is missing, Phase 3 for split/close regression coverage, and Phase 4 for closeout.
1. 2026-04-21 11:04:22: Created this bug report after researching the imported-reference ownership path for PubParts ZIP staged imports and normal `.obj` imports, recording the likely split between canonical `referenceWorkspace` state and per-viewer in-memory loaded reference objects when the model viewport remounts after closing Catalog or splitting the viewport.

## Status

- `[fixed]`

## Closeout Read

Bug 22 is fixed at the root ownership seam: `referenceWorkspace` remains canonical imported-reference truth, each mounted `Viewer` remains a disposable runtime cache, and `ViewerHost` now rehydrates visible globally loaded references when the current viewer lacks the runtime object.

Proof:
- `Viewer.hasReference(referenceId)` exposes read-only current-runtime possession.
- `ViewerHost` reloads visible `loaded` references when `viewer.hasReference(...)` is false.
- Focused coverage proves PubParts ZIP-attributed accepted imports rehydrate after `ViewerHost` remount with an empty runtime cache.
- Focused coverage proves normal `.obj` accepted imports rehydrate in a newly mounted secondary model viewer.
- Focused coverage proves an already-owned current viewer does not duplicate-load.
- Focused coverage verifies canonical imported-reference id/order stability.
- `npm.cmd run build` passed after the ownership proof.

Not claimed:
- full UI click-through for Catalog close or model viewport split
- direct split/import-explosion special-path runtime-possession hardening

Those remain optional future QA/hardening surfaces, not blockers for this bug closeout.

## Problem

Imported objects can render correctly at first, then disappear when the model viewport is remounted by workspace layout changes.

Reproduction 1:
- User has one split with two viewports.
- Left viewport is Model Viewport.
- Right viewport is Catalog.
- User adds a ZIP-backed PubParts item successfully from Catalog.
- The imported part appears in the model viewport.
- User closes Catalog.
- The imported items disappear from the model viewport.

Reproduction 2:
- User has one Model Viewport.
- User imports a normal `.obj` through the simple import option.
- ParaHook adds the object successfully.
- User splits the model viewport.
- The imported items disappear from the model viewport.

## Current Strong Read

This looks like a loaded-reference runtime truth split.

The canonical imported-reference records live in `src/app/store/useAppStore.ts` under `referenceWorkspace`:
- `importedReferencesById`
- `importedReferenceOrder`
- `visibilityById`
- `loadStateById`
- `errorById`
- `partRowsByReferenceId`
- `transformOverrideById`
- `contentOrderByParentKey`

Both import paths write to that same canonical reference workspace:
- staged Import review uses `commitStagedImportDraft`
- simple/direct import uses `addImportedReference`

Both paths create records with:
- `visibilityById[referenceId] = true`
- `loadStateById[referenceId] = 'unloaded'`
- `assetPath` pointing at the imported object URL

The model viewport runtime is separate. `ViewerHost` creates a new `Viewer` instance when the model viewport mounts, and `Viewer` keeps loaded Three.js reference objects in an in-memory `referenceObjects` map. That runtime map is destroyed when the `Viewer` is disposed.

The likely failure sequence:
1. Import creates canonical `referenceWorkspace` entries with `loadStateById = 'unloaded'`.
2. `ViewerHost` sees visible unloaded references and calls `viewer.ensureReferenceLoaded(item)`.
3. `Viewer` loads the object into its in-memory `referenceObjects` map.
4. `ViewerHost` marks `loadStateById[referenceId] = 'loaded'`.
5. Workspace layout changes remount or replace the model viewport.
6. The old `Viewer` disposes, so its in-memory `referenceObjects` map disappears.
7. The canonical store still says the reference is visible and `loaded`.
8. The new `ViewerHost` skips `ensureReferenceLoaded` because the item is no longer `unloaded` or `error`.
9. The visibility sync calls `viewer.setReferenceVisible(referenceId, true)`, but the new `Viewer` has no object for that id, so the call is a no-op.
10. Browser/store truth still says the object exists, but viewport runtime truth has no loaded object to draw.

## Likely Ownership

- `ReferenceWorkspace` is the canonical imported-reference object registry.
- `ViewerHost` owns syncing canonical reference workspace state into the current mounted viewer.
- `Viewer` owns only per-instance render/runtime objects and should not be treated as canonical object truth.
- Workspace split/close/surface switching can remount or replace a viewer and must not be allowed to strand loaded reference state.

## Likely Affected Files

- `src/app/store/useAppStore.ts`
- `src/app/components/ViewerHost.tsx`
- `src/viewer/Viewer.ts`
- `src/app/workspace/WorkspaceViewportTree.tsx`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportWorkspaceHost.tsx`

## Code Evidence

`src/app/store/useAppStore.ts`:
- `ReferenceWorkspaceState` defines the canonical imported-reference registry and runtime flags.
- `commitStagedImportDraft` creates imported reference records for staged Import review.
- `addImportedReference` creates imported reference records for direct/simple imports.
- both paths initialize imported records as visible and `unloaded`.
- `selectReferenceWorkspaceItems` reads from `referenceWorkspace.importedReferenceOrder` and `referenceWorkspace.importedReferencesById`.

`src/app/components/ViewerHost.tsx`:
- creates and disposes a `Viewer` per mounted model viewport.
- derives `referenceWorkspaceItems` from `selectReferenceWorkspaceItems`.
- removes viewer references only when canonical ids disappear.
- sets visibility for visible loaded items.
- only calls `viewer.ensureReferenceLoaded(item)` when `item.loadState` is `unloaded` or `error`.

`src/viewer/Viewer.ts`:
- stores actual loaded render objects in a per-viewer `referenceObjects` map.
- `ensureReferenceLoaded` exits early if that viewer instance already has the object.
- `setReferenceVisible` returns without action when the viewer instance does not have an object for the reference id.
- disposing a `Viewer` destroys the per-instance loaded object truth.

`src/app/workspace/WorkspaceViewportTree.tsx` / `src/app/workspace/useWorkspaceStore.ts`:
- split, close, and surface-kind changes can alter model viewport mounts and surface instance ids.
- closing the Catalog split or splitting the model viewport can cause the model viewer host/runtime to remount even though canonical `referenceWorkspace` records remain.

## Expected Behavior

Imported references should remain visible after:
- closing Catalog
- splitting the model viewport
- changing workspace layout around an active model viewport
- remounting a `ViewerHost`

The canonical object truth should remain in `referenceWorkspace`, and any new viewer instance should rehydrate visible imported references from that canonical truth.

## Suspected Fix Shape

Do not make `Viewer.referenceObjects` canonical.

Pick one owner-safe repair:
- reset visible imported references from `loaded` to `unloaded` when a new `ViewerHost`/`Viewer` instance mounts and lacks those objects
- or make `ViewerHost` ask the current viewer whether it has the reference before skipping `ensureReferenceLoaded`
- or track reference load state per viewer/runtime instance instead of globally in `referenceWorkspace.loadStateById`

The smallest likely repair is:
- add a `Viewer` query such as `hasReference(referenceId)`
- update `ViewerHost` sync so visible references reload when global state says `loaded` but the current viewer does not have the object
- add regression coverage for both reported remount paths.

## Acceptance Read

- Import a normal `.obj`, confirm it appears, split the model viewport, and confirm it remains visible.
- Add a PubParts ZIP item from Catalog through staged Import review, confirm it appears, close Catalog, and confirm it remains visible.
- Add a focused test proving a remounted/new viewer does not skip a visible imported reference only because global `loadStateById` says `loaded`.
- Confirm Browser/project content still shows the same reference id and no duplicate imported reference record is created.

## Notes

The phrase "canonical object living file" maps best to `src/app/store/useAppStore.ts` today. The app does not currently have a separate file dedicated only to imported object truth; the canonical store slice is `referenceWorkspace`. The bug is that the viewport runtime appears to trust global loaded state more than the current viewer's actual loaded object map after remount.
