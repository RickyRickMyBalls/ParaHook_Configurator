### [4.1N] [x] - Feature Session Prompt Descriptor Follow-On

The same prefill behavior should not remain staged-navigation-only forever.

Active feature sessions that expose a small finite command set should be able to publish one shared prompt descriptor so the console can:
- render the prompt text from one source
- prefill the input from the first suggested choice
- highlight the current assisted choice
- avoid per-feature manual input seeding

Recommended first prompt descriptor shape:
- `label`
  - the active command surface name such as `Sketch Plane` or `Sketch Draw`
- `choices`
  - the currently valid command choices for that surface
- `prefill`
  - the first suggested choice token when assisted input should begin aligned to a choice

First intended sketch examples:
- `Sketch Plane`
  - `choices: [XY, XZ, YZ]`
  - `prefill: XY`
- `Sketch Draw`
  - `choices: [Line, PLine, X]`
  - `prefill: Line`

Important rule:
- do not keep hardcoding prompt text and input seeding separately in each feature path
- feature sessions and staged navigation should eventually feed the same console-assisted prompt model

This should be implemented as one shared console seam:
- staged navigation may continue to produce prompt/choice/prefill state
- active feature sessions may also produce prompt/choice/prefill state
- the console should consume that shared shape instead of remembering feature-specific prefill logic

### Questions / Decisions

#### [x] `q1` Decide whether feature-session prompt assist should reuse the staged-choice model or invent a second assist system.

##### Suggestion
- locked direction:
- reuse one shared console-assisted prompt shape
- do not invent a second per-feature assist system beside staged navigation

#### [x] `q2` Decide the first feature-session consumers.

##### Suggestion
- locked direction:
- first consumers should be:
  - `Sketch Plane`
  - `Sketch Draw`
- they already expose small finite command sets and are the current feature paths most likely to drift into hand-seeded prompt logic

#### [x] `q3` Decide whether this phase should redesign non-staged freeform command entry.

##### Suggestion
- locked direction:
- no
- keep this phase focused on shared prompt/choice/prefill state for constrained active sessions

### Implementation Spec

Purpose:
- extend the existing console-assisted choice model beyond staged navigation so active feature sessions can publish prompt, choice, and prefill state through one shared seam

#### Current Code-To-Target Mapping

- current staged-choice assist seam already exists in:
  - `useConsoleStore`
  - `stagedNavigationSession`
  - `cycleStagedChoice(...)`
  - `seedInputText(...)`
- current feature-session prompt seam is still fragmented:
  - `Sketch Plane`
    - prompt text is currently pushed as hardcoded transcript lines such as:
      - `Sketch Plane > [XY, XZ, YZ]`
  - `Sketch Draw`
    - prompt text is currently built in the sketch store and pushed as transcript text such as:
      - `Sketch Draw > [Line, PLine, X]`
- current gap:
  - feature sessions can show prompt text
  - but they do not yet publish a shared assisted prompt descriptor that the console can use for:
    - input prefill
    - targeted choice highlight
    - future arrow cycling

#### Scope

Owned here:
- one shared console prompt-descriptor seam for constrained active sessions
- a shared descriptor shape that can be produced by:
  - staged navigation
  - feature sessions
- console-side consumption of that shape for:
  - prompt rendering
  - input prefill
  - assisted current-choice tracking
- first feature-session adoption for:
  - `Sketch Plane`
  - `Sketch Draw`

Not owned here:
- broad autocomplete or search behavior
- freeform command redesign
- full toolbar / console command unification
- larger transcript-history redesign
- whole-app session modeling outside the console prompt seam

#### Recommended First Data Shape

The first prompt descriptor should stay narrow.

Recommended shape:
- `label`
  - active prompt surface name
- `choices`
  - current finite valid choices
- `prefill`
  - first suggested token for assisted input alignment

Example first reads:
- `Sketch Plane`
  - `choices: [XY, XZ, YZ]`
  - `prefill: XY`
- `Sketch Draw`
  - `choices: [Line, PLine, X]`
  - `prefill: Line`

Important rule:
- keep this as a console prompt-assist descriptor
- do not broaden it into a second feature-command state model

#### First Implementation Cut

The first implementation cut should stay narrow:
- staged navigation keeps its current behavior
- add one shared prompt-descriptor seam the console can read from either:
  - staged navigation
  - active feature sessions
- migrate only the first two active feature-session families:
  - `Sketch Plane`
  - `Sketch Draw`

First behavior to make real:
- when a constrained active feature session starts, the console should be able to:
  - render the prompt from the descriptor
  - prefill the input from the descriptor
  - treat the first choice as the initial assisted target
- feature sessions should no longer need to remember both:
  - prompt transcript copy
  - manual input seeding

#### Ownership Rule

Ownership should stay with the console seam, not feature-local glue.

Recommended read:
- active feature sessions publish descriptor state
- console store owns:
  - current assisted input text
  - targeted choice tracking
  - manual-override behavior
- console UI renders from that state

Avoid:
- each feature calling ad hoc input seeding directly
- each feature inventing its own choice-cycling logic
- transcript-only prompt copy being treated as the source of truth for assisted choice state

#### Hard Rules

- do not create one assist model for staged navigation and a separate assist model for feature sessions
- do not require feature sessions to remember to seed input manually
- do not widen this phase into global autocomplete/search UX
- do not make feature-session assist the reason command validity works
- do not alter unconstrained flat command behavior in the same pass unless required by the shared prompt seam

#### Acceptance Shape

- a reader can point to one shared console prompt-descriptor seam in code
- staged navigation and active feature sessions can both publish prompt/choice/prefill state through that seam
- `Sketch Plane` and `Sketch Draw` no longer rely on separate manual input seeding to get assisted first-choice behavior
- the console can render prompt text and prefill input from the same source for constrained sessions
- manual typing still overrides the assisted suggestion cleanly
- the change lands as one shared console-prompt refinement rather than a second feature-local assist system

