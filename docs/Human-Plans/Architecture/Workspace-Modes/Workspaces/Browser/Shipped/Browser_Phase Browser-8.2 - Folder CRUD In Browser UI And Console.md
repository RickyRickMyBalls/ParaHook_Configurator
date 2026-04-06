# Browser Phase Browser-8.2 - Folder CRUD In Browser UI And Console

## Doc Header

### Doc History
2. 2026-03-28 16:31: Cleaned up this shipped Browser phase record after implementation by marking the phase shipped, updating the doc language from future intent to landed behavior, and keeping the first-pass Browser/Console CRUD scope readable from the shipped archive
1. 2026-03-28 15:48: Created this standalone future Browser phase doc and tightened it into an implementation-ready `Browser-8.2` spec by locking the first container CRUD scope, the Browser/Console entry points, the exact first-pass create/rename/delete rules, and a sharper Browser/store/Console verification matrix

### Purpose

This phase records the first structured container authoring pass for Browser-8.

Use it to answer:
- which container rows users can create, rename, and delete first
- where that CRUD should live in Browser UI and Console
- what should stay out of scope before later reparenting and drag/drop work
- how container CRUD should respect the Browser-8.1 owner model

## Doc Body

## [x] Browser-8.2 - Folder CRUD In Browser UI And Console

### Summary

This phase lets users author the first real structured Browser containers directly from the product surface.

After `Browser-8.1`, the Browser has a clearer owner model:
- transformable container owners
- leaf geometry owners

`Browser-8.2` makes that structure editable.

First-pass outcome:
- users can create structured container rows from Browser UI and Console
- users can rename structured container rows from Browser UI and Console
- users can delete structured container rows from Browser UI and Console
- the first CRUD path stays narrow enough to land before drag/drop or subassembly reparent work

Landed outcome:
- the first createable container kinds are explicit
- the first rename/delete eligibility rules are explicit
- Browser and Console entry points are explicit
- the phase can land without also implementing Browser-8.4 reparenting

### Owns

- first-pass container create / rename / delete behavior
- the Browser UI entry points for that CRUD
- the Console entry points for that CRUD
- the first validation rules for legal container creation/deletion
- keeping the CRUD path aligned with the Browser-8.1 owner model

### Does Not Own

- drag-and-drop reorder or reparent
- subassembly nesting behavior
- object/part creation
- durable STEP/export semantics
- multi-select transform behavior
- later pure folder versus transform-owner type expansion

### First-Pass Container Contract

The first implementation should support CRUD for these structured container kinds:

- `assembly`
  - valid top-level transformable container owner
  - users can create a new top-level assembly
  - users can rename an assembly
  - users can delete an assembly
- `component`
  - valid child transformable container owner
  - users can create a component under a selected valid parent
  - users can rename a component
  - users can delete a component

Out of scope for this phase:
- explicit user-created `subassembly`
- pure non-transform folders
- object/part creation

### Locked Direction

#### 1. Browser-8.2 should keep the first CRUD pass narrow

Locked rule:
- first-pass createable structured containers are:
  - top-level `Assembly`
  - child `Component`
- do not widen this phase to full subassembly authoring yet

This keeps the first container CRUD pass honest and easier to verify.

#### 2. Container CRUD should exist in both Browser UI and Console

Locked rule:
- users should be able to create, rename, and delete valid structured containers from:
  - Browser UI
  - Console

This means:
- Browser row menus and nearby Browser actions should expose the same core CRUD capabilities
- Console content scopes should expose matching CRUD choices where the current target makes them valid

#### 3. The `Content` root should own top-level assembly creation

Locked rule:
- the stable content-side Console root remains:
  - `Select > Content > ...`
- top-level assembly creation should hang off that shared content root rather than a separate one-off authoring root

First-pass Console direction:
- `Select > Content`
  - should expose `New Assembly`
- selected `Assembly`
  - should expose `New Component`, `Rename`, `Delete`
- selected `Component`
  - should expose `Rename`, `Delete`

#### 4. Create rules should follow the owner hierarchy

