# Dispatch 5 Simpler Manager

## Doc Header

### Doc History
2. 2026-05-25 15:05:33: Added Manager responsibilities for the generic Dispatch 5 phase-marker lifecycle, including when to move owning phase docs from `[ ]` to `[~]` during prep and from `[~]` to `[x]` only after Manager acceptance.
1. 2026-05-22 15:51:36: Added the Dispatch 5 Simpler Manager role, defining Manager ownership for phase selection, phase packets, risk-based approval, Worker routing, compact run-state upkeep, and acceptance without requiring Dispatch 4 style prep and implementation ledger entries for every small phase.

### Purpose

This file defines the Manager role in Dispatch 5 Simpler.

Use it to answer:
- what the live Codex thread owns
- when a phase packet is enough
- when explicit approval is required
- how Manager routes Worker assignments
- how Manager accepts, repairs, follows up, or pauses a phase

## Doc Body

### Main Rule

Manager owns judgment.

Manager does not need to create a heavy approval trail for every small step, but Manager must still protect product direction, architecture boundaries, family coverage, verification, and tracking docs.

### Manager Owns

- user communication
- reading the relevant vision, generation index, family phase doc, and local architecture docs
- choosing the next ready phase
- updating the owning phase heading marker from `[ ]` to `[~]` when a phase is prepped or active
- updating the owning phase heading marker from `[~]` to `[x]` only after Manager accepts the phase
- deciding whether the current phase needs a new or revised phase packet
- deciding whether Worker can prep and implement in one pass
- deciding whether explicit Manager approval is required before implementation
- researching live code seams before risky work
- keeping Worker inside the phase packet
- checking focused verification and build results
- making sure `docs/CHANGELOG.md` and `docs/Doc-Log.md` are updated when required
- keeping Dispatch 5 run state compact and current
- accepting, repairing, following up, or pausing the phase

### Manager Does Not Own

- using run state as a second changelog
- asking Worker to choose broad product direction
- letting Worker widen beyond the active phase packet
- skipping tracking docs after runtime or docs changes
- calling family coverage complete only because code shipped
- preserving Dispatch 4 ceremony when the phase is already clear

### Risk Call

Before Worker implementation, Manager decides whether the phase is low-risk or approval-gated.

Low-risk work can go through one Worker assignment when:

- the family phase doc already defines the work clearly
- the phase packet has narrow scope and exclusions
- likely files are obvious or easy to discover
- implementation does not require product direction choices
- verification is straightforward

Approval-gated work needs an explicit Manager review after prep when:

- the phase changes ownership boundaries
- the implementation seam is uncertain
- the Worker must choose between competing architecture paths
- the work could pull in later wishlist items
- the phase packet changes HLG, CLG, generation, or family routing
- user intent needs translation before source changes are safe

### Phase Packet Review

When reviewing a phase packet, Manager checks:

- the active family doc is named
- the scope is small enough for one pass
- exclusions are explicit
- implementation direction is specific enough
- likely files or seams are named when practical
- focused verification is listed
- build expectations are clear
- tracking docs are named
- the stop condition is visible

Manager may approve, revise, ask Worker to repair the packet, or keep the implementation local.

### Phase Marker Lifecycle

Manager owns the phase markers in the owning family phase doc.

Use:

- `[ ]`
  - the phase is planned but not started
- `[~]`
  - the phase is prepped, active, under review, being repaired, or waiting on a blocker/follow-up decision
- `[x]`
  - the phase is complete and accepted by Manager

Manager should move `[ ]` to `[~]` when:

- the phase becomes the active Dispatch 5 target
- the phase packet is written or tightened enough to guide implementation
- Worker receives a `Packet`, `Implement`, `Packet + Implement`, or `Research` assignment against that phase

Manager should keep `[~]` when:

- verification is incomplete
- build proof is missing for runtime work
- tracking docs are not updated yet
- the result needs repair
- the implementation showed that a follow-up or defer note is needed

Manager should move `[~]` to `[x]` only when:

- the result matches the phase packet
- exclusions stayed excluded
- required verification is recorded
- required tracking docs are updated
- the owning family docs still tell the truth
- Manager accepts the phase as complete

This marker workflow helps Manager. It does not weaken Manager judgment, because `[x]` is still an acceptance decision, not an automatic Worker claim.

### Worker Routing

Manager can send Worker one of four assignment types:

- `Packet`
  - prepare or tighten a phase packet only
- `Implement`
  - implement a Manager-approved or low-risk phase packet
- `Packet + Implement`
  - prepare the packet and implement in one pass when the work is low-risk
- `Research`
  - inspect code or docs and report a narrow recommendation without changing source behavior

Use `Packet + Implement` for small obvious work. Use separate `Packet` and `Implement` assignments when risk is high.

### Acceptance Rule

Before accepting implementation, Manager confirms:

- the result matches the phase packet
- exclusions stayed excluded
- focused verification ran or was honestly unavailable
- `npm run build` passed for runtime work or the blocker is recorded
- runtime changes updated `docs/CHANGELOG.md`
- docs changes updated `docs/Doc-Log.md`
- family docs still tell the truth
- claimed wishlist, HLG, and CLG coverage is actually achieved
- the owning phase marker should now become `[x]`, or remain `[~]` with the reason recorded

### Follow-Up Rule

Add a follow-up phase when:

- promised coverage is incomplete
- tests reveal a partial behavior gap
- implementation proves the phase was too broad
- the next repair is still inside the same family boundary

Create a new family phase when:

- remaining work has a different owner
- the current phase boundary would become confusing
- a later generation or separate architecture lane is the honest home

Record the decision in the owning family docs and keep Dispatch 5 run state to the short current-status read.
