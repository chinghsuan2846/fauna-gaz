import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import type { ButtonProps, ButtonState, PixelIconName } from './Button'
import { Button as ButtonComponent } from './Button'

type ButtonVariant = Pick<
  ButtonProps,
  'appearance' | 'ariaLabel' | 'icon' | 'iconOnly' | 'iconPosition' | 'iconSize' | 'label' | 'size'
> & {
  name: string
  interactive?: boolean
}

type ButtonStateEntry = readonly [label: string, state: ButtonState]

const states: readonly ButtonStateEntry[] = [
  ['default', 'default'],
  ['hover', 'hover'],
  ['disabled', 'disabled'],
  ['loading', 'loading'],
]

const variants = {
  outlineOnlyText: {
    name: 'Outline only text',
    appearance: 'outline',
    label: '選單',
    iconSize: 'small',
    size: 'large',
  },
  outlineTextLeftIcon: {
    name: 'Outline text + left icon',
    appearance: 'outline',
    label: '上一頁',
    icon: 'chevron-left',
    iconPosition: 'left',
    iconSize: 'small',
    size: 'large',
  },
  outlineTextRightIcon: {
    name: 'Outline text + right icon',
    appearance: 'outline',
    label: '下一頁',
    icon: 'chevron-right',
    iconPosition: 'right',
    iconSize: 'small',
    size: 'large',
  },
  outlineOnlyIcon: {
    name: 'Outline only icon',
    appearance: 'outline',
    icon: 'menu',
    iconOnly: true,
    ariaLabel: '開啟選單',
    size: 'small',
  },
  onlyText: {
    name: 'Only text',
    appearance: 'text',
    label: '請我喝咖啡',
    size: 'large',
  },
  onlyIcon: {
    name: 'Only icon',
    appearance: 'text',
    icon: 'volume-on',
    iconOnly: true,
    ariaLabel: '關閉音樂',
    size: 'small',
    interactive: true,
  },
} satisfies Record<string, ButtonVariant>

type ButtonStateShowcaseProps = {
  variant: ButtonVariant
  controls?: ButtonProps
}

function ButtonStateShowcase({ variant, controls }: ButtonStateShowcaseProps) {
  const [musicEnabled, setMusicEnabled] = useState(true)
  const { name, interactive = false, ...buttonVariant } = variant
  const volumeIcon: PixelIconName = musicEnabled ? 'volume-on' : 'volume-off'
  const toggleMusic = () => setMusicEnabled((enabled) => !enabled)
  const controlPreviewProps: ButtonProps = {
    ...buttonVariant,
    ...controls,
    ...(interactive
      ? {
          ariaLabel: musicEnabled ? '關閉音樂' : '開啟音樂',
          icon: volumeIcon,
          onClick: toggleMusic,
        }
      : {}),
  }

  return (
    <main className="min-h-screen bg-window-surface p-space-lg font-body text-body text-ink-primary">
      <section className="mx-auto grid max-w-5xl gap-space-xl">
        <header className="grid gap-space-sm">
          <p className="font-ui text-caption uppercase tracking-display text-ink-secondary">
            Storybook / Component / Button
          </p>
          <h1 className="font-ui text-headline font-medium">{name}</h1>
          <p className="text-body text-ink-secondary">
            Button interaction states built from Foundation tokens.
          </p>
          {interactive && (
            <p className="font-ui text-small text-ink-secondary" role="status" aria-live="polite">
              音樂：{musicEnabled ? '開啟' : '關閉'}
            </p>
          )}
          <div className="grid gap-space-xs border-thin border-line-subtle p-space-sm text-caption text-ink-secondary sm:grid-cols-2">
            <span>Large: px-space-button-lg-x / py-space-sm</span>
            <span>Small: px-space-sm / py-space-xs</span>
            <span>Type: font-ui / text-body</span>
            <span>Color: ink-primary</span>
          </div>
        </header>

        <section className="grid gap-space-sm border-thin border-line bg-window-surface p-space-md">
          <div className="flex flex-wrap items-baseline justify-between gap-space-sm">
            <h2 className="font-ui text-title font-medium">Control preview</h2>
            <code className="text-caption text-ink-secondary">{controlPreviewProps.state ?? 'default'}</code>
          </div>
          <div className="flex min-h-space-4xl items-center">
            <ButtonComponent {...controlPreviewProps} />
          </div>
        </section>

        <div className="grid gap-space-lg">
          <section className="grid gap-space-sm border-thin border-line bg-window-surface p-space-md">
            <div className="flex flex-wrap items-baseline justify-between gap-space-sm">
              <h2 className="font-ui text-title font-medium">{name}</h2>
              <code className="text-caption text-ink-secondary">{variant.size}</code>
            </div>
            <div className="grid gap-space-sm sm:grid-cols-2 lg:grid-cols-4">
              {states.map(([label, state]) => {
                const buttonProps: ButtonProps = { ...buttonVariant, state }
                const interactiveProps: Pick<ButtonProps, 'ariaLabel' | 'icon' | 'onClick'> = interactive
                  ? {
                      ariaLabel: musicEnabled ? '關閉音樂' : '開啟音樂',
                      icon: volumeIcon,
                      onClick: state === 'default' ? toggleMusic : undefined,
                    }
                  : {}

                return (
                  <div key={state} className="grid gap-space-xs">
                    <span className="font-ui text-caption uppercase text-ink-secondary">{label}</span>
                    <div className="flex min-h-space-4xl items-center bg-window-surface">
                      <ButtonComponent {...buttonProps} {...interactiveProps} />
                    </div>
                  </div>
                )
              })}
            </div>
          </section>
        </div>
      </section>
    </main>
  )
}

