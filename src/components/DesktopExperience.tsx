import { useEffect, useLayoutEffect, useRef, useState } from 'react'
import type { PointerEvent as ReactPointerEvent } from 'react'
import {
  findReferenceArticle,
  toCharacterDialogue,
  toQuarterlyContentArticle,
  toQuarterlyPdfContentArticle,
  toQuarterlySidebarData,
  type ContactInfo,
  type SanityArticle,
  type SanityCharacter,
  type SanityQuarterlyPdf,
} from '../lib/contentAdapter'
import ChatWindows from '../stories/patterns/ChatWindows'
import QuarterlyWindow from '../stories/patterns/QuarterlyWindow'
import Footer from '../stories/component/Footer'
import DesktopIcon, { desktopIconNames, type DesktopIconName } from '../stories/component/DesktopIcon'
import LegalWindow from '../stories/component/LegalWindow'
import MouseHoleWindow from '../stories/component/MouseHoleWindow'
import { PixelIcon } from '../stories/component/Button'
import Window, { type WindowMode, type WindowPosition } from '../stories/component/Window'
import type { WindowStateKind } from '../stories/component/WindowState'
import TooltipTour, { type TooltipTourStep } from '../stories/component/TooltipTour'
import PixelForest from './PixelForest'
import PixelGridTransition from './PixelGridTransition'

type DesktopExperienceProps = {
  articles?: SanityArticle[]
  quarterlyPdfs?: SanityQuarterlyPdf[]
  characters?: SanityCharacter[]
  contact?: ContactInfo | null
  contentState?: WindowStateKind
}

type ExperienceState = 'entry' | 'covering' | 'revealing' | 'desktop'
type DesktopWindow =
  | { id: 'contact'; type: 'contact' }
  | { id: 'legal'; type: 'legal' }
  | { id: 'faq'; type: 'faq' }
  | { id: 'quarterly'; type: 'quarterly' }
  | { id: 'mouse-hole'; type: 'mouse-hole' }
  | { id: string; type: 'chat'; characterId: string }

const LOADING_PREVIEW_DURATION = 120
const TOUR_VISITED_STORAGE_KEY = 'fauna-gaz:tour-visited'
const CONTACT_WINDOW: DesktopWindow = { id: 'contact', type: 'contact' }
const LEGAL_WINDOW: DesktopWindow = { id: 'legal', type: 'legal' }
const FAQ_WINDOW: DesktopWindow = { id: 'faq', type: 'faq' }
const QUARTERLY_WINDOW: DesktopWindow = { id: 'quarterly', type: 'quarterly' }
const MOUSE_HOLE_WINDOW: DesktopWindow = { id: 'mouse-hole', type: 'mouse-hole' }
const GRASS_CHARACTER_ORDER: DesktopIconName[] = ['老莫', '四月', '一五']
const TOUR_STEPS: readonly TooltipTourStep[] = [
  {
    id: 'desk',
    targetId: 'tour-welcome',
    title: '歡迎來到動物公報',
    description: '這裡是動物公報的桌面。你可以從季刊、角色圖示與頁尾工具開始探索。',
    placement: 'center',
  },
  {
    id: 'quarterly',
    targetId: 'tour-quarterly',
    title: '從季刊開始閱讀',
    description: '點擊季刊圖示，依年份、季度與目錄閱讀動物行為學文章。',
    placement: 'auto',
  },
  {
    id: 'characters',
    targetId: 'tour-characters',
    title: '認識公報裡的角色',
    description: '點擊桌面上的角色圖示，開啟對話視窗，和編輯們聊聊。',
    placement: 'auto',
  },
]

function readTourVisitedState() {
  if (typeof window === 'undefined') return false

  try {
    return window.localStorage.getItem(TOUR_VISITED_STORAGE_KEY) === 'true'
  } catch {
    return false
  }
}

function rememberTourVisited() {
  try {
    window.localStorage.setItem(TOUR_VISITED_STORAGE_KEY, 'true')
  } catch {
    // Storage can be unavailable in private browsing or restricted embeds.
  }
}

function resolveViewportMode(): WindowMode {
  if (typeof window === 'undefined') return 'desktop'
  if (window.innerWidth < 600) return 'mobile'
  if (window.innerWidth < 1024) return 'tablet'
  return 'desktop'
}

