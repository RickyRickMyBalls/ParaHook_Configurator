# B-rep Vision

## Doc Header

### Doc History
6. 2026-05-19 00:44:39: Added the imported-STEP triangle-wireframe correction rule after the live screenshot showed a tessellated `.step` import covered in mesh edges, clarifying that Three may still receive face triangles internally but visible STEP lines must come from ParaHook's B-rep-derived edge, surface, point, and body display contract rather than raw triangle wireframe.
5. 2026-04-16: Updated the relationship pointer to the master `Import-Vision.md` again so this retained imported-geometry direction now reads as the later `Generation 2` companion lane after the family collapsed `Import-1` through `Import-4` into one broader `Generation 0`
4. 2026-04-16: Added a relationship pointer to the new `Import-Vision.md` master doc so this retained imported-geometry direction now reads as the later `Generation 4` companion lane after the earlier direct-row, staged-session, and STEP-fidelity import generations
3. 2026-04-16: Added an explicit `Generation 0` read so the B-rep vision now records that the current live work is still enriching the meshing side of STEP or B-rep handling inside the staged inspector, with the active grounding doc remaining `Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md` before later retained-shape `Generation 1` work begins
2. 2026-04-16: Reorganized the B-rep vision into explicit generations so wishlist items can be retained and sorted into `Generation 1`, `Generation 2`, and later widening lanes before any later execution docs break those grouped wishlist items into concrete phases
1. 2026-04-16: Created this dedicated B-rep vision doc to capture what "proper B-rep support" should mean for imported `.step` files in ParaHook, grounding the vision in the repo's current mesh-first STEP loader, the existing worker-side OpenCascade authoritative shape-set seam, and the long-range goal of showing truthful face, edge, and point data derived from retained B-rep truth instead of only flattened mesh output

### Purpose

This doc captures the long-range B-rep vision for imported geometry in ParaHook.

Use it to answer:
- what ParaHook should mean by "proper B-rep support"
- what `generation` the B-rep vision is in today
- whether the app currently shows true B-rep geometry for imported `.step` files
- how imported `.step` files should move from mesh-first loading toward retained topological truth
- how new B-rep wishlist items should be grouped before phase planning starts
- what the worker, shared contracts, Browser, and viewport should each own in that future direction
- what should stay out of scope so this lane does not quietly turn into a full CAD-kernel rewrite

Do not use it for:
- one narrow implementation checklist
- pretending today's viewport already renders kernel-native B-rep directly
- widening import work into CAD healing, export, or full feature-authoring design
- replacing the implementation-planning role of a later B-rep family index or phase docs

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping this B-rep lane aligned with the larger rule that preview meshes and clean downstream outputs should derive from one geometry truth instead of becoming separate hidden owners

- `docs/Human-Plans/Architecture/Import/Import-Vision.md`
  - master import-family north star
  - useful for keeping this later retained imported-geometry direction distinct from the broader `Generation 0` import foundation and the later `Generation 1` `.step`-fidelity generation

- `docs/Human-Plans/Architecture/Import/Import-Index.md`
  - umbrella import-family direction
  - useful for keeping B-rep support grounded in the import family instead of letting it drift into a disconnected viewer-only research thread

- `docs/Human-Plans/Architecture/Import/Future/Import_Phase Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md`
  - the later `.step`-specific import-fidelity lane
  - useful for the current research read around STEP loader truth, units honesty, and the explicit distinction between mesh display today and the B-rep-capable future direction

## Doc Body

### Why This Doc Exists

The repo already has two geometry truths that are easy to blur together if they are not named clearly:

- imported `.step` files already load and render in the viewport
- authored graph geometry already has an OpenCascade-backed authoritative worker seam

But those two truths are not yet the same thing as proper B-rep support.

Today the app can honestly say:
- it can import `.step`
- it can render tessellated geometry derived from `.step`
- it already has a retained worker-side shape-set concept for some authored geometry

Today the app cannot yet honestly say:
- imported `.step` references are retained as first-class B-rep truth inside ParaHook
- the viewport is showing true face, edge, and point ownership from that retained truth
- Browser or selection can identify topological entities directly instead of inferring structure from leaf meshes and labels

This doc exists so the future B-rep lane stays honest about that gap.

### Short Version

The B-rep vision should be described as evolving through explicit generations.

`Generation 0` is the current mesh-enrichment and staged-inspector-read generation.

`Generation 1` is the first honest retained-STEP B-rep display generation.

