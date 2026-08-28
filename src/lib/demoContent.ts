import type { SanityArticle, SanityCharacter, SanitySiteSettings } from './contentAdapter'

const image = (name: string) => `/assets/editor-icons/${name}.png`

const dialogue = (
  opening: string,
  firstOption: string,
  secondOption: string,
  firstResponse = '我會把觀察記錄整理成一篇清楚的報導，讓每個細節都能被看見。',
  secondResponse = '每天都有新的事情發生，慢慢觀察就會發現很多有趣的線索。',
  closingResponse = '下次見，別忘了留意身邊那些細小的動物朋友。',
) => [
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
    text: firstResponse,
    options: [{ label: '謝謝你的分享', nextNode: 'closing' }],
  },
  {
    id: 'daily-life',
    text: secondResponse,
    options: [{ label: '我會再來找你', nextNode: 'closing' }],
  },
  {
    id: 'closing',
    text: closingResponse,
    options: [],
  },
]

export const demoCharacters: SanityCharacter[] = [
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
    dialogue: [
      {
        id: 'intro',
        text: '大家好，我是老莫。我最喜歡的東西大概是身上的這件背心吧，這是我媽媽過世前織給我的。',
        options: [{ label: '那你最討厭什麼？', nextNode: 'dislike' }],
      },
      {
        id: 'dislike',
        text: '最討厭的東西？黃鼠狼！一群奸詐的鼠輩！',
        options: [{ label: '你不該這樣稱呼牠們嗎？', nextNode: 'word-choice' }],
      },
      {
        id: 'word-choice',
        text: '什麼？我不應該用什麼這個詞？妳說話可得大聲點親愛的，真可憐，是沒能吃上什麼飯嗎？',
        options: [{ label: '那你背上的花生是怎麼回事？', nextNode: 'peanut' }],
      },
      {
        id: 'peanut',
        text: '喔？妳問我背上這顆花生？是的！這是來自一位我西方好友的贈禮，去年可是我的兩歲大壽呢！',
        options: [{ label: '你真的不會吃掉它嗎？', nextNode: 'peanut-memory' }],
      },
      {
        id: 'peanut-memory',
        text: '這真是好東西，可不是嗎？我在家裡可從沒見過的好東西！什麼？吃它？喔，不不不，我想我不會吃它的。',
        options: [{ label: '為什麼不吃？', nextNode: 'closing' }],
      },
      {
        id: 'closing',
        text: '這可是珍貴的回憶啊！',
        options: [],
      },
    ],
  },
  {
    _id: 'demo-character-raven',
    slug: 'demo-raven',
    name: 'R先生',
    role: '編輯2',
    species: '渡鴉',
    characterType: 'bird',
    imageUrl: image('R先生'),
    imageAlt: '像素風 R 先生角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue(
      '我沒有什麼好說的。',
      '你確定嗎？',
      '那我先不打擾了。',
      '……嗯。',
      '再見。',
      '就這樣。',
    ),
  },
  {
    _id: 'demo-character-sparrow',
    slug: 'demo-sparrow',
    name: '阿雀',
    role: '專欄作家',
    species: '家麻雀',
    characterType: 'bird',
    imageUrl: image('阿雀'),
    imageAlt: '像素風阿雀角色插圖',
    dialogueStart: 'intro',
    dialogue: [
      {
        id: 'intro',
        text: '真希望我是一隻公鳥，這樣我的羽毛就會更漂亮了！',
        options: [{ label: '為什麼想要公鳥的羽毛？', nextNode: 'feathers' }],
      },
      {
        id: 'feathers',
        text: '哦，不知道在食譜中加入一點點公鳥的羽毛會不會讓我更漂亮呢？',
        options: [{ label: '你會把整隻公鳥加進去嗎？', nextNode: 'recipe' }],
      },
      {
        id: 'recipe',
        text: '不，我當然不會整隻加進去！當然，除非那是能讓我更漂亮的配方。不過那應該不可能，對吧？',
        options: [{ label: '那你的花冠呢？', nextNode: 'crown' }],
      },
      {
        id: 'crown',
        text: '我的花冠是我根據四季變換的，很好看吧！我可真是一隻漂亮的小麻雀！',
        options: [{ label: '加入公鳥會讓你長出他的羽毛嗎？', nextNode: 'whole-bird' }],
      },
      {
        id: 'whole-bird',
        text: '話說，妳覺得在食譜加入一整隻公鳥會讓我長出他的羽毛嗎？',
        options: [{ label: '你說完了嗎？', nextNode: 'closing' }],
      },
      {
        id: 'closing',
        text: '嗯？為什麼不說話了？難道不會嗎？',
        options: [],
      },
    ],
  },
  {
    _id: 'demo-character-cat-april',
    slug: 'demo-cat-april',
    name: '四月',
    role: '貓咪',
    species: '家貓',
    characterType: 'cat',
    imageUrl: image('一號'),
    imageAlt: '像素風四月角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是四月，正在草地邊追蹤一條很有意思的線索。', '線索是什麼？', '今天順利嗎？'),
  },
  {
    _id: 'demo-character-cat-fifteen',
    slug: 'demo-cat-fifteen',
    name: '一五',
    role: '貓咪',
    species: '家貓',
    characterType: 'cat',
    imageUrl: image('二號'),
    imageAlt: '像素風一五角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是一五，專門研究門打開之後，究竟要不要立刻走出去。', '研究有結果嗎？', '你喜歡哪裡？'),
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
