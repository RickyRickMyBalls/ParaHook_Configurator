# Object Types

## Doc Header

### Doc History
1. 2026-04-14 11:50: Added the first `Object Types` family index, linked it to `Object-Types-Vision.md`, and split the generic collection-object-type direction into an ordered phase ladder from shared type contract and runtime wrapper work through `SketchProfiles` / `SolidBodies` proving migrations, first utility-node adoption, and final legacy plural-kind retirement

## Vision

- `Object-Types-Vision.md`

## Summary

### Purpose

- turn the collection direction from `Object-Types-Vision.md` into an ordered execution ladder
- establish one shared object-type contract for collection-shaped SWRs instead of continuing to add family-local plural special cases
- sequence the work so the repo can reach a real generic `Split Array` node without baking in `SketchProfiles` and `SolidBodies` by name

### Owns

- the shared collection object-type architecture direction
- the ordered phase plan for introducing generic collection types and shared runtime shapes
- the proving-family migration order for:
  - `SketchProfiles`
  - `SolidBodies`
- the first utility-node proving lane for generic collection consumption and publication
- the final retirement direction for legacy plural special cases once the new seam is stable

### Does not own

- topology-specific `SolidBody` child-object planning that already belongs to the `SolidBodies` family
- viewport-picking UX
- feature-specific behavior for later filter/query/analysis nodes beyond the first utility proving cut
- broad non-collection node cleanup that belongs to the shared `Nodes` family instead

### Current strongest read

- the real missing seam is not the split behavior itself
- the real missing seam is that the graph still has singular object kinds plus a growing pile of plural one-off kinds instead of one shared collection contract
- `SketchProfiles` and `SolidBodies` should become the first two proving families for that shared contract rather than permanent exceptions to it
- `Split Array` should come after that contract exists, not before
- the safest migration shape is:
  1. introduce the shared type contract
  2. introduce the shared runtime wrapper and compatibility bridge
  3. widen validator/evaluator/compiler semantics
  4. widen shared row and field-tree behavior
  5. migrate proving families
  6. add generic collection utility nodes
  7. retire legacy plural shims

## Questions

### [x] Question 1 - What should the first `Object Types` family prove?

#### Locked answer

- one generic collection object-type contract

#### Why

- without that, every later collection-shaped node and family will keep solving the same problem with another bespoke plural kind or another compatibility exception

### [x] Question 2 - Which proving family should migrate first?

#### Locked answer

- `SketchProfiles`

#### Why

- sketch already behaves like the clearest parent-plus-member collection surface
- extrude and later utility nodes already want sketch profile collections, so proving sketch first gives the rest of the graph a cleaner upstream source

### [x] Question 3 - Should `Split Array` land before or after the shared collection contract?

#### Locked answer

- after

#### Why

- if it lands first, it will almost certainly become another one-off node with explicit `SketchProfiles` / `SolidBodies` branching
- if it lands after, it becomes proof that the generic collection contract is real

### [x] Question 4 - Should legacy plural kinds disappear immediately?

#### Locked answer

- no
- keep a temporary compatibility bridge during migration, then retire the legacy plural kinds only after the proving families and the first utility node are stable

#### Why

- a bridge keeps the migration calm and lets the repo convert one seam at a time instead of forcing a risky big-bang rewrite

## Spec

### Locked direction

- singular object kinds remain the semantic source of truth
- collection object types are formed from singular object kinds instead of being modeled as unrelated plural siblings
- row labels such as `SketchProfiles` and `SolidBodies` stay user-facing collection names
- the underlying type, runtime value, compatibility rule, and field-tree behavior should come from one shared collection contract

### Locked proving order

1. `ObjectTypes-1` - `Generic Collection Type Contract`
2. `ObjectTypes-2` - `Shared Collection Runtime Wrapper And Compatibility Bridge`
3. `ObjectTypes-3` - `Validator, Evaluator, And Compiler Collection Semantics`
4. `ObjectTypes-4` - `Shared Collection Row And Member Contract`
5. `ObjectTypes-5` - `SketchProfiles Migration To Shared Collection Contract`
6. `ObjectTypes-6` - `SolidBodies Migration To Shared Collection Contract`
7. `ObjectTypes-7` - `Generic Collection Utility Nodes`
8. `ObjectTypes-8` - `Legacy Plural Kind Retirement`

### Acceptance target

The family should be considered complete when:
- the graph can express one generic collection object type
- `SketchProfiles` and `SolidBodies` both resolve through that one shared contract
- collection parent/member UI behavior comes from shared type-owned seams
- generic collection utility nodes can consume and publish collections without family-specific branching
- legacy plural special cases can be removed without losing graph meaning

## Phase Breakdown

## [ ] ObjectTypes-1 - Generic Collection Type Contract

### Purpose

- introduce one graph-native collection type shape that points at its singular member type
- stop widening the flat port-kind surface with new plural special cases whenever one family needs array-like behavior

### Owns

- the first generic collection type direction
- the first singular-member-versus-collection-parent type relationship
- the first narrow type-schema seams needed for later runtime and UI work

### Does not own

- final runtime wrapper details
- family migration work
- utility-node behavior

### Current strongest read

- the first change should be type-contract truth only
- this phase should define how the graph says `collection<SketchProfile>` and `collection<SolidBody>` before it touches deeper migration semantics

### Implementation direction

- add one generic collection type shape
- keep singular object kinds such as `sketchProfile` and `solidBody`
- map friendly row labels such as `SketchProfiles` and `SolidBodies` onto that shared collection type rather than onto bespoke plural kinds

## [ ] ObjectTypes-2 - Shared Collection Runtime Wrapper And Compatibility Bridge

