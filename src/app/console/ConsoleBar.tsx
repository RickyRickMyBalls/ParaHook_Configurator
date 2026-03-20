import {
  useEffect,
  useRef,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { CONSOLE_MAX_EXPANDED_HEIGHT, useConsoleStore } from './useConsoleStore'
import type { ConsoleStagedNavigationSession } from './stagedNavigation'

type ConsoleBarProps = {
  surfaceMode?: 'docked' | 'floating' | 'popout'
  showExpandToggle?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onSubmitCommand?: (commandText: string) => void
  onCancelCommand?: () => void
  treatSpaceAsSubmit?: boolean
}

export function ConsoleBar({
  surfaceMode = 'docked',
  showExpandToggle = true,
  inputRef,
  onSubmitCommand,
  onCancelCommand,
  treatSpaceAsSubmit = false,
}: ConsoleBarProps) {
  const barRef = useRef<HTMLDivElement | null>(null)
  const summaryChoicesViewportRef = useRef<HTMLSpanElement | null>(null)
  const isExpanded = useConsoleStore((state) => state.isExpanded)
  const expandedHeight = useConsoleStore((state) => state.expandedHeight)
  const summaryWidth = useConsoleStore((state) => state.summaryWidth)
  const inputText = useConsoleStore((state) => state.inputText)
  const entries = useConsoleStore((state) => state.entries)
  const visibleLayers = useConsoleStore((state) => state.visibleLayers)
  const stagedNavigationSession = useConsoleStore((state) => state.stagedNavigationSession)
  const featureAssistDescriptor = useConsoleStore((state) => state.featureAssistDescriptor)
  const stagedChoiceIndex = useConsoleStore((state) => state.stagedChoiceIndex)
  const isStagedChoiceManualOverride = useConsoleStore(
    (state) => state.isStagedChoiceManualOverride,
  )
  const setInputText = useConsoleStore((state) => state.setInputText)
  const recallPreviousHistory = useConsoleStore((state) => state.recallPreviousHistory)
  const recallNextHistory = useConsoleStore((state) => state.recallNextHistory)
  const resetHistoryNavigation = useConsoleStore((state) => state.resetHistoryNavigation)
  const setExpandedHeightFromDrag = useConsoleStore((state) => state.setExpandedHeightFromDrag)
  const setSummaryWidth = useConsoleStore((state) => state.setSummaryWidth)
  const toggleExpanded = useConsoleStore((state) => state.toggleExpanded)
  const cycleStagedChoice = useConsoleStore((state) => state.cycleStagedChoice)
  const summaryText =
    [...entries].reverse().find((entry) => visibleLayers[entry.layer] ?? true)?.text ?? 'Ready'

  const normalizeChoiceToken = (value: string): string => value.trim().toUpperCase()

  const buildStagedSummaryPrefix = (session: ConsoleStagedNavigationSession): string => {
    switch (session.scopeId) {
      case 'graphRoot':
        return 'Graph > Choose next'
      case 'graphSelected':
        return 'Graph > Choose next'
      case 'graphSketchList':
      case 'graphSketchSelected':
        return 'Sketch > Choose next'
      case 'graphExtrudeList':
      case 'graphExtrudeSelected':
        return 'Extrude > Choose next'
      case 'graphOutputPreviewList':
      case 'graphOutputPreviewSelected':
        return 'Output Preview > Choose next'
      default:
        return 'Choose next'
    }
  }

  const parsePromptSummary = (
    text: string,
  ): {
    prefix: string
    choices: string[]
    activeChoiceIndex: number | null
  } | null => {
    const matchedPrompt = text.match(/^(.*?Choose next)\s*\[(.*)\]$/)
    if (matchedPrompt === null) {
      return null
    }

    const prefix = matchedPrompt[1]?.trim()
    const rawChoices = matchedPrompt[2]?.trim()
    if (prefix === undefined || rawChoices === undefined || rawChoices.length === 0) {
      return null
    }

    const choices = rawChoices
      .split(',')
      .map((choice) => choice.trim())
      .filter((choice) => choice.length > 0)

    if (choices.length === 0) {
      return null
    }

    const normalizedInput = normalizeChoiceToken(inputText)
    const activeChoiceIndex =
      normalizedInput.length === 0
        ? 0
        : choices.findIndex((choice) => normalizeChoiceToken(choice) === normalizedInput)

    return {
      prefix,
      choices,
      activeChoiceIndex: activeChoiceIndex === -1 ? null : activeChoiceIndex,
    }
  }

  const activeSummary =
    stagedNavigationSession !== null && stagedNavigationSession.validChoices.length > 0
      ? {
          prefix: buildStagedSummaryPrefix(stagedNavigationSession),
          choices: stagedNavigationSession.validChoices.map((choice) => choice.label),
          activeChoiceIndex: stagedChoiceIndex ?? 0,
        }
      : featureAssistDescriptor !== null && featureAssistDescriptor.choices.length > 0
        ? {
            prefix: `${featureAssistDescriptor.label} >`,
            choices: featureAssistDescriptor.choices.map((choice) => choice.label),
            activeChoiceIndex: stagedChoiceIndex ?? 0,
          }
      : parsePromptSummary(summaryText)

  useEffect(() => {
    const viewport = summaryChoicesViewportRef.current
    if (viewport === null) {
      return
    }

    const activeChoice = viewport.querySelector('.ConsoleBarSummaryChoice.isActive') as HTMLElement | null
    if (typeof activeChoice?.scrollIntoView !== 'function') {
      return
    }

    activeChoice.scrollIntoView({
      block: 'nearest',
      inline: 'nearest',
    })
  }, [activeSummary?.activeChoiceIndex, activeSummary?.choices.join('|')])

  const summary =
    activeSummary !== null ? (
      <>
        <span className="ConsoleBarSummaryPrefix">{activeSummary.prefix}</span>
        <span
          ref={summaryChoicesViewportRef}
          className="ConsoleBarSummaryChoicesViewport"
          aria-label="Console staged choices"
        >
          <span className="ConsoleBarSummaryChoices">
            <span className="ConsoleBarSummaryBracket">[</span>
            {activeSummary.choices.map((choice, index) => (
              <span
                key={`${choice}-${index}`}
                className={`ConsoleBarSummaryChoice ${
                  index === activeSummary.activeChoiceIndex ? 'isActive' : ''
                }`}
              >
                {choice}
                {index < activeSummary.choices.length - 1 ? (
                  <span className="ConsoleBarSummarySeparator">, </span>
                ) : null}
              </span>
            ))}
            <span className="ConsoleBarSummaryBracket">]</span>
          </span>
        </span>
      </>
    ) : (
      summaryText
    )

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmitCommand?.(inputText)
    resetHistoryNavigation()
    queueMicrotask(() => {
      const input = inputRef?.current
      if (input === null || input === undefined) {
        return
      }

      const nextState = useConsoleStore.getState()
      if (
        (nextState.stagedNavigationSession !== null || nextState.featureAssistDescriptor !== null) &&
        !nextState.isStagedChoiceManualOverride &&
        nextState.inputText.length > 0
      ) {
        input.focus()
        const caretOffset = nextState.inputText.length
        input.setSelectionRange(caretOffset, caretOffset)
        return
      }

      input.blur()
    })
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (treatSpaceAsSubmit && event.key === ' ') {
      event.preventDefault()
      if (inputText.trim().length === 0) {
        return
      }
      onSubmitCommand?.(inputText)
      resetHistoryNavigation()
      return
    }
    if (
      (stagedNavigationSession !== null || featureAssistDescriptor !== null) &&
      !isStagedChoiceManualOverride &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault()
      setInputText(event.key)
      return
    }
    if ((stagedNavigationSession !== null || featureAssistDescriptor !== null) && event.key === 'ArrowUp') {
      event.preventDefault()
      cycleStagedChoice('previous')
      return
    }
    if ((stagedNavigationSession !== null || featureAssistDescriptor !== null) && event.key === 'ArrowDown') {
      event.preventDefault()
      cycleStagedChoice('next')
      return
    }
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
      if ((stagedNavigationSession !== null || featureAssistDescriptor !== null) && !isStagedChoiceManualOverride) {
        onCancelCommand?.()
        resetHistoryNavigation()
        inputRef?.current?.blur()
        return
      }
      onCancelCommand?.()
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

  const handleSummaryResizeStart = (event: ReactPointerEvent<HTMLDivElement>) => {
    const barElement = barRef.current
    if (barElement === null) {
      return
    }

    event.preventDefault()
    event.stopPropagation()

    const move = (moveEvent: PointerEvent) => {
      const barRect = barElement.getBoundingClientRect()
      const nextWidth = moveEvent.clientX - barRect.left - 12
      setSummaryWidth(nextWidth)
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
    <div
      ref={barRef}
      className={`ConsoleBar ConsoleBar--${surfaceMode}`}
      style={{
        gridTemplateColumns:
          summaryWidth === null
            ? 'minmax(180px, 1fr) 8px minmax(180px, 1fr) auto'
            : `minmax(180px, ${summaryWidth}px) 8px minmax(0, 1fr) auto`,
      }}
    >
      <div
        className="ConsoleBarResizeHandle"
        onPointerDown={handleResizeStart}
        aria-hidden="true"
      />
      <div className="ConsoleBarSummary" aria-label="Console summary">
        {summary}
      </div>
      <div
        className="ConsoleBarDivider"
        role="separator"
        aria-label="Resize console summary"
        aria-orientation="vertical"
        onPointerDown={handleSummaryResizeStart}
      />
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
