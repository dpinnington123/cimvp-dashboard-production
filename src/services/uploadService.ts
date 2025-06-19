import { supabase } from '@/lib/supabaseClient';
import { v4 as uuidv4 } from 'uuid';
import { 
  getCampaignIdByName, 
  getAudienceIdByName, 
  getStrategyIdByName,
  getAgencyIdByName,
  getFormatIdByName,
  getTypeIdByName 
} from '@/services/contentService';

export interface ContentMetadata {
  title: string;
  jobId: string;
  brandId: string; // REQUIRED - Brand this content belongs to
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
    bucket_id?: string;
    storage_path?: string;
  }[];
  createdAt: string;
  status: 'draft' | 'live';
}

/**
 * Uploads a file to Supabase storage
 * 
 * @param file - The file to upload
 * @param subpath - Optional subfolder within the client-content bucket (defaults to empty string)
 * @returns The URL of the uploaded file
 */
export const uploadFile = async (file: File, subpath = ''): Promise<{ url: string, bucket_id: string, storage_path: string, error: Error | null }> => {
  try {
    // Check if user is authenticated with more detailed logging
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session retrieval error:', sessionError);
      throw sessionError;
    }
    
    if (!session) {
      console.error('No active session found for file upload');
      throw new Error('User must be authenticated to upload files');
    }

    // Log auth details for debugging
    console.log('Session found for file upload:', {
      userId: session.user.id,
      hasAccessToken: !!session.access_token,
      expiresAt: session.expires_at
    });
    
    const fileExt = file.name.split('.').pop();
    const fileName = `${uuidv4()}.${fileExt}`;
    
    // Structure path to include user ID for RLS policies
    // Format: userId/fileName
    const filePath = `${session.user.id}/${fileName}`;
    
    console.log('Attempting to upload file to path:', filePath);

    // Set custom headers to pass auth context if needed
    const uploadOptions = {
      cacheControl: '3600',
      upsert: false
    };

    // Define the bucket name
    const bucketName = 'client-content';

    const { data, error } = await supabase.storage
      .from(bucketName)
      .upload(filePath, file, uploadOptions);

    if (error) {
      console.error('Detailed upload error:', JSON.stringify(error, null, 2));
      
      // Provide more specific error information
      if (error.message.includes('permission') || error.message.includes('authorized')) {
        console.error('Storage permission error. This could be due to:');
        console.error('1. Incorrect storage bucket RLS policies');
        console.error('2. User not having permission to this bucket');
        console.error('3. Misconfigured storage permissions');
      }
      
      throw error;
    }

    const { data: urlData } = supabase.storage
      .from(bucketName)
      .getPublicUrl(filePath);

    console.log('File uploaded successfully:', urlData.publicUrl);
    return { 
      url: urlData.publicUrl, 
      bucket_id: bucketName, 
      storage_path: filePath, 
      error: null 
    };
  } catch (error) {
    console.error('Error uploading file:', error);
    return { 
      url: '', 
      bucket_id: '', 
      storage_path: '', 
      error: error as Error 
    };
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
  files: { name: string; type: string; size: number; url: string; bucket_id?: string; storage_path?: string; }[]
): Promise<{ data: ProcessedContent | null, error: Error | null }> => {
  try {
    // Get the current user with more detailed logging
    const authResponse = await supabase.auth.getUser();
    console.log('Auth response structure:', JSON.stringify(Object.keys(authResponse), null, 2));
    console.log('Auth data structure:', JSON.stringify(Object.keys(authResponse.data || {}), null, 2));
    
    const { data: { user } } = authResponse;
    
    if (!user) {
      console.error('No authenticated user found!');
      throw new Error('User must be authenticated to upload content');
    }
    
    // Log more details about the user to diagnose RLS issues
    console.log('Authenticated user details:', {
      id: user.id,
      email: user.email,
      role: user.role,
      app_metadata: user.app_metadata,
      aud: user.aud
    });
    
    // Get session to verify active session exists
    const { data: { session } } = await supabase.auth.getSession();
    if (!session) {
      console.error('No active session found!');
      throw new Error('Active session required for database operations');
    }
    
    console.log('Active session found with ID:', session.access_token ? 'Token exists' : 'No token');
    
    // CRITICAL: For RLS policy to work, client_id must EXACTLY match auth.uid()
    // Ensure we're using the UUID in the correct format for client_id
    const userId = user.id;
    console.log('Using user ID for client_id:', userId);
    
    // Use bucket information from the first file (if available)
    const firstFile = files.length > 0 ? files[0] : null;
    const bucketId = firstFile?.bucket_id || null;
    const filePath = firstFile?.storage_path || null;
    
    console.log('Creating insert data with content_name:', metadata.title || 'Untitled Content');
    console.log('Using bucket_id:', bucketId);
    console.log('Using file_storage_path:', filePath);
    
    // First, let's try to directly access the table (this should fail if it's a pure RLS issue)
    const testResult = await supabase
      .from('content')
      .select('count')
      .limit(1);
    
    console.log('Test table access result:', testResult);
    
    // Helper function to check if a string is a UUID
    const isUUID = (str: string) => /^[0-9a-f]{8}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{4}-[0-9a-f]{12}$/i.test(str);
    
    // Look up IDs for foreign key fields
    // If the value is already a UUID, use it directly. Otherwise, look it up.
    let campaign_id: string | null = null;
    let audience_id: string | null = null;
    let strategy_id: string | null = null;
    let agency_id: string | null = null;
    let format_id: string | null = null;
    let type_id: string | null = null;
    
    // Campaign ID lookup
    if (metadata.campaign) {
      campaign_id = isUUID(metadata.campaign) ? metadata.campaign : await getCampaignIdByName(metadata.campaign, metadata.brandId);
    }
    
    // Audience ID lookup
    if (metadata.audience) {
      audience_id = isUUID(metadata.audience) ? metadata.audience : await getAudienceIdByName(metadata.audience, metadata.brandId);
    }
    
    // Strategy ID lookup (using businessObjective field)
    if (metadata.businessObjective) {
      strategy_id = isUUID(metadata.businessObjective) ? metadata.businessObjective : await getStrategyIdByName(metadata.businessObjective, metadata.brandId);
    }
    
    // Agency ID lookup (global)
    if (metadata.agency) {
      agency_id = await getAgencyIdByName(metadata.agency);
    }
    
    // Format ID lookup (global)
    if (metadata.contentFormat) {
      format_id = await getFormatIdByName(metadata.contentFormat);
    }
    
    // Type ID lookup (global)
    if (metadata.contentType) {
      type_id = await getTypeIdByName(metadata.contentType);
    }
    
    // Create insert data structure matching ONLY the actual database schema fields
    const insertData = {
      // Required fields
      content_name: metadata.title || 'Untitled Content', // REQUIRED FIELD
      job_id: metadata.jobId, // REQUIRED - User-provided job identifier
      brand_id: metadata.brandId, // REQUIRED - Brand this content belongs to
      
      // Optional text fields (keep for backward compatibility)
      agency: metadata.agency || null,
      audience: metadata.audience || null,
      bucket_id: bucketId,
      campaign_aligned_to: metadata.campaign || null,
      client_id: userId, // Must match auth.uid()
      content_objectives: metadata.businessObjective || null,
      expiry_date: metadata.expiryDate || null,
      file_storage_path: filePath,
      format: metadata.contentFormat || null,
      funnel_alignment: metadata.campaign || null,
      strategy_aligned_to: metadata.businessObjective || null,
      status: 'draft',
      processing_status: 'pending', // Initial processing status
      type: metadata.contentType || null,
      
      // Foreign key fields (populated from lookups)
      campaign_id,
      audience_id,
      strategy_id,
      agency_id,
      format_id,
      type_id
    };
    
    console.log('Content data being inserted:', JSON.stringify(insertData, null, 2));
    
    // Use insert to prevent accidental overwrites - frontend handles duplicate checking
    const { data, error } = await supabase
      .from('content')
      .insert(insertData)
      .select('*')
      .single();

    if (error) {
      console.error('Database insertion error details:', JSON.stringify(error, null, 2));
      
      if (error.code === '42501') {
        console.error('RLS policy violation. This typically means:');
        console.error('1. The client_id might not match the authenticated user ID');
        console.error('2. The RLS policy might have additional requirements');
        console.error('3. The user might not have the right role/permissions');
        
        console.error('Current auth.uid():', userId);
        console.error('Check if client_id and auth.uid() match EXACTLY (including format)');
        console.error('Check required fields: content_name must not be null');
        
        // RLS policies are correctly configured - this error indicates a legitimate access control issue
        // The client_id field should match auth.uid() exactly
      }
      
      throw error;
    }

    // If we get here, we have successful data
    console.log('Content record created successfully:', data?.id);
    
    // Create brand_content record to link content to brand and campaign
    if (data?.id && metadata.brandId) {
      try {
        const brandContentData = {
          brand_id: metadata.brandId,
          campaign_id: campaign_id, // Use the looked-up campaign ID
          content_id: data.id, // The ID of the content we just created
          name: metadata.title || 'Untitled Content',
          format: metadata.contentFormat || null,
          type: metadata.contentType || null,
          status: 'draft',
          description: metadata.description || null,
          audience: metadata.audience || null,
          agencies: metadata.agency ? [metadata.agency] : [],
          // Scores will be populated later by the scoring pipeline
          overall_score: null,
          strategic_score: null,
          customer_score: null,
          execution_score: null
        };
        
        console.log('Creating brand_content record:', brandContentData);
        
        const { data: brandContent, error: brandContentError } = await supabase
          .from('brand_content')
          .insert(brandContentData)
          .select('*')
          .single();
          
        if (brandContentError) {
          console.error('Error creating brand_content record:', brandContentError);
          // Don't fail the upload if brand_content creation fails
          // The content is already uploaded successfully
        } else {
          console.log('Brand_content record created successfully:', brandContent?.id);
        }
      } catch (error) {
        console.error('Exception creating brand_content record:', error);
        // Don't fail the upload if brand_content creation fails
      }
    }
    
    return processContentData(data, files);
  } catch (error) {
    console.error('Error storing content metadata:', error);
    return { data: null, error: error as Error };
  }
};

