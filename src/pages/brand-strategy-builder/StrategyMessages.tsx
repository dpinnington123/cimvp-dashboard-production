import { useState } from 'react';
import { Link } from 'react-router-dom';
import { useBrand } from '@/contexts/BrandContext';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { 
  ArrowLeft, 
  MessageSquare,
  Target,
  Megaphone,
  Lightbulb,
  CheckCircle,
  Edit,
  Save,
  Plus,
  X
} from 'lucide-react';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';

const StrategyMessages = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  const [isEditing, setIsEditing] = useState(false);

  // Strategic objectives
  const [objectives] = useState(brandData?.objectives || [
    {
      id: '1',
      title: 'Increase Market Share',
      description: 'Grow from 10% to 15% market share within 24 months',
      status: 'in-progress',
      timeline: 'Q4 2025',
      kpis: ['Monthly sales growth', 'New customer acquisition', 'Market penetration rate']
    },
    {
      id: '2',
      title: 'Build Brand Loyalty',
      description: 'Achieve 40% repeat purchase rate and 8.5+ NPS score',
      status: 'in-progress',
      timeline: 'Q2 2025',
      kpis: ['Customer retention rate', 'NPS score', 'Customer lifetime value']
    },
    {
      id: '3',
      title: 'Digital Transformation',
      description: 'Launch e-commerce platform and achieve 30% online sales',
      status: 'planned',
      timeline: 'Q3 2025',
      kpis: ['Online revenue', 'Digital traffic', 'Conversion rate']
    }
  ]);

  // Key messages
  const [messages] = useState(brandData?.messages || [
    {
      id: '1',
      audience: 'Eco-Conscious Consumers',
      message: 'Choose products that protect the planet without compromising on quality.',
      tone: 'Inspiring',
      channels: ['Social Media', 'Website', 'Email'],
      objective: 'Increase Market Share'
    },
    {
      id: '2',
      audience: 'Premium Families',
      message: 'Trust in products designed with your family\'s health and safety in mind.',
      tone: 'Reassuring',
      channels: ['Email', 'Retail', 'Direct Mail'],
      objective: 'Build Brand Loyalty'
    },
    {
      id: '3',
      audience: 'Health Professionals',
      message: 'Backed by science, recommended by experts, trusted by families.',
      tone: 'Professional',
      channels: ['LinkedIn', 'Trade Publications', 'Conferences'],
      objective: 'Build Brand Loyalty'
    }
  ]);

  // Strategic initiatives
  const [initiatives] = useState([
    {
      name: 'Sustainability Leadership',
      description: 'Position as the most sustainable brand in the category',
      status: 'active',
      impact: 'high'
    },
    {
      name: 'Digital-First Experience',
      description: 'Create seamless omnichannel customer experience',
      status: 'planning',
      impact: 'high'
    },
    {
      name: 'Community Building',
      description: 'Develop engaged customer community and advocacy program',
      status: 'active',
      impact: 'medium'
    }
  ]);

  const handleSave = () => {
    setIsEditing(false);
  };

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'bg-green-100 text-green-800';
      case 'in-progress': return 'bg-blue-100 text-blue-800';
      case 'planned': return 'bg-gray-100 text-gray-800';
      case 'active': return 'bg-blue-100 text-blue-800';
      case 'planning': return 'bg-orange-100 text-orange-800';
      default: return 'bg-gray-100 text-gray-800';
    }
  };

  const getImpactColor = (impact: string) => {
    switch (impact) {
      case 'high': return 'bg-red-100 text-red-800';
      case 'medium': return 'bg-yellow-100 text-yellow-800';
      case 'low': return 'bg-green-100 text-green-800';
      default: return 'bg-gray-100 text-gray-800';
    }
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
                <div className="bg-indigo-100 p-3 rounded-lg">
                  <MessageSquare className="h-8 w-8 text-indigo-600" />
                </div>
                Brand Strategy & Messages
              </h1>
              <p className="text-gray-600 mt-2">
                Define your long-term brand goals and strategic initiatives
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

        {/* Strategic Objectives */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Target className="h-5 w-5 text-indigo-600" />
            Strategic Objectives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {objectives.map((objective) => (
              <Card key={objective.id}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{objective.title}</CardTitle>
                    <Badge className={getStatusColor(objective.status)}>
                      {objective.status}
                    </Badge>
                  </div>
                  <CardDescription>{objective.description}</CardDescription>
                </CardHeader>
                <CardContent>
                  <div className="space-y-3">
                    <div className="flex items-center gap-2 text-sm text-gray-600">
                      <CheckCircle className="h-4 w-4" />
                      Timeline: {objective.timeline}
                    </div>
                    <div>
                      <p className="text-sm font-medium text-gray-700 mb-1">Key Metrics:</p>
                      <div className="flex flex-wrap gap-1">
                        {objective.kpis.map((kpi, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {kpi}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Key Messages */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Megaphone className="h-5 w-5 text-purple-600" />
            Key Brand Messages
          </h2>
          <div className="space-y-4">
            {messages.map((message) => (
              <Card key={message.id}>
                <CardContent className="pt-6">
                  <div className="grid grid-cols-1 md:grid-cols-12 gap-4 items-start">
                    <div className="md:col-span-3">
                      <p className="text-sm font-medium text-gray-700">Target Audience</p>
                      <p className="text-gray-900 font-medium">{message.audience}</p>
                    </div>
                    <div className="md:col-span-5">
                      <p className="text-sm font-medium text-gray-700 mb-1">Message</p>
                      <p className="text-gray-900 italic">"{message.message}"</p>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Tone</p>
                      <Badge variant="secondary">{message.tone}</Badge>
                    </div>
                    <div className="md:col-span-2">
                      <p className="text-sm font-medium text-gray-700 mb-1">Channels</p>
                      <div className="flex flex-wrap gap-1">
                        {message.channels.map((channel, index) => (
                          <Badge key={index} variant="outline" className="text-xs">
                            {channel}
                          </Badge>
                        ))}
                      </div>
                    </div>
                  </div>
                  {message.objective && (
                    <div className="mt-3 pt-3 border-t">
                      <p className="text-sm text-gray-600">
                        Supports: <span className="font-medium">{message.objective}</span>
                      </p>
                    </div>
                  )}
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Strategic Initiatives */}
        <div className="mb-8">
          <h2 className="text-xl font-semibold mb-4 flex items-center gap-2">
            <Lightbulb className="h-5 w-5 text-orange-600" />
            Strategic Initiatives
          </h2>
          <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
            {initiatives.map((initiative, index) => (
              <Card key={index}>
                <CardHeader>
                  <div className="flex justify-between items-start">
                    <CardTitle className="text-lg">{initiative.name}</CardTitle>
                    <div className="flex gap-2">
                      <Badge className={getStatusColor(initiative.status)}>
                        {initiative.status}
                      </Badge>
                      <Badge className={getImpactColor(initiative.impact)}>
                        {initiative.impact} impact
                      </Badge>
                    </div>
                  </div>
                </CardHeader>
                <CardContent>
                  <p className="text-gray-600">{initiative.description}</p>
                </CardContent>
              </Card>
            ))}
          </div>
        </div>

        {/* Success Metrics Summary */}
        <Card className="bg-indigo-50 border-indigo-200">
          <CardHeader>
            <CardTitle className="text-indigo-900">Success Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
              <div>
                <p className="text-sm text-indigo-700">Target Market Share</p>
                <p className="text-2xl font-bold text-indigo-900">15%</p>
              </div>
              <div>
                <p className="text-sm text-indigo-700">NPS Goal</p>
                <p className="text-2xl font-bold text-indigo-900">8.5+</p>
              </div>
              <div>
                <p className="text-sm text-indigo-700">Digital Revenue Target</p>
                <p className="text-2xl font-bold text-indigo-900">30%</p>
              </div>
              <div>
                <p className="text-sm text-indigo-700">Retention Rate Goal</p>
                <p className="text-2xl font-bold text-indigo-900">40%</p>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Action Buttons */}
        <div className="mt-8 flex justify-between">
          <Link to="/brand-strategy-builder/audiences">
            <Button variant="outline">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Audiences
            </Button>
          </Link>
          
          <Link to="/brand-strategy-builder/market-research">
            <Button>
              Next: Market Research
              <Target className="h-4 w-4 ml-2" />
            </Button>
          </Link>
        </div>
      </div>
    </div>
  );
};

export default StrategyMessages;