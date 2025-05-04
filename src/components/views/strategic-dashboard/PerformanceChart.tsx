import React, { useState } from "react";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, Legend, AreaChart, Area, BarChart, Bar } from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";

interface PerformanceChartProps {
  brandPerformanceData: {
    month: string;
    brands: Record<string, {
      overall: number;
      strategic: number;
      customer: number;
      execution: number;
    }>;
  }[];
}

// Define brand colors - we'll dynamically assign them
const BRAND_COLORS = [
  "#8884d8", // Purple
  "#82ca9d", // Green
  "#ffc658", // Yellow
  "#ff7d72"  // Orange-Red
];

// Define metric tabs
const metricTabs = [
  { id: "overall", label: "Overall Effectiveness" },
  { id: "strategic", label: "Strategic Alignment" },
  { id: "customer", label: "Customer Alignment" },
  { id: "execution", label: "Execution Effectiveness" }
];

// Define presentation tabs
const presentationTabs = [
  { id: "line", label: "Line" },
  { id: "area", label: "Area" },
  { id: "bar", label: "Bar" }
];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-semibold mb-2">{label}</p>
        {payload.map((entry: any, index: number) => (
          <div key={index} className="flex items-center text-sm mb-1">
            <div
              className="w-3 h-3 rounded-full mr-2"
              style={{ backgroundColor: entry.color }}
            />
            <span className="mr-2">{entry.name}:</span>
            <span className="font-medium">{entry.value}</span>
          </div>
        ))}
      </div>
    );
  }
  return null;
};

const PerformanceChart: React.FC<PerformanceChartProps> = ({ brandPerformanceData }) => {
  const [activeMetric, setActiveMetric] = useState("overall");
  const [activePresentationMode, setActivePresentationMode] = useState("line");
  
  // Get the brand names from the first data point (we expect these to be consistent)
  const brandNames = brandPerformanceData.length > 0 
    ? Object.keys(brandPerformanceData[0].brands) 
    : [];
    
  // Create a mapping of brand names to colors
  const brandColorMap = brandNames.reduce((acc, brand, index) => {
    acc[brand] = BRAND_COLORS[index % BRAND_COLORS.length];
    return acc;
  }, {} as Record<string, string>);
  
  // Format data for the selected metric
  const getData = () => {
    return brandPerformanceData.map(item => {
      const formattedData: any = { month: item.month };
      
      // For each brand, add the selected metric value
      brandNames.forEach(brandName => {
        formattedData[brandName] = item.brands[brandName]?.[activeMetric] || 0;
      });
      
      return formattedData;
    });
  };

  // Get the display label for the current metric
  const getMetricLabel = () => {
    const tab = metricTabs.find(tab => tab.id === activeMetric);
    return tab ? tab.label : "Overall Effectiveness";
  };
  
  // Render chart based on selected mode
  const renderChart = () => {
    const formattedData = getData();
    
    switch (activePresentationMode) {
      case 'area':
        return (
          <AreaChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {brandNames.map((brand, index) => (
              <Area
                key={brand}
                type="monotone"
                dataKey={brand}
                stroke={brandColorMap[brand]}
                fill={brandColorMap[brand]}
                fillOpacity={0.3}
                name={brand}
                activeDot={{ r: 8 }}
              />
            ))}
          </AreaChart>
        );
        
      case 'bar':
        return (
          <BarChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {brandNames.map((brand, index) => (
              <Bar
                key={brand}
                dataKey={brand}
                fill={brandColorMap[brand]}
                name={brand}
              />
            ))}
          </BarChart>
        );
        
      case 'line':
      default:
        return (
          <LineChart
            data={formattedData}
            margin={{ top: 5, right: 30, left: 0, bottom: 5 }}
          >
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis domain={[0, 120]} ticks={[0, 30, 60, 90, 120]} />
            <Tooltip content={<CustomTooltip />} />
            <Legend />
            {brandNames.map((brand, index) => (
              <Line
                key={brand}
                type="monotone"
                dataKey={brand}
                stroke={brandColorMap[brand]}
                name={brand}
                activeDot={{ r: 8 }}
                dot={{ r: 4 }}
              />
            ))}
          </LineChart>
        );
    }
  };
  
  return (
    <div>
      <div className="flex flex-col sm:flex-row justify-between items-start sm:items-center mb-6 gap-4">
        <h3 className="text-xl font-semibold">Marketing Activity Effectiveness</h3>
        <p className="text-sm text-muted-foreground">Brand performance over time</p>
      </div>
      
      <div className="mb-4 flex flex-wrap gap-4 justify-between items-center">
        <Tabs value={activeMetric} onValueChange={setActiveMetric} className="w-full sm:w-auto">
          <TabsList>
            {metricTabs.map(tab => (
              <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        
        <div className="flex gap-2">
          <Tabs value={activePresentationMode} onValueChange={setActivePresentationMode} className="w-full sm:w-auto">
            <TabsList>
              {presentationTabs.map(tab => (
                <TabsTrigger key={tab.id} value={tab.id}>{tab.label}</TabsTrigger>
              ))}
            </TabsList>
          </Tabs>
        </div>
      </div>
      
      <ResponsiveContainer width="100%" height={300}>
        {renderChart()}
      </ResponsiveContainer>
    </div>
  );
};

export default PerformanceChart;