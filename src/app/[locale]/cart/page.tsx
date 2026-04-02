"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { formatPrice } from "@/lib/utils";
import { Trash2, Plus, Minus, ArrowRight, ShoppingBag } from "lucide-react";
import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";

export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const t = useTranslations('Cart');
  const locale = useLocale();
  
  // To avoid hydration mismatch due to zustand persist, render after mount
  const [mounted, setMounted] = useState(false);
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotalPrice();

  return (
    <div className="container mx-auto px-4 py-8 md:py-16">
      <h1 className="font-serif text-3xl md:text-5xl font-bold mb-8 md:mb-12 tracking-wide text-center md:text-left rtl:md:text-right">
        {t('title')}
      </h1>

      {items.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-20 bg-foreground/5 rounded-3xl border border-gold/10">
          <ShoppingBag size={64} className="text-gold mb-6" />
          <p className="text-xl md:text-2xl font-serif mb-6 text-foreground/70">{t('empty')}</p>
          <Link 
            href="/products" 
            className="bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
          >
            {t('explore')} <ArrowRight size={20} className="rtl:rotate-180" />
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          {/* Cart Items */}
          <div className="lg:w-2/3 space-y-6">
            {items.map((item) => {
              const totalItemPriceText = formatPrice(item.product.weightGrams * item.product.pricePerGram * item.quantity);

              return (
                <div key={item.product.id} className="flex gap-4 md:gap-6 bg-background border border-gold/10 p-4 md:p-6 rounded-2xl shadow-sm relative group hover:border-gold/30 transition-all">
                  <div className="relative w-24 h-24 md:w-32 md:h-32 bg-foreground/5 rounded-xl overflow-hidden shrink-0">
                    <Image 
                      src={item.product.images[0]} 
                      alt={item.product.reference} 
                      fill 
                      sizes="(max-width: 768px) 100px, 150px"
                      className="object-cover"
                    />
                  </div>
                  
                  <div className="flex-1 flex flex-col justify-between">
                    <div className="flex justify-between items-start gap-4">
                      <div>
                        <div className="flex items-baseline gap-1.5 mb-1">
                          <span className="text-foreground text-sm font-semibold font-mono">Réf:</span>
                          <span className="font-mono font-bold text-2xl tracking-wider text-gold">{item.product.reference}</span>
                        </div>
                        <p className="text-sm text-foreground/60 mt-1">{item.product.weightGrams}g × {formatPrice(item.product.pricePerGram, locale)}/g</p>
                      </div>
                      <button 
                        onClick={() => removeItem(item.product.id)}
                        className="text-red-400 hover:text-red-500 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-full transition-colors"
                      >
                        <Trash2 size={18} />
                      </button>
                    </div>

                    <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                      {/* Quantity */}
                      <div className="flex items-center bg-foreground/5 rounded-full p-1 border border-foreground/10">
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity - 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70"
                        >
                          <Minus size={16} />
                        </button>
                        <span className="w-10 text-center font-medium">{item.quantity}</span>
                        <button 
                          onClick={() => updateQuantity(item.product.id, item.quantity + 1)}
                          className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70"
                        >
                          <Plus size={16} />
                        </button>
                      </div>

                      <div className="text-right rtl:text-left">
                        <p className="text-xs text-foreground/50 mb-0.5">{t('itemTotal')}</p>
                        <span className="font-bold text-xl text-gold">{totalItemPriceText}</span>
                      </div>
                    </div>
                  </div>
                </div>
              );
            })}
          </div>

          {/* Cart Summary */}
          <div className="lg:w-1/3">
            <div className="bg-foreground/5 border border-gold/20 rounded-3xl p-6 md:p-8 sticky top-28">
              <h2 className="font-serif text-2xl font-bold mb-6">{t('summary')}</h2>
              
              <div className="space-y-4 mb-8">
                <div className="flex justify-between text-foreground/70">
                  <span>{t('subtotal')}</span>
                  <span>{formatPrice(total, locale)}</span>
                </div>
                <div className="flex justify-between text-foreground/70">
                  <span>{t('shipping')}</span>
                  <span>{t('shippingInfo')}</span>
                </div>
                <div className="h-px bg-gold/20 w-full my-4"></div>
                <div className="flex justify-between items-end">
                  <span className="font-bold text-lg">{t('total')}</span>
                  <span className="font-bold text-3xl text-gold">{formatPrice(total, locale)}</span>
                </div>
              </div>

              <button className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2">
                {t('checkout')} <ArrowRight size={20} className="rtl:rotate-180" />
              </button>

              <div className="mt-6 text-center text-xs text-foreground/50">
                {t('securityInfo')}
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}
