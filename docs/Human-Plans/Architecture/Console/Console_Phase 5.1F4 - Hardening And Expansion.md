## [x] `5.1F4` Hardening And Expansion

### Summary

`5.1F4` should harden the canonical workspace-selection model after the first migrated paths are working, then extend it to more root domains and deeper authoring branches.

This is the phase that should turn the graph-first proof into a reusable pattern.

It should:
- lock regression coverage around the seams introduced in `5.1F1-F3`
- remove leftover migrated-path glue where the shared seam already covers the outcome
- widen the model to the next root domains without redesigning the underlying selection/intent contract

It should not:
- reopen the canonical seam design
- fold back into input-routing work from `4.1J`
- turn into broad shell placement or visual polish work

#### Questions / Decisions

##### [x] `q1` Decide what hardening should focus on first.

##### Suggestion
- locked direction:
- hardening should focus on:
  - regression coverage for shared selection truth
  - regression coverage for canonical-intent behavior
  - removal of leftover migrated-path bridge glue where safe

##### [x] `q2` Decide which domains should expand next.

##### Suggestion
- locked direction:
- after the graph-first proof, the next root domains should be:
  - `Reference`
  - `Assembly`
- later node-family expansion should follow only after those root-domain paths are honest

##### [x] `q3` Decide what should stay out of expansion.

##### Suggestion
- locked direction:
- keep these out:
  - unrelated shell placement work
  - input-routing ownership work already handled by `4.1J`
  - broad app-wide UI restyling

##### [x] `q4` Decide what the stop condition should be.

##### Suggestion
- locked direction:
- stop when:
  - migrated paths no longer depend on one-off cross-surface glue
  - the canonical seam can absorb the next root domain without redesign
  - regression coverage protects the shared selection and intent contract

### Implementation Spec

Purpose:
- stabilize the canonical seam and expand it beyond the first graph-first proof

#### Main Decision

The main decision in `5.1F4` is:
- how far should the team widen the canonical workspace-selection model before stopping and hardening it?

Locked answer:
- harden the graph-first contract first
- then widen the same contract to the next root domains:
  - `Reference`
  - `Assembly`
- stop before widening into every node family or every viewer/browser behavior

#### First Hardening Cut

The first hardening cut should be:
- graph-first regression coverage
- removal of leftover graph-first bridge glue where the canonical seam already owns the outcome
- reference and assembly planning hooks only where the same seam can absorb them without redesign

First concrete outcomes to prove:
- graph selection stays consistent across console, browser, and spaghetti under continued edits
- graph-node reflection keeps reading shared target truth
- spaghetti/browser active-state reflection stays driven by shared `activeSurface`
- the next root-domain path can plug into the same seam shape instead of creating a second coordination model

Important rule:
- do not widen expansion faster than hardening
- if a new root-domain path requires seam redesign, stop and fix the seam before expanding further

Owned here:
- regression coverage for shared workspace-selection and intent behavior
- cleanup of leftover bridge logic in migrated paths
- extension to additional root domains:
- `Reference`
- `Assembly`
- later extension to more node-family branches as needed

Likely first hardening/expansion surfaces:
- `ConsoleDock`
- `BrowserPanel`
- `AppShell`
- shared workspace seams in:
  - `useAppStore`
  - `workspaceIntents`

Likely responsibilities:
- canonical seams:
  - remain the source of selection truth and shared outcomes
- migrated surfaces:
  - shed leftover one-off graph-first glue where safe
  - adopt the same canonical verbs for the next root domains
- tests:
  - lock the current contract before expansion continues

#### First Implementation Steps

`5.1F4` should likely be completed in this order:

1. identify leftover migrated graph-first glue still surviving outside the canonical seam
2. remove or reduce that glue one narrow path at a time
3. add regression coverage around:
  - shared `selectedTarget`
  - shared `activeSurface`
  - canonical graph-first intents
