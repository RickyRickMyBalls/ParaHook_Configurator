# 12 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - post-`3.2B` / `3.2C` node-template cleanup
  - stabilizing `Geometry/Sketch` and `Geometry/Extrude` before `Loft`
  - separating reusable node-template structure from older mixed `NodeView` residue
- Primary source docs for this planning pass:
  - `docs/Human-Plans/roadmap/roadmap.md`
  - `docs/Phase-Plans/Tasks/Future/03.2B - SP-NI-FS-GE - Sketch Operation Authoring.md`
  - `docs/Phase-Plans/Tasks/Future/03.2B-2 - SP-NI-FS-GE - Main Viewport Sketch Rendering And Toolbar Split.md`
  - `docs/Phase-Plans/Tasks/Future/03.2C - SP-NI-FS-GE - Extrude Foundation.md`
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.
- Entry status markers:
  - `[ ]` = still open / still driving active work
  - `[x]` = completed or superseded enough that it is no longer the active entry

## Doc Body

## Session 1 Notes

##### [ ] [209] 2026-03-26 12:55 - Break the new `Layers` family into four code-backed implementation phases

Context block:

- the umbrella `Layers` direction was locked, but it still needed an execution order
- a quick live code read shows the real seams already split naturally across:
  - `useAppStore`
  - `workspaceSelectionCommands`
  - `useBrowserPanelController`
  - `ConsoleDock`
  - `useSpaghettiStore`
  - `Viewer`
- that means the layer plan should not stay as one generic future note

Locked direction:

- use a four-phase `Layers` ladder:
  - `Layers-1`
    - canonical layer state, membership, current-layer truth, and shared visibility commands
  - `Layers-2`
    - `Layer Manager` plus Console command surface
  - `Layers-3`
    - sketch-entity layer ownership
  - `Layers-4`
    - authored 3D object layer ownership and visibility
- keep the transcript-layer filter toolbar separate from CAD/content layer commands
- keep sketch and authored 3D object integration as separate later phases because the live code already has different ownership seams for:
  - sketch-session state and overlay rendering
  - project-content records, Browser selection, and viewer object picks

Why this matters:

- it gives the new `Layers` family a real implementation ladder instead of one umbrella idea doc
- it keeps the first phase focused on shared state so later UI work does not fork layer ownership
- it matches the actual code boundaries closely enough to become future implementation-ready phase docs

##### [ ] [208] 2026-03-26 11:26 - Lock the first console-facing layer management commands around off, restore-all, and multi-layer isolate

Context block:

- the new `Layers` direction already locked a `Layer Manager` plus shared selection-based assignment
- the user also wants fast Console buttons/commands for managing layer visibility
- the desired actions are not generic visibility prose anymore; they are explicit management verbs

Locked direction:

- the first Console-facing layer commands should include:
  - `turn off layer`
  - `turn on all layers`
  - `isolate layers`
- `turn off layer` hides the chosen layer
- `turn on all layers` restores visibility for every layer
- `isolate layers` hides every non-selected layer and must support keeping multiple selected layers visible at once
- these Console commands should operate on the same underlying CAD/content layer state owned by the `Layer Manager`
- these commands are distinct from the existing Console transcript layer filter toolbar

Why this matters:

- AutoCAD-style layer work needs fast management actions, not only a passive list of visibility toggles
- multi-layer isolate is materially different from one-row solo visibility and should be locked explicitly now
- keeping the Console actions attached to the same underlying layer state prevents the manager and Console from drifting into two separate visibility systems

##### [ ] [207] 2026-03-26 11:16 - Expand the new `Layers` family around an AutoCAD-style layer manager and shared selection-based assignment

Context block:

- the new `docs/Human-Plans/Architecture/Layers/Layers.md` family existed only as a folder placeholder
- the user wants ParaHook layers to behave more like AutoCAD:
  - create layers
  - assign names and colors
  - toggle visibility
  - assign selected sketch lines and 3D objects to layers
- the repo already has active shared-selection work across Browser, viewport, and Console, so the layer direction should not invent a disconnected targeting model

Locked direction:

- `Layers` should mean CAD/content layers, not the separate Console transcript layers
- ParaHook should get one canonical `Layer Manager` surface
- the first manager should support:
  - create
  - rename
  - recolor
  - visibility toggle
  - current-layer selection
  - assign current selection to a layer
- layer assignment should reuse shared Browser/viewport/`Sketch Draw` selection truth instead of adding a layer-local selection model
- the first supported layer-assignment targets should be:
  - committed `Sketch Draw` entities
  - authored 3D content objects
- layer membership should persist as authored/content truth rather than as a viewer-only overlay

Why this matters:

- it gives one canonical architecture home to the AutoCAD-style layer expectation before phase docs are split out later
- it lets one layer model span both 2D sketch work and 3D authored object organization
- it keeps the future layer system aligned with the repo's existing shared selection and command-scope direction

##### [ ] [206] 2026-03-22 12:49 - Add one umbrella `Nodes` index and treat AutoCAD-style command growth as primarily a `Sketch` problem

Context block:

- the `Spaghetti-Editor-Arch/Nodes` folder had:
  - one real `Sketch` family
  - placeholder `Extrude` and `Loft` folders
  - no umbrella index that said what already exists versus what is still missing
- the next planning task is to inventory all the AutoCAD-like commands the product still needs

Locked direction:

- create `docs/Human-Plans/Architecture/Spaghetti-Editor-Arch/Nodes/Nodes-Index.md`
- use it as the umbrella inventory for:
  - current node-family coverage
  - current shipped sketch commands
  - missing AutoCAD-style command backlog
- treat the immediate AutoCAD-style command list as primarily a `Geometry/Sketch` backlog
- keep `Geometry/Extrude` and `Geometry/Loft` as separate downstream node-family docs that still need to be created

Why this matters:

- it avoids mixing sketch command planning into extrude/loft architecture by accident
- it gives one canonical place to answer:
  - what node families already exist here
  - what commands are already shipped
  - what commands still need to be added
- it makes the next obvious doc split clear:
  - `Extrude-Index.md`
  - `Loft-Index.md`

##### [ ] [205] 2026-03-22 12:40 - Lock the AppShell cleanup order around runtime-host first and window-controller second

Context block:

- a second direct read of `src/app/AppShell.tsx` was needed before planning the AppShell cleanup family any further
- the older AppShell index direction was still broadly right, but it needed a more exact seam read and roadmap-aligned naming before a standalone subphase doc would be trustworthy

Locked direction:

- keep `AppShell` as the real composition root
- treat the radio and sampler runtime cluster as the first extraction seam under `[5.0F-1]`
- treat browser floating/docking plus spaghetti window/split controller logic as the second seam under `[5.0F-2]`
- do not add extra roadmap subphases unless `[5.0F-2]` later proves too risky to land under one family slot
- use a new mounted `RadioRuntimeHost` seam as the first recommended landing zone

Why this matters:

- the file read showed the runtime cluster is already tightly grouped around one set of refs, effects, and the hidden SoundCloud bridge
- it also showed the render tree is still the correct top-level composition root, so the cleanup should remove leaked hosts and controllers without moving surface composition out of `AppShell`
- this gives the new standalone `5.0F-1` phase doc a real code-backed boundary instead of a vague "make AppShell smaller" goal

##### [ ] [204] 2026-03-22 12:32 - Place camera controls in the roadmap as a new `[5.0H]` bridge family

Context block:

- camera/input cleanup had an architecture note and an internal phase split, but no real roadmap home yet
- the work is broader than:
  - viewer-only controls
  - sketch-only cleanup
  - console-only camera commands

Locked direction:

- place camera controls under the pre-workspace bridge lane as:
  - `[5.0H] Camera Controls And View Input Ownership`
- use the following subphases:
  - `[5.0H-1]` Sketch Draw Camera Blocking
  - `[5.0H-2]` Fusion-Style Model Viewport Camera Baseline
  - `[5.0H-3]` Spaghetti Canvas And Model Viewport Coexistence
  - `[5.0H-4]` Camera Console Commands
  - `[5.0H-5]` Shared View Input Owner Model

Why this matters:

- it keeps the family attached to the same bridge zone that already handles pre-`[5.1]` shell/input cleanup
- it avoids misplacing camera/input work into only viewer, sketch, or console lanes
- it gives the new `Camera-Controls` folder a real roadmap family to index against

##### [ ] [203] 2026-03-22 12:16 - Break `Camera_Controls.md` into the fewest safe implementation phases

Context block:

- the camera-controls note was getting directionally complete, but it still needed an execution shape
- the right split should be small enough to ship safely, without turning one camera/input cleanup into an oversized mixed implementation

Locked direction:

- add a `## Phases` section to `Camera_Controls.md`
- use the fewest safe phases needed to separate:
  - `Sketch Draw` ownership blocking
  - Fusion-style model viewport gestures
  - graph-canvas plus model-viewport coexistence
  - camera console commands
  - the later shared input-owner model

Recommended phase split:

- `Phase 1`
  - stop camera interference with `Sketch Draw`
- `Phase 2`
  - land the Fusion-style model viewport gesture baseline
- `Phase 3`
  - preserve graph-canvas behavior and add optional `Ctrl` pass-through to the model viewport
- `Phase 4`
  - add `ZOOM` / `PAN` / `ORBIT` console commands
- `Phase 5`
  - unify everything under one shared viewport-input owner model

Why this matters:

- it keeps the first shipping target tight enough to unblock `DS-3` testing
- it prevents graph-canvas and model-camera cleanup from being mixed into one risky pass
- it gives later gizmo/view-toolbar work a real home without forcing it into the first camera fix

##### [ ] [202] 2026-03-22 12:16 - Add AutoCAD-style camera console suggestions to the new camera-controls note

Context block:

- camera gesture cleanup should not be mouse-only
- ParaHook will also want a small console surface for view navigation
- AutoCAD is a useful baseline here because the user already expects:
  - `z > a`
  - `z > o`

Locked direction:

- add the first suggested console family to `Camera_Controls.md`
- use:
  - `zoom`
  - `z`
  as the main command and alias
- first suggested sub-options:
  - `a` = `All`
  - `e` = `Extents`
  - `p` = `Previous`
  - `w` = `Window`
  - `o` = `Object`
- also suggest:
  - `pan`
  - `orbit`
- `Zoom Object` should support either:
  - preselect then commit
  - or command first then select

Why this matters:

- it keeps camera navigation consistent across mouse and console surfaces
- it gives the future console a real CAD-like view-navigation grammar
- it prevents camera commands from being bolted on later without an architecture note

