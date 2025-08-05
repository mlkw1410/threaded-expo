// The final, correct code for types/database.ts

export interface User {
  id: string;
  email: string;
  full_name: string;
  created_at: string;
  updated_at: string;
}

export interface Garment {
  id: string;
  user_id: string;
  name: string;
  category: string;
  color: string; // Using your schema's spelling
  brand?: string;
  image_url: string | null; // Allowing null for safety
  notes?: string;
  created_at: string;
}

export interface Outfit {
  id: string;
  user_id: string;
  name: string;
  description?: string;
  image_url?: string;
  garment_ids: string[];
  created_at: string;
}

// --- THIS IS THE NEW, REQUIRED TYPE ---
export interface OutfitWithGarments extends Omit<Outfit, 'garment_ids'> {
  garments: Garment[];
}
// ------------------------------------

export interface DatabaseResponse<T> {
  success: boolean;
  data?: T;
  error?: any;
}