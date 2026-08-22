import type { Meta, StoryObj } from '@storybook/react-vite'

import { FontFoundation } from './FoundationPages'

const meta = {
  title: 'Foundation/Font',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Font = {
  render: () => <FontFoundation />,
} satisfies Story
