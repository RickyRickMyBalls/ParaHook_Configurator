import type { StoreApi } from 'zustand'
import type {
  SketchFeature,
  SketchPlane,
  SketchPlaneTransform,
  SketchPlaneTransformHistoryEntry,
  Vec3Literal,
} from '../../features/featureTypes'
import type { EditorViewport, SpaghettiGraph } from '../../schema/spaghettiTypes'
import type {
  SketchPlanePickSession,
  SpaghettiStoreState,
} from '../useSpaghettiStore'

export const buildSketchPlaneMovePrompt = (translation: {
  x: number
  y: number
  z: number
}): string =>
  `Sketch Plane > Move > [Vec3(${translation.x.toFixed(1)}, ${translation.y.toFixed(1)}, ${translation.z.toFixed(1)}), Move Again, Move X, Move Y, Move Z, Snap, Back]`

export const buildSketchPlaneMoveAxisPrompt = (
  axis: 'x' | 'y' | 'z',
  value: number,
): string => `Sketch Plane > Move > ${axis.toUpperCase()} > [${value.toFixed(1)}, Back]`

export const buildSketchPlaneMoveAxisOffSnapConfirmPrompt = (
  axis: 'x' | 'y' | 'z',
  literal: string,
): string => `Sketch Plane > Move > ${axis.toUpperCase()} > confirm ${literal} off snap > [confirm, deny]`

export const buildSketchPlaneMoveSessionState = (
  session: SketchPlanePickSession,
): SketchPlanePickSession => ({
  ...session,
  stage: 'adjust',
  liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
  adjustScope: 'move',
  activeTransformAxis: 'free',
  gizmoMode: 'translate',
  transformCommandOrigin: cloneCommittedSketchPlaneTransform(session.draftTransform),
  pendingMoveAxisOffSnapConfirmation: null,
})

export const buildSketchPlaneRotatePrompt = (rotationDeg: {
  x: number
  y: number
  z: number
}): string =>
  `Sketch Plane > Rotate > [Vec3(${rotationDeg.x.toFixed(1)}, ${rotationDeg.y.toFixed(1)}, ${rotationDeg.z.toFixed(1)}), Rotate X, Rotate Y, Rotate Z, Snap, Back]`

export const buildSketchPlaneSnapPrompt = (
  mode: 'move' | 'rotate',
  value: number,
): string =>
  `Sketch Plane > ${mode === 'move' ? 'Move' : 'Rotate'} > Snap > [${value.toFixed(
    mode === 'move' ? 1 : 0,
  )}, On, Off, Back]`

export const SKETCH_PLANE_ROOT_PROMPT =
  'Sketch Plane > [Move, Rotate, Done, ConfirmToSketch, Back]'

type SketchPlaneCommandSessionActions = Pick<
  SpaghettiStoreState,
  | 'confirmSketchPlanePick'
  | 'setSketchPlanePickDraftPlane'
  | 'reopenSketchPlanePickPlaneSelection'
  | 'setSketchPlanePickGizmoMode'
  | 'setSketchPlanePickPreviewPlane'
  | 'acceptActiveSketchPlaneTransformCommand'
  | 'commitSketchPlaneTransformHistoryFromDraftRelease'
  | 'toggleSketchPlaneTransformHistoryLock'
  | 'mergeSketchPlaneTransformHistory'
  | 'runSketchPlaneCommand'
>

type AppendConsoleEntryInput = {
  layer: 'App' | 'Commands' | 'Transforms'
  text: string
  source?: string
  severity?: 'error' | 'info'
  commandLineKind?: 'user'
}

type SketchPlaneCommandSessionDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  get: StoreApi<SpaghettiStoreState>['getState']
  appendConsoleEntry: (entry: AppendConsoleEntryInput) => void
  isSketchPlane: (value: unknown) => value is SketchPlane
  cloneSketchPlaneTransform: (transform: SketchPlaneTransform) => SketchPlaneTransform
  appendSketchPlaneTransformHistoryEntry: (
    entries: readonly SketchPlaneTransformHistoryEntry[],
    point: Vec3Literal,
  ) => SketchPlaneTransformHistoryEntry[]
  resolvePersistedSketchPlaneTransformHistory: (
    entries: readonly SketchPlaneTransformHistoryEntry[],
    transform: SketchPlaneTransform,
  ) => SketchPlaneTransformHistoryEntry[]
  areSketchPlaneTransformHistoryEntriesEqual: (
    left: readonly SketchPlaneTransformHistoryEntry[] | undefined,
    right: readonly SketchPlaneTransformHistoryEntry[],
  ) => boolean
  mergeSketchPlaneTransformHistoryEntries: (
    entries: readonly SketchPlaneTransformHistoryEntry[],
  ) => SketchPlaneTransformHistoryEntry[]
  ensureSketchPlaneTransform: (feature: SketchFeature) => SketchPlaneTransform
  updateGeometrySketchNode: (
    graph: SpaghettiGraph,
    nodeId: string,
    updateFn: (feature: SketchFeature) => SketchFeature,
  ) => SpaghettiGraph
  withUpdatedActiveGraphDocumentState: (
    state: SpaghettiStoreState,
    nextGraph: SpaghettiGraph,
  ) => Partial<SpaghettiStoreState>
  readEditorViewportWindowMode: (
    state: SpaghettiStoreState,
    editorViewportId: string,
  ) => EditorViewport['windowMode'] | null
  setEditorViewportWindowMode: (
    editorViewportId: string,
    windowMode: EditorViewport['windowMode'],
  ) => void
  startGeometrySketchSession: (nodeId: string, mode: 'draw' | 'review') => void
  readTranslateSnapValue: () => number
  readRotateSnapValue: () => number
  finishSketchPlanePick: () => void
  cancelSketchPlanePick: () => void
  returnActiveSketchSessionOneLevel: () => void
}

const cloneCommittedSketchPlaneTransform = (
  transform: SketchPlaneTransform,
): SketchPlaneTransform => ({
  ...transform,
  translation: { ...transform.translation },
  rotationDeg: { ...transform.rotationDeg },
})

const areSketchPlaneTransformsEqual = (
  left: SketchPlaneTransform,
  right: SketchPlaneTransform,
): boolean =>
  left.offsetMm === right.offsetMm &&
  left.translation.x === right.translation.x &&
  left.translation.y === right.translation.y &&
  left.translation.z === right.translation.z &&
  left.rotationDeg.x === right.rotationDeg.x &&
  left.rotationDeg.y === right.rotationDeg.y &&
  left.rotationDeg.z === right.rotationDeg.z &&
  left.inPlaneRotationDeg === right.inPlaneRotationDeg

const restoreViewportWindowModeIfNeeded = (
  dependencies: SketchPlaneCommandSessionDependencies,
  session: SketchPlanePickSession,
): void => {
  if (
    session.shouldRestoreViewportWindowMode === true &&
    session.editorViewportId !== null &&
    dependencies.readEditorViewportWindowMode(
      dependencies.get(),
      session.editorViewportId,
    ) === 'collapsed'
  ) {
    dependencies.setEditorViewportWindowMode(session.editorViewportId, 'collapsed')
  }
}

const buildSketchPlaneAdjustSessionState = (
  session: SketchPlanePickSession,
  options: {
    adjustScope: SketchPlanePickSession['adjustScope']
    activeTransformAxis: SketchPlanePickSession['activeTransformAxis']
    gizmoMode: SketchPlanePickSession['gizmoMode']
    transformCommandOrigin?: SketchPlaneTransform | null
    draftTransform?: SketchPlaneTransform
  },
): SketchPlanePickSession => ({
  ...session,
  stage: 'adjust',
  liveTransformActivationNonce: session.liveTransformActivationNonce + 1,
  adjustScope: options.adjustScope,
  activeTransformAxis: options.activeTransformAxis,
  gizmoMode: options.gizmoMode,
  draftTransform: options.draftTransform ?? session.draftTransform,
  transformCommandOrigin: options.transformCommandOrigin ?? session.transformCommandOrigin,
  pendingMoveAxisOffSnapConfirmation: null,
})

