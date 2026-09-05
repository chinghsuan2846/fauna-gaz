import { useEffect, useId, useRef, useState } from 'react'
import { createPortal } from 'react-dom'
import type { ButtonProps } from './Button'
import { Button } from './Button'
import QuarterlyPdfViewer from './QuarterlyPdfViewer'

export type QuarterlyContentSegmentKind = 'text' | 'strong' | 'quote' | 'emphasis'

export type QuarterlyContentSegment = {
  kind?: QuarterlyContentSegmentKind
  text: string
}

export type QuarterlyContentCitation = {
  marker: string
  text: string
}

export type QuarterlyContentParagraph = {
  id: string
  style?: 'normal' | 'h1' | 'h2' | 'h3'
  segments: readonly QuarterlyContentSegment[]
}

export type QuarterlyContentNavigationItem = {
  id: string
  title: string
}

export type QuarterlyContentPdf = {
  url: string
  pageCount: number
  fileName?: string
}

export type QuarterlyContentArticle = {
  id: string
  breadcrumb: readonly string[]
  title: string
  paragraphs: readonly QuarterlyContentParagraph[]
  citations?: readonly QuarterlyContentCitation[]
  pdf?: QuarterlyContentPdf
  previous?: QuarterlyContentNavigationItem | null
  next?: QuarterlyContentNavigationItem | null
}

export type QuarterlyContentProps = {
  article?: QuarterlyContentArticle
  borderless?: boolean
  mobile?: boolean
  onPrevious?: ButtonProps['onClick']
  onNext?: ButtonProps['onClick']
  className?: string
}

const selfArticleParagraphs: readonly QuarterlyContentParagraph[] = [
  {
    id: 'self-introduction',
    segments: [
      { text: '相傳大多數的人在談論到這個話題時，不外乎都會提到笛卡兒。' },
      { kind: 'quote', text: '我思故我在' },
      { text: '這句話指出，即使我們懷疑自身的存在，正在懷疑的那個念頭本身，仍然證明了某個正在思考的主體存在。' },
    ],
  },
  {
    id: 'self-question',
    segments: [
      { text: '然而，當我們意識到自身存在的同時，是否也代表了「自我意識」的存在？' },
    ],
  },
  {
    id: 'self-boundary',
    segments: [
      { text: '又或者，如果我想證明的對象不是人類，而是一隻海豚、一隻大象，甚至是一隻鳥，我們又該如何判斷牠們是否具有自我意識？' },
    ],
  },
  {
    id: 'self-recognition',
    segments: [
      { text: '由蘇珊·蓋洛普（Gordon G. Gallup）等人組成的研究團隊，於1970年代率先提出一項「鏡像自我辨識測試」。' },
      { text: '研究人員會在實驗動物身上放置一個牠無法直接看見、也無法透過除視覺之外的其它感官察覺的標記。' },
    ],
  },
  {
    id: 'self-mirror',
    segments: [
      { text: '如果實驗動物能夠透過鏡中的影像，意識到自己身上的標記，再對鏡中做出相對應的行為，便可推設這種標記可能代表某種程度的自我認知能力。' },
    ],
  },
  {
    id: 'self-method',
    segments: [
      { text: '這聽上去似乎是個合理的方法，對吧？畢竟，自我意識是一種個體對於本身的直觀感受與理解。' },
      { kind: 'strong', text: '但鏡子真的能成為所有生命的答案嗎？' },
    ],
  },
  {
    id: 'self-observation',
    segments: [
      { text: '當我們把問題拉回森林，會發現每個物種都可能用自己的方式理解環境。牠們記住路線、辨認同伴、回應聲音，也在一次次選擇中留下屬於自己的痕跡。' },
    ],
  },
  {
    id: 'self-conclusion',
    segments: [
      { text: '所以，證明「自我」的存在，也許不只是找到一個適用於所有動物的測試，而是學著辨認每種生命表達自身的方式。' },
    ],
  },
]

