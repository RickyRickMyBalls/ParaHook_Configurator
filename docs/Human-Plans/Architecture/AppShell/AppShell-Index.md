# AppShell Index

## Doc Header

### Doc History
5. 2026-03-22 14:12: Marked `[5.0F-2]` complete after shipping `BrowserDockHost`, `SpaghettiWindowHost`, and `useAppShellDockController`, closed the parent `[5.0F]` family, and updated this index to point at the moved shipped phase record instead of the earlier future plan
4. 2026-03-22 13:28: Refreshed this index after the shipped `5.0F-1` runtime-host extraction, removed stale radio-runtime leakage language, and linked the new standalone `5.0F-2` future phase doc so the remaining browser/editor shell-controller work now has an implementation-ready planning surface
3. 2026-03-22 13:10: Marked `[5.0F-1]` complete after shipping the new `RadioRuntimeHost` seam, updated the family index to point at the moved shipped phase record, and left `[5.0F]` open only for the later browser/editor shell-controller extraction
2. 2026-03-22 12:40: Refreshed this architecture index after a second live code read, aligned the AppShell family to roadmap `[5.0F]` / `[5.0F-1]` / `[5.0F-2]`, captured the concrete runtime-versus-shell seams in `src/app/AppShell.tsx`, and linked the new standalone `5.0F-1` future phase doc
1. 2026-03-21 18:24: Created this architecture index as the canonical planning surface for `AppShell`, capturing the real current-state responsibilities, the cleaner target vision, and the phased extraction path needed before separate AppShell phase docs exist

### Purpose

This doc defines the current architectural read of `AppShell` and the target shape it should grow toward.

This file is the umbrella index for the `AppShell` family.

Use it to answer:
- what `AppShell` owns right now
- which responsibilities are legitimate shell concerns versus leaked feature logic
- what the cleaner target shell should look like
- how the `[5.0F]` roadmap family is sequenced
- where the standalone AppShell `Future/` and `Shipped/` docs live

### Family Structure

Use this folder like this:

- `AppShell-Index.md`
  - umbrella architecture direction
  - live ownership read
  - roadmap-family summary
- `Future/`
  - standalone implementation-ready AppShell phase docs
- `Shipped/`
  - later shipped records for completed AppShell cuts if the family grows enough to justify them

Current roadmap home:
- `[5.0F]` AppShell Cleanup And Host Seam Extraction
- `[5.0F-1]` AppShell Runtime Host Extraction
- `[5.0F-2]` AppShell Window And Dock Host Extraction

### Why This Doc Exists

`src/app/AppShell.tsx` is now doing real work for several major systems at once:
- top-level workspace composition
- floating and split `Spaghetti` window behavior
- browser docking and pop-out behavior
- console placement and surface activation
- shell-wide dock and split menu coordination

Some of that is correct shell ownership.

Some of it is feature logic that happened to land in the shell because it needed one app-level host.

After shipped `[5.0F-1]`, the runtime-host seam is no longer the biggest problem.

The remaining overload is now the browser/editor window and dock controller layer that still lives inline in `AppShell.tsx`.

This doc exists so `AppShell` can stop being described only as "the big file" and instead get a durable architecture read:
- current state
- live seam read
- target state
- roadmap-aligned cleanup path

### Scope

This doc covers:
- the current `AppShell` responsibilities
- the live seam read from `src/app/AppShell.tsx`
- the target shell architecture
- extraction boundaries
- the roadmap-aligned AppShell family index

This doc does not try to hold:
- every implementation-ready checklist for each AppShell subphase
- the full `[5.1]` workspace host design
- low-level pointer-math details beyond what is needed to name real seams
- theme or CSS cleanup details

Standalone execution details belong in `Future/` docs when the family needs them.

## Doc Body

### Short Version

Right now `AppShell` is both:
- the real workspace composition root
- a spillover host for the remaining browser/editor window-management systems

That is why it feels larger than a normal shell.

The target direction should keep `AppShell` as:
- the top-level composition root
- the place that mounts major surfaces
- the place that coordinates high-level workspace selection

But it should stop being the place that directly owns large amounts of feature-specific runtime behavior and inline window-controller logic.
After `[5.0F-1]`, the remaining problem is mostly the inline window-controller logic.

### Current State

