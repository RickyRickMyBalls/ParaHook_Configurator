# Codex Desktop Notes

## Doc Header

### Doc History

11. 2026-04-19 14:20:05: Added `Codex-Notes-Entry-10` to capture the Dispatch 2 flat fleet design where the live Dispatcher coordinates Guide-Rail, Worker, and Explorer Codex agents, with Guide-Rail owning both phase prep and post-implementation coverage review.
10. 2026-04-19 13:24:23: Updated `Codex-Notes / Phase 1` Home Page pilot prep to record that `Home-Page-Index.md` was renamed and promoted into `Home-Page-Gen1-Index.md`, closing the temporary bridge-index decision while leaving future-doc naming as the next Home Page planning cleanup.
9. 2026-04-19 13:18:34: Added `Codex-Notes-Entry-9` to capture the stable generation HLG checklist rule: generation-local HLG sections should use `### Generation N HLG Checklist` with full HLG wording and checkbox status instead of bare covered-ID lists, so headings do not need to change when HLG complete.
8. 2026-04-19 12:55:25: Added `Codex-Notes-Entry-8` to capture the canonical Intake Receipt idea: one reusable receipt that classifies the level of user "yap", extracts HLG, links to the correct Vision, Generation Index, Family Phase, or implementation-phase file, and acts as temporary routing truth before canonical docs are updated.
7. 2026-04-19 12:44:18: Added `Codex-Notes-Entry-7` to capture the `Vision Rails` naming decision for generation sections in Vision Docs, preserving that generations should have a summary plus non-implementation guide rails for setting up the matching Generation Index Doc.
6. 2026-04-19 12:22:45: Implemented `Codex-Notes / Phase 1` by aligning `Architecture Setup.md` and Dispatch-1 around the official three-layer planning ladder, the cleaner Family Phase Doc filename convention, exact `### Phase N Implementation Spec` wording, and the next Home Page pilot task shape.
5. 2026-04-19 12:15:36: Added `Codex-Notes / Phase 1` as the first implementation-phase section for officializing the guide-rail structure after the Dispatch-1 update, covering the remaining setup docs, naming convention follow-through, Home Page pilot, and verification shape.
4. 2026-04-19 12:04:28: Tightened the Vision and Wishlist Organization around the clearer family-phase doc filename model, replacing the generic future-doc target with `Future/IdeaName-N - Family Phase Name.md` while preserving the note that existing repo files may still use the older `IdeaName_Phase IdeaName-N - ...` convention until migrated.
3. 2026-04-19 11:49:34: Reframed this note into the repo's normal planning-doc shape, extracting the user's prompts into HLG, adding an overall vision, adding wishlist organization, and treating each "write that down" moment as a top-level Codex note entry that can generate new HLG.
2. 2026-04-19 11:42:17: Expanded the temporary idea-to-implementation guide-rail note with the VS Code folding goal, the three-layer Vision/generation-index/future-family-phase-doc ownership model, phase-section summary and implementation-spec pattern, Catalog example, and the concrete docs that should be updated later to make the model official.
1. 2026-04-19 11:30:45: Created this temporary note from the Home Page planning conversation to capture the idea-to-implementation planning model.

### Purpose

This note captures the desired Codex planning guide rails for turning a human-level idea into Codex-actionable work.

Use it to preserve:
- the human idea before it is compressed
- the HLG that come from user prompts
- the file ladder that turns ideas into generations, family phases, implementation phases, and code
- the "write that down" note-entry pattern for future Codex Desktop planning moments

Do not use it as:
- the permanent architecture setup guide yet
- a replacement for family vision docs, generation indexes, or future phase docs
- a place to mark implementation complete

### Scope

This note covers the planning system itself.

It applies whether the idea is:
- small, such as fixing CSS on one button
- medium, such as adding ten related buttons
- large, such as adding a new Catalog workspace or adding Radio

The scale changes how many generations, family phases, and implementation phases are needed.

The core rule stays the same:
- preserve the human idea
- check it against the repo
- break it into small phases
- spec before building
- implement one phase at a time
- verify against the wishlist

## Vision

### Summary Vision

The Codex planning system should scale a human-level idea into verified repo work without losing the user's intent.

The system should let the user speak naturally, even if the idea is rough, small, medium, or very large. Codex should preserve the raw idea first, convert it into HLG, research the repo to understand what is possible, organize the work into the correct planning layer, and only then create small implementation phases.

The system should work like a funnel:

```text
Human idea
  -> Vision and HLG
  -> generation routing
  -> generation index doc
  -> family phases
  -> future family phase doc
  -> Codex-sized implementation phases
  -> implementation
  -> verification
  -> follow-on phase if the wishlist is not actually achieved
```

