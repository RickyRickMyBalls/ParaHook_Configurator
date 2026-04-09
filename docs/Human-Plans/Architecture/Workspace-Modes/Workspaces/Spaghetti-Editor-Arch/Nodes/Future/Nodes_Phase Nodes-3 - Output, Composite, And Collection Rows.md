# `Nodes-3` - `Output, Composite, And Collection Rows`

## Doc Header

### Doc History
10. 2026-04-08 12:03: Marked `Nodes-3.4 - Composite Row Child Ownership And Family Follow-On Prep` shipped after `NodeView.tsx` began giving structured composite parents explicit child-count and ownership language backed by the field-tree seam while `types/fieldTree.ts` added explicit `Vec3` child ownership, then advanced this doc from an open ladder to a shipped `Nodes-3` row-family pass
9. 2026-04-08 11:47: Tightened `Nodes-3.4 - Composite Row Child Ownership And Family Follow-On Prep` into an implementation-ready slice by grounding it in the live composite-row expansion seams in `NodeView.tsx`, the current field-tree ownership in `types/fieldTree.ts`, and the existing composite-expansion state path in `SpaghettiCanvas.tsx`, then sharpening the next pass around explicit `Vec2` / `Vec3` and transform-group child ownership instead of a vague final follow-on note
8. 2026-04-08 11:43: Marked `Nodes-3.3 - Collection Parent And Child Row Contract` shipped after `NodeView.tsx` began giving `SketchProfiles` and `SketchProfile` explicit aggregate-parent versus singular-member attached-body meaning while focused sketch/extrude node tests and selector aggregate-consumption tests proved that the parent collection row stays distinct from the singular member row, then advanced this doc's next handoff toward the later composite-row contract follow-on
7. 2026-04-08 11:33: Tightened `Nodes-3.3 - Collection Parent And Child Row Contract` into an implementation-ready slice by grounding it in the live `SketchProfiles` aggregate output read in `NodeView.tsx`, the current sketch output-row behavior in `NodeView.geometryMode.test.tsx`, and the whole-port aggregate-consumption contract already proven in `selectNodeVm.ts` and `selectNodeVm.test.ts`, then sharpening the next pass around explicit parent-versus-child collection meaning instead of a vague later hierarchy note
6. 2026-04-08 11:16: Marked `Nodes-3.2 - Shared Output Row Shell Contract Lock` shipped after the shared managed output-row seam was tightened in `PortView.tsx` and `NodeView.tsx` so the header status lane and attached-body lane now have explicit output-row hooks that both sketch and extrude tests prove, then advanced this doc's next handoff to the later collection-row contract follow-on
5. 2026-04-08 10:05: Tightened `Nodes-3.2 - Shared Output Row Shell Contract Lock` into an implementation-ready slice by grounding it in the live managed output-row assembly across `NodeView.tsx`, `PortView.tsx`, and `spaghetti.css`, then locking the next pass to codify the shared header-versus-attached-body contract that should keep future output rows from drifting back into family-local shells
4. 2026-04-08 09:58: Marked `Nodes-3.1 - Extrude Output Row Parity Against Sketch` shipped after the extrude-only output card CSS override was removed from `spaghetti.css`, returning `Geometry/Extrude` `SolidBody` to the same full-width geometry-stack output-row shell rhythm as sketch outputs while focused `NodeView` tests proved the managed output-row path stayed stable
3. 2026-04-08 09:48: Tightened `Nodes-3.1 - Extrude Output Row Parity Against Sketch` into an implementation-ready slice by grounding it in the live `NodeView.tsx` managed output-row seam, the current sketch output-row coverage in `NodeView.geometryMode.test.tsx`, and the locked visual mismatch that `SolidBody` still reads like an inset mini-card instead of the calmer full-width sketch output-row shell
2. 2026-04-08 09:43: Tightened the `Nodes-3` ladder by renaming the subphases to `Nodes-3.1` through `Nodes-3.4`, sharpening the first slice around explicit extrude `SolidBody` versus sketch output-row parity, and separating later shell lock, collection, composite, and adoption follow-ons into a cleaner numbered sequence
1. 2026-04-08 09:38: Created this dedicated `Nodes-3` future doc by splitting the broader output/composite/collection row lane out of `Nodes-Index.md`, locking the first implementation-ready slice to managed output-row pin and header parity, and naming `Geometry/Extrude` `SolidBody` versus the calmer sketch output row as the immediate proving case

## [x] `Nodes-3` - `Output, Composite, And Collection Rows`

### Summary

#### Purpose:
- standardize the next shared row families after the `Nodes-2` and `Nodes-2.5` proving work

#### Owns:
- standardizing managed `output row` behavior beyond the first family-local proving passes
- locking what a calmer shared output-row pin/header contract should be
- defining when a row honestly becomes a `composite row`
- defining when a row honestly becomes a `collection row`
- keeping later `Sketch`, `Extrude`, and `Loft` family adoption tied to one shared row-language instead of drifting again

#### Does not own:
- reopening compile/runtime/output ownership work already handled in family docs
- broad toolbar redesign
- a giant all-node markup rewrite in one pass
- unrelated primitive numeric-row cleanup that already belongs to `Nodes-2.5`

#### Current seam read:

- `Nodes-1` locked the shared shell and managed row-controller direction
- `Nodes-2` proved reusable `reference row` and managed `numeric row` behavior
- `Nodes-2.5` proved the separate primitive numeric-row style
- `Extrude-5` proved that `Geometry/Extrude` `SolidBody` can move onto the shared managed output-row shell without reopening runtime semantics
- the remaining gap is that the broader output-row family still is not written down tightly enough:
  - the live extrude output row is structurally much closer now
  - but the output pin and header balance still need to read like the calmer sketch output-row example instead of like a near-match
- this is the right moment to promote `Nodes-3` from umbrella-only direction into a real execution home

Current strongest read:
- `Nodes-3` should still begin with `output row` parity before widening into `composite row` and `collection row` adoption
- `Nodes-3.1` is now shipped as the first narrow parity slice:
  - `Geometry/Extrude` `SolidBody` no longer carries the old extrude-only inset output-card override
  - the row now falls back to the same calmer full-width geometry-stack output-row shell read as sketch outputs
- the next implementation-ready slice is now `Nodes-3.2`
- `Nodes-3.2` should now lock the reusable shared output-row shell contract explicitly:
  - after `Nodes-3.1`, the family shell is visibly closer
  - but the reusable rule still mostly lives as implied behavior across `NodeView.tsx`, `PortView.tsx`, and `spaghetti.css`
  - the next honest step is to write that shared contract into the implementation seams so later output rows do not quietly fork again
- `Nodes-3.2` is now shipped:
  - the shared managed output-row shell now carries explicit header-status and attached-body hooks in the reusable render seam
  - sketch and extrude output-row tests now prove the same shell contract instead of relying only on precedent
  - the next open lane is `Nodes-3.3`
- `Nodes-3.3` should now become the next implementation-ready slice:
  - `SketchProfiles` already reads like the aggregate parent collection surface in live sketch output rows
  - whole-port aggregate consumption from `SketchProfiles` into `Extrude` already exists in the selector/view-model seam
  - the remaining gap is to lock one explicit parent-versus-child collection row contract before more family-local collection surfaces appear
- `Nodes-3.3` is now shipped:
  - `SketchProfiles` now carries explicit parent-collection attached-body language
  - `SketchProfile` now carries explicit singular-member attached-body language
  - focused node and selector tests now prove that aggregate parent meaning stays distinct from the singular member surface
  - the next open lane is `Nodes-3.4`
- `Nodes-3.4` is now shipped:
  - `fieldTree.ts` now explicitly owns ordered `Vec3` children alongside `Vec2`
  - composite parents now surface explicit child-count ownership summaries and structured-parent attached-body language in `NodeView.tsx`
  - focused node and field-tree tests now prove that composite child rows come from real type-owned structure rather than decorative nesting
  - the next open lane after this shipped ladder is later family adoption under `Nodes-4`

Current shipped output:
- `src/app/theme/surfaces/spaghetti.css`
  - no longer applies the old extrude-only output-card override under `Geometry/Extrude` outputs
- `Geometry/Extrude` `SolidBody`
  - now reads through the shared geometry-stack output-row shell instead of the half-width inset card treatment
- focused canvas coverage stayed green in:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

The next implementation-ready slice should stay narrow:
  - use managed output rows already visible in live code
  - use the sketch output row as the visual/structural reference
  - make `Geometry/Extrude` `SolidBody` the proving case for the still-drifting output-pin/header details

### Questions

