# Spaghetti Types

## Doc Header
### Fold Hack 3
#### Doc History

53. 2026-03-16 17:54: Replaced the deferred `Pattern` node with a ParaHook-side `Array` wrapper node and broke it into `Linear`, `Circular`, and `Path` array modes, matching the current plan to treat repetition as a higher-level custom feature rather than a direct Replicad command name
52. 2026-03-16 17:49: Expanded the numbered foundational checklist with the next feature-node candidates after `Sketch`, `Extrude`, and `Loft`, marking `Boolean`, `Fillet`, `Shell`, and `Sweep` as the strongest first-round additions while leaving `Mirror`, `Pattern`, `TrimSplit`, and `Revolve` deferred
52. 2026-03-16 17:59: Added a small phase breakdown at the bottom of the simple checklist for the first four numbered sections (`Data Types`, `Sketch`, `Extrude`, `Loft`), so the foundational node-system work can be discussed as staged implementation waves without splitting into a separate planning doc yet
51. 2026-03-16 17:42: Added simple hierarchical numbering across the `Simple Sketch / Extrude / Loft Node Checklist` so the data types, node sections, and subitems can be counted and referenced more easily during planning
50. 2026-03-16 17:38: Reworked the `Loft` section around the same mode-based user-facing design as `Extrude`, so it now starts with `in:LoftType - [Enum]`, groups the required inputs for `Basic` versus `RailGuided` lofting, and publishes one main `out:SolidBody - [SolidBody]` result
49. 2026-03-16 17:33: Reworked the `Extrude` section around a mode-based user-facing design, so it now starts with `in:ExtrudeType - [Enum]`, shows the required inputs per `Basic` versus `Twist` mode, and publishes one main `out:SolidBody - [SolidBody]` result instead of listing low-level engine helper outputs directly
48. 2026-03-16 17:24: Restyled the `Loft` block to match the newer `Sketch` / `Extrude` contract format, so it now uses the same `# / ## / ###` ladder with direction-first `in:` and `out:` rows instead of the older flat `Inputs` / `Outputs` bullet list
47. 2026-03-16 17:21: Restyled the `Extrude` block to match the newer `Sketch` contract format, so it now uses the same `# / ## / ###` ladder with direction-first `in:` and `out:` rows instead of the older flat `Inputs` / `Outputs` bullet list
46. 2026-03-16 17:13: Renamed the top `Param Types` section to `Data Types` so the heading now matches the broader reality of the list, which covers not just param primitives but also transforms, planes, sketch geometry, solid bodies, and composite wrapper types
45. 2026-03-16 17:08: Finished restyling the top `Param Types` block into the same heading-like ladder the user started, so all type groups now use `- ## Group Name` and every type entry uses `- ### [ ] [Type]` instead of mixing one converted row with older flat bullets
44. 2026-03-16 17:03: Restyled the top `Param Types` list so the type names themselves now stay in square brackets (`[Plane]`, `[Float]`, `[SketchCurveRef]`, etc.), matching the newer sketch-contract formatting and preserving the preferred orange visual treatment
43. 2026-03-16 16:58: Corrected the parent `Sketch` input-row word order so those setup entries now read as `in:SketchPlane - [Plane]`, `in:SketchPlace - [Transform2D]`, and so on, matching the same direction-first pattern already used by the output rows and operation mini-contracts
42. 2026-03-16 16:55: Removed the backticks from the parent `Sketch` checklist markers in the `Inputs` / `Outputs` block so those rows now visually match the plain checklist treatment used by the `Operation subnodes`
41. 2026-03-16 16:52: Corrected the parent `Sketch` `Inputs` / `Outputs` rows so they now use `in:` for consumed setup values and `out:` for published sketch results, bringing the section labels back in line with the actual direction of data flow
40. 2026-03-16 16:46: Restyled the `Sketch` `Inputs` block into the same compact typed-row pattern as the primitive/source block, so the setup helpers now show their produced value directly (`out:[Plane]`, `out:[Transform2D]`, etc.) instead of reading as bare names only
39. 2026-03-16 16:39: Tightened the `Operation subnodes` field/type format again so those sketch-operation rows now consistently read as `in:Field - [Type]` and `out:Field - [Type]`, keeping the compact line style while removing the extra square brackets around field names only
38. 2026-03-16 16:24: Removed the square brackets from the type names in the compact `Operation subnodes` mini-contracts so the sketch operation rows now read as `in:[Field] - Type` and `out:[Field] - Type`, matching the latest preferred `SketchLine` example
37. 2026-03-16 16:19: Simplified the `Operation subnodes` block again into the compact two-line mini-contract style, so each sketch operation now reads as `### NodeName` followed by inline `in:[Field] - [Type]` and `out:[Field] - [Type]` rows instead of the larger nested `Inputs` / `Outputs` tree
36. 2026-03-16 16:14: Normalized the `Operation subnodes` block again to follow the newer stronger heading style, so every sketch operation now uses plain checklist markers, backticked node names, plain `Inputs` / `Outputs` headers, and bracketed field/type labels like `[EndPoint] - [Vec2]`
35. 2026-03-16 16:08: Realigned the `Operation subnodes` block to follow the newer plain-text `SketchLine` style, so the other sketch operations now use the same no-backticks naming, `#### Inputs` / `#### Outputs` nesting, and plain `[Type]` tags instead of the older mixed formatting
34. 2026-03-16 15:53: Added backticks to all operation-subnode names in the simple `Sketch` checklist so that whole block now uses one consistent visual treatment for the `### [ ] - Name` rows
33. 2026-03-16 15:50: Restyled the remaining `Operation subnodes` entries in the simple `Sketch` checklist to match the same inline `### [ ] - Name` visual pattern already used by the earlier operation rows and the primitive/source block
32. 2026-03-16 15:48: Restyled the `Primitive / source subnodes` portion of the simple `Sketch` checklist to match the newer inline visual pattern, so those source entries now read consistently as heading-like checklist rows with their output type shown directly on the line
31. 2026-03-16 15:45: Rebuilt the malformed simple `Sketch / Extrude / Loft` checklist block into one clean nested list, fixing the mixed heading/bullet markup drift and restoring the preferred compact `[ ] - NodeName` tree shape
30. 2026-03-16 15:39: Normalized the simple checklist line format so node entries now consistently read as `[ ] - NodeName` with nested backticked `Inputs` / `Outputs` labels beneath them, matching the preferred compact tree style
29. 2026-03-16 15:35: Re-simplified the simple `Sketch / Extrude / Loft` contract back into one continuous nested checklist, removing the internal heading-heavy structure and moving param-type information into the nested input/output bullets instead of repeating inline type tags on every node line
28. 2026-03-16 15:28: Added a dedicated `Sketch Builder` section above the simple node checklist so the architecture docs now explicitly record that the canvas `Sketch` composite node should open a separate sketch-authoring surface, likely in the model viewport, while still owning the editable sketch command stack and publishing the resulting sketch outputs back into the graph
27. 2026-03-16 14:55: Tightened the simple `Sketch / Extrude / Loft` checklist spacing and indentation so the heading tree now reads more like one continuous nested list instead of a set of disconnected spaced-out blocks
26. 2026-03-16 14:52: Reset the simple `Sketch / Extrude / Loft` checklist to start at `#` and use a shallower heading ladder overall, so the fold tree stays usable without the old very-deep heading chain
25. 2026-03-16 14:43: Reworked the simple `Sketch / Extrude / Loft` checklist into a deeper heading hierarchy so the planning contract can collapse cleanly in the editor, replacing the inline section labels with real heading levels for param-type groups, node `Inputs` / `Outputs`, and the individual sketch operation mini-contracts
24. 2026-03-16 14:40: Broke the `Sketch` operation subnodes down into mini input/output contracts using the current best Replicad-aligned read, so the simple checklist now distinguishes between operations that map cleanly to known sketch API calls and the more provisional wrapper operations that still need later exact locking
23. 2026-03-16 14:38: Corrected the nested `SketchOffset` mini-contract inside the simple `Sketch` checklist so it now uses the real `[ ] / [~]` checklist markers, consistent spelling, and the same typed input/output formatting as the rest of the foundational node list
22. 2026-03-16 14:33: Reworked the simple `Sketch` checklist around the primitive-versus-operation rule so the composite now reads as top-level inputs plus internal primitive/source subnodes, internal operation subnodes, and top-level outputs instead of incorrectly treating all sketch operations as direct composite outputs
21. 2026-03-16 14:31: Applied the same `Inputs / Outputs` sub-indent pattern to the simple `Sketch` and `Loft` checklist blocks so the whole foundational-node list now reads in one consistent contract-style structure
20. 2026-03-16 14:30: Restructured the simple `Extrude` checklist into `Inputs` and `Outputs` with one more sub-indent for the param types, so the foundational node list can start reading like a real contract instead of one flat option list
19. 2026-03-16 14:36: Added `Loft` to the simple foundational checklist so the first planned solid-feature set now reads as `Sketch -> Extrude -> Loft` instead of stopping at only the first two nodes
18. 2026-03-16 14:30: Grouped the `Param Types` subsection into simple one-line headers with indented child types so the foundational vocabulary list now reads as a clearer reusable type system instead of one flat mixed checklist
17. 2026-03-16 14:27: Added a dedicated `Param Types` subsection above the simple `Sketch / Extrude` checklist so the bracketed type hints used in that working list now have one local scan-friendly home
16. 2026-03-16 14:25: Added simple bracketed param-type hints to the condensed `Sketch / Extrude` checklist so the first-pass node list now shows the intended data/command kind beside each parent node and subnode instead of only listing names
15. 2026-03-16 14:21: Indented the condensed `Sketch / Extrude` checklist so parent composite nodes and their internal subnodes now read as a clearer hierarchy instead of one flat list
14. 2026-03-16 14:18: Added one condensed `Sketch / Extrude` node checklist so the first foundational composite-node plan now has a single scan-friendly list of the discussed sketch and extrude nodes/options, marked as first-pass `[~]` versus later `[ ]`
13. 2026-03-16 14:08: Expanded the future `Extrude` section with matching first-pass input and output type notes so the first two foundational node plans now use the same shape: what `Extrude` should consume from `Sketch`, what local/default driver values it should accept, and what body/part result it should publish downstream
12. 2026-03-16 14:04: Added a dedicated future `Extrude` section beside the `Sketch` planning block so this doc now records the main Replicad-aligned extrude options/commands ParaHook will likely need, with the safest first-pass surface marked as `[~]`
11. 2026-03-16 13:34: Expanded the future `Sketch` composite section again with the first-pass internal subnode list, clarifying that the long-range `Sketch` node should be understood as a composite over explicit frame, geometry, profile, and driver subnodes rather than as one opaque sketch blob
10. 2026-03-16 13:28: Expanded the future `Sketch` composite direction with a first-pass output-type note so this doc now records that `Sketch` should likely publish raw `SketchCurves`, discovered `SketchProfiles`, and one selected `SketchProfile` rather than collapsing all sketch output into one generic spline-like payload
9. 2026-03-16 13:23: Added a dedicated future composite-node subsection so this doc now tracks the likely parent/composite nodes ParaHook may want later, separating that longer-range graph-organization idea from both the live node registry and the lower-level Replicad-command checklist
8. 2026-03-16 13:18: Added a Replicad-command coverage checklist under the Replicad direction section so this doc now tracks which sketch/solid/curve operations ParaHook already covers, only partially covers, or still needs before the planned Spaghetti node language can honestly mirror the needed worker-side command vocabulary
7. 2026-03-16 13:15: Reorganized the whole doc body into a cleaner current-vs-future structure, reducing repetition and separating current code truth, identity terms, current node inventory, and future node directions more clearly
6. 2026-03-16 13:13: Kept the future node checklist cleaner by moving the longer Replicad/sketch-command explanation into its own section, leaving the node list itself easier to scan while preserving the note that `Sketch` is the likely first composite Replicad-aligned node
5. 2026-03-16 13:10: Added a concrete future `Sketch` node direction to the node checklist, clarifying that the likely first Replicad-aligned composite node should host sketch/profile creation plus placement/orientation commands internally instead of immediately exploding those commands into separate top-level graph nodes
4. 2026-03-16 12:45: Expanded the future-node ideas list with a ParaHook-specific feature subsection so the doc now names the concrete feature nodes likely needed to build the real foothook family, based on the current sketch/extrude/close-profile schema plus the toe-hook and heel-kick loft/rail seams already present in the registry
3. 2026-03-16 12:43: Added a separate future-node ideas checklist under the live registry checklist so the architecture docs now distinguish current registered nodes from plausible next-wave node families such as Feature Stack, structure/composition, generic part, material, and export-oriented nodes
2. 2026-03-16 12:41: Added a current registry node checklist grouped by family, marking each live node type as `[x]`, `[~]`, or `[L]` using the current planning read so the architecture docs now have one scan-friendly list of which nodes look stable, evolving, or removable
1. 2026-03-16 12:36: Created this doc as the human-readable type and identity map for the current Spaghetti graph/editor/build/content vocabulary so planning language can stay aligned with the real `/src/` type seams

