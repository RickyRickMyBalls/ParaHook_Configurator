import type { StoreApi } from 'zustand'
import type { SketchPlaneTransform } from '../../features/featureTypes'
import {
  buildSketchPlaneMoveAxisOffSnapConfirmPrompt,
} from './sketchPlaneCommandSession'
import type { SpaghettiStoreState } from '../useSpaghettiStore'

type SketchPlaneDraftAxis = 'x' | 'y' | 'z'

type SketchPlanePickDraftTransformActions = Pick<
  SpaghettiStoreState,
  | 'resetSketchPlanePickDraftTransform'
  | 'setSketchPlanePickDraftTransform'
  | 'setSketchPlanePickTranslationAxis'
  | 'setSketchPlanePickRotationAxis'
  | 'setSketchPlaneMoveAxisOffSnapConfirmation'
  | 'clearSketchPlaneMoveAxisOffSnapConfirmation'
>

type AppendConsoleEntryInput = {
  layer: 'App' | 'Commands' | 'Transforms'
  text: string
  source?: string
  severity?: 'error' | 'info'
  commandLineKind?: 'user'
}

type SketchPlanePickDraftTransformDependencies = {
  set: StoreApi<SpaghettiStoreState>['setState']
  appendConsoleEntry: (entry: AppendConsoleEntryInput) => void
  createDefaultSketchPlaneTransform: () => SketchPlaneTransform
  cloneSketchPlaneTransform: (transform: SketchPlaneTransform) => SketchPlaneTransform
  areSketchPlaneTransformsEqual: (
    left: SketchPlaneTransform,
    right: SketchPlaneTransform,
  ) => boolean
  normalizeFiniteSketchPlaneTransformNumber: (value: number) => number
  normalizeFiniteSketchPlaneAxisValue: (value: number) => number | null
}

const normalizeSketchPlaneTransform = (
  transform: SketchPlaneTransform,
  normalizeFiniteSketchPlaneTransformNumber:
    SketchPlanePickDraftTransformDependencies['normalizeFiniteSketchPlaneTransformNumber'],
): SketchPlaneTransform => ({
  offsetMm: normalizeFiniteSketchPlaneTransformNumber(transform.offsetMm),
  inPlaneRotationDeg: normalizeFiniteSketchPlaneTransformNumber(
    transform.inPlaneRotationDeg,
  ),
  translation: {
    x: normalizeFiniteSketchPlaneTransformNumber(transform.translation.x),
    y: normalizeFiniteSketchPlaneTransformNumber(transform.translation.y),
    z: normalizeFiniteSketchPlaneTransformNumber(transform.translation.z),
  },
  rotationDeg: {
    x: normalizeFiniteSketchPlaneTransformNumber(transform.rotationDeg.x),
    y: normalizeFiniteSketchPlaneTransformNumber(transform.rotationDeg.y),
    z: normalizeFiniteSketchPlaneTransformNumber(transform.rotationDeg.z),
  },
})

const clearMoveAxisPendingConfirmationForAxis = (
  session: NonNullable<SpaghettiStoreState['sketchPlanePickSession']>,
  axis: SketchPlaneDraftAxis,
) =>
  session.pendingMoveAxisOffSnapConfirmation !== null &&
  session.pendingMoveAxisOffSnapConfirmation.axis === axis
    ? null
    : session.pendingMoveAxisOffSnapConfirmation

