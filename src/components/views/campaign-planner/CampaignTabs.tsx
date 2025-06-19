import React from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useBrand } from '@/contexts/BrandContext';

interface CampaignTabsProps {
  onCampaignChange: (campaign: string) => void;
  campaigns: Array<{ id: string; name: string; }>;
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({ onCampaignChange, campaigns }) => {
  const { selectedBrand } = useBrand();
  
  // Get campaign names from the campaigns array
  const campaignNames = ['All Campaigns', ...campaigns.map(c => c.name)];
  

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

