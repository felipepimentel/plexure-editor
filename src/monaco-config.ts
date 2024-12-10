import * as monaco from 'monaco-editor';

// Configurar o ambiente do Monaco
self.MonacoEnvironment = {
  getWorker(_, label) {
    const getWorkerModule = (moduleUrl: string) => {
      return new Worker(new URL(moduleUrl, import.meta.url), {
        type: 'module'
      });
    };

    if (label === 'json') {
      return getWorkerModule('monaco-editor/esm/vs/language/json/json.worker?worker');
    }
    if (label === 'css' || label === 'scss' || label === 'less') {
      return getWorkerModule('monaco-editor/esm/vs/language/css/css.worker?worker');
    }
    if (label === 'html' || label === 'handlebars' || label === 'razor') {
      return getWorkerModule('monaco-editor/esm/vs/language/html/html.worker?worker');
    }
    if (label === 'typescript' || label === 'javascript') {
      return getWorkerModule('monaco-editor/esm/vs/language/typescript/ts.worker?worker');
    }
    return getWorkerModule('monaco-editor/esm/vs/editor/editor.worker?worker');
  }
};

// Configurações do TypeScript
monaco.languages.typescript.javascriptDefaults.setEagerModelSync(true); 