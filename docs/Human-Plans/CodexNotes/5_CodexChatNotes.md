# 5 Codex Chat

## Doc Header

### Doc History - Planning Log 2.


### Doc Notes

- `Doc History` tracks changes to this file itself.
- Session-level planning logs should live in the session compile sections below, not in the header.
- The old header-level `Planning-Batch` log has been compiled into `Session 1 - planning bath 1 compilelog`.

## Doc Body


##### [34] 2026-03-08 15:56 - Browser Clarification - The Project File Should Own A Recursive Assembly Tree

High-confidence clarification:

- The `Project File` should contain the user’s real app content at that time.
- External reference assets such as shoe / footpad can stay outside that main project-content tree if needed.

Working Browser structure:

- `Project File`
  - owns an `Assembly List`
- `Assembly`
  - can contain:
    - `objects`
    - and later other `assemblies`
- `Object`
  - contains `parts`
- `Part`
  - lowest production piece in this model

Important refinement:

- the Browser should probably not stop at one flat assembly list forever
- it should allow assemblies to nest inside assemblies when the user needs deeper organization

Working rule:

- `Project File -> Assembly tree -> Objects -> Parts`

Current recommendation:

- treat the Browser as a recursive project-content tree rather than only a flat graph list
- do not force the deepest nested assembly behavior too early in implementation
- first stabilize:
  - project
  - assembly
  - object
  - part
- then allow richer assembly-within-assembly organization once the base tree is stable

##### [35] 2026-03-08 16:02 - Later Structure Note - `Sub-Parts` Should Likely Be A Derived Split Layer Under Parts



## Session 1 Notes

### 2026-03-08 09:28 - AGENTS.md Notes

Key reusable rules from `AGENTS.md`:

- For any implementation change, update the project-tracking docs in the same change set unless the user explicitly says not to.
- The canonical tracking files are `docs/CHANGELOG.md` and, when chill mode is active, `docs/Chill-Log.md`.
- The canonical docs-structure references are `docs/Doc-Index.md` and `docs/Phase-Plans/00_Phase-Setup.md`.
- New permanent changelog work should be appended to `docs/CHANGELOG.md` without deleting or rewriting earlier entries.
- Historian mode is only for explicit history-processing requests and should preserve raw transcript material while adding a structured readable summary near the top of the target history file.
- `docs/Archive/CodexContext/History-Chats/N_CodexChat.md` is the running conversation-facing notes surface for reusable decisions, architecture clarifications, prefix/phase rule changes, and workflow decisions.
- `docs/Archive/CodexContext/N_CodexContext.md` is the later distilled handoff summary, not the running chat capture.
- Major reusable project knowledge should be recorded during the session rather than deferred until the end.

Current implication for this repo:

- When doing real code or docs work, treat `AGENTS.md` as a maintenance contract, not just optional guidance.
- When phase/prefix questions come up, verify against `docs/Phase-Plans/00_Phase-Setup.md` before inventing a new naming path.
- When a session produces durable project understanding, capture it here so later roadmap and planning work can reuse it.

### 2026-03-08 09:46 - Wishlist / Vision Notes - Feature Stack As Node

Captured product-direction notes from the session:

- The current `Feature Stack` direction may be conceptually off.
- The intended direction is that a `Feature Stack` should itself be a node so it can live:
  - inside a part node
  - on the canvas by itself
  - potentially inside other nodes
- The intended meaning is closer to:
  - a boxed math / param-processing unit
  - that holds and consumes params
  - and produces creations / outputs

Working vision for the Spaghetti editor:

- Almost every box on the canvas is a `node`.
- Primitive nodes such as `num` and `bool` are the base building blocks.
- More complex nodes such as `vec2`, `vec3`, and possibly `vec2[]` should be built from simpler node/value structures.
- A `part node` is a composed container-like node that visibly owns multiple internal sections rather than acting like one flat atomic box.

Current intended part-node section model:

1. `Header`
2. hidden toolbar
3. `Drivers`
4. `Inputs`
5. `Feature Stack`
6. `Outputs`

Clarified section intent:

- `Inputs`
  - pinned nodes representing information that will need to be wired into the feature stack path
- `Drivers`
  - a dock area for param nodes
  - these start as primitive param-style nodes, with room for more custom forms later
  - users can lock param nodes into the part node
  - prebuilt parts like `baseplate` may ship with drivers already present and locked
  - if a driver is unlocked, the user should be able to rearrange it
  - if the user drags it out into the canvas, the param node should pop out and become a normal free canvas node
- `Feature Stack`
  - should be represented by a feature-stack node
  - should be draggable into and out of a part node
  - may eventually allow multiple feature-stack nodes inside a single part node
- `Outputs`
  - pinned creations produced by the feature stack path

Wire-visibility vision:

- The goal is to show the wiring path rather than hiding it behind the part node abstraction.
- A driver node should have a right-side output pin.
- That wire should route around the back / outer path of the part node into a left-side input on the part node.
- The input then behaves like a pass-through pinned node.
- Another wire can leave the right side of that input and continue into the left side of the target feature-stack param/input.
- This makes the full value path visible:
  - driver
  - part input
  - feature stack consumer
- Feature-stack nodes, except perhaps special cases like `sketch`, should generally expose output pins so values they use or create can be reused elsewhere.

Interpretation / wording adjustment:

- The idea makes sense.
- The current wording may be mixing:
  - `feature`
  - `feature stack`
  - `node`
  - `param node`
  - `input pin`
  - `output creation`
- A clearer framing may be:
  - primitive nodes = base typed values or small typed operators
  - param nodes = reusable editable value nodes that can dock into part drivers
  - part node = a composite host node with visible sections
  - feature-stack node = a composite processing node that can live standalone or inside a part node
  - pinned input/output rows = attachment surfaces owned by a composite node, not always full standalone nodes

Current high-confidence conclusion:

- The desired system is not a simple flat node graph.
- It is a graph with composite nodes, dockable subnodes, and visible pass-through wiring.
- The current architecture may therefore be too biased toward `feature stack as embedded data on a part node` and may need to move toward `feature stack as first-class graph object / composite node`.

### 2026-03-08 09:50 - Image Clarification - Visible Outer Wire Loop Around A Composite Part Node

Interpretation of the user's mockup image:

- The mockup clarifies that the desired final visual is not just "a part node with hidden internal logic."
- The desired final visual is a composite part node whose internal sections are visible while key wiring paths remain externally legible.

What the mockup shows clearly:

- A right-side output pin from a node/section inside or associated with the part.
- A wire that loops outward around the body of the part node.
- That wire returns to the left side and plugs back into an input area.
- The visual language intentionally makes the value path visible instead of collapsing the entire relationship into hidden internal state.

Why this matters:

- It confirms the design goal is not minimal wiring.
- It confirms the design goal is readable causality.
- The user wants to see where values originate, where they re-enter the part, and how they continue deeper into the feature-processing path.

Revised mental model from the mockup:

- A part node is acting like a visible host/container for several sub-surfaces.
- Some sub-surfaces may be internally associated with the part node while still exposing normal graph pins.
- Wires should be allowed to leave one internal section, travel visibly through canvas space, and re-enter another section of the same composite node.
- This means "inside the same part node" does not mean "hide the graph relationship."

High-confidence product conclusion from the image:

- The intended UX is closer to `composite node with explicit visible internal/external routing` than to `collapsed inspector card with a few abstract sockets`.
- The fake stacked-node mockup is useful because it demonstrates the target causality visualization even if the current implementation uses separate nodes to simulate it.

### 2026-03-08 09:53 - Current Inventory - What Looks Salvageable Vs Likely Legacy

This is a current `/src` read, not a final architectural ruling.

The goal of this list is:

- identify what already matches the likely long-term direction
- identify what looks like a transitional seam
- identify what should probably be retired later rather than expanded further

#### Salvageable / Strong Reuse Candidates

- [ ] Core graph model
  - `SpaghettiNode`, `SpaghettiEdge`, and `SpaghettiGraph` are still the right basic ownership units.
  - Node ids, port ids, and edge endpoints are worth keeping.

- [ ] Node registry + typed port contracts
  - The registry pattern is good.
  - Typed `inputs` / `outputs` on node definitions are good.
  - `compute()` per node is a strong foundation even if some node families change.

- [ ] Primitive / param node direction
  - `Param/Number`, `Param/Boolean`, and `Param/Vec2` are close to the desired direction.
  - Primitive typed-value nodes are still useful for the future model.

- [ ] Part nodes as composite-host candidates
  - Current `Part/*` nodes already act like the seed of composite nodes.
  - The visible sections idea can evolve from what part nodes already are instead of starting from zero.

- [ ] Driver VM / row-building machinery
  - The current driver/input/output row VM work is very reusable.
  - Even if the architecture changes, the idea of generating visible rows and pinned surfaces per composite node is still correct.

- [ ] OutputPreview as a system-level concept
  - The exact implementation may change, but the idea of a graph-owned preview routing node is still good.
  - Slot-based preview identity also looks worth keeping.

- [ ] Feature definitions themselves
  - `sketch`, `closeProfile`, and `extrude` as feature concepts are reusable.
  - Their internal data models are not wasted even if the host object changes.

- [ ] Compiler pipeline shape
  - `graph -> evaluate -> compile -> build inputs -> worker` still looks right.
  - The split between app/compiler and worker/runtime is still strong.

- [ ] Viewer / dispatcher / worker separation
  - The app-to-dispatcher-to-worker boundary still looks correct.
  - The viewer remaining separate from product truth still looks correct.

#### Salvageable But Likely Needs Refactor

- [ ] `partSlots`
  - The idea is useful because it acknowledges part-node internal sections.
  - The current `true/true/true/true` shape is too thin and probably only a placeholder contract.

- [ ] Drivers as currently defined in `inputDrivers`
  - The concept is good.
  - The current representation is probably too tied to today's part-node-only implementation.

- [ ] Pinned input/output rows
  - The concept is correct.
  - The implementation likely needs to become more general so composite nodes other than parts can own them.

- [ ] Feature stack storage on part-node params
  - The feature data itself is reusable.
  - Storing it only as embedded `node.params.featureStack` is the part most likely to be reworked.

- [ ] `featureParam` special cases
  - Useful as proof that features need exposed parameters.
  - Probably too narrow and too special-case-heavy for the future model.

- [ ] Current part-node row ordering metadata
  - Worth keeping as a UI-ordering concept.
  - Probably needs to be generalized once more composite nodes exist.

#### Likely Legacy / Transitional Seams To Retire Later

- [ ] `feature stack as embedded data only`
  - This looks like the biggest mismatch with the newer vision.
  - It is likely a transitional representation that should eventually move toward first-class graph/composite ownership.

- [ ] "Legacy wire" compatibility behavior
  - The presence of explicit legacy input aliases and read-only legacy wire rows suggests an adapter seam, not a target design.
  - Useful for migration, not likely worth deepening.

- [ ] Part-only bias in composite behavior
  - Right now the advanced row/driver/pinned-surface behavior mostly exists only for `Part/*`.
  - If the future model has reusable composite nodes, this part-only assumption likely becomes legacy.

- [ ] Reserved output rows like pending mesh placeholders
  - Useful for current UI scaffolding.
  - Likely not the final abstraction for user-facing creation/output modeling.

- [ ] Some current special-case feature exposure paths
  - Example: first-extrude-depth driver hooks.
  - These feel like narrow bridge logic rather than the long-term general rule system.

- [ ] Current stub/product-specific output types
  - Some current output meanings look tightly coupled to today's placeholder runtime/product path.
  - The contract split may survive, but specific stopgap payload/output shapes may not.

#### High-Confidence Read

- The project is not structurally wrong.
- The current codebase contains a lot that is reusable.
- The main thing that looks architecturally off is not the graph itself, but where composite ownership currently lives.
- The strongest likely retirement target is:
  - `feature stack as only embedded part-node params plus part-only special-case UI plumbing`

#### Practical Direction

- Keep the graph, registry, ports, compiler split, worker split, viewer split, primitive nodes, param nodes, and most of the row/view-model machinery.
- Refactor part-node-only composite behavior into a more general composite-node model.
- Treat current feature-stack embedding and legacy wire compatibility as migration seams, not as the final architecture to keep expanding forever.

### 2026-03-08 09:58 - Correction - Part Node Identity Versus Part Type And Preset

The user's clarification makes sense and changes the preferred interpretation of the current part-node UI.

Corrected model:

- The node itself is fundamentally a `Part`.
- `Part/Baseplate` should be thought of as the selected part type / part definition, not the deepest identity of the node.
- The `> default` control should be thought of as a preset selector for that selected part type.

Implication for the current header UI:

- The top-right `Part/Baseplate` string should likely become a dropdown.
- The `> default` string should also be a dropdown.
- These two controls are not the same thing:
  - one selects what kind of part node this is
  - one selects a saved preset/state for that part type

Clarified intended behavior:

- When the user loads a baseplate, they are loading a `Part` node configured as a baseplate.
- That configuration brings along the drivers / inputs / feature-stack / outputs appropriate for a baseplate.
- The preset dropdown then swaps among saved baseplate variants.
- Changing preset usually changes values, defaults, locked drivers, or feature-stack state.
- Changing preset usually should not completely change the overall layout category of the part node, though it may add or remove some rows if the preset truly requires it.

Why this matters for the earlier `partSlots` discussion:

- The user's concern is reasonable: the current `partSlots` interpretation was too close to "this node is a hard-coded baseplate template."
- The stronger long-term model is:
  - generic `Part` host node
  - selected part definition/type
  - selected preset/state
  - visible internal sections owned by that configured part

High-confidence architecture read after this clarification:

