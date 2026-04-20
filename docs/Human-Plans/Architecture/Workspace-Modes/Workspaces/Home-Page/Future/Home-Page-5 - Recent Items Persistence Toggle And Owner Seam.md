# [x] `Home-Page-5` - `Recent Items Persistence Toggle And Owner Seam`

## Doc Header

### Doc History
4. 2026-04-19 18:48:35: Recorded the `Home-Page-5 / Phase 2 - Home Page Recent-Items Inventory And Toggle Wiring` closeout after Home Page surfaced the recent-items browser-storage bucket, wired remember/forget through `recentItemsPersistence.ts`, focused tests passed, and the build gate passed.
3. 2026-04-19 18:38:18: Prepared `Home-Page-5 / Phase 2 - Home Page Recent-Items Inventory And Toggle Wiring` so the next slice can wire Home Page inventory and remember/forget controls through the new recent-items owner seam without moving recent-items semantics into Home Page.
2. 2026-04-19 18:34:08: Recorded the `Home-Page-5 / Phase 1 - Create Recent-Items Owner Seam Before Home Page Toggle Wiring` closeout after the recent-items persistence owner, browser-storage bucket descriptor, explicit recent/resume snapshot semantics, focused owner-seam tests, and build gate landed while Home Page toggle wiring stayed deferred.
1. 2026-04-19 18:01:15: Created the standalone `Home-Page-5` Family Phase Doc so the remaining recent-items HLG and CLG now route into an owner-seam creation phase instead of vague Home Page wiring.

### Purpose

This file is the implementation-planning surface for `Home-Page-5` in Home Page Generation 1.

Use it to:
- create the missing recent-items owner seam before any Home Page toggle wiring
- define the recent working-set semantics and browser-storage bucket
- keep recent-items truth outside Home Page until the owner exists
- wire Home Page inventory and remember/forget controls only after the owner seam exists

## Doc Body

### Why This Phase Exists

`Home-Page-5` exists because the Home Page goal for recent-items is real, but the owner seam does not exist yet.

The Explorer read confirmed:
- no live recent-items owner seam exists under another name
- runtime inspector recent labels are not a persistence owner
- Home Page should not wire a toggle before the storage owner exists

So the first honest step is to create the owner seam itself, then wire Home Page later.

### Phase Boundary Rules

This family phase stays inside recent-items ownership and snapshot semantics.

It does not own:
- graph persistence ownership
- graph file IO
- Browser/project ownership
- Home Page toggle wiring before the owner exists
- full docs or changelog ownership
- unrelated storage cleanup

The first phase should prove that recent-items has a real owner seam before Home Page exposes a toggle or inventory row.

## Vision

`Home-Page-5` should make recent-items honest.

The user should eventually be able to remember or forget recent/resume state intentionally, but only after the app has a real owner for that state.

The owner seam now exists, so the next honest step is for Home Page to expose recent-items inventory and the remember/forget policy through that owner seam without absorbing the storage semantics itself.

## Wishlist Organization

### High Level Goals

- [x] `Home-Page-Gen1-HLG-12. Home Page should include a Recent Items persistence toggle when a recent-items owner exists, so recent/resume state can be remembered or forgotten intentionally.`

### Codex Level Goals

- [x] `Home-Page-Gen1-CLG-11. Add a Recent Items persistence toggle only after a recent-items owner or storage bucket exists, keeping resume semantics outside Home Page.`

### `Home-Page-5 / Phase 1`

- [x] Create the recent-items owner seam and browser-storage bucket.
- [x] Define the recent working-set semantics and snapshot shape.
- [x] Add focused owner-seam tests.
- [x] Leave Home Page toggle wiring for a later slice.
- [x] `npm run build`

## [x] `Home-Page-5 / Phase 1` - `Create Recent-Items Owner Seam Before Home Page Toggle Wiring`

### Phase 1 Summary

Phase 1 creates the missing storage owner for recent-items and stops there.

The Home Page toggle comes later, after the owner seam exists and the runtime semantics are honest.

### Phase 1 Implementation Spec

#### Purpose

Create the recent-items owner seam and its browser-storage bucket so Home Page can later expose a truthful remember/forget control.

#### Owns

- the recent-items owner seam
- the recent/resume snapshot semantics
- focused owner-seam tests
- the future handoff point for a Home Page toggle row

#### Does Not Own

- Home Page toggle wiring
- graph persistence
- graph file IO
- Browser/project ownership
- docs browsing or release-note ownership

#### Current Live Read

