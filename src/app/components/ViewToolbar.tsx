import { useMemo, useState } from 'react'
import type {
  LightSpec,
  LightType,
  MaterialPreset,
  MaterialPresetId,
} from '../../shared/viewSettingsTypes'
import {
  artifactToPartKeyStr,
  partKeyStrToLabel,
} from '../parts/partKeyResolver'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  getViewer,
  type CameraPreset,
  type GizmoMode,
  type GizmoSpace,
} from '../viewerBridge'

const cameraPresets: CameraPreset[] = ['iso', 'top', 'front', 'left', 'right']
const lightTypes: LightType[] = ['directional', 'point', 'spot', 'hemisphere', 'ambient']
const shadowSizes = [256, 512, 1024, 2048]

const numericValue = (value: string, fallback: number): number => {
  const parsed = Number(value)
  return Number.isFinite(parsed) ? parsed : fallback
}

const getLightTypeDefaults = (type: LightType): Partial<LightSpec> => {
  if (type === 'directional') {
    return {
      position: { x: 6, y: 8, z: 6 },
      target: { x: 0, y: 0, z: 0 },
      castShadow: true,
      shadowBias: -0.0005,
      shadowMapSize: 1024,
      distance: undefined,
      angleDeg: undefined,
      penumbra: undefined,
      decay: undefined,
    }
  }
  if (type === 'point') {
    return {
      position: { x: 4, y: 6, z: 4 },
      castShadow: true,
      shadowBias: -0.0002,
      shadowMapSize: 1024,
      distance: 0,
      decay: 2,
      target: undefined,
      angleDeg: undefined,
      penumbra: undefined,
    }
  }
  if (type === 'spot') {
    return {
      position: { x: 5, y: 8, z: 5 },
      target: { x: 0, y: 0, z: 0 },
      castShadow: true,
      shadowBias: -0.0003,
      shadowMapSize: 1024,
      distance: 0,
      decay: 2,
      angleDeg: 35,
      penumbra: 0.2,
    }
  }
  return {
    position: undefined,
    target: undefined,
    castShadow: undefined,
    shadowBias: undefined,
    shadowMapSize: undefined,
    distance: undefined,
    decay: undefined,
    angleDeg: undefined,
    penumbra: undefined,
  }
}

const supportsPosition = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const supportsTarget = (type: LightType): boolean =>
  type === 'directional' || type === 'spot'

const supportsSpot = (type: LightType): boolean => type === 'spot'

const supportsDistance = (type: LightType): boolean =>
  type === 'point' || type === 'spot'

const supportsShadow = (type: LightType): boolean =>
  type === 'directional' || type === 'point' || type === 'spot'

const lightTypeLabel = (type: LightType): string => {
  if (type === 'directional') {
    return 'Directional'
  }
  if (type === 'point') {
    return 'Point'
  }
  if (type === 'spot') {
    return 'Spot'
  }
  if (type === 'hemisphere') {
    return 'Hemisphere'
  }
  return 'Ambient'
}

