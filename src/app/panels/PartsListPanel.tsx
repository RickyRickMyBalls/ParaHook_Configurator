import { useEffect, useMemo, useRef } from 'react'
import { useAppStore } from '../store/useAppStore'
import {
  artifactToPartKeyStr,
  parseInstancePartKey,
  partKeyStrToLabel,
} from '../parts/partKeyResolver'
import { selectChangedGeomParamIds } from '../store/useAppStore'
import { useSpaghettiStore } from '../spaghetti/store/useSpaghettiStore'
import { selectPartsListPanelVm } from '../spaghetti/selectors'

export function PartsListPanel() {
  const parts = useAppStore((state) => state.parts)
  const partsVisibility = useAppStore((state) => state.partsVisibility)
  const selectedPartKey = useAppStore((state) => state.selectedPartKey)
  const inputMode = useAppStore((state) => state.inputMode)
  const graph = useSpaghettiStore((state) => state.graph)
  const buildPolicy = useAppStore((state) => state.buildPolicy)
  const dirtyCount = useAppStore((state) => selectChangedGeomParamIds(state).length)
  const heelKickInstances = useAppStore((state) => state.heelKickInstances)
  const toeHookInstances = useAppStore((state) => state.toeHookInstances)
  const togglePartVisibility = useAppStore((state) => state.togglePartVisibility)
  const selectPart = useAppStore((state) => state.selectPart)
  const setBuildPolicy = useAppStore((state) => state.setBuildPolicy)
  const requestManualBuild = useAppStore((state) => state.requestManualBuild)
  const addHeelKickInstance = useAppStore((state) => state.addHeelKickInstance)
  const addToeHookInstance = useAppStore((state) => state.addToeHookInstance)
  const removeHeelKickInstance = useAppStore((state) => state.removeHeelKickInstance)
  const removeToeHookInstance = useAppStore((state) => state.removeToeHookInstance)
  const partsDetailsRef = useRef<HTMLDetailsElement | null>(null)
  const spaghettiVm = useMemo(() => selectPartsListPanelVm(graph), [graph])

  useEffect(() => {
    if (inputMode !== 'spaghetti') {
      return
    }
    partsDetailsRef.current?.removeAttribute('open')
  }, [inputMode])

  return (
    <section className="V15Panel PartsListPanel">
      <details ref={partsDetailsRef} className="V15PanelCollapsible" open>
        <summary className="V15PanelSummary">
          <h3 className="V15PanelTitle">Parts List</h3>
        </summary>
        {inputMode === 'legacy' ? (
          <>
            <div className="V15Wrap">
              <button
                type="button"
                className={`BuildPolicyButton BuildPolicyButton--${buildPolicy}`}
                onClick={() =>
                  setBuildPolicy(
                    buildPolicy === 'live' ? 'release' : buildPolicy === 'release' ? 'manual' : 'live'
                  )
                }
              >
                Build Policy: {buildPolicy}
              </button>
              <button
                type="button"
                onClick={requestManualBuild}
                disabled={dirtyCount === 0}
              >
                {dirtyCount > 0 ? `Build (${dirtyCount})` : 'Build'}
              </button>
            </div>
            <div className="V15Wrap">
              <button type="button" onClick={addHeelKickInstance}>
                Add Heel Kick
              </button>
              <button type="button" onClick={addToeHookInstance}>
                Add Toe Hook
              </button>
            </div>
          </>
        ) : (
          <div className="V15Meta">Use Spaghetti Panel to compile/build.</div>
        )}
        {inputMode === 'legacy'
          ? parts.map((part) => {
              const partKeyStr = artifactToPartKeyStr(part)
              const parsed = parseInstancePartKey(partKeyStr)
              const isSelected = partKeyStr === selectedPartKey
              const isVisible = partsVisibility[partKeyStr] ?? true
              const isInstanceRow = parsed !== null
              const canRemove =
                parsed === null
                  ? false
                  : parsed.id === 'heelKick'
                    ? heelKickInstances.length > 1
                    : toeHookInstances.length > 1
              return (
                <div
                  key={partKeyStr}
                  onClick={() => {
                    selectPart(isSelected ? null : partKeyStr)
                  }}
                  className={`V15PartRow ${isSelected ? 'isSelected' : ''} ${isVisible ? 'isVisible' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="V15PartCheckbox"
                    checked={isVisible}
                    onChange={(event) => {
                      event.stopPropagation()
                      togglePartVisibility(partKeyStr)
                    }}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <span>{partKeyStrToLabel(partKeyStr)}</span>
                  {isInstanceRow ? (
                    <button
                      type="button"
                      className="IconButton"
                      disabled={!canRemove}
                      onClick={(event) => {
                        event.stopPropagation()
                        if (parsed === null) {
                          return
                        }
                        if (parsed.id === 'heelKick') {
                          removeHeelKickInstance(parsed.instance)
                          return
                        }
                        removeToeHookInstance(parsed.instance)
                      }}
                    >
                      Del
                    </button>
                  ) : null}
                </div>
              )
            })
          : spaghettiVm.items.map((item) => {
              const partKeyStr = item.slotId
              const isSelected = partKeyStr === selectedPartKey
              const isVisible = partsVisibility[partKeyStr] ?? true
              return (
                <div
                  key={item.key}
                  onClick={() => {
                    selectPart(isSelected ? null : partKeyStr)
                  }}
                  className={`V15PartRow ${isSelected ? 'isSelected' : ''} ${isVisible ? 'isVisible' : ''}`}
                >
                  <input
                    type="checkbox"
                    className="V15PartCheckbox"
                    checked={isVisible}
                    onChange={(event) => {
                      event.stopPropagation()
                      togglePartVisibility(partKeyStr)
                    }}
                    onClick={(event) => event.stopPropagation()}
                  />
                  <span style={{ display: 'flex', flexDirection: 'column' }}>
                    <span style={{ display: 'inline-flex', alignItems: 'center', gap: 6 }}>
                      <span>{item.primaryLabel}</span>
                      {item.slotStatus === 'unresolved' ? (
                        <span
                          className="V15PartWarning"
                          title={item.warningMessage ?? 'Unresolved slot input.'}
                        >
                          !
                        </span>
                      ) : null}
                    </span>
                    {item.secondaryLabel === null ? null : (
                      <span style={{ opacity: 0.78, fontSize: 11 }}>{item.secondaryLabel}</span>
                    )}
                  </span>
                </div>
              )
            })}
      </details>
    </section>
  )
}
