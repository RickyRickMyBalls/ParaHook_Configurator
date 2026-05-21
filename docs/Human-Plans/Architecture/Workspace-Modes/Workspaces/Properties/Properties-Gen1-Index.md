# Properties Gen1 Index

## Doc Header

### Doc History
28. 2026-05-21 07:09:19: Prepped `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` for implementation against the live `ViewSettings.gridVisible` owner, `uiPrefsPersistence` view-settings copy paths, hard-coded `Viewer.ts` minor/major/double-major grid helpers, and current Properties `Render` group order, locking the first code cut to a three-layer `gridPresentation` contract that keeps `gridVisible` as the top-level on/off setting.
27. 2026-05-21 06:59:59: Planned `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System` after the user asked to move the View Toolbar `Grid` checkbox into Properties `Render`, setting the next render/presentation handoff around a new `Grid` section with `Grid` on/off, grid height, and a bounded `Grid 1` / `Grid 2` / `Grid 3` layer model for minor, major, and double-major spacing/color/weight controls.
26. 2026-05-21 06:50:32: Recorded the shipped `Properties-3 / Phase 4 - Ground And Contact Presentation Controls` implementation after Properties `Render > Shadows` and `Render > Ground` gained View Toolbar parity for global shadows, selected-light shadow controls, ground visibility, ground height, and ground material, with Clay Studio keeping those controls locked/read-only as preset-owned presentation behavior.
25. 2026-05-21 06:40:53: Prepped `Properties-3 / Phase 4 - Ground And Contact Presentation Controls` against the shipped Properties `Render` grouping, existing View Toolbar ground controls, `groundEditHistory` helpers, shared `ViewSettings.ground`, and Clay Studio viewer ground/contact overrides, choosing Standard-mode ground visibility, height, and material controls while leaving Clay Studio contact treatment preset-owned and read-only.
24. 2026-05-21 06:32:26: Recorded the shipped `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy` implementation after Properties `Render > Environment` gained Standard-mode Environment Grade sliders, Clay Studio kept those controls `Preset Locked`, and the next active render handoff advanced to `Properties-3 / Phase 4 - Ground And Contact Presentation Controls`.
23. 2026-05-21 06:28:39: Prepped `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy` for implementation by choosing the first-pass `Preset Locked` Clay Studio policy, grounding the next cut in the existing `ViewToolbar` grade controls, `uiPrefsStore.setEnvironmentGrade(...)`, environment-look history helpers, and the `Viewer.ts` Clay Studio grade override, while keeping presets, HDRI/source, lighting, and runtime grade math out of scope.
22. 2026-05-21 06:20:44: Recorded the shipped `Properties-3 / Phase 2 - Render Section Grouping And Readback` implementation after Properties `Render` gained visible `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality` groups, with Environment/Shadows/Ground staying readback-only and the next active render handoff advancing to `Properties-3 / Phase 3 - Environment Grade Controls And Clay Studio Policy`.
21. 2026-05-21 06:12:46: Prepped `Properties-3 / Phase 2 - Render Section Grouping And Readback` against the live `PropertiesRenderSection.tsx`, `PropertiesSurface.test.tsx`, shared `ViewSettings` fields, and Clay Studio viewer runtime branches, narrowing the next implementation pass to Properties `Render` grouping and readback rows while deferring active Environment, Shadows, and Ground controls.
20. 2026-05-20 20:13:19: Recorded the docs-only closeout for `Properties-3 / Phase 1 - ViewSettings And Render Control Inventory`, confirming that the current live implementation exposes `Viewport Style`, Ambient Occlusion, and Render Preview quality in Properties `Render` while Clay Studio environment grade, lighting, hard-shadow suppression, ground forcing, ground material, and contact shadows remain Model Viewport runtime behavior for later readback/grouping phases.
19. 2026-05-20 20:03:45: Prepped `Properties-3 / Phase 1 - ViewSettings And Render Control Inventory` by grounding the next docs-only pass in the live `ViewSettings` contract, current Properties `Render` section, and Clay Studio viewer overrides, with future Properties `Render` subsections now explicitly aimed at `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`.
18. 2026-05-20 19:53:00: Added `Properties-3 - View And Render Presentation Controls` as the future family plan for organizing viewport/render presentation controls under Properties `Render`, including `Viewport Style`, Ambient Occlusion, Environment Grade Controls, ground/contact presentation, and Render Preview quality while keeping viewer runtime ownership in `Model Viewport`.
17. 2026-05-10 13:15:16: Expanded the nested materials follow-through by adding explicit `Materials-1` phase-2 and phase-3 planning plus the new `Materials-2` future doc, so the `Properties` umbrella now points at a full foundation ladder and a later editing ladder instead of implying that all post-foundation work still lives inside one materials phase.
16. 2026-05-10 13:05:32: Added the new standalone `Materials-1` future doc under the nested `Properties/Materials/Future/` home, tightened the active subfamily handoff so the live implementation owner now points at that doc instead of the generation index, and locked the next nested runtime cut to `Phase 1 - Focused Object Intake And Current Material Truth Read`.
15. 2026-05-10 12:58:35: Recorded the landed `Properties-2 / Phase 3 - Child Section Contract And Shell States` closeout after the shared shell gained an explicit section-facing contract plus shell-owned empty/unsupported/no-section behavior, and advanced the active family handoff out of the shell ladder and into `Materials-1` as the first child-lane runtime owner-mapping pass.
14. 2026-05-10 12:56:14: Prepped `Properties-2 / Phase 3 - Child Section Contract And Shell States` for implementation by grounding the final shared-shell closeout against the landed `PropertiesSurface` section host, tightening the next cut around one explicit section-facing contract plus shell-owned non-happy-path states, and keeping `Materials-1` as the first child-lane runtime owner-mapping pass after that.
13. 2026-05-10 12:52:18: Recorded the landed `Properties-2 / Phase 2 - Section Registry And Tab Framing` pass after the shared `Properties` shell replaced its phase-1 placeholder with a real section host, made `Materials` the first active hosted section and default-tab read, and advanced the active family-level implementation handoff to `Properties-2 / Phase 3 - Child Section Contract And Shell States`.
12. 2026-05-10 12:50:31: Prepped `Properties-2 / Phase 2 - Section Registry And Tab Framing` for implementation by grounding the next shared-shell pass against the live `PropertiesSurface.tsx` placeholder shell, locking `Materials` as the first real hosted section and default-tab read, and tightening the proof boundary around shell-owned section framing instead of materials-specific behavior.
11. 2026-05-10 12:13:32: Recorded the landed `Properties-2 / Phase 1 - Workspace Mount And Focus Context` shared-shell pass after the family registered the real optional `Properties` workspace surface, added the canonical surface-registry branch, landed the first shell-level focused-target read, and advanced the active next implementation handoff to `Properties-2 / Phase 2 - Section Registry And Tab Framing`.
10. 2026-05-10 12:05:25: Prepped `Properties-2 / Phase 1 - Workspace Mount And Focus Context` for implementation by grounding the first shared-shell cut against the live workspace-surface catalog, surface-registry, workspace-store placement seam, and existing workspace-selection owner path so the new `Properties` shell can mount honestly before tab framing or materials-specific runtime behavior begins.
9. 2026-05-10 12:01:29: Recorded the landed `Properties-1 / Phase 3 - Later Lane Reservation And Closeout` umbrella closeout, locking future candidates such as `Transform` to reservation-only status, closing `Properties-1` as a structural family phase, and advancing the active family-level handoff to `Properties-2 / Phase 1` while keeping `Materials-1` explicit as the first child-lane runtime-forward lane after that shared shell.
8. 2026-05-10 11:55:14: Added the new follow-on family phase `Properties-2 - Shared Properties Workspace Shell And Section Hosting`, updated the generation ladder so the family now records the missing shared runtime shell between the structural umbrella and the nested `Materials-1` lane, and kept `Materials-1` explicit as the first child-lane runtime-forward pass after that shell lands.
7. 2026-05-10 11:30:56: Prepped `Properties-1 / Phase 3 - Later Lane Reservation And Closeout` for implementation by tightening the reservation-only rule for later property-group candidates, keeping the umbrella closeout narrow, and making `Materials-1` the explicit next family-level implementation handoff after the umbrella finishes.
6. 2026-05-10 11:28:44: Recorded the landed `Properties-1 / Phase 2` handoff pass after the family locked the no-overlap contract between umbrella routing and nested materials-specific owner mapping, made `Materials-1` the explicit first material-specific runtime-forward lane, and advanced the remaining umbrella work to `Phase 3 - Later Lane Reservation And Closeout`.
5. 2026-05-10 11:27:21: Prepped `Properties-1 / Phase 2 - Materials Handoff And Owner Boundary` for implementation by tightening the umbrella-to-materials no-overlap rule, keeping the next active materials runtime-forward lane explicit, and narrowing the remaining umbrella work after that to reservation-and-closeout only.
4. 2026-05-10 11:24:25: Recorded the landed `Properties-1 / Phase 1` umbrella pass after the family locked the top-level meaning of `Properties` plus focused-item entry above the nested `Materials` lane, and advanced the active next internal handoff inside the umbrella doc to `Phase 2 - Materials Handoff And Owner Boundary`.
3. 2026-05-10 11:22:51: Prepped the new standalone `Properties-1` family phase doc for implementation by tightening the umbrella handoff around focused-item entry, nested `Materials-1` ownership, and reservation-only later lanes, while keeping the current generation index aimed at one small structural pass before the materials runtime lane begins.
2. 2026-05-10 11:07:51: Added the first standalone family phase doc `Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`, updated this generation index so the umbrella now points at one explicit implementation-planning owner surface, and kept the next runtime-forward handoff aimed at the nested `Materials-1` lane instead of inventing a broad premature Properties runtime pass.
1. 2026-05-10 10:53:15: Added the new active `Properties` Generation 1 planning index so the workspace family now has a real umbrella home above the moved `Materials` subfamily, with the first generation intentionally centered on focused-item property editing and the first concrete subfamily routed into `Properties/Materials/`.

