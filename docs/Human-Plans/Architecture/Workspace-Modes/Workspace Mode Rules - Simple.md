# Workspace Mode Rules - Simple

## Doc Header

### Doc History
2. 2026-04-03 08:07: Refined the model viewport rules after chat clarified that the main model viewport should also expose a top-right `open in new browser` button, and locked that the primary viewer path should open a copied viewport rather than removing the in-app main viewport
1. 2026-04-03 08:03: Replaced the empty stub with a compact workspace-mode UI rules reference grounded in the live viewport-shell, left-dock, and Browser host behavior so future toolbar and viewport work can align to one simple template

### Purpose

This is the short reusable rules list for workspace-mode UI behavior.

Use it when:
- making new viewport headers
- deciding how a surface should split, float, or pop out
- deciding whether something belongs in a viewport slot or in the primary left dock
- checking whether a new toolbar or viewport shell still matches the current ParaHook direction

### Read Me First

This file is intentionally simple.

It mixes:
- current shipped behavior
- locked direction that already matches the workspace docs

If a deeper workspace doc disagrees later, use this file as the fast template and then confirm in the full workspace docs.

## - 0.0 - Global Rules

### 0.1 - Every viewport uses one shared top header
- Every viewport should have one title bar at the top.
- The top-left control comes first.
- The viewport name comes second.
- The top-right button belongs on the far right when that surface supports opening in a new browser window.

### 0.2 - The top-left button is the shared viewport control button
- The left button should stay the first header control.
- Left click may keep the surface's local quick action when that surface already has one.
- Right click on that same button should open the viewport type picker.

### 0.3 - Right click on the header opens viewport actions
- Right clicking the header should open the viewport action menu.
- The shared first actions are:
  - `Split >`
    - `Split Top`
    - `Split Right`
    - `Split Bottom`
    - `Split Left`
  - `Viewport Type`
    - viewport type list
  - `Float`
  - `Pop Out`
  - `Close`
- Primary protected surfaces can hide actions that should not exist there.

### 0.4 - Split creates a real viewport slot, not a fake overlay
- A split should create or reuse real layout space in the viewport tree.
- The new surface should size to the split result.
- Split behavior should not look like a temporary floating panel pretending to be tiled.

### 0.5 - Surface kind and surface instance are different things
- `Browser`, `Console`, `Spaghetti Editor`, and `Model Viewport` are viewport types.
- A split usually creates a new surface instance of the same type by default.
- That means two Browsers can exist honestly at the same time without pretending they are one widget.

### 0.6 - Floating and browser-window open are peer host modes
- A surface can live in a viewport slot, a floating window, or a pop out window.
- Moving between those host modes should keep the same surface identity when possible.
- Rehoming should feel like moving the same surface, not destroying one and inventing a new unrelated one.

## - 1.0 - Browser

### 1.1 - Browser split creates a real Browser viewport
- When Browser is split left, right, top, or bottom, it should become a real viewport slot sized by the split tree.
- The Browser in that slot should use the same viewport header rules as other surfaces.
- A split Browser is not the same thing as the primary left-dock Browser host.

### 1.2 - Browser can also live in the `ParaHook Generator v20` left dock
- Browser has a second honest home in the primary left dock beside the status area.
- That left-dock route belongs only to the primary model viewport area.
- It should read like a deliberate anchored Browser home, not like a leftover app-global panel.

### 1.3 - Only one Browser owns the left-dock route at a time
- The left dock should have one explicit Browser owner.
- Any chosen Browser surface can claim that route.
- Other Browser copies in slots, floating windows, or pop outs should stay independent until the user explicitly docks one left.

### 1.4 - Browser left dock and Browser viewport are not the same rule
- `Browser in left dock` means anchored primary-toolbar ownership.
- `Browser in viewport slot` means normal viewport-slot behavior with shared header actions.
- Do not blur these two homes together when making new Browser UI.

### 1.5 - Browser can move between docked, slotted, floating, and pop out
- A Browser may live in the primary left dock.
- A Browser may live in a viewport slot.
- A Browser may float.
- A Browser may pop out.
- Dock-left or quick-dock should rehome the chosen Browser surface back into the left dock deterministically.

## - 2.0 - Console

### 2.1 - Console follows the shared viewport shell
- Console in a viewport slot should use the same shared header contract as other viewport surfaces.
- It should split through the same viewport menu and layout tree.

### 2.2 - Console is a viewport surface, not a special exception
- Console should behave like a real workspace surface that can live in slot, floating, or pop out modes.
- Avoid one-off Console shell behavior unless the command workflow truly requires it.

## - 3.0 - Model Viewport only rules

### Primary

#### 3.1 - The primary model viewport owns the left dock family
- The unified left dock belongs to the protected primary model viewport.
- That left dock includes:
  - the `ParaHook Generator v20` status area
  - the Browser dock target
  - the Meatball / Spaghetti dock target
  - the resize rail
  - the split toggle

#### 3.2 - The primary model viewport stays protected
- The primary model viewport should not expose destructive slot actions the same way secondary slots do.
- The shared shell may still render the same header, but protected actions can be removed there.

#### 3.3 - The main model viewport should have `open in new browser`
- The main model viewport should also show a top-right `open in new browser` button.
- For the primary model viewport, that button should create a copied viewport in a new browser window.
- The in-app primary model viewport should remain in place.
- This should read as `open another view of this viewport`, not `remove the main viewport from the app`.

### Secondary/not primary

#### 3.4 - Secondary model viewports are honest extra viewports
- Additional model viewports are real viewport slots, not overlays.
- They share model truth but own their own local camera and viewport chrome state.

#### 3.5 - Secondary model viewports may also open in new browser
- Non-primary model viewports can also expose the same top-right `open in new browser` button.
- For secondary model viewports, the behavior can stay closer to a true moved or detached surface if that matches the host model.
- The primary viewport rule is the special one: open a copy and leave the main viewport in place.

## - 4.0 - Spaghetti Editor

### 4.1 - Spaghetti Editor follows the shared viewport header rules
- Spaghetti Editor in a viewport slot should use the same header shell, split actions, float behavior, and pop out behavior as other eligible surfaces.

### 4.2 - Spaghetti Editor can live in the primary left dock family
- The primary left dock still reserves a dock target for the Meatball / Spaghetti side of the UI.
- That is separate from a slotted `Spaghetti Editor` viewport.

### 4.3 - Multiple Spaghetti surfaces should be treated as honest surfaces
- A split `Spaghetti Editor` should be treated as a real additional surface, not just a temporary view mode.
- If two Spaghetti surfaces point at the same graph they should stay consistent.
- If one is rebound later, that should be an explicit surface decision.

## - 5.0 - Template Summary

### 5.1 - Fast template
- One shared viewport header
- Left control first, title second, `open in new browser` on right
- Right click left control changes viewport type
- Right click header opens split and host-mode actions
- Split creates a real viewport slot
- Left dock belongs to the primary model viewport
- Main model viewport also gets `open in new browser`
- Main model viewport `open in new browser` makes a copy
- Browser has two honest homes:
  - primary left dock
  - normal viewport slot
- Only one Browser owns the left-dock Browser route at a time

### 5.2 - Anti-drift guardrails
- Do not invent a different header pattern for each surface.
- Do not treat Browser left dock and Browser viewport slot as the same UI rule.
- Do not let unrelated Browser copies suppress the left-dock Browser owner.
- Do not fake split behavior with floating panels.
- Do not make the left dock app-global again after it was moved under the primary viewport.