`AppShell` currently lives at `src/app/AppShell.tsx` and is the live host for:
- viewer / viewport composition
- spaghetti editor window rendering
- browser dock and browser floating window behavior
- left-dock sizing and split behavior
- workspace split menus and active-surface coordination
- console placement
- `RadioPanel` visibility
- mounted `RadioRuntimeHost`

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

- mounted host seams
  - `RadioRuntimeHost`
  - `BrowserDockHost`
  - `SpaghettiWindowHost`
  - shared `useAppShellDockController`

### Live Code Read

The direct code read after shipped `[5.0F-2]` confirms the intended seam map is now real:

- `AppShell` is still the correct composition root
  - the main render tree starts near the bottom of `src/app/AppShell.tsx`
  - it mounts `ViewerHost`, `ViewportOverlay`, `ConsoleDock`, `RadioPanel`, `RadioRuntimeHost`, `BrowserDockHost`, and `SpaghettiWindowHost`

- the runtime-host leakage is materially reduced
  - `AppShell` now mounts `RadioRuntimeHost` instead of directly owning the radio/sampler runtime effect cluster
  - audio-engine, SoundCloud bridge, request-tracking refs, and sampler timers are no longer defined inline in the shell body

- the browser/editor shell-controller leakage is materially reduced
  - browser floating state, clamp helpers, drag/dock-intent handlers, and docked/floating browser rendering now live in `BrowserDockHost`
  - spaghetti floating, split, meatball, titlebar, and per-viewport window UI logic now live in `SpaghettiWindowHost`
  - shared left-dock resize/menu controller behavior now lives in `useAppShellDockController`
  - `AppShell` retains only the shared left-dock truth, split-menu actions, active-surface coordination, and shell layout composition

That leaves the AppShell family in the intended post-bridge state:
- keep the shipped `RadioRuntimeHost` seam as-is
- keep the shipped browser/editor host seams in place
- let `[5.1] Workspace Modes` build on these cleaner ownership boundaries instead of the earlier inline shell controller

### Current Legitimate Shell Ownership

These are reasonable things for `AppShell` to keep owning:
- top-level composition of the app
- mounting the main viewer, browser, console, and editor surfaces
- choosing which high-level surfaces are visible
- coordinating workspace-wide active-surface state
- hosting shell-wide overlays and menus
- mounting narrow app-level host seams such as `RadioRuntimeHost`

These are shell concerns because they define the workspace frame itself rather than one feature's inner behavior.

### Current Leakage

These are the main responsibilities that still read more like leaked controller logic than true shell ownership:
- browser floating and dock-intent pointer behavior living inline beside unrelated shell concerns
- left-dock resize and dock-preview controller logic living inline beside render composition
- split resize and workspace split-menu controller logic living inline beside unrelated shell concerns
- large amounts of editor-window drag and resize mechanics living inline beside unrelated shell concerns
- spaghetti floating/split/meatball shell render logic and window UI maps living inline in the shell body
- the inline `SpaghettiWindowTitleBar` still coupling titlebar behavior to the top-level shell file

The problem is not only file length.

The deeper problem is that the shell is serving as:
- layout root
- window manager
- menu coordinator

That makes change boundaries blurry and increases the chance that unrelated edits collide inside the same file.

### Current Architectural Read

The current shell is functional, but it is overloaded.

The most honest current read is:
- `AppShell` is the composition root
- `AppShell` now mounts one extracted runtime host seam
- `AppShell` is still acting like the inline window and dock controller for browser and spaghetti shell behavior

That is acceptable as an intermediate state.

It is not the right long-term shape if:
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
  - later `WorkspaceMenuHost` if the remaining menu logic still deserves a dedicated seam

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
- how every floating-window pointer interaction is implemented
- how every browser dock/floating transition is implemented
- how every spaghetti split/floating/meatball transition is implemented

### Target Structural Rules

- Keep `AppShell` as the composition root, not the god object.
- Prefer mounted host components or custom hooks for feature runtimes that need app-level mounting.
- Keep shell-wide workspace state separate from feature-local runtime state.
- Keep editor window-management mechanics grouped behind one dedicated shell subsystem instead of scattering them across the top-level shell body.
- Keep feature-specific refs, timers, and transport polling out of the main shell body whenever the behavior can live in a mounted host seam.

