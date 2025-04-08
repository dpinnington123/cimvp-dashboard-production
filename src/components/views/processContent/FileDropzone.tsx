
import React, { useState, useCallback } from 'react';
import { cn } from '@/lib/utils';
import { Upload, File } from 'lucide-react';

interface FileDropzoneProps {
  onFilesAdded: (files: File[]) => void;
  accept?: string;
  multiple?: boolean;
  maxSize?: number; // in bytes
  className?: string;
}

const FileDropzone: React.FC<FileDropzoneProps> = ({
  onFilesAdded,
  accept = '*',
  multiple = true,
  maxSize = 10 * 1024 * 1024, // 10MB default
  className,
}) => {
  const [isDragging, setIsDragging] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleDragOver = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(true);
  }, []);

  const handleDragLeave = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
  }, []);

  const validateFiles = useCallback((fileList: FileList): File[] => {
    const validFiles: File[] = [];
    setError(null);

    Array.from(fileList).forEach(file => {
      // Check file type if accept is specified
      if (accept !== '*') {
        const acceptedTypes = accept.split(',').map(type => type.trim());
        const fileType = file.type || '';
        const fileExtension = '.' + file.name.split('.').pop();
        
        if (!acceptedTypes.some(type => {
          if (type.startsWith('.')) {
            return fileExtension.toLowerCase() === type.toLowerCase();
          }
          if (type.endsWith('/*')) {
            return fileType.startsWith(type.replace('/*', ''));
          }
          return fileType === type;
        })) {
          setError(`File type not accepted: ${file.name}`);
          return;
        }
      }

      // Check file size
      if (file.size > maxSize) {
        const sizeMB = maxSize / (1024 * 1024);
        setError(`File too large: ${file.name}. Maximum size is ${sizeMB}MB.`);
        return;
      }

      validFiles.push(file);
    });

    return validFiles;
  }, [accept, maxSize]);

  const handleDrop = useCallback((e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    e.stopPropagation();
    setIsDragging(false);
    
    const { files } = e.dataTransfer;
    if (!files.length) return;
    
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesAdded(multiple ? validFiles : [validFiles[0]]);
    }
  }, [multiple, onFilesAdded, validateFiles]);

  const handleFileInputChange = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const { files } = e.target;
    if (!files || !files.length) return;
    
    const validFiles = validateFiles(files);
    if (validFiles.length > 0) {
      onFilesAdded(multiple ? validFiles : [validFiles[0]]);
    }
    
    // Reset input value to allow selecting the same file again
    e.target.value = '';
  }, [multiple, onFilesAdded, validateFiles]);

  return (
    <div className="w-full">
      <div
        className={cn(
          "relative flex flex-col items-center justify-center w-full p-6 transition-all duration-300 ease-in-out border-2 border-dashed rounded-lg focus-ring",
          isDragging ? "border-primary bg-primary/5" : "border-border hover:border-primary/50 hover:bg-muted/50",
          error && "border-destructive/50 bg-destructive/5",
          className
        )}
        onDragOver={handleDragOver}
        onDragLeave={handleDragLeave}
        onDrop={handleDrop}
      >
        <div className="flex flex-col items-center justify-center space-y-3 text-center">
          <div className={cn(
            "rounded-full p-3 transition-all duration-300",
            isDragging ? "bg-primary/10 text-primary" : "bg-muted text-muted-foreground",
            error && "bg-destructive/10 text-destructive"
          )}>
            {error ? (
              <File className="w-6 h-6 animate-pulse" />
            ) : (
              <Upload className={cn(
                "w-6 h-6", 
                isDragging && "animate-float"
              )} />
            )}
          </div>
          
          <div className="space-y-1">
            <p className="text-sm font-medium">
              {error ? (
                <span className="text-destructive">{error}</span>
              ) : isDragging ? (
                "Release to upload files"
              ) : (
                "Drag & drop files here or click to browse"
              )}
            </p>
            <p className="text-xs text-muted-foreground">
              {multiple ? `You can upload multiple files${accept !== '*' ? ` (${accept})` : ''}` : `Select a single file${accept !== '*' ? ` (${accept})` : ''}`}
            </p>
            <p className="text-xs text-muted-foreground">
              Maximum file size: {(maxSize / (1024 * 1024)).toFixed(0)}MB
            </p>
          </div>
        </div>

        <input
          id="fileInput"
          type="file"
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
          onChange={handleFileInputChange}
          accept={accept}
          multiple={multiple}
        />
      </div>
    </div>
  );
};

export default FileDropzone;
