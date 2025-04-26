
import React from 'react';
import { Card, CardContent } from "@/components/ui/card";
import { cn } from "@/lib/utils";

interface FunnelItem {
  name: string;
  value: number;
}

interface FunnelChartProps {
  data: FunnelItem[];
}

export function FunnelChart({ data }: FunnelChartProps) {
  const COLORS = ["#9b87f5", "#7E69AB", "#6E59A5"];
  
  const getScoreClass = (score: number) => {
    if (score >= 85) return "text-score-excellent";
    if (score >= 70) return "text-score-good";
    if (score >= 50) return "text-score-average";
    return "text-score-poor";
  };

  return (
    <Card className="h-full">
      <CardContent className="p-6">
        <div className="flex flex-col md:flex-row gap-6">
          <div className="w-full md:w-2/3 flex items-stretch">
            <div className="w-full flex flex-col">
              {data.map((item, index) => (
                <div key={index} className="w-full h-[120px] flex items-center">
                  <div 
                    className="relative mx-auto h-[80px] w-full flex items-center justify-center"
                    style={{
                      width: `${95 - (index * 15)}%`,
                      backgroundColor: COLORS[index % COLORS.length],
                      clipPath: 'polygon(0 0, 100% 0, 94% 100%, 6% 100%)',
                      zIndex: data.length - index,
                    }}
                  >
                    <span className="text-white font-medium text-sm md:text-base">
                      {item.name}
                    </span>
                  </div>
                </div>
              ))}
            </div>
          </div>
          
          <div className="w-full md:w-1/3 flex flex-col">
            {data.map((item, index) => (
              <div 
                key={index} 
                className="h-[120px] flex flex-col justify-center space-y-2"
              >
                <div className="flex justify-between items-center">
                  <span className="text-sm font-medium">{item.name}</span>
                  <span className={cn("text-lg font-bold", getScoreClass(item.value))}>
                    {item.value}%
                  </span>
                </div>
                <div className="h-2 bg-muted rounded overflow-hidden">
                  <div 
                    className="h-full rounded" 
                    style={{
                      width: `${item.value}%`,
                      backgroundColor: COLORS[index % COLORS.length]
                    }}
                  />
                </div>
                <p className="text-xs text-muted-foreground">
                  {item.name === "Awareness to Consider" && "How effectively marketing creates initial interest"}
                  {item.name === "Consider to Purchase" && "Conversion from consideration to actual purchase"}
                  {item.name === "Purchase to Growth" && "Retention and customer growth after initial purchase"}
                </p>
              </div>
            ))}
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
