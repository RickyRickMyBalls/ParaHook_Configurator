export type ProjectFileVersion = 1

export type ProjectContentBuildState = 'rebuild' | 'building' | 'done'

export type ProjectGraphDocumentEntry = {
  graphDocumentId: string
  label: string
  sourceFilePath: string | null
  orderIndex: number
}

export type ProjectFile = {
  projectFileId: string
  name: string
  version: ProjectFileVersion
  graphDocuments: ProjectGraphDocumentEntry[]
  rootAssemblyId: string | null
}

export type ProjectAssemblyRecord = {
  assemblyId: string
  label: string
  parentAssemblyId?: string | null
  assemblySourceKind?: 'runtime-root' | 'authored'
  childRowIds: string[]
}

export type ProjectComponentRecord = {
  componentId: string
  parentAssemblyId?: string | null
  parentComponentId?: string | null
  ownerGraphDocumentId: string | null
  sourceGraphDocumentId: string | null
  sourceOutputEntryId: string | null
  sourceNodeId: string | null
  label: string
  componentSourceKind: 'published-component' | 'receive-link' | 'authored'
  resolutionState: 'resolved' | 'unresolved'
  receiveId: string | null
  childRowIds?: string[]
  childObjectIds: string[]
}

export type ProjectObjectRecord = {
  objectId: string
  ownerGraphDocumentId: string
  parentAssemblyId?: string | null
  parentComponentId: string | null
  objectSourceKind: 'published-object' | 'receive-link'
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  sourceNodeId: string | null
  slotId: string | null
  label: string
  resolutionState: 'resolved' | 'unresolved' | 'empty'
}

export type ProjectContentState = {
  assembliesById: Record<string, ProjectAssemblyRecord>
  componentsById: Record<string, ProjectComponentRecord>
  objectsById: Record<string, ProjectObjectRecord>
}

export type RuntimeContentPlacementRecord = {
  parentAssemblyId: string | null
  parentComponentId: string | null
}
