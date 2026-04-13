# Cleanup 2 - Phase 1 - Current Live Cleanup Targets

## Doc Header

### Doc History
1. 2026-04-12 20:08:59: Implemented `Cleanup 2 - Phase 1 - Review Current Decisions Against Live Cleanup Targets` as the live findings report after a direct reread of `Cleanup-Index.md`, `Canonical-Ownership-Targets.md`, and `Canonical-Owner-Decisions.md`, sorting the current owner calls into `locked`, `soft`, and `unresolved` buckets and naming which later cleanup phases depend on the still-open decisions

### Purpose

This file records the live findings for `Cleanup 2 - Phase 1`.

Use it to answer:
- which cleanup owner calls already read as locked
- which owner calls still read as soft direction rather than fully locked decisions
- which unresolved gaps should block or shape later cleanup phases
- which later cleanup phases depend on those unresolved calls

Do not use it for:
- source-code refactor instructions
- proof that later cleanup phases already shipped
- replacing the broader reasoning in the main Cleanup family docs

### Relationship To Other Docs

- `Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`
  - parent cleanup phase doc
  - implementation ladder and stop rules

- `Canonical-Ownership-Targets.md`
  - broader ownership target map
  - hotspot and gap framing

- `Canonical-Owner-Decisions.md`
  - faster owner-decision sheet
  - current explicit `truth -> owner -> derived-only` answers

- `Cleanup-Index.md`
  - family order
  - dependency context for later cleanup phases

## Doc Body

### Phase 1 Result

Current read:
- `Cleanup 1` is shipped, so startup-path ambiguity is no longer the first blocker.
- The Cleanup family already has enough ownership language to sort most major truths into `locked` versus `still-soft` buckets.
- The real remaining gaps are narrower than the whole family and cluster around:
  - the exact worker shared-boundary home
  - the product-scope owner for optional workspace families
  - the last still-split accepted-result and active-focus semantics

Phase 1 outcome:
- this review pass is complete
- later cleanup phases can now cite one explicit findings surface instead of repeating another broad reread of the owner docs

### Locked Decisions

These currently read as locked enough that later cleanup phases should treat them as baseline direction rather than reopen them casually.

#### 1. App startup path

Decision:
- app startup lives in `src/main.tsx`

Supporting read:
- `Canonical-Owner-Decisions.md` names `src/main.tsx` as the canonical owner
- `Canonical-Ownership-Targets.md` says the same thing and now records the old `src/App.tsx` starter seam as retired

Later cleanup implication:
- later cleanup should preserve this shipped state instead of revisiting startup ownership

#### 2. Workspace layout and viewport-local presentation state

Decision:
- workspace layout and viewport-local presentation state live in `src/app/workspace/useWorkspaceStore.ts`

Supporting read:
- both owner docs align on `useWorkspaceStore` for slot tree, placement, active viewer viewport id, viewport-local chrome, and viewport result preference

Later cleanup implication:
- `Cleanup 4` and any later workspace cleanup should treat workspace store ownership as locked

#### 3. App-wide active workspace selection and project content hierarchy

Decision:
- active workspace selection and project content hierarchy live in `src/app/store/useAppStore.ts`

Supporting read:
- both owner docs align on `useAppStore` for active surface/selected target plus assemblies, components, content hierarchy, and content-side transform ownership

Later cleanup implication:
- `Cleanup 5` should treat Browser rows as projection over app-store truth rather than reopen the hierarchy owner question

#### 4. Graph document truth and accepted build-result truth

Decision:
- graph document truth and accepted build-result truth live in graph runtime state inside `src/app/spaghetti/store/useSpaghettiStore.ts`

Supporting read:
- both owner docs align on `useSpaghettiStore` for graph documents, topology, graph-local runtime state, and accepted build outputs/results

Later cleanup implication:
- `Cleanup 6` should tighten projection seams around this owner, not invent a second accepted-result owner

#### 5. Worker request lifecycle

Decision:
- worker request lifecycle lives in `src/app/buildDispatcher.ts`

Supporting read:
- both owner docs explicitly separate `buildDispatcher` lifecycle ownership from `bootstrapBuildWiring` startup glue

Later cleanup implication:
- `Cleanup 3` can treat lifecycle ownership as locked while still deciding the shared contract boundary home

#### 6. Browser rows and row view-models

Decision:
- Browser rows remain derived only

Supporting read:
- both owner docs explicitly say Browser rows or row VMs should not have a canonical owner store

Later cleanup implication:
- `Cleanup 5` should keep Browser structure read-model-only and avoid promoting row trees into product truth

#### 7. Transform sessions

Decision:
- transform sessions live in `src/app/store/useAppStore.ts`

Supporting read:
- both owner docs explicitly place active transform session identity, draft state, history, snap, space, and committed results in `useAppStore`

