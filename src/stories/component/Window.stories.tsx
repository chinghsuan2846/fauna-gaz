import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { WindowMode } from './Window'
import Window from './Window'

const contactMock = {
  title: 'Contact',
  contactCopy: '有任何問題、合作提案，\n或只是想和我們打聲招呼嗎？',
  supportCopy: '喜歡這份刊物嗎？\n歡迎支持下一期，\n讓故事繼續發生。',
  email: 'service@faunagaz.com',
  supportLinkText: '請我喝杯咖啡',
  supportLinkUrl: 'https://example.com/support',
}

const stageClasses: Record<WindowMode, string> = {
  desktop: 'min-h-screen w-full bg-window-surface p-space-xl',
  tablet: 'min-h-screen w-full bg-window-surface p-space-lg',
  mobile: 'min-h-viewport-mobile w-full max-w-viewport-mobile bg-window-surface',
}

const frameClasses: Record<WindowMode, string> = {
  desktop: 'ml-auto w-full max-w-viewport-mobile',
  tablet: 'ml-auto w-full max-w-viewport-mobile',
  mobile: 'w-full',
}

function WindowPreview(args: ComponentProps<typeof Window>) {
  const mode = args.mode ?? 'desktop'

  return (
    <div className={stageClasses[mode]}>
      <div className={`relative ${frameClasses[mode]}`}>
        <Window {...args} />
      </div>
    </div>
  )
}

const meta = {
  title: 'Component/Window',
  component: Window,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['desktop', 'tablet', 'mobile'],
      description: 'Window interaction and layout mode.',
    },
    title: {
      control: 'text',
      description: 'Window header title.',
    },
    contact: {
      control: 'object',
      description: 'Contact content supplied by the site settings adapter.',
    },
    onClose: {
      action: 'closed',
      table: {
        disable: true,
      },
    },
    onSupport: {
      action: 'support-requested',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Window>

export default meta

type Story = StoryObj<typeof meta>

export const Contact = {
  name: 'Contact',
  args: {
    mode: 'desktop',
    contact: contactMock,
  },
  render: (args) => <WindowPreview {...args} />,
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  args: {
    mode: 'tablet',
    contact: contactMock,
  },
  render: (args) => <WindowPreview {...args} />,
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  args: {
    mode: 'mobile',
    contact: contactMock,
  },
  render: (args) => <WindowPreview {...args} />,
} satisfies Story
