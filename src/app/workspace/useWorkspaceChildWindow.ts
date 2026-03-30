import { useEffect, useRef, useState } from 'react'
import type { WorkspaceChildWindowSpec } from './workspaceShellTypes'

const styleCloneMarker = 'data-workspace-child-window-style-clone'
const hostMarker = 'data-workspace-child-window-host'

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
  const suppressCloseRef = useRef(false)
  const [childWindow, setChildWindow] = useState<Window | null>(null)
  const [host, setHost] = useState<HTMLElement | null>(null)

  useEffect(() => {
    if (!isOpen) {
      const popup = childWindowRef.current
      if (popup !== null && !popup.closed) {
        suppressCloseRef.current = true
        popup.close()
      }
      childWindowRef.current = null
      setChildWindow(null)
      setHost(null)
      return
    }

    let popup = childWindowRef.current
    if (popup === null || popup.closed) {
      popup = window.open('', spec.windowName, spec.windowFeatures)
      if (popup === null || popup === undefined) {
        onBlocked?.()
        return
      }
      childWindowRef.current = popup
      setChildWindow(popup)
      popup.document.title = spec.windowTitle
      popup.document.body.innerHTML = ''
      popup.document.documentElement.style.height = '100%'
      popup.document.body.style.margin = '0'
      popup.document.body.style.height = '100%'
      popup.document.body.style.background = bodyBackground
      popup.document.body.style.overflow = 'hidden'
      copyDocumentStyles(document, popup.document)
      const nextHost = popup.document.createElement('div')
      nextHost.className = rootClassName
      nextHost.setAttribute(hostMarker, spec.childWindowId)
      nextHost.style.width = '100%'
      nextHost.style.height = '100%'
      popup.document.body.appendChild(nextHost)
      setHost(nextHost)
      const handleBeforeUnload = () => {
        childWindowRef.current = null
        setChildWindow(null)
        setHost(null)
        if (suppressCloseRef.current) {
          suppressCloseRef.current = false
          return
        }
        onClosed?.()
      }
      popup.addEventListener('beforeunload', handleBeforeUnload, { once: true })
      return
    }

    popup.focus()
    setChildWindow(popup)
    const existingHost = popup.document.querySelector(`[${hostMarker}="${spec.childWindowId}"]`)
    if (existingHost instanceof HTMLElement) {
      setHost(existingHost)
      return
    }
    const nextHost = popup.document.createElement('div')
    nextHost.className = rootClassName
    nextHost.setAttribute(hostMarker, spec.childWindowId)
    nextHost.style.width = '100%'
    nextHost.style.height = '100%'
    popup.document.body.appendChild(nextHost)
    setHost(nextHost)
  }, [bodyBackground, isOpen, onBlocked, onClosed, rootClassName, spec])

  useEffect(() => {
    return () => {
      const popup = childWindowRef.current
      if (popup !== null && popup !== undefined && !popup.closed) {
        suppressCloseRef.current = true
        popup.close()
      }
    }
  }, [])

  return {
    childWindow,
    host,
  }
}
