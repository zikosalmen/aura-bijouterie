"use client";

import { useState } from "react";
import Image from "next/image";
import { Link } from "@/navigation";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, Eye, Plus, Minus } from "lucide-react";
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

export default function ProductCard({ product }: { product: Product }) {
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [isHovered, setIsHovered] = useState(false);
  const [quantity, setQuantity] = useState(1);
  const { addItem } = useCartStore();
  const t = useTranslations('Products');
  const td = useTranslations('Data');

  const locale = useLocale();

  const totalPrice = product.weightGrams * product.pricePerGram;

  const handleAddToCart = (e: React.MouseEvent) => {
    e.preventDefault();
    addItem(product, quantity);
  };

  const translatedDesc = td(`${product.reference}.desc`);

  return (
    <div 
      className="group relative bg-background border border-gold/10 rounded-2xl overflow-hidden shadow-sm hover:shadow-xl hover:border-gold/30 transition-all duration-300 flex flex-col"
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
    >
      {/* Etiquette de catégorie */}
      <div className="absolute top-4 left-4 z-10 flex flex-col gap-2 rtl:left-auto rtl:right-4">
        <span className="bg-background/80 backdrop-blur-md text-xs font-semibold px-3 py-1 rounded-full shadow-sm border border-gold/20">
          {t(`filters.${product.category}`)}
        </span>
      </div>

      {/* Bouton Details Rapide (Hover) */}
      <div className={`absolute top-4 right-4 z-10 transition-opacity duration-300 ${isHovered ? 'opacity-100' : 'opacity-0'} rtl:right-auto rtl:left-4`}>
        <button className="bg-background/90 text-foreground p-2 rounded-full shadow-md hover:bg-gold hover:text-white transition-colors">
          <Eye size={18} />
        </button>
      </div>

      {/* Image Gallery en Plein Bord avec Scroll Horizontal */}
      <div className="relative aspect-[4/5] sm:aspect-square overflow-hidden bg-foreground/5 w-full">
        <div 
          className="flex w-full h-full overflow-x-auto snap-x snap-mandatory [&::-webkit-scrollbar]:hidden [-ms-overflow-style:none] [scrollbar-width:none] touch-pan-x"
          onScroll={(e) => {
            const el = e.currentTarget;
            const idx = Math.round(el.scrollLeft / el.clientWidth);
            if (idx !== currentImageIdx && idx >= 0 && idx < product.images.length) {
              setCurrentImageIdx(idx);
            }
          }}
        >
          {product.images.map((img, idx) => (
            <Link key={idx} href={`/products/${product.id}`} className="min-w-full h-full relative snap-center block shrink-0">
              <Image
                src={img}
                alt={`${product.reference} - image ${idx + 1}`}
                fill
                sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                className={`object-cover transition-transform duration-700 ease-out ${isHovered ? 'scale-110' : 'scale-100'}`}
              />
            </Link>
          ))}
        </div>
        
        {/* Indicateur de multi-images */}
        {product.images.length > 1 && (
            <div className="absolute bottom-2 left-0 right-0 flex justify-center gap-1.5 pointer-events-none">
            {product.images.map((_, idx) => (
                <div
                key={idx}
                className={`h-1.5 rounded-full transition-all duration-300 shadow-sm ${currentImageIdx === idx ? 'w-4 bg-gold' : 'w-1.5 bg-background/60 backdrop-blur-md'}`}
                />
            ))}
            </div>
        )}
      </div>

      {/* Contenu complet (Ancien Style) */}
      <div className="p-5 flex-1 flex flex-col">
        <Link href={`/products/${product.id}`} className="mb-3 block">
          <span className="inline-flex items-center gap-1.5 font-mono font-bold text-2xl tracking-wider text-gold transition-colors">
            <span className="text-foreground text-base font-semibold">Réf:</span>
            {product.reference}
          </span>
        </Link>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2 leading-relaxed flex-1 rtl:text-right">
          {translatedDesc}
        </p>

        {/* Tableau Poids/Prix */}
        <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-foreground/5 p-3 rounded-xl border border-border/50">
          <div className="rtl:text-right">
            <span className="block text-xs text-foreground/50">Poids</span>
            <span className="font-semibold">{product.weightGrams}g</span>
          </div>
          <div className="rtl:text-right">
            <span className="block text-xs text-foreground/50">Prix/g</span>
            <span className="font-semibold">{formatPrice(product.pricePerGram, locale)}</span>
          </div>
        </div>

        <div className="flex items-center justify-between mt-auto">
          <div className="rtl:text-right">
            <span className="block text-xs text-foreground/50">Prix Total</span>
            <span className="font-bold text-xl text-gold">{formatPrice(totalPrice, locale)}</span>
          </div>

          <div className="flex items-center gap-3">
            <div className="flex items-center bg-foreground/5 rounded-xl p-1.5 border border-border/50 flex-1 me-4">
              <button 
                onClick={(e) => { e.preventDefault(); setQuantity(Math.max(1, quantity - 1)); }}
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-lg hover:bg-background shadow-sm transition-colors text-foreground/70"
              >
                <Minus size={18} />
              </button>
              
              <input 
                type="number"
                min="1"
                value={quantity}
                onChange={(e) => {
                  const val = parseInt(e.target.value);
                  if (!isNaN(val) && val > 0) setQuantity(val);
                }}
                className="w-12 sm:w-16 bg-transparent text-center font-bold text-base sm:text-lg outline-none focus:ring-2 focus:ring-gold/30 rounded"
              />
              
              <button 
                onClick={(e) => { e.preventDefault(); setQuantity(quantity + 1); }}
                className="w-8 h-8 sm:w-10 sm:h-10 shrink-0 flex items-center justify-center rounded-lg hover:bg-background shadow-sm transition-colors text-foreground/70"
              >
                <Plus size={18} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-foreground text-background w-12 h-12 rounded-xl flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1 shrink-0"
            >
              <ShoppingCart size={20} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
