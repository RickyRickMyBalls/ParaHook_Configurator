# Dispatch 5 Simpler Overview

## Doc Header

### Doc History
2. 2026-05-25 15:05:33: Added the generic phase-marker lifecycle for Dispatch 5 Simpler so any family phase can move from `[ ]` not started, to `[~]` prepped or active, to `[x]` Manager-accepted complete without making the workflow specific to one phase family.
1. 2026-05-22 15:51:36: Added this simpler Manager plus Worker dispatch model so long-running family work can use one phase packet, risk-based approval, compact run-state tracking, and normal repo tracking docs without repeating a full prep and implementation ledger for every small phase.

### Purpose

This file defines the Dispatch 5 Simpler operating model.

Use it when:
- the live Codex thread should act as Manager
- one Worker can help with bounded planning or implementation
- the work should move through a compact phase packet instead of a heavy prep and approval ledger
- the family docs, `docs/CHANGELOG.md`, and `docs/Doc-Log.md` should remain the durable record
- `Dispatch-4-simple` is too much ceremony for the size or clarity of the work

Do not use it for:
- letting Worker choose broad product or architecture direction
- skipping Manager judgment on risky phase boundaries
- skipping required tracking docs
- calling family wishlist coverage complete without checking the owning plan docs
- replacing the source family vision, generation index, or phase docs

## Doc Body

### Core Idea

Dispatch 5 Simpler keeps the useful Dispatch 4 roles but reduces the handshake.

There are two active roles:

- `Manager`
  - the live user-facing Codex thread
  - owns judgment, phase selection, product direction, risk calls, acceptance, and follow-up decisions
- `Worker`
  - one bounded helper
  - can prepare a phase packet, implement an approved or low-risk packet, or do a narrow research/proof pass

The durable truth should live in the family planning docs, shipped tracking docs, and source code.

Dispatch run state is only a dashboard for the active thread. It is not a second changelog.

### Simple Loop

```text
Manager selects the next ready phase
  ->
Manager marks that phase `[~]` when the packet is prepped or active
  ->
Manager or Worker writes one Phase Packet
  ->
Manager decides whether explicit approval is needed
  ->
Worker implements the packet or Manager keeps the work local
  ->
Focused verification runs, then npm run build when runtime code changed
  ->
Manager accepts, asks for repair, adds a follow-up, or pauses
  ->
Manager marks accepted work `[x]` or leaves incomplete work `[~]` with a blocker/follow-up
```

### Phase Markers

Dispatch 5 Simpler uses the owning family phase doc as the durable status surface.

Use these generic heading markers:

- `[ ]`
  - not started
  - no active packet has been accepted for that phase yet
- `[~]`
  - prepped or active
  - the phase has a packet, Manager attention, Worker assignment, or in-progress implementation
- `[x]`
  - Manager-accepted complete
  - the phase met its packet, verification, tracking-doc, and family-doc truth requirements

Marker rules:

- move a phase from `[ ]` to `[~]` when Manager selects it and the packet is written or tightened enough to guide work
- keep a phase `[~]` while implementation, verification, review, repair, or follow-up routing is still active
- move a phase from `[~]` to `[x]` only after Manager accepts the result against the phase packet and owning family doc
- prep the next phase as `[~]` only when it becomes the next legal active phase
- if work is useful but incomplete, keep the current phase `[~]` and add a blocker, defer note, or follow-up instead of marking it `[x]`

The marker lifecycle does not reduce Manager authority. It gives Manager a visible handoff state between "not started" and "accepted complete."

### Phase Packet

A phase packet is the compact work contract for one implementation-sized step.

It should include:

- phase name and owning family doc
- scope
- exclusions
- likely files or seams, when known
- implementation direction
- focused verification
- build gate when runtime code changes
- tracking docs to update
- stop condition

The packet can live:

- inside the owning family phase plan doc when it changes project planning truth
- in the Manager prompt to Worker when the family phase doc is already specific enough
- in a short run-state note only when the work is temporary and already covered by an owning plan doc

### Approval Rule

Explicit Manager approval is required when the packet:

- changes product direction
- changes ownership boundaries
- touches architecture family routing
- has uncertain file seams
- could widen beyond the active phase
- affects user-facing workflow in a way the phase doc does not already settle
- needs a new family phase or follow-up phase

Explicit Manager approval is optional when:

- the phase doc already defines the scope clearly
- the likely files are obvious
- the work is a small polish, proof, test, or docs cleanup pass
- the Worker can implement without choosing product direction

Even when explicit approval is skipped, Manager still owns final acceptance.

### Non-Negotiables

- Manager owns product and architecture judgment.
- Worker stays inside the current phase packet.
- Family vision, generation index, and phase docs stay canonical for wishlist and HLG or CLG coverage.
- Missing coverage becomes a follow-up phase, a new family phase, a docs-only repair, or an explicit defer.
- Runtime changes update `docs/CHANGELOG.md`.
- Docs changes update `docs/Doc-Log.md`.
- If a pass changes runtime and docs, both tracking files are updated.
- Focused tests should run when available.
- `npm run build` is required for runtime implementation passes unless Manager records a clear blocker.
- Run state tracks only active objective, current phase, blockers, next legal task, and last accepted result.

### Run-State Rule

Dispatch 5 run state should stay small.

Keep:

- active objective
- active family docs
- active phase packet
- active Worker and assignment
- blockers
- last accepted result
- next legal task

Do not keep:

- every sent prompt
- every approval sentence
- a duplicated checklist for every completed phase
- permanent shipped history that already belongs in `docs/CHANGELOG.md`, `docs/Doc-Log.md`, or the family docs

### Completion Rule

A phase is complete only when:

- the packet scope is implemented or honestly deferred
- exclusions stayed out of scope
- focused verification and build proof are recorded
- required tracking docs are updated
- the owning family docs still tell the truth
- Manager accepts the result against the claimed wishlist, HLG, and CLG coverage
- the owning phase heading is moved to `[x]` only after that acceptance

If the work is useful but incomplete, add a follow-up instead of pretending the phase is done.
