# Settings Gen1 Index

## Doc Header

### Doc History
1. 2026-05-02 08:35:43: Added the new active Settings Generation 1 planning index so the Unreal-style settings workspace has a dedicated left-rail/right-pane routing surface and a first phase path for the shell and section router.
2. 2026-05-02 08:35:43: Marked `Settings-1` as the next implementation-ready slice and added phase-prep notes for the one-slice shell-and-router cut.
3. 2026-05-02 08:54:16: Marked `Settings-1` complete, added the follow-on `Settings-2` and `Settings-3` phases for Spaghetti Editor defaults and float-window `I` menu settings, and widened the Generation 1 ladder so the settings workspace can finish as a real owner-backed surface.
4. 2026-05-02 08:54:16: Collapsed the separate `Settings-2` and `Settings-3` docs back into `Settings-1` so the family keeps one source of truth with three internal phases instead of three separate phase docs.
5. 2026-05-02 09:18:22: Expanded `Settings-1` with later internal phases for the remaining owner-backed section groups so the workspace can become editable section by section without splitting the family again.
6. 2026-05-02 09:25:42: Prepped `Settings-1` Phase 3 for implementation by tightening the float-window `I` menu scope, first-pass file targets, and verification shape.
7. 2026-05-02 09:39:15: Marked `Settings-1` Phase 3 complete after wiring floating-window Settings shortcuts into the workspace and making contextual section launches land on the requested Settings section.

### Purpose

This file is the active `Generation 1` planning index for the `Settings` workspace family under `Workspace Modes`.

Use it to answer:
- how the Settings workspace vision becomes family phases
- which Generation 1 goals are preserved from `Settings-Vision.md`
- what the first Settings family phase should be
- how the left section rail and right detail pane should stay separate
- how the workspace should stay owner-backed instead of becoming a preference junk drawer

Do not use it for:
- broad Settings north-star ownership that belongs in `Settings-Vision.md`
- later Settings generations after a dedicated `Settings-GenN-Index.md` exists
- implementation-phase specs that belong in standalone `Future/` family phase docs
- changing the meaning of the underlying setting values

### Family Structure

Use this folder like this:

- `Settings-Vision.md`
  - broad north-star product and ownership direction
- `Settings-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Future/`
  - standalone implementation-ready `Settings` family phase docs
- `Shipped/`
  - shipped records for completed `Settings` cuts

## Doc Body

### Short Version

`Settings` should become a real workspace surface for browsing and changing user-facing settings.

The first experience should feel like a compact Unreal Engine-style settings page:
- a narrow left rail of sections
- `All` at the top
- a full-height right pane that shows settings content
- a store-like, category-driven navigation model

The first family lane is `Settings-1`.

`Settings-1` should prove the shell and section-router foundation first:
- register `Settings` as a real workspace surface
- render a full-height two-column layout
- keep the left rail narrow and easy to scan
- make `All` the first section
- route the right pane by section selection
- keep the settings owner systems outside the workspace itself

### Current Planning Read

This file owns the active `Generation 1` family-phase routing.

Current legal family-phase ladder:
- `Settings-1` - Unreal-style settings shell, section rail, and detail pane

`Settings-1` is the family doc for the whole Settings ladder.
It now contains three internal implementation phases:
- `Phase 1` - shell, section rail, and detail pane
- `Phase 2` - Spaghetti Editor window default settings
- `Phase 3` - float-window `I` menu settings and per-window defaults

`Phase 1` is complete.
`Phase 2` is complete.
`Phase 3` is complete.
Later phases now stay inside the same doc:
- `Phase 4` - General and Workspace controls
- `Phase 5` - Viewport and Appearance controls
- `Phase 6` - Browser and Console controls
- `Phase 7` - Storage, Input, Advanced, and cleanup

Important planning rule:
- use this index to choose and bound the next `Settings-N` family phase
- use a matching standalone `Future/` family phase doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone

## Vision

`Settings-Vision.md` remains the broad north-star.

This Generation Index Doc owns the current `Generation 1` family-phase routing read.

The healthy Generation 1 read is:
- `Settings` is a real workspace surface rather than a hidden preferences drawer
- the left rail is a section list, not the content surface itself
- `All` is the first section and works as the default reset view
- the right pane shows the full settings list or the selected section's settings
- the left rail should stay narrow, visually stable, and full height
- the surface should feel structured and store-like, not like an unorganized dump of controls
- settings values should stay owned by their real systems, with the workspace acting as the navigation and projection surface

