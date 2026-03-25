import type { ReferenceCategoryId } from '../references/referenceManifest'
import type { BrowserBuildPolicy } from '../store/useAppStore'
import { describeBrowserRow } from './browserRowFamilies'
import type { BrowserRenderableRowVm, BrowserTreeRowActionVm } from './selectBrowserTreeRows'

export type BrowserContextMenuItem = {
  id: string
  label: string
  ariaLabel: string
  disabled?: boolean
  onSelect: () => void
}

export type BrowserContextMenuBuilderDeps = {
  handleRowAction: (row: BrowserRenderableRowVm, action: BrowserTreeRowActionVm) => void
  closeMenus: () => void
  selectRow: (rowId: string) => void
  appendBrowserEntry: (text: string) => void
  startReferenceLoadBatchForAll: () => void
  startReferenceLoadBatchForCategory: (categoryId: ReferenceCategoryId) => void
  retryReferenceItemLoad: (referenceId: string) => void
  setReferenceItemVisibility: (referenceId: string, isVisible: boolean) => void
  handleRetryImportedReferenceRow: (referenceId: string) => void
  handleRemoveImportedReferenceRow: (referenceId: string) => void
  setBrowserGraphBuildPolicy: (graphDocumentId: string, policy: BrowserBuildPolicy) => void
  setBrowserContentBuildPolicy: (rowId: string, policy: BrowserBuildPolicy) => void
  clearBrowserGraphBuildPolicy: (graphDocumentId: string) => void
  clearBrowserContentBuildPolicy: (rowId: string) => void
}

export const buildBrowserContextMenuItems = (
  row: BrowserRenderableRowVm,
  deps: BrowserContextMenuBuilderDeps,
): BrowserContextMenuItem[] => {
  const items: BrowserContextMenuItem[] = row.actions.map((action) => ({
    id: `row-action:${action.actionId}`,
    label: action.label,
    ariaLabel: action.ariaLabel,
    disabled: action.disabled,
    onSelect: () => deps.handleRowAction(row, action),
  }))

  if (row.rowKind === 'references-root') {
    items.unshift({
      id: 'references-root:load-all',
      label: 'Load All',
      ariaLabel: 'Load all references',
      onSelect: () => {
        deps.closeMenus()
        deps.selectRow(row.rowId)
        deps.appendBrowserEntry('Load All: References')
        deps.startReferenceLoadBatchForAll()
      },
    })
  }

  if (row.rowKind === 'reference-category') {
    items.unshift({
      id: `reference-category:${row.categoryId}:load-all`,
      label: 'Load All',
      ariaLabel: `Load all references in ${row.label}`,
      onSelect: () => {
        deps.closeMenus()
        deps.selectRow(row.rowId)
        deps.appendBrowserEntry(`Load All: ${row.label}`)
        deps.startReferenceLoadBatchForCategory(row.categoryId)
      },
    })
  }

  if (row.rowKind === 'reference-item' && !row.isVisible && row.state !== 'error') {
    items.unshift({
      id: 'reference-item:load-model',
      label: 'Load Model',
      ariaLabel: `Load model for ${row.label}`,
      onSelect: () => {
        deps.closeMenus()
        deps.selectRow(`reference-item-row:${row.referenceId}`)
        deps.appendBrowserEntry(`Load Model: ${row.label}`)
        if (!row.isVisible) {
          deps.retryReferenceItemLoad(row.referenceId)
          return
        }
        deps.setReferenceItemVisibility(row.referenceId, true)
      },
    })
  }

  if (row.rowKind === 'reference-item' && row.sourceKind === 'imported') {
    if (row.state === 'error') {
      items.push({
        id: 'reference-item:retry',
        label: 'Retry',
        ariaLabel: `Retry ${row.label}`,
        onSelect: () => deps.handleRetryImportedReferenceRow(row.referenceId),
      })
    }
    items.push({
      id: 'reference-item:remove',
      label: 'Remove',
      ariaLabel: `Remove ${row.label}`,
      onSelect: () => deps.handleRemoveImportedReferenceRow(row.referenceId),
    })
  }

  const policySource = row.effectiveBrowserBuildPolicySource
  const effectivePolicy = row.effectiveBrowserBuildPolicy
  const authoredPolicy = row.authoredBrowserBuildPolicy ?? null
  const isBuildPolicyRow =
    row.rowKind === 'graph-document' ||
    row.rowKind === 'assembly' ||
    row.rowKind === 'component' ||
    row.rowKind === 'object'

  if (!isBuildPolicyRow || effectivePolicy === undefined || policySource === undefined) {
    return items
  }

  if (policySource === 'graph' || policySource === 'assembly' || policySource === 'component') {
    items.unshift({
      id: 'browser-policy:make-independent',
      label: 'Make Independent',
      ariaLabel: `Make ${row.label} independent from parent build policy`,
      onSelect: () => {
        deps.closeMenus()
        deps.appendBrowserEntry(`Make Independent: ${describeBrowserRow(row)}`)
        if (row.rowKind === 'graph-document') {
          deps.setBrowserGraphBuildPolicy(row.graphDocumentId, effectivePolicy)
          return
        }
        deps.setBrowserContentBuildPolicy(row.rowId, effectivePolicy)
      },
    })
    return items
  }

  if (authoredPolicy !== null) {
    items.unshift({
      id: 'browser-policy:return-to-parent',
      label:
        row.rowKind === 'graph-document' || row.rowKind === 'assembly'
          ? 'Return To Default'
          : 'Return To Parent',
      ariaLabel:
        row.rowKind === 'graph-document' || row.rowKind === 'assembly'
          ? `Return ${row.label} to default build policy`
          : `Return ${row.label} to parent build policy`,
      onSelect: () => {
        deps.closeMenus()
        deps.appendBrowserEntry(
          row.rowKind === 'graph-document' || row.rowKind === 'assembly'
            ? `Return To Default: ${describeBrowserRow(row)}`
            : `Return To Parent: ${describeBrowserRow(row)}`,
        )
        if (row.rowKind === 'graph-document') {
          deps.clearBrowserGraphBuildPolicy(row.graphDocumentId)
          return
        }
        deps.clearBrowserContentBuildPolicy(row.rowId)
      },
    })
  }

  return items
}
