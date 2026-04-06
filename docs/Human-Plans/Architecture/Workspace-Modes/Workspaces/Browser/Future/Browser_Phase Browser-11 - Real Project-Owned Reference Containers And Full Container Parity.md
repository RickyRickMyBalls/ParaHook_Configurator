# Browser-11 - Real Project-Owned Reference Containers And Full Container Parity

## Summary

Finish the Browser unification by deleting the remaining special reference-container backing model and replacing it with real project-owned assembly/component container records.

Locked outcome:
- `References` is no longer a synthetic adapted Browser container
- `References` becomes a real project-owned `Assembly` record if it stays visible
- `Footpads`, `Shoes`, `Premade Foothooks`, and later similar grouping parents become real project-owned `Component` records if they stay visible
- those container rows stop being fake assembly/component lookalikes and gain the same structural behavior as normal Browser owners
- object rows such as `Large`, `XL.step`, or other imported/reference-backed objects can live under those real containers without needing a second container model
- Browser stops having one class of container that only looks normal and another that actually is normal

## Why This Phase Exists

`Browser-9` and `Browser-10` solved a lot of the visible and routing confusion:
- reference-backed objects now behave much more like normal Browser objects
- the Browser tree now reads much more like one tree
- Browser, Console, and viewer selection now route through normal owner targets much more often

But one important mismatch still remains:
- `References`, `Footpads`, `Shoes`, and `Premade Foothooks` still are not true project-owned container records
- they can look like `Assembly` / `Component` rows without fully behaving like them

That is why the Browser still breaks the Fusion-style expectation:
- a row can look like a container
- but still fail normal container behavior such as drag/reparent parity

The next clean step is to stop adapting those rows and make them real owners.

## Locked Direction

- do not keep special reference grouping parents as a separate hidden Browser/container model
- if `References` stays visible, it must be a real project-owned `Assembly`
- if `Footpads`, `Shoes`, `Premade Foothooks`, and similar grouping parents stay visible, they must be real project-owned `Component` records
- normal Browser container behavior should no longer differ just because the container came from the old reference hierarchy
- imported/reference-backed origin should remain metadata on normal owners and objects, not a reason to keep fake container records
- if a visible grouping label is not worth making real, remove it from the live Browser tree instead of keeping it as a special fake parent

## Current Gap

Right now ParaHook still has one container split:
- real authored containers in `projectContent`
- adapted reference grouping containers derived from `referenceWorkspace`

That means:
- a row like `Assembly 1` is a real assembly owner
- a row like `Shoes` can still be a special reference container even when it looks like a component

This is the remaining reason Browser container parity is incomplete.

## Proposed Subphases

`Browser-11` should act as an umbrella reset for container truth, not one giant implementation pass.

### Browser-11.1 - Promote Visible Reference Containers Into Real Owner Records

Focus:
- turn visible rows like `References`, `Footpads`, `Shoes`, and `Premade Foothooks` into real project-owned assembly/component records
- stop deriving those visible containers from the adapted reference-container model
- keep current imported/reference-backed object metadata and runtime adapters intact while owner-record truth converges

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-11.1 - Promote Visible Reference Containers Into Real Owner Records.md`

### Browser-11.2 - Container Drag And Reparent Parity

Focus:
- give promoted reference containers the same drag/reparent semantics as normal authored assemblies/components
- remove the special non-draggable/non-owner rule that still applies only to adapted reference containers
- keep normal Browser legality honest instead of inventing one more reference-only drag contract

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-11.2 - Container Drag And Reparent Parity.md`

### Browser-11.3 - Grouping Label Survival And Tree Simplification

Focus:
- decide which visible grouping labels still deserve to exist as real project structure
- remove any grouping parent that is not worth promoting into a real owner record
- keep only project-meaningful Browser structure instead of preserving legacy reference categories by inertia

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-11.3 - Grouping Label Survival And Tree Simplification.md`

Shipped first-pass result:
- `References`, `Footpads`, `Shoes`, and `Premade Foothooks` remain the surviving real grouping structure
- the live Browser no longer renders `User References` as a separate grouping parent
- imported rows that used to live under that historical label now flatten directly under the surviving `References` assembly

Locked first-pass direction:
- keep `References`, `Footpads`, `Shoes`, and `Premade Foothooks` as the surviving real grouping structure for now
- if a later simplification removes one of those parents, flatten its children upward into the nearest surviving honest owner by default
- keep load/unload behavior only as ordinary owner actions on surviving rows

### Browser-11.4 - Adapted Container Seam Retirement

Focus:
- delete the leftover adapted reference-container compatibility seams once real owner records and real tree structure are in place
- shrink the old synthetic container model out of Browser selectors, interactions, and context routing
- keep only the runtime/reference adapters that still provide real value

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-11.4 - Adapted Container Seam Retirement.md`

