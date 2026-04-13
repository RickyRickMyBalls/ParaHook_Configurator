# `Spaghetti-Editor-4` - `Left Node Palette And Drag-Drop Surface`

## Doc Header

### Doc History
1. 2026-04-13 09:13:40: Added this dedicated future phase doc for the compact hideable left-side node palette, grounding it in the live `SpaghettiCanvas.tsx` add-node menu seam so `Spaghetti-Editor-4` now has one implementation-ready planning home for organized node browsing, search, and drag-drop node creation

### Purpose

Use this doc as the dedicated planning and execution surface for the next Spaghetti editor canvas cleanup around node creation discovery.

The goal here is:
- add one honest left-side node palette
- keep that palette compact and hideable so it does not crowd the canvas
- let the user browse and search addable node types in one stable place
- organize nodes so dragging them onto the canvas feels easier than hunting through a temporary menu
- keep node-definition truth grounded in the registry instead of in ad hoc UI lists

### Scope

This phase family covers:
- left palette host ownership inside the canvas
- show and hide rules for that palette
- organized addable-node browsing and search
- drag-and-drop node creation from the palette into the canvas
- the handoff between the new left palette and the current temporary add menu

This phase family does not cover:
- detailed node-family toolbars
- generic node row-density redesign
- overlay `O` mode titlebar cleanup outside left-palette space needs
- family-specific authored workflow semantics after a node is already created
- speculative later asset-browser or command-palette systems beyond addable nodes

## Doc Body

### Summary

`Spaghetti-Editor-4` is the next editor-canvas cleanup after the shipped spawn-mode pass in `Spaghetti-Editor-2` and the open shell-mode split in `Spaghetti-Editor-3`.

Current read:
- the live canvas already has one temporary searchable add-node surface:
  - `nodeAddMenu`
- that surface is useful, but it is still:
  - temporary
  - context-menu driven
  - detached from any persistent organized left-side browse flow
- the intended next UX is:
  - a compact hideable toolbar on the left
  - an organized list of nodes
  - drag-and-drop onto the canvas
- later family-specific grouping should not invent a second add-node source of truth

Locked recommendation:
- keep the left node palette as a `Master Spaghetti` canvas/editor concern
- reuse the existing addable-node registry truth instead of cloning node lists in UI code
- treat the current `nodeAddMenu` as the migration seam into the new palette, not as a separate permanent system

### Current Code-Backed Read

The strongest owner seams for this phase family are:

- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
  - already owns the visible `nodeAddMenu` state
  - already filters the available node list and renders the current search/menu surface
  - is the likely home for the left-palette host behavior
- `src/app/spaghetti/registry`
  - already defines which node types are user-addable
  - should remain the source of truth for what the palette may show
- `src/app/theme/surfaces/spaghetti.css`
  - already contains the current add-menu styling
  - is the likely home for the compact left-palette treatment
- focused registry and canvas tests
  - already prove addable-node filtering
  - should become the first proof surfaces for the palette migration

Important architectural note:

The left palette should stay separate from:
- node row-density state
- per-node toolbar ideas
- later family-specific authoring workflows

This means `Spaghetti-Editor-4` should not reopen:
- `collapsed`
- `essentials`
- `expanded`
- active node tool-session ownership

### Ownership Boundary

`Master Spaghetti` should own:
- where the left palette lives in the canvas shell
- how it shows, hides, and preserves room for the canvas
- how addable nodes are browsed, searched, and dragged from that palette
- how dropping from the palette maps into normal node creation on the canvas
- how the new palette relates to the current temporary add menu

Node families should own:
- their node definitions
- their labels and future category metadata where needed
- what happens after the node is created

### Phase Breakdown

1. `Spaghetti-Editor 4 - Phase 1 - Left Palette Host And Visibility`
Reason:
- the first missing truth is not drag behavior
- it is one explicit owner for the compact hideable left palette and how it coexists with the canvas

2. `Spaghetti-Editor 4 - Phase 2 - Organized Node List And Search Surface`
Reason:
- once the palette host exists, the next missing truth is how addable nodes should be grouped, labeled, searched, and kept readable without taking too much room

3. `Spaghetti-Editor 4 - Phase 3 - Drag-And-Drop Node Spawn And Add-Menu Handoff`
Reason:
- once the palette host and list are explicit, the next missing truth is how drag-and-drop node creation should work and whether the current temporary add menu should shrink, remain as a fallback, or hand off fully

## [ ] Spaghetti-Editor 4 - Phase 1 - Left Palette Host And Visibility

### Summary

#### Purpose:
- add one explicit left-palette host in the canvas shell
- make that palette compact and hideable
- define how much room it may claim without overwhelming the canvas

#### Current read:
- the live canvas already owns the temporary add menu
- but no layer yet owns:
  - a persistent left-side add-node surface
  - palette show and hide behavior
  - the spatial contract between that palette and the canvas viewport

#### Locked direction:
- keep this as canvas-shell work
- do not widen into drag-and-drop behavior yet
- do not let this become a large Browser-style panel that dominates the editor

### Questions / Decisions

#### [ ] Question 1 - Should the first pass use one persistent compact left palette instead of another floating popup?

##### Locked answer
- yes

##### Why
- the user wants a stable left toolbar that is easy to glance at and hide
- that is a different promise than another temporary popup

#### [ ] Question 2 - Should the palette be hideable so it does not permanently consume too much room?

##### Locked answer
- yes

##### Why
- the palette should help node creation, not crowd the editor
- a compact hideable surface matches the intended UX better than a permanently wide library panel

