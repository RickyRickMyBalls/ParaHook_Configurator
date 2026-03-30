import { useEffect, useRef, useState } from 'react'
import type { WorkspaceChildWindowSpec } from './workspaceShellTypes'

const styleCloneMarker = 'data-workspace-child-window-style-clone'
const hostMarker = 'data-workspace-child-window-host'
const strictModeCloseDelayMs = 0

type RegisteredWorkspaceChildWindow = {
  popup: Window
  closeTimeoutId: ReturnType<typeof setTimeout> | null
}

const childWindowRegistry = new Map<string, RegisteredWorkspaceChildWindow>()

const copyDocumentStyles = (sourceDocument: Document, targetDocument: Document) => {
  const existing = targetDocument.querySelector(`[${styleCloneMarker}="true"]`)
  if (existing !== null) {
    return
  }
  const fragment = targetDocument.createDocumentFragment()
  Array.from(sourceDocument.querySelectorAll('link[rel="stylesheet"], style')).forEach((node) => {
    const clone = node.cloneNode(true)
    if (clone instanceof HTMLElement) {
      clone.setAttribute(styleCloneMarker, 'true')
    }
    fragment.appendChild(clone)
  })
  targetDocument.head.appendChild(fragment)
}

const ensureChildWindowHost = (
  targetDocument: Document,
  childWindowId: string,
  rootClassName: string,
): HTMLElement => {
  const existingHost = targetDocument.querySelector(`[${hostMarker}="${childWindowId}"]`)
  if (existingHost instanceof HTMLElement) {
    return existingHost
  }

  const nextHost = targetDocument.createElement('div')
  nextHost.className = rootClassName
  nextHost.setAttribute(hostMarker, childWindowId)
  nextHost.style.width = '100%'
  nextHost.style.height = '100%'
  targetDocument.body.appendChild(nextHost)
  return nextHost
}

type UseWorkspaceChildWindowOptions = {
  isOpen: boolean
  spec: WorkspaceChildWindowSpec
  rootClassName: string
  bodyBackground?: string
  claimPendingWindow?: () => Window | null
  onBlocked?: () => void
  onClosed?: () => void
}

type WorkspaceChildWindowResult = {
  childWindow: Window | null
  host: HTMLElement | null
}

const registerChildWindow = (childWindowId: string, popup: Window) => {
  const existing = childWindowRegistry.get(childWindowId) ?? null
  if (existing !== null && existing.closeTimeoutId !== null) {
    clearTimeout(existing.closeTimeoutId)
  }
  childWindowRegistry.set(childWindowId, {
    popup,
    closeTimeoutId: null,
  })
}

const claimRegisteredChildWindow = (childWindowId: string): Window | null => {
  const registered = childWindowRegistry.get(childWindowId) ?? null
  if (registered === null) {
    return null
  }
  if (registered.closeTimeoutId !== null) {
    clearTimeout(registered.closeTimeoutId)
    registered.closeTimeoutId = null
  }
  if (registered.popup.closed) {
    childWindowRegistry.delete(childWindowId)
    return null
  }
  return registered.popup
}

const unregisterChildWindow = (childWindowId: string, popup: Window) => {
  const registered = childWindowRegistry.get(childWindowId) ?? null
  if (registered?.popup === popup) {
    if (registered.closeTimeoutId !== null) {
      clearTimeout(registered.closeTimeoutId)
    }
    childWindowRegistry.delete(childWindowId)
  }
}

const scheduleRegisteredChildWindowClose = (
  childWindowId: string,
  popup: Window,
  beforeClose: () => void,
) => {
  const registered = childWindowRegistry.get(childWindowId)
  if (registered !== undefined && registered.closeTimeoutId !== null) {
    clearTimeout(registered.closeTimeoutId)
  }
  const closeTimeoutId = setTimeout(() => {
    const latest = childWindowRegistry.get(childWindowId) ?? null
    if (latest?.popup !== popup || popup.closed) {
      return
    }
    beforeClose()
    popup.close()
    childWindowRegistry.delete(childWindowId)
  }, strictModeCloseDelayMs)
  childWindowRegistry.set(childWindowId, {
    popup,
    closeTimeoutId,
  })
}

