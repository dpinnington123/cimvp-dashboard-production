
import React from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Progress } from "@/components/ui/progress";
import { cn } from "@/lib/utils";
import { Target } from "lucide-react";

interface StrategyData {
  id: string;
  name: string;
  description: string;
  score: number;
}

interface StrategyEffectivenessProps {
  strategies: StrategyData[];
}

export function StrategyEffectiveness({ strategies }: StrategyEffectivenessProps) {
  const getScoreClass = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  const getProgressColor = (score: number) => {
    if (score >= 85) return "bg-score-excellent";
    if (score >= 70) return "bg-score-good";
    if (score >= 50) return "bg-score-average";
    return "bg-score-poor";
  };

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
      {strategies.map((strategy) => (
        <Card key={strategy.id} className="h-full">
          <CardHeader className="pb-2">
            <div className="flex items-center justify-between">
              <CardTitle className="text-base font-medium">{strategy.name}</CardTitle>
              <Target className="h-5 w-5 text-muted-foreground" />
            </div>
          </CardHeader>
          <CardContent className="space-y-4">
            <p className="text-sm text-muted-foreground">{strategy.description}</p>
            <div>
              <div className="flex justify-between items-center mb-1">
                <span className="text-sm text-muted-foreground">Overall Effectiveness</span>
                <span className={cn("text-sm font-medium", getScoreClass(strategy.score))}>
                  {strategy.score}
                </span>
              </div>
              <Progress value={strategy.score} indicatorClassName={getProgressColor(strategy.score)} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
