import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface ScoreCardProps {
  title: string;
  score: number;
  description?: string;
  className?: string;
  icon?: React.ReactNode;
}

export function ScoreCard({ title, score, description, className, icon }: ScoreCardProps) {
  const getScoreClass = () => {
    if (score >= 95) return "text-score-exceptional";
    if (score >= 85) return "text-score-excellent";
    if (score >= 80) return "text-score-very-good";
    if (score >= 75) return "text-score-good";
    if (score >= 70) return "text-score-above-average";
    if (score >= 60) return "text-score-average";
    if (score >= 50) return "text-score-below-average";
    if (score >= 40) return "text-score-poor";
    return "text-score-very-poor";
  };

  const getScoreBadge = () => {
    if (score >= 95) return "score-badge-exceptional";
    if (score >= 85) return "score-badge-excellent";
    if (score >= 80) return "score-badge-very-good";
    if (score >= 75) return "score-badge-good";
    if (score >= 70) return "score-badge-above-average";
    if (score >= 60) return "score-badge-average";
    if (score >= 50) return "score-badge-below-average";
    if (score >= 40) return "score-badge-poor";
    return "score-badge-very-poor";
  };

  const getScoreLabel = () => {
    if (score >= 95) return "Exceptional";
    if (score >= 85) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 75) return "Good";
    if (score >= 70) return "Above Average";
    if (score >= 60) return "Average";
    if (score >= 50) return "Below Average";
    if (score >= 40) return "Poor";
    return "Needs Improvement";
  };

  return (
    <Card className={cn("h-full", className)}>
      <CardHeader className="flex flex-row items-center justify-between pb-2">
        <CardTitle className="text-sm font-medium text-muted-foreground">
          {title}
        </CardTitle>
        {icon && <div className="text-muted-foreground">{icon}</div>}
      </CardHeader>
      <CardContent>
        <div className="flex items-baseline">
          <span className={cn("text-4xl font-bold", getScoreClass())}>{score}</span>
          <span className="text-sm text-muted-foreground ml-1">/100</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground mt-1">{description}</p>
        )}
        <div className="mt-3">
          <div className={cn("text-xs font-medium", getScoreBadge())}>
            {getScoreLabel()}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