The file structure should be readable when folded in VS Code with `Ctrl+2`. Each file should reveal its own main list at the `##` level:

- Vision docs collapse to generations.
- Generation index docs collapse to family phases.
- Future family phase docs collapse to Codex-sized implementation phases.
- This Codex Desktop notes doc collapses to note entries that can generate new HLG.

The generic file ladder should be:

```text
IdeaName-Vision.md
IdeaName-GenN-Index.md
Future/IdeaName-N - Family Phase Name.md
```

Existing repo files may still use the older `Future/IdeaName_Phase IdeaName-N - Family Phase Name.md` convention until they are migrated.

### Human Level Goals

- [ ] `Codex-Notes-HLG-1` - The system should turn a human-level idea into a Codex action.
- [ ] `Codex-Notes-HLG-2` - The system should scale up and down from tiny fixes to medium feature batches to large workspace families.
- [ ] `Codex-Notes-HLG-3` - The system should preserve the raw human idea and wishlist before compressing it into Codex-level work.
- [ ] `Codex-Notes-HLG-4` - The system should make an idea understandable by checking it against the live repo before implementation.
- [ ] `Codex-Notes-HLG-5` - The system should break ideas into small phases that Codex can implement one at a time.
- [ ] `Codex-Notes-HLG-6` - The system should verify implemented work against the wishlist and create follow-on phases when something is not actually achieved.
- [ ] `Codex-Notes-HLG-7` - `IdeaName-Vision.md` should route the idea into generations.
- [ ] `Codex-Notes-HLG-8` - `IdeaName-GenN-Index.md` should route one generation into large family phases.
- [ ] `Codex-Notes-HLG-9` - `Future/IdeaName-N - Family Phase Name.md` should route one family phase into Codex-sized implementation phases.
- [ ] `Codex-Notes-HLG-10` - Each planning file should use predictable `##` sections so folding in VS Code shows the main work list.
- [ ] `Codex-Notes-HLG-11` - Each future family phase doc implementation phase should include a summary and implementation spec.
- [ ] `Codex-Notes-HLG-12` - Each "write that down" user moment should become a durable note entry that can generate new HLG later.
- [ ] `Codex-Notes-HLG-13` - Family phase docs should use the clearer generic filename `Future/IdeaName-N - Family Phase Name.md` when the repo is ready to migrate from the older `IdeaName_Phase IdeaName-N - ...` pattern.

### What Must Stay True

- Human wording must be preserved before Codex compresses it.
- HLG must not be silently dropped while organizing generations, family phases, or implementation phases.
- Repo research must happen before implementation decisions when the live system shape matters.
- Implementation must not start from only HLG or rough notes.
- A phase is not complete just because code was written; it must be checked against the wishlist it was supposed to satisfy.
- If the work does not achieve the wishlist, the system should create a follow-on phase instead of pretending the item is done.
- The planning hierarchy should remain readable when folded at `##` headings.

## Wishlist Organization

### Codex Level Goals

- [ ] `Codex-Notes-CLG-1` - Define the three-layer planning file model as Vision Doc, Generation Index Doc, and Family Phase Doc.
- [ ] `Codex-Notes-CLG-2` - Define `IdeaName-Vision.md` as the owner of full idea capture, HLG preservation, and generation routing.
- [ ] `Codex-Notes-CLG-3` - Define `IdeaName-GenN-Index.md` as the owner of one generation's HLG, CLG, wishlist organization, and family-phase routing.
- [ ] `Codex-Notes-CLG-4` - Define `Future/IdeaName-N - Family Phase Name.md` as the owner of one family phase's Codex-sized implementation phase ladder.
- [ ] `Codex-Notes-CLG-5` - Define the standard top-level folding shape for all three planning layers.
- [ ] `Codex-Notes-CLG-6` - Define the core implementation phase section shape with `### Phase N Summary` and `### Phase N Implementation Spec`.
- [ ] `Codex-Notes-CLG-7` - Define "write that down" Codex note entries as top-level `##` sections that can generate future HLG.
- [ ] `Codex-Notes-CLG-8` - Identify the official docs that need updates before this note becomes repo guide-rail truth.
- [ ] `Codex-Notes-CLG-9` - Use Home Page as the first migration target for the refined guide-rail pattern.
- [ ] `Codex-Notes-CLG-10` - Define the family phase doc naming clarification so current files remain understandable while future files can use the cleaner `IdeaName-N - Family Phase Name.md` pattern.

### File Ladder

