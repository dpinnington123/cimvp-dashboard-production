import React from 'react';
import { Link } from 'react-router-dom';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Clock, Home, UploadCloud, BarChart3, Hourglass } from 'lucide-react';
import logo from '@/assets/ChangeInfluence-logo.png';
import { Badge } from "@/components/ui/badge";

const ContentProcessingPage: React.FC = () => {
  return (
    <div className="min-h-screen bg-background flex flex-col items-center py-12 px-4 sm:px-6 lg:px-8">
      {/* Header Section */}
      <div className="text-center mb-8">
        {/*<img src={logo} alt="Change Influence Logo" className="w-1/2 h-auto mb-6 mx-auto" />*/}
        <div>
          <Badge variant="outline" className="py-1 px-3 text-xs border-blue-500 text-blue-700 mb-6">
            Content Analysis
          </Badge>  
        </div>
      </div>

      <div className="w-full max-w-md mx-auto">
        <Card className="border border-border/40 shadow-md">
          <CardHeader className="text-center pb-2">
            <div className="flex justify-center mb-4">
              <div className="w-16 h-16 rounded-full bg-blue-50 flex items-center justify-center">
                <Hourglass className="w-8 h-8 text-blue-600 animate-pulse" />
              </div>
            </div>
            <CardTitle className="text-2xl font-semibold">Content Processing</CardTitle>
            <CardDescription className="text-base mt-2">
              Your content has been successfully uploaded and is now being analyzed
            </CardDescription>
          </CardHeader>
          
          <CardContent className="space-y-6 pt-4">
            <div className="bg-muted/30 rounded-lg p-4 border border-border/40">
              <div className="flex items-center gap-2 text-sm text-muted-foreground mb-2">
                <Clock className="h-4 w-4" />
                <span className="font-medium">Processing Time</span>
              </div>
              <p className="text-sm pl-6">
                This process may take a few minutes depending on the size and complexity of your content.
              </p>
            </div>
            
            <div className="space-y-3">
              <p className="text-sm text-muted-foreground text-center">
                The analysis will continue in the background. You can leave this page and check your dashboard later.
              </p>
              
              <div className="flex flex-col gap-3 mt-4">
                <Button asChild variant="default" className="w-full">
                  <Link to="/">
                    <Home className="mr-2 h-4 w-4" />
                    Go to Dashboard
                  </Link>
                </Button>
                
                <Button asChild variant="outline" className="w-full">
                  <Link to="/process-content">
                    <UploadCloud className="mr-2 h-4 w-4" />
                    Upload More Content
                  </Link>
                </Button>
              </div>
            </div>
          </CardContent>
        </Card>
      </div>
    </div>
  );
};

export default ContentProcessingPage; 