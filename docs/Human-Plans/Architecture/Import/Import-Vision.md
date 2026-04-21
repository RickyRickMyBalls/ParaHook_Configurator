# Import Vision

## Doc Header

### Doc History
7. 2026-04-20 20:15:13: Added the cross-family local source library direction so Import can own user-granted folder permission, known-folder scanning, supported-file discovery, and staged import handoff for PubParts downloads while Catalog owns source identity and per-item local-folder status.
6. 2026-04-16: Extended the master import vision again so `Generation 1` now leaves room for a later `Import-7` `.stl` mesh-cleanup-and-import-controls lane, clarifying that STL-specific cleanup should widen as its own format-specific follow-on instead of being implied by STEP tessellation language or pushed back into the generic staged foundation
5. 2026-04-16: Tightened the master import vision by adding a small working-terms glossary, one explicit `Generation 0` exit read, one clearer status note for `Import-2`, and one ownership-boundary section so future import planning can sort generic intake work, downstream ownership, and later retained-geometry work more consistently
4. 2026-04-16: Extended the master import vision so `Generation 1` now includes both `Import-5` and the new `Import-6` `.glb` enrichment lane, clarifying that the later format-specific fidelity generation should begin with `.step` and then widen into `.glb` instead of reading as a single-format STEP-only band
3. 2026-04-16: Expanded the master import vision with one clearer overall-concept read plus one explicit `Generation 0` achievement read so the family now states more directly what import is for, what the foundational generation is trying to complete, and why the later format-specific work should wait until that broader generic baseline feels done
2. 2026-04-16: Collapsed the import family so `Import-1` through `Import-4` now read as one broader `Generation 0`, making the shipped direct-row baseline, reviewed staged import baseline, and active staged-session hardening all part of the same foundational import generation while reserving `Generation 1` for the later format-specific fidelity lane starting with `Import-5`
1. 2026-04-16: Added this master import-family vision doc, organizing the older direct-row compatibility path, the shipped staged import baseline, the active staged-session hardening work, the later STEP-specific fidelity lane, and the companion retained-B-rep direction into explicit generations so future import planning can widen without blurring the mainline path

### Purpose

This doc captures the long-range vision for the `Import` family in ParaHook.

Use it to answer:
- what `Import` is supposed to mean in ParaHook
- what `generation` the import family is in today
- how the older direct import rows, the staged import baseline, and the staged-session hardening work should now group together
- how the still-open `Import-2` compatibility lane should be interpreted inside that broader `Generation 0` read
- where generic import-family groundwork should stop and format-specific fidelity work should begin
- how the later retained imported-geometry direction should stay distinct from the earlier mesh-first import generations
- which family should own common import-adjacent edge cases once staged intake ends and accepted content exists elsewhere
- how new import wishlist items should be grouped before later phase planning starts

Do not use it for:
- one narrow implementation checklist
- replacing the execution-planning role of `Import-Index.md` or the standalone future docs
- pretending the current `.step` lane already means true retained B-rep import
- widening curated asset browsing into import when that work belongs to `Catalog`

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping import aligned with explicit project/content truth and downstream viewer behavior

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that import remains a truthful intake-and-commit family instead of turning into a second hidden content system

- `docs/Human-Plans/Architecture/Import/Import-Index.md`
  - umbrella import-family index
  - useful for the current family structure, open execution lanes, and next recommendation

- `docs/Human-Plans/Architecture/Import/Import-3-Vision.md`
  - the staged-import-window sub-vision
  - useful for the shipped reviewed-import baseline that now sits inside the broader `Generation 0` import foundation

- `docs/Human-Plans/Architecture/Import/Future/Import_Phase Import-4 - Staged Import Session Feedback And Partial-Failure Reporting.md`
  - the active staged-session hardening lane
  - useful for the current `Generation 0` execution detail

- `docs/Human-Plans/Architecture/Import/Future/Import_Phase Import-5 - STEP Import Metadata, Units, And Loader Fidelity.md`
  - the later `.step`-specific fidelity lane
  - useful for the first concrete `Generation 1` format-specific execution direction

