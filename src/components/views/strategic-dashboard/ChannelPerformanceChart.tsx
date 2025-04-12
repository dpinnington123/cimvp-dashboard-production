import { useState } from "react";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "@/components/common/ChartCard";

// Define interfaces for the component data
export interface ChannelMetric {
  channel: string;
  impressions: number;
  clicks: number;
  conversions: number;
}

// --- DUMMY DATA PLACEHOLDER ---
// This will later be replaced with data from an API call
const dummyChannelMetrics: ChannelMetric[] = [
  { channel: 'Social', impressions: 50000, clicks: 2500, conversions: 120 },
  { channel: 'Email', impressions: 20000, clicks: 1800, conversions: 150 },
  { channel: 'Paid', impressions: 75000, clicks: 3500, conversions: 200 },
  { channel: 'Organic', impressions: 40000, clicks: 2000, conversions: 90 },
  { channel: 'Referral', impressions: 15000, clicks: 900, conversions: 50 },
];
// --- END DUMMY DATA ---

// Props interface for the component
interface ChannelPerformanceChartProps {
  // This will allow passing real data when available
  data?: ChannelMetric[];
  title?: string;
  isLoading?: boolean;
}

export default function ChannelPerformanceChart({ 
  data = dummyChannelMetrics,
  title = "Performance by Channel",
  isLoading = false
}: ChannelPerformanceChartProps) {
  // In a real implementation, you might add:
  // const { data, isLoading, error } = useQuery(['channelMetrics'], fetchChannelMetrics);
  
  // For now, we'll use the prop data or dummy data
  const chartData = data || dummyChannelMetrics;

  // Basic loading state handling
  if (isLoading) {
    return (
      <ChartCard title={title}>
        <div className="h-[300px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading chart data...</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={chartData}
          margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
          layout="vertical" // Use vertical layout for better label readability
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis type="number" />
          <YAxis dataKey="channel" type="category" width={80} />
          <Tooltip
             contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
             itemStyle={{ color: 'hsl(var(--foreground))' }}
           />
          <Legend />
          <Bar dataKey="impressions" fill="hsl(var(--chart-1))" name="Impressions" />
          <Bar dataKey="clicks" fill="hsl(var(--chart-2))" name="Clicks" />
          <Bar dataKey="conversions" fill="hsl(var(--chart-3))" name="Conversions" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 