```text
IdeaName-Vision.md
  ## Doc Header
  ## Doc Body
  ## Vision
  ## Wishlist Organization
  ## Generation 1 - Generation Name
  ## Generation 2 - Generation Name

IdeaName-Gen1-Index.md
  ## Doc Header
  ## Doc Body
  ## Vision
  ## Wishlist Organization
  ## IdeaName-1 - Family Phase Name
  ## IdeaName-2 - Family Phase Name

Future/IdeaName-N - Family Phase Name.md
  ## Doc Header
  ## Doc Body
  ## Vision
  ## Wishlist Organization
    ## IdeaName-N / Phase 1 - Implementation Phase Name
    ### Phase 1 Summary
    ### Phase 1 Implementation Spec
    ## IdeaName-N / Phase 2 - Implementation Phase Name
    ### Phase 2 Summary
    ### Phase 2 Implementation Spec
```

Current repo note:
- Existing files such as `Catalog_Phase Catalog-1 - Workspace Foundation And Catalog Contract.md` use the older naming convention.
- The clearer generic target is `Catalog-1 - Workspace Foundation And Catalog Contract.md`.
- Conceptually, both names refer to the same file type: a Family Phase Doc.

### Entry Checklist

Each Codex Desktop note entry should capture:
- the user prompt or idea
- the HLG produced by that prompt
- the planning rule or system shape being proposed
- the follow-up docs that should eventually become official guide rails

## [ ] `Codex-Notes-Entry-1` - `Idea To Implementation Funnel`

### Entry Summary

The first durable note is the overall idea-to-implementation funnel.

The system should turn a human idea into Codex work by preserving the idea, organizing it, checking it against the repo, breaking it into small phases, implementing those phases, verifying them, and adapting when the wishlist is not achieved.

### Source Prompts

- "the system im describing is ment to scale up and down. it turns a human level idea into a codex action."
- "the idea can be as small as fix the css on this button. medium sized as, add 10 buttons. or large sized, like add catalog workspace, or add radio"
- "the system is to take an idea and make it understandable, code checked againsted repo, broken up into small phases, & implement."

### Generated HLG

- [ ] `Codex-Notes-HLG-1`
- [ ] `Codex-Notes-HLG-2`
- [ ] `Codex-Notes-HLG-3`
- [ ] `Codex-Notes-HLG-4`
- [ ] `Codex-Notes-HLG-5`
- [ ] `Codex-Notes-HLG-6`

### Planning Read

This entry is the core operating model.

Small ideas may only need one family phase and one implementation phase. Medium ideas may need one generation index with several family phases. Large ideas may need multiple generations, each with its own generation index and future family phase docs.

## [ ] `Codex-Notes-Entry-2` - `Vision Doc Routes Generations`

### Entry Summary

The Vision doc is the top planning layer. It should become a generation-routing file.

When the user folds the Vision doc in VS Code, the `##` headings should make the generation list visible.

### Source Prompts

- "we understand the `IdeaName-Vision.md` pretty well"
- "the Vision becomes a list of generations when i fold in visual studio code & click ctrel+2 & focus on the ## sections."
- "the Vision is the generation routing."

### Generated HLG

- [ ] `Codex-Notes-HLG-7`
- [ ] `Codex-Notes-HLG-10`

### Planning Read

The Vision doc should preserve raw HLG, raw wishlist, north star, what must stay true, and generation routing.

It should not be the implementation spec.

## [ ] `Codex-Notes-Entry-3` - `Generation Index Routes Family Phases`

### Entry Summary

The index layer should be per generation.

Instead of one permanent giant index for every possible generation, the refined guide-rail shape should allow docs such as:

```text
IdeaName-Gen1-Index.md
IdeaName-Gen2-Index.md
```

The generation index should fold into large family phases such as `Catalog-1`, `Catalog-2`, `Home-Page-1`, or `Home-Page-2`.

### Source Prompts

- "the index file should be formated the same, in that. we have the ##doc header, ##vision, ##Wishlist Organization, ## IdeaName-(FamilyPhase N)"
- "for example Catalog-1, Catalog-2, Catalog-3"
- "the family phases are quite large in them selves. because each individual family phase (homepage-1, homepage-2) gets their own planning doc."

### Generated HLG

- [ ] `Codex-Notes-HLG-8`
- [ ] `Codex-Notes-HLG-10`

### Planning Read

The generation index owns CLG, wishlist organization, family-phase routing, family-phase summaries, and boundary rules.

It does not own detailed implementation specs for every Codex-sized phase.

## [ ] `Codex-Notes-Entry-4` - `Future Family Phase Doc Routes Codex Phases`

### Entry Summary

The future family phase doc is the final planning doc before implementation.

It owns one large family phase from the generation index and breaks that family phase into Codex-sized implementation phases.

