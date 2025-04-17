import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase'; // Import the main Database type

// Define type aliases using the generated Database type
type Score = Database['public']['Tables']['scores']['Row'];
type ContentReview = Database['public']['Tables']['content_reviews']['Row']; // Added type for content_reviews

/**
 * Fetches scores for a specific content item by joining through content_reviews table
 * Based on the schema: scores -> content_reviews -> content
 */
export const getScoresByContentId = async (contentId: number): Promise<Score[]> => {
  console.log(`Fetching scores for content id: ${contentId} via content_reviews...`);

  // Join scores with content_reviews and filter by content_id
  const { data, error } = await supabase
    .from('content_reviews')
    .select('id, content_id, scores(*)')
    .eq('content_id', contentId);

  if (error) {
    console.error(`Error fetching scores for content ${contentId}:`, error);
    throw error;
  }

  console.log('📦 Raw data from Supabase for content_reviews:', JSON.stringify(data, null, 2));

  // Process the nested data structure to extract scores
  const allScores: Score[] = [];
  
  // Each item in data is a content_review that may have multiple scores
  if (data) {
    data.forEach(review => {
      if (review.scores && Array.isArray(review.scores)) {
        // Add scores from this review to our collection
        allScores.push(...review.scores);
      } else {
        console.warn(`Review ID ${review.id} for content ${contentId} did NOT contain a 'scores' array.`);
      }
    });
  }

  console.log(`Found ${allScores.length} scores for content id: ${contentId}.`);
  return allScores;
};

/**
 * Fetches scores for a specific content review
 */
export const getScoresByContentReviewId = async (contentReviewId: number): Promise<Score[]> => {
  console.log(`Fetching scores for content review id: ${contentReviewId}...`);

  const { data, error } = await supabase
    .from('scores')
    .select('*')
    .eq('content_review_id', contentReviewId);

  if (error) {
    console.error(`Error fetching scores for content review ${contentReviewId}:`, error);
    throw error;
  }

  return data || [];
};

/**
 * Gets content reviews for a specific content item
 */
export const getContentReviewsByContentId = async (contentId: number): Promise<ContentReview[]> => {
  console.log(`Fetching content reviews for content id: ${contentId}...`);

  const { data, error } = await supabase
    .from('content_reviews')
    .select('*')
    .eq('content_id', contentId);

  if (error) {
    console.error(`Error fetching content reviews for content ${contentId}:`, error);
    throw error;
  }

  return data || [];
};

// Additional helper functions can be added as needed 