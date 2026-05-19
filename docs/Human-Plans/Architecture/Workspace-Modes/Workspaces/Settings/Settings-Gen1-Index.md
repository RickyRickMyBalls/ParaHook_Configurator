# Settings Gen1 Index

## Doc Header

### Doc History
25. 2026-05-19 08:20:51: Added `Settings-3 / Phase 8 - Lowercase Console Commands And Highlighted Shortcut Input` to the open Settings lane so lowercase typed command language, uppercase highlighted-choice shortcut input, conflict-safe visible hints, and Settings Key Bindings readout alignment can be planned without creating a second Console command owner.
24. 2026-05-18 22:02: Marked the cross-family `Model-Viewport-4 / Phase 8` Settings handoff shipped after the Settings `Viewport` section gained owner-backed highlight color and intensity controls while the model-viewport/view-settings contract kept ownership of the highlight meaning and runtime behavior.
23. 2026-05-18 21:22: Added a cross-family planning note that `Model-Viewport-4 / Phase 8 - Hover And Selection Highlight Hierarchy` may add a Settings `Viewport` highlight styling group while keeping highlight meaning and persistence owned by the model-viewport/view-settings contract instead of making Settings the hidden owner.
22. 2026-05-17 12:29:14: Marked `Settings-3 / Phase 7 - Staged Console Input Priority Tree` complete after the future doc recorded the visible staged `Settings > KeyBindings > ConsoleInput > On/Off` path, direct Root `ConsoleInput` shortcut, owner-backed preference mutation, flat command retirement, focused verification, and no shortcut-routing or Settings UI widening.
21. 2026-05-17 11:57:57: Prepped `Settings-3 / Phase 7 - Staged Console Input Priority Tree` in the family phase doc with concrete staged scope/action ids, direct Root `ConsoleInput` behavior, owner-backed mutation rules, flat-command retirement guidance, and focused verification expectations.
20. 2026-05-13 10:09:18: Added `Settings-3 / Phase 7 - Staged Console Input Priority Tree` to the family ladder so the next input-priority command pass uses the visible no-space staged path `Root > Settings > KeyBindings > ConsoleInput > On/Off` plus direct Root `ConsoleInput` entry instead of the earlier flat space-separated command shape.
19. 2026-05-13 07:03:07: Marked `Settings-3 / Phase 6 - Console Input Priority Command` complete after the future doc recorded the `consolefirst` typed command, compact aliases, owner-backed preference mutation, status feedback, focused parser and ConsoleDock coverage, and no routing or key-binding UI widening.
18. 2026-05-11 17:46:18: Marked `Settings-3 / Phase 5 - Shortcut Priority Hardening And Handoff` complete after the future doc recorded final input-priority routing regression coverage, targeted Console side-effect proof, and the handoff from the first Console input-priority setting to later `Settings-2` key-binding visibility and rebinding work.
17. 2026-05-11 17:35:50: Marked `Settings-3 / Phase 4 - Input Priority Routing` complete after the future doc recorded Console-first printable capture preservation, Console-first `Shift+Z`, Shortcuts-first plain `Z`, Shortcuts-first `C` Console entry without seeding text, focused routing/Console verification, and build proof.
16. 2026-05-11 17:21:55: Marked `Settings-3 / Phase 3 - Settings Console Input Priority Control` complete after the future doc recorded the General-section Console-first toggle, All/General read row projection, history-backed preference mutation, focused Settings tests, and no-routing boundary.
15. 2026-05-11 16:56:10: Marked `Settings-3 / Phase 2 - Console Input Priority Preference Contract` complete after the future doc recorded the persisted `consoleInputPriorityMode` preference, `console-first` default, `shortcuts-first` support, focused tests, build verification, and no-routing/no-UI boundary.
14. 2026-05-11 16:47:28: Corrected the `Settings-3` Console typing-capture overview into the Console-first versus Shortcuts-first input-priority model, clarifying that Console-first keeps plain letters for Console typing while shortcuts use `Shift+letter`, and Shortcuts-first lets plain letters trigger shortcuts while `C` enters Console.
13. 2026-05-10 14:02:14: Marked `Settings-3 / Phase 1 - Console Capture Owner Audit` complete after the future doc recorded the verified automatic Console capture route, proposed preference read seam, manual `C` owner split, priority rules, and follow-on test targets without changing runtime code.
12. 2026-05-10 13:52:11: Added `Future/Settings-3 - Open Settings Additions And Owner-Backed Toggles.md` and expanded the `Settings-3` ladder into five first implementation phases for Console capture audit, preference contract, Settings control projection, manual `C` routing, and shortcut-priority hardening.
11. 2026-05-10 13:46:31: Added the open `Settings-3` family phase as a flexible lane for small owner-backed Settings additions that can be implemented one by one, seeding the first candidate around Console typing-capture mode so auto-capture can later be separated from shortcut-friendly manual Console entry.
10. 2026-05-07 15:42:03: Re-audited the new `Settings-2` ladder for Codex-sized execution, splitting the broader shortcut-reference work into five smaller phases for inventory source mapping, shared read-model normalization, section-entry routing, grouped pane rendering, and final deep-link or drift-hardening follow-through.
9. 2026-05-07 15:10:23: Updated the active Settings Generation 1 ladder so the later owner-backed workspace controls now explicitly include a fillet-radius slider for shared workspace pane corners, keeping that visual preference routed through the Settings workspace instead of hard-coding one permanent radius in the `Workspace 9` shell.
8. 2026-05-07 15:06:41: Added the new `Settings-2` family phase, created the matching `Future/Settings-2 - Key Bindings And Mode Shortcut Reference.md` planning doc, and reopened the Generation 1 ladder so Settings can gain a dedicated mode-aware shortcut reference section without overloading the existing owner-backed control ladder inside `Settings-1`.
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

