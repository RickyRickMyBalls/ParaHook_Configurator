# Left Dock Gen1 Index

## Doc Header

### Doc History
2. 2026-05-02 10:28:45: Marked `Left-Dock-1 / Phase 1 - Read-Only Shared Stack Resizing Baseline` complete after the shared left-dock shell shipped persisted stack-height and split-ratio ownership, bottom-edge plus shared-divider drag behavior, aligned two-panel minimum sizing, and focused AppShell regression coverage
1. 2026-05-02 10:16:10: Added this `Left-Dock-Gen1-Index.md` generation index under `Viewport-Docking`, organizing the first left-dock generation around a shared resize baseline and creating the first explicit family phase for Browser, Meatball Editor, and Runtime Inspector stack-height plus shared-divider behavior

### Purpose

This file is the active generation index for `Left Dock / Generation 1`.

Use it to answer:
- what `Generation 1` of the left dock is trying to make true
- which high-level goals this generation owns
- how the first left-dock generation is split into family phases
- where the first implementation-ready future doc lives

Do not use it for:
- broad left-dock north-star reasoning that belongs in the vision doc
- pretending later dock-surface expansion work is already part of the first runtime slice
- replacing the implementation-phase detail in the standalone `Future/` doc

### Relationship To Other Docs

- `docs/Vision.md`
  - repo-wide operating vision
  - useful for keeping left-dock work aligned with the shared hybrid workspace direction

- `docs/Human-Plans/Architecture/Viewport-Docking/Left-Dock-Vision.md`
  - stable left-dock north-star doc
  - useful for generation framing, ownership boundaries, and what must stay true

- `docs/Human-Plans/Architecture/Viewport-Docking/Future/Left-Dock-1 - Shared Dock Stack Resizing.md`
  - first implementation-ready family phase doc
  - useful for the concrete left-dock resizing ladder and implementation boundaries

## Doc Body

### Short Version

`Generation 1` should make the left dock feel like one real hosted stack instead of a Browser-first column with special-case openings for other panels.

The first generation should prove:
- total left-dock stack height is explicit
- the shared divider between hosted panels is explicit
- Browser, Meatball Editor, and Runtime Inspector can participate through one honest dock-stack contract
- the shell can validate the model in read-only form before widening into later dock-family expansion

### Generation 1 Summary

`Generation 1` is the left-dock resizing baseline.

It should establish one real layout model for:
- dock width
- total hosted stack height
- internal split ratio between stacked hosted panels
- shared resize handles
- persistence of those values

This generation should stay narrow.

It is not trying to solve:
- every future dock participant idea
- panel reordering
- new content behavior inside Browser, Meatball Editor, or Runtime Inspector
- broader AppShell cleanup unrelated to left-dock hosted stack ownership

### Generation 1 Boundaries

`Generation 1` owns:
- explicit left-dock stack-height planning
- explicit shared-divider planning for multi-panel left-dock stacks
- Browser, Meatball Editor, and Runtime Inspector participation in one shared left-dock layout contract
- read-only shell validation as an acceptable first implementation stop when it proves the ownership model honestly

`Generation 1` does not own:
- Browser internals
- Meatball Editor content internals
- Runtime Inspector content internals
- unrelated viewport docking lanes outside the primary left dock

## Wishlist Organization

### High Level Goals

- [x] `LD-G1-HLG-1 - Make the primary left dock a real shared stack layout instead of a Browser-first column with one-off hosted panel expansion rules.`
- [x] `LD-G1-HLG-2 - Give users honest control over total left-dock stack height and internal panel relationships when multiple hosted surfaces are present.`
- [x] `LD-G1-HLG-3 - Keep Browser, Meatball Editor, and Runtime Inspector on one shared dock contract with persistence-ready ownership instead of surface-local resize hacks.`

### `Left-Dock-1 Phase 1`

- [x] `LD-G1-HLG-1` Establish one implementation-ready left-dock family phase centered on shared stack resizing.
- [x] `LD-G1-HLG-2` Cover the three required resize reads in one narrow phase:
  - Browser-only bottom-edge height adjustment
  - shared Browser/Meatball divider adjustment
  - total stack bottom-edge height adjustment when Meatball is docked
- [x] `LD-G1-HLG-3` Include Runtime Inspector as a first-class participant in the same shared dock-stack contract instead of planning it as a later special case.

## [x] `Left-Dock-1` - `Shared Dock Stack Resizing`

Standalone future doc:
- `docs/Human-Plans/Architecture/Viewport-Docking/Future/Left-Dock-1 - Shared Dock Stack Resizing.md`

Role in the family:
- first implementation-ready left-dock phase
- first honest shared stack-ownership proof for Browser, Meatball Editor, and Runtime Inspector

What this phase must make true:
- the left dock has an explicit total stack-height model
- the left dock has an explicit shared internal split model when multiple hosted panels are present
- the first implementation ladder stays narrow and shell-owned
- Runtime Inspector is planned against the same dock contract from the start

Implementation result:
- shipped as the Generation 1 baseline
- Browser-only bottom-edge resizing now works
- Browser plus Meatball shared-divider and total stack-height resizing now work
- Runtime Inspector remains on the same future participant contract without widening this phase into new content-hosting work

Focused verification:
- `npm.cmd exec -- tsc --noEmit`
- `npm.cmd exec -- vitest run src/app/AppShell.test.tsx:9240 src/app/AppShell.test.tsx:9293`

Guardrail:
- do not widen this first phase into content behavior changes for the hosted panels themselves
