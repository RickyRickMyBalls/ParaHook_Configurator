import { create } from 'zustand'
import { buildDispatcher } from '../buildDispatcher'
import { artifactToPartKeyStr } from '../parts/partKeyResolver'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import type { SpaghettiGraph } from '../spaghetti/schema/spaghettiTypes'
import {
  compileSpaghettiGraph,
  type CompileSpaghettiGraphResult,
} from '../spaghetti/compiler/compileGraph'
import { buildRequestFromBuildInputs } from '../spaghetti/integration/buildInputsToRequest'
import type {
  AssembleResult,
  BoxParams,
  BuildResult,
  PartArtifact,
  ViewMode,
} from '../../shared/buildTypes'

type BoxParamKey = keyof BoxParams
type PartsVisibility = Record<string, boolean>
type AssembledMesh = AssembleResult['assembled']
type BuildPolicy = 'live' | 'release' | 'manual'
type InputMode = 'legacy' | 'spaghetti'

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
  workerError: string | null
  spaghettiLastCompile: CompileSpaghettiGraphResult | null
  spaghettiPendingChangedParamIds: string[]
  spaghettiPendingInstances: {
    heelKickInstances: number[]
    toeHookInstances: number[]
  } | null
  spaghettiPreviousBuildInputs: CompileSpaghettiGraphResult['buildInputs'] | null
  setBoxParam: (key: BoxParamKey, value: number) => void
  setInputMode: (mode: InputMode) => void
  setSpaghettiGraph: (graph: SpaghettiGraph) => void
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
  workerError: null,
  spaghettiLastCompile: null,
  spaghettiPendingChangedParamIds: [],
  spaghettiPendingInstances: null,
  spaghettiPreviousBuildInputs: null,
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
      spaghettiPendingChangedParamIds: [],
      spaghettiPendingInstances: null,
    })
  },
  setSpaghettiGraph: (graph) => {
    useSpaghettiStore.getState().setGraph(graph)
    set({
      spaghettiLastCompile: null,
    })
  },
  compileSpaghetti: () => {
    const graph = useSpaghettiStore.getState().graph
    const compileResult = compileSpaghettiGraph(graph)
    set({
      spaghettiLastCompile: compileResult,
    })
    return compileResult
  },
  requestSpaghettiBuild: () => {
    const state = get()
    const graph = useSpaghettiStore.getState().graph
    const compileResult = compileSpaghettiGraph(graph)
    set({
      spaghettiLastCompile: compileResult,
    })
    if (!compileResult.ok || compileResult.buildInputs === undefined) {
      return compileResult
    }

    const requestBuild = buildRequestFromBuildInputs(
      compileResult.buildInputs,
      state.spaghettiPreviousBuildInputs ?? undefined,
    )
    set({
      spaghettiPendingChangedParamIds: requestBuild.changedParamIds,
      spaghettiPendingInstances: requestBuild.instances,
      spaghettiPreviousBuildInputs: compileResult.buildInputs,
    })

    const payloadWithPatch = {
      ...state.box,
      ...requestBuild.profilePatch,
    }
    buildDispatcher.requestBuild(payloadWithPatch as BoxParams)
    return compileResult
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
      get().requestSpaghettiBuild()
      return
    }
    set({ pendingBuildAfterRelease: false })
    buildDispatcher.requestBuild(get().box)
  },
  setViewMode: (mode) => {
    set({ viewMode: mode })
  },
  acceptBuildResult: (result) => {
    set((state) => {
      if (result.seq <= state.lastBuildSeq) {
        return state
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
