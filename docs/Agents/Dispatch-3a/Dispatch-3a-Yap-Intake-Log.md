# Dispatch 3a Yap Intake Log

## Doc Header

### Doc History
5. 2026-04-20 00:40:49: Clarified Intake 4 so `New Graph` is a label for opening the Model Viewport only, with no separate graph creation, clearing, or selection behavior required.
4. 2026-04-20 00:36:25: Added a follow-up Home Page mockup image intake for the top-left primary action preference, including the requested `New Graph` replacement that opens the Model Viewport.
3. 2026-04-20 00:29:50: Marked Intake 3 consumed by HLG > Spec after it was routed into Home Page Generation 1 as `Home-Page-6 - Control Deck Redesign And Catalog-Grounded Launch Rail`.
2. 2026-04-19 21:35:33: Numbered existing yap intake entries by creation order while preserving newest-first display order.
1. 2026-04-19 17:32:30: Added the newest-first Dispatch 3a yap intake log for raw user planning entries, rough HLG candidates, suspected family routing, planning-layer targets, status, and HLG > Spec handoff tracking.

### Purpose

This file is the newest-first intake log for Dispatch 3a.

Use it to answer:
- what the user recently yapped about
- which rough HLG candidates were extracted
- which family or planning layer the entry may belong to
- whether HLG > Spec has consumed the entry

Do not use it for:
- canonical CLG
- final implementation specs
- shipped history
- replacing Vision, Generation Index, or Family Phase docs

## Doc Body

### Intake Entry Template

```markdown
## [ ] Intake N - YYYY-MM-DD HH:MM - Short Name

### Raw User Note

`<preserve user wording here>`

### Rough HLG Candidates

- HLG candidate:

### Suspected Family

- Family:
- Generation:

### Suspected Planning Layer

- Vision Doc:
- Generation Index Doc:
- Family Phase Doc:
- Implementation phase:

### Status

- Intake status: `[ ]` new
- Handoff target:
- Blockers:

### Notes

- None yet.
```

### Active Intake

## [ ] Intake 4 - 2026-04-20 00:36 - Home Page Mockup Image And New Graph Action

### Raw User Note

```text
here is the mock up picture we are basing it off of. any other detail we should add in to get a better result? i like the big button on the top left where theres a box & it says "home page", but we can replace that with "new graph" that automatically opens the model viewport

Clarification: it just opens the model viewport thats all even though it says new graph. when the user opens a model viewport we hjave 1 new graph anyway
```

### Rough HLG Candidates

- HLG candidate: Home Page Gen 1 should preserve the mockup's top-left large visual action card as a primary command surface.
- HLG candidate: The top-left identity-style card should become a `New Graph` action rather than remaining a passive `Home Page` label.
- HLG candidate: The `New Graph` action should automatically open or route into the Model Viewport through the existing Model Viewport launch path.
- HLG candidate: `New Graph` is only the user-facing label; it should not create, clear, or select graph documents beyond the existing default graph behavior that appears when opening a Model Viewport.
- HLG candidate: HLG > Spec should decide whether this new primary action detail amends the already-prepared `Home-Page-6 / Phase 1` Worker handoff or becomes a follow-up phase.

### Suspected Family

- Family: Home Page / Workspace Modes
- Generation: Home Page Generation 1

### Suspected Planning Layer

- Vision Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Vision.md`
- Generation Index Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Gen1-Index.md`
- Family Phase Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Future/Home-Page-6 - Control Deck Redesign And Catalog-Grounded Launch Rail.md`
- Implementation phase: Possibly `Home-Page-6 / Phase 1 - Control Deck Shell And Catalog-Grounded Launch Rail`, but HLG > Spec must decide whether the Worker handoff should be amended before implementation.

### Status

- Intake status: `[ ]` new
- Handoff target: Manager -> HLG > Spec
- Blockers: Needs HLG > Spec to verify the correct existing Model Viewport launch seam before Worker treats the `New Graph` label as implementation-ready.

### Notes

- The attached mockup image should be treated as the visual reference for proportions and hierarchy, with the top-left cube/box card called out as especially important.
- Preserve the user's preference that the prominent top-left card become `New Graph`.
- Preserve the user's desired behavior that `New Graph` automatically opens the Model Viewport.
- Clarification: `New Graph` should only open the Model Viewport; opening a Model Viewport already gives the user one new graph, so no extra graph creation command is needed.
- Additional detail worth asking or deciding before implementation: whether `New Graph` should replace the startup surface control entirely, sit above it, or coexist with startup controls in the left rail.
- Additional detail worth asking or deciding before implementation: whether the visual cube/viewport graphic should be static decorative artwork, a live preview, or a lightweight icon treatment.

## [x] Intake 3 - 2026-04-20 00:28 - Home Page Mockup Redesign

### Raw User Note

```text
The user made a mockup for what the Home Page could look like and wants to funnel this work down inside Home Page Gen 1, not create a separate unrelated lane. The Manager should spawn a Worker, Yap Intake, and HLG > Spec agent, manage the loop, keep everyone warm, and continue until all work is done.

