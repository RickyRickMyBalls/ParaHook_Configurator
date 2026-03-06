import { useMemo } from 'react'
import { getFeatureDiagnostics, type FeatureDiagnostic } from '../features/diagnostics'
import type { FeatureDependencyRow } from '../features/featureDependencies'
import { listEffectiveInputPorts } from '../features/effectivePorts'
import { canMoveFeatureInStack } from '../features/featureDependencies'
import { readFeatureStack } from '../features/featureSchema'
import {
  buildExtrudeDepthVirtualInputPortId,
  buildExtrudeOffsetVirtualInputPortId,
  buildExtrudeTaperVirtualInputPortId,
  buildSketchRectLengthVirtualInputPortId,
  buildSketchRectWidthVirtualInputPortId,
  isFeatureVirtualInputPortId,
} from '../features/featureVirtualPorts'
import type { ExtrudeFeature } from '../features/featureTypes'
import { isFeatureEnabled } from '../features/featureTypes'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from '../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../spInteractive'
import {
  ExtrudeFeatureView,
  type FeatureInputWiringBridge,
} from './features/ExtrudeFeatureView'
import { SketchFeatureView } from './features/SketchFeatureView'
import { CloseProfileFeatureView } from './features/CloseProfileFeatureView'
import {
  formatStableNumber,
  labelProfilesForPreview,
  type PreviewProfileWithLabel,
} from './features/profilePreview'

type FeatureStackViewProps = {
  node: SpaghettiNode
  mode?: 'summary' | 'full'
  isGroupCollapsed?: (groupId: string) => boolean
  onToggleGroup?: (groupId: string) => void
  featureVirtualInputStateByPortId?: Record<
    string,
    {
      driven: boolean
      connectionCount: number
      unresolved: boolean
      drivenValue?: number
    }
  >
  featureInputWiring?: FeatureInputWiringBridge
  featureRows?: readonly FeatureDependencyRow[]
  onRegisterFeatureRowElement?: (rowId: string, element: HTMLDivElement | null) => void
}

type DiagnosticLevel = 'error' | 'warning' | 'info'

type DiagnosticCounts = {
  error: number
  warning: number
  info: number
}

const emptyProfileSet = new Set<string>()

const shortId = (id: string): string => id.slice(0, 8)

const isPartNodeForFeatureStack = (node: SpaghettiNode): boolean => {
  const maybeKind = (node as Record<string, unknown>).kind
  if (maybeKind === 'part') {
    return true
  }
  return node.type.startsWith('Part/')
}

const levelRank = (level: string): number => {
  if (level === 'error') return 0
  if (level === 'warning') return 1
  return 2
}

const compareDiagnostics = (a: FeatureDiagnostic, b: FeatureDiagnostic): number =>
  levelRank(a.level) - levelRank(b.level) ||
  a.code.localeCompare(b.code) ||
  a.message.localeCompare(b.message) ||
  a.featureId.localeCompare(b.featureId)

const toDiagnosticLevel = (level: string): DiagnosticLevel =>
  level === 'error' || level === 'warning' ? level : 'info'

const countDiagnostics = (diagnostics: readonly FeatureDiagnostic[]): DiagnosticCounts => {
  const counts: DiagnosticCounts = { error: 0, warning: 0, info: 0 }
  for (const diagnostic of diagnostics) {
    counts[toDiagnosticLevel(diagnostic.level)] += 1
  }
  return counts
}

const withDiagnosticKeys = (diagnostics: readonly FeatureDiagnostic[]) => {
  const duplicates = new Map<string, number>()
  return diagnostics.map((diagnostic) => {
    const base = `${diagnostic.featureId}|${diagnostic.level}|${diagnostic.code}|${diagnostic.message}`
    const seen = duplicates.get(base) ?? 0
    duplicates.set(base, seen + 1)
    return {
      diagnostic,
      key: seen === 0 ? base : `${base}|${seen}`,
    }
  })
}

const extrudeSummary = (
  feature: ExtrudeFeature,
  sketchProfilesByFeatureId: ReadonlyMap<string, PreviewProfileWithLabel[]>,
  closeProfileResolvedByFeatureId: ReadonlyMap<
    string,
    { sourceFeatureId: string; profileId: string; profileIndex: number }
  >,
): string => {
  const rawProfileRef = feature.inputs.profileRef
  const profileRef =
    rawProfileRef === null
      ? null
      : closeProfileResolvedByFeatureId.get(rawProfileRef.sourceFeatureId) ?? rawProfileRef
  const depth = formatStableNumber(feature.params.depth.value)
  if (profileRef === null) {
    return `Profile: -, Depth: ${depth}`
  }
  const sourceProfiles = sketchProfilesByFeatureId.get(profileRef.sourceFeatureId) ?? []
  const selectedProfile = sourceProfiles.find((profile) => profile.profileId === profileRef.profileId)
  if (selectedProfile === undefined) {
    return `Profile: -, Depth: ${depth}`
  }
  return `Profile: ${shortId(profileRef.sourceFeatureId)}/${selectedProfile.label}, Depth: ${depth}`
}

