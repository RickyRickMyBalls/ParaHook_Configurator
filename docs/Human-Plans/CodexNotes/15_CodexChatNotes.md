# 15 Codex Chat Notes

## Doc Header

### Doc Notes

- This is the active Codex notes file going forward.
- Use this file for raw planning notes before implementation work.
- Current planning focus:
  - promoting `Dashboard` from `Wish-Features` into a real workspace-family feature lane
  - grounding `Dashboard` and `Notepad` in the live `Workspace 7.x` surface seams
  - deciding the smallest safe first implementation cut before runtime edits start
- Primary source docs for this planning pass:
  - `docs/Human-Plans/Wish-Features/Dashboard/Dashboard.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - `docs/Human-Plans/Architecture/Workspace-Modes/Future/Workspace_Phase Workspace-7.5-17 - Dashboard And Notepad Surface Onboarding.md`
- Keep substantive timestamped entries on the absolute `[N]` numbering path from the previous file.
- Entry status markers:
  - `[ ]` = still open / still driving active work
  - `[x]` = completed or superseded enough that it is no longer the active entry

## Doc Body

## Session 1 Notes

##### [ ] [218] 2026-04-04 06:47 - `Dashboard` should let users create and edit sticky notes directly while `Notepad` stays the canonical text editor

Context block:

- product direction was clarified in chat after shipped `Dashboard-4.1`
- the user wants:
  - notes to remain linked between `Dashboard` and `Notepad`
  - direct sticky-note creation from `Dashboard`
  - inline sticky-note title/body editing directly on the card
  - `Notepad` to still feel like a simple larger text editor similar to Windows Notepad
- the user explicitly does not want a hard split where dashboard sticky notes become a totally separate copy-only system

Locked direction:

- keep one shared note model
- `Notepad` stays the canonical owner of note identity, title, and body
- `Dashboard` stays the board view and placement owner
- `Add Sticky Note` inside `Dashboard` should create a normal note immediately and pin it to the board
- `Pin to Dashboard` from `Notepad` should remain another entry path into the same sticky-note board
- sticky-note title and body should edit inline on the board while still updating the same note that can later open in `Notepad`
- because title/body become clickable edit surfaces, drag should move onto a dedicated non-text handle instead of the whole header band

Why this matters:

- this preserves the clean architecture already established:
  - note content in `useNotepadStore.ts`
  - dashboard layout in `useDashboardStore.ts`
- it avoids creating two drifting note databases or copy-sync rules
- it also changes the next dashboard roadmap priority:
  - sticky-note creation and inline editing should come before extra utility widgets like time/weather

##### [ ] [217] 2026-04-03 19:38 - `Dashboard` should promote into the workspace family as surface onboarding, not a parallel mode system

Context block:

- a direct code read was repeated against:
  - `src/app/workspace/workspaceShellTypes.ts`
  - `src/app/workspace/ViewportFrame.tsx`
  - `src/app/workspace/ViewportSurfaceRegistry.tsx`
  - `src/app/workspace/useWorkspaceStore.ts`
  - `src/app/workspace/workspaceSurfaceActions.ts`
  - `src/app/workspace/workspacePersistence.ts`
  - `src/app/AppShell.tsx`
- the existing workspace architecture already has a real slot, retained-surface, detach, redock, and persistence model, so the main remaining question was how `Dashboard` and `Notepad` should join that model honestly

Locked direction:

- `Dashboard` should promote into the real workspace-family roadmap instead of staying only under `Wish-Features`
- `Dashboard` should be the first new `WorkspaceSurfaceKind` because it proves the onboarding seam without also forcing note persistence in the same cut
- `Notepad` should likely follow as its own `WorkspaceSurfaceKind`, but its note records and autosave data should live in a dedicated note feature seam rather than the workspace layout snapshot
- `Sticky Notes` should remain a widget inside `Dashboard`, not a third new workspace surface kind
- the first runtime cut should widen the existing workspace surface-kind, slot-switch, render-registry, action, and persistence seams rather than inventing a dashboard-specific mode framework

Why this matters:

- `workspaceShellTypes.ts`, `ViewportFrame.tsx`, `ViewportSurfaceRegistry.tsx`, `workspaceSurfaceActions.ts`, and `workspacePersistence.ts` still hard-code the current four surface families, so the real work is a finite surface-onboarding cut rather than a vague architecture restart
- `AppShell.tsx` still has Browser and Spaghetti-specific host glue, but it already sits on the generic viewport tree and shared workspace actions, which means a new `Dashboard` surface can ride the same core model
- this makes the safest next move clear:
  - promote the feature into the workspace family
  - record the first code-backed owner inventory
  - then start with `Dashboard` surface-kind adoption before widening into `Notepad` and shared notes
