import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { PlusCircle, Edit, Save, X } from "lucide-react";
import { 
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";
import { useBrand } from "@/contexts/BrandContext";
import { BrandVoice } from "@/data/brandData";

type BrandDetailsType = {
  brandName: string;
  region: string;
  businessArea: string;
  annualSales: string;
  targetSales: string;
  growth: string;
};

type BrandVoiceType = {
  voices: Array<{
    id?: string;
    title: string;
    description: string;
  }>;
};

const BrandProfile = () => {
  // Get the current brand data from context
  const { selectedBrand, selectedRegion, getBrandData } = useBrand();
  const brandData = getBrandData();
  
  // State for edit modes
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingVoice, setEditingVoice] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);

  // Initial data - derived from our structured brand data
  const [brandDetails, setBrandDetails] = useState<BrandDetailsType>({
    brandName: brandData.profile.name,
    region: selectedRegion,
    businessArea: brandData.profile.businessArea,
    annualSales: brandData.profile.financials.annualSales,
    targetSales: brandData.profile.financials.targetSales,
    growth: brandData.profile.financials.growth,
  });

  // Brand voice from structured data
  const [brandVoice, setBrandVoice] = useState<BrandVoiceType>({
    voices: brandData.voice.map(v => ({ 
      id: v.id,
      title: v.title, 
      description: v.description 
    })),
  });
  
  // Brand profile comparison data
  const [profileAttributes, setProfileAttributes] = useState([
    { name: "Eco-friendly Production", ourBrand: "Industry Leading", competitor1: "Good", competitor2: "Average", competitor3: "Below Average" },
    { name: "Product Quality", ourBrand: "Premium", competitor1: "Premium", competitor2: "Mid-range", competitor3: "Low-end" },
    { name: "Price Point", ourBrand: "High", competitor1: "High", competitor2: "Medium", competitor3: "Low" },
    { name: "Customer Service", ourBrand: "Excellent", competitor1: "Good", competitor2: "Average", competitor3: "Poor" },
    { name: "Innovation Rate", ourBrand: "Very High", competitor1: "High", competitor2: "Medium", competitor3: "Low" },
  ]);
  
  // Update profile attributes based on market analysis
  useEffect(() => {
    if (brandData?.marketAnalysis?.competitorAnalysis) {
      const competitors = brandData.marketAnalysis.competitorAnalysis;
      const attributeNames = ["Market Presence", "Product Quality", "Price Point", "Customer Service", "Innovation Rate"];
      
      // Create attribute values for comparison
      const newAttributes = attributeNames.map((name, index) => {
        let ourValue = "Strong";
        let comp1 = "Average";
        let comp2 = "Average";
        let comp3 = "Average";
        
        // Special handling for different attribute types
        if (name === "Market Presence" && competitors[0]?.marketShare) {
          ourValue = parseInt(competitors[0].marketShare) > 20 ? "Leading" : "Growing";
          comp1 = competitors[0]?.marketShare || "Unknown";
          comp2 = competitors.length > 1 ? competitors[1]?.marketShare || "Unknown" : "Unknown";
          comp3 = competitors.length > 2 ? competitors[2]?.marketShare || "Unknown" : "Unknown";
        } else if (name === "Product Quality") {
          ourValue = brandData.profile.name === "TechNova" ? "Premium" : "High";
        } else if (name === "Innovation Rate") {
          ourValue = brandData.marketAnalysis?.swot?.strengths?.includes("Innovation") ? "Very High" : "High";
        }
        
        return {
          name,
          ourBrand: ourValue,
          competitor1: comp1,
          competitor2: comp2,
          competitor3: comp3
        };
      });
      
      setProfileAttributes(newAttributes);
    }
  }, [brandData]);
  
  // Update state when brand changes
  useEffect(() => {
    if (brandData) {
      setBrandDetails({
        brandName: brandData.profile.name,
        region: selectedRegion,
        businessArea: brandData.profile.businessArea,
        annualSales: brandData.profile.financials.annualSales,
        targetSales: brandData.profile.financials.targetSales,
        growth: brandData.profile.financials.growth,
      });
      
      setBrandVoice({
        voices: brandData.voice.map(v => ({ 
          id: v.id,
          title: v.title, 
          description: v.description 
        })),
      });
    }
  }, [selectedBrand, selectedRegion, brandData]);

  // Form for brand details
  const detailsForm = useForm<BrandDetailsType>({
    defaultValues: brandDetails,
  });
  
  // Update form values when the brand details change
  useEffect(() => {
    detailsForm.reset(brandDetails);
  }, [brandDetails, detailsForm]);

  // Form for brand voice
  const voiceForm = useForm<BrandVoiceType>({
    defaultValues: brandVoice,
  });
  
  // Update voice form when the brand voice changes
  useEffect(() => {
    voiceForm.reset(brandVoice);
  }, [brandVoice, voiceForm]);

  // Handle saving brand details
  const handleSaveDetails = (data: BrandDetailsType) => {
    setBrandDetails(data);
    setEditingDetails(false);
  };

  // Handle saving brand voice
  const handleSaveVoice = (data: BrandVoiceType) => {
    setBrandVoice(data);
    setEditingVoice(false);
  };

  // Add a new attribute to profile comparison
  const handleAddAttribute = () => {
    setProfileAttributes([
      ...profileAttributes,
      { name: "New Attribute", ourBrand: "Strong", competitor1: "Average", competitor2: "Average", competitor3: "Average" }
    ]);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Brand Details</CardTitle>
              <CardDescription>Key information about {brandData.profile.name}</CardDescription>
            </div>
            {!editingDetails ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => {
                  detailsForm.reset(brandDetails);
                  setEditingDetails(true);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500"
                  onClick={() => {
                    setEditingDetails(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-600"
                  onClick={detailsForm.handleSubmit(handleSaveDetails)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!editingDetails ? (
              <div className="space-y-6">
                <div>
                  <h3 className="text-lg font-medium mb-3">Brand Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Brand Name:</span>
                      <span className="font-medium">{brandDetails.brandName}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Region:</span>
                      <span className="font-medium">{brandDetails.region}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Business Area:</span>
                      <span className="font-medium">{brandDetails.businessArea}</span>
                    </div>
                  </div>
                </div>

                <div>
                  <h3 className="text-lg font-medium mb-3">Financial Overview</h3>
                  <div className="space-y-2">
                    <div className="flex justify-between">
                      <span className="text-gray-500">Current Annual Sales:</span>
                      <span className="font-medium">{brandDetails.annualSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">Target Sales (End of 2025):</span>
                      <span className="font-medium">{brandDetails.targetSales}</span>
                    </div>
                    <div className="flex justify-between">
                      <span className="text-gray-500">YoY Growth:</span>
                      <Badge className="bg-emerald-100 text-emerald-800 hover:bg-emerald-200">{brandDetails.growth}</Badge>
                    </div>
                  </div>
                </div>
              </div>
            ) : (
              <Form {...detailsForm}>
                <form className="space-y-6">
                  <div>
                    <h3 className="text-lg font-medium mb-3">Brand Overview</h3>
                    <div className="space-y-4">
                      <FormField
                        control={detailsForm.control}
                        name="brandName"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Brand Name</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={detailsForm.control}
                        name="region"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Region</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={detailsForm.control}
                        name="businessArea"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Business Area</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>

                  <div>
                    <h3 className="text-lg font-medium mb-3">Financial Overview</h3>
                    <div className="space-y-4">
                      <FormField
                        control={detailsForm.control}
                        name="annualSales"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Current Annual Sales</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={detailsForm.control}
                        name="targetSales"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>Target Sales (End of 2025)</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={detailsForm.control}
                        name="growth"
                        render={({ field }) => (
                          <FormItem>
                            <FormLabel>YoY Growth</FormLabel>
                            <FormControl>
                              <Input {...field} />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Brand Voice</CardTitle>
              <CardDescription>Key attributes of {brandData.profile.name}'s communication style</CardDescription>
            </div>
            {!editingVoice ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => {
                  voiceForm.reset(brandVoice);
                  setEditingVoice(true);
                }}
              >
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500"
                  onClick={() => {
                    setEditingVoice(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-600"
                  onClick={voiceForm.handleSubmit(handleSaveVoice)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!editingVoice ? (
              <ul className="space-y-2">
                {brandVoice.voices.map((voice, index) => (
                  <li key={voice.id || index} className="flex items-start">
                    <div className="w-2 h-2 bg-emerald-500 rounded-full mt-2 mr-2"></div>
                    <span>
                      <span className="font-medium">{voice.title}:</span> {voice.description}
                    </span>
                  </li>
                ))}
              </ul>
            ) : (
              <Form {...voiceForm}>
                <form className="space-y-4">
                  {voiceForm.watch("voices").map((_, index) => (
                    <div key={index} className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <FormField
                          control={voiceForm.control}
                          name={`voices.${index}.title`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Title</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                      <div className="col-span-2">
                        <FormField
                          control={voiceForm.control}
                          name={`voices.${index}.description`}
                          render={({ field }) => (
                            <FormItem>
                              <FormLabel>Description</FormLabel>
                              <FormControl>
                                <Input {...field} />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentVoices = voiceForm.getValues("voices");
                        voiceForm.setValue("voices", [
                          ...currentVoices,
                          { title: "", description: "" }
                        ]);
                      }}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Voice Attribute
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={() => {
                        const currentVoices = voiceForm.getValues("voices");
                        if (currentVoices.length > 1) {
                          voiceForm.setValue("voices", currentVoices.slice(0, -1));
                        }
                      }}
                    >
                      <X className="mr-2 h-4 w-4" />
                      Remove Last
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>

      <Card>
        <CardHeader className="flex flex-row items-center justify-between">
          <div>
            <CardTitle>Brand Profile</CardTitle>
            <CardDescription>Comparison of {brandData.profile.name} against key competitors</CardDescription>
          </div>
          <div className="flex space-x-2">
            {!editingProfile ? (
              <Button size="sm" variant="ghost" className="text-gray-500" onClick={() => setEditingProfile(true)}>
                <Edit className="h-4 w-4 mr-1" />
                Edit
              </Button>
            ) : (
              <div className="flex space-x-2">
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-red-500"
                  onClick={() => {
                    setEditingProfile(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-600"
                  onClick={() => {
                    setEditingProfile(false);
                  }}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
            <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-600 hover:bg-emerald-50" onClick={handleAddAttribute}>
              <PlusCircle className="mr-2 h-4 w-4" />
              Add Characteristic
            </Button>
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">Characteristic</TableHead>
                <TableHead className="w-1/6">{brandData.profile.name}</TableHead>
                <TableHead className="w-1/6">
                  {brandData.marketAnalysis?.competitorAnalysis?.[0]?.name || "Competitor 1"}
                </TableHead>
                <TableHead className="w-1/6">
                  {brandData.marketAnalysis?.competitorAnalysis?.[1]?.name || "Competitor 2"}
                </TableHead>
                <TableHead className="w-1/6">
                  {brandData.marketAnalysis?.competitorAnalysis?.[2]?.name || "Competitor 3"}
                </TableHead>
                <TableHead className="w-1/6 text-right">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {profileAttributes.map((attr, index) => (
                <TableRow key={index}>
                  <TableCell className="font-medium">
                    {editingProfile ? (
                      <Input 
                        value={attr.name}
                        onChange={(e) => {
                          const newAttrs = [...profileAttributes];
                          newAttrs[index].name = e.target.value;
                          setProfileAttributes(newAttrs);
                        }}
                        className="h-8"
                      />
                    ) : (
                      attr.name
                    )}
                  </TableCell>
                  <TableCell className="text-emerald-700 font-medium">
                    {editingProfile ? (
                      <Input 
                        value={attr.ourBrand}
                        onChange={(e) => {
                          const newAttrs = [...profileAttributes];
                          newAttrs[index].ourBrand = e.target.value;
                          setProfileAttributes(newAttrs);
                        }}
                        className="h-8"
                      />
                    ) : (
                      attr.ourBrand
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProfile ? (
                      <Input 
                        value={attr.competitor1}
                        onChange={(e) => {
                          const newAttrs = [...profileAttributes];
                          newAttrs[index].competitor1 = e.target.value;
                          setProfileAttributes(newAttrs);
                        }}
                        className="h-8"
                      />
                    ) : (
                      attr.competitor1
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProfile ? (
                      <Input 
                        value={attr.competitor2}
                        onChange={(e) => {
                          const newAttrs = [...profileAttributes];
                          newAttrs[index].competitor2 = e.target.value;
                          setProfileAttributes(newAttrs);
                        }}
                        className="h-8"
                      />
                    ) : (
                      attr.competitor2
                    )}
                  </TableCell>
                  <TableCell>
                    {editingProfile ? (
                      <Input 
                        value={attr.competitor3}
                        onChange={(e) => {
                          const newAttrs = [...profileAttributes];
                          newAttrs[index].competitor3 = e.target.value;
                          setProfileAttributes(newAttrs);
                        }}
                        className="h-8"
                      />
                    ) : (
                      attr.competitor3
                    )}
                  </TableCell>
                  <TableCell className="text-right">
                    {editingProfile ? (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0 text-red-500"
                        onClick={() => {
                          const newAttrs = [...profileAttributes];
                          newAttrs.splice(index, 1);
                          setProfileAttributes(newAttrs);
                        }}
                      >
                        <X className="h-4 w-4" />
                      </Button>
                    ) : (
                      <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                        <Edit className="h-4 w-4" />
                      </Button>
                    )}
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandProfile;
