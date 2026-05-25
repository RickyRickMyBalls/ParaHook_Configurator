# Floating Window Shell Index

## Doc Header

### Doc History
3. 2026-05-25 14:47:06: Rerouted the viewport command-toolbar shell prep out of this family and into `Templates/Viewport Command Toolbar Shell`, preserving this family for detached/floating app-window shell behavior such as floated Model Viewport windows.
2. 2026-05-25 14:45:19: Added `FWS - 2 - Viewport Command Toolbar Shell` as the shared shell prep lane for Sketch, Transform, and Extrude active command toolbars before `Extrude-9` moves the active Extrude command onto ParaSlider and ParaSelect-backed node controls.
1. 2026-04-17 15:11:06: Created this umbrella planning index for the new `Floating Window Shell` family under `Architecture/Templates/`, set up the folderized `Future/` and `Shipped/` structure as a real planning home, and added the first `FWS - 1` cleanup phase so the existing shared shell behavior no longer stays trapped inside `View-Toolbar` follow-ons

### Purpose

This file is the umbrella planning index for the `Floating Window Shell` family under `Architecture/Templates/`.

Use it to answer:
- what the shared floating shell is supposed to own
- which parts of the current shell behavior are duplicated across floating hosts
- how shared shell cleanup should stay separate from feature-body ownership
- where future standalone `FWS` docs should branch

### Scope Note

This doc is intentionally about the shared floating window shell pattern.

It is mainly about:
- floating shell header chrome
- drag ownership
- resize ownership
- clamp and minimum-size behavior
- quick-dock shell actions

It is not the main home for:
- toolbar body behavior
- dashboard board behavior
- notepad document behavior
- detached model viewport runtime behavior

Those should stay in their own feature families.

## Doc Body

### Short Version

ParaHook already has a real floating window shell pattern, but it is still spread across multiple owners.

Today that pattern appears in:
- `ViewToolbar`
- `DashboardWindowHost`
- `NotepadWindowHost`
- detached floating model viewport shell in `AppShell`

The family goal is not to invent a second fake abstraction.

The family goal is to clean up the existing repeated shell truth so shared floating window behavior can widen honestly without staying trapped in feature-local branches.

### Why This Doc Exists

Recent `View-Toolbar 8` work proved that:
- floating shell chrome can already widen into one small shared owner
- all-edge and corner resize still lives only inside `ViewToolbar`
- the neighboring floating hosts still keep their own drag, rect, and clamp logic

That means the shell is now large enough to deserve its own planning home.

This doc exists so shared floating shell cleanup can happen:
- as a real architecture family
- without pretending `View-Toolbar` owns all future shell behavior
- without forcing each feature family to solve the same shell problem again

### Family Structure

Use this folder like this:

- `Floating-Window-Shell-Index.md`
  - umbrella architecture direction
  - shell ownership summary
  - shared phase ladder
- `Future/`
  - standalone floating-shell execution/planning docs
  - `Floating_Window_Shell_Phase FWS - 1 - Existing Shell Cleanup.md`
- `Shipped/`
  - later shipped shell phase records

### Cross-Doc Boundaries

Canonical ownership should stay split like this:

- `Floating Window Shell`
  - shared shell chrome
  - shared drag and resize behavior
  - clamp and minimum-size patterns
  - shell-level quick-dock action patterns
- `View-Toolbar`
  - toolbar content
  - toolbar section behavior
  - viewport-local toolbar state
- `Workspace-Modes`
  - broader workspace host-mode direction
  - split, tiled, and pop-out placement direction
  - workspace-level hosting rules
- feature hosts like `Dashboard`, `Notepad`, and detached viewer
  - body content
  - feature-specific sizing truths when they are genuinely different
  - feature-specific actions that are not shell-level

Important rule:
- do not let the shell family steal feature-body ownership
- do not leave obviously shared shell behavior permanently trapped inside one feature family

### Current Live Read

Current real floating shell users:
- `src/app/components/ViewToolbar.tsx`
- `src/app/hosts/DashboardWindowHost.tsx`
- `src/app/hosts/NotepadWindowHost.tsx`
- `src/app/AppShell.tsx`

Current honest read:
- shared floating shell chrome has started converging
- quick-dock button chrome already widened into one small shared owner
- resize ownership is still local to `ViewToolbar`
- drag and clamp logic still remain repeated per host

### Core Direction

The floating shell should become a small shared shell system, not a fake template layer.

Good shell ownership:
- titlebar drag
- resize handles
- shell header action affordances
- clamp and minimum-size helpers
- shell-level focus or activation affordances when they are truly shared

Bad shell ownership:
- dashboard board behavior
- notepad document behavior
- toolbar section behavior
- viewer runtime semantics

### Family Phase Ladder

## [ ] `FWS - 1` - `Existing Shell Cleanup`

Goal:
- clean up the existing repeated floating shell so shared behavior has one honest owner

Why it exists:
- the current shell behavior is real, but still split across local host implementations

Standalone future doc:
- [Floating_Window_Shell_Phase FWS - 1 - Existing Shell Cleanup](./Future/Floating_Window_Shell_Phase%20FWS%20-%201%20-%20Existing%20Shell%20Cleanup.md)

Current read:
- this should be the first cleanup/prep lane before any broader shared-shell widening
- the immediate likely target is shared resize parity plus remaining duplicated shell-state helpers
