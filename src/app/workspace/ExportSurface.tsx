import { useMemo, useState } from 'react'
import {
  getExportWorkspaceTargetKey,
  useAppStore,
  type ExportWorkspaceTarget,
  type GraphDocumentExportStatus,
} from '../store/useAppStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import type { WorkspaceViewportSlotId } from './workspaceShellTypes'

type ExportSurfaceProps = {
  slotId?: WorkspaceViewportSlotId
  surfaceInstanceId: string
}

type ExportFormatOption = {
  id: 'step' | 'stl' | 'obj' | 'glb'
  label: string
  description: string
  enabled: boolean
}

type ExportFormatSettingsView = {
  formatId: ExportFormatOption['id']
  heading: string
  note: string
  controlsEnabled: boolean
  rows: Array<{
    label: string
    value: string
  }>
}

type ExportNeighborActionView = {
  id: 'geometry-step' | 'graph-file' | 'project-file' | 'spaghetti-file'
  label: string
  owner: string
  status: string
  description: string
}

const EXPORT_FORMAT_OPTIONS: readonly ExportFormatOption[] = [
  {
    id: 'step',
    label: 'STEP',
    description: 'Authoritative B-rep CAD export',
    enabled: true,
  },
  {
    id: 'stl',
    label: 'STL',
    description: 'Mesh writer not wired yet',
    enabled: false,
  },
  {
    id: 'obj',
    label: 'OBJ',
    description: 'Scene mesh writer not wired yet',
    enabled: false,
  },
  {
    id: 'glb',
    label: 'GLB',
    description: 'Scene package writer not wired yet',
    enabled: false,
  },
] as const

const EXPORT_FORMAT_SETTINGS: Record<ExportFormatOption['id'], ExportFormatSettingsView> = {
  step: {
    formatId: 'step',
    heading: 'STEP CAD Settings',
    note: 'STEP exports from retained authoritative B-rep geometry. Mesh detail controls do not apply.',
    controlsEnabled: true,
    rows: [
      { label: 'Geometry source', value: 'Authoritative worker B-rep' },
      { label: 'Shape ownership', value: 'Graph document target' },
      { label: 'Viewer mesh export', value: 'Off' },
    ],
  },
  stl: {
    formatId: 'stl',
    heading: 'STL Mesh Settings',
    note: 'STL mesh export settings are deferred until the worker mesh writer exists.',
    controlsEnabled: false,
    rows: [
      { label: 'Writer status', value: 'Not wired yet' },
      { label: 'Geometry source', value: 'Deferred worker mesh writer' },
      { label: 'Viewer mesh export', value: 'Off' },
    ],
  },
  obj: {
    formatId: 'obj',
    heading: 'OBJ Scene Settings',
    note: 'OBJ scene export settings are deferred until the worker scene writer exists.',
    controlsEnabled: false,
    rows: [
      { label: 'Writer status', value: 'Not wired yet' },
      { label: 'Geometry source', value: 'Deferred worker scene writer' },
      { label: 'Viewer mesh export', value: 'Off' },
    ],
  },
  glb: {
    formatId: 'glb',
    heading: 'GLB Package Settings',
    note: 'GLB package export settings are deferred until the worker package writer exists.',
    controlsEnabled: false,
    rows: [
      { label: 'Writer status', value: 'Not wired yet' },
      { label: 'Geometry source', value: 'Deferred worker package writer' },
      { label: 'Viewer mesh export', value: 'Off' },
    ],
  },
}

const EXPORT_NEIGHBOR_ACTIONS: readonly ExportNeighborActionView[] = [
  {
    id: 'geometry-step',
    label: 'Geometry export',
    owner: 'Export / Worker',
    status: 'Available for STEP',
    description: 'True B-rep STEP output from authoritative worker geometry.',
  },
  {
    id: 'graph-file',
    label: 'Graph file',
    owner: 'Graph persistence / Browser',
    status: 'Available in Browser',
    description: 'Save Graph File writes graph document JSON, separate from geometry export.',
  },
  {
    id: 'project-file',
    label: 'Project file',
    owner: 'Project persistence',
    status: 'Deferred',
    description: 'Durable project save/load stays with the project persistence owner.',
  },
  {
    id: 'spaghetti-file',
    label: 'Spaghetti file',
    owner: 'Graph persistence',
    status: 'Deferred graph-file path',
    description: 'Spaghetti document save follows graph persistence, not B-rep export.',
  },
] as const


