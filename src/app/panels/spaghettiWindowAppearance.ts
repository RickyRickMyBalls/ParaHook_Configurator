export type SpaghettiWindowTitlebarTint = 'default' | 'slate' | 'blue' | 'green' | 'red'
export type SpaghettiWindowBodyTint = 'default' | 'cool-dark' | 'neutral-dark' | 'glass-dark'
export type SpaghettiWindowFontScale = 'sm' | 'md' | 'lg'
export type SpaghettiWindowFontFamily = 'default' | 'mono' | 'serif'
export type SpaghettiWindowPaddingScale = 'tight' | 'normal' | 'loose'
export type SpaghettiWindowSliderClamp = {
  min: number
  max: number
}

export const spaghettiWindowSliderBounds = {
  min: 0,
  max: 1,
  step: 0.05,
} as const

export const defaultSpaghettiWindowSliderClamp: SpaghettiWindowSliderClamp = {
  min: 0.65,
  max: 1,
}

const legacyDefaultSpaghettiWindowOpacityClampMin = 0.65

export const defaultSpaghettiWindowOpacitySliderClamp: SpaghettiWindowSliderClamp = {
  min: 0,
  max: 1,
}

export type SpaghettiWindowAppearance = {
  titlebarOpacity: number
  windowOpacity: number
  graphContentOpacity: number
  bodyInsetX: number
  bodyInsetY: number
  titlebarClamp: SpaghettiWindowSliderClamp
  windowClamp: SpaghettiWindowSliderClamp
  graphContentClamp: SpaghettiWindowSliderClamp
  bodyInsetXClamp: SpaghettiWindowSliderClamp
  bodyInsetYClamp: SpaghettiWindowSliderClamp
  titlebarTint: SpaghettiWindowTitlebarTint
  bodyTint: SpaghettiWindowBodyTint
  fontScale: SpaghettiWindowFontScale
  fontFamily: SpaghettiWindowFontFamily
  paddingScale: SpaghettiWindowPaddingScale
}

export const defaultSpaghettiWindowAppearance: SpaghettiWindowAppearance = {
  titlebarOpacity: 0.92,
  windowOpacity: 0.92,
  graphContentOpacity: 1,
  bodyInsetX: 0,
  bodyInsetY: 0,
  titlebarClamp: defaultSpaghettiWindowSliderClamp,
  windowClamp: defaultSpaghettiWindowOpacitySliderClamp,
  graphContentClamp: defaultSpaghettiWindowSliderClamp,
  bodyInsetXClamp: {
    min: 0,
    max: 1,
  },
  bodyInsetYClamp: {
    min: 0,
    max: 1,
  },
  titlebarTint: 'default',
  bodyTint: 'default',
  fontScale: 'md',
  fontFamily: 'default',
  paddingScale: 'normal',
}

const quantize = (value: number): number => {
  const { min, step } = spaghettiWindowSliderBounds
  const steps = Math.round((value - min) / step)
  return Number((min + steps * step).toFixed(4))
}

const clampNumber = (value: number, min: number, max: number): number =>
  Math.min(max, Math.max(min, value))

const normalizeSliderValue = (value: number): number =>
  clampNumber(quantize(value), spaghettiWindowSliderBounds.min, spaghettiWindowSliderBounds.max)

const normalizeSliderClamp = (range: SpaghettiWindowSliderClamp): SpaghettiWindowSliderClamp => {
  const nextMin = normalizeSliderValue(range.min)
  const nextMax = normalizeSliderValue(range.max)
  return nextMin <= nextMax
    ? { min: nextMin, max: nextMax }
    : { min: nextMax, max: nextMax }
}

export const normalizeSpaghettiWindowAppearance = (
  appearance: SpaghettiWindowAppearance,
): SpaghettiWindowAppearance => {
  const titlebarClamp = normalizeSliderClamp(appearance.titlebarClamp)
  const normalizedWindowClamp = normalizeSliderClamp(appearance.windowClamp)
  const windowClamp =
    normalizedWindowClamp.min === legacyDefaultSpaghettiWindowOpacityClampMin &&
    normalizedWindowClamp.max === defaultSpaghettiWindowOpacitySliderClamp.max
      ? defaultSpaghettiWindowOpacitySliderClamp
      : normalizedWindowClamp
  const graphContentClamp = normalizeSliderClamp(appearance.graphContentClamp)
  const bodyInsetXClamp = normalizeSliderClamp(appearance.bodyInsetXClamp)
  const bodyInsetYClamp = normalizeSliderClamp(appearance.bodyInsetYClamp)
  return {
    ...appearance,
    titlebarClamp,
    windowClamp,
    graphContentClamp,
    bodyInsetXClamp,
    bodyInsetYClamp,
    titlebarOpacity: clampNumber(normalizeSliderValue(appearance.titlebarOpacity), titlebarClamp.min, titlebarClamp.max),
    windowOpacity: clampNumber(normalizeSliderValue(appearance.windowOpacity), windowClamp.min, windowClamp.max),
    graphContentOpacity: clampNumber(
      normalizeSliderValue(appearance.graphContentOpacity),
      graphContentClamp.min,
      graphContentClamp.max,
    ),
    bodyInsetX: clampNumber(
      normalizeSliderValue(appearance.bodyInsetX),
      bodyInsetXClamp.min,
      bodyInsetXClamp.max,
    ),
    bodyInsetY: clampNumber(
      normalizeSliderValue(appearance.bodyInsetY),
      bodyInsetYClamp.min,
      bodyInsetYClamp.max,
    ),
  }
}

export const mergeSpaghettiWindowAppearance = (
  current: SpaghettiWindowAppearance,
  patch: Partial<SpaghettiWindowAppearance>,
): SpaghettiWindowAppearance =>
  normalizeSpaghettiWindowAppearance({
    ...current,
    ...patch,
    titlebarClamp: patch.titlebarClamp ?? current.titlebarClamp,
    windowClamp: patch.windowClamp ?? current.windowClamp,
    graphContentClamp: patch.graphContentClamp ?? current.graphContentClamp,
    bodyInsetXClamp: patch.bodyInsetXClamp ?? current.bodyInsetXClamp,
    bodyInsetYClamp: patch.bodyInsetYClamp ?? current.bodyInsetYClamp,
  })

export const areSpaghettiWindowAppearanceEqual = (
  left: SpaghettiWindowAppearance,
  right: SpaghettiWindowAppearance,
): boolean =>
  left.titlebarOpacity === right.titlebarOpacity &&
  left.windowOpacity === right.windowOpacity &&
  left.graphContentOpacity === right.graphContentOpacity &&
  left.bodyInsetX === right.bodyInsetX &&
  left.bodyInsetY === right.bodyInsetY &&
  left.titlebarClamp.min === right.titlebarClamp.min &&
  left.titlebarClamp.max === right.titlebarClamp.max &&
  left.windowClamp.min === right.windowClamp.min &&
  left.windowClamp.max === right.windowClamp.max &&
  left.graphContentClamp.min === right.graphContentClamp.min &&
  left.graphContentClamp.max === right.graphContentClamp.max &&
  left.bodyInsetXClamp.min === right.bodyInsetXClamp.min &&
  left.bodyInsetXClamp.max === right.bodyInsetXClamp.max &&
  left.bodyInsetYClamp.min === right.bodyInsetYClamp.min &&
  left.bodyInsetYClamp.max === right.bodyInsetYClamp.max &&
  left.titlebarTint === right.titlebarTint &&
  left.bodyTint === right.bodyTint &&
  left.fontScale === right.fontScale &&
  left.fontFamily === right.fontFamily &&
  left.paddingScale === right.paddingScale
