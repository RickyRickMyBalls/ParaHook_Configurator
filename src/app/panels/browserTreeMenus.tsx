import type { CSSProperties, PointerEvent as ReactPointerEvent, ReactNode, RefObject } from 'react'
import {
  REFERENCE_IMPORT_LABEL_BY_FILE_TYPE,
  SUPPORTED_REFERENCE_IMPORT_FILE_TYPES,
} from '../references/importReferenceFile'
import type { ReferenceFileType } from '../references/referenceManifest'
import type { ImportedReferenceHierarchyRow } from '../../viewer/referenceStructureInspection'
import { canStagedImportFileUseMultipleObjects } from '../store/useAppStore'
import type {
  StagedImportCommitFileResult,
  StagedImportCommitResult,
  StagedImportDraftFileRecord,
  StagedImportMode,
  StagedImportScaleAlignment,
  StagedImportUpAxis,
  StagedImportDraftState,
} from '../store/useAppStore'
import type { BrowserContextMenuItem } from './browserContextMenu'
import type { StagedImportPreviewRowVm } from './selectStagedImportPreviewRows'
import type { BrowserRenderableRowVm } from './selectBrowserTreeRows'
import { StagedImportPreviewViewport } from './StagedImportPreviewViewport'
import { ParaSelect } from '../components/ParaSelect'
import { ParaSlider } from '../components/ParaSlider'
import {
  resolveStagedScaleMultiplierFromTrackValue,
  resolveStagedScaleMultiplierTrackValue,
  STAGED_SCALE_MULTIPLIER_TRACK_MAX,
  STAGED_SCALE_MULTIPLIER_TRACK_MIN,
  STAGED_SCALE_MULTIPLIER_TRACK_STEP,
} from './stagedScaleMultiplierCurve'
import {
  resolveStagedImportScaleAlignmentFromMultiplier,
  resolveStagedImportScaleMultiplier,
} from '../references/stagedImportTransforms'

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
  commitResult: StagedImportCommitResult | null
  previewSelection: { stagedFileId: string } | null
  columnWidths: {
    leftPercent: number
    middlePercent: number
    rightPercent: number
  }
  previewRows: StagedImportPreviewRowVm[]
  isBrowsing: boolean
  onBrowse: () => void
  onSetImportMode: (stagedFileId: string, importMode: StagedImportMode) => void
  onSetUpAxis: (stagedFileId: string, upAxis: StagedImportUpAxis) => void
  onSetScaleAlignment: (
    stagedFileId: string,
    scaleAlignment: StagedImportScaleAlignment,
  ) => void
  onSetScaleMultiplier: (stagedFileId: string, scaleMultiplier: number) => void
  onLoadPreview: (stagedFileId: string) => void
  onStartColumnResize: (
    divider: 'left-middle' | 'middle-right',
    event: ReactPointerEvent<HTMLButtonElement>,
    dialogWidth: number,
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

const resolveStagedImportCommitSummaryTitle = (
  commitResult: StagedImportCommitResult,
): string =>
  commitResult.status === 'partial'
    ? 'Add To Project partially succeeded'
    : 'Add To Project could not finish'

const resolveStagedImportCommitSummaryBody = (
  commitResult: StagedImportCommitResult,
  remainingStagedFileCount: number,
): string => {
  const committedFileCount = commitResult.fileResults.filter(
    (result) => result.outcome === 'committed',
  ).length
  const committedFileLabel =
    committedFileCount === 1 ? '1 file was added to project.' : `${committedFileCount} files were added to project.`
  const remainingFileLabel =
    remainingStagedFileCount === 1
      ? '1 file remains staged for review or retry.'
      : `${remainingStagedFileCount} files remain staged for review or retry.`

  if (commitResult.status === 'partial') {
    return `${committedFileLabel} ${remainingFileLabel}`
  }
  return `No files were added to project. ${remainingFileLabel}`
}

const resolveStagedImportCommitResultByFileId = (
  commitResult: StagedImportCommitResult | null,
): Map<string, StagedImportCommitFileResult> =>
  new Map((commitResult?.fileResults ?? []).map((result) => [result.stagedFileId, result] as const))

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
        : scaleAlignment === 'inches'
          ? 'in'
          : 'Custom'

const formatStagedImportScaleMultiplier = (scaleMultiplier: number): string => {
  const normalizedScaleMultiplier = Number(scaleMultiplier.toFixed(4))
  return Number.isInteger(normalizedScaleMultiplier)
    ? `${normalizedScaleMultiplier}`
    : `${normalizedScaleMultiplier}`
}

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
    <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked BrowserImportDialogPreviewColumn">
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
      <div
        className="BrowserImportDialogPreviewTreeScrollRegion"
        role="region"
        aria-label="Staged import preview scroll area"
      >
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
                    <span
                      className="BrowserTreeRowExpand BrowserTreeRowExpand--placeholder"
                      aria-hidden="true"
                    >
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
                    <span
                      className="BrowserImportDialogPreviewRowActionPlaceholder"
                      aria-hidden="true"
                    />
                  )}
                </div>
              )
            })}
          </div>
        )}
      </div>
    </div>
  )
}

