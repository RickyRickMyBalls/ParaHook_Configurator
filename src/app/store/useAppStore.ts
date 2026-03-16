import { create } from 'zustand'
import { buildDispatcher } from '../buildDispatcher'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import {
  selectActiveGraphDocument,
  selectGraphByDocumentId,
  selectOrderedGraphDocuments,
  selectResolvedGraphReceiveReferencesByDocumentId,
  selectGraphRuntimeByDocumentId,
  type GraphRuntimeState,
  type SpaghettiStoreState,
  useSpaghettiStore,
} from '../spaghetti/store/useSpaghettiStore'
import type { GraphDocument, SpaghettiGraph } from '../spaghetti/schema/spaghettiTypes'
import {
  compileSpaghettiGraph,
  type CompileSpaghettiGraphResult,
} from '../spaghetti/compiler/compileGraph'
import { buildRequestFromBuildInputs } from '../spaghetti/integration/buildInputsToRequest'
import { buildGraphPublishedComponentSurface } from '../spaghetti/outputSurface'
import type {
  AssembleResult,
  BoxParams,
  BuildResult,
  PartArtifact,
  ViewMode,
} from '../../shared/buildTypes'
import {
  LEGACY_RUNTIME_GRAPH_DOCUMENT_ID,
  LEGACY_RUNTIME_PROJECT_FILE_ID,
} from '../../shared/buildTypes'
import { newId } from '../spaghetti/utils/id'

type BoxParamKey = keyof BoxParams
type PartsVisibility = Record<string, boolean>
type AssembledMesh = AssembleResult['assembled']
type BuildPolicy = 'live' | 'release' | 'manual'
type InputMode = 'legacy' | 'spaghetti'
type ProjectFileVersion = 1

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
  childComponentIds: string[]
}

export type ProjectComponentRecord = {
  componentId: string
  ownerGraphDocumentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string | null
  sourceNodeId: string | null
  label: string
  componentSourceKind: 'published-component' | 'receive-link'
  resolutionState: 'resolved' | 'unresolved'
  receiveId: string | null
  childObjectIds: string[]
}

export type ProjectObjectRecord = {
  objectId: string
  parentComponentId: string
  sourceGraphDocumentId: string
  sourceOutputEntryId: string
  sourceNodeId: string | null
  slotId: string
  label: string
  resolutionState: 'resolved' | 'unresolved' | 'empty'
}

export type ProjectContentState = {
  assembliesById: Record<string, ProjectAssemblyRecord>
  componentsById: Record<string, ProjectComponentRecord>
  objectsById: Record<string, ProjectObjectRecord>
}

export type ProjectContentBrowserRowVm =
  | {
      rowId: string
      kind: 'assembly'
      label: string
      meta: string
    }
  | {
      rowId: string
      kind: 'component'
      label: string
      meta: string
      ownerGraphDocumentId: string
      sourceGraphDocumentId: string
      sourceOutputEntryId: string | null
      componentSourceKind: ProjectComponentRecord['componentSourceKind']
      resolutionState: ProjectComponentRecord['resolutionState']
      receiveId: string | null
      childObjectCount: number
      slotId: string | null
      sourceNodeId: string | null
      highlightViewerKey: string | null
      authoringGraphDocumentId: string | null
      authoringNodeId: string | null
    }
  | {
      rowId: string
      kind: 'object'
      label: string
      meta: string
      parentComponentId: string
      sourceGraphDocumentId: string
      sourceOutputEntryId: string
      slotId: string
      sourceNodeId: string | null
      resolutionState: ProjectObjectRecord['resolutionState']
      highlightViewerKey: string | null
      authoringGraphDocumentId: string
      authoringNodeId: string | null
    }

