import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  BarChart3,
  FileText,
  Users,
  TrendingUp,
  MessageSquare
} from 'lucide-react';

const MarketResearch = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header */}
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
                <div className="bg-orange-100 p-3 rounded-lg">
                  <BarChart3 className="h-8 w-8 text-orange-600" />
                </div>
                Market Research
              </h1>
              <p className="text-gray-600 mt-2">
                Access insights from customer surveys and market analysis
              </p>
            </div>
          </div>
        </div>

        {/* Research Content Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Research Insights</CardTitle>
            <CardDescription>
              Customer surveys, market analysis, and competitive intelligence
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <BarChart3 className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Market research content will be displayed here</p>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link to="/brand-strategy-builder/strategy-messages">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Strategy & Messages
            </Button>
          </Link>
          
          <Link to="/brand-strategy-builder/strategy-document">
            <Button>
              Next: Strategy Document
              <FileText className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default MarketResearch;