import { useState, useEffect } from "react";
import { Link } from "react-router-dom";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/common/ChartCard";
import { CircularProgressIndicator } from "@/components/common/CircularProgressIndicator";
import CampaignTable from "@/components/views/brand-dashboard/CampaignTable";
import GeoChart from "@/components/views/brand-dashboard/GeoChart";
import MultiChannelChart from "@/components/views/brand-dashboard/MultiChannelChart";
import PdfReportButton from "@/components/views/brand-dashboard/PdfReportButton";
import ContentPerformanceByCountry from "@/components/views/brand-dashboard/ContentPerformanceByCountry";
import BrandContentEffectiveness from "@/components/views/brand-dashboard/BrandContentEffectiveness";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { 
  AreaChart, 
  Area, 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  Cell
} from "recharts";
import { Award, BarChart2, Star, TrendingUp, Target, Users, FileText } from "lucide-react";
import { demoData } from "@/assets/avatars";

// Define interfaces for campaign data
interface Campaign {
  id: number;
  name: string;
  status: string;
  budget: number;
  spent: number;
  conversions: number;
  roi: number;
  content_count: number;
  avg_content_score: number;
  top_performing_content: number | null;
  start_date: string;
  end_date: string;
  description: string;
}

// Define interface for content items
interface ContentItem {
  id: number;
  title: string;
  format_type: string;
  audience_type: string;
  campaign_id: number;
  quality_score: number;
  centricity_score: number;
  engagement_score: number;
  overall_score: number;
  created_at: string;
  views: number;
  conversions: number;
  metadata: {
    imageUrl: string;
    duration: string;
    channels: string[];
  };
}

// Define interface for performance statistics
interface PerformanceStat {
  title: string;
  value: string;
  description: string;
  icon: React.ReactNode;
}

// Define interface for score distribution data
interface ScoreRange {
  range: string;
  count: number;
  fill: string;
}

// Function to get score label based on value
const getScoreLabel = (score: number) => {
  if (score >= 85) return "Excellent";
  if (score >= 70) return "Good";
  if (score >= 50) return "Fair";
  return "Needs Improvement";
};

export default function BrandDashboardPage() {
  const [selectedCampaign, setSelectedCampaign] = useState<number | null>(null);
  const [campaignView, setCampaignView] = useState<"list" | "detail">("list");
  const [campaignDetails, setCampaignDetails] = useState<Campaign | null>(null);
  const [campaignContentItems, setCampaignContentItems] = useState<ContentItem[]>([]);
  
  // Get campaigns from demo data
  const campaigns = demoData.campaigns as Campaign[];
  
  // Effect to load campaign details and related content when a campaign is selected
  useEffect(() => {
    if (selectedCampaign) {
      // Find the selected campaign
      const campaign = campaigns.find(c => c.id === selectedCampaign);
      if (campaign) {
        setCampaignDetails(campaign);
        
        // Find content items associated with this campaign
        const contentItems = (demoData.contentItems as ContentItem[]).filter(
          item => item.campaign_id === selectedCampaign
        );
        setCampaignContentItems(contentItems);
      }
    }
  }, [selectedCampaign]);
  
  // Calculate performance stats based on all content items
  const performanceStats: PerformanceStat[] = [
    { 
      title: "Highest Content Score", 
      value: "95", 
      description: "'Spring Sale Social Media Graphics'", 
      icon: <Award className="h-4 w-4" /> 
    },
    { 
      title: "Lowest Content Score", 
      value: "42", 
      description: "'Quick Social Media Tips'", 
      icon: <Target className="h-4 w-4" /> 
    },
    { 
      title: "Average Engagement", 
      value: "5.8%", 
      description: "Across all content", 
      icon: <TrendingUp className="h-4 w-4" /> 
    },
    { 
      title: "Total Content Pieces", 
      value: demoData.contentItems.length.toString(), 
      description: "Across all campaigns", 
      icon: <FileText className="h-4 w-4" /> 
    },
  ];

  // Prepare data for score distribution chart
  const prepareScoreDistribution = (): ScoreRange[] => {
    const scoreRanges: ScoreRange[] = [
      { range: "0-50", count: 0, fill: "#f97066" },
      { range: "51-70", count: 0, fill: "#ffbb00" },
      { range: "71-85", count: 0, fill: "#65d9a5" },
      { range: "86-100", count: 0, fill: "#3fb1ac" },
    ];
    
    // Count content items in each score range
    (demoData.contentItems as ContentItem[]).forEach(item => {
      const score = item.overall_score;
      if (score < 50) scoreRanges[0].count++;
      else if (score < 70) scoreRanges[1].count++;
      else if (score < 85) scoreRanges[2].count++;
      else scoreRanges[3].count++;
    });
    
    return scoreRanges;
  };
  
  const scoreDistributionData = prepareScoreDistribution();

  // If campaign list view
  if (campaignView === "list") {
    return (
      <div className="space-y-6 animate-in fade-in p-6">
        <header className="mb-6">
          <h1 className="text-3xl font-bold">Brand Dashboard</h1>
          <p className="text-muted-foreground mt-1">
            View performance metrics for your brand campaigns and analyze content effectiveness.
          </p>
        </header>

        <Card>
          <CardHeader>
            <CardTitle>Active Campaigns</CardTitle>
            <CardDescription>Select a campaign to view detailed performance analysis</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Name</TableHead>
                  <TableHead>Status</TableHead>
                  <TableHead>Date Range</TableHead>
                  <TableHead>Content Items</TableHead>
                  <TableHead className="text-right">Avg. Content Score</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {campaigns.map((campaign) => (
                  <TableRow key={campaign.id}>
                    <TableCell className="font-medium">{campaign.name}</TableCell>
                    <TableCell>
                      <Badge variant={campaign.status === "Active" ? "default" : 
                              campaign.status === "Completed" ? "secondary" : "outline"}>
                        {campaign.status}
                      </Badge>
                    </TableCell>
                    <TableCell>{campaign.start_date} - {campaign.end_date}</TableCell>
                    <TableCell>{campaign.content_count}</TableCell>
                    <TableCell className="text-right">
                      {campaign.status !== "Planned" ? (
                        <div className="flex items-center justify-end gap-2">
                          <span className="font-medium">{campaign.avg_content_score}</span>
                          <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                            <div 
                              className="h-full rounded-full" 
                              style={{
                                width: `${campaign.avg_content_score}%`,
                                backgroundColor: campaign.avg_content_score >= 85 ? '#65d9a5' : 
                                                campaign.avg_content_score >= 70 ? '#ffbb00' : '#f97066'
                              }}
                            />
                          </div>
                        </div>
                      ) : (
                        <span className="text-muted-foreground">Not started</span>
                      )}
                    </TableCell>
                    <TableCell>
                      <button
                        onClick={() => {
                          setSelectedCampaign(campaign.id);
                          setCampaignView("detail");
                        }}
                        className="px-3 py-1 bg-primary text-primary-foreground rounded-md hover:bg-primary/90 text-sm"
                      >
                        View Details
                      </button>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
        
        {/* Campaign Overview Section */}
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
          {performanceStats.map((stat) => (
            <StatCard
              key={stat.title}
              title={stat.title}
              value={stat.value}
              description={stat.description}
              icon={stat.icon}
            />
          ))}
        </div>
      
        {/* Performance Charts Overview */}
        <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
          <ChartCard title="Content Score Distribution">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart data={scoreDistributionData}>
                <CartesianGrid strokeDasharray="3 3" vertical={false} />
                <XAxis dataKey="range" />
                <YAxis />
                <Tooltip 
                  formatter={(value) => [`${value} Content Items`, 'Count']}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="count" name="Content Count">
                  {scoreDistributionData.map((entry, index) => (
                    <Cell key={`cell-${index}`} fill={entry.fill} />
                  ))}
                </Bar>
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>

          <ChartCard title="Channel Performance Analysis">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={demoData.campaignAnalytics.byChannel}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="channel" type="category" width={100} />
                <Tooltip 
                  formatter={(value) => [`${value}%`, 'Performance']}
                  contentStyle={{ backgroundColor: 'white', borderRadius: '8px', border: '1px solid #e2e8f0' }}
                />
                <Bar dataKey="engagement" fill="#8884d8" name="Engagement" barSize={10} />
              </BarChart>
            </ResponsiveContainer>
          </ChartCard>
        </div>
      </div>
    );
  }
  
  // If campaign detail view but no campaign is selected
  if (!campaignDetails) {
    return (
      <div className="space-y-6 animate-in fade-in p-6">
        <div className="flex items-center gap-2 mb-2">
          <button 
            onClick={() => setCampaignView("list")}
            className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
          >
            ← Back to Campaigns
          </button>
        </div>
        <div className="p-6 text-center">
          <h2 className="text-xl font-medium mb-2">No campaign selected</h2>
          <p className="text-muted-foreground">Please select a campaign from the list to view details.</p>
        </div>
      </div>
    );
  }
  
  // If campaign detail view
  return (
    <div className="space-y-6 animate-in fade-in p-6">
      {/* Navigation and header */}
      <div className="flex items-center gap-2 mb-2">
        <button 
          onClick={() => setCampaignView("list")}
          className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to Campaigns
        </button>
      </div>

      {/* Header with campaign name */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{campaignDetails.name}</h1>
        <p className="text-muted-foreground mt-1">
          Campaign performance analysis and content effectiveness metrics
        </p>
      </header>
      
      {/* Main Content Grid (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Campaign Overview Card */}
          <Card className="animate-in slide-up">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Campaign Overview</CardTitle>
                <Badge variant={campaignDetails.status === "Active" ? "default" : 
                        campaignDetails.status === "Completed" ? "secondary" : "outline"}>
                  {campaignDetails.status}
                </Badge>
              </div>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="space-y-4">
                <p className="text-muted-foreground text-sm">{campaignDetails.description}</p>
                
                <div className="grid grid-cols-2 gap-3">
                  <div className="flex flex-col p-3 rounded-lg border bg-muted/30">
                    <span className="text-xs text-muted-foreground">Start Date</span>
                    <span className="font-medium">{campaignDetails.start_date}</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-lg border bg-muted/30">
                    <span className="text-xs text-muted-foreground">End Date</span>
                    <span className="font-medium">{campaignDetails.end_date}</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-lg border bg-muted/30">
                    <span className="text-xs text-muted-foreground">Budget</span>
                    <span className="font-medium">${campaignDetails.budget.toLocaleString()}</span>
                  </div>
                  <div className="flex flex-col p-3 rounded-lg border bg-muted/30">
                    <span className="text-xs text-muted-foreground">ROI</span>
                    <span className="font-medium">{campaignDetails.roi}%</span>
                  </div>
                </div>
                
                {campaignContentItems.length > 0 && (
                  <div className="pt-2">
                    <h3 className="text-sm font-medium mb-2">Top Performing Content:</h3>
                    {campaignContentItems
                      .sort((a, b) => b.overall_score - a.overall_score)
                      .slice(0, 1)
                      .map(item => (
                        <div key={item.id} className="p-3 bg-muted/30 rounded-lg">
                          <div className="flex items-center gap-2">
                            <div className="bg-primary/10 p-2 rounded-full">
                              <Award className="h-4 w-4 text-primary" />
                            </div>
                            <div>
                              <h4 className="text-sm font-medium">{item.title}</h4>
                              <p className="text-xs text-muted-foreground">{item.format_type}</p>
                            </div>
                          </div>
                          <div className="flex items-center justify-between mt-2">
                            <span className="text-xs text-muted-foreground">Score</span>
                            <div className="flex items-center gap-1">
                              <span className="font-medium">{item.overall_score}</span>
                              <Badge variant="outline" className="text-xs">
                                {getScoreLabel(item.overall_score)}
                              </Badge>
                            </div>
                          </div>
                        </div>
                    ))}
                  </div>
                )}
              </div>
            </CardContent>
          </Card>
          
          {/* Overall Score Card */}
          <Card className="animate-in slide-up">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Overall Score</CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {getScoreLabel(campaignDetails.avg_content_score)}
                </Badge>
              </div>
              <CardDescription>Campaign performance summary</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-center my-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <CircularProgressIndicator 
                    value={campaignDetails.avg_content_score} 
                    size={128} 
                    strokeWidth={10}
                  />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-3xl font-semibold">{campaignDetails.avg_content_score}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>
              </div>
              
              <div className="flex justify-between text-sm pt-2">
                <div className="text-center">
                  <div className="text-muted-foreground">Content Pieces</div>
                  <div className="font-medium text-lg">{campaignDetails.content_count}</div>
                </div>
                <div className="text-center">
                  <div className="text-muted-foreground">Conversions</div>
                  <div className="font-medium text-lg">{campaignDetails.conversions}</div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>
        
        {/* Right Column with Tabs */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="content" className="w-full">
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="content">Content Performance</TabsTrigger>
              <TabsTrigger value="channels">Channel Analytics</TabsTrigger>
              <TabsTrigger value="geography">Geographic Data</TabsTrigger>
            </TabsList>
            
            {/* Content Performance Tab */}
            <TabsContent value="content" className="mt-0 p-0 animate-in fade-in-50">
              <Card>
                <CardHeader>
                  <CardTitle>Campaign Content Items</CardTitle>
                  <CardDescription>Performance metrics for content pieces in this campaign</CardDescription>
                </CardHeader>
                <CardContent>
                  {campaignContentItems.length > 0 ? (
                    <Table>
                      <TableHeader>
                        <TableRow>
                          <TableHead>Title</TableHead>
                          <TableHead>Type</TableHead>
                          <TableHead>Created</TableHead>
                          <TableHead className="text-right">Score</TableHead>
                        </TableRow>
                      </TableHeader>
                      <TableBody>
                        {campaignContentItems.map((item) => (
                          <TableRow key={item.id}>
                            <TableCell className="font-medium">{item.title}</TableCell>
                            <TableCell>{item.format_type}</TableCell>
                            <TableCell>{item.created_at}</TableCell>
                            <TableCell className="text-right">
                              <div className="flex items-center justify-end gap-2">
                                <span className={`font-medium ${
                                  item.overall_score >= 85 ? 'text-emerald-600' : 
                                  item.overall_score >= 70 ? 'text-amber-600' : 'text-red-600'
                                }`}>
                                  {item.overall_score}
                                </span>
                                <div className="w-16 h-2 bg-gray-200 rounded-full overflow-hidden">
                                  <div 
                                    className="h-full rounded-full" 
                                    style={{
                                      width: `${item.overall_score}%`,
                                      backgroundColor: item.overall_score >= 85 ? '#65d9a5' : 
                                                      item.overall_score >= 70 ? '#ffbb00' : '#f97066'
                                    }}
                                  />
                                </div>
                              </div>
                            </TableCell>
                          </TableRow>
                        ))}
                      </TableBody>
                    </Table>
                  ) : (
                    <div className="text-center py-8 text-muted-foreground">
                      No content items found for this campaign.
                    </div>
                  )}
                </CardContent>
              </Card>
              
              {campaignContentItems.length > 0 && (
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4 mt-6">
                  {/* Content Type Effectiveness */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Content Format Effectiveness</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <ResponsiveContainer width="100%" height={200}>
                        <BarChart 
                          data={demoData.campaignAnalytics.byContentType}
                          layout="vertical"
                          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                        >
                          <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                          <XAxis type="number" domain={[0, 100]} />
                          <YAxis dataKey="type" type="category" width={100} />
                          <Tooltip />
                          <Legend />
                          <Bar dataKey="effectiveness" fill="#8884d8" name="Effectiveness" />
                          <Bar dataKey="engagement" fill="#82ca9d" name="Engagement" />
                        </BarChart>
                      </ResponsiveContainer>
                    </CardContent>
                  </Card>
                  
                  {/* Content Metrics */}
                  <Card>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-base">Content Quality Metrics</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="space-y-4">
                        {campaignContentItems.length > 0 && (
                          <>
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Quality Score</span>
                                <span className="text-sm font-medium">
                                  {Math.round(campaignContentItems.reduce((acc, item) => acc + item.quality_score, 0) / campaignContentItems.length)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-blue-500 rounded-full" 
                                  style={{width: `${Math.round(campaignContentItems.reduce((acc, item) => acc + item.quality_score, 0) / campaignContentItems.length)}%`}}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Customer Centricity</span>
                                <span className="text-sm font-medium">
                                  {Math.round(campaignContentItems.reduce((acc, item) => acc + item.centricity_score, 0) / campaignContentItems.length)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-purple-500 rounded-full" 
                                  style={{width: `${Math.round(campaignContentItems.reduce((acc, item) => acc + item.centricity_score, 0) / campaignContentItems.length)}%`}}
                                />
                              </div>
                            </div>
                            
                            <div className="space-y-2">
                              <div className="flex justify-between">
                                <span className="text-sm text-muted-foreground">Engagement</span>
                                <span className="text-sm font-medium">
                                  {Math.round(campaignContentItems.reduce((acc, item) => acc + item.engagement_score, 0) / campaignContentItems.length)}%
                                </span>
                              </div>
                              <div className="w-full h-2 bg-gray-200 rounded-full overflow-hidden">
                                <div 
                                  className="h-full bg-green-500 rounded-full" 
                                  style={{width: `${Math.round(campaignContentItems.reduce((acc, item) => acc + item.engagement_score, 0) / campaignContentItems.length)}%`}}
                                />
                              </div>
                            </div>
                          </>
                        )}
                      </div>
                    </CardContent>
                  </Card>
                </div>
              )}
            </TabsContent>
            
            {/* Channel Analytics Tab */}
            <TabsContent value="channels" className="mt-0 p-0 animate-in fade-in-50">
              <div className="space-y-6">
                <MultiChannelChart />
                <BrandContentEffectiveness />
              </div>
            </TabsContent>
            
            {/* Geographic Data Tab */}
            <TabsContent value="geography" className="mt-0 p-0 animate-in fade-in-50">
              <div className="space-y-6">
                <GeoChart />
                <ContentPerformanceByCountry />
              </div>
            </TabsContent>
          </Tabs>
        </div>
      </div>
      
      {/* PDF Export Button */}
      <div className="flex justify-end mt-8">
        <PdfReportButton />
      </div>
    </div>
  );
} 