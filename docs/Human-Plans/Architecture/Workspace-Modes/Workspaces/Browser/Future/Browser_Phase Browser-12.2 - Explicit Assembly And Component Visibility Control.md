# Browser Phase Browser-12.2 - Explicit Assembly And Component Visibility Control

## Doc Header

### Doc History
3. 2026-04-15 23:05:00: Refreshed the umbrella after `12.2.1` and `12.2.2` implementation so the live seam read no longer claims Browser context-menu or selected Console authored visibility are missing, and so `12.2.3` now reads as the real remaining selected-target keyboard parity slice
2. 2026-04-15 22:18:00: Tightened `Browser-12.2` into implementation-prep shape after checking the live Browser seams, recording that the authored assembly/component row eyeball is already live and splitting the remaining gap into Codex-sized `12.2.1` through `12.2.3` parity slices around Browser context menu, selected Console, and selected keyboard entry
1. 2026-04-15 21:24:00: Created this standalone future Browser visibility phase so authored assembly/component hide behavior has an explicit planning surface before the broader Browser-13 polish ladder, locking that parent hide stays viewer-only and flows through the existing aggregated visibility membership instead of inventing a second hidden-container model

### Purpose

This phase makes authored assembly/component visibility explicit across the Browser-owned command surfaces that still lag the live row eyeball.

Use it to answer:
- how authored `Assembly` and `Component` visibility should stay consistent across Browser row, right-click, selected Console, and keyboard entry
- where selected authored-container visibility eligibility should live
- what should stay out of scope so this remains a Browser visibility parity phase instead of turning into layers or scene presets

## Doc Body

## [ ] Browser-12.2 - Explicit Assembly And Component Visibility Control

### Summary

`Browser-12.2` starts after the Browser tree already became much more honest about normal project nodes and runtime traits:
- `Browser-10.4`
  - Browser row derivation, ViewerHost, and Console reads already converged more of their load/visibility/runtime truth onto shared normal-node trait seams
- `Browser-12`
  - Browser-local row-surface cleanup stayed separate from deeper ownership work
- `Browser-12.1`
  - imported-object progress got its own dedicated follow-on instead of being hidden inside generic Browser cleanup

The remaining visibility gap is narrower:
- Browser should make authored `Assembly` and `Component` hide behavior explicit
- parent rows should act like real aggregate visibility controls
- that hide behavior must stay clearly separate from collapse, delete, unload, and build-policy changes

This phase locks that direction before the later `Browser-13` UI cleanup ladder so visibility semantics do not get buried inside generic polish.

### Implementation-Prep Read

- direct Browser eyeball toggling for authored `Assembly` / `Component` rows is already live
- `Browser-12.2` is the authored-container visibility parity umbrella, not a speculative "invent the eyeball" phase
- `Browser-12.2.1` Browser context-menu parity is already implemented
- `Browser-12.2.2` selected Console parity is already implemented
- `Browser-12.2.3` is the next queued selected-target keyboard follow-on
- later root command-pick flow can stay a separate future follow-on if we still want command-first authored container visibility beyond selected-target parity

### Owns

- explicit Browser hide/show behavior for authored `Assembly` and `Component` rows
- routing parent hide through shared descendant visibility membership instead of per-child manual work
- Browser row-state truth for hidden container rows
- keeping Browser structure stable while hidden rows remain restorable in place
- focused Browser visibility tests around container rows

### Does Not Own

- layer ownership or layer visibility systems
- isolate/solo scene management
- build-policy semantics
- deleting, collapsing, or unloading Browser rows
- broader Browser UI polish outside the visibility behavior needed for this phase

### Locked Direction

- keep hide viewer-only:
  - hiding an assembly or component must not change build state, ownership, or hierarchy placement
- use one shared visibility model:
  - flow parent hide through the same aggregated descendant `visibilityPartKeys` / runtime visibility seam the Browser already uses for row truth
- keep the Browser tree stable:
  - hidden rows stay present and discoverable so the user can unhide them directly
- stay narrowly Browser-owned:
  - do not widen this first cut into layers, isolate/solo, or preset visibility scenes
- split the remaining work by surface:
  - Browser-local parity first
  - selected Console parity second
  - selected keyboard parity third

### Current Gap

The Browser already has important visibility groundwork:
- Browser planning already separates the eyeball from build policy
- normal Browser rows already derive shared visibility/runtime traits
- authored assembly/component rows already collect descendant visibility membership instead of only pretending leaf objects can own visibility
- the live row eyeball already toggles authored container visibility through that shared seam

The remaining gap is parity:
- keyboard visibility routing still only targets reference-object flows
- Browser context menu and selected Console parity are now aligned with the row eyeball, leaving keyboard as the remaining first-ladder command-surface gap
- without a focused phase, those remaining gaps risk getting treated as incidental polish instead of deliberate Browser behavior

### Current Live 12.2 Seams

- `src/app/panels/browserTreeRowPresenter.tsx`
  - already renders the Browser visibility eye for authored content rows when `visibilityPartKeys.length > 0`
- `src/app/panels/browserInteractions.ts`
  - already owns `handleToggleContentVisibility(...)`
  - already fans authored container visibility across descendant part keys through `setPartVisibility(...)`
