# Properties 1 - Workspace Umbrella And Focused-Item Property Routing

## Doc Header

### Doc History
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

### First Pass Decisions

1. `Properties` is the umbrella workspace family for focused-item property editing.
2. `Materials` is the first nested subfamily, not the whole workspace identity.
3. Focused object or item context should enter at the umbrella level, not be invented separately by each child lane.
4. The umbrella should describe section-level routing, but specific property editing behavior should stay with the owning nested lane.
5. Later candidates such as `Transform` should remain reserved-only until their owner boundaries are clearer.
6. The first runtime-forward handoff after this umbrella phase should go into `Materials-1`, not into a fake broad `Properties` implementation pass.

### Implementation Readiness

`Properties-1` is now small enough to execute as one doc-only structural pass.

The implementation-ready read is:
- confirm the umbrella meaning of `Properties`
- confirm that focused-item context enters at the umbrella level
- confirm that `Materials-1` owns the first real material-owner and runtime-forward planning work
- confirm that later lanes such as `Transform` remain reservation-only for now

This phase is ready because:
- the umbrella family exists
- the nested `Materials` family already exists
- the only remaining work here is structural boundary clarification, not runtime code

### Risks

- the umbrella could drift into pretending it owns materials-specific owner mapping
- future candidates such as `Transform` could get overpromoted before their owner seams are clear
- the handoff to `Materials-1` could become muddy if this doc starts speaking as if the umbrella already owns runtime property editing behavior

### Checklist

- [ ] Restate the umbrella meaning of `Properties` in a way that is broader than `Materials` but still specific enough to guide later child lanes.
- [ ] Lock the focused-item entry rule at the umbrella level.
- [ ] Lock the no-overlap handoff rule that `Materials-1` owns the first material-specific owner read.
- [ ] Keep later lanes such as `Transform` in reservation-only status.
- [ ] Close `Properties-1` with `Materials-1` as the next active runtime-forward lane.

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
- the next handoff into `Materials-1` is straightforward
- the doc no longer reads as if `Properties` itself still needs a broad runtime-first implementation pass

## Wishlist Organization

### High Level Goals

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`

### `Properties-1` Phase 1

- [ ] Define the umbrella meaning of `Properties` above `Materials`.
- [ ] Lock the rule that focused-item context enters at the umbrella level.
- [ ] State the boundary between umbrella routing and child-lane editing behavior.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`

### `Properties-1` Phase 2

- [ ] Define how the umbrella should hand forward into `Materials-1`.
- [ ] Keep the umbrella downstream from object, Browser, and viewer ownership.
- [ ] Record the rule that materials-specific owner mapping belongs in the nested materials lane.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`

### `Properties-1` Phase 3

- [ ] Reserve space for later property-group lanes without inventing them as current runtime work.
- [ ] Keep future candidates such as `Transform` in reservation-only status until they have cleaner owner seams.
- [ ] Close the umbrella phase with an explicit next handoff to `Materials-1`.
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-5`

## [ ] `Properties-1` - `Phase 1 - Umbrella Meaning And Focused-Item Entry`

### Phase 1 Summary

Define the first honest meaning of the `Properties` umbrella.

This phase should prove:
- `Properties` is broader than `Materials`
- the umbrella begins with focused-item context
- child lanes inherit that context instead of recreating it separately

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

## [ ] `Properties-1` - `Phase 2 - Materials Handoff And Owner Boundary`

### Phase 2 Summary

Define the clean handoff from `Properties` into `Materials-1`.

This phase should prove:
- the umbrella owns routing and family shape
- `Materials-1` owns the first real material-owner read
- the boundary between them is explicit

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

#### Verification Shape

- the next step after `Properties-1` is obviously `Materials-1`
- no umbrella checklist item claims materials-specific owner work it does not own

## [ ] `Properties-1` - `Phase 3 - Later Lane Reservation And Closeout`

### Phase 3 Summary

Reserve room for later non-material property groups without widening the current work dishonestly.

This phase should prove:
- the umbrella has room to grow
- later candidates such as `Transform` are acknowledged
- they remain deferred until their seams are clearer

### Phase 3 Implementation Spec

#### Purpose

Keep the umbrella future-proof without inventing fake active lanes.

#### Owns

- reservation-only space for future property groups
- the closeout rule that the next active implementation-planning lane is still `Materials-1`

#### Does Not Own

- formal planning surfaces for later lanes that are not ready
- viewport command-tool decisions
- object-transform ownership decisions

#### First Code Cut

This doc-only pass should:
- record later candidates as reserved-only
- close the umbrella phase cleanly with `Materials-1` as the next real active lane

#### Verification Shape

- future candidates are acknowledged but not overplanned
- the `Properties` umbrella remains broad without becoming vague
