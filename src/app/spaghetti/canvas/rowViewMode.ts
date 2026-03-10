import type { NodeRowMode } from '../schema/spaghettiTypes'

export type ViewMode = NodeRowMode

export type RowViewFlags = {
  showEditors: boolean
  showDebugInfo: boolean
  renderLeafRows: boolean
  forceLeafRows: boolean
}

export const getRowViewFlags = (mode: ViewMode): RowViewFlags => {
  if (mode === 'collapsed') {
    return {
      showEditors: true,
      showDebugInfo: false,
      renderLeafRows: false,
      forceLeafRows: false,
    }
  }

  if (mode === 'expanded') {
    return {
      showEditors: true,
      showDebugInfo: true,
      renderLeafRows: true,
      forceLeafRows: true,
    }
  }

  return {
    showEditors: true,
    showDebugInfo: false,
    renderLeafRows: true,
    forceLeafRows: false,
  }
}

export const getNextViewMode = (mode: ViewMode): ViewMode => {
  if (mode === 'collapsed') {
    return 'essentials'
  }
  if (mode === 'essentials') {
    return 'expanded'
  }
  return 'collapsed'
}
