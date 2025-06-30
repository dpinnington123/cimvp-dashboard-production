import { Link } from 'react-router-dom';
import { BrandStyleCreator } from '@/components/brand-profile-builder/brand-style-creator';
import { ArrowLeft } from 'lucide-react';

const BrandStyleGuide = () => {
  return (
    <div className="min-h-screen bg-gray-50">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Header with back button */}
        <div className="mb-8">
          <Link 
            to="/brand-strategy-builder/brand-profile" 
            className="inline-flex items-center text-gray-600 hover:text-gray-900 mb-4"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Brand Profile
          </Link>
        </div>

        {/* Brand Style Creator */}
        <BrandStyleCreator />
      </div>
    </div>
  );
};

export default BrandStyleGuide;