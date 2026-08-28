import type {
  QuarterlyContentArticle,
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
const REFERENCE_TEXT = [
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

function isExtendedContentArticle(article: Pick<SanityArticle, 'slug' | 'title'>) {
  const slug = textValue(article.slug).toLowerCase()
  const title = normalizedArticleTitle(textValue(article.title))
  return EXTENDED_CONTENT_ARTICLE_SLUGS.has(slug) || title === '讀者回函' || title.includes('引用')
}

function isReferenceArticle(article: Pick<SanityArticle, 'slug' | 'title'>) {
  const slug = textValue(article.slug).toLowerCase()
  return REFERENCE_ARTICLE_SLUGS.has(slug) || normalizedArticleTitle(textValue(article.title)).includes('引用')
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
        title: article.title,
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
    return REFERENCE_TEXT.map((text, index) => ({
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
        segments,
      }
    })
    .filter((paragraph) => paragraph.segments.length > 0)
}

export function toQuarterlyContentArticle(
  article: SanityArticle,
  previous?: SanityArticle | null,
  next?: SanityArticle | null,
): QuarterlyContentArticle {
  const year = String(article.issue?.year ?? '')
  const quarter = issueQuarterLabel(article)

  return {
    id: article._id,
    breadcrumb: [year, quarter, article.title].filter(Boolean),
    title: article.title,
    paragraphs: toParagraphs(article),
    previous: previous ? { id: previous._id, title: previous.title } : null,
    next: next ? { id: next._id, title: next.title } : null,
  }
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
      fileName: pdf.fileName,
    },
    previous: previous ? { id: previous._id, title: previous.title } : null,
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
