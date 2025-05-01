import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Calendar, PlusCircle, Pencil, Save, X, Trash2, Milestone, BanknoteIcon, CalendarClock, Calendar as CalendarIcon, Globe, Mail, FileText } from "lucide-react";
import { Separator } from "@/components/ui/separator";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { 
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import { Dialog, DialogContent, DialogDescription, DialogFooter, DialogHeader, DialogTitle, DialogTrigger } from "@/components/ui/dialog";
import { 
  Collapsible,
  CollapsibleContent,
  CollapsibleTrigger,
} from "@/components/ui/collapsible";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface Campaign {
  id: string;
  title: string;
  startDate: string;
  endDate: string;
  status: string;
  objective: string;
  type: string;
  description: string;
  strategicObjective: string;
  audience: string;
  framing: string;
  customerValue: string;
  channels: string[];
  ctas: string[];
  budget?: number;
}

interface Milestone {
  id: string;
  title: string;
  date: string;
  description: string;
  status: string;
  type: string;
}

interface HygieneActivity {
  id: string;
  type: "website" | "newsletter" | "salesMaterial";
  title: string;
  frequency: string;
  lastUpdated: string;
  nextScheduled: string;
  owner: string;
  status: string;
  notes: string;
}

const MarketingCampaigns = () => {
  const [campaigns, setCampaigns] = useState<Campaign[]>([
    {
      id: "1",
      title: "Product Launch Campaign",
      startDate: "May 15, 2025",
      endDate: "June 30, 2025",
      status: "Planned",
      objective: "Market Penetration",
      type: "blue",
      description: "Full-scale product launch with press release and influencer partnerships",
      strategicObjective: "Increase Market Share",
      audience: "Urban Professionals, Tech Enthusiasts",
      framing: "Innovative Solution",
      customerValue: "Enhanced productivity and sustainability",
      channels: ["Social Media", "Email", "PR", "Events"],
      ctas: ["Pre-Order Now", "Join Launch Event", "Learn More"],
      budget: 120000
    },
    {
      id: "2",
      title: "Summer Awareness Campaign",
      startDate: "July 1, 2025",
      endDate: "August 31, 2025",
      status: "Planned",
      objective: "Brand Awareness",
      type: "purple",
      description: "Targeted advertising campaign focusing on our sustainability initiatives",
      strategicObjective: "Enhance Brand Loyalty",
      audience: "Environmentally Conscious Consumers",
      framing: "Problem-Solution",
      customerValue: "Contributing to environmental sustainability",
      channels: ["Social Media", "Display Ads", "Content Marketing"],
      ctas: ["Discover Our Impact", "Share Your Story"],
      budget: 75000
    },
    {
      id: "3",
      title: "Customer Loyalty Program",
      startDate: "September 10, 2025",
      endDate: "December 31, 2025",
      status: "Planned",
      objective: "Customer Retention",
      type: "emerald",
      description: "Launch of revised loyalty program with enhanced benefits",
      strategicObjective: "Enhance Brand Loyalty",
      audience: "Existing Customers",
      framing: "Reward-Based Engagement",
      customerValue: "Exclusive benefits and personalized offers",
      channels: ["Email", "App", "In-store"],
      ctas: ["Join Program", "Upgrade Membership", "Refer a Friend"],
      budget: 50000
    },
    {
      id: "4",
      title: "Holiday Sales Push",
      startDate: "November 1, 2025",
      endDate: "December 26, 2025",
      status: "Planned",
      objective: "Sales Growth",
      type: "blue",
      description: "Major promotional campaign for Q4 holiday shopping season",
      strategicObjective: "Drive Digital Engagement",
      audience: "Holiday Shoppers, Gift Givers",
      framing: "Seasonal Opportunity",
      customerValue: "Special holiday deals and gift ideas",
      channels: ["Email", "Social Media", "PPC", "TV"],
      ctas: ["Shop Now", "View Gift Guide", "Find Deals"],
      budget: 200000
    }
  ]);

  const [milestones, setMilestones] = useState<Milestone[]>([
    {
      id: "1",
      title: "Brand Refresh Launch",
      date: "March 10, 2025",
      description: "Complete rollout of updated brand identity across all channels",
      status: "Completed",
      type: "blue"
    },
    {
      id: "2",
      title: "1 Million Customer Milestone",
      date: "June 15, 2025",
      description: "Celebration of reaching 1 million active customers",
      status: "Planned",
      type: "purple"
    },
    {
      id: "3",
      title: "International Market Entry",
      date: "August 1, 2025",
      description: "Expansion into European markets with localized campaigns",
      status: "Planned",
      type: "emerald"
    },
    {
      id: "4",
      title: "Brand Anniversary Campaign",
      date: "October 5, 2025",
      description: "10-year anniversary celebration with special promotional events",
      status: "Planned",
      type: "amber"
    }
  ]);

  const [hygieneActivities, setHygieneActivities] = useState<HygieneActivity[]>([
    {
      id: "1",
      type: "website",
      title: "Product Landing Page",
      frequency: "Bi-weekly",
      lastUpdated: "April 2, 2025",
      nextScheduled: "April 16, 2025",
      owner: "Web Team",
      status: "On Schedule",
      notes: "Update hero section with new product imagery and messaging"
    },
    {
      id: "2",
      type: "newsletter",
      title: "Monthly Customer Newsletter",
      frequency: "Monthly",
      lastUpdated: "March 30, 2025",
      nextScheduled: "April 30, 2025",
      owner: "Content Team",
      status: "In Progress",
      notes: "Feature customer success stories and upcoming product launch"
    },
    {
      id: "3",
      type: "salesMaterial",
      title: "Product Spec Sheets",
      frequency: "Quarterly",
      lastUpdated: "March 15, 2025",
      nextScheduled: "June 15, 2025",
      owner: "Sales Enablement",
      status: "On Schedule",
      notes: "Update technical specifications and use cases"
    },
    {
      id: "4",
      type: "website",
      title: "Company Blog",
      frequency: "Weekly",
      lastUpdated: "April 7, 2025",
      nextScheduled: "April 14, 2025",
      owner: "Content Team",
      status: "On Schedule",
      notes: "Publish industry trend analysis article"
    },
    {
      id: "5",
      type: "newsletter",
      title: "Partner Program Update",
      frequency: "Quarterly",
      lastUpdated: "February 15, 2025",
      nextScheduled: "May 15, 2025",
      owner: "Partner Relations",
      status: "Planning",
      notes: "Highlight new partner incentives and program changes"
    },
    {
      id: "6",
      type: "salesMaterial",
      title: "Competitive Comparison Guide",
      frequency: "Bi-annually",
      lastUpdated: "January 10, 2025",
      nextScheduled: "July 10, 2025",
      owner: "Product Marketing",
      status: "On Schedule",
      notes: "Update with new competitor features and positioning"
    }
  ]);

  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingCampaign, setEditingCampaign] = useState<Campaign | null>(null);
  const [isAddingCampaign, setIsAddingCampaign] = useState(false);
  const [newCampaign, setNewCampaign] = useState<Campaign>({
    id: "",
    title: "New Campaign",
    startDate: "January 1, 2026",
    endDate: "January 31, 2026",
    status: "Planned",
    objective: "Strategic Objective",
    type: "blue",
    description: "Description of the campaign",
    strategicObjective: "Key Strategic Objective",
    audience: "Target Audience",
    framing: "Messaging Framing",
    customerValue: "Value Proposition",
    channels: ["Channel 1", "Channel 2"],
    ctas: ["Action 1", "Action 2"],
    budget: 0
  });

  const [editingMilestoneId, setEditingMilestoneId] = useState<string | null>(null);
  const [editingMilestone, setEditingMilestone] = useState<Milestone | null>(null);
  const [isAddingMilestone, setIsAddingMilestone] = useState(false);
  const [newMilestone, setNewMilestone] = useState<Milestone>({
    id: "",
    title: "New Milestone",
    date: "January 1, 2026",
    description: "Description of the milestone",
    status: "Planned",
    type: "blue"
  });

  const [editingHygieneId, setEditingHygieneId] = useState<string | null>(null);
  const [editingHygiene, setEditingHygiene] = useState<HygieneActivity | null>(null);
  const [isAddingHygiene, setIsAddingHygiene] = useState(false);
  const [newHygiene, setNewHygiene] = useState<HygieneActivity>({
    id: "",
    type: "website",
    title: "New Activity",
    frequency: "Monthly",
    lastUpdated: "April 1, 2025",
    nextScheduled: "May 1, 2025",
    owner: "Marketing Team",
    status: "Planned",
    notes: "Description of the activity"
  });

  const handleEdit = (campaign: Campaign) => {
    setEditingId(campaign.id);
    setEditingCampaign({...campaign});
  };

  const handleSave = () => {
    if (editingCampaign) {
      setCampaigns(campaigns.map(campaign => 
        campaign.id === editingCampaign.id ? editingCampaign : campaign
      ));
      setEditingId(null);
      setEditingCampaign(null);
    }
  };

  const handleCancel = () => {
    setEditingId(null);
    setEditingCampaign(null);
  };

  const handleDelete = (id: string) => {
    setCampaigns(campaigns.filter(campaign => campaign.id !== id));
  };

  const handleAddCampaign = () => {
    const campaignToAdd = {
      ...newCampaign,
      id: Date.now().toString(),
    };
    setCampaigns([...campaigns, campaignToAdd]);
    setIsAddingCampaign(false);
    setNewCampaign({
      id: "",
      title: "New Campaign",
      startDate: "January 1, 2026",
      endDate: "January 31, 2026",
      status: "Planned",
      objective: "Strategic Objective",
      type: "blue",
      description: "Description of the campaign",
      strategicObjective: "Key Strategic Objective",
      audience: "Target Audience",
      framing: "Messaging Framing",
      customerValue: "Value Proposition",
      channels: ["Channel 1", "Channel 2"],
      ctas: ["Action 1", "Action 2"],
      budget: 0
    });
  };

  const updateEditingField = (field: keyof Campaign, value: any) => {
    if (editingCampaign) {
      setEditingCampaign({
        ...editingCampaign,
        [field]: value
      });
    }
  };

  const updateNewCampaignField = (field: keyof Campaign, value: any) => {
    setNewCampaign({
      ...newCampaign,
      [field]: value
    });
  };

  const formatToArray = (value: string): string[] => {
    return value.split(",").map(item => item.trim()).filter(item => item !== "");
  };

  const handleEditMilestone = (milestone: Milestone) => {
    setEditingMilestoneId(milestone.id);
    setEditingMilestone({...milestone});
  };

  const handleSaveMilestone = () => {
    if (editingMilestone) {
      setMilestones(milestones.map(milestone => 
        milestone.id === editingMilestone.id ? editingMilestone : milestone
      ));
      setEditingMilestoneId(null);
      setEditingMilestone(null);
    }
  };

  const handleCancelMilestone = () => {
    setEditingMilestoneId(null);
    setEditingMilestone(null);
  };

  const handleDeleteMilestone = (id: string) => {
    setMilestones(milestones.filter(milestone => milestone.id !== id));
  };

  const handleAddMilestone = () => {
    const milestoneToAdd = {
      ...newMilestone,
      id: Date.now().toString(),
    };
    setMilestones([...milestones, milestoneToAdd]);
    setIsAddingMilestone(false);
    setNewMilestone({
      id: "",
      title: "New Milestone",
      date: "January 1, 2026",
      description: "Description of the milestone",
      status: "Planned",
      type: "blue"
    });
  };

  const updateEditingMilestoneField = (field: keyof Milestone, value: any) => {
    if (editingMilestone) {
      setEditingMilestone({
        ...editingMilestone,
        [field]: value
      });
    }
  };

  const updateNewMilestoneField = (field: keyof Milestone, value: any) => {
    setNewMilestone({
      ...newMilestone,
      [field]: value
    });
  };

  const handleEditHygiene = (activity: HygieneActivity) => {
    setEditingHygieneId(activity.id);
    setEditingHygiene({...activity});
  };

  const handleSaveHygiene = () => {
    if (editingHygiene) {
      setHygieneActivities(activities => 
        activities.map(activity => 
          activity.id === editingHygiene.id ? editingHygiene : activity
        )
      );
      setEditingHygieneId(null);
      setEditingHygiene(null);
    }
  };

  const handleCancelHygiene = () => {
    setEditingHygieneId(null);
    setEditingHygiene(null);
  };

  const handleDeleteHygiene = (id: string) => {
    setHygieneActivities(activities => activities.filter(activity => activity.id !== id));
  };

  const handleAddHygiene = () => {
    const activityToAdd = {
      ...newHygiene,
      id: Date.now().toString(),
    };
    setHygieneActivities([...hygieneActivities, activityToAdd]);
    setIsAddingHygiene(false);
    setNewHygiene({
      id: "",
      type: "website",
      title: "New Activity",
      frequency: "Monthly",
      lastUpdated: "April 1, 2025",
      nextScheduled: "May 1, 2025",
      owner: "Marketing Team",
      status: "Planned",
      notes: "Description of the activity"
    });
  };

  const updateEditingHygieneField = (field: keyof HygieneActivity, value: any) => {
    if (editingHygiene) {
      setEditingHygiene({
        ...editingHygiene,
        [field]: value
      });
    }
  };

  const updateNewHygieneField = (field: keyof HygieneActivity, value: any) => {
    setNewHygiene({
      ...newHygiene,
      [field]: value
    });
  };

  const getHygieneTypeIcon = (type: HygieneActivity["type"]) => {
    switch (type) {
      case "website":
        return <Globe className="h-4 w-4" />;
      case "newsletter":
        return <Mail className="h-4 w-4" />;
      case "salesMaterial":
        return <FileText className="h-4 w-4" />;
      default:
        return <Calendar className="h-4 w-4" />;
    }
  };

  const totalBudget = campaigns.reduce((sum, campaign) => sum + (campaign.budget || 0), 0);

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Marketing Campaigns</h2>
        <p className="text-gray-600">Key activities planned to achieve our strategic objectives</p>
      </div>

      <Tabs defaultValue="campaigns" className="w-full">
        <TabsList className="mb-4">
          <TabsTrigger value="campaigns">Campaigns</TabsTrigger>
          <TabsTrigger value="milestones">Milestones</TabsTrigger>
          <TabsTrigger value="hygiene">Hygiene Activities</TabsTrigger>
          <TabsTrigger value="alignment">Alignment</TabsTrigger>
        </TabsList>
        
        <TabsContent value="campaigns" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Brand Campaigns</CardTitle>
                <CardDescription>Scheduling and coordination of marketing initiatives</CardDescription>
              </div>
              <Dialog open={isAddingCampaign} onOpenChange={setIsAddingCampaign}>
                <DialogTrigger asChild>
                  <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700">
                    <PlusCircle className="h-4 w-4" />
                    Add Campaign
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-2xl max-h-[90vh] overflow-y-auto">
                  <DialogHeader>
                    <DialogTitle>Add New Campaign</DialogTitle>
                    <DialogDescription>Create a new marketing campaign</DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-1 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Campaign Title</label>
                        <Input 
                          value={newCampaign.title} 
                          onChange={(e) => updateNewCampaignField("title", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Start Date</label>
                        <Input 
                          value={newCampaign.startDate} 
                          onChange={(e) => updateNewCampaignField("startDate", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">End Date</label>
                        <Input 
                          value={newCampaign.endDate} 
                          onChange={(e) => updateNewCampaignField("endDate", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Objective</label>
                        <Input 
                          value={newCampaign.objective} 
                          onChange={(e) => updateNewCampaignField("objective", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Strategic Objective</label>
                        <Input 
                          value={newCampaign.strategicObjective} 
                          onChange={(e) => updateNewCampaignField("strategicObjective", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Type Color (blue, purple, emerald, amber)</label>
                        <Input 
                          value={newCampaign.type} 
                          onChange={(e) => updateNewCampaignField("type", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Target Audience</label>
                        <Input 
                          value={newCampaign.audience} 
                          onChange={(e) => updateNewCampaignField("audience", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea 
                        value={newCampaign.description} 
                        onChange={(e) => updateNewCampaignField("description", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Framing</label>
                        <Input 
                          value={newCampaign.framing} 
                          onChange={(e) => updateNewCampaignField("framing", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Customer Value</label>
                        <Input 
                          value={newCampaign.customerValue} 
                          onChange={(e) => updateNewCampaignField("customerValue", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Channels (comma-separated)</label>
                        <Input 
                          value={newCampaign.channels.join(", ")} 
                          onChange={(e) => updateNewCampaignField("channels", formatToArray(e.target.value))}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Budget ($)</label>
                        <Input 
                          type="number"
                          value={newCampaign.budget || 0} 
                          onChange={(e) => updateNewCampaignField("budget", Number(e.target.value))}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Calls to Action (comma-separated)</label>
                      <Input 
                        value={newCampaign.ctas.join(", ")} 
                        onChange={(e) => updateNewCampaignField("ctas", formatToArray(e.target.value))}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingCampaign(false)}>Cancel</Button>
                    <Button onClick={handleAddCampaign} className="bg-emerald-600 hover:bg-emerald-700">Add Campaign</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-6">
                  {campaigns.map((campaign, index) => (
                    <div className="flex" key={campaign.id}>
                      <div className="relative flex flex-col items-center mr-4">
                        <div className={`absolute h-${index < campaigns.length - 1 ? 'full' : '1/2'} w-px bg-gray-200 left-1/2 transform -translate-x-1/2`}></div>
                        <div className="rounded-full h-10 w-10 bg-emerald-100 border-4 border-white flex items-center justify-center z-10">
                          <Calendar className="h-4 w-4 text-emerald-600" />
                        </div>
                      </div>
                      
                      {editingId === campaign.id ? (
                        <Card className="w-full">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Input
                                  className="text-lg font-bold mb-1"
                                  value={editingCampaign?.title || ""}
                                  onChange={(e) => updateEditingField("title", e.target.value)}
                                />
                                <div className="flex gap-2 items-center">
                                  <div className="flex items-center space-x-2">
                                    <CalendarIcon className="h-4 w-4 text-gray-500" />
                                    <Input
                                      className="text-sm w-32"
                                      value={editingCampaign?.startDate || ""}
                                      onChange={(e) => updateEditingField("startDate", e.target.value)}
                                      placeholder="Start Date"
                                    />
                                    <span>to</span>
                                    <Input
                                      className="text-sm w-32"
                                      value={editingCampaign?.endDate || ""}
                                      onChange={(e) => updateEditingField("endDate", e.target.value)}
                                      placeholder="End Date"
                                    />
                                  </div>
                                  <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">{editingCampaign?.status || ""}</Badge>
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  className={`w-44 bg-${editingCampaign?.type}-100 text-${editingCampaign?.type}-800 text-center`}
                                  value={editingCampaign?.objective || ""}
                                  onChange={(e) => updateEditingField("objective", e.target.value)}
                                />
                                <Button variant="ghost" size="sm" onClick={handleCancel}>
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleSave}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                <Input
                                  className="w-40 bg-transparent border-none p-0 h-6 focus:ring-0"
                                  value={editingCampaign?.audience || ""}
                                  onChange={(e) => updateEditingField("audience", e.target.value)}
                                  placeholder="Target Audience"
                                />
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                <Input
                                  className="w-40 bg-transparent border-none p-0 h-6 focus:ring-0"
                                  value={editingCampaign?.strategicObjective || ""}
                                  onChange={(e) => updateEditingField("strategicObjective", e.target.value)}
                                  placeholder="Strategic Objective"
                                />
                              </Badge>
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                <span className="mr-1">Budget:</span>
                                <Input
                                  type="number"
                                  className="w-24 bg-transparent border-none p-0 h-6 focus:ring-0"
                                  value={editingCampaign?.budget || 0}
                                  onChange={(e) => updateEditingField("budget", Number(e.target.value))}
                                />
                              </Badge>
                            </div>
                            
                            <Textarea
                              className="text-sm text-gray-600 mb-4"
                              value={editingCampaign?.description || ""}
                              onChange={(e) => updateEditingField("description", e.target.value)}
                            />
                            
                            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                              <div>
                                <p className="font-medium mb-1 text-gray-700">Framing:</p>
                                <Input
                                  value={editingCampaign?.framing || ""}
                                  onChange={(e) => updateEditingField("framing", e.target.value)}
                                  className="text-gray-600"
                                />
                              </div>
                              
                              <div>
                                <p className="font-medium mb-1 text-gray-700">Customer Value:</p>
                                <Input
                                  value={editingCampaign?.customerValue || ""}
                                  onChange={(e) => updateEditingField("customerValue", e.target.value)}
                                  className="text-gray-600"
                                />
                              </div>
                              
                              <div>
                                <p className="font-medium mb-1 text-gray-700">Channels (comma-separated):</p>
                                <Input
                                  value={editingCampaign?.channels.join(", ") || ""}
                                  onChange={(e) => updateEditingField("channels", formatToArray(e.target.value))}
                                  className="text-gray-600"
                                />
                              </div>
                              
                              <div>
                                <p className="font-medium mb-1 text-gray-700">Calls to Action (comma-separated):</p>
                                <Input
                                  value={editingCampaign?.ctas.join(", ") || ""}
                                  onChange={(e) => updateEditingField("ctas", formatToArray(e.target.value))}
                                  className="text-gray-600"
                                />
                              </div>
                            </div>
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="w-full">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{campaign.title}</CardTitle>
                                <CardDescription className="text-sm mt-1 flex gap-2 items-center">
                                  <span className="flex items-center">
                                    <CalendarIcon className="h-4 w-4 mr-1 text-gray-500" />
                                    {campaign.startDate} to {campaign.endDate}
                                  </span>
                                  <Badge variant="outline" className="text-xs bg-amber-100 text-amber-800 border-amber-200">{campaign.status}</Badge>
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Badge className={`bg-${campaign.type}-100 text-${campaign.type}-800`}>{campaign.objective}</Badge>
                                <Button variant="ghost" size="sm" onClick={() => handleEdit(campaign)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Campaign</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this campaign? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDelete(campaign.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <div className="flex flex-wrap gap-2 mb-4">
                              <Badge variant="secondary" className="bg-gray-100 text-gray-800">
                                Audience: {campaign.audience}
                              </Badge>
                              <Badge variant="secondary" className="bg-blue-100 text-blue-800">
                                Strategic: {campaign.strategicObjective}
                              </Badge>
                              <Badge variant="secondary" className="bg-emerald-100 text-emerald-800">
                                Budget: ${(campaign.budget || 0).toLocaleString()}
                              </Badge>
                            </div>
                            
                            <Collapsible className="w-full">
                              <div className="flex justify-between items-center">
                                <p className="text-sm text-gray-600 mb-2">
                                  {campaign.description}
                                </p>
                                <CollapsibleTrigger asChild>
                                  <Button variant="ghost" size="sm">
                                    <span className="sr-only">Toggle details</span>
                                    <CalendarClock className="h-4 w-4" />
                                  </Button>
                                </CollapsibleTrigger>
                              </div>
                              
                              <CollapsibleContent>
                                <div className="pt-2">
                                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4 text-sm">
                                    <div>
                                      <p className="font-medium mb-1 text-gray-700">Framing:</p>
                                      <p className="text-gray-600">{campaign.framing}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-medium mb-1 text-gray-700">Customer Value:</p>
                                      <p className="text-gray-600">{campaign.customerValue}</p>
                                    </div>
                                    
                                    <div>
                                      <p className="font-medium mb-1 text-gray-700">Channels:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {campaign.channels.map((channel) => (
                                          <Badge key={channel} variant="outline" className="bg-gray-100">{channel}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                    
                                    <div>
                                      <p className="font-medium mb-1 text-gray-700">Calls to Action:</p>
                                      <div className="flex flex-wrap gap-1">
                                        {campaign.ctas.map((cta) => (
                                          <Badge key={cta} variant="outline" className="bg-gray-100">{cta}</Badge>
                                        ))}
                                      </div>
                                    </div>
                                  </div>
                                </div>
                              </CollapsibleContent>
                            </Collapsible>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="milestones" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Key Brand Milestones</CardTitle>
                <CardDescription>Important achievements and brand moments</CardDescription>
              </div>
              <Dialog open={isAddingMilestone} onOpenChange={setIsAddingMilestone}>
                <DialogTrigger asChild>
                  <Button className="gap-1 bg-purple-600 hover:bg-purple-700">
                    <PlusCircle className="h-4 w-4" />
                    Add Milestone
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Milestone</DialogTitle>
                    <DialogDescription>Create a new brand milestone</DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Milestone Title</label>
                        <Input 
                          value={newMilestone.title} 
                          onChange={(e) => updateNewMilestoneField("title", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Date</label>
                        <Input 
                          value={newMilestone.date} 
                          onChange={(e) => updateNewMilestoneField("date", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Description</label>
                      <Textarea 
                        value={newMilestone.description} 
                        onChange={(e) => updateNewMilestoneField("description", e.target.value)}
                      />
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Status</label>
                        <Input 
                          value={newMilestone.status} 
                          onChange={(e) => updateNewMilestoneField("status", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Type Color (blue, purple, emerald, amber)</label>
                        <Input 
                          value={newMilestone.type} 
                          onChange={(e) => updateNewMilestoneField("type", e.target.value)}
                        />
                      </div>
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingMilestone(false)}>Cancel</Button>
                    <Button onClick={handleAddMilestone} className="bg-purple-600 hover:bg-purple-700">Add Milestone</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-6">
                  {milestones.map((milestone, index) => (
                    <div className="flex" key={milestone.id}>
                      <div className="relative flex flex-col items-center mr-4">
                        <div className={`absolute h-${index < milestones.length - 1 ? 'full' : '1/2'} w-px bg-gray-200 left-1/2 transform -translate-x-1/2`}></div>
                        <div className="rounded-full h-10 w-10 bg-purple-100 border-4 border-white flex items-center justify-center z-10">
                          <Milestone className="h-4 w-4 text-purple-600" />
                        </div>
                      </div>
                      
                      {editingMilestoneId === milestone.id ? (
                        <Card className="w-full">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <Input
                                  className="text-lg font-bold mb-1"
                                  value={editingMilestone?.title || ""}
                                  onChange={(e) => updateEditingMilestoneField("title", e.target.value)}
                                />
                                <div className="flex gap-2 items-center">
                                  <Input
                                    className="text-sm w-32"
                                    value={editingMilestone?.date || ""}
                                    onChange={(e) => updateEditingMilestoneField("date", e.target.value)}
                                  />
                                  <Input
                                    className="text-sm w-32"
                                    value={editingMilestone?.status || ""}
                                    onChange={(e) => updateEditingMilestoneField("status", e.target.value)}
                                  />
                                </div>
                              </div>
                              <div className="flex gap-2">
                                <Input
                                  className={`w-32`}
                                  placeholder="Color type"
                                  value={editingMilestone?.type || ""}
                                  onChange={(e) => updateEditingMilestoneField("type", e.target.value)}
                                />
                                <Button variant="ghost" size="sm" onClick={handleCancelMilestone}>
                                  <X className="h-4 w-4" />
                                </Button>
                                <Button variant="ghost" size="sm" onClick={handleSaveMilestone}>
                                  <Save className="h-4 w-4" />
                                </Button>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <Textarea
                              className="text-sm text-gray-600 mb-4"
                              value={editingMilestone?.description || ""}
                              onChange={(e) => updateEditingMilestoneField("description", e.target.value)}
                            />
                          </CardContent>
                        </Card>
                      ) : (
                        <Card className="w-full">
                          <CardHeader className="pb-4">
                            <div className="flex justify-between items-start">
                              <div>
                                <CardTitle>{milestone.title}</CardTitle>
                                <CardDescription className="text-sm mt-1 flex gap-2 items-center">
                                  <span>{milestone.date}</span>
                                  <Badge variant="outline" className={`bg-${milestone.type}-100 text-${milestone.type}-800 border-${milestone.type}-200`}>
                                    {milestone.status}
                                  </Badge>
                                </CardDescription>
                              </div>
                              <div className="flex items-center gap-2">
                                <Button variant="ghost" size="sm" onClick={() => handleEditMilestone(milestone)}>
                                  <Pencil className="h-4 w-4" />
                                </Button>
                                <AlertDialog>
                                  <AlertDialogTrigger asChild>
                                    <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                      <Trash2 className="h-4 w-4" />
                                    </Button>
                                  </AlertDialogTrigger>
                                  <AlertDialogContent>
                                    <AlertDialogHeader>
                                      <AlertDialogTitle>Delete Milestone</AlertDialogTitle>
                                      <AlertDialogDescription>
                                        Are you sure you want to delete this milestone? This action cannot be undone.
                                      </AlertDialogDescription>
                                    </AlertDialogHeader>
                                    <AlertDialogFooter>
                                      <AlertDialogCancel>Cancel</AlertDialogCancel>
                                      <AlertDialogAction 
                                        onClick={() => handleDeleteMilestone(milestone.id)}
                                        className="bg-red-500 hover:bg-red-600"
                                      >
                                        Delete
                                      </AlertDialogAction>
                                    </AlertDialogFooter>
                                  </AlertDialogContent>
                                </AlertDialog>
                              </div>
                            </div>
                          </CardHeader>
                          <CardContent className="pt-0">
                            <p className="text-sm text-gray-600">
                              {milestone.description}
                            </p>
                          </CardContent>
                        </Card>
                      )}
                    </div>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="hygiene" className="space-y-6">
          <Card>
            <CardHeader className="flex flex-row items-center justify-between">
              <div>
                <CardTitle>Marketing Hygiene Activities</CardTitle>
                <CardDescription>Routine marketing activities that maintain brand presence</CardDescription>
              </div>
              <Dialog open={isAddingHygiene} onOpenChange={setIsAddingHygiene}>
                <DialogTrigger asChild>
                  <Button className="gap-1 bg-blue-600 hover:bg-blue-700">
                    <PlusCircle className="h-4 w-4" />
                    Add Activity
                  </Button>
                </DialogTrigger>
                <DialogContent className="max-w-lg">
                  <DialogHeader>
                    <DialogTitle>Add New Hygiene Activity</DialogTitle>
                    <DialogDescription>Create a new recurring marketing activity</DialogDescription>
                  </DialogHeader>
                  
                  <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Activity Title</label>
                        <Input 
                          value={newHygiene.title} 
                          onChange={(e) => updateNewHygieneField("title", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Activity Type</label>
                        <select 
                          className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                          value={newHygiene.type}
                          onChange={(e) => updateNewHygieneField("type", e.target.value as HygieneActivity["type"])}
                        >
                          <option value="website">Website</option>
                          <option value="newsletter">Newsletter</option>
                          <option value="salesMaterial">Sales Material</option>
                        </select>
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Frequency</label>
                        <Input 
                          value={newHygiene.frequency} 
                          onChange={(e) => updateNewHygieneField("frequency", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Owner</label>
                        <Input 
                          value={newHygiene.owner} 
                          onChange={(e) => updateNewHygieneField("owner", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div className="grid grid-cols-2 gap-4">
                      <div>
                        <label className="text-sm font-medium mb-1 block">Last Updated</label>
                        <Input 
                          value={newHygiene.lastUpdated} 
                          onChange={(e) => updateNewHygieneField("lastUpdated", e.target.value)}
                        />
                      </div>
                      <div>
                        <label className="text-sm font-medium mb-1 block">Next Scheduled</label>
                        <Input 
                          value={newHygiene.nextScheduled} 
                          onChange={(e) => updateNewHygieneField("nextScheduled", e.target.value)}
                        />
                      </div>
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Status</label>
                      <Input 
                        value={newHygiene.status} 
                        onChange={(e) => updateNewHygieneField("status", e.target.value)}
                      />
                    </div>
                    
                    <div>
                      <label className="text-sm font-medium mb-1 block">Notes</label>
                      <Textarea 
                        value={newHygiene.notes} 
                        onChange={(e) => updateNewHygieneField("notes", e.target.value)}
                      />
                    </div>
                  </div>
                  
                  <DialogFooter>
                    <Button variant="outline" onClick={() => setIsAddingHygiene(false)}>Cancel</Button>
                    <Button onClick={handleAddHygiene} className="bg-blue-600 hover:bg-blue-700">Add Activity</Button>
                  </DialogFooter>
                </DialogContent>
              </Dialog>
            </CardHeader>
            <CardContent>
              <div className="space-y-6">
                <div className="flex flex-col space-y-4">
                  {hygieneActivities.map((activity) => (
                    <Card key={activity.id} className="overflow-hidden">
                      {editingHygieneId === activity.id ? (
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div className="w-full">
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Activity Title</label>
                                  <Input
                                    value={editingHygiene?.title || ""}
                                    onChange={(e) => updateEditingHygieneField("title", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Activity Type</label>
                                  <select 
                                    className="w-full rounded-md border border-input bg-background px-3 py-2 text-sm"
                                    value={editingHygiene?.type || "website"}
                                    onChange={(e) => updateEditingHygieneField("type", e.target.value as HygieneActivity["type"])}
                                  >
                                    <option value="website">Website</option>
                                    <option value="newsletter">Newsletter</option>
                                    <option value="salesMaterial">Sales Material</option>
                                  </select>
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Frequency</label>
                                  <Input 
                                    value={editingHygiene?.frequency || ""} 
                                    onChange={(e) => updateEditingHygieneField("frequency", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Owner</label>
                                  <Input 
                                    value={editingHygiene?.owner || ""} 
                                    onChange={(e) => updateEditingHygieneField("owner", e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="grid grid-cols-2 gap-4 mb-4">
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Last Updated</label>
                                  <Input 
                                    value={editingHygiene?.lastUpdated || ""} 
                                    onChange={(e) => updateEditingHygieneField("lastUpdated", e.target.value)}
                                  />
                                </div>
                                <div>
                                  <label className="text-sm font-medium mb-1 block">Next Scheduled</label>
                                  <Input 
                                    value={editingHygiene?.nextScheduled || ""} 
                                    onChange={(e) => updateEditingHygieneField("nextScheduled", e.target.value)}
                                  />
                                </div>
                              </div>
                              
                              <div className="mb-4">
                                <label className="text-sm font-medium mb-1 block">Status</label>
                                <Input 
                                  value={editingHygiene?.status || ""} 
                                  onChange={(e) => updateEditingHygieneField("status", e.target.value)}
                                />
                              </div>
                              
                              <div>
                                <label className="text-sm font-medium mb-1 block">Notes</label>
                                <Textarea 
                                  value={editingHygiene?.notes || ""} 
                                  onChange={(e) => updateEditingHygieneField("notes", e.target.value)}
                                />
                              </div>
                            </div>
                          </div>
                          
                          <div className="flex justify-end gap-2">
                            <Button variant="outline" onClick={handleCancelHygiene}>
                              Cancel
                            </Button>
                            <Button className="bg-blue-600 hover:bg-blue-700" onClick={handleSaveHygiene}>
                              Save Changes
                            </Button>
                          </div>
                        </div>
                      ) : (
                        <div className="p-6">
                          <div className="flex justify-between items-start mb-4">
                            <div>
                              <div className="flex items-center gap-2 mb-1">
                                <div className={`p-1.5 rounded-full ${
                                  activity.type === "website" ? "bg-sky-100 text-sky-600" :
                                  activity.type === "newsletter" ? "bg-purple-100 text-purple-600" :
                                  "bg-emerald-100 text-emerald-600"
                                }`}>
                                  {getHygieneTypeIcon(activity.type)}
                                </div>
                                <h3 className="text-lg font-semibold">{activity.title}</h3>
                                <Badge className={`ml-2 ${
                                  activity.type === "website" ? "bg-sky-100 text-sky-800" :
                                  activity.type === "newsletter" ? "bg-purple-100 text-purple-800" :
                                  "bg-emerald-100 text-emerald-800"
                                }`}>
                                  {activity.type === "website" ? "Website" :
                                   activity.type === "newsletter" ? "Newsletter" :
                                   "Sales Material"}
                                </Badge>
                              </div>
                              <div className="flex flex-wrap items-center gap-x-4 gap-y-2 text-sm text-gray-600 mt-2">
                                <span className="flex items-center">
                                  <span className="font-medium mr-1">Frequency:</span> {activity.frequency}
                                </span>
                                <span className="flex items-center">
                                  <span className="font-medium mr-1">Owner:</span> {activity.owner}
                                </span>
                                <span className="flex items-center">
                                  <span className="font-medium mr-1">Last:</span> {activity.lastUpdated}
                                </span>
                                <span className="flex items-center">
                                  <span className="font-medium mr-1">Next:</span> {activity.nextScheduled}
                                </span>
                                <Badge variant="outline" className="ml-2">
                                  {activity.status}
                                </Badge>
                              </div>
                            </div>
                            <div className="flex items-center gap-2">
                              <Button variant="ghost" size="sm" onClick={() => handleEditHygiene(activity)}>
                                <Pencil className="h-4 w-4" />
                              </Button>
                              <AlertDialog>
                                <AlertDialogTrigger asChild>
                                  <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                                    <Trash2 className="h-4 w-4" />
                                  </Button>
                                </AlertDialogTrigger>
                                <AlertDialogContent>
                                  <AlertDialogHeader>
                                    <AlertDialogTitle>Delete Activity</AlertDialogTitle>
                                    <AlertDialogDescription>
                                      Are you sure you want to delete this hygiene activity? This action cannot be undone.
                                    </AlertDialogDescription>
                                  </AlertDialogHeader>
                                  <AlertDialogFooter>
                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                    <AlertDialogAction 
                                      onClick={() => handleDeleteHygiene(activity.id)}
                                      className="bg-red-500 hover:bg-red-600"
                                    >
                                      Delete
                                    </AlertDialogAction>
                                  </AlertDialogFooter>
                                </AlertDialogContent>
                              </AlertDialog>
                            </div>
                          </div>
                          
                          <Separator className="my-4" />
                          
                          <div className="text-sm text-gray-600">
                            <p>{activity.notes}</p>
                          </div>
                        </div>
                      )}
                    </Card>
                  ))}
                </div>
              </div>
            </CardContent>
          </Card>
        </TabsContent>
        
        <TabsContent value="alignment" className="space-y-6">
          <Card>
            <CardHeader>
              <CardTitle>Campaign-Objective Alignment</CardTitle>
              <CardDescription>How each campaign contributes to our strategic goals</CardDescription>
            </CardHeader>
            <CardContent>
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Campaign</TableHead>
                    <TableHead className="w-1/4">Objective</TableHead>
                    <TableHead className="w-1/4">KPI Impact</TableHead>
                    <TableHead className="w-1/4">Timeline</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  <TableRow>
                    <TableCell className="font-medium">Product Launch Campaign</TableCell>
                    <TableCell>Market Penetration</TableCell>
                    <TableCell>Market Share (+2%), New Customer Acquisition (+5K)</TableCell>
                    <TableCell>Q2 2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Summer Awareness Campaign</TableCell>
                    <TableCell>Brand Awareness</TableCell>
                    <TableCell>Website Traffic (+15%), Social Engagement (+5%)</TableCell>
                    <TableCell>Q3 2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Customer Loyalty Program</TableCell>
                    <TableCell>Customer Retention</TableCell>
                    <TableCell>Retention Rate (+4%), Repeat Purchase Rate (+7%)</TableCell>
                    <TableCell>Q3 2025</TableCell>
                  </TableRow>
                  <TableRow>
                    <TableCell className="font-medium">Holiday Sales Push</TableCell>
                    <TableCell>Sales Growth</TableCell>
                    <TableCell>Revenue (+20% YoY for Q4), Market Share (+1.5%)</TableCell>
                    <TableCell>Q4 2025</TableCell>
                  </TableRow>
                </TableBody>
              </Table>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
};

export default MarketingCampaigns;
