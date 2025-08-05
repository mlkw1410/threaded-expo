import { supabase } from './supabase'
import { User, Garment, Outfit,  OutfitWithGarments, DatabaseResponse } from '../types/database'

// ===== USER FUNCTIONS =====
export const createUser = async (email: string, fullName: string): Promise<DatabaseResponse<User[]>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .insert([
        { email, full_name: fullName }
      ])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Create user error:', error)
    return { success: false, error }
  }
}

export const getUsers = async (): Promise<DatabaseResponse<User[]>> => {
  try {
    const { data, error } = await supabase
      .from('users')
      .select('*')
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Get users error:', error)
    return { success: false, error }
  }
}

// ===== GARMENT FUNCTIONS =====
export const createGarment = async (
  userId: string, 
  name: string, 
  category: string, 
  color: string, 
  brand?: string, 
  imageUrl?: string, 
  notes?: string
): Promise<DatabaseResponse<Garment[]>> => {
  try {
    const { data, error } = await supabase
      .from('garments')
      .insert([
        {
          user_id: userId,
          name,
          category,
          color,
          brand,
          image_url: imageUrl,
          notes
        }
      ])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Create garment error:', error)
    return { success: false, error }
  }
}

export const getGarments = async (userId: string): Promise<DatabaseResponse<Garment[]>> => {
  try {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Get garments error:', error)
    return { success: false, error }
  }
}

export const getAllGarments = async (): Promise<DatabaseResponse<Garment[]>> => {
  try {
    const { data, error } = await supabase
      .from('garments')
      .select('*')
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Get all garments error:', error)
    return { success: false, error }
  }
}

// ===== OUTFIT FUNCTIONS =====
export const createOutfit = async (
  userId: string, 
  name: string, 
  description?: string, 
  imageUrl?: string, 
  garmentIds?: string[]
): Promise<DatabaseResponse<Outfit[]>> => {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .insert([
        {
          user_id: userId,
          name,
          description,
          image_url: imageUrl,
          garment_ids: garmentIds || []
        }
      ])
      .select()
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Create outfit error:', error)
    return { success: false, error }
  }
}

export const getOutfits = async (userId: string): Promise<DatabaseResponse<Outfit[]>> => {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
      .eq('user_id', userId)
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Get outfits error:', error)
    return { success: false, error }
  }
}

export const getAllOutfits = async (): Promise<DatabaseResponse<Outfit[]>> => {
  try {
    const { data, error } = await supabase
      .from('outfits')
      .select('*')
    
    if (error) throw error
    return { success: true, data }
  } catch (error) {
    console.error('Get all outfits error:', error)
    return { success: false, error }
  }
}

// ===== TEST CONNECTION =====
export const testConnection = async (): Promise<boolean> => {
  try {
    const { data, error } = await supabase.from('users').select('count', { count: 'exact' })
    if (error) {
      console.error('Connection error:', error)
      return false
    }
    console.log('✅ Connected to Supabase! User count:', data)
    return true
  } catch (err) {
    console.error('Connection failed:', err)
    return false
  }
}

// ===== NEW OUTFIT FUNCTION FOR UI =====
export const getOutfitsWithGarments = async (userId: string): Promise<DatabaseResponse<OutfitWithGarments[]>> => {
  try {
    // Step 1: Fetch the user's basic outfits
    const outfitsResponse = await getOutfits(userId);
    if (!outfitsResponse.success || !outfitsResponse.data) {
      throw outfitsResponse.error || new Error("Failed to fetch outfits.");
    }

    const outfits = outfitsResponse.data;
    if (outfits.length === 0) {
      return { success: true, data: [] }; // No outfits, return empty array
    }

    // Step 2: Collect all unique garment IDs from all outfits
    const allGarmentIds = [...new Set(outfits.flatMap(o => o.garment_ids))];

    if (allGarmentIds.length === 0) {
      // Outfits exist but have no garments linked, return them with empty garment arrays
      const data = outfits.map(o => ({ ...o, garments: [] }));
      return { success: true, data };
    }

    // Step 3: Fetch all required garments in a single query
    const { data: garmentsData, error: garmentsError } = await supabase
      .from('garments')
      .select('*')
      .in('id', allGarmentIds);
    
    if (garmentsError) throw garmentsError;

    // Step 4: Map garments back to their outfits for easy lookup
    const garmentsMap = new Map(garmentsData.map(g => [g.id, g]));
    
    const data: OutfitWithGarments[] = outfits.map(outfit => ({
      ...outfit,
      garments: outfit.garment_ids
        .map(id => garmentsMap.get(id))
        .filter((g): g is Garment => g !== undefined),
    }));

    return { success: true, data };

  } catch (error) {
    console.error('Get outfits with garments error:', error);
    return { success: false, error };
  }
};