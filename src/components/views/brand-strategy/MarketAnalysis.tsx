
import { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, Legend, ResponsiveContainer } from "recharts";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Edit, Save, X } from "lucide-react";
import {
  Form,
  FormControl,
  FormField,
  FormItem,
  FormLabel,
} from "@/components/ui/form";
import { useForm } from "react-hook-form";

const marketShareData = [
  { name: "Our Brand", value: 24, fill: "#10b981" },
  { name: "Competitor 1", value: 30, fill: "#6366f1" },
  { name: "Competitor 2", value: 15, fill: "#f59e0b" },
  { name: "Competitor 3", value: 12, fill: "#ef4444" },
  { name: "Others", value: 19, fill: "#94a3b8" },
];

const salesData = [
  { name: "Jan", "Our Brand": 38, "Competitor 1": 40, "Competitor 2": 25, "Competitor 3": 20 },
  { name: "Feb", "Our Brand": 42, "Competitor 1": 38, "Competitor 2": 28, "Competitor 3": 22 },
  { name: "Mar", "Our Brand": 45, "Competitor 1": 35, "Competitor 2": 30, "Competitor 3": 22 },
  { name: "Apr", "Our Brand": 48, "Competitor 1": 32, "Competitor 2": 32, "Competitor 3": 24 },
  { name: "May", "Our Brand": 52, "Competitor 1": 30, "Competitor 2": 35, "Competitor 3": 25 },
  { name: "Jun", "Our Brand": 56, "Competitor 1": 29, "Competitor 2": 36, "Competitor 3": 26 },
];

type MarketOverviewType = {
  marketSize: string;
  cagr: string;
  regions: string;
  trends: string[];
};

type CompetitorDataType = {
  attributes: Array<{
    name: string;
    ourBrand: string;
    competitorA: string;
    competitorB: string;
  }>;
};