export type AppState = {
  box: BoxParams
  lastBuildSeq: number
  parts: PartArtifact[]
  heelKickInstances: number[]
  toeHookInstances: number[]
  geomDirty: Record<string, number>
  geomBuilt: Record<string, number>
  partsVisibility: PartsVisibility
  selectedPartKey: string | null
  buildPolicy: BuildPolicy
  isInteracting: boolean
  pendingBuildAfterRelease: boolean
  inputMode: InputMode
  viewMode: ViewMode
  assembled: AssembledMesh | null
  assembledSignature: string | null
  currentProject: ProjectFile
  projectContent: ProjectContentState
  workerError: string | null
  setBoxParam: (key: BoxParamKey, value: number) => void
  setInputMode: (mode: InputMode) => void
  setSpaghettiGraph: (graph: SpaghettiGraph) => void
  compileGraphDocument: (graphDocumentId: string) => CompileSpaghettiGraphResult
  requestGraphDocumentBuild: (graphDocumentId: string) => CompileSpaghettiGraphResult
  compileSpaghetti: () => CompileSpaghettiGraphResult
  requestSpaghettiBuild: () => CompileSpaghettiGraphResult
  setBuildPolicy: (policy: BuildPolicy) => void
  beginInteraction: () => void
  endInteraction: () => void
  requestManualBuild: () => void
  setViewMode: (mode: ViewMode) => void
  acceptBuildResult: (result: BuildResult) => void
  setAssembled: (result: AssembleResult) => void
  setWorkerError: (message: string | null) => void
  ensureVisibilityForPartKeys: (keys: string[], defaultValue?: boolean) => void
  togglePartVisibility: (partKeyStr: string) => void
  setPartVisibility: (partKeyStr: string, visible: boolean) => void
  selectPart: (partKeyStr: string | null) => void
  addHeelKickInstance: () => void
  addToeHookInstance: () => void
  removeHeelKickInstance: (instance: number) => void
  removeToeHookInstance: (instance: number) => void
}

const initialBox: BoxParams = {
  width: 1,
  length: 2,
  height: 1,
}

const defaultVisibility: PartsVisibility = {
  baseplate: true,
  'heelKick#1': true,
  'toeHook#1': true,
  assembled: true,
}

const PROJECT_FILE_VERSION: ProjectFileVersion = 1
const INITIAL_PROJECT_FILE_ID = 'project-file-1'
const ROOT_ASSEMBLY_LABEL = 'Assembly Root'

const buildRootAssemblyId = (projectFileId: string): string =>
  `assembly-root:${projectFileId}`

const buildProjectPublishedComponentId = (
  projectFileId: string,
  graphDocumentId: string,
): string => `project-component:${projectFileId}:${graphDocumentId}:published`

const buildProjectReceiveComponentId = (
  projectFileId: string,
  graphDocumentId: string,
  receiveId: string,
): string => `project-component:${projectFileId}:receive:${graphDocumentId}:${receiveId}`

const buildProjectObjectId = (
  projectFileId: string,
  graphDocumentId: string,
  objectId: string,
): string => `project-object:${projectFileId}:${graphDocumentId}:${objectId}`

const toProjectGraphDocumentEntry = (
  document: Pick<GraphDocument, 'graphDocumentId' | 'name'>,
  orderIndex: number,
): ProjectGraphDocumentEntry => ({
  graphDocumentId: document.graphDocumentId,
  label: document.name,
  sourceFilePath: null,
  orderIndex,
})

const buildProjectGraphDocuments = (
  spaghettiState: Pick<SpaghettiStoreState, 'graphDocumentsById' | 'graphDocumentOrder'>,
): ProjectGraphDocumentEntry[] =>
  selectOrderedGraphDocuments(spaghettiState).map((document, orderIndex) =>
    toProjectGraphDocumentEntry(document, orderIndex),
  )

const createInitialProjectFile = (): ProjectFile => ({
  projectFileId: INITIAL_PROJECT_FILE_ID,
  name: 'Project 1',
  version: PROJECT_FILE_VERSION,
  graphDocuments: buildProjectGraphDocuments(useSpaghettiStore.getState()),
  rootAssemblyId: buildRootAssemblyId(INITIAL_PROJECT_FILE_ID),
})

