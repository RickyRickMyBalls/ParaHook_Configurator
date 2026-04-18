# Home Page Vision

## Doc Header

### Doc History
6. 2026-04-17 20:38:47: Expanded the `Home Page` vision so the human-level goals and owned-content read now explicitly allow one lightweight repo/docs/version orientation area, including a small GitHub link, docs link, and brief version and what's-new summary without turning `Home Page` into the full release-notes owner
5. 2026-04-17 20:35:24: Expanded the `Home Page` storage-transparency vision so the human-level wishlist and the storage section now explicitly say ParaHook should show and expose any app-owned persisted data it stores on the user's machine or browser profile, keeping the future `Home Page` honest about owned persistence instead of only reporting one bucket
4. 2026-04-17 20:30:24: Expanded the `Home Page` human-level wishlist to include one explicit goal for saving graph contents in browser storage behind a user-controlled on/off setting, keeping that desire visible at the vision layer without yet locking the exact persistence implementation
3. 2026-04-17 20:19:47: Added a dedicated `Human Level Goals` section to this vision using the user-provided wishlist only, keeping the top-level `Home Page` goals explicit without widening them into extra wishlist items beyond startup, startup toggle, and browser-storage visibility
2. 2026-04-17 20:01:01: Expanded the `Home Page` startup read so the vision now explicitly says `Home Page` should be the default first surface on app launch while also allowing one user preference to skip `Home Page` on startup and open directly into `Model Viewport`, clarifying that this toggle changes startup behavior only and does not remove `Home Page` from the shared workspace model
1. 2026-04-17 19:51:24: Added this dedicated `Home-Page-Vision.md` north-star doc under `Workspace-Modes/Workspaces/Home-Page/` so the repo now has one stable planning home for a real workspace landing surface that can exist without an open `Model Viewport`, act as the honest return target when the last model viewport closes, and expose explicit browser-storage transparency without turning the page into a hidden second Browser, project owner, or shell-only fallback hack

### Purpose

This doc captures the long-range vision for the `Home Page` workspace in ParaHook.

Use it to answer:
- what the `Home Page` surface is supposed to be for
- how `Home Page` should fit inside the shared workspace model
- what should happen when the user starts fresh or closes the last `Model Viewport`
- what kinds of launch, restore, and storage-transparency reads should belong there
- what must stay true so `Home Page` helps onboarding without becoming a hidden second content or settings system

Do not use it for:
- one specific implementation checklist
- pretending `Home Page` owns project truth, Browser truth, or graph truth
- inventing a separate routing or page-mode framework outside the workspace system
- replacing the later implementation-planning role of a future `Home-Page` family index

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for the rule that workspace presentation stays downstream from explicit authored and project truth

- `docs/Human-Plans/roadmap/Vision-roadmap.md`
  - deeper product and architecture north star
  - useful for checking that `Home Page` remains one workspace surface inside the hybrid layout model instead of becoming a separate app mode

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
  - umbrella workspace family
  - useful for how `Home Page` should fit alongside `Model Viewport`, `Browser`, `Catalog`, `Console`, and later other workspace surfaces

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Browser/Browser-Index.md`
  - Browser and project-content ownership family
  - useful for the rule that `Home Page` should link into Browser or project actions without becoming a second project-content owner

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Catalog/Catalog-Vision.md`
  - curated browse-and-load workspace family
  - useful for the rule that `Home Page` may launch the user into `Catalog` without absorbing catalog ownership or preview behavior

- `docs/Human-Plans/Architecture/Workspace-Modes/Workspaces/Model-Viewport/Model-Viewport-Index.md`
  - model-viewport family
  - useful for the rule that `Home Page` may replace the last open viewer as the root landing surface without inheriting viewer-local ownership

## Doc Body

### Why This Doc Exists

ParaHook currently has a real workspace system, but it still carries one strong historical assumption:
- at least one `Model Viewport` should remain open

That protected-viewer rule kept the first shared workspace passes stable, but it is not the only honest long-range shape.

The user-facing problem is simple:
- when the user is not actively viewing geometry yet, the app still wants a meaningful landing surface
- when the user closes the last `Model Viewport`, the app should be able to return somewhere intentional instead of forcing a protected viewer to survive only because the shell expects one
- when the user wants to understand whether browser-stored state is growing, the app should expose that truth explicitly instead of hiding it in browser settings

