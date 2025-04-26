import React from "react";

// Import the new dashboard components
import { BrandDetails } from "@/components/views/brand-dashboard/BrandDetails";
import { ScoreCard } from "@/components/views/brand-dashboard/ScoreCard";
import { StrategyEffectiveness } from "@/components/views/brand-dashboard/StrategyEffectiveness";
import { CampaignCard } from "@/components/views/brand-dashboard/CampaignCard";
import { ContentTable } from "@/components/views/brand-dashboard/ContentTable";
import { ChannelEffectiveness } from "@/components/views/brand-dashboard/ChannelEffectiveness";
import { FunnelChart } from "@/components/views/brand-dashboard/FunnelChart";
import { PerformanceChart } from "@/components/views/brand-dashboard/PerformanceChart";

// Import UI components
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { PlusIcon, BarChart2, PieChart, Star, Heart, Zap, AlertCircle } from "lucide-react";

// Define interfaces to match component props
interface ContentItemType {
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
  // Dummy data for the brand dashboard
  const overallScores = {
    overall: 78,
    strategic: 82,
    customer: 76,
    content: 74
  };

  const strategies = [
    {
      id: "strategy-1",
      name: "Strategy 1: Market Expansion",
      description: "Focus on entering new geographical markets and demographics to increase customer base and market share.",
      score: 82
    },
    {
      id: "strategy-2",
      name: "Strategy 2: Digital Transformation",
      description: "Enhance customer experience through digital channels and implement data-driven marketing decisions.",
      score: 76
    },
    {
      id: "strategy-3",
      name: "Strategy 3: Product Innovation",
      description: "Develop new offerings and services that meet emerging customer needs while differentiating from competitors.",
      score: 80
    }
  ];

  const campaignData = [
    {
      name: "Summer Product Launch",
      scores: {
        overall: 80,
        strategic: 82,
        customer: 76,
        execution: 79
      },
      status: "active" as const,
      timeframe: "Jun 05 - Aug 15, 2023"
    },
    {
      name: "Brand Awareness Campaign",
      scores: {
        overall: 78,
        strategic: 80,
        customer: 75,
        execution: 82
      },
      status: "active" as const,
      timeframe: "Mar 10 - Sep 30, 2023"
    },
    {
      name: "Holiday Season Promotion",
      scores: {
        overall: 70,
        strategic: 88,
        customer: 75,
        execution: 0
      },
      status: "planned" as const,
      timeframe: "Oct 01 - Dec 31, 2023"
    },
    {
      name: "Spring Collection",
      scores: {
        overall: 85,
        strategic: 81,
        customer: 90,
        execution: 86
      },
      status: "completed" as const,
      timeframe: "Feb 15 - Apr 30, 2023"
    }
  ];

