import { languages } from 'monaco-editor';

// Configure Monaco workers
if (typeof window !== 'undefined') {
  // @ts-ignore
  window.MonacoEnvironment = {
    getWorkerUrl: function (_moduleId: string, label: string) {
      const workerPath = label === 'yaml'
        ? '/monaco-yaml/yaml.worker.js'
        : label === 'json'
          ? '/monaco-editor/esm/vs/language/json/json.worker.js'
          : '/monaco-editor/esm/vs/editor/editor.worker.js';

      return `data:text/javascript;charset=utf-8,${encodeURIComponent(`
        self.MonacoEnvironment = {
          baseUrl: '${window.location.origin}'
        };
        importScripts('${window.location.origin}${workerPath}');
      `)}`;
    }
  };
}

export const openAPISnippets: languages.CompletionItem[] = [
  {
    label: 'path',
    kind: languages.CompletionItemKind.Snippet,
    insertText: [
      '/${1:path}:',
      '  get:',
      '    summary: ${2:Get resource}',
      '    responses:',
      '      \'200\':',
      '        description: Successful response',
      '        content:',
      '          application/json:',
      '            schema:',
      '              type: object',
      '              properties:',
      '                ${3:property}:',
      '                  type: ${4|string,number,boolean,array,object|}',
    ].join('\n'),
    documentation: 'Add a new path with GET endpoint',
    insertTextRules: languages.CompletionItemKind.InsertAsSnippet,
  },
  {
    label: 'get',
    kind: languages.CompletionItemKind.Snippet,
    insertText: [
      'get:',
      '  summary: ${1:Get resource}',
      '  responses:',
      '    \'200\':',
      '      description: Successful response',
      '      content:',
      '        application/json:',
      '          schema:',
      '            type: object',
      '            properties:',
      '              ${2:property}:',
      '                type: ${3|string,number,boolean,array,object|}',
    ].join('\n'),
    documentation: 'Add a GET endpoint',
    insertTextRules: languages.CompletionItemKind.InsertAsSnippet,
  },
  {
    label: 'post',
    kind: languages.CompletionItemKind.Snippet,
    insertText: [
      'post:',
      '  summary: ${1:Create resource}',
      '  requestBody:',
      '    required: true',
      '    content:',
      '      application/json:',
      '        schema:',
      '          type: object',
      '          properties:',
      '            ${2:property}:',
      '              type: ${3|string,number,boolean,array,object|}',
      '  responses:',
      '    \'201\':',
      '      description: Created successfully',
      '    \'400\':',
      '      description: Bad request',
    ].join('\n'),
    documentation: 'Add a POST endpoint',
    insertTextRules: languages.CompletionItemKind.InsertAsSnippet,
  },
  {
    label: 'schema',
    kind: languages.CompletionItemKind.Snippet,
    insertText: [
      'schema:',
      '  type: object',
      '  required:',
      '    - ${1:property}',
      '  properties:',
      '    ${1:property}:',
      '      type: ${2|string,number,boolean,array,object|}',
      '      description: ${3:Property description}',
    ].join('\n'),
    documentation: 'Add a schema definition',
    insertTextRules: languages.CompletionItemKind.InsertAsSnippet,
  },
  {
    label: 'component',
    kind: languages.CompletionItemKind.Snippet,
    insertText: [
      'components:',
      '  schemas:',
      '    ${1:ComponentName}:',
      '      type: object',
      '      properties:',
      '        ${2:property}:',
      '          type: ${3|string,number,boolean,array,object|}',
      '          description: ${4:Property description}',
    ].join('\n'),
    documentation: 'Add a reusable component schema',
    insertTextRules: languages.CompletionItemKind.InsertAsSnippet,
  },
];

export const monacoOptions = {
  quickSuggestions: true,
  snippetSuggestions: 'inline',
  suggest: {
    preview: true,
    showWords: true,
    showColors: true,
    showIcons: true,
  },
  wordBasedSuggestions: 'matchingDocuments',
  tabCompletion: 'on',
  scrollBeyondLastLine: false,
  renderLineHighlight: 'all',
  minimap: {
    maxColumn: 80,
    renderCharacters: false,
    showSlider: 'mouseover',
  },
  smoothScrolling: true,
  cursorBlinking: 'smooth',
  cursorSmoothCaretAnimation: true,
  cursorStyle: 'line',
  roundedSelection: true,
  matchBrackets: 'always',
  autoClosingBrackets: 'always',
  autoClosingQuotes: 'always',
  formatOnPaste: true,
  formatOnType: true,
  glyphMargin: false,
  renderWhitespace: 'selection',
  guides: {
    indentation: true,
    bracketPairs: true,
  },
  hover: {
    enabled: true,
    delay: 300,
  },
  parameterHints: {
    enabled: true,
    cycle: true,
  },
  lightbulb: {
    enabled: true,
  },
  links: true,
  occurrencesHighlight: true,
  unfoldOnClickAfterEndOfLine: true,
  dragAndDrop: true,
  acceptSuggestionOnEnter: 'on',
  accessibilitySupport: 'on',
  colorDecorators: true,
  contextmenu: true,
  copyWithSyntaxHighlighting: true,
  definitionLinkOpensInPeek: true,
  folding: true,
  foldingHighlight: true,
  foldingStrategy: 'auto',
  fontLigatures: true,
  formatOnSave: true,
  hideCursorInOverviewRuler: true,
  overviewRulerBorder: false,
  overviewRulerLanes: 0,
  padding: {
    top: 16,
    bottom: 16,
  },
  scrollbar: {
    vertical: 'visible',
    horizontal: 'visible',
    verticalScrollbarSize: 12,
    horizontalScrollbarSize: 12,
    useShadows: true,
  },
}; 