import { describe, expect, it } from 'vitest'
import { DEFAULT_VIEW_SETTINGS, type MaterialPreset } from '../../shared/viewSettingsTypes'
import { createInitialReferenceWorkspaceState } from '../store/references/referenceWorkspaceState'
import {
  buildImportedReferenceRowId,
  type ImportedReferenceRecord,
  type ProjectContentState,
  type ReferenceWorkspaceState,
} from '../store/useAppStore'
import {
  buildMaterialsAssignmentScope,
  buildMaterialsAssignmentGroups,
  buildMaterialsPhase1ViewModel,
  buildMaterialsTargetRows,
  resolveSelectedTargetMaterialRead,
  type MaterialsTargetRow,
} from './materialsSectionViewModel'
import type { PropertiesSectionContext } from './propertiesSectionContract'

describe('buildMaterialsPhase1ViewModel', () => {
  const emptyProjectContent: ProjectContentState = {
    assembliesById: {},
    componentsById: {},
    objectsById: {},
  }
  const emptyReferenceWorkspace = createInitialReferenceWorkspaceState()
  const buildObjectContext = (objectId: string): PropertiesSectionContext => ({
    selectedTarget: {
      kind: 'object',
      objectId,
    },
    selectedObjectTargets: [
      {
        kind: 'object',
        objectId,
      },
    ],
    focusSummary: {
      state: 'selected',
      title: 'Object',
      detail: objectId,
      targetKind: 'object',
    },
  })

  const context = buildObjectContext('footpad-2')

  it('names the focused object and current material owner seams without creating editor actions', () => {
    const viewModel = buildMaterialsPhase1ViewModel(context, DEFAULT_VIEW_SETTINGS.materials, {
      projectContent: emptyProjectContent,
      referenceWorkspace: emptyReferenceWorkspace,
    })

    expect(viewModel.focusedObjectId).toBe('footpad-2')
    expect(viewModel.rows.map((row) => row.id)).toEqual([
      'focused-object',
      'material-truth',
      'mutation-history',
      'viewer-consumer',
      'target-discovery',
    ])
    expect(viewModel.rows.find((row) => row.id === 'material-truth')?.value).toContain(
      'selected default_matte',
    )
    expect(viewModel.rows.find((row) => row.id === 'target-discovery')?.status).toBe('pending')
    expect(viewModel.targetRows).toEqual([])
    expect(viewModel.assignmentScope.kind).toBe('single-object')
    expect(viewModel.assignmentScope.objectCount).toBe(1)
    expect(viewModel.assignmentScope.targetCount).toBe(0)
    expect(viewModel.owedFeatureGroups).toContain('new, assign, and duplicate material actions')
    expect(viewModel.owedFeatureGroups).toContain('odds and evens grouped target actions')
  })

  it('projects authored object part keys as material target rows', () => {
    const projectContent: ProjectContentState = {
      ...emptyProjectContent,
      objectsById: {
        'authored-object-1': {
          objectId: 'authored-object-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          sourceNodeId: 'node-1',
          slotId: null,
          label: 'Authored Object',
          resolutionState: 'resolved',
        },
      },
    }

    const targetRows = buildMaterialsTargetRows(
      buildObjectContext('authored-object-1'),
      {
        projectContent,
        referenceWorkspace: emptyReferenceWorkspace,
      },
    )

    expect(targetRows).toEqual([
      {
        targetId: 'authored-part:graph-document-1:output-entry-1',
        label: 'Material target',
        partKey: 'graph-document-1:output-entry-1',
        sourceKind: 'authored-part',
        detail: 'Project part',
      },
    ])
  })

  it('builds a single-object assignment scope from the active material target rows', () => {
    const projectContent: ProjectContentState = {
      ...emptyProjectContent,
      objectsById: {
        'authored-object-1': {
          objectId: 'authored-object-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          sourceNodeId: 'node-1',
          slotId: null,
          label: 'Authored Object',
          resolutionState: 'resolved',
        },
      },
    }

    const viewModel = buildMaterialsPhase1ViewModel(
      buildObjectContext('authored-object-1'),
      DEFAULT_VIEW_SETTINGS.materials,
      {
        projectContent,
        referenceWorkspace: emptyReferenceWorkspace,
      },
    )

    expect(viewModel.assignmentScope.kind).toBe('single-object')
    expect(viewModel.assignmentScope.objectCount).toBe(1)
    expect(viewModel.assignmentScope.targetCount).toBe(1)
    expect(viewModel.assignmentScope.partKeys).toEqual(['graph-document-1:output-entry-1'])
    expect(viewModel.assignmentScope.objectGroups[0]?.label).toBe('Authored Object')
    expect(viewModel.targetRows).toEqual(viewModel.assignmentScope.targetRows)
  })

  it('builds a multi-object assignment scope from selected authored objects without changing active detail rows', () => {
    const projectContent: ProjectContentState = {
      ...emptyProjectContent,
      objectsById: {
        'authored-object-1': {
          objectId: 'authored-object-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          sourceNodeId: 'node-1',
          slotId: null,
          label: 'Left Object',
          resolutionState: 'resolved',
        },
        'authored-object-2': {
          objectId: 'authored-object-2',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-2',
          sourceNodeId: 'node-2',
          slotId: null,
          label: 'Right Object',
          resolutionState: 'resolved',
        },
      },
    }
    const context: PropertiesSectionContext = {
      ...buildObjectContext('authored-object-1'),
      selectedObjectTargets: [
        { kind: 'object', objectId: 'authored-object-1' },
        { kind: 'object', objectId: 'authored-object-2' },
      ],
    }

    const viewModel = buildMaterialsPhase1ViewModel(context, DEFAULT_VIEW_SETTINGS.materials, {
      projectContent,
      referenceWorkspace: emptyReferenceWorkspace,
    })

    expect(viewModel.assignmentScope.kind).toBe('multi-object')
    expect(viewModel.assignmentScope.objectCount).toBe(2)
    expect(viewModel.assignmentScope.targetCount).toBe(2)
    expect(viewModel.assignmentScope.partKeys).toEqual([
      'graph-document-1:output-entry-1',
      'graph-document-1:output-entry-2',
    ])
    expect(viewModel.assignmentScope.objectGroups.map((group) => group.label)).toEqual([
      'Left Object',
      'Right Object',
    ])
    expect(viewModel.targetRows.map((row) => row.partKey)).toEqual([
      'graph-document-1:output-entry-1',
    ])
  })

  it('includes imported whole-object fallback rows in the multi-object assignment scope', () => {
    const referenceId = 'reference-import:whole-shoe'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Whole Shoe',
      fileType: 'glb',
      assetPath: 'blob:whole-shoe',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: null,
      directPartSourceGroupId: null,
      explodedFromReferenceId: null,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }
    const projectContent: ProjectContentState = {
      ...emptyProjectContent,
      objectsById: {
        'authored-object-1': {
          objectId: 'authored-object-1',
          ownerGraphDocumentId: 'graph-document-1',
          parentComponentId: 'component-1',
          objectSourceKind: 'published-object',
          sourceGraphDocumentId: 'graph-document-1',
          sourceOutputEntryId: 'output-entry-1',
          sourceNodeId: 'node-1',
          slotId: null,
          label: 'Authored Object',
          resolutionState: 'resolved',
        },
      },
    }
    const referenceWorkspace: ReferenceWorkspaceState = {
      ...emptyReferenceWorkspace,
      importedReferencesById: {
        [referenceId]: importedReference,
      },
      importedReferenceOrder: [referenceId],
      partRowsByReferenceId: {
        [referenceId]: [],
      },
    }
    const importedObjectId = buildImportedReferenceRowId(referenceId)
    const context: PropertiesSectionContext = {
      ...buildObjectContext('authored-object-1'),
      selectedObjectTargets: [
        { kind: 'object', objectId: 'authored-object-1' },
        { kind: 'object', objectId: importedObjectId },
      ],
    }

    const scope = buildMaterialsAssignmentScope(context, {
      projectContent,
      referenceWorkspace,
    })

    expect(scope.kind).toBe('multi-object')
    expect(scope.objectGroups.map((group) => group.label)).toEqual(['Authored Object', 'Whole Shoe'])
    expect(scope.partKeys).toEqual([
      'graph-document-1:output-entry-1',
      'reference-object:reference-import:whole-shoe',
    ])
  })

  it('projects stored reference part rows as material target rows', () => {
    const referenceId = 'reference-import-1'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Imported Footpad',
      fileType: 'obj',
      assetPath: 'blob:imported-footpad',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: null,
      directPartSourceGroupId: null,
      explodedFromReferenceId: null,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }
    const referenceWorkspace: ReferenceWorkspaceState = {
      ...emptyReferenceWorkspace,
      importedReferencesById: {
        [referenceId]: importedReference,
      },
      importedReferenceOrder: [referenceId],
      partRowsByReferenceId: {
        [referenceId]: [
          {
            rowId: 'reference-part-row-1',
            partKey: 'reference-part:reference-import-1:0',
            label: 'Steel Satin',
            sourceMeshIndex: 0,
          },
          {
            rowId: 'reference-part-row-2',
            partKey: 'reference-part:reference-import-1:1',
            label: 'Opaque(245,245,246)',
            sourceMeshIndex: 1,
          },
        ],
      },
    }

    const targetRows = buildMaterialsTargetRows(
      buildObjectContext(buildImportedReferenceRowId(referenceId)),
      {
        projectContent: emptyProjectContent,
        referenceWorkspace,
      },
    )

    expect(targetRows.map((row) => row.label)).toEqual(['Steel Satin', 'Opaque(245,245,246)'])
    expect(targetRows.map((row) => row.sourceKind)).toEqual(['reference-part', 'reference-part'])
  })

  it('projects terminal imported part references as single material target rows', () => {
    const referenceId = 'reference-import:child-sole'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Sole',
      fileType: 'glb',
      assetPath: 'blob:imported-sole',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: 'split-import-child',
      directPartSourceGroupId: 'direct-part-source-group:shoe',
      explodedFromReferenceId: 'reference-import:shoe',
      sourcePartKey: 'reference-part:reference-import:shoe:1',
      sourceMeshIndex: 1,
    }
    const referenceWorkspace: ReferenceWorkspaceState = {
      ...emptyReferenceWorkspace,
      importedReferencesById: {
        [referenceId]: importedReference,
      },
      importedReferenceOrder: [referenceId],
      partRowsByReferenceId: {
        [referenceId]: [],
      },
    }

    const targetRows = buildMaterialsTargetRows(
      buildObjectContext(buildImportedReferenceRowId(referenceId)),
      {
        projectContent: emptyProjectContent,
        referenceWorkspace,
      },
    )

    expect(targetRows).toEqual([
      {
        targetId: 'reference-part:reference-part:reference-import:shoe:1',
        label: 'Sole',
        partKey: 'reference-part:reference-import:shoe:1',
        sourceKind: 'reference-part',
        detail: 'Imported mesh 2',
      },
    ])
  })

  it('projects partless imported references as stable whole-object material target rows', () => {
    const referenceId = 'reference-import:whole-shoe'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Whole Shoe',
      fileType: 'glb',
      assetPath: 'blob:whole-shoe',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: null,
      directPartSourceGroupId: null,
      explodedFromReferenceId: null,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }
    const referenceWorkspace: ReferenceWorkspaceState = {
      ...emptyReferenceWorkspace,
      importedReferencesById: {
        [referenceId]: importedReference,
      },
      importedReferenceOrder: [referenceId],
      partRowsByReferenceId: {
        [referenceId]: [],
      },
    }

    const targetRows = buildMaterialsTargetRows(
      buildObjectContext(buildImportedReferenceRowId(referenceId)),
      {
        projectContent: emptyProjectContent,
        referenceWorkspace,
      },
    )

    expect(targetRows).toEqual([
      {
        targetId: 'reference-object:reference-import:whole-shoe',
        label: 'Whole Shoe',
        partKey: 'reference-object:reference-import:whole-shoe',
        sourceKind: 'reference-object',
        detail: 'Whole imported object',
      },
    ])
  })

  it('uses user-facing no-target copy when material targets are unavailable', () => {
    const viewModel = buildMaterialsPhase1ViewModel(context, DEFAULT_VIEW_SETTINGS.materials, {
      projectContent: emptyProjectContent,
      referenceWorkspace: emptyReferenceWorkspace,
    })

    expect(viewModel.targetStatusLabel).toBe('No material parts found')
    expect(viewModel.rows.find((row) => row.id === 'target-discovery')?.value).toBe(
      'No authored or imported material targets available',
    )
  })

  it('derives deterministic all odd and even assignment groups from target row order', () => {
    const targetRows: MaterialsTargetRow[] = [
      {
        targetId: 'reference-part:part-1',
        label: 'Steel Satin',
        partKey: 'part-1',
        sourceKind: 'reference-part',
        detail: 'Imported mesh 1',
      },
      {
        targetId: 'reference-part:part-2',
        label: 'Opaque A',
        partKey: 'part-2',
        sourceKind: 'reference-part',
        detail: 'Imported mesh 2',
      },
      {
        targetId: 'reference-part:part-3',
        label: 'Opaque B',
        partKey: 'part-3',
        sourceKind: 'reference-part',
        detail: 'Imported mesh 3',
      },
    ]

    expect(buildMaterialsAssignmentGroups(targetRows)).toEqual([
      {
        id: 'all',
        label: 'Assign To All',
        description: 'Apply the resolved material to every visible material target row.',
        partKeys: ['part-1', 'part-2', 'part-3'],
      },
      {
        id: 'odd',
        label: 'Assign To Odds',
        description: 'Apply the resolved material to one-based odd target rows.',
        partKeys: ['part-1', 'part-3'],
      },
      {
        id: 'even',
        label: 'Assign To Evens',
        description: 'Apply the resolved material to one-based even target rows.',
        partKeys: ['part-2'],
      },
    ])
  })

  describe('resolveSelectedTargetMaterialRead', () => {
    const targetRow: MaterialsTargetRow = {
      targetId: 'authored-part:footpad-part-1',
      label: 'Footpad material target',
      partKey: 'footpad-part-1',
      sourceKind: 'authored-part',
      detail: 'Project part',
    }
    const defaultPreset = DEFAULT_VIEW_SETTINGS.materials.presets[0] as MaterialPreset
    const selectedPreset = DEFAULT_VIEW_SETTINGS.materials.presets[1] as MaterialPreset
    const perPartPreset = DEFAULT_VIEW_SETTINGS.materials.presets[2] as MaterialPreset

    it('prefers an enabled per-part assignment when the mapped preset exists', () => {
      const read = resolveSelectedTargetMaterialRead(targetRow, {
        presets: DEFAULT_VIEW_SETTINGS.materials.presets,
        selectedPresetId: selectedPreset.id,
        usePerPart: true,
        perPart: {
          [targetRow.partKey]: perPartPreset.id,
        },
      })

      expect(read.status).toBe('ready')
      expect(read.source).toBe('per-part')
      expect(read.sourceLabel).toBe('Per-part assignment')
      expect(read.preset?.id).toBe(perPartPreset.id)
    })

    it('falls back to the selected preset when per-part mode is disabled', () => {
      const read = resolveSelectedTargetMaterialRead(targetRow, {
        presets: DEFAULT_VIEW_SETTINGS.materials.presets,
        selectedPresetId: selectedPreset.id,
        usePerPart: false,
        perPart: {
          [targetRow.partKey]: perPartPreset.id,
        },
      })

      expect(read.status).toBe('ready')
      expect(read.source).toBe('selected-preset')
      expect(read.preset?.id).toBe(selectedPreset.id)
    })

    it('falls back to the first preset when the selected preset is missing', () => {
      const read = resolveSelectedTargetMaterialRead(targetRow, {
        presets: DEFAULT_VIEW_SETTINGS.materials.presets,
        selectedPresetId: 'missing-preset',
        usePerPart: false,
        perPart: {},
      })

      expect(read.status).toBe('ready')
      expect(read.source).toBe('first-preset-fallback')
      expect(read.preset?.id).toBe(defaultPreset.id)
    })

    it('returns an explicit pending read when no preset can resolve', () => {
      const read = resolveSelectedTargetMaterialRead(targetRow, {
        presets: [],
        selectedPresetId: 'missing-preset',
        usePerPart: true,
        perPart: {
          [targetRow.partKey]: 'also-missing',
        },
      })

      expect(read.status).toBe('pending')
      expect(read.source).toBe('missing')
      expect(read.preset).toBeNull()
    })
  })
})