#### [ ] Question 1 - What is the first implementation-ready target inside `Nodes-3`?

##### Suggested answer
- managed `output row` parity
- specifically:
  - `Geometry/Extrude` `SolidBody`
  - compared against the calmer sketch output-row shape already acting as the stronger reference

##### Why
- the user-visible mismatch is narrow, real, and already adjacent to shipped output-row groundwork
- it is the cleanest way to start `Nodes-3` without pretending `Vec2`, `Vec3`, and collection rows are equally ready right now

#### [ ] Question 2 - What should `Nodes-3` treat as the reference output-row shape?

##### Suggested answer
- treat the sketch managed output row as the current reference read for:
  - output pin anchoring
  - header balance
  - row-edge rhythm
  - calmer shared output-row feel

##### Why
- that is the closest live example of how the managed output-row family is supposed to feel
- `Extrude-5` improved extrude structure materially, but `Nodes-3` still needs one broader contract that says the family target is sketch-like parity rather than merely "good enough for extrude"

#### [ ] Question 3 - What is a `composite row` in this phase?

##### Suggested answer
- a row whose type truly owns stable child structure
- examples:
  - `Vec2`
  - `Vec3`
  - transform groups

##### Why
- composite rows should expand because the data actually has children
- they should not become a fallback nesting trick for unrelated clutter

#### [ ] Question 4 - What is a `collection row` in this phase?

##### Suggested answer
- a parent row that represents one real ordered collection and may reveal member rows when expanded
- examples:
  - `SketchProfiles`
  - later extrude multi-profile targets
  - later loft sections and rails

##### Why
- collection rows need one coherent parent-versus-child meaning
- that meaning should be explicit before more family-local collection UIs appear

### Spec

Locked top-level direction:
- keep `Nodes-3` as the shared row-family home for:
  - `output row`
  - `composite row`
  - `collection row`
- start with `output row` parity first
- use live sketch/extrude output rows as the proving band before widening into broader child-row adoption

Locked `output row` direction:
- managed output rows should read like the same family across `Sketch` and `Extrude`
- the output pin should feel like a true row-edge affordance, not a family-local ornament
- header text balance should stay calm and consistent with the stronger sketch output-row example
- attached output bodies may differ by family content, but the row shell and pin/header rhythm should not drift
- `Extrude-5` remains valid shipped groundwork:
  - do not reopen its runtime/result-ownership scope
  - do use `Nodes-3` to tighten the broader family-level parity contract that `Extrude-5` intentionally did not try to own by itself

Locked `composite row` direction:
- only expand rows whose type honestly owns child structure
- safe first owners include:
  - `Vec2`
  - `Vec3`
  - transform channel groups
- do not force primitive scalar rows into fake composite wrappers

Locked `collection row` direction:
- the parent collection row must mean the whole ordered collection
- expanded member rows must mean one real member each
- later family docs may own specific runtime semantics, but `Nodes-3` owns the row-language contract for parent versus child collection surfaces

Locked scope boundary:
- do not widen this doc into:
  - compile/runtime contract rewrites
  - feature-stack ownership debates
  - broader toolbar cleanup
  - full `Loft` planning

### Subphases

#### [x] `Nodes-3.1` - `Extrude Output Row Parity Against Sketch`

Purpose:
- make the shared managed `output row` family read intentionally consistent before broader composite and collection rows widen the surface area further

Owns:
- locking the first explicit family-level output-row parity contract
- using the sketch managed output row as the reference shape
- using `Geometry/Extrude` `SolidBody` as the proving case for:
  - output pin placement feel
  - row-edge anchoring
  - calmer header balance
  - full-width row-shell rhythm versus inset-card drift
- clarifying whether the remaining extrude mismatch lives in:
  - `NodeView.tsx`
  - `PortView.tsx`
  - shared managed output-row helper seams

Does not own:
- reopening `Extrude-5` runtime/copy work
- composite child-row rollout
- collection parent/child rollout

Shipped result:
- removed the extrude-only output-card CSS override that was still forcing `SolidBody` into a half-width inset outputs treatment
- let `Geometry/Extrude` output rows fall back to the same calmer geometry-stack output-row shell styling already used by sketch outputs
- preserved the existing managed output-row render path, output pin ownership, header status copy, and attached-body behavior from the earlier `Extrude-5` work
- re-ran the focused `NodeView` suites to prove the visible parity cleanup did not break the managed output-row path

