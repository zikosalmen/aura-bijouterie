import { supabase } from './supabase';
import { Product } from '@/components/ProductCard';

// Import local data as fallback only (URLs already point to Supabase Storage)
import { products as localProducts } from './data';

export async function fetchProducts(): Promise<Product[]> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .order('dateAdded', { ascending: false });

    if (error) {
      console.warn('[fetchProducts] Supabase error, using local fallback:', error.message);
      return localProducts;
    }

    if (!data || data.length === 0) {
      console.warn('[fetchProducts] No data returned, using local fallback');
      return localProducts;
    }

    return data as Product[];
  } catch (err) {
    console.error('[fetchProducts] Unexpected error:', err);
    return localProducts;
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    const { data, error } = await supabase
      .from('products')
      .select('*')
      .eq('id', id)
      .single();

    if (error || !data) {
      console.warn(`[fetchProductById] Supabase error for id=${id}:`, error?.message);
      return localProducts.find(p => p.id === id);
    }

    return data as Product;
  } catch (err) {
    console.error('[fetchProductById] Unexpected error:', err);
    return localProducts.find(p => p.id === id);
  }
}
