import { useEffect, useRef, useState } from 'react'
import { buildIssueTree } from '../lib/issueTree.js'
import Window from '../stories/component/Window'
import PixelForest from './PixelForest'
import PixelGridTransition from './PixelGridTransition'
import { PixelIcon } from '../stories/component/Button'

type ArticleCategory = {
  slug: string
  title: string
}

type Article = {
  _id: string
  slug: string
  title: string
  issue?: {
    year?: string | number
    quarter?: string
  }
  categories?: ArticleCategory[]
}

type IssueTreeCategory = {
  label: string
  articles: Article[]
}

type IssueTreeQuarter = {
  label: string
  categories: IssueTreeCategory[]
}

type IssueTreeYear = {
  label: string
  quarters: IssueTreeQuarter[]
}

type DesktopExperienceProps = {
  articles?: Article[]
}

type ExperienceState = 'entry' | 'covering' | 'revealing' | 'desktop'
type ActiveWindow = 'quarterly' | 'contact' | null

const controlClass =
  'border-thin border-line bg-window-surface px-space-md py-space-sm text-body font-medium text-ink-primary shadow-window transition-colors hover:bg-scrollbar-track focus-visible:outline-2 focus-visible:outline-line'
const LOADING_PREVIEW_DURATION = 120

function DesktopExperience({ articles = [] }: DesktopExperienceProps) {
  const [experienceState, setExperienceState] = useState<ExperienceState>('entry')
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>(null)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadingTimerRef = useRef<number | null>(null)
  const issueTree = buildIssueTree(articles) as IssueTreeYear[]
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
              className="entry-enter-button mt-space-2xl inline-flex items-center justify-center gap-space-xs px-space-md py-space-sm text-button lg:text-title font-medium text-ink-primary focus-visible:outline-2 focus-visible:outline-line"
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
        className={`experience-desktop retroScrollArea min-h-screen p-space-md font-ui text-ink-primary${
          isDesktopVisible ? ' experience-desktop--visible' : ''
        }`}
        aria-hidden={!isDesktopVisible}
      >
        <nav className="flex flex-wrap gap-space-sm" aria-label="動物公報桌面空間">
          <button className={controlClass} type="button" onClick={() => setActiveWindow('quarterly')}>
            季刊
          </button>
          <button className={controlClass} type="button" onClick={() => setActiveWindow('contact')}>
            聯絡
          </button>
        </nav>

        {activeWindow === 'quarterly' && (
          <section className="mx-auto mt-space-lg w-full max-w-2xl border-thin border-line bg-window-surface p-space-md shadow-window" aria-label="季刊">
            <header className="mb-space-md flex items-center justify-between border-b-thin border-line-subtle pb-space-sm">
              <h2 className="text-title font-medium">季刊</h2>
              <button className="border-thin border-line bg-window-header px-space-sm py-space-xs text-ink-inverse shadow-window" type="button" onClick={() => setActiveWindow(null)} aria-label="關閉季刊">
                ×
              </button>
            </header>
            {articles.length > 0 ? (
              <ul className="space-y-space-sm">
                {issueTree.map((year) => (
                  <li key={year.label}>
                    <details open>
                      <summary className="cursor-pointer font-medium">{year.label}</summary>
                      <ul className="space-y-space-xs pl-space-md">
                        {year.quarters.map((quarter) => (
                          <li key={`${year.label}-${quarter.label}`}>
                            <details open>
                              <summary className="cursor-pointer text-ink-secondary">{quarter.label}</summary>
                              <ul className="space-y-space-xs pl-space-md">
                                {quarter.categories.map((category) => (
                                  <li key={`${year.label}-${quarter.label}-${category.label}`}>
                                    <details open>
                                      <summary className="cursor-pointer text-ink-secondary">{category.label}</summary>
                                      <ul className="space-y-space-xs pl-space-md">
                                        {category.articles.map((article) => (
                                          <li key={article._id}>
                                            <a className="text-action-link underline decoration-action-link underline-offset-2" href={`/quarterly/${article.slug}`}>
                                              {article.title}
                                            </a>
                                          </li>
                                        ))}
                                      </ul>
                                    </details>
                                  </li>
                                ))}
                              </ul>
                            </details>
                          </li>
                        ))}
                      </ul>
                    </details>
                  </li>
                ))}
              </ul>
            ) : (
              <p className="font-body text-body text-ink-secondary">連結內容管理系統後，季刊文章會顯示在這裡。</p>
            )}
          </section>
        )}

        {activeWindow === 'contact' && (
          <div className="mx-auto mt-space-lg w-full max-w-viewport-mobile">
            <Window mode="desktop" onClose={() => setActiveWindow(null)} />
          </div>
        )}
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
