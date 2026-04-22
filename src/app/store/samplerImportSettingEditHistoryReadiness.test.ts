import { afterEach, describe, expect, it } from 'vitest'
import { useConsoleStore } from '../console/useConsoleStore'
import { editHistoryStore } from './editHistoryStore'
import {
  DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
  resetAudioSamplerStore,
  useAudioSamplerStore,
} from './audioSamplerStore'
import { useAppStore } from './useAppStore'

const resetStores = (): void => {
  editHistoryStore.clear()
  resetAudioSamplerStore()
  useAppStore.setState(useAppStore.getInitialState(), true)
  useConsoleStore.setState(useConsoleStore.getInitialState(), true)
}

const seedRedoEntry = (): void => {
  editHistoryStore.commitEntry({
    entryId: 'sampler-import-readiness-seed',
    label: 'Seed redo',
    source: {
      surface: 'test',
      sourceId: 'sampler-import-readiness',
      sourceLabel: 'Sampler/import readiness',
    },
    undo: () => {},
    redo: () => {},
  })

  expect(editHistoryStore.undo()?.label).toBe('Seed redo')
  expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  expect(editHistoryStore.getRedoEntries()).toHaveLength(1)
}

const expectRedoPreservedWithNoEntries = (): void => {
  expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  expect(editHistoryStore.getRedoEntries()).toHaveLength(1)
  expect(editHistoryStore.canRedo()).toBe(true)
}

const appendStagedImportFile = (options: {
  fileName: string
  fileType: 'glb' | 'obj' | 'step'
  objectUrl: string
}): string => {
  useAppStore.getState().appendStagedImportDraftFiles([options])
  const stagedFileId =
    useAppStore.getState().referenceWorkspace.stagedImportDraft?.stagedFiles.at(-1)
      ?.stagedFileId ?? null
  expect(stagedFileId).toBeTruthy()
  return stagedFileId!
}

const markStagedFileReadyWithParts = (stagedFileId: string): void => {
  useAppStore.getState().resolveStagedImportFileStructureInspection(stagedFileId, {
    hasMultipleObjects: true,
    hasHierarchy: true,
    hasParts: true,
    labels: ['Gear housing', 'Shaft'],
    partRows: [
      {
        partKey: 'part:gear-housing',
        label: 'Gear housing',
        sourceMeshIndex: 0,
      },
      {
        partKey: 'part:shaft',
        label: 'Shaft',
        sourceMeshIndex: 1,
      },
    ],
    hierarchyRows: [
      {
        label: 'Assembly',
        children: [{ label: 'Gear housing', children: [] }],
      },
    ],
  })
}

const findImportedReferenceIdByAssetPath = (assetPath: string): string | null => {
  const state = useAppStore.getState()
  return (
    state.referenceWorkspace.importedReferenceOrder.find(
      (referenceId) =>
        state.referenceWorkspace.importedReferencesById[referenceId]?.assetPath === assetPath,
    ) ?? null
  )
}

