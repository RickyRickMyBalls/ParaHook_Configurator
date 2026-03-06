import { useEffect, useRef, useState, type CSSProperties, type PointerEvent as ReactPointerEvent } from 'react'
import {
  createValidBaseplateHeelKickGraph,
  createCycleGraph,
  createValidBaseplateGraph,
  createValidBaseplateToeHookGraph,
} from '../spaghetti/dev/sampleGraph'
import { SpaghettiEditor } from '../spaghetti/ui/SpaghettiEditor'
import { SpaghettiEditorBoundary } from '../spaghetti/ui/SpaghettiEditorBoundary'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { useAppStore } from '../store/useAppStore'

const describeDiagnosticContext = (diagnostic: {
  nodeId?: string
  edgeId?: string
}): string => {
  const refs: string[] = []
  if (diagnostic.nodeId !== undefined) {
    refs.push(`node:${diagnostic.nodeId}`)
  }
  if (diagnostic.edgeId !== undefined) {
    refs.push(`edge:${diagnostic.edgeId}`)
  }
  return refs.length > 0 ? ` (${refs.join(', ')})` : ''
}

const minCanvasHeight = 100

type ResizeState = {
  startClientY: number
  startHeight: number
  maxHeight: number
}

export function SpaghettiPanel() {
  const [isHeaderCollapsed, setIsHeaderCollapsed] = useState(false)
  const [canvasHeight, setCanvasHeight] = useState<number | null>(null)
  const buildPolicy = useAppStore((state) => state.buildPolicy)
  const spaghettiLastCompile = useAppStore((state) => state.spaghettiLastCompile)
  const setSpaghettiGraph = useAppStore((state) => state.setSpaghettiGraph)
  const compileSpaghetti = useAppStore((state) => state.compileSpaghetti)
  const requestSpaghettiBuild = useAppStore((state) => state.requestSpaghettiBuild)
  const uiMessage = useSpaghettiStore((state) => state.uiMessage)
  const panelRef = useRef<HTMLElement | null>(null)
  const titleRef = useRef<HTMLButtonElement | null>(null)
  const resizeStateRef = useRef<ResizeState | null>(null)

  const errors = spaghettiLastCompile?.diagnostics.errors ?? []
  const warnings = spaghettiLastCompile?.diagnostics.warnings ?? []
  const topoLength = spaghettiLastCompile?.evaluation?.topoOrder.length ?? 0
  const canBuild =
    spaghettiLastCompile?.ok === true &&
    spaghettiLastCompile.buildInputs !== undefined

  useEffect(() => {
    if (canvasHeight === null) {
      return
    }

    const clampHeight = () => {
      const panel = panelRef.current
      const title = titleRef.current
      if (panel === null || title === null) {
        return
      }
      const panelGapAllowance = 32
      const maxHeight = Math.max(
        minCanvasHeight,
        panel.clientHeight - title.getBoundingClientRect().height - panelGapAllowance,
      )
      setCanvasHeight((current) => {
        if (current === null) {
          return current
        }
        return Math.min(maxHeight, Math.max(minCanvasHeight, current))
      })
    }

    window.addEventListener('resize', clampHeight)
    return () => {
      window.removeEventListener('resize', clampHeight)
    }
  }, [canvasHeight])

  const handleResizeStart = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (event.button !== 0) {
      return
    }
    const panel = panelRef.current
    const title = titleRef.current
    if (panel === null || title === null) {
      return
    }

    const canvasWrap = panel.querySelector<HTMLElement>('.SpaghettiPanelCanvasWrap')
    const startHeight = Math.round(canvasWrap?.getBoundingClientRect().height ?? 0)
    const panelGapAllowance = 32
    resizeStateRef.current = {
      startClientY: event.clientY,
      startHeight,
      maxHeight: Math.max(
        minCanvasHeight,
        panel.clientHeight - title.getBoundingClientRect().height - panelGapAllowance,
      ),
    }

    const handlePointerMove = (moveEvent: PointerEvent) => {
      const resizeState = resizeStateRef.current
      if (resizeState === null) {
        return
      }
      const deltaY = moveEvent.clientY - resizeState.startClientY
      const nextHeight = Math.max(
        minCanvasHeight,
        Math.min(resizeState.maxHeight, resizeState.startHeight - deltaY),
      )
      setCanvasHeight(nextHeight)
    }

    const handlePointerUp = () => {
      resizeStateRef.current = null
      window.removeEventListener('pointermove', handlePointerMove)
      window.removeEventListener('pointerup', handlePointerUp)
    }

    window.addEventListener('pointermove', handlePointerMove)
    window.addEventListener('pointerup', handlePointerUp)
    event.preventDefault()
  }

  const handleResetHeight = () => {
    setCanvasHeight(null)
  }

  const canvasWrapStyle: CSSProperties | undefined =
    canvasHeight === null
      ? undefined
      : {
          height: `${canvasHeight}px`,
          flex: '0 0 auto',
        }

  return (
    <section ref={panelRef} className="V15Panel SpaghettiPanelRoot">
      <button
        ref={titleRef}
        type="button"
        className="V15PanelTitle SpaghettiPanelTitleToggle"
        onClick={() => setIsHeaderCollapsed((value) => !value)}
      >
        <span>Spaghetti Editor</span>
        <span>{isHeaderCollapsed ? 'Expand Header' : 'Collapse Header'}</span>
      </button>

      {!isHeaderCollapsed ? (
        <div className="SpaghettiPanelHeaderBlock">
          <div className="SpaghettiPanelHeaderScroll">
            <details className="SpaghettiHelpDetails">
              <summary className="SpaghettiHelpSummary">How To Use Spaghetti Editor</summary>
              <div className="SpaghettiHelpBody">
                <div className="V15Meta">
                  1. Load a sample graph or use Add Part Node in the editor header.
                </div>
                <div className="V15Meta">
                  2. Drag nodes by clicking and dragging the node card.
                </div>
                <div className="V15Meta">
                  3. Make wires by dragging from a right-side output port circle to a left-side input port circle.
                </div>
                <div className="V15Meta">
                  4. Delete a wire by clicking it, then press Delete/Backspace or use Delete Selected Edge.
                </div>
                <div className="V15Meta">
                  5. Rewire quickly: click a connected input anchor to detach and drag that wire to a new input.
                </div>
                <div className="V15Meta">
                  6. Click Compile to validate graph diagnostics.
                </div>
                <div className="V15Meta">
                  7. Click Build only after Compile is OK.
                </div>
              </div>
            </details>

            <div className="V15Wrap">
              <button type="button" onClick={() => setSpaghettiGraph(createValidBaseplateGraph())}>
                Load Baseplate
              </button>
              <button
                type="button"
                onClick={() => setSpaghettiGraph(createValidBaseplateToeHookGraph())}
              >
                Load Baseplate - ToeHook
              </button>
              <button
                type="button"
                onClick={() => setSpaghettiGraph(createValidBaseplateHeelKickGraph())}
              >
                Load Baseplate - HeelKick
              </button>
              <button type="button" onClick={() => setSpaghettiGraph(createCycleGraph())}>
                Load Cycle
              </button>
            </div>

            <div className="V15Wrap">
              <button type="button" onClick={compileSpaghetti}>
                Compile
              </button>
              <button type="button" onClick={requestSpaghettiBuild} disabled={!canBuild}>
                Build
              </button>
            </div>

            <div className="V15Meta">
              Status:{' '}
              {spaghettiLastCompile === null
                ? 'Not compiled'
                : spaghettiLastCompile.ok
                  ? 'OK'
                  : 'Errors'}
            </div>
            <div className="V15Meta">Build policy: {buildPolicy} (manual compile/build in S3)</div>
            <div className="V15Meta">Topo order length: {topoLength}</div>
            <div className="V15Meta">
              Diagnostics: {errors.length} error(s), {warnings.length} warning(s)
            </div>

            {uiMessage !== null ? (
              <div className={uiMessage.level === 'error' ? 'V15Error' : 'V15Meta'}>
                {uiMessage.text}
              </div>
            ) : null}

            {errors.length > 0 ? (
              <div className="V15SectionLabel">
                Errors
                <div className="ItemList">
                  {errors.map((diagnostic, index) => (
                    <div key={`${diagnostic.code}-${index}`} className="V15Error">
                      {diagnostic.code}: {diagnostic.message}
                      {describeDiagnosticContext(diagnostic)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}

            {warnings.length > 0 ? (
              <div className="V15SectionLabel">
                Warnings
                <div className="ItemList">
                  {warnings.map((diagnostic, index) => (
                    <div key={`${diagnostic.code}-${index}`} className="V15Meta">
                      {diagnostic.code}: {diagnostic.message}
                      {describeDiagnosticContext(diagnostic)}
                    </div>
                  ))}
                </div>
              </div>
            ) : null}
          </div>
        </div>
      ) : null}

      <button
        type="button"
        className="SpaghettiCanvasResizeBar"
        onPointerDown={handleResizeStart}
        onDoubleClick={handleResetHeight}
        aria-label="Resize spaghetti editor area"
        title="Drag to resize editor area. Double-click to reset."
      >
        <span className="SpaghettiCanvasResizeGrip" />
      </button>

      <div
        className={`SpaghettiPanelCanvasWrap ${isHeaderCollapsed ? 'isExpanded' : ''}`}
        style={canvasWrapStyle}
      >
        <SpaghettiEditorBoundary>
          <SpaghettiEditor showHeaderControls={!isHeaderCollapsed} />
        </SpaghettiEditorBoundary>
      </div>
    </section>
  )
}