##### [ ] [201] 2026-03-22 12:06 - Treat `v15Theme` Phase 2 as in-place cleanup of the landed manifest split, not a new decomposition lane

Context block:

- `[5.0G-1]` is now implemented
- `src/index.css` still imports `src/app/theme/v15Theme.css`
- `v15Theme.css` is now a manifest over:
  - `foundation/`
  - `shell/`
  - `surfaces/`
- the next real work is cleanup inside the split, not more theme-architecture branching

Locked direction:

- keep the phase count at `2`
- mark Phase 1 complete in `v15Theme.md`
- make Phase 2 implementation-ready around the live cleanup hotspots:
  - `src/app/theme/foundation/tokens.css`
  - `src/app/theme/foundation/base.css`
  - `src/app/theme/surfaces/viewport-overlay.css`
  - `src/app/theme/surfaces/spaghetti.css`
- do not add a Phase 3 just for naming or extra file decomposition
- default to cleaning within the current `9`-file split unless a later blocker proves otherwise

Why this matters:

- it keeps the theme plan aligned with the code that actually shipped
- it prevents phase creep right before workspace-mode work
- it gives the next pass concrete cleanup targets instead of vague `reduce overrides` wording

##### [ ] [200] 2026-03-22 11:53 - Add a dedicated camera-controls architecture surface to resolve viewport input ownership conflicts

Context block:

- `DS-3` entity selection exposed that orbit camera still owns too much of the plain viewport click/drag path
- that makes shipped `Sketch Draw` selection and later gizmo work feel like exceptions instead of first-class viewport owners
- the problem is broader than one sketch bug
- it is an input-ownership architecture issue between:
  - camera navigation
  - sketch draw/select
  - future gizmos
  - view-toolbar camera actions

Locked direction:

- add `docs/Human-Plans/Architecture/Camera_Controls.md`
- treat camera controls as fallback viewport navigation, not the default winner for plain `LMB`
- let active authoring interactions own plain `LMB` first
- use a Fusion-like baseline:
  - scroll up = zoom in toward the mouse position
  - scroll down = zoom out
  - `MMB` drag = pan
  - `Shift + MMB` drag = orbit
  - `MMB` double click = zoom fit
- keep view-toolbar camera commands explicit rather than letting them blur pointer ownership

Why this matters:

- it gives `Sketch Draw` box selection a real architectural home instead of a one-off workaround
- it gives later move/edit gizmos the same ownership model
- it reduces repeated viewer-input conflicts as more CAD-like tools land

Canvas follow-up:

- the `Spaghetti Editor` canvas should stay a separate 2D navigation surface, not a camera surface
- while the pointer is over the graph canvas:
  - scroll should zoom the canvas toward the mouse position
  - `MMB` drag should pan the canvas
  - plain `LMB` should stay with graph editing
- model-view camera controls should not steal those same gestures from the active graph canvas

##### [ ] [199] 2026-03-22 11:15 - Make `DS-3` implementation-ready as entity selection, explicitly separate from profile review

Context block:

- the crucial ambiguity in `DS-3` was not only `Selection Mode` versus idle state
- it was also the overloaded word `review`
- current code truth already uses:
  - `geometrySketchSession.mode === 'review'`
  for profile review, with profile cards and `setGeometrySketchSelectedProfile(...)`
- the new entity-selection phase must not collide with that existing meaning

Locked direction:

- `DS-3` owns committed entity selection only
- `DS-3` does not own:
  - closed-profile selection
  - profile review mode
- entity selection should extend:
  - `geometrySketchSession.mode === 'draw'`
  - `drawStage === 'sessionIdle'`
- first selection-set semantics are replace-only:
  - click entity = replace with one
  - click empty = clear
  - window/crossing drag = replace with matched set
  - entity-row click = replace with one
- delete should route against that selection set through sketch-draw command handling

Why this matters:

- it removes the biggest implementation ambiguity left in the phase
- it maps the phase onto the current store/viewer split cleanly
- it gives a concrete state shape and test matrix instead of only product wording

##### [ ] [198] 2026-03-22 11:03 - Correct `DS-3` so selection is the idle/review state, not a peer tool

Context block:

- the previous `DS-3` tightening over-corrected by turning selection into a first-class tool
- that conflicts with the desired AutoCAD-like flow after a draw commit:
  - commit `Line` point `B`
  - next viewport click should select
  - only `Enter` / `Previous` should re-arm the last draw command

Locked direction:

- do not model selection as a peer tool next to:
  - `Line`
  - `PLine`
  - `Rectangle`
  - `Circle`
- selection belongs to idle/review `Sketch Draw`
- after a draw-tool commit:
  - return to idle/review
  - viewport clicks select
  - window/crossing drag starts from empty-space click
- `Enter` or `Previous` should re-arm the last draw tool from that idle/review state

Why this is better:

- it matches the desired post-commit cadence exactly
- it keeps tool semantics clean
- it avoids forcing the user to manually switch into a higher-level review mode every time a draw command ends

##### [x] [197] 2026-03-22 10:58 - Tighten `DS-3 Selection And Delete` around a real `Selection Mode` tool plus `Window` / `Crossing`

Context block:

- the first `DS-3` refocus was cleaner than the old umbrella, but `q1` was still too narrow because the user explicitly wants AutoCAD-style window selection in this phase
- that means the phase cannot stay framed as single-select-only
- the better shape is one explicit selection tool with a real selection set and two box semantics

Locked direction:

- `Selection Mode` should become the first tool choice inside `Sketch Draw`
- first selection behaviors should include:
  - single click selection
  - blue `Window Selection`
    - entity must be fully enclosed
  - green `Crossing Selection`
    - entity only needs to intersect/touch/cross the box
- keep the current sketch drag-direction rule:
  - move `-X`
    - blue `Window`
  - move `+X`
    - green `Crossing`
- delete should now read against the current selection set, not only one selected entity id

Why this is better:

- it aligns the phase with the actual AutoCAD-like targeting model the user wants
- it makes selection explicit instead of turning idle draw state into an overloaded always-picking mode
- it gives the future runtime a cleaner state model:
  - active tool
  - hover candidate
  - selection set
  - selection-window draft

##### [ ] [196] 2026-03-22 10:43 - Re-focus `DS-3` into the first real `Selection And Delete` phase

Context block:

- `DrawSketch-3` had become stale after the temporary parent-bucket split that let:
  - `[3.2B-DrawSketch-4] Rectangle`
  - `[3.2B-DrawSketch-5] Circle`
  - `[3.2B-DrawSketch-6] Endpoint Snap`
  move forward as narrower follow-ons
- after `Rectangle` and `Circle` shipped, the old `Selection, Editing, And Richer Sketch Feedback` label was too broad and no longer described one implementable next step

Locked direction:

- re-focus `[3.2B-DrawSketch-3]` into:
  - `Selection And Delete`
- keep the `3` id for continuity instead of renumbering the family again
- make the first selection cut narrow:
  - single committed-entity selection only
  - viewport plus `Entities` row sync
  - direct delete of the current selection
- keep these out of scope for now:
  - grips
  - move/edit transforms
  - sub-entity handles
  - multi-select
  - box select

Why this is better:

- it turns `DS-3` back into a real executable phase instead of an index bucket
- it gives `Sketch Draw` its first honest review/destructive workflow after the draw-tool expansion
- it keeps later editing work from getting mixed into the first committed-entity targeting pass

##### [x] [195] 2026-03-22 08:35 - Ship `DS-4 Rectangle` as the next real `Sketch Draw` tool

Context block:

- the implementation-ready `DS-4` spec locked the right command contract:
  - `rec > Vec2 > Vec2`
- the codebase already had the core destination shape available:
  - `GeometrySketchTool` already knew:
    - `rectangle`
  - sketch components and profile derivation already supported first-class:
    - `rectangle`

Landed behavior:

- `Sketch Draw` now exposes:
  - `Rectangle`
  - `rec`
- `Rectangle` now behaves as a real two-point tool:
  - first corner
  - opposite corner
  - immediate commit
  - return to idle
- the viewer now ghosts the full closed rectangle after `P1`
- the viewport overlay and console status path now treat `Rectangle` like the other real draw tools
- empty `Enter` after `P1` accepts the hovered opposite corner

Important implementation note:

- one real bug surfaced during the console integration pass:
  - feature-assist activation could overwrite freshly typed user input with the late arriving assisted prefill
- the fix was not rectangle-specific only:
  - the console submit path now reads the latest store input at submit time
  - feature-assist descriptor activation now preserves existing user-owned input instead of blindly clobbering it

##### [ ] [194] 2026-03-22 08:06 - Tighten `DS-4 Rectangle` into an implementation-ready two-point command spec

Context block:

- `Rectangle` already had the right broad direction, but it was still missing the exact locked command contract needed to implement without more planning drift
- current code truth is favorable:
  - `GeometrySketchTool` already includes:
    - `rectangle`
  - the sketch feature/runtime already supports first-class committed rectangle components
- the actual runtime gap is narrower:
  - `runGeometrySketchDrawCommand(...)` still does not expose:
    - `rectangle`
    - `rec`
  - `GeometrySketchDrawHelper.ts` still only renders live draft/ghost behavior for:
    - `line`
    - `pline`

Locked direction:

- typed happy path is:
  - `rec > Vec2 > Vec2`
- first accepted point:
  - first corner
- second accepted point:
  - opposite corner
- second accepted point commits immediately and returns to idle `Sketch Draw`
- no extra post-`P2` finish step
- first cut stays axis-aligned in sketch space

Why this is good:

- it is the smallest useful AutoCAD-like rectangle primitive
- it reuses the existing first-class rectangle component shape instead of inventing a temporary four-line fallback
- it gives implementation a concrete contract for command routing, helper preview work, and acceptance tests

##### [ ] [193] 2026-03-22 07:58 - Rename the new draw-tool follow-ons from `3A / 3B / 3C` to numeric `DrawSketch-4 / 5 / 6`

Context block:

- the first split used temporary letter suffixes:
  - `[3.2B-DrawSketch-3A]`
  - `[3.2B-DrawSketch-3B]`
  - `[3.2B-DrawSketch-3C]`
- that reads less cleanly than the rest of the `DrawSketch-N` family

Locked direction:

- rename:
  - `[3.2B-DrawSketch-3A]` -> `[3.2B-DrawSketch-4]`
  - `[3.2B-DrawSketch-3B]` -> `[3.2B-DrawSketch-5]`
  - `[3.2B-DrawSketch-3C]` -> `[3.2B-DrawSketch-6]`
