# Architecture Setup

## Doc Header

### Doc History
6. 2026-04-06: Clarified the setup guidance so the default pattern is one `Future/` plan doc with internal `Phase 1`, `Phase 2`, and `Phase 3` sections, and child docs like `3.1` or `3.2` are only for broader cases where one internal phase grows into its own ladder
5. 2026-04-06: Added a `How To Split A Broad Future Phase Into Child Ladders` section so this setup note now covers parent roadmap docs like `Extrude-3` that branch into child docs such as `3.1`, `3.2`, and `3.3`, each with their own internal phase ladder when needed
4. 2026-04-06: Added a `How To Start A New Architecture Phase` section so this setup note now mirrors the repo-wide rule for turning one new family idea into an umbrella index entry plus a matching `Future/` plan doc with numbered `##` subphases
3. 2026-04-06: Added an `Outline Guidance For Architecture Docs` section so this setup note now mirrors the repo-wide docs rules with one default outline shape for umbrella family docs versus standalone phase docs
2. 2026-03-28: Refreshed this setup note after a live docs-index cleanup, removing the now-fixed `Layers.md` mismatch example and tightening the drift note so it points at older historical names rather than claiming the current family index files are still wrong today
1. 2026-03-28: Created this root `Architecture Setup` doc after a read-only pass across the current `Architecture/` tree, so the folder now has one simple explanation of the family-folder pattern, naming expectations, and the legacy exceptions that still exist today

### Purpose

This doc explains how `Architecture/` is currently set up.

Use it to answer:
- what the normal architecture family folder pattern is
- what should live in a feature folder root versus `Future/` versus `Shipped/`
- how new architecture families should usually be added
- which parts of the current tree still use older patterns

### Scope

This doc covers:
- the current `Architecture/` folder shape
- the common feature-family folder pattern
- naming guidance for new family docs
- current exceptions and legacy cases

This doc does not cover:
- the architecture direction of any one feature family
- the implementation details inside individual phase docs
- roadmap priority decisions

## Doc Body

### Short Version

Most active architecture work in this folder is organized as one feature family per folder.

The normal pattern is:
- one feature folder
- one umbrella index doc at that folder root
- one `Future/` folder for open implementation-ready phase docs
- one `Shipped/` folder for completed phase records

If you are making a new architecture family, start with that pattern unless there is a strong reason not to.

### Current Architecture Layout

`Architecture/` currently contains two broad kinds of docs:

- feature-family folders
  - examples:
    - `AppShell/`
    - `Browser/`
    - `Edit-History/`
    - `Export/`
    - `Layers/`
    - `Transform/`
    - `Workspace-Modes/`
- root-level standalone architecture docs
  - examples:
    - `Engine-Architecture.md`
    - `System-Map.md`
    - `Glossary.md`
    - `Terminology-Decisions.md`

The family folders are the main pattern for ongoing feature architecture planning.

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
- `Browser/Browser-Index.md`
- `Edit-History/Edit-History-Index.md`
- `Export/Export-Index.md`
- `Layers/Layers-index.md`
- `Workspace-Modes/Workspace-Modes-Index.md`

### What Each Part Should Hold

#### Feature Root Doc

The root doc should usually hold:
- the family purpose
- scope and non-goals
- current status
- current architecture direction
- a phase ladder or family map
- links or references to standalone future phase docs

This root doc is the umbrella entry point for the family.

#### Future

`Future/` should hold:
- open implementation-ready phase docs
- narrow follow-on docs that are specific enough to execute later

Use `Future/` when a piece of work is too detailed to keep inside the umbrella index cleanly.

#### Shipped

`Shipped/` should hold:
- completed phase records
- moved standalone docs that now represent shipped history

Once a phase is done, its detailed doc should usually move from `Future/` into `Shipped/`.

### Outline Guidance For Architecture Docs

Architecture docs here usually work best when they keep one clear split between:
- umbrella family docs
- standalone phase docs

#### Umbrella Family Docs

Umbrella family docs should usually be the fast scan surface for a feature lane.

They should normally read in this order:
- family purpose and scope
- current architecture direction or bottom-line position
- phase ladder, checklist, or family map
- deeper questions, decisions, and links to standalone future or shipped docs

The umbrella doc should stay readable even when the family grows.

If one phase starts needing a lot of execution detail, move that detail into a dedicated doc instead of keeping the umbrella file as the only planning surface.

#### Standalone Phase Docs

Standalone phase docs should usually be narrower and more execution-shaped.

They should normally read in this order:
- phase goal and scope
- locked direction and non-goals
- questions or decisions that affect implementation
- implementation spec, checklist, shipped notes, or verification

That keeps a phase doc honest about what the slice is trying to do without making the umbrella family doc carry all the detail itself.

### How To Start A New Architecture Phase

When a new idea belongs to an existing architecture family, the default setup should be:

1. Add one new umbrella phase entry to the family index doc.
2. Create one matching plan doc in that family's `Future/` folder.
3. Use the `Future/` plan doc as the place where the idea gets broken into numbered subphases.

#### Family Index Role

The family index should be the scan surface.

For a new phase, it should usually include:
- the umbrella phase title
- a short purpose
- the rough ownership boundary
- a pointer to the matching `Future/` plan doc
- a short phase breakdown only if that helps the family index stay understandable

The family index should not become the only place carrying the real implementation breakdown once the idea turns into active planning.

#### Future Plan Doc Role

The matching `Future/` doc should be the execution-planning surface.

It should normally use:
- `# <Phase Name>`
- `## Doc Header`
- `## Doc Body`

Inside `## Doc Body`, the default pattern should be one plan doc with one `##` section per internal phase.

