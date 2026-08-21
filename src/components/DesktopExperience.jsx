import { useEffect, useRef, useState } from 'react'
import { buildIssueTree } from '../lib/issueTree.js'
import PixelForest from './PixelForest.jsx'

const controlClass =
  'border-thin border-line bg-window-surface px-space-md py-space-sm text-body font-medium text-ink-primary shadow-window transition-colors hover:bg-scrollbar-track focus-visible:outline-2 focus-visible:outline-line'

function DesktopExperience({ articles = [] }) {
  const [started, setStarted] = useState(false)
  const [activeWindow, setActiveWindow] = useState(null)
  const audioRef = useRef(null)
  const issueTree = buildIssueTree(articles)

  const tryStartAudio = () => {
    audioRef.current?.play().catch(() => {})
  }

  useEffect(() => {
    tryStartAudio()
  }, [])

  const startExperience = () => {
    setStarted(true)
    tryStartAudio()
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

  if (!started) {
    return (
      <>
        {backgroundAudio}
        <main className="entry-screen relative isolate grid min-h-screen place-items-center overflow-hidden bg-window-surface p-space-md text-center font-ui text-ink-primary">
          <div className="entry-forest" aria-hidden="true">
            <img className="entry-forest-image" src="/assets/forest_pixel.svg" alt="" />
            <PixelForest src="/assets/forest_pixel.svg" />
          </div>
          <section className="relative z-10 grid justify-items-center px-space-md">
            <h1 className="text-display font-medium">動物公報</h1>
            <p className="mt-space-md text-lead">一本動物行為學季刊</p>
            <button
              className="entry-enter-button mt-space-2xl px-space-md py-space-sm text-button lg:text-title font-medium text-ink-primary focus-visible:outline-2 focus-visible:outline-line"
              type="button"
              onClick={startExperience}
            >
              <span className="tracking-display">點擊進入</span>
              <span className="entry-enter-line" aria-hidden="true" />
            </button>
          </section>
        </main>
      </>
    )
  }

  return (
    <>
      {backgroundAudio}
      <main className="min-h-screen bg-window-surface p-space-md font-ui text-ink-primary">
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
          <section className="mx-auto mt-space-lg w-full max-w-2xl border-thin border-line bg-window-surface p-space-md shadow-window" aria-label="聯絡">
            <header className="mb-space-md flex items-center justify-between border-b-thin border-line-subtle pb-space-sm">
              <h2 className="text-title font-medium">聯絡</h2>
              <button className="border-thin border-line bg-window-header px-space-sm py-space-xs text-ink-inverse shadow-window" type="button" onClick={() => setActiveWindow(null)} aria-label="關閉聯絡">
                ×
              </button>
            </header>
            <p className="font-body text-body text-ink-primary">有問題、合作提案，或只是想打個招呼？</p>
          </section>
        )}
      </main>
    </>
  )
}

export default DesktopExperience
