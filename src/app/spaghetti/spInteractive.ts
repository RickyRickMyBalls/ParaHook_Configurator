import type { PointerEvent as ReactPointerEvent } from 'react'

const INTERACTIVE_TARGET_SELECTOR = [
  '[data-sp-interactive="1"]',
  'button',
  'a',
  'input',
  'select',
  'textarea',
  'label',
  '[role="button"]',
  '[contenteditable="true"]',
].join(',')

export const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!(target instanceof Element)) {
    return false
  }
  return target.closest(INTERACTIVE_TARGET_SELECTOR) !== null
}

export const stopInteractivePointerDown = (
  event: ReactPointerEvent<Element>,
): void => {
  event.stopPropagation()
}

export const SP_INTERACTIVE_PROPS = {
  'data-sp-interactive': '1',
  onPointerDown: stopInteractivePointerDown,
} as const
