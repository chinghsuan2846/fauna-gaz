import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { CSSProperties, KeyboardEvent as ReactKeyboardEvent } from 'react'

import { Button } from './Button'

export type TooltipTourPlacement = 'auto' | 'top' | 'right' | 'bottom' | 'left' | 'center'

export type TooltipTourStep = {
  id: string
  targetId: string
  title: string
  description: string
  placement?: TooltipTourPlacement
}

export type TooltipTourProps = {
  steps: readonly TooltipTourStep[]
  open?: boolean
  initialStep?: number
  onClose?: () => void
  onComplete?: () => void
  className?: string
}

type Rect = {
  left: number
  top: number
  right: number
  bottom: number
  width: number
  height: number
}

type Position = {
  left: number
  top: number
}

const edgeInset = 16
const mobileEdgeInset = 24
const mobileFooterInset = 48
const targetInset = 8
const cardGap = 16
const focusableSelector = 'button:not([disabled]), a[href], input:not([disabled]), select:not([disabled]), textarea:not([disabled])'

function clamp(value: number, minimum: number, maximum: number) {
  return Math.min(Math.max(value, minimum), maximum)
}

function getTargetRect(targetId: string): Rect | null {
  if (typeof document === 'undefined') return null

  const elements = Array.from(document.querySelectorAll<HTMLElement>(`[data-tour-id="${targetId}"]`))
    .filter((element) => element.getClientRects().length > 0)

  if (elements.length === 0) return null

  const bounds = elements.map((element) => element.getBoundingClientRect())
  const left = Math.min(...bounds.map((bound) => bound.left))
  const top = Math.min(...bounds.map((bound) => bound.top))
  const right = Math.max(...bounds.map((bound) => bound.right))
  const bottom = Math.max(...bounds.map((bound) => bound.bottom))

  return { left, top, right, bottom, width: right - left, height: bottom - top }
}

function insetTargetRect(rect: Rect): Rect {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const left = clamp(rect.left - targetInset, edgeInset / 2, viewportWidth - edgeInset / 2)
  const top = clamp(rect.top - targetInset, edgeInset / 2, viewportHeight - edgeInset / 2)
  const right = clamp(rect.right + targetInset, edgeInset / 2, viewportWidth - edgeInset / 2)
  const bottom = clamp(rect.bottom + targetInset, edgeInset / 2, viewportHeight - edgeInset / 2)

  return { left, top, right, bottom, width: right - left, height: bottom - top }
}

function getCardPosition(target: Rect | null, cardWidth: number, cardHeight: number, placement: TooltipTourPlacement): Position {
  const viewportWidth = window.innerWidth
  const viewportHeight = window.innerHeight
  const maxLeft = Math.max(edgeInset, viewportWidth - cardWidth - edgeInset)
  const maxTop = Math.max(edgeInset, viewportHeight - cardHeight - edgeInset)

  if (viewportWidth < 600) {
    return {
      left: mobileEdgeInset,
      top: Math.max(edgeInset / 2, viewportHeight - cardHeight - mobileFooterInset),
    }
  }

  if (!target || placement === 'center') {
    return {
      left: Math.max(edgeInset, (viewportWidth - cardWidth) / 2),
      top: Math.max(edgeInset, (viewportHeight - cardHeight) / 2),
    }
  }

  const candidates: Position[] = []
  const centeredLeft = target.left + (target.width - cardWidth) / 2
  const centeredTop = target.top + (target.height - cardHeight) / 2

  if (placement === 'auto' || placement === 'top') candidates.push({ left: centeredLeft, top: target.top - cardHeight - cardGap })
  if (placement === 'auto' || placement === 'bottom') candidates.push({ left: centeredLeft, top: target.bottom + cardGap })
  if (placement === 'auto' || placement === 'right') candidates.push({ left: target.right + cardGap, top: centeredTop })
  if (placement === 'auto' || placement === 'left') candidates.push({ left: target.left - cardWidth - cardGap, top: centeredTop })

  const fits = candidates.find((candidate) => (
    candidate.left >= edgeInset &&
    candidate.top >= edgeInset &&
    candidate.left + cardWidth <= viewportWidth - edgeInset &&
    candidate.top + cardHeight <= viewportHeight - edgeInset
  ))
  const next = fits ?? candidates[0] ?? { left: centeredLeft, top: centeredTop }

  return { left: clamp(next.left, edgeInset, maxLeft), top: clamp(next.top, edgeInset, maxTop) }
}

