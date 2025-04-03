import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";

// --- DUMMY DATA PLACEHOLDER ---
const dummyCampaigns = [
  { id: 'C1', name: 'Spring Sale 2024', status: 'Active', startDate: '2024-03-01', endDate: '2024-03-31', budget: 5000, roi: '150%' },
  { id: 'C2', name: 'New Product Launch', status: 'Completed', startDate: '2024-02-15', endDate: '2024-02-28', budget: 10000, roi: '210%' },
  { id: 'C3', name: 'Summer Awareness Push', status: 'Planned', startDate: '2024-06-01', endDate: '2024-06-30', budget: 7500, roi: 'N/A' },
  { id: 'C4', name: 'Holiday Promo Q4', status: 'Completed', startDate: '2023-11-15', endDate: '2023-12-20', budget: 12000, roi: '185%' },
];
// --- END DUMMY DATA ---

export default function CampaignTable() {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Campaign Performance (Dummy)</CardTitle>
      </CardHeader>
      <CardContent>
        <Table>
          <TableCaption>A list of recent marketing campaigns.</TableCaption>
          <TableHeader>
            <TableRow>
              <TableHead>Name</TableHead>
              <TableHead>Status</TableHead>
              <TableHead>Start Date</TableHead>
              <TableHead>End Date</TableHead>
              <TableHead className="text-right">Budget</TableHead>
              <TableHead className="text-right">ROI</TableHead>
            </TableRow>
          </TableHeader>
          <TableBody>
            {dummyCampaigns.map((campaign) => (
              <TableRow key={campaign.id}>
                <TableCell className="font-medium">{campaign.name}</TableCell>
                <TableCell>{campaign.status}</TableCell>
                <TableCell>{campaign.startDate}</TableCell>
                <TableCell>{campaign.endDate}</TableCell>
                <TableCell className="text-right">${campaign.budget.toLocaleString()}</TableCell>
                <TableCell className="text-right">{campaign.roi}</TableCell>
              </TableRow>
            ))}
          </TableBody>
        </Table>
      </CardContent>
    </Card>
  );
} 