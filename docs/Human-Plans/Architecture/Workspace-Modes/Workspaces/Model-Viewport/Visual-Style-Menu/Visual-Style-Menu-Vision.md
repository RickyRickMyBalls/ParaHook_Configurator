# Visual Style Menu Vision

## Doc Header

### Doc History
1. 2026-05-21 20:59:19: Created this vision doc as the dedicated family home for the model viewport visual-style menu, starting from the shipped `Shift+D` radial menu, center edge controls, Clay Studio entry, and Hidden Line edge option.

### Purpose

This doc defines the long-range direction for the Model Viewport visual-style menu family.

Use it for:
- preserving the desired shape of the `Shift+D` visual-style radial menu
- deciding whether future quick visual choices belong in the radial menu, Properties `Render`, or another owner
- keeping display modes, render presets, and geometry display edge recipes understandable as one user-facing quick switch

Do not use it for:
- changing graph geometry truth
- owning Properties `Render` detailed controls
- replacing the wider Model Viewport display-mode, topology, or Clay Studio runtime docs

## Doc Body

### Family Intent

The Visual Style Menu should be the fast model-viewport presentation switch.

It should let the user quickly choose how the current visible geometry is drawn without implying that the menu owns geometry, build state, export truth, or project content.

The family starts from the shipped `Shift+D` radial menu:
- outer visual choices for display modes and built-in viewport styles
- center edge controls for edge visibility and edge recipes
- active-state readback that matches the current view settings

### What Must Stay True

- `Shift+D` is a quick presentation surface, not a geometry owner.
- Visual changes from the menu should stay rebuild-free whenever possible.
- Display mode choices, render presets, and Geometry Display edge recipes should read as related visual-style choices instead of separate magic switches.
- Properties `Render` remains the slower tuning and detailed readback home.
- The menu should reuse shared view-setting helpers and Geometry Display recipes rather than creating parallel hidden state.
- Hidden or custom-looking states should read back honestly without turning every edit into a permanent saved preset system.

### Current Shipped Baseline

- `Model-Viewport-3 / Phase 2` shipped the first `Shift+D` radial menu for display modes.
- `Model-Viewport-4 / Phase 6` added center edge controls for `On`, `Off`, and `Visible edges only`.
- `Model-Viewport-5 / Phase 2.1` added `Clay Studio` as a quick style entry.
- `Properties-4 / Phase 2` moved Shift+D and Properties toward shared built-in preset selection behavior.
- `Properties-6 / Phase 5.2` through `Phase 5.6` made `Hidden Line` a real Geometry Display edge recipe with custom readback behavior.
- `Model-Viewport-3 / Shift+D Hidden Line Edge Option` added `Hidden line` as the fourth center edge option.

### Generation Routing

#### Generation 1

Generation 1 should organize and polish the shipped visual-style menu into a coherent family:
- document the current menu shape
- keep center edge options aligned with Geometry Display recipes
- clarify which visual choices should stay quick actions versus detailed Properties controls
- prepare follow-up cleanup only where the current radial menu starts to feel crowded or ambiguous

#### Later Generations

Later generations may handle:
- saved custom visual styles
- richer radial layout or grouping if the option count grows
- workspace-wide visual-style consistency across multiple model viewports
- human-readable docs for the visual-style menu once the runtime behavior stabilizes

## Human Level Goals

### Generation 1 HLG

- [ ] `Visual-Style-Menu-Gen1-HLG-1. The Shift+D visual menu should be easy to understand as one quick place for viewport style choices.`
- [ ] `Visual-Style-Menu-Gen1-HLG-2. Edge choices in the menu should match the real Geometry Display recipes users can tune in Properties.`
- [ ] `Visual-Style-Menu-Gen1-HLG-3. The menu should stay fast and rebuild-free, while Properties remains the detailed tuning surface.`

