## [~] - `3.2B-6` - `Sketch Content Ownership And Later Export`

### Header

Purpose:
- let sketch stand on its own as authored vector content, not just as a body-feature feeder
- keep `Sketches` as a sibling content family beside `Assembly`, not as an `Assembly` child

Owns:
- stronger `Sketches` content-family identity
- later vector-export direction like `.dxf`
- richer sketch-content ownership beyond the node-only editing surface

Current status:
- the first browser/content ownership cut is now shipped
- sketches now surface under a real `Sketches` browser family instead of only living inside node-local editing UI
- later vector export such as `.dxf` is still deferred

Hierarchy decision:
- `Content`
  - `Assembly`
  - `Sketches`
- `Sketches` is a sibling family beside `Assembly`
- individual authored sketches live under `Sketches`
- `SketchPlane` stays a child setup surface inside each sketch, not a sibling of `Sketches`

### Questions / Decisions

#### [x] - `q1` Decide how far sketch should stand on its own as authored vector content beyond body-feature use.

##### Suggestion
- strengthen `Sketches` as a content family
- leave concrete export details like `.dxf` to a later deeper spec
- use this phase to lock the ownership direction first

### Implementation Spec

- first implementation should focus on:
  - stronger sketch-content ownership language
  - later vector-export direction
  - keeping sketch meaningful even without immediate downstream solid consumption

Current code truth:
- the Browser now exposes a `Sketches` content family as a sibling of `Assembly` under the broader content structure
- each authored `Geometry/Sketch` node can now surface one browser-visible sketch row
- each sketch row can jump back into its graph authoring node through the shared Browser focus path
- the first shipped browser row reads sketch ownership through:
  - graph document
  - plane
  - component count
  - profile count
  - diagnostics state

First shipped cut:
- add a `Sketches` browser root row
- add one child row per authored `Geometry/Sketch`
- keep those rows visible even when no downstream solid feature consumes them
- make the row actionable as authored content by letting it focus back into the source graph node

Still later:
- concrete `.dxf` export
- detached sketch-file packaging
- deeper browser child depth like `Curves / Profiles / Export`
- final sketch visibility/exposure policy outside the first browser/content identity cut

Acceptance shape:
- [x] the Browser exposes a visible `Sketches` content family
- [x] authored `Geometry/Sketch` nodes appear there as real sketch rows
- [x] sketch rows remain meaningful even without immediate downstream solid consumption
- [x] sketch rows can jump back to their authoring graph node
- [ ] `.dxf` or other vector export remains for a later deeper follow-on

Important rule:
- `3.2B-1` through `3.2B-3` are primarily about sketch-plane/source workflow
- `3.2B-4` through `3.2B-6` are primarily about sketch exposure, browser ownership, and later content growth

### Shipped Summary

- `useAppStore` now derives authored sketch browser rows from `Geometry/Sketch` nodes
- the Browser tree now renders a `Sketches` root plus per-sketch child rows
- sketch rows expose authored-content identity outside the node-local feature editor without pretending the later export story is already done
- `View In Graph` and direct row selection both route sketch rows back into their source graph node
