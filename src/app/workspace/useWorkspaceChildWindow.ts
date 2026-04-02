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

const ensureDocumentHead = (targetDocument: Document): HTMLHeadElement | null => {
  if (targetDocument.head !== null) {
    return targetDocument.head
  }
  const documentElement = targetDocument.documentElement
  if (documentElement === null) {
    return null
  }
  const nextHead = targetDocument.createElement('head') as HTMLHeadElement
  documentElement.insertBefore(nextHead, documentElement.firstChild)
  return targetDocument.head ?? nextHead
}

const ensureDocumentBody = (targetDocument: Document): HTMLBodyElement | null => {
  if (targetDocument.body !== null) {
    return targetDocument.body as HTMLBodyElement
  }
  const documentElement = targetDocument.documentElement
  if (documentElement === null) {
    return null
  }
  const nextBody = targetDocument.createElement('body') as HTMLBodyElement
  documentElement.appendChild(nextBody)
  return (targetDocument.body as HTMLBodyElement | null) ?? nextBody
}

const isHtmlElement = (candidate: unknown): candidate is HTMLElement => {
  if (
    candidate === null ||
    candidate === undefined ||
    typeof candidate !== 'object' ||
    !('nodeType' in candidate) ||
    (candidate as { nodeType?: unknown }).nodeType !== Node.ELEMENT_NODE
  ) {
    return false
  }
  const ownerDocument =
    'ownerDocument' in candidate
      ? ((candidate as { ownerDocument?: Document | null }).ownerDocument ?? null)
      : null
  const ownerWindow = ownerDocument?.defaultView
  if (ownerWindow === null || ownerWindow === undefined) {
    return true
  }
  return candidate instanceof ownerWindow.HTMLElement
}

const isHtmlBodyElement = (candidate: unknown): candidate is HTMLBodyElement => {
  if (
    candidate === null ||
    candidate === undefined ||
    typeof candidate !== 'object' ||
    !('nodeType' in candidate) ||
    (candidate as { nodeType?: unknown }).nodeType !== Node.ELEMENT_NODE
  ) {
    return false
  }
  const ownerDocument =
    'ownerDocument' in candidate
      ? ((candidate as { ownerDocument?: Document | null }).ownerDocument ?? null)
      : null
  const ownerWindow = ownerDocument?.defaultView
  if (ownerWindow === null || ownerWindow === undefined) {
    return (
      'tagName' in candidate &&
      typeof (candidate as { tagName?: unknown }).tagName === 'string' &&
      (candidate as { tagName: string }).tagName.toUpperCase() === 'BODY'
    )
  }
  return candidate instanceof ownerWindow.HTMLBodyElement
}

const copyDocumentStyles = (sourceDocument: Document, targetDocument: Document) => {
  const targetHead = ensureDocumentHead(targetDocument)
  if (targetHead === null) {
    return
  }
  const existing = targetDocument.querySelector(`[${styleCloneMarker}="true"]`)
  if (existing !== null) {
    return
  }
  const fragment = targetDocument.createDocumentFragment()
  Array.from(sourceDocument.querySelectorAll('link[rel="stylesheet"], style')).forEach((node) => {
    const clone = node.cloneNode(true)
    if (isHtmlElement(clone)) {
      clone.setAttribute(styleCloneMarker, 'true')
    }
    fragment.appendChild(clone)
  })
  targetHead.appendChild(fragment)
}

const isUsableChildWindowHost = (
  targetWindow: Window,
  candidate: Element | null,
  childWindowId: string,
): candidate is HTMLElement => {
  if (!isHtmlElement(candidate)) {
    return false
  }
  const targetBody = targetWindow.document.body
  if (candidate.ownerDocument !== targetWindow.document) {
    return false
  }
  if (!candidate.isConnected) {
    return false
  }
  if (!isHtmlBodyElement(targetBody) || !targetBody.contains(candidate)) {
    return false
  }
  return candidate.getAttribute(hostMarker) === childWindowId
}

