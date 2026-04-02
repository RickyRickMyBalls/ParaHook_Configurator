# Workspace Cleanup Task Stack

## Doc Header

### Doc History
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

#### 1. [ ] [Workspace 7.5-7 - Spaghetti Editor Split Modes And Console Alignment](./Workspace_Phase%20Workspace-7.5-7%20-%20Spaghetti%20Editor%20Split%20Modes%20And%20Console%20Alignment.md)
Why this is here:
- this is the current first larger cleanup to plan because split-mode semantics and console alignment are likely the broadest foundation under several of the later `Spaghetti Editor` cleanup tasks
- this should clarify how split-host `Spaghetti Editor` behavior and console interaction are supposed to work together before we polish the more local presentation or visual seams

#### 2. [ ] [Workspace 7.5-8 - Global Workspace Split Ghost Preview Truth](./Workspace_Phase%20Workspace-7.5-8%20-%20Global%20Workspace%20Split%20Ghost%20Preview%20Truth.md)
Why this is here:
- the split ghost preview is a direct workspace interaction cue and should be honest before we spend too much time polishing presentation details
- this should be fixed as a shared workspace-shell affordance, with `Spaghetti Editor` as the first validation surface instead of turning split ghost logic into spaghetti-only code

#### 3. [ ] [Workspace 7.5-9 - Spaghetti Presentation Mode Truth](./Workspace_Phase%20Workspace-7.5-9%20-%20Spaghetti%20Presentation%20Mode%20Truth.md)
Why this is here:
- this separates reduced-chrome `Essentials` behavior from `Overlay` behavior and cleans up the `Spaghetti Editor` primary presentation control into an explicit four-mode contract
- it fits after the broader split-mode semantics cleanup and after the split ghost affordance is honest enough to support clearer presentation behavior

#### 4. [ ] [Workspace 7.5-10 - Spaghetti Editor Popout Window Repair](./Workspace_Phase%20Workspace-7.5-10%20-%20Spaghetti%20Editor%20Popout%20Window%20Repair.md)
Why this is here:
- the popout path is still broken and deserves its own larger cleanup task
- it is ordered after the earlier split-mode and presentation-truth work so we do not lock popout behavior against shell semantics that are still shifting

#### 5. [ ] `Workspace 7.5-11 - Spaghetti Editor Split-Mode Visual Parity With Floating Window`
Why this is here:
- this is a more visual polish and parity task rather than the first structural cleanup to tackle
- it should land after the underlying split semantics, presentation truth, and popout behavior are more stable