- `docs/Human-Plans/Architecture/Import/Future/Import_Phase Import-6 - GLB Scene Metadata, Materials, And Content Fidelity.md`
  - the later `.glb`-specific enrichment lane
  - useful for the second concrete `Generation 1` format-specific execution direction after the STEP-first proving ground

- `docs/Human-Plans/Architecture/Import/B-rep/B-rep-Vision.md`
  - the retained imported-geometry companion vision
  - useful for the later `Generation 2` direction once import moves past mesh-first staged `.step` truth

## Doc Body

### Why This Doc Exists

The import family now has enough real history that the earlier four-generation split reads too granularly at the family level.

The repo already carries several distinct import shapes:
- older direct Browser import rows
- one shipped staged `Import Files...` dialog
- one active staged-session hardening lane
- one later `.step`-specific fidelity lane
- one companion retained-B-rep direction that should not be confused with today's mesh-first STEP import

But `Import-1` through `Import-4` are still one broader foundational import story:
- get user files in
- review them before commit
- harden the staged session until the generic import flow is honest

This doc exists to keep the family organized around the bigger widening boundaries first:
- foundational import baseline and staged-session hardening
- format-specific fidelity
- later retained imported-geometry truth

### Overall Concept

The overall import concept should stay simple:

- the user brings outside files into ParaHook
- ParaHook lets the user review and understand those files before commit
- ParaHook makes the important import decisions explicit instead of hiding them in post-import cleanup
- the accepted result becomes real downstream project or viewer truth after an explicit commit

In practice, `Import` should feel like:
- the intake system for user-supplied reference assets
- review-first instead of commit-first
- staged and session-honest instead of opaque
- explicit about what the app knows, what it assumes, and what it cannot yet do

It should not feel like:
- a hidden second content system
- a curated asset catalog
- a format-specific special-case maze before the generic import baseline is actually solid
- a place where heavy parse work or failure states happen without honest user-facing truth

### Working Terms

Use these terms consistently across later import docs:

- `session truth`
  - what the current staged import session honestly knows about each file before commit
  - includes detected structure, staged settings, visible warnings, current failures, and commit-result feedback

- `heavy-source truth`
  - honest user-facing disclosure that some formats require expensive parsing, preview preparation, reuse, or guarded settings before commit
  - this is still staged import truth, not later retained imported geometry

- `downstream truth`
  - accepted content that is no longer owned only by the import dialog
  - after commit, the Browser, project content, viewer/runtime, and later inspector systems should be able to see the accepted result through their real owners

- `retained source truth`
  - later authoritative imported geometry or metadata that remains meaningful beyond flattened preview meshes
  - this belongs to the later retained imported-geometry direction, not to the foundational staged import generation

### Short Version

The import family should be described as evolving through explicit generations.

`Generation 0` is the broad foundational import generation.

That generation now includes:
- the older direct-row compatibility carry-forward
- the reviewed staged import baseline
- the active staged-session hardening and object-review work
- a cross-family local source library intake lane for known user-granted folders such as PubParts downloads

`Generation 1` is the later format-specific fidelity and heavy-source-truth generation, starting with `.step` through `Import-5`, then widening into `.glb` through `Import-6`, and later leaving room for `.stl` cleanup controls through `Import-7`.

`Generation 2` is the later retained imported-geometry direction, which should widen through the companion `B-rep` vision instead of being smuggled into the earlier import generations.

The current mainline import read is:
- `Generation 0` is already partly shipped and still active through `Import-4`, with `Import-8` added as a later cross-family local source library intake lane when Catalog needs known-folder PubParts discovery
- `Generation 1` is queued behind that, with `Import-5` first, `Import-6` following as a later `.glb` enrichment lane, and `Import-7` left later as the `.stl` cleanup-controls lane once the earlier format-specific pattern is clearer
- `Generation 2` stays later through the companion `B-rep` direction

### Generation Map

The current family maps cleanly like this:

- `Generation 0`
  - `Import-1`
  - `Import-2`
  - `Import-3`
  - `Import-4`
  - `Import-8`
