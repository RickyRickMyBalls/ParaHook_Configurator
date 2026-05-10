# Properties Gen1 Index

## Doc Header

### Doc History
3. 2026-05-10 11:22:51: Prepped the new standalone `Properties-1` family phase doc for implementation by tightening the umbrella handoff around focused-item entry, nested `Materials-1` ownership, and reservation-only later lanes, while keeping the current generation index aimed at one small structural pass before the materials runtime lane begins.
2. 2026-05-10 11:07:51: Added the first standalone family phase doc `Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`, updated this generation index so the umbrella now points at one explicit implementation-planning owner surface, and kept the next runtime-forward handoff aimed at the nested `Materials-1` lane instead of inventing a broad premature Properties runtime pass.
1. 2026-05-10 10:53:15: Added the new active `Properties` Generation 1 planning index so the workspace family now has a real umbrella home above the moved `Materials` subfamily, with the first generation intentionally centered on focused-item property editing and the first concrete subfamily routed into `Properties/Materials/`.

### Purpose

This file is the active `Generation 1` planning index for the `Properties` workspace family under `Workspace Modes`.

Use it to answer:
- what the `Properties` workspace family is supposed to be for
- how `Properties` should fit the hybrid workspace model
- how focused-item property editing should be organized before many subfamilies appear
- which Generation 1 goals belong to the umbrella workspace family versus the first `Materials` subfamily
- what the first `Properties` family phase should be

Do not use it for:
- the broad long-range north-star if the family later needs `Properties-Vision.md`
- detailed implementation-phase specs that belong in standalone `Future/` family phase docs
- treating one specific property group such as `Materials` as if it already defines the entire family forever

### Family Structure

Use this folder like this:

- `Properties-Gen1-Index.md`
  - active Generation 1 planning index
  - current HLG, CLG, wishlist organization, and family-phase routing surface
- `Materials/`
  - first concrete `Properties` subfamily
  - current home for object-focused material editing vision and generation routing
- `Future/`
  - standalone implementation-ready `Properties` family phase docs
- `Shipped/`
  - shipped records for completed `Properties` umbrella cuts

Important setup note:
- `Properties` is now the workspace-family umbrella
- `Materials` is the first nested property-editing subfamily, not the whole workspace identity
- if the umbrella widens enough that it needs a broader north-star, add `Properties-Vision.md` later instead of overloading this index

## Doc Body

### Short Version

`Properties` should become the real workspace surface for focused-item inspection and editing.

The family should leave room for multiple property groups over time, not just one:
- `Materials`
- later transforms or object-level metadata if they belong here
- later other property sections that are too specific to justify their own whole workspace

The first concrete subfamily is `Materials`.

That means the first honest umbrella read is:
- `Properties` is the workspace family
- `Materials` is the first major section or subfamily inside it
- the umbrella should stay broad enough to host later property groups
- the first implementation work should still stay narrow and owner-honest

The first family lane is `Properties-1`.

`Properties-1` should stay structural:
- define the umbrella workspace direction
- define how focused-item property editing relates to subfamilies
- keep the first runtime-planning handoff aligned to the moved `Materials` subfamily instead of inventing fake parallel work

### Current Planning Read

This file owns the active `Generation 1` family-phase routing for the `Properties` workspace.

Current legal family-phase ladder:
- `Properties-1` - Workspace Umbrella And Focused-Item Property Routing

Current subfamily read:
- `Materials` is the first active `Properties` subfamily
- current materials north-star and generation routing live under:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Vision.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Materials/Materials-Gen1-Index.md`

Current planning rules:
- use this index to choose and bound umbrella `Properties-N` family phases
- use the nested `Materials` docs for materials-specific direction and later implementation planning
- do not start runtime implementation from this index alone
- keep the umbrella broad enough to host more than `Materials`, but do not invent extra subfamilies until they are real

Current implementation-planning owner:
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`

Current next handoff after `Properties-1`:
- `Materials-1`

### Vision

`Properties` should be the workspace family for editing the currently focused item's inspectable and editable property groups.

The healthy Generation 1 read is:
- `Properties` is a real workspace surface under the shared hybrid workspace model
- the workspace is driven by focused object or item context
- the workspace is sectioned by property group rather than pretending one flat panel is enough forever
- `Materials` is the first active property group and should not be mistaken for the entire final family
- the workspace must stay downstream from the real owner systems for each property group

