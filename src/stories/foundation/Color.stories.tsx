import type { Meta, StoryObj } from '@storybook/react-vite'

import { ColorFoundation } from './FoundationPages'

const meta = {
  title: 'Foundation/Color',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Color = {
  render: () => <ColorFoundation />,
} satisfies Story