### Purpose

This file is the active `Generation 1` planning index for the `Properties` workspace family under `Workspace Modes`.

Use it to answer:
- what the `Properties` workspace family is supposed to be for
- how `Properties` should fit the hybrid workspace model
- how focused-item property editing should be organized before many subfamilies appear
- which Generation 1 goals belong to the umbrella workspace family versus the first `Materials` subfamily
- what the first `Properties` family phase should be

Do not use it for:
- the broad long-range north-star if the family later needs `Properties-Vision.md`
- detailed implementation-phase specs that belong in standalone `Future/` family phase docs
- treating one specific property group such as `Materials` as if it already defines the entire family forever

### Family Structure

Use this folder like this:

- `Properties-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Materials/`
  - first concrete `Properties` subfamily
  - current home for object-focused material editing vision and generation routing
- `Future/`
  - standalone implementation-ready `Properties` family phase docs
- `Shipped/`
  - shipped records for completed `Properties` umbrella cuts

Important setup note:
- `Properties` is now the workspace-family umbrella
- `Materials` is the first nested property-editing subfamily, not the whole workspace identity
- if the umbrella widens enough that it needs a broader north-star, add `Properties-Vision.md` later instead of overloading this index

## Doc Body

### Short Version

`Properties` should become the real workspace surface for focused-item inspection and editing.

The family should leave room for multiple property groups over time, not just one:
- `Materials`
- later transforms or object-level metadata if they belong here
- later other property sections that are too specific to justify their own whole workspace

The first concrete subfamily is `Materials`.

That means the first honest umbrella read is:
- `Properties` is the workspace family
- `Materials` is the first major section or subfamily inside it
- the umbrella should stay broad enough to host later property groups
- the first implementation work should still stay narrow and owner-honest

The first family lane is `Properties-1`.

`Properties-1` should stay structural:
- define the umbrella workspace direction
- define how focused-item property editing relates to subfamilies
- keep the first runtime-planning handoff aligned to the moved `Materials` subfamily instead of inventing fake parallel work

### Current Planning Read

This file owns the active `Generation 1` family-phase routing for the `Properties` workspace.

Current legal family-phase ladder:
- `Properties-1` - Workspace Umbrella And Focused-Item Property Routing
- `Properties-2` - Shared Properties Workspace Shell And Section Hosting
- `Properties-3` - View And Render Presentation Controls

Current subfamily read:
- `Materials` is the first active `Properties` subfamily
- current materials north-star and generation routing live under:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-1 - Workspace Foundation And Material Owner Read.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-2 - First Material Editing And Action Flows.md`

Current planning rules:
- use this index to choose and bound umbrella `Properties-N` family phases
- use the nested `Materials` docs for materials-specific direction and later implementation planning
- do not start runtime implementation from this index alone
- keep the umbrella broad enough to host more than `Materials`, but do not invent extra subfamilies until they are real

Current active implementation-planning owner:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Future/Materials-1 - Workspace Foundation And Material Owner Read.md`

