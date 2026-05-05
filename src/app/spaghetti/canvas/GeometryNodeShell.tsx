import type { ReactNode } from 'react'

type GeometryNodeShellChipTone = 'default' | 'accent' | 'success' | 'warn'

export type GeometryNodeShellChip = {
  label: string
  tone?: GeometryNodeShellChipTone
}

type GeometryNodeShellProps = {
  className?: string
  title: string
  badge: string
  headerChips?: GeometryNodeShellChip[]
  summaryChips?: GeometryNodeShellChip[]
  contentLabel?: string
  inputRailOpen?: boolean
  onInputRailToggle?: () => void
  contentOpen?: boolean
  onContentToggle?: () => void
  outputRailOpen?: boolean
  onOutputRailToggle?: () => void
  inputRail?: ReactNode
  outputRail?: ReactNode
  children?: ReactNode
  diagnostics?: ReactNode
}

const renderChip = (
  chip: GeometryNodeShellChip,
  prefix: 'SpaghettiGeometryNodeHeaderChip' | 'SpaghettiGeometryNodeSummaryChip',
  index: number,
) => (
  <span
    key={`${prefix}-${chip.label}-${index}`}
    className={`${prefix} ${prefix}--${chip.tone ?? 'default'}`}
  >
    {chip.label}
  </span>
)

export function GeometryNodeShell({
  className,
  title,
  badge,
  headerChips = [],
  summaryChips = [],
  contentLabel = 'Details',
  inputRailOpen = true,
  onInputRailToggle,
  contentOpen = true,
  onContentToggle,
  outputRailOpen = true,
  onOutputRailToggle,
  inputRail,
  outputRail,
  children,
  diagnostics,
}: GeometryNodeShellProps) {
  const showInputRail = inputRail !== undefined && inputRail !== null
  const showContent = children !== undefined && children !== null
  const showOutputRail = outputRail !== undefined && outputRail !== null

  return (
    <div
      className={`SpaghettiNodeTemplate SpaghettiGeometryNodeShell${
        className === undefined || className.length === 0 ? '' : ` ${className}`
      }`}
    >
      <div className="SpaghettiGeometryNodeHeader">
        <div className="SpaghettiGeometryNodeHeaderMain">
          <div className="SpaghettiGeometryNodeHeaderTitle">{title}</div>
          <div className="SpaghettiGeometryNodeHeaderBadge">{badge}</div>
        </div>
        {headerChips.length > 0 ? (
          <div className="SpaghettiGeometryNodeHeaderChips">
            {headerChips.map((chip, index) =>
              renderChip(chip, 'SpaghettiGeometryNodeHeaderChip', index),
            )}
          </div>
        ) : null}
      </div>

      {summaryChips.length > 0 ? (
        <div className="SpaghettiGeometryNodeSummaryStrip">
          {summaryChips.map((chip, index) =>
            renderChip(chip, 'SpaghettiGeometryNodeSummaryChip', index),
          )}
        </div>
      ) : null}

      <div className="SpaghettiGeometryNodeMain">
        {showInputRail ? (
          <section
            className="SpaghettiGeometryNodeStackSection SpaghettiGeometryNodeStackSection--inputs"
            data-sp-geometry-block="inputs"
            data-sp-geometry-block-open={inputRailOpen ? '1' : '0'}
          >
            <button
              type="button"
              className="SpaghettiGeometryNodeRailToggle"
              onClick={onInputRailToggle}
            >
              <span className="SpaghettiGeometryNodeRailChevron" aria-hidden="true">
                {inputRailOpen ? '\u25BE' : '\u25B8'}
              </span>
              <span className="SpaghettiGeometryNodeRailLabel">Inputs</span>
            </button>
            {inputRailOpen ? (
              <div className="SpaghettiGeometryNodeRailBody">{inputRail}</div>
            ) : null}
          </section>
        ) : null}

        {showContent ? (
          <section
            className="SpaghettiGeometryNodeStackSection SpaghettiGeometryNodeStackSection--content"
            data-sp-geometry-block="content"
            data-sp-geometry-block-open={contentOpen ? '1' : '0'}
          >
            <button
              type="button"
              className="SpaghettiGeometryNodeRailToggle"
              onClick={onContentToggle}
            >
              <span className="SpaghettiGeometryNodeRailChevron" aria-hidden="true">
                {contentOpen ? '\u25BE' : '\u25B8'}
              </span>
              <span className="SpaghettiGeometryNodeRailLabel">{contentLabel}</span>
            </button>
            {contentOpen ? <div className="SpaghettiGeometryNodeContent">{children}</div> : null}
          </section>
        ) : null}

        {showOutputRail ? (
          <section
            className="SpaghettiGeometryNodeStackSection SpaghettiGeometryNodeStackSection--outputs"
            data-sp-geometry-block="outputs"
            data-sp-geometry-block-open={outputRailOpen ? '1' : '0'}
          >
            <button
              type="button"
              className="SpaghettiGeometryNodeRailToggle"
              onClick={onOutputRailToggle}
            >
              <span className="SpaghettiGeometryNodeRailChevron" aria-hidden="true">
                {outputRailOpen ? '\u25BE' : '\u25B8'}
              </span>
              <span className="SpaghettiGeometryNodeRailLabel">Outputs</span>
            </button>
            {outputRailOpen ? (
              <div className="SpaghettiGeometryNodeRailBody">{outputRail}</div>
            ) : null}
          </section>
        ) : null}
      </div>

      {diagnostics !== undefined ? (
        <div className="SpaghettiGeometryNodeDiagnosticsFooter">
          <div className="SpaghettiGeometryNodeDiagnosticsLabel">Diagnostics</div>
          {diagnostics}
        </div>
      ) : null}
    </div>
  )
}