function useViewportMode() {
  const [viewportMode, setViewportMode] = useState<WindowMode>('desktop')

  useEffect(() => {
    const updateViewportMode = () => setViewportMode(resolveViewportMode())
    updateViewportMode()
    window.addEventListener('resize', updateViewportMode)
    return () => window.removeEventListener('resize', updateViewportMode)
  }, [])

  return viewportMode
}

function iconNameForCharacter(character: SanityCharacter): DesktopIconName {
  if (desktopIconNames.includes(character.name as DesktopIconName)) return character.name as DesktopIconName
  if (character.characterType === 'bird') return '阿雀'
  if (character.characterType === 'cat') return '四月'
  return '老莫'
}

function grassCharacterOrder(character: SanityCharacter) {
  const order = GRASS_CHARACTER_ORDER.indexOf(iconNameForCharacter(character))
  return order === -1 ? GRASS_CHARACTER_ORDER.length : order
}

type HeaderRect = {
  left: number
  top: number
  width: number
  height: number
}

type OverlayDragState = {
  pointerId: number
  startX: number
  startY: number
  origin: WindowPosition
  bounds: HeaderRect
}

function findWindowElement(windowId: string) {
  const shell = Array.from(document.querySelectorAll<HTMLElement>('[data-window-shell-id]'))
    .find((element) => element.dataset.windowShellId === windowId)
  return shell?.querySelector<HTMLElement>('article') ?? null
}

type WindowInteractionOverlayProps = {
  windowId: string
  currentPosition?: WindowPosition
  dragInset: number
  zIndex: number
  onFocus: () => void
  onClose: () => void
  onPositionChange: (position: WindowPosition) => void
}

/**
 * A non-visual interaction layer shared by the window stack.
 * It keeps the source window chrome intact while routing interactions to a
 * window even when another window is painted above its title bar.
 */
function WindowInteractionOverlay({
  windowId,
  currentPosition,
  dragInset,
  zIndex,
  onFocus,
  onClose,
  onPositionChange,
}: WindowInteractionOverlayProps) {
  const [headerRect, setHeaderRect] = useState<HeaderRect | null>(null)
  const [isDragging, setIsDragging] = useState(false)
  const dragRef = useRef<OverlayDragState | null>(null)

  useLayoutEffect(() => {
    let active = true
    const updateRect = () => {
      const windowElement = findWindowElement(windowId)
      const header = windowElement?.querySelector<HTMLElement>('header')
      if (!active || !header) {
        if (active) setHeaderRect(null)
        return
      }

      const nextRect = header.getBoundingClientRect()
      setHeaderRect((current) => {
        if (
          current
          && current.left === nextRect.left
          && current.top === nextRect.top
          && current.width === nextRect.width
          && current.height === nextRect.height
        ) {
          return current
        }
        return {
          left: nextRect.left,
          top: nextRect.top,
          width: nextRect.width,
          height: nextRect.height,
        }
      })
    }

    updateRect()
    const windowElement = findWindowElement(windowId)
    const resizeObserver = typeof ResizeObserver === 'undefined'
      ? null
      : new ResizeObserver(updateRect)
    const mutationObserver = typeof MutationObserver === 'undefined'
      ? null
      : new MutationObserver(updateRect)

    if (windowElement) {
      resizeObserver?.observe(windowElement)
      mutationObserver?.observe(windowElement, { attributes: true, attributeFilter: ['class', 'style'] })
    }
    window.addEventListener('resize', updateRect)
    window.addEventListener('scroll', updateRect, true)

    return () => {
      active = false
      resizeObserver?.disconnect()
      mutationObserver?.disconnect()
      window.removeEventListener('resize', updateRect)
      window.removeEventListener('scroll', updateRect, true)
    }
  }, [windowId])

  const startDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (event.button !== 0) return

    const windowElement = findWindowElement(windowId)
    const bounds = windowElement?.getBoundingClientRect()
    if (!bounds) return

    event.preventDefault()
    event.stopPropagation()
    onFocus()
    event.currentTarget.setPointerCapture(event.pointerId)
    dragRef.current = {
      pointerId: event.pointerId,
      startX: event.clientX,
      startY: event.clientY,
      origin: currentPosition ?? { x: 0, y: 0 },
      bounds: {
        left: bounds.left,
        top: bounds.top,
        width: bounds.width,
        height: bounds.height,
      },
    }
    setIsDragging(true)
  }

  const moveDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    const drag = dragRef.current
    if (!drag || drag.pointerId !== event.pointerId) return

    const viewportWidth = document.documentElement.clientWidth || window.innerWidth
    const viewportHeight = document.documentElement.clientHeight || window.innerHeight
    const nextLeft = Math.min(
      Math.max(drag.bounds.left + event.clientX - drag.startX, 0),
      Math.max(0, viewportWidth - drag.bounds.width),
    )
    const nextTop = Math.min(
      Math.max(drag.bounds.top + event.clientY - drag.startY, 0),
      Math.max(0, viewportHeight - drag.bounds.height),
    )

    onPositionChange({
      x: drag.origin.x + nextLeft - drag.bounds.left,
      y: drag.origin.y + nextTop - drag.bounds.top,
    })
  }

  const endDrag = (event: ReactPointerEvent<HTMLDivElement>) => {
    if (dragRef.current?.pointerId !== event.pointerId) return
    if (event.currentTarget.hasPointerCapture(event.pointerId)) {
      event.currentTarget.releasePointerCapture(event.pointerId)
    }
    dragRef.current = null
    setIsDragging(false)
  }

  const setSourceCloseHover = (isHovered: boolean) => {
    const sourceClose = findWindowElement(windowId)?.querySelector<HTMLElement>('[aria-label="Close window"]')
    sourceClose?.classList.toggle('window-close-hover-proxy', isHovered)
  }

  if (!headerRect) return null

  return (
    <div
      className={`desktop-window-interaction-overlay${isDragging ? ' desktop-window-interaction-overlay--dragging' : ''}`}
      data-window-interaction-id={windowId}
      style={{
        left: headerRect.left,
        top: headerRect.top,
        width: headerRect.width,
        height: headerRect.height,
        zIndex: 1000 + zIndex,
      }}
      aria-hidden="true"
    >
      <div
        className="desktop-window-interaction-drag-handle"
        style={{ left: dragInset, right: 48 }}
        onPointerDown={startDrag}
        onPointerMove={moveDrag}
        onPointerUp={endDrag}
        onPointerCancel={endDrag}
      />
      <button
        className="desktop-window-interaction-close"
        type="button"
        tabIndex={-1}
        aria-label="Close window"
        onPointerDown={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setSourceCloseHover(false)
          onFocus()
        }}
        onPointerOver={() => setSourceCloseHover(true)}
        onPointerOut={() => setSourceCloseHover(false)}
        onClick={(event) => {
          event.preventDefault()
          event.stopPropagation()
          setSourceCloseHover(false)
          onClose()
        }}
      />
    </div>
  )
}