- keep the parent bucket as:
  - `[3.2B-DrawSketch-3]`
- keep the phase titles and intended scope unchanged

Why this is better:

- it matches the established numbered sketch phase family
- it keeps later follow-ons easier to scan and reference
- it avoids implying that the new docs are child fragments of `3` rather than the next sequence steps

##### [ ] [192] 2026-03-22 07:47 - Split post-`Line` / `PLine` sketch growth into narrow follow-ons for `Rectangle`, `Circle`, and endpoint snap

Context block:

- shipped `DrawSketch-2` now makes `Line` and `PLine` feel like real hybrid command sessions, so the next sketch growth should stop hiding inside one broad `DrawSketch-3` placeholder
- current code already has useful latent seams for the next steps:
  - `GeometrySketchTool` already includes:
    - `rectangle`
    - `circle`
  - sketch feature types and profile derivation already support first-class:
    - `rectangle`
    - `circle`
  - `GeometrySketchDrawHelper` already has an origin snap path plus a visible snap marker
- the missing work is mainly command wiring, live preview behavior, and endpoint candidate sourcing

Locked direction:

- split the post-`Line` / `PLine` bucket into:
  - `[3.2B-DrawSketch-3A] Rectangle Tool And Corner Workflow`
  - `[3.2B-DrawSketch-3B] Circle Tool And Center-Radius Workflow`
  - `[3.2B-DrawSketch-3C] Endpoint Snap`
- `Rectangle` should use the local alias:
  - `rec`
- `Circle` should use the local alias:
  - `cc`
- endpoint snap should extend the current origin snap instead of arriving as a separate snap-mode rewrite

Why this order is good:

- it adds two immediately useful AutoCAD-like primitive tools before drifting into broad editing work
- it reuses the existing first-class sketch component types instead of forcing a new schema decision
- it keeps the first object-snap growth narrow and measurable before broader inference/constraint systems

##### [ ] [191] 2026-03-20 17:24 - Radio sampler toolbar idea: keep the sequencer inside the shared `Radio` toolbar as a collapsible tree with global controls, track lanes, and expandable step detail

Context block:

- keep the future sampler UI inside the shared `Radio` toolbar rather than splitting it into a separate unrelated panel
- use the app's existing `collapsed / essentials / expanded` pattern for sampler rows and child rows
- keep `Radio` and `Sampler` as sibling top-level sections inside the toolbar

Proposed toolbar tree:

- `Radio`
  - `URL`
- `Sampler`
  - `Global BPM`
  - `Note Repeat`
    - `Enabled`
    - later repeat options like count/rate
  - lane strip / track row
    - `Track 1`
    - `Track 2`
    - `Add New Track`
  - inside each track:
    - `Steps ParaSlider`
    - `Step 1`
      - cue time from the lane URL/source
      - volume
      - later step-level overrides
    - `Step 2`
    - `Step 3`
    - and so on

Decision direction:

- `Global BPM` should stay sampler-global, not duplicated per track
- `Note Repeat` should begin as a sampler-global default block and only later grow per-track or per-step overrides if needed
- tracks should read as horizontally selectable lanes, but their detail can still expand vertically through the same tree/disclosure system
- steps should stay lightweight in `collapsed` and `essentials`, then reveal cue/volume/override controls only in `expanded`

Why this shape is good:

- it matches the app's existing disclosure system instead of inventing a special sampler-only panel pattern
- it keeps radio source controls and sampler controls in one coherent toolbar
- it supports growth from one track to multiple tracks without losing the simple top-down mental model
- it avoids showing every per-step control at once when the sequence gets long

Important implementation read:

- the first honest sampler can still start with one track
- this note mainly locks the future toolbar/container shape so later multi-track growth does not force a full UI rethink
- use `steps`, `tracks`, and `lanes` carefully in code/docs so the UI can stay friendly without making the state model vague

##### [ ] [190] 2026-03-18 19:09 - Upgrade `Pick In Viewport` and the floating sketch-plane picker so they match the new `SketchPlane > Source` model

###### `190 Phase 1 - Source Framing And Picker Cleanup`

Current state:

- `SketchPlane` now has a real `Source` section in the managed input row
- but the existing viewport-plane picker flow is still the older temporary path:
  - button text: `Pick In Viewport`
  - floating picker only offers:
    - `XY`
    - `XZ`
    - `YZ`
  - hint text still says:
    - pick one of the origin planes
    - face-pick arrives later

Problem:

- the row surface has moved forward into a real authored `Source` concept
- the viewport picker still behaves like an older stopgap plane-picker overlay
- the button and popup should now read as part of the same `Source` authoring system

Goal:

- upgrade the current `Pick In Viewport` action and floating picker into the next clear v1 `Source` tool
- keep it simple enough for now, but make the naming and structure consistent with the new `SketchPlane` model

V1 direction:

- rename the action away from generic `Pick In Viewport`
- make the picker read like a `Source` chooser, not a legacy plane helper
- keep origin-plane selection supported
- prepare the structure for face-pick even if full face-reference persistence is not shipped in the same pass

Recommended surface shape:

```text
SketchPlane
└─ Source
   ├─ Origin Plane
   │  ├─ ParaSelect in-row
   │  └─ optional viewport-assisted origin-plane chooser
   └─ Face Pick
      ├─ launch viewport source-pick mode
      └─ selected face summary when available
```

Phase-1 work:

1. rename the button/action text to something source-oriented
   - candidates:
     - `Pick Source`
     - `Choose Source`
     - `Pick Face`
2. update the floating picker title / hint copy so it is clearly part of `SketchPlane > Source`
3. keep `XY / XZ / YZ` support working
4. stop presenting the popup as if it is the final sketch-plane picker design
5. leave deeper face-pick persistence and richer source summaries for follow-on work

###### `190 Phase 2 - Viewport-First Pick Mode`

Viewport-first UX:

1. when viewport source-pick begins, the spaghetti editor should collapse/minimize enough that the model viewport becomes the clear primary workspace
2. while source-pick is active, show a live plane preview in the viewport so the user can see what plane/face they are about to choose

Recommended acceptance criteria for `6A`:

- the current node/editor surface competes with the viewport during source picking
- source picking is fundamentally a viewport task, not a dense panel-reading task
- without a visible preview plane, the interaction stays abstract and lower-confidence than Fusion-style sketch-plane picking

Pick-mode behavior:

- entering source-pick mode should push the spaghetti editor toward a compact / collapsed state
- the picker flow should visually privilege:
  - model viewport
  - plane/face hover feedback
  - current source target preview
- the user should be able to clearly see:
  - origin-plane previews
  - hovered planar face previews
  - the currently selected source candidate before commit

Preview recommendation:

- for origin-plane picks:
  - show translucent plane previews aligned to `XY / XZ / YZ`
- for face picks:
  - show a highlighted planar face preview
  - and, if needed, a ghosted sketch-plane overlay aligned to that face
- the preview should read as:
  - temporary candidate while hovering
  - committed source once selected

Session-state guidance:

- the editor-collapse behavior should be treated as part of source-pick session state
- not as an unrelated manual window-resize requirement
- source-pick mode should intentionally shift the user into a viewport-first temporary state

###### `190 Phase 3 - Live Source Preview`

Naming direction:

- if the popup still only chooses origin planes:
  - title should say something like:
    - `Sketch Source`
    - or `Sketch Plane Source`
- if the action specifically means face picking:
  - label it explicitly as:
    - `Pick Face`
- avoid a vague label if the action semantics are actually narrow

###### `190 Phase 4 - Face-Pick Product Decision`

Open product choice:

- should the viewport action in v1 be:
  - an alternate way to choose `XY / XZ / YZ`
  - or the dedicated start of face-pick mode
- if it stays origin-plane-only for one more pass:
  - the naming should admit that honestly

###### `190 Phase 5 - Source Summary Follow-Through`

Implementation order:

1. clean up the wording and popup framing
2. make the popup clearly belong to `Source`
3. make source-pick mode collapse/minimize the spaghetti editor enough to favor the viewport
4. add live origin-plane / face preview behavior in the viewport
5. decide whether v1 viewport interaction remains origin-plane-only or begins true face-pick mode
6. only then wire richer source summary behavior into the `SketchPlane` top row

###### `190 Phase 6A - Browser Structure And Sketch Exposure`

Intent:

- make `Sketches` a real `Content` family beside `References` and `Assembly`
- give sketches a browser presence before the full source-pick system is finished
- add the first honest sketch visibility/exposure path

Implementation-ready `6A` direction:

- `Sketches` is the lifted family, not `SketchPlane`
- each sketch row should be a compact authored-content row
- initial row content should include:
  - sketch label/name
  - current source summary like `XY` / `XZ` / `YZ`
  - exposed/not exposed state
- browser should support low-risk actions only:
  - reveal/jump to sketch node
  - toggle expose on/off
- do not require source-pick relaunch from browser in `6A`

Recommended browser family structure:

```text
Content
├─ References
├─ Assembly
└─ Sketches
```

Recommended structure details:

- `Sketches` should sit inline with `Assembly`, not buried only under graph-node internals
- this only makes sense if sketches are treated as a real authored content family
- each sketch item can then own its own child rows such as:
  - `Source`
  - `Curves`
  - `Profiles`
  - later `Export`

Why `6A` is the cleaner direction:

- `Assembly` is built 3D content
- `Sketches` is authored 2D/vector content
- `References` is imported source material
- all three read like honest project-level content families

Important boundary:

- do not lift `SketchPlane` itself to the same level as `Assembly`
- lift `Sketches` as the family
- keep `SketchPlane` / `Source` as child authored state inside each sketch

Recommended low-risk browser behaviors:

- browser shows the current sketch source in a compact readable way
  - examples:
    - `XY`
    - `XZ`
    - `picked face`
- browser can reveal or jump back to the sketch node without forcing the user to hunt for it manually
- browser makes exposed/not-exposed state readable without depending on active pick-session plumbing

Recommended exposure feature:

- add an `eyeball` / visibility-style action to the sketch node so the user can explicitly expose a sketch to `Content / Browser / toolbar` preview flows
- this matters because a sketch may be actively authored and worth previewing in the viewport even when it is not yet plugged into a downstream output like `Extrude`

Recommended exposure behavior:

- each sketch can be toggled between:
  - not exposed
  - exposed for content/browser preview
- exposed sketches should be available to preview in the model viewport without requiring a downstream solid-producing node
- the eyeball should behave like an intentional authoring visibility toggle, not like permanent published geometry