### Purpose

This doc explains the main Spaghetti type names used in the current codebase.

Use it when:
- planning language and code language start drifting apart
- you need to know what the graph editor actually calls a thing
- you need a quick map of graph ids versus publish/content ids

Do not use it for:
- low-level field-by-field schema reference
- worker pipeline implementation details
- final product vision

## Doc Body

### Overview

This doc is the bridge between four vocabularies that are easy to blur together:
- graph/editor types
- output/publish types
- project/content types
- viewer/render identities

It should answer two questions quickly:
- what does the current code call this thing?
- is this a current node, a current type, or a future planning idea?

### Current Code Vocabulary

These are the core names used by the live `/src/` code.

#### Graph / Editor Types

- `GraphDocument`
  - one saved/open graph document in the workspace
  - owns one `SpaghettiGraph`
  - main id: `graphDocumentId`
- `SpaghettiGraph`
  - one graph payload
  - contains `nodes`, `edges`, and optional graph-level UI metadata
- `SpaghettiNode`
  - one node on the canvas
  - main fields: `nodeId`, `type`, `params`
- `SpaghettiEdge`
  - one wire/connection in the graph
  - main id: `edgeId`

#### Output / Publish Types

- `OutputPreviewParams`
  - graph-owned output publication params
  - current bridge between graph output intent and Browser/content lift
