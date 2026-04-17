# `FWS - 1` - `Existing Shell Cleanup`

## Doc Header

### Doc History
1. 2026-04-17 15:11:06: Created this standalone future phase doc for `FWS - 1`, giving the existing repeated floating shell one explicit cleanup home grounded in the live `ViewToolbar`, `DashboardWindowHost`, `NotepadWindowHost`, and detached viewer floating-shell seams so the next widening step can target honest shared shell ownership instead of more feature-local copies

### Purpose

This doc locks the first `Floating Window Shell` phase.

Use it to answer:
- what the current shared floating shell already does
- which shell behavior is still duplicated
- how cleanup should separate shared shell ownership from feature-body ownership
- what the first honest shared-shell cleanup pass should target

### Why This Phase Exists

The current floating shell is real, but not clean yet.

Today the app already has:
- shared-looking floating shell chrome
- repeated titlebar drag behavior
- repeated floating rect plus clamp behavior
- one shared quick-dock button owner
- toolbar-only resize ownership

What it does not yet have is one honest shared shell owner for the repeated shell behavior.

This phase exists to clean up that existing shell before more widening lands.

### Scope

This phase covers:
- identifying the current repeated shell seams
- deciding the honest shared owner boundary
- cleanup and extraction planning for the existing shell
- the first shared resize-parity direction across the current floating shell users

This phase does not cover:
- new floating feature families
- popout shell parity
- feature-body behavior changes
- a giant generic UI framework pass

## Doc Body

### Goal

Clean up the existing floating window shell so shared behavior can widen from one honest owner instead of staying trapped in `ViewToolbar` or repeated across neighboring hosts.

### Boundaries

This phase should:
- focus on shell behavior that is already clearly shared
- keep feature bodies owned by their current families
- preserve real host-specific minimum-size or clamp differences where needed
- prepare the shell for safer shared resize parity

This phase should not:
- turn every floating surface concern into one giant abstraction
- flatten away meaningful host differences
- move feature-body rendering into the shell family

### Architecture Direction

The right architectural read for this phase is:
- `Floating Window Shell` owns shared shell behavior
- feature families keep their body behavior
- workspace families keep broader host-mode direction

Suggested cleanup target:
- one explicit shared owner for:
  - resize handles
  - resize pointer state
  - shell-level clamp helpers where they are truly shared
  - shell header action patterns when they are truly shared

Important rule:
- shared shell cleanup should extract real repeated truth, not just move copy-paste into a new file

### Current Live Read

Current toolbar-local resize owner:
- [src/app/components/ViewToolbar.tsx](./../../../../../../../src/app/components/ViewToolbar.tsx)
  - currently owns:
    - all-edge and corner resize handles
    - resize pointer state
    - toolbar-local floating clamp and minimum-size logic

Current neighboring floating shell owners:
- [src/app/hosts/DashboardWindowHost.tsx](./../../../../../../../src/app/hosts/DashboardWindowHost.tsx)
  - owns a floating rect plus drag titlebar
  - does not yet own resize handles
- [src/app/hosts/NotepadWindowHost.tsx](./../../../../../../../src/app/hosts/NotepadWindowHost.tsx)
  - owns a floating rect plus drag titlebar
  - does not yet own resize handles
- [src/app/AppShell.tsx](./../../../../../../../src/app/AppShell.tsx)
  - detached floating model viewport shell owns a floating rect plus drag titlebar
  - does not yet own resize handles

Current shared shell chrome seam:
- [src/app/components/FloatingWindowQuickDockButton.tsx](./../../../../../../../src/app/components/FloatingWindowQuickDockButton.tsx)
  - proves one small shared shell owner already exists
  - is a useful shape reference for how shell cleanup should widen without taking over feature bodies

### Acceptance Read

This phase is healthy when:
- the existing repeated shell seams are named honestly
- the shared-owner boundary is clear
- the next resize-parity widening step has a real cleanup home
- feature families can stop carrying shell-local copies where the shell should own the behavior

## Wishlist Organization

### High Level Goals

