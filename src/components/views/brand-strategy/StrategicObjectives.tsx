import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Users, Edit, Save, Trash2, Plus, X } from "lucide-react";
import { useBrand } from "@/contexts/BrandContext";
import type { BrandObjective, BrandAudience, Strategy } from "@/types/brand";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";

// Enhanced strategy interface with audience connections
interface EnhancedStrategy extends Strategy {
  objectiveId?: string;
  audienceId?: string;
  metrics?: Array<{
    name: string;
    current: number;
    target: number;
  }>;
}

// Enhanced BrandObjective interface with additional fields
interface EnhancedObjective extends BrandObjective {
  name?: string;
  targetAudienceId?: string;
  scenario?: string;
  desiredOutcome?: string;
  timeline?: string;
  owner?: string;
}

interface KPIItem {
  metric: string;
  target: string;
  currentValue: string;
  progress: number;
}

interface Objective {
  id: string;
  title: string;
  audience: string;
  scenario: string;
  behavioralChange: string;
  kpis: KPIItem[];
  timeline: string;
  owner: string;
}

const StrategicObjectives = () => {
  const { getBrandData } = useBrand();
  const brandData = getBrandData();
  
  // Map brand data to objectives immediately for initial render
  const mapBrandDataToObjectives = (brandData: any): Objective[] => {
    if (!brandData?.objectives || !brandData?.strategies) {
      return [];
    }
    
    // Map each objective
    return brandData.objectives.map((objective: BrandObjective, index: number) => {
      // For type safety
      const enhancedObjective = objective as EnhancedObjective;
      
      // Map connected audiences and strategies
      let audienceText = "General audience";
      const audienceId = enhancedObjective.targetAudienceId;
      
      // Connect to audience if possible
      if (audienceId) {
        const audience = brandData.audiences.find((a: BrandAudience) => a.id === audienceId);
        if (audience) {
          audienceText = audience.text;
        }
      } else if (brandData.audiences.length > 0) {
        // Default to first audience if no specific connection
        audienceText = brandData.audiences[0].text;
      }
      
      // For each objective, find related strategies
      const relatedStrategies = brandData.strategies
        .map((s: Strategy) => s as EnhancedStrategy)
        .filter((s: EnhancedStrategy, i: number) => {
          // If strategy has objectiveId property, use it
          if (s.objectiveId) {
            return s.objectiveId === objective.id;
          }
          // Fallback to positional matching if no explicit connections
          return i === index;
        });
      
      // Generate meaningful KPIs
      let kpis: KPIItem[] = [];
      if (relatedStrategies.length > 0) {
        // Create KPIs from strategies
        kpis = relatedStrategies.map((strategy) => ({
          metric: strategy.name,
          target: "100%",
          currentValue: `${strategy.score}%`,
          progress: strategy.score
        }));
      } else {
        // Default KPI if no strategies found
        kpis = [{
          metric: "Overall success",
          target: "100%",
          currentValue: "45%",
          progress: 45
        }];
      }
      
      // Build the complete objective
      return {
        id: objective.id,
        title: objective.text,
        audience: audienceText,
        scenario: brandData.profile.businessArea,
        behavioralChange: objective.notes,
        kpis: kpis,
        timeline: `Q${index + 1} 2023`,
        owner: "Marketing Team"
      };
    });
  };
  
  // Initialize with mapped data from current brand
  const [objectives, setObjectives] = useState<Objective[]>(
    mapBrandDataToObjectives(brandData)
  );
  
  // State for tracking editing mode
  const [editMode, setEditMode] = useState<Record<string, boolean>>({});
  const [isAddingNew, setIsAddingNew] = useState(false);
  const [newObjective, setNewObjective] = useState<Objective>({
    id: "",
    title: "",
    audience: "General audience",
    scenario: "General use case",
    behavioralChange: "",
    kpis: [{
      metric: "Success measure",
      target: "100%",
      currentValue: "0%",
      progress: 0
    }],
    timeline: "Q4 2023",
    owner: "Marketing Team"
  });
  
  // Update objectives when brand data changes
  useEffect(() => {
    setObjectives(mapBrandDataToObjectives(brandData));
    // Reset edit mode when brand changes
    setEditMode({});
    setIsAddingNew(false);
  }, [brandData]);
  
  // Toggle edit mode for an objective
  const toggleEditMode = (id: string) => {
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Update objective field
  const updateObjective = (id: string, field: keyof Objective, value: any) => {
    setObjectives(prev => 
      prev.map(obj => 
        obj.id === id 
          ? { ...obj, [field]: value } 
          : obj
      )
    );
  };
  
  // Update KPI in objective
  const updateKPI = (objectiveId: string, kpiIndex: number, field: keyof KPIItem, value: string) => {
    setObjectives(prev => 
      prev.map(obj => {
        if (obj.id === objectiveId) {
          const updatedKPIs = [...obj.kpis];
          updatedKPIs[kpiIndex] = { 
            ...updatedKPIs[kpiIndex], 
            [field]: value,
            // Update progress when currentValue or target changes
            ...(field === 'currentValue' || field === 'target' ? {
              progress: calculateProgress(field === 'currentValue' ? value : updatedKPIs[kpiIndex].currentValue, 
                                         field === 'target' ? value : updatedKPIs[kpiIndex].target)
            } : {})
          };
          return { ...obj, kpis: updatedKPIs };
        }
        return obj;
      })
    );
  };
  
  // Calculate progress from percentage values
  const calculateProgress = (current: string, target: string): number => {
    const currentVal = parseInt(current.replace('%', ''));
    const targetVal = parseInt(target.replace('%', ''));
    return targetVal > 0 ? Math.min(Math.round((currentVal / targetVal) * 100), 100) : 0;
  };
  
  // Add new KPI to objective
  const addKPI = (objectiveId: string) => {
    setObjectives(prev => 
      prev.map(obj => {
        if (obj.id === objectiveId) {
          return {
            ...obj,
            kpis: [
              ...obj.kpis,
              {
                metric: "New KPI",
                target: "100%",
                currentValue: "0%",
                progress: 0
              }
            ]
          };
        }
        return obj;
      })
    );
  };
  
  // Remove KPI from objective
  const removeKPI = (objectiveId: string, kpiIndex: number) => {
    setObjectives(prev => 
      prev.map(obj => {
        if (obj.id === objectiveId && obj.kpis.length > 1) {
          const updatedKPIs = [...obj.kpis];
          updatedKPIs.splice(kpiIndex, 1);
          return { ...obj, kpis: updatedKPIs };
        }
        return obj;
      })
    );
  };
  
  // Delete objective
  const deleteObjective = (id: string) => {
    setObjectives(prev => prev.filter(obj => obj.id !== id));
    // Also clear edit mode for this objective
    setEditMode(prev => {
      const updated = {...prev};
      delete updated[id];
      return updated;
    });
  };
  
  // Handle adding new objective
  const startAddingNew = () => {
    setIsAddingNew(true);
    setNewObjective({
      id: `new-obj-${Date.now()}`,
      title: "",
      audience: brandData.audiences.length > 0 ? brandData.audiences[0].text : "General audience",
      scenario: brandData.profile.businessArea,
      behavioralChange: "",
      kpis: [{
        metric: "Success measure",
        target: "100%",
        currentValue: "0%",
        progress: 0
      }],
      timeline: `Q${new Date().getMonth() < 9 ? Math.floor(new Date().getMonth() / 3) + 1 : 4} ${new Date().getFullYear()}`,
      owner: "Marketing Team"
    });
  };
  
  // Update new objective field
  const updateNewObjective = (field: keyof Objective, value: any) => {
    setNewObjective(prev => ({
      ...prev,
      [field]: value
    }));
  };
  
  // Update KPI in new objective
  const updateNewKPI = (kpiIndex: number, field: keyof KPIItem, value: string) => {
    setNewObjective(prev => {
      const updatedKPIs = [...prev.kpis];
      updatedKPIs[kpiIndex] = { 
        ...updatedKPIs[kpiIndex], 
        [field]: value,
        progress: field === 'currentValue' ? 
          calculateProgress(value, updatedKPIs[kpiIndex].target) : 
          field === 'target' ? 
            calculateProgress(updatedKPIs[kpiIndex].currentValue, value) : 
            updatedKPIs[kpiIndex].progress
      };
      return { ...prev, kpis: updatedKPIs };
    });
  };
  
  // Add new KPI to new objective
  const addNewKPI = () => {
    setNewObjective(prev => ({
      ...prev,
      kpis: [
        ...prev.kpis,
        {
          metric: "New KPI",
          target: "100%",
          currentValue: "0%",
          progress: 0
        }
      ]
    }));
  };
  
  // Remove KPI from new objective
  const removeNewKPI = (kpiIndex: number) => {
    if (newObjective.kpis.length > 1) {
      setNewObjective(prev => {
        const updatedKPIs = [...prev.kpis];
        updatedKPIs.splice(kpiIndex, 1);
        return { ...prev, kpis: updatedKPIs };
      });
    }
  };
  
  // Save new objective
  const saveNewObjective = () => {
    if (newObjective.title.trim() === "") {
      // Simple validation
      alert("Objective title cannot be empty");
      return;
    }
    
    setObjectives(prev => [...prev, newObjective]);
    setIsAddingNew(false);
  };
  
  // Cancel adding new objective
  const cancelAddingNew = () => {
    setIsAddingNew(false);
  };

  return (
    <div className="space-y-6">
      <div className="flex justify-between items-center">
        <div>
          <h2 className="text-2xl font-bold">Strategic Objectives</h2>
          <p className="text-muted-foreground">
            Key objectives that drive {brandData.profile.name}'s brand behavior change strategy
          </p>
        </div>
        <Button 
          onClick={startAddingNew} 
          className="bg-emerald-600 hover:bg-emerald-700"
          disabled={isAddingNew}
        >
          <Plus className="h-4 w-4 mr-2" />
          Add Objective
        </Button>
      </div>

      {isAddingNew && (
        <Card className="border-2 border-emerald-500 mb-6">
          <CardHeader className="pb-2">
            <CardTitle className="text-lg font-bold leading-tight">
              <Input 
                placeholder="Objective title" 
                value={newObjective.title}
                onChange={(e) => updateNewObjective('title', e.target.value)}
                className="font-bold text-lg"
              />
            </CardTitle>
            <CardDescription className="line-clamp-2">
              <Textarea 
                placeholder="Describe the desired behavioral change" 
                value={newObjective.behavioralChange}
                onChange={(e) => updateNewObjective('behavioralChange', e.target.value)}
                className="mt-2"
                rows={2}
              />
            </CardDescription>
          </CardHeader>
          <CardContent className="flex-1 flex flex-col pt-0">
            <div className="space-y-4 flex-1">
              <div className="flex items-start space-x-2">
                <Users className="h-4 w-4 mt-2 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Target Audience</p>
                  <Input 
                    value={newObjective.audience}
                    onChange={(e) => updateNewObjective('audience', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="flex items-start space-x-2">
                <Target className="h-4 w-4 mt-2 text-gray-500" />
                <div className="flex-1">
                  <p className="text-sm font-medium">Behavioral Scenario</p>
                  <Input 
                    value={newObjective.scenario}
                    onChange={(e) => updateNewObjective('scenario', e.target.value)}
                    className="mt-1"
                  />
                </div>
              </div>
              
              <div className="space-y-3">
                <div className="flex justify-between items-center">
                  <p className="text-sm font-medium">KPIs</p>
                  <Button 
                    size="sm" 
                    variant="outline"
                    onClick={addNewKPI}
                    className="h-6 text-xs"
                  >
                    <Plus className="h-3 w-3 mr-1" />
                    Add KPI
                  </Button>
                </div>
                <div className="space-y-3">
                  {newObjective.kpis.map((kpi, index) => (
                    <div key={index} className="space-y-2 pb-2 border-b border-gray-100">
                      <div className="flex gap-2 items-center">
                        <Input 
                          value={kpi.metric}
                          onChange={(e) => updateNewKPI(index, 'metric', e.target.value)}
                          className="flex-1"
                          placeholder="KPI name"
                        />
                        {newObjective.kpis.length > 1 && (
                          <Button 
                            size="sm" 
                            variant="ghost" 
                            onClick={() => removeNewKPI(index)}
                            className="h-8 w-8 p-0 text-gray-500"
                          >
                            <X className="h-4 w-4" />
                          </Button>
                        )}
                      </div>
                      <div className="flex gap-2 justify-between items-center">
                        <div className="flex gap-2 items-center flex-1">
                          <Input 
                            value={kpi.currentValue}
                            onChange={(e) => updateNewKPI(index, 'currentValue', e.target.value)}
                            className="w-24"
                          />
                          <span className="text-gray-500">/</span>
                          <Input 
                            value={kpi.target}
                            onChange={(e) => updateNewKPI(index, 'target', e.target.value)}
                            className="w-24"
                          />
                        </div>
                      </div>
                      <Progress value={kpi.progress} className="h-2" />
                    </div>
                  ))}
                </div>
              </div>
            </div>
            
            <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
              <div className="flex items-center space-x-2 flex-1">
                <Calendar className="h-4 w-4 text-gray-500" />
                <Input 
                  value={newObjective.timeline}
                  onChange={(e) => updateNewObjective('timeline', e.target.value)}
                  className="w-28"
                />
              </div>
              <div className="flex items-center space-x-2 flex-1">
                <Clock className="h-4 w-4 text-gray-500" />
                <Input 
                  value={newObjective.owner}
                  onChange={(e) => updateNewObjective('owner', e.target.value)}
                />
              </div>
            </div>
          </CardContent>
          <CardFooter className="flex justify-end space-x-2 pt-2 border-t">
            <Button variant="outline" onClick={cancelAddingNew}>
              Cancel
            </Button>
            <Button 
              onClick={saveNewObjective}
              className="bg-emerald-600 hover:bg-emerald-700"
            >
              <Save className="h-4 w-4 mr-2" />
              Save Objective
            </Button>
          </CardFooter>
        </Card>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-3 gap-6">
        {objectives.map((objective) => (
          <Card key={objective.id} className="flex flex-col h-full overflow-hidden">
            <CardHeader className="pb-2 flex flex-row justify-between items-start">
              <div className="flex-1">
                {editMode[objective.id] ? (
                  <Input 
                    value={objective.title}
                    onChange={(e) => updateObjective(objective.id, 'title', e.target.value)}
                    className="font-bold text-lg mb-2"
                  />
                ) : (
                  <CardTitle className="text-lg font-bold leading-tight">
                    {objective.title}
                  </CardTitle>
                )}
                {editMode[objective.id] ? (
                  <Textarea 
                    value={objective.behavioralChange}
                    onChange={(e) => updateObjective(objective.id, 'behavioralChange', e.target.value)}
                    className="mt-2"
                    rows={2}
                  />
                ) : (
                  <CardDescription className="line-clamp-2 h-10">
                    {objective.behavioralChange}
                  </CardDescription>
                )}
              </div>
              <div className="flex space-x-1">
                {!editMode[objective.id] ? (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-gray-500"
                    onClick={() => toggleEditMode(objective.id)}
                  >
                    <Edit className="h-4 w-4" />
                  </Button>
                ) : (
                  <Button 
                    variant="ghost" 
                    size="sm" 
                    className="h-8 w-8 p-0 text-emerald-600"
                    onClick={() => toggleEditMode(objective.id)}
                  >
                    <Save className="h-4 w-4" />
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500"
                  onClick={() => deleteObjective(objective.id)}
                >
                  <Trash2 className="h-4 w-4" />
                </Button>
              </div>
            </CardHeader>
            <CardContent className="flex-1 flex flex-col pt-0">
              <div className="space-y-4 flex-1">
                <div className="flex items-start space-x-2">
                  <Users className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Target Audience</p>
                    {editMode[objective.id] ? (
                      <Input 
                        value={objective.audience}
                        onChange={(e) => updateObjective(objective.id, 'audience', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">{objective.audience}</p>
                    )}
                  </div>
                </div>
                
                <div className="flex items-start space-x-2">
                  <Target className="h-4 w-4 mt-0.5 text-gray-500" />
                  <div className="flex-1">
                    <p className="text-sm font-medium">Behavioral Scenario</p>
                    {editMode[objective.id] ? (
                      <Input 
                        value={objective.scenario}
                        onChange={(e) => updateObjective(objective.id, 'scenario', e.target.value)}
                        className="mt-1"
                      />
                    ) : (
                      <p className="text-sm text-gray-500">{objective.scenario}</p>
                    )}
                  </div>
                </div>
                
                <div className="space-y-3">
                  <div className="flex justify-between items-center">
                    <p className="text-sm font-medium">KPIs</p>
                    {editMode[objective.id] && (
                      <Button 
                        size="sm" 
                        variant="outline"
                        onClick={() => addKPI(objective.id)}
                        className="h-6 text-xs"
                      >
                        <Plus className="h-3 w-3 mr-1" />
                        Add KPI
                      </Button>
                    )}
                  </div>
                  <div className="space-y-3">
                    {objective.kpis.map((kpi, index) => (
                      <div key={index} className={`space-y-1 ${editMode[objective.id] ? 'pb-2 border-b border-gray-100' : ''}`}>
                        {editMode[objective.id] ? (
                          <div className="flex gap-2 items-center">
                            <Input 
                              value={kpi.metric}
                              onChange={(e) => updateKPI(objective.id, index, 'metric', e.target.value)}
                              className="flex-1"
                            />
                            {objective.kpis.length > 1 && (
                              <Button 
                                size="sm" 
                                variant="ghost" 
                                onClick={() => removeKPI(objective.id, index)}
                                className="h-8 w-8 p-0 text-gray-500"
                              >
                                <X className="h-4 w-4" />
                              </Button>
                            )}
                          </div>
                        ) : (
                          <div className="flex justify-between text-sm">
                            <span className="text-gray-700">{kpi.metric}</span>
                            <span>
                              {kpi.currentValue} / {kpi.target}
                            </span>
                          </div>
                        )}
                        {editMode[objective.id] && (
                          <div className="flex gap-2 justify-between items-center">
                            <div className="flex gap-2 items-center flex-1">
                              <Input 
                                value={kpi.currentValue}
                                onChange={(e) => updateKPI(objective.id, index, 'currentValue', e.target.value)}
                                className="w-24"
                              />
                              <span className="text-gray-500">/</span>
                              <Input 
                                value={kpi.target}
                                onChange={(e) => updateKPI(objective.id, index, 'target', e.target.value)}
                                className="w-24"
                              />
                            </div>
                          </div>
                        )}
                        <Progress value={kpi.progress} className="h-2" />
                      </div>
                    ))}
                  </div>
                </div>
              </div>
              
              <div className="flex items-center justify-between mt-4 pt-4 border-t border-gray-100">
                <div className="flex items-center space-x-2">
                  <Calendar className="h-4 w-4 text-gray-500" />
                  {editMode[objective.id] ? (
                    <Input 
                      value={objective.timeline}
                      onChange={(e) => updateObjective(objective.id, 'timeline', e.target.value)}
                      className="w-28 h-7 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{objective.timeline}</span>
                  )}
                </div>
                <div className="flex items-center space-x-2">
                  <Clock className="h-4 w-4 text-gray-500" />
                  {editMode[objective.id] ? (
                    <Input 
                      value={objective.owner}
                      onChange={(e) => updateObjective(objective.id, 'owner', e.target.value)}
                      className="w-40 h-7 text-sm"
                    />
                  ) : (
                    <span className="text-sm text-gray-500">{objective.owner}</span>
                  )}
                </div>
              </div>
            </CardContent>
          </Card>
        ))}
      </div>
    </div>
  );
};

export default StrategicObjectives;
