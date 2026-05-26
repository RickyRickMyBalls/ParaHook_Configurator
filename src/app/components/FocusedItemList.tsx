import type { HTMLAttributes, ReactNode } from 'react'

type FocusedItemDataAttributes = Record<string, string | number | boolean | undefined>

export type FocusedItemListItem = {
  id: string
  label: ReactNode
  detail?: ReactNode
  title?: string
  indexLabel?: ReactNode
  active?: boolean
  included?: boolean
  include?: {
    ariaLabel: string
    onClick?: () => void
    dataAttributes?: FocusedItemDataAttributes
  }
  onClick?: () => void
  remove?: {
    ariaLabel: string
    title?: string
    onClick: () => void
    dataAttributes?: FocusedItemDataAttributes
  }
  rowDataAttributes?: FocusedItemDataAttributes
  contentDataAttributes?: FocusedItemDataAttributes
}

type FocusedItemListProps = HTMLAttributes<HTMLDivElement> & {
  items: readonly FocusedItemListItem[]
}

const stopToolbarDrag = (event: { stopPropagation: () => void }) => {
  event.stopPropagation()
}

export function FocusedItemList(props: FocusedItemListProps) {
  const { className, items, ...rest } = props

  return (
    <div
      className={`PropertiesFocusedItemList${className ? ` ${className}` : ''}`}
      role="list"
      {...rest}
    >
      {items.map((item, itemIndex) => {
        const isActive = item.active === true
        const isIncluded = item.included !== false
        const rowClassName = `PropertiesFocusedItemRow ${isActive ? 'isActive' : ''} ${
          isIncluded ? 'isIncluded' : ''
        }`
        const content = (
          <>
            <span className="PropertiesFocusedItemIndex">{item.indexLabel ?? itemIndex + 1}</span>
            <span className="PropertiesFocusedItemCopy">
              <strong>{item.label}</strong>
              {item.detail !== undefined && item.detail !== null ? <span>{item.detail}</span> : null}
            </span>
          </>
        )

        return (
          <div
            className={rowClassName}
            role="listitem"
            key={item.id}
            {...item.rowDataAttributes}
          >
            {item.include !== undefined ? (
              item.include.onClick !== undefined ? (
                <button
                  type="button"
                  className="PropertiesFocusedItemIncludeButton"
                  aria-label={item.include.ariaLabel}
                  aria-pressed={isIncluded}
                  onClick={item.include.onClick}
                  {...item.include.dataAttributes}
                >
                  <span aria-hidden="true" />
                </button>
              ) : (
                <span
                  className="PropertiesFocusedItemIncludeButton isStatic"
                  aria-label={item.include.ariaLabel}
                  aria-pressed={isIncluded}
                  role="img"
                  {...item.include.dataAttributes}
                >
                  <span aria-hidden="true" />
                </span>
              )
            ) : null}
            {item.onClick !== undefined ? (
              <button
                type="button"
                className="PropertiesFocusedItemButton"
                title={item.title}
                aria-pressed={isActive}
                onClick={item.onClick}
                {...item.contentDataAttributes}
              >
                {content}
              </button>
            ) : (
              <div
                className="PropertiesFocusedItemButton PropertiesFocusedItemButton--static"
                title={item.title}
                {...item.contentDataAttributes}
              >
                {content}
              </div>
            )}
            {item.remove !== undefined ? (
              <button
                type="button"
                className="PropertiesFocusedItemRemoveButton"
                aria-label={item.remove.ariaLabel}
                title={item.remove.title}
                onPointerDown={stopToolbarDrag}
                onMouseDown={stopToolbarDrag}
                onClick={item.remove.onClick}
                {...item.remove.dataAttributes}
              >
                x
              </button>
            ) : null}
          </div>
        )
      })}
    </div>
  )
}
