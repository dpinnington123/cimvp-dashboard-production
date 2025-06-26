import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { Progress } from '@/components/ui/progress';
import { 
  ArrowLeft, 
  Users, 
  User,
  Target,
  TrendingUp,
  ShoppingCart,
  Heart,
  Brain,
  Edit,
  Save,
  Plus,
  ChevronRight
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';

const Audiences = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  const [isEditing, setIsEditing] = useState(false);
  const [activeTab, setActiveTab] = useState<'segments' | 'personas' | 'journey'>('segments');

  // Customer segments
  const [segments] = useState(brandData?.customerAnalysis?.segments || [
    {
      name: 'Eco-Conscious Millennials',
      size: '35%',
      description: 'Young professionals prioritizing sustainability',
      needs: ['Eco-friendly products', 'Transparent sourcing', 'Modern design'],
      painPoints: ['High prices', 'Limited availability', 'Greenwashing concerns']
    },
    {
      name: 'Premium Families',
      size: '30%',
      description: 'Families seeking quality and safety',
      needs: ['Safe materials', 'Durability', 'Family-sized options'],
      painPoints: ['Cost per unit', 'Storage space', 'Kid-friendly designs']
    },
    {
      name: 'Health-Focused Professionals',
      size: '25%',
      description: 'Individuals prioritizing wellness and health',
      needs: ['Natural ingredients', 'Performance benefits', 'Convenience'],
      painPoints: ['Time constraints', 'Product effectiveness', 'Price justification']
    }
  ]);

  // Personas
  const [personas] = useState(brandData?.personas || [
    {
      name: 'Sarah the Sustainable',
      age: '28-35',
      occupation: 'Marketing Manager',
      icon: '👩‍💼',
      description: 'Urban professional who values sustainability and quality',
      goals: ['Reduce environmental impact', 'Support ethical brands', 'Maintain professional image'],
      frustrations: ['Greenwashing', 'Limited eco options', 'Premium pricing'],
      preferredChannels: ['Instagram', 'Email', 'Brand websites']
    },
    {
      name: 'Family-First Frank',
      age: '35-45',
      occupation: 'IT Director',
      icon: '👨‍👩‍👧‍👦',
      description: 'Parent focused on family health and safety',
      goals: ['Keep family healthy', 'Find reliable products', 'Simplify shopping'],
      frustrations: ['Conflicting information', 'Time pressure', 'Budget constraints'],
      preferredChannels: ['Amazon', 'Facebook', 'Review sites']
    }
  ]);

  // Customer journey stages
  const [journeyStages] = useState([
    {
      stage: 'Awareness',
      touchpoints: ['Social media ads', 'Word of mouth', 'Search results'],
      opportunities: ['Influencer partnerships', 'SEO optimization', 'Content marketing'],
      completion: 85
    },
    {
      stage: 'Consideration',
      touchpoints: ['Website visits', 'Reviews', 'Comparison shopping'],
      opportunities: ['Better product information', 'Customer testimonials', 'Live chat'],
      completion: 60
    },
    {
      stage: 'Purchase',
      touchpoints: ['Online store', 'Retail partners', 'Mobile app'],
      opportunities: ['Streamlined checkout', 'Multiple payment options', 'Guest checkout'],
      completion: 45
    },
    {
      stage: 'Retention',
      touchpoints: ['Email marketing', 'Loyalty program', 'Customer service'],
      opportunities: ['Personalized offers', 'Subscription service', 'Community building'],
      completion: 70
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
  };

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
                <div className="bg-green-100 p-3 rounded-lg">
                  <Users className="h-8 w-8 text-green-600" />
                </div>
                Audiences
              </h1>
              <p className="text-gray-600 mt-2">
                Customer Segments, Personas, and Behavioral Scenarios
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

        {/* Tab Navigation */}
        <div className="flex space-x-1 mb-8 bg-gray-100 p-1 rounded-lg w-fit">
          <button
            onClick={() => setActiveTab('segments')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'segments' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Customer Segments
          </button>
          <button
            onClick={() => setActiveTab('personas')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'personas' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Personas
          </button>
          <button
            onClick={() => setActiveTab('journey')}
            className={`px-4 py-2 rounded-md transition-colors ${
              activeTab === 'journey' 
                ? 'bg-white text-gray-900 shadow-sm' 
                : 'text-gray-600 hover:text-gray-900'
            }`}
          >
            Customer Journey
          </button>
        </div>

        {/* Customer Segments Tab */}
        {activeTab === 'segments' && (
          <div className="space-y-6">
            {segments.map((segment, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <div>
                      <CardTitle className="flex items-center gap-2">
                        <User className="h-5 w-5 text-green-600" />
                        {segment.name}
                      </CardTitle>
                      <CardDescription>{segment.description}</CardDescription>
                    </div>
                    <Badge className="bg-green-100 text-green-800 text-lg px-3 py-1">
                      {segment.size}
                    </Badge>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Heart className="h-4 w-4 text-red-500" />
                        Key Needs
                      </h4>
                      <ul className="space-y-2">
                        {segment.needs.map((need, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-600">{need}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3 flex items-center gap-2">
                        <Brain className="h-4 w-4 text-purple-500" />
                        Pain Points
                      </h4>
                      <ul className="space-y-2">
                        {segment.painPoints.map((pain, i) => (
                          <li key={i} className="flex items-start gap-2">
                            <ChevronRight className="h-4 w-4 text-gray-400 mt-0.5" />
                            <span className="text-gray-600">{pain}</span>
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Personas Tab */}
        {activeTab === 'personas' && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {personas.map((persona, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex items-start gap-4">
                    <div className="text-4xl">{persona.icon}</div>
                    <div>
                      <CardTitle>{persona.name}</CardTitle>
                      <CardDescription>
                        {persona.age} • {persona.occupation}
                      </CardDescription>
                    </div>
                  </div>
                </CardHeader>
                <CardContent className="space-y-4">
                  <p className="text-gray-600">{persona.description}</p>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Goals</h4>
                    <ul className="space-y-1">
                      {persona.goals.map((goal, i) => (
                        <li key={i} className="text-sm text-gray-600">• {goal}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Frustrations</h4>
                    <ul className="space-y-1">
                      {persona.frustrations.map((frustration, i) => (
                        <li key={i} className="text-sm text-gray-600">• {frustration}</li>
                      ))}
                    </ul>
                  </div>
                  
                  <div>
                    <h4 className="font-medium text-gray-700 mb-2">Preferred Channels</h4>
                    <div className="flex flex-wrap gap-2">
                      {persona.preferredChannels.map((channel, i) => (
                        <Badge key={i} variant="secondary">{channel}</Badge>
                      ))}
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Customer Journey Tab */}
        {activeTab === 'journey' && (
          <div className="space-y-6">
            {journeyStages.map((stage, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-center">
                    <CardTitle className="flex items-center gap-2">
                      <ShoppingCart className="h-5 w-5 text-blue-600" />
                      {stage.stage}
                    </CardTitle>
                    <div className="flex items-center gap-2">
                      <span className="text-sm text-gray-600">{stage.completion}%</span>
                      <Progress value={stage.completion} className="w-24 h-2" />
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Current Touchpoints</h4>
                      <div className="flex flex-wrap gap-2">
                        {stage.touchpoints.map((touchpoint, i) => (
                          <Badge key={i} variant="outline">{touchpoint}</Badge>
                        ))}
                      </div>
                    </div>
                    <div>
                      <h4 className="font-medium text-gray-700 mb-3">Opportunities</h4>
                      <ul className="space-y-1">
                        {stage.opportunities.map((opportunity, i) => (
                          <li key={i} className="text-sm text-gray-600 flex items-start gap-2">
                            <TrendingUp className="h-3 w-3 text-green-500 mt-0.5" />
                            {opportunity}
                          </li>
                        ))}
                      </ul>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        )}

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link to="/brand-strategy-builder/brand-profile">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Brand Profile
            </Button>
          </Link>
          
          <Link to="/brand-strategy-builder/strategy-messages">
            <Button>
              Next: Strategy & Messages
              <Target className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default Audiences;