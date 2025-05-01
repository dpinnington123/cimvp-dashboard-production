
import React, { useState } from 'react';
import { ContentItem } from '@/types/content';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { Input } from '@/components/ui/input';
import { Textarea } from '@/components/ui/textarea';
import { InfoIcon, DollarSign, Users, Calendar } from 'lucide-react';
import { toast } from "@/components/ui/use-toast";

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
  const [editedItem, setEditedItem] = useState<ContentItem>({...item});
  const [isEditing, setIsEditing] = useState(false);
  const [kpiInput, setKpiInput] = useState('');
  
  const handleSave = () => {
    // In a real app, this would update the data in a database
    console.log('Saving updated content:', editedItem);
    toast({
      title: "Content updated",
      description: `${editedItem.name} has been updated successfully.`,
    });
    setIsEditing(false);
  };

  const handleAddKpi = () => {
    if (kpiInput.trim()) {
      setEditedItem({
        ...editedItem,
        kpis: [...(editedItem.kpis || []), kpiInput.trim()]
      });
      setKpiInput('');
    }
  };

  const handleRemoveKpi = (index: number) => {
    const newKpis = [...(editedItem.kpis || [])];
    newKpis.splice(index, 1);
    setEditedItem({
      ...editedItem,
      kpis: newKpis
    });
  };

  const formatCurrency = (amount?: number) => {
    if (amount === undefined) return 'Not specified';
    return new Intl.NumberFormat('en-US', {
      style: 'currency',
      currency: 'USD'
    }).format(amount);
  };

  // Pre-determine the values for conditional rendering to avoid hook issues
  const currentName = editedItem.name;
  const currentAudience = editedItem.audience || '';
  const currentObjective = editedItem.objective || '';
  const currentKpis = editedItem.kpis || [];
  const currentCost = editedItem.cost;
  const currentAgency = editedItem.agency || '';
  const hasKpis = currentKpis.length > 0;

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="max-w-3xl">
        <DialogHeader>
          <DialogTitle className="text-xl font-semibold flex items-center gap-2">
            {isEditing ? (
              <Input 
                value={currentName} 
                onChange={(e) => setEditedItem({...editedItem, name: e.target.value})}
                className="text-xl font-semibold h-10"
              />
            ) : (
              currentName
            )}
          </DialogTitle>
          <div className="flex justify-between items-center mt-2">
            <div className="text-sm text-muted-foreground">
              {editedItem.format} · {editedItem.type} · Quality: {editedItem.qualityScore}/100
            </div>
            <Button 
              variant={isEditing ? "default" : "outline"} 
              onClick={() => isEditing ? handleSave() : setIsEditing(true)}
            >
              {isEditing ? "Save Changes" : "Edit Details"}
            </Button>
          </div>
        </DialogHeader>
        
        <div className="grid gap-6 py-4">
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Users className="h-5 w-5 text-muted-foreground" />
              <Label className="font-medium text-base">Target Audience</Label>
            </div>
            {isEditing ? (
              <Textarea 
                value={currentAudience} 
                onChange={(e) => setEditedItem({...editedItem, audience: e.target.value})}
                placeholder="Describe the target audience"
                className="min-h-[60px]"
              />
            ) : (
              <div className="text-sm p-2 bg-muted rounded-md">
                {currentAudience || 'Not specified'}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <Calendar className="h-5 w-5 text-muted-foreground" />
              <Label className="font-medium text-base">Objective</Label>
            </div>
            {isEditing ? (
              <Textarea 
                value={currentObjective} 
                onChange={(e) => setEditedItem({...editedItem, objective: e.target.value})}
                placeholder="Define the content objective"
                className="min-h-[60px]"
              />
            ) : (
              <div className="text-sm p-2 bg-muted rounded-md">
                {currentObjective || 'Not specified'}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <InfoIcon className="h-5 w-5 text-muted-foreground" />
              <Label className="font-medium text-base">KPIs</Label>
            </div>
            {isEditing ? (
              <div className="space-y-2">
                <ul className="list-disc ml-5 space-y-1">
                  {currentKpis.map((kpi, index) => (
                    <li key={index} className="flex items-center justify-between">
                      <span>{kpi}</span>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={() => handleRemoveKpi(index)}
                        className="h-6 px-2 text-destructive"
                      >
                        Remove
                      </Button>
                    </li>
                  ))}
                </ul>
                <div className="flex gap-2 mt-2">
                  <Input 
                    value={kpiInput} 
                    onChange={(e) => setKpiInput(e.target.value)}
                    placeholder="Add new KPI"
                    className="flex-1"
                    onKeyDown={(e) => e.key === 'Enter' && handleAddKpi()}
                  />
                  <Button 
                    onClick={handleAddKpi}
                    disabled={!kpiInput.trim()}
                    size="sm"
                  >
                    Add
                  </Button>
                </div>
              </div>
            ) : (
              <div className="text-sm p-2 bg-muted rounded-md">
                {hasKpis 
                  ? (
                    <ul className="list-disc pl-5">
                      {currentKpis.map((kpi, index) => (
                        <li key={index}>{kpi}</li>
                      ))}
                    </ul>
                  ) 
                  : 'Not specified'
                }
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <div className="flex items-center gap-2">
              <DollarSign className="h-5 w-5 text-muted-foreground" />
              <Label className="font-medium text-base">Cost</Label>
            </div>
            {isEditing ? (
              <Input 
                type="number"
                value={currentCost || ''} 
                onChange={(e) => setEditedItem({...editedItem, cost: parseFloat(e.target.value) || undefined})}
                placeholder="Enter cost amount"
              />
            ) : (
              <div className="text-sm p-2 bg-muted rounded-md font-mono">
                {formatCurrency(currentCost)}
              </div>
            )}
          </div>
          
          <div className="grid gap-2">
            <Label className="font-medium text-base">Agency</Label>
            {isEditing ? (
              <Input 
                value={currentAgency} 
                onChange={(e) => setEditedItem({...editedItem, agency: e.target.value})}
                placeholder="Assign agency"
              />
            ) : (
              <div className="flex justify-between items-center">
                <div className="text-sm p-2 bg-muted rounded-md flex-1">
                  {currentAgency || 'Not assigned'}
                </div>
                {!isEditing && !currentAgency && (
                  <Button 
                    variant="outline" 
                    className="ml-2"
                    onClick={() => setIsEditing(true)}
                  >
                    Assign Agency
                  </Button>
                )}
              </div>
            )}
          </div>
        </div>
      </DialogContent>
    </Dialog>
  );
};

export default ContentDetails;