The next family lane is `Settings-2`.

`Settings-2` should add the first dedicated `Key Bindings` section:
- list shortcuts by mode or surface context
- keep the read organized enough to scan quickly
- reuse the same Settings shell instead of inventing a second shortcut browser
- stay downstream from the systems that actually define shortcut behavior

The next open-ended family lane is `Settings-3`.

`Settings-3` should stay available for smaller Settings additions that do not need a whole new workspace family yet:
- capture focused user-requested settings as separate implementation phases
- keep each setting owner-backed instead of turning Settings into the owner
- leave room for one-by-one Codex implementation passes
- start with Console input-priority mode so users can choose between Console-first command typing and Shortcuts-first letter shortcuts

### Current Planning Read

This file owns the active `Generation 1` family-phase routing.

Current legal family-phase ladder:
- `Settings-1` - Unreal-style settings shell, section rail, and detail pane
- `Settings-2` - Key Bindings and mode shortcut reference
- `Settings-3` - Open miscellaneous Settings additions and owner-backed toggles

`Settings-1` remains the family doc for the shell plus the current owner-backed control ladder.
It now contains three internal implementation phases:
- `Phase 1` - shell, section rail, and detail pane
- `Phase 2` - Spaghetti Editor window default settings
- `Phase 3` - float-window `I` menu settings and per-window defaults

`Phase 1` is complete.
`Phase 2` is complete.
`Phase 3` is complete.
Later owner-backed control phases still stay inside the same doc:
- `Phase 4` - General and Workspace controls, including shared workspace fillet radius
- `Phase 5` - Viewport and Appearance controls
- `Phase 6` - Browser and Console controls
- `Phase 7` - Storage, Input, Advanced, and cleanup

`Settings-2` is the new cross-mode follow-on family doc.
It should own the dedicated `Key Bindings` section and the first shortcut inventory read:
- `Phase 1` - shortcut inventory source map
- `Phase 2` - shared shortcut read model and mode normalization
- `Phase 3` - `Key Bindings` section entry and routing
- `Phase 4` - grouped shortcut pane rendering
- `Phase 5` - context launch, drift hardening, and follow-on boundary

`Settings-3` is an open follow-on family phase.
It should collect focused Settings additions that the user wants to implement one at a time:
- `Phase 1` - Console capture owner audit
- `Phase 2` - Console input-priority preference contract
- `Phase 3` - Settings Console input-priority control
- `Phase 4` - input priority routing
- `Phase 5` - shortcut priority hardening and handoff
- `Phase 6` - Console input-priority command
- `Phase 7` - staged Console input-priority tree
- `Phase 8` - lowercase Console commands and highlighted shortcut input
- later phases - user-added Settings controls, grouped only when a narrower owner family is not justified yet

Important planning rule:
- use this index to choose and bound the next `Settings-N` family phase
- use a matching standalone `Future/` family phase doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone
- keep shared workspace pane fillet radius as a Settings-owned workspace visual preference instead of hard-coding it inside the `Workspace 9` shell
- cross-family owner-backed controls may be implemented from the owning family doc when the setting meaning clearly belongs elsewhere; `Model-Viewport-4 / Phase 8` shipped a Settings `Viewport` highlight styling group while the model-viewport/view-settings contract owns the highlight values and behavior

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
- shortcut visibility should be grouped by mode or surface context instead of scattered across separate menus or notes
- miscellaneous Settings additions should be phaseable one at a time while still naming the real owner system for each setting
- Console shortcut cleanup should keep lowercase command text and uppercase highlighted-choice shortcuts as two inputs into the same owner-backed Console choice model instead of creating another command layer

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
- [ ] `Settings-Gen1-HLG-7. Settings should include a Key Bindings section that lists shortcuts clearly by mode and surface context.`
- [ ] `Settings-Gen1-HLG-8. Settings should provide a safe lane for small user-requested controls that can be implemented one by one without losing owner boundaries.`

