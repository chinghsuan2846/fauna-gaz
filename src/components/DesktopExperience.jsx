import { useState } from 'react'
import { buildIssueTree } from '../lib/issueTree.js'

const controlClass =
  'border-thin border-line bg-window-surface px-space-md py-space-sm text-body font-medium text-ink-primary shadow-window transition-colors hover:bg-scrollbar-track focus-visible:outline-2 focus-visible:outline-line'

function DesktopExperience({ articles = [] }) {
  const [started, setStarted] = useState(false)
  const [activeWindow, setActiveWindow] = useState(null)
  const issueTree = buildIssueTree(articles)

  if (!started) {
    return (
      <main className="grid min-h-screen place-content-center gap-space-md bg-window-surface p-space-md text-center font-ui text-ink-primary">
        <h1 className="text-headline font-medium">Fauna Gaz</h1>
        <button className={controlClass} type="button" onClick={() => setStarted(true)}>
          Press to Start
        </button>
      </main>
    )
  }

  return (
    <main className="min-h-screen bg-window-surface p-space-md font-ui text-ink-primary">
      <nav className="flex flex-wrap gap-space-sm" aria-label="Fauna Gaz desktop">
        <button className={controlClass} type="button" onClick={() => setActiveWindow('quarterly')}>
          Quarterly
        </button>
        <button className={controlClass} type="button" onClick={() => setActiveWindow('contact')}>
          Contact
        </button>
      </nav>

      {activeWindow === 'quarterly' && (
        <section className="mx-auto mt-space-lg w-full max-w-2xl border-thin border-line bg-window-surface p-space-md shadow-window" aria-label="Quarterly">
          <header className="mb-space-md flex items-center justify-between border-b-thin border-line-subtle pb-space-sm">
            <h2 className="text-title font-medium">Quarterly</h2>
            <button className="border-thin border-line bg-window-header px-space-sm py-space-xs text-ink-inverse shadow-window" type="button" onClick={() => setActiveWindow(null)} aria-label="Close Quarterly">
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
            <p className="font-body text-body text-ink-secondary">Sanity articles will appear here once the project is connected.</p>
          )}
        </section>
      )}

      {activeWindow === 'contact' && (
        <section className="mx-auto mt-space-lg w-full max-w-2xl border-thin border-line bg-window-surface p-space-md shadow-window" aria-label="Contact">
          <header className="mb-space-md flex items-center justify-between border-b-thin border-line-subtle pb-space-sm">
            <h2 className="text-title font-medium">Contact</h2>
            <button className="border-thin border-line bg-window-header px-space-sm py-space-xs text-ink-inverse shadow-window" type="button" onClick={() => setActiveWindow(null)} aria-label="Close Contact">
              ×
            </button>
          </header>
          <p className="font-body text-body text-ink-primary">Questions, collaborations, or just want to say hi?</p>
        </section>
      )}
    </main>
  )
}

export default DesktopExperience
