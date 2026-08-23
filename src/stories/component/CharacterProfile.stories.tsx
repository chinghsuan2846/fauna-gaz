import type { Meta, StoryObj } from '@storybook/react-vite'

import CharacterProfile from './CharacterProfile'
import { desktopIconSources } from './DesktopIcon'

const mortimerProfile = {
  imageSrc: desktopIconSources['老莫'],
  imageAlt: '老莫的像素風角色插圖',
  name: '老莫',
  role: '編輯1',
  species: '台灣高山田鼠',
  imageScale: 'large' as const,
}

const stageClasses = {
  full: 'min-h-screen w-full bg-window-surface p-space-xl',
  compact: 'min-h-viewport-mobile w-full max-w-viewport-mobile bg-window-surface p-space-md',
}

const meta = {
  title: 'Component/Character Profile',
  component: CharacterProfile,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    imageSrc: {
      control: 'text',
      description: '角色插圖的圖片來源。',
    },
    imageAlt: {
      control: 'text',
      description: '角色插圖的替代文字。',
    },
    name: {
      control: 'text',
      description: '角色中文名。',
    },
    role: {
      control: 'text',
      description: '職稱標籤，例如「編輯1」。',
    },
    species: {
      control: 'text',
      description: '物種名稱。',
    },
    variant: {
      control: 'inline-radio',
      options: ['full', 'compact'],
      description: '完整版或精簡版。',
    },
    imageScale: {
      control: 'inline-radio',
      options: ['default', 'large'],
      description: '角色圖片裁切倍率。',
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof CharacterProfile>

export default meta

type Story = StoryObj<typeof meta>

export const Full = {
  name: 'Full / Desktop',
  args: {
    ...mortimerProfile,
    variant: 'full',
  },
  render: (args) => (
    <div className={stageClasses.full}>
      <CharacterProfile {...args} />
    </div>
  ),
} satisfies Story

export const Compact = {
  name: 'Compact / Mobile',
  args: {
    ...mortimerProfile,
    variant: 'compact',
  },
  render: (args) => (
    <div className={stageClasses.compact}>
      <CharacterProfile {...args} />
    </div>
  ),
} satisfies Story
