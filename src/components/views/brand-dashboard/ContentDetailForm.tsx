import React, { useState } from "react";
import { SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { AlertDialog, AlertDialogAction, AlertDialogCancel, 
  AlertDialogContent, AlertDialogDescription, AlertDialogFooter, 
  AlertDialogHeader, AlertDialogTitle, AlertDialogTrigger } from "@/components/ui/alert-dialog";
import { useToast } from "@/hooks/use-toast";
import { FileText, Trash2, BarChart3 } from "lucide-react";

interface ContentItem {
  id: string;
  name: string;
  campaign: string;
  format: string;
  type: "hero" | "driver";
  status: "draft" | "live";
  scores: {
    overall: number;
    strategic: number;
    customer: number;
    execution: number;
  };
}

interface ContentDetailFormProps {
  content: ContentItem;
  onClose: () => void;
}

export function ContentDetailForm({ content, onClose }: ContentDetailFormProps) {
  const [activeTab, setActiveTab] = useState("details");
  const [contentData, setContentData] = useState<ContentItem>(content);
  const { toast } = useToast();
  
  const handleInputChange = (e: React.ChangeEvent<HTMLInputElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setContentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSelectChange = (name: string, value: string) => {
    setContentData((prev) => ({
      ...prev,
      [name]: value,
    }));
  };

  const handleSave = () => {
    // In a real app, you would save the data to your backend here
    toast({
      title: "Content updated",
      description: `${contentData.name} has been updated successfully`,
    });
    onClose();
  };

  const handleDelete = () => {
    // In a real app, you would delete the content from your backend here
    toast({
      title: "Content deleted",
      description: `${contentData.name} has been deleted successfully`,
      variant: "destructive",
    });
    onClose();
  };

  const getScoreColor = (score: number) => {
    if (score >= 85) return "text-green-600";
    if (score >= 70) return "text-blue-600";
    if (score >= 50) return "text-amber-600";
    return "text-red-600";
  };

  return (
    <div className="h-full flex flex-col">
      <SheetHeader className="mb-4">
        <SheetTitle className="text-xl">Content Details</SheetTitle>
        <SheetDescription>
          View and edit content information
        </SheetDescription>
      </SheetHeader>

      <Tabs value={activeTab} onValueChange={setActiveTab} className="flex-1">
        <TabsList className="grid grid-cols-2 mb-4">
          <TabsTrigger value="details" className="flex items-center gap-2">
            <FileText className="h-4 w-4" />
            Details
          </TabsTrigger>
          <TabsTrigger value="report" className="flex items-center gap-2">
            <BarChart3 className="h-4 w-4" />
            Performance Report
          </TabsTrigger>
        </TabsList>

        <TabsContent value="details" className="flex-1 space-y-4">
          <div className="grid gap-4">
            <div className="grid gap-2">
              <Label htmlFor="name">Content Name</Label>
              <Input
                id="name"
                name="name"
                value={contentData.name}
                onChange={handleInputChange}
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="campaign">Campaign</Label>
              <Input
                id="campaign"
                name="campaign"
                value={contentData.campaign}
                onChange={handleInputChange}
                readOnly
                className="bg-gray-50"
              />
            </div>

            <div className="grid gap-2">
              <Label htmlFor="format">Format</Label>
              <Select
                value={contentData.format}
                onValueChange={(value) => handleSelectChange("format", value)}
              >
                <SelectTrigger id="format">
                  <SelectValue placeholder="Select format" />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="Video">Video</SelectItem>
                  <SelectItem value="Social Media">Social Media</SelectItem>
                  <SelectItem value="Content">Content</SelectItem>
                  <SelectItem value="Email">Email</SelectItem>
                  <SelectItem value="Display">Display</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="grid grid-cols-2 gap-4">
              <div className="grid gap-2">
                <Label htmlFor="type">Type</Label>
                <Select
                  value={contentData.type}
                  onValueChange={(value) => handleSelectChange("type", value as "hero" | "driver")}
                >
                  <SelectTrigger id="type">
                    <SelectValue placeholder="Select type" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="hero">Hero</SelectItem>
                    <SelectItem value="driver">Driver</SelectItem>
                  </SelectContent>
                </Select>
              </div>

              <div className="grid gap-2">
                <Label htmlFor="status">Status</Label>
                <Select
                  value={contentData.status}
                  onValueChange={(value) => handleSelectChange("status", value as "draft" | "live")}
                >
                  <SelectTrigger id="status">
                    <SelectValue placeholder="Select status" />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="draft">Draft</SelectItem>
                    <SelectItem value="live">Live</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>

            <div className="grid gap-2">
              <Label htmlFor="description">Description</Label>
              <Textarea
                id="description"
                name="description"
                placeholder="Add a description for this content..."
                rows={3}
              />
            </div>
          </div>
        </TabsContent>

        <TabsContent value="report" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Performance Scores</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-2 gap-4">
                <div className="space-y-2">
                  <div className="text-sm font-medium">Overall</div>
                  <div className={`text-3xl font-bold ${getScoreColor(contentData.scores.overall)}`}>
                    {contentData.scores.overall}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Strategic</div>
                  <div className={`text-3xl font-bold ${getScoreColor(contentData.scores.strategic)}`}>
                    {contentData.scores.strategic}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Customer</div>
                  <div className={`text-3xl font-bold ${getScoreColor(contentData.scores.customer)}`}>
                    {contentData.scores.customer}
                  </div>
                </div>
                <div className="space-y-2">
                  <div className="text-sm font-medium">Execution</div>
                  <div className={`text-3xl font-bold ${getScoreColor(contentData.scores.execution)}`}>
                    {contentData.scores.execution}
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          <Card>
            <CardHeader>
              <CardTitle>Engagement Metrics</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="text-center p-8 text-muted-foreground">
                Detailed performance metrics would be displayed here in a real application.
              </div>
            </CardContent>
          </Card>
        </TabsContent>
      </Tabs>

      <SheetFooter className="mt-6 flex items-center justify-between sm:justify-between gap-2">
        <AlertDialog>
          <AlertDialogTrigger asChild>
            <Button variant="destructive" className="flex items-center">
              <Trash2 className="mr-2 h-4 w-4" />
              Delete
            </Button>
          </AlertDialogTrigger>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This will permanently delete {contentData.name}. This action cannot be undone.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={handleDelete}>Delete</AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

        <div className="flex items-center gap-2">
          <Button variant="outline" onClick={onClose}>
            Cancel
          </Button>
          <Button onClick={handleSave}>
            Save Changes
          </Button>
        </div>
      </SheetFooter>
    </div>
  );
}
