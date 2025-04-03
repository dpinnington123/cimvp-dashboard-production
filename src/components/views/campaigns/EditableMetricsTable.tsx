
import React, { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import { Button } from "@/components/ui/button";
import { demoData } from "@/assets/avatars";
import { Edit, Save, X, Plus, Trash2 } from "lucide-react";
import { useToast } from "@/components/ui/use-toast";

interface MetricData {
  id: number;
  title: string;
  value: number;
  change: number;
  unit: string;
  format: string;
}

interface PerformanceData {
  month: string;
  social: number;
  email: number;
  ads: number;
}

interface CampaignData {
  id: number;
  name: string;
  status: string;
  budget: number;
  spent: number;
  conversions: number;
  roi: number;
}

const EditableMetricsTable: React.FC = () => {
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState<string>("kpis");
  const [kpiData, setKpiData] = useState<MetricData[]>([...demoData.kpis]);
  const [performanceData, setPerformanceData] = useState<PerformanceData[]>([...demoData.performanceData]);
  const [campaignData, setCampaignData] = useState<CampaignData[]>([...demoData.campaigns]);
  const [editingId, setEditingId] = useState<number | null>(null);
  const [editedItem, setEditedItem] = useState<any>(null);

  const startEditing = (id: number, item: any) => {
    setEditingId(id);
    setEditedItem({...item});
  };

  const cancelEditing = () => {
    setEditingId(null);
    setEditedItem(null);
  };

  const saveChanges = () => {
    if (!editedItem) return;
    
    if (activeTab === "kpis") {
      setKpiData(kpiData.map(item => item.id === editingId ? {...editedItem} : item));
    } else if (activeTab === "performance") {
      setPerformanceData(performanceData.map((item, i) => i === editingId ? {...editedItem} : item));
    } else if (activeTab === "campaigns") {
      setCampaignData(campaignData.map(item => item.id === editingId ? {...editedItem} : item));
    }
    
    toast({
      title: "Changes saved",
      description: "Your edits have been saved successfully.",
    });
    
    setEditingId(null);
    setEditedItem(null);
  };

  const handleInputChange = (field: string, value: string | number) => {
    if (!editedItem) return;
    
    setEditedItem({
      ...editedItem,
      [field]: value
    });
  };

  const addNewRow = () => {
    if (activeTab === "kpis") {
      const newId = Math.max(...kpiData.map(item => item.id)) + 1;
      const newItem = { 
        id: newId, 
        title: "New Metric", 
        value: 0, 
        change: 0, 
        unit: "%", 
        format: "percent" 
      };
      setKpiData([...kpiData, newItem]);
      startEditing(newId, newItem);
    } else if (activeTab === "performance") {
      const newId = performanceData.length;
      const newItem = { 
        month: "New", 
        social: 0, 
        email: 0, 
        ads: 0 
      };
      setPerformanceData([...performanceData, newItem]);
      startEditing(newId, newItem);
    } else if (activeTab === "campaigns") {
      const newId = Math.max(...campaignData.map(item => item.id)) + 1;
      const newItem = { 
        id: newId, 
        name: "New Campaign", 
        status: "Scheduled", 
        budget: 0, 
        spent: 0, 
        conversions: 0, 
        roi: 0 
      };
      setCampaignData([...campaignData, newItem]);
      startEditing(newId, newItem);
    }
  };

  const deleteRow = (id: number) => {
    if (activeTab === "kpis") {
      setKpiData(kpiData.filter(item => item.id !== id));
    } else if (activeTab === "performance") {
      setPerformanceData(performanceData.filter((_, i) => i !== id));
    } else if (activeTab === "campaigns") {
      setCampaignData(campaignData.filter(item => item.id !== id));
    }
    
    toast({
      title: "Row deleted",
      description: "The row has been removed from the table.",
    });
  };

  const renderKpiTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Title</TableHead>
          <TableHead>Value</TableHead>
          <TableHead>Change</TableHead>
          <TableHead>Unit</TableHead>
          <TableHead>Format</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {kpiData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  value={editedItem.title} 
                  onChange={(e) => handleInputChange('title', e.target.value)} 
                />
              ) : (
                item.title
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  type="number"
                  value={editedItem.value} 
                  onChange={(e) => handleInputChange('value', parseFloat(e.target.value))} 
                />
              ) : (
                item.value
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  type="number"
                  value={editedItem.change} 
                  onChange={(e) => handleInputChange('change', parseFloat(e.target.value))} 
                />
              ) : (
                item.change
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  value={editedItem.unit} 
                  onChange={(e) => handleInputChange('unit', e.target.value)} 
                />
              ) : (
                item.unit
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  value={editedItem.format} 
                  onChange={(e) => handleInputChange('format', e.target.value)} 
                />
              ) : (
                item.format
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === item.id ? (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={saveChanges}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEditing(item.id, item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteRow(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderPerformanceTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>Month</TableHead>
          <TableHead>Social</TableHead>
          <TableHead>Email</TableHead>
          <TableHead>Ads</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {performanceData.map((item, index) => (
          <TableRow key={index}>
            <TableCell>
              {editingId === index ? (
                <Input 
                  value={editedItem.month} 
                  onChange={(e) => handleInputChange('month', e.target.value)} 
                />
              ) : (
                item.month
              )}
            </TableCell>
            <TableCell>
              {editingId === index ? (
                <Input 
                  type="number"
                  value={editedItem.social} 
                  onChange={(e) => handleInputChange('social', parseInt(e.target.value))} 
                />
              ) : (
                item.social
              )}
            </TableCell>
            <TableCell>
              {editingId === index ? (
                <Input 
                  type="number"
                  value={editedItem.email} 
                  onChange={(e) => handleInputChange('email', parseInt(e.target.value))} 
                />
              ) : (
                item.email
              )}
            </TableCell>
            <TableCell>
              {editingId === index ? (
                <Input 
                  type="number"
                  value={editedItem.ads} 
                  onChange={(e) => handleInputChange('ads', parseInt(e.target.value))} 
                />
              ) : (
                item.ads
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === index ? (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={saveChanges}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEditing(index, item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteRow(index)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  const renderCampaignsTable = () => (
    <Table>
      <TableHeader>
        <TableRow>
          <TableHead>ID</TableHead>
          <TableHead>Name</TableHead>
          <TableHead>Status</TableHead>
          <TableHead>Budget</TableHead>
          <TableHead>Spent</TableHead>
          <TableHead>Conversions</TableHead>
          <TableHead>ROI</TableHead>
          <TableHead className="text-right">Actions</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {campaignData.map((item) => (
          <TableRow key={item.id}>
            <TableCell>{item.id}</TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  value={editedItem.name} 
                  onChange={(e) => handleInputChange('name', e.target.value)} 
                />
              ) : (
                item.name
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  value={editedItem.status} 
                  onChange={(e) => handleInputChange('status', e.target.value)} 
                />
              ) : (
                item.status
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  type="number"
                  value={editedItem.budget} 
                  onChange={(e) => handleInputChange('budget', parseInt(e.target.value))} 
                />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0
                }).format(item.budget)
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  type="number"
                  value={editedItem.spent} 
                  onChange={(e) => handleInputChange('spent', parseInt(e.target.value))} 
                />
              ) : (
                new Intl.NumberFormat("en-US", {
                  style: "currency",
                  currency: "USD",
                  maximumFractionDigits: 0
                }).format(item.spent)
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  type="number"
                  value={editedItem.conversions} 
                  onChange={(e) => handleInputChange('conversions', parseInt(e.target.value))} 
                />
              ) : (
                item.conversions
              )}
            </TableCell>
            <TableCell>
              {editingId === item.id ? (
                <Input 
                  type="number"
                  step="0.1"
                  value={editedItem.roi} 
                  onChange={(e) => handleInputChange('roi', parseFloat(e.target.value))} 
                />
              ) : (
                item.roi > 0 ? (
                  <span className="font-medium text-emerald-600">{item.roi}x</span>
                ) : (
                  <span className="text-muted-foreground">-</span>
                )
              )}
            </TableCell>
            <TableCell className="text-right">
              {editingId === item.id ? (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={saveChanges}>
                    <Save className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={cancelEditing}>
                    <X className="h-4 w-4" />
                  </Button>
                </div>
              ) : (
                <div className="flex justify-end gap-2">
                  <Button size="icon" variant="ghost" onClick={() => startEditing(item.id, item)}>
                    <Edit className="h-4 w-4" />
                  </Button>
                  <Button size="icon" variant="ghost" onClick={() => deleteRow(item.id)}>
                    <Trash2 className="h-4 w-4" />
                  </Button>
                </div>
              )}
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  );

  return (
    <Card className="animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl">Data Editor</CardTitle>
        <CardDescription>
          Edit and manage raw data for the dashboard
        </CardDescription>
      </CardHeader>
      <CardContent>
        <div className="mb-4 flex items-center justify-between">
          <div className="flex gap-2">
            <Button 
              variant={activeTab === "kpis" ? "default" : "outline"} 
              onClick={() => setActiveTab("kpis")}
            >
              KPI Metrics
            </Button>
            <Button 
              variant={activeTab === "performance" ? "default" : "outline"} 
              onClick={() => setActiveTab("performance")}
            >
              Performance
            </Button>
            <Button 
              variant={activeTab === "campaigns" ? "default" : "outline"} 
              onClick={() => setActiveTab("campaigns")}
            >
              Campaigns
            </Button>
          </div>
          <Button onClick={addNewRow} size="sm">
            <Plus className="h-4 w-4 mr-2" /> Add Row
          </Button>
        </div>
        
        <div className="overflow-x-auto">
          {activeTab === "kpis" && renderKpiTable()}
          {activeTab === "performance" && renderPerformanceTable()}
          {activeTab === "campaigns" && renderCampaignsTable()}
        </div>
      </CardContent>
    </Card>
  );
};

export default EditableMetricsTable;
