# Properties 2 - Shared Properties Workspace Shell And Section Hosting

## Doc Header

### Doc History
7. 2026-05-10 12:58:35: Implemented and closed `Properties-2 / Phase 3 - Child Section Contract And Shell States` by extracting the first explicit section-facing contract, moving no-focused-item plus unsupported and no-section behavior into shell-owned states, routing the hosted `Materials` section through that contract seam, and closing the shared-shell ladder so `Materials-1` can begin from a real host instead of ad hoc workspace glue.
6. 2026-05-10 12:56:14: Prepped `Properties-2 / Phase 3 - Child Section Contract And Shell States` for implementation by grounding the closeout pass against the landed phase-2 `PropertiesSurface.tsx` section host, the current shell-level focus summary seam, and the still-missing explicit section-facing contract plus shell-owned non-happy-path states that must exist before `Materials-1` begins.
5. 2026-05-10 12:52:18: Implemented and closed `Properties-2 / Phase 2 - Section Registry And Tab Framing` by turning the phase-1 placeholder into a real shell-owned section host, making `Materials` the first active hosted section and default tab, and proving the new framing through direct surface, registry, AppShell, and build verification.
4. 2026-05-10 12:50:31: Prepped `Properties-2 / Phase 2 - Section Registry And Tab Framing` for implementation by grounding the next shared-shell pass against the live `PropertiesSurface.tsx` phase-1 placeholder shell, the canonical `ViewportSurfaceRegistry.tsx` mount, and the current `Materials` reservation seam, while making the first hosted-section contract, default-tab rule, and focused proof boundaries explicit.
3. 2026-05-10 12:13:32: Implemented and closed `Properties-2 / Phase 1 - Workspace Mount And Focus Context` by registering the new optional `Properties` workspace surface, wiring the canonical surface-registry branch, landing the first shared shell component, and proving that the shell can read the focused target from the existing workspace-selection owner seam before section framing begins.
2. 2026-05-10 12:05:25: Tightened `Properties-2 / Phase 1 - Workspace Mount And Focus Context` into an implementation-ready first runtime shell slice by grounding it against the live `workspaceSurfaceCatalog.ts` optional-surface registry, `ViewportSurfaceRegistry.tsx` render-family branch owner, `useWorkspaceStore.ts` shared slot-placement seam, and the existing `useAppStore.ts` workspace-selection object-target path that should feed shell-level focused-item context without inventing a new properties-local owner.
1. 2026-05-10 11:55:14: Created this new follow-on `Properties-2` family phase doc so the `Properties` family now has an explicit shared-shell runtime foundation between the structural `Properties-1` umbrella and the nested `Materials-1` lane, covering focused-item workspace mounting, section hosting, and child-lane handoff without absorbing materials-specific behavior.

### Purpose

This doc owns the first runtime foundation for the shared `Properties` workspace shell.

Use it to answer:
- how the `Properties` workspace should mount as a real workspace surface
- how focused-item context should be consumed at the workspace level
- how property-group sections such as `Materials` should be hosted
- what the shared shell should own before child-lane runtime behavior begins

Do not use it for:
- materials-specific owner mapping or field behavior
- the broad umbrella meaning already settled by `Properties-1`
- future property-group lanes that do not yet have real owner seams
- turning the shared shell into a second Browser, Layers, or viewport-tool owner

## Doc Body

### Short Version

`Properties-2` should create the first real runtime-ready workspace shell for `Properties`.

This family phase should prove:
- `Properties` can mount as a real workspace surface
- focused-item context enters that surface once
- child lanes are hosted as sections instead of inventing separate top-level routing
- `Materials` can become the first real hosted section without defining the whole workspace forever

This phase should stay shell-first.

It should define:
- workspace mounting
- focused-item workspace read
- section registry and tab framing
- child-lane hosting contract

It should not try to ship the whole materials workflow.

### Scope

This family phase owns:
- the first shared `Properties` workspace shell
- the first runtime focused-item consumption at the umbrella level
- the section-hosting contract for child lanes such as `Materials`
- the first empty-state and unsupported-state read for the shell

This family phase does not own:
- material-owner identity or material field behavior
- Browser hierarchy, object identity, or viewer ownership
- later property-group subfamilies beyond section reservation

### Current Live Read

The current docs already establish:
- `Properties-1` as the structural umbrella and routing boundary
- `Materials` as the first nested subfamily
- `Materials-1` as the first child-lane runtime-forward planning lane

