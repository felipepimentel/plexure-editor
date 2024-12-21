import { editor } from "monaco-editor";
import React from "react";
import { EditorPanels } from "./components/EditorPanels";
import { MainMenu } from "./components/MainMenu";
import { TooltipProvider } from "./components/ui/TooltipComponent";
import { handleSendMessage } from "./lib/chat";
import { DEFAULT_CONTENT } from "./lib/constants";
import { FileManager } from "./lib/file-manager";
import type { Message, ValidationMessage } from "./lib/types";
import { validateContent } from "./lib/validation";

const App: React.FC = () => {
  const [theme, setTheme] = React.useState("system");
  const [showSidebar, setShowSidebar] = React.useState(true);
  const [showPreview, setShowPreview] = React.useState(true);
  const [fileManager, setFileManager] = React.useState<FileManager | null>(null);
  const [messages, setMessages] = React.useState<Message[]>([]);
  const [validationMessages, setValidationMessages] = React.useState<ValidationMessage[]>([]);
  const [isValidating, setIsValidating] = React.useState(false);
  const [parsedSpec, setParsedSpec] = React.useState<any>(null);
  const [editorInstance, setEditorInstance] = React.useState<editor.IStandaloneCodeEditor | undefined>();

  React.useEffect(() => {
    const fm = new FileManager();
    fm.createNewFile(DEFAULT_CONTENT);
    setFileManager(fm);

    const validateInitialContent = async () => {
      setIsValidating(true);
      try {
        const { messages, parsedSpec } = await validateContent(DEFAULT_CONTENT);
        setValidationMessages(messages);
        setParsedSpec(parsedSpec);
      } catch (error) {
        console.error("Initial validation error:", error);
        setValidationMessages([{
          id: "error",
          type: "error",
          message: error instanceof Error ? error.message : "Unknown error"
        }]);
        setParsedSpec(null);
      } finally {
        setIsValidating(false);
      }
    };

    validateInitialContent();
  }, []);

  React.useEffect(() => {
    const root = window.document.documentElement;
    root.classList.remove("light", "dark");
    if (theme === "system") {
      const systemTheme = window.matchMedia("(prefers-color-scheme: dark)").matches
        ? "dark"
        : "light";
      root.classList.add(systemTheme);
    } else {
      root.classList.add(theme);
    }
  }, [theme]);

  const handleThemeChange = (newTheme: string) => setTheme(newTheme);

  const handleEditorChange = async (value: string | undefined) => {
    if (!value) return;
    setIsValidating(true);
    try {
      const { messages, parsedSpec } = await validateContent(value);
      setValidationMessages(messages);
      setParsedSpec(parsedSpec);
    } catch (error) {
      console.error("Validation error:", error);
      setValidationMessages([{
        id: "error",
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error"
      }]);
      setParsedSpec(null);
    } finally {
      setIsValidating(false);
    }
  };

  const handleChatMessage = async (message: string) => {
    await handleSendMessage(messages, message, setMessages);
  };

  const handleApplyFix = React.useCallback(async (newContent: string) => {
    if (!fileManager) return;
    
    const currentFile = fileManager.getCurrentFile();
    if (!currentFile) return;

    // Update file content
    fileManager.updateContent(newContent);
    
    // Trigger validation with all rules
    setIsValidating(true);
    try {
      const { messages, parsedSpec } = await validateContent(newContent, {
        customRules: true,
        standardRules: true,
        includeSuggestions: true
      });
      setValidationMessages(messages);
      setParsedSpec(parsedSpec);
    } catch (error) {
      console.error("Validation error:", error);
      setValidationMessages([{
        id: "error",
        type: "error",
        message: error instanceof Error ? error.message : "Unknown error"
      }]);
      setParsedSpec(null);
    } finally {
      setIsValidating(false);
    }
  }, [fileManager]);

  const handleEditorMount = React.useCallback((editor: editor.IStandaloneCodeEditor) => {
    console.log('Editor instance set:', editor);
    setEditorInstance(editor);
  }, []);

  React.useEffect(() => {
    if (editorInstance) {
      console.log('Editor instance available:', editorInstance);
    }
  }, [editorInstance]);

  const handleValidationUpdate = React.useCallback((messages: ValidationMessage[], newParsedSpec: any) => {
    setValidationMessages(messages);
    setParsedSpec(newParsedSpec);
  }, []);

  return (
    <TooltipProvider>
      <div className="h-screen flex flex-col bg-[#0D1117] text-gray-300">
        <MainMenu
          theme={theme}
          showSidebar={showSidebar}
          showPreview={showPreview}
          onThemeChange={handleThemeChange}
          onToggleSidebar={() => setShowSidebar(!showSidebar)}
          onTogglePreview={() => setShowPreview(!showPreview)}
          onNewFile={() => fileManager?.createNewFile()}
          onOpenFile={() => fileManager?.openFile()}
          onSaveFile={() => fileManager?.saveCurrentFile()}
          onExportYAML={() => fileManager?.downloadYAML()}
          onExportJSON={() => fileManager?.downloadJSON()}
        />
        <EditorPanels
          messages={messages}
          onSendMessage={handleChatMessage}
          onChange={handleEditorChange}
          isDarkMode={theme === "dark" || (theme === "system" && window.matchMedia("(prefers-color-scheme: dark)").matches)}
          environment={{}}
          fileManager={fileManager}
          showPreview={showPreview}
          onTogglePreview={() => setShowPreview(!showPreview)}
          validationMessages={validationMessages}
          isValidating={isValidating}
          parsedSpec={parsedSpec}
          editorInstance={editorInstance}
          onEditorMount={handleEditorMount}
          onValidationUpdate={handleValidationUpdate}
        />
      </div>
    </TooltipProvider>
  );
};

export default App;
