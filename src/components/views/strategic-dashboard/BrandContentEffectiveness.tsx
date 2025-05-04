import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Award, BarChart2, PieChart, TrendingUp } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, ScatterChart, Scatter, ZAxis, Cell, PieChart as RechartsPieChart, Pie } from "recharts";
import { BrandSummary } from "@/types/company";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface BrandContentEffectivenessProps {
  brandSummaries: BrandSummary[];
  isLoading?: boolean;
  error?: string;
}

// Define metric options with display names and colors
const metricOptions = [
  { value: "all", label: "All Metrics" },
  { value: "overall", label: "Overall", color: "#8884d8" },
  { value: "strategic", label: "Strategic Alignment", color: "#82ca9d" },
  { value: "customer", label: "Customer Alignment", color: "#ffc658" },
  { value: "content", label: "Content Quality", color: "#ff8042" }
];

// Define visualization options
const visualizationTypes = [
  { value: "bar", label: "Bar Chart", icon: <BarChart2 className="h-4 w-4 mr-2" /> },
  { value: "correlation", label: "Correlations", icon: <TrendingUp className="h-4 w-4 mr-2" /> },
  { value: "content", label: "Content Types", icon: <PieChart className="h-4 w-4 mr-2" /> }
];

const COLORS = ['#8884d8', '#82ca9d', '#ffc658', '#ff8042', '#0088FE', '#00C49F', '#FFBB28', '#FF8042'];

const CustomTooltip = ({
  active,
  payload,
  label
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <span className="w-3 h-3 inline-block mr-2" style={{ backgroundColor: entry.color }}></span>
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="ml-1 font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const CorrelationTooltip = ({
  active,
  payload,
}: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{data.name}</p>
        <div className="text-sm">
          <p><span className="font-medium">Size-Effectiveness:</span> {data.sizeEffect.toFixed(2)}</p>
          <p><span className="font-medium">Growth-Customer:</span> {data.growthCustomer.toFixed(2)}</p>
          <p><span className="font-medium">Content-Strategy:</span> {data.contentStrategy.toFixed(2)}</p>
          <p><span className="font-medium">Annual Sales:</span> {data.sales}</p>
          <p><span className="font-medium">Growth:</span> {data.growth}</p>
        </div>
      </div>
    );
  }
  return null;
};

const ContentTypeTooltip = ({
  active,
  payload,
}: any) => {
  if (active && payload && payload.length) {
    const data = payload[0].payload;
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{data.name}</p>
        <p className="text-sm"><span className="font-medium">Effectiveness:</span> {data.value}%</p>
      </div>
    );
  }
  return null;
};

const BrandContentEffectiveness: React.FC<BrandContentEffectivenessProps> = ({ 
  brandSummaries,
  isLoading = false,
  error
}) => {
  const [activeMetric, setActiveMetric] = useState<string>("all");
  const [activeTab, setActiveTab] = useState<string>("bar");
  
  // Format data for bar chart
  const chartData = brandSummaries
    .sort((a, b) => b.scores.overall - a.scores.overall) // Sort by overall score descending
    .slice(0, 5) // Show top 5 brands
    .map(brand => ({
      brand: brand.name,
      overall: brand.scores.overall,
      strategic: brand.scores.strategic,
      customer: brand.scores.customer,
      content: brand.scores.content,
      region: brand.region,
      annualSales: brand.financials.annualSales
    }));

  // Format data for correlation scatter chart
  const correlationData = brandSummaries
    .filter(brand => brand.relationships)
    .map(brand => ({
      name: brand.name,
      sizeEffect: brand.relationships?.sizeEffectiveness || 0,
      growthCustomer: brand.relationships?.growthCustomerAlignment || 0,
      contentStrategy: brand.relationships?.contentStrategyAlignment || 0,
      campaignRatio: brand.relationships?.campaignEffectivenessRatio || 1,
      sales: brand.financials.annualSales,
      growth: brand.financials.growth,
      // Use campaignRatio for bubble size (scale between 25-60)
      size: Math.max(25, Math.min(60, (brand.relationships?.campaignEffectivenessRatio || 1) * 40))
    }));

  // Format data for content type pie chart
  const getContentTypeData = () => {
    const contentTypes: Record<string, number> = {};
    
    // Aggregate content type effectiveness across brands
    brandSummaries.forEach(brand => {
      if (brand.contentTypeEffectiveness) {
        Object.entries(brand.contentTypeEffectiveness).forEach(([type, score]) => {
          if (!contentTypes[type]) {
            contentTypes[type] = 0;
          }
          contentTypes[type] += score;
        });
      }
    });
    
    // Calculate averages and prepare for pie chart
    return Object.entries(contentTypes).map(([name, value], index) => ({
      name,
      value: Math.round(value / brandSummaries.filter(b => 
        b.contentTypeEffectiveness && b.contentTypeEffectiveness[name]
      ).length),
      fill: COLORS[index % COLORS.length]
    }));
  };
  
  const contentTypeData = getContentTypeData();

  // Get the appropriate metric display name
  const getMetricName = (metric: string): string => {
    const option = metricOptions.find(opt => opt.value === metric);
    return option ? option.label : metric;
  };

  // Determine which bars to display based on selected metric
  const getVisibleBars = () => {
    if (activeMetric === "all") {
      return [
        <Bar key="overall" dataKey="overall" fill="#8884d8" name="Overall" stackId="a" />,
        <Bar key="strategic" dataKey="strategic" fill="#82ca9d" name="Strategic Alignment" stackId="b" />,
        <Bar key="customer" dataKey="customer" fill="#ffc658" name="Customer Alignment" stackId="c" />,
        <Bar key="content" dataKey="content" fill="#ff8042" name="Content Quality" stackId="d" />
      ];
    } else {
      const metric = metricOptions.find(m => m.value === activeMetric);
      return [
        <Bar 
          key={activeMetric} 
          dataKey={activeMetric} 
          fill={metric?.color || "#8884d8"} 
          name={getMetricName(activeMetric)} 
          barSize={10} 
          radius={[0, 4, 4, 0]} 
        />
      ];
    }
  };

  // If loading or error, show appropriate state
  if (isLoading) {
    return (
      <Card className="stat-card animate-slide-up">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
                <CardDescription>Content effectiveness by brand</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-muted-foreground">Loading data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  if (error) {
    return (
      <Card className="stat-card animate-slide-up">
        <CardHeader className="pb-2">
          <div className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <Award className="h-5 w-5 text-muted-foreground" />
              <div>
                <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
                <CardDescription>Content effectiveness by brand</CardDescription>
              </div>
            </div>
          </div>
        </CardHeader>
        <CardContent>
          <div className="h-[300px] flex items-center justify-center">
            <p className="text-red-500">{error}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
              <CardDescription>Content effectiveness analysis</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="mb-4">
          <Tabs defaultValue="bar" value={activeTab} onValueChange={setActiveTab}>
            <TabsList className="grid grid-cols-3">
              {visualizationTypes.map((type) => (
                <TabsTrigger key={type.value} value={type.value} className="flex items-center">
                  {type.icon} {type.label}
                </TabsTrigger>
              ))}
            </TabsList>
            
            <TabsContent value="bar" className="pt-4">
              <div className="mb-4 w-full sm:w-64">
                <Select value={activeMetric} onValueChange={setActiveMetric}>
                  <SelectTrigger>
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

              <ResponsiveContainer width="100%" height={250}>
                <BarChart 
                  data={chartData}
                  layout="vertical" 
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                  <XAxis type="number" domain={[0, 100]} />
                  <YAxis dataKey="brand" type="category" width={100} />
                  <Tooltip content={<CustomTooltip />} />
                  <Legend />
                  {getVisibleBars()}
                </BarChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="correlation" className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Correlations between business metrics and marketing effectiveness. 
                Bubble size represents campaign effectiveness ratio.
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <ScatterChart
                  margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis 
                    type="number" 
                    dataKey="sizeEffect" 
                    name="Size-Effectiveness Correlation" 
                    domain={[-1, 1]}
                    label={{ value: 'Size-Effectiveness', position: 'bottom', offset: 0 }}
                  />
                  <YAxis 
                    type="number" 
                    dataKey="growthCustomer" 
                    name="Growth-Customer Correlation" 
                    domain={[-1, 1]}
                    label={{ value: 'Growth-Customer', angle: -90, position: 'left' }}
                  />
                  <ZAxis type="number" dataKey="size" range={[25, 60]} />
                  <Tooltip content={<CorrelationTooltip />} />
                  <Scatter name="Correlations" data={correlationData} fill="#8884d8" />
                </ScatterChart>
              </ResponsiveContainer>
            </TabsContent>
            
            <TabsContent value="content" className="pt-4">
              <p className="text-sm text-muted-foreground mb-4">
                Content type effectiveness across all brands
              </p>
              <ResponsiveContainer width="100%" height={250}>
                <RechartsPieChart>
                  <Pie
                    data={contentTypeData}
                    dataKey="value"
                    nameKey="name"
                    cx="50%"
                    cy="50%"
                    outerRadius={80}
                    label={(entry) => `${entry.name}: ${entry.value}%`}
                  >
                    {contentTypeData.map((entry, index) => (
                      <Cell key={`cell-${index}`} fill={entry.fill} />
                    ))}
                  </Pie>
                  <Tooltip content={<ContentTypeTooltip />} />
                </RechartsPieChart>
              </ResponsiveContainer>
            </TabsContent>
          </Tabs>
        </div>
      </CardContent>
    </Card>
  );
};

export default BrandContentEffectiveness;