What is now missing is the explicit boundary between the landed hosted-section shell and the later `Materials-1` runtime lane.

The live app seams now point at one clear next shell path:
- `src/app/workspace/workspaceSurfaceCatalog.ts`
  - owns the optional workspace-surface registration list and host-mode support contract
  - now registers `properties` as a real optional workspace surface kind
  - already preserves the shared workspace-surface order that the `Properties` shell should respect when later section hosting grows
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - owns the canonical render-family switch for slotted workspace surfaces
  - now renders `PropertiesSurface` through one canonical branch
  - is the honest place where the shell stays mounted while section framing widens in `Phase 2`
- `src/app/workspace/PropertiesSurface.tsx`
  - now owns the landed phase-2 section host
  - already reads the focused target from `workspaceSelection.selectedTarget`
  - now owns one real `Materials` section tab and active-section state
  - still mixes shell framing, shell status copy, and section content shape in one component because no explicit section-facing contract exists yet
- `src/app/store/useAppStore.ts`
  - already owns workspace selection state
  - already contains object-target selection and owner-resolution seams that can feed focused-item context into `Properties` without inventing a new local owner model
- `src/app/workspace/PropertiesSurface.test.tsx`
  - now proves the shell owns one active `Materials` section and still carries the empty focus read into that hosted frame
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
  - already proves the canonical registry can mount `Properties` and that the shell hosts an active `Materials` section through the canonical branch
- `src/app/AppShell.test.tsx`
  - already proves a non-primary slot can switch into `Properties` through the shared viewport-type picker and reach the landed shell

Without this follow-on, the landed phase-2 shell still stops at:
- one shell-local section registry with no explicit child-section contract shape
- one hosted `Materials` frame that still embeds shell-read rows instead of a clean section input seam
- one empty-focus experience that still lives as general text inside the active section rather than as a shell-owned no-target state
- no explicit unsupported-focus or no-section path the shell can own before `Materials-1` widens runtime behavior

### First Pass Decisions

1. `Properties-2` owns the shared workspace shell, not materials-specific editing behavior.
2. Focused-item context should be consumed once at the `Properties` shell level and passed down into child sections.
3. Child lanes such as `Materials` should register as hosted sections rather than recreating top-level workspace identity.
4. `Materials` is the first hosted section and should be the default first-tab read when available.
5. Empty-state, unsupported-focus, and no-section states belong to the shell rather than to any one child lane.
6. `Materials-1` remains the first materials-specific runtime-forward lane and should plug into this shell instead of bypassing it.

### Implementation Readiness

`Properties-2` should split into three Codex-sized runtime-foundation phases:
- `Phase 1` mounts the shared workspace and focused-item read
- `Phase 2` adds section registration and tab framing
- `Phase 3` closes the hosting contract and shell-owned empty states

### Risks

- the shell could absorb materials-specific owner mapping or field logic
- `Materials-1` could bypass the shell and recreate top-level workspace routing
- future property groups could get hard-coded into the first registry instead of staying optional

### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-2 - Shared Properties Workspace Shell And Section Hosting.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

### No-Widening Rule

- do not absorb materials-specific property editing here
- do not recreate Browser or object-identity ownership here
- do not turn future sections such as `Transform` into active runtime work here
- do not make the shell depend on only one permanent child section

### Done Shape

This family phase is in good shape when:
- `Properties` can mount as a real workspace shell
- focused-item context enters once at the shell level
- `Materials` is hostable as the first real section
- child-lane routing no longer depends on ad hoc top-level logic
- the shell stays generic enough to host later sections without pretending they already exist

## Vision

`Properties-2` turns the `Properties` umbrella into a real shared runtime surface without collapsing the nested child-lane architecture.

The intended Generation 1 read is:
- `Properties-1` settled what the umbrella means
- `Properties-2` creates the shell that hosts real property-group sections
- `Materials-1` becomes the first child-lane runtime foundation inside that shell

Important promise:
- the shell should feel like one real workspace surface, not a temporary wrapper around `Materials`

## Wishlist Organization

### High Level Goals

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`

### `Properties-2 / Phase 1`

- [x] Mount the shared `Properties` workspace surface.
- [x] Consume focused-item context at the shell level.
- [x] Keep child sections from inventing separate top-level routing.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`

