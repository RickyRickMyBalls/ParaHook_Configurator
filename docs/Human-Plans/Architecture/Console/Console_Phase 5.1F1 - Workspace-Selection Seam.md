## [x] `5.1F1` Workspace-Selection Seam

### Summary
#### Summary

`5.1F1` should create the first canonical workspace-selection seam above the current surfaces.

This cut should stay narrow:
- define the first shared workspace-selection state
- place it in the right store seam
- prove one shared source of truth exists for the graph-first flow

### Questions / Decisions

#### [x] `q1` Decide what the first canonical workspace-selection fields should be.

#### Suggestion
- locked direction:
- the first shared fields should be:
  - `selectedTarget`
  - `activeSurface`
- `activeGraphDocumentId` and `activeEditorViewportId` should remain graph/editor mechanics in `useSpaghettiStore` until a real cross-surface coordination need proves they should move

#### [x] `q2` Decide where the first seam should live.

#### Suggestion
- locked direction:
- the first `workspaceSelection` seam should live in `useAppStore.ts`
- do not place it in:
  - `ConsoleDock`
  - `BrowserPanel`
  - `SpaghettiPanel`

#### [x] `q3` Decide what should explicitly stay out of the first seam.

#### Suggestion
- locked direction:
- keep these out of the first seam:
  - local menu state
  - hover state
  - popover visibility
  - local panel presentation toggles
  - full domain/session mechanics

#### [x] `q4` Decide what first proof should count as success.

#### Suggestion
- locked direction:
- the first proof should be:
  - one shared `selectedTarget`
  - one shared `activeSurface`
  - enough selectors to let graph-first flows read the same truth from more than one surface
- do not require every domain in the first cut

### Implementation Spec

Purpose:
- add the app-level `workspaceSelection` seam without turning `useAppStore` into a mirror of `useSpaghettiStore`

Owned here:
- first `workspaceSelection` slice in `useAppStore.ts`
- initial shared fields:
  - `selectedTarget`
  - `activeSurface`
- coordination selectors that can read current graph/editor context honestly

Not owned here:
- broad surface migration
- canonical intent rewiring
- full viewer/browser reflection cleanup

Acceptance shape:
- there is one explicit `workspaceSelection` seam
- `selectedTarget` and `activeSurface` have one shared home
- graph/editor mechanics still stay in `useSpaghettiStore`