export function useWorkspaceChildWindow(
  options: UseWorkspaceChildWindowOptions,
): WorkspaceChildWindowResult {
  const {
    isOpen,
    spec,
    rootClassName,
    bodyBackground = 'rgb(5, 7, 11)',
    claimPendingWindow,
    onBlocked,
    onClosed,
  } = options
  const childWindowRef = useRef<Window | null>(null)
  const hostRef = useRef<HTMLElement | null>(null)
  const suppressCloseRef = useRef(false)
  const [childWindow, setChildWindow] = useState<Window | null>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)
  const { childWindowId, windowFeatures, windowName, windowTitle } = spec

  useEffect(() => {
    if (!isOpen) {
      const popup = childWindowRef.current
      if (popup !== null && !popup.closed) {
        unregisterChildWindow(childWindowId, popup)
        suppressCloseRef.current = true
        popup.close()
      }
      childWindowRef.current = null
      hostRef.current = null
      setChildWindow(null)
      setHost(null)
      return
    }

    let popup = childWindowRef.current
    if (popup === null || popup.closed) {
      popup =
        claimRegisteredChildWindow(childWindowId) ??
        claimPendingWindow?.() ??
        window.open('', windowName, windowFeatures)
      if (popup === null || popup === undefined) {
        onBlocked?.()
        return
      }
      const openedPopup = popup
      childWindowRef.current = openedPopup
      registerChildWindow(childWindowId, openedPopup)
      setChildWindow(openedPopup)
      openedPopup.document.title = windowTitle
      openedPopup.document.documentElement.style.height = '100%'
      openedPopup.document.body.style.margin = '0'
      openedPopup.document.body.style.height = '100%'
      openedPopup.document.body.style.background = bodyBackground
      openedPopup.document.body.style.overflow = 'hidden'
      copyDocumentStyles(document, openedPopup.document)
      const nextHost = ensureChildWindowHost(
        openedPopup.document,
        childWindowId,
        rootClassName,
      )
      hostRef.current = nextHost
      setHost(nextHost)
      const handleBeforeUnload = () => {
        unregisterChildWindow(childWindowId, openedPopup)
        childWindowRef.current = null
        hostRef.current = null
        setChildWindow(null)
        setHost(null)
        if (suppressCloseRef.current) {
          suppressCloseRef.current = false
          return
        }
        onClosed?.()
      }
      openedPopup.addEventListener('beforeunload', handleBeforeUnload, { once: true })
      return
    }

    registerChildWindow(childWindowId, popup)
    popup.document.title = windowTitle
    popup.document.documentElement.style.height = '100%'
    popup.document.body.style.margin = '0'
    popup.document.body.style.height = '100%'
    popup.document.body.style.background = bodyBackground
    popup.document.body.style.overflow = 'hidden'
    copyDocumentStyles(document, popup.document)
    setChildWindow(popup)
    const nextHost = ensureChildWindowHost(popup.document, childWindowId, rootClassName)
    hostRef.current = nextHost
    setHost(nextHost)
  }, [
    bodyBackground,
    childWindowId,
    claimPendingWindow,
    isOpen,
    onBlocked,
    onClosed,
    rootClassName,
    windowFeatures,
    windowName,
    windowTitle,
  ])

  useEffect(() => {
    return () => {
      const popup = childWindowRef.current
      if (popup !== null && popup !== undefined && !popup.closed) {
        scheduleRegisteredChildWindowClose(childWindowId, popup, () => {
          suppressCloseRef.current = true
        })
      }
    }
  }, [childWindowId])

  return {
    childWindow,
    host,
  }
}
