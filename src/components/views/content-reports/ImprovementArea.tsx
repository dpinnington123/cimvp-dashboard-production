import React from 'react';
import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { AlertTriangle, Check, Info } from "lucide-react"; // Icons for priority

// Interface matching the example
export interface ImprovementAreaProps {
  title: string;
  description: string;
  priority: 'high' | 'medium' | 'low'; // Type for priority
  className?: string;
  style?: React.CSSProperties; // Add style prop
}

export function ImprovementArea({ title, description, priority, className, style }: ImprovementAreaProps) {
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

  return (
    <Card className={cn("border animate-in slide-in-from-bottom-2", config.borderColor, className)} style={style}> 
      {/* Adjusted animation */}
      <CardHeader className={cn("flex flex-row items-center gap-4 py-4", config.bgColor)}> 
        {/* Icon wrapper */}
        <div className={cn("p-1.5 rounded-full border", config.bgColor, config.borderColor)}> 
          <Icon className={cn("h-5 w-5", config.color)} />
        </div>
        <CardTitle className="text-base font-medium flex-1">{title}</CardTitle>
      </CardHeader>
      <CardContent className="pt-3 pb-4 pl-6 pr-6"> {/* Adjusted padding */}
        <CardDescription className="text-sm text-foreground/80">
          {description}
        </CardDescription>
      </CardContent>
    </Card>
  );
} 