- `OutputPreviewObject`
  - one authored object entry inside `OutputPreview`
  - main fields:
    - `objectId`
    - `label`
    - `slotId`
    - `orderIndex`

#### Project / Content Language

Current practical Browser/content language:
- `Assembly`
- `Component`
- `Object`

Planned long-range content language:
- `Root Assembly`
- `Sub Assembly`
- `Component`
- `Object`
- `Part`
- later `Sub Part`

Important distinction:
- `SpaghettiNode` is a graph/editor object
- `Component / Object / Part` are published content/build-chunk entities

### Identity Map

These ids do different jobs and should not be conflated.

#### Graph / Editor Identity

- `graphDocumentId`
- `nodeId`
- `edgeId`

#### Output / Publish Identity

- `slotId`
- `objectId` for authored output-object identity inside `OutputPreview`

#### Project / Content Identity

- `assemblyId`
- `componentId`
- `objectId`
- later `partId`

Important rule:
- root/sub should come from hierarchy, not separate id families

#### Viewer / Render Identity

- `viewerKey`
  - render/viewer identity only
  - not graph/source identity
  - not final content/build ownership

### Quick Translation

- "graph file" -> `GraphDocument`
- "graph payload" -> `SpaghettiGraph`
- "node on the canvas" -> `SpaghettiNode`
- "wire" -> `SpaghettiEdge`
- "output object entry" -> `OutputPreviewObject`
- "published component/object/part" -> project/content entity

