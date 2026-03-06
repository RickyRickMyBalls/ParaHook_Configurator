import { describe, expect, it } from 'vitest'
import {
  selectDiagnosticsVm as diagnosticsFromBarrel,
  selectDriverVm as driverFromBarrel,
  selectNodeVm as nodeFromBarrel,
  selectPartsListPanelVm as partsPanelFromBarrel,
  selectPreviewRenderVm as previewFromBarrel,
} from './index'
import { selectDiagnosticsVm } from './selectDiagnosticsVm'
import { selectDriverVm } from './selectDriverVm'
import { selectNodeVm } from './selectNodeVm'
import { selectPreviewRenderVm } from './selectPreviewRenderVm'
import { selectPartsListPanelVm } from '../partsList/selectPartsListItems'

describe('selectors barrel contract', () => {
  it('re-exports hardened selector functions', () => {
    expect(nodeFromBarrel).toBe(selectNodeVm)
    expect(driverFromBarrel).toBe(selectDriverVm)
    expect(previewFromBarrel).toBe(selectPreviewRenderVm)
    expect(diagnosticsFromBarrel).toBe(selectDiagnosticsVm)
    expect(partsPanelFromBarrel).toBe(selectPartsListPanelVm)
  })
})
