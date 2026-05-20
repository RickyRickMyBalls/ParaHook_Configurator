import type {
  MouseEvent as ReactMouseEvent,
  PointerEvent as ReactPointerEvent,
} from 'react'
import type { BrowserSelectionModifiers } from './browserInteractions'
import { getBrowserRowFamilyAdapter } from './browserRowFamilies'
import type {
  BrowserBuildPolicySource,
  BrowserEnvironmentRootTreeRowVm,
  BrowserEnvironmentLightTreeRowVm,
  BrowserEnvironmentSourceTreeRowVm,
  BrowserGraphSectionTreeRowVm,
  BrowserGraphTreeRowVm,
  BrowserReferenceCategoryTreeRowVm,
  BrowserReferenceItemTreeRowVm,
  BrowserReferencesRootTreeRowVm,
  BrowserRenderableRowVm,
} from './selectBrowserTreeRows'

export type BrowserBuildPolicyStateVm = {
  authoredBrowserBuildPolicy: BrowserRenderableRowVm['authoredBrowserBuildPolicy'] | null
  effectiveBrowserBuildPolicy: NonNullable<BrowserRenderableRowVm['effectiveBrowserBuildPolicy']>
  effectiveBrowserBuildPolicySource: BrowserBuildPolicySource
  effectiveBrowserBuildPolicySourceLabel: string | null
}

const browserBuildPolicyLabel = (policy: BrowserBuildPolicyStateVm['effectiveBrowserBuildPolicy']): string => {
  switch (policy) {
    case 'off':
      return 'Off'
    case 'release':
      return 'Release'
    case 'manual':
      return 'Manual'
    default:
      return 'Live'
  }
}

const describeBrowserBuildPolicy = (state: BrowserBuildPolicyStateVm): string => {
  const effectiveLabel = browserBuildPolicyLabel(state.effectiveBrowserBuildPolicy)
  switch (state.effectiveBrowserBuildPolicySource) {
    case 'graph':
      return `Build policy: ${effectiveLabel} (from ${state.effectiveBrowserBuildPolicySourceLabel ?? 'graph'})`
    case 'assembly':
      return `Build policy: ${effectiveLabel} (from ${state.effectiveBrowserBuildPolicySourceLabel ?? 'assembly'})`
    case 'component':
      return `Build policy: ${effectiveLabel} (from ${state.effectiveBrowserBuildPolicySourceLabel ?? 'component'})`
    default:
      return `Build policy: ${effectiveLabel}`
  }
}

const buildBrowserBuildPolicyAriaLabel = (
  rowLabel: string,
  state: BrowserBuildPolicyStateVm,
): string => {
  const effectiveLabel = browserBuildPolicyLabel(state.effectiveBrowserBuildPolicy)
  switch (state.effectiveBrowserBuildPolicySource) {
    case 'graph':
    case 'assembly':
    case 'component':
      return `Inherited build policy for ${rowLabel}. Current policy ${effectiveLabel}. Right-click for independence options`
    default:
      return `Cycle build policy for ${rowLabel}. Current policy ${effectiveLabel}`
  }
}

const resolveBrowserBuildPolicyState = (
  row: BrowserRenderableRowVm,
): BrowserBuildPolicyStateVm | null => {
  if (
    row.rowKind !== 'graph-document' &&
    row.rowKind !== 'assembly' &&
    row.rowKind !== 'component' &&
    row.rowKind !== 'object'
  ) {
    return null
  }
  if (
    row.effectiveBrowserBuildPolicy === undefined ||
    row.effectiveBrowserBuildPolicySource === undefined
  ) {
    return null
  }
  return {
    authoredBrowserBuildPolicy: row.authoredBrowserBuildPolicy ?? null,
    effectiveBrowserBuildPolicy: row.effectiveBrowserBuildPolicy,
    effectiveBrowserBuildPolicySource: row.effectiveBrowserBuildPolicySource,
    effectiveBrowserBuildPolicySourceLabel: row.effectiveBrowserBuildPolicySourceLabel ?? null,
  }
}

