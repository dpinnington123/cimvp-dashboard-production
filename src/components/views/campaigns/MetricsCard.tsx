
import React from "react";
import { BarChart2, Award, Target, Globe } from "lucide-react";
import StatCard from "@/components/ui/StatCard";
import { demoData } from "@/assets/avatars";

const getIconForMetric = (title: string) => {
  switch (title.toLowerCase()) {
    case "content quality":
      return <Award className="h-4 w-4" />;
    case "customer centricity":
      return <Target className="h-4 w-4" />;
    case "brand effectiveness":
      return <Globe className="h-4 w-4" />;
    case "content roi":
      return <BarChart2 className="h-4 w-4" />;
    default:
      return <BarChart2 className="h-4 w-4" />;
  }
};

const MetricsCard: React.FC = () => {
  // Create modified data by setting unit to empty string for specific metrics
  const modifiedKpis = demoData.kpis.map(metric => {
    if (["Content Quality", "Customer Centricity", "Brand Effectiveness"].includes(metric.title)) {
      return {
        ...metric,
        unit: "", // Remove % by setting unit to empty string
      };
    }
    return metric;
  });

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4 stagger-animation">
      {modifiedKpis.map((metric) => (
        <StatCard
          key={metric.id}
          title={metric.title}
          value={metric.value}
          change={metric.change}
          unit={metric.unit}
          format={metric.format as "number" | "percent" | "currency"}
          icon={getIconForMetric(metric.title)}
          className="animate-scale-in"
        />
      ))}
    </div>
  );
};

export default MetricsCard;
