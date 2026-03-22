# AppShell Index

## Doc Header

### Doc History
1. 2026-03-21 18:24: Created this architecture index as the canonical planning surface for `AppShell`, capturing the real current-state responsibilities, the cleaner target vision, and the phased extraction path needed before separate AppShell phase docs exist

### Purpose

This doc defines the current architectural read of `AppShell` and the target shape it should grow toward.

Use it to answer:
- what `AppShell` owns right now
- which responsibilities are legitimate shell concerns versus leaked feature logic
- what the cleaner target shell should look like
- which extraction phases should happen before `AppShell` gets its own separate phase-doc family

### Why This Doc Exists

`src/app/AppShell.tsx` is now doing real work for several major systems at once:
- top-level workspace composition
- floating and split `Spaghetti` window behavior
- browser docking and pop-out behavior
- console placement and surface activation
- radio runtime hosting
- sampler scheduling

Some of that is correct shell ownership.

Some of it is feature logic that happened to land in the shell because it needed one app-level host.

This doc exists so `AppShell` can stop being described only as "the big file" and instead get a real architectural read:
- current state
- target state
- phased cleanup path

### Scope

This doc covers:
- the current `AppShell` responsibilities
- the target shell architecture
- extraction boundaries
- a phased cleanup order

This doc does not yet cover:
- implementation-ready phase checklists
- exact hook/component filenames for every extraction
- low-level pointer-event refactors
- CSS cleanup details

## Doc Body

### Short Version

Right now `AppShell` is both:
- the real workspace composition root
- a spillover host for multiple feature runtimes and window-management systems

That is why it feels larger than a normal shell.

The target direction should keep `AppShell` as:
- the top-level composition root
- the place that mounts major surfaces
- the place that coordinates high-level workspace selection

But it should stop being the place that directly owns large amounts of feature-specific runtime behavior.

### Current State

`AppShell` currently lives at `src/app/AppShell.tsx` and is the live host for:
- viewer / viewport composition
- spaghetti editor window rendering
- browser dock and browser floating window behavior
- left-dock sizing and split behavior
- workspace split menus and active-surface coordination
- console placement
- radio runtime bridge logic
- SoundCloud iframe host mounting
- sampler preview and sequencer scheduling

In practice this means one file is mixing three different responsibility classes:

- shell composition
  - mounting the main surfaces
  - deciding where major panes live
  - exposing the active workspace shell

- window-manager behavior
  - floating drag
  - resize
  - dock previews
  - split resizing
  - surface activation

- feature runtime hosting
  - radio burst handling
  - radio seek/reload handling
  - waveform state refresh
  - transport polling
  - sampler loop scheduling

### Current Legitimate Shell Ownership

These are reasonable things for `AppShell` to keep owning:
- top-level composition of the app
- mounting the main viewer, browser, console, and editor surfaces
- choosing which high-level surfaces are visible
- coordinating workspace-wide active-surface state
- hosting shell-wide overlays and menus

These are shell concerns because they define the workspace frame itself rather than one feature's inner behavior.

### Current Leakage

These are the main responsibilities that read more like leaked feature logic than true shell ownership:
- radio playback runtime orchestration
- SoundCloud widget bridge lifecycle
- radio transport polling
- waveform-capability refresh logic
- sampler step-preview trigger handling
- sampler loop scheduling and repeat timers
- large amounts of editor-window drag and resize mechanics living inline beside unrelated shell concerns

The problem is not only file length.

The deeper problem is that the shell is serving as:
- layout root
- runtime host
- window manager
- feature scheduler

That makes change boundaries blurry and increases the chance that unrelated edits collide inside the same file.

### Current Architectural Read

The current shell is functional, but it is overloaded.

The most honest current read is:
- `AppShell` is the composition root
- `AppShell` is also acting like a temporary application host layer
- several systems still depend on it as the easiest place to mount app-level effects

That is acceptable as an intermediate state.

It is not the right long-term shape if:
- `Radio` keeps growing
- `Audio Patchbay` appears
- browser/split/floating behavior keeps expanding
- more surfaces need app-level coordination

### Target Vision

The target `AppShell` should feel like a thin workspace compositor with a few mounted host seams.

Target shape:
- `AppShell`
  - owns top-level layout and composition
  - mounts major surfaces and shell overlays
  - coordinates workspace-level active-surface selection
  - mounts narrow host components for app-level systems

