"use client";

import { useState, useMemo, useCallback, useEffect } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Filters from "@/components/Filters";
import ProductCard, { Product } from "@/components/ProductCard";
import { fetchProducts } from "@/lib/products";

function ProductSkeleton() {
  return (
    <div className="bg-background border border-gold/10 rounded-2xl overflow-hidden animate-pulse">
      <div className="aspect-square bg-foreground/10" />
      <div className="p-4 space-y-3">
        <div className="h-6 bg-foreground/10 rounded-lg w-1/2" />
        <div className="h-4 bg-foreground/10 rounded w-3/4" />
        <div className="h-4 bg-foreground/10 rounded w-2/3" />
        <div className="flex justify-between items-center pt-2">
          <div className="h-8 bg-gold/20 rounded-lg w-1/3" />
          <div className="h-10 w-10 bg-foreground/10 rounded-xl" />
        </div>
      </div>
    </div>
  );
}

export default function ProductsPage() {
  const t = useTranslations('Products');
  const [initialProducts, setInitialProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [filters, setFilters] = useState({
    category: "all",
    subCategory: "all"
  });

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setInitialProducts(data);
      setLoading(false);
    }
    load();
  }, []);

  const handleFilterChange = useCallback((newFilters: { category: string; subCategory: string }) => {
    setFilters(newFilters);
  }, []);

  const filteredProducts = useMemo(() => {
    if (!initialProducts || initialProducts.length === 0) return [];
    
    let result = [...initialProducts];

    if (filters.category !== "all") {
      result = result.filter(p => p.category === filters.category);
    }
    if (filters.subCategory !== "all") {
      result = result.filter(p => p.subCategory === filters.subCategory);
    }

    result.sort((a, b) => new Date(b.dateAdded || 0).getTime() - new Date(a.dateAdded || 0).getTime());

    return result;
  }, [filters, initialProducts]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <Filters onFilterChange={handleFilterChange} />

      {loading ? (
        <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6">
          {Array.from({ length: 8 }).map((_, i) => <ProductSkeleton key={i} />)}
        </div>
      ) : filteredProducts.length > 0 ? (
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-3 sm:gap-6"
        >
          {filteredProducts.map((product, idx) => (
            <ProductCard key={product.id} product={product} priority={idx < 4} />
          ))}
        </motion.div>
      ) : (
        <div className="py-20 text-center text-foreground/50">
          <p className="text-xl">{t('noItems')}</p>
        </div>
      )}
    </div>
  );
}
