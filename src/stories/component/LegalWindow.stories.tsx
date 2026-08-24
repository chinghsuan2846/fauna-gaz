import type { Meta, StoryObj } from '@storybook/react-vite'

import LegalWindow from './LegalWindow'

const meta = {
  title: 'Component/Legal Window',
  component: LegalWindow,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['desktop', 'tablet', 'mobile'],
    },
    initialDocument: {
      control: 'inline-radio',
      options: ['privacy', 'terms'],
    },
    className: {
      table: {
        disable: true,
      },
    },
    onClose: {
      action: 'closed',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof LegalWindow>

export default meta

type Story = StoryObj<typeof meta>

const frameClasses = {
  desktop: 'min-h-screen w-full bg-window-surface p-space-xl',
  tablet: 'min-h-screen w-full max-w-viewport-tablet bg-window-surface p-space-lg',
  mobile: 'min-h-viewport-mobile w-full max-w-viewport-mobile bg-window-surface',
} as const

export const Desktop = {
  args: {
    mode: 'desktop',
    initialDocument: 'privacy',
  },
  render: (args) => (
    <div className={frameClasses.desktop}>
      <div className="mx-auto h-[32rem] w-full max-w-viewport-mobile">
        <LegalWindow {...args} />
      </div>
    </div>
  ),
} satisfies Story

export const Tablet = {
  args: {
    mode: 'tablet',
    initialDocument: 'privacy',
  },
  render: (args) => (
    <div className={frameClasses.tablet}>
      <div className="mx-auto h-[32rem] w-full max-w-viewport-mobile">
        <LegalWindow {...args} />
      </div>
    </div>
  ),
} satisfies Story

export const Mobile = {
  args: {
    mode: 'mobile',
    initialDocument: 'privacy',
  },
  render: (args) => (
    <div className={frameClasses.mobile}>
      <LegalWindow {...args} />
    </div>
  ),
} satisfies Story
