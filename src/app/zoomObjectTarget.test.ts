import { beforeEach, describe, expect, it } from 'vitest'
import { useAppStore } from './store/useAppStore'
import {
  resolveSelectedObjectPartKeyForZoom,
  resolveSelectedReferenceIdForZoom,
  resolveZoomObjectTarget,
} from './zoomObjectTarget'

describe('zoomObjectTarget', () => {
  beforeEach(() => {
    useAppStore.setState(useAppStore.getInitialState(), true)
  })

  it('prefers the currently selected part when resolving zoom object targets', () => {
    useAppStore.setState((state) => ({
      ...state,
      selectedPartKey: 'part:object-1',
    }))

    const appState = useAppStore.getState()

    expect(resolveSelectedObjectPartKeyForZoom(appState)).toBe('part:object-1')
    expect(resolveZoomObjectTarget(appState)).toEqual({
      kind: 'part',
      partKey: 'part:object-1',
    })
  })

  it('falls back from a selected object to that objects first part key', () => {
    useAppStore.setState((state) => ({
      ...state,
      projectContent: {
        ...state.projectContent,
        objectsById: {
          ...state.projectContent.objectsById,
          'object-1': {
            objectId: 'object-1',
            ownerGraphDocumentId: 'graph-document-1',
            parentComponentId: null,
            objectSourceKind: 'published-object',
            sourceGraphDocumentId: 'graph-document-1',
            sourceOutputEntryId: 'output-entry-1',
            sourceNodeId: 'node-output-1',
            slotId: 'slot-a',
            label: 'Object 1',
            resolutionState: 'resolved',
          },
        },
      },
      selectedPartKey: null,
      workspaceSelection: {
        ...state.workspaceSelection,
        selectedTarget: {
          kind: 'object',
          objectId: 'object-1',
        },
        explicitSelectedTargets: [
          {
            kind: 'object',
            objectId: 'object-1',
          },
        ],
      },
    }))

    const appState = useAppStore.getState()

    expect(resolveSelectedObjectPartKeyForZoom(appState)).toBe('graph-document-1:output-entry-1')
    expect(resolveZoomObjectTarget(appState)).toEqual({
      kind: 'part',
      partKey: 'graph-document-1:output-entry-1',
    })
  })

  it('falls back to the selected reference when no part target exists', () => {
    useAppStore.setState((state) => ({
      ...state,
      referenceWorkspace: {
        ...state.referenceWorkspace,
        activeReferenceTransformSession: {
          referenceId: 'shoe:shoe-1',
          sessionId: 'session-1',
          sessionOrdinal: 1,
          mode: 'translate',
          space: 'world',
          shellActive: false,
          entryActive: false,
          activeHandle: null,
          draftTransform: {
            position: { x: 0, y: 0, z: 0 },
            rotationDeg: { x: 0, y: 0, z: 0 },
            scale: { x: 1, y: 1, z: 1 },
          },
          entryOrigin: null,
        },
      },
    }))

    const appState = useAppStore.getState()

    expect(resolveSelectedReferenceIdForZoom(appState)).toBe('shoe:shoe-1')
    expect(resolveZoomObjectTarget(appState)).toEqual({
      kind: 'reference',
      referenceId: 'shoe:shoe-1',
    })
  })
})
