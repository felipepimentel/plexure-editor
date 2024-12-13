export const colors = {
  // Brand Colors
  primary: {
    50: '#eff6ff',
    100: '#dbeafe',
    200: '#bfdbfe',
    300: '#93c5fd',
    400: '#60a5fa',
    500: '#3b82f6',
    600: '#2563eb',
    700: '#1d4ed8',
    800: '#1e40af',
    900: '#1e3a8a',
  },
  
  // Semantic Colors
  success: {
    light: {
      bg: 'bg-green-50',
      text: 'text-green-700',
      border: 'border-green-200',
      hover: 'hover:bg-green-100',
    },
    dark: {
      bg: 'bg-green-900/20',
      text: 'text-green-300',
      border: 'border-green-800',
      hover: 'hover:bg-green-800',
    }
  },
  warning: {
    light: {
      bg: 'bg-yellow-50',
      text: 'text-yellow-700',
      border: 'border-yellow-200',
      hover: 'hover:bg-yellow-100',
    },
    dark: {
      bg: 'bg-yellow-900/20',
      text: 'text-yellow-300',
      border: 'border-yellow-800',
      hover: 'hover:bg-yellow-800',
    }
  },
  error: {
    light: {
      bg: 'bg-red-50',
      text: 'text-red-700',
      border: 'border-red-200',
      hover: 'hover:bg-red-100',
    },
    dark: {
      bg: 'bg-red-900/20',
      text: 'text-red-300',
      border: 'border-red-800',
      hover: 'hover:bg-red-800',
    }
  },
  info: {
    light: {
      bg: 'bg-blue-50',
      text: 'text-blue-700',
      border: 'border-blue-200',
      hover: 'hover:bg-blue-100',
    },
    dark: {
      bg: 'bg-blue-900/20',
      text: 'text-blue-300',
      border: 'border-blue-800',
      hover: 'hover:bg-blue-800',
    }
  }
};

export const theme = {
  light: {
    // Background
    bg: {
      primary: 'bg-white',
      secondary: 'bg-gray-50',
      tertiary: 'bg-gray-100',
    },
    // Text
    text: {
      primary: 'text-gray-900',
      secondary: 'text-gray-700',
      tertiary: 'text-gray-500',
    },
    // Border
    border: {
      primary: 'border-gray-200',
      secondary: 'border-gray-300',
    },
    // Ring
    ring: {
      focus: 'focus:ring-blue-500',
      selected: 'ring-blue-400',
    },
    // Hover
    hover: {
      bg: 'hover:bg-gray-100',
      text: 'hover:text-gray-900',
    }
  },
  dark: {
    // Background
    bg: {
      primary: 'bg-gray-800',
      secondary: 'bg-gray-900',
      tertiary: 'bg-gray-700',
    },
    // Text
    text: {
      primary: 'text-white',
      secondary: 'text-gray-200',
      tertiary: 'text-gray-400',
    },
    // Border
    border: {
      primary: 'border-gray-700',
      secondary: 'border-gray-600',
    },
    // Ring
    ring: {
      focus: 'focus:ring-blue-500',
      selected: 'ring-blue-500',
    },
    // Hover
    hover: {
      bg: 'hover:bg-gray-700',
      text: 'hover:text-white',
    }
  }
};

export const variants = {
  button: {
    primary: {
      light: 'bg-blue-600 hover:bg-blue-700 text-white',
      dark: 'bg-blue-600 hover:bg-blue-700 text-white',
    },
    secondary: {
      light: 'bg-gray-200 hover:bg-gray-300 text-gray-700',
      dark: 'bg-gray-700 hover:bg-gray-600 text-gray-200',
    },
    danger: {
      light: 'bg-red-600 hover:bg-red-700 text-white',
      dark: 'bg-red-600 hover:bg-red-700 text-white',
    },
    ghost: {
      light: 'hover:bg-gray-100 text-gray-600',
      dark: 'hover:bg-gray-700/50 text-gray-400',
    }
  },
  input: {
    default: {
      light: 'bg-white border-gray-300 text-gray-900',
      dark: 'bg-gray-700 border-gray-600 text-gray-200',
    },
    error: {
      light: 'bg-white border-red-300 text-red-900',
      dark: 'bg-gray-700 border-red-600 text-red-200',
    }
  }
}; 