import type { SketchComponent, SketchFeature } from '../../features/featureTypes'
import type { PortSpec } from '../../schema/spaghettiTypes'
import { useSpaghettiStore } from '../../store/useSpaghettiStore'
import { SP_INTERACTIVE_PROPS } from '../../spInteractive'
import { FeatureValueBar } from './FeatureValueBar'
import { PortView } from '../../canvas/PortView'
import type { FeatureInputWiringBridge } from './ExtrudeFeatureView'
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
  widthVirtualInputPort?: PortSpec
  widthVirtualInputState?: {
    driven: boolean
    connectionCount: number
    unresolved: boolean
    drivenValue?: number
  }
  lengthVirtualInputPort?: PortSpec
  lengthVirtualInputState?: {
    driven: boolean
    connectionCount: number
    unresolved: boolean
    drivenValue?: number
  }
  featureInputWiring?: FeatureInputWiringBridge
}

const POINT_KEYS_BY_COMPONENT: Record<
  SketchComponent['type'],
  ReadonlyArray<'a' | 'b' | 'p0' | 'p1' | 'p2' | 'p3' | 'start' | 'mid' | 'end'>
> = {
  line: ['a', 'b'],
  spline: ['p0', 'p1', 'p2', 'p3'],
  arc3pt: ['start', 'mid', 'end'],
}

const componentTitle = (component: SketchComponent): string => {
  if (component.type === 'line') return 'Line'
  if (component.type === 'spline') return 'Spline'
  return 'Arc'
}

const isCubeSeedRectangleSketch = (feature: SketchFeature): boolean =>
  feature.featureId === 'cube-sketch-1' &&
  feature.components.length === 4 &&
  feature.components.every((component) => component.type === 'line')

const readRectangleDimensions = (feature: SketchFeature): { width: number; length: number } => {
  const length = feature.components[0]?.type === 'line' ? feature.components[0].b.x : 0
  const width = feature.components[1]?.type === 'line' ? feature.components[1].b.y : 0
  return { width, length }
}

export function SketchFeatureView({
  nodeId,
  feature,
  previewProfiles,
  highlightedProfileIds,
  irAvailable,
  widthVirtualInputPort,
  widthVirtualInputState,
  lengthVirtualInputPort,
  lengthVirtualInputState,
  featureInputWiring,
}: SketchFeatureViewProps) {
  const addSketchComponent = useSpaghettiStore((state) => state.addSketchComponent)
  const updateSketchComponentPoint = useSpaghettiStore((state) => state.updateSketchComponentPoint)
  const moveSketchComponentUp = useSpaghettiStore((state) => state.moveSketchComponentUp)
  const moveSketchComponentDown = useSpaghettiStore((state) => state.moveSketchComponentDown)
  const removeSketchComponent = useSpaghettiStore((state) => state.removeSketchComponent)
  const setSketchRectangleDimensions = useSpaghettiStore((state) => state.setSketchRectangleDimensions)
  const isRectangleSketch = isCubeSeedRectangleSketch(feature)
  const rectangleDimensions = readRectangleDimensions(feature)
  const widthDriven = widthVirtualInputState?.driven === true && widthVirtualInputState.connectionCount > 0
  const widthUnresolved = widthVirtualInputState?.unresolved === true
  const lengthDriven =
    lengthVirtualInputState?.driven === true && lengthVirtualInputState.connectionCount > 0
  const lengthUnresolved = lengthVirtualInputState?.unresolved === true
  const widthValue =
    widthDriven && typeof widthVirtualInputState?.drivenValue === 'number'
      ? widthVirtualInputState.drivenValue
      : rectangleDimensions.width
  const lengthValue =
    lengthDriven && typeof lengthVirtualInputState?.drivenValue === 'number'
      ? lengthVirtualInputState.drivenValue
      : rectangleDimensions.length

  const renderPointEditor = (
    component: SketchComponent,
    pointKey: 'a' | 'b' | 'p0' | 'p1' | 'p2' | 'p3' | 'start' | 'mid' | 'end',
  ) => {
    if (!(pointKey in component)) {
      return null
    }
    const point = (component as Record<string, unknown>)[pointKey] as { x: number; y: number }
    return (
      <div key={pointKey} className="SpaghettiFeatureEndpoint">
        <span>{pointKey.toUpperCase()}</span>
        <div className="SpaghettiPortInlineValueBars">
          <div className="SpaghettiPortInlineValueBar">
            <FeatureValueBar
              label="X"
              value={point.x}
              min={-2000}
              max={2000}
              step={0.1}
              compact
              onChange={(nextX) =>
                updateSketchComponentPoint(nodeId, feature.featureId, component.rowId, pointKey, {
                  kind: 'lit',
                  x: nextX,
                  y: point.y,
                })
              }
            />
          </div>
          <div className="SpaghettiPortInlineValueBar">
            <FeatureValueBar
              label="Y"
              value={point.y}
              min={-2000}
              max={2000}
              step={0.1}
              compact
              onChange={(nextY) =>
                updateSketchComponentPoint(nodeId, feature.featureId, component.rowId, pointKey, {
                  kind: 'lit',
                  x: point.x,
                  y: nextY,
                })
              }
            />
          </div>
        </div>
      </div>
    )
  }

  const renderVirtualInputRow = (
    label: string,
    portId: string,
    port: PortSpec | undefined,
    driven: boolean,
    unresolved: boolean,
    value: number,
    dataAttribute: 'data-sp-feature-width-port-id' | 'data-sp-feature-length-port-id',
  ) => {
    if (port === undefined || featureInputWiring === undefined) {
      return null
    }
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
            featureInputWiring.onRegisterPortElement(nodeId, 'in', portId, undefined, element)
          }
          onInputPointerDown={featureInputWiring.onInputPointerDown}
          onInputPointerEnter={featureInputWiring.onInputPointerEnter}
          onInputPointerLeave={featureInputWiring.onInputPointerLeave}
          resolvedValueLabel={
            driven && !unresolved ? `${formatStableNumber(value)} ${port.type.unit ?? ''}`.trim() : undefined
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
      {isRectangleSketch ? (
        <>
          {featureInputWiring !== undefined ? (
            <>
              <div className="SpaghettiFeatureSectionHeader">
                <span>Feature Wire Inputs</span>
              </div>
              {renderVirtualInputRow(
                'Width',
                widthVirtualInputPort?.portId ?? '',
                widthVirtualInputPort,
                widthDriven,
                widthUnresolved,
                widthValue,
                'data-sp-feature-width-port-id',
              )}
              {renderVirtualInputRow(
                'Length',
                lengthVirtualInputPort?.portId ?? '',
                lengthVirtualInputPort,
                lengthDriven,
                lengthUnresolved,
                lengthValue,
                'data-sp-feature-length-port-id',
              )}
            </>
          ) : null}
          <div className="SpaghettiFeatureSectionHeader">
            <span>Width</span>
          </div>
          <FeatureValueBar
            label="mm"
            value={widthValue}
            min={0}
            max={500}
            step={0.1}
            disabled={widthDriven}
            onChange={(nextWidth) =>
              setSketchRectangleDimensions(nodeId, feature.featureId, {
                width: nextWidth,
              })
            }
          />
          <div className="SpaghettiFeatureSectionHeader">
            <span>Length</span>
          </div>
          <FeatureValueBar
            label="mm"
            value={lengthValue}
            min={0}
            max={500}
            step={0.1}
            disabled={lengthDriven}
            onChange={(nextLength) =>
              setSketchRectangleDimensions(nodeId, feature.featureId, {
                length: nextLength,
              })
            }
          />
        </>
      ) : null}
      <div className="SpaghettiFeatureSectionHeader">
        <span>Components</span>
        <div className="SpaghettiFeatureStackActions">
          <button
            type="button"
            {...SP_INTERACTIVE_PROPS}
            onClick={() => addSketchComponent(nodeId, feature.featureId, 'line')}
          >
            + Line
          </button>
          <button
            type="button"
            {...SP_INTERACTIVE_PROPS}
            onClick={() => addSketchComponent(nodeId, feature.featureId, 'spline')}
          >
            + Spline
          </button>
          <button
            type="button"
            {...SP_INTERACTIVE_PROPS}
            onClick={() => addSketchComponent(nodeId, feature.featureId, 'arc3pt')}
          >
            + Arc
          </button>
        </div>
      </div>

      {feature.components.length === 0 ? (
        <div className="SpaghettiFeatureEmpty">No components yet.</div>
      ) : (
        <div className="SpaghettiFeatureLineList">
          {feature.components.map((component, index) => (
            <div key={component.rowId} className="SpaghettiFeatureLineRow">
              <div className="SpaghettiFeatureLineTitle">
                {componentTitle(component)} {index + 1}{' '}
                <span>{component.componentId.slice(0, 8)}</span>
              </div>
              <div className="SpaghettiFeatureStackActions">
                <button
                  type="button"
                  {...SP_INTERACTIVE_PROPS}
                  onClick={() => moveSketchComponentUp(nodeId, feature.featureId, component.rowId)}
                >
                  Up
                </button>
                <button
                  type="button"
                  {...SP_INTERACTIVE_PROPS}
                  onClick={() => moveSketchComponentDown(nodeId, feature.featureId, component.rowId)}
                >
                  Down
                </button>
                <button
                  type="button"
                  {...SP_INTERACTIVE_PROPS}
                  onClick={() => removeSketchComponent(nodeId, feature.featureId, component.rowId)}
                >
                  Delete
                </button>
              </div>
              {POINT_KEYS_BY_COMPONENT[component.type].map((pointKey) =>
                renderPointEditor(component, pointKey),
              )}
            </div>
          ))}
        </div>
      )}

      <div className="SpaghettiFeatureSectionHeader">
        <span>Sketch: {previewProfiles.length} profiles</span>
      </div>
      {(feature.outputs.diagnostics ?? []).length > 0 ? (
        <div className="SpaghettiFeatureDiagList">
          {(feature.outputs.diagnostics ?? []).map((diagnostic, index) => (
            <div key={`${diagnostic.code}-${index}`} className="SpaghettiFeatureDiagMsg fsPrev_diagMsg isError">
              {diagnostic.code}: {diagnostic.message}
            </div>
          ))}
        </div>
      ) : null}
      {!irAvailable ? (
        <div className="SpaghettiFeatureEmpty">Profile preview unavailable for this part node.</div>
      ) : previewProfiles.length === 0 ? (
        <div className="SpaghettiFeatureEmpty">0 profiles (close the chain to resolve one).</div>
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
