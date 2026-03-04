import { useEffect, useRef } from 'react'
import { buildDispatcher } from '../buildDispatcher'
import { useAppStore } from '../store/useAppStore'

export function Toolbar() {
  const box = useAppStore((state) => state.box)
  const inputMode = useAppStore((state) => state.inputMode)
  const viewMode = useAppStore((state) => state.viewMode)
  const workerError = useAppStore((state) => state.workerError)
  const setInputMode = useAppStore((state) => state.setInputMode)
  const setViewMode = useAppStore((state) => state.setViewMode)

  const assembledCached = buildDispatcher.isAssembledCacheValid(box)
  const isAssembled = viewMode === 'assembled'
  const previewDetailsRef = useRef<HTMLDetailsElement | null>(null)

  useEffect(() => {
    if (inputMode !== 'spaghetti') {
      return
    }
    previewDetailsRef.current?.removeAttribute('open')
  }, [inputMode])

  const toggleMode = () => {
    if (isAssembled) {
      setViewMode('parts')
      return
    }
    buildDispatcher.assembleIfNeeded(box)
    setViewMode('assembled')
  }

  return (
    <section className="V15Panel">
      <details ref={previewDetailsRef} className="V15PanelCollapsible" open>
        <summary className="V15PanelSummary">
          <h3 className="V15PanelTitle">Preview Mode</h3>
        </summary>
        <div className="V15Wrap">
          <button
            type="button"
            className={`BuildPolicyButton ${inputMode === 'legacy' ? 'BuildPolicyButton--live' : ''}`}
            onClick={() => setInputMode('legacy')}
            disabled={inputMode === 'legacy'}
          >
            Legacy
          </button>
          <button
            type="button"
            className={`BuildPolicyButton ${inputMode === 'spaghetti' ? 'BuildPolicyButton--release' : ''}`}
            onClick={() => setInputMode('spaghetti')}
            disabled={inputMode === 'spaghetti'}
          >
            Spaghetti
          </button>
        </div>
        <div className="V15Meta">Input mode: {inputMode}</div>
        <div className="V15Row">
          <span className={`ModeLabel ${isAssembled ? '' : 'isActive'}`}>Parts</span>
          <button
            type="button"
            role="switch"
            aria-checked={isAssembled}
            aria-label="Toggle preview mode"
            className={`ModeSwitch ${isAssembled ? 'isAssembled' : 'isParts'}`}
            onClick={toggleMode}
          >
            <span className="ModeSwitchThumb" />
          </button>
          <span className={`ModeLabel ${isAssembled ? 'isActive isAssembled' : ''}`}>
            Assembled
          </span>
        </div>
        <div className="V15Meta">
          {assembledCached ? 'Assembled cache ready.' : 'Assembled cache stale or empty.'}
        </div>
      </details>
      {workerError !== null ? <div className="V15Error">{workerError}</div> : null}
    </section>
  )
}