- [ ] `HLG 1. Clean Up The Existing Floating Window Shell`

### `FWS - 1 Phase 1`

- [ ] `0. The Existing Floating Shell Seams Are Named Honestly`
- [ ] `1. Shared Shell Ownership Stops Living Only In ViewToolbar`
- [ ] `2. Resize Parity Has A Real Shared-Shell Home`
- [ ] `3. Feature Bodies Stay Owned By Their Feature Families`
- [ ] `HLG 1. Clean Up The Existing Floating Window Shell`

## [ ] `FWS - 1` - `Phase 1 - Existing Shell Cleanup`

### Phase 1 Summary
#### Purpose

Create the first honest cleanup lane for the repeated floating shell and lock where shared shell ownership should begin.

#### Owns

- current shell seam inventory
- shared-owner boundary read
- cleanup direction for existing repeated shell behavior
- first resize-parity cleanup target

#### Does Not Own

- implementing the later shared shell system itself
- popout-window cleanup
- feature-body migration

#### Current Live Read

The main repeated shell behavior currently lives across:
- [ViewToolbar.tsx](./../../../../../../../src/app/components/ViewToolbar.tsx)
- [DashboardWindowHost.tsx](./../../../../../../../src/app/hosts/DashboardWindowHost.tsx)
- [NotepadWindowHost.tsx](./../../../../../../../src/app/hosts/NotepadWindowHost.tsx)
- [AppShell.tsx](./../../../../../../../src/app/AppShell.tsx)

The most important drift today is:
- resize still lives only in `ViewToolbar`
- drag and clamp logic are still repeated per host
- shell chrome has started converging but is not yet one real shared shell system

#### First Pass Decisions

- keep this first `FWS` phase honest as cleanup and prep
- do not pretend the shell is already shared just because some chrome converged
- treat all-edge and corner resize parity as the next obvious shared-shell widening target
- keep host-specific min sizes or clamp truths where they are real

### Phase 1 Implementation Spec

#### Exact First Code Cut

1. Read the live shell users and identify which shell behaviors are genuinely duplicated versus still feature-specific.
2. Lock one explicit shared-owner direction for the repeated shell behavior, especially the path that can widen resize beyond `ViewToolbar`.
3. Define the first cleanup target so a later implementation pass can move shared resize ownership out of toolbar-local code without flattening real host differences.
4. Keep the shell-family planning surface separate from feature-family behavior docs.

#### Likely Files

- shell users:
  - `src/app/components/ViewToolbar.tsx`
  - `src/app/hosts/DashboardWindowHost.tsx`
  - `src/app/hosts/NotepadWindowHost.tsx`
  - `src/app/AppShell.tsx`
- likely shared shell owner area:
  - `src/app/components/`
  - or `src/app/hosts/`
- docs update targets after later implementation:
  - `docs/CHANGELOG.md`

#### No-Widening Rule

- do not treat this cleanup phase as a feature implementation phase
- do not move feature-body rendering into the shell family
- do not widen into popout parity yet

#### Implementation Risks

- inventing a fake template abstraction instead of extracting real shared shell behavior
- over-generalizing shell behavior that still has real host-specific differences
- leaving resize trapped in `ViewToolbar` while claiming the shell is already shared

#### Checklist

- [ ] name the current shell users and their repeated behaviors
- [ ] lock the honest shared-owner boundary
- [ ] keep feature-body ownership separated
- [ ] prepare the next shared resize-parity widening step

#### Verification Shape

Minimum verification for this phase should cover:

- the shell family now has a real planning home
- `FWS - 1` reads as cleanup and prep, not fake shipped work
- the next shared resize widening step can point here instead of staying trapped in `View-Toolbar`

#### Done Shape

`FWS - 1` is done when:

- the existing floating shell has a real cleanup home
- the shared-owner read is explicit
- the next shared resize parity pass has a stable planning surface

Current status:
- `FWS - 1` is planned, not started
- this is the first cleanup lane for the existing shell
- later implementation can now widen shared shell behavior from this family instead of hiding it under `View-Toolbar`
