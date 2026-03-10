# 1 CodexChat

## Doc History
1. 2026-03-07 00:18: Created this file and organized the current Codex/docs-consolidation conversation into a structured transcript using `## Conversation`, `### User Prompt`, and `#### Codex Response`

## Summary

This conversation focused on consolidating the `/docs` system into a cleaner canonical structure.

Main outcomes:
- confirmed `docs/Phase-Plans/00_Phase-Setup.md` should be the canonical phase-setup source
- normalized the historical and shipped phase naming into the compiled history docs
- tightened the phase checklist and created a chronological phase list
- added a Codex handoff/context doc
- started defining how Codex chat history itself should be stored in repo docs

## Conversation

### User Prompt

I made you a new file `parahook\\docs\\CodexContext\\1_CodexContext.md`. Can you write down all the context from this conversation?

#### Codex Response

Created a compact context handoff in `docs/CodexContext/1_CodexContext.md` covering:
- current product direction
- `/18` vs `/20` understanding
- canonical docs
- phase system
- reconstructed history state
- historian / restore-checklist workflows
- major remaining gaps in the startup history

### User Prompt

Read only mode. Read over `/CodexContext/2` and `3`. Have I made any progress?

#### Codex Response

Reviewed `2_CodexContext.md` and `3_CodexContext.md` and answered:
- yes, there is real progress
- `2` is a cleaner stable architecture summary
- `3` shows movement toward a real canonical docs system and rolling working notes
- both are now somewhat behind the newer consolidation work

### User Prompt

My phase setup has evolved quite a bit.

#### Codex Response

Confirmed that the phase setup has evolved from a rough naming list into:
- an ownership map
- a history-mapping system
- a planning system
- a translation layer between old names and the current architecture

### User Prompt

Look over `/docs/`. What other files do you think we need / can combine?

#### Codex Response

Scanned the current `/docs` tree and gave consolidation advice, including:
- merge older roadmap files into the newer roadmap set
- reduce overlap between `00_Phase_List`, `00_Phase_Log`, and `00_Phase-CheckList`
- eventually retire `TaskHistoryCompilation.md` once restored history is trusted
- keep strict roles for `CHANGELOG.md`, `change-List.md`, and `Change-List-COMPILED.md`
- tighten `CodexContext/1`, `2`, and `3` into non-overlapping roles

### User Prompt

`docs/Phase-Plans/00_Phase-Setup.md` is now the canonical phase setup file. Whenever we are in question about a phase or need to add a new one we go here and record it.

#### Codex Response

Confirmed that this is the right canonical split:
- `00_Phase-Setup.md` = active phase-source-of-truth
- older copies should become references only

Then aligned:
- `docs/Documentation-Rules.md`
- `docs/Phases/00_Phase-Setup.md`

so both say that `00_Phase-Setup.md` is the single active canonical phase-setup file.

### User Prompt

We still didn’t update format in `Change-List-COMPILED` yet, did we?

#### Codex Response

Confirmed that the compiled list still needed the shipped `CHANGELOG.md` block normalized into the same prefix-first phase style as the restored pre-changelog history.

### User Prompt

Patch `Change-List-COMPILED`.

#### Codex Response

Patched `docs/Change-List-COMPILED.md` so the shipped changelog rows now use:
- the timestamp first
- then a prefix-first phase-style title

Examples of the new style:
- `GE - Phase 7 - ...`
- `FS - Phase 9 - ...`
- `DR - Phase 11 - ...`
- `SP - Phase 5 - ...`
- `OO - Phase 10 - ...`

Also updated local doc history and chill log tracking.

### User Prompt

Read over `parahook\\docs\\Phases\\00_Phase-CheckList.md`, is that old? Do not edit yet.

#### Codex Response

Read the file and concluded:
- yes, it is old in role
- it is still useful as a narrow changelog-derived checklist
- but it is not the canonical phase source anymore
- it does not reflect restored history or current prefix mapping as well as `00_Phase-Setup.md` and `00_Phase_List.md`

### User Prompt

Let’s update `## Current Canonical Prefix Phases`.

#### Codex Response

