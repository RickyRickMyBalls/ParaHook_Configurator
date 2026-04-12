# Cleanup Phase Cleanup-5 - Project Content And Browser Derivation Cleanup

## Doc Header

### Doc History
1. 2026-04-12 13:42: Created this standalone `Cleanup 5` future phase doc to give project-content ownership and Browser-derivation cleanup one explicit planning surface under the Cleanup family

### Purpose

This doc defines the fifth cleanup phase for the `Cleanup` family.

Use it to answer:
- where project-content hierarchy truth should live
- what the Browser should keep derived instead of owning
- how to structure this cleanup lane before implementation starts

Do not use it for:
- Browser feature roadmap work unrelated to ownership cleanup
- detailed row rendering polish
- replacing Browser family docs

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Canonical-Ownership-Targets.md`
  - project hierarchy and Browser-row ownership targets

- `../Canonical-Owner-Decisions.md`
  - explicit decision that Browser rows are derived only

## Doc Body

## [ ] Cleanup 5 - Project Content And Browser Derivation Cleanup

### Header

Purpose:
- keep project-content hierarchy truth clearly canonical in `useAppStore` while reducing Browser rows and Browser-facing structures back to honest derived projections

Owns:
- project-content hierarchy versus Browser-row ownership clarity
- Browser derivation boundaries
- reduction of Browser-side shadow ownership

Does not own:
- broad Browser UX redesign
- unrelated project-content features
- transform-session cleanup beyond the Browser-derived boundary

### Why This Phase Exists

The Browser is one of the easiest places for false ownership to appear.

Why:
- it has a tree
- it has row ids
- it has drag/drop and menus
- it can start to feel like the thing that owns hierarchy

But cleanup direction is already clear:
- project hierarchy lives in `useAppStore`
- Browser rows are derived only

This phase exists to make sure the code follows that rule more honestly.

### Scope

This phase covers:
- project content hierarchy ownership
- Browser row derivation
- Browser-side hierarchy leakage
- keeping Browser row state as presentation rather than product truth

This phase does not cover:
- every Browser feature or interaction
- general Browser polish
- wider store decomposition outside the ownership need

### Locked Direction

- assemblies, components, object ownership, and parent-child content hierarchy live in `useAppStore`
- Browser rows are derived presentation over that truth
- row ids may be stable, but row VMs are not canonical product truth
- Browser controllers and selectors should not become hierarchy owners

### Phase Ladder

## [ ] Phase 1 - Reconfirm Project Hierarchy Truth In App Store

Purpose:
- make the project-content owner read explicit before Browser cleanup starts

Focus:
- assemblies
- components
- parent-child content hierarchy
- content-object ownership
- visibility and transform-side content ownership

## [ ] Phase 2 - Trace Browser Shadow-Ownership Seams

Purpose:
- find where Browser rows, selectors, or Browser-side helpers are acting like hierarchy owners instead of projections

Likely hotspots:
- row-building seams
- drag/drop target semantics
- Browser-specific hierarchy adaptation layers

## [ ] Phase 3 - Reduce Browser Rows To Projection Surfaces

Purpose:
- keep Browser tree rows, row VMs, and Browser structure derived from project content rather than stored as competing hierarchy truth

Expected outcome:
- Browser rows become easier to regenerate from app truth
- hierarchy changes have one canonical home

## [ ] Phase 4 - Prove Browser Still Reads Honest Hierarchy

Purpose:
- verify that the Browser still renders the right structure after ownership is tightened

### Acceptance Checks

- project hierarchy truth clearly lives in `useAppStore`
- Browser rows stay derived only
- Browser-specific structures no longer feel like a second source of truth

### Likely Related Files

- `src/app/store/useAppStore.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/panels/useBrowserPanelController.ts`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/`

### Success Read

This phase succeeds when:
- hierarchy changes have one obvious owner
- Browser rows feel like views, not data owners
- Browser cleanup can proceed without re-litigating hierarchy truth
