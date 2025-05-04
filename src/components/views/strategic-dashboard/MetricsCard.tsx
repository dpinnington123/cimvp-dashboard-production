import React from "react";
import { Award, Target, BarChart2, DollarSign } from "lucide-react";
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";

interface MetricsCardProps {
  data: {
    strategic: number;
    customer: number;
    content: number;
    financialSummary: {
      totalAnnualSales: string;
      averageGrowth: string;
    };
  };
}

const MetricsCard: React.FC<MetricsCardProps> = ({ data }) => {
  const { toast } = useToast();
  
  const handleRequestCostIntegration = () => {
    toast({
      title: "Cost Integration Requested",
      description: "Your request for cost integration has been submitted. Our team will contact you shortly.",
      duration: 5000,
    });
  };

  return (
    <div className="grid gap-4 grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 mb-4">
      {/* Strategic Alignment Card */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-start p-4 pb-0">
          <h3 className="text-sm font-medium text-muted-foreground">Strategic Alignment</h3>
          <div className="p-1">
            <Award className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4 pt-2">
          <div className="text-2xl font-bold">{data.strategic.toFixed(1)}%</div>
          <div className="text-xs mt-1 text-emerald-600">
            ↑ 3.2% vs last period
          </div>
        </div>
      </div>
      
      {/* Customer Alignment Card */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-start p-4 pb-0">
          <h3 className="text-sm font-medium text-muted-foreground">Customer Alignment</h3>
          <div className="p-1">
            <Target className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4 pt-2">
          <div className="text-2xl font-bold">{data.customer.toFixed(1)}%</div>
          <div className="text-xs mt-1 text-emerald-600">
            ↑ 5.6% vs last period
          </div>
        </div>
      </div>
      
      {/* Content Effectiveness Card */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-start p-4 pb-0">
          <h3 className="text-sm font-medium text-muted-foreground">Content Effectiveness</h3>
          <div className="p-1">
            <BarChart2 className="h-4 w-4" />
          </div>
        </div>
        <div className="p-4 pt-2">
          <div className="text-2xl font-bold">{data.content.toFixed(1)}%</div>
          <div className="text-xs mt-1 text-emerald-600">
            ↑ 1.8% vs last period
          </div>
        </div>
      </div>
      
      {/* Financial Summary card */}
      <div className="bg-white rounded-lg border shadow-sm">
        <div className="flex justify-between items-start p-4 pb-0">
          <h3 className="text-sm font-medium text-muted-foreground">Financial Summary</h3>
          <div className="p-1">
            <DollarSign className="h-4 w-4" />
          </div>
        </div>
        
        <div className="p-4 pt-2">
          <div className="flex flex-col">
            <div className="mb-1">
              <span className="text-sm text-muted-foreground">Total Annual Sales:</span>
              <span className="text-base font-bold ml-1">{data.financialSummary.totalAnnualSales}</span>
            </div>
            <div>
              <span className="text-sm text-muted-foreground">Average Growth:</span>
              <span className="text-base font-bold ml-1 text-emerald-600">{data.financialSummary.averageGrowth}</span>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default MetricsCard;
