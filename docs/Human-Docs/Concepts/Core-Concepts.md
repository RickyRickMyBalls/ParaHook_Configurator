# Core Concepts

## Doc Header

### Doc History
1. 2026-04-18 11:45:00: Created this first Concepts page for `Human-Docs` so readers can get the main ParaHook mental model in one place without having to assemble it from the larger planning and architecture docs

### Purpose

This page explains the ideas that show up again and again across ParaHook.

Use it to understand:
- what ParaHook treats as authored truth
- how graph documents differ from project content
- why preview and accepted results are not the same thing
- how workspaces, surfaces, and tools fit together

## Doc Body

### The Short Mental Model

ParaHook is trying to be a graph-native CAD workspace.

That means a few ideas matter more than almost anything else:

1. You author intent in graphs.
2. The app turns that intent into build work.
3. The worker computes geometry.
4. The project can expose that result as real content.
5. The viewer and workspace surfaces show the result, but they are not the source of truth.

If you keep those layers separate in your head, most of the rest of the app starts making more sense.

### Authored Graph Truth Comes First

The graph is where ParaHook is meant to describe what a model is and how it should be built.

That matters because ParaHook does not want the viewer, the Browser, or some hidden export step to quietly become the real owner of the model.

The intended direction is:

`graph document`
-> `build inputs`
-> `executed geometry`
-> `published output`
-> `project content`
-> `viewer and workspace presentation`

In plain English:

- author first
- compute second
- present last

### Graph Documents And Content Are Different

One of the easiest ways to get confused in ParaHook is to treat `Graph Documents` and `Content` as if they are the same thing.

They are related, but they do different jobs.

`Graph Documents` are about authoring:
- which graph you edit
- where node logic lives
- how a graph is identified inside the project

`Content` is about project structure:
- what the project exposes upward from those graphs
- what objects or outputs the rest of the app can inspect
- what the Browser can show as real project content instead of just editor state

The simple rule is:

- `Graph Documents` answer "what are we authoring?"
- `Content` answers "what does the project currently contain?"

### Preview Is Not The Same As Accepted Result

ParaHook often needs to show something quickly while you work.

That is what preview is for.

Preview helps you:
- check whether a graph change did what you expected
- inspect draft geometry in the viewport
- keep working without treating every temporary result as final project truth

But preview is not the same thing as the accepted or committed result.

That separation matters because:
- a fast viewport update should not quietly rewrite project truth
- viewer state should not become geometry ownership
- published project content should stay tied to explicit build results, not whatever happened to be on screen last

So when ParaHook talks about preview, it usually means "useful current display," not "the final owner of the model."

### Workspaces, Surfaces, And Tools

These terms are close to each other, but they are not interchangeable.

A `workspace` is the larger working environment.

It decides how major surfaces are arranged and how they can move between tiled, floating, or detached placement.

A `surface` is one major working area inside that workspace, such as:
- the Browser
- the Model Viewport
- the Spaghetti Editor
- the Console

A `tool` is a more specific capability used inside a surface, such as:
- drawing
- selecting
- moving
- inspecting
- changing visibility

This distinction matters because ParaHook is trying to keep layout decisions separate from feature ownership.

Changing where a surface is shown should not create a second hidden version of the feature.

### Why ParaHook Talks So Much About Ownership

A lot of ParaHook's architecture language comes down to one question:

"Which layer is allowed to be the truth for this thing?"

That question shows up everywhere:
- should the graph own this, or only the viewer?
- is this project content, or just editor state?
- is this a preview identity, or a build identity?
- is this workspace layout, or feature behavior?

When those answers stay clear, the app is easier to grow.

When they blur together, the app starts feeling magical in the wrong way.

### Learn More

- [Glossary](../Glossary.md)
- [Engine Architecture](Engine-Architecture.md)
- [Project Flow](Project-Flow.md)
- [Vision](../../Vision.md)
