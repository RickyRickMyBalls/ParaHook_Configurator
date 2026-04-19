# v15Theme

## Doc Header

### Doc History
4. 2026-03-22 12:26: Marked `[5.0G-2]` complete after the owner-cleanup pass landed, updating this doc so it reflects the current post-cleanup theme state instead of still describing the second `:root`, late `Spaghetti` override clusters, and `base.css` owner leaks as open work
3. 2026-03-22 12:06: Marked `[5.0G-1]` complete after the manifest split landed and rewrote `[5.0G-2]` around the live post-split cleanup hotspots, file owners, and verification path so the next theme pass is implementation-ready without adding more phases
2. 2026-03-22 11:40: Reworked this doc into a much more implementation-ready theme-split plan, locking the current code seam read, the recommended folder/file layout, and a minimal safe two-phase rollout for `[5.0G-1]` and `[5.0G-2]`
1. 2026-03-22 10:35: Created this architecture doc as the canonical planning surface for `src/app/theme/v15Theme.css`, capturing the real current-state ownership, the recommended split strategy, and the narrow phased cleanup path for the new roadmap family `[5.0G]`

### Purpose

This doc defines the architecture direction for the current `v15` app theme system.

Use it to answer:
- what `src/app/theme/v15Theme.css` owns right now
- which source files are the real theme owners and verification anchors
- which files and folders a safe split should create
- how the theme should be split without changing the app's styling contract
- what `[5.0G-1]` and `[5.0G-2]` should mean at implementation time

### Why This Doc Exists

Right now the app theme is imported once from:
- `src/index.css`
  - `@import './app/theme/v15Theme.css';`

That single import path is good and should stay.

The problem is that `src/app/theme/v15Theme.css` has become the default landing zone for many unrelated surfaces:
- shell and dock chrome
- Browser and Console styling
- viewport overlay and tool-panel styling
- `Spaghetti` editor, canvas, and node styling
- `Radio` and sampler styling
- responsive sections
- late cleanup and override passes

The file is now roughly `11,627` lines and includes:
- one top-level `:root` token block at line `1`
- another later `:root` retuning block near line `10,069`
- several responsive sections such as:
  - line `3,138`
  - line `6,213`
  - line `7,545`
- explicit late override/history markers such as:
  - line `9,151`
  - line `10,068`
  - line `11,263`

This doc exists so the theme system can be planned as one real architecture surface instead of only as one giant stylesheet plus a vague future cleanup idea.

### Scope

This doc covers:
- the current role of `v15Theme.css`
- the concrete code seams that a split will touch
- the recommended folder and file layout
- a minimal safe phase plan
- implementation-ready guidance for the first two cuts

This doc does not cover:
- a visual redesign
- CSS Modules, Tailwind, or CSS-in-JS migration
- renaming broad selector families in the same pass
- one-off visual polish beyond structural cleanup

## Doc Body

### Short Version

Phase 1 and Phase 2 are complete.

The app now keeps one app-wide theme import through:
- `src/index.css`
- `src/app/theme/v15Theme.css`

`v15Theme.css` is now the manifest over:
- `foundation/`
- `shell/`
- `surfaces/`

The theme now keeps the current `9`-file split, has no second global `:root` in a surface file, and no longer leaves browser/radio owner spillover in `foundation/base.css`.

Implementation result:
- shared tokens live in `foundation/tokens.css`
- shared control primitives stay in `foundation/base.css`
- browser animations live in `surfaces/browser.css`
- radio/overlay action rules live in `surfaces/radio-audio.css`
- the core `Spaghetti` node-template and number-driver rules now live as canonical owner blocks instead of depending on later cleanup-pass overrides

Phase count decision:
- keep this as `2` phases
- do not add more roadmap phases unless cleanup exposes a real blocker

Reason:
- Phase 1 and Phase 2 are still different kinds of work
- a Phase 3 for naming or extra splitting would be unnecessary overhead right now

