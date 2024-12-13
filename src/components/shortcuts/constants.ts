export const KEYBOARD_SHORTCUTS = [
  {
    category: 'General',
    items: [
      { keys: ['⌘', 'S'], description: 'Save changes' },
      { keys: ['⌘', 'Z'], description: 'Undo' },
      { keys: ['⌘', 'Shift', 'Z'], description: 'Redo' },
      { keys: ['⌘', '/'], description: 'Toggle comment' },
      { keys: ['⌘', 'F'], description: 'Find' },
      { keys: ['⌘', 'H'], description: 'Show keyboard shortcuts' },
    ]
  },
  {
    category: 'Navigation',
    items: [
      { keys: ['⌘', '\\'], description: 'Toggle navigation panel' },
      { keys: ['⌘', '.'], description: 'Toggle preview panel' },
      { keys: ['⌘', 'B'], description: 'Toggle sidebar' },
      { keys: ['⌘', 'P'], description: 'Quick open file' },
    ]
  },
  {
    category: 'Editor',
    items: [
      { keys: ['⌘', 'Alt', '↑'], description: 'Add cursor above' },
      { keys: ['⌘', 'Alt', '↓'], description: 'Add cursor below' },
      { keys: ['Alt', '↑'], description: 'Move line up' },
      { keys: ['Alt', '↓'], description: 'Move line down' },
      { keys: ['⌘', 'D'], description: 'Select next occurrence' },
      { keys: ['⌘', 'Shift', 'L'], description: 'Select all occurrences' },
    ]
  }
]; 