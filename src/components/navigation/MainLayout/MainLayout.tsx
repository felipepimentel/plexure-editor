import React, { useState, useRef, useEffect } from 'react';
import { Command, Settings, HelpCircle, FileText } from 'lucide-react';
import { StatusBar } from '../../statusbar/StatusBar';
import { CommandPalette } from '../../ui/CommandPalette';
import { useKeyboardShortcuts } from '../../../contexts/KeyboardShortcutsContext';
import { useTheme } from '../../../contexts/ThemeContext';
import { usePreferences } from '../../../contexts/PreferencesContext';
import { Tooltip } from '../../ui/Tooltip';
import { EditorLayout } from '../../editor/EditorLayout';
import { LeftSidebar } from '../LeftSidebar';
import { RightSidebar } from '../RightSidebar';

const DEFAULT_SPEC = `openapi: 3.0.0
info:
  title: Sample API
  version: 1.0.0
  description: A sample API specification
servers:
  - url: https://api.example.com/v1
    description: Production server
paths:
  /users:
    get:
      summary: List users
      description: Returns a list of users
      parameters:
        - name: limit
          in: query
          description: Maximum number of users to return
          required: false
          schema:
            type: integer
            format: int32
            minimum: 1
            maximum: 100
            default: 20
      responses:
        '200':
          description: A list of users
          content:
            application/json:
              schema:
                type: array
                items:
                  $ref: '#/components/schemas/User'
    post:
      summary: Create user
      description: Creates a new user
      requestBody:
        required: true
        content:
          application/json:
            schema:
              $ref: '#/components/schemas/UserInput'
      responses:
        '201':
          description: User created successfully
          content:
            application/json:
              schema:
                $ref: '#/components/schemas/User'
components:
  schemas:
    User:
      type: object
      required:
        - id
        - email
        - name
      properties:
        id:
          type: string
          format: uuid
          description: Unique identifier for the user
        email:
          type: string
          format: email
          description: User's email address
        name:
          type: string
          description: User's full name
        createdAt:
          type: string
          format: date-time
          description: When the user was created
    UserInput:
      type: object
      required:
        - email
        - name
      properties:
        email:
          type: string
          format: email
          description: User's email address
        name:
          type: string
          description: User's full name`;

interface MainLayoutProps {
  children: React.ReactNode;
}

const MIN_SIDEBAR_WIDTH = 240;
const MAX_SIDEBAR_WIDTH = 480;

export function MainLayout({ children }: MainLayoutProps) {
  const { theme } = useTheme();
  const { preferences, updatePreference } = usePreferences();
  const { registerShortcut } = useKeyboardShortcuts();
  const [isCommandPaletteOpen, setIsCommandPaletteOpen] = useState(false);
  const [isSettingsOpen, setIsSettingsOpen] = useState(false);
  const [isHelpOpen, setIsHelpOpen] = useState(false);
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(320);
  const [rightPanelWidth, setRightPanelWidth] = useState(384);
  const [spec, setSpec] = useState(DEFAULT_SPEC);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);
  const containerRef = useRef<HTMLDivElement>(null);

  // Register keyboard shortcuts
  useEffect(() => {
    registerShortcut({
      key: '⌘+B',
      description: 'Toggle left sidebar',
      action: () => setLeftPanelCollapsed(prev => !prev)
    });

    registerShortcut({
      key: '⌘+\\',
      description: 'Toggle right sidebar',
      action: () => setRightPanelCollapsed(prev => !prev)
    });

    registerShortcut({
      key: '⌘+P',
      description: 'Open command palette',
      action: () => setIsCommandPaletteOpen(true)
    });
  }, [registerShortcut]);

  // Handle mouse move for resizing
  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!containerRef.current) return;
      const containerRect = containerRef.current.getBoundingClientRect();

      if (isResizingLeft) {
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, e.clientX - containerRect.left)
        );
        setLeftPanelWidth(newWidth);
      }

      if (isResizingRight) {
        const newWidth = Math.max(
          MIN_SIDEBAR_WIDTH,
          Math.min(MAX_SIDEBAR_WIDTH, containerRect.right - e.clientX)
        );
        setRightPanelWidth(newWidth);
      }
    };

    const handleMouseUp = () => {
      setIsResizingLeft(false);
      setIsResizingRight(false);
    };

    if (isResizingLeft || isResizingRight) {
      document.addEventListener('mousemove', handleMouseMove);
      document.addEventListener('mouseup', handleMouseUp);
    }

    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, [isResizingLeft, isResizingRight]);

  return (
    <div className="flex flex-col h-screen overflow-hidden bg-gradient-to-br from-gray-900 via-gray-800 to-gray-900">
      {/* Header */}
      <header className="flex-none h-12 flex items-center justify-between px-4 border-b border-white/[0.05] bg-gray-900/90 backdrop-blur-sm">
        <div className="flex items-center space-x-6">
          <div className="flex items-center gap-2">
            <FileText className="w-4 h-4 text-blue-500" />
            <span className="text-sm font-medium text-gray-200">Swagger Editor</span>
          </div>
          <Tooltip content="Command Palette (⌘P)">
            <button
              className="inline-flex items-center px-2 py-1 text-xs text-gray-400 bg-white/[0.05] rounded hover:bg-white/[0.08] transition-colors"
              onClick={() => setIsCommandPaletteOpen(true)}
            >
              <Command className="w-3 h-3" />
              <span className="ml-1.5">Command</span>
              <kbd className="ml-1.5 px-1 py-0.5 text-[10px] font-mono bg-white/[0.05] rounded">⌘P</kbd>
            </button>
          </Tooltip>
        </div>
        <div className="flex items-center gap-1">
          <Tooltip content="Settings (⌘,)">
            <button 
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-white/[0.05] rounded-md transition-colors"
              onClick={() => setIsSettingsOpen(true)}
            >
              <Settings className="w-4 h-4" />
            </button>
          </Tooltip>
          <Tooltip content="Help (⌘/)">
            <button 
              className="p-2 text-gray-400 hover:text-gray-300 hover:bg-white/[0.05] rounded-md transition-colors"
              onClick={() => setIsHelpOpen(true)}
            >
              <HelpCircle className="w-4 h-4" />
            </button>
          </Tooltip>
        </div>
      </header>

      {/* Main Content */}
      <div className="flex-1 flex min-h-0" ref={containerRef}>
        {/* Left Sidebar */}
        <LeftSidebar
          collapsed={leftPanelCollapsed}
          width={leftPanelWidth}
          onCollapse={setLeftPanelCollapsed}
          onResize={() => setIsResizingLeft(true)}
        />

        {/* Editor */}
        <div className="flex-1 min-w-0">
          <EditorLayout
            content={spec}
            onChange={setSpec}
            preferences={{
              theme: theme === 'dark' ? 'vs-dark' : 'vs-light',
              fontSize: 14,
              tabSize: 2,
              wordWrap: true,
              left_panel_collapsed: leftPanelCollapsed,
              right_panel_collapsed: rightPanelCollapsed,
              left_panel_width: leftPanelWidth,
              right_panel_width: rightPanelWidth
            }}
          />
        </div>

        {/* Right Sidebar */}
        <RightSidebar
          collapsed={rightPanelCollapsed}
          width={rightPanelWidth}
          onCollapse={setRightPanelCollapsed}
          onResize={() => setIsResizingRight(true)}
        />
      </div>

      {/* Command Palette */}
      <CommandPalette
        isOpen={isCommandPaletteOpen}
        onClose={() => setIsCommandPaletteOpen(false)}
      />

      {/* Status Bar */}
      <StatusBar />
    </div>
  );
} 