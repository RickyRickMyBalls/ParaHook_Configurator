# Home Page Gen1 Index

## Doc Header

### Doc History
6. 2026-04-19 13:31:41: Updated the `Home-Page-1` planning read after its Family Phase Doc was prepped against the active Gen1 index, making `Home-Page-1 / Phase 1 - Surface Registry And Minimal Render` the next implementation-ready slice.
5. 2026-04-19 13:23:18: Renamed this document to `Home-Page-Gen1-Index.md`, promoted it from the older bridge-index role into the active `Generation 1` Generation Index Doc, and expanded each family phase with `Family Phase Summary`, `HLG / CLG Coverage`, `Owns`, `Does Not Own`, `Planning Read`, and `Family Phase Doc` sections.
4. 2026-04-19 13:19:33: Normalized this bridge index toward the current Generation Index Doc guide rails by adding a top-level `## Vision` section, clarifying that `Home-Page-Index.md` is the older Generation 1 bridge until `Home-Page-Gen1-Index.md` is created, and tightening the family-phase routing language without changing the active `Home-Page-1` through `Home-Page-3` plan.
3. 2026-04-19 11:19:11: Expanded the `Home Page` persistence HLG and CLG routing to include workspace restore, view settings, Dashboard, Notepad, recent-items, and browser storage/quota visibility controls while intentionally leaving Catalog preview/session persistence and Console history/transcript persistence outside the current Home Page HLG surface.
2. 2026-04-19 10:49:53: Added the environment reload-memory HLG and CLG to the Home Page family index, routing the `Environment` persistence toggle into `Home-Page-2` so Home Page can expose whether Catalog-applied HDRI or environment state is remembered on reload while Environment and viewer owners keep the actual state semantics.
1. 2026-04-19 10:36:04: Added this umbrella `Home Page` family index, filtered the existing vision wishlist into stable high-level goals and Codex-level goals, and routed the first implementation-ready lane into `Home-Page-1` for workspace-surface onboarding, zero-viewer return, startup preference, and launch actions without starting runtime behavior.

### Purpose

This file is the active `Generation 1` planning index for the `Home Page` workspace family under `Workspace Modes`.

Use it to answer:
- how the `Home Page` `Generation 1` vision becomes family phases
- which `Generation 1` HLG are preserved from `Home-Page-Vision.md`
- which `Home-Page-N` family phase should be prepped or implemented next
- how `Home Page` stays a workspace surface instead of becoming a separate route, second Browser, or settings junk drawer

Do not use it for:
- broad Home Page north-star ownership that belongs in `Home-Page-Vision.md`
- later Home Page generations after a dedicated `Home-Page-GenN-Index.md` exists
- implementation-phase specs that belong in standalone `Future/` Family Phase Docs
- project-content ownership
- graph-document truth
- Browser row semantics
- full release notes or docs ownership

### Family Structure

Use this folder like this:

- `Home-Page-Vision.md`
  - north-star product and ownership direction
