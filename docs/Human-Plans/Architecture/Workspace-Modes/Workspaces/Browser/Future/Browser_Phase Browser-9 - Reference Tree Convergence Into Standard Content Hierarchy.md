# Browser-9 - Reference Tree Convergence Into Standard Content Hierarchy

## Summary

Converge the older special `References` Browser tree into the same standard content hierarchy used by authored Browser content.

Locked outcome:
- `References` is no longer a special Browser-only root species
- Browser expresses the same organization through normal content hierarchy:
  - `Assembly`
  - `Component`
  - `Object`
  - later `Part`
- `References` becomes a normal top-level `Assembly`
- `Footpads`, `Shoes`, and `Premade Foothooks` become normal `Component` rows under that assembly
- imported/library items default to normal `Object` rows under the current working hierarchy
- Browser keeps one structural `Object` row type, while object rows still communicate origin/runtime truth:
  - imported objects keep the darker/static row treatment
  - generated objects keep the generated/loading-bar row treatment
- richer imported hierarchy can later map upward into `Component` or `Subassembly`
- imported objects that already contain internal parts should later be able to expose child `Part` rows in Browser
- the long-term transform direction is to reuse the stronger reference/viewer transform shell across both imported and generated objects, while the focused target still knows which object origin/backend it is dealing with

## Why This Phase Exists

The current Browser direction should stop preserving two permanently separate tree worlds:
- authored content
- special reference/category trees

We still want the same practical grouping the user already understands, but we want it to live on one honest hierarchy model so Browser behavior can stay coherent for:
- selection
- drag/rearrange
- rename/delete
- visibility
- later transform

We also want Browser object rows to stop implying that imported and generated objects are different structural species when they are really different origins/runtime traits.

## Locked Decisions

### `References` Root

- `References` should become a normal top-level `Assembly` named `References`
- Browser should preserve the familiar label while removing the separate Browser-only root/entity type

### Category Rows

- `Footpads`, `Shoes`, and `Premade Foothooks` should become normal `Component` rows under the `References` assembly
- the grouping should stay visible, but it should be expressed through standard content hierarchy semantics

### Imported Object Structure

- default imported single objects should land as normal `Object` rows in the user's working hierarchy
- if a source file clearly contains richer structure, Browser can later map that import upward into:
  - `Component`
  - `Subassembly`
- when an imported object's source structure already contains internal parts, Browser should later be able to expose those child `Part` rows under the object

### Object Type And Origin Direction

- Browser should keep one structural `Object` row type across imported and generated content
- imported versus generated should be represented as object origin/runtime traits, not as permanently separate Browser tree species
- imported objects should keep the darker/static row treatment because they do not communicate worker build strain the same way generated objects do
- generated objects should keep the current generated/loading-bar treatment because the user still needs honest worker/build progress feedback

### Transform Convergence Direction

- the current stronger reference/viewer transform direction should be the long-term shared transform shell for both imported and generated objects
- Browser focused-target truth should still know whether the selected object is:
  - imported
  - generated
- that target truth should later let the transform system choose the correct backend behavior without forcing Browser to keep two forever-separate object row species
- long-term direction:
  - imported object -> uses the viewer/reference-style transform path
  - generated object -> can enter the same viewer transform shell, but later apply that transform back into Replicad/backend truth when that path is ready

## First-Pass Direction

The first pass should focus on Browser-tree convergence, not import-surface redesign.

That means:
- remove the special Browser row species for `References` and reference categories
- remap the same visible organization into normal content rows
- keep imported-origin styling/metadata separate from row type
- keep object origin visually meaningful even after the tree converges:
  - imported object rows stay darker/static
  - generated object rows keep their generated/loading look
- do not require deeper part visibility on day one if the hierarchy convergence can land earlier
- do not require full generated-object transform convergence on day one if the tree-model cleanup can land earlier

## Proposed Subphases

### Browser-9.1 - Reference Tree Convergence Baseline

Focus:
- remove the special Browser row species for `References` and reference categories
- remap the same visible organization into normal content rows
- keep imported-origin styling/metadata separate from row type
- keep imported and generated object rows visually distinct through origin/runtime treatment instead of separate hierarchy species