const statusLabel = (status: GraphDocumentExportStatus | undefined): string => {
  if (status === undefined || status.status === 'idle') {
    return 'Idle'
  }
  if (status.status === 'pending') {
    return 'Preparing authoritative geometry'
  }
  if (status.status === 'blocked') {
    return 'Blocked'
  }
  if (status.status === 'exporting') {
    return 'Exporting STEP'
  }
  if (status.status === 'success') {
    return `Ready: ${status.filename}`
  }
  return `Failed: ${status.message}`
}

const statusDetail = (status: GraphDocumentExportStatus | undefined): string => {
  if (status === undefined || status.status === 'idle') {
    return 'No export request has run for this graph in this session.'
  }
  if (status.status === 'pending') {
    return status.buildRequestId === undefined
      ? 'Waiting for an authoritative build to start.'
      : `Waiting on build ${status.buildRequestId}.`
  }
  if (status.status === 'blocked') {
    return status.message
  }
  if (status.status === 'exporting') {
    return `Worker request ${status.requestId} is writing from retained B-rep geometry.`
  }
  if (status.status === 'success') {
    return `Downloaded ${status.format.toUpperCase()} from build ${status.buildRequestId}.`
  }
  return `Worker request ${status.requestId} did not complete.`
}

const statusBlocksExport = (status: GraphDocumentExportStatus | undefined): boolean =>
  status?.status === 'pending' || status?.status === 'blocked' || status?.status === 'exporting'

type ExportTargetRowVm = {
  key: string
  target: ExportWorkspaceTarget
  label: string
  detail: string
  canExportStep: boolean
  isFallback: boolean
}

const formatTargetKind = (target: ExportWorkspaceTarget): string => {
  switch (target.kind) {
    case 'graph-document':
      return 'Graph document'
    case 'graph-node':
      return 'Graph node'
    case 'reference-item':
      return 'Reference'
    case 'assembly':
      return 'Assembly'
    case 'component':
      return 'Component'
    case 'object':
      return 'Object'
    case 'part':
      return 'Part'
  }
}

const formatTargetLabel = (
  target: ExportWorkspaceTarget,
  graphDocumentsById: ReturnType<typeof useSpaghettiStore.getState>['graphDocumentsById'],
): string => {
  switch (target.kind) {
    case 'graph-document':
      return graphDocumentsById[target.graphDocumentId]?.name ?? target.graphDocumentId
    case 'graph-node':
      return target.nodeId
    case 'reference-item':
      return target.referenceId
    case 'assembly':
      return target.assemblyId
    case 'component':
      return target.componentId
    case 'object':
      return target.objectId
    case 'part':
      return target.partKey
  }
}

const formatTargetDetail = (target: ExportWorkspaceTarget, key: string): string => {
  if (target.kind === 'graph-node') {
    return `${target.graphDocumentId} / ${target.nodeId}`
  }
  return key
}

