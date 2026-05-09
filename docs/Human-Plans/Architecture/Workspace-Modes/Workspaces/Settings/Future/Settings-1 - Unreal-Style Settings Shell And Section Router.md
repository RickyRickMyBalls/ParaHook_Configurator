# Settings 1 - Unreal-Style Settings Shell And Section Router

## Doc Header

### Doc History
10. 2026-05-07 15:10:23: Updated the later Settings ladder so `Phase 4 - General and Workspace controls` now explicitly includes a user-facing slider for shared workspace fillet radius, giving the `Workspace 9` corner shell one Settings-owned visual preference source instead of a permanent hard-coded radius.
9. 2026-05-07 15:06:41: Updated the live Settings-1 ladder guidance so the core owner-backed control phases stay here while the new cross-mode `Settings-2` family can own the dedicated `Key Bindings` shortcut-reference section.
1. 2026-05-02 08:35:43: Created the first Settings family phase doc so the workspace can start with the Unreal-style left-rail and right-detail shell instead of widening directly into specific setting semantics.
2. 2026-05-02 08:35:43: Tightened the first Settings slice into an implementation-ready shell-and-router pass with explicit first-code-cut, likely-file, and verification guidance.
3. 2026-05-02 08:54:16: Marked Settings-1 complete after the shell, section rail, All-first behavior, and right-pane projection shipped, then handed the remaining work to later owner-backed Settings phases.
4. 2026-05-02 08:54:16: Re-centered the Settings ladder back into this single doc and added internal Phase 2 and Phase 3 lanes so the family can keep growing without splitting the ownership surface again.
5. 2026-05-02 09:18:22: Marked Phase 2 complete after the Spaghetti Editor defaults became owner-backed, editable, persistent, and history-aware.
6. 2026-05-02 09:18:22: Expanded the internal Settings ladder with later owner-backed phases for the remaining section groups so the workspace can keep becoming editable without splitting the family again.
7. 2026-05-02 09:25:42: Prepped Phase 3 for implementation by tightening the float-window `I` menu scope, file targets, and verification shape without touching runtime code.
8. 2026-05-02 09:39:15: Marked Phase 3 complete after wiring floating-window Settings shortcuts into the workspace and making contextual section launches land on the requested Settings section.

### Purpose

This doc owns the first implementation-planning slice for the `Settings` workspace family.

Use it to answer:
- what the first Settings shell should look like
- how the left section rail should behave
- how the right detail pane should respond to section selection
- how to keep the workspace narrow and honest before individual setting owners are wired in

Do not use it for:
- final settings ownership semantics
- the complete app-wide settings catalog
- changing the meaning of the underlying settings values
- turning Settings into a second Home Page or debug inspector

## Doc Body

### Short Version

The first Settings pass should create a full-height two-column workspace:
- a narrow left section rail
- a larger right detail pane
- `All` as the first entry in the left rail
- the right pane showing all settings when `All` is selected
- the right pane showing one section's settings when a specific section is selected

The surface should feel like a clean structured store or Unreal Engine settings page, not a generic property dump.

### Scope

This phase owns:
- the first Settings workspace shell
- the section list / detail pane split
- `All` as the first section
- section selection state and routing
- the first full-height layout contract
- the first settings projection surface
- the first shell-level selection model for the section rail

This phase does not own:
- the meaning of the settings themselves
- the storage or runtime owners behind each setting
- final category naming
- a complete settings taxonomy
- any separate settings search system unless it is needed for the shell itself
- a full settings editor for every owner-backed control

### Core Layout Direction

The shell should read like two cells in one row:
- left cell:
  - narrow
  - about 15 percent of the width
  - or about 100px wide as the first design target
  - section navigation only
- right cell:
  - the settings content area
  - full height
  - shows the selected section or the `All` view

Important rule:
- the section list is the navigator
- the content pane is the reader/editor projection
- the workspace should not invent new setting ownership just to fill the pane
- the split should stay honest even if some sections are initially sparse