#### Questions / Decisions

##### [x] q1 - Should `References` become a normal top-level assembly in the first pass?

Question:
- should the first Browser-9 pass replace the special `References` root with one normal top-level `Assembly` named `References`?

Suggestion:
- yes
- this is the cleanest first convergence step
- it preserves the name and organization users already know while removing the special Browser-only root species

Decision:
- `References` should become a normal top-level `Assembly` in the first pass
- preserve the familiar name while removing the Browser-only root species

##### [x] q2 - Should category rows become normal components immediately in the same pass?

Question:
- in that same first pass, should `Footpads`, `Shoes`, and `Premade Foothooks` also become normal `Component` rows under the `References` assembly?

Suggestion:
- yes
- `9.1` should converge both the root and the category rows together
- otherwise the Browser would keep one half-converted hierarchy model longer than necessary

Decision:
- `Footpads`, `Shoes`, and `Premade Foothooks` should become normal `Component` rows in the same first pass
- do not leave the Browser in a half-converted root-only state

##### [x] q3 - Should Browser keep one structural object row type while preserving imported-versus-generated visual treatment?

Question:
- once the Browser tree converges, should both imported and generated items still be structural `Object` rows, with the visual difference handled through origin/runtime styling instead of separate tree species?

Suggestion:
- yes
- keep one structural `Object` row type
- let imported objects stay darker/static
- let generated objects keep the current generated/loading-bar treatment

Decision:
- Browser should keep one structural `Object` row type while preserving imported-versus-generated visual treatment
- imported objects stay darker/static
- generated objects keep the current generated/loading-bar treatment

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.1 - Reference Tree Convergence Baseline.md`

### Browser-9.2 - Import Landing And Hierarchy Mapping

Focus:
- define where imported content lands inside the working hierarchy
- keep the default import rule simple
- widen only when the source file clearly contains richer structure

#### Questions / Decisions

##### [ ] q1 - Should the default import rule stay object-first?

Question:
- when a user imports one 3D object into the project, should the default Browser landing rule remain `Object` first instead of wrapping that import in its own `Assembly` by default?

Suggestion:
- yes
- default imported single objects should land as normal `Object` rows in the user's working hierarchy
- avoid adding extra wrapper depth unless the source file clearly contains richer hierarchy or the user explicitly asks for isolation

##### [ ] q2 - When should Browser map imports upward into `Component` or `Subassembly`?

Question:
- what is the threshold for treating an imported file as richer hierarchy instead of a plain object?

Suggestion:
- only widen above `Object` when the source file clearly contains real internal hierarchy
- use `Component` or `Subassembly` only when that structure is explicit enough to preserve honestly in Browser

##### [ ] q3 - Should the user's current working hierarchy determine the default landing parent?

Question:
- should imported Browser content land inside the current working hierarchy, for example under the user's current main assembly or selected valid parent, rather than being isolated elsewhere by default?

Suggestion:
- yes
- import should normally land inside the assembly the user is currently working in
- use the current selected valid owner when possible, and fall back to the broader working assembly when needed

##### [ ] q4 - Should imported objects land in the main working hierarchy instead of a permanent isolated reference area?

Question:
- when a user imports an object from a file or later catalog flow, should it land in the main assembly/component hierarchy the user is working in instead of a permanent isolated reference-only area?

Suggestion:
- yes
- import into the working assembly/component hierarchy by default
- this keeps rearrange, visibility, rename, and later transform coherent with the rest of Browser

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.2 - Import Landing And Hierarchy Mapping.md`

### Browser-9.3 - Part Row Exposure For Imported Objects

Focus:
- expose more truthful internal structure for imported objects only after the converged hierarchy baseline is stable
- keep `Object` as the parent owner and `Part` as the leaf unit

#### Questions / Decisions

##### [ ] q1 - Should Browser expose child `Part` rows only when the source structure already contains parts?

Question:
- should Browser limit `Part` rows to imported objects whose source structure already contains real internal parts, instead of inventing synthetic parts for every object?

Suggestion:
- yes
- Browser should expose structure that already exists
- this keeps part visibility truthful and avoids making flat objects look more structured than they are

