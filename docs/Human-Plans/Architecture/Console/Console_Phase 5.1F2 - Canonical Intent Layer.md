## [x] `5.1F2` Canonical Intent Layer

### Summary
#### Summary

`5.1F2` should define the first shared outcome-level intents that multiple surfaces can call to produce the same result.

This is the seam that should stop console/browser/editor from each inventing their own execution path for the same user outcome.

This phase should stay narrow:
- prove the graph-first path first
- define one shared outcome-level intent seam
- make that seam callable from more than one surface
- do not try to migrate every domain or every panel in the same cut

### Questions / Decisions

#### [x] `q1` Decide what should count as a canonical intent in the first pass.

#### Suggestion
- locked direction:
- canonical intents should be outcome-level actions shared by more than one surface
- the first set should include:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `activateSurface`
- keep `startSketchPlane` and `startSketchDraw` in the vocabulary, but graph-first outcomes should be the first implementation proof

#### [x] `q2` Decide how broad canonical intents should be.

#### Suggestion
- locked direction:
- canonical intents should stay small and outcome-based
- do not turn them into UI-script buckets that encode panel-specific sequencing

#### [x] `q3` Decide who should call the canonical intents.

#### Suggestion
- locked direction:
- `Console`, `Browser`, and `Spaghetti Editor` should all call the same shared intents when they want the same outcome
- do not keep separate console-only or browser-only execution paths for migrated outcomes

#### [x] `q4` Decide what should stay outside the first intent layer.

#### Suggestion
- locked direction:
- keep these out of the first intent layer:
  - panel-local UI actions
  - transcript wording
  - deep browser hierarchy behavior
  - unrelated tool-session mechanics

#### [x] `q5` Decide what the first implementation proof should be.

#### Suggestion
- locked direction:
- the first implementation proof should be the graph-first outcome set:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `activateSurface`
- this should be enough to prove that:
  - `Console`
  - `Browser`
  - later `Spaghetti Editor`
  can produce the same workspace result through the same shared intents
- keep:
  - `startSketchPlane`
  - `startSketchDraw`
  in the vocabulary
- but do not require them to be the first migrated proof inside `5.1F2`

#### [x] `q6` Decide where the canonical intent layer should live.

#### Suggestion
- locked direction:
- the canonical intent layer should live above the surfaces and adjacent to the current stores
- the first practical home should be:
  - a shared workspace-intents seam in `src/app/store`
- it should coordinate:
  - `useAppStore`
  - `useSpaghettiStore`
- it should not live:
  - inside `ConsoleDock`
  - inside `BrowserPanel`
  - inside `SpaghettiPanel`

#### [x] `q7` Decide what each canonical intent should return.

#### Suggestion
- locked direction:
- canonical intents should return small inspectable results where useful
- examples:
  - opened graph id
  - focused viewport id
  - selected target
  - activated surface
- do not make the intent layer fire-and-forget when the caller needs to continue deterministic flow
- especially for console-driven staged paths, the caller should be able to continue with clear outcome data

#### [x] `q8` Decide what should count as success for `5.1F2`.

#### Suggestion
- locked direction:
- `5.1F2` is complete when:
  - there is one explicit canonical intent seam
  - graph-first workspace outcomes no longer require separate console-only and browser-only execution logic
  - the first migrated callers can use the same shared outcome-level intents
  - the intent layer remains small and outcome-based rather than turning into a UI-script bucket

### Implementation Spec

Purpose:
- define one canonical intent vocabulary and one first shared dispatch seam for common workspace outcomes

#### Main Decision

The main decision in `5.1F2` is:
- where should shared workspace outcomes be executed so multiple surfaces can call the same behavior?

Locked answer:
- execute those outcomes through one canonical intent seam above the surfaces
- let domain stores still own their real mechanics underneath

#### First Implementation Cut

The first implementation cut should be intentionally narrow:
- graph-first selection/open/focus/activation only

First intents to make real:
- `openGraphDocument`
- `focusEditorViewport`
- `selectTarget`
- `activateSurface`

First outcomes to prove:
- console `g` / staged graph selection
- browser graph-row selection
- spaghetti/window activation for the selected graph path

Important rule:
- do not try to solve:
  - all node families
  - every browser click path
  - every viewer reflection path
  in the same cut

Owned here:
- first canonical intents such as:
  - `openGraphDocument`
  - `focusEditorViewport`
  - `selectTarget`
  - `startSketchPlane`
  - `startSketchDraw`
  - `activateSurface`
- shared dispatch helpers/selectors that coordinate `useAppStore` and `useSpaghettiStore`

Likely first real seam:
- a shared workspace-intents utility/module in `src/app/store`
- or a neighboring seam with a similarly narrow home

Likely responsibilities:
- canonical intent layer:
  - accept simple outcome-level calls
  - coordinate `useAppStore` and `useSpaghettiStore`
  - return enough outcome data for deterministic callers
- domain stores:
  - still perform the actual graph/editor/session mechanics
- surfaces:
  - dispatch canonical intents instead of open-coding their own equivalent execution path

#### First Intent Contract

The first canonical intents should conceptually behave like:

1. `openGraphDocument(graphDocumentId)`
- ensure the graph is open in a usable editor viewport
- return the resolved viewport id when available

2. `focusEditorViewport(editorViewportId)`
- make the target viewport the active viewport
- return the resolved active viewport id

3. `selectTarget(target)`
- write the canonical workspace target into shared selection state
- return the selected target

4. `activateSurface(surface)`
- write the canonical active surface
- return the active surface

Important rule:
- these should remain outcome-level and composable
- do not collapse them immediately into one mega-intent that scripts every UI detail

#### Likely Integration Seams

Primary seams:
- `src/app/store/useAppStore.ts`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/panels/BrowserPanel.tsx`

Secondary follow-on callers:
- `AppShell`
- later `Spaghetti Editor` interactions

#### First Implementation Steps

`5.1F2` should likely be completed in this order:

1. create the shared canonical intent seam
2. define the first graph-first intent vocabulary
3. wire those intents to `useAppStore` + `useSpaghettiStore`
4. migrate the existing console graph-first path to call that seam
5. migrate the matching browser graph-row path to call that same seam
6. verify that both surfaces produce the same workspace outcome
7. stop before broadening into deeper node-family or tool-session work

#### Hard Rules

- do not let `ConsoleDock` remain a private owner of graph-first open/select/focus behavior
- do not let `BrowserPanel` retain a parallel custom execution path for the same migrated outcome
- do not make the canonical intent layer so broad that it becomes a panel-script engine
- keep the first migrated intent set narrow enough to verify directly

Not owned here:
- migrating every surface in one pass
- broad browser hierarchy redesign
- local UI state cleanup
- staged-console choice assist
- full viewer reflection cleanup
- large command-taxonomy expansion

Acceptance shape:
- common outcomes have one shared intent path
- console, browser, and spaghetti can call the same outcome-level intents
- canonical intents remain small and outcome-based
- graph-first workspace outcomes are no longer relying on separate console-only and browser-only execution logic
- `5.1F3` can migrate visible reflection paths without redesigning the intent seam