Current seam read:
- `Extrude-5` already moved `SolidBody` onto the shared managed output-row path
- the remaining user-visible complaint is narrower:
  - the extrude output pin still does not fully read like how the row is supposed to look
  - the intended look is the calmer sketch output-row example
- this makes `Nodes-3.1` the right next slice:
  - broader than another extrude-only patch note
  - still narrow enough to implement and verify honestly
- the live code seam is now narrow enough to name directly:
  - `src/app/spaghetti/canvas/NodeView.tsx`
    - output-row branch selection for sketch versus extrude lives around the managed geometry node render path
    - the dedicated extrude output-row assembly for `SolidBody` still lives in the same file near the current `rowLabel: 'SolidBody'` render call
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
    - already covers the calmer sketch output-row cycle/read behavior and is the best parity reference test surface
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
    - already covers dedicated extrude template render behavior and the current `SolidBody` output copy/body path
- this phase should stay on those seams instead of widening into selector/runtime ownership again

Locked proving target:
- use the sketch managed output row as the parity reference
- make `Geometry/Extrude` `SolidBody` match that shared read for:
  - full-width shell usage inside the outputs section
  - output pin anchoring
  - pin spacing against the right edge
  - header text balance next to the pin
  - overall row-edge rhythm
  - compact status-in-header instead of card-face waiting copy

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/canvas/PortView.tsx`
- `src/app/spaghetti/canvas/structuredWireRowController.ts`
- any shared managed-output helper seam already introduced for sketch/extrude parity
- focused node-surface tests

Implementation-ready checks:
- prove the sketch output row is the intended reference, not only a loose inspiration
- name the exact visible extrude mismatch before implementation broadens:
  - inset mini-card treatment inside the outputs section
  - output pin not reading as the same right-edge anchor used by sketch outputs
  - waiting/help copy still competing with the row face instead of reading as attached-body content
- keep the pass on shared output-row parity rather than another family-local output-shell fork
- preserve the shipped `Extrude-5` body and helper cleanup unless one tiny parity adjustment requires touching the shared seam
- keep the current output semantics unchanged:
  - one `SolidBody` row
  - same waiting versus ready honesty
  - same attached-body ownership
- prefer changing shared managed-output shell behavior only if that is the smallest honest path to make extrude match sketch

Acceptance checks:
- the extrude `SolidBody` output pin reads like the same family as the sketch output row
- the extrude `SolidBody` row no longer reads like an inset mini-card
- the output pin feels anchored to the row edge instead of offset or decorative
- the header text and pin spacing read calmer and less family-local
- waiting/help wording lives in the attached body rather than in the row face
- the shared managed output-row story becomes easier to describe as one reusable row family

Suggested execution order:
1. Re-read the live sketch managed output-row render path and identify the exact shell behavior that extrude should match.
2. Re-read the current `SolidBody` output-row assembly in `src/app/spaghetti/canvas/NodeView.tsx`.
3. Adjust the smallest shared/output-row render seam needed so `SolidBody` uses:
   - the same full-width shell rhythm
   - the same right-edge pin anchoring read
   - the same calm header balance
4. Keep the existing attached-body copy path intact unless one tiny structure move is required to remove waiting text from the row face.
5. Extend focused tests around sketch-versus-extrude output-row parity.

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- if the runner still hits any known environment limitation, record that explicitly and keep the parity proof focused on render-structure assertions

Definition of done:
- `Nodes-3` has one real implementation-ready first slice
- the output-row family now has one clearer sketch-referenced parity target instead of only separate family-local history
- an implementer can start directly from the named `NodeView` and test seams without re-deciding scope

Verification:
- `npm.cmd test -- src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

#### [x] `Nodes-3.2` - `Shared Output Row Shell Contract Lock`

Purpose:
- lock the reusable managed output-row shell contract after the first extrude-versus-sketch parity pass proves the remaining visible seams honestly

Owns:
- turning the first parity pass into one explicit shared output-row shell contract
- naming what belongs in:
  - row header
  - attached output body
  - row-edge pin treatment
- preventing future output rows from drifting back into inset cards or family-local pin spacing

Does not own:
- collection parent/child semantics
- composite child ownership

