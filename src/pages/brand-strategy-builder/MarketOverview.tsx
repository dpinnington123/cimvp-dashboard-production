import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  TrendingUp, 
  Users, 
  Building2, 
  Target,
  BarChart3,
  DollarSign,
  Percent,
  Edit,
  Save
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const MarketOverview = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  const [isEditing, setIsEditing] = useState(false);

  // Market data state
  const [marketData, setMarketData] = useState({
    marketSize: brandData?.marketAnalysis?.marketSize || '$50B',
    growthRate: brandData?.marketAnalysis?.growthRate || '8%',
    targetMarket: brandData?.profile?.businessArea || 'Sustainable Consumer Products',
    keyTrends: [
      'Increasing consumer demand for eco-friendly products',
      'Digital transformation in retail channels',
      'Growing importance of brand authenticity',
      'Shift towards subscription-based models'
    ]
  });

  // Competitor data
  const competitors = brandData?.marketAnalysis?.competitorAnalysis || [
    { name: 'Competitor A', marketShare: '25%', strength: 'Brand Recognition' },
    { name: 'Competitor B', marketShare: '20%', strength: 'Distribution Network' },
    { name: 'Competitor C', marketShare: '15%', strength: 'Product Innovation' },
    { name: brandData?.profile?.name || 'Your Brand', marketShare: '10%', strength: 'Customer Loyalty' }
  ];

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link 
            to="/brand-strategy-builder" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Strategy Builder
          </Link>
          
          <div className="flex justify-between items-start">
            <div>
              <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
                <div className="bg-blue-100 p-3 rounded-lg">
                  <TrendingUp className="h-8 w-8 text-blue-600" />
                </div>
                Market Overview
              </h1>
              <p className="text-gray-600 mt-2">
                Analyze current market trends, size, and competitive landscape for {brandData?.profile?.name}
              </p>
            </div>
            
            <Button
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
              variant={isEditing ? "default" : "outline"}
            >
              {isEditing ? (
                <>
                  <Save className="h-4 w-4 mr-2" />
                  Save Changes
                </>
              ) : (
                <>
                  <Edit className="h-4 w-4 mr-2" />
                  Edit
                </>
              )}
            </Button>
          </div>
        </div>

        {/* Market Size and Growth */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <DollarSign className="h-5 w-5 text-green-600" />
                Market Size
              </CardTitle>
              <CardDescription>Total addressable market value</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Input
                  value={marketData.marketSize}
                  onChange={(e) => setMarketData({...marketData, marketSize: e.target.value})}
                  className="text-3xl font-bold"
                />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{marketData.marketSize}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">Annual market value</p>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Percent className="h-5 w-5 text-blue-600" />
                Growth Rate
              </CardTitle>
              <CardDescription>Year-over-year market growth</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Input
                  value={marketData.growthRate}
                  onChange={(e) => setMarketData({...marketData, growthRate: e.target.value})}
                  className="text-3xl font-bold"
                />
              ) : (
                <p className="text-3xl font-bold text-gray-900">{marketData.growthRate}</p>
              )}
              <p className="text-sm text-gray-500 mt-2">Annual growth rate</p>
            </CardContent>
          </Card>
        </div>

        {/* Market Trends */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <TrendingUp className="h-5 w-5 text-purple-600" />
              Key Market Trends
            </CardTitle>
            <CardDescription>Important trends shaping the {marketData.targetMarket} market</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-3">
              {marketData.keyTrends.map((trend, index) => (
                <div key={index} className="flex items-start gap-3">
                  <div className="bg-purple-100 rounded-full p-1 mt-0.5">
                    <Target className="h-4 w-4 text-purple-600" />
                  </div>
                  {isEditing ? (
                    <Input
                      value={trend}
                      onChange={(e) => {
                        const newTrends = [...marketData.keyTrends];
                        newTrends[index] = e.target.value;
                        setMarketData({...marketData, keyTrends: newTrends});
                      }}
                      className="flex-1"
                    />
                  ) : (
                    <p className="text-gray-700">{trend}</p>
                  )}
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        {/* Competitive Landscape */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Building2 className="h-5 w-5 text-orange-600" />
              Competitive Landscape
            </CardTitle>
            <CardDescription>Market share distribution and key competitors</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="space-y-4">
              {competitors.map((competitor, index) => (
                <div key={index} className="space-y-2">
                  <div className="flex justify-between items-center">
                    <div className="flex items-center gap-2">
                      <Building2 className={`h-4 w-4 ${competitor.name === brandData?.profile?.name ? 'text-blue-600' : 'text-gray-400'}`} />
                      <span className={`font-medium ${competitor.name === brandData?.profile?.name ? 'text-blue-600' : 'text-gray-700'}`}>
                        {competitor.name}
                      </span>
                    </div>
                    <span className="text-sm font-medium text-gray-600">{competitor.marketShare}</span>
                  </div>
                  <Progress 
                    value={parseInt(competitor.marketShare)} 
                    className="h-2"
                  />
                  <p className="text-sm text-gray-500">Key Strength: {competitor.strength}</p>
                </div>
              ))}
            </div>

            {/* Market Position Summary */}
            <div className="mt-6 p-4 bg-blue-50 rounded-lg">
              <p className="text-sm font-medium text-blue-900">Your Market Position</p>
              <p className="text-sm text-blue-700 mt-1">
                {brandData?.profile?.name} currently holds {competitors.find(c => c.name === brandData?.profile?.name)?.marketShare || '10%'} market share 
                with strong customer loyalty as a key differentiator.
              </p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link to="/brand-strategy-builder">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Overview
            </Button>
          </Link>
          
          <Link to="/brand-strategy-builder/brand-profile">
            <Button>
              Next: Brand Profile
              <TrendingUp className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketOverview;