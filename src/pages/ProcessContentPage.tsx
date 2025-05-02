import React, { useState } from 'react';
import ContentUploadForm from '@/components/views/processContent/ContentUploadForm';
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import logo from '@/assets/ChangeInfluence-logo.png';
import { ArrowLeftIcon, ArrowRightIcon } from 'lucide-react';
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
          <Link to="/dashboard">
            <Button variant="ghost" size="sm" className="gap-1">
              <span>View All</span>
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
              <Link to={`/content/${content.id}`} key={content.id}>
                <Card className="overflow-hidden border border-border/40 shadow-sm hover:shadow-md transition-shadow">
                  <div className="h-32 bg-muted relative">
                    {content.files && 
                     Array.isArray(content.files) && 
                     content.files.length > 0 && 
                     content.files[0]?.url && 
                     content.files[0]?.type?.startsWith('image/') && (
                      <img 
                        src={content.files[0].url} 
                        alt={content.metadata?.title || 'Untitled Content'}
                        className="w-full h-full object-cover"
                      />
                    )}
                    <Badge 
                      className={`absolute top-2 right-2 ${
                        content.status === 'analyzed' ? 'bg-green-100 text-green-800' :
                        content.status === 'processing' ? 'bg-blue-100 text-blue-800' :
                        content.status === 'error' ? 'bg-red-100 text-red-800' :
                        'bg-gray-100 text-gray-800'
                      }`}
                    >
                      {content.status === 'analyzed' ? 'Analyzed' :
                       content.status === 'processing' ? 'Processing' :
                       content.status === 'error' ? 'Error' :
                       'Pending'}
                    </Badge>
                  </div>
                  <CardHeader className="pb-2">
                    <CardTitle className="text-lg">{content.metadata?.title || 'Untitled Content'}</CardTitle>
                    <CardDescription className="text-xs">
                      {content.createdAt ? new Date(content.createdAt).toLocaleDateString() : 'No date'}
                    </CardDescription>
                  </CardHeader>
                  <CardContent>
                    <p className="text-sm line-clamp-2">{content.metadata?.description || 'No description'}</p>
                  </CardContent>
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
                Upload your first content to get started
              </p>
            </div>
          )}
        </div>
      </div>
    </div>
  );
};

export default ProcessContentPage; 