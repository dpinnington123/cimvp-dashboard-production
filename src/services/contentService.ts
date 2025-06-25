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
    .select(`
      *,
      brand_content (
        overall_score,
        strategic_score,
        customer_score,
        execution_score,
        quality_score
      )
    `)
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

// Update content status in brand_content table
export const updateContentStatus = async (
  contentId: string | number, 
  status: 'live' | 'draft' | 'planned' | 'active'
): Promise<{ success: boolean, error: Error | null }> => {
  console.log(`Updating status for content ${contentId} to ${status}`);
  
  // Map 'live' to 'active' for database compatibility
  const dbStatus = status === 'live' ? 'active' : status;
  
  try {
    const { data, error } = await supabase
      .from('brand_content')
      .update({ status: dbStatus, updated_at: new Date().toISOString() })
      .eq('id', contentId)
      .select();
    
    if (error) {
      console.error(`Error updating content status:`, error);
      return { success: false, error: new Error(`Failed to update status: ${error.message}`) };
    }
    
    if (!data || data.length === 0) {
      console.warn(`No content updated - content may not exist or permission denied`);
      return { success: false, error: new Error('Content not found or permission denied') };
    }
    
    console.log(`Successfully updated content status:`, data);
    return { success: true, error: null };
  } catch (error) {
    console.error(`Unexpected error updating content status:`, error);
    return { success: false, error: error as Error };
  }
};

// Comprehensive update for brand content
export const updateBrandContent = async (
  contentId: string | number,
  updates: {
    name?: string;
    format?: string;
    type?: string;
    status?: 'live' | 'draft' | 'planned' | 'active';
    description?: string;
    quality_score?: number;
    cost?: number;
    audience?: string;
    key_actions?: string[];
    agencies?: string[];
    overall_score?: number;
    strategic_score?: number;
    customer_score?: number;
    execution_score?: number;
  }
): Promise<{ data: unknown | null; error: Error | null }> => {
  console.log(`Updating brand content ${contentId} with:`, updates);
  
  try {
    // Map 'live' to 'active' for database compatibility if status is being updated
    const updateData = {
      ...updates,
      status: updates.status === 'live' ? 'active' : updates.status,
      updated_at: new Date().toISOString()
    };
    
    const { data, error } = await supabase
      .from('brand_content')
      .update(updateData)
      .eq('id', contentId)
      .select()
      .single();
    
    if (error) {
      console.error(`Error updating brand content:`, error);
      return { data: null, error: new Error(`Failed to update content: ${error.message}`) };
    }
    
    console.log(`Successfully updated brand content:`, data);
    return { data, error: null };
  } catch (error) {
    console.error(`Unexpected error updating brand content:`, error);
    return { data: null, error: error as Error };
  }
};

// Add other content-related functions as needed (e.g., create, update, delete)

// ID Lookup Functions for Content Upload
// These functions look up IDs from text values for proper foreign key relationships

/**
 * Look up brand ID by name
 */
export const getBrandIdByName = async (brandName: string): Promise<string | null> => {
  if (!brandName) return null;
  
  console.log('Looking up brand:', brandName);
  
  // First try exact match
  const { data, error } = await supabase
    .from('brands')
    .select('id')
    .eq('name', brandName)
    .single();
    
  if (!error && data) {
    console.log('Found brand with exact match:', data.id);
    return data.id;
  }
  
  // If exact match failed, try case-insensitive search
  console.log('Exact match failed, trying case-insensitive search');
  const { data: fuzzyData, error: fuzzyError } = await supabase
    .from('brands')
    .select('id')
    .ilike('name', `%${brandName}%`)
    .single();
    
  if (!fuzzyError && fuzzyData) {
    console.log('Found brand with case-insensitive match:', fuzzyData.id);
    return fuzzyData.id;
  }
  
  // Try common variations
  const variations = [
    brandName.replace(/-/g, ''), // Remove hyphens
    brandName.replace(/-/g, ' '), // Replace hyphens with spaces
    brandName.split('-').map(word => word.charAt(0).toUpperCase() + word.slice(1).toLowerCase()).join(''), // CamelCase
  ];
  
  console.log('Trying variations:', variations);
  
  for (const variation of variations) {
    const { data: varData, error: varError } = await supabase
      .from('brands')
      .select('id')
      .ilike('name', variation)
      .single();
      
    if (!varError && varData) {
      console.log(`Found brand with variation "${variation}":`, varData.id);
      return varData.id;
    }
  }
  
  console.error('Brand not found after trying all variations');
  return null;
};

/**
 * Look up campaign ID by name for a specific brand
 */
export const getCampaignIdByName = async (campaignName: string, brandId: string): Promise<string | null> => {
  if (!campaignName || !brandId) return null;
  
  const { data, error } = await supabase
    .from('brand_campaigns')
    .select('id')
    .eq('name', campaignName)
    .eq('brand_id', brandId)
    .single();
    
  if (error) {
    // Not found is not an error, just return null
    if (error.code === 'PGRST116') return null;
    console.error('Error looking up campaign ID:', error);
    return null;
  }
  
  return data?.id || null;
};

/**
 * Look up audience ID by name for a specific brand
 */
export const getAudienceIdByName = async (audienceName: string, brandId: string): Promise<string | null> => {
  if (!audienceName || !brandId) return null;
  
  const { data, error } = await supabase
    .from('brand_audiences')
    .select('id')
    .eq('name', audienceName)
    .eq('brand_id', brandId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error looking up audience ID:', error);
    return null;
  }
  
  return data?.id || null;
};

/**
 * Look up strategy ID by name for a specific brand
 */
export const getStrategyIdByName = async (strategyName: string, brandId: string): Promise<string | null> => {
  if (!strategyName || !brandId) return null;
  
  const { data, error } = await supabase
    .from('brand_strategies')
    .select('id')
    .eq('name', strategyName)
    .eq('brand_id', brandId)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error looking up strategy ID:', error);
    return null;
  }
  
  return data?.id || null;
};

/**
 * Look up agency ID by name (global lookup)
 */
export const getAgencyIdByName = async (agencyName: string): Promise<string | null> => {
  if (!agencyName) return null;
  
  const { data, error } = await supabase
    .from('agencies')
    .select('id')
    .eq('name', agencyName)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error looking up agency ID:', error);
    return null;
  }
  
  return data?.id || null;
};

/**
 * Look up content format ID by name (global lookup)
 */
export const getFormatIdByName = async (formatName: string): Promise<string | null> => {
  if (!formatName) return null;
  
  const { data, error } = await supabase
    .from('content_formats')
    .select('id')
    .eq('name', formatName)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error looking up format ID:', error);
    return null;
  }
  
  return data?.id || null;
};

/**
 * Look up content type ID by name (global lookup)
 */
export const getTypeIdByName = async (typeName: string): Promise<string | null> => {
  if (!typeName) return null;
  
  const { data, error } = await supabase
    .from('content_types')
    .select('id')
    .eq('name', typeName)
    .single();
    
  if (error) {
    if (error.code === 'PGRST116') return null;
    console.error('Error looking up type ID:', error);
    return null;
  }
  
  return data?.id || null;
}; 