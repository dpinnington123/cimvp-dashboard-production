
import React, { useState, useMemo } from 'react';
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { ToggleGroup, ToggleGroupItem } from "@/components/ui/toggle-group";
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from 'recharts';
import { BarChart3, Target, Users, Zap, CalendarRange } from 'lucide-react';
import { ChartContainer, ChartTooltip, ChartTooltipContent } from "@/components/ui/chart";
import { Button } from "@/components/ui/button";
import { Popover, PopoverContent, PopoverTrigger } from "@/components/ui/popover";
import { Calendar } from "@/components/ui/calendar";
import { format, parse, isAfter, isBefore, isEqual } from "date-fns";
import { cn } from "@/lib/utils";
import { DateRange } from "react-day-picker";

interface PerformanceData {
  month: string;
  overall: number;
  strategic: number;
  customer: number;
  // Change 'execution' to 'content' to match the updated property name
  content: number;
}

interface PerformanceChartProps {
  data: PerformanceData[];
}

export function PerformanceChart({ data }: PerformanceChartProps) {
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(["overall"]);
  // Update type definition to use DateRange from react-day-picker
  const [dateRange, setDateRange] = useState<DateRange>({
    from: undefined,
    to: undefined,
  });

  // Parse string dates from data into Date objects
  const parseDateFromData = (dateStr: string) => {
    return parse(dateStr, 'MMM yyyy', new Date());
  };

  // Filter data based on selected date range
  const filteredData = useMemo(() => {
    if (!dateRange.from && !dateRange.to) return data;

    return data.filter(item => {
      const itemDate = parseDateFromData(item.month);
      
      if (dateRange.from && dateRange.to) {
        return (
          (isAfter(itemDate, dateRange.from) || isEqual(itemDate, dateRange.from)) && 
          (isBefore(itemDate, dateRange.to) || isEqual(itemDate, dateRange.to))
        );
      } else if (dateRange.from) {
        return isAfter(itemDate, dateRange.from) || isEqual(itemDate, dateRange.from);
      } else if (dateRange.to) {
        return isBefore(itemDate, dateRange.to) || isEqual(itemDate, dateRange.to);
      }
      
      return true;
    });
  }, [data, dateRange]);

  const toggleMetric = (value: string) => {
    if (selectedMetrics.includes(value)) {
      if (selectedMetrics.length > 1) {
        setSelectedMetrics(selectedMetrics.filter(metric => metric !== value));
      }
    } else {
      setSelectedMetrics([...selectedMetrics, value]);
    }
  };

  const config = {
    overall: {
      label: "Overall Effectiveness",
      color: "#3b82f6",
      icon: BarChart3,
    },
    strategic: {
      label: "Strategic Alignment",
      color: "#10b981",
      icon: Target,
    },
    customer: {
      label: "Customer Alignment",
      color: "#8b5cf6",
      icon: Users,
    },
    // Update name from 'execution' to 'content'
    content: {
      label: "Content Effectiveness",
      color: "#f59e0b",
      icon: Zap,
    },
  };

  const resetDateRange = () => {
    setDateRange({ from: undefined, to: undefined });
  };

  return (
    <Card className="w-full">
      <CardHeader className="pb-2">
        <div className="flex flex-col md:flex-row md:justify-between md:items-center gap-4">
          <CardTitle>Performance Over Time</CardTitle>
          <div className="flex flex-col sm:flex-row items-start sm:items-center gap-4">
            <Popover>
              <PopoverTrigger asChild>
                <Button 
                  variant="outline" 
                  className="w-full sm:w-auto justify-start text-left font-normal"
                >
                  <CalendarRange className="mr-2 h-4 w-4" />
                  {dateRange.from ? (
                    dateRange.to ? (
                      <>
                        {format(dateRange.from, "MMM yyyy")} - {format(dateRange.to, "MMM yyyy")}
                      </>
                    ) : (
                      format(dateRange.from, "MMM yyyy")
                    )
                  ) : (
                    "Select date range"
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0" align="end">
                <Calendar
                  initialFocus
                  mode="range"
                  defaultMonth={dateRange.from}
                  selected={dateRange}
                  onSelect={setDateRange}
                  numberOfMonths={2}
                  className={cn("p-3 pointer-events-auto")}
                />
                <div className="p-3 border-t border-border">
                  <Button
                    variant="outline"
                    size="sm"
                    onClick={resetDateRange}
                    className="w-full"
                  >
                    Reset
                  </Button>
                </div>
              </PopoverContent>
            </Popover>
            <ToggleGroup type="multiple" className="justify-start">
              {Object.entries(config).map(([key, { label, color, icon: Icon }]) => (
                <ToggleGroupItem 
                  key={key} 
                  value={key} 
                  aria-label={`Toggle ${label}`}
                  data-state={selectedMetrics.includes(key) ? "on" : "off"}
                  onClick={() => toggleMetric(key)}
                  className="flex items-center gap-1.5"
                >
                  <Icon className="h-4 w-4" />
                  <span className="hidden sm:inline">{label}</span>
                </ToggleGroupItem>
              ))}
            </ToggleGroup>
          </div>
        </div>
      </CardHeader>
      <CardContent className="pt-2 pb-4">
        <div className="flex justify-center">
          <div className="h-[920px] w-[80%]">
            <ChartContainer config={config}>
              <ResponsiveContainer width="100%" height="100%">
                <LineChart 
                  data={filteredData} 
                  margin={{ top: 10, right: 20, left: 20, bottom: 10 }}
                >
                  <CartesianGrid strokeDasharray="3 3" vertical={false} />
                  <XAxis 
                    dataKey="month" 
                    tick={{ fontSize: 12 }} 
                    tickLine={false}
                    axisLine={{ stroke: '#e5e7eb' }}
                    padding={{ left: 10, right: 10 }}
                    height={30}
                  />
                  <YAxis 
                    tick={{ fontSize: 12 }} 
                    tickLine={false} 
                    axisLine={{ stroke: '#e5e7eb' }}
                    domain={[0, 100]}
                    tickCount={6}
                    width={40}
                    padding={{ top: 10, bottom: 10 }}
                    tickFormatter={(value) => `${value}`}
                  />
                  <ChartTooltip 
                    content={({ active, payload }) => (
                      <ChartTooltipContent 
                        active={active} 
                        payload={payload}
                      />
                    )} 
                  />
                  {selectedMetrics.map(metric => (
                    <Line
                      key={metric}
                      type="monotone"
                      dataKey={metric}
                      stroke={config[metric as keyof typeof config].color}
                      strokeWidth={2}
                      dot={{ r: 3, strokeWidth: 2 }}
                      activeDot={{ r: 5, strokeWidth: 0 }}
                    />
                  ))}
                </LineChart>
              </ResponsiveContainer>
            </ChartContainer>
          </div>
        </div>
      </CardContent>
    </Card>
  );
}