### Purpose

- introduce one shared runtime wrapper for collection values
- keep a temporary compatibility bridge so old plural outputs do not need to disappear in the same cut

### Owns

- the shared collection runtime wrapper
- the first bridge between old plural family shapes and the new generic collection value shape
- the migration-safe value normalization seam

### Does not own

- final validator/compiler widening
- shared row/member UI
- utility-node behavior

### Current strongest read

- this phase should make collection values look the same at runtime before the repo depends on that sameness in more places
- a migration bridge should exist here rather than being scattered ad hoc through later family work

### Implementation direction

- introduce one shared collection wrapper such as `CollectionValue<T>`
- normalize `SketchProfiles` and `SolidBodies` toward that wrapper
- keep a temporary adapter seam so existing family callers can move incrementally

## [ ] ObjectTypes-3 - Validator, Evaluator, And Compiler Collection Semantics

### Purpose

- make collection compatibility generic instead of family-local
- teach evaluation and compile paths how singular members and whole collections contribute into collection inputs

### Owns

- generic compatibility rules such as:
  - `T -> T`
  - `Collection<T> -> Collection<T>`
  - `T -> Collection<T>`
- collection defaulting and normalization in evaluation
- shared compile/evaluation resolution helpers for collection inputs

### Does not own

- final node-surface collection rendering
- family migration copy or row wording

### Current strongest read

- once runtime values are normalized, the next missing truth is generic compatibility and lowering behavior
- this phase should delete special-case compatibility pressure, not add one more exception for the next family

### Implementation direction

- move collection compatibility rules into shared validator seams
- add shared collection input resolution helpers
- make downstream nodes consume one normalized collection value shape instead of bespoke family payloads

## [ ] ObjectTypes-4 - Shared Collection Row And Member Contract

### Purpose

- make collection parent/member behavior come from shared field-tree and row-language seams
- stop treating collection expansion as a family-local rendering trick

### Owns

- the shared collection parent row meaning
- the shared member row meaning
- field-tree awareness for real collection nodes
- shared row-language for later utility nodes and later object-type families

### Does not own

- family-specific topology semantics
- later semantic query helpers

### Current strongest read

- the type and runtime seams will not feel complete until the node surface can render one honest generic collection parent-plus-member shape
- this phase should make collection structure type-owned instead of copy-owned

### Implementation direction

- teach the field tree how to represent collection object types
- make shared node-surface seams understand collection parent rows and member rows generically
- preserve friendly family labels while using the shared collection architecture underneath

## [ ] ObjectTypes-5 - SketchProfiles Migration To Shared Collection Contract

### Purpose

- make `SketchProfiles` the first proving family for the new collection contract

### Owns

- sketch-side migration from bespoke plural behavior to shared collection behavior
- sketch parent-plus-member collection surface parity
- the first real proof that an upstream family can publish through the shared contract

### Does not own

- `SolidBodies` migration
- utility nodes

### Current strongest read

- sketch should migrate first because it is the clearest and lowest-risk proving family
- once sketch publishes through the shared contract, later consumers have a stable upstream collection source

### Implementation direction

- keep the parent row label `SketchProfiles`
- publish the parent through the generic collection contract
- keep singular `SketchProfile` member rows real and wireable

## [ ] ObjectTypes-6 - SolidBodies Migration To Shared Collection Contract

### Purpose

- make `SolidBodies` the second proving family for the same shared collection contract

### Owns

- body-collection migration onto the shared collection value shape
- alignment between sketch collections and body collections
- removal of body-family aggregate special-casing that no longer belongs after the shared seam exists

### Does not own

- topology-child object planning inside `SolidBody`
- utility-node behavior

### Current strongest read

- `SolidBodies` should migrate after sketch so the second proving family can reuse a seam that is already live instead of co-designing it
- this phase should make body collections look generic without reopening the separate `SolidBody` child-topology family plan

### Implementation direction

- keep the row label `SolidBodies`
- move the underlying contract onto the shared collection seam
- keep singular `SolidBody` behavior intact where singular body outputs are still meaningful

## [ ] ObjectTypes-7 - Generic Collection Utility Nodes

### Purpose

- prove that the shared collection contract is reusable by shipping the first generic collection utility node set
- make `Split Array` the first narrow proving node

### Owns

- the first utility-node proof that one node can accept and publish generic collections
- the first real `Split Array` node direction
- the first generic collection utility-node copy and wiring expectations

### Does not own

- the final full utility-node family backlog
- legacy plural retirement

### Current strongest read

- `Split Array` should be the first proving node because it is conceptually simple but architecturally demanding
- if this phase works without family branching, the collection contract is probably honest enough for later merge/filter/take/sample nodes too

### Implementation direction

- `Split Array` should accept one collection input
- `Split Array` should publish two collection outputs of the same member type as the input
- the node should not need explicit type branches for `SketchProfiles` and `SolidBodies`
- later collection utility nodes may follow once this first proof is stable

## [ ] ObjectTypes-8 - Legacy Plural Kind Retirement

### Purpose

- remove the now-obsolete plural special cases after the shared collection contract and first proving families are stable

### Owns

- retirement of temporary migration shims
- cleanup of old plural-kind aliases and bespoke family compatibility exceptions
- final lock on the shared collection architecture as the repo-native source of truth

### Does not own

- new feature work
- unrelated node cleanup

### Current strongest read

- this should be the last phase, not the first
- the repo should prove the new seam through real family migrations and at least one utility node before it deletes the old safety bridges

### Implementation direction

- remove temporary compatibility adapters
- remove obsolete plural special cases
- keep user-facing labels where they are still good row language, but anchor them to the shared collection contract only