export function FeatureStackView({
  node,
  mode = 'full',
  isGroupCollapsed,
  onToggleGroup,
  featureVirtualInputStateByPortId,
  featureInputWiring,
  featureRows,
  onRegisterFeatureRowElement,
}: FeatureStackViewProps) {
  const addSketchFeature = useSpaghettiStore((state) => state.addSketchFeature)
  const addCloseProfileFeature = useSpaghettiStore((state) => state.addCloseProfileFeature)
  const addExtrudeFeature = useSpaghettiStore((state) => state.addExtrudeFeature)
  const toggleFeatureCollapsed = useSpaghettiStore((state) => state.toggleFeatureCollapsed)
  const moveFeatureUp = useSpaghettiStore((state) => state.moveFeatureUp)
  const moveFeatureDown = useSpaghettiStore((state) => state.moveFeatureDown)
  const setFeatureEnabled = useSpaghettiStore((state) => state.setFeatureEnabled)
  const featureStackIr = useSpaghettiStore((state) => state.getPartFeatureStackIrForNode(node.nodeId))

  const stack = useMemo(() => readFeatureStack(node.params.featureStack), [node.params.featureStack])
  const sketchProfilesByFeatureId = useMemo(() => {
    const next = new Map<string, PreviewProfileWithLabel[]>()
    if (featureStackIr === null) return next
    for (const operation of featureStackIr) {
      if (operation.op !== 'sketch') continue
      next.set(
        operation.featureId,
        labelProfilesForPreview(
          operation.profilesResolved.map((profile) => ({
            profileId: profile.profileId,
            area: profile.area,
            vertices: profile.verticesProxy,
          })),
        ),
      )
    }
    return next
  }, [featureStackIr])
  const closeProfileResolvedByFeatureId = useMemo(() => {
    const next = new Map<string, { sourceFeatureId: string; profileId: string; profileIndex: number }>()
    if (featureStackIr === null) return next
    for (const operation of featureStackIr) {
      if (operation.op !== 'closeProfile' || operation.profileRefResolved === null) continue
      next.set(operation.featureId, {
        sourceFeatureId: operation.profileRefResolved.sketchFeatureId,
        profileId: operation.profileRefResolved.profileId,
        profileIndex: operation.profileRefResolved.profileIndex,
      })
    }
    return next
  }, [featureStackIr])
  const highlightedProfilesBySketchFeatureId = useMemo(() => {
    const next = new Map<string, Set<string>>()
    for (const feature of stack) {
      if (feature.type !== 'extrude' || feature.inputs.profileRef === null) continue
      const viaClose = closeProfileResolvedByFeatureId.get(feature.inputs.profileRef.sourceFeatureId)
      const sourceSketchId = viaClose?.sourceFeatureId ?? feature.inputs.profileRef.sourceFeatureId
      const profileSet = next.get(sourceSketchId) ?? new Set<string>()
      profileSet.add(viaClose?.profileId ?? feature.inputs.profileRef.profileId)
      next.set(sourceSketchId, profileSet)
    }
    return next
  }, [closeProfileResolvedByFeatureId, stack])
  const diagnosticsByFeatureId = useMemo(() => {
    const sorted = [...getFeatureDiagnostics(stack)].sort(compareDiagnostics)
    const next = new Map<string, FeatureDiagnostic[]>()
    for (const diagnostic of sorted) {
      const list = next.get(diagnostic.featureId) ?? []
      list.push(diagnostic)
      next.set(diagnostic.featureId, list)
    }
    return next
  }, [stack])
  const virtualFeatureInputsByPortId = useMemo(() => {
    const next = new Map<string, ReturnType<typeof listEffectiveInputPorts>[number]>()
    for (const port of listEffectiveInputPorts(node)) {
      if (!isFeatureVirtualInputPortId(port.portId)) continue
      next.set(port.portId, port)
    }
    return next
  }, [node])
  const featureRowByFeatureId = useMemo(
    () => new Map((featureRows ?? []).map((row) => [row.featureId, row])),
    [featureRows],
  )

  if (!isPartNodeForFeatureStack(node)) return null

  const showFullEditors = mode === 'full'
  const sectionCollapsed = isGroupCollapsed !== undefined ? isGroupCollapsed : undefined

  return (
    <section className="SpaghettiFeatureStack">
      <div className="SpaghettiFeatureStackHeader">
        <div className="SpaghettiFeatureStackTitle">Feature Stack</div>
        {showFullEditors ? (
          <div className="SpaghettiFeatureStackActions">
            <button type="button" {...SP_INTERACTIVE_PROPS} onClick={() => addSketchFeature(node.nodeId)}>
              + Sketch
            </button>
            <button
              type="button"
              {...SP_INTERACTIVE_PROPS}
              onClick={() => addCloseProfileFeature(node.nodeId)}
            >
              + Close Profile
            </button>
            <button type="button" {...SP_INTERACTIVE_PROPS} onClick={() => addExtrudeFeature(node.nodeId)}>
              + Extrude
            </button>
          </div>
        ) : null}
      </div>

      {stack.length === 0 ? <div className="SpaghettiFeatureEmpty">No features yet.</div> : null}

      {stack.map((feature, index) => {
        const featureDiagnostics = diagnosticsByFeatureId.get(feature.featureId) ?? []
        const summary =
          feature.type === 'sketch'
            ? `Sketch: ${(sketchProfilesByFeatureId.get(feature.featureId) ?? []).length} profiles`
            : feature.type === 'closeProfile'
              ? `Close Profile: ${feature.outputs.profileRef === null ? 'unresolved' : shortId(feature.outputs.profileRef.profileId)}`
              : extrudeSummary(feature, sketchProfilesByFeatureId, closeProfileResolvedByFeatureId)
        const diagnosticCounts = countDiagnostics(featureDiagnostics)
        const featureCollapsed =
          sectionCollapsed === undefined ? feature.uiState.collapsed : sectionCollapsed(feature.featureId)
        const featureEnabled = isFeatureEnabled(feature)
        const featureRow = featureRowByFeatureId.get(feature.featureId)
        const featureRowId = featureRow?.rowId ?? `feature:${feature.featureId}`
        const featureEffective = featureRow?.effective ?? featureEnabled
        const canMoveUp = showFullEditors && canMoveFeatureInStack(stack, feature.featureId, 'up')
        const canMoveDown =
          showFullEditors && canMoveFeatureInStack(stack, feature.featureId, 'down')
        return (
          <div
            key={feature.featureId}
            ref={(element) => onRegisterFeatureRowElement?.(featureRowId, element)}
            className={`SpaghettiFeatureItem ${featureEnabled ? '' : 'SpaghettiFeatureItem--disabled'} ${
              featureEffective ? '' : 'SpaghettiFeatureItem--inactive'
            }`}
            data-sp-feature-row-id={featureRowId}
            data-sp-feature-id={feature.featureId}
          >
            <div className="SpaghettiFeatureRowShell">
              <button
                type="button"
                className="SpaghettiFeatureRow"
                data-sp-feature-row-anchor-id={featureRowId}
                {...SP_INTERACTIVE_PROPS}
                aria-expanded={!featureCollapsed}
                onClick={() => {
                  if (onToggleGroup !== undefined) {
                    onToggleGroup(feature.featureId)
                    return
                  }
                  toggleFeatureCollapsed(node.nodeId, feature.featureId)
                }}
              >
                <span className="SpaghettiFeatureType">
                  {feature.type === 'sketch'
                    ? 'Sketch'
                    : feature.type === 'closeProfile'
                      ? 'Close Profile'
                      : 'Extrude'}
                </span>
                <span className="SpaghettiFeatureSummary">
                  {featureEnabled ? summary : `Disabled · ${summary}`}
                </span>
                {featureDiagnostics.length > 0 ? (
                  <span className="fsPrev_diagBadges">
                    {diagnosticCounts.error > 0 ? (
                      <span className="fsPrev_diagPill fsPrev_diagPillError">E {diagnosticCounts.error}</span>
                    ) : null}
                    {diagnosticCounts.warning > 0 ? (
                      <span className="fsPrev_diagPill fsPrev_diagPillWarning">W {diagnosticCounts.warning}</span>
                    ) : null}
                    {diagnosticCounts.info > 0 ? (
                      <span className="fsPrev_diagPill fsPrev_diagPillInfo">I {diagnosticCounts.info}</span>
                    ) : null}
                  </span>
                ) : null}
              </button>
              {showFullEditors ? (
                <div className="SpaghettiFeatureRowActions">
                  <button
                    type="button"
                    {...SP_INTERACTIVE_PROPS}
                    disabled={!canMoveUp}
                    onClick={() => {
                      if (!canMoveUp) {
                        return
                      }
                      moveFeatureUp(node.nodeId, feature.featureId)
                    }}
                  >
                    Up
                  </button>
                  <button
                    type="button"
                    {...SP_INTERACTIVE_PROPS}
                    disabled={!canMoveDown}
                    onClick={() => {
                      if (!canMoveDown) {
                        return
                      }
                      moveFeatureDown(node.nodeId, feature.featureId)
                    }}
                  >
                    Down
                  </button>
                  <button
                    type="button"
                    {...SP_INTERACTIVE_PROPS}
                    onClick={() => setFeatureEnabled(node.nodeId, feature.featureId, !featureEnabled)}
                  >
                    {featureEnabled ? 'Disable' : 'Enable'}
                  </button>
                </div>
              ) : null}
            </div>

            {!showFullEditors || featureCollapsed ? null : (
              <>
                {feature.type === 'sketch' ? (
                  <SketchFeatureView
                    nodeId={node.nodeId}
                    feature={feature}
                    previewProfiles={sketchProfilesByFeatureId.get(feature.featureId) ?? []}
                    highlightedProfileIds={highlightedProfilesBySketchFeatureId.get(feature.featureId) ?? emptyProfileSet}
                    irAvailable={featureStackIr !== null}
                    widthVirtualInputPort={virtualFeatureInputsByPortId.get(buildSketchRectWidthVirtualInputPortId(feature.featureId))}
                    widthVirtualInputState={
                      featureVirtualInputStateByPortId?.[buildSketchRectWidthVirtualInputPortId(feature.featureId)]
                    }
                    lengthVirtualInputPort={virtualFeatureInputsByPortId.get(buildSketchRectLengthVirtualInputPortId(feature.featureId))}
                    lengthVirtualInputState={
                      featureVirtualInputStateByPortId?.[buildSketchRectLengthVirtualInputPortId(feature.featureId)]
                    }
                    featureInputWiring={featureInputWiring}
                  />
                ) : feature.type === 'closeProfile' ? (
                  <CloseProfileFeatureView nodeId={node.nodeId} feature={feature} stack={stack} featureIndex={index} />
                ) : (
                  <ExtrudeFeatureView
                    nodeId={node.nodeId}
                    feature={feature}
                    stack={stack}
                    featureIndex={index}
                    previewProfilesBySketchId={sketchProfilesByFeatureId}
                    closeProfileResolvedByFeatureId={closeProfileResolvedByFeatureId}
                    depthVirtualInputPort={virtualFeatureInputsByPortId.get(buildExtrudeDepthVirtualInputPortId(feature.featureId))}
                    depthVirtualInputState={
                      featureVirtualInputStateByPortId?.[buildExtrudeDepthVirtualInputPortId(feature.featureId)]
                    }
                    taperVirtualInputPort={virtualFeatureInputsByPortId.get(buildExtrudeTaperVirtualInputPortId(feature.featureId))}
                    taperVirtualInputState={
                      featureVirtualInputStateByPortId?.[buildExtrudeTaperVirtualInputPortId(feature.featureId)]
                    }
                    offsetVirtualInputPort={virtualFeatureInputsByPortId.get(buildExtrudeOffsetVirtualInputPortId(feature.featureId))}
                    offsetVirtualInputState={
                      featureVirtualInputStateByPortId?.[buildExtrudeOffsetVirtualInputPortId(feature.featureId)]
                    }
                    featureInputWiring={featureInputWiring}
                  />
                )}
                {featureDiagnostics.length > 0 ? (
                  <div className="SpaghettiFeatureDiagList">
                    {withDiagnosticKeys(featureDiagnostics).map(({ diagnostic, key }) => {
                      const diagnosticLevel = toDiagnosticLevel(diagnostic.level)
                      return (
                        <div
                          key={key}
                          className={`SpaghettiFeatureDiagMsg fsPrev_diagMsg ${
                            diagnosticLevel === 'error'
                              ? 'isError'
                              : diagnosticLevel === 'warning'
                                ? 'isWarning'
                                : 'isInfo'
                          }`}
                        >
                          {diagnostic.code}: {diagnostic.message}
                        </div>
                      )
                    })}
                  </div>
                ) : null}
              </>
            )}
          </div>
        )
      })}
    </section>
  )
}
