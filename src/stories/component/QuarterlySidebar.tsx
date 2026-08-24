import { useEffect, useState } from 'react'

import { PixelIcon } from './Button'

export type QuarterlySidebarArticle = {
  id: string
  title: string
}

export type QuarterlySidebarGroup = {
  id: string
  label: string
  articles: readonly QuarterlySidebarArticle[]
}

export type QuarterlySidebarQuarter = {
  id: string
  label: string
  groups: readonly QuarterlySidebarGroup[]
}

export type QuarterlySidebarYear = {
  id: string
  label: string
  quarters: readonly QuarterlySidebarQuarter[]
}

export type QuarterlySidebarPreviewState = 'none' | 'hover' | 'active'

export type QuarterlySidebarProps = {
  data?: readonly QuarterlySidebarYear[]
  initialOpenYearIds?: readonly string[]
  initialOpenQuarterIds?: readonly string[]
  initialSelectedArticleId?: string
  previewArticleId?: string
  previewState?: QuarterlySidebarPreviewState
  mobile?: boolean
  borderless?: boolean
  onArticleSelect?: (article: QuarterlySidebarArticle) => void
  className?: string
}

export const quarterlySidebarMockData: readonly QuarterlySidebarYear[] = [
  {
    id: '2027',
    label: '2027',
    quarters: [
      {
        id: '2027-autumn',
        label: '秋季號',
        groups: [
          {
            id: '2027-autumn-featured',
            label: '專題｜自我意識',
            articles: [
              { id: '2027-autumn-forest-memory', title: '森林的記憶' },
              { id: '2027-autumn-night-watch', title: '夜行者的觀察筆記' },
              { id: '2027-autumn-city-birds', title: '城市邊緣的鳥' },
              { id: '2027-autumn-wild-compass', title: '野地裡的方向感' },
            ],
          },
          {
            id: '2027-autumn-extended',
            label: '延伸內容',
            articles: [
              { id: '2027-autumn-summary', title: '本期總結' },
              { id: '2027-autumn-recipe', title: '雨天食譜' },
              { id: '2027-autumn-mailbox', title: '讀者回函' },
              { id: '2027-autumn-notes', title: '引用來源與備註' },
            ],
          },
        ],
      },
      {
        id: '2027-winter',
        label: '冬季號',
        groups: [
          {
            id: '2027-winter-featured',
            label: '專題｜遷徙與歸返',
            articles: [
              { id: '2027-winter-migration', title: '回家的路' },
              { id: '2027-winter-shelter', title: '一座溫暖的巢' },
              { id: '2027-winter-snow-tracks', title: '雪地上的腳印' },
            ],
          },
          {
            id: '2027-winter-extended',
            label: '延伸內容',
            articles: [
              { id: '2027-winter-summary', title: '本期總結' },
              { id: '2027-winter-reading', title: '延伸閱讀' },
              { id: '2027-winter-mailbox', title: '讀者回函' },
              { id: '2027-winter-notes', title: '引用來源與備註' },
            ],
          },
        ],
      },
    ],
  },
  {
    id: '2026',
    label: '2026',
    quarters: [
      {
        id: '2026-autumn',
        label: '秋季號（創刊號）',
        groups: [
          {
            id: '2026-autumn-featured',
            label: '專題｜自我意識',
            articles: [
              { id: '2026-autumn-self-awareness', title: '自我意識' },
              { id: '2026-autumn-white-brow', title: '白頸鴉' },
              { id: '2026-autumn-porpoise', title: '瓶鼻海豚' },
              { id: '2026-autumn-asian-black-bear', title: '亞洲黑熊' },
              { id: '2026-autumn-ant', title: '螞蟻' },
              { id: '2026-autumn-crane', title: '蒼鷺' },
              { id: '2026-autumn-dog', title: '狗' },
            ],
          },
          {
            id: '2026-autumn-extended',
            label: '延伸內容',
            articles: [
              { id: '2026-autumn-summary', title: '總結' },
              { id: '2026-autumn-recipe', title: '食譜' },
              { id: '2026-autumn-mailbox', title: '讀者回函' },
              { id: '2026-autumn-notes', title: '引用來源與備註' },
            ],
          },
        ],
      },
      {
        id: '2026-winter',
        label: '冬季號',
        groups: [
          {
            id: '2026-winter-featured',
            label: '專題｜冬眠之前',
            articles: [
              { id: '2026-winter-hibernation', title: '冬眠之前' },
              { id: '2026-winter-cold-water', title: '冷水裡的呼吸' },
              { id: '2026-winter-lantern', title: '夜裡的微光' },
            ],
          },
          {
            id: '2026-winter-extended',
            label: '延伸內容',
            articles: [
              { id: '2026-winter-summary', title: '總結' },
              { id: '2026-winter-recipe', title: '食譜' },
              { id: '2026-winter-mailbox', title: '讀者回函' },
              { id: '2026-winter-notes', title: '引用來源與備註' },
            ],
          },
        ],
      },
    ],
  },
]

function PixelFolderIcon() {
  return (
    <svg aria-hidden="true" className="h-space-md w-space-md shrink-0" fill="currentColor" viewBox="0 0 16 16" shapeRendering="crispEdges">
      <path className="text-ink-primary" d="M1 3h6l2 2h6v9H1z" />
      <path className="text-sidebar-folder" d="M2 5h5l2 1h5v7H2z" />
    </svg>
  )
}

function PixelDisclosure({ expanded }: { expanded: boolean }) {
  return (
    <PixelIcon
      name="chevron-right"
      size="small"
      className={`ml-auto text-ink-primary transition-transform${expanded ? ' rotate-90' : ''}`}
    />
  )
}

function QuarterlySidebar({
  data = quarterlySidebarMockData,
  initialOpenYearIds = ['2026'],
  initialOpenQuarterIds = ['2026-autumn'],
  initialSelectedArticleId,
  previewArticleId,
  previewState = 'none',
  mobile = false,
  borderless = false,
  onArticleSelect,
  className = '',
}: QuarterlySidebarProps) {
  const [openYearIds, setOpenYearIds] = useState(() => new Set(initialOpenYearIds))
  const [openQuarterIds, setOpenQuarterIds] = useState(() => new Set(initialOpenQuarterIds))
  const [selectedArticleId, setSelectedArticleId] = useState(initialSelectedArticleId)

  useEffect(() => {
    setSelectedArticleId(initialSelectedArticleId)
  }, [initialSelectedArticleId])

  const toggleYear = (yearId: string) => {
    setOpenYearIds((current) => {
      const next = new Set(current)
      if (next.has(yearId)) next.delete(yearId)
      else next.add(yearId)
      return next
    })
  }

  const toggleQuarter = (quarterId: string) => {
    setOpenQuarterIds((current) => {
      const next = new Set(current)
      if (next.has(quarterId)) next.delete(quarterId)
      else next.add(quarterId)
      return next
    })
  }

  const selectArticle = (article: QuarterlySidebarArticle) => {
    setSelectedArticleId(article.id)
    onArticleSelect?.(article)
  }

  return (
    <aside
      aria-label="季刊文章目錄"
      className={`h-full min-h-0 min-w-0 w-full overflow-hidden bg-window-surface font-ui text-small text-ink-primary${
        borderless ? '' : ' border-thin border-line-strong'
      } ${className}`}
    >
      <div className="retroScrollArea h-full min-h-0 min-w-0 w-full overflow-x-hidden overflow-y-auto">
        <div className="min-w-0 p-space-sm">
          <ul className="grid gap-space-xs" role="tree">
          {data.map((year) => {
            const isYearOpen = openYearIds.has(year.id)

            return (
              <li key={year.id} role="treeitem" aria-expanded={isYearOpen}>
                <button
                  type="button"
                  className="sidebar-full-bleed flex items-center gap-space-xs px-space-sm py-space-xs text-left text-ink-primary hover:bg-ink-primary-hover focus-visible:outline-2 focus-visible:outline-ink-primary"
                  aria-controls={`quarterly-sidebar-year-${year.id}`}
                  aria-expanded={isYearOpen}
                  onClick={() => toggleYear(year.id)}
                >
                  <PixelFolderIcon />
                  <span className="min-w-0 whitespace-nowrap">{year.label}</span>
                  <PixelDisclosure expanded={isYearOpen} />
                </button>

                {isYearOpen && (
                  <ul id={`quarterly-sidebar-year-${year.id}`} className="grid gap-space-xs" role="group">
                    {year.quarters.map((quarter) => {
                      const isQuarterOpen = openQuarterIds.has(quarter.id)

                      return (
                        <li key={quarter.id} role="treeitem" aria-expanded={isQuarterOpen}>
                          <button
                            type="button"
                            className="sidebar-full-bleed flex items-center gap-space-xs pl-space-xl pr-space-sm py-space-xs text-left text-ink-primary hover:bg-ink-primary-hover focus-visible:outline-2 focus-visible:outline-ink-primary"
                            aria-controls={`quarterly-sidebar-quarter-${quarter.id}`}
                            aria-expanded={isQuarterOpen}
                            onClick={() => toggleQuarter(quarter.id)}
                          >
                            <PixelFolderIcon />
                            <span className="min-w-0 whitespace-nowrap">{quarter.label}</span>
                            <PixelDisclosure expanded={isQuarterOpen} />
                          </button>

                          {isQuarterOpen && (
                            <div id={`quarterly-sidebar-quarter-${quarter.id}`} className="min-w-0" role="group">
                              {quarter.groups.map((group, groupIndex) => (
                                <section
                                  key={group.id}
                                  className={groupIndex === 0 ? '' : 'window-divider mt-space-sm pt-space-sm'}
                                >
                                  <p className={`sidebar-full-bleed px-space-sm pl-space-2xl ${mobile ? 'text-small' : 'text-caption'} text-ink-secondary`}>{group.label}</p>
                                  <ul className="mt-space-xs grid" role="group">
                                    {group.articles.map((article) => {
                                      const isSelected = selectedArticleId === article.id
                                      const isPreview = previewArticleId === article.id && previewState !== 'none'
                                      const isActive = isSelected || (isPreview && previewState === 'active')
                                      const isHoverPreview = isPreview && previewState === 'hover'

                                      return (
                                        <li key={article.id}>
                                          <button
                                            type="button"
                                            className={`sidebar-full-bleed flex px-space-sm py-space-xs pl-space-2xl text-left whitespace-nowrap hover:bg-ink-primary-hover focus-visible:outline-2 focus-visible:outline-ink-primary${
                                              isActive ? ' bg-sidebar-active' : isHoverPreview ? ' bg-ink-primary-hover' : ''
                                            }`}
                                            aria-current={isActive ? 'page' : undefined}
                                            onClick={() => selectArticle(article)}
                                          >
                                            <span className="min-w-0">{article.title}</span>
                                          </button>
                                        </li>
                                      )
                                    })}
                                  </ul>
                                </section>
                              ))}
                            </div>
                          )}
                        </li>
                      )
                    })}
                  </ul>
                )}
              </li>
            )
          })}
          </ul>
        </div>
      </div>
    </aside>
  )
}

export default QuarterlySidebar
