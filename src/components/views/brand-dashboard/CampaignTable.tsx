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

// Define interface for the component data
export interface CampaignData {
  id: string;
  name: string;
  status: string;
  startDate: string;
  endDate: string;
  budget: number;
  roi: string;
}

// --- DUMMY DATA PLACEHOLDER ---
// This will later be replaced with data from an API call
const dummyCampaigns: CampaignData[] = [
  { id: 'C1', name: 'Spring Sale 2024', status: 'Active', startDate: '2024-03-01', endDate: '2024-03-31', budget: 5000, roi: '150%' },
  { id: 'C2', name: 'New Product Launch', status: 'Completed', startDate: '2024-02-15', endDate: '2024-02-28', budget: 10000, roi: '210%' },
  { id: 'C3', name: 'Summer Awareness Push', status: 'Planned', startDate: '2024-06-01', endDate: '2024-06-30', budget: 7500, roi: 'N/A' },
  { id: 'C4', name: 'Holiday Promo Q4', status: 'Completed', startDate: '2023-11-15', endDate: '2023-12-20', budget: 12000, roi: '185%' },
];
// --- END DUMMY DATA ---

// Props interface for the component
interface CampaignTableProps {
  // This will allow passing real data when available
  data?: CampaignData[];
  title?: string;
  isLoading?: boolean;
  error?: Error | null;
}

export default function CampaignTable({ 
  data = dummyCampaigns,
  title = "Campaign Performance",
  isLoading = false,
  error = null
}: CampaignTableProps) {
  // In a real implementation, you might add:
  // const { data, isLoading, error } = useQuery(['campaigns'], fetchCampaigns);
  
  // For now, we'll use the prop data or dummy data
  const campaignData = data || dummyCampaigns;

  // Basic loading state handling
  if (isLoading) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-muted-foreground">Loading campaign data...</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  // Error state handling
  if (error) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-[200px] w-full flex items-center justify-center">
            <p className="text-destructive">Error loading data: {error.message}</p>
          </div>
        </CardContent>
      </Card>
    );
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
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
            {campaignData.map((campaign) => (
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