/// <reference types="vite/client" />
/// <reference types="monaco-editor/monaco" />

interface ImportMetaEnv {
  readonly VITE_APP_TITLE: string
}

interface ImportMeta {
  readonly env: ImportMetaEnv
}
