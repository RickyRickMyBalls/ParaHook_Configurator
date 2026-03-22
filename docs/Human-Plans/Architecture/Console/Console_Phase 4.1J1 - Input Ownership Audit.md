### [x] `4.1J1` Input Ownership Audit

#### Questions / Decisions

##### [x] `q1` Decide which keys `4.1J1` must audit first.

##### Suggestion
- locked direction:
- `4.1J1` should audit these keys first:
  - `Esc`
  - `Enter`
  - `Space`
  - `m / r / s`
  - `x`
  - `b / back`
- do not widen the audit until these keys are understood and locked

##### [x] `q2` Decide which active input-owner categories ParaHook should recognize.

##### Suggestion
- locked direction:
- the first ownership categories should be:
  - focused real text-editing field
  - sketch-plane pick session
  - geometry sketch draw/review session
  - reference transform session
  - staged console session
  - flat console capture
  - idle/passive app state
- use these categories consistently in both audit and later routing work

##### [x] `q3` Decide the intended priority order between active input owners.

##### Suggestion
- locked direction:
- the target priority should be:
  1. focused real text-editing field
  2. active modal/tool-specific session
  3. active feature session
  4. active staged console session
  5. flat/global console capture
  6. passive/global shortcuts
- lower-priority systems should not claim keys if a higher-priority owner is active

##### [x] `q4` Decide what `Esc` should mean for each owner category.

##### Suggestion
- locked direction:
- `Esc` should mean `cancel or exit the highest-priority active session`
- first target semantics:
  - text field:
    - stays with the field if the field owns it
  - sketch-plane pick:
    - cancel sketch-plane pick
  - sketch draw:
    - first `Esc` clears draft
    - second `Esc` exits draw
  - staged console:
    - cancel staged session
  - reference transform:
    - cancel active transform session
- do not use `Esc` as a one-level staged back key

##### [x] `q5` Decide what `Enter` should mean for each owner category.

##### Suggestion
- locked direction:
- `Enter` should mean `confirm/submit for the highest-priority active owner`
- first target semantics:
  - text field:
    - submit/commit field-local editing
  - sketch-plane pick:
    - confirm plane when stage allows it
  - sketch draw:
    - finish current draft when allowed
  - staged console:
    - submit current token
  - flat console:
    - submit current command text

##### [x] `q6` Decide whether `Space` should be global or command-scoped.

##### Suggestion
- locked direction:
- `Space` should not become a global submit key
- it should act like `Enter` only in token-based command contexts
- command tokens should stay space-free where practical so `Space` and `Enter` can both submit the current token
- real text-editing fields must retain normal `Space` behavior

##### [x] `q7` Decide whether single-letter command keys should be global or scope-relative.

##### Suggestion
- locked direction:
- single-letter keys should be scope-relative
- examples:
  - `b` may mean `Back` in staged navigation
  - `m` may mean `move` in flat console but something else in a feature session
- do not freeze single-letter keys into one global meaning

##### [x] `q8` Decide what the audit should produce as concrete output.

##### Suggestion
- locked direction:
- `4.1J1` should produce:
  - one current-owner table
  - one target-owner table
  - one key-priority list
  - one locked token-input rule for `Space`
- this should be enough to start `4.1J2` without another discovery pass

### Implementation Spec

Purpose:
- document the real current owners for the highest-risk keys and session overlaps

In scope:
- audit current ownership for:
  - `Esc`
  - `Enter`
  - `Space`
  - `m / r / s`
  - `x`
  - `b / back`
- list current listeners and the contexts where they take effect
- lock the intended priority order
- lock whether command tokens should stay space-free so `Space` and `Enter` can both act as submit keys in command contexts

#### Audit Method

`4.1J1` should be a documentation-first audit, not a code-rewrite phase.

It should:
- inspect current key listeners and command-entry seams
- map them to active session categories
- record both current and intended ownership
- identify known conflicts and ambiguities

It should not:
- refactor routing yet
- move listeners yet
- silently change feature behavior

#### Locked Audit Artifacts

`4.1J1` should leave behind these concrete artifacts in this doc:

1. Current owner audit table
- key
- current owner(s)
- live context(s)
- current behavior
- ambiguity/conflict

2. Target owner table
- key
- target owner
- target behavior
- fallback or exception