- `Part/Baseplate`, `Part/ToeHook`, and similar labels may be acceptable as current implementation node types.
- But the user's intended product model is more abstract:
  - a reusable part host concept
  - with swappable part definitions
  - and preset-driven initialization/state changes
- So the current registry may still be salvageable, but it may eventually need a cleaner separation between:
  - part host
  - part type definition
  - preset

### 2026-03-08 10:12 - Wires UI Doc Read - Current Model Versus Newer Vision

Read:

- `docs/Human-Plans/Wish-Features/Spaghetti-Editor/01.3 - Wires UI.md`

Current interpretation:

- The doc is still useful.
- But it lines up more with the current `/src` wire model than with the newer composite-node wire vision described in this chat.

What the doc describes well:

- a read-only render-path overlay
- pulse / highlight behavior on build or compile
- selector-driven active path derivation toward `OutputPreview`
- toolbar-controlled persistent wire emphasis
- no graph mutation

This matches the current canvas-wire model reasonably well:

- real graph edges are rendered in the wire layer
- active-path styling can be derived from selectors
- diagnostics can be combined with visual emphasis

What the doc does not really describe yet:

- composite part nodes with visible internal sections
- wires leaving a driver section, looping outward, and re-entering the same composite part node
- feature-stack-as-node
- the distinction between:
  - real graph edges
  - derived internal dependency wires / overlays

Important current `/src` read:

- The project does not appear to have two separate persisted edge stores.
- But it does effectively have two wire-like systems:
  - real graph edges in `graph.edges`
  - derived internal dependency edges used for internal visual wiring in part nodes

Likely source of the "fake wires" feeling:

- driver rows are UI rows, not standalone graph nodes
- driver rows also map to virtual input/output ports
- internal driver-to-feature relationships can be visualized as derived dependency wires rather than ordinary graph edges

High-confidence conclusion:

- `01.3 - Wires UI` is still valid as a future phase for render-path highlighting and active-wire emphasis.
- It should not be treated as the full wire-model spec for the newer architecture direction.
- The newer direction likely needs a separate follow-up doc for:
  - composite-node routing
  - visible external/internal loop wiring
  - real graph edges versus derived internal dependency overlays

### 2026-03-08 10:13 - Running Chat File Continuity

File continuity note:

- The running Codex session notes file has been renamed by the user from `4_CodexChat.md` to `5_CodexChat.md`.
- This file should now be treated as the active conversation-facing notes surface for the current working session.
- Earlier notes in this same file still apply; the rename is a continuity change, not a reset of session context.

Practical implication:

- New reusable architecture and planning notes from this session should continue to be appended here.

### 2026-03-08 10:41 - Next Vision-Tightening Decision - Canonical Part Object Model

High-confidence recommendation:

- The next decision that will make the overall vision more concrete is to define the canonical object model for a `Part`.

Why this is the pressure point:

- It controls whether `Part/Baseplate` is the true node identity or only a selected part type.
- It controls whether `> default` is a preset selector or something deeper in the node model.
- It controls whether `Feature Stack` should become a real child node or remain embedded data.
- It controls whether `Drivers` are docked nodes, owned rows, or a mixed model.
- It controls how `Inputs` and `Outputs` should be understood: real nodes, pinned rows, pass-through surfaces, or created artifacts.

Recommended framing for the next decision:

- Decide whether a `Part` is fundamentally:
  - a generic composite host node
  - with a selected `Part Type`
  - with a selected `Preset`
  - and with owned child objects / surfaces such as:
    - `Drivers`
    - `Inputs`
    - `Feature Stack`
    - `Outputs`

Specific object definitions that should be clarified next:

1. `Part Host`
2. `Part Type`
3. `Preset`
4. `Driver`
5. `Feature Stack`
6. `Creation / Output`

Likely payoff:

- This one decision will make the node taxonomy, wire model, preset model, and roadmap much easier to define without talking past the real ownership problem.

### 2026-03-08 10:50 - Recommended Definition - What The Part Node Should Be

High-confidence recommended definition:

- A `Part` should be a real node.
- More specifically, it should be a `composite host node`.
- Its job is to hold, organize, and expose other buildable objects that together define a part.

Recommended definition shape:

- `Part Node`
  - a first-class canvas node
  - movable and selectable like other nodes
  - able to contain or dock other objects
  - able to expose pinned input/output surfaces
  - able to load a premade configuration

- `Part Type`
  - not the deepest identity of the node
  - a selected recipe / part definition applied to the `Part` node
  - examples: `Baseplate`, `Cube`, later other premade parts

- `Preset`
  - a saved state/configuration for the selected part type
  - usually changes values, defaults, locked drivers, and feature-stack state
  - may sometimes add or remove rows when needed

- `Drivers`
  - docked ingredient nodes or docked param-style child objects
  - they should be able to live inside the `Part` node or be pulled back out onto the canvas

- `Inputs`
  - pinned pass-through surfaces owned by the `Part` node
  - they are where outside or internal values visibly enter the part's internal flow

- `Feature Stack`
  - should move toward a real child node or child composite object inside the part
  - not just embedded part-param data

- `Outputs`
  - pinned creation/result surfaces owned by the `Part` node
  - they expose what the part creates for other nodes or preview systems

Recommended identity rule:

- The node should fundamentally be `Part`.
- `Baseplate` should be a selected part type or premade recipe loaded into that node.
- A user-made custom part should use the same host concept as a premade baseplate.

Why this definition fits the vision:

- It preserves the idea that the canvas is made of real buildable "meatballs."
- It allows premade parts and user-built parts to use the same object model.
- It keeps the part as a visible container without hiding the causality of the wires.

### 2026-03-08 10:50 - Spaghetti & Meatball Logic Comparison

High-confidence interpretation of the metaphor:

- `Spaghetti` = wires / value paths / routing logic
- `Meatballs` = the floating windows / canvas objects / nodes
- `Ingredients` = primitive and reusable node pieces the user can combine into more complex nodes
- `Kitchen table` = the canvas itself

What this implies about the editor model:

- Almost everything meaningful should be able to exist as a real object on the canvas.
- Users should be able to build bigger meatballs from smaller ingredients.
- Primitive ingredients like `num` and `bool` can be combined into more complex ingredients like `vec2`.
- Users should be able to go further and create custom composite ingredients from simpler ones.

What this implies about the `Part`:

- The `Part` is best thought of as a shell/container ingredient, like a tortilla or taco shell.
- The user can place ingredients inside it to build a custom part.
- Premade parts like `Baseplate` are not a fundamentally different species of object.
- A premade baseplate is better understood as a prebuilt taco recipe loaded into the same `Part` shell.

Architecture implication:

- The metaphor strongly supports a graph made of first-class nodes plus composite/container nodes.
- It does not point toward a system where the most important structure is hidden as passive data inside a special-case part template.

Practical conclusion:

- The stronger long-term model is:
  - primitive nodes
  - composite nodes
  - part-host composite nodes
  - recipe/preset loading on top of those nodes
- not a split where user-built objects are one class of thing and premade parts are a completely different class of thing.

### 2026-03-08 10:59 - Node Direction Was Right, But The Object Model Drifted

High-confidence conclusion:

- The original node-based instinct was broadly correct.
- The deeper issue is not that the project chose nodes.
- The deeper issue is that the node/object model stayed underdeveloped and drifted into special-case ownership.

Recommended interpretation:

- The project was already aiming toward a graph of buildable canvas objects.
- That core direction still fits the desired editor.
- The main architectural problem is that some important things did not become first-class objects when they probably should have.

Where the drift appears to have happened:

- some important systems became embedded data instead of real objects
- some important surfaces became UI rows or virtual plumbing instead of clean graph-owned objects
- part identity became too tied to premade part-specific node types
- special-case driver and feature exposure paths appeared before the canonical object model was clearly locked

Working summary:

- `right instinct`:
  - node-based buildable object system
- `underdeveloped area`:
  - which things must be first-class objects
- `misguided area`:
  - where ownership collapsed into embedded part data and part-specific/driver-specific special cases

Practical implication:

- The project likely needs object-model tightening and ownership cleanup more than it needs a full directional reset.

### 2026-03-08 11:10 - Kitchen Glossary - Fun Names Versus Real System Meanings

High-confidence rule:

- We can use kitchen-language names in planning as long as each one has a stable concrete meaning.
- The fun name should help thinking, not replace the actual object model.

First-pass glossary:

- `Kitchen table`
  - meaning: the canvas / workspace where objects live
  - likely system meaning: `graph canvas`

- `Spaghetti`
  - meaning: the visible wires / routed value paths
  - likely system meaning: `graph edges`, plus visible routed wire paths

- `Meatball`
  - meaning: a floating canvas object the user can grab and work with
  - likely system meaning: `node`

- `Ingredient`
  - meaning: a first-class buildable thing the user can place, connect, combine, or insert into another object
  - likely system meaning: first-class `node` or child composite object

- `Primitive ingredient`
  - meaning: the simplest raw building blocks
  - likely system meaning: primitive/value nodes like `num`, `bool`, later similar typed basics

- `Recipe`
  - meaning: a defined arrangement or saved setup of ingredients
  - likely system meaning: `part type`, `preset`, or `template` depending on context
  - caution: this word may need to split later if `part type` and `preset` stay distinct

- `Starch`
  - meaning: the shell/container that can hold ingredients and turn them into a more structured final object
  - likely system meaning: `Part` host node

- `Taco`
  - meaning: a built part made by placing ingredients into a starch shell
  - likely system meaning: configured `Part` node / configured part host

- `Premade taco`
  - meaning: a ready-made version of a taco the user can drop in immediately
  - likely system meaning: premade part such as `Baseplate`, likely loaded as a `Part Type` plus `Preset`

- `Sauce`
  - meaning: optional modifier logic that changes behavior without being the whole structure
  - likely system meaning: modifier `node`, `feature` option, or future lightweight helper object
  - confidence: speculative

- `Plating`
  - meaning: how results are shown to the user
  - likely system meaning: `preview` / `output` / `viewer` presentation
  - confidence: medium

- `Pantry`
  - meaning: the place where available build pieces come from
  - likely system meaning: `node` menu, ingredient picker, or library panel
  - confidence: medium

Recommended usage rule:

- Use kitchen names freely in brainstorming and planning.
- When a decision becomes architectural, also write the concrete system meaning beside it.
- If a kitchen word starts pointing to two different concrete things, split it instead of letting it drift.

Most useful current mappings:

1. `Meatball` = node
2. `Ingredient` = first-class buildable object
3. `Starch` = `Part` host node
4. `Recipe` = `part type` or `preset`
5. `Spaghetti` = wire/value path

### 2026-03-08 11:17 - Multi-Graph Editing Decision - Graphs Should Own Their Parts


High-confidence planning direction:

- Multi-graph support looks like a major real system decision, not just a UI add-on.
- If the user can load multiple graph editors, then each graph should probably own the parts it produces.

Core idea:

- The current top-left parts list should stop being thought of as one global flat list.
- Instead, each graph should have its own embedded parts list / output list.
- Then the app can hold a list of graphs, and the user can turn whole graphs or graph-produced parts on and off.

Why this matters:

- It gives the user a way to work on multiple part definitions without collapsing everything into one editor surface.
- It creates a cleaner ownership boundary between:
  - graph logic
  - produced parts
  - visibility/toggle state
- It makes it easier to reason about "which graph made this part?"

Likely canonical direction:

- `graph` should become a first-class object in the app, not just hidden editor state
- the app should hold a `list of graphs`
- each graph should own:
  - its nodes
  - its wires
  - its produced parts / output parts
  - its local part visibility or enable state

UI implication:

- the old global parts list likely becomes:
  - a graph-local parts list inside the graph/editor surface
  - plus possibly a higher-level graph list or graph manager

Likely benefit:

- the user can load multiple graphs
- enable/disable different graph results
- organize different part systems without forcing them into one giant graph

Open planning question:

- sequencing still needs to be decided:
  - do multi-graph foundations come before broader editor expansion
  - or do they wait until after the single-graph object model is cleaner

Current read:

- this is important enough that it should stay near the top of the planning queue
- but it probably depends on locking the `Part`/object model first, or at least not contradicting it

## `Achievement 1` - [0] 2026-03-08 11:21 - Current Decision Checklist - Graph / Part / Output Ownership

#### Decision checlist Notes


Forward rule for the ownership checklist:

  - If a question is too weak, too narrow, or needs to be rewritten, add an indented sub-checklist item using `N.N`.
  - Example:
    - `5.1`
    - `7.1`
  - Use the sub-checklist item to record the need to revise the question before fully resolving it.

  Practical use:

  - main question line = the current top-level planning question
  - indented `N.N` line = revision/tracking note when the wording needs to change

- If an old top-level question is no longer the best wording, keep it as a `~` legacy question when that history still matters.
- Add the stronger replacement as an indented `QN.1` question beneath it.
- Resolve the new `QN.1` question rather than pretending the old wording was always correct.
- Use this pattern when preserving the evolution of the decision is more useful than silently rewriting the old question.
- Workflow shortcut:
  - if the user says `update Q7` (or the current question number), do it in one pass
  - update the entry under that question's section
  - if the question needs revision, create the new `QN.1` question there
  - then sync the top `Decision Checlist` so the parent question is `~` and the new `QN.1` line appears beneath it

##### 2026-03-08 11:48 - Entry Numbering Rule For Future Substantive Notes

Forward rule for this file:

- When the user asks Codex to "make an entry" and the result is a real substantive timestamped planning note, that entry should include an incrementing `[N]` index.
- The `[N]` index should increase by 1 for each new substantive entry.
- This is meant for durable planning/architecture entries in the main body of this file.

Not included in this rule:

- simple formatting changes
- fold-structure cleanup
- checklist reshaping
- other maintenance-only edits

