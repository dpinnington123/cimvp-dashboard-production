import React, { useState } from 'react';
import { useToast } from "@/hooks/use-toast";
import { Button } from "@/components/ui/button";
import { Card, CardContent, CardDescription, CardFooter, CardHeader, CardTitle } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { Separator } from "@/components/ui/separator";
import { ScrollArea } from "@/components/ui/scroll-area";
import FileDropzone from "@/components/views/processContent/FileDropzone";
import UploadPreview from "@/components/views/processContent/UploadPreview";
import { ArrowRight, Info, Tag, CalendarClock, Globe, File, CheckCircle, Users, Target, FileText, FileImage, FileVideo, FileAudio, Layout, BarChart3, Building2, BriefcaseBusiness, Banknote, Layers } from 'lucide-react';
import { useNavigate } from "react-router-dom";
import { ContentFile } from '@/services/uploadService';
import useContent from '@/hooks/useContent';

type ContentFormState = {
  content_name: string;
  agency: string;
  audience: string;
  campaign_aligned_to: string;
  content_objectives: string;
  expiry_date: string;
  format: string;
  funnel_alignment: string;
  strategy_aligned_to: string;
  status: string;
  type: string;
};

const ContentUploadForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { useUploadContentMutation } = useContent();
  const uploadContentMutation = useUploadContentMutation();
  
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [metadata, setMetadata] = useState<ContentFormState>({
    content_name: '',
    agency: '',
    audience: '',
    campaign_aligned_to: '',
    content_objectives: '',
    expiry_date: '',
    format: '',
    funnel_alignment: '',
    strategy_aligned_to: '',
    status: '',
    type: '',
  });
  const [currentStep, setCurrentStep] = useState(1);
  
  // isSubmitting now uses the mutation loading state
  const isSubmitting = uploadContentMutation.isPending;

  const handleFilesAdded = (newFiles: File[]) => {
    const newFilesList = newFiles.map(file => ({
      file,
      id: Math.random().toString(36).substring(2, 11),
      preview: file.type.startsWith('image/') ? URL.createObjectURL(file) : undefined
    }));
    setFiles(prev => [...prev, ...newFilesList]);
    if (newFilesList.length > 0) {
      toast({
        title: "Files added",
        description: `${newFilesList.length} file${newFilesList.length > 1 ? 's' : ''} ready for upload`
      });
    }
  };

  const removeFile = (id: string) => {
    setFiles(prev => {
      const newFiles = prev.filter(file => file.id !== id);
      const fileToRemove = prev.find(file => file.id === id);
      if (fileToRemove?.preview) {
        URL.revokeObjectURL(fileToRemove.preview);
      }
      return newFiles;
    });
  };

  const handleMetadataChange = (key: string, value: string) => {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please upload at least one file to continue.",
        variant: "destructive"
      });
      return;
    }
    if (!metadata.content_name) {
      toast({
        title: "Title required",
        description: "Please provide a title for your content.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Map the form fields to the ContentMetadata type
      const mappedMetadata = {
        title: metadata.content_name, // REQUIRED
        description: "", // Not in form but required by interface
        category: "", // Not in form but required by interface
        audience: metadata.audience,
        businessObjective: metadata.content_objectives,
        contentFormat: metadata.format,
        tags: [], // Not in form but required by interface
        publishDate: new Date().toISOString(), // Use current date
        expiryDate: metadata.expiry_date,
        location: "",
        campaign: metadata.campaign_aligned_to,
        agency: metadata.agency,
        cost: "",
        contentType: metadata.type
      };
      
      console.log('Mapped metadata:', mappedMetadata);
      
      // Use the mutation to upload content with properly mapped fields
      const result = await uploadContentMutation.mutateAsync({ 
        files, 
        metadata: mappedMetadata
      });
      
      if (result.error || !result.data) {
        throw result.error || new Error('Failed to upload content');
      }
      
      // Clean up any preview URLs to prevent memory leaks
      files.forEach(file => {
        if (file.preview) {
          URL.revokeObjectURL(file.preview);
        }
      });
      
      toast({
        title: "Upload successful",
        description: "Your content has been uploaded and is being processed for analysis."
      });
      
      // Reset form and go to next step for analysis
      setFiles([]);
      setMetadata({
        content_name: '',
        agency: '',
        audience: '',
        campaign_aligned_to: '',
        content_objectives: '',
        expiry_date: '',
        format: '',
        funnel_alignment: '',
        strategy_aligned_to: '',
        status: '',
        type: '',
      });
      
      // Move to the next step (analysis)
      setCurrentStep(3);
      
      // After 2 seconds, navigate to view the content
      setTimeout(() => {
        if (result.data) {
          navigate(`/content/${result.data.id}`);
        } else {
          navigate('/dashboard');
        }
      }, 2000);
      
    } catch (error) {
      console.error('Upload error:', error);
      toast({
        title: "Upload failed",
        description: "There was an error uploading your content. Please try again.",
        variant: "destructive"
      });
    }
  };

  const getStepStatus = (step: number) => {
    if (step === 1) {
      return files.length > 0 ? 'complete' : 'current';
    }
    if (step === 2) {
      return metadata.content_name ? 'complete' : files.length > 0 ? 'current' : 'incomplete';
    }
    if (step === 3) {
      return currentStep === 3 ? 'current' : 'incomplete';
    }
    return 'incomplete';
  };

  return (
    <form onSubmit={handleSubmit} className="w-full max-w-4xl mx-auto animate-fade-in">
      <Card className="border border-border/40 shadow-sm">
        <CardHeader className="space-y-1">
          <CardTitle className="text-2xl font-medium tracking-tight">Upload Content</CardTitle>
          <CardDescription>
            Share your content with additional context information
          </CardDescription>
        </CardHeader>
        
        <CardContent className="p-6 space-y-8">
          <div className="flex justify-between relative">
            <div className="absolute left-0 right-0 top-[15px] h-1 bg-muted/50 -z-10"></div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${getStepStatus(1) === 'complete' ? 'bg-primary/20 border-primary/30 text-primary' : 'bg-muted border-primary/30 text-primary'}`}>
                {getStepStatus(1) === 'complete' ? <CheckCircle className="w-4 h-4" /> : '1'}
              </div>
              <span className="text-xs mt-1 font-medium">Files</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className={`w-8 h-8 rounded-full flex items-center justify-center text-sm border ${getStepStatus(2) === 'complete' ? 'bg-primary/20 border-primary/30 text-primary' : getStepStatus(2) === 'current' ? 'bg-muted border-primary/30 text-primary' : 'bg-muted/50 border-muted-foreground/30 text-muted-foreground'}`}>
                {getStepStatus(2) === 'complete' ? <CheckCircle className="w-4 h-4" /> : '2'}
              </div>
              <span className="text-xs mt-1 font-medium">Context</span>
            </div>
            
            <div className="flex flex-col items-center">
              <div className="w-8 h-8 rounded-full flex items-center justify-center text-sm border bg-muted/50 border-muted-foreground/30 text-muted-foreground">
                3
              </div>
              <span className="text-xs mt-1 font-medium">Analyse</span>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">1. Upload Files</h3>
            <FileDropzone 
              onFilesAdded={handleFilesAdded} 
              accept="image/*,video/*,audio/*,.pdf,.doc,.docx,.ppt,.pptx,.xls,.xlsx" 
              multiple={true} 
              maxSize={50 * 1024 * 1024} // 50MB
              className="min-h-[200px]" 
            />
            
            {files.length > 0 && (
              <div className="space-y-2">
                <h3 className="text-sm font-medium">Selected files ({files.length})</h3>
                <ScrollArea className="h-[200px] rounded-md border">
                  <div className="p-4 space-y-2">
                    <UploadPreview files={files} onRemove={removeFile} />
                  </div>
                </ScrollArea>
              </div>
            )}
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">2. Add Context Information</h3>
            
            <div className="grid gap-6 md:grid-cols-2">
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="content_name" className="flex items-center gap-1">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="content_name" 
                    placeholder="Enter a title for your content" 
                    value={metadata.content_name} 
                    onChange={e => handleMetadataChange('content_name', e.target.value)} 
                    className="focus-ring" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content_objectives">Content Objectives</Label>
                  <Textarea 
                    id="content_objectives" 
                    placeholder="What is the goal of this content?" 
                    value={metadata.content_objectives} 
                    onChange={e => handleMetadataChange('content_objectives', e.target.value)} 
                    className="resize-none h-32 focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="format" className="flex items-center gap-2">
                    <Layout className="h-4 w-4" /> Content Format
                  </Label>
                  <Select 
                    value={metadata.format} 
                    onValueChange={value => handleMetadataChange('format', value)}
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="email">Email</SelectItem>
                      <SelectItem value="social">Social Media</SelectItem>
                      <SelectItem value="website">Website</SelectItem>
                      <SelectItem value="presentation">Presentation</SelectItem>
                      <SelectItem value="infographic">Infographic</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="type" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Type of Content
                  </Label>
                  <Select 
                    value={metadata.type} 
                    onValueChange={value => handleMetadataChange('type', value)}
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select content type" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="hero">Hero</SelectItem>
                      <SelectItem value="driver">Driver</SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="audience" className="flex items-center gap-2">
                    <Users className="h-4 w-4" /> Audience
                  </Label>
                  <div className="flex gap-2">
                    <Select 
                      value={metadata.audience} 
                      onValueChange={value => handleMetadataChange('audience', value)}
                    >
                      <SelectTrigger className="focus-ring flex-1">
                        <SelectValue placeholder="Select target audience" />
                      </SelectTrigger>
                      <SelectContent>
                        <SelectItem value="general">General Public</SelectItem>
                        <SelectItem value="business">Business Professionals</SelectItem>
                        <SelectItem value="technical">Technical Audience</SelectItem>
                        <SelectItem value="policymakers">Policymakers</SelectItem>
                        <SelectItem value="investors">Investors</SelectItem>
                        <SelectItem value="partners">Partners</SelectItem>
                        <SelectItem value="employees">Employees</SelectItem>
                        <SelectItem value="customers">Customers</SelectItem>
                      </SelectContent>
                    </Select>
                    <Button type="button" variant="outline" className="px-3" title="Audience Builder">
                      <Users className="h-4 w-4" />
                    </Button>
                  </div>
                </div>
              </div>
              
              <div className="space-y-4">
                <div className="space-y-2">
                  <Label htmlFor="campaign_aligned_to" className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4" /> Campaign
                  </Label>
                  <Input 
                    id="campaign_aligned_to" 
                    placeholder="Enter campaign name" 
                    value={metadata.campaign_aligned_to} 
                    onChange={e => handleMetadataChange('campaign_aligned_to', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agency" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Agency
                  </Label>
                  <Input 
                    id="agency" 
                    placeholder="Enter agency name" 
                    value={metadata.agency} 
                    onChange={e => handleMetadataChange('agency', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="expiry_date" className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" /> Expiry Date
                  </Label>
                  <Input 
                    id="expiry_date" 
                    type="date" 
                    value={metadata.expiry_date} 
                    onChange={e => handleMetadataChange('expiry_date', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="funnel_alignment" className="flex items-center gap-2">
                    <BarChart3 className="h-4 w-4" /> Funnel Alignment
                  </Label>
                  <Input 
                    id="funnel_alignment" 
                    placeholder="Enter funnel alignment" 
                    value={metadata.funnel_alignment} 
                    onChange={e => handleMetadataChange('funnel_alignment', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy_aligned_to" className="flex items-center gap-2">
                    <Target className="h-4 w-4" /> Strategy Aligned To
                  </Label>
                  <Input 
                    id="strategy_aligned_to" 
                    placeholder="Enter strategy alignment" 
                    value={metadata.strategy_aligned_to} 
                    onChange={e => handleMetadataChange('strategy_aligned_to', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <Info className="h-4 w-4" /> Status
                  </Label>
                  <Input 
                    id="status" 
                    placeholder="Enter status (e.g., draft, published)" 
                    value={metadata.status} 
                    onChange={e => handleMetadataChange('status', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
              </div>
            </div>
          </div>
          
          <Separator />
          
          <div className="space-y-4">
            <h3 className="text-lg font-medium">3. Review and Analyse</h3>
            <p className="text-muted-foreground text-sm">
              Review your uploaded files and context information before analysis.
            </p>
            
            {(files.length > 0 || metadata.content_name) && (
              <div className="space-y-4 bg-muted/20 p-4 rounded-lg border border-border/40">
                {files.length > 0 && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Files ({files.length})</h4>
                    <div className="text-sm text-muted-foreground">
                      {files.map(file => (
                        <div key={file.id} className="flex items-center gap-2">
                          <File className="h-4 w-4" />
                          <span>{file.file.name}</span>
                        </div>
                      ))}
                    </div>
                  </div>
                )}
                
                {metadata.content_name && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Context Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Title:</span> {metadata.content_name}</p>
                      {metadata.content_objectives && <p><span className="font-medium">Content Objectives:</span> {metadata.content_objectives}</p>}
                      {metadata.format && <p><span className="font-medium">Format:</span> {metadata.format}</p>}
                      {metadata.type && <p><span className="font-medium">Type:</span> {metadata.type}</p>}
                      {metadata.audience && <p><span className="font-medium">Audience:</span> {metadata.audience}</p>}
                      {metadata.status && <p><span className="font-medium">Status:</span> {metadata.status}</p>}
                    </div>
                  </div>
                )}
              </div>
            )}
          </div>
        </CardContent>
        
        <CardFooter className="flex justify-between border-t bg-muted/20 px-6 py-4">
          <div className="text-xs text-muted-foreground">
            <p>Accepted file types: Images, Videos, Audio, Documents</p>
            <p>Maximum file size: 50MB</p>
          </div>
          
          <Button 
            type="submit" 
            disabled={isSubmitting || files.length === 0 || !metadata.content_name} 
            className="min-w-[150px]"
          >
            {isSubmitting ? 'Processing...' : (
              <>
                <BarChart3 className="h-4 w-4 mr-2" />
                Analyse Content
              </>
            )}
          </Button>
        </CardFooter>
      </Card>
    </form>
  );
};

export default ContentUploadForm;
