
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Badge } from "@/components/ui/badge";
import { Button } from "@/components/ui/button";
import { Pencil, UserPlus, X, Save, Check, Plus, Trash2, ChevronDown } from "lucide-react";
import { useState } from "react";
import { Textarea } from "@/components/ui/textarea";
import { Input } from "@/components/ui/input";
import { Collapsible, CollapsibleContent, CollapsibleTrigger } from "@/components/ui/collapsible";

const CustomerAnalysis = () => {
  const [personas, setPersonas] = useState([
    {
      id: 1,
      title: "Persona 1",
      subtitle: "Urban Professional • 28-35",
      audience: "Young urban professionals with disposable income",
      color: "emerald",
      profile: [
        "28-35 years old",
        "Lives in major metropolitan areas",
        "College educated",
        "High disposable income",
      ],
      painPoints: [
        "Limited free time",
        "Overwhelmed by choices",
        "Skeptical of marketing claims",
        "Concerned about environmental impact",
      ],
      interests: [
        "Technology and innovation",
        "Sustainable products",
        "Premium experiences",
        "Wellness and self-care",
      ],
      intentions: [
        "Time-saving solutions",
        "Premium quality products",
        "Brand authenticity",
        "Mobile-first experience",
      ],
      goals: [
        "Find trusted brands to simplify decisions",
        "Support companies with strong values",
        "Balance quality and convenience",
        "Showcase personal style",
      ],
      preferences: [
        "Researches extensively before purchasing",
        "Shops primarily on mobile",
        "Highly influenced by peer reviews",
        "Values brands with purpose",
      ],
    },
    {
      id: 2,
      title: "Persona 2",
      subtitle: "Tech-Savvy Parent • 35-45",
      audience: "Middle-income families with young children",
      color: "blue",
      profile: [
        "35-45 years old",
        "Suburban households",
        "Has 1-3 children",
        "Dual income family",
      ],
      painPoints: [
        "Busy schedule juggling work and family",
        "Budget constraints",
        "Safety concerns",
        "Needs solutions that work for the whole family",
      ],
      interests: [
        "Family activities",
        "Educational content",
        "Home improvement",
        "Health and wellness",
      ],
      intentions: [
        "Family-friendly solutions",
        "Value for money",
        "Reliability and durability",
        "Excellent customer service",
      ],
      goals: [
        "Maximize family time and efficiency",
        "Find trusted products that last",
        "Stay within budget while maintaining quality",
        "Support brands with family values",
      ],
      preferences: [
        "Researches product safety extensively",
        "Loyal to brands that prove their value",
        "Seeks recommendations from parent networks",
        "Expects seamless omnichannel experience",
      ],
    },
  ]);

  const [customerTrends, setCustomerTrends] = useState(
    "Mobile purchasing continues to rise significantly, with an increase from 30% in Q1 2024 to 60% in Q1 2025, " +
    "indicating the need to prioritize mobile-first experiences. Customer acquisition costs are increasing, making " +
    "retention strategies more valuable. Subscription-based models are gaining popularity, with 45% of customers " +
    "preferring subscriptions over one-time purchases."
  );
  
  const [isEditingTrends, setIsEditingTrends] = useState(false);
  const [editedTrends, setEditedTrends] = useState(customerTrends);
  
  const [customerScenarios, setCustomerScenarios] = useState([
    {
      id: 1,
      title: "Detractors",
      description: "Customers who have had negative experiences",
      percentage: "5%",
      count: "2,500",
      colorClass: "red",
      audience: "Previous customers with unresolved issues",
      scenarioSize: "Small but vocal group",
      currentBehaviors: "Public complaints, negative reviews, brand avoidance",
      desiredBehaviors: "Problem resolution, re-engagement, brand reconsideration",
      benefitsToCustomer: "Issue resolution, better product fit, restored trust",
      barriersToChange: "Damaged trust, negative experiences, emotional investment in complaint",
      changeLevers: "Quick response, above-and-beyond resolution, personal outreach",
      objectives: [
        "Identify pain points and resolve issues quickly",
        "Transform negative experiences into positive ones",
        "Rebuild trust through personalized solutions",
        "Establish ongoing communication and feedback channels"
      ]
    },
    {
      id: 2,
      title: "Awareness to Consider",
      description: "Potential customers becoming aware of our brand",
      percentage: "35%",
      count: "17,500",
      colorClass: "amber",
      audience: "Market-aware prospects with unmet needs",
      scenarioSize: "Large segment of market",
      currentBehaviors: "Passive browsing, comparing options, information gathering",
      desiredBehaviors: "Active engagement, deeper product research, free trial sign-ups",
      benefitsToCustomer: "Finding solution to specific problems, improving current situation",
      barriersToChange: "Information overload, unclear differentiation, analysis paralysis",
      changeLevers: "Clear value proposition, customer testimonials, simplified comparison",
      objectives: [
        "Increase brand visibility across relevant channels",
        "Provide clear, compelling value propositions",
        "Address common objections proactively",
        "Simplify initial engagement and information gathering"
      ]
    },
    {
      id: 3,
      title: "Consider to Buy",
      description: "Prospects actively evaluating our products",
      percentage: "25%",
      count: "12,500",
      colorClass: "blue",
      audience: "Engaged prospects with defined needs",
      scenarioSize: "Medium segment with high potential",
      currentBehaviors: "Product comparison, feature evaluation, pricing research",
      desiredBehaviors: "Trial completion, decision-making, purchase initiation",
      benefitsToCustomer: "Finding optimal solution, confidence in decision, clear ROI",
      barriersToChange: "Decision risk, price concerns, implementation worries",
      changeLevers: "Money-back guarantee, case studies, implementation support",
      objectives: [
        "Deliver tailored product demonstrations and trials",
        "Provide transparent pricing and value comparisons",
        "Reduce friction in the purchase process",
        "Establish trust through testimonials and social proof"
      ]
    },
    {
      id: 4,
      title: "Expand Use",
      description: "Existing customers increasing engagement",
      percentage: "20%",
      count: "10,000",
      colorClass: "purple",
      audience: "Current customers with growth potential",
      scenarioSize: "Medium segment with high lifetime value",
      currentBehaviors: "Basic product usage, underutilization of features",
      desiredBehaviors: "Advanced feature adoption, increased usage, additional purchases",
      benefitsToCustomer: "Greater ROI, enhanced productivity, better outcomes",
      barriersToChange: "Comfort with status quo, training time, change management",
      changeLevers: "Success stories, training resources, personalized recommendations",
      objectives: [
        "Educate customers on additional features and use cases",
        "Create seamless cross-sell and up-sell pathways",
        "Reward increased usage and engagement",
        "Collect and implement feedback for product improvement"
      ]
    },
    {
      id: 5,
      title: "Advocacy",
      description: "Loyal customers who promote our brand",
      percentage: "15%",
      count: "7,500",
      colorClass: "emerald",
      audience: "Highly satisfied customers with social influence",
      scenarioSize: "Small but highly influential group",
      currentBehaviors: "Frequent usage, occasional recommendations, positive reviews",
      desiredBehaviors: "Active referrals, testimonials, social sharing, community participation",
      benefitsToCustomer: "Exclusivity, recognition, community belonging, additional value",
      barriersToChange: "Time constraints, lack of incentives, no clear process",
      changeLevers: "Recognition programs, referral incentives, exclusive access",
      objectives: [
        "Create exclusive community and recognition programs",
        "Provide shareable content and referral incentives",
        "Involve advocates in product development and testing",
        "Celebrate customer success stories and testimonials"
      ]
    }
  ]);
  
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
