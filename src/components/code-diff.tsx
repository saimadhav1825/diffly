'use client';

import { useState, useRef, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Copy, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import Editor from '@monaco-editor/react';
import { diffLines, Change } from 'diff';

interface CodeDiffProps {
  className?: string;
}

const SUPPORTED_LANGUAGES = [
  { value: 'javascript', label: 'JavaScript' },
  { value: 'typescript', label: 'TypeScript' },
  { value: 'python', label: 'Python' },
  { value: 'java', label: 'Java' },
  { value: 'kotlin', label: 'Kotlin' },
  { value: 'cpp', label: 'C++' },
  { value: 'csharp', label: 'C#' },
  { value: 'go', label: 'Go' },
  { value: 'rust', label: 'Rust' },
  { value: 'html', label: 'HTML' },
  { value: 'css', label: 'CSS' },
  { value: 'json', label: 'JSON' },
  { value: 'xml', label: 'XML' },
  { value: 'yaml', label: 'YAML' },
  { value: 'markdown', label: 'Markdown' },
  { value: 'sql', label: 'SQL' },
  { value: 'php', label: 'PHP' },
  { value: 'ruby', label: 'Ruby' },
  { value: 'swift', label: 'Swift' },
  { value: 'plaintext', label: 'Plain Text' },
];

export function CodeDiff({ className }: CodeDiffProps) {
  const [originalCode, setOriginalCode] = useState('');
  const [modifiedCode, setModifiedCode] = useState('');
  const [language, setLanguage] = useState('javascript');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'inline'>('side-by-side');
  const [ignoreWhitespace, setIgnoreWhitespace] = useState(false);
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [isDarkMode] = useState(false);

  const originalEditorRef = useRef<unknown>(null);
  const modifiedEditorRef = useRef<unknown>(null);

  // Real-time diff calculation with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (originalCode || modifiedCode) {
        const original = ignoreWhitespace ? originalCode.replace(/\s+/g, ' ') : originalCode;
        const modified = ignoreWhitespace ? modifiedCode.replace(/\s+/g, ' ') : modifiedCode;
        const diff = diffLines(original, modified);
        setDiffResult(diff);
      } else {
        setDiffResult([]);
      }
    }, 150); // 150ms debounce for code diff

    return () => clearTimeout(timeoutId);
  }, [originalCode, modifiedCode, ignoreWhitespace]);

  // Sync scroll between editors
  const handleOriginalScroll = () => {
    if (originalEditorRef.current && modifiedEditorRef.current) {
      const originalEditor = originalEditorRef.current as { getScrollTop: () => number; getScrollLeft: () => number };
      const modifiedEditor = modifiedEditorRef.current as { setScrollTop: (top: number) => void; setScrollLeft: (left: number) => void };
      const originalScrollTop = originalEditor.getScrollTop();
      const originalScrollLeft = originalEditor.getScrollLeft();
      modifiedEditor.setScrollTop(originalScrollTop);
      modifiedEditor.setScrollLeft(originalScrollLeft);
    }
  };

  // const handleModifiedScroll = () => {
  //   if (originalEditorRef.current && modifiedEditorRef.current) {
  //     const modifiedScrollTop = modifiedEditorRef.current.getScrollTop();
  //     const modifiedScrollLeft = modifiedEditorRef.current.getScrollLeft();
  //     originalEditorRef.current.setScrollTop(modifiedScrollTop);
  //     originalEditorRef.current.setScrollLeft(modifiedScrollLeft);
  //   }
  // };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Code copied to clipboard successfully');
    } catch (err) {
      console.error('Failed to copy code: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Code copied using fallback method');
    }
  };

  const handleExport = () => {
    const diffText = diffResult
      .map(change => {
        if (change.added) return `+ ${change.value}`;
        if (change.removed) return `- ${change.value}`;
        return change.value;
      })
      .join('');

    const blob = new Blob([diffText], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'code-diff-result.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setOriginalCode('');
    setModifiedCode('');
    setDiffResult([]);
  };

  const handleEditorDidMount = (editor: unknown, monaco: unknown, isOriginal: boolean) => {
    if (isOriginal) {
      originalEditorRef.current = editor;
    } else {
      modifiedEditorRef.current = editor;
    }

    // Configure editor
    const editorInstance = editor as { 
      updateOptions: (options: Record<string, unknown>) => void;
      onDidScrollChange: (callback: () => void) => void;
    };
    
    editorInstance.updateOptions({
      fontSize: 14,
      fontFamily: 'JetBrains Mono, Fira Code, monospace',
      lineNumbers: showLineNumbers ? 'on' : 'off',
      minimap: { enabled: false },
      scrollBeyondLastLine: false,
      automaticLayout: true,
      wordWrap: 'on',
      theme: isDarkMode ? 'vs-dark' : 'vs-light',
    });

    // Add scroll listeners
    editorInstance.onDidScrollChange(handleOriginalScroll);
  };

  const renderInlineDiff = () => {
    return (
      <div className="space-y-1">
        {diffResult.map((change, index) => (
          <motion.div
            key={index}
            initial={{ opacity: 0, x: -10 }}
            animate={{ opacity: 1, x: 0 }}
            transition={{ delay: index * 0.01 }}
            className={`p-2 rounded ${
              change.added
                ? 'bg-diff-added text-green-800 dark:text-green-200'
                : change.removed
                ? 'bg-diff-removed text-red-800 dark:text-red-200'
                : 'bg-transparent'
            }`}
          >
            <pre className="whitespace-pre-wrap text-sm font-mono">
              {change.value}
            </pre>
          </motion.div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Code Diff Checker</h2>
          <p className="text-muted-foreground">Compare code with syntax highlighting and advanced features</p>
        </div>
        
        <div className="flex items-center gap-2">
          <Button
            variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('side-by-side')}
            className={`${viewMode === 'side-by-side' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/25' : 'border-blue-500/50 text-blue-600 hover:bg-blue-50 hover:border-blue-600'}`}
          >
            <Eye className="h-4 w-4 mr-2" />
            Side-by-side
          </Button>
          <Button
            variant={viewMode === 'inline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('inline')}
            className={`${viewMode === 'inline' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/25' : 'border-blue-500/50 text-blue-600 hover:bg-blue-50 hover:border-blue-600'}`}
          >
            <EyeOff className="h-4 w-4 mr-2" />
            Inline
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="flex flex-wrap items-center gap-4 p-4 border border-border rounded-lg bg-muted/20">
        <div className="flex items-center gap-2">
          <label className="text-sm font-medium text-foreground">Language:</label>
          <select
            value={language}
            onChange={(e) => setLanguage(e.target.value)}
            className="px-3 py-1 border border-border rounded bg-background text-foreground text-sm"
          >
            {SUPPORTED_LANGUAGES.map((lang) => (
              <option key={lang.value} value={lang.value}>
                {lang.label}
              </option>
            ))}
          </select>
        </div>

        <div className="flex items-center gap-4">
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={ignoreWhitespace}
              onChange={(e) => setIgnoreWhitespace(e.target.checked)}
              className="rounded border-border"
            />
            Ignore whitespace
          </label>
          
          <label className="flex items-center gap-2 text-sm">
            <input
              type="checkbox"
              checked={showLineNumbers}
              onChange={(e) => setShowLineNumbers(e.target.checked)}
              className="rounded border-border"
            />
            Show line numbers
          </label>
        </div>
      </div>

      {/* Code Editors */}
      {viewMode === 'side-by-side' ? (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {/* Original Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                💻 Original Code
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(originalCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="diff-original-container overflow-hidden">
              <Editor
                height="400px"
                language={language}
                value={originalCode}
                onChange={(value) => setOriginalCode(value || '')}
                onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, true)}
                theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  lineNumbers: showLineNumbers ? 'on' : 'off',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>

          {/* Modified Code */}
          <div className="space-y-2">
            <div className="flex items-center justify-between">
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
                🔧 Modified Code
              </h3>
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(modifiedCode)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            </div>
            <div className="diff-modified-container overflow-hidden">
              <Editor
                height="400px"
                language={language}
                value={modifiedCode}
                onChange={(value) => setModifiedCode(value || '')}
                onMount={(editor, monaco) => handleEditorDidMount(editor, monaco, false)}
                theme={isDarkMode ? 'vs-dark' : 'vs-light'}
                options={{
                  fontSize: 14,
                  fontFamily: 'JetBrains Mono, Fira Code, monospace',
                  lineNumbers: showLineNumbers ? 'on' : 'off',
                  minimap: { enabled: false },
                  scrollBeyondLastLine: false,
                  automaticLayout: true,
                  wordWrap: 'on',
                }}
              />
            </div>
          </div>
        </div>
      ) : (
        <div className="space-y-2">
          <h3 className="text-sm font-medium text-muted-foreground">Inline Diff View</h3>
          <div className="border border-border rounded-lg p-4 bg-muted/20 min-h-[400px] overflow-auto">
            {renderInlineDiff()}
          </div>
        </div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleClear} variant="outline">
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        <Button onClick={handleExport} variant="outline">
          <Download className="h-4 w-4 mr-2" />
          Export Diff
        </Button>
      </div>

      {/* Diff Statistics */}
      {diffResult.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-border rounded-lg bg-muted/20"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📊 Code Difference Analysis
          </h3>
          <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-md">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+{diffResult.filter(change => change.added).length}</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Added Lines</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-700 shadow-md">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">-{diffResult.filter(change => change.removed).length}</div>
              <div className="text-sm text-rose-700 dark:text-rose-300 font-medium">Removed Lines</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/20 dark:to-gray-800/20 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">{diffResult.filter(change => !change.added && !change.removed).length}</div>
              <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Unchanged Lines</div>
            </div>
          </div>
        </motion.div>
      )}
    </div>
  );
}
