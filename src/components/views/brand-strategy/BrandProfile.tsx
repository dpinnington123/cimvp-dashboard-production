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
import { 
  useUpdateBrandBasicInfo,
  useUpdateBrandFinancials,
  useUpdateBrandVoiceAttributes
} from "@/hooks/useBrandProfileOperations";
import { brandService } from "@/services/brandService";
import { useToast } from "@/hooks/use-toast";
import { 
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select";
import { 
  PROFILE_CHARACTERISTICS, 
  CHARACTERISTIC_LABELS,
  ASSESSMENT_VALUES,
  ASSESSMENT_COLORS,
  DEFAULT_ASSESSMENT,
  type ProfileCharacteristic,
  type AssessmentValue
} from "@/config/brandProfileConfig";
import { 
  useUpdateCompetitorQualitativeProfiles,
  useAddCharacteristicToAllCompetitors
} from "@/hooks/useCompetitorQualitativeProfiles";

type BrandDetailsType = {
  brandName: string;
  region: string;
  businessArea: string;
  annualSales: string;
  targetSales: string;
  growth: string;
};

interface VoiceAttribute {
  id?: string;
  title: string;
  description: string;
}

interface VoiceFormData {
  voiceAttributes: VoiceAttribute[];
}

const BrandProfile = () => {
  // Get the current brand data from context
  const { selectedBrand, selectedRegion, getBrandData, isLoading } = useBrand();
  const brandData = getBrandData();
  const { toast } = useToast();
  
  // Hooks for database updates
  const updateBasicInfo = useUpdateBrandBasicInfo();
  const updateFinancials = useUpdateBrandFinancials();
  const updateVoiceAttributes = useUpdateBrandVoiceAttributes();
  
  // State for brand ID
  const [brandId, setBrandId] = useState<string | null>(null);
  
  // State for edit modes
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingVoice, setEditingVoice] = useState(false);
  const [editingProfile, setEditingProfile] = useState(false);
  
  // Voice attributes state
  const [voiceAttributes, setVoiceAttributes] = useState<VoiceAttribute[]>([]);

  // Initial data - derived from our structured brand data
  const [brandDetails, setBrandDetails] = useState<BrandDetailsType>(() => ({
    brandName: brandData?.profile?.name || '',
    region: brandData?.profile?.region || '',
    businessArea: brandData?.profile?.businessArea || '',
    annualSales: brandData?.profile?.financials?.annualSales || '$0',
    targetSales: brandData?.profile?.financials?.targetSales || '$0',
    growth: brandData?.profile?.financials?.growth || '0%',
  }));

  // State for qualitative profiles
  const [qualitativeProfiles, setQualitativeProfiles] = useState<Record<string, Record<string, AssessmentValue>>>({});
  
  // Fetch brand ID when selectedBrand changes
  useEffect(() => {
    const fetchBrandId = async () => {
      if (selectedBrand) {
        try {
          const id = await brandService.getBrandIdBySlug(selectedBrand);
          setBrandId(id);
        } catch (error) {
          console.error('Failed to fetch brand ID:', error);
          toast({
            title: 'Error',
            description: 'Failed to load brand information',
            variant: 'destructive',
          });
        }
      }
    };

    fetchBrandId();
  }, [selectedBrand, toast]);

  // Load qualitative profiles from competitors
  useEffect(() => {
    if (brandData?.competitors && brandData.competitors.length > 0) {
      const profiles: Record<string, Record<string, AssessmentValue>> = {};
      
      // Initialize our brand's profile
      profiles[brandId || 'our_brand'] = {};
      PROFILE_CHARACTERISTICS.forEach(char => {
        profiles[brandId || 'our_brand'][char] = DEFAULT_ASSESSMENT;
      });
      
      // Load competitor profiles
      brandData.competitors.forEach(competitor => {
        if (competitor.id) {
          profiles[competitor.id] = competitor.qualitative_profiles || {};
          
          // Ensure all characteristics exist for each competitor
          PROFILE_CHARACTERISTICS.forEach(char => {
            if (!profiles[competitor.id][char]) {
              profiles[competitor.id][char] = DEFAULT_ASSESSMENT;
            }
          });
        }
      });
      
      setQualitativeProfiles(profiles);
    }
  }, [brandData, brandId]);
  
  // Update state when selected brand changes or when brand data actually loads
  useEffect(() => {
    if (brandData && brandData.profile.name) {
      setBrandDetails({
        brandName: brandData.profile.name,
        region: brandData.profile.region,
        businessArea: brandData.profile.businessArea,
        annualSales: brandData.profile.financials.annualSales,
        targetSales: brandData.profile.financials.targetSales,
        growth: brandData.profile.financials.growth,
      });
      
      setVoiceAttributes(brandData.voice || []);
    }
  }, [
    selectedBrand,
    // Add specific brand data fields to avoid infinite loops but catch data loads
    brandData.profile.name,
    brandData.profile.financials.annualSales,
    brandData.profile.financials.targetSales,
    brandData.profile.financials.growth
  ]);

  // Form for brand details
  const detailsForm = useForm<BrandDetailsType>({
    defaultValues: brandDetails,
  });
  
  // Form for voice attributes
  const voiceForm = useForm({
    defaultValues: {
      voiceAttributes: voiceAttributes
    }
  });
  
  // Update form values when the brand details change
  useEffect(() => {
    detailsForm.reset(brandDetails);
  }, [brandDetails]); // Remove detailsForm from dependencies
  
  // Update voice form values when voice attributes change
  useEffect(() => {
    voiceForm.reset({ voiceAttributes });
  }, [voiceAttributes]); // Remove voiceForm from dependencies

  // Handle saving brand details
  const handleSaveDetails = async (data: BrandDetailsType) => {
    if (!brandId) {
      toast({
        title: 'Error',
        description: 'Brand information not loaded',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Update basic info
      await updateBasicInfo.mutateAsync({
        brandId,
        updates: {
          name: data.brandName,
          business_area: data.businessArea,
          region: data.region
        }
      });

      // Update financials
      await updateFinancials.mutateAsync({
        brandId,
        financials: {
          annualSales: data.annualSales,
          targetSales: data.targetSales,
          growth: data.growth
        }
      });

      setBrandDetails(data);
      setEditingDetails(false);
    } catch (error) {
      console.error('Failed to save brand details:', error);
      // Error handling is done in the hooks
    }
  };
  
  // Handle saving voice attributes
  const handleSaveVoice = async (data: VoiceFormData) => {
    if (!brandId) {
      toast({
        title: 'Error',
        description: 'Brand information not loaded',
        variant: 'destructive',
      });
      return;
    }

    try {
      await updateVoiceAttributes.mutateAsync({
        brandId,
        voiceAttributes: data.voiceAttributes || voiceAttributes
      });

      setVoiceAttributes(data.voiceAttributes || voiceAttributes);
      setEditingVoice(false);
    } catch (error) {
      console.error('Failed to save voice attributes:', error);
      // Error handling is done in the hooks
    }
  };

  // Hooks for updating profiles
  const updateCompetitorProfiles = useUpdateCompetitorQualitativeProfiles();
  const addCharacteristic = useAddCharacteristicToAllCompetitors();

  // Handle saving profile changes
  const handleSaveProfiles = async () => {
    if (!brandId) {
      toast({
        title: 'Error',
        description: 'Brand information not loaded',
        variant: 'destructive',
      });
      return;
    }

    try {
      // Prepare the update data for competitors only
      const updates = brandData.competitors
        .filter(comp => comp.id && qualitativeProfiles[comp.id])
        .map(comp => ({
          competitorId: comp.id!,
          qualitativeProfiles: qualitativeProfiles[comp.id]
        }));

      await updateCompetitorProfiles.mutateAsync({
        brandId,
        profiles: updates
      });

      setEditingProfile(false);
    } catch (error) {
      console.error('Failed to save profiles:', error);
    }
  };

  // Update a specific profile value
  const updateProfileValue = (entityId: string, characteristic: ProfileCharacteristic, value: AssessmentValue) => {
    setQualitativeProfiles(prev => ({
      ...prev,
      [entityId]: {
        ...prev[entityId],
        [characteristic]: value
      }
    }));
  };
  
  // Add a new voice attribute
  const handleAddVoiceAttribute = () => {
    setVoiceAttributes([
      ...voiceAttributes,
      { title: "", description: "" }
    ]);
  };
  
  // Remove the last voice attribute
  const handleRemoveVoiceAttribute = () => {
    if (voiceAttributes.length > 1) {
      setVoiceAttributes(voiceAttributes.slice(0, -1));
    }
  };

  // Show loading state
  if (isLoading) {
    return (
      <div className="flex items-center justify-center h-64">
        <div className="text-gray-500">Loading brand data...</div>
      </div>
    );
  }

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
                  voiceForm.reset({ voiceAttributes });
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
                {brandData.voice.map((voice, index) => (
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
                  {voiceAttributes.map((voice, index) => (
                    <div key={voice.id || index} className="grid grid-cols-3 gap-2">
                      <div className="col-span-1">
                        <Input 
                          value={voice.title}
                          onChange={(e) => {
                            const updatedVoice = [...voiceAttributes];
                            updatedVoice[index].title = e.target.value;
                            setVoiceAttributes(updatedVoice);
                          }}
                          placeholder="Title"
                          className="h-8"
                        />
                      </div>
                      <div className="col-span-2">
                        <Input 
                          value={voice.description}
                          onChange={(e) => {
                            const updatedVoice = [...voiceAttributes];
                            updatedVoice[index].description = e.target.value;
                            setVoiceAttributes(updatedVoice);
                          }}
                          placeholder="Description"
                          className="h-8"
                        />
                      </div>
                    </div>
                  ))}
                  <div className="flex justify-between items-center pt-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={handleAddVoiceAttribute}
                    >
                      <PlusCircle className="mr-2 h-4 w-4" />
                      Add Voice Attribute
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500 border-red-500 hover:bg-red-50"
                      onClick={handleRemoveVoiceAttribute}
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
            <CardDescription>Qualitative comparison of {brandData.profile.name} against key competitors</CardDescription>
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
                    // Reset to original values
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
                  onClick={handleSaveProfiles}
                  disabled={updateCompetitorProfiles.isPending}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </div>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/5">Characteristic</TableHead>
                <TableHead className="w-1/5">{brandData.profile.name}</TableHead>
                {(brandData.competitors || []).slice(0, 3).map((competitor, index) => (
                  <TableHead key={competitor.id || index} className="w-1/5">
                    {competitor.name}
                  </TableHead>
                ))}
                {/* Fill empty columns if less than 3 competitors */}
                {Array.from({ length: Math.max(0, 3 - (brandData.competitors?.length || 0)) }).map((_, index) => (
                  <TableHead key={`empty-${index}`} className="w-1/5 text-gray-400">
                    -
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {PROFILE_CHARACTERISTICS.map((characteristic) => (
                <TableRow key={characteristic}>
                  <TableCell className="font-medium">
                    {CHARACTERISTIC_LABELS[characteristic]}
                  </TableCell>
                  <TableCell>
                    {editingProfile ? (
                      <Select
                        value={qualitativeProfiles[brandId || 'our_brand']?.[characteristic] || DEFAULT_ASSESSMENT}
                        onValueChange={(value: AssessmentValue) => 
                          updateProfileValue(brandId || 'our_brand', characteristic, value)
                        }
                      >
                        <SelectTrigger className="h-8">
                          <SelectValue />
                        </SelectTrigger>
                        <SelectContent>
                          {ASSESSMENT_VALUES.map(value => (
                            <SelectItem key={value} value={value}>
                              {value}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    ) : (
                      <span className={`font-medium ${
                        ASSESSMENT_COLORS[qualitativeProfiles[brandId || 'our_brand']?.[characteristic] || DEFAULT_ASSESSMENT]
                      }`}>
                        {qualitativeProfiles[brandId || 'our_brand']?.[characteristic] || DEFAULT_ASSESSMENT}
                      </span>
                    )}
                  </TableCell>
                  {(brandData.competitors || []).slice(0, 3).map((competitor) => (
                    <TableCell key={competitor.id}>
                      {editingProfile ? (
                        <Select
                          value={qualitativeProfiles[competitor.id!]?.[characteristic] || DEFAULT_ASSESSMENT}
                          onValueChange={(value: AssessmentValue) => 
                            updateProfileValue(competitor.id!, characteristic, value)
                          }
                        >
                          <SelectTrigger className="h-8">
                            <SelectValue />
                          </SelectTrigger>
                          <SelectContent>
                            {ASSESSMENT_VALUES.map(value => (
                              <SelectItem key={value} value={value}>
                                {value}
                              </SelectItem>
                            ))}
                          </SelectContent>
                        </Select>
                      ) : (
                        <span className={
                          ASSESSMENT_COLORS[qualitativeProfiles[competitor.id!]?.[characteristic] || DEFAULT_ASSESSMENT]
                        }>
                          {qualitativeProfiles[competitor.id!]?.[characteristic] || DEFAULT_ASSESSMENT}
                        </span>
                      )}
                    </TableCell>
                  ))}
                  {/* Fill empty cells if less than 3 competitors */}
                  {Array.from({ length: Math.max(0, 3 - (brandData.competitors?.length || 0)) }).map((_, index) => (
                    <TableCell key={`empty-${index}`} className="text-gray-400">
                      -
                    </TableCell>
                  ))}
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