Shipped result:
- retired the remaining Browser-facing `referenceContainerKind`, `references-root`, and `reference-category` interaction/context-menu branches for the surviving root/category rows
- kept only the narrower object-level `referenceId` adapters where runtime/reference behavior still honestly needs them

### Browser-11.5 - Cross-Parent First-Drop Ordering Parity

Focus:
- let the first cross-parent drop into a target owner commit directly at the intended child slot
- keep the current honest shared `before` / `after` / `into` drag grammar
- remove the current friction where a move into `Assembly 1` works only when the user drops directly on the owner row first and then reorders afterward

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-11.5 - Cross-Parent First-Drop Ordering Parity.md`

Shipped result:
- hovering a concrete child slot inside `Assembly 1` or another legal owner now lets that first cross-parent drop land directly beside the visible anchor row
- the Browser no longer requires `drop into owner first, then reorder` when the user is already targeting a visible child slot
- plain owner-row hover still stays honest as `into`, so this pass improved first-drop slot parity without giving owner-row hover a second meaning

## First-Pass Direction

The first pass should focus on container truth, not on catalog design or runtime redesign.

That means:
- promote the visible `References` assembly into a real project-owned assembly record if it remains in Browser
- promote visible grouping rows into real project-owned component records
- remove the special non-draggable/non-owner container rule that still applies only because those rows are adapted reference containers
- keep current reference-backed object metadata, load state, and transform compatibility adapter-backed where still needed
- keep the Browser honest:
  - real visible container = real owner record
  - fake/special container = delete it from the live Browser tree

## Scope

This phase covers:
- deleting the remaining special reference-container backing model from the live Browser tree
- making visible reference grouping parents real project-owned owner records
- aligning container drag/reparent/selection semantics with normal assembly/component behavior
- preserving imported/reference-backed object metadata while container truth converges

This phase does not cover:
- asset catalog design
- full loader/runtime redesign
- full transform-backend convergence
- deciding whether every current grouping label must survive forever

## Questions / Decisions

### q1 - Should `References` remain visible as a real assembly, or should it disappear entirely once container truth is cleaned up?

Question:
- after Browser container parity lands, should `References` stay as a visible top-level real assembly, or should those objects move under other real project-owned parents so the label disappears?

Suggestion:
- only keep `References` if it reflects a real project-owned organizational truth the user still wants
- if it is only a legacy adaptation label, remove it instead of preserving it cosmetically

### q2 - Should grouping labels like `Footpads`, `Shoes`, and `Premade Foothooks` survive as real components?

Question:
- when container truth converges, should these labels remain in Browser as real `Component` records, or should some of them be removed if they do not represent meaningful long-term project structure?

Suggestion:
- keep a grouping label only if it still gives the user meaningful project organization
- do not preserve old reference categories by default just because they existed in the adapted tree

### q3 - Should promoted reference containers get full drag and reparent parity with authored containers?

Question:
- once `References` and category/grouping rows become real owner records, should they gain the same drag/reparent behavior as ordinary authored assemblies/components?

Suggestion:
- yes
- if a visible container is real, it should obey the same normal Browser container rules unless a specific product constraint says otherwise

### q4 - Should non-real grouping parents be removed instead of kept as special Browser-only labels?

Question:
- if a visible parent row is not worth making into a real project-owned owner record, should Browser delete that parent row from the live tree instead of keeping one more special adapter?

Suggestion:
- yes
- real visible container or no visible container
- avoid a third hybrid state where a row looks structural but is still fake underneath

## Expected Result

After this phase, the Browser should no longer have the current contradiction:
- `looks like a normal assembly/component`
- but `still is a special reference-only container under the hood`

Instead, the Browser should have only two honest outcomes:
- real visible container rows backed by real project-owned assembly/component records
- or no such container row at all
