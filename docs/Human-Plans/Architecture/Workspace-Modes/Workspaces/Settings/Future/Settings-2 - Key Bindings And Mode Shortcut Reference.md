# Settings 2 - Key Bindings And Mode Shortcut Reference

## Doc Header

### Doc History
2. 2026-05-07 15:42:03: Re-audited this family phase doc for Codex-sized execution and split the broader shortcut-reference ladder into five smaller phases for source mapping, read-model normalization, section-entry routing, grouped pane rendering, and final deep-link or drift-hardening follow-through.
1. 2026-05-07 15:06:41: Created this `Settings-2` family phase doc so the Settings workspace can gain a dedicated `Key Bindings` section that lists shortcuts by mode and surface context without inventing a second shortcut owner.

### Purpose

This doc owns the dedicated `Key Bindings` family phase for the `Settings` workspace.

Use it to answer:
- how the `Key Bindings` section should appear inside the existing Settings shell
- how shortcuts should be grouped by mode or surface context
- how the right pane should read when one mode has many bindings and another has only a few
- how Settings should stay downstream from the systems that already define shortcut behavior

Do not use it for:
- changing shortcut semantics just to make the list cleaner
- full rebinding, shortcut conflict resolution, or profile management unless a later phase explicitly owns that widening
- a separate shortcut browser outside the Settings workspace
- unrelated owner-backed settings sections that still belong in `Settings-1`

## Doc Body

### Short Version

`Settings-2` should add a dedicated `Key Bindings` section to the Settings workspace.

That section should:
- list shortcuts clearly
- group them by mode or surface context
- explain where each shortcut applies
- stay readable when some modes are dense and others are sparse
- reuse the real shortcut owners instead of inventing a second shortcut source of truth

The first pass should be read-first.

It should prove:
- the Settings section exists
- the right pane can group shortcuts by mode
- each shortcut row can explain the command plus the active keys
- the section stays downstream from the real shortcut owners

Important planning rule:
- keep each implementation phase small enough that Codex can execute it in one pass
- split source mapping, data normalization, routing, rendering, and hardening into separate phases instead of bundling them together

### Scope

This phase owns:
- the dedicated `Key Bindings` settings section
- the first shortcut inventory read in the Settings right pane
- the grouping model for shortcuts by mode or surface context
- mode labels, section headings, and empty-state language for shortcut visibility
- the first context-launch rules if another surface should deep-link into `Key Bindings`

This phase does not own:
- a full shortcut rebinding system
- per-mode shortcut persistence changes that are not already owned elsewhere
- hidden local copies of shortcut registries
- unrelated Settings sections such as `General`, `Workspace`, or `Viewport`
- broad input-device configuration beyond what is needed to explain shortcuts honestly

### Current Planning Read

The Settings shell already exists and can route to dedicated sections.

What is still missing is one honest place where the user can answer:
- what shortcuts exist
- which mode they belong to
- whether the same key means different things in different contexts

The healthy first read is:
- `Key Bindings` becomes one explicit row in the Settings section rail
- the right pane groups shortcuts by mode or surface context
- each group uses stable labels such as `Browser`, `Spaghetti Editor`, `Viewport`, or later equivalent live mode names
- sparse groups stay visible instead of being hidden just because they have fewer shortcuts
- missing or not-yet-cataloged shortcut areas are shown honestly as deferred rather than guessed

### Ownership Boundary

The Settings workspace should read shortcut truth from the real owners.

That means:
- if a mode already has a shortcut registry or canonical definition, project it
- if shortcut text is currently scattered, this phase should define the first honest read contract without pretending the duplication is solved
- Settings may organize and label the read
- Settings should not become a hidden new shortcut owner

Important rule:
- visibility first
- ownership drift never

## Vision

`Settings-2` belongs to `Settings` Generation 1.

This family phase exists so the Settings workspace can become a clearer navigation surface for command discoverability, not just value editing.

