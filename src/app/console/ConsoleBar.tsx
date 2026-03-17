import {
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { CONSOLE_MAX_EXPANDED_HEIGHT, useConsoleStore } from './useConsoleStore'

type ConsoleBarProps = {
  surfaceMode?: 'docked' | 'floating' | 'popout'
  showExpandToggle?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onSubmitCommand?: (commandText: string) => void
}

export function ConsoleBar({
  surfaceMode = 'docked',
  showExpandToggle = true,
  inputRef,
  onSubmitCommand,
}: ConsoleBarProps) {
  const isExpanded = useConsoleStore((state) => state.isExpanded)
  const expandedHeight = useConsoleStore((state) => state.expandedHeight)
  const inputText = useConsoleStore((state) => state.inputText)
  const entries = useConsoleStore((state) => state.entries)
  const visibleLayers = useConsoleStore((state) => state.visibleLayers)
  const setInputText = useConsoleStore((state) => state.setInputText)
  const recallPreviousHistory = useConsoleStore((state) => state.recallPreviousHistory)
  const recallNextHistory = useConsoleStore((state) => state.recallNextHistory)
  const resetHistoryNavigation = useConsoleStore((state) => state.resetHistoryNavigation)
  const setExpandedHeightFromDrag = useConsoleStore((state) => state.setExpandedHeightFromDrag)
  const toggleExpanded = useConsoleStore((state) => state.toggleExpanded)
  const summaryText =
    [...entries].reverse().find((entry) => visibleLayers[entry.layer] ?? true)?.text ?? 'Ready'

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmitCommand?.(inputText)
    resetHistoryNavigation()
    inputRef?.current?.blur()
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.key === 'ArrowUp') {
      event.preventDefault()
      recallPreviousHistory()
      return
    }
    if (event.key === 'ArrowDown') {
      event.preventDefault()
      recallNextHistory()
      return
    }
    if (event.key === 'Escape') {
      event.preventDefault()
      if (inputText.length > 0) {
        setInputText('')
        return
      }
      resetHistoryNavigation()
      inputRef?.current?.blur()
    }
  }

  const handleResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (surfaceMode !== 'docked') {
      return
    }
    event.preventDefault()
    event.stopPropagation()
    const startY = event.clientY
    const startHeight = isExpanded ? expandedHeight : 0
    const move = (moveEvent: PointerEvent) => {
      const delta = startY - moveEvent.clientY
      const viewportHeight = typeof window === 'undefined' ? startHeight : window.innerHeight
      const nextHeight = Math.min(
        startHeight + delta,
        Math.min(CONSOLE_MAX_EXPANDED_HEIGHT, viewportHeight),
      )
      setExpandedHeightFromDrag(nextHeight)
    }
    const stop = () => {
      window.removeEventListener('pointermove', move)
      window.removeEventListener('pointerup', stop)
      window.removeEventListener('pointercancel', stop)
    }
    window.addEventListener('pointermove', move)
    window.addEventListener('pointerup', stop)
    window.addEventListener('pointercancel', stop)
  }

  return (
    <div className={`ConsoleBar ConsoleBar--${surfaceMode}`}>
      <div
        className="ConsoleBarResizeHandle"
        onPointerDown={handleResizeStart}
        aria-hidden="true"
      />
      <div className="ConsoleBarSummary" aria-label="Console summary">
        {summaryText}
      </div>
      <form className="ConsoleInputRow" onSubmit={handleSubmit}>
        <span className="ConsolePrompt" aria-hidden="true">
          {'>'}
        </span>
        <input
          ref={inputRef}
          className="ConsoleInput"
          aria-label="Console input"
          value={inputText}
          onChange={(event) => setInputText(event.target.value)}
          onKeyDown={handleInputKeyDown}
          onBlur={resetHistoryNavigation}
          placeholder="Type a command"
        />
      </form>
      {showExpandToggle ? (
        <button
          type="button"
          className="ConsoleExpandToggle"
          aria-label={isExpanded ? 'Collapse console' : 'Expand console'}
          title={isExpanded ? 'Collapse console' : 'Expand console'}
          onClick={toggleExpanded}
        >
          {isExpanded ? 'v' : '^'}
        </button>
      ) : null}
    </div>
  )
}
