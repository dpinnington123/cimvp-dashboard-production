import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer,
} from "recharts";
import ChartCard from "@/components/common/ChartCard";

// Define interface for the component data
export interface ChannelDateData {
  date: string;
  Social: number;
  Email: number;
  Paid: number;
  [key: string]: string | number; // Allow for additional channel types
}

// --- DUMMY DATA PLACEHOLDER ---
// This will later be replaced with data from an API call
const dummyChannelData: ChannelDateData[] = [
  { date: '2024-03-01', Social: 120, Email: 80, Paid: 150 },
  { date: '2024-03-08', Social: 135, Email: 85, Paid: 160 },
  { date: '2024-03-15', Social: 150, Email: 95, Paid: 175 },
  { date: '2024-03-22', Social: 140, Email: 100, Paid: 180 },
  { date: '2024-03-29', Social: 160, Email: 110, Paid: 190 },
];
// --- END DUMMY DATA ---

// Define colors for lines (consider using Tailwind theme colors if possible later)
const lineColors = {
  Social: "hsl(var(--chart-1))", // Example using CSS variables from shadcn/theme
  Email: "hsl(var(--chart-2))",
  Paid: "hsl(var(--chart-3))",
};

// Props interface for the component
interface MultiChannelChartProps {
  // This will allow passing real data when available
  data?: ChannelDateData[];
  title?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export default function MultiChannelChart({ 
  data = dummyChannelData,
  title = "Multi-Channel Performance Trend",
  isLoading = false,
  error = null
}: MultiChannelChartProps) {
  // In a real implementation, you might add:
  // const { data, isLoading, error } = useQuery(['channelTrends'], fetchChannelTrends);
  
  // For now, we'll use the prop data or dummy data
  const chartData = data || dummyChannelData;

  // Basic loading state handling
  if (isLoading) {
    return (
      <ChartCard title={title}>
        <div className="h-[300px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading channel trend data...</p>
        </div>
      </ChartCard>
    );
  }

  // Error state handling
  if (error) {
    return (
      <ChartCard title={title}>
        <div className="h-[300px] w-full flex items-center justify-center">
          <p className="text-destructive">Error loading data: {error.message}</p>
        </div>
      </ChartCard>
    );
  }

  return (
    <ChartCard title={title}>
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="date" />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Line type="monotone" dataKey="Social" stroke={lineColors.Social} name="Social Media" />
          <Line type="monotone" dataKey="Email" stroke={lineColors.Email} name="Email Marketing" />
          <Line type="monotone" dataKey="Paid" stroke={lineColors.Paid} name="Paid Search" />
        </LineChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 