# Doc Vision

## Doc Header

### Doc History
1. 2026-04-18 12:24:00: Added this `Doc-Vision.md` file as one canonical north-star surface for the ParaHook docs system, capturing how the docs generations should be understood, how `Human-Plans` and `Human-Docs` should differ, and what must stay true so the repo's docs continue to help one human plus Codex work on a large CAD app without the docs system turning into its own source of drift

### Purpose

This doc captures the long-range vision for the ParaHook docs system.

Use it to answer:
- what the docs system is supposed to do for the project
- how the docs generations should be understood
- what `Generation 4` of the docs system is supposed to add
- how `Human-Plans` and `Human-Docs` should differ
- what must stay true as the docs system grows

Do not use it for:
- one implementation-ready phase ladder
- one folder inventory
- replacing `Doc-Index.md` or `Docs-Command-Center.md`

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide non-negotiable direction
  - useful for keeping the docs system aligned with the actual app vision instead of drifting into its own detached bureaucracy

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product north star
  - useful for checking that the docs system still serves the larger CAD, workspace, and graph-native direction

- `docs/Doc-Index.md`
  - docs inventory and canonical navigation map
  - useful for finding where docs live and which surfaces are exposed

- `docs/Docs-Command-Center.md`
  - lightweight daily-use docs start surface
  - useful for the small "what should I open first" read

- `docs/Human-Docs/`
  - reader-facing explanation layer
  - useful for helping a human understand the project without living inside implementation specs

- `docs/Human-Plans/`
  - implementation-spec side of the docs system
  - useful for family visions, generations, indexes, future phase docs, and shipped records

## Doc Body

### Why This Doc Exists

The ParaHook docs system grew quickly because the app itself grew quickly.

That growth was useful, but it also means the repo now needs a clearer answer to:
- what kinds of docs exist
- what each kind of doc is for
- which doc should be read first
- which doc wins when two docs feel close together
- how ideas should move from vision to implementation
- how Codex should use the docs without getting lost in them

Without a docs vision, the repo risks drifting into:
- too many planning docs with weak role boundaries
- readable docs and implementation docs blurring together
- generation docs, family docs, and future phase docs overlapping
- Codex following whichever doc it sees first instead of the right layer of truth

This doc exists to keep the docs system itself on one explicit path.

### Short Version

ParaHook should have a layered docs system, not one flat pile of Markdown files.

The docs system should:
- keep one master project vision
- let each major family keep its own local vision
- turn human goals into generations, families, phases, and Codex-sized implementation cuts
- keep readable docs separate from implementation-spec docs
- reduce cognitive load instead of increasing it
- make it safer to use one coordinator Codex plus dispatched workers

The docs generations should be read like this:
- `Generation 1`
  - primitive numbered plans
- `Generation 2`
  - the older `Phase-Plans` system
- `Generation 3`
  - the newer `Human-Plans` implementation-spec system
- `Generation 4`
  - `Human-Plans` kept as the implementation-spec side, but strengthened with better guide rails plus the readable `Human-Docs` layer

Important read:
- `Generation 4` should not replace `Human-Plans`
- it should make the docs system easier to read, safer to extend, and easier to use with Codex

### Human Level Goals

The docs system should achieve these human-level goals:

- keep one master project direction in `docs/Vision.md`
- let major app corners such as workspaces, worker, import, transform, and the docs system itself keep their own local north-star docs
- let one idea be compressed into generations, families, and smaller Codex-sized phases without losing the original human goal
- keep readable docs and implementation-spec docs separate enough that each stays useful
- make it easier to answer "what should I open first" for both humans and Codex
- make it easier to check whether a phase really achieved the human goal it was supposed to advance
- keep cleanup and follow-on work honest instead of pretending one phase solved everything
- make multi-Codex dispatch safer by clarifying doc roles, truth hierarchy, and shared-file ownership

## Docs Generations

The docs system should be described through explicit generations.

The point of the generations is not nostalgia.

The point is to make it easy to say:
- what system the repo used before
- what the current baseline is
- what the next docs-system upgrade is supposed to improve

## [x] Generation 1 - Primitive Numbered Planning

`Generation 1` was the earliest primitive numbering system.

It was useful mainly because it let work be tracked at all.

What it did well:
- gave work a first visible sequence
- let ideas become named chunks instead of raw chat memory

What it did not do well enough:
- weak doc role boundaries
- weak phase sizing for Codex
- weak separation between north star, active plan, and history

## [x] Generation 2 - Phase-Plans

`Generation 2` introduced the more explicit `Phase-Plans` system.

What it did well:
- made implementation work more structured
- gave phases a stronger identity
- helped break larger ideas into more executable units

What it still left weak:
- too much planning truth could still spread across older task-style docs
- readable docs were still not a first-class separate layer
- family-local vision and generation-local planning could still blur together

## [x] Generation 3 - Human-Plans

`Generation 3` is the newer `Human-Plans` implementation-spec system.

What it does well:
- creates a stronger family structure
- gives families visions, indexes, optional generation indexes, future docs, and shipped records
- lets one family break into Codex-sized implementation phases
- keeps more of the planning truth near the architecture families that own it

What it still needs:
- stronger guide rails for doc role boundaries
- a clearer truth hierarchy between master vision, family vision, generation index, family index, future docs, and readable docs
- a stronger readable-docs layer that does not ask the user to live inside implementation-spec docs for basic understanding