/**
 * Helper function to process database content into ProcessedContent format
 */
function processContentData(
  data: any, 
  files: { name: string; type: string; size: number; url: string; bucket_id?: string; storage_path?: string; }[]
): { data: ProcessedContent | null, error: Error | null } {
  // Transform the data to match our ProcessedContent interface
  const processedContent: ProcessedContent = {
    id: data?.id?.toString() || '0', // Convert integer ID to string for consistency
    metadata: {
      title: data?.content_name || "",
      jobId: data?.job_id || "", // Add job_id to metadata
      brandId: data?.brand_id || "", // REQUIRED - Add brand_id from database
      description: "", // Not in DB schema
      category: "", // Not in DB schema
      audience: data?.audience || "",
      businessObjective: data?.content_objectives || "",
      contentFormat: data?.format || "",
      tags: [], // Not in DB schema
      publishDate: "", // Not in DB schema
      expiryDate: data?.expiry_date || undefined,
      location: undefined, // Not in DB schema
      campaign: data?.campaign_aligned_to || undefined,
      agency: data?.agency || undefined,
      cost: undefined, // Not in DB schema
      contentType: data?.type || undefined
    },
    // Add id property to each file to match the expected interface
    files: files.map((file) => ({
      id: uuidv4(),
      name: file.name,
      type: file.type,
      size: file.size,
      url: file.url,
      bucket_id: file.bucket_id || data?.bucket_id,
      storage_path: file.storage_path || data?.file_storage_path
    })),
    createdAt: data?.created_at || new Date().toISOString(),
    status: data?.status || 'draft'
  };

  return { data: processedContent, error: null };
}

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
      url: results[index].url,
      bucket_id: results[index].bucket_id,
      storage_path: results[index].storage_path
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
    // Check if user is authenticated with detailed logging
    const { data: { session }, error: sessionError } = await supabase.auth.getSession();
    
    if (sessionError) {
      console.error('Session retrieval error in getProcessedContent:', sessionError);
      throw sessionError;
    }
    
    if (!session) {
      console.error('No active session found in getProcessedContent');
      throw new Error('User must be authenticated to retrieve content');
    }
    
    // CRITICAL: For RLS policy to work, client_id must EXACTLY match auth.uid()
    const userId = session.user.id;
    console.log('Fetching content for user ID:', userId);
    
    // Try a simple count query first to check permissions
    try {
      const testCountResult = await supabase
        .from('content')
        .select('count')
        .eq('client_id', userId);
        
      console.log('Test count query result:', testCountResult);
      
      if (testCountResult.error) {
        console.error('Cannot run count query, possible RLS issue:', testCountResult.error);
      }
    } catch (testError) {
      console.error('Test count query failed:', testError);
    }
    
    // Now try the actual content query
    const { data, error } = await supabase
      .from('content')
      .select('*')
      .eq('client_id', userId) // Apply RLS filter explicitly
      .order('created_at', { ascending: false })
      .limit(limit);

    if (error) {
      console.error('Error fetching content:', JSON.stringify(error, null, 2));
      
      // Provide context for RLS errors
      if (error.code === '42501') {
        console.error('RLS policy violation in getProcessedContent. This typically means:');
        console.error('1. The RLS policy might have additional requirements beyond client_id');
        console.error('2. The user might not have the right role/permissions');
        console.error('Current auth.uid():', userId);
      }
      
      throw error;
    }

    console.log('Retrieved content items:', data.length);
    console.log('First item sample (if any):', data.length > 0 ? JSON.stringify(data[0], null, 2) : 'No items');
    
    // Transform the data to match our ProcessedContent interface
    const processedContent: ProcessedContent[] = data.map(item => {
      return {
        id: item.id.toString(),
        metadata: {
          title: item.content_name || "",
          jobId: item.job_id || "", // Add job_id to metadata
          brandId: item.brand_id || "", // REQUIRED - Add brand_id from database
          description: "", // Not in DB schema
          category: "", // Not in DB schema
          audience: item.audience || "",
          businessObjective: item.content_objectives || "",
          contentFormat: item.format || "",
          tags: [], // Not in DB schema
          publishDate: "", // Not in DB schema
          expiryDate: item.expiry_date || undefined,
          location: undefined, // Not in DB schema
          campaign: item.campaign_aligned_to || undefined,
          agency: item.agency || undefined,
          cost: undefined, // Not in DB schema
          contentType: item.type || undefined
        },
        // In a production app, you would fetch files from storage based on content ID
        files: item.file_storage_path ? [
          {
            id: uuidv4(),
            name: item.file_storage_path.split('/').pop() || 'file',
            type: '', // Not known without fetching
            size: 0, // Not known without fetching
            url: item.file_storage_path ? supabase.storage.from(item.bucket_id || 'client-content').getPublicUrl(item.file_storage_path).data.publicUrl : '',
            bucket_id: item.bucket_id || 'client-content',
            storage_path: item.file_storage_path
          }
        ] : [], 
        createdAt: item.created_at || new Date().toISOString(),
        status: item.status === 'live' ? 'live' : 'draft'
      };
    });

    return { data: processedContent, error: null };
  } catch (error) {
    console.error('Error retrieving processed content:', error);
    return { data: null, error: error as Error };
  }
}; 