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

export type SanityBodyBlock = {
  _type?: string
  style?: string
  children?: SanityBodySpan[]
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
}

export type SanityDialogueNode = {
  id?: string
  text?: string
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
const EXTENDED_CONTENT_ARTICLE_SLUGS = new Set(['reader-mail', 'references-and-notes'])
const REFERENCE_ARTICLE_SLUGS = new Set(['references-and-notes'])
const CITATION_MARKER_PATTERN = /(?:\[(\d+)\]|［(\d+)］)/
const REFERENCE_INTRO_TEXTS = [
  '本期內容以動物行為學、認知科學與田野觀察的入門資料為起點，並將複雜研究轉寫成容易閱讀的短文。',
  '文中的例子是編輯部為了示範版面而整理的暫時內容，正式刊載前仍需要補上完整引用與核對。',
] as const
const DEFAULT_REFERENCE_TEXTS = [
  '[1] Mildener A, Buchman D, Ragir S, Reiss D (2026) Evidence for mirror self-recognition in beluga whales (Delphinapterus leucas). PLoS One 21(5): e0348287. https://doi.org/10.1371/journal.pone.0348287',
  '[2] D. Reiss, & L. Marino, Mirror self-recognition in the bottlenose dolphin: A case of cognitive convergence, Proc. Natl. Acad. Sci. U.S.A. 98 (10) 5937-5942, https://doi.org/10.1073/pnas.101086398 (2001).',
  '[3] J.M. Plotnik, F.B.M. de Waal, & D. Reiss, Self-recognition in an Asian elephant, Proc. Natl. Acad. Sci. U.S.A. 103 (45) 17053-17057, https://doi.org/10.1073/pnas.0608062103 (2006).',
  '[4] Tricot, M., & Cammaerts, R. (2015). Are ants (Hymenoptera, Formicidae) capable of self recognition ? Journal of science, 5, 521-532.',
  '[5] Prior H, Schwarz A, Güntürkün O (2008) Mirror-Induced Behavior in the Magpie (Pica pica): Evidence of Self-Recognition . PLoS Biol 6(8): e202. https://doi.org/10.1371/journal.pbio.0060202',
  '[6] Soler, M., Colmenero, J. M., Pérez-Contreras, T., & Peralta-Sánchez, J. M. (2020). Replication of the mirror mark test experiment in the magpie (Pica pica) does not provide evidence of self-recognition. Journal of comparative psychology (Washington, D.C. : 1983), 134(4), 363–371. https://doi.org/10.1037/com0000223',
  '[7] Horowitz A. (2017). Smelling themselves: Dogs investigate their own odours longer when modified in an "olfactory mirror" test. Behavioural processes, 143, 17–24. https://doi.org/10.1016/j.beproc.2017.08.001',
  '[8] Gallup, G. G., Jr., & Anderson, J. R. (2020). Self-recognition in animals: Where do we stand 50 years later? Lessons from cleaner wrasse and other species. Psychology of Consciousness: Theory, Research, and Practice, 7(1), 46–58. https://doi.org/10.1037/cns0000206',
] as const

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
  const value = textValue(title)
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
  return referenceTexts(article).filter((text) => !CITATION_MARKER_PATTERN.test(text))
}

function ensureReferenceIntro(texts: readonly string[]) {
  const missingIntro = REFERENCE_INTRO_TEXTS.filter((intro) => !texts.includes(intro))
  return [...missingIntro, ...texts]
}

function isDefaultReferenceIssue(article: SanityArticle) {
  const issueSlug = textValue(article.issue?.slug).toLowerCase()
  const issueTitle = normalizedArticleTitle(textValue(article.issue?.title))
  return issueSlug === '2026-autumn' || (issueTitle.includes('2026') && issueTitle.includes('秋季'))
}

function referenceTexts(article?: SanityArticle | null) {
  if (!article) return []

  const articleTexts = bodyParagraphTexts(article)
  if (articleTexts.length === 0) return []

  const parsedTexts = splitReferenceTexts(articleTexts)
  const hasCompleteDefaultReferences = DEFAULT_REFERENCE_TEXTS.every((reference) => {
    const marker = reference.match(CITATION_MARKER_PATTERN)?.[0]
    return marker ? parsedTexts.some((text) => text.startsWith(marker)) : false
  })

  if (isReferenceArticle(article) && isDefaultReferenceIssue(article) && !hasCompleteDefaultReferences) {
    return [...REFERENCE_INTRO_TEXTS, ...DEFAULT_REFERENCE_TEXTS]
  }

  return isReferenceArticle(article) && isDefaultReferenceIssue(article)
    ? ensureReferenceIntro(parsedTexts)
    : parsedTexts
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
        title: displayArticleTitle(article.title),
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

  return (article.body ?? [])
    .filter((block) => block._type === 'block')
    .map((block, index) => {
      const segments: QuarterlyContentSegment[] = (block.children ?? [])
        .filter((span) => textValue(span.text))
        .map((span) => {
          const kind = block.style === 'blockquote'
            ? 'quote'
            : span.marks?.includes('strong')
              ? 'strong'
              : span.marks?.includes('em')
                ? 'emphasis'
                : 'text'

          return { kind, text: span.text ?? '' }
        })

      return {
        id: `${article._id}-paragraph-${index}`,
        style: (block.style === 'h1' || block.style === 'h2' || block.style === 'h3' ? block.style : 'normal') as QuarterlyContentParagraph['style'],
        segments,
      }
    })
    .filter((paragraph) => paragraph.segments.length > 0)
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
    citations: citationEntries(citationSource),
    previous: previous ? { id: previous._id, title: displayArticleTitle(previous.title) } : null,
    next: next ? { id: next._id, title: displayArticleTitle(next.title) } : null,
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
    previous: previous ? { id: previous._id, title: displayArticleTitle(previous.title) } : null,
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
    options: Array<{ label: string; nextNodeId?: string }>
  }>
}

export function toCharacterDialogue(character: SanityCharacter): CharacterDialogue {
  const nodes = (character.dialogue ?? [])
    .map((node) => ({
      id: textValue(node.id),
      text: textValue(node.text),
      options: (node.options ?? [])
        .map((option) => ({ label: textValue(option.label), nextNodeId: textValue(option.nextNode) || undefined }))
        .filter((option) => option.label),
    }))
    .filter((node) => node.id && node.text)

  return {
    startNodeId: textValue(character.dialogueStart) || nodes[0]?.id || '',
    nodes,
  }
}
