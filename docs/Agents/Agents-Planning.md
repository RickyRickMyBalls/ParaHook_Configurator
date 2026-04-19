# Agents Planning

## Doc Header

### Doc History
4. 2026-04-18 12:48:12: Added a docs-system check requirement for planning mode to consult `docs/Doc-Vision.md` before adding new planning structure or dispatching Gen 4 cleanup tasks.
3. 2026-03-08 11:48: Added a forward rule that substantive timestamped planning entries should carry incrementing `[N]` indices, while simple formatting/maintenance edits should not
2. 2026-03-08 10:34: Tightened the `Planning-Batch` rule so entries must be numbered newest-first instead of left as unordered bullets
1. 2026-03-08 10:22: Added planning-batch logging rules, clarified that planning mode does not create `docs/CHANGELOG.md` entries, and added an explicit confidence-label recommendation for planning conclusions

## Purpose

This file defines how Codex should behave when the user explicitly switches the
repo into `planning mode`.

Use planning mode for:
- tightening product vision
- classifying salvageable systems
- identifying new objects or systems that should exist
- identifying objects or systems that should be retired
- comparing current `/src` reality against the intended long-term direction
- turning broad ideas into clearer architecture or roadmap conclusions

Do not use planning mode as the default code-editing mode.

Planning mode exists to improve judgment, direction, and structure before
implementation work begins.

## Main Rule

When planning mode is active, Codex should stay focused on architecture,
direction, and classification work unless the user explicitly asks for code or
file edits.

For any docs-system planning (including Gen 4 cleanup work), planning should
start by checking `docs/Doc-Vision.md` to honor the current generation
contract before adding new planning structure or dispatching tasks.

The default output in planning mode should be:
- structured interpretation
- design classification
- system comparison
- roadmap direction
- clear recommended next decisions

Not:
- opportunistic implementation
- random bug-fixing
- low-level code patches that do not directly support the planning question

## Core Planning Questions

When reasoning in planning mode, prefer questions like:
- what is the intended long-term product truth?
- what in the current code already aligns with that truth?
- what looks salvageable with refactor?
- what appears transitional or legacy?
- what new objects or systems are missing?
- what should be retired instead of expanded?
- what should happen now, next, and later?

## Preferred Classification Buckets

Use these buckets whenever they help:

- `Salvageable`
  - worth keeping with little or moderate refactor

- `Needs Refactor`
  - direction is still useful, but the current shape is not the likely final one

- `New Object`
  - a system, node, contract, or UX object that should probably exist but does not yet exist clearly

- `Retire`
  - something that is likely legacy, transitional, overly local, or no longer aligned with the stronger long-term direction

- `Unclear`
  - do not force certainty when the current evidence is thin

## Vision Tightening Rule

Planning mode should help tighten vision rather than letting ideas stay vague.

That means:
- prefer naming the actual system object being discussed
- prefer separating product truth from UI convenience
- prefer architecture ownership over loose metaphor
- prefer identifying the target model, not just criticizing the current one

When useful, rewrite fuzzy ideas into stronger system language such as:
- canonical truth
- ownership boundary
- composite node
- driver contract
- runtime contract
- viewer responsibility
- legacy seam

## Reality Check Rule

Planning mode should stay grounded in the current repo.

When making architectural suggestions:
- compare the idea against the current `/src` implementation
- compare the idea against the current phase-family docs
- note whether a conclusion is:
  - high-confidence
  - medium-confidence
  - speculative

Do not present speculative design ideas as if they are already proven by the code.

When useful, label conclusions in the response as:
- `high-confidence`
- `medium-confidence`
- `speculative`

This should appear in the user-facing interpretation when the certainty level matters.

## Planning Batch Rule

Planning mode uses the active
`docs/Archive/CodexContext/History-Chats/N_CodexChat.md` file as its running
batch log.

Rules:
- do not create `docs/CHANGELOG.md` entries for planning-mode work
- add planning-mode progress notes to the top-of-file `Planning-Batch` section in the active `N_CodexChat.md`
- keep `Planning-Batch` entries numbered newest-first
- keep `Planning-Batch` concise and batch-like rather than turning it into a full transcript
- continue using the main session-notes/body area for durable architecture conclusions that should survive the batch

Substantive timestamped entry rule:
- when the user asks Codex to "make an entry" or record a substantive planning conclusion, add an incrementing `[N]` index to that timestamped body entry
- increment the next substantive entry by 1 each time
- do not apply this `[N]` index rule to simple formatting, restructuring, or maintenance-only edits
- `Doc History` and `Planning-Batch` keep their own existing numbering rules; this rule is for substantive timestamped note entries in the main planning/body area

If planning mode includes doc edits:
- follow normal `docs/Doc-Index.md` local `Doc History` rules in the edited doc
- do not treat ordinary planning doc maintenance as permanent changelog history

## Roadmap Rule

When planning mode produces a strong conclusion, connect it to roadmap order:
- `Now`
- `Next`
- `Later`

Planning mode should help answer:
- what should be done first?
- what depends on that?
- what should wait?

## Codex Chat Capture Rule

When planning mode produces reusable project knowledge, record it in the active
`docs/Archive/CodexContext/History-Chats/N_CodexChat.md` file.

Good things to capture there:
- major architecture clarifications
- product-direction conclusions
- salvageable vs retire conclusions
- newly clarified system objects
- rules that should survive the current session

Do not turn `CodexChat` into a full transcript dump.

Prefer concise session-note blocks with:
- timestamp
- topic
- conclusion
- implication

Keep two surfaces distinct:
- `Planning-Batch` at the top of the active `N_CodexChat.md` for batch/workflow tracking during planning mode
- the main session-notes/body area for durable architecture conclusions

## Good Output Shape

Strong planning-mode output usually looks like:
- brief summary of the current question
- classification of the systems involved
- interpretation of what the current code/docs imply
- recommended direction
- risks or uncertainties
- next decision or next doc to update

## Things To Avoid

Avoid these planning-mode failure patterns:
- turning everything into code work too early
- overcommitting to a metaphor without mapping it to real ownership
- treating every old system as garbage
- treating every existing system as sacred
- collapsing product vision, architecture, and UI into one mixed argument
- inventing missing certainty just to sound decisive

## Short Version

Planning mode is for:
- clarifying the vision
- comparing the vision to the real code
- classifying what to keep, refactor, create, or retire
- improving roadmap order
- recording durable conclusions in `CodexChat`

It is not for drifting into implementation unless the user explicitly asks.
