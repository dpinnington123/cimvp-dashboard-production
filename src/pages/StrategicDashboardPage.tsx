import AudiencePieChart from "@/components/views/strategic-dashboard/AudiencePieChart";
import ChannelPerformanceChart from "@/components/views/strategic-dashboard/ChannelPerformanceChart";
import StatCard from "@/components/common/StatCard";
import ChartCard from "@/components/common/ChartCard";
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

export default function StrategicDashboardPage() {

  // --- Dummy Data ---
  const audienceLocationData = [
    { location: "United States", percentage: 45 },
    { location: "United Kingdom", percentage: 18 },
    { location: "Germany", percentage: 12 },
    { location: "Canada", percentage: 8 },
    { location: "Other", percentage: 17 },
  ];

  const ageDistributionData = [
    { age: '18-24', percentage: 15 },
    { age: '25-34', percentage: 35 },
    { age: '35-44', percentage: 25 },
    { age: '45-54', percentage: 15 },
    { age: '55+', percentage: 10 },
  ];

  const channelPerformanceData = [
    { channel: 'Organic Search', visitors: 12500, conversionRate: '2.5%', engagement: '65%' },
    { channel: 'Social Media', visitors: 8800, conversionRate: '1.8%', engagement: '72%' },
    { channel: 'Email Marketing', visitors: 5200, conversionRate: '3.1%', engagement: '58%' },
    { channel: 'Paid Ads', visitors: 7100, conversionRate: '2.1%', engagement: '45%' },
    { channel: 'Referral', visitors: 3500, conversionRate: '2.8%', engagement: '60%' },
  ];

  // --- End Dummy Data ---

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Strategic Dashboard</h1>

      {/* Grid for Charts */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        {/* Audience Distribution Chart (Uses Real Data) */}
        <AudiencePieChart />

        {/* Channel Performance Chart (Uses Dummy Data) */}
        <ChannelPerformanceChart />
      </div>

      {/* Audience Demographics Section */}
      <Card>
        <CardHeader>
          <CardTitle>Audience Demographics</CardTitle>
        </CardHeader>
        <CardContent className="space-y-6">
          <div className="grid gap-6 md:grid-cols-1 lg:grid-cols-2">
            <ChartCard title="Audience Location Breakdown">
              {/* Placeholder for map or better viz */}
              <div className="p-4 text-muted-foreground">
                Placeholder: Show location data
                <pre className="mt-2 text-xs text-left bg-gray-100 dark:bg-gray-800 p-2 rounded">{JSON.stringify(audienceLocationData, null, 2)}</pre>
              </div>
            </ChartCard>
            <ChartCard title="Age Distribution">
              {/* Placeholder for bar chart */}
              <div className="p-4 text-muted-foreground">
                Placeholder: Show age distribution
                <pre className="mt-2 text-xs text-left bg-gray-100 dark:bg-gray-800 p-2 rounded">{JSON.stringify(ageDistributionData, null, 2)}</pre>
              </div>
            </ChartCard>
          </div>
          {/* Add more demographic StatCards if needed */}
          {/* <StatCard title="Predominant Gender" value="60% Female" /> */}
        </CardContent>
      </Card>

      {/* Channel Performance Section */}
      <Card>
        <CardHeader>
          <CardTitle>Channel Performance</CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="grid gap-4 md:grid-cols-2">
              <StatCard title="Top Performing Channel (Visitors)" value="Organic Search" description="12.5K visitors" />
              <StatCard title="Highest Engagement Channel" value="Social Media" description="72% engagement rate" />
          </div>

          <Table>
            <TableCaption>Performance metrics by acquisition channel.</TableCaption>
            <TableHeader>
              <TableRow>
                <TableHead>Channel</TableHead>
                <TableHead className="text-right">Visitors</TableHead>
                <TableHead className="text-right">Conversion Rate</TableHead>
                <TableHead className="text-right">Engagement</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelPerformanceData.map((channel) => (
                <TableRow key={channel.channel}>
                  <TableCell className="font-medium">{channel.channel}</TableCell>
                  <TableCell className="text-right">{channel.visitors.toLocaleString()}</TableCell>
                  <TableCell className="text-right">{channel.conversionRate}</TableCell>
                  <TableCell className="text-right">{channel.engagement}</TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </CardContent>
      </Card>

      {/* Add more sections or details later if needed */}
      {/* Example: Table with audience segment details */}
      {/*
      <div className="mt-6">
        <h2 className="text-lg font-semibold">Audience Segment Details</h2>
        // Add a table component here
      </div>
      */}
    </div>
  );
} 