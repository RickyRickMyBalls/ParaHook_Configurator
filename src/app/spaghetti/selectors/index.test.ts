import { describe, expect, it } from 'vitest'
import {
  selectDiagnosticsVm as diagnosticsFromBarrel,
  selectDriverVm as driverFromBarrel,
  selectNodeVm as nodeFromBarrel,
  selectPreviewRenderVm as previewFromBarrel,
} from './index'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'
import { selectDriverVm } from './selectDriverVm'
import { selectNodeVm } from './selectNodeVm'
import { selectPreviewRenderVm } from './selectPreviewRenderVm'

describe('selectors barrel contract', () => {
  it('re-exports hardened selector functions', () => {
    expect(nodeFromBarrel).toBe(selectNodeVm)
    expect(driverFromBarrel).toBe(selectDriverVm)
    expect(previewFromBarrel).toBe(selectPreviewRenderVm)
    expect(diagnosticsFromBarrel).toBe(selectDiagnosticsVm)
  })
})