  const contentItems: ContentItemType[] = [
    {
      id: "content-1",
      name: "New Product Feature Video",
      campaign: "Summer Product Launch",
      format: "Video",
      type: "hero",
      status: "live",
      scores: {
        overall: 88,
        strategic: 92,
        customer: 85,
        execution: 87
      }
    },
    {
      id: "content-2",
      name: "Instagram Story Series",
      campaign: "Summer Product Launch",
      format: "Social Media",
      type: "driver",
      status: "live",
      scores: {
        overall: 86,
        strategic: 88,
        customer: 90,
        execution: 80
      }
    },
    {
      id: "content-3",
      name: "Brand Manifesto Video",
      campaign: "Brand Awareness Campaign",
      format: "Video",
      type: "hero",
      status: "live",
      scores: {
        overall: 78,
        strategic: 85,
        customer: 75,
        execution: 72
      }
    },
    {
      id: "content-4",
      name: "Digital Display Ads",
      campaign: "Brand Awareness Campaign",
      format: "Display",
      type: "driver",
      status: "live",
      scores: {
        overall: 72,
        strategic: 70,
        customer: 80,
        execution: 70
      }
    },
    {
      id: "content-5",
      name: "Customer Testimonials",
      campaign: "Brand Awareness Campaign",
      format: "Content",
      type: "driver",
      status: "draft",
      scores: {
        overall: 80,
        strategic: 82,
        customer: 85,
        execution: 75
      }
    },
    {
      id: "content-6",
      name: "Holiday Gift Guide",
      campaign: "Holiday Season Promotion",
      format: "Content",
      type: "hero",
      status: "draft",
      scores: {
        overall: 68,
        strategic: 72,
        customer: 70,
        execution: 65
      }
    },
    {
      id: "content-7",
      name: "Limited Time Offer Email",
      campaign: "Holiday Season Promotion",
      format: "Email",
      type: "driver",
      status: "draft",
      scores: {
        overall: 73,
        strategic: 80,
        customer: 80,
        execution: 65
      }
    },
    {
      id: "content-8",
      name: "Spring Collection Lookbook",
      campaign: "Spring Collection",
      format: "Content",
      type: "hero",
      status: "live",
      scores: {
        overall: 84,
        strategic: 82,
        customer: 92,
        execution: 80
      }
    },
    {
      id: "content-9",
      name: "Influencer Partnership Posts",
      campaign: "Spring Collection",
      format: "Social Media",
      type: "driver",
      status: "live",
      scores: {
        overall: 82,
        strategic: 80,
        customer: 92,
        execution: 75
      }
    },
    {
      id: "content-10",
      name: "Product Demonstration Videos",
      campaign: "Spring Collection",
      format: "Video",
      type: "driver",
      status: "draft",
      scores: {
        overall: 86,
        strategic: 82,
        customer: 88,
        execution: 90
      }
    }
  ];

  // Channel effectiveness data formatted to match component expectations
  const channelScores = {
    social: {
      overall: 82,
      strategic: 84,
      customer: 90,
      execution: 76
    },
    email: {
      overall: 75,
      strategic: 78,
      customer: 72,
      execution: 74
    },
    website: {
      overall: 78,
      strategic: 65,
      customer: 80,
      execution: 85
    },
    digital: {
      overall: 80,
      strategic: 78,
      customer: 70,
      execution: 87
    }
  };

  const funnelData = [
    { name: "Awareness to Consider", value: 78 },
    { name: "Consider to Purchase", value: 64 },
    { name: "Purchase to Growth", value: 53 }
  ];

  return (
    <div className="space-y-6 p-6 animate-in fade-in">
      <header className="mb-6">
        <h1 className="text-3xl font-bold">Brand Dashboard</h1>
        <p className="text-muted-foreground mt-1">
          Monitor your brand effectiveness and campaign performance
        </p>
      </header>

      {/* Brand Strategy Section */}
      <BrandDetails />

      {/* Overall Brand Effectiveness */}
      <div className="mb-6">
        <h2 className="text-xl font-semibold mb-4">Overall Brand Effectiveness</h2>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          <ScoreCard 
            title="Overall Effectiveness" 
            score={overallScores.overall}
            description="Combined score across all metrics"
            icon={<Star className="h-4 w-4" />}
          />
          <ScoreCard 
            title="Strategic Alignment" 
            score={overallScores.strategic}
            description="How well brand execution aligns with strategy"
            icon={<BarChart2 className="h-4 w-4" />}
          />
          <ScoreCard 
            title="Customer Alignment" 
            score={overallScores.customer}
            description="How brand resonates with target audience"
            icon={<Heart className="h-4 w-4" />}
          />
          <ScoreCard 
            title="Content Effectiveness" 
            score={overallScores.content}
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
        <StrategyEffectiveness strategies={strategies} />
      </div>

      {/* Campaign Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Campaign Effectiveness</h2>
          <Button variant="outline" size="sm">View all campaigns</Button>
        </div>
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
          {campaignData.map((campaign, index) => (
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
        <ContentTable items={contentItems} />
      </div>

      {/* Channel Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Channel Effectiveness</h2>
          <Button variant="outline" size="sm">View all channels</Button>
        </div>
        <ChannelEffectiveness channelScores={channelScores} />
      </div>

      {/* Marketing Funnel Effectiveness */}
      <div className="mb-6">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Marketing Funnel Effectiveness</h2>
          <Button variant="outline" size="sm">View detailed funnel</Button>
        </div>
        <FunnelChart data={funnelData} />
      </div>
    </div>
  );
} 