import { useContentList, useContentDetail } from "@/hooks/useContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useParams, Link } from "react-router-dom";
import { useScores } from "@/hooks/useScores";
import React from "react";
import { supabase } from "@/lib/supabaseClient"; // Import supabase client

// Import Shared UI components
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { 
  Star, ArrowLeft, CalendarIcon, ClockIcon, UsersIcon, FileTextIcon,
  TypeIcon, TargetIcon, BriefcaseIcon, Building2Icon, BarChart3Icon,
  InfoIcon, AlertCircleIcon, Hash, Image as ImageIcon, Video, AlignLeft,
  Thermometer, Smile
} from "lucide-react";

// Import our content report components
import { ContentPreview } from "@/components/views/content-reports/ContentPreview";
import { ScoreCard } from "../components/views/content-reports/ScoreCard";
import { ImprovementArea } from "@/components/views/content-reports/ImprovementArea";
import { CircularProgressIndicator } from "@/components/common/CircularProgressIndicator";
import { DetailItem } from "@/components/views/content-reports/DetailItem";
import { CharacteristicCard } from "@/components/views/content-reports/CharacteristicCard";

// Define score type based on error messages
type Score = {
  id: number;
  content_review_id: number; // Changed from content_id to content_review_id
  check_id: number;
  check_name: string | null;
  client_id: string | null;
  comments: string | null;
  confidence: number | null;
  created_at: string | null;
  fix_recommendation: string | null; // Was previously fix_recommendation
  score_value: number | null; // Scores from database are on a scale of 0-5
  updated_at: string | null;
  check_description?: string | null; // Optional field that might be present
};

// Helper function to convert score from 0-5 scale to 0-100 percentage
const convertScoreToPercentage = (score: number | null): number => {
  if (score === null) return 0;
  // Ensure score is in range 0-5 before converting
  const clampedScore = Math.max(0, Math.min(5, score));
  // Convert to percentage (0-100)
  return Math.round(clampedScore * 20);
};

