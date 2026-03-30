# 14 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - making `Workspace 1` implementation ready
  - grounding the first shared workspace cut in the live shell/store seams
  - deciding the smallest safe migration order before code changes start
- Primary source docs for this planning pass:
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-1 - Shared Workspace Owner And State Extraction.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-0.1 - Codebase Research And Implementation Audit.md`
  - `docs/Phase-Plans/Tasks/Old/05.1B - VR-SP - Split Pane Authoring And Divider Controls.md`
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.
- Entry status markers:
  - `[ ]` = still open / still driving active work
  - `[x]` = completed or superseded enough that it is no longer the active entry

## Doc Body

## Session 1 Notes

##### [ ] [214] 2026-03-30 06:36 - `Workspace 1` should be the smallest safe ownership extraction, not a broad shell rewrite

Context block:

- a direct code read was repeated against:
  - `src/app/AppShell.tsx`
  - `src/app/store/useAppStore.ts`
  - `src/app/spaghetti/store/useSpaghettiStore.ts`
  - `src/app/hosts/BrowserDockHost.tsx`
  - `src/app/hosts/SpaghettiWindowHost.tsx`
- the current shell already has enough real behavior that the main implementation risk is ownership churn, not missing split mechanics

Locked direction:

- `Workspace 1` should introduce one shared workspace seam under `src/app/workspace/`
- move shell-owned placement truth there first:
  - left-dock split state
  - browser floating placement ownership
  - editor placement/presentation ownership
  - active pane identity
  - protected main-viewer identity
- keep `useAppStore` as the shared activation and intent seam
- keep `BrowserDockHost` and `SpaghettiWindowHost` as transition adapters during the first cut
- do not absorb viewport-local chrome work into `Workspace 1`
- do not absorb persistence into `Workspace 1`

Why this matters:

- `AppShell` still owns local shell state like `leftDockWidth`, `isLeftDockViewportSplit`, `isBrowserFloating`, and `workspaceSplitMenu`
- `useSpaghettiStore` still owns placement-facing editor viewport state such as `editorViewportsById`, `activeEditorViewportId`, and the window/split/position setters
- `useAppStore` already owns the right shared activation seam through `activeSurface`, `floatingShellActivationRequest`, and `requestConsoleContextSync`
- that makes the safest first implementation path very clear:
  - extract ownership first
  - preserve current renderers
  - broaden hosting later in `Workspace 2`

## Session 2 Notes

##### [ ] [215] 2026-03-30 10:56 - `Workspace 5` should extract the child-window host contract from `ConsoleDock`, not invent a fresh detached-shell system

Context block:

- a direct code read was repeated against:
  - `src/app/console/ConsoleDock.tsx`
  - `src/app/hosts/BrowserDockHost.tsx`
  - `src/app/workspace/`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-5 - Multi-Window Surfaces And Detached Browser Pop-Out.md`
- the current `Workspace 5` direction was already correct, but the next implementation cut still needed a more explicit extraction boundary from the live `Console` proof

Locked direction:

- `Workspace 5` should reuse the existing `ConsoleDock` browser-window mechanics as the canonical first proof:
  - named child-window open/focus behavior
  - child-document stylesheet copying
  - stable portal-host creation
  - close-handback through `beforeunload`
  - child-window key/focus forwarding where activation depends on it
- those responsibilities should move behind one shared workspace-facing child-window host contract under `src/app/workspace/`
- `ConsoleDock` should stay feature-local for transcript and command behavior
- `BrowserDockHost` should be the first non-Console adopter of that shared contract
- detached `Spaghetti Editor` browser-window hosting should remain a follow-on after Browser proves the generalized owner-transfer seam

Why this matters:

- the workspace family already has the right single-owner architecture direction, but the live code proves that browser-window hosting is not just a placement enum
- `ConsoleDock` already carries the real browser-window contract:
  - `window.open('', 'parahook-console', ...)`
  - `copyDocumentStyles(...)`
  - `.ConsolePopoutRoot`
  - `handlePopoutWindowClosed()`
- that makes the safest next move equally clear:
  - extract the host contract
  - keep feature rendering local
  - bring `Browser` onto the shared pop-out rule second

##### [ ] [216] 2026-03-30 11:31 - The next `Workspace 5` follow-on should combine editor pop-out and multiple-open-graph truth instead of treating them as unrelated shell extras

Context block:

- after the shipped first Browser pop-out slice, two concrete user-facing needs became explicit:
  - `Spaghetti Editor` needs a visible titlebar `Pop-Out` affordance
  - the app needs multiple graphs open at once without pretending one rebound editor shell counts as multiple open editors

Locked direction:

- add the editor `Pop-Out` button into the docked-right titlebar controls cluster so it matches the Browser pop-out affordance pattern
- route that editor button through the same shared child-window host contract already extracted for `Console` and `Browser`
- keep editor authored graph truth in `useSpaghettiStore`, but let the shared workspace seam own the visible editor surface-instance list and their placement state
- bind each editor surface instance to one graph document id so multiple graphs can stay honestly open at once
- use Browser `Open Editors` as the honest surface launcher/switcher instead of relying on one globally rebound active editor shell

Why this matters:

- editor browser-window detachment and multi-graph visibility are coupled:
  - once editor surfaces can pop out, the system must already know which graph each visible editor surface instance owns
  - otherwise the child-window host rule has no stable editor surface identity to transfer
- that makes the next safest move clear:
  - add real editor surface-instance identity first-class to the workspace seam
  - then let those instances render in split, floating, and popped-out placements
