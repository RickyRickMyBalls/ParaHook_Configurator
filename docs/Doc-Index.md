# Doc Index

## Doc Header

### Doc History
16. 2026-03-16 00:33: Added `docs/Human-Plans/roadmap/Now-Next-Later-Much-Later.md` to the active docs map as the compact execution-order companion to the larger roadmap set
15. 2026-03-15 23:16: Added the active `docs/Human-Plans/CodexNotes/10_CodexChatNotes.md` scratchpad to the foldable docs map under `Human-Plans/CodexNotes` so the new `[2.1E]` planning pass has a discoverable live notes surface
14. 2026-03-08 00:00: Rebuilt the bottom `Foldable Outline Tree` so it now reflects the current `/docs` structure, including `Agents/`, archived Codex chat files, the current roadmap set, the full numbered family `Phase-Plans.md` files, and the current `Tasks/Future` / `Tasks/Old` split
13. 2026-03-08 00:00: Clarified the `docs/Chill-Log.md` exception again so ordinary batch activity stays only in the active chill batch, while real header/rule/structure changes to the chill log may still be recorded in its local `Doc History`
12. 2026-03-08 00:00: Clarified the `docs/Chill-Log.md` exception under the repo-wide `Doc History Rule`, so that file is now explicitly documented as logging its own changes only inside the active chill batch rather than in a local `Doc History` block
11. 2026-03-08 00:00: Expanded the repo-wide checklist legend so `L` now explicitly means legacy feature to remove and the new `R` marker means removed, giving the docs system one canonical way to track cleanup candidates versus already-removed items
1. 2026-03-08 00:00: Moved the repo-wide checklist marker/structure standard into this file as the new `Global CheckList Rule`, so the docs system now owns the main checklist language instead of `docs/Phase-Plans/00_Phase-Setup.md`
2. 2026-03-07 12:43: Added `Doc Hierarchy Repo` as the first body section with a `/docs` hierarchy tree, showing `Archive/` as folders-only for readability
2. 2026-03-08 00:00: Updated the foldable docs map to replace the old `OO - Phase-Plan.md` references with the renamed `DOC - Phase-Plans.md` family file and the current related phase task filenames
3. 2026-03-07 15:36: Retired `docs/change-List.md` from the live docs index because `docs/CHANGELOG.md` now covers both readable history and scan-friendly summary use
4. 2026-03-07 12:55: Expanded the `Human Docs Map` so the `Archive/` branch now lists archived files too instead of only archive folders
5. 2026-03-07 12:43: Added `Doc Hierarchy Repo` as the first body section with a `/docs` hierarchy tree, showing `Archive/` as folders-only for readability
6. 2026-03-07 12:36: Rebuilt this file as the central docs navigation and rules index, moving the live documentation rules into this file and retiring the old raw line-count inventory format
7. 2026-03-07 00:31: Reformatted all displayed counts to the bracketed comma style like `[0,000]`
8. 2026-03-07 00:28: Added summed line-count totals with conversations kept separate and replaced the placeholder total row in the main file list with the real non-conversation total
9. 2026-03-07 00:23: Reformatted the file inventory entries to the bracketed zero-padded count style like `[0000] - path`
10. 2026-03-07 00:19: Created this file as a `/docs` inventory index with per-file line counts for quick size scanning

### Purpose

This file is the central navigation and documentation-rules index for `/docs`.

Use it to answer:
- where a kind of documentation should live
- which doc is the canonical source for a topic
- how the docs folders are organized
- what documentation rules should be followed when adding or editing docs
- where to start when you need project context quickly

### How To Use This File

- use `Canonical Sources` when you need to know which file wins
- use `Folder Map` when you need to know where a doc belongs
- use `Documentation Rules` when creating or restructuring docs
- use `Quick Start By Question` when you need to jump to the right doc fast

### Important Note

- older docs may still reference `docs/Phases/...` paths
- the active phase-system location is now `docs/Phase-Plans/...`
- when older docs conflict with newer canonical docs, prefer the newer canonical docs

## Doc Body


### Canonical Sources

- `docs/Doc-Index.md`
  - the central navigation and docs-rules index
  - use this first when you are unsure where documentation belongs

- `docs/Phase-Plans/00_Phase-Setup.md`
  - the canonical phase-setup file
  - use this when:
    - adding a new phase
    - questioning a phase prefix
    - mapping an old phase into the modern system
    - recording new ownership rules for phase naming