Browser tie-in for `6A`:

- exposed sketches should appear under the future `Content > Sketches` family
- browser/tool surfaces should make it clear which sketches are currently exposed to viewport preview
- turning the eyeball off should remove that sketch from the preview/content-facing surface without deleting the sketch itself

Why this is useful:

- users often need to inspect or compare sketch curves before they are consumed by another node
- it gives the sketch a truthful temporary visibility path during authoring
- it reduces the need to create fake downstream nodes just to see sketch content in the viewer

Recommended acceptance criteria for `6A`:

- browser shows `Sketches` inline with `References` and `Assembly`
- each sketch row shows a readable source summary
- user can toggle sketch exposure with an eyeball-style action
- exposed sketch appears in viewport preview without requiring a downstream output node
- removing exposure hides preview without deleting sketch or changing assembly content

###### `190 Phase 6B - Deeper Browser Integration`

Intent:

- make browser rows participate in live sketch-source workflow after picker/session behavior is stable

Prepared `6B` direction:

- browser reflects active source-pick session state
- browser can relaunch source-pick
- browser shows whether a sketch is:
  - idle
  - exposed
  - currently picking source
  - previewed in viewport
- browser may reveal deeper child rows under each sketch:
  - `Source`
  - `Curves`
  - `Profiles`
  - later `Export`
- browser may eventually surface source-pick status like:
  - current source mode
  - active candidate
  - committed source

Boundaries for `6B`:

- do not implement before source-pick session state is stable
- do not invent browser-owned picker logic separate from the canonical picker/session system
- browser should read and trigger the source system, not become a second authority

Recommended acceptance criteria for `6B`:

- browser can relaunch source-pick for a sketch
- browser visibly reflects active source-pick state
- browser and viewport preview state stay consistent
- sketch child rows can expand into richer authored-state surfaces without conflicting with node-level controls

What this entry should accomplish:

- prevent the new `SketchPlane` v1 row from carrying a stale picker path beside it
- make the viewport plane/source tool the next consistent follow-on after `[189]`

##### [ ] [189] 2026-03-18 19:00 - Implementation-ready `SketchPlane` v1 plan

Implementation target:

- upgrade the current managed `SketchPlane` input row from a thin plane-port presentation into a first real sketch-plane authoring surface
- keep the v1 model simple enough to ship now while leaving clear room for richer plane/orientation work later

Terminology lock:

- `Geometry/Sketch` = node
- `SketchPlane` = input-port / parameter name
- future richer underlying value = likely composite object
- do **not** treat `SketchPlane` itself as the type name

Implementation-ready v1 shape:

```text
Geometry/Sketch
└─ Inputs
   └─ SketchPlane
      ├─ Top Row
      │  ├─ input pin
      │  ├─ row chevron
      │  ├─ label: SketchPlane
      │  └─ source summary value
      └─ Body
         ├─ Source
         └─ Transform
```

Top-row rules:

- top row always remains visible
- top row continues to own:
  - input pin
  - row chevron
  - `SketchPlane` label
  - resolved/current source summary
- summary should read like:
  - `XY`
  - `XZ`
  - `YZ`
  - or later a face-picked summary

V1 row-mode behavior:

- `collapsed`
  - show top row only
- `essentials`
  - show top row
  - show compact `Source`
  - show compact `Transform`
- `expanded`
  - show top row
  - show full `Source`
  - show full `Transform`

V1 control groups:

1. `Source`
2. `Transform`

`Source` v1:

- purpose:
  - define what plane the sketch starts on
- supported source modes in v1:
  - origin plane
  - face pick placeholder/path if the face-pick system is ready enough
- control choice:
  - use `ParaSelect` for origin plane selection
- initial origin-plane options:
  - `XY`
  - `XZ`
  - `YZ`

`Transform` v1:

- purpose:
  - adjust the selected sketch plane after source selection
- control choice:
  - use shared `ParaSlider` rows for authored numeric values
- essentials priority:
  - `Offset`
  - simple `Rotation`
- expanded priority:
  - `Offset`
  - `Translation`
  - `Rotation`
  - `In-Plane Rotation`

Recommended control-template rules:

- use `ParaSelect` for discrete plane/source choices
- use `ParaSlider` for numeric authored values
- do not introduce custom sketch-plane-only slider widgets in v1
- do not fall back to raw number boxes unless there is no shared-control alternative

Recommended v1 UI hierarchy:

```text
SketchPlane
├─ Top Row
│  └─ summary only
└─ Body
   ├─ Source
   │  ├─ mode / source summary
   │  └─ Origin Plane
   │     └─ ParaSelect
   └─ Transform
      ├─ essentials
      │  ├─ Offset
      │  │  └─ ParaSlider
      │  └─ Rotation
      │     └─ ParaSlider
      └─ expanded
         ├─ Offset
         │  └─ ParaSlider
         ├─ Translation
         │  ├─ X -> ParaSlider
         │  ├─ Y -> ParaSlider
         │  └─ Z -> ParaSlider
         ├─ Rotation
         │  ├─ X -> ParaSlider
         │  ├─ Y -> ParaSlider
         │  └─ Z -> ParaSlider
         └─ In-Plane Rotation
            └─ ParaSlider
```

Schema/model guidance for implementation:

- current repo still stores only a narrow local plane enum
- UI can be upgraded first
- but the likely long-term direction is:
  - keep `SketchPlane` as the parameter name
  - evolve the underlying value toward a richer composite object
- if implementation starts with UI-first staging, avoid baking in assumptions that prevent that richer composite move later

What v1 intentionally leaves out:

- direct authored plane-basis vectors like:
  - `xDir`
  - `normal`
- raw plane-math editing UI
- advanced construction-plane modes:
  - 3-point plane
  - edge-based plane
  - point-and-normal plane
- full stable face-reference persistence if the face-id system is not ready
- exposing transform as a separate sibling graph input
- trying to mirror the full `replicad` plane object in the first shipped UI

What must stay true during implementation:

- `SketchPlane` remains one parent managed input row
- `Source` and `Transform` live inside that row body
- the top row does not morph into a different control family
- shared control language stays consistent with the spaghetti `i` menu and existing transform surfaces

Practical implementation order:

1. Replace the temporary generic expanded-details presentation with real grouped `Source` / `Transform` sections.
2. Introduce `ParaSelect` for `XY / XZ / YZ` inside `Source`.
3. Introduce `ParaSlider` rows for the first `Transform` values.
4. Map `collapsed / essentials / expanded` to the agreed control depth.
5. Defer richer schema migration and face-pick persistence details to follow-on passes.

##### [ ] [188] 2026-03-18 18:58 - Future `SketchPlane` authored controls should reuse the shared `ParaSlider` control template language from the spaghetti `i` menu

Control-template decision:

- all future authored numeric controls inside the richer `SketchPlane` surface should reuse the shared `ParaSlider` template language already established elsewhere in the app

Why this should be the default:

- the shared `ParaSlider` surface is already the repo's strongest numeric-control pattern
- it already carries the interaction model we want:
  - scrub / drag
  - direct value entry
  - left / right cap stepping
  - visual fill / marker feedback
- it is already used successfully in:
  - spaghetti `i` menu
  - sketch overlay draft controls
  - console tools menu
  - reference transform toolbar

What this means for `SketchPlane`:

- if `Source` or `Transform` needs authored numeric values:
  - offset
  - translation
  - rotation
  - in-plane rotation
- those should default to the same `ParaSlider` row template instead of one-off number boxes or sketch-specific slider variants

Good v1 consistency rule:

- use existing shared controls wherever possible:
  - `ParaSlider` for numeric authored values
  - existing pick/select patterns for source-plane and face-pick actions
- avoid inventing a new custom control family just for `SketchPlane`

Important boundary:

- this note is about **authored controls**
- not every visible summary/value in the collapsed top row must literally be a `ParaSlider`
- the top row can stay a compact managed-port summary row
- the nested editable controls in `essentials` / `expanded` should be the parts that inherit the `ParaSlider` language

Recommended control split:

- `collapsed`
  - no embedded slider rows
  - summary only
- `essentials`
  - compact `ParaSlider` rows for the few controls that matter most
- `expanded`
  - full grouped `ParaSlider`-based authoring surface

Why this matters:

- it keeps the spaghetti editor visually coherent
- it reduces control-learning cost for users
- it reduces implementation drift and one-off styling debt
- it increases the chance that future transform tooling can share behavior with the existing reference-transform surface

##### [ ] [187] 2026-03-18 18:56 - `SketchPlane` v1 should collapse the authored setup into just `Source` and `Transform`

`SketchPlane` v1 recommendation:

- simplify the future richer sketch-plane surface into just **2 user-facing controls**
- this keeps the first real upgrade understandable while still matching the underlying `replicad` direction well enough

Recommended v1 control groups:

1. `Source`
2. `Transform`

Meaning of each group:

- `Source`
  - user selects one of the origin planes
  - or user picks a face from an object in the main viewport
  - this defines the starting sketch plane and initial orientation
- `Transform`
  - user adjusts that selected source plane after placement
  - this is the controlled place for offset / move / rotate behavior

Recommended v1 data framing:

```text
SketchPlane
├─ Source
│  ├─ origin plane
│  └─ face pick
└─ Transform
   ├─ offset
   ├─ translation
   ├─ rotation
   └─ in-plane rotation
```

Recommended row-mode split:

- `collapsed`
  - top row only
  - show concise source summary
  - examples:
    - `XY`
    - `Top Face`
    - `Cube: face 3`
- `essentials`
  - show:
    - `Source`
    - compact `Transform`
  - prioritize:
    - origin-plane / face selection summary
    - offset
    - simple rotation
- `expanded`
  - full `Source` details
  - full `Transform` details
  - this is the long-form authored sketch-plane surface

Why this is the right v1 simplification:

- users think first:
  - what am I sketching on
- then second:
  - how do I adjust it
- this matches the way Fusion-style sketch-plane setup is usually understood
- it also avoids exposing raw low-level plane math too early in the row UI

Important modeling guidance:

- keep `SketchPlane` as the parameter / row name
- keep the richer authoring surface nested under that one input row
- do not split this into multiple sibling graph inputs in v1

What v1 should intentionally leave out:

- arbitrary full axis-vector editing:
  - direct authored `xDir`
  - direct authored `normal`
- raw plane-basis editing UI
- complex face-reference persistence rules if stable face identity is not solved yet
- full freeform transform authoring if the simpler offset / rotate path is enough to start
- advanced derived source modes:
  - edge-based planes
  - point-and-normal setup
  - 3-point construction planes
