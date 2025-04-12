import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';

export interface ContentMetadata {
  title: string;
  description: string;
  category: string;
  audience: string;
  businessObjective: string;
  contentFormat: string;
  tags: string[];
  publishDate: string;
  expiryDate?: string;
  location?: string;
  campaign?: string;
  agency?: string;
  cost?: string;
  contentType?: string;
}

export interface ContentFile {
  file: File;
  id: string;
  preview?: string;
}

export interface ProcessedContent {
  id: string;
  metadata: ContentMetadata;
  files: {
    id: string;
    name: string;
    type: string;
    size: number;
    url: string;
  }[];
  createdAt: string;
  status: 'processing' | 'analyzed' | 'error';
}

/**
 * Uploads a file to Supabase storage
 * 
 * @param file - The file to upload
 * @param subpath - Optional subfolder within the client-content bucket (defaults to empty string)
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, subpath = ''): Promise<{ url: string, error: Error | null }> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to upload files');
    }

    // Log auth details for debugging
    console.log('Session found:', !!session, 'User ID:', session.user.id);
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Structure path to include user ID for RLS policies
    // Format: userId/fileName
    const filePath = `${session.user.id}/${fileName}`;
    
    console.log('Attempting to upload file to path:', filePath);

    const { data, error } = await supabase.storage
      .from('client-content')
      .upload(filePath, file, {
        cacheControl: '3600',
        upsert: false
      });

    if (error) {
      console.error('Detailed upload error:', JSON.stringify(error));
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from('client-content')
      .getPublicUrl(filePath);

    return { url: urlData.publicUrl, error: null };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { url: '', error: error as Error };
  }
};

/**
 * Stores content metadata in the database
 * 
 * @param metadata - Content metadata
 * @param files - Array of uploaded file information
 * @returns The newly created content record
 */
export const storeContentMetadata = async (
  metadata: ContentMetadata,
  files: { name: string; type: string; size: number; url: string }[]
): Promise<{ data: ProcessedContent | null, error: Error | null }> => {
  try {
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to upload content');
    }
    
    console.log('Inserting content with user ID:', user.id);
    
    // Create a metadata object that includes the files
    const metadataWithFiles = {
      ...metadata,
      files: files // Store files array inside the metadata JSONB column
    };
    
    // Create insert data structure matching the database schema
    // Omit ID and other auto-populated fields
    const insertData = {
      title: metadata.title,
      description: metadata.description,
      category: metadata.category,
      audience: metadata.audience,
      business_objective: metadata.businessObjective,
      content_format: metadata.contentFormat,
      tags: metadata.tags,
      publish_date: metadata.publishDate,
      expiry_date: metadata.expiryDate || null,
      location: metadata.location || null,
      campaign: metadata.campaign || null,
      agency: metadata.agency || null,
      cost: metadata.cost || null,
      content_type: metadata.contentType || null,
      metadata: metadataWithFiles, // Store files inside metadata JSONB column
      client_id: user.id, // Add client_id to satisfy RLS policy
      // Add other required fields
      format_type: metadata.contentFormat || null, // Assuming format_type matches contentFormat
      body: metadata.description || null, // Assuming body can be the same as description temporarily
      audience_type: metadata.audience || null // Assuming audience_type matches audience
    };
    
    console.log('Content data being inserted:', JSON.stringify(insertData, null, 2));
    
    const { data, error } = await supabase
      .from('content')
      .insert(insertData)
      .select()
      .single();

    if (error) {
      console.error('Database insertion error details:', JSON.stringify(error, null, 2));
      throw error;
    }

    // Transform the data to match our ProcessedContent interface
    const processedContent: ProcessedContent = {
      id: data.id.toString(), // Convert integer ID to string for consistency
      metadata: {
        title: data.title,
        description: data.description,
        category: data.category,
        audience: data.audience,
        businessObjective: data.business_objective,
        contentFormat: data.content_format,
        tags: data.tags || [],
        publishDate: data.publish_date,
        expiryDate: data.expiry_date,
        location: data.location,
        campaign: data.campaign,
        agency: data.agency,
        cost: data.cost,
        contentType: data.content_type
      },
      // Extract files from the metadata JSONB column
      files: data.metadata?.files || [],
      createdAt: data.created_at,
      status: data.status || 'processing'
    };

    return { data: processedContent, error: null };
  } catch (error) {
    console.error('Error storing content metadata:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Upload multiple files and store content metadata
 * 
 * @param files - Array of files to upload
 * @param metadata - Content metadata
 * @returns The processed content record
 */
export const uploadContent = async (
  files: ContentFile[],
  metadata: ContentMetadata
): Promise<{ data: ProcessedContent | null, error: Error | null }> => {
  try {
    // Upload all files
    const uploadPromises = files.map(({ file }) => uploadFile(file));
    const results = await Promise.all(uploadPromises);
    
    // Check for upload errors
    const errors = results.filter(result => result.error !== null);
    if (errors.length > 0) {
      throw new Error(`Failed to upload ${errors.length} files`);
    }
    
    // Prepare file information for storage
    const fileData = files.map(({ file }, index) => ({
      name: file.name,
      type: file.type,
      size: file.size,
      url: results[index].url
    }));
    
    // Store metadata and file references
    return await storeContentMetadata(metadata, fileData);
  } catch (error) {
    console.error('Error in uploadContent:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Retrieve a list of processed content items
 * 
 * @param limit - Maximum number of items to retrieve
 * @returns Array of processed content items
 */
export const getProcessedContent = async (
  limit = 10
): Promise<{ data: ProcessedContent[] | null, error: Error | null }> => {
  try {
    // Check if user is authenticated
    const { data: { session } } = await supabase.auth.getSession();
    
    if (!session) {
      throw new Error('User must be authenticated to retrieve content');
    }
    
    console.log('Fetching content for user ID:', session.user.id);
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching content:', JSON.stringify(error, null, 2));
      throw error;
    }

    console.log('Retrieved content items:', data.length);
    
    // Transform the data to match our ProcessedContent interface
    const processedContent: ProcessedContent[] = data.map(item => {
      // Extract files from metadata JSONB
      let fileArray = [];
      
      if (item.metadata && Array.isArray(item.metadata.files)) {
        fileArray = item.metadata.files;
      } else if (item.metadata && typeof item.metadata.files === 'object' && item.metadata.files !== null) {
        // Handle case where files might be a JSON object
        fileArray = Object.values(item.metadata.files);
      }
      
      return {
        id: item.id.toString(), // Convert to string for consistency
        metadata: {
          title: item.title,
          description: item.description,
          category: item.category,
          audience: item.audience,
          businessObjective: item.business_objective,
          contentFormat: item.content_format,
          tags: item.tags || [],
          publishDate: item.publish_date,
          expiryDate: item.expiry_date,
          location: item.location,
          campaign: item.campaign,
          agency: item.agency,
          cost: item.cost,
          contentType: item.content_type
        },
        files: fileArray,
        createdAt: item.created_at,
        status: item.status || 'processing'
      };
    });

    return { data: processedContent, error: null };
  } catch (error) {
    console.error('Error retrieving processed content:', error);
    return { data: null, error: error as Error };
  }
}; 