The intended user-facing promise is:
- open `Settings`
- click `Key Bindings`
- scan shortcuts by mode
- immediately tell where a shortcut applies

What must stay true:
- the section should feel like part of the same Unreal-style Settings surface
- the grouping should be mode-aware instead of one flat unsorted command wall
- the right pane should stay readable before any later rebinding work exists
- the systems that actually define the shortcut behavior should keep owning that behavior

## Wishlist Organization

### High Level Goals

- [ ] `Settings-Gen1-HLG-2. Settings should use a left rail of categories with All first.`
- [ ] `Settings-Gen1-HLG-3. The right side should show all settings or the selected section's settings.`
- [ ] `Settings-Gen1-HLG-5. The surface should feel like a store-like settings browser, not a junk drawer.`
- [ ] `Settings-Gen1-HLG-6. Settings should stay downstream from the owner systems that actually own each setting value.`
- [ ] `Settings-Gen1-HLG-7. Settings should include a Key Bindings section that lists shortcuts clearly by mode and surface context.`

### Codex Level Goals

- [ ] Settings-Gen1-CLG-2. Make `All` the first category and let it show the full settings surface by default.
- [ ] Settings-Gen1-CLG-3. Keep settings content as a projection over the real owner systems instead of a new preference owner.
- [ ] Settings-Gen1-CLG-5. Keep the surface store-like and section-driven, not a flat catch-all page.
- [ ] Settings-Gen1-CLG-6. Add a dedicated `Key Bindings` settings section that groups shortcuts by mode or surface context without inventing a new shortcut owner.

### `Settings-2 / Phase 1`

- [ ] Identify the first live shortcut-owner seams for the modes or surfaces that already expose bindings.
- [ ] Record which areas still have only inline or fragmented shortcut truth.
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-6.

### `Settings-2 / Phase 2`

- [ ] Define the shared shortcut read model for command label, key chord, and mode label.
- [ ] Decide the first stable group labels, ordering rules, and deferred-state language for mode-aware reads.
- [ ] Keep the first pass read-only unless a binding is already owner-editable elsewhere.
- [ ] Show deferred or uncataloged shortcut areas honestly instead of guessing.
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-6.

### `Settings-2 / Phase 3`

- [ ] Add the `Key Bindings` entry to the Settings section rail.
- [ ] Route the existing Settings shell cleanly into the dedicated `Key Bindings` section.
- [ ] Keep this slice focused on entry and routing, not full grouped content rendering.
- [ ] `Settings-Gen1-HLG-2`
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-2.
- [ ] Settings-Gen1-CLG-6.

### `Settings-2 / Phase 4`

- [ ] Render the right-pane shortcut read with clear mode or surface grouping.
- [ ] Keep the section readable when the number of shortcuts varies heavily across modes.
- [ ] Use stable row language for command name, key chord, and mode label.
- [ ] Preserve honest empty and deferred states in the visible pane.
- [ ] `Settings-Gen1-HLG-3`
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-6.

### `Settings-2 / Phase 5`

- [ ] Tighten any deep-link or context-launch behavior into the `Key Bindings` section.
- [ ] Add drift-hardening checks so Settings does not silently diverge from the real shortcut owners.
- [ ] Decide whether any later rebinding work should stay here or split into a later Settings family.
- [ ] `Settings-Gen1-HLG-5`
- [ ] `Settings-Gen1-HLG-6`
- [ ] `Settings-Gen1-HLG-7`
- [ ] Settings-Gen1-CLG-3.
- [ ] Settings-Gen1-CLG-5.
- [ ] Settings-Gen1-CLG-6.

## [ ] `Settings-2 / Phase 1` - `Shortcut Inventory Source Map`

### Phase 1 Summary

Map the first honest source of shortcut truth for visible modes and surfaces.

This phase should identify where the current shortcut truth lives before any shared read model or UI rendering starts.

### Phase 1 Implementation Spec

#### Purpose

Establish one clear source map for shortcut inventory before the Settings UI starts normalizing or rendering a mode-grouped shortcut surface.