Practical intent:

- This should make later compile/summary passes easier because substantive entries will have both:

##### Human notes
- go over how worker builds part piece by piece & chaches - we have system in place sorta - with seperate liading bars. - maybe mention controls (ppuase build per object)

#### Decision Checlist

Use this as the next concrete decision block.

- [x] Q1 - Does a `graph` own the parts it produces?
- [x] Q2 - Is the app truth a `list of graphs` rather than one hidden active graph?
- [x] Q3 - Can one `graph` contain multiple `Part` / `Starch` hosts?
- [x] Q4 - Does each `Part` node belong to exactly one `graph`?
- [~] Q5 - Should the old global parts list become a graph-local parts list?
  - [x] Q5.1 - Should the old global parts list evolve into a higher-level scene/layers manager that includes graphs, generated objects, parts, and reference assets?
- [~] Q6 - Should graph-local part visibility be owned by the `graph` rather than the app shell?
  - [x] Q6.1 - Should visibility state for generated objects and parts be owned by the viewer / scene layer rather than the `graph` or app shell?
- [x] Q7 - Is `OutputPreview` owned by a single `graph` rather than the whole app?
- [x] Q8 - Can one `graph` produce multiple visible output parts at the same time?
- [x] Q9 - Should the app also have a higher-level graph list / graph manager above the local graph parts lists?
- [x] Q10 - Should enabling/disabling a graph be separate from enabling/disabling individual produced parts inside that graph?
- [x] Q11 - Does multi-graph support come before broader editor expansion?
- [ ] Q12 - Or does the single-graph object model need to be locked first before multi-graph work begins?



#### [x] Q1 - Does a `graph` own the parts it produces?

##### [1] 2026-03-08 11:31 - Resolved Q1 - A Graph Owns The Parts It Produces

High-confidence conclusion:

- Yes, a `graph` owns the parts and objects it produces.

Reasoning captured from the session:

- This fits the intended future return of legacy-like `Materials` behavior.
- A graph can produce one `.obj` while still exposing multiple internal parts that can receive different materials.
- Graph ownership keeps it clear which graph is responsible for which resulting parts/objects.

Material implication:

- Material assignment should stay local to the graph-owned produced objects.
- Different graphs should be able to assign different materials even when they start from related source data.

Teleport clarification:

- A future `Teleport Out` node should expose graph-owned data from the source graph.
- A future `Teleport In` node should import that data into a different graph.
- Cross-graph teleport should transfer usable data, not shared ownership.

Recommended ownership rule for teleport:

- The receiving graph should copy, clone, or re-materialize the relevant object params/data into its own local object.
- That new resulting object should be owned by the receiving graph.
- This avoids one shared live-owned part being mutated by two graphs at once.

Resulting clean rule:

- source graph owns what it produces
- teleport moves data across graph boundaries
- receiving graph owns the new object/part it creates from imported data
- materials remain local to each graph-owned result

##### [2] 2026-03-08 11:42 - Teleport Redefinition - One Publish / Receive System

High-confidence direction:

- The current `teleport in` / `teleport out` wording is confusing.
- The stronger architectural model is one unified `Publish / Receive` system.

Why this is cleaner:

- It works inside one graph for organization.
- It also works across different graphs for reuse.
- It avoids the point-of-view confusion of `in` versus `out`.

Recommended system model:

- `Publish`
  - takes some value, object, or `Solid`
  - registers/exposes it so it can be used elsewhere
  - can later support scope rules such as same-graph only or cross-graph

- `Receive`
  - lets the user choose from available published items
  - provides a usable output for wiring at a different location

Same-graph use case:

- A user can build up a `Part` / `Starch` host.
- The user can take the final `Solid` and wire it into a `Publish` node.
- Somewhere else in the same editor/graph, the user can place a `Receive` node and wire that output into `OutputPreview` or other downstream logic.
- This acts as an organization/clean-routing feature without requiring one long visible wire across the whole canvas.

Cross-graph use case:

- A user can `Publish` data from one graph.
- Another graph can `Receive` that published data.
- Cross-graph receive should still respect the ownership rule already established:
  - receiving across a graph boundary should not create shared ownership
  - the receiving graph should create or own its own resulting local object when needed

Important conceptual shift:

- This looks less like a separate teleport feature and more like a generalized data exposure/reuse system.
- The same underlying logic may be able to cover:
  - param exposure
  - object exposure
  - `Solid` exposure
  - same-graph organization
  - cross-graph reuse

Working naming recommendation:

- prefer `Publish` and `Receive`
- avoid `teleport in` / `teleport out`
- avoid `import` / `export` unless later you specifically mean file-style import/export

Open future detail:

- one later question will be whether some receives are reference-like versus always cloning/re-materializing data
- but the naming and system shape should be unified first

#### [x] Q2 - Is the app truth a `list of graphs` rather than one hidden active graph?

##### [3] 2026-03-08 11:58 - Resolved Q2 - App Truth Is A List Of Graphs, With Separate Viewer Reference Assets

High-confidence conclusion:

- Yes, the app truth should be a `list of graphs` rather than one hidden active graph.
- But the viewer should also be able to display non-graph reference assets such as `.obj`, `.glb`, and `.stl`.

Important ownership split:

- `graphs`
  - editable sources of truth
  - produce graph-owned parts/objects
- viewer `reference assets`
  - external context geometry
  - not graph-owned production
  - shown in the viewer alongside graph-produced results

Why this matches the older `/16/` direction:

- The old `Layers` manager was useful because it combined:
  - visibility control
  - multi-parahook / loading management
  - quick material access
- That old UI proved a manager/list surface is valuable, but it does not mean every row in that viewer list is the same kind of object.

Cleaner future interpretation:

- the app should manage a `list of graphs`
- the viewer scene should be able to show:
  - graph-produced generated models
  - external reference assets
- a future scene/layers manager can expose both, while keeping their ownership meaning distinct

Likely implication:

- graph manager and reference-asset manager are related but not identical concerns
- reference assets should probably have their own visibility controls
- reference assets should not be confused with graph-produced parts

#### [x] Q3 - Can one `graph` contain multiple `Part` / `Starch` hosts?

##### [5] 2026-03-08 12:22 - Resolved Q3 - One Graph Can Host Multiple Part / Starch Hosts

High-confidence conclusion:

- Yes, one `graph` can and should be able to host multiple `Part` / `Starch` hosts.

Intended default parahook direction:

- A finished default parahook graph is expected to contain multiple major parts, including:
  - `Baseplate`
  - `ToeHook`
  - `Heel Kick`

Why this matters:

- The target product is not only one isolated part per graph.
- A single graph should be able to define a small coordinated part system.
- This supports one graph acting like a complete parahook assembly definition rather than a single isolated component.

Future wiring direction:

- The `ToeHook` and `Heel Kick` should later be able to live along a spline defined by the `Baseplate`.
- That implies cross-part relationships inside one graph are part of the intended model.

Important future node implication:

- A future `solid on spline` node should handle combination/placement logic across multiple solids.
- That node can help coordinate three or more solids and output one resulting `Solid` while still starting from multiple underlying parts.

Working interpretation:

- one graph may contain multiple part hosts
- those parts may have relationships to each other
- the graph may still produce one higher-level combined result from several coordinated part sources

#### [x] Q4 - Does each `Part` node belong to exactly one `graph`?

##### [6] 2026-03-08 12:29 - Resolved Q4 - Each Part Node Belongs To Exactly One Graph

High-confidence conclusion:

- Yes, each `Part` node belongs to exactly one `graph`.

Why this follows from earlier answers:

- Q1 established that a `graph` owns the parts and objects it produces.
- The `Publish / Receive` system was defined as cross-graph data reuse, not shared node ownership.
- That means graph boundaries are crossed through published data, not by one `Part` node belonging to multiple graphs at once.

Resulting ownership rule:

- a `Part` node has one owning `graph`
- another graph may use published data from that part
- another graph does not co-own that same `Part` node
- if another graph needs its own result, it creates and owns its own local result from received data

Practical implication:

- single-graph ownership keeps the `Part` model clean
- cross-graph reuse should stay in the `Publish / Receive` layer rather than becoming shared graph/node ownership

#### [~] Q5 - Should the old global parts list become a graph-local parts list?

  - [x] Q5.1 - Should the old global parts list evolve into a higher-level scene/layers manager that includes graphs, generated objects, parts, and reference assets?

##### [7] 2026-03-08 12:35 - Q5 Direction - The Old Global Parts List Should Evolve Into A Higher-Level Scene / Layers Manager

High-confidence direction:

- The old global parts list should not be reduced to only a graph-local parts list.
- It should evolve into what the old legacy layers system was starting to do: a higher-level scene/layers manager.

Working hierarchy:

- `reference assets`
  - imported `.obj` / `.glb` / `.stl`
- `graphs`
  - loaded/editable graphs
- generated `objects` under each graph
  - object 1
  - object 2
- `parts` under each generated object

Important implication:

- yes, one graph should be able to export/generate multiple objects
- and each generated object can contain multiple parts

Why this is stronger than the original Q5 wording:

- the old flat global parts list was trying to do several jobs at once
- the stronger future model is not merely "make it graph-local"
- the stronger future model is "replace it with a structured scene/layers manager that contains graph-local outputs inside it"

Recommended next wording:

- Q5 is probably better rewritten later as:
  - `Should the old global parts list evolve into a higher-level scene/layers manager that includes graphs, generated objects, parts, and reference assets?`

##### [8] 2026-03-08 12:47 - Resolved Q5.1 - The Future Layers Manager Should Use A Nested Scene Structure

High-confidence conclusion:

- Yes, `Q5.1` is the stronger replacement question, and the answer is yes.

Confirmed future nesting:

- `Reference Assets`
  - imported `.obj`
  - imported `.glb`
  - imported `.stl`
- `Graphs`
  - `Graph A`
    - generated `Object 1`
      - `Part 1`
      - `Part 2`
    - generated `Object 2`
      - `Part 1`
      - `Part 2`
  - `Graph B`
    - generated `Object 1`
      - `Part 1`

Working meaning of the structure:

- the future layers/scene manager is the top-level viewer organization surface
- graphs are one category inside that surface
- each graph can contain multiple generated objects
- each generated object can contain multiple parts
- reference assets live alongside graphs, not inside graph ownership

Resulting direction:

- keep old `Q5` as legacy wording
- treat `Q5.1` as the active resolved replacement direction

#### [~] Q6 - Should graph-local part visibility be owned by the `graph` rather than the app shell?

  - [x] Q6.1 - Should visibility state for generated objects and parts be owned by the viewer / scene layer rather than the `graph` or app shell?

##### [9] 2026-03-08 12:58 - Q6 Direction - Visibility Likely Belongs To The Viewer / Presentation Layer

High-confidence current read:

- This question is probably too narrow as written.
- The strongest current direction is that visibility should likely belong to the viewer/presentation layer rather than to the `graph` or the app shell.

Why:

- the `graph` should own what it can generate and export
- the viewer should own what is currently shown or hidden
- hiding something in the viewer should not necessarily mean removing it from graph truth

Cleaner ownership split:

- `graph`
  - production/source truth
- `viewer`
  - display/visibility truth
- scene/layers manager
  - user-facing control surface for visibility state

Why this may need a revision question:

- Q6 currently frames the choice as:
  - `graph`
  - versus app shell
- but the stronger third option now appears to be:
  - viewer-owned presentation state

Likely next move:

- Q6 may need a `Q6.1` replacement question later such as:
  - `Should visibility state for generated objects and parts be owned by the viewer/scene layer rather than the graph or app shell?`

##### [10] 2026-03-08 13:05 - Resolved Q6.1 - Visibility State Should Belong To The Viewer / Scene Layer

High-confidence conclusion:

- Yes, `Q6.1` is the stronger replacement question, and the answer is yes.

Resulting split:

- `graph`
  - owns what can be generated/exported
- `viewer` / scene layer
  - owns what is currently shown or hidden
- scene/layers manager
  - exposes the user-facing controls for that visibility state

Practical implication:

- hiding an object or part in the viewer should not change graph truth
- visibility is presentation state, not production ownership

#### [x] Q7 - Is `OutputPreview` owned by a single `graph` rather than the whole app?

##### [11] 2026-03-08 13:05 - Resolved Q7 - OutputPreview Should Be Graph-Local, And A Graph May Need Multiple Preview Outputs

High-confidence conclusion:

- Yes, `OutputPreview` should be owned by a single `graph` rather than the whole app.

Why:

- preview/output routing belongs with the graph that defines and produces those results
- graph-local preview ownership fits the already established graph ownership model

Important extension:

- a graph may need to support multiple preview outputs or multiple previewable objects
- this is necessary if one graph can generate multiple objects rather than only one final result

Working interpretation:

- `OutputPreview` is graph-local
- one graph may have:
  - multiple preview outputs
  - or one preview system with multiple output slots/targets
- the exact UI shape can be decided later, but the ownership should stay graph-local

#### [x] Q8 - Can one `graph` produce multiple visible output parts at the same time?

##### [13] 2026-03-08 13:15 - Resolved Q8 - One Graph May Produce Multiple Visible Outputs, Including Objects And Assemblies

High-confidence conclusion:

- Yes, one `graph` can produce multiple visible outputs at the same time.

Important refinement:

- those outputs should not be thought of only as loose flat parts
- a `graph` may produce:
  - standalone `objects`
  - `assemblies`

Assembly definition captured from the session:

- if multiple generated objects go into one preview/output grouping, that grouped result can be treated as an `assembly`
- an `assembly` is a group of `objects`
- each `object` can contain `parts`

Working depth limit:

- `graph`
  - may own multiple `objects` and/or `assemblies`
