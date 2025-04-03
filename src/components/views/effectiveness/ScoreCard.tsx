import { cn } from "@/lib/utils";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { CircularProgressIndicator } from '@/components/common/CircularProgressIndicator';

// Interface matching the example structure
export interface ScoreCardProps {
  title: string;
  value: number; // Score value (0-100)
  description: string;
  className?: string;
}

export function ScoreCard({ title, value, description, className }: ScoreCardProps) {
  // Basic color logic based on score (can be refined)
  const getScoreColorClass = (score: number) => {
    if (score >= 80) return "text-emerald-600"; 
    if (score >= 60) return "text-amber-600";
    return "text-rose-600";
  };

  return (
    <Card className={cn("animate-in fade-in", className)}> 
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium uppercase tracking-wider text-muted-foreground">
          {title}
        </CardTitle>
        {/* Placeholder for the indicator icon if needed */}
      </CardHeader>
      <CardContent className="flex items-end justify-between gap-4">
        <div>
          <div className={cn("text-3xl font-bold", getScoreColorClass(value))}>{value}%</div>
          <CardDescription className="text-xs mt-1">
            {description}
          </CardDescription>
        </div>
        {/* Add the Circular Progress Indicator here */}
        <CircularProgressIndicator value={value} size={48} strokeWidth={5} />
      </CardContent>
    </Card>
  );
} 