const meta = {
  title: 'Component/Button',
  component: ButtonComponent,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    appearance: {
      control: 'inline-radio',
      options: ['outline', 'text'],
      description: 'Button surface treatment.',
    },
    label: {
      control: 'text',
      description: 'Visible button text. Leave empty for an icon-only button.',
    },
    icon: {
      control: 'select',
      options: [
        'menu',
        'message',
        'chevron-left',
        'chevron-right',
        'coffee',
        'music-on',
        'music-off',
        'volume-on',
        'volume-off',
        'close',
        'loading',
      ],
    },
    iconPosition: {
      control: 'inline-radio',
      options: ['left', 'right'],
    },
    iconSize: {
      control: 'inline-radio',
      options: ['large', 'small'],
    },
    iconOnly: {
      control: 'boolean',
    },
    size: {
      control: 'inline-radio',
      options: ['large', 'small'],
    },
    state: {
      control: 'inline-radio',
      options: ['default', 'hover', 'disabled', 'loading'],
    },
    ariaLabel: {
      control: 'text',
    },
    onClick: {
      action: 'clicked',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof ButtonComponent>

export default meta

type Story = StoryObj<typeof meta>

export const OutlineOnlyText = {
  name: 'Outline only text',
  args: {
    appearance: 'outline',
    label: '選單',
    iconSize: 'small',
    size: 'large',
    state: 'default',
  },
  render: (args) => <ButtonStateShowcase variant={{ ...variants.outlineOnlyText, ...args }} controls={args} />,
} satisfies Story

export const OutlineTextLeftIcon = {
  name: 'Outline text + left icon',
  args: {
    appearance: 'outline',
    label: '上一頁',
    icon: 'chevron-left',
    iconPosition: 'left',
    iconSize: 'small',
    size: 'large',
    state: 'default',
  },
  render: (args) => <ButtonStateShowcase variant={{ ...variants.outlineTextLeftIcon, ...args }} controls={args} />,
} satisfies Story

export const OutlineTextRightIcon = {
  name: 'Outline text + right icon',
  args: {
    appearance: 'outline',
    label: '下一頁',
    icon: 'chevron-right',
    iconPosition: 'right',
    iconSize: 'small',
    size: 'large',
    state: 'default',
  },
  render: (args) => <ButtonStateShowcase variant={{ ...variants.outlineTextRightIcon, ...args }} controls={args} />,
} satisfies Story

export const OutlineOnlyIcon = {
  name: 'Outline only icon',
  args: {
    appearance: 'outline',
    icon: 'menu',
    iconOnly: true,
    ariaLabel: '開啟選單',
    size: 'small',
    state: 'default',
  },
  render: (args) => <ButtonStateShowcase variant={{ ...variants.outlineOnlyIcon, ...args }} controls={args} />,
} satisfies Story

export const OnlyText = {
  name: 'Only text',
  args: {
    appearance: 'text',
    label: '請我喝咖啡',
    size: 'large',
    state: 'default',
  },
  render: (args) => <ButtonStateShowcase variant={{ ...variants.onlyText, ...args }} controls={args} />,
} satisfies Story

export const OnlyIcon = {
  name: 'Only icon',
  args: {
    appearance: 'text',
    icon: 'volume-on',
    iconOnly: true,
    ariaLabel: '關閉音樂',
    size: 'small',
    state: 'default',
  },
  render: (args) => <ButtonStateShowcase variant={{ ...variants.onlyIcon, ...args }} controls={args} />,
} satisfies Story
