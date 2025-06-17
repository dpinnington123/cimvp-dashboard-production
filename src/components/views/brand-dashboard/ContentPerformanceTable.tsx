import React, { useState } from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Input } from "@/components/ui/input";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { cn } from "@/lib/utils";
import { Sheet, SheetContent, SheetHeader, SheetTitle, SheetDescription, SheetFooter } from "@/components/ui/sheet";
import { ContentDetailForm } from "./ContentDetailForm";
import { Button } from "@/components/ui/button";
import { Plus } from "lucide-react";
import { useToast } from "@/hooks/use-toast";

interface ContentPerformanceItem {
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

interface ContentPerformanceTableProps {
  items: ContentPerformanceItem[];
  campaignFilter?: string;
}

export function ContentPerformanceTable({ items, campaignFilter }: ContentPerformanceTableProps) {
  const [filter, setFilter] = useState(campaignFilter || "all-campaigns");
  const [formatFilter, setFormatFilter] = useState("all-formats");
  const [typeFilter, setTypeFilter] = useState("all-types");
  const [statusFilter, setStatusFilter] = useState("all-statuses");
  const [search, setSearch] = useState("");
  const [selectedContent, setSelectedContent] = useState<ContentPerformanceItem | null>(null);
  const [isDetailOpen, setIsDetailOpen] = useState(false);
  const { toast } = useToast();

  const getScoreClass = (score: number) => {
    if (score >= 95) return "text-score-exceptional";
    if (score >= 85) return "text-score-excellent";
    if (score >= 80) return "text-score-very-good";
    if (score >= 75) return "text-score-good";
    if (score >= 70) return "text-score-above-average";
    if (score >= 60) return "text-score-average";
    if (score >= 50) return "text-score-below-average";
    if (score >= 40) return "text-score-poor";
    return "text-score-very-poor";
  };

  const filteredItems = items.filter((item) => {
    const matchesCampaign = filter === "all-campaigns" ? true : item.campaign === filter;
    const matchesFormat = formatFilter === "all-formats" ? true : item.format === formatFilter;
    const matchesType = typeFilter === "all-types" ? true : item.type === typeFilter;
    const matchesStatus = statusFilter === "all-statuses" ? true : item.status === statusFilter;
    const matchesSearch = search
      ? item.name.toLowerCase().includes(search.toLowerCase())
      : true;

    return matchesCampaign && matchesFormat && matchesType && matchesStatus && matchesSearch;
  });

  // Extract unique campaigns, formats (filter out empty strings)
  const campaigns = Array.from(new Set(items.map((item) => item.campaign))).filter(Boolean);
  const formats = Array.from(new Set(items.map((item) => item.format))).filter(Boolean);

  const handleRowClick = (item: ContentPerformanceItem) => {
    setSelectedContent(item);
    setIsDetailOpen(true);
  };

  const handleCloseDetail = () => {
    setIsDetailOpen(false);
  };

  const handleCreateNewVersion = (item: ContentPerformanceItem, e: React.MouseEvent) => {
    e.stopPropagation(); // Prevent row click event
    toast({
      title: "New Version",
      description: `Creating new version of "${item.name}"`,
    });
    // Here you would typically open a form or trigger an API call to create a new version
  };

  return (
    <div className="space-y-4">
      <div className="flex flex-col md:flex-row gap-4">
        <div className="flex-1">
          <Input
            placeholder="Search content..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full"
          />
        </div>
        <div className="grid grid-cols-2 md:grid-cols-4 gap-2">
          <Select value={filter} onValueChange={setFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Campaigns" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-campaigns">All Campaigns</SelectItem>
              {campaigns.map((campaign) => (
                <SelectItem key={campaign} value={campaign}>
                  {campaign}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={formatFilter} onValueChange={setFormatFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Formats" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-formats">All Formats</SelectItem>
              {formats.map((format) => (
                <SelectItem key={format} value={format}>
                  {format}
                </SelectItem>
              ))}
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Types" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-types">All Types</SelectItem>
              <SelectItem value="hero">Hero</SelectItem>
              <SelectItem value="driver">Driver</SelectItem>
            </SelectContent>
          </Select>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger>
              <SelectValue placeholder="All Statuses" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="all-statuses">All Statuses</SelectItem>
              <SelectItem value="draft">Draft</SelectItem>
              <SelectItem value="live">Live</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      <div className="rounded-md border overflow-hidden bg-white">
        <Table>
          <TableHeader>
            <TableRow>
              <TableHead className="w-[250px]">Content Name</TableHead>
              <TableHead>Campaign</TableHead>
              <TableHead>Format</TableHead>
              <TableHead>Type</TableHead>
              <TableHead>Status</TableHead>
              <TableHead className="text-center">Overall</TableHead>
              <TableHead className="text-center">Strategic</TableHead>
              <TableHead className="text-center">Customer</TableHead>
              <TableHead className="text-center">Execution</TableHead>
              <TableHead className="text-center">Actions</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {filteredItems.length === 0 ? (
              <TableRow>
                <TableCell colSpan={10} className="text-center h-24">
                  No content matches your filters
                </TableCell>
              </TableRow>
            ) : (
              filteredItems.map((item) => (
                <TableRow 
                  key={item.id} 
                  className="cursor-pointer hover:bg-gray-50"
                >
                  <TableCell className="font-medium" onClick={() => handleRowClick(item)}>{item.name}</TableCell>
                  <TableCell onClick={() => handleRowClick(item)}>{item.campaign}</TableCell>
                  <TableCell onClick={() => handleRowClick(item)}>{item.format}</TableCell>
                  <TableCell onClick={() => handleRowClick(item)}>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        item.type === "hero"
                          ? "bg-purple-100 text-purple-800"
                          : "bg-blue-100 text-blue-800"
                      )}
                    >
                      {item.type}
                    </span>
                  </TableCell>
                  <TableCell onClick={() => handleRowClick(item)}>
                    <span
                      className={cn(
                        "inline-flex items-center px-2.5 py-0.5 rounded-full text-xs font-medium",
                        item.status === "live"
                          ? "bg-green-100 text-green-800"
                          : "bg-amber-100 text-amber-800"
                      )}
                    >
                      {item.status}
                    </span>
                  </TableCell>
                  <TableCell className="text-center" onClick={() => handleRowClick(item)}>
                    <span className={cn("font-bold", getScoreClass(item.scores.overall))}>
                      {item.scores.overall}
                    </span>
                  </TableCell>
                  <TableCell className="text-center" onClick={() => handleRowClick(item)}>
                    <span className={cn("font-medium", getScoreClass(item.scores.strategic))}>
                      {item.scores.strategic}
                    </span>
                  </TableCell>
                  <TableCell className="text-center" onClick={() => handleRowClick(item)}>
                    <span className={cn("font-medium", getScoreClass(item.scores.customer))}>
                      {item.scores.customer}
                    </span>
                  </TableCell>
                  <TableCell className="text-center" onClick={() => handleRowClick(item)}>
                    <span className={cn("font-medium", getScoreClass(item.scores.execution))}>
                      {item.scores.execution}
                    </span>
                  </TableCell>
                  <TableCell className="text-center">
                    <Button
                      variant="outline"
                      size="sm" 
                      onClick={(e) => handleCreateNewVersion(item, e)}
                      className="text-xs"
                    >
                      <Plus className="h-3 w-3 mr-1" />
                      New Version
                    </Button>
                  </TableCell>
                </TableRow>
              ))
            )}
          </TableBody>
        </Table>
      </div>
      <div className="text-xs text-muted-foreground">
        Showing {filteredItems.length} of {items.length} content items
      </div>

      {/* Content Detail Sheet */}
      <Sheet open={isDetailOpen} onOpenChange={setIsDetailOpen}>
        <SheetContent className="w-full sm:max-w-md overflow-y-auto">
          {selectedContent && (
            <ContentDetailForm 
              content={selectedContent}
              onClose={handleCloseDetail}
            />
          )}
        </SheetContent>
      </Sheet>
    </div>
  );
}
