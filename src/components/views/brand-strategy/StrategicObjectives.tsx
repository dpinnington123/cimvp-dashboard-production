
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Edit, User, Users, Globe } from "lucide-react";

const StrategicObjectives = () => {
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Strategic Objectives</h2>
        <p className="text-gray-600">Our key goals and how we'll measure success</p>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
        <Card>
          <CardHeader className="relative pb-2">
            <div className="absolute top-4 right-4">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
            <CardTitle className="text-lg">Strategic Objective 1</CardTitle>
            <CardDescription className="text-base font-medium text-gray-900">Increase Market Share</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Expand our presence in key markets and capture market share from competitors
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Audience</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  New customers in target metropolitan areas with high disposable income
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Customer Behavioral Scenario</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Potential customers aware of the brand but have not made a purchase yet
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Behavioral Change</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  From competitor loyalty to trial of our products based on sustainability value proposition
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Performance Indicators</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Market Share Growth</span>
                      <span className="text-gray-900">24% / 30%</span>
                    </div>
                    <div className="relative">
                      <Progress value={80} className="h-2" />
                      <span className="absolute right-0 -top-6 text-xs text-gray-500">Progress: 80%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">New Customer Acquisition</span>
                      <span className="text-gray-900">15K / 25K</span>
                    </div>
                    <div className="relative">
                      <Progress value={60} className="h-2" />
                      <span className="absolute right-0 -top-6 text-xs text-gray-500">Progress: 60%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-between text-sm">
                <div>
                  <span className="text-gray-600 block">Timeline</span>
                  <span className="text-gray-900">Q2-Q4 2025</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Owner</span>
                  <span className="text-gray-900">Marketing Director</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="relative pb-2">
            <div className="absolute top-4 right-4">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
            <CardTitle className="text-lg">Strategic Objective 2</CardTitle>
            <CardDescription className="text-base font-medium text-gray-900">Enhance Brand Loyalty</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Strengthen relationships with existing customers to improve retention and lifetime value
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Audience</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Existing customers who have made at least one purchase in the last 12 months
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Customer Behavioral Scenario</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Customers who have purchased once or twice but haven't become regular buyers
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Behavioral Change</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  From occasional purchaser to brand advocate through improved customer experience
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Performance Indicators</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Customer Retention Rate</span>
                      <span className="text-gray-900">78% / 85%</span>
                    </div>
                    <div className="relative">
                      <Progress value={92} className="h-2" />
                      <span className="absolute right-0 -top-6 text-xs text-gray-500">Progress: 92%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Repeat Purchase Rate</span>
                      <span className="text-gray-900">45% / 60%</span>
                    </div>
                    <div className="relative">
                      <Progress value={75} className="h-2" />
                      <span className="absolute right-0 -top-6 text-xs text-gray-500">Progress: 75%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-between text-sm">
                <div>
                  <span className="text-gray-600 block">Timeline</span>
                  <span className="text-gray-900">Ongoing through 2025</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Owner</span>
                  <span className="text-gray-900">Customer Experience Manager</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
        
        <Card>
          <CardHeader className="relative pb-2">
            <div className="absolute top-4 right-4">
              <Button size="sm" variant="ghost" className="h-8 w-8 p-0">
                <Edit className="h-4 w-4" />
                <span className="sr-only">Edit</span>
              </Button>
            </div>
            <CardTitle className="text-lg">Strategic Objective 3</CardTitle>
            <CardDescription className="text-base font-medium text-gray-900">Drive Digital Engagement</CardDescription>
          </CardHeader>
          <CardContent>
            <p className="text-sm text-gray-600 mb-4">
              Increase customer interaction across all digital touchpoints
            </p>
            
            <div className="space-y-4">
              <div>
                <div className="flex items-center mb-1">
                  <User className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Audience</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Digitally-savvy consumers aged 25-45 in our target markets
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Users className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Customer Behavioral Scenario</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  Customers who interact with our content but don't convert to purchase
                </p>
              </div>
              
              <div>
                <div className="flex items-center mb-1">
                  <Globe className="h-4 w-4 text-gray-500 mr-2" />
                  <h4 className="text-sm font-medium text-gray-700">Behavioral Change</h4>
                </div>
                <p className="text-sm text-gray-600 pl-6">
                  From passive content consumption to active engagement and purchase consideration
                </p>
              </div>
              
              <div>
                <h4 className="text-sm font-medium text-gray-700 mb-2">Key Performance Indicators</h4>
                
                <div className="space-y-3">
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Website Traffic</span>
                      <span className="text-gray-900">250K / 400K</span>
                    </div>
                    <div className="relative">
                      <Progress value={63} className="h-2" />
                      <span className="absolute right-0 -top-6 text-xs text-gray-500">Progress: 63%</span>
                    </div>
                  </div>
                  
                  <div>
                    <div className="flex justify-between text-sm mb-1">
                      <span className="text-gray-600">Social Media Engagement</span>
                      <span className="text-gray-900">18% / 25%</span>
                    </div>
                    <div className="relative">
                      <Progress value={72} className="h-2" />
                      <span className="absolute right-0 -top-6 text-xs text-gray-500">Progress: 72%</span>
                    </div>
                  </div>
                </div>
              </div>
              
              <div className="pt-2 flex justify-between text-sm">
                <div>
                  <span className="text-gray-600 block">Timeline</span>
                  <span className="text-gray-900">Q1-Q3 2025</span>
                </div>
                <div>
                  <span className="text-gray-600 block">Owner</span>
                  <span className="text-gray-900">Digital Marketing Manager</span>
                </div>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default StrategicObjectives;
