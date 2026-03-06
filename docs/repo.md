# ParaHook Repo Core Stack (Hierarchical Snapshot)

Snapshot date: 2026-03-04

## Core Stack
1. Frontend application
   - React 19
   - React DOM 19
   - TypeScript 5
   - Vite 7 with `@vitejs/plugin-react`
2. State and validation
   - Zustand (UI/app state)
   - Zod (schema and runtime validation)
3. 3D viewer
   - Three.js (`src/viewer`)
4. Build and CAD runtime
   - Worker runtime (`src/worker`)
   - CAD runtime bridge (`src/worker/cad`)
   - Geometry kernel helpers (`src/geometry`)
5. Shared contracts
   - Shared build/product/export/view types (`src/shared`)
6. Testing and code quality
   - Vitest 3
   - ESLint 9 + `typescript-eslint`
7. Toolchain
   - Node.js + npm

## Repository Hierarchy (Core)

```text
parahook/
|-- .github/
|   `-- workflows/
|-- docs/
|   |-- plans/
|   |-- tasks/
|   `-- repo.md
|-- public/
|-- src/
|   |-- app/
|   |   |-- components/
|   |   |-- panels/
|   |   |-- spaghetti/
|   |   |-- store/
|   |   `-- theme/
|   |-- viewer/
|   |   |-- controlViz/
|   |   |-- gizmo/
|   |   |-- materials/
|   |   |-- overlay/
|   |   |-- renderers/
|   |   `-- scene/
|   |-- worker/
|   |   |-- cad/
|   |   |-- oc/
|   |   |-- pipeline/
|   |   `-- products/
|   |-- geometry/
|   |-- runtime/
|   |   `-- audio/
|   `-- shared/
|-- CHANGELOG.md
|-- package.json
|-- tsconfig.json
|-- tsconfig.app.json
|-- tsconfig.node.json
|-- vite.config.ts
`-- eslint.config.js
```

## Layer Flow (Runtime)

`src/app` -> worker dispatch -> `src/worker` + `src/geometry` -> typed results (`src/shared`) -> rendered output (`src/viewer`)
