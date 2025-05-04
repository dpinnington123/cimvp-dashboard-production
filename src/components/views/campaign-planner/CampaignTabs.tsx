import React, { useEffect } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { ContentItem } from '@/types/content';
import { toast } from "sonner";
import { useBrand } from '@/contexts/BrandContext';

interface CampaignTabsProps {
  onCampaignChange: (campaign: string) => void;
  campaigns: ContentItem[];
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({ onCampaignChange, campaigns }) => {
  const { selectedBrand } = useBrand();
  
  // Log that the campaign tabs component is rendering
  console.log(`[CampaignTabs] Rendering with ${campaigns.length} content items for brand: ${selectedBrand}`);
  
  // Get unique campaigns from content items
  // First extract all campaign names and normalize them
  const allCampaignNames = campaigns
    .map(item => {
      const campaign = item.campaign || '';
      console.log(`Campaign extraction: ${item.name} - Campaign: "${campaign}"`);
      return campaign;
    })
    .filter(Boolean);
  
  // Get unique normalized campaign names
  const uniqueCampaignNames = [...new Set(allCampaignNames)];
  
  // Add 'All Campaigns' at the beginning
  const campaignNames = ['All Campaigns', ...uniqueCampaignNames];
  
  console.log('Available campaigns:', campaignNames);
  
  // Log campaign stats at component mount
  useEffect(() => {
    console.log('Campaign statistics:');
    campaignNames.forEach(campaign => {
      if (campaign === 'All Campaigns') return;
      
      const count = campaigns.filter(item => {
        const itemCampaign = item.campaign || '';
        return itemCampaign === campaign;
      }).length;
      
      console.log(`  - "${campaign}": ${count} items`);
    });
  }, [campaigns, campaignNames]);

  const handleNewCampaign = () => {
    toast("Create New Campaign", {
      description: "This feature will be implemented soon."
    });
  };

  return (
    <div className="space-y-6 mr-6">
      <div className="px-2">
        <Button 
          variant="outline" 
          className="w-full justify-start gap-2 bg-accent/50 hover:bg-accent"
          onClick={handleNewCampaign}
        >
          <Plus className="h-4 w-4" />
          New Campaign
        </Button>
      </div>
      
      {/* Add key prop based on selectedBrand to force remounting when brand changes */}
      <Tabs 
        key={`campaign-tabs-${selectedBrand}`} 
        defaultValue="All Campaigns" 
        className="w-full" 
        onValueChange={onCampaignChange}
      >
        <TabsList className="flex flex-col h-auto bg-muted/50 p-1 w-48 space-y-1">
          {campaignNames.map((campaign) => (
            <TabsTrigger
              key={campaign}
              value={campaign}
              className="w-full justify-start px-4 py-2 h-auto text-left whitespace-normal break-words data-[state=active]:bg-accent data-[state=active]:text-accent-foreground hover:bg-muted/80"
            >
              {campaign}
            </TabsTrigger>
          ))}
        </TabsList>
      </Tabs>
    </div>
  );
};

export default CampaignTabs;

