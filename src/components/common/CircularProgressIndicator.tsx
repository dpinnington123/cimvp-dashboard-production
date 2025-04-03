import React from 'react';
import { cn } from "@/lib/utils";

interface CircularProgressIndicatorProps {
  value: number;
  size?: number;
  strokeWidth?: number;
  className?: string;
}

export const CircularProgressIndicator = ({
  value,
  size = 48,
  strokeWidth = 4,
  className,
}: CircularProgressIndicatorProps) => {
  const radius = (size - strokeWidth) / 2;
  const circumference = radius * 2 * Math.PI;
  // Ensure value is between 0 and 100
  const clampedValue = Math.max(0, Math.min(100, value || 0));
  const offset = circumference - (clampedValue / 100) * circumference;
  
  const getScoreColor = (score: number) => {
    if (score >= 80) return "stroke-emerald-500"; // Green for high scores
    if (score >= 60) return "stroke-amber-500"; // Yellow/Orange for medium scores
    return "stroke-rose-500"; // Red for low scores
  };

  return (
    <div className={cn("relative flex items-center justify-center", className)}>
      <svg
        className="transform -rotate-90"
        width={size}
        height={size}
        viewBox={`0 0 ${size} ${size}`}
      >
        {/* Background circle */}
        <circle
          className="stroke-muted"
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
        />
        {/* Progress circle */}
        <circle
          // Adjusted transition class for potential compatibility
          className={cn("transition-[stroke-dashoffset] duration-1000 ease-out", getScoreColor(clampedValue))}
          cx={size / 2}
          cy={size / 2}
          r={radius}
          fill="transparent"
          strokeWidth={strokeWidth}
          strokeDasharray={circumference}
          strokeDashoffset={offset}
          strokeLinecap="round"
        />
      </svg>
    </div>
  );
}; 