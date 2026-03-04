import { useEffect, useRef } from 'react'

type SpaghettiContextMenuItem = {
  id: string
  label: string
  onSelect: () => void
  disabled?: boolean
}

type SpaghettiContextMenuProps = {
  open: boolean
  x: number
  y: number
  items: SpaghettiContextMenuItem[]
  onClose: () => void
  containerClassName?: string
}

export function SpaghettiContextMenu({
  open,
  x,
  y,
  items,
  onClose,
  containerClassName,
}: SpaghettiContextMenuProps) {
  const menuRef = useRef<HTMLDivElement | null>(null)

  useEffect(() => {
    if (!open) {
      return
    }
    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target
      if (!(target instanceof Node)) {
        return
      }
      if (menuRef.current?.contains(target)) {
        return
      }
      onClose()
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key !== 'Escape') {
        return
      }
      event.preventDefault()
      onClose()
    }
    window.addEventListener('pointerdown', handlePointerDown, true)
    window.addEventListener('keydown', handleKeyDown)
    return () => {
      window.removeEventListener('pointerdown', handlePointerDown, true)
      window.removeEventListener('keydown', handleKeyDown)
    }
  }, [onClose, open])

  if (!open || items.length === 0) {
    return null
  }

  return (
    <div
      ref={menuRef}
      className={`SpaghettiContextMenu${containerClassName === undefined ? '' : ` ${containerClassName}`}`}
      data-sp-interactive="1"
      style={{
        left: `${x}px`,
        top: `${y}px`,
      }}
      onPointerDown={(event) => {
        event.stopPropagation()
      }}
      onContextMenu={(event) => {
        event.preventDefault()
        event.stopPropagation()
      }}
    >
      {items.map((item) => (
        <button
          key={item.id}
          type="button"
          className="SpaghettiContextMenuItem"
          disabled={item.disabled === true}
          onClick={(event) => {
            event.stopPropagation()
            if (item.disabled === true) {
              return
            }
            item.onSelect()
          }}
        >
          {item.label}
        </button>
      ))}
    </div>
  )
}