- mounted host seams
  - `RadioRuntimeHost`
  - later `AudioPatchbayHost` if needed
  - `BrowserDockHost`
  - `SpaghettiWindowHost`
  - `WorkspaceSplitHost`

Important rule:
- `AppShell` may mount these seams
- `AppShell` should not absorb their inner state transitions and feature logic directly

### Target AppShell Responsibilities

In the target state, `AppShell` should mainly answer:
- what major surfaces exist
- where they render
- which surface is active
- which shell overlays and menus are mounted

It should not directly answer:
- how radio burst playback is sequenced
- how sampler timers are managed
- how SoundCloud reload/seek lifecycle works
- how every floating-window pointer interaction is implemented

### Target Structural Rules

- Keep `AppShell` as the composition root, not the god object.
- Prefer mounted host components or custom hooks for feature runtimes that need app-level mounting.
- Keep shell-wide workspace state separate from feature-local runtime state.
- Keep editor window-management mechanics grouped behind one dedicated shell subsystem instead of scattering them across the top-level shell body.
- Keep feature-specific refs, timers, and transport polling out of the main shell body whenever the behavior can live in a mounted host seam.

### First Extraction Candidates

The highest-value first candidates are:

- `Radio runtime host`
  - move burst handling
  - move seek handling
  - move reload handling
  - move transport polling
  - move waveform refresh
  - move sampler preview and loop timing
  - keep only one mounted runtime host seam in `AppShell`

- `Spaghetti window shell host`
  - group floating-window shell behavior
  - group split-view shell behavior
  - group titlebar/window action handling

- `Browser dock host`
  - group browser dock/floating state
  - group browser drag, resize, and dock intent handling

### Risks To Avoid

- Do not turn this into a giant rewrite of `AppShell`.
- Do not mix shell cleanup with unrelated visual redesign work.
- Do not extract everything at once.
- Do not hide real ownership problems behind generic utility files with unclear purpose.
- Do not move feature logic into the wrong store just to make `AppShell.tsx` shorter.

The goal is not a smaller file at any cost.

The goal is clearer ownership.

### Phase Index

## [ ] Phase 1 - Audit And Name The Real AppShell Seams

Lock the current responsibility map without changing behavior yet.

Outputs:
- one stable list of what `AppShell` currently owns
- one stable list of what should stay in the shell
- one stable list of what should move behind mounted host seams

## [ ] Phase 2 - Extract Radio Runtime Hosting

Move radio runtime behavior out of the top-level shell body into one narrow mounted host seam.

Scope:
- burst handling
- seek handling
- reload handling
- waveform state updates
- transport polling
- sampler preview triggers
- sampler playback scheduling
- hidden SoundCloud bridge hosting if it still belongs to the radio runtime path

Target result:
- `AppShell` mounts the radio runtime seam
- `AppShell` no longer directly contains the radio runtime orchestration logic

## [ ] Phase 3 - Extract Browser Dock And Floating Controller

Move browser-specific floating/docking state and pointer behavior behind a dedicated browser shell host.

Target result:
- browser docking behavior is still shell-level
- browser inner control logic stops cluttering the main shell component

## [ ] Phase 4 - Extract Spaghetti Window Shell Controller

Group the floating editor window, split layout, titlebar actions, and related pointer mechanics behind a dedicated shell controller seam.

Target result:
- `AppShell` still decides where the editor surface mounts
- editor window-management logic stops living inline beside unrelated feature runtime code

## [ ] Phase 5 - Normalize Workspace Menus And Activation

Tighten shell-wide menu hosting and active-surface coordination after the larger extractions land.

Focus:
- workspace split menu
- left-dock resize menu
- active-surface sync
- shell-wide close-on-outside-click effects

## [ ] Phase 6 - Shrink AppShell To A True Composition Root

Do the final pass that leaves `AppShell` as:
- layout root
- surface composition root
- shell overlay host
- mounted seam host

This is the point where `AppShell` should read as architecture instead of accumulation.

### Success Read

This cleanup succeeds when:
- `AppShell` is still clearly the app composition root
- feature runtime logic is no longer mixed directly into the shell body
- shell-level window-management code is grouped into explicit seams
- new systems such as `Audio Patchbay` have an obvious place to mount without bloating the shell again

### Related Files

- `src/app/AppShell.tsx`
- `docs/Human-Plans/Architecture/Workspace-Modes.md`
- `docs/Human-Plans/Architecture/Radio/Radio.md`
- `docs/Human-Plans/Architecture/Audio-Patchbay.md`