const renderStagedImportHierarchyRows = (
  rows: ImportedReferenceHierarchyRow[],
  depth = 0,
): ReactNode => {
  if (rows.length === 0) {
    return null
  }

  return (
    <ul
      className="BrowserImportDialogHierarchyTreeList"
      data-depth={depth}
      role={depth === 0 ? 'tree' : 'group'}
    >
      {rows.map((row) => (
        <li
          key={`${depth}:${row.label}`}
          className="BrowserImportDialogHierarchyTreeItem"
          data-depth={depth}
          data-has-children={row.children.length > 0 ? 'true' : 'false'}
          role="treeitem"
          aria-level={depth + 1}
        >
          <div className="BrowserImportDialogHierarchyTreeRow">
            <span className="BrowserImportDialogHierarchyTreeNode" />
            <span className="BrowserImportDialogHierarchyTreeLabel">{row.label}</span>
          </div>
          {row.children.length > 0 ? renderStagedImportHierarchyRows(row.children, depth + 1) : null}
        </li>
      ))}
    </ul>
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
  onSetScaleMultiplier: (stagedFileId: string, scaleMultiplier: number) => void,
  previewSelection: { stagedFileId: string } | null,
  onLoadPreview: (stagedFileId: string) => void,
) => {
  const inspection = file.structureInspection
  const selectedUpAxis = file.upAxis ?? 'z-up'
  const selectedScaleMultiplier = resolveStagedImportScaleMultiplier(file)
  const selectedScaleAlignment =
    resolveStagedImportScaleAlignmentFromMultiplier(selectedScaleMultiplier)
  const isPreviewSelected = previewSelection?.stagedFileId === file.stagedFileId

  let structureContent: ReactNode = null

  if (inspection.status === 'idle' || inspection.status === 'loading') {
    structureContent = (
      <span className="BrowserImportDialogStructureBadge BrowserImportDialogStructureBadge--status">
        Reading structure...
      </span>
    )
  } else if (inspection.status === 'error') {
    structureContent = (
      <div className="BrowserImportDialogStructureFailure" role="status" aria-live="polite">
        <div className="BrowserImportDialogStructureFailureHeader">
          <span className="BrowserImportDialogStructureBadge BrowserImportDialogStructureBadge--error">
            Inspection failed
          </span>
          <span className="BrowserImportDialogStructureFailureTitle">Structure unavailable</span>
        </div>
        <span className="BrowserImportDialogStructureFailureHelper">
          ParaHook could not read this file&apos;s structure before commit. The file stays staged so
          you can remove it or continue reviewing the rest of the session.
        </span>
        <span className="BrowserImportDialogStructureNote">{inspection.errorMessage}</span>
      </div>
    )
  } else if (inspection.status === 'ready') {
    const summary = inspection.summary
    const canUseMultipleObjects = canStagedImportFileUseMultipleObjects(file)
    const importModeOptions = (['single-object', 'multiple-objects-in-component'] as const)
      .filter((importMode) => importMode === 'single-object' || canUseMultipleObjects)
      .map((importMode) => ({
        value: importMode,
        label: resolveStagedImportModeLabel(importMode),
      }))
    const badges: string[] = []
    const isStructuredWithoutSplitParts = summary.hasHierarchy && !summary.hasParts
    const structureHelperText = isStructuredWithoutSplitParts
      ? 'Structured hierarchy detected. No split parts detected.'
      : null
    if (summary.hasMultipleObjects && !isStructuredWithoutSplitParts) {
      badges.push('Multiple objects')
    }
    if (isStructuredWithoutSplitParts) {
      badges.push('Structured file')
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
    const hasHierarchyTree = Array.isArray(summary.hierarchyRows) && summary.hierarchyRows.length > 0

    structureContent = (
      <>
        <div className="BrowserImportDialogStructureBadgeRow">
          {badges.map((badge) => (
            <span key={badge} className="BrowserImportDialogStructureBadge">
              {badge}
            </span>
          ))}
        </div>
        {structureHelperText !== null ? (
          <span className="BrowserImportDialogStructureHelper">{structureHelperText}</span>
        ) : null}
        {summary.hasParts && summary.partRows.length > 0 ? (
          <ul
            className="BrowserImportDialogStructureSelectionList"
            aria-label={`Detected parts for ${file.fileName}`}
          >
            {summary.partRows.map((partRow) => (
              <li
                key={partRow.partKey}
                className="BrowserImportDialogStructureSelectionRow isSelected"
              >
                <span className="BrowserImportDialogStructureSelectionLabel">{partRow.label}</span>
              </li>
            ))}
          </ul>
        ) : null}
        {hasHierarchyTree ? (
          <div className="BrowserImportDialogHierarchyTreeBlock">
            <span className="BrowserImportDialogHierarchyTreeTitle">Hierarchy Tree</span>
            <div className="BrowserImportDialogHierarchyTreeScrollRegion">
              {renderStagedImportHierarchyRows(summary.hierarchyRows ?? [])}
            </div>
          </div>
        ) : !summary.hasParts && summary.labels.length > 0 ? (
          <div className="BrowserImportDialogStructureLabels">
            {summary.labels.map((label) => (
              <span key={label} className="BrowserImportDialogStructureLabelChip">
                {label}
              </span>
            ))}
          </div>
        ) : null}
        <div className="BrowserImportDialogImportModeGroup BrowserImportDialogImportModeGroup--paraselect">
          <ParaSelect
            label="Import As"
            value={file.importMode}
            options={importModeOptions}
            onChange={(value) => onSetImportMode(file.stagedFileId, value as StagedImportMode)}
            menuMode="custom"
            capGlyph="chevron"
          />
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
      <div className="BrowserImportDialogImportModeGroup BrowserImportDialogImportModeGroup--paraselect">
        <ParaSelect
          label="Up Axis"
          value={selectedUpAxis}
          options={(['z-up', 'y-up', 'x-up'] as const).map((upAxis) => ({
            value: upAxis,
            label: resolveStagedImportUpAxisLabel(upAxis),
          }))}
          onChange={(value) => onSetUpAxis(file.stagedFileId, value as StagedImportUpAxis)}
          menuMode="custom"
          capGlyph="chevron"
        />
      </div>
      <div className="BrowserImportDialogImportModeGroup BrowserImportDialogImportModeGroup--paraselect">
        <ParaSelect
          label="Scale / Units"
          value={selectedScaleAlignment}
          options={
            [
              'current-size',
              'millimeters',
              'centimeters',
              'meters',
              'inches',
              'custom',
            ].map((scaleAlignment) => ({
              value: scaleAlignment,
              label: resolveStagedImportScaleAlignmentLabel(
                scaleAlignment as StagedImportScaleAlignment,
              ),
            }))
          }
          onChange={(value) => {
            if (value === 'custom') {
              return
            }
            onSetScaleAlignment(file.stagedFileId, value as StagedImportScaleAlignment)
          }}
          menuMode="custom"
          capGlyph="chevron"
        />
      </div>
      <div className="BrowserImportDialogImportModeGroup BrowserImportDialogImportModeGroup--slider">
        <ParaSlider
          label="Scale Multiplier"
          value={selectedScaleMultiplier}
          min={0.1}
          max={1000}
          step={0.1}
          trackMin={STAGED_SCALE_MULTIPLIER_TRACK_MIN}
          trackMax={STAGED_SCALE_MULTIPLIER_TRACK_MAX}
          trackStep={STAGED_SCALE_MULTIPLIER_TRACK_STEP}
          valueToTrackValue={resolveStagedScaleMultiplierTrackValue}
          trackValueToValue={resolveStagedScaleMultiplierFromTrackValue}
          onChange={(value) => onSetScaleMultiplier(file.stagedFileId, value)}
          formatValue={formatStagedImportScaleMultiplier}
        />
      </div>
      <div className="BrowserImportDialogImportModeGroup">
        <span className="BrowserImportDialogImportModeLabel">Object Preview</span>
        <div
          className="BrowserImportDialogImportModeOptions"
          role="group"
          aria-label={`Object preview for ${file.fileName}`}
        >
          <button
            type="button"
            className={`BrowserImportDialogImportModeButton BrowserImportDialogPreviewLoadAction ${
              isPreviewSelected ? 'isSelected' : ''
            }`}
            aria-pressed={isPreviewSelected}
            onClick={() => onLoadPreview(file.stagedFileId)}
            aria-label={`Load ${file.fileName} into preview viewport`}
          >
            {isPreviewSelected ? 'Loaded Into Preview Viewport' : 'Load Into Preview Viewport'}
          </button>
        </div>
      </div>
    </div>
  )
}

const renderStagedImportCommitFailure = (result: StagedImportCommitFileResult | null) => {
  if (result === null || result.outcome !== 'failed') {
    return null
  }
  return (
    <div className="BrowserImportDialogCommitFailure">
      <div className="BrowserImportDialogCommitFailureHeader">
        <span className="BrowserImportDialogStructureBadge BrowserImportDialogStructureBadge--error">
          Acceptance failed
        </span>
        <span className="BrowserImportDialogCommitFailureTitle">
          This file remains staged for review or retry.
        </span>
      </div>
      {result.errorMessage !== null ? (
        <span className="BrowserImportDialogCommitFailureHelper">{result.errorMessage}</span>
      ) : null}
    </div>
  )
}

function BrowserImportCommitSummary(props: {
  commitResult: StagedImportCommitResult | null
  remainingStagedFileCount: number
}) {
  const { commitResult, remainingStagedFileCount } = props

  if (
    commitResult === null ||
    (commitResult.status !== 'partial' && commitResult.status !== 'failed')
  ) {
    return null
  }

  return (
    <div className="BrowserImportDialogCommitSummary" role="status" aria-live="polite">
      <div className="BrowserImportDialogCommitSummaryHeader">
        <span className="BrowserImportDialogStructureBadge BrowserImportDialogStructureBadge--error">
          {commitResult.status === 'partial' ? 'Partial result' : 'No files added'}
        </span>
        <span className="BrowserImportDialogCommitSummaryTitle">
          {resolveStagedImportCommitSummaryTitle(commitResult)}
        </span>
      </div>
      <span className="BrowserImportDialogCommitSummaryBody">
        {resolveStagedImportCommitSummaryBody(commitResult, remainingStagedFileCount)}
      </span>
    </div>
  )
}

function BrowserImportPreviewViewportShell(props: {
  previewSelection: { stagedFileId: string } | null
  draft: StagedImportDraftState
}) {
  const { previewSelection, draft } = props
  const selectedFile =
    previewSelection === null
      ? null
      : draft.stagedFiles.find((file) => file.stagedFileId === previewSelection.stagedFileId) ?? null

  return (
    <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked BrowserImportDialogViewportColumn">
      <div className="BrowserImportDialogViewportHeader">
        <div className="BrowserImportDialogPreviewHeaderCopy">
          <span className="BrowserImportDialogMetaLabel">Object Preview</span>
          <span className="BrowserImportDialogPreviewHint">
            Draft-local preview viewport. Load one staged object here to inspect and orbit it
            before commit.
          </span>
        </div>
      </div>
      <div
        className="BrowserImportDialogViewportShell"
        role="region"
        aria-label="Staged object preview viewport"
      >
        <StagedImportPreviewViewport selectedFile={selectedFile} />
      </div>
    </div>
  )
}

function BrowserImportDialogResizeBar(props: {
  divider: 'left-middle' | 'middle-right'
  onStartResize: (
    divider: 'left-middle' | 'middle-right',
    event: ReactPointerEvent<HTMLButtonElement>,
    dialogWidth: number,
  ) => void
}) {
  const { divider, onStartResize } = props

  return (
    <button
      type="button"
      className="BrowserImportDialogResizeBar"
      aria-orientation="vertical"
      aria-label={
        divider === 'left-middle'
          ? 'Resize settings and preview Browser columns'
          : 'Resize preview Browser and object preview columns'
      }
      onPointerDown={(event) => {
        const dialogContent = (event.currentTarget.closest('.BrowserImportDialogContent') as HTMLElement | null)
        const dialogWidth = Math.max(Math.round(dialogContent?.getBoundingClientRect().width ?? 0), 960)
        onStartResize(divider, event, dialogWidth)
      }}
    >
      <span className="BrowserImportDialogResizeBarGrip" aria-hidden="true" />
    </button>
  )
}

export function BrowserImportDialog(props: BrowserImportDialogProps) {
  const {
    draft,
    commitResult,
    previewSelection,
    columnWidths,
    previewRows,
    isBrowsing,
    onBrowse,
    onSetImportMode,
    onSetUpAxis,
    onSetScaleAlignment,
    onSetScaleMultiplier,
    onLoadPreview,
    onStartColumnResize,
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
  const commitResultsByFileId = resolveStagedImportCommitResultByFileId(commitResult)
  const commitButtonLabel =
    commitResult !== null && (commitResult.status === 'partial' || commitResult.status === 'failed')
      ? 'Try Add To Project Again'
      : 'Add To Project'
  const contentStyle = {
    '--browser-import-left-column-share': `${columnWidths.leftPercent / 100}`,
    '--browser-import-middle-column-share': `${columnWidths.middlePercent / 100}`,
    '--browser-import-right-column-share': `${columnWidths.rightPercent / 100}`,
  } as CSSProperties

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
          <div className="BrowserImportDialogContent" style={contentStyle}>
            <div className="BrowserImportDialogLeftColumn">
              <div
                className="BrowserImportDialogLeftScrollRegion"
                role="region"
                aria-label="Staged import settings"
              >
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
                <BrowserImportCommitSummary
                  commitResult={commitResult}
                  remainingStagedFileCount={stagedFileCount}
                />
                <div className="BrowserImportDialogMeta BrowserImportDialogMeta--stacked">
                  <span className="BrowserImportDialogMetaLabel">Staged files</span>
                  {draft.stagedFiles.length === 0 ? (
                    <div className="BrowserImportDialogEmptyState">
                      No files staged yet. Use Browser to stage supported files for review before adding
                      them to project content.
                    </div>
                  ) : (
                    <ol className="BrowserImportDialogStagedList" aria-label="Staged import files">
                      {draft.stagedFiles.map((file, index) => (
                        <li key={file.stagedFileId} className="BrowserImportDialogStagedRow">
                          <div className="BrowserImportDialogStagedRowHeader">
                            <div className="BrowserImportDialogStagedRowHeaderMain">
                              <span className="BrowserImportDialogStagedRowOrder">{index + 1}</span>
                              <span className="BrowserImportDialogStagedRowName">{file.fileName}</span>
                            </div>
                            <span className="BrowserImportDialogStagedRowType">
                              {resolveStagedImportFileTypeLabel(file.fileType)}
                            </span>
                          </div>
                          <div className="BrowserImportDialogStagedRowBody">
                            <div className="BrowserImportDialogStagedRowText">
                              {renderStagedImportStructureSummary(
                                file,
                                onSetImportMode,
                                onSetUpAxis,
                                onSetScaleAlignment,
                                onSetScaleMultiplier,
                                previewSelection,
                                onLoadPreview,
                              )}
                              {renderStagedImportCommitFailure(
                                commitResultsByFileId.get(file.stagedFileId) ?? null,
                              )}
                            </div>
                          </div>
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
              </div>
            </div>
            <BrowserImportDialogResizeBar
              divider="left-middle"
              onStartResize={onStartColumnResize}
            />
            <div className="BrowserImportDialogMiddleColumn">
              <BrowserImportPreviewTree
                rows={previewRows}
                onCreatePreviewAssembly={onCreatePreviewAssembly}
                onCreatePreviewComponent={onCreatePreviewComponent}
                registerPreviewRowElement={registerPreviewRowElement}
                onPreviewRowPointerDown={onPreviewRowPointerDown}
                getPreviewRowDragState={getPreviewRowDragState}
              />
            </div>
            <BrowserImportDialogResizeBar
              divider="middle-right"
              onStartResize={onStartColumnResize}
            />
            <div className="BrowserImportDialogRightColumn">
              <BrowserImportPreviewViewportShell
                previewSelection={previewSelection}
                draft={draft}
              />
            </div>
          </div>
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
                  : commitButtonLabel === 'Try Add To Project Again'
                    ? 'Try adding the remaining staged imports to project content again.'
                    : 'Add staged imports to project content.'
            }
          >
            {commitButtonLabel}
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
