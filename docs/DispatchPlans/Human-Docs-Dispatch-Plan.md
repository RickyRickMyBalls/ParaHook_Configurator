
## Doc Header

### Doc History
1. 2026-04-18 11:06:31: Created this dispatch plan as the operational multi-Codex split for implementing the first `Human-Docs` v1 pass, locking one coordinator plus three non-overlapping writer lanes so the new reader-facing docs can be drafted in parallel without shared-file collisions

### Purpose

This file is the implementation dispatch plan for `docs/Human-Docs/`.

Use it to answer:
- how to split the `Human-Docs` v1 work across multiple Codex workers
- which files each worker owns
- which files must stay with the coordinator
- what writing rules all workers should follow
- what each worker should return before final integration

### Scope

This file covers:
- parallel ownership for the `Human-Docs` v1 implementation
- coordination rules for root docs, `Concepts/`, and `Workspaces/`
- shared writing constraints and final merge expectations

This file does not replace:
- the actual `Human Docs v1 Plan`
- the future human-facing docs under `docs/Human-Docs/`
- `docs/Doc-Index.md`
  - canonical docs map

## Doc Body

### Short Version

Use one coordinator Codex and three writer Codexes.

Do not let multiple workers edit the same integration files.

The coordinator owns structure, shared tone cleanup, and docs-system integration.

### Coordinator Ownership

The coordinator Codex owns all shared and integration-sensitive files:

- `docs/Human-Docs/index.md`
- `docs/Doc-Index.md`
- `docs/index.md`
- `docs/Doc-Log.md`

The coordinator also owns:
- creating the folder structure if it does not already exist
- giving each worker the same writing rules
- reviewing worker drafts for overlap or tone drift
- normalizing final wording across all `Human-Docs` pages
- merging the finished pages into one coherent v1 set

### Worker Ownership

#### Worker 1 - Root Human Docs

Owns only:
- `docs/Human-Docs/What-Is-ParaHook.md`
- `docs/Human-Docs/How-ParaHook-Is-Organized.md`
- `docs/Human-Docs/Glossary.md`

Goal:
- produce the project overview, big-picture organization page, and human-readable terminology baseline

Do not edit:
- `docs/Human-Docs/index.md`
- anything under `Concepts/`
- anything under `Workspaces/`
- docs-system integration files

#### Worker 2 - Concepts

Owns only:
- `docs/Human-Docs/Concepts/Core-Concepts.md`
- `docs/Human-Docs/Concepts/Engine-Architecture.md`
- `docs/Human-Docs/Concepts/Project-Flow.md`

Goal:
- explain the core mental model and engine flow in plain English without falling back into planning-doc language

Do not edit:
- root `Human-Docs` files
- anything under `Workspaces/`
- docs-system integration files

#### Worker 3 - Workspaces

Owns only:
- `docs/Human-Docs/Workspaces/Overview.md`
- `docs/Human-Docs/Workspaces/Browser.md`
- `docs/Human-Docs/Workspaces/Model-Viewport.md`
- `docs/Human-Docs/Workspaces/Spaghetti-Editor.md`

Goal:
- explain the workspace model and the three highest-value workspaces in a reader-friendly way

Do not edit:
- root `Human-Docs` files
- anything under `Concepts/`
- docs-system integration files

### Shared Writing Rules

All workers must follow these rules:

- write for both curious users and contributors
- keep the tone internal but human
- use plain English
- do not copy plan docs directly
- do not use implementation checklists
- do not include shipped/open ladders
- do not use phase ids in normal body text
- do not use repo-maintenance or agent-facing language
- prefer stable concepts over current cleanup details
- be honest about unfinished areas without turning the page into backlog tracking
- end each page with a short `Learn more` section containing no more than 4 deeper links

### Source Docs To Synthesize From

All workers should pull from the same core source set:

- `docs/Vision.md`
- `docs/Human-Plans/roadmap/Vision-roadmap.md`
- `docs/Human-Plans/Architecture/System-Map.md`
- `docs/Human-Plans/Architecture/Engine-Architecture.md`
- `docs/Human-Plans/Architecture/Glossary.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`

Workers may also use their local family sources:

- Worker 1
  - broader overview and architecture sources
- Worker 2
  - concept and engine sources
- Worker 3
  - Browser, Model-Viewport, and Spaghetti Editor family docs

### Worker Return Contract

Each worker should return:

- the files they changed
- a short summary of what each page now explains
- any wording or concept questions that still need coordinator cleanup
- any source-doc conflicts they noticed while synthesizing

Workers should not:
- edit files outside their assignment
- resolve cross-lane wording disputes by changing another worker's files
- update `Doc-Index.md`, `docs/index.md`, or `Doc-Log.md`

### Final Integration Pass

After all workers return, the coordinator should:

1. Review every human-facing page for tone consistency.
2. Remove repeated explanations that appear across multiple pages.
3. Make sure `What-Is-ParaHook`, `How-ParaHook-Is-Organized`, and `Concepts/Engine-Architecture.md` do not say the same thing three different ways.
4. Write or refine `docs/Human-Docs/index.md` as the front door.
5. Add the new area to `docs/Doc-Index.md`.
6. Add a visible entry from `docs/index.md` if the docs site should expose `Human-Docs`.
7. Update `docs/Doc-Log.md`.

### Recommended Dispatch Message

Use a dispatch prompt shaped like this:

`Implement the Human-Docs v1 plan. You own only the files listed below. Keep the tone internal-but-human, do not copy plan docs directly, avoid phase ids in normal body text, avoid shipped/open ladders, and end each page with a short Learn more section. Do not edit shared integration files. Return changed files plus a short summary of what each page explains.`

Then append the worker's exact file ownership list.

### Success Read

This dispatch worked if:

- workers write in parallel without touching the same files
- the coordinator only needs a tone and integration pass instead of major rewrites
- the final `Human-Docs` set reads like one doc system instead of three unrelated writing styles
- `Doc-Index.md` and `Doc-Log.md` are updated in the same change set
