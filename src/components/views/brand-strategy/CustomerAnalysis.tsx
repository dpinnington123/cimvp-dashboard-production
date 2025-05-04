import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, UserPlus, X, Save, Check, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState, useEffect } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";
import { useBrand } from "@/contexts/BrandContext";

const CustomerAnalysis = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  // State for personas - initialized from brand data
  const [personas, setPersonas] = useState<any[]>([]);
  
  // Initialize personas from brand data
  useEffect(() => {
    if (brandData?.customerAnalysis?.segments) {
      const mappedPersonas = brandData.customerAnalysis.segments.map((segment, index) => ({
        id: index + 1,
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
    if (brandData?.customerAnalysis?.customerJourney) {
      const journey = brandData.customerAnalysis.customerJourney;
      const trendsText = `Customer journey analysis shows key touchpoints at ${journey.map(j => j.stage).join(", ")} stages. 
      Opportunities include ${journey.flatMap(j => j.opportunities).join(", ")}. 
      Current market growth for ${brandData.profile.name} is ${brandData.profile.financials.growth}.`;
      
      setCustomerTrends(trendsText);
    }
  }, [brandData]);
  
  const [isEditingTrends, setIsEditingTrends] = useState(false);
  const [editedTrends, setEditedTrends] = useState(customerTrends);
  
  // Update edited trends when customer trends change
  useEffect(() => {
    setEditedTrends(customerTrends);
  }, [customerTrends]);
  
  // Customer scenarios from brand data and customer journey
  const [customerScenarios, setCustomerScenarios] = useState<any[]>([]);
  
  // Initialize scenarios from brand data
  useEffect(() => {
    if (brandData?.customerAnalysis?.customerJourney) {
      const journey = brandData.customerAnalysis.customerJourney;
      const colors = ["red", "amber", "blue", "purple", "emerald"];
      
      const mappedScenarios = journey.map((stage, index) => ({
        id: index + 1,
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
  
  const [editingScenarioId, setEditingScenarioId] = useState<number | null>(null);
  const [editedScenario, setEditedScenario] = useState<any>(null);

  const handleAddPersona = () => {
    const newPersona = {
      id: personas.length + 1,
      title: `Persona ${personas.length + 1}`,
      subtitle: "New Customer Segment",
      audience: "Define the audience for this persona",
      color: "purple",
      profile: ["Age range", "Location", "Demographics", "Income level"],
      painPoints: ["Pain point 1", "Pain point 2", "Pain point 3", "Pain point 4"],
      interests: ["Interest 1", "Interest 2", "Interest 3", "Interest 4"],
      intentions: ["Intention 1", "Intention 2", "Intention 3", "Intention 4"],
      goals: ["Goal 1", "Goal 2", "Goal 3", "Goal 4"],
      preferences: ["Preference 1", "Preference 2", "Preference 3", "Preference 4"],
    };
    
    setPersonas([...personas, newPersona]);
  };

  const handleDeletePersona = (id: number) => {
    setPersonas(personas.filter(persona => persona.id !== id));
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

  const handleSaveTrends = () => {
    setCustomerTrends(editedTrends);
    setIsEditingTrends(false);
  };

  const handleCancelEditTrends = () => {
    setEditedTrends(customerTrends);
    setIsEditingTrends(false);
  };

  const handleEditScenario = (id: number) => {
    const scenarioToEdit = customerScenarios.find(scenario => scenario.id === id);
    if (scenarioToEdit) {
      setEditedScenario({ ...scenarioToEdit });
      setEditingScenarioId(id);
    }
  };

  const handleSaveScenario = () => {
    if (editedScenario) {
      setCustomerScenarios(customerScenarios.map(scenario => 
        scenario.id === editedScenario.id ? editedScenario : scenario
      ));
      setEditingScenarioId(null);
      setEditedScenario(null);
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
      id: Math.max(...customerScenarios.map(s => s.id)) + 1,
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
  };

  const handleDeleteScenario = (id: number) => {
    setCustomerScenarios(customerScenarios.filter(scenario => scenario.id !== id));
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
                      <CardTitle className="text-lg">{persona.title}</CardTitle>
                      <CardDescription>{persona.subtitle}</CardDescription>
                    </div>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 gap-1">
                      <Pencil size={14} />
                      Edit
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-red-500 hover:text-red-700 hover:bg-red-50" onClick={() => handleDeletePersona(persona.id)}>
                      <X size={14} />
                      Delete
                    </Button>
                  </div>
                </div>
              </CardHeader>
              <CardContent>
                <div className="text-sm">
                  <Badge className="mb-4 bg-gray-100 text-gray-800 hover:bg-gray-200">
                    Audience: {persona.audience}
                  </Badge>
                  
                  <div className="grid grid-cols-1 sm:grid-cols-2 gap-x-6 gap-y-4">
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Profile</h4>
                      <ul className="space-y-1 text-gray-600">
                        {persona.profile.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Current Pain Points</h4>
                      <ul className="space-y-1 text-gray-600">
                        {persona.painPoints.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Interests</h4>
                      <ul className="space-y-1 text-gray-600">
                        {persona.interests.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Intent Wants/Needs</h4>
                      <ul className="space-y-1 text-gray-600">
                        {persona.intentions.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Goals & Motivators</h4>
                      <ul className="space-y-1 text-gray-600">
                        {persona.goals.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
                      </ul>
                    </div>
                    
                    <div>
                      <h4 className="font-medium text-gray-900 mb-2">Preferences</h4>
                      <ul className="space-y-1 text-gray-600">
                        {persona.preferences.map((item, index) => (
                          <li key={index}>{item}</li>
                        ))}
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
