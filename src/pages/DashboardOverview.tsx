import StatCard from "@/components/common/StatCard"; // Corrected path
import { useContentList } from "@/hooks/useContent"; // Import the hook
import LoadingSpinner from "@/components/common/LoadingSpinner"; // Import loading spinner
import ErrorDisplay from "@/components/common/ErrorDisplay"; // Import error display
import { Package, TrendingUp, Users } from 'lucide-react'; // Icons for cards

export default function DashboardOverview() {
  const { data: contentList, isLoading, isError, error } = useContentList();

  // --- DUMMY DATA PLACEHOLDER ---
  // Replace these with actual data fetching when available
  const dummyImpressions = "125.3k";
  const dummyEngagement = "72%";
  // --- END DUMMY DATA ---

  if (isLoading) {
    return <LoadingSpinner />;
  }

  if (isError) {
    return <ErrorDisplay error={error} message="Failed to load dashboard overview data." />;
  }

  const totalContentItems = contentList?.length ?? 0;

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* Grid for Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {/* Real Data Card */}
        <StatCard
          title="Total Content Items"
          value={totalContentItems}
          description={`${totalContentItems > 0 ? 'Tracked in system' : 'No content found'}`}
          icon={<Package size={16} />}
        />

        {/* Dummy Data Cards */}
        <StatCard
          title="Total Impressions (Dummy)"
          value={dummyImpressions}
          description="+5.2% this month"
          icon={<TrendingUp size={16} />}
        />
        <StatCard
          title="Avg. Engagement (Dummy)"
          value={dummyEngagement}
          description="+1.8% this month"
          icon={<Users size={16} />}
        />

        {/* Add more stat cards here later as needed */}
        {/* Example:
        <StatCard
          title="Placeholder Stat"
          value="TBD"
          description="Waiting for data"
        />
        */}

      </div>

      {/* Placeholder for future charts or tables */}
      <div className="mt-6 bg-card p-4 rounded-lg shadow">
          <h2 className="text-lg font-semibold mb-2">Performance Snapshot (Placeholder)</h2>
          <p className="text-muted-foreground">Charts and more detailed summaries will go here...</p>
          {/* Example using ChartCard if available and needed */}
          {/* import ChartCard from "@/components/common/ChartCard"; */}
          {/* <ChartCard title="Score Trend (Dummy)"> <YourRechartsComponent data={dummyChartData}/> </ChartCard> */}
          <div className="mt-4 h-64 bg-muted rounded flex items-center justify-center text-muted-foreground">
            Chart Area Placeholder
          </div>
      </div>
    </div>
  );
} 