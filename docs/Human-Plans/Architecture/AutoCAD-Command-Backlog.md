# AutoCAD Command Backlog

## Doc Header

### Doc History
6. 2026-03-23 00:46: Reformatted the bottom `FULL LIST` again so unfinished rows now use plain `[ ]` markers instead of backticked checkbox text, while the achieved rows keep the stronger backticked styling for extra visual emphasis
5. 2026-03-23 00:44: Cleaned the bottom `FULL LIST` formatting pass by removing one duplicate `window polygon` row and the stale unchecked `rectangle` entry so the flattened checklist stays deduplicated and status-correct
4. 2026-03-23 00:43: Reformatted the bottom `FULL LIST` checklist so only achieved items keep backticks, making the shipped command coverage stand out visually from the larger plain-text backlog
3. 2026-03-23 00:40: Corrected the first `FULL LIST` pass so shipped items like `orbit`, `pan`, `rectangle`, `delete`, and the selection entries now keep the same status they already had in the earlier family sections instead of regressing in the flattened checklist
2. 2026-03-23 00:39: Expanded the new bottom `FULL LIST` section into one simple flat checklist of the AutoCAD-style commands already named elsewhere in this file, deduplicating the repeated family sections into one scan-friendly backlog surface
1. 2026-03-23 00:31: Created this architecture backlog doc to hold one broad AutoCAD-style command inventory for ParaHook, separating the long-term command-adoption target from narrower family docs like `Sketch`, `Camera-Controls`, and node-specific phase plans

### Purpose

This doc is the broad AutoCAD-style command backlog for ParaHook.

Use it to answer:
- which command families ParaHook will likely need eventually
- which commands belong to view/navigation versus sketch authoring versus modify/edit work
- where already-shipped partial command coverage exists
- which command families are still only backlog, not yet assigned to a concrete phase

### Scope

This doc covers:
- the command backlog most relevant to ParaHook's current CAD-like direction
- root view/navigation commands
- sketch draw commands
- sketch modify/edit commands
- snap/tracking command families
- later annotation/constraint-style backlog worth keeping visible

This doc does not mean:
- ParaHook must copy every AutoCAD command literally
- every command listed here deserves a near-term phase
- aliases, prompts, and exact workflow wording are already locked

## Command Families

### View / Navigation

- `[x]` `zoom`
  - root `Zoom`
  - scoped `Graph > Zoom`
  - local `Sketch Draw > Zoom`
- `[x]` `pan`
- `[x]` `orbit`
- `[ ]` `view`
- `[ ]` `ucs`
- `[ ]` `plan`
- `[ ]` `lookfrom`
- `[ ]` `regen`
- `[ ]` `3dorbit` refinement / richer orbit modes

Notes:
- current view/navigation work mostly lives under the `Camera-Controls` family
- `zoom`, `pan`, and `orbit` are already partial shipped ParaHook commands

### Selection

- `[x]` single-select committed sketch entities
- `[x]` window selection
- `[x]` crossing selection
- `[ ]` fence selection
- `[ ]` window polygon
- `[ ]` crossing polygon
- `[ ]` last
- `[ ]` previous selection set
- `[ ]` all
- `[ ]` remove / subtract from selection
- `[ ]` add / union into selection

Notes:
- current sketch selection work is already partly shipped through `DrawSketch-3`

### Object Snaps

- `[x]` origin snap
- `[ ]` endpoint
- `[ ]` midpoint
- `[ ]` center
- `[ ]` quadrant
- `[ ]` nearest
- `[ ]` perpendicular
- `[ ]` tangent
- `[ ]` intersection
- `[ ]` apparent intersection
- `[ ]` extension
- `[ ]` parallel
- `[ ]` node
- `[ ]` insertion

Notes:
- current snap-family growth is now tracked under `DrawSketch-6`

### Tracking / Drafting Aids

- `[ ]` ortho
- `[ ]` polar tracking
- `[ ]` object snap tracking
- `[ ]` temporary tracking overrides
- `[ ]` guide-line / inference visualization

### Sketch Draw / Create

- `[x]` `line`
- `[x]` `pline`
- `[x]` `rectangle`
- `[x]` `circle`
- `[ ]` `arc`
- `[ ]` `polygon`
- `[ ]` `ellipse`
- `[ ]` `point`
- `[ ]` `ray`
- `[ ]` `xline`
- `[ ]` `spline`
- `[ ]` `donut`
- `[ ]` `boundary`
- `[ ]` `region`
- `[ ]` `hatch`

Notes:
- current draw-tool growth mostly lives in the `DrawSketch` family

### Sketch Modify / Edit

#### Transform / Pattern

- `[ ]` `move`
- `[ ]` `copy`
- `[ ]` `rotate`
- `[ ]` `scale`
- `[ ]` `mirror`
- `[ ]` `array`

#### Reshape / Topology

- `[ ]` `stretch`
- `[ ]` `trim`
- `[ ]` `extend`
- `[ ]` `offset`
- `[ ]` `fillet`
- `[ ]` `chamfer`
- `[ ]` `break`
- `[ ]` `lengthen`

