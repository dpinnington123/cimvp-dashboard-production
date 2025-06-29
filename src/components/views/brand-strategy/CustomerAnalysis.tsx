import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, UserPlus, X, Save, Check, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useBrand } from "@/contexts/BrandContext";
import { useUpdateBrandPersonas } from "@/hooks/useUpdateBrandPersonas";
import { useUpdateBrandCustomerSegments } from "@/hooks/useUpdateBrandCustomerSegments";
import { useUpdateBrandCustomerJourney } from "@/hooks/useUpdateBrandCustomerJourney";
import { brandService } from "@/services/brandService";
import type { BrandPersona, BrandCustomerSegment } from "@/types/brand";

// Component-specific types for UI state
interface PersonaUI extends Partial<BrandPersona> {
  id: string;
  title: string;
  subtitle: string;
  audience: string;
  color: string;
  profile: string[];
  painPoints: string[];
  interests: string[];
  intentions: string[];
  goals: string[];
  preferences: string[];
}

interface ScenarioUI extends Partial<BrandCustomerSegment> {
  id: string;
  title: string;
  description: string;
  percentage: string;
  count: string;
  colorClass: string;
  audience: string;
  scenarioSize: string;
  currentBehaviors: string;
  desiredBehaviors: string;
  benefitsToCustomer: string;
  barriersToChange: string;
  changeLevers: string;
  objectives: string[];
}

