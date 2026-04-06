## [x] [3.2B-S5] - `Sketch Toolbar / Console Command Alignment`

The toolbar structure, console structure, and sketch session structure should describe the same hierarchy.

Important rule:
- toolbar parent surfaces like `Sketch Plane` and `Sketch Draw` should map to scopes
- toolbar sections should map to command groups
- toolbar actions should map to commands or follow-up tokens
- console commands and toolbar clicks should dispatch to the same underlying sketch-session verbs

Current code truth:
- the selected sketch node already exists as a staged console scope
- `SketchPlane` already has the beginnings of explicit levels:
  - `pick`
  - `adjust`
- `SketchDraw` still has mostly implicit levels expressed through:
  - active tool
  - draft points
  - draw versus review mode
- current shared sketch-session verbs already exist in the store seam:
  - `setSketchPlanePickDraftPlane(...)`
  - `returnActiveSketchSessionOneLevel()`
  - `cancelSketchPlanePick()`
  - `setGeometrySketchSessionTool(...)`
  - `finishGeometrySketchDrawDraft()`
  - `closeGeometrySketchSession()`
- current split problem:
  - the toolbar surface in `ViewportOverlay.tsx` already calls several of those verbs directly
  - the console surface in `ConsoleDock.tsx` still hard-codes token branches like:
    - `xy / xz / yz`
    - `line / l`
    - `pline / pl`
    - `back / b / esc`
    - `x`
    - `enter`
  - that means the same sketch action still has two owner surfaces and duplicated intent knowledge

So the next cleanup direction is not a new product direction.

It is:
- formalize the already-emerging sketch levels
- reduce special-case `Esc` handling
- keep the selected sketch node as the stable parent scope
- make toolbar structure, console structure, and sketch session structure describe the same hierarchy

### Questions / Decisions

#### [x] `q1` Decide how toolbar structure should relate to console structure.

##### Suggestion
- locked direction:
- toolbar parent surfaces map to scopes
- toolbar sections map to groups
- toolbar actions map to commands or follow-up tokens

#### [x] `q2` Decide whether toolbar clicks and console commands may own separate behavior implementations.

##### Suggestion
- locked direction:
- no
- both should dispatch to the same underlying sketch-session verbs

### Implementation Spec

Purpose:
- make toolbar clicks and console commands read as two input surfaces over one sketch command model instead of parallel behavior trees

#### Current Code-To-Target Mapping

- current toolbar-side ownership lives mostly in:
  - `src/app/components/ViewportOverlay.tsx`
  - visible title-bar and section actions already call store verbs for:
    - `Back`
    - `X`
    - `Move`
    - `Rotate`
    - `Line`
    - `PLine`
    - draw finish/cancel actions
- current console-side ownership lives mostly in:
  - `src/app/console/ConsoleDock.tsx`
  - sketch-local token parsing still decides behavior in feature-specific branches
- current target:
  - toolbar and console should both resolve into one sketch command layer
  - that command layer should call the existing store verbs instead of either surface owning the real behavior

#### Scope

Owned here:
- one shared sketch command mapping layer for:
  - `SketchPlane`
  - `SketchDraw`
- explicit mapping from:
  - toolbar actions
  - console tokens
  to:
  - shared sketch-session verbs
- alignment between visible toolbar grouping and visible console prompt grouping

Not owned here:
- a whole-app generic command registry for every future feature
- freeform fuzzy command search
- redesign of staged graph navigation
- broader workspace-surface selection sync
- deep toolbar visual redesign outside what is needed to expose the shared command structure honestly

#### First Command Families To Align

`SketchPlane`
- scope:
  - `Sketch Plane`
- group:
  - `Plane Selection`
    - `XY`
    - `XZ`
    - `YZ`
- group:
  - `Session Controls`
    - `Back`
    - `X`
- group:
  - `Adjust`
    - `Move`
    - `Rotate`

`SketchDraw`
- scope:
  - `Sketch Draw`
- group:
  - `Tool Selection`
    - `Line`
    - `PLine`
- group:
  - `Session Controls`
    - `Back`
    - `X`
    - `Enter`
- group:
  - `Active Tool`
    - tool-specific status/prompt reads

Important rule:
- `Move` and `Rotate` remain subtools inside `SketchPlane > Adjust`
- `Line` and `PLine` remain tool-selection actions inside `SketchDraw`
- this phase is about command ownership alignment, not inventing new sketch hierarchy levels

#### Recommended First Implementation Cut

