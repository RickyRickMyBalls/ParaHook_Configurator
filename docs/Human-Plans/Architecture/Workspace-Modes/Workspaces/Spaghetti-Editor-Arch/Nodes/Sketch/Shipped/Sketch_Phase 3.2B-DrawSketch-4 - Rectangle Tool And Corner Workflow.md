## [x] - `3.2B-DrawSketch-4` - `Rectangle Tool And Corner Workflow`

### Header

Status:
- shipped
- landed 2026-03-22

Purpose:
- add the first real `Rectangle` draw command to `Sketch Draw` using the same hybrid viewport-plus-console session model proven by `Line` and `PLine`

Owns:
- visible `Rectangle` tool exposure in `Sketch Draw`
- local alias:
  - `rec`
- first-corner / opposite-corner workflow
- live rectangle ghost preview in the viewport
- commit of first-class `rectangle` sketch components

### Shipped Behavior

- `Rectangle` now appears as a visible `Sketch Draw` tool in the viewport/console tool list
- typing:
  - `rectangle`
  - `rec`
  arms the same tool
- the shipped typed path is:
  - `rec > Vec2 > Vec2`
- first accepted point:
  - first corner
- second accepted point:
  - opposite corner
  - commit immediately
  - return to idle `Sketch Draw`
- empty `Enter` after `P1` accepts the current hovered `P2`
- click and typed `Vec2` inputs can be mixed inside one active rectangle command
- the viewport now shows a full closed rectangle ghost after `P1` exists
- commit writes one first-class axis-aligned `rectangle` component instead of exploding the result into separate lines

### Console / Status

- idle `Sketch Draw` now advertises `Rectangle` alongside `Line`, `PLine`, and `Previous`
- active rectangle sessions use the short command label:
  - `REC`
- the top command-status path now carries the live point target and hovered candidate:
  - `G > S > SD > REC > P1 > Vec(N,N)`
  - `G > S > SD > REC > P2 > Vec(N,N)`
- typed `Vec2` remains first-class and can be mixed with viewport picks inside one active rectangle command

### Implementation Notes

- the rectangle runtime lands as one first-class `rectangle` sketch component
- the first shipped cut stays axis-aligned in sketch space using:
  - first corner
  - opposite corner
- no rotated rectangle modes, center rectangle modes, dimension-first grammar, or post-commit rectangle editing shipped in this phase
- the console assist/input path was tightened during this work so late feature-assist prefills do not overwrite already-entered user input during the same activation window