### Codex Level Goals

- [ ] Settings-Gen1-CLG-1. Add a dedicated Settings workspace shell with a left section rail and right settings-detail pane.
- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-4. Keep the left rail narrow and full-height so the layout feels like Unreal Engine settings.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-6. Add a dedicated `Key Bindings` settings section that groups shortcuts by mode or surface context without inventing a new shortcut owner.
- [ ] Settings-Gen1-CLG-7. Add an open `Settings-3` family lane for small owner-backed Settings controls, beginning with the Console input-priority mode toggle.

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

### `Settings-2`

- [x] Create the standalone `Future/Settings-2 - Key Bindings And Mode Shortcut Reference.md` Family Phase Doc.
- [ ] Identify the first live shortcut-owner seams before any Settings UI rendering begins.
- [ ] Define the shared shortcut read model and stable mode labels before grouped rendering starts.
- [ ] Add the `Key Bindings` section entry as its own narrow routing slice inside the existing Settings shell.
- [ ] Render the grouped right-pane shortcut read as a separate follow-on after routing is stable.
- [ ] Keep deep-link and drift-hardening work as a final hardening slice instead of bundling it into the first render pass.
- [ ] Reuse the real shortcut owners or registries instead of inventing a second shortcut source of truth in Settings.
- [ ] Keep the right pane readable when one mode has many shortcuts and another has only a few.
- [ ] `Settings-Gen1-HLG-2`
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-2.
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-6.

### `Settings-3`

- [ ] Keep `Settings-3` open as a flexible family phase for focused Settings additions that can be implemented one at a time.
- [x] Create a standalone `Future/Settings-3 - Open Settings Additions And Owner-Backed Toggles.md` Family Phase Doc when the first implementation slice is ready.
- [x] Seed `Phase 1` around Console input-priority mode:
  - Console-first mode keeps the current behavior where printable keys can enter the Console after workspace interaction
  - Console-first mode routes letter shortcuts through `Shift+letter`, such as `Shift+Z` for `Zoom object`
  - Shortcuts-first mode lets normal letters such as `Z` become shortcuts
  - Shortcuts-first mode should use `C` as the deliberate Console entry key before free typing enters the Console
- [x] Use `Settings-3 / Phase 1` to audit the current Console capture owner path before code changes.
- [x] Use `Settings-3 / Phase 2` to add the typed owner-backed preference and preserve the current default.
- [x] Use `Settings-3 / Phase 3` to project the preference into Settings.
- [x] Use `Settings-3 / Phase 4` to honor Console-first `Shift+letter` shortcut routing and Shortcuts-first plain-letter plus `C` Console-entry routing.
- [x] Use `Settings-3 / Phase 5` to harden priority and record the key-binding handoff.
- [x] Use `Settings-3 / Phase 6` to expose the same input-priority preference through a typed Console command.
- [x] Use `Settings-3 / Phase 7` to move Console input-priority control into the visible no-space staged Console tree.
- [ ] Use `Settings-3 / Phase 8` to plan lowercase typed Console command text, uppercase highlighted-choice shortcut input, conflict-safe visible hints, and Settings Key Bindings readout alignment.
- [x] Keep the Console input-priority setting owned by the Console/input-routing preference seam, with Settings only projecting and changing that preference.
- [ ] Leave later `Settings-3` phases open for user-added controls instead of pretending this index already knows every random Settings item.
- [ ] Keep each later phase small enough for one Codex implementation pass.
- [ ] `Settings-Gen1-HLG-2`
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-8`
- [ ] Settings-Gen1-CLG-2.
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-7.

### Phase Prep Notes

- the first implementation cut should stop after the shell, section rail, and right-pane routing proof
- later sections can be added after the layout contract and `All` default behavior are stable
- keep `Phase 2` focused on the Spaghetti Editor window defaults before the float-window menu work widens the shell
- keep `Phase 3` focused on the per-float-window `I` menu controls after the default editor settings are honest
- keep the later owner-backed control sections inside `Settings-1` unless a cross-mode surface like `Key Bindings` needs a separate family doc to stay honest
- keep `Settings-3` available for focused user-requested controls that are too concrete for the broad vision but too scattered to deserve a new family yet

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
- [x] `Future/Settings-2 - Key Bindings And Mode Shortcut Reference.md`
- [x] `Future/Settings-3 - Open Settings Additions And Owner-Backed Toggles.md`

## [ ] `Settings-2` - `Key Bindings And Mode Shortcut Reference`

### Family Phase Summary

Create the first dedicated `Key Bindings` planning surface for the Settings workspace.

This phase should make shortcut visibility feel like a real settings section instead of scattered discoverability hints:
- a dedicated `Key Bindings` entry in the Settings section list
- a right-pane shortcut read grouped by mode or surface context
- clear mode labels so the user can tell where a shortcut applies
- no shortcut ownership drift away from the systems that already define the bindings

### HLG / CLG Coverage

- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`
- [ ] `Settings-Gen1-HLG-7. Settings should include a Key Bindings section that lists shortcuts clearly by mode and surface context.`
- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-6. Add a dedicated `Key Bindings` settings section that groups shortcuts by mode or surface context without inventing a new shortcut owner.