Without a vision doc, `Home Page` risks drifting into one of two weak shapes:
- a special route or splash page outside the workspace model
- a vague junk drawer that mixes onboarding, settings, Browser ownership, cache cleanup, and project truth into one hard-to-retire surface

This doc exists to keep `Home Page` on the narrow honest path between those failures.

### Human Level Goals

Keep these as the explicit human-level wishlist items for `Home Page`:

- `Home Page` should be the first surface the user loads into.
- There should be a toggle so the user can switch off `Home Page` first and load directly into `Model Viewport`.
- `Home Page` should keep track of browser storage so the user can tell if there is a leak.
- `Home Page` should help the user understand whether the app is storing data and bloating browser-side storage.
- The user should be able to save what they have in their graphs in browser storage and turn that setting on or off.
- `Home Page` should show and expose any app-owned data ParaHook stores on the user's computer or in browser storage.
- `Home Page` should include a small GitHub link, docs link, and a brief version and what's-new summary.

### Short Version

`Home Page` should be a real workspace surface inside the shared workspace model.

It should not be a special route.
It should not be a shell-only fallback hack.
It should not be a hidden second `Browser`.

The first healthy read is:
- ParaHook should start with `Home Page` as the visible landing surface by default
- ParaHook can return to `Home Page` when the last `Model Viewport` closes
- the user can move from `Home Page` into `Model Viewport`, `Browser`, `Catalog`, `Console`, or later other real surfaces through explicit actions
- the user may choose one startup preference that skips `Home Page` on app launch and opens directly into `Model Viewport`
- `Home Page` can show explicit browser-storage transparency so the user can see what ParaHook itself has persisted
- `Home Page` can distinguish ParaHook-owned persisted data from broader browser-managed origin storage so normal cache growth is not mislabeled as a ParaHook leak

Important rule:
- `Home Page` should help the user start, resume, and inspect workspace state
- it should not become the hidden long-term owner of project data, graph data, or viewer behavior
- the startup toggle changes launch behavior only; it does not disable the `Home Page` surface itself

### Home Page As A Real Workspace Surface

`Home Page` should be treated as a first-class workspace surface.

That means:
- it belongs inside the shared slot, split, float, redock, and later pop-out model
- it should be swappable like other workspace surfaces
- it should not require a separate router-only ownership path
- it should not become app-global just because it often appears first

The cleanest long-range read is:
- `Home Page` is a workspace-global surface
- it can occupy the root slot when no `Model Viewport` is open
- it can also appear in a non-primary slot when the user wants a launcher or status surface beside active work

Important rule:
- `Home Page` must prove that zero-model-viewport workspace state is valid
- it must not merely disguise the old protected-primary-viewer rule behind a decorative screen

### What Home Page Should Own

`Home Page` should own:
- start and resume actions such as opening the workspace, creating a new graph, opening a recent direction, or returning to the last saved layout
- calm explanation of the current app state when there is no active `Model Viewport`
- explicit launch links into real workspace surfaces such as `Model Viewport`, `Browser`, `Catalog`, and later other supported surfaces
- one lightweight orientation area with small links such as GitHub and docs plus a brief version and what's-new read
- user-facing storage transparency for ParaHook-owned browser persistence
- high-signal health summaries such as:
  - current saved workspace-layout presence
  - whether `Notepad` or `Dashboard` persistence currently exists
  - approximate ParaHook-owned persisted byte counts
  - approximate broader browser origin storage usage when the platform exposes it

The first useful storage read should separate:
- ParaHook-owned persisted data
- broader browser-managed origin storage

That distinction matters because:
- ParaHook-owned `localStorage` growth may reflect real app persistence growth
- browser-managed cache growth may be normal browser behavior rather than a ParaHook leak

### What Home Page Must Not Own

`Home Page` must not own:
- project-content hierarchy
- graph-document truth
- loaded reference truth
- viewer-local presentation state
- Browser row semantics
- import intake ownership
- catalog item ownership after commit
- a hidden app settings catch-all

Important rule:
- if the user commits geometry, references, imports, or project organization, that truth must still belong to the real downstream owners
- `Home Page` may link to those owners, summarize them, or help the user re-enter them, but it should not absorb them
- `Home Page` may include one lightweight "what's new" orientation read, but it should not become the full long-form changelog, docs owner, or release-notes system

