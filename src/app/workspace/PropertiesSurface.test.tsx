// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import {
  CLAY_STUDIO_CONTACT_SHADOW_SETTINGS,
  CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE,
  DEFAULT_RENDER_PREVIEW_SETTINGS,
  DEFAULT_VIEW_SETTINGS,
  createRenderPreviewQualityPresetSettings,
  createViewAmbientOcclusionPresetSettings,
  type GridPresentationSettings,
} from '../../shared/viewSettingsTypes'
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
        workspacePanelShellPaddingPx:
          useUiPrefsStore.getInitialState().workspacePanelShellPaddingPx,
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
      useUiPrefsStore.getState().setWorkspacePanelShellPaddingPx(10)
    })
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
    const sharedShell = container?.querySelector(
      '[data-workspace-panel-shell="properties"]',
    ) as HTMLDivElement | null
    const shellResizeHandle = container?.querySelector(
      '[aria-label="Resize Properties sections panel"]',
    ) as HTMLDivElement | null
    const tablist = container?.querySelector('[role="tablist"]') as HTMLDivElement | null
    const materialsTab = container?.querySelector(
      '#properties-section-tab-materials',
    ) as HTMLButtonElement | null
    const materialsPanel = container?.querySelector(
      '#properties-section-panel-materials',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-properties-active-section')).toBe('materials')
    expect(surface?.style.getPropertyValue('--settings-surface-panel-shell-padding')).toBe('10px')
    expect(sharedShell).not.toBeNull()
    expect(sharedShell?.classList.contains('WorkspacePanelSplitShell')).toBe(true)
    expect(shellResizeHandle?.getAttribute('role')).toBe('separator')
    expect(shellResizeHandle?.getAttribute('aria-orientation')).toBe('vertical')
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
    expect(focusedObjectListResizeHandle?.getAttribute('aria-orientation')).toBe('horizontal')
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

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([firstTarget])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual(firstTarget)
    expect(firstFocusedRow?.getAttribute('data-properties-focused-object-active')).toBe('false')
    expect(secondFocusedRow?.getAttribute('data-properties-focused-object-active')).toBe('true')
    expect(secondFocusedRow?.getAttribute('data-properties-focused-object-included')).toBe('false')
    expect(
      container
        ?.querySelector('[aria-label="Properties materials section"]')
        ?.getAttribute('data-material-assignment-target-count'),
    ).toBe('1')
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

  it('unhighlights focused material objects for assignment while keeping them in the focused list', async () => {
    const { firstTarget, leftPartKey } = await setTwoFocusedMaterialObjects()
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
    expect(
      container?.querySelector('[data-properties-focused-object-row="properties-include-object-2"]'),
    ).not.toBeNull()
    expect(getMaterialsSection()?.getAttribute('data-material-assignment-target-count')).toBe('1')
    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.explicitSelectedTargets).toEqual([firstTarget])
    expect(useAppStore.getState().workspaceSelection.selectionAnchorTarget).toEqual(firstTarget)
    expect(useAppStore.getState().workspaceSelection.resolvedContentSelection?.partKeys).toEqual([
      leftPartKey,
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
    const { firstTarget, leftPartKey } = await setTwoFocusedMaterialObjects()
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

    expect(useAppStore.getState().workspaceSelection.selectedTarget).toEqual(firstTarget)
    expect(secondFocusButton?.getAttribute('data-properties-focused-object-active')).toBe('true')
    expect(secondFocusButton?.getAttribute('data-properties-focused-object-included')).toBe('false')

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

  it('edits mixed selected material scalar values for included focused objects', async () => {
    const { leftPartKey, rightPartKey } = await setTwoFocusedMaterialObjects()
    const leftPreset = {
      ...DEFAULT_VIEW_SETTINGS.materials.presets[0]!,
      id: 'mixed-left-material',
      name: 'Mixed Left Material',
      color: '#101010',
      metalness: 0.2,
      roughness: 0.4,
    }
    const rightPreset = {
      ...DEFAULT_VIEW_SETTINGS.materials.presets[0]!,
      id: 'mixed-right-material',
      name: 'Mixed Right Material',
      color: '#202020',
      metalness: 0.8,
      roughness: 0.4,
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          materials: {
            ...state.view.materials,
            presets: [leftPreset, rightPreset],
            selectedPresetId: leftPreset.id,
            usePerPart: true,
            perPart: {
              [leftPartKey]: leftPreset.id,
              [rightPartKey]: rightPreset.id,
            },
          },
        },
      }))
    })

    await renderSurface()

    const materialEditor = container?.querySelector(
      '[data-selected-material-editor="compact"]',
    ) as HTMLDivElement | null
    const nameControl = container?.querySelector(
      '[data-selected-material-control="name"]',
    ) as HTMLElement | null
    const metalnessControl = container?.querySelector(
      '[data-selected-material-control="metalness"]',
    ) as HTMLElement | null
    const roughnessControl = container?.querySelector(
      '[data-selected-material-control="roughness"]',
    ) as HTMLElement | null
    const increaseMetalnessButton = metalnessControl?.querySelector(
      'button[aria-label="Increase Metalness"]',
    ) as HTMLButtonElement | null
    const createOnMultiEditToggle = container?.querySelector(
      'input[aria-label="Create new material on multi edit"]',
    ) as HTMLInputElement | null
    const leftProjectMaterialRow = container?.querySelector(
      '[data-project-material-row="mixed-left-material"]',
    ) as HTMLButtonElement | null
    const rightProjectMaterialRow = container?.querySelector(
      '[data-project-material-row="mixed-right-material"]',
    ) as HTMLButtonElement | null

    expect(materialEditor?.getAttribute('data-selected-material-read-source')).toBe('mixed')
    expect(createOnMultiEditToggle?.checked).toBe(false)
    expect(leftProjectMaterialRow?.getAttribute('data-project-material-selected')).toBe('true')
    expect(rightProjectMaterialRow?.getAttribute('data-project-material-selected')).toBe('true')
    expect(nameControl?.getAttribute('data-selected-material-field-state')).toBe('mixed')
    expect(metalnessControl?.getAttribute('data-selected-material-field-state')).toBe('mixed')
    expect(roughnessControl?.getAttribute('data-selected-material-field-state')).toBe('value')
    expect(nameControl?.textContent).toContain('Multiple values')
    expect(metalnessControl?.textContent).toContain('Multiple values')
    expect(increaseMetalnessButton?.disabled).toBe(false)

    await act(async () => {
      increaseMetalnessButton?.click()
    })

    const materialsAfterEdit = useUiPrefsStore.getState().view.materials
    expect(materialsAfterEdit.perPart).toEqual({
      [leftPartKey]: leftPreset.id,
      [rightPartKey]: rightPreset.id,
    })
    expect(materialsAfterEdit.presets).toHaveLength(2)
    expect(materialsAfterEdit.presets.find((preset) => preset.id === leftPreset.id)).toMatchObject({
      color: leftPreset.color,
      metalness: 0.21,
    })
    expect(materialsAfterEdit.presets.find((preset) => preset.id === rightPreset.id)).toMatchObject({
      color: rightPreset.color,
      metalness: 0.21,
    })
    expect(editHistoryStore.getUndoEntries()).toMatchObject([
      {
        label: 'Edit selected material objects',
        targetLabel: 'Selected material objects',
      },
    ])

    const updatedMetalnessControl = container?.querySelector(
      '[data-selected-material-control="metalness"]',
    ) as HTMLElement | null
    expect(updatedMetalnessControl?.getAttribute('data-selected-material-field-state')).toBe('value')
    expect(updatedMetalnessControl?.textContent).not.toContain('Multiple values')

    await act(async () => {
      editHistoryStore.undo()
    })
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      [leftPartKey]: leftPreset.id,
      [rightPartKey]: rightPreset.id,
    })
    expect(
      useUiPrefsStore
        .getState()
        .view.materials.presets.find((preset) => preset.id === leftPreset.id)?.metalness,
    ).toBe(leftPreset.metalness)

    await act(async () => {
      editHistoryStore.redo()
    })
    expect(useUiPrefsStore.getState().view.materials.perPart).toEqual({
      [leftPartKey]: leftPreset.id,
      [rightPartKey]: rightPreset.id,
    })
  })

  it('edits mixed selected material base colors for included focused objects', async () => {
    const { leftPartKey, rightPartKey } = await setTwoFocusedMaterialObjects()
    const leftPreset = {
      ...DEFAULT_VIEW_SETTINGS.materials.presets[0]!,
      id: 'mixed-color-left-material',
      name: 'Mixed Color Left Material',
      color: '#101010',
      metalness: 0.2,
    }
    const rightPreset = {
      ...DEFAULT_VIEW_SETTINGS.materials.presets[0]!,
      id: 'mixed-color-right-material',
      name: 'Mixed Color Right Material',
      color: '#202020',
      metalness: 0.8,
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          materials: {
            ...state.view.materials,
            presets: [leftPreset, rightPreset],
            selectedPresetId: leftPreset.id,
            usePerPart: true,
            perPart: {
              [leftPartKey]: leftPreset.id,
              [rightPartKey]: rightPreset.id,
            },
          },
        },
      }))
    })

    await renderSurface()

    const colorControl = container?.querySelector(
      '[data-selected-material-control="color"]',
    ) as HTMLElement | null
    const colorInput = colorControl?.querySelector(
      'input[aria-label="Edit base color"]',
    ) as HTMLInputElement | null
    const createOnMultiEditToggle = container?.querySelector(
      'input[aria-label="Create new material on multi edit"]',
    ) as HTMLInputElement | null

    expect(colorControl?.getAttribute('data-selected-material-field-state')).toBe('mixed')
    expect(colorInput?.disabled).toBe(false)
    expect(createOnMultiEditToggle?.checked).toBe(false)

    await act(async () => {
      if (colorInput !== null) {
        colorInput.value = '#abcdef'
        colorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
    })

    const materialsAfterEdit = useUiPrefsStore.getState().view.materials
    expect(materialsAfterEdit.perPart).toEqual({
      [leftPartKey]: leftPreset.id,
      [rightPartKey]: rightPreset.id,
    })
    expect(materialsAfterEdit.presets).toHaveLength(2)
    expect(materialsAfterEdit.presets.find((preset) => preset.id === leftPreset.id)).toMatchObject({
      color: '#abcdef',
      metalness: leftPreset.metalness,
    })
    expect(materialsAfterEdit.presets.find((preset) => preset.id === rightPreset.id)).toMatchObject({
      color: '#abcdef',
      metalness: rightPreset.metalness,
    })
  })

  it('creates material copies for multi edit only when the toggle is enabled', async () => {
    const { leftPartKey, rightPartKey } = await setTwoFocusedMaterialObjects()
    const leftPreset = {
      ...DEFAULT_VIEW_SETTINGS.materials.presets[0]!,
      id: 'copy-toggle-left-material',
      name: 'Copy Toggle Left Material',
      color: '#101010',
      metalness: 0.2,
    }
    const rightPreset = {
      ...DEFAULT_VIEW_SETTINGS.materials.presets[0]!,
      id: 'copy-toggle-right-material',
      name: 'Copy Toggle Right Material',
      color: '#202020',
      metalness: 0.8,
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          materials: {
            ...state.view.materials,
            presets: [leftPreset, rightPreset],
            selectedPresetId: leftPreset.id,
            usePerPart: true,
            perPart: {
              [leftPartKey]: leftPreset.id,
              [rightPartKey]: rightPreset.id,
            },
          },
        },
      }))
    })

    await renderSurface()

    const createOnMultiEditToggle = container?.querySelector(
      'input[aria-label="Create new material on multi edit"]',
    ) as HTMLInputElement | null
    const metalnessControl = container?.querySelector(
      '[data-selected-material-control="metalness"]',
    ) as HTMLElement | null
    const increaseMetalnessButton = metalnessControl?.querySelector(
      'button[aria-label="Increase Metalness"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      createOnMultiEditToggle?.click()
    })

    expect(createOnMultiEditToggle?.checked).toBe(true)
    vi.spyOn(Date, 'now').mockReturnValue(2200000000000)

    await act(async () => {
      increaseMetalnessButton?.click()
    })

    const materialsAfterEdit = useUiPrefsStore.getState().view.materials
    expect(materialsAfterEdit.perPart).toEqual({
      [leftPartKey]: 'mat_2200000000000',
      [rightPartKey]: 'mat_2200000000001',
    })
    expect(materialsAfterEdit.presets.find((preset) => preset.id === leftPreset.id)?.metalness).toBe(
      leftPreset.metalness,
    )
    expect(materialsAfterEdit.presets.find((preset) => preset.id === 'mat_2200000000000')).toMatchObject({
      color: leftPreset.color,
      metalness: 0.21,
    })
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

  it('keeps render settings available even when no focused item exists yet', async () => {
    await renderSurface()

    const surface = container?.querySelector('.PropertiesSurface') as HTMLDivElement | null
    const materialsTab = container?.querySelector(
      '#properties-section-tab-materials',
    ) as HTMLButtonElement | null
    const renderTab = container?.querySelector(
      '#properties-section-tab-render',
    ) as HTMLButtonElement | null
    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-properties-focus-state')).toBe('empty')
    expect(surface?.getAttribute('data-properties-shell-state')).toBe('ready')
    expect(surface?.getAttribute('data-properties-active-section')).toBe('render')
    expect(materialsTab?.disabled).toBe(true)
    expect(renderTab?.disabled).toBe(false)
    expect(renderTab?.getAttribute('aria-selected')).toBe('true')
    expect(renderPanel?.textContent).toContain('Viewport presentation')
    expect(renderPanel?.textContent).toContain('Environment')
    expect(renderPanel?.textContent).toContain('Shadows')
    expect(renderPanel?.textContent).toContain('Ground')
    expect(renderPanel?.textContent).toContain('Grid')
    expect(renderPanel?.textContent).toContain('Render Preview quality')
    expect(renderPanel?.textContent).toContain('Exposure')
    expect(renderPanel?.textContent).toContain('Contrast')
    expect(renderPanel?.textContent).toContain('Saturation')
    expect(renderPanel?.textContent).toContain('Samples')
    const renderGroupHeaders = Array.from(
      renderPanel?.querySelectorAll('.SettingsSurfaceGroupHeader') ?? [],
    )
    const viewportPresentationHeader = renderGroupHeaders.find((header) =>
      header.textContent?.includes('Viewport presentation'),
    )
    const shadowsHeader = renderGroupHeaders.find((header) =>
      header.textContent?.includes('Shadows'),
    )
    expect(viewportPresentationHeader?.nextElementSibling?.textContent).not.toContain(
      'Ambient Occlusion',
    )
    expect(shadowsHeader?.nextElementSibling?.textContent).toContain('Ambient Occlusion')
  })

  it('keeps render active when the focused target cannot open materials yet', async () => {
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
    const renderTab = container?.querySelector(
      '#properties-section-tab-render',
    ) as HTMLButtonElement | null
    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null

    expect(surface?.getAttribute('data-properties-shell-state')).toBe('ready')
    expect(surface?.getAttribute('data-properties-active-section')).toBe('render')
    expect(materialsTab?.disabled).toBe(true)
    expect(renderTab?.disabled).toBe(false)
    expect(renderPanel?.textContent).toContain('Render Preview quality')
    expect(renderPanel?.textContent).not.toContain('Focused item not supported yet')
  })

  it('writes render preview settings from the Properties Render section', async () => {
    await renderSurface()

    const qualityPresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Quality preset"]',
    ) as HTMLSelectElement | null
    const sampleIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Samples"]',
    ) as HTMLButtonElement | null
    const noiseCleanupSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Noise cleanup"]',
    ) as HTMLSelectElement | null
    const gpuLoadSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="GPU load"]',
    ) as HTMLSelectElement | null

    expect(qualityPresetSelect?.value).toBe('balanced')

    await act(async () => {
      sampleIncreaseButton?.click()
    })

    expect(useUiPrefsStore.getState().view.renderPreview.targetSamples).toBe(
      DEFAULT_RENDER_PREVIEW_SETTINGS.targetSamples + 8,
    )
    expect(qualityPresetSelect?.value).toBe('custom')

    await act(async () => {
      if (noiseCleanupSelect !== null) {
        noiseCleanupSelect.value = 'medium'
        noiseCleanupSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      if (gpuLoadSelect !== null) {
        gpuLoadSelect.value = 'fast'
        gpuLoadSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.renderPreview).toEqual({
      ...DEFAULT_RENDER_PREVIEW_SETTINGS,
      targetSamples: DEFAULT_RENDER_PREVIEW_SETTINGS.targetSamples + 8,
      noiseCleanup: 'medium',
      gpuLoad: 'fast',
    })
  })

  it('writes viewport style from the Properties Render section', async () => {
    await renderSurface()

    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null
    const displayModeSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Display Mode"]',
    ) as HTMLSelectElement | null
    const viewportStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Render Preset"]',
    ) as HTMLSelectElement | null
    const qualityPresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Quality preset"]',
    ) as HTMLSelectElement | null

    expect(renderPanel?.textContent).toContain('Viewport presentation')
    expect(renderPanel?.textContent).toContain('Environment')
    expect(renderPanel?.textContent).toContain('View settings grade')
    expect(renderPanel?.textContent).toContain('Uses the saved environment grade')
    expect(renderPanel?.textContent).toContain('Render Preview quality')
    expect(displayModeSelect?.value).toBe('rendered')
    expect(viewportStyleSelect?.value).toBe('standard')
    expect(qualityPresetSelect?.value).toBe('balanced')

    await act(async () => {
      if (viewportStyleSelect !== null) {
        viewportStyleSelect.value = 'clayStudio'
        viewportStyleSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const clayView = useUiPrefsStore.getState().view
    expect(clayView.viewportStyle).toBe('clayStudio')
    expect(clayView.displayMode).toBe('rendered')
    expect(clayView.environmentGrade).toEqual(CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE)
    expect(clayView.shadowsEnabled).toBe(false)
    expect(clayView.ground.enabled).toBe(true)
    expect(clayView.gridVisible).toBe(false)
    expect(clayView.postProcessing).toEqual(createViewAmbientOcclusionPresetSettings('medium'))

    await act(async () => {
      if (displayModeSelect !== null) {
        displayModeSelect.value = 'wireframe'
        displayModeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.displayMode).toBe('wireframe')
    expect(useUiPrefsStore.getState().view.viewportStyle).toBe('clayStudio')
    expect(useUiPrefsStore.getState().view.renderPreview).toEqual(
      DEFAULT_RENDER_PREVIEW_SETTINGS,
    )

    await act(async () => {
      if (viewportStyleSelect !== null) {
        viewportStyleSelect.value = 'standard'
        viewportStyleSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const standardView = useUiPrefsStore.getState().view
    expect(standardView.viewportStyle).toBe('standard')
    expect(standardView.displayMode).toBe('wireframe')
    expect(standardView.environmentGrade).toEqual(DEFAULT_VIEW_SETTINGS.environmentGrade)
    expect(standardView.shadowsEnabled).toBe(DEFAULT_VIEW_SETTINGS.shadowsEnabled)
    expect(standardView.ground).toEqual(DEFAULT_VIEW_SETTINGS.ground)
    expect(standardView.gridVisible).toBe(DEFAULT_VIEW_SETTINGS.gridVisible)
    expect(standardView.gridPresentation).toEqual(DEFAULT_VIEW_SETTINGS.gridPresentation)
    expect(standardView.postProcessing).toEqual(DEFAULT_VIEW_SETTINGS.postProcessing)
  })

  it('applies built-in render preset values without disturbing other Render controls', async () => {
    const environmentGrade = {
      ...DEFAULT_VIEW_SETTINGS.environmentGrade,
      exposure: 1.77,
      contrast: 1.12,
    }
    const ground = {
      ...DEFAULT_VIEW_SETTINGS.ground,
      enabled: true,
      height: 2.5,
      materialPresetId: 'glossy_studio' as const,
    }
    const gridPresentation: GridPresentationSettings = {
      ...DEFAULT_VIEW_SETTINGS.gridPresentation,
      height: 1.5,
      layers: DEFAULT_VIEW_SETTINGS.gridPresentation.layers.map((layer) => ({ ...layer })),
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          viewportStyle: 'standard',
          environmentGrade,
          shadowsEnabled: false,
          ground,
          gridVisible: true,
          gridPresentation,
        },
      }))
    })

    await renderSurface()

    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null
    const viewportStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Render Preset"]',
    ) as HTMLSelectElement | null
    const ambientOcclusionSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Ambient Occlusion"]',
    ) as HTMLSelectElement | null
    const sampleIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Samples"]',
    ) as HTMLButtonElement | null

    expect(renderPanel?.textContent).toContain('View settings grade')
    expect(renderPanel?.textContent).toContain('Uses the saved environment grade')
    expect(renderPanel?.textContent).toContain('Uses the saved shadow setting')
    expect(renderPanel?.textContent).toContain('On at 2.50')
    expect(renderPanel?.textContent).toContain('On at 1.5')
    expect(renderPanel?.textContent).toContain('Selected Light Shadows')
    expect(renderPanel?.textContent).toContain('Ground Height')
    expect(renderPanel?.textContent).toContain('Grid Height')
    expect(
      renderPanel?.querySelector('[data-properties-render-readback="environment"]'),
    ).not.toBeNull()
    expect(
      renderPanel?.querySelector('[data-properties-render-readback="shadows"]'),
    ).not.toBeNull()
    expect(
      renderPanel?.querySelector('[data-properties-render-readback="ground"]'),
    ).not.toBeNull()
    expect(
      renderPanel?.querySelector('[data-properties-render-readback="grid"]'),
    ).not.toBeNull()

    await act(async () => {
      if (viewportStyleSelect !== null) {
        viewportStyleSelect.value = 'clayStudio'
        viewportStyleSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      if (ambientOcclusionSelect !== null) {
        ambientOcclusionSelect.value = 'medium'
        ambientOcclusionSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      sampleIncreaseButton?.click()
    })

    const view = useUiPrefsStore.getState().view
    expect(view.environmentGrade).toEqual(CLAY_STUDIO_RENDER_PRESET_ENVIRONMENT_GRADE)
    expect(view.shadowsEnabled).toBe(false)
    expect(view.ground).toEqual({
      ...ground,
      enabled: true,
    })
    expect(view.gridVisible).toBe(false)
    expect(view.gridPresentation).toEqual(gridPresentation)
    expect(view.viewportStyle).toBe('clayStudio')
    expect(view.postProcessing).toEqual(createViewAmbientOcclusionPresetSettings('medium'))
    expect(view.contactShadows).toEqual(CLAY_STUDIO_CONTACT_SHADOW_SETTINGS)
    expect(view.renderPreview.targetSamples).toBe(
      DEFAULT_RENDER_PREVIEW_SETTINGS.targetSamples + 8,
    )
  })

  it('writes View Toolbar shadow and ground settings from the Properties Render section', async () => {
    const environmentGrade = {
      ...DEFAULT_VIEW_SETTINGS.environmentGrade,
      exposure: 1.77,
      contrast: 1.12,
    }
    const ground = {
      ...DEFAULT_VIEW_SETTINGS.ground,
      enabled: true,
      height: 2.5,
      materialPresetId: 'glossy_studio' as const,
    }
    const lighting = {
      selectedLightId: 'key',
      lights: [
        {
          id: 'key',
          name: 'Key',
          type: 'directional' as const,
          enabled: true,
          color: '#ffffff',
          intensity: 1.25,
          castShadow: true,
          shadowBias: -0.0005,
          shadowMapSize: 1024,
        },
      ],
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          viewportStyle: 'standard',
          postProcessing: createViewAmbientOcclusionPresetSettings('medium'),
          environmentGrade,
          shadowsEnabled: false,
          ground,
          lighting,
        },
      }))
    })

    await renderSurface()

    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null
    const shadowsSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Shadows"]',
    ) as HTMLSelectElement | null
    const castShadowSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Cast Shadow"]',
    ) as HTMLSelectElement | null
    const shadowBiasIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Shadow Bias"]',
    ) as HTMLButtonElement | null
    const shadowMapSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Shadow Map"]',
    ) as HTMLSelectElement | null
    const contactShadowsSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Contact Shadows"]',
    ) as HTMLSelectElement | null
    const queryContactOpacityIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase Contact Opacity"]',
      ) as HTMLButtonElement | null
    const queryContactSpreadIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase Contact Spread"]',
      ) as HTMLButtonElement | null
    const queryContactHeightFadeIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase Contact Height Fade"]',
      ) as HTMLButtonElement | null
    const groundSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Ground"]',
    ) as HTMLSelectElement | null
    const groundHeightIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Ground Height"]',
    ) as HTMLButtonElement | null
    const materialSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Material"]',
    ) as HTMLSelectElement | null

    expect(shadowsSelect?.value).toBe('off')
    expect(castShadowSelect?.value).toBe('on')
    expect(shadowMapSelect?.value).toBe('1024')
    expect(contactShadowsSelect?.value).toBe('off')
    expect(renderPanel?.textContent).toContain('Contact Shadows')
    expect(renderPanel?.textContent).not.toContain('Contact Opacity')
    expect(renderPanel?.textContent).not.toContain('Contact Spread')
    expect(renderPanel?.textContent).not.toContain('Contact Height Fade')
    expect(queryContactOpacityIncreaseButton()).toBeNull()
    expect(groundSelect?.value).toBe('on')
    expect(materialSelect?.value).toBe('glossy_studio')

    await act(async () => {
      if (shadowsSelect !== null) {
        shadowsSelect.value = 'on'
        shadowsSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (castShadowSelect !== null) {
        castShadowSelect.value = 'off'
        castShadowSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      shadowBiasIncreaseButton?.click()
      if (shadowMapSelect !== null) {
        shadowMapSelect.value = '2048'
        shadowMapSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (contactShadowsSelect !== null) {
        contactShadowsSelect.value = 'on'
        contactShadowsSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(renderPanel?.textContent).toContain('Contact Opacity')
    expect(renderPanel?.textContent).toContain('Contact Spread')
    expect(renderPanel?.textContent).toContain('Contact Height Fade')

    await act(async () => {
      queryContactOpacityIncreaseButton()?.click()
      queryContactSpreadIncreaseButton()?.click()
      queryContactHeightFadeIncreaseButton()?.click()
      if (groundSelect !== null) {
        groundSelect.value = 'off'
        groundSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      groundHeightIncreaseButton?.click()
      if (materialSelect !== null) {
        materialSelect.value = 'matte_dark'
        materialSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const view = useUiPrefsStore.getState().view
    const selectedLight = view.lighting.lights.find((light) => light.id === 'key')
    expect(view.shadowsEnabled).toBe(true)
    expect(selectedLight?.castShadow).toBe(false)
    expect(selectedLight?.shadowBias).toBeCloseTo(-0.0004)
    expect(selectedLight?.shadowMapSize).toBe(2048)
    expect(view.contactShadows).toEqual({
      enabled: true,
      opacity: 1,
      spread: 1.01,
      heightFade: 8.5,
    })
    expect(view.ground).toEqual({
      enabled: false,
      height: 3,
      materialPresetId: 'matte_dark',
    })
    expect(view.environmentGrade).toEqual(environmentGrade)
    expect(view.postProcessing).toEqual(createViewAmbientOcclusionPresetSettings('medium'))
    expect(view.renderPreview).toEqual(DEFAULT_RENDER_PREVIEW_SETTINGS)
  })

  it('writes View Toolbar grid settings from the Properties Render section', async () => {
    const environmentGrade = {
      ...DEFAULT_VIEW_SETTINGS.environmentGrade,
      exposure: 1.77,
      contrast: 1.12,
    }
    const ground = {
      ...DEFAULT_VIEW_SETTINGS.ground,
      enabled: true,
      height: 2.5,
      materialPresetId: 'glossy_studio' as const,
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          viewportStyle: 'standard',
          postProcessing: createViewAmbientOcclusionPresetSettings('medium'),
          environmentGrade,
          shadowsEnabled: false,
          ground,
          gridVisible: false,
          gridPresentation: {
            ...DEFAULT_VIEW_SETTINGS.gridPresentation,
            height: 1.5,
            size: 300,
            layers: DEFAULT_VIEW_SETTINGS.gridPresentation.layers.map((layer) => ({ ...layer })),
          },
        },
      }))
    })

    await renderSurface()

    const gridSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Grid"]',
    ) as HTMLSelectElement | null
    const gridHeightIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid Height"]',
    ) as HTMLButtonElement | null
    const gridSizeIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid Size"]',
    ) as HTMLButtonElement | null
    const grid1LayerSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Grid 1 Layer"]',
    ) as HTMLSelectElement | null
    const grid1SpacingIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid 1 Spacing"]',
    ) as HTMLButtonElement | null
    const grid1ColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Grid 1 Color"]',
    ) as HTMLInputElement | null
    const grid1ColorExpandButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Expand Grid 1 color controls"]',
    ) as HTMLButtonElement | null
    const grid1OpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid 1 Opacity"]',
    ) as HTMLButtonElement | null
    const grid1HeightOffsetIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid 1 Height Offset"]',
    ) as HTMLButtonElement | null

    expect(gridSelect?.value).toBe('off')
    expect(grid1LayerSelect?.value).toBe('on')
    expect(grid1ColorInput?.value).toBe('#ffffff')
    expect(grid1ColorExpandButton?.getAttribute('aria-expanded')).toBe('false')

    await act(async () => {
      grid1ColorExpandButton?.click()
      if (gridSelect !== null) {
        gridSelect.value = 'on'
        gridSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      gridHeightIncreaseButton?.click()
      gridSizeIncreaseButton?.click()
      if (grid1LayerSelect !== null) {
        grid1LayerSelect.value = 'off'
        grid1LayerSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      grid1SpacingIncreaseButton?.click()
      if (grid1ColorInput !== null) {
        const valueSetter = Object.getOwnPropertyDescriptor(
          HTMLInputElement.prototype,
          'value',
        )?.set
        valueSetter?.call(grid1ColorInput, '#ff00aa')
        grid1ColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      grid1OpacityIncreaseButton?.click()
      grid1HeightOffsetIncreaseButton?.click()
    })

    const expandedGrid1ColorControls = container?.querySelector(
      '.PropertiesRenderSection [aria-label="Expanded Grid 1 color controls"]',
    )
    const grid1RedIncreaseButton = expandedGrid1ColorControls?.querySelector(
      'button[aria-label="Increase R"]',
    ) as HTMLButtonElement | null

    expect(grid1ColorExpandButton?.getAttribute('aria-expanded')).toBe('true')
    expect(expandedGrid1ColorControls).not.toBeNull()
    expect(
      expandedGrid1ColorControls?.querySelector('[data-selected-material-color-control="hue"]'),
    ).not.toBeNull()
    expect(grid1RedIncreaseButton?.disabled).toBe(false)

    const view = useUiPrefsStore.getState().view
    const grid1 = view.gridPresentation.layers.find((layer) => layer.id === 'grid1')
    expect(view.gridVisible).toBe(true)
    expect(view.gridPresentation.height).toBe(2)
    expect(view.gridPresentation.size).toBe(325)
    expect(grid1).toMatchObject({
      enabled: false,
      spacing: 1.1,
      color: '#ff00aa',
      opacity: 0.15,
      heightOffset: 0.001,
    })
    expect(view.environmentGrade).toEqual(environmentGrade)
    expect(view.shadowsEnabled).toBe(false)
    expect(view.ground).toEqual(ground)
    expect(view.postProcessing).toEqual(createViewAmbientOcclusionPresetSettings('medium'))
    expect(view.renderPreview).toEqual(DEFAULT_RENDER_PREVIEW_SETTINGS)
  })

  it('writes Standard environment grade controls from the Properties Render section only to environmentGrade', async () => {
    const environmentGrade = {
      ...DEFAULT_VIEW_SETTINGS.environmentGrade,
      exposure: 1.77,
      contrast: 1.12,
      saturation: 1.08,
    }
    const ground = {
      ...DEFAULT_VIEW_SETTINGS.ground,
      enabled: true,
      height: 2.5,
      materialPresetId: 'glossy_studio' as const,
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          viewportStyle: 'standard',
          postProcessing: createViewAmbientOcclusionPresetSettings('medium'),
          environmentGrade,
          shadowsEnabled: false,
          ground,
        },
      }))
    })

    await renderSurface()

    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null
    const exposureIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Exposure"]',
    ) as HTMLButtonElement | null
    const contrastIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Contrast"]',
    ) as HTMLButtonElement | null
    const saturationIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Saturation"]',
    ) as HTMLButtonElement | null

    expect(renderPanel?.textContent).toContain('View settings grade')
    expect(renderPanel?.textContent).toContain('Uses the saved environment grade')
    expect(exposureIncreaseButton?.disabled).toBe(false)
    expect(contrastIncreaseButton?.disabled).toBe(false)
    expect(saturationIncreaseButton?.disabled).toBe(false)

    await act(async () => {
      exposureIncreaseButton?.click()
      contrastIncreaseButton?.click()
      saturationIncreaseButton?.click()
    })

    const view = useUiPrefsStore.getState().view
    expect(view.environmentGrade).toEqual({
      ...environmentGrade,
      exposure: 1.78,
      contrast: 1.13,
      saturation: 1.09,
    })
    expect(view.viewportStyle).toBe('standard')
    expect(view.postProcessing).toEqual(createViewAmbientOcclusionPresetSettings('medium'))
    expect(view.renderPreview).toEqual(DEFAULT_RENDER_PREVIEW_SETTINGS)
    expect(view.shadowsEnabled).toBe(false)
    expect(view.ground).toEqual(ground)
  })

  it('keeps neutral render controls editable after a Clay Studio preset is active', async () => {
    const environmentGrade = {
      ...DEFAULT_VIEW_SETTINGS.environmentGrade,
      exposure: 1.77,
      contrast: 1.12,
      saturation: 1.08,
    }

    await act(async () => {
      useUiPrefsStore.setState((state) => ({
        view: {
          ...state.view,
          viewportStyle: 'clayStudio',
          environmentGrade,
          shadowsEnabled: true,
          ground: {
            ...state.view.ground,
            enabled: true,
            height: 2.5,
            materialPresetId: 'glossy_studio',
          },
          gridVisible: true,
          gridPresentation: {
            ...DEFAULT_VIEW_SETTINGS.gridPresentation,
            height: 1.5,
            size: 300,
            layers: DEFAULT_VIEW_SETTINGS.gridPresentation.layers.map((layer) => ({ ...layer })),
          },
        },
      }))
    })

    await renderSurface()

    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null
    const exposureIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Exposure"]',
    ) as HTMLButtonElement | null
    const contrastIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Contrast"]',
    ) as HTMLButtonElement | null
    const saturationIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Saturation"]',
    ) as HTMLButtonElement | null
    const exposureSlider = container?.querySelector(
      '.PropertiesRenderSection [role="slider"][aria-label="Exposure"]',
    ) as HTMLDivElement | null
    const shadowsSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Shadows"]',
    ) as HTMLSelectElement | null
    const castShadowSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Cast Shadow"]',
    ) as HTMLSelectElement | null
    const shadowBiasIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Shadow Bias"]',
    ) as HTMLButtonElement | null
    const groundSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Ground"]',
    ) as HTMLSelectElement | null
    const groundHeightIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Ground Height"]',
    ) as HTMLButtonElement | null
    const materialSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Material"]',
    ) as HTMLSelectElement | null
    const gridSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Grid"]',
    ) as HTMLSelectElement | null
    const gridHeightIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid Height"]',
    ) as HTMLButtonElement | null
    const grid1LayerSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Grid 1 Layer"]',
    ) as HTMLSelectElement | null
    const grid1SpacingIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Grid 1 Spacing"]',
    ) as HTMLButtonElement | null
    const grid1ColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Grid 1 Color"]',
    ) as HTMLInputElement | null
    const grid1ColorExpandButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Expand Grid 1 color controls"]',
    ) as HTMLButtonElement | null

    expect(renderPanel?.textContent).toContain('View settings grade')
    expect(renderPanel?.textContent).toContain('Uses the saved environment grade')
    expect(renderPanel?.textContent).toContain('Uses the saved shadow setting')
    expect(renderPanel?.textContent).toContain('Uses the saved ground setting')
    expect(renderPanel?.textContent).toContain('Uses the saved grid presentation setting')
    expect(renderPanel?.textContent).not.toContain('Preset Locked')
    expect(exposureIncreaseButton?.disabled).toBe(false)
    expect(contrastIncreaseButton?.disabled).toBe(false)
    expect(saturationIncreaseButton?.disabled).toBe(false)
    expect(exposureSlider?.getAttribute('aria-disabled')).not.toBe('true')
    expect(shadowsSelect?.disabled).toBe(false)
    expect(castShadowSelect?.disabled).toBe(false)
    expect(shadowBiasIncreaseButton?.disabled).toBe(false)
    expect(groundSelect?.disabled).toBe(false)
    expect(groundHeightIncreaseButton?.disabled).toBe(false)
    expect(materialSelect?.disabled).toBe(false)
    expect(gridSelect?.disabled).toBe(false)
    expect(gridHeightIncreaseButton?.disabled).toBe(false)
    expect(grid1LayerSelect?.disabled).toBe(false)
    expect(grid1SpacingIncreaseButton?.disabled).toBe(false)
    expect(grid1ColorExpandButton?.disabled).toBe(false)
    expect(grid1ColorInput?.disabled).toBe(false)

    await act(async () => {
      if (shadowsSelect !== null) {
        shadowsSelect.value = 'off'
        shadowsSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (groundSelect !== null) {
        groundSelect.value = 'off'
        groundSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (gridSelect !== null) {
        gridSelect.value = 'off'
        gridSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      exposureIncreaseButton?.click()
      contrastIncreaseButton?.click()
      saturationIncreaseButton?.click()
      shadowBiasIncreaseButton?.click()
      groundHeightIncreaseButton?.click()
      gridHeightIncreaseButton?.click()
      grid1SpacingIncreaseButton?.click()
    })

    const view = useUiPrefsStore.getState().view
    expect(view.environmentGrade).toEqual({
      ...environmentGrade,
      exposure: 1.78,
      contrast: 1.13,
      saturation: 1.09,
    })
    expect(view.viewportStyle).toBe('clayStudio')
    expect(view.shadowsEnabled).toBe(false)
    expect(view.ground).toEqual({
      enabled: false,
      height: 3,
      materialPresetId: 'glossy_studio',
    })
    expect(view.gridVisible).toBe(false)
    expect(view.gridPresentation.height).toBe(2)
    expect(view.gridPresentation.layers.find((layer) => layer.id === 'grid1')?.spacing).toBe(1.1)
  })

  it('writes ambient occlusion presets from the Properties Render section', async () => {
    useUiPrefsStore.getState().setViewKey('viewportStyle', 'clayStudio')

    await renderSurface()

    const renderPanel = container?.querySelector(
      '#properties-section-panel-render',
    ) as HTMLDivElement | null
    const aoTypeSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="AO Type"]',
    ) as HTMLSelectElement | null
    const queryAmbientOcclusionSelect = () =>
      container?.querySelector(
        '.PropertiesRenderSection .ParaSelectNative[aria-label="Ambient Occlusion"]',
      ) as HTMLSelectElement | null
    const queryAoIntensityIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase AO Intensity"]',
      ) as HTMLButtonElement | null
    const queryAoRadiusIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase AO Radius"]',
      ) as HTMLButtonElement | null
    const queryAoQualitySelect = () =>
      container?.querySelector(
        '.PropertiesRenderSection .ParaSelectNative[aria-label="AO Quality"]',
      ) as HTMLSelectElement | null
    const queryAoContactBiasIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase AO Contact Bias"]',
      ) as HTMLButtonElement | null
    const queryAoDistanceThresholdIncreaseButton = () =>
      container?.querySelector(
        '.PropertiesRenderSection button[aria-label="Increase AO Distance Threshold"]',
      ) as HTMLButtonElement | null
    const viewportStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Render Preset"]',
    ) as HTMLSelectElement | null
    const qualityPresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Quality preset"]',
    ) as HTMLSelectElement | null

    expect(renderPanel?.textContent).toContain('AO Type')
    expect(renderPanel?.textContent).not.toContain('Ambient Occlusion')
    expect(renderPanel?.textContent).not.toContain('AO Intensity')
    expect(renderPanel?.textContent).not.toContain('AO Radius')
    expect(renderPanel?.textContent).not.toContain('AO Quality')
    expect(renderPanel?.textContent).not.toContain('AO Contact Bias')
    expect(renderPanel?.textContent).not.toContain('AO Distance Threshold')
    expect(aoTypeSelect?.value).toBe('off')
    expect(queryAmbientOcclusionSelect()).toBeNull()
    expect(
      Array.from(aoTypeSelect?.options ?? []).map((option) => option.value),
    ).toEqual(['off', 'basicSsao', 'sao'])
    expect(
      Array.from(aoTypeSelect?.options ?? []).map((option) => option.textContent),
    ).not.toContain('GTAO')

    await act(async () => {
      if (aoTypeSelect !== null) {
        aoTypeSelect.value = 'basicSsao'
        aoTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual({
      ...DEFAULT_VIEW_SETTINGS.postProcessing,
      aoType: 'basicSsao',
      ssaoEnabled: true,
    })
    expect(aoTypeSelect?.value).toBe('basicSsao')
    let ambientOcclusionSelect = queryAmbientOcclusionSelect()
    let aoQualitySelect = queryAoQualitySelect()
    expect(ambientOcclusionSelect?.value).toBe('custom')
    expect(renderPanel?.textContent).toContain('AO Intensity')
    expect(renderPanel?.textContent).toContain('AO Radius')
    expect(renderPanel?.textContent).toContain('AO Quality')
    expect(renderPanel?.textContent).toContain('AO Contact Bias')
    expect(renderPanel?.textContent).toContain('AO Distance Threshold')

    await act(async () => {
      if (aoTypeSelect !== null) {
        aoTypeSelect.value = 'sao'
        aoTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual({
      ...DEFAULT_VIEW_SETTINGS.postProcessing,
      aoType: 'sao',
      ssaoEnabled: true,
    })
    expect(aoTypeSelect?.value).toBe('sao')
    expect(queryAmbientOcclusionSelect()).toBeNull()
    expect(queryAoContactBiasIncreaseButton()).toBeNull()
    expect(renderPanel?.textContent).toContain('AO Intensity')
    expect(renderPanel?.textContent).toContain('AO Radius')
    expect(renderPanel?.textContent).toContain('AO Quality')
    expect(renderPanel?.textContent).toContain('AO Distance Threshold')

    await act(async () => {
      if (aoTypeSelect !== null) {
        aoTypeSelect.value = 'basicSsao'
        aoTypeSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    ambientOcclusionSelect = queryAmbientOcclusionSelect()

    await act(async () => {
      if (ambientOcclusionSelect !== null) {
        ambientOcclusionSelect.value = 'low'
        ambientOcclusionSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual(
      createViewAmbientOcclusionPresetSettings('low'),
    )
    expect(aoTypeSelect?.value).toBe('basicSsao')
    expect(ambientOcclusionSelect?.value).toBe('low')
    aoQualitySelect = queryAoQualitySelect()
    expect(aoQualitySelect?.value).toBe('low')

    await act(async () => {
      queryAoIntensityIncreaseButton()?.click()
      queryAoRadiusIncreaseButton()?.click()
      queryAoContactBiasIncreaseButton()?.click()
      queryAoDistanceThresholdIncreaseButton()?.click()
      if (aoQualitySelect !== null) {
        aoQualitySelect.value = 'high'
        aoQualitySelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const customPostProcessing = useUiPrefsStore.getState().view.postProcessing
    expect(customPostProcessing.aoType).toBe('basicSsao')
    expect(customPostProcessing.ssaoEnabled).toBe(true)
    expect(customPostProcessing.ssaoIntensity).toBeCloseTo(0.56)
    expect(customPostProcessing.ssaoRadius).toBeCloseTo(1.16)
    expect(customPostProcessing.ssaoQuality).toBe('high')
    expect(customPostProcessing.ssaoContactBias).toBeCloseTo(0.0022)
    expect(customPostProcessing.ssaoDistanceThreshold).toBeCloseTo(0.06725)
    expect(ambientOcclusionSelect?.value).toBe('custom')

    await act(async () => {
      if (ambientOcclusionSelect !== null) {
        ambientOcclusionSelect.value = 'high'
        ambientOcclusionSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual(
      createViewAmbientOcclusionPresetSettings('high'),
    )
    expect(aoTypeSelect?.value).toBe('basicSsao')
    expect(ambientOcclusionSelect?.value).toBe('high')

    await act(async () => {
      if (ambientOcclusionSelect !== null) {
        ambientOcclusionSelect.value = 'off'
        ambientOcclusionSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.postProcessing).toEqual(
      createViewAmbientOcclusionPresetSettings('off'),
    )
    expect(aoTypeSelect?.value).toBe('off')
    expect(viewportStyleSelect?.value).toBe('clayStudio')
    expect(qualityPresetSelect?.value).toBe('balanced')
    expect(useUiPrefsStore.getState().view.viewportStyle).toBe('clayStudio')
    expect(useUiPrefsStore.getState().view.renderPreview).toEqual(
      DEFAULT_RENDER_PREVIEW_SETTINGS,
    )
  })

  it('writes geometry display visibility from the Properties Render section', async () => {
    await renderSurface()

    const surfacesSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Surfaces"]',
    ) as HTMLSelectElement | null
    const edgePresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]',
    ) as HTMLSelectElement | null
    const surfaceSourceSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Surface Source"]',
    ) as HTMLSelectElement | null
    const pointsSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Points"]',
    ) as HTMLSelectElement | null

    expect(surfacesSelect?.value).toBe('on')
    expect(surfaceSourceSelect?.value).toBe('materialSet')
    expect(edgePresetSelect?.value).toBe('off')
    expect(pointsSelect?.value).toBe('on')
    expect(container?.textContent).not.toContain('Surface Metalness')
    expect(Array.from(edgePresetSelect?.options ?? []).map((option) => option.value)).toEqual([
      'off',
      'visibleOnly',
      'xray',
      'hiddenLine',
    ])

    await act(async () => {
      if (surfacesSelect !== null) {
        surfacesSelect.value = 'off'
        surfacesSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'visibleOnly'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (pointsSelect !== null) {
        pointsSelect.value = 'off'
        pointsSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.geometryDisplay).toEqual({
      surfaces: {
        visible: false,
        source: 'materialSet',
        customMaterial: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.customMaterial,
        hover: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.hover,
        selected: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected,
        bodySelected: DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.bodySelected,
      },
      edges: {
        ...DEFAULT_VIEW_SETTINGS.geometryDisplay.edges,
        preset: 'visibleOnly',
        mode: 'visibleOnly',
        depthMode: 'surface',
      },
      points: { visible: false },
    })
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('visibleEdgesOnly')
  })

  it('collapses Geometry Display subsections without changing saved display settings', async () => {
    await renderSurface()

    const surfacesToggle = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Toggle Surfaces controls"]',
    ) as HTMLButtonElement | null
    const edgesToggle = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Toggle Edges controls"]',
    ) as HTMLButtonElement | null
    const pointsToggle = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Toggle Points controls"]',
    ) as HTMLButtonElement | null

    expect(surfacesToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(edgesToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(pointsToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Surfaces"]'),
    ).not.toBeNull()
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]'),
    ).not.toBeNull()
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Points"]'),
    ).not.toBeNull()

    const initialGeometryDisplay = structuredClone(useUiPrefsStore.getState().view.geometryDisplay)

    await act(async () => {
      surfacesToggle?.click()
      edgesToggle?.click()
      pointsToggle?.click()
    })

    expect(surfacesToggle?.getAttribute('aria-expanded')).toBe('false')
    expect(edgesToggle?.getAttribute('aria-expanded')).toBe('false')
    expect(pointsToggle?.getAttribute('aria-expanded')).toBe('false')
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Surfaces"]'),
    ).toBeNull()
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]'),
    ).toBeNull()
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Points"]'),
    ).toBeNull()
    expect(useUiPrefsStore.getState().view.geometryDisplay).toEqual(initialGeometryDisplay)

    await act(async () => {
      edgesToggle?.click()
    })

    expect(edgesToggle?.getAttribute('aria-expanded')).toBe('true')
    expect(
      container?.querySelector('.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]'),
    ).not.toBeNull()
  })

  it('writes default edge display styles only while Edges is enabled', async () => {
    await renderSurface()

    const edgePresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]',
    ) as HTMLSelectElement | null
    const edgePresetButton = container?.querySelector(
      '.PropertiesRenderSection button.ParaSelectTrackButton[aria-label="Edge Preset"]',
    ) as HTMLButtonElement | null

    expect(edgePresetSelect?.value).toBe('off')
    expect(container?.textContent).not.toContain('Edge Opacity')
    expect(container?.textContent).not.toContain('Edge Depth')
    expect(container?.textContent).not.toContain('Edge Hover Opacity')
    expect(container?.textContent).not.toContain('Edge Selected Opacity')

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'xray'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const edgeColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Edge Color"]',
    ) as HTMLInputElement | null
    const edgeOpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Edge Opacity"]',
    ) as HTMLButtonElement | null
    const edgeHoverColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Edge Hover Color"]',
    ) as HTMLInputElement | null
    const edgeHoverOpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Edge Hover Opacity"]',
    ) as HTMLButtonElement | null
    const edgeSelectedColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Edge Selected Color"]',
    ) as HTMLInputElement | null
    const edgeSelectedOpacityDecreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Decrease Edge Selected Opacity"]',
    ) as HTMLButtonElement | null
    const edgeDepthSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Depth"]',
    ) as HTMLSelectElement | null
    const hiddenEdgesSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Hidden Edges"]',
    ) as HTMLSelectElement | null

    expect(edgeColorInput?.value).toBe(DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.color)
    expect(container?.textContent).toContain('Edge Depth')
    expect(container?.textContent).toContain('Hidden Edges')
    expect(container?.textContent).not.toContain('Line Style')
    expect(edgeDepthSelect?.value).toBe('xray')
    expect(hiddenEdgesSelect?.value).toBe('off')
    expect(edgeHoverColorInput?.value).toBe(DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hover.color)
    expect(edgeSelectedColorInput?.value).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.selected.color,
    )

    await act(async () => {
      if (edgeDepthSelect !== null) {
        edgeDepthSelect.value = 'surface'
        edgeDepthSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(edgePresetSelect?.value).toBe('xray')
    expect(edgePresetButton?.textContent).toContain('Custom')
    expect(container?.textContent).not.toContain('Hidden Edges')

    await act(async () => {
      if (edgeDepthSelect !== null) {
        edgeDepthSelect.value = 'xray'
        edgeDepthSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(edgePresetSelect?.value).toBe('xray')
    expect(edgePresetButton?.textContent).toContain('Xray')

    await act(async () => {
      if (edgeColorInput !== null) {
        edgeColorInput.value = '#00ffaa'
        edgeColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      if (edgeHoverColorInput !== null) {
        edgeHoverColorInput.value = '#ffaa00'
        edgeHoverColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      if (edgeSelectedColorInput !== null) {
        edgeSelectedColorInput.value = '#aa00ff'
        edgeSelectedColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      edgeOpacityIncreaseButton?.click()
      edgeHoverOpacityIncreaseButton?.click()
      edgeSelectedOpacityDecreaseButton?.click()
    })

    expect(edgePresetSelect?.value).toBe('xray')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toEqual({
      preset: 'xray',
      mode: 'all',
      color: '#00ffaa',
      opacity: 0.63,
      depthMode: 'xray',
      hiddenEdges: false,
      lineStyle: 'solid',
      hiddenLine: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine,
      hover: {
        color: '#ffaa00',
        opacity: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hover.opacity + 0.01,
      },
      selected: {
        color: '#aa00ff',
        opacity: 0.87,
      },
    })
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('on')
    expect(useUiPrefsStore.getState().view.highlights).toMatchObject({
      hoverColor: '#ffaa00',
      selectedColor: '#aa00ff',
    })
  })

  it('writes hidden-line edge styles only for the Hidden Line edge preset', async () => {
    await renderSurface()

    const edgePresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]',
    ) as HTMLSelectElement | null

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'xray'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(container?.textContent).not.toContain('Hidden Edge Opacity')
    expect(container?.textContent).not.toContain('Dash Length')
    expect(container?.textContent).not.toContain('Gap Length')
    expect(container?.textContent).not.toContain('Line Style')

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'hiddenLine'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const hiddenColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Hidden Edge Color"]',
    ) as HTMLInputElement | null
    const lineStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Line Style"]',
    ) as HTMLSelectElement | null
    const hiddenOpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Hidden Edge Opacity"]',
    ) as HTMLButtonElement | null
    const dashIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Dash Length"]',
    ) as HTMLButtonElement | null
    const gapIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Gap Length"]',
    ) as HTMLButtonElement | null

    expect(hiddenColorInput?.value).toBe(DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine.color)
    expect(lineStyleSelect?.value).toBe('dashed')
    expect(hiddenOpacityIncreaseButton).not.toBeNull()
    expect(dashIncreaseButton).not.toBeNull()
    expect(gapIncreaseButton).not.toBeNull()

    await act(async () => {
      if (hiddenColorInput !== null) {
        hiddenColorInput.value = '#112233'
        hiddenColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      hiddenOpacityIncreaseButton?.click()
      dashIncreaseButton?.click()
      gapIncreaseButton?.click()
    })

    expect(edgePresetSelect?.value).toBe('hiddenLine')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      preset: 'hiddenLine',
      mode: 'all',
      depthMode: 'xray',
      hiddenEdges: true,
      lineStyle: 'dashed',
      hiddenLine: {
        color: '#112233',
        opacity: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine.opacity + 0.01,
        dashSize: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine.dashSize + 0.01,
        gapSize: DEFAULT_VIEW_SETTINGS.geometryDisplay.edges.hiddenLine.gapSize + 0.01,
      },
    })
    expect(useUiPrefsStore.getState().view.edgeDisplayMode).toBe('on')
  })

  it('reads edited edge preset recipes as Custom without saving Custom as a preset', async () => {
    await renderSurface()

    const edgePresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]',
    ) as HTMLSelectElement | null
    const edgePresetButton = container?.querySelector(
      '.PropertiesRenderSection button.ParaSelectTrackButton[aria-label="Edge Preset"]',
    ) as HTMLButtonElement | null

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'hiddenLine'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const lineStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Line Style"]',
    ) as HTMLSelectElement | null

    expect(edgePresetSelect?.value).toBe('hiddenLine')
    expect(lineStyleSelect?.value).toBe('dashed')

    await act(async () => {
      if (lineStyleSelect !== null) {
        lineStyleSelect.value = 'solid'
        lineStyleSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(edgePresetSelect?.value).toBe('hiddenLine')
    expect(edgePresetButton?.textContent).toContain('Custom')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.preset).toBe('hiddenLine')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.lineStyle).toBe('solid')

    await act(async () => {
      edgePresetButton?.click()
    })

    expect(
      Array.from(container?.querySelectorAll('.PropertiesRenderSection .ParaSelectMenuOption') ?? [])
        .map((option) => option.textContent),
    ).toEqual(['Off', 'Visible Only', 'Xray', 'Hidden Line'])

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'visibleOnly'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(edgePresetSelect?.value).toBe('visibleOnly')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      preset: 'visibleOnly',
      mode: 'visibleOnly',
      depthMode: 'surface',
      hiddenEdges: false,
      lineStyle: 'solid',
    })
  })

  it('keeps Custom out of Edge Preset choices while Off remains reachable', async () => {
    await renderSurface()

    const edgePresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Edge Preset"]',
    ) as HTMLSelectElement | null
    let edgePresetButton = container?.querySelector(
      '.PropertiesRenderSection button.ParaSelectTrackButton[aria-label="Edge Preset"]',
    ) as HTMLButtonElement | null
    let previousEdgePresetButton: HTMLButtonElement | null = null

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'visibleOnly'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    edgePresetButton = container?.querySelector(
      '.PropertiesRenderSection button.ParaSelectTrackButton[aria-label="Edge Preset"]',
    ) as HTMLButtonElement | null
    previousEdgePresetButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Previous Edge Preset"]',
    ) as HTMLButtonElement | null

    expect(edgePresetButton?.textContent).toContain('Visible Only')
    expect(previousEdgePresetButton).not.toBeNull()
    expect(previousEdgePresetButton?.disabled).toBe(false)
    expect(container?.textContent).toContain('Edge Opacity')

    await act(async () => {
      previousEdgePresetButton?.click()
    })

    expect(edgePresetSelect?.value).toBe('off')
    expect(edgePresetButton?.textContent).toContain('Off')
    expect(container?.textContent).not.toContain('Edge Opacity')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      preset: 'off',
      mode: 'off',
      depthMode: 'xray',
      hiddenEdges: false,
      lineStyle: 'solid',
    })

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'hiddenLine'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    await act(async () => {
      edgePresetButton?.click()
    })

    let menuOptions = Array.from(
      container?.querySelectorAll('.PropertiesRenderSection .ParaSelectMenuOption') ?? [],
    ) as HTMLButtonElement[]
    expect(menuOptions.map((option) => option.textContent)).toEqual([
      'Off',
      'Visible Only',
      'Xray',
      'Hidden Line',
    ])

    await act(async () => {
      menuOptions.find((option) => option.textContent === 'Off')?.click()
    })

    expect(edgePresetSelect?.value).toBe('off')
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges.mode).toBe('off')

    await act(async () => {
      if (edgePresetSelect !== null) {
        edgePresetSelect.value = 'hiddenLine'
        edgePresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    let lineStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Line Style"]',
    ) as HTMLSelectElement | null

    await act(async () => {
      if (lineStyleSelect !== null) {
        lineStyleSelect.value = 'solid'
        lineStyleSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(edgePresetSelect?.value).toBe('hiddenLine')
    expect(edgePresetButton?.textContent).toContain('Custom')

    await act(async () => {
      edgePresetButton?.click()
    })

    menuOptions = Array.from(
      container?.querySelectorAll('.PropertiesRenderSection .ParaSelectMenuOption') ?? [],
    ) as HTMLButtonElement[]
    expect(menuOptions.map((option) => option.textContent)).not.toContain('Custom')

    await act(async () => {
      menuOptions.find((option) => option.textContent === 'Off')?.click()
    })

    lineStyleSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Line Style"]',
    ) as HTMLSelectElement | null
    expect(edgePresetSelect?.value).toBe('off')
    expect(edgePresetButton?.textContent).toContain('Off')
    expect(lineStyleSelect).toBeNull()
    expect(useUiPrefsStore.getState().view.geometryDisplay.edges).toMatchObject({
      preset: 'off',
      mode: 'off',
      hiddenEdges: false,
      lineStyle: 'solid',
    })
  })

  it('writes custom surface display material without changing project material truth', async () => {
    const initialMaterials = structuredClone(useUiPrefsStore.getState().view.materials)

    await renderSurface()

    const surfaceSourceSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Surface Source"]',
    ) as HTMLSelectElement | null

    await act(async () => {
      if (surfaceSourceSelect !== null) {
        surfaceSourceSelect.value = 'custom'
        surfaceSourceSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    const surfaceMetalnessIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Surface Metalness"]',
    ) as HTMLButtonElement | null
    const surfaceOpacityDecreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Decrease Surface Opacity"]',
    ) as HTMLButtonElement | null
    const surfaceTransparencySelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Surface Transparency"]',
    ) as HTMLSelectElement | null
    const surfaceRenderingSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Surface Rendering"]',
    ) as HTMLSelectElement | null
    const surfaceColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Surface Color"]',
    ) as HTMLInputElement | null

    expect(container?.textContent).toContain('Surface Metalness')
    expect(surfaceColorInput?.value).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.customMaterial.color,
    )

    await act(async () => {
      if (surfaceColorInput !== null) {
        surfaceColorInput.value = '#ff00aa'
        surfaceColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      surfaceMetalnessIncreaseButton?.click()
      surfaceOpacityDecreaseButton?.click()
      if (surfaceTransparencySelect !== null) {
        surfaceTransparencySelect.value = 'transparent'
        surfaceTransparencySelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
      if (surfaceRenderingSelect !== null) {
        surfaceRenderingSelect.value = 'front'
        surfaceRenderingSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.geometryDisplay.surfaces).toMatchObject({
      source: 'custom',
      customMaterial: {
        color: '#ff00aa',
        metalness: 0.07,
        opacity: 0.99,
        transparent: true,
        doubleSided: false,
      },
    })
    expect(useUiPrefsStore.getState().view.materials).toEqual(initialMaterials)

    await act(async () => {
      if (surfaceSourceSelect !== null) {
        surfaceSourceSelect.value = 'materialSet'
        surfaceSourceSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(container?.textContent).not.toContain('Surface Metalness')
    expect(useUiPrefsStore.getState().view.geometryDisplay.surfaces.customMaterial.color).toBe(
      '#ff00aa',
    )
    expect(useUiPrefsStore.getState().view.materials).toEqual(initialMaterials)
  })

  it('writes surface interaction styles from Geometry Display and updates highlight bridge', async () => {
    await renderSurface()

    const surfaceHoverColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Surface Hover Color"]',
    ) as HTMLInputElement | null
    const surfaceSelectedColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Surface Selected Color"]',
    ) as HTMLInputElement | null
    const bodySelectedColorInput = container?.querySelector(
      '.PropertiesRenderSection input[aria-label="Body Selected Color"]',
    ) as HTMLInputElement | null
    const surfaceHoverOpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Surface Hover Opacity"]',
    ) as HTMLButtonElement | null
    const surfaceSelectedOpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Surface Selected Opacity"]',
    ) as HTMLButtonElement | null
    const bodySelectedOpacityIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Body Selected Opacity"]',
    ) as HTMLButtonElement | null

    expect(surfaceHoverColorInput?.value).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.hover.color,
    )
    expect(surfaceSelectedColorInput?.value).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.selected.color,
    )
    expect(bodySelectedColorInput?.value).toBe(
      DEFAULT_VIEW_SETTINGS.geometryDisplay.surfaces.bodySelected.color,
    )

    await act(async () => {
      if (surfaceHoverColorInput !== null) {
        surfaceHoverColorInput.value = '#00ffaa'
        surfaceHoverColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      if (surfaceSelectedColorInput !== null) {
        surfaceSelectedColorInput.value = '#ff00aa'
        surfaceSelectedColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      if (bodySelectedColorInput !== null) {
        bodySelectedColorInput.value = '#123abc'
        bodySelectedColorInput.dispatchEvent(new Event('input', { bubbles: true }))
      }
      surfaceHoverOpacityIncreaseButton?.click()
      surfaceSelectedOpacityIncreaseButton?.click()
      bodySelectedOpacityIncreaseButton?.click()
    })

    expect(useUiPrefsStore.getState().view.geometryDisplay.surfaces).toMatchObject({
      hover: { color: '#00ffaa', opacity: 0.27 },
      selected: { color: '#ff00aa', opacity: 0.59 },
      bodySelected: { color: '#123abc', opacity: 0.43 },
    })
    expect(useUiPrefsStore.getState().view.highlights).toMatchObject({
      hoverColor: '#00ffaa',
      surfaceHoverOpacity: 0.27,
      selectedColor: '#ff00aa',
      surfaceSelectedOpacity: 0.59,
      bodySelectedColor: '#123abc',
      bodySelectedOpacity: 0.43,
    })
  })

  it('applies render quality presets and derives Custom from manual divergence', async () => {
    useUiPrefsStore.getState().setViewKey(
      'renderPreview',
      createRenderPreviewQualityPresetSettings('fast'),
    )

    await renderSurface()

    const qualityPresetSelect = container?.querySelector(
      '.PropertiesRenderSection .ParaSelectNative[aria-label="Quality preset"]',
    ) as HTMLSelectElement | null
    const sampleIncreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Increase Samples"]',
    ) as HTMLButtonElement | null
    const sampleDecreaseButton = container?.querySelector(
      '.PropertiesRenderSection button[aria-label="Decrease Samples"]',
    ) as HTMLButtonElement | null

    expect(qualityPresetSelect?.value).toBe('fast')

    await act(async () => {
      sampleIncreaseButton?.click()
    })

    expect(qualityPresetSelect?.value).toBe('custom')

    await act(async () => {
      sampleDecreaseButton?.click()
    })

    expect(qualityPresetSelect?.value).toBe('fast')

    await act(async () => {
      if (qualityPresetSelect !== null) {
        qualityPresetSelect.value = 'high'
        qualityPresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.renderPreview).toEqual(
      createRenderPreviewQualityPresetSettings('high'),
    )
    expect(qualityPresetSelect?.value).toBe('high')

    await act(async () => {
      if (qualityPresetSelect !== null) {
        qualityPresetSelect.value = 'custom'
        qualityPresetSelect.dispatchEvent(new Event('change', { bubbles: true }))
      }
    })

    expect(useUiPrefsStore.getState().view.renderPreview).toEqual(
      createRenderPreviewQualityPresetSettings('high'),
    )
  })
})