When folded in VS Code, the `##` headings should show the phase list Codex can execute one by one.

### Source Prompts

- "which is the last doc, the planning doc. IdeaName - FamilyPhase N - Family Phase Name."
- "I think it could just be called Catalog-1 - Family Phasename.md"
- "Catalog-1 - Workspace Foundation And Catalog Contract.md"
- "so what is that file in generic terms?"
- "this doc becomes a list of phases for codex to do 1 by 1."
- "this doc willalso be formatted the same, in that. we have the ##doc header, ##vision, ##Wishlist Organization, ## IdeaName - FamilyPhase N - Phase N - PhaseName"
- "so when i collapse the .md file in visual studio code it will look like a list of the phases"
- "the ## section includes 2 ### sections. the summary & the Implementation Spec."

### Generated HLG

- [ ] `Codex-Notes-HLG-9`
- [ ] `Codex-Notes-HLG-10`
- [ ] `Codex-Notes-HLG-11`

### Planning Read

Each implementation phase should include:
- `### Phase N Summary`
- `### Phase N Implementation Spec`

Other `###` sections can exist when helpful, but these two are the minimum useful folding pattern.

## [ ] `Codex-Notes-Entry-5` - `Write That Down Creates Note Entries`

### Entry Summary

This Codex Desktop notes file should treat "write that down" moments as durable entries.

Each entry is a top-level `##` section that can later generate HLG, CLG, official guide-rail updates, or a future implementation/planning task.

### Source Prompts

- "treat the phases as entries we put into codex"
- "everytime i say, write that down is a new entry or ## section"
- "which will generate new HLGs"

### Generated HLG

- [ ] `Codex-Notes-HLG-12`

### Planning Read

This notes file should not behave like a random scratchpad.

It should behave like a structured intake log:
- every note entry has a summary
- every note entry preserves source prompts
- every note entry names generated HLG
- every note entry can point to future official docs to update

## [ ] `Codex-Notes-Entry-6` - `Family Phase Doc Naming Clarification`

### Entry Summary

The third planning file should be understood as a Family Phase Doc.

The older repo convention names those files like:

```text
Future/IdeaName_Phase IdeaName-N - Family Phase Name.md
```

The cleaner generic target should be:

```text
Future/IdeaName-N - Family Phase Name.md
```

For Catalog, that means the current file:

```text
Future/Catalog_Phase Catalog-1 - Workspace Foundation And Catalog Contract.md
```

would conceptually tighten to:

```text
Future/Catalog-1 - Workspace Foundation And Catalog Contract.md
```

### Source Prompts

- "the 3rd doc is the `Catalog_Phase Catalog-1 - Workspace Foundation And Catalog Contract.md`"
- "i actually want to tighten this up a little bit"
- "I think it could just be called Catalog-1 - Family Phasename.md"
- "Catalog-1 - Workspace Foundation And Catalog Contract.md"
- "so what is that file in generic terms?"

### Generated HLG

- [ ] `Codex-Notes-HLG-9`
- [ ] `Codex-Notes-HLG-13`

### Planning Read

The generic file type is `Family Phase Doc`.

The generic filename should be:

```text
Future/IdeaName-N - Family Phase Name.md
```

Inside that file, the top-level `##` sections are Codex-sized implementation phases:

```text
  ## IdeaName-N / Phase 1 - Implementation Phase Name
  ## IdeaName-N / Phase 2 - Implementation Phase Name
```

Do not confuse the file-level family phase ID, such as `Catalog-1`, with the smaller implementation phases inside the file.

## How To Move Forward

### Make This Official

To turn this temporary note into repo guide rails:

1. Update `docs/Human-Plans/Architecture/Architecture Setup.md`.
   - Add the three-layer model.
   - Clarify that Vision docs route generations.
   - Clarify that generation indexes route family phases.
   - Clarify that future family phase docs route Codex-sized implementation phases.

2. Update `docs/Agents/Dispatch-1/Dispatch-Manager-Agent.md`.
   - Make the loop layer names match this model.
   - Treat generation routing, generation-index setup, future-family-phase-doc setup, implementation-phase prep, and implementation as separate legal task types.
   - Require the manager to identify which layer it is in before dispatching work.

3. Update `docs/Agents/Dispatch-1/Dispatch-Worker-Agent.md`.
   - Add task shapes for routing HLG into generations, creating/updating generation indexes, creating/updating future family phase docs, prepping one implementation phase, and implementing one implementation phase.
   - Preserve the rule that the worker only owns one task type at a time.

4. Update `docs/Agents/Dispatch-1/Dispatch-Shared-Rules.md`.
   - Update the planning ladder so it names the new layers explicitly.
   - Define the three file layers as shared truth hierarchy terms.
   - Keep the closeout tracking rules.

