# Workspace Cleanup Task Stack

## Doc Header

### Doc History
1. 2026-04-03 10:02: Added `Workspace 7.5-16 - Console Workspace Modes Entry` as the new top cleanup target after chat clarified that workspace-mode options should get a real console home, and linked this stack entry to a new future phase doc that locks `Root > Workspace Modes` with alias `wm` as the next research-first console integration task
1. 2026-04-03 09:58: Moved the finished `Workspace 7.5-10`, `Workspace 7.5-12`, and `Workspace 7.5-14` phase docs from `Future/` into `Shipped/` after confirming both their top-level closeout text and permanent `docs/CHANGELOG.md` entries, and repointed this cleanup stack so the closed items now link to their canonical shipped phase files while the stack itself stays in `Future/`
1. 2026-04-03 09:42: Moved the finished `Workspace 7.5-15 - Model Viewport Local View Toolbar State` phase doc from `Future/` into `Shipped/` after closeout, and repointed this cleanup stack entry so the ladder still links to the canonical shipped phase file instead of leaving the completed doc in the future-planning bucket
1. 2026-04-03 09:41: Closed `Workspace 7.5-15 - Model Viewport Local View Toolbar State` in this cleanup stack after live validation confirmed the local toolbar and gizmo anchor repairs now behave correctly in split model viewports, updating the stack note so later model viewport chrome polish can be planned as new work instead of reopening this finished local-toolbar cleanup
1. 2026-04-03 09:09: Added `Workspace 7.5-15 - Model Viewport Local View Toolbar State` as the new top cleanup target after chat confirmed that opening or minimizing the `View` toolbar in one model viewport still clones that UI state across every model viewport instead of staying local to the viewport the user clicked
1. 2026-04-03 08:50: Closed `Workspace 7.5-14 - Model Viewport Split Camera Persistence` in this cleanup stack after live validation confirmed the split camera reset is fixed, updating the stack note so `7.5-14` now reads as finished workspace behavior instead of the current first active cleanup target
1. 2026-04-03 08:35: Added `Workspace 7.5-14 - Model Viewport Split Camera Persistence` as the new top cleanup target after live validation showed the model viewport still resets both cameras when splitting, and linked this stack entry to a new research-first future phase doc so the remaining camera-persistence bug can be traced and planned cleanly
1. 2026-04-02 21:31: Closed `Workspace 7.5-12 - Popout Window Titlebar Split Menu` in this cleanup stack after the popup-local child-window shell shipped through Browser adoption, updating the stack note so `7.5-12` now reads as finished capability work while later popup-local polish can be planned as separate phases instead of silently reopening the completed titlebar-split ladder
1. 2026-04-02 16:58: Added `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-12 - Popout Window Titlebar Split Menu.md` as the new research-first planning surface for the later popout titlebar split-menu capability and updated this cleanup stack so `Workspace 7.5-12` now points at that real phase doc instead of staying a plain text placeholder
1. 2026-04-02 16:27: Added a new later cleanup placeholder `Workspace 7.5-13 - Model Viewport Popout Window` after chat clarified that the model viewport should gain its own popout button and child-window path, keeping that capability separate from both the already-closed `7.5-10` `Spaghetti Editor` popout repair and the new `7.5-12` popout titlebar split-menu task
1. 2026-04-02 16:25: Added a new later cleanup placeholder `Workspace 7.5-12 - Popout Window Titlebar Split Menu` after chat clarified that right-click split support for popped-out Browser, Console, and `Spaghetti Editor` surfaces should be treated as its own future workspace phase instead of being folded back into the already-closed `Workspace 7.5-10` popout repair
1. 2026-04-02 16:23: Cleaned up this workspace cleanup stack after the later `Workspace 7.5-10` popout follow-up fixes confirmed the phase is still honestly closed, marking `7.5-10` done in the stack and updating its note so the ladder now treats popout repair as shipped while leaving any future popout titlebar split-menu capability to a new later workspace phase instead of silently reopening the finished repair slot
1. 2026-04-02 11:44: Updated this cleanup stack after `Workspace 7.5-10` became the active next planning target, replacing the plain text popout-repair placeholder with a linked future phase doc so the workspace ladder now points directly at the new research-first `Spaghetti Editor` popout planning surface
1. 2026-04-01 17:13: Renumbered the larger `Workspace 7.5` cleanup ladder so the task stack now matches the intended execution order, assigning `Workspace 7.5-7` through `Workspace 7.5-11` across the split-mode and console alignment, split ghost preview repair, presentation-mode truth, popout repair, and split-versus-float visual parity tasks while repointing the presentation-mode link to its new `Workspace 7.5-9` file name
1. 2026-04-01 17:10: Reworked this cleanup stack after chat clarified that the first task should live at the top rather than the bottom, flipping the ordering rule to top-first and expanding the stack with larger `Spaghetti Editor` cleanup themes around split-mode and console alignment, split ghost previews, presentation-mode truth, popout repair, and split-versus-float visual parity
1. 2026-04-01 17:07: Added this umbrella cleanup-stack doc so larger future workspace cleanups can be captured in one lightweight planning surface without immediately overcommitting them into implementation-ready phase docs, locking the ordering rule that the bottom-most task is the next one to plan or execute

### Purpose

Use this doc to track larger workspace cleanup tasks that still need planning.

These are not meant to be tiny residue fixes.
Each item here is expected to be large enough that it will likely become its own future phase doc before implementation starts.

### Ordering Rule

This stack is intentionally ordered so:
- the top-most task is the next one to plan or execute
- the first item is the current first planning target
- new larger cleanup tasks should be inserted where they best fit the real execution order, not automatically appended

## Doc Body

