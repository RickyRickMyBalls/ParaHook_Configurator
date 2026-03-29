import { describe, expect, it } from 'vitest'
import {
  cancelConsoleStagedNavigationSession,
  createConsoleRootSession,
  createConsoleStagedNavigationContext,
  createSketchDrawRootSession,
  submitConsoleStagedNavigationToken,
  type ConsoleStagedNavigationSession,
} from './stagedNavigation'

describe('stagedNavigation', () => {
  it('creates a root staged session with Graph, Camera, and Radio choices', () => {
    const result = createConsoleRootSession()

    expect(result.scopeId).toBe('root')
    expect(result.breadcrumb).toEqual(['Root'])
    expect(result.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'GRAPH',
      'CONTENT',
      'REFERENCES',
      'CAMERA',
      'RADIO',
      'ZOOM',
      'PAN',
      'ORBIT',
    ])
  })

  it('advances from the explicit root session into graph, camera, and radio scopes', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const cameraResult = submitConsoleStagedNavigationToken(createConsoleRootSession(), 'camera', context)
    const graphResult = submitConsoleStagedNavigationToken(createConsoleRootSession(), 'graph', context)
    const radioResult = submitConsoleStagedNavigationToken(createConsoleRootSession(), 'radio', context)

    expect(cameraResult).toMatchObject({
      kind: 'advance',
      session: {
        scopeId: 'cameraRoot',
      },
    })
    expect(graphResult).toMatchObject({
      kind: 'advance',
      session: {
        scopeId: 'graphRoot',
      },
    })
    expect(radioResult).toMatchObject({
      kind: 'advance',
      session: {
        scopeId: 'radioRoot',
      },
    })
  })

  it('executes camera projection choices from the root camera family', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const cameraRoot = submitConsoleStagedNavigationToken(null, 'c', context)
    expect(cameraRoot.kind).toBe('advance')
    if (cameraRoot.kind !== 'advance') {
      throw new Error('Expected camera root token to advance')
    }
    expect(cameraRoot.session.scopeId).toBe('cameraRoot')
    expect(cameraRoot.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'PROJECTION',
      'BACK',
    ])

    const projectionRoot = submitConsoleStagedNavigationToken(cameraRoot.session, 'projection', context)
    expect(projectionRoot.kind).toBe('advance')
    if (projectionRoot.kind !== 'advance') {
      throw new Error('Expected projection token to advance')
    }
    expect(projectionRoot.session.scopeId).toBe('cameraProjectionRoot')
    expect(projectionRoot.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'ORTHOGRAPHIC',
      'PERSPECTIVE',
      'BACK',
    ])

    expect(submitConsoleStagedNavigationToken(projectionRoot.session, 'o', context)).toMatchObject({
      kind: 'execute',
      actionId: 'camera.projection.orthographic',
    })
    expect(submitConsoleStagedNavigationToken(projectionRoot.session, 'p', context)).toMatchObject({
      kind: 'execute',
      actionId: 'camera.projection.perspective',
    })
  })

  it('creates a sketch draw root session with the local staged command surface', () => {
    const context = createConsoleStagedNavigationContext([], [], {
      hasSelection: true,
      hasPrevious: true,
      preferredTool: 'LINE',
    })

    const result = createSketchDrawRootSession(context)

    expect(result.scopeId).toBe('sketchDrawRoot')
    expect(result.breadcrumb).toEqual(['Graph', 'Sketch', 'Sketch Draw'])
    expect(result.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'LINE',
      'PLINE',
      'RECTANGLE',
      'CIRCLE',
      'CAMERA',
      'ZOOM',
      'DELETE',
      'PREVIOUS',
      'DONE',
      'BACK',
      'X',
    ])
  })

  it('routes sketch draw camera projection and returns to the local root from zoom back', () => {
    const context = createConsoleStagedNavigationContext([], [], {
      hasSelection: false,
      hasPrevious: false,
      preferredTool: 'LINE',
    })

    const sketchDrawRoot = createSketchDrawRootSession(context)
    const cameraRoot = submitConsoleStagedNavigationToken(sketchDrawRoot, 'c', context)
    expect(cameraRoot.kind).toBe('advance')
    if (cameraRoot.kind !== 'advance') {
      throw new Error('Expected sketch draw camera token to advance')
    }
    expect(cameraRoot.session.scopeId).toBe('sketchDrawCameraRoot')

    const projectionRoot = submitConsoleStagedNavigationToken(cameraRoot.session, 'projection', context)
    expect(projectionRoot.kind).toBe('advance')
    if (projectionRoot.kind !== 'advance') {
      throw new Error('Expected sketch draw projection token to advance')
    }
    expect(projectionRoot.session.scopeId).toBe('sketchDrawCameraProjectionRoot')

    expect(submitConsoleStagedNavigationToken(projectionRoot.session, 'o', context)).toMatchObject({
      kind: 'execute',
      actionId: 'sketchdraw.camera.projection.orthographic',
    })

    const zoomRoot = submitConsoleStagedNavigationToken(sketchDrawRoot, 'z', context)
    expect(zoomRoot.kind).toBe('advance')
    if (zoomRoot.kind !== 'advance') {
      throw new Error('Expected sketch draw zoom token to advance')
    }
    expect(zoomRoot.session.scopeId).toBe('sketchDrawZoomRoot')

    const backResult = submitConsoleStagedNavigationToken(zoomRoot.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected sketch draw zoom back token to advance')
    }
    expect(backResult.session.scopeId).toBe('sketchDrawRoot')
  })

  it('routes object-selected zoom back to the object scope', () => {
    const context = createConsoleStagedNavigationContext([])
    const objectSession = {
      scopeId: 'contentObjectSelected' as const,
      breadcrumb: ['Select', 'Content', 'Object 1'],
      selections: {
        graphDocumentId: 'graph-document-1',
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: null,
      },
      validChoices: [],
    }

    const zoomRoot = submitConsoleStagedNavigationToken(objectSession, 'z', context)
    expect(zoomRoot.kind).toBe('advance')
    if (zoomRoot.kind !== 'advance') {
      throw new Error('Expected object zoom token to advance')
    }
    expect(zoomRoot.session.scopeId).toBe('contentObjectZoomRoot')
    expect(zoomRoot.session.breadcrumb).toEqual(['Select', 'Content', 'Object 1', 'Zoom'])
    expect(zoomRoot.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'ALL',
      'EXTENTS',
      'PREVIOUS',
      'WINDOW',
      'OBJECT',
      'BACK',
    ])

    const backResult = submitConsoleStagedNavigationToken(zoomRoot.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected object zoom back token to advance')
    }
    expect(backResult.session.scopeId).toBe('contentObjectSelected')
    expect(backResult.session.breadcrumb).toEqual(['Select', 'Content', 'Object 1'])
    expect(backResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'VIEWTRANSFORM',
      'MOVE',
      'ROTATE',
      'SCALE',
      'ZOOM',
      'BACK',
    ])
  })

  it('routes object-selected transform and direct move through the canonical transform branch', () => {
    const context = createConsoleStagedNavigationContext([])
    const objectSession = {
      scopeId: 'contentObjectSelected' as const,
      breadcrumb: ['Select', 'Content', 'Object 1'],
      selections: {
        graphDocumentId: 'graph-document-1',
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: null,
      },
      validChoices: [],
    }

    const transformRoot = submitConsoleStagedNavigationToken(objectSession, 'transform', context)
    expect(transformRoot.kind).toBe('advance')
    if (transformRoot.kind !== 'advance') {
      throw new Error('Expected object transform token to advance')
    }
    expect(transformRoot.session.scopeId).toBe('contentObjectTransformRoot')
    expect(transformRoot.session.breadcrumb).toEqual([
      'Select',
      'Content',
      'Object 1',
      'Viewer Transform',
    ])
    expect(transformRoot.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'MOVE',
      'ROTATE',
      'SCALE',
      'BACK',
    ])

    expect(submitConsoleStagedNavigationToken(objectSession, 't', context)).toMatchObject({
      kind: 'advance',
      session: {
        scopeId: 'contentObjectTransformRoot',
      },
    })

    const directMove = submitConsoleStagedNavigationToken(objectSession, 'm', context)
    expect(directMove).toMatchObject({
      kind: 'execute',
      actionId: 'content.transform.move',
      breadcrumb: ['Select', 'Content', 'Object 1', 'Viewer Transform', 'Move'],
    })
  })

  it('routes assembly-selected zoom back to the assembly scope', () => {
    const context = createConsoleStagedNavigationContext([])
    const assemblySession = {
      scopeId: 'contentAssemblySelected' as const,
      breadcrumb: ['Select', 'Content', 'Assembly 1'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: null,
      },
      validChoices: [
        {
          canonicalToken: 'ZOOM',
          aliases: ['Z'],
          label: 'Zoom',
          kind: 'action' as const,
        },
        {
          canonicalToken: 'BACK',
          aliases: ['B'],
          label: 'Back',
          kind: 'action' as const,
        },
      ],
    }

    const zoomRoot = submitConsoleStagedNavigationToken(assemblySession, 'z', context)
    expect(zoomRoot.kind).toBe('advance')
    if (zoomRoot.kind !== 'advance') {
      throw new Error('Expected assembly zoom token to advance')
    }
    expect(zoomRoot.session.scopeId).toBe('contentAssemblyZoomRoot')

    const backResult = submitConsoleStagedNavigationToken(zoomRoot.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected assembly zoom back token to advance')
    }
    expect(backResult.session.scopeId).toBe('contentAssemblySelected')
  })

  it('routes multi-select zoom back to the multi-select scope', () => {
    const context = createConsoleStagedNavigationContext([])
    const multiSelectSession = {
      scopeId: 'multiSelectSelected' as const,
      breadcrumb: ['Multi-Select', '[Object 1, Object 2]'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: null,
        multiSelectLabels: ['Object 1', 'Object 2'],
      },
      validChoices: [
        {
          canonicalToken: 'ZOOM',
          aliases: ['Z'],
          label: 'Zoom',
          kind: 'action' as const,
        },
        {
          canonicalToken: 'BACK',
          aliases: ['B'],
          label: 'Back',
          kind: 'action' as const,
        },
      ],
    }

    const zoomRoot = submitConsoleStagedNavigationToken(multiSelectSession, 'z', context)
    expect(zoomRoot.kind).toBe('advance')
    if (zoomRoot.kind !== 'advance') {
      throw new Error('Expected multi-select zoom token to advance')
    }
    expect(zoomRoot.session.scopeId).toBe('multiSelectZoomRoot')
    expect(zoomRoot.session.breadcrumb).toEqual(['Multi-Select', '[Object 1, Object 2]', 'Zoom'])
    expect(zoomRoot.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'ALL',
      'EXTENTS',
      'PREVIOUS',
      'WINDOW',
      'OBJECT',
      'BACK',
    ])

    const backResult = submitConsoleStagedNavigationToken(zoomRoot.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected multi-select zoom back token to advance')
    }
    expect(backResult.session.scopeId).toBe('multiSelectSelected')
    expect(backResult.session.breadcrumb).toEqual(['Multi-Select', '[Object 1, Object 2]'])
    expect(backResult.validChoices.map((choice) => choice.canonicalToken)).toEqual(['ZOOM', 'BACK'])
  })

  it('routes selected reference transform through a canonical transform branch while keeping direct move as a shortcut', () => {
    const context = createConsoleStagedNavigationContext([], [
      {
        categoryId: 'shoes',
        label: 'Shoes',
        canLoadAll: true,
        items: [{ referenceId: 'shoe:shoe-1', label: 'Shoe 1', canLoadModel: false }],
      },
    ])
    const referenceSession: ConsoleStagedNavigationSession = {
      scopeId: 'referenceSelected' as const,
      breadcrumb: ['Select', 'References', 'Shoes', 'Shoe 1'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: 'shoe:shoe-1',
        referenceCategoryId: 'shoes',
        referenceCanLoadModel: false,
      },
      validChoices: [],
    }

    const transformRoot = submitConsoleStagedNavigationToken(referenceSession, 'transform', context)
    expect(transformRoot.kind).toBe('advance')
    if (transformRoot.kind !== 'advance') {
      throw new Error('Expected reference transform token to advance')
    }
    expect(transformRoot.session.scopeId).toBe('referenceTransformRoot')
    expect(transformRoot.session.breadcrumb).toEqual([
      'Select',
      'References',
      'Shoes',
      'Shoe 1',
      'Viewer Transform',
    ])

    const directMove = submitConsoleStagedNavigationToken(referenceSession, 'move', context)
    expect(directMove).toMatchObject({
      kind: 'execute',
      actionId: 'reference.transform.move',
      breadcrumb: ['Select', 'References', 'Shoes', 'Shoe 1', 'Viewer Transform', 'Move'],
    })

    expect(transformRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'Move',
      'Rotate',
      'Scale',
      'Snap',
      'Settings',
      'Back',
    ])

    const rootWorldShortcut = submitConsoleStagedNavigationToken(transformRoot.session, 'w', context)
    expect(rootWorldShortcut).toMatchObject({
      kind: 'execute',
      actionId: 'reference.transform.space.world',
      breadcrumb: [
        'Select',
        'References',
        'Shoes',
        'Shoe 1',
        'Viewer Transform',
        'Settings',
        'Space',
        'World',
      ],
    })

    const settingsRoot = submitConsoleStagedNavigationToken(transformRoot.session, 'settings', context)
    expect(settingsRoot.kind).toBe('advance')
    if (settingsRoot.kind !== 'advance') {
      throw new Error('Expected reference transform settings token to advance')
    }
    expect(settingsRoot.session.scopeId).toBe('referenceTransformSettingsRoot')
    expect(settingsRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'Space',
      'Snap',
      'Back',
    ])

    const settingsRootAlias = submitConsoleStagedNavigationToken(transformRoot.session, 'se', context)
    expect(settingsRootAlias.kind).toBe('advance')
    if (settingsRootAlias.kind !== 'advance') {
      throw new Error('Expected reference transform settings alias to advance')
    }
    expect(settingsRootAlias.session.scopeId).toBe('referenceTransformSettingsRoot')

    const directSnapRoot = submitConsoleStagedNavigationToken(transformRoot.session, 'sn', context)
    expect(directSnapRoot.kind).toBe('advance')
    if (directSnapRoot.kind !== 'advance') {
      throw new Error('Expected reference transform snap alias to advance')
    }
    expect(directSnapRoot.session.scopeId).toBe('referenceTransformSnapRoot')
    expect(directSnapRoot.session.breadcrumb).toEqual([
      'Select',
      'References',
      'Shoes',
      'Shoe 1',
      'Viewer Transform',
      'Settings',
      'Snap',
    ])
    expect(directSnapRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'Move',
      'Rotate',
      'Scale',
      'Back',
    ])

    const directSpaceRoot = submitConsoleStagedNavigationToken(transformRoot.session, 'sp', context)
    expect(directSpaceRoot.kind).toBe('advance')
    if (directSpaceRoot.kind !== 'advance') {
      throw new Error('Expected reference transform space alias to advance')
    }
    expect(directSpaceRoot.session.scopeId).toBe('referenceTransformSpaceRoot')
    expect(directSpaceRoot.session.breadcrumb).toEqual([
      'Select',
      'References',
      'Shoes',
      'Shoe 1',
      'Viewer Transform',
      'Settings',
      'Space',
    ])
    expect(directSpaceRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'Local',
      'World',
      'Back',
    ])

    const directLocalFromSettings = submitConsoleStagedNavigationToken(
      settingsRoot.session,
      'l',
      context,
    )
    expect(directLocalFromSettings).toMatchObject({
      kind: 'execute',
      actionId: 'reference.transform.space.local',
      breadcrumb: [
        'Select',
        'References',
        'Shoes',
        'Shoe 1',
        'Viewer Transform',
        'Settings',
        'Space',
        'Local',
      ],
    })

    const spaceRoot = submitConsoleStagedNavigationToken(settingsRoot.session, 'space', context)
    expect(spaceRoot.kind).toBe('advance')
    if (spaceRoot.kind !== 'advance') {
      throw new Error('Expected reference transform space token to advance')
    }
    expect(spaceRoot.session.scopeId).toBe('referenceTransformSpaceRoot')
    expect(spaceRoot.session.breadcrumb).toEqual([
      'Select',
      'References',
      'Shoes',
      'Shoe 1',
      'Viewer Transform',
      'Settings',
      'Space',
    ])
    expect(spaceRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'Local',
      'World',
      'Back',
    ])

    const snapRoot = submitConsoleStagedNavigationToken(settingsRoot.session, 'snap', context)
    expect(snapRoot.kind).toBe('advance')
    if (snapRoot.kind !== 'advance') {
      throw new Error('Expected reference transform snap token to advance')
    }
    expect(snapRoot.session.scopeId).toBe('referenceTransformSnapRoot')
    expect(snapRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'Move',
      'Rotate',
      'Scale',
      'Back',
    ])

    const moveSnapRoot = submitConsoleStagedNavigationToken(snapRoot.session, 'move', context)
    expect(moveSnapRoot.kind).toBe('advance')
    if (moveSnapRoot.kind !== 'advance') {
      throw new Error('Expected reference transform move snap token to advance')
    }
    expect(moveSnapRoot.session.scopeId).toBe('referenceTransformMoveSnapRoot')
    expect(moveSnapRoot.session.validChoices.map((choice) => choice.label)).toEqual([
      'snap:On',
      'snapXYZ:Unlock',
      'Move X',
      'Move Y',
      'Move Z',
      'Back',
    ])

    expect(submitConsoleStagedNavigationToken(moveSnapRoot.session, '10', context)).toMatchObject({
      kind: 'execute',
      actionId: 'reference.transform.snap.translate.value',
      breadcrumb: [
        'Select',
        'References',
        'Shoes',
        'Shoe 1',
        'Viewer Transform',
        'Settings',
        'Snap',
        'Move',
        '10',
      ],
    })

    const commitShell = submitConsoleStagedNavigationToken(transformRoot.session, 'committransform', context)
    expect(commitShell.kind).toBe('invalid')

    const committedShellContext = createConsoleStagedNavigationContext(
      [],
      [
        {
          categoryId: 'shoes',
          label: 'Shoes',
          canLoadAll: false,
          items: [{ referenceId: 'shoe:shoe-1', label: 'Shoe 1', canLoadModel: false }],
        },
      ],
      {
        hasSelection: false,
        hasPrevious: false,
        preferredTool: 'LINE',
      },
      {
        'shoe:shoe-1': {
          activeSessionId: 'reference-transform-session-1',
          activeSessionCommittedEntryCount: 1,
        },
      },
    )
    const transformRootWithCommittedEntry = submitConsoleStagedNavigationToken(
      referenceSession,
      'transform',
      committedShellContext,
    )
    expect(transformRootWithCommittedEntry.kind).toBe('advance')
    if (transformRootWithCommittedEntry.kind !== 'advance') {
      throw new Error('Expected reference transform token to advance after committed shell entry')
    }
    expect(transformRootWithCommittedEntry.session.validChoices.map((choice) => choice.label)).toEqual([
      'CommitTransform',
      'DeleteLatest',
      'Move',
      'Rotate',
      'Scale',
      'Snap',
      'Settings',
    ])

    const deleteLatest = submitConsoleStagedNavigationToken(
      transformRootWithCommittedEntry.session,
      'delete',
      committedShellContext,
    )
    expect(deleteLatest).toMatchObject({
      kind: 'execute',
      actionId: 'reference.transform.deleteLatest',
      breadcrumb: ['Select', 'References', 'Shoes', 'Shoe 1', 'Viewer Transform', 'DeleteLatest'],
    })

    const committedShell = submitConsoleStagedNavigationToken(
      transformRootWithCommittedEntry.session,
      'committransform',
      committedShellContext,
    )
    expect(committedShell).toMatchObject({
      kind: 'execute',
      actionId: 'reference.transform.commitShell',
      breadcrumb: ['Select', 'References', 'Shoes', 'Shoe 1', 'Viewer Transform', 'CommitTransform'],
    })
  })

  it('shows only the currently available snap enable action at transform snap mode roots', () => {
    const disabledContext = createConsoleStagedNavigationContext(
      [],
      [
        {
          categoryId: 'shoes',
          label: 'Shoes',
          canLoadAll: false,
          items: [{ referenceId: 'shoe:shoe-1', label: 'Shoe 1', canLoadModel: false }],
        },
      ],
      {
        hasSelection: false,
        hasPrevious: false,
        preferredTool: 'LINE',
      },
      {},
      {
        'shoe:shoe-1': {
          translate: true,
        },
      },
      {
        'shoe:shoe-1': {
          translate: false,
        },
      },
    )

    const referenceSession: ConsoleStagedNavigationSession = {
      scopeId: 'referenceSelected',
      breadcrumb: ['Select', 'References', 'Shoes', 'Shoe 1'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: 'shoe:shoe-1',
        referenceCategoryId: 'shoes',
        referenceCanLoadModel: false,
      },
      validChoices: [],
    }

    const transformRoot = submitConsoleStagedNavigationToken(referenceSession, 'transform', disabledContext)
    expect(transformRoot.kind).toBe('advance')
    if (transformRoot.kind !== 'advance') {
      throw new Error('Expected reference transform token to advance')
    }

    const settingsRoot = submitConsoleStagedNavigationToken(transformRoot.session, 'settings', disabledContext)
    expect(settingsRoot.kind).toBe('advance')
    if (settingsRoot.kind !== 'advance') {
      throw new Error('Expected settings token to advance')
    }

    const snapRoot = submitConsoleStagedNavigationToken(settingsRoot.session, 'snap', disabledContext)
    expect(snapRoot.kind).toBe('advance')
    if (snapRoot.kind !== 'advance') {
      throw new Error('Expected snap token to advance')
    }

    const moveSnapRoot = submitConsoleStagedNavigationToken(snapRoot.session, 'move', disabledContext)
    expect(moveSnapRoot.kind).toBe('advance')
    if (moveSnapRoot.kind !== 'advance') {
      throw new Error('Expected move snap token to advance')
    }
    expect(moveSnapRoot.session.validChoices.map((choice) => choice.label)).toContain('snap:On')
    expect(moveSnapRoot.session.validChoices.map((choice) => choice.label)).not.toContain('snap:Off')

    const enabledContext = createConsoleStagedNavigationContext(
      [],
      [
        {
          categoryId: 'shoes',
          label: 'Shoes',
          canLoadAll: false,
          items: [{ referenceId: 'shoe:shoe-1', label: 'Shoe 1', canLoadModel: false }],
        },
      ],
      {
        hasSelection: false,
        hasPrevious: false,
        preferredTool: 'LINE',
      },
      {},
      {
        'shoe:shoe-1': {
          translate: true,
        },
      },
      {
        'shoe:shoe-1': {
          translate: true,
        },
      },
    )

    const enabledTransformRoot = submitConsoleStagedNavigationToken(
      referenceSession,
      'transform',
      enabledContext,
    )
    expect(enabledTransformRoot.kind).toBe('advance')
    if (enabledTransformRoot.kind !== 'advance') {
      throw new Error('Expected enabled transform token to advance')
    }

    const enabledSettingsRoot = submitConsoleStagedNavigationToken(
      enabledTransformRoot.session,
      'settings',
      enabledContext,
    )
    expect(enabledSettingsRoot.kind).toBe('advance')
    if (enabledSettingsRoot.kind !== 'advance') {
      throw new Error('Expected enabled settings token to advance')
    }

    const enabledSnapRoot = submitConsoleStagedNavigationToken(
      enabledSettingsRoot.session,
      'snap',
      enabledContext,
    )
    expect(enabledSnapRoot.kind).toBe('advance')
    if (enabledSnapRoot.kind !== 'advance') {
      throw new Error('Expected enabled snap token to advance')
    }

    const enabledMoveSnapRoot = submitConsoleStagedNavigationToken(
      enabledSnapRoot.session,
      'move',
      enabledContext,
    )
    expect(enabledMoveSnapRoot.kind).toBe('advance')
    if (enabledMoveSnapRoot.kind !== 'advance') {
      throw new Error('Expected enabled move snap token to advance')
    }
    expect(enabledMoveSnapRoot.session.validChoices.map((choice) => choice.label)).toContain('snap:Off')
    expect(enabledMoveSnapRoot.session.validChoices.map((choice) => choice.label)).not.toContain('snap:On')
  })

  it('routes reference-selected zoom back to the reference scope', () => {
    const context = createConsoleStagedNavigationContext([])
    const referenceSession: ConsoleStagedNavigationSession = {
      scopeId: 'referenceSelected' as const,
      breadcrumb: ['Select', 'Reference', 'Shoe 1'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: 'shoe:shoe-1',
        referenceCategoryId: null,
        referenceCanLoadModel: true,
      },
      validChoices: [
        {
          canonicalToken: 'LOAD MODEL',
          aliases: ['LOADMODEL', 'LM'],
          label: 'Load Model',
          kind: 'action',
        },
        {
          canonicalToken: 'ZOOM',
          aliases: ['Z'],
          label: 'Zoom',
          kind: 'action',
        },
        {
          canonicalToken: 'BACK',
          aliases: ['B'],
          label: 'Back',
          kind: 'action',
        },
      ],
    }

    const zoomRoot = submitConsoleStagedNavigationToken(referenceSession, 'z', context)
    expect(zoomRoot.kind).toBe('advance')
    if (zoomRoot.kind !== 'advance') {
      throw new Error('Expected reference zoom token to advance')
    }
    expect(zoomRoot.session.scopeId).toBe('referenceZoomRoot')
    expect(zoomRoot.session.breadcrumb).toEqual(['Select', 'Reference', 'Shoe 1', 'Zoom'])
    expect(zoomRoot.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'ALL',
      'EXTENTS',
      'PREVIOUS',
      'WINDOW',
      'OBJECT',
      'BACK',
    ])

    const backResult = submitConsoleStagedNavigationToken(zoomRoot.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected reference zoom back token to advance')
    }
    expect(backResult.session.scopeId).toBe('referenceSelected')
    expect(backResult.session.breadcrumb).toEqual(['Select', 'Reference', 'Shoe 1'])
    expect(backResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'LOAD MODEL',
      'ZOOM',
      'BACK',
    ])
  })

  it('routes references-root zoom back to the references scope', () => {
    const context = createConsoleStagedNavigationContext(
      [],
      [
        {
          categoryId: 'footpads',
          label: 'Footpads',
          canLoadAll: true,
          items: [
            {
              referenceId: 'footpad:pubpad-full-assembly',
              label: 'PubPad Full Assembly',
              canLoadModel: true,
            },
          ],
        },
      ],
      {
        hasSelection: false,
        hasPrevious: false,
        preferredTool: null,
      },
    )
    const referencesSession = {
      scopeId: 'referencesSelected' as const,
      breadcrumb: ['Select', 'References'],
      selections: {
        graphDocumentId: null,
        selectedNodeId: null,
        sketchNodeId: null,
        referenceId: null,
        referenceZoomIds: ['footpad:pubpad-full-assembly'],
      },
      validChoices: [
        {
          canonicalToken: 'ZOOM',
          aliases: ['Z'],
          label: 'Zoom',
          kind: 'action' as const,
        },
        {
          canonicalToken: 'BACK',
          aliases: ['B'],
          label: 'Back',
          kind: 'action' as const,
        },
      ],
    }

    const zoomRoot = submitConsoleStagedNavigationToken(referencesSession, 'z', context)
    expect(zoomRoot.kind).toBe('advance')
    if (zoomRoot.kind !== 'advance') {
      throw new Error('Expected references zoom token to advance')
    }
    expect(zoomRoot.session.scopeId).toBe('referencesZoomRoot')

    const backResult = submitConsoleStagedNavigationToken(zoomRoot.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected references zoom back token to advance')
    }
    expect(backResult.session.scopeId).toBe('referencesSelected')
  })

  it('keeps radio reachable from local sketch draw staged scopes', () => {
    const context = createConsoleStagedNavigationContext([], [], {
      hasSelection: false,
      hasPrevious: false,
      preferredTool: 'LINE',
    })

    const sketchDrawRoot = createSketchDrawRootSession(context)
    const radioResult = submitConsoleStagedNavigationToken(sketchDrawRoot, 'r', context)

    expect(radioResult.kind).toBe('advance')
    if (radioResult.kind !== 'advance') {
      throw new Error('Expected radio to remain reachable from sketch draw root')
    }
    expect(radioResult.session.scopeId).toBe('radioRoot')
  })

  it('accepts both graph and g as the same staged root token', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const graphResult = submitConsoleStagedNavigationToken(null, 'graph', context)
    const aliasResult = submitConsoleStagedNavigationToken(null, 'g', context)

    expect(graphResult.kind).toBe('advance')
    expect(aliasResult.kind).toBe('advance')
    if (graphResult.kind !== 'advance' || aliasResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    expect(graphResult.breadcrumb).toEqual(['Select', 'Graph'])
    expect(aliasResult.breadcrumb).toEqual(['Select', 'Graph'])
    expect(graphResult.autoSelections).toEqual([])
    expect(aliasResult.autoSelections).toEqual([])
    expect(graphResult.validChoices.map((choice) => choice.canonicalToken)).toEqual(['1', '2', 'LIST'])
  })

  it('accepts both radio and r as the same staged root token', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const radioResult = submitConsoleStagedNavigationToken(null, 'radio', context)
    const aliasResult = submitConsoleStagedNavigationToken(null, 'r', context)

    expect(radioResult.kind).toBe('advance')
    expect(aliasResult.kind).toBe('advance')
    if (radioResult.kind !== 'advance' || aliasResult.kind !== 'advance') {
      throw new Error('Expected radio root token to advance')
    }

    expect(radioResult.session.scopeId).toBe('radioRoot')
    expect(aliasResult.session.scopeId).toBe('radioRoot')
    expect(radioResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'ON',
      'OFF',
      'URL',
      'SAMPLEBURSTTIME',
      'RANDOMIZESAMPLETIMES',
      'OPENTOOLBAR',
      'CLOSETOOLBAR',
    ])
  })

  it('accepts the cleaned radio aliases o, off, u, sb, rs, ot, and ct', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'r', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected radio root token to advance')
    }

    expect(submitConsoleStagedNavigationToken(rootResult.session, 'o', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.on',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'off', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.off',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'u', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.url',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'sb', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.sampleBurstTime',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'rs', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.randomizeSampleTimes',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'ot', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.openToolbar',
    })
    expect(submitConsoleStagedNavigationToken(rootResult.session, 'ct', context)).toMatchObject({
      kind: 'execute',
      actionId: 'radio.closeToolbar',
    })
  })

  it('auto-selects the only graph when graph root has one real entity choice', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
    ])

    const result = submitConsoleStagedNavigationToken(null, 'g', context)
    expect(result.kind).toBe('advance')
    if (result.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    expect(result.session.scopeId).toBe('graphSelected')
    expect(result.breadcrumb).toEqual(['Select', 'Graph', 'graph_[1]'])
    expect(result.autoSelections.map((choice) => choice.label)).toEqual(['graph_[1]'])
    expect(result.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'SKETCH',
      'EXTRUDE',
      'OUTPUT PREVIEW',
      'FOCUS NODE',
      'ZOOM',
      'COLLAPSED',
      'ESSENTIALS',
      'EXPANDED',
      'REFERENCES',
      'OPEN',
      'BUILD',
      'BACK',
    ])
  })

  it('resolves numeric graph selections against deterministic visible order', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-7', name: 'Graph 7' },
      { graphDocumentId: 'graph-document-3', name: 'Graph 3' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '2', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected numeric graph token to advance')
    }

    expect(graphChoiceResult.breadcrumb).toEqual(['Select', 'Graph', 'graph_[2]'])
    expect(graphChoiceResult.selections.graphDocumentId).toBe('graph-document-3')
    expect(graphChoiceResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'SKETCH',
      'EXTRUDE',
      'OUTPUT PREVIEW',
      'FOCUS NODE',
      'ZOOM',
      'COLLAPSED',
      'ESSENTIALS',
      'EXPANDED',
      'REFERENCES',
      'OPEN',
      'BUILD',
      'BACK',
    ])
  })

  it('auto-selects the only sketch after entering sketch scope', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const sketchResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'S', context)
    expect(sketchResult.kind).toBe('advance')
    if (sketchResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }

    expect(sketchResult.session.scopeId).toBe('graphSketchSelected')
    expect(sketchResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Sketch',
      'sketch_[1]',
    ])
    expect(sketchResult.selections.sketchNodeId).toBe('node-sketch-1')
    expect(sketchResult.autoSelections.map((choice) => choice.label)).toEqual(['sketch_[1]'])
    expect(sketchResult.validChoices.map((choice) => choice.label)).toEqual([
      'Sketch Plane',
      'Sketch Draw',
      'Delete',
      'Back',
    ])
  })

  it('keeps the current staged session when an invalid token is submitted', () => {
    const context = createConsoleStagedNavigationContext([
      { graphDocumentId: 'graph-document-1', name: 'Graph 1' },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected numeric graph token to advance')
    }

    const invalidResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'Q', context)
    expect(invalidResult.kind).toBe('invalid')
    if (invalidResult.kind !== 'invalid') {
      throw new Error('Expected invalid result')
    }

    expect(invalidResult.session?.breadcrumb).toEqual(['Select', 'Graph', 'graph_[1]'])
    expect(invalidResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'SKETCH',
      'EXTRUDE',
      'OUTPUT PREVIEW',
      'FOCUS NODE',
      'ZOOM',
      'COLLAPSED',
      'ESSENTIALS',
      'EXPANDED',
      'REFERENCES',
      'OPEN',
      'BUILD',
      'BACK',
    ])
  })

  it('uses b to return to the parent graph scope and keeps build available by its full token', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const buildResult = submitConsoleStagedNavigationToken(
      graphChoiceResult.session,
      'build',
      context,
    )
    expect(buildResult.kind).toBe('execute')
    if (buildResult.kind !== 'execute') {
      throw new Error('Expected build to stay available in graph scope')
    }
    expect(buildResult.actionId).toBe('graph.build')

    const backResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'b', context)
    expect(backResult.kind).toBe('advance')
    if (backResult.kind !== 'advance') {
      throw new Error('Expected b to return to graph root')
    }

    expect(backResult.session.scopeId).toBe('graphRoot')
    expect(backResult.breadcrumb).toEqual(['Select', 'Graph'])
  })

  it('uses b to return directly to graph scope from a selected sketch node', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }, { nodeId: 'node-sketch-2' }],
      },
      {
        graphDocumentId: 'graph-document-2',
        name: 'Graph 2',
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const sketchListResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'S', context)
    expect(sketchListResult.kind).toBe('advance')
    if (sketchListResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }

    const selectedSketchResult = submitConsoleStagedNavigationToken(sketchListResult.session, '1', context)
    expect(selectedSketchResult.kind).toBe('advance')
    if (selectedSketchResult.kind !== 'advance') {
      throw new Error('Expected sketch selection to advance')
    }

    const backToGraph = submitConsoleStagedNavigationToken(selectedSketchResult.session, 'b', context)
    expect(backToGraph.kind).toBe('advance')
    if (backToGraph.kind !== 'advance') {
      throw new Error('Expected b to go back to graph selected')
    }
    expect(backToGraph.session.scopeId).toBe('graphSelected')
    expect(backToGraph.breadcrumb).toEqual(['Select', 'Graph', 'graph_[1]'])
  })

  it('auto-selects the only extrude after entering extrude scope', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        extrudeOptions: [{ nodeId: 'node-extrude-1' }],
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const extrudeResult = submitConsoleStagedNavigationToken(rootResult.session, 'E', context)
    expect(extrudeResult.kind).toBe('advance')
    if (extrudeResult.kind !== 'advance') {
      throw new Error('Expected extrude token to advance')
    }

    expect(extrudeResult.session.scopeId).toBe('graphExtrudeSelected')
    expect(extrudeResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Extrude',
      'extrude_[1]',
    ])
    expect(extrudeResult.selections.selectedNodeId).toBe('node-extrude-1')
    expect(extrudeResult.selections.sketchNodeId).toBeNull()
    expect(extrudeResult.validChoices.map((choice) => choice.label)).toEqual(['Delete', 'Back'])
  })

  it('lists all nodes from focus node scope and can focus a generic node', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        allNodeOptions: [
          { nodeId: 'node-part-1', label: 'node_[1] Cube' },
          { nodeId: 'node-sketch-1', label: 'node_[2] Sketch' },
        ],
        sketchOptions: [{ nodeId: 'node-sketch-1', label: 'sketch_[1]' }],
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const focusNodeResult = submitConsoleStagedNavigationToken(rootResult.session, 'FN', context)
    expect(focusNodeResult.kind).toBe('advance')
    if (focusNodeResult.kind !== 'advance') {
      throw new Error('Expected focus node token to advance')
    }

    expect(focusNodeResult.session.scopeId).toBe('graphNodeList')
    expect(focusNodeResult.validChoices.map((choice) => choice.label)).toEqual([
      'node_[1] Cube',
      'node_[2] Sketch',
      'Back',
    ])

    const selectedNodeResult = submitConsoleStagedNavigationToken(
      focusNodeResult.session,
      '1',
      context,
    )
    expect(selectedNodeResult.kind).toBe('advance')
    if (selectedNodeResult.kind !== 'advance') {
      throw new Error('Expected focus node selection to advance')
    }

    expect(selectedNodeResult.session.scopeId).toBe('graphNodeSelected')
    expect(selectedNodeResult.selections.selectedNodeId).toBe('node-part-1')
    expect(selectedNodeResult.validChoices.map((choice) => choice.label)).toEqual([
      'Delete',
      'Back',
    ])
  })

  it('returns execute metadata for graph editor modes, sketch plane, sketch draw, and graph action nodes', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
      { graphDocumentId: 'graph-document-2', name: 'Graph 2' },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'G', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const graphChoiceResult = submitConsoleStagedNavigationToken(rootResult.session, '1', context)
    expect(graphChoiceResult.kind).toBe('advance')
    if (graphChoiceResult.kind !== 'advance') {
      throw new Error('Expected graph token to advance')
    }

    const buildResult = submitConsoleStagedNavigationToken(
      graphChoiceResult.session,
      'build',
      context,
    )
    expect(buildResult.kind).toBe('execute')
    if (buildResult.kind !== 'execute') {
      throw new Error('Expected build token to execute')
    }
    expect(buildResult.actionId).toBe('graph.build')

    const essentialsResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'ES', context)
    expect(essentialsResult.kind).toBe('execute')
    if (essentialsResult.kind !== 'execute') {
      throw new Error('Expected essentials token to execute')
    }
    expect(essentialsResult.actionId).toBe('graph.editor.essentials')

    const sketchResult = submitConsoleStagedNavigationToken(graphChoiceResult.session, 'S', context)
    expect(sketchResult.kind).toBe('advance')
    if (sketchResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }

    expect(sketchResult.validChoices.map((choice) => choice.label)).toEqual([
      'Sketch Plane',
      'Sketch Draw',
      'Delete',
      'Back',
    ])

    const planeResult = submitConsoleStagedNavigationToken(sketchResult.session, 'SP', context)
    expect(planeResult.kind).toBe('execute')
    if (planeResult.kind !== 'execute') {
      throw new Error('Expected sketch plane token to execute')
    }
    expect(planeResult.actionId).toBe('sketch.plane')
    expect(planeResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Sketch',
      'sketch_[1]',
      'Sketch Plane',
    ])

    const drawResult = submitConsoleStagedNavigationToken(sketchResult.session, 'SD', context)
    expect(drawResult.kind).toBe('execute')
    if (drawResult.kind !== 'execute') {
      throw new Error('Expected sketch draw token to execute')
    }
    expect(drawResult.actionId).toBe('sketch.draw')
    expect(drawResult.breadcrumb).toEqual([
      'Select',
      'Graph',
      'graph_[1]',
      'Sketch',
      'sketch_[1]',
      'Sketch Draw',
    ])
    expect(drawResult.selections.graphDocumentId).toBe('graph-document-1')
    expect(drawResult.selections.sketchNodeId).toBe('node-sketch-1')
  })

  it('supports explicit cancellation/reset of the staged session', () => {
    const cancelledResult = cancelConsoleStagedNavigationSession()

    expect(cancelledResult.kind).toBe('cancelled')
    expect(cancelledResult.session).toBeNull()
    expect(cancelledResult.breadcrumb).toEqual([])
    expect(cancelledResult.validChoices.map((choice) => choice.canonicalToken)).toEqual([
      'GRAPH',
      'CONTENT',
      'REFERENCES',
      'CAMERA',
      'RADIO',
      'ZOOM',
      'PAN',
      'ORBIT',
    ])
  })

  it('exposes delete as a node-local action for selected node scopes', () => {
    const context = createConsoleStagedNavigationContext([
      {
        graphDocumentId: 'graph-document-1',
        name: 'Graph 1',
        extrudeOptions: [{ nodeId: 'node-extrude-1' }],
        outputPreviewOptions: [{ nodeId: 'node-output-1' }],
        sketchOptions: [{ nodeId: 'node-sketch-1' }],
      },
    ])

    const rootResult = submitConsoleStagedNavigationToken(null, 'g', context)
    expect(rootResult.kind).toBe('advance')
    if (rootResult.kind !== 'advance') {
      throw new Error('Expected graph root token to advance')
    }

    const sketchResult = submitConsoleStagedNavigationToken(rootResult.session, 's', context)
    expect(sketchResult.kind).toBe('advance')
    if (sketchResult.kind !== 'advance') {
      throw new Error('Expected sketch token to advance')
    }
    const sketchDeleteResult = submitConsoleStagedNavigationToken(sketchResult.session, 'd', context)
    expect(sketchDeleteResult.kind).toBe('execute')
    if (sketchDeleteResult.kind !== 'execute') {
      throw new Error('Expected sketch delete token to execute')
    }
    expect(sketchDeleteResult.actionId).toBe('node.delete')

    const extrudeResult = submitConsoleStagedNavigationToken(rootResult.session, 'e', context)
    expect(extrudeResult.kind).toBe('advance')
    if (extrudeResult.kind !== 'advance') {
      throw new Error('Expected extrude token to advance')
    }
    const extrudeDeleteResult = submitConsoleStagedNavigationToken(extrudeResult.session, 'd', context)
    expect(extrudeDeleteResult.kind).toBe('execute')
    if (extrudeDeleteResult.kind !== 'execute') {
      throw new Error('Expected extrude delete token to execute')
    }
    expect(extrudeDeleteResult.actionId).toBe('node.delete')
  })
})
