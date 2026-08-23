import { useEffect, useMemo, useRef, useState } from 'react'
import {
  toCharacterDialogue,
  toQuarterlyContentArticle,
  toQuarterlySidebarData,
  type ContactInfo,
  type SanityArticle,
  type SanityCharacter,
} from '../lib/contentAdapter'
import ChatWindows from '../stories/patterns/ChatWindows'
import QuarterlyContent from '../stories/component/QuarterlyContent'
import QuarterlySidebar from '../stories/component/QuarterlySidebar'
import Footer from '../stories/component/Footer'
import DesktopIcon, { desktopIconNames, type DesktopIconName } from '../stories/component/DesktopIcon'
import { Button, PixelIcon } from '../stories/component/Button'
import Window from '../stories/component/Window'
import PixelForest from './PixelForest'
import PixelGridTransition from './PixelGridTransition'

type DesktopExperienceProps = {
  articles?: SanityArticle[]
  characters?: SanityCharacter[]
  contact?: ContactInfo | null
}

type ExperienceState = 'entry' | 'covering' | 'revealing' | 'desktop'
type ActiveWindow =
  | { type: 'quarterly' }
  | { type: 'chat'; characterId: string }
  | null

const LOADING_PREVIEW_DURATION = 120

function iconNameForCharacter(character: SanityCharacter): DesktopIconName {
  if (desktopIconNames.includes(character.name as DesktopIconName)) return character.name as DesktopIconName
  if (character.characterType === 'bird') return '阿雀'
  if (character.characterType === 'cat') return '一號'
  return '老莫'
}

function DesktopExperience({ articles = [], characters = [], contact }: DesktopExperienceProps) {
  const [experienceState, setExperienceState] = useState<ExperienceState>('entry')
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>(null)
  const [isContactOpen, setIsContactOpen] = useState(false)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?._id ?? null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadingTimerRef = useRef<number | null>(null)
  const quarterlySidebarData = toQuarterlySidebarData(articles)
  const selectedArticleIndex = articles.findIndex((article) => article._id === selectedArticleId)
  const selectedArticle = selectedArticleIndex >= 0 ? articles[selectedArticleIndex] : undefined
  const quarterlyContentArticle = selectedArticle
    ? toQuarterlyContentArticle(selectedArticle, articles[selectedArticleIndex - 1], articles[selectedArticleIndex + 1])
    : undefined
  const firstYear = quarterlySidebarData[0]
  const firstQuarter = firstYear?.quarters[0]
  const selectedCharacter = activeWindow?.type === 'chat'
    ? characters.find((character) => character._id === activeWindow.characterId)
    : undefined
  const selectedDialogue = useMemo(
    () => (selectedCharacter ? toCharacterDialogue(selectedCharacter) : undefined),
    [selectedCharacter],
  )
  const isDesktopVisible = experienceState === 'revealing' || experienceState === 'desktop'
  const transitionStage = experienceState === 'covering' || experienceState === 'revealing' ? experienceState : null

  const tryStartAudio = () => {
    audioRef.current?.play().catch(() => {})
  }

  useEffect(() => {
    tryStartAudio()
  }, [])

  useEffect(() => {
    return () => {
      if (loadingTimerRef.current !== null) window.clearTimeout(loadingTimerRef.current)
    }
  }, [])

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
    setActiveWindow(null)
    setIsContactOpen(false)
  }

  const openQuarterly = () => setActiveWindow({ type: 'quarterly' })
  const openContact = () => setIsContactOpen(true)
  const openCharacterChat = (character: SanityCharacter) => {
    setActiveWindow({ type: 'chat', characterId: character._id })
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

      <div className={`experience-background${isDesktopVisible ? ' experience-background--desktop' : ''}`} aria-hidden="true">
        <img className="entry-forest-image" src="/assets/forest_pixel.svg" alt="" />
        <PixelForest src="/assets/forest_pixel.svg" />
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
          <nav className="relative z-20 flex flex-wrap gap-space-sm" aria-label="動物公報桌面空間">
            <Button label="季刊" size="large" textSize="body" className="shadow-window" onClick={openQuarterly} />
            <Button label="聯絡" size="large" textSize="body" className="shadow-window" onClick={openContact} />
          </nav>

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
            {isContactOpen && (
              <div className="desktop-window-shell desktop-window-shell--contact">
                <Window mode="desktop" contact={contact ?? undefined} showClose={false} />
              </div>
            )}

            {activeWindow?.type === 'quarterly' && (
              <div className="desktop-window-shell desktop-window-shell--quarterly">
                <Window
                  title="季刊"
                  mode="desktop"
                  className="h-full max-h-full"
                  showSidebar
                  sidebarOpen={isSidebarOpen}
                  onSidebarToggle={() => setIsSidebarOpen((open) => !open)}
                  onClose={() => setActiveWindow(null)}
                >
                  <div className="flex min-h-0 min-w-0 flex-1">
                    {isSidebarOpen && (
                      <div className="min-h-0 w-sidebar shrink-0">
                        <QuarterlySidebar
                          data={quarterlySidebarData}
                          initialOpenYearIds={firstYear ? [firstYear.id] : []}
                          initialOpenQuarterIds={firstQuarter ? [firstQuarter.id] : []}
                          initialSelectedArticleId={selectedArticleId ?? undefined}
                          onArticleSelect={(article) => setSelectedArticleId(article.id)}
                        />
                      </div>
                    )}

                    {quarterlyContentArticle ? (
                      <QuarterlyContent
                        article={quarterlyContentArticle}
                        className="min-h-0 min-w-0 flex-1"
                        onPrevious={() => {
                          if (selectedArticleIndex > 0) setSelectedArticleId(articles[selectedArticleIndex - 1]._id)
                        }}
                        onNext={() => {
                          if (selectedArticleIndex >= 0 && selectedArticleIndex < articles.length - 1) {
                            setSelectedArticleId(articles[selectedArticleIndex + 1]._id)
                          }
                        }}
                      />
                    ) : (
                      <div className="flex min-h-0 min-w-0 flex-1 items-center justify-center p-space-lg font-body text-body text-ink-secondary">
                        季刊目前沒有文章內容。
                      </div>
                    )}
                  </div>
                </Window>
              </div>
            )}

            {activeWindow?.type === 'chat' && selectedCharacter && (
              <div className="desktop-window-shell desktop-window-shell--chat">
                <ChatWindows
                  viewport="desktop"
                  title={`Message from : ${selectedCharacter.name}`}
                  profile={{
                    imageSrc: selectedCharacter.imageUrl ?? '',
                    imageAlt: selectedCharacter.imageAlt,
                    name: selectedCharacter.name,
                    role: selectedCharacter.role,
                    species: selectedCharacter.species,
                    imageScale: 'large',
                  }}
                  dialogue={selectedDialogue}
                  onClose={() => setActiveWindow(null)}
                />
              </div>
            )}
          </div>
        </div>

        <Footer mode="responsive" onHome={returnToEntry} />
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
