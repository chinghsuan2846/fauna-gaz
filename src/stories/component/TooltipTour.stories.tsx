import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import TooltipTour, { type TooltipTourProps } from './TooltipTour'

const steps: TooltipTourProps['steps'] = [
  {
    id: 'desk',
    targetId: 'tour-welcome',
    title: '歡迎來到動物公報',
    description: '這裡是動物公報的桌面。你可以從季刊、角色圖示與頁尾工具開始探索。',
    placement: 'center',
  },
  {
    id: 'quarterly',
    targetId: 'tour-quarterly',
    title: '從季刊開始閱讀',
    description: '點擊季刊圖示，依年份、季度與目錄閱讀動物行為學文章。',
    placement: 'auto',
  },
  {
    id: 'characters',
    targetId: 'tour-characters',
    title: '認識公報裡的角色',
    description: '點擊桌面上的角色圖示，開啟對話視窗，和編輯們聊聊。',
    placement: 'auto',
  },
]

function TooltipTourPreview(args: TooltipTourProps) {
  const [open, setOpen] = useState(true)

  return (
    <div className="relative min-h-screen overflow-hidden bg-window-surface p-space-xl font-ui text-ink-primary">
      <div className="grid min-h-[70vh] place-items-center border-thin border-ink-primary bg-window-header/40">
        <div className="flex items-end gap-space-4xl">
          <div data-tour-id="tour-characters" className="grid gap-space-xs text-center">
            <span className="grid h-space-4xl w-space-4xl place-items-center border-thin border-ink-primary bg-window-surface text-title">R</span>
            <span className="text-caption">R先生</span>
          </div>
          <div data-tour-id="tour-quarterly" className="grid gap-space-xs text-center">
            <span className="grid h-space-4xl w-space-4xl place-items-center border-thin border-ink-primary bg-window-surface text-title">季</span>
            <span className="text-caption">季刊</span>
          </div>
        </div>
      </div>

      <TooltipTour {...args} open={open} onClose={() => setOpen(false)} onComplete={() => setOpen(false)} />
    </div>
  )
}

const meta = {
  title: 'Component/TooltipTour',
  component: TooltipTour,
  parameters: {
    layout: 'fullscreen',
  },
  args: {
    steps,
  },
  render: (args) => <TooltipTourPreview {...args} />,
} satisfies Meta<typeof TooltipTour>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {} satisfies Story

export const ThirdStep = {
  name: 'Third step',
  args: {
    initialStep: 2,
  },
} satisfies Story
