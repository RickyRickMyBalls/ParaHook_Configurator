import type { PointerEvent as ReactPointerEvent, ReactNode, RefObject } from 'react'
import {
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE,
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import { canStagedImportFileUseMultipleObjects } from '../store/useAppStore'
import type {
  StagedImportDraftFileRecord,
  StagedImportMode,
  StagedImportScaleAlignment,
  StagedImportUpAxis,
  StagedImportDraftState,
} from '../store/useAppStore'
import type { BrowserContextMenuItem } from './browserContextMenu'
import type { StagedImportPreviewRowVm } from './selectStagedImportPreviewRows'
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
  previewRows: StagedImportPreviewRowVm[]
  isBrowsing: boolean
  onBrowse: () => void
  onSetImportMode: (stagedFileId: string, importMode: StagedImportMode) => void
  onSetUpAxis: (stagedFileId: string, upAxis: StagedImportUpAxis) => void
  onSetScaleAlignment: (
    stagedFileId: string,
    scaleAlignment: StagedImportScaleAlignment,
  ) => void
  onSetPutAcceptedInNewAssembly: (enabled: boolean) => void
  onCreatePreviewAssembly: () => void
  onCreatePreviewComponent: (assemblyId: string) => void
  registerPreviewRowElement: (rowId: string) => (element: HTMLDivElement | null) => void
  onPreviewRowPointerDown: (
    row: StagedImportPreviewRowVm,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void
  getPreviewRowDragState: (row: StagedImportPreviewRowVm) => {
    draggable: boolean
    isDragging: boolean
    isPendingDrag: boolean
    dropIntent: 'none' | 'before' | 'after' | 'into' | 'invalid'
    isDropOwnerSupport: boolean
  }
  onCommit: () => void
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

const resolveStagedImportModeLabel = (importMode: StagedImportMode): string =>
  importMode === 'single-object' ? '1 Object' : 'Multiple Objects In 1 Component'

const resolveStagedImportUpAxisLabel = (upAxis: StagedImportUpAxis): string =>
  upAxis === 'z-up' ? 'Z Up' : upAxis === 'y-up' ? 'Y Up' : 'X Up'

const resolveStagedImportScaleAlignmentLabel = (
  scaleAlignment: StagedImportScaleAlignment,
): string =>
  scaleAlignment === 'current-size'
    ? 'Current'
    : scaleAlignment === 'millimeters'
      ? 'mm'
      : scaleAlignment === 'centimeters'
        ? 'cm'
        : scaleAlignment === 'meters'
          ? 'm'
          : 'in'

const resolvePreviewRowIconLabel = (row: StagedImportPreviewRowVm): string =>
  row.rowKind === 'assembly' ? 'A' : row.rowKind === 'component' ? 'C' : 'O'

function BrowserImportPreviewTree(props: {
  rows: StagedImportPreviewRowVm[]
  onCreatePreviewAssembly: () => void
  onCreatePreviewComponent: (assemblyId: string) => void
  registerPreviewRowElement: (rowId: string) => (element: HTMLDivElement | null) => void
  onPreviewRowPointerDown: (
    row: StagedImportPreviewRowVm,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void
  getPreviewRowDragState: (row: StagedImportPreviewRowVm) => {
    draggable: boolean
    isDragging: boolean
    isPendingDrag: boolean
    dropIntent: 'none' | 'before' | 'after' | 'into' | 'invalid'
    isDropOwnerSupport: boolean
  }
}) {
  const {
    rows,
    onCreatePreviewAssembly,
    onCreatePreviewComponent,
    registerPreviewRowElement,
    onPreviewRowPointerDown,
    getPreviewRowDragState,
  } = props

  return (
    <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked">
      <div className="BrowserImportDialogPreviewHeader">
        <div className="BrowserImportDialogPreviewHeaderCopy">
          <span className="BrowserImportDialogMetaLabel">Preview Browser</span>
          <span className="BrowserImportDialogPreviewHint">
            Preview only. Organize staged rows into components or assemblies before acceptance.
          </span>
        </div>
        <button
          type="button"
          className="BrowserTreeSummaryAction BrowserImportDialogPreviewAction"
          onClick={onCreatePreviewAssembly}
          aria-label="New preview assembly"
          title="New preview assembly"
        >
          +A
        </button>
      </div>
      {rows.length === 0 ? (
        <div className="BrowserImportDialogEmptyState">
          Stage files to build a preview Browser organization surface.
        </div>
      ) : (
        <div
          className="BrowserImportDialogPreviewTree"
          role="tree"
          aria-label="Staged import preview browser"
        >
          {rows.map((row) => {
            const dragState = getPreviewRowDragState(row)
            const rowClassName = [
              'BrowserTreeRow',
              `BrowserTreeRow--${row.rowKind}`,
              `BrowserTreeRow--depth-${row.depth}`,
              dragState.draggable ? 'isDraggable' : '',
              dragState.isDragging ? 'isDragging' : '',
              dragState.isPendingDrag ? 'isPendingDrag' : '',
              dragState.dropIntent === 'before' ? 'isDropTargetBefore' : '',
              dragState.dropIntent === 'after' ? 'isDropTargetAfter' : '',
              dragState.dropIntent === 'into' ? 'isDropTargetInto' : '',
              dragState.dropIntent === 'invalid' ? 'isDropTargetInvalid' : '',
              dragState.isDropOwnerSupport ? 'isDropOwnerSupport' : '',
              !row.isExpandable ? 'isLeaf' : '',
            ]
              .filter((value) => value.length > 0)
              .join(' ')

            return (
              <div
                key={row.rowId}
                ref={registerPreviewRowElement(row.rowId)}
                className={rowClassName}
              >
                <div className="BrowserTreeRowLead">
                  <span
                    className="BrowserImportDialogPreviewIndent"
                    aria-hidden="true"
                    style={{ width: `${row.depth * 16}px` }}
                  />
                  <span className="BrowserTreeRowExpand BrowserTreeRowExpand--placeholder" aria-hidden="true">
                    .
                  </span>
                  <span className="BrowserTreeRowIcon" aria-hidden="true">
                    {resolvePreviewRowIconLabel(row)}
                  </span>
                </div>
                <button
                  type="button"
                  className="BrowserTreeRowMain isContentRow"
                  onPointerDown={(event) => onPreviewRowPointerDown(row, event)}
                  aria-label={row.label}
                >
                  <div className="BrowserTreeRowSurface BrowserContentStateBar BrowserContentStateBar--done">
                    <span className="BrowserTreeRowText">
                      <span className="BrowserTreeRowLabel">{row.label}</span>
                      {row.meta.length > 0 ? (
                        <span className="BrowserTreeRowMeta">{row.meta}</span>
                      ) : null}
                    </span>
                  </div>
                </button>
                {row.canCreateComponent ? (
                  <button
                    type="button"
                    className="BrowserTreeSummaryAction BrowserImportDialogPreviewRowAction"
                    onClick={() => onCreatePreviewComponent(row.rowId)}
                    aria-label={`Add component to ${row.label}`}
                    title={`Add component to ${row.label}`}
                  >
                    +C
                  </button>
                ) : (
                  <span className="BrowserImportDialogPreviewRowActionPlaceholder" aria-hidden="true" />
                )}
              </div>
            )
          })}
        </div>
      )}
    </div>
  )
}

const renderStagedImportStructureSummary = (
  file: StagedImportDraftFileRecord,
  onSetImportMode: (stagedFileId: string, importMode: StagedImportMode) => void,
  onSetUpAxis: (stagedFileId: string, upAxis: StagedImportUpAxis) => void,
  onSetScaleAlignment: (
    stagedFileId: string,
    scaleAlignment: StagedImportScaleAlignment,
  ) => void,
) => {
  const inspection = file.structureInspection
  const selectedUpAxis = file.upAxis ?? 'z-up'
  const selectedScaleAlignment = file.scaleAlignment ?? 'current-size'

  let structureContent: ReactNode = null

  if (inspection.status === 'idle' || inspection.status === 'loading') {
    structureContent = (
      <span className="BrowserImportDialogStructureBadge BrowserImportDialogStructureBadge--status">
        Reading structure...
      </span>
    )
  } else if (inspection.status === 'error') {
    structureContent = (
      <>
        <span className="BrowserImportDialogStructureBadge BrowserImportDialogStructureBadge--error">
          Structure unavailable
        </span>
        <span className="BrowserImportDialogStructureNote">{inspection.errorMessage}</span>
      </>
    )
  } else if (inspection.status === 'ready') {
    const summary = inspection.summary
    const canUseMultipleObjects = canStagedImportFileUseMultipleObjects(file)
    const badges: string[] = []
    if (summary.hasMultipleObjects) {
      badges.push('Multiple objects')
    }
    if (summary.hasHierarchy) {
      badges.push('Hierarchy')
    }
    if (summary.hasParts) {
      badges.push('Parts')
    }
    if (badges.length === 0) {
      badges.push('Flat file')
    }

    structureContent = (
      <>
        <div className="BrowserImportDialogStructureBadgeRow">
          {badges.map((badge) => (
            <span key={badge} className="BrowserImportDialogStructureBadge">
              {badge}
            </span>
          ))}
        </div>
        {summary.labels.length > 0 ? (
          <div className="BrowserImportDialogStructureLabels">
            {summary.labels.map((label) => (
              <span key={label} className="BrowserImportDialogStructureLabelChip">
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="BrowserImportDialogImportModeGroup">
          <span className="BrowserImportDialogImportModeLabel">Import as</span>
          <div
            className="BrowserImportDialogImportModeOptions"
            role="group"
            aria-label={`Import mode for ${file.fileName}`}
          >
            {(['single-object', 'multiple-objects-in-component'] as const)
              .filter((importMode) => importMode === 'single-object' || canUseMultipleObjects)
              .map((importMode) => {
                const selected = file.importMode === importMode
                return (
                  <button
                    key={importMode}
                    type="button"
                    className={`BrowserImportDialogImportModeButton ${
                      selected ? 'isSelected' : ''
                    }`}
                    aria-pressed={selected}
                    onClick={() => onSetImportMode(file.stagedFileId, importMode)}
                  >
                    {resolveStagedImportModeLabel(importMode)}
                  </button>
                )
              })}
          </div>
        </div>
      </>
    )
  }

  return (
    <div
      className="BrowserImportDialogStructureSummary"
      aria-label={`Structure summary for ${file.fileName}`}
    >
      {structureContent}
      <div className="BrowserImportDialogImportModeGroup">
        <span className="BrowserImportDialogImportModeLabel">Up Axis</span>
        <div
          className="BrowserImportDialogImportModeOptions"
          role="group"
          aria-label={`Up axis for ${file.fileName}`}
        >
          {(['z-up', 'y-up', 'x-up'] as const).map((upAxis) => {
            const selected = selectedUpAxis === upAxis
            return (
              <button
                key={upAxis}
                type="button"
                className={`BrowserImportDialogImportModeButton ${selected ? 'isSelected' : ''}`}
                aria-pressed={selected}
                onClick={() => onSetUpAxis(file.stagedFileId, upAxis)}
              >
                {resolveStagedImportUpAxisLabel(upAxis)}
              </button>
            )
          })}
        </div>
      </div>
      <div className="BrowserImportDialogImportModeGroup">
        <span className="BrowserImportDialogImportModeLabel">Scale / Units</span>
        <div
          className="BrowserImportDialogImportModeOptions"
          role="group"
          aria-label={`Scale or units for ${file.fileName}`}
        >
          {(
            [
              'current-size',
              'millimeters',
              'centimeters',
              'meters',
              'inches',
            ] as const
          ).map((scaleAlignment) => {
            const selected = selectedScaleAlignment === scaleAlignment
            return (
              <button
                key={scaleAlignment}
                type="button"
                className={`BrowserImportDialogImportModeButton ${selected ? 'isSelected' : ''}`}
                aria-pressed={selected}
                onClick={() => onSetScaleAlignment(file.stagedFileId, scaleAlignment)}
              >
                {resolveStagedImportScaleAlignmentLabel(scaleAlignment)}
              </button>
            )
          })}
        </div>
      </div>
    </div>
  )
}

export function BrowserImportDialog(props: BrowserImportDialogProps) {
  const {
    draft,
    previewRows,
    isBrowsing,
    onBrowse,
    onSetImportMode,
    onSetUpAxis,
    onSetScaleAlignment,
    onSetPutAcceptedInNewAssembly,
    onCreatePreviewAssembly,
    onCreatePreviewComponent,
    registerPreviewRowElement,
    onPreviewRowPointerDown,
    getPreviewRowDragState,
    onCommit,
    onClose,
  } = props

  if (draft === null) {
    return null
  }

  const stagedFileCount = draft.stagedFiles.length
  const stagedFileCountLabel =
    stagedFileCount === 1 ? '1 file staged in draft' : `${stagedFileCount} files staged in draft`
  const canCommit = stagedFileCount > 0 && !isBrowsing

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
            Stage supported local reference files, review structure and import settings, then
            organize the reviewed result here before adding it to project content.
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
                No files staged yet. Use Browser to stage supported files for review before adding
                them to project content.
              </div>
            ) : (
              <div
                className="BrowserImportDialogStagedListScrollRegion"
                role="region"
                aria-label="Staged import file list"
              >
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
                          {renderStagedImportStructureSummary(
                            file,
                            onSetImportMode,
                            onSetUpAxis,
                            onSetScaleAlignment,
                          )}
                        </div>
                      </div>
                      <span className="BrowserImportDialogStagedRowType">
                        {resolveStagedImportFileTypeLabel(file.fileType)}
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            )}
          </div>
          <div className="BrowserImportDialogMeta">
            <span className="BrowserImportDialogMetaLabel">Landing target</span>
            <span className="BrowserImportDialogMetaValue">
              {resolveImportDialogTargetLabel(draft)}
            </span>
          </div>
          <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked">
            <span className="BrowserImportDialogMetaLabel">Accepted placement</span>
            <div className="BrowserImportDialogImportModeGroup">
              <div
                className="BrowserImportDialogImportModeOptions"
                role="group"
                aria-label="Accepted import placement"
              >
                <button
                  type="button"
                  className={`BrowserImportDialogImportModeButton ${
                    draft.putAcceptedImportsInNewAssembly ? 'isSelected' : ''
                  }`}
                  aria-pressed={draft.putAcceptedImportsInNewAssembly}
                  onClick={() =>
                    onSetPutAcceptedInNewAssembly(!draft.putAcceptedImportsInNewAssembly)
                  }
                >
                  Put Accepted Imports In New Assembly
                </button>
              </div>
              <span className="BrowserImportDialogPlacementHint">
                {draft.putAcceptedImportsInNewAssembly
                  ? 'Accepted imports will create a new assembly at commit.'
                  : 'Accepted imports will use the current landing target at commit.'}
              </span>
            </div>
          </div>
          <BrowserImportPreviewTree
            rows={previewRows}
            onCreatePreviewAssembly={onCreatePreviewAssembly}
            onCreatePreviewComponent={onCreatePreviewComponent}
            registerPreviewRowElement={registerPreviewRowElement}
            onPreviewRowPointerDown={onPreviewRowPointerDown}
            getPreviewRowDragState={getPreviewRowDragState}
          />
        </div>
        <div className="BrowserImportDialogActions">
          <button
            type="button"
            className="BrowserImportDialogAction BrowserImportDialogAction--primary"
            onClick={onCommit}
            disabled={!canCommit}
            aria-label="Add staged imports to project"
            title={
              stagedFileCount === 0
                ? 'Stage one or more files before adding them to project content.'
                : isBrowsing
                  ? 'Wait for Browser intake to finish before adding staged imports.'
                  : 'Add staged imports to project content.'
            }
          >
            Add To Project
          </button>
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
