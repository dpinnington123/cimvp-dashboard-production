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

// --- DUMMY DATA PLACEHOLDER ---
const dummyChannelData = [
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

export default function MultiChannelChart() {
  return (
    <ChartCard title="Multi-Channel Performance Trend (Dummy)">
      <ResponsiveContainer width="100%" height={300}>
        <LineChart
          data={dummyChannelData}
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