Later cleanup implication:
- `Cleanup 7` should unify control surfaces around this owner rather than reopen who owns transform-session state

#### 8. Viewer runtime state

Decision:
- viewer runtime state lives in the viewer layer

Supporting read:
- both owner docs separate viewer-owned runtime objects and renderer state from app-owned accepted data, result mode preference, and selection intent

Later cleanup implication:
- later viewer or workspace passes should preserve this app-versus-viewer split

#### 9. Console grammar

Decision:
- console grammar lives in `src/app/console/stagedNavigation.ts`

Supporting read:
- both owner docs treat staged console grammar as its own owner while keeping graph/workspace/reference truth outside it

Later cleanup implication:
- `Cleanup 8` can reduce console-controller sprawl without reassigning grammar ownership away from `stagedNavigation.ts`

### Soft Decisions

These decisions have strong visible direction, but the current docs still leave enough softer language or hotspot framing that later cleanup phases should handle them carefully instead of acting as if every detail is already settled.

#### 1. Worker-facing shared contracts

Current direction:
- worker-facing contracts belong in an explicit shared boundary

Why this is still soft:
- the owner docs say `explicit shared boundary`, `likely home`, and list more than one candidate path

Likely later owner:
- `Cleanup 3`

#### 2. Optional workspace-family product scope

Current direction:
- dashboard, notepad, and radio need one explicit product decision surface in docs and architecture

Why this is still soft:
- the current docs name the need clearly but do not yet identify the actual decision file or final ownership surface

Likely later owner:
- `Cleanup 9`

#### 3. Active workspace surface versus host-local focus behavior

Current direction:
- `useAppStore` owns active workspace surface and selected workspace target truth

Why this is still soft:
- `Canonical-Ownership-Targets.md` still names workspace active/focused surface as a spread-truth hotspot influenced by app store, workspace slot state, and multiple host components

Likely later owner:
- `Cleanup 4`

### Unresolved Decisions

These are the live gaps that should stay explicit until a later cleanup phase resolves them.

#### 1. Exact worker shared-boundary home

Gap:
- the Cleanup docs agree that worker-facing contracts need one explicit shared boundary, but they do not yet lock the exact file or folder home

Why it matters:
- without the concrete home, `Cleanup 3` could still spend time re-arguing path placement instead of just implementing the boundary

Depends on:
- `Cleanup 3 - Shared Boundary And Worker Contract Repair`

#### 2. Exact product decision surface for dashboard, notepad, and radio

Gap:
- the docs agree that optional workspace-family scope must be decided explicitly, but they do not yet name the canonical decision surface that will hold that answer

Why it matters:
- without that, shell wiring can keep implying product priority by accident

Depends on:
- `Cleanup 9 - Optional Workspace Family Scope Decisions`

#### 3. Any remaining accepted-result presentation seam outside graph runtime truth

Gap:
- the current docs lock graph runtime as the owner for accepted build-result truth, but they still preserve an explicit warning that some accepted-result presentation may feel split across graph runtime, app/project presentation, and Browser-facing derived structures

Why it matters:
- without naming the final remaining split more concretely, `Cleanup 6` could widen into another discovery pass

Depends on:
- `Cleanup 6 - Graph Runtime And Accepted Result Ownership`

### Phase Dependency Read

The current dependency map now reads:

- `Cleanup 3`
  - depends on resolving the exact shared worker-boundary home
- `Cleanup 4`
  - depends on tightening the remaining app-truth versus host-local focus semantics
- `Cleanup 5`
  - can proceed against a locked rule that Browser rows stay derived only
- `Cleanup 6`
  - depends on naming the last still-split accepted-result presentation seam more concretely during its own pass
- `Cleanup 7`
  - can proceed against a locked rule that transform sessions belong to `useAppStore`
- `Cleanup 8`
  - can proceed against a locked rule that console grammar ownership stays in `stagedNavigation.ts`
- `Cleanup 9`
  - depends on creating the explicit product decision surface for optional workspace families

### Summary Read

Phase 1 finding:
- most of the owner model is already stable enough to treat as locked
- the real remaining ambiguity is narrower than the broader Cleanup family language first suggested

Phase 2 readiness:
- `Cleanup 2 - Phase 2` should focus on converting the locked decisions above into a more explicit cross-system owner baseline
- it should not reopen startup truth, Browser-derived-only status, transform-session ownership, or worker-request-lifecycle ownership unless a direct contradiction appears

### Phase 1 Checklist

- [x] re-read `Cleanup-Index.md`, `Canonical-Owner-Decisions.md`, and `Canonical-Ownership-Targets.md` together
- [x] classify the current owner calls into `locked`, `soft`, and `unresolved`
- [x] name which later cleanup phases depend on each unresolved call
- [x] stop before source changes or broad companion-doc rewrites
