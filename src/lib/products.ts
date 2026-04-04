import { supabase } from './supabase';
import { Product } from '@/components/ProductCard';

// Import local data as fallback only (URLs already point to Supabase Storage)
import { products as localProducts } from './data';

// In-memory cache for the client session to avoid hitting Supabase on every navigation
let productsCache: Product[] | null = null;
let lastFetchTime = 0;
const CACHE_TTL = 1000 * 60 * 5; // 5 minutes

export async function fetchProducts(): Promise<Product[]> {
  try {
    const now = Date.now();
    if (productsCache && (now - lastFetchTime < CACHE_TTL)) {
      return productsCache;
    }

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

    productsCache = data as Product[];
    lastFetchTime = now;
    return productsCache;
  } catch (err) {
    console.error('[fetchProducts] Unexpected error:', err);
    return localProducts;
  }
}

export async function fetchProductById(id: string): Promise<Product | undefined> {
  try {
    // Si nous avons déjà le cache complet, chercher dedans
    if (productsCache && (Date.now() - lastFetchTime < CACHE_TTL)) {
      const cachedProduct = productsCache.find((p) => p.id === id);
      if (cachedProduct) return cachedProduct;
    }

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
