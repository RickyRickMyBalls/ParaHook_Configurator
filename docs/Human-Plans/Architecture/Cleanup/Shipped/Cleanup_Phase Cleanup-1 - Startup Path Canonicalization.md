# Cleanup Phase Cleanup-1 - Startup Path Canonicalization

## Doc Header

### Doc History
3. 2026-04-12 19:55: Tightened the startup residue scope against the live reference scan, then completed `Cleanup 1` by retiring `src/App.tsx`, `src/App.css`, and `src/assets/react.svg`, preserving `public/vite.svg` because `index.html` still uses it as the favicon, and confirming the real startup path still builds through `src/main.tsx`
2. 2026-04-12 13:47: Tightened `Phase 1 - Lock Startup Ownership Narrative` into an implementation-ready doc-first pass after a fresh startup-path reread confirmed the live runtime seam is still `src/main.tsx` -> `src/app/main.tsx` -> `AppShell`, `bootstrapBuildWiring()` remains startup glue with a one-time `wired` guard, and the only repo hits for `src/App.tsx` outside docs are the starter file itself
1. 2026-04-12 13:01: Created this standalone `Cleanup 1` future phase doc after a live startup-path read of `src/main.tsx`, `src/app/main.tsx`, `src/app/bootstrapBuildWiring.ts`, and `src/App.tsx` confirmed that `src/main.tsx` is the real runtime entry path, `bootstrapBuildWiring()` is startup glue rather than a second entry owner, and `src/App.tsx` plus its Vite assets are unreferenced starter residue

### Purpose

This doc defines the first implementation-ready cleanup phase for the `Cleanup` family.

Use it to answer:
- what "startup path canonicalization" means in ParaHook
- which startup files are real owners versus supporting seams
- what should happen to `src/App.tsx` and related starter residue
- what implementation order should be used for the startup cleanup
- what verification should pass before this cleanup is considered done

Do not use it for:
- the broad cleanup vision for the whole repo
- general canonical-ownership planning outside the startup path
- redesigning app runtime behavior
- large unrelated app-shell or worker refactors

### Relationship To Other Docs

- `../Cleanup-Index.md`
  - family scan surface
  - cleanup phase ladder

- `../Cleanup-Vision.md`
  - broad cleanup north star
  - residue-retirement guidance

- `../Canonical-Ownership-Targets.md`
  - startup ownership target
  - rule that `src/main.tsx` should be the one canonical startup owner

## Doc Body

## [x] Cleanup 1 - Startup Path Canonicalization

### Header

Purpose:
- make the app startup story honest by keeping one clear runtime entry path and retiring the fake second startup path left over from the default Vite scaffold

Canonical target:
- `src/main.tsx`
  - runtime entry path
  - React boot
  - startup-time wiring call
- `src/app/main.tsx`
  - root app composition only
- `src/app/bootstrapBuildWiring.ts`
  - startup glue for dispatcher or store wiring
  - not a second startup owner
- `src/App.tsx`
  - starter residue to retire if the reference scan still shows it is unused

### Why This Phase Exists

Cleanup now has one small but important first target:
- the codebase should have one honest startup path

Right now the live read is already pointing in the right direction:
- `src/main.tsx` imports `AppMain` from `src/app/main.tsx`
- `src/main.tsx` calls `bootstrapBuildWiring()`
- `src/main.tsx` creates the React root and renders the app

But the repo still contains `src/App.tsx`, which is plain starter boilerplate and still looks like a possible app entry path if someone scans the source tree quickly.

That creates false architecture.

This phase exists to:
- lock the startup ownership narrative
- retire the fake second entry story
- leave later cleanup phases with a cleaner app root

### Scope

This phase covers:
- startup-path ownership around `src/main.tsx`
- root app composition naming and boundaries around `src/app/main.tsx`
- the startup-time role of `bootstrapBuildWiring()`
- retiring `src/App.tsx` if it is still unused
- retiring starter-only assets that become unused after `src/App.tsx` is removed
- small doc updates needed so the cleanup story stays honest

This phase does not cover:
- changing runtime behavior of `AppShell`
- redesigning store bootstrap semantics
- worker protocol cleanup
- broader asset cleanup outside startup residue
- feature work hidden inside a cleanup phase

### Live Startup Read

Current live read from the codebase:

- `src/main.tsx`
  - imports `./index.css`
  - imports `AppMain` from `./app/main.tsx`
  - imports `bootstrapBuildWiring` from `./app/bootstrapBuildWiring`
  - calls `bootstrapBuildWiring()`
  - creates the React root and renders `<AppMain />` inside `StrictMode`

- `src/app/main.tsx`
  - currently acts as a tiny root composition seam
  - returns `<AppShell />`

- `src/app/bootstrapBuildWiring.ts`
  - is guarded by a module-local `wired` flag
  - wires dispatcher callbacks and runtime subscriptions into app stores
  - kicks the first `requestSpaghettiBuild()`
  - should stay startup glue rather than becoming a second entry owner

- `src/App.tsx`
  - is default Vite starter content
  - is not imported by the real startup path
  - should not remain as fake app-entry residue

Reference scan read:
- there are no live runtime references to `src/App.tsx`
- `src/App.css` and `src/assets/react.svg` are only referenced by the starter file and should be retired with it
- `public/vite.svg` is still referenced by `index.html` as the favicon and should stay until a later icon cleanup deliberately replaces it

### Locked Direction

- keep `src/main.tsx` as the one canonical startup owner
- treat `src/app/main.tsx` as root composition, not as a competing entry path
- keep `bootstrapBuildWiring()` as startup glue, not as a second startup authority
- remove `src/App.tsx` once the repo scan confirms it is unused
- remove starter-only supporting files only if they become unreferenced after `src/App.tsx` is retired
- keep this phase behavior-preserving except for deleting dead startup residue

### Phase Ladder

## [x] Phase 1 - Lock Startup Ownership Narrative

### Header

Purpose:
- freeze the exact startup ownership story before files are deleted so later cleanup does not reintroduce a second fake entry path

Current read:
- the live runtime path is already `src/main.tsx` -> `src/app/main.tsx` -> `AppShell`
- `bootstrapBuildWiring()` is part of startup execution, but it is not the entry owner
- `src/App.tsx` is not part of the live runtime path

Current live Phase 1 seams:
- `src/main.tsx`
  - imports `./index.css`
  - imports `AppMain` from `./app/main.tsx`
  - imports `bootstrapBuildWiring` from `./app/bootstrapBuildWiring`
  - calls `bootstrapBuildWiring()` before `createRoot(...).render(...)`
- `src/app/main.tsx`
  - exports the small root composition seam that returns `<AppShell />`
- `src/app/bootstrapBuildWiring.ts`
  - exports `bootstrapBuildWiring()`
  - uses the module-local `wired` guard to keep startup glue one-time
  - wires dispatcher callbacks/runtime subscriptions into stores
  - kicks the initial `requestSpaghettiBuild()`
- startup reference scan
  - no live runtime import path points to `src/App.tsx`
  - the only non-doc runtime hit is the starter file referring to itself in its template text

Read:
- the current startup implementation is already honest in code
- the doc pass locked the startup-owner story before file deletion
- the live reference scan also narrowed the residue list by proving `public/vite.svg` is still a real favicon asset rather than dead starter residue

Locked Phase 1 in-scope:
- confirm the current startup chain and write it down in this phase doc and nearby family docs if needed
- confirm that no runtime import path still points to `src/App.tsx`
- confirm that `src/main.tsx` remains the canonical startup owner in docs
- confirm that `src/app/main.tsx` is described as root app composition rather than entry ownership
- tighten the startup cleanup wording so `Phase 2` can execute deletion without reopening the ownership argument

