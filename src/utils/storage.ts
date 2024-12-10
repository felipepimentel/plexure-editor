const STORAGE_KEY = 'swagger-editor-spec';

export const storage = {
  saveSpec: (spec: string) => {
    try {
      localStorage.setItem(STORAGE_KEY, spec);
      return true;
    } catch (error) {
      console.error('Failed to save specification:', error);
      return false;
    }
  },

  loadSpec: () => {
    try {
      return localStorage.getItem(STORAGE_KEY);
    } catch (error) {
      console.error('Failed to load specification:', error);
      return null;
    }
  },

  exportSpec: (spec: string, filename: string = 'swagger-spec.yaml') => {
    const blob = new Blob([spec], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = filename;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  },

  importSpec: () => {
    return new Promise<string>((resolve, reject) => {
      const input = document.createElement('input');
      input.type = 'file';
      input.accept = '.yaml,.yml,.json';
      
      input.onchange = async (e) => {
        const file = (e.target as HTMLInputElement).files?.[0];
        if (!file) {
          reject(new Error('No file selected'));
          return;
        }

        try {
          const text = await file.text();
          resolve(text);
        } catch (error) {
          reject(error);
        }
      };

      input.click();
    });
  }
};