# Object Types Vision

## Doc Header

### Purpose

This file is the long-range idea surface for `SWR` object-type directions that are useful to lock conceptually before they split into dedicated execution phases.

Use it to:
- capture cross-object-type architecture that should not live inside one family such as `SolidBodies`
- align future `SketchProfiles`, `SolidBodies`, and later collection-shaped object types around one shared contract
- record the direction for generic collection handling before narrow nodes such as `Split Array` turn that need into another one-off seam

### How To Use This File

- add one `## Idea` section per distinct future object-type direction
- keep each idea narrow enough that it can later split into one dedicated future phase doc
- prefer graph-contract, runtime-shape, and node-surface language over vague product language
- move an idea out into a dedicated family or phase doc once the implementation seam and proving case are concrete enough

## Doc Body

### Execution

Suggested first-pass phase order:

1. `ObjectTypes-1` - `Idea 1`
   - lock one generic collection object-type contract before more plural one-off kinds appear
   - this is the architectural base needed for `Split Array`, later merge/filter nodes, and future collection-aware node surfaces
2. `SketchProfiles-1` - `Idea 2`
   - migrate `SketchProfiles` onto the shared collection contract as the first proving output family
   - this is the safest first runtime proving case because sketch already behaves collection-like in the UI and downstream consumers
3. `SolidBodies-2` - `Idea 3`
   - migrate `SolidBodies` onto the same shared collection contract after the generic seam exists
   - this keeps body collections aligned with sketch collections instead of preserving a second incompatible aggregate shape
4. `Utility-Collections-1` - `Idea 4`
   - add `Split Array` only after the graph can honestly say it accepts one generic collection input and returns two generic collection outputs
   - this keeps `Split Array` from becoming the next special-case node that bakes in `SketchProfiles` and `SolidBodies` by name

Why this order:
- the real missing seam is the shared collection contract, not the split behavior itself
- `SketchProfiles` and `SolidBodies` should become proving families for that contract rather than permanent exceptions to it
- once the type, value, and validator seams are generic, collection utility nodes become smaller and calmer to implement

## Idea 1 - Collection Object Types As First-Class SWRs

### Summary

`SketchProfiles` and `SolidBodies` should stop behaving like two unrelated plural special cases.

Instead, the graph should gain one first-class collection object-type contract:
- one collection parent type
- one singular member type
- one shared runtime value shape
- one shared validator rule set
- one shared expandable row language

That means:
- `SketchProfile` stays the singular object type
- `SolidBody` stays the singular object type
- `SketchProfiles` becomes a collection of `SketchProfile`
- `SolidBodies` becomes a collection of `SolidBody`

This should become the shared foundation for later collection-shaped object types such as:
- `Stations`
- `Faces`
- `Edges`
- `Vertices`
- later curve, section, or path collections

### Why

- the current graph contract still treats plural object types as bespoke port kinds instead of one reusable collection concept
- `SketchProfiles` and `SolidBodies` do not currently share one honest runtime shape
- connection compatibility still depends on family-local exceptions instead of generic collection rules
- collection UI behavior exists directionally in the node surface, but not yet as one type-owned architecture seam
- a real `Split Array` node should consume one collection contract, not hard-code support for every plural family one at a time

### Questions

- should the graph add one generic collection port type instead of continuing to add plural one-off kinds?
- should collection runtime values use one shared wrapper shape instead of family-specific aggregate payloads?
- should `T -> Collection<T>` be a first-class validator rule?
- should collection rows and member rows be type-owned field-tree behavior rather than family-local rendering tricks?

### Suggested Answers

- yes, add one generic collection port type
- yes, use one shared collection value wrapper
- yes, allow singular member values to contribute into compatible collection inputs
- yes, make collection parent-versus-child row meaning a shared type-owned behavior

### Spec

Locked top-level direction:
- singular object types remain the source-of-truth semantic types
- collection object types are formed from those singular object types instead of becoming unrelated plural siblings
- the graph should be able to say:
  - `collection<SketchProfile>`
  - `collection<SolidBody>`
- row labels such as `SketchProfiles` and `SolidBodies` should remain family-friendly surface language, but their underlying graph contract should be the same collection type shape

Suggested type direction:
- keep singular kinds such as:
  - `sketchProfile`
  - `solidBody`
- add one generic collection type shape that can point at its singular member kind
- stop widening the flat port-kind enum by adding new plural special cases whenever one family needs an array-like output

Suggested runtime value direction:
- use one shared collection wrapper shape such as:

