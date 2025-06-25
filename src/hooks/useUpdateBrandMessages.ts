import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

interface UpdateBrandMessagesParams {
  brandId: string;
  messages: any[];
}

export const useUpdateBrandMessages = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, messages }: UpdateBrandMessagesParams) =>
      brandService.updateBrandMessages(brandId, messages),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Messages updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update messages',
        variant: 'destructive',
      });
    },
  });
};