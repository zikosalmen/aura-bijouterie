"use client";

import { useState } from "react";
import Image from "next/image";
import { useParams } from "next/navigation";
import { products } from "@/lib/data";
import { formatPrice } from "@/lib/utils";
import { ShoppingCart, ArrowLeft, Check, ChevronLeft, ChevronRight, ZoomIn } from "lucide-react";
import { useCartStore } from "@/store/cartStore";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";
import { motion, AnimatePresence } from "framer-motion";

export default function ProductDetailPage() {
  const params = useParams();
  const id = params.id as string;
  const product = products.find((p) => p.id === id);
  
  const [currentImageIdx, setCurrentImageIdx] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [added, setAdded] = useState(false);
  const [zoomed, setZoomed] = useState(false);

  const { addItem } = useCartStore();
  const t = useTranslations('Products');
  const td = useTranslations('Data');
  const locale = useLocale();

  if (!product) {
    return (
      <div className="container mx-auto px-4 py-20 text-center">
        <p className="text-xl text-foreground/60">Produit introuvable.</p>
        <Link href="/products" className="mt-6 inline-flex items-center gap-2 text-gold hover:underline">
          <ArrowLeft size={18} className="rtl:rotate-180" /> Retour aux produits
        </Link>
      </div>
    );
  }

  const translatedName = td(`${product.reference}.name`);
  const translatedDesc = td(`${product.reference}.desc`);
  const totalPrice = product.weightGrams * product.pricePerGram;

  const handleAddToCart = () => {
    addItem(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  return (
    <div className="container mx-auto px-4 py-8 md:py-12">
      {/* Breadcrumb */}
      <nav className="flex items-center gap-2 text-sm text-foreground/50 mb-8">
        <Link href="/" className="hover:text-gold transition-colors">Accueil</Link>
        <span>/</span>
        <Link href="/products" className="hover:text-gold transition-colors">{t('title')}</Link>
        <span>/</span>
        <span className="text-foreground font-medium">{translatedName}</span>
      </nav>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-20">
        {/* Image Gallery */}
        <div className="space-y-4">
          {/* Main Image */}
          <div
            className="relative aspect-square rounded-3xl overflow-hidden bg-foreground/5 border border-gold/10 cursor-zoom-in group"
            onClick={() => setZoomed(true)}
          >
            <AnimatePresence mode="wait">
              <motion.div
                key={currentImageIdx}
                initial={{ opacity: 0 }}
                animate={{ opacity: 1 }}
                exit={{ opacity: 0 }}
                transition={{ duration: 0.3 }}
                className="absolute inset-0"
              >
                <Image
                  src={product.images[currentImageIdx]}
                  alt={translatedName}
                  fill
                  className="object-contain p-8 group-hover:scale-105 transition-transform duration-500"
                />
              </motion.div>
            </AnimatePresence>
            <div className="absolute bottom-4 right-4 rtl:right-auto rtl:left-4 bg-background/80 backdrop-blur-sm p-2 rounded-full opacity-0 group-hover:opacity-100 transition-opacity">
              <ZoomIn size={18} className="text-gold" />
            </div>
            {/* Navigation arrows */}
            {product.images.length > 1 && (
              <>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(Math.max(0, currentImageIdx - 1)); }}
                  className="absolute left-3 rtl:left-auto rtl:right-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md p-2 rounded-full shadow hover:bg-gold hover:text-white transition-all"
                >
                  <ChevronLeft size={18} />
                </button>
                <button
                  onClick={(e) => { e.stopPropagation(); setCurrentImageIdx(Math.min(product.images.length - 1, currentImageIdx + 1)); }}
                  className="absolute right-3 rtl:right-auto rtl:left-3 top-1/2 -translate-y-1/2 bg-background/80 backdrop-blur-md p-2 rounded-full shadow hover:bg-gold hover:text-white transition-all"
                >
                  <ChevronRight size={18} />
                </button>
              </>
            )}
          </div>

          {/* Thumbnails */}
          {product.images.length > 1 && (
            <div className="flex gap-3 overflow-x-auto pb-1">
              {product.images.map((img, idx) => (
                <button
                  key={idx}
                  onClick={() => setCurrentImageIdx(idx)}
                  className={`relative w-20 h-20 shrink-0 rounded-2xl overflow-hidden border-2 transition-all ${
                    currentImageIdx === idx ? "border-gold shadow-md" : "border-transparent opacity-60 hover:opacity-90"
                  }`}
                >
                  <Image src={img} alt="" fill className="object-contain p-2" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Product Info */}
        <div className="space-y-6">
          {/* Ref and Category */}
          <div className="flex items-center gap-3 flex-wrap">
            <span className="text-xs font-mono text-foreground/50 bg-foreground/5 px-3 py-1 rounded-full">
              Réf: {product.reference}
            </span>
            <span className="text-xs font-semibold text-gold bg-gold/10 border border-gold/20 px-3 py-1 rounded-full">
              {t(`filters.${product.category}`)}
            </span>
            <span className="text-xs font-semibold text-foreground/50 bg-foreground/5 px-3 py-1 rounded-full">
              {t(`filters.${product.subCategory}`)}
            </span>
          </div>

          <div>
            <h1 className="font-serif text-3xl md:text-4xl font-bold mb-3 rtl:text-right">{translatedName}</h1>
            <p className="text-foreground/70 text-lg leading-relaxed rtl:text-right">{translatedDesc}</p>
          </div>

          {/* Pricing Card */}
          <div className="bg-foreground/5 rounded-2xl p-6 border border-gold/10 space-y-4">
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60 rtl:text-right">Poids</span>
              <span className="font-bold text-lg">{product.weightGrams}g</span>
            </div>
            <div className="flex items-center justify-between">
              <span className="text-sm text-foreground/60 rtl:text-right">Prix par gramme</span>
              <span className="font-bold text-lg">{formatPrice(product.pricePerGram, locale)}</span>
            </div>
            <div className="h-px bg-gold/20" />
            <div className="flex items-center justify-between">
              <span className="font-bold text-foreground rtl:text-right">Prix Total</span>
              <span className="font-bold text-3xl text-gold">{formatPrice(totalPrice, locale)}</span>
            </div>
          </div>

          {/* Quantity and Add to Cart */}
          <div className="space-y-4">
            <div className="flex items-center gap-4">
              <span className="text-sm font-semibold text-foreground/70 w-20 rtl:text-right">Quantité</span>
              <div className="flex items-center bg-foreground/5 rounded-full p-1 border border-foreground/10">
                <button
                  onClick={() => setQuantity(Math.max(1, quantity - 1))}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70 font-bold text-lg"
                >
                  −
                </button>
                <span className="w-12 text-center font-bold text-lg">{quantity}</span>
                <button
                  onClick={() => setQuantity(quantity + 1)}
                  className="w-10 h-10 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70 font-bold text-lg"
                >
                  +
                </button>
              </div>
            </div>

            <button
              onClick={handleAddToCart}
              className={`w-full font-bold py-4 rounded-2xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-3 text-lg ${
                added
                  ? "bg-green-500 text-white"
                  : "bg-gold hover:bg-gold-dark text-white"
              }`}
            >
              {added ? (
                <>
                  <Check size={22} /> Ajouté au panier !
                </>
              ) : (
                <>
                  <ShoppingCart size={22} /> Ajouter au panier ({formatPrice(totalPrice * quantity, locale)})
                </>
              )}
            </button>
          </div>

          {/* Back link */}
          <Link
            href="/products"
            className="inline-flex items-center gap-2 text-foreground/50 hover:text-gold transition-colors text-sm mt-4"
          >
            <ArrowLeft size={16} className="rtl:rotate-180" />
            Retour aux produits
          </Link>
        </div>
      </div>

      {/* Lightbox */}
      <AnimatePresence>
        {zoomed && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 bg-black/90 z-50 flex items-center justify-center p-4"
            onClick={() => setZoomed(false)}
          >
            <div className="relative w-full max-w-3xl aspect-square">
              <Image
                src={product.images[currentImageIdx]}
                alt={translatedName}
                fill
                className="object-contain"
              />
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  );
}
