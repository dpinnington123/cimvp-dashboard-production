import React, { useState } from "react";
import {
  Accordion,
  AccordionContent,
  AccordionItem,
  AccordionTrigger,
} from "@/components/ui/accordion";
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Label } from "@/components/ui/label";
import { X, Plus, Tag } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { Card, CardContent } from "@/components/ui/card";

export const BrandDetails = () => {
  const [brandName, setBrandName] = useState("Brand 1");
  const [region, setRegion] = useState("North America");
  
  // Tags for objectives, messages, and audiences
  const [objectiveTags, setObjectiveTags] = useState([
    { id: "1", text: "Increase brand awareness by 25%", notes: "Focus on social media and PR" },
    { id: "2", text: "Grow market share by 10%", notes: "Target competitive customers" }
  ]);
  
  const [messageTags, setMessageTags] = useState([
    { id: "1", text: "Sustainable innovation", notes: "Emphasize eco-friendly practices" },
    { id: "2", text: "Superior quality", notes: "Highlight product durability" },
    { id: "3", text: "Customer-centric approach", notes: "Showcase customer testimonials" }
  ]);
  
  const [audienceTags, setAudienceTags] = useState([
    { id: "1", text: "Young Professionals (25-34)", notes: "Urban, tech-savvy, income >$60k" },
    { id: "2", text: "Business Decision Makers", notes: "Mid-level managers, procurement teams" }
  ]);

  // Input states
  const [newObjectiveTag, setNewObjectiveTag] = useState("");
  const [newMessageTag, setNewMessageTag] = useState("");
  const [newAudienceTag, setNewAudienceTag] = useState("");
  
  // Tag notes states
  const [activeTagType, setActiveTagType] = useState(null);
  const [activeTagId, setActiveTagId] = useState(null);
  const [tagNotes, setTagNotes] = useState("");
  
  const brands = [
    "Brand 1",
    "Brand 2",
    "Brand 3",
  ];

  const regions = [
    "North America",
    "Europe",
    "Asia Pacific",
    "Latin America",
    "Middle East & Africa",
    "Global",
  ];

  // Add new tag functions
  const addObjectiveTag = () => {
    if (newObjectiveTag.trim() !== "") {
      setObjectiveTags([
        ...objectiveTags,
        { id: Date.now().toString(), text: newObjectiveTag, notes: "" }
      ]);
      setNewObjectiveTag("");
    }
  };

  const addMessageTag = () => {
    if (newMessageTag.trim() !== "") {
      setMessageTags([
        ...messageTags,
        { id: Date.now().toString(), text: newMessageTag, notes: "" }
      ]);
      setNewMessageTag("");
    }
  };

  const addAudienceTag = () => {
    if (newAudienceTag.trim() !== "") {
      setAudienceTags([
        ...audienceTags,
        { id: Date.now().toString(), text: newAudienceTag, notes: "" }
      ]);
      setNewAudienceTag("");
    }
  };

  // Remove tag functions
  const removeObjectiveTag = (id) => {
    setObjectiveTags(objectiveTags.filter(tag => tag.id !== id));
    if (activeTagId === id && activeTagType === "objective") {
      setActiveTagId(null);
      setActiveTagType(null);
      setTagNotes("");
    }
  };

  const removeMessageTag = (id) => {
    setMessageTags(messageTags.filter(tag => tag.id !== id));
    if (activeTagId === id && activeTagType === "message") {
      setActiveTagId(null);
      setActiveTagType(null);
      setTagNotes("");
    }
  };

  const removeAudienceTag = (id) => {
    setAudienceTags(audienceTags.filter(tag => tag.id !== id));
    if (activeTagId === id && activeTagType === "audience") {
      setActiveTagId(null);
      setActiveTagType(null);
      setTagNotes("");
    }
  };

  // Open tag notes
  const openTagNotes = (type, id) => {
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
  const handleKeyDown = (e, type) => {
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
              {/* Brand Name & Region in one row */}
              <div className="space-y-1">
                <Label className="text-sm">Brand Name</Label>
                <Select value={brandName} onValueChange={setBrandName}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select a brand" />
                  </SelectTrigger>
                  <SelectContent>
                    {brands.map((brand) => (
                      <SelectItem key={brand} value={brand}>
                        {brand}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
              </div>

              <div className="space-y-1">
                <Label className="text-sm">Region</Label>
                <Select value={region} onValueChange={setRegion}>
                  <SelectTrigger className="h-8">
                    <SelectValue placeholder="Select a region" />
                  </SelectTrigger>
                  <SelectContent>
                    {regions.map((r) => (
                      <SelectItem key={r} value={r}>
                        {r}
                      </SelectItem>
                    ))}
                  </SelectContent>
                </Select>
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
