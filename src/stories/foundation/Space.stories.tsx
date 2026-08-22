import type { Meta, StoryObj } from '@storybook/react-vite'

import { SpaceFoundation } from './FoundationPages'

const meta = {
  title: 'Foundation/Space',
  parameters: {
    layout: 'fullscreen',
  },
} satisfies Meta

export default meta

type Story = StoryObj<typeof meta>

export const Space = {
  render: () => <SpaceFoundation />,
} satisfies Story
