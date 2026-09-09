import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing Sanity update configuration.')
  console.error('Set PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) and SANITY_API_WRITE_TOKEN before running npm run sanity:update-characters.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false })

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
    names: ['老莫'],
    ids: ['demo-character-mouse', 'mock-character-lao-mo', 'seed-character-mouse'],
    name: '老莫',
    slug: 'lao-mo',
    role: '編輯1',
    species: '台灣高山田鼠',
    characterType: 'mouse',
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
    names: ['R先生', 'R 先生'],
    ids: ['demo-character-raven', 'mock-character-r', 'seed-character-raven'],
    name: 'R先生',
    slug: 'mr-r',
    role: '編輯2',
    species: '渡鴉',
    characterType: 'bird',
    dialogue: [
      {
        _key: 'intro',
        id: 'intro',
        text: '您撥的電話將轉接到語音信箱，嘟聲後開始計費，如不留言請掛斷，快速留言請按兩次井字鍵。',
        options: [{ _key: 'field-notes', label: '##', nextNode: '##' }],
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
    names: ['阿雀'],
    ids: ['demo-character-sparrow', 'mock-character-que', 'seed-character-bird'],
    name: '阿雀',
    slug: 'a-que',
    role: '專欄作家',
    species: '家麻雀',
    characterType: 'bird',
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
    names: ['四月', '一號'],
    ids: ['demo-character-cat-april', 'mock-character-one', 'seed-character-cat'],
    name: '四月',
    slug: 'april',
    role: '貓咪',
    species: '家貓',
    characterType: 'cat',
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
    names: ['一五', '二號'],
    ids: ['demo-character-cat-fifteen', 'mock-character-two', 'seed-character-cat-fifteen'],
    name: '一五',
    slug: 'fifteen',
    role: '貓咪',
    species: '家貓',
    characterType: 'cat',
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

const existingCharacters = await client.fetch(
  '*[_type == "character"]{_id, name}',
)

const transaction = client.transaction()
const updatedIds = new Set()

for (const character of characters) {
  const matches = existingCharacters.filter((existing) => character.ids.includes(existing._id) || character.names.includes(existing.name))

  for (const existing of matches) {
    transaction.patch(existing._id, (patch) => patch.set({
      name: character.name,
      slug: { _type: 'slug', current: character.slug },
      role: character.role,
      species: character.species,
      characterType: character.characterType,
      dialogueStart: 'intro',
      dialogue: character.dialogue,
    }))
    updatedIds.add(existing._id)
  }

  if (matches.length === 0) console.warn(`Character not found: ${character.name}`)
}

if (updatedIds.size === 0) {
  console.error('No character documents matched; nothing was changed.')
  process.exit(1)
}

await transaction.commit()
console.log(`Updated ${updatedIds.size} character documents in ${dataset}.`)
