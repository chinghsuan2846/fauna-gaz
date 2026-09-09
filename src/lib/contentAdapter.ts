import type {
  QuarterlyContentArticle,
  QuarterlyContentCitation,
  QuarterlyContentParagraph,
  QuarterlyContentSegment,
} from '../stories/component/QuarterlyContent'
import type {
  QuarterlySidebarArticle,
  QuarterlySidebarYear,
} from '../stories/component/QuarterlySidebar'

type MutableSidebarGroup = {
  id: string
  label: string
  articles: QuarterlySidebarArticle[]
}

type MutableSidebarQuarter = {
  id: string
  label: string
  groups: MutableSidebarGroup[]
}

export type SanityBodySpan = {
  text?: string
  marks?: string[]
}

export type SanityBodyMarkDef = {
  _key?: string
  _type?: string
  href?: string
}

export type SanityBodyBlock = {
  _type?: string
  style?: string
  children?: SanityBodySpan[]
  markDefs?: SanityBodyMarkDef[]
}

export type SanityArticle = {
  _id: string
  slug: string
  title: string
  excerpt?: string
  body?: SanityBodyBlock[]
  publishedAt?: string
  coverImage?: unknown
  issue?: {
    title?: string
    year?: string | number
    quarter?: string
    slug?: string
  }
  categories?: Array<{
    title: string
    slug: string
  }>
}

export type SanityQuarterlyPdf = {
  _id: string
  slug: string
  title: string
  pageCount?: number
  fileUrl?: string
  fileName?: string
  issue?: {
    title?: string
    year?: string | number
    quarter?: string
    slug?: string
  }
}

export type SanitySiteSettings = {
  title?: string
  contactCopy?: string
  supportCopy?: string
  email?: string
  supportLinkText?: string
  supportLinkUrl?: string
}

export type SanityDialogueOption = {
  label?: string
  nextNode?: string
  choiceId?: string
  requiresAllChoices?: boolean
}

export type SanityDialogueNode = {
  id?: string
  text?: string
  choiceGroup?: string
  options?: SanityDialogueOption[]
}

export type SanityCharacter = {
  _id: string
  slug: string
  name: string
  role: string
  species: string
  characterType: 'bird' | 'cat' | 'mouse'
  imageUrl?: string
  imageAlt?: string
  dialogueStart?: string
  dialogue?: SanityDialogueNode[]
}

export type ContactInfo = {
  title: string
  contactCopy: string
  supportCopy: string
  email: string
  supportLinkText: string
  supportLinkUrl: string
}

function textValue(value: unknown) {
  return typeof value === 'string' ? value.trim() : ''
}

const QUARTERLY_PDF_DISPLAY_TITLE = '本期季刊 PDF'
const EXTENDED_CONTENT_CATEGORY = { title: '延伸內容', slug: 'extended-content' } as const
const HIDDEN_QUARTERLY_ARTICLE_SLUGS = new Set(['isbn', 'chelseas-diet'])
const EXTENDED_CONTENT_ARTICLE_SLUGS = new Set(['reader-mail', 'references', 'references-and-notes'])
const REFERENCE_ARTICLE_SLUGS = new Set(['references', 'references-and-notes'])
const CITATION_MARKER_PATTERN = /(?:\[(\d+)\]|［(\d+)］)/
const READER_MAIL_FORM_URL = 'https://forms.gle/dkKFvMX3KCLy7EnB6'

function quarterlyPdfDisplayTitle(pdf: Pick<SanityQuarterlyPdf, 'title'>) {
  const title = textValue(pdf.title)
  return title.replace(/\s+/g, '').toLowerCase() === '完整pdf' ? QUARTERLY_PDF_DISPLAY_TITLE : title
}

function normalizedArticleTitle(title: string) {
  return title.replace(/[’‘]/g, "'").replace(/\s+/g, '').toLowerCase()
}

export function isQuarterlyArticleHidden(article: Pick<SanityArticle, 'slug'> & Partial<Pick<SanityArticle, 'title'>>) {
  const slug = textValue(article.slug).toLowerCase()
  const title = normalizedArticleTitle(textValue(article.title))
  return HIDDEN_QUARTERLY_ARTICLE_SLUGS.has(slug) || title === 'isbn' || title === "chelsea'sdiet"
}

