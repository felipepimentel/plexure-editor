import { FileManager } from './file-manager';
import { DEFAULT_CONTENT } from './constants';

export const initializeFileManager = async (): Promise<FileManager> => {
  const fm = new FileManager();
  const file = await fm.createNewFile('untitled.yaml');
  file.content = DEFAULT_CONTENT;
  fm.setCurrentFile(file);
  return fm;
}; 