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
import useBrandFormOptions from '@/hooks/useBrandFormOptions';
import { useBrand } from '@/contexts/BrandContext';
import { supabase } from '@/lib/supabaseClient';
import { useAuth } from '@/hooks/useAuth';

type ContentFormState = {
  content_name: string;
  job_id: string;
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
  const { selectedBrand, getBrandData } = useBrand();
  const { user } = useAuth();
  
  // Get the current brand's ID
  const brandData = getBrandData();
  const brandId = brandData?.profile?.id;
  
  // Use the brand form options hook to get dropdown options
  const { 
    campaignOptions,
    audienceOptions,
    strategyOptions, 
    objectiveOptions,
    agencyOptions,
    funnelAlignmentOptions,
    formatOptions,
    typeOptions
  } = useBrandFormOptions();
  
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [metadata, setMetadata] = useState<ContentFormState>({
    content_name: '',
    job_id: '',
    agency: '',
    audience: '',
    campaign_aligned_to: '',
    content_objectives: '',
    expiry_date: '',
    format: '',
    funnel_alignment: '',
    strategy_aligned_to: '',
    status: 'draft',
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
    if (!metadata.job_id) {
      toast({
        title: "Job ID required",
        description: "Please provide a job ID for processing tracking.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Check if job_id already exists to prevent overwrites
      const { data: existingContent } = await supabase
        .from('content')
        .select('id, content_name, created_at')
        .eq('job_id', metadata.job_id)
        .eq('client_id', user?.id)
        .single();

      if (existingContent) {
        const createdDate = new Date(existingContent.created_at).toLocaleDateString();
        toast({
          title: "Job ID already exists",
          description: `Job ID "${metadata.job_id}" is already used by "${existingContent.content_name}" (created ${createdDate}). Please choose a different Job ID.`,
          variant: "destructive"
        });
        return;
      }

      // Ensure we have a brand ID
      if (!brandId) {
        toast({
          title: "No brand selected",
          description: "Please select a brand before uploading content.",
          variant: "destructive"
        });
        return;
      }
      
      // Map the form fields to the ContentMetadata type
      const mappedMetadata = {
        title: metadata.content_name, // REQUIRED
        jobId: metadata.job_id, // REQUIRED - User-provided job identifier
        brandId: brandId, // REQUIRED - Current brand ID
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
      
      // Reset form state
      setFiles([]);
      setMetadata({
        content_name: '',
        job_id: '',
        agency: '',
        audience: '',
        campaign_aligned_to: '',
        content_objectives: '',
        expiry_date: '',
        format: '',
        funnel_alignment: '',
        strategy_aligned_to: '',
        status: 'draft',
        type: '',
      });
      
      // Reset step to beginning
      setCurrentStep(1);
      
      // Navigate to the processing page immediately
      navigate('/dashboard/content-processing');
      
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
          <CardTitle className="text-2xl font-medium tracking-tight">
            Upload Content {selectedBrand && <span className="text-muted-foreground font-normal text-base">({selectedBrand})</span>}
          </CardTitle>
          <CardDescription>
            Share your content with additional context information specific to your brand
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
                  <Label htmlFor="job_id" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Job ID <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="job_id" 
                    placeholder="Enter a unique job identifier (e.g., PROJECT-001-V2)" 
                    value={metadata.job_id} 
                    onChange={e => handleMetadataChange('job_id', e.target.value)} 
                    className="focus-ring" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="content_objectives" className="flex items-center gap-2">
                    <Target className="h-4 w-4" /> Content Objectives
                  </Label>
                  {objectiveOptions.length > 0 ? (
                    <Select 
                      value={metadata.content_objectives} 
                      onValueChange={value => handleMetadataChange('content_objectives', value)}
                    >
                      <SelectTrigger className="focus-ring">
                        <SelectValue placeholder="Select an objective" />
                      </SelectTrigger>
                      <SelectContent>
                        {objectiveOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Textarea 
                      id="content_objectives" 
                      placeholder="What is the goal of this content?" 
                      value={metadata.content_objectives} 
                      onChange={e => handleMetadataChange('content_objectives', e.target.value)} 
                      className="resize-none h-32 focus-ring" 
                    />
                  )}
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
                      {formatOptions.length > 0 ? (
                        formatOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="email">Email</SelectItem>
                          <SelectItem value="social">Social Media</SelectItem>
                          <SelectItem value="website">Website</SelectItem>
                          <SelectItem value="presentation">Presentation</SelectItem>
                          <SelectItem value="infographic">Infographic</SelectItem>
                        </>
                      )}
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
                      {typeOptions.length > 0 ? (
                        typeOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))
                      ) : (
                        <>
                          <SelectItem value="hero">Hero</SelectItem>
                          <SelectItem value="driver">Driver</SelectItem>
                        </>
                      )}
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
                        {audienceOptions.length > 0 ? (
                          audienceOptions.map(option => (
                            <SelectItem key={option.value} value={option.value}>
                              {option.label}
                            </SelectItem>
                          ))
                        ) : (
                          <>
                            <SelectItem value="general">General Public</SelectItem>
                            <SelectItem value="business">Business Professionals</SelectItem>
                            <SelectItem value="technical">Technical Audience</SelectItem>
                            <SelectItem value="policymakers">Policymakers</SelectItem>
                            <SelectItem value="investors">Investors</SelectItem>
                            <SelectItem value="partners">Partners</SelectItem>
                            <SelectItem value="employees">Employees</SelectItem>
                            <SelectItem value="customers">Customers</SelectItem>
                          </>
                        )}
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
                  {campaignOptions.length > 0 ? (
                    <Select 
                      value={metadata.campaign_aligned_to} 
                      onValueChange={value => handleMetadataChange('campaign_aligned_to', value)}
                    >
                      <SelectTrigger className="focus-ring">
                        <SelectValue placeholder="Select a campaign" />
                      </SelectTrigger>
                      <SelectContent>
                        {campaignOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="campaign_aligned_to" 
                      placeholder="Enter campaign name" 
                      value={metadata.campaign_aligned_to} 
                      onChange={e => handleMetadataChange('campaign_aligned_to', e.target.value)} 
                      className="focus-ring" 
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="agency" className="flex items-center gap-2">
                    <Building2 className="h-4 w-4" /> Agency
                  </Label>
                  {agencyOptions.length > 0 ? (
                    <Select 
                      value={metadata.agency} 
                      onValueChange={value => handleMetadataChange('agency', value)}
                    >
                      <SelectTrigger className="focus-ring">
                        <SelectValue placeholder="Select an agency" />
                      </SelectTrigger>
                      <SelectContent>
                        {agencyOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="agency" 
                      placeholder="Enter agency name" 
                      value={metadata.agency} 
                      onChange={e => handleMetadataChange('agency', e.target.value)} 
                      className="focus-ring" 
                    />
                  )}
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
                  {funnelAlignmentOptions.length > 0 ? (
                    <Select 
                      value={metadata.funnel_alignment} 
                      onValueChange={value => handleMetadataChange('funnel_alignment', value)}
                    >
                      <SelectTrigger className="focus-ring">
                        <SelectValue placeholder="Select funnel alignment" />
                      </SelectTrigger>
                      <SelectContent>
                        {funnelAlignmentOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="funnel_alignment" 
                      placeholder="Enter funnel alignment" 
                      value={metadata.funnel_alignment} 
                      onChange={e => handleMetadataChange('funnel_alignment', e.target.value)} 
                      className="focus-ring" 
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="strategy_aligned_to" className="flex items-center gap-2">
                    <Target className="h-4 w-4" /> Strategy Aligned To
                  </Label>
                  {strategyOptions.length > 0 ? (
                    <Select 
                      value={metadata.strategy_aligned_to} 
                      onValueChange={value => handleMetadataChange('strategy_aligned_to', value)}
                    >
                      <SelectTrigger className="focus-ring">
                        <SelectValue placeholder="Select aligned strategy" />
                      </SelectTrigger>
                      <SelectContent>
                        {strategyOptions.map(option => (
                          <SelectItem key={option.value} value={option.value}>
                            {option.label}
                          </SelectItem>
                        ))}
                      </SelectContent>
                    </Select>
                  ) : (
                    <Input 
                      id="strategy_aligned_to" 
                      placeholder="Enter strategy alignment" 
                      value={metadata.strategy_aligned_to} 
                      onChange={e => handleMetadataChange('strategy_aligned_to', e.target.value)} 
                      className="focus-ring" 
                    />
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="status" className="flex items-center gap-2">
                    <Info className="h-4 w-4" /> Status
                  </Label>
                  <Select 
                    value={metadata.status} 
                    onValueChange={value => handleMetadataChange('status', value)}
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select status" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="draft">Draft</SelectItem>
                      <SelectItem value="live">Live</SelectItem>
                    </SelectContent>
                  </Select>
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
                      {metadata.campaign_aligned_to && <p><span className="font-medium">Campaign:</span> {metadata.campaign_aligned_to}</p>}
                      {metadata.agency && <p><span className="font-medium">Agency:</span> {metadata.agency}</p>}
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
