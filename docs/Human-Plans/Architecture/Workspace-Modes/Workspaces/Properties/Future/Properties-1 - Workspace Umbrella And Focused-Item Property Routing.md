# Properties 1 - Workspace Umbrella And Focused-Item Property Routing

## Doc Header

### Doc History
8. 2026-05-10 12:01:29: Implemented and closed `Properties-1 / Phase 3 - Later Lane Reservation And Closeout`, locking later candidates such as `Transform` to reservation-only status, closing the umbrella family phase with `Properties-2` as the explicit next family-level handoff, and preserving `Materials-1` as the first child-lane runtime-forward lane inside that shared shell.
7. 2026-05-10 11:55:14: Added the explicit post-closeout planning handoff from `Properties-1` into `Properties-2 - Shared Properties Workspace Shell And Section Hosting`, clarifying that the umbrella still stops short of child-lane runtime logic while the new shared shell phase now owns the real workspace-foundation cut that `Materials-1` will plug into.
6. 2026-05-10 11:30:56: Tightened `Properties-1 / Phase 3 - Later Lane Reservation And Closeout` into an implementation-ready final umbrella cut by grounding it against the now-landed focused-item entry plus no-overlap handoff rules, clarifying that future lanes such as `Transform` stay reservation-only here, and making `Materials-1` the explicit next family-level implementation handoff after umbrella closeout.
5. 2026-05-10 11:28:44: Implemented and closed `Properties-1 / Phase 2 - Materials Handoff And Owner Boundary`, locking the no-overlap contract between umbrella routing and nested materials-specific owner mapping, making `Materials-1` the explicit first material-specific runtime-forward lane, and advancing the remaining umbrella work to `Phase 3 - Later Lane Reservation And Closeout`.
4. 2026-05-10 11:27:21: Tightened `Properties-1 / Phase 2 - Materials Handoff And Owner Boundary` into an implementation-ready next cut by grounding it against the now-explicit umbrella entry rule plus the existing nested `Materials` generation lane, clarifying the no-overlap contract, and narrowing the remaining work to one clean handoff pass before umbrella closeout and `Materials-1` prep.
3. 2026-05-10 11:24:25: Implemented and closed `Properties-1 / Phase 1 - Umbrella Meaning And Focused-Item Entry`, locking the umbrella-level meaning of `Properties`, making focused-item context an explicit top-level entry rule above nested child lanes, and advancing the active next doc-only handoff inside this umbrella phase to `Phase 2 - Materials Handoff And Owner Boundary`.
2. 2026-05-10 11:22:51: Tightened `Properties-1` into an implementation-ready umbrella phase by grounding the first pass against the now-landed `Properties` index plus nested `Materials` family, making the focused-item entry and no-overlap handoff rules more explicit, and narrowing the next doc-only work to one honest structural closeout before `Materials-1` begins.
1. 2026-05-10 11:07:51: Created the first `Properties` family phase doc so the new workspace umbrella now has one standalone planning surface for its focused-item property boundary, nested `Materials` routing, and later non-material section reservation instead of leaving that structure only in the generation index.

### Purpose

This doc owns the first implementation-planning slice for the `Properties` workspace family.

Use it to answer:
- what the first `Properties` umbrella should actually mean
- how focused-item property routing should work before many property groups exist
- how the umbrella should relate to the nested `Materials` subfamily
- how to leave room for later property groups without pretending they already have runtime owners

Do not use it for:
- the full materials-specific workflow, which belongs in the nested `Materials` docs
- the complete runtime `Properties` workspace implementation
- inventing transform, metadata, or other future sections as if they are already phase-ready
- turning the umbrella into a second Browser, Layers, or viewport-tool owner

## Doc Body

### Short Version

`Properties-1` should make the new umbrella workspace honest before runtime implementation begins.

The first family phase should prove:
- `Properties` is a real workspace-family umbrella
- the umbrella is focused-item-aware
- `Materials` is the first nested property-editing lane
- later property groups can live under the same umbrella without needing to be planned in detail yet

This phase should stay structural.

It should define:
- the umbrella boundary
- the first focused-item routing contract
- the relationship between the umbrella and `Materials`

It should not try to ship the full runtime `Properties` workspace.

### Scope

This family phase owns:
- the first explicit `Properties` umbrella read
- the first focused-item property routing direction
- the first boundary between the umbrella and the nested `Materials` subfamily
- the reservation space for later property-group lanes such as transform or metadata if they become real later

