import { useContentList, useContentDetail } from "@/hooks/useContent";
import LoadingSpinner from "@/components/common/LoadingSpinner";
import ErrorDisplay from "@/components/common/ErrorDisplay";
import { useParams, Link, useNavigate } from "react-router-dom";
import { useScores, useCategoryReviewSummaries } from "@/hooks/useScores";
import { type CategoryReviewSummary } from "@/services/scoreService";
import React, { useState, useEffect } from "react";
import { supabase } from "@/lib/supabaseClient"; // Import supabase client
import eyeTrackingImage from "../assets/eyetracking.png"; // Import the eye tracking image
import { useToast } from "@/hooks/use-toast";

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
  Thermometer, Smile, ChevronDown, BookmarkCheck, Trash2, MoreVertical
} from "lucide-react";

// Import our content report components
import { ContentPreview } from "@/components/views/content-reports/ContentPreview";
import { ScoreCard } from "../components/views/content-reports/ScoreCard";
import { ImprovementArea } from "@/components/views/content-reports/ImprovementArea";
import { CircularProgressIndicator } from "@/components/common/CircularProgressIndicator";
import { DetailItem } from "@/components/views/content-reports/DetailItem";
import { CharacteristicCard } from "@/components/views/content-reports/CharacteristicCard";
import { Button } from "@/components/ui/button";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

// Define score type based on error messages
type Score = {
  id: number;
  content_review_id: number; // Changed from content_id to content_review_id
  check_id: number;
  check_name: string | null;
  check_sub_category: string | null; // Added check_sub_category field
  client_id: string | null;
  comments: string | null;
  confidence: number | null;
  created_at: string | null;
  fix_recommendation: string | null; // Was previously fix_recommendation
  score_value: number | null; // Scores from database are on a scale of 0-5
  updated_at: string | null;
  check_description?: string | null; // Optional field that might be present
};

// Define type for processed characteristic data
type CharacteristicData = {
  id: number;
  label: string;
  value: string | number;
  comments: string | null;
  icon: React.ReactNode;
};

// Define types for the category scores data structure
type CategoryData = {
  checks: Score[];
  average: number;
};

type CategoryScores = {
  [key: string]: CategoryData;
} | null;

