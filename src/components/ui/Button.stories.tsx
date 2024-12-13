import type { Meta, StoryObj } from '@storybook/react';
import { BaseButton } from './Button';
import { Plus } from 'lucide-react';

const meta: Meta<typeof BaseButton> = {
  title: 'UI/BaseButton',
  component: BaseButton,
  parameters: {
    layout: 'centered',
  },
  tags: ['autodocs'],
  argTypes: {
    variant: {
      control: 'select',
      options: ['primary', 'secondary', 'danger', 'ghost'],
    },
    size: {
      control: 'select',
      options: ['sm', 'md', 'lg'],
    },
    darkMode: {
      control: 'boolean',
    },
    disabled: {
      control: 'boolean',
    },
    loading: {
      control: 'boolean',
    },
    fullWidth: {
      control: 'boolean',
    },
  },
};

export default meta;
type Story = StoryObj<typeof BaseButton>;

export const Primary: Story = {
  args: {
    children: 'Button',
    variant: 'primary',
    size: 'md',
    darkMode: false,
  },
};

export const Secondary: Story = {
  args: {
    children: 'Button',
    variant: 'secondary',
    size: 'md',
    darkMode: false,
  },
};

export const WithIcon: Story = {
  args: {
    children: 'Add Item',
    icon: <Plus className="w-4 h-4" />,
    variant: 'primary',
    size: 'md',
    darkMode: false,
  },
};

export const Loading: Story = {
  args: {
    children: 'Loading',
    loading: true,
    variant: 'primary',
    size: 'md',
    darkMode: false,
  },
};

export const Disabled: Story = {
  args: {
    children: 'Disabled',
    disabled: true,
    variant: 'primary',
    size: 'md',
    darkMode: false,
  },
}; 