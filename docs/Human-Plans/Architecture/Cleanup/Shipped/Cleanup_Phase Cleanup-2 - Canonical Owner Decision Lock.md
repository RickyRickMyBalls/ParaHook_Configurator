# Cleanup Phase Cleanup-2 - Canonical Owner Decision Lock

## Doc Header

### Doc History
9. 2026-04-12 20:39:22: Completed `Phase 4 - Name The Still-Unresolved Decision Gaps` as a docs-and-verification pass by promoting the live Cleanup owner-doc gap wording into one explicit unresolved-gap baseline inside this phase doc, tying each remaining gap to why it still matters and which later cleanup phase owns the follow-through while keeping the softer workspace-focus follow-on out of the main unresolved bucket
8. 2026-04-12 20:37:31: Tightened `Phase 4 - Name The Still-Unresolved Decision Gaps` into an implementation-ready docs-and-verification pass grounded in the live unresolved-gap wording from the Cleanup owner docs and the completed `Phase 1` findings report, narrowing the next work to recording one explicit carry-forward gap baseline without reopening the already-locked owner baseline or the completed derived-only baseline
7. 2026-04-12 20:31:22: Completed `Phase 3 - Record Derived-Only Surfaces Explicitly` as a docs-and-verification pass by promoting the cleanup owner-doc derived-only inventory into one explicit baseline inside this phase doc, tying the main projection and render-shape surfaces back to their canonical owner truths while keeping the wider supporting examples visible without widening into implementation cleanup
6. 2026-04-12 20:26:54: Tightened `Phase 3 - Record Derived-Only Surfaces Explicitly` into an implementation-ready docs-and-verification pass grounded in the existing derived-only inventory from the cleanup owner docs, narrowing the next work to recording one explicit derived-only baseline without widening into source cleanup, ownership rewrites, or unresolved-gap decisions that belong to later phases
5. 2026-04-12 20:24:25: Completed `Phase 2 - Lock The Cross-System Owner Calls` as a docs-and-verification pass by promoting the locked Phase 1 findings into one explicit cross-system owner baseline inside this phase doc while keeping the still-unresolved worker shared-boundary home, optional workspace-family product decision surface, and accepted-result presentation seam visible as carry-forward gaps
4. 2026-04-12 20:12: Tightened `Phase 2 - Lock The Cross-System Owner Calls` into an implementation-ready doc-first pass using the completed `Cleanup 2 - Phase 1` findings, narrowing the next work to formalizing the already-locked cross-system owners into a more explicit baseline while deliberately carrying the still-unresolved worker-boundary home, optional workspace-family decision surface, and remaining accepted-result seam forward instead of pretending those are already solved
3. 2026-04-12 20:08:59: Completed `Phase 1 - Review Current Decisions Against Live Cleanup Targets` as a docs-and-verification pass, added the standalone findings report `Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`, and marked the phase complete after sorting the current owner model into `locked`, `soft`, and `unresolved` buckets plus naming the later cleanup phases that depend on the still-open gaps
2. 2026-04-12 20:05: Tightened `Phase 1 - Review Current Decisions Against Live Cleanup Targets` into an implementation-ready doc-first pass after a fresh reread of `Cleanup-Index.md`, `Canonical-Ownership-Targets.md`, and `Canonical-Owner-Decisions.md` confirmed that many owner calls are already stable enough to classify as locked while the real remaining gaps are narrower: the exact worker shared-boundary home, the optional workspace-family product-scope decision surface, and any still-split accepted-result or focus semantics that later cleanup phases may need to tighten explicitly
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

## [x] Cleanup 2 - Canonical Owner Decision Lock

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

## [x] Phase 1 - Review Current Decisions Against Live Cleanup Targets

### Header

Purpose:
- compare the current cleanup owner docs against each other after shipped `Cleanup 1` and sort the owner calls into `locked`, `soft`, and `unresolved` buckets before `Phase 2` starts tightening cross-system decisions