const CustomerAnalysis = () => {
  const { getBrandData, selectedBrand } = useBrand();
  const brandData = getBrandData();
  
  // Database integration hooks
  const updatePersonas = useUpdateBrandPersonas();
  const updateCustomerSegments = useUpdateBrandCustomerSegments();
  const updateCustomerJourney = useUpdateBrandCustomerJourney();
  
  // State for personas - initialized from brand data
  const [personas, setPersonas] = useState<PersonaUI[]>([]);
  
  // Initialize personas from brand data (JSONB personas field)
  useEffect(() => {
    console.log('Initializing personas, brandData:', {
      hasPersonas: !!brandData?.personas,
      personasLength: brandData?.personas?.length,
      personas: brandData?.personas,
      hasCustomerAnalysis: !!brandData?.customerAnalysis,
      segments: brandData?.customerAnalysis?.segments
    });
    
    // Log the actual persona data to see what we're getting
    console.log('Raw persona data:', JSON.stringify(brandData?.personas, null, 2));
    
    if (brandData?.personas && brandData.personas.length > 0) {
      // Convert DB format to UI format
      const uiPersonas: PersonaUI[] = brandData.personas.map((p: any, index: number) => {
        // The database stores simple personas with name and description
        // We need to map them to the UI format
        const colors = ["emerald", "blue", "purple", "amber", "red"];
        const iconToColorMap: Record<string, string> = {
          "User": "emerald",
          "MessageSquare": "blue",
          "Star": "purple",
          "Handshake": "amber",
          "Award": "red"
        };
        
        return {
          id: p.id || `persona-${index + 1}`,
          title: p.name,
          subtitle: p.description || "Customer Segment",
          audience: p.audience,
          color: p.color || iconToColorMap[p.icon] || colors[index % 5],
          profile: p.profile,
          painPoints: p.painPoints,
          interests: p.interests,
          intentions: p.intentions,
          goals: p.goals,
          preferences: p.preferences,
          overall_score: p.overall_score,
          strategic_score: p.strategic_score,
          customer_score: p.customer_score,
          execution_score: p.execution_score
        };
      });
      console.log('Mapped UI personas:', JSON.stringify(uiPersonas, null, 2));
      setPersonas(uiPersonas);
    } else if (brandData?.customerAnalysis?.segments) {
      // Fallback to segments for initial mapping
      const mappedPersonas = brandData.customerAnalysis.segments.map((segment, index) => ({
        id: `persona-${index + 1}`,
        title: `Persona ${index + 1}`,
        subtitle: segment.name,
        audience: segment.description,
        color: ["emerald", "blue", "purple", "amber", "red"][index % 5],
        profile: [
          ...segment.description.split(", "),
          `Size: ${segment.size}`
        ],
        painPoints: segment.painPoints || ["No pain points specified"],
        interests: ["Segment interests"],
        intentions: segment.needs || ["No specific needs identified"],
        goals: ["Segment goals"],
        preferences: ["Segment preferences"],
      }));
      
      setPersonas(mappedPersonas);
    }
  }, [brandData]);

  // Customer trends from brand data
  const [customerTrends, setCustomerTrends] = useState("Loading customer trends...");
  
  useEffect(() => {
    // First check if we have trends stored in customer_journey
    if (brandData?.customer_journey) {
      const trendsEntry = brandData.customer_journey.find(j => j.stage === 'Customer Trends');
      if (trendsEntry?.trends) {
        setCustomerTrends(trendsEntry.trends);
        return;
      }
    }
    
    // Fallback to generating trends from journey data
    if (brandData?.customerAnalysis?.customerJourney) {
      const journey = brandData.customerAnalysis.customerJourney;
      const trendsText = `Customer journey analysis shows key touchpoints at ${journey.map(j => j.stage).join(", ")} stages. 
      Opportunities include ${journey.flatMap(j => j.opportunities).join(", ")}. 
      Current market growth for ${brandData.profile.name} is ${brandData.profile.financials.growth}.`;
      
      setCustomerTrends(trendsText);
    } else if (brandData?.customer_journey && brandData.customer_journey.length > 0) {
      // Use customer_journey from DB if available
      const journey = brandData.customer_journey;
      const trendsText = `Customer journey analysis shows key touchpoints at ${journey.map(j => j.stage).join(", ")} stages. 
      Opportunities include ${journey.flatMap(j => j.opportunities || []).join(", ")}. 
      Current market growth for ${brandData.profile.name} is ${brandData.profile.financials?.growth || 'N/A'}.`;
      
      setCustomerTrends(trendsText);
    } else {
      setCustomerTrends("No customer trends data available. Click edit to add insights.");
    }
  }, [brandData]);
  
  const [isEditingTrends, setIsEditingTrends] = useState(false);
  const [editedTrends, setEditedTrends] = useState(customerTrends);
  
  // Update edited trends when customer trends change
  useEffect(() => {
    setEditedTrends(customerTrends);
  }, [customerTrends]);
  
  // Customer scenarios from brand data and customer journey
  const [customerScenarios, setCustomerScenarios] = useState<ScenarioUI[]>([]);
  
  // Initialize scenarios from brand data (JSONB customer_segments field)
  useEffect(() => {
    console.log('Initializing customer segments:', {
      hasCustomerSegments: !!brandData?.customer_segments,
      segmentsLength: brandData?.customer_segments?.length,
      segments: brandData?.customer_segments
    });
    
    if (brandData?.customer_segments && brandData.customer_segments.length > 0) {
      // Convert DB format to UI format
      const uiScenarios: ScenarioUI[] = brandData.customer_segments.map((s: any, index: number) => {
        const colors = ["red", "amber", "blue", "purple", "emerald"];
        
        // Extract count from percentage (e.g., "35%" -> calculate based on 10000 total)
        const percentageNum = parseInt(s.size_percentage) || 0;
        const count = Math.round(10000 * percentageNum / 100);
        
        return {
          id: s.id || `scenario-${index + 1}`,
          title: s.name,
          description: s.description || "Customer segment",
          percentage: s.size_percentage || "0%",
          count: count.toString() + " customers",
          colorClass: colors[index % colors.length],
          audience: s.description || "Target audience",
          scenarioSize: "Significant segment",
          currentBehaviors: "Current behaviors",
          desiredBehaviors: "Desired behaviors",
          benefitsToCustomer: "Better product fit and experience",
          barriersToChange: s.pain_points?.join(", ") || "Barriers to change",
          changeLevers: "Marketing and product optimization",
          objectives: s.needs || ["Objectives"],
          name: s.name,
          size_percentage: s.size_percentage,
          needs: s.needs,
          pain_points: s.pain_points
        };
      });
      setCustomerScenarios(uiScenarios);
    } else if (brandData?.customerAnalysis?.customerJourney) {
      // Fallback to journey for initial mapping
      const journey = brandData.customerAnalysis.customerJourney;
      const colors = ["red", "amber", "blue", "purple", "emerald"];
      
      const mappedScenarios = journey.map((stage, index) => ({
        id: `scenario-${index + 1}`,
        title: stage.stage,
        description: `${stage.stage} stage of customer journey`,
        percentage: `${20 + index * 5}%`,
        count: `${10000 - index * 2000}`,
        colorClass: colors[index % colors.length],
        audience: brandData.customerAnalysis?.segments?.[0]?.name || "General audience",
        scenarioSize: "Significant segment",
        currentBehaviors: stage.touchpoints.join(", "),
        desiredBehaviors: "Increased engagement and conversion",
        benefitsToCustomer: "Better product fit and experience",
        barriersToChange: "Awareness and competitive offers",
        changeLevers: "Marketing and product optimization",
        objectives: stage.opportunities || ["No specific opportunities identified"]
      }));
      
      setCustomerScenarios(mappedScenarios);
    }
  }, [brandData]);
  
  const [editingScenarioId, setEditingScenarioId] = useState<string | number | null>(null);
  const [editedScenario, setEditedScenario] = useState<ScenarioUI | null>(null);
  
  // State for editing personas
  const [editingPersonaId, setEditingPersonaId] = useState<string | number | null>(null);
  const [editedPersona, setEditedPersona] = useState<PersonaUI | null>(null);

  const handleAddPersona = async () => {
    const newPersona = {
      id: `persona-${Date.now()}`,
      title: `Persona ${personas.length + 1}`,
      subtitle: "New Customer Segment",
      audience: "Define the audience for this persona",
      color: ["emerald", "blue", "purple", "amber", "red"][personas.length % 5],
      profile: ["Age range", "Location", "Demographics", "Income level"],
      painPoints: ["Pain point 1", "Pain point 2", "Pain point 3", "Pain point 4"],
      interests: ["Interest 1", "Interest 2", "Interest 3", "Interest 4"],
      intentions: ["Intention 1", "Intention 2", "Intention 3", "Intention 4"],
      goals: ["Goal 1", "Goal 2", "Goal 3", "Goal 4"],
      preferences: ["Preference 1", "Preference 2", "Preference 3", "Preference 4"],
    };
    
    setPersonas([...personas, newPersona]);
    // Start editing the new persona immediately
    handleEditPersona(newPersona.id);
  };

  const handleDeletePersona = async (id: string | number) => {
    const updatedPersonas = personas.filter(persona => persona.id !== id);
    setPersonas(updatedPersonas);
    
    // Save to database immediately
    if (selectedBrand) {
      try {
        const brandId = await brandService.getBrandIdBySlug(selectedBrand);
        if (!brandId) {
          console.error('Brand ID not found');
          return;
        }
        
        // Convert to database format
        const colorToIconMap: Record<string, string> = {
          "emerald": "User",
          "blue": "MessageSquare", 
          "purple": "Star",
          "amber": "Handshake",
          "red": "Award"
        };
        
        const dbPersonas = updatedPersonas.map((p, index) => ({
          id: p.id.startsWith('persona-') && p.id.length < 20 ? undefined : p.id,
          name: p.title,
          description: p.subtitle,
          icon: colorToIconMap[p.color] || "User",
          color: p.color,
          audience: p.audience,
          profile: p.profile,
          painPoints: p.painPoints,
          interests: p.interests,
          intentions: p.intentions,
          goals: p.goals,
          preferences: p.preferences,
          overall_score: p.overall_score || 0,
          strategic_score: p.strategic_score || 0,
          customer_score: p.customer_score || 0,
          execution_score: p.execution_score || 0,
          order_index: index
        }));
        
        await updatePersonas.mutateAsync({ brandId, personas: dbPersonas });
      } catch (error) {
        console.error('Error deleting persona:', error);
      }
    }
  };
  
  const handleEditPersona = (id: string | number) => {
    const personaToEdit = personas.find(persona => persona.id === id);
    if (personaToEdit) {
      setEditedPersona({ ...personaToEdit });
      setEditingPersonaId(id);
    }
  };
  
  const handleSavePersona = async () => {
    if (editedPersona && selectedBrand) {
      // Update local state first
      const updatedPersonas = personas.map(persona => 
        persona.id === editedPersona.id ? editedPersona : persona
      );
      setPersonas(updatedPersonas);
      setEditingPersonaId(null);
      setEditedPersona(null);
      
      // Get brand ID and save to database
      try {
        const brandId = await brandService.getBrandIdBySlug(selectedBrand);
        if (!brandId) {
          console.error('Brand ID not found');
          return;
        }
        
        // Convert to database format
        const colorToIconMap: Record<string, string> = {
          "emerald": "User",
          "blue": "MessageSquare", 
          "purple": "Star",
          "amber": "Handshake",
          "red": "Award"
        };
        
        const dbPersonas = updatedPersonas.map((p, index) => ({
          id: p.id.startsWith('persona-') && p.id.length < 20 ? undefined : p.id,
          name: p.title,
          description: p.subtitle,
          icon: colorToIconMap[p.color] || "User",
          color: p.color,
          audience: p.audience,
          profile: p.profile,
          painPoints: p.painPoints,
          interests: p.interests,
          intentions: p.intentions,
          goals: p.goals,
          preferences: p.preferences,
          overall_score: p.overall_score || 0,
          strategic_score: p.strategic_score || 0,
          customer_score: p.customer_score || 0,
          execution_score: p.execution_score || 0,
          order_index: index
        }));
        
        console.log('Saving personas directly:', dbPersonas);
        console.log('BrandId:', brandId);
        console.log('Selected Brand:', selectedBrand);
        
        // Log the actual data being sent
        console.log('Persona data to save:', JSON.stringify(dbPersonas, null, 2));
        
        await updatePersonas.mutateAsync({ brandId, personas: dbPersonas });
        console.log('Save completed successfully');
      } catch (error) {
        console.error('Error saving personas:', error);
      }
    }
  };
  
  const handleCancelEditPersona = () => {
    setEditingPersonaId(null);
    setEditedPersona(null);
  };
  
  const handleUpdatePersonaField = (field: keyof PersonaUI, value: string | string[]) => {
    if (editedPersona) {
      setEditedPersona({ ...editedPersona, [field]: value });
      // Note: Don't set hasUnsavedPersonaChanges here, only when saving
    }
  };
  
  const handleUpdatePersonaListItem = (field: keyof PersonaUI, index: number, value: string) => {
    if (editedPersona) {
      const currentArray = editedPersona[field] as string[] || [];
      const updatedArray = [...currentArray];
      updatedArray[index] = value;
      setEditedPersona({ ...editedPersona, [field]: updatedArray });
    }
  };
  
  const handleAddPersonaListItem = (field: keyof PersonaUI) => {
    if (editedPersona) {
      const currentArray = editedPersona[field] as string[] || [];
      const updatedArray = [...currentArray, `New ${field} item`];
      setEditedPersona({ ...editedPersona, [field]: updatedArray });
    }
  };
  
  const handleRemovePersonaListItem = (field: keyof PersonaUI, index: number) => {
    if (editedPersona) {
      const currentArray = editedPersona[field] as string[] || [];
      const updatedArray = [...currentArray];
      updatedArray.splice(index, 1);
      setEditedPersona({ ...editedPersona, [field]: updatedArray });
    }
  };

  const getColorClasses = (color: string) => {
    const colorMap: Record<string, { bg: string, text: string }> = {
      emerald: { bg: "bg-emerald-100", text: "text-emerald-600" },
      blue: { bg: "bg-blue-100", text: "text-blue-600" },
      purple: { bg: "bg-purple-100", text: "text-purple-600" },
      amber: { bg: "bg-amber-100", text: "text-amber-600" },
      red: { bg: "bg-red-100", text: "text-red-600" },
    };
    
    return colorMap[color] || colorMap.emerald;
  };

  const handleSaveTrends = async () => {
    if (selectedBrand) {
      // Update local state first
      setCustomerTrends(editedTrends);
      setIsEditingTrends(false);
      
      // Save to database
      try {
        const brandId = await brandService.getBrandIdBySlug(selectedBrand);
        if (!brandId) {
          console.error('Brand ID not found');
          return;
        }
        
        // Store trends in customer journey metadata
        const customerJourney = brandData?.customer_journey || [];
        
        // If we have existing journey data, update or add the trends
        let updatedJourney;
        if (customerJourney.length > 0) {
          // Check if we already have a trends entry
          const trendsEntryIndex = customerJourney.findIndex(j => j.stage === 'Customer Trends');
          if (trendsEntryIndex >= 0) {
            // Update existing trends entry
            updatedJourney = [...customerJourney];
            updatedJourney[trendsEntryIndex] = {
              ...updatedJourney[trendsEntryIndex],
              trends: editedTrends
            };
          } else {
            // Add trends as a new entry
            updatedJourney = [...customerJourney, {
              stage: 'Customer Trends',
              touchpoints: [],
              opportunities: [],
              trends: editedTrends
            }];
          }
        } else {
          // Create new journey with just trends
          updatedJourney = [{
            stage: 'Customer Trends',
            touchpoints: [],
            opportunities: [],
            trends: editedTrends
          }];
        }
        
        await updateCustomerJourney.mutateAsync({ brandId, customerJourney: updatedJourney });
      } catch (error) {
        console.error('Failed to save trends:', error);
        // Revert on error
        setCustomerTrends(customerTrends);
      }
    }
  };

  const handleCancelEditTrends = () => {
    setEditedTrends(customerTrends);
    setIsEditingTrends(false);
  };

  const handleEditScenario = (id: string | number) => {
    const scenarioToEdit = customerScenarios.find(scenario => scenario.id === id);
    if (scenarioToEdit) {
      setEditedScenario({ ...scenarioToEdit });
      setEditingScenarioId(id);
    }
  };

  const handleSaveScenario = async () => {
    if (editedScenario && selectedBrand) {
      // Update local state first
      const updatedScenarios = customerScenarios.map(scenario => 
        scenario.id === editedScenario.id ? editedScenario : scenario
      );
      setCustomerScenarios(updatedScenarios);
      setEditingScenarioId(null);
      setEditedScenario(null);
      
      // Save to database
      try {
        const brandId = await brandService.getBrandIdBySlug(selectedBrand);
        if (!brandId) {
          console.error('Brand ID not found');
          return;
        }
        
        // Convert to database format
        const dbSegments = updatedScenarios.map((s, index) => ({
          id: s.id.startsWith('scenario-') && s.id.length < 20 ? undefined : s.id,
          name: s.title,
          description: s.description,
          size_percentage: s.percentage,
          needs: s.objectives || [],
          pain_points: s.barriersToChange ? [s.barriersToChange] : [],
          order_index: index
        }));
        
        await updateCustomerSegments.mutateAsync({ brandId, customerSegments: dbSegments });
      } catch (error) {
        console.error('Failed to save scenario:', error);
        // Revert on error
        setCustomerScenarios(customerScenarios);
      }
    }
  };

  const handleCancelEditScenario = () => {
    setEditingScenarioId(null);
    setEditedScenario(null);
  };

  const handleUpdateObjective = (index: number, value: string) => {
    if (editedScenario) {
      const updatedObjectives = [...editedScenario.objectives];
      updatedObjectives[index] = value;
      setEditedScenario({ ...editedScenario, objectives: updatedObjectives });
    }
  };

  const handleAddObjective = () => {
    if (editedScenario) {
      const updatedObjectives = [...editedScenario.objectives, "New objective"];
      setEditedScenario({ ...editedScenario, objectives: updatedObjectives });
    }
  };

  const handleRemoveObjective = (index: number) => {
    if (editedScenario && editedScenario.objectives.length > 1) {
      const updatedObjectives = [...editedScenario.objectives];
      updatedObjectives.splice(index, 1);
      setEditedScenario({ ...editedScenario, objectives: updatedObjectives });
    }
  };

  const handleAddScenario = () => {
    const colors = ["red", "amber", "blue", "purple", "emerald"];
    const randomColor = colors[Math.floor(Math.random() * colors.length)];
    
    const newScenario = {
      id: `scenario-${Date.now()}`,
      title: "New Scenario",
      description: "Add a description for this customer segment",
      percentage: "0%",
      count: "0",
      colorClass: randomColor,
      audience: "Define the target audience",
      scenarioSize: "Describe the size of this segment",
      currentBehaviors: "List current behaviors",
      desiredBehaviors: "List desired behaviors",
      benefitsToCustomer: "Explain benefits to customers",
      barriersToChange: "Identify barriers to change",
      changeLevers: "List key change influence levers",
      objectives: [
        "Add first objective",
        "Add second objective",
        "Add third objective",
        "Add fourth objective"
      ]
    };
    
    setCustomerScenarios([...customerScenarios, newScenario]);
    // Start editing the new scenario immediately
    handleEditScenario(newScenario.id);
  };

  const handleDeleteScenario = async (id: string | number) => {
    if (selectedBrand) {
      // Update local state first
      const newScenarios = customerScenarios.filter(scenario => scenario.id !== id);
      setCustomerScenarios(newScenarios);
      
      // Save to database
      try {
        const brandId = await brandService.getBrandIdBySlug(selectedBrand);
        if (!brandId) {
          console.error('Brand ID not found');
          return;
        }
        
        // Convert to database format
        const dbSegments = newScenarios.map((s, index) => ({
          id: s.id.startsWith('scenario-') && s.id.length < 20 ? undefined : s.id,
          name: s.title,
          description: s.description,
          size_percentage: s.percentage,
          needs: s.objectives || [],
          pain_points: s.barriersToChange ? [s.barriersToChange] : [],
          order_index: index
        }));
        
        await updateCustomerSegments.mutateAsync({ brandId, customerSegments: dbSegments });
      } catch (error) {
        // Revert on error
        console.error('Failed to delete scenario:', error);
        setCustomerScenarios(customerScenarios);
      }
    }
  };
  
  return (
    <div className="space-y-8">
      <div className="mb-6">
        <h2 className="text-2xl font-bold mb-2">Customer Analysis</h2>
        <p className="text-gray-600">Understanding who we serve and how their behaviors are evolving</p>
      </div>

      <div className="flex justify-between items-center mb-4">
        <h3 className="text-xl font-bold">Customer Personas</h3>
        <Button variant="default" onClick={handleAddPersona} className="flex items-center gap-2">
          <UserPlus size={16} />
          Add Persona
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {personas.map((persona) => {
          const colorClasses = getColorClasses(persona.color);
          
          return (
            <Card key={persona.id}>
              <CardHeader className="pb-2">
                <div className="flex items-center justify-between">
                  <div className="flex items-center space-x-2">
                    <div className={`flex-shrink-0 h-8 w-8 rounded-full ${colorClasses.bg} ${colorClasses.text} flex items-center justify-center font-bold`}>
                      P
                    </div>
                    <div>
                      {editingPersonaId === persona.id ? (
                        <>
                          <Input 
                            value={editedPersona?.title || ''}
                            onChange={(e) => handleUpdatePersonaField('title', e.target.value)}
                            className="mb-1 h-7 text-lg font-semibold"
                            placeholder="Persona Title"
                          />
                          <Input 
                            value={editedPersona?.subtitle || ''}
                            onChange={(e) => handleUpdatePersonaField('subtitle', e.target.value)}
                            className="h-6 text-sm"
                            placeholder="Subtitle"
                          />
                        </>
                      ) : (
                        <>
                          <CardTitle className="text-lg">{persona.title}</CardTitle>
                          <CardDescription>{persona.subtitle}</CardDescription>
                        </>
                      )}
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    {editingPersonaId === persona.id ? (
                      <>
                        <Button size="sm" variant="ghost" className="h-8 p-0 w-8" onClick={handleCancelEditPersona}>
                          <X size={14} />
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 p-0 w-8" onClick={handleSavePersona}>
                          <Check size={14} />
                        </Button>
                      </>
                    ) : (
                      <>
                        <Button size="sm" variant="ghost" className="h-8 gap-1" onClick={() => handleEditPersona(persona.id)}>
                          <Pencil size={14} />
                          Edit
                        </Button>
                        <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeletePersona(persona.id)}>
                          <X size={14} />
                          Delete
                        </Button>
                      </>
                    )}
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  {editingPersonaId === persona.id ? (
                    <div className="mb-4">
                      <Input 
                        value={editedPersona?.audience || ''}
                        onChange={(e) => handleUpdatePersonaField('audience', e.target.value)}
                        className="w-full"
                        placeholder="Audience description"
                      />
                    </div>
                  ) : (
                    <Badge className="mb-4 bg-gray-100 text-gray-800 hover:bg-gray-200">
                      Audience: {persona.audience || "Not defined"}
                    </Badge>
                  )}
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Profile</h4>
                      <ul className="space-y-1 text-gray-600">
                        {editingPersonaId === persona.id ? (
                          <>
                            {(editedPersona?.profile || []).map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Input 
                                  value={item}
                                  onChange={(e) => handleUpdatePersonaListItem('profile', index, e.target.value)}
                                  className="h-7 flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleRemovePersonaListItem('profile', index)}
                                >
                                  <X size={12} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs w-full"
                                onClick={() => handleAddPersonaListItem('profile')}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </li>
                          </>
                        ) : (
                          (persona.profile || []).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Current Pain Points</h4>
                      <ul className="space-y-1 text-gray-600">
                        {editingPersonaId === persona.id ? (
                          <>
                            {(editedPersona?.painPoints || []).map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Input 
                                  value={item}
                                  onChange={(e) => handleUpdatePersonaListItem('painPoints', index, e.target.value)}
                                  className="h-7 flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleRemovePersonaListItem('painPoints', index)}
                                >
                                  <X size={12} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs w-full"
                                onClick={() => handleAddPersonaListItem('painPoints')}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </li>
                          </>
                        ) : (
                          (persona.painPoints || []).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
                      <ul className="space-y-1 text-gray-600">
                        {editingPersonaId === persona.id ? (
                          <>
                            {(editedPersona?.interests || []).map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Input 
                                  value={item}
                                  onChange={(e) => handleUpdatePersonaListItem('interests', index, e.target.value)}
                                  className="h-7 flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleRemovePersonaListItem('interests', index)}
                                >
                                  <X size={12} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs w-full"
                                onClick={() => handleAddPersonaListItem('interests')}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </li>
                          </>
                        ) : (
                          (persona.interests || []).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Intent Wants/Needs</h4>
                      <ul className="space-y-1 text-gray-600">
                        {editingPersonaId === persona.id ? (
                          <>
                            {(editedPersona?.intentions || []).map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Input 
                                  value={item}
                                  onChange={(e) => handleUpdatePersonaListItem('intentions', index, e.target.value)}
                                  className="h-7 flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleRemovePersonaListItem('intentions', index)}
                                >
                                  <X size={12} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs w-full"
                                onClick={() => handleAddPersonaListItem('intentions')}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </li>
                          </>
                        ) : (
                          (persona.intentions || []).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Goals & Motivators</h4>
                      <ul className="space-y-1 text-gray-600">
                        {editingPersonaId === persona.id ? (
                          <>
                            {(editedPersona?.goals || []).map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Input 
                                  value={item}
                                  onChange={(e) => handleUpdatePersonaListItem('goals', index, e.target.value)}
                                  className="h-7 flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleRemovePersonaListItem('goals', index)}
                                >
                                  <X size={12} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs w-full"
                                onClick={() => handleAddPersonaListItem('goals')}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </li>
                          </>
                        ) : (
                          (persona.goals || []).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Preferences</h4>
                      <ul className="space-y-1 text-gray-600">
                        {editingPersonaId === persona.id ? (
                          <>
                            {(editedPersona?.preferences || []).map((item, index) => (
                              <li key={index} className="flex items-center gap-1">
                                <Input 
                                  value={item}
                                  onChange={(e) => handleUpdatePersonaListItem('preferences', index, e.target.value)}
                                  className="h-7 flex-1"
                                />
                                <Button 
                                  size="sm" 
                                  variant="ghost" 
                                  className="h-7 w-7 p-0"
                                  onClick={() => handleRemovePersonaListItem('preferences', index)}
                                >
                                  <X size={12} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                size="sm" 
                                variant="outline" 
                                className="h-7 text-xs w-full"
                                onClick={() => handleAddPersonaListItem('preferences')}
                              >
                                <Plus size={12} className="mr-1" />
                                Add
                              </Button>
                            </li>
                          </>
                        ) : (
                          (persona.preferences || []).map((item, index) => (
                            <li key={index}>{item}</li>
                          ))
                        )}
                      </ul>
                    </div>
                  </div>
                </div>
              </CardContent>
            </Card>
          );
        })}
      </div>
      
      <Card>
        <CardHeader className="flex flex-row items-center justify-between pb-2">
          <div>
            <CardTitle>Customer Trends</CardTitle>
            <CardDescription>Key insights into evolving customer behaviors</CardDescription>
          </div>
          {!isEditingTrends ? (
            <Button variant="ghost" size="sm" className="h-8" onClick={() => setIsEditingTrends(true)}>
              <Pencil size={14} className="mr-2" />
              Edit
            </Button>
          ) : (
            <div className="flex gap-2">
              <Button variant="ghost" size="sm" className="h-8" onClick={handleCancelEditTrends}>
                <X size={14} className="mr-2" />
                Cancel
              </Button>
              <Button variant="default" size="sm" className="h-8" onClick={handleSaveTrends}>
                <Save size={14} className="mr-2" />
                Save
              </Button>
            </div>
          )}
        </CardHeader>
        <CardContent>
          {!isEditingTrends ? (
            <p className="text-gray-700">{customerTrends}</p>
          ) : (
            <Textarea 
              className="min-h-[120px]" 
              value={editedTrends} 
              onChange={(e) => setEditedTrends(e.target.value)}
            />
          )}
        </CardContent>
      </Card>
      
      <div>
        <div className="flex justify-between items-center mb-4">
          <div>
            <h3 className="text-xl font-bold mb-2">Customer Behavioral Scenarios</h3>
            <p className="text-gray-600">Tracking customer journey stages and behavioral objectives at each stage</p>
          </div>
          <Button variant="default" onClick={handleAddScenario} className="flex items-center gap-2">
            <Plus size={16} />
            Add Scenario
          </Button>
        </div>
        
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5 gap-4">
          {customerScenarios.map((scenario) => (
            <Card key={scenario.id} className={`bg-${scenario.colorClass}-50 border-${scenario.colorClass}-200`}>
              <CardHeader className="flex flex-row items-center justify-between pb-2">
                <div>
                  <CardTitle className={`text-lg text-${scenario.colorClass}-800`}>
                    {editingScenarioId === scenario.id ? (
                      <Input 
                        value={editedScenario.title}
                        onChange={(e) => setEditedScenario({...editedScenario, title: e.target.value})}
                        className="mb-2"
                      />
                    ) : (
                      scenario.title
                    )}
                  </CardTitle>
                  <CardDescription className={`text-${scenario.colorClass}-600`}>
                    {editingScenarioId === scenario.id ? (
                      <Input 
                        value={editedScenario.description}
                        onChange={(e) => setEditedScenario({...editedScenario, description: e.target.value})}
                      />
                    ) : (
                      scenario.description
                    )}
                  </CardDescription>
                </div>
                {editingScenarioId === scenario.id ? (
                  <div className="flex gap-2">
                    <Button variant="ghost" size="sm" className="h-8 p-0 w-8" onClick={handleCancelEditScenario}>
                      <X size={14} />
                    </Button>
                    <Button variant="ghost" size="sm" className="h-8 p-0 w-8" onClick={handleSaveScenario}>
                      <Check size={14} />
                    </Button>
                  </div>
                ) : (
                  <div className="flex gap-1">
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8" 
                      onClick={() => handleEditScenario(scenario.id)}
                    >
                      <Pencil size={14} />
                    </Button>
                    <Button 
                      variant="ghost" 
                      size="sm" 
                      className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" 
                      onClick={() => handleDeleteScenario(scenario.id)}
                    >
                      <Trash2 size={14} />
                    </Button>
                  </div>
                )}
              </CardHeader>
              <CardContent>
                <div className="mb-4">
                  <div className={`text-${scenario.colorClass}-800 font-medium`}>
                    {editingScenarioId === scenario.id ? (
                      <Input 
                        value={editedScenario.percentage}
                        onChange={(e) => setEditedScenario({...editedScenario, percentage: e.target.value})}
                        className="mb-2"
                      />
                    ) : (
                      scenario.percentage + " of customers"
                    )}
                  </div>
                  <div className={`text-${scenario.colorClass}-600 text-sm`}>
                    {editingScenarioId === scenario.id ? (
                      <Input 
                        value={editedScenario.count}
                        onChange={(e) => setEditedScenario({...editedScenario, count: e.target.value})}
                      />
                    ) : (
                      scenario.count + " customers"
                    )}
                  </div>
                </div>
                
                <Collapsible className="w-full">
                  <div className="space-y-2">
                    <div className="mb-4">
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-2 text-sm`}>Behavioral Objectives</h4>
                      <ul className={`space-y-1 text-${scenario.colorClass}-700 text-sm`}>
                        {editingScenarioId === scenario.id ? (
                          <>
                            {editedScenario.objectives.map((objective: string, index: number) => (
                              <li key={index} className="flex items-center gap-2 mb-2">
                                <Input 
                                  value={objective}
                                  onChange={(e) => handleUpdateObjective(index, e.target.value)}
                                />
                                <Button 
                                  variant="ghost" 
                                  size="sm" 
                                  className="h-8 p-0 w-8 flex-shrink-0"
                                  onClick={() => handleRemoveObjective(index)}
                                >
                                  <X size={14} />
                                </Button>
                              </li>
                            ))}
                            <li>
                              <Button 
                                variant="outline" 
                                size="sm" 
                                className="w-full mt-2"
                                onClick={handleAddObjective}
                              >
                                <Plus size={14} className="mr-2" />
                                Add Objective
                              </Button>
                            </li>
                          </>
                        ) : (
                          scenario.objectives.map((objective, index) => (
                            <li key={index}>{objective}</li>
                          ))
                        )}
                      </ul>
                    </div>
                    
                    <CollapsibleTrigger asChild>
                      <Button variant="ghost" size="sm" className="w-full flex items-center justify-center">
                        <span>Show details</span>
                        <ChevronDown className="h-4 w-4 ml-2" />
                      </Button>
                    </CollapsibleTrigger>
                  </div>
                  
                  <CollapsibleContent className="mt-2 space-y-3">
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Audience</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.audience || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, audience: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.audience}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Scenario Size</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.scenarioSize || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, scenarioSize: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.scenarioSize}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Current Behaviors</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.currentBehaviors || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, currentBehaviors: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.currentBehaviors}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Desired Behaviors</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.desiredBehaviors || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, desiredBehaviors: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.desiredBehaviors}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Benefits to Customer</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.benefitsToCustomer || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, benefitsToCustomer: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.benefitsToCustomer}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Barriers to Change</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.barriersToChange || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, barriersToChange: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.barriersToChange}</p>
                      )}
                    </div>
                    
                    <div>
                      <h4 className={`font-medium text-${scenario.colorClass}-800 mb-1 text-sm`}>Change Influence Levers</h4>
                      {editingScenarioId === scenario.id ? (
                        <Input 
                          value={editedScenario.changeLevers || ''}
                          onChange={(e) => setEditedScenario({...editedScenario, changeLevers: e.target.value})}
                          className="mb-2"
                        />
                      ) : (
                        <p className={`text-${scenario.colorClass}-700 text-sm`}>{scenario.changeLevers}</p>
                      )}
                    </div>
                  </CollapsibleContent>
                </Collapsible>
              </CardContent>
            </Card>
          ))}
        </div>
      </div>
    </div>
  );
};

export default CustomerAnalysis;
