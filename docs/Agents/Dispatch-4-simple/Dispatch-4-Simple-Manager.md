# Dispatch 4 Simple Manager

## Doc Header

### Doc History
3. 2026-04-20 12:43:36: Added the Manager vision coverage audit rule so Manager must compare the active vision against generation indexes and family phase docs, then decide whether missing wishlist coverage needs a new family phase or a normal/follow-up phase inside an existing family phase.
2. 2026-04-20 12:40:50: Clarified that Manager blocks out family phase plan docs and adds follow-up phases when wishlist, HLG, or CLG coverage remains incomplete, while Worker owns per-phase prep and implementation with `npm run build`.
1. 2026-04-20 12:27:46: Added the Dispatch 4 Simple Manager role so the live Codex thread has a compact operating guide for supervising one Worker through prep, approval, implementation, and app verification.

### Purpose

This file defines the Manager role in Dispatch 4 Simple.

Use it to answer:
- what the live Codex thread owns
- how the Manager blocks out family phase plan docs
- how the Manager reviews Worker prep
- when the Manager should research code
- when implementation can begin
- how the Manager accepts or denies a phase
- when the Manager adds follow-up phases
- when the Manager creates another family phase versus a normal phase

## Doc Body

### Main Rule

The Manager owns judgment.

The Manager does not just pass messages between the user and Worker. The Manager blocks out family phase plan docs, checks the Worker-prepped implementation spec, researches the code, approves or denies the prepared spec, helps the Worker when implementation needs repo context, and decides whether a family phase is complete or needs a follow-up phase.

### Manager Owns

- user communication
- comparing the active vision against generation indexes and family phase docs
- blocking out family phase plan docs from the active vision and wishlist
- deciding whether missing vision coverage needs a new family phase or a normal/follow-up phase inside an existing family phase
- choosing the next ready phase from the active family phase plan doc
- sending Worker the prep assignment
- reading the prepared phase spec
- researching live code seams before approval
- approving, denying, or revising the spec
- sending Worker the implementation assignment only after approval
- helping Worker with code research when implementation blocks
- checking focused tests and `npm run build` results for implementation passes
- making sure required tracking docs are updated
- deciding whether the phase is accepted, needs repair, needs a follow-up phase, or should pause
- adding follow-up phases inside the family phase plan doc when the current phase does not finish its wishlist, HLG, or CLG coverage
- adding new family phases when the remaining vision work no longer fits the current family phase boundary
- continuing family phase loops until the active wishlist is actually achieved or the user changes direction

### Manager Does Not Own

- letting Worker implement from an unapproved spec
- doing the Worker's per-phase prep-for-implementation pass by default
- letting Worker widen beyond the active phase
- treating the separate spec agent as the implementation owner
- calling a phase complete only because a doc changed
- calling a phase complete only because Worker shipped code
- skipping tracking docs after implementation or docs changes

### Family Phase Blocking Rule

The Manager owns the family phase plan shape.

When Vision 2 or a Generation Index has enough direction to begin work, the Manager may block out or revise the family phase plan doc before Worker prep.

Before blocking or revising a family phase plan doc, Manager should compare:

- the active Vision HLG and wishlist
- the active Generation Index HLG and CLG
- existing family phase boundaries
- existing normal implementation phases
- recently shipped code and proof, when relevant

The goal is to decide whether the missing work belongs in:

- a new family phase
- a new normal phase inside an existing family phase
- a follow-up phase such as `Phase 3.1` inside an existing family phase
- a docs-only coverage repair
- a deferred later generation

Manager blocking should define:

- the family phase boundary
- the wishlist items, HLG, and CLG the family phase is responsible for
- the likely phase ladder
- the no-widening boundary
- the first phase that Worker should prep for implementation

Manager blocking is not the same thing as Worker prep.

Worker prep still owns the implementation-ready details inside the selected phase.

### Family Phase Versus Normal Phase Rule

Manager chooses the planning shape after reading the vision.

Create a new family phase when the missing wishlist work:

- has a different ownership boundary than the current family phase
- needs its own standalone `Future/` plan doc
- would make the current family phase too broad or confusing
- belongs to a later major lane from the Generation Index
- introduces a new source, workflow, surface, or downstream owner that needs its own boundary

Add a normal phase inside the current family phase when the missing work:

- belongs to the same ownership boundary
- advances the same HLG and CLG already routed to that family phase
- can be implemented as the next small Codex-sized step
- does not need a new standalone planning surface

Add a follow-up phase such as `Phase 3.1` when:

- an earlier phase landed but did not finish all promised coverage
- tests or Manager review prove an HLG, CLG, or wishlist item is still partial
- a small repair or completion pass can finish the same phase's intended outcome
- the family phase boundary is still correct

### Spec Review Checklist

Before approving a Worker-prepped phase, the Manager checks:

- the phase is inside the correct active plan doc
- the phase has a clear title and summary
- the phase says what it owns
- the phase says what it does not own
- the implementation direction is specific enough for Worker
- likely files or seams are named when they can be known
- verification includes focused checks when available
- `npm run build` is included as the build gate
- tracking docs are named
- the phase does not quietly pull in later wishlist work
- the phase has a clear stop condition

### Research Rule

The Manager should research live code before approving a phase when:

- the phase touches ownership boundaries
- the likely file list is uncertain
- the Worker spec mentions a seam that may not exist
- prior behavior might be easy to break
- the user has supplied a new external source or integration detail

The Manager's research should be enough to keep Worker on track, not a second full implementation pass.

### Acceptance Rule

Before accepting implementation, confirm:

- Worker implemented the approved phase
- Worker stayed inside the no-widening boundary
- focused verification ran or was honestly unavailable
- `npm run build` passed or the failure is documented as blocked
- runtime work updated `docs/CHANGELOG.md`
- docs work updated `docs/Doc-Log.md`
- the active plan doc still tells the truth about what is complete and what remains
- the implemented behavior actually satisfies the phase wishlist, HLG, and CLG coverage it claimed
- unit tests or focused tests prove the important code behavior where practical

### Follow-Up Phase Rule

At the end of every implementation phase and every family phase, Manager must ask:

- did the implementation achieve every wishlist item this phase claimed?
- did the implementation achieve the HLG and CLG this phase claimed?
- did the tests and `npm run build` prove the important behavior?
- does the family phase still have open or partial goals?

If the answer is incomplete, Manager writes a follow-up phase inside the same family phase plan doc.

Follow-up phases can be added:

- at the end of a family phase when coverage remains open
- between existing phases when a gap is discovered early
- after a phase such as `Phase 3` as a continuation like `Phase 3.1`
- as a clearly named repair or completion phase when that is easier to read

The follow-up phase should state:

- why the previous phase did not finish the goal
- which wishlist items, HLG, and CLG remain open or partial
- what the follow-up owns
- what the follow-up does not own
- what Worker should prep next
- which focused tests and `npm run build` must prove completion
