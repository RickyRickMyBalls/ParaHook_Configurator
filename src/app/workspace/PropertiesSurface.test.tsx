// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import { DEFAULT_VIEW_SETTINGS } from '../../shared/viewSettingsTypes'
import { editHistoryStore } from '../store/editHistoryStore'
import { useUiPrefsStore } from '../store/uiPrefsStore'
import {
  buildImportedReferenceRowId,
  useAppStore,
  type ImportedReferenceRecord,
  type WorkspaceSelectedTarget,
} from '../store/useAppStore'
import { PropertiesSurface } from './PropertiesSurface'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('PropertiesSurface', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null
  const initialProjectContent = useAppStore.getState().projectContent
  const initialReferenceWorkspace = useAppStore.getState().referenceWorkspace
  const initialView = useUiPrefsStore.getState().view

  afterEach(async () => {
    await act(async () => {
      editHistoryStore.clear()
      useAppStore.setState((state) => ({
        projectContent: initialProjectContent,
        referenceWorkspace: initialReferenceWorkspace,
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget: null,
          explicitSelectedTargets: [],
          selectionAnchorTarget: null,
          resolvedContentSelection: null,
        },
      }))
      useUiPrefsStore.setState({
        view: initialView,
      })
      vi.restoreAllMocks()
    })
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    container?.remove()
    container = null
    root = null
  })

  const renderSurface = async () => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)

    await act(async () => {
      root?.render(
        <PropertiesSurface
          slotId="workspace-slot-properties"
          surfaceInstanceId="properties-workspace-slot-properties"
        />,
      )
    })
  }

  const setSelectedTarget = async (selectedTarget: WorkspaceSelectedTarget | null) => {
    await act(async () => {
      useAppStore.setState((state) => ({
        workspaceSelection: {
          ...state.workspaceSelection,
          selectedTarget,
          explicitSelectedTargets: [],
          selectionAnchorTarget: null,
          resolvedContentSelection: null,
        },
      }))
    })
  }

  const setTwoFocusedMaterialObjects = async () => {
    const firstTarget = {
      kind: 'object',
      objectId: 'properties-include-object-1',
    } satisfies WorkspaceSelectedTarget
    const secondTarget = {
      kind: 'object',
      objectId: 'properties-include-object-2',
    } satisfies WorkspaceSelectedTarget

    await act(async () => {
      useAppStore.setState((state) => ({
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'properties-include-object-1': {
              objectId: 'properties-include-object-1',
              ownerGraphDocumentId: 'graph-document-include',
              parentComponentId: 'component-include',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-include',
              sourceOutputEntryId: 'output-entry-left',
              sourceNodeId: 'node-left',
              slotId: null,
              label: 'Included Left Object',
              resolutionState: 'resolved',
            },
            'properties-include-object-2': {
              objectId: 'properties-include-object-2',
              ownerGraphDocumentId: 'graph-document-include',
              parentComponentId: 'component-include',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-include',
              sourceOutputEntryId: 'output-entry-right',
              sourceNodeId: 'node-right',
              slotId: null,
              label: 'Included Right Object',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: firstTarget,
        explicitSelectedTargets: [firstTarget, secondTarget],
        selectionAnchorTarget: firstTarget,
      })
    })

    return {
      firstTarget,
      secondTarget,
      leftPartKey: 'graph-document-include:output-entry-left',
      rightPartKey: 'graph-document-include:output-entry-right',
    }
  }

  it('frames materials as the first active hosted section', async () => {
    await act(async () => {
      useAppStore.setState((state) => ({
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'properties-surface-object-1': {
              objectId: 'properties-surface-object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-1',
              slotId: null,
              label: 'Properties Surface Object',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })
    await setSelectedTarget({
      kind: 'object',
      objectId: 'properties-surface-object-1',
    })

    await renderSurface()

    const surface = container?.querySelector('.PropertiesSurface') as HTMLDivElement | null
    const tablist = container?.querySelector('[role="tablist"]') as HTMLDivElement | null
    const materialsTab = container?.querySelector(
      '#properties-section-tab-materials',
    ) as HTMLButtonElement | null
    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-properties-active-section')).toBe('materials')
    expect(tablist?.getAttribute('aria-label')).toBe('Properties sections')
    expect(materialsTab?.getAttribute('aria-selected')).toBe('true')
    expect(materialsPanel).not.toBeNull()
    expect(materialsPanel?.textContent).not.toContain('Child section contract and shell states')
    expect(materialsPanel?.textContent).not.toContain('Material target editor and grouped actions')
    expect(materialsPanel?.textContent).not.toContain('Materials-2 / Phase 3')
    expect(container?.textContent).toContain('Focused items')
    expect(container?.textContent).toContain('1 selected object')
    expect(container?.textContent).toContain('Properties Surface Object')
    expect(container?.textContent).not.toContain('Focused Item')
    const focusedObjectList = container?.querySelector(
      '[data-properties-focused-object-list="compact"]',
    ) as HTMLDivElement | null
    const focusedObjectListResizeHandle = container?.querySelector(
      '[data-properties-focused-object-list-resize-handle="bottom"]',
    ) as HTMLDivElement | null
    expect(focusedObjectList?.classList.contains('PropertiesFocusedItemList')).toBe(true)
    expect(
      focusedObjectList?.style.getPropertyValue('--properties-focused-item-list-height'),
    ).toBe('34px')
    expect(focusedObjectListResizeHandle?.getAttribute('aria-valuenow')).toBe('34')
    expect(materialsPanel?.textContent).toContain('Material target')
    expect(
      materialsPanel
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-scope'),
    ).toBe('single-object')
    expect(
      materialsPanel
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-object-count'),
    ).toBe('1')
    expect(
      materialsPanel
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-target-count'),
    ).toBe('1')
    expect(materialsPanel?.textContent).toContain('Material targets')
    expect(materialsPanel?.textContent).toContain('Choose the part or imported mesh')
    expect(materialsPanel?.textContent).not.toContain('Object Part')
    expect(materialsPanel?.textContent).not.toContain(
      'Target rows come from authored object part keys',
    )
    expect(materialsPanel?.textContent).toContain('Selected Material')
    expect(materialsPanel?.textContent).toContain('Default Matte')
    expect(materialsPanel?.textContent).toContain('Selected preset')
    expect(
      (
        materialsPanel?.querySelector('input[aria-label="Edit base color"]') as
          | HTMLInputElement
          | null
      )?.value,
    ).toBe('#5f83d6')
    expect(materialsPanel?.textContent).toContain('Metalness')
    expect(materialsPanel?.textContent).toContain('Roughness')
    expect(materialsPanel?.textContent).toContain('Opacity')
    expect(materialsPanel?.textContent).toContain('Double-sided')
    expect(materialsPanel?.textContent).toContain('Project materials')
    expect(materialsPanel?.textContent).toContain('4 materials')
    expect(materialsPanel?.textContent).toContain('New Material')
    expect(materialsPanel?.textContent).not.toContain('Assign Material')
    expect(materialsPanel?.textContent).toContain('Duplicate Material')
    expect(materialsPanel?.textContent).toContain('Assign To All')
    expect(materialsPanel?.textContent).toContain('Assign To Odds')
    expect(materialsPanel?.textContent).toContain('Assign To Evens')
    expect(materialsPanel?.querySelector('[aria-label="Materials owner seam read"]')).toBeNull()
    expect(materialsPanel?.querySelector('[aria-label="Materials follow-on baseline"]')).toBeNull()
    expect(materialsPanel?.textContent).not.toContain('Material truth source')
    expect(materialsPanel?.textContent).not.toContain('Mutation and history seam')
    expect(materialsPanel?.textContent).not.toContain('Viewer consumer seam')
    expect(materialsPanel?.textContent).not.toContain('Target discovery status')
    expect(materialsPanel?.textContent).not.toContain('uiPrefsStore + materialEditHistory')
    expect(materialsPanel?.textContent).not.toContain('1 target row projected')
    expect(materialsPanel?.textContent).not.toContain('Reference Baseline')
    expect(materialsPanel?.textContent).not.toContain('Old window capability still owed')
    expect(materialsPanel?.textContent).not.toContain('properties-surface-object-1')

    const editableControls = materialsPanel?.querySelectorAll('[data-selected-material-control]')
    expect(editableControls?.length).toBe(9)
    expect(
      materialsPanel?.querySelector('[data-selected-material-editor="compact"]'),
    ).not.toBeNull()
    expect(
      materialsPanel?.querySelector('[data-selected-material-source-badge="selected-preset"]'),
    ).not.toBeNull()

    const projectMaterialActions = materialsPanel?.querySelector(
      '[aria-label="Project material actions"]',
    )
    const materialActions = projectMaterialActions?.querySelectorAll('[data-material-action]')
    expect(materialsPanel?.querySelector('[aria-label="Material actions"]')).toBeNull()
    expect(materialActions?.length).toBe(2)
    materialActions?.forEach((action) => {
      expect((action as HTMLButtonElement).disabled).toBe(false)
    })
    const groupedMaterialActions = materialsPanel?.querySelector(
      '[aria-label="Grouped material actions"]',
    )
    const groupActions = groupedMaterialActions?.querySelectorAll('[data-material-group-action]')
    expect(groupActions?.length).toBe(3)
    groupActions?.forEach((action) => {
      expect((action as HTMLButtonElement).disabled).toBe(true)
    })

    const targetRow = materialsPanel?.querySelector(
      '[data-material-target-row="authored-part:graph-document-1:output-entry-1"]',
    ) as HTMLButtonElement | null
    const targetList = materialsPanel?.querySelector(
      '[data-material-target-list="compact"]',
    ) as HTMLDivElement | null
    const targetListResizeHandle = materialsPanel?.querySelector(
      '[data-material-target-list-resize-handle="bottom"]',
    ) as HTMLDivElement | null
    expect(targetList?.classList.contains('PropertiesMaterialsTargetList')).toBe(true)
    expect(targetList?.style.getPropertyValue('--properties-material-target-list-height')).toBe(
      '36px',
    )
    expect(targetListResizeHandle?.getAttribute('aria-valuenow')).toBe('36')
    expect(targetRow?.title).toBe('graph-document-1:output-entry-1')
    expect(targetRow?.getAttribute('data-material-target-selected')).toBe('true')
    expect(targetRow?.textContent).toContain('Project part')
    const projectMaterialList = materialsPanel?.querySelector(
      '[data-project-material-list="compact"]',
    ) as HTMLDivElement | null
    const projectMaterialListResizeHandle = materialsPanel?.querySelector(
      '[data-project-material-list-resize-handle="bottom"]',
    ) as HTMLDivElement | null
    const defaultMatteRow = materialsPanel?.querySelector(
      '[data-project-material-row="default_matte"]',
    ) as HTMLButtonElement | null
    const brushedMetalRow = materialsPanel?.querySelector(
      '[data-project-material-row="brushed_metal"]',
    ) as HTMLButtonElement | null
    expect(projectMaterialList?.classList.contains('PropertiesProjectMaterialList')).toBe(true)
    expect(projectMaterialList?.style.getPropertyValue('--properties-project-material-list-height')).toBe(
      '114px',
    )
    expect(projectMaterialListResizeHandle?.getAttribute('aria-valuenow')).toBe('114')
    expect(defaultMatteRow?.getAttribute('data-project-material-selected')).toBe('true')
    expect(defaultMatteRow?.textContent).toContain('Default Matte')
    expect(brushedMetalRow?.getAttribute('data-project-material-selected')).toBe('false')

    await act(async () => {
      focusedObjectListResizeHandle?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientY: 100 }),
      )
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 130 }))
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(focusedObjectListResizeHandle?.getAttribute('aria-valuenow')).toBe('64')
    expect(
      focusedObjectList?.style.getPropertyValue('--properties-focused-item-list-height'),
    ).toBe('64px')

    await act(async () => {
      focusedObjectListResizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }),
      )
    })

    expect(focusedObjectListResizeHandle?.getAttribute('aria-valuenow')).toBe('52')
    expect(
      focusedObjectList?.style.getPropertyValue('--properties-focused-item-list-height'),
    ).toBe('52px')

    await act(async () => {
      targetRow?.click()
    })

    await act(async () => {
      targetListResizeHandle?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientY: 100 }),
      )
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 136 }))
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(targetListResizeHandle?.getAttribute('aria-valuenow')).toBe('72')
    expect(targetList?.style.getPropertyValue('--properties-material-target-list-height')).toBe(
      '72px',
    )

    await act(async () => {
      targetListResizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }),
      )
    })

    expect(targetListResizeHandle?.getAttribute('aria-valuenow')).toBe('60')
    expect(targetList?.style.getPropertyValue('--properties-material-target-list-height')).toBe(
      '60px',
    )

    await act(async () => {
      projectMaterialListResizeHandle?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientY: 100 }),
      )
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 136 }))
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(projectMaterialListResizeHandle?.getAttribute('aria-valuenow')).toBe('150')
    expect(projectMaterialList?.style.getPropertyValue('--properties-project-material-list-height')).toBe(
      '150px',
    )

    await act(async () => {
      projectMaterialListResizeHandle?.dispatchEvent(
        new KeyboardEvent('keydown', { bubbles: true, key: 'ArrowUp' }),
      )
    })

    expect(projectMaterialListResizeHandle?.getAttribute('aria-valuenow')).toBe('138')
    expect(projectMaterialList?.style.getPropertyValue('--properties-project-material-list-height')).toBe(
      '138px',
    )

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: 'properties-surface-object-1',
    })
  })

  it('switches the active materials object from a focused object list without collapsing multi-selection', async () => {
    const firstTarget = {
      kind: 'object',
      objectId: 'properties-surface-object-1',
    } satisfies WorkspaceSelectedTarget
    const secondTarget = {
      kind: 'object',
      objectId: 'properties-surface-object-2',
    } satisfies WorkspaceSelectedTarget

    await act(async () => {
      useAppStore.setState((state) => ({
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'properties-surface-object-1': {
              objectId: 'properties-surface-object-1',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-1',
              sourceNodeId: 'node-1',
              slotId: null,
              label: 'Left Material Object',
              resolutionState: 'resolved',
            },
            'properties-surface-object-2': {
              objectId: 'properties-surface-object-2',
              ownerGraphDocumentId: 'graph-document-1',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-1',
              sourceOutputEntryId: 'output-entry-2',
              sourceNodeId: 'node-2',
              slotId: null,
              label: 'Right Material Object',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: firstTarget,
        explicitSelectedTargets: [firstTarget, secondTarget],
        selectionAnchorTarget: firstTarget,
      })
    })

    await renderSurface()

    const focusedRows = container?.querySelectorAll('[data-properties-focused-object-row]')
    const firstFocusedRow = container?.querySelector(
      '[data-properties-focused-object-row="properties-surface-object-1"]',
    ) as HTMLButtonElement | null
    const secondFocusedRow = container?.querySelector(
      '[data-properties-focused-object-row="properties-surface-object-2"]',
    ) as HTMLButtonElement | null

    expect(focusedRows?.length).toBe(2)
    expect(container?.textContent).toContain('2 selected objects')
    expect(container?.textContent).toContain('Left Material Object')
    expect(container?.textContent).toContain('Right Material Object')
    expect(
      (
        container?.querySelector('[data-properties-focused-object-list="compact"]') as
          | HTMLDivElement
          | null
      )?.style.getPropertyValue('--properties-focused-item-list-height'),
    ).toBe('68px')
    expect(firstFocusedRow?.getAttribute('data-properties-focused-object-active')).toBe('true')
    expect(secondFocusedRow?.getAttribute('data-properties-focused-object-active')).toBe('false')
    expect(
      container?.querySelector(
        '[data-material-target-row="authored-part:graph-document-1:output-entry-1"]',
      ),
    ).not.toBeNull()
    expect(
      container
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-scope'),
    ).toBe('multi-object')
    expect(
      container
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-object-count'),
    ).toBe('2')
    expect(
      container
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-target-count'),
    ).toBe('2')

    await act(async () => {
      secondFocusedRow?.click()
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(secondTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([
      firstTarget,
      secondTarget,
    ])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual(firstTarget)
    expect(firstFocusedRow?.getAttribute('data-properties-focused-object-active')).toBe('false')
    expect(secondFocusedRow?.getAttribute('data-properties-focused-object-active')).toBe('true')
    expect(
      container?.querySelector(
        '[data-material-target-row="authored-part:graph-document-1:output-entry-2"]',
      ),
    ).not.toBeNull()
  })

  it('assigns a project material row to all selected material objects through one history entry', async () => {
    const firstTarget = {
      kind: 'object',
      objectId: 'properties-batch-object-1',
    } satisfies WorkspaceSelectedTarget
    const secondTarget = {
      kind: 'object',
      objectId: 'properties-batch-object-2',
    } satisfies WorkspaceSelectedTarget

    await act(async () => {
      useAppStore.setState((state) => ({
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'properties-batch-object-1': {
              objectId: 'properties-batch-object-1',
              ownerGraphDocumentId: 'graph-document-batch',
              parentComponentId: 'component-batch',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-batch',
              sourceOutputEntryId: 'output-entry-left',
              sourceNodeId: 'node-left',
              slotId: null,
              label: 'Batch Left Object',
              resolutionState: 'resolved',
            },
            'properties-batch-object-2': {
              objectId: 'properties-batch-object-2',
              ownerGraphDocumentId: 'graph-document-batch',
              parentComponentId: 'component-batch',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-batch',
              sourceOutputEntryId: 'output-entry-right',
              sourceNodeId: 'node-right',
              slotId: null,
              label: 'Batch Right Object',
              resolutionState: 'resolved',
            },
          },
        },
      }))
      useAppStore.getState().setWorkspaceExplicitSelection({
        selectedTarget: firstTarget,
        explicitSelectedTargets: [firstTarget, secondTarget],
        selectionAnchorTarget: firstTarget,
      })
    })

    await renderSurface()

    const materialsSection = container?.querySelector(
      '[aria-label="Properties materials section"]',
    ) as HTMLElement | null
    const brushedMetalProjectRow = container?.querySelector(
      '[data-project-material-row="brushed_metal"]',
    ) as HTMLButtonElement | null

    expect(materialsSection?.getAttribute('data-material-assignment-scope')).toBe('multi-object')
    expect(materialsSection?.getAttribute('data-material-assignment-target-count')).toBe('2')
    expect(brushedMetalProjectRow?.disabled).toBe(false)

    await act(async () => {
      brushedMetalProjectRow?.click()
    })

    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'graph-document-batch:output-entry-left': 'brushed_metal',
      'graph-document-batch:output-entry-right': 'brushed_metal',
    })
    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Assign material to selected objects',
        targetLabel: 'Selected material objects',
      },
    ])

    await act(async () => {
      editHistoryStore.undo()
    })

    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({})

    await act(async () => {
      editHistoryStore.redo()
    })

    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'graph-document-batch:output-entry-left': 'brushed_metal',
      'graph-document-batch:output-entry-right': 'brushed_metal',
    })
  })

  it('unhighlights focused material objects for assignment without changing global selection', async () => {
    const { firstTarget, secondTarget, leftPartKey, rightPartKey } =
      await setTwoFocusedMaterialObjects()
    await renderSurface()

    const getMaterialsSection = () =>
      container?.querySelector('[aria-label="Properties materials section"]') as HTMLElement | null
    const secondIncludeButton = container?.querySelector(
      '[data-properties-focused-object-include="properties-include-object-2"]',
    ) as HTMLButtonElement | null
    const secondFocusButton = container?.querySelector(
      '[data-properties-focused-object-row="properties-include-object-2"]',
    ) as HTMLButtonElement | null
    const brushedMetalProjectRow = container?.querySelector(
      '[data-project-material-row="brushed_metal"]',
    ) as HTMLButtonElement | null

    expect(secondIncludeButton?.getAttribute('aria-pressed')).toBe('true')
    expect(secondFocusButton?.getAttribute('data-properties-focused-object-included')).toBe('true')
    expect(getMaterialsSection()?.getAttribute('data-material-assignment-target-count')).toBe('2')

    await act(async () => {
      secondIncludeButton?.click()
    })

    expect(secondIncludeButton?.getAttribute('aria-pressed')).toBe('false')
    expect(secondFocusButton?.getAttribute('data-properties-focused-object-included')).toBe('false')
    expect(getMaterialsSection()?.getAttribute('data-material-assignment-target-count')).toBe('1')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([
      firstTarget,
      secondTarget,
    ])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection?.partKeys).toEqual([
      leftPartKey,
      rightPartKey,
    ])

    await act(async () => {
      brushedMetalProjectRow?.click()
    })

    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      [leftPartKey]: 'brushed_metal',
    })
  })

  it('removes inactive focused material objects through global selection when x is clicked', async () => {
    const { firstTarget, leftPartKey } = await setTwoFocusedMaterialObjects()
    await renderSurface()

    const getMaterialsSection = () =>
      container?.querySelector('[aria-label="Properties materials section"]') as HTMLElement | null
    const secondRemoveButton = container?.querySelector(
      '[data-properties-focused-object-remove="properties-include-object-2"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      secondRemoveButton?.click()
    })

    expect(container?.querySelectorAll('[data-properties-focused-object-row]').length).toBe(1)
    expect(
      container?.querySelector('[data-properties-focused-object-row="properties-include-object-2"]'),
    ).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([firstTarget])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection?.partKeys).toEqual([
      leftPartKey,
    ])
    expect(getMaterialsSection()?.getAttribute('data-material-assignment-target-count')).toBe('1')
  })

  it('removes active focused material objects through global selection when x is clicked', async () => {
    const { firstTarget, secondTarget, leftPartKey } = await setTwoFocusedMaterialObjects()
    await renderSurface()

    const getMaterialsSection = () =>
      container?.querySelector('[aria-label="Properties materials section"]') as HTMLElement | null
    const secondFocusButton = container?.querySelector(
      '[data-properties-focused-object-row="properties-include-object-2"]',
    ) as HTMLButtonElement | null
    const secondRemoveButton = container?.querySelector(
      '[data-properties-focused-object-remove="properties-include-object-2"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      secondFocusButton?.click()
    })

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(secondTarget)

    await act(async () => {
      secondRemoveButton?.click()
    })

    expect(container?.querySelectorAll('[data-properties-focused-object-row]').length).toBe(1)
    expect(
      container?.querySelector('[data-properties-focused-object-row="properties-include-object-2"]'),
    ).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([firstTarget])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection?.partKeys).toEqual([
      leftPartKey,
    ])
    expect(getMaterialsSection()?.getAttribute('data-material-assignment-target-count')).toBe('1')
  })

  it('clears mirrored selection state when x removes a single focused material object', async () => {
    const { firstTarget, leftPartKey } = await setTwoFocusedMaterialObjects()

    await act(async () => {
      useAppStore.getState().setWorkspaceSelectedTarget(firstTarget)
      useAppStore.getState().selectPart(leftPartKey)
    })

    await renderSurface()

    const removeButton = container?.querySelector(
      '[data-properties-focused-object-remove="properties-include-object-1"]',
    ) as HTMLButtonElement | null

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([firstTarget])
    expect(useAppStore.getState().selectedPartKey).toBe(leftPartKey)

    await act(async () => {
      removeButton?.click()
    })

    expect(container?.querySelector('[data-properties-focused-object-row]')).toBeNull()
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toBeNull()
    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection).toBeNull()
    expect(useAppStore.getState().selectedPartKey).toBeNull()
  })

  it('updates the selected material read from lane-local target selection without mutating material truth', async () => {
    const referenceId = 'properties-reference-1'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Imported Footpad',
      fileType: 'obj',
      assetPath: 'blob:properties-reference-1',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: null,
      directPartSourceGroupId: null,
      explodedFromReferenceId: null,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }

    await act(async () => {
      useAppStore.setState((state) => ({
        referenceWorkspace: {
          ...state.referenceWorkspace,
          importedReferencesById: {
            ...state.referenceWorkspace.importedReferencesById,
            [referenceId]: importedReference,
          },
          importedReferenceOrder: [...state.referenceWorkspace.importedReferenceOrder, referenceId],
          partRowsByReferenceId: {
            ...state.referenceWorkspace.partRowsByReferenceId,
            [referenceId]: [
              {
                rowId: 'reference-part-row-steel',
                partKey: 'reference-part:properties-reference-1:0',
                label: 'Steel Satin',
                sourceMeshIndex: 0,
              },
              {
                rowId: 'reference-part-row-opaque',
                partKey: 'reference-part:properties-reference-1:1',
                label: 'Opaque(245,245,246)',
                sourceMeshIndex: 1,
              },
            ],
          },
        },
      }))
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          materials: {
            presets: DEFAULT_VIEW_SETTINGS.materials.presets,
            selectedPresetId: 'default_matte',
            usePerPart: true,
            perPart: {
              'reference-part:properties-reference-1:0': 'brushed_metal',
              'reference-part:properties-reference-1:1': 'highlight_gloss',
            },
          },
        },
      }))
    })
    await setSelectedTarget({
      kind: 'object',
      objectId: buildImportedReferenceRowId(referenceId),
    })

    await renderSurface()

    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null
    const materialRead = materialsPanel?.querySelector(
      '[aria-label="Selected material property controls"]',
    ) as HTMLDivElement | null
    expect(materialRead?.getAttribute('data-selected-material-read-source')).toBe('per-part')
    expect(materialsPanel?.textContent).toContain('Steel Satin')
    expect(materialsPanel?.textContent).toContain('Brushed Metal')
    expect(materialsPanel?.textContent).toContain('Per-part assignment')

    const secondTargetRow = materialsPanel?.querySelector(
      '[data-material-target-row="reference-part:reference-part:properties-reference-1:1"]',
    ) as HTMLButtonElement | null
    const targetRows = materialsPanel?.querySelectorAll('[data-material-target-row]')
    expect(targetRows?.length).toBe(2)
    expect(
      materialsPanel?.querySelector('[aria-label="Selected material target"]'),
    ).toBeNull()

    await act(async () => {
      secondTargetRow?.click()
    })

    expect(materialsPanel?.textContent).toContain('Highlight Gloss')
    expect(
      (
        materialsPanel?.querySelector('input[aria-label="Edit base color"]') as
          | HTMLInputElement
          | null
      )?.value,
    ).toBe('#f3f4f7')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'reference-part:properties-reference-1:0': 'brushed_metal',
      'reference-part:properties-reference-1:1': 'highlight_gloss',
    })
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: buildImportedReferenceRowId(referenceId),
    })
  })

  it('edits the resolved selected-target material preset through material history', async () => {
    await act(async () => {
      useAppStore.setState((state) => ({
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'editable-material-object-1': {
              objectId: 'editable-material-object-1',
              ownerGraphDocumentId: 'graph-document-edit',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-edit',
              sourceOutputEntryId: 'output-entry-edit',
              sourceNodeId: 'node-1',
              slotId: null,
              label: 'Editable Material Object',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })
    await setSelectedTarget({
      kind: 'object',
      objectId: 'editable-material-object-1',
    })

    await renderSurface()

    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null
    const baseColorExpandButton = materialsPanel?.querySelector(
      'button[aria-label="Expand base color controls"]',
    ) as HTMLButtonElement | null
    const emissiveColorExpandButton = materialsPanel?.querySelector(
      'button[aria-label="Expand emissive color controls"]',
    ) as HTMLButtonElement | null

    expect(baseColorExpandButton?.getAttribute('aria-expanded')).toBe('false')
    expect(emissiveColorExpandButton?.getAttribute('aria-expanded')).toBe('false')

    await act(async () => {
      baseColorExpandButton?.click()
      emissiveColorExpandButton?.click()
    })

    expect(baseColorExpandButton?.getAttribute('aria-expanded')).toBe('true')
    expect(emissiveColorExpandButton?.getAttribute('aria-expanded')).toBe('true')
    const baseColorControl = materialsPanel?.querySelector(
      '[data-selected-material-control="color"]',
    )
    const emissiveColorControl = materialsPanel?.querySelector(
      '[data-selected-material-control="emissive"]',
    )
    expect(
      baseColorControl?.querySelector('[aria-label="Expanded base color controls"]'),
    ).not.toBeNull()
    expect(
      emissiveColorControl?.querySelector('[aria-label="Expanded emissive color controls"]'),
    ).not.toBeNull()
    expect(baseColorControl?.querySelector('[data-selected-material-color-control="red"]')).not.toBeNull()
    expect(
      baseColorControl?.querySelector('[data-selected-material-color-control="hue"]'),
    ).not.toBeNull()
    expect(
      baseColorControl?.querySelector('[data-selected-material-color-control="saturation"]'),
    ).not.toBeNull()
    expect(
      baseColorControl?.querySelector('[data-selected-material-color-control="brightness"]'),
    ).not.toBeNull()
    expect(
      emissiveColorControl?.querySelector('[data-selected-material-color-control="red"]'),
    ).not.toBeNull()
    expect(
      emissiveColorControl?.querySelector('[data-selected-material-color-control="hue"]'),
    ).not.toBeNull()
    expect(
      emissiveColorControl?.querySelector('[data-selected-material-color-control="saturation"]'),
    ).not.toBeNull()
    expect(
      emissiveColorControl?.querySelector('[data-selected-material-color-control="brightness"]'),
    ).not.toBeNull()

    const nameInput = materialsPanel?.querySelector(
      'input[aria-label="Edit material name"]',
    ) as HTMLInputElement | null
    const colorInput = materialsPanel?.querySelector(
      'input[aria-label="Edit base color"]',
    ) as HTMLInputElement | null
    const emissiveInput = materialsPanel?.querySelector(
      'input[aria-label="Edit emissive color"]',
    ) as HTMLInputElement | null
    expect(emissiveInput?.value).toBe('#ffffff')
    const increaseMetalnessButton = materialsPanel?.querySelector(
      'button[aria-label="Increase Metalness"]',
    ) as HTMLButtonElement | null
    const transparentSelect = materialsPanel?.querySelector(
      'select[aria-label="Transparency"]',
    ) as HTMLSelectElement | null
    const doubleSidedSelect = materialsPanel?.querySelector(
      'select[aria-label="Rendering"]',
    ) as HTMLSelectElement | null
    const increaseRedButton = materialsPanel?.querySelector(
      'button[aria-label="Increase R"]',
    ) as HTMLButtonElement | null
    const increaseHueButton = baseColorControl?.querySelector(
      'button[aria-label="Increase Hue"]',
    ) as HTMLButtonElement | null
    await act(async () => {
      increaseHueButton?.click()
    })

    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'default_matte')?.color,
    ).not.toBe('#5f83d6')

    await act(async () => {
      if (emissiveInput !== null) {
        emissiveInput.value = '#123456'
        emissiveInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    const updatedEmissiveColorControl = materialsPanel?.querySelector(
      '[data-selected-material-control="emissive"]',
    )
    const increaseEmissiveHueButton = updatedEmissiveColorControl?.querySelector(
      'button[aria-label="Increase Hue"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      increaseEmissiveHueButton?.click()
    })

    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'default_matte')?.emissive,
    ).not.toBe('#123456')

    await act(async () => {
      increaseRedButton?.click()
      if (nameInput !== null) {
        nameInput.value = 'Edited Matte'
        nameInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      if (colorInput !== null) {
        colorInput.value = '#123456'
        colorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      increaseMetalnessButton?.click()
      if (transparentSelect !== null) {
        transparentSelect.value = 'transparent'
        transparentSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (doubleSidedSelect !== null) {
        doubleSidedSelect.value = 'front'
        doubleSidedSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const editedPreset = useUiPrefsStore
      .getState()
      .view.materials.presets.find((preset) => preset.id === 'default_matte')
    expect(editedPreset).toMatchObject({
      name: 'Edited Matte',
      color: '#123456',
      transparent: true,
      doubleSided: false,
    })
    expect(editedPreset?.emissive).not.toBe('#000000')
    expect(editedPreset?.metalness).toBeGreaterThan(0.05)
    expect(editHistoryStore.getUndoEntries().length).toBeGreaterThanOrEqual(6)
    expect(
      editHistoryStore
        .getUndoEntries()
        .every((entry) => entry.source.surface === 'viewer-material'),
    ).toBe(true)
    expect(materialsPanel?.textContent).toContain('Edited Matte')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual({
      kind: 'object',
      objectId: 'editable-material-object-1',
    })
  })

  it('creates, assigns, and duplicates selected-target materials through owner actions', async () => {
    await act(async () => {
      useAppStore.setState((state) => ({
        projectContent: {
          ...state.projectContent,
          objectsById: {
            ...state.projectContent.objectsById,
            'material-action-object-1': {
              objectId: 'material-action-object-1',
              ownerGraphDocumentId: 'graph-document-actions',
              parentComponentId: 'component-1',
              objectSourceKind: 'published-object',
              sourceGraphDocumentId: 'graph-document-actions',
              sourceOutputEntryId: 'output-entry-actions',
              sourceNodeId: 'node-1',
              slotId: null,
              label: 'Material Action Object',
              resolutionState: 'resolved',
            },
          },
        },
      }))
    })
    await setSelectedTarget({
      kind: 'object',
      objectId: 'material-action-object-1',
    })

    await renderSurface()

    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null
    const projectMaterialActions = materialsPanel?.querySelector(
      '[aria-label="Project material actions"]',
    )
    const projectMaterialSearch = materialsPanel?.querySelector(
      'input[aria-label="Search project materials"]',
    ) as HTMLInputElement | null
    const newMaterialButton = projectMaterialActions?.querySelector(
      '[data-material-action="New Material"]',
    ) as HTMLButtonElement | null
    const duplicateMaterialButton = projectMaterialActions?.querySelector(
      '[data-material-action="Duplicate Material"]',
    ) as HTMLButtonElement | null
    const projectMaterialList = materialsPanel?.querySelector(
      '[data-project-material-list="compact"]',
    ) as HTMLDivElement | null
    const projectMaterialListResizeHandle = materialsPanel?.querySelector(
      '[data-project-material-list-resize-handle="bottom"]',
    ) as HTMLDivElement | null
    const brushedMetalProjectRow = materialsPanel?.querySelector(
      '[data-project-material-row="brushed_metal"]',
    ) as HTMLButtonElement | null

    expect(projectMaterialSearch).not.toBeNull()

    await act(async () => {
      if (projectMaterialSearch !== null) {
        projectMaterialSearch.value = 'brushed'
        projectMaterialSearch.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    expect(materialsPanel?.querySelector('[data-project-material-row="default_matte"]')).toBeNull()
    expect(materialsPanel?.querySelector('[data-project-material-row="brushed_metal"]')).not.toBeNull()

    await act(async () => {
      if (projectMaterialSearch !== null) {
        projectMaterialSearch.value = ''
        projectMaterialSearch.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    await act(async () => {
      projectMaterialListResizeHandle?.dispatchEvent(
        new MouseEvent('mousedown', { bubbles: true, clientY: 100 }),
      )
    })

    await act(async () => {
      document.dispatchEvent(new MouseEvent('mousemove', { bubbles: true, clientY: 136 }))
      document.dispatchEvent(new MouseEvent('mouseup', { bubbles: true }))
    })

    expect(projectMaterialListResizeHandle?.getAttribute('aria-valuenow')).toBe('150')
    expect(projectMaterialList?.style.getPropertyValue('--properties-project-material-list-height')).toBe(
      '150px',
    )

    vi.spyOn(Date, 'now').mockReturnValue(1700000000000)
    await act(async () => {
      newMaterialButton?.click()
    })

    expect(projectMaterialListResizeHandle?.getAttribute('aria-valuenow')).toBe('150')
    expect(projectMaterialList?.style.getPropertyValue('--properties-project-material-list-height')).toBe(
      '150px',
    )
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1700000000000')
    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'graph-document-actions:output-entry-actions': 'mat_1700000000000',
    })
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'mat_1700000000000'),
    ).toMatchObject({
      name: 'New Material',
    })

    await act(async () => {
      brushedMetalProjectRow?.click()
    })

    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'graph-document-actions:output-entry-actions': 'brushed_metal',
    })

    vi.spyOn(Date, 'now').mockReturnValue(1800000000000)
    await act(async () => {
      duplicateMaterialButton?.click()
    })

    expect(projectMaterialListResizeHandle?.getAttribute('aria-valuenow')).toBe('150')
    expect(projectMaterialList?.style.getPropertyValue('--properties-project-material-list-height')).toBe(
      '150px',
    )
    expect(useUiPrefsStore.getState().view.materials.selectedPresetId).toBe('mat_1800000000000')
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'graph-document-actions:output-entry-actions': 'mat_1800000000000',
    })
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === 'mat_1800000000000'),
    ).toMatchObject({
      name: 'Brushed Metal Copy',
      color: '#afb5bf',
    })
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.label)).toEqual([
      'Create and assign material',
      'Assign material',
      'Duplicate and assign material',
    ])
  })

  it('creates and assigns materials against a whole imported object fallback target', async () => {
    const referenceId = 'properties-reference-whole'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Whole Imported Shoe',
      fileType: 'glb',
      assetPath: 'blob:properties-reference-whole',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: null,
      directPartSourceGroupId: null,
      explodedFromReferenceId: null,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }

    await act(async () => {
      useAppStore.setState((state) => ({
        referenceWorkspace: {
          ...state.referenceWorkspace,
          importedReferencesById: {
            ...state.referenceWorkspace.importedReferencesById,
            [referenceId]: importedReference,
          },
          importedReferenceOrder: [...state.referenceWorkspace.importedReferenceOrder, referenceId],
          partRowsByReferenceId: {
            ...state.referenceWorkspace.partRowsByReferenceId,
            [referenceId]: [],
          },
        },
      }))
    })
    await setSelectedTarget({
      kind: 'object',
      objectId: buildImportedReferenceRowId(referenceId),
    })

    await renderSurface()

    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null
    const fallbackTargetRow = materialsPanel?.querySelector(
      '[data-material-target-row="reference-object:properties-reference-whole"]',
    ) as HTMLButtonElement | null
    const oddButton = materialsPanel?.querySelector(
      '[data-material-group-action="odd"]',
    ) as HTMLButtonElement | null
    const brushedMetalProjectRow = materialsPanel?.querySelector(
      '[data-project-material-row="brushed_metal"]',
    ) as HTMLButtonElement | null

    expect(fallbackTargetRow).not.toBeNull()
    expect(materialsPanel?.textContent).toContain('Whole Imported Shoe')
    expect(materialsPanel?.textContent).toContain('Whole imported object')
    expect(oddButton?.disabled).toBe(true)

    await act(async () => {
      brushedMetalProjectRow?.click()
    })

    expect(useUiPrefsStore.getState().view.materials.usePerPart).toBe(true)
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'reference-object:properties-reference-whole': 'brushed_metal',
    })
  })

  it('assigns the selected material to grouped reference target rows through material history', async () => {
    const referenceId = 'properties-reference-groups'
    const importedReference: ImportedReferenceRecord = {
      referenceId,
      sourceKind: 'imported',
      categoryId: 'user-references',
      label: 'Imported Group Footpad',
      fileType: 'obj',
      assetPath: 'blob:properties-reference-groups',
      parentAssemblyId: null,
      parentComponentId: null,
      directPartSourceKind: null,
      directPartSourceGroupId: null,
      explodedFromReferenceId: null,
      sourcePartKey: null,
      sourceMeshIndex: null,
    }

    await act(async () => {
      useAppStore.setState((state) => ({
        referenceWorkspace: {
          ...state.referenceWorkspace,
          importedReferencesById: {
            ...state.referenceWorkspace.importedReferencesById,
            [referenceId]: importedReference,
          },
          importedReferenceOrder: [...state.referenceWorkspace.importedReferenceOrder, referenceId],
          partRowsByReferenceId: {
            ...state.referenceWorkspace.partRowsByReferenceId,
            [referenceId]: [
              {
                rowId: 'reference-part-row-1',
                partKey: 'reference-part:properties-reference-groups:0',
                label: 'Steel Satin',
                sourceMeshIndex: 0,
              },
              {
                rowId: 'reference-part-row-2',
                partKey: 'reference-part:properties-reference-groups:1',
                label: 'Opaque A',
                sourceMeshIndex: 1,
              },
              {
                rowId: 'reference-part-row-3',
                partKey: 'reference-part:properties-reference-groups:2',
                label: 'Opaque B',
                sourceMeshIndex: 2,
              },
            ],
          },
        },
      }))
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          materials: {
            presets: DEFAULT_VIEW_SETTINGS.materials.presets,
            selectedPresetId: 'default_matte',
            usePerPart: true,
            perPart: {
              'reference-part:properties-reference-groups:0': 'brushed_metal',
              'reference-part:properties-reference-groups:1': 'highlight_gloss',
              'reference-part:properties-reference-groups:2': 'default_matte',
            },
          },
        },
      }))
    })
    await setSelectedTarget({
      kind: 'object',
      objectId: buildImportedReferenceRowId(referenceId),
    })

    await renderSurface()

    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null
    const groupedMaterialActions = materialsPanel?.querySelector(
      '[aria-label="Grouped material actions"]',
    )
    const evenButton = groupedMaterialActions?.querySelector(
      '[data-material-group-action="even"]',
    ) as HTMLButtonElement | null
    const oddButton = groupedMaterialActions?.querySelector(
      '[data-material-group-action="odd"]',
    ) as HTMLButtonElement | null

    expect(evenButton?.disabled).toBe(false)
    expect(oddButton?.disabled).toBe(false)

    await act(async () => {
      evenButton?.click()
    })

    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'reference-part:properties-reference-groups:0': 'brushed_metal',
      'reference-part:properties-reference-groups:1': 'brushed_metal',
      'reference-part:properties-reference-groups:2': 'default_matte',
    })
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.label)).toEqual([
      'Assign To Evens material',
    ])

    await act(async () => {
      editHistoryStore.undo()
      oddButton?.click()
    })

    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      'reference-part:properties-reference-groups:0': 'brushed_metal',
      'reference-part:properties-reference-groups:1': 'highlight_gloss',
      'reference-part:properties-reference-groups:2': 'brushed_metal',
    })
    expect(editHistoryStore.getUndoEntries().map((entry) => entry.label)).toEqual([
      'Assign To Odds material',
    ])
  })

  it('keeps the hosted materials section active even when no focused item exists yet', async () => {
    await renderSurface()

    const surface = container?.querySelector('.PropertiesSurface') as HTMLDivElement | null
    const materialsTab = container?.querySelector(
      '#properties-section-tab-materials',
    ) as HTMLButtonElement | null
    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-properties-focus-state')).toBe('empty')
    expect(surface?.getAttribute('data-properties-shell-state')).toBe('empty')
    expect(surface?.getAttribute('data-properties-active-section')).toBe('none')
    expect(materialsTab?.disabled).toBe(true)
    expect(materialsPanel?.textContent).toContain('No focused item')
    expect(materialsPanel?.textContent).toContain('Select an object')
  })

  it('renders a shell-owned unsupported state when the focused target cannot open materials yet', async () => {
    await setSelectedTarget({
      kind: 'graph-node',
      graphDocumentId: 'graph-document-1',
      nodeId: 'graph-node-1',
    })

    await renderSurface()

    const surface = container?.querySelector('.PropertiesSurface') as HTMLDivElement | null
    const materialsTab = container?.querySelector(
      '#properties-section-tab-materials',
    ) as HTMLButtonElement | null
    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-properties-shell-state')).toBe('unsupported')
    expect(surface?.getAttribute('data-properties-active-section')).toBe('none')
    expect(materialsTab?.disabled).toBe(true)
    expect(materialsPanel?.textContent).toContain('Focused item not supported yet')
    expect(materialsPanel?.textContent).toContain('Graph node')
    expect(materialsPanel?.textContent).toContain('graph-document-1 / graph-node-1')
  })
})
