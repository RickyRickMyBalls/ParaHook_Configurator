import { useMemo, type CSSProperties } from 'react'
import {
  selectViewerTargetGraph,
  selectViewerTargetGraphAcceptedBuildOutputs,
  selectViewerTargetGraphCompileResult,
  selectViewerTargetGraphOutputSurface,
  useSpaghettiStore,
} from '../store/useSpaghettiStore'
import { selectDebugInspectorVm } from '../selectors/selectDebugInspectorVm'
import { useAppStore } from '../../store/useAppStore'

type DebugInspectorDrawerProps = {
  isOpen: boolean
  onToggle: () => void
  style?: CSSProperties
}

const renderValue = (value: string | null): string => value ?? '-'

export function DebugInspectorDrawer({ isOpen, onToggle, style }: DebugInspectorDrawerProps) {
  const graph = useSpaghettiStore(selectViewerTargetGraph)
  const buildOutputs = useSpaghettiStore(selectViewerTargetGraphAcceptedBuildOutputs)
  const compileResult = useSpaghettiStore(selectViewerTargetGraphCompileResult)
  const outputSurface = useSpaghettiStore(selectViewerTargetGraphOutputSurface)
  const inputMode = useAppStore((state) => state.inputMode)
  const viewMode = useAppStore((state) => state.viewMode)

  const debugVm = useMemo(
    () =>
      selectDebugInspectorVm({
        graph:
          graph ?? {
            schemaVersion: 1,
            nodes: [],
            edges: [],
          },
        outputSurface,
        buildOutputs,
        compileResult,
        inputMode,
        viewMode,
      }),
    [buildOutputs, compileResult, graph, inputMode, outputSurface, viewMode],
  )

  return (
    <section className={`SpaghettiDebugDrawer ${isOpen ? 'isOpen' : ''}`} style={style}>
      <button
        type="button"
        className="SpaghettiDebugDrawerToggle"
        onClick={onToggle}
        aria-expanded={isOpen}
      >
        <span>Debug Inspector</span>
        <span>{isOpen ? 'Hide' : 'Show'}</span>
      </button>

      {isOpen ? (
        <div className="SpaghettiDebugDrawerBody">
          <section className="SpaghettiDebugSection">
            <div className="SpaghettiDebugSectionHeader">
              <h3>Compile</h3>
              <span>{debugVm.compile.compiledArtifactsCount} artifact(s)</span>
            </div>
            <div className="SpaghettiDebugMetaGrid">
              <div>
                <span>Last compile</span>
                <strong>
                  {!debugVm.compile.hasCompile
                    ? 'Not run'
                    : debugVm.compile.ok
                      ? 'OK'
                      : 'Errors'}
                </strong>
              </div>
              <div>
                <span>Ordered part keys</span>
                <strong>
                  {debugVm.compile.orderedPartKeys.length > 0
                    ? debugVm.compile.orderedPartKeys.join(', ')
                    : '-'}
                </strong>
              </div>
            </div>
            <div className="SpaghettiDebugTable" role="table" aria-label="Compile artifacts">
              <div className="SpaghettiDebugTableRow SpaghettiDebugTableRow--header" role="row">
                <span role="columnheader">artifact id</span>
                <span role="columnheader">label</span>
                <span role="columnheader">partKey</span>
                <span role="columnheader">partKeyStr</span>
              </div>
              {debugVm.compile.artifacts.length === 0 ? (
                <div className="SpaghettiDebugTableEmpty">No artifacts received.</div>
              ) : (
                debugVm.compile.artifacts.map((artifact) => (
                  <div
                    key={`${artifact.partKeyStr}:${artifact.id}`}
                    className="SpaghettiDebugTableRow"
                    role="row"
                  >
                    <span>{artifact.id}</span>
                    <span>{artifact.label}</span>
                    <span>{artifact.partKey}</span>
                    <span>{artifact.partKeyStr}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="SpaghettiDebugSection">
            <div className="SpaghettiDebugSectionHeader">
              <h3>OutputPreview</h3>
              <span>{debugVm.outputPreview.slots.length} slot(s)</span>
            </div>
            <div className="SpaghettiDebugMetaGrid">
              <div>
                <span>OutputPreview node</span>
                <strong>{renderValue(debugVm.outputPreview.nodeId)}</strong>
              </div>
            </div>
            <div className="SpaghettiDebugTable" role="table" aria-label="OutputPreview slots">
              <div className="SpaghettiDebugTableRow SpaghettiDebugTableRow--header" role="row">
                <span role="columnheader">slotId</span>
                <span role="columnheader">state</span>
                <span role="columnheader">sourceNodeId</span>
                <span role="columnheader">sourcePartKeyStr</span>
                <span role="columnheader">artifactPartKeyStr</span>
              </div>
              {debugVm.outputPreview.slots.length === 0 ? (
                <div className="SpaghettiDebugTableEmpty">No OutputPreview slots found.</div>
              ) : (
                debugVm.outputPreview.slots.map((slot) => (
                  <div key={slot.slotId} className="SpaghettiDebugTableRow" role="row">
                    <span>{slot.slotId}</span>
                    <span>{slot.state}</span>
                    <span>{renderValue(slot.sourceNodeId)}</span>
                    <span>{renderValue(slot.sourcePartKeyStr)}</span>
                    <span>{renderValue(slot.artifactPartKeyStr)}</span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="SpaghettiDebugSection">
            <div className="SpaghettiDebugSectionHeader">
              <h3>Preview VM</h3>
              <span>{debugVm.previewVm.renderEntryCount} render entr{debugVm.previewVm.renderEntryCount === 1 ? 'y' : 'ies'}</span>
            </div>
            <div className="SpaghettiDebugTable" role="table" aria-label="Preview VM entries">
              <div className="SpaghettiDebugTableRow SpaghettiDebugTableRow--header" role="row">
                <span role="columnheader">viewerKey</span>
                <span role="columnheader">slotId</span>
                <span role="columnheader">sourceNodeId</span>
                <span role="columnheader">sourcePartKeyStr</span>
                <span role="columnheader">artifact</span>
              </div>
              {debugVm.previewVm.entries.length === 0 ? (
                <div className="SpaghettiDebugTableEmpty">No preview render entries.</div>
              ) : (
                debugVm.previewVm.entries.map((entry) => (
                  <div
                    key={`${entry.viewerKey}:${entry.slotId}:${entry.sourceNodeId}`}
                    className="SpaghettiDebugTableRow"
                    role="row"
                  >
                    <span>{entry.viewerKey}</span>
                    <span>{entry.slotId}</span>
                    <span>{entry.sourceNodeId}</span>
                    <span>{entry.sourcePartKeyStr}</span>
                    <span>
                      {entry.sourceArtifactPartKeyStr === null
                        ? '-'
                        : `${entry.sourceArtifactId} / ${entry.sourceArtifactPartKeyStr}`}
                    </span>
                  </div>
                ))
              )}
            </div>
          </section>

          <section className="SpaghettiDebugSection">
            <div className="SpaghettiDebugSectionHeader">
              <h3>Viewer</h3>
              <span>{debugVm.viewer.renderableEntryCount} renderable entr{debugVm.viewer.renderableEntryCount === 1 ? 'y' : 'ies'}</span>
            </div>
            <div className="SpaghettiDebugMetaGrid">
              <div>
                <span>Receives preview input</span>
                <strong>{debugVm.viewer.receivesPreviewInput ? 'Yes' : 'No'}</strong>
              </div>
              <div>
                <span>Reason</span>
                <strong>{debugVm.viewer.reason}</strong>
              </div>
            </div>
            <div className="SpaghettiDebugTable" role="table" aria-label="ViewerHost input">
              <div className="SpaghettiDebugTableRow SpaghettiDebugTableRow--header" role="row">
                <span role="columnheader">viewerKey</span>
                <span role="columnheader">artifact id</span>
                <span role="columnheader">label</span>
                <span role="columnheader">partKey</span>
                <span role="columnheader">partKeyStr</span>
              </div>
              {debugVm.viewer.entries.length === 0 ? (
                <div className="SpaghettiDebugTableEmpty">ViewerHost has no preview renderables.</div>
              ) : (
                debugVm.viewer.entries.map((entry) => (
                  <div
                    key={`${entry.viewerKey}:${entry.artifactPartKeyStr}`}
                    className="SpaghettiDebugTableRow"
                    role="row"
                  >
                    <span>{entry.viewerKey}</span>
                    <span>{entry.artifactId}</span>
                    <span>{entry.artifactLabel}</span>
                    <span>{entry.artifactPartKey}</span>
                    <span>{entry.artifactPartKeyStr}</span>
                  </div>
                ))
              )}
            </div>
          </section>
        </div>
      ) : null}
    </section>
  )
}
