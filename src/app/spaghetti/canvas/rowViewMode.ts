export type RowViewMode = 'collapsed' | 'essentials' | 'everything'

export type RowViewFlags = {
  showEditors: boolean
  showDebugInfo: boolean
  renderLeafRows: boolean
  forceLeafRows: boolean
}

export const getRowViewFlags = (mode: RowViewMode): RowViewFlags => {
  if (mode === 'collapsed') {
    return {
      showEditors: true,
      showDebugInfo: false,
      renderLeafRows: false,
      forceLeafRows: false,
    }
  }

  if (mode === 'everything') {
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
