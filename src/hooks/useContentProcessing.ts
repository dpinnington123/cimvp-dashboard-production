import { useMutation, useQuery, useQueryClient } from '@tanstack/react-query';
import { 
  getContentAnalysisStatus,
  startContentAnalysis,
  getContentAnalysisResults,
  cancelContentAnalysis
} from '@/services/contentProcessingService';

// Define the result type of getContentAnalysisStatus for clarity
type AnalysisStatusResult = {
  status: string;
  progress?: number;
  error: Error | null;
};

/**
 * Hook for managing content processing and analysis
 */
export const useContentProcessing = () => {
  const queryClient = useQueryClient();

  // Query for getting analysis status
  const useAnalysisStatusQuery = (contentId: string, enabled = true) => {
    return useQuery({
      queryKey: ['analysisStatus', contentId],
      queryFn: () => getContentAnalysisStatus(contentId),
      enabled: !!contentId && enabled,
      refetchInterval: (query) => {
        // Refetch more frequently while processing, stop when complete
        const data = query.state.data;
        if (!data) return 5000;
        if (data.status === 'processing') return 2000;
        if (
          data.status === 'analyzed' || 
          data.status === 'error' || 
          data.status === 'cancelled'
        ) return false;
        return 5000;
      },
    });
  };

  // Query for getting analysis results
  const useAnalysisResultsQuery = (contentId: string, enabled = true) => {
    return useQuery({
      queryKey: ['analysisResults', contentId],
      queryFn: () => getContentAnalysisResults(contentId),
      enabled: !!contentId && enabled,
    });
  };

  // Mutation for starting content analysis
  const useStartAnalysisMutation = () => {
    return useMutation({
      mutationFn: (contentId: string) => startContentAnalysis(contentId),
      onSuccess: (_, contentId) => {
        // Invalidate relevant queries to trigger refetching
        queryClient.invalidateQueries({ queryKey: ['analysisStatus', contentId] });
      },
    });
  };

  // Mutation for cancelling content analysis
  const useCancelAnalysisMutation = () => {
    return useMutation({
      mutationFn: (contentId: string) => cancelContentAnalysis(contentId),
      onSuccess: (_, contentId) => {
        // Invalidate relevant queries to trigger refetching
        queryClient.invalidateQueries({ queryKey: ['analysisStatus', contentId] });
      },
    });
  };

  return {
    useAnalysisStatusQuery,
    useAnalysisResultsQuery,
    useStartAnalysisMutation,
    useCancelAnalysisMutation,
  };
};

export default useContentProcessing; 