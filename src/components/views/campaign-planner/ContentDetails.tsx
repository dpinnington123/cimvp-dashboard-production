import React, { useState } from 'react';
import { ContentItem } from '@/types/content';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Card, CardContent } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { DetailItem } from './DetailItem';
import { 
  Target, 
  FileText, 
  Type, 
  Users, 
  Info, 
  Briefcase, 
  Building2, 
  BarChart3, 
  Calendar, 
  Clock, 
  AlertCircle,
  DollarSign
} from 'lucide-react';
import { useUpdateBrandContent } from '@/hooks/useBrandContentOperations';
import { BrandContent } from '@/types/brand';
import { CharacteristicCard } from './CharacteristicCard';
import { ImprovementArea } from './ImprovementArea';

interface ContentDetailsProps {
  item: ContentItem;
  open: boolean;
  onOpenChange: (open: boolean) => void;
}

const ContentDetails: React.FC<ContentDetailsProps> = ({ 
  item, 
  open, 
  onOpenChange 
}) => {
  const { mutate: updateContent } = useUpdateBrandContent();
  
  // Helper function to get icon for characteristic
  const getCharacteristicIcon = (checkName?: string) => {
    if (!checkName) return null;
    const name = checkName.toLowerCase();
    
    if (name.includes('color') || name.includes('colour')) return '🎨';
    if (name.includes('font') || name.includes('text')) return '📝';
    if (name.includes('image') || name.includes('visual')) return '🖼️';
    if (name.includes('layout') || name.includes('design')) return '📐';
    if (name.includes('emotion') || name.includes('feel')) return '💭';
    if (name.includes('message') || name.includes('communication')) return '💬';
    if (name.includes('brand')) return '🏷️';
    if (name.includes('call to action') || name.includes('cta')) return '👆';
    
    return '📊'; // Default icon
  };
  
  // Helper function to format dates
  const formatDate = (dateString?: string | null) => {
    if (!dateString) return null;
    try {
      const date = new Date(dateString);
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric'
      });
    } catch {
      return dateString;
    }
  };

  // Helper function to format currency
  const formatCurrency = (amount?: number) => {
    if (amount === undefined || amount === null) return null;
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-4xl max-h-[90vh] overflow-y-auto">
        <DialogHeader>
          <DialogTitle className="text-2xl font-semibold">{item.name}</DialogTitle>
        </DialogHeader>
        
        <Tabs defaultValue="details" className="mt-6">
          <TabsList className="grid w-full grid-cols-4">
            <TabsTrigger value="performance">Performance Scores</TabsTrigger>
            <TabsTrigger value="details">Content Details</TabsTrigger>
            <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
            <TabsTrigger value="areas">Areas to Improve</TabsTrigger>
          </TabsList>
          
          {/* Performance Scores Tab */}
          <TabsContent value="performance" className="mt-4">
            <Card>
              <CardContent className="p-6">
                <div className="grid grid-cols-2 gap-4">
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Content Scores</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Quality Score</span>
                        <span className="font-medium">{item.qualityScore || 0}/100</span>
                      </div>
                    </div>
                  </div>
                  
                  <div className="space-y-4">
                    <h3 className="font-medium text-lg">Campaign Alignment</h3>
                    <div className="space-y-2">
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Overall Effectiveness</span>
                        <span className="font-medium">{item.campaignScores?.overallEffectiveness || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Strategic Alignment</span>
                        <span className="font-medium">{item.campaignScores?.strategicAlignment || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Customer Alignment</span>
                        <span className="font-medium">{item.campaignScores?.customerAlignment || 0}%</span>
                      </div>
                      <div className="flex justify-between">
                        <span className="text-sm text-muted-foreground">Content Effectiveness</span>
                        <span className="font-medium">{item.campaignScores?.contentEffectiveness || 0}%</span>
                      </div>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Content Details Tab */}
          <TabsContent value="details" className="mt-4">
            <Card>
              <CardContent className="p-6 space-y-6">
                {/* Content Objectives */}
                <div className="space-y-2">
                  <h3 className="text-lg font-medium flex items-center gap-2">
                    <Target className="w-5 h-5 text-primary" />
                    Content Objectives
                  </h3>
                  <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border">
                    {item.contentObjectives || item.objective || "No objectives specified."}
                  </p>
                </div>

                {/* Metadata Grid */}
                <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                  <DetailItem
                    icon={<FileText className="w-3.5 h-3.5" />}
                    label="Format"
                    value={item.format}
                  />
                  <DetailItem
                    icon={<Type className="w-3.5 h-3.5" />}
                    label="Type"
                    value={item.type}
                  />
                  <DetailItem
                    icon={<Users className="w-3.5 h-3.5" />}
                    label="Audience"
                    value={item.audience}
                  />
                  <DetailItem
                    icon={<Info className="w-3.5 h-3.5" />}
                    label="Status"
                    value={item.status}
                  />
                  <DetailItem
                    icon={<Briefcase className="w-3.5 h-3.5" />}
                    label="Campaign"
                    value={item.campaignAlignedTo || item.campaign}
                  />
                  <DetailItem
                    icon={<Building2 className="w-3.5 h-3.5" />}
                    label="Agency"
                    value={item.agency || (item.agencies && item.agencies[0])}
                  />
                  <DetailItem
                    icon={<Target className="w-3.5 h-3.5" />}
                    label="Strategy Alignment"
                    value={item.strategyAlignedTo || item.strategicObjective}
                  />
                  <DetailItem
                    icon={<BarChart3 className="w-3.5 h-3.5" />}
                    label="Funnel Alignment"
                    value={item.funnelAlignment}
                  />
                  <DetailItem
                    icon={<Calendar className="w-3.5 h-3.5" />}
                    label="Created On"
                    value={formatDate(item.createdAt)}
                  />
                  <DetailItem
                    icon={<Clock className="w-3.5 h-3.5" />}
                    label="Expiry Date"
                    value={formatDate(item.expiryDate)}
                  />
                  <DetailItem
                    icon={<AlertCircle className="w-3.5 h-3.5" />}
                    label="Last Updated"
                    value={formatDate(item.updatedAt)}
                  />
                  <DetailItem
                    icon={<DollarSign className="w-3.5 h-3.5" />}
                    label="Cost"
                    value={formatCurrency(item.cost)}
                  />
                </div>
              </CardContent>
            </Card>
          </TabsContent>
          
          {/* Characteristics Tab */}
          <TabsContent value="characteristics" className="mt-4">
            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              {item.characteristics && item.characteristics.length > 0 ? (
                item.characteristics.map((characteristic) => (
                  <CharacteristicCard
                    key={characteristic.id}
                    icon={getCharacteristicIcon(characteristic.check_name)}
                    label={characteristic.check_name || 'Unknown Characteristic'}
                    value={characteristic.score_value || 0}
                    comments={characteristic.comments}
                  />
                ))
              ) : (
                <Card className="col-span-full text-center py-6 bg-muted/50">
                  <CardContent>
                    <h3 className="font-medium mb-1">No Characteristics Data</h3>
                    <p className="text-sm text-muted-foreground">
                      No content characteristics found in analysis results.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
          
          {/* Areas to Improve Tab */}
          <TabsContent value="areas" className="mt-4">
            <div className="space-y-4">
              {item.areasToImprove && item.areasToImprove.length > 0 ? (
                <>
                  <h3 className="text-lg font-medium mb-3">Recommended Improvements</h3>
                  <div className="grid grid-cols-1 gap-4">
                    {item.areasToImprove.map((improvement, index) => {
                      // Determine priority based on score
                      const scoreValue = improvement.score_value || 0;
                      let priority: 'high' | 'medium' | 'low' = 'medium';
                      if (scoreValue < 50) priority = 'high';
                      else if (scoreValue >= 70) priority = 'low';
                      
                      return (
                        <ImprovementArea
                          key={improvement.id}
                          id={improvement.id}
                          title={improvement.check_name || `Improvement Area ${index + 1}`}
                          description={improvement.fix_recommendation || "No specific recommendation provided."}
                          priority={priority}
                        />
                      );
                    })}
                  </div>
                </>
              ) : (
                <Card className="text-center py-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50">
                  <CardContent>
                    <h3 className="text-emerald-600 font-medium mb-1">
                      Great job! No significant improvements needed.
                    </h3>
                    <p className="text-sm text-muted-foreground">
                      This content meets or exceeds all quality standards.
                    </p>
                  </CardContent>
                </Card>
              )}
            </div>
          </TabsContent>
        </Tabs>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetails;