import { useMemo } from 'react'
import { ParaSlider } from '../components/ParaSlider'

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
    r: Math.round((red + match) * 255),
    g: Math.round((green + match) * 255),
    b: Math.round((blue + match) * 255),
  }
}

export type PropertiesColorControlProps = {
  id: string
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

export function PropertiesColorControl({
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
}: PropertiesColorControlProps) {
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