- `docs/Phase-Plans/00_Phase_Log.md`
  - the canonical completed phase log
  - use this when:
    - reviewing completed canonical phases
    - preserving finished detailed checklist blocks
    - checking current long-form completed phase history

- `docs/CHANGELOG.md`
  - the authoritative completed-work history

- `docs/Change-List-COMPILED.md`
  - the merged historical index
  - use this for reconstructed history plus shipped changelog continuity

- `docs/Chill-Log.md`
  - the temporary log for small docs-only maintenance during chill mode

- `docs/History/0 - compiled-HISTORY.md`
  - the short conversation-history index

- `docs/History/0 - History-TaskLog.md`
  - the detailed restored historical task reconstruction

- `docs/History/0 - History-TaskList.md`
  - the short restored historical task index

- `docs/CodexContext/2_CodexContext.md`
  - the stable Codex/project handoff context

- `docs/CodexContext/3_CodexContext.md`
  - the rolling live Codex working context

### Folder Map

- `docs/Phase-Plans/`
  - the active home for phase-system docs and phase/task plan files

- `docs/Phase-Plans/Future/`
  - phase plans that are planned but not started

- `docs/Phase-Plans/Tasks/`
  - active/in-progress phase plans

- `docs/Phase-Plans/Old/`
  - completed or retired phase plans

- `docs/Plans/`
  - architecture notes, wish features, planning support docs, and decisions

- `docs/History/`
  - restored conversation history and historical reconstruction docs

- `docs/CodexContext/`
  - Codex handoff and rolling working-memory docs

- `docs/Archive/`
  - preserved older copies and snapshots that should not act as live canonical sources

### Documentation Rules

#### Canonical Ownership Rule

- one doc should answer one class of question
- avoid making two docs that both try to be the source of truth for the same thing
- when a canonical doc already exists, prefer updating it instead of creating a competing file

#### Phase Rules

- if a phase is unclear, check `docs/Phase-Plans/00_Phase-Setup.md` first
- if a new phase family or ownership boundary is discovered, record it in `docs/Phase-Plans/00_Phase-Setup.md`
- do not let multiple phase-setup docs compete as equal sources of truth
- older copied phase-setup docs can remain as references or archives, but they should not be updated as competing live sources

#### Phase-Plan Lifecycle Rule

- `docs/Phase-Plans/Future/` = planned, not started
- `docs/Phase-Plans/Tasks/` = active/in progress
- `docs/Phase-Plans/Old/` = completed/retired

#### Doc Structure Rule

- large canonical docs should prefer a fold-friendly structure when they contain both explanatory metadata and operational content
- preferred top-level shape:
  - `# <Doc Name>`
  - `## Doc Header`
  - `## Doc Body`
- use `## Doc Header` for:
  - `Doc History`
  - purpose
  - how-to-read guidance
  - rules, legend, and notes about the file itself
- use `## Doc Body` for the main content the user works inside most often
- inside `Doc Body`, use deeper heading levels so VS Code can collapse whole sections cleanly

#### Doc History Rule

- this is the canonical repo-wide rule for local `Doc History` sections under `docs/`
- docs created or edited under `docs/` should maintain a local `Doc History` section near the top unless the doc is intentionally temporary
- `Doc History` entries should be numbered newest-first
- each entry should include:
  - `YYYY-MM-DD HH:MM`
  - a short one-line description of the doc change

Exception:
- ordinary chill-batch activity recorded inside `docs/Chill-Log.md` should be logged only in the active chill batch, not in a local `Doc History` block
- real header, rule, or structural changes to `docs/Chill-Log.md` may still be recorded in that file's local `Doc History`

#### Global CheckList Rule

- this is the repo-wide checklist marker and structure rule for docs under `docs/`
- use these markers consistently unless a doc has a clear local reason to do otherwise:
  - `[x]` = done / completed and evidenced
  - `[?]` = completed but evidence is incomplete or not fully locked
  - `[~]` = currently active / in progress
  - `[ ]` = future / planned and not done
  - `[L]` = legacy feature to remove / retained transitional seam that should probably be removed later
  - `[R]` = removed / already retired from the active system
- use exactly one status marker per checklist item
- prefer one visible checklist block for the main working surface when possible
- if a checklist grows large, keep the top checklist medium-detail and place deeper explanation/history under nearby subsections rather than turning the main checklist into a wall of nested detail
- when a checklist belongs to a fold-structured doc, keep the main checklist directly under the heading that owns that work block