### Current Direction Tension

The current code still leans on:
- graph-owned output publication
- part-node-internal Feature Stack editing

The planning direction is moving toward:
- richer project/content ownership
- more explicit published build chunks
- possibly more first-class Feature Stack ownership later

### Current Registry Node Checklist

This is a planning/status read of the current node registry, not a hard product guarantee.

Marker meanings here:
- `[x]` = looks close to the intended long-term direction
- `[~]` = active/evolving and likely needs meaningful design or architecture change
- `[L]` = legacy/proof/residue that should probably be removed later

#### Part Nodes

- `[~]` `Part/Baseplate`
- `[~]` `Part/Cube`
- `[L]` `Part/CubeProof`
- `[~]` `Part/ToeHook`
- `[~]` `Part/HeelKick`

#### Output Nodes

- `[~]` `System/OutputPreview`
- `[~]` `Output/Assembled`

#### Param Nodes

- `[x]` `Param/Number`
- `[x]` `Param/Boolean`
- `[x]` `Param/Vec2`

#### Primitive Nodes

- `[x]` `Primitive/Number`
- `[x]` `Primitive/Vec2`
- `[x]` `Primitive/SplineFromPoints`

#### Utility Nodes

- `[~]` `Utility/IdentitySpline2`
- `[~]` `Utility/IdentityNumberMm`

### Future Node Ideas

These are not current registry entries.

#### General Future Node Families

##### Feature Stack / Feature Nodes

- `[ ]` `FeatureStack`
- `[ ]` `Sketch`
- `[ ]` `Feature/Sketch2`
- `[ ]` `Feature/CloseProfile`
- `[ ]` `Feature/Extrude`
- `[ ]` `Feature/Loft`
- `[ ]` `Feature/Boolean`

##### ParaHook-Specific Feature Nodes

- `[ ]` `Feature/RailMath`
- `[ ]` `Feature/ToeLoft`
- `[ ]` `Feature/HeelLoft`
- `[ ]` `Feature/ProfileTrim`
- `[ ]` `Feature/AnchorSpline`

##### Structure / Composition Nodes

- `[ ]` `Structure/Assembly`
- `[ ]` `Structure/Component`
- `[ ]` `Structure/Object`

##### Composite Node Candidates

These are graph-facing parent/composite nodes, not project/content rows.

- `[ ]` `Composite/Sketch`
- `[ ]` `Composite/Extrude`
- `[ ]` `Composite/Loft`
- `[ ]` `Composite/Boolean`
- `[ ]` `Composite/FeatureStack`
- `[ ]` `Composite/Part`
- `[ ]` `Composite/Baseplate`
- `[ ]` `Composite/ToeHook`
- `[ ]` `Composite/HeelKick`

##### Part / Publish Nodes

- `[ ]` `Part/Generic`
- `[ ]` `Output/Component`
- `[ ]` `Output/Object`

##### Material / Export Nodes

- `[ ]` `Material/Assign`
- `[ ]` `Output/Export`

### Replicad Command Direction

This section explains how some of the future node ideas should probably map to Replicad-style operations.

#### Replicad Command Coverage Checklist

This is a practical coverage read, not a claim of full 1:1 Replicad parity.

Marker meanings here:
- `[x]` = the current system already has a real equivalent in the graph/feature-stack contract
- `[~]` = partial or embedded coverage exists, but the command is not yet cleanly exposed as a first-class Spaghetti command/node
- `[ ]` = still missing as a real command surface

##### Sketch / Profile Commands

- `[~]` `Plane`
- `[x]` `Line`
- `[x]` `Arc3Point`
- `[x]` `BezierSpline`
- `[x]` `CloseProfile`
- `[~]` `ProfileSelect`

##### Sketch Placement / Orientation

- `[ ]` `Place`
- `[ ]` `Translate`
- `[ ]` `Rotate`
- `[ ]` `Mirror`
- `[ ]` `OffsetPlane`

##### Solid Creation

- `[x]` `Extrude`
- `[ ]` `Loft`
- `[ ]` `Revolve`

##### Solid Modification

- `[ ]` `BooleanUnion`
- `[ ]` `BooleanCut`
- `[ ]` `BooleanIntersect`
- `[ ]` `Fillet`
- `[ ]` `Chamfer`
- `[ ]` `Shell`
- `[~]` `Offset`
- `[ ]` `Thicken`

##### Curve / Rail

- `[~]` `Spline`
- `[~]` `Rail`
- `[ ]` `Project`
- `[ ]` `Trim`

##### ParaHook-Biased Read

