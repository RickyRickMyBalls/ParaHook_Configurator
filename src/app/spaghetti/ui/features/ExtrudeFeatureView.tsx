import type { PointerEvent as ReactPointerEvent } from 'react'
import type { ExtrudeFeature, FeatureStack } from '../../features/featureTypes'
import {
  buildExtrudeDepthVirtualInputPortId,
  buildExtrudeOffsetVirtualInputPortId,
  buildExtrudeTaperVirtualInputPortId,
} from '../../features/featureVirtualPorts'
import type { PortSpec } from '../../schema/spaghettiTypes'
import { useSpaghettiStore } from '../../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../../spInteractive'
import { FeatureValueBar } from './FeatureValueBar'
import { PortView } from '../../canvas/PortView'
import type { PortDirection } from '../../canvas/types'
import {
  formatStableNumber,
  labelProfilesForPreview,
  renderProfilePreview,
  type PreviewProfileWithLabel,
} from './profilePreview'

type EndpointPayload = {
  nodeId: string
  portId: string
  path?: string[]
}

export type FeatureInputWiringBridge = {
  getInputDropState: (payload: EndpointPayload) => 'compatible' | 'incompatible' | null
  onRegisterPortElement: (
    nodeId: string,
    direction: PortDirection,
    portId: string,
    path: string[] | undefined,
    element: HTMLElement | null,
  ) => void
  onInputPointerDown: (
    event: ReactPointerEvent<HTMLElement>,
    payload: EndpointPayload,
  ) => void
  onInputPointerEnter: (payload: EndpointPayload) => void
  onInputPointerLeave: (payload: EndpointPayload) => void
}

type ExtrudeFeatureViewProps = {
  nodeId: string
  feature: ExtrudeFeature
  stack: FeatureStack
  featureIndex: number
  previewProfilesBySketchId: ReadonlyMap<string, PreviewProfileWithLabel[]>
  closeProfileResolvedByFeatureId: ReadonlyMap<
    string,
    { sourceFeatureId: string; profileId: string; profileIndex: number }
  >
  depthVirtualInputPort?: PortSpec
  depthVirtualInputState?: {
    driven: boolean
    connectionCount: number
    unresolved: boolean
    drivenValue?: number
  }
  taperVirtualInputPort?: PortSpec
  taperVirtualInputState?: {
    driven: boolean
    connectionCount: number
    unresolved: boolean
    drivenValue?: number
  }
  offsetVirtualInputPort?: PortSpec
  offsetVirtualInputState?: {
    driven: boolean
    connectionCount: number
    unresolved: boolean
    drivenValue?: number
  }
  featureInputWiring?: FeatureInputWiringBridge
}

const shortId = (id: string): string => id.slice(0, 8)

