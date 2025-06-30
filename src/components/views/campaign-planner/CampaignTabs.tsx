import React, { useState } from 'react';
import { Tabs, TabsList, TabsTrigger } from "@/components/ui/tabs"
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { toast } from "sonner";
import { useBrand } from '@/contexts/BrandContext';
import { useAddCampaign } from '@/hooks/useBrandCampaignOperations';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogFooter,
} from "@/components/ui/dialog";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { brandService } from '@/services/brandService';

interface CampaignTabsProps {
  onCampaignChange: (campaign: string, isNewCampaign?: boolean) => void;
  campaigns: Array<{ id: string; name: string; }>;
}

const CampaignTabs: React.FC<CampaignTabsProps> = ({ onCampaignChange, campaigns }) => {
  const { selectedBrand } = useBrand();
  const [dialogOpen, setDialogOpen] = useState(false);
  const [newCampaignName, setNewCampaignName] = useState('');
  const [newCampaignStatus, setNewCampaignStatus] = useState<'planned' | 'active' | 'completed'>('planned');
  const addCampaign = useAddCampaign();
  
  // Get campaign names from the campaigns array
  const campaignNames = ['All Campaigns', ...campaigns.map(c => c.name)];
  
  // Get brand ID
  const [brandId, setBrandId] = useState<string | null>(null);
  
  React.useEffect(() => {
    const fetchBrandId = async () => {
      if (selectedBrand) {
        try {
          const id = await brandService.getBrandIdBySlug(selectedBrand);
          setBrandId(id);
        } catch (error) {
          console.error('Failed to fetch brand ID:', error);
        }
      }
    };
    fetchBrandId();
  }, [selectedBrand]);

  const handleNewCampaign = async () => {
    if (!brandId) {
      toast("Error", {
        description: "Please select a brand first."
      });
      return;
    }

    if (!newCampaignName.trim()) {
      toast("Error", {
        description: "Please enter a campaign name."
      });
      return;
    }

    try {
      await addCampaign.mutateAsync({
        brandId,
        campaign: {
          name: newCampaignName.trim(),
          status: newCampaignStatus,
          scores: {
            overall: 0,
            strategic: 0,
            customer: 0,
            execution: 0
          }
        }
      });
      
      setDialogOpen(false);
      setNewCampaignName('');
      setNewCampaignStatus('planned');
      
      // Switch to the new campaign and mark it as new
      onCampaignChange(newCampaignName.trim(), true);
    } catch (error) {
      // Error is handled by the hook
      console.error('Failed to create campaign:', error);
    }
  };

  return (
    <div className="space-y-6 mr-6">
      <div className="px-2">
        <Dialog open={dialogOpen} onOpenChange={setDialogOpen}>
          <DialogTrigger asChild>
            <Button 
              variant="outline" 
              className="w-full justify-start gap-2 bg-accent/50 hover:bg-accent"
            >
              <Plus className="h-4 w-4" />
              New Campaign
            </Button>
          </DialogTrigger>
          <DialogContent>
            <DialogHeader>
              <DialogTitle>Create New Campaign</DialogTitle>
              <DialogDescription>
                Add a new campaign to start planning and tracking content.
              </DialogDescription>
            </DialogHeader>
            <div className="grid gap-4 py-4">
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="name" className="text-right">
                  Name
                </Label>
                <Input
                  id="name"
                  value={newCampaignName}
                  onChange={(e) => setNewCampaignName(e.target.value)}
                  className="col-span-3"
                  placeholder="Summer 2024 Campaign"
                />
              </div>
              <div className="grid grid-cols-4 items-center gap-4">
                <Label htmlFor="status" className="text-right">
                  Status
                </Label>
                <Select
                  value={newCampaignStatus}
                  onValueChange={(value: any) => setNewCampaignStatus(value)}
                >
                  <SelectTrigger className="col-span-3">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="planned">Planned</SelectItem>
                    <SelectItem value="active">Active</SelectItem>
                    <SelectItem value="completed">Completed</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
            <DialogFooter>
              <Button
                type="submit"
                onClick={handleNewCampaign}
                disabled={!newCampaignName.trim() || addCampaign.isPending}
              >
                {addCampaign.isPending ? 'Creating...' : 'Create Campaign'}
              </Button>
            </DialogFooter>
          </DialogContent>
        </Dialog>
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

