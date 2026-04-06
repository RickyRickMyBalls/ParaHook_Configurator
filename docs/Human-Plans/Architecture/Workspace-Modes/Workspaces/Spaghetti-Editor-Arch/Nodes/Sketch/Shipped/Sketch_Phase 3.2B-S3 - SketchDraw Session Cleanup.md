## [x] [3.2B-S3] - `SketchDraw Session Cleanup`

`SketchDraw` should be cleaned into explicit levels instead of only implicit tool/draft state:
- `Sketch node selected`
  - parent scope
- `SketchDraw > Session Idle`
  - draw session is open but no active tool is running
- `SketchDraw > Tool Selected`
  - a tool like `Line` or `PLine` is armed
- `SketchDraw > Draft Active`
  - the current tool has temporary authored points/geometry in progress

Recommended `Esc` / `Back` behavior:
- from `Draft Active`
  - clear/cancel the current draft and return to `Tool Selected`
- from `Tool Selected`
  - return to `Session Idle`
- from `Session Idle`
  - return to the selected sketch-node scope only if the product still wants `Esc` to leave `SketchDraw`
  - otherwise keep exit as explicit `X` / `Back`

Important rule:
- `SketchDraw` should feel like a durable authoring surface, not a fragile one-shot command that collapses on the first extra `Esc`

Current code-to-target mapping:
- current canonical session seam:
  - `geometrySketchSession`
  - this should remain the only source of truth for `SketchDraw`
- current stage mapping:
  - `drawStage: 'sessionIdle'`
    - maps to `SketchDraw > Session Idle`
  - `drawStage: 'toolSelected'`
    - maps to `SketchDraw > Tool Selected`
  - `drawStage: 'draftActive'`
    - maps to `SketchDraw > Draft Active`
  - `activeTool: null`
    - means the draw session is open with no armed tool
- current console seam:
  - entering `SketchDraw` now prints the explicit idle-session prompt:
    - `Sketch Draw > [Line, PLine, X]`
  - local sketch-draw commands already exist for:
    - `line / l`
    - `pline / pl`
    - `enter`
    - `esc`
    - `x`
    - `status`
    - `help`
- current cancel/handoff seam:
  - draft cancel already clears active draft state first
  - a second cancel from an armed tool now returns the draw session to idle instead of relying on the old implicit-line default
  - `Esc` from `Session Idle` now keeps `SketchDraw` open instead of exiting the session

Phase boundary:
- `[3.2B-S3]` is responsible for making the current three-level `SketchDraw` session read cleanly and consistently
- this phase should not invent a second sketch-draw session model
- this phase does not need to redesign:
  - full toolbar/console command unification
  - broad staged-console architecture changes
  - every future sketch tool family beyond the current line / pline seam
- those belong to later work in:
  - `[3.2B-S4]`
  - `[3.2B-S5]`
  - later richer `SketchDraw` tool phases

### Questions / Decisions

#### [x] `q1` Decide the first honest `SketchDraw` levels.

##### Suggestion
- locked direction:
- `Session Idle`
- `Tool Selected`
- `Draft Active`

#### [x] `q2` Decide whether entering `SketchDraw` should auto-arm a tool.

##### Suggestion
- locked direction:
- no
- entering `SketchDraw` should open the durable draw session without auto-selecting a tool

#### [x] `q3` Decide how `Esc` should step back through those levels.

##### Suggestion
- locked direction:
- from `Draft Active`
  - clear/cancel current draft and return to `Tool Selected`
- from `Tool Selected`
  - return to `Session Idle`
- from `Session Idle`
  - only leave `SketchDraw` if the product still wants that behavior; otherwise keep exit explicit

### Implementation Spec

- the first cleanup pass should make `SketchDraw` read like a durable command surface:
  - session can stay open without an armed tool
  - tool selection is explicit
  - draft state is distinct from tool selection
- avoid treating `SketchDraw` as one big anonymous mode where tool, draft, and exit behavior are all mixed together
- implementation should keep one canonical `geometrySketchSession` model instead of splitting idle state, active tool, draft state, and session exit into separate temporary seams
- the first honest code target is:
  - entering `SketchDraw` opens `Session Idle`
  - choosing `Line` or `PLine` transitions into `Tool Selected`
  - beginning point placement transitions into `Draft Active`
  - cancel from `Draft Active` returns to `Tool Selected`
  - cancel from `Tool Selected` returns to `Session Idle`
  - explicit close/exit remains separate from that one-level stepback behavior
- the console and overlay should both describe the same current level:
  - `Session Idle`
    - no armed tool
    - prompt should tell the user to choose a tool
  - `Tool Selected`
    - armed tool present
    - prompt should describe the next point/action for that tool
  - `Draft Active`
    - temporary geometry in progress
    - prompt and status should describe the live draft honestly
- viewer interaction should remain compatible with an idle draw session that has no active tool instead of silently coercing idle back to `Line`
- success means the user can enter `SketchDraw`, stay there comfortably, and use `Esc` to step back through draw depth instead of falling out of the session unexpectedly

Acceptance checks:
- a reader can point to one canonical sketch-draw session seam in code:
  - `geometrySketchSession`
- `drawStage` and `activeTool` are explicitly understood as:
  - `Session Idle`
  - `Tool Selected`
  - `Draft Active`
- entering `SketchDraw` no longer depends on a fake default `Line` tool to represent the session
- overlay and console status reads can describe idle draw state honestly
- draft cancel and tool cancel read as one-level stepback inside the same session instead of collapsing straight out of draw
- no second sketch-draw session model is introduced in this phase


