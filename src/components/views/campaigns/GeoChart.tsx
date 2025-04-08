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
import ChartCard from "@/components/common/ChartCard"; // Use the shared ChartCard

// Define interface for the component data
export interface GeoPerformance {
  country: string;
  performance: number;
}

// --- DUMMY DATA PLACEHOLDER ---
// This will later be replaced with data from an API call
const dummyGeoData: GeoPerformance[] = [
  { country: 'USA', performance: 450 },
  { country: 'Canada', performance: 200 },
  { country: 'UK', performance: 300 },
  { country: 'Germany', performance: 150 },
  { country: 'Mexico', performance: 180 },
  { country: 'France', performance: 220 },
];
// --- END DUMMY DATA ---

// Props interface for the component
interface GeoChartProps {
  // This will allow passing real data when available
  data?: GeoPerformance[];
  title?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export default function GeoChart({ 
  data = dummyGeoData,
  title = "Performance by Geography",
  isLoading = false,
  error = null
}: GeoChartProps) {
  // In a real implementation, you might add:
  // const { data, isLoading, error } = useQuery(['geoMetrics'], fetchGeoMetrics);
  
  // For now, we'll use the prop data or dummy data
  const chartData = data || dummyGeoData;

  // Basic loading state handling
  if (isLoading) {
    return (
      <ChartCard title={title}>
        <div className="h-[300px] w-full flex items-center justify-center">
          <p className="text-muted-foreground">Loading geographic data...</p>
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
        <BarChart
          data={chartData}
          margin={{
            top: 5,
            right: 30,
            left: 20,
            bottom: 5,
          }}
        >
          <CartesianGrid strokeDasharray="3 3" />
          <XAxis dataKey="country" />
          <YAxis />
          <Tooltip
            contentStyle={{ backgroundColor: 'hsl(var(--background))', border: '1px solid hsl(var(--border))' }}
            itemStyle={{ color: 'hsl(var(--foreground))' }}
          />
          <Legend />
          <Bar dataKey="performance" fill="hsl(var(--primary))" name="Performance Metric" />
        </BarChart>
      </ResponsiveContainer>
    </ChartCard>
  );
} 