#### Owns

- the first shortcut inventory source map
- the first honest owner-area list for shortcut truth
- the first explicit note about fragmented or inline-only shortcut areas

#### Does Not Own

- the shared shortcut read model itself
- the visible Settings `Key Bindings` pane
- full rebinding semantics

#### Current Live Read

The Settings shell exists, but shortcut discoverability is still likely fragmented across the app's mode-specific surfaces.

This phase should ground the future ladder against the live shortcut owners before any shared grouping rules become sticky.

#### First Pass Decisions

1. Prefer one explicit owner map over ad hoc inline shortcut strings.
2. Record fragmentation honestly before trying to normalize it away.
3. Keep this slice read-only and discovery-focused.
4. Stop before defining the final Settings read shape.

#### Exact First Code Cut

The first implementation pass should:
- identify the first shortcut owner seams
- record which surfaces still lack one honest shortcut owner
- stop before defining the shared read model or rendering the Settings section UI

#### Likely Files

- the Settings section descriptor or settings category model
- one shortcut inventory selector, registry adapter, or owner-map helper
- focused tests for the source map

#### No-Widening Rule

- do not introduce a second shortcut registry
- do not define the final visible group layout yet
- do not add rebinding UI
- do not widen into unrelated input-device configuration

#### Implementation Risks

- some shortcut truth may still live as inline definitions instead of one central read
- some modes may expose actions but not one explicit registry surface
- this read can tempt premature normalization before the owner map is honest

#### Checklist

- [ ] identify the first live shortcut owner seams
- [ ] record fragmented or inline-only shortcut areas
- [ ] define the first owner map for later phases

#### Verification Shape

- focused tests for the source map or owner-read helper
- a proof that at least one mode can be read without duplicate source-of-truth logic
- a check that fragmented areas remain explicit instead of being silently skipped

#### Done Shape

- the shortcut inventory source map is explicit
- the next phase can normalize one shared read model without guessing the owners
- the visible Settings section can be built later without inventing shortcut ownership

## [ ] `Settings-2 / Phase 2` - `Shared Shortcut Read Model And Mode Normalization`

### Phase 2 Summary

Define the shared read model that later UI phases will consume.

This phase should turn the Phase 1 owner map into one stable contract for command label, key chord, mode label, ordering, and deferred-state behavior.

### Phase 2 Implementation Spec

#### Purpose

Create one shared shortcut read model before the Settings shell starts routing or rendering the `Key Bindings` pane.

#### Owns

- the shared shortcut read model
- mode-label normalization
- group ordering rules
- deferred-state and empty-state language for uncataloged areas

#### Does Not Own

- the visible Settings section entry
- grouped pane rendering
- full rebinding semantics

#### Current Live Read

Once the owner map exists, the next risk is drifting into UI work before the shape of the shortcut read is stable.

This phase should make the later routing and rendering work consume one clean contract.

#### First Pass Decisions

1. Treat mode or surface context as the primary grouping axis.
2. Normalize labels only enough to support one stable read.
3. Keep the contract read-only unless a binding is already owner-editable elsewhere.
4. Preserve explicit deferred reads where shortcut coverage is incomplete.

#### Exact First Code Cut

The first implementation pass should:
- define one shared read model for command label, key chord, and mode label
- define group ordering and deferred-state language
- stop before adding the Settings section entry or grouped pane rendering

#### Likely Files

- one shortcut inventory selector, registry adapter, or view-model helper
- a small label or grouping helper if mode names need normalization
- focused tests for the shared read contract

#### No-Widening Rule

- do not add the visible `Key Bindings` section yet
- do not add rebinding UI
- do not force every mode to adopt one final schema beyond what the shared read needs
- do not widen into unrelated input-device configuration

#### Implementation Risks

- mode labels may differ across surfaces and need a first normalization pass
- shared ordering rules can hide real owner differences if they are too aggressive
- deferred-state language can become vague if it is not tied to the Phase 1 owner map