3. Input priority list
- ordered owner categories
- one short explanation per level

4. Token rule note
- command tokens should stay space-free where practical
- `Space` and `Enter` may both submit in token-based command contexts
- real text-entry surfaces keep normal `Space`

#### Required Output Tables

`4.1J1` should leave behind these explicit artifacts in the doc:

1. key-owner audit table
- key
- current owner(s)
- current contexts
- observed ambiguity or conflict

2. target ownership table
- key
- target owner
- target behavior
- notes/exceptions

3. input-priority list
- ordered owner categories
- short explanation for each step

#### Audit Coverage Notes

The audit should answer these concrete questions for each key:
- who owns the key today
- when that owner wins
- what other system is currently competing for it
- what the target winning owner should be
- whether the key is token-based, session-local, or global

Important rule:
- do not leave live conflicts described only as prose
- each conflict should be visible in either the current-owner table or the target-owner table

#### Required Keys

The audit must explicitly cover:
- `Esc`
- `Enter`
- `Space`
- `m`
- `r`
- `s`
- `x`
- `b`
- `back`

Important rule:
- do not leave any of these keys at â€œTBDâ€ if they are already in live use

#### Required Current Owners

The audit should inspect at least these current seams:
- `ConsoleDock`
- `ConsoleBar`
- `ViewportOverlay`
- `Viewer`
- `ReferenceTransformToolbar`
- any relevant store/session seam that gives those handlers meaning

#### Scope Boundary

Keep `4.1J1` focused.

Owned here:
- current-vs-target ownership mapping
- token-input rule for `Space`
- key-priority contract

Not owned here:
- routing implementation
- listener removal
- feature-session rewrites

#### First Implementation Steps

`4.1J1` should likely be completed in this order:

1. enumerate active key listeners and the sessions they serve
2. group current behavior under one shared owner-category model
3. write the current-owner table
4. write the target-owner table
5. lock the priority order
6. lock the `Space` token rule
7. record known conflicts that `4.1J2` must resolve

#### Locked Deferrals

Keep these out of `4.1J1`:
- code-level routing changes
- listener deletion
- toolbar rewrites
- full transcript redesign
- command taxonomy expansion beyond current live keys

#### Acceptance Shape

- there is one explicit current-vs-target ownership table in the doc
- the target key-priority order is locked
- the token-input rule for `Space` is locked
- the highest-risk live conflicts are named explicitly enough to start `4.1J2`

#### Current Owner Audit Table

| Key | Current owner(s) | Live context(s) | Current behavior | Ambiguity / conflict |
| --- | --- | --- | --- | --- |
| `Esc` | focused text field, `ConsoleBar`, `ConsoleDock`, `ViewportOverlay`, `Viewer`, `ReferenceTransformToolbar` | text editing, staged console, sketch-plane pick, sketch draw, reference transform | clears console input, cancels staged navigation, cancels sketch-plane pick, clears or exits sketch draw, cancels pending reference transform | multiple window listeners exist; ownership is not decided in one seam |
| `Enter` | focused text field, `ConsoleBar`, `ViewportOverlay`, `Viewer`, `ReferenceTransformToolbar` | text editing, flat console, staged console, sketch-plane adjust, sketch draw, reference transform | submits command text, confirms sketch plane, finishes sketch draft, commits pending transform | same key is valid in several active sessions with no central owner selection |
| `Space` | focused text field, `ConsoleBar` | text editing, staged console token input | normal space in fields; submit current token when `treatSpaceAsSubmit` is enabled | behavior is currently safe but owned only by console-local wiring, not a shared rule |
| `m` | `ViewportOverlay`, `ReferenceTransformToolbar`, `ConsoleDock` | sketch-plane adjust, reference transform, flat/staged console token input | switch sketch-plane gizmo to move, start move transform, or become a console token / `move` command | current console auto-capture can compete with active reference-transform keyboard shortcuts |
| `r` | `ViewportOverlay`, `ReferenceTransformToolbar`, `ConsoleDock`, `Viewer` | sketch-plane adjust, reference transform, flat/staged console token input, viewer gizmo mode | switch sketch-plane gizmo to rotate, start rotate transform, become a console token / `rotate` command, or switch viewer gizmo to scale | current ownership is spread across console, toolbar, and viewer seams |
| `s` | `ReferenceTransformToolbar`, `ConsoleDock` | reference transform, flat/staged console token input | start scale transform or become a console token / `scale` or scoped staged command | active reference-transform shortcuts are not yet protected by the same defer rule used for sketch-plane `m/r` |
| `x` | `ReferenceTransformToolbar`, `ConsoleDock` | reference transform axis selection, sketch-plane console command, sketch-draw console command | choose X axis during transform, cancel sketch-plane pick as `x`, or exit sketch draw as `x` | scope-sensitive today, but still split between live keyboard session and typed command session |
| `b` | staged navigation grammar, `ConsoleDock` | staged navigation scopes with a parent | `b` means `Back` and moves one staged level up | `Build` no longer claims the short `b` alias |
| `back` | staged navigation grammar, `ConsoleDock` | staged navigation only | always moves staged navigation one level up when a parent scope exists | low conflict today, but it should stay staged-only rather than becoming a global key |

