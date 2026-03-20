import { describe, expect, it } from 'vitest'
import { resolveConsoleRadioCommandIdentity } from './radioCommandIdentity'

describe('radioCommandIdentity', () => {
  it('resolves root staged choices to canonical semantic identities', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedAdvance',
        activeScopeId: null,
        matchedCanonicalToken: 'GRAPH',
        matchedLabel: 'Graph',
      }),
    ).toBe('Console.Root.Graph')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedAdvance',
        activeScopeId: null,
        matchedCanonicalToken: 'RADIO',
        matchedLabel: 'Radio',
      }),
    ).toBe('Console.Root.Radio')
  })

  it('resolves radio staged actions to canonical semantic identities', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'radioRoot',
        actionId: 'radio.on',
      }),
    ).toBe('Console.Radio.On')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'radioRoot',
        actionId: 'radio.off',
      }),
    ).toBe('Console.Radio.Off')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'radioRoot',
        actionId: 'radio.url',
      }),
    ).toBe('Console.Radio.Url')
  })

  it('resolves staged highlighted choices onto the same semantic identity family as accept', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedChoice',
        activeScopeId: 'radioRoot',
        matchedCanonicalToken: 'ON',
        matchedLabel: 'On',
      }),
    ).toBe('Console.Radio.On')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedChoice',
        activeScopeId: 'graphSelected',
        matchedCanonicalToken: 'SKETCH',
        matchedLabel: 'Sketch',
      }),
    ).toBe('Console.Graph.Sketch')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedChoice',
        activeScopeId: 'graphSketchSelected',
        matchedCanonicalToken: 'SKETCH PLANE',
        matchedLabel: 'Sketch Plane',
      }),
    ).toBe('Console.Graph.Sketch.Plane')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedChoice',
        activeScopeId: 'graphSelected',
        matchedCanonicalToken: 'COLLAPSED',
        matchedLabel: 'Collapsed',
      }),
    ).toBe('Console.Graph.Editor.Collapsed')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedChoice',
        activeScopeId: 'graphSelected',
        matchedCanonicalToken: 'BUILD',
        matchedLabel: 'Build',
      }),
    ).toBe('Console.Graph.Build')
  })

  it('resolves prompt submits without depending on the submitted value text', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'promptSubmit',
        promptKind: 'radio.url',
      }),
    ).toBe('Console.Radio.Url.PromptSubmit')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'promptSubmit',
        promptKind: 'radio.sampleBurstTime',
      }),
    ).toBe('Console.Radio.SampleBurstTime.PromptSubmit')
  })

  it('resolves sketch plane feature assist choices and submits to canonical semantic identities', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'featureAssistChoice',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Plane'],
        matchedCanonicalToken: 'XZ',
        matchedLabel: 'XZ',
      }),
    ).toBe('Console.Graph.Sketch.Plane.XZ')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'featureAssistSubmit',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Move'],
        submittedToken: '1.0,2.0,3.0',
        matchedCanonicalToken: null,
        matchedLabel: null,
      }),
    ).toBe('Console.Graph.Sketch.Plane.Move.Vector')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'featureAssistSubmit',
        breadcrumb: ['Graph', 'Sketch', 'Sketch Plane', 'Rotate', 'Snap'],
        submittedToken: '15',
        matchedCanonicalToken: null,
        matchedLabel: null,
      }),
    ).toBe('Console.Graph.Sketch.Plane.Rotate.Snap.Value')
  })

  it('resolves graph commands and node deletes to canonical semantic identities', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'graphSelected',
        actionId: 'graph.build',
      }),
    ).toBe('Console.Graph.Build')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'graphSketchSelected',
        actionId: 'node.delete',
      }),
    ).toBe('Console.Graph.Sketch.Delete')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'stagedExecute',
        activeScopeId: 'graphNodeSelected',
        actionId: 'node.delete',
      }),
    ).toBe('Console.Graph.FocusNode.Delete')
  })

  it('resolves flat command aliases through the parsed semantic command name', () => {
    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'flatCommand',
        commandName: 'rotate',
      }),
    ).toBe('Console.Command.Rotate')

    expect(
      resolveConsoleRadioCommandIdentity({
        kind: 'flatCommand',
        commandName: null,
      }),
    ).toBeNull()
  })
})