export const createSketchPlaneCommandSessionActions = (
  dependencies: SketchPlaneCommandSessionDependencies,
): SketchPlaneCommandSessionActions => {
  const actions: SketchPlaneCommandSessionActions = {
    confirmSketchPlanePick: () => {
      const session = dependencies.get().sketchPlanePickSession
      if (session === null || session.stage !== 'adjust' || session.adjustScope !== 'root') {
        return
      }
      dependencies.set((state) => {
        const nextGraph = dependencies.updateGeometrySketchNode(
          state.graph,
          session.nodeId,
          (feature) => {
            const currentTransform = dependencies.ensureSketchPlaneTransform(feature)
            const nextTransform = session.draftTransform
            const nextTransformHistory = dependencies.resolvePersistedSketchPlaneTransformHistory(
              session.transformHistory,
              nextTransform,
            )
            if (
              feature.plane === session.draftPlane &&
              areSketchPlaneTransformsEqual(currentTransform, nextTransform) &&
              dependencies.areSketchPlaneTransformHistoryEntriesEqual(
                feature.uiState.sketchPlaneTransformHistory,
                nextTransformHistory,
              )
            ) {
              return feature
            }
            return {
              ...feature,
              plane: session.draftPlane,
              planeTransform: cloneCommittedSketchPlaneTransform(nextTransform),
              uiState: {
                ...feature.uiState,
                sketchPlaneTransformHistory: nextTransformHistory,
              },
            }
          },
        )
        return {
          ...dependencies.withUpdatedActiveGraphDocumentState(state, nextGraph),
          sketchPlanePickSession: null,
        }
      })
      restoreViewportWindowModeIfNeeded(dependencies, session)
      dependencies.appendConsoleEntry({
        layer: 'Commands',
        text: `Sketch plane pick confirmed: ${session.draftPlane}`,
        source: 'sketch-plane',
        severity: 'info',
      })
      dependencies.startGeometrySketchSession(session.nodeId, 'draw')
    },

    setSketchPlanePickDraftPlane: (plane) => {
      if (!dependencies.isSketchPlane(plane)) {
        return
      }
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null) {
          return state
        }
        return {
          sketchPlanePickSession: {
            ...session,
            draftPlane: plane,
            previewPlane: null,
            transformCommandOrigin: null,
            stage: 'adjust',
            adjustScope: 'root',
            activeTransformAxis: null,
          },
        }
      })
      dependencies.appendConsoleEntry({
        layer: 'Commands',
        text: `Sketch plane selected: ${plane}`,
        source: 'sketch-plane',
        severity: 'info',
      })
      dependencies.appendConsoleEntry({
        layer: 'Commands',
        text: SKETCH_PLANE_ROOT_PROMPT,
        source: 'sketch-plane',
        severity: 'info',
      })
    },

    reopenSketchPlanePickPlaneSelection: () => {
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null || session.stage === 'pick') {
          return state
        }
        return {
          sketchPlanePickSession: {
            ...session,
            stage: 'pick',
            adjustScope: 'root',
            activeTransformAxis: null,
            previewPlane: session.draftPlane,
            transformCommandOrigin: null,
          },
        }
      })
      dependencies.appendConsoleEntry({
        layer: 'Commands',
        text: 'Sketch Plane > [XY, XZ, YZ]',
        source: 'sketch-plane',
        severity: 'info',
      })
    },

    setSketchPlanePickGizmoMode: (mode) => {
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null || session.gizmoMode === mode) {
          return state
        }
        return {
          sketchPlanePickSession: {
            ...session,
            adjustScope: 'root',
            activeTransformAxis: null,
            previewPlane: null,
            transformCommandOrigin: null,
            gizmoMode: mode,
          },
        }
      })
    },

    setSketchPlanePickPreviewPlane: (plane) => {
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null || session.stage !== 'pick' || session.previewPlane === plane) {
          return state
        }
        return {
          sketchPlanePickSession: {
            ...session,
            previewPlane: plane,
          },
        }
      })
    },

    acceptActiveSketchPlaneTransformCommand: () => {
      const session = dependencies.get().sketchPlanePickSession
      if (session === null || session.stage !== 'adjust' || session.adjustScope === 'root') {
        return
      }
      const nextTransformHistory =
        session.adjustScope === 'move' || session.adjustScope === 'move-axis'
          ? dependencies.appendSketchPlaneTransformHistoryEntry(
              session.transformHistory,
              session.draftTransform.translation,
            )
          : session.transformHistory.map((entry) => ({
              ...entry,
              point: { ...entry.point },
            }))
      if (session.adjustScope === 'move-axis') {
        dependencies.set({
          sketchPlanePickSession: {
            ...session,
            adjustScope: 'move',
            activeTransformAxis: 'free',
            transformCommandOrigin: dependencies.cloneSketchPlaneTransform(
              session.draftTransform,
            ),
            transformHistory: nextTransformHistory,
            pendingMoveAxisOffSnapConfirmation: null,
          },
        })
        dependencies.appendConsoleEntry({
          layer: 'Commands',
          text: buildSketchPlaneMovePrompt(session.draftTransform.translation),
          source: 'sketch-plane',
          severity: 'info',
        })
        return
      }
      dependencies.set({
        sketchPlanePickSession: {
          ...session,
          adjustScope: 'root',
          activeTransformAxis: null,
          transformCommandOrigin: null,
          transformHistory: nextTransformHistory,
          pendingMoveAxisOffSnapConfirmation: null,
        },
      })
      dependencies.appendConsoleEntry({
        layer: 'Commands',
        text: SKETCH_PLANE_ROOT_PROMPT,
        source: 'sketch-plane',
        severity: 'info',
      })
    },

    commitSketchPlaneTransformHistoryFromDraftRelease: () => {
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null || session.stage !== 'adjust') {
          return state
        }
        const nextHistory = dependencies.appendSketchPlaneTransformHistoryEntry(
          session.transformHistory,
          session.draftTransform.translation,
        )
        if (
          dependencies.areSketchPlaneTransformHistoryEntriesEqual(
            session.transformHistory,
            nextHistory,
          ) &&
          session.transformCommandOrigin !== null &&
          areSketchPlaneTransformsEqual(session.transformCommandOrigin, session.draftTransform)
        ) {
          return state
        }
        return {
          ...state,
          sketchPlanePickSession: {
            ...session,
            transformCommandOrigin: cloneCommittedSketchPlaneTransform(session.draftTransform),
            transformHistory: nextHistory,
          },
        }
      })
    },

    toggleSketchPlaneTransformHistoryLock: (entryId) => {
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null) {
          return state
        }
        let changed = false
        const nextHistory = session.transformHistory.map((entry) => {
          if (entry.entryId !== entryId) {
            return entry
          }
          changed = true
          return {
            ...entry,
            locked: !entry.locked,
          }
        })
        if (!changed) {
          return state
        }
        return {
          sketchPlanePickSession: {
            ...session,
            transformHistory: nextHistory,
          },
        }
      })
    },

    mergeSketchPlaneTransformHistory: () => {
      dependencies.set((state) => {
        const session = state.sketchPlanePickSession
        if (session === null) {
          return state
        }
        const nextHistory = dependencies.mergeSketchPlaneTransformHistoryEntries(
          session.transformHistory,
        )
        if (
          dependencies.areSketchPlaneTransformHistoryEntriesEqual(
            session.transformHistory,
            nextHistory,
          )
        ) {
          return state
        }
        return {
          sketchPlanePickSession: {
            ...session,
            transformHistory: nextHistory,
          },
        }
      })
    },

    runSketchPlaneCommand: (command) => {
      switch (command) {
        case 'xy':
          actions.setSketchPlanePickDraftPlane('XY')
          return
        case 'xz':
          actions.setSketchPlanePickDraftPlane('XZ')
          return
        case 'yz':
          actions.setSketchPlanePickDraftPlane('YZ')
          return
        case 'esc':
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            commandLineKind: 'user',
            text: '> esc',
          })
          dependencies.returnActiveSketchSessionOneLevel()
          return
        case 'back':
          dependencies.returnActiveSketchSessionOneLevel()
          return
        case 'done':
          dependencies.finishSketchPlanePick()
          return
        case 'confirm-to-sketch':
          actions.confirmSketchPlanePick()
          return
        case 'x':
          dependencies.cancelSketchPlanePick()
          return
        case 'move':
        case 'move-again': {
          const moveSession = dependencies.get().sketchPlanePickSession
          dependencies.set((state) => {
            const session = state.sketchPlanePickSession
            if (session === null) {
              return state
            }
            return {
              sketchPlanePickSession: buildSketchPlaneMoveSessionState(session),
            }
          })
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            text: buildSketchPlaneMovePrompt(
              moveSession?.draftTransform.translation ?? { x: 0, y: 0, z: 0 },
            ),
            source: 'sketch-plane',
            severity: 'info',
          })
          return
        }
        case 'move-snap':
          dependencies.set((state) => {
            const session = state.sketchPlanePickSession
            if (session === null) {
              return state
            }
            return {
              sketchPlanePickSession: buildSketchPlaneAdjustSessionState(session, {
                adjustScope: 'move-snap',
                activeTransformAxis: null,
                gizmoMode: 'translate',
              }),
            }
          })
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            text: buildSketchPlaneSnapPrompt('move', dependencies.readTranslateSnapValue()),
            source: 'sketch-plane',
            severity: 'info',
          })
          return
        case 'rotate-snap':
          dependencies.set((state) => {
            const session = state.sketchPlanePickSession
            if (session === null) {
              return state
            }
            return {
              sketchPlanePickSession: buildSketchPlaneAdjustSessionState(session, {
                adjustScope: 'rotate-snap',
                activeTransformAxis: null,
                gizmoMode: 'rotate',
              }),
            }
          })
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            text: buildSketchPlaneSnapPrompt('rotate', dependencies.readRotateSnapValue()),
            source: 'sketch-plane',
            severity: 'info',
          })
          return
        case 'rotate': {
          const rotateSession = dependencies.get().sketchPlanePickSession
          dependencies.set((state) => {
            const session = state.sketchPlanePickSession
            if (session === null) {
              return state
            }
            return {
              sketchPlanePickSession: buildSketchPlaneAdjustSessionState(session, {
                adjustScope: 'rotate',
                activeTransformAxis: 'free',
                gizmoMode: 'rotate',
                transformCommandOrigin: dependencies.cloneSketchPlaneTransform(
                  session.draftTransform,
                ),
              }),
            }
          })
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            text: buildSketchPlaneRotatePrompt(
              rotateSession?.draftTransform.rotationDeg ?? { x: 0, y: 0, z: 0 },
            ),
            source: 'sketch-plane',
            severity: 'info',
          })
          return
        }
        case 'move-x':
        case 'move-y':
        case 'move-z': {
          const moveAxisSession = dependencies.get().sketchPlanePickSession
          const moveAxis = command === 'move-x' ? 'x' : command === 'move-y' ? 'y' : 'z'
          dependencies.set((state) => {
            const session = state.sketchPlanePickSession
            if (session === null) {
              return state
            }
            const baselineTransform = dependencies.cloneSketchPlaneTransform(
              session.draftTransform,
            )
            return {
              sketchPlanePickSession: buildSketchPlaneAdjustSessionState(session, {
                adjustScope: 'move-axis',
                activeTransformAxis: moveAxis,
                gizmoMode: 'translate',
                draftTransform: baselineTransform,
                transformCommandOrigin: baselineTransform,
              }),
            }
          })
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            text: buildSketchPlaneMoveAxisPrompt(
              moveAxis,
              moveAxisSession?.draftTransform.translation[moveAxis] ?? 0,
            ),
            source: 'sketch-plane',
            severity: 'info',
          })
          return
        }
        case 'rotate-x':
        case 'rotate-y':
        case 'rotate-z':
          dependencies.set((state) => {
            const session = state.sketchPlanePickSession
            if (session === null) {
              return state
            }
            const baselineTransform =
              session.transformCommandOrigin === null
                ? dependencies.cloneSketchPlaneTransform(session.draftTransform)
                : dependencies.cloneSketchPlaneTransform(session.transformCommandOrigin)
            return {
              sketchPlanePickSession: buildSketchPlaneAdjustSessionState(session, {
                adjustScope: 'rotate',
                activeTransformAxis:
                  command === 'rotate-x' ? 'x' : command === 'rotate-y' ? 'y' : 'z',
                gizmoMode: 'rotate',
                draftTransform: baselineTransform,
                transformCommandOrigin: baselineTransform,
              }),
            }
          })
          dependencies.appendConsoleEntry({
            layer: 'Commands',
            text: buildSketchPlaneRotatePrompt(
              dependencies.get().sketchPlanePickSession?.draftTransform.rotationDeg ?? {
                x: 0,
                y: 0,
                z: 0,
              },
            ),
            source: 'sketch-plane',
            severity: 'info',
          })
          return
      }
    },
  }

  return actions
}
