import type { Meta, StoryObj } from '@storybook/react-vite'

import { ShadowFoundation } from './FoundationPages'

const meta = {
  title: 'Foundation/Shadow',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Shadow = {
  render: () => <ShadowFoundation />,
} satisfies Story
