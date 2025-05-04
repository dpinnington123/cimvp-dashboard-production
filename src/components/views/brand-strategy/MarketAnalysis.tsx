import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from "lucide-react";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
  LineChart,
  Line,
} from "recharts";
import { useBrand } from "@/contexts/BrandContext";

// Define types for chart data
interface MarketShareItem {
  name: string;
  value: number;
  fill: string;
}

interface SalesDataItem {
  name: string;
  value: number;
}

// Helper function to generate market share data
const generateMarketShareData = (brandData: any): MarketShareItem[] => {
  const colors = ["#10b981", "#6366f1", "#f59e0b", "#ef4444", "#8b5cf6"];
  
  // Extract competitor info from brand data
  const competitorData = brandData.marketAnalysis?.competitorAnalysis || [];
  
  // Define our brand and competitors
  const marketShareData: MarketShareItem[] = [
    { 
      name: brandData.profile.name, 
      value: parseFloat(competitorData[0]?.marketShare || "25"),
      fill: colors[0]
    }
  ];
  
  // Add competitors
  competitorData.forEach((competitor: any, index: number) => {
    if (competitor.name) {
      marketShareData.push({
        name: competitor.name,
        value: parseFloat(competitor.marketShare || "0"),
        fill: colors[(index + 1) % colors.length]
      });
    }
  });
  
  // Add "Others" category if needed
  const totalShare = marketShareData.reduce((sum, item) => sum + item.value, 0);
  if (totalShare < 100) {
    marketShareData.push({
      name: "Others",
      value: 100 - totalShare,
      fill: colors[colors.length - 1]
    });
  }
  
  return marketShareData;
};

// Helper function to generate sales data
const generateSalesData = (brandData: any): SalesDataItem[] => {
  // Mock quarterly sales data
  const thisYear = new Date().getFullYear();
  
  return [
    { name: `Q1 ${thisYear-1}`, value: Math.floor(Math.random() * 30) + 50 },
    { name: `Q2 ${thisYear-1}`, value: Math.floor(Math.random() * 30) + 60 },
    { name: `Q3 ${thisYear-1}`, value: Math.floor(Math.random() * 30) + 70 },
    { name: `Q4 ${thisYear-1}`, value: Math.floor(Math.random() * 30) + 80 },
    { name: `Q1 ${thisYear}`, value: Math.floor(Math.random() * 30) + 85 },
    { name: `Q2 ${thisYear}`, value: Math.floor(Math.random() * 30) + 90 },
    { name: `Q3 ${thisYear}`, value: Math.floor(Math.random() * 25) + 100 },
    { name: `Q4 ${thisYear}`, value: Math.floor(Math.random() * 20) + 110 },
  ];
};