### Section List Direction

The first list should be simple and familiar.

Suggested initial sections:
- `All`
- `General`
- `Workspace`
- `Viewport`
- `Browser`
- `Console`
- `Appearance`
- `Input`
- `Key Bindings`
- `Advanced`

Important rule:
- the exact list can evolve later
- the `All` entry should stay first
- the list should remain short enough to scan quickly
- later section rows should be additive, not a reason to change the shell contract

### Phase Ladder Direction

The core owner-backed settings controls can stay in this roadmap doc, but cross-mode surfaces may split into their own family phase when that keeps ownership clearer.

Suggested internal ladder after the shipped shell:
- `Phase 2` - Spaghetti Editor window default settings
- `Phase 3` - float-window `I` menu settings and per-window defaults
- `Phase 4` - General and Workspace controls, including shared workspace fillet radius
- `Phase 5` - Viewport and Appearance controls
- `Phase 6` - Browser, Console, and other shell-owned surface controls
- `Phase 7` - Storage, Input, and Advanced controls plus any remaining owner-backed cleanup

Important rule:
- each phase should stay small enough to implement and verify cleanly
- prefer owner-backed control groups over arbitrary visual section splits
- if a section still has no real owner, keep it read-only until a later phase gives it one
- if a cross-mode section needs its own planning lane, split it into a separate `Settings-N` family doc instead of overloading this ladder
- shared workspace-corner fillet radius should count as a Settings-owned workspace visual preference, not as ad hoc local state in the `Workspace 9` pane shell

### Ownership Boundary

The Settings workspace should stay downstream from the real owners.

That means:
- if a setting belongs to another owner system, the right pane projects it
- the workspace should not absorb the real setting state into local UI state
- navigation may be local
- setting meaning stays with the owning system
- if a setting has no owner yet, the right pane should show that clearly instead of inventing a fake control

## Wishlist Organization

### High Level Goals

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

## [x] `Settings-1` - `Phase 1 - Shell, Section Rail, And Detail Pane`

### Phase 1 Summary

Create the first visible Settings workspace shell.

This phase should prove:
- the workspace surface exists
- the left rail is the section list
- `All` is first
- the right pane shows the current section content
- the layout stays tall and easy to scan

Implementation readiness target:
- this phase should fit inside one Codex-sized pass
- the first code cut should prove the layout, section routing, and `All` default read before any broader settings taxonomy work begins

### Phase 1 Implementation Spec

#### Purpose

Build the first Unreal-style settings workspace shell with a narrow section rail and a full-height detail pane.

#### Owns

- Settings workspace shell placement
- left section navigation rail
- `All` as the first entry
- right detail pane routing
- first-pass full-height two-column layout
- store-like browsing presentation
- the first shell-level selection model for the section rail

#### Does Not Own

- the semantics of every setting value
- the final settings catalog
- a second Home Page
- settings search as a separate product
- owner-seam changes for the actual preference sources
- a full settings editor for every owner-backed control

#### Current Live Read

There is now a dedicated Settings workspace surface in code.

The phase-1 shell exists as the Unreal Engine-style split:
- narrow left rail
- full-height right pane
- `All` first
- section-driven browsing of settings content
- a read-only projection surface that stays separate from the owner systems

The current repo-wide rule that matters here is still the same:
- workspace-shell code should stay separate from the owners of the underlying setting values
- later phases should widen the owner-backed settings content, not collapse the shell boundary

#### First Pass Decisions

1. Keep the shell simple and legible.
2. Make `All` the default top row in the left rail.
3. Keep the right pane as a projection of the selected section.
4. Keep the layout narrow and full height.
5. Avoid creating new settings ownership in the shell.
6. Keep the first section list stable enough that later rows can be added without changing the shell contract.
7. Prefer explicit sparse or empty reads over inventing settings that do not yet have a real owner.

#### First Code Cut

The first implementation pass should:
- introduce the `Settings` workspace surface route or shell entry
- render the left rail and right detail pane as two full-height cells
- seed the section list with `All` first
- route the right pane by the currently selected section
- show the full settings projection when `All` is selected
- keep the shell read-only with respect to the underlying setting values

That cut should stop after the section-router and layout proof.

#### Likely Files

- a new Settings workspace surface component or route
- a new section list helper or view model
- a right-pane settings projection helper
- focused workspace-surface tests
- a narrow workspace-surface registry or navigation seam if the app needs one for the new surface
- a small settings section model or descriptor file if the UI needs a stable first section list

#### No-Widening Rule

- do not absorb the underlying settings owners into the workspace shell
- do not widen into a complete settings taxonomy
- do not widen into preference persistence changes
- do not turn the surface into a generic inspector
- do not add search, favorites, advanced filtering, or section editing in the first cut
- do not rehome unrelated app-preference logic into the workspace just to make the pane look full

#### Verification Shape

- focused workspace-surface tests for the shell and section routing
- layout proof for the full-height split
- a basic `All` default-read test
- a visual or snapshot proof that the left rail remains narrow and the right pane fills the remaining height
- a focused check that switching away from `All` changes only the right-side projection, not the shell structure

#### Done Shape

- Settings opens as a real workspace surface
- the left rail behaves like a section list
- `All` is the first section
- the right pane shows the selected section or the full settings read
- the shell stays downstream from the owner systems
- the first phase can safely hand off later work for real setting sections without revisiting the shell contract

## [x] `Settings-1` - `Phase 2 - Spaghetti Editor Window Default Settings`

### Phase 2 Summary

Add the owner-backed default settings for the Spaghetti Editor window.

This phase should make the editor window's startup values explicit and configurable through the Settings workspace instead of hiding them in shell constants.

### Phase 2 Implementation Spec

#### Purpose

Surface the Spaghetti Editor window defaults as a real Settings section and connect them to the underlying owner systems.

#### Owns

- the Spaghetti Editor window default-settings owner seam
- the initial default values for the editor window
- the Settings projection for those defaults
- the first rows for editor-window density and startup behavior

#### Does Not Own

- the float-window `I` menu
- the generic settings section rail
- unrelated workspace sections
- settings persistence systems beyond what the window defaults need

#### Current Live Read

The shell exists, so this phase can now focus on the editor window's default values instead of the layout.

The key rule is the same:
- if the editor window has a real owner for a default value, surface that owner
- if a default is hardcoded today, this phase should prepare the seam that removes the hidden default
- do not widen into per-float-window menu work yet

#### First Pass Decisions

1. Make the editor defaults easy to find in Settings.
2. Keep the defaults owner-backed instead of duplicating state.
3. Keep the editor defaults separate from the per-window `I` menu.
4. Use the existing Settings section rail rather than inventing a second surface.

#### First Code Cut

The first implementation pass should:
- define the Spaghetti Editor window default-settings owner seam
- project the default values into the Settings workspace
- keep the controls separate from the float-window `I` menu
- preserve the current shell layout and section-routing behavior

#### Verification Shape

- focused workspace-surface tests for the editor-default section
- a basic owner-backed default-read test
- a check that the Settings shell layout stays unchanged

#### Done Shape

- the Spaghetti Editor defaults are visible in Settings
- the defaults stay owned by their real systems
- the shell is not widened beyond the intended editor-default section

## [ ] `Settings-1` - `Phase 3 - Float Window I Menu Settings And Per-Window Defaults`


## [ ] `Settings-1` - `Phase 4 - General And Workspace Controls`

### Phase 4 Summary

Turn the `General` and `Workspace` sections into real editable settings groups.

This phase should cover the shared startup and workspace-shell preferences that already have clear owners or can be safely made owner-backed next.

### Phase 4 Implementation Spec

#### Purpose

Expose the general app and workspace controls directly in Settings without widening the whole surface at once.

#### Owns

- startup-surface controls
- workspace persistence controls
- workspace shell layout defaults that are already owned by the app store or workspace store
- the first editable `General` and `Workspace` rows

#### Does Not Own

- viewport projection or environment controls
- browser-specific chrome or presentation controls
- per-window float controls beyond what the workspace shell already owns

#### Current Live Read

The shell and Spaghetti defaults now exist, so this phase can focus on the shared app-and-workspace layer.

#### First Pass Decisions

1. Keep the editable rows limited to settings with clear owners.
2. Preserve the section rail and All-first behavior.
3. Make the changed rows feel like real settings controls, not debug toggles.

#### First Code Cut

The first implementation pass should:
- wire the editable `General` rows to their real preference owners
- wire the editable `Workspace` rows to their real workspace owners
- keep unowned rows clearly read-only or deferred

#### Verification Shape

- focused tests for the editable General and Workspace rows
- a check that the Settings shell remains intact while the content becomes interactive

#### Done Shape

- `General` and `Workspace` stop reading as placeholder rows
- the section content becomes meaningfully editable
- the shell still behaves like the same Unreal-style settings workspace

## [ ] `Settings-1` - `Phase 5 - Viewport And Appearance Controls`

### Phase 5 Summary

Turn the `Viewport` and `Appearance` sections into real editable settings groups.

This phase should cover view state, display preferences, and other viewport-owned controls that already have a clear runtime owner.

### Phase 5 Implementation Spec

#### Purpose

Expose the viewport-facing controls in Settings without mixing them into unrelated workspace or browser settings.

#### Owns

- viewport projection controls
- overlay and axis presentation controls
- appearance controls that belong to the view or editor chrome

#### Does Not Own

- browser-only presentation controls
- storage policies
- general startup/workspace layout controls

#### First Pass Decisions

1. Keep viewport controls together.
2. Keep appearance controls readable and sectioned.
3. Prefer existing owner seams over introducing new settings state.

#### Verification Shape

- focused tests for viewport and appearance edits
- a check that the Settings page still routes by section cleanly

#### Done Shape

- `Viewport` and `Appearance` become interactive, owner-backed sections
- view-state controls remain separate from workspace and browser concerns

## [ ] `Settings-1` - `Phase 6 - Browser And Console Controls`

### Phase 6 Summary

Turn the `Browser` and `Console` sections into real editable settings groups.

This phase should surface the browser shell presentation controls and any console-facing settings that already have a direct owner seam.

### Phase 6 Implementation Spec

#### Purpose

Expose the browser and console shell controls in Settings as first-class editable sections.

#### Owns

- browser presentation mode settings
- browser floating / dock behavior where the browser store already owns the truth
- console-facing preferences that are already owner-backed

#### Does Not Own

- viewport ownership
- storage policies
- general startup or workspace shell defaults

#### First Pass Decisions

1. Keep browser controls separate from viewport controls.
2. Keep console controls separate from broader storage/advanced preferences.
3. Reuse the existing store and shell owners instead of inventing new ownership.

#### Verification Shape

- focused tests for browser and console edits
- a check that the Settings surface still respects the section rail contract

#### Done Shape

- `Browser` and `Console` become interactive sections
- the browser shell settings stay owner-backed
- the Settings workspace is now visibly more than a read-only projection

## [ ] `Settings-1` - `Phase 7 - Storage, Input, Advanced, And Cleanup`

### Phase 7 Summary

Finish the remaining settings surface area and clean up any leftover owner-backed controls.

This phase should handle the lower-priority sections and any remaining settings that are now safe to expose after the earlier editable lanes are in place.

### Phase 7 Implementation Spec

#### Purpose

Finish the owner-backed Settings ladder and resolve the remaining section rows.