## [~] Generation 4 - Human-Plans With Better Guardrails And Human-Docs

`Generation 4` is an in-progress cleanup pass that moves the docs system from its organically grown phase into a cleaner, safer structure for multi-Codex execution.

`Generation 4` should keep `Human-Plans` as the implementation-spec side of the docs system while adding two major upgrades:

- better guide rails
- a real readable-docs layer through `Human-Docs`

The goal is not to replace the planning system.

The goal is to make the planning system easier to use correctly.

`Generation 4` should make the docs system answer these questions more clearly:
- which doc should I read first
- which doc owns truth for this decision
- when should something live in `Human-Docs` versus `Human-Plans`
- how should one family move from vision to generation to future phase to shipped result
- when should Codex research, plan, implement, verify, or only summarize

### Foldability and Header-Level Contract

To keep the docs system readable at scale, heading depth is the primary navigation layer.

All list-style planning docs should use `##` for each scan-level item you want to fold and check.

Use `##` list sections for:
- `## Doc Header`
- `## Doc Body`
- `## Generation 1`, `## Generation 2`, `## Generation 3`, and `## Generation 4` in vision docs
- `## <Family>-1`, `## <Family>-2`, etc., in generation index docs
- `## <Family>-<N> - Phase <N>` in family phase docs

Checklist rule:
- keep checkbox state directly in headers as `[ ]` or `[x]`
- use the same section meaning for each heading level across docs
- keep section intent obvious in folded list view

Common mapping:
- `##` is list level for generations, families, and phase entries
- `###` and deeper hold details, risks, and subtasks

## Healthy Workflow Read

The healthy docs workflow should read like this:

1. describe the vision
2. capture the human-level goals
3. organize the work into generations
4. create or revise the family index
5. check that the family still achieves the human-level goals
6. create one family phase doc
7. break that family phase into Codex-sized subphases
8. prep the first subphase for implementation
9. implement the subphase
10. repeat prep plus implementation until the family phase is complete
11. verify the behaviors and human-level goals that phase was supposed to achieve
12. do a cleanup pass if needed
13. move to the next family phase while staying aligned to the master vision and the human-level goals

Important rule:
- the docs should make this flow easier to follow
- they should not make the user re-discover the workflow every time

### What Must Stay True

#### 1. One Master Vision Must Stay Real

`docs/Vision.md` should remain the highest everyday direction surface for the project.

Important rule:
- local docs may specialize the vision
- they should not quietly replace it

#### 2. Local Family Vision Must Stay Real

Each major family should be able to keep a local north-star doc.

Examples:
- workspace families
- worker
- import
- docs system

Important rule:
- local family vision should narrow the problem
- it should not compete with the master repo vision

#### 3. Human-Plans And Human-Docs Must Stay Separate

`Human-Plans` should be the implementation-spec side.

`Human-Docs` should be the readable explanation side.

Healthy split:
- `Human-Plans`
  - how to build it
  - how to phase it
  - what the next Codex-sized cut is
- `Human-Docs`
  - what it is
  - how it works
  - how a human should understand the system without needing the whole implementation ladder

Important rule:
- `Human-Docs` should explain
- `Human-Plans` should specify

#### 4. Human Level Goals Must Survive Compression

The user often communicates in broad human goals first.

Those goals should survive as the work is compressed into:
- generations
- family indexes
- future phase docs
- smaller implementation subphases

Important rule:
- phase ladders should not become detached from the human goal that justified them

#### 5. Prep, Implementation, Verification, And Cleanup Must Stay Distinct

The docs system should keep these stages honest:
- prep
- implementation
- verification
- cleanup

Important rule:
- prep should not pretend to be implementation
- cleanup should not be hidden
- verification should not be skipped just because a phase was coded

#### 6. The Docs System Must Reduce Cognitive Load

The docs are there to make a large project easier to hold, not harder.

That means the repo needs:
- inventory surfaces
- command surfaces
- readable surfaces
- implementation surfaces

Important rule:
- not every doc should try to do all four jobs

#### 7. The Docs System Must Support Safe Multi-Codex Work

As the project grows, Codex will sometimes need to work through:
- one coordinator
- research workers
- planning workers
- implementation workers
- verification workers

Important rule:
- the docs system should make dispatch safer by clarifying ownership, boundaries, and the next correct surface to read

### Success Read

When the docs system is working well, the user should be able to say:
- "I know where the master project direction lives."
- "I know where the local direction for one family lives."
- "I can tell the difference between readable docs and implementation docs."
- "I can move from a human goal to a Codex-sized phase without losing the original intent."
- "I can tell what generation a docs family is in."
- "I can open a small start surface instead of scanning the entire docs tree."
- "I can use multiple Codexes without them all reading the wrong layer of truth."
- "The docs help me think, instead of becoming one more system I have to babysit."

### Summary

The umbrella direction is now:
- ParaHook should have one explicit docs vision
- the docs system should be described through explicit generations
- `Generation 1` was primitive numbered planning
- `Generation 2` was the older `Phase-Plans` structure
- `Generation 3` is the newer `Human-Plans` implementation-spec system
- `Generation 4` should keep `Human-Plans` while adding better guide rails plus a real readable `Human-Docs` layer
- the docs system should preserve one master vision, local family visions, human-level goals, Codex-sized phases, and honest stage boundaries between prep, implementation, verification, and cleanup
- the docs system should reduce cognitive load and make safe multi-Codex work easier
