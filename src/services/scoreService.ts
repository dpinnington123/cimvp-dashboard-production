import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase'; // Import the main Database type

// Define type aliases using the generated Database type
type Score = Database['public']['Tables']['scores']['Row'];
// Removed Recommendation type as it seems recommendations are part of the Score object
// type Recommendation = Database['public']['Tables']['recommendations']['Row'];

// Fetch scores (which include recommendations) for a specific content item
export const getScoresByContentId = async (contentId: number): Promise<Score[]> => { // Assuming content_id is number
    console.log(`Fetching scores for content id: ${contentId}...`);
  // TODO: Add more robust error handling and refine query as needed
  const { data, error } = await supabase
    .from('scores') // Use actual table name
    .select('*')
    .eq('content_id', contentId); // Assuming foreign key column is named 'content_id'

  if (error) {
    console.error(`Error fetching scores for content ${contentId}:`, error);
    throw error; // Re-throwing error; consider more specific handling
  }
  return data || [];

};

// Removed getRecommendationsByContentId function as recommendations are included in getScoresByContentId
/*
export const getRecommendationsByContentId = async (contentId: number): Promise<Recommendation[]> => { // Assuming content_id is number
    console.log(`Fetching recommendations for content id: ${contentId}...`);
  // TODO: Check table name 'recommendations'. Add error handling.
  const { data, error } = await supabase
    .from('recommendations') // <-- CHECK THIS TABLE NAME
    .select('*')
    .eq('content_id', contentId); // Assuming foreign key column is named 'content_id'

  if (error) {
    console.error(`Error fetching recommendations for content ${contentId}:`, error);
    // If the table doesn't exist, this will error.
    // Handle appropriately, e.g., return empty array or throw.
    throw error; // For now, re-throw
  }
  return data || [];

};
*/

// Add other score-related functions as needed (e.g., maybe fetching scores by check_id?) 