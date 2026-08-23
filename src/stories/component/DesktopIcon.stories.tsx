import type { ComponentProps, ReactNode } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import DesktopIcon, { desktopIconNames } from './DesktopIcon'

type DesktopIconViewport = 'desktop' | 'tablet' | 'mobile'

const viewportClasses: Record<DesktopIconViewport, string> = {
  desktop: 'min-h-screen w-full bg-window-surface p-space-xl',
  tablet: 'min-h-screen w-full max-w-viewport-tablet bg-window-surface p-space-lg',
  mobile: 'min-h-viewport-mobile w-full max-w-viewport-mobile bg-window-surface p-space-md',
}

function DesktopIconStage({ viewport, children }: { viewport: DesktopIconViewport; children: ReactNode }) {
  return (
    <div className={viewportClasses[viewport]}>
      <div className="mx-auto grid max-w-5xl gap-space-xl">
        <header className="grid gap-space-xs">
          <p className="font-ui text-caption uppercase tracking-display text-ink-secondary">Component / Desktop Icon</p>
          <p className="font-ui text-small text-ink-secondary">{viewport} viewport</p>
        </header>
        {children}
      </div>
    </div>
  )
}

function DesktopIconGallery({ args, viewport }: { args: ComponentProps<typeof DesktopIcon>; viewport: DesktopIconViewport }) {
  return (
    <DesktopIconStage viewport={viewport}>
      <div className="grid grid-cols-2 gap-space-lg sm:grid-cols-3 lg:grid-cols-6">
        {desktopIconNames.map((name) => (
          <DesktopIcon key={name} {...args} name={name} label={name} />
        ))}
      </div>
    </DesktopIconStage>
  )
}

const meta = {
  title: 'Component/Desktop Icon',
  component: DesktopIcon,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    name: {
      control: 'select',
      options: desktopIconNames,
      description: '角色圖示名稱，與 PNG 檔名一致。',
    },
    label: {
      control: 'text',
      description: '顯示在圖示下方的標籤。預設使用圖示名稱。',
    },
    size: {
      control: 'inline-radio',
      options: ['small', 'medium', 'large'],
      description: '使用 Foundation spacing 尺寸。',
    },
    onActivate: {
      action: 'activated',
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
} satisfies Meta<typeof DesktopIcon>

export default meta

type Story = StoryObj<typeof meta>

export const Single = {
  name: 'Single icon',
  args: {
    name: 'R先生',
    size: 'large',
  },
  render: (args) => (
    <DesktopIconStage viewport="desktop">
      <DesktopIcon {...args} />
    </DesktopIconStage>
  ),
} satisfies Story

export const Gallery = {
  name: 'All editor icons',
  args: {
    name: 'R先生',
    size: 'large',
  },
  render: (args) => <DesktopIconGallery args={args} viewport="desktop" />,
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  args: {
    name: 'R先生',
    size: 'small',
  },
  render: (args) => <DesktopIconGallery args={args} viewport="mobile" />,
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  args: {
    name: 'R先生',
    size: 'medium',
  },
  render: (args) => <DesktopIconGallery args={args} viewport="tablet" />,
} satisfies Story

export const Desktop = {
  name: 'Desktop',
  args: {
    name: 'R先生',
    size: 'large',
  },
  render: (args) => <DesktopIconGallery args={args} viewport="desktop" />,
} satisfies Story