- separate explicit transform graph pin exposure
- multi-surface / associative plane-history tools

What will still need to be added later:

- robust face-reference model for viewport-picked faces
- stable recompute behavior when the source face changes or disappears
- decision on whether `offset` remains its own field or folds into transform/origin semantics
- decision on whether full translation should be user-facing early or mostly hidden behind plane-specific controls
- richer expanded controls for:
  - plane orientation
  - in-plane axis rotation
  - custom plane basis editing if ever needed
- eventual schema move from primitive plane enum toward a richer composite `sketchPlane`-style value
- clear compiler/runtime mapping from local authored `SketchPlane` data into the actual plane object used by geometry generation

Practical v1 rule:

- keep the first shipped version conceptually simple:
  - `pick source`
  - `adjust transform`
- leave lower-level plane-construction flexibility for later once the basic sketch workflow is proven

##### [ ] [186] 2026-03-18 18:48 - Verified `replicad` plane model is richer than the current local `SketchPlane` enum and should inform the next structure pass

Verified current state:

- this repo does **not currently install `replicad`**
- the local sketch-plane model is still app-owned and narrow:
  - `SketchPlane` parameter currently carries only:
    - `XY`
    - `YZ`
    - `XZ`
- that limit is enforced in:
  - feature types
  - feature schema
  - compiler plane reads
  - viewport plane picker

Verified `replicad` direction:

- `replicad` plane naming is richer than the current local enum
- supported named planes include:
  - `XY`
  - `YZ`
  - `ZX`
  - `XZ`
  - `YX`
  - `ZY`
  - `front`
  - `back`
  - `left`
  - `right`
  - `top`
  - `bottom`
- `replicad` also supports working from a real `Plane` object instead of only named planes

Important `replicad` plane facts:

- a real `Plane` carries:
  - `origin`
  - `xDir`
  - `yDir`
  - `zDir`
- constructor shape is conceptually:
  - `Plane(origin, xDirection, normal)`
- this means orientation is not just a picked plane name
- it is a full frame:
  - origin position
  - normal direction
  - in-plane x-axis direction
  - derived in-plane y-axis direction

Verified orientation/edit options in `replicad`:

- choose a named plane
- offset along its normal
- translate the plane in world space
- pivot the plane around an axis
- rotate the 2D sketch axes within the plane

Why this matters for `SketchPlane`:

- the current local model:
  - `SketchPlane` parameter name
  - primitive `plane` type
  - value of `XY | YZ | XZ`
- is too thin if the product goal is:
  - full transform controls
  - richer authored orientation
  - eventual non-origin or rotated sketch planes

Practical structure implication:

- the current UI upgrade path is heading toward a richer authored object already
- the schema should likely follow that direction instead of pretending the row still only authors a primitive plane enum

Current recommendation after verification:

- keep:
  - `SketchPlane` as the parameter / input-port name
- evolve:
  - the underlying value into a richer composite object
- likely future fields should cover at least:
  - base plane selection
  - origin / position
  - orientation
  - offset if it remains distinct

Good implementation framing:

- `collapsed`:
  - top row only
  - current plane identity summary
- `essentials`:
  - plane selection plus compact offset / orientation controls
- `expanded`:
  - full embedded sketch-plane authoring surface

Main unresolved modeling question:

- should `offset` remain a first-class field
- or should it collapse into the richer transform/origin/orientation model

##### [ ] [185] 2026-03-18 18:42 - `SketchPlane` should likely stay the parameter name while its underlying type evolves into a richer composite object

Structure update:

- `SketchPlane` should likely **not** become the type name
- `SketchPlane` should likely stay the **parameter / input-port name**
- the underlying value carried by that parameter should likely evolve from simple `plane` into a richer composite type

Why this is the cleaner direction:

- today the naming split is:
  - `SketchPlane` = parameter name
  - `plane` = type
  - `XY` / `XZ` / `YZ` = value
- if the parameter now needs to carry:
  - plane
  - transform
  - offset
- then the simple primitive `plane` type is no longer a complete match for what the row is authoring

Recommended direction:

- keep:
  - parameter name: `SketchPlane`
- introduce:
  - a richer underlying type for the value itself

Likely type-shape candidates:

- `sketchPlane`
- `planeTransform`
- `sketchPlaneSetup`

Current recommendation:

- prefer a domain-specific type like `sketchPlane`
- because this is not just “any transform”
- it is specifically the authored setup object for a sketch plane in this modeling system

Likely structure:

```text
SketchPlane: sketchPlane
├─ plane
├─ transform
│  ├─ translate
│  ├─ rotate
│  └─ scale? 
└─ offset
```

Important unresolved model question:

- is `offset` truly separate from `transform.translate`
- or is it only a friendlier plane-specific expression of one translation axis

Decision rule:

- if `offset` is just one constrained transform concept:
  - fold it into the transform model
- if `offset` is a first-class sketch-plane authoring concept:
  - keep it separate in the composite type

Why not overload `plane` itself:

- `plane` should remain a simple primitive where possible
- overloading `plane` to suddenly carry transform and offset would blur:
  - primitive type meaning
  - authored setup object meaning

Why not create a separate sibling input port:

- that would split one authored concept across multiple graph inputs
- the UI direction already points the other way:
  - one parent `SketchPlane` row
  - nested internal transform surface

Schema-direction recommendation:

- future implementation should likely move toward:
  - `SketchPlane` parameter name
  - `sketchPlane` composite type
- rather than:
  - `SketchPlane` parameter name with primitive `plane` forever
  - or a fake sibling `Transform` input port

Practical implementation warning:

- the UI can evolve first
- but if the product direction is serious about full transform controls, the schema should eventually match the authored object
- otherwise the row UI will keep carrying richer meaning than the graph model beneath it

##### [ ] [184] 2026-03-18 18:37 - `SketchPlane` should become a parent managed input row that owns a nested `Transform` child row

Yes, this structure makes sense.

Correct framing:

- `SketchPlane` stays the **parent managed input row**
- `Transform` becomes a **nested child row inside `SketchPlane`**
- `Transform` should **not** become a sibling top-level input row in the main `Inputs` rail
- reason:
  - the transform state belongs to the sketch plane setup surface
  - it does not describe a separate external graph input

Recommended hierarchy:

```text
Geometry/Sketch
└─ Inputs
   └─ SketchPlane (parent managed input row)
      ├─ Header / top row
      │  ├─ pin
      │  ├─ chevron
      │  ├─ label: SketchPlane
      │  └─ resolved value: XY / XZ / YZ
      └─ Body (visible only when parent is not collapsed)
         ├─ Transform (nested managed child row)
         └─ later optional child rows:
            ├─ Plane
            ├─ Source
            └─ Status
```

Locked row-mode behavior for the parent `SketchPlane` row:

- `collapsed`
  - show only the top row
  - no nested child rows visible

- `essentials`
  - show the top row
  - show the nested `Transform` child row
  - keep `Transform` in a compact summary / quick-edit shape

- `expanded`
  - show the top row
  - show the nested `Transform` child row
  - allow `Transform` to open into the full transform surface
  - later child rows such as `Plane`, `Source`, or `Status` can also appear here if they are still useful

Important design rule:

- the parent row mode and the child row mode are **not** the same thing
- recommended split:
  - parent `SketchPlane` row mode decides whether the body exists at all
  - nested `Transform` row mode decides how much of the transform surface is visible inside that body

Recommended first-pass child behavior:

- parent `SketchPlane`
  - `collapsed` -> body hidden
  - `essentials` -> body visible
  - `expanded` -> body visible

- child `Transform`
  - when parent is `essentials`
    - child defaults to compact summary / quick-edit mode
  - when parent is `expanded`
    - child defaults to full expanded transform editor

Why this is better than flattening:

- it preserves the graph truth:
  - one input port
  - one input row
  - one embedded transform surface
- it prevents the `Inputs` rail from turning into:
  - `SketchPlane`
  - `Transform`
  - `Plane`
  - `Status`
  which would read like multiple separate ports even though they belong to one plane-control surface

UI recommendation:

- top row should remain stable in all modes
- nested `Transform` row should visually read like an internal subsection of `SketchPlane`, not like another peer port in the rail
- this likely means:
  - slightly inset child row
  - no second external pin
  - same family styling, but subordinate hierarchy

Implementation consequence:

- do not treat `Transform` as a new graph port id
- treat it as UI-owned nested structure under the managed `SketchPlane` input row
- the store/schema work should add transform data to the sketch-plane model, not create a fake second input port just to host the controls

##### [ ] [183] 2026-03-18 18:31 - Full transform controls for the managed `SketchPlane` input row need their own row-mode contract before implementation

Current direction:

- the managed `SketchPlane` input row is no longer heading toward a simple debug/details surface
- the row is heading toward a real sketch-plane setup surface
- if full transform controls are going to live inside it, the row modes must decide **how much** of that transform surface is visible in:
  - `collapsed`
  - `essentials`
  - `expanded`

Important current-code truth:

- the repo already has a mature transform-control language in:
  - `src/app/components/ReferenceTransformToolbar.tsx`
- that surface already defines a useful mental model:
  - `Move`
  - `Rotate`
  - `Scale`
  - grouped axis rows
  - section-level collapse/expand behavior
- the managed `SketchPlane` input row already has its own row-mode contract:
  - `collapsed`
  - `essentials`
  - `expanded`
- so this future work is not just “put transform controls inside”
- it is “embed a transform surface inside a row-mode surface without losing readability”

Product rule:

- do **not** paste the full floating `ReferenceTransformToolbar` directly into the row
- the managed `SketchPlane` input row should reuse the same conceptual transform language
- but it needs its **own embedded presentation contract**

Correct framing for future discussion:

- this is not “add transform controls to an input node”
- this is:
  - upgrade the managed `SketchPlane` **input row**
  - so its expanded body can host an embedded sketch-plane **transform surface**

Recommended transform-surface groups:

- `Plane`
  - current resolved plane
  - local vs wired source
  - plane pick / repick action
- `Move`
  - X / Y / Z translation rows
- `Rotate`
  - X / Y / Z rotation rows
- `Scale`
  - X / Y / Z scale rows if scale is truly allowed for the sketch plane model
- `Offset`
  - keep only if the underlying model ends up with a real offset concept distinct from raw translation

Critical design question:

- is `Offset` actually a separate concept from `Move` for sketch-plane setup?
- if not, future UI should avoid duplicating both
- if yes, then:
  - `Offset` should stay as a distinct named group
  - `Move` should represent full transform translation while `Offset` represents plane-relative placement semantics