export const quarterlyContentMockArticle: QuarterlyContentArticle = {
  id: '2026-autumn-self-awareness',
  breadcrumb: ['2026', '秋季號（創刊號）', '如何證明「自我」的存在？'],
  title: '如何證明「自我」的存在？',
  paragraphs: selfArticleParagraphs,
  previous: { id: '2026-autumn-introduction', title: '創刊序' },
  next: { id: '2026-autumn-white-brow', title: '白頸鴉' },
}

export const quarterlyContentFirstArticle: QuarterlyContentArticle = {
  ...quarterlyContentMockArticle,
  id: '2026-autumn-introduction',
  breadcrumb: ['2026', '秋季號（創刊號）', '創刊序'],
  title: '創刊序',
  previous: null,
}

export const quarterlyContentLastArticle: QuarterlyContentArticle = {
  ...quarterlyContentMockArticle,
  id: '2026-autumn-dog',
  breadcrumb: ['2026', '秋季號（創刊號）', '狗'],
  title: '狗',
  next: null,
}

type TooltipPosition = {
  left: number
  top: number
  maxWidth: number
}

type CitationMarkerProps = {
  marker: string
  text: string
  interactionMode: CitationInteractionMode
}

type CitationInteractionMode = 'hover' | 'click'

function CitationMarker({ marker, text, interactionMode }: CitationMarkerProps) {
  const markerRef = useRef<HTMLButtonElement>(null)
  const tooltipRef = useRef<HTMLSpanElement>(null)
  const tooltipId = `citation-tooltip-${useId().replace(/:/g, '')}`
  const [isHovered, setIsHovered] = useState(false)
  const [isClicked, setIsClicked] = useState(false)
  const [position, setPosition] = useState<TooltipPosition | null>(null)
  const isOpen = interactionMode === 'click' ? isClicked : isHovered

  useEffect(() => {
    if (interactionMode !== 'click' || !isClicked) return

    const handlePointerDown = (event: PointerEvent) => {
      const target = event.target as Node | null
      if (target && (markerRef.current?.contains(target) || tooltipRef.current?.contains(target))) return
      setIsClicked(false)
    }
    const handleKeyDown = (event: KeyboardEvent) => {
      if (event.key === 'Escape') setIsClicked(false)
    }

    document.addEventListener('pointerdown', handlePointerDown)
    document.addEventListener('keydown', handleKeyDown)
    return () => {
      document.removeEventListener('pointerdown', handlePointerDown)
      document.removeEventListener('keydown', handleKeyDown)
    }
  }, [interactionMode, isClicked])

  useEffect(() => {
    if (!isOpen) {
      setPosition(null)
      return
    }

    const updatePosition = () => {
      const markerElement = markerRef.current
      const tooltipElement = tooltipRef.current
      if (!markerElement || !tooltipElement) return

      const markerBounds = markerElement.getBoundingClientRect()
      const articleBounds = markerElement.closest<HTMLElement>('[aria-label^="文章內容："]')?.getBoundingClientRect()
      const windowBounds = articleBounds ?? markerElement.closest<HTMLElement>('[aria-label$=" window"]')?.getBoundingClientRect() ?? {
        left: 0,
        top: 0,
        right: window.innerWidth,
        bottom: window.innerHeight,
        width: window.innerWidth,
        height: window.innerHeight,
      }
      const edgeInset = 32
      const markerGap = 8
      const maxWidth = Math.max(0, Math.min(window.innerWidth - edgeInset * 2, windowBounds.width - edgeInset * 2))
      tooltipElement.style.maxWidth = `${maxWidth}px`
      const measuredTooltipBounds = tooltipElement.getBoundingClientRect()
      const minLeft = Math.max(edgeInset, windowBounds.left + edgeInset)
      const maxLeft = Math.max(minLeft, Math.min(window.innerWidth - measuredTooltipBounds.width - edgeInset, windowBounds.right - measuredTooltipBounds.width - edgeInset))
      const centeredLeft = markerBounds.left + (markerBounds.width - measuredTooltipBounds.width) / 2
      const topAbove = markerBounds.top - measuredTooltipBounds.height - markerGap
      const topBelow = markerBounds.bottom + markerGap
      const minTop = Math.max(edgeInset, windowBounds.top + edgeInset)
      const maxTop = Math.max(minTop, Math.min(window.innerHeight - measuredTooltipBounds.height - edgeInset, windowBounds.bottom - measuredTooltipBounds.height - edgeInset))
      const top = topAbove >= minTop
        ? topAbove
        : Math.min(topBelow, maxTop)

      setPosition({
        left: Math.min(Math.max(centeredLeft, minLeft), maxLeft),
        top: Math.min(Math.max(top, minTop), maxTop),
        maxWidth,
      })
    }

    const frame = window.requestAnimationFrame(updatePosition)
    window.addEventListener('resize', updatePosition)
    window.addEventListener('scroll', updatePosition, true)

    return () => {
      window.cancelAnimationFrame(frame)
      window.removeEventListener('resize', updatePosition)
      window.removeEventListener('scroll', updatePosition, true)
    }
  }, [isOpen, text])

  const tooltip = isOpen && typeof document !== 'undefined'
    ? createPortal(
        <span
          ref={tooltipRef}
          id={tooltipId}
          role="tooltip"
          className={`citation-tooltip citation-tooltip--portal${position ? '' : ' citation-tooltip--measuring'}`}
          style={{
            left: position?.left ?? 0,
            top: position?.top ?? 0,
            maxWidth: position ? `${position.maxWidth}px` : undefined,
          }}
        >
          {text}
        </span>,
        document.body,
      )
    : null

  return (
    <>
      <button
        ref={markerRef}
        type="button"
        className="citation-marker"
        aria-label={`查看引用${marker}`}
        aria-describedby={isOpen ? tooltipId : undefined}
        title={text}
        onMouseEnter={() => setIsHovered(true)}
        onMouseLeave={() => setIsHovered(false)}
        onClick={() => {
          if (interactionMode === 'click') setIsClicked((current) => !current)
        }}
      >
        {marker}
      </button>
      {tooltip}
    </>
  )
}

function renderTextWithCitations(
  text: string,
  citations: readonly QuarterlyContentCitation[] = [],
  interactionMode: CitationInteractionMode = 'hover',
) {
  if (citations.length === 0) return text

  const citationMap = new Map(citations.map((citation) => [citation.marker, citation.text]))
  return text.split(/(\[\d+\]|［\d+］)/g).map((part, index) => {
    const markerMatch = part.match(/(?:\[(\d+)\]|［(\d+)］)/)
    const marker = markerMatch ? `[${markerMatch[1] ?? markerMatch[2]}]` : undefined
    const citationText = marker ? citationMap.get(marker) : undefined
    if (!citationText) return <span key={`${part}-${index}`}>{part}</span>

    return <CitationMarker key={`${part}-${index}`} marker={part} text={citationText} interactionMode={interactionMode} />
  })
}

function renderSegment(
  segment: QuarterlyContentSegment,
  citations: readonly QuarterlyContentCitation[] = [],
  interactionMode: CitationInteractionMode = 'hover',
) {
  const text = renderTextWithCitations(segment.text, citations, interactionMode)
  if (segment.kind === 'strong') return <strong className="font-medium">{text}</strong>
  if (segment.kind === 'quote') return <q>{text}</q>
  if (segment.kind === 'emphasis') return <em>{text}</em>
  return text
}

function paragraphTagForStyle(style: QuarterlyContentParagraph['style']) {
  if (style === 'h1' || style === 'h2') return 'h2'
  if (style === 'h3') return 'h3'
  return 'p'
}

function renderParagraph(
  paragraph: QuarterlyContentParagraph,
  citations: readonly QuarterlyContentCitation[] = [],
  interactionMode: CitationInteractionMode = 'hover',
) {
  const Tag = paragraphTagForStyle(paragraph.style)
  const isHeading = paragraph.style && paragraph.style !== 'normal'

  return (
    <Tag key={paragraph.id} className={isHeading ? 'font-medium leading-body' : undefined}>
      {paragraph.segments.map((segment, index) => (
        <span key={`${paragraph.id}-${index}`}>{renderSegment(segment, citations, interactionMode)}</span>
      ))}
    </Tag>
  )
}

function QuarterlyContent({
  article = quarterlyContentMockArticle,
  borderless = false,
  mobile = false,
  onPrevious,
  onNext,
  className = '',
}: QuarterlyContentProps) {
  const [citationInteractionMode, setCitationInteractionMode] = useState<CitationInteractionMode>(() => (
    typeof window !== 'undefined' && window.innerWidth < 1024 ? 'click' : 'hover'
  ))
  const articleSpacingClass = mobile ? 'p-space-md' : 'p-space-lg'
  const titleMarginClass = mobile ? 'mt-space-md' : 'mt-space-lg'
  const paragraphSpacingClass = mobile ? 'mt-space-md gap-space-md' : 'mt-space-lg gap-space-lg'
  const isReferenceArticle = article.title === '引用來源與備註'
  const articleTextClass = mobile || isReferenceArticle ? 'text-small' : 'text-body'

  useEffect(() => {
    const updateInteractionMode = () => {
      setCitationInteractionMode(window.innerWidth < 1024 ? 'click' : 'hover')
    }
    updateInteractionMode()
    window.addEventListener('resize', updateInteractionMode)
    return () => window.removeEventListener('resize', updateInteractionMode)
  }, [])

  return (
    <section
      aria-label={`文章內容：${article.title}`}
      className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-window-surface font-body text-ink-primary${
        borderless ? '' : ' border-thin border-line-strong'
      } ${className}`}
    >
      <div
        className={article.pdf
          ? 'retroScrollArea min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto'
          : 'retroScrollArea flex min-h-0 min-w-0 flex-1 flex-col overflow-x-hidden overflow-y-auto'}
      >
        {article.pdf ? (
          <>
            <header className={articleSpacingClass}>
              <nav aria-label="文章位置" className="flex min-w-0 flex-wrap items-center gap-space-xs text-caption text-ink-muted">
                {article.breadcrumb.map((item, index) => (
                  <span key={`${item}-${index}`} className="inline-flex min-w-0 max-w-full items-center gap-space-xs break-words">
                    {index > 0 && <span aria-hidden="true">›</span>}
                    <span className="min-w-0 break-words">{item}</span>
                  </span>
                ))}
              </nav>
            </header>
            <QuarterlyPdfViewer
              url={article.pdf.url}
              pageCount={article.pdf.pageCount}
              fileName={article.pdf.fileName}
              mobile={mobile}
            />
          </>
        ) : (
          <article className={`min-w-0 break-words font-body ${articleTextClass} ${articleSpacingClass}`}>
            <nav aria-label="文章位置" className="flex min-w-0 flex-wrap items-center gap-space-xs text-caption text-ink-muted">
              {article.breadcrumb.map((item, index) => (
                <span key={`${item}-${index}`} className="inline-flex min-w-0 max-w-full items-center gap-space-xs break-words">
                  {index > 0 && <span aria-hidden="true">›</span>}
                  <span className="min-w-0 break-words">{item}</span>
                </span>
              ))}
            </nav>

            <h1 className={`${titleMarginClass} break-words text-title font-medium text-ink-primary`}>{article.title}</h1>

            <div className={`${paragraphSpacingClass} grid`}>
              {article.paragraphs.map((paragraph) => renderParagraph(paragraph, article.citations, citationInteractionMode))}
            </div>
          </article>
        )}
      </div>

      <div aria-label="文章翻頁" className="window-footer flex shrink-0 items-center justify-between gap-space-sm bg-window-surface p-space-sm">
        <Button
          label="前一篇"
          icon="chevron-left"
          iconPosition="left"
          iconSize="small"
          padding="footer-hug"
          size="small"
          textSize="small"
          className="window-footer-action !font-body"
          state={article.previous ? 'default' : 'disabled'}
          ariaLabel={article.previous ? `前往${article.previous.title}` : '沒有前一篇文章'}
          onClick={onPrevious}
        />
        <Button
          label="下一篇"
          icon="chevron-right"
          iconPosition="right"
          iconSize="small"
          padding="footer-hug"
          size="small"
          textSize="small"
          className="window-footer-action !font-body"
          state={article.next ? 'default' : 'disabled'}
          ariaLabel={article.next ? `前往${article.next.title}` : '沒有下一篇文章'}
          onClick={onNext}
        />
      </div>
    </section>
  )
}

export default QuarterlyContent
