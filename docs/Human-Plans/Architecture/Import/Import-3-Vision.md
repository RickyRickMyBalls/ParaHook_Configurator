# Import-3 Vision

## Doc Header

### Doc History
6. 2026-04-16: Updated the relationship pointer to the master `Import-Vision.md` again so this staged-import-window north star now reads as part of the broader `Generation 0` import foundation after the family generation collapse
5. 2026-04-16: Added a relationship pointer to the new `Import-Vision.md` master doc so this staged-import-window north star now reads as the `Generation 1` sub-vision inside the broader import family instead of as a stand-alone umbrella
4. 2026-04-16: Updated the `Import-3` relationship pointer to the shipped phase record after the staged import-window lane fully landed, so this vision doc now points at the completed execution history instead of the removed `Future/` path
3. 2026-04-16: Expanded the `Import-3` vision so the staged import dialog now explicitly includes a preview-style Browser organization surface, documenting that users should be able to organize staged import objects through rows plus drag-and-drop into components or sub-assemblies before `Add To Project` commits the reviewed structure into real project content
2. 2026-04-16: Locked the staged import menu label to `Import Files...`, replacing the earlier open naming recommendation so the `Import-3` vision now treats that Browser `+` menu entry as the chosen working label instead of leaving `Import Dialog` versus `Import Files...` undecided
1. 2026-04-16: Added this dedicated `Import-3` vision doc to capture the staged import-window north star, documenting that the Browser `+` import flow should gain one new dialog-entry option, that imported `.step`, `.stl`, `.obj`, and `.glb` files should first land in a floating import window for structure and orientation review, and that users should explicitly choose browse intake, import mode, up-axis, scale or units alignment, and optional `New Assembly` placement before `Add To Project`

### Purpose

This doc captures the long-range vision for the staged `Import-3` import window in ParaHook.

Use it to answer:
- what the new staged import experience should feel like
- how the new import entry should appear in the existing Browser `+` import menu
- which file types the staged import window should support
- what the floating import window should let the user inspect or decide before commit
- what must stay true so the import window remains a staging surface instead of quietly becoming a second hidden content system

Do not use it for:
- one narrow implementation checklist
- phase-by-phase execution prep
- pretending the import window itself owns project content after acceptance

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping staged import aligned with explicit project/content truth and honest downstream viewer behavior

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that import remains a real workspace capability instead of a one-off product-specific shortcut

- `docs/Human-Plans/Architecture/Import/Import-Vision.md`
  - master import-family north star
  - useful for how this staged-import-window direction fits as one shipped reviewed-import baseline inside the broader `Generation 0` import foundation before the later `.step`-specific fidelity generation widens the family

- `docs/Human-Plans/Architecture/Import/Import-Index.md`
  - umbrella import-family direction
  - useful for the current family boundaries and how `Import-3` fits after `Import-2`

- `docs/Human-Plans/Architecture/Import/Shipped/Import_Phase Import-3 - Import Window Structure Review And Add-To-Project Settings.md`
  - the shipped phase record for `Import-3`
  - useful for the completed wishlist ladder, implementation history, and final verification shape

## Doc Body

### Why This Doc Exists

The import family already has:
- one shipped batch lane for `.obj`
- one planned parity lane for the rest of the current supported import types

But the repo did not yet have one stable answer to:
- what the new staged import dialog should actually feel like
- where that entry should live in the current Browser import affordance
- which file types should be handled there
- what decisions the user should make before imported references become project content

Without a vision doc, the new import work risks drifting into one of two weak shapes:
- a thin wrapper over the current picker that still commits content too early
- a large asset-management surface that grows beyond the honest scope of import

This doc exists to keep `Import-3` on the narrow honest path between those two failures.

### Short Version

`Import-3` should introduce one real staged import dialog for user file intake.

