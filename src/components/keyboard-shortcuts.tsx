'use client';

import { useState } from 'react';
import { motion, AnimatePresence } from 'framer-motion';
import { Button } from './ui/button';
import { X, Keyboard } from 'lucide-react';
import { DIFF_SHORTCUTS } from '@/hooks/use-keyboard-shortcuts';

interface KeyboardShortcutsProps {
  className?: string;
}

export function KeyboardShortcuts({ className }: KeyboardShortcutsProps) {
  const [isOpen, setIsOpen] = useState(false);

  const shortcuts = [
    { ...DIFF_SHORTCUTS.COMPARE, keys: 'Ctrl + Enter' },
    { ...DIFF_SHORTCUTS.COPY, keys: 'Ctrl + C' },
    { ...DIFF_SHORTCUTS.CLEAR, keys: 'Ctrl + K' },
    { ...DIFF_SHORTCUTS.EXPORT, keys: 'Ctrl + E' },
    { ...DIFF_SHORTCUTS.SWITCH_TAB, keys: 'Ctrl + Tab' },
    { ...DIFF_SHORTCUTS.TOGGLE_THEME, keys: 'Ctrl + D' },
  ];

  return (
    <>
      <Button
        variant="outline"
        size="sm"
        onClick={() => setIsOpen(true)}
        className={className}
      >
        <Keyboard className="h-4 w-4 mr-2" />
        Shortcuts
      </Button>

      <AnimatePresence>
        {isOpen && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 backdrop-blur-sm"
            onClick={() => setIsOpen(false)}
          >
            <motion.div
              initial={{ opacity: 0, scale: 0.95, y: 20 }}
              animate={{ opacity: 1, scale: 1, y: 0 }}
              exit={{ opacity: 0, scale: 0.95, y: 20 }}
              className="bg-background border border-border rounded-lg p-6 max-w-md w-full mx-4 shadow-xl"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-xl font-semibold text-foreground">Keyboard Shortcuts</h2>
                <Button
                  variant="ghost"
                  size="sm"
                  onClick={() => setIsOpen(false)}
                >
                  <X className="h-4 w-4" />
                </Button>
              </div>

              <div className="space-y-3">
                {shortcuts.map((shortcut, index) => (
                  <motion.div
                    key={shortcut.key}
                    initial={{ opacity: 0, x: -20 }}
                    animate={{ opacity: 1, x: 0 }}
                    transition={{ delay: index * 0.1 }}
                    className="flex items-center justify-between py-2"
                  >
                    <span className="text-sm text-muted-foreground">
                      {shortcut.description}
                    </span>
                    <kbd className="px-2 py-1 text-xs font-mono bg-muted border border-border rounded">
                      {shortcut.keys}
                    </kbd>
                  </motion.div>
                ))}
              </div>

              <div className="mt-6 pt-4 border-t border-border">
                <p className="text-xs text-muted-foreground text-center">
                  Press <kbd className="px-1 py-0.5 text-xs font-mono bg-muted border border-border rounded">Esc</kbd> to close
                </p>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </>
  );
}