4. prove the same seam shape can absorb `Reference`
5. prove the same seam shape can absorb `Assembly`
6. stop before widening into deeper node-family branches unless the root-domain expansion is already honest

#### Hard Rules

- do not redesign `workspaceSelection` unless a real contradiction appears
- do not create root-domain-specific intent systems that bypass the canonical seam
- do not widen into every node family in the same pass
- do not turn `5.1F4` into a browser redesign, transcript redesign, or shell-mode redesign
- do not keep migrated graph-first behavior alive through duplicate fallback glue once tests prove the seam already owns it

Not owned here:
- unrelated shell placement work already covered by other `5.1` phases
- input-routing ownership, already covered by `4.1J`
- broad browser hierarchy redesign
- full viewer-highlight redesign
- unrelated command-language polish

Acceptance shape:
- migrated paths no longer depend on one-off cross-surface glue
- canonical workspace truth remains stable under continued feature growth
- additional root domains can adopt the same seam without redesigning it
- graph-first regressions are covered tightly enough that later expansion cannot quietly fork the model
- `Reference` and `Assembly` have a clear path onto the canonical seam without inventing parallel coordination systems

## Surface-Driven Console Context Handoff
### Summary

Yes, this makes sense.

The cleaner long-term model is:
- surface interaction should be able to hand the `Console` into the nearest valid staged scope
- but a click should not silently execute deeper commands
- the console should become context-aware, not auto-authoring

Example:
- user clicks the `Spaghetti Editor`
- active graph is `graph_[1]`
- console should be forwarded into:
  - `Graph > graph_[1]`
- then the next graph-scope commands should be ready immediately

This same pattern should later work for other root domains:
- `Reference`
- `Assembly`

Important rule:
- clicking a surface should move the console to the nearest stable command scope
- it should not auto-run a child command unless the user explicitly submits that next command

### Vision

The full vision is:
- `Console` is not only a place where commands start
- it is also the place where the current workspace context becomes command-ready

That means:
- command entry can begin from typing
- or it can begin from workspace focus/selection

If the user clicks into a surface and the app already knows:
- active surface
- active graph
- selected target

then the console should be able to say:
- "you are here now"
- "these are the next valid commands"

That should make the command system feel less separate from the workspace.

### Handoff Shape

The clean handoff order should be:

1. determine active root domain
- `Graph`
- `Reference`
- `Assembly`

2. determine nearest stable staged scope
- active graph document
- selected node/object/reference if that target already maps cleanly to a known command scope

3. move the console into that staged scope
- update breadcrumb/session
- show next valid commands
- do not auto-run one of them

4. preserve explicit user intent for deeper steps
- user still chooses:
  - `Sketch`
  - `Extrude`
  - `Output Preview`
  - etc.

### First Intended Behavior

First good version:

- click floating or split `Spaghetti Editor`
  - if active graph is known:
    - console enters `Graph > graph_[n]`

- click browser graph row
  - console enters `Graph > graph_[n]`

- click browser graph node row
  - if that node maps to a known graph-scope family:
    - console enters the corresponding staged node scope
  - otherwise:
    - console stops at graph scope with the node selected

Important rule:
- start with graph-first handoff
- do not try to hand every possible browser row into a console scope in the first cut

### Questions / Decisions

#### [ ] `q1` Decide whether surface clicks should automatically move the console into a staged scope.

#### Suggestion
- locked direction:
- yes, when the clicked/focused surface maps cleanly to a known command domain
- this should feel like context handoff, not implicit command execution

#### [ ] `q2` Decide what the nearest stable scope should be for a `Spaghetti Editor` click.

#### Suggestion
- locked direction:
- clicking the `Spaghetti Editor` should first hand off to:
  - `Graph > graph_[n]`
- not deeper by default
- deeper node-family scopes should require either:
  - an already selected target with a clean mapping
  - or an explicit next command from the user

#### [ ] `q3` Decide whether selecting a graph node should enter a node-family scope automatically.