5. Decide naming conventions.
   - Preferred generation index pattern: `IdeaName-GenN-Index.md`.
   - Preferred future family phase doc pattern: `Future/IdeaName-N - Family Phase Name.md`.
   - Existing docs such as `Catalog-Index.md` and `Catalog_Phase Catalog-1 - ...` can be migrated gradually instead of being renamed immediately.

6. Migrate Home Page first.
   - Use `Home-Page-Vision.md` as the generation-routing doc.
   - Convert the current Home Page index direction into `Home-Page-Gen1-Index.md`.
   - Keep or migrate the current `Home-Page-1` future doc as the first family phase doc.
   - Split persistence controls into later Home Page family phases inside the Gen1 index.

## [x] `Codex-Notes / Phase 1` - `Officialize Planning Guide Rails`

### Phase 1 Summary

This phase turns the temporary Codex Desktop notes model into official repo guide rails.

The Dispatch-1 folder has already been tightened around the new ladder:

```text
Vision Doc
  -> Generation Index Doc
  -> Family Phase Doc
  -> implementation phase
```

The remaining work is to update the broader architecture setup guidance, settle the naming convention, and pilot the structure on Home Page so future Codex runs can follow the model without rediscovering it from this notes file.

This phase should not implement Home Page runtime behavior.

It should only make the planning structure official enough that the next Home Page planning pass can safely create or migrate the generation index and family phase docs.

### Phase 1 Implementation Spec

#### Scope

Update the official planning guide rails to match the Codex Desktop notes model.

Owned docs:
- `docs/Human-Plans/Architecture/Architecture Setup.md`
- `docs/Agents/Dispatch-1/Dispatch-Manager-Agent.md`
- `docs/Agents/Dispatch-1/Dispatch-Shared-Rules.md`
- `docs/Agents/Dispatch-1/Dispatch-Worker-Agent.md`
- `docs/CodexDesktopNotes/1_CodexDesktopNotes.md`
- `docs/Doc-Log.md`

Dispatch-1 has already received the first alignment pass. This phase should review it for consistency rather than blindly rewriting it again.

#### Required Changes

- Add the three-layer model to `Architecture Setup.md`:
  - `IdeaName-Vision.md` = Vision Doc and generation routing
  - `IdeaName-GenN-Index.md` = Generation Index Doc and family-phase routing
  - `Future/IdeaName-N - Family Phase Name.md` = Family Phase Doc and implementation-phase routing
- Clarify that existing older files using `IdeaName_Phase IdeaName-N - ...` remain valid until migrated.
- Clarify that each Family Phase Doc should fold to implementation phases at the `##` level.
- Clarify that each implementation phase should include:
  - `### Phase N Summary`
  - `### Phase N Implementation Spec`
- Confirm Dispatch-1 uses the same terms:
  - Vision Doc
  - Generation Index Doc
  - Family Phase Doc
  - implementation phase
- Add or preserve guidance that implementation does not start until the active implementation phase has an implementation spec.
- Keep the "write that down" notes behavior documented here as a temporary intake pattern unless it later moves into an official notes guide.

#### Home Page Pilot Prep

Do not migrate Home Page in this phase unless explicitly assigned.

This phase should leave a clear next legal task:
- create or migrate `Home-Page-Gen1-Index.md` - completed on 2026-04-19 when `Home-Page-Index.md` was renamed and promoted into the active Gen1 index
- route current Home Page HLG and CLG into Gen1 family phases
- replace the temporary bridge read with the active Gen1 index read - completed by the same rename/spec pass
- decide whether current Home Page future docs keep older names or move to the cleaner `Future/Home-Page-N - Family Phase Name.md` pattern

#### No-Widening Rule

Do not:
- implement Home Page runtime behavior
- rename existing Catalog or Home Page files unless explicitly assigned
- close any Home Page HLG as achieved
- rewrite unrelated architecture families
- convert all older docs in the repo in one sweep

#### Verification Shape

- Run `git diff --check` on touched docs.
- Scan touched docs for stale ambiguous terms such as:
  - `active family index`
  - `active future doc`
  - `IdeaName-Index.md` when the intended term is `IdeaName-GenN-Index.md`
  - `IdeaName_Phase IdeaName-N` when the intended generic term is `IdeaName-N - Family Phase Name`
- Confirm the folded `##` headings in this notes file still show:
  - `Doc Header`
  - `Vision`
  - `Wishlist Organization`
  - note entries
  - `How To Move Forward`
  - `Codex-Notes / Phase 1`

#### Done Shape