### `Properties-2 / Phase 2`

- [x] Add section registration and tab framing for nested child lanes.
- [x] Make `Materials` the first hosted section and the first-tab read when available.
- [x] Keep the section host generic enough for later property groups.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-4`
- [ ] `Properties-Gen1-HLG-5`

### `Properties-2 / Phase 3`

- [x] Define the child-lane hosting contract the nested sections read from.
- [x] Add shell-owned empty, unsupported, and no-section states.
- [x] Close the shell so `Materials-1` can plug into it without recreating umbrella behavior.
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-5`

## [x] `Properties-2 / Phase 1` - `Workspace Mount And Focus Context`

### Phase 1 Summary

Mount the shared `Properties` workspace surface and consume focused-item context at the shell level.

This phase should prove:
- `Properties` exists as a runtime workspace surface
- focused-item context enters once at the shell
- child lanes do not need to recreate top-level focus routing

Implementation readiness target:
- this phase should fit inside one Codex-sized runtime-foundation pass
- the first cut should register `Properties` as an optional workspace surface, add a canonical `ViewportSurfaceRegistry` branch, and read focused-item context from the existing workspace-selection seam before section hosting starts in `Phase 2`

### Phase 1 Implementation Spec

#### Purpose

Create the real shell entry seam for the `Properties` workspace.

#### Owns

- shared workspace mounting
- focused-item shell-level read
- first shell-level routing into later hosted sections

#### Does Not Own

- materials-specific owner reads
- child-section tab framing
- property field rendering

#### Current Live Read

- `workspaceSurfaceCatalog.ts` is the canonical owner for optional workspace-surface registration, host-mode support, and persistence participation
- `ViewportSurfaceRegistry.tsx` is the canonical owner for mapping one workspace surface kind into one render-family branch
- `useWorkspaceStore.ts` already owns shell-level placement and focus behavior for optional workspace surfaces
- `useAppStore.ts` already owns workspace selection and object-target seams that can supply the shell-level focused-item read
- no live `Properties` surface branch exists yet, so this phase must create that shell mount honestly instead of hiding it inside `Materials`

#### First Pass Decisions

1. `Properties` should enter the runtime through the same optional workspace-surface catalog path already used by `Catalog`, `Settings`, and `Edit History`.
2. The first shell should read focused-item context from the existing workspace-selection owner in `useAppStore.ts`, not from a new `Properties`-local selection store.
3. The first `Properties` surface can ship with a shell-level placeholder or empty-state body because section hosting belongs to `Phase 2`.
4. `Materials` should not appear as an inline fallback implementation of the whole shell during this phase.

#### First Code Cut

This first pass should:
- add `properties` as an optional workspace surface kind in the shared workspace catalog
- add the canonical `ViewportSurfaceRegistry` branch that renders the new shell surface
- create the first `Properties` surface component or equivalent shell owner under `src/app/workspace/`
- read the current focused item or object at the shell level from the existing workspace-selection seam
- expose that shell-level focus read to later section-hosting work without introducing materials-specific field behavior yet

#### Likely Files

- `src/app/workspace/workspaceSurfaceCatalog.ts`
- `src/app/workspace/workspaceSurfaceCatalog.test.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/store/useAppStore.ts`

#### No-Widening Rule

- do not add section tabs or section registration here
- do not render the full `Materials` workflow here
- do not add a new properties-local focus or selection store here
- do not let the shell own object identity, Browser hierarchy, or material-owner truth

#### Verification Shape

- `workspaceSurfaceCatalog.test.ts` proves `Properties` is registered as an optional persisted workspace surface with the intended host-mode support
- `ViewportSurfaceRegistry.test.tsx` proves the canonical registry can render the `Properties` shell branch
- focused-item or selected-object state is readable at the shell level without depending on `Materials-1`
- the shell mounts without requiring section framing or materials-specific child behavior

#### Landed Read

- `Properties` now exists as a real optional workspace surface in the shared catalog and titlebar type-picker path.
- `ViewportSurfaceRegistry.tsx` now owns one canonical `PropertiesSurface` branch instead of leaving the shell hidden inside later child-lane work.
- `PropertiesSurface.tsx` now reads the current focused target from the existing `workspaceSelection.selectedTarget` seam and shows an honest phase-1 shell status read without inventing materials-specific behavior.
- the Home Page launcher and focused surface tests now include `Properties`, so the shared shell entry path stays visible and proven.

