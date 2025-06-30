import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { 
  ArrowLeft, 
  Palette, 
  Target,
  ArrowRight,
  Sparkles,
  FileText
} from 'lucide-react';

const BrandProfileHub = () => {
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
          
          <div>
            <h1 className="text-3xl font-bold text-gray-900 flex items-center gap-3">
              <div className="bg-purple-100 p-3 rounded-lg">
                <Target className="h-8 w-8 text-purple-600" />
              </div>
              Brand Profile
            </h1>
            <p className="text-gray-600 mt-2">
              Choose a tool to define and document your brand
            </p>
          </div>
        </div>

        {/* Tool Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {/* Brand Style Guide Creator Card */}
          <Link to="/brand-strategy-builder/brand-profile/style-guide">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-br from-purple-100 to-pink-100 p-3 rounded-lg">
                    <Palette className="h-8 w-8 text-purple-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <CardTitle className="mt-4">Brand Style Guide Creator</CardTitle>
                <CardDescription>
                  Create a comprehensive visual identity guide
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4" />
                    <span>Define voice, tone, and personality</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Palette className="h-4 w-4" />
                    <span>Set color palettes and typography</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Document usage guidelines</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Perfect for creating consistent brand visuals and messaging
                  </p>
                </div>
              </CardContent>
            </Card>
          </Link>

          {/* Brand Profiler Creator Card */}
          <div className="relative">
            <Card className="hover:shadow-lg transition-shadow cursor-pointer h-full opacity-75">
              <CardHeader>
                <div className="flex items-center justify-between">
                  <div className="bg-gradient-to-br from-blue-100 to-green-100 p-3 rounded-lg">
                    <Target className="h-8 w-8 text-blue-600" />
                  </div>
                  <ArrowRight className="h-5 w-5 text-gray-400" />
                </div>
                <CardTitle className="mt-4">Brand Profiler Creator</CardTitle>
                <CardDescription>
                  Deep-dive into brand strategy and positioning
                </CardDescription>
              </CardHeader>
              <CardContent>
                <div className="space-y-2">
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Target className="h-4 w-4" />
                    <span>Market positioning analysis</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <Sparkles className="h-4 w-4" />
                    <span>Competitive differentiation</span>
                  </div>
                  <div className="flex items-center gap-2 text-sm text-gray-600">
                    <FileText className="h-4 w-4" />
                    <span>Strategic brand attributes</span>
                  </div>
                </div>
                <div className="mt-4 pt-4 border-t">
                  <p className="text-xs text-gray-500">
                    Advanced brand strategy and market positioning tools
                  </p>
                </div>
              </CardContent>
            </Card>
            
            {/* Coming Soon Badge */}
            <div className="absolute inset-0 bg-white/50 rounded-lg flex items-center justify-center">
              <div className="bg-gray-900 text-white px-4 py-2 rounded-lg shadow-lg">
                <p className="text-sm font-semibold">Coming Soon</p>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
};

export default BrandProfileHub;