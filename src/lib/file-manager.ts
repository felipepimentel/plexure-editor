import { parse, stringify } from 'yaml';

interface FileType {
  name: string;
  content: string;
  path?: string;
  isDirty: boolean;
}

export class FileManager {
  private currentFile: FileType | null = null;
  private recentFiles: FileType[] = [];
  private changeCallback: ((file: FileType) => void) | null = null;

  constructor() {
    this.loadRecentFiles();
  }

  onChange(callback: (file: FileType) => void) {
    this.changeCallback = callback;
  }

  private notifyChange() {
    if (this.currentFile && this.changeCallback) {
      this.changeCallback(this.currentFile);
    }
  }

  private loadRecentFiles() {
    try {
      const saved = localStorage.getItem('recentFiles');
      if (saved) {
        this.recentFiles = JSON.parse(saved);
      }
    } catch (error) {
      console.error('Error loading recent files:', error);
    }
  }

  private saveRecentFiles() {
    try {
      localStorage.setItem('recentFiles', JSON.stringify(this.recentFiles));
    } catch (error) {
      console.error('Error saving recent files:', error);
    }
  }

  getCurrentFile(): FileType | null {
    return this.currentFile;
  }

  getRecentFiles(): FileType[] {
    return this.recentFiles;
  }

  createNewFile(content: string = '') {
    this.currentFile = {
      name: 'untitled.yaml',
      content,
      isDirty: false
    };
    this.notifyChange();
  }

  async openFile() {
    try {
      const [fileHandle] = await window.showOpenFilePicker({
        types: [
          {
            description: 'YAML Files',
            accept: {
              'text/yaml': ['.yaml', '.yml']
            }
          }
        ]
      });
      
      const file = await fileHandle.getFile();
      const content = await file.text();
      
      this.currentFile = {
        name: file.name,
        content,
        path: fileHandle.name,
        isDirty: false
      };

      this.addToRecentFiles(this.currentFile);
      this.notifyChange();
    } catch (error) {
      console.error('Error opening file:', error);
    }
  }

  async saveCurrentFile() {
    if (!this.currentFile) return;

    try {
      const handle = await window.showSaveFilePicker({
        suggestedName: this.currentFile.name,
        types: [
          {
            description: 'YAML Files',
            accept: {
              'text/yaml': ['.yaml', '.yml']
            }
          }
        ]
      });

      const writable = await handle.createWritable();
      await writable.write(this.currentFile.content);
      await writable.close();

      this.currentFile.isDirty = false;
      this.currentFile.path = handle.name;
      this.addToRecentFiles(this.currentFile);
      this.notifyChange();
    } catch (error) {
      console.error('Error saving file:', error);
    }
  }

  updateContent(content: string) {
    if (this.currentFile) {
      this.currentFile.content = content;
      this.currentFile.isDirty = true;
      this.notifyChange();
    }
  }

  private addToRecentFiles(file: FileType) {
    const index = this.recentFiles.findIndex(f => f.path === file.path);
    if (index !== -1) {
      this.recentFiles.splice(index, 1);
    }
    this.recentFiles.unshift({ ...file });
    if (this.recentFiles.length > 10) {
      this.recentFiles.pop();
    }
    this.saveRecentFiles();
  }

  async downloadYAML() {
    if (!this.currentFile) return;
    
    const blob = new Blob([this.currentFile.content], { type: 'text/yaml' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = this.currentFile.name;
    document.body.appendChild(a);
    a.click();
    document.body.removeChild(a);
    URL.revokeObjectURL(url);
  }

  async downloadJSON() {
    if (!this.currentFile) return;
    
    try {
      const yamlContent = parse(this.currentFile.content);
      const jsonContent = JSON.stringify(yamlContent, null, 2);
      const blob = new Blob([jsonContent], { type: 'application/json' });
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = this.currentFile.name.replace(/\.ya?ml$/, '.json');
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch (error) {
      console.error('Error converting to JSON:', error);
    }
  }

  formatContent() {
    if (!this.currentFile) return;
    
    try {
      const parsed = parse(this.currentFile.content);
      this.currentFile.content = stringify(parsed, { indent: 2 });
      this.currentFile.isDirty = true;
      this.notifyChange();
    } catch (error) {
      console.error('Error formatting content:', error);
    }
  }
}
