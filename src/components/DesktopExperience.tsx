import { useEffect, useRef, useState } from 'react'
import {
  toCharacterDialogue,
  toQuarterlyContentArticle,
  toQuarterlySidebarData,
  type ContactInfo,
  type SanityArticle,
  type SanityCharacter,
} from '../lib/contentAdapter'
import ChatWindows from '../stories/patterns/ChatWindows'
import QuarterlyWindow from '../stories/patterns/QuarterlyWindow'
import Footer from '../stories/component/Footer'
import DesktopIcon, { desktopIconNames, type DesktopIconName } from '../stories/component/DesktopIcon'
import LegalWindow from '../stories/component/LegalWindow'
import { PixelIcon } from '../stories/component/Button'
import Window, { type WindowMode } from '../stories/component/Window'
import PixelForest from './PixelForest'
import PixelGridTransition from './PixelGridTransition'

type DesktopExperienceProps = {
  articles?: SanityArticle[]
  characters?: SanityCharacter[]
  contact?: ContactInfo | null
}

type ExperienceState = 'entry' | 'covering' | 'revealing' | 'desktop'
type DesktopWindow =
  | { id: 'contact'; type: 'contact' }
  | { id: 'legal'; type: 'legal' }
  | { id: 'quarterly'; type: 'quarterly' }
  | { id: string; type: 'chat'; characterId: string }

const LOADING_PREVIEW_DURATION = 120
const CONTACT_WINDOW: DesktopWindow = { id: 'contact', type: 'contact' }
const LEGAL_WINDOW: DesktopWindow = { id: 'legal', type: 'legal' }
const GRASS_CHARACTER_ORDER: DesktopIconName[] = ['老莫', '一號', '二號']

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
  if (character.characterType === 'cat') return '一號'
  return '老莫'
}

function grassCharacterOrder(character: SanityCharacter) {
  const order = GRASS_CHARACTER_ORDER.indexOf(iconNameForCharacter(character))
  return order === -1 ? GRASS_CHARACTER_ORDER.length : order
}

