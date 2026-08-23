import type { SanityArticle, SanityCharacter, SanitySiteSettings } from './contentAdapter'

const image = (name: string) => `/assets/editor-icons/${name}.png`

const dialogue = (opening: string, firstOption: string, secondOption: string) => [
  {
    id: 'intro',
    text: opening,
    options: [
      { label: firstOption, nextNode: 'field-notes' },
      { label: secondOption, nextNode: 'daily-life' },
    ],
  },
  {
    id: 'field-notes',
    text: '我會把觀察記錄整理成一篇清楚的報導，讓每個細節都能被看見。',
    options: [{ label: '謝謝你的分享', nextNode: 'closing' }],
  },
  {
    id: 'daily-life',
    text: '每天都有新的事情發生，慢慢觀察就會發現很多有趣的線索。',
    options: [{ label: '我會再來找你', nextNode: 'closing' }],
  },
  {
    id: 'closing',
    text: '下次見，別忘了留意身邊那些細小的動物朋友。',
    options: [],
  },
]

export const demoCharacters: SanityCharacter[] = [
  {
    _id: 'demo-character-bird',
    slug: 'demo-bird',
    name: '阿雀',
    role: '編輯2',
    species: '台灣綠繡眼',
    characterType: 'bird',
    imageUrl: image('阿雀'),
    imageAlt: '像素風阿雀角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('你好，我是阿雀，最近正在整理森林裡的聲音。', '聊聊田野觀察', '你平常在做什麼？'),
  },
  {
    _id: 'demo-character-cat',
    slug: 'demo-cat',
    name: '一號',
    role: '編輯3',
    species: '台灣石虎',
    characterType: 'cat',
    imageUrl: image('一號'),
    imageAlt: '像素風一號角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是一號，正在草地邊追蹤一條很有意思的線索。', '線索是什麼？', '今天順利嗎？'),
  },
  {
    _id: 'demo-character-mouse',
    slug: 'demo-mouse',
    name: '老莫',
    role: '編輯1',
    species: '台灣高山田鼠',
    characterType: 'mouse',
    imageUrl: image('老莫'),
    imageAlt: '像素風老莫角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('嗨，我是老莫。我最喜歡的東西大概是身上的這件背心吧。', '為什麼喜歡背心？', '聊聊你的研究吧'),
  },
]

const articleBody = (paragraphs: string[]) =>
  paragraphs.map((text, index) => ({
    _type: 'block',
    style: 'normal',
    children: [{ text, marks: [] }],
    _key: `demo-block-${index}`,
  }))

export const demoArticles: SanityArticle[] = [
  {
    _id: 'demo-article-self-awareness',
    slug: 'how-to-prove-the-self',
    title: '如何證明「自我」的存在？',
    excerpt: '從動物的行為與鏡像測試，重新思考自我意識的邊界。',
    publishedAt: '2026-08-18T00:00:00.000Z',
    issue: { title: '2026 秋季號（創刊號）', year: 2026, quarter: '秋季號', slug: '2026-autumn' },
    categories: [{ title: '專題｜自我意識', slug: 'self-awareness' }],
    body: articleBody([
      '相傳大多數的人在談論這個話題時，不外乎都會提到笛卡兒。「我思故我在」這句話指出，即使我們懷疑自身的存在，正在懷疑的那個念頭本身，仍然證明了某個正在思考的主體存在。',
      '然而，當我們意識到自身存在的同時，是否也代表了「自我意識」的存在？',
      '如果觀察的對象不是人類，而是一隻海豚、一隻大象，甚至是一隻鳥，我們又該如何判斷牠們是否具有自我意識？',
    ]),
  },
  {
    _id: 'demo-article-field-notes',
    slug: 'notes-from-the-grassland',
    title: '草地邊的觀察筆記',
    excerpt: '一段午後觀察，記下不同物種如何共享同一片草地。',
    publishedAt: '2026-08-19T00:00:00.000Z',
    issue: { title: '2026 秋季號（創刊號）', year: 2026, quarter: '秋季號', slug: '2026-autumn' },
    categories: [{ title: '田野筆記', slug: 'field-notes' }],
    body: articleBody([
      '午後的光線穿過樹葉，草地上的動物開始沿著各自熟悉的路徑移動。牠們並不需要交談，卻會以聲音、氣味與距離彼此交換訊息。',
      '把這些細節放在一起看，才會發現一個小小的棲地其實是一座忙碌的城市。',
    ]),
  },
]

export const demoSiteSettings: SanitySiteSettings = {
  title: '聯絡動物公報',
  contactCopy: '如果你有想分享的觀察，歡迎寫信給我們。',
  supportCopy: '也可以請編輯喝杯咖啡，支持下一期季刊。',
  email: 'hello@fauna-gaz.example',
  supportLinkText: '請編輯喝咖啡',
  supportLinkUrl: '#support',
}
