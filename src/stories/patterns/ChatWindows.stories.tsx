import type { ComponentProps, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import { desktopIconSources } from '../component/DesktopIcon'
import ChatWindows from './ChatWindows'

type PreviewViewport = 'desktop' | 'tablet' | 'mobile'
type ChatWindowsStoryArgs = ComponentProps<typeof ChatWindows>

const mortimerProfile: ChatWindowsStoryArgs['profile'] = {
  imageSrc: desktopIconSources['老莫'],
  imageAlt: '老莫的像素風角色插圖',
  name: '老莫',
  role: '編輯1',
  species: '台灣高山田鼠',
  imageScale: 'large',
}

const chatMessages: ChatWindowsStoryArgs['messages'] = [
  {
    id: 'mortimer-intro',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: 'Hi，我是老莫。我最喜歡的東西大概是身上的這件背心吧，這是我媽媽過世當舖給我的。',
    speaker: 'character',
  },
  {
    id: 'user-question',
    message: '那你有什麼最討厭的東西嗎',
    speaker: 'user',
  },
  {
    id: 'mortimer-answer',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: '最討厭的東西？黃鼠狼！一群奸詐的鼠輩！',
    speaker: 'character',
  },
  {
    id: 'user-reply',
    message: '哈哈，這個詞不合適吧！',
    speaker: 'user',
  },
  {
    id: 'mortimer-story',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: '什麼？我不應該用「鼠」這個詞？妳說話可得大聲點，親愛的！真可惜，是沒辦法吃上什麼嗎？',
    speaker: 'character',
  },
  {
    id: 'user-comment',
    message: '那就說你身上的花生吧！',
    speaker: 'user',
  },
  {
    id: 'mortimer-follow-up',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: '花生當然也很好吃，不過採訪的時候可別只記得吃，還是要把我說的話好好寫下來。',
    speaker: 'character',
  },
  {
    id: 'user-follow-up',
    message: '放心，我會把這段對話完整刊在下一期季刊上。',
    speaker: 'user',
  },
  {
    id: 'mortimer-closing',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: '那就成交！下次見面記得帶一點花生，我會準備好更多故事。',
    speaker: 'character',
  },
  {
    id: 'user-closing',
    message: '說好了，謝謝你的分享！',
    speaker: 'user',
  },
  {
    id: 'mortimer-sign-off',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: '對了，請記得把我的名字寫對，老莫的「莫」是莫名其妙的莫，不是其他奇怪的字。',
    speaker: 'character',
  },
  {
    id: 'user-sign-off',
    message: '收到，我會仔細校對後再交稿。',
    speaker: 'user',
  },
  {
    id: 'mortimer-last-note',
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: '很好，那今天就先聊到這裡。希望讀者看完之後，也能更了解我們這些住在山裡的小動物。',
    speaker: 'character',
  },
  {
    id: 'user-last-note',
    message: '期待下一次採訪，再見！',
    speaker: 'user',
  },
]

const submit = {
  placeholder: '寫點什麼吧',
  submitLabel: '送出',
}

const quickReplies = [
  { label: '你最近在觀察什麼？' },
  { label: '可以分享一個冷知識嗎？' },
]

const stageClasses: Record<PreviewViewport, string> = {
  desktop: 'flex min-h-screen w-full justify-center overflow-hidden bg-window-surface p-space-xl',
  tablet: 'flex min-h-screen w-full justify-center overflow-hidden bg-window-surface p-space-lg',
  mobile: 'flex min-h-viewport-mobile w-full justify-center overflow-hidden bg-window-surface p-space-md',
}

const frameClasses: Record<PreviewViewport, string> = {
  desktop: 'h-[calc(100vh-4rem)] min-h-[36rem] w-full max-w-viewport-tablet',
  tablet: 'h-[calc(100vh-3rem)] min-h-[36rem] w-full max-w-viewport-tablet',
  mobile: 'h-viewport-mobile w-full max-w-viewport-mobile',
}

function ChatWindowsPreview({ viewport, children, ...args }: ChatWindowsStoryArgs & { viewport: PreviewViewport; children?: ReactNode }) {
  return (
    <div className={stageClasses[viewport]}>
      <div className={`mx-auto ${frameClasses[viewport]}`}>
        <ChatWindows {...args} viewport={viewport} />
        {children}
      </div>
    </div>
  )
}

const meta = {
  title: 'Patterns/Chat Windows',
  component: ChatWindows,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    viewport: {
      table: {
        disable: true,
      },
    },
    title: {
      control: 'text',
      description: '聊天視窗標題。',
    },
    profile: {
      table: {
        disable: true,
      },
    },
    messages: {
      table: {
        disable: true,
      },
    },
    submit: {
      table: {
        disable: true,
      },
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ChatWindows>

export default meta

type Story = StoryObj<typeof meta>

const sharedArgs = {
  title: 'Message from : Mortimer',
  profile: mortimerProfile,
  messages: chatMessages,
  quickReplies,
  submit,
}

export const Desktop = {
  name: 'Desktop',
  args: sharedArgs,
  render: (args) => <ChatWindowsPreview {...args} viewport="desktop" />,
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  args: sharedArgs,
  render: (args) => <ChatWindowsPreview {...args} viewport="tablet" />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  args: sharedArgs,
  render: (args) => <ChatWindowsPreview {...args} viewport="mobile" />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} satisfies Story
