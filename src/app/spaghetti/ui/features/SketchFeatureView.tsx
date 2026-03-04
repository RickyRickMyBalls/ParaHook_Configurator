import type { SketchFeature } from '../../features/featureTypes'
import { useSpaghettiStore } from '../../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../../spInteractive'
import { FeatureValueBar } from './FeatureValueBar'
import {
  formatStableNumber,
  renderProfilePreview,
  type PreviewProfileWithLabel,
} from './profilePreview'

type SketchFeatureViewProps = {
  nodeId: string
  feature: SketchFeature
  previewProfiles: PreviewProfileWithLabel[]
  highlightedProfileIds: ReadonlySet<string>
  irAvailable: boolean
}

export function SketchFeatureView({
  nodeId,
  feature,
  previewProfiles,
  highlightedProfileIds,
  irAvailable,
}: SketchFeatureViewProps) {
  const addSketchLine = useSpaghettiStore((state) => state.addSketchLine)
  const updateSketchLineEndpoint = useSpaghettiStore((state) => state.updateSketchLineEndpoint)

  return (
    <div className="SpaghettiFeatureBody" {...SP_INTERACTIVE_PROPS}>
      <div className="SpaghettiFeatureSectionHeader">
        <span>Lines</span>
        <button
          type="button"
          {...SP_INTERACTIVE_PROPS}
          onClick={() => addSketchLine(nodeId, feature.featureId)}
        >
          + Line
        </button>
      </div>
      {feature.entities.length === 0 ? (
        <div className="SpaghettiFeatureEmpty">No lines yet.</div>
      ) : (
        <div className="SpaghettiFeatureLineList">
          {feature.entities.map((entity, index) => (
            <div key={entity.entityId} className="SpaghettiFeatureLineRow">
              <div className="SpaghettiFeatureLineTitle">
                Line {index + 1} <span>{entity.entityId.slice(0, 8)}</span>
              </div>
              <div className="SpaghettiFeatureEndpoint">
                <span>Start</span>
                <div className="SpaghettiPortInlineValueBars">
                  <div className="SpaghettiPortInlineValueBar">
                    <FeatureValueBar
                      label="X"
                      value={entity.start.x}
                      min={-2000}
                      max={2000}
                      step={0.1}
                      compact
                      onChange={(nextX) =>
                        updateSketchLineEndpoint(nodeId, feature.featureId, entity.entityId, 'start', {
                          kind: 'lit',
                          x: nextX,
                          y: entity.start.y,
                        })
                      }
                    />
                  </div>
                  <div className="SpaghettiPortInlineValueBar">
                    <FeatureValueBar
                      label="Y"
                      value={entity.start.y}
                      min={-2000}
                      max={2000}
                      step={0.1}
                      compact
                      onChange={(nextY) =>
                        updateSketchLineEndpoint(nodeId, feature.featureId, entity.entityId, 'start', {
                          kind: 'lit',
                          x: entity.start.x,
                          y: nextY,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
              <div className="SpaghettiFeatureEndpoint">
                <span>End</span>
                <div className="SpaghettiPortInlineValueBars">
                  <div className="SpaghettiPortInlineValueBar">
                    <FeatureValueBar
                      label="X"
                      value={entity.end.x}
                      min={-2000}
                      max={2000}
                      step={0.1}
                      compact
                      onChange={(nextX) =>
                        updateSketchLineEndpoint(nodeId, feature.featureId, entity.entityId, 'end', {
                          kind: 'lit',
                          x: nextX,
                          y: entity.end.y,
                        })
                      }
                    />
                  </div>
                  <div className="SpaghettiPortInlineValueBar">
                    <FeatureValueBar
                      label="Y"
                      value={entity.end.y}
                      min={-2000}
                      max={2000}
                      step={0.1}
                      compact
                      onChange={(nextY) =>
                        updateSketchLineEndpoint(nodeId, feature.featureId, entity.entityId, 'end', {
                          kind: 'lit',
                          x: entity.end.x,
                          y: nextY,
                        })
                      }
                    />
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      <div className="SpaghettiFeatureSectionHeader">
        <span>Sketch: {previewProfiles.length} profiles</span>
      </div>
      {!irAvailable ? (
        <div className="SpaghettiFeatureEmpty">Profile preview unavailable for this part node.</div>
      ) : previewProfiles.length === 0 ? (
        <div className="SpaghettiFeatureEmpty">0 profiles (close the loop to derive one).</div>
      ) : (
        <div className="fsPrev_profileGrid">
          {previewProfiles.map((profile) => (
            <div
              key={profile.profileId}
              className={`fsPrev_profileCard ${
                highlightedProfileIds.has(profile.profileId) ? 'fsPrev_profileCardSelected' : ''
              }`}
            >
              <div className="fsPrev_profileMeta">
                <span className="fsPrev_profileLabel">{profile.label}</span>
                <span className="fsPrev_profileId">{profile.profileId.slice(0, 8)}</span>
                <span className="fsPrev_profileArea">Area {formatStableNumber(profile.area)}</span>
              </div>
              <div className="fsPrev_profileSvgWrap">
                {renderProfilePreview(profile.vertices, 96, 72)}
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}