Current read:
- `Cleanup 1` is now shipped, so the Cleanup family can move past startup truth and treat ownership decisions as the next real cross-cutting prerequisite
- `Canonical-Owner-Decisions.md` already acts like a fast locked-answer sheet for many major truths
- `Canonical-Ownership-Targets.md` still carries some intentionally softer language such as `target`, `likely home`, and `current likely candidates`
- the current explicit decision-gap list is already narrower than the full cleanup family:
  - exact shared boundary for worker-facing contracts
  - explicit product decision surface for dashboard, notepad, and radio
  - any remaining accepted-result presentation seam that still feels split away from graph runtime truth

Current live Phase 1 seams:
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - says `Cleanup 2` is the next cleanup phase after startup-path canonicalization
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
  - already names many owner answers in `truth -> owner -> derived-only` form
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - holds the broader target map plus the current hotspot/gap framing

Read:
- many owner calls already look stable enough to treat as locked now rather than keeping them all in one blurry provisional bucket
- the real `Phase 1` work is not to invent new ownership theory, but to sort what is already effectively settled versus what still needs a later lock pass
- this should stay a doc-first review pass, not an eager source or architecture rewrite
- the completed review now lives in `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`

Locked Phase 1 in-scope:
- compare `Canonical-Ownership-Targets.md` and `Canonical-Owner-Decisions.md` item-by-item
- produce an explicit three-way review in this phase doc:
  - locked decisions
  - soft decisions
  - unresolved decisions
- name which later cleanup phases depend on the unresolved calls
- tighten this phase doc so `Phase 2` can lock cross-system owner calls without needing another discovery pass

Locked Phase 1 out-of-scope:
- changing source files
- implementing the shared worker boundary
- splitting stores or hosts
- rewriting Browser, AppShell, transform, or graph-runtime behavior
- broad edits to the companion owner docs unless a tiny contradiction must be corrected for the review to stay honest

Strongest review sources for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`

Preferred Phase 1 implementation shape:
- keep this as a docs-and-verification pass
- let this phase doc do the sorting work first
- avoid reopening the owner docs themselves unless the review finds direct wording drift that would make the buckets misleading

Implementation spec:
1. Re-read `Cleanup-Index.md`, `Canonical-Owner-Decisions.md`, and `Canonical-Ownership-Targets.md` together.
2. Build an explicit `locked / soft / unresolved` review inside this phase doc using the live owner wording rather than inventing new system names.
3. Treat the following decisions as the initial candidates to confirm as `locked` if the reread still agrees:
   - app startup path -> `src/main.tsx`
   - workspace layout and viewport-local presentation state -> `useWorkspaceStore`
   - active workspace selection and project content hierarchy -> `useAppStore`
   - graph document truth and accepted build-result truth -> graph runtime state inside `useSpaghettiStore`
   - worker request lifecycle -> `buildDispatcher`
   - Browser rows and similar row/view-model structures -> derived only
   - transform sessions -> `useAppStore`
   - viewport result preference -> `useWorkspaceStore`
   - viewer runtime state -> viewer layer
   - console grammar -> `stagedNavigation.ts`
4. Treat the following as the initial candidates to keep `soft` or `unresolved` unless the reread proves they are already fully locked:
   - the exact worker shared-boundary file/home
   - the explicit product decision surface for dashboard, notepad, and radio
   - any remaining accepted-result presentation seam that still feels split across graph/app/Browser reads
   - any remaining ambiguity between app-owned active workspace target truth and host-local focus behavior
5. Stop once this phase doc is explicit enough that `Phase 2` can become a true decision-lock pass instead of another review pass.

Implementation stop rule:
- `Phase 1` is done once later cleanup phases can point at one explicit review surface that says which owner calls are already locked and which still need deliberate follow-on work
- if the companion docs already say enough, do not widen this into a broader cleanup-family rewrite just to make the phase look larger

Checklist:
- [x] re-read `Cleanup-Index.md`, `Canonical-Owner-Decisions.md`, and `Canonical-Ownership-Targets.md` together
- [x] classify the current owner calls into `locked`, `soft`, and `unresolved`
- [x] name which later cleanup phases depend on each unresolved call
- [x] stop before source changes or broad companion-doc rewrites

Done shape:
- `Cleanup 2` has one explicit review pass instead of another vague "look at the owner docs" instruction
- `Phase 2` can lock cross-system owner calls against a named baseline rather than another open-ended reread
- later cleanup phases can tell whether they are acting on locked direction or still-open ownership questions
- the live findings report now exists in `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`

Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`
- optionally edit companion cleanup owner docs only if the review finds a direct contradiction that would make the phase summary dishonest

Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- confirm the resulting `locked / soft / unresolved` buckets match the live wording in those docs rather than relying on memory

