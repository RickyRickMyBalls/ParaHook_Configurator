# [x] `Home-Page-3` - `Lightweight Orientation And What Is New`

## Doc Header

### Doc History
3. 2026-04-19 16:46:49: Reconciled the top-level `Home-Page-3` checklist state after manager review, marking the family phase and its preserved HLG/CLG coverage complete now that `Phase 1` landed and verified.
2. 2026-04-19 16:44:29: Implemented the compact Home Page orientation strip with GitHub and docs links plus the brief version and what's-new read, then updated the phase checklist and history so `Home-Page-Gen1-HLG-14` and `Home-Page-Gen1-CLG-13` are complete.
1. 2026-04-19 16:40:48: Created the standalone `Home-Page-3` Family Phase Doc in the newer clean naming format, kept the scope to a small GitHub/docs/version/what's-new orientation slice, and prepared the first implementation-ready phase for Worker handoff without turning `Home Page` into a docs dashboard or changelog browser.

### Purpose

This doc is the implementation-planning surface for `Home-Page-3` in Home Page Generation 1.

Use it to:
- keep the orientation area deliberately small
- add a compact GitHub link, docs link, brief version read, and brief what's-new summary
- preserve the current Home Page boundary so longer docs, changelog, and release-note ownership stay outside `Home Page`

## Doc Body

### Why This Phase Exists

`Home-Page-3` exists because `Home Page` is already becoming a truthful startup and storage surface, and the next useful thing is a small orientation strip that helps the user know where they are without dragging the full docs system onto the page.

This phase should answer four quick questions:
- where is the project source
- where are the docs
- what version is this app build
- what is the brief "what's new" note

The user should not have to open a separate docs area just to get a tiny orientation read.

Important rule:
- keep this slice small enough to fit beside the existing launch and storage reads
- do not turn the surface into a release-notes page
- do not make `Home Page` the owner of long-form docs navigation or changelog browsing

### Current Live Read

The orientation content should live on the `Home Page` surface beside the existing launch and storage sections, not as a separate docs workspace.

The likely first edit points are:
- the `Home Page` surface component that already owns the visible workspace landing content
- the matching surface tests for the new compact orientation read
- whichever existing app metadata or shell-owned source already provides a version string and repo/document links

This phase should prefer existing signals over inventing a new release-notes system.

### Phase Boundary Rules

This family phase stays inside lightweight orientation and does not own:
- full docs navigation
- changelog authoring
- release-note system ownership
- project or Browser state
- graph truth
- storage transparency rows already handled by `Home-Page-2`

The phase should make the page feel better oriented, not more crowded.

## Vision

`Home-Page-3` should give the user one compact "what is this and where do I go next" read.

The healthy end state is:
- a small GitHub link
- a small docs link
- a brief version read
- a brief what's-new summary
- no broad docs dashboard or release-notes browser

This phase is intentionally narrow so the orientation area can exist without competing with the real docs system.

## Wishlist Organization

### High Level Goals

- [x] `Home-Page-Gen1-HLG-14. Home Page should include a small GitHub link, docs link, and a brief version and what's-new summary.`

### Codex Level Goals

- [x] `Home-Page-Gen1-CLG-13. Add small orientation links and version/what's-new summary without turning Home Page into the docs or release-notes owner.`

### `Home-Page-3 / Phase 1`

- [x] Add a compact orientation area with GitHub and docs links.
- [x] Show a brief version read in the same small area.
- [x] Show one brief what's-new summary in the same small area.
- [x] Keep the orientation read visually lighter than the storage section.
- [x] Keep longer docs, changelog, and release-note ownership outside `Home Page`.
- [x] `Home-Page-Gen1-HLG-14`
- [x] `Home-Page-Gen1-CLG-13`

## [x] `Home-Page-3 / Phase 1` - `Compact Orientation Strip And Brief What's New`

### Phase 1 Summary

Add one small orientation strip to `Home Page` that gives the user a GitHub link, a docs link, a brief version read, and a short what's-new summary.

This phase should stay small enough to sit beside the existing launch and storage surfaces without turning the page into a docs dashboard.

### Phase 1 Implementation Spec

#### Purpose

Add a compact orientation area to `Home Page` that helps the user orient themselves without claiming ownership of docs browsing, changelog browsing, or release-note generation.

#### Owns

- a small GitHub link on `Home Page`
- a small docs link on `Home Page`
- a brief version read on `Home Page`
- a brief what's-new summary on `Home Page`
- focused tests for the compact orientation read

#### Does Not Own

- full docs navigation
- changelog authoring
- release-note browsing
- release-note generation
- project content
- Browser state
- storage transparency rows
- any broad dashboard-like docs surface

#### Current Live Read

- `Home Page` already has a launch and storage presence that can host one more small orientation block
- the version and summary should come from an existing narrow app or shell-owned source if one already exists
- if no narrow source exists yet, keep the phase honest and visibly small rather than creating a new documentation system

#### First Pass Decisions

1. Keep the orientation block compact and visually secondary to the primary landing content.
2. Use existing links and metadata sources instead of inventing a docs browser or release-note owner.
3. Keep the what's-new copy brief and bounded.
4. Do not add a full changelog list, docs tree, or release feed.
5. Keep the phase small enough that the next worker can land it without reopening the other Home Page families.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/HomePageSurface.test.tsx`
- whichever existing app metadata or shell source already provides the version string and canonical links

#### No-Widening Rule

- do not add full docs navigation
- do not add changelog browsing
- do not turn the area into release-note ownership
- do not pull Browser or project content into the surface
- do not widen the phase into storage or startup behavior

#### Verification Shape

- focused Home Page surface tests for the new compact orientation content
- a quick build or local verification pass once the implementation lands

#### Done Shape

- Home Page shows a small GitHub link
- Home Page shows a small docs link
- Home Page shows a brief version read
- Home Page shows a brief what's-new summary
- the surface still feels like a Home Page, not a docs dashboard

### Phase 1 Closeout

- [x] `Home-Page-3 / Phase 1 - Compact Orientation Strip And Brief What's New`
- [x] `Home-Page-Gen1-HLG-14`
- [x] `Home-Page-Gen1-CLG-13`