Important boundary rule:
- if a question is about the broad `Settings` purpose, use `Settings-Vision.md`
- if a question is about current `Generation 1` family-phase order, use this index
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc

## Wishlist Organization

### High Level Goals

The canonical human-level goals live in `Settings-Vision.md` under `## Vision > ### Human Level Goals`.

This index repeats them so current `Generation 1` family-phase routing stays readable.

- [ ] `Settings-Gen1-HLG-1. Settings should be a real workspace surface like Unreal Engine settings.`
- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-4. The layout should feel like two full-height cells with the left rail about 15% or 100px wide.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`

### Codex Level Goals

- [ ] Settings-Gen1-CLG-1. Add a dedicated Settings workspace shell with a left section rail and right settings-detail pane.
- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-4. Keep the left rail narrow and full-height so the layout feels like Unreal Engine settings.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.

### `Settings-1`

- [x] Create the standalone `Future/Settings-1 - Unreal-Style Settings Shell And Section Router.md` Family Phase Doc.
- [x] Register or plan the real workspace surface route for `Settings`.
- [x] Define the first section list with `All` as the first entry.
- [x] Define the narrow left-rail and full-height right-pane layout.
- [x] Define the section-routing boundary for the settings detail pane.
- [x] Keep the owner systems separate from the settings workspace shell.
- [x] Keep the first pass focused on the shell, section list, and right-pane projection.
- [x] Tighten the first implementation pass into a one-slice shell-and-router cut.
- [x] `Settings-Gen1-HLG-1`
- [x] `Settings-Gen1-HLG-2`
- [x] `Settings-Gen1-HLG-3`
- [x] `Settings-Gen1-HLG-4`
- [x] `Settings-Gen1-HLG-5`
- [x] `Settings-Gen1-HLG-6`
- [x] Settings-Gen1-CLG-1.
- [x] Settings-Gen1-CLG-2.
- [x] Settings-Gen1-CLG-3.
- [x] Settings-Gen1-CLG-4.
- [x] Settings-Gen1-CLG-5.

### Phase Prep Notes

- the first implementation cut should stop after the shell, section rail, and right-pane routing proof
- later sections can be added after the layout contract and `All` default behavior are stable
- keep `Phase 2` focused on the Spaghetti Editor window defaults before the float-window menu work widens the shell
- keep `Phase 3` focused on the per-float-window `I` menu controls after the default editor settings are honest
- keep later phases inside `Settings-1` so the remaining owner-backed sections can be added without splitting the family again

## [x] `Settings-1` - `Unreal-Style Settings Shell And Section Router`

### Family Phase Summary

Create the first implementation-planning surface for the new `Settings` workspace.

This phase should make the Unreal-style settings shape concrete before any runtime implementation starts.

The first family phase should stay small:
- a narrow left section rail
- `All` as the first section
- a full-height right detail pane
- a store-like settings browsing feel
- no ownership of the underlying setting semantics

### HLG / CLG Coverage

- [x] `Settings-Gen1-HLG-1. Settings should be a real workspace surface like Unreal Engine settings.`
- [x] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [x] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [x] `Settings-Gen1-HLG-4. The layout should feel like two full-height cells with the left rail about 15% or 100px wide.`
- [x] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [x] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`
- [x] Settings-Gen1-CLG-1. Add a dedicated Settings workspace shell with a left section rail and right settings-detail pane.
- [x] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [x] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [x] Settings-Gen1-CLG-4. Keep the left rail narrow and full-height so the layout feels like Unreal Engine settings.
- [x] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.

### Owns

- first workspace-surface onboarding plan for `Settings`
- left section rail direction
- `All` as the first section
- full-height right detail pane direction
- narrow split-layout guidance for the Unreal-style settings surface
- first focused verification shape for the workspace shell and router

### Does Not Own

- the meaning of each individual setting
- the actual persistence or runtime owner seams for app preferences
- changing the underlying settings data model just to make the UI simpler
- a second Home Page
- a generic catch-all inspector

### Planning Read

The first future doc should begin from the user-described layout:
- one narrow left list of settings sections
- one large right content cell
- `All` first
- the rest of the section list grows from the actual settings the app exposes

The first implementation should prefer a clean navigation-plus-projection path:
- if a setting already has a real owner, project it into the right pane
- if a setting does not yet have a real owner, show that honestly instead of inventing ownership
- keep the surface store-like and category driven
- do not widen into preference semantics or hidden owner changes

### Family Phase Doc

- [x] `Future/Settings-1 - Unreal-Style Settings Shell And Section Router.md`
