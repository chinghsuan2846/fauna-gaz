import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import QuarterlyContent, {
  quarterlyContentFirstArticle,
  quarterlyContentLastArticle,
  quarterlyContentMockArticle,
} from './QuarterlyContent'

function ContentPreview(args: ComponentProps<typeof QuarterlyContent>) {
  return (
    <div className="h-screen overflow-hidden bg-window-surface p-space-md">
      <div className="h-full w-full max-w-viewport-tablet overflow-hidden">
        <QuarterlyContent {...args} />
      </div>
    </div>
  )
}

const meta = {
  title: 'Component/Quarterly Content',
  component: QuarterlyContent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    article: {
      table: {
        disable: true,
      },
    },
    onPrevious: {
      action: 'previous-article',
      table: {
        disable: true,
      },
    },
    onNext: {
      action: 'next-article',
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
} satisfies Meta<typeof QuarterlyContent>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive = {
  name: 'Interactive',
  render: (args) => <ContentPreview {...args} />,
  args: {
    article: quarterlyContentMockArticle,
  },
} satisfies Story

export const FirstArticle = {
  name: 'First article',
  render: (args) => <ContentPreview {...args} />,
  args: {
    article: quarterlyContentFirstArticle,
  },
} satisfies Story

export const LastArticle = {
  name: 'Last article',
  render: (args) => <ContentPreview {...args} />,
  args: {
    article: quarterlyContentLastArticle,
  },
} satisfies Story