Updated `docs/Phases/00_Phase-CheckList.md` so the canonical-prefix section now uses the current prefix system and maps historical aliases like:
- `CK -> GE`
- `CT -> GE`
- `IN -> DR`
- `UI -> SP`

### User Prompt

How are the prefixes ordered, why is `GE` first and `VM` second? Are they slightly chronological?

#### Codex Response

Explained that the order is:
- mostly by architectural depth / dependency
- slightly influenced by chronology

Summary:
- `GE` first because it is the deepest engine foundation
- `VM` second because it is the first real state-to-UI layer above engine truth
- then editor/model systems
- then viewer/product-surface systems
- then future systems

### User Prompt

Let’s add these labels in `## Current Canonical Prefix Phases` so I can understand.

#### Codex Response

Added short “why this bucket exists” labels to each prefix section in `00_Phase-CheckList.md`.

### User Prompt

I want to keep this list tight. Look at the format I have for `GE` and `VM`. This is close. We just need to add the correct prefix name for the checklist items and add the phase number before the name.

#### Codex Response

Understood the desired tighter format:
- short section heading
- compact checklist rows
- each row in the form `PREFIX - Phase N - Name`

### User Prompt

Patch phase checklist.

#### Codex Response

Tightened `docs/Phases/00_Phase-CheckList.md`:
- removed extra clutter
- normalized checklist rows to `PREFIX - Phase N - Name`
- kept the canonical prefix grouping

### User Prompt

Now add in all the logs from `docs/Change-List-COMPILED.md` into `docs/Phases/00_Phase-CheckList.md`.

#### Codex Response

Expanded `00_Phase-CheckList.md` from a small shipped subset into a full grouped checklist based on `Change-List-COMPILED.md`, including:
- canonical-prefix entries
- explicit `Gaps`
- `OO / Docs Meta`
- `Last Gen Conversation Anchors`

### User Prompt

Let’s clarify what the X marks in the `## Current Canonical Prefix Phases` in the phase check list. Add legend.

#### Codex Response

Added a legend to `00_Phase-CheckList.md` clarifying:
- `[x]` present and still aligned
- `[~]` implemented but likely legacy
- `[ ]` gap / missing-history placeholder

### User Prompt

Let’s condense `docs/Phases/00_Phase-CheckList.md` so there are no duplicate phase #s.

#### Codex Response

Collapsed repeated phase-number rows into single entries where appropriate, for example:
- `NI - Phase 3`
- `NI - Phase 4`
- `FS - Phase 14`
- `PT - Phase 5`
- `DR - Phase 8`
- `SP - Phase 5`
- `OO` repeated subentries

### User Prompt

I added a new empty file `docs/Phases/00_Phae_List.md`. Let’s take the `## Current Canonical Prefix Phases` from `00_Phase-CheckList.md` and put each entry in chronological order.

#### Codex Response

Created `docs/Phases/00_Phae_List.md` as the chronological version of the canonical phase checklist:
- same canonical entries
- chronological order instead of prefix grouping
- excludes `Gaps`, `OO / Docs Meta`, and `Last Gen Conversation Anchors`

### User Prompt

Give them all a number in order.

#### Codex Response

Added stable `[NNN]` numbering to every row in `00_Phae_List.md`.

### User Prompt

Is there a way you can print our entire dialog in this file `docs/CodexContext/History-Chats/1-CodexChat.md`?

#### Codex Response

Said yes in principle, but recommended a structured format:
- summary at top
- organized prompt/response sections
- optional raw transcript below in comment form

### User Prompt

Do you see the format in `docs/History/9 - COPY.md`? Let’s start with that as a format and then build upon it. I like keeping a summary at the top.

#### Codex Response

Confirmed that the `9 - COPY.md` style is a good model:
- summary first
- structured sections
- raw source preserved below if needed

### User Prompt

Let’s make:
- `## Conversation` level 2
- `### User Prompt` level 3
- `#### Codex Response` level 4

Paste our conversation into `docs/CodexContext/History-Chats/1-CodexChat.md` and organize.

#### Codex Response

Created this file in the requested structure and organized the current conversation into:
- a summary at the top
- `## Conversation`
- `### User Prompt`
- `#### Codex Response`

The purpose is to preserve this docs-consolidation conversation in a readable repo-native format instead of as one raw dump.