This family phase does not own:
- the full `Materials` implementation ladder
- material-owner read specifics that belong in `Materials-1`
- viewport gizmo or command-tool ownership
- Browser hierarchy or object identity ownership
- future property-group subfamilies that are not yet ready to plan honestly

### Current Live Read

The docs now establish `Properties` as the workspace-family umbrella under `Workspace Modes`.

The current planning shape is:
- `Properties-Gen1-Index.md` owns the umbrella generation read
- `Properties/Materials/Materials-Vision.md` owns the broad object-focused materials vision
- `Properties/Materials/Materials-Gen1-Index.md` owns the active materials generation ladder

This standalone family phase doc now exists.

The real first need is still not runtime UI yet.

The real first need is one honest answer to:
- what the `Properties` workspace is, above `Materials`
- how focused-item routing enters the umbrella
- what belongs in the umbrella versus the nested materials lane

That first umbrella answer is now explicit:
- `Properties` is the focused-item property-editing umbrella workspace family
- focused object or item context enters at the umbrella level
- nested lanes such as `Materials` inherit that context instead of inventing separate top-level workspace identity

### First Pass Decisions

1. `Properties` is the umbrella workspace family for focused-item property editing.
2. `Materials` is the first nested subfamily, not the whole workspace identity.
3. Focused object or item context should enter at the umbrella level, not be invented separately by each child lane.
4. The umbrella should describe section-level routing, but specific property editing behavior should stay with the owning nested lane.
5. Later candidates such as `Transform` should remain reserved-only until their owner boundaries are clearer.
6. The umbrella still must not absorb child-lane runtime logic, but the family now needs one honest shared shell follow-on so nested lanes can mount inside a real `Properties` workspace surface.

That no-overlap handoff is now explicit:
- the `Properties` umbrella stops at focused-item entry, child-lane framing, and family boundary rules
- `Properties-2` is the shared shell and section-hosting foundation that the umbrella itself does not own
- `Materials-1` remains the first material-specific runtime-forward lane inside that shared shell
- material-owner mapping, material field scope, assignment specifics, and later library behavior belong to `Materials-1` or later nested materials phases, not to the umbrella

### Implementation Readiness

`Properties-1` is now small enough to execute as one doc-only structural pass.

The implementation-ready read is:
- confirm the umbrella meaning of `Properties`
- confirm that focused-item context enters at the umbrella level
- confirm that `Properties-2` owns the first real shared `Properties` workspace-shell foundation
- confirm that `Materials-1` owns the first material-owner and child-lane runtime-forward planning work
- confirm that later lanes such as `Transform` remain reservation-only for now

This phase is ready because:
- the umbrella family exists
- the nested `Materials` family already exists
- the only remaining work here is structural boundary clarification, not runtime code

### Risks

- the umbrella could drift into pretending it owns materials-specific owner mapping
- future candidates such as `Transform` could get overpromoted before their owner seams are clear
- the handoff to `Materials-1` could become muddy if this doc starts speaking as if the umbrella already owns runtime property editing behavior

Closeout note:
- `Properties-1` is now closed, so the active next risk moves into `Properties-2` where the shared shell must stay separate from `Materials-1` child-lane behavior

### Checklist

- [x] Restate the umbrella meaning of `Properties` in a way that is broader than `Materials` but still specific enough to guide later child lanes.
- [x] Lock the focused-item entry rule at the umbrella level.
- [x] Lock the no-overlap handoff rule that `Properties-2` owns the shared shell and `Materials-1` owns the first material-specific owner read.
- [x] Keep later lanes such as `Transform` in reservation-only status.
- [x] Close `Properties-1` with `Properties-2` as the next shared-shell handoff and `Materials-1` as the first child-lane runtime-forward lane.

### Phase 3 Readiness

`Properties-1 / Phase 3` is now small enough to implement as the final doc-only umbrella closeout pass.

The implementation-ready read is:
- reserve later property-group lanes without promoting them into active implementation families
- keep `Transform` and similar candidates acknowledged but unowned beyond reservation status
- close `Properties-1` cleanly so the next real family-level implementation handoff is `Properties-2`, with `Materials-1` remaining the first nested materials runtime-forward lane
- avoid reopening earlier umbrella or materials-boundary decisions that are already settled

### Phase 3 Checklist

- [x] Restate that later candidates such as `Transform` remain reservation-only.
- [x] Keep future property-group planning out of the active umbrella closeout unless a new family surface is explicitly created later.
- [x] Close `Properties-1` with `Properties-2` as the next active family-level implementation handoff.
- [x] Restate that `Materials-1` remains the first child-lane runtime-forward lane inside that shared shell.
- [x] Avoid reopening `Phase 1` or `Phase 2` ownership questions.

