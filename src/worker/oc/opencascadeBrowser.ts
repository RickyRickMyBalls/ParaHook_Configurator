import opencascade from 'opencascade.js/dist/opencascade.wasm.js'
import opencascadeWasmUrl from 'opencascade.js/dist/opencascade.wasm.wasm?url'
import type { OpenCascadeInstance } from './opencascadeTypes'

type OpenCascadeBootstrapOptions = {
  locateFile?: (path: string) => string
}

type OpenCascadeBootstrap = new (
  options?: OpenCascadeBootstrapOptions,
) => Promise<OpenCascadeInstance>

const OpenCascadeBootstrap = opencascade as unknown as OpenCascadeBootstrap

export const initOpenCascade = (): Promise<OpenCascadeInstance> =>
  new OpenCascadeBootstrap({
    locateFile: (path) => (path.endsWith('.wasm') ? opencascadeWasmUrl : path),
  })