##### [ ] q2 - Should `Object` remain the parent owner when part rows are visible?

Question:
- when Browser later exposes parts under an imported object, should the `Object` row remain the parent owner above those `Part` rows?

Suggestion:
- yes
- keep `Object` as the parent owner
- treat `Part` as the leaf structural unit under that object

##### [ ] q3 - Should part visibility remain out of the first Browser-9 implementation pass?

Question:
- should Browser hold part-row exposure until after the hierarchy convergence baseline and import landing rules are stable?

Suggestion:
- yes
- keep `9.3` as a later follow-on after `9.1` and `9.2`
- do not force part visibility into the first convergence implementation if the tree-model cleanup can land earlier

##### [ ] q4 - Should Browser also prepare for shared object transform entry even if backend behavior still differs by origin?

Question:
- after imported objects and generated objects share the same structural `Object` row type, should Browser also prepare for one shared object transform entry even if imported and generated objects still use different transform backends under the hood?

Suggestion:
- yes
- the stronger reference/viewer transform shell should be the long-term shared transform entry
- keep backend differences behind the focused-target traits instead of in separate Browser row species

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.3 - Part Row Exposure For Imported Objects.md`

### Browser-9.4 - Imported Object Promotion To True Content Owners

Focus:
- promote imported/reference-backed object rows from compatibility-backed Browser rows into true content-owner rows
- let imported objects participate in normal Browser ownership behavior under `Assembly` / `Component`
- preserve current imported-object transform compatibility while move/reparent semantics become honest

#### Questions / Decisions

##### [x] q1 - Should imported Browser object rows become true draggable content owners after `9.1` through `9.3` are stable?

Question:
- once imported rows already land inside the working content hierarchy and can expose truthful part rows, should Browser promote those rows into the same move/reparent system used by authored content owners?

Suggestion:
- yes
- the row should stop being only object-like presentation and become a true content owner in Browser behavior too

##### [x] q2 - Should Browser preserve the current imported-object transform seam while imported rows become true content owners?

Question:
- when imported rows become true content owners for drag/rearrange and hierarchy ownership, should the current reference/viewer transform seam remain intact underneath until shared object-transform convergence is ready?

Suggestion:
- yes
- keep transform compatibility stable while ownership semantics converge

##### [x] q3 - Should imported objects keep their imported/static row treatment even after they become true content owners?

Question:
- if imported rows become true content-owner rows, should they still keep the darker/static imported-object visual treatment instead of visually collapsing into generated/loading rows?

Suggestion:
- yes
- structural convergence should not erase origin/runtime truth

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.4 - Imported Object Promotion To True Content Owners.md`

### Browser-9.5 - Library Object Rows And Direct Placement Drag

Focus:
- let library/source objects read as normal Browser `Object` rows before placement
- let the user drag rows like `XL.step` directly into any legal `Assembly`, later `Subassembly`, or `Component`
- keep the same visible drag grammar as landed-object rearrange while allowing placement to commit through a different backend seam

Shipped result:
- source/library rows now render as Browser `Object` rows in the `References` branch instead of `reference-item` rows
- the existing Browser drag preview grammar stayed shared:
  - `before`
  - `after`
  - `into`
- `9.5` landed the missing commit seam by adding source-object placement beside `moveProjectContentOwner(...)`
- direct drag from source/library rows now lands a new imported working object under the chosen owner
- source-row selection and Console/transform compatibility stayed adapter-backed during the placement cleanup

#### Questions / Decisions

##### [x] q1 - Should library rows like `XL.step` behave as direct-draggable normal `Object` rows?

Question:
- if a library/source row is visible in Browser, should it already read as a normal `Object` row that can drag into a legal owner path?

Suggestion:
- yes
- source/library origin should be metadata and styling, not a second Browser row species

Decision:
- library rows like `XL.step` should behave as direct-draggable normal Browser `Object` rows
- source/library origin should remain metadata and styling, not a separate row species

##### [x] q2 - Should dragging a library/source object create a landed working object instead of moving the source row?

Question:
- when the user drags `XL.step` from the source/library side into `Assembly 1`, should Browser move the source row itself or create a landed working object under that owner?