export function ExtrudeFeatureView({
  nodeId,
  feature,
  stack,
  featureIndex,
  previewProfilesBySketchId,
  closeProfileResolvedByFeatureId,
  depthVirtualInputPort,
  depthVirtualInputState,
  taperVirtualInputPort,
  taperVirtualInputState,
  offsetVirtualInputPort,
  offsetVirtualInputState,
  featureInputWiring,
}: ExtrudeFeatureViewProps) {
  const setExtrudeDepth = useSpaghettiStore((state) => state.setExtrudeDepth)
  const setExtrudeTaper = useSpaghettiStore((state) => state.setExtrudeTaper)
  const setExtrudeOffset = useSpaghettiStore((state) => state.setExtrudeOffset)
  const setExtrudeProfileRef = useSpaghettiStore((state) => state.setExtrudeProfileRef)

  const priorSketches = stack
    .slice(0, featureIndex)
    .filter((item): item is FeatureStack[number] & { type: 'sketch' } => item.type === 'sketch')
  const priorCloseProfiles = stack
    .slice(0, featureIndex)
    .filter((item): item is FeatureStack[number] & { type: 'closeProfile' } => item.type === 'closeProfile')

  const selectedSourceFeatureId = feature.inputs.profileRef?.sourceFeatureId ?? ''
  const selectedProfileId = feature.inputs.profileRef?.profileId ?? ''

  const getProfilesForSketch = (sourceFeatureId: string): PreviewProfileWithLabel[] => {
    const resolved = previewProfilesBySketchId.get(sourceFeatureId)
    if (resolved !== undefined) return resolved
    const sourceSketch = priorSketches.find((candidate) => candidate.featureId === sourceFeatureId)
    if (sourceSketch === undefined) return []
    return labelProfilesForPreview(
      sourceSketch.outputs.profiles.map((profile) => ({
        profileId: profile.profileId,
        area: profile.area,
        vertices: profile.verticesProxy,
      })),
    )
  }

  const getProfilesForSource = (sourceFeatureId: string): PreviewProfileWithLabel[] => {
    const closeResolved = closeProfileResolvedByFeatureId.get(sourceFeatureId)
    if (closeResolved !== undefined) {
      const sourceProfiles = getProfilesForSketch(closeResolved.sourceFeatureId)
      return sourceProfiles.filter((profile) => profile.profileId === closeResolved.profileId)
    }
    return getProfilesForSketch(sourceFeatureId)
  }

  const profileOptions =
    selectedSourceFeatureId.length === 0 ? [] : getProfilesForSource(selectedSourceFeatureId)
  const selectedProfile = profileOptions.find((profile) => profile.profileId === selectedProfileId)
  const profileSummary =
    selectedProfile === undefined || selectedSourceFeatureId.length === 0
      ? '-'
      : `${shortId(selectedSourceFeatureId)}/${selectedProfile.label}`
  const depthPortId = buildExtrudeDepthVirtualInputPortId(feature.featureId)
  const taperPortId = buildExtrudeTaperVirtualInputPortId(feature.featureId)
  const offsetPortId = buildExtrudeOffsetVirtualInputPortId(feature.featureId)
  const depthDriven =
    depthVirtualInputState?.driven === true && depthVirtualInputState.connectionCount > 0
  const depthUnresolved = depthVirtualInputState?.unresolved === true
  const taperDriven =
    taperVirtualInputState?.driven === true && taperVirtualInputState.connectionCount > 0
  const taperUnresolved = taperVirtualInputState?.unresolved === true
  const offsetDriven =
    offsetVirtualInputState?.driven === true && offsetVirtualInputState.connectionCount > 0
  const offsetUnresolved = offsetVirtualInputState?.unresolved === true
  const depthValue =
    depthDriven && typeof depthVirtualInputState?.drivenValue === 'number'
      ? depthVirtualInputState.drivenValue
      : feature.params.depth.value
  const taperValue =
    taperDriven && typeof taperVirtualInputState?.drivenValue === 'number'
      ? taperVirtualInputState.drivenValue
      : feature.params.taper?.value ?? 0
  const offsetValue =
    offsetDriven && typeof offsetVirtualInputState?.drivenValue === 'number'
      ? offsetVirtualInputState.drivenValue
      : feature.params.offset?.value ?? 0

  const renderVirtualInputRow = (
    label: string,
    portId: string,
    port: PortSpec | undefined,
    driven: boolean,
    unresolved: boolean,
    value: number,
    dataAttribute:
      | 'data-sp-feature-depth-port-id'
      | 'data-sp-feature-taper-port-id'
      | 'data-sp-feature-offset-port-id',
  ) => {
    if (port === undefined || featureInputWiring === undefined) return null
    return (
      <div className="SpaghettiFeatureDepthWireInput" {...{ [dataAttribute]: portId }}>
        <PortView
          nodeId={nodeId}
          direction="in"
          endpointPortId={portId}
          port={port}
          labelOverride={`${label} Input`}
          dropState={featureInputWiring.getInputDropState({
            nodeId,
            portId,
          })}
          setPortElement={(element) =>
            featureInputWiring.onRegisterPortElement(
              nodeId,
              'in',
              portId,
              undefined,
              element,
            )
          }
          onInputPointerDown={featureInputWiring.onInputPointerDown}
          onInputPointerEnter={featureInputWiring.onInputPointerEnter}
          onInputPointerLeave={featureInputWiring.onInputPointerLeave}
          resolvedValueLabel={
            driven && !unresolved
              ? `${formatStableNumber(value)} ${port.type.unit ?? ''}`.trim()
              : undefined
          }
          drivenMessage={
            !driven
              ? undefined
              : unresolved
                ? 'Driven by external wire (unresolved).'
                : 'Driven by external wire.'
          }
        />
      </div>
    )
  }

  return (
    <div className="SpaghettiFeatureBody" {...SP_INTERACTIVE_PROPS}>
      {featureInputWiring !== undefined ? (
        <>
          <div className="SpaghettiFeatureSectionHeader">
            <span>Feature Wire Inputs</span>
          </div>
          {renderVirtualInputRow(
            'Depth',
            depthPortId,
            depthVirtualInputPort,
            depthDriven,
            depthUnresolved,
            depthValue,
            'data-sp-feature-depth-port-id',
          )}
          {renderVirtualInputRow(
            'Taper',
            taperPortId,
            taperVirtualInputPort,
            taperDriven,
            taperUnresolved,
            taperValue,
            'data-sp-feature-taper-port-id',
          )}
          {renderVirtualInputRow(
            'Offset',
            offsetPortId,
            offsetVirtualInputPort,
            offsetDriven,
            offsetUnresolved,
            offsetValue,
            'data-sp-feature-offset-port-id',
          )}
        </>
      ) : null}

      <div className="SpaghettiFeatureSectionHeader">
        <span>Depth</span>
      </div>
      <FeatureValueBar
        label="mm"
        value={depthValue}
        min={0}
        max={500}
        step={0.1}
        disabled={depthDriven}
        onChange={(value) =>
          setExtrudeDepth(nodeId, feature.featureId, {
            kind: 'lit',
            value,
          })
        }
      />

      <div className="SpaghettiFeatureSectionHeader">
        <span>Taper</span>
      </div>
      <FeatureValueBar
        label="deg"
        value={taperValue}
        min={-45}
        max={45}
        step={0.1}
        disabled={taperDriven}
        onChange={(value) =>
          setExtrudeTaper(nodeId, feature.featureId, {
            kind: 'lit',
            value,
          })
        }
      />

      <div className="SpaghettiFeatureSectionHeader">
        <span>Offset</span>
      </div>
      <FeatureValueBar
        label="mm"
        value={offsetValue}
        min={-500}
        max={500}
        step={0.1}
        disabled={offsetDriven}
        onChange={(value) =>
          setExtrudeOffset(nodeId, feature.featureId, {
            kind: 'lit',
            value,
          })
        }
      />

      <div className="fsPrev_extrudeSummary">
        Profile: {profileSummary}, Depth: {formatStableNumber(depthValue)}, Taper: {formatStableNumber(
          taperValue,
        )}, Offset: {formatStableNumber(offsetValue)}
      </div>

      <div className="SpaghettiFeatureSectionHeader">
        <span>Profile Source</span>
      </div>
      <label className="SpaghettiFeatureSelectRow" {...SP_INTERACTIVE_PROPS}>
        <span>Source</span>
        <select
          {...SP_INTERACTIVE_PROPS}
          value={selectedSourceFeatureId}
          onChange={(event) => {
            const sourceFeatureId = event.target.value
            if (sourceFeatureId.length === 0) {
              setExtrudeProfileRef(nodeId, feature.featureId, null)
              return
            }
            const closeResolved = closeProfileResolvedByFeatureId.get(sourceFeatureId)
            if (closeResolved !== undefined) {
              setExtrudeProfileRef(nodeId, feature.featureId, {
                sourceFeatureId,
                profileId: closeResolved.profileId,
                profileIndex: closeResolved.profileIndex,
              })
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
                    profileIndex: 0,
                  },
            )
          }}
        >
          <option value="">None</option>
          {priorCloseProfiles.map((closeProfile) => (
            <option key={closeProfile.featureId} value={closeProfile.featureId}>
              Close {closeProfile.featureId.slice(0, 8)}
            </option>
          ))}
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
            const closeResolved = closeProfileResolvedByFeatureId.get(selectedSourceFeatureId)
            setExtrudeProfileRef(nodeId, feature.featureId, {
              sourceFeatureId: selectedSourceFeatureId,
              profileId: closeResolved?.profileId ?? profileId,
              profileIndex: closeResolved?.profileIndex ?? 0,
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

      {selectedSourceFeatureId.length === 0 ? null : (
        <>
          <div className="SpaghettiFeatureSectionHeader">
            <span>Profile Preview</span>
          </div>
          {profileOptions.length === 0 ? (
            <div className="SpaghettiFeatureEmpty">No profiles available on selected source.</div>
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
