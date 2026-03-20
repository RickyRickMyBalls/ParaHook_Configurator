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
  onCycleGuidedChoice?: (direction: 'previous' | 'next') => void
  treatSpaceAsSubmit?: boolean
}

export function ConsoleBar({
  surfaceMode = 'docked',
  showExpandToggle = true,
  inputRef,
  onSubmitCommand,
  onCancelCommand,
  onCycleGuidedChoice,
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
  const consolePromptSession = useConsoleStore((state) => state.consolePromptSession)
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

  const buildStagedSummaryBreadcrumb = (session: ConsoleStagedNavigationSession): string[] => {
    switch (session.scopeId) {
      case 'graphRoot':
      case 'graphSelected':
        return ['Graph']
      case 'radioRoot':
        return ['Radio']
      case 'graphNodeList':
      case 'graphNodeSelected':
        return ['Graph', 'Focus Node']
      case 'graphSketchList':
      case 'graphSketchSelected':
        return ['Graph', 'Sketch']
      case 'graphExtrudeList':
      case 'graphExtrudeSelected':
        return ['Graph', 'Extrude']
      case 'graphOutputPreviewList':
      case 'graphOutputPreviewSelected':
        return ['Graph', 'Output Preview']
      default:
        return ['Choose next']
    }
  }

  const parsePromptSummary = (
    text: string,
  ): {
    breadcrumb: string[]
    leadText: string
    choices: string[]
    activeChoiceIndex: number | null
  } | null => {
    const matchedPrompt = text.match(/^(.*?)\s*>\s*(Choose next)\s*\[(.*)\]$/)
    if (matchedPrompt === null) {
      return null
    }

    const breadcrumbText = matchedPrompt[1]?.trim()
    const leadText = matchedPrompt[2]?.trim()
    const rawChoices = matchedPrompt[3]?.trim()
    if (
      breadcrumbText === undefined ||
      leadText === undefined ||
      rawChoices === undefined ||
      rawChoices.length === 0
    ) {
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
      breadcrumb: breadcrumbText.split('>').map((segment) => segment.trim()).filter(Boolean),
      leadText: ` > ${leadText}`,
      choices,
      activeChoiceIndex: activeChoiceIndex === -1 ? null : activeChoiceIndex,
    }
  }

  const activeSummary =
    stagedNavigationSession !== null && stagedNavigationSession.validChoices.length > 0
      ? {
          breadcrumb: buildStagedSummaryBreadcrumb(stagedNavigationSession),
          leadText: ' > Choose next',
          choices: stagedNavigationSession.validChoices.map((choice) => choice.label),
          activeChoiceIndex: stagedChoiceIndex ?? 0,
        }
      : consolePromptSession !== null
        ? {
            breadcrumb: consolePromptSession.breadcrumb,
            leadText: ' > Enter value',
            choices: [consolePromptSession.prefill],
            activeChoiceIndex:
              isStagedChoiceManualOverride || inputText.trim() !== consolePromptSession.prefill.trim()
                ? null
                : 0,
          }
      : featureAssistDescriptor !== null && featureAssistDescriptor.choices.length > 0
        ? {
            breadcrumb:
              featureAssistDescriptor.breadcrumb ?? [featureAssistDescriptor.label],
            leadText: ' > Choose next',
            choices: featureAssistDescriptor.choices.map((choice) => choice.label),
            activeChoiceIndex: stagedChoiceIndex ?? 0,
          }
      : parsePromptSummary(summaryText)

  const guidedInputText =
    stagedNavigationSession !== null && stagedNavigationSession.validChoices.length > 0
      ? stagedNavigationSession.validChoices[stagedChoiceIndex ?? 0]?.label ??
        stagedNavigationSession.validChoices[0]?.label ??
        null
      : consolePromptSession !== null
        ? consolePromptSession.prefill
      : featureAssistDescriptor !== null && featureAssistDescriptor.choices.length > 0
        ? featureAssistDescriptor.choices[stagedChoiceIndex ?? 0]?.label ??
          featureAssistDescriptor.choices[0]?.label ??
          featureAssistDescriptor.prefill
        : featureAssistDescriptor?.prefill ?? null

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
      <span className="ConsoleBarSummaryPrompt">
        <span className="ConsoleBarSummaryBreadcrumbRow">
          {activeSummary.breadcrumb.map((segment, index) => (
            <span key={`${segment}-${index}`} className="ConsoleBarSummaryBreadcrumbSegment">
              {segment}
              {index < activeSummary.breadcrumb.length - 1 ? (
                <span className="ConsoleBarSummaryBreadcrumbSeparator"> &gt; </span>
              ) : null}
            </span>
          ))}
        </span>
        <span className="ConsoleBarSummaryChoicesRow">
          <span className="ConsoleBarSummaryLead">{activeSummary.leadText}</span>
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
        </span>
      </span>
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
        (
          nextState.stagedNavigationSession !== null ||
          nextState.consolePromptSession !== null ||
          nextState.featureAssistDescriptor !== null
        ) &&
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
    const isGuidedInputActive =
      stagedNavigationSession !== null ||
      consolePromptSession !== null ||
      featureAssistDescriptor !== null

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
      isGuidedInputActive &&
      !isStagedChoiceManualOverride &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault()
      const shouldReplaceGuidedInput =
        guidedInputText !== null &&
        normalizeChoiceToken(inputText) === normalizeChoiceToken(guidedInputText)
      setInputText(shouldReplaceGuidedInput ? event.key : `${inputText}${event.key}`)
      return
    }
    if (isGuidedInputActive && event.key === 'ArrowUp') {
      event.preventDefault()
      ;(onCycleGuidedChoice ?? cycleStagedChoice)('previous')
      return
    }
    if (isGuidedInputActive && event.key === 'ArrowDown') {
      event.preventDefault()
      ;(onCycleGuidedChoice ?? cycleStagedChoice)('next')
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
      if (
        isGuidedInputActive &&
        !isStagedChoiceManualOverride
      ) {
        onCancelCommand?.()
        resetHistoryNavigation()
        queueMicrotask(() => {
          const input = inputRef?.current
          if (input === null || input === undefined) {
            return
          }
          input.focus()
          const nextInputText = useConsoleStore.getState().inputText
          const caretOffset = nextInputText.length
          input.setSelectionRange(caretOffset, caretOffset)
        })
        return
      }
      if (inputText.length > 0) {
        setInputText('')
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