## [x] Phase 2 - Lock The Cross-System Owner Calls

### Header

#### Purpose:
- make the already-locked cross-system ownership calls explicit enough that Browser, AppShell, worker, graph-runtime, and transform cleanup can all use the same answers without reopening those same owner arguments

#### Current read:
- `Phase 1` is complete and its findings report already sorted the current owner model into `locked`, `soft`, and `unresolved`
- the strongest currently locked owner calls are:
  - app startup path -> `src/main.tsx`
  - workspace layout and viewport-local presentation state -> `useWorkspaceStore`
  - active workspace selection and project content hierarchy -> `useAppStore`
  - graph document truth and accepted build-result truth -> graph runtime state inside `useSpaghettiStore`
  - worker request lifecycle -> `buildDispatcher`
  - Browser rows -> derived only
  - transform sessions -> `useAppStore`
  - viewer runtime state -> viewer layer
  - console grammar -> `stagedNavigation.ts`
- the still-open questions are narrower and should stay outside this phase:
  - exact worker shared-boundary home
  - exact product decision surface for dashboard, notepad, and radio
  - any final accepted-result presentation seam outside graph runtime truth

#### Read:
- `Phase 2` should not repeat the Phase 1 review and it should not widen into code-moving refactor work
- the right job here is to formalize the locked owner calls into a more explicit cross-system baseline that later cleanup phases can cite directly
- this should stay a docs-and-verification pass

#### Locked Phase 2 in-scope:
- promote the `locked` findings from `Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md` into a short explicit cross-system owner baseline
- keep the owner answers citable in one place for later cleanup phases
- note the important derived or supporting-only surfaces where that helps keep the baseline honest
- keep the unresolved items visible as carry-forward gaps instead of quietly pretending they are already solved

