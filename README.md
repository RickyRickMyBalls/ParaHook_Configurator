# ParaHook Generator v20
[https://rickyrickmyballs.github.io/ParaHook_Configurator/](https://rickyrickmyballs.github.io/ParaHook_Configurator/)

ParaHook is a browser-based parametric authoring app for experimenting with hook and foothook design.

The current app combines:

- a graph-driven authoring surface called `Spaghetti Editor`
- a `Browser` for project content, graph documents, references, and open editors
- a Three.js viewer for previewing generated output
- a worker-based build pipeline so geometry/build work stays out of the React UI thread
- a reference workspace that can load built-in and user-imported `STEP`, `STL`, `OBJ`, and `GLB` assets

This README is meant to be the quick "what is this, how do I run it, where do I look first" document.

## What The App Does

Right now the project is centered around a graph-authoring workflow:

1. Create or open a graph document.
2. Edit it in the `Spaghetti Editor`.
3. Compile/build the graph through the worker pipeline.
4. Inspect the result in the shared 3D viewer.
5. Compare or align output against reference models in the reference workspace.

The app also has support for:

- multiple open editor viewports
- floating, maximized, split, and docked editor layouts
- browser-managed graph save/load flows
- project content browsing for published output
- reference transforms and camera framing tools
- a console/debug surface for runtime feedback

## Roadmap Snapshot

Recent shipped foundation work:

- [x] graph documents, save/load, multi-document ownership, and shared viewport composition
- [x] Browser workspace basics, graph/content browsing, and reference workspace support
- [x] user reference import plus transform/timeline tooling for reference assets

Current active lanes:

- [~] foundational geometry growth in `Lane [3]`, starting with `[3.2A] Data Types And Sketch Foundation`
- [~] console and layered transcript follow-through in `Lane [4.1]`
- [~] workspace and shell evolution in `Lane [5.0]` and `[5.1]`

Still ahead:

- [ ] sketch operations, extrusion, lofting, and broader authoring hardening
- [ ] richer Browser/viewer controls and material/visibility tooling
- [ ] hybrid workspace hosting, build sequencing, publish/receive execution, and final legacy cleanup

For the full checklist, see `docs/Human-Plans/roadmap/roadmap.md`.

## Stack

- `React 19`
- `TypeScript`
- `Vite`
- `Zustand`
- `Three.js`
- `Vitest`
- `occt-import-js` for in-browser STEP import

## Getting Started

### Requirements

- `Node.js`
- `npm`

### Install

```bash
npm install
```

### Run Dev Server

```bash
npm run dev
```

### Build

```bash
npm run build
```

### Run Tests

```bash
npm run test
```

## Main Folders

- `src/app/` - app shell, panels, stores, browser UI, reference workflow, console, and Spaghetti editor
- `src/worker/` - build worker, pipeline stages, CAD/runtime build logic
- `src/viewer/` - Three.js viewer, camera, gizmos, rendering, and reference loading
- `src/shared/` - typed contracts shared across app, worker, and viewer boundaries
- `public/ReferenceModels/` - built-in reference assets used by the reference workspace
- `docs/` - architecture notes, changelog, roadmap, and task-phase planning

## Architecture In One Sentence

The app owns state, the worker computes build results, and the viewer renders the output.

If you want the fuller version, start with:

- `docs/Human-Plans/Architecture/Engine-Architecture.md`
- `docs/Doc-Index.md`

## Useful Commands

- `npm run dev` - start local development
- `npm run build` - type-check and create a production build
- `npm run test` - run the Vitest suite
- `npm run preview` - preview the built app locally

## Good Docs To Read First

- `docs/Human-Plans/Architecture/Engine-Architecture.md` - plain-English system overview
- `docs/Human-Plans/Architecture/System-Map.md` - broader architecture map
- `docs/CHANGELOG.md` - shipped work history
- `docs/Doc-Index.md` - where documentation lives and which files are canonical

## Notes

- This is an active work-in-progress project and the docs reflect that.
- The checked-in `public/ReferenceModels/` assets are part of the current reference workspace flow.
- There is no backend in this repo; the app runs as a front-end project with local build/worker execution.
