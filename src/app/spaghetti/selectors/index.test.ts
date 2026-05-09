import { describe, expect, it } from 'vitest'
import {
  selectActiveGraphDocument as graphDocumentFromBarrel,
  selectDiagnosticsVm as diagnosticsFromBarrel,
  selectDriverVm as driverFromBarrel,
  selectNodeVm as nodeFromBarrel,
  selectPreviewRenderVm as previewFromBarrel,
} from './index'
import { selectActiveGraphDocument } from './selectGraphDocumentRuntime'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'
import { selectDriverVm } from './selectDriverVm'
import { selectNodeVm } from './selectNodeVm'
import { selectPreviewRenderVm } from './selectPreviewRenderVm'

describe('selectors barrel contract', () => {
  it('re-exports hardened selector functions', () => {
    expect(graphDocumentFromBarrel).toBe(selectActiveGraphDocument)
    expect(nodeFromBarrel).toBe(selectNodeVm)
    expect(driverFromBarrel).toBe(selectDriverVm)
    expect(previewFromBarrel).toBe(selectPreviewRenderVm)
    expect(diagnosticsFromBarrel).toBe(selectDiagnosticsVm)
  })
})