`Generation 2` is the later constrained direct-modeling generation.

`Generation 3` is the later Spaghetti-editor B-rep-reference generation.

Later generations can widen further if future wishlist items truly need that, but they should not be smuggled into `Generation 0`, `Generation 1`, `Generation 2`, or `Generation 3` by accident.

When a user imports a `.step` file, ParaHook should eventually keep one retained OpenCascade shape truth for that import and derive all visible geometry from it.

That means:
- shaded faces should come from retained B-rep-owned face tessellation
- visible edges should come from retained topological edges
- visible points should come from retained topological vertices when the user asks for them
- selection and inspection should resolve back to stable face, edge, and vertex identities instead of only hitting triangles or mesh names

Important rule:
- Three can remain the renderer
- but Three should render data derived from retained B-rep truth instead of becoming the hidden owner of imported STEP geometry

Important planning rule:
- retain wishlist items in this vision doc first
- sort them into the right generation
- and only later break those generation-grouped wishlist items into concrete phases or execution docs

### Definitions

To keep this lane honest, use these terms consistently:

- `B-rep truth`
  - retained kernel-owned topology and geometry such as solids, shells, faces, loops, edges, and vertices
- `authoritative-derived display`
  - tessellated faces, edge polylines, and optional points generated from retained B-rep truth for viewport rendering
- `mesh preview`
  - generic triangle-only geometry that is useful for display but is not itself the source of topological truth
- `proper B-rep support`
  - ParaHook can retain the imported shape, derive viewport display from it, and identify real faces, edges, and vertices during interaction

### Current Honest Read

The current repo state is:

- `src/viewer/stepReferenceLoader.ts`
  - reads `.step` through `occt-import-js`
  - immediately converts the result into Three mesh objects
  - does not retain imported `TopoDS_Shape` ownership for later topology queries
- `src/viewer/referencePartDescriptors.ts`
  - derives imported `Part` rows from leaf meshes and labels
  - does not derive those rows from true STEP topology
- `src/shared/geometryResult.ts`
  - already distinguishes draft mesh result from authoritative worker result through `authoritativeHandle`
  - still treats visible viewport geometry as `meshPreview`
- `src/worker/authoritative/buildAuthoritativeGeometry.ts`
  - already boots `opencascade.js`
  - already constructs retained OC shapes for supported authored extrusions
  - already registers retained worker resources behind `shape_set` handles

So the repo already has a B-rep-capable backend direction.

The missing piece is:
- imported STEP references do not yet use that retained truth path
- the viewport contract still centers mesh display rather than topology-aware authoritative-derived display

### B-rep Generations

The B-rep vision should be described as evolving through explicit generations.

The point of the generations is not branding.

The point is to make it easy to say:
- what the current B-rep vision already covers
- which wishlist items belong in the current generation
- which wishlist items should wait for a later generation
- and what later phase planning should pull from when it is time to move from vision into execution

#### Generation 0 - STEP Mesh Enrichment And Staged-Inspector B-rep Read

`Generation 0` is the current live grounding generation.

This generation is not yet the retained-shape B-rep app.

This generation means:
- ParaHook is still mesh-first for imported `.step`
- the current work is enriching the meshing side of the B-rep or STEP path
- that enrichment currently lives mainly inside the staged import and inspector direction
- the active grounding doc is:
  - `docs/Human-Plans/Architecture/Import/Future/Import_Phase Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md`

What `Generation 0` does well:
- improves the staged inspector's STEP read
- improves mesh-derived structure, metadata, and loader honesty
- keeps the app honest about the current mesh-first import path
- creates a better base for later retained-shape B-rep work

What `Generation 0` does not yet do:
- retain imported STEP as first-class OpenCascade shape truth
- expose true selectable faces, edges, and points as retained topology entities
- give the viewport one authoritative-derived B-rep display contract
- let Spaghetti consume imported B-rep as real CAD input

Important rule:
- `Generation 0` should stay honest that this is still the meshing and staged-inspector side of the STEP lane
- it is a useful prerequisite, but it is not yet the retained B-rep generation

#### Generation 1 - Retained STEP Truth, Display, Selection, And Highlight

`Generation 1` is the first honest B-rep baseline.

Everything in this doc should be read as `Generation 1` unless a later section explicitly says `Generation 2`.