For the current ParaHook family, the most important commands to get to `[x]` are likely:
- `Plane`
- `Line`
- `Arc3Point`
- `BezierSpline`
- `CloseProfile`
- `ProfileSelect`
- `Extrude`
- `Loft`
- `Rail`
- `Fillet`
- maybe `Shell`
- maybe `BooleanCut`

#### Likely First Replicad-Aligned Composite Node

- the likely first Replicad-aligned move is one composite `Sketch` node, not a large set of tiny top-level sketch-command nodes immediately

Why:
- it keeps the first graph-facing sketch authoring surface aligned with Replicad-style operations
- it avoids exploding the graph too early with a separate top-level node for every low-level sketch command

#### Sketch Commands Likely To Live Inside `Sketch`

Sketch / profile creation:
- `Plane`
- `Line`
- `Arc3Point`
- `BezierSpline`
- `CloseProfile`
- `ProfileSelect`

Sketch placement / orientation:
- `Place`
- `Translate`
- `Rotate`
- `Mirror`
- later `OffsetPlane`

#### First-Pass `Sketch` Output Types

`Sketch` should likely publish more than one output shape/type so downstream nodes can ask for either the raw curve network or one resolved closed profile.

- `SketchCurves`
  - the raw 2D geometry set authored inside the composite
  - useful for downstream operations that still want access to loose sketch geometry
- `SketchProfiles`
  - the discovered closed-profile set derived from the sketch curves
  - useful when one sketch contains multiple valid closed regions
- `SketchProfile`
  - one selected closed profile
  - likely the main first-pass downstream output for `Extrude`, `Loft`, and similar solid features

Clean first-pass read:
- primary output: `SketchProfile`
- secondary outputs:
  - `SketchCurves`
  - `SketchProfiles`

#### First-Pass Internal `Sketch` Subnodes

If `Sketch` becomes a real composite node, the internal graph should likely stay explicit enough that the composite can be understood as a wrapper over named sketch subnodes rather than a hidden monolith.

Frame / placement:
- `SketchPlane`
- `SketchPlace`
- `SketchTranslate`
- `SketchRotate`
- later `SketchMirror`
- later `SketchOffsetPlane`

Geometry:
- `SketchLine`
- `SketchArc3Point`
- `SketchBezierSpline`

Profile logic:
- `SketchCloseProfile`
- `SketchProfileSelect`

Drivers / values:
- `SketchNumber`
- `SketchBoolean`
- `SketchVec2`

Later reference / helper subnodes:
- `SketchSplineRef`
- `SketchProject`
- `SketchTrim`
- `SketchOffset`

Clean first-pass internal set:
- `SketchPlane`
- `SketchPlace`
- `SketchTranslate`
- `SketchRotate`
- `SketchLine`
- `SketchArc3Point`
- `SketchBezierSpline`
- `SketchCloseProfile`
- `SketchProfileSelect`
- `SketchNumber`
- `SketchBoolean`
- `SketchVec2`

#### `Extrude` Replicad Command / Option Checklist

This is the next likely foundational node after `Sketch`.

Marker meanings here:
- `[~]` = good first-pass surface to ship early
- `[ ]` = likely later option once the basic `Sketch -> Extrude` path is stable

Main extrude-facing options:
- `[~]` `Distance`
- `[~]` `Direction`
- `[~]` `Origin`
- `[ ]` `TwistAngle`
- `[ ]` `ExtrusionProfile`

Related lower-level engine helpers:
- `[ ]` `basicFaceExtrusion`
- `[ ]` `complexExtrude`
- `[ ]` `supportExtrude`
- `[ ]` `twistExtrude`

Clean first-pass `Extrude` read:
- consume `SketchProfile`
- expose `Distance`
- expose `Direction`
- expose `Origin`
- leave `TwistAngle` and more advanced extrusion variants for later

#### First-Pass `Extrude` Input Types

`Extrude` should mostly consume one resolved sketch profile plus a small set of driver/config values.

- `SketchProfile`
  - the main downstream input from `Sketch`
  - the closed profile to extrude into depth
- `Distance`
  - the basic extrusion depth
  - likely a number/length param
- `Direction`
  - the extrusion direction
  - should still be visible even if the local default is enough
- `Origin`
  - the starting origin/reference for the extrusion
  - should still be visible even if the local default is enough

Likely later inputs:
- `TwistAngle`
- `ExtrusionProfile`

Clean first-pass input read:
- primary input: `SketchProfile`
- early driver/config inputs:
  - `Distance`
  - `Direction`
  - `Origin`

#### First-Pass `Extrude` Output Types

`Extrude` should publish a body-like result instead of another sketch-like shape.

- `SolidBody`
  - the immediate geometry result of the extrusion
  - useful as the clean engine-facing output concept
- `Part`
  - likely the product-facing output concept later
  - useful when the extrude is already acting as a true build chunk in the content tree

Clean first-pass output read:
- primary output: `SolidBody`
- later product-facing/output-tree read:
  - `Part`

#### `Sketch Builder`

`Sketch` should likely stay as the graph/canvas composite node, while actual sketch drawing happens in a dedicated builder surface.

Clean read:
- `Sketch` lives on the Spaghetti canvas as the graph node
- the node should expose a button/action like `Edit Sketch` or `Open Builder`
- that action should open the `Sketch Builder`
- the builder likely belongs in the model viewport with a temporary sketch toolbar rather than inside the node body itself

