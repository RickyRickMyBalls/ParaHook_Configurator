# Architecture Setup

## Doc Header

### Doc History
10. 2026-04-17 13:04:11: Refined this setup doc again to match the latest `View-Toolbar 8` phase shape, making the default standalone future-doc pattern explicitly split each top-level phase into `### Phase N Summary` and `### Phase N Implementation Spec` instead of keeping one flatter internal heading ladder
9. 2026-04-17 12:49:37: Updated this setup doc to match the now-approved `View-Toolbar 8` planning shape, replacing `Wishlist Tracking` with `Wishlist Organization`, adding the required `### High Level Goals` block, making the phase-to-goal mapping explicit inside each wishlist phase checklist, and changing the default top-level phase heading pattern to the `[ ]` family-phase title format
8. 2026-04-17 12:30:36: Reworked this setup doc around the newer architecture-planning flow so it now explicitly defines the default `Vision -> family index -> standalone phase doc` sequence, the required top-level `##` section order for standalone future docs, the new `Wishlist Tracking` rules, and the small-phase expectation that later Codex work should follow automatically
7. 2026-04-17: Promoted this setup note into the explicit default structure guide for `docs/Human-Plans/Architecture/`, clarifying that it now owns the newer architecture-family doc pattern, standalone future-doc defaults, and the split between repo-wide `00_Phase-Setup.md` prefix rules versus local architecture planning format rules
6. 2026-04-06: Clarified the setup guidance so the default pattern is one `Future/` plan doc with internal `Phase 1`, `Phase 2`, and `Phase 3` sections, and child docs like `3.1` or `3.2` are only for broader cases where one internal phase grows into its own ladder
5. 2026-04-06: Added a `How To Split A Broad Future Phase Into Child Ladders` section so this setup note now covers parent roadmap docs like `Extrude-3` that branch into child docs such as `3.1`, `3.2`, and `3.3`, each with their own internal phase ladder when needed
4. 2026-04-06: Added a `How To Start A New Architecture Phase` section so this setup note now mirrors the repo-wide rule for turning one new family idea into an umbrella index entry plus a matching `Future/` plan doc with numbered `##` subphases
3. 2026-04-06: Added an `Outline Guidance For Architecture Docs` section so this setup note now mirrors the repo-wide docs rules with one default outline shape for umbrella family docs versus standalone phase docs
2. 2026-03-28: Refreshed this setup note after a live docs-index cleanup, removing the now-fixed `Layers.md` mismatch example and tightening the drift note so it points at older historical names rather than claiming the current family index files are still wrong today
1. 2026-03-28: Created this root `Architecture Setup` doc after a read-only pass across the current `Architecture/` tree, so the folder now has one simple explanation of the family-folder pattern, naming expectations, and the legacy exceptions that still exist today

### Purpose

This doc is the default setup guide for `docs/Human-Plans/Architecture/`.

Use it to answer:
- what the normal architecture family folder pattern is
- when a new idea should start as a `*-Vision.md` doc
- how a vision should compress into a family index entry plus one standalone future phase doc
- what top-level `##` section order standalone future docs should use
- how `Wishlist Organization` and `High Level Goals` should work

### Scope

This doc covers:
- the normal `Architecture/` family-folder pattern
- the default `Vision -> family index -> standalone phase doc` flow
- the required top-level section order for standalone future phase docs
- the rules for keeping user high-level goals visible while mapping them to small real phases
- how this newer planning area relates to `docs/Phase-Plans/00_Phase-Setup.md`

This doc does not cover:
- repo-wide prefix naming
- the architecture direction of any one feature family
- roadmap priority decisions

## Doc Body

### Short Version

The default newer architecture planning flow should now be:

1. If the idea is broad enough, create one `IdeaName-Vision.md` doc.
2. Compress that idea into the owning family index as one new family phase.
3. Create one matching standalone future phase doc.
4. Use `Wishlist Organization` to keep the user-provided high-level goals visible while mapping them onto small real phases.
5. Implement one phase at a time.

