import { useState, useEffect } from "react";
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Progress } from "@/components/ui/progress";
import { Calendar, Clock, Target, Users, Edit, Save, Trash2, Plus, X, Loader2 } from "lucide-react";
import { useBrand } from "@/contexts/BrandContext";
import type { BrandObjective, BrandAudience, Strategy } from "@/types/brand";
import { Input } from "@/components/ui/input";
import { Textarea } from "@/components/ui/textarea";
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select";
import { 
  useAddBrandObjective, 
  useUpdateBrandObjective, 
  useDeleteBrandObjective 
} from "@/hooks/useBrandObjectiveOperations";
import { useUpdateBrandStrategies } from "@/hooks/useUpdateBrandStrategies";
import { brandService } from "@/services/brandService";
import { useToast } from "@/hooks/use-toast";
import { useQueryClient } from "@tanstack/react-query";

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
  const { getBrandData, selectedBrand, isLoading } = useBrand();
  const brandData = getBrandData();
  const addObjective = useAddBrandObjective();
  const updateObjective = useUpdateBrandObjective();
  const deleteObjective = useDeleteBrandObjective();
  const updateStrategies = useUpdateBrandStrategies();
  const { toast } = useToast();
  const queryClient = useQueryClient();
  
  // Brand ID state
  const [brandId, setBrandId] = useState<string | null>(null);
  const [isLoadingBrandId, setIsLoadingBrandId] = useState(false);
  
  // Map brand data to objectives immediately for initial render
  const mapBrandDataToObjectives = (brandData: any): Objective[] => {
    if (!brandData?.objectives || !brandData?.strategies) {
      return [];
    }
    
    // Map each objective
    return brandData.objectives.map((objective: any, index: number) => {
      // Map connected audiences
      let audienceText = "General audience";
      
      // Check if objective has target_audience_id (from new table structure)
      if (objective.target_audience_id) {
        const audience = brandData.audiences.find((a: BrandAudience) => a.id === objective.target_audience_id);
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
      
      // Build the complete objective using data from the new table structure
      return {
        id: objective.id,
        title: objective.text || objective.title,
        audience: audienceText,
        scenario: objective.scenario || brandData.profile.businessArea,
        behavioralChange: objective.notes || objective.behavioral_change || '',
        kpis: objective.kpis || kpis,
        timeline: objective.timeline || `Q${index + 1} 2025`,
        owner: objective.owner || "Marketing Team"
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
  
  // Toggle edit mode for an objective
  const toggleEditMode = async (id: string) => {
    const isCurrentlyEditing = editMode[id];
    
    // If we're currently editing and toggling off, save the data
    if (isCurrentlyEditing && brandId) {
      const objective = objectives.find(obj => obj.id === id);
      if (!objective) return;
      
      // Find the audience ID from the audience text
      const audienceId = brandData.audiences.find((a: BrandAudience) => a.text === objective.audience)?.id;
      
      try {
        // Update the individual objective
        await updateObjective.mutateAsync({
          objectiveId: objective.id,
          updates: {
            title: objective.title,
            behavioral_change: objective.behavioralChange,
            target_audience_id: audienceId || null,
            scenario: objective.scenario,
            timeline: objective.timeline,
            owner: objective.owner,
            kpis: objective.kpis,
            status: 'active'
          }
        });
      } catch (error) {
        console.error('Failed to save changes:', error);
        toast({
          title: 'Error',
          description: error instanceof Error ? error.message : 'Failed to save changes',
          variant: 'destructive',
        });
        return; // Don't toggle edit mode if save failed
      }
    }
    
    setEditMode(prev => ({
      ...prev,
      [id]: !prev[id]
    }));
  };
  
  // Update objective field locally
  const updateObjectiveField = (id: string, field: keyof Objective, value: any) => {
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
  const handleDeleteObjective = async (id: string) => {
    if (!brandId) {
      toast({
        title: 'Error',
        description: 'Brand information not loaded',
        variant: 'destructive',
      });
      return;
    }
    
    try {
      // Delete the objective from database
      await deleteObjective.mutateAsync({ objectiveId: id, brandId });
      
      // Remove from local state only after successful deletion
      setObjectives(prev => prev.filter(obj => obj.id !== id));
      // Also clear edit mode for this objective
      setEditMode(prev => {
        const updated = {...prev};
        delete updated[id];
        return updated;
      });
    } catch (error) {
      console.error('Failed to delete objective:', error);
    }
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
  const saveNewObjective = async () => {
    if (newObjective.title.trim() === "") {
      toast({
        title: 'Error',
        description: 'Objective title cannot be empty',
        variant: 'destructive',
      });
      return;
    }
    
    if (!brandId) {
      toast({
        title: 'Error',
        description: 'Brand information not loaded',
        variant: 'destructive',
      });
      return;
    }
    
    // Save to database
    try {
      // Find the audience ID from the audience text
      const audienceId = brandData.audiences.find((a: BrandAudience) => a.text === newObjective.audience)?.id;
      
      // Add the new objective
      const savedObjective = await addObjective.mutateAsync({
        brandId,
        objective: {
          title: newObjective.title,
          behavioral_change: newObjective.behavioralChange,
          target_audience_id: audienceId || null,
          scenario: newObjective.scenario,
          timeline: newObjective.timeline,
          owner: newObjective.owner,
          kpis: newObjective.kpis,
          status: 'active'
        }
      });
      
      // Add to local state with the real ID from database
      setObjectives(prev => [...prev, {
        ...newObjective,
        id: savedObjective.id
      }]);
      
      // Close the form after successful save
      setIsAddingNew(false);
      setNewObjective({
        id: '',
        title: '',
        audience: brandData.audiences.length > 0 ? brandData.audiences[0].text : "General audience",
        scenario: brandData.profile.businessArea,
        behavioralChange: '',
        kpis: [],
        timeline: '',
        owner: ''
      });
      
    } catch (error) {
      console.error('Failed to save new objective:', error);
    }
  };
  
  // Cancel adding new objective
  const cancelAddingNew = () => {
    setIsAddingNew(false);
  };

  // Show loading state
  if (isLoading || isLoadingBrandId) {
    return (
      <div className="flex items-center justify-center h-64">
        <Loader2 className="h-8 w-8 animate-spin text-gray-500" />
      </div>
    );
  }

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
                  <Select 
                    value={newObjective.audience}
                    onValueChange={(value) => updateNewObjective('audience', value)}
                  >
                    <SelectTrigger className="mt-1">
                      <SelectValue placeholder="Select audience" />
                    </SelectTrigger>
                    <SelectContent>
                      {brandData.audiences.length > 0 ? (
                        brandData.audiences.map((audience: BrandAudience) => (
                          <SelectItem key={audience.id} value={audience.text}>
                            {audience.text}
                          </SelectItem>
                        ))
                      ) : (
                        <div className="px-2 py-1 text-sm text-gray-500">
                          No audiences defined
                        </div>
                      )}
                    </SelectContent>
                  </Select>
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
              disabled={addObjective.isPending}
            >
              {addObjective.isPending ? (
                <Loader2 className="h-4 w-4 mr-2 animate-spin" />
              ) : (
                <Save className="h-4 w-4 mr-2" />
              )}
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
                    onChange={(e) => updateObjectiveField(objective.id, 'title', e.target.value)}
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
                    onChange={(e) => updateObjectiveField(objective.id, 'behavioralChange', e.target.value)}
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
                    disabled={updateObjective.isPending || updateStrategies.isPending}
                  >
                    {updateObjective.isPending || updateStrategies.isPending ? (
                      <Loader2 className="h-4 w-4 animate-spin" />
                    ) : (
                      <Save className="h-4 w-4" />
                    )}
                  </Button>
                )}
                <Button 
                  variant="ghost" 
                  size="sm" 
                  className="h-8 w-8 p-0 text-red-500"
                  onClick={() => handleDeleteObjective(objective.id)}
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
                      <Select 
                        value={objective.audience}
                        onValueChange={(value) => updateObjectiveField(objective.id, 'audience', value)}
                      >
                        <SelectTrigger className="mt-1">
                          <SelectValue placeholder="Select audience" />
                        </SelectTrigger>
                        <SelectContent>
                          {brandData.audiences.length > 0 ? (
                            brandData.audiences.map((audience: BrandAudience) => (
                              <SelectItem key={audience.id} value={audience.text}>
                                {audience.text}
                              </SelectItem>
                            ))
                          ) : (
                            <div className="px-2 py-1 text-sm text-gray-500">
                              No audiences defined
                            </div>
                          )}
                        </SelectContent>
                      </Select>
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
                        onChange={(e) => updateObjectiveField(objective.id, 'scenario', e.target.value)}
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
                      onChange={(e) => updateObjectiveField(objective.id, 'timeline', e.target.value)}
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
                      onChange={(e) => updateObjectiveField(objective.id, 'owner', e.target.value)}
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