export function displayArticleTitle(title: string) {
  return textValue(title)
}

export function displaySidebarArticleTitle(title: string) {
  const value = displayArticleTitle(title)
  return value.replace(/\s*(?:（[^（）]*）|\([^()]*\))\s*$/, '').trim() || value
}

function isExtendedContentArticle(article: Pick<SanityArticle, 'slug' | 'title'>) {
  const slug = textValue(article.slug).toLowerCase()
  const title = normalizedArticleTitle(textValue(article.title))
  return EXTENDED_CONTENT_ARTICLE_SLUGS.has(slug) || title === '讀者回函' || title.includes('引用')
}

function isReferenceArticle(article: Pick<SanityArticle, 'slug' | 'title'>) {
  const slug = textValue(article.slug).toLowerCase()
  return REFERENCE_ARTICLE_SLUGS.has(slug) || normalizedArticleTitle(textValue(article.title)).includes('引用')
}

function isReaderMailArticle(article: Pick<SanityArticle, 'slug' | 'title'>) {
  return textValue(article.slug).toLowerCase() === 'reader-mail' || normalizedArticleTitle(textValue(article.title)) === '讀者回函'
}

function sameIssue(left: Pick<SanityArticle, 'issue'>, right: Pick<SanityArticle, 'issue'>) {
  if (left.issue?.slug && right.issue?.slug) return left.issue.slug === right.issue.slug
  return String(left.issue?.year ?? '') === String(right.issue?.year ?? '') && left.issue?.quarter === right.issue?.quarter
}

export function findReferenceArticle(
  articles: readonly SanityArticle[],
  article: Pick<SanityArticle, 'issue'>,
) {
  const references = articles.filter((candidate) => isReferenceArticle(candidate))
  return references.find((candidate) => sameIssue(candidate, article)) ?? (references.length === 1 ? references[0] : undefined)
}

function issueQuarterLabel(article: Pick<SanityArticle, 'issue'>) {
  const year = String(article.issue?.year ?? '')
  const title = textValue(article.issue?.title)

  if (title && year && title.startsWith(`${year} `)) return title.slice(year.length + 1)
  return title || textValue(article.issue?.quarter) || '未分類季度'
}

function issueId(article: Pick<SanityArticle, 'issue'>, year: string) {
  return textValue(article.issue?.slug) || `${year}-${textValue(article.issue?.quarter) || 'uncategorized'}`
}

function categoryGroups(article: SanityArticle) {
  if (isExtendedContentArticle(article)) return [EXTENDED_CONTENT_CATEGORY]

  return article.categories?.length
    ? article.categories
    : [{ title: '未分類', slug: 'uncategorized' }]
}

function bodyParagraphTexts(article: SanityArticle) {
  return (article.body ?? [])
    .filter((block) => block._type === 'block')
    .map((block) => (block.children ?? []).map((span) => span.text ?? '').join('').trim())
    .filter(Boolean)
}

function splitReferenceTexts(texts: readonly string[]) {
  return texts.flatMap((text) => text.split(/(?=(?:\[\d+\]|［\d+］))/g).map((part) => part.trim()).filter(Boolean))
}

function referencePageTexts(article: SanityArticle) {
  return referenceTexts(article)
}

function referenceTexts(article?: SanityArticle | null) {
  if (!article) return []

  const articleTexts = bodyParagraphTexts(article)
  if (articleTexts.length === 0) return []

  return splitReferenceTexts(articleTexts)
}

function citationEntries(article?: SanityArticle | null): readonly QuarterlyContentCitation[] {
  return referenceTexts(article).flatMap((text) => {
    const markerMatch = text.match(CITATION_MARKER_PATTERN)
    const number = markerMatch?.[1] ?? markerMatch?.[2]
    return number ? [{ marker: `[${number}]`, text }] : []
  })
}