```ts
type CollectionValue<T> = {
  items: T[]
}
```

- `SketchProfiles` should resolve through that shared collection wrapper
- `SolidBodies` should resolve through that shared collection wrapper
- the wrapper should stay light and graph-friendly while still leaving room for later metadata if needed

Suggested connection rule direction:
- allow `T -> T`
- allow `Collection<T> -> Collection<T>`
- allow `T -> Collection<T>`
- reject `Collection<T> -> T` unless one later node explicitly opts into a narrowing rule
- reject `Collection<A> -> Collection<B>` when `A` and `B` do not match

Suggested UI direction:
- parent collection rows should mean the whole collection
- child member rows should mean one real member each
- collection expansion should come from the shared field-tree/type seam rather than from family-local row hacks
- collection utilities such as `Split Array`, later `Merge`, later `Filter`, and later `Take First` should all inherit the same parent/member language

### Scope Notes

This idea owns:
- the graph-native collection type direction
- the shared runtime collection wrapper direction
- the shared validator and compatibility direction
- the shared parent-versus-child collection row meaning

This idea does not yet own:
- the exact migration phase sequencing for every family
- topology-specific child collection behavior under `SolidBody`
- viewport picking UX
- later query-node behavior

### Follow-On Potential

If this idea survives first review, it should later split into a dedicated future phase focused on:
- collection port type introduction
- collection runtime wrapper introduction
- validator and evaluator widening
- first proving-family migrations

## Idea 2 - `SketchProfiles` As `Collection<SketchProfile>`

### Summary

`SketchProfiles` should stop being treated as a bespoke plural port kind and become the first proving family for the shared collection contract.

The key direction is:
- `SketchProfile` remains the singular object type
- `SketchProfiles` becomes the label and row-language for `Collection<SketchProfile>`

### Why

- sketch already behaves like the clearest collection proving case in the node surface
- extrude already consumes sketch profiles using collection-like semantics
- migrating sketch first gives later collection utilities a stable upstream family to prove against

### Spec

- the sketch node should keep one parent row labeled `SketchProfiles`
- that parent row should publish one generic collection value of `SketchProfile`
- singular child member rows should still publish one `SketchProfile` each
- downstream nodes should be able to consume either:
  - one `SketchProfile`
  - one `SketchProfiles` collection
  - mixed singular contributors into one collection input where allowed by node contract

### Follow-On Potential

This should later become a dedicated `SketchProfiles` object-type phase doc once the shared collection contract is ready.

## Idea 3 - `SolidBodies` As `Collection<SolidBody>`

### Summary

`SolidBodies` should become the second proving family for the same shared collection contract.

The key direction is:
- `SolidBody` remains the singular object type
- `SolidBodies` becomes the label and row-language for `Collection<SolidBody>`

### Why

- current `SolidBodies` behavior still carries a family-specific aggregate payload shape
- leaving that shape special forever would force every collection utility and every later body-collection node into extra exceptions
- the output side of `Geometry/Extrude` is the strongest proving case after sketch because it already publishes either one body or many bodies depending on mode

### Spec

- the extrude/output seams should keep the friendly row label `SolidBodies`
- the underlying graph/runtime contract should become the same shared collection wrapper used by `SketchProfiles`
- later `SolidBody` child collections such as `Faces` and `Edges` should inherit the same collection architecture instead of inventing a second nested-collection language

### Follow-On Potential

This should later become a dedicated `SolidBodies` follow-on phase after the generic collection seam exists.

## Idea 4 - `Split Array` As The First Generic Collection Utility

### Summary

`Split Array` should not be introduced as a node that knows about `SketchProfiles` and `SolidBodies` by name.

Instead, it should be the first narrow proof that the shared collection contract is real.

That means:
- one collection input
- one split mode input such as `Ordered` or `Random`
- one percentage input
- two collection outputs of the same member type as the input

### Why

- if `Split Array` lands before the generic collection seam, it will almost certainly become another hand-written compatibility exception
- if it lands after the seam, it proves the architecture is actually reusable

### Spec

- `Split Array` should accept `Collection<T>`
- `Output 1` should publish `Collection<T>`
- `Output 2` should publish `Collection<T>`
- ordered mode should preserve input order inside both outputs
- random mode should still preserve member order within each chosen partition after selection
- the node should not need separate type branches for:
  - `SketchProfiles`
  - `SolidBodies`
  - later collection families

### Follow-On Potential

If the collection seam is locked first, this idea should later split into a small utility-node phase that proves generic collection consumption and publication end to end.
