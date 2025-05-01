
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
import { 
  Globe, 
  Instagram, 
  Mail, 
  Database, 
  Printer, 
  Megaphone, 
  Calendar
} from "lucide-react";

// Sample data for channel effectiveness
const channelData = [
  { 
    id: 1, 
    name: "Web", 
    icon: <Globe className="h-4 w-4" />, 
    status: "High", 
    overallEffectiveness: 87,
    executionEffectiveness: 82, 
    customerAlignment: 42.5
  },
  { 
    id: 2, 
    name: "Social", 
    icon: <Instagram className="h-4 w-4" />, 
    status: "High", 
    overallEffectiveness: 90,
    executionEffectiveness: 88, 
    customerAlignment: 35.8
  },
  { 
    id: 3, 
    name: "Email", 
    icon: <Mail className="h-4 w-4" />, 
    status: "Medium", 
    overallEffectiveness: 65,
    executionEffectiveness: 65, 
    customerAlignment: 28.7
  },
  { 
    id: 4, 
    name: "Salesforce", 
    icon: <Database className="h-4 w-4" />, 
    status: "Medium", 
    overallEffectiveness: 63,
    executionEffectiveness: 58, 
    customerAlignment: 57.2
  },
  { 
    id: 5, 
    name: "Print", 
    icon: <Printer className="h-4 w-4" />, 
    status: "Low", 
    overallEffectiveness: 40,
    executionEffectiveness: 42, 
    customerAlignment: 12.6
  },
  { 
    id: 6, 
    name: "Advert", 
    icon: <Megaphone className="h-4 w-4" />, 
    status: "Medium", 
    overallEffectiveness: 68,
    executionEffectiveness: 63, 
    customerAlignment: 25.4
  },
  { 
    id: 7, 
    name: "Events", 
    icon: <Calendar className="h-4 w-4" />, 
    status: "High", 
    overallEffectiveness: 78,
    executionEffectiveness: 75, 
    customerAlignment: 38.9
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

const CampaignTable: React.FC = () => {
  return (
    <Card className="stat-card animate-slide-up">
      <CardHeader>
        <CardTitle className="text-xl">Channel Effectiveness</CardTitle>
        <CardDescription>Performance metrics across marketing channels</CardDescription>
      </CardHeader>
      <CardContent>
        <div className="overflow-x-auto">
          <Table>
            <TableHeader>
              <TableRow className="hover:bg-transparent">
                <TableHead>Channel</TableHead>
                <TableHead>Performance</TableHead>
                <TableHead className="text-right">Overall Effectiveness</TableHead>
                <TableHead className="text-right">Execution Effectiveness</TableHead>
                <TableHead className="text-right">Customer Alignment</TableHead>
              </TableRow>
            </TableHeader>
            <TableBody>
              {channelData.map((channel, index) => (
                <TableRow 
                  key={channel.id}
                  className="group transition-colors"
                  style={{ 
                    animationDelay: `${index * 0.1}s`,
                    animation: 'fade-in 0.5s ease-out forwards' 
                  }}
                >
                  <TableCell>
                    <div className="flex items-center gap-2">
                      <span className="flex items-center justify-center w-6 h-6 bg-gray-100 rounded-full">
                        {channel.icon}
                      </span>
                      <span className="font-medium">{channel.name}</span>
                    </div>
                  </TableCell>
                  <TableCell>
                    <Badge variant="secondary" className={`${getStatusColor(channel.status)}`}>
                      {channel.status}
                    </Badge>
                  </TableCell>
                  <TableCell className="text-right">
                    {channel.overallEffectiveness}%
                  </TableCell>
                  <TableCell className="text-right">
                    {channel.executionEffectiveness}%
                  </TableCell>
                  <TableCell className="text-right">
                    {channel.customerAlignment}%
                  </TableCell>
                </TableRow>
              ))}
            </TableBody>
          </Table>
        </div>
      </CardContent>
    </Card>
  );
};

export default CampaignTable;
