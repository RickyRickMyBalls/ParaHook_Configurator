## [x] - `3.2B-DrawSketch-2` - `Multi-Step Tool Sessions And Commit Rules`

### Header

Status:
- shipped
- landed 2026-03-21

Purpose:
- make `Line` and `PLine` behave like real multi-step sketch commands instead of one-off point drops

Owns:
- hybrid viewport-plus-console point entry for `Line` and `PLine`
- real `Line` two-point commit rules
- AutoCAD-style `PLine` progressive point rules
- top command-status path updates for `P1 / P2 / P3` plus live `Vec(N,N)`
- local draw commands:
  - `Previous` / `P`
  - `undo`
  - `enter`
  - `esc`
  - `back` / `b`

### Shipped Behavior

- `Line` now uses one shared two-point session seam:
  - viewport path:
    - arm `Line`
    - click `P1`
    - click `P2`
    - commit
    - return to idle `Sketch Draw`
  - console path:
    - arm `Line`
    - type `Vec2`
    - `Enter`
    - type `Vec2`
    - `Enter`
    - commit
    - return to idle `Sketch Draw`
- after `Line` has `P1`, empty `Enter` accepts the current hovered `P2`
- `PLine` now stays live across progressive point entry:
  - click or type `P1`
  - click or type `P2`
  - click or type later points
  - empty `Enter` finishes once there are at least 2 committed points
- click and typed `Vec2` are mixable inside the same active `Line` or `PLine` command
- `Esc` and `Back` now cancel the active draw tool directly back to idle `Sketch Draw`
- `undo` now removes only the last live point of the active uncommitted chain
- `Previous` / `P` re-arms only the last used draw tool with a fresh draft

### Console / Status

- active draw sessions no longer rely on assisted choice prefill inside the real input field
- the top command-status path now carries the live point target and candidate value:
  - `G > S > SD > L > P1 > Vec(N,N)`
  - `G > S > SD > L > P2 > Vec(N,N)`
  - `G > S > SD > PL > P1 > Vec(N,N)`
  - `G > S > SD > PL > P2 > Vec(N,N)`
  - `G > S > SD > PL > P3 > Vec(N,N)`
- typed `Vec2` remains first-class and replaces any live hovered candidate
- once `PLine` is finishable, empty `Enter` means `Finish`

### Implementation Notes

- `Line` now returns to idle after commit instead of silently staying armed
- `PLine` still keeps geometry temporary until finish
- `Previous` remembers the last tool only; it does not auto-chain from the last endpoint in this phase
- later editing breadth, endpoint chaining, richer constraints, and broader tool families remain future work under later draw phases
