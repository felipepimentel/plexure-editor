import React from 'react';
import { HelpCircle, Book, ExternalLink, Code, FileJson } from 'lucide-react';

interface RightSidebarProps {
  content: string;
}

export function RightSidebar({ content }: RightSidebarProps) {
  return (
    <div className="w-64 border-l border-gray-800 bg-gray-900 overflow-y-auto">
      <div className="p-4">
        <h2 className="text-sm font-semibold text-gray-400 flex items-center gap-2 mb-4">
          <HelpCircle className="w-4 h-4" />
          Documentation
        </h2>

        {/* Quick Links */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Quick Links</h3>
          <div className="space-y-2">
            <a
              href="https://swagger.io/docs/specification/basic-structure/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              <Book className="w-4 h-4" />
              OpenAPI Structure Guide
              <ExternalLink className="w-3 h-3" />
            </a>
            <a
              href="https://editor.swagger.io/"
              target="_blank"
              rel="noopener noreferrer"
              className="flex items-center gap-2 text-sm text-blue-400 hover:text-blue-300"
            >
              <Code className="w-4 h-4" />
              Swagger Editor
              <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>

        {/* Code Snippets */}
        <div className="mb-6">
          <h3 className="text-xs font-medium text-gray-500 mb-2">Common Snippets</h3>
          <div className="space-y-3">
            <div>
              <button
                className="w-full text-left p-2 rounded bg-gray-800/50 hover:bg-gray-800 text-sm text-gray-300"
                onClick={() => {
                  navigator.clipboard.writeText(`paths:
  /example:
    get:
      summary: Example endpoint
      description: Description of the endpoint
      parameters:
        - name: param
          in: query
          required: false
          schema:
            type: string
      responses:
        '200':
          description: Successful response`);
                }}
              >
                Basic Path Template
              </button>
            </div>
            <div>
              <button
                className="w-full text-left p-2 rounded bg-gray-800/50 hover:bg-gray-800 text-sm text-gray-300"
                onClick={() => {
                  navigator.clipboard.writeText(`components:
  schemas:
    ExampleModel:
      type: object
      properties:
        id:
          type: integer
          format: int64
        name:
          type: string
      required:
        - id
        - name`);
                }}
              >
                Schema Component Template
              </button>
            </div>
          </div>
        </div>

        {/* Documentation */}
        <div>
          <h3 className="text-xs font-medium text-gray-500 mb-2">Documentation</h3>
          <div className="space-y-4">
            <div className="rounded bg-gray-800/50 p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">OpenAPI Structure</h4>
              <p className="text-xs text-gray-400 leading-relaxed">
                The OpenAPI specification uses YAML or JSON format to describe your API. Key sections include:
              </p>
              <ul className="mt-2 space-y-1 text-xs text-gray-400">
                <li>• info: API metadata</li>
                <li>• servers: API server and base URL</li>
                <li>• paths: API endpoints</li>
                <li>• components: reusable objects</li>
              </ul>
            </div>

            <div className="rounded bg-gray-800/50 p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Best Practices</h4>
              <ul className="space-y-1 text-xs text-gray-400">
                <li>• Use clear, descriptive operation IDs</li>
                <li>• Include detailed descriptions</li>
                <li>• Define response schemas</li>
                <li>• Group related endpoints with tags</li>
                <li>• Use consistent naming conventions</li>
              </ul>
            </div>

            <div className="rounded bg-gray-800/50 p-3">
              <h4 className="text-sm font-medium text-gray-300 mb-2">Keyboard Shortcuts</h4>
              <div className="space-y-1 text-xs">
                <div className="flex justify-between">
                  <span className="text-gray-400">Save</span>
                  <span className="text-gray-500">Ctrl + S</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Format</span>
                  <span className="text-gray-500">Ctrl + Shift + F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Find</span>
                  <span className="text-gray-500">Ctrl + F</span>
                </div>
                <div className="flex justify-between">
                  <span className="text-gray-400">Replace</span>
                  <span className="text-gray-500">Ctrl + H</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
} 