- `src/app/panels/browserContextMenu.ts`
  - already owns Browser right-click command surfacing
  - now exposes explicit authored container `Hide` / `Show` parity through the same visibility setter used by the row eyeball
- `src/app/store/useAppStore.ts`
  - already derives authored container `isVisible` plus aggregated `visibilityPartKeys`
  - selected authored `assembly` / `component` console targets now carry visibility eligibility metadata like `canHide`, `canShow`, and `visibilityPartKeys`
- `src/app/console/stagedNavigation.ts`
  - selected authored-container sessions now expose `content.visibility.hide` / `content.visibility.show` beside the existing selected-target actions
- `src/app/console/useConsoleInteraction.ts`
  - already executes selected authored-container `content.visibility.hide` / `content.visibility.show` through `setPartVisibility(...)`
- `src/app/inputRouting.ts`
  - currently routes visibility shortcuts only for reference hide/recovery, not for selected authored containers

### Implementation Direction

1. Keep authored container visibility on the existing aggregated descendant part-key seam.
2. Add Browser-local right-click parity before widening into command-surface work.
3. Add selected Console visibility parity only after the Browser-local behavior is explicit.
4. Add selected keyboard parity only after selected Console visibility eligibility is already proven.
5. Keep root command-pick visibility or global authored recovery out of this first ladder unless a later follow-on explicitly owns it.

### Tracked Subphases

- `Browser-12.2.1 - Browser Context Menu Hide And Show Parity For Authored Containers`
  - landed Browser right-click `Hide` / `Show` parity for authored `Assembly` / `Component` rows through the same seam the row eyeball already uses
- `Browser-12.2.2 - Selected Authored Container Console Hide And Show Parity`
  - landed selected-target Console `Hide` / `Show` parity for authored containers through the same selected-target visibility seam
- `Browser-12.2.3 - Selected Authored Container Keyboard Hide Parity`
  - next queued slice
  - add selected-target keyboard hide entry now that selected Console parity already proves the eligibility and action path

### Questions / Decisions

#### [ ] q1 - Should assembly/component hide stay viewer-only instead of changing build or ownership state?

Question:
- when a user hides an authored assembly or component from Browser, should that action affect only viewport visibility and leave build policy, content ownership, and hierarchy placement unchanged?

Suggestion:
- yes
- keep hide as visibility-only

#### [ ] q2 - Should hiding a parent row fan out to its visible descendant geometry instead of requiring manual child-by-child hide?

Question:
- when the user hides an `Assembly` or `Component` row, should Browser apply that visibility change across the descendant object/part visibility membership represented by that row rather than making the user hide every child separately?

Suggestion:
- yes
- parent hide should be the natural aggregate visibility control

#### [ ] q3 - Should hidden assemblies/components remain visible in Browser so users can restore them directly?

Question:
- after an assembly or component is hidden, should its row stay in Browser with a hidden-state affordance so the user can unhide it in place instead of losing the hierarchy entry entirely?

Suggestion:
- yes
- keep the Browser tree stable and use the row surface to show hidden state

#### [ ] q4 - Should this phase stay narrower than layers, isolate/solo, or visibility presets?

Question:
- should `Browser-12.2` stay focused on direct authored assembly/component hide/show behavior in Browser, leaving later layer-style isolate, solo, visibility presets, or broader scene-management commands to separate workspaces or phases?

Suggestion:
- yes
- keep this cut narrowly about explicit Browser-owned container hide control

### Concrete Implementation Targets

Primary expected targets across the full `12.2` ladder:
- `src/app/panels/browserContextMenu.ts`
- `src/app/panels/browserInteractions.ts`
- `src/app/panels/browserTreeRowPresenter.tsx`
- `src/app/store/useAppStore.ts`
- `src/app/console/stagedNavigation.ts`
- `src/app/console/useConsoleInteraction.ts`
- `src/app/inputRouting.ts`

Supporting targets if needed:
- `src/app/panels/browserContextMenu.test.ts`
- `src/app/panels/BrowserPanel.test.tsx`
- `src/app/console/stagedNavigation.test.ts`
- `src/app/console/ConsoleDock.test.tsx`
- `src/app/inputRouting.test.ts`
- `src/app/store/useAppStore.test.ts`

### Tests

- Browser row and Browser context-menu visibility stay synchronized for authored `Assembly` / `Component` rows
- selected Console sessions expose the correct `Hide` versus `Show` action for authored containers once that slice lands
- selected keyboard hide entry only triggers when authored container visibility eligibility is truly available
- hiding an authored container still changes only viewport visibility, not build policy or hierarchy ownership
- hidden assembly/component rows stay present in Browser and can be restored directly
- existing object, part, sketch, and reference visibility behavior does not regress while authored container parity is clarified

### Assumptions

- Browser should expose meaningful parent visibility controls once the hierarchy already has meaningful parent owners
- one shared visibility model is safer than inventing a second hidden-container state
- the best first cut keeps authored container visibility explicit and useful without widening into a full scene/layer management system
- Browser already has enough live authored container visibility groundwork that the right next step is parity work, not re-inventing the base row toggle
