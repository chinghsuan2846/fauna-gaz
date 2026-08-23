import type { Meta, StoryObj } from '@storybook/react-vite'

import ChatBubble from './ChatBubble'
import { desktopIconSources } from './DesktopIcon'

const mortimerMessage = 'Hi，我是老莫。我最喜歡的東西大概是身上的這件背心吧，這是我媽媽過世當舖給我的。'

const stageClasses = 'min-h-screen w-full bg-window-surface p-space-md sm:p-space-xl'

const meta = {
  title: 'Component/Chat Bubble',
  component: ChatBubble,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    avatarSrc: {
      control: 'text',
      description: '角色頭像圖片來源。',
    },
    avatarAlt: {
      control: 'text',
      description: '角色頭像替代文字。',
    },
    message: {
      control: 'text',
      description: '聊天訊息內容，支援自動換行。',
    },
    speaker: {
      control: 'inline-radio',
      options: ['character', 'user'],
      description: '角色說話或使用者說話。',
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ChatBubble>

export default meta

type Story = StoryObj<typeof meta>

export const Character = {
  name: 'Character',
  args: {
    avatarSrc: desktopIconSources['老莫'],
    avatarAlt: '老莫的像素風角色插圖',
    message: mortimerMessage,
    speaker: 'character',
  },
  render: (args) => (
    <div className={stageClasses}>
      <ChatBubble {...args} />
    </div>
  ),
} satisfies Story

export const User = {
  name: 'User',
  args: {
    message: mortimerMessage,
    speaker: 'user',
  },
  render: (args) => (
    <div className={stageClasses}>
      <ChatBubble {...args} />
    </div>
  ),
} satisfies Story
