# 16 - Vite Build Path Crypto Externalization Warning

## Doc History
1. 2026-04-09 08:00:22: Created this bug note to track the production-build warning where Vite externalizes Node built-ins `path` and `crypto` while bundling `occt-import-js`, even though the browser build still completes successfully

## Doc Body

### Status

- `[investigating]`

### Summary

`npm run build` currently succeeds, but the build output still reports:

- `Module "path" has been externalized for browser compatibility`
- `Module "crypto" has been externalized for browser compatibility`

The warning points at `node_modules/occt-import-js/dist/occt-import-js.js`.

This does not currently stop the build, but it weakens trust in the browser bundle and leaves an unclear dependency seam around whether the app is relying on a package that still exposes Node-only branches during client bundling.

### User-Facing Symptom

- running `npm run build` in the app root completes successfully
- Vite prints browser-compatibility warnings about `path` and `crypto`
- the warning looks like a build error at first glance even though the build finishes
- it is easy to misread this as the app directly importing Node modules into browser code

### Confirmed Current Behavior

- the real app root is `parahook/`
- running `npm run build` from the parent folder fails earlier because there is no `package.json` there
- running `npm run build` from `parahook/` completes successfully
- the warning originates from `occt-import-js`, not from first-party app code
- the live import path is `src/viewer/stepReferenceLoader.ts`

### Strongest Current Likely Cause

`occt-import-js` is an Emscripten-generated package that ships one bundle containing both:

- a Node execution branch that references `require("path")` and `require("crypto")`
- a browser execution branch that uses browser APIs instead

Vite statically sees those Node built-ins during dependency analysis and externalizes them for browser compatibility, then warns about it during build.

That means the current problem is likely not "the browser is truly executing Node code."
It is more likely:

- a packaging/bundling seam in the dependency
- plus a noisy Vite warning caused by mixed-environment code inside the published bundle

### Likely Ownership

- build tooling
- reference import / STEP loader path
- third-party dependency integration

### Likely Files

- `src/viewer/stepReferenceLoader.ts`
- `src/types/occt-import-js.d.ts`
- `vite.config.*` if we choose to suppress or route around the warning
- `node_modules/occt-import-js/dist/occt-import-js.js` as the current upstream warning source

### Impact

- low immediate runtime risk if the browser branch is the only branch actually executed
- medium maintenance risk because the warning obscures real build failures
- medium integration risk because future Vite or dependency changes could tighten this into a harder failure

### Questions To Resolve

1. Is the browser runtime fully safe today, or are we depending on Vite externalization behavior as an implicit compatibility layer?
2. Should `occt-import-js` be lazy-loaded or isolated in a worker-only path so the main browser bundle does not inspect the mixed Node/browser wrapper the same way?
3. Is there a cleaner browser-first entry point or package version for `occt-import-js` that avoids Node built-ins in the distributed JS wrapper?
4. Do we want to explicitly document this as an accepted warning for now, or invest in removing it so build logs stay trustworthy?

### Repro

1. Open the repo root at `parahook/`.
2. Run `npm run build`.
3. Observe that TypeScript and Vite finish successfully.
4. Observe that Vite still warns that `path` and `crypto` were externalized for browser compatibility from `occt-import-js`.

### Definition Of Done

- either the warning no longer appears during `npm run build`
- or we explicitly document and isolate the dependency seam so the warning is understood, intentional, and not confused with a real app build failure
