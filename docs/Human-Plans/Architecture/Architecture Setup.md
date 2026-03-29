# Architecture Setup

## Doc Header

### Doc History
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
