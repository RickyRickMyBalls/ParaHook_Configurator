import { describe, expect, it } from 'vitest'
import { type EditHistoryEntry, editHistoryStore } from './editHistoryStore'

type CheckpointCandidateClassification =
  | 'authored-durable'
  | 'durable-preference-content'
  | 'derived-runtime-cache-provider'
  | 'session-navigation-focus-menu'
  | 'runtime-in-memory-owner'

type CheckpointCandidateId =
  | 'graph-cad-authored-document'
  | 'browser-project-import-accepted-content'
  | 'viewer-transform-authored-rows'
  | 'presentation-settings'
  | 'productivity-content'
  | 'workspace-layout-preferences'
  | 'sampler-import-settings'
  | 'canonical-edit-history-entries'

type CheckpointCandidate = {
  id: CheckpointCandidateId
  label: string
  ownerSeams: readonly string[]
  classification: CheckpointCandidateClassification
  checkpointEligible: boolean
  restoreBoundary: string
  acceptedBoundary: string
  exclusions: readonly string[]
  canSerializePrivateUndoRedoPayloads: false
}

type CheckpointRestoreDecisionId =
  | 'restore-as-canonical-entry'
  | 'restore-as-separate-command'
  | 'defer-until-storage-design'

type CheckpointRestoreDecision = {
  id: CheckpointRestoreDecisionId
  label: string
  status: 'unresolved-requires-manager-approval'
  reason: string
}

