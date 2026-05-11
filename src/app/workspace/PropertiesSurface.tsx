import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
  type ReactNode,
} from 'react'
import {
  buildImportedReferenceRowId,
  selectWorkspaceSelectedTarget,
  useAppStore,
  type WorkspaceSelectedTarget,
} from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import { clearWorkspaceTargetSelection } from '../store/workspaceSelectionCommands'
import type { WorkspaceViewportSlotId } from './workspaceShellTypes'
import { WorkspacePanelSplitShell } from './WorkspacePanelSplitShell'
import { propertiesMaterialsSectionDefinition } from './PropertiesMaterialsSection'
import {
  buildPropertiesFocusSummary,
  resolvePropertiesShellState,
  type PropertiesSectionDefinition,
  type PropertiesSectionId,
} from './propertiesSectionContract'

type PropertiesSurfaceProps = {
  slotId?: WorkspaceViewportSlotId
  surfaceInstanceId: string
}

type PropertiesFocusedObjectRow = {
  id: string
  target: Extract<WorkspaceSelectedTarget, { kind: 'object' }>
  label: string
  detail: string
}

const workspaceTargetKey = (target: WorkspaceSelectedTarget): string => {
  switch (target.kind) {
    case 'object':
      return `object:${target.objectId}`
    case 'assembly':
      return `assembly:${target.assemblyId}`
    case 'component':
      return `component:${target.componentId}`
    case 'environment-light':
      return `environment-light:${target.lightId}`
    case 'graph-document':
      return `graph-document:${target.graphDocumentId}`
    case 'graph-node':
      return `graph-node:${target.graphDocumentId}:${target.nodeId}`
    case 'part':
      return `part:${target.partKey}`
    case 'reference-category':
      return `reference-category:${target.categoryId}`
    case 'reference-item':
      return `reference-item:${target.referenceId}`
    case 'references-root':
      return 'references-root'
  }
}

const FOCUSED_OBJECT_LIST_ROW_HEIGHT = 30
const FOCUSED_OBJECT_LIST_ROW_GAP = 4
const FOCUSED_OBJECT_LIST_VERTICAL_PADDING = 4
const FOCUSED_OBJECT_LIST_DEFAULT_ROW_COUNT = 3
const FOCUSED_OBJECT_LIST_MIN_HEIGHT = FOCUSED_OBJECT_LIST_ROW_HEIGHT + FOCUSED_OBJECT_LIST_VERTICAL_PADDING
const FOCUSED_OBJECT_LIST_DEFAULT_HEIGHT =
  FOCUSED_OBJECT_LIST_ROW_HEIGHT * FOCUSED_OBJECT_LIST_DEFAULT_ROW_COUNT +
  FOCUSED_OBJECT_LIST_ROW_GAP * (FOCUSED_OBJECT_LIST_DEFAULT_ROW_COUNT - 1) +
  FOCUSED_OBJECT_LIST_VERTICAL_PADDING
const FOCUSED_OBJECT_LIST_MAX_HEIGHT = 260
const FOCUSED_OBJECT_LIST_KEYBOARD_STEP = 12

const clampFocusedObjectListHeight = (height: number): number =>
  Math.min(FOCUSED_OBJECT_LIST_MAX_HEIGHT, Math.max(FOCUSED_OBJECT_LIST_MIN_HEIGHT, height))

const resolveFocusedObjectListDefaultHeight = (rowCount: number): number => {
  const visibleRowCount = Math.min(FOCUSED_OBJECT_LIST_DEFAULT_ROW_COUNT, Math.max(1, rowCount))
  return (
    FOCUSED_OBJECT_LIST_ROW_HEIGHT * visibleRowCount +
    FOCUSED_OBJECT_LIST_ROW_GAP * (visibleRowCount - 1) +
    FOCUSED_OBJECT_LIST_VERTICAL_PADDING
  )
}

const areWorkspaceSelectedTargetsEqual = (
  left: WorkspaceSelectedTarget | null,
  right: WorkspaceSelectedTarget | null,
): boolean =>
  left !== null && right !== null && workspaceTargetKey(left) === workspaceTargetKey(right)

