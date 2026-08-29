import { useState } from 'react'
import type { Meta, StoryObj } from '@storybook/react-vite'

import Window from './Window'
import WindowState, { type WindowStateKind, type WindowStateProps } from './WindowState'

function WindowStatePreview({ kind = 'empty', ...args }: WindowStateProps) {
  const [lastAction, setLastAction] = useState('')
  const isError = kind === 'error'

  return (
    <main className="grid min-h-screen place-items-center bg-window-surface p-space-md font-body text-ink-primary sm:p-space-xl">
      <div className="grid w-full max-w-viewport-mobile gap-space-sm">
        <div className="h-[30rem] w-full">
          <Window title={isError ? '季刊 / Error' : '季刊'} headerIcon="message" className="h-full">
            <WindowState
              {...args}
              kind={kind}
              actionLabel={args.actionLabel ?? (isError ? '重新載入' : undefined)}
              actionHref={args.actionHref ?? undefined}
              onAction={args.onAction ?? (isError ? () => setLastAction('已提出重新載入要求') : undefined)}
              detail={args.detail ?? (isError ? 'ERROR: CONTENT_UNAVAILABLE' : undefined)}
            />
          </Window>
        </div>
        <p className="min-h-5 text-center font-ui text-caption text-ink-secondary" role="status" aria-live="polite">
          {lastAction}
        </p>
      </div>
    </main>
  )
}

const meta = {
  title: 'Component/Window State',
  component: WindowState,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    kind: {
      control: 'inline-radio',
      options: ['empty', 'error'],
      description: 'Window content state.',
    },
    title: {
      control: 'text',
    },
    message: {
      control: 'text',
    },
    detail: {
      control: 'text',
    },
    actionLabel: {
      control: 'text',
    },
    actionHref: {
      control: 'text',
    },
    onAction: {
      action: 'action-requested',
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
} satisfies Meta<typeof WindowState>

export default meta

type Story = StoryObj<typeof meta>

export const Empty = {
  name: 'Empty',
  args: {
    kind: 'empty',
  },
  render: (args) => <WindowStatePreview {...args} kind="empty" />,
} satisfies Story

export const Error = {
  name: 'Error',
  args: {
    kind: 'error',
  },
  render: (args) => <WindowStatePreview {...args} kind="error" />,
} satisfies Story