#### Target Ownership Table

| Key | Target owner | Target behavior | Notes / exceptions |
| --- | --- | --- | --- |
| `Esc` | highest-priority active owner | cancel or exit the active session | text fields keep native ownership; staged console uses `Esc` to cancel the whole staged session, not go back one level |
| `Enter` | highest-priority active owner | confirm or submit the active session | text fields commit local editing; staged and flat console submit tokens / commands |
| `Space` | token-based command owner only | submit current token in command contexts | never global; real text-entry surfaces keep normal `Space` |
| `m` | sketch-plane adjust, else reference transform, else command input | move mode in active session, otherwise command token | this is scope-relative, not a global one-letter law |
| `r` | sketch-plane adjust, else reference transform, else command input | rotate mode in active session, otherwise command token | viewer-only `r` behavior should not outrank an active higher-priority session |
| `s` | reference transform, else command input | scale mode in active session, otherwise command token | staged graph / sketch aliases may still reuse `s` inside their own scope |
| `x` | reference transform axis-selection, else command/session-local token owner | X axis in transform mode; otherwise session-local command meaning | do not make `x` global; keep it owned by the active session scope |
| `b` | staged navigation scope | staged back token | `b` always means `Back` in staged navigation |
| `back` | staged navigation scope | always go up one staged level | staged-only command token, not a passive global shortcut |

#### Locked Input Priority List

1. Focused real text-editing field
- native typing wins first
- command capture and global shortcuts must not steal keys from real text editing

2. Active modal / tool-specific session
- examples:
  - sketch-plane pick
  - pending reference-transform keyboard edit
- if one of these is active, it wins over console capture

3. Active feature session
- examples:
  - geometry sketch draw / review
  - reference transform session more broadly
- feature-local keys win before staged or flat console routing

4. Active staged console session
- staged navigation owns token submission and staged lifecycle keys once no higher-priority feature session is active

5. Flat / global console capture
- printable keys auto-capture into the console only when no higher-priority owner is active

6. Passive / global shortcuts
- lowest-priority shortcuts should run only when nothing more specific owns the key

#### Locked Token Rule For `Space`

- command tokens should stay space-free where practical
- display labels may still contain spaces:
  - `Sketch Draw`
  - `Sketch Plane`
- command tokens should prefer compact forms such as:
  - `g`
  - `sd`
  - `sp`
  - `back`
- in token-based command contexts, `Space` and `Enter` may both submit the current token
- outside those contexts, `Space` remains ordinary text input

#### Known Live Conflicts To Resolve In `4.1J2`

- `Esc` is currently meaningful in console input, staged console, sketch-plane pick, sketch draw, viewer, and reference transform, but ownership is still distributed across several listeners.
- `Enter` is currently meaningful in flat console, staged console, sketch-plane adjust, sketch draw, and reference transform, but there is no single routing seam deciding who wins.
- `m / r / s` are split between console token capture and active feature sessions.
- `m / r` already defer correctly for sketch-plane adjust, but `m / r / s` do not yet follow one shared rule for reference transform.
- `x` is already scope-sensitive in a healthy way, but it still depends on separate listeners rather than one explicit priority contract.

#### Phase Result

`4.1J1` is complete when read as a planning artifact:
- the current owners are explicit
- the target owners are explicit
- the key-priority contract is explicit
- the token rule for `Space` is explicit
- `4.1J2` can now implement a routing seam without another discovery pass


