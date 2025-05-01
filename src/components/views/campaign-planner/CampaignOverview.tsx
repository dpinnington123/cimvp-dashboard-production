
import React, { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Flag, Handshake, Users, Activity, FileText, Edit2, Save, Calendar } from 'lucide-react';
import { ContentItem } from '@/types/content';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { useToast } from '@/hooks/use-toast';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';

interface CampaignOverviewProps {
  items: ContentItem[];
  selectedCampaign: string;
}

interface CampaignData {
  strategicObjective: string;
  campaignObjectives: string;
  customerValueProp: string;
  audience: string;
  keyActions: string;
  campaignDetails: string;
  agencies: string;
}

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ items, selectedCampaign }) => {
  const { toast } = useToast();
  const [isEditing, setIsEditing] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const form = useForm<CampaignData>();

  const calculateAverageScores = (contentItems: ContentItem[]) => {
    const campaignItems = selectedCampaign === 'All Campaigns' 
      ? contentItems 
      : contentItems.filter(item => item.campaign === selectedCampaign);
    
    const itemsWithScores = campaignItems.filter(item => item.campaignScores);
    
    if (itemsWithScores.length === 0) {
      return {
        overallEffectiveness: 35,
        strategicAlignment: 45,
        customerAlignment: 55,
        contentEffectiveness: 65
      };
    }

    const calculateScoreInRange = (score: number) => {
      return Math.min(76, Math.max(30, score));
    };

    // Calculate each metric with a different baseline and multiplier
    return {
      overallEffectiveness: calculateScoreInRange(Math.round(itemsWithScores.reduce((acc, item) => 
        acc + ((item.campaignScores?.overallEffectiveness || 35) * 0.9), 0) / itemsWithScores.length)),
      strategicAlignment: calculateScoreInRange(Math.round(itemsWithScores.reduce((acc, item) => 
        acc + ((item.campaignScores?.strategicAlignment || 45) * 1.1), 0) / itemsWithScores.length)),
      customerAlignment: calculateScoreInRange(Math.round(itemsWithScores.reduce((acc, item) => 
        acc + ((item.campaignScores?.customerAlignment || 55) * 0.95), 0) / itemsWithScores.length)),
      contentEffectiveness: calculateScoreInRange(Math.round(itemsWithScores.reduce((acc, item) => 
        acc + ((item.campaignScores?.contentEffectiveness || 65) * 1.05), 0) / itemsWithScores.length))
    };
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  const campaignScores = calculateAverageScores(items);

  if (selectedCampaign === 'All Campaigns') {
    return (
      <Card className="mb-8">
        <CardHeader>
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>All Campaigns Overview</CardTitle>
          </div>
          <CardDescription>Combined performance metrics across all campaigns</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4 mb-6">
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Overall Effectiveness</h4>
              <p className={`text-2xl font-bold ${getScoreColor(campaignScores.overallEffectiveness)}`}>
                {campaignScores.overallEffectiveness}%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Strategic Alignment</h4>
              <p className={`text-2xl font-bold ${getScoreColor(campaignScores.strategicAlignment)}`}>
                {campaignScores.strategicAlignment}%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Customer Alignment</h4>
              <p className={`text-2xl font-bold ${getScoreColor(campaignScores.customerAlignment)}`}>
                {campaignScores.customerAlignment}%
              </p>
            </div>
            <div className="p-4 bg-muted rounded-lg">
              <h4 className="text-sm font-medium mb-2">Content Effectiveness</h4>
              <p className={`text-2xl font-bold ${getScoreColor(campaignScores.contentEffectiveness)}`}>
                {campaignScores.contentEffectiveness}%
              </p>
            </div>
          </div>
        </CardContent>
      </Card>
    );
  }

  const filteredItems = items.filter(item => item.campaign === selectedCampaign);
  const campaignInfo = filteredItems.reduce<Record<string, {
    name: string;
    itemCount: number;
    totalCost: number;
    status: 'draft' | 'live';
    strategicObjective?: string;
    campaignObjectives?: string[];
    customerValueProp?: string;
    audience?: string;
    keyActions?: string[];
    campaignDetails?: string;
    agencies?: string[];
  }>>((acc, item) => {
    if (!item.campaign) return acc;
    
    if (!acc[item.campaign]) {
      acc[item.campaign] = {
        name: item.campaign,
        itemCount: 0,
        totalCost: 0,
        status: 'draft',
        strategicObjective: item.strategicObjective,
        campaignObjectives: item.campaignObjectives,
        customerValueProp: item.customerValueProp,
        audience: item.audience,
        keyActions: item.keyActions,
        campaignDetails: item.campaignDetails,
        agencies: item.agencies
      };
    }
    
    acc[item.campaign].itemCount++;
    acc[item.campaign].totalCost += item.cost || 0;
    if (item.status === 'live') {
      acc[item.campaign].status = 'live';
    }
    
    return acc;
  }, {});

  const onSubmit = (data: CampaignData) => {
    toast({
      title: "Campaign Updated",
      description: "Campaign information has been saved successfully."
    });
    console.log('Campaign data:', data);
    setIsEditing(false);
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>{selectedCampaign}</CardTitle>
          </div>
          <Button 
            variant="outline" 
            size="sm"
            onClick={() => setIsEditing(!isEditing)}
          >
            {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
            {isEditing ? 'Save Changes' : 'Edit Campaign'}
          </Button>
        </div>
        <CardDescription>Campaign Overview and Performance Metrics</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle className="text-lg">Performance Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-4 gap-4">
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-1">Overall Effectiveness</h4>
                  <p className={`text-xl font-bold ${getScoreColor(campaignScores.overallEffectiveness)}`}>
                    {campaignScores.overallEffectiveness}%
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-1">Strategic Alignment</h4>
                  <p className={`text-xl font-bold ${getScoreColor(campaignScores.strategicAlignment)}`}>
                    {campaignScores.strategicAlignment}%
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-1">Customer Alignment</h4>
                  <p className={`text-xl font-bold ${getScoreColor(campaignScores.customerAlignment)}`}>
                    {campaignScores.customerAlignment}%
                  </p>
                </div>
                <div className="p-3 bg-muted rounded-lg">
                  <h4 className="text-sm font-medium mb-1">Content Effectiveness</h4>
                  <p className={`text-xl font-bold ${getScoreColor(campaignScores.contentEffectiveness)}`}>
                    {campaignScores.contentEffectiveness}%
                  </p>
                </div>
              </div>
            </CardContent>
          </Card>

          <Accordion type="single" collapsible className="w-full">
            <AccordionItem value="campaign-details">
              <AccordionTrigger className="text-lg font-semibold">Campaign Details</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {Object.values(campaignInfo).map((campaign) => (
                      <div key={campaign.name} className="grid grid-cols-3 gap-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Target className="h-4 w-4" />
                            Strategic Objective
                          </h4>
                          {isEditing ? (
                            <Textarea
                              value={campaign.strategicObjective}
                              onChange={(e) => form.setValue('strategicObjective', e.target.value)}
                              placeholder="Enter strategic objective..."
                              className="h-24"
                            />
                          ) : (
                            <p className="text-sm bg-muted p-3 rounded-lg">
                              {campaign.strategicObjective || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Users className="h-4 w-4" />
                            Target Audience
                          </h4>
                          {isEditing ? (
                            <Textarea
                              value={campaign.audience}
                              onChange={(e) => form.setValue('audience', e.target.value)}
                              placeholder="Enter target audience..."
                              className="h-24"
                            />
                          ) : (
                            <p className="text-sm bg-muted p-3 rounded-lg">
                              {campaign.audience || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Activity className="h-4 w-4" />
                            Key Actions
                          </h4>
                          {isEditing ? (
                            <Textarea
                              value={campaign.keyActions?.join('\n')}
                              onChange={(e) => form.setValue('keyActions', e.target.value)}
                              placeholder="Enter key actions (one per line)..."
                              className="h-24"
                            />
                          ) : (
                            <div className="text-sm bg-muted p-3 rounded-lg">
                              {campaign.keyActions?.length ? (
                                <ul className="list-disc pl-4 space-y-1">
                                  {campaign.keyActions.map((action, index) => (
                                    <li key={index}>{action}</li>
                                  ))}
                                </ul>
                              ) : (
                                'Not specified'
                              )}
                            </div>
                          )}
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>

            <AccordionItem value="campaign-metrics">
              <AccordionTrigger className="text-lg font-semibold">Campaign Metrics</AccordionTrigger>
              <AccordionContent>
                <Card>
                  <CardContent className="pt-6">
                    {Object.values(campaignInfo).map((campaign) => (
                      <div key={campaign.name} className="space-y-4">
                        <div className="grid grid-cols-4 gap-4">
                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="text-sm font-medium mb-1">Status</h4>
                            <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${
                              campaign.status === 'live' ? 'bg-green-100 text-green-800' : 'bg-yellow-100 text-yellow-800'
                            }`}>
                              {campaign.status}
                            </span>
                          </div>

                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="text-sm font-medium mb-1">Content Items</h4>
                            <p className="text-xl font-semibold">{filteredItems.length}</p>
                          </div>

                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="text-sm font-medium mb-1">Total Budget</h4>
                            <p className="text-xl font-semibold">
                              ${campaign.totalCost.toLocaleString()}
                            </p>
                          </div>

                          <div className="p-3 bg-muted rounded-lg">
                            <h4 className="text-sm font-medium mb-1">Agencies</h4>
                            {isEditing ? (
                              <Textarea
                                value={campaign.agencies?.join('\n')}
                                onChange={(e) => form.setValue('agencies', e.target.value)}
                                placeholder="Enter agencies (one per line)..."
                                className="h-24"
                              />
                            ) : (
                              <div className="space-y-1">
                                {campaign.agencies?.length ? (
                                  campaign.agencies.map((agency, index) => (
                                    <p key={index} className="text-sm">{agency}</p>
                                  ))
                                ) : (
                                  <p className="text-sm">Not specified</p>
                                )}
                              </div>
                            )}
                          </div>
                        </div>

                        <div className="p-4 bg-muted rounded-lg">
                          <h4 className="text-sm font-medium mb-3 flex items-center gap-2">
                            <Calendar className="h-4 w-4" />
                            Campaign Timeline
                          </h4>
                          <div className="grid grid-cols-2 gap-4">
                            <div>
                              <label className="text-sm font-medium mb-1 block">Start Date</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${
                                      !startDate && "text-muted-foreground"
                                    }`}
                                  >
                                    {startDate ? format(startDate, "PPP") : <span>Pick a start date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={startDate}
                                    onSelect={setStartDate}
                                    initialFocus
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>

                            <div>
                              <label className="text-sm font-medium mb-1 block">End Date</label>
                              <Popover>
                                <PopoverTrigger asChild>
                                  <Button
                                    variant="outline"
                                    className={`w-full justify-start text-left font-normal ${
                                      !endDate && "text-muted-foreground"
                                    }`}
                                  >
                                    {endDate ? format(endDate, "PPP") : <span>Pick an end date</span>}
                                  </Button>
                                </PopoverTrigger>
                                <PopoverContent className="w-auto p-0" align="start">
                                  <CalendarComponent
                                    mode="single"
                                    selected={endDate}
                                    onSelect={setEndDate}
                                    initialFocus
                                    disabled={(date) => startDate ? date < startDate : false}
                                    className="pointer-events-auto"
                                  />
                                </PopoverContent>
                              </Popover>
                            </div>
                          </div>
                        </div>
                      </div>
                    ))}
                  </CardContent>
                </Card>
              </AccordionContent>
            </AccordionItem>
          </Accordion>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignOverview;
