# Sketch Phase 3.2B-Console-3 - Shared Sketch Command Tree And Scope Providers

## Doc Header

### Doc History
1. 2026-03-23 15:02: Created this standalone future phase doc for `[3.2B-Console-3]`, defining the later sketch-console cleanup where `SketchPlane` and `SketchDraw` contribute one shared sketch-local command tree/provider model instead of mixing staged root scopes, feature-assist branches, and direct token parsing

### Purpose

This phase unifies sketch-local command architecture.

Use it to answer:
- how `SketchPlane` and `SketchDraw` should plug into one sketch command tree
- where scope-specific commands should be registered
- how to stop using multiple unrelated routing styles inside one console surface

### Why This Phase Exists

The console should remain one surface.

But the sketch family still mixes:
- staged root scopes
- feature-assist branches
- direct token parsing in `ConsoleDock`

This phase exists to collapse those into one sketch-local command architecture.

### Scope

This phase covers:
- one shared sketch-local command tree
- scope providers for `SketchPlane` and `SketchDraw`
- shared alias/choice ownership across console and toolbar surfaces

This phase does not cover:
- a whole-app generic command registry for every feature family
- fuzzy command search
- non-sketch families

## Doc Body

## [ ] - `[3.2B-Console-3]` - `Shared Sketch Command Tree And Scope Providers`

Purpose:
- unify root sketch scope, `SketchPlane`, and `SketchDraw` under one sketch-local command tree/provider model

Owns:
- one shared sketch-local command tree
- child scope providers for:
  - `SketchPlane`
  - `SketchDraw`
- one ownership model for:
  - visible choices
  - aliases
  - breadcrumbs
  - toolbar/console command-family alignment

Current code problem:
- staged root families and local sketch branches do not yet come from one common provider model
- `ConsoleDock.tsx` still knows too much about sketch-local command routing details

Locked direction:
- the console should stay one surface
- sketch-local command families should stop using multiple unrelated routing styles underneath that one surface
- toolbar and console should continue to map onto the same sketch command families

Definition of done:
- `SketchPlane` and `SketchDraw` both plug into one sketch-local command tree/provider model
- `ConsoleDock` no longer acts like the permanent sketch command registry
- sketch-local scope ownership is clear enough that later console/view-toolbar growth can build on the same command architecture
