# Browser Phase Browser-8.1 - Container And Leaf Target Semantics

## Doc Header

### Doc History
3. 2026-03-28 15:35: Marked this phase shipped after landing the stable `Select > Content > ...` Console seam, the owner-only default selection split for content containers, explicit descendant resolution for `SelectAll`/zoom-style flows, and the matching Browser/Console cleanup around content-scope `Esc` / `Back` handling
2. 2026-03-28 14:45: Tightened this phase into a more implementation-ready Browser-8.1 spec by locking the first target-kind contract, the shared `Select > Content > ...` Console seam, the parent-only selection and explicit `SelectAll` behavior, the exact first-pass hierarchy read, and a sharper Browser/store/Console verification matrix
1. 2026-03-28 14:36: Created this standalone future Browser phase doc from the newer `Browser-8` umbrella direction so the first structured-hierarchy cleanup now has its own dedicated planning surface, locking the transformable-container versus leaf-owner target semantics, the stable `Select > Content > ...` Console root, and the parent-only selection plus explicit `SelectAll` direction before later Browser CRUD and drag/drop work

### Purpose

This phase defines the first real Browser-8 implementation slice.

Use it to answer:
- what the first structured Browser target model should be
- how transformable container owners should differ from leaf geometry owners
- how Browser selection and Console scope should behave under that model
- what should stay in scope before later Browser container CRUD and reparenting work

## Doc Body

## [x] Browser-8.1 - Container And Leaf Target Semantics

### Summary

This phase should lock the first structured Browser target model.

The Browser should stop treating content-side selection as an ad hoc mix of:
- folders
- grouped descendants
- object leaves
- special-case reference group rows

Instead, it should move toward one cleaner content hierarchy where:
- transformable container owners own structure and can later own transform/history
- leaf geometry owners remain the terminal geometry targets

First-pass outcome:
- Browser content-side selection has one clearer owner model
- Console content navigation has one stable root:
  - `Select > Content > ...`
- selecting a parent owner stays parent-only by default
- explicit bulk child resolution moves behind `SelectAll`
- later Browser-8.2 / 8.3 / 8.4 work has a stable target model to build on

Implementation-ready outcome:
- one first-pass Browser target-kind contract is explicit
- one first-pass content-side Console root is explicit
- one first-pass selection rule for parent owners versus leaf owners is explicit
- this phase can land without needing Browser CRUD, drag/drop, or transform execution in the same patch

### Owns

- the first structured Browser target distinction between:
  - transformable container owners
  - leaf geometry owners
- the stable content-side Console root:
  - `Select > Content > ...`
- selection ownership and scope behavior for parent owners versus leaf owners
- the first rules for parent-only selection and explicit `SelectAll`
- cleaning up `Esc`, `Back`, and highlight-clear expectations so they align to the new content target model
- the first target-kind contract needed by Browser selection, Browser-to-Console sync, and later `Viewer Transform`

### Does Not Own

- full container create / rename / delete behavior
- full drag-and-drop reorder or reparent behavior
- detailed transform execution itself
- durable STEP/export semantics
- introducing a separate pure non-transform folder type

### First-Pass Target Contract

The first implementation should treat the content-side Browser target kinds like this:

- `assembly`
  - transformable container owner
  - valid selected owner
  - later can own transform/history
- `subassembly`
  - transformable container owner
  - valid selected owner
  - later can own transform/history
- `component`
  - transformable container owner
  - valid selected owner
  - later can own transform/history
- `object-part`
  - leaf geometry owner
  - valid selected owner
- reference-backed groups such as `Footpads`
  - first-pass behavior should route through the same owner-style Browser selection/Console path as these structured content owners wherever practical
  - do not leave them stranded on a permanently separate content-side scope model

This phase does not require final schema renames yet, but it does require the Browser and Console to start behaving as if these are the real content-side owner types.

### Locked Direction

#### 1. Content-side Console navigation should use one stable root

Locked rule:
- content-side Console navigation should use:
  - `Select > Content > ...`
- do not keep multiplying separate content-side root names as the Browser hierarchy grows

This means:
- content-side child choices under `Content` should update dynamically from the current Browser or viewport content selection state
- the Console should stay honest about the selected owner while still keeping one stable top-level content root

First-pass Console direction:
- when a content-side owner is selected, the Console should resolve into:
  - `Select > Content > <Owner Label>`
- do not keep separate ad hoc content roots for assembly, component, object, and similar content-side targets if one honest `Content` root can express the same state

#### 2. The first structured Browser hierarchy should distinguish owners from leaves

Locked rule:
- `Assembly` is the primary root transformable container model
- later `Subassembly` is also a transformable container owner
- `Component` is a transformable container owner
- `Object` / `Part` is the leaf geometry owner

This means:
- Browser should support more than one top-level `Assembly`
- uploaded/imported assemblies should default to their own top-level assembly root
- if the user later nests or reparents an assembly under another assembly, it becomes a subassembly

#### 3. Transformable containers are real owners, not fake folders

