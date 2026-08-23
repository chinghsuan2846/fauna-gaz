import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing Sanity seed configuration.')
  console.error('Set PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) and SANITY_API_WRITE_TOKEN before running npm run sanity:seed.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false })
const root = fileURLToPath(new URL('..', import.meta.url))
const assetsRoot = join(root, 'public', 'assets', 'editor-icons')

const dialogue = (opening, firstOption, secondOption) => [
  {
    _key: 'intro',
    id: 'intro',
    text: opening,
    options: [
      { _key: 'field-notes', label: firstOption, nextNode: 'field-notes' },
      { _key: 'daily-life', label: secondOption, nextNode: 'daily-life' },
    ],
  },
  {
    _key: 'field-notes',
    id: 'field-notes',
    text: '我會把觀察記錄整理成一篇清楚的報導，讓每個細節都能被看見。',
    options: [{ _key: 'thanks', label: '謝謝你的分享', nextNode: 'closing' }],
  },
  {
    _key: 'daily-life',
    id: 'daily-life',
    text: '每天都有新的事情發生，慢慢觀察就會發現很多有趣的線索。',
    options: [{ _key: 'again', label: '我會再來找你', nextNode: 'closing' }],
  },
  {
    _key: 'closing',
    id: 'closing',
    text: '下次見，別忘了留意身邊那些細小的動物朋友。',
    options: [],
  },
]

const characters = [
  {
    _id: 'seed-character-bird',
    _type: 'character',
    name: '阿雀',
    slug: { _type: 'slug', current: 'demo-bird' },
    species: '台灣綠繡眼',
    role: '編輯2',
    characterType: 'bird',
    assetFile: '阿雀.png',
    imageAlt: '像素風阿雀角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('你好，我是阿雀，最近正在整理森林裡的聲音。', '聊聊田野觀察', '你平常在做什麼？'),
  },
  {
    _id: 'seed-character-cat',
    _type: 'character',
    name: '一號',
    slug: { _type: 'slug', current: 'demo-cat' },
    species: '台灣石虎',
    role: '編輯3',
    characterType: 'cat',
    assetFile: '一號.png',
    imageAlt: '像素風一號角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是一號，正在草地邊追蹤一條很有意思的線索。', '線索是什麼？', '今天順利嗎？'),
  },
  {
    _id: 'seed-character-mouse',
    _type: 'character',
    name: '老莫',
    slug: { _type: 'slug', current: 'demo-mouse' },
    species: '台灣高山田鼠',
    role: '編輯1',
    characterType: 'mouse',
    assetFile: '老莫.png',
    imageAlt: '像素風老莫角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('嗨，我是老莫。我最喜歡的東西大概是身上的這件背心吧。', '為什麼喜歡背心？', '聊聊你的研究吧'),
  },
]

const body = (paragraphs) => paragraphs.map((text, index) => ({
  _key: `body-${index}`,
  _type: 'block',
  style: 'normal',
  markDefs: [],
  children: [{ _key: `span-${index}`, _type: 'span', marks: [], text }],
}))

const issue = {
  _id: 'seed-issue-2026-autumn',
  _type: 'issue',
  title: '2026 秋季號（創刊號）',
  slug: { _type: 'slug', current: '2026-autumn' },
  year: 2026,
  quarter: 'Q3',
}

const categories = [
  { _id: 'seed-category-self-awareness', _type: 'category', title: '專題｜自我意識', slug: { _type: 'slug', current: 'self-awareness' } },
  { _id: 'seed-category-field-notes', _type: 'category', title: '田野筆記', slug: { _type: 'slug', current: 'field-notes' } },
]

const articles = [
  {
    _id: 'seed-article-self-awareness',
    _type: 'article',
    title: '如何證明「自我」的存在？',
    slug: { _type: 'slug', current: 'how-to-prove-the-self' },
    excerpt: '從動物的行為與鏡像測試，重新思考自我意識的邊界。',
    publishedAt: '2026-08-18T00:00:00.000Z',
    issue: { _type: 'reference', _ref: issue._id },
    categories: [{ _type: 'reference', _ref: categories[0]._id }],
    body: body([
      '相傳大多數的人在談論這個話題時，不外乎都會提到笛卡兒。「我思故我在」這句話指出，即使我們懷疑自身的存在，正在懷疑的那個念頭本身，仍然證明了某個正在思考的主體存在。',
      '然而，當我們意識到自身存在的同時，是否也代表了「自我意識」的存在？',
      '如果觀察的對象不是人類，而是一隻海豚、一隻大象，甚至是一隻鳥，我們又該如何判斷牠們是否具有自我意識？',
    ]),
  },
  {
    _id: 'seed-article-field-notes',
    _type: 'article',
    title: '草地邊的觀察筆記',
    slug: { _type: 'slug', current: 'notes-from-the-grassland' },
    excerpt: '一段午後觀察，記下不同物種如何共享同一片草地。',
    publishedAt: '2026-08-19T00:00:00.000Z',
    issue: { _type: 'reference', _ref: issue._id },
    categories: [{ _type: 'reference', _ref: categories[1]._id }],
    body: body([
      '午後的光線穿過樹葉，草地上的動物開始沿著各自熟悉的路徑移動。牠們並不需要交談，卻會以聲音、氣味與距離彼此交換訊息。',
      '把這些細節放在一起看，才會發現一個小小的棲地其實是一座忙碌的城市。',
    ]),
  },
]

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: '聯絡動物公報',
  contactCopy: '如果你有想分享的觀察，歡迎寫信給我們。',
  supportCopy: '也可以請編輯喝杯咖啡，支持下一期季刊。',
  email: 'hello@fauna-gaz.example',
  supportLinkText: '請編輯喝咖啡',
  supportLinkUrl: 'https://example.com/support',
}

const uploadedAssets = new Map()
for (const character of characters) {
  const asset = await client.assets.upload('image', createReadStream(join(assetsRoot, character.assetFile)), {
    filename: character.assetFile,
  })
  uploadedAssets.set(character._id, asset._id)
}

const characterDocuments = characters.map(({ assetFile, imageAlt, ...character }) => ({
  ...character,
  image: {
    _type: 'image',
    asset: { _type: 'reference', _ref: uploadedAssets.get(character._id) },
    alt: imageAlt,
  },
}))

const transaction = client.transaction()
for (const document of [issue, ...categories, ...characterDocuments, ...articles, siteSettings]) {
  transaction.createOrReplace(document)
}

await transaction.commit()
console.log(`Seeded ${characterDocuments.length} characters, ${articles.length} articles, one issue, two categories, and site settings.`)
console.log(`Sanity Studio: https://www.sanity.io/manage/project/${projectId}/dataset/${dataset}`)
