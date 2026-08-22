import type { Meta, StoryObj } from '@storybook/react-vite'

import WindowHeader from './WindowHeader'

const meta = {
  title: 'Component/WindowHeader',
  component: WindowHeader,
  parameters: {
    layout: 'fullscreen',
  },
  argTypes: {
    title: {
      control: 'text',
      description: 'Window title.',
    },
    showSidebar: {
      control: 'boolean',
      description: 'Show the pixel sidebar toggle.',
    },
    sidebarOpen: {
      control: 'boolean',
      description: 'Selected state while the sidebar is open. The selected button stays transparent.',
    },
    sidebarPreviewState: {
      control: 'inline-radio',
      options: ['none', 'hover'],
      description: 'Static preview state for the sidebar toggle.',
    },
    onClose: {
      action: 'closed',
      table: {
        disable: true,
      },
    },
    onSidebarToggle: {
      action: 'sidebar-toggled',
      table: {
        disable: true,
      },
    },
  },
} satisfies Meta<typeof WindowHeader>

export default meta

type Story = StoryObj<typeof meta>

export const Contact = {
  name: 'Contact',
  args: {
    title: 'Contact',
  },
} satisfies Story

export const SidebarClosed = {
  name: 'With sidebar',
  args: {
    title: 'Quarterly',
    showSidebar: true,
    sidebarOpen: false,
  },
} satisfies Story

export const SidebarHover = {
  name: 'Sidebar hover',
  args: {
    title: 'Quarterly',
    showSidebar: true,
    sidebarPreviewState: 'hover',
  },
} satisfies Story

export const SidebarOpen = {
  name: 'Sidebar open',
  args: {
    title: 'Quarterly',
    showSidebar: true,
    sidebarOpen: true,
  },
} satisfies Story
