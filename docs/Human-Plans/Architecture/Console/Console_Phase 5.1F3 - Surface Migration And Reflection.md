## [x] `5.1F3` Surface Migration And Reflection

### Summary

`5.1F3` should migrate the highest-value surfaces onto the canonical workspace-selection seam and canonical intents.

This is where shared truth should start visibly driving browser selection, spaghetti activation/highlight, and related viewer/editor reflection.

This cut should stay narrow:
- migrate the graph-first path first
- prove visible reflection from shared truth
- remove only the panel-local glue that the migrated path truly replaces
- do not widen into full workspace unification in the same pass

### Questions / Decisions

#### [x] `q1` Decide which migrated path should go first.

#### Suggestion
- locked direction:
- the first migrated path should be the graph-first flow:
  - graph selection from `Console`
  - graph selection from `Browser`
  - spaghetti visibility/open reflection
  - spaghetti active highlight

#### [x] `q2` Decide what reflection should be considered in scope first.

#### Suggestion
- locked direction:
- first reflection targets should be:
  - browser selection
  - spaghetti visibility/open state for migrated graph paths
  - spaghetti active-window highlight
  - viewer/editor target reflection where it already has a real backing seam

#### [x] `q3` Decide what should not be required in the first migration wave.

#### Suggestion
- locked direction:
- do not require:
  - every root domain
  - every node family
  - full browser redesign
  - broad transcript changes

#### [x] `q4` Decide what counts as truly migrated.

#### Suggestion
- locked direction:
- a path is only truly migrated when:
  - different surfaces can produce the same outcome through the same canonical intent
  - reflection reads shared truth
  - panel-local sync glue is no longer the reason the path works

#### [x] `q5` Decide when staged-console choice assist should land.

#### Suggestion
- locked direction:
- do not block `5.1F2` on staged-console choice assist
- finish the canonical intent layer first
- treat staged-console choice assist as a `5.1F3`-adjacent surface refinement that can land once the graph-first path is already migrating through shared truth
- this keeps:
  - `5.1F2` focused on canonical intent definition
  - `5.1F3` focused on visible surface behavior and reflection
- the assist should improve staged-node selection without becoming the reason the underlying path works

#### [x] `q6` Decide what the first migrated proof should visibly show.

#### Suggestion
- locked direction:
- the first migrated proof should visibly show:
  - browser graph selection reflecting the shared target
  - spaghetti opening/highlighting from the same shared graph-first outcome
  - graph-node selection reflecting in browser + spaghetti from the same shared target
- the user should be able to see that the surfaces are synced because of shared truth, not because each panel is manually poking the others

#### [x] `q7` Decide which local glue is allowed to remain temporarily.

#### Suggestion
- locked direction:
- local glue may remain temporarily only when:
  - it is outside the migrated graph-first path
  - or it serves a purely local presentation responsibility
- migrated graph-first reflection should not keep separate panel-local sync code once the shared truth is already available

#### [x] `q8` Decide what should count as success for `5.1F3`.

#### Suggestion
- locked direction:
- `5.1F3` is complete when:
  - the graph-first path visibly reflects shared workspace truth across browser and spaghetti
  - shared graph/node selection no longer depends on panel-local sync glue for the migrated paths
  - spaghetti open/highlight behavior is driven through the shared outcome path
  - the intent seam from `5.1F2` did not need redesign during migration

### Implementation Spec

Purpose:
- make the first real surfaces render from shared workspace truth instead of panel-local sync glue

#### Main Decision

The main decision in `5.1F3` is:
- which visible surface paths should now trust the shared workspace-selection seam and canonical intents instead of local synchronization?

Locked answer:
- start with the graph-first path
- migrate only enough visible reflection to prove the shared model is real

#### First Implementation Cut

The first implementation cut should be:
- graph selection from console and browser
- graph-node selection where the current shared target already exists
- spaghetti visibility/highlight reflection for those migrated paths

First visible outcomes to prove:
- selecting a graph from console highlights/opens spaghetti and selects the same graph in browser
- selecting a graph from browser produces the same spaghetti/open/highlight outcome
- selecting a graph node through the migrated graph-first flow reflects the same selected node in browser and spaghetti

Important rule:
- do not broaden the first cut into:
  - every browser row type
  - every node family
  - every viewer highlight mode
  - every detached/floating surface case
  unless the migrated graph-first path truly needs it

Owned here:
- graph selection from `Console`
- graph selection from `Browser`
- spaghetti visibility/open-state reflection for migrated paths
- spaghetti active-window highlight from shared `activeSurface`
- first shared selected-target reflection in browser/editor/viewer where relevant

Likely first migrated surfaces:
- `ConsoleDock`
- `BrowserPanel`
- `AppShell`
- existing browser/spaghetti selection/highlight read paths

Likely responsibilities:
- canonical seams from `5.1F1-F2`:
  - stay the source of shared truth and shared outcomes
- migrated surfaces:
  - read shared target/active-surface truth
  - stop re-implementing migrated graph-first sync behavior locally
- remaining local UI:
  - keep presentation-only details that do not compete with shared truth

#### First Migration Steps

`5.1F3` should likely be completed in this order:

1. identify the graph-first browser/spaghetti reflection paths already using shared truth only partially
2. migrate browser graph selection to read/write the shared target cleanly
3. migrate spaghetti open/highlight reflection to read shared graph-first outcomes cleanly
4. migrate graph-node reflection for the same narrow path
5. remove only the local sync glue that the migrated path truly replaced
6. verify the same visible result from:
  - console path
  - browser path
7. stop before expanding into broader workspace reflection work

#### Hard Rules

- do not reopen the canonical intent design from `5.1F2`
- do not migrate every browser/content/reference row type in the same cut
- do not turn `5.1F3` into a transcript redesign or command-language phase
- do not keep migrated graph-first reflection working through duplicated panel-local state once the shared target already exists

Not owned here:
- every domain family
- full workspace-wide UI unification
- transcript redesign
- full viewer reflection redesign
- browser hierarchy redesign beyond the migrated graph-first path

Planned console-surface refinement after the first migrated graph path is stable:
- staged choice assist in the console input
- prefill the current input with the first valid staged choice where appropriate
- allow `ArrowUp` / `ArrowDown` to cycle sibling staged choices
- visually highlight the currently targeted staged choice in the console prompt/summary area
- keep free typing available:
  - arrow cycling should help selection
  - it should not replace normal token entry

Acceptance shape:
- the same graph selection outcome works from console and browser
- migrated surface reflection reads shared truth
- panel-local selection glue is reduced for the migrated graph-first paths
- graph-node reflection for the first migrated path reads the shared target instead of duplicated local sync state
- `5.1F4` can harden and widen the model without redesigning the migrated graph-first contract