Locked Phase 1 out-of-scope:
- deleting files
- renaming startup files
- changing wiring behavior inside `bootstrapBuildWiring.ts`
- moving `AppShell` or store code
- editing source files unless a tiny wording clarification is truly necessary for ownership readability

Locked direction:
- keep `src/main.tsx` as the one startup owner
- keep `src/app/main.tsx` described as root composition only
- keep `bootstrapBuildWiring()` described as startup glue only
- treat `src/App.tsx` as residue to be retired in `Phase 2`, not in `Phase 1`

Strongest target docs for this pass:
- `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-1 - Startup Path Canonicalization.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`

Preferred Phase 1 implementation shape:
- keep this as a docs-and-verification pass
- only change wording where the startup story is still soft, ambiguous, or inconsistent
- do not delete `src/App.tsx` or related assets yet

Implementation spec:
1. Re-run the startup reference scan and keep the result in this phase doc:
   - `src/main.tsx` is the real entry path
   - `src/app/main.tsx` is root composition
   - `bootstrapBuildWiring.ts` is startup glue
   - `src/App.tsx` is not part of the runtime path
2. Re-read `Cleanup-Index.md`, `Canonical-Owner-Decisions.md`, and `Canonical-Ownership-Targets.md` and confirm they all tell the same startup ownership story.
3. Tighten any wording drift so the docs use the same owner/supporting-seam language.
4. Stop before file deletion and leave that work for `Phase 2`.

Implementation stop rule:
- `Phase 1` is done once the startup ownership narrative is explicit and consistent enough that `Phase 2` can delete residue without needing another architecture read
- if the live source files already read honestly, do not invent a code change just to make the phase feel larger

Checklist:
- [x] re-scan startup references before code changes
- [x] confirm no runtime path imports `src/App.tsx`
- [x] keep the startup-owner narrative aligned across cleanup docs
- [x] confirm `src/main.tsx`, `src/app/main.tsx`, and `bootstrapBuildWiring.ts` are described consistently as owner, composition seam, and startup glue
- [x] stop before deleting starter residue

Done shape:
- one explicit startup narrative exists before residue retirement begins
- later code deletion is anchored in a shared read instead of assumption
- `Phase 2` can execute as a straightforward residue-retirement pass instead of another ownership-discovery pass