Suggestion:
- create a landed working object under the chosen owner
- keep the source/library row available under `References`

Decision:
- dragging a library/source object should create a landed working object under the chosen owner
- the source/library row should remain available under `References`
- both should still read as structural `Object` rows in Browser

##### [x] q3 - Should source-object placement and landed-object rearrange keep one visible drag grammar?

Question:
- once Browser supports both source-object placement and landed-object rearrange, should the user see two different drag languages depending on origin?

Suggestion:
- no
- keep the same visible `before` / `after` / `into` grammar
- let the commit seam differ behind the scenes

Decision:
- Browser should keep one visible drag grammar for source-object placement and landed-object rearrange
- origin-specific differences should live in the commit seam, not in a second user-facing drag language

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.5 - Library Object Rows And Direct Placement Drag.md`

### Browser-9.6 - Placement Shelf Removal And Single Object Identity

Shipped result:
- built-in manifest/library rows now have stable reference-backed owner records in store before drag begins
- ordinary Browser drag from `References` now reuses the shared `imported-reference` owner move seam instead of the temporary `source-reference` placement branch from `9.5`
- dragging `XL.step` from `References` into `Assembly 1` now moves that same object instead of creating a landed copy
- manifest/library rows only remain in the `References` branch while they have no content parent
- once parented into content, those rows render in the content hierarchy as reference-backed object rows without creating duplicate records
- current `reference-item` selection/Console/transform compatibility stayed adapter-backed during the identity cleanup

#### Questions / Decisions

##### [x] q1 - Should `References` rows like `XL.step` become the real project objects instead of reusable placement sources?

Question:
- now that `9.5` made library/source rows read as normal Browser `Object` rows, should the next step make those rows the actual project objects instead of reusable source rows that create landed copies?

Suggestion:
- yes
- Browser object rows should represent one real project object identity
- `References` should be a normal project location, not a hidden placement shelf

Decision:
- `References` rows like `XL.step` should become the real project objects instead of reusable placement sources
- `References` should behave as a normal project location in the hierarchy

##### [x] q2 - Should dragging `XL.step` into `Assembly 1` move the same object instead of creating a landed copy?

Question:
- after shipped `9.5`, should dragging `XL.step` from `References` into `Assembly 1` keep creating a new landed object, or should that drag now move the same object into the new owner path?

Suggestion:
- move the same object
- ordinary Browser drag should mean rearrange/reparent, not implicit duplicate

Decision:
- dragging `XL.step` from `References` into `Assembly 1` should move the same object into the new owner path
- ordinary Browser drag from `References` should stop creating implicit landed copies

##### [x] q3 - Should copy creation become an explicit duplicate/import/place action instead of ordinary drag?

Question:
- if the user wants another copy later, should Browser still create it implicitly by dragging from `References`, or should copy creation move to an explicit action?

Suggestion:
- use an explicit action
- keep no-copy move semantics as the default Browser drag behavior

Decision:
- copy creation should become an explicit duplicate/import/place action instead of ordinary drag from `References`
- Browser drag should stay no-copy by default

##### [x] q4 - Should current reference-transform compatibility stay intact while the single-object identity model lands?

Question:
- while Browser/store identity converges from the temporary `9.5` source-object placement split into one real object identity, should the current reference-transform compatibility seam stay intact instead of forcing same-pass transform convergence?

Suggestion:
- yes
- keep transform/reference compatibility stable while the Browser/store identity cleanup lands

Decision:
- current reference-transform compatibility should stay intact while the single-object identity model lands
- do the ownership/identity cleanup first and leave deeper transform/backend convergence for a later follow-on

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.6 - Placement Shelf Removal And Single Object Identity.md`

### Browser-9.7 - Normal Assembly Component Rows For Reference Hierarchy

Focus:
- delete the remaining special Browser `References` container species
- remap the same visible grouping into normal `Assembly` / `Component` rows
- keep reference-backed object identity and compatibility stable while the container rows converge
- move the converged `References` assembly and grouping components into the normal Browser `contentRows` lane instead of leaving them in the older `referenceRows` lane