This phase is done when:
- `Architecture Setup.md` and Dispatch-1 agree on the three-layer planning ladder
- the cleaner family phase doc filename is documented as the target convention
- older naming remains explicitly supported during migration
- Home Page has a clear next planning task but no runtime behavior has changed
- `docs/Doc-Log.md` records the docs update

#### Implementation Result

Completed in this docs pass:
- `Architecture Setup.md` now names `Vision Doc`, `Generation Index Doc`, `Family Phase Doc`, and implementation phase as the official planning ladder.
- `Architecture Setup.md` documents `Future/IdeaName-N - Family Phase Name.md` as the cleaner Family Phase Doc target while preserving older `IdeaName_Phase IdeaName-N - ...` files during migration.
- Dispatch-1 now uses the same terms and the exact `### Phase N Implementation Spec` heading for implementation readiness.
- The next Home Page task remains planning-only: create or migrate `Home-Page-Gen1-Index.md`, route current Home Page HLG and CLG into Gen1 family phases, then decide bridge/replacement and filename migration.

## [ ] `Codex-Notes-Entry-7` - `Vision Rails For Generation Sections`

### Summary

A Vision Doc generation section needs more than a plain summary, but it should not have an implementation spec.

The right middle layer is `Vision Rails`.

`Vision Rails` means the generation is still vision-level, but it now has enough guide rails to set up the matching Generation Index Doc without accidentally starting implementation.

### Captured Prompt Thread

The user clarified:
- the top-level generation section should have a summary plus guide rails
- this should not be called an implementation spec
- the guide rails should set up the index
- possible names included `Vision Spec`
- the preferred term became `Vision Rails`

### Planning Rule

For Vision Docs, each top-level generation section should use this shape:

```text
## [~] Generation N - Generation Name

### Generation N Summary

### Generation N Vision Rails
```

`Generation N Summary` should explain the generation's purpose, status, and broad product direction.

`Generation N Vision Rails` should guide the next planning layer, usually `IdeaName-GenN-Index.md`.

It should describe:
- the target Generation Index Doc
- the HLG that must be preserved
- the family phase routing direction
- ownership boundaries
- what must not route into this generation
- bridge-index notes when an older `IdeaName-Index.md` file is still serving the generation index role

### Ladder Fit

The intended ladder becomes:

```text
Vision Doc
  ## Generation N
    ### Generation N Summary
    ### Generation N Vision Rails

Generation Index Doc
  ## Family Phase N
    ### Family Phase Summary
    ### Family Phase Rails

Family Phase Doc
  ## Family-Phase / Phase N
    ### Phase N Summary
    ### Phase N Implementation Spec
```

### Follow-Up Phase Candidate

A later Codex-notes implementation phase should update the official guide rails and affected docs so:
- `Architecture Setup.md` documents `Vision Rails`
- Dispatch-1 knows that Vision Doc generation setup uses `Vision Rails`
- `Catalog-Vision.md` and `Home-Page-Vision.md` use `### Generation N Vision Rails`
- existing `Generation Summary`, `Vision Spec For Index Setup`, and `Phase Creation Read` wording is normalized where useful without changing runtime behavior

### No-Widening Rule

This entry only captures the naming and structure decision.

It does not implement the next guide-rail phase yet.

## [ ] `Codex-Notes-Entry-8` - `Canonical Intake Receipt For Yap Routing`

### Summary

The planning system needs one canonical Intake Receipt shape for raw user idea capture.

The receipt should let the user "yap" naturally while Codex records:
- what was said
- what high-level goals were extracted
- what planning layer the idea belongs to
- which canonical Vision, Generation Index, Family Phase, or implementation-phase file should receive the information
- what the next legal Codex task is

The receipt should not replace canonical planning docs.

It should behave like a front desk or handoff card: useful during intake and routing, but temporary once the correct source-of-truth doc is updated.

### Captured Prompt Thread

The user clarified:
- the Dispatch-1 automation should support the user freely explaining an idea
- Codex should extract HLG from that explanation
- the extracted HLG should move through the proper ladder before implementation specs
- the receipt could be one canonical `.md` file
- that receipt should link or point to the correct Vision, Index, Phase, or implementation file depending on the level of the idea

### Intake Receipt Role

The receipt answers: "what level of yap is this?"

Possible levels:
- raw new idea with no Vision Doc yet
- Vision Doc update
- Generation Vision Rails update
- Generation Index Doc update
- Family Phase Doc update
- implementation-phase summary or implementation-spec update
- runtime implementation request

Important rule:
- the receipt classifies and routes the idea
- the canonical docs own the lasting planning truth after the routing is applied

### Candidate File Shape

If this becomes official, use a template plus real receipts:

