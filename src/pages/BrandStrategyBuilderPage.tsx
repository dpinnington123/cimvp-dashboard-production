import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card } from '@/components/ui/card';
import { 
  TrendingUp, 
  Target, 
  Users, 
  MessageSquare, 
  BarChart3, 
  FileText 
} from 'lucide-react';

// Type for strategy section cards
interface StrategySection {
  id: string;
  title: string;
  description: string;
  icon: React.ComponentType<{ className?: string }>;
  color: string;
  bgColor: string;
  link: string;
}

const BrandStrategyBuilderPage = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();

  // Define the 6 strategy sections matching the design
  const strategySections: StrategySection[] = [
    {
      id: 'market-overview',
      title: 'Market Overview',
      description: 'Analyze current market trends, size, and competitive landscape.',
      icon: TrendingUp,
      color: 'text-blue-600',
      bgColor: 'bg-blue-50',
      link: '/brand-strategy-builder/market-overview'
    },
    {
      id: 'brand-profile',
      title: 'Brand Profile',
      description: 'Review your brand identity, values, positioning, and voice.',
      icon: Target,
      color: 'text-purple-600',
      bgColor: 'bg-purple-50',
      link: '/brand-strategy-builder/brand-profile'
    },
    {
      id: 'audiences',
      title: 'Audiences',
      description: 'Customer Segments, Personas, Behavioral Scenarios /Funnels',
      icon: Users,
      color: 'text-green-600',
      bgColor: 'bg-green-50',
      link: '/brand-strategy-builder/audiences'
    },
    {
      id: 'brand-strategy-messages',
      title: 'Brand Strategy & Messages',
      description: 'Define your long-term brand goals and strategic initiatives.',
      icon: MessageSquare,
      color: 'text-indigo-600',
      bgColor: 'bg-indigo-50',
      link: '/brand-strategy-builder/strategy-messages'
    },
    {
      id: 'market-research',
      title: 'Market Research',
      description: 'Access insights from customer surveys and market analysis.',
      icon: BarChart3,
      color: 'text-orange-600',
      bgColor: 'bg-orange-50',
      link: '/brand-strategy-builder/market-research'
    },
    {
      id: 'strategy-document',
      title: 'Strategy Document',
      description: 'View and download your complete marketing strategy.',
      icon: FileText,
      color: 'text-teal-600',
      bgColor: 'bg-teal-50',
      link: '/brand-strategy-builder/strategy-document'
    }
  ];

  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header Section */}
        <div className="text-center mb-12">
          <h1 className="text-4xl font-bold text-gray-900 mb-4">
            Welcome to your <span className="text-purple-600">Marketing Strategy</span>!
          </h1>
          <p className="text-lg text-gray-600">
            What aspect of your marketing strategy would you like to explore today?
          </p>
        </div>

        {/* Strategy Cards Grid */}
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          {strategySections.map((section) => {
            const Icon = section.icon;
            
            return (
              <Link 
                key={section.id} 
                to={section.link}
                className="block transition-transform hover:scale-105"
              >
                <Card className="h-full p-6 hover:shadow-lg transition-shadow cursor-pointer">
                  <div className="flex flex-col items-center text-center space-y-4">
                    {/* Icon Container */}
                    <div className={`${section.bgColor} p-4 rounded-lg`}>
                      <Icon className={`h-8 w-8 ${section.color}`} />
                    </div>
                    
                    {/* Title */}
                    <h3 className="text-xl font-semibold text-gray-900">
                      {section.title}
                    </h3>
                    
                    {/* Description */}
                    <p className="text-gray-600 text-sm">
                      {section.description}
                    </p>
                  </div>
                </Card>
              </Link>
            );
          })}
        </div>

        {/* Optional: Brand Name Display */}
        {brandData && (
          <div className="mt-12 text-center">
            <p className="text-sm text-gray-500">
              Currently viewing strategy for: <span className="font-medium text-gray-700">{brandData.profile.name}</span>
            </p>
          </div>
        )}
      </div>
    </div>
  );
};

export default BrandStrategyBuilderPage;