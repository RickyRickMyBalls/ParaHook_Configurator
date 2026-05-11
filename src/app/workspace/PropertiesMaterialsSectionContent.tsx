import {
  useEffect,
  useMemo,
  useRef,
  useState,
  type CSSProperties,
  type KeyboardEvent,
  type MouseEvent,
} from 'react'
import type { MaterialPreset } from '../../shared/viewSettingsTypes'
import { ParaSelect } from '../components/ParaSelect'
import { ParaSlider } from '../components/ParaSlider'
import {
  assignMaterialPresetToPartsWithHistory,
  assignMaterialPresetToPartWithHistory,
  createAndAssignMaterialPresetWithHistory,
  duplicateMaterialPresetForPartWithHistory,
  updateMaterialPresetCopiesForPartsWithHistory,
  updateMaterialPresetsForPartsWithHistory,
  updateMaterialPresetWithHistory,
} from '../store/materialEditHistory'
import { useAppStore } from '../store/useAppStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  buildMaterialsAssignmentGroups,
  buildMaterialsPhase1ViewModel,
  resolveSelectedMaterialScopeRead,
  resolveSelectedTargetMaterialRead,
  type MaterialsAssignmentGroup,
  type MaterialsSelectedMaterialRead,
} from './materialsSectionViewModel'
import type { PropertiesSectionContext } from './propertiesSectionContract'

const formatScalarPercent = (value: number): string => `${Math.round(value * 100)}%`

type RgbColor = {
  r: number
  g: number
  b: number
}

type HsvColor = {
  h: number
  s: number
  v: number
}

const clampRgbChannel = (value: number): number =>
  Math.min(255, Math.max(0, Math.round(value)))

const clampUnit = (value: number): number => Math.min(1, Math.max(0, value))

const formatRgbChannel = (value: number): string => `${Math.round(value)}`

const formatHueDegrees = (value: number): string => `${Math.round(value)}deg`

const parseHexColor = (hexColor: string): RgbColor => {
  const normalized = /^#[0-9a-f]{6}$/i.test(hexColor) ? hexColor.slice(1) : '000000'
  return {
    r: Number.parseInt(normalized.slice(0, 2), 16),
    g: Number.parseInt(normalized.slice(2, 4), 16),
    b: Number.parseInt(normalized.slice(4, 6), 16),
  }
}

const rgbToHex = ({ r, g, b }: RgbColor): string => {
  const toHexChannel = (value: number) => clampRgbChannel(value).toString(16).padStart(2, '0')
  return `#${toHexChannel(r)}${toHexChannel(g)}${toHexChannel(b)}`
}

const rgbToHsv = ({ r, g, b }: RgbColor): HsvColor => {
  const red = r / 255
  const green = g / 255
  const blue = b / 255
  const max = Math.max(red, green, blue)
  const min = Math.min(red, green, blue)
  const delta = max - min

  if (delta === 0) {
    return { h: 0, s: 0, v: max }
  }

  const saturation = max === 0 ? 0 : delta / max
  let hue = 0
  if (max === red) {
    hue = ((green - blue) / delta) % 6
  } else if (max === green) {
    hue = (blue - red) / delta + 2
  } else {
    hue = (red - green) / delta + 4
  }

  return {
    h: hue * 60 < 0 ? hue * 60 + 360 : hue * 60,
    s: saturation,
    v: max,
  }
}

const hsvToRgb = ({ h, s, v }: HsvColor): RgbColor => {
  const chroma = v * s
  const huePrime = h / 60
  const secondComponent = chroma * (1 - Math.abs((huePrime % 2) - 1))
  const match = v - chroma
  let red = 0
  let green = 0
  let blue = 0

  if (huePrime >= 0 && huePrime < 1) {
    red = chroma
    green = secondComponent
  } else if (huePrime >= 1 && huePrime < 2) {
    red = secondComponent
    green = chroma
  } else if (huePrime >= 2 && huePrime < 3) {
    green = chroma
    blue = secondComponent
  } else if (huePrime >= 3 && huePrime < 4) {
    green = secondComponent
    blue = chroma
  } else if (huePrime >= 4 && huePrime < 5) {
    red = secondComponent
    blue = chroma
  } else {
    red = chroma
    blue = secondComponent
  }

  return {
    r: clampRgbChannel((red + match) * 255),
    g: clampRgbChannel((green + match) * 255),
    b: clampRgbChannel((blue + match) * 255),
  }
}

const buildMaterialPropertyRows = (materialRead: MaterialsSelectedMaterialRead) => {
  if (materialRead.preset === null) {
    return [
      {
        label: 'Material read status',
        description: 'No material preset can be resolved for the selected target yet.',
        value: materialRead.sourceLabel,
      },
    ]
  }

  return [
    {
      label: 'Material source',
      description: 'The current assignment path used for this selected target.',
      value: materialRead.sourceLabel,
    },
    {
      label: 'Material name',
      description: 'Resolved from the current typed material preset truth.',
      value: materialRead.preset.name,
    },
    {
      label: 'Color',
      description: 'Display-only swatch and color value for the selected target.',
      value: materialRead.preset.color,
    },
    {
      label: 'Metalness',
      description: 'Current display-only material metalness.',
      value: formatScalarPercent(materialRead.preset.metalness),
    },
    {
      label: 'Roughness',
      description: 'Current display-only material roughness.',
      value: formatScalarPercent(materialRead.preset.roughness),
    },
    {
      label: 'Opacity',
      description: 'Current display-only material opacity.',
      value: formatScalarPercent(materialRead.preset.opacity),
    },
    {
      label: 'Transparency',
      description: 'Current display-only transparent flag.',
      value: materialRead.preset.transparent ? 'Transparent' : 'Opaque',
    },
    {
      label: 'Emissive',
      description: 'Current display-only emissive color and intensity.',
      value: `${materialRead.preset.emissive} / ${formatScalarPercent(
        materialRead.preset.emissiveIntensity,
      )}`,
    },
  ]
}