- add one shared sketch-command mapping seam close to the sketch/session layer
- first scope of that seam should stay narrow and explicit:
  - `SketchPlane`
    - `xy`
    - `xz`
    - `yz`
    - `back`
    - `x`
    - `move`
    - `rotate`
  - `SketchDraw`
    - `line`
    - `l`
    - `pline`
    - `pl`
    - `back`
    - `b`
    - `esc`
    - `x`
    - `enter`
- the console should submit sketch-local tokens through that shared seam
- the toolbar should call that same seam or the same underlying store verbs behind it
- do not keep `ConsoleDock` as the place that permanently owns sketch behavior branching

#### Ownership Rule

- `ViewportOverlay`
  - should own presentation, button layout, and visible grouping
- `ConsoleDock`
  - should own token submission and transcript echo
- shared sketch command layer
  - should own token-to-verb resolution for sketch-local commands
- `useSpaghettiStore`
  - should remain the owner of the real sketch-session mutations

Avoid:
- toolbar buttons directly deciding business behavior in one way while console tokens decide it in another
- prompt text and visible toolbar grouping drifting away from the real sketch command families
- adding a new toolbar row or console alias that requires copying behavior into two separate surfaces

#### Hard Rules

- do not let toolbar clicks and console tokens keep separate implementations for the same sketch action
- do not make `ConsoleDock` the permanent sketch command registry
- do not widen this phase into all-node command alignment
- do not redesign freeform command grammar here
- do not replace the current store verbs with a second sketch command state model

#### Acceptance Shape

- [x] a reader can point to one shared sketch command mapping seam in code
- [x] `SketchPlane` and `SketchDraw` both route toolbar actions and console tokens through that same mapping seam or the same underlying store verbs
- [x] `ViewportOverlay` no longer needs bespoke behavior branches for actions that also exist in console token form
- [x] `ConsoleDock` no longer needs bespoke behavior branches for actions that already exist as toolbar actions
- [x] the visible toolbar sections read like command groups for the same scope the console is describing
- [x] adding a sketch command alias or toolbar action no longer requires inventing a second behavior path for the same action

#### Shipped Summary

- `useSpaghettiStore` now exposes:
  - `runSketchPlaneCommand(...)`
  - `runGeometrySketchDrawCommand(...)`
- `ConsoleDock` now routes overlapping sketch-local console tokens through those shared sketch command seams instead of owning the real behavior branches directly
- `ViewportOverlay` now routes overlapping toolbar actions through those same shared sketch command seams for:
  - `Back`
  - `X`
  - `XY / XZ / YZ`
  - `Move`
  - `Rotate`
  - `Line`
  - `PLine`
  - `Enter`
- non-overlapping actions like `Done`, `Reset Transform`, and `Review Profiles` remain outside this phase

#### V1 Boundary

The first implementation boundary for `SketchPlane` should be:

- `Source`
  - origin plane selection
- `Transform`
  - compact numeric controls using shared templates
- row-mode behavior
  - `collapsed / essentials / expanded`
- a path into viewport-first source picking later

V1 should not try to solve all of these at once:
- full face-pick product flow
- final browser integration depth
- final multi-sketch viewer overlay model
- final runtime transformed-plane geometry behavior

#### What This Section Locks

This `Sketch plane` section locks these decisions:
- `SketchPlane` is the sketch's nested source/setup surface
- the user-facing model should be `Source + Transform`
- `ParaSelect` is the right control for discrete plane choice
- `ParaSlider` is the right control for numeric transform values
- row modes should stay meaningful and intentional
- viewport-first source picking is the right long-term direction
- `SketchPlane` stays nested under each sketch, not lifted above `Sketches`

#### What Still Needs To Be Decided

This section intentionally does not fully decide:
- exactly when face-pick enters the product
- how much transform depth belongs in `essentials` versus `expanded`
- whether every current transform field should stay in v1
- the exact runtime geometry interpretation of all authored transform values
- the final browser-child layout once `Sketches` becomes a full content family


The sketch interaction model should be cleaned up into one readable hierarchy instead of a mix of staged-console scopes, feature-local session branches, and special-case `Esc` behavior.

The intended long-term shape is:

```text
Graph
â””â”€ Sketch node selected
   â”œâ”€ SketchPlane
   â”‚  â”œâ”€ Plane Selection
   â”‚  â””â”€ Adjust
   â””â”€ SketchDraw
      â”œâ”€ Session Idle
      â”œâ”€ Tool Selected
      â””â”€ Draft Active
```

Important rule:
- the selected sketch node should remain the parent scope
- `SketchPlane` and `SketchDraw` should become explicit child levels under that sketch-node scope
- do not treat them as detached one-off modes that discard the parent command context