const buildProjectContentState = (
  project: ProjectFile,
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
): ProjectContentState => {
  const rootAssemblyId = project.rootAssemblyId ?? buildRootAssemblyId(project.projectFileId)
  const childComponentIds: string[] = []
  const componentsById: Record<string, ProjectComponentRecord> = {}
  const objectsById: Record<string, ProjectObjectRecord> = {}

  for (const documentEntry of project.graphDocuments) {
    const graphDocument = spaghettiState.graphDocumentsById[documentEntry.graphDocumentId]
    const outputSurface = selectGraphRuntimeByDocumentId(
      spaghettiState,
      documentEntry.graphDocumentId,
    )?.outputSurface
    const publishedComponentSurface =
      graphDocument === undefined
        ? null
        : buildGraphPublishedComponentSurface({
            graphDocumentId: documentEntry.graphDocumentId,
            graph: graphDocument.graph,
            outputSurface,
          })

    if (
      publishedComponentSurface !== null &&
      outputSurface !== null &&
      publishedComponentSurface.objects.length > 0
    ) {
      const componentId = buildProjectPublishedComponentId(
        project.projectFileId,
        documentEntry.graphDocumentId,
      )
      const childObjectIds = publishedComponentSurface.objects.map((objectRow) =>
        buildProjectObjectId(project.projectFileId, documentEntry.graphDocumentId, objectRow.objectId),
      )
      const resolutionState = publishedComponentSurface.objects.some(
        (objectRow) => objectRow.state === 'resolved',
      )
        ? 'resolved'
        : 'unresolved'
      childComponentIds.push(componentId)
      componentsById[componentId] = {
        componentId,
        ownerGraphDocumentId: documentEntry.graphDocumentId,
        sourceGraphDocumentId: documentEntry.graphDocumentId,
        sourceOutputEntryId:
          publishedComponentSurface.objects.length === 1
            ? publishedComponentSurface.objects[0]?.outputEntryId ?? null
            : null,
        sourceNodeId:
          publishedComponentSurface.objects.length === 1
            ? publishedComponentSurface.objects[0]?.sourceNodeId ?? null
            : null,
        label: publishedComponentSurface.componentLabel,
        componentSourceKind: 'published-component',
        resolutionState,
        receiveId: null,
        childObjectIds,
      }
      publishedComponentSurface.objects.forEach((objectRow, index) => {
        const objectId = childObjectIds[index]
        if (objectId === undefined) {
          return
        }
        objectsById[objectId] = {
          objectId,
          parentComponentId: componentId,
          sourceGraphDocumentId: documentEntry.graphDocumentId,
          sourceOutputEntryId: objectRow.outputEntryId,
          sourceNodeId: objectRow.sourceNodeId,
          slotId: objectRow.slotId,
          label: objectRow.label,
          resolutionState: objectRow.state,
        }
      })
    }

    for (const receiveReference of selectResolvedGraphReceiveReferencesByDocumentId(
      spaghettiState,
      documentEntry.graphDocumentId,
    )) {
      const componentId = buildProjectReceiveComponentId(
        project.projectFileId,
        documentEntry.graphDocumentId,
        receiveReference.receiveId,
      )
      const label = receiveReference.sourceEntry?.label ?? receiveReference.sourceOutputEntryId
      childComponentIds.push(componentId)
      componentsById[componentId] = {
        componentId,
        ownerGraphDocumentId: documentEntry.graphDocumentId,
        sourceGraphDocumentId: receiveReference.sourceGraphDocumentId,
        sourceOutputEntryId: receiveReference.sourceOutputEntryId,
        sourceNodeId: receiveReference.sourceEntry?.sourceNodeId ?? null,
        label,
        componentSourceKind: 'receive-link',
        resolutionState: receiveReference.resolutionState,
        receiveId: receiveReference.receiveId,
        childObjectIds: [],
      }
    }
  }

  return {
    assembliesById: {
      [rootAssemblyId]: {
        assemblyId: rootAssemblyId,
        label: ROOT_ASSEMBLY_LABEL,
        childComponentIds,
      },
    },
    componentsById,
    objectsById,
  }
}

const createInitialProjectContentState = (): ProjectContentState => {
  const initialProject = createInitialProjectFile()
  return buildProjectContentState(initialProject, useSpaghettiStore.getState())
}

const areProjectGraphDocumentsEqual = (
  left: ProjectGraphDocumentEntry[],
  right: ProjectGraphDocumentEntry[],
): boolean =>
  left.length === right.length &&
  left.every((entry, index) => {
    const other = right[index]
    return (
      other !== undefined &&
      entry.graphDocumentId === other.graphDocumentId &&
      entry.label === other.label &&
      entry.sourceFilePath === other.sourceFilePath &&
      entry.orderIndex === other.orderIndex
    )
  })