Mockup description to log as raw design yap:
- Overall direction: Home Page should feel like a polished ParaHook workspace landing surface / control deck rather than a plain settings page.
- Visual structure: dark mode, subtle star/grid/blue-glow technical background, compact command surfaces, app-style cards, strong visual hierarchy.
- Top bar: existing app chrome with Home Page title/breadcrumb and compact right-side controls remains visible.
- Page title: large `Home Page` heading with subtitle `Workspace landing surface`.
- Left rail/control column:
  - Top identity card with a visual cube/viewport graphic and `Home Page` label.
  - Startup surface control should be housed here, likely as a selected row/toggle/list item for `Home Page` and `Model Viewport` rather than the current plain radio layout.
  - `Open Viewport` section should be first-class and generated from canonical workspace surfaces where possible.
  - Mockup labels include Browser, Docker, Console, Scratchpad, Hotspot. Some names may map to current surfaces or future/placeholders, so Spec must verify against the repo/catalog before implementation.
  - Help Center / Docs & Resources row.
  - GitHub and Docs shortcut row.
  - Debug section at bottom, likely collapsible or advanced.
- Main orientation card:
  - Contains `Orientation` title, quick start copy, GitHub and Docs buttons, version row, what's new row.
  - Includes a right-side intro/media/hero preview card with `Get Started with ParaHook`.
  - Should stay compact and not cause the Home Page to overflow vertically.
- Main storage card:
  - Rename or reshape `Storage transparency` into `Storage Management`.
  - User-facing copy around ParaHook-owned browser persistence buckets.
  - Rows show storage bucket name, storage key/source, enabled toggle, wipe X button, file size, and detail arrow.
  - Rows should align cleanly and fit the monitor height.
  - The storage rows can scroll internally if needed, but section title/copy should not be inside the scroll area.
- Existing user preferences from previous Home Page work to preserve:
  - Startup surface should actually restore correctly after reload.
  - Open Viewport buttons should come from canonical workspace surface catalog where possible.
  - Storage transparency/storage management rows should include toggles and X wipe controls with aligned columns.
  - File size column should have enough room so X buttons align.
  - UI preference toggles should stack where needed.
  - Theme scrollbars should match dark mode.
- Planning intent:
  - This belongs inside Home Page Gen 1.
  - Use the Home Page docs under docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page.
  - Start from HLG extraction, then let HLG > Spec decide whether to update Home-Page-Vision.md, Home-Page-Gen1-Index.md / Home-Page-Index.md, and Future phase docs.
  - Worker should only implement once there is a worker-ready phase.
