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
  createAssembly?: () => void
  createComponent?: (assemblyId: string) => void
  renameContentOwner?: (
    target:
      | { kind: 'assembly'; assemblyId: string }
      | { kind: 'component'; componentId: string },
  ) => void
  deleteContentOwner?: (
    target:
      | { kind: 'assembly'; assemblyId: string }
      | { kind: 'component'; componentId: string },
  ) => void
  canDeleteAssembly?: (assemblyId: string) => boolean
  canRenameComponent?: (componentId: string) => boolean
  canDeleteComponent?: (componentId: string) => boolean
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
  const referenceContainerRootRow =
    row.rowKind === 'assembly' && row.rowId === 'reference-root' ? row : null
  const referenceContainerCategoryRow =
    row.rowKind === 'component' && row.referenceCategoryId != null ? row : null
  const referenceBackedObjectRow =
    row.rowKind === 'object' &&
    (row.contentOriginKind === 'imported-reference' || row.contentOriginKind === 'source-reference') &&
    row.referenceId
      ? row
      : null
  const importedContentObjectRow =
    referenceBackedObjectRow?.contentOriginKind === 'imported-reference' ? referenceBackedObjectRow : null
  const sourceReferenceObjectRow =
    referenceBackedObjectRow?.contentOriginKind === 'source-reference' ? referenceBackedObjectRow : null
  const items: BrowserContextMenuItem[] = row.actions.map((action) => ({
    id: `row-action:${action.actionId}`,
    label: action.label,
    ariaLabel: action.ariaLabel,
    disabled: action.disabled,
    onSelect: () => deps.handleRowAction(row, action),
  }))

  if (row.rowKind === 'assembly') {
    const assemblyItems: BrowserContextMenuItem[] = []
    if (referenceContainerRootRow === null && deps.renameContentOwner !== undefined) {
      const renameContentOwner = deps.renameContentOwner
      assemblyItems.push({
        id: `assembly:${row.rowId}:rename`,
        label: 'Rename',
        ariaLabel: `Rename ${row.label}`,
        onSelect: () => renameContentOwner({ kind: 'assembly', assemblyId: row.rowId }),
      })
    }
    if (referenceContainerRootRow === null && deps.createComponent !== undefined) {
      const createComponent = deps.createComponent
      assemblyItems.push({
        id: `assembly:${row.rowId}:new-component`,
        label: 'New Component',
        ariaLabel: `Create a component under ${row.label}`,
        onSelect: () => createComponent(row.rowId),
      })
    }
    if (referenceContainerRootRow === null && deps.createAssembly !== undefined) {
      const createAssembly = deps.createAssembly
      assemblyItems.push({
        id: `assembly:${row.rowId}:new-assembly`,
        label: 'New Assembly',
        ariaLabel: 'Create a new assembly',
        onSelect: () => createAssembly(),
      })
    }
    if (assemblyItems.length > 0) {
      items.unshift(...assemblyItems)
    }
    if (
      referenceContainerRootRow === null &&
      deps.deleteContentOwner !== undefined &&
      deps.canDeleteAssembly?.(row.rowId) === true
    ) {
      const deleteContentOwner = deps.deleteContentOwner
      items.push({
        id: `assembly:${row.rowId}:delete`,
        label: 'Delete',
        ariaLabel: `Delete ${row.label}`,
        onSelect: () => deleteContentOwner({ kind: 'assembly', assemblyId: row.rowId }),
      })
    }
  }

  if (
    row.rowKind === 'component' &&
    referenceContainerCategoryRow === null &&
    deps.renameContentOwner !== undefined &&
    deps.canRenameComponent?.(row.rowId) === true
  ) {
    const renameContentOwner = deps.renameContentOwner
    items.unshift({
      id: `component:${row.rowId}:rename`,
      label: 'Rename',
      ariaLabel: `Rename ${row.label}`,
      onSelect: () => renameContentOwner({ kind: 'component', componentId: row.rowId }),
    })
    if (deps.deleteContentOwner !== undefined && deps.canDeleteComponent?.(row.rowId) === true) {
      const deleteContentOwner = deps.deleteContentOwner
      items.push({
        id: `component:${row.rowId}:delete`,
        label: 'Delete',
        ariaLabel: `Delete ${row.label}`,
        onSelect: () => deleteContentOwner({ kind: 'component', componentId: row.rowId }),
      })
    }
  }

  if (referenceContainerRootRow !== null) {
    const loadAllRow = referenceContainerRootRow ?? row
    items.unshift({
      id: 'references-root:load-all',
      label: 'Load All',
      ariaLabel: 'Load all references',
      onSelect: () => {
        deps.closeMenus()
        deps.selectRow(loadAllRow.rowId)
        deps.appendBrowserEntry('Load All: References')
        deps.startReferenceLoadBatchForAll()
      },
    })
  }

  if (referenceContainerCategoryRow !== null) {
    const categoryRow = referenceContainerCategoryRow
    const categoryId = categoryRow.referenceCategoryId
    if (categoryRow !== null && categoryId !== null && categoryId !== undefined) {
      items.unshift({
        id: `reference-category:${categoryId}:load-all`,
        label: 'Load All',
        ariaLabel: `Load all references in ${categoryRow.label}`,
        onSelect: () => {
          deps.closeMenus()
          deps.selectRow(categoryRow.rowId)
          deps.appendBrowserEntry(`Load All: ${categoryRow.label}`)
          deps.startReferenceLoadBatchForCategory(categoryId)
        },
      })
    }
  }

  if (
    (row.rowKind === 'reference-item' && !row.isVisible && row.state !== 'error') ||
    (referenceBackedObjectRow !== null &&
      !referenceBackedObjectRow.isVisible &&
      referenceBackedObjectRow.referenceState !== 'error')
  ) {
    const referenceId =
      row.rowKind === 'reference-item'
        ? row.referenceId
        : referenceBackedObjectRow?.referenceId ?? ''
    const isVisible =
      row.rowKind === 'reference-item'
        ? row.isVisible
        : referenceBackedObjectRow?.isVisible ?? false
    items.unshift({
      id:
        importedContentObjectRow !== null
          ? 'imported-object:load-model'
          : sourceReferenceObjectRow !== null
            ? 'reference-object:load-model'
            : 'reference-item:load-model',
      label: 'Load Model',
      ariaLabel: `Load model for ${row.label}`,
      onSelect: () => {
        deps.closeMenus()
        deps.selectRow(row.rowId)
        deps.appendBrowserEntry(`Load Model: ${row.label}`)
        if (!isVisible) {
          deps.retryReferenceItemLoad(referenceId)
          return
        }
        deps.setReferenceItemVisibility(referenceId, true)
      },
    })
  }

  if (
    (row.rowKind === 'reference-item' && row.sourceKind === 'imported') ||
    importedContentObjectRow !== null ||
    sourceReferenceObjectRow?.referenceSourceKind === 'imported'
  ) {
    const referenceId =
      row.rowKind === 'reference-item'
        ? row.referenceId
        : referenceBackedObjectRow?.referenceId ?? ''
    const isError =
      row.rowKind === 'reference-item'
        ? row.state === 'error'
        : referenceBackedObjectRow?.referenceState === 'error'
    if (isError) {
      items.push({
        id:
          importedContentObjectRow !== null
            ? 'imported-object:retry'
            : sourceReferenceObjectRow !== null
              ? 'reference-object:retry'
              : 'reference-item:retry',
        label: 'Retry',
        ariaLabel: `Retry ${row.label}`,
        onSelect: () => deps.handleRetryImportedReferenceRow(referenceId),
      })
    }
    items.push({
      id:
        importedContentObjectRow !== null
          ? 'imported-object:remove'
          : sourceReferenceObjectRow !== null
            ? 'reference-object:remove'
            : 'reference-item:remove',
      label: 'Remove',
      ariaLabel: `Remove ${row.label}`,
      onSelect: () => deps.handleRemoveImportedReferenceRow(referenceId),
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
