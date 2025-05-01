
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

// Define the funnel steps and their corresponding metrics
const funnelSteps = [
  { 
    id: 1, 
    name: "Awareness to Consider", 
    overallEffectiveness: 78,
    strategicAlignment: 82,
    customerAlignment: 69,
    executionEffectiveness: 75
  },
  { 
    id: 2, 
    name: "Consider to Buy/Use", 
    overallEffectiveness: 65,
    strategicAlignment: 70,
    customerAlignment: 75,
    executionEffectiveness: 62
  },
  { 
    id: 3, 
    name: "Buy/Use to Expand", 
    overallEffectiveness: 58,
    strategicAlignment: 63,
    customerAlignment: 67,
    executionEffectiveness: 54
  },
  { 
    id: 4, 
    name: "Customer to Advocacy", 
    overallEffectiveness: 42,
    strategicAlignment: 48,
    customerAlignment: 52,
    executionEffectiveness: 38
  }
];

// Define the metrics options for the dropdown
const metricOptions = [
  { value: "overallEffectiveness", label: "Overall Effectiveness" },
  { value: "strategicAlignment", label: "Strategic Alignment" },
  { value: "customerAlignment", label: "Customer Alignment" },
  { value: "executionEffectiveness", label: "Execution Effectiveness" }
];

const BehavioralFunnel: React.FC = () => {
  const [activeMetric, setActiveMetric] = useState("overallEffectiveness");

  // Function to get the width percentage for the funnel step
  const getStepWidth = (index: number, metric: string) => {
    const step = funnelSteps[index];
    const value = step[metric as keyof typeof step] as number;
    
    // Calculate width based on both the step position in the funnel and the metric value
    // Earlier funnel steps are wider, later steps get progressively narrower
    const baseWidth = 100 - (index * 12); // Reduced narrowing rate to make bars longer
    const scaledValue = (value / 100) * baseWidth;
    
    return Math.max(scaledValue, 25); // Increased minimum width to 25%
  };

  const handleMetricChange = (value: string) => {
    setActiveMetric(value);
  };

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
        
        <div className="space-y-8 flex flex-col items-center">
          {funnelSteps.map((step, index) => (
            <div key={step.id} className="relative w-full flex justify-center">
              <div 
                className="h-20 bg-gradient-to-r from-purple-100 to-indigo-100 relative flex items-center justify-between px-8 rounded-md overflow-hidden transition-all duration-300 group hover:from-purple-200 hover:to-indigo-200 shadow-md"
                style={{ 
                  width: `${getStepWidth(index, activeMetric)}%`,
                  maxWidth: "95%" // Increased max width to make bars longer
                }}
              >
                <span className="font-medium text-xs md:text-sm z-10 text-gray-800">
                  {step.name}
                </span>
                <div className="flex items-center gap-1 z-10">
                  <span className="font-bold text-xs md:text-sm">
                    {step[activeMetric as keyof typeof step]}%
                  </span>
                  <ChevronDown className="h-3 w-3 opacity-0 group-hover:opacity-100 transition-opacity" />
                </div>
                <div 
                  className="absolute inset-0 bg-gradient-to-r from-purple-500/20 to-indigo-500/20 opacity-60 group-hover:opacity-80 transition-opacity"
                  style={{ 
                    width: `${(step[activeMetric as keyof typeof step] as number)}%` 
                  }}
                />
              </div>
              
              {/* Connector line between funnel steps */}
              {index < funnelSteps.length - 1 && (
                <div className="w-0.5 h-6 bg-gray-200 absolute -bottom-6" />
              )}
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default BehavioralFunnel;
