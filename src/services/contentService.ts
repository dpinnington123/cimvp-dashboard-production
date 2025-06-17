import { supabase } from '../lib/supabaseClient';
import { Database } from '../types/supabase'; // Import the main Database type

// Define a type alias for the content table row using the Tables helper
type Content = Database['public']['Tables']['content']['Row'];

// Fetch all content items (potentially filtered later)
export const getContent = async (): Promise<Content[]> => {
  console.log('Fetching content from Supabase...'); // Placeholder log
  // TODO: Implement actual Supabase query
  const { data, error } = await supabase
    .from('content') // Use the actual table name
    .select('*');

  if (error) {
    console.error('Error fetching content:', error);
    throw error;
  }
  return data || [];

  // Returning empty array for now - REMOVED as query is added
  // return [];
};

// Fetch a single content item by ID
export const getContentById = async (id: number): Promise<Content | null> => { // Assuming ID is number based on schema
    console.log(`Fetching content item with id: ${id}...`); // Placeholder log
  // TODO: Implement actual Supabase query
  const { data, error } = await supabase
    .from('content') // Use the actual table name
    .select('*')
    .eq('id', id)      // Use the actual column name
    .single(); // Use .single() if expecting one result

  if (error) {
    console.error(`Error fetching content with id ${id}:`, error);
    // Decide how to handle error, e.g., return null or throw
    // For now, just logging and returning null
    return null;
  }
  return data;

  // Returning null for now - REMOVED as query is added
  // return null;
};

// Delete a content item by ID
export const deleteContentById = async (id: number): Promise<{ success: boolean, error: Error | null }> => {
  console.log(`Starting delete process for content with ID: ${id}...`);
  
  try {
    // First, check if the content exists and you have permission
    const { data: contentCheck, error: checkError } = await supabase
      .from('content')
      .select('id, content_name')
      .eq('id', id)
      .single();
    
    if (checkError) {
      console.error(`Error verifying content with id ${id}:`, checkError);
      return { success: false, error: new Error(`Failed to verify content: ${checkError.message}`) };
    }
    
    if (!contentCheck) {
      console.error(`Content with id ${id} does not exist or you don't have permission to access it`);
      return { success: false, error: new Error(`Content not found or permission denied`) };
    }
    
    console.log(`Content exists, proceeding with deletion: ${contentCheck.content_name}`);
    
    // Delete the content record - CASCADE constraint will automatically delete related content_reviews
    console.log(`Attempting to delete content with id ${id}...`);
    const { data: contentData, error } = await supabase
      .from('content')
      .delete()
      .eq('id', id)
      .select();
    
    if (error) {
      console.error(`Error deleting content with id ${id}:`, error);
      return { success: false, error: new Error(`Failed to delete content: ${error.message}`) };
    }
    
    if (!contentData || contentData.length === 0) {
      console.warn(`Delete operation sent successfully but no content was deleted for id ${id}. This may indicate the content doesn't exist or you don't have permission to delete it.`);
      return { success: false, error: new Error('Content not deleted - permission issue or already deleted') };
    }
    
    console.log(`Successfully deleted content with id ${id}:`, contentData);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Unexpected error deleting content with id ${id}:`, error);
    return { success: false, error: error as Error };
  }
};

// Add other content-related functions as needed (e.g., create, update, delete) 