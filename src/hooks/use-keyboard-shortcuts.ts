'use client';

import { useEffect, useCallback } from 'react';

interface KeyboardShortcut {
  key: string;
  ctrlKey?: boolean;
  shiftKey?: boolean;
  altKey?: boolean;
  metaKey?: boolean;
  action: () => void;
  description: string;
}

export function useKeyboardShortcuts(shortcuts: KeyboardShortcut[]) {
  const handleKeyDown = useCallback(
    (event: KeyboardEvent) => {
      // Debug logging
      console.log('Key pressed:', {
        key: event.key,
        ctrlKey: event.ctrlKey,
        shiftKey: event.shiftKey,
        altKey: event.altKey,
        metaKey: event.metaKey,
        target: event.target
      });

      const matchingShortcut = shortcuts.find(
        (shortcut) => {
          const keyMatch = shortcut.key.toLowerCase() === event.key.toLowerCase();
          const ctrlMatch = !!shortcut.ctrlKey === event.ctrlKey;
          const shiftMatch = !!shortcut.shiftKey === event.shiftKey;
          const altMatch = !!shortcut.altKey === event.altKey;
          const metaMatch = !!shortcut.metaKey === event.metaKey;
          
          console.log('Checking shortcut:', {
            shortcut: shortcut.key,
            keyMatch,
            ctrlMatch,
            shiftMatch,
            altMatch,
            metaMatch,
            matches: keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch
          });
          
          return keyMatch && ctrlMatch && shiftMatch && altMatch && metaMatch;
        }
      );

      if (matchingShortcut) {
        console.log('Shortcut matched:', matchingShortcut.key, matchingShortcut.description);
        event.preventDefault();
        event.stopPropagation();
        matchingShortcut.action();
      }
    },
    [shortcuts]
  );

  useEffect(() => {
    console.log('Setting up keyboard shortcuts:', shortcuts.map(s => `${s.key} (${s.description})`));
    document.addEventListener('keydown', handleKeyDown, true);
    return () => {
      console.log('Cleaning up keyboard shortcuts');
      document.removeEventListener('keydown', handleKeyDown, true);
    };
  }, [handleKeyDown, shortcuts]);
}

// Common keyboard shortcuts for diff checker
export const DIFF_SHORTCUTS = {
  COMPARE: { key: 'Enter', ctrlKey: true, description: 'Compare/Process diff' },
  COPY: { key: 'c', ctrlKey: true, description: 'Copy to clipboard' },
  CLEAR: { key: 'k', ctrlKey: true, description: 'Clear all content' },
  EXPORT: { key: 'e', ctrlKey: true, description: 'Export diff result' },
  SWITCH_TAB: { key: 'Tab', ctrlKey: true, description: 'Switch between tabs' },
  TOGGLE_THEME: { key: 'd', ctrlKey: true, description: 'Toggle dark/light mode' },
} as const;
