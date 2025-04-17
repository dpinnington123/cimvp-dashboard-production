import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent } from "@/components/ui/card";
import { AspectRatio } from "@/components/ui/aspect-ratio";
import { CalendarIcon, ClockIcon, UsersIcon, GlobeIcon, Image } from "lucide-react"; // Added Image icon
import { Badge } from "@/components/ui/badge";

// Interface matching the example, using optional props
interface ContentPreviewProps {
  imageSrc?: string | null; // Allow null
  title?: string | null;
  className?: string;
  contentType?: string | null;
  datePublished?: string | null;
  duration?: string; // Example didn't specify type, keeping as string
  audience?: string | null;
}

export function ContentPreview({ 
  imageSrc,
  title,
  className,
  contentType,
  datePublished,
  duration, // Assuming duration needs mapping if it's a number (e.g., weeks)
  audience
}: ContentPreviewProps) {
  
  // State to track if image failed to load
  const [imageError, setImageError] = React.useState(false);
  
  // Using the image URL only if it's not null/undefined
  const displayImageSrc = imageSrc || '';
  const displayTitle = title || 'Untitled Content';

  // Simple date formatting (can be improved with date-fns)
  const formatDate = (dateString: string | null | undefined) => {
    if (!dateString) return null;
    try {
      return new Date(dateString).toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'long',
        day: 'numeric',
      });
    } catch (e) {
      return dateString; // Return original string if parsing fails
    }
  };

  const formattedDate = formatDate(datePublished);

  return (
    <Card className={cn("overflow-hidden border animate-in fade-in", className)}> 
      {/* Removed card-hover as it wasn't in the original screenshot style */}
      <CardContent className="p-0">
        <div className="relative">
          <AspectRatio ratio={16 / 9}>
            {!displayImageSrc || imageError ? (
              // Placeholder for when no image is available or it fails to load
              <div className="w-full h-full bg-gray-200 dark:bg-gray-800 flex items-center justify-center">
                <div className="flex flex-col items-center text-gray-500 dark:text-gray-400">
                  <Image className="w-12 h-12 mb-2 opacity-50" />
                  <span className="text-sm">No preview available</span>
                </div>
              </div>
            ) : (
              <img 
                src={displayImageSrc} 
                alt={displayTitle}
                className="object-cover w-full h-full rounded-t-lg" 
                loading="lazy"
                onError={(e) => {
                  console.log(`Image failed to load: ${displayImageSrc}`);
                  setImageError(true);
                }}
              />
            )}
          </AspectRatio>
          {/* Gradient overlay as per example */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/70 via-transparent to-transparent rounded-t-lg"></div>
          <div className="absolute bottom-0 left-0 right-0 p-4">
            {/* Content Type / Source Icon - Adjusted from example */}
            {contentType && (
              <div className="flex items-center gap-2 mb-1">
                 {/* Using Globe as a generic icon, could be dynamic */}
                <GlobeIcon className="w-4 h-4 text-white/80" /> 
                <span className="text-white/80 text-xs font-medium uppercase tracking-wider">{contentType}</span>
              </div>
            )}
            <h3 className="text-white font-medium truncate text-lg">{displayTitle}</h3> 
          </div>
        </div>
        
        {/* Metadata Section */}
        {(formattedDate || duration || audience) && (
          <div className="p-4 space-y-3">
            {/* Using Badge for Content Type wasn't in screenshot, moved to overlay */}
            {/* {contentType && ( <Badge variant="secondary" className="text-xs">{contentType}</Badge> )} */}
            
            <div className="grid grid-cols-1 gap-2 text-sm">
              {formattedDate && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <CalendarIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{formattedDate}</span>
                </div>
              )}
              
              {/* Example assumes duration is a string like "6 weeks" */}
              {duration && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <ClockIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{duration}</span> 
                </div>
              )}
              
              {audience && (
                <div className="flex items-center gap-2 text-muted-foreground">
                  <UsersIcon className="w-3.5 h-3.5 flex-shrink-0" />
                  <span>{audience}</span>
                </div>
              )}
            </div>
          </div>
        )}
      </CardContent>
    </Card>
  );
} 