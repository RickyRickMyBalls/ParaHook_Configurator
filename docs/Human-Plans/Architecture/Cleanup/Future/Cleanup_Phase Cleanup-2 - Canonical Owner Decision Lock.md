# Cleanup Phase Cleanup-2 - Canonical Owner Decision Lock

## Doc Header

### Doc History
1. 2026-04-12 13:42: Created this standalone `Cleanup 2` future phase doc to turn the Cleanup family ownership targets into one explicit decision-lock lane before broader refactors widen the gap between intended and actual owners

### Purpose

This doc defines the second cleanup phase for the `Cleanup` family.

Use it to answer:
- which owner decisions still need to be locked before deeper cleanup starts
- how to turn ownership targets into explicit cleanup rules
- which high-risk spread-truth areas need a decision before implementation work

Do not use it for:
- low-level refactor steps for a single file
- proving that the ownership split is already fully shipped
- replacing the broader reasoning in `Canonical-Ownership-Targets.md`

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface
  - cleanup phase ladder

- `../Canonical-Ownership-Targets.md`
  - broader ownership target map
  - current spread-truth hotspots

- `../Canonical-Owner-Decisions.md`
  - compact owner-decision sheet
  - current locked decisions

## Doc Body

## [ ] Cleanup 2 - Canonical Owner Decision Lock

### Header

Purpose:
- turn the current ownership target map into a more explicit and durable decision baseline that later cleanup phases can execute against without re-arguing where truth belongs

Owns:
- locking major `truth -> owner -> derived-only` rules
- tightening still-soft ownership decisions that affect multiple systems
- identifying which cleanup phases depend on those decisions being explicit first

Does not own:
- broad implementation of every later cleanup phase
- store splitting by itself
- Browser, AppShell, or graph-runtime code changes beyond what is needed to lock the decisions

### Why This Phase Exists

The cleanup family now has:
- a broad vision doc
- an ownership target map
- a compact owner-decision sheet

That is a strong start.

But before the repo starts a wider cleanup wave, ParaHook still needs a phase whose job is:
- deciding which ownership calls are truly locked
- deciding which ones are still provisional
- making the later cleanup phases converge on one answer instead of on local taste

Without that, later refactors can still accidentally produce:
- second owners
- selector-owned truth
- host-owned truth
- compatibility seams that keep acting permanent

### Scope

This phase covers:
- major ownership calls across app, workspace, graph, Browser, worker boundary, and transform systems
- locking what must remain derived versus what must be canonical
- identifying the highest-risk spread-truth areas that later phases should treat as fixed direction

This phase does not cover:
- boundary implementation itself
- AppShell extraction details
- project-content or Browser code changes
- graph-runtime acceptance rewiring

### Current High-Risk Decision Surfaces

The strongest still-important decision surfaces are:

- project content hierarchy versus Browser rows
- accepted build result truth versus app/project presentation
- transform-session truth versus toolbar/viewer/console entry points
- worker-facing shared contracts versus app implementation folders
- workspace surface focus/activation versus host-local focus behavior

### Locked Direction

- major product truth should have one canonical owner
- Browser rows, row VMs, and other read models stay derived
- hosts may coordinate behavior but should not become second owners
- migration helpers and compatibility seams are never final owners
- shared worker/app contracts need one explicit shared boundary

### Phase Ladder

## [ ] Phase 1 - Review Current Decisions Against Live Cleanup Targets

Purpose:
- compare `Canonical-Ownership-Targets.md` and `Canonical-Owner-Decisions.md` and identify which items are already solid enough to treat as locked

Expected output:
- a short list of:
  - locked decisions
  - soft decisions
  - unresolved decisions that block later phases

## [ ] Phase 2 - Lock The Cross-System Owner Calls

Purpose:
- make the biggest cross-system ownership calls explicit enough that Browser, AppShell, worker, and graph cleanup can all use the same answers

Target decisions:
- project hierarchy lives in `useAppStore`
- Browser rows stay derived
- workspace layout lives in `useWorkspaceStore`
- accepted build result truth lives in graph runtime state inside `useSpaghettiStore`
- worker request lifecycle lives in `buildDispatcher`
- transform sessions live in `useAppStore`

## [ ] Phase 3 - Record Derived-Only Surfaces Explicitly

Purpose:
- make the derived-only surfaces more explicit so later cleanup does not quietly re-promote them into hidden ownership

Focus surfaces:
- Browser rows
- debug inspector VMs
- preview render VMs
- viewport overlays
- node render fragments
- console prompt text

## [ ] Phase 4 - Name The Still-Unresolved Decision Gaps

Purpose:
- identify which ownership decisions are not fully lockable yet and should be carried as explicit later cleanup work rather than hidden ambiguity

Likely gaps:
- exact worker shared-boundary file/home
- optional workspace family product-scope owner
- any remaining accepted-result presentation seams still split across app/project/Browser layers

### Acceptance Checks

- the major ownership decisions can be cited without reopening the same architecture argument every time
- later cleanup phases have one stable owner-decision baseline
- derived-only surfaces are named explicitly enough to avoid second-owner drift

### Likely Related Files

- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`

### Success Read

This phase succeeds when:
- later cleanup phases can say "this owner is already locked"
- the repo has fewer soft ownership calls hiding inside feature-specific docs
- ownership cleanup starts feeling deliberate instead of interpretive