- `Home-Page-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
  - summary and boundary home for `Home-Page-1`, `Home-Page-2`, and `Home-Page-3`
- `Future/`
  - standalone implementation-ready `Home Page` Family Phase Docs
- `Shipped/`
  - shipped records for completed `Home Page` cuts

## Doc Body

### Short Version

ParaHook should gain one real `Home Page` workspace surface that can appear first on startup, act as the honest return target when no `Model Viewport` surfaces are open, and expose user-facing storage transparency without becoming the owner of project, graph, Browser, Catalog, or viewer truth.

The first family lane is `Home-Page-1`.

`Home-Page-1` should prove the surface and launch behavior first:
- register `Home Page` as a real workspace surface
- make zero open `Model Viewport` surfaces valid
- route last-viewer-close return into `Home Page`
- add the startup preference that can skip `Home Page` and open directly into `Model Viewport`
- expose the first calm launch actions into real workspace owners

Later lanes should widen into storage transparency, persistence toggles, and lightweight repo/docs/version orientation only after the surface has a truthful workspace home.

### Current Planning Read

This file owns the active `Generation 1` family-phase routing.

Current legal family-phase ladder:
- `Home-Page-1` - workspace landing surface and startup preference
- `Home-Page-2` - storage transparency and persistence toggles
- `Home-Page-3` - lightweight orientation and what is new

Important planning rule:
- use this index to choose and bound the next `Home-Page-N` family phase
- use the matching standalone `Future/` Family Phase Doc for Codex-sized implementation phases and implementation specs
- do not start runtime implementation from this index alone

## Vision

`Home-Page-Vision.md` remains the broad north-star.

This Generation Index Doc owns the current `Generation 1` family-phase routing read.

The healthy Generation 1 read is:
- `Home Page` is the default first startup surface
- `Home Page` remains openable even when the user skips it on launch
- zero-model-viewport workspace state is valid
- launch actions hand off to `Model Viewport`, `Browser`, `Catalog`, `Console`, graph creation, or recent/resume owners without absorbing their truth
- storage transparency reports ParaHook-owned persistence separately from broader browser origin storage
- browser-stored graph persistence is user-controlled and visible
- workspace restore persistence is user-controlled and visible, replacing hidden reload behavior with an explicit remember/forget preference
- view settings persistence is user-controlled and visible
- environment persistence is user-controlled and visible, including whether Catalog-applied HDRI or environment state should survive browser reload
- Dashboard and Notepad persistence are user-controlled and visible
- recent-items persistence is user-controlled and visible once a recent-items owner exists
- browser storage/quota usage is visible when browser support makes that estimate available
- lightweight GitHub, docs, version, and what's-new orientation stays small and does not replace the full docs or changelog system

Important boundary rule:
- if a question is about the broad `Home Page` purpose, use `Home-Page-Vision.md`
- if a question is about current `Generation 1` family-phase order, use this index
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc

## Wishlist Organization

### High Level Goals

The canonical human-level goals live in `Home-Page-Vision.md` under `## Vision > ### Human Level Goals`.

This index repeats them so current `Generation 1` family-phase routing stays readable.

- [ ] `Home-Page-Gen1-HLG-1. Home Page should be the first surface the user loads into.`
- [ ] `Home-Page-Gen1-HLG-2. There should be a toggle so the user can switch off Home Page first and load directly into Model Viewport.`
- [ ] `Home-Page-Gen1-HLG-3. Home Page should keep track of browser storage so the user can tell if there is a leak.`
- [ ] `Home-Page-Gen1-HLG-4. Home Page should help the user understand whether the app is storing data and bloating browser-side storage.`
- [ ] `Home-Page-Gen1-HLG-5. The user should be able to save what they have in their graphs in browser storage and turn that setting on or off.`
- [ ] `Home-Page-Gen1-HLG-6. Home Page should show and expose any app-owned data ParaHook stores on the user's computer or in browser storage.`
- [ ] `Home-Page-Gen1-HLG-7. Home Page should include a Workspace Restore persistence toggle so browser reload can either remember or forget the last saved workspace layout.`
- [ ] `Home-Page-Gen1-HLG-8. Home Page should include a View Settings persistence toggle so browser reload can either remember or forget view presentation preferences.`
- [ ] `Home-Page-Gen1-HLG-9. Home Page should include an Environment persistence toggle so browser reload can either remember or forget applied environment state such as a Catalog-loaded HDRI.`
- [ ] `Home-Page-Gen1-HLG-10. Home Page should include a Dashboard persistence toggle so dashboard lanes and widget placement can either survive reload or start fresh.`
- [ ] `Home-Page-Gen1-HLG-11. Home Page should include a Notepad persistence toggle so notes can either survive reload or be cleared from browser persistence.`
- [ ] `Home-Page-Gen1-HLG-12. Home Page should include a Recent Items persistence toggle when a recent-items owner exists, so recent/resume state can be remembered or forgotten intentionally.`
- [ ] `Home-Page-Gen1-HLG-13. Home Page should expose browser storage and quota usage when the browser provides that estimate.`
- [ ] `Home-Page-Gen1-HLG-14. Home Page should include a small GitHub link, docs link, and a brief version and what's-new summary.`

### Codex Level Goals

These CLG translate the `Generation 1` HLG into Codex-actionable family-phase routing. They are not implementation specs.

