import type { ComponentProps } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import QuarterlySidebar from './QuarterlySidebar'

function SidebarPreview(args: ComponentProps<typeof QuarterlySidebar>) {
  return (
    <div className="h-screen overflow-hidden bg-window-surface p-space-md">
      <div className="h-full w-full max-w-sidebar overflow-hidden">
        <QuarterlySidebar {...args} />
      </div>
    </div>
  )
}

const meta = {
  title: 'Component/Quarterly Sidebar',
  component: QuarterlySidebar,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    data: {
      table: {
        disable: true,
      },
    },
    initialOpenYearIds: {
      table: {
        disable: true,
      },
    },
    initialOpenQuarterIds: {
      table: {
        disable: true,
      },
    },
    initialSelectedArticleId: {
      table: {
        disable: true,
      },
    },
    previewArticleId: {
      control: 'text',
      description: 'Article id to display as a preview state.',
    },
    previewState: {
      control: 'inline-radio',
      options: ['none', 'hover', 'active'],
      description: 'Static preview for the requested interaction state.',
    },
    onArticleSelect: {
      action: 'article-selected',
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
} satisfies Meta<typeof QuarterlySidebar>

export default meta

type Story = StoryObj<typeof meta>

export const Interactive = {
  name: 'Interactive',
  render: (args) => <SidebarPreview {...args} />,
  args: {
    initialOpenYearIds: ['2026'],
    initialOpenQuarterIds: ['2026-autumn'],
    initialSelectedArticleId: '2026-autumn-self-awareness',
    previewState: 'none',
  },
} satisfies Story

export const YearsCollapsed = {
  name: 'Years collapsed',
  render: (args) => <SidebarPreview {...args} />,
  args: {
    initialOpenYearIds: [],
    initialOpenQuarterIds: [],
    previewState: 'none',
  },
} satisfies Story

export const YearsExpanded = {
  name: 'Years expanded',
  render: (args) => <SidebarPreview {...args} />,
  args: {
    initialOpenYearIds: ['2027', '2026'],
    initialOpenQuarterIds: [],
    previewState: 'none',
  },
} satisfies Story

export const QuarterExpanded = {
  name: 'Quarter expanded',
  render: (args) => <SidebarPreview {...args} />,
  args: {
    initialOpenYearIds: ['2026'],
    initialOpenQuarterIds: ['2026-autumn'],
    previewState: 'none',
  },
} satisfies Story

export const ArticleHover = {
  name: 'Article hover',
  render: (args) => <SidebarPreview {...args} />,
  args: {
    initialOpenYearIds: ['2026'],
    initialOpenQuarterIds: ['2026-autumn'],
    previewArticleId: '2026-autumn-self-awareness',
    previewState: 'hover',
  },
} satisfies Story

export const ArticleActive = {
  name: 'Article active',
  render: (args) => <SidebarPreview {...args} />,
  args: {
    initialOpenYearIds: ['2026'],
    initialOpenQuarterIds: ['2026-autumn'],
    previewArticleId: '2026-autumn-self-awareness',
    previewState: 'active',
  },
} satisfies Story