`Generation 1` means:
- imported `.step` files stop being only mesh-owned viewer objects
- imported `.step` files gain retained OpenCascade-backed shape truth
- the viewport can derive shaded faces, visible edges, and optional points from that retained truth
- the user can click a visible face, edge, or point and see that exact entity highlight
- selection and inspection can resolve real topology identity instead of only object or triangle identity
- Browser stays focused on object or part structure while topology detail lives in dedicated inspection surfaces

What `Generation 1` does well:
- gives ParaHook one honest retained B-rep owner for imported STEP
- gives the viewport one truthful face, edge, and point display direction
- gives the user direct entity selection and highlight
- keeps topology identity explicit enough for later inspector work

What `Generation 1` does not yet do:
- allow direct editing of selected faces, edges, or points
- promise that any selected subentity can be moved
- widen into healing-heavy arbitrary imported-solid editing
- promise higher-order exact-surface editing everywhere on day one

Important rule:
- `Generation 1` should stay focused on retained truth, display, selection, and highlight
- it should not be treated as incomplete just because later direct-modeling wishlist items belong in `Generation 2`

#### 1. Imported STEP Should Become Retained Geometry Truth

Imported `.step` files should no longer stop at "parsed into meshes."

The intended future is:
- the STEP import path reads the file into OpenCascade
- ParaHook retains the imported shape behind a worker-owned handle
- all later structure, selection, and viewport display for that import can query that retained shape truth

Important rule:
- one imported STEP file should have one explicit retained geometry owner
- downstream mesh packets, edge overlays, labels, and inspector reads should all derive from that owner

#### 2. The Viewport Should Show B-rep-Derived Faces, Edges, And Points

Proper support does not require kernel-native viewport drawing with no tessellation.

Three will still ultimately draw viewport data as meshes, lines, points, and materials.

That is fine.

The important correction is that imported STEP display should not expose raw tessellation wireframe as if every triangle boundary were a meaningful CAD edge.

For imported `.step` files, the acceptable first-pass visual model is:
- shaded surfaces are rendered from face tessellation
- visible linework comes from B-rep-derived or STEP-derived semantic edges
- point markers come from real topological vertices when point display is enabled
- body selection highlights the whole imported body or part without turning every triangle boundary into selectable structure

This matches the newer ParaHook edge, surface, point, and body highlight system:
- surfaces should behave like surfaces, even if their fill is made from triangles internally
- edges should be the real outline, trim, seam, or topology edges ParaHook can honestly derive
- points should be real vertices or explicitly derived topology points
- body highlighting should remain separate from sub-entity highlighting

Important rule:
- the viewer may use "fake B-rep" render packets for Three
- but those packets must describe CAD-facing surfaces, edges, points, and bodies
- they must not simply forward generic mesh wireframe as the B-rep display layer

Proper first-pass support does require:
- shaded face triangles derived from real B-rep faces
- explicit edge overlays derived from real topological edges
- optional point overlays derived from real topological vertices
- stable IDs so hover, selection, and debug surfaces can name the selected entity truthfully
- direct interaction so any visible face, edge, or point can be clicked and highlighted as its own entity

That means the viewport should be able to present:
- faces only
- faces plus edges
- edges only
- points, when useful for debugging or precision inspection

Important rule:
- the user-visible entity should be a face, edge, or point
- not only "triangle 1482 inside unnamed mesh 4"

#### 3. Browser And Inspector Should Stay Disciplined

The Browser should not explode every imported STEP into thousands of rows by default.

The recommended default content model is:
- Browser keeps the object, assembly, component, and part-level ownership surfaces
- topology entities stay behind a selected-object inspection surface, debug panel, or explicit B-rep explorer

Reason:
- project structure and topological detail are different concerns
- dumping every face and edge into the main Browser would make large STEP imports noisy and hard to use

Good future behavior:
- Browser still shows truthful object or part structure from the imported file
- a separate inspector can reveal:
  - face count
  - edge count
  - vertex count
  - selected entity type and id
  - source labels or topology metadata when available

#### 4. Selection Should Resolve To Real Topology

When the user clicks imported STEP geometry, ParaHook should be able to answer:
- which face was hit
- which edge was hit
- which vertex was hit
- and immediately highlight that selected face, edge, or vertex in the viewport

That requires:
- stable topology ids
- a render packet that keeps draw data mapped back to those ids
- a selection contract that can carry topological identity, not only object identity
- a highlight presentation path that can visually distinguish the selected point, edge, or face without losing the surrounding object context

This is one of the clearest dividing lines between:
- mesh display only
- proper B-rep support

