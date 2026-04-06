## [ ] - `3.2B-DrawSketch-7` - `Entity Transform And Modify Tools`

### Header

Purpose:
- add the first real post-selection sketch editing tools after `DrawSketch-3` and the snap family are stable

Owns:
- transform-style modify commands for committed sketch entities
- topology/shape modify commands like trim and extend
- structure/pattern commands like copy, array, explode, and join
- shared command/session rules for edit tools inside `Sketch Draw`
- the phase split for later line/entity editing growth

### Bigger Vision

AutoCAD-like sketch modify command backlog this family is meant to cover over time:

- transform / pattern:
  - `move`
  - `copy`
  - `rotate`
  - `scale`
  - `mirror`
  - `array`
- reshape / topology:
  - `stretch`
  - `trim`
  - `extend`
  - `offset`
  - `fillet`
  - `chamfer`
  - later if needed:
    - `break`
    - `lengthen`
- structure / cleanup:
  - `explode`
  - `join`

Suggested rule:
- `DrawSketch-7` should own modification of existing sketch entities
- new draw tools stay in their own `DrawSketch-N` phases
- snap/tracking growth stays in `DrawSketch-6`

### Questions / Decisions

#### [x] - `q1` Decide whether all requested modify tools should ship in one phase.

##### Suggestion
- locked direction:
- no
- split them into smaller subphases
- reason:
  - `move / copy / rotate / scale / mirror / array` are transform/pattern-family tools
  - `trim / extend / offset / fillet / chamfer / stretch` change geometry differently and carry different snap/selection demands
  - `explode / join` are structure/cleanup tools with their own command rules

#### [x] - `q2` Decide the first safe modify family to implement after selection and snap groundwork.

##### Suggestion
- locked direction:
- start with transform-family commands first:
  - `move`
  - `copy`
  - `rotate`
  - later `scale`
- reason:
  - they reuse entity selection
  - they fit the existing point/float-driven console model
  - they do not require topology surgery immediately

#### [x] - `q3` Decide the initial entity scope for these modify tools.

##### Suggestion
- locked direction:
- first scope should target committed top-level sketch entities only:
  - `line`
  - `pline`
  - `rectangle`
  - `circle`
- do not start with:
  - sub-entity point-only edits
  - profile-level edits
  - constraint-aware edits

### Implementation Spec

- current code truth:
  - `DrawSketch-3` already established committed entity selection and delete
  - the current `geometrySketchSession` already carries:
    - selected component ids
    - hovered component id
    - idle draw/session ownership
  - the `Entities` list in `ViewportOverlay` already mirrors committed sketch entity rows
- current gap:
  - there is no real edit-command family yet for committed sketch entities
  - there is no shared modify-session contract yet for transforms versus topology edits
- first architecture direction:
  - keep `DrawSketch-7` as the parent edit/modify family
  - land transform-family commands before topology-edit commands
  - keep structure/cleanup tools separate from transform and topology math where possible
  - use selection-driven command entry instead of inventing a second selection model
- likely runtime ownership will remain near:
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/components/ViewportOverlay.tsx`
  - `src/app/console/ConsoleDock.tsx`
  - `src/viewer/geometrySketchOverlay.ts`

### Long-Term Command Backlog

- transform / pattern:
  - `move`
  - `copy`
  - `rotate`
  - `scale`
  - `mirror`
  - `array`
- reshape / topology:
  - `stretch`
  - `trim`
  - `extend`
  - `offset`
  - `fillet`
  - `chamfer`
- structure / cleanup:
  - `explode`
  - `join`

### Subphases

#### [ ] - `3.2B-DrawSketch-7.0` - `Move Copy And Rotate First Pass`

Purpose:
- add the first true sketch-entity transform tools

Owns:
- `move`
- `copy`
- `rotate`
- shared selected-entity transform session rules

First targets:
- operate on the current committed entity selection set
- support viewport-assisted point/angle entry plus typed console values
- preserve selection/list/viewport sync through the transform session

#### [ ] - `3.2B-DrawSketch-7.1` - `Scale Mirror And Array`

Purpose:
- add the next transform/pattern family after `move`, `copy`, and `rotate`

Owns:
- `scale`
- `mirror`
- `array`

First targets:
- keep these in the same broad transform-family lane
- do not mix them with trim/extend math in the same implementation cut

#### [ ] - `3.2B-DrawSketch-7.2` - `Offset Fillet And Chamfer`

Purpose:
- add the first reshape helpers that still fit a relatively bounded command model

Owns:
- `offset`
- `fillet`
- `chamfer`

Reason to separate:
- these are more geometric than plain transforms
- but they are still more self-contained than trim/extend plus stretch

#### [ ] - `3.2B-DrawSketch-7.3` - `Stretch`

Purpose:
- add a first stretch workflow once transform-family sessions are proven

Owns:
- stretch selection rules
- stretch-specific point/segment behavior

Reason to separate:
- stretch is not just a plain whole-entity transform
- it is likely to require more nuanced point/segment ownership

#### [ ] - `3.2B-DrawSketch-7.4` - `Trim And Extend`

Purpose:
- add the first topology/length modification family

Owns:
- `trim`
- `extend`

Reason to separate:
- these require geometry intersection logic, target resolution, and command rules that differ sharply from transform tools

#### [ ] - `3.2B-DrawSketch-7.5` - `Explode And Join`

Purpose:
- add structure/cleanup commands after the broader edit families are stable

Owns:
- `explode`
- `join`

Reason to separate:
- these mutate entity ownership/structure instead of only position or local geometry

Recommended minimum safe count:
- `6` subphases total under `DrawSketch-7`
- reason:
  - keeps transform/pattern growth ahead of topology-edit growth
  - gives `offset / fillet / chamfer` a cleaner place than stuffing them into trim/extend
  - keeps stretch isolated from simpler whole-entity transforms
  - keeps trim/extend from blocking earlier move/rotate usefulness
  - keeps `explode / join` out of the geometry-edit math phases
