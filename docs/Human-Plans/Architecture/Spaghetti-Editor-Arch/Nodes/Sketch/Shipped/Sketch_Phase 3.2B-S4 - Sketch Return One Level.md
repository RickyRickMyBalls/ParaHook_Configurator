## [x] [3.2B-S4] - `Sketch Return One Level`

To make the hierarchy honest:
- `Esc` should mean `return one level`
- `Back` should call the same underlying one-level return behavior
- toolbar back/cancel buttons should call that same underlying behavior when they mean â€œgo one level upâ€
- explicit close/exit actions like `X` may still exist, but they should remain distinct from one-level return

Important rule:
- do not keep programming unrelated bespoke `Esc` outcomes in every sketch surface forever
- the sketch system should eventually expose one shared sketch-session `returnOneLevel()` style behavior and let:
  - keyboard `Esc`
  - console `Back`
  - toolbar `Back`
  all dispatch to it

Current code-to-target mapping:
- current parent scope:
  - `graphSketchSelected`
  - this remains the selected sketch-node parent scope that one-level return should eventually resolve back into
- current `SketchPlane` return seam:
  - `reopenSketchPlanePickPlaneSelection()`
    - already performs:
      - `SketchPlane > Adjust`
      - to `SketchPlane > Plane Selection`
  - `cancelSketchPlanePick()`
    - already performs:
      - `SketchPlane > Plane Selection`
      - to selected sketch-node scope
- current `SketchDraw` return seam:
  - `cancelGeometrySketchDrawDraft()`
    - already performs:
      - `SketchDraw > Draft Active`
      - to `SketchDraw > Tool Selected`
    - and:
      - `SketchDraw > Tool Selected`
      - to `SketchDraw > Session Idle`
  - idle draw currently stays open
    - explicit exit remains:
      - `closeGeometrySketchSession()`
      - console `x`
      - toolbar/window close
- current dispatch surfaces:
  - viewport keyboard `Escape`
    - still routes through feature-local branches
  - console typed `esc`
    - still routes through feature-local branches
  - toolbar cancel/back-style buttons
    - still call feature-local methods directly

Phase boundary:
- `[3.2B-S4]` is responsible for introducing one shared sketch-local one-level-return seam
- this phase should not replace the existing sketch session types
- this phase should not redesign:
  - app-wide console dispatcher architecture
  - toolbar / console command-group alignment as a whole
  - full workspace-surface context sync
- those belong to:
  - `[3.2B-S5]`
  - later console/workspace phases
- this phase should stay inside sketch-local behavior:
  - `SketchPlane`
  - `SketchDraw`
  - selected sketch-node handoff

### Questions / Decisions

#### [x] `q1` Decide what `Esc` should mean inside the sketch hierarchy.

##### Suggestion
- locked direction:
- `Esc` should mean `return one level`
- it should not mean `jump to root`

#### [x] `q2` Decide how `Back` should relate to `Esc`.

##### Suggestion
- locked direction:
- `Back` should call the same underlying one-level return behavior as `Esc`
- `Back` is the visible command
- `Esc` is the keyboard shortcut

#### [x] `q3` Decide whether `X` should remain distinct.

##### Suggestion
- locked direction:
- yes
- explicit close/exit actions like `X` may still exist, but they should stay distinct from one-level return

### Implementation Spec

- first cleanup pass should expose one shared sketch-local `returnOneLevel()` style action instead of continuing to answer each sketch `Esc` path independently
- the first honest code target is:
  - `SketchPlane > Adjust`
    - return one level to:
      - `SketchPlane > Plane Selection`
  - `SketchPlane > Plane Selection`
    - return one level to:
      - selected sketch-node scope
  - `SketchDraw > Draft Active`
    - return one level to:
      - `SketchDraw > Tool Selected`
  - `SketchDraw > Tool Selected`
    - return one level to:
      - `SketchDraw > Session Idle`
  - `SketchDraw > Session Idle`
    - stay in `SketchDraw` for now
    - explicit exit remains separate
- the first callers should be:
  - keyboard `Esc`
  - console `Back`
  - toolbar `Back`
- `esc` in the console may continue to call the same one-level-return seam during active sketch sessions, but visible `Back` should become the clearer command surface name
- feature-local close/cancel actions that truly mean full exit may keep separate verbs such as:
  - `X`
  - close button
  - explicit session close
- implementation should prefer one shared sketch-local reducer/action that delegates based on active sketch scope instead of copy-pasting parent-step logic into:
  - `ConsoleDock`
  - `ViewportOverlay`
  - feature-local button handlers
- success means sketch behavior no longer depends on scattered bespoke `Esc` branches to answer simple parent/child navigation

Acceptance checks:
- a reader can point to one shared sketch-local one-level-return seam in code
- `SketchPlane` and `SketchDraw` both use that seam for parent-step behavior instead of each surface inventing new `Esc` rules
- `Back` and keyboard `Esc` read as two triggers for the same underlying behavior
- explicit close/exit paths like `X` remain distinct from one-level return
- selected sketch-node scope remains the parent handoff target when sketch-local return leaves `SketchPlane`
- this phase does not introduce a second sketch session model or broaden into whole-app back-navigation architecture


