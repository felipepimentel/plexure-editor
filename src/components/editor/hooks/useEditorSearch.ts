import { useCallback, useState } from 'react';
import type * as monaco from 'monaco-editor';

interface SearchState {
  isVisible: boolean;
  searchTerm: string;
  replaceTerm: string;
  matchCase: boolean;
  useRegex: boolean;
  wholeWord: boolean;
  matchCount: number;
}

export function useEditorSearch(editor: monaco.editor.IStandaloneCodeEditor | null) {
  const [searchState, setSearchState] = useState<SearchState>({
    isVisible: false,
    searchTerm: '',
    replaceTerm: '',
    matchCase: false,
    useRegex: false,
    wholeWord: false,
    matchCount: 0
  });

  // Toggle search widget
  const toggleSearch = useCallback(() => {
    if (!editor) return;

    if (!searchState.isVisible) {
      editor.trigger('search', 'actions.find', null);
      setSearchState(prev => ({ ...prev, isVisible: true }));
    } else {
      editor.trigger('search', 'closeFindWidget', null);
      setSearchState(prev => ({ ...prev, isVisible: false }));
    }
  }, [editor, searchState.isVisible]);

  // Update search options
  const updateSearchOptions = useCallback((options: Partial<SearchState>) => {
    if (!editor) return;

    setSearchState(prev => ({ ...prev, ...options }));

    const findController = editor.getContribution('editor.contrib.findController');
    if (findController && 'updateSearchOptions' in findController) {
      (findController as any).updateSearchOptions({
        isRegex: options.useRegex,
        matchCase: options.matchCase,
        wholeWord: options.wholeWord
      });
    }
  }, [editor]);

  // Find next/previous
  const findNext = useCallback(() => {
    editor?.trigger('search', 'editor.action.nextMatchFindAction', null);
  }, [editor]);

  const findPrevious = useCallback(() => {
    editor?.trigger('search', 'editor.action.previousMatchFindAction', null);
  }, [editor]);

  // Replace current/all
  const replaceCurrent = useCallback(() => {
    if (!editor || !searchState.searchTerm) return;

    editor.trigger('search', 'editor.action.replaceOne', null);
  }, [editor, searchState.searchTerm]);

  const replaceAll = useCallback(() => {
    if (!editor || !searchState.searchTerm) return;

    editor.trigger('search', 'editor.action.replaceAll', null);
  }, [editor, searchState.searchTerm]);

  // Register keyboard shortcuts
  const registerShortcuts = useCallback(() => {
    if (!editor) return;

    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyF, toggleSearch);
    editor.addCommand(monaco.KeyMod.CtrlCmd | monaco.KeyCode.KeyH, () => {
      toggleSearch();
      const findController = editor.getContribution('editor.contrib.findController');
      if (findController && 'toggleReplace' in findController) {
        (findController as any).toggleReplace();
      }
    });

    editor.addCommand(monaco.KeyCode.F3, findNext);
    editor.addCommand(monaco.KeyMod.Shift | monaco.KeyCode.F3, findPrevious);
  }, [editor, toggleSearch, findNext, findPrevious]);

  // Update match count
  const updateMatchCount = useCallback(() => {
    if (!editor || !searchState.searchTerm) {
      setSearchState(prev => ({ ...prev, matchCount: 0 }));
      return;
    }

    const model = editor.getModel();
    if (!model) return;

    const matches = model.findMatches(
      searchState.searchTerm,
      true,
      searchState.useRegex,
      searchState.matchCase,
      searchState.wholeWord ? '\\b' : '',
      false
    );

    setSearchState(prev => ({ ...prev, matchCount: matches.length }));
  }, [editor, searchState.searchTerm, searchState.useRegex, searchState.matchCase, searchState.wholeWord]);

  return {
    searchState,
    toggleSearch,
    updateSearchOptions,
    findNext,
    findPrevious,
    replaceCurrent,
    replaceAll,
    registerShortcuts,
    updateMatchCount
  };
} 