#### Structure / Cleanup

- `[x]` `delete` / `erase`
- `[ ]` `explode`
- `[ ]` `join`

Notes:
- current modify-family planning lives under `DrawSketch-7`
- `delete` is already effectively shipped through sketch selection/delete

### Annotation / Constraint / Measurement

- `[ ]` `dim`
- `[ ]` `qdim`
- `[ ]` `leader`
- `[ ]` `mleader`
- `[ ]` `text`
- `[ ]` `mtext`
- `[ ]` geometric constraints
- `[ ]` dimensional constraints
- `[ ]` measure / distance
- `[ ]` area
- `[ ]` angle

Notes:
- this family is likely later than the current draw/snap/modify work
- it is listed here so the command backlog stays visible

### Blocks / References / Content Reuse

- `[ ]` block-like insert
- `[ ]` reference attach
- `[ ]` explode block/reference instance
- `[ ]` align imported/reference content
- `[ ]` isolate / hide
- `[ ]` layer-like visibility control

Notes:
- some of this may map into ParaHook references/content systems rather than literal AutoCAD clones

## Suggested Priority Order

### Near-Term

- `[x]` `zoom`
- `[x]` `pan`
- `[x]` `orbit`
- `[x]` `line`
- `[x]` `pline`
- `[x]` `rectangle`
- `[x]` `circle`
- `[x]` sketch selection / delete
- `[ ]` snap toolbar cleanup
- `[ ]` endpoint snap

### Next

- `[ ]` midpoint / center / quadrant snaps
- `[ ]` `move`
- `[ ]` `copy`
- `[ ]` `rotate`
- `[ ]` `scale`
- `[ ]` `mirror`
- `[ ]` `array`

### After That

- `[ ]` `offset`
- `[ ]` `fillet`
- `[ ]` `chamfer`
- `[ ]` `stretch`
- `[ ]` `trim`
- `[ ]` `extend`
- `[ ]` ortho
- `[ ]` polar tracking

### Later

- `[ ]` `explode`
- `[ ]` `join`
- `[ ]` `break`
- `[ ]` `lengthen`
- `[ ]` annotation / dimension / constraint families
- `[ ]` broader `view` / `ucs` / drafting utility commands

## Family Mapping

- `Camera-Controls`
  - `zoom`
  - `pan`
  - `orbit`
  - broader view commands
- `Sketch > DrawSketch-4/5/...`
  - draw/create tools
- `Sketch > DrawSketch-6`
  - snaps and tracking aids
- `Sketch > DrawSketch-7`
  - modify/edit commands on existing entities

## Reference Sources

Official Autodesk references used for naming direction:
- AutoCAD shortcuts and command names:
  - https://damassets.autodesk.com/content/dam/autodesk/www/pdfs/autocad-lt-2025-shortcut-guide-en.pdf
- AutoCAD help / command reference root:
  - https://help.autodesk.com/


## FULL LIST

- [ ] 3dorbit
- [ ] all
- [ ] angle
- [ ] apparent intersection
- [ ] arc
- [ ] area
- [ ] array
- [ ] boundary
- [ ] break
- [ ] center
- [ ] chamfer
- `[x]` `circle`
- [ ] crossing polygon
- `[x]` `crossing selection`
- `[x]` `delete`
- [ ] dim
- [ ] dimensional constraints
- [ ] donut
- [ ] ellipse
- `[x]` `erase`
- [ ] endpoint
- [ ] explode
- [ ] extension
- [ ] extend
- [ ] fence selection
- [ ] fillet
- `[x]` `line`
- [ ] lookfrom
- [ ] join
- [ ] geometric constraints
- [ ] hatch
- [ ] insertion
- [ ] intersection
- [ ] isolate
- [ ] last
- [ ] layer-like visibility control
- [ ] leader
- [ ] lengthen
- [ ] measure
- [ ] midpoint
- [ ] mirror
- [ ] mleader
- [ ] move
- [ ] mtext
- [ ] nearest
- [ ] node
- [ ] object snap tracking
- `[x]` origin snap
- [ ] ortho
- [ ] offset
- `[x]` `pan`
- [ ] parallel
- [ ] perpendicular
- [ ] plan
- [ ] point
- `[x]` `pline`
- [ ] polar tracking
- [ ] polygon
- [ ] previous selection set
- [ ] qdim
- [ ] quadrant
- [ ] ray
- [ ] reference attach
- [ ] regen
- [ ] remove / subtract from selection
- [ ] add / union into selection
- [ ] region
- [ ] rotate
- [ ] scale
- `[x]` single-select committed sketch entities
- [ ] spline
- [ ] stretch
- [ ] tangent
- [ ] text
- [ ] temporary tracking overrides
- [ ] guide-line / inference visualization
- [ ] trim
- [ ] ucs
- [ ] view
- [ ] window polygon
- `[x]` `window selection`
- [ ] xline
- `[x]` `orbit`
- `[x]` `rectangle`
- `[x]` `zoom`