Owned by the `Sketch` composite node:
- the editable sketch command stack
- the ordered sketch operation history
- the resulting sketch outputs:
  - `SketchCurves`
  - `SketchProfiles`
  - `SketchProfile`

Practical first-pass direction:
- let the user sketch with normal tools in the builder
- record the resulting ordered operations back into the `Sketch` composite
- keep the graph node as the owned record of that sketch instead of forcing the full drawing UX into the canvas node body

# Simple `Sketch` / `Extrude` / `Loft` Node Checklist

This is the simple first working checklist for the first foundational geometry nodes.

- # 1. `Data Types`

  - ## 1.1 Primitive value types
    - ### 1.1.1 [~] [Float]
    - ### 1.1.2 [~] [Boolean]
    - ### 1.1.3 [ ] [Enum]
  - ## 1.2 Vector / transform types
    - ### 1.2.1 [~] [Vec2]
    - ### 1.2.2 [~] [Vec3]
    - ### 1.2.3 [~] [Transform2D]
    - ### 1.2.4 [ ] [MirrorAxis]
  - ## 1.3 Spatial reference types
    - ### 1.3.1 [~] [Plane]
  - ## 1.4 Sketch geometry types
    - ### 1.4.1 [~] [SketchCurve]
    - ### 1.4.2 [~] [SketchCurves]
    - ### 1.4.3 [~] [SketchProfiles]
    - ### 1.4.4 [~] [SketchProfile]
    - ### 1.4.5 [ ] [SketchCurveRef]
  - ## 1.5 Solid / body types
    - ### 1.5.1 [~] [SolidBody]
  - ## 1.6 Composite wrapper types
    - ### 1.6.1 [~] [CompositeSketch]
    - ### 1.6.2 [~] [CompositeExtrude]
    - ### 1.6.3 [ ] [CompositeLoft]


- # 2. `[~]` - `Sketch`
  - ## 2.1 Inputs
    - ### 2.1.1 [~] in:SketchPlane - [Plane]
    - ### 2.1.2 [~] in:SketchPlace - [Transform2D]
    - ### 2.1.3 [~] in:SketchTranslate - [Vec2]
    - ### 2.1.4 [~] in:SketchRotate - [Float]
    - ### 2.1.5 [ ] in:SketchSplineRef - [SketchCurveRef]

  - ## 2.2 Outputs
    - ### 2.2.1 [~] out:SketchCurves - [SketchCurves]
    - ### 2.2.2 [~] out:SketchProfiles - [SketchProfiles]
    - ### 2.2.3 [~] out:SketchProfile - [SketchProfile]

  - ## 2.3 Primitive / source subnodes
    - ### 2.3.1 [~] - SketchNumber out:[Float]
    - ### 2.3.2 [~] - SketchBoolean out:[Boolean]
    - ### 2.3.3 [~] - SketchVec2 out:[Vec2]
    - ### 2.3.4 [ ] - SketchOffsetPlane out:[Float]

  - ## 2.4 Operation subnodes
    - ### 2.4.1 [~] - `SketchLine`
        - #### 2.4.1.1 [~] in:EndPoint - [Vec2]
        - #### 2.4.1.2 [~] out:LineCurve - [SketchCurve]

    - ### 2.4.2 [~] - `SketchArc3Point`
        - #### 2.4.2.1 [~] in:EndPoint - [Vec2]
        - #### 2.4.2.2 [~] in:MidPoint - [Vec2]
        - #### 2.4.2.3 [~] out:ArcCurve - [SketchCurve]

    - ### 2.4.3 [~] - `SketchBezierSpline`
        - #### 2.4.3.1 [~] in:EndPoint - [Vec2]
        - #### 2.4.3.2 [~] in:ControlPoints - [SketchCurves]
        - #### 2.4.3.3 [~] out:BezierCurve - [SketchCurve]

    - ### 2.4.4 [~] - `SketchCloseProfile`
        - #### 2.4.4.1 [~] in:SourceCurves - [SketchCurves]
        - #### 2.4.4.2 [~] out:ClosedProfiles - [SketchProfiles]

    - ### 2.4.5 [~] - `SketchProfileSelect`
        - #### 2.4.5.1 [~] in:SourceProfiles - [SketchProfiles]
        - #### 2.4.5.2 [~] in:ProfileIndex - [Float]
        - #### 2.4.5.3 [~] out:SelectedProfile - [SketchProfile]

    - ### 2.4.6 [ ] - `SketchMirror`
        - #### 2.4.6.1 [ ] in:SourceCurves - [SketchCurves]
        - #### 2.4.6.2 [ ] in:MirrorAxis - [MirrorAxis]
        - #### 2.4.6.3 [ ] out:MirroredCurves - [SketchCurves]

    - ### 2.4.7 [ ] - `SketchProject`
        - #### 2.4.7.1 [ ] in:SourceCurve - [SketchCurveRef]
        - #### 2.4.7.2 [ ] in:TargetPlane - [Plane]
        - #### 2.4.7.3 [ ] out:ProjectedCurve - [SketchCurve]

    - ### 2.4.8 [ ] - `SketchTrim`
        - #### 2.4.8.1 [ ] in:SourceCurve - [SketchCurve]
        - #### 2.4.8.2 [ ] in:TrimReference - [SketchCurveRef]
        - #### 2.4.8.3 [ ] out:TrimmedCurve - [SketchCurve]

    - ### 2.4.9 [ ] - `SketchOffset`
        - #### 2.4.9.1 [~] in:SourceCurve - [SketchCurve]
        - #### 2.4.9.2 [~] in:OffsetDistance - [Float]
        - #### 2.4.9.3 [ ] out:OffsetCurve - [SketchCurve]

