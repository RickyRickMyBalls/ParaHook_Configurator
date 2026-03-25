import type { RefObject } from 'react'
import {
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
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
  onImportReferenceFile: (fileType: ReferenceFileType) => void
  style?: {
    left: string
    top: string
  }
}

export function BrowserImportMenu(props: BrowserImportMenuProps) {
  const { importMenu, menuRef, onImportReferenceFile, style } = props

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