#### Locked Phase 2 out-of-scope:
- source-code refactors
- implementing the worker shared boundary
- deciding the optional workspace-family product-scope surface
- resolving the final accepted-result presentation seam if the docs do not already lock it
- broad rewrites of the companion owner docs beyond small wording alignment if a contradiction appears

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`

#### Preferred Phase 2 implementation shape:
- keep this as a docs-and-verification pass
- turn the live `locked` findings into a short explicit owner baseline
- leave the unresolved items named as carry-forward gaps instead of diluting the baseline with guesswork

### Implementation spec:
1. Re-read the completed Phase 1 findings report together with `Canonical-Owner-Decisions.md` and `Canonical-Ownership-Targets.md`.
2. Build an explicit cross-system owner-baseline section inside this phase doc that locks, at minimum:
   - app startup path -> `src/main.tsx`
   - workspace layout and viewport-local presentation state -> `useWorkspaceStore`
   - active workspace selection and project content hierarchy -> `useAppStore`
   - graph document truth and accepted build-result truth -> graph runtime state inside `useSpaghettiStore`
   - worker request lifecycle -> `buildDispatcher`
   - Browser rows and row view-models -> derived only
   - transform sessions -> `useAppStore`
   - viewport result preference -> `useWorkspaceStore`
   - viewer runtime state -> viewer layer
   - console grammar -> `stagedNavigation.ts`
3. For each locked owner call, keep one short note naming the important derived or supporting-only surfaces where helpful.
4. Add one short carry-forward block naming the unresolved items that stay outside this phase:
   - exact worker shared-boundary home
   - exact optional workspace-family product decision surface
   - final accepted-result presentation seam outside graph runtime truth
5. Stop once later cleanup phases can cite this phase as the cross-system owner baseline without needing to reread the whole family.

#### Implementation stop rule:
- `Phase 2` is done once the cleanup family has one explicit cross-system owner baseline that later phases can cite directly
- do not widen this into source changes or into solving the unresolved items just to make the phase feel larger

#### Checklist:
- [x] re-read the Phase 1 findings report plus the two owner docs
- [x] write the explicit cross-system locked-owner baseline
- [x] keep the unresolved items visible as carry-forward gaps
- [x] stop before source changes or broad companion-doc rewrites

#### Target decisions:
- project hierarchy lives in `useAppStore`
- Browser rows stay derived
- workspace layout lives in `useWorkspaceStore`
- accepted build result truth lives in graph runtime state inside `useSpaghettiStore`
- worker request lifecycle lives in `buildDispatcher`
- transform sessions live in `useAppStore`

#### Done shape:
- later cleanup phases can cite one short locked owner baseline instead of re-parsing the whole cleanup-family owner language
- the already-settled owner calls feel explicit rather than merely implied
- unresolved items remain visible without muddying the locked baseline

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`
- optionally tighten one companion owner doc only if a direct contradiction appears while writing the baseline

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- confirm the locked-owner baseline matches the completed Phase 1 findings rather than inventing new unresolved work

#### Cross-System Owner Baseline

This is the locked baseline later cleanup phases should cite directly unless a narrower later phase explicitly resolves one of the named carry-forward gaps.

##### 1. App startup path

Locked owner:
- `src/main.tsx`

Derived or supporting only:
- `src/app/main.tsx`
  - root composition
- `src/app/bootstrapBuildWiring.ts`
  - startup glue

Rule:
- startup truth stays in `src/main.tsx`; support wiring must not regrow into a second entry story

##### 2. Workspace layout and viewport-local presentation state

Locked owner:
- `src/app/workspace/useWorkspaceStore.ts`

Derived or supporting only:
- `AppShell`
- host components
- popup shells

Rule:
- slot tree, placement, active viewer viewport id, viewport-local chrome, and viewport-local presentation state stay workspace-owned

##### 3. Active workspace selection and project content hierarchy

Locked owner:
- `src/app/store/useAppStore.ts`

Derived or supporting only:
- Browser rows
- Console reads
- host-local focus behavior

Rule:
- active workspace target truth and project content hierarchy stay app-owned even when Browser, Console, or host surfaces project them

##### 4. Graph document truth and accepted build-result truth

Locked owner:
- graph runtime state inside `src/app/spaghetti/store/useSpaghettiStore.ts`

Derived or supporting only:
- app-level project presentation
- Browser-facing result presentation
- node render components

Rule:
- graph documents, graph-local runtime state, and accepted build results stay graph-runtime truth instead of splitting across app or Browser projection layers

##### 5. Worker request lifecycle

Locked owner:
- `src/app/buildDispatcher.ts`

Derived or supporting only:
- `src/app/bootstrapBuildWiring.ts`
  - wiring glue, not lifecycle truth

Rule:
- request sequencing, supersession bookkeeping, and transport normalization stay dispatcher-owned

##### 6. Browser rows and row view-models

Locked owner:
- no canonical owner store should exist

Derived or supporting only:
- `src/app/panels/selectBrowserTreeRows.ts`
- current-project row builders in `useAppStore`

Rule:
- Browser rows remain derived read models over app and graph truth, not product truth of their own

