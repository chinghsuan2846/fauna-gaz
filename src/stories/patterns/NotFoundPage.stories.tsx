import type { Meta, StoryObj } from '@storybook/react-vite'

import NotFoundPage from './NotFoundPage'

const meta = {
  title: 'Patterns/404 Page',
  component: NotFoundPage,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    homeHref: {
      control: 'text',
      description: 'Destination for the home action.',
    },
    mode: {
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
} satisfies Meta<typeof NotFoundPage>

export default meta

type Story = StoryObj<typeof meta>

export const Default = {
  name: 'Desktop',
  args: {
    homeHref: '#storybook-home',
  },
  render: (args) => <NotFoundPage {...args} mode="desktop" />,
} satisfies Story

export const Tablet = {
  name: 'Tablet',
  args: {
    homeHref: '#storybook-home',
  },
  render: (args) => <NotFoundPage {...args} mode="tablet" />,
  parameters: {
    viewport: {
      defaultViewport: 'tablet',
    },
  },
} satisfies Story

export const Mobile = {
  name: 'Mobile',
  args: {
    homeHref: '#storybook-home',
  },
  render: (args) => <NotFoundPage {...args} mode="mobile" />,
  parameters: {
    viewport: {
      defaultViewport: 'mobile1',
    },
  },
} satisfies Story