const checkpointCandidateInventory = [
  {
    id: 'graph-cad-authored-document',
    label: 'Graph/CAD authored document state',
    ownerSeams: [
      'src/app/spaghetti/store/useSpaghettiStore.ts',
      'src/app/spaghetti/store/graphEditHistoryStore.test.ts',
      'src/app/spaghetti/store/featureStackEditHistoryStore.test.ts',
      'src/app/spaghetti/store/sketchEditHistoryStore.test.ts',
    ],
    classification: 'authored-durable',
    checkpointEligible: true,
    restoreBoundary:
      'Restore authored graph document, feature stack, sketch edits, and CAD authored values through accepted authored graph boundaries.',
    acceptedBoundary:
      'Accepted Gen 1/Gen 2 graph, feature, parameter, and sketch history entries own authored graph changes.',
    exclusions: [
      'canvas selection and hover',
      'connection drag state',
      'runtime/build/cache/provider state',
      'local sketch draft/session helpers',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'browser-project-import-accepted-content',
    label: 'Browser/project/import accepted content',
    ownerSeams: [
      'src/app/store/useAppStore.ts',
      'src/app/store/browserOrganizationEditHistoryStore.test.ts',
      'src/app/store/importCatalogEditHistoryStore.test.ts',
    ],
    classification: 'authored-durable',
    checkpointEligible: true,
    restoreBoundary:
      'Restore accepted project/browser/import/reference content only through project-content boundaries with merge-safe restore rules.',
    acceptedBoundary:
      'Accepted Browser organization and accepted Import/Catalog entries own durable project/reference content.',
    exclusions: [
      'staged import draft settings before accept',
      'failed or unaccepted import sessions',
      'source browsing/provider/cache state',
      'object URL lifecycle',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'viewer-transform-authored-rows',
    label: 'Viewer Transform authored rows',
    ownerSeams: ['src/app/store/viewerTransformEditHistoryStore.test.ts'],
    classification: 'authored-durable',
    checkpointEligible: true,
    restoreBoundary:
      'Restore accepted authored transform rows/projection state only, preserving local scrub and viewer runtime state.',
    acceptedBoundary:
      'Accepted Viewer Transform history owns authored transform commits while local rows/readers remain projection/read state.',
    exclusions: [
      'local scrub/playhead state',
      'camera/navigation',
      'viewer runtime state',
      'Build Path readers',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'presentation-settings',
    label: 'Durable presentation settings',
    ownerSeams: [
      'src/app/store/environmentLookEditHistoryStore.test.ts',
      'src/app/store/materialEditHistoryStore.test.ts',
      'src/app/store/groundEditHistoryStore.test.ts',
      'src/app/store/scenePresentationEditHistoryReadiness.test.ts',
    ],
    classification: 'durable-preference-content',
    checkpointEligible: true,
    restoreBoundary:
      'Restore accepted environment look, material, and ground slices through their narrow snapshots, never full ViewSettings.',
    acceptedBoundary:
      'Accepted Gen2-1 helpers own environment look, material, and ground commit entries over scoped snapshots.',
    exclusions: [
      'camera/navigation',
      'viewer runtime/cache/provider state',
      'captured look compare/session helpers',
      'full ViewSettings snapshotting',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'productivity-content',
    label: 'Notepad and Dashboard productivity content',
    ownerSeams: [
      'src/app/store/notepadEditHistoryStore.test.ts',
      'src/app/store/dashboardBoardEditHistoryStore.test.ts',
      'src/app/store/productivityContentEditHistoryReadiness.test.ts',
    ],
    classification: 'durable-preference-content',
    checkpointEligible: true,
    restoreBoundary:
      'Restore accepted notes, lanes, and sticky-note layouts with targeted merge rules that preserve unrelated current records.',
    acceptedBoundary:
      'Accepted Gen2-2 helpers own Notepad discrete/text entries and Dashboard lane/text/layout/command entries.',
    exclusions: [
      'focus and text selection',
      'Dashboard camera/pan/zoom',
      'drag/resize previews',
      'menus and floating shell rects',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'workspace-layout-preferences',
    label: 'Workspace layout and preference fields',
    ownerSeams: [
      'src/app/store/workspaceLayoutPreferenceEditHistoryReadiness.test.ts',
      'src/app/store/uiPreferenceEditHistoryStore.test.ts',
      'src/app/store/workspaceLayoutEditHistoryStore.test.ts',
    ],
    classification: 'durable-preference-content',
    checkpointEligible: true,
    restoreBoundary:
      'Restore only accepted durable workspace layout/preference fields; keep session and child-window lifecycle state outside checkpoints.',
    acceptedBoundary:
      'Accepted Gen2-3 helpers own startup/persistence preferences, Browser presentation, and left-dock reset entries.',
    exclusions: [
      'active menus',
      'focus/open surface navigation',
      'child-window runtime lifecycle',
      'transient resize/drag frames',
      'viewport-local/session state unless explicitly durable',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'sampler-import-settings',
    label: 'Sampler/import settings',
    ownerSeams: [
      'src/app/store/samplerImportSettingEditHistoryReadiness.test.ts',
      'src/app/store/importCatalogEditHistoryStore.test.ts',
    ],
    classification: 'derived-runtime-cache-provider',
    checkpointEligible: false,
    restoreBoundary:
      'Do not checkpoint individual sampler runtime or unaccepted staged import settings; accepted import output is represented through project/import content.',
    acceptedBoundary:
      'Gen2-4 proof keeps sampler/radio and staged draft settings runtime or staged, with durable output owned by the accepted Import seam.',
    exclusions: [
      'sampler transport/playhead/waveform',
      'radio provider/cache/source browsing',
      'staged import draft/session settings before accept',
      'upload/session status',
      'preview renderer state',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
  {
    id: 'canonical-edit-history-entries',
    label: 'Canonical undo/redo entries',
    ownerSeams: ['src/app/store/editHistoryStore.ts'],
    classification: 'runtime-in-memory-owner',
    checkpointEligible: false,
    restoreBoundary:
      'Do not serialize private undo/redo callbacks or payloads in Phase 1; persisted history/checkpoint storage needs separate design.',
    acceptedBoundary:
      'The canonical edit-history store owns in-memory undo/redo truth and public reader metadata, not checkpoint persistence.',
    exclusions: [
      'private undo callbacks',
      'private redo callbacks',
      'adapter restore payloads',
      'serialized history schema',
    ],
    canSerializePrivateUndoRedoPayloads: false,
  },
] as const satisfies readonly CheckpointCandidate[]

const checkpointRestoreDecisionRecord = [
  {
    id: 'restore-as-canonical-entry',
    label: 'Checkpoint restore creates a canonical entry',
    status: 'unresolved-requires-manager-approval',
    reason:
      'Would make restore undoable through the existing owner, but needs explicit redo invalidation and payload-scope rules.',
  },
  {
    id: 'restore-as-separate-command',
    label: 'Checkpoint restore is a separate command',
    status: 'unresolved-requires-manager-approval',
    reason:
      'Could avoid serializing entry payloads, but needs explicit rules for redo preservation, redo clearing, and reader labeling.',
  },
  {
    id: 'defer-until-storage-design',
    label: 'Defer restore until storage design exists',
    status: 'unresolved-requires-manager-approval',
    reason:
      'Keeps Phase 1 as ownership proof while persistence owner, quota, schema, and migration rules remain unapproved.',
  },
] as const satisfies readonly CheckpointRestoreDecision[]

const requiredCandidateIds: readonly CheckpointCandidateId[] = [
  'graph-cad-authored-document',
  'browser-project-import-accepted-content',
  'viewer-transform-authored-rows',
  'presentation-settings',
  'productivity-content',
  'workspace-layout-preferences',
  'sampler-import-settings',
  'canonical-edit-history-entries',
]

const seedRedoEntry = (): void => {
  const entry: EditHistoryEntry = {
    entryId: 'checkpoint-readiness-redo',
    label: 'Checkpoint readiness redo',
    source: {
      surface: 'checkpoint-readiness',
      sourceId: 'proof',
      sourceLabel: 'Checkpoint readiness proof',
    },
    undo: () => {},
    redo: () => {},
  }

  editHistoryStore.commitEntry(entry)
  editHistoryStore.undo()

  expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
  expect(editHistoryStore.getRedoEntries().map((redoEntry) => redoEntry.entryId)).toEqual([
    'checkpoint-readiness-redo',
  ])
}

describe('checkpoint ownership readiness', () => {
  it('classifies current checkpoint candidates and exclusions against accepted owners', () => {
    const candidateIds = checkpointCandidateInventory.map((candidate) => candidate.id)

    expect(candidateIds).toEqual(requiredCandidateIds)
    expect(
      checkpointCandidateInventory.filter((candidate) => candidate.checkpointEligible).map(
        (candidate) => candidate.id,
      ),
    ).toEqual([
      'graph-cad-authored-document',
      'browser-project-import-accepted-content',
      'viewer-transform-authored-rows',
      'presentation-settings',
      'productivity-content',
      'workspace-layout-preferences',
    ])

    for (const candidate of checkpointCandidateInventory) {
      expect(candidate.ownerSeams.length).toBeGreaterThan(0)
      expect(candidate.restoreBoundary.length).toBeGreaterThan(20)
      expect(candidate.acceptedBoundary.length).toBeGreaterThan(20)
      expect(candidate.exclusions.length).toBeGreaterThan(0)
      expect(candidate.canSerializePrivateUndoRedoPayloads).toBe(false)
    }

    expect(
      checkpointCandidateInventory
        .filter((candidate) => !candidate.checkpointEligible)
        .map((candidate) => candidate.id),
    ).toEqual(['sampler-import-settings', 'canonical-edit-history-entries'])
    expect(
      checkpointCandidateInventory.find((candidate) => candidate.id === 'sampler-import-settings')
        ?.exclusions,
    ).toEqual(expect.arrayContaining([
      'sampler transport/playhead/waveform',
      'staged import draft/session settings before accept',
      'preview renderer state',
    ]))
  })

  it('keeps canonical history entries runtime-only until persistence design exists', () => {
    const canonicalCandidate = checkpointCandidateInventory.find(
      (candidate) => candidate.id === 'canonical-edit-history-entries',
    )

    expect(canonicalCandidate).toMatchObject({
      classification: 'runtime-in-memory-owner',
      checkpointEligible: false,
      canSerializePrivateUndoRedoPayloads: false,
    })
    expect(canonicalCandidate?.ownerSeams).toEqual(['src/app/store/editHistoryStore.ts'])
    expect(canonicalCandidate?.exclusions).toEqual(expect.arrayContaining([
      'private undo callbacks',
      'private redo callbacks',
      'adapter restore payloads',
      'serialized history schema',
    ]))
  })

  it('records checkpoint restore semantics as unresolved Manager decisions', () => {
    expect(checkpointRestoreDecisionRecord.map((decision) => decision.id)).toEqual([
      'restore-as-canonical-entry',
      'restore-as-separate-command',
      'defer-until-storage-design',
    ])
    expect(
      checkpointRestoreDecisionRecord.every(
        (decision) => decision.status === 'unresolved-requires-manager-approval',
      ),
    ).toBe(true)
    expect(
      checkpointRestoreDecisionRecord.some((decision) =>
        decision.reason.includes('redo'),
      ),
    ).toBe(true)
    expect(
      checkpointRestoreDecisionRecord.some((decision) =>
        decision.reason.includes('persistence'),
      ),
    ).toBe(true)
  })

  it('does not mutate canonical history while reading the proof inventory', () => {
    editHistoryStore.clear()
    seedRedoEntry()

    const durableCandidateLabels = checkpointCandidateInventory
      .filter((candidate) => candidate.checkpointEligible)
      .map((candidate) => candidate.label)
    const restoreDecisionLabels = checkpointRestoreDecisionRecord.map((decision) => decision.label)

    expect(durableCandidateLabels).toContain('Graph/CAD authored document state')
    expect(restoreDecisionLabels).toContain('Checkpoint restore creates a canonical entry')
    expect(editHistoryStore.getUndoEntries()).toHaveLength(0)
    expect(editHistoryStore.getRedoEntries().map((entry) => entry.entryId)).toEqual([
      'checkpoint-readiness-redo',
    ])
    expect(editHistoryStore.canRedo()).toBe(true)
  })
})