Locked rule:
- transformable container owners are not just visual folders
- they are real content owners that later need:
  - origin / pivot
  - basis / orientation
  - transform history

Browser-8.1 does not implement that transform behavior yet, but it should preserve this ownership direction so later Browser and Transform work does not regress back to leaf-only ownership assumptions.

#### 4. Parent selection should stay parent-only by default

Locked rule:
- selecting a parent/container owner should not automatically resolve/select all descendants
- parent selection should stay parent-owned by default

This keeps:
- Browser navigation lighter
- Console scope honest
- transform ownership future-friendly

First-pass selection rule:
- if the user selects `Footpads`, `Assembly A`, or `Component A`, the selected thing stays that parent owner
- Browser highlight should represent that parent selection
- do not silently upgrade that selection into the full descendant set

#### 5. `SelectAll` should be explicit at parent-owner scope

Locked rule:
- when the user is on a parent/container scope in Console, that scope should expose:
  - `SelectAll`
- `SelectAll` is the explicit user action that resolves the full child set when needed

This means:
- parent owner selection and explicit child-set selection remain distinct concepts
- selecting `Footpads` should not silently become "all children selected"
- choosing `SelectAll` from the `Footpads` scope should do that intentionally

First-pass `SelectAll` rule:
- `SelectAll` belongs on parent/container Console scopes
- `SelectAll` is not needed on direct leaf-owner scopes
- `SelectAll` should resolve the currently selected owner's full valid child set explicitly rather than changing the meaning of ordinary selection itself

#### 6. Reference-backed groups should move toward the same structured model

Locked rule:
- reference-backed groups like `Footpads` should not stay a permanently separate non-transform tree species
- they should move toward the same structured content-owner model as other Browser containers

First-pass caution:
- preserve current reference/category browse and load flows while this target model is cleaned up
- do not break reference navigation just to force terminology alignment too early

#### 7. Do not add a separate pure non-transform folder type yet

Locked rule:
- Browser-8.1 should not introduce a separate non-transform organizational folder type
- use the structured transformable container model first
- revisit a true non-transform folder later only if the product still needs one

### Concrete First-Pass Read

After this phase direction is applied, the intended content-side read should be:

- `Select > Content > <Assembly>`
- `Select > Content > <Assembly> > <Subassembly>`
- `Select > Content > <Assembly> > <Component>`
- `Select > Content > <Assembly> > <Object / Part>`

And when the user is on a parent owner like `Footpads`, `Assembly`, or `Component`:
- the selected thing is still that parent owner
- children are not implicitly selected
- `SelectAll` is available if the user wants the full child set explicitly

### Public Interfaces / State Direction

The first implementation should be able to express:

- one selected content-side owner
- whether that owner is:
  - transformable container owner
  - leaf geometry owner
- one stable Console root for content-side owner navigation
- one explicit child-set resolution action:
  - `SelectAll`

Likely first-pass state/seam work:
- `src/app/store/useAppStore.ts`
  - selected Browser/content owner truth
  - any helper shape needed to distinguish owner kinds without scattering row-family checks everywhere
- `src/app/console/stagedNavigation.ts`
  - `Select > Content > ...` path ownership
  - parent-scope `SelectAll`
- `src/app/console/ConsoleDock.tsx`
  - selection-to-Console sync
  - `Esc` / `Back` behavior aligned to the new owner model
- Browser row/panel seams under `src/app/panels/`
  - row derivation
  - row capability mapping
  - selection dispatch
  - selected/highlighted row treatment

### Suggested Implementation Targets

Primary likely code surfaces:
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/panels/BrowserPanel.tsx`
- Browser row derivation / row-family files under `src/app/panels/`

Likely supporting seams:
- content-side selection helpers
- Browser-to-Console selection sync helpers
- Browser row capability/command-surface helpers

Most likely companion files:
- `src/app/console/radioCommandIdentity.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- Browser row-family presenter/capability helpers created during Browser-6 cleanup

### Test Plan

- Browser content-side selection routes into one stable Console root:
  - `Select > Content > ...`
- selecting an `Assembly`, `Subassembly`, or `Component` keeps that owner as the selected thing
- selecting an `Assembly`, `Subassembly`, or `Component` does not auto-select all descendants
- parent/container Console scopes expose `SelectAll`
- direct `Object / Part` leaf owners remain selectable as direct leaf targets
- multiple top-level assemblies remain valid in the Browser tree
- `Esc`, `Back`, and highlight clear stay aligned with the new owner model instead of leaving stale parent or child context behind
- current browse / load / zoom flows keep working while target semantics are cleaned up
- reference-backed groups still browse/load correctly while being prepared for the same structured owner model
- no separate pure non-transform folder behavior appears in this phase

### Assumptions / Defaults

- `Assembly`, later `Subassembly`, and `Component` are transformable container owners
- `Object` / `Part` is the leaf geometry owner
- parent selection is parent-only by default
- `SelectAll` is the explicit child-set resolution path
- content-side Console root is:
  - `Select > Content > ...`
- pure non-transform folders remain out of scope for this phase