const ensureChildWindowHost = (
  targetWindow: Window,
  targetDocument: Document,
  childWindowId: string,
  rootClassName: string,
): HTMLElement => {
  const existingHost = targetDocument.querySelector(`[${hostMarker}="${childWindowId}"]`)
  if (isUsableChildWindowHost(targetWindow, existingHost, childWindowId)) {
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
    const syncTimeoutIds = new Set<ReturnType<typeof setTimeout>>()
    let removeLoadListener: (() => void) | null = null
    const cleanupHostSync = () => {
      syncTimeoutIds.forEach((timeoutId) => clearTimeout(timeoutId))
      syncTimeoutIds.clear()
      removeLoadListener?.()
      removeLoadListener = null
    }
    const syncPopupHost = (targetWindow: Window): HTMLElement | null => {
      if (targetWindow.closed) {
        hostRef.current = null
        setHost(null)
        return null
      }
      targetWindow.document.title = windowTitle
      targetWindow.document.documentElement.style.height = '100%'
      const targetBody = ensureDocumentBody(targetWindow.document)
      if (targetBody === null) {
        hostRef.current = null
        setHost(null)
        return null
      }
      targetBody.style.margin = '0'
      targetBody.style.height = '100%'
      targetBody.style.background = bodyBackground
      targetBody.style.overflow = 'hidden'
      copyDocumentStyles(document, targetWindow.document)
      const nextHost = ensureChildWindowHost(
        targetWindow,
        targetWindow.document,
        childWindowId,
        rootClassName,
      )
      hostRef.current = nextHost
      setHost(nextHost)
      return nextHost
    }
    const scheduleHostSync = (targetWindow: Window) => {
      ;[0, 50, 250, 1000].forEach((delayMs) => {
        const timeoutId = setTimeout(() => {
          syncTimeoutIds.delete(timeoutId)
          if (targetWindow.closed) {
            hostRef.current = null
            setHost(null)
            return
          }
          const currentHost = hostRef.current
          if (
            delayMs !== 0 &&
            isUsableChildWindowHost(targetWindow, currentHost, childWindowId)
          ) {
            return
          }
          if (delayMs !== 0) {
            setHost(null)
          }
          hostRef.current = null
          syncPopupHost(targetWindow)
        }, delayMs)
        syncTimeoutIds.add(timeoutId)
      })
    }
    const validateCurrentHost = (targetWindow: Window) => {
      const currentHost = hostRef.current
      if (currentHost === null) {
        return
      }
      if (isUsableChildWindowHost(targetWindow, currentHost, childWindowId)) {
        return
      }
      hostRef.current = null
      setHost(null)
      const timeoutId = setTimeout(() => {
        syncTimeoutIds.delete(timeoutId)
        syncPopupHost(targetWindow)
      }, 0)
      syncTimeoutIds.add(timeoutId)
    }
    const attachLoadSync = (targetWindow: Window) => {
      const handleLoad = () => {
        syncPopupHost(targetWindow)
      }
      targetWindow.addEventListener('load', handleLoad)
      removeLoadListener = () => {
        targetWindow.removeEventListener('load', handleLoad)
      }
    }
    if (popup === null || popup.closed) {
      popup =
        claimRegisteredChildWindow(childWindowId) ?? window.open('', windowName, windowFeatures)
      if (popup === null || popup === undefined) {
        onBlocked?.()
        return
      }
      const openedPopup = popup
      childWindowRef.current = openedPopup
      registerChildWindow(childWindowId, openedPopup)
      setChildWindow(openedPopup)
      syncPopupHost(openedPopup)
      attachLoadSync(openedPopup)
      scheduleHostSync(openedPopup)
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
      return () => {
        cleanupHostSync()
      }
    }

    registerChildWindow(childWindowId, popup)
    setChildWindow(popup)
    validateCurrentHost(popup)
    syncPopupHost(popup)
    attachLoadSync(popup)
    scheduleHostSync(popup)
    return () => {
      cleanupHostSync()
    }
  }, [
    bodyBackground,
    childWindowId,
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
