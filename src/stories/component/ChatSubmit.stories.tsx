import type { Meta, StoryObj } from '@storybook/react-vite'

import ChatSubmit from './ChatSubmit'

type UserSubmitViewport = 'desktop' | 'tablet' | 'mobile'

const stageClasses: Record<UserSubmitViewport, string> = {
  desktop: 'min-h-screen w-full bg-window-surface p-space-xl',
  tablet: 'min-h-screen w-full max-w-viewport-tablet bg-window-surface p-space-lg',
  mobile: 'min-h-viewport-mobile w-full max-w-viewport-mobile bg-window-surface p-space-md',
}

const meta = {
  title: 'Component/User Submit',
  component: ChatSubmit,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    placeholder: {
      control: 'text',
      description: '裝飾用的輸入提示文字。',
    },
    submitLabel: {
      control: 'text',
      description: '裝飾用的送出文字，不觸發對話。',
    },
    className: {
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ChatSubmit>

export default meta

type Story = StoryObj<typeof meta>

function UserSubmitPreview({ args, viewport }: { args: Story['args']; viewport: UserSubmitViewport }) {
  return (
    <div className={stageClasses[viewport]}>
      <ChatSubmit {...args} />
    </div>
  )
}

const userSubmitArgs = {
  placeholder: '寫點什麼吧',
  submitLabel: '送出',
}

export const Desktop = {
  name: 'Desktop',
  args: {
    ...userSubmitArgs,
  },
  render: (args) => <UserSubmitPreview args={args} viewport="desktop" />,
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  args: {
    ...userSubmitArgs,
  },
  render: (args) => <UserSubmitPreview args={args} viewport="tablet" />,
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  args: {
    ...userSubmitArgs,
  },
  render: (args) => <UserSubmitPreview args={args} viewport="mobile" />,
} satisfies Story