Recommended file changes:
- edit `docs/Human-Plans/Architecture/Cleanup/Future/Cleanup_Phase Cleanup-1 - Startup Path Canonicalization.md`
- optionally edit:
  - `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Owner-Decisions.md`
  - `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
- avoid source-file edits in this phase unless a tiny ownership-readability clarification is clearly justified

Verification:
- run the focused startup reference scan for `src/App.tsx`
- manually re-read:
  - `src/main.tsx`
  - `src/app/main.tsx`
  - `src/app/bootstrapBuildWiring.ts`
- confirm the doc language now matches the live startup seam exactly

## [x] Phase 2 - Retire Fake Second Entry Residue

### Header

Purpose:
- remove the old starter files that still make the source tree look like the app has a second entry path

Locked Phase 2 in-scope:
- delete `src/App.tsx` if Phase 1 still confirms it is unused
- delete `src/App.css` if it is only used by `src/App.tsx`
- delete `src/assets/react.svg` if it is only used by `src/App.tsx`
- keep `public/vite.svg` because the live repo still uses it as the favicon through `index.html`
- re-run a focused reference scan after deletion to confirm nothing still points at those files

Locked Phase 2 out-of-scope:
- deleting unrelated empty or placeholder files elsewhere in the repo
- changing `index.css`
- changing `AppShell` or app layout behavior
- bundling unrelated residue cleanup into this startup phase

Execution rules:
- delete only files proven to be starter-only residue
- do not broaden this into a generic source-folder purge
- if any of the starter assets are unexpectedly reused elsewhere, keep them and narrow the deletion to the truly dead files

Checklist:
- [x] remove `src/App.tsx`
- [x] remove `src/App.css` if now unused
- [x] remove `src/assets/react.svg` if now unused
- [x] keep `public/vite.svg` because it is still live
- [x] re-scan for remaining references after the deletions

Done shape:
- the source tree no longer suggests a fake second app entry path
- starter-only assets are gone when they are truly dead

## [x] Phase 3 - Tighten Startup Boundary Readability

### Header

Purpose:
- leave the surviving startup files with a crisp responsibility split so future readers can tell entry, composition, and wiring apart quickly

Current concern:
- even after residue deletion, later readers still need one fast answer for:
  - where startup begins
  - where root composition begins
  - where dispatcher or store wiring begins

Locked Phase 3 in-scope:
- make small naming or comment-level clarifications only if the startup boundary still reads ambiguously after Phase 2
- confirm `src/main.tsx` is obviously the entry path
- confirm `src/app/main.tsx` reads as root app composition
- confirm `bootstrapBuildWiring.ts` reads as startup glue rather than entry ownership
- make the smallest code or doc clarifications that improve that read

Locked Phase 3 out-of-scope:
- large file moves
- bootstrapping redesign
- changing dispatcher semantics
- changing when the initial build request is issued

Preferred outcome:
- no code change if the live files already read honestly after Phase 2
- otherwise make the smallest possible clarification instead of inventing a broader startup architecture project

Checklist:
- [x] re-read `src/main.tsx`, `src/app/main.tsx`, and `src/app/bootstrapBuildWiring.ts`
- [x] decide whether a tiny naming or comment clarification is still needed
- [x] stop if the startup boundary already reads clearly

Done shape:
- entry path, root composition, and startup glue each have one obvious role
- no broader bootstrap rewrite was needed

## [x] Phase 4 - Verification And Cleanup Closeout

### Header

Purpose:
- prove that the startup cleanup removed only dead residue and did not damage the real app entry path

Verification target:
- the app still builds and starts from `src/main.tsx`
- no imports still point to retired startup residue
- docs still describe the same startup ownership story the code now follows

Verification checklist:
- [x] run a reference scan for `App.tsx`, `App.css`, `react.svg`, and `vite.svg`
- [x] run the project build or a focused TypeScript or Vite verification after file deletion
- [x] manually re-read `src/main.tsx` and confirm it is still the only honest startup path
- [x] update `Cleanup-Index.md` or shipped records when the phase is complete

Done shape:
- startup cleanup is verifiably complete
- no fake second startup story remains in source
- later cleanup phases can treat startup ownership as settled

### Recommended File Targets

Expected primary file targets for this phase:
- edit `src/main.tsx` only if a tiny readability clarification is needed
- edit `src/app/main.tsx` only if a tiny readability clarification is needed
- edit `src/app/bootstrapBuildWiring.ts` only if a tiny readability clarification is needed
- delete `src/App.tsx`
- delete `src/App.css` if unused
- delete `src/assets/react.svg` if unused
- keep `public/vite.svg` while it remains the live favicon
- this doc now lives in `../Shipped/` because the phase is complete

### Ladder Rules

- preserve runtime behavior
- delete dead startup residue before inventing new abstractions
- keep the startup owner in the smallest honest file: `src/main.tsx`
- avoid turning startup cleanup into a broad app-shell or dispatcher redesign
- keep any readability clarifications smaller than the residue retirement itself

### Success Read

This phase succeeds when:
- a new reader can find the real entry path immediately
- `src/App.tsx` no longer competes visually with the real startup path
- entry, root composition, and startup glue each read as separate responsibilities
- the repo keeps one honest startup story in both code and docs

### Related Files

- `src/main.tsx`
- `src/app/main.tsx`
- `src/app/bootstrapBuildWiring.ts`
- `src/App.tsx`
- `src/App.css`
- `src/assets/react.svg`
- `public/vite.svg`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Index.md`
- `docs/Human-Plans/Architecture/Cleanup/Cleanup-Vision.md`
- `docs/Human-Plans/Architecture/Cleanup/Canonical-Ownership-Targets.md`