##### 7. Transform sessions

Locked owner:
- `src/app/store/useAppStore.ts`

Derived or supporting only:
- `Viewer`
- `ReferenceTransformToolbar`
- `Console`
- Browser actions

Rule:
- transform session identity, draft state, history, snap, space, and committed results stay app-owned across all entry surfaces

##### 8. Viewport result preference

Locked owner:
- `src/app/workspace/useWorkspaceStore.ts`

Derived or supporting only:
- selectors that choose which accepted result to display

Rule:
- viewport result preference stays in workspace presentation state even when graph or viewer layers supply the actual result data

##### 9. Viewer runtime state

Locked owner:
- viewer layer

App-owned instead:
- accepted data
- result mode preference
- selection and intent

Rule:
- viewer engine/runtime details stay viewer-owned while app truth remains app-side

##### 10. Console grammar

Locked owner:
- `src/app/console/stagedNavigation.ts`

Derived or supporting only:
- graph, workspace, and reference truth pulled from stores and selectors

Rule:
- console grammar owns staged navigation rules and scope transitions, not the underlying product truth it reads

#### Carry-Forward Gaps

These stay outside `Phase 2` and should remain explicit until their later cleanup phases resolve them.

##### 1. Exact worker shared-boundary home

Carry-forward:
- worker-facing shared contracts need one explicit shared boundary, but the exact file or folder home is still unresolved

Owned later by:
- `Cleanup 3 - Shared Boundary And Worker Contract Repair`

##### 2. Exact optional workspace-family product decision surface

Carry-forward:
- dashboard, notepad, and radio still need one explicit product decision surface that says whether they are core, optional, or transitional

Owned later by:
- `Cleanup 9 - Optional Workspace Family Scope Decisions`

##### 3. Final accepted-result presentation seam outside graph runtime truth

Carry-forward:
- graph runtime truth is locked, but any remaining accepted-result presentation split across app or Browser projection layers should stay visible until the later graph-runtime ownership pass tightens it

Owned later by:
- `Cleanup 6 - Graph Runtime And Accepted Result Ownership`

## [x] Phase 3 - Record Derived-Only Surfaces Explicitly

### Header

#### Purpose:
- make the derived-only surfaces explicit enough that later cleanup phases can point at one citable baseline instead of quietly re-promoting projections, overlays, and view-models into hidden owners

#### Current read:
- `Phase 2` now locks the major cross-system owners, but later cleanup can still drift if the repo only names owners and never records the matching surfaces that must stay derived
- `Canonical-Ownership-Targets.md` already contains a direct `Things That Should Stay Derived` inventory
- `Canonical-Owner-Decisions.md` already states the general rule that formatting, projection, and rendering shape should stay derived rather than becoming product truth
- the strongest currently visible derived-only surfaces are:
  - Browser row view-models
  - debug inspector view-models
  - preview render view-models
  - viewport overlay render state
  - node render fragments
  - console prompt text

#### Read:
- `Phase 3` should stay a docs-and-verification pass
- the right job here is to promote the existing derived-only inventory into one explicit baseline that later cleanup phases can cite alongside the Phase 2 owner baseline
- this phase should clarify which surfaces are useful projections versus real owners without widening into code cleanup or unresolved ownership decisions

#### Locked Phase 3 in-scope:
- re-read the current derived-only language in `Canonical-Ownership-Targets.md` and the supporting quick-rule language in `Canonical-Owner-Decisions.md`
- build one explicit derived-only baseline section inside this phase doc
- keep each listed surface attached to the owner truth it reads from where that helps prevent second-owner drift
- keep the pass honest about what is definitely derived versus what still belongs in later unresolved-gap work