- [ ] Home-Page-Gen1-CLG-1. Define `Home Page` as a first-class workspace surface that can occupy the root slot without requiring a live `Model Viewport`.
- [ ] Home-Page-Gen1-CLG-2. Replace the protected-last-viewer assumption with an explicit zero-viewer return path to `Home Page`.
- [ ] Home-Page-Gen1-CLG-3. Add a startup preference that changes only first-launch behavior and does not disable the `Home Page` surface.
- [ ] Home-Page-Gen1-CLG-4. Provide launch and resume actions that hand off to existing workspace owners instead of duplicating Browser, Catalog, graph, or viewer ownership.
- [ ] Home-Page-Gen1-CLG-5. Inventory ParaHook-owned persisted browser data separately from browser-managed origin storage.
- [ ] Home-Page-Gen1-CLG-6. Add explicit user controls for graph persistence in browser storage without hiding graph truth inside `Home Page`.
- [ ] Home-Page-Gen1-CLG-7. Add a `Workspace Restore` persistence toggle that controls whether saved workspace layout restore survives browser reload and replaces the hidden restore prompt with explicit user preference.
- [ ] Home-Page-Gen1-CLG-8. Add a `View Settings` persistence toggle that controls whether view presentation preferences survive browser reload without making `Home Page` the viewer owner.
- [ ] Home-Page-Gen1-CLG-9. Add an `Environment` persistence toggle that controls reload memory for applied environment state such as Catalog-loaded HDRIs while leaving environment meaning with the Environment, Catalog apply, and viewer owners.
- [ ] Home-Page-Gen1-CLG-10. Add `Dashboard` and `Notepad` persistence toggles that control their existing persisted buckets without making `Home Page` the notes or dashboard layout owner.
- [ ] Home-Page-Gen1-CLG-11. Add a `Recent Items` persistence toggle only after a recent-items owner or storage bucket exists, keeping resume semantics outside `Home Page`.
- [ ] Home-Page-Gen1-CLG-12. Add browser storage/quota visibility when supported by the browser, clearly distinguishing unavailable estimates from zero usage.
- [ ] Home-Page-Gen1-CLG-13. Add small orientation links and version/what's-new summary without turning `Home Page` into the docs or release-notes owner.

### `Home-Page-1`

- [ ] Register and render `Home Page` as a workspace surface.
- [ ] Allow root workspace state to use `Home Page` when no `Model Viewport` is open.
- [ ] Add last-model-viewport-close return behavior.
- [ ] Add the startup preference and launch-time branch.
- [ ] Add first launch actions into existing workspace owners.
- [ ] `Home-Page-Gen1-HLG-1`
- [ ] `Home-Page-Gen1-HLG-2`
- [ ] `Home-Page-Gen1-CLG-1`
- [ ] `Home-Page-Gen1-CLG-2`
- [ ] `Home-Page-Gen1-CLG-3`
- [ ] `Home-Page-Gen1-CLG-4`

### `Home-Page-2`

- [ ] Inventory ParaHook-owned browser persistence buckets.
- [ ] Show ParaHook-owned persisted-data size separately from broader origin storage.
- [ ] Add non-destructive storage-health reads before any reset controls.
- [ ] Add graph browser-storage save preference only through the graph/persistence owner seam.
- [ ] Add a `Workspace Restore` persistence toggle for whether saved workspace layout is remembered on browser reload.
- [ ] Add a `View Settings` persistence toggle for whether view presentation preferences are remembered on browser reload.
- [ ] Add an `Environment` persistence toggle for whether applied environment state such as a Catalog-loaded HDRI is remembered on browser reload.
- [ ] Add `Dashboard` and `Notepad` persistence toggles for their existing browser-persisted buckets.
- [ ] Add a `Recent Items` persistence toggle only after the recent-items owner exists.
- [ ] Add browser storage/quota visibility when the platform supports it.
- [ ] `Home-Page-Gen1-HLG-3`
- [ ] `Home-Page-Gen1-HLG-4`
- [ ] `Home-Page-Gen1-HLG-5`
- [ ] `Home-Page-Gen1-HLG-6`
- [ ] `Home-Page-Gen1-HLG-7`
- [ ] `Home-Page-Gen1-HLG-8`
- [ ] `Home-Page-Gen1-HLG-9`
- [ ] `Home-Page-Gen1-HLG-10`
- [ ] `Home-Page-Gen1-HLG-11`
- [ ] `Home-Page-Gen1-HLG-12`
- [ ] `Home-Page-Gen1-HLG-13`
- [ ] `Home-Page-Gen1-CLG-5`
- [ ] `Home-Page-Gen1-CLG-6`
- [ ] `Home-Page-Gen1-CLG-7`
- [ ] `Home-Page-Gen1-CLG-8`
- [ ] `Home-Page-Gen1-CLG-9`
- [ ] `Home-Page-Gen1-CLG-10`
- [ ] `Home-Page-Gen1-CLG-11`
- [ ] `Home-Page-Gen1-CLG-12`