```text
docs/Agents/Dispatch-1/Templates/Intake-Receipt-Template.md
docs/DispatchPlans/Intake-Receipts/IdeaName-Intake-Receipt.md
```

The template should be stable.

The per-idea receipt should be disposable or archivable after the canonical docs are updated.

### Receipt Template Sketch

```md
# Intake Receipt - IdeaName

## Doc Header

### Purpose

This receipt captures one raw user idea or planning discussion and routes it to the correct planning layer.

## Intake

### Raw User Input Summary

### Extracted HLG

### Yap Level

- [ ] New idea / no Vision Doc yet
- [ ] Vision Doc update
- [ ] Generation Vision Rails update
- [ ] Generation Index update
- [ ] Family Phase Doc update
- [ ] Implementation Phase Spec update
- [ ] Runtime implementation request

### Owning Planning File

- Vision Doc:
- Generation Index Doc:
- Family Phase Doc:
- Implementation Phase:

### Routing Decision

### Do Not Do Yet

### Next Legal Codex Task
```

### Automation Flow

The manager should eventually use this flow:

```text
1. Fill the intake receipt from the user's raw idea.
2. Extract HLG without compressing them into implementation too early.
3. Classify the yap level.
4. Link the receipt to the owning canonical planning file.
5. Update the correct canonical doc.
6. Stop or move to the next legal planning layer.
```

Example routing:
- small CSS fix -> existing Family Phase Doc or implementation phase if already scoped
- medium "add ten buttons" idea -> Generation Index Doc or Family Phase Doc, depending on existing planning
- large "add Catalog workspace" idea -> Vision Doc first
- Home Page persistence-toggle idea -> Home Page Vision Rails or `Home-Page-Gen1-Index.md`, depending on whether the HLG has already been preserved

### Follow-Up Phase Candidate

A later Codex-notes implementation phase should update official guide rails so:
- Dispatch-1 includes `raw yap intake` as a legal loop layer
- manager and worker task types include `fill or update Intake Receipt`
- the canonical Intake Receipt template is created
- `Architecture Setup.md` explains when intake receipts are used
- the receipt clearly distinguishes temporary routing truth from canonical product/planning truth

### No-Widening Rule

This entry only captures the intake-receipt idea.

It does not create the receipt template or update Dispatch-1 yet.

## [ ] `Codex-Notes-Entry-9` - `Stable Generation HLG Checklist`

### Summary

Vision Doc generation sections should keep their local HLG coverage as a stable checklist, not as a bare covered-ID list.

The preferred heading is:

```md
### Generation N HLG Checklist
```

Each line should carry:
- checkbox status
- stable HLG identifier
- the full HLG wording

This makes the generation section readable on its own and avoids renaming the heading when HLG move from open to complete.

### Captured Prompt Thread

The user clarified this while tightening `Catalog-Vision.md`:
- under `Generation 0`, `### HLG Covered` should become `### Generation 0 HLG Checklist`
- line items should be checkbox checklist items
- completed generation HLG, such as `Generation 0`, should use `[x]`
- each line should include the HLG summary text, not only the identifier
- the heading should stay stable instead of changing when completion status changes

### Planning Rule

Inside each Vision Doc generation section, prefer this shape:

```md
## [x] Generation 0 - Cleanup And Prep Before Catalog Family Start

### Generation 0 Summary

`Generation 0` is the completed cleanup-and-prep generation before the first real Catalog runtime.

### Generation 0 HLG Checklist

- [x] `Catalog-Gen0-HLG-1. remove default Browser-resident reference preload behavior before the first real Catalog family starts`
- [x] `Catalog-Gen0-HLG-2. keep prep and cleanup separate from the first real Catalog runtime generation`
- [x] `Catalog-Gen0-HLG-3. prepare the Catalog family boundary so later repo-backed assets return only as intentional optional choices`

### Generation 0 Vision Rails
```

Open or partially complete generations should use the same heading and update only the checkbox status:

```md
### Generation 1 HLG Checklist

- [x] `Catalog-Gen1-HLG-1. ...`
- [ ] `Catalog-Gen1-HLG-9. ...`
- [~] `Catalog-Gen1-HLG-14. ...`
```

### Ladder Fit

This rule belongs to the Vision Doc generation layer.

It pairs with `Vision Rails`:

```text
Vision Doc
  ## Generation N
    ### Generation N Summary
    ### Generation N HLG Checklist
    ### Generation N Vision Rails
```

The top-level `## Vision > ### Generation N HLG` block can still preserve the canonical full HLG list.

The generation-local `### Generation N HLG Checklist` repeats the relevant HLG with status so the folded generation section can be read without jumping back to the top of the file.

