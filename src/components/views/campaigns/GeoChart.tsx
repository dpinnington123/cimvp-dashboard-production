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

// --- DUMMY DATA PLACEHOLDER ---
const dummyGeoData = [
  { country: 'USA', performance: 450 },
  { country: 'Canada', performance: 200 },
  { country: 'UK', performance: 300 },
  { country: 'Germany', performance: 150 },
  { country: 'Mexico', performance: 180 },
  { country: 'France', performance: 220 },
];
// --- END DUMMY DATA ---

export default function GeoChart() {
  return (
    <ChartCard title="Performance by Geography (Dummy)">
      <ResponsiveContainer width="100%" height={300}>
        <BarChart
          data={dummyGeoData}
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