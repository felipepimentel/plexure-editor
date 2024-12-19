# 🚀 OpenAPI Editor

<div align="center">
  <img src="https://raw.githubusercontent.com/swagger-api/swagger.io/wordpress/images/assets/SW-logo-clr.png" alt="OpenAPI Editor Logo" width="400"/>
  
  <p align="center">
    A modern, powerful, and intuitive OpenAPI specification editor with real-time preview and validation.
  </p>

  <p align="center">
    <a href="#features">Features</a> •
    <a href="#getting-started">Getting Started</a> •
    <a href="#usage">Usage</a> •
    <a href="#keyboard-shortcuts">Shortcuts</a> •
    <a href="#contributing">Contributing</a>
  </p>

  <p align="center">
    <img src="https://img.shields.io/badge/TypeScript-Ready-blue?logo=typescript" alt="TypeScript Ready"/>
    <img src="https://img.shields.io/badge/React-18-blue?logo=react" alt="React 18"/>
    <img src="https://img.shields.io/badge/Tailwind-CSS-38B2AC?logo=tailwind-css" alt="Tailwind CSS"/>
    <img src="https://img.shields.io/badge/Monaco-Editor-00B3E0?logo=visual-studio-code" alt="Monaco Editor"/>
  </p>
</div>

## ✨ Features

### 🎨 Modern UI/UX
- **Dark/Light Theme Support**: Seamlessly switch between themes
- **Split View**: Edit and preview simultaneously
- **Responsive Design**: Works on all screen sizes
- **Customizable Layout**: Collapsible sidebar and preview panel

### 📝 Powerful Editor
- **Monaco Editor Integration**: VS Code-like experience
- **Syntax Highlighting**: YAML/JSON support
- **Auto-completion**: Context-aware suggestions
- **Real-time Validation**: Instant feedback on errors
- **Format on Save**: Keep your code clean

### 🔍 Smart Preview
- **Real-time Updates**: See changes instantly
- **Interactive Documentation**: Collapsible sections
- **Search & Filter**: Find endpoints quickly
- **Tag-based Navigation**: Organize by tags
- **Color-coded Methods**: Visual HTTP method identification

### 🛠️ Developer Tools
- **File Management**: Create, open, and save files
- **Export Options**: YAML/JSON conversion
- **Keyboard Shortcuts**: Efficient workflow
- **Git Integration**: Version control support
- **Multiple Files**: Work on multiple specs

## 🚀 Getting Started

### Prerequisites
- Node.js 16.x or later
- npm or yarn

### Installation

```bash
# Clone the repository
git clone https://github.com/yourusername/openapi-editor.git

# Navigate to the project directory
cd openapi-editor

# Install dependencies
npm install
# or
yarn install

# Start the development server
npm run dev
# or
yarn dev
```

## 💻 Usage

### Basic Operations

1. **Create New File**
   - Click the "+" button in the toolbar
   - Use `Ctrl+N` shortcut

2. **Open File**
   - Click "Open" in the toolbar
   - Drag & drop files
   - Use `Ctrl+O` shortcut

3. **Save File**
   - Click "Save" in the toolbar
   - Use `Ctrl+S` shortcut

4. **Export**
   - Export as YAML/JSON
   - Download documentation

### Advanced Features

#### Editor Customization
- Adjust font size
- Toggle word wrap
- Show/hide minimap
- Configure tab size

#### Preview Options
- Filter by tags
- Search endpoints
- Expand/collapse all
- Copy endpoint URLs

## ⌨️ Keyboard Shortcuts

| Action | Windows/Linux | macOS |
|--------|--------------|-------|
| New File | `Ctrl+N` | `⌘+N` |
| Open File | `Ctrl+O` | `⌘+O` |
| Save | `Ctrl+S` | `⌘+S` |
| Format | `Shift+Alt+F` | `⇧+⌥+F` |
| Toggle Preview | `Ctrl+P` | `⌘+P` |
| Find | `Ctrl+F` | `⌘+F` |
| Toggle Sidebar | `Ctrl+B` | `⌘+B` |

## 🔧 Configuration

### Editor Settings

```typescript
{
  "editor": {
    "theme": "vs-dark",
    "fontSize": 14,
    "tabSize": 2,
    "wordWrap": "on",
    "formatOnSave": true,
    "minimap": true
  }
}
```

### Theme Customization

```typescript
{
  "theme": {
    "light": {
      "primary": "#0284c7",
      "background": "#ffffff",
      "foreground": "#0f172a"
    },
    "dark": {
      "primary": "#38bdf8",
      "background": "#0f172a",
      "foreground": "#f8fafc"
    }
  }
}
```

## 🤝 Contributing

We welcome contributions! Please follow these steps:

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🙏 Acknowledgments

- [Monaco Editor](https://microsoft.github.io/monaco-editor/)
- [OpenAPI Initiative](https://www.openapis.org/)
- [Tailwind CSS](https://tailwindcss.com/)
- [React](https://reactjs.org/)
- [TypeScript](https://www.typescriptlang.org/)

---

<div align="center">
  <sub>Built with ❤️ by your amazing team</sub>
</div>
