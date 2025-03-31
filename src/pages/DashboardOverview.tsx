import StatCard from "@/components/common/StatCard"; // Corrected path

export default function DashboardOverview() {
  // Dummy data for overview stats - Adjusted structure
  const overviewStats = [
    { title: "Total Content Pieces", value: "152", description: "+5% vs. last period" },
    { title: "Average Content Score", value: "78", description: "-1.2% vs. last period" },
    { title: "Estimated Total Reach", value: "25.6K", description: "+12% vs. last period" },
    { title: "Engagement Rate", value: "4.3%", description: "+0.5% vs. last period" },
    // Add more stats if needed, potentially with icons later
  ];

  return (
    <div className="space-y-6">
      <h1 className="text-2xl font-semibold">Dashboard Overview</h1>

      {/* Grid for Stat Cards */}
      <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-4">
        {overviewStats.map((stat) => (
          <StatCard
            key={stat.title}
            title={stat.title}
            value={stat.value}
            description={stat.description} // Pass combined description
          />
        ))}
      </div>

      {/* Placeholder for future charts or tables */}
      {/*
      <div className="mt-6">
          <p>Charts and more detailed summaries will go here...</p>
          // Example using ChartCard if available and needed
          // import ChartCard from "@/components/shared/ChartCard";
          // <ChartCard title="Score Trend">...</ChartCard>
      </div>
      */}
    </div>
  );
} 