### Owns

- the dedicated `Key Bindings` family-phase planning lane
- the first shortcut inventory read inside Settings
- the mode-aware grouping direction for the right-pane shortcut reference
- the first shortcut-context labels and Settings-entry routing rules
- the implementation-ready follow-on phases for shortcut visibility work

### Does Not Own

- changing shortcut behavior just to make the UI simpler
- full shortcut rebinding semantics unless a later phase explicitly owns that widening
- hidden per-mode local registries that duplicate the real shortcut owners
- unrelated owner-backed settings sections that still belong in `Settings-1`

### Planning Read

The next future doc should begin from the user-described goal:
- one `Key Bindings` section inside Settings
- one readable list of shortcuts
- one clear explanation of which mode or surface each shortcut belongs to

The first implementation should prefer a clean read-first path:
- if a shortcut already has a real owner or registry, project it
- if a mode still has no honest shortcut catalog, show that clearly instead of inventing one
- keep the section mode-aware and easy to scan
- do not widen into full rebinding or conflict-resolution flows in the first cut

The implementation ladder should stay small enough for Codex to execute one slice at a time:
- first map the live owners
- then normalize the shared read model
- then add the Settings entry point
- then render the grouped pane
- then harden deep links and drift checks

## [ ] `Settings-3` - `Open Settings Additions And Owner-Backed Toggles`

### Family Phase Summary

Keep one flexible Settings family phase open for small user-requested controls that should be implemented one at a time.

This phase exists so Settings can keep growing without forcing every small preference into a new architecture family:
- a user can add one desired Settings control at a time
- each control still names its real owner system
- Settings remains the projection and editing surface, not the hidden owner
- later `Settings-2` key-binding work can benefit from shortcut-friendly preferences without being blocked by them
- Console shortcut cleanup can be planned beside Key Bindings readout work while Console still owns command parsing and staged choice resolution

### HLG / CLG Coverage

- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`
- [ ] `Settings-Gen1-HLG-8. Settings should provide a safe lane for small user-requested controls that can be implemented one by one without losing owner boundaries.`
- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-7. Add an open `Settings-3` family lane for small owner-backed Settings controls, beginning with the Console input-priority mode toggle.

### Owns

- an open planning lane for small Settings additions
- owner-backed toggle and control requests that do not yet justify a narrower family
- the first planned Console input-priority mode setting
- the next planned lowercase-command and uppercase-highlighted-shortcut cleanup
- one-by-one implementation phase routing for user-added Settings controls

### Does Not Own

- full shortcut rebinding, which belongs to the `Settings-2` / later key-binding lane
- changing shortcut behavior without naming the input-routing or feature owner seam
- turning Settings into the source of truth for values owned by Console, workspace, viewport, Browser, or other systems
- bundling many unrelated Settings controls into one implementation pass
- turning highlighted shortcut input into a second runtime command system

### Planning Read

`Settings-3` started with the Console input-priority setting.

The first user-facing behavior was:
- Console-first mode keeps the current quick-console behavior where normal printable keys can enter the Console after workspace interaction
- Console-first mode makes letter shortcuts use `Shift+letter`, such as `Shift+Z` for `Zoom object`
- Shortcuts-first mode lets the model viewport and other surfaces keep ordinary letters available for shortcuts, such as plain `Z`
- Shortcuts-first mode uses `C` as the deliberate Console entry key before free typing enters the Console

The next planned behavior is:
- lowercase full command text becomes the normal typed Console command language
- uppercase input chooses one of the highlighted visible command shortcuts
- highlighted shortcuts resolve through the same staged Console choice model as full command text
- Settings Key Bindings explains the rule without owning command parsing or duplicating the Console choice registry

The implementation plan should stay honest:
- store the preference in the existing UI/settings preference owner area
- route global printable capture through that preference
- keep direct Console input focus working in both modes
- keep editable fields native
- keep higher-priority tool, camera, and viewport shortcuts ahead of Console capture
- add focused tests for Console-first plain typing, Console-first `Shift+letter` shortcuts, Shortcuts-first plain-letter shortcuts, Shortcuts-first `C` Console entry, editable fields, and shortcut priority
- for Phase 8, lock the choice contract first, then implement uppercase shortcut matching and Settings readout as one narrow follow-on
