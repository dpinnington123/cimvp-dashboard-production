import React from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { RegionalPerformance } from "@/types/company";
import { Globe } from "lucide-react";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

interface ContentPerformanceByCountryProps {
  regionalPerformance: RegionalPerformance[];
}

// Custom tooltip to show more detailed information
const CustomTooltip = ({
  active,
  payload,
  label
}: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{label}</p>
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

const ContentPerformanceByCountry: React.FC<ContentPerformanceByCountryProps> = ({ regionalPerformance }) => {
  // Format data for the chart
  const chartData = regionalPerformance.map(region => ({
    name: region.region,
    overall: region.overallScore,
    strategic: region.strategicScore,
    customer: region.customerScore,
    content: region.contentScore,
    brandCount: region.brandCount
  }));

  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Globe className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">Regional Performance</CardTitle>
              <CardDescription>Marketing activity effectiveness by region</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={250}>
          <BarChart
            data={chartData}
            layout="vertical"
            margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" horizontal={true} vertical={false} />
            <XAxis type="number" domain={[0, 100]} />
            <YAxis dataKey="name" type="category" width={100} />
            <Tooltip content={<CustomTooltip />} />
            <Bar dataKey="overall" fill="#8884d8" name="Overall Score" barSize={10} radius={[0, 4, 4, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
};

export default ContentPerformanceByCountry;
