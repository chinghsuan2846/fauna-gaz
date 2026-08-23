import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import QuarterlyWindow from './QuarterlyWindow'

type PreviewViewport = 'desktop' | 'tablet' | 'mobile'
type QuarterlyWindowPreviewProps = ComponentProps<typeof QuarterlyWindow> & {
  viewport: PreviewViewport
}

function QuarterlyWindowPreview({ viewport, ...args }: QuarterlyWindowPreviewProps) {
  const isMobile = viewport === 'mobile'
  const isTablet = viewport === 'tablet'
  const frameClassName = isMobile
    ? 'h-[844px] w-[390px] max-w-full border-thin border-line'
    : isTablet
      ? 'h-[calc(100vh-4rem)] min-h-0 w-full max-w-viewport-tablet'
      : 'h-[calc(100vh-4rem)] min-h-0 w-full max-w-[52rem]'

  return (
    <div className={`flex min-h-screen justify-center overflow-visible bg-window-surface ${isMobile ? 'p-space-md' : 'p-space-xl'}`}>
      <div className={`mx-auto overflow-visible ${frameClassName}`}>
        <QuarterlyWindow {...args} responsiveMode={isMobile ? 'mobile' : 'desktop'} />
      </div>
    </div>
  )
}

const meta = {
  title: 'Patterns/Quarterly Window',
  component: QuarterlyWindow,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Window title shown in the header.',
    },
    initialSidebarOpen: {
      control: 'boolean',
      description: 'Initial state of the quarterly sidebar.',
    },
    responsiveMode: {
      table: {
        disable: true,
      },
    },
    data: {
      table: {
        disable: true,
      },
    },
    article: {
      table: {
        disable: true,
      },
    },
    initialSelectedArticleId: {
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
    onArticleSelect: {
      action: 'article-selected',
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
} satisfies Meta<typeof QuarterlyWindow>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  name: 'Desktop',
  render: (args) => <QuarterlyWindowPreview {...args} viewport="desktop" />,
  args: {
    title: 'Quarterly',
    initialSidebarOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'desktop',
    },
  },
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  render: (args) => <QuarterlyWindowPreview {...args} viewport="tablet" />,
  args: {
    title: 'Quarterly',
    initialSidebarOpen: true,
  },
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  render: (args) => <QuarterlyWindowPreview {...args} viewport="mobile" />,
  args: {
    title: 'Quarterly',
    initialSidebarOpen: false,
  },
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} satisfies Story

export const SidebarClosed = {
  name: 'Sidebar closed',
  render: (args) => <QuarterlyWindowPreview {...args} viewport="desktop" />,
  args: {
    title: 'Quarterly',
    initialSidebarOpen: false,
  },
} satisfies Story
