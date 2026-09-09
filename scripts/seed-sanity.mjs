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

const dialogue = (
  opening,
  firstOption,
  secondOption,
  firstResponse = '我會把觀察記錄整理成一篇清楚的報導，讓每個細節都能被看見。',
  secondResponse = '每天都有新的事情發生，慢慢觀察就會發現很多有趣的線索。',
  closingResponse = '下次見，別忘了留意身邊那些細小的動物朋友。',
) => [
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
    text: firstResponse,
    options: [{ _key: 'thanks', label: '謝謝你的分享', nextNode: 'closing' }],
  },
  {
    _key: 'daily-life',
    id: 'daily-life',
    text: secondResponse,
    options: [{ _key: 'again', label: '我會再來找你', nextNode: 'closing' }],
  },
  {
    _key: 'closing',
    id: 'closing',
    text: closingResponse,
    options: [],
  },
]

const characters = [
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
    dialogue: [
      {
        _key: 'intro',
        id: 'intro',
        text: '你們好，我是老莫。',
        options: [{ _key: 'dislike', label: '你最喜歡什麼東西呢？', nextNode: 'fav' }],
      },
      {
        _key: 'fav',
        id: 'fav',
        text: '大概是身上的這件背心吧，這是我媽媽過世前織給我的。',
        options: [{ _key: 'dislike', label: '那你有討厭的東西嗎？', nextNode: 'dislike' }],
      },
      {
        _key: 'dislike',
        id: 'dislike',
        text: '黃鼠狼！一群奸詐的鼠輩！',
        options: [{ _key: 'word-choice', label: '但是黃鼠狼不是老鼠，你才是', nextNode: 'word-choice' }],
      },
      {
        _key: 'word-choice',
        id: 'word-choice',
        text: '你說什麼？',
        options: [
          { _key: 'peanut', label: '算了...' },
          { _key: 'peanut-story', label: '你背上的花生是怎麼來的？', nextNode: 'peanut' },
        ],
      },
      {
        _key: 'peanut',
        id: 'peanut',
        text: '這是來自一位我西方好友的贈禮，去年可是我的兩歲大壽呢！這真是好東西，可不是嗎？我在家裡可從沒見過的好東西！',
        choiceGroup: 'lao-mo-peanut',
        options: [
          { _key: 'peanut-memory', label: '你不會想吃掉它嗎？', nextNode: 'peanut-memory', choiceId: 'eat' },
          { _key: 'taste', label: '你沒有吃過花生嗎？', nextNode: 'living-area', choiceId: 'taste' },
          { _key: 'age', label: '你很老了嗎？', nextNode: 'age', choiceId: 'age' },
        ],
      },
      {
        _key: 'peanut-memory',
        id: 'peanut-memory',
        text: '什麼？吃它？喔，不不不，我想我不會吃它的。這可是珍貴的回憶啊！',
        choiceGroup: 'lao-mo-peanut',
        options: [
          { _key: 'taste', label: '你沒有吃過花生嗎？', nextNode: 'living-area', choiceId: 'taste' },
          { _key: 'age', label: '你很老了嗎？', nextNode: 'age', choiceId: 'age' },
          { _key: 'bye', label: '再見', nextNode: 'bye', requiresAllChoices: true },
        ],
      },
      {
        _key: 'living-area',
        id: 'living-area',
        text: '是的，我可從來沒在我們山上看過呢！',
        choiceGroup: 'lao-mo-peanut',
        options: [
          { _key: 'eat', label: '你不會想吃掉它嗎？', nextNode: 'peanut-memory', choiceId: 'eat' },
          { _key: 'age', label: '你很老了嗎？', nextNode: 'age', choiceId: 'age' },
          { _key: 'bye', label: '再見', nextNode: 'bye', requiresAllChoices: true },
        ],
      },
      {
        _key: 'age',
        id: 'age',
        text: '喔...',
        choiceGroup: 'lao-mo-peanut',
        options: [
          { _key: 'taste', label: '你沒有吃過花生嗎？', nextNode: 'living-area', choiceId: 'taste' },
          { _key: 'eat', label: '你不會想吃掉它嗎？', nextNode: 'peanut-memory', choiceId: 'eat' },
          { _key: 'bye', label: '再見', nextNode: 'bye', requiresAllChoices: true },
        ],
      },
      {
        _key: 'bye',
        id: 'bye',
        text: '下次見！',
        options: [],
      },
    ],
  },
  {
    _id: 'seed-character-raven',
    _type: 'character',
    name: 'R先生',
    slug: { _type: 'slug', current: 'demo-raven' },
    species: '渡鴉',
    role: '編輯2',
    characterType: 'bird',
    assetFile: 'R先生.png',
    imageAlt: '像素風 R 先生角色插圖',
    dialogueStart: 'intro',
    dialogue: [
      {
        _key: 'intro',
        id: 'intro',
        text: '您撥的電話將轉接到語音信箱，嘟聲後開始計費，如不留言請掛斷，快速留言請按兩次井字鍵。',
        options: [{ _key: 'repeat', label: '##', nextNode: '##' }],
      },
      {
        _key: 'repeat',
        id: '##',
        text: '您撥的電話將轉接到語音信箱，嘟聲後開始計費，如不留言請掛斷，快速留言請按兩次井字鍵。',
        options: [
          { _key: 'repeat', label: '##', nextNode: '##' },
          { _key: 'bye', label: '...', nextNode: 'bye' },
        ],
      },
      {
        _key: 'bye',
        id: 'bye',
        text: '您撥的電話未開機，請稍候再撥。',
        options: [],
      },
    ],
  },
  {
    _id: 'seed-character-bird',
    _type: 'character',
    name: '阿雀',
    slug: { _type: 'slug', current: 'demo-sparrow' },
    species: '家麻雀',
    role: '專欄作家',
    characterType: 'bird',
    assetFile: '阿雀.png',
    imageAlt: '像素風阿雀角色插圖',
    dialogueStart: 'intro',
    dialogue: [
      {
        _key: 'intro',
        id: 'intro',
        text: '真希望我是一隻公鳥，這樣我的羽毛就會更漂亮了！',
        options: [{ _key: 'feathers', label: '為什麼想要公鳥的羽毛？', nextNode: 'feathers' }],
      },
      {
        _key: 'feathers',
        id: 'feathers',
        text: '哦，不知道在食譜中加入一點點公鳥的羽毛會不會讓我更漂亮呢？',
        options: [{ _key: 'recipe', label: '你會把整隻公鳥加進去嗎？', nextNode: 'recipe' }],
      },
      {
        _key: 'recipe',
        id: 'recipe',
        text: '不，我當然不會整隻加進去！當然，除非那是能讓我更漂亮的配方。不過那應該不可能，對吧？',
        options: [{ _key: 'crown', label: '那你的花冠呢？', nextNode: 'crown' }],
      },
      {
        _key: 'crown',
        id: 'crown',
        text: '我的花冠是我根據四季變換的，很好看吧！我可真是一隻漂亮的小麻雀！',
        options: [{ _key: 'whole-bird', label: '加入公鳥會讓你長出他的羽毛嗎？', nextNode: 'whole-bird' }],
      },
      {
        _key: 'whole-bird',
        id: 'whole-bird',
        text: '話說，妳覺得在食譜加入一整隻公鳥會讓我長出他的羽毛嗎？',
        options: [{ _key: 'closing', label: '你說完了嗎？', nextNode: 'closing' }],
      },
      {
        _key: 'closing',
        id: 'closing',
        text: '嗯？為什麼不說話了？難道不會嗎？',
        options: [],
      },
    ],
  },
  {
    _id: 'seed-character-cat',
    _type: 'character',
    name: '四月',
    slug: { _type: 'slug', current: 'demo-cat-april' },
    species: '家貓',
    role: '貓咪',
    characterType: 'cat',
    assetFile: '一號.png',
    imageAlt: '像素風四月角色插圖',
    dialogueStart: 'intro',
    dialogue: [
      {
        _key: 'intro',
        id: 'intro',
        text: '喵',
        options: [
          { _key: 'field-notes', label: '你好呀', nextNode: 'meow' },
          { _key: 'speak', label: '你會說話嗎？', nextNode: 'speak' },
          { _key: 'weather', label: '今天天氣真好', nextNode: 'weather' },
        ],
      },
      {
        _key: 'meow',
        id: 'meow',
        text: '喵',
        options: [
          { _key: 'weather', label: '今天天氣真好', nextNode: 'weather' },
          { _key: 'speak', label: '你會說話嗎？', nextNode: 'speak' },
        ],
      },
      {
        _key: 'speak',
        id: 'speak',
        text: '喵',
        options: [
          { _key: 'weather', label: '今天天氣真好', nextNode: 'weather' },
          { _key: 'bye', label: '再見', nextNode: 'bye' },
        ],
      },
      {
        _key: 'weather',
        id: 'weather',
        text: '喵',
        options: [
          { _key: 'speak', label: '你會說話嗎？', nextNode: 'speak' },
          { _key: 'bye', label: '再見', nextNode: 'bye' },
        ],
      },
      {
        _key: 'bye',
        id: 'bye',
        text: '再見',
        options: [{ _key: 'question', label: '？', nextNode: '？' }],
      },
      {
        _key: 'question',
        id: '？',
        text: '喵',
        options: [],
      },
    ],
  },
  {
    _id: 'seed-character-cat-fifteen',
    _type: 'character',
    name: '一五',
    slug: { _type: 'slug', current: 'demo-cat-fifteen' },
    species: '家貓',
    role: '貓咪',
    characterType: 'cat',
    assetFile: '二號.png',
    imageAlt: '像素風一五角色插圖',
    dialogueStart: 'intro',
    dialogue: [
      {
        _key: 'meow',
        id: 'meow',
        text: '喵！',
        options: [
          { _key: 'weather', label: '今天天氣真好', nextNode: 'weather' },
          { _key: 'speak', label: '你會說話嗎？', nextNode: 'speak' },
        ],
      },
      {
        _key: 'speak',
        id: 'speak',
        text: '喵喵！',
        options: [
          { _key: 'weather', label: '今天天氣真好', nextNode: 'weather' },
          { _key: 'bye', label: '再見', nextNode: 'bye' },
        ],
      },
      {
        _key: 'weather',
        id: 'weather',
        text: '喵喵喵！',
        options: [
          { _key: 'speak', label: '你會說話嗎？', nextNode: 'speak' },
          { _key: 'bye', label: '再見', nextNode: 'bye' },
        ],
      },
      {
        _key: 'bye',
        id: 'bye',
        text: '喵嗷',
        options: [],
      },
    ],
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
