import React, { useMemo, useEffect } from 'react';
import ContentJourneyPlanner from '@/components/views/campaign-planner/ContentJourneyPlanner';
import { useBrand } from '@/contexts/BrandContext';
import { ContentItem } from '@/types/content';

export const CampaignPlannerPage = () => {
  const { getBrandData, selectedBrand } = useBrand();
  const brandData = getBrandData();
  
  // Log when the page component renders
  console.log(`[CampaignPlannerPage] Rendering for brand: ${selectedBrand}`);
  
  // Track brand changes
  useEffect(() => {
    console.log(`[CampaignPlannerPage] Brand changed to: ${selectedBrand}, loading data for ${brandData?.profile?.name}`);
  }, [selectedBrand, brandData?.profile?.name]);

  const contentItems = useMemo<ContentItem[]>(() => {
    if (!brandData || !brandData.campaigns || !brandData.content) {
      console.log(`[CampaignPlannerPage] No data available for brand: ${selectedBrand}`);
      return [];
    }

    console.log(`[CampaignPlannerPage] Processing content for brand: ${selectedBrand} (${brandData.profile.name})`);
    
    // Get all campaign names from the brand data for reference
    const campaignNamesList = brandData.campaigns.map(c => c.name);
    console.log(`[CampaignPlannerPage] Available campaigns in brand data (${campaignNamesList.length}):`, campaignNamesList);
    
    // Map content items to match ContentItem interface
    return brandData.content.map(item => {
      // Add logging to see what campaign values we're working with
      console.log(`Content item: ${item.name}, Original Campaign: "${item.campaign}"`);
      
      // Make sure campaign is a string and not undefined
      let campaign = item.campaign || '';
      
      // Find the most similar official campaign name if there's a mismatch
      if (campaign && !campaignNamesList.includes(campaign)) {
        // Try to find a close match in the official campaign names
        const matchingCampaign = campaignNamesList.find(officialName => 
          officialName.toLowerCase() === campaign.toLowerCase() ||
          officialName.toLowerCase().includes(campaign.toLowerCase()) ||
          campaign.toLowerCase().includes(officialName.toLowerCase())
        );
        
        if (matchingCampaign) {
          console.log(`Normalizing campaign name: "${campaign}" to "${matchingCampaign}"`);
          campaign = matchingCampaign;
        }
      }
      
      return {
        id: item.id,
        name: item.name,
        campaign: campaign, // Normalized campaign name
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
    console.log(`[CampaignPlannerPage] No content items available, showing loading state`);
    return <div className="flex items-center justify-center h-[50vh]">
      <p className="text-muted-foreground">Loading campaign data...</p>
    </div>;
  }

  console.log(`[CampaignPlannerPage] Rendering ContentJourneyPlanner with ${contentItems.length} items`);
  return (
    <ContentJourneyPlanner 
      key={`planner-${selectedBrand}`} // Force re-mount when brand changes
      contentItems={contentItems} 
      brandName={brandData.profile.name || 'Brand'} 
    />
  );
};

export default CampaignPlannerPage; 