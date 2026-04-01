# Workspace Phase Workspace-7.5-4 - Browser And Spaghetti Shell Parity Cleanup

## Doc Header

### Doc History
1. 2026-04-01 08:35: Split the open multi-`Spaghetti Editor` carry item out into a new standalone `Workspace 7.5-5` future phase doc so `7.5-4` can stay focused on Browser-versus-Spaghetti shell-parity cleanup while the deeper multiple-editor-surface work now has its own dedicated planning surface
1. 2026-04-01 02:36: Added the next open `7.5-4` carry item after a code read on `Spaghetti Editor` surface identity, recording that the underlying store already supports multiple editor viewport records but the shell still routes too much ownership through one active editor, so allowing more than one honest open `Spaghetti Editor` surface is now an explicit cleanup target before implementation
1. 2026-04-01 02:30: Logged the next `7.5-4` parity cleanup after extending smooth split-header drag-out to both slotted `Console` and the final live `Spaghetti Editor` handoff path, so both surfaces now keep following the pointer as floating windows until mouse-up instead of snapping into stationary floats after leaving the split slot
1. 2026-04-01 02:16: Logged the second concrete `7.5-4` parity cleanup after adding a seeded floating-drag handoff for slotted `Spaghetti Editor` drag-out, so the editor now keeps following the pointer after leaving a split header until mouse-up instead of snapping into a floating shell and sticking in place
1. 2026-04-01 02:10: Logged the first concrete `7.5-4` parity cleanup after widening slot-header drag-out so non-primary slotted `Spaghetti Editor` now matches Browser by consuming the source split slot and reopening as a floating surface when dragged back into the model-viewport area, instead of leaving the old split host behind
1. 2026-04-01 02:03: Added this native `Workspace 7.5-4` follow-on doc as the post-`7.5-3` cleanup lane so Browser, Spaghetti, and later workspace surfaces now have one explicit parity-cleanup home for the remaining shell-behavior mismatches, and added a dedicated cleanup-log section so each landed parity fix can be tracked in one running place instead of being rediscovered from chat history

### Purpose

Use this phase to track and clean up the remaining Browser-versus-Spaghetti shell-behavior mismatches after the shared host contract landed in `7.5-1` through `7.5-3`.

The goal is not to turn Spaghetti into Browser.
The goal is to make Browser and Spaghetti behave the same way when they are acting as workspace surfaces.

### Scope

This phase covers:
- shell-behavior parity between Browser and Spaghetti
- later cleanup of small remaining host or titlebar inconsistencies
- documenting parity rules that later toolbars or windows should inherit
- logging each landed cleanup so the carry list stays visible

This phase does not cover:
- broad Browser UX redesign
- broad Spaghetti feature redesign
- forcing identical feature-local controls where the feature should stay different
- a full new host-contract extraction phase after `7.5`

## Doc Body

### Summary

`Workspace 7.5-4` is the parity-cleanup lane that follows the main `7.5` host-standardization work.

It should answer one simple question:
- now that Browser and Spaghetti share the same shell contract, where do they still feel different in ways that should be standardized

This is where small remaining shell mismatches should go:
- drag behavior
- dock or redock behavior
- split behavior
- popout behavior
- multiple-surface identity behavior
- titlebar or window actions when they are really shell actions

### Current Read

After shipped `7.5-1` through `7.5-3`:
- Browser is still the clearest shell proof surface
- Spaghetti is much closer to the same contract, but some behaviors may still feel different because of older editor-specific habits
- future windows and toolbars now need a visible cleanup and carry-forward lane so they inherit the shared shell behavior instead of drifting back into one-off behavior

Important rule:
- parity here means shell parity
- not forced feature parity

Examples of what should usually be congruent:
- float
- popout
- redock
- split into `top`, `right`, `bottom`, or `left`
- preserve the same surface identity while moving between host modes
- consume the source host when a surface is dragged out instead of leaving stale copies behind
- allow surface families that already support multiple instances to keep more than one honest open surface at the same time

Examples of what may still stay local:
- feature-specific titlebar controls
- feature-specific panel content
- feature-specific presentation modes that do not represent shared shell lifecycle

### Locked Direction

`Workspace 7.5-4` should be:
- a cleanup lane
- a parity lane
- a carry-forward rules lane for later toolbars or windows