### Phase 2 Readiness

`Properties-1 / Phase 2` is now small enough to implement as one doc-only handoff pass.

The implementation-ready read is:
- confirm that umbrella routing stops at focused-item entry plus child-lane framing
- confirm that `Materials-1` owns the first real material-owner read
- confirm that materials-specific runtime planning should not widen back into the umbrella
- confirm that the next umbrella work after this is only reservation-and-closeout, not another broad routing rethink

### Phase 2 Checklist

- [x] Restate the no-overlap rule between `Properties` umbrella routing and `Materials-1` owner mapping.
- [x] Lock the sentence that `Materials-1` is the first material-specific runtime-forward lane.
- [x] Keep Browser, viewer, and object identity ownership outside the umbrella-to-materials handoff.
- [x] Leave later umbrella closeout and reservation work to `Phase 3`.

### Likely Files

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Properties-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

### No-Widening Rule

- do not turn this family phase into a full runtime workspace implementation
- do not absorb materials-specific owner mapping here
- do not promote future lanes such as `Transform` into real subfamilies unless they get their own honest planning surface
- do not invent new object, Browser, Layers, or viewport-tool ownership just to make the umbrella feel fuller

### Done Shape

This family phase is in good shape when:
- the umbrella meaning of `Properties` is explicit
- the focused-item routing rule is explicit
- the boundary between the umbrella and the nested `Materials` lane is explicit
- the next handoff into `Properties-2` is straightforward
- the follow-on relationship between `Properties-2` and `Materials-1` is straightforward
- the doc no longer reads as if `Properties` itself still needs a broad runtime-first implementation pass

### Post-Closeout Handoff

After `Properties-1` closes, the family should split into one shared shell follow-on plus the first child-lane runtime foundation:

- `Properties-2`
  - shared `Properties` workspace shell
  - focused-item context consumption at the workspace level
  - section/tab framing and child-lane hosting
- `Materials-1`
  - first materials-specific owner read
  - first materials-specific runtime-forward lane inside that shell

Important rule:
- `Properties-2` should not absorb materials-specific field or assignment behavior
- `Materials-1` should not recreate top-level workspace routing, tab framing, or focused-item entry that belongs to the shared shell

## Wishlist Organization

### High Level Goals

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`

### `Properties-1` Phase 1

- [x] Define the umbrella meaning of `Properties` above `Materials`.
- [x] Lock the rule that focused-item context enters at the umbrella level.
- [x] State the boundary between umbrella routing and child-lane editing behavior.
- [x] `Properties-Gen1-HLG-1`
- [x] `Properties-Gen1-HLG-2`
- [x] `Properties-Gen1-HLG-3`
- [x] `Properties-Gen1-HLG-4`

### `Properties-1` Phase 2

- [x] Define how the umbrella should hand forward into `Materials-1`.
- [x] Keep the umbrella downstream from object, Browser, and viewer ownership.
- [x] Record the rule that materials-specific owner mapping belongs in the nested materials lane.
- [x] `Properties-Gen1-HLG-1`
- [x] `Properties-Gen1-HLG-3`
- [x] `Properties-Gen1-HLG-4`

### `Properties-1` Phase 3

- [x] Reserve space for later property-group lanes without inventing them as current runtime work.
- [x] Keep future candidates such as `Transform` in reservation-only status until they have cleaner owner seams.
- [x] Close the umbrella phase with an explicit next handoff to `Properties-2`.
- [x] Keep `Materials-1` explicitly recorded as the first child-lane runtime-forward lane after that shell handoff.
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-5`

## [x] `Properties-1` - `Phase 1 - Umbrella Meaning And Focused-Item Entry`

### Phase 1 Summary

Define the first honest meaning of the `Properties` umbrella.

This phase should prove:
- `Properties` is broader than `Materials`
- the umbrella begins with focused-item context
- child lanes inherit that context instead of recreating it separately

Landed read:
- `Properties` now explicitly reads as the focused-item property-editing umbrella above nested child lanes
- focused-item context now explicitly enters at the umbrella level before child-lane specialization begins
- `Materials` now reads as the first inherited child lane rather than the whole workspace identity

### Phase 1 Implementation Spec

#### Purpose

Make the umbrella boundary explicit before more child-lane planning grows.

#### Owns

- the first umbrella-level `Properties` meaning
- the focused-item entry rule
- the umbrella-level relationship to nested property lanes