- # 3. `[~]` - `Extrude`
  - ## 3.1 Inputs
    - ### 3.1.1 [~] in:ExtrudeType - [Enum]
  - ## 3.2 Basic mode required inputs
    - ### 3.2.1 [~] in:ExtrusionProfile - [SketchProfile]
    - ### 3.2.2 [~] in:Distance - [Float]
    - ### 3.2.3 [ ] in:Direction - [Vec3]
    - ### 3.2.4 [ ] in:Origin - [Vec3]
  - ## 3.3 Twist mode required inputs
    - ### 3.3.1 [~] in:ExtrusionProfile - [SketchProfile]
    - ### 3.3.2 [~] in:Distance - [Float]
    - ### 3.3.3 [~] in:Direction - [Vec3]
    - ### 3.3.4 [~] in:Origin - [Vec3]
    - ### 3.3.5 [~] in:TwistAngle - [Float]
  - ## 3.4 Outputs
    - ### 3.4.1 [~] out:SolidBody - [SolidBody]
    
- # 4. `[ ]` - `Loft`
  - ## 4.1 Inputs
    - ### 4.1.1 [ ] in:LoftType - [Enum]
  - ## 4.2 Basic mode required inputs
    - ### 4.2.1 [ ] in:StartProfile - [SketchProfile]
    - ### 4.2.2 [ ] in:EndProfile - [SketchProfile]
    - ### 4.2.3 [ ] in:IntermediateProfiles - [SketchProfiles]
    - ### 4.2.4 [ ] in:Closed - [Boolean]
    - ### 4.2.5 [ ] in:Ruled - [Boolean]
  - ## 4.3 RailGuided mode required inputs
    - ### 4.3.1 [ ] in:StartProfile - [SketchProfile]
    - ### 4.3.2 [ ] in:EndProfile - [SketchProfile]
    - ### 4.3.3 [ ] in:IntermediateProfiles - [SketchProfiles]
    - ### 4.3.4 [ ] in:Rails - [SketchCurves]
    - ### 4.3.5 [ ] in:Closed - [Boolean]
    - ### 4.3.6 [ ] in:Ruled - [Boolean]
  - ## 4.4 Outputs
    - ### 4.4.1 [ ] out:SolidBody - [SolidBody]

### First Four Phase Draft

This is a temporary phasing read for the first four top-level checklist blocks:
- `1. Data Types`
- `2. Sketch`
- `3. Extrude`
- `4. Loft`

#### Phase 1 - Foundational data types and sketch shell

Focus:
- lock the minimum type system
- stand up the first real `Sketch` node shell
- prove the basic graph/pin/type language

Primary checklist targets:
- `1.1 Primitive value types`
- `1.2 Vector / transform types`
- `1.3 Spatial reference types`
- `1.4 Sketch geometry types`
- `2.1 Inputs`
- `2.2 Outputs`
- `2.3 Primitive / source subnodes`

Rough done shape:
- graph can carry the first real `[Float]`, `[Boolean]`, `[Enum]`, `[Vec2]`, `[Vec3]`, `[Transform2D]`, `[Plane]`, and sketch-geometry types
- `Sketch` exists as a real node shell with input pins, output pins, and the first source/helper seams

#### Phase 2 - Sketch operation authoring

Focus:
- turn `Sketch` from a shell into a real sketch-authoring feature
- prove the editable sketch command stack / builder direction

Primary checklist targets:
- `2.4.1 SketchLine`
- `2.4.2 SketchArc3Point`
- `2.4.3 SketchBezierSpline`
- `2.4.4 SketchCloseProfile`
- `2.4.5 SketchProfileSelect`

Deferred inside this phase unless they become necessary:
- `2.4.6 SketchMirror`
- `2.4.7 SketchProject`
- `2.4.8 SketchTrim`
- `2.4.9 SketchOffset`

Rough done shape:
- a user can author and publish a usable sketch profile through the first real sketch command flow

#### Phase 3 - Extrude foundation

Focus:
- create the first body-producing solid feature from sketch output
- prove one mode-based solid node with one body result

Primary checklist targets:
- `3.1 Inputs`
- `3.2 Basic mode required inputs`
- `3.4 Outputs`

Deferred inside this phase unless needed:
- `3.3 Twist mode required inputs`

Rough done shape:
- `Sketch -> Extrude -> SolidBody` works as the first honest vertical slice

#### Phase 4 - Loft growth

Focus:
- add the next major profile-based body feature after extrusion
- prove a second mode-based solid feature

Primary checklist targets:
- `4.1 Inputs`
- `4.2 Basic mode required inputs`
- `4.4 Outputs`

