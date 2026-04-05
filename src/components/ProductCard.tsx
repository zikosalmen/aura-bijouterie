"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Plus, Minus } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTranslations, useLocale } from "next-intl";

export type Product = {
  id: string;
  reference: string;
  description: string;
  category: string;
  subCategory: string;
  images: string[];
  weightGrams: number;
  pricePerGram: number;
  dateAdded: string;
};

// Tiny gold blur placeholder (1x1 px base64) — displayed while image loads
const BLUR_DATA =
  "data:image/jpeg;base64,/9j/4AAQSkZJRgABAQAAAQABAAD/2wBDAAMCAgMCAgMDAwMEAwMEBQgFBQQEBQoH" +
  "BwYIDAoMCwsKCwsNCxAQDQ4RDgsLEBYQERMUFRUVDA8XGBYUGBIUFRT/2wBDAQMEBAUEBQkFBQkUDQsN" +
  "FBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBQUFBT/wAARCAABAAEDASIAAhEBAxEB" +
  "/8QAFAABAAAAAAAAAAAAAAAAAAAACf/EABQQAQAAAAAAAAAAAAAAAAAAAAD/xAAUAQEAAAAAAAAAAAAAAAAA" +
  "AAAA/8QAFBEBAAAAAAAAAAAAAAAAAAAAAP/aAAwDAQACEQMRAD8AJQAB/9k=";

export default function ProductCard({
  product,
  priority = false,
}: {
  product: Product;
  priority?: boolean;
}) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const { addItem } = useCartStore();
  const t = useTranslations("Products");
  const td = useTranslations("Data");
  const locale = useLocale();

  const totalPrice = product.weightGrams * product.pricePerGram;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 1500);
  };

  let translatedDesc = product.description;
  try {
    translatedDesc = td(`${product.reference}.desc`);
  } catch {
    translatedDesc = product.description;
  }

  return (
    <div className="group relative bg-background border border-gold/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col h-full">

      {/* Category Badge */}
      <div className="absolute top-3 left-3 z-10 rtl:left-auto rtl:right-3">
        <span className="bg-background/85 backdrop-blur-md text-[10px] sm:text-xs font-semibold px-2.5 py-1 rounded-full shadow-sm border border-gold/20 whitespace-nowrap">
          {t(`filters.${product.category}`)}
        </span>
      </div>

      {/* Image Gallery */}
      <Link href={`/products/${product.id}`} className="block">
        <div className="relative aspect-square overflow-hidden bg-foreground/5 w-full">
          <div
            className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none]"
            onScroll={(e) => {
              const el = e.currentTarget;
              const idx = Math.round(el.scrollLeft / el.clientWidth);
              if (idx !== currentImageIdx && idx >= 0 && idx < product.images.length) {
                setCurrentImageIdx(idx);
              }
            }}
          >
            {product.images.map((img, idx) => (
              <div key={idx} className="min-w-full h-full relative snap-center shrink-0">
                <Image
                  src={img}
                  alt={`${product.reference} - ${idx + 1}`}
                  fill
                  // Only prioritize (eager load) the first image of the first 4 cards
                  priority={priority && idx === 0}
                  loading={priority && idx === 0 ? "eager" : "lazy"}
                  quality={75}
                  // Precise sizes matching our 2-col / 3-col / 4-col grid
                  sizes="(max-width: 640px) 48vw, (max-width: 1024px) 32vw, 24vw"
                  placeholder="blur"
                  blurDataURL={BLUR_DATA}
                  className="object-cover group-hover:scale-105 transition-transform duration-700 ease-out"
                />
              </div>
            ))}
          </div>

          {/* Dots indicator */}
          {product.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
              {product.images.map((_, idx) => (
                <div
                  key={idx}
                  className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIdx === idx ? "w-4 bg-gold" : "w-1.5 bg-white/60"
                    }`}
                />
              ))}
            </div>
          )}
        </div>
      </Link>

      {/* Content */}
      <div className="p-3 sm:p-4 flex-1 flex flex-col gap-2.5">

        {/* Reference */}
        <Link href={`/products/${product.id}`}>
          <div className="flex items-baseline gap-1.5">
            <span className="text-foreground/60 text-xs font-medium">Réf:</span>
            <span className="font-mono font-bold text-lg sm:text-xl text-gold tracking-wider">
              {product.reference}
            </span>
          </div>
        </Link>

        {/* Description */}
        <p className="text-xs text-foreground/65 line-clamp-2 leading-relaxed flex-1 rtl:text-right">
          {translatedDesc}
        </p>

        {/* Weight / Price per gram */}
        <div className="grid grid-cols-2 gap-2 bg-foreground/[0.04] rounded-xl px-3 py-2 border border-border/40">
          <div>
            <span className="block text-[10px] text-foreground/45 font-medium">Poids</span>
            <span className="font-semibold text-xs sm:text-sm">{product.weightGrams}g</span>
          </div>
          <div className="rtl:text-right">
            <span className="block text-[10px] text-foreground/45 font-medium">Prix/g</span>
            <span className="font-semibold text-xs sm:text-sm">{formatPrice(product.pricePerGram, locale)}</span>
          </div>
        </div>

        {/* Total Price + Cart controls */}
        <div className="mt-auto pt-1">
          <div className="flex items-center justify-between mb-2.5">
            <span className="text-[10px] text-foreground/45">Prix <br />Total</span>
            <span className="font-bold text-base sm:text-lg text-gold">{formatPrice(totalPrice, locale)}</span>
          </div>

          {/* Quantity + Add to cart */}
          <div className="flex items-center gap-2">
            {/* Qty stepper */}
            <div className="flex items-center bg-foreground/5 rounded-xl border border-border/40 shrink-0">
              <button
                onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
                className="w-6 h-8 flex items-center justify-center rounded-l-xl hover:bg-foreground/10 transition-colors text-foreground/70"
              >
                <Minus size={14} />
              </button>
              <input
                type="number"
                min="1"
                value={quantity || ""}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) setQuantity(val);
                }}
                className="w-4 sm:w-12 bg-transparent text-center font-bold text-sm sm:text-base outline-none focus:ring-2 focus:ring-gold/30 rounded"
              />
              <button
                onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1); }}
                className="w-8 h-8 flex items-center justify-center rounded-r-xl hover:bg-foreground/10 transition-colors text-foreground/70"
              >
                <Plus size={14} />
              </button>
            </div>

            {/* Add to cart button */}
            <button
              onClick={handleAddToCart}
              className={`flex-1 h-9 rounded-xl flex items-center justify-center gap-1.5 font-semibold text-xs transition-all duration-300 shadow-sm ${added
                  ? "bg-green-500 text-white scale-95"
                  : "bg-gold hover:bg-gold/90 text-white hover:-translate-y-0.5 hover:shadow-md"
                }`}
            >
              <ShoppingCart size={14} />
              <span className="hidden sm:inline">{added ? "Ajouté !" : "Ajouter"}</span>
              <span className="sm:hidden">{added ? "✓" : "+"}</span>
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
