import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { PlusCircle, Pencil, Save, X, Trash2 } from "lucide-react";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
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

// Define types for our brand message
interface BrandMessage {
  id: string;
  audience: string;
  audienceColor: string;
  title: string;
  quote: string;
  narrative: string;
  objective: string;
  behavioralChange: string;
  framing: string;
}

const BrandMessages = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  // Colors for different audience types
  const audienceColors = ["emerald", "blue", "purple", "amber"];
  
  // Initial brand messages data
  const [messages, setMessages] = useState<BrandMessage[]>([
    {
      id: "1",
      audience: "General Market",
      audienceColor: "emerald",
      title: "Sustainability Innovation",
      quote: "Innovation that improves everyday life while protecting our planet's future.",
      narrative: "Our brand develops products that not only enhance daily experiences but also contribute positively to environmental sustainability through innovative design and materials.",
      objective: "Market Share Growth",
      behavioralChange: "From environmental indifference to conscious purchasing decisions that prioritize sustainability",
      framing: "Problem-solution: Addressing environmental concerns through innovative products"
    },
    {
      id: "2",
      audience: "Urban Professionals",
      audienceColor: "blue",
      title: "Premium Efficiency",
      quote: "Premium solutions that save time without compromising on quality or sustainability.",
      narrative: "For busy professionals seeking efficiency without sacrifice, our products deliver exceptional performance while maintaining our core sustainability values.",
      objective: "Brand Loyalty",
      behavioralChange: "From convenience-first to valuing both convenience and sustainability equally",
      framing: "Benefit-focused: Emphasizing time savings without compromise"
    },
    {
      id: "3",
      audience: "Families",
      audienceColor: "purple",
      title: "Family Durability",
      quote: "Products designed with the whole family in mind - safe, reliable, and built to last.",
      narrative: "Families can trust our products to withstand daily use while providing safe, effective solutions for everyone from children to adults.",
      objective: "Customer Retention",
      behavioralChange: "From disposable product mindset to investing in quality, long-lasting solutions",
      framing: "Value-oriented: Highlighting durability and multi-user benefits"
    },
    {
      id: "4",
      audience: "Value Seekers",
      audienceColor: "amber",
      title: "Value Performance",
      quote: "Exceptional quality and performance that delivers long-term value.",
      narrative: "Our products may have a higher initial price point, but their longevity and performance provide superior value over time compared to less expensive alternatives.",
      objective: "Market Penetration",
      behavioralChange: "From price-focused purchasing to value-based decision making",
      framing: "Comparative advantage: Demonstrating superior long-term economics"
    }
  ]);

  // Update messages when brand data changes
  useEffect(() => {
    if (brandData && brandData.messages && brandData.messages.length > 0) {
      // Map brand messages to the format expected by the component
      const brandMessages = brandData.messages.map((message, index) => {
        // Get audience from the audiences array or use a default
        const audience = brandData.audiences && brandData.audiences.length > index 
          ? brandData.audiences[index].text
          : "General Audience";
        
        return {
          id: message.id,
          audience: audience,
          audienceColor: audienceColors[index % audienceColors.length],
          title: `Message ${index + 1}`,
          quote: message.text,
          narrative: message.notes || "No detailed narrative available.",
          objective: brandData.objectives && brandData.objectives.length > 0 
            ? brandData.objectives[0].text 
            : "Strategic Objective",
          behavioralChange: "Change customer behavior through effective messaging",
          framing: "Strategic message framing"
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
  const handleSave = () => {
    if (editingMessage) {
      setMessages(messages.map(msg => 
        msg.id === editingMessage.id ? editingMessage : msg
      ));
      setEditingId(null);
      setEditingMessage(null);
    }
  };

  // Cancel editing
  const handleCancel = () => {
    setEditingId(null);
    setEditingMessage(null);
  };

  // Delete a message
  const handleDelete = (id: string) => {
    setMessages(messages.filter(msg => msg.id !== id));
  };

  // Add a new message
  const handleAddMessage = () => {
    const newMessage: BrandMessage = {
      id: Date.now().toString(),
      audience: "New Audience",
      audienceColor: "gray",
      title: "New Message Title",
      quote: "Your key message quote goes here.",
      narrative: "Provide a narrative that explains the message in more detail.",
      objective: "Strategic Objective",
      behavioralChange: "Describe the behavior change you wish to achieve",
      framing: "Explain the framing approach"
    };
    
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
                      <Input 
                        className={`bg-${editingMessage?.audienceColor}-100 text-${editingMessage?.audienceColor}-800 w-fit px-2 py-1 text-xs rounded-full`}
                        value={editingMessage?.audience || ""}
                        onChange={(e) => updateEditingField("audience", e.target.value)}
                      />
                    </div>
                    <div className="flex gap-2">
                      <Button variant="ghost" size="sm" onClick={handleCancel}>
                        <X className="h-4 w-4" />
                      </Button>
                      <Button variant="ghost" size="sm" onClick={handleSave}>
                        <Save className="h-4 w-4" />
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
                      <Input
                        value={editingMessage?.objective || ""}
                        onChange={(e) => updateEditingField("objective", e.target.value)}
                        className="text-sm text-gray-600"
                      />
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