function DesktopExperience({ articles = [], characters = [], contact }: DesktopExperienceProps) {
  const [experienceState, setExperienceState] = useState<ExperienceState>('entry')
  const [openWindows, setOpenWindows] = useState<DesktopWindow[]>([CONTACT_WINDOW])
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?._id ?? null)
  const [isLoading, setIsLoading] = useState(false)
  const [musicEnabled, setMusicEnabled] = useState(true)
  const viewportMode = useViewportMode()
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadingTimerRef = useRef<number | null>(null)
  const quarterlySidebarData = toQuarterlySidebarData(articles)
  const selectedArticleIndex = articles.findIndex((article) => article._id === selectedArticleId)
  const selectedArticle = selectedArticleIndex >= 0 ? articles[selectedArticleIndex] : undefined
  const quarterlyContentArticle = selectedArticle
    ? toQuarterlyContentArticle(selectedArticle, articles[selectedArticleIndex - 1], articles[selectedArticleIndex + 1])
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
    const nextMusicEnabled = !musicEnabled
    setMusicEnabled(nextMusicEnabled)

    const audio = audioRef.current
    if (!audio) return

    audio.muted = !nextMusicEnabled
    if (nextMusicEnabled) {
      audio.play().catch(() => {})
    } else {
      audio.pause()
    }
  }

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
    setOpenWindows(viewportMode === 'mobile' ? [] : [CONTACT_WINDOW])
  }

  const focusWindow = (windowId: string) => {
    setOpenWindows((current) => {
      const target = current.find((window) => window.id === windowId)
      if (!target || current.at(-1)?.id === windowId) return current
      return [...current.filter((window) => window.id !== windowId), target]
    })
  }

  const openWindow = (window: DesktopWindow) => {
    setOpenWindows((current) => {
      const existing = current.find((item) => item.id === window.id)
      const next = current.filter((item) => item.id !== window.id)
      if (viewportMode === 'mobile') return [existing ?? window]
      return [...next, existing ?? window]
    })
  }

  const closeWindow = (windowId: string) => {
    setOpenWindows((current) => current.filter((window) => window.id !== windowId))
  }

  const openQuarterly = () => openWindow({ id: 'quarterly', type: 'quarterly' })
  const openContact = () => openWindow(CONTACT_WINDOW)
  const openLegal = () => openWindow(LEGAL_WINDOW)
  const openCharacterChat = (character: SanityCharacter) => {
    openWindow({ id: `chat-${character._id}`, type: 'chat', characterId: character._id })
  }

  const backgroundAudio = (
    <audio
      ref={audioRef}
      src="/assets/naturally.mp3"
      autoPlay
      loop
      playsInline
      preload="auto"
      onCanPlay={tryStartAudio}
      aria-hidden="true"
    />
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
        className={`experience-desktop font-ui text-ink-primary${isDesktopVisible ? ' experience-desktop--visible' : ''}`}
        aria-hidden={!isDesktopVisible}
      >
        <div className="desktop-workspace">
          <div className="desktop-icon-layer" aria-label="動物公報桌面圖示">
            <div className="desktop-icon-group desktop-icon-group--leaf">
              {characters
                .filter((character) => character.characterType === 'bird')
                .map((character) => (
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

            <div className="desktop-icon-group desktop-icon-group--grass">
              {characters
                .filter((character) => character.characterType === 'cat' || character.characterType === 'mouse')
                .sort((left, right) => grassCharacterOrder(left) - grassCharacterOrder(right))
                .map((character) => (
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

            <div className="desktop-icon-group desktop-icon-group--quarterly">
              <DesktopIcon name="季刊" label="季刊" size="large" onActivate={openQuarterly} />
            </div>
          </div>

          <div className="desktop-window-stack">
            {openWindows.map((window, index) => {
              const windowStyle = { zIndex: 10 + index }
              const focusProps = {
                style: windowStyle,
                onPointerDown: () => focusWindow(window.id),
              }

              if (window.type === 'contact') {
                return (
                  <div
                    key={window.id}
                    {...focusProps}
                    className="desktop-window-shell desktop-window-shell--contact"
                  >
                    <Window
                      mode={viewportMode}
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
                    className="desktop-window-shell desktop-window-shell--quarterly"
                  >
                    <QuarterlyWindow
                      title="季刊"
                      data={quarterlySidebarData}
                      article={quarterlyContentArticle}
                      responsiveMode={viewportMode}
                      initialSidebarOpen={!isMobileViewport}
                      initialSelectedArticleId={selectedArticleId ?? undefined}
                      onArticleSelect={(article) => setSelectedArticleId(article.id)}
                      onPrevious={() => {
                        if (selectedArticleIndex > 0) setSelectedArticleId(articles[selectedArticleIndex - 1]._id)
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

              if (window.type === 'legal') {
                return (
                  <div
                    key={window.id}
                    {...focusProps}
                    className="desktop-window-shell desktop-window-shell--legal"
                  >
                    <LegalWindow
                      mode={viewportMode}
                      onClose={() => closeWindow(window.id)}
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
                  className="desktop-window-shell desktop-window-shell--chat"
                >
                  <ChatWindows
                    viewport={viewportMode}
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
          </div>
        </div>

        <Footer
          mode={viewportMode === 'mobile' ? 'mobile' : viewportMode === 'tablet' ? 'tablet' : 'desktop'}
          musicEnabled={musicEnabled}
          onHome={returnToEntry}
          onLegal={openLegal}
          onContact={openContact}
          onMusicToggle={toggleMusic}
        />
      </main>

      <PixelGridTransition
        stage={transitionStage}
        onCoverComplete={() => setExperienceState('revealing')}
        onRevealComplete={() => setExperienceState('desktop')}
      />
    </div>
  )
}

export default DesktopExperience
