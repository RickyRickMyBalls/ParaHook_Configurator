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

export const isNodeTarget = (target: EventTarget | null): target is Node =>
  target !== null &&
  typeof target === 'object' &&
  'nodeType' in target &&
  typeof (target as { nodeType?: unknown }).nodeType === 'number'

export const isElementTarget = (target: EventTarget | null): target is Element =>
  isNodeTarget(target) && target.nodeType === Node.ELEMENT_NODE

export const isInteractiveTarget = (target: EventTarget | null): boolean => {
  if (!isElementTarget(target)) {
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
