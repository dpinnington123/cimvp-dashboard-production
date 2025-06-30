import { supabase } from '@/lib/supabaseClient';

/**
 * Safe update utility for relational tables that avoids DELETE-then-INSERT pattern
 * This utility prevents data loss by only modifying what has changed
 */

interface SafeUpdateItem {
  id?: string;
  [key: string]: any;
}

interface SafeUpdateOptions<T extends SafeUpdateItem> {
  tableName: string;
  brandId: string;
  items: T[];
  brandIdField?: string;  // defaults to 'brand_id'
  orderField?: string;    // defaults to 'order_index'
}

interface SafeUpdateResult {
  created: number;
  updated: number;
  deleted: number;
  errors: string[];
}

/**
 * Safely updates relational table data by comparing existing vs new items
 * and only performing necessary create/update/delete operations
 */
export async function safeUpdateRelationalData<T extends SafeUpdateItem>(
  options: SafeUpdateOptions<T>
): Promise<SafeUpdateResult> {
  const {
    tableName,
    brandId,
    items,
    brandIdField = 'brand_id',
    orderField = 'order_index'
  } = options;

  const result: SafeUpdateResult = {
    created: 0,
    updated: 0,
    deleted: 0,
    errors: []
  };

  try {
    // Step 1: Get existing items from database
    const { data: existingItems, error: fetchError } = await supabase
      .from(tableName)
      .select('*')
      .eq(brandIdField, brandId);

    if (fetchError) {
      throw new Error(`Failed to fetch existing ${tableName}: ${fetchError.message}`);
    }

    const existingItemsMap = new Map(
      (existingItems || []).map(item => [item.id, item])
    );

    // Step 2: Categorize items into create, update, and delete groups
    const itemsToCreate: T[] = [];
    const itemsToUpdate: T[] = [];
    const idsToKeep = new Set<string>();

    items.forEach((item, index) => {
      // Add order index if field exists
      if (orderField && orderField in item) {
        item[orderField] = index;
      }

      if (!item.id || item.id.length < 36) {
        // No ID or temporary ID - needs to be created
        itemsToCreate.push({
          ...item,
          [brandIdField]: brandId,
          id: undefined // Let database generate the ID
        });
      } else {
        // Has a valid ID - check if it needs updating
        idsToKeep.add(item.id);
        const existingItem = existingItemsMap.get(item.id);
        
        if (existingItem) {
          // Check if any fields have changed
          const hasChanges = Object.keys(item).some(key => {
            if (key === 'created_at' || key === 'updated_at') return false;
            return JSON.stringify(item[key]) !== JSON.stringify(existingItem[key]);
          });

          if (hasChanges) {
            itemsToUpdate.push(item);
          }
        }
      }
    });

    // Items to delete are those that exist but aren't in the new list
    const idsToDelete = Array.from(existingItemsMap.keys())
      .filter(id => !idsToKeep.has(id));

    // Step 3: Perform database operations

    // Create new items
    if (itemsToCreate.length > 0) {
      const { error: createError } = await supabase
        .from(tableName)
        .insert(itemsToCreate);

      if (createError) {
        result.errors.push(`Failed to create items: ${createError.message}`);
      } else {
        result.created = itemsToCreate.length;
      }
    }

    // Update existing items
    for (const item of itemsToUpdate) {
      const { error: updateError } = await supabase
        .from(tableName)
        .update(item)
        .eq('id', item.id);

      if (updateError) {
        result.errors.push(`Failed to update item ${item.id}: ${updateError.message}`);
      } else {
        result.updated++;
      }
    }

    // Delete removed items
    if (idsToDelete.length > 0) {
      const { error: deleteError } = await supabase
        .from(tableName)
        .delete()
        .in('id', idsToDelete);

      if (deleteError) {
        result.errors.push(`Failed to delete items: ${deleteError.message}`);
      } else {
        result.deleted = idsToDelete.length;
      }
    }

    // If there were any errors, throw to trigger rollback behavior
    if (result.errors.length > 0) {
      throw new Error(`Update completed with errors: ${result.errors.join(', ')}`);
    }

    return result;

  } catch (error) {
    console.error(`Error in safeUpdateRelationalData for ${tableName}:`, error);
    throw error;
  }
}

/**
 * Individual CRUD operations for single items
 */

export async function safeAddItem<T extends SafeUpdateItem>(
  tableName: string,
  brandId: string,
  item: T,
  brandIdField = 'brand_id'
): Promise<T> {
  const { data, error } = await supabase
    .from(tableName)
    .insert({
      ...item,
      [brandIdField]: brandId,
      id: undefined // Let database generate ID
    })
    .select()
    .single();

  if (error) {
    throw new Error(`Failed to add item to ${tableName}: ${error.message}`);
  }

  return data;
}

export async function safeUpdateItem<T extends SafeUpdateItem>(
  tableName: string,
  itemId: string,
  updates: Partial<T>
): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .update(updates)
    .eq('id', itemId);

  if (error) {
    throw new Error(`Failed to update item in ${tableName}: ${error.message}`);
  }
}

export async function safeDeleteItem(
  tableName: string,
  itemId: string
): Promise<void> {
  const { error } = await supabase
    .from(tableName)
    .delete()
    .eq('id', itemId);

  if (error) {
    throw new Error(`Failed to delete item from ${tableName}: ${error.message}`);
  }
}

export async function safeReorderItems(
  tableName: string,
  brandId: string,
  itemIds: string[],
  brandIdField = 'brand_id',
  orderField = 'order_index'
): Promise<void> {
  // Update order_index for all items
  const updates = itemIds.map((id, index) => 
    supabase
      .from(tableName)
      .update({ [orderField]: index })
      .eq('id', id)
      .eq(brandIdField, brandId)
  );

  const results = await Promise.all(updates);
  
  const errors = results.filter(r => r.error).map(r => r.error?.message);
  if (errors.length > 0) {
    throw new Error(`Failed to reorder items: ${errors.join(', ')}`);
  }
}