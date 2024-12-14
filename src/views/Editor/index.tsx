import React, { useState } from 'react';
import { EditorLayout } from '@/components/editor/EditorLayout';
import { useTheme } from '@/contexts/ThemeContext';
import { useEditorState } from '@/hooks/useEditorState';
import { AlertTriangle } from 'lucide-react';
import { LeftSidebar } from '@/components/navigation/LeftSidebar';
import { RightSidebar } from '@/components/navigation/RightSidebar';

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

export function Editor() {
  const { theme } = useTheme();
  const [leftPanelCollapsed, setLeftPanelCollapsed] = useState(false);
  const [rightPanelCollapsed, setRightPanelCollapsed] = useState(false);
  const [leftPanelWidth, setLeftPanelWidth] = useState(300);
  const [rightPanelWidth, setRightPanelWidth] = useState(300);
  const { spec, parsedSpec, parseError, updateSpec } = useEditorState(DEFAULT_SPEC);
  const [isResizingLeft, setIsResizingLeft] = useState(false);
  const [isResizingRight, setIsResizingRight] = useState(false);

  return (
    <div className="h-full flex">
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
          onChange={updateSpec}
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
        parsedSpec={parsedSpec}
      />

      {parseError && (
        <div className="fixed bottom-8 right-8 max-w-md bg-red-500/10 border border-red-500/20 rounded-lg p-4 text-red-500">
          <div className="flex items-center gap-2 mb-2">
            <AlertTriangle className="w-4 h-4" />
            <span className="font-medium">YAML Parse Error</span>
          </div>
          <p className="text-sm opacity-90">{parseError}</p>
        </div>
      )}
    </div>
  );
} 