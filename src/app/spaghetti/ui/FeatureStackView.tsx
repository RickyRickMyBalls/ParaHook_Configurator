import { useMemo } from 'react'
import { getFeatureDiagnostics, type FeatureDiagnostic } from '../features/diagnostics'
import { readFeatureStack } from '../features/featureSchema'
import type { ExtrudeFeature } from '../features/featureTypes'
import type { SpaghettiNode } from '../schema/spaghettiTypes'
import { useSpaghettiStore } from '../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../spInteractive'
import { ExtrudeFeatureView } from './features/ExtrudeFeatureView'
import { SketchFeatureView } from './features/SketchFeatureView'
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
  if (level === 'error') {
    return 0
  }
  if (level === 'warning') {
    return 1
  }
  return 2
}

const compareDiagnostics = (a: FeatureDiagnostic, b: FeatureDiagnostic): number =>
  levelRank(a.level) - levelRank(b.level) ||
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
    const base = `${diagnostic.featureId}|${diagnostic.level}|${diagnostic.message}`
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
): string => {
  const profileRef = feature.inputs.profileRef
  const depth = formatStableNumber(feature.params.depth.value)
  if (profileRef === null) {
    return `Profile: —, Depth: ${depth}`
  }
  const sourceProfiles = sketchProfilesByFeatureId.get(profileRef.sourceFeatureId) ?? []
  const selectedProfile = sourceProfiles.find(
    (profile) => profile.profileId === profileRef.profileId,
  )
  if (selectedProfile === undefined) {
    return `Profile: —, Depth: ${depth}`
  }
  return `Profile: ${shortId(profileRef.sourceFeatureId)}/${selectedProfile.label}, Depth: ${depth}`
}

export function FeatureStackView({
  node,
  mode = 'full',
  isGroupCollapsed,
  onToggleGroup,
}: FeatureStackViewProps) {
  const addSketchFeature = useSpaghettiStore((state) => state.addSketchFeature)
  const addExtrudeFeature = useSpaghettiStore((state) => state.addExtrudeFeature)
  const toggleFeatureCollapsed = useSpaghettiStore((state) => state.toggleFeatureCollapsed)
  const featureStackIr = useSpaghettiStore((state) => state.getPartFeatureStackIrForNode(node.nodeId))

  const stack = useMemo(() => readFeatureStack(node.params.featureStack), [node.params.featureStack])
  const sketchProfilesByFeatureId = useMemo(() => {
    const next = new Map<string, PreviewProfileWithLabel[]>()
    if (featureStackIr === null) {
      return next
    }
    for (const operation of featureStackIr) {
      if (operation.op !== 'sketch') {
        continue
      }
      next.set(
        operation.featureId,
        labelProfilesForPreview(
          operation.profilesResolved.map((profile) => ({
            profileId: profile.profileId,
            area: profile.area,
            vertices: profile.vertices,
          })),
        ),
      )
    }
    return next
  }, [featureStackIr])
  const highlightedProfilesBySketchFeatureId = useMemo(() => {
    const next = new Map<string, Set<string>>()
    for (const feature of stack) {
      if (feature.type !== 'extrude' || feature.inputs.profileRef === null) {
        continue
      }
      const sourceSketchId = feature.inputs.profileRef.sourceFeatureId
      const profileSet = next.get(sourceSketchId) ?? new Set<string>()
      profileSet.add(feature.inputs.profileRef.profileId)
      next.set(sourceSketchId, profileSet)
    }
    return next
  }, [stack])
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

  if (!isPartNodeForFeatureStack(node)) {
    return null
  }

  const showFullEditors = mode === 'full'
  const sectionCollapsed = isGroupCollapsed !== undefined ? isGroupCollapsed : undefined

  return (
    <section className="SpaghettiFeatureStack">
      <div className="SpaghettiFeatureStackHeader">
        <div className="SpaghettiFeatureStackTitle">Feature Stack</div>
        {showFullEditors ? (
          <div className="SpaghettiFeatureStackActions">
            <button
              type="button"
              {...SP_INTERACTIVE_PROPS}
              onClick={() => addSketchFeature(node.nodeId)}
            >
              + Sketch
            </button>
            <button
              type="button"
              {...SP_INTERACTIVE_PROPS}
              onClick={() => addExtrudeFeature(node.nodeId)}
            >
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
            : extrudeSummary(feature, sketchProfilesByFeatureId)
        const diagnosticCounts = countDiagnostics(featureDiagnostics)
        const featureCollapsed =
          sectionCollapsed === undefined
            ? feature.uiState.collapsed
            : sectionCollapsed(feature.featureId)
        return (
          <div key={feature.featureId} className="SpaghettiFeatureItem">
            <button
              type="button"
              className="SpaghettiFeatureRow"
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
                {feature.type === 'sketch' ? 'Sketch' : 'Extrude'}
              </span>
              <span className="SpaghettiFeatureSummary">{summary}</span>
              {featureDiagnostics.length > 0 ? (
                <span className="fsPrev_diagBadges">
                  {diagnosticCounts.error > 0 ? (
                    <span className="fsPrev_diagPill fsPrev_diagPillError">
                      E {diagnosticCounts.error}
                    </span>
                  ) : null}
                  {diagnosticCounts.warning > 0 ? (
                    <span className="fsPrev_diagPill fsPrev_diagPillWarning">
                      W {diagnosticCounts.warning}
                    </span>
                  ) : null}
                  {diagnosticCounts.info > 0 ? (
                    <span className="fsPrev_diagPill fsPrev_diagPillInfo">
                      I {diagnosticCounts.info}
                    </span>
                  ) : null}
                </span>
              ) : null}
            </button>

            {!showFullEditors || featureCollapsed ? null : (
              <>
                {feature.type === 'sketch' ? (
                  <SketchFeatureView
                    nodeId={node.nodeId}
                    feature={feature}
                    previewProfiles={sketchProfilesByFeatureId.get(feature.featureId) ?? []}
                    highlightedProfileIds={
                      highlightedProfilesBySketchFeatureId.get(feature.featureId) ?? emptyProfileSet
                    }
                    irAvailable={featureStackIr !== null}
                  />
                ) : (
                  <ExtrudeFeatureView
                    nodeId={node.nodeId}
                    feature={feature}
                    stack={stack}
                    featureIndex={index}
                    previewProfilesBySketchId={sketchProfilesByFeatureId}
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
                          {diagnostic.message}
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