Current landed umbrella closeout:
- `Properties-1` is now structurally complete

Current landed shared-shell follow-on:
- `Properties-2` is now complete as the first runtime shell ladder

Current next family-level handoff:
- `Properties-3 - View And Render Presentation Controls` for the render/presentation control organization question

Current render/presentation prep read:
- `Properties-3 / Phase 1` is complete as a docs-only ViewSettings inventory pass.
- `Properties-3 / Phase 2` is complete as the first runtime grouping/readback pass.
- `Properties-3 / Phase 3` is complete as the first Environment Grade controls and Clay Studio locked-policy pass.
- `Properties-3 / Phase 4` is complete as the View Toolbar Shadows/Ground parity pass.
- `Properties-3 / Phase 5` is planned as the Grid presentation controls and layer-system pass.
- Properties `Render` should organize future controls into `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, `Grid`, and `Render Preview Quality`.
- Clay Studio grade, hard-shadow, and ground/contact behavior should be treated as preset-owned runtime readback until a later phase deliberately changes that policy.

Current next Properties render/presentation phase:
- `Properties-3 / Phase 5 - Grid Presentation Controls And Layer System`

Current Phase 2 prep read:
- implement against `src/app/workspace/PropertiesRenderSection.tsx`
- keep the existing active controls for `Viewport Style`, Ambient Occlusion, and Render Preview quality
- add `Environment`, `Shadows`, and `Ground` as readback/status groups only
- do not add active `environmentGrade`, `shadowsEnabled`, or `ground` writes until later phases explicitly own those behavior decisions
- keep Clay Studio grade, hard-shadow, ground, and contact treatment as Model Viewport runtime preset-owned behavior for this pass

Current Phase 2 landed read:
- Properties `Render` now visibly separates `Viewport Presentation`, `Environment`, `Shadows`, `Ground`, and `Render Preview Quality`.
- `Viewport Style`, Ambient Occlusion, and Render Preview quality still write the same existing `ViewSettings` fields.
- `Environment`, `Shadows`, and `Ground` are passive readback/status groups only.
- Phase 3 still owns any active Environment Grade policy/control change.

Current Phase 3 prep read:
- first-pass Clay Studio policy is `Preset Locked`
- Standard mode should expose active Environment Grade sliders in Properties `Render`
- Clay Studio should keep the existing `Viewer.ts` `CLAY_STUDIO_ENVIRONMENT_GRADE` override
- Clay Studio grade controls should be locked/read-only with clear copy instead of silently editing a value that does not affect the Clay Studio look
- reuse the existing grade field set from `ViewToolbar`: `Exposure`, `Contrast`, `Highlights`, `Shadows`, `Whites`, `Blacks`, `Temperature`, `Tint`, and `Saturation`
- preserve `uiPrefsStore.setEnvironmentGrade(...)` normalization and persistence
- do not move environment preset/source, HDRI, lighting, look memory, or A/B compare controls into Properties in Phase 3

Current Phase 3 landed read:
- Properties `Render > Environment` now exposes the existing Environment Grade field set: `Exposure`, `Contrast`, `Highlights`, `Shadows`, `Whites`, `Blacks`, `Temperature`, `Tint`, and `Saturation`.
- Standard mode grade sliders write through the existing `uiPrefsStore.setEnvironmentGrade(...)` normalization path.
- Clay Studio keeps the grade controls disabled and reads as `Preset Locked`.
- `Viewer.ts` still owns the Clay Studio runtime grade override.
- Environment preset/source, HDRI, lighting, look memory, A/B compare, and offset math remain out of scope.

Current Phase 4 prep read:
- Standard mode should expose the existing saved View Toolbar shadow controls in Properties `Render > Shadows`: `Shadows`, selected-light `Cast Shadow`, `Shadow Bias`, and `Shadow Map`.
- Standard mode should expose the existing saved View Toolbar ground controls in Properties `Render > Ground`: `Ground`, `Ground Height`, and `Material`.
- Reuse the existing View Toolbar labels, material preset options, environment-light history helpers, and `groundEditHistory` undo helpers where possible.
- Clay Studio should keep the Shadows and Ground groups visible but locked/read-only because it suppresses hard shadows, forces ground on, retains saved height, uses a preset material, and owns contact treatment in `Viewer.ts`.
- Do not add a `Ground Contact` control, new `ViewSettings` field, or Clay Studio contact-shadow runtime change in Phase 4.
- Focus implementation proof on Properties shadow and ground controls writing only `ViewSettings.shadowsEnabled`, selected-light shadow fields, and `ViewSettings.ground`.

Current Phase 4 landed read:
- Properties `Render > Shadows` now exposes the View Toolbar `Shadows`, selected-light `Cast Shadow`, `Shadow Bias`, and `Shadow Map` controls.
- Properties `Render > Ground` now exposes the View Toolbar `Ground`, `Ground Height`, and `Material` controls.
- Standard-mode shadow and ground controls write the existing `ViewSettings` and selected-light fields without changing viewer runtime behavior.
- Clay Studio keeps the copied Shadows and Ground controls disabled/read-only and reads as `Preset Locked`.
- Ground contact remains preset-owned with no new user setting.

Current Phase 5 planning read:
- Add a new Properties `Render > Grid` section after `Ground` and before `Render Preview Quality`.
- Move the current View Toolbar `Grid` checkbox into Properties as a `ParaSelect` with `Off` / `On`.
- Add a grid height/offset control for the visible presentation grid without changing ground, sketch planes, graph geometry, or export truth.
- Treat the current viewer grid runtime as three user-facing layers: `Grid 1` for minor spacing, `Grid 2` for major spacing, and `Grid 3` for double-major spacing.
- First implementation should use a bounded three-layer model before supporting unlimited custom grid layers.
- Suggested per-layer controls are `On` / `Off`, spacing, color, opacity/visual weight, and small height offset.
- True pixel line width should be deferred unless the grid renderer moves to a fat-line implementation, because common WebGL line width support is unreliable.
- Clay Studio should keep grid suppression preset-owned unless a later Clay Studio policy phase changes that.

Current Phase 5 prep read:
- Keep `ViewSettings.gridVisible` as the canonical top-level `Grid` on/off setting.
- Add `ViewSettings.gridPresentation` for grid height, grid size, and exactly three normalized layers.
- Default `gridPresentation` should reproduce the live viewer grid: size `300`, height `0`, `Grid 1` spacing `1` opacity `0.1`, `Grid 2` spacing `10` opacity `0.3` height offset `0.001`, and `Grid 3` spacing `50` opacity `1` height offset `0.002`.
- Do not add `gridPresentation.enabled`; that would create a second on/off owner beside `gridVisible`.
- Carry `gridPresentation` through the existing view-settings persistence policy paths in `uiPrefsPersistence.ts`.
- Update `Viewer.ts` through a narrow grid-helper sync/rebuild path instead of touching sketch working grids or graph geometry.
- Disable or lock Properties grid controls while Clay Studio is active, but do not mutate saved grid settings.
- First implementation should keep the View Toolbar checkbox unless removing it is trivial after the shared `gridVisible` path is proven.
- Focus proof on Properties scoped writes, settings normalization/persistence, viewer layer rendering defaults/customization, Clay Studio suppression, production build, and `git diff --check`.

Current sibling runtime handoff:
- `Properties / Materials`

Current next implementation phase inside that handoff:
- `Materials-1 / Phase 1 - Focused Object Intake And Current Material Truth Read`

Current live prep read for that handoff:
- inherit focused object intake from the now-landed shared shell contract
- map the current typed material truth and mutation seams without overclaiming them as the final owner model
- define the first lane-local read model before target-list or property-edit behavior widens

Current next child-lane runtime handoff after that shell foundation:
- `Materials-1`

### Vision

`Properties` should be the workspace family for editing the currently focused item's inspectable and editable property groups.

The healthy Generation 1 read is:
- `Properties` is a real workspace surface under the shared hybrid workspace model
- the workspace is driven by focused object or item context
- the workspace is sectioned by property group rather than pretending one flat panel is enough forever
- `Materials` is the first active property group and should not be mistaken for the entire final family
- the workspace must stay downstream from the real owner systems for each property group

Important boundary rule:
- if a question is about materials-specific workflow, use the nested `Materials` docs
- if a question is about the broader focused-item property workspace direction, use this index until a future `Properties-Vision.md` exists
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc or the nested subfamily docs

## Wishlist Organization

### High Level Goals

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] `Properties-Gen1-HLG-6. Properties should be able to host workspace-level view/render presentation controls without becoming the owner of viewer runtime behavior.`

### Codex Level Goals

- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-2. Route the moved `Materials` docs as the first nested subfamily under that umbrella.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-4. Create one standalone `Properties-1` family phase doc when the umbrella needs implementation-ready follow-through beyond the nested materials lane.
- [ ] Properties-Gen1-CLG-5. Create one shared-shell follow-on family phase so nested property-group lanes can mount into a real `Properties` workspace surface before child-lane runtime behavior widens.
- [ ] Properties-Gen1-CLG-6. Create one view/render presentation controls family phase so `Viewport Style`, Ambient Occlusion, Environment Grade Controls, ground/contact presentation, and Render Preview quality can be organized under Properties `Render`.

### `Properties-1`

- [ ] Create the standalone `Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md` Family Phase Doc.
- [ ] Define the umbrella workspace boundary between `Properties` and its first nested `Materials` subfamily.
- [ ] Keep the first umbrella phase structural instead of competing with the nested materials planning lane.
- [ ] Leave room for later property-group subfamilies without forcing them into this first pass.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] `Properties-Gen1-HLG-5`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-2.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-4.

Landed read:
- `Properties-1` is now complete as the structural umbrella closeout
- future candidates such as `Transform` stay reservation-only
- the next shared runtime foundation now belongs to `Properties-2`

### `Properties-2`

- [ ] Create the standalone `Future/Properties-2 - Shared Properties Workspace Shell And Section Hosting.md` Family Phase Doc.
- [x] Mount the real shared `Properties` workspace shell before child-lane runtime behavior widens.
- [x] Make focused-item context enter once at the shell level and flow down into hosted sections.
- [x] Make `Materials` the first hosted property-group section without collapsing the whole workspace into one hard-coded lane.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] `Properties-Gen1-HLG-5`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-5.

### `Properties / Materials`

- [ ] Keep the current materials-specific vision and generation routing under `Properties/Materials/`.
- [ ] Let materials-specific runtime planning continue through the nested subfamily docs instead of flattening it back into the umbrella.
- [ ] Use `Materials` as the first proof that the `Properties` umbrella can host a real property-group workspace lane.
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] Properties-Gen1-CLG-2.
- [ ] Properties-Gen1-CLG-3.

### `Properties-3`

- [x] Create the standalone `Future/Properties-3 - View And Render Presentation Controls.md` Family Phase Doc.
- [x] Organize the existing and planned `ViewSettings` presentation controls under Properties `Render`.
- [x] Keep `Model Viewport` as the viewer runtime owner.
- [x] Decide how Clay Studio should interact with Environment Grade Controls.
- [x] Move View Toolbar Shadows and Ground settings into Properties `Render`.
- [x] Keep Render Preview quality controls visually separate from interactive viewport presentation controls.
- [ ] Plan and implement the Properties `Render > Grid` section with a bounded `Grid 1` / `Grid 2` / `Grid 3` layer model.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-5`
- [ ] `Properties-Gen1-HLG-6`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-6.