#### Locked Phase 3 out-of-scope:
- source-code refactors
- rewriting Browser, inspector, viewer, node-render, or console systems
- resolving worker shared-boundary placement
- resolving optional workspace-family scope
- resolving accepted-result presentation seams that belong to later cleanup phases
- broad rewrites of the companion owner docs beyond tiny wording alignment if a contradiction appears

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`

#### Preferred Phase 3 implementation shape:
- keep this as a docs-and-verification pass
- turn the existing derived-only inventory into a short explicit baseline
- name the canonical owner truth those surfaces read from when that helps later cleanup stay honest
- avoid turning the phase into a second unresolved-gap review

### Implementation spec:
1. Re-read the `Things That Should Stay Derived` section in `Canonical-Ownership-Targets.md` together with the derived-only rules in `Canonical-Owner-Decisions.md`.
2. Build an explicit derived-only baseline section inside this phase doc that records, at minimum:
   - Browser row view-models
   - debug inspector view-models
   - preview render view-models
   - viewport overlay render state
   - node render fragments
   - console prompt text
3. For each derived-only surface, keep one short note naming the canonical owner truth it reads from or projects where that helps prevent second-owner drift.
4. If the reread still agrees, keep the broader derived-only candidates visible as supporting examples rather than widening them into a second long audit:
   - tooltip text
   - compatibility adapters
   - migration shims
   - host-local floating window geometry helpers
5. Stop once later cleanup phases can cite this phase for "this surface must stay derived" without rereading the broader owner docs.

#### Implementation stop rule:
- `Phase 3` is ready to implement once the next pass can write one explicit derived-only baseline without first rediscovering which surfaces are projections rather than owners
- do not widen this into source cleanup, owner reassignment, or unresolved-gap decisions just to make the phase feel larger

#### Checklist:
- [x] re-read the derived-only inventory in `Canonical-Ownership-Targets.md` and the supporting rules in `Canonical-Owner-Decisions.md`
- [x] write the explicit derived-only baseline
- [x] attach each listed surface to the owner truth it reads from where helpful
- [x] keep wider examples visible without turning the phase into a second audit
- [x] stop before source changes or unresolved-gap decisions

#### Target surfaces:
- Browser row view-models
- debug inspector view-models
- preview render view-models
- viewport overlay render state
- node render fragments
- console prompt text

#### Done shape:
- later cleanup phases can cite one short derived-only baseline instead of inferring it from scattered owner-doc wording
- projections, overlays, and render-shape helpers are less likely to drift back into hidden ownership
- the cleanup family now records both sides of the ownership rule:
  - which truths have canonical owners
  - which useful UI/system surfaces must stay derived

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`
- optionally tighten one companion cleanup owner doc only if the reread finds a direct contradiction that would make the derived-only baseline misleading

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- confirm the resulting derived-only baseline matches the existing cleanup owner language rather than inventing new owner decisions

#### Derived-Only Baseline

These surfaces are useful projections, render helpers, or interaction-facing shapes. They stay derived and must not be promoted into canonical product truth.

##### 1. Browser row view-models

Derived-only surface:
- Browser row view-models

Reads from:
- project content hierarchy in `src/app/store/useAppStore.ts`
- graph document and accepted-result truth in `src/app/spaghetti/store/useSpaghettiStore.ts`

Rule:
- Browser rows may organize and format app and graph truth for display, but they do not own project hierarchy or accepted-result truth

##### 2. Debug inspector view-models

Derived-only surface:
- debug inspector view-models

Reads from:
- runtime and owner state published by app, workspace, graph, or worker systems

Rule:
- inspector VMs narrate and format runtime state for debugging; they must not become the authoritative store for the behavior they describe

##### 3. Preview render view-models

Derived-only surface:
- preview render view-models

Reads from:
- accepted graph-runtime results in `src/app/spaghetti/store/useSpaghettiStore.ts`
- viewport result preference and workspace-local presentation state in `src/app/workspace/useWorkspaceStore.ts`

Rule:
- render VMs choose and package what to show, but they do not own result truth or viewport preference

##### 4. Viewport overlay render state