- `Generation 1`
  - `Import-5`
  - `Import-6`
  - `Import-7`
- `Generation 2`
  - companion retained imported-geometry direction through `Import/B-rep/B-rep-Vision.md`

Important rule:
- this map is meant to explain widening boundaries, not to pretend every lane inside one generation is equally active right now

### Import Generations

#### Generation 0 - Foundational Import Baseline, Reviewed Staging, And Session Hardening

`Generation 0` is the broad foundational import generation.

This generation now includes the whole generic import baseline from the older direct rows through the staged import hardening work.

This generation means:
- keep the older direct rows working while they still exist
- preserve batch convenience where that parity is still worth carrying forward
- move import into a reviewed staged dialog before commit
- harden the staged dialog until generic session truth, recovery, and object review are honest enough

Current owned lanes:
- shipped `Import-1`
- still-open compatibility follow-on `Import-2`
- shipped `Import-3`
- active staged-session follow-on `Import-4`
- later cross-family local source library follow-on `Import-8`

Status note for `Import-2`:
- `Import-2` belongs inside `Generation 0` because it is still part of the older direct-row compatibility carry-forward
- but it is not the mainline gate that decides whether the staged import foundation is healthy enough to widen into `Generation 1`
- if the repo later decides the remaining direct rows are not worth widening further, that should be treated as an explicit compatibility retirement decision rather than as a sign that `Generation 0` itself failed

What `Generation 0` is trying to achieve:
- one believable generic import foundation for the file types ParaHook already supports
- one mainline `Import Files...` path that feels complete enough to trust before format-specific widening begins
- reviewed intake before commit instead of immediate Browser mutation
- honest per-file structure read, import settings, organization, acceptance, and recovery behavior
- honest local source-library intake when another family, such as Catalog, points at user-granted folders of source files
- enough staged-session clarity that later `.step`-specific fidelity work can widen on top of a stable base instead of compensating for generic import confusion

When `Generation 0` is healthy, the user should be able to say:
- "I can bring in the supported file types through one clear import flow."
- "I can review how a file will come in before it becomes project content."
- "I can choose the important generic import settings before commit."
- "If import only partly works, the app tells me honestly which files succeeded and which still need attention."
- "The import session itself feels understandable enough that later format-specific controls can be additive rather than corrective."

What `Generation 0` does well:
- keeps current menu-exposed import types usable
- establishes reviewed pre-commit staging as the mainline import shape
- makes import decisions explicit before project mutation
- hardens generic staged-session truth without yet widening into format-specific loader contracts

What `Generation 0` does not yet do:
- give each supported format its own richer fidelity contract
- distinguish mesh-first staged truth from later retained imported-geometry truth only through format-specific controls
- solve retained imported geometry or topology-aware interaction
- silently scan arbitrary folders without user permission
- extract archives or list remote shared-folder contents unless a later Import phase explicitly opens that lane

`Generation 0` exit read:
- the mainline `Import Files...` path feels complete enough that supported staged formats can be brought in through one believable reviewed intake flow
- per-file staged inspection, staged settings, commit results, and partial-failure recovery are honest enough that generic session confusion is no longer the main blocker
- the most important remaining gaps read as format-specific fidelity work rather than as generic staging or session-truth failures
- any still-live older direct rows have an explicit status: either bounded compatibility carry-forward or an intentional retirement path
- future import planning can talk about `.step` or `.glb` fidelity without first needing to repair the generic staged session again

Important rule:
- `Generation 0` is no longer only legacy carry-forward
- it is the whole generic import foundation, including the shipped staged baseline and the remaining `Import-4` session-hardening work

#### Generation 1 - Format-Specific Fidelity And Heavy-Source Truth

`Generation 1` is the later format-specific import generation.

The first concrete owner here is `Import-5` for `.step`.

The next planned owner after that is `Import-6` for `.glb`.

A later third owner after that can be `Import-7` for `.stl`.

This generation means:
- a supported format can gain its own truthful staged metadata contract
- the staged importer can explain format-specific limits and assumptions honestly
- heavy-file formats can expose reviewed settings before the heaviest work starts
- staged preview and accepted result can share one reviewed format-specific truth instead of quietly diverging

For `.step`, this generation should cover:
- mesh-versus-B-rep honesty in the staged UI
- STEP-only metadata ownership
- quality or tessellation controls backed by real loader knobs
- units truth that distinguishes detected, assumed, and user-chosen state
- explicit staged load, truthful progress, reuse, and large-file guardrails
- later structure-label and default-shape polish once the heavier truth is explicit

For `.glb`, this generation should later cover:
- scene-count, default-scene, and node-truth honesty
- material and texture presence honesty
- clearer staged wording for animation, camera, light, and skin presence
- better preview-to-commit parity for reviewed `.glb` interpretation
- smarter `.glb` defaults only when the actual scene structure supports them

For `.stl`, this generation should later cover:
- honest mesh-import wording instead of STEP-like tessellation copy
- optional mesh-cleanup controls such as normals repair, vertex welding, or bounded simplification only when the repo has truthful implementation seams
- clearer staged wording for unit assumptions and mesh-only limitations where the file format does not carry richer source truth
- preview-to-commit parity for any reviewed STL cleanup options
- simple reviewed presets only when they map to real mesh-processing behavior instead of fake fidelity promises

What `Generation 1` does well:
- keeps format-specific fidelity work out of the foundational generic import generation
- makes heavy formats feel reviewed and truthful instead of opaque
- preserves the staged-dialog mainline while allowing richer per-format behavior

What `Generation 1` does not yet do:
- make imported `.step` retained topology truth inside ParaHook
- promise true direct B-rep viewport display
- force every other format into the exact same STEP-specific contract
- pretend `.stl` mesh cleanup is the same thing as STEP tessellation or retained geometry

Important rule:
- `Generation 1` should stay format-specific and mesh-first honest
- it should not claim that better STEP metadata, richer `.glb` scene copy, later `.stl` cleanup controls, or a visible `B-Rep` toggle already means retained imported-geometry truth ships

#### Generation 2 - Authoritative Imported Geometry And Retained Source Truth

`Generation 2` is the later imported-geometry truth generation.

This generation should not be planned as just "more STEP UI."

This generation means:
- imported geometry stops being only mesh-owned viewer data
- retained source truth becomes explicit for the formats that genuinely need it
- viewport display, selection, and inspection can derive from that retained truth instead of only from flattened mesh output

For `.step`, this later direction should be planned primarily through:
- `docs/Human-Plans/Architecture/Import/B-rep/B-rep-Vision.md`

What `Generation 2` does well:
- keeps retained imported geometry explicit
- separates truthful staged mesh-first import from later topology-aware import truth
- creates a clean handoff from import-family fidelity work into the later B-rep family

What `Generation 2` does not yet do:
- automatically imply later direct modeling or Spaghetti authoring over imported topology
- reopen the earlier generic staged-session or format-specific fidelity generations

Important rule:
- `Generation 2` is where imported retained geometry starts
- it should not be smuggled into `Import-5` just because `.step` is the first format that obviously wants it

### What Must Stay True

#### 1. Import Must Stay A Staging And Commit Family

Import is where user-supplied assets enter ParaHook.

It should remain:
- a reviewed intake flow
- a settings-and-commit flow
- a truthful handoff into downstream owners

It should not become:
- a second hidden content system
- a long-term runtime owner of accepted project content

#### 2. `Import Files...` Is The Mainline Path

The shipped staged dialog is now the mainline future.

Important rule:
- older direct import rows may remain for compatibility
- but the family should now treat those rows, the staged baseline, and the staged-session hardening work as one broader foundational generation instead of as separate family generations

#### 3. Generic Session Truth Comes Before Format-Specific Fidelity

The staged session should be honest before later format-specific behavior widens on top of it.

Important rule:
- partial-result recovery, per-file staged truth, and object-review layout belong in the foundational import generation before `.step`-specific fidelity controls widen the surface

#### 4. Format-Specific Fidelity And Retained Imported Geometry Are Different Lanes

Better staged `.step` truth is not the same thing as retained B-rep import.

