import type { ViewMode } from './rowViewMode'

export type StructuredWireRowMode = ViewMode
export type NodeTemplateBlockId = 'inputs' | 'content' | 'outputs'
export type StructuredWireRowFamily =
  | 'reference'
  | 'numeric'
  | 'artifact'
  | 'composite'
  | 'collection'

export type StructuredWireReferenceRowContract = {
  family: 'reference'
  rowOwnsSingleStructuredTarget: true
  allowsUserFacingLabelOverride: true
  supportsAttachedBody: true
}

export type StructuredWireNumericRowContract = {
  family: 'numeric'
  unitAware: true
  collapsedSummary: 'resolvedValue'
  essentialsEditor: 'inlineNumberField'
  expandedBody: 'explanationOrDiagnostics'
  keepsLocalFallbackWhenDriven: true
}

export const NODE_TEMPLATE_SHELL_AREAS = [
  'title',
  'familyBadge',
  'summaryChips',
  'sectionHeaders',
  'nodeModeButton',
  'toolbarRegion',
] as const

export const STRUCTURED_WIRE_ROW_FAMILIES: readonly StructuredWireRowFamily[] = [
  'reference',
  'numeric',
  'artifact',
  'composite',
  'collection',
] as const

export const STRUCTURED_WIRE_REFERENCE_ROW_CONTRACT: StructuredWireReferenceRowContract = {
  family: 'reference',
  rowOwnsSingleStructuredTarget: true,
  allowsUserFacingLabelOverride: true,
  supportsAttachedBody: true,
}

export const STRUCTURED_WIRE_NUMERIC_ROW_CONTRACT: StructuredWireNumericRowContract = {
  family: 'numeric',
  unitAware: true,
  collapsedSummary: 'resolvedValue',
  essentialsEditor: 'inlineNumberField',
  expandedBody: 'explanationOrDiagnostics',
  keepsLocalFallbackWhenDriven: true,
}

export const buildUnitAwareNumericRowLabel = (
  valueLabel: string,
  unitLabel: string,
): string => `${valueLabel} ${unitLabel}`.trim()

export const buildUnitAwareNumericRowDrivenMessage = (
  localFallbackValueLabel: string,
  unitLabel: string,
): string =>
  `Wire drives the effective value. Local fallback stays at ${buildUnitAwareNumericRowLabel(
    localFallbackValueLabel,
    unitLabel,
  )}.`

export const isWiringSurfaceSection = (sectionId: string): boolean =>
  sectionId === 'inputs' || sectionId === 'outputs'

export const getDefaultNodeTemplateSectionOpen = (
  mode: ViewMode,
  sectionId: string,
): boolean => {
  if (isWiringSurfaceSection(sectionId)) {
    return true
  }
  return mode !== 'collapsed'
}

export const getDefaultStructuredWireBlockOpen = (
  mode: ViewMode,
  blockId: NodeTemplateBlockId,
): boolean => {
  if (blockId === 'content') {
    return true
  }
  if (mode === 'expanded') {
    return true
  }
  if (mode === 'essentials') {
    return blockId === 'inputs'
  }
  return isWiringSurfaceSection(blockId)
}

export const getDefaultStructuredWireRowMode = (
  mode: ViewMode,
  opensInEssentials: boolean,
): StructuredWireRowMode => {
  if (mode === 'expanded') {
    return 'expanded'
  }
  if (mode === 'essentials') {
    return opensInEssentials ? 'essentials' : 'collapsed'
  }
  return 'collapsed'
}