## [x] `Properties-2 / Phase 2` - `Section Registry And Tab Framing`

### Phase 2 Summary

Add the first hosted-section system for the `Properties` shell.

This phase should prove:
- child lanes can register as sections
- the shell can render tab or section framing
- `Materials` is the first hosted section when available

### Phase 2 Implementation Spec

#### Purpose

Make `Properties` read like a multi-section workspace instead of a hard-coded single panel.

#### Owns

- section discovery or registration
- tab or section framing
- default first-tab selection for `Materials`

#### Does Not Own

- materials-specific target or field behavior
- future-section planning surfaces

#### Current Live Read

- `src/app/workspace/PropertiesSurface.tsx` already mounts one phase-1 shell that reads `workspaceSelection.selectedTarget`, renders a `Properties` rail/header, and shows `Materials` only as a static reserved next section.
- The current phase-1 shell reuses the `Settings` shell layout classes, which is acceptable for now, but the content still reads as a placeholder status surface rather than a real multi-section workspace.
- No live section registry or active-section selection state exists yet, so `Materials` is not a real hosted lane and later property groups would still have to widen the shell ad hoc.
- `ViewportSurfaceRegistry.test.tsx` and `AppShell.test.tsx` already prove the shell mounts and remains reachable through the shared workspace runtime; `Phase 2` should widen those proof surfaces around section framing rather than inventing a new test harness.
- The nested materials planning home still lives under `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/`, so this phase should host a `Materials` section entry point without absorbing `Materials-1` field or owner logic.

#### First Pass Decisions

1. `PropertiesSurface.tsx` remains the shell owner for section framing; `Materials` should plug into that shell rather than replacing it.
2. The first pass should use one small local section registry or section-definition seam inside the shared `Properties` shell, not a broad cross-workspace tab system.
3. `Materials` is the first real hosted section and should be the default selected section whenever the shell can render sections at all.
4. The first hosted-section pass can still render read-only or placeholder section content, but it must look like a real active section rather than a reservation badge.
5. The section host must stay generic enough that a later `Transform` or metadata lane could register without rewriting top-level shell identity.

#### First Code Cut

This pass should:
- replace the phase-1 `Materials` reservation row in `PropertiesSurface.tsx` with a real section-definition list and active-section framing
- add one shell-owned section registry or section array that currently contains `Materials`
- make `Materials` the default first-tab or first-section read
- keep focused-target context at the shell level while passing only the minimum section-facing data shape downward
- stop short of real `Materials-1` owner mapping or field editing behavior

#### Verification Shape

- `ViewportSurfaceRegistry.test.tsx` proves `Properties` renders one real active `Materials` section through the canonical shell path
- `AppShell.test.tsx` proves the shared workspace picker still lands in a shell whose visible active section is `Materials`
- focused shell proof shows the shell owns active-section framing instead of leaving `Materials` as static placeholder copy

#### Landed Read

- `PropertiesSurface.tsx` now owns one real section-definition list instead of a phase-1 placeholder reservation row.
- `Materials` is now the first active hosted section and default tab inside the shared `Properties` shell.
- focused-target context still enters once at the shell and is projected into the hosted `Materials` section frame without widening into `Materials-1` field or owner behavior.
- direct surface, registry, and AppShell proof now confirm that the shell owns section framing instead of leaving `Materials` as static placeholder copy.

#### Likely Files

- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
- `src/app/AppShell.test.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md` only if the nested handoff wording needs one narrow sync

#### No-Widening Rule

- do not implement real materials target lists, field editors, or write flows here
- do not invent a repo-wide reusable tab framework if one shell-local section seam is enough
- do not move focused-target ownership out of the shell into `Materials`
- do not let later sections such as `Transform` become active runtime work in this pass

#### Implementation Risks

- if `Materials` is rendered as a one-off special case instead of through a section-definition seam, later property groups will have to break `PropertiesSurface` apart again
- if section selection state is inferred from child content rather than owned by the shell, `Materials-1` can still end up recreating top-level routing
- if proof only checks the visible label and not the active framed section behavior, the shell can still ship as a renamed placeholder instead of a real hosted-section surface

## [x] `Properties-2 / Phase 3` - `Child Section Contract And Shell States`

### Phase 3 Summary

Close the shared shell so child sections can plug into it cleanly.

