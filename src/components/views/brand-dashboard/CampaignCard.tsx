import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import { 
  BarChart3, 
  Eye, 
  Target, 
  Users 
} from "lucide-react";
import { Progress } from "@/components/ui/progress";

interface ScoreData {
  overall: number;
  strategic: number;
  customer: number;
  execution: number;
}

interface CampaignCardProps {
  name: string;
  scores: ScoreData;
  status: "active" | "completed" | "planned";
  timeframe: string;
  className?: string;
}

export function CampaignCard({ 
  name, 
  scores, 
  status, 
  timeframe,
  className 
}: CampaignCardProps) {
  const getStatusClass = () => {
    switch (status) {
      case "active":
        return "bg-green-100 text-green-800";
      case "completed":
        return "bg-blue-100 text-blue-800";
      case "planned":
        return "bg-purple-100 text-purple-800";
      default:
        return "bg-gray-100 text-gray-800";
    }
  };

  const getScoreClass = (score: number) => {
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

  const getScoreColor = (score: number) => {
    if (score >= 95) return "bg-score-exceptional";
    if (score >= 85) return "bg-score-excellent";
    if (score >= 80) return "bg-score-very-good";
    if (score >= 75) return "bg-score-good";
    if (score >= 70) return "bg-score-above-average";
    if (score >= 60) return "bg-score-average";
    if (score >= 50) return "bg-score-below-average";
    if (score >= 40) return "bg-score-poor";
    return "bg-score-very-poor";
  };

  return (
    <Card className={cn("h-full overflow-hidden", className)}>
      <CardHeader className="pb-3">
        <div className="flex justify-between items-start">
          <div>
            <CardTitle className="text-base font-semibold">{name}</CardTitle>
            <p className="text-xs text-muted-foreground mt-1">{timeframe}</p>
          </div>
          <div 
            className={cn(
              "px-2 py-1 rounded-full text-xs font-medium capitalize", 
              getStatusClass()
            )}
          >
            {status}
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="space-y-2">
          <div className="flex justify-between items-center text-sm">
            <div className="flex items-center">
              <Eye className="w-4 h-4 mr-1.5" />
              <span>Overall</span>
            </div>
            <span className={cn("font-bold text-base", getScoreClass(scores.overall))}>{scores.overall}/100</span>
          </div>
          <Progress 
            value={scores.overall} 
            className="h-2"
            indicatorClassName={getScoreColor(scores.overall)}
          />
        </div>
        
        <div className="grid grid-cols-3 gap-3 text-xs">
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Target className="w-3 h-3 mr-1" />
              <span>Strategic</span>
            </div>
            <div className={cn("font-medium text-sm", getScoreClass(scores.strategic))}>
              {scores.strategic}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <Users className="w-3 h-3 mr-1" />
              <span>Customer</span>
            </div>
            <div className={cn("font-medium text-sm", getScoreClass(scores.customer))}>
              {scores.customer}
            </div>
          </div>
          
          <div className="space-y-1">
            <div className="flex items-center text-muted-foreground">
              <BarChart3 className="w-3 h-3 mr-1" />
              <span>Execution</span>
            </div>
            <div className={cn("font-medium text-sm", getScoreClass(scores.execution))}>
              {scores.execution}
            </div>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