export function toQuarterlySidebarData(
  articles: readonly SanityArticle[],
  quarterlyPdfs: readonly SanityQuarterlyPdf[] = [],
): readonly QuarterlySidebarYear[] {
  const years = new Map<
    string,
    {
      id: string
      label: string
      quarters: MutableSidebarQuarter[]
      quarterMap: Map<string, MutableSidebarQuarter>
    }
  >()

  for (const article of articles) {
    if (isQuarterlyArticleHidden(article)) continue

    const year = String(article.issue?.year ?? '未分類年份')
    const yearEntry = years.get(year) ?? {
      id: year,
      label: year,
      quarters: [],
      quarterMap: new Map<string, MutableSidebarQuarter>(),
    }
    years.set(year, yearEntry)

    const quarterId = issueId(article, year)
    const quarter = yearEntry.quarterMap.get(quarterId) ?? {
      id: quarterId,
      label: issueQuarterLabel(article),
      groups: [],
    }
    if (!yearEntry.quarterMap.has(quarterId)) {
      yearEntry.quarterMap.set(quarterId, quarter)
      yearEntry.quarters.push(quarter)
    }

    for (const category of categoryGroups(article)) {
      const groupId = category.slug || `category-${category.title}`
      const group: MutableSidebarGroup = quarter.groups.find((entry) => entry.id === groupId) ?? {
        id: groupId,
        label: category.title,
        articles: [],
      }
      if (!quarter.groups.includes(group)) quarter.groups.push(group)

      const sidebarArticle: QuarterlySidebarArticle = {
        id: article._id,
        title: displaySidebarArticleTitle(article.title),
      }
      if (!group.articles.some((entry) => entry.id === sidebarArticle.id)) group.articles.push(sidebarArticle)
    }
  }

  for (const pdf of quarterlyPdfs) {
    if (!pdf.fileUrl || !pdf.pageCount) continue

    const year = String(pdf.issue?.year ?? '')
    const quarterId = issueId({ issue: pdf.issue }, year)
    const quarter = years.get(year)?.quarterMap.get(quarterId)
    if (!quarter) continue

    const extendedContentGroup = quarter.groups.find((group) => group.id === EXTENDED_CONTENT_CATEGORY.slug) ?? {
      id: EXTENDED_CONTENT_CATEGORY.slug,
      label: EXTENDED_CONTENT_CATEGORY.title,
      articles: [],
    }
    if (!quarter.groups.includes(extendedContentGroup)) quarter.groups.push(extendedContentGroup)
    if (extendedContentGroup.articles.some((article) => article.id === pdf._id)) continue

    extendedContentGroup.articles.push({
      id: pdf._id,
      title: quarterlyPdfDisplayTitle(pdf),
      kind: 'pdf',
      pdfUrl: pdf.fileUrl,
      pageCount: pdf.pageCount,
    })
  }

  return Array.from(years.values()).map(({ id, label, quarters }) => ({ id, label, quarters }))
}

function toParagraphs(article: SanityArticle): readonly QuarterlyContentParagraph[] {
  if (isReferenceArticle(article)) {
    return referencePageTexts(article).map((text, index) => ({
      id: `${article._id}-reference-${index}`,
      segments: [{ kind: 'text', text }],
    }))
  }

  const paragraphs = (article.body ?? [])
    .filter((block) => block._type === 'block')
    .map((block, index) => {
      const segments: QuarterlyContentSegment[] = (block.children ?? [])
        .filter((span) => textValue(span.text))
        .map((span) => {
          const linkMark = (span.marks ?? [])
            .map((mark) => block.markDefs?.find((markDef) => markDef._key === mark))
            .find((markDef) => markDef?._type === 'link' && textValue(markDef.href))
          const kind = block.style === 'blockquote'
            ? 'quote'
            : span.marks?.includes('strong')
              ? 'strong'
              : span.marks?.includes('em')
                ? 'emphasis'
                : 'text'

          return {
            kind: linkMark ? 'link' : kind,
            text: span.text ?? '',
            ...(linkMark?.href ? { href: linkMark.href } : {}),
          }
        })

      return {
        id: `${article._id}-paragraph-${index}`,
        style: (block.style === 'h1' || block.style === 'h2' || block.style === 'h3' ? block.style : 'normal') as QuarterlyContentParagraph['style'],
        segments,
      }
    })
    .filter((paragraph) => paragraph.segments.length > 0)

  if (!isReaderMailArticle(article)) return paragraphs

  const hasReaderMailFormLink = paragraphs.some((paragraph) => paragraph.segments.some((segment) => (
    segment.href === READER_MAIL_FORM_URL || segment.text.includes(READER_MAIL_FORM_URL)
  )))
  if (hasReaderMailFormLink) return paragraphs

  return [
    ...paragraphs,
    {
      id: `${article._id}-reader-mail-form`,
      segments: [
        { kind: 'text', text: '讀者回函表單：' },
        { kind: 'link', text: READER_MAIL_FORM_URL, href: READER_MAIL_FORM_URL },
      ],
    },
  ]
}