const areOrderedStringArraysEqual = (left: string[], right: string[]): boolean =>
  left.length === right.length && left.every((value, index) => value === right[index])

const areProjectAssemblyRecordsEqual = (
  left: ProjectAssemblyRecord,
  right: ProjectAssemblyRecord,
): boolean =>
  left.assemblyId === right.assemblyId &&
  left.label === right.label &&
  areOrderedStringArraysEqual(left.childComponentIds, right.childComponentIds)

const areProjectAssembliesEqual = (
  left: Record<string, ProjectAssemblyRecord>,
  right: Record<string, ProjectAssemblyRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((assemblyId) => {
      const other = right[assemblyId]
      return other !== undefined && areProjectAssemblyRecordsEqual(left[assemblyId], other)
    })
  )
}

const areProjectComponentsEqual = (
  left: Record<string, ProjectComponentRecord>,
  right: Record<string, ProjectComponentRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((componentId) => {
      const other = right[componentId]
      const entry = left[componentId]
      return (
        other !== undefined &&
        entry.componentId === other.componentId &&
        entry.ownerGraphDocumentId === other.ownerGraphDocumentId &&
        entry.sourceGraphDocumentId === other.sourceGraphDocumentId &&
        entry.sourceOutputEntryId === other.sourceOutputEntryId &&
        entry.sourceNodeId === other.sourceNodeId &&
        entry.label === other.label &&
        entry.componentSourceKind === other.componentSourceKind &&
        entry.resolutionState === other.resolutionState &&
        entry.receiveId === other.receiveId &&
        areOrderedStringArraysEqual(entry.childObjectIds, other.childObjectIds)
      )
    })
  )
}

const areProjectObjectsEqual = (
  left: Record<string, ProjectObjectRecord>,
  right: Record<string, ProjectObjectRecord>,
): boolean => {
  const leftKeys = Object.keys(left)
  const rightKeys = Object.keys(right)
  return (
    areOrderedStringArraysEqual(leftKeys, rightKeys) &&
    leftKeys.every((objectId) => {
      const entry = left[objectId]
      const other = right[objectId]
      return (
        other !== undefined &&
        entry.objectId === other.objectId &&
        entry.parentComponentId === other.parentComponentId &&
        entry.sourceGraphDocumentId === other.sourceGraphDocumentId &&
        entry.sourceOutputEntryId === other.sourceOutputEntryId &&
        entry.sourceNodeId === other.sourceNodeId &&
        entry.slotId === other.slotId &&
        entry.label === other.label &&
        entry.resolutionState === other.resolutionState
      )
    })
  )
}

const areProjectContentStatesEqual = (
  left: ProjectContentState,
  right: ProjectContentState,
): boolean =>
  areProjectAssembliesEqual(left.assembliesById, right.assembliesById) &&
  areProjectComponentsEqual(left.componentsById, right.componentsById) &&
  areProjectObjectsEqual(left.objectsById, right.objectsById)

export const selectChangedGeomParamIds = (state: Pick<AppState, 'geomDirty' | 'geomBuilt'>): string[] => {
  const changed: string[] = []
  for (const id of Object.keys(state.geomDirty)) {
    if ((state.geomDirty[id] ?? 0) > (state.geomBuilt[id] ?? 0)) {
      changed.push(id)
    }
  }
  return changed
}

const nextInstanceId = (instances: number[]): number =>
  Math.max(...instances, 0) + 1

