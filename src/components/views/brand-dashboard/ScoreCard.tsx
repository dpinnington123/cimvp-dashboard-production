
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
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const getScoreBadge = () => {
    if (score >= 85) return "score-badge-excellent";
    if (score >= 70) return "score-badge-good";
    if (score >= 50) return "score-badge-average";
    return "score-badge-poor";
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
        <div className="text-3xl font-bold mb-1 flex items-baseline">
          <span className={getScoreClass()}>{score}</span>
          <span className="text-sm text-muted-foreground ml-1">/100</span>
        </div>
        {description && (
          <p className="text-xs text-muted-foreground">{description}</p>
        )}
        <div className="mt-3">
          <div className={cn("text-xs font-medium", getScoreBadge())}>
            {score >= 85 && "Excellent"}
            {score >= 70 && score < 85 && "Good"}
            {score >= 50 && score < 70 && "Average"}
            {score < 50 && "Needs Improvement"}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
