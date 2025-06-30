import React, { useMemo, useEffect } from 'react';
import ContentJourneyPlanner from '@/components/views/campaign-planner/ContentJourneyPlanner';
import { useBrand } from '@/contexts/BrandContext';
import { ContentItem } from '@/types/content';

export const CampaignPlannerPage = () => {
  const { getBrandData, selectedBrand } = useBrand();
  const brandData = getBrandData();
  

  const contentItems = useMemo<ContentItem[]>(() => {
    if (!brandData || !brandData.campaigns || !brandData.content) {
      return [];
    }

    // Map content items to match ContentItem interface
    return brandData.content.map(item => {
      return {
        id: item.id,
        name: item.name,
        campaign: item.campaign || '',
        format: item.format,
        type: item.type || 'driver',
        status: item.status || 'draft',
        qualityScore: item.qualityScore || 0, // Now populated from database
        description: item.description,
        cost: item.cost,
        audience: item.audience,
        keyActions: item.keyActions,
        agencies: item.agencies,
        campaignScores: {
          overallEffectiveness: item.scores?.overall || 0, // Now populated from database
          strategicAlignment: item.scores?.strategic || 0, // Now populated from database
          customerAlignment: item.scores?.customer || 0, // Now populated from database
          contentEffectiveness: item.scores?.execution || 0, // Now populated from database
        }
      };
    });
  }, [brandData, selectedBrand]);

  // Don't render until we have content items
  if (contentItems.length === 0) {
    return <div className="flex items-center justify-center h-[50vh]">
      <p className="text-muted-foreground">Loading campaign data...</p>
    </div>;
  }
  // Create a unique key that changes when campaigns change
  const campaignsHash = brandData.campaigns?.map(c => c.id).join('-') || 'empty';
  
  return (
    <ContentJourneyPlanner 
      key={`planner-${selectedBrand}-${campaignsHash}`} // Force re-mount when brand or campaigns change
      contentItems={contentItems} 
      brandName={brandData.profile.name || 'Brand'}
      campaigns={brandData.campaigns} 
    />
  );
};

export default CampaignPlannerPage; 