- `assembly`
  - groups multiple `objects`
- `object`
  - contains `parts`
- `part`
  - lower-level internal pieces

Current read:

- this is not too deep
- it is probably the right stopping depth for now
- going deeper than `graph -> assembly -> object -> part` is probably unnecessary unless the product later forces it

##### [14] 2026-03-08 13:21 - Q8 Side Note - Full Authored Truth Should Stay Inspectable, But The Main Canvas Should Stay Clean

High-confidence side note:

- The user should probably be able to inspect the full authored chain that makes an object.
- But the main canvas UI should remain visually clean rather than trying to show every internal authored element all at once.

Working direction:

- full authored truth should stay inspectable
- the main canvas should stay relatively clean
- deeper information can be shown through separate toolbars, inspectors, panels, or other helper surfaces

Practical implication:

- the system should preserve access to `num`, `bool`, `Part`, object, and assembly truth
- but the main graph surface does not need to render every internal authored piece at once to honor that goal

#### [x] Q9 - Should the app also have a higher-level graph list / graph manager above the local graph parts lists?

##### [15] 2026-03-08 13:27 - Resolved Q9 - The App Should Have A Higher-Level Graph Manager, Likely Inside A File / Project Layer

High-confidence conclusion:

- Yes, the app should have a higher-level graph list / graph manager above the local graph parts lists.

Important extension from the session:

- this likely grows one layer higher into a file/project list
- that is closer to a Fusion-like model where the user is working in one file while another linked/shared file can also appear in the project context

Working hierarchy implied by this answer:

- `file` / project item
  - owns a list of `graphs`
- `graph`
  - owns generated `objects` and/or `assemblies`
- `object`
  - owns `parts`

Why this matters:

- a user may want to collapse one file's graph stack away
- then load another file from someone else
- that second file can bring its own graphs and its own resulting parts
- this also supports working on two different files at once

Current read:

- Q9 is yes at the graph-manager level
- but the longer-term product model may also want an explicit file/project layer above graphs

#### [x] Q10 - Should enabling/disabling a graph be separate from enabling/disabling individual produced parts inside that graph?

##### [16] 2026-03-08 13:31 - Resolved Q10 - Graph Enable / Disable Should Be Separate From Per-Object And Per-Part Controls

High-confidence conclusion:

- Yes, enabling/disabling a `graph` should be separate from enabling/disabling the individual produced objects or parts inside that graph.

Why:

- graph-level control is about the whole authored result set from that graph
- per-object and per-part controls are about more granular visibility and interaction inside that graph's outputs

Fusion-style parallel captured from the session:

- when the user clicks on an object inside the graph/file/layers list, they may later want item-level actions such as:
  - show/hide
  - rename
  - isolate
  - material/appearance access
  - selectability
  - opacity or detail controls

Working implication:

- graph-level toggle = whole graph output on/off
- object-level toggle = specific generated object on/off
- part-level toggle = specific part on/off

Why this matters:

- this keeps coarse control and fine control separate
- it matches the layered scene-manager direction already being established

#### [x] Q11 - Does multi-graph support come before broader editor expansion?

##### [18] 2026-03-08 13:37 - Resolved Q11 - Foundational Browser / Multi-Graph Structure Should Come Before Broad Editor Expansion

High-confidence conclusion:

- Yes, the foundational browser / multi-graph structure should come before broader editor expansion.

Why:

- this does not sound like a minor later add-on
- it sounds like a core ownership and navigation structure for the app
- if node/canvas cleanup continues too far on top of a single-graph assumption, later browser integration likely becomes harder and messier

Important nuance:

- this does not mean every multi-graph feature must be fully finished first
- it means the core file / graph / browser ownership foundation should be established first
- then broader editor and spaghetti/canvas polish can be built on top of the right base

Practical direction:

- browser hierarchy foundations first
- graph/file ownership model first
- then broader node and wire UX cleanup on top of that

#### [ ] Q12 - Or does the single-graph object model need to be locked first before multi-graph work begins?

### Future Feature Captures

##### [4] 2026-03-08 11:58 - Future Feature Capture - Import `.obj` / `.glb` / `.stl` As Viewer Reference Assets

High-confidence future feature note:

- Future support for importing `.obj`, `.glb`, and `.stl` should be captured as a real wishlist/roadmap item.

Current `/src` reality:

- the app is still using `three`
- current source does not appear to have active loader support yet for `.glb`, `.obj`, or `.stl` reference imports
- `.glb` is still a sensible future candidate for efficient viewer-side reference assets

Recommended interpretation:

- this feature is best thought of first as `reference asset import`
- not the same as graph export
- not the same as graph-owned produced parts

Likely roadmap fit:

- this may deserve its own future phase if reference-asset viewing becomes a meaningful scene-management feature
- or it could live beside export/viewer scene-management work if those systems are intentionally planned together

Useful future scope:

- import `.obj`
- import `.glb`
- import `.stl`
- show/hide them in the viewer
- keep them distinct from graph-produced generated models
- optionally surface them in a future scene/layers manager

### Future Decision Areas

##### [12] 2026-03-08 13:08 - Future Decision Area - `Collapsed / Essentials / Expanded`

High-confidence note:

- `Collapsed / Essentials / Expanded` needs to become its own separate decision checklist.
- The current mode system sounds underdefined and is now causing real app problems.

Why this should be split out:

- it affects node behavior and UI state deeply
- it likely mixes presentation, interaction rules, and per-node state
- it is no longer just a cosmetic preference if it is breaking the app

Current read:

- the idea is important
- the implementation sounds messy
- the behavior needs to be defined clearly before more changes are piled on top

Needed next step:

- create a dedicated question set for:
  - what `Collapsed` means
  - what `Essentials` means
  - what `Expanded` means
  - what each mode hides or shows
  - whether the mode is per-node, per-type, per-template, or global
  - how mode changes interact with drivers, inputs, outputs, and feature-stack visibility

Practical implication:

- this should probably become its own future decision checklist rather than being solved ad hoc inside the current ownership checklist

##### [17] 2026-03-08 13:33 - Naming Note - The User-Facing Hierarchy Panel Should Likely Be Called `Browser`

High-confidence naming note:

- The user-facing panel that shows files/projects, graphs, objects, parts, and reference assets should likely be called `Browser`.

Why this fits:

- it matches the Fusion-style mental model the user is referencing
- it is broader than just `graph list`
- it better reflects the nested hierarchy already being defined

Important distinction:

- `Browser` should be the user-facing panel name
- the underlying internal model terms should stay more precise, such as:
  - `file` / project
  - `graph`
  - `assembly`
  - `object`
  - `part`
  - `reference asset`

Working rule:

- use `Browser` for the panel/surface the user interacts with
- keep the deeper architecture and ownership language separate underneath














## Session 1 - planning bath 1 compilelog. 

### Session 1 Summary

This planning batch turned a loose wishlist conversation into a more concrete product model.

The main outcomes were:
- the `Part node` model became clearer
- graph ownership rules were defined
- the Browser direction became the next real roadmap lane
- the roadmap was updated to reflect that new sequence

### Session 1 - Planning Batch Compile

1. Planning-mode workflow was formalized.
   - planning work moved out of `docs/CHANGELOG.md`
   - the active Codex chat became the planning log surface
   - numbered `Planning-Batch` and numbered substantive `[N]` entries were introduced

2. The object-model direction was tightened.
   - the original node-based instinct was confirmed as broadly correct
   - the real drift was into embedded data, virtual rows, and part-specific special cases
   - `Part node` became the preferred real term over temporary metaphor terms like `Starch`

3. The Spaghetti-editor vision was clarified.
   - a `Feature Stack` should move toward a first-class node/composite object
   - the editor should allow visible routing and readable causality
   - composite part nodes should expose internal sections without hiding value flow

4. The wire/reuse model was tightened.
   - confusing teleport language was replaced with `Publish / Receive`
   - same-graph organization and cross-graph reuse are two scopes of one system
   - cross-graph reuse should move data, not shared ownership

5. The ownership model was defined through the main decision checklist.
   - graphs own the parts/objects they produce
   - app truth is a `list of graphs`
   - each `Part node` belongs to exactly one graph
   - one graph can host multiple part nodes
   - one graph may produce multiple `objects` and/or `assemblies`
   - `OutputPreview` should be graph-local
   - visibility belongs to the viewer / scene layer, not graph truth

6. The hierarchy model was defined.
   - the old global parts list should evolve into a nested scene/layers structure
   - the likely visible nesting is:
     - reference assets
     - graphs
     - generated objects
     - parts
   - a higher file/project layer above graphs is likely needed later

7. The user-facing hierarchy panel got a clearer name.
   - `Browser` is the likely user-facing name
   - internal model terms should stay precise:
     - `file/project`
     - `graph`
     - `assembly`
     - `object`
     - `part`
     - `reference asset`

8. The roadmap direction changed.
   - Browser / multi-graph foundations should come before broad editor expansion
   - this work fits existing prefixes rather than needing a new Browser prefix
   - the next live lane is mainly `SP` + `GE`, followed by `AS`, then later `VR`

9. Future decision work was captured.
   - `Collapsed / Essentials / Expanded` needs its own checklist
   - importing `.obj` / `.glb` / `.stl` as reference assets is a real future roadmap item

10. The roadmap itself was updated.
    - the current roadmap now reflects Browser-first planning
    - a bottom `Roadmap Lanes` section was added
    - `Lane [1]` now groups the first cross-prefix Browser foundation work

### Session 1 - Main Decisions Captured

- `Part node` should act like a real composite host.
- `Part type` and `preset` are separate from the node identity.
- graphs own authored param truth.
- the viewer owns visibility state.
- one graph can produce multiple outputs, including `objects` and `assemblies`.
- the main canvas should stay clean even if full authored truth remains inspectable.

### Session 1 - Artifacts Produced

- the ownership checklist was built and resolved through `Q1` to `Q11`
- the roadmap was rewritten around Browser-first execution
- `Lane [1]` was started as the first larger roadmap grouping
- planning workflow rules were tightened inside repo docs

### Session 1 - Hand-off Into Session 2

Session 2 should continue from:
- Browser / multi-graph lane breakdown
- detailed per-phase planning inside the family `Phase-Plans.md` files
- unresolved checklist follow-up such as `Q12`
- future decision areas like `Collapsed / Essentials / Expanded`

## Session 2 Notes

## `Achievement 2` - [19] 2026-03-08 - `SP - Phase 9` Planning Start

### 2026-03-08 14:05 - Session 2 Focus - What We Need To Achieve `SP - Phase 9`

High-confidence starting direction:

- `SP - Phase 9 - Graph Document Foundations` is the first concrete planning target for Session 2.
- The goal is to define the minimum document model that turns the current hidden single-graph editor into a real graph-document system.
- This should stay focused on graph-document foundations, not all later Browser features at once.

Working scope:

- define what a `graph document` is
- define what belongs inside that document versus outside it
- define how graph documents relate to files/projects
- define the minimum state, identity, and save/load shape needed before deeper Browser work

### [0] 2026-03-08 14:05 - Current Decision Checklist - `SP - Phase 9 - Graph Document Foundations`

#### Decision checlist Notes

- Use this as the active Session 2 checklist for `SP - Phase 9`.
- Keep the same revision pattern from Session 1:
  - old question can stay as `[~]`
  - stronger replacement can become `QN.1`
- Use `update QN` as the one-shot command if a question needs to be revised later.
- Keep substantive `SP - Phase 9` note numbering absolute from the earlier body entries.
- The next substantive entry after this checklist setup should continue from `[20]`.

#### Question Explinations

##### Q1 - `What is the minimum canonical shape of a graph document in app truth?`

This asks:
- what is the smallest honest data object that still counts as one valid `graph document`

Why it matters:
- we need to know what one graph document is before we can save it, load it, list it in the Browser, or switch between several of them

Humanized summary:
- before we build the Browser, we need to agree on what one graph file actually is

##### Q2 - `Which authored state belongs inside the graph document versus outside it?`

This asks:
- which authored truth should live inside the graph document itself
- and which state should live outside it in viewer/app UI layers

Why it matters:
- `SP - Phase 9` will get messy if graph truth, viewer truth, and temporary UI state are all mixed together

Humanized summary:
- we need to decide what belongs to the graph itself versus what is just temporary app or viewer behavior

##### Q3 - `Does one file/project own multiple graph documents, or do we start with standalone graph documents first?`

This asks:
- whether `SP - Phase 9` starts directly with one file/project owning multiple graph documents
- or whether we first land standalone graph documents and add the higher file/project layer later

Why it matters:
- this decides how ambitious the first document-foundation pass should be

Humanized summary:
- we need to decide if phase 9 starts with simple graph documents first, or jumps straight to files that hold several graphs

##### Q4 - `What identity fields does a graph document need from day one?`

This asks:
- what identity fields a graph document needs from day one

Examples:
- `graphDocumentId`
- `name`
- maybe creation/update metadata later

Why it matters:
- Browser/document systems need stable identity, not just raw nodes and edges

Humanized summary:
- every graph document needs a real identity so the app can tell one graph apart from another

##### Q5 - `What parts of graph state should be persisted versus left as transient UI/view state?`

This asks:
- what parts of graph state should be saved as real persistent truth
- and what parts should stay transient UI/view state

Why it matters:
- persistence rules need to be clear before save/load can be trusted

Humanized summary:
- we need to separate “real saved graph data” from “temporary stuff the UI is doing right now”

##### Q6 - `How should active/open graph selection work once more than one graph exists?`

This asks:
- how the app should behave once more than one graph exists
- especially which graph is open, active, focused, or being edited

Why it matters:
- the current app is still biased toward one implicit active graph
- `SP - Phase 9` needs a cleaner rule than that