Recommended pattern:
- `## [ ] <Family/Phase> - Phase 1 - <Title>`
- `## [ ] <Family/Phase> - Phase 2 - <Title>`
- `## [x] <Family/Phase> - Phase N - <Title>`

Each subphase section can then hold the local purpose, locked direction, questions, implementation notes, and verification for that slice.

The goal is that later instructions such as:
- `prep phase 2`
- `implement phase 1`
- `implement phase 2`

have one obvious meaning from the current plan-doc context.

#### Escalation Rule

If one subphase inside the shared `Future/` plan doc grows too large, it can later be split into its own standalone future doc.

When that happens:
- keep the family index as the scan surface
- keep the shared plan doc as the umbrella breakdown surface if it still adds value
- move the oversized execution detail into the dedicated standalone doc instead of duplicating the full implementation spec in multiple places

#### Bottom Line

The default flow is:
- new idea enters through the family index
- the matching `Future/` doc becomes the real breakdown surface
- numbered `##` subphases inside that doc carry the first implementation ladder
- only split further into separate future docs when one subphase becomes too large to stay cleanly inside the shared plan doc

### How To Split A Broad Future Phase Into Child Ladders

Sometimes a `Future/` plan doc is still too broad to act as the final execution home.

This is the exception pattern, not the default.

First prefer:
- one plan doc
- internal `Phase 1`, `Phase 2`, `Phase 3` sections inside that doc

Only split into child docs when one internal phase grows into its own multi-phase ladder.

In that case, it can become a parent roadmap doc for named child phases such as:
- `Extrude-3`
- `Extrude-3.1`
- `Extrude-3.2`
- `Extrude-3.3`

#### Parent Future Doc Role

The parent future doc should stay the roadmap surface.

It should usually:
- explain the broader phase purpose
- list the child phases in order
- link to dedicated child docs
- show which child phases are shipped and which are still open
- stop short of carrying every detailed implementation note once the child docs exist

This keeps the parent readable as the phase-family map.

#### Child Phase Doc Role

Each child phase doc should become the detailed planning surface for that child lane.

If needed, that child doc can then have its own internal ladder using numbered `##` sections such as:
- `## [ ] Extrude 3.1 Phase 1 - <Title>`
- `## [ ] Extrude 3.1 Phase 2 - <Title>`
- `## [x] Extrude 3.1 Phase N - <Title>`

That means the nesting can look like:
- family index
- parent `Future/` roadmap doc
- child `3.1` or `3.2` doc
- internal `Phase 1`, `Phase 2`, `Phase 3` sections inside that child doc

#### Split Rule

Split a broad future phase into dedicated child docs when:
- one child lane has its own real execution ladder
- the parent roadmap doc is getting too dense
- the child needs durable history that should stay visible on its own
- or a later instruction like `implement phase 1` is no longer clear enough inside one shared doc because that phase now contains its own real sub-ladder

Once a child doc exists:
- the parent future doc should summarize and link
- the child doc should hold the detailed implementation ladder
- avoid duplicating the full implementation spec in both places

### Naming Guidance

Preferred pattern for new family folders:

- folder:
  - `Feature-Name/`
- root umbrella doc:
  - `Feature-Name-Index.md`
- future phase doc:
  - `Feature_Phase <phase id> - <title>.md`

The current tree is not fully normalized yet, so exact older names still vary.

Important rule:
- prioritize one clear umbrella root doc plus `Future/` and `Shipped/`
- perfect file-name uniformity is helpful, but the folder pattern matters more than matching one exact suffix

### Practical Setup Rule For New Families

When adding a new feature family under `Architecture/`, the usual setup should be:

1. Create the feature folder.
2. Create the umbrella index doc at the folder root.
3. Create `Future/`.
4. Create `Shipped/`.
5. Put high-level direction in the umbrella doc.
6. Put execution-ready follow-on docs in `Future/`.
7. Move completed phase docs into `Shipped/`.

### Current Exceptions And Legacy Cases

The current tree already has a few exceptions.

#### Legacy Root-Doc Naming

Some families use a root umbrella doc name that is not `*-Index.md`.

Examples:
- `Console/Console.md`
- `Worker/Worker.md`
- `Radio/Radio.md`

These still function as family root docs even though the naming is older.

#### Not Fully Folderized Yet

`Radio/` does not currently follow the full `index + Future + Shipped` family setup.

It still reads more like an older single-doc planning area than a fully folderized family.

#### Nested Subfamilies

`Spaghetti-Editor-Arch/` is a family folder, but it also contains deeper subfamilies, especially:
- `Nodes/`
- `Nodes/Sketch/`
- `Nodes/Extrude/`

That means `Spaghetti-Editor-Arch/` works more like a family-of-families than a simple single-feature folder.

#### Local Doc Drift

Some older index entries, roadmap pointers, or historical notes may still mention earlier file names that were later cleaned up.

Examples of older names that can still appear in historical context:
- `Layers.md`
- `master spaghetti-index.md`

This setup doc should follow the real current folder state first, then later cleanup can normalize individual families.

### Maintenance Rule

When updating architecture docs:
- keep the umbrella doc readable
- move execution detail into standalone future docs when it starts to bloat the root doc
- keep shipped history in `Shipped/` instead of mixing completed records back into open planning
- prefer extending the existing family folder over scattering new root-level one-off docs when the topic clearly belongs to an existing feature family

### Bottom Line

The current `Architecture/` setup is mostly organized around feature families.

The standard pattern is:
- feature folder
- umbrella index doc
- `Future/`
- `Shipped/`

That is the default structure new architecture work should usually follow.
