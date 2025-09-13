'use client';

import { useState, useEffect } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Copy, Download, RotateCcw, Eye, EyeOff } from 'lucide-react';
import { diffWords, Change } from 'diff';

interface TextDiffProps {
  className?: string;
}

export function TextDiff({ className }: TextDiffProps) {
  const [originalText, setOriginalText] = useState('');
  const [modifiedText, setModifiedText] = useState('');
  const [viewMode, setViewMode] = useState<'side-by-side' | 'inline'>('side-by-side');
  const [showWhitespace, setShowWhitespace] = useState(true);
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [diffStats, setDiffStats] = useState({
    added: 0,
    removed: 0,
    unchanged: 0,
    totalChanges: 0
  });

  // Real-time diff calculation with debouncing
  useEffect(() => {
    const timeoutId = setTimeout(() => {
      if (originalText || modifiedText) {
        const diff = diffWords(originalText, modifiedText);
        setDiffResult(diff);
        
        // Calculate real-time statistics
        const stats = {
          added: diff.filter(change => change.added).length,
          removed: diff.filter(change => change.removed).length,
          unchanged: diff.filter(change => !change.added && !change.removed).length,
          totalChanges: diff.filter(change => change.added || change.removed).length
        };
        setDiffStats(stats);
      } else {
        setDiffResult([]);
        setDiffStats({ added: 0, removed: 0, unchanged: 0, totalChanges: 0 });
      }
    }, 100); // 100ms debounce for real-time updates

    return () => clearTimeout(timeoutId);
  }, [originalText, modifiedText]);

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('Text copied to clipboard successfully');
      // You could add a toast notification here
    } catch (err) {
      console.error('Failed to copy text: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('Text copied using fallback method');
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
    a.download = 'diff-result.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setOriginalText('');
    setModifiedText('');
    setDiffResult([]);
  };

  const renderDiffContent = () => {
    if (viewMode === 'inline') {
      return (
        <div className="space-y-2">
          {diffResult.map((change, index) => (
            <motion.span
              key={index}
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: index * 0.01 }}
              className={`inline-block ${
                change.added
                  ? 'diff-highlight-added'
                  : change.removed
                  ? 'diff-highlight-removed'
                  : 'bg-transparent text-foreground'
              }`}
            >
              {change.value}
            </motion.span>
          ))}
        </div>
      );
    }

    // Side-by-side view
    return (
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
        {/* Original Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
              📄 Original Text
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(originalText)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="min-h-[200px] p-4 diff-original-container">
            {originalText ? (
              <div className="diff-original-text">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {originalText}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Enter original text here...</p>
            )}
          </div>
        </div>

        {/* Modified Text */}
        <div className="space-y-2">
          <div className="flex items-center justify-between">
            <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
              ✏️ Modified Text
            </h3>
            <Button
              variant="ghost"
              size="sm"
              onClick={() => handleCopy(modifiedText)}
            >
              <Copy className="h-4 w-4" />
            </Button>
          </div>
          <div className="min-h-[200px] p-4 diff-modified-container">
            {modifiedText ? (
              <div className="diff-modified-text">
                <pre className="whitespace-pre-wrap text-sm font-mono">
                  {modifiedText}
                </pre>
              </div>
            ) : (
              <p className="text-muted-foreground text-sm">Enter modified text here...</p>
            )}
          </div>
        </div>
      </div>
    );
  };

  return (
    <motion.div 
      className={`space-y-8 ${className}`}
      initial={{ opacity: 0, y: 20 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.6 }}
    >
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-6">
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.1 }}
        >
          <h2 className="text-3xl font-bold bg-gradient-to-r from-foreground to-foreground/80 bg-clip-text text-transparent mb-2">
            Text Diff Checker
          </h2>
          <p className="text-muted-foreground text-lg">Compare two text inputs and see the differences in real-time</p>
        </motion.div>
        
        <motion.div 
          className="flex items-center gap-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.2 }}
        >
          <Button
            variant={viewMode === 'side-by-side' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('side-by-side')}
            className={`group ${viewMode === 'side-by-side' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/25' : 'border-blue-500/50 text-blue-600 hover:bg-blue-50 hover:border-blue-600'}`}
          >
            <motion.div
              animate={{ rotate: viewMode === 'side-by-side' ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <Eye className="h-4 w-4 mr-2" />
            </motion.div>
            Side-by-side
          </Button>
          <Button
            variant={viewMode === 'inline' ? 'default' : 'outline'}
            size="sm"
            onClick={() => setViewMode('inline')}
            className={`group ${viewMode === 'inline' ? 'bg-gradient-to-r from-blue-500 to-blue-600 hover:from-blue-600 hover:to-blue-700 text-white border-0 shadow-lg hover:shadow-blue-500/25' : 'border-blue-500/50 text-blue-600 hover:bg-blue-50 hover:border-blue-600'}`}
          >
            <motion.div
              animate={{ rotate: viewMode === 'inline' ? 360 : 0 }}
              transition={{ duration: 0.3 }}
            >
              <EyeOff className="h-4 w-4 mr-2" />
            </motion.div>
            Inline
          </Button>
        </motion.div>
      </div>

      {/* Text Input Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Text Input */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: -20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.3 }}
        >
          <label className="text-sm font-semibold text-blue-600 dark:text-blue-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-blue-500 rounded-full"></div>
            Original Text
          </label>
          <div className="relative group">
            <textarea
              value={originalText}
              onChange={(e) => setOriginalText(e.target.value)}
              placeholder="Enter your original text here..."
              className="w-full min-h-[250px] p-4 border-2 border-border/50 rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-blue-500/50 focus:border-blue-500/50 resize-none font-mono text-sm transition-all duration-300 hover:border-blue-500/30 hover:bg-background/80 backdrop-blur-sm"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-3 h-3 bg-blue-500/20 rounded-full"></div>
            </div>
          </div>
        </motion.div>

        {/* Modified Text Input */}
        <motion.div 
          className="space-y-3"
          initial={{ opacity: 0, x: 20 }}
          animate={{ opacity: 1, x: 0 }}
          transition={{ duration: 0.6, delay: 0.4 }}
        >
          <label className="text-sm font-semibold text-purple-600 dark:text-purple-400 flex items-center gap-2">
            <div className="w-2 h-2 bg-purple-500 rounded-full"></div>
            Modified Text
          </label>
          <div className="relative group">
            <textarea
              value={modifiedText}
              onChange={(e) => setModifiedText(e.target.value)}
              placeholder="Enter your modified text here..."
              className="w-full min-h-[250px] p-4 border-2 border-border/50 rounded-xl bg-background/50 text-foreground placeholder:text-muted-foreground focus:outline-none focus:ring-2 focus:ring-purple-500/50 focus:border-purple-500/50 resize-none font-mono text-sm transition-all duration-300 hover:border-purple-500/30 hover:bg-background/80 backdrop-blur-sm"
            />
            <div className="absolute top-2 right-2 opacity-0 group-hover:opacity-100 transition-opacity duration-300">
              <div className="w-3 h-3 bg-purple-500/20 rounded-full"></div>
            </div>
          </div>
        </motion.div>
      </div>

      {/* Action Buttons */}
      <motion.div 
        className="flex flex-wrap items-center gap-4 p-4 bg-muted/30 rounded-xl border border-border/50"
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ duration: 0.6, delay: 0.5 }}
      >
        <div className="flex items-center gap-3">
          <Button onClick={handleClear} variant="outline" className="group">
            <motion.div
              animate={{ rotate: 0 }}
              whileHover={{ rotate: -180 }}
              transition={{ duration: 0.3 }}
            >
              <RotateCcw className="h-4 w-4 mr-2" />
            </motion.div>
            Clear All
          </Button>
          <Button onClick={handleExport} variant="outline" className="group">
            <motion.div
              animate={{ y: 0 }}
              whileHover={{ y: -2 }}
              transition={{ duration: 0.2 }}
            >
              <Download className="h-4 w-4 mr-2" />
            </motion.div>
            Export Diff
          </Button>
        </div>
        
        <div className="flex items-center gap-3 ml-auto">
          <motion.label 
            className="flex items-center gap-3 text-sm font-medium cursor-pointer group"
            whileHover={{ scale: 1.02 }}
          >
            <div className="relative">
              <input
                type="checkbox"
                checked={showWhitespace}
                onChange={(e) => setShowWhitespace(e.target.checked)}
                className="sr-only"
              />
              <motion.div
                className={`w-5 h-5 rounded-md border-2 transition-all duration-200 ${
                  showWhitespace 
                    ? 'bg-primary-500 border-primary-500' 
                    : 'border-border hover:border-primary-500/50'
                }`}
                animate={{ scale: showWhitespace ? 1.1 : 1 }}
                transition={{ duration: 0.2 }}
              >
                {showWhitespace && (
                  <motion.div
                    className="absolute inset-0 flex items-center justify-center"
                    initial={{ scale: 0 }}
                    animate={{ scale: 1 }}
                    transition={{ duration: 0.2 }}
                  >
                    <div className="w-2 h-2 bg-white rounded-sm"></div>
                  </motion.div>
                )}
              </motion.div>
            </div>
            <span className="text-muted-foreground group-hover:text-foreground transition-colors">
              Show whitespace
            </span>
          </motion.label>
        </div>
      </motion.div>

      {/* Real-time Statistics */}
      {(originalText || modifiedText) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-border rounded-lg bg-muted/20"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📊 Live Difference Analysis
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-md hover-lift hover-scale"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.1 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-3xl font-bold text-emerald-600 dark:text-emerald-400"
                key={diffStats.added}
                initial={{ scale: 1.2, color: "#10b981" }}
                animate={{ scale: 1, color: "" }}
                transition={{ duration: 0.3 }}
              >
                +{diffStats.added}
              </motion.div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Added Words</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-700 shadow-md hover-lift hover-scale"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.2 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-3xl font-bold text-rose-600 dark:text-rose-400"
                key={diffStats.removed}
                initial={{ scale: 1.2, color: "#f43f5e" }}
                animate={{ scale: 1, color: "" }}
                transition={{ duration: 0.3 }}
              >
                -{diffStats.removed}
              </motion.div>
              <div className="text-sm text-rose-700 dark:text-rose-300 font-medium">Removed Words</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/20 dark:to-gray-800/20 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md hover-lift hover-scale"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.3 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-3xl font-bold text-slate-600 dark:text-slate-400"
                key={diffStats.unchanged}
                initial={{ scale: 1.2 }}
                animate={{ scale: 1 }}
                transition={{ duration: 0.3 }}
              >
                {diffStats.unchanged}
              </motion.div>
              <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Unchanged</div>
            </motion.div>
            <motion.div 
              className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700 shadow-md hover-lift hover-scale"
              initial={{ opacity: 0, scale: 0.8 }}
              animate={{ opacity: 1, scale: 1 }}
              transition={{ duration: 0.5, delay: 0.4 }}
              whileHover={{ scale: 1.05 }}
            >
              <motion.div 
                className="text-3xl font-bold text-indigo-600 dark:text-indigo-400"
                key={diffStats.totalChanges}
                initial={{ scale: 1.2, color: "#6366f1" }}
                animate={{ scale: 1, color: "" }}
                transition={{ duration: 0.3 }}
              >
                {diffStats.totalChanges}
              </motion.div>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Total Changes</div>
            </motion.div>
          </div>
        </motion.div>
      )}

      {/* Diff Results */}
      {diffResult.length > 0 && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-4"
        >
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground flex items-center gap-2">
              🔍 Live Diff Results
            </h3>
            <div className="flex items-center gap-4 text-sm">
              <div className="flex items-center gap-2 px-3 py-1 bg-green-100 dark:bg-green-900/30 rounded-full">
                <div className="w-3 h-3 bg-green-500 rounded-full"></div>
                <span className="text-green-700 dark:text-green-300 font-medium">Added</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-red-100 dark:bg-red-900/30 rounded-full">
                <div className="w-3 h-3 bg-red-500 rounded-full"></div>
                <span className="text-red-700 dark:text-red-300 font-medium">Removed</span>
              </div>
              <div className="flex items-center gap-2 px-3 py-1 bg-orange-100 dark:bg-orange-900/30 rounded-full">
                <div className="w-3 h-3 bg-orange-500 rounded-full"></div>
                <span className="text-orange-700 dark:text-orange-300 font-medium">Changed</span>
              </div>
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4 bg-muted/20 min-h-[200px] overflow-auto">
            {renderDiffContent()}
          </div>
        </motion.div>
      )}
    </motion.div>
  );
}