Humanized summary:
- once there is more than one graph, we need a simple rule for which one the user is actually working in

##### Q7 - `What current single-graph assumptions in the editor/store must be removed for SP - Phase 9 to count as real?`

This asks:
- what current single-graph assumptions in the code have to be broken or removed for `SP - Phase 9` to be real

Why it matters:
- this keeps the phase grounded in actual code change instead of only planning language

Humanized summary:
- we need to identify the exact places where the current app still assumes there is only one graph

##### Q8 - `What is explicitly out of scope for SP - Phase 9 so it does not sprawl into later Browser phases?`

This asks:
- what we should intentionally not solve yet inside `SP - Phase 9`

Why it matters:
- without an out-of-scope line, this phase could sprawl into later Browser, output, and viewer work

Humanized summary:
- we need to be honest about what phase 9 is not trying to finish yet

#### Decision 2 Checlist

Use this as the next concrete decision block.

- [x] Q1 - What is the minimum canonical shape of a `graph document` in app truth?
- [x] Q2 - Which authored state belongs inside the `graph document` versus outside it?
- [~] Q3 - Does one file/project own multiple `graph documents`, or do we start with standalone graph documents first?
  - [x] Q3.1 - Should `SP - Phase 9` be built against the future file/project -> multiple graph documents model, even if the first implementation is only a partial Browser foundation?
- [x] Q4 - What identity fields does a `graph document` need from day one?
- [x] Q5 - What parts of graph state should be persisted versus left as transient UI/view state?
- [x] Q6 - How should active/open graph selection work once more than one graph exists?
- [x] Q7 - What current single-graph assumptions in the editor/store must be removed for `SP - Phase 9` to count as real?
- [ ] Q8 - What is explicitly out of scope for `SP - Phase 9` so it does not sprawl into later Browser phases?

#### [x] Q1 - What is the minimum canonical shape of a `graph document` in app truth?

##### [20] 2026-03-08 14:12 - Resolved Q1 - A Graph Document May Be Valid Even When Empty

High-confidence conclusion:

- A `graph document` should be valid even when it is empty.
- The minimum canonical shape should represent a real open/saveable document, not only a graph that already does useful work.

Working minimum shape:

- `graphDocumentId`
- `name`
- `graph`
  - `nodes: []`
  - `edges: []`
- basic document defaults
- an `origin` / reference-space concept

Important interpretation:

- the document does not need to start with real authored nodes
- the document should still have identity and basic defaults from day one
- `origin` may begin as an implicit document-level concept before it becomes a visible richer system later

Why this matters for `SP - Phase 9`:

- Browser/document systems need empty documents to be valid
- save/load should not require prebuilt graph content
- later graph authoring should build on top of a real document base, not create the document only after content exists

#### [x] Q2 - Which authored state belongs inside the `graph document` versus outside it?

##### [21] 2026-03-08 14:22 - Q2 Direction - Graph Documents Own Generate Truth, While The Viewer Owns View State

High-confidence current direction:

- The `graph document` should own authored truth.
- The viewer / scene layer should own presentation truth.

Current working split:

- inside the `graph document`
  - graph structure
    - `nodes`
    - `edges`
  - authored node params and values
  - authored part-node configuration
  - authored output/generation intent
  - `generate on/off` state

- outside the `graph document`
  - viewer visibility state
  - camera state
  - panel and inspector UI state
  - temporary selection/focus state
  - floating window and layout state
  - `view on/off` state

Important two-fold rule captured from the session:

- `Generate On/Off`
  - belongs to graph-owned authored truth
  - controls whether something is actually produced

- `View On/Off`
  - belongs to viewer-owned presentation state
  - controls whether a produced thing is currently shown

UI implication:

- a `Part node` such as `Baseplate` can still have an eyeball button in the top-right
- that eyeball should toggle `view on/off`
- it should talk to viewer/scene state rather than changing whether the part generates

Current read:

- this is the strongest Q2 direction so far
- Q2 may or may not need a later `Q2.1`, but the main ownership split is now much clearer

Resolved rule:

- `generated on/off` means graph truth
- `view on/off` means viewer / Browser truth

#### [~] Q3 - Does one file/project own multiple `graph documents`, or do we start with standalone graph documents first?

  - [x] Q3.1 - Should `SP - Phase 9` be built against the future file/project -> multiple graph documents model, even if the first implementation is only a partial Browser foundation?

##### [22] 2026-03-08 14:30 - Resolved Q3.1 - `SP - Phase 9` Should Target The Browser-First File / Project To Multi-Graph Model

High-confidence conclusion:

- Yes, `SP - Phase 9` should be built against the future file/project -> multiple graph documents model.
- The first implementation does not need to finish the whole Browser, but it should build the editor against that target ownership shape from the start.

Why this replaces the older Q3 wording:

- the older wording framed the choice as:
  - start with standalone graph documents
  - or start with one file/project owning multiple graph documents
- after the Session 1 decisions, the stronger direction is already Browser-first
- the real remaining question is how much of that model `SP - Phase 9` needs to land immediately

Working rule:

- target truth:
  - one file/project can own multiple graph documents
- `SP - Phase 9` implementation scope:
  - land only the minimum Browser/document foundation needed to make that model real enough to build on

Practical implication:

- the spaghetti editor should not keep deepening a standalone single-graph assumption
- even partial `SP - Phase 9` work should point toward the future Browser hierarchy rather than away from it

#### [x] Q4 - What identity fields does a `graph document` need from day one?

##### [23] 2026-03-08 14:36 - Resolved Q4 - A Graph Document Needs Stable Identity, Parent Ownership, And Basic Versioning

High-confidence conclusion:

- A `graph document` needs a small but real identity set from day one.
- The goal is to make Browser/document identity feel real without copying a full Fusion-style data model immediately.

Recommended minimum fields:

- `graphDocumentId`
- `name`
- `parentFileId`
- `version`

Recommended if easy from the start:

- `createdAt`
- `updatedAt`

Optional later:

- `graphType` or `documentType`
- `description`
- `author`
- `units`
- `originId` if `origin` later becomes a first-class identity object

Fusion-style parallel captured from the planning pass:

- Fusion-like systems tend to keep:
  - stable file/document id
  - parent project ownership
  - human-readable name
  - version identity
  - timestamps

Working rule for `SP - Phase 9`:

- keep the minimum identity shape small
- but include enough identity to support:
  - Browser listing
  - save/load
  - parent file ownership
  - later version-aware document work

#### [x] Q5 - What parts of graph state should be persisted versus left as transient UI/view state?

##### [24] 2026-03-08 14:45 - Resolved Q5 - Graph Documents Persist The Authored Canvas And Build State, While Workspace State Stays Transient

High-confidence conclusion:

- The graph document should persist authored graph truth.
- The graph document should also persist the information needed to recreate the canvas in a meaningful way.
- Multi-window editor behavior should stay outside graph-document truth.

Current working split:

- persist with the `graph document`
  - graph structure
  - node locations
  - wire connections
  - authored params and values
  - part configuration
  - how parts/graphs are built
  - authored `generate on/off`

- keep transient / outside the graph document
  - whether the spaghetti editor is currently collapsed
  - which external browser window a graph is open in
  - floating window geometry
  - current focus/active selection state
  - temporary Browser emphasis/highlight state

Important implication from the session:

- one graph may be opened in an editor window that can:
  - stay normal
  - collapse down to a smaller toolbar-width editor
  - pop out into a separate browser window
- those windowing behaviors should be treated as workspace/UI state, not graph truth

Resolved rule:

- save the graph-authored build truth
- save the graph-authored canvas reconstruction data
- do not save temporary workspace/window/focus/viewer behavior as graph truth

#### [x] Q6 - How should active/open graph selection work once more than one graph exists?

##### [25] 2026-03-08 14:45 - Resolved Q6 - Focus Should Follow The Editor Window The User Is Actively Working In

High-confidence conclusion:

- Once more than one graph exists, the focused graph should usually be the graph whose spaghetti editor window the user most recently clicked into or interacted with.

Working rule:

- the Browser manager can show and control all open graphs
- whichever spaghetti editor the user actively clicks into becomes the focused graph
- the Browser should reflect that focus
- multiple spaghetti editor windows can stay open at once and still feed the same viewer

Why this fits the planned UI:

- the spaghetti editor may later:
  - collapse into a smaller toolbar-width window
  - remain docked/floating in the main app
  - pop out into a separate browser window
- with multiple graph editors open, focus needs to follow real user interaction instead of one hidden global assumption

Resulting direction:

- open graph windows can coexist
- focused graph follows user interaction
- Browser state should mirror that focus rather than inventing a separate conflicting active-graph rule

#### [x] Q7 - What current single-graph assumptions in the editor/store must be removed for `SP - Phase 9` to count as real?

##### [27] 2026-03-08 15:02 - Q7 Findings - The Current App Still Assumes One Global Graph, One Spaghetti Window, And One Global Preview Path

High-confidence findings from the current `/src` read:

- `src/main.tsx` is not the real issue.
- `src/app/main.tsx` is also minimal.
- The real single-graph assumptions start in the app shell and the global stores.

Main current assumptions:

- one global spaghetti graph store
  - `useSpaghettiStore` is currently being used like one singleton graph owner
  - `setSpaghettiGraph`, `compileSpaghetti`, and `requestSpaghettiBuild` all talk to one global graph

- one app-wide mode switch
  - `inputMode: 'legacy' | 'spaghetti'` still frames spaghetti as one app mode rather than one or more graph-document editors

- one spaghetti floating window
  - `AppShell` currently treats spaghetti as one floating editor window controlled by `inputMode === 'spaghetti'`

- one global preview/output bridge
  - `useAppStore` still keeps one shared `parts`, `assembled`, `partsVisibility`, and related build state
  - that is still much closer to one active graph/output path than to graph-local ownership

- one compile/build memory path
  - single values such as `spaghettiLastCompile` and `spaghettiPreviousBuildInputs` still assume one active spaghetti build context

Important practical implication for `SP - Phase 9`:

- the main work is probably not in `main.tsx`
- the main work is in:
  - `src/app/AppShell.tsx`
  - `src/app/store/useAppStore.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - the compile/build bridge from spaghetti into the dispatcher

Jake / Spaghetti direction note from this read:

- `Spaghetti` currently looks like the compute/model-truth side
- `Jake mode` looks more like a separate user interface over some param/control state
- longer-term, `Jake mode` may make more sense as a control interface into graph-owned params rather than a deep separate app mode
- that would also make it easier to connect control-viz spheres/handles to graph nodes and param outputs later

Current read:

- Q7 is not fully resolved yet
- but the main single-graph seams are now identified clearly enough to guide the first real `SP - Phase 9` cleanup pass

##### [29] 2026-03-08 15:18 - Resolved Q7 - `SP - Phase 9` Must Break The One-Graph, One-Window, One-Preview Assumptions

High-confidence conclusion:

- `SP - Phase 9` is not real unless it breaks the current deep assumption that the app has:
  - one global graph
  - one spaghetti editor window
  - one global preview/output path

Confirmed direction from the session:

- multiple simultaneously open graph editors should be part of the first real Browser foundation

That means `SP - Phase 9` must stop assuming:

- one singleton graph owner
  - the current singleton-style `useSpaghettiStore` usage has to be broken or wrapped in document-aware ownership

- one app-wide spaghetti mode switch
  - `inputMode: 'legacy' | 'spaghetti'` is too global if multiple graph editors can be open at once

- one spaghetti floating editor
  - `AppShell` cannot keep treating spaghetti as one floating panel tied to one boolean/mode

- one global preview bridge
  - graph compile/build/preview memory cannot stay one shared path if several graph editors and graph documents are live

Minimum practical result for `SP - Phase 9`:

- more than one graph document can exist
- more than one graph editor surface can be open
- Browser can coordinate them
- focus follows user interaction
- preview/build ownership starts moving toward graph-local instead of app-global

Working implementation target:

- break the singletons enough to make multi-editor Browser foundations real
- do not wait for later phases to remove the core one-graph assumptions

#### [ ] Q8 - What is explicitly out of scope for `SP - Phase 9` so it does not sprawl into later Browser phases?

##### [30] 2026-03-08 15:24 - Q8 Scope Breakdown - Provisional `SP - Phase 9A / 9B / 9C` Split For Browser Foundations

High-confidence direction:

- `SP - Phase 9` is now broad enough that it helps to split it into provisional sub-phases before deciding final scope.
- This is not the final locked plan yet.
- It is a working breakdown so the user can decide what is necessary for the first real Browser foundation.

##### `SP - Phase 9A - Graph Document Core`

Main goal:
- define the graph document as a real app object

Core concerns:
- graph document shape
- graph document identity
- persisted authored graph/canvas truth
- save/load-ready document boundaries

Likely includes:
- empty graph documents are valid
- graph document ids, names, parent file ids, version fields
- authored graph/canvas state persistence rules

Likely does not need yet:
- final Browser UI
- reference asset management
- rich multi-window polish

##### `SP - Phase 9B - Multi-Editor Browser Foundation`

Main goal:
- break the one-graph / one-window assumption and establish Browser-coordinated editor ownership

Core concerns:
- multiple open graph editors
- focus follows user interaction
- Browser reflects focused/open graph state
- app shell stops assuming one spaghetti window

Likely includes:
- more than one graph editor surface can exist
- Browser can coordinate/focus them
- current singleton/mode assumptions are reduced enough for real multi-editor foundations

Likely does not need yet:
- final polished Browser UX
- complete per-item controls
- full viewer/reference workspace features

##### `SP - Phase 9C - Graph-Local Compile / Preview Preparation`

Main goal:
- prepare the compile/build/preview path so Browser foundations do not still collapse into one global graph/output bridge

Core concerns:
- graph-aware compile context
- graph-aware preview/build memory
- reducing app-global spaghetti preview assumptions

Likely includes:
- breaking one active spaghetti compile context
- moving toward graph-local preview/build ownership
- preparing the handoff into later `SP - Phase 10` and `AS` work

Likely does not need yet:
- final multi-object output system
- full assembly hierarchy
- later Browser-side viewer controls

Current read:

- `9A` looks the most foundational
- `9B` looks necessary if the first Browser foundation truly supports multiple open graph editors
- `9C` may be the bridge area where `SP - Phase 9` starts to overlap with `SP - Phase 10`

Next decision still needed:

- which of `9A / 9B / 9C` are truly required inside `SP - Phase 9`
- and which should stay deferred into the next canonical phase

### Session 2 - Future Feature Captures

##### [26] 2026-03-08 14:45 - Future Feature Capture - Copy/Paste Nodes And Wires Plus Undo/Redo

High-confidence future feature note:

- General graph-editing features such as copy/paste and undo/redo should be captured explicitly rather than left as assumed editor polish.

Current feature cluster to remember:

- copy selected nodes
- paste nodes back into the graph
- preserve or rebuild valid wire relationships on paste where possible
- `Ctrl+Z` undo
- `Ctrl+Y` redo

Current read:

- this is an important editor capability area
- but it is not the core ownership/document question of `SP - Phase 9`
- it should stay visible as a real future editor feature lane rather than getting lost

##### [28] 2026-03-08 15:12 - Future Feature / Architecture Note - Offset Mode, Control Viz Spheres, And Upstream Vs Downstream Driving

High-confidence future note:

- The current `offset mode` and future `control viz sphere` behavior will need a clearer shared model.
- This likely deserves its own later checklist because it mixes:
  - authored values
  - live control interaction
  - driver behavior
  - graph wiring direction

Captured use case from the session:

- a control-viz sphere on the end of a `ToeHook` may drive the `x` / `y` endpoint values of an arc
- in the graph, a control-viz sphere should probably become a real node or node-like driver object
- that means it likely needs outputs so its values can be wired into:
  - a baseplate input
  - or a baseplate driver

The harder interaction case:

- if a control-viz sphere is linked to a driver
- and the user edits the driver slider in the spaghetti graph
- the system needs a clear rule for whether that edit:
  - pushes back upstream into the control-viz source
  - or only adjusts the incoming driven value locally

Two candidate directions captured:

- `upstream / downstream toggle`
  - default driver behavior could be "drive upstream"
  - optional mode could switch to "drive downstream" and apply only a local offset to the incoming value

- `special control object`
  - control-viz sphere could emit a richer object rather than only a raw `vec2`
  - that object could carry:
    - the value
    - sync/authority metadata
  - downstream consumers could then decide whether they are editing the source or applying a local adjustment

Current recommendation:

- the cleaner first mental model is probably:
  - source control nodes own the source value
  - downstream driver rows may optionally apply local offset/adjustment
  - avoid two-way mutation by default unless the UI makes the authority direction explicit

Current read:

- this is a real future control/value-system question
- it should stay visible as a feature/architecture note for later `DR` / `SP` planning
- it should not be solved ad hoc inside `SP - Phase 9`

## Session 2 - planning batch 2 compilelog

### Session 2 Summary

This planning batch turned `SP - Phase 9` from a placeholder into a more concrete Browser-foundation phase.

The main outcomes were:
- `SP - Phase 9` got its own decision checklist
- the minimum graph-document model was defined
- persistence, focus, and multi-editor rules were clarified
- the phase was broken into provisional `9A / 9B / 9C` sub-phases

### Session 2 - Planning Batch Compile

1. `SP - Phase 9` was chosen as the active planning target.
   - the session focused on `Graph Document Foundations`
   - the goal was to define the minimum Browser-ready document model before deeper implementation

2. The minimum graph document shape was resolved.
   - a graph document may be valid even when empty
   - it still needs identity, graph structure, defaults, and an origin/reference-space concept

3. Authored truth versus viewer truth was clarified.
   - graph documents own authored/generate truth
   - viewer/Browser layers own `view on/off` and presentation state
   - the `Generate` versus `View` split was made explicit

4. The Browser-first target model was reaffirmed.
   - `SP - Phase 9` should be built against the future file/project -> multiple graph documents model
   - even if the first implementation is still only a partial Browser foundation

5. Graph-document identity was defined.
   - minimum day-one identity fields now include:
     - `graphDocumentId`
     - `name`
     - `parentFileId`
     - `version`
   - timestamps were marked as recommended if easy

6. Persistence scope was clarified.
   - graph documents should persist the authored canvas and build state
   - workspace/window/focus/viewer behavior stays transient
   - node positions, wires, param values, and build configuration belong in saved graph truth

7. Multi-editor focus behavior was resolved.
   - more than one graph editor may be open
   - focus should follow the editor window the user actively clicks into
   - the Browser should reflect that focus

8. The real single-graph seams were identified.
   - the one-global-graph assumptions were traced mainly to:
     - `AppShell`
     - `useAppStore`
     - `useSpaghettiStore`
     - the compile/build/preview bridge
   - `SP - Phase 9` was then explicitly locked as needing to break:
     - one global graph
     - one spaghetti window
     - one global preview path

9. `SP - Phase 9` was broken into provisional sub-phases.
   - `9A` = graph document core
   - `9B` = multi-editor Browser foundation
   - `9C` = graph-local compile / preview preparation
   - these are still provisional and help decide scope rather than locking the final canonical phase split yet

10. Additional future feature notes were captured.
    - copy/paste nodes and wires plus undo/redo
    - offset mode, control-viz spheres, and upstream vs downstream driving

### Session 2 - Main Decisions Captured

- `SP - Phase 9` is a real Browser-foundation phase, not just editor cleanup.
- graph documents own authored/generate truth.
- viewer/Browser layers own view/presentation truth.
- graph docs should persist authored canvas/build state.
- multiple graph editors should be able to exist in the first real Browser foundation.
- `SP - Phase 9` must break the one-graph / one-window / one-preview assumptions.

### Session 2 - Hand-off Into Session 3

Session 3 should continue from:
- `GE - Phase 11 - Graph Persistence And Save Load`
- real save/load/cached-graph questions
- how persistence implementation should connect to the graph-document contract already defined in Session 2

## Session 3 Notes

## `Achievement 3` - [31] 2026-03-08 - `GE - Phase 11` Planning Start

### 2026-03-08 15:32 - Session 3 Focus - What We Need To Achieve `GE - Phase 11`

High-confidence starting direction:

- `GE - Phase 11 - Graph Persistence And Save Load` should implement the persistence system that `SP - Phase 9` has now defined by contract.
- This is where save/load and cached-graph behavior become real system behavior instead of only planning language.

Working scope:

- define the persisted graph-document contract in implementation terms
- define save and load flows
- define cached graph behavior
- connect graph persistence to the Browser/document direction without pulling in all later Browser UI work

### [0] 2026-03-08 15:32 - Current Decision Checklist - `GE - Phase 11 - Graph Persistence And Save Load`

#### Decision checlist Notes

- Use this as the active Session 3 checklist for `GE - Phase 11`.
- Keep the same revision pattern from earlier sessions:
  - old question can stay as `[~]`
  - stronger replacement can become `QN.1`
- Use `update QN` as the one-shot command if a question needs to be revised later.
- Keep substantive note numbering absolute from the earlier body entries.
- The next substantive entry after this checklist setup should continue from `[32]`.

#### Question Explinations

##### Q1 - `What file/object actually gets saved and loaded in GE - Phase 11?`
Humanized summary:
- before we implement persistence, we need to decide what the save/load unit actually is

##### Q2 - `How should cached graphs relate to saved graph documents?`
Humanized summary:
- we need to decide whether cached graphs are just convenience snapshots or part of the real persistence model

##### Q3 - `What persistence format and boundaries should GE - Phase 11 own?`
Humanized summary:
- we need to define what GE 11 is actually responsible for saving, loading, and validating

##### Q4 - `What should happen when a saved graph document is opened back into the app?`
Humanized summary:
- we need to define what a load operation restores and what it leaves as transient app state

##### Q5 - `How should save/load interact with multiple open graph editors and Browser state?`
Humanized summary:
- persistence needs a clean rule once more than one graph editor can exist

##### Q6 - `What is out of scope for GE - Phase 11 so persistence work does not sprawl into later Browser features?`
Humanized summary:
- we need to keep GE 11 focused on persistence instead of accidentally turning it into all of Browser

#### Decision 3 Checlist

Use this as the next concrete decision block.

- [x] Q1 - What file/object actually gets saved and loaded in `GE - Phase 11`?
- [x] Q2 - How should cached graphs relate to saved graph documents?
- [x] Q3 - What persistence format and boundaries should `GE - Phase 11` own?
- [x] Q4 - What should happen when a saved graph document is opened back into the app?
- [x] Q5 - How should save/load interact with multiple open graph editors and Browser state?
- [ ] Q6 - What is out of scope for `GE - Phase 11` so persistence work does not sprawl into later Browser features?

#### [x] Q1 - What file/object actually gets saved and loaded in `GE - Phase 11`?

##### [32] 2026-03-08 15:40 - Resolved Q1 - Saved And Loaded Objects Should Be Cached Graph Documents Owned By The Browse

High-confidence conclusion:

- The spaghetti graph editor should save and load a graph document that contains the nodes, wires, positions, and authored graph state needed to recreate that graph.
- In the current planning language, this acts like a `cached model`.

Working model:

- one saved/loadable unit = one cached graph document
- that cached graph document stores:
  - nodes
  - node locations
  - wire connections
  - authored param/build state

Browser ownership direction:

- the Browser should own the list of graph documents
- the Browser should decide which graphs are currently loaded/cached and available
- the user can switch between them from a loaded cached-model dropdown/list surface

Important implication:

- `GE - Phase 11` is not only "save one hidden active graph"
- it needs to support a Browser-owned collection of graph documents, even if the first implementation is still simple

Current read:

- this fits the earlier Session 2 rule that one file/project can own multiple graph documents
- and it gives `GE - Phase 11` a concrete saved/loadable object to implement

#### [x] Q2 - How should cached graphs relate to saved graph documents?

##### [33] 2026-03-08 15:48 - Resolved Q2 - Cached Graphs Are Live Loaded Editor Instances Of Saved Graph Documents

High-confidence conclusion:

- A saved graph document is the durable Browser-owned record.
- A cached graph is the live loaded working instance of that saved graph document inside the spaghetti editor layer.

Working relationship:

- Browser owns the saved graph documents
- opening one creates or restores a cached live graph in the editor layer
- if a saved graph is not currently live, the user can click it from:
  - `Browser > File > graph list`
- that action should create a new live editor instance with that graph loaded

Convenience behavior captured from the session:

- if there is a saved graph that is not currently live/cached
- the Browser can expose a convenience action to load it into a new graph editor instance

Useful practical rule:

- saved graph document = durable truth
- cached graph = open working copy in the editor

Possible later refinement:

- if the graph is already live, the Browser may later:
  - focus the existing editor
  - or explicitly open another view if the user asks for a second live window

#### [x] Q3 - What persistence format and boundaries should `GE - Phase 11` own?

##### [36] 2026-03-08 16:10 - Resolved Q3 - `GE - Phase 11` Should Own Graph-Document Persistence, While Project Files And Export Files Stay Separate Layers

High-confidence conclusion:

- `GE - Phase 11` should own persistence for graph documents.
- The project-level file and the export file formats should stay separate layers rather than being collapsed into one persistence system.

Working three-file split from the session:

- `Project File`
  - Browser / project level
  - higher-level container for the user’s app/project content

- `Spaghetti File`
  - graph level
  - versioned persisted graph document with authored graph/canvas/build state

- `.stl` / `.step`
  - export/output level
  - generated when the user clicks an object or assembly in the Browser and exports it

Recommended persistence format for `GE - Phase 11`:

- start with a versioned, schema-validated JSON graph-document format
- keep it focused on one graph document and its authored state

Recommended boundary:

- `GE - Phase 11` owns:
  - graph-document save/load
  - graph-document validation on load
  - graph-document schema versioning
  - cached-graph restore flow

- `GE - Phase 11` does not need to own yet:
  - full project-file persistence
  - final Browser recursive tree persistence
  - viewer/workspace persistence
  - export file generation beyond respecting that exports are separate output artifacts

Current read:

- this keeps persistence clean
- it also matches the earlier rule that graph documents are the saved/loadable unit for the spaghetti editor, while project files and export files are neighboring but separate layers

#### [x] Q4 - What should happen when a saved graph document is opened back into the app?

##### [37] 2026-03-08 16:18 - Q4 Clarification - The Browser Owns Cached Graphs, While Spaghetti Editors Act Like Graph Viewports

High-confidence clarification:

- A graph does not need to be currently open in a spaghetti editor to remain active in the project.
- The Browser owns the cached/saved graph entries.
- A spaghetti editor window is better understood as a viewport into one graph at a time.

Important UI rule captured from the session:

- the second `Spaghetti Editor` string in the current editor header should likely become a dropdown
- that dropdown should let the user swap which cached graph that specific editor viewport is showing

Resulting model:

- `Browser`
  - owns cached/saved graph entries
  - determines project-level graph availability/activity

- `Spaghetti Editor`
  - views/edits one graph at a time
  - can swap which graph it is showing through a dropdown
  - can be popped out into another browser window

Two routes for graph loading:

- graph already cached in the app
  - user swaps to it from the editor dropdown
  - or opens another editor viewport and points that viewport at it

- graph loaded from the user’s computer
  - user opens/imports a `.json` graph file
  - that creates a new cached graph entry in the Browser
  - then editor viewports can switch to show it

Important state distinction:

- `cached in Browser`
- `active in project`
- `currently visible in a specific spaghetti editor viewport`

Current read:

- this is a much cleaner model than treating "open in editor" and "active in project" as the same thing
- it should help keep `Q4` behavior and later Browser/editor UX more coherent

##### [38] 2026-03-08 16:24 - Resolved Q4 - Opening A Saved Graph Should Create Or Focus A Cached Browser Entry, While Import Remains A Separate Merge Action

High-confidence conclusion:

- Opening a saved graph document should create or focus a cached graph entry owned by the Browser.
- A spaghetti editor should then show that cached graph by selecting it in the editor viewport.

Resolved behavior:

- if the saved graph is not currently cached/live
  - opening it creates a cached Browser entry
  - that graph can then be shown in a spaghetti editor viewport

- if the saved graph is already cached/live
  - opening it should usually focus the existing cached graph/editor view rather than creating accidental duplicates
  - a later explicit action can still allow opening a second viewport onto the same graph if desired

- if the user wants the saved graph contents merged into the current graph
  - that should stay a separate `Import Into Current Graph` action
  - imported nodes should be offset and selected for easy repositioning

Important distinction:

- `Open Graph`
  - opens a saved graph as its own graph document/cached Browser entry

- `Import Into Current Graph`
  - merges saved graph contents into the graph already being edited

Current rule:

- Browser owns cached graph entries
- spaghetti editors behave like graph viewports
- opening a saved graph affects Browser/editor state
- importing a saved graph affects current graph content

#### [x] Q5 - How should save/load interact with multiple open graph editors and Browser state?

##### [39] 2026-03-08 16:34 - Resolved Q5 - Save/Load Should Separate Merge Behavior From New-Graph Behavior, While Browser Keeps Graph Activity Independent From Editor View

High-confidence conclusion:

- Save/load behavior should not be treated as one vague action.
- It should distinguish between:
  - merging content into the current graph
  - opening a saved graph as a new graph

Resolved load flow for `.json` graph files:

- when the user loads a `.json` graph file, give two main options:
  - `Merge Into Current Graph`
  - `Load Into New Graph`

- `Merge Into Current Graph`
  - import the spaghetti file contents into the graph currently being edited
  - place imported content with an offset to reduce overlap
  - auto-select the imported nodes so the user can reposition them easily

- `Load Into New Graph`
  - create a new cached graph entry in the Browser
  - then allow:
    - `Open In New Spaghetti Editor`
    - `Swap Current Spaghetti Editor`

Important Browser/editor rule:

- if Editor 1 is currently viewing `Graph A`
- and the user swaps that editor to `Graph B`
- `Graph A` does not turn off
- `Graph A` remains in the Browser
- graph activity should stay Browser-owned rather than being tied to which editor is currently viewing it

Useful Browser behavior captured from the session:

- a quick eyeball icon should likely sit to the left of the graph name in Browser
- that eyeball can toggle whether the graph is active/visible in the model/viewer

Working distinction:

- Browser controls graph activity
- spaghetti editors control which graph a viewport is currently showing
- load/import actions decide whether content is merged into the current graph or opened as its own graph entry

Current recommendation:

- keep this interaction model explicit in later Browser/editor UI work
- avoid collapsing `merge`, `open`, `swap`, and `graph active/inactive` into one overloaded "load" behavior

#### [ ] Q6 - What is out of scope for `GE - Phase 11` so persistence work does not sprawl into later Browser features?

##### [40] 2026-03-08 16:42 - Q6 Scope Breakdown - Provisional `GE - Phase 11A / 11B / 11C` Split For Persistence

High-confidence recommendation:

- `GE - Phase 11` should stay focused on graph-document persistence and the minimum Browser/editor coordination needed to make that persistence usable.
- It should not sprawl into full project persistence, full Browser UX, or export/output systems.

##### `GE - Phase 11A - Graph Document Persistence Core`

Main goal:
- implement the real save/load contract for one graph document

Core concerns:
- versioned graph-document format
- schema validation on load
- save graph document
- load graph document

Likely includes:
- graph-level JSON persistence
- graph-document validation
- save/load entry points

Likely does not need yet:
- full project-file persistence
- assembly-tree persistence
- export formats

##### `GE - Phase 11B - Cached Graph Lifecycle`

Main goal:
- make cached graph entries behave like a real Browser-owned persistence layer

Core concerns:
- saved graph document versus cached live graph instance
- load saved graph into Browser cache
- reopen/focus cached graphs
- keep cached graph identity stable enough for editor switching

Likely includes:
- cached graph restore flow
- Browser-owned loaded graph entries
- simple reopen/focus behavior

Likely does not need yet:
- final multi-window polish
- full duplicate-view workflows
- rich Browser item actions

##### `GE - Phase 11C - Save/Load Interaction With Editors`

Main goal:
- define how persistence actions affect active editor viewports without turning `GE - Phase 11` into all of Browser

Core concerns:
- save current graph from current editor
- load graph as new graph
- merge/import graph into current graph
- swap current editor versus open in new editor

Likely includes:
- explicit save/load/import action boundaries
- Browser/editor coordination rules
- minimal multi-editor persistence behavior

Likely does not need yet:
- final Browser dropdown/header polish
- complete graph activity controls
- later graph-local preview/output UX

Recommended out-of-scope list for `GE - Phase 11`:

- full project-file persistence
- recursive assembly-tree persistence
- `.stl` / `.step` export behavior
- viewer camera/workspace persistence
- full Browser polish and rich per-item controls
- later material/reference/sub-part systems

Current read:

- `11A` looks essential
- `11B` also looks essential because cached graph behavior is part of the persistence story now
- `11C` is likely necessary at a minimum interaction level so save/load does not fight the multi-editor Browser model

## Session 3 - planning batch 3 compilelog

### Session 3 Summary

This planning batch turned `GE - Phase 11` from a broad persistence idea into a clearer graph-level save/load phase.

The main outcomes were:
- the saved/loadable unit was locked as the graph-level spaghetti file
- cached graphs were defined as live Browser-owned editor instances
- save/load behavior was separated from import/merge behavior
- `GE - Phase 11` was broken into provisional `11A / 11B / 11C` sub-phases

### Session 3 - Planning Batch Compile

1. `GE - Phase 11` was established as the implementation-side persistence phase.
   - `SP - Phase 9` defined the graph-document contract
   - `GE - Phase 11` is where that contract becomes a real save/load system

2. The saved/loadable object was resolved.
   - one graph-level spaghetti file is the save/load unit for this phase
   - Browser owns the higher-level collection of those graph documents

3. Cached graph behavior was clarified.
   - saved graph documents are the durable truth
   - cached graphs are live loaded editor instances owned/coordinated by the Browser
   - Browser can create/focus cached entries from saved graph documents

4. Persistence boundaries were tightened.
   - `GE - Phase 11` owns graph-document persistence
   - project-file persistence stays separate
   - export files like `.stl` / `.step` stay separate

5. Open/load/import behavior was clarified.
   - opening a saved graph creates or focuses a cached Browser entry
   - importing a saved graph into the current graph remains a separate merge action

6. Multi-editor save/load behavior was clarified.
   - load `.json` should distinguish:
     - `Merge Into Current Graph`
     - `Load Into New Graph`
   - `Load Into New Graph` then branches into:
     - `Open In New Spaghetti Editor`
     - `Swap Current Spaghetti Editor`
   - Browser keeps graph activity independent from which editor viewport is currently showing the graph

7. Browser structure was clarified further during the persistence pass.
   - `Project File` should likely own a recursive assembly tree
   - later `sub-parts` were captured as a derived split layer under parts

8. `GE - Phase 11` was broken into provisional sub-phases.
   - `11A` = graph document persistence core
   - `11B` = cached graph lifecycle
   - `11C` = save/load interaction with editors

### Session 3 - Main Decisions Captured

- graph-level spaghetti files are the save/load focus of `GE - Phase 11`
- cached graphs are live editor instances of saved graph documents
- Browser owns graph entries and activity state
- spaghetti editors behave like graph viewports
- open/import/merge/swap are separate actions and should stay explicit

### Session 3 - Hand-off Into Session 4

Session 4 should continue from:
- `SP - Phase 10 - Graph Aware Worker And Preview Routing`
- graph-local compile/build memory
- graph-aware preview ownership
- how Browser/multi-graph foundations connect to worker/preview behavior

## Session 4 Notes

## `Achievement 4` - [41] 2026-03-08 - `SP - Phase 10` Planning Start

### 2026-03-08 16:52 - Session 4 Focus - What We Need To Achieve `SP - Phase 10`

High-confidence starting direction:

- `SP - Phase 10 - Graph Aware Worker And Preview Routing` should be the bridge from Browser/document foundations into graph-local compile/build/preview behavior.
- This phase should make the current spaghetti compile/build path stop behaving like one global preview bridge.

Working scope:

- define graph-aware compile/build context
- define graph-local preview ownership
- define how worker/build memory should behave once multiple graphs can exist
- define what part of current preview/output behavior moves here versus later `AS` work

### [0] 2026-03-08 16:52 - Current Decision Checklist - `SP - Phase 10 - Graph Aware Worker And Preview Routing`

#### Decision checlist Notes

- Use this as the active Session 4 checklist for `SP - Phase 10`.
- Keep the same revision pattern from earlier sessions:
  - old question can stay as `[~]`
  - stronger replacement can become `QN.1`
- Use `update QN` as the one-shot command if a question needs to be revised later.
- Keep substantive note numbering absolute from the earlier body entries.
- The next substantive entry after this checklist setup should continue from `[42]`.

#### Question Explinations

##### Q1 - `What is the minimum graph identity that must travel with a compile/build request?`
Humanized summary:
- before the worker/preview path can be graph-aware, we need to know what graph identity each request carries

##### Q2 - `What preview state should become graph-local in SP - Phase 10?`
Humanized summary:
- we need to decide what preview/output memory stops being global and starts belonging to each graph

##### Q3 - `How should multiple graph builds coexist without overwriting each other?`
Humanized summary:
- if more than one graph can build, we need a rule for keeping their build/preview results separate

##### Q4 - `What should still remain app-global even after worker/preview routing becomes graph-aware?`
Humanized summary:
- not everything has to become graph-local, so we need to define the remaining global layer too

##### Q5 - `How should OutputPreview relate to graph-local preview routing in this phase?`
This asks:
- how the existing `OutputPreview` concept should behave once preview/build memory becomes graph-local
- whether each graph should own its own preview/output bucket, slot system, or preview owner during this phase

Why it matters:
- we already decided `OutputPreview` is graph-local in principle
- `SP - Phase 10` is where that principle needs to turn into real routing behavior instead of one shared preview path

Humanized summary:
- we already decided OutputPreview is graph-local, so this phase needs to define how that actually starts working

##### Q6 - `What current single-preview assumptions must be removed for SP - Phase 10 to count as real?`
Humanized summary:
- we need to identify the exact preview/build seams that still assume one active graph/output path

##### Q7 - `What belongs in SP - Phase 10 versus later AS work?`
Humanized summary:
- we need to keep this phase focused on routing and ownership, not let it absorb all later output-structure work

#### Decision 4 Checlist

Use this as the next concrete decision block.

- [x] Q1 - What is the minimum graph identity that must travel with a compile/build request?
- [x] Q2 - What preview state should become graph-local in `SP - Phase 10`?
- [x] Q3 - How should multiple graph builds coexist without overwriting each other?
- [x] Q4 - What should still remain app-global even after worker/preview routing becomes graph-aware?
- [x] Q5 - How should `OutputPreview` relate to graph-local preview routing in this phase?
- [x] Q6 - What current single-preview assumptions must be removed for `SP - Phase 10` to count as real?
- [x] Q7 - What belongs in `SP - Phase 10` versus later `AS` work?

#### [x] Q1 - What is the minimum graph identity that must travel with a compile/build request?

##### [42] 2026-03-08 17:02 - Resolved Q1 - Compile/Build Requests Should Carry Layered Project And Graph Identity, With Build Sequence For Stale-Drop Safety

High-confidence conclusion:

- Build/compile requests should use layered ids rather than one overloaded id.
- The minimum routing identity should be enough to tie each request and result back to the correct graph inside the larger Browser/project structure.

Recommended layered ids in the bigger model:

- `projectFileId`
- `graphDocumentId`
- `assemblyId`
- `objectId`
- `partId`

Minimum ids that should travel with a compile/build request:

- `projectFileId`
- `graphDocumentId`
- `buildSeq` or `buildRequestId`

Why this is the recommended minimum:

- `graphDocumentId`
  - identifies which graph owns the request
- `projectFileId`
  - keeps the request grounded inside the larger Browser/project tree
- `buildSeq` / `buildRequestId`
  - lets the app drop stale results safely

Recommended id strategy:

- use machine-safe internal ids for truth
  - example:
    - `pf_001`
    - `gd_014`
    - `as_002`
    - `ob_019`
    - `pt_044`

- keep human-readable names separate for UI
  - example:
    - `ParaHook Project`
    - `Baseplate Graph`
    - `ToeHook Graph`

Current read:

- build requests do not need to carry every Browser-tree id at first
- but they do need enough identity to stop multi-graph compile/build routing from collapsing back into one global path

#### [x] Q2 - What preview state should become graph-local in `SP - Phase 10`?

##### [43] 2026-03-08 17:08 - Q2 Direction - Graph-Local Preview State Should Mean "What This Graph Built And What Preview Memory Belongs To It"

High-confidence current recommendation:

- Anything that answers "what did this graph build?" or "what preview/build memory belongs to this graph?" should become graph-local.

Suggested graph-local preview state:

- last compile result for that graph
- previous build inputs for that graph
- pending changed params for that graph
- pending stats/part keys for that graph
- pending instance data for that graph
- preview/output payloads for that graph
- graph-owned parts/object preview mapping
- graph-local `OutputPreview` state

Current practical read from the app:

- several of these things are currently still too global in `useAppStore`
- examples include:
  - `spaghettiLastCompile`
  - `spaghettiPendingChangedParamIds`
  - `spaghettiPendingStatsPartKeys`
  - `spaghettiPendingInstances`
  - `spaghettiPreviousBuildInputs`

What should probably stay outside graph-local preview state:

- viewer camera
- Browser expansion/collapse state
- editor window placement
- app-wide tool/panel state

Humanized summary:

- each graph should remember its own build/preview memory instead of sharing one global spaghetti preview path

Current read:

- this is a recommendation note, not a fully locked resolution yet
- it should be refined after comparing it to the legacy feature the user wants to bring in next

##### [44] 2026-03-08 17:18 - Resolved Q2 - The Graph Owns Its Build/Compile Memory, While Editors Stay As Viewports And Build Controls Stay Separate From View Controls

High-confidence conclusion:

- The `graph` should own its own last compile/build results and related preview/build memory.
- The spaghetti editor is not the owner of that state.
- The spaghetti editor is a viewport into the graph.

Working ownership clarification:

- `graph`
  - owns compile/build memory
  - owns last compile results
  - lives in the Browser or inside a larger assembly/project structure

- `spaghetti editor`
  - views/edits one graph at a time
  - does not own the graph's build memory

Important build-versus-view rule captured from the session:

- the app needs a stronger separation between:
  - `building`
  - `viewing`

Why this matters:

- the user may want to control which assemblies, child assemblies, graphs, objects, and parts are actually built
- the user may separately want to control whether those built results are visible in the viewer
- those should not collapse into one toggle

Legacy-feature direction captured:

- the Browser may later show build bars per part/object so the user can see build cost/progress
- the user should be able to:
  - pause auto rebuild
  - control auto rebuild per relevant scope
  - turn off viewer visibility separately

Default QoL rule:

- by default, the app auto-rebuilds everything
- that remains true until the user starts intentionally deactivating assemblies, child assemblies, graphs, objects, or parts

Current rule:

- graph owns build/compile memory
- viewer owns view state
- Browser is the likely place where build controls and visibility controls become legible together later

#### Session 4 - Future Feature Captures
##### [45] 2026-03-08 17:18 - Future Feature / Architecture Note - Build Controls, Build Bars, And Build-Vs-View Separation

High-confidence future note:

- The app will likely need a real build-control surface, not just viewer visibility controls.

Captured future direction:

- show build bars for every part of an object
- likely surface that information in the Browser
- let the user decide what parts to build and what parts not to build
- support pausing or reducing auto rebuild behavior where needed

Why this matters:

- building too many complicated parts is expensive in Replicad
- the user needs control over what gets built, not only what gets shown

Working distinction:

- `build on/off` or rebuild control
  - production/build truth
- `view on/off`
  - viewer truth

Current read:

- this is not fully a `SP - Phase 10` scope item by itself
- but it is an important later Browser/output-control feature that should stay visible in planning

##### [49] 2026-03-08 17:56 - Future Output Note - Graph Outputs May Later Need To Publish More Than Solids

High-confidence future note:

- Later graph outputs may need to expose more than only `solids`.

Possible future output kinds captured from the session:

- `points`
- `lines`
- `closed lines`
- `filled / closed shape` style outputs
- `solids`

Why this matters:

- the current graph-output thinking is centered mostly on solids and object/assembly outputs
- but later non-solid output types could still be valuable for:
  - visualization
  - helper geometry
  - guide geometry
  - richer graph-output workflows

Implementation note:

- Replicad may or may not support all of these output kinds directly
- later, some of them may be rendered through Three.js even if they are not exportable in the same way as solids

Current recommendation:

- keep the current graph-output model broad enough that later output kinds do not feel architecturally illegal
- but do not force non-solid output support into the current `SP - Phase 10` scope

#### [x] Q3 - How should multiple graph builds coexist without overwriting each other?

##### [46] 2026-03-08 17:30 - Resolved Q3 - Multiple Graph Builds Should Be Isolated Per Graph And Per Build Sequence, With Per-Part Build Progress Inside Each Graph

High-confidence conclusion:

- Multiple graph builds should coexist by isolating build state per graph and per build sequence.
- Browser ownership alone is not enough; the build system still needs graph and sequence identity so results do not overwrite each other.

Working rule:

- each graph owns its own build/compile memory
- each build request carries graph identity plus `buildSeq` / request identity
- stale or wrong-graph results should not overwrite another graph's state

Important extension from the session:

- each graph may also need per-part or per-object build tracking inside that graph
- parts may build separately before any later mesh/assembly step
- the assembled/meshed result may happen later or conditionally rather than on every request

Why this matters:

- Replicad can behave better when parts are built separately instead of always meshing everything immediately
- the user wants detailed build control and clearer build feedback

Legacy build-stats direction captured:

- Browser/build surfaces may later show progress bars per part/object such as:
  - `Baseplate`
  - `Heel Kick`
  - `Toe Hook`
  - `Assembled`

Current recommendation:

- isolate build state by:
  - `graphDocumentId`
  - `buildSeq` / `buildRequestId`
- also allow graph-local build progress to track individual parts/objects within that graph

Current read:

- this is the stronger real answer to Q3
- it supports both multi-graph coexistence and later fine-grained build-control features

#### [x] Q4 - What should still remain app-global even after worker/preview routing becomes graph-aware?

##### [47] 2026-03-08 17:44 - Resolved Q4 - Use A Three-Layer Ownership Split: App-Global, Project-Local, And Graph-Local

High-confidence conclusion:

- Even after worker/preview routing becomes graph-aware, the app should still keep a meaningful app-global layer.
- The cleanest model is not only `app-global` versus `graph-local`.
- It is a three-layer split:
  - `app-global`
  - `project-local`
  - `graph-local`

Agreed app-global layer:

- main viewer scene shell
- camera state
- global rendering prefs
- global toolbar/tool mode state
- Browser panel shell/state
- window/workspace management
- which editor window is focused
- shared keyboard shortcuts / command routing
- app-wide worker service lifecycle
- app-wide theme / layout prefs

Recommended middle layer:

- `project-local`
  - the project file's collection of graph documents
  - project-level assembly tree
  - which graphs are cached in that project
  - project-level graph active/inactive state

Graph-local layer:

- what this graph built
- graph compile/build memory
- graph-local preview/output memory
- graph-owned output state

Working rule:

- `app-global`
  - shared workspace, shared viewer shell, shared Browser shell, shared app services
- `project-local`
  - project-file ownership and Browser-managed graph collection/activity
- `graph-local`
  - what this graph built and what preview/build state belongs to it

Later note:

- there may eventually be richer app-global `workspaces` that reconfigure the shared shell differently
- but that is not important work for this phase

#### [x] Q5 - How should `OutputPreview` relate to graph-local preview routing in this phase?

##### [48] 2026-03-08 17:52 - Resolved Q5 - `OutputPreview` Should Act As The Graph's Output Declaration / Handoff Surface, And May Later Be Renamed

High-confidence conclusion:

- `OutputPreview` should not be thought of only as a visual preview widget.
- In `SP - Phase 10`, it should act as the graph-local surface that declares what this graph is outputting upward.

Working meaning:

- nodes produce values, solids, and object-worthy results
- the graph-local output surface collects/exposes the outputs this graph wants to publish
- the graph owns those outputs
- the Browser reads those graph-owned outputs as `objects` / `assemblies`

Why this matters:

- this is the handoff point between:
  - graph internals
  - graph-owned outputs
  - Browser-visible project content
- so `OutputPreview` is really part of output declaration and routing, not just part of preview UI

Current naming note:

- the current name `OutputPreview` may now be too narrow
- later better names could be:
  - `Graph Output`
  - `Spaghetti Output`

Current rule:

- each graph should have its own output declaration/handoff surface
- that surface is how graph-local routing becomes Browser/project-visible output structure

#### [x] Q6 - What current single-preview assumptions must be removed for `SP - Phase 10` to count as real?

##### [50] 2026-03-08 18:06 - Resolved Q6 - `SP - Phase 10` Must Break The One-Preview, One-Assembled-Result, One-Seq, And One-Graph Memory Assumptions

High-confidence conclusion:

- `SP - Phase 10` is not real unless it breaks the current assumptions that preview/build routing still collapses into one global active graph/output path.

Main current single-preview assumptions found in the code:

- one global preview/output bucket
  - `useAppStore` still holds one shared `parts` and one shared `partsVisibility`

- one global assembled result
  - `useAppStore` still holds one shared `assembled` and `assembledSignature`

- one global spaghetti compile/build memory path
  - `spaghettiLastCompile`
  - `spaghettiPreviousBuildInputs`
  - pending spaghetti build fields

- one global viewer render path
  - `ViewerHost` still reads one current `parts` / `assembled` path and one singleton spaghetti graph

- one global dispatcher stale-drop path
  - `BuildDispatcher` still uses one global `seqCounter`, `latestRequestedSeq`, `latestResolvedSeq`, and assembled cache state

- one worker stale-drop memory path
  - `worker.ts` still keeps one global `currentSeq`

Important implementation reading:

- the biggest practical seams are currently in:
  - `src/app/components/ViewerHost.tsx`
  - `src/app/bootstrapBuildWiring.ts`
  - `src/app/buildDispatcher.ts`
  - `src/app/store/useAppStore.ts`
  - `src/worker/worker.ts`

What can still stay shared for now:

- one app shell
- one viewer shell
- one Browser shell
- one worker service lifecycle

Working target for `SP - Phase 10`:

- keep one app and one worker service
- but move compile/build/preview memory toward graph-local ownership
- stop treating one current graph's results as the only preview/build truth in the app

#### [x] Q7 - What belongs in `SP - Phase 10` versus later `AS` work?

##### [51] 2026-03-08 18:14 - Q7 Recommendation - `SP - Phase 10` Should Own Routing And Graph-Local Preview Memory, While `AS` Should Own Output Structure And Browser-Facing Output Hierarchy

High-confidence recommendation:

- `SP - Phase 10` should stay focused on routing and ownership.
- Later `AS` work should own the richer output structure that sits on top of that routing.

Recommended `SP - Phase 10` scope:

- graph-aware compile/build identity
- graph-local compile/build memory
- graph-local preview/output routing
- graph-local output declaration/handoff surface
- breaking one-preview / one-assembled / one-global-result assumptions

Recommended later `AS` scope:

- richer `object` / `assembly` output structure
- Browser-facing nesting of graph outputs
- stronger preview inspection surfaces
- output organization beyond the minimal graph-local routing layer
- later part/sub-part output hierarchy work

Why this split is useful:

- `SP - Phase 10` should answer:
  - how results get routed correctly per graph
  - how preview/build memory stops being global

- `AS` should answer:
  - what those routed outputs are structurally
  - how the Browser/project tree should present them
  - how object/assembly/part relationships become legible

Current read:

- if `SP - Phase 10` starts trying to finish object/assembly/sub-part hierarchy too, it will sprawl
- the cleaner phase boundary is:
  - `SP 10` = routing and ownership
  - `AS` = output structure and inspection

##### [52] 2026-03-08 18:20 - Resolved Q7 - `SP - Phase 10` Should Stop At Routing, Graph-Local Preview Memory, And Output Handoff, With `10A / 10B / 10C` As The Working Split

Locked direction:

- `SP - Phase 10` should own the routing and ownership layer.
- Later `AS` work should own the richer output structure and Browser-facing hierarchy that sits on top of that layer.

Working `SP - Phase 10` split:

- `10A - Graph-Aware Build Identity And Routing`
  - carry graph identity with compile/build requests
  - isolate build state per graph and per build sequence
  - prevent stale or wrong-graph results from overwriting another graph
- `10B - Graph-Local Preview And Build Memory`
  - move compile/build/preview memory out of one shared spaghetti bucket
  - break one global preview/output bucket assumptions
  - keep `app-global`, `project-local`, and `graph-local` ownership clean
- `10C - Graph Output Handoff Surface`
  - treat the current `OutputPreview` concept as the graph's output declaration/handoff surface
  - hand graph-owned outputs upward toward Browser/project visibility
  - stop short of later full object/assembly/sub-part hierarchy work

Phase boundary rule:

- `SP - Phase 10`
  - graph-aware request/result routing
  - graph-local build memory
  - graph-local preview memory
  - graph output declaration / handoff
- later `AS`
  - richer `object` / `assembly` output structure
  - Browser-facing nesting and inspection
  - later `part` / `sub-part` hierarchy work


High-confidence later idea:

- `sub-parts` make sense as a later manufacturing/material split layer under a `part`.
- They do not need to become a separate top-level Browser concept first.

Captured future workflow:

- the user has a full `Solid` wire output
- the user feeds that solid into a later `sub-part split` node
- that node helps slice the part into internal `sub-parts`
- but it still returns one full solid/object that is ready to keep moving through the graph

Why this is useful:

- the object can stay one graph/output object
- but internally it can contain:
  - `Part A`
  - `Part B`
  - `Part C`
    - `Sub-Part C1`
    - `Sub-Part C2`

Working meaning:

- sub-parts are probably best treated as internal nested children under parts
- this supports:
  - material assignment
  - multi-color print planning
  - sliced/zebra-like print segmentation

Current recommendation:

- keep `sub-parts` as a later Browser/output-structure extension
- do not force them into the first Browser foundation pass
- treat them as a derived split layer that can still move through graph/object combination as one higher-level solid/object result
