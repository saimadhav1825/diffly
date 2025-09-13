'use client';

import { useKeyboardShortcuts, DIFF_SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';
import { useTheme } from './theme-provider';
import { useState } from 'react';

export function GlobalShortcuts() {
  const { theme, setTheme } = useTheme();
  const [activeTab, setActiveTab] = useState(0);
  const tabs = ['text', 'code', 'file', 'folder'];

  const toggleTheme = () => {
    setTheme(theme === 'dark' ? 'light' : 'dark');
    console.log('Theme toggled to:', theme === 'dark' ? 'light' : 'dark');
  };

  const switchTab = () => {
    setActiveTab((prev) => (prev + 1) % tabs.length);
    console.log('Switched to tab:', tabs[(activeTab + 1) % tabs.length]);
  };

  const showShortcuts = () => {
    console.log('Available shortcuts:');
    console.log('Ctrl+D: Toggle theme');
    console.log('Ctrl+Tab: Switch tabs');
    console.log('Ctrl+Enter: Compare/Process diff');
    console.log('Ctrl+C: Copy to clipboard');
    console.log('Ctrl+K: Clear all content');
    console.log('Ctrl+E: Export diff result');
  };

  useKeyboardShortcuts([
    {
      ...DIFF_SHORTCUTS.TOGGLE_THEME,
      action: toggleTheme,
    },
    {
      ...DIFF_SHORTCUTS.SWITCH_TAB,
      action: switchTab,
    },
    {
      key: '?',
      ctrlKey: true,
      action: showShortcuts,
      description: 'Show all shortcuts',
    },
  ]);

  return null; // This component doesn't render anything
}
