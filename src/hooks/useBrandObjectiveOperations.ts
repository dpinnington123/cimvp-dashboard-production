import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for individual brand objective operations (add, update, delete)
 * Uses safe CRUD operations instead of DELETE-then-INSERT pattern
 */

interface AddObjectiveParams {
  brandId: string;
  objective: any;
}

interface UpdateObjectiveParams {
  objectiveId: string;
  updates: any;
}

interface DeleteObjectiveParams {
  objectiveId: string;
  brandId: string;
}

export const useAddBrandObjective = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, objective }: AddObjectiveParams) =>
      brandService.addBrandObjective(brandId, objective),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Objective added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add objective',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBrandObjective = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ objectiveId, updates }: UpdateObjectiveParams) =>
      brandService.updateSingleBrandObjective(objectiveId, updates),
    onSuccess: () => {
      // Invalidate all brand queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Objective updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update objective',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBrandObjective = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ objectiveId }: DeleteObjectiveParams) =>
      brandService.deleteBrandObjective(objectiveId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Objective deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete objective',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for safe batch update of all objectives
 * Uses the new safeUpdateRelationalData utility
 */
interface SafeUpdateObjectivesParams {
  brandId: string;
  objectives: any[];
}

export const useSafeBatchUpdateObjectives = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, objectives }: SafeUpdateObjectivesParams) =>
      brandService.safeUpdateBrandObjectives(brandId, objectives),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'All objectives updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update objectives',
        variant: 'destructive',
      });
    },
  });
};