Recommended row-mode contract:

- `collapsed`
  - show only:
    - input-row title
    - resolved plane value
    - minimal transform summary
  - possible summary shape:
    - `XY`
    - `T 0,0,0`
    - `R 0,0,0`
  - no full transform controls visible

- `essentials`
  - show:
    - `Plane` group
    - one compact transform summary group
    - the most commonly used quick actions
  - likely content:
    - current plane
    - local/wired status
    - repick plane button
    - compact `Move` summary
    - compact `Rotate` summary
  - avoid exposing the full 9-row transform editor here unless it proves necessary

- `expanded`
  - show the full embedded sketch-plane transform surface
  - this is where sectioned transform controls belong
  - likely structure:
    - `Plane`
    - `Move`
    - `Rotate`
    - `Scale` (only if the model truly supports it)
    - `Status` / technical rows only if still useful

Recommended first implementation priority if this becomes active work:

- first decide the actual sketch-plane transform data model
- then decide whether `Scale` is real, cosmetic, or invalid for a sketch plane
- then implement the row-mode information architecture
- only after that polish visual styling

Why this order matters:

- if the model is unclear, the UI will accidentally mix:
  - plane selection
  - offset semantics
  - transform semantics
  - debug metadata
- and the row will become harder to understand instead of better

Future acceptance target:

- a user should be able to read the managed `SketchPlane` input row and immediately understand:
  - what plane the sketch is on
  - where that plane is
  - how it is rotated
  - whether the shown state is the compact summary or the full transform editor

##### [ ] [182] 2026-03-18 18:31 - Lock the term and vision for the `SketchPlane` surface before more UI cleanup

Terminology correction:

- the current `SketchPlane` surface is **not** an `input node`
- the current `SketchPlane` surface is **not** a data type
- the current `SketchPlane` surface is best described as:
  - the `SketchPlane` **input port**
  - the `SketchPlane` **input row**
  - the managed `SketchPlane` **input-port row** on the `Geometry/Sketch` node
- if one term needs to be preferred going forward, use:
  - **managed `SketchPlane` input row**

Why this wording matters:

- `Geometry/Sketch` is the node
- `SketchPlane` is the named input/port on that node
- `plane` is the underlying type
- `XY` / `XZ` / `YZ` is the current resolved value
- if the team keeps calling the row an `input node`, design discussions blur together:
  - node-level structure
  - port-level structure
  - type/value display

Current-code truth:

- the managed `SketchPlane` row now already behaves more like a dedicated mini-surface than a generic raw port:
  - top-row border color matches the pin color
  - left chevron cycles row modes
  - label click also cycles row modes
  - expanded state owns an attached lower details box
- but the expanded content is still generic metadata-driven detail text rather than a purpose-built sketch-plane control model

Vision / goal:

- the `SketchPlane` input row should evolve from:
  - generic port metadata
- into:
  - a small dedicated control surface for sketch-plane setup

Target UX shape:

- collapsed
  - row reads as a compact named plane input with current resolved plane visible
- essentials
  - row still reads like a compact control surface, not a debug dump
  - only the minimum useful plane information is shown
- expanded
  - the row becomes the full sketch-plane setup surface
  - this is where grouped controls and richer explanation belong

What “upgrade the input row” should mean in practice:

- stop treating the expanded body as a plain list of technical detail lines
- introduce named sub-sections when they map to real user-facing concepts
- reserve raw debug/status lines for cases where they actually help authoring
- bias toward language that describes sketch authoring intent, not internal graph schema

Recommended long-term content model for the managed `SketchPlane` row:

- row header
  - input name / plane-control name
  - current resolved plane value
  - chevron-driven row state
- expanded body
  - `Offset`
    - future real plane offset control if/when it exists
  - `Source`
    - local plane vs wired plane
  - `Status`
    - optional / driven / connection count only if still useful

Important product rule:

- do **not** invent fake controls just to satisfy the grouping language
- if `Offset` does not exist in the actual sketch-plane model yet, the UI can reserve the group title as a directional placeholder, but the real implementation should wait for a true underlying parameter

Upgrade goal for future work:

- the managed `SketchPlane` row should feel like:
  - a first-class geometry setup control
- not like:
  - a generic spaghetti-port debug row that happens to have special CSS

Decision lock for future chat:

- refer to this surface as the **managed `SketchPlane` input row**
- use `input port` when discussing graph/schema identity
- use `input row` when discussing UI layout and interaction

##### [ ] [181] 2026-03-18 18:03 - Sketch output rows still need to migrate off the older outer wrapper and onto the cleaned-up shared port-row style

Observed current-code truth:

- The sketch input row now renders directly through the shared `PortView` surface in `NodeView` and owns its own:
  - colored top-row border
  - left-side chevron
  - connected lower details box
  - tighter geometry-specific padding rules
- The sketch output rows do not use that same direct path yet.
- `SketchProfiles` and `SketchProfile` are still wrapped by `renderGeometryPortRow(...)`, which renders the older extra shell:
  - `SpaghettiGeometryPortRow`
  - `SpaghettiGeometryPortRowHeader`
  - `SpaghettiGeometryPortRowBody`
- That means the sketch outputs already participate in the row-mode default-open logic from `[179]`, but they still look and behave like the older wrapper system rather than the newer shared input-row treatment.

What the cleanup still needs to do:

- remove the older output-only outer wrapper for the managed sketch outputs
- render the managed sketch outputs directly through `renderOutputPortByType(...)` plus explicit row-mode options, the same way the sketch input now does
- give managed sketch outputs the same three-state row model:
  - `collapsed`
  - `essentials`
  - `expanded`
- move the chevron onto the actual output row itself instead of the separate outer header shell
- restyle the output top row and lower details box to match the input cleanup language:
  - port-color border
  - connected lower details box
  - tighter geometry-specific left/right gutter handling
  - matching chevron placement
  - resolved value text treated like the input row, not like the older neutral wrapper

Important current architecture note:

- the shared `PortView` already supports:
  - output direction
  - `rowChevronState`
  - `onCycleRowChevron`
  - `detailsExpanded`
- so the main remaining work is not inventing a new widget
- it is wiring the managed sketch outputs onto the same shared row-surface contract the input already uses

Recommended cleanup direction:

- keep the existing geometry row-mode state keys for output rows
- stop rendering `SketchProfiles` and `SketchProfile` through `renderGeometryPortRow(...)`
- instead:
  - compute each managed output row's current state
  - feed that state into `renderOutputPortByType(...)`
  - let `PortView` render the visible chevron and the row body directly
- then add geometry-output-specific CSS selectors, parallel to the recent input selectors, instead of relying on the older `SpaghettiGeometryPortRow*` wrapper classes

Questions the implementation should answer before styling:

- what should the right-side resolved value label show for each output row?
  - raw type text
  - profile count / selected-profile summary
  - or no value label in collapsed mode
- should output rows use the same chevron orientation mapping as the input row?
  - likely yes for consistency unless output semantics argue otherwise
- should output details stay debug-oriented only, or should `essentials` surface a small non-debug summary?

Concrete code targets:

- `src/app/spaghetti/canvas/NodeView.tsx`
  - remove managed sketch outputs from the older `renderGeometryPortRow(...)` wrapper path
  - add output-row state plumbing parallel to the current `SketchPlane` input-row cycle
- `src/app/spaghetti/canvas/PortView.tsx`
  - likely no structural change required beyond reusing the existing row-chevron path for outputs
- `src/app/theme/v15Theme.css`
  - add geometry-output-specific selectors parallel to the new geometry-input selectors
  - phase out sketch-output dependence on `SpaghettiGeometryPortRowHeader` styling
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - replace wrapper-header click assertions with direct output-row chevron interaction tests

Acceptance target for the cleanup:

- `SketchProfiles` and `SketchProfile` should visually read like siblings of the cleaned-up `SketchPlane` row
- the only directional difference should be output-side pin placement and any output-specific summary copy
- users should not see one interaction model in `Inputs` and a different older one in `Outputs`

##### [ ] [180] 2026-03-18 16:55 - Inputs and Outputs need their own higher-level row-mode layout rules above individual port rows

Observed current-code truth:

- `Geometry/Sketch` section bodies now use the cleaned-up row-mode model from `[178]`.
- `Geometry/Sketch` input/output port rows now use the same default-open versus manual-toggle model from `[179]`.
- But the higher-level `Inputs` and `Outputs` blocks are still always present as plain stack sections.
- That means the node now has improved row behavior inside those areas, but the `Inputs` and `Outputs` shells themselves do not yet participate in the same `collapsed / essentials / expanded` language.

What needs to change:

- `Inputs` should get its own mode-aware layout behavior
- `Outputs` should get its own mode-aware layout behavior
- this behavior should sit one level above the individual port-row wrappers
- user interaction should still be able to manually open or close those higher-level blocks after the row mode picks the default state

Recommended direction:

- use the same model again:
  - row mode sets defaults
  - manual toggle wins after interaction
- first decide whether `Inputs` and `Outputs` stay visible as headers in all three row modes
- then decide their default-open state in `collapsed`, `essentials`, and `expanded`
- only after that decide whether opening a block should also reveal the contained port rows using each row's own default-open state or preserve prior manual row overrides directly

Suggested first-pass default:

- `collapsed`
  - `Inputs` visible but closed
  - `Outputs` visible but closed
- `essentials`
  - `Inputs` open
  - `Outputs` closed
- `expanded`
  - `Inputs` open
  - `Outputs` open

Important note:

- this should not replace the work from `[179]`
- it should wrap above it
- the final shell should become:
  - node row mode
  - block-level `Inputs` / `Outputs`
  - row-level port wrappers

Locked execution decisions for `[180]`:

- first implementation scope
  - `Geometry/Sketch` only
  - `Geometry/Extrude` stays unchanged in this cut
  - legacy `Part/*`, `Primitive/*`, and `Utility/*` blocks stay unchanged in this cut
- `collapsed`
  - `Inputs` visible but closed by default
  - `Outputs` visible but closed by default
- `essentials`
  - `Inputs` open by default
  - `Outputs` closed by default
- `expanded`
  - `Inputs` open by default
  - `Outputs` open by default
- manual block toggles
  - always allowed in all three row modes
  - must never change node row mode
- override persistence
  - manual block open/closed state persists across row-mode changes as long as the block still exists in both modes

Implementation-ready code shape:

