import { useContentList, useContentDetail } from "@/hooks/useContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useParams, Link } from "react-router-dom";
import { useScores } from "@/hooks/useScores";
import React from "react";

// Import UI components
import {
  Table,
  TableBody,
  TableCaption,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from "@/components/ui/table";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { PieChart, Pie, Cell, ResponsiveContainer } from 'recharts';

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
  score_value: number | null;
  updated_at: string | null;
  check_description?: string | null; // Optional field that might be present
};

export default function ContentEffectivenessPage() {
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
  // This is a temporary solution to navigate to content detail views
  if (!isDetailView) {
    return (
      <div className="p-6 space-y-6">
        <header>
          <h1 className="text-3xl font-bold">Content Effectiveness</h1>
          <p className="text-muted-foreground mt-1">
            Select a content item to view its detailed effectiveness report
          </p>
        </header>

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
                      <TableCell>{item.title || 'Untitled'}</TableCell>
                      <TableCell>{item.format_type || 'Unknown'}</TableCell>
                      <TableCell>
                        {item.created_at 
                          ? new Date(item.created_at).toLocaleDateString() 
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <Link 
                          to={`/effectiveness/${item.id}`}
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
          to="/effectiveness"
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
          to="/effectiveness"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Content List
        </Link>
      </div>
    );
  }

  // --- Detail View Content --- 
  // (Content below is for detail view and will only execute if we have contentId, contentDetails and contentScores)

  // Calculate overall score (average of all scores)
  const overallScore = React.useMemo(() => {
    if (!contentScores || contentScores.length === 0) return 0;
    
    const sum = contentScores.reduce((acc: number, score: Score) => {
      return acc + (score.score_value || 0);
    }, 0);
    
    return Math.round(sum / contentScores.length);
  }, [contentScores]);

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

  // Pie chart data for overall score
  const scoreChartData = [
    { name: "Score", value: overallScore },
    { name: "Remaining", value: 100 - overallScore }
  ];

  // --- Page Structure (Main Render for Detail View) ---
  return (
    <div className="p-6 space-y-6">
      {/* Navigation and header */}
      <div className="flex items-center gap-2 mb-4">
        <Link 
          to="/effectiveness"
          className="px-3 py-1 bg-gray-100 hover:bg-gray-200 rounded-full flex items-center gap-1 text-sm"
        >
          ← Back to List
        </Link>
      </div>

      {/* 1. Header Area */}
      <header>
        <h1 className="text-3xl font-bold">Content Effectiveness Report</h1>
        <p className="text-muted-foreground mt-1">
          Comprehensive analysis of content performance and recommendations for optimization.
        </p>
      </header>

      {/* 2. Main Content Grid (Two Columns) */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* 2.1 Left Column */}
        <div className="lg:col-span-1 space-y-6">
          {/* Content Preview Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Content Preview</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="bg-slate-200 dark:bg-slate-700 p-4 rounded-lg min-h-[200px]">
                {/* Image would go here */}
                <div className="flex flex-col h-full justify-end">
                  <div className="bg-black/60 text-white p-3 rounded">
                    <h3 className="font-medium text-lg">{contentDetails?.title || 'Content Title'}</h3>
                    <div className="flex items-center gap-2 text-sm mt-1">
                      <span className="bg-blue-500/80 px-2 py-0.5 rounded-full">
                        {contentDetails?.format_type || 'Content Type'}
                      </span>
                      <span>• {contentDetails?.updated_at ? new Date(contentDetails.updated_at).toLocaleDateString() : 'Date'}</span>
                    </div>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* Overall Score Card */}
          <Card>
            <CardHeader className="pb-2">
              <CardTitle>Overall Score</CardTitle>
              <CardDescription>Based on content performance metrics</CardDescription>
            </CardHeader>
            <CardContent className="flex flex-col items-center">
              <div className="relative w-32 h-32 flex items-center justify-center">
                <ResponsiveContainer width="100%" height="100%">
                  <PieChart>
                    <Pie
                      data={scoreChartData}
                      cx="50%"
                      cy="50%"
                      startAngle={90}
                      endAngle={-270}
                      innerRadius="70%"
                      outerRadius="100%"
                      paddingAngle={0}
                      dataKey="value"
                    >
                      <Cell key="score" fill={getScoreColor(overallScore)} />
                      <Cell key="remaining" fill="#e2e8f0" />
                    </Pie>
                  </PieChart>
                </ResponsiveContainer>
                <div className="absolute inset-0 flex items-center justify-center">
                  <span className="text-4xl font-bold">{overallScore}%</span>
                </div>
              </div>
              <span className="mt-2 px-3 py-1 rounded-full text-sm font-medium"
                style={{ 
                  backgroundColor: `${getScoreColor(overallScore)}20`, 
                  color: getScoreColor(overallScore)
                }}>
                {getScoreLabel(overallScore)}
              </span>
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
            <TabsContent value="performance" className="space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contentScores && contentScores.map((score: Score, index: number) => (
                  <Card key={index}>
                    <CardHeader className="pb-2">
                      <CardTitle className="text-lg">{score.check_name || `Score ${index + 1}`}</CardTitle>
                    </CardHeader>
                    <CardContent>
                      <div className="flex justify-between items-center">
                        <div className="relative w-20 h-20 flex items-center justify-center">
                          <ResponsiveContainer width="100%" height="100%">
                            <PieChart>
                              <Pie
                                data={[
                                  { name: "Score", value: score.score_value || 0 },
                                  { name: "Remaining", value: 100 - (score.score_value || 0) }
                                ]}
                                cx="50%"
                                cy="50%"
                                startAngle={90}
                                endAngle={-270}
                                innerRadius="65%"
                                outerRadius="100%"
                                paddingAngle={0}
                                dataKey="value"
                              >
                                <Cell key="score" fill={getScoreColor(score.score_value || 0)} />
                                <Cell key="remaining" fill="#e2e8f0" />
                              </Pie>
                            </PieChart>
                          </ResponsiveContainer>
                          <div className="absolute inset-0 flex items-center justify-center">
                            <span className="text-xl font-bold">{score.score_value || 0}%</span>
                          </div>
                        </div>
                        <div className="flex-1 ml-4">
                          <p className="text-sm text-gray-500">
                            {score.check_description || score.comments || "This metric evaluates an aspect of your content's effectiveness."}
                          </p>
                        </div>
                      </div>
                    </CardContent>
                  </Card>
                ))}
              </div>
            </TabsContent>
            
            {/* Content Details Tab Content */}
            <TabsContent value="details">
              <Card>
                <CardHeader>
                  <CardTitle>Content Information</CardTitle>
                  <CardDescription>Full details about this content</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                  <div>
                    <h3 className="font-medium mb-1">Content Body</h3>
                    <p className="text-sm text-gray-600 border p-3 rounded-md">
                      {contentDetails?.body || 'No content body available.'}
                    </p>
                  </div>
                  
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    <div>
                      <h3 className="font-medium mb-1">Created Date</h3>
                      <p className="text-sm">{contentDetails?.created_at ? new Date(contentDetails.created_at).toLocaleDateString() : 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Client ID</h3>
                      <p className="text-sm">{contentDetails?.client_id || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Audience Type</h3>
                      <p className="text-sm">{contentDetails?.audience_type || 'N/A'}</p>
                    </div>
                    <div>
                      <h3 className="font-medium mb-1">Format</h3>
                      <p className="text-sm">{contentDetails?.format_type || 'N/A'}</p>
                    </div>
                    {/* Display any additional metadata */}
                    {contentDetails?.metadata && typeof contentDetails.metadata === 'object' && 
                      Object.entries(contentDetails.metadata).map(([key, value]) => (
                        <div key={key}>
                          <h3 className="font-medium mb-1">{key.charAt(0).toUpperCase() + key.slice(1).replace('_', ' ')}</h3>
                          <p className="text-sm">{typeof value === 'string' ? value : JSON.stringify(value)}</p>
                        </div>
                      ))
                    }
                  </div>
                </CardContent>
              </Card>
            </TabsContent>
            
            {/* Areas to Improve Tab Content */}
            <TabsContent value="improvements">
              <Card>
                <CardHeader>
                  <CardTitle>Improvement Recommendations</CardTitle>
                  <CardDescription>Suggestions to enhance content performance</CardDescription>
                </CardHeader>
                <CardContent>
                  <ul className="space-y-4">
                    {contentScores && contentScores
                      .filter((score: Score) => score.fix_recommendation && (score.score_value || 0) < 80)
                      .map((score: Score, index: number) => (
                        <li key={index} className="border-b pb-3 last:border-b-0">
                          <div className="flex items-center gap-2">
                            <h3 className="font-medium">{score.check_name}</h3>
                            <span className="text-sm px-2 py-0.5 rounded-full"
                              style={{ 
                                backgroundColor: `${getScoreColor(score.score_value || 0)}20`, 
                                color: getScoreColor(score.score_value || 0)
                              }}>
                              {score.score_value}%
                            </span>
                          </div>
                          <p className="text-sm text-gray-600 mt-1">{score.fix_recommendation}</p>
                        </li>
                      ))}
                    
                    {/* Message when no improvements are needed */}
                    {(!contentScores || 
                      !contentScores.filter((score: Score) => score.fix_recommendation && (score.score_value || 0) < 80).length) && (
                      <li className="text-center py-6">
                        <p className="text-green-600 font-medium">Great job! No significant improvements needed.</p>
                        <p className="text-sm text-gray-500 mt-1">Your content is performing well across all metrics.</p>
                      </li>
                    )}
                  </ul>
                </CardContent>
              </Card>
            </TabsContent>
          </Tabs>
        </div>
      </div>
    </div>
  );
} 