Important boundary rule:
- if a question is about materials-specific workflow, use the nested `Materials` docs
- if a question is about the broader focused-item property workspace direction, use this index until a future `Properties-Vision.md` exists
- if a question is about exact implementation steps, use the owning standalone `Future/` phase doc or the nested subfamily docs

## Wishlist Organization

### High Level Goals

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`

### Codex Level Goals

- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-2. Route the moved `Materials` docs as the first nested subfamily under that umbrella.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-4. Create one standalone `Properties-1` family phase doc when the umbrella needs implementation-ready follow-through beyond the nested materials lane.

### `Properties-1`

- [ ] Create the standalone `Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md` Family Phase Doc.
- [ ] Define the umbrella workspace boundary between `Properties` and its first nested `Materials` subfamily.
- [ ] Keep the first umbrella phase structural instead of competing with the nested materials planning lane.
- [ ] Leave room for later property-group subfamilies without forcing them into this first pass.
- [ ] `Properties-Gen1-HLG-1`
- [ ] `Properties-Gen1-HLG-2`
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] `Properties-Gen1-HLG-5`
- [ ] Properties-Gen1-CLG-1.
- [ ] Properties-Gen1-CLG-2.
- [ ] Properties-Gen1-CLG-3.
- [ ] Properties-Gen1-CLG-4.

### `Properties / Materials`

- [ ] Keep the current materials-specific vision and generation routing under `Properties/Materials/`.
- [ ] Let materials-specific runtime planning continue through the nested subfamily docs instead of flattening it back into the umbrella.
- [ ] Use `Materials` as the first proof that the `Properties` umbrella can host a real property-group workspace lane.
- [ ] `Properties-Gen1-HLG-3`
- [ ] `Properties-Gen1-HLG-4`
- [ ] Properties-Gen1-CLG-2.
- [ ] Properties-Gen1-CLG-3.

### Phase Prep Notes

- the first umbrella phase should stay about family shape and routing, not heavy runtime work
- materials-specific implementation planning should continue in the nested `Materials` docs
- later property-group subfamilies should only be added when they are real enough to justify their own planning surface

## [ ] `Properties-1` - `Workspace Umbrella And Focused-Item Property Routing`

### Family Phase Summary

Create the first implementation-planning surface for the new `Properties` workspace umbrella.

This phase should make the umbrella shape and nested-subfamily routing concrete before broader runtime implementation starts.

The first family phase should stay small:
- one umbrella workspace boundary
- one focused-item property-editing routing answer
- one explicit relationship to the nested `Materials` subfamily
- no fake all-at-once properties architecture

### HLG / CLG Coverage

- [ ] `Properties-Gen1-HLG-1. Properties should be a real workspace-family umbrella for focused-item inspection and editing instead of leaving each property group to become an unrelated one-off panel.`
- [ ] `Properties-Gen1-HLG-2. Properties should fit the same hybrid workspace model as the other major workspaces.`
- [ ] `Properties-Gen1-HLG-3. Properties should stay focused-item-aware and downstream from the real owner systems for each property group.`
- [ ] `Properties-Gen1-HLG-4. Materials should be the first concrete `Properties` subfamily instead of defining the whole workspace identity forever.`
- [ ] `Properties-Gen1-HLG-5. The umbrella family should leave room for later non-material property groups without pretending they are already planned in detail.`
- [ ] Properties-Gen1-CLG-1. Create a dedicated `Properties` workspace-family umbrella under `Workspace Modes`.
- [ ] Properties-Gen1-CLG-2. Route the moved `Materials` docs as the first nested subfamily under that umbrella.
- [ ] Properties-Gen1-CLG-3. Define the first focused-item property-editing boundary before runtime implementation starts.
- [ ] Properties-Gen1-CLG-4. Create one standalone `Properties-1` family phase doc when the umbrella needs implementation-ready follow-through beyond the nested materials lane.

### Owns

- the first `Properties` workspace umbrella read
- the first focused-item property-editing family boundary
- the routing relationship between the umbrella and the nested `Materials` subfamily

### Does Not Own

- the full materials-specific workflow, which belongs in `Properties/Materials/`
- the complete runtime properties system
- later property-group subfamilies that are not yet real enough to plan honestly

### Current Implementation-Planning Owner

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Properties/Future/Properties-1 - Workspace Umbrella And Focused-Item Property Routing.md`
