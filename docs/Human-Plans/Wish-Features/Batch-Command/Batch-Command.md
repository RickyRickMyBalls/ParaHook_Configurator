# Batch Command

## Doc Header

### Doc History
1. 2026-04-05: Created this wish-feature note to capture the idea of chaining console steps with `>` so one line can advance through staged command paths and, later, feed active prompts for longer authoring flows

### Purpose

This doc captures the idea of batched console command entry.

Use it to answer:
- what the `>` chain is supposed to mean
- where the idea fits the current console direction
- what should count as a first pass versus a later expansion
- what risks need to stay visible before this becomes a real implementation phase

### Core Idea

- let the user enter a whole command path in one console submission instead of one step at a time
- treat `>` as a step separator
- each token should be submitted in sequence through the same staged navigation system the console already uses
- once the chain reaches an action that opens an active prompt or tool runtime, later tokens could be forwarded into that prompt flow instead of forcing the user to stop and type again

Simple example:

```text
Graph>Sketch>Sketch Draw
```

Possible later example:

```text
Graph>Sketch>Sketch Draw>Rec>vec3>vec3>done>Extrude>Select Profile>Profile 1>Set Depth>10>Wire to output
```

### Why This Feels Valuable

- it makes the console feel faster and more intentional for users who already know the path they want
- it gives ParaHook a more CAD-command-like feel without requiring a separate macro language on day one
- it could reduce friction for repeated authoring flows like:
  - entering a graph
  - opening sketch draw
  - selecting a draw tool
  - confirming a sketch result
  - moving into a follow-on node like `Extrude`
- it pairs naturally with the current staged console direction instead of fighting it

### Suggested Meaning Of `>`

- `>` should mean:
  - submit this token
  - resolve it in the current scope
  - if it advances, continue with the new scope
  - if it executes and opens a prompt/runtime, continue forwarding the remaining tokens into that next prompt surface if that surface supports batch continuation
- `>` should not necessarily mean a durable commit boundary
- it is better read as:
  - path separator
  - step advance
  - sequential token pipeline

This distinction matters because some steps are:
- staged navigation choices
- tool-entry actions
- numeric prompt values
- selection labels
- final commit verbs like `done`

Those are not all the same kind of "commit."

### Best First-Pass Boundary

The cleanest first pass is:
- support batched staged navigation only
- stop before trying to solve every value-entry and session-runtime case

Good first examples:
- `Graph>Sketch`
- `Graph>Sketch>Sketch Draw`
- `Graph>Sketch>Sketch Draw>Rec`
- `Camera>Projection>Perspective`

Why this is the right first cut:
- the app already has staged navigation structure
- it is easier to reason about success and failure
- it avoids turning the first version into a full command scripting system
- it can ship useful value without solving all prompt-runtime edge cases immediately

### Good Second-Pass Expansion

After staged batching works, the next expansion could allow:
- action handoff into active tool or prompt flows
- numeric/value token forwarding
- selection/value confirmation in the same batch line

Examples:
- `Graph>Sketch>Sketch Draw>Rec>0,0>10,10`
- `Graph>Sketch>Sketch Draw>Circle>0,0>5`
- `Graph>Extrude>Select Profile>Profile 1>Set Depth>10`

This phase should only happen after the rules are explicit for:
- how active prompts consume tokens
- how failures are surfaced
- whether partial success is allowed

### Longer-Term Direction

If this grows well, it could become a recipe-like authoring surface for repeated geometry flows.

Potential later examples:
- create a sketch and rectangle in one line
- confirm the sketch and open `Extrude`
- select a profile and set an extrusion depth
- wire the final node to output

That would make it possible for one console line to produce something meaningful like a box, but this should be treated as a later maturity phase rather than a first implementation target.

### Architecture Fit

This idea appears to fit the current console direction well because ParaHook already has:
- staged/scoped command routing
- local sketch command scoping
- a distinction between staged command selection and active drawing/runtime state

That means the feature should build on:
- staged navigation for path traversal
- existing local scope rules for things like `SketchDraw`
- existing runtime/session owners for active prompts and tool-specific input

It should not start by replacing:
- sketch runtime state machines
- point-by-point draw logic
- existing local/global precedence rules

### Important Product Rules

- the transcript should show what happened step by step, even when the user typed one line
- the system should stop on the first failure
- the failure message should clearly show which token failed
- partial progress should remain visible instead of failing silently
- local scope rules and global command-family escape hatches should still behave predictably
- short aliases should stay careful so batch chains do not become ambiguous

### Risks And Open Questions

#### 1. Mixed token types

- some tokens are staged choices
- some are freeform values
- some are labels looked up from live app state
- some are explicit commit verbs

The console needs an honest rule for how it knows which parser owns the next token.

#### 2. Ambiguity

- aliases like `R`, `P`, `O`, and similar shortcuts can collide badly in deep chains
- label-driven selection like `Profile 1` may become fragile if names are duplicated or renamed

#### 3. Partial execution

- if token 8 fails after token 1 through 7 already succeeded, the user needs a clear visible result
- it may be acceptable to stop in the last valid prompt state rather than trying to roll back

#### 4. Scope ownership

- local `SketchDraw` commands, root families, and later graph-specific flows need stable precedence
- batch mode should not bypass the same ownership rules as interactive mode

#### 5. Not turning into a hidden scripting language too early

- this feature should feel like faster console usage
- not like a separate automation subsystem with its own grammar, variables, loops, or macro files

### Suggested Rollout

#### v1

- accept `>`-separated staged command paths
- process tokens sequentially through the existing staged navigation system
- show each step in the transcript
- stop on first invalid token

#### v2

- allow staged actions to hand the remaining tokens into active prompt flows
- support simple numeric/value forwarding for a few well-scoped flows
- define clear failure messages for mid-chain prompt errors

#### v3

- support longer geometry recipes that can create or configure multiple linked authoring steps
- consider richer transcript summaries for long successful chains
- consider whether repeatable named command recipes ever deserve a separate feature

### Strong Recommendation

- pursue this idea
- start small
- define `>` as a sequential path separator, not as a magical commit concept
- land staged-path batching first
- only then expand into prompt/value forwarding and recipe-grade geometry flows

### Good Non-Goals For A First Real Phase

- full macro recording
- loops or branching
- variables or references between steps
- undo/rollback transactions across a whole chain
- solving every console family at once
- replacing existing sketch/runtime ownership with a new command engine
