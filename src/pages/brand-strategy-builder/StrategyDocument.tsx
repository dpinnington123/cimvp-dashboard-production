import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { 
  ArrowLeft, 
  FileText,
  Download,
  Eye,
  Share2,
  Printer
} from 'lucide-react';

const StrategyDocument = () => {
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
                <div className="bg-teal-100 p-3 rounded-lg">
                  <FileText className="h-8 w-8 text-teal-600" />
                </div>
                Strategy Document
              </h1>
              <p className="text-gray-600 mt-2">
                View and download your complete marketing strategy
              </p>
            </div>
            
            <div className="flex gap-2">
              <Button variant="outline">
                <Eye className="h-4 w-4 mr-2" />
                Preview
              </Button>
              <Button>
                <Download className="h-4 w-4 mr-2" />
                Download PDF
              </Button>
            </div>
          </div>
        </div>

        {/* Document Content Placeholder */}
        <Card>
          <CardHeader>
            <CardTitle>Marketing Strategy Document</CardTitle>
            <CardDescription>
              Complete strategy overview for {brandData?.profile?.name}
            </CardDescription>
          </CardHeader>
          <CardContent>
            <div className="text-center py-12">
              <FileText className="h-16 w-16 text-gray-300 mx-auto mb-4" />
              <p className="text-gray-500">Strategy document preview will be displayed here</p>
              <div className="mt-6 flex justify-center gap-4">
                <Button variant="outline">
                  <Share2 className="h-4 w-4 mr-2" />
                  Share
                </Button>
                <Button variant="outline">
                  <Printer className="h-4 w-4 mr-2" />
                  Print
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link to="/brand-strategy-builder/market-research">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Market Research
            </Button>
          </Link>
          
          <Link to="/brand-strategy-builder">
            <Button>
              Back to Overview
              <FileText className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrategyDocument;