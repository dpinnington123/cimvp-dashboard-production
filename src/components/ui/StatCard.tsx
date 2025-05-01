import React from "react";
import { Card } from "@/components/ui/card";
import { cn } from "@/lib/utils";
import AnimatedCounter from "@/components/views/strategic-dashboard/AnimatedCounter";
import { ArrowDown, ArrowUp } from "lucide-react";

interface StatCardProps {
  title: string;
  value: number;
  change?: number;
  icon?: React.ReactNode;
  className?: string;
  unit?: string;
  format?: "number" | "percent" | "currency";
}

const StatCard: React.FC<StatCardProps> = ({
  title,
  value,
  change,
  icon,
  className,
  unit = "",
  format = "number"
}) => {
  const formatValue = (val: number) => {
    if (format === "currency") {
      return new Intl.NumberFormat("en-US", { 
        style: "currency", 
        currency: "USD",
        maximumFractionDigits: 0
      }).format(val);
    } else if (format === "percent") {
      return `${val.toFixed(1)}%`;
    } else if (val >= 1000000) {
      return `${(val / 1000000).toFixed(1)}M`;
    } else if (val >= 1000) {
      return `${(val / 1000).toFixed(1)}K`;
    }
    return val.toString();
  };

  return (
    <Card className={cn(
      "stat-card overflow-hidden group hover:shadow-md transition-all duration-300",
      className
    )}>
      <div className="relative h-full">
        <div className="flex justify-between items-start mb-2">
          <h3 className="text-sm font-medium text-muted-foreground">
            {title.replace('Execution Effectiveness', 'Content Effectiveness')}
          </h3>
          {icon && (
            <div className="p-2 rounded-full bg-secondary/50 text-secondary-foreground">
              {icon}
            </div>
          )}
        </div>
        
        <div className="mt-4 flex items-baseline">
          <span className={cn("text-2xl font-semibold", { "text-2xl md:text-3xl": format === "currency" })}>
            {unit && unit !== "%" && format === "currency" ? "" : unit}
            <AnimatedCounter 
              value={value} 
              formatFn={formatValue}
            />
          </span>
        </div>
        
        {typeof change !== "undefined" && (
          <div className="mt-2 flex items-center text-sm">
            <span
              className={cn(
                "inline-flex items-center font-medium",
                change >= 0 ? "text-emerald-500" : "text-rose-500"
              )}
            >
              {change >= 0 ? (
                <ArrowUp className="h-3 w-3 mr-1" />
              ) : (
                <ArrowDown className="h-3 w-3 mr-1" />
              )}
              {Math.abs(change).toFixed(1)}%
            </span>
            <span className="text-muted-foreground ml-1">vs last period</span>
          </div>
        )}
        
        <div className="absolute bottom-0 left-0 w-full h-1 bg-secondary/30 transform translate-y-1 group-hover:translate-y-0 transition-transform duration-300">
          <div 
            className={cn(
              "h-full transition-all duration-500",
              change && change >= 0 ? "bg-emerald-500" : "bg-rose-500"
            )}
            style={{ width: `${Math.min(Math.abs(change || 0) * 5, 100)}%` }}
          />
        </div>
      </div>
    </Card>
  );
};

export default StatCard;
