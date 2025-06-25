import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateBrandPersonasParams {
  brandId: string;
  personas: any[];
}

export const useUpdateBrandPersonas = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, personas }: UpdateBrandPersonasParams) =>
      brandService.updateBrandPersonas(brandId, personas),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Personas updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update personas',
        variant: 'destructive',
      });
    },
  });
};