The intended experience is:
1. the user clicks the Browser `+` button anchored to the right side of `Content`
2. the existing `Import Reference` menu opens
3. the first new option opens the staged import dialog
4. the dialog shows supported file types and a `Browser` row the user can click to add local files
5. selected files appear in the dialog as a staged list instead of becoming project content immediately
6. each file exposes its structure read plus import options before commit
7. the dialog exposes a preview-style Browser where the user can organize the staged imports into components or sub-assemblies
8. the user chooses orientation, scale or units alignment, and optional `New Assembly` placement
9. the user clicks `Add To Project` to commit the reviewed imports

When it is good, it should let the user:
- stage `.step`, `.stl`, `.obj`, and `.glb` files in one import window flow
- see which supported file types were selected
- inspect whether each file has hierarchy, multiple objects, or parts
- choose whether to import a structured file as one object or as multiple objects inside one component
- organize staged import objects in a preview Browser with rows before commit
- drag and drop staged import objects into components or sub-assemblies so the import lands organized
- choose `Z Up`, `Y Up`, or `X Up`
- choose scale or units alignment for each file
- optionally place the accepted imports into a new assembly

Important rule:
- the import dialog should help the user decide before commit
- it should not become the hidden long-term owner of imported project content after acceptance

### Chosen Entry Label

Chosen label for the new first menu option:
- `Import Files...`

Reason:
- it names the user action instead of the UI primitive
- it is clearer than `Import Dialog`
- it leaves room for the dialog to support multiple supported file types without sounding format-specific

Important rule:
- the final visible label should describe what the user is doing, not only which UI container opens

### Supported File Types

The staged import dialog should support all current `Import Reference` file types:
- `.step`
- `.stl`
- `.obj`
- `.glb`

Important rule:
- `Import-3` should not widen into arbitrary new file-format support
- it should first stage the types ParaHook already exposes through the import menu

### Entry Flow Direction

The first honest entry flow should stay grounded in the existing Browser import surface.

Expected entry sequence:
- the user clicks the Browser `+` button in `Content`
- the existing `Import Reference` menu appears
- the first option opens the staged import dialog
- the user then adds local files from inside that dialog

Important rule:
- do not replace the current Browser `+` entry surface
- the new flow should branch from that surface cleanly instead of inventing a second disconnected intake path

### Import Dialog Surface Direction

The new staged import surface should be a floating dialog window.

It should feel like:
- a focused pre-add staging window
- explicit
- review-first
- multi-file aware

It should not feel like:
- a hidden background batch job
- a second Browser tree
- a generalized asset library

Recommended first visible regions:

#### 1. Intake Area

- supported file-type read
- one `Browser` row or button for adding local files
- clear staged-file count once files are added

#### 2. Staged File List

- one row per selected file
- visible file-type label
- clear selected-file ordering
- ability to review all staged supported files before commit

#### 3. Preview Browser Organization Surface

- preview Browser rows for the staged import result
- easy ways to drag and drop staged objects into components
- easy ways to drag and drop staged objects into sub-assemblies
- visible pre-commit organization before the user accepts the import

#### 4. Per-File Structure And Import Settings

- structure read for the selected file
- import mode choice
- up-axis choice
- scale or units alignment

#### 5. Commit Area

- optional `New Assembly` placement choice
- `Add To Project`
- cancel or close behavior that leaves project content unchanged

Important rule:
- the dialog should stage imports clearly before commit
- it should not silently add accepted rows to project content while the user is still reviewing options

### Browser Intake Direction

Inside the staged import dialog, the user should see one explicit row for:
- `Browser`

Clicking that row should:
- open the local file-browser flow
- accept supported staged import file types
- feed selected files back into the import dialog
- not add those files directly into project content yet

Important rule:
- `Browser` inside the import dialog is an intake action, not project ownership
- local file browsing should feed import-draft state first, and accepted project content only after `Add To Project`

### Structure Review Direction

After files are added, the dialog should show the user the best honest structure read available for each file.

Useful first structure reads:
- file type
- whether the file has multiple objects
- whether the file has hierarchy
- whether the file has parts
- visible structure labels when they exist

Important rule:
- show the best truthful structure read available
- do not invent fake hierarchy when the file reads flatter than that

### Preview Browser Organization Direction

The staged import dialog should also expose a preview-style Browser for the accepted import result before commit.

Good first direction:
- show rows for the staged imported objects
- let the user organize those rows before commit
- support easy drag-and-drop into components
- support easy drag-and-drop into sub-assemblies
- let the user preview how the import will land once `Add To Project` is pressed

Important rule:
- this preview Browser is a staging organization surface, not a second permanent Browser owner
- the organization chosen there should become real project structure only after explicit acceptance
- pre-commit organization should stay honest to the staged import result instead of inventing Browser-only structure that cannot be committed

### Import Mode Direction

For structured files, each staged file should expose two explicit import choices:
- import as `1 Object`
- import as `Multiple Objects In 1 Component`

Good first read:
- `1 Object`
  - preserves one wrapper-style imported object result
- `Multiple Objects In 1 Component`
  - promotes the discovered sub-objects or parts into multiple object rows grouped inside one component

Important rule:
- show the split choice only when the structure read honestly supports it
- keep the single-object path as the compatibility option
- the split path should stay truthful to the discovered source structure instead of inventing synthetic Browser-only hierarchy

### Orientation Direction

Each staged file should let the user choose its up-axis before commit:
- `Z Up`
- `Y Up`
- `X Up`

Important rule:
- orientation should be decided in the staged import flow, not hidden as an awkward post-import correction

### Scale And Units Direction

Each staged file should let the user align scale or units before `Add To Project`.

Good first direction:
- expose one clear scale or units alignment area per file
- make the chosen setting part of the accepted import configuration
- keep the first pass deterministic and explicit

Important rule:
- do not treat units correction as a viewer-only trick
- import-time normalization should become explicit accepted import truth

### New Assembly Direction

The staged import dialog should offer:
- `Put Accepted Imports In New Assembly`

When enabled:
- the accepted staged files should land under one newly created assembly

When disabled:
- accepted staged files should follow the normal resolved Browser landing behavior

Important rule:
- `New Assembly` is a placement choice at commit time
- it should not create content rows early just because the option is visible in the staged dialog

### What Must Stay True

#### 1. The Import Dialog Must Stay A Staging Surface

The staged import dialog is where the user inspects files and chooses import settings.

`Browser` and project content are where imported results should become explicit truth after acceptance.

Important rule:
- staging is not the same thing as ownership
- the dialog should not quietly become a second content system

#### 2. Imported Content Must Still Land In Real Project Structure

After `Add To Project`, the results should become real Browser or project content.

Important rule:
- imported rows should stay legible in real project structure
- the staged import dialog should not trap accepted content in a dialog-local state model
- any preview Browser organization chosen before commit should survive as the accepted project organization instead of being thrown away on import

#### 3. Structure Decisions Must Stay Honest

The import mode choices should reflect the actual discovered structure of the source file.

Important rule:
- do not promise multi-object import when the structure read does not support it
- do not flatten everything into one default if the file clearly contains meaningful sub-objects or parts and the user asked for them

#### 4. Import Must Stay Distinct From Catalog

`Import-3` is for arbitrary user-selected local files.

It should stay separate from curated repo-backed asset browsing.

Important rule:
- do not let the staged import dialog drift into a `Catalog`-like asset library
- local file intake and curated repo-backed selection are different systems

### Non-Goals

This vision does not require:
- drag-and-drop import in the first `Import-3` cut
- `.mtl` or texture-bundle support
- material editing inside the import dialog
- archive or package import formats
- a generalized asset-management library
- deep hierarchy editing inside the import dialog
- a second permanent hidden content system outside normal project ownership

### Summary

The `Import-3` vision is now:
- add one new staged import option to the existing Browser `+` import menu
- use that option to open a floating import dialog
- support `.step`, `.stl`, `.obj`, and `.glb`
- give the user one `Browser` intake row to add local files into the staged dialog
- show the selected files plus their best honest structure read
- expose a preview Browser where the user can organize staged import rows into components or sub-assemblies before commit
- let the user choose import mode, up-axis, scale or units alignment, and optional `New Assembly` placement
- commit only after explicit `Add To Project`
- keep the dialog as a staging surface and let accepted results become real project content downstream
