import React, { useState, useMemo } from 'react';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Badge } from '@/components/ui/badge';
import { Button } from '@/components/ui/button';
import { Dialog, DialogContent, DialogHeader, DialogTitle } from '@/components/ui/dialog';
import { Plus, Info, FilePlus, Pencil } from 'lucide-react';
import { ContentItem } from '@/types/content';
import ContentDetails from './ContentDetails';
import ContentFilters, { FilterValues } from './ContentFilters';
import AddContentForm from './AddContentForm';
import { toast } from '@/hooks/use-toast';

interface ContentTableProps {
  items: ContentItem[];
  onDragStart: (e: React.DragEvent, item: ContentItem) => void;
  addedContentIds?: string[];
  onAddToJourney?: (item: ContentItem) => void;
  selectedCampaign?: string;
}

const ContentTable: React.FC<ContentTableProps> = ({ 
  items: initialItems, 
  onDragStart, 
  addedContentIds = [],
  onAddToJourney,
  selectedCampaign = 'All Campaigns'
}) => {
  const [items, setItems] = useState<ContentItem[]>(initialItems);
  const [selectedContent, setSelectedContent] = useState<ContentItem | null>(null);
  const [detailsOpen, setDetailsOpen] = useState(false);
  const [addContentOpen, setAddContentOpen] = useState(false);
  const [filters, setFilters] = useState<FilterValues>({
    campaign: '',
    format: '',
    type: '',
  });

  const filteredItems = useMemo(() => {
    return items.filter((item) => {
      const isInSelectedCampaign = selectedCampaign === 'All Campaigns' || item.campaign === selectedCampaign;
      if (!isInSelectedCampaign) return false;

      const matchesFormat = !filters.format || filters.format === 'all' || item.format === filters.format;
      const matchesType = !filters.type || filters.type === 'all' || item.type === filters.type;
      return matchesFormat && matchesType;
    });
  }, [items, filters, selectedCampaign]);

  const handleOpenDetails = (item: ContentItem) => {
    setSelectedContent(item);
    setDetailsOpen(true);
  };

  const getQualityColor = (score: number) => {
    if (score >= 90) return 'bg-green-100 text-green-800';
    if (score >= 80) return 'bg-blue-100 text-blue-800';
    if (score >= 70) return 'bg-yellow-100 text-yellow-800';
    return 'bg-red-100 text-red-800';
  };

  const getStatusVariant = (status: string) => {
    switch (status) {
      case 'live':
        return 'success';
      case 'draft':
        return 'warning';
      case 'planned':
        return 'secondary';
      default:
        return 'secondary';
    }
  };

  const handleAddContent = (newContent: ContentItem) => {
    setItems(prev => [...prev, newContent]);
    setAddContentOpen(false);
    toast({
      title: "Content Added",
      description: "New content has been added to the library.",
    });
  };

  const handleUpdateContent = (item: ContentItem) => {
    toast({
      title: "Coming Soon",
      description: "The update content feature will be available soon!",
    });
  };

  return (
    <>
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-2xl font-semibold">Campaign Content</h2>
        <div className="flex gap-4 items-center">
          <ContentFilters 
            onFilterChange={setFilters} 
            showCampaignFilter={false}
          />
          <Button onClick={() => setAddContentOpen(true)}>
            <FilePlus className="mr-2 h-4 w-4" />
            Add Content
          </Button>
        </div>
      </div>
      <div className="w-full rounded-md border">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[200px]">Name</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-right">Quality Score</TableHead>
              <TableHead className="w-[220px] text-right">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.map((item) => {
              const isAdded = addedContentIds.includes(item.id);
              return (
                <TableRow
                  key={item.id}
                  draggable
                  onDragStart={(e) => onDragStart(e, item)}
                  className={`draggable-item hover:bg-accent ${isAdded ? 'bg-green-50' : ''}`}
                >
                  <TableCell className={`font-medium ${isAdded ? 'text-green-700' : ''}`}>
                    {item.name}
                  </TableCell>
                  <TableCell className={isAdded ? 'text-green-700' : ''}>
                    {item.format}
                  </TableCell>
                  <TableCell>
                    <Badge variant={item.type === 'hero' ? 'default' : 'outline'}>
                      {item.type}
                    </Badge>
                  </TableCell>
                  <TableCell>
                    {item.campaign || '-'}
                  </TableCell>
                  <TableCell>
                    <Badge variant={getStatusVariant(item.status)}>
                      {item.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {item.status !== 'planned' ? (
                      <span className={`inline-flex items-center rounded-full px-2.5 py-0.5 text-xs font-medium ${getQualityColor(item.qualityScore)}`}>
                        {item.qualityScore}
                      </span>
                    ) : (
                      <span className="text-gray-400">-</span>
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    <div className="flex justify-end gap-2">
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleOpenDetails(item)}
                        className="px-2.5"
                      >
                        <Info className="h-4 w-4 mr-1" />
                        Details
                      </Button>
                      <Button 
                        size="sm" 
                        variant="outline" 
                        onClick={() => handleUpdateContent(item)}
                        className="px-2.5"
                      >
                        <Pencil className="h-4 w-4 mr-1" />
                        Update
                      </Button>
                      <Button 
                        size="sm" 
                        variant={isAdded ? "outline" : "default"} 
                        onClick={() => onAddToJourney && onAddToJourney(item)}
                        disabled={isAdded}
                      >
                        <Plus className="mr-1 h-4 w-4" />
                        {isAdded ? 'Added' : 'Add to Journey'}
                      </Button>
                    </div>
                  </TableCell>
                </TableRow>
              );
            })}
          </TableBody>
        </Table>
      </div>
      
      {selectedContent && (
        <ContentDetails 
          item={selectedContent}
          open={detailsOpen}
          onOpenChange={setDetailsOpen}
        />
      )}

      <Dialog open={addContentOpen} onOpenChange={setAddContentOpen}>
        <DialogContent className="sm:max-w-[525px]">
          <DialogHeader>
            <DialogTitle>Add New Content</DialogTitle>
          </DialogHeader>
          <AddContentForm 
            onSubmit={handleAddContent}
            onCancel={() => setAddContentOpen(false)}
          />
        </DialogContent>
      </Dialog>
    </>
  );
};

export default ContentTable;
