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
 * @param fileUrls - Array of uploaded file URLs and information
 * @returns The newly created content record
 */
export const storeContentMetadata = async (
  metadata: ContentMetadata,
  files: { name: string; type: string; size: number; url: string }[]
): Promise<{ data: ProcessedContent | null, error: Error | null }> => {
  try {
    const contentId = uuidv4();
    
    // Get the current user
    const { data: { user } } = await supabase.auth.getUser();
    
    if (!user) {
      throw new Error('User must be authenticated to upload content');
    }
    
    // Prepare the data for the metadata JSONB column
    // Combine existing metadata with the uploaded file information
    const combinedMetadata = {
      ...metadata,
      uploadedFiles: files // Add the files array under 'uploadedFiles' key
    };
    
    const { data, error } = await supabase
      .from('content')
      .insert({
        id: contentId,
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
        metadata: combinedMetadata, // Store files inside metadata JSONB
        created_at: new Date().toISOString(),
        client_id: user.id // Add client_id to satisfy RLS policy
      })
      .select('*')
      .single();

    if (error) {
      throw error;
    }

    // Transform the data to match our ProcessedContent interface
    const processedContent: ProcessedContent = {
      id: data.id,
      metadata: {
        title: data.title,
        description: data.description,
        category: data.category,
        audience: data.audience,
        businessObjective: data.business_objective,
        contentFormat: data.content_format,
        tags: data.tags,
        publishDate: data.publish_date,
        expiryDate: data.expiry_date,
        location: data.location,
        campaign: data.campaign,
        agency: data.agency,
        cost: data.cost,
        contentType: data.content_type
      },
      // Read files from the nested structure in the metadata column
      files: data.metadata?.uploadedFiles || [],
      createdAt: data.created_at,
      status: 'processing' // Default status or read from data if available
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
    
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      throw error;
    }

    // Transform the data to match our ProcessedContent interface
    const processedContent: ProcessedContent[] = data.map(item => ({
      id: item.id,
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
      // Read files from metadata.uploadedFiles if available, otherwise empty array
      files: item.metadata?.uploadedFiles || [],
      createdAt: item.created_at,
      status: item.status || 'processing'
    }));

    return { data: processedContent, error: null };
  } catch (error) {
    console.error('Error retrieving processed content:', error);
    return { data: null, error: error as Error };
  }
}; 