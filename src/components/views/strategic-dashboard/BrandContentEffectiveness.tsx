
import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { demoData } from "@/assets/avatars";
import { Award } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

const CustomTooltip = ({
  active,
  payload,
  label
}: any) => {
  if (active && payload && payload.length) {
    return <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{payload[0].payload.brand}</p>
        {payload.map((entry: any, index: number) => <div key={index} className="flex items-center text-sm">
            <span style={{
          color: entry.color
        }}>{entry.name}:</span>
            <span className="ml-1 font-medium">{entry.value}%</span>
          </div>)}
      </div>;
  }
  return null;
};

const BrandContentEffectiveness: React.FC = () => {
  return <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Award className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
              <CardDescription>Content effectiveness by brand</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart data={demoData.contentPerformance.byBrand} layout="vertical" margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="brand" type="category" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="quality" fill="#8884d8" name="Quality" barSize={10} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};

export default BrandContentEffectiveness;