#### Owns

- storage-related settings controls
- input-related settings controls
- advanced settings controls
- any leftover honest read-only rows that need a real owner or a clearer deferred state

#### Does Not Own

- the core shell contract
- previously completed phase ownership
- broad new settings semantics that should become their own future family if they grow too large

#### First Pass Decisions

1. Keep the remaining sections honest and intentionally scoped.
2. Use this phase for the long tail rather than moving the shell contract again.
3. Split out any unexpectedly large sub-area into a future Settings family only if needed.

#### Verification Shape

- focused tests for the remaining settings groups
- a final smoke check that the Settings workspace now reads as a real editable surface

#### Done Shape

- the remaining sections are either editable or honestly deferred
- the Settings workspace no longer feels read-only as a whole
- the roadmap has a complete internal ladder for the owner-backed control work, while later cross-mode follow-ons can split into their own Settings family phase when needed


### Phase 3 Summary

Add the per-window settings surface that hangs off the `I` menu on each float window.

This phase should make the float-window controls consistent and reusable while still staying local to the active window.

Implementation readiness target:
- this phase should fit inside one Codex-sized pass
- the first code cut should prove the `I` menu launches the correct scoped controls and shares the same owner-backed values as the Settings workspace

### Phase 3 Implementation Spec

#### Purpose

Make the `I` menu act like the scoped settings launcher and local projection surface for the current float window.

#### Owns

- the `I` menu on float-window title bars
- per-window settings routing from the title bar into Settings
- active-window-scoped settings projection
- the first local settings controls that belong to the float window itself

#### Does Not Own

- the global Spaghetti Editor default settings
- the general settings section rail
- unrelated workspace menus
- broad window-management behavior that is not really a settings concern

#### Current Live Read

The editor-default phase should land first, then this phase can reuse that owner-backed truth for float-window controls.

The key rule is the same:
- if the current float window has a settings owner, route to it
- if the menu only needs to preview the local value, do that directly
- do not widen into broad app settings until the window-specific menu surface is stable

#### First Pass Decisions

1. Keep the `I` menu scoped to the active float window.
2. Reuse the same owner-backed defaults already surfaced in the Settings workspace.
3. Keep the menu controls local to the float window instead of inventing a second global settings browser.
4. Limit the first cut to the menu launch, local projection, and shared value read/write seam.

#### Likely Files

- the float-window title-bar control component that renders the `I` button or menu trigger
- the float-window host or shell that owns the menu open state
- a small scoped settings projection helper for the current float window
- focused title-bar / float-window settings tests
- a narrow workspace-surface or routing seam if the `I` menu needs to open the shared Settings surface directly

#### No-Widening Rule

- do not widen into general app-wide settings sections
- do not duplicate the Spaghetti Editor default store
- do not invent a second owner for the same float-window values
- do not add search, favorites, or global settings discovery in the first cut
- do not widen into unrelated workspace-shell controls just because the menu is reachable from a title bar

#### First Pass Decisions

1. Keep the `I` menu scoped to the active float window.
2. Route the menu into the matching Settings section or projection.
3. Reuse the same owner-backed values as the Settings workspace.
4. Do not turn the menu into a generic app-settings launcher.

#### First Code Cut

The first implementation pass should:
- define the `I` menu surface for float windows
- project the active float window's settings into that menu
- connect the menu to the matching Settings section
- keep the existing Settings shell and editor-default behavior intact

#### Verification Shape

- focused workspace-surface tests for the `I` menu projection
- a basic active-window-scoped settings test
- a check that the Settings workspace and menu share the same values
- a smoke test that the menu still behaves correctly when no float-window settings panel is open

#### Done Shape

- every float window has a useful local `I` menu for its own settings
- the `I` menu stays owner-backed and scoped
- the float-window settings surface and Settings workspace share the same truth
- the float-window controls can be implemented without changing the Settings shell contract
