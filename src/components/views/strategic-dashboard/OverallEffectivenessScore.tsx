import React from "react";
import { Card, CardContent } from "@/components/ui/card";
import { Award } from "lucide-react";
import { AggregatedScores } from "@/types/company";

interface OverallEffectivenessScoreProps {
  overallScores: AggregatedScores;
}

// Calculate the overall effectiveness score as an average of the three key metrics
const calculateOverallScore = (scores: AggregatedScores) => {
  return ((scores.strategic + scores.customer + scores.content) / 3).toFixed(1);
};

const getScoreColor = (score: number) => {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
};

const OverallEffectivenessScore: React.FC<OverallEffectivenessScoreProps> = ({ overallScores }) => {
  const overallScore = calculateOverallScore(overallScores);
  const scoreNumber = parseFloat(overallScore);
  
  return (
    <Card className="mb-6 animate-slide-up">
      <CardContent className="pt-6">
        <div className="p-4 bg-gray-50 rounded-md border border-gray-100">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <div className="p-2 rounded-full bg-primary/10">
                <Award className="h-5 w-5 text-primary" />
              </div>
              <span className="text-xl md:text-2xl font-bold text-gray-800">Overall Marketing Activity
 Effectiveness</span>
            </div>
            <div className="flex items-baseline">
              <span className={`text-4xl font-bold ${getScoreColor(scoreNumber)}`}>
                {overallScore}
              </span>
              <span className="ml-1 text-muted-foreground text-sm">/100</span>
            </div>
          </div>
          <div className="mt-3 w-full h-2 bg-gray-200 rounded-full overflow-hidden">
            <div className="h-full bg-primary transition-all duration-500" style={{
              width: `${scoreNumber}%`
            }} />
          </div>
          <div className="mt-3 text-xs text-muted-foreground">
            Based on the average of Strategic Alignment ({overallScores.strategic}%), 
            Customer Alignment ({overallScores.customer}%), 
            and Content Effectiveness ({overallScores.content}%)
          </div>
        </div>
      </CardContent>
    </Card>
  );
};

export default OverallEffectivenessScore;