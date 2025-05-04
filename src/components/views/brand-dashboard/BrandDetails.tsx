import React, { useState, useEffect } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";
import { useBrand } from "@/contexts/BrandContext";
import type { BrandObjective, BrandMessage, BrandAudience } from "@/types/brand";

export const BrandDetails = () => {
  // Use the global brand and region from context instead of local state
  const { selectedBrand, selectedRegion, getBrandData } = useBrand();
  const brandData = getBrandData();
  
  // Tags for objectives, messages, and audiences from the brand data
  const [objectiveTags, setObjectiveTags] = useState<BrandObjective[]>([]);
  const [messageTags, setMessageTags] = useState<BrandMessage[]>([]);
  const [audienceTags, setAudienceTags] = useState<BrandAudience[]>([]);

  // Load the data from the selected brand when it changes
  useEffect(() => {
    if (brandData) {
      setObjectiveTags(brandData.objectives);
      setMessageTags(brandData.messages);
      setAudienceTags(brandData.audiences);
    }
  }, [selectedBrand, brandData]);
  
  // Input states
  const [newObjectiveTag, setNewObjectiveTag] = useState("");
  const [newMessageTag, setNewMessageTag] = useState("");
  const [newAudienceTag, setNewAudienceTag] = useState("");
  
  // Tag notes states
  const [activeTagType, setActiveTagType] = useState<string | null>(null);
  const [activeTagId, setActiveTagId] = useState<string | null>(null);
  const [tagNotes, setTagNotes] = useState("");

  // Add new tag functions
  const addObjectiveTag = () => {
    if (newObjectiveTag.trim() !== "") {
      const newTag: BrandObjective = {
        id: `${selectedBrand.toLowerCase()}-obj-${Date.now()}`,
        text: newObjectiveTag,
        notes: ""
      };
      setObjectiveTags([...objectiveTags, newTag]);
      setNewObjectiveTag("");
    }
  };

  const addMessageTag = () => {
    if (newMessageTag.trim() !== "") {
      const newTag: BrandMessage = {
        id: `${selectedBrand.toLowerCase()}-msg-${Date.now()}`,
        text: newMessageTag,
        notes: ""
      };
      setMessageTags([...messageTags, newTag]);
      setNewMessageTag("");
    }
  };

  const addAudienceTag = () => {
    if (newAudienceTag.trim() !== "") {
      const newTag: BrandAudience = {
        id: `${selectedBrand.toLowerCase()}-aud-${Date.now()}`,
        text: newAudienceTag,
        notes: ""
      };
      setAudienceTags([...audienceTags, newTag]);
      setNewAudienceTag("");
    }
  };

  // Remove tag functions
  const removeObjectiveTag = (id: string) => {
    setObjectiveTags(objectiveTags.filter(tag => tag.id !== id));
    if (activeTagId === id && activeTagType === "objective") {
      setActiveTagId(null);
      setActiveTagType(null);
      setTagNotes("");
    }
  };

  const removeMessageTag = (id: string) => {
    setMessageTags(messageTags.filter(tag => tag.id !== id));
    if (activeTagId === id && activeTagType === "message") {
      setActiveTagId(null);
      setActiveTagType(null);
      setTagNotes("");
    }
  };

  const removeAudienceTag = (id: string) => {
    setAudienceTags(audienceTags.filter(tag => tag.id !== id));
    if (activeTagId === id && activeTagType === "audience") {
      setActiveTagId(null);
      setActiveTagType(null);
      setTagNotes("");
    }
  };

  // Open tag notes
  const openTagNotes = (type: string, id: string) => {
    let tag;
    if (type === "objective") {
      tag = objectiveTags.find(t => t.id === id);
    } else if (type === "message") {
      tag = messageTags.find(t => t.id === id);
    } else if (type === "audience") {
      tag = audienceTags.find(t => t.id === id);
    }
    
    if (tag) {
      setActiveTagType(type);
      setActiveTagId(id);
      setTagNotes(tag.notes);
    }
  };

  // Save tag notes
  const saveTagNotes = () => {
    if (!activeTagType || !activeTagId) return;
    
    if (activeTagType === "objective") {
      setObjectiveTags(objectiveTags.map(tag => 
        tag.id === activeTagId ? { ...tag, notes: tagNotes } : tag
      ));
    } else if (activeTagType === "message") {
      setMessageTags(messageTags.map(tag => 
        tag.id === activeTagId ? { ...tag, notes: tagNotes } : tag
      ));
    } else if (activeTagType === "audience") {
      setAudienceTags(audienceTags.map(tag => 
        tag.id === activeTagId ? { ...tag, notes: tagNotes } : tag
      ));
    }
  };

  // Handle key down for adding tags with Enter
  const handleKeyDown = (e: React.KeyboardEvent, type: string) => {
    if (e.key === 'Enter') {
      e.preventDefault();
      if (type === "objective") addObjectiveTag();
      else if (type === "message") addMessageTag();
      else if (type === "audience") addAudienceTag();
    }
  };

  return (
    <div className="bg-white rounded-lg border shadow-sm p-4 mb-6">
      <Accordion type="single" collapsible defaultValue="brand-details">
        <AccordionItem value="brand-details" className="border-none">
          <AccordionTrigger className="py-1 text-lg font-semibold">
            Brand Strategy
          </AccordionTrigger>
          <AccordionContent>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 py-2">
              {/* Display selected brand and region along with business area */}
              <div className="md:col-span-2 flex flex-col md:flex-row gap-4 mb-4">
                <div className="flex-1 p-3 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Brand</div>
                  <div className="font-medium">{brandData.profile.name}</div>
                </div>
                <div className="flex-1 p-3 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Region</div>
                  <div className="font-medium">{selectedRegion}</div>
                </div>
                <div className="flex-1 p-3 border rounded-md">
                  <div className="text-sm text-muted-foreground mb-1">Business Area</div>
                  <div className="font-medium">{brandData.profile.businessArea}</div>
                </div>
              </div>

              {/* Financial overview */}
              <div className="md:col-span-2 p-3 border rounded-md mb-4">
                <h3 className="text-sm font-medium mb-3">Financial Overview</h3>
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  <div>
                    <div className="text-sm text-muted-foreground">Current Annual Sales</div>
                    <div className="font-medium">{brandData.profile.financials.annualSales}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">Target Sales</div>
                    <div className="font-medium">{brandData.profile.financials.targetSales}</div>
                  </div>
                  <div>
                    <div className="text-sm text-muted-foreground">YoY Growth</div>
                    <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">
                      {brandData.profile.financials.growth}
                    </Badge>
                  </div>
                </div>
              </div>

              {/* Single row for objectives, messages, and audiences with tag notes to the right of audience */}
              <div className="md:col-span-2 grid md:grid-cols-4 gap-4">
                {/* Brand Objectives */}
                <Card className="p-3">
                  <CardContent className="p-0 space-y-2">
                    <Label className="text-sm">Brand Objectives</Label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {objectiveTags.map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="flex items-center gap-1 cursor-pointer hover:bg-accent px-2 py-0.5 text-xs"
                          onClick={() => openTagNotes("objective", tag.id)}
                        >
                          <Tag className="h-2.5 w-2.5" />
                          <span>{tag.text}</span>
                          <X 
                            className="h-2.5 w-2.5 ml-1 cursor-pointer hover:text-destructive" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeObjectiveTag(tag.id);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Input
                        value={newObjectiveTag}
                        onChange={(e) => setNewObjectiveTag(e.target.value)}
                        placeholder="Add new objective"
                        className="flex-1 h-7 text-sm"
                        onKeyDown={(e) => handleKeyDown(e, "objective")}
                      />
                      <Button size="sm" onClick={addObjectiveTag} variant="outline" className="h-7 px-2 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Key Messages */}
                <Card className="p-3">
                  <CardContent className="p-0 space-y-2">
                    <Label className="text-sm">Key Messages</Label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {messageTags.map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="flex items-center gap-1 cursor-pointer hover:bg-accent px-2 py-0.5 text-xs"
                          onClick={() => openTagNotes("message", tag.id)}
                        >
                          <Tag className="h-2.5 w-2.5" />
                          <span>{tag.text}</span>
                          <X 
                            className="h-2.5 w-2.5 ml-1 cursor-pointer hover:text-destructive" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeMessageTag(tag.id);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Input
                        value={newMessageTag}
                        onChange={(e) => setNewMessageTag(e.target.value)}
                        placeholder="Add new message"
                        className="flex-1 h-7 text-sm"
                        onKeyDown={(e) => handleKeyDown(e, "message")}
                      />
                      <Button size="sm" onClick={addMessageTag} variant="outline" className="h-7 px-2 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Target Audiences */}
                <Card className="p-3">
                  <CardContent className="p-0 space-y-2">
                    <Label className="text-sm">Target Audiences</Label>
                    <div className="flex flex-wrap gap-1 mb-1">
                      {audienceTags.map((tag) => (
                        <Badge 
                          key={tag.id} 
                          variant="outline" 
                          className="flex items-center gap-1 cursor-pointer hover:bg-accent px-2 py-0.5 text-xs"
                          onClick={() => openTagNotes("audience", tag.id)}
                        >
                          <Tag className="h-2.5 w-2.5" />
                          <span>{tag.text}</span>
                          <X 
                            className="h-2.5 w-2.5 ml-1 cursor-pointer hover:text-destructive" 
                            onClick={(e) => {
                              e.stopPropagation();
                              removeAudienceTag(tag.id);
                            }}
                          />
                        </Badge>
                      ))}
                    </div>
                    <div className="flex gap-1">
                      <Input
                        value={newAudienceTag}
                        onChange={(e) => setNewAudienceTag(e.target.value)}
                        placeholder="Add new audience"
                        className="flex-1 h-7 text-sm"
                        onKeyDown={(e) => handleKeyDown(e, "audience")}
                      />
                      <Button size="sm" onClick={addAudienceTag} variant="outline" className="h-7 px-2 text-xs">
                        <Plus className="h-3 w-3 mr-1" /> Add
                      </Button>
                    </div>
                  </CardContent>
                </Card>

                {/* Tag Notes Section - Moved to be next to target audience*/}
                <Card className="p-3">
                  <CardContent className="p-0 space-y-2">
                    {activeTagId ? (
                      <>
                        <Label className="text-xs">
                          Additional Details for "
                          {activeTagType === "objective" 
                            ? objectiveTags.find(tag => tag.id === activeTagId)?.text 
                            : activeTagType === "message" 
                              ? messageTags.find(tag => tag.id === activeTagId)?.text
                              : audienceTags.find(tag => tag.id === activeTagId)?.text
                          }"
                        </Label>
                        <Textarea
                          value={tagNotes}
                          onChange={(e) => setTagNotes(e.target.value)}
                          placeholder={`Add additional information about this ${activeTagType}...`}
                          rows={4}
                          className="text-sm"
                          onBlur={saveTagNotes}
                        />
                        <div className="flex justify-end">
                          <Button 
                            variant="outline" 
                            size="sm"
                            className="h-7 px-2 text-xs"
                            onClick={() => {
                              setActiveTagId(null);
                              setActiveTagType(null);
                              setTagNotes("");
                            }}
                          >
                            Done
                          </Button>
                        </div>
                      </>
                    ) : (
                      <div className="flex items-center justify-center h-full">
                        <p className="text-sm text-muted-foreground">
                          Click on any tag to add additional details
                        </p>
                      </div>
                    )}
                  </CardContent>
                </Card>
              </div>
            </div>
          </AccordionContent>
        </AccordionItem>
      </Accordion>
    </div>
  );
};
