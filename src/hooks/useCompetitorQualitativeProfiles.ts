import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateCompetitorProfilesParams {
  brandId: string;
  profiles: Array<{
    competitorId: string;
    qualitativeProfiles: Record<string, string>;
  }>;
}

interface UpdateSingleProfileParams {
  competitorId: string;
  qualitativeProfiles: Record<string, string>;
}

interface AddCharacteristicParams {
  brandId: string;
  characteristicName: string;
  defaultValue?: string;
}

/**
 * Hook for updating all competitor qualitative profiles
 */
export const useUpdateCompetitorQualitativeProfiles = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, profiles }: UpdateCompetitorProfilesParams) =>
      brandService.updateCompetitorQualitativeProfiles(brandId, profiles),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Competitor profiles updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update competitor profiles',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for updating a single competitor's qualitative profile
 */
export const useUpdateSingleCompetitorQualitativeProfile = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ competitorId, qualitativeProfiles }: UpdateSingleProfileParams) =>
      brandService.updateSingleCompetitorQualitativeProfile(competitorId, qualitativeProfiles),
    onSuccess: () => {
      // Invalidate all brand queries to ensure fresh data
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Profile updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update profile',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for adding a new characteristic to all competitors
 */
export const useAddCharacteristicToAllCompetitors = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, characteristicName, defaultValue = 'Not Assessed' }: AddCharacteristicParams) =>
      brandService.addCharacteristicToAllCompetitors(brandId, characteristicName, defaultValue),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'New characteristic added to all competitors',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add characteristic',
        variant: 'destructive',
      });
    },
  });
};