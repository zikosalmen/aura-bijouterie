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
    subCategory: "all",
    priceMax: 20000,
    sortBy: "newest"
  });

  const handleFilterChange = useCallback((newFilters: { category: string; subCategory: string; priceMax: number; sortBy: string }) => {
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
    // Filter Price (price = weight * pricePerGram)
    result = result.filter(p => (p.weightGrams * p.pricePerGram) <= filters.priceMax);

    // Sorting
    if (filters.sortBy === "newest") {
      result.sort((a, b) => new Date(b.dateAdded).getTime() - new Date(a.dateAdded).getTime());
    } else if (filters.sortBy === "price_asc") {
      result.sort((a, b) => (a.weightGrams * a.pricePerGram) - (b.weightGrams * b.pricePerGram));
    } else if (filters.sortBy === "price_desc") {
      result.sort((a, b) => (b.weightGrams * b.pricePerGram) - (a.weightGrams * a.pricePerGram));
    }

    return result;
  }, [filters]);

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      <div className="mb-10 text-center md:text-left rtl:md:text-right">
        <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-wide">{t('title')}</h1>
        <p className="text-foreground/70 max-w-2xl text-lg mx-auto md:mx-0 leading-relaxed">
          {t('description')}
        </p>
      </div>

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
