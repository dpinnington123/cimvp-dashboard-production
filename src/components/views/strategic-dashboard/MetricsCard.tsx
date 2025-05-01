import React from "react";
import { BarChart2, Award, Target, Globe, DollarSign } from "lucide-react";
import StatCard from "@/components/common/StatCard";
import { demoData } from "@/assets/avatars";
import { Button } from "@/components/ui/button";
import { useToast } from "@/hooks/use-toast";

const getIconForMetric = (title: string) => {
  switch (title.toLowerCase()) {
    case "content quality":
      return <Globe className="h-4 w-4" />;
    case "audience engagement":
      return <Target className="h-4 w-4" />;
    case "average time on page":
      return <Award className="h-4 w-4" />;
    case "conversion rate":
      return <BarChart2 className="h-4 w-4" />;
    case "content roi":
      return <DollarSign className="h-4 w-4" />;
    default:
      return <BarChart2 className="h-4 w-4" />;
  }
};

const formatValue = (metric: any) => {
  if (metric.format === "percent") {
    return `${metric.value.toFixed(1)}%`;
  } else if (metric.format === "decimal") {
    return `${Math.floor(metric.value)} min`;
  } else if (metric.format === "number") {
    return `${(metric.value / 1000).toFixed(1)} K`.replace('.0K', 'K');
  }
  return metric.value;
};

const formatChange = (change: number) => {
  const prefix = change >= 0 ? "+" : "";
  return `${prefix}${change}% vs last period`;
};

const MetricsCard: React.FC = () => {
  const { toast } = useToast();
  
  const handleRequestCostIntegration = () => {
    toast({
      title: "Cost Integration Requested",
      description: "Your request for cost integration has been submitted. Our team will contact you shortly.",
      duration: 5000,
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 mb-4">
      {demoData.kpis.map((metric) => (
        <div key={metric.id} className="bg-white rounded-lg border shadow-sm h-[105px]">
          <div className="flex justify-between items-start p-4 pb-0">
            <h3 className="text-sm font-medium text-muted-foreground">{metric.title}</h3>
            <div className="p-1">
              {getIconForMetric(metric.title)}
            </div>
          </div>
          <div className="p-4 pt-2">
            <div className="text-2xl font-bold">
              {formatValue(metric)}
            </div>
            <div className={`text-xs mt-1 ${metric.change >= 0 ? 'text-emerald-600' : 'text-rose-600'}`}>
              {metric.change >= 0 ? '↑' : '↓'} {Math.abs(metric.change)}% vs last period
            </div>
          </div>
        </div>
      ))}
      
      {/* Content ROI card */}
      <div className="bg-white rounded-lg border border-dashed shadow-sm h-[105px]">
        <div className="flex justify-between items-start p-4 pb-0">
          <h3 className="text-sm font-medium text-muted-foreground">Content ROI</h3>
          <div className="p-1">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        
        <div className="p-4 pt-2 flex flex-col items-start justify-center">
          <p className="text-muted-foreground text-xs">
            Connect your cost data to see content ROI metrics
          </p>
          <Button 
            variant="outline" 
            size="sm"
            onClick={handleRequestCostIntegration}
            className="mt-2 h-8 text-xs"
          >
            Request Cost Integration
          </Button>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
