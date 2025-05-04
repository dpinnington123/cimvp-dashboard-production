import React from "react";
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Campaign } from "@/types/brand";
import { Badge } from "@/components/ui/badge";

interface CampaignTableProps {
  topCampaigns: Campaign[];
}

const getScoreClass = (score: number) => {
  if (score >= 70) return "text-emerald-600";
  if (score >= 50) return "text-amber-600";
  return "text-rose-600";
};

const getStatusClass = (status: string) => {
  switch (status.toLowerCase()) {
    case "active":
      return "bg-emerald-100 text-emerald-800 hover:bg-emerald-200";
    case "planned":
      return "bg-blue-100 text-blue-800 hover:bg-blue-200";
    case "completed":
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
    default:
      return "bg-gray-100 text-gray-800 hover:bg-gray-200";
  }
};

const CampaignTable: React.FC<CampaignTableProps> = ({ topCampaigns }) => {
  return (
    <div className="overflow-x-auto">
      <Table>
        <TableHeader>
          <TableRow className="hover:bg-transparent">
            <TableHead>Campaign</TableHead>
            <TableHead>Status</TableHead>
            <TableHead className="text-right">Strategic</TableHead>
            <TableHead className="text-right">Customer</TableHead>
            <TableHead className="text-right">Overall</TableHead>
          </TableRow>
        </TableHeader>
        <TableBody>
          {topCampaigns.map((campaign, index) => (
            <TableRow key={index} className="group transition-colors">
              <TableCell className="font-medium">{campaign.name}</TableCell>
              <TableCell>
                <Badge variant="secondary" className={getStatusClass(campaign.status)}>
                  {campaign.status}
                </Badge>
              </TableCell>
              <TableCell className="text-right">
                <span className={`font-medium ${getScoreClass(campaign.scores.strategic)}`}>
                  {campaign.scores.strategic}%
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={`font-medium ${getScoreClass(campaign.scores.customer)}`}>
                  {campaign.scores.customer}%
                </span>
              </TableCell>
              <TableCell className="text-right">
                <span className={`font-medium ${getScoreClass(campaign.scores.overall)}`}>
                  {campaign.scores.overall}%
                </span>
              </TableCell>
            </TableRow>
          ))}
        </TableBody>
      </Table>
    </div>
  );
};

export default CampaignTable;