### Follow-Up Phase Candidate

A later Codex-notes implementation phase should update official guide rails so:
- `Architecture Setup.md` documents `### Generation N HLG Checklist` as the preferred generation-local HLG format
- Dispatch-1 knows that Vision Doc generation sections should preserve HLG with full wording and checkbox status
- existing Vision Docs such as Catalog and Home Page can be normalized where useful without changing runtime behavior

### No-Widening Rule

This entry only captures the generation-local HLG checklist rule.

It does not implement the official guide-rail update beyond the already completed Catalog documentation cleanup.

## [ ] `Codex-Notes-Entry-10` - `Dispatch 2 Guide-Rail Fleet`

### Entry Summary

Dispatch 2 should use a flat fleet coordinated by the live Dispatcher Codex.

The child agents should not form a nested manager tree. The live Dispatcher stays with the user, remains interruptible, and directly coordinates three helper roles:

- `Guide-Rail Codex`
- `Worker Codex`
- `Explorer Codex`

The key clarification is that phase prep and coverage review should be the same Guide-Rail role.

The Guide-Rail Codex owns the HLG/CLG-to-spec ladder before implementation and owns HLG/CLG/checklist accounting after implementation. The Worker stays simple: implement the prepared spec, run focused proof, run `npm run build`, repair in-scope build failures, and report. The Explorer stays optional and read-only by default, researching seams that make future prep sharper.

### Source Prompts

- "i want to give you a promotion actually. you can spawn a manager codex to organize small tasks. i want you alive & waiting for me to interupt & maybe give more direction."
- "i think i see 1 flaw, our manager can not spawn child codex agents. so it can not watch over them right?"
- "lets simplify the fleet then if we can have a manager that can spawn. he will sorta be useless right?"
- "lets also combine verifier and the worker."
- "the reviewer should be the parallel codex that makes sure we stay on the guide rails from the vision HLG down to the spec."
- "maybe the reviewer can write new phases?"
- "shouldnt the prepper and the coverage reviewer be the same?"

### Generated HLG

- [ ] `Codex-Notes-HLG-14` - Dispatch should keep the live Codex in the user-facing thread as the only agent that spawns, watches, accepts, or redirects child agents.
- [ ] `Codex-Notes-HLG-15` - The system should use a flat fleet instead of a nested manager tree because child managers cannot reliably supervise their own child Codex agents.
- [ ] `Codex-Notes-HLG-16` - The Worker should implement one prepared phase, run focused verification, run `npm run build`, and repair in-scope build failures before reporting.
- [ ] `Codex-Notes-HLG-17` - The Guide-Rail Codex should own both prep mode and coverage review mode so one role preserves the HLG/CLG-to-spec ladder before and after implementation.
- [ ] `Codex-Notes-HLG-18` - The Explorer should remain an optional scout that researches live seams or future-phase questions without editing by default.
- [ ] `Codex-Notes-HLG-19` - The Guide-Rail Codex should propose follow-up phases when implementation does not fully achieve HLG, CLG, or checklist coverage, while the Dispatcher approves whether those phases are added.

### Planning Rule

Dispatch 2 should use this role model:

```text
User
  ->
Dispatcher Codex
  -> Guide-Rail Codex
  -> Worker Codex
  -> Explorer Codex
```

The normal phase loop should be:

```text
HLG / CLG
  -> Guide-Rail prep mode
  -> Worker implementation
  -> Worker focused proof and npm run build
  -> Guide-Rail coverage review mode
  -> Dispatcher accept, repair, follow-up phase, or stop
```

### Guide-Rail Modes

`Prep mode` happens before Worker dispatch.

It should:
- read the Vision HLG
- read the Generation Index CLG
- read the Family Phase Doc
- fold in Explorer findings if available
- tighten the phase summary
- write or tighten the implementation spec
- define no-widening rules
- define likely files and live seams
- define focused tests and `npm run build`
- define the Worker stop condition

`Coverage review mode` happens after Worker return.

It should:
- review the Worker diff against the Vision HLG, Generation Index CLG, Family Phase Doc, and implementation spec
- confirm focused proof and `npm run build`
- account for checklist status as `complete`, `partial`, `open`, or `blocked`
- decide whether HLG/CLG coverage moved honestly
- propose follow-up phases if coverage remains incomplete
- wait for Dispatcher approval before final checklist movement or new phase insertion

### Follow-Up Docs

- [x] Update `docs/Agents/Dispatch-2/` around the Guide-Rail role.
- [ ] Keep Home Page Gen 1 as the first pilot of the flat Dispatch 2 fleet.
- [ ] Add reusable handoff templates after the role model stabilizes.
