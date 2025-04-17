import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface CharacteristicCardProps {
  icon?: React.ReactNode; // Icon is optional
  label: string;
  value: string | number | React.ReactNode; // Value can be text, number, or even another component
  className?: string;
  style?: React.CSSProperties; // Adding style prop for animation delays
}

export function CharacteristicCard({ icon, label, value, className, style }: CharacteristicCardProps) {
  const displayValue = value !== null && value !== undefined && value !== '' ? value : "N/A";

  return (
    <Card className={cn("p-4", className)} style={style}> {/* Added style prop */}
      <CardContent className="p-0 space-y-1"> {/* Remove default CardContent padding */}
        <div className="flex items-center gap-2 text-sm text-muted-foreground">
          {icon}
          <span>{label}</span>
        </div>
        <div className="text-lg font-semibold">
          {displayValue}
        </div>
      </CardContent>
    </Card>
  );
} 