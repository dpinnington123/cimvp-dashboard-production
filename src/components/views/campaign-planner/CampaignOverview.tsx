import React, { useState, useEffect } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Target, Flag, Handshake, Users, Activity, FileText, Edit2, Save, Calendar, Trash2 } from 'lucide-react';
import { ContentItem } from '@/types/content';
import { Button } from '@/components/ui/button';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from '@/components/ui/alert-dialog';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { useForm } from 'react-hook-form';
import { toast } from 'sonner';
import { format } from 'date-fns';
import { Calendar as CalendarComponent } from '@/components/ui/calendar';
import { Popover, PopoverContent, PopoverTrigger } from '@/components/ui/popover';
import { 
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from '@/components/ui/accordion';
import { useUpdateCampaign, useDeleteCampaign } from '@/hooks/useBrandCampaignOperations';
import { useBrand } from '@/contexts/BrandContext';
import type { Campaign } from '@/types/brand';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

interface CampaignOverviewProps {
  items: ContentItem[];
  selectedCampaign: string;
  isNewCampaign?: boolean;
  onEditComplete?: () => void;
  onCampaignDeleted?: () => void;
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

const CampaignOverview: React.FC<CampaignOverviewProps> = ({ items, selectedCampaign, isNewCampaign, onEditComplete, onCampaignDeleted }) => {
  const [isEditing, setIsEditing] = React.useState(false);
  const [startDate, setStartDate] = React.useState<Date>();
  const [endDate, setEndDate] = React.useState<Date>();
  const [showDeleteDialog, setShowDeleteDialog] = React.useState(false);
  const [contentCount, setContentCount] = React.useState(0);
  const form = useForm<CampaignData>();
  const updateCampaign = useUpdateCampaign();
  const deleteCampaign = useDeleteCampaign();
  const { getBrandData, selectedBrand } = useBrand();
  
  // Get the current campaign data
  const brandData = getBrandData();
  const currentCampaign = brandData?.campaigns?.find(c => c.name === selectedCampaign);
  const campaignId = currentCampaign?.id;
  
  // Get brand audiences and objectives for dropdowns
  const audiences = brandData?.audiences || [];
  const objectives = brandData?.objectives || [];
  
  // Debug: Log when a specific campaign is selected
  useEffect(() => {
    if (selectedCampaign !== 'All Campaigns') {
      console.log('Selected specific campaign:', selectedCampaign);
      console.log('Found campaign data:', currentCampaign);
      console.log('Campaign has ID:', campaignId);
    }
  }, [selectedCampaign, currentCampaign, campaignId]);
  
  // Automatically enter edit mode for new campaigns
  useEffect(() => {
    if (isNewCampaign && currentCampaign && !isEditing) {
      setIsEditing(true);
    }
  }, [isNewCampaign, currentCampaign]);
  
  // Set form defaults when campaign changes or editing starts
  useEffect(() => {
    if (currentCampaign && isEditing) {
      form.reset({
        strategicObjective: currentCampaign.strategicObjective || '',
        campaignObjectives: currentCampaign.campaignObjectives?.join(', ') || '',
        customerValueProp: currentCampaign.customerValueProp || '',
        audience: currentCampaign.audience || '',
        keyActions: currentCampaign.keyActions?.join(', ') || '',
        campaignDetails: currentCampaign.campaignDetails || '',
        agencies: currentCampaign.agencies?.join(', ') || '',
      });
      
      // Parse dates from timeframe if available
      if (currentCampaign.timeframe) {
        const dates = currentCampaign.timeframe.split(' - ');
        if (dates.length === 2) {
          try {
            setStartDate(new Date(dates[0]));
            setEndDate(new Date(dates[1]));
          } catch (e) {
            console.error('Failed to parse campaign dates:', e);
          }
        }
      }
    }
  }, [currentCampaign, isEditing, form]);

  const calculateAverageScores = (contentItems: ContentItem[]) => {
    const campaignItems = selectedCampaign === 'All Campaigns' 
      ? contentItems 
      : contentItems.filter(item => item.campaign === selectedCampaign);
    
    const itemsWithScores = campaignItems.filter(item => item.campaignScores);
    
    // Generate campaign-specific seed for consistent but different values per campaign
    let campaignSeed = 0;
    if (selectedCampaign !== 'All Campaigns') {
      // Create a simple hash from the campaign name for consistent randomization
      for (let i = 0; i < selectedCampaign.length; i++) {
        campaignSeed += selectedCampaign.charCodeAt(i);
      }
    } else {
      // For "All Campaigns", use a different calculation approach
      campaignSeed = contentItems.length * 7;
    }
    
    // If no items with scores, generate random baseline scores based on campaign name
    if (itemsWithScores.length === 0) {
      const baseValue = 30 + (campaignSeed % 30); // Range from 30-60
      
      return {
        overallEffectiveness: baseValue + (campaignSeed % 7),
        strategicAlignment: baseValue + ((campaignSeed * 3) % 9),
        customerAlignment: baseValue + ((campaignSeed * 7) % 11),
        contentEffectiveness: baseValue + ((campaignSeed * 11) % 13)
      };
    }

    const calculateScoreInRange = (score: number, seed: number) => {
      // Add variability based on campaign name (±5%)
      const variability = 1 + ((seed % 10) - 5) / 100;
      const adjustedScore = Math.round(score * variability);
      return Math.min(97, Math.max(30, adjustedScore));
    };

    // Calculate each metric with a different baseline, multiplier, and campaign-specific variability
    return {
      overallEffectiveness: calculateScoreInRange(
        Math.round(itemsWithScores.reduce((acc, item) => 
          acc + ((item.campaignScores?.overallEffectiveness || 35) * 0.9), 0) / itemsWithScores.length),
        campaignSeed
      ),
      strategicAlignment: calculateScoreInRange(
        Math.round(itemsWithScores.reduce((acc, item) => 
          acc + ((item.campaignScores?.strategicAlignment || 45) * 1.1), 0) / itemsWithScores.length),
        campaignSeed * 3
      ),
      customerAlignment: calculateScoreInRange(
        Math.round(itemsWithScores.reduce((acc, item) => 
          acc + ((item.campaignScores?.customerAlignment || 55) * 0.95), 0) / itemsWithScores.length),
        campaignSeed * 7
      ),
      contentEffectiveness: calculateScoreInRange(
        Math.round(itemsWithScores.reduce((acc, item) => 
          acc + ((item.campaignScores?.contentEffectiveness || 65) * 1.05), 0) / itemsWithScores.length),
        campaignSeed * 11
      )
    };
  };

  const getScoreColor = (score: number): string => {
    if (score >= 90) return 'text-green-600';
    if (score >= 80) return 'text-blue-600';
    if (score >= 70) return 'text-yellow-600';
    return 'text-red-600';
  };

  // Use real campaign scores if available, otherwise calculate from items
  const campaignScores = currentCampaign?.scores ? {
    overallEffectiveness: currentCampaign.scores.overall,
    strategicAlignment: currentCampaign.scores.strategic,
    customerAlignment: currentCampaign.scores.customer,
    contentEffectiveness: currentCampaign.scores.execution
  } : calculateAverageScores(items);

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

  const onSubmit = async (data: CampaignData) => {
    if (!campaignId) {
      toast("Error", {
        description: "Campaign ID not found. Please refresh and try again."
      });
      return;
    }

    // Transform form data to Campaign update format
    const updates: Partial<Campaign> = {
      strategicObjective: data.strategicObjective,
      audience: data.audience,
      campaignDetails: data.campaignDetails,
      agencies: data.agencies?.split(',').map(a => a.trim()).filter(Boolean),
      keyActions: data.keyActions?.split(',').map(a => a.trim()).filter(Boolean),
      customerValueProp: data.customerValueProp,
      campaignObjectives: data.campaignObjectives?.split(',').map(a => a.trim()).filter(Boolean),
    };

    // Add dates if they were selected
    if (startDate && endDate) {
      updates.timeframe = `${format(startDate, 'MMM dd, yyyy')} - ${format(endDate, 'MMM dd, yyyy')}`;
    }

    try {
      await updateCampaign.mutateAsync({ campaignId, updates, brandSlug: selectedBrand });
      setIsEditing(false);
      
      // Notify parent that editing is complete (for new campaigns)
      if (onEditComplete) {
        onEditComplete();
      }
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to update campaign:', error);
    }
  };

  const handleDeleteCampaign = async () => {
    if (!campaignId) return;

    try {
      const result = await deleteCampaign.mutateAsync({ 
        campaignId, 
        forceDelete: false,
        brandSlug: selectedBrand 
      });

      if (result.hasContent) {
        // Show dialog about content
        setContentCount(result.contentCount);
        setShowDeleteDialog(true);
      } else {
        // Campaign deleted successfully, close any dialogs
        setShowDeleteDialog(false);
        // Notify parent component to switch to "All Campaigns"
        if (onCampaignDeleted) {
          onCampaignDeleted();
        }
      }
    } catch (error) {
      console.error('Failed to delete campaign:', error);
    }
  };

  const handleConfirmDelete = async () => {
    if (!campaignId) return;

    try {
      await deleteCampaign.mutateAsync({ 
        campaignId, 
        forceDelete: true,
        brandSlug: selectedBrand 
      });
      setShowDeleteDialog(false);
      // Notify parent component to switch to "All Campaigns"
      if (onCampaignDeleted) {
        onCampaignDeleted();
      }
    } catch (error) {
      console.error('Failed to force delete campaign:', error);
    }
  };

  return (
    <Card className="mb-8">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Target className="h-5 w-5 text-primary" />
            <CardTitle>{selectedCampaign}</CardTitle>
          </div>
          <div className="flex items-center gap-2">
            {isNewCampaign && !isEditing && (
              <span className="text-sm text-yellow-600 font-medium">New campaign - Please add details</span>
            )}
            <Button 
              variant={isNewCampaign && !isEditing ? "default" : "outline"}
              size="sm"
              onClick={() => {
                if (!campaignId) {
                  toast("Error", {
                    description: "Please select a specific campaign to edit. Cannot edit 'All Campaigns' view."
                  });
                  return;
                }
                if (isEditing) {
                  form.handleSubmit(onSubmit)();
                } else {
                  setIsEditing(true);
                }
              }}
              disabled={!campaignId || updateCampaign.isPending}
            >
              {isEditing ? <Save className="h-4 w-4 mr-2" /> : <Edit2 className="h-4 w-4 mr-2" />}
              {isEditing ? 'Save Changes' : isNewCampaign ? 'Add Details' : 'Edit Campaign'}
            </Button>
            {!isNewCampaign && !isEditing && campaignId && (
              <Button
                variant="destructive"
                size="sm"
                onClick={handleDeleteCampaign}
                disabled={deleteCampaign.isPending}
              >
                <Trash2 className="h-4 w-4 mr-2" />
                Delete
              </Button>
            )}
          </div>
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

          <Accordion type="single" collapsible className="w-full" defaultValue={isNewCampaign ? "campaign-details" : undefined}>
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
                            <Select 
                              value={form.watch('strategicObjective')}
                              onValueChange={(value) => form.setValue('strategicObjective', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select a strategic objective" />
                              </SelectTrigger>
                              <SelectContent>
                                {objectives.map((objective) => (
                                  <SelectItem key={objective.id} value={objective.text}>
                                    {objective.text}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                            <Select 
                              value={form.watch('audience')}
                              onValueChange={(value) => form.setValue('audience', value)}
                            >
                              <SelectTrigger>
                                <SelectValue placeholder="Select target audience" />
                              </SelectTrigger>
                              <SelectContent>
                                {audiences.map((audience) => (
                                  <SelectItem key={audience.id} value={audience.text}>
                                    {audience.text}
                                  </SelectItem>
                                ))}
                              </SelectContent>
                            </Select>
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
                              {...form.register('keyActions')}
                              placeholder="Enter key actions (comma separated)..."
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
                    
                    {/* Second row of fields */}
                    {Object.values(campaignInfo).map((campaign) => (
                      <div key={`${campaign.name}-2`} className="grid grid-cols-3 gap-4 mt-4">
                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Flag className="h-4 w-4" />
                            Campaign Objectives
                          </h4>
                          {isEditing ? (
                            <Textarea
                              {...form.register('campaignObjectives')}
                              placeholder="Enter campaign objectives (comma separated)..."
                              className="h-24"
                            />
                          ) : (
                            <p className="text-sm bg-muted p-3 rounded-lg">
                              {campaign.campaignObjectives?.join(', ') || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <Handshake className="h-4 w-4" />
                            Customer Value Proposition
                          </h4>
                          {isEditing ? (
                            <Textarea
                              {...form.register('customerValueProp')}
                              placeholder="Enter customer value proposition..."
                              className="h-24"
                            />
                          ) : (
                            <p className="text-sm bg-muted p-3 rounded-lg">
                              {campaign.customerValueProp || 'Not specified'}
                            </p>
                          )}
                        </div>

                        <div className="space-y-2">
                          <h4 className="text-sm font-medium flex items-center gap-2">
                            <FileText className="h-4 w-4" />
                            Campaign Details
                          </h4>
                          {isEditing ? (
                            <Textarea
                              {...form.register('campaignDetails')}
                              placeholder="Enter campaign details..."
                              className="h-24"
                            />
                          ) : (
                            <p className="text-sm bg-muted p-3 rounded-lg">
                              {campaign.campaignDetails || 'Not specified'}
                            </p>
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
                                {...form.register('agencies')}
                                placeholder="Enter agencies (comma separated)..."
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
      
      {/* Delete Confirmation Dialog */}
      <AlertDialog open={showDeleteDialog} onOpenChange={setShowDeleteDialog}>
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
            <AlertDialogDescription>
              {contentCount > 0 ? (
                <>
                  This campaign has <strong>{contentCount} content item{contentCount > 1 ? 's' : ''}</strong> associated with it.
                  <br /><br />
                  Deleting this campaign will remove all associated content. This action cannot be undone.
                </>
              ) : (
                'Are you sure you want to delete this campaign? This action cannot be undone.'
              )}
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel>Cancel</AlertDialogCancel>
            <AlertDialogAction
              onClick={handleConfirmDelete}
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
            >
              {contentCount > 0 ? 'Delete Campaign and Content' : 'Delete Campaign'}
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </Card>
  );
};

export default CampaignOverview;
