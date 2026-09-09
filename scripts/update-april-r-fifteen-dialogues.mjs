import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing Sanity update configuration.')
  console.error('Set PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN before running npm run sanity:update-april-r-fifteen.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false })

const voicemailDialogue = [
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
]

const aprilDialogue = [
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
]

const fifteenDialogue = [
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
]

const characters = [
  {
    label: 'R先生',
    names: ['R先生', 'R 先生'],
    ids: ['demo-character-raven', 'mock-character-r', 'seed-character-raven'],
    dialogue: voicemailDialogue,
  },
  {
    label: '四月',
    names: ['四月', '一號'],
    ids: ['demo-character-cat-april', 'mock-character-one', 'seed-character-cat'],
    dialogue: aprilDialogue,
  },
  {
    label: '一五',
    names: ['一五', '二號'],
    ids: ['demo-character-cat-fifteen', 'mock-character-two', 'seed-character-cat-fifteen'],
    dialogue: fifteenDialogue,
  },
]

for (const character of characters) {
  const matches = await client.fetch(
    '*[_type == "character" && (name in $names || _id in $ids)]{_id, name}',
    { names: character.names, ids: character.ids },
  )

  if (matches.length !== 1) {
    console.error(`Expected exactly one ${character.label} character document, found ${matches.length}. Nothing was changed for this character.`)
    process.exit(1)
  }

  await client.patch(matches[0]._id).set({ dialogueStart: 'intro', dialogue: character.dialogue }).commit()
  console.log(`Updated ${character.label} dialogue in ${dataset}.`)
}
