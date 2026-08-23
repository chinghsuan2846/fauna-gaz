import type { Meta, StoryObj } from '@storybook/react-vite'

import { MaxWidthFoundation } from './FoundationPages'

const meta = {
  title: 'Foundation/Max Width',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const MaxWidth = {
  render: () => <MaxWidthFoundation />,
} satisfies Story