// Helper function to format dates
const formatDate = (dateString: string | null | undefined): string => {
  if (!dateString) return "N/A";
  try {
    // Example format: Jan 1, 2024
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch (e) {
    // Handle potential invalid date strings gracefully
    console.error("Error formatting date:", dateString, e);
    return "Invalid Date";
  }
};

// --- Dummy Data for Characteristics ---
const dummyCharacteristics = [
  { id: 'headlines', label: 'Number of Headlines', value: 12, icon: <Hash className="w-4 h-4" /> },
  { id: 'images', label: 'Number of Images', value: 8, icon: <ImageIcon className="w-4 h-4" /> },
  { id: 'videos', label: 'Number of Videos', value: 2, icon: <Video className="w-4 h-4" /> },
  { id: 'pages', label: 'Number of Pages', value: 5, icon: <FileTextIcon className="w-4 h-4" /> },
  { id: 'words', label: 'Number of Words', value: 1850, icon: <AlignLeft className="w-4 h-4" /> },
  { id: 'readingAge', label: 'Reading Age', value: '14-16 years', icon: <Thermometer className="w-4 h-4" /> },
  { id: 'emotion', label: 'Emotional Strength', value: 'Moderate to Strong', icon: <Smile className="w-4 h-4" /> },
  { id: 'cta', label: 'Number of Calls to Action', value: 6, icon: <TargetIcon className="w-4 h-4" /> },
];
// --- End Dummy Data ---

export default function ContentReportsPage() {
  // --- State Management ---
  const { contentId: contentIdParam } = useParams<{ contentId: string }>();

  // If contentIdParam exists, we're in detail view, otherwise list view
  const isDetailView = !!contentIdParam;

  // Parse contentId from string param to number or null
  const contentId = contentIdParam ? parseInt(contentIdParam, 10) : null;
  // Optional: Add check if parsing failed (result is NaN)
  const isValidId = contentId !== null && !isNaN(contentId);

  // --- Data Fetching ---
  // For list view: fetch the list of content items
  const {
    data: contentList,
    isLoading: isLoadingList,
    error: errorList,
  } = useContentList();

  // For detail view: fetch details for a specific content item
  const {
    data: contentDetails,
    isLoading: isLoadingDetails,
    error: errorDetails,
  } = useContentDetail(isValidId ? contentId : null, { enabled: isDetailView && isValidId });

  // For detail view: fetch scores for the specific content item
  const {
    data: scoresData,
    isLoading: isLoadingScores,
    error: errorScores,
  } = useScores(isValidId ? contentId : null, { enabled: isDetailView && isValidId });

  // Access scores array directly - the useScores hook now returns scores via content_reviews
  const contentScores = scoresData as Score[] | undefined;
  
  // Generate image URL from file_storage_path if available
  const imageUrl = React.useMemo(() => {
    if (contentDetails?.file_storage_path) {
      console.log("Generating image URL for path:", contentDetails.file_storage_path);
      const { data } = supabase.storage
        .from('client-content') // Use the Supabase bucket name
        .getPublicUrl(contentDetails.file_storage_path);
      
      console.log("Generated public URL:", data?.publicUrl);
      return data?.publicUrl;
    }
    console.log("No file_storage_path found for content");
    return null;
  }, [contentDetails?.file_storage_path]);

  // --- Calculations & Helpers (Moved Up) ---
  // Calculate overall score (average of all scores) - MUST BE CALLED UNCONDITIONALLY
  const overallScore = React.useMemo(() => {
    // Calculation depends on contentScores, handle case where it might be undefined initially
    if (!contentScores || contentScores.length === 0) return 0;
    
    const sum = contentScores.reduce((acc: number, score: Score) => {
      // Convert score from 0-5 scale to 0-100 percentage
      return acc + convertScoreToPercentage(score.score_value);
    }, 0);
    
    // Avoid division by zero if length is 0 (though checked above)
    return contentScores.length > 0 ? Math.round(sum / contentScores.length) : 0;
  }, [contentScores]); // Dependency array is correct

  // Helper function to get score label based on value
  const getScoreLabel = (score: number) => {
    if (score >= 90) return "Excellent";
    if (score >= 80) return "Very Good";
    if (score >= 70) return "Good";
    if (score >= 60) return "Fair";
    return "Needs Improvement";
  };

  // Color by score value
  const getScoreColor = (score: number) => {
    if (score >= 80) return "#22c55e"; // Green
    if (score >= 60) return "#f97316"; // Orange
    return "#ef4444"; // Red
  };

  // Pie chart data for overall score - Calculated unconditionally
  const scoreChartData = [
    { name: "Score", value: overallScore },
    { name: "Remaining", value: 100 - overallScore }
  ];

  // --- Loading and Error Handling ---
  const isLoading = isDetailView 
    ? (isLoadingDetails || isLoadingScores) 
    : isLoadingList;
  
  const error = isDetailView 
    ? (errorDetails || errorScores)
    : errorList;

  // Show loader while fetching data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle errors
  if (error) {
    return <ErrorDisplay error={error} message="Failed to load content data." />;
  }

  // TODO: Implement a proper content list view with filtering, sorting, and pagination
  // This button allows users to navigate to the Process Content page for uploading new content

  if (!isDetailView) {
    return (
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Content Reports</h1>
          <p className="text-muted-foreground mt-1">
            Select a content item to view its detailed effectiveness report
          </p>
        </header>
        <div className="flex justify-end">
          <Link 
            to="/process-content"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm mr-100"
          >
           + Upload New Content
          </Link>
        </div>

        <Card>
          <CardHeader>
            <CardTitle>Content Items</CardTitle>
            <CardDescription>Click on a content item to view its effectiveness report</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Title</TableHead>
                  <TableHead>Format</TableHead>
                  <TableHead>Created</TableHead>
                  <TableHead>Action</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {contentList && contentList.length > 0 ? (
                  contentList.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.content_name || 'Untitled'}</TableCell>
                      <TableCell>{item.format || 'Unknown'}</TableCell>
                      <TableCell>
                        {item.created_at 
                          ? new Date(item.created_at).toLocaleDateString() 
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/content-reports/${item.id}`}
                          className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                        >
                          View Report
                        </Link>
                      </TableCell>
                    </TableRow>
                  ))
                ) : (
                  <TableRow>
                    <TableCell colSpan={4} className="text-center py-6">
                      No content items found
                    </TableCell>
                  </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    );
  }

  // Handle case where contentId is invalid (for detail view)
  if (isDetailView && !isValidId) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Invalid Content ID</h1>
        <p>The provided content ID in the URL is missing or invalid.</p>
        <Link 
          to="/content-reports"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Content List
        </Link>
      </div>
    );
  }

  // Handle case where data is not found even with a valid ID (after loading)
  if (isDetailView && (!contentDetails || !contentScores)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Content Not Found</h1>
        <p>Could not load data for the specified content ID.</p>
        <Link 
          to="/content-reports"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Content List
        </Link>
      </div>
    );
  }

  // --- Detail View Content --- 
  // (Content below is for detail view and will only execute if we have contentId, contentDetails and contentScores)

  // --- Page Structure (Main Render for Detail View) ---
  return (
    <div className="p-6 space-y-6 animate-in fade-in">
      {/* Navigation and header */}
      <div className="flex items-center gap-2 mb-2">
        <Link 
          to="/content-reports"
          className="text-sm flex items-center gap-1 text-muted-foreground hover:text-foreground transition-colors"
        >
          ← Back to List
        </Link>
      </div>

      {/* 1. Header Area */}
      <header className="mb-6">
        <h1 className="text-3xl font-bold">{contentDetails?.content_name || 'Content Report'}</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive analysis of content performance and recommendations for optimization.
        </p>
      </header>
      <div className="flex justify-end">
          <Link 
            to="/process-content"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm mr-100"
          >
           + Upload New Content
          </Link>
        </div>

      {/* 2. Main Content Grid (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2.1 Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Use our new ContentPreview component */}
          <ContentPreview
            imageSrc={imageUrl}
            title={contentDetails?.content_name || 'Untitled Content'}
            contentType={contentDetails?.format}
            datePublished={contentDetails?.created_at ? new Date(contentDetails.created_at).toLocaleDateString() : null}
            duration={undefined}
            audience={contentDetails?.audience}
          />

          {/* Overall Score Card - Updated with new styling */}
          <Card className="animate-in slide-up">
            <CardHeader className="pb-3">
              <div className="flex justify-between items-center">
                <CardTitle className="text-xl">Overall Score</CardTitle>
                <Badge variant="secondary" className="font-medium">
                  {getScoreLabel(overallScore)}
                </Badge>
              </div>
              <CardDescription>Content performance summary</CardDescription>
            </CardHeader>
            <CardContent className="pb-6">
              <div className="flex items-center justify-center my-4">
                <div className="relative w-32 h-32 flex items-center justify-center">
                  <CircularProgressIndicator 
                    value={overallScore} 
                    size={128} 
                    strokeWidth={10}
                  />
                  <div className="absolute inset-0 flex items-center justify-center flex-col">
                    <div className="flex items-center justify-center gap-1">
                      <Star className="w-5 h-5 text-amber-400 fill-amber-400" />
                      <span className="text-3xl font-semibold">{overallScore}</span>
                    </div>
                    <span className="text-sm text-muted-foreground">out of 100</span>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* 2.2 Right Column */}
        <div className="lg:col-span-2">
          <Tabs defaultValue="performance" className="w-full">
            <TabsList className="grid grid-cols-4 mb-6">
              <TabsTrigger value="performance">Performance Scores</TabsTrigger>
              <TabsTrigger value="details">Content Details</TabsTrigger>
              <TabsTrigger value="characteristics">Characteristics</TabsTrigger>
              <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
            </TabsList>
            
            {/* Performance Scores Tab Content */}
            <TabsContent value="performance" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contentScores && contentScores.map((score: Score, index: number) => (
                  <ScoreCard
                    key={score.id}
                    title={score.check_name || `Score ${index + 1}`}
                    value={convertScoreToPercentage(score.score_value)}
                    description={score.check_description || score.comments || "This metric evaluates an aspect of your content's effectiveness."}
                  />
                ))}
              </div>
            </TabsContent>
            
            {/* Content Details Tab Content */}
            <TabsContent value="details" className="mt-0 p-0 animate-in fade-in-50">
              <Card>
                <CardContent className="p-6 space-y-6">
                  {/* Content Objectives (Displayed separately for potentially longer text) */}
                  <div className="space-y-2">
                    <h3 className="text-lg font-medium flex items-center gap-2">
                      <TargetIcon className="w-5 h-5 text-primary" />
                      Content Objectives
                    </h3>
                    <p className="text-sm text-muted-foreground bg-muted/30 p-3 rounded-md border">
                      {/* Access the objectives field from contentDetails object */}
                      {contentDetails?.content_objectives || "No objectives specified."}
                    </p>
                  </div>

                  {/* Metadata Grid using DetailItem */}
                  <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4">
                    {/* Map each field from contentDetails to a DetailItem */}
                    <DetailItem
                      icon={<FileTextIcon className="w-3.5 h-3.5" />}
                      label="Format"
                      value={contentDetails?.format} // Access the 'format' field
                    />
                    <DetailItem
                      icon={<TypeIcon className="w-3.5 h-3.5" />}
                      label="Type"
                      value={contentDetails?.type} // Access the 'type' field
                    />
                     <DetailItem
                      icon={<UsersIcon className="w-3.5 h-3.5" />}
                      label="Audience"
                      value={contentDetails?.audience} // Access the 'audience' field
                    />
                     <DetailItem
                      icon={<InfoIcon className="w-3.5 h-3.5" />}
                      label="Status"
                      value={contentDetails?.status} // Access the 'status' field
                    />
                    <DetailItem
                      icon={<BriefcaseIcon className="w-3.5 h-3.5" />}
                      label="Campaign"
                      value={contentDetails?.campaign_aligned_to} // Access the 'campaign_aligned_to' field
                    />
                     <DetailItem
                      icon={<Building2Icon className="w-3.5 h-3.5" />}
                      label="Agency"
                      value={contentDetails?.agency} // Access the 'agency' field
                    />
                    <DetailItem
                      icon={<TargetIcon className="w-3.5 h-3.5" />}
                      label="Strategy Alignment"
                      value={contentDetails?.strategy_aligned_to} // Access the 'strategy_aligned_to' field
                    />
                    <DetailItem
                      icon={<BarChart3Icon className="w-3.5 h-3.5" />}
                      label="Funnel Alignment"
                      value={contentDetails?.funnel_alignment} // Access the 'funnel_alignment' field
                    />
                     <DetailItem
                      icon={<CalendarIcon className="w-3.5 h-3.5" />}
                      label="Created On"
                      value={formatDate(contentDetails?.created_at)} // Format the date
                    />
                    <DetailItem
                      icon={<ClockIcon className="w-3.5 h-3.5" />}
                      label="Expiry Date"
                      value={formatDate(contentDetails?.expiry_date)} // Format the date
                    />
                    <DetailItem
                      icon={<AlertCircleIcon className="w-3.5 h-3.5" />}
                      label="Last Updated"
                      value={formatDate(contentDetails?.updated_at)} // Format the date
                    />
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Areas to Improve Tab Content */}
            <TabsContent value="improvements" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 gap-4">
                {contentScores && contentScores
                  .filter((score: Score) => score.fix_recommendation && convertScoreToPercentage(score.score_value) < 80)
                  .map((score: Score, index: number) => {
                    // Determine priority based on converted percentage score
                    const percentageScore = convertScoreToPercentage(score.score_value);
                    let priority: 'high' | 'medium' | 'low' = 'medium';
                    if (percentageScore < 50) priority = 'high';
                    else if (percentageScore >= 70) priority = 'low';
                    
                    return (
                      <ImprovementArea
                        key={score.id}
                        title={score.check_name || `Improvement Area ${index + 1}`}
                        description={score.fix_recommendation || "No specific recommendation provided."}
                        priority={priority}
                      />
                    );
                  })}
                
                {/* Message when no improvements are needed */}
                {(!contentScores || 
                  !contentScores.filter((score: Score) => score.fix_recommendation && convertScoreToPercentage(score.score_value) < 80).length) && (
                  <Card className="text-center py-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50">
                    <CardContent>
                      <h3 className="text-emerald-600 font-medium mb-1">Great job! No significant improvements needed.</h3>
                      <p className="text-sm text-muted-foreground">Your content is performing well across all metrics.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
            </TabsContent>

            {/* Characteristics Tab Content */}
            <TabsContent value="characteristics" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {dummyCharacteristics.map((char, index) => (
                  <CharacteristicCard
                    key={char.id}
                    icon={char.icon}
                    label={char.label}
                    value={char.value}
                    className="animate-in fade-in zoom-in-95"
                    style={{ animationDelay: `${index * 0.05}s` }} // Stagger animation
                  />
                ))}
              </div>
              {/* Placeholder for future notes or summary related to characteristics */}
              <p className="text-xs text-muted-foreground mt-4 text-center">
                These characteristics are based on automated analysis of your content.
              </p>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 