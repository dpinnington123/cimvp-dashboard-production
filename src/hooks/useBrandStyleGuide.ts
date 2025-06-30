import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { BrandStyleGuide } from '@/types/brandStyleGuide';
import { toast } from 'sonner';

// Hook for managing brand style guide data
export function useBrandStyleGuide(brandId: string | undefined) {
  const queryClient = useQueryClient();

  // Fetch style guide
  const { data: styleGuide, isLoading, error } = useQuery({
    queryKey: ['brand-style-guide', brandId],
    queryFn: async () => {
      if (!brandId) return null;
      return await brandService.getBrandStyleGuide(brandId);
    },
    enabled: !!brandId,
  });

  // Update style guide
  const updateStyleGuide = useMutation({
    mutationFn: async (styleGuide: BrandStyleGuide) => {
      if (!brandId) throw new Error('Brand ID is required');
      await brandService.updateBrandStyleGuide(brandId, styleGuide);
    },
    onSuccess: () => {
      // Invalidate and refetch
      queryClient.invalidateQueries({ queryKey: ['brand-style-guide', brandId] });
      toast.success('Brand style guide updated successfully');
    },
    onError: (error) => {
      console.error('Error updating style guide:', error);
      toast.error('Failed to update brand style guide');
    },
  });

  return {
    styleGuide,
    isLoading,
    error,
    updateStyleGuide: updateStyleGuide.mutate,
    isUpdating: updateStyleGuide.isPending,
  };
}