function BrowserTreeRowContent(props: { label: string; meta?: string }) {
  const { label, meta = '' } = props
  return (
    <span className="BrowserTreeRowText">
      <span className="BrowserTreeRowLabel">{label}</span>
      {meta.length > 0 ? <span className="BrowserTreeRowMeta">{meta}</span> : null}
    </span>
  )
}

export type BrowserTreeRowShellProps = {
  row: BrowserRenderableRowVm
  rowRef?: ((element: HTMLDivElement | null) => void) | undefined
  onSelect: (row: BrowserRenderableRowVm, modifiers: BrowserSelectionModifiers) => void
  onToggleReferenceVisibility?: (row: BrowserRenderableRowVm) => void
  onToggleContentVisibility?: (row: BrowserRenderableRowVm) => void
  onToggleSketchVisibility?: (row: BrowserRenderableRowVm) => void
  onDoubleSelect?: (row: BrowserRenderableRowVm) => void
  onToggleExpand?: (row: BrowserRenderableRowVm) => void
  onCycleBrowserBuildPolicy?: (row: BrowserRenderableRowVm) => void
  onContextMenu: (
    row: BrowserRenderableRowVm,
    event: ReactMouseEvent<HTMLDivElement | HTMLButtonElement>,
  ) => void
  onPointerDragStartCandidate?: (
    row: BrowserRenderableRowVm,
    event: ReactPointerEvent<HTMLButtonElement>,
  ) => void
  shouldSuppressClick?: (row: BrowserRenderableRowVm) => boolean
  clearSuppressedClick?: (row: BrowserRenderableRowVm) => void
  getDragState?: (row: BrowserRenderableRowVm) => {
    draggable: boolean
    isDragging: boolean
    isPendingDrag?: boolean
    dropIntent: 'none' | 'before' | 'after' | 'into' | 'invalid'
    isDropOwnerSupport?: boolean
  }
}

export type BrowserTreeRowHandlers = Omit<BrowserTreeRowShellProps, 'row' | 'rowRef'>