- `src/app/recentItems/recentItemsPersistence.ts` is now the recent-items owner seam
- the browser-storage bucket is `parahook.recentItems.workingSet.v1`
- the snapshot stores reference-only recent/resume targets in `itemsById`, `itemOrder`, and `activeItemId`
- runtime inspector labels are not a storage owner
- the Home Page toggle should wait until the owner exists

#### First Pass Decisions

1. Create the real owner seam before exposing any Home Page control.
2. Define the recent working-set behavior explicitly.
3. Keep the storage semantics with the recent-items owner, not with Home Page.
4. Add the smallest focused tests that prove the owner exists.
5. Leave the Home Page toggle and UI affordance for a later phase.

#### Likely Files

- a new recent-items owner module
- the recent-items persistence bucket or bridge
- focused owner-seam tests
- later: `src/app/workspace/HomePageSurface.tsx`
- later: `src/app/workspace/homePageStorageTransparency.ts`

#### No-Widening Rule

- do not add Home Page toggle wiring yet
- do not fold recent-items into graph persistence
- do not widen into Browser/project ownership
- do not add unrelated storage cleanup or docs browsing

#### Verification Shape

- focused owner-seam tests for the new recent-items storage owner
- `npm run build`

#### Done Shape

- recent-items has a real owner seam
- the snapshot semantics are explicit
- Home Page can wire a toggle later without inventing ownership

## [x] `Home-Page-5 / Phase 2` - `Home Page Recent-Items Inventory And Toggle Wiring`

### Phase 2 Summary

Wire Home Page to the existing recent-items owner seam so the page can inventory recent-items storage and expose a truthful remember/forget policy.

This phase is the next legal slice because Phase 1 already created the owner seam, bucket key, and snapshot shape. The remaining work is Home Page visibility and policy wiring.

### Phase 2 Implementation Spec

#### Purpose

Expose recent-items storage and remember/forget policy on Home Page through the new recent-items owner seam while keeping recent-items semantics inside `src/app/recentItems/recentItemsPersistence.ts`.

#### Owns

- Home Page recent-items inventory visibility
- Home Page remember/forget policy wiring for recent-items
- storage transparency updates that surface the recent-items bucket
- focused Home Page and surface tests for recent-items visibility and policy toggling
- the acceptance proof that `Home-Page-Gen1-HLG-12` and `Home-Page-Gen1-CLG-11` can be closed

#### Does Not Own

- recent-items storage semantics
- recent-items snapshot shape or target owner rules
- graph persistence
- graph file IO
- Browser/project ownership
- broader storage cleanup
- docs browsing or release-note ownership

#### Current Live Read

- `src/app/recentItems/recentItemsPersistence.ts` already owns the recent-items browser-storage bucket
- the bucket descriptor and snapshot are reference-only and use `itemsById`, `itemOrder`, and `activeItemId`
- Home Page now has a visible recent-items inventory row and remember/forget wiring through the owner seam
- `Home-Page-Gen1-HLG-12` and `Home-Page-Gen1-CLG-11` are closed after the Home Page wiring landed with focused proof

#### First Pass Decisions

1. Keep the recent-items semantics in the owner seam, not in Home Page.
2. Surface the recent-items bucket in Home Page storage transparency and policy UI.
3. Keep the toggle wording explicit about remember/forget behavior.
4. Preserve the reference-only snapshot model and existing owner-target scope.
5. Add the smallest focused tests that prove the Home Page visibility and toggle wiring.

#### Likely Files

- `src/app/workspace/HomePageSurface.tsx`
- `src/app/workspace/homePageStorageTransparency.ts`
- `src/app/workspace/HomePageSurface.test.tsx`
- `src/app/workspace/homePageStorageTransparency.test.ts`
- `src/app/recentItems/recentItemsPersistence.ts`
- any narrow Home Page bridge or helper needed for policy wiring

#### No-Widening Rule

- do not move recent-items semantics into Home Page
- do not widen into graph persistence
- do not widen into Browser/project ownership
- do not add unrelated storage cleanup
- do not add broader docs or release-note ownership

#### Verification Shape

- focused Home Page tests for the recent-items inventory row and toggle
- focused storage helper tests if any helper logic moves
- `npm run build`

#### Done Shape

- Home Page shows the recent-items bucket in its storage transparency read
- Home Page exposes a truthful remember/forget control for recent-items
- the recent-items owner seam stays authoritative for storage semantics
- the phase can close `Home-Page-Gen1-HLG-12` and `Home-Page-Gen1-CLG-11`