#### 5. STEP Import Should Reuse The Existing Authoritative Direction

The cleanest architecture is not:
- one mesh-first import world for references
- one separate authoritative OC world for authored geometry forever

The cleanest architecture is:
- imported STEP references and authored authoritative geometry both use retained OpenCascade ownership
- both can derive viewport display through one authoritative-derived render bridge
- both can release retained resources through one lifecycle policy

This does not mean the first pass must unify every type immediately.

It does mean the direction should avoid doubling down on mesh-only STEP ownership if the repo already has the right retained-shape seam elsewhere.

#### Generation 1 Wishlist

The `Generation 1` wishlist should stay focused on the foundation required for a professional CAD-facing B-rep app before direct modeling or Spaghetti authoring widen the scope.

Good `Generation 1` wishlist items:
- retain imported `.step` shapes in the worker as real OpenCascade-backed geometry truth
- derive viewport face shading, edge overlays, and optional point overlays from that retained truth
- suppress raw tessellation wireframe for normal imported STEP display and show only topology-derived linework through the semantic edge overlay system
- let the user click any visible face, edge, or point and see that exact entity highlight
- surface truthful imported assembly, object, and part structure from STEP instead of relying only on mesh names
- add a dedicated B-rep inspector for the currently selected entity
- expose basic entity semantics when they are known honestly
- expose units, tolerance, and validity state honestly for the imported shape
- support display-quality or retessellation controls without losing the retained shape truth
- support measurement and snapping against real B-rep entities
- harden retained-resource lifetime, caching, and disposal so large STEP files can be loaded once and inspected repeatedly without hidden duplicate ownership

Helpful `Generation 1` inspector reads:
- selected entity type:
  - face
  - edge
  - point or vertex
- face class when known:
  - plane
  - cylinder
  - cone
  - sphere
  - spline or other freeform surface
- edge class when known:
  - line
  - arc
  - circle
  - spline
- basic properties when known honestly:
  - face area
  - edge length
  - radius
  - diameter
  - normal direction

Important rule:
- `Generation 1` should make ParaHook feel like a truthful B-rep-aware CAD viewer and inspector
- it should not yet promise topology-changing edits just to feel more advanced on paper

#### Generation 2 - Constrained Direct Modeling On Selected Topology

Once `Generation 1` is healthy, a later `Generation 2` lane can widen from:
- topology-aware display
- topology-aware selection
- topology-aware highlight

into:
- topology-aware direct editing of selected faces, edges, or points

The intended `Generation 2` read is:
- a user may select one face, edge, or point from an imported retained B-rep shape
- ParaHook may offer a direct transform or edit affordance for that selected entity
- the edit should only commit when the retained shape can still be rebuilt into a valid watertight result within reasonable tolerance

Important rule:
- this should be treated as constrained direct modeling
- not as arbitrary triangle dragging
- and not as a promise that every selected subentity can always be moved successfully

Recommended `Generation 2` safety boundary:
- face edits are the best first target
- edge edits should stay narrower and more validity-sensitive
- point or vertex edits should stay the most restricted and may be rejected often
- failed or invalid rebuilds should be rejected honestly instead of forcing a broken non-watertight result through the viewport

Reason:
- `Generation 1` should prove retained shape ownership, topology identity, selection, and highlight cleanly
- subentity transforms are a real later modeling feature and should land only after the topology and validation seams are strong enough to keep results honest

#### Generation 3 - Spaghetti Editor B-rep Reference And CAD Operations

Once `Generation 1` and `Generation 2` are healthy enough, a later `Generation 3` lane can bring retained imported B-rep into the Spaghetti editor as real referenced geometry instead of leaving imported STEP as only a viewer-side reference.

The intended `Generation 3` read is:
- the user can import a retained STEP body into ParaHook
- the Spaghetti editor can reference that retained geometry as real CAD input
- graph operations can target geometry from that imported body through explicit topology-aware references
- later CAD nodes can perform operations such as:
  - add hole
  - extrude face
  - fillet
  - chamfer
  - other later direct-modeling or feature-style operations

Important rule:
- Spaghetti should not operate on disconnected display meshes
- it should operate on retained B-rep references, explicit selected topology, and validated CAD operations

Healthy `Generation 3` direction:
- let the user select a face, edge, or other supported entity on imported retained geometry
- let the app persist that selection as a graph-usable reference
- let later Spaghetti nodes consume that reference as input for CAD operations
- let the resulting geometry stay inside the same authoritative retained-geometry direction instead of dropping back to mesh-only ownership

