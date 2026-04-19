# Architecture Setup

## Doc Header

### Doc History
13. 2026-04-19 12:17:51: Updated this setup guide to officialize the three-layer planning ladder from the Codex Desktop notes, naming `Vision Doc`, `Generation Index Doc`, `Family Phase Doc`, and implementation-phase responsibilities, while documenting the cleaner `Future/IdeaName-N - Family Phase Name.md` target convention and preserving older `IdeaName_Phase IdeaName-N - ...` files as valid during migration.
12. 2026-04-18 20:10:00: Added the convention that HLG checklist items should carry stable generation-scoped identifiers so later CLG, phase plans, and implementation notes can reference them without depending on line order
11. 2026-04-18 19:55:00: Updated this setup guide with the clarified Vision-to-HLG-to-CLG ladder, generation-scoped HLG guidance for broad family vision docs, and the formatting convention that HLG checklist text is wrapped in backticks while CLG and smaller implementation checklist items are not
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
- how a vision should route HLG into generations
- how one generation should become a Generation Index Doc with family phases
- how one family phase should become a Family Phase Doc with Codex-sized implementation phases
- what top-level `##` section order Family Phase Docs should use
- how `Wishlist Organization` and `High Level Goals` should work
- how `Human Level Goals` and `Codex Level Goals` should stay visually distinct

### Scope

This doc covers:
- the normal `Architecture/` family-folder pattern
- the default `Vision Doc -> Generation Index Doc -> Family Phase Doc -> implementation phase` flow
- the required top-level section order for Family Phase Docs
- the rules for keeping user high-level goals visible while mapping them to small real phases
- the formatting convention for HLG versus CLG checklist items
- how this newer planning area relates to `docs/Phase-Plans/00_Phase-Setup.md`

This doc does not cover:
- repo-wide prefix naming
- the architecture direction of any one feature family
- roadmap priority decisions

## Doc Body

### Short Version

The default newer architecture planning flow should now be:

1. If the idea is broad enough, create one `IdeaName-Vision.md` Vision Doc.
2. Preserve the user's human-level goals in the Vision Doc before compressing them.
3. Route the HLG into generations inside the Vision Doc.
4. Create or update the active `IdeaName-GenN-Index.md` Generation Index Doc.
5. Derive Codex-level goals from that generation's HLG.
6. Split the generation into family phases such as `IdeaName-1`, `IdeaName-2`, and `IdeaName-3`.
7. Create or update one matching `Future/IdeaName-N - Family Phase Name.md` Family Phase Doc when implementation planning is ready.
8. Split that Family Phase Doc into Codex-sized implementation phases.
9. Add a `### Phase N Implementation Spec` before implementing an implementation phase.
10. Implement one prepared implementation phase at a time.

Important rule:
- do not jump straight from a broad user idea into one giant future doc with vague internal work
- do not jump straight from HLG into implementation
- use the wishlist organization to keep the phase honest and small

The generic file ladder is:

```text
IdeaName-Vision.md
IdeaName-GenN-Index.md
Future/IdeaName-N - Family Phase Name.md
```

Existing files using older names such as `Future/IdeaName_Phase IdeaName-N - Family Phase Name.md` remain valid during migration.

### Which File Does What

Use:
- `docs/Doc-Vision.md`
  - for the docs-system north star, foldability contract, and Human-Plans versus Human-Docs split
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
- `FeatureName-Vision.md`
- `FeatureName-GenN-Index.md`
- `Future/`
- `Shipped/`

Meaning:

- the Vision Doc is the broad idea and generation-routing surface
- each Generation Index Doc routes one generation into family phases
- `Future/` holds open Family Phase Docs and implementation-ready phase docs
- `Shipped/` holds shipped records for completed phase docs

Examples that already follow this shape:
- `AppShell/AppShell-Index.md`
- `Edit-History/Edit-History-Index.md`
- `Workspace-Modes/Workspace-Modes-Index.md`
- `View-Toolbar/View-Toolbar-Index.md`

Important migration note:
- older family indexes such as `Catalog-Index.md` may still be serving the Generation Index Doc role
- do not rename or split older docs just to satisfy the naming convention unless the active task explicitly owns that migration

### Three-Layer Planning File Ladder

The default planning ladder has three file layers before implementation:

```text
IdeaName-Vision.md
  -> IdeaName-GenN-Index.md
    -> Future/IdeaName-N - Family Phase Name.md
      -> ## IdeaName-N / Phase N - Implementation Phase Name
```

#### Vision Doc