#### Checklist

- [ ] define the shared shortcut read model
- [ ] define stable mode labels and ordering rules
- [ ] define deferred-state and empty-state language
- [ ] keep the contract read-only

#### Verification Shape

- focused tests for the shared read model
- a proof that at least two mode reads can normalize into one contract
- a check that deferred groups remain explicit

#### Done Shape

- the shared shortcut read contract is explicit
- later routing and rendering phases can consume one stable model
- no visible Settings UI has widened ahead of the contract

## [ ] `Settings-2 / Phase 3` - `Key Bindings Section Entry And Routing`

### Phase 3 Summary

Add the dedicated `Key Bindings` section entry to the Settings shell.

This phase should make the Settings shell route into `Key Bindings` cleanly, without yet bundling in the full grouped pane rendering work.

### Phase 3 Implementation Spec

#### Purpose

Add the `Key Bindings` section to the Settings surface and route into its dedicated pane using the shared read contract from Phase 2.

#### Owns

- the `Key Bindings` row in the Settings section rail
- the Settings-shell routing into the `Key Bindings` pane
- the first dedicated empty or placeholder pane state for the section entry

#### Does Not Own

- grouped shortcut row rendering
- new shortcut semantics
- conflict-resolution UI

#### Current Live Read

Once the shared read contract exists, the next narrow slice is the Settings-shell entry and routing seam.

The section should feel native to the existing Settings shell:
- one section rail entry
- one dedicated route target
- one stable handoff into the later grouped read surface

#### First Pass Decisions

1. Keep this slice focused on section entry and routing only.
2. Preserve the existing Settings shell layout.
3. Use a narrow placeholder or loading read if the grouped pane is not rendered yet.
4. Stop before full grouped-row presentation.

#### Exact First Code Cut

The first implementation pass should:
- add the `Key Bindings` settings section entry
- route the Settings shell into the dedicated `Key Bindings` pane
- preserve the existing shell layout and `All` behavior
- stop before rendering the full grouped shortcut rows

#### Likely Files

- the Settings section list or descriptor model
- the Settings routing or projection component for `Key Bindings`
- focused Settings-surface tests

#### No-Widening Rule

- do not add grouped row rendering yet
- do not add editing controls unless already supported by an owner seam
- do not widen into search, favorites, or custom profiles in this routing cut

#### Implementation Risks

- the `All` view may need a deliberate decision about whether `Key Bindings` participates there immediately
- routing can accidentally couple too tightly to one temporary pane component
- placeholder states can become sticky if Phase 4 is not kept clearly separate

#### Checklist

- [ ] add the `Key Bindings` section rail entry
- [ ] route the Settings shell into the `Key Bindings` pane
- [ ] keep the shell layout unchanged
- [ ] keep the pane handoff narrow enough for later grouped rendering

#### Verification Shape

- focused Settings tests for section routing into `Key Bindings`
- a proof that the shell reaches the dedicated pane cleanly
- a check that the Settings shell layout remains unchanged

#### Done Shape

- `Key Bindings` exists as a real Settings section
- the shell can route into a dedicated pane cleanly
- the next grouped-rendering phase has a narrow stable entry point

## [ ] `Settings-2 / Phase 4` - `Grouped Shortcut Pane Rendering`

### Phase 4 Summary

Render the grouped shortcut read inside the dedicated `Key Bindings` pane.

This phase should make shortcut visibility real in the right pane, using the shared read contract and section routing prepared earlier.

### Phase 4 Implementation Spec

#### Purpose

Present the grouped shortcut read clearly once the Settings shell can already route into the `Key Bindings` pane.

#### Owns

- the right-pane grouped shortcut surface
- first-pass shortcut row presentation and grouping layout
- visible empty and deferred states

#### Does Not Own

- new shortcut semantics
- conflict-resolution UI
- multi-profile keymap management
- deep-link or drift-hardening follow-through

#### Current Live Read

