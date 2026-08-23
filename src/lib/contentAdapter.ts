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
  return article.categories?.length
    ? article.categories
    : [{ title: '未分類', slug: 'uncategorized' }]
}

export function toQuarterlySidebarData(articles: readonly SanityArticle[]): readonly QuarterlySidebarYear[] {
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

  return Array.from(years.values()).map(({ id, label, quarters }) => ({ id, label, quarters }))
}

function toParagraphs(article: SanityArticle): readonly QuarterlyContentParagraph[] {
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
