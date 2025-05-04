import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  Legend,
  ResponsiveContainer
} from "recharts";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { demoData } from "@/assets/avatars";
import { ContentItem } from "@/types/brand";
import { Users } from "lucide-react";

const COLORS = ["#0088FE", "#00C49F", "#FFBB28"];

const CustomTooltip = ({ active, payload, label }: any) => {
  if (active && payload && payload.length) {
    return (
      <div className="custom-tooltip bg-white p-3 border border-gray-100 shadow-md rounded-md">
        <p className="font-medium">{`${label}`}</p>
        {payload.map((entry: any, index: number) => (
          <p key={index} style={{ color: entry.color }}>
            {`${entry.name}: ${entry.value}`}
          </p>
        ))}
      </div>
    );
  }

  return null;
};

interface AudienceInsightsProps {
  topContent: ContentItem[];
}

const getScoreClass = (score: number) => {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
};

const AudienceInsights: React.FC<AudienceInsightsProps> = ({ topContent }) => {
  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader>
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Users className="h-5 w-5 text-muted-foreground" />
            <div>
              <CardTitle className="text-xl">Top Performing Content</CardTitle>
              <CardDescription>Content with highest audience engagement</CardDescription>
            </div>
          </div>
        </div>
      </CardHeader>
      <CardContent>
        <div className="space-y-4">
          {topContent.slice(0, 5).map((content, index) => (
            <div key={index} className="flex items-center justify-between p-3 bg-muted/30 rounded-md">
              <div className="flex flex-col">
                <span className="font-medium">{content.name}</span>
                <span className="text-xs text-muted-foreground">{content.format}</span>
              </div>
              <div className="flex items-center gap-4">
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Overall</div>
                  <div className={`font-medium ${getScoreClass(content.scores.overall)}`}>
                    {content.scores.overall}%
                  </div>
                </div>
                <div className="text-right">
                  <div className="text-xs text-muted-foreground">Customer</div>
                  <div className={`font-medium ${getScoreClass(content.scores.customer)}`}>
                    {content.scores.customer}%
                  </div>
                </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
};

export default AudienceInsights;
