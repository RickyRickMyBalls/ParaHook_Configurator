import { describe, expect, it } from 'vitest'
import {
  EXTRUDE_COMMAND_PATH,
  createExtrudeCommandSession,
  listExtrudeProfileConsoleChoices,
  resolveExtrudeProfileConsoleToken,
  selectExtrudeCommandCommitProfileSources,
  setExtrudeCommandSessionCommitProfileSources,
  setExtrudeCommandSessionProfileSources,
} from './extrudeCommandSession'
import type { SketchFeature } from '../features/featureTypes'

const rectangleSketchFeature = (): SketchFeature => ({
  type: 'sketch',
  featureId: 'sketch-1',
  plane: 'XY',
  components: [
    {
      rowId: 'row-rect-1',
      componentId: 'rect-1',
      type: 'rectangle',
      a: { kind: 'lit', x: 0, y: 0 },
      b: { kind: 'lit', x: 20, y: 10 },
    },
  ],
  outputs: {
    profiles: [],
    diagnostics: [],
  },
  uiState: {
    collapsed: false,
  },
})

describe('extrudeCommandSession', () => {
  it('starts in select-profiles with a toolbar-readable command path', () => {
    const session = createExtrudeCommandSession({
      graphDocumentId: 'graph-document-1',
      entryPoint: 'console-root',
    })

    expect(session).toMatchObject({
      commandFamily: 'Extrude',
      lifecycleState: 'previewing',
      graphDocumentId: 'graph-document-1',
      entryPoint: 'console-root',
      activeStep: 'selectProfiles',
      depth: 10,
      operationMode: 'newBody',
      validation: 'needsProfiles',
    })
    expect(session.commandPath).toBe(EXTRUDE_COMMAND_PATH)
    expect(session.commandPath).toEqual(['Extrude', 'Select Profiles', 'Depth'])
    expect(session.selectedProfileSources).toEqual([])
  })

  it('moves to depth when selected profile contributors are present', () => {
    const session = createExtrudeCommandSession({
      graphDocumentId: 'graph-document-1',
      entryPoint: 'console-root',
    })

    const nextSession = setExtrudeCommandSessionProfileSources(session, [
      { nodeId: 'node-sketch-1', portId: 'Profiles' },
    ])

    expect(nextSession).toMatchObject({
      activeStep: 'depth',
      validation: 'readyForDepth',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'Profiles' }],
      commitProfileSources: [{ nodeId: 'node-sketch-1', portId: 'Profiles' }],
    })
    expect(session).toMatchObject({
      activeStep: 'selectProfiles',
      validation: 'needsProfiles',
      selectedProfileSources: [],
      commitProfileSources: [],
    })
  })

  it('keeps candidate profiles visible when commit profiles are toggled off', () => {
    const session = createExtrudeCommandSession({
      graphDocumentId: 'graph-document-1',
      entryPoint: 'console-root',
      selectedProfileSources: [
        { nodeId: 'node-sketch-1', portId: 'ProfileA' },
        { nodeId: 'node-sketch-1', portId: 'ProfileB' },
      ],
    })

    const nextSession = setExtrudeCommandSessionCommitProfileSources(session, [
      { nodeId: 'node-sketch-1', portId: 'ProfileA' },
    ])

    expect(nextSession).toMatchObject({
      activeStep: 'depth',
      validation: 'readyForDepth',
      selectedProfileSources: [
        { nodeId: 'node-sketch-1', portId: 'ProfileA' },
        { nodeId: 'node-sketch-1', portId: 'ProfileB' },
      ],
      commitProfileSources: [{ nodeId: 'node-sketch-1', portId: 'ProfileA' }],
    })
    expect(selectExtrudeCommandCommitProfileSources(nextSession)).toEqual([
      { nodeId: 'node-sketch-1', portId: 'ProfileA' },
    ])
  })

  it('requires at least one commit profile even when candidates remain visible', () => {
    const session = createExtrudeCommandSession({
      graphDocumentId: 'graph-document-1',
      entryPoint: 'console-root',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'ProfileA' }],
    })

    const nextSession = setExtrudeCommandSessionCommitProfileSources(session, [])

    expect(nextSession).toMatchObject({
      activeStep: 'selectProfiles',
      validation: 'needsProfiles',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'ProfileA' }],
      commitProfileSources: [],
    })
  })

  it('returns to select-profiles when profile contributors are cleared', () => {
    const session = createExtrudeCommandSession({
      graphDocumentId: 'graph-document-1',
      entryPoint: 'console-root',
      selectedProfileSources: [{ nodeId: 'node-sketch-1', portId: 'Profiles' }],
    })

    const nextSession = setExtrudeCommandSessionProfileSources(session, [])

    expect(nextSession).toMatchObject({
      activeStep: 'selectProfiles',
      validation: 'needsProfiles',
      selectedProfileSources: [],
    })
  })

  it('lists sketch profile Console choices from existing sketch profile ports', () => {
    const choices = listExtrudeProfileConsoleChoices([
      {
        nodeId: 'node-sketch-1',
        type: 'Geometry/Sketch',
        params: { sketch: rectangleSketchFeature() },
      },
    ])

    expect(choices).toHaveLength(1)
    expect(choices[0]).toMatchObject({
      label: 'Profile 1',
      profileSource: {
        nodeId: 'node-sketch-1',
      },
    })
    expect(choices[0]?.profileSource.portId).toMatch(/^SketchProfile:/)
  })

  it('resolves profile tokens and reports unresolved or ambiguous tokens', () => {
    const choices = [
      {
        label: 'Profile 1',
        aliases: ['prof_alpha'],
        profileSource: { nodeId: 'node-sketch-1', portId: 'SketchProfile:prof_alpha' },
      },
      {
        label: 'Profile 2',
        aliases: ['prof_beta', 'same'],
        profileSource: { nodeId: 'node-sketch-2', portId: 'SketchProfile:prof_beta' },
      },
      {
        label: 'Profile 3',
        aliases: ['prof_gamma', 'same'],
        profileSource: { nodeId: 'node-sketch-3', portId: 'SketchProfile:prof_gamma' },
      },
    ]

    expect(resolveExtrudeProfileConsoleToken(choices, 'Profile 1')).toMatchObject({
      kind: 'resolved',
      choice: {
        profileSource: { nodeId: 'node-sketch-1' },
      },
    })
    expect(resolveExtrudeProfileConsoleToken(choices, 'same')).toMatchObject({
      kind: 'ambiguous',
      choices: [{ label: 'Profile 2' }, { label: 'Profile 3' }],
    })
    expect(resolveExtrudeProfileConsoleToken(choices, 'missing')).toEqual({ kind: 'not-found' })
    expect(resolveExtrudeProfileConsoleToken([], 'Profile 1')).toEqual({ kind: 'no-profiles' })
  })
})