### Remaining Extraction Candidates

The highest-value remaining candidates are:

- `BrowserDockHost`
  - group browser dock/floating state
  - group browser drag, clamp, popout, and dock intent handling
  - remove the docked/floating browser render/controller clutter from the top-level shell body

- `SpaghettiWindowHost`
  - group floating-window shell behavior
  - group split-view shell behavior
  - group meatball dock shell behavior
  - group titlebar/window action handling
  - move the inline `SpaghettiWindowTitleBar` out of `AppShell.tsx`

- later `WorkspaceMenuHost` only if the remaining left-dock resize and workspace split overlays still deserve their own mounted seam after `[5.0F-2]`

### Risks To Avoid

- Do not turn this into a giant rewrite of `AppShell`.
- Do not mix shell cleanup with unrelated visual redesign work.
- Do not extract everything at once.
- Do not hide real ownership problems behind generic utility files with unclear purpose.
- Do not move feature logic into the wrong store just to make `AppShell.tsx` shorter.
- Do not absorb the full `[5.1]` workspace model into this bridge family.

The goal is not a smaller file at any cost.

The goal is clearer ownership.

### Roadmap Family Index

## [x] `[5.0F]` - `AppShell Cleanup And Host Seam Extraction`

This bridge family exists to reduce `AppShell` overload before `[5.1] Workspace Modes` asks the same area to become a broader workspace host.

Family focus:
- keep `AppShell` as the app composition root
- separate feature runtime hosting from shell composition
- separate browser/editor shell-control mechanics from the top-level shell body
- keep the cleanup preparatory rather than turning it into the final workspace architecture

## [x] `[5.0F-1]` - `AppShell Runtime Host Extraction`

This is the first real cut.

Reason:
- the radio/sampler runtime cluster is the clearest example of feature logic living directly in `AppShell`
- it has the tightest internal coupling and the weakest reason to stay in the shell body
- it can shrink the file meaningfully without forcing immediate browser or window-controller redesign

Standalone phase doc:
- `Shipped/AppShell_Phase 5.0F-1 - AppShell Runtime Host Extraction.md`

Target result:
- `AppShell` mounts one runtime host seam
- `AppShell` no longer directly owns the radio/sampler runtime transitions
- the hidden SoundCloud bridge no longer lives directly in the shell body

## [x] `[5.0F-2]` - `AppShell Window And Dock Host Extraction`

This is the shipped second bridge cut after the runtime host landed.

Focus:
- browser dock and browser floating controller logic
- spaghetti floating/split/titlebar shell controller logic
- left-dock resize, split resize, dock preview, and related shell pointer behavior

Standalone phase doc:
- `Shipped/AppShell_Phase 5.0F-2 - AppShell Window And Dock Host Extraction.md`

Shipped result:
- `AppShell` still decides where the surfaces mount
- browser and editor shell mechanics no longer live inline beside unrelated shell composition code
- `BrowserDockHost`, `SpaghettiWindowHost`, and `useAppShellDockController` now hold the extracted controller seams
- the file now reads much closer to a real workspace compositor ahead of `[5.1]`

This phase landed without needing more roadmap IDs.

### Success Read

This cleanup succeeds when:
- `AppShell` is still clearly the app composition root
- the shipped runtime host seam stays mounted instead of being pulled back into `AppShell`
- shell-level window-management code is grouped into explicit seams
- new systems such as `Audio Patchbay` have an obvious place to mount without bloating the shell again

### Related Files

- `src/app/AppShell.tsx`
- `src/app/hosts/RadioRuntimeHost.tsx`
- `src/app/hosts/BrowserDockHost.tsx`
- `src/app/hosts/SpaghettiWindowHost.tsx`
- `src/app/hosts/useAppShellDockController.ts`
- `docs/Human-Plans/Architecture/AppShell/Shipped/AppShell_Phase 5.0F-2 - AppShell Window And Dock Host Extraction.md`
- `docs/Human-Plans/Architecture/AppShell/Shipped/AppShell_Phase 5.0F-1 - AppShell Runtime Host Extraction.md`
- `docs/Human-Plans/Architecture/Workspace-Modes/Workspace-Modes-Index.md`
- `docs/Human-Plans/Architecture/Radio.md`
- `docs/Human-Plans/Architecture/Audio-Patchbay.md`
