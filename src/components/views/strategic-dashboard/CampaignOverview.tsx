
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { CalendarDays, Clock, Target, Users } from "lucide-react";

// Sample campaign data
const campaignsData = [
  {
    id: 1,
    name: "Q1 Product Launch",
    status: "Active",
    startDate: "Jan 15, 2025",
    endDate: "Mar 31, 2025",
    audience: "Enterprise Customers",
    objectives: ["Increase Awareness", "Lead Generation"],
    budget: "$125,000",
    progress: 65,
    kpis: {
      reach: "1.2M",
      engagement: "4.3%",
      conversion: "2.8%"
    }
  },
  {
    id: 2,
    name: "Content Syndication",
    status: "Planning",
    startDate: "Apr 10, 2025",
    endDate: "Jun 30, 2025",
    audience: "SMB Segment",
    objectives: ["Brand Authority", "Conversion"],
    budget: "$85,000",
    progress: 25,
    kpis: {
      reach: "750K",
      engagement: "3.1%",
      conversion: "1.9%"
    }
  },
  {
    id: 3,
    name: "Partner Co-marketing",
    status: "Completed",
    startDate: "Oct 1, 2024",
    endDate: "Dec 15, 2024",
    audience: "Enterprise & Mid-market",
    objectives: ["Partnership Growth", "Lead Sharing"],
    budget: "$220,000",
    progress: 100,
    kpis: {
      reach: "3.4M",
      engagement: "5.7%",
      conversion: "3.2%"
    }
  }
];

// Helper function to get status badge color
const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "planning":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "completed":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    case "paused":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const CampaignOverview: React.FC = () => {
  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl">Campaign Overview</CardTitle>
        <CardDescription>Active and planned marketing campaigns</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          {campaignsData.map((campaign, index) => (
            <div 
              key={campaign.id}
              className="p-4 rounded-lg border border-gray-100 bg-gray-50 hover:bg-gray-100 transition-colors"
              style={{ 
                animationDelay: `${index * 0.1}s`,
                animation: 'fade-in 0.5s ease-out forwards' 
              }}
            >
              <div className="flex flex-col md:flex-row md:justify-between md:items-start gap-4">
                <div className="space-y-2">
                  <div className="flex items-center justify-between md:justify-start gap-3">
                    <h3 className="font-semibold text-lg">{campaign.name}</h3>
                    <Badge variant="secondary" className={`${getStatusColor(campaign.status)}`}>
                      {campaign.status}
                    </Badge>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <CalendarDays className="h-4 w-4" />
                      <span>{campaign.startDate} - {campaign.endDate}</span>
                    </div>
                    
                    <div className="flex items-center gap-2 text-sm text-muted-foreground">
                      <Users className="h-4 w-4" />
                      <span>{campaign.audience}</span>
                    </div>
                  </div>
                  
                  <div className="flex flex-wrap gap-2 mt-1">
                    {campaign.objectives.map((objective) => (
                      <div key={objective} className="flex items-center gap-1 bg-secondary/50 text-xs px-2 py-1 rounded-full">
                        <Target className="h-3 w-3" />
                        {objective}
                      </div>
                    ))}
                  </div>
                </div>
                
                <div className="flex flex-col gap-2">
                  <div className="text-sm font-medium">Budget: {campaign.budget}</div>
                  <div className="text-sm text-muted-foreground flex items-center gap-1">
                    <Clock className="h-3 w-3" />
                    Progress: {campaign.progress}%
                  </div>
                  <div className="w-full bg-gray-200 rounded-full h-1.5 mt-1">
                    <div 
                      className="bg-primary h-1.5 rounded-full" 
                      style={{ width: `${campaign.progress}%` }}
                    />
                  </div>
                </div>
              </div>
              
              <div className="grid grid-cols-3 gap-2 mt-4 pt-3 border-t border-gray-200">
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Reach</div>
                  <div className="font-medium">{campaign.kpis.reach}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Engagement</div>
                  <div className="font-medium">{campaign.kpis.engagement}</div>
                </div>
                <div className="text-center">
                  <div className="text-xs text-muted-foreground">Conversion</div>
                  <div className="font-medium">{campaign.kpis.conversion}</div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignOverview;
