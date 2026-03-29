# Browser Phase Browser-8.3 - Shared Owner Target Entry For Viewer Transform And Multi-Select Prep

## Doc Header

### Doc History
3. 2026-03-28 10:57: Marked this phase shipped after landing the shared selected content-owner target descriptor in the store, routing Console content context through that shared owner seam, and updating `Viewer Transform` focused-target display to read from the same owner-target payload with lightweight parent context
2. 2026-03-28 17:08: Tightened this future Browser phase into a more implementation-ready `Browser-8.3` spec by locking the exact shared owner-target shape, the rule that `SelectAll` resolves a separate descendant action set instead of mutating the selected owner, the first focused-target payload, and a sharper store/Browser/Console verification matrix
1. 2026-03-28 16:57: Created this standalone future Browser phase doc so the next Browser-8 follow-on has a dedicated planning surface for shared owner-target entry across Browser, Console, and `Viewer Transform`, while also preparing the target shape that later multi-select can widen into a list

### Purpose

This phase defines the next Browser follow-on after `Browser-8.2`.

Use it to answer:
- how Browser-selected content owners should resolve into one cleaner shared target descriptor
- how `Viewer Transform` should consume that same owner descriptor across:
  - transformable container owners
  - leaf geometry owners
- how the current single-owner path should later widen into multi-select without changing the target model again
- how to keep descendant resolution explicit instead of silently flattening parent selection into child-only ownership

## Doc Body

## [x] Browser-8.3 - Shared Owner Target Entry For Viewer Transform And Multi-Select Prep

### Summary

`Browser-8.1` cleaned up content selection semantics.

`Browser-8.2` made the first authored container structure editable.

`Browser-8.3` should connect that Browser-side owner model to the shared `Viewer Transform` entry path and to the later multi-select direction.

The key idea:
- Browser and Console should resolve one canonical selected owner now
- later multi-select should become a list of those same owner descriptors
- selecting a container owner must keep container ownership intact
- explicit descendant resolution like `SelectAll` must remain a separate action, not an implicit side effect of selection

Phase outcome:
- Browser, Console, and `Viewer Transform` have one cleaner owner-target entry seam
- container owners and leaf owners follow the same target-shape contract
- the toolbar focused-target area can grow later into a selected-owner list without another target-model rewrite
- multi-select prep lands without forcing multi-select implementation into this phase

Shipped result:
- the app store now exposes one shared selected content-owner target descriptor for:
  - `assembly`
  - `component`
  - `object-part`
- Console content context now derives assembly/component/object target metadata from that shared owner-target seam instead of reconstructing separate content-owner details ad hoc
- `Viewer Transform` focused-target display for content objects now reads from the same owner-target payload and shows lightweight parent context when available
- `SelectAll` behavior remained explicit and separate from the selected owner itself

### Owns

- the shared owner-target descriptor used by Browser and Console content entry
- the Browser-to-`Viewer Transform` owner-entry seam
- the distinction between:
  - selected owner
  - explicit descendant resolution
- the single-owner shape that later multi-select should widen into a list
- the focused-target presentation direction in `Viewer Transform`

### Does Not Own

- full multi-select implementation
- drag/drop or reparent behavior
- new container CRUD behavior
- changing the Browser-8.1 content-root contract
- changing transform math or transform history rules themselves
- later subassembly authoring

### Why This Exists After Browser-8.1 And Browser-8.2

Right now the Browser direction is cleaner than the shared transform entry seam.

We now have:
- one clearer content root:
  - `Select > Content > ...`
- a stronger owner model:
  - transformable container owners
  - leaf geometry owners
- first authored container CRUD

But the next growth areas still need one shared owner-entry picture:
- `Viewer Transform`
- later multi-select
- future container and leaf parity in toolbar/Console paths

Without `Browser-8.3`, that next work risks splitting again into:
- container-special handling
- leaf-special handling
- temporary transform-only target adapters that later multi-select has to undo

This phase exists to prevent that.

### Locked Direction

#### 1. Browser and Console should resolve one canonical selected owner target

Locked rule:
- the current content selection should resolve into one canonical owner target descriptor
- that descriptor should work for both:
  - transformable container owners
  - leaf geometry owners

The selected owner stays the selected owner.

Do not silently replace:
- selected `Assembly`
- selected `Component`
- selected `Object / Part`

with a hidden descendant set just because later transform or multi-select may want to act on descendants too.

Locked first-pass target shape:
- `ownerKind`
  - `assembly`
  - later `subassembly`
  - `component`
  - `object-part`
- `ownerId`
  - stable owner identity used by Browser, Console, and `Viewer Transform`
- `ownerLabel`
  - current visible label for focused-target display and Console scope presentation
- `parentOwnerId`
  - nullable parent pointer for lightweight path/focused-target context
- `supportsViewerTransform`
- `supportsSelectAll`

This should be one shared owner-target contract.

Do not let:
- Browser
- Console
- `Viewer Transform`

invent parallel target shapes for the same selected owner.

#### 2. Descendant resolution should stay explicit

Locked rule:
- parent/container selection remains parent-owned by default
- descendant resolution stays explicit through actions like:
  - `SelectAll`
  - later owner-wide transform helpers
  - later explicit multi-select growth

This means:
- selecting a parent owner is not the same thing as selecting all descendants
- the owner descriptor should be stable even when a later action derives a descendant set from it

