import { useEffect, useRef, useState } from 'react'
import { buildIssueTree } from '../lib/issueTree.js'
import QuarterlyContent, { type QuarterlyContentArticle } from '../stories/component/QuarterlyContent'
import QuarterlySidebar, { type QuarterlySidebarYear } from '../stories/component/QuarterlySidebar'
import { Button, PixelIcon } from '../stories/component/Button'
import Window from '../stories/component/Window'
import PixelForest from './PixelForest'
import PixelGridTransition from './PixelGridTransition'

type ArticleCategory = {
  slug: string
  title: string
}

type Article = {
  _id: string
  slug: string
  title: string
  excerpt?: string
  body?: ArticleBodyBlock[]
  issue?: {
    year?: string | number
    quarter?: string
  }
  categories?: ArticleCategory[]
}

type ArticleBodyBlock = {
  _type?: string
  children?: Array<{
    text?: string
    marks?: string[]
  }>
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

const LOADING_PREVIEW_DURATION = 120

function toQuarterlySidebarData(issueTree: readonly IssueTreeYear[]): readonly QuarterlySidebarYear[] {
  return issueTree.map((year) => ({
    id: year.label,
    label: year.label,
    quarters: year.quarters.map((quarter) => ({
      id: `${year.label}-${quarter.label}`,
      label: quarter.label,
      groups: quarter.categories.map((category) => ({
        id: `${year.label}-${quarter.label}-${category.label}`,
        label: category.label,
        articles: category.articles.map((article) => ({
          id: article._id,
          title: article.title,
        })),
      })),
    })),
  }))
}

function toQuarterlyContentArticle(article: Article, previous?: Article, next?: Article): QuarterlyContentArticle {
  const paragraphs = (article.body ?? [])
    .filter((block) => block._type === 'block')
    .map((block, index) => ({
      id: `${article._id}-paragraph-${index}`,
      segments: (block.children ?? [])
        .filter((child) => child.text)
        .map((child) => ({
          ...(child.marks?.includes('strong') ? { kind: 'strong' as const } : {}),
          text: child.text ?? '',
        })),
    }))
    .filter((paragraph) => paragraph.segments.length > 0)

  return {
    id: article._id,
    year: String(article.issue?.year ?? ''),
    quarter: article.issue?.quarter ?? '',
    title: article.title,
    paragraphs,
    previous: previous ? { id: previous._id, title: previous.title } : null,
    next: next ? { id: next._id, title: next.title } : null,
  }
}

function DesktopExperience({ articles = [] }: DesktopExperienceProps) {
  const [experienceState, setExperienceState] = useState<ExperienceState>('entry')
  const [activeWindow, setActiveWindow] = useState<ActiveWindow>(null)
  const [selectedArticleId, setSelectedArticleId] = useState<string | null>(articles[0]?._id ?? null)
  const [isSidebarOpen, setIsSidebarOpen] = useState(true)
  const [isLoading, setIsLoading] = useState(false)
  const audioRef = useRef<HTMLAudioElement | null>(null)
  const loadingTimerRef = useRef<number | null>(null)
  const issueTree = buildIssueTree(articles) as IssueTreeYear[]
  const quarterlySidebarData = toQuarterlySidebarData(issueTree)
  const selectedArticleIndex = articles.findIndex((article) => article._id === selectedArticleId)
  const selectedArticle = selectedArticleIndex >= 0 ? articles[selectedArticleIndex] : undefined
  const quarterlyContentArticle = selectedArticle
    ? toQuarterlyContentArticle(selectedArticle, articles[selectedArticleIndex - 1], articles[selectedArticleIndex + 1])
    : undefined
  const firstYear = quarterlySidebarData[0]
  const firstQuarter = firstYear?.quarters[0]
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
          <Button label="季刊" size="large" textSize="body" className="shadow-window" onClick={() => setActiveWindow('quarterly')} />
          <Button label="聯絡" size="large" textSize="body" className="shadow-window" onClick={() => setActiveWindow('contact')} />
        </nav>

        {activeWindow === 'quarterly' && (
          <div className="mx-auto mt-space-lg w-full max-w-viewport-tablet">
            <Window
              title="季刊"
              mode="desktop"
              className="max-h-screen"
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
                    連結內容管理系統後，季刊文章會顯示在這裡。
                  </div>
                )}
              </div>
            </Window>
          </div>
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