Rule notes:
- `[?]` is for uncertain completion, not ordinary future work
- `[L]` is for still-present legacy cleanup targets, not uncertainty
- `[R]` is for something explicitly removed, not merely planned for removal
- docs may add a short local legend when helpful, but they should not redefine the marker meanings

#### Chill Mode Rule

- during chill mode, log small doc edits in `docs/Chill-Log.md`
- do not create a permanent `docs/CHANGELOG.md` entry for every small doc edit
- consolidate later when the user says `Update changelog`

#### Changelog Rule

- `docs/CHANGELOG.md` is now the live readable history doc and the primary scan surface
- do not maintain a second live mirror like `docs/change-List.md` once the changelog itself already provides readable summaries
- use `docs/Change-List-COMPILED.md` only for reconstructed-history bridging and compiled continuity work

#### History Rules

- when working on `docs/History/# - chatgpt.md` files:
  - add a structured summary at the top
  - keep the raw conversation underneath in an HTML comment
  - update `docs/History/0 - compiled-HISTORY.md`
- when rebuilding historical phases/tasks:
  - update `docs/History/0 - History-TaskLog.md`
  - then condense into `docs/History/0 - History-TaskList.md`

### Quick Start By Question

- "What is the current architecture?"
  - start with `docs/repo.md`
  - then `docs/Plans/Architecture/Engine-Architecture.md`
  - then `docs/Plans/Architecture/System-Map.md`

- "How do phases work?"
  - start with `docs/Phase-Plans/00_Phase-Setup.md`
  - then `docs/Phase-Plans/00_Phase_Log.md`

- "What actually got done?"
  - start with `docs/CHANGELOG.md`
  - then `docs/Change-List-COMPILED.md`

- "How did the project evolve before the changelog was stable?"
  - start with `docs/History/0 - History-TaskLog.md`
  - then `docs/History/0 - History-TaskList.md`
  - then `docs/History/0 - compiled-HISTORY.md`

- "What context should Codex carry forward?"
  - start with `docs/CodexContext/2_CodexContext.md`
  - then `docs/CodexContext/3_CodexContext.md`

### Legacy Note

- the old raw inventory/count style that originally lived in this file is no longer the primary purpose of `Doc-Index.md`
- if a future file-inventory scan is needed, it should be treated as a generated reference section or a separate inventory doc, not the main identity of this file




### Human Docs Map Notes

- this section is a heading-based `/docs` hierarchy designed for VS Code folding
- it uses real markdown heading levels so folders can be collapsed by depth
- reading pattern:
  - `#` = docs root
  - `##` = top-level docs folders
  - `###` = subfolders
  - `####` = deeper subfolders
- file bullets are indented to visually sit under the folder depth they belong to
- `Archive/` remains folder-only in this smart view to keep the section readable
- root-level docs files are listed directly under `# docs`
- this section is meant for navigation and collapse behavior, not for strict machine-readable tree syntax
- canonical name for this format in this repo:
  - `Foldable Outline Tree`


### Doc Stats

#### Summary

- Total docs/files scanned: `103`
- Root scanned: `/20/parahook/docs`
- Count method: `raw line count per file`
- Non-/archive/ files: `61`
- Non-/archive/ total lines: `20251`
- /archive files: `42`
- /archive total lines: `74444`
- Grand total lines: `94695`

### Foldable Outline Tree - `Human Doc Map`

# docs
- `CHANGELOG.md`
- `Chill-Log.md`
- `Doc-Index.md`
- Agents
## -Agents
    - `Agents-Planning.md`
## -Archive
    - `00_Phase_Log.md`
    - `TaskHistoryCompilation.md`
### ----CodexContext
        - `1_CodexContext.md`
        - `2_CodexContext.md`
        - `3_CodexContext.md`
        - `4_CodexContext.md`
#### -------History-Chats
            - `1-CodexChat.md`
            - `5_CodexChatNotes.md`
            - `6_CodexChatNotes.md`