Locked `SelectAll` rule:
- `SelectAll` should derive a separate resolved descendant action set from the selected owner
- it should not overwrite or redefine the canonical selected owner target itself

That keeps the meaning of:
- selected owner
- resolved descendants

separate and stable.

#### 3. `Viewer Transform` should consume the same owner-target seam

Locked rule:
- `Viewer Transform` entry should consume the same canonical owner target descriptor that Browser and Console selection already resolve
- do not create a separate Browser-only target picture and a separate transform-entry picture

This should hold for both:
- container owners
- leaf owners

The product read should be:
- select one owner
- enter `Viewer Transform`
- the focused target reflects that owner honestly

#### 4. The focused-target area should be shaped to become a list later

Locked rule:
- the current focused-target presentation in `Viewer Transform` should be treated as the first single-owner version of a later multi-select list
- do not design it as a one-off reference/object special case

Current read:
- one focused owner now

Later read:
- list of selected owners

The underlying owner descriptor should stay the same in both cases.

Locked first-pass focused-target payload:
- owner label
- owner kind
- lightweight parent/path context when available

Do not widen the first focused-target area into a mixed selection-results panel yet.

#### 5. Container and leaf targets should share one capability mapping seam

Locked rule:
- Browser and Console should determine what actions are available from one cleaner owner-kind capability mapping instead of scattering special cases

This should cover at least:
- `Viewer Transform`
- `Zoom`
- `Rename`
- `Delete`
- `SelectAll` where valid

Parent/container owners and leaf owners may expose different actions, but that difference should come from one clearer capability seam.

#### 6. Browser-8.3 should prepare multi-select without implementing it

Locked rule:
- this phase should prepare the owner-target shape that later multi-select will reuse
- do not widen this phase into:
  - full additive multi-select
  - full multi-owner transform execution
  - multi-owner history behavior

The deliverable is the shared target-entry shape, not the whole later feature set.

### Concrete First-Pass Read

After this phase lands, the intended model should read like this:

- Browser or Console selects one content owner
- that selection resolves one canonical owner target descriptor
- Browser, Console, and `Viewer Transform` all refer to that same owner
- if the user wants descendants too, that happens explicitly through a separate action
- later multi-select can widen from:
  - one owner descriptor
  - to a list of owner descriptors

### Public Interfaces / State Direction

The first implementation should move toward one shared owner-target seam for content selection and transform entry.

Locked first-pass state direction:
- add one shared selector/helper path that resolves the current selected content owner into the canonical owner-target descriptor
- Browser and Console should both read that same helper path
- `Viewer Transform` should consume the same owner-target payload rather than reconstructing it locally
- `SelectAll` should resolve through a separate helper/output shape instead of mutating the owner-target descriptor

Likely state and seam work:
- `src/app/store/useAppStore.ts`
  - canonical active content-owner target state or selectors
  - owner-kind capability helpers
- `src/app/store/workspaceSelectionCommands.ts`
  - shared owner-resolution helpers
- `src/app/panels/selectBrowserTreeRows.ts`
  - Browser row selection resolving into owner targets without descendant flattening
- `src/app/console/stagedNavigation.ts`
  - content-owner navigation paths and action availability
- `src/app/console/ConsoleDock.tsx`
  - staged execution against the shared owner-target descriptor
- `src/app/components/ReferenceTransformToolbar.tsx`
  - focused-target presentation that can later widen into a selected-owner list

### Suggested Implementation Targets

Primary likely code surfaces:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceSelectionCommands.ts`
- `src/app/panels/selectBrowserTreeRows.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/components/ReferenceTransformToolbar.tsx`

Likely supporting seams:
- Browser row-family capability mapping files
- Browser row-model selection helpers
- shared `Viewer Transform` target-adapter helpers already introduced during Transform cleanup

### Test Plan

Store / selection model
- selecting an `Assembly` resolves one owner target for that assembly
- selecting a `Component` resolves one owner target for that component
- selecting an `Object / Part` resolves one owner target for that leaf
- owner selection does not silently flatten into descendant-only selection
- `SelectAll` resolves a separate descendant set without replacing the selected owner target

Console
- `Select > Content > ...` keeps using the shared owner target
- valid owner scopes expose the expected actions from the shared capability seam
- `SelectAll` remains explicit and does not redefine the selected owner itself
- content-side action availability comes from the shared owner capability seam instead of ad hoc row-family branching

Viewer Transform prep
- focused target reflects the shared selected owner honestly
- container owners and leaf owners both follow the same focused-target contract
- the focused-target surface remains compatible with a later selected-owner list
- `Viewer Transform` reads the shared owner-target payload instead of reconstructing owner identity from separate Browser/Console assumptions

Compatibility
- Browser-8.1 parent-only selection behavior remains intact
- Browser-8.2 CRUD behavior remains intact
- no drag/drop or reparent behavior is introduced here
- no full multi-select behavior is introduced here

### Assumptions

- first-pass owner kinds remain:
  - `assembly`
  - later `subassembly`
  - `component`
  - `object-part`
- descendant resolution stays explicit
- `Viewer Transform` should consume the same selected-owner seam instead of inventing a parallel one
- later multi-select should widen the same owner-target contract rather than replacing it
- later nested `SubComponent` support remains outside this phase
