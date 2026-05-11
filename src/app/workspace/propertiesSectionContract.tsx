import type { ReactNode } from 'react'
import type { WorkspaceSelectedTarget } from '../store/useAppStore'

export type WorkspaceObjectSelectedTarget = Extract<WorkspaceSelectedTarget, { kind: 'object' }>

export type PropertiesFocusSummary =
  | {
      state: 'empty'
      title: string
      detail: string
    }
  | {
      state: 'selected'
      title: string
      detail: string
      targetKind: WorkspaceSelectedTarget['kind']
    }

export type PropertiesSectionId = 'materials'

export type PropertiesSectionContext = {
  selectedTarget: WorkspaceSelectedTarget
  selectedObjectTargets: WorkspaceObjectSelectedTarget[]
  focusSummary: Extract<PropertiesFocusSummary, { state: 'selected' }>
}

export type PropertiesSectionDefinition = {
  id: PropertiesSectionId
  label: string
  summary: string
  supports: (selectedTarget: WorkspaceSelectedTarget) => boolean
  renderContent: (context: PropertiesSectionContext) => ReactNode
}

export type PropertiesShellState =
  | {
      kind: 'ready'
      availableSections: PropertiesSectionDefinition[]
      activeSection: PropertiesSectionDefinition
      sectionContext: PropertiesSectionContext
    }
  | {
      kind: 'empty'
      registeredSections: PropertiesSectionDefinition[]
      focusSummary: Extract<PropertiesFocusSummary, { state: 'empty' }>
    }
  | {
      kind: 'unsupported'
      registeredSections: PropertiesSectionDefinition[]
      focusSummary: Extract<PropertiesFocusSummary, { state: 'selected' }>
    }
  | {
      kind: 'no-sections'
      registeredSections: readonly []
      focusSummary: PropertiesFocusSummary
    }

const formatTargetKindLabel = (targetKind: WorkspaceSelectedTarget['kind']): string => {
  switch (targetKind) {
    case 'graph-document':
      return 'Graph document'
    case 'graph-node':
      return 'Graph node'
    case 'references-root':
      return 'References root'
    case 'reference-category':
      return 'Reference category'
    case 'reference-item':
      return 'Reference item'
    case 'assembly':
      return 'Assembly'
    case 'component':
      return 'Component'
    case 'object':
      return 'Object'
    case 'environment-light':
      return 'Environment light'
    case 'part':
      return 'Part'
  }
}

const formatTargetIdentifier = (target: WorkspaceSelectedTarget): string => {
  switch (target.kind) {
    case 'graph-document':
      return target.graphDocumentId
    case 'graph-node':
      return `${target.graphDocumentId} / ${target.nodeId}`
    case 'references-root':
      return 'Project references'
    case 'reference-category':
      return target.categoryId
    case 'reference-item':
      return target.referenceId
    case 'assembly':
      return target.assemblyId
    case 'component':
      return target.componentId
    case 'object':
      return target.objectId
    case 'environment-light':
      return target.lightId
    case 'part':
      return target.partKey
  }
}

export const buildPropertiesFocusSummary = (
  selectedTarget: WorkspaceSelectedTarget | null,
): PropertiesFocusSummary => {
  if (selectedTarget === null) {
    return buildEmptyPropertiesFocusSummary()
  }

  return {
    state: 'selected',
    title: formatTargetKindLabel(selectedTarget.kind),
    detail: formatTargetIdentifier(selectedTarget),
    targetKind: selectedTarget.kind,
  }
}

const buildEmptyPropertiesFocusSummary = (): Extract<PropertiesFocusSummary, { state: 'empty' }> => ({
  state: 'empty',
  title: 'No focused item',
  detail:
    'Select an object, component, assembly, reference, or graph target to feed the shared Properties shell.',
})

export const resolvePropertiesShellState = (
  registeredSections: readonly PropertiesSectionDefinition[],
  focusSummary: PropertiesFocusSummary,
  selectedTarget: WorkspaceSelectedTarget | null,
  activeSectionId: PropertiesSectionId | null,
  selectedObjectTargets?: readonly WorkspaceObjectSelectedTarget[],
): PropertiesShellState => {
  if (registeredSections.length === 0) {
    return {
      kind: 'no-sections',
      registeredSections: [],
      focusSummary,
    }
  }

  if (selectedTarget === null) {
    return {
      kind: 'empty',
      registeredSections: [...registeredSections],
      focusSummary: buildEmptyPropertiesFocusSummary(),
    }
  }

  if (focusSummary.state === 'empty') {
    return {
      kind: 'empty',
      registeredSections: [...registeredSections],
      focusSummary,
    }
  }

  const availableSections = registeredSections.filter((section) => section.supports(selectedTarget))
  if (availableSections.length === 0) {
    return {
      kind: 'unsupported',
      registeredSections: [...registeredSections],
      focusSummary,
    }
  }

  const activeSection =
    availableSections.find((section) => section.id === activeSectionId) ?? availableSections[0]

  return {
    kind: 'ready',
    availableSections,
    activeSection,
    sectionContext: {
      selectedTarget,
      selectedObjectTargets:
        selectedObjectTargets !== undefined
          ? [...selectedObjectTargets]
          : selectedTarget.kind === 'object'
            ? [selectedTarget]
            : [],
      focusSummary,
    },
  }
}