function DesktopExperience({ articles = [], quarterlyPdfs = [], characters = [], contact, contentState }: DesktopExperienceProps) {
  const [experienceState, setExperienceState] = useState<ExperienceState>('entry')
  const defaultOpenWindows = contentState ? [QUARTERLY_WINDOW] : [CONTACT_WINDOW]
  const [openWindows, setOpenWindows] = useState<DesktopWindow[]>(defaultOpenWindows)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?._id ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const [isTourOpen, setIsTourOpen] = useState(false)
  const [hasVisitedTour, setHasVisitedTour] = useState(readTourVisitedState)
  const [windowZIndices, setWindowZIndices] = useState<Record<string, number>>(() => Object.fromEntries(
    defaultOpenWindows.map((window, index) => [window.id, 100 + index]),
  ))
  const viewportMode = useViewportMode()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadingTimerRef = useRef<number | null>(null)
  const windowPositionsRef = useRef(new Map<string, { x: number; y: number }>([
    ['contact', { x: 0, y: 0 }],
    ['quarterly', { x: 0, y: 0 }],
    ['legal', { x: 0, y: 48 }],
    ['faq', { x: 0, y: 96 }],
  ]))
  const nextWindowPositionRef = useRef(0)
  const nextWindowZIndexRef = useRef(100 + defaultOpenWindows.length)
  const [, setWindowPositionRevision] = useState(0)
  const quarterlySidebarData = toQuarterlySidebarData(articles, quarterlyPdfs)
  const birdCharacters = characters.filter((character) => character.characterType === 'bird')
  const grassCharacters = characters
    .filter((character) => character.characterType === 'cat' || character.characterType === 'mouse')
    .sort((left, right) => grassCharacterOrder(left) - grassCharacterOrder(right))
  const selectedArticleIndex = articles.findIndex((article) => article._id === selectedArticleId)
  const selectedArticle = selectedArticleIndex >= 0 ? articles[selectedArticleIndex] : undefined
  const referenceArticle = selectedArticle ? findReferenceArticle(articles, selectedArticle) : undefined
  const selectedPdf = quarterlyPdfs.find((pdf) => pdf._id === selectedArticleId)
  const quarterlyContentArticle = selectedArticle
    ? toQuarterlyContentArticle(selectedArticle, articles[selectedArticleIndex - 1], articles[selectedArticleIndex + 1], referenceArticle)
    : selectedPdf
      ? toQuarterlyPdfContentArticle(selectedPdf, articles.at(-1))
      : undefined
  const isDesktopVisible = experienceState === 'revealing' || experienceState === 'desktop'
  const transitionStage = experienceState === 'covering' || experienceState === 'revealing' ? experienceState : null
  const isMobileViewport = viewportMode === 'mobile'
  const backgroundFit = 'cover'

  const tryStartAudio = () => {
    if (!musicEnabled) return
    audioRef.current?.play().catch(() => {})
  }

  const toggleMusic = () => {
    setMusicEnabled((enabled) => !enabled)
  }

  useEffect(() => {
    const audio = audioRef.current
    if (!audio) return

    audio.muted = !musicEnabled
    if (musicEnabled) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }, [musicEnabled])

  useEffect(() => {
    tryStartAudio()
  }, [])

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) window.clearTimeout(loadingTimerRef.current)
    }
  }, [])

  useEffect(() => {
    if (viewportMode !== 'mobile') return
    setOpenWindows((current) => current.filter((window) => window.id !== CONTACT_WINDOW.id))
  }, [viewportMode])

  const startExperience = () => {
    if (isLoading) return

    setIsLoading(true)
    tryStartAudio()
    loadingTimerRef.current = window.setTimeout(() => {
      loadingTimerRef.current = null
      setIsLoading(false)
      setExperienceState('covering')
    }, LOADING_PREVIEW_DURATION)
  }

  const returnToEntry = () => {
    setExperienceState('entry')
    setOpenWindows(viewportMode === 'mobile' ? [] : defaultOpenWindows)
  }

  const focusWindow = (windowId: string) => {
    setWindowZIndices((current) => ({
      ...current,
      [windowId]: nextWindowZIndexRef.current++,
    }))
  }

  const openWindow = (window: DesktopWindow) => {
    if (!windowPositionsRef.current.has(window.id)) {
      const positionIndex = nextWindowPositionRef.current++
      windowPositionsRef.current.set(window.id, {
        x: window.type === 'chat' ? -(positionIndex + 1) * 48 : 0,
        y: 24 + (positionIndex % 4) * 48,
      })
    }

    setOpenWindows((current) => {
      if (current.some((item) => item.id === window.id)) return current
      if (viewportMode === 'mobile') return [window]
      return [...current, window]
    })

    focusWindow(window.id)
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows((current) => current.filter((window) => window.id !== windowId))
    setWindowZIndices((current) => {
      const next = { ...current }
      delete next[windowId]
      return next
    })
  }

  const updateWindowPosition = (windowId: string, position: WindowPosition) => {
    windowPositionsRef.current.set(windowId, position)
    setWindowPositionRevision((revision) => revision + 1)
  }

  const openQuarterly = () => openWindow(QUARTERLY_WINDOW)
  const openContact = () => openWindow(CONTACT_WINDOW)
  const openLegal = () => openWindow(LEGAL_WINDOW)
  const openFaq = () => openWindow(FAQ_WINDOW)
  const openMouseHole = () => openWindow(MOUSE_HOLE_WINDOW)
  const openCharacterChat = (character: SanityCharacter) => {
    openWindow({ id: `chat-${character._id}`, type: 'chat', characterId: character._id })
  }

  const closeTour = () => {
    setIsTourOpen(false)
  }

  const openTour = () => {
    setIsTourOpen(true)
  }

  const backgroundAudio = (
    <audio
      ref={audioRef}
      autoPlay
      loop
      playsInline
      preload="auto"
      onCanPlay={tryStartAudio}
      aria-hidden="true"
    >
      <source src="/assets/alex-morgan-autumn-leaves-falling-517092.mp3" type="audio/mpeg" />
    </audio>
  )

  return (
    <div className="experience-shell">
      {backgroundAudio}

      <div
        className={`experience-background${viewportMode === 'desktop' ? ' experience-background--wide' : ''}${isDesktopVisible ? ' experience-background--desktop' : ''}`}
        aria-hidden="true"
      >
        <img className="entry-forest-image" src="/assets/forest_pixel.svg" alt="" />
        <PixelForest src="/assets/forest_pixel.svg" fit={backgroundFit} />
      </div>

      {experienceState === 'entry' || experienceState === 'covering' ? (
        <main
          className={`entry-screen relative isolate grid min-h-screen place-items-center overflow-hidden p-space-md text-center font-ui text-ink-primary${
            isLoading ? ' entry-screen--loading' : ''
          }`}
        >
          <section className="relative z-10 grid justify-items-center px-space-md">
            <h1 className="text-display font-medium">動物公報</h1>
            <p className="mt-space-md text-lead">一本動物行為學季刊</p>
            <button
              className="entry-enter-button mt-space-2xl inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm text-button font-medium text-ink-primary focus-visible:outline-2 focus-visible:outline-line lg:text-title"
              type="button"
              onClick={startExperience}
              disabled={isLoading}
              aria-busy={isLoading}
            >
              {isLoading ? <PixelIcon name="loading" size="small" className="animate-pulse" /> : null}
              <span className="entry-enter-label tracking-display">點擊進入</span>
              <span className="entry-enter-line" aria-hidden="true" />
            </button>
          </section>
        </main>
      ) : null}

      <main
        className={`experience-desktop font-ui text-ink-primary${isDesktopVisible ? ' experience-desktop--visible' : ''}${experienceState === 'desktop' ? ' experience-desktop--ready' : ''}`}
        aria-hidden={!isDesktopVisible || isTourOpen}
      >
        <div className="desktop-workspace">
          <div className="desktop-icon-layer" aria-label="動物公報桌面圖示">
            <div
              className="desktop-icon-group desktop-icon-group--leaf"
              data-tour-id={birdCharacters.length > 0 ? 'tour-characters' : undefined}
            >
              {birdCharacters.map((character) => (
                  <DesktopIcon
                    key={character._id}
                    name={iconNameForCharacter(character)}
                    label={character.name}
                    imageSrc={character.imageUrl}
                    imageAlt={character.imageAlt}
                    size="large"
                    onActivate={() => openCharacterChat(character)}
                  />
                ))}
            </div>

            <div
              className="desktop-icon-group desktop-icon-group--grass"
              data-tour-id={birdCharacters.length === 0 && grassCharacters.length > 0 ? 'tour-characters' : undefined}
            >
              {grassCharacters.map((character) => (
                  <DesktopIcon
                    key={character._id}
                    name={iconNameForCharacter(character)}
                    label={character.name}
                    imageSrc={character.imageUrl}
                    imageAlt={character.imageAlt}
                    size="large"
                    onActivate={() => openCharacterChat(character)}
                  />
                ))}
              <DesktopIcon
                name="老鼠洞"
                label="老鼠洞"
                size="large"
                labelGap="tight"
                onActivate={openMouseHole}
              />
            </div>

            <div className="desktop-icon-group desktop-icon-group--quarterly" data-tour-id="tour-quarterly">
              <DesktopIcon name="季刊" label="季刊" size="large" onActivate={openQuarterly} />
            </div>
          </div>

          <div className="desktop-window-stack">
            {openWindows.map((window) => {
              const windowStyle = { zIndex: windowZIndices[window.id] ?? 10 }
              const initialPosition = windowPositionsRef.current.get(window.id)
              const focusProps = {
                style: windowStyle,
                onPointerDownCapture: () => focusWindow(window.id),
                onFocusCapture: () => focusWindow(window.id),
              }

              if (window.type === 'contact') {
                return (
                  <div
                    key={window.id}
                    {...focusProps}
                    data-window-shell-id={window.id}
                    className="desktop-window-shell desktop-window-shell--contact"
                  >
                    <Window
                      mode={viewportMode}
                      initialPosition={initialPosition}
                      contact={contact ?? undefined}
                      showClose
                      onClose={() => closeWindow(window.id)}
                    />
                  </div>
                )
              }

              if (window.type === 'quarterly') {
                return (
                  <div
                    key={window.id}
                    {...focusProps}
                    data-window-shell-id={window.id}
                    className="desktop-window-shell desktop-window-shell--quarterly"
                  >
                    <QuarterlyWindow
                      title="季刊"
                      initialPosition={initialPosition}
                      state={contentState}
                      data={quarterlySidebarData}
                      article={quarterlyContentArticle}
                      responsiveMode={viewportMode}
                      initialSidebarOpen={!isMobileViewport}
                      initialSelectedArticleId={selectedArticleId ?? undefined}
                      onArticleSelect={(article) => setSelectedArticleId(article.id)}
                      onPrevious={() => {
                        if (selectedPdf && articles.length > 0) setSelectedArticleId(articles.at(-1)?._id ?? null)
                        else if (selectedArticleIndex > 0) setSelectedArticleId(articles[selectedArticleIndex - 1]._id)
                      }}
                      onNext={() => {
                        if (selectedArticleIndex >= 0 && selectedArticleIndex < articles.length - 1) {
                          setSelectedArticleId(articles[selectedArticleIndex + 1]._id)
                        }
                      }}
                      onClose={() => closeWindow(window.id)}
                    />
                  </div>
                )
              }

              if (window.type === 'legal' || window.type === 'faq') {
                const isFaqWindow = window.type === 'faq'

                return (
                  <div
                    key={window.id}
                    {...focusProps}
                    data-window-shell-id={window.id}
                    className="desktop-window-shell desktop-window-shell--legal"
                  >
                    <LegalWindow
                      mode={viewportMode}
                      initialDocument={isFaqWindow ? 'faq' : undefined}
                      standalone={isFaqWindow}
                      initialPosition={initialPosition}
                      onClose={() => closeWindow(window.id)}
                    />
                  </div>
                )
              }

              if (window.type === 'mouse-hole') {
                return (
                  <div
                    key={window.id}
                    {...focusProps}
                    data-window-shell-id={window.id}
                    className="desktop-window-shell desktop-window-shell--mouse-hole"
                  >
                    <MouseHoleWindow
                      mode={viewportMode}
                      initialPosition={initialPosition}
                      onClose={() => closeWindow(window.id)}
                      onHuman={() => closeWindow(window.id)}
                      onNotHuman={() => {
                        globalThis.location.assign('/donate')
                      }}
                    />
                  </div>
                )
              }

              const character = characters.find((item) => item._id === window.characterId)
              if (!character) return null

              return (
                <div
                  key={window.id}
                  {...focusProps}
                  data-window-shell-id={window.id}
                  className="desktop-window-shell desktop-window-shell--chat"
                >
                  <ChatWindows
                    viewport={viewportMode}
                    initialPosition={initialPosition}
                    title={`Message from : ${character.name}`}
                    profile={{
                      imageSrc: character.imageUrl ?? '',
                      imageAlt: character.imageAlt,
                      name: character.name,
                      role: character.role,
                      species: character.species,
                      imageScale: 'large',
                    }}
                    dialogue={toCharacterDialogue(character)}
                    submit={{ placeholder: '寫點什麼吧', submitLabel: '送出' }}
                    onClose={() => closeWindow(window.id)}
                  />
                </div>
              )
            })}

            {experienceState === 'desktop' && viewportMode !== 'mobile'
              ? openWindows.map((window) => (
                <WindowInteractionOverlay
                  key={`interaction-${window.id}`}
                  windowId={window.id}
                  currentPosition={windowPositionsRef.current.get(window.id)}
                  dragInset={window.type === 'quarterly' ? 64 : 0}
                  zIndex={windowZIndices[window.id] ?? 10}
                  onFocus={() => focusWindow(window.id)}
                  onClose={() => closeWindow(window.id)}
                  onPositionChange={(position) => updateWindowPosition(window.id, position)}
                />
              ))
              : null}
          </div>
        </div>

        <Footer
          mode={viewportMode === 'mobile' ? 'mobile' : viewportMode === 'tablet' ? 'tablet' : 'desktop'}
          musicEnabled={musicEnabled}
          onHome={returnToEntry}
          onLegal={openLegal}
          onFaq={openFaq}
          onContact={openContact}
          onMusicToggle={toggleMusic}
          onTour={openTour}
        />
      </main>

      {isDesktopVisible && (
        <TooltipTour
          steps={TOUR_STEPS}
          open={isTourOpen}
          onClose={closeTour}
          onComplete={closeTour}
        />
      )}

      <PixelGridTransition
        stage={transitionStage}
        onCoverComplete={() => setExperienceState('revealing')}
        onRevealComplete={() => {
          setExperienceState('desktop')
          if (!hasVisitedTour) {
            rememberTourVisited()
            setHasVisitedTour(true)
            setIsTourOpen(true)
          }
        }}
      />
    </div>
  )
}

export default DesktopExperience