export function ViewToolbar() {
  const parts = useAppStore((state) => state.parts)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)

  const view = useUiPrefsStore((state) => state.view)
  const setViewKey = useUiPrefsStore((state) => state.setViewKey)
  const selectLight = useUiPrefsStore((state) => state.selectLight)
  const addLight = useUiPrefsStore((state) => state.addLight)
  const deleteLight = useUiPrefsStore((state) => state.deleteLight)
  const updateLight = useUiPrefsStore((state) => state.updateLight)
  const selectMaterialPreset = useUiPrefsStore((state) => state.selectMaterialPreset)
  const updateMaterialPreset = useUiPrefsStore((state) => state.updateMaterialPreset)
  const addMaterialPreset = useUiPrefsStore((state) => state.addMaterialPreset)
  const deleteMaterialPreset = useUiPrefsStore((state) => state.deleteMaterialPreset)
  const setUsePerPartMaterial = useUiPrefsStore((state) => state.setUsePerPartMaterial)
  const assignPartMaterial = useUiPrefsStore((state) => state.assignPartMaterial)
  const clearPartMaterial = useUiPrefsStore((state) => state.clearPartMaterial)

  const [gizmoEnabled, setGizmoEnabled] = useState(false)
  const [activeCameraPreset, setActiveCameraPreset] = useState<CameraPreset>('iso')
  const [gizmoMode, setGizmoMode] = useState<GizmoMode>('translate')
  const [gizmoSpace, setGizmoSpace] = useState<GizmoSpace>('local')
  const [snapTranslate, setSnapTranslate] = useState('10')
  const [snapRotate, setSnapRotate] = useState('15')
  const [snapScale, setSnapScale] = useState('0.1')
  const [addLightType, setAddLightType] = useState<LightType>('point')
  const [addLightName, setAddLightName] = useState('')

  const selectedLight = useMemo(
    () => view.lighting.lights.find((light) => light.id === view.lighting.selectedLightId) ?? null,
    [view.lighting.lights, view.lighting.selectedLightId],
  )

  const selectedPreset = useMemo<MaterialPreset | null>(() => {
    return (
      view.materials.presets.find((preset) => preset.id === view.materials.selectedPresetId) ??
      view.materials.presets[0] ??
      null
    )
  }, [view.materials.presets, view.materials.selectedPresetId])

  const withViewer = (callback: (viewer: NonNullable<ReturnType<typeof getViewer>>) => void) => {
    const viewer = getViewer()
    if (viewer === null) {
      return
    }
    callback(viewer)
  }

  const toggleGizmo = () => {
    const next = !gizmoEnabled
    setGizmoEnabled(next)
    withViewer((viewer) => viewer.setGizmoEnabled(next))
  }

  const setGizmoModeValue = (mode: GizmoMode) => {
    setGizmoMode(mode)
    withViewer((viewer) => viewer.setGizmoMode(mode))
  }

  const toggleGizmoSpace = () => {
    const next: GizmoSpace = gizmoSpace === 'local' ? 'world' : 'local'
    setGizmoSpace(next)
    withViewer((viewer) => viewer.setGizmoSpace(next))
  }

  return (
    <aside className="RightDock">
      <div className="RightPanelStack">
        <details className="V15Panel ViewToolbarRoot">
          <summary className="V15PanelTitle ViewToolbarToggle">View</summary>
          <div className="ViewToolbarPanel">
          <details className="ViewSection CameraSection ViewStyledSection">
            <summary>Camera</summary>
            <div className="V15Wrap CameraToolbar">
              <div className="CameraPresetGrid">
              {cameraPresets.map((preset) => (
                <button
                  key={preset}
                  type="button"
                  className={`CameraButton ${activeCameraPreset === preset ? 'isActive' : ''}`}
                  aria-pressed={activeCameraPreset === preset}
                  onClick={() => {
                    setActiveCameraPreset(preset)
                    withViewer((viewer) => viewer.setCameraPreset(preset))
                  }}
                >
                  {preset[0].toUpperCase() + preset.slice(1)}
                </button>
              ))}
              </div>
              <button
                className="CameraButton CameraActionButton"
                type="button"
                onClick={() => withViewer((viewer) => viewer.frameSelected(selectedPartKey))}
              >
                Frame
              </button>
              <button
                className="CameraButton CameraActionButton"
                type="button"
                onClick={() => withViewer((viewer) => viewer.frameAll())}
              >
                Frame All
              </button>
            </div>
          </details>

          <details className="ViewSection GizmoSection ViewStyledSection">
            <summary>Gizmo</summary>
            <div className="V15Wrap">
              <button type="button" onClick={toggleGizmo}>
                Gizmo {gizmoEnabled ? 'On' : 'Off'}
              </button>
              <button type="button" onClick={() => setGizmoModeValue('translate')}>
                Move
              </button>
              <button type="button" onClick={() => setGizmoModeValue('rotate')}>
                Rotate
              </button>
              <button type="button" onClick={() => setGizmoModeValue('scale')}>
                Scale
              </button>
              <button type="button" onClick={toggleGizmoSpace}>
                {gizmoSpace === 'local' ? 'Local' : 'World'}
              </button>
            </div>
            <div className="MiniFieldGrid">
              <label>
                Move Snap
                <input
                  type="number"
                  step={1}
                  value={snapTranslate}
                  onChange={(event) => setSnapTranslate(event.target.value)}
                />
              </label>
              <label>
                Rot Snap
                <input
                  type="number"
                  step={1}
                  value={snapRotate}
                  onChange={(event) => setSnapRotate(event.target.value)}
                />
              </label>
              <label>
                Scale Snap
                <input
                  type="number"
                  step={0.01}
                  value={snapScale}
                  onChange={(event) => setSnapScale(event.target.value)}
                />
              </label>
            </div>
            <button
              type="button"
              onClick={() =>
                withViewer((viewer) =>
                  viewer.setGizmoSnap({
                    translateMm: numericValue(snapTranslate, 0),
                    rotateDeg: numericValue(snapRotate, 0),
                    scale: numericValue(snapScale, 0),
                  }),
                )
              }
            >
              Apply Snap
            </button>
            <div className="V15Meta">Mode: {gizmoMode}</div>
          </details>

          <details className="ViewSection ViewStyledSection">
            <summary>View</summary>
            <div className="ToggleList">
              <label>
                <input
                  type="checkbox"
                  checked={view.orbitEnabled}
                  onChange={(event) => setViewKey('orbitEnabled', event.target.checked)}
                />
                Orbit Enabled
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={view.gridVisible}
                  onChange={(event) => setViewKey('gridVisible', event.target.checked)}
                />
                Grid
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={view.axesVisible}
                  onChange={(event) => setViewKey('axesVisible', event.target.checked)}
                />
                Axes
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={view.shadowsEnabled}
                  onChange={(event) => setViewKey('shadowsEnabled', event.target.checked)}
                />
                Shadows
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={view.wireframe}
                  onChange={(event) => setViewKey('wireframe', event.target.checked)}
                />
                Wireframe
              </label>
              <label>
                <input
                  type="checkbox"
                  checked={view.axisOverlayEnabled}
                  onChange={(event) => setViewKey('axisOverlayEnabled', event.target.checked)}
                />
                Axis Overlay
              </label>
            </div>
            <div className="MiniFieldGrid">
              <label>
                Tone Mapping
                <select
                  value={view.toneMapping}
                  onChange={(event) =>
                    setViewKey('toneMapping', event.target.value as typeof view.toneMapping)
                  }
                >
                  <option value="none">None</option>
                  <option value="aces">ACES</option>
                </select>
              </label>
              <label>
                Exposure
                <input
                  type="range"
                  min={0}
                  max={2}
                  step={0.05}
                  value={view.exposure}
                  onChange={(event) => setViewKey('exposure', Number(event.target.value))}
                />
              </label>
              <label>
                Exposure Value
                <input
                  type="number"
                  min={0}
                  max={2}
                  step={0.05}
                  value={view.exposure}
                  onChange={(event) => setViewKey('exposure', Number(event.target.value))}
                />
              </label>
            </div>
          </details>

          <details className="ViewSection ViewStyledSection">
            <summary>Environment</summary>
            <div className="MiniFieldGrid">
              <label>
                Preset
                <select
                  value={view.envPreset}
                  onChange={(event) =>
                    setViewKey('envPreset', event.target.value as typeof view.envPreset)
                  }
                >
                  <option value="none">None</option>
                  <option value="studio">Studio</option>
                </select>
              </label>
            </div>

            <div className="V15SectionLabel">Lighting</div>
            <div className="ItemList">
              {view.lighting.lights.map((light) => {
                const selected = light.id === view.lighting.selectedLightId
                return (
                  <div
                    key={light.id}
                    className={`ListRow ${selected ? 'isSelected' : ''}`}
                    onClick={() => selectLight(light.id)}
                  >
                    <input
                      type="checkbox"
                      checked={light.enabled}
                      onChange={(event) => {
                        event.stopPropagation()
                        updateLight(light.id, { enabled: event.target.checked })
                      }}
                      onClick={(event) => event.stopPropagation()}
                    />
                    <span className="ListRowName">{light.name}</span>
                    <span className="TypeChip">{light.type}</span>
                    <button
                      type="button"
                      className="IconButton"
                      onClick={(event) => {
                        event.stopPropagation()
                        deleteLight(light.id)
                      }}
                    >
                      Del
                    </button>
                  </div>
                )
              })}
            </div>

            <div className="InlineEditorRow">
              <select
                value={addLightType}
                onChange={(event) => setAddLightType(event.target.value as LightType)}
              >
                {lightTypes.map((type) => (
                  <option key={type} value={type}>
                    {lightTypeLabel(type)}
                  </option>
                ))}
              </select>
              <input
                type="text"
                placeholder="Light name"
                value={addLightName}
                onChange={(event) => setAddLightName(event.target.value)}
              />
              <button
                type="button"
                onClick={() => {
                  const name = addLightName.trim()
                  addLight({
                    type: addLightType,
                    name: name.length > 0 ? name : undefined,
                  })
                  setAddLightName('')
                }}
              >
                Add Light
              </button>
            </div>

            {selectedLight === null ? null : (
              <div className="EditorPanel">
                <div className="MiniFieldGrid">
                  <label>
                    Enabled
                    <input
                      type="checkbox"
                      checked={selectedLight.enabled}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { enabled: event.target.checked })
                      }
                    />
                  </label>
                  <label>
                    Name
                    <input
                      type="text"
                      value={selectedLight.name}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { name: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Type
                    <select
                      value={selectedLight.type}
                      onChange={(event) => {
                        const type = event.target.value as LightType
                        updateLight(selectedLight.id, {
                          type,
                          ...getLightTypeDefaults(type),
                        })
                      }}
                    >
                      {lightTypes.map((type) => (
                        <option key={type} value={type}>
                          {lightTypeLabel(type)}
                        </option>
                      ))}
                    </select>
                  </label>
                  <label>
                    Color
                    <input
                      type="color"
                      value={selectedLight.color}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { color: event.target.value })
                      }
                    />
                  </label>
                  <label>
                    Intensity
                    <input
                      type="range"
                      min={0}
                      max={8}
                      step={0.05}
                      value={selectedLight.intensity}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { intensity: Number(event.target.value) })
                      }
                    />
                  </label>
                  <label>
                    Intensity Value
                    <input
                      type="number"
                      min={0}
                      max={8}
                      step={0.05}
                      value={selectedLight.intensity}
                      onChange={(event) =>
                        updateLight(selectedLight.id, { intensity: Number(event.target.value) })
                      }
                    />
                  </label>
                </div>

                {supportsPosition(selectedLight.type) ? (
                  <div className="VectorFieldGrid">
                    <span>Position</span>
                    <input type="number" step={0.1} value={selectedLight.position?.x ?? 0} onChange={(event) => updateLight(selectedLight.id, { position: { x: Number(event.target.value), y: selectedLight.position?.y ?? 0, z: selectedLight.position?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.position?.y ?? 0} onChange={(event) => updateLight(selectedLight.id, { position: { x: selectedLight.position?.x ?? 0, y: Number(event.target.value), z: selectedLight.position?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.position?.z ?? 0} onChange={(event) => updateLight(selectedLight.id, { position: { x: selectedLight.position?.x ?? 0, y: selectedLight.position?.y ?? 0, z: Number(event.target.value) } })} />
                  </div>
                ) : null}

                {supportsTarget(selectedLight.type) ? (
                  <div className="VectorFieldGrid">
                    <span>Target</span>
                    <input type="number" step={0.1} value={selectedLight.target?.x ?? 0} onChange={(event) => updateLight(selectedLight.id, { target: { x: Number(event.target.value), y: selectedLight.target?.y ?? 0, z: selectedLight.target?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.target?.y ?? 0} onChange={(event) => updateLight(selectedLight.id, { target: { x: selectedLight.target?.x ?? 0, y: Number(event.target.value), z: selectedLight.target?.z ?? 0 } })} />
                    <input type="number" step={0.1} value={selectedLight.target?.z ?? 0} onChange={(event) => updateLight(selectedLight.id, { target: { x: selectedLight.target?.x ?? 0, y: selectedLight.target?.y ?? 0, z: Number(event.target.value) } })} />
                  </div>
                ) : null}

                {supportsDistance(selectedLight.type) ? (
                  <div className="MiniFieldGrid">
                    <label>
                      Distance
                      <input type="number" min={0} step={0.1} value={selectedLight.distance ?? 0} onChange={(event) => updateLight(selectedLight.id, { distance: Number(event.target.value) })} />
                    </label>
                    <label>
                      Decay
                      <input type="number" min={0} step={0.1} value={selectedLight.decay ?? 2} onChange={(event) => updateLight(selectedLight.id, { decay: Number(event.target.value) })} />
                    </label>
                  </div>
                ) : null}

                {supportsSpot(selectedLight.type) ? (
                  <div className="MiniFieldGrid">
                    <label>
                      Angle (deg)
                      <input type="number" min={0} max={89} step={1} value={selectedLight.angleDeg ?? 35} onChange={(event) => updateLight(selectedLight.id, { angleDeg: Number(event.target.value) })} />
                    </label>
                    <label>
                      Penumbra
                      <input type="number" min={0} max={1} step={0.05} value={selectedLight.penumbra ?? 0.2} onChange={(event) => updateLight(selectedLight.id, { penumbra: Number(event.target.value) })} />
                    </label>
                  </div>
                ) : null}

                {supportsShadow(selectedLight.type) ? (
                  <div className="MiniFieldGrid">
                    <label>
                      Cast Shadow
                      <input type="checkbox" checked={selectedLight.castShadow ?? false} onChange={(event) => updateLight(selectedLight.id, { castShadow: event.target.checked })} />
                    </label>
                    <label>
                      Shadow Bias
                      <input type="number" step={0.0001} value={selectedLight.shadowBias ?? -0.0003} onChange={(event) => updateLight(selectedLight.id, { shadowBias: Number(event.target.value) })} />
                    </label>
                    <label>
                      Shadow Map
                      <select value={selectedLight.shadowMapSize ?? 1024} onChange={(event) => updateLight(selectedLight.id, { shadowMapSize: Number(event.target.value) })}>
                        {shadowSizes.map((size) => (
                          <option key={size} value={size}>{size}</option>
                        ))}
                      </select>
                    </label>
                  </div>
                ) : null}
              </div>
            )}
          </details>

          <details className="ViewSection ViewStyledSection">
            <summary>Materials</summary>
            <div className="ItemList">
              {view.materials.presets.map((preset) => {
                const selected = preset.id === view.materials.selectedPresetId
                return (
                  <div
                    key={preset.id}
                    className={`ListRow ${selected ? 'isSelected' : ''}`}
                    onClick={() => selectMaterialPreset(preset.id)}
                  >
                    <span className="Swatch" style={{ backgroundColor: preset.color }} />
                    <span className="ListRowName">{preset.name}</span>
                    <button
                      type="button"
                      className="IconButton"
                      onClick={(event) => {
                        event.stopPropagation()
                        deleteMaterialPreset(preset.id)
                      }}
                      disabled={view.materials.presets.length <= 1}
                    >
                      Del
                    </button>
                  </div>
                )
              })}
            </div>

            <button type="button" onClick={() => addMaterialPreset()}>
              Add Preset
            </button>

            {selectedPreset === null ? null : (
              <div className="EditorPanel">
                <div className="MiniFieldGrid">
                  <label>
                    Name
                    <input type="text" value={selectedPreset.name} onChange={(event) => updateMaterialPreset(selectedPreset.id, { name: event.target.value })} />
                  </label>
                  <label>
                    Color
                    <input type="color" value={selectedPreset.color} onChange={(event) => updateMaterialPreset(selectedPreset.id, { color: event.target.value })} />
                  </label>
                  <label>
                    Metalness
                    <input type="range" min={0} max={1} step={0.01} value={selectedPreset.metalness} onChange={(event) => updateMaterialPreset(selectedPreset.id, { metalness: Number(event.target.value) })} />
                  </label>
                  <label>
                    Roughness
                    <input type="range" min={0} max={1} step={0.01} value={selectedPreset.roughness} onChange={(event) => updateMaterialPreset(selectedPreset.id, { roughness: Number(event.target.value) })} />
                  </label>
                  <label>
                    Emissive
                    <input type="color" value={selectedPreset.emissive} onChange={(event) => updateMaterialPreset(selectedPreset.id, { emissive: event.target.value })} />
                  </label>
                  <label>
                    Emissive Intensity
                    <input type="number" min={0} max={2} step={0.05} value={selectedPreset.emissiveIntensity} onChange={(event) => updateMaterialPreset(selectedPreset.id, { emissiveIntensity: Number(event.target.value) })} />
                  </label>
                  <label>
                    Opacity
                    <input type="number" min={0} max={1} step={0.05} value={selectedPreset.opacity} onChange={(event) => updateMaterialPreset(selectedPreset.id, { opacity: Number(event.target.value) })} />
                  </label>
                  <label>
                    Transparent
                    <input type="checkbox" checked={selectedPreset.transparent} onChange={(event) => updateMaterialPreset(selectedPreset.id, { transparent: event.target.checked })} />
                  </label>
                </div>
              </div>
            )}

            <div className="V15SectionLabel">Per-Part Assignment</div>
            <label className="InlineCheck">
              <input
                type="checkbox"
                checked={view.materials.usePerPart}
                onChange={(event) => setUsePerPartMaterial(event.target.checked)}
              />
              Use per-part material map
            </label>

            <div className="ItemList">
              {parts.length === 0 ? (
                <div className="V15Meta">No parts yet.</div>
              ) : (
                parts.map((part) => {
                  const partKeyStr = artifactToPartKeyStr(part)
                  const assigned = view.materials.perPart[partKeyStr] ?? ''
                  return (
                    <div key={partKeyStr} className="AssignmentRow">
                      <span className="ListRowName">{partKeyStrToLabel(partKeyStr)}</span>
                      <select
                        value={assigned}
                        onChange={(event) => {
                          const value = event.target.value as MaterialPresetId
                          if (value === '') {
                            clearPartMaterial(partKeyStr)
                            return
                          }
                          assignPartMaterial(partKeyStr, value)
                        }}
                      >
                        <option value="">Selected default</option>
                        {view.materials.presets.map((preset) => (
                          <option key={preset.id} value={preset.id}>
                            {preset.name}
                          </option>
                        ))}
                      </select>
                      <button type="button" className="IconButton" onClick={() => clearPartMaterial(partKeyStr)}>
                        Clear
                      </button>
                    </div>
                  )
                })
              )}
            </div>
          </details>
          </div>
        </details>
      </div>
    </aside>
  )
}
