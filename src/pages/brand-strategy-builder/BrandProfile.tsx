import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  Target, 
  Sparkles,
  Heart,
  Shield,
  Award,
  Edit,
  Save,
  Plus,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const BrandProfile = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  const [isEditing, setIsEditing] = useState(false);

  // Brand identity state
  const [brandIdentity, setBrandIdentity] = useState({
    name: brandData?.profile?.name || 'Your Brand',
    tagline: 'Innovation for a sustainable future',
    mission: 'To create products that enhance daily life while protecting our planet for future generations.',
    vision: 'A world where sustainable living is the standard, not the exception.',
    values: brandData?.voice || [
      { title: 'Sustainability', description: 'Environmental responsibility in every decision' },
      { title: 'Innovation', description: 'Continuous improvement and creative solutions' },
      { title: 'Transparency', description: 'Open and honest communication with all stakeholders' },
      { title: 'Quality', description: 'Excellence in every product and interaction' }
    ],
    positioning: 'Premium sustainable products for conscious consumers who refuse to compromise on quality or their values.'
  });

  const handleSave = () => {
    // Save logic would go here
    setIsEditing(false);
  };

  const addValue = () => {
    setBrandIdentity({
      ...brandIdentity,
      values: [...brandIdentity.values, { title: '', description: '' }]
    });
  };

  const removeValue = (index: number) => {
    setBrandIdentity({
      ...brandIdentity,
      values: brandIdentity.values.filter((_, i) => i !== index)
    });
  };

  const updateValue = (index: number, field: 'title' | 'description', value: string) => {
    const newValues = [...brandIdentity.values];
    newValues[index] = { ...newValues[index], [field]: value };
    setBrandIdentity({ ...brandIdentity, values: newValues });
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
                <div className="bg-purple-100 p-3 rounded-lg">
                  <Target className="h-8 w-8 text-purple-600" />
                </div>
                Brand Profile
              </h1>
              <p className="text-gray-600 mt-2">
                Define your brand identity, values, positioning, and voice
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

        {/* Brand Identity Card */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Sparkles className="h-5 w-5 text-purple-600" />
              Brand Identity
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div>
              <label className="text-sm font-medium text-gray-700">Brand Name</label>
              {isEditing ? (
                <Input
                  value={brandIdentity.name}
                  onChange={(e) => setBrandIdentity({...brandIdentity, name: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <p className="text-lg font-semibold text-gray-900 mt-1">{brandIdentity.name}</p>
              )}
            </div>

            <div>
              <label className="text-sm font-medium text-gray-700">Tagline</label>
              {isEditing ? (
                <Input
                  value={brandIdentity.tagline}
                  onChange={(e) => setBrandIdentity({...brandIdentity, tagline: e.target.value})}
                  className="mt-1"
                />
              ) : (
                <p className="text-gray-600 italic mt-1">"{brandIdentity.tagline}"</p>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Mission & Vision */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6 mb-8">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Heart className="h-5 w-5 text-red-600" />
                Mission
              </CardTitle>
              <CardDescription>Why we exist</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={brandIdentity.mission}
                  onChange={(e) => setBrandIdentity({...brandIdentity, mission: e.target.value})}
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{brandIdentity.mission}</p>
              )}
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <Shield className="h-5 w-5 text-blue-600" />
                Vision
              </CardTitle>
              <CardDescription>Where we're going</CardDescription>
            </CardHeader>
            <CardContent>
              {isEditing ? (
                <Textarea
                  value={brandIdentity.vision}
                  onChange={(e) => setBrandIdentity({...brandIdentity, vision: e.target.value})}
                  rows={4}
                />
              ) : (
                <p className="text-gray-700">{brandIdentity.vision}</p>
              )}
            </CardContent>
          </Card>
        </div>

        {/* Core Values */}
        <Card className="mb-8">
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Award className="h-5 w-5 text-green-600" />
              Core Values
            </CardTitle>
            <CardDescription>The principles that guide everything we do</CardDescription>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              {brandIdentity.values.map((value, index) => (
                <div key={index} className="border rounded-lg p-4 relative">
                  {isEditing && (
                    <Button
                      variant="ghost"
                      size="sm"
                      className="absolute top-2 right-2"
                      onClick={() => removeValue(index)}
                    >
                      <X className="h-4 w-4" />
                    </Button>
                  )}
                  
                  {isEditing ? (
                    <div className="space-y-2">
                      <Input
                        value={value.title}
                        onChange={(e) => updateValue(index, 'title', e.target.value)}
                        placeholder="Value title"
                        className="font-semibold"
                      />
                      <Textarea
                        value={value.description}
                        onChange={(e) => updateValue(index, 'description', e.target.value)}
                        placeholder="Value description"
                        rows={2}
                      />
                    </div>
                  ) : (
                    <>
                      <h4 className="font-semibold text-gray-900 mb-1">{value.title}</h4>
                      <p className="text-sm text-gray-600">{value.description}</p>
                    </>
                  )}
                </div>
              ))}
              
              {isEditing && (
                <button
                  onClick={addValue}
                  className="border-2 border-dashed border-gray-300 rounded-lg p-4 hover:border-gray-400 transition-colors flex items-center justify-center gap-2 text-gray-500 hover:text-gray-700"
                >
                  <Plus className="h-5 w-5" />
                  Add Value
                </button>
              )}
            </div>
          </CardContent>
        </Card>

        {/* Brand Positioning */}
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center gap-2">
              <Target className="h-5 w-5 text-orange-600" />
              Brand Positioning
            </CardTitle>
            <CardDescription>How we differentiate in the market</CardDescription>
          </CardHeader>
          <CardContent>
            {isEditing ? (
              <Textarea
                value={brandIdentity.positioning}
                onChange={(e) => setBrandIdentity({...brandIdentity, positioning: e.target.value})}
                rows={3}
              />
            ) : (
              <p className="text-gray-700">{brandIdentity.positioning}</p>
            )}
            
            {/* Positioning Pillars */}
            <div className="mt-6 flex flex-wrap gap-2">
              <Badge className="bg-purple-100 text-purple-800">Premium Quality</Badge>
              <Badge className="bg-green-100 text-green-800">Sustainable</Badge>
              <Badge className="bg-blue-100 text-blue-800">Innovative</Badge>
              <Badge className="bg-orange-100 text-orange-800">Customer-Centric</Badge>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link to="/brand-strategy-builder/market-overview">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Market Overview
            </Button>
          </Link>
          
          <Link to="/brand-strategy-builder/audiences">
            <Button>
              Next: Audiences
              <Target className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default BrandProfile;