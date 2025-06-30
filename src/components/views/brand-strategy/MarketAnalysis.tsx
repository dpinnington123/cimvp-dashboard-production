import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit, Save, X, Plus, Trash2, Check, Pencil } from "lucide-react";
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
import { useUpdateBrandMarketAnalysis } from "@/hooks/useUpdateBrandMarketAnalysis";
import { 
  useAddBrandCompetitor,
  useUpdateBrandCompetitor,
  useDeleteBrandCompetitor
} from "@/hooks/useBrandCompetitorOperations";
import { brandService } from "@/services/brandService";
import { useToast } from "@/hooks/use-toast";
import type { BrandMarketAnalysis, BrandCompetitor, BrandData } from "@/types/brand";

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
const generateMarketShareData = (brandData: BrandData): MarketShareItem[] => {
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
  competitorData.forEach((competitor: { name: string; marketShare: string }, index: number) => {
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
const generateSalesData = (): SalesDataItem[] => {
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
  const { getBrandData, selectedBrand } = useBrand();
  const brandData = getBrandData();
  const { toast } = useToast();
  
  // Hooks for database updates
  const updateMarketAnalysis = useUpdateBrandMarketAnalysis();
  const addCompetitor = useAddBrandCompetitor();
  const updateCompetitor = useUpdateBrandCompetitor();
  const deleteCompetitor = useDeleteBrandCompetitor();
  
  // State for brand ID
  const [brandId, setBrandId] = useState<string | null>(null);
  
  // State for market share data
  const [marketShareData, setMarketShareData] = useState<MarketShareItem[]>([]);
  
  // State for sales data
  const [salesData, setSalesData] = useState<SalesDataItem[]>([]);
  
  // State for market data - initialized from brand data
  const [marketData, setMarketData] = useState<BrandMarketAnalysis>({
    market_size: brandData?.market_analysis?.market_size || brandData?.marketAnalysis?.marketSize || "",
    growth_rate: brandData?.market_analysis?.growth_rate || brandData?.marketAnalysis?.growthRate || "",
    analysis_year: new Date().getFullYear()
  });
  
  // State for key trends (will be stored as part of market_analysis)
  const [keyTrends, setKeyTrends] = useState("");
  
  // State for competitors
  const [competitors, setCompetitors] = useState<BrandCompetitor[]>([]);
  
  // State for editing competitor
  const [editingCompetitorId, setEditingCompetitorId] = useState<string | null>(null);
  const [editedCompetitor, setEditedCompetitor] = useState<BrandCompetitor | null>(null);
  
  // State for editing mode
  const [editingMarketOverview, setEditingMarketOverview] = useState(false);
  const [editingCompetitors, setEditingCompetitors] = useState(false);
  
  // Temporary states for editing
  const [tempMarketData, setTempMarketData] = useState<BrandMarketAnalysis>(marketData);
  const [tempKeyTrends, setTempKeyTrends] = useState(keyTrends);
  const [tempCompetitors, setTempCompetitors] = useState<BrandCompetitor[]>([]);
  
  // Fetch brand ID when selectedBrand changes
  useEffect(() => {
    const fetchBrandId = async () => {
      if (selectedBrand) {
        try {
          const id = await brandService.getBrandIdBySlug(selectedBrand);
          setBrandId(id);
        } catch (error) {
          console.error('Failed to fetch brand ID:', error);
          toast({
            title: 'Error',
            description: 'Failed to load brand information',
            variant: 'destructive',
          });
        }
      }
    };

    fetchBrandId();
  }, [selectedBrand, toast]);
  
  // Initialize data from brand data
  useEffect(() => {
    if (brandData) {
      // Generate market share data
      const newMarketShareData = generateMarketShareData(brandData);
      setMarketShareData(newMarketShareData);
      
      // Generate sales data
      const newSalesData = generateSalesData();
      setSalesData(newSalesData);
      
      // Initialize market data from raw JSONB
      let newMarketData: BrandMarketAnalysis;
      let newTrends: string;
      
      if (brandData.market_analysis) {
        newMarketData = {
          market_size: brandData.market_analysis.market_size || '',
          growth_rate: brandData.market_analysis.growth_rate || '',
          analysis_year: brandData.market_analysis.analysis_year || new Date().getFullYear()
        };
        // Extract key trends if stored in market_analysis
        newTrends = brandData.market_analysis.key_trends || "Increasing demand for sustainable products, shift to e-commerce, growing health consciousness.";
      } else if (brandData.marketAnalysis) {
        // Fallback to transformed data
        newMarketData = {
          market_size: brandData.marketAnalysis.marketSize || '',
          growth_rate: brandData.marketAnalysis.growthRate || '',
          analysis_year: new Date().getFullYear()
        };
        newTrends = "Increasing demand for sustainable products, shift to e-commerce, growing health consciousness.";
      } else {
        newMarketData = {
          market_size: '',
          growth_rate: '',
          analysis_year: new Date().getFullYear()
        };
        newTrends = "Increasing demand for sustainable products, shift to e-commerce, growing health consciousness.";
      }
      
      setMarketData(newMarketData);
      setTempMarketData(newMarketData);
      setKeyTrends(newTrends);
      setTempKeyTrends(newTrends);
      
      // Initialize competitors from raw data
      let newCompetitors: BrandCompetitor[] = [];
      
      if (brandData.competitors && brandData.competitors.length > 0) {
        newCompetitors = brandData.competitors.map((comp: BrandCompetitor, index) => ({
          id: comp.id || `comp-${index}`,
          name: comp.name,
          market_share: comp.market_share || '',
          strengths: comp.strengths || [],
          weaknesses: comp.weaknesses || [],
          order_index: comp.order_index ?? index
        }));
      } else if (brandData.marketAnalysis?.competitorAnalysis) {
        // Fallback to transformed data
        newCompetitors = brandData.marketAnalysis.competitorAnalysis.map((comp, index) => ({
          id: `comp-${index}`,
          name: comp.name,
          market_share: comp.marketShare,
          strengths: comp.strengths,
          weaknesses: comp.weaknesses,
          order_index: index
        }));
      }
      
      setCompetitors(newCompetitors);
      setTempCompetitors(newCompetitors);
    }
  }, [brandData]);
  
  // Handle save market overview
  const handleSaveMarketOverview = async () => {
    if (brandId) {
      try {
        // Save market data with key trends
        const updatedData = { ...tempMarketData, key_trends: tempKeyTrends };
        await updateMarketAnalysis.mutateAsync({ brandId, marketAnalysis: updatedData });
        
        // Update actual state on success
        setMarketData(tempMarketData);
        setKeyTrends(tempKeyTrends);
        setEditingMarketOverview(false);
      } catch (error) {
        console.error('Failed to save market overview:', error);
        toast({
          title: 'Error',
          description: 'Failed to save market overview',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Handle cancel market overview
  const handleCancelMarketOverview = () => {
    setTempMarketData(marketData);
    setTempKeyTrends(keyTrends);
    setEditingMarketOverview(false);
  };
  
  // Handle save competitors
  const handleSaveCompetitors = async () => {
    if (brandId) {
      try {
        // Use the safe batch update from brandService
        await brandService.safeUpdateCompetitors(brandId, tempCompetitors);
        
        // Update actual state on success
        setCompetitors(tempCompetitors);
        setEditingCompetitors(false);
        
        toast({
          title: 'Success',
          description: 'Competitors updated successfully',
        });
      } catch (error) {
        console.error('Failed to save competitors:', error);
        toast({
          title: 'Error',
          description: 'Failed to save competitors',
          variant: 'destructive',
        });
      }
    }
  };
  
  // Handle cancel competitors
  const handleCancelCompetitors = () => {
    setTempCompetitors(competitors);
    setEditingCompetitors(false);
  };
  
  // Handle competitor operations in edit mode
  const handleAddCompetitor = () => {
    const newCompetitor: BrandCompetitor = {
      id: `new-comp-${Date.now()}`,
      name: 'New Competitor',
      market_share: '0%',
      strengths: [],
      weaknesses: [],
      order_index: tempCompetitors.length
    };
    setTempCompetitors([...tempCompetitors, newCompetitor]);
  };
  
  const handleEditCompetitor = (competitor: BrandCompetitor) => {
    setEditingCompetitorId(competitor.id!);
    setEditedCompetitor({ ...competitor });
  };
  
  const handleSaveCompetitor = () => {
    if (editedCompetitor) {
      const updatedCompetitors = tempCompetitors.map(c => 
        c.id === editedCompetitor.id ? editedCompetitor : c
      );
      setTempCompetitors(updatedCompetitors);
      setEditingCompetitorId(null);
      setEditedCompetitor(null);
    }
  };
  
  const handleCancelEditCompetitor = () => {
    setEditingCompetitorId(null);
    setEditedCompetitor(null);
  };
  
  const handleDeleteCompetitor = (id: string) => {
    const updatedCompetitors = tempCompetitors.filter(c => c.id !== id);
    setTempCompetitors(updatedCompetitors);
  };
  
  const updateCompetitorField = (field: keyof BrandCompetitor, value: string | string[]) => {
    if (editedCompetitor) {
      setEditedCompetitor({
        ...editedCompetitor,
        [field]: value
      });
    }
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
                <div className="text-xl font-bold">{marketData.market_size || 'Not set'}</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
                <div className="text-xl font-bold">{marketData.growth_rate || 'Not set'}</div>
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Key Trends</div>
                <div className="text-sm">{keyTrends || 'Not set'}</div>
              </div>
            </div>
          ) : (
            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Market Size</div>
                <Input 
                  value={tempMarketData.market_size || ''} 
                  onChange={(e) => setTempMarketData({...tempMarketData, market_size: e.target.value})}
                  className="text-xl font-bold"
                  placeholder="$0B"
                />
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Growth Rate</div>
                <Input 
                  value={tempMarketData.growth_rate || ''} 
                  onChange={(e) => setTempMarketData({...tempMarketData, growth_rate: e.target.value})}
                  className="text-xl font-bold"
                  placeholder="0% CAGR"
                />
              </div>
              <div className="p-4 border rounded-md">
                <div className="text-sm text-gray-500 mb-1">Key Trends</div>
                <Textarea 
                  value={tempKeyTrends} 
                  onChange={(e) => setTempKeyTrends(e.target.value)}
                  className="text-sm min-h-[80px]"
                  placeholder="Enter key market trends..."
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
              onClick={() => {
                setEditingCompetitors(true);
                setTempCompetitors([...competitors]);
              }}
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
          {editingCompetitors && (
            <div className="mb-4">
              <Button
                onClick={handleAddCompetitor}
                size="sm"
                className="bg-emerald-600 hover:bg-emerald-700"
              >
                <Plus className="h-4 w-4 mr-2" />
                Add Competitor
              </Button>
            </div>
          )}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {(editingCompetitors ? tempCompetitors : competitors).map((competitor) => (
              <Card key={competitor.id} className="relative">
                <CardHeader className="pb-3">
                  <div className="flex justify-between items-start">
                    <div className="flex-1">
                      {editingCompetitors && editingCompetitorId === competitor.id ? (
                        <Input
                          value={editedCompetitor?.name || ''}
                          onChange={(e) => updateCompetitorField('name', e.target.value)}
                          placeholder="Competitor name"
                          className="font-semibold mb-2"
                        />
                      ) : (
                        <CardTitle className="text-lg">{competitor.name}</CardTitle>
                      )}
                      
                      {editingCompetitors && editingCompetitorId === competitor.id ? (
                        <Input
                          value={editedCompetitor?.market_share || ''}
                          onChange={(e) => updateCompetitorField('market_share', e.target.value)}
                          placeholder="Market share"
                          className="text-sm"
                        />
                      ) : (
                        <CardDescription>Market Share: {competitor.market_share}</CardDescription>
                      )}
                    </div>
                    
                    {editingCompetitors && (
                      <div className="flex gap-1">
                        {editingCompetitorId === competitor.id ? (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleCancelEditCompetitor}
                              className="h-8 w-8 p-0"
                            >
                              <X className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={handleSaveCompetitor}
                              className="h-8 w-8 p-0 text-emerald-600"
                            >
                              <Check className="h-4 w-4" />
                            </Button>
                          </>
                        ) : (
                          <>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleEditCompetitor(competitor)}
                              className="h-8 w-8 p-0"
                            >
                              <Pencil className="h-4 w-4" />
                            </Button>
                            <Button
                              size="sm"
                              variant="ghost"
                              onClick={() => handleDeleteCompetitor(competitor.id!)}
                              className="h-8 w-8 p-0 text-red-500 hover:text-red-700"
                            >
                              <Trash2 className="h-4 w-4" />
                            </Button>
                          </>
                        )}
                      </div>
                    )}
                  </div>
                </CardHeader>
                <CardContent className="pt-0">
                  <div className="space-y-3">
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Strengths</p>
                      {editingCompetitors && editingCompetitorId === competitor.id ? (
                        <Textarea
                          value={(editedCompetitor?.strengths || []).join(', ')}
                          onChange={(e) => updateCompetitorField('strengths', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          placeholder="Enter strengths separated by commas"
                          rows={2}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {(competitor.strengths || []).join(', ') || 'No strengths listed'}
                        </p>
                      )}
                    </div>
                    
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Weaknesses</p>
                      {editingCompetitors && editingCompetitorId === competitor.id ? (
                        <Textarea
                          value={(editedCompetitor?.weaknesses || []).join(', ')}
                          onChange={(e) => updateCompetitorField('weaknesses', e.target.value.split(',').map(s => s.trim()).filter(s => s))}
                          placeholder="Enter weaknesses separated by commas"
                          rows={2}
                          className="text-sm"
                        />
                      ) : (
                        <p className="text-sm text-gray-600">
                          {(competitor.weaknesses || []).join(', ') || 'No weaknesses listed'}
                        </p>
                      )}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  );
};

export default MarketAnalysis;
