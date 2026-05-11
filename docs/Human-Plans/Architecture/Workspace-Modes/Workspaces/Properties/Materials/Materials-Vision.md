# Materials Vision

## Doc Header

### Doc History
4. 2026-05-10 14:33:48: Linked the older ParaHook materials-window screenshot as the canonical visual baseline for this family, adding explicit UI-density and anti-drift rules so future materials phases keep the compact focused-object, target-list, property-control, action, and preset-list shape instead of growing into a noisy all-controls surface.
3. 2026-05-10 11:02:35: Added an explicit material-property option matrix to this vision doc so the family now records which editable fields fit the first practical workspace pass, which ones are likely next once the owner seams are clearer, and which later advanced controls should stay deferred until the material system widens honestly.
2. 2026-05-10 10:56:07: Updated this moved materials vision doc so it now reads as the first nested subfamily under `Workspaces/Properties/` instead of a standalone top-level workspace family, keeping the same focused-object materials direction while aligning the cross-doc references to the new umbrella.
1. 2026-05-10 10:44:20: Added this dedicated `Materials` workspace vision doc so the old focused-object materials editor flow now has one stable planning home inside the current workspace-family architecture, preserving object-focused part/material editing, material-property inspection, and new-material creation while keeping material truth downstream from real object and project owners.

### Purpose

This doc captures the long-range vision for the `Materials` subfamily inside the `Properties` workspace in ParaHook.

Use it to answer:
- what the `Materials` workspace is supposed to be for
- how the old focused-object materials editor flow should translate into the current workspace model
- how object focus, part targets, and material-property editing should relate
- how `New Material` creation should fit the workspace
- what must stay true so `Materials` does not become a hidden second owner of object, viewer, or project truth

Do not use it for:
- one specific implementation checklist
- pretending the full runtime material system already exists
- replacing object/content/material ownership with workspace-local state
- replacing the later `Materials-GenN-Index.md` generation-routing role
- replacing standalone `Future/Materials-N - ...` family phase docs

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping material editing downstream from explicit object/project truth instead of inventing a second hidden owner

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for keeping `Materials` aligned with the graph-native CAD workspace direction and the hybrid workspace model

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - umbrella workspace family
  - useful for how `Properties` and its nested `Materials` lane should fit beside `Model Viewport`, `Browser`, `Catalog`, `Layers`, `Settings`, and the other real workspace surfaces

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
  - active `Properties` umbrella planning surface
  - useful for the broader focused-item property workspace boundary above the nested `Materials` lane

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
  - active Generation 1 routing surface
  - useful for turning this vision into the first real family phase ladder

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Layers/Layers-index.md`
  - later adjacent workspace family
  - useful for keeping material editing separate from layer visibility and membership behavior even when the workflows sit near each other

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
  - model viewport family
  - useful for keeping render/preview consequences in the viewer while material truth stays explicit elsewhere

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Browser-Index.md`
  - Browser/project-content ownership family
  - useful for keeping focused object and part identity explicit instead of turning the `Materials` workspace into a shadow project tree

## Doc Body

### Why This Doc Exists

The old ParaHook app already proved a useful materials-editing interaction:
- the user had a focused object or item
- the workspace showed the parts or material targets inside that focused object
- selecting one target revealed editable material properties below
- the user could create a new material directly from the same workspace

That old flow is worth preserving, but the old float-window shell should not be copied forward as architecture truth.

Without a dedicated vision doc, `Materials` could drift into weak shapes:
- a viewer-only property drawer with no real workspace identity
- a hidden second owner of render/material truth
- a clone of `Layers`
- a second object tree competing with `Browser`
- a one-off product-specific panel that cannot survive the newer workspace architecture

This doc exists to preserve the good user-facing workflow while translating it into the repo’s current owner and workspace rules.

### Canonical Visual Baseline

The older ParaHook materials-window screenshot is the visual baseline for this family:

![Older ParaHook materials window](<C:/Users/Rubbe/Desktop/ParaHookConfig/20/img ref/Screenshot 2026-05-10 131952.png>)

Use that image as the minimum UX shape to preserve, adapted to the new stack and current workspace shell.

