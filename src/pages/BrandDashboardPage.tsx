import React from "react";
import { useBrand } from "@/contexts/BrandContext";

// Import the new dashboard components
import { ScoreCard } from "@/components/views/brand-dashboard/ScoreCard";
import { StrategyEffectiveness } from "@/components/views/brand-dashboard/StrategyEffectiveness";
import { CampaignCard } from "@/components/views/brand-dashboard/CampaignCard";
import { ContentPerformanceTable } from "@/components/views/brand-dashboard/ContentPerformanceTable";
import { ChannelEffectiveness } from "@/components/views/brand-dashboard/ChannelEffectiveness";
import { FunnelChart } from "@/components/views/brand-dashboard/FunnelChart";
import { PerformanceChart } from "@/components/views/brand-dashboard/PerformanceChart";
import { CustomerEngagementSection } from "@/components/views/brand-dashboard/CustomerEngagementSection";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { 
  PlusIcon, 
  BarChart2, 
  PieChart, 
  Star, 
  Heart, 
  Zap, 
  AlertCircle,
  ChevronRight 
} from "lucide-react";

// Define interfaces to match component props
interface ContentPerformanceItem {
  id: string;
  name: string;
  campaign: string;
  format: string;
  type: "hero" | "driver";
  status: "draft" | "live";
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
}

interface ChannelScores {
  overall: number;
  strategic: number;
  customer: number;
  execution: number;
}

export default function BrandDashboardPage() {
  // Get selected brand and region from context along with the brand data
  const { selectedBrand, selectedRegion, getBrandData } = useBrand();
  const brandData = getBrandData();

  return (
    <div className="space-y-6 p-6 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Brand Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your brand effectiveness and campaign performance for {brandData.profile.name} in {selectedRegion}
        </p>
      </header>

      {/* Overall Brand Effectiveness */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Brand Effectiveness</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard 
            title="Overall Effectiveness" 
            score={brandData.overallScores.overall}
            description="Combined score across all metrics"
            icon={<Star className="h-4 w-4" />}
          />
          <ScoreCard 
            title="Strategic Alignment" 
            score={brandData.overallScores.strategic}
            description="How well brand execution aligns with strategy"
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <ScoreCard 
            title="Customer Alignment" 
            score={brandData.overallScores.customer}
            description="How brand resonates with target audience"
            icon={<Heart className="h-4 w-4" />}
          />
          <ScoreCard 
            title="Content Effectiveness" 
            score={brandData.overallScores.content}
            description="Quality of brand content and implementation"
            icon={<PieChart className="h-4 w-4" />}
          />
        </div>
      </div>

      {/* Strategy Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Strategy Effectiveness</h2>
          <Button variant="outline" size="sm">View strategy details</Button>
        </div>
        <StrategyEffectiveness strategies={brandData.strategies} />
      </div>

      {/* Campaign Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Campaign Effectiveness</h2>
          <Button variant="outline" size="sm">View all campaigns</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {brandData.campaigns.map((campaign, index) => (
            <CampaignCard 
              key={`campaign-${index}`}
              name={campaign.name}
              scores={campaign.scores}
              status={campaign.status}
              timeframe={campaign.timeframe}
            />
          ))}
        </div>
      </div>

      {/* Content Performance */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Content Performance</h2>
          <Button className="flex items-center gap-1">
            <PlusIcon className="h-4 w-4" />
            Add Content
          </Button>
        </div>
        <ContentPerformanceTable items={brandData.content} />
      </div>

      {/* Channel Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Channel Effectiveness</h2>
          <Button variant="outline" size="sm">View all channels</Button>
        </div>
        <ChannelEffectiveness channelScores={brandData.channelScores} />
      </div>

      {/* Marketing Funnel Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Marketing Funnel Effectiveness</h2>
          <Button variant="outline" size="sm">View detailed funnel</Button>
        </div>
        <FunnelChart data={brandData.funnelData} />
      </div>

      {/* Customer Engagement Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Customer Engagement Effectiveness</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-sm text-brand-blue hover:underline flex items-center gap-1 px-0"
          >
            View detailed engagement <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {brandData.personas && (
          <CustomerEngagementSection 
            engagementScores={{
              overall: brandData.overallScores.overall,
              strategic: brandData.overallScores.strategic,
              customer: brandData.overallScores.customer,
              execution: brandData.overallScores.content // Map content to execution
            }} 
            personas={brandData.personas} 
          />
        )}
      </div>

      {/* Performance Over Time */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Performance Over Time</h2>
          <Button 
            variant="link" 
            size="sm" 
            className="text-sm text-brand-blue hover:underline flex items-center gap-1 px-0"
          >
            View full reports <ChevronRight className="h-4 w-4" />
          </Button>
        </div>
        {brandData.performanceTimeData && (
          <PerformanceChart data={brandData.performanceTimeData} />
        )}
      </div>
    </div>
  );
} 