
import { useState } from "react";
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
    title: string;
    description: string;
  }>;
};

const BrandProfile = () => {
  // State for edit modes
  const [editingDetails, setEditingDetails] = useState(false);
  const [editingVoice, setEditingVoice] = useState(false);

  // Initial data
  const [brandDetails, setBrandDetails] = useState<BrandDetailsType>({
    brandName: "Eco Solutions Inc.",
    region: "North America, Europe, Asia-Pacific",
    businessArea: "Sustainable Consumer Products",
    annualSales: "$38.5M",
    targetSales: "$50M",
    growth: "15.2%",
  });

  const [brandVoice, setBrandVoice] = useState<BrandVoiceType>({
    voices: [
      { title: "Confident and authoritative", description: "Establishing expertise and trust" },
      { title: "Approachable and friendly", description: "Creating connection with customers" },
      { title: "Clear and straightforward", description: "Communicating without jargon" },
      { title: "Inspiring and motivational", description: "Encouraging sustainable choices" },
      { title: "Authentic and transparent", description: "Building lasting trust and credibility" },
    ],
  });

  // Form for brand details
  const detailsForm = useForm<BrandDetailsType>({
    defaultValues: brandDetails,
  });

  // Form for brand voice
  const voiceForm = useForm<BrandVoiceType>({
    defaultValues: brandVoice,
  });

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

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Brand Details</CardTitle>
              <CardDescription>Key information about our brand</CardDescription>
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
              <CardDescription>Key attributes of our communication style</CardDescription>
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
                  <li key={index} className="flex items-start">
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
            <CardDescription>Comparison across key characteristics</CardDescription>
          </div>
          <Button size="sm" variant="outline" className="text-emerald-600 border-emerald-600 hover:bg-emerald-50">
            <PlusCircle className="mr-2 h-4 w-4" />
            Add Characteristic
          </Button>
        </CardHeader>
        <CardContent>
          <Table>
            <TableHeader>
              <TableRow>
                <TableHead className="w-1/6">Characteristic</TableHead>
                <TableHead className="w-1/6">Our Brand</TableHead>
                <TableHead className="w-1/6">Competitor 1</TableHead>
                <TableHead className="w-1/6">Competitor 2</TableHead>
                <TableHead className="w-1/6">Competitor 3</TableHead>
                <TableHead className="w-1/6">Actions</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              <TableRow>
                <TableCell className="font-medium">Eco-friendly Production</TableCell>
                <TableCell className="text-emerald-700 font-medium">Industry Leading</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Below Average</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Product Quality</TableCell>
                <TableCell className="text-emerald-700 font-medium">Premium</TableCell>
                <TableCell>Premium</TableCell>
                <TableCell>Mid-range</TableCell>
                <TableCell>Low-end</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Price Point</TableCell>
                <TableCell className="text-emerald-700 font-medium">High</TableCell>
                <TableCell>High</TableCell>
                <TableCell>Medium</TableCell>
                <TableCell>Low</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Customer Service</TableCell>
                <TableCell className="text-emerald-700 font-medium">Excellent</TableCell>
                <TableCell>Good</TableCell>
                <TableCell>Average</TableCell>
                <TableCell>Poor</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
              <TableRow>
                <TableCell className="font-medium">Innovation Rate</TableCell>
                <TableCell className="text-emerald-700 font-medium">Very High</TableCell>
                <TableCell>High</TableCell>
                <TableCell>Medium</TableCell>
                <TableCell>Low</TableCell>
                <TableCell className="text-right">
                  <Button variant="ghost" size="sm" className="h-8 w-8 p-0">
                    <span className="sr-only">Edit</span>
                    <svg
                      xmlns="http://www.w3.org/2000/svg"
                      viewBox="0 0 24 24"
                      fill="none"
                      stroke="currentColor"
                      strokeWidth="2"
                      strokeLinecap="round"
                      strokeLinejoin="round"
                      className="h-4 w-4"
                    >
                      <path d="M17 3a2.85 2.85 0 1 1 4 4L7.5 20.5 2 22l1.5-5.5Z" />
                      <path d="m15 5 4 4" />
                    </svg>
                  </Button>
                </TableCell>
              </TableRow>
            </TableBody>
          </Table>
        </CardContent>
      </Card>
    </div>
  );
};

export default BrandProfile;
