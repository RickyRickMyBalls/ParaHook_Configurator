import {
  type ClipboardEvent as ReactClipboardEvent,
  useEffect,
  useRef,
  Fragment,
  type FormEvent,
  type KeyboardEvent as ReactKeyboardEvent,
  type PointerEvent as ReactPointerEvent,
  type RefObject,
} from 'react'
import { CONSOLE_MAX_EXPANDED_HEIGHT, useConsoleStore } from './useConsoleStore'
import type { ConsoleStagedNavigationSession } from './stagedNavigation'
import { useAppStore } from '../store/useAppStore'

type ConsoleBarProps = {
  surfaceMode?: 'docked' | 'floating' | 'popout'
  showExpandToggle?: boolean
  inputRef?: RefObject<HTMLInputElement | null>
  onSubmitCommand?: (commandText: string) => void
  onCancelCommand?: () => void
  onCycleGuidedChoice?: (direction: 'previous' | 'next') => void
  treatSpaceAsSubmit?: boolean
  onInputFocus?: () => void
}

export function ConsoleBar({
  surfaceMode = 'docked',
  showExpandToggle = true,
  inputRef,
  onSubmitCommand,
  onCancelCommand,
  onCycleGuidedChoice,
  treatSpaceAsSubmit = false,
  onInputFocus,
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

  type SummaryChoice = {
    label: string
    aliasHint: string | null
  }

  const normalizeCompactChoiceToken = (value: string): string =>
    value.replace(/[^A-Za-z0-9]/g, '').toUpperCase()

  const selectPreferredAliasHint = (label: string, aliases: string[]): string | null => {
    const aliasCandidates = [...new Set(aliases.map(normalizeCompactChoiceToken).filter(Boolean))].sort(
      (left, right) => left.length - right.length || left.localeCompare(right),
    )

    if (aliasCandidates.length > 0) {
      return aliasCandidates[0] ?? null
    }

    const compactLabel = normalizeCompactChoiceToken(label)
    if (compactLabel.length > 0 && compactLabel.length <= 3 && compactLabel === label.toUpperCase()) {
      return compactLabel
    }

    return null
  }

  const selectPromptSummaryAliasHint = (
    breadcrumb: string[],
    label: string,
  ): string | null => {
    if (breadcrumb.length === 1 && breadcrumb[0] === 'Root') {
      switch (normalizeCompactChoiceToken(label)) {
        case 'GRAPH':
          return 'G'
        case 'REFERENCES':
          return 'REF'
        case 'CAMERA':
          return 'C'
        case 'RADIO':
          return 'R'
        case 'ZOOM':
          return 'Z'
        case 'PAN':
          return 'P'
        case 'ORBIT':
          return 'O'
        default:
          return null
      }
    }

    return null
  }

  const renderChoiceLabelWithAliasHint = (choice: SummaryChoice) => {
    const aliasHint = choice.aliasHint
    if (aliasHint === null || aliasHint.length === 0) {
      return choice.label
    }

    let aliasIndex = 0

    return Array.from(choice.label).map((character, index) => {
      const normalizedCharacter = /[A-Za-z0-9]/.test(character) ? character.toUpperCase() : null
      const highlightCharacter =
        normalizedCharacter !== null &&
        aliasIndex < aliasHint.length &&
        normalizedCharacter === aliasHint[aliasIndex]

      if (highlightCharacter) {
        aliasIndex += 1
      }

      return (
      <Fragment key={`${choice}-${character}-${index}`}>
        {highlightCharacter ? (
          <span className="ConsoleBarSummaryChoiceAlias">{character}</span>
        ) : (
          character
        )}
      </Fragment>
      )
    })
  }

  const formatGraphBreadcrumbLabel = (graphLabel: string): string => {
    const matchedGraphIndex = graphLabel.match(/^graph_\[(\d+)\]$/i)
    if (matchedGraphIndex === null) {
      return graphLabel
    }
    return `Graph ${matchedGraphIndex[1]}`
  }

  const formatGraphSessionBreadcrumb = (breadcrumb: string[]): string[] => {
    if (breadcrumb.length >= 3 && breadcrumb[0] === 'Select' && breadcrumb[1] === 'Graph') {
      return ['Root', 'Graph Documents', formatGraphBreadcrumbLabel(breadcrumb[2] ?? 'Graph'), ...breadcrumb.slice(3)]
    }
    return breadcrumb
  }

  const buildStagedSummaryBreadcrumb = (session: ConsoleStagedNavigationSession): string[] => {
    switch (session.scopeId) {
      case 'root':
        return ['Root']
      case 'zoomRoot':
        return ['Zoom']
      case 'sketchDrawZoomRoot':
        return ['Graph', 'Sketch', 'Sketch Draw', 'Zoom']
      case 'graphRoot':
        return ['Root', 'Graph Documents']
      case 'graphSelected':
        return [
          'Root',
          'Graph Documents',
          formatGraphBreadcrumbLabel(session.breadcrumb.at(-1) ?? 'Graph'),
        ]
      case 'radioRoot':
        return ['Radio']
      case 'graphNodeList':
      case 'graphNodeSelected':
      case 'graphSketchList':
      case 'graphSketchSelected':
      case 'graphExtrudeList':
      case 'graphExtrudeSelected':
      case 'graphOutputPreviewList':
      case 'graphOutputPreviewSelected':
      case 'graphZoomRoot':
      case 'graphZoomCanvas':
      case 'graphZoomModelViewport':
        return formatGraphSessionBreadcrumb(session.breadcrumb)
      case 'contentAssemblySelected':
      case 'contentAssemblyZoomRoot':
      case 'contentComponentSelected':
      case 'contentObjectSelected':
      case 'contentObjectTransformRoot':
      case 'contentObjectZoomRoot':
      case 'multiSelectSelected':
      case 'multiSelectZoomRoot':
      case 'referencesSelected':
      case 'referencesZoomRoot':
      case 'referenceCategorySelected':
      case 'referenceCategoryZoomRoot':
      case 'referenceSelected':
      case 'referenceTransformRoot':
      case 'referenceTransformSettingsRoot':
      case 'referenceTransformSpaceRoot':
      case 'referenceTransformSnapRoot':
      case 'referenceTransformMoveSnapRoot':
      case 'referenceTransformRotateSnapRoot':
      case 'referenceTransformScaleSnapRoot':
      case 'referenceZoomRoot':
        return session.breadcrumb
      default:
        return ['Choose next']
    }
  }

  const parsePromptSummary = (
    text: string,
  ): {
    breadcrumb: string[]
    leadText: string
    choices: SummaryChoice[]
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

    const breadcrumb = breadcrumbText.split('>').map((segment) => segment.trim()).filter(Boolean)

    return {
      breadcrumb,
      leadText: ` > ${leadText}`,
      choices: choices.map((choice) => ({
        label: choice,
        aliasHint: selectPromptSummaryAliasHint(breadcrumb, choice),
      })),
      activeChoiceIndex: activeChoiceIndex === -1 ? null : activeChoiceIndex,
    }
  }

  const statusAssistDescriptor =
    featureAssistDescriptor?.summaryMode === 'status' ? featureAssistDescriptor : null

  const activeSummary =
    statusAssistDescriptor !== null
      ? {
          breadcrumb:
            statusAssistDescriptor.breadcrumb ?? [statusAssistDescriptor.label],
          leadText: statusAssistDescriptor.summaryLeadText ?? '',
          choices: statusAssistDescriptor.choices.map((choice) => ({
            label: choice.label,
            aliasHint: selectPreferredAliasHint(choice.label, choice.aliases),
          })),
          activeChoiceIndex:
            statusAssistDescriptor.choices.length > 0 ? stagedChoiceIndex ?? 0 : null,
        }
      : consolePromptSession !== null
        ? {
            breadcrumb: consolePromptSession.breadcrumb,
            leadText: ' > Enter value',
            choices: [
              {
                label: consolePromptSession.prefill,
                aliasHint: selectPreferredAliasHint(consolePromptSession.prefill, []),
              },
            ],
            activeChoiceIndex:
              isStagedChoiceManualOverride || inputText.trim() !== consolePromptSession.prefill.trim()
                ? null
                : 0,
          }
      : featureAssistDescriptor !== null
        ? {
            breadcrumb:
              featureAssistDescriptor.breadcrumb ?? [featureAssistDescriptor.label],
            leadText:
              featureAssistDescriptor.summaryLeadText ??
              (featureAssistDescriptor.choices.length > 0 ? ' > Choose next' : ''),
            choices: featureAssistDescriptor.choices.map((choice) => ({
              label: choice.label,
              aliasHint: selectPreferredAliasHint(choice.label, choice.aliases),
            })),
            activeChoiceIndex:
              featureAssistDescriptor.choices.length > 0 ? stagedChoiceIndex ?? 0 : null,
          }
      : stagedNavigationSession !== null && stagedNavigationSession.validChoices.length > 0
      ? {
          breadcrumb: buildStagedSummaryBreadcrumb(stagedNavigationSession),
          leadText: ' > Choose next',
          choices: stagedNavigationSession.validChoices.map((choice) => ({
            label: choice.label,
            aliasHint: selectPreferredAliasHint(choice.label, choice.aliases),
          })),
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
  }, [
    activeSummary?.activeChoiceIndex,
    activeSummary?.choices.map((choice) => `${choice.label}:${choice.aliasHint ?? ''}`).join('|'),
  ])

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
        {activeSummary.leadText.length > 0 || activeSummary.choices.length > 0 ? (
          <span className="ConsoleBarSummaryChoicesRow">
            <span className="ConsoleBarSummaryLead">{activeSummary.leadText}</span>
            {activeSummary.choices.length > 0 ? (
              <span
                ref={summaryChoicesViewportRef}
                className="ConsoleBarSummaryChoicesViewport"
                aria-label="Console staged choices"
              >
                <span className="ConsoleBarSummaryChoices">
                  <span className="ConsoleBarSummaryBracket">[</span>
                  {activeSummary.choices.map((choice, index) => (
                    <span
                      key={`${choice.label}-${index}`}
                      className={`ConsoleBarSummaryChoice ${
                        index === activeSummary.activeChoiceIndex ? 'isActive' : ''
                      }`}
                    >
                      {renderChoiceLabelWithAliasHint(choice)}
                      {index < activeSummary.choices.length - 1 ? (
                        <span className="ConsoleBarSummarySeparator">, </span>
                      ) : null}
                    </span>
                  ))}
                  <span className="ConsoleBarSummaryBracket">]</span>
                </span>
              </span>
            ) : null}
          </span>
        ) : null}
      </span>
    ) : (
      summaryText
    )

  const focusConsoleInput = (options?: { value?: string }) => {
    const input = inputRef?.current
    if (input === null || input === undefined) {
      return
    }
    input.focus()
    const inputValue = options?.value ?? input.value
    const caretOffset = inputValue.length
    input.setSelectionRange(caretOffset, caretOffset)
  }

  const handleSubmit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmitCommand?.(useConsoleStore.getState().inputText)
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
        nextState.inputText.length > 0
      ) {
        focusConsoleInput({
          value: nextState.inputText,
        })
        return
      }

      input.blur()
    })
  }

  const handleInputKeyDown = (event: ReactKeyboardEvent<HTMLInputElement>) => {
    if (event.defaultPrevented) {
      return
    }
    const isGuidedInputActive =
      stagedNavigationSession !== null ||
      consolePromptSession !== null ||
      featureAssistDescriptor !== null
    const shouldReplaceAssistedInput =
      stagedNavigationSession !== null ||
      consolePromptSession !== null ||
      (
        featureAssistDescriptor !== null &&
        (featureAssistDescriptor.choices.length > 0 || featureAssistDescriptor.prefill !== null)
      )

    if (treatSpaceAsSubmit && event.key === ' ') {
      event.preventDefault()
      if (inputText.trim().length === 0) {
        return
      }
      onSubmitCommand?.(useConsoleStore.getState().inputText)
      resetHistoryNavigation()
      return
    }
    if (
      shouldReplaceAssistedInput &&
      !isStagedChoiceManualOverride &&
      event.key.length === 1 &&
      !event.ctrlKey &&
      !event.altKey &&
      !event.metaKey
    ) {
      event.preventDefault()
      setInputText(event.key, { startManualOverride: true })
      return
    }
    if (isGuidedInputActive && event.key === 'ArrowUp') {
      event.preventDefault()
      ;(onCycleGuidedChoice ?? cycleStagedChoice)('next')
      return
    }
    if (isGuidedInputActive && event.key === 'ArrowDown') {
      event.preventDefault()
      ;(onCycleGuidedChoice ?? cycleStagedChoice)('previous')
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
      const hasActiveReferenceTransformEntry =
        useAppStore.getState().referenceWorkspace.activeReferenceTransformSession?.entryActive === true
      const isReferenceTransformValuePrompt =
        consolePromptSession?.kind === 'reference-transform.axis' ||
        consolePromptSession?.kind === 'reference-transform.plane'
      if (hasActiveReferenceTransformEntry) {
        event.stopPropagation()
        onCancelCommand?.()
        resetHistoryNavigation()
        queueMicrotask(() => {
          focusConsoleInput({
            value: useConsoleStore.getState().inputText,
          })
        })
        return
      }
      if (isReferenceTransformValuePrompt) {
        event.stopPropagation()
        onCancelCommand?.()
        resetHistoryNavigation()
        queueMicrotask(() => {
          focusConsoleInput({
            value: useConsoleStore.getState().inputText,
          })
        })
        return
      }
      if (
        isGuidedInputActive &&
        !isStagedChoiceManualOverride
      ) {
        onCancelCommand?.()
        resetHistoryNavigation()
        queueMicrotask(() => {
          focusConsoleInput({
            value: useConsoleStore.getState().inputText,
          })
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

  const handleInputPaste = (event: ReactClipboardEvent<HTMLInputElement>) => {
    const isGuidedInputActive =
      stagedNavigationSession !== null ||
      consolePromptSession !== null ||
      featureAssistDescriptor !== null
    const shouldReplaceAssistedInput =
      stagedNavigationSession !== null ||
      consolePromptSession !== null ||
      (
        featureAssistDescriptor !== null &&
        (featureAssistDescriptor.choices.length > 0 || featureAssistDescriptor.prefill !== null)
      )
    if (!isGuidedInputActive || !shouldReplaceAssistedInput || isStagedChoiceManualOverride) {
      return
    }
    const pastedText = event.clipboardData.getData('text')
    if (pastedText.length === 0) {
      return
    }
    event.preventDefault()
    setInputText(pastedText, { startManualOverride: true })
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
          onPaste={handleInputPaste}
          onFocus={onInputFocus}
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
