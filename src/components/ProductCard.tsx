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
  name: string;
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

  const handleAddToCart = () => {
    addItem(product, quantity);
  };

  const translatedName = td(`${product.reference}.name`);
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

      {/* Image Gallery */}
      <Link href={`/products/${product.id}`} className="relative aspect-square overflow-hidden bg-foreground/5 block">
        <Image
          src={product.images[currentImageIdx]}
          alt={translatedName}
          fill
          sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
          className={`object-cover transition-transform duration-700 ease-out p-6 ${isHovered ? 'scale-110' : 'scale-100'}`}
        />
      </Link>

      {/* Indicateur de multi-images */}
      {product.images.length > 1 && (
        <div className="flex justify-center gap-1.5 p-2 bg-foreground/5">
          {product.images.map((_, idx) => (
            <button
              key={idx}
              onClick={() => setCurrentImageIdx(idx)}
              className={`h-1.5 rounded-full transition-all duration-300 ${currentImageIdx === idx ? 'w-4 bg-gold' : 'w-1.5 bg-gold/30'}`}
            />
          ))}
        </div>
      )}

      {/* Contenu */}
      <div className="p-5 flex-1 flex flex-col">
        <p className="text-xs text-foreground/50 font-mono mb-1">Réf: {product.reference}</p>
        <Link href={`/products/${product.id}`}>
          <h3 className="font-serif text-lg font-bold mb-2 group-hover:text-gold transition-colors line-clamp-1 rtl:text-right">{translatedName}</h3>
        </Link>
        <p className="text-sm text-foreground/70 mb-4 line-clamp-2 leading-relaxed flex-1 rtl:text-right">
          {translatedDesc}
        </p>

        <div className="grid grid-cols-2 gap-2 text-sm mb-4 bg-foreground/5 p-3 rounded-xl">
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
            <div className="hidden md:flex items-center bg-foreground/5 rounded-full p-1">
              <button 
                onClick={() => setQuantity(Math.max(1, quantity - 1))}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70"
              >
                <Minus size={14} />
              </button>
              <span className="w-6 text-center text-sm font-medium">{quantity}</span>
              <button 
                onClick={() => setQuantity(quantity + 1)}
                className="w-6 h-6 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70"
              >
                <Plus size={14} />
              </button>
            </div>
            
            <button 
              onClick={handleAddToCart}
              className="bg-foreground text-background w-10 h-10 rounded-full flex items-center justify-center hover:bg-gold hover:text-white transition-all duration-300 shadow-md hover:shadow-lg hover:-translate-y-1"
            >
              <ShoppingCart size={18} />
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