### Phase Prep Notes

- the first umbrella phase should stay about family shape and routing, not heavy runtime work
- the next family-level follow-on should be the shared `Properties-2` shell before nested child-lane runtime behavior widens
- materials-specific implementation planning should continue in the nested `Materials` docs
- later property-group subfamilies should only be added when they are real enough to justify their own planning surface

## [x] `Properties-1` - `Workspace Umbrella And Focused-Item Property Routing`

### Family Phase Summary

Create the first implementation-planning surface for the new `Properties` workspace umbrella.

This phase should make the umbrella shape and nested-subfamily routing concrete before broader runtime implementation starts.

The first family phase should stay small:
- one umbrella workspace boundary
- one focused-item property-editing routing answer
- one explicit relationship to the nested `Materials` subfamily
- no fake all-at-once properties architecture

Landed read:
- the umbrella meaning is explicit
- the focused-item entry rule is explicit
- the no-overlap handoff into the nested `Materials` lane is explicit
- later lanes such as `Transform` remain reservation-only
- the next family-level implementation handoff is now `Properties-2`

### HLG / CLG Coverage

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-2. Route the moved `Materials` docs as the first nested subfamily under that umbrella.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-4. Create one standalone `Properties-1` family phase doc when the umbrella needs implementation-ready follow-through beyond the nested materials lane.

