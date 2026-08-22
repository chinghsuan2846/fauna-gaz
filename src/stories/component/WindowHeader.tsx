import type { PointerEventHandler } from 'react'

import type { ButtonProps } from './Button'
import { Button } from './Button'

export type WindowHeaderProps = {
  title?: string
  mobile?: boolean
  showSidebar?: boolean
  sidebarOpen?: boolean
  sidebarPreviewState?: 'none' | 'hover'
  onClose?: ButtonProps['onClick']
  onSidebarToggle?: ButtonProps['onClick']
  className?: string
  onPointerDown?: PointerEventHandler<HTMLElement>
  onPointerMove?: PointerEventHandler<HTMLElement>
  onPointerUp?: PointerEventHandler<HTMLElement>
  onPointerCancel?: PointerEventHandler<HTMLElement>
}

function WindowHeader({
  title = 'Contact',
  mobile = false,
  showSidebar = false,
  sidebarOpen = false,
  sidebarPreviewState = 'none',
  onClose,
  onSidebarToggle,
  className = '',
  onPointerDown,
  onPointerMove,
  onPointerUp,
  onPointerCancel,
}: WindowHeaderProps) {
  const headerPadding = mobile ? 'px-space-sm py-space-xs' : 'px-space-md py-space-sm'
  const headerTextSize = mobile ? 'text-small' : 'text-body'

  return (
    <header
      className={`flex items-center justify-between border-b-thin border-ink-primary bg-window-header ${headerPadding} font-ui ${className}`}
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={onPointerUp}
      onPointerCancel={onPointerCancel}
    >
      <div className="flex min-w-0 items-center gap-space-sm">
        {showSidebar && (
          <Button
            icon="menu"
            iconOnly
            iconSize="large"
            size="small"
            padding={mobile ? 'close-mobile' : 'close'}
            appearance="text"
            ariaLabel={sidebarOpen ? '關閉側欄' : '開啟側欄'}
            className={`window-header-sidebar-button${
              sidebarOpen ? ' window-header-sidebar-button--selected' : sidebarPreviewState === 'hover' ? ' window-header-sidebar-button--preview-hover' : ''
            }`}
            onClick={onSidebarToggle}
          />
        )}
        <h2 className={`${headerTextSize} font-regular leading-compact text-ink-inverse`}>{title}</h2>
      </div>
      <Button
        icon="close"
        iconOnly
        iconSize="small"
        size="small"
        padding={mobile ? 'close-mobile' : 'close'}
        tone="close"
        ariaLabel="Close window"
        onClick={onClose}
      />
    </header>
  )
}

export default WindowHeader
