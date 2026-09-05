import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Footer from './Footer'

const viewportFrameClasses = {
  responsive: 'w-full',
  desktop: 'w-full',
  tablet: 'w-full max-w-viewport-tablet',
  mobile: 'w-full max-w-viewport-mobile',
} as const

function FooterPreview(args: ComponentProps<typeof Footer>) {
  const frameClass = viewportFrameClasses[args.mode ?? 'responsive']
  const stageClass = args.mode === 'mobile' ? 'flex min-h-viewport-mobile flex-col' : 'flex min-h-screen flex-col'

  return (
    <div className={`${stageClass} bg-ink-inverse p-space-md`}>
      <div className={`${frameClass} mt-auto`}>
        <Footer {...args} />
      </div>
    </div>
  )
}

const meta = {
  title: 'Component/Footer',
  component: Footer,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    mode: {
      control: 'inline-radio',
      options: ['responsive', 'desktop', 'tablet', 'mobile'],
      description: 'Footer layout mode.',
    },
    currentTime: {
      control: 'text',
    },
    currentDate: {
      control: 'text',
    },
    onLegal: {
      action: 'open-legal-window',
      table: {
        disable: true,
      },
    },
    onContact: {
      action: 'open-contact-window',
      table: {
        disable: true,
      },
    },
    onTour: {
      action: 'open-system-tour',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof Footer>

export default meta

type Story = StoryObj<typeof meta>

export const Desktop = {
  name: 'Desktop',
  args: {
    mode: 'desktop',
  },
  render: (args) => <FooterPreview {...args} />,
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  args: {
    mode: 'tablet',
  },
  render: (args) => <FooterPreview {...args} />,
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  args: {
    mode: 'mobile',
  },
  render: (args) => <FooterPreview {...args} />,
} satisfies Story
