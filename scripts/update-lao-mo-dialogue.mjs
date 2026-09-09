import { createClient } from '@sanity/client'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing Sanity update configuration.')
  console.error('Set PUBLIC_SANITY_PROJECT_ID and SANITY_API_WRITE_TOKEN before running npm run sanity:update-lao-mo.')
  process.exit(1)
}

const client = createClient({ projectId, dataset, apiVersion: '2025-01-01', token, useCdn: false })

const dialogue = [
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
]

const matches = await client.fetch(
  '*[_type == "character" && (name == "老莫" || _id in ["demo-character-mouse", "mock-character-lao-mo", "seed-character-mouse"])]{_id, name}',
)

if (matches.length !== 1) {
  console.error(`Expected exactly one 老莫 character document, found ${matches.length}. Nothing was changed.`)
  process.exit(1)
}

await client.patch(matches[0]._id).set({ dialogueStart: 'intro', dialogue }).commit()
console.log(`Updated 老莫 dialogue in ${dataset}.`)