#### Does Not Own

- material-owner mapping
- runtime material field decisions
- any complete `Properties` workspace UI

#### First Code Cut

This doc-only pass should:
- record the umbrella meaning in the family docs
- state the focused-item entry contract clearly
- prevent later child-lane docs from pretending they own the whole workspace identity

#### Verification Shape

- the `Properties` umbrella reads clearly without needing to infer its meaning from `Materials`
- the next child-lane docs can point upward to one explicit focused-item routing rule

## [x] `Properties-1` - `Phase 2 - Materials Handoff And Owner Boundary`

### Phase 2 Summary

Define the clean handoff from `Properties` into `Materials-1`.

This phase should prove:
- the umbrella owns routing and family shape
- `Materials-1` owns the first real material-owner read
- the boundary between them is explicit

Landed read:
- the umbrella now explicitly stops at routing, focused-item entry, and child-lane framing
- `Materials-1` now explicitly owns the first materials-specific runtime-forward planning work
- Browser hierarchy, viewer runtime, and focused object ownership itself remain outside the umbrella-to-materials handoff

Implementation readiness target:
- this phase should fit inside one Codex-sized doc-only pass
- the first cut should close the no-overlap rule cleanly enough that `Materials-1` can be prepped next without reopening umbrella questions

### Phase 2 Implementation Spec

#### Purpose

Prevent overlap between the umbrella and the nested materials lane.

#### Owns

- the handoff rule into `Materials-1`
- the no-overlap rule between umbrella routing and materials-specific owner mapping

#### Does Not Own

- the actual material owner read
- material field implementation
- material workspace runtime UI

#### First Code Cut

This doc-only pass should:
- point the next runtime-planning work into `Materials-1`
- state what `Properties-1` intentionally leaves to that child lane
- state what the umbrella intentionally keeps out of that handoff, especially Browser hierarchy, viewer runtime, and focused object ownership itself

#### No-Widening Rule

- do not widen this phase into the actual `Materials-1` owner read
- do not widen this phase into later umbrella reservation work that belongs in `Phase 3`
- do not invent runtime `Properties` UI behavior here
- do not let the umbrella claim material field menus, material assignment specifics, or material library behavior

#### Verification Shape

- the next step after `Properties-1` is obviously `Materials-1`
- no umbrella checklist item claims materials-specific owner work it does not own

## [x] `Properties-1` - `Phase 3 - Later Lane Reservation And Closeout`

### Phase 3 Summary

Reserve room for later non-material property groups without widening the current work dishonestly.

This phase should prove:
- the umbrella has room to grow
- later candidates such as `Transform` are acknowledged
- they remain deferred until their seams are clearer

Implementation readiness target:
- this phase should fit inside one Codex-sized doc-only pass
- the cut should end the umbrella cleanly and leave `Properties-2` as the next obvious implementation-family move, with `Materials-1` still queued as the first child-lane runtime-forward lane inside that shell

Landed read:
- later candidates such as `Transform` now stay explicitly reservation-only inside the umbrella closeout
- the umbrella now closes without inventing another broad `Properties` runtime pass
- `Properties-2` is now the explicit next family-level implementation handoff
- `Materials-1` remains explicitly queued as the first nested child-lane runtime-forward lane after that shell lands

### Phase 3 Implementation Spec

#### Purpose

Keep the umbrella future-proof without inventing fake active lanes.

#### Owns

- reservation-only space for future property groups
- the closeout rule that the next active family-level implementation-planning lane is `Properties-2`
- the companion rule that `Materials-1` remains the first child-lane runtime-forward lane inside that shell

#### Does Not Own

- formal planning surfaces for later lanes that are not ready
- viewport command-tool decisions
- object-transform ownership decisions

#### First Code Cut

This doc-only pass should:
- record later candidates as reserved-only
- close the umbrella phase cleanly with `Properties-2` as the next real active family lane
- keep `Materials-1` explicit as the first nested child-lane runtime-forward lane after that shared shell lands

#### No-Widening Rule

- do not create a new active `Transform` or other later subfamily here
- do not widen this phase into runtime `Properties` UI planning
- do not reopen the already-closed umbrella meaning or materials handoff decisions
- do not let reservation language masquerade as implementation readiness for later lanes

#### Verification Shape

- future candidates are acknowledged but not overplanned
- the `Properties` umbrella remains broad without becoming vague
- the next family-level handoff now reads as `Properties-2`
- the next child-lane runtime-forward handoff still reads as `Materials-1`