Reason:
- this is the point where imported B-rep stops being only a thing the user can look at
- and becomes geometry the user can actually build on in the ParaHook authoring model

#### Later Generation Direction

If future wishlist items widen beyond `Generation 2`, they should earn a later generation only when they clearly exceed the direct-modeling lane.

Examples that might justify later generations:
- stronger healing or rebuild assistance
- richer topology inspector workflows
- more advanced exact-surface or surface-class-aware editing
- later imported-B-rep feature-recognition or conversion flows

Important rule:
- do not invent a later generation just to avoid making decisions
- but also do not overload `Generation 1` or `Generation 2` with wishlist items that clearly belong later

### What Proper Support Means

ParaHook can claim proper B-rep support for imported `.step` only when all of these are true:

- the imported STEP file is retained as backend shape truth, not only flattened into meshes
- the viewport can display real face-derived shading plus optional edge and point overlays from that truth
- hover and selection can resolve stable face, edge, or vertex identity
- the app can inspect imported topology without re-reading the whole file into a second disconnected pipeline
- retained display data and retained shape lifetimes stay aligned and disposable

Until then, the app should describe the current behavior more narrowly:
- browser-side STEP import
- tessellated STEP display
- partial B-rep-capable backend direction for authored geometry

### Recommended Architecture Direction

The minimum honest architecture for this lane is:

- one worker-side STEP import service using retained OpenCascade ownership
- one imported-shape handle type or a widened authoritative handle contract
- one topology extraction seam that can enumerate:
  - faces
  - edges
  - vertices
- one viewer-facing render packet that carries:
  - face triangles
  - edge polylines
  - optional point positions
  - stable ids back to topology truth
- one inspector or selection contract that can talk about topological entities directly

Important rule:
- do not make the mesh packet the long-term truth
- make it a derived render product of the retained shape truth

### User-Facing Target

When this lane is healthy, a user importing a `.step` file should be able to:

- see the imported object shaded normally in the viewport
- toggle visible topology edges
- optionally inspect or debug visible vertices
- click any visible face and see that exact face highlight as a real face
- click any visible edge and see that exact edge highlight as a real edge
- click any visible point and see that exact point highlight as a real vertex
- inspect counts and labels without the system inventing fake structure from mesh names alone

### Non-Goals

This B-rep vision should not quietly expand into:

- full CAD healing
- feature recognition from arbitrary imported solids
- direct editing of arbitrary imported B-rep in the first pass
- replacing Three.js
- a promise that every import type gets the same retained-kernel treatment immediately
- dumping every topology entity into the main Browser tree by default
- claiming exact analytic-surface interaction everywhere on day one

### Future Planning Direction

If later execution docs are opened under this `B-rep` folder, the clean first ladder is likely:

1. current import and authoritative-shape seam audit
2. worker-side retained STEP import proof of concept
3. topology extraction contract for faces, edges, and vertices
4. authoritative-derived viewport render packet
5. topology-aware selection and inspector surface
6. Browser and import-flow integration cleanup

Reason:
- the owner seam should be locked before UI promises widen
- topology ids should exist before selection and inspector work
- viewport display should stop treating mesh packets as the whole truth before Browser or console language starts promising real B-rep entities

Important planning rule:
- keep adding wishlist items to this vision first
- sort them into `Generation 1`, `Generation 2`, or a later generation section
- then let the later B-rep family index or future phase docs decide the concrete execution order inside that generation

### Summary

The B-rep vision for ParaHook is:

- ParaHook should treat B-rep growth as explicit generations instead of one blurry wishlist
- imported `.step` should eventually become retained OpenCascade shape truth, not only mesh output
- `Generation 1` should deliver authoritative-derived faces, edges, and optional points from that truth plus real topology selection and highlight
- `Generation 2` may later allow constrained face, edge, or point transforms only when ParaHook can keep the rebuilt result valid and watertight enough to stay honest
- `Generation 3` may later let the Spaghetti editor reference retained imported B-rep and perform real CAD operations against that geometry
- Browser should stay focused on project structure while topology detail lives in dedicated inspection surfaces
- Three should remain the renderer, but not the hidden owner of imported CAD truth
- wishlist items should stay retained in this vision doc and grouped by generation before later phase docs break them into implementation-sized work

That is the smallest honest target where ParaHook can say it supports true B-rep-derived display for imported `.step` geometry.
