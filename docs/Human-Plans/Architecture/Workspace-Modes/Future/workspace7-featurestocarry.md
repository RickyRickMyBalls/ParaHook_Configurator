# Workspace 7 Features To Carry Into The Shared Shell Template

## Doc Header

### Doc History
1. 2026-03-31 16:56: Reworked this scratch carry-list into a real shared-shell-behavior template note so the Browser-first cleanup can now be translated into one reusable workspace contract for Spaghetti Editor and future surfaces instead of staying a loose set of remembered feature bullets

### Purpose

Use this note to list the shell behaviors that should stop being Browser-only and become part of one shared workspace host template.

This file is not the final phase spec.

This file is the carry-forward checklist that answers:
- what user-facing shell behaviors should every eligible workspace surface share
- what belongs to the generic shell contract
- what should stay feature-local
- what still looks incomplete today

## Doc Body

### Short Read

The Browser cleanup already proved several good shell behaviors.

The goal now is not to copy Browser.

The goal is to convert those behaviors into one reusable shell contract so:
- `Browser`
- `Spaghetti Editor`
- `Console`
- later workspace surfaces

can all adopt the same host behavior model.

### What "Template" Means Here

In this repo, a template should not mean:
- copied JSX
- copied CSS
- identical titlebars everywhere
- one giant shared component that erases valid feature differences

In this repo, a template should mean:
- one shared shell action set
- one shared host-mode lifecycle
- one shared dock or toolbar ownership model
- one shared placement and restore model
- thinner host adapters that render feature content on top of the same workspace-owned shell rules

### Shared Shell Actions

These actions should become one shared shell behavior template for eligible surfaces:

- [ ] `Focus`
  - bring the chosen surface to the foreground and mark it as the active surface

- [ ] `Float`
  - move a slotted or docked surface into floating mode through workspace-owned truth

- [ ] `Pop Out`
  - move a surface into browser child-window mode through the same owner-transfer contract as `Float`

- [ ] `Redock`
  - return a detached surface to the workspace through one deterministic redock path

- [ ] `Split Top`
  - place the surface into a new split above the target slot

- [ ] `Split Right`
  - place the surface into a new split to the right of the target slot

- [ ] `Split Bottom`
  - place the surface into a new split below the target slot

- [ ] `Split Left`
  - place the surface into a new split to the left of the target slot

- [ ] `Dock To Named Host`
  - let an eligible surface claim a named host route like the primary left dock when that route exists

- [ ] `Close`
  - close or detach that exact surface instance without destroying unrelated surfaces

### Shared Host-Mode Guarantees

These are the deeper behavior guarantees the shell template should provide:

- [ ] Slot, floating, and popout should feel like peer host modes for the same surface instance
- [ ] Dragging a surface out of a slot should dissolve the empty slot and recombine layout deterministically
- [ ] Floating and popout should preserve explicit host affinity instead of guessing from current active viewport
- [ ] Redock should use one canonical workspace path instead of a Browser-only path versus a Spaghetti-only path
- [ ] Restore and persistence should preserve the same placement truth regardless of surface kind
- [ ] Right-click shell menu behavior should be shared where the same shell actions exist
- [ ] Split-preview and split-commit behavior should use the same shell language across surfaces

### Shared Named Host Routes

These routes should be modeled generically instead of by Browser-only naming:

- [ ] Primary left dock host
  - example user-facing behaviors:
    - drag a surface onto `ParaHook Generator v20` to dock
    - use a dock-left action to claim that host explicitly
    - use a quick-return action to dock back there

- [ ] Slotted viewport host
  - example user-facing behavior:
    - drag a detached surface into a viewport edge to create a split slot

- [ ] Floating host
  - example user-facing behavior:
    - move a surface into a floating shell without creating a second copy

- [ ] Popout host
  - example user-facing behavior:
    - move the same surface into a child window through one owner-transfer rule

Important rule:
- a named host route should be a reusable workspace concept
- not a Browser-only `toolbar owner` concept by type name

### Current User-Facing Behaviors To Carry

These are the concrete behaviors already surfaced by the earlier Browser cleanup and the carry list:

- [ ] Drag a window onto `ParaHook Generator v20` to dock
  - current carry read:
    - Spaghetti still needs this to behave like Browser
  - generic shell meaning:
    - `dock to named host`

- [ ] `"<"` button to dock back in left
  - current carry read:
    - quick return to the named left-dock host should not be Browser-only
  - generic shell meaning:
    - `redock to named host`

- [~] Top-right `Pop Out` button
  - current carry read:
    - still broken or inconsistent on some surfaces
  - generic shell meaning:
    - `popout through shared owner-transfer contract`

- [x] Right-click to get split menu
  - current carry read:
    - Browser already proved the shell action menu is useful
  - generic shell meaning:
    - `shared shell context menu`

- [ ] Scroll behavior when split
  - current carry read:
    - shell chrome and content scroll behavior still need to stay usable in constrained split layouts
  - generic shell meaning:
    - `host-mode usability parity`

- [ ] Visible `Pop Out` affordance on every eligible surface
  - current carry read:
    - the action should exist consistently where popout is supported
  - generic shell meaning:
    - `shared shell action availability`

### What Should Stay Feature-Local

These should not be forced into the shared shell template:

- Browser tree commands and content actions
- graph build or compile actions
- viewer-specific camera and gizmo actions
- feature-specific titlebar extras that are not host ownership
- feature-specific content layout inside the window body

### What The Template Should Standardize First

The first reusable shell template should standardize:

- [ ] one shared surface placement state shape
- [ ] one shared host affinity and restore model
- [ ] one shared named host-route ownership seam
- [ ] one shared shell action menu
- [ ] one shared redock path
- [ ] one shared popout owner-transfer rule

### Browser Vs Spaghetti Read

Browser currently proves:
- explicit workspace-owned dock ownership
- direct use of shared detached-surface redock
- clearer shell behavior separation from feature content

Spaghetti currently proves:
- richer per-surface placement state
- richer restore metadata
- more honest multi-surface identity for editor instances

Spaghetti still needs:
- less shell ownership inside `SpaghettiWindowHost`
- less shell window-mode truth living only inside `useSpaghettiStore`
- the same named-host, redock, and popout contract Browser already pushed further

### Future Surfaces That Should Benefit

This template should be reusable for:

- `Browser`
- `Spaghetti Editor`
- `Console`
- future `Radio`
- future `Layer Manager`
- future `Export`
- future debug or inspector windows

Important rule:
- a future surface should not need its own Browser-style cleanup ladder just to get normal shell behavior

### Missing Today

These are the gaps this note is carrying toward `Workspace 7.5`:

- [ ] generic named-host ownership instead of Browser-only toolbar ownership naming
- [ ] generic quick-return-to-host behavior for eligible surfaces
- [ ] generic popout contract that feels the same across Browser, Spaghetti, and future windows
- [ ] generic constrained split-layout usability behavior such as scroll and menu access
- [ ] thinner host adapters that delegate more lifecycle truth into workspace state

### Post-7.3 Carry Note

One later carry-forward behavior still worth keeping visible:

- [ ] Allow dragging one viewport-hosted surface into an already split viewport and splitting that viewport locally
  - if the target area is wide, left/right nested split suggestions should be available
  - if the target area is tall, top/bottom nested split suggestions should be available
  - this belongs to the shared workspace split-authoring language, not to one surface family only