### Current Code Seam Read

Current import seam:
- `src/index.css`
  - imports `src/app/theme/v15Theme.css`
- `src/app/theme/v15Theme.css`
  - imports:
    - `foundation/tokens.css`
    - `foundation/base.css`
    - `shell/docks.css`
    - `shell/windows.css`
    - `surfaces/browser.css`
    - `surfaces/console.css`
    - `surfaces/viewport-overlay.css`
    - `surfaces/spaghetti.css`
    - `surfaces/radio-audio.css`

Current theme folder:
- `src/app/theme/`
  - `v15Theme.css`
  - `foundation/`
    - `tokens.css`
    - `base.css`
  - `shell/`
    - `docks.css`
    - `windows.css`
  - `surfaces/`
    - `browser.css`
    - `console.css`
    - `viewport-overlay.css`
    - `spaghetti.css`
    - `radio-audio.css`

Current post-cleanup ownership read from the live split:
- `src/app/theme/foundation/base.css`
  - owns the shared-primitives surface including `V15*`, `ParaSlider*`, and `ParaSelect*`
- `src/app/theme/surfaces/viewport-overlay.css`
  - owns both overlay/tool-panel families and `ViewToolbar*`
- `src/app/theme/surfaces/spaghetti.css`
  - is still the largest file
  - no longer contains a second global `:root`
  - no longer depends on the old cleanup-pass comment block or the repeated number-driver override cluster

Main theme-owner files that define the class families the stylesheet is serving:
- `src/app/AppShell.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsolePanel.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/RadioPanel.tsx`
- `src/app/panels/AudioSamplerPanel.tsx`

Primary selector-family read from the live code and stylesheet:
- shell and dock
  - `LeftDock*`
  - `RightDock*`
  - shell resize/menu/toggle classes
- workspace surfaces
  - `Browser*`
  - `Console*`
  - `ViewportOverlay*`
  - `ViewportOverlayToolPanel*`
- editor and graph surfaces
  - `Spaghetti*`
  - shared `V15*` panel primitives used inside those surfaces
- feature surfaces
  - `RadioPanel*`
  - `AudioSampler*`

Practical ownership read:
- Phase 1 landed as a CSS-only structural split
- Phase 2 should still stay CSS-first
- the TSX files above are mainly ownership anchors and regression checkpoints
- they should not need broad edits unless cleanup exposes one clearly wrong owner seam

### Phase 2 Files Likely To Be Edited

Definitely edited in Phase 2:
- `src/app/theme/foundation/tokens.css`
- `src/app/theme/foundation/base.css`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/theme/surfaces/spaghetti.css`

May be edited if cleanup ripples across shared ownership:
- `src/app/theme/surfaces/browser.css`
- `src/app/theme/surfaces/console.css`
- `src/app/theme/surfaces/radio-audio.css`
- `src/app/theme/shell/docks.css`
- `src/app/theme/shell/windows.css`

Not expected to need meaningful edits in Phase 2:
- `src/index.css`
- `src/app/theme/v15Theme.css`

Expected verification anchors, but not expected broad edit targets in Phase 2:
- `src/app/AppShell.tsx`
- `src/app/components/ViewToolbar.tsx`
- `src/app/components/ViewportOverlay.tsx`
- `src/app/components/ViewportOverlayToolPanel.tsx`
- `src/app/console/ConsoleDock.tsx`
- `src/app/console/ConsolePanel.tsx`
- `src/app/panels/BrowserPanel.tsx`
- `src/app/panels/SpaghettiPanel.tsx`
- `src/app/panels/RadioPanel.tsx`
- `src/app/panels/AudioSamplerPanel.tsx`

Primary regression anchors:
- `src/app/AppShell.test.tsx`
- `src/app/components/ViewportOverlay.test.tsx`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/panels/SpaghettiPanel.test.tsx`
- `src/app/panels/RadioPanel.test.tsx`
- `src/app/panels/AudioSamplerPanel.test.tsx`

### Recommended Target File Layout

Recommended first-pass folder layout:

- `src/app/theme/v15Theme.css`
  - keep as the canonical manifest file

- `src/app/theme/foundation/`
  - `tokens.css`
  - `base.css`

- `src/app/theme/shell/`
  - `docks.css`
  - `windows.css`

- `src/app/theme/surfaces/`
  - `browser.css`
  - `console.css`
  - `viewport-overlay.css`
  - `spaghetti.css`
  - `radio-audio.css`

Why this is the recommended minimum:
- it keeps one stable import path
- it avoids dozens of tiny files
- it gives the major surface families a real owner
- it keeps `Radio` and sampler together for now, which is safer than over-splitting

Not recommended in the first cut:
- `features/` folder
- per-component CSS files
- `misc.css`
- a second top-level manifest path

### Locked Direction

- Keep `src/index.css` importing `src/app/theme/v15Theme.css`.
- Keep `src/app/theme/v15Theme.css` as the manifest file; do not rename it here.
- Keep the current `9`-file split as the default Phase 2 working surface.
- Keep the existing class names unless a cleanup requires a tiny local selector correction.
- Treat Phase 2 as a cleanup pass inside the landed split, not a cleanup-by-redesign pass.
- Keep the phase count at `2`.
- Use folders under `src/app/theme/`; do not keep all new files flat in one directory.
- Do not add a rename-only or extra decomposition phase unless the live cleanup work exposes a real blocker.

### Rules For The Split

- Keep one canonical top-level import path for the app theme.
- Prefer one canonical file owner per selector family.
- Prefer one canonical file owner per token group.
- Keep shared primitives in foundation, not repeated inside surface files.
- Move responsive rules with their owning surface when practical.
- Treat later duplicate `:root` blocks as cleanup targets unless they have a strong scoped reason.
- Do not rewrite component code just to make the CSS split look cleaner.
- Do not rename broad class families in the same pass as the first file split.

### Non-Goals

This theme work should not automatically become:
- a redesign pass
- a typography rethink
- a color-system rewrite
- a CSS Modules migration
- a CSS-in-JS migration
- a Tailwind or utility-class migration
- a broad TSX refactor

### Risks To Avoid

- Do not split the stylesheet into too many tiny files.
- Do not keep old override-history blocks scattered after the split.
- Do not introduce a catch-all file like `misc.css`.
- Do not mix visual redesign with structural decomposition.
- Do not widen the work into `AppShell` extraction or workspace-host architecture.

The goal is not more files.

The goal is clearer theme ownership with low risk.

## [x] Phase 1 - `[5.0G-1]` Theme Manifest And Surface File Split

### Info

This phase is complete.

It created the real internal file structure while preserving the app's external styling contract.

Primary outcome:
- `src/index.css` still points at one theme entry
- `src/app/theme/v15Theme.css` becomes the manifest
- the large selector families move into a small number of honest owned files
- the visible UI stays effectively the same

Phase boundary:
- this phase may move selectors between files
- this phase should not do broad selector cleanup beyond what is required to keep the split correct

#### Checklist

- [x] keep `src/index.css` importing `src/app/theme/v15Theme.css`
- [x] create `src/app/theme/foundation/`
- [x] create `src/app/theme/shell/`
- [x] create `src/app/theme/surfaces/`
- [x] move theme tokens and shared base rules into `foundation/tokens.css` and `foundation/base.css`
- [x] move dock and shared shell chrome into `shell/docks.css` and `shell/windows.css`
- [x] move Browser selectors into `surfaces/browser.css`
- [x] move Console selectors into `surfaces/console.css`
- [x] move viewport overlay and shared tool-panel selectors into `surfaces/viewport-overlay.css`
- [x] move `Spaghetti` selectors into `surfaces/spaghetti.css`
- [x] move `RadioPanel*` and `AudioSampler*` selectors into `surfaces/radio-audio.css`
- [x] reduce `src/app/theme/v15Theme.css` to manifest-only imports plus any unavoidable tiny global glue
- [x] verify no broad TSX class rename is required for the split
- [x] verify visual parity across shell, browser, console, viewport overlay, spaghetti, and radio surfaces