const MarketAnalysis = () => {
  // State for edit modes
  const [editingOverview, setEditingOverview] = useState(false);
  const [editingComparison, setEditingComparison] = useState(false);

  // Initial data
  const [marketOverview, setMarketOverview] = useState<MarketOverviewType>({
    marketSize: "$12.5 billion",
    cagr: "8.2%",
    regions: "North America (45%), Europe (30%), Asia-Pacific (15%)",
    trends: [
      "Increasing consumer preference for sustainable products",
      "Growing adoption of digital-first shopping experiences",
      "Rising demand for personalized solutions",
      "Shift toward subscription-based models",
    ],
  });

  const [competitorData, setCompetitorData] = useState<CompetitorDataType>({
    attributes: [
      { name: "Market Share", ourBrand: "24%", competitorA: "30%", competitorB: "15%" },
      { name: "Price Point", ourBrand: "Premium", competitorA: "Premium", competitorB: "Mid-range" },
      { name: "Product Quality", ourBrand: "High", competitorA: "High", competitorB: "Medium" },
      { name: "Innovation", ourBrand: "Industry Leading", competitorA: "Strong", competitorB: "Moderate" },
      { name: "Customer Satisfaction", ourBrand: "95%", competitorA: "88%", competitorB: "79%" },
      { name: "Online Presence", ourBrand: "Strong", competitorA: "Very Strong", competitorB: "Moderate" },
    ],
  });

  // Forms
  const overviewForm = useForm<MarketOverviewType>({
    defaultValues: marketOverview,
  });

  const comparisonForm = useForm<CompetitorDataType>({
    defaultValues: competitorData,
  });

  // Handle saving market overview
  const handleSaveOverview = (data: MarketOverviewType) => {
    setMarketOverview(data);
    setEditingOverview(false);
  };

  // Handle saving competitor comparison
  const handleSaveComparison = (data: CompetitorDataType) => {
    setCompetitorData(data);
    setEditingComparison(false);
  };

  return (
    <div className="space-y-8">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <Card className="lg:col-span-2">
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Market Overview</CardTitle>
              <CardDescription>Understanding our competitive landscape</CardDescription>
            </div>
            {!editingOverview ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => {
                  overviewForm.reset(marketOverview);
                  setEditingOverview(true);
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
                    setEditingOverview(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-600"
                  onClick={overviewForm.handleSubmit(handleSaveOverview)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!editingOverview ? (
              <div className="prose max-w-none">
                <p>
                  The global market size is currently valued at {marketOverview.marketSize} with a projected CAGR of {marketOverview.cagr} over the next five years. 
                  {marketOverview.regions}.
                </p>
                <h4 className="text-lg font-medium mt-4 mb-2">Key Trends:</h4>
                <ul className="list-disc pl-5 space-y-1">
                  {marketOverview.trends.map((trend, index) => (
                    <li key={index}>{trend}</li>
                  ))}
                </ul>
              </div>
            ) : (
              <Form {...overviewForm}>
                <form className="space-y-4">
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <FormField
                      control={overviewForm.control}
                      name="marketSize"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Market Size</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. $12.5 billion" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                    <FormField
                      control={overviewForm.control}
                      name="cagr"
                      render={({ field }) => (
                        <FormItem>
                          <FormLabel>Projected CAGR</FormLabel>
                          <FormControl>
                            <Input {...field} placeholder="e.g. 8.2%" />
                          </FormControl>
                        </FormItem>
                      )}
                    />
                  </div>
                  <FormField
                    control={overviewForm.control}
                    name="regions"
                    render={({ field }) => (
                      <FormItem>
                        <FormLabel>Regional Distribution</FormLabel>
                        <FormControl>
                          <Input {...field} placeholder="e.g. North America (45%), Europe (30%)" />
                        </FormControl>
                      </FormItem>
                    )}
                  />
                  <div className="space-y-2">
                    <FormLabel>Key Trends</FormLabel>
                    {overviewForm.watch("trends").map((_, index) => (
                      <div key={index} className="flex gap-2">
                        <FormField
                          control={overviewForm.control}
                          name={`trends.${index}`}
                          render={({ field }) => (
                            <FormItem className="flex-1">
                              <FormControl>
                                <Input {...field} placeholder="Enter trend" />
                              </FormControl>
                            </FormItem>
                          )}
                        />
                        <Button
                          type="button"
                          variant="outline"
                          size="sm"
                          className="text-red-500"
                          onClick={() => {
                            const currentTrends = overviewForm.getValues("trends");
                            if (currentTrends.length > 1) {
                              const newTrends = [...currentTrends];
                              newTrends.splice(index, 1);
                              overviewForm.setValue("trends", newTrends);
                            }
                          }}
                        >
                          <X className="h-4 w-4" />
                        </Button>
                      </div>
                    ))}
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentTrends = overviewForm.getValues("trends");
                        overviewForm.setValue("trends", [...currentTrends, ""]);
                      }}
                    >
                      Add Trend
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between">
            <div>
              <CardTitle>Market Data</CardTitle>
              <CardDescription>Sales performance over time</CardDescription>
            </div>
            <Button size="sm" variant="outline">Connect your sales data</Button>
          </CardHeader>
          <CardContent>
            <div className="h-[300px]">
              <ResponsiveContainer width="100%" height="100%">
                <BarChart data={salesData} margin={{ top: 5, right: 30, left: 20, bottom: 5 }}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="name" />
                  <YAxis />
                  <Tooltip />
                  <Legend />
                  <Bar dataKey="Our Brand" fill="#10b981" />
                  <Bar dataKey="Competitor 1" fill="#6366f1" />
                  <Bar dataKey="Competitor 2" fill="#f59e0b" />
                  <Bar dataKey="Competitor 3" fill="#ef4444" />
                </BarChart>
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-start justify-between">
            <div>
              <CardTitle>Competitor Comparison</CardTitle>
              <CardDescription>How we stack up against competitors</CardDescription>
            </div>
            {!editingComparison ? (
              <Button 
                variant="ghost" 
                size="sm" 
                className="text-gray-500"
                onClick={() => {
                  comparisonForm.reset(competitorData);
                  setEditingComparison(true);
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
                    setEditingComparison(false);
                  }}
                >
                  <X className="h-4 w-4 mr-1" />
                  Cancel
                </Button>
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="text-emerald-600"
                  onClick={comparisonForm.handleSubmit(handleSaveComparison)}
                >
                  <Save className="h-4 w-4 mr-1" />
                  Save
                </Button>
              </div>
            )}
          </CardHeader>
          <CardContent>
            {!editingComparison ? (
              <Table>
                <TableHeader>
                  <TableRow>
                    <TableHead className="w-1/4">Attribute</TableHead>
                    <TableHead className="w-1/4">Our Brand</TableHead>
                    <TableHead className="w-1/4">Competitor A</TableHead>
                    <TableHead className="w-1/4">Competitor B</TableHead>
                  </TableRow>
                </TableHeader>
                <TableBody>
                  {competitorData.attributes.map((attr, index) => (
                    <TableRow key={index}>
                      <TableCell className="font-medium">{attr.name}</TableCell>
                      <TableCell>{attr.ourBrand}</TableCell>
                      <TableCell>{attr.competitorA}</TableCell>
                      <TableCell>{attr.competitorB}</TableCell>
                    </TableRow>
                  ))}
                </TableBody>
              </Table>
            ) : (
              <Form {...comparisonForm}>
                <form className="space-y-4">
                  {comparisonForm.watch("attributes").map((_, index) => (
                    <div key={index} className="grid grid-cols-4 gap-2">
                      <FormField
                        control={comparisonForm.control}
                        name={`attributes.${index}.name`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Attribute" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={comparisonForm.control}
                        name={`attributes.${index}.ourBrand`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Our Brand" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={comparisonForm.control}
                        name={`attributes.${index}.competitorA`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Competitor A" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                      <FormField
                        control={comparisonForm.control}
                        name={`attributes.${index}.competitorB`}
                        render={({ field }) => (
                          <FormItem>
                            <FormControl>
                              <Input {...field} placeholder="Competitor B" />
                            </FormControl>
                          </FormItem>
                        )}
                      />
                    </div>
                  ))}
                  <div className="flex space-x-2">
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      onClick={() => {
                        const currentAttrs = comparisonForm.getValues("attributes");
                        comparisonForm.setValue("attributes", [
                          ...currentAttrs,
                          { name: "", ourBrand: "", competitorA: "", competitorB: "" }
                        ]);
                      }}
                    >
                      Add Attribute
                    </Button>
                    <Button
                      type="button"
                      variant="outline"
                      size="sm"
                      className="text-red-500"
                      onClick={() => {
                        const currentAttrs = comparisonForm.getValues("attributes");
                        if (currentAttrs.length > 1) {
                          comparisonForm.setValue("attributes", currentAttrs.slice(0, -1));
                        }
                      }}
                    >
                      Remove Last
                    </Button>
                  </div>
                </form>
              </Form>
            )}
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default MarketAnalysis;