This phase should prove:
- child lanes receive a real hosting contract
- the shell owns empty and unsupported states
- `Materials-1` can begin without rebuilding umbrella behavior

### Phase 3 Implementation Spec

#### Purpose

Define the final first-pass runtime boundary between the shared shell and nested property lanes.

#### Owns

- the child-section hosting contract
- no-focused-item, unsupported-focus, and no-section states
- the clean runtime handoff into `Materials-1`

#### Does Not Own

- material-owner mapping
- material-property field editing
- later non-material sections

#### Current Live Read

- `src/app/workspace/PropertiesSurface.tsx` now owns active-section framing and a one-entry `Materials` section registry, but it does not yet expose a formal section-facing contract object or props shape that a later extracted `Materials` section surface could read.
- The shell still computes `focusSummary` inline and the active `Materials` section body renders the empty-focus state as section content rather than letting the shell decide when to show a shell-owned empty or unsupported state instead of any section body.
- Only one section exists today, so the shell does not yet prove how a section host behaves when no registered sections are available or when the current focused target should not support the active section.
- The nested `Materials` planning home already expects a later owner-boundary phase, so `Phase 3` should stop at defining the shell-facing contract and non-happy-path shell states, leaving materials-specific owner mapping to `Materials-1`.

#### First Pass Decisions

1. The shell should produce one explicit section-facing contract object or VM that includes the current focused target read plus any shell-owned section metadata the child lane needs.
2. Shell-owned empty, unsupported, and no-section states should render before section content, rather than making `Materials` fake those states inside its own body.
3. `Materials` can remain the only registered section in this phase, but it should consume the same contract shape a later second section would receive.
4. The shell closeout should prefer one local extracted section component or renderer seam over leaving all section behavior inline inside `PropertiesSurface.tsx`.
5. `Phase 3` should end with `Materials-1` able to focus on owner mapping and fields instead of recreating shell routing, active-section state, or empty-state handling.

#### First Code Cut

This pass should:
- extract or define one explicit `Properties` section contract that nested sections read from
- move no-focused-item, unsupported-focus, and no-section handling into shell-owned behavior above the active section body
- keep `Materials` wired through that new contract seam without adding materials-specific owner or field logic
- close the shared-shell ladder so `Materials-1` becomes the obvious next child-lane runtime pass

#### Verification Shape

- focused direct-surface proof that the shell can render a shell-owned no-focused-item state without pretending the section owns it
- focused proof that the active `Materials` section consumes the explicit section-facing contract instead of free-reading ad hoc shell locals
- focused registry/AppShell proof that the canonical `Properties` route still lands in the closed shell correctly
- `Materials-1` can start from a real hosting seam instead of ad hoc workspace glue

#### Landed Read

- `PropertiesSurface.tsx` now resolves one explicit shell state before any hosted section body renders, covering `ready`, `empty`, `unsupported`, and `no-sections`.
- `propertiesSectionContract.tsx` now owns the first section-facing contract seam, including focused-target summary shaping and child-section context handoff.
- the hosted `Materials` section now consumes that contract through its own local section-definition seam instead of free-reading shell-local variables.
- the shared shell is now closed enough that `Materials-1` can begin from a real hosted-lane contract instead of rebuilding top-level `Properties` behavior.

#### Likely Files

- `src/app/workspace/PropertiesSurface.tsx`
- `src/app/workspace/PropertiesSurface.test.tsx`
- `src/app/workspace/ViewportSurfaceRegistry.test.tsx`
- `src/app/AppShell.test.tsx`
- one new local section component or contract helper under `src/app/workspace/` if extracting the `Materials` section body is the cleanest way to make the contract explicit

#### No-Widening Rule

- do not start real materials target discovery, owner reads, or editable field rendering here
- do not invent global workspace-shell abstractions outside `Properties` just to close this family phase
- do not make unsupported-state rules depend on speculative future sections that are still reservation-only
- do not bypass the shell by letting `Materials-1` free-read `useAppStore` directly for top-level focus once this contract exists

#### Implementation Risks

- if the shell contract stays implicit inside one component, `Materials-1` can still end up copying shell-local assumptions when it extracts its first real runtime lane
- if empty and unsupported states remain section-local copy, later sections can diverge on basic no-target behavior and recreate umbrella inconsistency
- if the closeout only adds types without UI proof, the family can look complete in docs while still leaving `Materials-1` to untangle the real runtime seams
