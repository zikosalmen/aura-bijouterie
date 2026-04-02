"use client";

import { useState, useMemo, useCallback } from "react";
import { motion } from "framer-motion";
import { useTranslations } from "next-intl";
import Filters from "@/components/Filters";
import ProductCard from "@/components/ProductCard";
import { products as initialProducts } from "@/lib/data";

export default function ProductsPage() {
  const t = useTranslations('Products');
  const [filters, setFilters] = useState({
    category: "all",
    subCategory: "all"
  });

  const handleFilterChange = useCallback((newFilters: { category: string; subCategory: string }) => {
    setFilters(newFilters);
  }, []);

  const filteredProducts = useMemo(() => {
    let result = [...initialProducts];

    // Filter Category
    if (filters.category !== "all") {
      result = result.filter(p => p.category === filters.category);
    }
    // Filter SubCategory
    if (filters.subCategory !== "all") {
      result = result.filter(p => p.subCategory === filters.subCategory);
    }

    // Default Sorting (newest first)
    result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());

    return result;
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">


      <Filters onFilterChange={handleFilterChange} />

      {filteredProducts.length > 0 ? (
        <motion.div 
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.5 }}
          className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6"
        >
          {filteredProducts.map((product) => (
            <ProductCard key={product.id} product={product} />
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
