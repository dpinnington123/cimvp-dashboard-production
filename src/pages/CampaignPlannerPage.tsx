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
        qualityScore: item.qualityScore || Math.floor(Math.random() * 30) + 70,
        description: item.description,
        cost: item.cost,
        audience: item.audience,
        keyActions: item.keyActions,
        agencies: item.agencies,
        campaignScores: {
          overallEffectiveness: item.scores?.overall || Math.floor(Math.random() * 20) + 60,
          strategicAlignment: item.scores?.strategic || Math.floor(Math.random() * 20) + 60, 
          customerAlignment: item.scores?.customer || Math.floor(Math.random() * 20) + 60,
          contentEffectiveness: item.scores?.execution || Math.floor(Math.random() * 20) + 60,
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
  return (
    <ContentJourneyPlanner 
      key={`planner-${selectedBrand}`} // Force re-mount when brand changes
      contentItems={contentItems} 
      brandName={brandData.profile.name || 'Brand'}
      campaigns={brandData.campaigns} 
    />
  );
};

export default CampaignPlannerPage; 