### Entry And Return Rules

The intended entry rules are:
- fresh launch should open on `Home Page` by default
- the user may opt into one startup preference that opens directly into `Model Viewport` instead of `Home Page`
- a user who declines or clears a saved workspace restore may land on `Home Page`
- closing the last `Model Viewport` may return the root slot to `Home Page`

The intended return rule is:
- when there are zero open `Model Viewport` surfaces, `Home Page` becomes the honest landing surface instead of forcing one protected viewer to remain open

That does not mean:
- `Home Page` becomes a second-class replacement for the viewer
- the user is blocked from reopening one or more `Model Viewport` surfaces immediately

The healthy experience is:
- the viewer is present when the user wants geometry inspection
- `Home Page` is present when the user wants launch, resume, and workspace-health orientation

### Startup Preference Direction

`Home Page` should be the default first surface on startup.

But the user may choose one explicit startup preference that skips `Home Page` and opens directly into `Model Viewport`.

That preference should be read as:
- `show Home Page first on startup`
  - on by default
- or equivalent wording that clearly describes startup behavior instead of sounding like the surface is being deleted

Important rule:
- this is a startup preference, not a second shell mode
- turning it off should not remove `Home Page` from the workspace model
- turning it off should not block the user from opening `Home Page` later
- turning it off should not prevent `Home Page` from remaining the honest zero-viewer landing surface when the last `Model Viewport` closes

The clean behavior read is:
- preference on
  - app launch opens `Home Page`
- preference off
  - app launch opens `Model Viewport`
- in both cases
  - `Home Page` still exists as a real workspace surface
  - `Home Page` can still be opened manually
  - zero open `Model Viewport` surfaces can still return to `Home Page`

### Storage Transparency Direction

`Home Page` should expose a clear storage read because ParaHook already persists some browser state and the user should not have to guess whether that state is growing abnormally.

The first explicit read should likely include:
- each ParaHook-owned persisted browser-storage bucket by key
- approximate byte size per bucket
- one total ParaHook-owned persisted-data size
- one broader origin-storage estimate when supported by the browser
- every ParaHook-owned persistence bucket the app currently writes, not only the newest or most visible one

Important rule:
- if ParaHook stores user-owned data on the machine or in the browser profile, `Home Page` should surface that bucket and expose truthful user control over it
- do not leave older or quieter persistence paths hidden while only the latest storage feature gets visibility

The wording should stay careful:
- ParaHook-owned persisted data is app-owned
- broader browser origin storage includes browser-managed cache or other storage that may not be a ParaHook bug by itself

Important rule:
- do not call every increase a leak
- do call out sustained unexpected growth in ParaHook-owned persisted buckets when that growth does not match user actions

Later helpful actions may include:
- open the owning feature from a storage bucket row
- clear one specific ParaHook-owned persistence bucket with explicit confirmation
- reset all ParaHook-owned browser persistence with explicit confirmation

Important rule:
- `Home Page` should make storage truth visible
- it should not silently clear user data or present destructive reset as a casual one-click default

### Healthy Feel

When `Home Page` is healthy, it should feel like:
- a calm launchpad
- a resume-and-status surface
- a trustworthy workspace-health summary
- a clean zero-model-viewport state

It should feel less like:
- a marketing splash page
- a second Browser
- a debugging junk drawer
- a fake viewer screen that exists only to hide a protected primary-viewport rule

### What Must Stay True

- `Home Page` is a real workspace surface inside the hybrid workspace model.
- `Home Page` is the default first startup surface unless the user explicitly chooses the startup preference that opens directly into `Model Viewport`.
- Zero open `Model Viewport` surfaces is a valid workspace state.
- `Home Page` is the honest return target for that zero-viewer state.
- Skipping `Home Page` on startup does not disable `Home Page` as a workspace surface.
- `Home Page` may summarize storage and workspace state, but it does not become the owner of project, graph, import, catalog, or viewer truth.
- Storage transparency must distinguish ParaHook-owned persisted data from broader browser-managed storage.
- `Home Page` should reduce confusion and support orientation without reopening hidden singleton assumptions elsewhere in the shell.