// Helper function to convert score from 0-10   scale to 0-100 percentage
const convertScoreToPercentage = (score: number | null): number => {
  if (score === null) return 0;
  // Ensure score is in range 0-10 before converting
  const clampedScore = Math.max(0, Math.min(10, score));
  // Convert to percentage (0-100)
  return Math.round(clampedScore * 10);
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

// Helper function to get characteristic icon based on check_name
const getCharacteristicIcon = (checkName: string | null): React.ReactNode => {
  switch (checkName) {
    case 'Number of Headlines':
      return <Hash className="w-4 h-4" />;
    case 'Number of Images':
      return <ImageIcon className="w-4 h-4" />;
    case 'Number of Videos':
      return <Video className="w-4 h-4" />;
    case 'Number of Pages':
      return <FileTextIcon className="w-4 h-4" />;
    case 'Number of Words':
      return <AlignLeft className="w-4 h-4" />;
    case 'Reading Age':
      return <Thermometer className="w-4 h-4" />;
    case 'CTA Effectiveness':
      return <TargetIcon className="w-4 h-4" />;
    default:
      return <InfoIcon className="w-4 h-4" />; // Default icon
  }
};

export default function ContentReportsPage() {
  // --- State Management ---
  const { contentId: contentIdParam } = useParams<{ contentId: string }>();
  const navigate = useNavigate();
  const { toast } = useToast();

  // If contentIdParam exists, we're in detail view, otherwise list view
  const isDetailView = !!contentIdParam;

  // Parse contentId from string param to number or null
  const contentId = contentIdParam ? parseInt(contentIdParam, 10) : null;
  // Optional: Add check if parsing failed (result is NaN)
  const isValidId = contentId !== null && !isNaN(contentId);

  // State to control how many improvement cards to show
  const [improvementsToShow, setImprovementsToShow] = useState(4);
  
  // State to track saved improvement areas
  const [savedImprovements, setSavedImprovements] = useState<Set<number>>(new Set());
  
  // State to track removed improvement areas (only for the current session)
  const [removedImprovements, setRemovedImprovements] = useState<Set<number>>(new Set());

  // State to track hidden content items (UI-only removal)
  const [hiddenContentIds, setHiddenContentIds] = useState<Set<number>>(() => {
    // Initialize from localStorage if available
    const savedHiddenIds = localStorage.getItem('hiddenContentIds');
    return savedHiddenIds ? new Set(JSON.parse(savedHiddenIds)) : new Set<number>();
  });

  // Save hidden content IDs to localStorage whenever they change
  useEffect(() => {
    localStorage.setItem('hiddenContentIds', JSON.stringify(Array.from(hiddenContentIds)));
  }, [hiddenContentIds]);

  // Function to handle saving an improvement
  const handleSaveImprovement = (id: string | number) => {
    setSavedImprovements(prev => {
      const newSet = new Set(prev);
      if (newSet.has(Number(id))) {
        newSet.delete(Number(id));
      } else {
        newSet.add(Number(id));
      }
      return newSet;
    });
  };

  // Function to handle removing an improvement from the list
  const handleRemoveImprovement = (id: string | number) => {
    // Add to removed set (will hide it for the session)
    setRemovedImprovements(prev => {
      const newSet = new Set(prev);
      newSet.add(Number(id));
      return newSet;
    });
    
    // Also remove from saved set if it was saved
    setSavedImprovements(prev => {
      const newSet = new Set(prev);
      newSet.delete(Number(id));
      return newSet;
    });
  };

  // Function to handle UI-only removal of content
  const handleHideContent = (id: number) => {
    console.log(`Hiding content with ID: ${id} from UI only`);
    
    // Add to hidden set
    setHiddenContentIds(prev => {
      const newSet = new Set(prev);
      newSet.add(id);
      return newSet;
    });
    
    // Show success toast
    toast({
      title: "Report hidden",
      description: "The report has been removed from your view.",
    });
    
    // If we're in detail view, navigate back to the list
    if (isDetailView) {
      navigate('/content-reports');
    }
  };

  // --- Data Fetching ---
  // For list view: fetch the list of content items
  const {
    data: contentList,
    isLoading: isLoadingList,
    error: errorList,
    refetch: refetchList,
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

  // For detail view: fetch category review summaries for the specific content item
  const {
    data: categoryReviewSummaries,
    isLoading: isLoadingCategorySummaries,
    error: errorCategorySummaries,
  } = useCategoryReviewSummaries(isValidId ? contentId : null, { enabled: isDetailView && isValidId });

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

  // Generate characteristics data from scores where check_sub_category is 'Characteristics'
  const characteristicsData = React.useMemo((): CharacteristicData[] => {
    if (!contentScores) return [];
    
    // Filter scores where check_sub_category is 'Characteristics'
    return contentScores
      .filter(score => score.check_sub_category === 'Characteristics')
      .map(score => ({
        id: score.id,
        label: score.check_name || 'Unknown Characteristic',
        value: score.score_value || 0, // Use the exact score_value without conversion
        comments: score.comments, // Pass comments to be displayed on the back of the card
        icon: getCharacteristicIcon(score.check_name),
      }));
  }, [contentScores]);

  // Define a mapping between database category names and display names
  const categoryDisplayMap: Record<string, string> = {
    "Strategic alignment": "Strategic Alignment",
    "Customer alignment": "Customer Alignment",
    // "Content alignment": "Content  Alignment", //Change Back to Execution Effectiveness once we have the data
    "Content effectiveness": "Content Effectiveness",
    // Add fallbacks for possible variations in the database
    "strategic alignment": "Strategic Alignment",
    "customer alignment": "Customer Alignment",
    // "content alignment": "Content Alignment", //Change Back to Execution Effectiveness once we have the data
    "content effectiveness": "Content Effectiveness"
  };
  
  // Define the category descriptions
  const categoryDescriptions: Record<string, string> = {
    "Strategic Alignment": "Alignment with business priorities",
    "Customer Alignment": "Customer focus and relevance",
    // "Content Alignment": "Content alignment with customer needs", //Change Back to Execution Effectiveness once we have the data
    "Content Effectiveness": "Highlights the content effectiveness"
  };

  // Group scores by category and calculate averages for Performance Scores tab
  const categoryScores = React.useMemo<CategoryScores>(() => {
    if (!contentScores) return null; // Guard: If no contentScores, no calculations can be done.

    const result: CategoryScores = {};
    // These are the canonical display names for categories we want to show.
    const targetCategories = ["Strategic Alignment", "Customer Alignment", "Content Effectiveness"];

    targetCategories.forEach(categoryDisplayName => {
      // Filter contentScores to get all checks belonging to the current categoryDisplayName.
      // A score belongs to this categoryDisplayName if its 'check_sub_category' (from the database)
      // can be mapped to this categoryDisplayName using the categoryDisplayMap.
      const categoryChecks = contentScores.filter(score => {
        if (!score.check_sub_category) return false;

        // Attempt to map the score's database sub-category to a canonical display name.
        // Checks categoryDisplayMap with the original casing and lowercase version of the score's sub-category.
        const mappedScoreDisplayName = categoryDisplayMap[score.check_sub_category] || 
                                     categoryDisplayMap[score.check_sub_category.toLowerCase()];
        
        if (mappedScoreDisplayName) {
          // Compare the mapped display name (from score) with the current target categoryDisplayName.
          // Normalization (toLowerCase, replace spaces/hyphens) for robust comparison.
          return mappedScoreDisplayName.toLowerCase().replace(/[-_\s]+/g, ' ') === 
                 categoryDisplayName.toLowerCase().replace(/[-_\s]+/g, ' ');
        }
        return false; // If the score's sub-category doesn't map to a known display name.
      });

      let averageScore = 0;

      // Find if there's a pre-calculated summary for this categoryDisplayName in categoryReviewSummaries.
      const summary = categoryReviewSummaries?.find(s => {
        if (!s.category_name) return false;

        // Attempt to map the summary's database category name to a canonical display name.
        const mappedSummaryDisplayName = categoryDisplayMap[s.category_name] ||
                                        categoryDisplayMap[s.category_name.toLowerCase()];
        
        if (mappedSummaryDisplayName) {
          // Compare the mapped display name (from summary) with the current target categoryDisplayName.
          return mappedSummaryDisplayName.toLowerCase().replace(/[-_\s]+/g, ' ') === 
                 categoryDisplayName.toLowerCase().replace(/[-_\s]+/g, ' ');
        }
        return false;
      });

      if (summary && summary.category_score !== null && !isNaN(summary.category_score)) {
        // If a valid summary score exists, use it.
        averageScore = Math.round(summary.category_score);
      } else {
        // Otherwise, calculate the average from the collected categoryChecks.
        if (categoryChecks.length > 0) {
          const sum = categoryChecks.reduce((acc, check) => acc + convertScoreToPercentage(check.score_value), 0);
          averageScore = Math.round(sum / categoryChecks.length);
        } else {
          averageScore = 0; // Default to 0 if no checks and no valid summary.
        }
      }

      result[categoryDisplayName] = {
        checks: categoryChecks,
        average: averageScore,
      };
    });

    return result;
  }, [contentScores, categoryReviewSummaries, categoryDisplayMap]);

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
    ? (isLoadingDetails || isLoadingScores || isLoadingCategorySummaries) 
    : isLoadingList;
  
  const error = isDetailView 
    ? (errorDetails || errorScores || errorCategorySummaries)
    : errorList;

  // Show loader while fetching data
  if (isLoading) {
    return <LoadingSpinner />;
  }

  // Handle errors
  if (error) {
    return <ErrorDisplay error={error} message="Failed to load content data." />;
  }

  // Filter out hidden content items for list view and sort by most recent first
  const filteredContentList = contentList?.filter(item => !hiddenContentIds.has(item.id))
    .sort((a, b) => {
      // Sort by created_at date in descending order (most recent first)
      const dateA = a.created_at ? new Date(a.created_at).getTime() : 0;
      const dateB = b.created_at ? new Date(b.created_at).getTime() : 0;
      return dateB - dateA; // Descending order (newest first)
    }) || [];

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
                {filteredContentList && filteredContentList.length > 0 ? (
                  filteredContentList.map((item: any) => (
                    <TableRow key={item.id}>
                      <TableCell>{item.content_name || 'Untitled'}</TableCell>
                      <TableCell>{item.format || 'Unknown'}</TableCell>
                      <TableCell>
                        {item.created_at 
                          ? new Date(item.created_at).toLocaleDateString() 
                          : 'Unknown'}
                      </TableCell>
                      <TableCell>
                        <div className="flex items-center gap-2">
                          <Link 
                            to={`/content-reports/${item.id}`}
                            className="px-3 py-1 bg-blue-500 text-white rounded hover:bg-blue-600 text-sm"
                          >
                            View Report
                          </Link>
                          
                          <AlertDialog>
                            <AlertDialogTrigger asChild>
                              <Button variant="outline" size="sm" className="px-2 ml-5">
                                <Trash2 className="h-4 w-4"/>
                              </Button>
                            </AlertDialogTrigger>
                            <AlertDialogContent>
                              <AlertDialogHeader>
                                <AlertDialogTitle>Hide Content Report</AlertDialogTitle>
                                <AlertDialogDescription>
                                  Are you sure you want to hide this content report? You won't see it in the list anymore.
                                </AlertDialogDescription>
                              </AlertDialogHeader>
                              <AlertDialogFooter>
                                <AlertDialogCancel>Cancel</AlertDialogCancel>
                                <AlertDialogAction onClick={() => handleHideContent(item.id)}>
                                  Hide
                                </AlertDialogAction>
                              </AlertDialogFooter>
                            </AlertDialogContent>
                          </AlertDialog>
                        </div>
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

  // For detail view, check if this content is hidden (if in URL directly)
  if (contentId && hiddenContentIds.has(contentId)) {
    return (
      <div className="p-6">
        <h1 className="text-2xl font-semibold mb-4">Report Hidden</h1>
        <p>This content report has been hidden from your view.</p>
        <Link 
          to="/content-reports"
          className="mt-4 inline-block px-4 py-2 bg-blue-500 text-white rounded hover:bg-blue-600"
        >
          Return to Content List
        </Link>
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
      <header className="mb-6 flex justify-between items-start">
        <div>
          <h1 className="text-3xl font-bold">{contentDetails?.content_name || 'Content Report'}</h1>
          <p className="text-muted-foreground mt-1">
            Comprehensive analysis of content performance and recommendations for optimization.
          </p>
        </div>
        
        <div className="flex gap-2">
          <AlertDialog>
            <AlertDialogTrigger asChild>
              <Button variant="outline" size="sm" className="flex items-center gap-1">
                <Trash2 className="h-4 w-4" />
                Hide Report
              </Button>
            </AlertDialogTrigger>
            <AlertDialogContent>
              <AlertDialogHeader>
                <AlertDialogTitle>Hide Content Report</AlertDialogTitle>
                <AlertDialogDescription>
                  Are you sure you want to hide "{contentDetails?.content_name || 'this content report'}"? 
                  You won't see it in the list anymore.
                </AlertDialogDescription>
              </AlertDialogHeader>
              <AlertDialogFooter>
                <AlertDialogCancel>Cancel</AlertDialogCancel>
                <AlertDialogAction onClick={() => handleHideContent(contentId!)}>
                  Hide
                </AlertDialogAction>
              </AlertDialogFooter>
            </AlertDialogContent>
          </AlertDialog>
          
          <Link 
            to="/process-content"
            className="px-4 py-2 bg-green-500 text-white rounded hover:bg-green-600 text-sm"
          >
           + Upload New Content
          </Link>
        </div>
      </header>

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
              <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
                {categoryScores && Object.entries(categoryScores).map(([category, data]) => (
                  <div key={category} className="flex flex-col gap-4">
                    {/* Category Summary Card */}
                    <Card className="animate-in fade-in">
                      <CardHeader className="pb-2">
                        <CardTitle className="text-base font-medium tracking-wide text-center">
                          {category.toUpperCase()}
                        </CardTitle>
                        <CardDescription className="text-center text-xs">
                          {categoryDescriptions[category] || "Performance metrics"}
                        </CardDescription>
                      </CardHeader>
                      <CardContent className="pt-2 pb-6 flex flex-col items-center">
                        <div className="mb-4">
                          <CircularProgressIndicator 
                            value={data.average || 0} 
                            size={96} 
                            strokeWidth={8}
                          />
                        </div>
                        <div className="text-3xl font-bold">
                          {data.average !== undefined && !isNaN(data.average) 
                            ? `${data.average}%` 
                            : "N/A"}
                        </div>
                        
                        {/* Progress bar for context (low/average/high) */}
                        <div className="w-full mt-6 relative">
                          {/* Progress bar background */}
                          <div className="h-2 w-full bg-gradient-to-r from-red-500 via-amber-500 to-emerald-500 rounded-full" />
                          
                          {/* Marker for the score - only show if we have a valid score */}
                          {data.average !== undefined && !isNaN(data.average) && (
                            <div 
                              className="absolute top-0 transform -translate-x-1/2" 
                              style={{ 
                                left: `${Math.max(0, Math.min(100, data.average))}%`,
                                marginTop: '-8px' 
                              }}
                            >
                              <div className="w-0 h-0 border-l-[8px] border-r-[8px] border-b-[8px] border-l-transparent border-r-transparent border-b-amber-500" />
                            </div>
                          )}
                          
                          {/* Labels */}
                          <div className="flex justify-between mt-1 text-xs text-muted-foreground">
                            <span>Low</span>
                            <span>
                              Average ({data.average >= 60 
                                ? (data.average >= 80 ? '35%' : '48%') 
                                : '49%'})
                            </span>
                            <span>High</span>
                          </div>
                        </div>
                      </CardContent>
                    </Card>
                    
                    {/* Individual Score Cards for this category */}
                    {data.checks
                      // Sort by score_value in ascending order (lowest first)
                      .sort((a, b) => {
                        const scoreA = convertScoreToPercentage(a.score_value);
                        const scoreB = convertScoreToPercentage(b.score_value);
                        return scoreA - scoreB;
                      })
                      .map((score) => (
                        <ScoreCard
                          key={score.id}
                          title={score.check_name || `Score`}
                          value={convertScoreToPercentage(score.score_value)}
                          description={score.check_description || score.comments || "This metric evaluates an aspect of your content's effectiveness."}
                          className="animate-in fade-in zoom-in-95"
                          style={{ animationDelay: `${Math.random() * 0.2}s` }} // Random animation delay
                          check_id={score.check_id} // Pass the check_id to fetch what_it_measures
                        />
                      ))}

                    {/* Message when no checks are available for this category */}
                    {data.checks.length === 0 && (
                      <Card className="py-4 px-3 text-center bg-muted/30">
                        <CardContent className="p-0">
                          <p className="text-sm text-muted-foreground">
                            No detailed metrics available for this category.
                          </p>
                        </CardContent>
                      </Card>
                    )}
                  </div>
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
              {/* Saved Improvements Section - Only show if there are saved items */}
              {savedImprovements.size > 0 && (
                <div className="mb-6">
                  <h3 className="text-lg font-medium mb-3 flex items-center">
                    <BookmarkCheck className="w-5 h-5 text-primary mr-2" />
                    Saved Improvements
                  </h3>
                  <div className="grid grid-cols-1 gap-4 mb-6">
                    {contentScores && contentScores
                      .filter((score: Score) => 
                        score.fix_recommendation && 
                        convertScoreToPercentage(score.score_value) < 80 &&
                        savedImprovements.has(score.id) &&
                        !removedImprovements.has(score.id)
                      )
                      .map((score: Score, index: number) => {
                        // Determine priority based on converted percentage score
                        const percentageScore = convertScoreToPercentage(score.score_value);
                        let priority: 'high' | 'medium' | 'low' = 'medium';
                        if (percentageScore < 50) priority = 'high';
                        else if (percentageScore >= 70) priority = 'low';
                        
                        return (
                          <ImprovementArea
                            key={`saved-${score.id}`}
                            id={score.id}
                            title={score.check_name || `Improvement Area ${index + 1}`}
                            description={score.fix_recommendation || "No specific recommendation provided."}
                            priority={priority}
                            className="animate-in fade-in-up border-primary/40"
                            initialSaved={true}
                            onSave={handleSaveImprovement}
                            onRemove={handleRemoveImprovement}
                          />
                        );
                      })}
                  </div>
                  <div className="border-b border-dashed my-4"></div>
                </div>
              )}
              
              {/* All Improvements */}
              <h3 className="text-lg font-medium mb-3">Recommended Improvements</h3>
              <div className="grid grid-cols-1 gap-4">
                {contentScores && contentScores
                  .filter((score: Score) => 
                    score.fix_recommendation && 
                    convertScoreToPercentage(score.score_value) < 80 &&
                    !savedImprovements.has(score.id) &&
                    !removedImprovements.has(score.id)
                  )
                  // Sort by priority: high (lowest scores) to low (highest scores)
                  .sort((a, b) => {
                    const scoreA = convertScoreToPercentage(a.score_value);
                    const scoreB = convertScoreToPercentage(b.score_value);
                    return scoreA - scoreB; // Lowest scores (high priority) first
                  })
                  .slice(0, improvementsToShow)
                  .map((score: Score, index: number) => {
                    // Determine priority based on converted percentage score
                    const percentageScore = convertScoreToPercentage(score.score_value);
                    let priority: 'high' | 'medium' | 'low' = 'medium';
                    if (percentageScore < 50) priority = 'high';
                    else if (percentageScore >= 70) priority = 'low';
                    
                    return (
                      <ImprovementArea
                        key={score.id}
                        id={score.id}
                        title={score.check_name || `Improvement Area ${index + 1}`}
                        description={score.fix_recommendation || "No specific recommendation provided."}
                        priority={priority}
                        className="animate-in fade-in-up"
                        style={{ animationDelay: `${index * 0.1}s` }}
                        initialSaved={savedImprovements.has(score.id)}
                        onSave={handleSaveImprovement}
                        onRemove={handleRemoveImprovement}
                      />
                    );
                  })}
                
                {/* Message when no improvements are needed */}
                {(!contentScores || 
                  !contentScores.filter((score: Score) => 
                    score.fix_recommendation && 
                    convertScoreToPercentage(score.score_value) < 80 &&
                    !savedImprovements.has(score.id) &&
                    !removedImprovements.has(score.id)
                  ).length) && (
                  <Card className="text-center py-6 bg-green-50 dark:bg-green-950/30 border-green-200 dark:border-green-900/50">
                    <CardContent>
                      <h3 className="text-emerald-600 font-medium mb-1">
                        {savedImprovements.size > 0 
                          ? "All improvements saved!" 
                          : removedImprovements.size > 0
                          ? "All improvements hidden"
                          : "Great job! No significant improvements needed."}
                      </h3>
                      <p className="text-sm text-muted-foreground">
                        {savedImprovements.size > 0 
                          ? "You've saved all available improvement suggestions." 
                          : removedImprovements.size > 0
                          ? "You've hidden all improvement suggestions for this session. Reload the page to see them again."
                          : "Your content is performing well across all metrics."}
                      </p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Load More button */}
              {contentScores && 
               contentScores.filter((score: Score) => 
                 score.fix_recommendation && 
                 convertScoreToPercentage(score.score_value) < 80 &&
                 !savedImprovements.has(score.id) &&
                 !removedImprovements.has(score.id)
               ).length > improvementsToShow && (
                <Button
                  variant="outline"
                  className="w-full mt-4 border-dashed"
                  onClick={() => setImprovementsToShow(prev => prev + 4)}
                >
                  <ChevronDown className="mr-2 h-4 w-4" />
                  Load More Improvements
                </Button>
              )}
            </TabsContent>

            {/* Characteristics Tab Content */}
            <TabsContent value="characteristics" className="mt-0 p-0 animate-in fade-in-50">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                {characteristicsData.length > 0 ? (
                  characteristicsData.map((characteristic: CharacteristicData) => (
                    <CharacteristicCard
                      key={characteristic.id}
                      icon={characteristic.icon}
                      label={characteristic.label}
                      value={characteristic.value}
                      comments={characteristic.comments}
                      className="animate-in fade-in zoom-in-95"
                      style={{ animationDelay: `${Math.random() * 0.2}s` }} // Random animation delay
                    />
                  ))
                ) : (
                  <Card className="col-span-full text-center py-6 bg-muted/50 border-border">
                    <CardContent>
                      <h3 className="text-foreground font-medium mb-1">No Characteristics Data</h3>
                      <p className="text-sm text-muted-foreground">No content characteristics found in analysis results.</p>
                    </CardContent>
                  </Card>
                )}
              </div>
              
              {/* Eye Tracking Visualization Section */}
              <div className="mt-8">
                <Card className="col-span-full border-dashed border-2 border-primary/20">
                  <CardHeader>
                    <CardTitle className="text-lg flex items-center gap-2">
                      <Smile className="w-5 h-5 text-primary" />
                      Content Attention Analysis
                    </CardTitle>
                    <CardDescription>
                      Heatmap visualization showing where users focus their attention
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="relative">
                    {/* Coming Soon Sash Overlay */}
                    <div className="absolute top-0 right-0 w-full h-full overflow-hidden pointer-events-none z-10">
                      <div className="absolute top-[20px] right-[-70px] bg-orange-500 text-white py-2 px-20 font-bold text-sm transform rotate-45 shadow-md z-10">
                        COMING SOON
                      </div>
                    </div>
                    
                    {/* Eye Tracking Image */}
                    <div className="rounded-md overflow-hidden bg-muted/30 border">
                      <img 
                        src={eyeTrackingImage} 
                        alt="Eye tracking heatmap visualization" 
                        className="w-full h-auto object-cover rounded" 
                        style={{ maxHeight: '400px' }}
                      />
                    </div>
                    <p className="text-sm text-muted-foreground mt-4">
                      Eye tracking analysis shows where readers spend the most time and what elements catch their attention first.
                    </p>
                  </CardContent>
                </Card>
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