Shipped result:
- tightened `src/app/spaghetti/canvas/NodeView.tsx` so the managed geometry output helper now names the output-header contract more explicitly around header status rather than a generic resolved-value label
- tightened `src/app/spaghetti/canvas/PortView.tsx` so the shared output-row shell now exposes explicit header-lane, header-status, and attached-body hooks for output rows
- extended both:
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  so sketch and extrude now prove the same reusable output-row shell contract
- kept the pass narrow:
  - no collection rollout
  - no composite rollout
  - no runtime/result ownership changes

Locked contract now proven in code:
- the row face owns:
  - the leading chevron
  - the left label
  - the right compact status lane
  - the row-edge output pin
- the body lane owns:
  - attached waiting/help honesty
  - richer output detail
  - default output details when the shared row expands
- later output rows should reuse these same shell hooks instead of inventing family-local output wrappers

Verification:
- `npm.cmd test -- src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`


#### [x] `Nodes-3.3` - `Collection Parent And Child Row Contract`

Purpose:
- lock the shared row-language for parent collection rows and their member rows after output-row parity is clearer

Owns:
- parent-versus-child collection row meaning
- first shared ordered-collection row rules
- the calmer row-language for aggregate parent rows such as `SketchProfiles`

Does not own:
- the deeper runtime semantics that stay in family docs like `Sketch - 2` or later extrude follow-ons

Shipped result:
- tightened `src/app/spaghetti/canvas/NodeView.tsx` so `SketchProfiles` now reads as the aggregate parent collection row and `SketchProfile` now reads as the singular member row through explicit attached-body language
- preserved the current shared managed output-row shell from `Nodes-3.2` while making collection parent-versus-member meaning visible inside that shell instead of inventing a separate collection widget
- extended:
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
  so the sketch surface now proves the aggregate-parent versus singular-member distinction
- re-ran `src/app/spaghetti/selectors/selectNodeVm.test.ts` to keep the selector-owned whole-port aggregate-consumption contract green alongside the node-surface change

Locked contract now proven in code:
- `SketchProfiles` means the whole ordered parent collection
- `SketchProfiles` remains a first-class aggregate wire target
- `SketchProfile` means one resolved singular member surface, not the whole collection
- later child collection rows, when they appear, should inherit that same parent-versus-member meaning instead of redefining it per family

Verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx src/app/spaghetti/selectors/selectNodeVm.test.ts`

#### [x] `Nodes-3.4` - `Composite Row Child Ownership And Family Follow-On Prep`

Purpose:
- lock when structured types honestly expand into child rows and what those child rows should mean

Owns:
- `Vec2` / `Vec3` child-row ownership rules
- transform-group composite-row language
- explicit avoidance of fake nesting for primitive values
- handing the stabilized `Nodes-3` row language forward toward later family adoption such as `Loft`

Does not own:
- every downstream adoption in one pass

Shipped result:
- `src/app/spaghetti/types/fieldTree.ts` now explicitly owns ordered `Vec3` children and exposes immediate-child structure alongside the existing composite leaf-path seam
- `src/app/spaghetti/canvas/NodeView.tsx` now gives composite parents explicit child-count summaries and structured-parent ownership bodies backed by the field-tree seam
- focused `NodeView` and `fieldTree` tests now prove that `Vec2` / `Vec3` child rows represent real structured ownership while whole-parent composite drive still reads as read-only child state instead of fake absence

Current seam read:
- `Nodes-3.1` through `Nodes-3.3` already stabilized:
  - shared output-row shell behavior
  - parent-versus-child collection meaning
- the next ambiguity is now composite ownership:
  - live code already supports composite expansion for structured field trees
  - `Vec2` / `Vec3`-like shapes already have leaf rows in the field-tree seam
  - transform-group content already exists in the sketch attached-body read
  - but the repo still lacks one explicit rule for when those child rows are the honest UI and when nesting would just be decorative clutter
- the live seams are now concrete enough to name:
  - `src/app/spaghetti/canvas/NodeView.tsx`
    - already owns `renderCompositeInputPort` and `renderCompositeOutputPort`
    - already decides when composite rows expand into leaf child rows and how whole-port wiring affects those children
  - `src/app/spaghetti/types/fieldTree.ts`
    - already defines which port kinds are composite and what their leaf children are
    - is the clearest ownership seam for whether a type honestly has child structure
  - `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
    - already owns composite expansion state and revision plumbing
    - is the current state seam that later family adoption will depend on
  - `src/app/spaghetti/canvas/NodeView.test.tsx`
    - already proves compact `Param/Vec2` behavior and several sketch/extrude row surfaces
    - is the best static render seam to lock what composite rows should and should not become
  - `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
    - already proves the current node-mode behavior around sketch rows and attached-body content
    - is the best interactive seam for composite row visibility and expansion expectations

Locked proving target:
- explicitly lock that composite rows are for structured types that truly own child values
- safe first proving owners:
  - `Vec2`
  - `Vec3`
  - transform channel groups
- explicitly lock that:
  - primitive scalar rows should not be wrapped in fake composite groups just because a node has too many controls
  - child rows must represent real typed children, not layout-only sublabels
  - whole-port parent wiring may make child rows read-only, but does not erase the type-owned child structure underneath
- keep this pass on contract and first proving surfaces rather than a repo-wide composite rollout

Nearby implementation seams this subphase should keep in view:
- `src/app/spaghetti/canvas/NodeView.tsx`
- `src/app/spaghetti/types/fieldTree.ts`
- `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`
- `src/app/spaghetti/canvas/NodeView.test.tsx`
- `src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`

Implementation-ready checks:
- name the first honest composite owners directly instead of leaving `Vec2` / `Vec3` and transform groups as generic examples
- verify that the field-tree seam, not local family markup, is the primary source of truth for whether a type is composite
- verify that transform-group follow-on work should inherit the same composite ownership rule rather than inventing a separate nested-group language
- keep the pass narrow:
  - no full later-family adoption sweep
  - no collection-row rewrites
  - no primitive numeric-row redesign
- preserve the current read-only child behavior when a whole parent wire drives a composite input
- prefer the smallest honest implementation that makes composite ownership easier to explain and test before pushing that language into later family docs such as `Loft`

Acceptance checks:
- an implementer can point to one explicit composite-row ownership contract instead of inferring it from scattered `Vec2` / `Vec3` examples
- `Vec2` / `Vec3` child rows are clearly described as real type-owned children
- transform groups are clearly constrained to the same child-ownership language instead of a separate ad hoc nesting pattern
- primitive scalar rows are clearly excluded from fake composite wrappers
- later family adoption work can start from the named composite seams without re-deciding what a composite row is

Suggested execution order:
1. Re-read `renderCompositeInputPort` and `renderCompositeOutputPort` in `NodeView.tsx`.
2. Re-read the composite type ownership in `src/app/spaghetti/types/fieldTree.ts`.
3. Re-read the composite expansion state path in `src/app/spaghetti/canvas/SpaghettiCanvas.tsx`.
4. Lock the smallest code-backed contract that clearly separates honest structured child rows from decorative nesting.
5. Extend focused `NodeView` tests so at least one composite proving surface demonstrates the locked ownership rule.
6. Record the shipped composite-row contract in this doc after implementation lands.

Suggested verification:
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/canvas/NodeView.geometryMode.test.tsx`
- `npm.cmd exec vitest run src/app/spaghetti/types/fieldTree.test.ts`
- if the pass stays contract-light, keep at least one field-tree assertion and one node-surface assertion proving that composite child rows are tied to real type ownership

Definition of done:
- one shared composite-row contract exists for later family adoption
- an implementer can start from the named composite render, field-tree, and state seams without re-deciding whether a row honestly owns child structure

### Suggested Execution Order

1. Start with `Nodes-3.1` and make extrude output-row parity against sketch explicit.
2. Lock the broader reusable output-row shell contract in `Nodes-3.2`.
3. Hand the parent-versus-child collection contract into `Nodes-3.3`.
4. Lock composite child ownership and later family prep in `Nodes-3.4`.

### Acceptance Checks

- `Nodes-3` clearly starts from output-row parity rather than from three equally vague row families
- the sketch output row is explicitly named as the current parity reference
- `Geometry/Extrude` `SolidBody` is explicitly named as the first proving target
- the numbered subphase ladder now reads as:
  - `3.1`
  - `3.2`
  - `3.3`
  - `3.4`
- composite and collection follow-ons stay visible without being falsely presented as equally implementation-ready today

### Definition Of Done

- `Nodes-3` is no longer only an umbrella paragraph in `Nodes-Index.md`
- the row-family lane now has one dedicated future doc
- the first honest implementation-ready slice is explicitly the extrude output-pin/header parity pass against the sketch output-row reference
- the later follow-ons now read as one numbered ladder instead of lettered placeholders