export function PropertiesSurface(props: PropertiesSurfaceProps) {
  const { slotId, surfaceInstanceId } = props
  const selectedTarget = useAppStore(selectWorkspaceSelectedTarget)
  const explicitSelectedTargets = useAppStore(
    (state) => state.workspaceSelection.explicitSelectedTargets,
  )
  const selectionAnchorTarget = useAppStore(
    (state) => state.workspaceSelection.selectionAnchorTarget,
  )
  const projectContent = useAppStore((state) => state.projectContent)
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const setWorkspaceSelectedTarget = useAppStore((state) => state.setWorkspaceSelectedTarget)
  const setWorkspaceExplicitSelection = useAppStore((state) => state.setWorkspaceExplicitSelection)
  const selectPart = useAppStore((state) => state.selectPart)
  const requestConsoleContextSync = useAppStore((state) => state.requestConsoleContextSync)
  const selectLight = useUiPrefsStore((state) => state.selectLight)
  const workspacePanelShellPaddingPx = useUiPrefsStore(
    (state) => state.workspacePanelShellPaddingPx,
  )
  const selectedFocusedObjectRows = useMemo<PropertiesFocusedObjectRow[]>(() => {
    const candidateTargets =
      explicitSelectedTargets.length > 0
        ? explicitSelectedTargets
        : selectedTarget === null
          ? []
          : [selectedTarget]
    const seenObjectIds = new Set<string>()
    return candidateTargets
      .filter((target): target is Extract<WorkspaceSelectedTarget, { kind: 'object' }> => {
        if (target.kind !== 'object' || seenObjectIds.has(target.objectId)) {
          return false
        }
        seenObjectIds.add(target.objectId)
        return true
      })
      .map((target) => {
        const objectRecord = projectContent.objectsById[target.objectId]
        if (objectRecord !== undefined) {
          return {
            id: target.objectId,
            target,
            label: objectRecord.label,
            detail: 'Project object',
          }
        }

        const referenceId =
          referenceWorkspace.importedReferenceOrder.find(
            (candidateReferenceId) => buildImportedReferenceRowId(candidateReferenceId) === target.objectId,
          ) ?? null
        const referenceRecord =
          referenceId === null ? undefined : referenceWorkspace.importedReferencesById[referenceId]
        return {
          id: target.objectId,
          target,
          label: referenceRecord?.label ?? 'Imported object',
          detail: referenceRecord?.fileType === undefined ? 'Imported object' : referenceRecord.fileType,
        }
      })
  }, [explicitSelectedTargets, projectContent.objectsById, referenceWorkspace, selectedTarget])
  const selectedFocusedObjectRowIds = useMemo(
    () => selectedFocusedObjectRows.map((row) => row.id),
    [selectedFocusedObjectRows],
  )
  const selectedFocusedObjectRowIdKey = selectedFocusedObjectRowIds.join('\u001f')
  const selectedTargetObjectId = selectedTarget?.kind === 'object' ? selectedTarget.objectId : null
  const [focusedObjectRows, setFocusedObjectRows] = useState<PropertiesFocusedObjectRow[]>([])
  const [activeFocusedObjectId, setActiveFocusedObjectId] = useState<string | null>(null)
  const focusedObjectRowIds = useMemo(
    () => focusedObjectRows.map((row) => row.id),
    [focusedObjectRows],
  )
  const focusedObjectRowIdKey = focusedObjectRowIds.join('\u001f')
  const activeFocusedObjectRow =
    focusedObjectRows.find((row) => row.id === activeFocusedObjectId) ?? focusedObjectRows[0] ?? null
  const effectiveSelectedTarget = activeFocusedObjectRow?.target ?? selectedTarget ?? null
  const focusSummary = buildPropertiesFocusSummary(effectiveSelectedTarget)
  const selectedTargetKey =
    activeFocusedObjectRow === null ? null : workspaceTargetKey(activeFocusedObjectRow.target)
  const sections = useMemo<PropertiesSectionDefinition[]>(
    () => [propertiesMaterialsSectionDefinition],
    [],
  )
  const [activeSectionId, setActiveSectionId] = useState<PropertiesSectionId | null>(
    sections[0]?.id ?? null,
  )
  const [focusedObjectListHeight, setFocusedObjectListHeight] = useState(
    FOCUSED_OBJECT_LIST_DEFAULT_HEIGHT,
  )
  const [includedFocusedObjectIds, setIncludedFocusedObjectIds] = useState<Set<string>>(
    () => new Set(),
  )
  const [isResizingFocusedObjectList, setIsResizingFocusedObjectList] = useState(false)
  const focusedObjectListResizeStartClientYRef = useRef(0)
  const focusedObjectListResizeStartHeightRef = useRef(FOCUSED_OBJECT_LIST_DEFAULT_HEIGHT)

  useEffect(() => {
    if (activeSectionId === null || sections.some((section) => section.id === activeSectionId)) {
      return
    }
    setActiveSectionId(sections[0]?.id ?? null)
  }, [activeSectionId, sections])

  useEffect(() => {
    setFocusedObjectListHeight(resolveFocusedObjectListDefaultHeight(focusedObjectRows.length))
  }, [focusedObjectRows.length])

  useEffect(() => {
    if (selectedFocusedObjectRows.length === 0) {
      if (selectedTarget !== null) {
        setFocusedObjectRows([])
      }
      return
    }

    setFocusedObjectRows((currentRows) => {
      if (currentRows.length === 0) {
        return selectedFocusedObjectRows
      }

      const currentIds = new Set(currentRows.map((row) => row.id))
      const hasSharedRow = selectedFocusedObjectRows.some((row) => currentIds.has(row.id))
      if (!hasSharedRow) {
        return selectedFocusedObjectRows
      }

      const nextRows = [...currentRows]
      for (const selectedRow of selectedFocusedObjectRows) {
        const existingIndex = nextRows.findIndex((row) => row.id === selectedRow.id)
        if (existingIndex === -1) {
          nextRows.push(selectedRow)
        } else {
          nextRows[existingIndex] = selectedRow
        }
      }
      return nextRows
    })
  }, [selectedFocusedObjectRowIdKey, selectedFocusedObjectRows, selectedTarget])

  useEffect(() => {
    setIncludedFocusedObjectIds(new Set(selectedFocusedObjectRowIds))
  }, [selectedFocusedObjectRowIdKey, selectedFocusedObjectRowIds])

  useEffect(() => {
    setActiveFocusedObjectId((currentId) => {
      if (currentId !== null && focusedObjectRowIds.includes(currentId)) {
        return currentId
      }
      if (selectedTargetObjectId !== null && focusedObjectRowIds.includes(selectedTargetObjectId)) {
        return selectedTargetObjectId
      }
      return focusedObjectRows[0]?.id ?? null
    })
  }, [focusedObjectRowIdKey, focusedObjectRowIds, focusedObjectRows, selectedTargetObjectId])

  const selectedObjectTargets = useMemo(
    () =>
      focusedObjectRows
        .filter((row) => includedFocusedObjectIds.has(row.id))
        .map((row) => row.target),
    [focusedObjectRows, includedFocusedObjectIds],
  )
  const shellState = resolvePropertiesShellState(
    sections,
    focusSummary,
    effectiveSelectedTarget,
    activeSectionId,
    selectedObjectTargets,
  )

  const activeSection =
    shellState.kind === 'ready'
      ? shellState.activeSection
      : sections.find((section) => section.id === activeSectionId) ?? sections[0] ?? null

  useEffect(() => {
    if (!isResizingFocusedObjectList) {
      return undefined
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const dragOffset = event.clientY - focusedObjectListResizeStartClientYRef.current
      setFocusedObjectListHeight(
        clampFocusedObjectListHeight(focusedObjectListResizeStartHeightRef.current + dragOffset),
      )
    }

    const handleMouseUp = () => {
      setIsResizingFocusedObjectList(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add('PropertiesMaterialsIsResizingTargetList')

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('PropertiesMaterialsIsResizingTargetList')
    }
  }, [isResizingFocusedObjectList])

  const focusedObjectListHeightStyle = {
    '--properties-focused-item-list-height': `${focusedObjectListHeight}px`,
  } as CSSProperties

  const handleFocusedObjectListResizeStart = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    focusedObjectListResizeStartClientYRef.current = event.clientY
    focusedObjectListResizeStartHeightRef.current = focusedObjectListHeight
    setIsResizingFocusedObjectList(true)
  }

  const handleFocusedObjectListResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setFocusedObjectListHeight((currentHeight) => {
      if (event.key === 'Home') {
        return FOCUSED_OBJECT_LIST_MIN_HEIGHT
      }

      if (event.key === 'End') {
        return FOCUSED_OBJECT_LIST_MAX_HEIGHT
      }

      const direction = event.key === 'ArrowUp' ? -1 : 1
      return clampFocusedObjectListHeight(
        currentHeight + direction * FOCUSED_OBJECT_LIST_KEYBOARD_STEP,
      )
    })
  }

  const handleFocusedObjectRowClick = (
    target: Extract<WorkspaceSelectedTarget, { kind: 'object' }>,
  ) => {
    handleFocusedObjectIncludedToggle(target)
  }

  const handleFocusedObjectIncludedToggle = (
    target: Extract<WorkspaceSelectedTarget, { kind: 'object' }>,
  ) => {
    setActiveFocusedObjectId(target.objectId)

    const currentTargets =
      explicitSelectedTargets.length > 0
        ? explicitSelectedTargets
        : selectedTarget === null
          ? []
          : [selectedTarget]
    const isCurrentlySelected = currentTargets.some((candidateTarget) =>
      areWorkspaceSelectedTargetsEqual(candidateTarget, target),
    )

    if (isCurrentlySelected) {
      const nextExplicitSelectedTargets = currentTargets.filter(
        (candidateTarget) => !areWorkspaceSelectedTargetsEqual(candidateTarget, target),
      )
      const nextSelectedTarget =
        selectedTarget !== null && areWorkspaceSelectedTargetsEqual(selectedTarget, target)
          ? (nextExplicitSelectedTargets[0] ?? null)
          : selectedTarget
      const nextSelectionAnchorTarget =
        selectionAnchorTarget !== null && areWorkspaceSelectedTargetsEqual(selectionAnchorTarget, target)
          ? (nextExplicitSelectedTargets[0] ?? null)
          : selectionAnchorTarget

      if (nextSelectedTarget === null && nextExplicitSelectedTargets.length === 0) {
        clearWorkspaceTargetSelection(
          {
            setWorkspaceSelectedTarget,
            selectLight,
            selectPart,
            requestConsoleContextSync,
          },
          {
            syncReason: 'target-selection',
          },
        )
        return
      }

      setWorkspaceExplicitSelection({
        selectedTarget: nextSelectedTarget,
        explicitSelectedTargets: nextExplicitSelectedTargets,
        selectionAnchorTarget: nextSelectionAnchorTarget,
      })
      return
    }

    setWorkspaceExplicitSelection({
      selectedTarget: target,
      explicitSelectedTargets: [...currentTargets, target],
      selectionAnchorTarget: selectionAnchorTarget ?? currentTargets[0] ?? target,
    })
  }

  const handleFocusedObjectRemove = (
    target: Extract<WorkspaceSelectedTarget, { kind: 'object' }>,
  ) => {
    const currentTargets =
      explicitSelectedTargets.length > 0
        ? explicitSelectedTargets
        : selectedTarget === null
          ? []
          : [selectedTarget]
    setFocusedObjectRows((currentRows) =>
      currentRows.filter((row) => row.id !== target.objectId),
    )
    setIncludedFocusedObjectIds((currentIds) => {
      const nextIds = new Set(currentIds)
      nextIds.delete(target.objectId)
      return nextIds
    })
    const nextExplicitSelectedTargets = currentTargets.filter(
      (candidateTarget) =>
        candidateTarget.kind !== 'object' || candidateTarget.objectId !== target.objectId,
    )
    const removedSelectedTarget =
      selectedTarget?.kind === 'object' && selectedTarget.objectId === target.objectId
    const nextSelectedTarget = removedSelectedTarget
      ? (nextExplicitSelectedTargets[0] ?? null)
      : selectedTarget
    const nextSelectionAnchorTarget =
      selectionAnchorTarget?.kind === 'object' && selectionAnchorTarget.objectId === target.objectId
        ? (nextExplicitSelectedTargets[0] ?? null)
        : selectionAnchorTarget

    if (nextSelectedTarget === null && nextExplicitSelectedTargets.length === 0) {
      clearWorkspaceTargetSelection(
        {
          setWorkspaceSelectedTarget,
          selectLight,
          selectPart,
          requestConsoleContextSync,
        },
        {
          syncReason: 'target-selection',
        },
      )
      return
    }

    setWorkspaceExplicitSelection({
      selectedTarget: nextSelectedTarget,
      explicitSelectedTargets: nextExplicitSelectedTargets,
      selectionAnchorTarget: nextSelectionAnchorTarget,
    })
  }

  const renderShellState = (): ReactNode => {
    if (shellState.kind === 'ready') {
      return null
    }
    if (shellState.kind === 'empty') {
      return (
        <section className="SettingsSurfaceGroup" aria-label="Properties shell state">
          <header className="SettingsSurfaceGroupHeader">
            <span className="SettingsSurfaceGroupEyebrow">Shell State</span>
            <strong>No focused item</strong>
            <p>
              The shared shell owns the no-target state before any section body renders. Select an
              object to feed the first hosted `Materials` lane.
            </p>
          </header>
        </section>
      )
    }
    if (shellState.kind === 'unsupported') {
      return (
        <section className="SettingsSurfaceGroup" aria-label="Properties shell state">
          <header className="SettingsSurfaceGroupHeader">
            <span className="SettingsSurfaceGroupEyebrow">Shell State</span>
            <strong>Focused item not supported yet</strong>
            <p>
              The current `Properties` shell only hosts `Materials` for focused objects. This
              target remains visible at the shell level, but later child-lane work is still needed
              before a section can open for it.
            </p>
          </header>
          <div className="SettingsSurfaceRowList" role="list">
            <article className="SettingsSurfaceRowCard" role="listitem">
              <div className="SettingsSurfaceRowCopy">
                <strong>Focused target kind</strong>
                <p>Shell-owned unsupported-state read.</p>
              </div>
              <div className="SettingsSurfaceRowValue" aria-label="Focused target kind">
                {shellState.focusSummary.title}
              </div>
            </article>
            <article className="SettingsSurfaceRowCard" role="listitem">
              <div className="SettingsSurfaceRowCopy">
                <strong>Focused target id</strong>
                <p>Current target the shell cannot route into `Materials` yet.</p>
              </div>
              <div className="SettingsSurfaceRowValue" aria-label="Focused target id">
                {shellState.focusSummary.detail}
              </div>
            </article>
          </div>
        </section>
      )
    }
    return (
      <section className="SettingsSurfaceGroup" aria-label="Properties shell state">
        <header className="SettingsSurfaceGroupHeader">
          <span className="SettingsSurfaceGroupEyebrow">Shell State</span>
          <strong>No hosted sections registered</strong>
          <p>
            The shared `Properties` shell is mounted, but no child sections are registered. This
            state should only appear if later section registration is intentionally deferred.
          </p>
        </header>
      </section>
    )
  }

  const propertiesSurfaceStyle = {
    '--settings-surface-panel-shell-padding': `${workspacePanelShellPaddingPx}px`,
  } as CSSProperties

  return (
    <div
      className="WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--properties PropertiesSurface"
      data-workspace-slot-id={slotId}
      data-workspace-surface-instance-id={surfaceInstanceId}
      data-properties-focus-state={focusSummary.state}
      data-properties-focus-kind={focusSummary.state === 'selected' ? focusSummary.targetKind : 'none'}
      data-properties-active-section={shellState.kind === 'ready' ? activeSection?.id ?? 'none' : 'none'}
      data-properties-shell-state={shellState.kind}
      style={propertiesSurfaceStyle}
    >
      <WorkspacePanelSplitShell
        className="SettingsSurfacePanelShell"
        dataShellKind="properties"
        leftLabel="Properties shell rail"
        rightLabel="Properties content"
        resizeLabel="Resize Properties sections panel"
        left={
          <aside className="SettingsSurfaceRail" aria-label="Properties shell rail">
          <header className="SettingsSurfaceRailHeader">
            <span className="SettingsSurfaceRailEyebrow">Workspace</span>
            <strong>Properties</strong>
            <p>Shared shell, phase 2.</p>
          </header>
          <div
            className="SettingsSurfaceSectionList"
            role="tablist"
            aria-label="Properties sections"
          >
            {sections.map((section) => {
              const isEnabled =
                shellState.kind === 'ready'
                  ? shellState.availableSections.some((availableSection) => availableSection.id === section.id)
                  : false
              const isActive = shellState.kind === 'ready' && section.id === activeSection?.id
              return (
                <button
                  key={section.id}
                  type="button"
                  className={`SettingsSurfaceSectionButton ${isActive ? 'isActive' : ''}`}
                  role="tab"
                  aria-selected={isActive}
                  aria-disabled={isEnabled ? 'false' : 'true'}
                  aria-controls={`properties-section-panel-${section.id}`}
                  id={`properties-section-tab-${section.id}`}
                  disabled={!isEnabled}
                  onClick={() => setActiveSectionId(section.id)}
                >
                  <span className="SettingsSurfaceSectionButtonLabel">{section.label}</span>{' '}
                  <span className="SettingsSurfaceSectionButtonMeta">{section.summary}</span>
                </button>
              )
            })}
          </div>
          </aside>
        }
        right={
          <main className="SettingsSurfaceContent" aria-label="Properties content">
          <header className="SettingsSurfaceContentHeader">
            {focusedObjectRows.length > 0 ? (
              <div className="PropertiesFocusedItemHeader">
                <div>
                  <span className="SettingsSurfaceContentEyebrow">Focused items</span>
                  <h2>
                    {focusedObjectRows.length} selected object
                    {focusedObjectRows.length === 1 ? '' : 's'}
                  </h2>
                </div>
                <div
                  className="PropertiesFocusedItemList"
                  role="list"
                  aria-label="Focused material objects"
                  data-properties-focused-object-list="compact"
                  style={focusedObjectListHeightStyle}
                >
                  {focusedObjectRows.map((row, rowIndex) => {
                    const isActive = selectedTargetKey === workspaceTargetKey(row.target)
                    const isIncluded = includedFocusedObjectIds.has(row.id)
                    return (
                      <div
                        className={`PropertiesFocusedItemRow ${isActive ? 'isActive' : ''} ${
                          isIncluded ? 'isIncluded' : ''
                        }`}
                        role="listitem"
                        key={row.id}
                        data-properties-focused-object-included={isIncluded}
                      >
                        <button
                          type="button"
                          className="PropertiesFocusedItemIncludeButton"
                          aria-label={`${isIncluded ? 'Exclude' : 'Include'} ${row.label} from material assignment`}
                          aria-pressed={isIncluded}
                          data-properties-focused-object-include={row.id}
                          onClick={() => handleFocusedObjectIncludedToggle(row.target)}
                        >
                          <span aria-hidden="true" />
                        </button>
                        <button
                          type="button"
                          className="PropertiesFocusedItemButton"
                          title={row.id}
                          aria-pressed={isActive}
                          data-properties-focused-object-row={row.id}
                          data-properties-focused-object-active={isActive}
                          data-properties-focused-object-included={isIncluded}
                          onClick={() => handleFocusedObjectRowClick(row.target)}
                        >
                          <span className="PropertiesFocusedItemIndex">{rowIndex + 1}</span>
                          <span className="PropertiesFocusedItemCopy">
                            <strong>{row.label}</strong>
                            <span>{row.detail}</span>
                          </span>
                        </button>
                        <button
                          type="button"
                          className="PropertiesFocusedItemRemoveButton"
                          aria-label={`Remove ${row.label} from focused items`}
                          data-properties-focused-object-remove={row.id}
                          onClick={() => handleFocusedObjectRemove(row.target)}
                        >
                          x
                        </button>
                      </div>
                    )
                  })}
                </div>
                <div
                  className="PropertiesFocusedItemListResizeHandle"
                  role="separator"
                  aria-label="Resize focused item list"
                  aria-orientation="horizontal"
                  aria-valuemin={FOCUSED_OBJECT_LIST_MIN_HEIGHT}
                  aria-valuemax={FOCUSED_OBJECT_LIST_MAX_HEIGHT}
                  aria-valuenow={focusedObjectListHeight}
                  tabIndex={0}
                  data-properties-focused-object-list-resize-handle="bottom"
                  onMouseDown={handleFocusedObjectListResizeStart}
                  onKeyDown={handleFocusedObjectListResizeKeyDown}
                />
              </div>
            ) : (
              <div>
                <span className="SettingsSurfaceContentEyebrow">Focused item</span>
                <h2>{focusSummary.title}</h2>
                <p>{focusSummary.detail}</p>
              </div>
            )}
          </header>
          <div
            className="SettingsSurfaceContentBody"
            role="tabpanel"
            id={`properties-section-panel-${activeSection?.id ?? 'none'}`}
            aria-labelledby={`properties-section-tab-${activeSection?.id ?? 'none'}`}
          >
            {shellState.kind === 'ready'
              ? activeSection?.renderContent(shellState.sectionContext)
              : renderShellState()}
          </div>
          </main>
        }
      />
    </div>
  )
}