- add geometry-specific block helpers in `NodeView`:
  - `isGeometryBlockVisibleForMode(nodeMode, blockId)`
  - `isGeometryBlockOpenByDefault(nodeMode, blockId)`
  - `isGeometryBlockOpen(nodeMode, blockId)`
- store block-level overrides in the same local UI state map shape, but under dedicated block keys
- interpret missing block key as “use row-mode default”
- interpret stored `true` as “user explicitly closed”
- interpret stored `false` as “user explicitly opened”
- block open/closed state should wrap around the existing `[179]` port-row logic, not replace it

Acceptance criteria:

- `Geometry/Sketch` in `collapsed`
  - `Inputs` and `Outputs` are visible as block headers
  - both start closed
  - clicking `Inputs` opens only the `Inputs` block
  - clicking `Outputs` opens only the `Outputs` block
- `Geometry/Sketch` in `essentials`
  - `Inputs` starts open
  - `Outputs` starts closed
  - user can open or close either block manually
- `Geometry/Sketch` in `expanded`
  - `Inputs` and `Outputs` both start open
  - user can close either block manually
- clicking a block header never changes node row mode
- manual block state persists across row-mode changes
- the row-level behavior from `[179]` still works inside the block once the block is open
- existing sketch section behavior from `[178]` remains unchanged
- `Geometry/Extrude` and legacy nodes remain unchanged

Verification targets:

- focused `NodeView` interaction tests for `Inputs` / `Outputs` block behavior in `collapsed`, `essentials`, and `expanded`
- regression test proving a block click in `collapsed` no longer promotes the node to another row mode
- regression test proving a manual block close in `expanded` stays closed after switching to `essentials`
- regression test proving row-level port toggles from `[179]` still work when the surrounding block is open

##### [x] [179] 2026-03-18 16:41 - Input and output port rows still need the same default-open versus manual-toggle cleanup

Observed current-code truth:

- `Geometry/Sketch` section bodies now use the cleaner model from `[178]`, where row mode sets defaults and manual section state overrides those defaults.
- The input and output port rows are still on the older collapse/expand behavior and do not yet feel consistent with that new model.
- This means the node shell now has mixed interaction rules:
  - workflow sections behave one way
  - input/output rows still behave another way

What this needs to decide next:

- whether input and output rows should follow the same default-open model as the main geometry sections
- which input/output rows are visible in `collapsed`, `essentials`, and `expanded`
- whether pin rows should always remain manually collapsible regardless of row mode
- whether input/output row state should persist across row-mode changes the same way section state now does

Recommended direction:

- use the same conceptual rule as `[178]`
- row mode sets default-open state for input/output rows
- manual user toggles always win after interaction
- implement input rows first, then output rows if they need slightly different defaults

Expected first-pass target:

- `Geometry/Sketch` input and output rows should stop feeling like a separate older collapse system
- the whole node should use one consistent “defaults from mode, manual override from user” model

Locked execution decisions for `[179]`:

- first implementation scope
  - `Geometry/Sketch` input rows and output rows only
  - `Geometry/Extrude` stays unchanged in this cut
  - legacy `Part/*`, `Primitive/*`, and `Utility/*` rows stay unchanged in this cut
- `collapsed`
  - sketch input rows visible but closed by default
  - sketch output rows visible but closed by default
- `essentials`
  - `SketchPlane` input row open by default
  - `SketchProfiles` and `SketchProfile` output rows closed by default
- `expanded`
  - sketch input rows open by default
  - sketch output rows open by default
- manual row toggles
  - always allowed in all three row modes
  - must never change node row mode
- override persistence
  - manual row open/closed state persists across row-mode changes as long as the row still exists in both modes

Implementation-ready code shape:

- add geometry-specific helpers for port rows:
  - `isGeometryPortRowVisibleForMode(nodeMode, direction, portId)`
  - `isGeometryPortRowOpenByDefault(nodeMode, direction, portId)`
  - `isGeometryPortRowOpen(nodeMode, direction, portId)`
- store port-row overrides in the same local UI state map shape used for section overrides, but under dedicated row keys
- interpret missing row key as “use row-mode default”
- interpret stored `true` as “user explicitly closed”
- interpret stored `false` as “user explicitly opened”
- keep this behavior geometry-only in the first pass

Acceptance criteria:

- `Geometry/Sketch` in `collapsed`
  - input and output port rows remain visible
  - all start closed by default
  - clicking one row opens only that row
- `Geometry/Sketch` in `essentials`
  - `SketchPlane` starts open
  - `SketchProfiles` and `SketchProfile` start closed
  - user can open or close any row manually
- `Geometry/Sketch` in `expanded`
  - input and output rows start open
  - user can close any row manually
- clicking an input/output row never changes node row mode
- manual port-row state persists across row-mode changes
- existing pin rendering, connection dots, and value labels stay intact
- section behavior from `[178]` remains unchanged
- `Geometry/Extrude` and legacy nodes remain unchanged

Verification targets:

- focused `NodeView` interaction tests for sketch input/output rows in `collapsed`, `essentials`, and `expanded`
- regression test proving a port-row click in `collapsed` no longer promotes the node to another row mode
- regression test proving a manual close in `expanded` stays closed after switching to `essentials`
- regression test proving sketch section behavior from `[178]` still works after the port-row cleanup

##### [x] [178] 2026-03-18 16:01 - Geometry node row mode should set defaults only, while manual section state always wins

Observed current-code truth:

- `NodeView` currently uses one combined visibility rule for template sections: `!isCollapsedMode && !isSectionCollapsed(sectionId)`.
- That means node row mode and per-section collapse state both decide whether the same section body can exist.
- The recent geometry-shell follow-up proved that trying to patch one side of that rule produces strange interaction results:
  - in `collapsed`, section clicks used to look dead
  - after promotion-to-`essentials`, a section click can feel like it opens more of the node than intended
- This confirms the two systems are stepping on each other instead of having separate responsibilities.

Chosen simplification:

- node row mode should control default presentation only
- per-section state should control actual manual open / closed state
- manual section interaction should never be blocked by the row mode

Recommended semantic split:

- `collapsed`
  - compact summary-first shell
  - all workflow sections start closed by default
  - user can still manually open any visible section
- `essentials`
  - normal working shell
  - primary sections start open by default
  - user can still manually open or close any visible section
- `expanded`
  - fuller working shell
  - more secondary / debug / detail surfaces start open by default
  - user can still manually open or close any visible section

Important contract:

- row mode chooses the initial default-open section set
- per-section collapsed state overrides those defaults after the user interacts
- `isSectionBodyVisible` should no longer be hard-gated by `nodeMode === 'collapsed'`
- section clicks should only mutate section state, not secretly change row mode

Implementation shape:

- add a geometry-specific helper in `NodeView` for default section visibility:
  - `isGeometrySectionOpenByDefault(nodeMode, sectionId)`
- keep the local collapsed store, but reinterpret it as user override state:
  - missing key = use row-mode default
  - stored `true` = user explicitly closed
  - stored `false` or deleted key after explicit open = user explicitly opened or returned to default
- split section visibility logic into:
  - `isSectionVisibleForMode(...)` = does this section belong in the current shell at all
  - `isSectionOpen(...)` = is this section body open right now
- use that split only for forward `Geometry/*` nodes first
- leave legacy `Part/*` behavior unchanged until a separate cleanup pass

Suggested first-pass defaults for `Geometry/Sketch`:

- `collapsed`
  - show the shell header, summary strip, inputs rail, outputs rail
  - keep `Plane`, `Draw`, `Entities`, and `Review` visible as section headers
  - start them all closed
- `essentials`
  - start `Plane` and `Draw` open
  - start `Entities` and `Review` closed unless they have content worth surfacing
- `expanded`
  - start `Plane`, `Draw`, `Entities`, and `Review` open
  - allow future diagnostics/debug detail to join here

Why this is the better foundation:

- it matches how the Browser and other foldable surfaces are expected to behave
- it removes the double-gating problem
- it makes row mode about density and defaults instead of acting as a hidden section-permission system
- it gives `Geometry/Sketch`, `Geometry/Extrude`, and later `Geometry/Loft` a cleaner long-term shell contract

Recommended implementation order:

1. revert the temporary “section click promotes row mode” behavior for geometry nodes
2. introduce the new geometry-only default-open model in `NodeView`
3. migrate `Geometry/Sketch` to that model first
4. add focused interaction tests for `collapsed`, `essentials`, and `expanded`
5. only then align `Geometry/Extrude`

Locked execution decisions for `[178]`:

- first implementation scope
  - `Geometry/Sketch` only
  - `Geometry/Extrude` stays unchanged in this cut
  - legacy `Part/*`, `Primitive/*`, and `Utility/*` nodes stay unchanged in this cut
- `collapsed`
  - keep `Plane`, `Draw`, `Entities`, and `Review` visible as section headers
  - start all four closed by default
- `essentials`
  - start `Plane` and `Draw` open by default
  - start `Entities` and `Review` closed by default
- `expanded`
  - start all four open by default
- manual section toggles
  - always allowed in all three row modes
  - must never change row mode
- override persistence
  - manual open/closed state persists across row-mode changes as long as the section still exists in both modes
- temporary fix cleanup
  - the current geometry-only “section click promotes row mode” patch is removed in the same implementation

Implementation-ready code shape:

- add `isGeometrySectionVisibleForMode(nodeMode, sectionId)`
- add `isGeometrySectionOpenByDefault(nodeMode, sectionId)`
- geometry section body visibility should become:
  - section visible in current mode
  - section open either by row-mode default or by explicit local override
- reinterpret geometry section collapse state as user override state:
  - missing key = use row-mode default
  - stored `true` = user explicitly closed
  - stored `false` = user explicitly opened
- keep this split geometry-only for the first pass

Acceptance criteria:

- `Geometry/Sketch` in `collapsed`
  - shows the summary shell plus the four section headers
  - starts with all section bodies closed
  - clicking one section opens only that section
- `Geometry/Sketch` in `essentials`
  - starts with `Plane` and `Draw` open
  - starts with `Entities` and `Review` closed
  - user can open or close any section manually
- `Geometry/Sketch` in `expanded`
  - starts with all four sections open
  - user can close any section manually
- clicking a section header never changes row mode
- manual section state persists across row-mode changes
- existing sketch viewer/session behavior is unchanged
- `Geometry/Extrude` and legacy nodes are unchanged

Verification targets:

- focused `NodeView` interaction tests for `collapsed`, `essentials`, and `expanded`
- regression test proving a section click in `collapsed` no longer promotes the node to `essentials`
- regression test proving a manual close in `expanded` stays closed after switching to `essentials`
- regression test proving legacy part-node section behavior is unaffected

