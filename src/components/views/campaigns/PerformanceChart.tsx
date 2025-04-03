
import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import {
  Area,
  AreaChart,
  Bar,
  BarChart,
  CartesianGrid,
  Legend,
  Line,
  LineChart,
  ResponsiveContainer,
  Tooltip,
  XAxis,
  YAxis
} from "recharts";
import { demoData } from "@/assets/avatars";

const CHART_COLORS = {
  social: "#8884d8",
  email: "#82ca9d",
  ads: "#ffc658"
};

interface ChartProps {
  data: any[];
}

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <div key={`item-${index}`} className="flex items-center mb-1">
            <div 
              className="h-2 w-2 rounded-full mr-2" 
              style={{ background: entry.color }}
            />
            <span className="text-sm text-gray-700">{`${entry.name}: ${entry.value}`}</span>
          </div>
        ))}
      </div>
    );
  }

  return null;
};

const LineChartComponent: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <LineChart
        data={data}
        margin={{ top: 5, right: 30, left: 20, bottom: 5 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line 
          type="monotone" 
          dataKey="social" 
          stroke={CHART_COLORS.social} 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="email" 
          stroke={CHART_COLORS.email} 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
        <Line 
          type="monotone" 
          dataKey="ads" 
          stroke={CHART_COLORS.ads} 
          strokeWidth={2}
          dot={{ r: 4 }}
          activeDot={{ r: 6 }}
        />
      </LineChart>
    </ResponsiveContainer>
  );
};

const AreaChartComponent: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <AreaChart
        data={data}
        margin={{ top: 10, right: 30, left: 0, bottom: 0 }}
      >
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area
          type="monotone"
          dataKey="social"
          stackId="1"
          stroke={CHART_COLORS.social}
          fill={`${CHART_COLORS.social}40`}
        />
        <Area
          type="monotone"
          dataKey="email"
          stackId="1"
          stroke={CHART_COLORS.email}
          fill={`${CHART_COLORS.email}40`}
        />
        <Area
          type="monotone"
          dataKey="ads"
          stackId="1"
          stroke={CHART_COLORS.ads}
          fill={`${CHART_COLORS.ads}40`}
        />
      </AreaChart>
    </ResponsiveContainer>
  );
};

const BarChartComponent: React.FC<ChartProps> = ({ data }) => {
  return (
    <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis 
          dataKey="month" 
          tick={{ fontSize: 12 }}
          tickLine={false}
        />
        <YAxis 
          tick={{ fontSize: 12 }}
          tickLine={false}
          axisLine={false}
        />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="social" fill={CHART_COLORS.social} radius={[4, 4, 0, 0]} />
        <Bar dataKey="email" fill={CHART_COLORS.email} radius={[4, 4, 0, 0]} />
        <Bar dataKey="ads" fill={CHART_COLORS.ads} radius={[4, 4, 0, 0]} />
      </BarChart>
    </ResponsiveContainer>
  );
};

const chartTypes = [
  { id: "line", name: "Line", component: LineChartComponent },
  { id: "area", name: "Area", component: AreaChartComponent },
  { id: "bar", name: "Bar", component: BarChartComponent }
];

const PerformanceChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState("line");
  const ChartComponent = chartTypes.find(chart => chart.id === activeChart)?.component || LineChartComponent;

  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Content Effectiveness</CardTitle>
            <CardDescription>Channel performance over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            {chartTypes.map(chart => (
              <button
                key={chart.id}
                onClick={() => setActiveChart(chart.id)}
                className={`px-3 py-1 text-xs rounded-full transition-all ${
                  activeChart === chart.id
                    ? "bg-primary text-primary-foreground"
                    : "bg-secondary text-secondary-foreground hover:bg-secondary/80"
                }`}
              >
                {chart.name}
              </button>
            ))}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <ChartComponent data={demoData.performanceData} />
      </CardContent>
    </Card>
  );
};

export default PerformanceChart;
