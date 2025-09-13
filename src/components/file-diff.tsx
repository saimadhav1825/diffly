'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Upload, FileText, Download, RotateCcw, Copy, AlertCircle } from 'lucide-react';
import { diffLines, Change } from 'diff';

interface FileDiffProps {
  className?: string;
}

interface FileData {
  name: string;
  content: string;
  size: number;
  type: string;
}

export function FileDiff({ className }: FileDiffProps) {
  const [originalFile, setOriginalFile] = useState<FileData | null>(null);
  const [modifiedFile, setModifiedFile] = useState<FileData | null>(null);
  const [diffResult, setDiffResult] = useState<Change[]>([]);
  const [diffStats, setDiffStats] = useState({
    added: 0,
    removed: 0,
    unchanged: 0,
    totalChanges: 0
  });
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originalFileInputRef = useRef<HTMLInputElement>(null);
  const modifiedFileInputRef = useRef<HTMLInputElement>(null);

  const MAX_FILE_SIZE = 10 * 1024 * 1024; // 10MB
  const SUPPORTED_TYPES = [
    'text/plain',
    'text/html',
    'text/css',
    'text/javascript',
    'application/javascript',
    'application/json',
    'application/xml',
    'text/xml',
    'text/markdown',
    'text/csv',
    'application/yaml',
    'text/yaml',
    'application/x-yaml',
    'text/x-python',
    'text/x-java-source',
    'text/x-c',
    'text/x-c++',
    'text/x-typescript',
    'application/typescript',
  ];

  const readFileContent = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_FILE_SIZE) {
        reject(new Error(`File size exceeds ${MAX_FILE_SIZE / (1024 * 1024)}MB limit`));
        return;
      }

      // More flexible file type validation
      const isTextFile = SUPPORTED_TYPES.includes(file.type) || 
                        file.name.match(/\.(txt|md|json|xml|html|css|js|ts|jsx|tsx|py|java|cpp|c|h|hpp|yaml|yml|csv|log|ini|cfg|conf|sh|bash|zsh|fish|sql|php|rb|go|rs|swift|kt|scala|r|m|mm|pl|pm|t|pod|podspec)$/i) ||
                        file.type.startsWith('text/') ||
                        file.type === 'application/octet-stream'; // Allow binary files that might be text

      if (!isTextFile) {
        reject(new Error(`Unsupported file type: ${file.type}. Please upload text-based files.`));
        return;
      }

      const reader = new FileReader();
      reader.onload = (e) => {
        const content = e.target?.result as string;
        resolve(content);
      };
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsText(file, 'UTF-8');
    });
  };

  const handleFileUpload = async (file: File, isOriginal: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      console.log('Uploading file:', file.name, 'Type:', file.type, 'Size:', file.size);
      
      const content = await readFileContent(file);
      console.log('File content length:', content.length);
      
      const fileData: FileData = {
        name: file.name,
        content,
        size: file.size,
        type: file.type,
      };

      if (isOriginal) {
        setOriginalFile(fileData);
        console.log('Original file set:', fileData.name);
      } else {
        setModifiedFile(fileData);
        console.log('Modified file set:', fileData.name);
      }

      // Real-time diff calculation if both files are present
      if (isOriginal && modifiedFile) {
        const diff = diffLines(content, modifiedFile.content);
        setDiffResult(diff);
        calculateStats(diff);
        console.log('Diff calculated for original file');
      } else if (!isOriginal && originalFile) {
        const diff = diffLines(originalFile.content, content);
        setDiffResult(diff);
        calculateStats(diff);
        console.log('Diff calculated for modified file');
      }
    } catch (err) {
      console.error('File upload error:', err);
      setError(err instanceof Error ? err.message : 'Failed to process file');
    } finally {
      setIsLoading(false);
    }
  };

  const handleFileInputChange = (e: React.ChangeEvent<HTMLInputElement>, isOriginal: boolean) => {
    console.log('File input changed:', e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log('File selected:', file.name, file.type, file.size);
      handleFileUpload(file, isOriginal);
    } else {
      console.log('No file selected');
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
  };

  const handleDrop = (e: React.DragEvent, isOriginal: boolean) => {
    e.preventDefault();
    e.stopPropagation();
    
    const files = e.dataTransfer.files;
    if (files.length > 0) {
      handleFileUpload(files[0], isOriginal);
    }
  };

  const handleCopy = async (text: string) => {
    try {
      await navigator.clipboard.writeText(text);
      console.log('File content copied to clipboard successfully');
    } catch (err) {
      console.error('Failed to copy file content: ', err);
      // Fallback for older browsers
      const textArea = document.createElement('textarea');
      textArea.value = text;
      document.body.appendChild(textArea);
      textArea.select();
      document.execCommand('copy');
      document.body.removeChild(textArea);
      console.log('File content copied using fallback method');
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
    a.download = 'file-diff-result.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const calculateStats = (diff: Change[]) => {
    const stats = {
      added: diff.filter(change => change.added).length,
      removed: diff.filter(change => change.removed).length,
      unchanged: diff.filter(change => !change.added && !change.removed).length,
      totalChanges: diff.filter(change => change.added || change.removed).length
    };
    setDiffStats(stats);
  };

  const handleClear = () => {
    setOriginalFile(null);
    setModifiedFile(null);
    setDiffResult([]);
    setDiffStats({ added: 0, removed: 0, unchanged: 0, totalChanges: 0 });
    setError(null);
    if (originalFileInputRef.current) originalFileInputRef.current.value = '';
    if (modifiedFileInputRef.current) modifiedFileInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">File Diff Checker</h2>
          <p className="text-muted-foreground">Upload and compare two files up to 10MB each</p>
        </div>
      </div>

      {/* Error Display */}
      {error && (
        <motion.div
          initial={{ opacity: 0, y: -10 }}
          animate={{ opacity: 1, y: 0 }}
          className="flex items-center gap-2 p-4 border border-red-200 bg-red-50 dark:bg-red-900/20 dark:border-red-800 rounded-lg text-red-800 dark:text-red-200"
        >
          <AlertCircle className="h-5 w-5" />
          <span>{error}</span>
        </motion.div>
      )}

      {/* File Upload Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original File */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Original File</h3>
            {originalFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(originalFile.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, true)}
          >
            <input
              ref={originalFileInputRef}
              type="file"
              onChange={(e) => handleFileInputChange(e, true)}
              className="hidden"
              accept=".txt,.md,.json,.xml,.html,.css,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.h,.hpp,.yaml,.yml,.csv,.log,.ini,.cfg,.conf,.sh,.bash,.zsh,.fish,.sql,.php,.rb,.go,.rs,.swift,.kt,.scala,.r,.m,.mm,.pl,.pm,.t,.pod,.podspec"
              style={{ display: 'none' }}
            />
            
            {originalFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-primary-500 mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{originalFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(originalFile.size)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => originalFileInputRef.current?.click()}
                >
                  Replace File
                </Button>
              </div>
            ) : (
              <div 
                className="space-y-4 cursor-pointer"
                onClick={() => {
                  console.log('Upload area clicked, triggering file input');
                  originalFileInputRef.current?.click();
                }}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium text-foreground">Upload Original File</p>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Button clicked, triggering file input');
                    originalFileInputRef.current?.click();
                  }}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modified File */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Modified File</h3>
            {modifiedFile && (
              <Button
                variant="ghost"
                size="sm"
                onClick={() => handleCopy(modifiedFile.content)}
              >
                <Copy className="h-4 w-4" />
              </Button>
            )}
          </div>
          
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, false)}
          >
            <input
              ref={modifiedFileInputRef}
              type="file"
              onChange={(e) => handleFileInputChange(e, false)}
              className="hidden"
              accept=".txt,.md,.json,.xml,.html,.css,.js,.ts,.jsx,.tsx,.py,.java,.cpp,.c,.h,.hpp,.yaml,.yml,.csv,.log,.ini,.cfg,.conf,.sh,.bash,.zsh,.fish,.sql,.php,.rb,.go,.rs,.swift,.kt,.scala,.r,.m,.mm,.pl,.pm,.t,.pod,.podspec"
              style={{ display: 'none' }}
            />
            
            {modifiedFile ? (
              <div className="space-y-2">
                <FileText className="h-12 w-12 text-primary-500 mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{modifiedFile.name}</p>
                  <p className="text-sm text-muted-foreground">{formatFileSize(modifiedFile.size)}</p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => modifiedFileInputRef.current?.click()}
                >
                  Replace File
                </Button>
              </div>
            ) : (
              <div 
                className="space-y-4 cursor-pointer"
                onClick={() => {
                  console.log('Modified upload area clicked, triggering file input');
                  modifiedFileInputRef.current?.click();
                }}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium text-foreground">Upload Modified File</p>
                  <p className="text-sm text-muted-foreground">Click to browse or drag and drop</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Modified button clicked, triggering file input');
                    modifiedFileInputRef.current?.click();
                  }}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose File
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleClear} variant="outline" disabled={isLoading}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        {diffResult.length > 0 && (
          <Button onClick={handleExport} variant="outline">
            <Download className="h-4 w-4 mr-2" />
            Export Diff
          </Button>
        )}
      </div>

      {/* File Content Preview */}
      {(originalFile || modifiedFile) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-4">
          {originalFile && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-blue-600 dark:text-blue-400 flex items-center gap-2">
                📁 Original File Content
              </h3>
              <div className="diff-original-container p-4 max-h-96 overflow-auto">
                <div className="diff-original-text">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {originalFile.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
          
          {modifiedFile && (
            <div className="space-y-2">
              <h3 className="text-sm font-medium text-purple-600 dark:text-purple-400 flex items-center gap-2">
                📝 Modified File Content
              </h3>
              <div className="diff-modified-container p-4 max-h-96 overflow-auto">
                <div className="diff-modified-text">
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {modifiedFile.content}
                  </pre>
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-time Statistics */}
      {(originalFile || modifiedFile) && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-4 border border-border rounded-lg bg-muted/20"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4 flex items-center gap-2">
            📊 File Difference Analysis
          </h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4">
            <div className="text-center p-4 bg-gradient-to-br from-emerald-50 to-teal-50 dark:from-emerald-900/20 dark:to-teal-900/20 rounded-xl border border-emerald-200 dark:border-emerald-700 shadow-md">
              <div className="text-3xl font-bold text-emerald-600 dark:text-emerald-400">+{diffStats.added}</div>
              <div className="text-sm text-emerald-700 dark:text-emerald-300 font-medium">Added Lines</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-rose-50 to-pink-50 dark:from-rose-900/20 dark:to-pink-900/20 rounded-xl border border-rose-200 dark:border-rose-700 shadow-md">
              <div className="text-3xl font-bold text-rose-600 dark:text-rose-400">-{diffStats.removed}</div>
              <div className="text-sm text-rose-700 dark:text-rose-300 font-medium">Removed Lines</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-slate-50 to-gray-50 dark:from-slate-800/20 dark:to-gray-800/20 rounded-xl border border-slate-200 dark:border-slate-700 shadow-md">
              <div className="text-3xl font-bold text-slate-600 dark:text-slate-400">{diffStats.unchanged}</div>
              <div className="text-sm text-slate-700 dark:text-slate-300 font-medium">Unchanged</div>
            </div>
            <div className="text-center p-4 bg-gradient-to-br from-indigo-50 to-blue-50 dark:from-indigo-900/20 dark:to-blue-900/20 rounded-xl border border-indigo-200 dark:border-indigo-700 shadow-md">
              <div className="text-3xl font-bold text-indigo-600 dark:text-indigo-400">{diffStats.totalChanges}</div>
              <div className="text-sm text-indigo-700 dark:text-indigo-300 font-medium">Total Changes</div>
            </div>
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
              🔍 Live File Diff Results
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
            </div>
          </div>
          
          <div className="border border-border rounded-lg p-4 bg-muted/20 max-h-96 overflow-auto">
            <div className="space-y-1">
              {diffResult.map((change, index) => (
                <motion.div
                  key={index}
                  initial={{ opacity: 0, x: -10 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.01 }}
                  className={`${
                    change.added
                      ? 'diff-highlight-added'
                      : change.removed
                      ? 'diff-highlight-removed'
                      : 'bg-transparent text-foreground'
                  }`}
                >
                  <pre className="whitespace-pre-wrap text-sm font-mono">
                    {change.value}
                  </pre>
                </motion.div>
              ))}
            </div>
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2 text-muted-foreground">Processing file...</span>
        </div>
      )}
    </div>
  );
}