Shipped result:
- `References` now renders as a normal top-level `Assembly` row in the Browser content lane
- visible grouping rows such as `Footpads`, `Shoes`, and `Premade Foothooks` now render as normal `Component` rows under that assembly
- the live Browser tree no longer depends on rendered `references-root` / `reference-category` container species for those containers
- current reference-backed selection, visibility, context-menu, Console, and transform compatibility stayed adapter-backed underneath

#### Questions / Decisions

##### [x] q13 - Should `References` keep its label but become a normal assembly row?

Question:
- after shipped `9.6`, should Browser keep showing the familiar `References` label but stop rendering it as a special Browser root species?

Suggestion:
- yes
- keep the label
- delete only the special Browser species

Decision:
- `References` should keep its label, but become a normal `Assembly` row

##### [x] q14 - Should `Footpads`, `Shoes`, `Premade Foothooks`, and `User References` become normal component rows?

Question:
- should the current reference grouping rows remain visible, but stop rendering as special category species and instead become ordinary `Component` rows under `References`?

Suggestion:
- yes
- keep the grouping labels the user already understands
- delete the special category species

Decision:
- `Footpads`, `Shoes`, `Premade Foothooks`, and `User References` should become normal `Component` rows under `References`

##### [x] q15 - Should Browser keep current reference-backed compatibility while the container rows converge?

Question:
- once Browser stops rendering special reference container rows, should the current selection, Console, viewer, and transform compatibility stay adapter-backed during the first pass?

Suggestion:
- yes
- converge the visible hierarchy first
- keep the deeper compatibility migration separate

Decision:
- Browser should keep current reference-backed compatibility while the container rows converge

##### [x] q16 - Should the converged `References` assembly and grouping components move into the normal `contentRows` lane in the first pass?

Question:
- once Browser renders `References` and its grouping nodes as normal `Assembly` / `Component` rows, should those rows still stay in the separate `referenceRows` output lane, or should they join the normal `contentRows` lane too?

Suggestion:
- move them into `contentRows`
- otherwise the Browser would still keep them outside the normal content drag and preview path

Decision:
- the converged `References` assembly and grouping components should move into the normal `contentRows` lane in the first pass

Shipped phase doc:
- `docs/Human-Plans/Architecture/Browser/Shipped/Browser_Phase Browser-9.7 - Normal Assembly Component Rows For Reference Hierarchy.md`

## Suggested Implementation Shape

Center the work around:
- Browser row/view-model derivation for reference-backed rows
- shared content-owner typing and Browser row-family mapping
- any reference-root/category selectors that still assume a separate Browser species
- Browser tests that currently assume a special `References` tree shape
- Browser object row visual treatment for imported versus generated objects

Likely affected areas:
- Browser tree row selection/derivation seams
- Browser row presenter/view-model mapping
- store-side content/reference tree adaptation
- tests around Browser structure and row identity

## Test Plan

- Browser no longer renders a separate special `References` root species
- `References` appears as a normal `Assembly`
- `Footpads`, `Shoes`, and `Premade Foothooks` appear as normal `Component` rows
- imported/library items appear as normal `Object` rows under those components
- library/source object rows like `XL.step` can drag directly into legal `Assembly` / `Subassembly` / `Component` owners
- source-object placement uses a separate landed-object creation seam instead of pretending the source row is an existing owner move
- existing Browser selection and drag/rearrange still work on the converged hierarchy
- Browser row actions remain coherent on these remapped rows
- imported-origin styling/metadata remains visible even though the row species converges
- imported versus generated object rows still remain visually distinguishable after the hierarchy convergence

## Later Follow-On

After the hierarchy convergence is stable, Browser can widen into:
- explicit part rows under imported objects when the source structure already contains parts
- richer import mapping into `Component` or `Subassembly` when the source file clearly contains that structure
- direct source/library object placement drag that creates landed working objects without inventing a second Browser row species
- shared object transform entry that reuses the stronger reference/viewer transform shell across both imported and generated objects while still respecting origin-specific backend behavior
- later import-surface work such as a `pubparts.xyz` catalog flow, which remains separate from this Browser-structure phase

That later architectural reset now lives in:
- `docs/Human-Plans/Architecture/Browser/Future/Browser_Phase Browser-10 - Unified Project Object Tree Source Of Truth.md`
