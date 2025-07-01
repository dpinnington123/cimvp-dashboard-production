import React from 'react';
import { cn } from "@/lib/utils";

interface DetailItemProps {
  icon: React.ReactNode;
  label: string;
  value: string | number | null | undefined;
  className?: string;
}

export function DetailItem({ icon, label, value, className }: DetailItemProps) {
  // Display 'N/A' if the value is null, undefined, or an empty string
  const displayValue = value !== null && value !== undefined && value !== '' ? value : "N/A";

  return (
    <div className={cn("flex flex-col p-3 rounded-lg border bg-muted/30", className)}>
      <div className="flex items-center gap-2 text-xs text-muted-foreground mb-1">
        {icon}
        <span>{label}</span>
      </div>
      <p className="font-medium text-sm break-words">
        {displayValue} {/* Use the potentially modified display value */}
      </p>
    </div>
  );
} 