Derived-only surface:
- viewport overlay render state

Reads from:
- workspace presentation state in `src/app/workspace/useWorkspaceStore.ts`
- app selection and transform-session truth in `src/app/store/useAppStore.ts`
- viewer runtime state in the viewer layer

Rule:
- overlays reflect current selection, workspace, and viewer conditions; they do not own those underlying truths

##### 5. Node render fragments

Derived-only surface:
- node render fragments

Reads from:
- graph document truth in `src/app/spaghetti/store/useSpaghettiStore.ts`
- staged console or selection reads where applicable

Rule:
- node render output is presentation over graph truth and should never become a second owner of graph state

##### 6. Console prompt text

Derived-only surface:
- console prompt text

Reads from:
- console grammar in `src/app/console/stagedNavigation.ts`
- graph, workspace, and reference truth from stores and selectors

Rule:
- console prompt text is a formatted read surface over console grammar plus current app truth, not an owner of the underlying command state or product data

#### Supporting Derived-Only Examples

These wider examples still read as derived and should remain supporting examples rather than reopening this phase into a broader audit.

- tooltip text
  - useful presentation copy, not canonical truth
- compatibility adapters
  - transition helpers, not owners
- migration shims
  - temporary bridges, not owners
- host-local floating window geometry helpers
  - local shell helpers, not workspace truth

## [x] Phase 4 - Name The Still-Unresolved Decision Gaps

### Header

#### Purpose:
- identify which ownership decisions are still truly unresolved and should remain explicit carry-forward work rather than hiding inside vague hotspot language or being quietly treated as already settled

#### Current read:
- `Phase 2` now records the locked cross-system owner baseline
- `Phase 3` now records the derived-only baseline
- the remaining live unresolved gaps are already narrower in the cleanup docs than the broader family language first implied
- the current unresolved set consistently reads as:
  - exact worker shared-boundary file or folder home
  - exact product decision surface for dashboard, notepad, and radio
  - final accepted-result presentation seam outside graph runtime truth
- the workspace active-surface versus host-local focus issue now reads more like a soft follow-on for later workspace cleanup than a top-tier unresolved gap that belongs in this phase

#### Read:
- `Phase 4` should stay a docs-and-verification pass
- the right job here is to record one short unresolved-gap baseline that later cleanup phases can cite directly
- this phase should separate `truly unresolved` gaps from `soft but already directed` follow-ons so later cleanup does not reopen the whole owner model

#### Locked Phase 4 in-scope:
- re-read the unresolved-gap wording in `Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`, `Canonical-Owner-Decisions.md`, and `Canonical-Ownership-Targets.md`
- build one explicit unresolved-gap baseline inside this phase doc
- keep each unresolved gap tied to why it still matters and which later cleanup phase owns the follow-through
- keep soft-but-directed items visible only where needed to explain why they are not being promoted into the unresolved bucket

#### Locked Phase 4 out-of-scope:
- resolving the unresolved gaps themselves
- source-code refactors
- choosing the worker shared-boundary path
- deciding optional workspace-family scope
- tightening the accepted-result projection seam beyond naming it clearly
- rewriting the locked owner or derived-only baselines unless a direct contradiction appears

#### Strongest input docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`

#### Preferred Phase 4 implementation shape:
- keep this as a docs-and-verification pass
- turn the live unresolved-gap wording into one short explicit carry-forward baseline
- name the later owning cleanup phase for each unresolved gap
- distinguish unresolved gaps from softer later follow-ons without expanding back into a full family audit

### Implementation spec:
1. Re-read the unresolved-gap sections in the completed `Phase 1` findings report together with the current decision-gap wording in `Canonical-Owner-Decisions.md` and the hotspot framing in `Canonical-Ownership-Targets.md`.
2. Build an explicit unresolved-gap baseline section inside this phase doc that records, at minimum:
   - exact worker shared-boundary file or folder home
   - exact product decision surface for dashboard, notepad, and radio
   - any final accepted-result presentation seam outside graph runtime truth
