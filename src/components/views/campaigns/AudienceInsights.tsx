
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoData } from "@/assets/avatars";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

const AudienceInsights: React.FC = () => {
  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl">Audience Engagement</CardTitle>
        <CardDescription>
          Content quality metrics across different personas
        </CardDescription>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="quality">
          <TabsList className="grid w-full grid-cols-3 mb-6">
            <TabsTrigger value="quality">Content Quality</TabsTrigger>
            <TabsTrigger value="centricity">Customer Centricity</TabsTrigger>
            <TabsTrigger value="engagement">Engagement</TabsTrigger>
          </TabsList>
          
          <TabsContent value="quality" className="h-[300px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demoData.audienceData.audienceEngagement}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="persona" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="quality" name="Content Quality" fill={COLORS[0]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="centricity" className="h-[300px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demoData.audienceData.audienceEngagement}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="persona" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="centricity" name="Customer Centricity" fill={COLORS[1]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
          
          <TabsContent value="engagement" className="h-[300px] mt-0">
            <ResponsiveContainer width="100%" height="100%">
              <BarChart
                data={demoData.audienceData.audienceEngagement}
                margin={{ top: 5, right: 30, left: 50, bottom: 5 }}
                layout="vertical"
              >
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis type="number" domain={[0, 100]} />
                <YAxis type="category" dataKey="persona" width={80} />
                <Tooltip content={<CustomTooltip />} />
                <Legend />
                <Bar dataKey="engagement" name="Engagement" fill={COLORS[2]} />
              </BarChart>
            </ResponsiveContainer>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  );
};

export default AudienceInsights;
