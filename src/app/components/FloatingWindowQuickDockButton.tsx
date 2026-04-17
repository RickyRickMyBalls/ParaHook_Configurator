type FloatingWindowQuickDockButtonProps = {
  className?: string
  onClick: () => void
}

export function FloatingWindowQuickDockButton(props: FloatingWindowQuickDockButtonProps) {
  const { className, onClick } = props
  const resolvedClassName = ['FloatingWindowHeaderAction', className].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      aria-label="Quick Dock"
      title="Quick Dock"
      className={resolvedClassName}
      data-floating-window-header-action="quick-dock"
      onClick={onClick}
    >
      <svg
        aria-hidden="true"
        focusable="false"
        viewBox="0 0 16 16"
        className="FloatingWindowHeaderActionIcon"
      >
        <path
          d="M2.75 2.75h10.5v3.5H2.75zM8 6.5v4.25m0 0L6.25 9.25M8 10.75l1.75-1.5M3 13.25h10"
          fill="none"
          stroke="currentColor"
          strokeLinecap="round"
          strokeLinejoin="round"
          strokeWidth="1.4"
        />
      </svg>
    </button>
  )
}