`IdeaName-Vision.md` owns:
- the full human idea
- raw wishlist preservation
- HLG
- generation routing
- what must stay true

When folded to `##` headings, the Vision Doc should read like the generation list.

#### Generation Index Doc

`IdeaName-GenN-Index.md` owns:
- one generation's selected HLG
- CLG derived from that generation's HLG
- wishlist organization for that generation
- family phase routing, such as `IdeaName-1`, `IdeaName-2`, and `IdeaName-3`
- family phase summaries and boundaries

When folded to `##` headings, the Generation Index Doc should read like the family phase list for that generation.

Older files such as `IdeaName-Index.md` may serve this role until they are intentionally migrated.

#### Family Phase Doc

`Future/IdeaName-N - Family Phase Name.md` owns:
- one large family phase from the Generation Index Doc
- Codex-sized implementation phase routing
- implementation phase summaries
- implementation specs
- verification and done shape

When folded to `##` headings, the Family Phase Doc should read like the implementation phase list.

Each implementation phase should include:
- `### Phase N Summary`
- `### Phase N Implementation Spec`

Older files named like `Future/IdeaName_Phase IdeaName-N - Family Phase Name.md` remain valid during migration, but the cleaner target convention is `Future/IdeaName-N - Family Phase Name.md`.

### Default Planning Flow

#### 1. Vision First When The Idea Is Big Enough

If the idea is broad enough that it needs a north-star explanation, start with:

- `IdeaName-Vision.md`

That vision doc should usually:
- explain the real idea clearly
- capture the important details and constraints
- preserve the wishlist items the user cares about
- include `## Human Level Goals` when the idea has enough user intent to track across generations or family phases
- group HLG under `### Generation N HLG` headings when the family vision is explicitly generational
- number HLG with stable generation-scoped identifiers when they need to be referenced later, such as `Catalog-Gen1-HLG-3`

Important rule:
- do not skip the vision doc when the idea is still too broad to break into real phases honestly
- do not flatten generation-level user goals into implementation checklist items before preserving them as HLG

#### 2. Route One Generation Into The Generation Index

Once the vision has a clear generation boundary, create or update the owning Generation Index Doc:

- `IdeaName-GenN-Index.md`

The Generation Index Doc is the per-generation scan surface.

It should usually include:
- the generation goal
- the preserved HLG and derived CLG for that generation
- the family-phase ladder for that generation
- the family phase title
- a short goal
- the ownership boundary
- the link to each Family Phase Doc in `Future/`

Older family indexes named like `IdeaName-Index.md` may keep acting as the scan surface until a task explicitly owns splitting or migrating them into `IdeaName-GenN-Index.md`.

#### 3. Create One Family Phase Doc

After the Generation Index Doc has a family phase that is close enough to build, create one matching Family Phase Doc in `Future/`:

- `Future/IdeaName-N - Family Phase Name.md`

That doc becomes the real implementation-planning surface for that family phase.

Older files named like `Future/IdeaName_Phase IdeaName-N - Family Phase Name.md` remain valid during migration, but new or renamed docs should prefer the cleaner target convention.

#### 4. Use Wishlist Organization To Keep The Plan Honest

The Family Phase Doc should include one dedicated `## Wishlist Organization` section.

That section should keep the user's original high-level goals visible while also showing the smaller phase-by-phase breakdown.

Important rules:
- keep the wording close to the user's wording
- do not invent extra high-level goals unless the user explicitly asks for them
- when the implementation-phase checklist adds smaller implementation items, keep them clearly separate from the user-provided high-level goals
- use CLG to bridge from preserved human goals into Codex-actionable planning language
- do not mark a high-level goal as advanced unless the actual implementation-phase plan really advances it
- if a high-level goal is not yet covered, leave that visible instead of pretending it is solved

#### 5. Break The Family Phase Into Codex-Sized Implementation Phases

After `Wishlist Organization`, the Family Phase Doc should use top-level implementation-phase sections in the `[ ]` title format.

Each implementation phase should be small enough that Codex can reasonably implement it one by one.

Important rule:
- prefer more small honest implementation phases over one oversized phase with hidden internal ladders
- do not start implementation until the active implementation phase has a `### Phase N Implementation Spec`

### Required Top-Level Section Order For Family Phase Docs

Family Phase Docs under `docs/Human-Plans/Architecture/` should now default to this top-level `##` order:

- `## Doc Header`
- `## Doc Body`
- `## Vision`
- `## Wishlist Organization`
- `## [ ] \`IdeaName-N / Phase 1\` - \`Implementation Phase Title\``
- `## [ ] \`IdeaName-N / Phase 2\` - \`Implementation Phase Title\``
- later `## [ ] \`IdeaName-N / Phase N\` - \`Implementation Phase Title\``

Important rule:
- `Vision` should summarize the family-phase intent and generation routing
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

This should usually hold the overall family-phase contract, such as:
- family-phase goal
- main boundary rules
- architecture direction
- current live read when needed
- acceptance read

Important rule:
- `Doc Body` is the whole-family-phase contract surface
- it should not become the place where the real implementation-phase ladder is hidden

#### `## Vision`

This should usually hold:
- the family-phase outcome in plain language
- the generation this family phase belongs to
- the HLG or CLG it is meant to advance
- any important user-facing promise that must stay true

Important rule:
- `Vision` should be short enough to scan when the file is folded in VS Code

#### `## Wishlist Organization`

This should hold both:
- the user-provided high-level goals
- the Codex-level goals derived from those high-level goals, when useful
- the smaller implementation-phase checklist breakdown

Recommended pattern:

- `### High Level Goals`
- `- [ ] \`Family-Gen1-HLG-1. <user wording>\``
- `- [ ] \`Family-Gen1-HLG-2. <user wording>\``
- `- [ ] \`Family-Gen1-HLG-3. <user wording>\``
- `### Codex Level Goals`
- `- [ ] CLG 1. <repo-actionable planning language>`
- `- [ ] CLG 2. <repo-actionable planning language>`
- `### \`IdeaName-N / Phase 1\``
- smaller checklist items for that implementation phase
- `- [ ] \`HLG 1. <user wording>\`` only when that implementation phase really advances that goal

Important rules:
- keep the `### High Level Goals` block close to the user's wording
- HLG checklist items should wrap the full human-level goal text in backticks
- HLG checklist items should use stable identifiers when later CLG or phase plans need to reference them
- CLG checklist items should not wrap the full item text in backticks
- smaller phase checklist items should not wrap the full item text in backticks unless they are explicitly referencing an HLG marker
- use the later `### \`IdeaName-N / Phase N\`` blocks for the smaller Codex-sized breakdown
- only add an `HLG` marker to an implementation-phase block if that implementation phase really advances that high-level goal
- one implementation phase may help multiple high-level goals
- one high-level goal may appear in multiple implementation-phase blocks
- keep this section as the ownership-and-tracking surface, not the full implementation spec

#### `## [ ] \`IdeaName-N / Phase N\` - \`Implementation Phase Title\``

Each implementation-phase section should be the real implementable slice.

Use `[ ]` while the implementation phase is still open.

Flip it to `[x]` when the implementation phase is shipped or when the doc has moved into a shipped record.

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
- the `Summary` half should explain the implementation-phase contract and live grounding
- the `Implementation Spec` half should hold the actual execution contract
- do not blur the two back together once the implementation phase is close enough to build
- do not dispatch implementation until this section has both halves

### Phase Breakdown Rule

The default expectation is:
- each top-level implementation-phase section is small enough to implement in one Codex-sized pass
- implementation phases should be ordered to match the wishlist honestly
- if an implementation phase becomes too large, split it into another top-level implementation phase or a later dedicated child doc

Important rule:
- do not hide four real implementation slices inside one giant implementation phase

### Split Rule For Child Ladders

Only split a broad family phase into child docs such as:
- `3.1`
- `3.2`
- `3.3`

when one family phase really grows into its own multi-phase ladder.

First prefer:
- one Family Phase Doc
- one visible `Wishlist Organization` section
- one top-level `[ ]` implementation-phase ladder

### Which File Wins

When setting up or revising docs under `docs/Human-Plans/Architecture/`, use this precedence:

1. `docs/Vision.md` and `docs/Human-Plans/roadmap/Vision-roadmap.md`
   - long-range direction and what must stay true
2. `docs/Phase-Plans/00_Phase-Setup.md`
   - canonical repo-wide phase naming and checklist rules
3. `docs/Human-Plans/Architecture/Architecture Setup.md`
   - default newer architecture planning flow and Family Phase Doc format
4. the local family docs
   - narrower family-specific planning format and execution language

Practical reading:
- if the question is "what prefix/family number system is correct?" start with `00_Phase-Setup.md`
- if the question is "what shape should this newer architecture future doc use?" start with this file
- if the question is "how does this specific family already speak?" start with the local family index and nearby sibling docs