### Summary

This is the umbrella backlog for larger workspace cleanup work that sits beyond the just-shipped narrow fixes.

Use it to:
- capture bigger cleanup themes before they are fully broken into phases
- preserve ordering without bloating the finished phase docs
- make it obvious which larger cleanup is next

### How To Use

When a new larger cleanup appears:
1. Insert it where it best fits the real execution order below.
2. Keep the note short unless it is immediately becoming the next planning target.
3. When one item becomes real execution work, spin it into its own future phase doc and keep a link here.

### Cleanup Stack

#### 1. [ ] [Workspace 7.5-16 - Console Workspace Modes Entry](./Workspace_Phase%20Workspace-7.5-16%20-%20Console%20Workspace%20Modes%20Entry.md)
Why this is here:
- this is now the current first larger cleanup to plan because workspace modes need one honest console home instead of being spread across unrelated paths or left only to viewport chrome
- the root console should gain `Workspace Modes` with alias `wm`, and that should enter a dedicated workspace-modes section that can become the stable console home for future workspace-mode actions

#### 2. [x] [Workspace 7.5-15 - Model Viewport Local View Toolbar State](../Shipped/Workspace_Phase%20Workspace-7.5-15%20-%20Model%20Viewport%20Local%20View%20Toolbar%20State.md)
Why this is here:
- this phase shipped the per-viewport `View` toolbar and gizmo anchor repairs and is now closed after live validation confirmed that expanding or minimizing one model viewport no longer clones or misaligns sibling toolbar chrome
- later model viewport chrome polish should be treated as new follow-up work instead of reopening this finished local-toolbar cleanup

#### 3. [x] [Workspace 7.5-14 - Model Viewport Split Camera Persistence](../Shipped/Workspace_Phase%20Workspace-7.5-14%20-%20Model%20Viewport%20Split%20Camera%20Persistence.md)
Why this is here:
- this phase shipped the split-camera persistence fix and is now closed after live validation confirmed that splitting a model viewport preserves the user camera across both panes
- later camera or viewport polish should be treated as new follow-up work instead of reopening this finished split-camera repair slot

#### 4. [ ] [Workspace 7.5-7 - Spaghetti Editor Split Modes And Console Alignment](./Workspace_Phase%20Workspace-7.5-7%20-%20Spaghetti%20Editor%20Split%20Modes%20And%20Console%20Alignment.md)
Why this is here:
- this is the current first larger cleanup to plan because split-mode semantics and console alignment are likely the broadest foundation under several of the later `Spaghetti Editor` cleanup tasks
- this should clarify how split-host `Spaghetti Editor` behavior and console interaction are supposed to work together before we polish the more local presentation or visual seams

#### 5. [ ] [Workspace 7.5-8 - Global Workspace Split Ghost Preview Truth](./Workspace_Phase%20Workspace-7.5-8%20-%20Global%20Workspace%20Split%20Ghost%20Preview%20Truth.md)
Why this is here:
- the split ghost preview is a direct workspace interaction cue and should be honest before we spend too much time polishing presentation details
- this should be fixed as a shared workspace-shell affordance, with `Spaghetti Editor` as the first validation surface instead of turning split ghost logic into spaghetti-only code

#### 6. [ ] [Workspace 7.5-9 - Spaghetti Presentation Mode Truth](./Workspace_Phase%20Workspace-7.5-9%20-%20Spaghetti%20Presentation%20Mode%20Truth.md)
Why this is here:
- this separates reduced-chrome `Essentials` behavior from `Overlay` behavior and cleans up the `Spaghetti Editor` primary presentation control into an explicit four-mode contract
- it fits after the broader split-mode semantics cleanup and after the split ghost affordance is honest enough to support clearer presentation behavior

#### 7. [x] [Workspace 7.5-10 - Spaghetti Editor Popout Window Repair](../Shipped/Workspace_Phase%20Workspace-7.5-10%20-%20Spaghetti%20Editor%20Popout%20Window%20Repair.md)
Why this is here:
- this phase repaired the broken `Spaghetti Editor` popout path into a working real child-window mode and is now closed
- later popout titlebar split-menu capability should be treated as a new later workspace phase instead of reopening this finished repair slot

#### 8. [ ] `Workspace 7.5-11 - Spaghetti Editor Split-Mode Visual Parity With Floating Window`
Why this is here:
- this is a more visual polish and parity task rather than the first structural cleanup to tackle
- it should land after the can we add an option to all the right click menus on the title bar? when the user underlying split semantics, presentation truth, and popout behavior are more stable

#### 9. [x] [Workspace 7.5-12 - Popout Window Titlebar Split Menu](../Shipped/Workspace_Phase%20Workspace-7.5-12%20-%20Popout%20Window%20Titlebar%20Split%20Menu.md)
Why this is here:
- this phase shipped the popup-local child-window workspace shell, popup-local titlebar split menu, and the first adopter set across `Spaghetti Editor`, `modelViewer`, `Console`, and `Browser`, so it is now closed
- later popup-local polish or parity work should be treated as new follow-up phases instead of reopening this completed titlebar-split capability ladder

#### 10. [ ] [Workspace 7.5-13 - Model Viewport Popout Window](./Workspace_Phase%20Workspace-7.5-13%20-%20Model%20Viewport%20Popout%20Window.md)
Why this is here:
- this is another new workspace capability task rather than residue from the current `Spaghetti Editor` or Browser popout work, because the model viewport still needs its own explicit popout button and child-window lifecycle
- it fits after the earlier popout repair and popout-titlebar capability phases because model viewport popout should build on the now-proven child-window substrate and the broader detached-surface or popout interaction truth already established elsewhere in the workspace ladder
