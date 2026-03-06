import type { CloseProfileFeature, FeatureStack } from '../../features/featureTypes'
import { useSpaghettiStore } from '../../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../../spInteractive'

type CloseProfileFeatureViewProps = {
  nodeId: string
  feature: CloseProfileFeature
  stack: FeatureStack
  featureIndex: number
}

export function CloseProfileFeatureView({
  nodeId,
  feature,
  stack,
  featureIndex,
}: CloseProfileFeatureViewProps) {
  const setCloseProfileSource = useSpaghettiStore((state) => state.setCloseProfileSource)
  const priorSketches = stack
    .slice(0, featureIndex)
    .filter((item): item is FeatureStack[number] & { type: 'sketch' } => item.type === 'sketch')

  const selectedSource = feature.inputs.sourceSketchFeatureId ?? ''
  const resolved = feature.outputs.profileRef

  return (
    <div className="SpaghettiFeatureBody" {...SP_INTERACTIVE_PROPS}>
      <div className="SpaghettiFeatureSectionHeader">
        <span>Close Profile Source</span>
      </div>
      <label className="SpaghettiFeatureSelectRow" {...SP_INTERACTIVE_PROPS}>
        <span>Sketch</span>
        <select
          {...SP_INTERACTIVE_PROPS}
          value={selectedSource}
          onChange={(event) =>
            setCloseProfileSource(
              nodeId,
              feature.featureId,
              event.target.value.length === 0 ? null : event.target.value,
            )
          }
        >
          <option value="">None</option>
          {priorSketches.map((sketch) => (
            <option key={sketch.featureId} value={sketch.featureId}>
              Sketch {sketch.featureId.slice(0, 8)}
            </option>
          ))}
        </select>
      </label>
      <div className="fsPrev_extrudeSummary">
        {resolved === null
          ? 'Resolved: none'
          : `Resolved: ${resolved.sourceFeatureId.slice(0, 8)}/${resolved.profileId.slice(0, 8)} (#${resolved.profileIndex})`}
      </div>
    </div>
  )
}