3. For each unresolved gap, keep one short note naming:
   - why it still matters
   - which later cleanup phase owns the follow-through
4. If the reread still agrees, keep the softer workspace active-surface versus host-local focus issue visible only as a later workspace cleanup follow-on rather than promoting it into the main unresolved-gap list.
5. Stop once later cleanup phases can cite this phase for "this is still unresolved" without rereading the broader owner docs.

#### Implementation stop rule:
- `Phase 4` is ready to implement once the next pass can write one explicit unresolved-gap baseline without first rediscovering which remaining issues are truly unresolved versus merely soft
- do not widen this into solving the gaps, rewriting earlier baselines, or reopening already-locked ownership calls just to make the phase feel larger

#### Checklist:
- [x] re-read the unresolved-gap wording in the Phase 1 findings report and companion owner docs
- [x] write the explicit unresolved-gap baseline
- [x] tie each unresolved gap to its reason and later owning cleanup phase
- [x] keep softer follow-ons visible only where needed without promoting them into the unresolved bucket
- [x] stop before source changes or actual decision resolution

#### Target gaps:
- exact worker shared-boundary file or folder home
- exact product decision surface for dashboard, notepad, and radio
- final accepted-result presentation seam outside graph runtime truth

#### Done shape:
- later cleanup phases can cite one short unresolved-gap baseline instead of re-parsing scattered hotspot wording
- the cleanup family cleanly distinguishes:
  - locked owners
  - derived-only surfaces
  - still-unresolved gaps
- follow-on cleanup work is less likely to reopen the full owner model just to find the few decisions that are still genuinely open

#### Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-2 - Canonical Owner Decision Lock.md`
- optionally tighten one companion cleanup owner doc only if the reread finds a direct contradiction that would make the unresolved-gap baseline misleading

#### Verification:
- manually re-read:
  - `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup - 2 - Phase 1 - Current Live Cleanup targets.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- confirm the resulting unresolved-gap baseline matches the existing cleanup owner language rather than inventing new owner decisions

#### Unresolved-Gap Baseline

These are the remaining ownership questions that still read as genuinely unresolved after the locked owner and derived-only baselines are recorded.

##### 1. Exact worker shared-boundary file or folder home

Unresolved gap:
- the cleanup docs agree that app-worker shared contracts need one explicit boundary, but they still do not lock the final file or folder home

Why it still matters:
- later worker cleanup can otherwise waste effort re-arguing path placement instead of implementing one honest shared contract surface

Owned later by:
- `Cleanup 3 - Shared Boundary And Worker Contract Repair`

##### 2. Exact product decision surface for dashboard, notepad, and radio

Unresolved gap:
- the cleanup docs agree that optional workspace-family scope must be decided explicitly, but they still do not lock the canonical docs-and-architecture surface that will hold that answer

Why it still matters:
- shell wiring can keep implying product priority by accident if no explicit decision surface says whether these families are core, optional, or transitional

Owned later by:
- `Cleanup 9 - Optional Workspace Family Scope Decisions`

##### 3. Final accepted-result presentation seam outside graph runtime truth

Unresolved gap:
- graph runtime truth is locked for accepted build results, but the last remaining presentation seam outside that owner is still only described as a hotspot rather than one fully named carry-through rule

Why it still matters:
- later graph-runtime cleanup can widen into another discovery pass if the remaining app/project/Browser presentation split is not kept visible as an open question

Owned later by:
- `Cleanup 6 - Graph Runtime And Accepted Result Ownership`

#### Softer Follow-On That Stays Outside The Main Unresolved Bucket

- workspace active-surface versus host-local focus behavior
  - this still needs later workspace cleanup tightening, but the current docs already point toward app-owned active-surface truth and host-reactive behavior, so it reads as softer follow-on work rather than one of the main still-unresolved gaps

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
