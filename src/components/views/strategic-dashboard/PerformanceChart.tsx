import React, { useState } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Tabs, TabsList, TabsTrigger, TabsContent } from "@/components/ui/tabs";
import { Area, AreaChart, Bar, BarChart, CartesianGrid, Legend, Line, LineChart, ResponsiveContainer, Tooltip, XAxis, YAxis } from "recharts";
import { demoData } from "@/assets/avatars";
const CHART_COLORS = {
  brandA: "#8884d8",
  brandB: "#82ca9d",
  brandC: "#ffc658",
  brandD: "#ff8042"
};
interface ChartProps {
  data: any[];
}
const CustomTooltip = ({
  active,
  payload,
  label
}: any) => {
  if (active && payload && payload.length) {
    return <div className="custom-tooltip bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium mb-1">{`${label}`}</p>
        {payload.map((entry: any, index: number) => <div key={`item-${index}`} className="flex items-center mb-1">
            <div className="h-2 w-2 rounded-full mr-2" style={{
          background: entry.color
        }} />
            <span className="text-sm text-gray-700">{`${entry.name}: ${entry.value}`}</span>
          </div>)}
      </div>;
  }
  return null;
};
const LineChartComponent: React.FC<ChartProps> = ({
  data
}) => {
  return <ResponsiveContainer width="100%" height={300}>
      <LineChart data={data} margin={{
      top: 5,
      right: 30,
      left: 20,
      bottom: 5
    }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
        <XAxis dataKey="month" tick={{
        fontSize: 12
      }} tickLine={false} />
        <YAxis tick={{
        fontSize: 12
      }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Line type="monotone" dataKey="brandA" stroke={CHART_COLORS.brandA} strokeWidth={2} dot={{
        r: 4
      }} activeDot={{
        r: 6
      }} name="Brand A" />
        <Line type="monotone" dataKey="brandB" stroke={CHART_COLORS.brandB} strokeWidth={2} dot={{
        r: 4
      }} activeDot={{
        r: 6
      }} name="Brand B" />
        <Line type="monotone" dataKey="brandC" stroke={CHART_COLORS.brandC} strokeWidth={2} dot={{
        r: 4
      }} activeDot={{
        r: 6
      }} name="Brand C" />
        <Line type="monotone" dataKey="brandD" stroke={CHART_COLORS.brandD} strokeWidth={2} dot={{
        r: 4
      }} activeDot={{
        r: 6
      }} name="Brand D" />
      </LineChart>
    </ResponsiveContainer>;
};
const AreaChartComponent: React.FC<ChartProps> = ({
  data
}) => {
  return <ResponsiveContainer width="100%" height={300}>
      <AreaChart data={data} margin={{
      top: 10,
      right: 30,
      left: 0,
      bottom: 0
    }}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{
        fontSize: 12
      }} tickLine={false} />
        <YAxis tick={{
        fontSize: 12
      }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Area type="monotone" dataKey="brandA" stackId="1" stroke={CHART_COLORS.brandA} fill={`${CHART_COLORS.brandA}40`} name="Brand A" />
        <Area type="monotone" dataKey="brandB" stackId="1" stroke={CHART_COLORS.brandB} fill={`${CHART_COLORS.brandB}40`} name="Brand B" />
        <Area type="monotone" dataKey="brandC" stackId="1" stroke={CHART_COLORS.brandC} fill={`${CHART_COLORS.brandC}40`} name="Brand C" />
        <Area type="monotone" dataKey="brandD" stackId="1" stroke={CHART_COLORS.brandD} fill={`${CHART_COLORS.brandD}40`} name="Brand D" />
      </AreaChart>
    </ResponsiveContainer>;
};
const BarChartComponent: React.FC<ChartProps> = ({
  data
}) => {
  return <ResponsiveContainer width="100%" height={300}>
      <BarChart data={data}>
        <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
        <XAxis dataKey="month" tick={{
        fontSize: 12
      }} tickLine={false} />
        <YAxis tick={{
        fontSize: 12
      }} tickLine={false} axisLine={false} />
        <Tooltip content={<CustomTooltip />} />
        <Legend />
        <Bar dataKey="brandA" fill={CHART_COLORS.brandA} radius={[4, 4, 0, 0]} name="Brand A" />
        <Bar dataKey="brandB" fill={CHART_COLORS.brandB} radius={[4, 4, 0, 0]} name="Brand B" />
        <Bar dataKey="brandC" fill={CHART_COLORS.brandC} radius={[4, 4, 0, 0]} name="Brand C" />
        <Bar dataKey="brandD" fill={CHART_COLORS.brandD} radius={[4, 4, 0, 0]} name="Brand D" />
      </BarChart>
    </ResponsiveContainer>;
};
const chartTypes = [{
  id: "line",
  name: "Line",
  component: LineChartComponent
}, {
  id: "area",
  name: "Area",
  component: AreaChartComponent
}, {
  id: "bar",
  name: "Bar",
  component: BarChartComponent
}];
const PerformanceChart: React.FC = () => {
  const [activeChart, setActiveChart] = useState("line");
  const [activeTab, setActiveTab] = useState("overall");
  const ChartComponent = chartTypes.find(chart => chart.id === activeChart)?.component || LineChartComponent;

  // Transform the original data to have brand keys instead of strategy keys
  const brandData = demoData.performanceData.map(item => ({
    month: item.month,
    brandA: item.social,
    brandB: item.email,
    brandC: item.ads,
    brandD: Math.floor(item.social * 0.8 + item.email * 0.3) // Derived data for Brand D
  }));
  const overallData = brandData;
  const strategicAlignmentData = brandData.map(item => ({
    ...item,
    brandA: item.brandA * 0.9,
    brandB: item.brandB * 1.1,
    brandC: item.brandC * 0.95,
    brandD: item.brandD * 1.05
  }));
  const customerAlignmentData = brandData.map(item => ({
    ...item,
    brandA: item.brandA * 1.2,
    brandB: item.brandB * 0.8,
    brandC: item.brandC * 1.05,
    brandD: item.brandD * 0.9
  }));
  const executionEffectivenessData = brandData.map(item => ({
    ...item,
    brandA: item.brandA * 1.15,
    brandB: item.brandB * 0.9,
    brandC: item.brandC * 1.1,
    brandD: item.brandD * 1.2
  }));
  const getActiveData = () => {
    switch (activeTab) {
      case "strategic":
        return strategicAlignmentData;
      case "customer":
        return customerAlignmentData;
      case "execution":
        return executionEffectivenessData;
      case "overall":
      default:
        return overallData;
    }
  };
  const getDataLabels = () => {
    switch (activeTab) {
      case "strategic":
        return {
          brandA: "Brand A Strategic",
          brandB: "Brand B Strategic",
          brandC: "Brand C Strategic",
          brandD: "Brand D Strategic"
        };
      case "customer":
        return {
          brandA: "Brand A Customer",
          brandB: "Brand B Customer",
          brandC: "Brand C Customer",
          brandD: "Brand D Customer"
        };
      case "execution":
        return {
          brandA: "Brand A Execution",
          brandB: "Brand B Execution",
          brandC: "Brand C Execution",
          brandD: "Brand D Execution"
        };
      case "overall":
      default:
        return {
          brandA: "Brand A",
          brandB: "Brand B",
          brandC: "Brand C",
          brandD: "Brand D"
        };
    }
  };
  const TabAwareTooltip = ({
    active,
    payload,
    label
  }: any) => {
    if (active && payload && payload.length) {
      const labels = getDataLabels();
      return <div className="custom-tooltip bg-white p-3 border border-gray-100 shadow-md rounded-md">
          <p className="font-medium mb-1">{`${label}`}</p>
          {payload.map((entry: any, index: number) => <div key={`item-${index}`} className="flex items-center mb-1">
              <div className="h-2 w-2 rounded-full mr-2" style={{
            background: entry.color
          }} />
              <span className="text-sm text-gray-700">
                {`${labels[entry.dataKey as keyof typeof labels] || entry.name}: ${entry.value}`}
              </span>
            </div>)}
        </div>;
    }
    return null;
  };
  return <Card className="stat-card animate-slide-up">
      <CardHeader className="pb-2">
        <div className="flex justify-between items-center">
          <div>
            <CardTitle className="text-xl">Marketing Activity Effectiveness</CardTitle>
            <CardDescription>Brand performance over time</CardDescription>
          </div>
          <div className="flex space-x-2">
            {chartTypes.map(chart => <button key={chart.id} onClick={() => setActiveChart(chart.id)} className={`px-3 py-1 text-xs rounded-full transition-all ${activeChart === chart.id ? "bg-primary text-primary-foreground" : "bg-secondary text-secondary-foreground hover:bg-secondary/80"}`}>
                {chart.name}
              </button>)}
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <Tabs defaultValue="overall" className="w-full mb-4" onValueChange={setActiveTab}>
          <TabsList>
            <TabsTrigger value="overall">Overall Effectiveness</TabsTrigger>
            <TabsTrigger value="strategic">Strategic Alignment</TabsTrigger>
            <TabsTrigger value="customer">Customer Alignment</TabsTrigger>
            <TabsTrigger value="execution">Execution Effectiveness</TabsTrigger>
          </TabsList>
        </Tabs>

        <ResponsiveContainer width="100%" height={300}>
          {activeChart === "line" ? <LineChart data={getActiveData()} margin={{
          top: 5,
          right: 30,
          left: 20,
          bottom: 5
        }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
              <XAxis dataKey="month" tick={{
            fontSize: 12
          }} tickLine={false} />
              <YAxis tick={{
            fontSize: 12
          }} tickLine={false} axisLine={false} />
              <Tooltip content={<TabAwareTooltip />} />
              <Legend />
              <Line type="monotone" dataKey="brandA" stroke={CHART_COLORS.brandA} strokeWidth={2} dot={{
            r: 4
          }} activeDot={{
            r: 6
          }} name={getDataLabels().brandA} />
              <Line type="monotone" dataKey="brandB" stroke={CHART_COLORS.brandB} strokeWidth={2} dot={{
            r: 4
          }} activeDot={{
            r: 6
          }} name={getDataLabels().brandB} />
              <Line type="monotone" dataKey="brandC" stroke={CHART_COLORS.brandC} strokeWidth={2} dot={{
            r: 4
          }} activeDot={{
            r: 6
          }} name={getDataLabels().brandC} />
              <Line type="monotone" dataKey="brandD" stroke={CHART_COLORS.brandD} strokeWidth={2} dot={{
            r: 4
          }} activeDot={{
            r: 6
          }} name={getDataLabels().brandD} />
            </LineChart> : activeChart === "area" ? <AreaChart data={getActiveData()} margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{
            fontSize: 12
          }} tickLine={false} />
              <YAxis tick={{
            fontSize: 12
          }} tickLine={false} axisLine={false} />
              <Tooltip content={<TabAwareTooltip />} />
              <Legend />
              <Area type="monotone" dataKey="brandA" stackId="1" stroke={CHART_COLORS.brandA} fill={`${CHART_COLORS.brandA}40`} name={getDataLabels().brandA} />
              <Area type="monotone" dataKey="brandB" stackId="1" stroke={CHART_COLORS.brandB} fill={`${CHART_COLORS.brandB}40`} name={getDataLabels().brandB} />
              <Area type="monotone" dataKey="brandC" stackId="1" stroke={CHART_COLORS.brandC} fill={`${CHART_COLORS.brandC}40`} name={getDataLabels().brandC} />
              <Area type="monotone" dataKey="brandD" stackId="1" stroke={CHART_COLORS.brandD} fill={`${CHART_COLORS.brandD}40`} name={getDataLabels().brandD} />
            </AreaChart> : <BarChart data={getActiveData()} margin={{
          top: 10,
          right: 30,
          left: 0,
          bottom: 0
        }}>
              <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" vertical={false} />
              <XAxis dataKey="month" tick={{
            fontSize: 12
          }} tickLine={false} />
              <YAxis tick={{
            fontSize: 12
          }} tickLine={false} axisLine={false} />
              <Tooltip content={<TabAwareTooltip />} />
              <Legend />
              <Bar dataKey="brandA" fill={CHART_COLORS.brandA} radius={[4, 4, 0, 0]} name={getDataLabels().brandA} />
              <Bar dataKey="brandB" fill={CHART_COLORS.brandB} radius={[4, 4, 0, 0]} name={getDataLabels().brandB} />
              <Bar dataKey="brandC" fill={CHART_COLORS.brandC} radius={[4, 4, 0, 0]} name={getDataLabels().brandC} />
              <Bar dataKey="brandD" fill={CHART_COLORS.brandD} radius={[4, 4, 0, 0]} name={getDataLabels().brandD} />
            </BarChart>}
        </ResponsiveContainer>
      </CardContent>
    </Card>;
};
export default PerformanceChart;