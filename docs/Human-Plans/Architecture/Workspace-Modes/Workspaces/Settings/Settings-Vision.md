# Settings Vision

## Doc Header

### Doc History
1. 2026-05-02 08:35:43: Created this Settings family vision doc so the new workspace has one stable planning home for an Unreal Engine-style settings surface with a narrow left section rail and a full-height right detail pane.

### Purpose

This doc captures the broad long-range vision for the `Settings` workspace in ParaHook.

Use it to answer:
- what the `Settings` surface is supposed to be for
- how the section list and detail pane should relate
- how the first Settings workspace should feel visually and structurally
- how Settings should stay separate from the systems that actually own the setting values

Do not use it for:
- one specific implementation checklist
- pretending the actual settings list is already final
- turning Settings into a second Home Page
- moving ownership of app preferences into the workspace itself

## Doc Body

### Why This Doc Exists

ParaHook needs a dedicated workspace for user-configurable settings.

The user described the target feel clearly:
- the layout should be like Unreal Engine settings
- the left side should be a narrow list of setting sections
- the right side should show the selected section's settings
- the first left option should be `All`
- the whole surface should behave like a structured store or settings browser, not a junk drawer

This doc keeps that direction honest before the first implementation phase gets written.

### Core Shape

The intended first surface is a two-column layout:
- left column:
  - a section list
  - roughly 15 percent of the width
  - or about 100px wide as the first visual target
- right column:
  - the settings content area
  - shows all settings when `All` is selected
  - shows only the chosen section when a specific section is selected

Important rule:
- the left rail is navigation
- the right pane is the settings reader/editor surface
- neither side should turn into a hidden second owner of the underlying setting values

### Long-Range Direction

`Settings` should become the place where the user can scan and change ParaHook preferences in a structured way.

The surface should feel:
- calm
- category-driven
- easy to scan
- closer to a product settings page than a raw inspector
- closer to Unreal Engine's settings navigation than to a flat preferences dump

The first list can start small and grow over time.
Likely early sections:
- `All`
- `General`
- `Workspace`
- `Viewport`
- `Browser`
- `Console`
- `Appearance`
- `Input`
- `Advanced`

Important rule:
- the exact section list can evolve
- the layout contract should stay stable

### Ownership Boundary

`Settings` should not own the meaning of each setting.

It should:
- present settings by section
- route the user to the right owner-backed control
- project the current value into the right-hand pane
- keep the navigation model simple and predictable

It should not:
- invent new preference semantics
- absorb unrelated application state
- become a catch-all settings dump
- replace the actual owner systems that own the setting values

## Vision

### Human Level Goals

- [ ] `Settings-Gen1-HLG-1. Settings should be a real workspace surface like Unreal Engine settings.`
- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-4. The layout should feel like two full-height cells with the left rail about 15% or 100px wide.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`

### Generation Routing

The first useful generation is `Generation 1`.

Generation 1 should route into:
- `Settings-Gen1-Index.md`

Generation 1 should focus on:
- the Settings workspace shell
- the left section rail
- the right detail pane
- the `All` first-row behavior
- the first store-like settings browsing experience

