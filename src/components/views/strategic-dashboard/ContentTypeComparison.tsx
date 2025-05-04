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
import { FileImage, FileText, Video } from "lucide-react";
import { ContentTypePerformance } from "@/types/company";

interface ContentTypeComparisonProps {
  contentTypePerformance: ContentTypePerformance[];
}

const getIcon = (type: string) => {
  switch(type.toLowerCase()) {
    case 'video':
      return <Video className="h-3 w-3" />;
    case 'blog':
    case 'whitepaper':
      return <FileText className="h-3 w-3" />;
    default:
      return <FileImage className="h-3 w-3" />;
  }
};

const getScoreClass = (score: number) => {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
};

const ContentTypeComparison: React.FC<ContentTypeComparisonProps> = ({ contentTypePerformance }) => {
  // Metrics that we want to display as rows
  const metrics = [
    { key: "overallEffectiveness", label: "Overall Effectiveness" },
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
                {contentTypePerformance.map((content, index) => (
                  <TableHead key={index}>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                        {getIcon(content.type)}
                      </span>
                      <span className="font-medium">{content.type}</span>
                    </div>
                  </TableHead>
                ))}
              </TableRow>
            </TableHeader>
            <TableBody>
              {metrics.map((metric, i) => (
                <TableRow key={i}>
                  <TableCell className="font-medium">{metric.label}</TableCell>
                  {contentTypePerformance.map((content, j) => (
                    <TableCell key={j} className="text-center">
                      <span className={`font-medium ${getScoreClass(content[metric.key as keyof ContentTypePerformance] as number)}`}>
                        {content[metric.key as keyof ContentTypePerformance]}%
                      </span>
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