const createNewMaterialSeed = (preset: MaterialPreset): Partial<MaterialPreset> => ({
  name: 'New Material',
  color: preset.color,
  metalness: preset.metalness,
  roughness: preset.roughness,
  emissive: preset.emissive,
  emissiveIntensity: preset.emissiveIntensity,
  opacity: preset.opacity,
  transparent: preset.transparent,
  doubleSided: preset.doubleSided,
})

const MATERIAL_TARGET_LIST_ROW_HEIGHT = 32
const MATERIAL_TARGET_LIST_ROW_GAP = 4
const MATERIAL_TARGET_LIST_VERTICAL_PADDING = 4
const MATERIAL_TARGET_LIST_DEFAULT_ROW_COUNT = 3
const MATERIAL_TARGET_LIST_MIN_HEIGHT = MATERIAL_TARGET_LIST_ROW_HEIGHT + MATERIAL_TARGET_LIST_VERTICAL_PADDING
const MATERIAL_TARGET_LIST_DEFAULT_HEIGHT =
  MATERIAL_TARGET_LIST_ROW_HEIGHT * MATERIAL_TARGET_LIST_DEFAULT_ROW_COUNT +
  MATERIAL_TARGET_LIST_ROW_GAP * (MATERIAL_TARGET_LIST_DEFAULT_ROW_COUNT - 1) +
  MATERIAL_TARGET_LIST_VERTICAL_PADDING
const MATERIAL_TARGET_LIST_MAX_HEIGHT = 420
const MATERIAL_TARGET_LIST_KEYBOARD_STEP = 12

const PROJECT_MATERIAL_LIST_ROW_HEIGHT = 34
const PROJECT_MATERIAL_LIST_ROW_GAP = 4
const PROJECT_MATERIAL_LIST_VERTICAL_PADDING = 4
const PROJECT_MATERIAL_LIST_DEFAULT_ROW_COUNT = 3
const PROJECT_MATERIAL_LIST_MIN_HEIGHT =
  PROJECT_MATERIAL_LIST_ROW_HEIGHT + PROJECT_MATERIAL_LIST_VERTICAL_PADDING
const PROJECT_MATERIAL_LIST_DEFAULT_HEIGHT =
  PROJECT_MATERIAL_LIST_ROW_HEIGHT * PROJECT_MATERIAL_LIST_DEFAULT_ROW_COUNT +
  PROJECT_MATERIAL_LIST_ROW_GAP * (PROJECT_MATERIAL_LIST_DEFAULT_ROW_COUNT - 1) +
  PROJECT_MATERIAL_LIST_VERTICAL_PADDING
const PROJECT_MATERIAL_LIST_MAX_HEIGHT = 420
const PROJECT_MATERIAL_LIST_KEYBOARD_STEP = 12
const TRANSPARENCY_OPTIONS = [
  { value: 'opaque', label: 'Opaque' },
  { value: 'transparent', label: 'Transparent' },
]
const DOUBLE_SIDED_OPTIONS = [
  { value: 'front', label: 'Front-sided' },
  { value: 'double', label: 'Double-sided' },
]

type MaterialColorControlProps = {
  id: 'color' | 'emissive'
  label: string
  value: string
  isExpanded: boolean
  onExpandedChange: (nextExpanded: boolean) => void
  onChange: (nextHexColor: string) => void
  nativeInputLabel: string
  expandButtonLabel: string
  expandedControlsLabel: string
  fieldState?: string
  disabled?: boolean
}

function MaterialColorControl({
  id,
  label,
  value,
  isExpanded,
  onExpandedChange,
  onChange,
  nativeInputLabel,
  expandButtonLabel,
  expandedControlsLabel,
  fieldState = 'value',
  disabled = false,
}: MaterialColorControlProps) {
  const rgb = useMemo(() => parseHexColor(value), [value])
  const hsv = useMemo(() => rgbToHsv(rgb), [rgb])

  const updateRgbChannel = (field: keyof RgbColor, nextValue: number) => {
    onChange(
      rgbToHex({
        ...rgb,
        [field]: clampRgbChannel(nextValue),
      }),
    )
  }
  const updateHue = (nextValue: number) => {
    onChange(
      rgbToHex(
        hsvToRgb({
          ...hsv,
          h: Math.min(360, Math.max(0, Math.round(nextValue))),
        }),
      ),
    )
  }
  const updateSaturation = (nextValue: number) => {
    onChange(
      rgbToHex(
        hsvToRgb({
          ...hsv,
          s: clampUnit(nextValue),
        }),
      ),
    )
  }
  const updateBrightness = (nextValue: number) => {
    onChange(
      rgbToHex(
        hsvToRgb({
          ...hsv,
          v: clampUnit(nextValue),
        }),
      ),
    )
  }

  return (
    <div
      className={`PropertiesSelectedMaterialField PropertiesSelectedMaterialField--color PropertiesSelectedMaterialField--expandable ${
        isExpanded ? 'isExpanded' : ''
      }`}
      role="listitem"
      data-selected-material-control={id}
      data-selected-material-field-state={fieldState}
    >
      <button
        type="button"
        className="PropertiesSelectedMaterialFieldToggle"
        aria-label={expandButtonLabel}
        aria-expanded={isExpanded}
        disabled={disabled}
        onClick={() => onExpandedChange(!isExpanded)}
      >
        <span className="PropertiesSelectedMaterialChevron" aria-hidden="true">
          {isExpanded ? 'v' : '>'}
        </span>
        <span>{label}</span>
      </button>
      <input
        aria-label={nativeInputLabel}
        type="color"
        value={value}
        disabled={disabled}
        onInput={(event) => onChange(event.currentTarget.value)}
      />
      {isExpanded ? (
        <div className="PropertiesSelectedMaterialColorSliders" aria-label={expandedControlsLabel}>
          <div
            className="PropertiesSelectedMaterialControl"
            data-selected-material-color-control="hue"
          >
            <ParaSlider
              label="Hue"
              value={hsv.h}
              min={0}
              max={360}
              step={1}
              onChange={updateHue}
              formatValue={formatHueDegrees}
              disabled={disabled}
            />
          </div>
          <div
            className="PropertiesSelectedMaterialControl"
            data-selected-material-color-control="saturation"
          >
            <ParaSlider
              label="Saturation"
              value={hsv.s}
              min={0}
              max={1}
              step={0.01}
              onChange={updateSaturation}
              formatValue={formatScalarPercent}
              disabled={disabled}
            />
          </div>
          <div
            className="PropertiesSelectedMaterialControl"
            data-selected-material-color-control="brightness"
          >
            <ParaSlider
              label="Brightness"
              value={hsv.v}
              min={0}
              max={1}
              step={0.01}
              onChange={updateBrightness}
              formatValue={formatScalarPercent}
              disabled={disabled}
            />
          </div>
          <div
            className="PropertiesSelectedMaterialControl"
            data-selected-material-color-control="red"
          >
            <ParaSlider
              label="R"
              value={rgb.r}
              min={0}
              max={255}
              step={1}
              onChange={(nextValue) => updateRgbChannel('r', nextValue)}
              formatValue={formatRgbChannel}
              disabled={disabled}
            />
          </div>
          <div
            className="PropertiesSelectedMaterialControl"
            data-selected-material-color-control="green"
          >
            <ParaSlider
              label="G"
              value={rgb.g}
              min={0}
              max={255}
              step={1}
              onChange={(nextValue) => updateRgbChannel('g', nextValue)}
              formatValue={formatRgbChannel}
              disabled={disabled}
            />
          </div>
          <div
            className="PropertiesSelectedMaterialControl"
            data-selected-material-color-control="blue"
          >
            <ParaSlider
              label="B"
              value={rgb.b}
              min={0}
              max={255}
              step={1}
              onChange={(nextValue) => updateRgbChannel('b', nextValue)}
              formatValue={formatRgbChannel}
              disabled={disabled}
            />
          </div>
        </div>
      ) : null}
    </div>
  )
}

function MixedSelectedMaterialField({
  controlId,
  label,
}: {
  controlId: string
  label: string
}) {
  return (
    <div
      className="PropertiesSelectedMaterialField PropertiesSelectedMaterialField--mixed"
      role="listitem"
      data-selected-material-control={controlId}
      data-selected-material-field-state="mixed"
    >
      <span>{label}</span>
      <span className="PropertiesSelectedMaterialMixedValue">Multiple values</span>
    </div>
  )
}

const clampMaterialTargetListHeight = (height: number): number =>
  Math.min(MATERIAL_TARGET_LIST_MAX_HEIGHT, Math.max(MATERIAL_TARGET_LIST_MIN_HEIGHT, height))

const resolveMaterialTargetListDefaultHeight = (rowCount: number): number => {
  const visibleRowCount = Math.min(MATERIAL_TARGET_LIST_DEFAULT_ROW_COUNT, Math.max(1, rowCount))
  return (
    MATERIAL_TARGET_LIST_ROW_HEIGHT * visibleRowCount +
    MATERIAL_TARGET_LIST_ROW_GAP * (visibleRowCount - 1) +
    MATERIAL_TARGET_LIST_VERTICAL_PADDING
  )
}

const clampProjectMaterialListHeight = (height: number): number =>
  Math.min(PROJECT_MATERIAL_LIST_MAX_HEIGHT, Math.max(PROJECT_MATERIAL_LIST_MIN_HEIGHT, height))

const resolveProjectMaterialListDefaultHeight = (rowCount: number): number => {
  const visibleRowCount = Math.min(PROJECT_MATERIAL_LIST_DEFAULT_ROW_COUNT, Math.max(1, rowCount))
  return (
    PROJECT_MATERIAL_LIST_ROW_HEIGHT * visibleRowCount +
    PROJECT_MATERIAL_LIST_ROW_GAP * (visibleRowCount - 1) +
    PROJECT_MATERIAL_LIST_VERTICAL_PADDING
  )
}

export function PropertiesMaterialsSectionContent({
  context,
}: {
  context: PropertiesSectionContext
}) {
  const materials = useUiPrefsStore((state) => state.view.materials)
  const projectContent = useAppStore((state) => state.projectContent)
  const referenceWorkspace = useAppStore((state) => state.referenceWorkspace)
  const viewModel = useMemo(
    () => buildMaterialsPhase1ViewModel(context, materials, { projectContent, referenceWorkspace }),
    [context, materials, projectContent, referenceWorkspace],
  )
  const [selectedTargetId, setSelectedTargetId] = useState<string | null>(
    viewModel.targetRows[0]?.targetId ?? null,
  )
  const [targetListHeight, setTargetListHeight] = useState(
    resolveMaterialTargetListDefaultHeight(viewModel.targetRows.length),
  )
  const [projectMaterialListHeight, setProjectMaterialListHeight] = useState(
    resolveProjectMaterialListDefaultHeight(materials.presets.length),
  )
  const [isResizingTargetList, setIsResizingTargetList] = useState(false)
  const [isResizingProjectMaterialList, setIsResizingProjectMaterialList] = useState(false)
  const [isBaseColorExpanded, setIsBaseColorExpanded] = useState(false)
  const [isEmissiveColorExpanded, setIsEmissiveColorExpanded] = useState(false)
  const [createMaterialOnMultiEdit, setCreateMaterialOnMultiEdit] = useState(false)
  const [projectMaterialSearch, setProjectMaterialSearch] = useState('')
  const targetListResizeStartClientYRef = useRef(0)
  const targetListResizeStartHeightRef = useRef(MATERIAL_TARGET_LIST_DEFAULT_HEIGHT)
  const projectMaterialListResizeStartClientYRef = useRef(0)
  const projectMaterialListResizeStartHeightRef = useRef(PROJECT_MATERIAL_LIST_DEFAULT_HEIGHT)
  const previousProjectMaterialPresetCountRef = useRef(materials.presets.length)
  const effectiveSelectedTargetId = viewModel.targetRows.some(
    (targetRow) => targetRow.targetId === selectedTargetId,
  )
    ? selectedTargetId
    : (viewModel.targetRows[0]?.targetId ?? null)
  const selectedTarget =
    viewModel.targetRows.find((targetRow) => targetRow.targetId === effectiveSelectedTargetId) ?? null
  const selectedMaterialRead = useMemo(
    () => resolveSelectedMaterialScopeRead(selectedTarget, viewModel.assignmentScope, materials),
    [materials, selectedTarget, viewModel.assignmentScope],
  )
  const materialPropertyRows = useMemo(
    () => buildMaterialPropertyRows(selectedMaterialRead),
    [selectedMaterialRead],
  )
  const selectedMaterialPreset = selectedMaterialRead.preset
  const selectedMaterialFields = selectedMaterialRead.fields
  const isMultiTargetMaterialRead = selectedMaterialRead.targetCount > 1
  const projectMaterialSearchQuery = projectMaterialSearch.trim().toLocaleLowerCase()
  const visibleProjectMaterialPresets = useMemo(() => {
    if (projectMaterialSearchQuery.length === 0) {
      return materials.presets
    }

    return materials.presets.filter((preset) =>
      `${preset.name} ${preset.id}`.toLocaleLowerCase().includes(projectMaterialSearchQuery),
    )
  }, [materials.presets, projectMaterialSearchQuery])
  const assignmentGroups = useMemo(
    () => buildMaterialsAssignmentGroups(viewModel.targetRows),
    [viewModel.targetRows],
  )
  const selectedProjectMaterialPresetIds = useMemo(() => {
    const readTargets =
      viewModel.assignmentScope.targetRows.length > 0
        ? viewModel.assignmentScope.targetRows
        : selectedTarget === null
          ? []
          : [selectedTarget]
    return new Set(
      readTargets.flatMap((targetRow) => {
        const read = resolveSelectedTargetMaterialRead(targetRow, materials)
        return read.preset === null ? [] : [read.preset.id]
      }),
    )
  }, [materials, selectedTarget, viewModel.assignmentScope.targetRows])
  const updateResolvedPreset = (patch: Partial<MaterialPreset>) => {
    if (selectedMaterialPreset === null) {
      return
    }

    if (isMultiTargetMaterialRead) {
      const patchTargets = viewModel.assignmentScope.targetRows.flatMap((targetRow) => {
        const read = resolveSelectedTargetMaterialRead(targetRow, materials)
        return read.preset === null ? [] : [{ partId: targetRow.partKey, preset: read.preset }]
      })
      const updateMultiTargetMaterials = createMaterialOnMultiEdit
        ? updateMaterialPresetCopiesForPartsWithHistory
        : updateMaterialPresetsForPartsWithHistory
      updateMultiTargetMaterials(patchTargets, patch, {
        label: 'Edit selected material objects',
        targetId: `material-per-part:selected-objects:${viewModel.assignmentScope.partKeys.join('|')}:edit`,
        targetLabel: 'Selected material objects',
      })
      return
    }

    updateMaterialPresetWithHistory(selectedMaterialPreset.id, patch, {
      label: 'Edit material properties',
      targetId: `material-preset:${selectedMaterialPreset.id}:properties`,
      targetLabel: selectedMaterialPreset.name,
    })
  }
  const updateResolvedScalarPreset = (
    field: 'metalness' | 'roughness' | 'opacity' | 'emissiveIntensity',
    value: number,
  ) => {
    updateResolvedPreset({ [field]: value })
  }
  const canRunMaterialAction = selectedTarget !== null && selectedMaterialPreset !== null
  const canAssignProjectMaterial =
    viewModel.assignmentScope.partKeys.length > 0 || selectedTarget !== null
  const handleNewMaterial = () => {
    if (selectedTarget === null || selectedMaterialPreset === null) {
      return
    }

    createAndAssignMaterialPresetWithHistory(
      selectedTarget.partKey,
      createNewMaterialSeed(selectedMaterialPreset),
      {
        label: 'Create and assign material',
        targetId: `material-per-part:${selectedTarget.partKey}:create-assign`,
        targetLabel: selectedTarget.label,
      },
    )
  }
  const handleAssignMaterial = (presetId: string) => {
    if (viewModel.assignmentScope.partKeys.length === 1) {
      const targetRow = viewModel.assignmentScope.targetRows[0] ?? selectedTarget
      const partKey = viewModel.assignmentScope.partKeys[0]
      assignMaterialPresetToPartWithHistory(partKey, presetId, {
        label: 'Assign material',
        targetId: `material-per-part:${partKey}:assign`,
        targetLabel: targetRow?.label ?? 'Material target',
      })
      return
    }

    if (viewModel.assignmentScope.partKeys.length > 1) {
      assignMaterialPresetToPartsWithHistory(viewModel.assignmentScope.partKeys, presetId, {
        label: 'Assign material to selected objects',
        targetId: `material-per-part:selected-objects:${viewModel.assignmentScope.partKeys.join('|')}:assign`,
        targetLabel: 'Selected material objects',
      })
      return
    }

    if (selectedTarget === null) {
      return
    }

    assignMaterialPresetToPartWithHistory(selectedTarget.partKey, presetId, {
      label: 'Assign material',
      targetId: `material-per-part:${selectedTarget.partKey}:assign`,
      targetLabel: selectedTarget.label,
    })
  }
  const canRunAssignmentGroup = (group: MaterialsAssignmentGroup): boolean =>
    selectedMaterialPreset !== null && viewModel.targetRows.length > 1 && group.partKeys.length > 0
  const handleAssignMaterialGroup = (group: MaterialsAssignmentGroup) => {
    if (selectedMaterialPreset === null || !canRunAssignmentGroup(group)) {
      return
    }

    assignMaterialPresetToPartsWithHistory(group.partKeys, selectedMaterialPreset.id, {
      label: `${group.label} material`,
      targetId: `material-per-part:group:${group.id}:assign`,
      targetLabel: group.label,
    })
  }
  const handleDuplicateMaterial = () => {
    if (selectedTarget === null || selectedMaterialPreset === null) {
      return
    }

    duplicateMaterialPresetForPartWithHistory(selectedTarget.partKey, selectedMaterialPreset, {
      label: 'Duplicate and assign material',
      targetId: `material-per-part:${selectedTarget.partKey}:duplicate-assign`,
      targetLabel: selectedTarget.label,
    })
  }
  useEffect(() => {
    setTargetListHeight(resolveMaterialTargetListDefaultHeight(viewModel.targetRows.length))
  }, [viewModel.targetRows.length])
  useEffect(() => {
    const previousPresetCount = previousProjectMaterialPresetCountRef.current
    previousProjectMaterialPresetCountRef.current = materials.presets.length

    if (previousPresetCount === 0 || materials.presets.length === 0) {
      setProjectMaterialListHeight(resolveProjectMaterialListDefaultHeight(materials.presets.length))
    }
  }, [materials.presets.length])
  useEffect(() => {
    if (!isResizingTargetList) {
      return undefined
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const dragOffset = event.clientY - targetListResizeStartClientYRef.current
      setTargetListHeight(
        clampMaterialTargetListHeight(targetListResizeStartHeightRef.current + dragOffset),
      )
    }

    const handleMouseUp = () => {
      setIsResizingTargetList(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add('PropertiesMaterialsIsResizingTargetList')

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('PropertiesMaterialsIsResizingTargetList')
    }
  }, [isResizingTargetList])
  useEffect(() => {
    if (!isResizingProjectMaterialList) {
      return undefined
    }

    const handleMouseMove = (event: globalThis.MouseEvent) => {
      const dragOffset = event.clientY - projectMaterialListResizeStartClientYRef.current
      setProjectMaterialListHeight(
        clampProjectMaterialListHeight(
          projectMaterialListResizeStartHeightRef.current + dragOffset,
        ),
      )
    }

    const handleMouseUp = () => {
      setIsResizingProjectMaterialList(false)
    }

    document.addEventListener('mousemove', handleMouseMove)
    document.addEventListener('mouseup', handleMouseUp)
    document.body.classList.add('PropertiesMaterialsIsResizingProjectMaterialList')

    return () => {
      document.removeEventListener('mousemove', handleMouseMove)
      document.removeEventListener('mouseup', handleMouseUp)
      document.body.classList.remove('PropertiesMaterialsIsResizingProjectMaterialList')
    }
  }, [isResizingProjectMaterialList])
  const targetListHeightStyle = {
    '--properties-material-target-list-height': `${targetListHeight}px`,
  } as CSSProperties
  const projectMaterialListHeightStyle = {
    '--properties-project-material-list-height': `${projectMaterialListHeight}px`,
  } as CSSProperties
  const handleTargetListResizeStart = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    targetListResizeStartClientYRef.current = event.clientY
    targetListResizeStartHeightRef.current = targetListHeight
    setIsResizingTargetList(true)
  }
  const handleTargetListResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setTargetListHeight((currentHeight) => {
      if (event.key === 'Home') {
        return MATERIAL_TARGET_LIST_MIN_HEIGHT
      }

      if (event.key === 'End') {
        return MATERIAL_TARGET_LIST_MAX_HEIGHT
      }

      const direction = event.key === 'ArrowUp' ? -1 : 1
      return clampMaterialTargetListHeight(
        currentHeight + direction * MATERIAL_TARGET_LIST_KEYBOARD_STEP,
      )
    })
  }
  const handleProjectMaterialListResizeStart = (event: MouseEvent<HTMLDivElement>) => {
    event.preventDefault()
    projectMaterialListResizeStartClientYRef.current = event.clientY
    projectMaterialListResizeStartHeightRef.current = projectMaterialListHeight
    setIsResizingProjectMaterialList(true)
  }
  const handleProjectMaterialListResizeKeyDown = (event: KeyboardEvent<HTMLDivElement>) => {
    if (
      event.key !== 'ArrowUp' &&
      event.key !== 'ArrowDown' &&
      event.key !== 'Home' &&
      event.key !== 'End'
    ) {
      return
    }

    event.preventDefault()
    setProjectMaterialListHeight((currentHeight) => {
      if (event.key === 'Home') {
        return PROJECT_MATERIAL_LIST_MIN_HEIGHT
      }

      if (event.key === 'End') {
        return PROJECT_MATERIAL_LIST_MAX_HEIGHT
      }

      const direction = event.key === 'ArrowUp' ? -1 : 1
      return clampProjectMaterialListHeight(
        currentHeight + direction * PROJECT_MATERIAL_LIST_KEYBOARD_STEP,
      )
    })
  }

  return (
    <section
      className="SettingsSurfaceGroup"
      aria-label="Properties materials section"
      data-material-assignment-scope={viewModel.assignmentScope.kind}
      data-material-assignment-object-count={viewModel.assignmentScope.objectCount}
      data-material-assignment-target-count={viewModel.assignmentScope.targetCount}
    >
      <section className="SettingsSurfaceGroup" aria-label="Material targets">
        <header className="SettingsSurfaceGroupHeader">
          <span className="SettingsSurfaceGroupEyebrow">Material targets</span>
          <strong>{viewModel.targetStatusLabel}</strong>
          <p>Choose the part or imported mesh whose material you want to edit.</p>
        </header>
        {viewModel.targetRows.length > 0 ? (
          <>
            <div
              className="PropertiesMaterialsTargetList"
              role="list"
              aria-label="Material target rows"
              data-material-target-list="compact"
              style={targetListHeightStyle}
            >
              {viewModel.targetRows.map((targetRow, targetIndex) => {
                const isSelected = targetRow.targetId === effectiveSelectedTargetId
                return (
                  <button
                    type="button"
                    className={`PropertiesMaterialsTargetButton ${isSelected ? 'isActive' : ''}`}
                    role="listitem"
                    key={targetRow.targetId}
                    aria-pressed={isSelected}
                    title={targetRow.partKey}
                    data-material-target-row={targetRow.targetId}
                    data-material-target-selected={isSelected}
                    onClick={() => setSelectedTargetId(targetRow.targetId)}
                  >
                    <span className="PropertiesMaterialsTargetIndex">{targetIndex + 1}</span>
                    <span className="PropertiesMaterialsTargetButtonCopy">
                      <strong>{targetRow.label}</strong>
                      <span>{targetRow.detail}</span>
                    </span>
                  </button>
                )
              })}
            </div>
            <div
              className="PropertiesMaterialsTargetListResizeHandle"
              role="separator"
              aria-label="Resize material target list"
              aria-orientation="horizontal"
              aria-valuemin={MATERIAL_TARGET_LIST_MIN_HEIGHT}
              aria-valuemax={MATERIAL_TARGET_LIST_MAX_HEIGHT}
              aria-valuenow={targetListHeight}
              tabIndex={0}
              data-material-target-list-resize-handle="bottom"
              onMouseDown={handleTargetListResizeStart}
              onKeyDown={handleTargetListResizeKeyDown}
            />
          </>
        ) : (
          <div className="SettingsSurfaceRowList" role="list" aria-label="Material target pending state">
            <article
              className="SettingsSurfaceRowCard"
              role="listitem"
              data-material-target-row="pending"
            >
              <div className="SettingsSurfaceRowCopy">
                <strong>No material parts found</strong>
                <p>This item does not expose editable material parts yet.</p>
              </div>
              <div className="SettingsSurfaceRowValue" aria-label="Material target status">
                No targets
              </div>
            </article>
          </div>
        )}
      </section>
      <section className="SettingsSurfaceGroup" aria-label="Project material presets">
        <header className="SettingsSurfaceGroupHeader">
          <span className="SettingsSurfaceGroupEyebrow">Project materials</span>
          <strong>
            {materials.presets.length} material{materials.presets.length === 1 ? '' : 's'}
          </strong>
          <p>Choose a project material to apply to the selected target.</p>
        </header>
        <div
          className="PropertiesMaterialActionRail"
          role="list"
          aria-label="Project material actions"
        >
          <button
            type="button"
            className="PropertiesMaterialActionButton"
            role="listitem"
            disabled={!canRunMaterialAction}
            data-material-action="New Material"
            onClick={handleNewMaterial}
          >
            <strong>New Material</strong>
            <span>Create</span>
          </button>
          <button
            type="button"
            className="PropertiesMaterialActionButton"
            role="listitem"
            disabled={!canRunMaterialAction}
            data-material-action="Duplicate Material"
            onClick={handleDuplicateMaterial}
          >
            <strong>Duplicate Material</strong>
            <span>Copy</span>
          </button>
        </div>
        <label className="PropertiesProjectMaterialSearch">
          <input
            aria-label="Search project materials"
            type="search"
            value={projectMaterialSearch}
            placeholder="Search"
            onInput={(event) => setProjectMaterialSearch(event.currentTarget.value)}
          />
        </label>
        {materials.presets.length > 0 ? (
          <>
            <div
              className="PropertiesProjectMaterialList"
              role="list"
              aria-label="Project material presets"
              data-project-material-list="compact"
              style={projectMaterialListHeightStyle}
            >
              {visibleProjectMaterialPresets.map((preset) => {
                const isSelected = selectedProjectMaterialPresetIds.has(preset.id)
                const materialSummary = `${formatScalarPercent(
                  preset.metalness,
                )} metal / ${formatScalarPercent(preset.roughness)} rough`
                return (
                  <button
                    type="button"
                    className={`PropertiesProjectMaterialButton ${isSelected ? 'isActive' : ''}`}
                    role="listitem"
                    key={preset.id}
                    aria-pressed={isSelected}
                    disabled={!canAssignProjectMaterial}
                    title={preset.name}
                    data-project-material-row={preset.id}
                    data-project-material-selected={isSelected}
                    onClick={() => handleAssignMaterial(preset.id)}
                  >
                    <span
                      className="PropertiesProjectMaterialSwatch"
                      style={{ '--properties-project-material-swatch': preset.color } as CSSProperties}
                      aria-hidden="true"
                    />
                    <span className="PropertiesProjectMaterialButtonCopy">
                      <strong>{preset.name}</strong>
                      <span>{materialSummary}</span>
                    </span>
                  </button>
                )
              })}
              {visibleProjectMaterialPresets.length === 0 ? (
                <div className="PropertiesProjectMaterialEmptySearch" role="listitem">
                  No matching materials
                </div>
              ) : null}
            </div>
            <div
              className="PropertiesProjectMaterialListResizeHandle"
              role="separator"
              aria-label="Resize project material list"
              aria-orientation="horizontal"
              aria-valuemin={PROJECT_MATERIAL_LIST_MIN_HEIGHT}
              aria-valuemax={PROJECT_MATERIAL_LIST_MAX_HEIGHT}
              aria-valuenow={projectMaterialListHeight}
              tabIndex={0}
              data-project-material-list-resize-handle="bottom"
              onMouseDown={handleProjectMaterialListResizeStart}
              onKeyDown={handleProjectMaterialListResizeKeyDown}
            />
          </>
        ) : (
          <div className="SettingsSurfaceRowList" role="list" aria-label="Project material pending state">
            <article className="SettingsSurfaceRowCard" role="listitem">
              <div className="SettingsSurfaceRowCopy">
                <strong>No project materials</strong>
                <p>Create a material before assigning one to this target.</p>
              </div>
              <div className="SettingsSurfaceRowValue" aria-label="Project material status">
                Empty
              </div>
            </article>
          </div>
        )}
      </section>
      <section className="SettingsSurfaceGroup" aria-label="Selected material properties">
        <header className="SettingsSurfaceGroupHeader">
          <span className="SettingsSurfaceGroupEyebrow">Selected Material</span>
          <strong>
            {selectedMaterialPreset === null
              ? 'Material read pending'
              : selectedMaterialRead.source === 'mixed'
                ? 'Multiple values'
                : selectedMaterialFields.name.status === 'value'
                  ? selectedMaterialFields.name.value
                  : selectedMaterialPreset.name}
          </strong>
          <p>
            These controls edit current material truth: per-part assignment first, selected preset
            second, and first preset fallback last.
          </p>
        </header>
        {selectedMaterialPreset === null ? (
          <div
            className="SettingsSurfaceRowList"
            role="list"
            aria-label="Selected material property rows"
            data-selected-material-read-source={selectedMaterialRead.source}
            data-selected-material-read-status={selectedMaterialRead.status}
          >
            {materialPropertyRows.map((row) => (
              <article className="SettingsSurfaceRowCard" role="listitem" key={row.label}>
                <div className="SettingsSurfaceRowCopy">
                  <strong>{row.label}</strong>
                  <p>{row.description}</p>
                </div>
                <div className="SettingsSurfaceRowValue" aria-label={row.label}>
                  {row.value}
                </div>
              </article>
            ))}
          </div>
        ) : (
          <div
            className="PropertiesSelectedMaterialEditor"
            role="list"
            aria-label="Selected material property controls"
            data-selected-material-editor="compact"
            data-selected-material-read-source={selectedMaterialRead.source}
            data-selected-material-read-status={selectedMaterialRead.status}
            data-selected-material-source-badge={selectedMaterialRead.source}
          >
            <div className="PropertiesSelectedMaterialHeader" role="listitem">
              <span
                className="PropertiesSelectedMaterialSourceBadge"
                aria-label="Material source"
                data-selected-material-source-badge={selectedMaterialRead.source}
              >
                {selectedMaterialRead.sourceLabel}
              </span>
              {isMultiTargetMaterialRead ? (
                <label className="PropertiesSelectedMaterialMultiEditToggle">
                  <input
                    aria-label="Create new material on multi edit"
                    type="checkbox"
                    checked={createMaterialOnMultiEdit}
                    onChange={(event) => setCreateMaterialOnMultiEdit(event.currentTarget.checked)}
                  />
                  <span>Create new material on multi edit</span>
                </label>
              ) : null}
            </div>
            {selectedMaterialFields.name.status === 'mixed' ? (
              <MixedSelectedMaterialField controlId="name" label="Name" />
            ) : (
              <label
                className="PropertiesSelectedMaterialField PropertiesSelectedMaterialField--name"
                role="listitem"
                data-selected-material-control="name"
                data-selected-material-field-state={selectedMaterialFields.name.status}
              >
                <span>Name</span>
                <input
                  aria-label="Edit material name"
                  type="text"
                  value={selectedMaterialFields.name.value ?? selectedMaterialPreset.name}
                  onInput={(event) => updateResolvedPreset({ name: event.currentTarget.value })}
                />
              </label>
            )}
            <MaterialColorControl
              id="color"
              label="Base color"
              value={selectedMaterialFields.color.value ?? selectedMaterialPreset.color}
              isExpanded={isBaseColorExpanded}
              onExpandedChange={setIsBaseColorExpanded}
              onChange={(color) => updateResolvedPreset({ color })}
              nativeInputLabel="Edit base color"
              expandButtonLabel="Expand base color controls"
              expandedControlsLabel="Expanded base color controls"
              fieldState={selectedMaterialFields.color.status}
            />
            <MaterialColorControl
              id="emissive"
              label="Emissive color"
              value={selectedMaterialFields.emissive.value ?? selectedMaterialPreset.emissive}
              isExpanded={isEmissiveColorExpanded}
              onExpandedChange={setIsEmissiveColorExpanded}
              onChange={(emissive) => updateResolvedPreset({ emissive })}
              nativeInputLabel="Edit emissive color"
              expandButtonLabel="Expand emissive color controls"
              expandedControlsLabel="Expanded emissive color controls"
              fieldState={selectedMaterialFields.emissive.status}
            />
            <div
              className="PropertiesSelectedMaterialControl"
              role="listitem"
              data-selected-material-control="metalness"
              data-selected-material-field-state={selectedMaterialFields.metalness.status}
            >
              <ParaSlider
                label="Metalness"
                value={selectedMaterialFields.metalness.value ?? selectedMaterialPreset.metalness}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => updateResolvedScalarPreset('metalness', value)}
                formatValue={formatScalarPercent}
                displayValue={
                  selectedMaterialFields.metalness.status === 'mixed'
                    ? 'Multiple values'
                    : undefined
                }
              />
            </div>
            <div
              className="PropertiesSelectedMaterialControl"
              role="listitem"
              data-selected-material-control="roughness"
              data-selected-material-field-state={selectedMaterialFields.roughness.status}
            >
              <ParaSlider
                label="Roughness"
                value={selectedMaterialFields.roughness.value ?? selectedMaterialPreset.roughness}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => updateResolvedScalarPreset('roughness', value)}
                formatValue={formatScalarPercent}
                displayValue={
                  selectedMaterialFields.roughness.status === 'mixed'
                    ? 'Multiple values'
                    : undefined
                }
              />
            </div>
            <div
              className="PropertiesSelectedMaterialControl"
              role="listitem"
              data-selected-material-control="opacity"
              data-selected-material-field-state={selectedMaterialFields.opacity.status}
            >
              <ParaSlider
                label="Opacity"
                value={selectedMaterialFields.opacity.value ?? selectedMaterialPreset.opacity}
                min={0}
                max={1}
                step={0.01}
                onChange={(value) => updateResolvedScalarPreset('opacity', value)}
                formatValue={formatScalarPercent}
                displayValue={
                  selectedMaterialFields.opacity.status === 'mixed' ? 'Multiple values' : undefined
                }
              />
            </div>
            <div
              className="PropertiesSelectedMaterialControl"
              role="listitem"
              data-selected-material-control="emissiveIntensity"
              data-selected-material-field-state={selectedMaterialFields.emissiveIntensity.status}
            >
              <ParaSlider
                label="Emissive"
                value={
                  selectedMaterialFields.emissiveIntensity.value ??
                  selectedMaterialPreset.emissiveIntensity
                }
                min={0}
                max={2}
                step={0.01}
                onChange={(value) => updateResolvedScalarPreset('emissiveIntensity', value)}
                formatValue={formatScalarPercent}
                displayValue={
                  selectedMaterialFields.emissiveIntensity.status === 'mixed'
                    ? 'Multiple values'
                    : undefined
                }
              />
            </div>
            {selectedMaterialFields.transparent.status === 'mixed' ? (
              <MixedSelectedMaterialField controlId="transparent" label="Transparency" />
            ) : (
              <div
                className="PropertiesSelectedMaterialControl"
                role="listitem"
                data-selected-material-control="transparent"
                data-selected-material-field-state={selectedMaterialFields.transparent.status}
              >
                <ParaSelect
                  label="Transparency"
                  value={
                    (selectedMaterialFields.transparent.value ?? selectedMaterialPreset.transparent)
                      ? 'transparent'
                      : 'opaque'
                  }
                  options={TRANSPARENCY_OPTIONS}
                  onChange={(value) => updateResolvedPreset({ transparent: value === 'transparent' })}
                />
              </div>
            )}
            {selectedMaterialFields.doubleSided.status === 'mixed' ? (
              <MixedSelectedMaterialField controlId="doubleSided" label="Rendering" />
            ) : (
              <div
                className="PropertiesSelectedMaterialControl"
                role="listitem"
                data-selected-material-control="doubleSided"
                data-selected-material-field-state={selectedMaterialFields.doubleSided.status}
              >
                <ParaSelect
                  label="Rendering"
                  value={
                    (selectedMaterialFields.doubleSided.value ?? selectedMaterialPreset.doubleSided)
                      ? 'double'
                      : 'front'
                  }
                  options={DOUBLE_SIDED_OPTIONS}
                  onChange={(value) => updateResolvedPreset({ doubleSided: value === 'double' })}
                />
              </div>
            )}
          </div>
        )}
        <div
          className="PropertiesMaterialActionRail"
          role="list"
          aria-label="Grouped material actions"
        >
          {assignmentGroups.map((group) => (
            <button
              type="button"
              className="PropertiesMaterialActionButton"
              role="listitem"
              disabled={!canRunAssignmentGroup(group)}
              data-material-group-action={group.id}
              key={group.id}
              onClick={() => handleAssignMaterialGroup(group)}
            >
              <strong>{group.label}</strong>
              <span aria-label={`${group.label} target count`}>
                {group.partKeys.length} target{group.partKeys.length === 1 ? '' : 's'}
              </span>
            </button>
          ))}
        </div>
      </section>
    </section>
  )
}
