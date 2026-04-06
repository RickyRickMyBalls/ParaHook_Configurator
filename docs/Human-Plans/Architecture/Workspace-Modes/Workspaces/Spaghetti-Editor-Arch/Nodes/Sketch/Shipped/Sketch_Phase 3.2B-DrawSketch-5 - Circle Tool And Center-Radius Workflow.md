## [x] - `3.2B-DrawSketch-5` - `Circle Tool And Center-Radius Workflow`

### Header

Status:
- shipped
- landed 2026-03-22

Purpose:
- add the first real `Circle` draw command to `Sketch Draw` using the same hybrid viewport-plus-console session model now used by `Line`, `PLine`, and `Rectangle`

Owns:
- visible `Circle` tool exposure in `Sketch Draw`
- local alias:
  - `cc`
- center then edge/radius workflow
- live circle ghost preview in the viewport
- commit of first-class `circle` sketch components

### Shipped Behavior

- `Circle` now appears as a visible `Sketch Draw` tool in the viewport/console tool list
- typing:
  - `circle`
  - `cc`
  arms the same tool
- the shipped typed path is:
  - `cc > Vec2 > Float`
- first accepted input:
  - center
- second accepted input:
  - radius
  - commit immediately
  - return to idle `Sketch Draw`
- viewport stage 1 now works as:
  - `Graph > Sketch > Sketch Draw > Circle > Center > Vec2(N,N)`
- mouse move updates the live center `Vec2`
- click commits the center point
- viewport stage 2 now works as:
  - `Graph > Sketch > Sketch Draw > Circle > Center Vec2(N,N) > Radius > Float(N)`
  - mouse move updates the live radius `Float` from `distance(center, hoverPoint)`
  - click commits the radius
- empty `Enter` after center commit accepts the current hovered radius witness
- click and typed inputs can be mixed inside one active circle command:
  - stage 1:
    - viewport click
    - typed `Vec2`
  - stage 2:
    - viewport radius witness
    - typed `Float`
- the viewport now shows:
  - a live center candidate before the first click
  - a line from the committed center to the hovered witness during radius selection
  - a live full-circle ghost after the center exists
- commit writes one first-class `circle` component instead of exploding the result into line segments

### Console / Status

- idle `Sketch Draw` now advertises `Circle` alongside `Line`, `PLine`, `Rectangle`, and `Previous`
- active circle sessions use command prompts:
  - `CC Specify center point:`
  - `CC Specify radius or [Enter Accept]:`
- the top feature-assist breadcrumb now carries the live circle-specific path:
  - `Graph > Sketch > Sketch Draw > Circle > Center > Vec(N,N)`
  - `Graph > Sketch > Sketch Draw > Circle > Center Vec(N,N) > Radius > Float(N)`
- stage 1 mouse movement updates the live center `Vec2` in the command path
- stage 2 mouse movement updates the live radius `Float` in the command path
- typed `Vec2` and typed `Float` inputs can be mixed with viewport clicks inside one active circle command

### Implementation Notes

- the circle runtime lands as one first-class `circle` sketch component using:
  - `center`
  - `edge`
- typed radius commits derive the stored `edge` witness from the committed center along local `+X`
- the first shipped cut rejects zero-radius circles
- the viewport draft layer now samples a live circle ghost and shows a live radius witness line from center to hover
- no diameter mode, tangent variants, trim/extend behavior, circle entry-edit UI, or arc conversion shipped in this phase
