'use client';

import { useState, useRef } from 'react';
import { motion } from 'framer-motion';
import { Button } from './ui/button';
import { Upload, FolderOpen, File, Folder, Download, RotateCcw, AlertCircle } from 'lucide-react';
import JSZip from 'jszip';

interface FolderDiffProps {
  className?: string;
}

interface FileNode {
  name: string;
  type: 'file' | 'folder';
  size?: number;
  children?: FileNode[];
  content?: string;
  path: string;
  status?: 'added' | 'removed' | 'modified' | 'unchanged';
}

interface FolderData {
  name: string;
  files: FileNode[];
  totalFiles: number;
  totalSize: number;
  fileMap: Map<string, string>; // path -> content
}

interface ComparisonResult {
  added: FileNode[];
  removed: FileNode[];
  modified: FileNode[];
  unchanged: FileNode[];
}

export function FolderDiff({ className }: FolderDiffProps) {
  const [originalFolder, setOriginalFolder] = useState<FolderData | null>(null);
  const [modifiedFolder, setModifiedFolder] = useState<FolderData | null>(null);
  const [comparisonResult, setComparisonResult] = useState<ComparisonResult | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const originalFolderInputRef = useRef<HTMLInputElement>(null);
  const modifiedFolderInputRef = useRef<HTMLInputElement>(null);

  const MAX_FOLDER_SIZE = 50 * 1024 * 1024; // 50MB

  const parseZipFile = async (file: File): Promise<FolderData> => {
    return new Promise((resolve, reject) => {
      if (file.size > MAX_FOLDER_SIZE) {
        reject(new Error(`Folder size exceeds ${MAX_FOLDER_SIZE / (1024 * 1024)}MB limit`));
        return;
      }

      const reader = new FileReader();
      reader.onload = async (e) => {
        try {
          const zip = new JSZip();
          const zipContent = await zip.loadAsync(e.target?.result as ArrayBuffer);
          
          const fileMap = new Map<string, string>();
          let totalFiles = 0;
          let totalSize = 0;

          // Process all files in the zip
          for (const [relativePath, zipEntry] of Object.entries(zipContent.files)) {
            if (!zipEntry.dir) {
              totalFiles++;
              totalSize += (zipEntry as unknown as { uncompressedSize?: number }).uncompressedSize || 0;
              
              // Read file content
              const content = await zipEntry.async('text');
              fileMap.set(relativePath, content);
            }
          }

          // Build folder structure
          const rootFiles = buildFolderStructure(zipContent.files, fileMap);
          
          const folderData: FolderData = {
            name: file.name.replace('.zip', ''),
            files: rootFiles,
            totalFiles,
            totalSize,
            fileMap
          };

          resolve(folderData);
        } catch (err) {
          reject(new Error('Failed to parse ZIP file: ' + (err as Error).message));
        }
      };
      
      reader.onerror = () => reject(new Error('Failed to read file'));
      reader.readAsArrayBuffer(file);
    });
  };

  const buildFolderStructure = (zipFiles: Record<string, JSZip.JSZipObject>, fileMap: Map<string, string>): FileNode[] => {
    const pathMap = new Map<string, FileNode>();
    const rootFiles: FileNode[] = [];

    // Create nodes for all files and folders
    for (const [path, zipEntry] of Object.entries(zipFiles)) {
      const pathParts = path.split('/').filter(part => part.length > 0);
      const fileName = pathParts[pathParts.length - 1];
      const isDirectory = zipEntry.dir;

      const node: FileNode = {
        name: fileName,
        type: isDirectory ? 'folder' : 'file',
        path: path,
        size: isDirectory ? undefined : (zipEntry as unknown as { uncompressedSize?: number }).uncompressedSize,
        content: isDirectory ? undefined : fileMap.get(path),
        children: isDirectory ? [] : undefined
      };

      pathMap.set(path, node);
    }

    // Build hierarchy
    for (const [path, node] of pathMap) {
      const pathParts = path.split('/').filter(part => part.length > 0);
      
      if (pathParts.length === 1) {
        // Root level file/folder
        rootFiles.push(node);
      } else {
        // Find parent folder
        const parentPath = pathParts.slice(0, -1).join('/');
        const parent = pathMap.get(parentPath);
        if (parent && parent.type === 'folder') {
          parent.children = parent.children || [];
          parent.children.push(node);
        }
      }
    }

    return rootFiles;
  };

  const handleFolderUpload = async (file: File, isOriginal: boolean) => {
    setIsLoading(true);
    setError(null);

    try {
      const folderData = await parseZipFile(file);
      
      if (isOriginal) {
        setOriginalFolder(folderData);
      } else {
        setModifiedFolder(folderData);
      }

      // Real-time comparison when both folders are available
      if (isOriginal && modifiedFolder) {
        const result = compareFolders(folderData, modifiedFolder);
        setComparisonResult(result);
      } else if (!isOriginal && originalFolder) {
        const result = compareFolders(originalFolder, folderData);
        setComparisonResult(result);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Failed to process folder');
    } finally {
      setIsLoading(false);
    }
  };

  const compareFolders = (original: FolderData, modified: FolderData): ComparisonResult => {
    const result: ComparisonResult = {
      added: [],
      removed: [],
      modified: [],
      unchanged: []
    };

    const originalPaths = new Set(original.fileMap.keys());
    const modifiedPaths = new Set(modified.fileMap.keys());

    // Find added files
    for (const path of modifiedPaths) {
      if (!originalPaths.has(path)) {
        const fileNode = findFileNodeByPath(modified.files, path);
        if (fileNode) {
          fileNode.status = 'added';
          result.added.push(fileNode);
        }
      }
    }

    // Find removed files
    for (const path of originalPaths) {
      if (!modifiedPaths.has(path)) {
        const fileNode = findFileNodeByPath(original.files, path);
        if (fileNode) {
          fileNode.status = 'removed';
          result.removed.push(fileNode);
        }
      }
    }

    // Find modified and unchanged files
    for (const path of originalPaths) {
      if (modifiedPaths.has(path)) {
        const originalContent = original.fileMap.get(path);
        const modifiedContent = modified.fileMap.get(path);
        
        if (originalContent !== modifiedContent) {
          const fileNode = findFileNodeByPath(modified.files, path);
          if (fileNode) {
            fileNode.status = 'modified';
            result.modified.push(fileNode);
          }
        } else {
          const fileNode = findFileNodeByPath(modified.files, path);
          if (fileNode) {
            fileNode.status = 'unchanged';
            result.unchanged.push(fileNode);
          }
        }
      }
    }

    return result;
  };

  const findFileNodeByPath = (files: FileNode[], targetPath: string): FileNode | null => {
    for (const file of files) {
      if (file.path === targetPath) {
        return file;
      }
      if (file.children) {
        const found = findFileNodeByPath(file.children, targetPath);
        if (found) return found;
      }
    }
    return null;
  };

  const handleFolderInputChange = (e: React.ChangeEvent<HTMLInputElement>, isOriginal: boolean) => {
    console.log('Folder input changed:', e.target.files);
    const file = e.target.files?.[0];
    if (file) {
      console.log('ZIP file selected:', file.name, file.type, file.size);
      handleFolderUpload(file, isOriginal);
    } else {
      console.log('No ZIP file selected');
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
      const file = files[0];
      if (file.name.toLowerCase().endsWith('.zip')) {
        handleFolderUpload(file, isOriginal);
      } else {
        setError('Please upload a ZIP file');
      }
    }
  };

  const handleExportComparison = () => {
    if (!comparisonResult) return;

    const report = [
      'FOLDER COMPARISON REPORT',
      '=======================',
      '',
      `Generated: ${new Date().toLocaleString()}`,
      '',
      'SUMMARY:',
      `- Added files: ${comparisonResult.added.length}`,
      `- Removed files: ${comparisonResult.removed.length}`,
      `- Modified files: ${comparisonResult.modified.length}`,
      `- Unchanged files: ${comparisonResult.unchanged.length}`,
      '',
      'DETAILED CHANGES:',
      '',
      'ADDED FILES:',
      ...comparisonResult.added.map(file => `+ ${file.path}`),
      '',
      'REMOVED FILES:',
      ...comparisonResult.removed.map(file => `- ${file.path}`),
      '',
      'MODIFIED FILES:',
      ...comparisonResult.modified.map(file => `~ ${file.path}`),
      '',
      'UNCHANGED FILES:',
      ...comparisonResult.unchanged.map(file => `= ${file.path}`),
    ].join('\n');

    const blob = new Blob([report], { type: 'text/plain' });
    const url = URL.createObjectURL(blob);
    const a = document.createElement('a');
    a.href = url;
    a.download = 'folder-comparison-report.txt';
    a.click();
    URL.revokeObjectURL(url);
  };

  const handleClear = () => {
    setOriginalFolder(null);
    setModifiedFolder(null);
    setComparisonResult(null);
    setError(null);
    if (originalFolderInputRef.current) originalFolderInputRef.current.value = '';
    if (modifiedFolderInputRef.current) modifiedFolderInputRef.current.value = '';
  };

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i];
  };

  const renderFileTree = (files: FileNode[], level = 0) => {
    return (
      <div className="ml-4">
        {files.map((file, index) => (
          <div key={index} className="py-1">
            <div className="flex items-center gap-2 text-sm">
              {file.type === 'folder' ? (
                <Folder className="h-4 w-4 text-blue-500" />
              ) : (
                <File className="h-4 w-4 text-gray-500" />
              )}
              <span className={`text-foreground ${
                file.status === 'added' ? 'text-green-600 dark:text-green-400' :
                file.status === 'removed' ? 'text-red-600 dark:text-red-400' :
                file.status === 'modified' ? 'text-yellow-600 dark:text-yellow-400' :
                'text-foreground'
              }`}>
                {file.name}
              </span>
              {file.status && (
                <span className={`text-xs px-1 py-0.5 rounded ${
                  file.status === 'added' ? 'bg-green-100 text-green-800 dark:bg-green-900/20 dark:text-green-400' :
                  file.status === 'removed' ? 'bg-red-100 text-red-800 dark:bg-red-900/20 dark:text-red-400' :
                  file.status === 'modified' ? 'bg-yellow-100 text-yellow-800 dark:bg-yellow-900/20 dark:text-yellow-400' :
                  'bg-gray-100 text-gray-800 dark:bg-gray-900/20 dark:text-gray-400'
                }`}>
                  {file.status}
                </span>
              )}
              {file.size && (
                <span className="text-muted-foreground text-xs">
                  ({formatFileSize(file.size)})
                </span>
              )}
            </div>
            {file.children && renderFileTree(file.children, level + 1)}
          </div>
        ))}
      </div>
    );
  };

  return (
    <div className={`space-y-6 ${className}`}>
      {/* Header */}
      <div className="flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
        <div>
          <h2 className="text-2xl font-bold text-foreground">Folder Diff Checker</h2>
          <p className="text-muted-foreground">Upload and compare two zipped folders</p>
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

      {/* Folder Upload Areas */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Original Folder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Original Folder</h3>
          </div>
          
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, true)}
          >
            <input
              ref={originalFolderInputRef}
              type="file"
              onChange={(e) => handleFolderInputChange(e, true)}
              className="hidden"
              accept=".zip"
              style={{ display: 'none' }}
            />
            
            {originalFolder ? (
              <div className="space-y-4">
                <FolderOpen className="h-12 w-12 text-primary-500 mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{originalFolder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {originalFolder.totalFiles} files • {formatFileSize(originalFolder.totalSize)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => originalFolderInputRef.current?.click()}
                >
                  Replace Folder
                </Button>
              </div>
            ) : (
              <div 
                className="space-y-4 cursor-pointer"
                onClick={() => {
                  console.log('Original folder upload area clicked, triggering file input');
                  originalFolderInputRef.current?.click();
                }}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium text-foreground">Upload Original Folder</p>
                  <p className="text-sm text-muted-foreground">Upload a ZIP file containing your folder</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Original folder button clicked, triggering file input');
                    originalFolderInputRef.current?.click();
                  }}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose ZIP File
                </Button>
              </div>
            )}
          </div>
        </div>

        {/* Modified Folder */}
        <div className="space-y-4">
          <div className="flex items-center justify-between">
            <h3 className="text-lg font-semibold text-foreground">Modified Folder</h3>
          </div>
          
          <div 
            className="border-2 border-dashed border-border rounded-lg p-8 text-center hover:border-primary-500 transition-colors"
            onDragOver={handleDragOver}
            onDrop={(e) => handleDrop(e, false)}
          >
            <input
              ref={modifiedFolderInputRef}
              type="file"
              onChange={(e) => handleFolderInputChange(e, false)}
              className="hidden"
              accept=".zip"
              style={{ display: 'none' }}
            />
            
            {modifiedFolder ? (
              <div className="space-y-4">
                <FolderOpen className="h-12 w-12 text-primary-500 mx-auto" />
                <div>
                  <p className="font-medium text-foreground">{modifiedFolder.name}</p>
                  <p className="text-sm text-muted-foreground">
                    {modifiedFolder.totalFiles} files • {formatFileSize(modifiedFolder.totalSize)}
                  </p>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  onClick={() => modifiedFolderInputRef.current?.click()}
                >
                  Replace Folder
                </Button>
              </div>
            ) : (
              <div 
                className="space-y-4 cursor-pointer"
                onClick={() => {
                  console.log('Modified folder upload area clicked, triggering file input');
                  modifiedFolderInputRef.current?.click();
                }}
              >
                <Upload className="h-12 w-12 text-muted-foreground mx-auto" />
                <div>
                  <p className="text-lg font-medium text-foreground">Upload Modified Folder</p>
                  <p className="text-sm text-muted-foreground">Upload a ZIP file containing your folder</p>
                </div>
                <Button
                  onClick={(e) => {
                    e.stopPropagation();
                    console.log('Modified folder button clicked, triggering file input');
                    modifiedFolderInputRef.current?.click();
                  }}
                  disabled={isLoading}
                >
                  <Upload className="h-4 w-4 mr-2" />
                  Choose ZIP File
                </Button>
              </div>
            )}
          </div>
        </div>
      </div>

      {/* Comparison Summary */}
      {comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="p-6 border border-border rounded-lg bg-muted/20"
        >
          <h3 className="text-lg font-semibold text-foreground mb-4">Comparison Summary</h3>
          <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-green-500 rounded"></div>
              <span>Added: {comparisonResult.added.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-red-500 rounded"></div>
              <span>Removed: {comparisonResult.removed.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-yellow-500 rounded"></div>
              <span>Modified: {comparisonResult.modified.length}</span>
            </div>
            <div className="flex items-center gap-2">
              <div className="w-3 h-3 bg-gray-500 rounded"></div>
              <span>Unchanged: {comparisonResult.unchanged.length}</span>
            </div>
          </div>
        </motion.div>
      )}

      {/* Action Buttons */}
      <div className="flex flex-wrap items-center gap-2">
        <Button onClick={handleClear} variant="outline" disabled={isLoading}>
          <RotateCcw className="h-4 w-4 mr-2" />
          Clear All
        </Button>
        {comparisonResult && (
          <Button 
            variant="outline" 
            onClick={handleExportComparison}
            disabled={isLoading}
          >
            <Download className="h-4 w-4 mr-2" />
            Export Comparison
          </Button>
        )}
      </div>

      {/* Folder Structure Comparison */}
      {(originalFolder || modifiedFolder) && (
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
          {originalFolder && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Original Structure</h3>
              <div className="border border-border rounded-lg p-4 bg-muted/20 max-h-96 overflow-auto">
                <div className="font-mono text-sm">
                  {renderFileTree(originalFolder.files)}
                </div>
              </div>
            </div>
          )}
          
          {modifiedFolder && (
            <div className="space-y-4">
              <h3 className="text-lg font-semibold text-foreground">Modified Structure</h3>
              <div className="border border-border rounded-lg p-4 bg-muted/20 max-h-96 overflow-auto">
                <div className="font-mono text-sm">
                  {renderFileTree(modifiedFolder.files)}
                </div>
              </div>
            </div>
          )}
        </div>
      )}

      {/* Real-time Comparison Results */}
      {comparisonResult && (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          className="space-y-6"
        >
          <div className="p-6 border border-border rounded-lg bg-muted/20">
            <h3 className="text-lg font-semibold text-foreground mb-4">Real-time Comparison Results</h3>
            <div className="grid grid-cols-2 sm:grid-cols-4 gap-4 text-sm">
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-diff-added rounded"></div>
                <span>Added: {comparisonResult.added.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-diff-removed rounded"></div>
                <span>Removed: {comparisonResult.removed.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-diff-changed rounded"></div>
                <span>Modified: {comparisonResult.modified.length}</span>
              </div>
              <div className="flex items-center gap-2">
                <div className="w-3 h-3 bg-diff-unchanged rounded"></div>
                <span>Unchanged: {comparisonResult.unchanged.length}</span>
              </div>
            </div>
          </div>

          {/* Detailed File Changes */}
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            {/* Added Files */}
            {comparisonResult.added.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-green-600 dark:text-green-400">Added Files</h4>
                <div className="max-h-48 overflow-auto space-y-1">
                  {comparisonResult.added.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-green-50 dark:bg-green-900/20 rounded">
                      <File className="h-4 w-4 text-green-600" />
                      <span className="font-mono">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Removed Files */}
            {comparisonResult.removed.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-red-600 dark:text-red-400">Removed Files</h4>
                <div className="max-h-48 overflow-auto space-y-1">
                  {comparisonResult.removed.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-red-50 dark:bg-red-900/20 rounded">
                      <File className="h-4 w-4 text-red-600" />
                      <span className="font-mono">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}

            {/* Modified Files */}
            {comparisonResult.modified.length > 0 && (
              <div className="space-y-2">
                <h4 className="text-sm font-medium text-yellow-600 dark:text-yellow-400">Modified Files</h4>
                <div className="max-h-48 overflow-auto space-y-1">
                  {comparisonResult.modified.map((file, index) => (
                    <div key={index} className="flex items-center gap-2 text-sm p-2 bg-yellow-50 dark:bg-yellow-900/20 rounded">
                      <File className="h-4 w-4 text-yellow-600" />
                      <span className="font-mono">{file.path}</span>
                    </div>
                  ))}
                </div>
              </div>
            )}
          </div>
        </motion.div>
      )}

      {/* Loading State */}
      {isLoading && (
        <div className="flex items-center justify-center py-8">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-primary-500"></div>
          <span className="ml-2 text-muted-foreground">Processing folder...</span>
        </div>
      )}
    </div>
  );
}