### ----Crap
        - `00_Phase-CheckList.md`
        - `00_Phase_List.md`
        - `2026-3-6_Changelog.md`
        - `2026-3-7_File-Reccomendations.md`
        - `2026-3-7_PhaseList.md`
        - `2026-3-7_Task-List-Compiled`
        - `changelistcompiled.md`
        - `CHANGELOG copy.md`
        - `changerlogjsokdjf.md`
        - `chill-mode-ChangeList.md`
        - `ll`
        - `Medium ROADMAP.md`
        - `oo - phase plan.md`
        - `OO - Phase-Plans.md`
        - `README.md`
### ----History
        - `0 - compiled-HISTORY.md`
        - `0 - GIT.md`
        - `0 - History-TaskList.md`
        - `0 - History-TaskLog.md`
        - `00_PRE-History.md`
        - `1 - chatgpt.md`
        - `10 - chatgpt.md`
        - `11 - chatgpt.md`
        - `12 - chatgpt.md`
        - `12 - COPY.md`
        - `2 - chatgpt.md`
        - `3 - chatgpt.md`
        - `4 - chatgpt.md`
        - `5 - chatgpt.md`
        - `6 - chatgpt.md`
        - `7 - chatgpt.md`
        - `8 - chatgpt.md`
        - `8 - COPY.md`
        - `9 - chatgpt.md`
        - `9 - COPY.md`
        - `MISSINGTASKS.md`
## -Human-Plans
    - `Decisions.MD`
### ----CodexNotes
        - `1-CodexChat.md`
        - `5_CodexChatNotes.md`
        - `6_CodexChatNotes.md`
        - `7_CodexChatNotes.md`
        - `8_CodexChatNotes.md`
        - `9_CodexChatNotes.md`
        - `10_CodexChatNotes.md`
### ----Architecture
        - `Engine-Architecture.md`
        - `Glossary.md`
        - `System-Map.md`
#### -------Spaghetti-Editor-Arch
            - `Spaghetti-Editor-Explained.md`
### ----Bugs
        - `0_Bug_Report.md`
### ----roadmap
        - `roadmap.md`
        - `Vision-roadmap.md`
        - `Now-Next-Later-Much-Later.md`
#### -------archive
            - `02_Vision-Roadmap.md`
            - `03_Spaghetti-Studio.md`
            - `Focused-Roadmap.md`
            - `LEAVING-legacy.md`
            - `LegacyList.md`
### ----Wish-Features
        - `00 - legacy-Wishes.md`
        - `04 - Gizmo.md`
        - `10 - radio-Sampler.md`
        - `11 - Scenes.md`
        - `WISHLIST.md`
#### -------Jake-Mode
            - `Jake-Mode.md`
#### -------Spaghetti-Editor
            - `01.0 - Master Spaghetti.md`
            - `01.1 - Spaghetti Editor.md`
            - `01.2 - Spaghetti Editor Tool Bar.md`
            - `01.3 - Wires ui.md`
            - `01.4 - Nodes.md`
            - `01.5 - Muliple Spaghetti Bowls.md`
## -Phase-Plans
    - `00_Phase-Setup.md`
    - `01_GE - Phase-Plans.md`
    - `02_VM - Phase-Plans.md`
    - `03_NI - Phase-Plans.md`
    - `04_FS - Phase-Plans.md`
    - `05_PT - Phase-Plans.md`
    - `06_DR - Phase-Plans.md`
    - `07_AS - Phase-Plans.md`
    - `08_VR - Phase-Plans.md`
    - `09_DBG - Phase-Plans.md`
    - `10_JK - Phase-Plans.md`
    - `11_SP - Phase-Plans.md`
    - `12_EX - Phase-Plans.md`
    - `13_ADV - Phase-Plans.md`
    - `14_DOC - Phase-Plans.md`
    - `15_LEG - Phase Plan.md`
### ----History-Chats
        - `1-CodexChat.md`
        - `5_CodexChatNotes.md`
        - `6_CodexChatNotes.md`
### ----Tasks
#### -------Future
            - `DBG_PhasePlan.md`
            - `UI_Window-Update_PhasePlan.md`
#### -------Old
            - `001 - GE - Phase 1 - Clean Restart.md`
            - `14_DOC - Phase 13 - Canonical Changelog Rewrite.md`
            - `14_DOC - Phase 14A.md`
            - `DBG-1.md`
            - `NI-1.md`
            - `NI-2.md`
            - `NI-3.md`
            - `Phase 4A runtime bridge plan.md`
            - `Phase 4A Runtime Bridge.md`
            - `phase OP plan.md`
            - `Phase OP Tasks.md`


## Docs History
