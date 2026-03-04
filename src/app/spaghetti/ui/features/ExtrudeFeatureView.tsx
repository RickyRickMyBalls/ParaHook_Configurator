import type { ExtrudeFeature, FeatureStack } from '../../features/featureTypes'
import { useSpaghettiStore } from '../../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../../spInteractive'
import { FeatureValueBar } from './FeatureValueBar'
import {
  formatStableNumber,
  labelProfilesForPreview,
  renderProfilePreview,
  type PreviewProfileWithLabel,
} from './profilePreview'

type ExtrudeFeatureViewProps = {
  nodeId: string
  feature: ExtrudeFeature
  stack: FeatureStack
  featureIndex: number
  previewProfilesBySketchId: ReadonlyMap<string, PreviewProfileWithLabel[]>
}

const shortId = (id: string): string => id.slice(0, 8)

export function ExtrudeFeatureView({
  nodeId,
  feature,
  stack,
  featureIndex,
  previewProfilesBySketchId,
}: ExtrudeFeatureViewProps) {
  const setExtrudeDepth = useSpaghettiStore((state) => state.setExtrudeDepth)
  const setExtrudeProfileRef = useSpaghettiStore((state) => state.setExtrudeProfileRef)

  const priorSketches = stack
    .slice(0, featureIndex)
    .filter((item): item is FeatureStack[number] & { type: 'sketch' } => item.type === 'sketch')
  const selectedSourceFeatureId = feature.inputs.profileRef?.sourceFeatureId ?? ''
  const selectedProfileId = feature.inputs.profileRef?.profileId ?? ''
  const selectedSketch = priorSketches.find(
    (candidate) => candidate.featureId === selectedSourceFeatureId,
  )

  const getProfilesForSketch = (sourceFeatureId: string): PreviewProfileWithLabel[] => {
    const resolved = previewProfilesBySketchId.get(sourceFeatureId)
    if (resolved !== undefined) {
      return resolved
    }
    const sourceSketch = priorSketches.find((candidate) => candidate.featureId === sourceFeatureId)
    if (sourceSketch === undefined) {
      return []
    }
    return labelProfilesForPreview(
      sourceSketch.outputs.profiles.map((profile) => ({
        profileId: profile.profileId,
        area: profile.area,
        vertices: [],
      })),
    )
  }

  const profileOptions =
    selectedSourceFeatureId.length === 0 ? [] : getProfilesForSketch(selectedSourceFeatureId)
  const selectedProfile = profileOptions.find((profile) => profile.profileId === selectedProfileId)
  const profileSummary =
    selectedProfile === undefined || selectedSourceFeatureId.length === 0
      ? '—'
      : `${shortId(selectedSourceFeatureId)}/${selectedProfile.label}`

  return (
    <div className="SpaghettiFeatureBody" {...SP_INTERACTIVE_PROPS}>
      <div className="SpaghettiFeatureSectionHeader">
        <span>Depth</span>
      </div>
      <FeatureValueBar
        label="mm"
        value={feature.params.depth.value}
        min={0}
        max={500}
        step={0.1}
        onChange={(value) =>
          setExtrudeDepth(nodeId, feature.featureId, {
            kind: 'lit',
            value,
          })
        }
      />

      <div className="fsPrev_extrudeSummary">
        Profile: {profileSummary}, Depth: {formatStableNumber(feature.params.depth.value)}
      </div>

      <div className="SpaghettiFeatureSectionHeader">
        <span>Profile Source</span>
      </div>
      <label className="SpaghettiFeatureSelectRow" {...SP_INTERACTIVE_PROPS}>
        <span>Sketch</span>
        <select
          {...SP_INTERACTIVE_PROPS}
          value={selectedSourceFeatureId}
          onChange={(event) => {
            const sourceFeatureId = event.target.value
            if (sourceFeatureId.length === 0) {
              setExtrudeProfileRef(nodeId, feature.featureId, null)
              return
            }
            const nextProfiles = getProfilesForSketch(sourceFeatureId)
            const firstProfile = nextProfiles[0]
            setExtrudeProfileRef(
              nodeId,
              feature.featureId,
              firstProfile === undefined
                ? null
                : {
                    sourceFeatureId,
                    profileId: firstProfile.profileId,
                  },
            )
          }}
        >
          <option value="">None</option>
          {priorSketches.map((sketch) => (
            <option key={sketch.featureId} value={sketch.featureId}>
              Sketch {sketch.featureId.slice(0, 8)}
            </option>
          ))}
        </select>
      </label>

      <label className="SpaghettiFeatureSelectRow" {...SP_INTERACTIVE_PROPS}>
        <span>Profile</span>
        <select
          {...SP_INTERACTIVE_PROPS}
          value={selectedProfileId}
          onChange={(event) => {
            const profileId = event.target.value
            if (selectedSourceFeatureId.length === 0 || profileId.length === 0) {
              setExtrudeProfileRef(nodeId, feature.featureId, null)
              return
            }
            setExtrudeProfileRef(nodeId, feature.featureId, {
              sourceFeatureId: selectedSourceFeatureId,
              profileId,
            })
          }}
          disabled={selectedSourceFeatureId.length === 0 || profileOptions.length === 0}
        >
          <option value="">None</option>
          {profileOptions.map((profile) => (
            <option key={profile.profileId} value={profile.profileId}>
              {profile.label}
            </option>
          ))}
        </select>
      </label>

      {selectedSketch === undefined || selectedSourceFeatureId.length === 0 ? null : (
        <>
          <div className="SpaghettiFeatureSectionHeader">
            <span>Profile Preview</span>
          </div>
          {profileOptions.length === 0 ? (
            <div className="SpaghettiFeatureEmpty">No profiles available on selected sketch.</div>
          ) : (
            <div className="fsPrev_profileGrid">
              {profileOptions.map((profile) => (
                <div
                  key={profile.profileId}
                  className={`fsPrev_profileCard ${
                    profile.profileId === feature.inputs.profileRef?.profileId
                      ? 'fsPrev_profileCardSelected'
                      : ''
                  }`}
                >
                  <div className="fsPrev_profileMeta">
                    <span className="fsPrev_profileLabel">{profile.label}</span>
                    <span className="fsPrev_profileId">{profile.profileId.slice(0, 8)}</span>
                    <span className="fsPrev_profileArea">
                      Area {formatStableNumber(profile.area)}
                    </span>
                  </div>
                  <div className="fsPrev_profileSvgWrap">
                    {renderProfilePreview(profile.vertices, 96, 72)}
                  </div>
                </div>
              ))}
            </div>
          )}
        </>
      )}
    </div>
  )
}