export const useAppStore = create<AppState>((set, get) => ({
  box: initialBox,
  lastBuildSeq: 0,
  parts: [],
  heelKickInstances: [1],
  toeHookInstances: [1],
  geomDirty: {},
  geomBuilt: {},
  partsVisibility: defaultVisibility,
  selectedPartKey: null,
  buildPolicy: 'live',
  isInteracting: false,
  pendingBuildAfterRelease: false,
  inputMode: 'legacy',
  viewMode: 'parts',
  assembled: null,
  assembledSignature: null,
  currentProject: createInitialProjectFile(),
  projectContent: createInitialProjectContentState(),
  workerError: null,
  setBoxParam: (key, value) => {
    const state = get()
    if (state.box[key] === value) {
      return
    }
    const nextBox: BoxParams = {
      ...state.box,
      [key]: value,
    }
    set((state) => ({
      box: nextBox,
      geomDirty: {
        ...state.geomDirty,
        [key]: (state.geomDirty[key] ?? 0) + 1,
      },
    }))
    if (state.inputMode === 'spaghetti') {
      return
    }
    if (state.buildPolicy === 'live') {
      buildDispatcher.requestBuild(nextBox)
      return
    }
    if (state.buildPolicy === 'release') {
      if (state.isInteracting) {
        if (!state.pendingBuildAfterRelease) {
          set({ pendingBuildAfterRelease: true })
        }
        return
      }
      buildDispatcher.requestBuild(nextBox)
    }
  },
  setInputMode: (mode) => {
    set({
      inputMode: mode,
      pendingBuildAfterRelease: false,
    })
  },
  setSpaghettiGraph: (graph) => {
    useSpaghettiStore.getState().setGraph(graph)
  },
  compileGraphDocument: (graphDocumentId) => {
    const spaghettiState = useSpaghettiStore.getState()
    const graph = selectGraphByDocumentId(spaghettiState, graphDocumentId)
    if (graph === null) {
      throw new Error(`Graph document "${graphDocumentId}" was not found.`)
    }
    const compileResult = compileSpaghettiGraph(graph)
    spaghettiState.setGraphCompileResult(graphDocumentId, compileResult)
    return compileResult
  },
  requestGraphDocumentBuild: (graphDocumentId) => {
    const state = get()
    const spaghettiState = useSpaghettiStore.getState()
    const compileResult = get().compileGraphDocument(graphDocumentId)
    if (!compileResult.ok || compileResult.buildInputs === undefined) {
      return compileResult
    }

    const pendingBuildState =
      selectGraphRuntimeByDocumentId(spaghettiState, graphDocumentId)?.compileBuild ?? null
    const requestBuild = buildRequestFromBuildInputs(
      compileResult.buildInputs,
      pendingBuildState?.previousBuildInputs ?? undefined,
    )
    const buildRequestId = newId('build-request')

    const payloadWithPatch = {
      ...state.box,
      ...requestBuild.profilePatch,
    }
    const buildSeq = buildDispatcher.requestBuild(payloadWithPatch as BoxParams, {
      routingIdentity: {
        projectFileId: state.currentProject.projectFileId,
        graphDocumentId,
        buildRequestId,
      },
      changedParamIds: requestBuild.changedParamIds,
      buildInstances: requestBuild.instances,
      buildStatsPartKeys: requestBuild.partKeys,
    })
    spaghettiState.stageGraphBuildRequest(graphDocumentId, {
      compileResult,
      previousBuildInputs: pendingBuildState?.previousBuildInputs ?? null,
      pendingChangedParamIds: requestBuild.changedParamIds,
      pendingStatsPartKeys: requestBuild.partKeys,
      pendingInstances: requestBuild.instances,
      buildRequestId,
      buildSeq,
    })
    return compileResult
  },
  compileSpaghetti: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().compileGraphDocument(activeGraphDocument.graphDocumentId)
  },
  requestSpaghettiBuild: () => {
    const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
    return get().requestGraphDocumentBuild(activeGraphDocument.graphDocumentId)
  },
  setBuildPolicy: (policy) => {
    set((state) => ({
      buildPolicy: policy,
      pendingBuildAfterRelease:
        policy === 'release' ? state.pendingBuildAfterRelease : false,
    }))
  },
  beginInteraction: () => {
    set((state) => (state.isInteracting ? state : { isInteracting: true }))
  },
  endInteraction: () => {
    let shouldRequestBuild = false
    set((state) => {
      if (!state.isInteracting) {
        return state
      }
      shouldRequestBuild =
        state.buildPolicy === 'release' && state.pendingBuildAfterRelease
      return {
        isInteracting: false,
        pendingBuildAfterRelease: false,
      }
    })
    if (shouldRequestBuild && get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  requestManualBuild: () => {
    if (get().inputMode === 'spaghetti') {
      const activeGraphDocument = selectActiveGraphDocument(useSpaghettiStore.getState())
      get().requestGraphDocumentBuild(activeGraphDocument.graphDocumentId)
      return
    }
    set({ pendingBuildAfterRelease: false })
    buildDispatcher.requestBuild(get().box)
  },
  setViewMode: (mode) => {
    set({ viewMode: mode })
  },
  acceptBuildResult: (result) => {
    const currentProjectId = get().currentProject.projectFileId
    const isLegacyRoutingResult =
      result.projectFileId === LEGACY_RUNTIME_PROJECT_FILE_ID &&
      result.graphDocumentId === LEGACY_RUNTIME_GRAPH_DOCUMENT_ID
    if (!isLegacyRoutingResult && result.projectFileId !== currentProjectId) {
      return
    }
    const acceptedSpaghettiResult = isLegacyRoutingResult
      ? false
      : useSpaghettiStore.getState().acceptGraphBuildResult({
          projectFileId: result.projectFileId,
          graphDocumentId: result.graphDocumentId,
          buildRequestId: result.buildRequestId,
          buildSeq: result.seq,
          buildOutputs: result.parts,
        })
    if (!isLegacyRoutingResult && !acceptedSpaghettiResult) {
      return
    }

    set((state) => {
      if (result.seq <= state.lastBuildSeq) {
        if (!isLegacyRoutingResult) {
          return {
            lastBuildSeq: state.lastBuildSeq,
          }
        }
        return state
      }

      if (!isLegacyRoutingResult) {
        return {
          lastBuildSeq: result.seq,
        }
      }

      const nextGeomBuilt = { ...state.geomBuilt }
      for (const id of result.changedParamIds ?? []) {
        nextGeomBuilt[id] = state.geomDirty[id] ?? state.geomBuilt[id] ?? 0
      }
      const incomingPartKeys = result.parts.map((part) => artifactToPartKeyStr(part))
      const incomingPartKeySet = new Set(incomingPartKeys)
      const nextVisibility = { ...state.partsVisibility }
      for (const key of incomingPartKeys) {
        if (nextVisibility[key] === undefined) {
          nextVisibility[key] = true
        }
      }

      let selectedPartKey = state.selectedPartKey
      if (selectedPartKey !== null && !incomingPartKeySet.has(selectedPartKey)) {
        if (incomingPartKeySet.has('baseplate')) {
          selectedPartKey = 'baseplate'
        } else {
          const firstVisible = incomingPartKeys.find((key) => nextVisibility[key] ?? true)
          selectedPartKey = firstVisible ?? incomingPartKeys[0] ?? null
        }
      }
      return {
        lastBuildSeq: result.seq,
        parts: result.parts,
        geomBuilt: nextGeomBuilt,
        partsVisibility: nextVisibility,
        selectedPartKey,
      }
    })
  },
  setAssembled: (result) => {
    set({
      assembled: result.assembled,
      assembledSignature: result.signature,
      workerError: null,
    })
  },
  setWorkerError: (message) => {
    set({ workerError: message })
  },
  ensureVisibilityForPartKeys: (keys, defaultValue = true) => {
    set((state) => {
      let changed = false
      const nextVisibility = { ...state.partsVisibility }
      for (const key of keys) {
        if (nextVisibility[key] !== undefined) {
          continue
        }
        nextVisibility[key] = defaultValue
        changed = true
      }
      return changed ? { partsVisibility: nextVisibility } : state
    })
  },
  togglePartVisibility: (partKeyStr) => {
    const visible = get().partsVisibility[partKeyStr] ?? true
    set({
      partsVisibility: {
        ...get().partsVisibility,
        [partKeyStr]: !visible,
      },
    })
  },
  setPartVisibility: (partKeyStr, visible) => {
    set({
      partsVisibility: {
        ...get().partsVisibility,
        [partKeyStr]: visible,
      },
    })
  },
  selectPart: (partKeyStr) => {
    set({ selectedPartKey: partKeyStr })
  },
  addHeelKickInstance: () => {
    const next = [...get().heelKickInstances, nextInstanceId(get().heelKickInstances)]
    set({ heelKickInstances: next })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  addToeHookInstance: () => {
    const next = [...get().toeHookInstances, nextInstanceId(get().toeHookInstances)]
    set({ toeHookInstances: next })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  removeHeelKickInstance: (instance) => {
    const current = get().heelKickInstances
    if (!current.includes(instance) || current.length <= 1) {
      return
    }
    const next = current.filter((value) => value !== instance)
    const removedKey = `heelKick#${instance}`
    set((state) => {
      const nextVisibility = { ...state.partsVisibility }
      delete nextVisibility[removedKey]
      return {
        heelKickInstances: next,
        partsVisibility: nextVisibility,
        selectedPartKey:
          state.selectedPartKey === removedKey ? null : state.selectedPartKey,
      }
    })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
  removeToeHookInstance: (instance) => {
    const current = get().toeHookInstances
    if (!current.includes(instance) || current.length <= 1) {
      return
    }
    const next = current.filter((value) => value !== instance)
    const removedKey = `toeHook#${instance}`
    set((state) => {
      const nextVisibility = { ...state.partsVisibility }
      delete nextVisibility[removedKey]
      return {
        toeHookInstances: next,
        partsVisibility: nextVisibility,
        selectedPartKey:
          state.selectedPartKey === removedKey ? null : state.selectedPartKey,
      }
    })
    if (get().inputMode === 'legacy') {
      buildDispatcher.requestBuild(get().box)
    }
  },
}))

export const selectCurrentProject = (state: Pick<AppState, 'currentProject'>): ProjectFile =>
  state.currentProject

export const selectCurrentProjectId = (state: Pick<AppState, 'currentProject'>): string =>
  state.currentProject.projectFileId

export const selectCurrentProjectGraphDocuments = (
  state: Pick<AppState, 'currentProject'>,
): ProjectGraphDocumentEntry[] => state.currentProject.graphDocuments

export const selectCurrentProjectContent = (
  state: Pick<AppState, 'projectContent'>,
): ProjectContentState => state.projectContent

export const selectCurrentProjectRootAssembly = (
  state: Pick<AppState, 'currentProject' | 'projectContent'>,
): ProjectAssemblyRecord | null => {
  const rootAssemblyId = state.currentProject.rootAssemblyId
  if (rootAssemblyId === null) {
    return null
  }
  return state.projectContent.assembliesById[rootAssemblyId] ?? null
}

export const selectCurrentProjectRootComponents = (
  state: Pick<AppState, 'currentProject' | 'projectContent'>,
): ProjectComponentRecord[] => {
  const rootAssembly = selectCurrentProjectRootAssembly(state)
  if (rootAssembly === null) {
    return []
  }
  return rootAssembly.childComponentIds
    .map((componentId) => state.projectContent.componentsById[componentId] ?? null)
    .filter((component): component is ProjectComponentRecord => component !== null)
}

const selectProjectObjectsForComponent = (
  state: Pick<AppState, 'projectContent'>,
  component: ProjectComponentRecord,
): ProjectObjectRecord[] =>
  component.childObjectIds
    .map((objectId) => state.projectContent.objectsById[objectId] ?? null)
    .filter((objectRow): objectRow is ProjectObjectRecord => objectRow !== null)

export const selectCurrentProjectContentBrowserRows = (
  state: Pick<AppState, 'currentProject' | 'projectContent'> & {
    graphRuntimeByDocumentId: Record<string, GraphRuntimeState>
  },
): ProjectContentBrowserRowVm[] => {
  const rootAssembly = selectCurrentProjectRootAssembly(state)
  if (rootAssembly === null) {
    return []
  }
  const rows: ProjectContentBrowserRowVm[] = [
    {
      rowId: rootAssembly.assemblyId,
      kind: 'assembly',
      label: rootAssembly.label,
      meta:
        rootAssembly.childComponentIds.length === 1
          ? '1 Component'
          : `${rootAssembly.childComponentIds.length} Components`,
    },
  ]
  for (const component of selectCurrentProjectRootComponents(state)) {
    const componentObjects = selectProjectObjectsForComponent(state, component)
    const singleResolvedObject =
      componentObjects.length === 1 && componentObjects[0]?.resolutionState === 'resolved'
        ? componentObjects[0]
        : null
    const sourceOutputEntry =
      component.sourceOutputEntryId === null
        ? null
        : (state.graphRuntimeByDocumentId[component.sourceGraphDocumentId]?.outputSurface?.entries.find(
            (entry) => entry.outputEntryId === component.sourceOutputEntryId,
          ) ?? null)
    const slotId =
      component.componentSourceKind === 'published-component'
        ? singleResolvedObject?.slotId ?? null
        : sourceOutputEntry?.slotId ?? null
    const sourceNodeId =
      component.componentSourceKind === 'published-component'
        ? singleResolvedObject?.sourceNodeId ?? null
        : sourceOutputEntry?.sourceNodeId ?? component.sourceNodeId
    rows.push({
      rowId: component.componentId,
      kind: 'component',
      label: component.label,
      meta:
        component.componentSourceKind === 'receive-link'
          ? component.resolutionState === 'resolved'
            ? 'Linked Component'
            : 'Unresolved Link'
          : component.childObjectIds.length === 1
            ? '1 Object'
            : `${component.childObjectIds.length} Objects`,
      ownerGraphDocumentId: component.ownerGraphDocumentId,
      sourceGraphDocumentId: component.sourceGraphDocumentId,
      sourceOutputEntryId: component.sourceOutputEntryId,
      componentSourceKind: component.componentSourceKind,
      resolutionState: component.resolutionState,
      receiveId: component.receiveId,
      childObjectCount: component.childObjectIds.length,
      slotId,
      sourceNodeId,
      highlightViewerKey:
        component.componentSourceKind === 'published-component' ? singleResolvedObject?.slotId ?? null : slotId,
      authoringGraphDocumentId: component.sourceGraphDocumentId,
      authoringNodeId:
        component.componentSourceKind === 'published-component'
          ? singleResolvedObject?.sourceNodeId ?? null
          : sourceNodeId,
    })
    componentObjects.forEach((objectRow) => {
      rows.push({
        rowId: objectRow.objectId,
        kind: 'object',
        label: objectRow.label,
        meta: objectRow.resolutionState === 'resolved' ? '' : 'Unresolved',
        parentComponentId: objectRow.parentComponentId,
        sourceGraphDocumentId: objectRow.sourceGraphDocumentId,
        sourceOutputEntryId: objectRow.sourceOutputEntryId,
        slotId: objectRow.slotId,
        sourceNodeId: objectRow.sourceNodeId,
        resolutionState: objectRow.resolutionState,
        highlightViewerKey: objectRow.resolutionState === 'resolved' ? objectRow.slotId : null,
        authoringGraphDocumentId: objectRow.sourceGraphDocumentId,
        authoringNodeId: objectRow.sourceNodeId,
      })
    })
  }
  return rows
}

const syncCurrentProjectFromSpaghetti = (
  spaghettiState: Pick<
    SpaghettiStoreState,
    'graphDocumentsById' | 'graphDocumentOrder' | 'graphRuntimeByDocumentId'
  >,
): void => {
  const nextGraphDocuments = buildProjectGraphDocuments(spaghettiState)
  useAppStore.setState((state) => {
    const nextRootAssemblyId =
      state.currentProject.rootAssemblyId ?? buildRootAssemblyId(state.currentProject.projectFileId)
    const currentProjectChanged =
      !areProjectGraphDocumentsEqual(state.currentProject.graphDocuments, nextGraphDocuments) ||
      state.currentProject.rootAssemblyId !== nextRootAssemblyId
    const nextCurrentProject = currentProjectChanged
      ? {
          ...state.currentProject,
          graphDocuments: nextGraphDocuments,
          rootAssemblyId: nextRootAssemblyId,
        }
      : state.currentProject
    const nextProjectContent = buildProjectContentState(nextCurrentProject, spaghettiState)

    if (
      nextCurrentProject === state.currentProject &&
      areProjectContentStatesEqual(state.projectContent, nextProjectContent)
    ) {
      return state
    }
    return {
      currentProject: nextCurrentProject,
      projectContent: nextProjectContent,
    }
  })
}

useSpaghettiStore.subscribe((state, previousState) => {
  if (
    state.graphDocumentOrder === previousState.graphDocumentOrder &&
    state.graphDocumentsById === previousState.graphDocumentsById &&
    state.graphRuntimeByDocumentId === previousState.graphRuntimeByDocumentId
  ) {
    return
  }
  syncCurrentProjectFromSpaghetti(state)
})
