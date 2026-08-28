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
    dialogue: [
      {
        _key: 'intro',
        id: 'intro',
        text: '大家好，我是老莫。我最喜歡的東西大概是身上的這件背心吧，這是我媽媽過世前織給我的。',
        options: [{ _key: 'dislike', label: '那你最討厭什麼？', nextNode: 'dislike' }],
      },
      {
        _key: 'dislike',
        id: 'dislike',
        text: '最討厭的東西？黃鼠狼！一群奸詐的鼠輩！',
        options: [{ _key: 'word-choice', label: '你不該這樣稱呼牠們嗎？', nextNode: 'word-choice' }],
      },
      {
        _key: 'word-choice',
        id: 'word-choice',
        text: '什麼？我不應該用什麼這個詞？妳說話可得大聲點親愛的，真可憐，是沒能吃上什麼飯嗎？',
        options: [{ _key: 'peanut', label: '那你背上的花生是怎麼回事？', nextNode: 'peanut' }],
      },
      {
        _key: 'peanut',
        id: 'peanut',
        text: '喔？妳問我背上這顆花生？是的！這是來自一位我西方好友的贈禮，去年可是我的兩歲大壽呢！',
        options: [{ _key: 'peanut-memory', label: '你真的不會吃掉它嗎？', nextNode: 'peanut-memory' }],
      },
      {
        _key: 'peanut-memory',
        id: 'peanut-memory',
        text: '這真是好東西，可不是嗎？我在家裡可從沒見過的好東西！什麼？吃它？喔，不不不，我想我不會吃它的。',
        options: [{ _key: 'closing', label: '為什麼不吃？', nextNode: 'closing' }],
      },
      {
        _key: 'closing',
        id: 'closing',
        text: '這可是珍貴的回憶啊！',
        options: [],
      },
    ],
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
    dialogue: dialogue('我沒有什麼好說的。', '你確定嗎？', '那我先不打擾了。', '……嗯。', '再見。', '就這樣。'),
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
    _id: 'mock-character-one',
    _type: 'character',
    name: '四月',
    slug: { _type: 'slug', current: 'april' },
    species: '家貓',
    role: '貓咪',
    characterType: 'cat',
    assetFile: '一號.png',
    imageAlt: '像素風四月角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是四月。我的研究方法很簡單：先找一個舒服的位置，再觀察所有經過的人。', '貓咪如何觀察？', '你想知道什麼？'),
  },
  {
    _id: 'mock-character-two',
    _type: 'character',
    name: '一五',
    slug: { _type: 'slug', current: 'fifteen' },
    species: '家貓',
    role: '貓咪',
    characterType: 'cat',
    assetFile: '二號.png',
    imageAlt: '像素風一五角色插圖',
    dialogueStart: 'intro',
    dialogue: dialogue('我是一五，專門研究門打開之後，究竟要不要立刻走出去。', '研究有結果嗎？', '你喜歡哪裡？'),
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

const extendedContentCategory = {
  _id: 'mock-category-extended-content',
  _type: 'category',
  title: '延伸內容',
  slug: { _type: 'slug', current: 'extended-content' },
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
  [
    'references-and-notes',
    '引用來源與備註',
    '本期文章所引用的研究資料如下。',
    [
      '[1] Mildener A, Buchman D, Ragir S, Reiss D (2026) Evidence for mirror self-recognition in beluga whales (Delphinapterus leucas). PLoS One 21(5): e0348287. https://doi.org/10.1371/journal.pone.0348287',
      '[2] D. Reiss, & L. Marino, Mirror self-recognition in the bottlenose dolphin: A case of cognitive convergence, Proc. Natl. Acad. Sci. U.S.A. 98 (10) 5937-5942, https://doi.org/10.1073/pnas.101086398 (2001).',
      '[3] J.M. Plotnik, F.B.M. de Waal, & D. Reiss, Self-recognition in an Asian elephant, Proc. Natl. Acad. Sci. U.S.A. 103 (45) 17053-17057, https://doi.org/10.1073/pnas.0608062103 (2006).',
      '[4] Tricot, M., & Cammaerts, R. (2015). Are ants (Hymenoptera, Formicidae) capable of self recognition ? Journal of science, 5, 521-532.',
      '[5] Prior H, Schwarz A, Güntürkün O (2008) Mirror-Induced Behavior in the Magpie (Pica pica): Evidence of Self-Recognition . PLoS Biol 6(8): e202. https://doi.org/10.1371/journal.pbio.0060202',
      '[6] Soler, M., Colmenero, J. M., Pérez-Contreras, T., & Peralta-Sánchez, J. M. (2020). Replication of the mirror mark test experiment in the magpie (Pica pica) does not provide evidence of self-recognition. Journal of comparative psychology (Washington, D.C. : 1983), 134(4), 363–371. https://doi.org/10.1037/com0000223',
      '[7] Horowitz A. (2017). Smelling themselves: Dogs investigate their own odours longer when modified in an "olfactory mirror" test. Behavioural processes, 143, 17–24. https://doi.org/10.1016/j.beproc.2017.08.001',
      '[8] Gallup, G. G., Jr., & Anderson, J. R. (2020). Self-recognition in animals: Where do we stand 50 years later? Lessons from cleaner wrasse and other species. Psychology of Consciousness: Theory, Research, and Practice, 7(1), 46–58. https://doi.org/10.1037/cns0000206',
    ],
  ],
]

const extendedContentSlugs = new Set(['reader-mail', 'references-and-notes'])
const articles = articleDrafts.map(([slug, title, excerpt, firstParagraph, secondParagraph], index) => ({
  _id: `mock-article-${slug}`,
  _type: 'article',
  title,
  slug: { _type: 'slug', current: slug },
  excerpt,
  publishedAt: `2026-08-${String(30 - Math.min(index, 12)).padStart(2, '0')}T00:00:00.000Z`,
  issue: { _type: 'reference', _ref: issue._id },
  categories: [{ _type: 'reference', _ref: extendedContentSlugs.has(slug) ? extendedContentCategory._id : category._id }],
  body: body([firstParagraph, ...(Array.isArray(secondParagraph) ? secondParagraph : [secondParagraph])]),
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
const documents = [issue, category, extendedContentCategory, ...characterDocuments, ...articles]
if (!existingSiteSettings) documents.push(siteSettings)

const transaction = client.transaction()
for (const document of documents) transaction.createOrReplace(document)

await transaction.commit()
console.log(`Seeded ${characterDocuments.length} characters, ${articles.length} articles, one issue, two categories${existingSiteSettings ? '' : ', and site settings'}.`)
console.log(`Sanity Studio: https://www.sanity.io/manage/project/${projectId}/dataset/${dataset}`)