### Owns

- the first `Properties` workspace umbrella read
- the first focused-item property-editing family boundary
- the routing relationship between the umbrella and the nested `Materials` subfamily

### Does Not Own

- the full materials-specific workflow, which belongs in `Properties/Materials/`
- the complete runtime properties system
- later property-group subfamilies that are not yet real enough to plan honestly

## [x] `Properties-2` - `Shared Properties Workspace Shell And Section Hosting`

### Family Phase Summary

Create the first runtime-ready shared shell for the `Properties` workspace.

This phase should make the shell and section-hosting contract concrete before the nested `Materials-1` runtime lane begins.

The second family phase should stay shell-first:
- one shared workspace mount
- one focused-item shell-level read
- one section or tab host for nested child lanes
- one clean handoff into `Materials-1`

Current landed read:
- `Phase 1` mounted the real shared `Properties` workspace shell and focused-target entry seam.
- `Phase 2` turned that shell into a real hosted-section frame with `Materials` as the first active section and default tab.
- `Phase 3` closed the shell with an explicit section-facing contract plus shell-owned empty, unsupported, and no-section states.
- the next active runtime handoff now belongs to `Materials-1`.

### HLG / CLG Coverage

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-5. Create one shared-shell follow-on family phase so nested property-group lanes can mount into a real `Properties` workspace surface before child-lane runtime behavior widens.

### Owns

- the first shared `Properties` workspace shell
- the first section-hosting contract for nested property-group lanes
- the family-level handoff into `Materials-1`

### Does Not Own

- materials-specific owner mapping and field behavior
- the full runtime material system
- future property-group subfamilies that are not yet honest to plan