`Workspace 7.5-4` should not be:
- a restart of the full `7.5` contract extraction
- a broad visual redesign lane
- a demand that Browser and Spaghetti have identical feature UX

### First Working Rule Set

Treat these as the default shared shell rules unless a later decision says otherwise:

- Browser and Spaghetti should use the same host-transition contract for:
  - `focus`
  - `float`
  - `popout`
  - `redock`
  - `split`
  - named host-route claim when supported
- dragging a slotted surface out should move that same surface and consume the old host
- dragging to a valid dock target should rehome through shared workspace logic
- titlebar or context-menu shell actions should mean the same thing across surfaces when they trigger the same host transition
- persistence should restore these surfaces without reviving older shell systems

Current intentional exclusions:
- do not treat Browser's `e` essentials button as a universal cross-surface rule yet
- do not force Spaghetti to copy Browser-only presentation controls if they are not really shell behavior

### Cleanup Log

Use this section to record the concrete parity cleanups that land under `7.5-4`.

1. 2026-04-01 02:36: Logged the next open carry item for `7.5-4`: `Spaghetti Editor` already has multiple viewport records in the data layer, but the shell still treats one active editor as the main live owner in too many places, so allowing more than one honest open editor surface is now a tracked cleanup target before implementation.
1. 2026-04-01 02:30: Extended split-header drag-out smoothness to the remaining shared-shell surfaces by making both slotted `Spaghetti Editor` and slotted `Console` keep a live floating drag handoff after leaving a split host, so they now follow the pointer until mouse-up the same way Browser already does.
1. 2026-04-01 02:16: Added a seeded floating-drag handoff for slotted Spaghetti header drag-out, so the editor now stays attached to the pointer after leaving the split slot and only settles when the user releases the mouse, matching the smoother Browser drag-out feel.
1. 2026-04-01 02:10: Widened slot-header drag-out from Browser-only to the other non-primary non-viewer workspace surfaces, and proved the Spaghetti split-slot case with a focused AppShell regression so dragging a slotted editor out into the model viewport now consumes the old split slot and reopens the same surface as a floating window.
1. 2026-04-01 02:03: Created the `7.5-4` cleanup lane and established this running cleanup log so the remaining Browser-versus-Spaghetti shell parity work has one visible home.

### Candidate Cleanup Buckets

- Browser and Spaghetti titlebar action parity where those actions are really shell verbs
- drag-out, drag-back, and split rehome parity
- dock-target and quick-dock parity
- popout and dock-back parity where behavior should match
- handoff notes into the dedicated `Workspace 7.5-5` multiple-editor follow-on once the cleanup item grows beyond small parity fixes
- future toolbar carry-forward rules once another surface starts using the same shell contract

### Open Follow-On - Multiple Spaghetti Editors

Current read:
- `useSpaghettiStore` already supports multiple editor viewport records through `editorViewportsById` and `editorViewportOrder`
- `AppShell` and `SpaghettiWindowHost` still center too much shell behavior on `activeEditorViewportId` and one active editor slot
- that means the data layer is ahead of the shell layer

What this carry item should achieve:
- allow more than one `Spaghetti Editor` surface to stay open at once as a first-class workspace surface
- keep titlebar and host actions attached to the editor surface the user interacted with, not only the globally active editor
- treat `activeEditorViewportId` as focus truth, not one-editor shell ownership truth

Current planning home:
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-5 - Multiple Spaghetti Editor Surface Parity.md`

Likely files for that later cleanup:
- `src/app/AppShell.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/spaghetti/store/useSpaghettiStore.ts`
- `src/app/workspace/useWorkspaceStore.ts`

### Likely Files

- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/AppShell.tsx`
- `src/app/workspace/workspaceSurfaceActions.ts`
- `src/app/workspace/useWorkspaceStore.ts`
- `src/app/console/ConsoleDock.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes/Future/workspace7-featurestocarry.md`

### Done Shape

`Workspace 7.5-4` is done when:
- the remaining shell mismatches worth standardizing are either fixed or explicitly documented as intentional differences
- later workspace surfaces have one clear carry-forward parity rule set
- Browser and Spaghetti feel like members of the same workspace shell family even when their feature-local UX still differs