#### Suggestion
- locked direction:
- only when that node clearly belongs to a known command family
- examples:
  - `Sketch`
  - later `Extrude`
  - later `Output Preview`
- if the mapping is unclear, stay at graph scope and keep the node selected

#### [ ] `q4` Decide whether surface-driven handoff may overwrite current console input.

#### Suggestion
- locked direction:
- no, not when the user is actively typing
- if the console has draft input, preserve it
- surface-driven handoff should update staged context/prompt only when:
  - console is idle
  - or the current session can be safely retargeted

#### [ ] `q5` Decide how the console should report the handoff.

#### Suggestion
- locked direction:
- publish a short `Selection` or `App` line such as:
  - `Context: Graph > graph_[1]`
- do not spam repeated messages when the same scope is already active

#### [ ] `q6` Decide how this should relate to `activeSurface` and `selectedTarget`.

#### Suggestion
- locked direction:
- `activeSurface` chooses the foreground domain
- `selectedTarget` chooses the nearest specific scope inside that domain
- console handoff should resolve from those shared seams instead of panel-local guesses

### Implementation Shape

This should likely become:
- one console-context handoff seam above `ConsoleDock`
- driven by:
  - shared `activeSurface`
  - shared `selectedTarget`
  - current staged session state

Likely first implementation cut:
- graph-only
- spaghetti click -> `Graph > graph_[n]`
- browser graph click -> `Graph > graph_[n]`
- browser graph-node click -> graph scope or mapped node-family scope

Important rule:
- this is not a replacement for typed commands
- it is a shortcut into the correct staged context

### Success Shape

This vision is working when:
- clicking into `Spaghetti Editor` with `graph_[1]` active makes graph commands immediately available
- browser and spaghetti can both move the console into the same graph scope
- the console feels like it is attached to the workspace state
- but deeper authoring actions still require explicit user submission

## UI / Console Sync Vision
### Summary

The UI workspace and the `Console` command line should stay visibly synchronized.

This means:
- if the user clicks into a surface, the console should say so
- if the user selects a target, the console should say so
- the console should then move into the matching staged command scope
- the next valid commands for that scope should become visible immediately

This should work the same way from:
- `Spaghetti Editor`
- `Browser`

Important rule:
- UI interaction should update command context
- UI interaction should not silently execute the next deeper command

### Core Behavior

The intended behavior is:

- click `Spaghetti Editor`
  - console reports that `Spaghetti` is active
  - console enters the active graph scope
  - example:
    - `Graph > graph_[1]`

- click off `Spaghetti Editor`
  - console reports that the editor is no longer active
  - console returns to the nearest parent/root scope

- click `Sketch` node in `Spaghetti`
  - console reports the sketch selection
  - console enters the sketch node scope
  - sketch-local next commands become visible

- click `Sketch` node in `Browser`
  - same console result
  - same staged scope
  - same next commands

This should not depend on which surface the user used.

### Shared-State Rule

This sync should resolve from shared workspace truth:

- `activeSurface`
  - which domain is foregrounded
- `selectedTarget`
  - which specific target is selected

The console should derive its staged scope from those seams instead of from panel-local assumptions.

Important rule:
- `Browser` and `Spaghetti` should not create different command states for the same selected target

### Example Outcomes

Examples:

- user clicks `Spaghetti`
  - console:
    - reports `Spaghetti` active
    - shows graph-scope choices

- user clicks `Sketch`
  - console:
    - reports sketch selected
    - shows sketch-scope choices such as:
      - `Sketch Plane`
      - `Sketch Draw`
      - `Back`

- user clicks away to no active authoring surface
  - console:
    - reports context change
    - returns to root-ready state

### Main Rule

The best mental model is:

- the workspace chooses context
- the console reflects context
- the user still explicitly chooses the next command

So:
- clicking `Sketch` should enter `Sketch`
- but it should not auto-run `Sketch Plane` or `Sketch Draw`

That keeps the system synchronized without making clicks feel like hidden command execution.