The important visual commitments are:
- a compact dark workspace lane
- focused-item read at the top
- object-part or material-target list immediately after focus
- odds and evens group actions near the target-list area
- selected material controls grouped below the target list
- `New Material` as a clear full-width action
- a default material or preset list below the editor
- dense readable rows instead of scattered oversized cards

Anti-drift rule:
- when the current implementation feels busy, prefer returning toward this screenshot's compact stack and section order before adding more visible controls
- do not add every future field directly into the main lane at once
- use collapsible groups, compact rows, or a separate later library/preset surface when new material fields would crowd the focused-object workflow
- the new app may improve styling and ownership, but it should not ship with less practical materials workflow than this reference shows

### Short Version

`Materials` should be a real workspace surface where the user inspects, creates, assigns, and edits surface/material appearance for the currently focused project objects and their part targets.

The core user flow should stay object-first:
- there is a focused object, item, or content target
- the workspace reveals the material-bearing part targets inside that focus
- selecting one target reveals the editable material properties for that target
- the user can create a new material when needed

Important rule:
- the workspace should project and edit material truth
- it should not quietly become the owner of object identity, Browser hierarchy, or viewer/render runtime truth

## Vision

### Human Level Goals

- [ ] `Materials-Gen1-HLG-1. Materials should be a real workspace surface under Workspace Modes instead of only a floating side panel or implied later tool.`
- [ ] `Materials-Gen1-HLG-2. Materials should start from the currently focused object or item instead of forcing the user through a global-first material list.`
- [ ] `Materials-Gen1-HLG-3. Materials should show the part or material-bearing targets inside the focused object so the user can choose exactly what they want to edit.`
- [ ] `Materials-Gen1-HLG-4. Selecting one part or material target should reveal editable material properties such as color, metalness, roughness, opacity, and later richer material fields.`
- [ ] `Materials-Gen1-HLG-5. Materials should support creating a new material from the workspace instead of making the user leave the flow to start one elsewhere.`
- [ ] `Materials-Gen1-HLG-6. Materials should stay downstream from the real object, content, and material owner systems instead of becoming a hidden second source of truth.`
- [ ] `Materials-Gen1-HLG-7. Materials should stay separate from Layers even if both workflows are often used together.`
- [ ] `Materials-Gen1-HLG-8. Materials should fit the same hybrid workspace model as the other major workspaces, so it can later live in tiled, windowed, and pop-out placements without becoming a special-case shell.`

### Materials Generations

The first useful generation is `Generation 1`.

Generation index routing:
- `Generation 1` routes into `Materials-Gen1-Index.md`.
- later generations should get generation indexes only when the family widens enough that one index is no longer honest.

### Supporting Vision Detail

#### Workspace Surface Direction

`Materials` should be a first-class workspace surface.

That means:
- it belongs in the shared workspace surface catalog
- it should later be hostable inside the shared `Windowed`, `Tiled`, and `Pop-Out` model
- it should not be trapped permanently as only a floating helper window
- it should not be treated as only a viewer overlay or a Browser subsection

Healthy surface read:
- `Browser` remains the project/content and hierarchy owner
- `Model Viewport` remains the viewer and preview consequence surface
- `Layers` remains the visibility and membership workspace
- `Materials` becomes the material-focused inspection and editing workspace

#### Focus-First Editing Direction

The old app screenshot points to the right first user model:
- the user focuses one object or item
- the workspace understands that focus
- the workspace lists the material-bearing targets inside that focus
- the user selects one target to inspect and edit

That object-first flow is better than a purely global material bucket for the first `Materials` family because:
- it stays grounded in what the user is looking at
- it avoids pretending the app already has a fully independent material-library universe
- it keeps the editing path close to project/content truth

Important rule:
- global material libraries may still exist later
- but the first healthy workspace read should stay object-context-aware

#### Target List Direction

The upper section of the workspace should answer:
- which object is focused right now?
- which part targets or material slots exist inside that object?
- which target is currently selected?

The target list should feel explicit and inspectable.

It should eventually leave room for:
- repeated material usage across more than one part target
- odd/even or grouped target actions if the real owner seams justify them later
- multi-target assignment or replacement actions

But the first rule should stay simple:
- choose one target
- inspect and edit that target's material state

#### Property Editing Direction

The lower section of the workspace should reveal the selected target's material properties.

The first practical property family likely includes:
- color
- metalness
- roughness
- opacity
- later texture or richer shader fields only when those owner seams are real

