import type { BrowserRenderableRowVm } from './selectBrowserTreeRows'

export type BrowserRowFamilyId =
  | 'graph'
  | 'content'
  | 'reference'
  | 'sketch'
  | 'viewport'
  | 'utility'

export type BrowserRowFamilyAdapter = {
  familyId: BrowserRowFamilyId
  matchesRow: (row: BrowserRenderableRowVm) => boolean
  supportsContextMenu: boolean
  supportsDoubleSelect: boolean
  supportsExpandToggle: boolean
  supportsVisibilityToggle: boolean
}

export const browserRowFamilyAdapters: BrowserRowFamilyAdapter[] = [
  {
    familyId: 'reference',
    matchesRow: (row) =>
      row.rowKind === 'references-root' ||
      row.rowKind === 'reference-category' ||
      row.rowKind === 'reference-item' ||
      (row.rowKind === 'object' && row.contentOriginKind === 'source-reference'),
    supportsContextMenu: true,
    supportsDoubleSelect: false,
    supportsExpandToggle: true,
    supportsVisibilityToggle: true,
  },
  {
    familyId: 'content',
    matchesRow: (row) =>
      row.rowKind === 'assembly' || row.rowKind === 'component' || row.rowKind === 'object',
    supportsContextMenu: true,
    supportsDoubleSelect: true,
    supportsExpandToggle: true,
    supportsVisibilityToggle: true,
  },
  {
    familyId: 'graph',
    matchesRow: (row) =>
      row.rowKind === 'graph-document' ||
      row.rowKind === 'graph-section' ||
      row.rowKind === 'graph-rebuild-object' ||
      row.rowKind === 'graph-node',
    supportsContextMenu: true,
    supportsDoubleSelect: true,
    supportsExpandToggle: true,
    supportsVisibilityToggle: false,
  },
  {
    familyId: 'sketch',
    matchesRow: (row) => row.rowKind === 'sketches-root' || row.rowKind === 'sketch',
    supportsContextMenu: true,
    supportsDoubleSelect: true,
    supportsExpandToggle: true,
    supportsVisibilityToggle: true,
  },
  {
    familyId: 'viewport',
    matchesRow: (row) => row.rowKind === 'viewport',
    supportsContextMenu: true,
    supportsDoubleSelect: false,
    supportsExpandToggle: false,
    supportsVisibilityToggle: false,
  },
  {
    familyId: 'utility',
    matchesRow: () => true,
    supportsContextMenu: false,
    supportsDoubleSelect: false,
    supportsExpandToggle: false,
    supportsVisibilityToggle: false,
  },
]

export const getBrowserRowFamilyAdapter = (
  row: BrowserRenderableRowVm,
): BrowserRowFamilyAdapter =>
  browserRowFamilyAdapters.find((adapter) => adapter.matchesRow(row)) ?? browserRowFamilyAdapters.at(-1)!

export const describeBrowserRow = (row: BrowserRenderableRowVm): string => {
  switch (row.rowKind) {
    case 'reference-item':
      return `object ${row.label}`
    case 'part':
      return `part ${row.label}`
    case 'reference-category':
      return `component ${row.label}`
    case 'references-root':
      return `assembly ${row.label}`
    case 'sketches-root':
      return row.label
    case 'sketch':
      return `Sketch ${row.label}`
    case 'graph-document':
      return `Graph ${row.label}`
    case 'graph-node':
      return `Node ${row.label}`
    case 'graph-section':
      return `Graph section ${row.label}`
    case 'viewport':
      return `Viewport ${row.label}`
    case 'assembly':
    case 'component':
    case 'object':
      return `${row.rowKind} ${row.label}`
    default:
      return row.label
  }
}

export const isExplicitSelectionRow = (row: BrowserRenderableRowVm): boolean =>
  row.rowKind === 'references-root' ||
  row.rowKind === 'reference-category' ||
  row.rowKind === 'reference-item' ||
  row.rowKind === 'assembly' ||
  row.rowKind === 'component' ||
  row.rowKind === 'object'
