import React, { useState } from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { ChevronDown } from "lucide-react";
import { FunnelStep } from "@/types/brand";
import { Skeleton } from "@/components/ui/skeleton";

interface BehavioralFunnelProps {
  funnelData: FunnelStep[];
  isLoading?: boolean;
  error?: string;
}

// Define the metrics options for the dropdown
const metricOptions = [
  { value: "overallEffectiveness", label: "Overall Effectiveness" },
  { value: "strategicAlignment", label: "Strategic Alignment" },
  { value: "customerAlignment", label: "Customer Alignment" },
  { value: "executionEffectiveness", label: "Execution Effectiveness" }
];

const BehavioralFunnel: React.FC<BehavioralFunnelProps> = ({ 
  funnelData, 
  isLoading = false,
  error
}) => {
  const [activeMetric, setActiveMetric] = useState<string>("customerAlignment");
  
  const handleMetricChange = (value: string) => {
    setActiveMetric(value);
  };
  
  // Get the value to display based on the selected metric
  const getMetricValue = (step: FunnelStep, metric: string): number => {
    if (!step.metrics) return step.value;
    
    switch (metric) {
      case "overallEffectiveness":
        return step.metrics.overallEffectiveness;
      case "strategicAlignment":
        return step.metrics.strategicAlignment;
      case "customerAlignment":
        return step.metrics.customerAlignment;
      case "executionEffectiveness":
        return step.metrics.executionEffectiveness;
      default:
        return step.value;
    }
  };
  
  // Calculate widths dynamically based on metric values
  const calculateWidths = () => {
    if (!funnelData || funnelData.length === 0) return [];
    
    const maxBaseWidth = 92; // Maximum width percentage for the first step
    const minWidth = 35;     // Minimum width for the last step
    const widths: number[] = [];
    
    // First calculate all the values based on the active metric
    const values = funnelData.map(step => getMetricValue(step, activeMetric));
    
    // Calculate widths iteratively (not recursively)
    for (let i = 0; i < funnelData.length; i++) {
      if (i === 0) {
        // First step is always the widest
        widths.push(maxBaseWidth);
      } else {
        // Calculate width based on the percentage relative to the previous step's value
        const currentValue = values[i];
        const prevValue = values[i - 1];
        const ratio = prevValue > 0 ? currentValue / prevValue : 0.8; // Prevent division by zero
        
        // Calculate new width as a percentage of the previous step's width
        const newWidth = widths[i - 1] * ratio;
        
        // Ensure minimum width for better visualization
        widths.push(Math.max(newWidth, minWidth));
      }
    }
    
    return widths;
  };

  // Default widths for loading state
  const defaultWidths = [92, 75, 58, 45];
  
  // Get widths based on current state
  const widths = isLoading || !funnelData ? defaultWidths : calculateWidths();

  // Render loading state
  if (isLoading) {
    return (
      <Card className="stat-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Behavioural Funnel</CardTitle>
          <CardDescription>Effectiveness metrics across the customer journey funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="mb-6 w-full sm:w-72">
            <Skeleton className="w-full h-10" />
          </div>
          <div className="px-4 space-y-6">
            {[...Array(4)].map((_, i) => (
              <Skeleton key={i} className="w-full h-14" style={{ width: `${defaultWidths[i]}%` }} />
            ))}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render error state
  if (error) {
    return (
      <Card className="stat-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Behavioural Funnel</CardTitle>
          <CardDescription>Effectiveness metrics across the customer journey funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-red-500 p-4 text-center">
            {error}
          </div>
        </CardContent>
      </Card>
    );
  }

  // Render no data state
  if (!funnelData || funnelData.length === 0) {
    return (
      <Card className="stat-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Behavioural Funnel</CardTitle>
          <CardDescription>Effectiveness metrics across the customer journey funnel</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="text-gray-500 p-4 text-center">
            No funnel data available
          </div>
        </CardContent>
      </Card>
    );
  }
  
  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl">Behavioural Funnel</CardTitle>
        <CardDescription>Effectiveness metrics across the customer journey funnel</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-6 w-full sm:w-72">
          <Select value={activeMetric} onValueChange={handleMetricChange}>
            <SelectTrigger className="w-full">
              <SelectValue placeholder="Select metric" />
            </SelectTrigger>
            <SelectContent>
              {metricOptions.map((option) => (
                <SelectItem key={option.value} value={option.value}>
                  {option.label}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>
        </div>
        
        <div className="px-4">
          {funnelData.map((step, index) => (
            <div key={index} className="mb-6 relative flex flex-col items-center">
              <div 
                className="w-full flex justify-center"
                style={{ marginBottom: index < funnelData.length - 1 ? "1.5rem" : "0" }}
              >
                <div 
                  className="py-5 px-6 rounded-lg shadow-sm flex justify-between items-center"
                  style={{
                    width: `${widths[Math.min(index, widths.length - 1)]}%`,
                    background: "linear-gradient(90deg, rgba(152, 129, 253, 0.52) 0%, rgba(241, 129, 240, 0.47) 100%)",
                  }}
                >
                  <span className="text-gray-800 font-medium">{step.name}</span>
                  <span className="text-gray-800 font-bold">{getMetricValue(step, activeMetric)}%</span>
                </div>
              </div>
              
              {index < funnelData.length - 1 && (
                <ChevronDown className="absolute -bottom-5 text-gray-300 h-6 w-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralFunnel;