#### [ ] Question 3 - Should `Phase 1` avoid deciding final node grouping semantics yet?

##### Locked answer
- yes

##### Why
- host and visibility truth should be locked before detailed taxonomy and drag behavior widen the phase

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/theme/surfaces/spaghetti.css`
- focused canvas tests

Locked first-cut direction:
1. add one explicit left-side palette host
2. make it compact by default
3. make it hideable
4. keep the canvas usable when the palette is open
5. avoid widening into drag behavior or final grouping rules yet

Verification matrix:
- the left palette can show and hide cleanly
- the palette does not cover the entire canvas
- the canvas remains usable while the palette is visible
- the current temporary add menu can still exist during this host pass if needed

Definition of done:
- left-palette ownership is explicit
- palette visibility is explicit
- later organization and drag work can target one real host instead of inventing another add-node surface

## [ ] Spaghetti-Editor 4 - Phase 2 - Organized Node List And Search Surface

### Summary

#### Purpose:
- organize addable nodes so the user can browse them more easily
- keep search fast and useful inside the compact left palette
- make the palette read as a clearer version of the current add-node list instead of an unrelated second system

#### Current read:
- the live add menu already has searchable node types
- but it still reads as one flat temporary list
- the desired left palette should:
  - show the list more persistently
  - let the user organize or at least understand node groupings better
  - stay compact enough that the list structure matters

#### Locked direction:
- keep the list driven by one addable-node source of truth
- let this phase improve organization without inventing family-local hardcoded drift
- do not widen this phase into actual drag-and-drop behavior yet

### Questions / Decisions

#### [ ] Question 1 - Should the palette reuse the existing addable-node truth instead of defining a second manual list?

##### Locked answer
- yes

##### Why
- the current add menu already proves there is one useful source of addable node types
- the palette should organize that truth, not duplicate it

#### [ ] Question 2 - Should `Phase 2` include search plus first-pass grouping or section organization?

##### Locked answer
- yes

##### Why
- the palette only becomes meaningfully better than the temporary add menu if users can browse and filter it quickly

#### [ ] Question 3 - Should the first organization pass stay compact instead of turning into a deep Browser-like taxonomy tree?

##### Locked answer
- yes

##### Why
- the user wants a toolbar that does not take up too much room
- a shallow grouped palette fits that better than a full tree browser

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/registry/`
- `src/app/theme/surfaces/spaghetti.css`
- focused registry and canvas tests

Locked first-cut direction:
1. keep one addable-node source of truth
2. add first-pass organization and search inside the left palette
3. keep the palette compact enough that groups remain glanceable
4. preserve the ability to quickly add the first matching node
5. leave drag-and-drop and add-menu retirement decisions to the next phase

Verification matrix:
- the left palette shows addable node types honestly
- search filters the organized list
- the palette stays readable without consuming too much room
- the visible grouping does not drift away from registry truth about what is addable

Definition of done:
- the left palette is more useful than the flat temporary add menu
- search and first organization work are honest
- drag-and-drop can start from a stable organized list

## [ ] Spaghetti-Editor 4 - Phase 3 - Drag-And-Drop Node Spawn And Add-Menu Handoff

### Summary

#### Purpose:
- let the user drag node types from the left palette onto the canvas
- define where dropped nodes should spawn
- decide how the new left palette should coexist with or replace the current temporary add menu

#### Current read:
- the current add menu creates nodes by click at a remembered stage position
- the user now wants drag-and-drop from a compact left palette
- the missing shared truth is:
  - what drag feedback should look like
  - where the node should land
  - whether click-to-add still stays as a fallback
  - when the old temporary add menu can shrink or leave

#### Locked direction:
- use this phase to define one honest drag-to-create path
- keep actual node creation reusing the same graph mutation seam as normal add-node behavior
- keep the temporary add menu only as compatibility residue until the left palette path feels complete enough

### Questions / Decisions

#### [ ] Question 1 - Should dragging from the left palette create nodes through the same underlying add-node seam the temporary menu already uses?

##### Locked answer
- yes

##### Why
- drag-and-drop should be a new input surface over the same node-creation truth
- that keeps add behavior deterministic

#### [ ] Question 2 - Should the first drag-and-drop pass keep click-to-add available too?

##### Locked answer
- yes

##### Why
- click-to-add is still useful in a compact palette
- keeping both during the first pass reduces migration risk

#### [ ] Question 3 - Should the temporary context add menu become a fallback instead of the primary long-term add-node UX once the palette lands?

##### Locked answer
- yes

##### Why
- the left palette is the intended primary browse surface
- the temporary menu can stay only as a narrower fallback if needed

### Implementation Spec

Likely files:
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- focused canvas tests
- registry addable-node tests if needed

Locked first-cut direction:
1. add drag affordance from the left palette
2. map drop location onto normal canvas node creation
3. preserve click-to-add as needed during the first drag pass
4. decide whether the old temporary add menu remains:
   - fallback only
   - or trimmed compatibility path
5. keep registry truth and node creation truth shared between both input surfaces

Verification matrix:
- dragging from the left palette creates the expected node on the canvas
- dropped node placement feels predictable
- click-to-add still works if intentionally preserved
- the temporary add menu no longer needs to be the main discoverability surface

Definition of done:
- the left palette becomes the primary organized add-node surface
- drag-and-drop and click-to-add both reuse one honest node-creation truth
- the old temporary add menu can shrink to fallback duty or be prepared for later retirement
