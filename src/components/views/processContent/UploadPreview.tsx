
import React from 'react';
import { cn } from '@/lib/utils';
import { File, FileText, Image, Music, Video, X, File as FileIcon } from 'lucide-react';
import { Button } from '@/components/ui/button';

interface UploadPreviewProps {
  files: Array<{
    file: File;
    id: string;
    preview?: string;
  }>;
  onRemove?: (id: string) => void;
  readOnly?: boolean;
}

const UploadPreview: React.FC<UploadPreviewProps> = ({
  files,
  onRemove,
  readOnly = false
}) => {
  // Format file size
  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes';
    const k = 1024;
    const sizes = ['Bytes', 'KB', 'MB', 'GB'];
    const i = Math.floor(Math.log(bytes) / Math.log(k));
    return parseFloat((bytes / Math.pow(k, i)).toFixed(1)) + ' ' + sizes[i];
  };

  // Get appropriate icon for file type
  const getFileIcon = (file: File) => {
    const type = file.type;
    if (type.startsWith('image/')) return <Image className="h-5 w-5" />;
    if (type.startsWith('video/')) return <Video className="h-5 w-5" />;
    if (type.startsWith('audio/')) return <Music className="h-5 w-5" />;
    if (type.includes('pdf')) return <FileText className="h-5 w-5" />;
    return <FileIcon className="h-5 w-5" />;
  };

  return (
    <div className="space-y-2">
      {files.map(({ file, id, preview }) => (
        <div 
          key={id}
          className={cn(
            "rounded-md border border-border/50 bg-white/50 dark:bg-black/10 backdrop-blur-sm",
            "overflow-hidden flex items-stretch transition-all duration-200 hover:border-primary/30"
          )}
        >
          {/* Preview area */}
          <div className="w-16 h-16 shrink-0 flex items-center justify-center border-r border-border/30 bg-muted/30">
            {preview ? (
              <div className="w-full h-full">
                <img 
                  src={preview} 
                  alt={file.name} 
                  className="w-full h-full object-cover"
                />
              </div>
            ) : (
              <div className="flex items-center justify-center h-full w-full text-muted-foreground">
                {getFileIcon(file)}
              </div>
            )}
          </div>
          
          {/* File info */}
          <div className="flex-1 p-2 flex flex-col justify-center min-w-0">
            <p className="font-medium truncate text-sm">
              {file.name}
            </p>
            <p className="text-xs text-muted-foreground">
              {formatFileSize(file.size)}
            </p>
          </div>
          
          {/* Remove button */}
          {!readOnly && onRemove && (
            <div className="flex items-center pr-2">
              <Button
                type="button"
                variant="ghost"
                size="icon"
                className="h-7 w-7 rounded-full hover:bg-destructive/10 hover:text-destructive"
                onClick={() => onRemove(id)}
              >
                <X className="h-4 w-4" />
              </Button>
            </div>
          )}
        </div>
      ))}
      
      {files.length === 0 && (
        <div className="text-center py-4 text-sm text-muted-foreground italic">
          No files selected
        </div>
      )}
    </div>
  );
};

export default UploadPreview;
