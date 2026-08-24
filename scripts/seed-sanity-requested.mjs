import { createClient } from '@sanity/client'
import { createReadStream } from 'node:fs'
import { join } from 'node:path'
import { fileURLToPath } from 'node:url'

const projectId = process.env.PUBLIC_SANITY_PROJECT_ID || process.env.SANITY_STUDIO_PROJECT_ID
const dataset = process.env.PUBLIC_SANITY_DATASET || process.env.SANITY_STUDIO_DATASET || 'production'
const token = process.env.SANITY_API_WRITE_TOKEN

if (!projectId || !token) {
  console.error('Missing Sanity seed configuration.')
  console.error('Set PUBLIC_SANITY_PROJECT_ID (or SANITY_STUDIO_PROJECT_ID) and SANITY_API_WRITE_TOKEN before running this script.')
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
    _id: 'mock-character-lao-mo',
    _type: 'character',
    name: '老莫',
    slug: { _type: 'slug', current: 'lao-mo' },
    species: '台灣高山田鼠',
    role: '編輯1',
    characterType: 'mouse',
    assetFile: '老莫.png',
    imageAlt: '像素風老莫角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('嗨，我是老莫。我最近在記錄高山草叢裡那些不容易被發現的聲音。', '聊聊田野觀察', '你平常都在做什麼？'),
  },
  {
    _id: 'mock-character-r',
    _type: 'character',
    name: 'R先生',
    slug: { _type: 'slug', current: 'mr-r' },
    species: '渡鴉',
    role: '編輯2',
    characterType: 'bird',
    assetFile: 'R先生.png',
    imageAlt: '像素風 R 先生角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是 R 先生。我對聲音、記憶，以及誰先發現食物這些事很有興趣。', '渡鴉真的很聰明嗎？', '最近有什麼新發現？'),
  },
  {
    _id: 'mock-character-que',
    _type: 'character',
    name: '阿雀',
    slug: { _type: 'slug', current: 'a-que' },
    species: '家麻雀',
    role: '專欄作家',
    characterType: 'bird',
    assetFile: '阿雀.png',
    imageAlt: '像素風阿雀角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('你好，我是阿雀，負責把城市裡每天發生的小故事寫成專欄。', '聊聊城市觀察', '你今天看到什麼？'),
  },
  {
    _id: 'mock-character-one',
    _type: 'character',
    name: '一號',
    slug: { _type: 'slug', current: 'one' },
    species: '家貓',
    role: '貓',
    characterType: 'cat',
    assetFile: '一號.png',
    imageAlt: '像素風一號角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是一號。我的研究方法很簡單：先找一個舒服的位置，再觀察所有經過的人。', '貓咪如何觀察？', '你想知道什麼？'),
  },
  {
    _id: 'mock-character-two',
    _type: 'character',
    name: '二號',
    slug: { _type: 'slug', current: 'two' },
    species: '家貓',
    role: '貓',
    characterType: 'cat',
    assetFile: '二號.png',
    imageAlt: '像素風二號角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是二號，專門研究門打開之後，究竟要不要立刻走出去。', '研究有結果嗎？', '你喜歡哪裡？'),
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
  _id: 'mock-issue-2026-autumn',
  _type: 'issue',
  title: '2026 秋季（創刊號）',
  slug: { _type: 'slug', current: '2026-autumn' },
  year: 2026,
  quarter: '秋季',
}

const category = {
  _id: 'mock-category-self-awareness',
  _type: 'category',
  title: '自我意識',
  slug: { _type: 'slug', current: 'self-awareness' },
}

