import type { RefObject } from 'react'
import {
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE,
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import type { StagedImportDraftState } from '../store/useAppStore'
import type { BrowserContextMenuItem } from './browserContextMenu'
import type { BrowserRenderableRowVm } from './selectBrowserTreeRows'

export type BrowserRowContextMenuState = {
  row: BrowserRenderableRowVm
  x: number
  y: number
  actions: BrowserContextMenuItem[]
  source: 'row'
}

export type BrowserImportMenuState = {
  x: number
  y: number
}

type BrowserRowContextMenuProps = {
  contextMenu: BrowserRowContextMenuState | null
  menuRef: RefObject<HTMLDivElement | null>
  style?: {
    left: string
    top: string
  }
}

export function BrowserRowContextMenu(props: BrowserRowContextMenuProps) {
  const { contextMenu, menuRef, style } = props

  if (contextMenu === null) {
    return null
  }

  return (
    <div
      ref={menuRef}
      className="BrowserTreeContextMenu"
      style={style}
      role="menu"
      aria-label={`${contextMenu.row.label} options`}
    >
      <div className="BrowserTreeContextMenuHeader">{contextMenu.row.label}</div>
      {contextMenu.actions.map((action) => (
        <button
          key={action.id}
          type="button"
          className="BrowserTreeContextMenuAction"
          onClick={action.onSelect}
          aria-label={action.ariaLabel}
          disabled={action.disabled === true}
          role="menuitem"
        >
          {action.label}
        </button>
      ))}
    </div>
  )
}

type BrowserImportMenuProps = {
  importMenu: BrowserImportMenuState | null
  menuRef: RefObject<HTMLDivElement | null>
  onOpenImportFiles: () => void
  onImportReferenceFile: (fileType: ReferenceFileType) => void
  style?: {
    left: string
    top: string
  }
}

export function BrowserImportMenu(props: BrowserImportMenuProps) {
  const { importMenu, menuRef, onOpenImportFiles, onImportReferenceFile, style } = props

  if (importMenu === null) {
    return null
  }

  return (
    <div
      ref={menuRef}
      className="BrowserTreeContextMenu"
      style={style}
      role="menu"
      aria-label="Import reference options"
    >
      <div className="BrowserTreeContextMenuHeader">Import Reference</div>
      <button
        type="button"
        className="BrowserTreeContextMenuAction"
        onClick={onOpenImportFiles}
        role="menuitem"
      >
        Import Files...
      </button>
      {(['step', 'stl', 'obj', 'glb'] as const).map((fileType) => (
        <button
          key={fileType}
          type="button"
          className="BrowserTreeContextMenuAction"
          onClick={() => onImportReferenceFile(fileType)}
          role="menuitem"
        >
          {REFERENCE_IMPORT_LABEL_BY_FILE_TYPE[fileType]}
        </button>
      ))}
    </div>
  )
}

type BrowserImportDialogProps = {
  draft: StagedImportDraftState | null
  isBrowsing: boolean
  onBrowse: () => void
  onClose: () => void
}

const resolveStagedImportFileTypeLabel = (fileType: ReferenceFileType): string =>
  `.${fileType.toUpperCase()}`

const resolveImportDialogTargetLabel = (draft: StagedImportDraftState): string => {
  if (draft.parentComponentId !== null) {
    return 'Selected component'
  }
  if (draft.parentAssemblyId !== null) {
    return 'Selected assembly'
  }
  return 'Current content root'
}

export function BrowserImportDialog(props: BrowserImportDialogProps) {
  const { draft, isBrowsing, onBrowse, onClose } = props

  if (draft === null) {
    return null
  }

  const stagedFileCount = draft.stagedFiles.length
  const stagedFileCountLabel =
    stagedFileCount === 1 ? '1 file staged in draft' : `${stagedFileCount} files staged in draft`

  return (
    <div className="BrowserImportDialogBackdrop">
      <section
        className="BrowserImportDialog"
        role="dialog"
        aria-modal="true"
        aria-label="Import Files"
      >
        <div className="BrowserImportDialogHeader">
          <div>
            <div className="BrowserImportDialogEyebrow">Staged Import</div>
            <h3 className="BrowserImportDialogTitle">Import Files</h3>
          </div>
          <button
            type="button"
            className="BrowserImportDialogClose"
            onClick={onClose}
            aria-label="Close Import Files"
          >
            x
          </button>
        </div>
        <div className="BrowserImportDialogBody">
          <p className="BrowserImportDialogCopy">
            Add supported local reference files into the staged import draft, then review the selected
            files here before later structure and import-setting phases.
          </p>
          <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked">
            <span className="BrowserImportDialogMetaLabel">Supported file types</span>
            <div className="BrowserImportDialogTypeList" aria-label="Supported import file types">
              {SUPPORTED_REFERENCE_IMPORT_FILE_TYPES.map((fileType) => (
                <span key={fileType} className="BrowserImportDialogTypeChip">
                  .{fileType}
                </span>
              ))}
            </div>
          </div>
          <div className="BrowserImportDialogBrowserRow">
            <div className="BrowserImportDialogBrowserRowCopy">
              <span className="BrowserImportDialogMetaLabel">Browser</span>
              <span className="BrowserImportDialogBrowserRowHint">
              {stagedFileCountLabel}
            </span>
          </div>
          <button
            type="button"
              className="BrowserImportDialogBrowseButton"
              onClick={onBrowse}
              disabled={isBrowsing}
              aria-label="Browser"
            >
              {isBrowsing ? 'Browsing...' : 'Browser'}
            </button>
          </div>
          <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked">
            <span className="BrowserImportDialogMetaLabel">Staged files</span>
            {draft.stagedFiles.length === 0 ? (
              <div className="BrowserImportDialogEmptyState">
                No files staged yet. Use Browser to add supported files into this review list.
              </div>
            ) : (
              <ol className="BrowserImportDialogStagedList" aria-label="Staged import files">
                {draft.stagedFiles.map((file, index) => (
                  <li key={file.stagedFileId} className="BrowserImportDialogStagedRow">
                    <div className="BrowserImportDialogStagedRowMain">
                      <span className="BrowserImportDialogStagedRowOrder">{index + 1}</span>
                      <div className="BrowserImportDialogStagedRowText">
                        <span className="BrowserImportDialogStagedRowName">{file.fileName}</span>
                        <span className="BrowserImportDialogStagedRowHint">
                          Review order {index + 1}
                        </span>
                      </div>
                    </div>
                    <span className="BrowserImportDialogStagedRowType">
                      {resolveStagedImportFileTypeLabel(file.fileType)}
                    </span>
                  </li>
                ))}
              </ol>
            )}
          </div>
          <div className="BrowserImportDialogMeta">
            <span className="BrowserImportDialogMetaLabel">Landing target</span>
            <span className="BrowserImportDialogMetaValue">
              {resolveImportDialogTargetLabel(draft)}
            </span>
          </div>
        </div>
        <div className="BrowserImportDialogActions">
          <button
            type="button"
            className="BrowserImportDialogAction"
            onClick={onClose}
          >
            Cancel
          </button>
        </div>
      </section>
    </div>
  )
}