Important rule:
- `Generation 1` can stay mesh-first while still becoming much more truthful
- `Generation 2` should own the later retained imported-geometry step

#### 5. Heavy Import Work Must Stay Honest

If an import is slow, memory-heavy, staged, reused, or user-triggered, the importer should say so clearly.

Important rule:
- prefer explicit load timing, truthful progress, and reuse over hidden heavy work that starts too early or silently repeats

#### 6. Import Must Stay Distinct From Catalog

Import is for arbitrary user-supplied files.

`Catalog` is for curated reusable assets and later reuse surfaces.

Important rule:
- do not turn import into a curated asset browser
- do not make catalog own arbitrary disk-file intake

#### 7. Accepted Imports Must Become Real Downstream Truth

After acceptance, imported content should become visible through the real downstream owner:
- Browser or project content
- viewer/runtime state
- later explicit retained-geometry or inspector systems

Important rule:
- the import dialog may stage truth before commit
- it should not remain the only place that knows accepted content exists

### Ownership Boundaries And Edge Cases

Use this section when future work sits near the line between `Import`, downstream owners, `Catalog`, or the later retained-geometry lane.

- `Import`
  - owns file picking, staged review, pre-commit settings, staged preview interpretation, commit-result feedback, and in-session retry or removal
  - example: reloading or retrying a file before commit still belongs to `Import`

- downstream project or Browser ownership
  - owns accepted content placement, project hierarchy visibility, later naming or organization policy, and any post-commit representation that should exist even after the import dialog closes
  - example: how an accepted import appears in Browser hierarchy after commit is downstream ownership, not staged import ownership

- `Catalog`
  - owns curated reusable asset browsing, reusable saved-item recall, and later library-style entry points
  - example: browsing a known reusable asset collection is `Catalog`, not `Import`, even if the original item first entered through import

- `Generation 2` / `B-rep`
  - owns retained imported geometry, topology-aware inspection, and authoritative imported-shape truth that should survive beyond mesh-first staging
  - example: imported `.step` topology-aware selection belongs to the later retained-geometry lane, not to `Generation 1` staged fidelity alone

Quick edge-case sorting:
- pre-commit retry, removal, or re-review of staged files belongs in `Import`
- post-commit structure ownership, reveal, and project visibility belong downstream
- reusable imported-item browsing after intake belongs in `Catalog`
- post-commit source relink or reimport work should default to the downstream owner unless the change is specifically about the intake contract itself
- retained geometry, topology, and authoritative imported-shape inspection belong in `Generation 2` with the companion `B-rep` direction

### How To Sort Future Work

Use the generations like this:

- if the work improves the older direct rows, batch parity, the reviewed staged baseline, generic staged-session truth, recovery, preview layout, or object review, it belongs in `Generation 0`
- if the work turns a known user-granted local folder into staged supported-file intake, it belongs in `Generation 0` unless it becomes format-specific fidelity
- if the work is `.step`-specific, `.glb`-specific, or another format-specific fidelity contract, it belongs in `Generation 1`
- if the work requires retained imported geometry, topology-aware selection, or authoritative-derived display, it belongs in `Generation 2` and should coordinate with the `B-rep` family
- if the work is curated asset browsing or imported-item recall after intake, it belongs in `Catalog`, not in `Import`
- if the work is mainly post-commit project structure ownership, it likely belongs in Browser or another downstream family instead of import

### Summary

The umbrella import direction is now:
- `Generation 0` is the broad foundational import generation covering `Import-1` through `Import-4`
- `Generation 1` is the later `.step`-first format-specific fidelity generation through `Import-5`, with `.glb` enrichment following through `Import-6` and a later `.stl` cleanup-controls lane left open through `Import-7`
- `Generation 2` is the later retained imported-geometry direction that should widen through the companion `B-rep` vision instead of being blurred into the earlier generations
- the staged dialog remains the mainline import path inside that broader `Generation 0` foundation
- accepted imports still become explicit downstream truth
- future import planning should widen by the simpler boundary of generic import foundation, then format-specific fidelity, then retained imported-geometry truth
