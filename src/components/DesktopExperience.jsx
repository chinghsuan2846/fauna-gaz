import { useState } from 'react'
import { buildIssueTree } from '../lib/issueTree.js'

function DesktopExperience({ articles = [] }) {
  const [started, setStarted] = useState(false)
  const [activeWindow, setActiveWindow] = useState(null)
  const issueTree = buildIssueTree(articles)

  if (!started) {
    return (
      <main className="desktop-experience desktop-experience--welcome">
        <h1>Fauna Gaz</h1>
        <button type="button" onClick={() => setStarted(true)}>
          Press to Start
        </button>
      </main>
    )
  }

  return (
    <main className="desktop-experience">
      <nav className="desktop-dock" aria-label="Fauna Gaz desktop">
        <button type="button" onClick={() => setActiveWindow('quarterly')}>
          Quarterly
        </button>
        <button type="button" onClick={() => setActiveWindow('contact')}>
          Contact
        </button>
      </nav>

      {activeWindow === 'quarterly' && (
        <section className="desktop-window" aria-label="Quarterly">
          <header>
            <h2>Quarterly</h2>
            <button type="button" onClick={() => setActiveWindow(null)} aria-label="Close Quarterly">
              ×
            </button>
          </header>
          {articles.length > 0 ? (
            <ul className="issue-tree">
              {issueTree.map((year) => (
                <li key={year.label}>
                  <details open>
                    <summary>{year.label}</summary>
                    <ul>
                      {year.quarters.map((quarter) => (
                        <li key={`${year.label}-${quarter.label}`}>
                          <details open>
                            <summary>{quarter.label}</summary>
                            <ul>
                              {quarter.categories.map((category) => (
                                <li key={`${year.label}-${quarter.label}-${category.label}`}>
                                  <details open>
                                    <summary>{category.label}</summary>
                                    <ul>
                                      {category.articles.map((article) => (
                                        <li key={article._id}>
                                          <a href={`/quarterly/${article.slug}`}>{article.title}</a>
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
            <p>Sanity articles will appear here once the project is connected.</p>
          )}
        </section>
      )}

      {activeWindow === 'contact' && (
        <section className="desktop-window" aria-label="Contact">
          <header>
            <h2>Contact</h2>
            <button type="button" onClick={() => setActiveWindow(null)} aria-label="Close Contact">
              ×
            </button>
          </header>
          <p>Questions, collaborations, or just want to say hi?</p>
        </section>
      )}
    </main>
  )
}

export default DesktopExperience