function TooltipTour({
  steps,
  open = true,
  initialStep = 0,
  onClose,
  onComplete,
  className = '',
}: TooltipTourProps) {
  const [stepIndex, setStepIndex] = useState(initialStep)
  const [targetBounds, setTargetBounds] = useState<Rect | null>(null)
  const [cardPosition, setCardPosition] = useState<Position | null>(null)
  const cardRef = useRef<HTMLElement>(null)
  const previousFocusRef = useRef<HTMLElement | null>(null)

  const step = steps[stepIndex] ?? steps[0]

  useEffect(() => {
    if (!open) return
    setStepIndex(Math.min(Math.max(initialStep, 0), Math.max(steps.length - 1, 0)))
    previousFocusRef.current = document.activeElement instanceof HTMLElement ? document.activeElement : null
    window.requestAnimationFrame(() => cardRef.current?.focus())

    return () => {
      previousFocusRef.current?.focus?.()
    }
  }, [initialStep, open, steps.length])

  useLayoutEffect(() => {
    if (!open || !step) return

    let frame = 0
    const updateLayout = () => {
      const nextTargetBounds = getTargetRect(step.targetId)
      const nextInsetTargetBounds = nextTargetBounds ? insetTargetRect(nextTargetBounds) : null
      setTargetBounds(nextInsetTargetBounds)

      const cardBounds = cardRef.current?.getBoundingClientRect()
      const nextPosition = getCardPosition(
        nextInsetTargetBounds,
        cardBounds?.width ?? Math.min(416, window.innerWidth - edgeInset * 2),
        cardBounds?.height ?? 240,
        step.placement ?? 'auto',
      )
      setCardPosition(nextPosition)
    }
    const scheduleLayout = () => {
      window.cancelAnimationFrame(frame)
      frame = window.requestAnimationFrame(updateLayout)
    }

    updateLayout()
    window.addEventListener('resize', scheduleLayout)
    window.addEventListener('scroll', scheduleLayout, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', scheduleLayout)
      window.removeEventListener('scroll', scheduleLayout, true)
    }
  }, [open, step])

  if (!open || !step) return null

  const isLastStep = stepIndex === steps.length - 1
  const titleId = `tooltip-tour-title-${step.id}`
  const descriptionId = `tooltip-tour-description-${step.id}`
  const spotlightStyle: CSSProperties | undefined = targetBounds
    ? {
        left: targetBounds.left,
        top: targetBounds.top,
        width: targetBounds.width,
        height: targetBounds.height,
      }
    : undefined
  const positionStyle: CSSProperties = cardPosition
    ? { left: cardPosition.left, top: cardPosition.top }
    : { left: '50%', top: '50%', transform: 'translate(-50%, -50%)' }

  const closeTour = () => onClose?.()
  const nextStep = () => {
    if (isLastStep) {
      onComplete?.()
      return
    }
    setStepIndex((current) => Math.min(current + 1, steps.length - 1))
  }
  const previousStep = () => setStepIndex((current) => Math.max(current - 1, 0))

  const handleKeyDown = (event: ReactKeyboardEvent<HTMLElement>) => {
    if (event.key === 'Escape') {
      event.preventDefault()
      closeTour()
      return
    }

    if (event.key !== 'Tab') return

    const focusable = Array.from(cardRef.current?.querySelectorAll<HTMLElement>(focusableSelector) ?? [])
    if (focusable.length === 0) {
      event.preventDefault()
      cardRef.current?.focus()
      return
    }

    const first = focusable[0]
    const last = focusable[focusable.length - 1]
    if (event.shiftKey && document.activeElement === first) {
      event.preventDefault()
      last.focus()
    } else if (!event.shiftKey && document.activeElement === last) {
      event.preventDefault()
      first.focus()
    }
  }

  return (
    <div className={`tooltip-tour ${className}`} onKeyDown={handleKeyDown}>
      <div className={`tooltip-tour__backdrop${targetBounds ? ' tooltip-tour__backdrop--hidden' : ''}`} aria-hidden="true" />
      {targetBounds && <div className="tooltip-tour__spotlight" style={spotlightStyle} aria-hidden="true" />}

      <section
        ref={cardRef}
        className={`tooltip-tour__card${cardPosition ? '' : ' tooltip-tour__card--measuring'}`}
        style={positionStyle}
        role="dialog"
        aria-modal="true"
        aria-labelledby={titleId}
        aria-describedby={descriptionId}
        tabIndex={-1}
      >
        <header className="tooltip-tour__header">
          <p className="text-body font-medium leading-compact text-ink-inverse">動物公報導覽</p>
          <Button
            icon="close"
            iconOnly
            iconSize="small"
            size="small"
            padding="close-mobile"
            tone="close"
            ariaLabel="結束導覽"
            onClick={closeTour}
          />
        </header>

        <div className="tooltip-tour__body">
          <h2 id={titleId} className="text-body font-medium leading-body text-ink-primary">{step.title}</h2>
          <p id={descriptionId} className="mt-space-sm text-small leading-body text-ink-primary">{step.description}</p>
        </div>

        <div className="tooltip-tour__footer window-footer">
          {stepIndex > 0 ? (
            <Button
              label="上一步"
              appearance="outline"
              size="small"
              textSize="small"
              padding="footer-hug"
              className="window-footer-action"
              onClick={previousStep}
            />
          ) : <span aria-hidden="true" />}
          <span className="tooltip-tour__progress" aria-live="polite">{stepIndex + 1}/{steps.length}</span>
          <Button
            label={isLastStep ? '開始探索' : '下一步'}
            appearance="outline"
            size="small"
            textSize="small"
            padding="footer-hug"
            className="window-footer-action"
            onClick={nextStep}
          />
        </div>
      </section>
    </div>
  )
}

export default TooltipTour