### Decision / Questions

#### Q1 - Should the app keep the current top-level import path?

##### Suggestion 1

Yes.

Keep:
- `src/index.css`
  - `@import './app/theme/v15Theme.css';`

Reason:
- lowest risk
- no broader app import churn
- keeps the first phase CSS-only

#### Q2 - Should `v15Theme.css` be renamed in Phase 1?

##### Suggestion 1

No.

Keep `v15Theme.css` as the manifest filename in Phase 1.

Reason:
- safer diff
- no practical architecture benefit from renaming right now
- matches the existing roadmap and docs language

#### Q3 - Should `Radio` and sampler be separate files in Phase 1?

##### Suggestion 1

No.

Keep them together in:
- `src/app/theme/surfaces/radio-audio.css`

Reason:
- fewer files
- safer ownership while those surfaces are still closely related
- can be split later only if the combined file becomes too large

### Implementation Spec

Implementation target:
- convert `src/app/theme/v15Theme.css` into the manifest
- preserve class names
- preserve runtime styling behavior

Files to create:
- `src/app/theme/foundation/tokens.css`
- `src/app/theme/foundation/base.css`
- `src/app/theme/shell/docks.css`
- `src/app/theme/shell/windows.css`
- `src/app/theme/surfaces/browser.css`
- `src/app/theme/surfaces/console.css`
- `src/app/theme/surfaces/viewport-overlay.css`
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/theme/surfaces/radio-audio.css`

Files to edit:
- `src/app/theme/v15Theme.css`
- optionally `src/index.css` only if the live CSS import semantics require a tiny correction

Recommended move order:
1. Extract `:root` tokens and stable base document rules into `foundation/`.
2. Extract shell/dock/window chrome into `shell/`.
3. Extract Browser and Console into `surfaces/browser.css` and `surfaces/console.css`.
4. Extract viewport overlay and shared tool-panel classes into `surfaces/viewport-overlay.css`.
5. Extract `Spaghetti*` and shared editor-specific families into `surfaces/spaghetti.css`.
6. Extract `RadioPanel*` and `AudioSampler*` into `surfaces/radio-audio.css`.
7. Reduce `v15Theme.css` to ordered `@import` statements and tiny unavoidable global glue only.

Recommended manifest order:
1. `foundation/tokens.css`
2. `foundation/base.css`
3. `shell/docks.css`
4. `shell/windows.css`
5. `surfaces/browser.css`
6. `surfaces/console.css`
7. `surfaces/viewport-overlay.css`
8. `surfaces/spaghetti.css`
9. `surfaces/radio-audio.css`

Verification target:
- app renders without obvious visual regression
- left and right dock layout still works
- browser surface still renders and behaves normally
- console dock, floating, and pop-out presentation still read correctly
- viewport overlay/tool panels still render correctly
- spaghetti panel and node surfaces still render correctly
- radio and sampler surfaces still render correctly

Preferred verification commands:
- focused test runs around shell and surface owners
- one manual app smoke pass for visible styling parity

Success definition:
- theme is physically split
- app still has one import path
- class names remain stable
- no user-visible redesign is introduced

## [x] Phase 2 - `[5.0G-2]` Cascade Cleanup And Override Reduction

### Info

This phase is complete.

It cleaned the current split in place without starting another architecture lane.

Primary outcome:
- fewer override-history smells
- clearer ownership confidence
- simpler future edits inside the split files

Completed cleanup targets:
- `src/app/theme/surfaces/spaghetti.css`
  - removed the second global `:root`
  - removed the explicit cleanup-pass / final-override chronology blocks
  - consolidated the repeated node-template, output-port, and number-driver families
- `src/app/theme/foundation/base.css`
  - kept the shared-primitives surface while shedding browser/radio owner leaks
- `src/app/theme/surfaces/viewport-overlay.css`
  - kept overlay/tool-panel and `ViewToolbar*` ownership together, with no Phase 2 split-out

Phase boundary:
- this phase may consolidate duplicate tokens and repeated selector families
- this phase may move rules between the existing split files when ownership is clearly wrong
- this phase should still avoid broad redesign, naming churn, or a second file-tree expansion

#### Checklist

- [x] audit `src/app/theme/surfaces/spaghetti.css` for chronology markers, duplicate selector restatements, and the second global `:root`
- [x] decide token-by-token whether the `--sp-*` variables belong in `foundation/tokens.css` or under a stable Spaghetti-local scope
- [x] remove the second global `:root` from `src/app/theme/surfaces/spaghetti.css` unless a scoped replacement is required
- [x] collapse duplicated `SpaghettiNodeTemplate`, driver-control, template-section, and output-preview selector families into one canonical owner block each
- [x] move any truly surface-owned rules that still live in `src/app/theme/foundation/base.css` into their actual owner file
- [x] keep shared `V15*`, `ParaSlider*`, and `ParaSelect*` primitives in `foundation/` instead of duplicating them in surface files
- [x] keep `ViewToolbar*` with `viewport-overlay.css` unless a rule is proven generic or better owned elsewhere
- [x] regroup `@media` rules with their owning file where chronology-only placement still remains
- [x] remove explicit `final override` / cleanup-pass comment blocks once a canonical owner definition exists
- [x] re-check shell, browser, console, viewport overlay, spaghetti, and radio/audio parity after each cleanup batch
- [x] stop before any broad visual redesign, file rename, or new folder expansion begins

### Decision / Questions

#### Q1 - Should Phase 2 create more theme files?

##### Suggestion 1

No, not by default.

Keep cleanup inside the current `9`-file split unless one file still contains a clearly separable owner after consolidation.

Reason:
- least amount of phase and file churn
- keeps Phase 2 focused on ownership cleanup instead of restarting decomposition
- safer diff while workspace-mode work is still ahead

#### Q2 - What should happen to the second global `:root` block and the `--sp-*` tokens?

##### Suggestion 1

Treat the second global `:root` as a cleanup target and decide the `--sp-*` variables one by one.

Recommended rule:
- if a token is truly shared, move it into `foundation/tokens.css`
- if a token is only for the Spaghetti surface, move it under a stable Spaghetti-local scope
- do not leave a second global `:root` in a surface file after Phase 2 unless there is a very strong reason

#### Q3 - Should `ViewToolbar*` leave `src/app/theme/surfaces/viewport-overlay.css` in Phase 2?

##### Suggestion 1

No.

Keep `ViewToolbar*` with `viewport-overlay.css` in this phase unless a rule is clearly generic or a later host/surface architecture change creates a better owner.

Reason:
- it avoids unnecessary file churn
- the toolbar and overlay still ship together today
- workspace-mode and AppShell work can revisit that seam later if the ownership changes for real

#### Q4 - Should Phase 2 rename theme files or selector families?

##### Suggestion 1

No.

Keep file names and broad selector names stable in this phase.

Reason:
- cleanup is the real work here
- rename churn adds review noise without solving the current override debt
- later workspace-mode naming work is the better home for any rename pass

### Implementation Spec

Implementation target:
- clean the landed split in place so each file reads like a real owner instead of a pasted chronology chunk

Phase 2 working rule:
- no new roadmap phase
- no broad TSX refactor
- no rename-only follow-on
- default to edits inside the current files unless a concrete blocker forces a different move

Primary edit targets:
- `src/app/theme/foundation/tokens.css`
- `src/app/theme/foundation/base.css`
- `src/app/theme/surfaces/spaghetti.css`
- `src/app/theme/surfaces/viewport-overlay.css`

Secondary edit targets only if cleanup ripples outward:
- `src/app/theme/surfaces/browser.css`
- `src/app/theme/surfaces/console.css`
- `src/app/theme/surfaces/radio-audio.css`
- `src/app/theme/shell/docks.css`
- `src/app/theme/shell/windows.css`

Concrete cleanup targets from the live split:
- `src/app/theme/surfaces/spaghetti.css`
  - second global `:root`
  - `Spaghetti node UI cleanup pass` chronology block
  - repeated `SpaghettiNodeTemplate` / `SpaghettiDriverControlRow--number` restatements
  - other late template, output, and utility restatements that only exist because they were appended later in the old monolith
- `src/app/theme/foundation/base.css`
  - keep shared controls and panel primitives here
  - evict any rules that are actually surface-owned and only landed here because the Phase 1 split stayed conservative
- `src/app/theme/surfaces/viewport-overlay.css`
  - keep overlay/tool-panel and `ViewToolbar*` ownership coherent
  - move only truly generic helpers back into `foundation/`

Recommended work order:
1. Inventory every late restatement cluster inside `src/app/theme/surfaces/spaghetti.css`.
2. Decide one canonical owner block per repeated Spaghetti family.
3. Consolidate those repeated families into their canonical blocks and remove the later restatements.
4. Resolve the `--sp-*` token ownership and eliminate the second global `:root`.
5. Audit `src/app/theme/foundation/base.css` so it keeps shared primitives but not accidental surface ownership.
6. Audit `src/app/theme/surfaces/viewport-overlay.css` so overlay/tool-panel and `ViewToolbar*` remain coherent and generic helpers move only when clearly justified.
7. Re-group any remaining chronology-placed responsive rules under their real owners.
8. Re-run focused UI regression checks after each cleanup batch instead of waiting for one big end-of-phase test pass.

Verification target:
- no visual regressions after cleanup
- no second global `:root` outside `foundation/tokens.css` unless a scoped justification is explicit
- fewer source-order surprises when editing one surface file
- future styling work has a clearer default destination

Preferred verification:
- reuse the focused Phase 1 surface tests:
  - `src/app/AppShell.test.tsx`
  - `src/app/console/ConsoleDock.test.tsx`
  - `src/app/components/ViewportOverlay.test.tsx`
  - `src/app/panels/BrowserPanel.test.tsx`
  - `src/app/panels/SpaghettiPanel.test.tsx`
  - `src/app/panels/RadioPanel.test.tsx`
  - `src/app/panels/AudioSamplerPanel.test.tsx`
- do one manual smoke pass across:
  - shell/docks
  - browser
  - console
  - viewport overlay/tool-panel
  - spaghetti panel and node surfaces
  - radio/audio
- if the repo-wide build is still blocked by unrelated in-progress TypeScript work, record that explicitly instead of widening Phase 2 to fix unrelated features

Success definition:
- split files feel like real owners rather than old chronology chunks pasted into folders
- later edits no longer depend mainly on "put it later in the file"
- the second global `:root` is gone or replaced by a clearly scoped local token owner
- explicit `final override` / cleanup-pass comment blocks are removed because the canonical owner now exists
- the theme system is cleaner without becoming a redesign, rename, or workspace-mode project

### Relationship To Other Docs

- `docs/Human-Plans/roadmap/roadmap.md`
  - owns the live lane and phase placement for `[5.0G]`

- `docs/Human-Plans/Architecture/Workspace-Modes.md`
  - owns the broader workspace-surface host model that later benefits from cleaner theme ownership

- `docs/Human-Plans/Architecture/AppShell/AppShell-Index.md`
  - owns `AppShell` responsibility cleanup, not the theme split itself

Plain-English rule:
- `AppShell` cleanup and theme cleanup are adjacent
- but they are not the same job
