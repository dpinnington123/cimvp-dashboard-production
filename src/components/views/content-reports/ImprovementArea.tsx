import React, { useState } from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { AlertTriangle, Check, Info, BookmarkIcon, Trash2, BookmarkCheck } from "lucide-react"; // Added new icons
import { Button } from "@/components/ui/button";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";

// Interface matching the example
export interface ImprovementAreaProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low'; // Type for priority
  className?: string;
  style?: React.CSSProperties; // Add style prop
  id?: string | number; // Add id prop to identify specific improvement areas
  onSave?: (id: string | number) => void; // Callback when saved
  onRemove?: (id: string | number) => void; // Callback when removed
  initialSaved?: boolean; // Whether this improvement is already saved
}

export function ImprovementArea({ 
  title, 
  description, 
  priority, 
  className, 
  style, 
  id, 
  onSave, 
  onRemove,
  initialSaved = false
}: ImprovementAreaProps) {
  // State to track if this improvement area is saved
  const [isSaved, setIsSaved] = useState(initialSaved);

  const getPriorityConfig = (priority: 'high' | 'medium' | 'low') => {
    switch (priority) {
      case 'high':
        return {
          icon: AlertTriangle,
          color: "text-rose-500", // High priority color
          bgColor: "bg-rose-50 dark:bg-rose-950/30",
          borderColor: "border-rose-200 dark:border-rose-900/50"
        };
      case 'medium':
        return {
          icon: Info,
          color: "text-amber-500", // Medium priority color
          bgColor: "bg-amber-50 dark:bg-amber-950/30",
          borderColor: "border-amber-200 dark:border-amber-900/50"
        };
      case 'low':
      default: // Default to low priority styling
        return {
          icon: Check,
          color: "text-emerald-500", // Low priority color
          bgColor: "bg-emerald-50 dark:bg-emerald-950/30",
          borderColor: "border-emerald-200 dark:border-emerald-900/50"
        };
    }
  };

  const config = getPriorityConfig(priority);
  const Icon = config.icon;

  // Handle save button click
  const handleSave = () => {
    setIsSaved(!isSaved);
    if (id && onSave) {
      onSave(id);
    }
  };

  // Handle remove button click
  const handleRemove = () => {
    if (id && onRemove) {
      onRemove(id);
    }
  };

  return (
    <Card className={cn(
      "border animate-in slide-in-from-bottom-2", 
      config.borderColor, 
      isSaved ? "ring-1 ring-primary" : "",
      className
    )} style={style}> 
      <CardHeader className={cn("flex flex-row items-center gap-4 py-4", config.bgColor)}> 
        {/* Icon wrapper */}
        <div className={cn("p-1.5 rounded-full border", config.bgColor, config.borderColor)}> 
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <CardTitle className="text-base font-medium flex-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-2 pl-6 pr-6"> {/* Adjusted padding */}
        <CardDescription className="text-sm text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
      <CardFooter className="flex justify-end gap-2 pt-0 pb-4 px-6">
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant={isSaved ? "default" : "outline"}
                size="sm"
                onClick={handleSave}
                className={isSaved ? "bg-primary hover:bg-primary/90" : ""}
              >
                {isSaved ? (
                  <>
                    <BookmarkCheck className="h-4 w-4 mr-1" />
                    Saved
                  </>
                ) : (
                  <>
                    <BookmarkIcon className="h-4 w-4 mr-1" />
                    Save
                  </>
                )}
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>{isSaved ? "Remove from saved improvements" : "Save this improvement for later"}</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
        
        <TooltipProvider>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                size="sm"
                onClick={handleRemove}
                className="text-gray-500 hover:text-gray-700 dark:text-gray-400 dark:hover:text-gray-300"
              >
                <Trash2 className="h-4 w-4" />
                <span className="sr-only">Hide</span>
              </Button>
            </TooltipTrigger>
            <TooltipContent>
              <p>Hide this improvement until page reload</p>
            </TooltipContent>
          </Tooltip>
        </TooltipProvider>
      </CardFooter>
    </Card>
  );
} 