Important rule:
- do not jump straight from a broad user idea into one giant future doc with vague internal work
- use the wishlist organization to keep the phase honest and small

### Which File Does What

Use:
- `docs/Phase-Plans/00_Phase-Setup.md`
  - for canonical repo-wide phase prefixes, checklist meanings, and global phase-system rules
- `docs/Human-Plans/Architecture/Architecture Setup.md`
  - for the default doc structure and planning flow inside `docs/Human-Plans/Architecture/`
- the local family index, vision, or sibling phase docs
  - when a family already has a narrower local pattern that should be preserved

Important rule:
- do not use `00_Phase-Setup.md` as the only formatting guide for newer architecture family docs
- use it for phase-system truth, then use this file for the normal `Human-Plans/Architecture` planning format

### Standard Family Folder Pattern

The preferred setup for a feature family is:

- `FeatureName/`
- `FeatureName-Index.md`
- `Future/`
- `Shipped/`

Meaning:

- the root doc is the umbrella architecture/index doc for that feature family
- `Future/` holds open implementation-ready phase docs
- `Shipped/` holds shipped records for completed phase docs

Examples that already follow this shape:
- `AppShell/AppShell-Index.md`
- `Edit-History/Edit-History-Index.md`
- `Workspace-Modes/Workspace-Modes-Index.md`
- `View-Toolbar/View-Toolbar-Index.md`

### Default Planning Flow

#### 1. Vision First When The Idea Is Big Enough

If the idea is broad enough that it needs a north-star explanation, start with:

- `IdeaName-Vision.md`

That vision doc should usually:
- explain the real idea clearly
- capture the important details and constraints
- preserve the wishlist items the user cares about

Important rule:
- do not skip the vision doc when the idea is still too broad to break into real phases honestly

#### 2. Compress The Vision Into The Family Index

Once the idea is understood, add it to the owning family index as one family phase such as:

- `View-Toolbar 8`

The family index should stay the scan surface.

It should usually include:
- the family phase title
- a short goal
- the ownership boundary
- the link to the standalone future phase doc

#### 3. Create One Standalone Future Phase Doc

After the family index entry exists, create one matching standalone future doc in `Future/`.

That doc becomes the real implementation-planning surface.

#### 4. Use Wishlist Organization To Keep The Plan Honest

The future doc should include one dedicated `## Wishlist Organization` section.

That section should keep the user's original high-level goals visible while also showing the smaller phase-by-phase breakdown.

Important rules:
- keep the wording close to the user's wording
- do not invent extra high-level goals unless the user explicitly asks for them
- when the phase checklist adds smaller implementation items, keep them clearly separate from the user-provided high-level goals
- do not mark a high-level goal as advanced unless the actual phase plan really advances it
- if a high-level goal is not yet covered, leave that visible instead of pretending it is solved

#### 5. Break Work Into Codex-Sized Phases

After `Wishlist Organization`, the standalone future doc should use top-level family-phase sections in the `[ ]` title format.

Each phase should be small enough that Codex can reasonably implement it one by one.

Important rule:
- prefer more small honest phases over one oversized phase with hidden internal ladders

### Required Top-Level Section Order For Standalone Future Docs

Standalone future docs under `docs/Human-Plans/Architecture/` should now default to this top-level `##` order:

- `## Doc Header`
- `## Doc Body`
- `## Wishlist Organization`
- `## [ ] \`Family-Phase\` - \`Phase 1 - <Title>\``
- `## [ ] \`Family-Phase\` - \`Phase 2 - <Title>\``
- later `## [ ] \`Family-Phase\` - \`Phase N - <Title>\``

Important rule:
- keep `Wishlist Organization` as its own first-class top-level section
- do not bury it inside `Doc Body`

### What Each Top-Level Section Should Do