describe('sampler/import setting edit-history readiness', () => {
  afterEach(() => {
    resetStores()
  })

  it('keeps representative raw sampler and radio actions history-free and redo-preserving', () => {
    resetStores()
    seedRedoEntry()

    const firstStepId = useAudioSamplerStore.getState().samplerSteps[0]?.id ?? ''
    const secondStepId = useAudioSamplerStore.getState().samplerSteps[1]?.id ?? ''

    useAudioSamplerStore.getState().setSamplerStepCount(8)
    useAudioSamplerStore.getState().setSamplerBpm(142)
    useAudioSamplerStore.getState().toggleSamplerStepEnabled(firstStepId)
    useAudioSamplerStore.getState().toggleSamplerStepLocked(firstStepId)
    useAudioSamplerStore.getState().setSamplerStepCueRatio(secondStepId, 0.625)
    useAudioSamplerStore.getState().setSamplerStepPlaybackShape(secondStepId, {
      fadeInSec: 0.02,
      fadeOutSec: 0.04,
      startScoochSec: 0.03,
      endScoochSec: 0.05,
    })
    useAudioSamplerStore.getState().setSamplerNoteRepeatEnabled(true)
    useAudioSamplerStore.getState().setSamplerNoteRepeatCount(4)
    useAudioSamplerStore.getState().setSamplerNoteRepeatRate(8)
    useAudioSamplerStore.getState().setRadioUrl('https://soundcloud.com/example/raw-settings')
    useAudioSamplerStore.getState().setRadioTransportState({
      currentTimeSec: 12,
      durationSec: 90,
      isSeekable: true,
      isPlaying: true,
    })
    useAudioSamplerStore.getState().setRadioWaveformState({
      kind: 'limited',
      sourceId: 'radio-soundcloud:raw-settings',
      sourceKind: 'soundcloud-widget',
      durationSec: 90,
      sampleCount: DEFAULT_RADIO_WAVEFORM_SAMPLE_COUNT,
      samples: [],
      message: 'Waveform limited in readiness proof.',
      lastResolvedAt: 101,
    })
    const seekRequest = useAudioSamplerStore.getState().requestRadioSeek(32.5)
    const reloadRequestId = useAudioSamplerStore.getState().requestRadioReload()
    const previewRequest = useAudioSamplerStore.getState().requestSamplerStepPreview(secondStepId)

    const state = useAudioSamplerStore.getState()
    expect(state.samplerStepCount).toBe(8)
    expect(state.samplerBpm).toBe(142)
    expect(state.samplerSteps[0]).toMatchObject({
      id: firstStepId,
      enabled: false,
      isLocked: true,
    })
    expect(state.samplerSteps[1]).toMatchObject({
      id: secondStepId,
      cueRatio: 0.625,
      fadeInSec: 0.02,
      fadeOutSec: 0.04,
      startScoochSec: 0.03,
      endScoochSec: 0.05,
    })
    expect(state.samplerNoteRepeat).toEqual({
      enabled: true,
      count: 4,
      rate: 8,
    })
    expect(state.sourceUrl).toBe('https://soundcloud.com/example/raw-settings')
    expect(state.isRadioEnabled).toBe(true)
    expect(state.radioTransport).toEqual({
      currentTimeSec: 12,
      durationSec: 90,
      isSeekable: true,
      isPlaying: true,
    })
    expect(state.radioWaveform).toMatchObject({
      kind: 'limited',
      sourceId: 'radio-soundcloud:raw-settings',
      sourceKind: 'soundcloud-widget',
    })
    expect(seekRequest).toMatchObject({ requestId: 1, timeSec: 32.5 })
    expect(reloadRequestId).toBe(1)
    expect(previewRequest).toMatchObject({
      requestId: 1,
      stepId: secondStepId,
      cueRatio: 0.625,
    })
    expectRedoPreservedWithNoEntries()
  })

  it('keeps raw staged import draft settings history-free and redo-preserving before accept', () => {
    resetStores()
    seedRedoEntry()

    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    const stagedFileId = appendStagedImportFile({
      fileName: 'raw-settings.glb',
      fileType: 'glb',
      objectUrl: 'blob:raw-staged-settings',
    })
    markStagedFileReadyWithParts(stagedFileId)

    useAppStore.getState().setStagedImportFileMode(stagedFileId, 'multiple-objects-in-component')
    useAppStore.getState().setStagedImportFileUpAxis(stagedFileId, 'y-up')
    useAppStore.getState().setStagedImportFileScaleAlignment(stagedFileId, 'centimeters')
    useAppStore.getState().setStagedImportFileScaleMultiplier(stagedFileId, 2.5)
    useAppStore.getState().setStagedImportPutAcceptedInNewAssembly(true)
    const previewAssemblyId = useAppStore.getState().createStagedImportPreviewAssembly()

    const failedFileId = appendStagedImportFile({
      fileName: 'failed-preview.step',
      fileType: 'step',
      objectUrl: 'blob:failed-preview',
    })
    useAppStore.getState().beginStagedImportFileStructureInspection(failedFileId)
    useAppStore
      .getState()
      .failStagedImportFileStructureInspection(failedFileId, 'Could not inspect preview.')

    const draft = useAppStore.getState().referenceWorkspace.stagedImportDraft
    expect(draft).not.toBeNull()
    expect(draft?.putAcceptedImportsInNewAssembly).toBe(true)
    expect(draft?.previewOrganization.nodesById[previewAssemblyId ?? '']).toMatchObject({
      nodeKind: 'assembly',
      sourceKind: 'authored',
    })
    expect(draft?.stagedFiles.find((file) => file.stagedFileId === stagedFileId)).toMatchObject({
      importMode: 'multiple-objects-in-component',
      upAxis: 'y-up',
      scaleAlignment: 'custom',
      scaleMultiplier: 2.5,
    })
    expect(draft?.stagedFiles.find((file) => file.stagedFileId === failedFileId)).toMatchObject({
      structureInspection: {
        status: 'error',
        summary: null,
        errorMessage: 'Could not inspect preview.',
      },
    })
    expectRedoPreservedWithNoEntries()
  })

  it('uses the Gen 1 Accept Import entry for durable staged import setting output', () => {
    resetStores()
    useAppStore.getState().openStagedImportDraft({
      parentAssemblyId: null,
      parentComponentId: null,
    })
    const stagedFileId = appendStagedImportFile({
      fileName: 'accepted-settings.step',
      fileType: 'step',
      objectUrl: 'blob:accepted-staged-settings',
    })
    useAppStore.getState().resolveStagedImportFileStructureInspection(stagedFileId, {
      hasMultipleObjects: false,
      hasHierarchy: false,
      hasParts: false,
      labels: [],
      partRows: [],
    })
    useAppStore.getState().setStagedImportFileUpAxis(stagedFileId, 'y-up')
    useAppStore.getState().setStagedImportFileScaleAlignment(stagedFileId, 'centimeters')

    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)

    const commitResult = useAppStore.getState().commitStagedImportDraftWithHistory()

    expect(commitResult).toMatchObject({
      status: 'success',
      committedReferenceCount: 1,
    })
    expect(editHistoryStore.getUndoEntries()).toHaveLength(1)
    expect(editHistoryStore.getUndoEntries()[0]).toMatchObject({
      label: 'Accept Import',
      source: {
        surface: 'browser',
        sourceId: 'browser-accepted-import',
        sourceLabel: 'Browser Accepted Import',
      },
      targetLabel: '1 staged import',
    })
    const referenceId = findImportedReferenceIdByAssetPath('blob:accepted-staged-settings')
    expect(referenceId).toBeTruthy()
    expect(
      useAppStore.getState().referenceWorkspace.transformOverrideById[referenceId!],
    ).toEqual({
      position: { x: 0, y: 0, z: 0 },
      rotationDeg: { x: 90, y: 0, z: 0 },
      scale: { x: 10, y: 10, z: 10 },
    })
  })
})
