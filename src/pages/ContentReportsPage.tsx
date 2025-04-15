import { useContentList, useContentDetail } from "@/hooks/useContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useParams, Link } from "react-router-dom";
import { useScores } from "@/hooks/useScores";
import React from "react";

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
import { Star } from "lucide-react";

// Import our content report components
import { ContentPreview } from "@/components/views/content-reports/ContentPreview";
import { ScoreCard } from "../components/views/content-reports/ScoreCard";
import { ImprovementArea } from "@/components/views/content-reports/ImprovementArea";
import { CircularProgressIndicator } from "@/components/common/CircularProgressIndicator";

// Define score type based on error messages
type Score = {
  check_id: number;
  check_name: string | null;
  client_id: string | null;
  comments: string | null;
  confidence: number | null;
  content_id: number;
  created_at: string | null;
  fix_recommendation: string | null;
  id: number;
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

  // Access scores array directly
  const contentScores = scoresData as Score[] | undefined;

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
        <h1 className="text-3xl font-bold">Content Report</h1>
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
            imageSrc={undefined}
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
            <TabsList className="grid grid-cols-3 mb-6">
              <TabsTrigger value="performance">Performance Scores</TabsTrigger>
              <TabsTrigger value="details">Content Details</TabsTrigger>
              <TabsTrigger value="improvements">Areas to Improve</TabsTrigger>
            </TabsList>
            
            {/* Performance Scores Tab Content */}
            <TabsContent value="performance" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {contentScores && contentScores.map((score: Score, index: number) => (
                  <ScoreCard
                    key={index}
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
                <CardContent className="p-6">
                  <div className="space-y-6">
                    {/* Content Overview */}
                    {/* body no longer exists, so skip this section */}
                    
                    {/* Content Goals - Placeholder, replace with actual data if available */}
                    <div className="space-y-2">
                      <h3 className="text-lg font-medium flex items-center gap-2">
                        <span className="w-5 h-5 text-primary">🎯</span>
                        Content Goals
                      </h3>
                      <ul className="space-y-2">
                        <li className="flex items-start gap-2">
                          <span className="text-muted-foreground mt-1 flex-shrink-0">→</span>
                          <span className="text-muted-foreground">Drive engagement and signups</span>
                        </li>
                        <li className="flex items-start gap-2">
                          <span className="text-muted-foreground mt-1 flex-shrink-0">→</span>
                          <span className="text-muted-foreground">Explain product features clearly</span>
                        </li>
                      </ul>
                    </div>
                    
                    {/* Metadata in a grid */}
                    <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-3 gap-4 pt-2">
                      <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span className="w-4 h-4">📅</span>
                          <span>Published On</span>
                        </div>
                        <p className="font-medium">
                          {contentDetails?.created_at ? new Date(contentDetails.created_at).toLocaleDateString() : "Not specified"}
                        </p>
                      </div>
                      
                      <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span className="w-4 h-4">⏱️</span>
                          <span>Format</span>
                        </div>
                        <p className="font-medium">{contentDetails?.format || "Not specified"}</p>
                      </div>
                      
                      <div className="flex flex-col p-4 rounded-lg border bg-muted/30">
                        <div className="flex items-center gap-2 text-sm text-muted-foreground mb-1">
                          <span className="w-4 h-4">👥</span>
                          <span>Target Audience</span>
                        </div>
                        <p className="font-medium">{contentDetails?.audience || "Not specified"}</p>
                      </div>
                    </div>
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
                        key={index}
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
          </Tabs>
        </div>
      </div>
    </div>
  );
} 