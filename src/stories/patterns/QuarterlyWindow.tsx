import { useEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import type { ButtonProps } from '../component/Button'
import QuarterlyContent, {
  quarterlyContentMockArticle,
  type QuarterlyContentArticle,
} from '../component/QuarterlyContent'
import QuarterlySidebar, {
  quarterlySidebarMockData,
  type QuarterlySidebarArticle,
  type QuarterlySidebarYear,
} from '../component/QuarterlySidebar'
import WindowHeader from '../component/WindowHeader'

export type QuarterlyWindowProps = {
  title?: string
  data?: readonly QuarterlySidebarYear[]
  article?: QuarterlyContentArticle
  responsiveMode?: 'auto' | 'desktop' | 'mobile'
  initialSidebarOpen?: boolean
  initialSelectedArticleId?: string
  onClose?: ButtonProps['onClick']
  onArticleSelect?: (article: QuarterlySidebarArticle) => void
  onPrevious?: ButtonProps['onClick']
  onNext?: ButtonProps['onClick']
  className?: string
}

type Point = {
  x: number
  y: number
}

type DragState = Point & {
  pointerId: number
  origin: Point
}

type ResizeState = {
  pointerId: number
  startX: number
  startY: number
  startWidth: number
  startHeight: number
}

const mobileBreakpointQuery = '(max-width: 767px)'

function getIsMobileViewport() {
  return typeof window !== 'undefined' && window.matchMedia(mobileBreakpointQuery).matches
}

function QuarterlyWindow({
  title = 'Quarterly',
  data = quarterlySidebarMockData,
  article = quarterlyContentMockArticle,
  responsiveMode = 'auto',
  initialSidebarOpen = true,
  initialSelectedArticleId = article.id,
  onClose,
  onArticleSelect,
  onPrevious,
  onNext,
  className = '',
}: QuarterlyWindowProps) {
  const windowRef = useRef<HTMLElement>(null)
  const dragRef = useRef<DragState | null>(null)
  const resizeRef = useRef<ResizeState | null>(null)
  const getResolvedMobileViewport = () => responsiveMode === 'mobile' || (responsiveMode === 'auto' && getIsMobileViewport())
  const [isMobileViewport, setIsMobileViewport] = useState(getResolvedMobileViewport)
  const [isSidebarOpen, setIsSidebarOpen] = useState(() => !getResolvedMobileViewport() && initialSidebarOpen)
  const [selectedArticleId, setSelectedArticleId] = useState(initialSelectedArticleId)
  const [position, setPosition] = useState<Point>({ x: 0, y: 0 })
  const [dimensions, setDimensions] = useState<Point | null>(null)
  const [isDragging, setIsDragging] = useState(false)

  useEffect(() => {
    if (responsiveMode !== 'auto') {
      const isMobile = responsiveMode === 'mobile'
      setIsMobileViewport(isMobile)
      if (isMobile) setIsSidebarOpen(false)
      return
    }

    const mediaQuery = window.matchMedia(mobileBreakpointQuery)
    const updateViewportMode = () => {
      const isMobile = mediaQuery.matches
      setIsMobileViewport(isMobile)
      if (isMobile) setIsSidebarOpen(false)
    }

    updateViewportMode()
    mediaQuery.addEventListener?.('change', updateViewportMode)
    return () => mediaQuery.removeEventListener?.('change', updateViewportMode)
  }, [responsiveMode])

  const selectArticle = (selectedArticle: QuarterlySidebarArticle) => {
    setSelectedArticleId(selectedArticle.id)
    onArticleSelect?.(selectedArticle)
    if (isMobileViewport) setIsSidebarOpen(false)
  }

  const startDrag = (event: ReactPointerEvent<HTMLElement>) => {
    if (isMobileViewport || event.button !== 0) return
    if (event.target instanceof Element && event.target.closest('button')) return

    event.preventDefault()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      x: event.clientX,
      y: event.clientY,
      origin: position,
    }
    setIsDragging(true)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    setPosition({
      x: drag.origin.x + event.clientX - drag.x,
      y: drag.origin.y + event.clientY - drag.y,
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
    if (isMobileViewport || event.button !== 0 || !windowRef.current) return

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
  }

  const moveResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    const resize = resizeRef.current
    if (!resize || resize.pointerId !== event.pointerId) return

    const width = resize.startWidth + event.clientX - resize.startX
    const height = resize.startHeight + event.clientY - resize.startY

    if (width > 0 && height > 0) setDimensions({ x: width, y: height })
  }

  const endResize = (event: ReactPointerEvent<HTMLButtonElement>) => {
    if (resizeRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    resizeRef.current = null
  }

  const windowStyle = {
    transform: `translate(${position.x}px, ${position.y}px)`,
    ...(dimensions ? { width: dimensions.x, height: dimensions.y } : {}),
  }
  const interactionCursor = isMobileViewport ? '' : isDragging ? 'cursor-grabbing' : 'cursor-grab'
  const windowClassName = isMobileViewport
    ? `relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-0 bg-window-surface shadow-none ${className}`
    : `relative flex h-full min-h-0 min-w-0 flex-col overflow-hidden border-0 bg-window-surface shadow-none md:border-thin md:border-ink-primary md:shadow-window ${className}`
  const sidebar = (
    <QuarterlySidebar
      data={data}
      initialOpenYearIds={['2026']}
      initialOpenQuarterIds={['2026-autumn']}
      initialSelectedArticleId={selectedArticleId}
      borderless
      onArticleSelect={selectArticle}
    />
  )
  const content = (
    <QuarterlyContent
      article={article}
      borderless
      mobile={isMobileViewport}
      className="min-h-0 min-w-0 flex-1"
      onPrevious={onPrevious}
      onNext={onNext}
    />
  )

  return (
    <article
      ref={windowRef}
      style={windowStyle}
      aria-label={`${title} window`}
      className={windowClassName}
    >
      <WindowHeader
        title={title}
        showSidebar
        sidebarOpen={isSidebarOpen}
        onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
        onClose={onClose}
        className={`shrink-0 select-none ${isMobileViewport ? '' : `touch-none ${interactionCursor}`}`}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />

      <div className="relative flex min-h-0 min-w-0 flex-1 overflow-hidden">
        {isMobileViewport ? (
          <>
            {content}

            {isSidebarOpen && (
              <button
                type="button"
                className="absolute inset-0 z-20 border-0 bg-overlay-scrim p-0"
                aria-label="關閉季刊目錄"
                onClick={() => setIsSidebarOpen(false)}
              />
            )}

            <div
              aria-hidden={!isSidebarOpen}
              className={`absolute inset-y-0 left-0 z-30 w-4/5 max-w-sidebar bg-window-surface transition-[transform,box-shadow] duration-200 ease-out ${
                isSidebarOpen
                  ? 'translate-x-0 border-r-thin border-line-strong shadow-window'
                  : '-translate-x-full pointer-events-none shadow-none'
              }`}
            >
              {sidebar}
            </div>
          </>
        ) : (
          <>
            {isSidebarOpen && (
              <div className="relative z-10 min-h-0 w-sidebar shrink-0 border-r-thin border-line-strong">
                {sidebar}
              </div>
            )}
            {content}
          </>
        )}
      </div>

      {!isMobileViewport && (
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

export default QuarterlyWindow