### `Home-Page-3`

- [ ] Add small GitHub and docs links.
- [ ] Add a brief version and what's-new summary.
- [ ] Keep longer docs, changelog, and release-note ownership outside `Home Page`.
- [ ] `Home-Page-Gen1-HLG-14`
- [ ] `Home-Page-Gen1-CLG-13`

## [ ] `Home-Page-1` - `Workspace Landing Surface And Startup Preference`

### Family Phase Summary

Make `Home Page` real enough to be the first startup surface and the zero-model-viewport return target before storage transparency or orientation content widens the surface.

This is the first family phase because later storage, persistence, and orientation work needs a truthful `Home Page` workspace surface to live on.

### HLG / CLG Coverage

- [ ] `Home-Page-Gen1-HLG-1. Home Page should be the first surface the user loads into.`
- [ ] `Home-Page-Gen1-HLG-2. There should be a toggle so the user can switch off Home Page first and load directly into Model Viewport.`
- [ ] Home-Page-Gen1-CLG-1. Define `Home Page` as a first-class workspace surface that can occupy the root slot without requiring a live `Model Viewport`.
- [ ] Home-Page-Gen1-CLG-2. Replace the protected-last-viewer assumption with an explicit zero-viewer return path to `Home Page`.
- [ ] Home-Page-Gen1-CLG-3. Add a startup preference that changes only first-launch behavior and does not disable the `Home Page` surface.
- [ ] Home-Page-Gen1-CLG-4. Provide launch and resume actions that hand off to existing workspace owners instead of duplicating Browser, Catalog, graph, or viewer ownership.

### Owns

- first-class workspace surface registration for `Home Page`
- root-slot `Home Page` rendering
- zero-model-viewport return behavior
- startup preference for `Home Page` first versus direct `Model Viewport`
- first launch actions into existing workspace owners

### Does Not Own

- graph persistence storage controls
- browser-storage inventory
- destructive storage reset
- Browser/project hierarchy
- Catalog item ownership
- full release notes or docs browsing

### Planning Read

The current `Home-Page-Vision.md` locks the long-range direction, and this index routes `Home-Page-1` as the first family phase.

The `Home-Page-1` Family Phase Doc has been prepped against this active Gen1 index.

The next implementation-ready slice is `Home-Page-1 / Phase 1 - Surface Registry And Minimal Render`.

Runtime implementation should start from that standalone Family Phase Doc and keep Phase 1 limited to registering and rendering the minimal `Home Page` surface.