##### [x] [177] 2026-03-18 15:31 - Node mode cleanup should explicitly cover section expansion behavior for the new geometry shell

Observed current-code truth:

- `NodeView` still owns the old `expanded` / `essentials` / `collapsed` mode split.
- Geometry-shell sections still use the shared `renderSectionHeader -> toggleCollapsed -> isSectionBodyVisible` path in `NodeView`.
- The new `Geometry/Sketch` shell now uses the dedicated section ids `sketch-plane`, `sketch-draw`, `sketch-entities`, and `sketch-review`.
- In live use, clicking `Plane`, `Draw`, `Entities`, or `Review` is currently not giving the expected open/close feedback, so the new shell has inherited the old section-mode system without a clean geometry-specific interaction pass.
- The strongest current-code read is that this is not a missing section-toggle implementation.
- Section clicks still flip the local section-collapsed flag, but `isSectionBodyVisible(sectionId)` returns `false` for every section when the node is in `collapsed` mode.
- That means a `Geometry/Sketch` node can look like section clicks are broken when it is actually stuck inside the older node-row mode contract.

What this means:

- the node-shell cleanup is not done once the layout looks cleaner
- the mode system and section-collapse behavior also need a dedicated cleanup pass
- otherwise the new geometry shell will keep feeling like a partial visual rewrite on top of older interaction rules

Recommended next cleanup surface:

- define what `expanded`, `essentials`, and `collapsed` should mean for forward `Geometry/*` nodes
- lock whether geometry sections are always open in `essentials`, selectively collapsible in `expanded`, or share one common collapse model
- make section header clicks behave consistently and visibly for `Plane`, `Draw`, `Entities`, and `Review`
- treat this as part of the node-shell foundation work before moving on to more geometry features

Suggested defaults:

- `expanded`
  - all geometry sections visible
  - section collapse state available and persistent
- `essentials`
  - only the primary geometry sections visible
  - section collapse state still works
  - hidden legacy/debug extras stay out of the way
- `collapsed`
  - geometry content bodies hidden
  - only compact node summary remains
- section headers
  - clicking the header should always toggle the body in any non-`collapsed` mode
  - the chevron state must match the actual visible body state
  - new geometry-shell sections should not depend on part-era assumptions about which sections are allowed to collapse

Suggested fix:

- keep the old `expanded` / `essentials` / `collapsed` row-mode system for legacy nodes
- add geometry-specific row-mode behavior instead of letting `Geometry/*` inherit the part-era rules unchanged
- for `Geometry/*` nodes, make section-header clicks promote the node out of `collapsed` mode before applying the per-section toggle
- treat `collapsed` as a true compact-summary state only, not as a state where full section shells stay visible but can never open
- in code terms:
  - keep `toggleCollapsed(sectionKey(sectionId))` for section state
  - add a geometry-node branch before that path so if `nodeMode === 'collapsed'`, the click first calls `setNodeMode(node.nodeId, 'essentials')`
  - then either leave all sections open by default in `essentials` or re-run the intended section toggle after promotion
- recommended first pass:
  - `collapsed` geometry node = summary only
  - `essentials` geometry node = normal working mode with section bodies visible
  - `expanded` geometry node = same working layout plus any future secondary/debug detail

Why this is the strongest fix:

- it matches the current `NodeView` visibility rule instead of fighting it with more CSS
- it preserves the existing per-section collapse store
- it makes the new geometry shell feel intentional instead of like a broken version of the legacy node layout

Recommended framing:

- this should become its own follow-up implementation note or task after the first sketch-shell layout cleanup
- the issue is not just one broken click target; it is that the forward geometry shell still depends on an older node-mode/collapse system that has not been normalized yet

##### [x] [176] 2026-03-18 14:38 - Recommended next cleanup sequence for the first real graph-native node family

Current-code truth:

- `Geometry/Sketch` and `Geometry/Extrude` are now the first real graph-native nodes.
- Both still render through large bespoke branches inside `NodeView`.
- `Geometry/Sketch` still uses old prose-like section labels such as `Draw/Edit Curves Inside` and `Close/Select Profile`.
- `Geometry/Extrude` still reuses the old `legacy` section id for its inner feature surface.
- Older `Part/*`, `Primitive/*`, and `Utility/*` nodes still define the old layout world and should no longer be treated as the forward node-shell model.

Chosen contract:

- The first cleanup cut is `shared shell + Geometry/Sketch`.
- The implementation shape is one reusable `GeometryNodeShell` component used from `NodeView`.
- `NodeView` remains the top-level template dispatcher in this cut.
- `Geometry/Extrude` does not migrate in the same cut.
- Older `Part/*`, `Primitive/*`, and `Utility/*` nodes are frozen as `legacy` and stay visually unchanged.

Shared shell contract:

```text
GeometryNodeShell
├─ Header
│  ├─ title
│  ├─ family/kind badge
│  └─ compact status chips
├─ Summary Strip
│  └─ key state chips only
├─ Main Body
│  ├─ Input Rail
│  ├─ Content Column
│  └─ Output Rail
└─ Diagnostics Footer
```

Locked rules:

- `Inputs` and `Outputs` stop being large top/bottom sections for geometry nodes.
- Geometry nodes use left/right rails for ports.
- The content column owns workflow sections.
- Diagnostics live in a footer area, not mixed into the main workflow sections.
- The shell is shared by `Sketch`, `Extrude`, and later `Loft`.

First `Sketch` migration contract:

```text
Geometry/Sketch
├─ Header
│  ├─ Sketch
│  ├─ Geometry badge
│  └─ plane / wired / session state chips
├─ Summary Strip
│  ├─ plane
│  ├─ entity count
│  └─ selected profile / profile count
├─ Main Body
│  ├─ Input Rail
│  │  └─ SketchPlane
│  ├─ Content Column
│  │  ├─ Plane
│  │  ├─ Draw
│  │  ├─ Entities
│  │  └─ Review
│  └─ Output Rail
│     ├─ SketchProfiles
│     └─ SketchProfile
└─ Diagnostics Footer
```

Locked naming decisions:

- `Plane`
- `Draw`
- `Entities`
- `Review`
- `Diagnostics`

Forward removals from the geometry-node vocabulary:

- `Draw/Edit Curves Inside`
- `Close/Select Profile`
- any reuse of old `legacy` section naming inside forward `Geometry/*` templates

Legacy classification:

- The old `part`-style node layout is `legacy`.
- Older helper and part nodes remain functional but are not the model for new work.
- `Geometry/Sketch` and `Geometry/Extrude` define the forward shell direction.
- No visual normalization pass for `Part/*` happens in this first cleanup cut.

Implementation order:

1. extract `GeometryNodeShell` and shared geometry-shell primitives from `NodeView`
2. move `Geometry/Sketch` onto the new shell
3. rename and normalize sketch section labels and region ownership
4. keep sketch viewer/session behavior unchanged
5. verify legacy nodes still render unchanged
6. create a follow-up note/task for `Geometry/Extrude` alignment using the same shell

Important interface / type decisions:

- `NodeView` remains the template dispatcher in the first cut.
- New reusable UI contract: `GeometryNodeShell`.
- Geometry templates consume:
  - header metadata
  - summary chips
  - input rail content
  - content sections
  - output rail content
  - diagnostics content
- No public graph schema changes in this cleanup cut.
- No node-type renames in this cleanup cut.
- No migration of `Geometry/Extrude` in this cleanup cut.

Acceptance criteria:

- `Geometry/Sketch` renders through the shared shell, not its old bespoke layout.
- Sketch ports appear in left/right rails rather than old top/bottom section flow.
- Sketch sections use the new structural labels.
- Sketch plane picking, draw session entry, review entry, entity reordering, and delete behavior still work.
- Diagnostics still render when present.
- `Geometry/Extrude` remains functional and visually unchanged in this cut.
- Legacy nodes remain visually unchanged.
- No regressions in general `NodeView` rendering for non-geometry nodes.

Explicit defers:

- do not migrate `Geometry/Extrude` yet
- do not redesign old `Part/*`, `Primitive/*`, or `Utility/*` nodes
- do not split into a fully separate renderer subsystem in this cut
- do not change graph schema, node ids, or public port contracts

Recommended framing:

- this is the first executable node-family cleanup spec, not optional visual polish
- the goal is to prove a reusable geometry-node shell with `Sketch` first, then align `Extrude`, then use the same shell for `Loft`

##### [x] [175] 2026-03-18 14:20 - `Loft` should wait until the current graph-native node templates are cleaned up

Current read:

- `Geometry/Sketch` and `Geometry/Extrude` now exist as real graph-native nodes.
- That is enough to prove the first vertical slice, but not enough to call the node-template foundation clean.
- `Loft` should not be the next cleanup surface.

Why:

- `Sketch` still mixes dedicated template behavior with older shared `NodeView` section chrome.
- `Extrude` is now honest enough to ship, but still reads as a first-pass template rather than a settled node-authoring contract.
- adding `Loft` before cleaning this up would multiply one-off template branches and make later normalization harder.

Recommended order:

- first stabilize the shared node-template contract for graph-native geometry nodes
- then clean up `Sketch`
- then clean up `Extrude`
- only after that add `Loft`

##### [x] [174] 2026-03-18 14:20 - Node-template cleanup should be treated as a real pre-`Loft` workstream, not ad hoc polish

Observed current-code truth:

- `Geometry/Sketch` is on a dedicated `template: 'sketch'` path.
- `Geometry/Extrude` is on a dedicated `template: 'extrude'` path.
- both still live inside the large shared `NodeView` renderer and still borrow generic section helpers and older row structures.

What this means:

- the project has crossed the line from “generic node shell only” into “specialized graph-native authoring templates”
- but the template system itself has not been cleaned up into a strong reusable foundation yet

Suggested cleanup buckets:

- shared template shell cleanup
  - define one cleaner reusable geometry-node section pattern
  - reduce dependence on older `legacy` / part-era section naming
  - make template-specific surfaces easier to reason about than the current large inlined `NodeView` branches
- `Geometry/Sketch` cleanup
  - tighten section ownership
  - reduce placeholder-era wording and mixed old/new UI semantics
  - make entity list, review state, and action surfaces feel like one coherent node contract
- `Geometry/Extrude` cleanup
  - tighten profile-source presentation
  - make depth/type/body summary feel less provisional
  - decide which small essentials belong before `Loft` and which stay deferred

Recommended framing:

- this is not “nice to have polish”
- this is foundation cleanup for the first graph-native geometry node family
