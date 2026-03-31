"use client";

import { useState, useEffect } from "react";
import { Filter, ChevronDown } from "lucide-react";
import { useTranslations } from "next-intl";

export default function Filters({ onFilterChange }: { onFilterChange?: (filters: { category: string; subCategory: string; priceMax: number; sortBy: string }) => void }) {
  const t = useTranslations('Products.filters');
  const [isOpen, setIsOpen] = useState(false);
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");
  const [priceMax, setPriceMax] = useState(20000);
  const [sortBy, setSortBy] = useState("newest");

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ category, subCategory, priceMax, sortBy });
    }
  }, [category, subCategory, priceMax, sortBy, onFilterChange]);

  return (
    <div className="bg-background border border-gold/20 rounded-2xl p-4 md:p-6 shadow-sm mb-8 relative z-20">
      <div className="flex items-center justify-between md:hidden mb-4 cursor-pointer" onClick={() => setIsOpen(!isOpen)}>
        <h3 className="font-serif font-bold flex items-center gap-2">
          <Filter size={18} className="text-gold" /> {t('title')}
        </h3>
        <button className="p-2 bg-foreground/5 rounded-full">
          <ChevronDown size={18} className={`transition-transform duration-300 ${isOpen ? "rotate-180" : ""}`} />
        </button>
      </div>

      <div className={`${isOpen ? "block" : "hidden"} md:block space-y-6 md:space-y-0 md:flex flex-wrap items-end gap-6`}>
        {/* Catégories */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-2">{t('category')}</label>
          <select 
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold/50 outline-none appearance-none cursor-pointer rtl:pr-4 rtl:pl-10"
          >
            <option value="all">{t('allCategories')}</option>
            <option value="bagues">{t('rings')}</option>
            <option value="colliers">{t('necklaces')}</option>
            <option value="bracelets">{t('bracelets')}</option>
            <option value="boucles">{t('earrings')}</option>
          </select>
        </div>

        {/* Sous-catégories */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-2">{t('subCategory')}</label>
          <select 
            value={subCategory}
            onChange={(e) => setSubCategory(e.target.value)}
            className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold/50 outline-none appearance-none cursor-pointer rtl:pr-4 rtl:pl-10"
          >
            <option value="all">{t('allSubCategories')}</option>
            <option value="mariage">{t('wedding')}</option>
            <option value="fiancailles">{t('engagement')}</option>
            <option value="quotidien">{t('daily')}</option>
          </select>
        </div>

        {/* Prix */}
        <div className="flex-1 min-w-[200px]">
          <div className="flex items-center justify-between mb-2">
            <label className="text-sm font-semibold">{t('priceMax')}</label>
            <span className="text-sm font-bold text-gold">{priceMax} €</span>
          </div>
          <input 
            type="range" 
            min="100" 
            max="20000" 
            step="100"
            value={priceMax}
            onChange={(e) => setPriceMax(Number(e.target.value))}
            className="w-full h-2 bg-gold/20 rounded-lg appearance-none cursor-pointer accent-gold"
          />
        </div>

        {/* Tri */}
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold mb-2">{t('sortBy')}</label>
          <select 
            value={sortBy}
            onChange={(e) => setSortBy(e.target.value)}
            className="w-full bg-foreground/5 border-none rounded-xl px-4 py-3 text-sm focus:ring-2 focus:ring-gold/50 outline-none appearance-none cursor-pointer rtl:pr-4 rtl:pl-10"
          >
            <option value="newest">{t('sortNewest')}</option>
            <option value="price_asc">{t('sortPriceAsc')}</option>
            <option value="price_desc">{t('sortPriceDesc')}</option>
          </select>
        </div>
      </div>
    </div>
  );
}
