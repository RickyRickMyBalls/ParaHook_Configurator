type FloatingWindowSettingsButtonProps = {
  className?: string
  onClick: () => void
}

export function FloatingWindowSettingsButton(props: FloatingWindowSettingsButtonProps) {
  const { className, onClick } = props
  const resolvedClassName = ['FloatingWindowHeaderAction', className].filter(Boolean).join(' ')

  return (
    <button
      type="button"
      aria-label="Open Settings"
      title="Open Settings"
      className={resolvedClassName}
      data-floating-window-header-action="settings"
      onClick={onClick}
    >
      <span aria-hidden="true" style={{ fontSize: '12px', lineHeight: 1 }}>
        i
      </span>
    </button>
  )
}
