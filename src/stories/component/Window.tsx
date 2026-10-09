import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent, ReactNode } from 'react'

import type { ContactInfo } from '../../lib/contentAdapter'
import type { ButtonProps, PixelIconName } from './Button'
import ContactContent from './ContactContent'
import WindowHeader from './WindowHeader'

export type WindowMode = 'desktop' | 'tablet' | 'mobile'

export type WindowPosition = {
  x: number
  y: number
}

export type WindowProps = {
  mode?: WindowMode
  title?: string
  headerIcon?: PixelIconName
  contact?: ContactInfo
  children?: ReactNode
  className?: string
  showSidebar?: boolean
  sidebarOpen?: boolean
  sidebarPreviewState?: 'none' | 'hover'
  showClose?: boolean
  onSidebarToggle?: ButtonProps['onClick']
  onClose?: ButtonProps['onClick']
  onSupport?: ButtonProps['onClick']
  initialPosition?: WindowPosition
}

type Point = {
  x: number
  y: number
}

type DragState = Point & {
  pointerId: number
  origin: Point
  bounds: {
    left: number
    top: number
    width: number
    height: number
  }
}

type ResizeState = {
  pointerId: number
  startX: number
  startY: number
  startWidth: number
  startHeight: number
}

function Window({
  title = '',
  headerIcon,
  contact,
  onClose,
  onSupport,
  mode = 'desktop',
  children,
  className = '',
  showSidebar = false,
  sidebarOpen = false,
  sidebarPreviewState = 'none',
  showClose = true,
  onSidebarToggle,
  initialPosition,
}: WindowProps) {
  const isMobile = mode === 'mobile'
  const hasCustomContent = children !== undefined
  const windowRef = useRef<HTMLElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const resizeRef = useRef<ResizeState | null>(null)
  const [position, setPosition] = useState<Point>(() => initialPosition ?? { x: 0, y: 0 })
  const [dimensions, setDimensions] = useState<Point | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const [isResizing, setIsResizing] = useState(false)

  useEffect(() => {
    if (!initialPosition) return
    setPosition(initialPosition)
  }, [initialPosition?.x, initialPosition?.y])

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (isMobile || event.button !== 0) return
    if (event.target instanceof Element && event.target.closest('button')) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    const bounds = windowRef.current?.getBoundingClientRect()
    if (!bounds) return

    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      origin: position,
      bounds,
    }
    setIsDragging(true)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight
    const nextLeft = Math.min(
      Math.max(drag.bounds.left + event.clientX - drag.x, 0),
      Math.max(0, viewportWidth - drag.bounds.width),
    )
    const nextTop = Math.min(
      Math.max(drag.bounds.top + event.clientY - drag.y, 0),
      Math.max(0, viewportHeight - drag.bounds.height),
    )

    setPosition({
      x: drag.origin.x + nextLeft - drag.bounds.left,
      y: drag.origin.y + nextTop - drag.bounds.top,
    })
  }

  const endDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    setIsDragging(false)
  }

  const startResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (isMobile || event.button !== 0 || !windowRef.current) return

    const bounds = windowRef.current.getBoundingClientRect()
    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    resizeRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      startWidth: bounds.width,
      startHeight: bounds.height,
    }
    setIsResizing(true)
  }

  const moveResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current
    if (!resize || resize.pointerId !== event.pointerId) return

    const width = resize.startWidth + event.clientX - resize.startX
    const height = resize.startHeight + event.clientY - resize.startY

    if (width > 0 && height > 0) {
      setDimensions({ x: width, y: height })
    }
  }

  const endResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    resizeRef.current = null
    setIsResizing(false)
  }

  const windowStyle = {
    ...(isMobile ? {} : { transform: `translate(${position.x}px, ${position.y}px)` }),
    ...(isMobile || !dimensions ? {} : { width: dimensions.x, height: dimensions.y }),
  }
  const interactionCursor = isMobile ? '' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
  return (
    <article
      ref={windowRef}
      style={windowStyle}
      className={`relative flex w-full flex-col overflow-hidden border-thin border-ink-primary bg-window-surface shadow-window ${className}`}
    >
      <WindowHeader
        title={contact?.title ?? title}
        icon={headerIcon}
        mobile={isMobile}
        showSidebar={showSidebar}
        sidebarOpen={sidebarOpen}
        sidebarPreviewState={sidebarPreviewState}
        showClose={showClose}
        onClose={onClose}
        onSidebarToggle={onSidebarToggle}
        className={`${interactionCursor} touch-none select-none`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      {hasCustomContent ? (
        <div className="flex min-h-0 min-w-0 flex-1 flex-col font-body text-ink-primary">{children}</div>
      ) : contact ? (
        <ContactContent contact={contact} isMobile={isMobile} onSupport={onSupport} />
      ) : (
        <div className="flex min-h-0 min-w-0 flex-1" aria-hidden="true" />
      )}
      {!isMobile && (
        <button
          type="button"
          className="absolute bottom-0 right-0 flex h-space-lg w-space-lg cursor-se-resize items-end justify-end border-0 bg-transparent p-0 text-line-subtle"
          aria-label="Resize window"
          onPointerDown={startResize}
          onPointerMove={moveResize}
          onPointerUp={endResize}
          onPointerCancel={endResize}
        >
          <svg
            aria-hidden="true"
            className="h-space-md w-space-md"
            fill="currentColor"
            viewBox="0 0 16 16"
            shapeRendering="crispEdges"
          >
            <rect x="11" y="4" width="1" height="1" />
            <rect x="9" y="6" width="3" height="1" />
            <rect x="7" y="8" width="5" height="1" />
            <rect x="5" y="10" width="7" height="1" />
            <rect x="3" y="12" width="9" height="1" />
          </svg>
        </button>
      )}
    </article>
  )
}

export default Window
