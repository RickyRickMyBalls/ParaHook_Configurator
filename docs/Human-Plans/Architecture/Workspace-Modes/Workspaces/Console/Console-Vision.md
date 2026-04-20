# Console Vision

## Doc Header

### Doc History
2. 2026-04-19 22:04:46: Marked the Console Generation 1 planning-ladder HLG complete after the intake was preserved through Vision, Generation Index, and Family Phase docs.
1. 2026-04-19 21:29:35: Created the Console vision surface to preserve the Console Workspace Modes surface-parity HLG, route `Console Generation 1` into catalog-driven workspace action parity, and keep Console as an adapter over shared workspace owners instead of a separate workspace model.

### Purpose

This doc defines the broad architecture direction for the ParaHook `Console` family.

Use it to answer:
- what kind of control surface Console should become
- which user-level goals must stay visible across Console generations
- how Console should relate to workspace, graph, viewer, Browser, toolbar, and shell owners
- why Console Workspace Modes should use canonical workspace catalog and action eligibility instead of console-only allowlists

Do not use it for:
- detailed implementation specs
- one-off command patches
- replacing the older `Console-Index.md` history surface
- making Console the owner of workspace, graph, viewer, or shell behavior

## Vision

### North Star

Console should be ParaHook's command-and-feedback surface for navigating and acting across the app.

It should let users control workspace, graph, node, viewer, Browser, toolbar, and later CAD feature domains through one visible command grammar without turning each domain into its own mini-console.

Console should not own those domains. It should adapt user input into the real owner seams, then report what happened in plain command feedback.

### What Must Stay True

- Console is one app-wide command surface, not a Spaghetti-local debug widget.
- Console command grammar should stay hierarchical and stateful enough to guide users through scoped actions.
- Console should expose shared command behavior through adapters instead of inventing console-only execution paths.
- Workspace placement and hosting stay owned by the workspace/shell system.
- Graph and CAD authoring behavior stay owned by graph and feature systems.
- Viewer and camera behavior stay owned by viewer/view-state systems.
- Console transcript, prompts, and diagnostics should explain the command state without becoming the hidden source of runtime truth.
- Workspace modes must remain one hybrid surface model across slotted, floating, detached, and popout host states.

### Relationship To Existing Console Planning

The older `Console-Index.md` remains the current Console family architecture and phase-history surface.

This vision doc adds the missing newer planning layer:

```text
Console-Vision.md
  -> Console-Gen1-Index.md
    -> Future/Console-1 - Workspace Modes Catalog-Driven Surface Actions.md
```

Existing shipped phase records such as `Console 5.1G` and the older Workspace `7.5-16` Console Workspace Modes entry remain valid history.

`Console Generation 1` should build on those shipped records instead of replacing them:
- `5.1G` already locked the owner-first adapter rule.
- `Workspace 7.5-16` already shipped the first `Root > Workspace Modes` branch and initial action families.
- the new work should close the catalog-driven parity gap that remains after those first slices.

## Human Level Goals

### Generation 1 HLG

- [ ] `Console-Gen1-HLG-1. Users can control every workspace surface from Console with the same action model exposed by the shared slot UI.`
- [ ] `Console-Gen1-HLG-2. Console Workspace Modes should read canonical catalog/support data instead of maintaining surface allowlists.`
- [ ] `Console-Gen1-HLG-3. Primary and non-primary workspace rules should be explicit, tested, and consistent between Console and shell UI.`
- [ ] `Console-Gen1-HLG-4. Slotted, floating, detached, and popped-out surfaces should remain one workspace model, not separate Console concepts.`
- [ ] `Console-Gen1-HLG-5. Unsupported actions should either be hidden by shared eligibility rules or produce clear diagnostics.`
- [x] `Console-Gen1-HLG-6. The planning should begin at the Console vision/generation level and work down into index/phase docs instead of jumping directly into one implementation phase.`

## Generation 1

### Generation 1 Summary

`Console Generation 1` should turn the existing Console Workspace Modes branch from a hand-shaped first pass into a catalog-driven control surface for workspace modes.

The generation should preserve the older shipped branch shape:
- `Root > Workspace Modes`
- choose a target surface or viewport
- choose an action family
- execute through the shared owner seam
- keep breadcrumbs and diagnostics truthful

The generation should remove the remaining mismatch where some Console actions still know a narrow set of surface kinds locally while the workspace catalog and shell action owners already know more.

### Generation 1 Vision Rails

- keep Console as an adapter over shared workspace/shell action owners
- derive visible surface/action eligibility from canonical workspace support and shared action eligibility
- keep primary-slot protections and non-primary affordances consistent with shell UI
- keep slotted, floating, detached, and popout surfaces in one workspace identity model
- expose unsupported cases through hidden ineligible actions or clear owner-backed diagnostics
- do not widen this generation into a full command-language redesign
- do not make Console own workspace surface lifecycle state

### Generation 1 Target Index

The active Generation 1 routing surface is:

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Console/Console-Gen1-Index.md`
