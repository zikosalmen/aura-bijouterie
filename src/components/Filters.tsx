"use client";

import { useState, useEffect } from "react";
import { Filter } from "lucide-react";
import { useTranslations } from "next-intl";

const CATEGORIES = [
  { value: "all", labelKey: "allCategories" },
  { value: "bagues", labelKey: "rings" },
  { value: "colliers", labelKey: "necklaces" },
  { value: "bracelets", labelKey: "bracelets" },
  { value: "boucles", labelKey: "earrings" },
];

const SUB_CATEGORIES: Record<string, { value: string; labelKey: string }[]> = {
  all: [],
  bagues: [
    { value: "mariage", labelKey: "wedding" },
    { value: "fiancailles", labelKey: "engagement" },
    { value: "quotidien", labelKey: "daily" },
  ],
  colliers: [
    { value: "mariage", labelKey: "wedding" },
    { value: "quotidien", labelKey: "daily" },
  ],
  bracelets: [
    { value: "fiancailles", labelKey: "engagement" },
    { value: "mariage", labelKey: "wedding" },
    { value: "quotidien", labelKey: "daily" },
  ],
  boucles: [
    { value: "mariage", labelKey: "wedding" },
    { value: "quotidien", labelKey: "daily" },
  ],
};

export default function Filters({
  onFilterChange,
}: {
  onFilterChange?: (filters: { category: string; subCategory: string }) => void;
}) {
  const t = useTranslations("Products.filters");
  const [category, setCategory] = useState("all");
  const [subCategory, setSubCategory] = useState("all");

  const subCats = category !== "all" ? SUB_CATEGORIES[category] ?? [] : [];

  useEffect(() => {
    if (onFilterChange) {
      onFilterChange({ category, subCategory });
    }
  }, [category, subCategory, onFilterChange]);

  const handleCategoryChange = (val: string) => {
    setCategory(val);
    setSubCategory("all");
  };

  return (
    <div className="mb-6 sm:mb-8 space-y-3">
      {/* Row 1 – Catégories scroll horizontale sur mobile */}
      <div className="flex items-center gap-3">
        <span className="flex items-center gap-1.5 text-xs text-foreground/50 font-semibold shrink-0">
          <Filter size={13} className="text-gold" />
          <span className="hidden sm:inline">{t("category")}</span>
        </span>
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          {CATEGORIES.map((cat) => {
            const active = category === cat.value;
            return (
              <button
                key={cat.value}
                onClick={() => handleCategoryChange(cat.value)}
                className={`px-3.5 py-1.5 rounded-full text-xs sm:text-sm font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 ${active
                    ? "bg-gold text-white border-gold shadow-md"
                    : "bg-background text-foreground/70 border-foreground/15 hover:border-gold/50 hover:text-gold"
                  }`}
              >
                {t(cat.labelKey)}
              </button>
            );
          })}
        </div>
      </div>

      {/* Divider */}
      <div className="h-px bg-gold/15 w-full" />

      {/* Row 2 – Sous-catégories */}
      {category !== "all" && subCats.length > 0 && (
        <div className="flex items-center gap-2 overflow-x-auto pb-1 [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]">
          <span className="text-xs text-gold font-semibold shrink-0">›</span>
          <button
            onClick={() => setSubCategory("all")}
            className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 ${subCategory === "all"
                ? "bg-foreground text-background border-foreground shadow-sm"
                : "bg-background text-foreground/60 border-foreground/15 hover:border-foreground/40"
              }`}
          >
            Tous
          </button>
          {subCats.map((sub) => {
            const active = subCategory === sub.value;
            return (
              <button
                key={sub.value}
                onClick={() => setSubCategory(sub.value)}
                className={`px-3 py-1 rounded-full text-xs font-semibold border transition-all duration-200 whitespace-nowrap shrink-0 ${active
                    ? "bg-foreground text-background border-foreground shadow-sm"
                    : "bg-background text-foreground/60 border-foreground/15 hover:border-foreground/40"
                  }`}
              >
                {t(sub.labelKey)}
              </button>
            );
          })}
        </div>
      )}
    </div>
  );
}