export function toQuarterlyContentArticle(
  article: SanityArticle,
  previous?: SanityArticle | null,
  next?: SanityArticle | null,
  referenceArticle?: SanityArticle | null,
): QuarterlyContentArticle {
  const year = String(article.issue?.year ?? '')
  const quarter = issueQuarterLabel(article)
  const citationSource = referenceArticle ?? (isReferenceArticle(article) ? article : undefined)

  return {
    id: article._id,
    breadcrumb: [year, quarter, displayArticleTitle(article.title)].filter(Boolean),
    title: displayArticleTitle(article.title),
    paragraphs: toParagraphs(article),
    citations: isReferenceArticle(article) ? [] : citationEntries(citationSource),
    previous: previous ? { id: previous._id, title: displaySidebarArticleTitle(previous.title) } : null,
    next: next ? { id: next._id, title: displaySidebarArticleTitle(next.title) } : null,
  }
}

function quarterlyPdfFileName(pdf: SanityQuarterlyPdf) {
  const issueTitle = textValue(pdf.issue?.title) || [pdf.issue?.year, issueQuarterLabel({ issue: pdf.issue })].filter(Boolean).join('')
  const title = quarterlyPdfDisplayTitle(pdf).replace(/\.pdf$/i, '')
  const safePart = (value: string) => value.replace(/\s+/g, '').replace(/[\\/:*?"<>|]+/g, '-')
  const parts = [safePart(issueTitle), safePart(title)].filter(Boolean)
  return parts.length > 0 ? `${parts.join('-')}.pdf` : pdf.fileName
}

export function toQuarterlyPdfContentArticle(
  pdf: SanityQuarterlyPdf,
  previous?: SanityArticle | null,
): QuarterlyContentArticle {
  const year = String(pdf.issue?.year ?? '')
  const quarter = issueQuarterLabel({ issue: pdf.issue })
  const title = quarterlyPdfDisplayTitle(pdf)

  return {
    id: pdf._id,
    breadcrumb: [year, quarter, title].filter(Boolean),
    title,
    paragraphs: [],
    pdf: {
      url: pdf.fileUrl ?? '',
      pageCount: pdf.pageCount ?? 1,
      fileName: quarterlyPdfFileName(pdf) || pdf.fileName,
    },
    previous: previous ? { id: previous._id, title: displaySidebarArticleTitle(previous.title) } : null,
    next: null,
  }
}

export function toContactInfo(settings?: SanitySiteSettings | null): ContactInfo | null {
  if (!settings) return null

  const contact: ContactInfo = {
    title: textValue(settings.title),
    contactCopy: textValue(settings.contactCopy),
    supportCopy: textValue(settings.supportCopy),
    email: textValue(settings.email),
    supportLinkText: textValue(settings.supportLinkText),
    supportLinkUrl: textValue(settings.supportLinkUrl),
  }

  return Object.values(contact).every(Boolean) ? contact : null
}

export type CharacterDialogue = {
  startNodeId: string
  nodes: Array<{
    id: string
    text: string
    choiceGroupId?: string
    options: Array<{
      label: string
      nextNodeId?: string
      choiceId?: string
      requiresAllChoices?: boolean
    }>
  }>
}

export function toCharacterDialogue(character: SanityCharacter): CharacterDialogue {
  const nodes = (character.dialogue ?? [])
    .map((node) => ({
      id: textValue(node.id),
      text: textValue(node.text),
      choiceGroupId: textValue(node.choiceGroup) || undefined,
      options: (node.options ?? [])
        .map((option) => ({
          label: textValue(option.label),
          nextNodeId: textValue(option.nextNode) || undefined,
          choiceId: textValue(option.choiceId) || undefined,
          requiresAllChoices: option.requiresAllChoices === true,
        }))
        .filter((option) => option.label),
    }))
    .filter((node) => node.id && node.text)

  return {
    startNodeId: textValue(character.dialogueStart) || nodes[0]?.id || '',
    nodes,
  }
}