Important rule:
- property editing should read from and write to explicit material truth
- not to a viewer-only temporary appearance trick unless the user is intentionally in a preview-only mode

#### Material Property Options

The editable material fields should widen in honest layers instead of pretending the full material system already exists.

First practical workspace pass:
- `Material name`
- `Base color`
- `Metalness`
- `Roughness`
- `Opacity`
- `Emissive color`
- `Emissive intensity`
- `Double-sided`

Likely next once the owner seams are clearer:
- `Normal map`
- `Normal strength`
- `Ambient occlusion`
- `AO strength`
- `Specular`
- `Clearcoat`
- `Clearcoat roughness`
- `Transmission`
- `IOR`
- `Alpha mode`
- `Alpha cutoff`
- `UV tiling`
- `UV offset`
- `UV rotation`

Later advanced or wider material-system controls:
- `Texture slot assignment`
- `Shared material instance` versus `local override`
- `Material preset or library source`
- `Per-part material assignment and replacement`
- `Render-only flags`
- `Export-facing material metadata`

Related first-class actions that belong in the workspace alongside those fields:
- `New Material`
- `Assign Material`
- `Duplicate Material`

Important boundary:
- `Materials` should edit appearance and assignment-facing material fields
- it should not quietly absorb object transform, Browser hierarchy, layer membership, or viewer-runtime ownership

#### New Material Direction

`New Material` should remain a first-class action in the workspace.

That means the workspace should eventually support:
- creating a new material record or material instance
- naming it
- giving it initial basic properties
- assigning it to the current target or leaving it available for later assignment

Important boundary:
- `New Material` should not become a local orphaned UI draft with no explicit owner
- creation must route into the real material owner model once that owner is defined

#### What Materials Should Own

`Materials` should own:
- the workspace surface
- the focused-object material editing workflow
- selected material-target UI state
- material-property editing presentation
- later material creation flow presentation
- later material assignment workflow presentation

#### What Materials Must Not Own

`Materials` must not own:
- Browser/project-content hierarchy truth
- focused object identity itself
- layer membership or visibility rules
- viewer runtime/render pipeline ownership
- hidden per-panel material truth detached from the project/content/object owners

Important rule:
- `Materials` may project, inspect, and edit those other owners
- it should not absorb them

#### Layers Relationship

The screenshot is a useful reminder that `Layers` and `Materials` often live near each other in workflow, but they should not collapse into one system.

The clean rule is:
- `Layers` answers visibility, grouping, and membership questions
- `Materials` answers appearance/material questions

They may both respond to the same focused object, but they should remain separate workspace families and separate owner systems.

#### Later Direction

After the first object-focused materials workspace foundation, later generations can grow into:
- reusable material libraries
- material presets
- cross-object reuse and replacement flows
- richer shader/texture fields
- tighter viewport preview feedback
- safer Browser and selection integrations

But those later widenings should only land after the owner seams are honest.

## [ ] Generation 1 - Focused Object Materials Workspace Foundation

### Generation 1 Summary

`Generation 1` creates the new `Materials` workspace family and routes the first implementation ladder toward a real object-focused materials workspace.

The first generation should prove:
- the workspace family exists
- the first material owner seams are identified
- the focused-object -> target-list -> property-editor flow is the right foundational shape
- `New Material` has an explicit future home
- material truth stays separate from Browser, Layers, and viewer runtime ownership

### Generation 1 Vision Rails

#### Final Generation Vision

The final `Generation 1` read is that a user can open `Materials`, understand which object is currently focused, choose one material-bearing part target inside it, inspect the current material properties, and edit or create material state through one explicit workspace surface.

The surface should feel:
- object-context-aware
- explicit about target identity
- downstream from real owners
- compatible with the shared workspace model

#### Ownership Guardrails

`Generation 1` must:
- keep focused object identity explicit
- keep material truth explicit
- keep the workspace as a projection/editor over real owners
- avoid turning `Materials` into a second Browser or a second Layers surface

#### Family-Phase Setup Guidance

The first family phase should stay foundation-first.

Healthy first ladder:
- `Materials-1`
  - workspace foundation and material owner read
- later `Materials-2`
  - only after `Materials-1` makes the owner seams honest enough to plan a real runtime surface
