import type { ButtonProps } from './Button'
import { Button } from './Button'

export type QuarterlyContentSegmentKind = 'text' | 'strong' | 'quote' | 'emphasis'

export type QuarterlyContentSegment = {
  kind?: QuarterlyContentSegmentKind
  text: string
}

export type QuarterlyContentParagraph = {
  id: string
  segments: readonly QuarterlyContentSegment[]
}

export type QuarterlyContentNavigationItem = {
  id: string
  title: string
}

export type QuarterlyContentArticle = {
  id: string
  breadcrumb: readonly string[]
  title: string
  paragraphs: readonly QuarterlyContentParagraph[]
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

function renderSegment(segment: QuarterlyContentSegment) {
  if (segment.kind === 'strong') return <strong className="font-medium">{segment.text}</strong>
  if (segment.kind === 'quote') return <q>{segment.text}</q>
  if (segment.kind === 'emphasis') return <em>{segment.text}</em>
  return segment.text
}

function QuarterlyContent({
  article = quarterlyContentMockArticle,
  borderless = false,
  mobile = false,
  onPrevious,
  onNext,
  className = '',
}: QuarterlyContentProps) {
  const articleSpacingClass = mobile ? 'p-space-md' : 'p-space-lg'
  const titleMarginClass = mobile ? 'mt-space-md' : 'mt-space-lg'
  const paragraphSpacingClass = mobile ? 'mt-space-md gap-space-md' : 'mt-space-lg gap-space-lg'

  return (
    <section
      aria-label={`文章內容：${article.title}`}
      className={`flex h-full min-h-0 min-w-0 flex-col overflow-hidden bg-window-surface font-body text-ink-primary${
        borderless ? '' : ' border-thin border-line-strong'
      } ${className}`}
    >
      <div className="retroScrollArea min-h-0 min-w-0 flex-1 overflow-x-hidden overflow-y-auto">
        <article className={`min-w-0 break-words font-body text-body ${articleSpacingClass}`}>
          <nav aria-label="文章位置" className="flex min-w-0 flex-wrap items-center gap-space-xs text-caption text-ink-muted">
            {article.breadcrumb.map((item, index) => (
              <span key={`${item}-${index}`} className="inline-flex min-w-0 max-w-full items-center gap-space-xs break-words">
                {index > 0 && <span aria-hidden="true">›</span>}
                <span className="min-w-0 break-words">{item}</span>
              </span>
            ))}
          </nav>

          <h1 className={`${titleMarginClass} break-words text-title font-regular text-ink-primary`}>{article.title}</h1>

          <div className={`${paragraphSpacingClass} grid`}>
            {article.paragraphs.map((paragraph) => (
              <p key={paragraph.id}>{paragraph.segments.map((segment, index) => <span key={`${paragraph.id}-${index}`}>{renderSegment(segment)}</span>)}</p>
            ))}
          </div>
        </article>
      </div>

      <div aria-label="文章翻頁" className="window-footer flex shrink-0 items-center justify-between gap-space-sm bg-window-surface p-space-sm">
        <Button
          label="前一篇"
          icon="chevron-left"
          iconPosition="left"
          iconSize="small"
          padding="footer"
          size="small"
          textSize="small"
          className="!font-body"
          state={article.previous ? 'default' : 'disabled'}
          ariaLabel={article.previous ? `前往${article.previous.title}` : '沒有前一篇文章'}
          onClick={onPrevious}
        />
        <Button
          label="下一篇"
          icon="chevron-right"
          iconPosition="right"
          iconSize="small"
          padding="footer"
          size="small"
          textSize="small"
          className="!font-body"
          state={article.next ? 'default' : 'disabled'}
          ariaLabel={article.next ? `前往${article.next.title}` : '沒有下一篇文章'}
          onClick={onNext}
        />
      </div>
    </section>
  )
}

export default QuarterlyContent