Locked rule:
- top-level `Assembly` can be created at the content root
- `Component` can be created under:
  - `Assembly`
  - later `Subassembly` if that owner type already exists in data

First-pass create restrictions:
- do not create a `Component` directly under an `Object / Part`
- do not create a new `Assembly` as a child of another owner in this phase
- do not invent `Subassembly` authoring yet

#### 5. Rename should stay on valid structured owners only

Locked rule:
- first-pass rename should apply to:
  - `Assembly`
  - `Component`
- rename should work from both Browser and Console

This phase should not widen rename to every Browser row family if that complicates the pass.

#### 6. Delete should be explicit and conservative

Locked rule:
- deleting a structured container should be an explicit action
- first-pass delete should not silently flatten or auto-reparent children

First-pass delete direction:
- if a container has children, the delete flow should require an explicit confirmation that the owned subtree will be removed
- do not auto-convert container delete into an implicit child move/reparent in this phase

#### 7. Browser-8.2 should preserve the Browser-8.1 owner model

Locked rule:
- CRUD should create real structured transformable containers, not fake non-transform folders
- new rows created by this phase must align with the Browser-8.1 owner contract

That means:
- created `Assembly` and `Component` rows are valid content owners
- they are not just temporary visual folders
- later transform/history work can attach to them honestly

### Concrete First-Pass Read

After this phase lands, the intended Browser/Console experience should allow:

- from `Select > Content`
  - create a new top-level `Assembly`
- on a selected `Assembly`
  - create a child `Component`
  - rename the assembly
  - delete the assembly
- on a selected `Component`
  - rename the component
  - delete the component

Browser row menus should mirror the same first-pass capability set.

### Public Interfaces / State Direction

The first implementation should be able to express:

- create top-level assembly
- create child component under a valid selected owner
- rename a structured container owner
- delete a structured container owner with confirmation when it owns children

Likely state/seam work:
- `src/app/store/useAppStore.ts`
  - structured container create / rename / delete actions
  - any owner-kind validation helpers
- `src/app/store/workspaceSelectionCommands.ts`
  - shared selection/command entry alignment where Browser and Console need common target handling
- `src/app/console/stagedNavigation.ts`
  - `Content` root and owner-scope CRUD choices
- `src/app/console/ConsoleDock.tsx`
  - CRUD action execution and prompt/confirmation flow
- Browser row/controller seams under `src/app/panels/`
  - row action menus
  - action dispatch
  - rename/create/delete prompts or launch points

### Suggested Implementation Targets

Primary likely code surfaces:
- `src/app/store/useAppStore.ts`
- `src/app/store/workspaceSelectionCommands.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/ConsoleDock.tsx`
- `src/app/panels/BrowserPanel.tsx`
- Browser panel/controller files under `src/app/panels/`

Likely supporting seams:
- Browser row-model / row-family capability mapping files
- Browser context-menu action helpers
- any shared content tree mutation helpers already used by content rows

### Test Plan

Store / model
- can create a top-level assembly
- can create a component under a selected assembly
- rejects invalid create targets cleanly
- can rename assembly and component owners
- can delete assembly and component owners
- delete with children requires the expected confirmation path

Console
- `Select > Content` exposes `New Assembly`
- selected `Assembly` exposes `New Component`, `Rename`, and `Delete`
- selected `Component` exposes `Rename` and `Delete`
- Console CRUD actions mutate the Browser tree as expected

Browser UI
- valid row menus expose the matching CRUD actions
- invalid targets do not expose illegal create actions
- rename updates the visible Browser label
- delete removes the expected container subtree after confirmation

Compatibility
- Browser-8.1 content-root behavior remains intact
- Browser selection / `Esc` / `Back` behavior remains intact
- no drag/drop or reparent behavior is introduced accidentally
- transform execution is unchanged in this phase

### Assumptions

- first-pass authored container kinds are `Assembly` and `Component`
- `Subassembly` authoring stays for a later phase
- delete removes the owned subtree rather than flattening it
- Browser-8.4 remains the phase that should own drag/drop and reparent rules
