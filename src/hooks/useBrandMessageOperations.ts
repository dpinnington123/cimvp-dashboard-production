import { useMutation, useQueryClient } from '@tanstack/react-query';
import { brandService } from '@/services/brandService';
import { useToast } from '@/hooks/use-toast';

/**
 * Hook for individual brand message operations (add, update, delete)
 * Uses safe CRUD operations instead of DELETE-then-INSERT pattern
 */

interface AddMessageParams {
  brandId: string;
  message: any;
}

interface UpdateMessageParams {
  messageId: string;
  updates: any;
}

interface DeleteMessageParams {
  messageId: string;
  brandId: string;
}

export const useAddBrandMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, message }: AddMessageParams) =>
      brandService.addBrandMessage(brandId, message),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Message added successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to add message',
        variant: 'destructive',
      });
    },
  });
};

export const useUpdateBrandMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ messageId, updates }: UpdateMessageParams) =>
      brandService.updateSingleBrandMessage(messageId, updates),
    onSuccess: () => {
      // Invalidate all brand queries to ensure UI updates
      queryClient.invalidateQueries({ queryKey: ['brand'] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Message updated successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to update message',
        variant: 'destructive',
      });
    },
  });
};

export const useDeleteBrandMessage = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ messageId }: DeleteMessageParams) =>
      brandService.deleteBrandMessage(messageId),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'Message deleted successfully',
      });
    },
    onError: (error: Error) => {
      toast({
        title: 'Error',
        description: error.message || 'Failed to delete message',
        variant: 'destructive',
      });
    },
  });
};

/**
 * Hook for safe batch update of all messages
 * Uses the new safeUpdateRelationalData utility
 */
interface SafeUpdateMessagesParams {
  brandId: string;
  messages: any[];
}

export const useSafeBatchUpdateMessages = () => {
  const queryClient = useQueryClient();
  const { toast } = useToast();

  return useMutation({
    mutationFn: ({ brandId, messages }: SafeUpdateMessagesParams) =>
      brandService.safeUpdateBrandMessages(brandId, messages),
    onSuccess: (_, variables) => {
      // Invalidate and refetch brand data
      queryClient.invalidateQueries({ queryKey: ['brand', variables.brandId] });
      queryClient.invalidateQueries({ queryKey: ['brands'] });
      
      toast({
        title: 'Success',
        description: 'All messages updated successfully',
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