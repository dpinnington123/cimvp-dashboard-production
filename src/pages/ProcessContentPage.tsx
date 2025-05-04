import React, { useState } from 'react';
import ContentUploadForm from '@/components/views/processContent/ContentUploadForm';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logo from '@/assets/ChangeInfluence-logo.png';
import { ArrowLeftIcon, ArrowRightIcon, FileTextIcon, CalendarIcon, BarChart2Icon } from 'lucide-react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import useContent from '@/hooks/useContent';

const ProcessContentPage: React.FC = () => {
  const { useProcessedContentQuery } = useContent();
  const { data: recentContentData, isLoading } = useProcessedContentQuery(5);
  
  return (
    <div className="min-h-screen bg-background text-foreground flex flex-col py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="mb-8">
        <h1 className="text-3xl font-bold tracking-tight mb-1">Add Your Content</h1>
        <p className="text-muted-foreground text-sm">
          1. Upload your files &nbsp; 2. Add the context content &nbsp; 3. Analyse
        </p>
      </div>
      {/* Main Content Area centered */}
      <div className="w-full max-w-5xl mx-auto">
        <ContentUploadForm />
      </div>
      
      {/* Recent Content Section */}
      <div className="w-full max-w-5xl mt-16">
        <div className="flex justify-between items-center mb-4">
          <h2 className="text-xl font-semibold">Recently Processed Content</h2>
          <Link to="/content-reports">
            <Button variant="ghost" size="sm" className="gap-1">
              <span>View All Reports</span>
              <ArrowRightIcon className="h-4 w-4" />
            </Button>
          </Link>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
          {isLoading ? (
            // Skeleton loaders
            Array(3).fill(0).map((_, i) => (
              <Card key={i} className="overflow-hidden border border-border/40 shadow-sm animate-pulse">
                <div className="h-32 bg-muted"></div>
                <CardHeader className="pb-2">
                  <div className="h-5 w-3/4 bg-muted rounded"></div>
                  <div className="h-4 w-1/2 bg-muted rounded mt-2"></div>
                </CardHeader>
                <CardContent>
                  <div className="h-4 bg-muted rounded"></div>
                  <div className="h-4 w-3/4 bg-muted rounded mt-2"></div>
                </CardContent>
              </Card>
            ))
          ) : recentContentData?.data?.length ? (
            // Recent content items
            recentContentData.data.map((content) => (
              <Link to={`/content-reports/${content.id}`} key={content.id}>
                <Card className="overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-32 bg-muted relative">
                    {content.files && 
                     Array.isArray(content.files) && 
                     content.files.length > 0 && 
                     content.files[0]?.url ? (
                      // If it's an image, display it directly
                      content.files[0]?.type?.startsWith('image/') ? (
                        <img 
                          src={content.files[0].url} 
                          alt={content.metadata?.title || 'Untitled Content'}
                          className="w-full h-full object-cover"
                        />
                      ) : content.files[0]?.type?.includes('pdf') ? (
                        // If it's a PDF, show a PDF thumbnail with icon overlay
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100 relative">
                          <div className="bg-red-100 p-4 rounded-full mb-2">
                            <FileTextIcon className="h-10 w-10 text-red-500" />
                          </div>
                          <span className="text-xs font-medium">PDF Document</span>
                          <span className="text-[10px] text-gray-500 mt-1">{content.files[0].name || 'document.pdf'}</span>
                        </div>
                      ) : (
                        // For other file types, show appropriate icon
                        <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                          {content.files[0]?.type?.includes('word') ? (
                            <>
                              <div className="bg-blue-100 p-3 rounded-full mb-1">
                                <FileTextIcon className="h-8 w-8 text-blue-500" />
                              </div>
                              <span className="text-xs font-medium">Word Document</span>
                            </>
                          ) : content.files[0]?.type?.includes('spreadsheet') || content.files[0]?.type?.includes('excel') ? (
                            <>
                              <div className="bg-green-100 p-3 rounded-full mb-1">
                                <FileTextIcon className="h-8 w-8 text-green-500" />
                              </div>
                              <span className="text-xs font-medium">Spreadsheet</span>
                            </>
                          ) : content.files[0]?.type?.includes('html') ? (
                            <>
                              <div className="bg-yellow-100 p-3 rounded-full mb-1">
                                <FileTextIcon className="h-8 w-8 text-yellow-600" />
                              </div>
                              <span className="text-xs font-medium">Web Content</span>
                            </>
                          ) : (
                            <>
                              <div className="bg-gray-200 p-3 rounded-full mb-1">
                                <FileTextIcon className="h-8 w-8 text-gray-500" />
                              </div>
                              <span className="text-xs font-medium">{content.metadata?.title || 'Document'}</span>
                            </>
                          )}
                        </div>
                      )
                    ) : (
                      // Placeholder when no file is available
                      <div className="w-full h-full flex flex-col items-center justify-center bg-gray-100">
                        <div className="bg-gray-200 p-3 rounded-full mb-1">
                          <FileTextIcon className="h-8 w-8 text-gray-500" />
                        </div>
                        <span className="text-xs font-medium">No Preview Available</span>
                      </div>
                    )}
                    
                    {/* Status badge - updated for draft/live status */}
                    <Badge 
                      className={`absolute top-2 right-2 px-2 py-1 ${
                        content.status === 'live' ? 'bg-emerald-100 text-emerald-800 border border-emerald-300' : 
                        'bg-blue-100 text-blue-800 border border-blue-300'
                      }`}
                    >
                      {content.status === 'live' ? 'Live' : 'Draft'}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{content.metadata?.title || 'Untitled Content'}</CardTitle>
                    <CardDescription className="text-xs flex items-center gap-1">
                      <CalendarIcon className="h-3 w-3" />
                      {content.createdAt ? new Date(content.createdAt).toLocaleDateString() : 'No date'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent className="py-2">
                    <p className="text-sm line-clamp-2">{content.metadata?.description || 'No description'}</p>
                  </CardContent>
                  <CardFooter className="pt-2 text-xs text-primary border-t flex items-center gap-1 justify-center">
                    <BarChart2Icon className="h-3 w-3" />
                    <p>View detailed analytics report</p>
                  </CardFooter>
                </Card>
              </Link>
            ))
          ) : (
            // Empty state
            <div className="col-span-full flex flex-col items-center justify-center py-8 text-center">
              <div className="rounded-full bg-muted p-3 mb-3">
                <ArrowLeftIcon className="h-6 w-6 text-muted-foreground" />
              </div>
              <h3 className="font-medium mb-1">No content yet</h3>
              <p className="text-sm text-muted-foreground">
                Upload your first content to get started with analysis
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessContentPage; 