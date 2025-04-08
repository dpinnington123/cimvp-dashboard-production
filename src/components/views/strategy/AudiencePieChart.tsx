import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import ChartCard from "@/components/common/ChartCard";
import { useContentList } from "@/hooks/useContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useMemo } from 'react';
import { type Tables } from "@/types/supabase"; // Import the Tables helper type

// Define the Content type locally using the Tables helper
type Content = Tables<"content">;

// Define colors for the pie slices (adjust as needed)
// Using shadcn chart CSS variables for consistency
const COLORS = [
  'hsl(var(--chart-1))',
  'hsl(var(--chart-2))',
  'hsl(var(--chart-3))',
  'hsl(var(--chart-4))',
  'hsl(var(--chart-5))',
  // Add more colors if more audience types are expected
];

interface ProcessedAudienceData {
  name: string;
  value: number;
}

// Helper function to process the raw content data
const processAudienceData = (contentList: Content[] | undefined): ProcessedAudienceData[] => {
  if (!contentList) {
    return [];
  }

  const audienceCounts: Record<string, number> = {};
  contentList.forEach(item => {
    const audience = item.audience_type || 'Unknown'; // Default if null/undefined
    audienceCounts[audience] = (audienceCounts[audience] || 0) + 1;
  });

  return Object.entries(audienceCounts).map(([name, value]) => ({
    name,
    value,
  }));
};

export default function AudiencePieChart() {
  const { data: contentList, isLoading, isError, error } = useContentList();

  // Process data only when contentList changes
  const processedData = useMemo(() => processAudienceData(contentList), [contentList]);

  if (isLoading) {
    return (
      <ChartCard title="Content Distribution by Audience">
        <div className="flex justify-center items-center h-[300px]">
          <LoadingSpinner />
        </div>
      </ChartCard>
    );
  }

  if (isError) {
    return (
      <ChartCard title="Content Distribution by Audience">
        <ErrorDisplay error={error} message="Failed to load audience data." />
      </ChartCard>
    );
  }

  if (!processedData || processedData.length === 0) {
    return (
      <ChartCard title="Content Distribution by Audience">
        <div className="flex justify-center items-center h-[300px] text-muted-foreground">
          No audience data available.
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title="Content Distribution by Audience">
      <ResponsiveContainer width="100%" height={300}>
        <PieChart>
          <Pie
            data={processedData}
            cx="50%"
            cy="50%"
            labelLine={false}
            // label={renderCustomizedLabel} // Add custom label later if needed
            outerRadius={80}
            fill="#8884d8"
            dataKey="value"
            nameKey="name"
          >
            {processedData.map((entry, index) => (
              <Cell key={`cell-${index}`} fill={COLORS[index % COLORS.length]} />
            ))}
          </Pie>
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
           />
          <Legend />
        </PieChart>
      </ResponsiveContainer>
    </ChartCard>
  );
}

/*
// Example for custom labels (optional):
const RADIAN = Math.PI / 180;
const renderCustomizedLabel = ({ cx, cy, midAngle, innerRadius, outerRadius, percent, index, name }) => {
  const radius = innerRadius + (outerRadius - innerRadius) * 0.5;
  const x = cx + radius * Math.cos(-midAngle * RADIAN);
  const y = cy + radius * Math.sin(-midAngle * RADIAN);

  return (
    <text x={x} y={y} fill="white" textAnchor={x > cx ? 'start' : 'end'} dominantBaseline="central">
      {`${name} (${(percent * 100).toFixed(0)}%)`}
    </text>
  );
};
*/ 