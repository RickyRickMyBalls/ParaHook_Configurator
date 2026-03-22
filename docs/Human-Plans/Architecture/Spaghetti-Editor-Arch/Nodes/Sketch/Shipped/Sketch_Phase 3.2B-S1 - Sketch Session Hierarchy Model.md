## [x] [3.2B-S1] - `Sketch Session Hierarchy Model`

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

Current code-to-target mapping:
- current staged-console parent scope:
  - `graphSketchSelected`
  - this should remain the user-facing parent sketch-node scope
- current `SketchPlane` session seam:
  - `sketchPlanePickSession`
  - `pick` should map to `SketchPlane > Plane Selection`
  - `adjust` should map to `SketchPlane > Adjust`
- current `SketchDraw` session seam:
  - `geometrySketchSession`
  - `drawStage: sessionIdle`
    - maps to `SketchDraw > Session Idle`
  - `drawStage: toolSelected`
    - maps to `SketchDraw > Tool Selected`
  - `drawStage: draftActive`
    - maps to `SketchDraw > Draft Active`
  - `activeTool: null`
    - means the draw session is open with no armed tool

Phase boundary:
- `[3.2B-S1]` is only responsible for naming and locking the hierarchy
- this phase does not yet need to fully implement:
  - one-level `Esc` behavior
  - command routing cleanup
  - toolbar/console shared dispatch
- those belong to:
  - `[3.2B-S4]`
  - `[3.2B-S2]`
  - `[3.2B-S3]`
  - `[3.2B-S5]`

### Questions / Decisions

#### [x] `q1` Decide what the stable parent scope should be for sketch-local command work.

##### Suggestion
- locked direction:
- the selected sketch node should remain the stable parent scope
- `SketchPlane` and `SketchDraw` should become child levels under that selected sketch scope, not detached parallel products

#### [x] `q2` Decide whether `SketchPlane` and `SketchDraw` should be modeled as deeper levels or as unrelated modes.

##### Suggestion
- locked direction:
- treat both as deeper sketch-node levels
- this keeps prompt restoration, `Back`, and `Esc` behavior coherent

### Implementation Spec

- first cleanup pass should make the hierarchy explicit in code/doc terms:
  - `graphSketchSelected`
    - parent sketch-node scope
  - `SketchPlane`
    - `Plane Selection`
    - `Adjust`
  - `SketchDraw`
    - `Session Idle`
    - `Tool Selected`
    - `Draft Active`
- implementation should prefer explicit named levels over inferring hierarchy from scattered booleans and feature-local branches
- the first honest code target is not a global app-wide hierarchy rewrite
- the first honest code target is:
  - keep the existing selected sketch-node staged scope
  - make `SketchPlane` levels explicit against that parent
  - make `SketchDraw` levels explicit against that parent
- the first implemented state seam should read as:
  - draw session opens with:
    - `activeTool: null`
    - `drawStage: sessionIdle`
  - choosing a tool transitions to:
    - `drawStage: toolSelected`
  - beginning a draft transitions to:
    - `drawStage: draftActive`
- prompt restoration and next-step prompts should always resolve back through the selected sketch-node scope instead of skipping around it
- this phase does not require every other node family to adopt the same model yet
- success means later `Esc` / `Back` work can target named levels instead of vague local feature states

Acceptance checks:
- a reader can point to one stable parent sketch-node scope in both doc language and code language
- `SketchPlane` and `SketchDraw` are described as child levels under that parent, not as detached modes
- later phases can reference named levels directly:
  - `SketchPlane > Plane Selection`
  - `SketchPlane > Adjust`
  - `SketchDraw > Session Idle`
  - `SketchDraw > Tool Selected`
  - `SketchDraw > Draft Active`
- no additional hierarchy levels are invented in this phase unless they are needed by a real current code seam


