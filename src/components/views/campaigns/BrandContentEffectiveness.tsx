
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoData } from "@/assets/avatars";
import { Award, Target } from "lucide-react";
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  Cell
} from "recharts";

const colors = ["#8884d8", "#82ca9d", "#ffc658", "#ff8042"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{payload[0].payload.brand}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-sm">
            <span style={{ color: entry.color }}>{entry.name}:</span>
            <span className="ml-1 font-medium">{entry.value}%</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const BrandContentEffectiveness: React.FC = () => {
  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">Brand Effectiveness</CardTitle>
              <CardDescription>Content effectiveness by brand</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="brands" className="w-full">
          <TabsList className="mb-4">
            <TabsTrigger value="brands">Brands</TabsTrigger>
            <TabsTrigger value="strategies">Strategies</TabsTrigger>
          </TabsList>
          
          <TabsContent value="brands" className="w-full">
            <ResponsiveContainer width="100%" height={250}>
              <BarChart 
                data={demoData.contentPerformance.byBrand}
                layout="vertical"
                margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
              >
                <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis dataKey="brand" type="category" width={100} />
                <Tooltip content={<CustomTooltip />} />
                <Bar dataKey="quality" fill="#8884d8" name="Quality" barSize={10} radius={[0, 4, 4, 0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="strategies">
            <div className="space-y-4">
              {demoData.contentPerformance.marketingStrategies.map((item, index) => (
                <div key={index} className="space-y-1">
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Target className="h-4 w-4 text-primary" />
                      <span className="font-medium">{item.strategy}</span>
                    </div>
                    <span className="text-sm font-medium">{item.effectiveness}%</span>
                  </div>
                  <div className="w-full bg-muted/40 h-2 rounded-full overflow-hidden">
                    <div 
                      className="h-full bg-primary" 
                      style={{ width: `${item.effectiveness}%` }}
                    />
                  </div>
                  <div className="flex justify-between text-xs text-muted-foreground">
                    <span>Brand lift: {item.brandLift}x</span>
                    <span>Share rate: {item.shareable}%</span>
                  </div>
                </div>
              ))}
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default BrandContentEffectiveness;