export const createSketchPlanePickDraftTransformActions = (
  dependencies: SketchPlanePickDraftTransformDependencies,
): SketchPlanePickDraftTransformActions => ({
  resetSketchPlanePickDraftTransform: () => {
    dependencies.set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null) {
        return state
      }
      const nextTransform = dependencies.createDefaultSketchPlaneTransform()
      if (dependencies.areSketchPlaneTransformsEqual(session.draftTransform, nextTransform)) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: dependencies.cloneSketchPlaneTransform(nextTransform),
        },
      }
    })
    dependencies.appendConsoleEntry({
      layer: 'Transforms',
      text: 'Sketch plane transform reset',
      source: 'sketch-plane',
      severity: 'info',
    })
  },

  setSketchPlanePickDraftTransform: (transform) => {
    const normalizedTransform = normalizeSketchPlaneTransform(
      transform,
      dependencies.normalizeFiniteSketchPlaneTransformNumber,
    )
    dependencies.set((state) => {
      const session = state.sketchPlanePickSession
      if (
        session === null ||
        dependencies.areSketchPlaneTransformsEqual(
          session.draftTransform,
          normalizedTransform,
        )
      ) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: dependencies.cloneSketchPlaneTransform(normalizedTransform),
          pendingMoveAxisOffSnapConfirmation: null,
        },
      }
    })
    dependencies.appendConsoleEntry({
      layer: 'Transforms',
      text:
        `Sketch plane draft transform: ` +
        `move (${normalizedTransform.translation.x.toFixed(1)}, ${normalizedTransform.translation.y.toFixed(1)}, ${normalizedTransform.translation.z.toFixed(1)}) ` +
        `rotate (${normalizedTransform.rotationDeg.x.toFixed(0)}, ${normalizedTransform.rotationDeg.y.toFixed(0)}, ${normalizedTransform.rotationDeg.z.toFixed(0)})`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },

  setSketchPlanePickTranslationAxis: (axis, value) => {
    const normalizedValue = dependencies.normalizeFiniteSketchPlaneAxisValue(value)
    if (normalizedValue === null) {
      return
    }
    dependencies.set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.draftTransform.translation[axis] === normalizedValue) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: {
            ...session.draftTransform,
            translation: {
              ...session.draftTransform.translation,
              [axis]: normalizedValue,
            },
          },
          pendingMoveAxisOffSnapConfirmation: clearMoveAxisPendingConfirmationForAxis(
            session,
            axis,
          ),
        },
      }
    })
    dependencies.appendConsoleEntry({
      layer: 'Transforms',
      text: `Sketch plane moved: ${axis.toUpperCase()} ${normalizedValue.toFixed(1)}`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },

  setSketchPlanePickRotationAxis: (axis, value) => {
    const normalizedValue = dependencies.normalizeFiniteSketchPlaneAxisValue(value)
    if (normalizedValue === null) {
      return
    }
    dependencies.set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.draftTransform.rotationDeg[axis] === normalizedValue) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          draftTransform: {
            ...session.draftTransform,
            rotationDeg: {
              ...session.draftTransform.rotationDeg,
              [axis]: normalizedValue,
            },
          },
          pendingMoveAxisOffSnapConfirmation: null,
        },
      }
    })
    dependencies.appendConsoleEntry({
      layer: 'Transforms',
      text: `Sketch plane rotated: ${axis.toUpperCase()} ${normalizedValue.toFixed(0)}`,
      source: 'sketch-plane',
      severity: 'info',
    })
  },

  setSketchPlaneMoveAxisOffSnapConfirmation: (axis, value, literal) => {
    const normalizedValue = dependencies.normalizeFiniteSketchPlaneAxisValue(value)
    if (normalizedValue === null) {
      return
    }
    dependencies.set((state) => {
      const session = state.sketchPlanePickSession
      if (
        session === null ||
        session.adjustScope !== 'move-axis' ||
        session.activeTransformAxis !== axis
      ) {
        return state
      }
      if (
        session.pendingMoveAxisOffSnapConfirmation?.axis === axis &&
        session.pendingMoveAxisOffSnapConfirmation.value === normalizedValue &&
        session.pendingMoveAxisOffSnapConfirmation.literal === literal
      ) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          pendingMoveAxisOffSnapConfirmation: {
            axis,
            value: normalizedValue,
            literal,
          },
        },
      }
    })
    dependencies.appendConsoleEntry({
      layer: 'Commands',
      text: buildSketchPlaneMoveAxisOffSnapConfirmPrompt(axis, literal),
      source: 'sketch-plane',
      severity: 'info',
    })
  },

  clearSketchPlaneMoveAxisOffSnapConfirmation: () => {
    dependencies.set((state) => {
      const session = state.sketchPlanePickSession
      if (session === null || session.pendingMoveAxisOffSnapConfirmation === null) {
        return state
      }
      return {
        sketchPlanePickSession: {
          ...session,
          pendingMoveAxisOffSnapConfirmation: null,
        },
      }
    })
  },
})