#### `## Doc Header`

This should usually hold:
- `### Doc History`
- `### Purpose`
- optional `### Why This Phase Exists`
- optional `### Scope`

#### `## Doc Body`

This should usually hold the overall phase contract, such as:
- phase goal
- main boundary rules
- architecture direction
- current live read when needed
- acceptance read

Important rule:
- `Doc Body` is the whole-phase contract surface
- it should not become the place where the real phase ladder is hidden

#### `## Wishlist Organization`

This should hold both:
- the user-provided high-level goals
- the smaller phase-by-phase checklist breakdown

Recommended pattern:

- `### High Level Goals`
- `- [ ] \`HLG 1. <user wording>\``
- `- [ ] \`HLG 2. <user wording>\``
- `- [ ] \`HLG 3. <user wording>\``
- `### \`Family-Phase Phase 1\``
- smaller checklist items for that phase
- `- [ ] \`HLG 1. <user wording>\`` only when that phase really advances that goal

Important rules:
- keep the `### High Level Goals` block close to the user's wording
- use the later `### \`Family-Phase Phase N\`` blocks for the smaller Codex-sized breakdown
- only add an `HLG` marker to a phase block if that phase really advances that high-level goal
- one phase may help multiple high-level goals
- one high-level goal may appear in multiple phase blocks
- keep this section as the ownership-and-tracking surface, not the full implementation spec

#### `## [ ] \`Family-Phase\` - \`Phase N - <Title>\``

Each phase section should be the real implementable slice.

Use `[ ]` while the phase is still open.

Flip it to `[x]` when the phase is shipped or when the doc has moved into a shipped record.

Recommended internal shape:
- `### Phase N Summary`
- `#### Purpose`
- `#### Owns`
- `#### Does Not Own`
- `#### Current Live Read` when grounding against code matters
- `#### First Pass Decisions`
- `### Phase N Implementation Spec`
- `#### Exact First Code Cut`
- `#### Likely Files`
- `#### No-Widening Rule`
- `#### Implementation Risks`
- `#### Checklist`
- `#### Verification Shape`
- `#### Done Shape`

This is the default pattern, not an absolute law.

If a family already has a narrower local pattern, preserve that local pattern unless there is a clear reason to normalize it.

Important rule:
- the `Summary` half should explain the phase contract and live grounding
- the `Implementation Spec` half should hold the actual execution contract
- do not blur the two back together once the phase is close enough to build

### Phase Breakdown Rule

The default expectation is:
- each top-level family-phase section is small enough to implement in one Codex-sized pass
- phases should be ordered to match the wishlist honestly
- if a phase becomes too large, split it into another top-level phase or a later dedicated child doc

Important rule:
- do not hide four real implementation slices inside one giant `Phase 1`

### Split Rule For Child Ladders

Only split a broad phase into child docs such as:
- `3.1`
- `3.2`
- `3.3`

when one phase really grows into its own multi-phase ladder.

First prefer:
- one standalone future doc
- one visible `Wishlist Organization` section
- one top-level `[ ]` family-phase ladder

### Which File Wins

When setting up or revising docs under `docs/Human-Plans/Architecture/`, use this precedence:

1. `docs/Vision.md` and `docs/Human-Plans/roadmap/Vision-roadmap.md`
   - long-range direction and what must stay true
2. `docs/Phase-Plans/00_Phase-Setup.md`
   - canonical repo-wide phase naming and checklist rules
3. `docs/Human-Plans/Architecture/Architecture Setup.md`
   - default newer architecture planning flow and standalone future-doc format
4. the local family docs
   - narrower family-specific planning format and execution language

Practical reading:
- if the question is "what prefix/family number system is correct?" start with `00_Phase-Setup.md`
- if the question is "what shape should this newer architecture future doc use?" start with this file
- if the question is "how does this specific family already speak?" start with the local family index and nearby sibling docs