const articleDrafts = [
  ['self-awareness', '自我意識', '從一個問題開始：動物如何知道自己是自己？', '我們常常把自我意識想成一面鏡子，但真正重要的也許不是看見自己的外表，而是能不能在不同的時間裡，感覺到自己仍然是同一個存在。', '這一期，我們從鏡像測試、記憶、遊戲與社會互動出發，慢慢靠近「自我」這個既熟悉又難以說清楚的詞。'],
  ['white-whale', '白鯨', '海面之下，白鯨用聲音記住彼此，也記住回家的路。', '白鯨生活在遼闊而明亮的海域。對牠們來說，聲音不是背景，而是一張能夠在水中展開的地圖。', '研究者觀察到，白鯨會用不同的叫聲維持群體聯繫。當一隻白鯨離開視線，聲音就成了牠與同伴之間的細線。'],
  ['bottlenose-dolphin', '瓶鼻海豚', '一個名字、一個倒影，還有海豚對自己的好奇心。', '瓶鼻海豚會以哨聲互相辨識。每一隻海豚似乎都有一個屬於自己的聲音標記，像是水中的名字。', '當牠們在鏡子前停留、轉動身體，研究者開始思考：這個倒影對牠來說，是另一隻海豚，還是自己？'],
  ['asian-elephant', '亞洲象', '巨大的身體裡，裝著細膩的記憶與關係。', '亞洲象的生活由路徑、氣味、低頻聲音與家族關係交織而成。年長的母象常常帶領群體穿越熟悉又遙遠的路線。', '有時候，記憶並不只屬於某一隻象，而是藏在整個家族共同走過的地方。'],
  ['ants', '螞蟻', '沒有中央指揮官，螞蟻如何一起完成一件事？', '一隻螞蟻看起來只是在地面上繞路，但許多螞蟻一起行動時，卻能形成穩定而有彈性的群體。', '牠們依靠氣味、接觸與簡單的規則交換資訊。複雜的結果，往往從非常簡單的選擇開始。'],
  ['magpie', '喜鵲', '喜鵲的黑白羽毛之間，藏著一座熱鬧的社交網絡。', '喜鵲會記住熟悉的臉，也會留意哪些地方曾經出現危險。牠們的叫聲不只是警報，也像是群體裡流動的消息。', '一根樹枝、一個反光的小物件，都可能成為牠們觀察世界的入口。'],
  ['dog', '狗', '狗如何讀懂人的表情、聲音與那些沒有說出口的事？', '狗和人一起生活了很長的時間。牠們會看向人的眼睛，也會根據語氣與姿勢，猜測下一個動作。', '對狗來說，理解一個人也許不只是辨認指令，而是持續觀察一段關係正在如何變化。'],
  ['conclusion', '總結', '自我不是一道答案，而是一連串持續發生的關係。', '我們很難用單一測驗證明另一個物種是否擁有自我意識。每個物種都有自己的身體、感官與生活歷史。', '也許更好的問題不是「牠們像不像人」，而是「牠們如何成為牠們自己」。'],
  ['recipe', '食譜', '一份給觀察者的簡單食譜：耐心、距離，以及一點好奇心。', '第一步，找一個不打擾動物的位置。第二步，把時間放慢，讓原本不明顯的聲音與動作逐漸浮現。', '最後，記下你看到的事，也記下你沒有看到的事。好的觀察，總會為下一次提問留下空間。'],
  ['reader-mail', '讀者回函', '讀者分享一段在陽台上遇見麻雀的午後。', '「我原本以為麻雀只是來找食物，後來發現牠每天都會停在同一條曬衣桿上，像是在確認這個地方還在。」', '謝謝讀者提醒我們，觀察不一定要發生在遙遠的森林。家門口也有一整座值得慢慢閱讀的世界。'],
  ['references-and-notes', '引用來源與備註', '本期文章的閱讀線索與編輯備註。', '本期內容以動物行為學、認知科學與田野觀察的入門資料為起點，並將複雜研究轉寫成容易閱讀的短文。', '文中的例子是編輯部為了示範版面而整理的暫時內容，正式刊載前仍需要補上完整引用與核對。'],
  ['isbn', 'ISBN', '創刊號的出版資訊與編輯備忘。', '本期目前是 Fauna Gaz 的內容原型，ISBN 欄位暫以版面測試為主，正式出版資訊將於定稿後更新。', '我們希望每一期都能保留一點修改的空間，讓內容在被閱讀之前，先經過一次仔細的照顧。'],
  ['chelseas-diet', 'Chelsea’s diet', '一份從餐桌旁開始的飲食觀察筆記。', 'Chelsea 的飲食紀錄看起來像是一張簡單的清單，但真正有趣的是牠如何選擇、等待，以及在不同情境下改變順序。', '飲食不只是攝取能量，也包含記憶、環境與熟悉的日常。把這些線索放在一起，才能看見行為背後的故事。'],
]

const articles = articleDrafts.map(([slug, title, excerpt, firstParagraph, secondParagraph], index) => ({
  _id: `mock-article-${slug}`,
  _type: 'article',
  title,
  slug: { _type: 'slug', current: slug },
  excerpt,
  publishedAt: `2026-08-${String(30 - Math.min(index, 12)).padStart(2, '0')}T00:00:00.000Z`,
  issue: { _type: 'reference', _ref: issue._id },
  categories: [{ _type: 'reference', _ref: category._id }],
  body: body([firstParagraph, secondParagraph]),
}))

const siteSettings = {
  _id: 'siteSettings',
  _type: 'siteSettings',
  title: '聯絡動物公報',
  contactCopy: '如果你有想分享的觀察，歡迎寫信給我們。',
  supportCopy: '也可以請編輯喝杯咖啡，支持下一期季刊。',
  email: 'hello@fauna-gaz.example',
  supportLinkText: '請編輯喝杯咖啡',
  supportLinkUrl: 'https://example.com/support',
}

const characterIds = characters.map((character) => character._id)
const existingCharacters = await client.fetch(
  '*[_id in $ids]{_id, "assetId": image.asset._ref}',
  { ids: characterIds },
)
const existingAssetIds = new Map(existingCharacters.map((character) => [character._id, character.assetId]))
const uploadedAssets = new Map()

for (const character of characters) {
  const existingAssetId = existingAssetIds.get(character._id)
  if (existingAssetId) {
    uploadedAssets.set(character._id, existingAssetId)
    continue
  }

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

const existingSiteSettings = await client.getDocument('siteSettings')
const documents = [issue, category, ...characterDocuments, ...articles]
if (!existingSiteSettings) documents.push(siteSettings)

const transaction = client.transaction()
for (const document of documents) transaction.createOrReplace(document)

await transaction.commit()
console.log(`Seeded ${characterDocuments.length} characters, ${articles.length} articles, one issue, one category${existingSiteSettings ? '' : ', and site settings'}.`)
console.log(`Sanity Studio: https://www.sanity.io/manage/project/${projectId}/dataset/${dataset}`)
