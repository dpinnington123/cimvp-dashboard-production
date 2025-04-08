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
import { ContentFile, ContentMetadata } from '@/services/uploadService';
import useContent from '@/hooks/useContent';

const ContentUploadForm: React.FC = () => {
  const { toast } = useToast();
  const navigate = useNavigate();
  const { useUploadContentMutation } = useContent();
  const uploadContentMutation = useUploadContentMutation();
  
  const [files, setFiles] = useState<ContentFile[]>([]);
  const [currentTag, setCurrentTag] = useState('');
  const [metadata, setMetadata] = useState<ContentMetadata>({
    title: '',
    description: '',
    category: '',
    audience: '',
    businessObjective: '',
    contentFormat: '',
    tags: [],
    publishDate: new Date().toISOString().split('T')[0]
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

  const handleMetadataChange = (key: keyof ContentMetadata, value: any) => {
    setMetadata(prev => ({
      ...prev,
      [key]: value
    }));
  };

  const addTag = () => {
    if (currentTag.trim() && !metadata.tags.includes(currentTag.trim())) {
      setMetadata(prev => ({
        ...prev,
        tags: [...prev.tags, currentTag.trim()]
      }));
      setCurrentTag('');
    }
  };

  const removeTag = (tagToRemove: string) => {
    setMetadata(prev => ({
      ...prev,
      tags: prev.tags.filter(tag => tag !== tagToRemove)
    }));
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (files.length === 0) {
      toast({
        title: "No files selected",
        description: "Please add at least one file to upload.",
        variant: "destructive"
      });
      return;
    }
    if (!metadata.title) {
      toast({
        title: "Title required",
        description: "Please provide a title for your content.",
        variant: "destructive"
      });
      return;
    }
    
    try {
      // Use the mutation to upload content
      const result = await uploadContentMutation.mutateAsync({ files, metadata });
      
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
        title: '',
        description: '',
        category: '',
        audience: '',
        businessObjective: '',
        contentFormat: '',
        tags: [],
        publishDate: new Date().toISOString().split('T')[0]
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
      return metadata.title ? 'complete' : files.length > 0 ? 'current' : 'incomplete';
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
                  <Label htmlFor="title" className="flex items-center gap-1">
                    Title <span className="text-destructive">*</span>
                  </Label>
                  <Input 
                    id="title" 
                    placeholder="Enter a title for your content" 
                    value={metadata.title} 
                    onChange={e => handleMetadataChange('title', e.target.value)} 
                    className="focus-ring" 
                    required 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="description">Description</Label>
                  <Textarea 
                    id="description" 
                    placeholder="Provide a description of your content" 
                    value={metadata.description} 
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleMetadataChange('description', e.target.value)} 
                    className="resize-none h-32 focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="category">Category</Label>
                  <Select 
                    value={metadata.category} 
                    onValueChange={value => handleMetadataChange('category', value)}
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select a category" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="art">Art & Design</SelectItem>
                      <SelectItem value="education">Education</SelectItem>
                      <SelectItem value="entertainment">Entertainment</SelectItem>
                      <SelectItem value="business">Business</SelectItem>
                      <SelectItem value="technology">Technology</SelectItem>
                      <SelectItem value="lifestyle">Lifestyle</SelectItem>
                      <SelectItem value="other">Other</SelectItem>
                    </SelectContent>
                  </Select>
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="contentFormat" className="flex items-center gap-2">
                    <Layout className="h-4 w-4" /> Content Format
                  </Label>
                  <Select 
                    value={metadata.contentFormat} 
                    onValueChange={value => handleMetadataChange('contentFormat', value)}
                  >
                    <SelectTrigger className="focus-ring">
                      <SelectValue placeholder="Select a format" />
                    </SelectTrigger>
                    <SelectContent>
                      <SelectItem value="article">
                        <div className="flex items-center gap-2">
                          <FileText className="h-4 w-4" /> Article
                        </div>
                      </SelectItem>
                      <SelectItem value="image">
                        <div className="flex items-center gap-2">
                          <FileImage className="h-4 w-4" /> Image
                        </div>
                      </SelectItem>
                      <SelectItem value="video">
                        <div className="flex items-center gap-2">
                          <FileVideo className="h-4 w-4" /> Video
                        </div>
                      </SelectItem>
                      <SelectItem value="audio">
                        <div className="flex items-center gap-2">
                          <FileAudio className="h-4 w-4" /> Audio
                        </div>
                      </SelectItem>
                      <SelectItem value="presentation">
                        <div className="flex items-center gap-2">
                          <File className="h-4 w-4" /> Presentation
                        </div>
                      </SelectItem>
                      <SelectItem value="infographic">
                        <div className="flex items-center gap-2">
                          <Layout className="h-4 w-4" /> Infographic
                        </div>
                      </SelectItem>
                    </SelectContent>
                  </Select>
                </div>

                <div className="space-y-2">
                  <Label htmlFor="contentType" className="flex items-center gap-2">
                    <Layers className="h-4 w-4" /> Type of Content
                  </Label>
                  <Select 
                    value={metadata.contentType || ''} 
                    onValueChange={value => handleMetadataChange('contentType', value)}
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
                  <Label htmlFor="campaign" className="flex items-center gap-2">
                    <BriefcaseBusiness className="h-4 w-4" /> Campaign
                  </Label>
                  <Input 
                    id="campaign" 
                    placeholder="Enter campaign name" 
                    value={metadata.campaign || ''} 
                    onChange={e => handleMetadataChange('campaign', e.target.value)} 
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
                    value={metadata.agency || ''} 
                    onChange={e => handleMetadataChange('agency', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="cost" className="flex items-center gap-2">
                    <Banknote className="h-4 w-4" /> Cost
                  </Label>
                  <Input 
                    id="cost" 
                    placeholder="Enter cost amount" 
                    value={metadata.cost || ''} 
                    onChange={e => handleMetadataChange('cost', e.target.value)} 
                    className="focus-ring" 
                    type="text"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="businessObjective" className="flex items-center gap-2">
                    <Target className="h-4 w-4" /> Business Objective
                  </Label>
                  <Textarea
                    id="businessObjective"
                    placeholder="What business goal does this content support?"
                    value={metadata.businessObjective}
                    onChange={(e: React.ChangeEvent<HTMLTextAreaElement>) => handleMetadataChange('businessObjective', e.target.value)}
                    className="resize-none h-20 focus-ring"
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="tags" className="flex items-center gap-2">
                    <Tag className="h-4 w-4" /> Tags
                  </Label>
                  <div className="flex gap-2">
                    <Input 
                      id="tags" 
                      placeholder="Add tags" 
                      value={currentTag} 
                      onChange={e => setCurrentTag(e.target.value)} 
                      onKeyDown={e => {
                        if (e.key === 'Enter') {
                          e.preventDefault();
                          addTag();
                        }
                      }} 
                      className="focus-ring" 
                    />
                    <Button type="button" variant="outline" onClick={addTag} className="whitespace-nowrap">
                      Add
                    </Button>
                  </div>
                  
                  {metadata.tags.length > 0 && (
                    <div className="flex flex-wrap gap-2 mt-2">
                      {metadata.tags.map(tag => (
                        <div key={tag} className="inline-flex items-center bg-muted text-muted-foreground rounded-full px-3 py-1 text-xs font-medium">
                          {tag}
                          <button 
                            type="button" 
                            className="ml-1 text-muted-foreground/70 hover:text-muted-foreground focus:outline-none" 
                            onClick={() => removeTag(tag)}
                          >
                            &times;
                          </button>
                        </div>
                      ))}
                    </div>
                  )}
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="publish-date" className="flex items-center gap-2">
                    <CalendarClock className="h-4 w-4" /> Publish Date
                  </Label>
                  <Input 
                    id="publish-date" 
                    type="date" 
                    value={metadata.publishDate} 
                    onChange={e => handleMetadataChange('publishDate', e.target.value)} 
                    className="focus-ring" 
                  />
                </div>
                
                <div className="space-y-2">
                  <Label htmlFor="location" className="flex items-center gap-2">
                    <Globe className="h-4 w-4" /> Location (optional)
                  </Label>
                  <Input 
                    id="location" 
                    placeholder="Enter a location" 
                    value={metadata.location || ''} 
                    onChange={e => handleMetadataChange('location', e.target.value)} 
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
            
            {(files.length > 0 || metadata.title) && (
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
                
                {metadata.title && (
                  <div className="space-y-2">
                    <h4 className="text-sm font-medium">Context Summary</h4>
                    <div className="text-sm text-muted-foreground space-y-1">
                      <p><span className="font-medium">Title:</span> {metadata.title}</p>
                      {metadata.description && <p><span className="font-medium">Description:</span> {metadata.description}</p>}
                      {metadata.category && <p><span className="font-medium">Category:</span> {metadata.category}</p>}
                      {metadata.contentFormat && <p><span className="font-medium">Format:</span> {metadata.contentFormat}</p>}
                      {metadata.audience && <p><span className="font-medium">Audience:</span> {metadata.audience}</p>}
                      {metadata.contentType && <p><span className="font-medium">Type:</span> {metadata.contentType}</p>}
                      {metadata.campaign && <p><span className="font-medium">Campaign:</span> {metadata.campaign}</p>}
                      {metadata.agency && <p><span className="font-medium">Agency:</span> {metadata.agency}</p>}
                      {metadata.cost && <p><span className="font-medium">Cost:</span> {metadata.cost}</p>}
                      {metadata.businessObjective && <p><span className="font-medium">Business Objective:</span> {metadata.businessObjective}</p>}
                      {metadata.tags.length > 0 && (
                        <p className="flex items-center gap-2">
                          <span className="font-medium">Tags:</span>
                          <span className="flex flex-wrap gap-1">
                            {metadata.tags.map(tag => (
                              <span key={tag} className="inline-flex items-center rounded-full bg-muted px-2 py-0.5 text-xs text-muted-foreground">
                                {tag}
                              </span>
                            ))}
                          </span>
                        </p>
                      )}
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
            disabled={isSubmitting || files.length === 0 || !metadata.title} 
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