export function ExportSurface(props: ExportSurfaceProps) {
  const { slotId, surfaceInstanceId } = props
  const [selectedFormat, setSelectedFormat] = useState<ExportFormatOption['id']>('step')
  const activeGraphDocument = useSpaghettiStore((state) =>
    state.graphDocumentsById[state.activeGraphDocumentId] ?? null,
  )
  const graphDocumentsById = useSpaghettiStore((state) => state.graphDocumentsById)
  const runtime = useSpaghettiStore((state) =>
    activeGraphDocument === null
      ? null
      : state.graphRuntimeByDocumentId[activeGraphDocument.graphDocumentId] ?? null,
  )
  const graphDocumentExportStatusById = useAppStore(
    (state) => state.graphDocumentExportStatusById,
  )
  const requestGraphDocumentStepExport = useAppStore(
    (state) => state.requestGraphDocumentStepExport,
  )
  const exportWorkspaceTargets = useAppStore((state) => state.exportWorkspaceTargets)
  const activeExportWorkspaceTargetKey = useAppStore(
    (state) => state.activeExportWorkspaceTargetKey,
  )
  const replaceExportWorkspaceTargetsFromSelection = useAppStore(
    (state) => state.replaceExportWorkspaceTargetsFromSelection,
  )
  const removeExportWorkspaceTarget = useAppStore((state) => state.removeExportWorkspaceTarget)
  const setActiveExportWorkspaceTarget = useAppStore(
    (state) => state.setActiveExportWorkspaceTarget,
  )
  const selectedFormatOption = useMemo(
    () =>
      EXPORT_FORMAT_OPTIONS.find((option) => option.id === selectedFormat) ??
      EXPORT_FORMAT_OPTIONS[0],
    [selectedFormat],
  )
  const selectedFormatSettings = EXPORT_FORMAT_SETTINGS[selectedFormatOption.id]
  const hasAuthoritativeGeometry =
    runtime?.acceptedAuthoritativeGeometryResult !== null &&
    runtime?.acceptedAuthoritativeGeometryResult !== undefined
  const fallbackTargetRow = useMemo<ExportTargetRowVm | null>(() => {
    if (activeGraphDocument === null) {
      return null
    }
    const target: ExportWorkspaceTarget = {
      kind: 'graph-document',
      graphDocumentId: activeGraphDocument.graphDocumentId,
    }
    return {
      key: getExportWorkspaceTargetKey(target),
      target,
      label: activeGraphDocument.name,
      detail: activeGraphDocument.graphDocumentId,
      canExportStep: true,
      isFallback: true,
    }
  }, [activeGraphDocument])
  const targetRows = useMemo<ExportTargetRowVm[]>(() => {
    if (exportWorkspaceTargets.length === 0) {
      return fallbackTargetRow === null ? [] : [fallbackTargetRow]
    }
    return exportWorkspaceTargets.map((target) => {
      const key = getExportWorkspaceTargetKey(target)
      return {
        key,
        target,
        label: formatTargetLabel(target, graphDocumentsById),
        detail: formatTargetDetail(target, key),
        canExportStep: target.kind === 'graph-document',
        isFallback: false,
      }
    })
  }, [exportWorkspaceTargets, fallbackTargetRow, graphDocumentsById])
  const activeTargetRow =
    targetRows.find((row) => row.key === activeExportWorkspaceTargetKey) ?? targetRows[0] ?? null
  const activeGraphDocumentIdForExport =
    activeTargetRow !== null && activeTargetRow.target.kind === 'graph-document'
      ? activeTargetRow.target.graphDocumentId
      : null
  const activeStatus =
    activeGraphDocumentIdForExport === null
      ? undefined
      : graphDocumentExportStatusById[activeGraphDocumentIdForExport]
  const selectedTargetAllowsStep = activeTargetRow?.canExportStep === true
  const exportDisabled =
    activeTargetRow === null ||
    !selectedTargetAllowsStep ||
    selectedFormatOption.id !== 'step' ||
    !selectedFormatOption.enabled ||
    statusBlocksExport(activeStatus)
  const exportDisabledReason =
    activeTargetRow === null
      ? 'No export target'
      : !selectedTargetAllowsStep
        ? 'Target review only'
      : selectedFormatOption.id !== 'step' || !selectedFormatOption.enabled
        ? 'Format not wired yet'
        : statusBlocksExport(activeStatus)
          ? statusLabel(activeStatus)
          : 'Ready to request STEP'

  return (
    <section
      className="ExportSurface WorkspaceViewportSlotSurface WorkspaceViewportSlotSurface--export"
      data-workspace-slot-id={slotId}
      data-workspace-surface-instance-id={surfaceInstanceId}
      aria-label="Export workspace"
    >
      <header className="ExportSurfaceHeader">
        <span className="ExportSurfaceEyebrow">Workspace</span>
        <h2>Export</h2>
        <p>Prepare an authoritative export job from graph-owned geometry.</p>
        <div className="ExportSurfaceInlineAction" aria-label="Export action">
          <div>
            <span className="ExportSurfaceEyebrow">Action</span>
            <strong>{statusLabel(activeStatus)}</strong>
            <p className="ExportSurfaceStatusDetail">{statusDetail(activeStatus)}</p>
          </div>
          <button
            type="button"
            className="ExportSurfacePrimaryAction"
            disabled={exportDisabled}
            title={exportDisabledReason}
            onClick={() => {
              if (
                activeGraphDocumentIdForExport === null ||
                selectedFormatOption.id !== 'step' ||
                !selectedTargetAllowsStep
              ) {
                return
              }
              requestGraphDocumentStepExport(activeGraphDocumentIdForExport)
            }}
          >
            Export STEP
          </button>
          <p className="ExportSurfaceActionHint">{exportDisabledReason}</p>
        </div>
      </header>

      <div className="ExportSurfaceGrid">
        <section className="ExportSurfacePanel" aria-label="Export targets">
          <div className="ExportSurfacePanelHeader">
            <span className="ExportSurfaceEyebrow">Targets</span>
            <strong>Export Review</strong>
          </div>
          <button
            type="button"
            className="ExportSurfaceSecondaryAction"
            onClick={() => replaceExportWorkspaceTargetsFromSelection()}
          >
            Use Selection
          </button>
          {targetRows.length === 0 ? (
            <p className="ExportSurfaceEmpty">No graph document is active.</p>
          ) : (
            <div className="ExportSurfaceTargetList">
              {targetRows.map((row) => (
                <div
                  key={row.key}
                  className={`ExportSurfaceTargetCard${
                    activeTargetRow?.key === row.key ? ' isActive' : ''
                  }`}
                >
                  <button
                    type="button"
                    className="ExportSurfaceTargetSelect"
                    aria-pressed={activeTargetRow?.key === row.key}
                    onClick={() => setActiveExportWorkspaceTarget(row.isFallback ? null : row.key)}
                  >
                    <strong>{row.label}</strong>
                    <span>{formatTargetKind(row.target)}</span>
                    <em>
                      {row.canExportStep
                        ? hasAuthoritativeGeometry
                          ? 'Authoritative B-rep result is retained'
                          : 'Authoritative B-rep will be prepared on export'
                        : 'Target review only'}
                    </em>
                    <small>{row.detail}</small>
                  </button>
                  {!row.isFallback ? (
                    <button
                      type="button"
                      className="ExportSurfaceTargetRemove"
                      aria-label={`Remove ${row.label} from export targets`}
                      onClick={() => removeExportWorkspaceTarget(row.key)}
                    >
                      x
                    </button>
                  ) : null}
                </div>
              ))}
            </div>
          )}
        </section>

        <section className="ExportSurfacePanel" aria-label="Export formats">
          <div className="ExportSurfacePanelHeader">
            <span className="ExportSurfaceEyebrow">Format</span>
            <strong>Output Type</strong>
          </div>
          <div className="ExportSurfaceFormatList">
            {EXPORT_FORMAT_OPTIONS.map((option) => (
              <button
                key={option.id}
                type="button"
                className={`ExportSurfaceFormatButton${
                  selectedFormat === option.id ? ' isActive' : ''
                }`}
                aria-pressed={selectedFormat === option.id}
                onClick={() => setSelectedFormat(option.id)}
              >
                <span>{option.label}</span>
                <small>{option.enabled ? option.description : 'Not wired yet'}</small>
              </button>
            ))}
          </div>
        </section>

        <section className="ExportSurfacePanel" aria-label="Export settings">
          <div className="ExportSurfacePanelHeader">
            <span className="ExportSurfaceEyebrow">Settings</span>
            <strong>{selectedFormatSettings.heading}</strong>
          </div>
          <dl className="ExportSurfaceReadout">
            {selectedFormatSettings.rows.map((row) => (
              <div key={`${selectedFormatSettings.formatId}:${row.label}`}>
                <dt>{row.label}</dt>
                <dd>{row.value}</dd>
              </div>
            ))}
          </dl>
          <p className="ExportSurfaceSettingsNote">{selectedFormatSettings.note}</p>
          {!selectedFormatSettings.controlsEnabled ? (
            <p className="ExportSurfaceSettingsDeferred">Executable controls deferred</p>
          ) : null}
        </section>

        <section className="ExportSurfacePanel" aria-label="Related outputs">
          <div className="ExportSurfacePanelHeader">
            <span className="ExportSurfaceEyebrow">Neighbors</span>
            <strong>Related Outputs</strong>
          </div>
          <div className="ExportSurfaceNeighborList">
            {EXPORT_NEIGHBOR_ACTIONS.map((neighbor) => (
              <article key={neighbor.id} className="ExportSurfaceNeighborCard">
                <div className="ExportSurfaceNeighborHeader">
                  <strong>{neighbor.label}</strong>
                  <span>{neighbor.status}</span>
                </div>
                <dl className="ExportSurfaceReadout ExportSurfaceReadout--compact">
                  <div>
                    <dt>Owner</dt>
                    <dd>{neighbor.owner}</dd>
                  </div>
                </dl>
                <p>{neighbor.description}</p>
              </article>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}
