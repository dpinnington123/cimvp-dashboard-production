
import React from "react";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle
} from "@/components/ui/card";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow
} from "@/components/ui/table";
import { Badge } from "@/components/ui/badge";
import { FileText, Layers } from "lucide-react";

// Sample data for content type effectiveness
const contentTypeData = [
  { 
    id: 1, 
    name: "Hero Content", 
    icon: <FileText className="h-4 w-4" />, 
    status: "High", 
    executionEffectiveness: 89, 
    strategicAlignment: 92,
    customerAlignment: 78
  },
  { 
    id: 2, 
    name: "Diver Content", 
    icon: <Layers className="h-4 w-4" />, 
    status: "Medium", 
    executionEffectiveness: 74, 
    strategicAlignment: 68,
    customerAlignment: 82
  }
];

const getStatusColor = (status: string) => {
  switch (status.toLowerCase()) {
    case "high":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "medium":
      return "bg-amber-100 text-amber-800 hover:bg-amber-200";
    case "low":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const ContentTypeComparison: React.FC = () => {
  // Metrics that we want to display as rows
  const metrics = [
    { key: "status", label: "Performance" },
    { key: "executionEffectiveness", label: "Execution Effectiveness" },
    { key: "strategicAlignment", label: "Strategic Alignment" },
    { key: "customerAlignment", label: "Customer Alignment" }
  ];

  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl">Content Type Effectiveness</CardTitle>
        <CardDescription>Performance metrics across different content types</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Metric</TableHead>
                {contentTypeData.map(content => (
                  <TableHead key={content.id}>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                        {content.icon}
                      </span>
                      <span className="font-medium">{content.name}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric, metricIndex) => (
                <TableRow 
                  key={metric.key}
                  className="group transition-colours"
                  style={{ 
                    animationDelay: `${metricIndex * 0.1}s`,
                    animation: 'fade-in 0.5s ease-out forwards' 
                  }}
                >
                  <TableCell className="font-medium">{metric.label}</TableCell>
                  
                  {contentTypeData.map(content => (
                    <TableCell 
                      key={`${content.id}-${metric.key}`}
                      className={metric.key !== "status" ? "text-center" : ""}
                    >
                      {metric.key === "status" ? (
                        <Badge variant="secondary" className={`${getStatusColor(content.status)}`}>
                          {content.status}
                        </Badge>
                      ) : (
                        <span>{content[metric.key as keyof typeof content]}%</span>
                      )}
                    </TableCell>
                  ))}
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default ContentTypeComparison;