```

### Rough HLG Candidates

- HLG candidate: Home Page Generation 1 should evolve into a polished workspace landing and control surface rather than remain a plain settings page.
- HLG candidate: Home Page should use a left rail for startup-surface selection, viewport launching, docs/help shortcuts, and debug controls.
- HLG candidate: Open Viewport controls should be generated from canonical workspace surface data where possible and stay current as surfaces are added.
- HLG candidate: Orientation content should become a compact status and quick-start card with docs, GitHub, version, what's-new, and intro/media affordances.
- HLG candidate: Storage transparency should become Storage Management with aligned toggle, wipe, size, detail, and internally scrollable row behavior.
- HLG candidate: The redesign must preserve existing functional Home Page Generation 1 behavior, including startup restore, persistence toggles, storage wipe, canonical viewport launch, dark-mode styling, and monitor-height fit.
- HLG candidate: Spec must verify which mockup labels are current surfaces versus future placeholders before any implementation phase is written.

### Suspected Family

- Family: Home Page / Workspace Modes
- Generation: Home Page Generation 1

### Suspected Planning Layer

- Vision Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Vision.md`
- Generation Index Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Gen1-Index.md`
- Family Phase Doc: Not yet selected; likely needs HLG > Spec to create or revise a Home Page future phase for the control-deck redesign.
- Implementation phase: None; not Worker-ready.

### Status

- Intake status: `[x]` consumed by HLG > Spec
- Handoff target: Manager -> HLG > Spec -> Worker Kant
- Blockers: None for `Home-Page-6 / Phase 1`; Docker, Scratchpad, and Hotspot are not verified current catalog entries and are deferred outside the first Worker handoff.

### Notes

- Preserve the user's instruction that this belongs inside Home Page Generation 1 rather than a separate unrelated lane.
- Preserve the user's instruction that Worker implementation must wait until a worker-ready phase exists.
- Preserve the mockup labels Browser, Docker, Console, Scratchpad, and Hotspot as raw design input; do not treat them as verified current catalog entries until HLG > Spec checks the repo.
- HLG > Spec consumption: Routed into `Home-Page-Vision.md`, `Home-Page-Gen1-Index.md`, and `Future/Home-Page-6 - Control Deck Redesign And Catalog-Grounded Launch Rail.md`.
- HLG > Spec verification: `Browser` and `Console` map to current catalog entries; `Docker`, `Scratchpad`, and `Hotspot` do not map to current workspace surface catalog entries and are excluded from `Home-Page-6 / Phase 1`.

## [x] Intake 2 - 2026-04-19 21:26 - Console Workspace Modes Surface Parity

### Raw User Note

`The user wants Console Workspace Modes to grow into a proper console-control surface for all workspace modes. The recent symptom was that when the user loads in and uses the Console to change Workspace Mode, it did not work correctly for Home Page / Model Viewport switching until repaired. After a research pass, the larger idea is that Console should be able to control all workspace modes from the console, not just a few hard-coded surfaces.`

### Rough HLG Candidates

- HLG candidate: Users can control every workspace surface from Console with the same action model exposed by the shared slot UI.
- HLG candidate: Console Workspace Modes should read canonical catalog/support data instead of maintaining surface allowlists.
- HLG candidate: Primary and non-primary workspace rules should be explicit, tested, and consistent between Console and shell UI.
- HLG candidate: Slotted, floating, detached, and popped-out surfaces should remain one workspace model, not separate Console concepts.
- HLG candidate: Unsupported actions should either be hidden by shared eligibility rules or produce clear diagnostics.
- HLG candidate: The planning should begin at the Console vision/generation level and work down into index/phase docs instead of jumping directly into one implementation phase.

### Suspected Family

- Family: Console / Workspace Modes
- Generation: Console generation-level planning; possible lane title `Console Workspace Modes Surface Parity And Catalog-Driven Actions`

### Suspected Planning Layer

- Vision Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Console`
- Generation Index Doc: Existing Console family index under `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Console`
- Family Phase Doc: Not yet selected; likely needs HLG > Spec to create or revise a Console future phase.
- Implementation phase: None; not Worker-ready.

### Status

- Intake status: `[x]` consumed by HLG > Spec
- Handoff target: Manager -> HLG > Spec
- Blockers: Needs HLG > Spec to inspect the existing Console family docs and choose the correct vision/generation/index update path before any implementation spec exists.

### Notes

- Research summary: Existing Console Workspace Modes currently works mostly on slotted viewport slots only.
- Research summary: Viewport type switching is now mostly catalog-driven through `workspaceSurfaceCatalog` and includes `modelViewer`, `browser`, `catalog`, `console`, `spaghettiEditor`, `dashboard`, `notepad`, and `homePage`.
- Research summary: Float, close, popout/open, and some split actions still use narrow hard-coded Console guards.
- Research summary: Console should not own a separate workspace model; it should act as an adapter over canonical workspace surface catalog/support and shared shell actions.
- Research summary: There is already an existing Console family under `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Console`, so this likely belongs there rather than as separate families per surface.
- HLG > Spec consumption: Routed into `Console-Vision.md`, `Console-Gen1-Index.md`, and `Future/Console-1 - Workspace Modes Catalog-Driven Surface Actions.md`.

## [ ] Intake 1 - 2026-04-19 17:59 - Home Page Scrollbar

### Raw User Note

`the home page needs a scroll bar, it overflows off the page right now`

### Rough HLG Candidates

- HLG candidate: Home Page content should stay readable and reachable when it exceeds the viewport.
- HLG candidate: The homepage surface should provide a scrollable overflow path instead of clipping content off-page.

### Suspected Family

- Family: Home Page / Workspace Modes
- Generation: Home Page Generation 1

### Suspected Planning Layer

- Vision Doc: `docs/Vision.md`
- Generation Index Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Home-Page-Gen1-Index.md`
- Family Phase Doc: `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Future/Home-Page-3 - Lightweight Orientation And What Is New.md`
- Implementation phase: Home Page surface layout / overflow handling

### Status

- Intake status: `[ ]` new
- Handoff target: Manager -> HLG > Spec
- Blockers: None yet.

### Notes

- Preserve the user's wording for the overflow complaint.
