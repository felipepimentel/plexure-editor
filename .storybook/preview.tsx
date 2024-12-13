import type { Preview } from '@storybook/react';
import '../src/index.css';

const preview: Preview = {
  parameters: {
    actions: { argTypesRegex: '^on[A-Z].*' },
    controls: {
      matchers: {
        color: /(background|color)$/i,
        date: /Date$/,
      },
    },
  },
  globalTypes: {
    darkMode: {
      name: 'Dark Mode',
      description: 'Dark mode setting',
      defaultValue: false,
      toolbar: {
        icon: 'circlehollow',
        items: [
          { value: false, title: 'Light' },
          { value: true, title: 'Dark' },
        ],
      },
    },
  },
};

export default preview; 