export function BrowserTreeRowShell(props: BrowserTreeRowShellProps) {
  const {
    onContextMenu,
    onCycleBrowserBuildPolicy,
    onDoubleSelect,
    onSelect,
    onToggleContentVisibility,
    onToggleReferenceVisibility,
    onToggleSketchVisibility,
    onToggleExpand,
    row,
  } = props

  const familyAdapter = getBrowserRowFamilyAdapter(row)
  const dragState = props.getDragState?.(row) ?? {
    draggable: false,
    isDragging: false,
    isPendingDrag: false,
    dropIntent: 'none' as const,
    isDropOwnerSupport: false,
  }
  const isDropTargetIntoCollapsed =
    dragState.dropIntent === 'into' && row.isExpandable && !row.isExpanded
  const browserBuildPolicyState = resolveBrowserBuildPolicyState(row)
  const isGraphRow = row.rowKind === 'graph-document'
  const graphRow = isGraphRow ? (row as BrowserGraphTreeRowVm) : null
  const graphSectionRow =
    row.rowKind === 'graph-section' ? (row as BrowserGraphSectionTreeRowVm) : null
  const referenceRootRow =
    row.rowKind === 'references-root' ? (row as BrowserReferencesRootTreeRowVm) : null
  const referenceCategoryRow =
    row.rowKind === 'reference-category' ? (row as BrowserReferenceCategoryTreeRowVm) : null
  const referenceItemRow =
    row.rowKind === 'reference-item' ? (row as BrowserReferenceItemTreeRowVm) : null
  const referenceContainerRow =
    (row.rowKind === 'assembly' || row.rowKind === 'component') &&
    row.referenceContainerKind !== null &&
    row.referenceContainerKind !== undefined
      ? row
      : null
  const referenceRow = referenceRootRow ?? referenceCategoryRow ?? referenceItemRow
  const referenceSurfaceRow = referenceRow ?? referenceContainerRow
  const environmentSourceRow =
    row.rowKind === 'environment-source' ? (row as BrowserEnvironmentSourceTreeRowVm) : null
  const environmentRootRow =
    row.rowKind === 'environment-root' ? (row as BrowserEnvironmentRootTreeRowVm) : null
  const environmentLightRow =
    row.rowKind === 'environment-light' ? (row as BrowserEnvironmentLightTreeRowVm) : null
  const referenceBackedObjectRow =
    row.rowKind === 'object' &&
    (row.contentOriginKind === 'imported-reference' || row.contentOriginKind === 'source-reference')
      ? row
      : null
  const importedContentObjectRow =
    referenceBackedObjectRow?.contentOriginKind === 'imported-reference'
      ? referenceBackedObjectRow
      : null
  const isContentRow =
    row.rowKind === 'assembly' ||
    row.rowKind === 'component' ||
    row.rowKind === 'object' ||
    row.rowKind === 'sketch'
  const isEnvironmentRow =
    environmentRootRow !== null || environmentSourceRow !== null || environmentLightRow !== null
  const isSketchRow = row.rowKind === 'sketch'
  const isEnvironmentContentRow = isContentRow || isEnvironmentRow
  const isIndependentBrowserBuildPolicy =
    browserBuildPolicyState !== null &&
    browserBuildPolicyState.authoredBrowserBuildPolicy !== null &&
    browserBuildPolicyState.effectiveBrowserBuildPolicySource === 'self'
  const isInheritedBrowserBuildPolicy =
    browserBuildPolicyState !== null &&
    browserBuildPolicyState.effectiveBrowserBuildPolicySource !== 'self' &&
    browserBuildPolicyState.effectiveBrowserBuildPolicySource !== 'default'
  const isGraphRebuildRow = row.rowKind === 'graph-rebuild-object'
  const isGraphChildPlainRow =
    row.rowKind === 'graph-section' ||
    row.rowKind === 'graph-node' ||
    row.rowKind === 'sketch-profiles' ||
    row.rowKind === 'sketch-profile'
  const isReferenceRow = referenceSurfaceRow !== null
  const isPartRow = row.rowKind === 'part'
  const isReferenceVisibilityRow =
    row.rowKind === 'reference-category' ||
    (row.rowKind === 'component' && row.referenceContainerKind === 'category') ||
    row.rowKind === 'reference-item' ||
    referenceBackedObjectRow !== null
  const isReferenceVisible =
    referenceSurfaceRow !== null
      ? referenceSurfaceRow.isVisible
      : referenceBackedObjectRow !== null
        ? referenceBackedObjectRow.isVisible
        : false
  const isContentVisibilityRow =
    (row.rowKind === 'assembly' || row.rowKind === 'component' || row.rowKind === 'object') &&
    (row.visibilityPartKeys.length > 0 ||
      ((row.rowKind === 'assembly' || row.rowKind === 'component') &&
        (row.visibilityReferenceIds?.length ?? 0) > 0))
  const isContentVisible = isContentVisibilityRow ? row.isVisible : false
  const isPartVisibilityRow = row.rowKind === 'part' && row.visibilityPartKeys.length > 0
  const isPartVisible = isPartVisibilityRow ? row.isVisible : false
  const isSketchVisibilityRow = row.rowKind === 'sketch'
  const isSketchVisible = row.rowKind === 'sketch' ? row.isVisible : false
  const isEnvironmentLightVisibilityRow = environmentLightRow !== null
  const isEnvironmentSourceVisibilityRow =
    environmentSourceRow !== null && environmentSourceRow.sourceKind === 'hdri'
  const isEnvironmentLightVisible = environmentLightRow?.enabled ?? false
  const isEnvironmentSourceVisible = environmentSourceRow?.backgroundVisible ?? false
  const buildSurfaceRow = isContentRow || isGraphRebuildRow ? row : null
  const referenceContainerState = referenceContainerRow?.referenceContainerState ?? 'dormant'
  const referenceContainerProgress01 = referenceContainerRow?.referenceContainerProgress01 ?? undefined
  const isReferenceContainerDeterminateProgress =
    referenceContainerRow !== null && referenceContainerProgress01 !== undefined
  const isActiveViewportRow = row.rowKind === 'viewport' && row.meta === 'Active editor'
  const contentBuildState = buildSurfaceRow ? buildSurfaceRow.buildState : 'done'
  const visibleRowMeta = isSketchRow ? '' : row.meta
  const rowClassName = [
    'BrowserTreeRow',
    `BrowserTreeRow--${row.rowKind}`,
    `BrowserTreeRow--depth-${row.depth}`,
    row.isSelected ? 'isSelected' : '',
    row.isGroupedSelected ? 'isGroupedSelected' : '',
    dragState.draggable ? 'isDraggable' : '',
    dragState.isDragging ? 'isDragging' : '',
    dragState.isPendingDrag ? 'isPendingDrag' : '',
    dragState.dropIntent === 'before' ? 'isDropTargetBefore' : '',
    dragState.dropIntent === 'after' ? 'isDropTargetAfter' : '',
    dragState.dropIntent === 'into' ? 'isDropTargetInto' : '',
    isDropTargetIntoCollapsed ? 'isDropTargetIntoCollapsed' : '',
    dragState.dropIntent === 'invalid' ? 'isDropTargetInvalid' : '',
    dragState.isDropOwnerSupport ? 'isDropOwnerSupport' : '',
    !row.isExpandable ? 'isLeaf' : '',
    graphRow?.openViewportCount ? 'isOpen' : '',
    graphRow?.hasFocusedViewport || isActiveViewportRow ? 'isActiveEditor' : '',
    graphRow?.buildState === 'building' || contentBuildState === 'building' ? 'isBuilding' : '',
    isEnvironmentRow ? 'isEnvironmentRow' : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ')
  const rowMainClassName = [
    'BrowserTreeRowMain',
    graphRow !== null ? 'isGraphRow' : '',
    isEnvironmentContentRow ? 'isContentRow' : '',
    row.rowKind === 'sketches-root' ? 'isSketchesRootRow' : '',
    isGraphRebuildRow ? 'isGraphChildBuildRow' : '',
    isReferenceRow ? 'isReferenceRow' : '',
    isPartRow ? 'isPartRow' : '',
    isGraphChildPlainRow ? 'isGraphChildPlainRow' : '',
    row.rowKind === 'viewport' ? 'isViewportRow' : '',
    isEnvironmentContentRow ? `isContentRow--${contentBuildState}` : '',
    referenceBackedObjectRow !== null ? 'isContentRow--imported' : '',
    isGraphRebuildRow ? `isGraphChildBuildRow--${contentBuildState}` : '',
    row.rowKind === 'object' ? 'isContentRow--slim' : '',
    row.rowKind === 'part' ? 'isContentRow--slim' : '',
    row.rowKind === 'graph-rebuild-object' ? 'isGraphChildBuildRow--slim' : '',
    isEnvironmentRow ? 'isEnvironmentRow' : '',
  ]
    .filter((value) => value.length > 0)
    .join(' ')
  const canShowVisibilityToggle =
    isReferenceVisibilityRow ||
    isSketchVisibilityRow ||
    isContentVisibilityRow ||
    isPartVisibilityRow ||
    isEnvironmentSourceVisibilityRow ||
    isEnvironmentLightVisibilityRow

  return (
    <div
      ref={props.rowRef}
      className={rowClassName}
      onClick={(event) => {
        const target = event.target as HTMLElement | null
        if (target === null) {
          return
        }
        if (target.closest('button, [role="button"], a, input, select, textarea') !== null) {
          return
        }
        if (props.shouldSuppressClick?.(row)) {
          event.preventDefault()
          event.stopPropagation()
          props.clearSuppressedClick?.(row)
          return
        }
        onSelect(row, {
          ctrlKey: event.ctrlKey,
          shiftKey: event.shiftKey,
        })
      }}
      onContextMenu={(event) => {
        if (!familyAdapter.supportsContextMenu) {
          return
        }
        onContextMenu(row, event)
      }}
    >
      <div className="BrowserTreeRowLead">
        {row.treeGuides.length > 0 ? (
          <span className="BrowserTreeRowGuides" aria-hidden="true">
            {row.treeGuides.map((guide, index) => (
              <span
                key={`${row.rowId}:guide:${index}`}
                className={`BrowserTreeRowGuide BrowserTreeRowGuide--${guide}`}
              />
            ))}
          </span>
        ) : (
          <span
            className="BrowserTreeRowVisibilityToggle BrowserTreeRowVisibilityToggle--placeholder"
            aria-hidden="true"
          />
        )}
        {familyAdapter.supportsExpandToggle && row.isExpandable ? (
          <button
            type="button"
            className="BrowserTreeRowExpand"
            onClick={() => onToggleExpand?.(row)}
            aria-label={
              isGraphRow
                ? row.isExpanded
                  ? `Collapse ${row.label} child sections`
                  : `Expand ${row.label} child sections`
                : graphSectionRow !== null
                  ? row.isExpanded
                    ? `Collapse ${row.label}`
                    : `Expand ${row.label}`
                  : row.isExpanded
                    ? `Collapse ${row.label} children`
                    : `Expand ${row.label} children`
            }
          >
            {row.isExpanded ? '-' : '+'}
          </button>
        ) : (
          <span className="BrowserTreeRowExpand BrowserTreeRowExpand--placeholder" aria-hidden="true">
            .
          </span>
        )}
        {browserBuildPolicyState !== null ? (
          <button
            type="button"
            className={`BrowserTreeRowIcon BrowserTreeRowIcon--policy BrowserTreeRowIcon--${browserBuildPolicyState.effectiveBrowserBuildPolicy} ${
              isIndependentBrowserBuildPolicy ? 'BrowserTreeRowIcon--independent' : ''
            } ${
              isInheritedBrowserBuildPolicy ? 'BrowserTreeRowIcon--inherited' : ''
            }`}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              onCycleBrowserBuildPolicy?.(row)
            }}
            aria-label={buildBrowserBuildPolicyAriaLabel(row.label, browserBuildPolicyState)}
            title={
              isInheritedBrowserBuildPolicy
                ? `${describeBrowserBuildPolicy(browserBuildPolicyState)}. Right-click to manage independence.`
                : describeBrowserBuildPolicy(browserBuildPolicyState)
            }
          >
            {row.iconLabel}
          </button>
        ) : (
          <span className="BrowserTreeRowIcon" aria-hidden="true">
            {row.iconLabel}
          </span>
        )}
        {canShowVisibilityToggle ? (
          <button
            type="button"
            className={`BrowserTreeRowVisibilityToggle ${
              (isReferenceVisibilityRow
                ? isReferenceVisible
                : isContentVisibilityRow
                  ? isContentVisible
                  : isPartVisibilityRow
                    ? isPartVisible
                  : isEnvironmentSourceVisibilityRow
                    ? isEnvironmentSourceVisible
                  : isEnvironmentLightVisibilityRow
                    ? isEnvironmentLightVisible
                  : isSketchVisible)
                ? 'isVisible'
                : 'isHidden'
            }`}
            onClick={(event) => {
              event.preventDefault()
              event.stopPropagation()
              if (isReferenceVisibilityRow) {
                onToggleReferenceVisibility?.(row)
                return
              }
              if (isContentVisibilityRow) {
                onToggleContentVisibility?.(row)
                return
              }
              if (isPartVisibilityRow) {
                onToggleContentVisibility?.(row)
                return
              }
              if (isEnvironmentSourceVisibilityRow) {
                onToggleContentVisibility?.(row)
                return
              }
              if (isEnvironmentLightVisibilityRow) {
                onToggleContentVisibility?.(row)
                return
              }
              onToggleSketchVisibility?.(row)
            }}
            aria-label={`${
              (isReferenceVisibilityRow
                ? isReferenceVisible
                : isContentVisibilityRow
                  ? isContentVisible
                  : isPartVisibilityRow
                    ? isPartVisible
                  : isEnvironmentSourceVisibilityRow
                    ? isEnvironmentSourceVisible
                  : isEnvironmentLightVisibilityRow
                    ? isEnvironmentLightVisible
                  : isSketchVisible)
                ? 'Hide'
                : 'Show'
            } ${row.label}`}
            title={`${
              (isReferenceVisibilityRow
                ? isReferenceVisible
                : isContentVisibilityRow
                  ? isContentVisible
                  : isPartVisibilityRow
                    ? isPartVisible
                  : isEnvironmentSourceVisibilityRow
                    ? isEnvironmentSourceVisible
                  : isEnvironmentLightVisibilityRow
                    ? isEnvironmentLightVisible
                  : isSketchVisible)
                ? 'Hide'
                : 'Show'
            } ${row.label}`}
          >
            <span className="BrowserTreeRowVisibilityToggleEye" aria-hidden="true">
              <span className="BrowserTreeRowVisibilityTogglePupil" />
            </span>
            {!(isReferenceVisibilityRow
              ? isReferenceVisible
              : isContentVisibilityRow
                ? isContentVisible
                : isPartVisibilityRow
                  ? isPartVisible
                : isEnvironmentSourceVisibilityRow
                  ? isEnvironmentSourceVisible
                : isEnvironmentLightVisibilityRow
                  ? isEnvironmentLightVisible
                : isSketchVisible) ? (
              <span className="BrowserTreeRowVisibilityToggleSlash" aria-hidden="true" />
            ) : null}
          </button>
        ) : null}
      </div>

      <button
        type="button"
        className={rowMainClassName}
        onPointerDown={(event) => {
          props.onPointerDragStartCandidate?.(row, event)
          if (event.button !== 0) {
            return
          }
          if (props.shouldSuppressClick?.(row)) {
            return
          }
          event.currentTarget.dataset.browserPointerSelectionHandled = 'true'
          onSelect(row, {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
          })
        }}
        onPointerCancel={(event) => {
          delete event.currentTarget.dataset.browserPointerSelectionHandled
        }}
        onClick={(event) => {
          if (event.currentTarget.dataset.browserPointerSelectionHandled === 'true') {
            delete event.currentTarget.dataset.browserPointerSelectionHandled
            if (props.shouldSuppressClick?.(row)) {
              event.preventDefault()
              event.stopPropagation()
              props.clearSuppressedClick?.(row)
            }
            return
          }
          if (props.shouldSuppressClick?.(row)) {
            event.preventDefault()
            event.stopPropagation()
            props.clearSuppressedClick?.(row)
            return
          }
          onSelect(row, {
            ctrlKey: event.ctrlKey,
            shiftKey: event.shiftKey,
          })
        }}
        onDoubleClick={() => {
          if (props.shouldSuppressClick?.(row)) {
            props.clearSuppressedClick?.(row)
            return
          }
          onSelect(row, {
            ctrlKey: false,
            shiftKey: false,
          })
          if (familyAdapter.supportsDoubleSelect) {
            onDoubleSelect?.(row)
          }
        }}
        aria-pressed={row.isSelected}
      >
        {graphRow !== null ? (
          <span
            className={`BrowserTreeRowSurface BrowserGraphStateBar BrowserGraphStateBar--${graphRow.buildState}`}
            title={row.meta}
          >
            <span className="BrowserGraphStateFill" aria-hidden="true" />
            <BrowserTreeRowContent label={row.label} />
          </span>
        ) : isEnvironmentRow ? (
          <span
            className="BrowserTreeRowSurface BrowserContentStateBar BrowserContentStateBar--done"
            title={visibleRowMeta}
          >
            <span className="BrowserContentStateFill" aria-hidden="true" />
            <BrowserTreeRowContent label={row.label} meta={visibleRowMeta} />
          </span>
        ) : buildSurfaceRow !== null ? (
          <span
            className={`BrowserTreeRowSurface BrowserContentStateBar ${
              referenceContainerRow !== null
                ? `BrowserContentStateBar--reference-container BrowserContentStateBar--reference-container-${referenceContainerState}`
                : importedContentObjectRow !== null
                ? `BrowserContentStateBar--imported BrowserContentStateBar--imported-${importedContentObjectRow.referenceState ?? 'dormant'}`
                : referenceBackedObjectRow !== null
                  ? `BrowserContentStateBar--imported BrowserContentStateBar--imported-${referenceBackedObjectRow.referenceState ?? 'dormant'}`
                : `BrowserContentStateBar--${contentBuildState}`
            } ${
              row.rowKind === 'object' || row.rowKind === 'graph-rebuild-object'
                ? 'BrowserTreeRowSurface--slim BrowserContentStateBar--slim'
                : ''
            }`}
            title={visibleRowMeta}
          >
            <span
              className={`BrowserContentStateFill${
                isReferenceContainerDeterminateProgress ? ' BrowserContentStateFill--determinate' : ''
              }`}
              style={
                isReferenceContainerDeterminateProgress
                  ? {
                      width: `${Math.max(0, Math.min(1, referenceContainerProgress01 ?? 0)) * 100}%`,
                    }
                  : undefined
              }
              aria-hidden="true"
            />
            <BrowserTreeRowContent label={row.label} meta={visibleRowMeta} />
          </span>
        ) : isPartRow ? (
          <span
            className="BrowserTreeRowSurface BrowserContentStateBar BrowserContentStateBar--part BrowserTreeRowSurface--slim BrowserContentStateBar--slim"
            title={visibleRowMeta}
          >
            <span className="BrowserContentStateFill" aria-hidden="true" />
            <BrowserTreeRowContent label={row.label} meta={visibleRowMeta} />
          </span>
        ) : referenceSurfaceRow !== null ? (
          (() => {
            const progress01 =
              referenceSurfaceRow.rowKind === 'reference-item'
                ? undefined
                : referenceSurfaceRow.rowKind === 'references-root' ||
                    referenceSurfaceRow.rowKind === 'reference-category'
                  ? referenceSurfaceRow.progress01
                  : referenceSurfaceRow.referenceContainerProgress01 ?? undefined
            const isDeterminateReferenceProgress = progress01 !== undefined
            const referenceState =
              referenceSurfaceRow.rowKind === 'references-root' ||
              referenceSurfaceRow.rowKind === 'reference-category' ||
              referenceSurfaceRow.rowKind === 'reference-item'
                ? referenceSurfaceRow.state
                : referenceSurfaceRow.referenceContainerState ?? 'dormant'
            return (
              <span
                className={`BrowserTreeRowSurface BrowserReferenceStateBar BrowserReferenceStateBar--${referenceState}${
                  isDeterminateReferenceProgress ? ' BrowserReferenceStateBar--determinate' : ''
                }`}
                title={row.meta}
              >
                <span
                  className={`BrowserReferenceStateFill${
                    isDeterminateReferenceProgress ? ' BrowserReferenceStateFill--determinate' : ''
                  }`}
                  style={
                    progress01 !== undefined
                      ? { width: `${Math.max(0, Math.min(1, progress01)) * 100}%` }
                      : undefined
                  }
                  aria-hidden="true"
                />
                <BrowserTreeRowContent label={row.label} meta={row.meta} />
              </span>
            )
          })()
        ) : (
          <span
            className="BrowserTreeRowSurface BrowserTreeRowSurface--plain BrowserGraphChildPlainBar"
            title={row.meta}
          >
            <BrowserTreeRowContent label={row.label} meta={row.meta} />
          </span>
        )}
      </button>
    </div>
  )
}
