import React, { useState, useEffect } from 'react';
import { v4 as uuidv4 } from 'uuid';
import ContentTable from './ContentTable';
import Canvas from './Canvas';
import CampaignTabs from './CampaignTabs';
import CampaignOverview from './CampaignOverview';
import { CanvasNode, Connection, ContentItem, JourneyMap, Position } from '@/types/content';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { toast } from 'sonner';
import { Download, Save, Trash2, HelpCircle } from 'lucide-react';
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import { useBrand } from '@/contexts/BrandContext';

interface ContentJourneyPlannerProps {
  contentItems: ContentItem[];
  brandName: string;
}

const ContentJourneyPlanner: React.FC<ContentJourneyPlannerProps> = ({ contentItems, brandName }) => {
  const [selectedCampaign, setSelectedCampaign] = useState<string>('All Campaigns');
  const [journeyMap, setJourneyMap] = useState<JourneyMap>({
    nodes: [],
    connections: [],
    title: "Campaign Journey"
  });
  const [addedContentIds, setAddedContentIds] = useState<string[]>([]);
  
  // Use the brand context to detect brand changes
  const { selectedBrand } = useBrand();
  
  // Use brand name in local storage key to keep journey maps separate for each brand
  const storageKey = `journey-${brandName}-${selectedCampaign}`;
  
  // Reset to "All Campaigns" whenever the selected brand changes
  useEffect(() => {
    setSelectedCampaign('All Campaigns');
  }, [selectedBrand]);
  
  useEffect(() => {
    const savedJourney = localStorage.getItem(storageKey);
    if (savedJourney) {
      setJourneyMap(JSON.parse(savedJourney));
    } else {
      setJourneyMap({
        nodes: [],
        connections: [],
        title: selectedCampaign === 'All Campaigns' ? 'Campaign Journey' : `${selectedCampaign} Journey`
      });
      setAddedContentIds([]);
    }
  }, [selectedCampaign, brandName, storageKey]);
  
  useEffect(() => {
    localStorage.setItem(storageKey, JSON.stringify(journeyMap));
  }, [journeyMap, storageKey]);

  // Create the filtered content items based on the selected campaign
  const filteredContentItems = contentItems.filter(item => selectedCampaign === 'All Campaigns' || item.campaign === selectedCampaign);
  
  const handleCampaignChange = (campaign: string) => {
    setSelectedCampaign(campaign);
    setJourneyMap(prev => ({
      ...prev,
      title: campaign === 'All Campaigns' ? 'Campaign Journey' : `${campaign} Journey`
    }));
  };
  
  const handleTitleChange = (title: string) => {
    setJourneyMap(prev => ({
      ...prev,
      title
    }));
  };
  
  const handleDragStart = (e: React.DragEvent, item: ContentItem) => {
    e.dataTransfer.setData('text', JSON.stringify(item));
  };
  
  const handleAddNode = (content: ContentItem, position: Position) => {
    // Create a new node with enhanced data from the content item
    const newNode: CanvasNode = {
      id: uuidv4(),
      content: {
        ...content,
        // Set default campaign scores if not already present
        campaignScores: content.campaignScores || {
          overallEffectiveness: 75,
          strategicAlignment: 75,
          customerAlignment: 75,
          contentEffectiveness: 75
        },
        // Ensure audience information is available
        audience: content.audience || getDefaultAudience(content.campaign),
        // Ensure we have key actions for engagement tracking
        keyActions: content.keyActions || ['View', 'Share', 'Learn More']
      },
      position
    };
    
    setJourneyMap(prev => ({
      ...prev,
      nodes: [...prev.nodes, newNode]
    }));
    if (!addedContentIds.includes(content.id)) {
      setAddedContentIds(prev => [...prev, content.id]);
    }
    toast("Content Added", {
      description: `Added "${content.name}" to your journey`
    });
  };
  
  // Helper function to get default audience based on campaign
  const getDefaultAudience = (campaign?: string): string => {
    if (!campaign) return 'General audience';
    
    switch (campaign) {
      case 'Earth Month Awareness':
        return 'Environmentally conscious consumers aged 25-45';
      case 'Zero-Waste Challenge':
        return 'Sustainability advocates, zero-waste lifestyle enthusiasts';
      case 'Holiday Gift Guide: Sustainable Edition':
        return 'Gift shoppers interested in sustainable products';
      case 'Next Gen Product Launch':
        return 'Tech early adopters aged 25-40';
      case 'Work From Anywhere':
        return 'Remote workers and digital nomads';
      case 'Smart Home Essentials':
        return 'Tech-savvy homeowners aged 30-55';
      case 'Sleep Revolution':
        return 'Health-conscious adults with sleep concerns';
      case 'Immune Health Awareness':
        return 'Health-focused individuals aged 25-65';
      case 'Active Aging Initiative':
        return 'Active adults aged 55+';
      default:
        return 'General audience';
    }
  };
  
  const handleAddToJourney = (content: ContentItem) => {
    let xPosition = 50;
    let yPosition = 150;
    if (journeyMap.nodes.length > 0) {
      const rightmostNode = journeyMap.nodes.reduce((rightmost, current) => {
        return current.position.x > rightmost.position.x ? current : rightmost;
      }, journeyMap.nodes[0]);
      xPosition = rightmostNode.position.x + 200;
      yPosition = rightmostNode.position.y;
    }
    const position: Position = {
      x: xPosition,
      y: yPosition
    };
    handleAddNode(content, position);
  };
  
  const handleMoveNode = (id: string, position: Position) => {
    setJourneyMap(prev => ({
      ...prev,
      nodes: prev.nodes.map(node => node.id === id ? {
        ...node,
        position
      } : node)
    }));
  };
  
  const handleRemoveNode = (id: string) => {
    const nodeToRemove = journeyMap.nodes.find(node => node.id === id);
    setJourneyMap(prev => ({
      ...prev,
      nodes: prev.nodes.filter(node => node.id !== id),
      connections: prev.connections.filter(conn => conn.from !== id && conn.to !== id)
    }));
    if (nodeToRemove) {
      const contentId = nodeToRemove.content.id;
      const contentStillExists = journeyMap.nodes.filter(node => node.id !== id).some(node => node.content.id === contentId);
      if (!contentStillExists) {
        setAddedContentIds(prev => prev.filter(id => id !== contentId));
      }
    }
    toast("Content Removed", {
      description: "The content item has been removed from your journey"
    });
  };
  
  const handleConnect = (fromId: string, toId: string) => {
    const connectionExists = journeyMap.connections.some(conn => conn.from === fromId && conn.to === toId);
    if (connectionExists) {
      toast("Connection Already Exists", {
        description: "These two content items are already connected",
        className: "destructive"
      });
      return;
    }
    const newConnection: Connection = {
      id: uuidv4(),
      from: fromId,
      to: toId
    };
    setJourneyMap(prev => ({
      ...prev,
      connections: [...prev.connections, newConnection]
    }));
    toast("Connection Created", {
      description: "Content items have been connected in your journey"
    });
  };
  
  const handleRemoveConnection = (id: string) => {
    setJourneyMap(prev => ({
      ...prev,
      connections: prev.connections.filter(conn => conn.id !== id)
    }));
    toast("Connection Removed", {
      description: "The connection has been removed from your journey"
    });
  };
  
  const handleClearCanvas = () => {
    setJourneyMap({
      nodes: [],
      connections: [],
      title: selectedCampaign === 'All Campaigns' ? 'Campaign Journey' : `${selectedCampaign} Journey`
    });
    setAddedContentIds([]);
    toast("Canvas Cleared", {
      description: "All content and connections have been removed"
    });
  };
  
  const handleSaveJourney = () => {
    localStorage.setItem(storageKey, JSON.stringify(journeyMap));
    toast("Journey Saved", {
      description: "Your content journey has been saved successfully"
    });
  };
  
  const handleExportJourney = () => {
    const dataStr = "data:text/json;charset=utf-8," + encodeURIComponent(JSON.stringify(journeyMap, null, 2));
    const downloadAnchorNode = document.createElement('a');
    downloadAnchorNode.setAttribute("href", dataStr);
    downloadAnchorNode.setAttribute("download", `${brandName}-${selectedCampaign}-journey.json`);
    document.body.appendChild(downloadAnchorNode);
    downloadAnchorNode.click();
    downloadAnchorNode.remove();
    toast("Journey Exported", {
      description: "Your content journey has been exported as JSON"
    });
  };
  
  return <div className="container py-6 max-w">
      <div className="flex flex-col gap-8">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Campaign Planning for {brandName}</h1>
          <p className="text-muted-foreground mt-2">
            Plan and visualize your content marketing journeys with drag and drop simplicity
          </p>
        </div>

        <div className="flex gap-6">
          <div className="shrink-0">
            <CampaignTabs onCampaignChange={handleCampaignChange} campaigns={contentItems} />
          </div>
          
          <div className="flex-1 space-y-6">
            <CampaignOverview items={contentItems} selectedCampaign={selectedCampaign} />

            <Card>
              <CardHeader>
                <CardTitle>Content Library</CardTitle>
                <CardDescription>
                  Browse and drag content items to the canvas below or use the "Add to Journey" button
                </CardDescription>
              </CardHeader>
              <CardContent>
                <ContentTable items={filteredContentItems} onDragStart={handleDragStart} addedContentIds={addedContentIds} onAddToJourney={handleAddToJourney} selectedCampaign={selectedCampaign} />
              </CardContent>
            </Card>

            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                <h2 className="text-xl font-semibold">Design Your Content Journey</h2>
                <TooltipProvider>
                  <Tooltip>
                    <TooltipTrigger>
                      <HelpCircle className="h-4 w-4 text-muted-foreground" />
                    </TooltipTrigger>
                    <TooltipContent className="max-w-[300px]">
                      <p>1. Drag content from the library above to the canvas</p>
                      <p>2. To connect items, click and drag from one connection point to another</p>
                      <p>3. Click any connection line to delete it</p>
                    </TooltipContent>
                  </Tooltip>
                </TooltipProvider>
              </div>
              <div className="flex gap-2">
                <Button variant="outline" size="sm" onClick={handleClearCanvas}>
                  <Trash2 className="mr-2 h-4 w-4" />
                  Clear Canvas
                </Button>
                <Button variant="outline" size="sm" onClick={handleExportJourney}>
                  <Download className="mr-2 h-4 w-4" />
                  Export
                </Button>
                <Button size="sm" onClick={handleSaveJourney}>
                  <Save className="mr-2 h-4 w-4" />
                  Save Journey
                </Button>
              </div>
            </div>

            <Card>
              <CardHeader className="pb-0">
                <CardTitle>Visual Canvas</CardTitle>
                <CardDescription>
                  Drag content from the library above. To connect items, click and drag from the dots around each box.
                </CardDescription>
              </CardHeader>
              <CardContent className="pt-6">
                <Canvas nodes={journeyMap.nodes} connections={journeyMap.connections} journeyTitle={journeyMap.title} onAddNode={handleAddNode} onMoveNode={handleMoveNode} onRemoveNode={handleRemoveNode} onConnect={handleConnect} onRemoveConnection={handleRemoveConnection} onTitleChange={handleTitleChange} />
              </CardContent>
            </Card>
          </div>
        </div>
      </div>
    </div>;
};

export default ContentJourneyPlanner;