### Family Phase Doc

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Home-Page/Future/Home-Page_Phase Home-Page-1 - Workspace Landing Surface And Startup Preference.md`

## [ ] `Home-Page-2` - `Storage Transparency And Persistence Toggles`

### Family Phase Summary

Expose ParaHook-owned browser persistence clearly and add user-facing persistence toggles, including graph browser-storage save behavior, workspace restore, view settings, `Environment` reload memory, Dashboard, Notepad, recent-items, and storage/quota visibility through the owning feature seams after `Home Page` exists as a real workspace surface.

This phase should make remembered browser state visible and user-controlled without making `Home Page` the owner of every feature's actual saved meaning.

### HLG / CLG Coverage

- [ ] `Home-Page-Gen1-HLG-3. Home Page should keep track of browser storage so the user can tell if there is a leak.`
- [ ] `Home-Page-Gen1-HLG-4. Home Page should help the user understand whether the app is storing data and bloating browser-side storage.`
- [ ] `Home-Page-Gen1-HLG-5. The user should be able to save what they have in their graphs in browser storage and turn that setting on or off.`
- [ ] `Home-Page-Gen1-HLG-6. Home Page should show and expose any app-owned data ParaHook stores on the user's computer or in browser storage.`
- [ ] `Home-Page-Gen1-HLG-7. Home Page should include a Workspace Restore persistence toggle so browser reload can either remember or forget the last saved workspace layout.`
- [ ] `Home-Page-Gen1-HLG-8. Home Page should include a View Settings persistence toggle so browser reload can either remember or forget view presentation preferences.`
- [ ] `Home-Page-Gen1-HLG-9. Home Page should include an Environment persistence toggle so browser reload can either remember or forget applied environment state such as a Catalog-loaded HDRI.`
- [ ] `Home-Page-Gen1-HLG-10. Home Page should include a Dashboard persistence toggle so dashboard lanes and widget placement can either survive reload or start fresh.`
- [ ] `Home-Page-Gen1-HLG-11. Home Page should include a Notepad persistence toggle so notes can either survive reload or be cleared from browser persistence.`
- [ ] `Home-Page-Gen1-HLG-12. Home Page should include a Recent Items persistence toggle when a recent-items owner exists, so recent/resume state can be remembered or forgotten intentionally.`
- [ ] `Home-Page-Gen1-HLG-13. Home Page should expose browser storage and quota usage when the browser provides that estimate.`
- [ ] Home-Page-Gen1-CLG-5. Inventory ParaHook-owned persisted browser data separately from browser-managed origin storage.
- [ ] Home-Page-Gen1-CLG-6. Add explicit user controls for graph persistence in browser storage without hiding graph truth inside `Home Page`.
- [ ] Home-Page-Gen1-CLG-7. Add a `Workspace Restore` persistence toggle that controls whether saved workspace layout restore survives browser reload and replaces the hidden restore prompt with explicit user preference.
- [ ] Home-Page-Gen1-CLG-8. Add a `View Settings` persistence toggle that controls whether view presentation preferences survive browser reload without making `Home Page` the viewer owner.
- [ ] Home-Page-Gen1-CLG-9. Add an `Environment` persistence toggle that controls reload memory for applied environment state such as Catalog-loaded HDRIs while leaving environment meaning with the Environment, Catalog apply, and viewer owners.
- [ ] Home-Page-Gen1-CLG-10. Add `Dashboard` and `Notepad` persistence toggles that control their existing persisted buckets without making `Home Page` the notes or dashboard layout owner.
- [ ] Home-Page-Gen1-CLG-11. Add a `Recent Items` persistence toggle only after a recent-items owner or storage bucket exists, keeping resume semantics outside `Home Page`.
- [ ] Home-Page-Gen1-CLG-12. Add browser storage/quota visibility when supported by the browser, clearly distinguishing unavailable estimates from zero usage.

### Owns

- ParaHook-owned persistence inventory
- broader origin-storage estimate read when the browser supports it
- storage-health summary language
- graph storage preference handoff
- workspace restore persistence toggle handoff
- view settings persistence toggle handoff
- environment persistence toggle handoff for reload memory such as Catalog-loaded HDRIs
- Dashboard and Notepad persistence toggle handoff
- recent-items persistence toggle handoff once a recent-items owner exists
- browser storage/quota visibility when supported

### Does Not Own

- first workspace-surface registration
- arbitrary cache cleanup
- silent data deletion
- graph truth itself
- environment state meaning, Catalog apply behavior, or viewer presentation state
- Dashboard, Notepad, or recent-items content truth

### Planning Read

`Home-Page-2` should wait until `Home-Page-1` makes `Home Page` a real workspace surface.

Before implementation, this family phase needs its own standalone Family Phase Doc. That doc should research the live persistence seams again so toggles only target real persisted buckets or explicitly planned owners.

### Family Phase Doc

- not created yet

## [ ] `Home-Page-3` - `Lightweight Orientation And What Is New`

### Family Phase Summary

Add small repo/docs/version orientation to `Home Page` once the launch and storage foundations are honest.

This phase keeps orientation deliberately small: it should help the user know where they are and where to go, without turning `Home Page` into the docs or changelog system.

### HLG / CLG Coverage

- [ ] `Home-Page-Gen1-HLG-14. Home Page should include a small GitHub link, docs link, and a brief version and what's-new summary.`
- [ ] Home-Page-Gen1-CLG-13. Add small orientation links and version/what's-new summary without turning `Home Page` into the docs or release-notes owner.

### Owns

- GitHub link
- docs link
- brief version read
- brief what's-new summary

### Does Not Own

- full docs navigation
- changelog authoring
- release-note system ownership
- project or Browser state

### Planning Read

`Home-Page-3` should wait until the workspace landing surface exists and storage/persistence visibility has a credible surface to sit beside.

Before implementation, this family phase needs its own standalone Family Phase Doc. Keep its first implementation phase small so the orientation area does not become a broad docs dashboard.

### Family Phase Doc

- not created yet
