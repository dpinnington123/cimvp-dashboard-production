import { useQuery } from '@tanstack/react-query';
import { getCheckDetails } from '../services/scoreService';

// Unique query key pattern for check details
const checkDetailsQueryKey = (checkId: number) => ['check', 'details', checkId];

/**
 * Custom hook to fetch check details including what_it_measures for a specific check_id
 * 
 * @param checkId The ID of the check to fetch
 * @param options Optional query options
 * @returns Query result with check details
 */
export const useCheckDetails = (checkId: number | null, options?: { enabled?: boolean }) => {
  return useQuery({
    queryKey: checkDetailsQueryKey(checkId!),
    queryFn: () => getCheckDetails(checkId!),
    enabled: typeof checkId === 'number' && checkId > 0 && (options?.enabled ?? true),
    // Add stale time to avoid refetching too often
    staleTime: 5 * 60 * 1000, // 5 minutes
  });
}; 