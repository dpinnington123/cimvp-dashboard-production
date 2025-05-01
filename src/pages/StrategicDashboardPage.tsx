import React, { useRef, MutableRefObject } from "react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { DollarSign, Download, FileText, Calendar } from "lucide-react";

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

// Import the export services
import { generatePDF, generatePPT } from "@/services/exportService";

export default function StrategicDashboardPage() {
  const dashboardRef = useRef<HTMLDivElement>(null);
  
  // Refs for individual chart components
  const overallScoreRef = useRef<HTMLDivElement>(null);
  const metricsCardRef = useRef<HTMLDivElement>(null);
  const countryPerformanceRef = useRef<HTMLDivElement>(null);
  const brandEffectivenessRef = useRef<HTMLDivElement>(null);
  const contentTypeRef = useRef<HTMLDivElement>(null);
  const funnelRef = useRef<HTMLDivElement>(null);
  const performanceChartRef = useRef<HTMLDivElement>(null);
  const channelEffectivenessRef = useRef<HTMLDivElement>(null);
  const audienceInsightsRef = useRef<HTMLDivElement>(null);
  
  const handleRequestCostIntegration = () => {
    console.log("Requesting cost integration");
    // Implementation for request handling would go here
  };

  const handleGeneratePDF = () => {
    generatePDF(dashboardRef, {
      title: 'Marketing Activity Effectiveness Report',
      reportPeriod: 'Q1 2023',
      company: 'Change Influence',
      quality: 3 // Higher quality for better output
    });
  };

  const handleGeneratePPT = () => {
    const sections = [
      { ref: overallScoreRef, title: 'Overall Effectiveness Score' },
      { ref: metricsCardRef, title: 'Key Performance Metrics' },
      { ref: countryPerformanceRef, title: 'Content Performance by Country' },
      { ref: brandEffectivenessRef, title: 'Brand Content Effectiveness' },
      { ref: contentTypeRef, title: 'Content Type Comparison' },
      { ref: funnelRef, title: 'Behavioral Funnel' },
      { ref: performanceChartRef, title: 'Performance Trends Over Time' },
      { ref: channelEffectivenessRef, title: 'Channel Effectiveness' },
      { ref: audienceInsightsRef, title: 'Audience Engagement' }
    ];
    
    generatePPT(sections, {
      title: 'Marketing Activity Effectiveness',
      subject: 'Q1 2023 Performance Analysis',
      company: 'Change Influence',
      quality: 3 // Higher quality for better output
    });
  };

  return (
    <div className="space-y-6 p-6" ref={dashboardRef}>
      <div className="flex flex-col">
        <h1 className="text-3xl font-bold">Welcome Back, Alex</h1>
        <p className="text-muted-foreground mt-1">Here's how your marketing content is performing across markets and channels.</p>
        
        <div className="flex justify-end mt-4 gap-3">
          <Button 
            variant="default" 
            className="gap-2 bg-black text-white"
            onClick={handleGeneratePDF}
          >
            <FileText className="h-4 w-4" /> Create PDF Report
          </Button>
          <Button 
            variant="outline" 
            className="gap-2"
            onClick={handleGeneratePPT}
          >
            <Download className="h-4 w-4" /> Download Charts to PPT
          </Button>
          <Button variant="outline" className="gap-2">
            <Calendar className="h-4 w-4" /> Period: Q1 2023
          </Button>
        </div>
      </div>

      {/* Overall Marketing Activity Effectiveness Score */}
      <div ref={overallScoreRef}>
        <OverallEffectivenessScore />
      </div>

      {/* Metrics Cards Row */}
      <div ref={metricsCardRef}>
        <MetricsCard />
      </div>

      {/* Content Performance by Country and Brand Content Effectiveness */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div ref={countryPerformanceRef}>
          <ContentPerformanceByCountry />
        </div>
        <div ref={brandEffectivenessRef}>
          <BrandContentEffectiveness />
        </div>
      </div>

      {/* Content Type Comparison and Behavioral Funnel */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div ref={contentTypeRef}>
          <ContentTypeComparison />
        </div>
        <div ref={funnelRef}>
          <BehavioralFunnel />
        </div>
      </div>

      {/* Marketing Activity Effectiveness over time */}
      <div ref={performanceChartRef}>
        <Card className="stat-card animate-slide-up">
          <CardHeader>
            <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
            <p className="text-sm text-muted-foreground">Brand performance over time</p>
          </CardHeader>
          <CardContent>
            <PerformanceChart />
          </CardContent>
        </Card>
      </div>

      {/* Channel Effectiveness and Audience Engagement */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <div ref={channelEffectivenessRef}>
          <Card className="stat-card animate-slide-up">
            <CardHeader>
              <CardTitle className="text-xl">Channel Effectiveness</CardTitle>
              <p className="text-sm text-muted-foreground">Performance metrics across marketing channels</p>
            </CardHeader>
            <CardContent>
              <CampaignTable />
            </CardContent>
          </Card>
        </div>
        <div ref={audienceInsightsRef}>
          <AudienceInsights />
        </div>
      </div>
    </div>
  );
} 