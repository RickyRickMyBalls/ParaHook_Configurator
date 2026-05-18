// @vitest-environment jsdom

import { act } from 'react'
import { createRoot, type Root } from 'react-dom/client'
import { afterEach, describe, expect, it, vi } from 'vitest'
import type { ComponentProps } from 'react'
import { ViewportFrame } from './ViewportFrame'
import { getWorkspaceViewportTypeChoiceEntries } from './workspaceViewportTypeChoices'

;(globalThis as typeof globalThis & { IS_REACT_ACT_ENVIRONMENT?: boolean }).IS_REACT_ACT_ENVIRONMENT =
  true

describe('ViewportFrame', () => {
  let root: Root | null = null
  let container: HTMLDivElement | null = null

  afterEach(async () => {
    if (root !== null) {
      await act(async () => {
        root?.unmount()
      })
    }
    vi.useRealTimers()
    container?.remove()
    container = null
    root = null
  })

  const renderFrame = async (props?: Partial<ComponentProps<typeof ViewportFrame>>) => {
    container = document.createElement('div')
    document.body.appendChild(container)
    root = createRoot(container)
    await act(async () => {
      root?.render(
        <ViewportFrame
          slotId="workspace-slot-secondary"
          surfaceKind="browser"
          onSplitTop={vi.fn()}
          onSplitRight={vi.fn()}
          onSplitBottom={vi.fn()}
          onSplitLeft={vi.fn()}
          onFloat={vi.fn()}
          onPopOut={vi.fn()}
          onClose={vi.fn()}
          {...props}
        >
          <div>Body</div>
        </ViewportFrame>,
      )
    })
    const frame = container?.querySelector('.ViewportFrame')
    if (frame instanceof HTMLElement) {
      Object.defineProperty(frame, 'getBoundingClientRect', {
        configurable: true,
        value: () => ({
          x: 0,
          y: 0,
          left: 0,
          top: 0,
          width: 500,
          height: 320,
          right: 500,
          bottom: 320,
          toJSON: () => '',
        }),
      })
    }
  }

  it('keeps the viewport action menu on titlebar right click instead of showing the action strip inline', async () => {
    await renderFrame()

    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
    expect(container?.textContent).not.toContain('Split Top')

    await act(async () => {
      const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()
    expect(container?.textContent).toContain('Split')
    expect(container?.textContent).toContain('Viewport Type')
    expect(container?.textContent).toContain('Pop Out')
    expect(container?.textContent).toContain('Close')
  })

  it('uses the top-right frame button as a direct pop out control', async () => {
    const onPopOut = vi.fn()

    await renderFrame({
      onPopOut,
    })

    const popOutButton = container?.querySelector(
      '.ViewportFrameActionMenuButton',
    ) as HTMLButtonElement | null

    await act(async () => {
      popOutButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(popOutButton?.textContent).toBe('↗')
    expect(popOutButton?.getAttribute('aria-label')).toBe('Pop out Browser')
    expect(onPopOut).toHaveBeenCalledTimes(1)
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('opens the viewport action menu when the title bar is right-clicked', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()
    expect(container?.textContent).toContain('Split')
  })

  it('opens the split submenu from the viewport titlebar menu', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitGroup = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup',
    ) as HTMLDivElement | null
    expect(splitGroup).not.toBeNull()
    const splitButton = splitGroup?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Split Top')
    expect(container?.textContent).toContain('Split Right')
  })

  it('shows canonical workspace type choices from a split direction submenu', async () => {
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined

    expect(splitRightButton).not.toBeUndefined()

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const workspaceTypeSubmenu = container?.querySelector(
      '.ViewportFrameActionSubmenu--workspaceTypes',
    )
    const workspaceTypeButtons = Array.from(
      workspaceTypeSubmenu?.querySelectorAll('.ViewportFrameActionMenuAction') ?? [],
    ) as HTMLButtonElement[]

    expect(workspaceTypeSubmenu).not.toBeNull()
    expect(workspaceTypeButtons.map((button) => button.textContent?.trim())).toEqual(
      getWorkspaceViewportTypeChoiceEntries().map((choice) => choice.label),
    )
    expect(workspaceTypeButtons.every((button) => button.disabled)).toBe(true)
  })

  it('keeps a split direction workspace type submenu open briefly after pointer leave', async () => {
    vi.useFakeTimers()
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined
    const splitRightGroup = splitRightButton?.closest(
      '.ViewportFrameActionMenuSubmenuGroup--splitDirection',
    ) as HTMLDivElement | null

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportFrameActionSubmenu--workspaceTypes')).not.toBeNull()

    await act(async () => {
      splitRightGroup?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true }))
    })

    expect(container?.querySelector('.ViewportFrameActionSubmenu--workspaceTypes')).not.toBeNull()

    await act(async () => {
      vi.advanceTimersByTime(179)
    })

    expect(container?.querySelector('.ViewportFrameActionSubmenu--workspaceTypes')).not.toBeNull()

    await act(async () => {
      vi.advanceTimersByTime(1)
    })

    expect(container?.querySelector('.ViewportFrameActionSubmenu--workspaceTypes')).toBeNull()
  })

  it('cancels split direction workspace type submenu close when pointer returns', async () => {
    vi.useFakeTimers()
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined
    const splitRightGroup = splitRightButton?.closest(
      '.ViewportFrameActionMenuSubmenuGroup--splitDirection',
    ) as HTMLDivElement | null

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      splitRightGroup?.dispatchEvent(new MouseEvent('mouseout', { bubbles: true, cancelable: true }))
    })

    await act(async () => {
      vi.advanceTimersByTime(90)
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
      vi.advanceTimersByTime(180)
    })

    expect(container?.querySelector('.ViewportFrameActionSubmenu--workspaceTypes')).not.toBeNull()
  })

  it('keeps direct split direction clicks working from nested split rows', async () => {
    const onSplitRight = vi.fn()
    await renderFrame({ onSplitRight })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onSplitRight).toHaveBeenCalledTimes(1)
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('calls the selected workspace type split action from a split direction submenu', async () => {
    const onSplitWithSurfaceKind = vi.fn()
    const onSplitRight = vi.fn()
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
      onSplitRight,
      onSplitWithSurfaceKind,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const browserButton = Array.from(
      container?.querySelectorAll(
        '.ViewportFrameActionSubmenu--workspaceTypes .ViewportFrameActionMenuAction',
      ) ?? [],
    ).find((button) => button.textContent?.trim() === 'Browser') as HTMLButtonElement | undefined

    expect(browserButton).not.toBeUndefined()
    expect(browserButton?.disabled).toBe(false)

    await act(async () => {
      browserButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onSplitWithSurfaceKind).toHaveBeenCalledTimes(1)
    expect(onSplitWithSurfaceKind).toHaveBeenCalledWith('right', 'browser')
    expect(onSplitRight).not.toHaveBeenCalled()
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('keeps selected workspace type split choices inert without a selected-type callback', async () => {
    const onSplitRight = vi.fn()
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
      onSplitRight,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup > .ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const splitRightButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim().startsWith('Split Right')) as
      | HTMLButtonElement
      | undefined

    await act(async () => {
      splitRightButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const browserButton = Array.from(
      container?.querySelectorAll(
        '.ViewportFrameActionSubmenu--workspaceTypes .ViewportFrameActionMenuAction',
      ) ?? [],
    ).find((button) => button.textContent?.trim() === 'Browser') as HTMLButtonElement | undefined

    expect(browserButton).toBeDefined()
    expect(browserButton?.disabled).toBe(true)

    await act(async () => {
      browserButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onSplitRight).not.toHaveBeenCalled()
    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()
  })

  it('locks a titlebar submenu open when its row is clicked', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const splitButton = container?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(splitButton).not.toBeNull()

    await act(async () => {
      splitButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    const splitGroup = container?.querySelector(
      '.ViewportFrameActionMenuSubmenuGroup',
    ) as HTMLDivElement | null

    await act(async () => {
      splitGroup?.dispatchEvent(new MouseEvent('mouseleave', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Split Top')
  })

  it('opens the viewport type submenu from the viewport titlebar menu', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const typeGroup = container?.querySelectorAll(
      '.ViewportFrameActionMenuSubmenuGroup',
    )[1] as HTMLDivElement | undefined
    expect(typeGroup).toBeDefined()
    const typeButton = typeGroup?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null
    expect(typeButton).not.toBeNull()

    await act(async () => {
      typeButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    expect(container?.textContent).toContain('Model Viewport')
    expect(container?.textContent).toContain('Browser')
    expect(container?.textContent).toContain('Catalog')
    expect(container?.textContent).toContain('Console')
    expect(container?.textContent).toContain('Spaghetti Editor')
    expect(container?.textContent).toContain('Notepad')
    expect(container?.textContent).toContain('Dashboard')
    expect(container?.textContent).toContain('Properties')
    expect(container?.textContent).toContain('Edit History')
  })

  it('enables every primary-slot target in the viewport type submenu', async () => {
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const typeGroup = container?.querySelectorAll(
      '.ViewportFrameActionMenuSubmenuGroup',
    )[1] as HTMLDivElement | undefined
    const typeButton = typeGroup?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      typeButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const typeButtons = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ) as HTMLButtonElement[]
    const modelViewerButton = typeButtons.find((button) => button.textContent?.trim() === 'Model Viewport')
    const browserButton = typeButtons.find((button) => button.textContent?.trim() === 'Browser')
    const catalogButton = typeButtons.find((button) => button.textContent?.trim() === 'Catalog')
    const consoleButton = typeButtons.find((button) => button.textContent?.trim() === 'Console')
    const spaghettiEditorButton = typeButtons.find(
      (button) => button.textContent?.trim() === 'Spaghetti Editor',
    )
    const notepadButton = typeButtons.find((button) => button.textContent?.trim() === 'Notepad')
    const dashboardButton = typeButtons.find((button) => button.textContent?.trim() === 'Dashboard')
    const homePageButton = typeButtons.find((button) => button.textContent?.trim() === 'Home Page')
    const propertiesButton = typeButtons.find((button) => button.textContent?.trim() === 'Properties')
    const editHistoryButton = typeButtons.find((button) => button.textContent?.trim() === 'Edit History')

    expect(modelViewerButton).toBeDefined()
    expect(modelViewerButton?.disabled).toBe(false)
    expect(browserButton).toBeDefined()
    expect(browserButton?.disabled).toBe(false)
    expect(catalogButton).toBeDefined()
    expect(catalogButton?.disabled).toBe(false)
    expect(consoleButton).toBeDefined()
    expect(consoleButton?.disabled).toBe(false)
    expect(spaghettiEditorButton).toBeDefined()
    expect(spaghettiEditorButton?.disabled).toBe(false)
    expect(notepadButton).toBeDefined()
    expect(notepadButton?.disabled).toBe(false)
    expect(dashboardButton).toBeDefined()
    expect(dashboardButton?.disabled).toBe(false)
    expect(homePageButton).toBeDefined()
    expect(homePageButton?.disabled).toBe(false)
    expect(propertiesButton).toBeDefined()
    expect(propertiesButton?.disabled).toBe(false)
    expect(editHistoryButton).toBeDefined()
    expect(editHistoryButton?.disabled).toBe(false)
  })

  it('calls the primary-slot browser type action from the titlebar submenu', async () => {
    const onRequestSurfaceKind = vi.fn()
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
      onRequestSurfaceKind,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const typeGroup = container?.querySelectorAll(
      '.ViewportFrameActionMenuSubmenuGroup',
    )[1] as HTMLDivElement | undefined
    const typeButton = typeGroup?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      typeButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const browserButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Browser') as HTMLButtonElement | undefined

    expect(browserButton).not.toBeUndefined()
    expect(browserButton?.disabled).toBe(false)

    await act(async () => {
      browserButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onRequestSurfaceKind).toHaveBeenCalledWith('browser')
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('calls the primary-slot catalog type action from the titlebar submenu', async () => {
    const onRequestSurfaceKind = vi.fn()
    await renderFrame({
      isPrimary: true,
      surfaceKind: 'modelViewer',
      onRequestSurfaceKind,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const typeGroup = container?.querySelectorAll(
      '.ViewportFrameActionMenuSubmenuGroup',
    )[1] as HTMLDivElement | undefined
    const typeButton = typeGroup?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      typeButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const catalogButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Catalog') as HTMLButtonElement | undefined

    expect(catalogButton).not.toBeUndefined()
    expect(catalogButton?.disabled).toBe(false)

    await act(async () => {
      catalogButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onRequestSurfaceKind).toHaveBeenCalledWith('catalog')
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it.each([
    ['Console', 'console'],
    ['Spaghetti Editor', 'spaghettiEditor'],
    ['Notepad', 'notepad'],
    ['Dashboard', 'dashboard'],
    ['Home Page', 'homePage'],
    ['Properties', 'properties'],
    ['Edit History', 'editHistory'],
  ] as const)(
    'calls the primary-slot %s type action from the titlebar submenu',
    async (buttonLabel, expectedSurfaceKind) => {
      const onRequestSurfaceKind = vi.fn()
      await renderFrame({
        isPrimary: true,
        surfaceKind: 'modelViewer',
        onRequestSurfaceKind,
      })

      const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

      await act(async () => {
        header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
      })

      const typeGroup = container?.querySelectorAll(
        '.ViewportFrameActionMenuSubmenuGroup',
      )[1] as HTMLDivElement | undefined
      const typeButton = typeGroup?.querySelector(
        '.ViewportFrameActionMenuAction--submenu',
      ) as HTMLButtonElement | null

      await act(async () => {
        typeButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
      })

      const targetButton = Array.from(
        container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
      ).find((button) => button.textContent?.trim() === buttonLabel) as HTMLButtonElement | undefined

      expect(targetButton).not.toBeUndefined()
      expect(targetButton?.disabled).toBe(false)

      await act(async () => {
        targetButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
      })

      expect(onRequestSurfaceKind).toHaveBeenCalledWith(expectedSurfaceKind)
      expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
    },
  )

  it('calls the viewport type action from the titlebar submenu', async () => {
    const onRequestSurfaceKind = vi.fn()
    await renderFrame({ onRequestSurfaceKind })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const typeGroup = container?.querySelectorAll(
      '.ViewportFrameActionMenuSubmenuGroup',
    )[1] as HTMLDivElement | undefined
    const typeButton = typeGroup?.querySelector(
      '.ViewportFrameActionMenuAction--submenu',
    ) as HTMLButtonElement | null

    await act(async () => {
      typeButton?.dispatchEvent(new MouseEvent('mouseover', { bubbles: true, cancelable: true }))
    })

    const consoleButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionSubmenu .ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Console') as HTMLButtonElement | undefined

    expect(consoleButton).not.toBeUndefined()

    await act(async () => {
      consoleButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onRequestSurfaceKind).toHaveBeenCalledWith('console')
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('includes edit history in the default viewport type picker', async () => {
    const onRequestSurfaceKind = vi.fn()
    await renderFrame({ onRequestSurfaceKind })

    const modeButton = container?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const editHistoryButton = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Edit History') as HTMLButtonElement | undefined

    expect(editHistoryButton).not.toBeUndefined()
    expect(editHistoryButton?.disabled).toBe(false)

    await act(async () => {
      editHistoryButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onRequestSurfaceKind).toHaveBeenCalledWith('editHistory')
    expect(container?.querySelector('.ViewportFrameTypePicker')).toBeNull()
  })

  it('includes properties in the default viewport type picker', async () => {
    const onRequestSurfaceKind = vi.fn()
    await renderFrame({ onRequestSurfaceKind })

    const modeButton = container?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null

    await act(async () => {
      modeButton?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const propertiesButton = Array.from(
      container?.querySelectorAll('.ViewportFrameTypePickerAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Properties') as HTMLButtonElement | undefined

    expect(propertiesButton).not.toBeUndefined()
    expect(propertiesButton?.disabled).toBe(false)

    await act(async () => {
      propertiesButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onRequestSurfaceKind).toHaveBeenCalledWith('properties')
    expect(container?.querySelector('.ViewportFrameTypePicker')).toBeNull()
  })

  it('calls the close action from the viewport titlebar menu', async () => {
    const onClose = vi.fn()
    await renderFrame({ onClose })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(new MouseEvent('contextmenu', { bubbles: true, cancelable: true }))
    })

    const closeButton = Array.from(
      container?.querySelectorAll('.ViewportFrameActionMenuAction') ?? [],
    ).find((button) => button.textContent?.trim() === 'Close') as HTMLButtonElement | undefined

    expect(closeButton).not.toBeUndefined()

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('calls the close action from the inline split-pane close button', async () => {
    const onClose = vi.fn()
    await renderFrame({ onClose, showInlineCloseButton: true })

    const closeButton = container?.querySelector(
      '.ViewportFrameInlineCloseButton',
    ) as HTMLButtonElement | null

    expect(closeButton).not.toBeNull()
    expect(closeButton?.textContent).toBe('x')
    expect(closeButton?.getAttribute('aria-label')).toBe('Close Browser split pane')

    await act(async () => {
      closeButton?.dispatchEvent(new MouseEvent('click', { bubbles: true, cancelable: true }))
    })

    expect(onClose).toHaveBeenCalledTimes(1)
    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('hides the inline split-pane close button without the explicit show prop and close action', async () => {
    await renderFrame({ onClose: undefined, showInlineCloseButton: true })

    expect(container?.querySelector('.ViewportFrameInlineCloseButton')).toBeNull()
  })

  it('anchors the viewport action menu near the right-click position', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 210,
          clientY: 96,
        }),
      )
    })

    const menu = container?.querySelector('.ViewportFrameActionMenu') as HTMLDivElement | null
    expect(menu).not.toBeNull()
    expect(menu?.style.left).toBe('210px')
    expect(menu?.style.top).toBe('96px')
  })

  it('closes the viewport action menu when clicking elsewhere in the frame', async () => {
    await renderFrame()

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null

    await act(async () => {
      header?.dispatchEvent(
        new MouseEvent('contextmenu', {
          bubbles: true,
          cancelable: true,
          clientX: 210,
          clientY: 96,
        }),
      )
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).not.toBeNull()

    const body = container?.querySelector('.ViewportFrameBody') as HTMLDivElement | null
    await act(async () => {
      body?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
        }),
      )
    })

    expect(container?.querySelector('.ViewportFrameActionMenu')).toBeNull()
  })

  it('calls header drag-out when the title bar is dragged past the threshold', async () => {
    const onHeaderDragOut = vi.fn()
    await renderFrame({
      onHeaderDragOut,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(header).not.toBeNull()

    await act(async () => {
      header?.dispatchEvent(
        new PointerEvent('pointerdown', {
          bubbles: true,
          cancelable: true,
          button: 0,
          pointerId: 1,
          clientX: 80,
          clientY: 40,
        }),
      )
      window.dispatchEvent(
        new PointerEvent('pointermove', {
          bubbles: true,
          cancelable: true,
          pointerId: 1,
          clientX: 120,
          clientY: 78,
        }),
      )
    })

    expect(onHeaderDragOut).toHaveBeenCalledTimes(1)
  })

  it('prevents default text-selection behavior when titlebar drag-out begins', async () => {
    const onHeaderDragOut = vi.fn()
    await renderFrame({
      onHeaderDragOut,
    })

    const header = container?.querySelector('.ViewportFrameHeader') as HTMLDivElement | null
    expect(header).not.toBeNull()

    const pointerDownEvent = new PointerEvent('pointerdown', {
      bubbles: true,
      cancelable: true,
      button: 0,
      pointerId: 1,
      clientX: 80,
      clientY: 40,
    })

    await act(async () => {
      header?.dispatchEvent(pointerDownEvent)
    })

    expect(pointerDownEvent.defaultPrevented).toBe(true)
  })

  it('can left-align header supplement content for overlay viewport controls', async () => {
    await renderFrame({
      surfaceKind: 'modelViewer',
      headerSupplementAlignment: 'start',
      headerSupplement: <div className="OverlaySupplementMock">Overlay Controls</div>,
    })

    const supplement = container?.querySelector(
      '.ViewportFrameHeaderSupplement',
    ) as HTMLDivElement | null

    expect(supplement?.classList.contains('ViewportFrameHeaderSupplement--start')).toBe(true)
    expect(supplement?.classList.contains('ViewportFrameHeaderSupplement--end')).toBe(false)
    expect(supplement?.textContent).toContain('Overlay Controls')
  })

  it('keeps start-side presentation controls after the shared viewport type button', async () => {
    await renderFrame({
      surfaceKind: 'modelViewer',
      headerStartSupplement: (
        <button type="button" className="ViewportFrameHeaderControlButton">
          A
        </button>
      ),
    })

    const modeButton = container?.querySelector('.ViewportFrameModeButton') as HTMLButtonElement | null
    const resultModeButton = container?.querySelector(
      '.ViewportFrameHeaderControlButton',
    ) as HTMLButtonElement | null

    expect(modeButton?.textContent).toBe('-')
    expect(resultModeButton?.textContent).toBe('A')
    expect(
      modeButton?.compareDocumentPosition(resultModeButton ?? document.body) ??
        Node.DOCUMENT_POSITION_PRECEDING,
    ).toBe(Node.DOCUMENT_POSITION_FOLLOWING)
  })
})