Deferred inside this phase unless needed:
- `4.3 RailGuided mode required inputs`

Rough done shape:
- `Loft` exists as the next real body feature after `Extrude`
- the node system now supports both sketch-driven extrusion and sketch-driven lofting

- # 5. `[~]` - `Boolean`
  - ## 5.1 Inputs
    - ### 5.1.1 [~] in:BooleanType - [Enum]
  - ## 5.2 Union mode required inputs
    - ### 5.2.1 [~] in:TargetBody - [SolidBody]
    - ### 5.2.2 [~] in:ToolBody - [SolidBody]
  - ## 5.3 Cut mode required inputs
    - ### 5.3.1 [~] in:TargetBody - [SolidBody]
    - ### 5.3.2 [~] in:ToolBody - [SolidBody]
  - ## 5.4 Intersect mode required inputs
    - ### 5.4.1 [ ] in:TargetBody - [SolidBody]
    - ### 5.4.2 [ ] in:ToolBody - [SolidBody]
  - ## 5.5 Outputs
    - ### 5.5.1 [~] out:SolidBody - [SolidBody]

- # 6. `[~]` - `Fillet`
  - ## 6.1 Inputs
    - ### 6.1.1 [~] in:TargetBody - [SolidBody]
    - ### 6.1.2 [~] in:Radius - [Float]
    - ### 6.1.3 [ ] in:EdgeSelector - [Enum]
  - ## 6.2 Outputs
    - ### 6.2.1 [~] out:SolidBody - [SolidBody]

- # 7. `[~]` - `Shell`
  - ## 7.1 Inputs
    - ### 7.1.1 [~] in:TargetBody - [SolidBody]
    - ### 7.1.2 [~] in:Thickness - [Float]
    - ### 7.1.3 [ ] in:OpenFaceSelector - [Enum]
  - ## 7.2 Outputs
    - ### 7.2.1 [~] out:SolidBody - [SolidBody]

- # 8. `[~]` - `Sweep`
  - ## 8.1 Inputs
    - ### 8.1.1 [~] in:Profile - [SketchProfile]
    - ### 8.1.2 [~] in:Path - [SketchCurve]
    - ### 8.1.3 [ ] in:FrenetMode - [Boolean]
    - ### 8.1.4 [ ] in:TwistAngle - [Float]
  - ## 8.2 Outputs
    - ### 8.2.1 [~] out:SolidBody - [SolidBody]

- # 9. `[ ]` - `Mirror`
  - ## 9.1 Inputs
    - ### 9.1.1 [ ] in:TargetBody - [SolidBody]
    - ### 9.1.2 [ ] in:MirrorAxis - [MirrorAxis]
  - ## 9.2 Outputs
    - ### 9.2.1 [ ] out:SolidBody - [SolidBody]

- # 10. `[ ]` - `Array`
  - ## 10.1 Inputs
    - ### 10.1.1 [ ] in:ArrayType - [Enum]
    - ### 10.1.2 [ ] in:TargetBody - [SolidBody]
  - ## 10.2 Linear mode required inputs
    - ### 10.2.1 [ ] in:Count - [Float]
    - ### 10.2.2 [ ] in:Spacing - [Float]
    - ### 10.2.3 [ ] in:Direction - [Vec3]
  - ## 10.3 Circular mode required inputs
    - ### 10.3.1 [ ] in:Count - [Float]
    - ### 10.3.2 [ ] in:Angle - [Float]
    - ### 10.3.3 [ ] in:Axis - [MirrorAxis]
    - ### 10.3.4 [ ] in:Origin - [Vec3]
  - ## 10.4 Path mode required inputs
    - ### 10.4.1 [ ] in:Count - [Float]
    - ### 10.4.2 [ ] in:Path - [SketchCurve]
    - ### 10.4.3 [ ] in:AlignToPath - [Boolean]
  - ## 10.5 Outputs
    - ### 10.5.1 [ ] out:SolidBody - [SolidBody]

- # 11. `[ ]` - `TrimSplit`
  - ## 11.1 Inputs
    - ### 11.1.1 [ ] in:TrimType - [Enum]
    - ### 11.1.2 [ ] in:TargetBody - [SolidBody]
    - ### 11.1.3 [ ] in:TrimTool - [SolidBody]
  - ## 11.2 Outputs
    - ### 11.2.1 [ ] out:SolidBody - [SolidBody]

- # 12. `[ ]` - `Revolve`
  - ## 12.1 Inputs
    - ### 12.1.1 [ ] in:Profile - [SketchProfile]
    - ### 12.1.2 [ ] in:Angle - [Float]
    - ### 12.1.3 [ ] in:Axis - [MirrorAxis]
  - ## 12.2 Outputs
    - ### 12.2.1 [ ] out:SolidBody - [SolidBody]

#### Why The ParaHook Feature List Still Matters

The current ParaHook family already implies several feature concepts even before they become first-class nodes:
- anchor spline generation
- rail-driven shaping
- lofted toe/heel forms
- profile trim/control behavior

That is why the future-node list still includes both:
- generic Replicad-aligned feature ideas
- ParaHook-specific feature candidates that may later be generalized or absorbed into cleaner reusable operations
