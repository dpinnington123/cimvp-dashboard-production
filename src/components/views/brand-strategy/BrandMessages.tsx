import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Save, X, Trash2, Loader2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
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
import { useBrand } from "@/contexts/BrandContext";
import { 
  useAddBrandMessage, 
  useUpdateBrandMessage, 
  useDeleteBrandMessage 
} from "@/hooks/useBrandMessageOperations";
import { brandService } from "@/services/brandService";
import { useToast } from "@/hooks/use-toast";

// Define types for our brand message
interface BrandMessage {
  id: string;
  audience: string;
  audienceId?: string;
  audienceColor: string;
  title: string;
  quote: string;
  narrative: string;
  objective: string;
  objectiveId?: string;
  behavioralChange: string;
  framing: string;
}

const BrandMessages = () => {
  const { getBrandData, selectedBrand } = useBrand();
  const brandData = getBrandData();
  const addMessage = useAddBrandMessage();
  const updateMessage = useUpdateBrandMessage();
  const deleteMessage = useDeleteBrandMessage();
  const { toast } = useToast();
  
  // Colors for different audience types
  const audienceColors = ["emerald", "blue", "purple", "amber"];
  
  // Brand ID state
  const [brandId, setBrandId] = useState<string | null>(null);
  const [isLoadingBrandId, setIsLoadingBrandId] = useState(false);
  
  // Messages state - will be populated from database
  const [messages, setMessages] = useState<BrandMessage[]>([]);

  // Fetch brand ID when selectedBrand changes
  useEffect(() => {
    const fetchBrandId = async () => {
      if (selectedBrand) {
        setIsLoadingBrandId(true);
        try {
          const id = await brandService.getBrandIdBySlug(selectedBrand);
          setBrandId(id);
        } catch (error) {
          console.error('Failed to fetch brand ID:', error);
          toast({
            title: 'Error',
            description: 'Failed to load brand information',
            variant: 'destructive',
          });
        } finally {
          setIsLoadingBrandId(false);
        }
      }
    };

    fetchBrandId();
  }, [selectedBrand, toast]);

  // Update messages when brand data changes
  useEffect(() => {
    if (brandData && brandData.messages && brandData.messages.length > 0) {
      // Map brand messages to the format expected by the component
      const brandMessages = brandData.messages.map((message, index) => {
        // Get audience name from ID if available
        let audienceName = "General Audience";
        if (message.audience_id && brandData.audiences) {
          const audience = brandData.audiences.find(a => a.id === message.audience_id);
          if (audience) {
            audienceName = audience.text;
          }
        }
        
        // Get objective text from ID if available
        let objectiveText = "Strategic Objective";
        if (message.objective_id && brandData.objectives) {
          const objective = brandData.objectives.find(o => o.id === message.objective_id);
          if (objective) {
            objectiveText = objective.text;
          }
        }
        
        return {
          id: message.id,
          audience: audienceName,
          audienceId: message.audience_id || '',
          audienceColor: audienceColors[index % audienceColors.length],
          title: message.title || `Message ${index + 1}`,
          quote: message.text,
          narrative: message.notes || "No detailed narrative available.",
          objective: objectiveText,
          objectiveId: message.objective_id || '',
          behavioralChange: message.behavioral_change || "Change customer behavior through effective messaging",
          framing: message.framing || "Strategic message framing"
        };
      });
      
      setMessages(brandMessages);
    }
  }, [brandData]);

  // State for editing
  const [editingId, setEditingId] = useState<string | null>(null);
  const [editingMessage, setEditingMessage] = useState<BrandMessage | null>(null);

  // Start editing a message
  const handleEdit = (message: BrandMessage) => {
    setEditingId(message.id);
    setEditingMessage({...message});
  };

  // Save edited message
  const handleSave = async () => {
    if (editingMessage && brandId) {
      try {
        // Check if this is a new message (temporary ID) or existing
        const isNewMessage = editingMessage.id.length < 36;
        
        if (isNewMessage) {
          // Add new message to database
          const newMessage = await addMessage.mutateAsync({
            brandId,
            message: {
              title: editingMessage.title,
              text: editingMessage.quote,
              narrative: editingMessage.narrative,
              audience_id: editingMessage.audienceId || null,
              objective_id: editingMessage.objectiveId || null,
              behavioral_change: editingMessage.behavioralChange,
              framing: editingMessage.framing
            }
          });
          
          // Update local state with the real ID from database
          setMessages(messages.map(msg => 
            msg.id === editingMessage.id 
              ? { ...editingMessage, id: newMessage.id }
              : msg
          ));
        } else {
          // Update existing message
          await updateMessage.mutateAsync({
            messageId: editingMessage.id,
            updates: {
              title: editingMessage.title,
              text: editingMessage.quote,
              narrative: editingMessage.narrative,
              audience_id: editingMessage.audienceId || null,
              objective_id: editingMessage.objectiveId || null,
              behavioral_change: editingMessage.behavioralChange,
              framing: editingMessage.framing
            }
          });
          
          // Update local state
          setMessages(messages.map(msg => 
            msg.id === editingMessage.id ? editingMessage : msg
          ));
        }
        
        setEditingId(null);
        setEditingMessage(null);
      } catch (error) {
        console.error('Failed to save message:', error);
      }
    }
  };

  // Cancel editing
  const handleCancel = () => {
    // If this was a new message (temporary ID), remove it from local state
    if (editingId && editingId.length < 36) {
      setMessages(messages.filter(msg => msg.id !== editingId));
    }
    setEditingId(null);
    setEditingMessage(null);
  };

  // Delete a message
  const handleDelete = async (id: string) => {
    if (brandId) {
      try {
        // Delete from database
        await deleteMessage.mutateAsync({ messageId: id, brandId });
        
        // Update local state only after successful deletion
        setMessages(messages.filter(msg => msg.id !== id));
      } catch (error) {
        console.error('Failed to delete message:', error);
      }
    }
  };

  // Add a new message
  const handleAddMessage = () => {
    const newMessage: BrandMessage = {
      id: Date.now().toString(), // Temporary ID
      audience: "New Audience",
      audienceColor: audienceColors[messages.length % audienceColors.length],
      title: "New Message Title",
      quote: "Your key message quote goes here.",
      narrative: "Provide a narrative that explains the message in more detail.",
      objective: "Strategic Objective",
      behavioralChange: "Describe the behavior change you wish to achieve",
      framing: "Explain the framing approach"
    };
    
    // Add to local state temporarily for editing
    setMessages([...messages, newMessage]);
    // Start editing the new message immediately
    handleEdit(newMessage);
  };

  // Update editing message field
  const updateEditingField = (field: keyof BrandMessage, value: string) => {
    if (editingMessage) {
      setEditingMessage({
        ...editingMessage,
        [field]: value
      });
    }
  };

  // Show loading state while fetching brand ID
  if (isLoadingBrandId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Key Brand Messages</h2>
        <p className="text-gray-600">Core messaging for {brandData.profile.name} to be consistently conveyed across all channels and campaigns</p>
      </div>
      
      <div className="flex justify-end mb-2">
        <Button className="gap-1 bg-emerald-600 hover:bg-emerald-700" onClick={handleAddMessage}>
          <PlusCircle className="h-4 w-4" />
          Add Message
        </Button>
      </div>
      
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {messages.map(message => (
          <Card key={message.id}>
            {editingId === message.id ? (
              // Editing mode
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center mb-2">
                    <div className="flex items-center gap-2">
                      <Select
                        value={editingMessage?.audienceId || ''}
                        onValueChange={(value) => {
                          const selectedAudience = brandData.audiences.find(a => a.id === value);
                          if (selectedAudience && editingMessage) {
                            setEditingMessage({
                              ...editingMessage,
                              audienceId: value,
                              audience: selectedAudience.text
                            });
                          }
                        }}
                      >
                        <SelectTrigger className={`bg-${editingMessage?.audienceColor}-100 text-${editingMessage?.audienceColor}-800 w-[200px] h-8`}>
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandData.audiences && brandData.audiences.map((audience) => (
                            <SelectItem key={audience.id} value={audience.id}>
                              {audience.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        onClick={handleSave}
                        disabled={addMessage.isPending || updateMessage.isPending}
                      >
                        {(addMessage.isPending || updateMessage.isPending) ? (
                          <Loader2 className="h-4 w-4 animate-spin" />
                        ) : (
                          <Save className="h-4 w-4" />
                        )}
                      </Button>
                    </div>
                  </div>
                  <Input
                    className="text-lg font-semibold"
                    value={editingMessage?.title || ""}
                    onChange={(e) => updateEditingField("title", e.target.value)}
                  />
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`border-l-4 border-${editingMessage?.audienceColor}-500 pl-4 py-1 italic text-gray-700`}>
                      <Textarea
                        value={editingMessage?.quote || ""}
                        onChange={(e) => updateEditingField("quote", e.target.value)}
                        className="italic"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Narrative:</h4>
                      <Textarea
                        value={editingMessage?.narrative || ""}
                        onChange={(e) => updateEditingField("narrative", e.target.value)}
                        className="text-sm text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Strategic Objective:</h4>
                      <Select
                        value={editingMessage?.objectiveId || ''}
                        onValueChange={(value) => {
                          const selectedObjective = brandData.objectives.find(o => o.id === value);
                          if (selectedObjective && editingMessage) {
                            setEditingMessage({
                              ...editingMessage,
                              objectiveId: value,
                              objective: selectedObjective.text
                            });
                          }
                        }}
                      >
                        <SelectTrigger>
                          <SelectValue placeholder="Select objective" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandData.objectives && brandData.objectives.map((objective) => (
                            <SelectItem key={objective.id} value={objective.id}>
                              {objective.text}
                            </SelectItem>
                          ))}
                        </SelectContent>
                      </Select>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Behavioral Change:</h4>
                      <Textarea
                        value={editingMessage?.behavioralChange || ""}
                        onChange={(e) => updateEditingField("behavioralChange", e.target.value)}
                        className="text-sm text-gray-600"
                      />
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Framing:</h4>
                      <Textarea
                        value={editingMessage?.framing || ""}
                        onChange={(e) => updateEditingField("framing", e.target.value)}
                        className="text-sm text-gray-600"
                      />
                    </div>
                  </div>
                </CardContent>
              </>
            ) : (
              // View mode
              <>
                <CardHeader className="pb-2">
                  <div className="flex justify-between items-center">
                    <Badge className={`mb-2 bg-${message.audienceColor}-100 text-${message.audienceColor}-800 w-fit`}>
                      {message.audience}
                    </Badge>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={() => handleEdit(message)}>
                        <Pencil className="h-4 w-4" />
                      </Button>
                      <AlertDialog>
                        <AlertDialogTrigger asChild>
                          <Button variant="ghost" size="sm" className="text-red-500 hover:text-red-700">
                            <Trash2 className="h-4 w-4" />
                          </Button>
                        </AlertDialogTrigger>
                        <AlertDialogContent>
                          <AlertDialogHeader>
                            <AlertDialogTitle>Delete Brand Message</AlertDialogTitle>
                            <AlertDialogDescription>
                              Are you sure you want to delete this brand message? This action cannot be undone.
                            </AlertDialogDescription>
                          </AlertDialogHeader>
                          <AlertDialogFooter>
                            <AlertDialogCancel>Cancel</AlertDialogCancel>
                            <AlertDialogAction 
                              onClick={() => handleDelete(message.id)}
                              className="bg-red-500 hover:bg-red-600"
                            >
                              Delete
                            </AlertDialogAction>
                          </AlertDialogFooter>
                        </AlertDialogContent>
                      </AlertDialog>
                    </div>
                  </div>
                  <CardTitle className="text-lg">{message.title}</CardTitle>
                </CardHeader>
                <CardContent>
                  <div className="space-y-4">
                    <div className={`border-l-4 border-${message.audienceColor}-500 pl-4 py-1 italic text-gray-700`}>
                      "{message.quote}"
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Narrative:</h4>
                      <p className="text-sm text-gray-600">
                        {message.narrative}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Strategic Objective:</h4>
                      <p className="text-sm text-gray-600">{message.objective}</p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Behavioral Change:</h4>
                      <p className="text-sm text-gray-600">
                        {message.behavioralChange}
                      </p>
                    </div>
                    
                    <div>
                      <h4 className="text-sm font-medium text-gray-700 mb-1">Framing:</h4>
                      <p className="text-sm text-gray-600">
                        {message.framing}
                      </p>
                    </div>
                  </div>
                </CardContent>
              </>
            )}
          </Card>
        ))}
      </div>
    </div>
  );
};

export default BrandMessages;