Once the section entry and routing are stable, the main remaining work is visible grouped rendering.

The section should feel native to the existing Settings shell:
- one section rail entry
- one grouped right-pane read
- one clear command-plus-key presentation style

#### First Pass Decisions

1. Keep grouping visible and easy to scan.
2. Use mode labels as first-class headings.
3. Keep rows simple: command, keys, and optional context note.
4. Preserve honest empty and deferred states.

#### Exact First Code Cut

The first implementation pass should:
- render grouped shortcut rows in the right pane
- preserve the existing shell layout and `All` behavior
- keep uncataloged shortcut areas visible as deferred reads

#### Likely Files

- the right-pane Settings projection component for `Key Bindings`
- a grouped shortcut row or section component
- focused Settings-surface tests

#### No-Widening Rule

- do not add editing controls unless already supported by an owner seam
- do not collapse mode groups into one long flat list
- do not widen into search, favorites, or custom profiles in this first surface cut

#### Implementation Risks

- long lists can become visually noisy if headings and row density are not disciplined
- some shortcuts may need contextual notes to avoid ambiguous command names
- empty and deferred states can look too similar if they are not separated intentionally

#### Checklist

- [ ] render grouped shortcut rows in the right pane
- [ ] define stable row formatting for command, keys, and mode
- [ ] keep empty and deferred states readable

#### Verification Shape

- a grouped rendering proof for at least two different modes or surfaces
- focused Settings tests for the visible `Key Bindings` pane
- a check that the Settings shell layout remains unchanged

#### Done Shape

- the right pane can list shortcuts by mode or surface context
- the surface feels like part of the same store-like Settings workspace
- the final hardening phase can focus on deep links and drift checks only

## [ ] `Settings-2 / Phase 5` - `Context Launch, Drift Hardening, And Follow-On Boundary`

### Phase 5 Summary

Harden the new shortcut reference surface and decide the follow-on boundary.

This phase should make sure the section stays connected to live shortcut truth and cleanly hand off any later widening.

### Phase 5 Implementation Spec

#### Purpose

Finish the first shortcut-reference lane with stable deep-link behavior, drift checks, and an explicit answer about whether rebinding belongs in a later phase.

#### Owns

- context-launch or deep-link behavior into `Key Bindings`
- drift-hardening checks between Settings and live shortcut owners
- the family handoff for any later shortcut-editing work

#### Does Not Own

- full rebinding semantics
- shortcut profile import/export
- unrelated Settings cleanup outside the `Key Bindings` lane

#### First Pass Decisions

1. Keep deep links narrow and intentional.
2. Add verification that catches source-of-truth drift early.
3. Split later editing work into a new family phase if it grows beyond read-first visibility.

#### Exact First Code Cut

The first implementation pass should:
- add any needed context launch into `Key Bindings`
- harden tests or read adapters against shortcut drift
- record the explicit follow-on boundary for later rebinding work

#### Likely Files

- the Settings routing or workspace-launch helper
- shortcut inventory tests or registry adapter tests
- the `Settings-2` planning doc itself for the final handoff note

#### No-Widening Rule

- do not quietly turn this phase into a full rebinding project
- do not add hidden duplicate shortcut state to make deep links easier
- do not widen into unrelated Input or Advanced settings work

#### Implementation Risks

- context launch can accidentally couple unrelated surfaces too tightly
- drift checks can become brittle if mode labels are not normalized first
- later rebinding work can blur the clean read-first boundary if not split honestly

#### Checklist

- [ ] define any needed context-launch behavior
- [ ] add shortcut drift-hardening verification
- [ ] record the explicit follow-on boundary for rebinding or profile work

#### Verification Shape

- focused routing tests for any deep-link behavior
- a proof that the Settings read still matches live shortcut-owner truth
- a planning check that later widening stays explicit

#### Done Shape

- `Key Bindings` is a stable Settings section
- shortcut visibility stays tied to live owners
- the next shortcut-related widening has an honest boundary