const MarketAnalysis = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  // State for market share data
  const [marketShareData, setMarketShareData] = useState<MarketShareItem[]>([]);
  
  // State for sales data
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  
  // State for editable market overview
  const [editingMarketOverview, setEditingMarketOverview] = useState(false);
  const [marketOverview, setMarketOverview] = useState({
    marketSize: brandData.marketAnalysis?.marketSize || "$4.6 Billion",
    growthRate: brandData.marketAnalysis?.growthRate || "12.3% CAGR",
    keyTrends: "Increasing demand for sustainable products, shift to e-commerce, growing health consciousness."
  });
  
  // State for competitor comparison
  const [editingCompetitors, setEditingCompetitors] = useState(false);
  const [competitorData, setCompetitorData] = useState([
    {
      name: brandData.marketAnalysis?.competitorAnalysis?.[0]?.name || "Competitor 1",
      share: brandData.marketAnalysis?.competitorAnalysis?.[0]?.marketShare || "18%",
      strengths: brandData.marketAnalysis?.competitorAnalysis?.[0]?.strengths?.join(", ") || "Strong retail presence, Wide product range",
      weaknesses: brandData.marketAnalysis?.competitorAnalysis?.[0]?.weaknesses?.join(", ") || "Higher price point, Less digital engagement"
    },
    {
      name: brandData.marketAnalysis?.competitorAnalysis?.[1]?.name || "Competitor 2",
      share: brandData.marketAnalysis?.competitorAnalysis?.[1]?.marketShare || "15%",
      strengths: brandData.marketAnalysis?.competitorAnalysis?.[1]?.strengths?.join(", ") || "Strong brand recognition, Celebrity endorsements",
      weaknesses: brandData.marketAnalysis?.competitorAnalysis?.[1]?.weaknesses?.join(", ") || "Limited product innovation, Supply chain issues"
    }
  ]);
  
  // Update data when brand changes
  useEffect(() => {
    if (brandData) {
      // Generate market share data
      const newMarketShareData = generateMarketShareData(brandData);
      setMarketShareData(newMarketShareData);
      
      // Generate sales data
      const newSalesData = generateSalesData(brandData);
      setSalesData(newSalesData);
      
      // Update market overview
      setMarketOverview({
        marketSize: brandData.marketAnalysis?.marketSize || "$4.6 Billion",
        growthRate: brandData.marketAnalysis?.growthRate || "12.3% CAGR",
        keyTrends: "Increasing demand for sustainable products, shift to e-commerce, growing health consciousness."
      });
      
      // Update competitor data
      if (brandData.marketAnalysis?.competitorAnalysis) {
        const competitors = brandData.marketAnalysis.competitorAnalysis.map((comp: any) => ({
          name: comp.name,
          share: comp.marketShare,
          strengths: comp.strengths?.join(", ") || "",
          weaknesses: comp.weaknesses?.join(", ") || ""
        }));
        
        if (competitors.length > 0) {
          setCompetitorData(competitors);
        }
      }
    }
  }, [brandData]);
  
  // Save market overview edits
  const handleSaveMarketOverview = () => {
    setEditingMarketOverview(false);
  };
  
  // Cancel market overview edits
  const handleCancelMarketOverview = () => {
    setMarketOverview({
      marketSize: brandData.marketAnalysis?.marketSize || "$4.6 Billion",
      growthRate: brandData.marketAnalysis?.growthRate || "12.3% CAGR",
      keyTrends: "Increasing demand for sustainable products, shift to e-commerce, growing health consciousness."
    });
    setEditingMarketOverview(false);
  };
  
  // Save competitor edits
  const handleSaveCompetitors = () => {
    setEditingCompetitors(false);
  };
  
  // Cancel competitor edits
  const handleCancelCompetitors = () => {
    if (brandData.marketAnalysis?.competitorAnalysis) {
      const competitors = brandData.marketAnalysis.competitorAnalysis.map((comp: any) => ({
        name: comp.name,
        share: comp.marketShare,
        strengths: comp.strengths?.join(", ") || "",
        weaknesses: comp.weaknesses?.join(", ") || ""
      }));
      
      if (competitors.length > 0) {
        setCompetitorData(competitors);
      }
    }
    setEditingCompetitors(false);
  };
  
  return (
    <div className="space-y-8">
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Market Overview</CardTitle>
            <CardDescription>Key market information and trends</CardDescription>
          </div>
          {!editingMarketOverview ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500"
              onClick={() => setEditingMarketOverview(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500"
                onClick={handleCancelMarketOverview}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-emerald-600"
                onClick={handleSaveMarketOverview}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!editingMarketOverview ? (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Market Size</div>
                <div className="text-xl font-bold">{marketOverview.marketSize}</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
                <div className="text-xl font-bold">{marketOverview.growthRate}</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Key Trends</div>
                <div className="text-sm">{marketOverview.keyTrends}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Market Size</div>
                <Input 
                  value={marketOverview.marketSize} 
                  onChange={(e) => setMarketOverview({...marketOverview, marketSize: e.target.value})}
                  className="text-xl font-bold"
                />
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
                <Input 
                  value={marketOverview.growthRate} 
                  onChange={(e) => setMarketOverview({...marketOverview, growthRate: e.target.value})}
                  className="text-xl font-bold"
                />
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Key Trends</div>
                <Textarea 
                  value={marketOverview.keyTrends} 
                  onChange={(e) => setMarketOverview({...marketOverview, keyTrends: e.target.value})}
                  className="text-sm"
                />
              </div>
            </div>
          )}
        </CardContent>
      </Card>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader>
            <CardTitle>Market Share</CardTitle>
            <CardDescription>Competitive landscape breakdown</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart
                  layout="vertical"
                  data={marketShareData}
                  margin={{ top: 20, right: 30, left: 40, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis type="number" domain={[0, 'dataMax']} tickFormatter={(value) => `${value}%`} />
                  <YAxis type="category" dataKey="name" />
                  <Tooltip formatter={(value) => [`${value}%`, 'Market Share']} />
                  <Legend />
                  <Bar dataKey="value" name="Market Share" radius={[0, 6, 6, 0]} />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader>
            <CardTitle>Sales Trend</CardTitle>
            <CardDescription>Historic and projected sales (in millions)</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="h-80">
              <ResponsiveContainer width="100%" height="100%">
                <LineChart
                  data={salesData}
                  margin={{ top: 20, right: 30, left: 20, bottom: 5 }}
                >
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip formatter={(value) => [`$${value}M`, 'Sales']} />
                  <Legend />
                  <Line type="monotone" dataKey="value" name="Sales" stroke="#10b981" strokeWidth={2} dot={{ r: 5 }} />
                </LineChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Competitor Comparison</CardTitle>
            <CardDescription>Analysis of key market players</CardDescription>
          </div>
          {!editingCompetitors ? (
            <Button 
              variant="ghost" 
              size="sm" 
              className="text-gray-500"
              onClick={() => setEditingCompetitors(true)}
            >
              <Edit className="h-4 w-4 mr-1" />
              Edit
            </Button>
          ) : (
            <div className="flex space-x-2">
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-red-500"
                onClick={handleCancelCompetitors}
              >
                <X className="h-4 w-4 mr-1" />
                Cancel
              </Button>
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-emerald-600"
                onClick={handleSaveCompetitors}
              >
                <Save className="h-4 w-4 mr-1" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-[180px]">Competitor</TableHead>
                <TableHead>Market Share</TableHead>
                <TableHead>Key Strengths</TableHead>
                <TableHead>Key Weaknesses</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {competitorData.map((competitor, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {editingCompetitors ? (
                      <Input 
                        value={competitor.name} 
                        onChange={(e) => {
                          const newData = [...competitorData];
                          newData[index].name = e.target.value;
                          setCompetitorData(newData);
                        }}
                      />
                    ) : (
                      competitor.name
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCompetitors ? (
                      <Input 
                        value={competitor.share} 
                        onChange={(e) => {
                          const newData = [...competitorData];
                          newData[index].share = e.target.value;
                          setCompetitorData(newData);
                        }}
                      />
                    ) : (
                      competitor.share
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCompetitors ? (
                      <Input 
                        value={competitor.strengths} 
                        onChange={(e) => {
                          const newData = [...competitorData];
                          newData[index].strengths = e.target.value;
                          setCompetitorData(newData);
                        }}
                      />
                    ) : (
                      competitor.strengths
                    )}
                  </TableCell>
                  <TableCell>
                    {editingCompetitors ? (
                      <Input 
                        value={competitor.weaknesses} 
                        onChange={(e) => {
                          const newData = [...competitorData];
                          newData[index].weaknesses = e.target.value;
                          setCompetitorData(newData);
                        }}
                      />
                    ) : (
                      competitor.weaknesses
                    )}
                  </TableCell>
                </TableRow>
              ))}
              {editingCompetitors && (
                <TableRow>
                  <TableCell colSpan={4} className="text-center">
                    <Button 
                      variant="outline" 
                      size="sm"
                      onClick={() => {
                        setCompetitorData([
                          ...competitorData, 
                          {
                            name: "New Competitor",
                            share: "5%",
                            strengths: "Enter strengths here",
                            weaknesses: "Enter weaknesses here"
                          }
                        ]);
                      }}
                    >
                      Add Competitor
                    </Button>
                  </TableCell>
                </TableRow>
              )}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
