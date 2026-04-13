# Cleanup Phase Cleanup-4A - Workspace Surface Catalog And Capability Registry

## Doc Header

### Doc History
1. 2026-04-12 21:24: Created this standalone `Cleanup 4A` future phase doc to hold the workspace-surface catalog and capability-registry cleanup lane under the Cleanup family

### Purpose

This doc defines the `Cleanup 4A` follow-on phase for the `Cleanup` family.

Use it to answer:
- what workspace-surface taxonomy problem still remains after `Cleanup 4`
- how workspace surfaces should be cataloged without scattering policy across many `surfaceKind` branches
- what the likely cleanup ladder is for converging on one capability registry and onboarding rule

Do not use it for:
- deciding final optional-surface product scope for dashboard, notepad, or radio
- designing new workspace UX behavior
- replacing the broader `Workspace-Modes/` architecture family

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface

- `../Cleanup-Vision.md`
  - repo-shape north star and workspace-surface framing

- `../Canonical-Ownership-Targets.md`
  - workspace ownership targets and scope hotspots

- `Cleanup_Phase Cleanup-4 - Workspace Truth And AppShell Simplification.md`
  - prerequisite top-level workspace owner cleanup

- `../../Workspace-Modes/Workspace-Modes-Index.md`
  - broader workspace-family architecture direction

## Doc Body

## [ ] Cleanup 4A - Workspace Surface Catalog And Capability Registry

### Header

Purpose:
- make workspace-surface capabilities and taxonomy explicit in one place so surface policy stops being inferred from repeated `surfaceKind` branches spread across workspace render, actions, persistence, labels, and host selectors

Owns:
- workspace-surface capability catalog direction
- workspace-surface taxonomy cleanup
- future surface onboarding rules
- reducing duplicated workspace-surface policy branches

Does not own:
- top-level workspace layout truth
- final optional-surface keep/retire decisions
- viewer-local tool or command-family design

### Why This Phase Exists

The repo already has one real seam for workspace surfaces:
- `src/app/workspace/workspaceShellTypes.ts`

But the actual surface-policy story is still spread around:
- render routing in `ViewportSurfaceRegistry.tsx`
- surface action behavior in `workspaceSurfaceActions.ts`
- persistence allow-lists in `workspacePersistence.ts`
- labels and menu affordances in `workspaceViewportLabels.ts` and `ViewportFrame.tsx`
- host assumptions in `useAppShellWorkspaceSelectors.ts` and related shell helpers

That spread is manageable with a small surface set.

It becomes riskier as ParaHook grows more workspace candidates such as:
- Browser
- Console
- Spaghetti Editor
- Model Viewport
- Dashboard
- Notepad
- later Export, Layers, Debug Inspector, comparison surfaces, and others

There is also one especially important mismatch already visible:
- `Radio` behaves like a real product/runtime surface through `RadioRuntimeHost.tsx`
- but it is not a `WorkspaceSurfaceKind`

This phase exists so cleanup can answer those questions deliberately instead of letting them stay encoded in one-off branches.

### Scope

This phase covers:
- current workspace-surface taxonomy
- capability rules for current workspace surfaces
- where surface policy should be stored
- new-surface onboarding rules

This phase does not cover:
- adding new workspace families
- final keep/optional/retire calls for secondary surfaces
- turning viewport-local tools into workspace surfaces by default

### Current Read

The live repo already contains a partially centralized surface model, but not a complete one.

- `src/app/workspace/workspaceShellTypes.ts`
  - already defines `WorkspaceSurfaceKind`
  - already carries core workspace placement types
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - still hardcodes render behavior per surface kind
- `src/app/workspace/workspaceSurfaceActions.ts`
  - still hardcodes action behavior and compatibility seams per surface kind
- `src/app/workspace/workspacePersistence.ts`
  - still hardcodes which surface kinds are persisted and restored
- `src/app/workspace/workspaceViewportLabels.ts`
  - still hardcodes surface labels and naming rules
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
  - still contains repeated detached-surface and slot-count logic by surface kind

Current taxonomy ambiguity also remains around distinctions such as:
- real workspace surface
- optional workspace surface
- viewport-local tool
- background runtime
- non-workspace feature family

### Locked Direction

- `WorkspaceSurfaceKind` should stay the canonical identity seam for real workspace-hosted surfaces
- surface capabilities should be answerable from one explicit catalog instead of from repeated ad hoc branches
- the catalog should distinguish capability from scope
  - capability example: supports `slotted`, `floating`, or `popout`
  - scope example: core, optional, background-runtime, or not a workspace surface
- future surfaces should have to pass one onboarding checklist before they become first-class workspace kinds
- viewport-local tools and background runtimes should not quietly become workspace kinds just because they need UI

### Phase Ladder

## [ ] Phase 1 - Lock The Workspace Surface Taxonomy Baseline

Purpose:
- define the current classification buckets that later cleanup phases should use when talking about workspace-related surfaces

Focus:
- real workspace surface
- optional workspace surface
- viewport-local tool
- background runtime
- non-workspace feature family

## [ ] Phase 2 - Audit Capability Drift Across Current Surface Branches

Purpose:
- inventory where capability and policy are currently duplicated across render, actions, persistence, labels, and host selectors

Likely hotspots:
- `workspaceShellTypes.ts`
- `ViewportSurfaceRegistry.tsx`
- `workspaceSurfaceActions.ts`
- `workspacePersistence.ts`
- `workspaceViewportLabels.ts`
- `useAppShellWorkspaceSelectors.ts`

## [ ] Phase 3 - Define The Canonical Surface Catalog Contract

Purpose:
- decide the shape of the one capability registry the workspace layer should depend on

Focus:
- canonical surface id
- label
- supports slotted/floating/popout
- singleton versus multi-instance
- scope classification
- onboarding expectations for new surface families

## [ ] Phase 4 - Repoint Repeated Surface Policy To The Catalog

Purpose:
- reduce repeated policy branches by having render, action, persistence, and labeling seams read from one shared surface-catalog contract

Focus:
- render routing
- action helpers
- persistence allow-lists
- label and menu surfaces
- host selectors and detached-surface filters

### Acceptance Checks

- one explicit doc-backed answer exists for what counts as a workspace surface
- workspace-surface capabilities are answerable from one canonical catalog contract
- repeated `surfaceKind` policy branches are reduced
- future workspace families have a clear onboarding rule instead of landing as shell special cases
- background runtimes and viewport-local tools are no longer implicitly treated as workspace surfaces

### Likely Related Files

- `src/app/workspace/workspaceShellTypes.ts`
- `src/app/workspace/ViewportSurfaceRegistry.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/workspacePersistence.ts`
- `src/app/workspace/workspaceViewportLabels.ts`
- `src/app/hosts/useAppShellWorkspaceSelectors.ts`
- `src/app/AppShell.tsx`
- `src/app/hosts/RadioRuntimeHost.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

### Success Read

This phase succeeds when:
- ParaHook has one clear answer for what a workspace surface is and what it can do
- adding a new workspace family no longer requires editing many unrelated policy branches without guidance
- workspace families, viewport-local tools, and background runtimes stop blurring together in the architecture story

