import React from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign } from "lucide-react";

// Import the new dashboard components
import OverallEffectivenessScore from "@/components/views/strategic-dashboard/OverallEffectivenessScore";
import MetricsCard from "@/components/views/strategic-dashboard/MetricsCard";
import ContentPerformanceByCountry from "@/components/views/strategic-dashboard/ContentPerformanceByCountry";
import BrandContentEffectiveness from "@/components/views/strategic-dashboard/BrandContentEffectiveness";
import ContentTypeComparison from "@/components/views/strategic-dashboard/ContentTypeComparison";
import BehavioralFunnel from "@/components/views/strategic-dashboard/BehavioralFunnel";
import PerformanceChart from "@/components/views/strategic-dashboard/PerformanceChart";
import AudienceInsights from "@/components/views/strategic-dashboard/AudienceInsights";
import CampaignTable from "@/components/views/strategic-dashboard/CampaignTable";

export default function StrategicDashboardPage() {
  const handleRequestCostIntegration = () => {
    console.log("Requesting cost integration");
    // Implementation for request handling would go here
  };

  return (
    <div className="space-y-6 p-6">
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Welcome Back, Alex</h1>
        <p className="text-muted-foreground mt-1">Here's how your marketing content is performing across markets and channels.</p>
        
        <div className="flex justify-end mt-4 gap-3">
          <Button variant="outline" className="gap-2">
            Create PDF Report
          </Button>
          <Button variant="outline" className="gap-2">
            Download Charts to PPT
          </Button>
          <Button variant="outline" className="gap-2">
            Period: Q1 2023
          </Button>
        </div>
      </div>

      {/* Overall Marketing Activity Effectiveness Score */}
      <OverallEffectivenessScore />

      {/* Metrics Cards Row */}
      <MetricsCard />

      {/* Content Performance by Country and Brand Content Effectiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentPerformanceByCountry />
        <BrandContentEffectiveness />
      </div>

      {/* Content Type Comparison and Behavioral Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <ContentTypeComparison />
        <BehavioralFunnel />
      </div>

      {/* Marketing Activity Effectiveness over time */}
      <Card className="stat-card animate-slide-up">
        <CardHeader>
          <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
          <p className="text-sm text-muted-foreground">Brand performance over time</p>
        </CardHeader>
        <CardContent>
          <PerformanceChart />
        </CardContent>
      </Card>

      {/* Channel Effectiveness and Audience Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card className="stat-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl">Channel Effectiveness</CardTitle>
            <p className="text-sm text-muted-foreground">Performance metrics across marketing channels</p>
          </CardHeader>
          <CardContent>
            <CampaignTable />
          </CardContent>
        </Card>
        <AudienceInsights />
      </div>
    </div>
  );
} 