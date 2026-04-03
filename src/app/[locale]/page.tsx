"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Award, Shield } from "lucide-react";
import { useState, useEffect } from "react";
import { fetchProducts } from "@/lib/products";
import ProductCard, { Product } from "@/components/ProductCard";

export default function HomePage() {
  const t = useTranslations('Home');
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setFeaturedProducts(data.slice(0, 4));
    }
    load();
  }, []);

  const categories = [
    { key: "rings", href: "/products?cat=bagues", icon: "💍", color: "from-rose-500/20 to-pink-500/10" },
    { key: "necklaces", href: "/products?cat=colliers", icon: "📿", color: "from-gold/20 to-yellow-500/10" },
    { key: "bracelets", href: "/products?cat=bracelets", icon: "⌚", color: "from-amber-500/20 to-orange-500/10" },
    { key: "earrings", href: "/products?cat=boucles", icon: "✨", color: "from-purple-500/20 to-indigo-500/10" },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* ─── Hero ─────────────────────────────────────────── */}
      <section className="relative min-h-[75vh] sm:min-h-[85vh] flex items-center overflow-hidden">
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-background to-background" />
        <div className="absolute top-20 right-0 rtl:right-auto rtl:left-0 w-72 h-72 sm:w-96 sm:h-96 bg-gold/10 rounded-full blur-3xl pointer-events-none" />
        <div className="absolute bottom-10 left-0 w-48 h-48 sm:w-64 sm:h-64 bg-gold/5 rounded-full blur-3xl pointer-events-none" />

        <div className="container mx-auto px-4 relative z-10 py-16 sm:py-0">
          <div className="max-w-xl sm:max-w-2xl lg:max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
              className="space-y-5 sm:space-y-6"
            >
              <span className="inline-block text-gold font-semibold text-xs sm:text-sm tracking-widest uppercase border border-gold/30 px-3 sm:px-4 py-1 rounded-full bg-gold/5">
                Aura Design
              </span>

              <h1 className="font-serif text-3xl sm:text-5xl md:text-6xl lg:text-7xl font-bold leading-tight tracking-tight">
                {t('heroTitle')}
              </h1>

              <p className="text-foreground/70 text-base sm:text-lg lg:text-xl leading-relaxed max-w-md">
                {t('heroDesc')}
              </p>

              <div className="flex flex-wrap gap-3 pt-2">
                <Link
                  href="/products"
                  className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-bold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-0.5 transition-all duration-300"
                >
                  {t('heroBtn')}
                  <ArrowRight size={18} className="rtl:rotate-180" />
                </Link>
                <Link
                  href="/contact"
                  className="inline-flex items-center gap-2 border border-gold/40 text-gold hover:bg-gold/10 font-semibold text-sm sm:text-base px-5 sm:px-7 py-3 sm:py-4 rounded-2xl transition-all duration-300"
                >
                  Contact
                </Link>
              </div>
            </motion.div>
          </div>
        </div>

        {/* Decorative rings — hidden on small mobile */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.4 }}
          className="hidden sm:block absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 w-64 h-64 md:w-96 md:h-96 lg:w-[480px] lg:h-[480px] opacity-20 pointer-events-none"
        >
          <div className="w-full h-full rounded-full border-2 border-gold/40 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full border border-gold/30 flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full bg-gold/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* ─── Categories ───────────────────────────────────── */}
      <section className="py-12 sm:py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-8 sm:mb-12">
          <div>
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-2">{t('collection')}</h2>
            <div className="h-1 w-12 sm:w-16 bg-gold rounded-full" />
          </div>
          <Link
            href="/products"
            className="flex items-center gap-1.5 text-gold hover:text-gold/80 font-semibold text-sm transition-colors group"
          >
            {t('exploreAll')}
            <ArrowRight size={16} className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 sm:grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4 md:gap-6">
          {categories.map((cat, idx) => (
            <motion.div
              key={cat.key}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.1 }}
            >
              <Link
                href={cat.href}
                className={`group flex flex-col items-center justify-center p-5 sm:p-8 rounded-2xl sm:rounded-3xl bg-gradient-to-br ${cat.color} border border-gold/10 hover:border-gold/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 aspect-square`}
              >
                <span className="text-3xl sm:text-5xl mb-2 sm:mb-4">{cat.icon}</span>
                <span className="font-serif font-bold text-sm sm:text-lg text-center leading-tight">{t(`categories.${cat.key}`)}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* ─── Featured Products ─────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-foreground/[0.02]">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-3">{t('collection')}</h2>
            <div className="h-1 w-12 sm:w-16 bg-gold rounded-full mx-auto" />
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-2 lg:grid-cols-4 gap-3 sm:gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} priority={true} />
              </motion.div>
            ))}
          </div>

          <div className="text-center mt-8 sm:mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-white font-bold px-6 sm:px-8 py-3 rounded-xl transition-all duration-300"
            >
              {t('exploreAll')} <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── USP Features ─────────────────────────────────── */}
      <section className="py-12 sm:py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 sm:grid-cols-3 gap-5 sm:gap-8">
          {[
            { icon: Gem, titleKey: "artisanInfo", descKey: "artisanDesc" },
            { icon: Award, titleKey: "exclusiveInfo", descKey: "exclusiveDesc" },
            { icon: Shield, titleKey: "guaranteeInfo", descKey: "guaranteeDesc" },
          ].map((feat, idx) => (
            <motion.div
              key={feat.titleKey}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true }}
              transition={{ delay: idx * 0.15 }}
              className="text-center p-6 sm:p-8 rounded-2xl sm:rounded-3xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-12 h-12 sm:w-16 sm:h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4 sm:mb-6 group-hover:bg-gold/20 transition-colors">
                <feat.icon size={24} className="text-gold" />
              </div>
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 sm:mb-3">{t(`features.${feat.titleKey}`)}</h3>
              <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">{t(`features.${feat.descKey}`)}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
