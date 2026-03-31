"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Award, Shield } from "lucide-react";
import { products } from "@/lib/data";
import ProductCard from "@/components/ProductCard";

export default function HomePage() {
  const t = useTranslations('Home');
  
  const featuredProducts = products.slice(0, 4);

  const categories = [
    { key: "rings", href: "/products?cat=bagues", icon: "💍", color: "from-rose-500/20 to-pink-500/10" },
    { key: "necklaces", href: "/products?cat=colliers", icon: "📿", color: "from-gold/20 to-yellow-500/10" },
    { key: "bracelets", href: "/products?cat=bracelets", icon: "⌚", color: "from-amber-500/20 to-orange-500/10" },
    { key: "earrings", href: "/products?cat=boucles", icon: "✨", color: "from-purple-500/20 to-indigo-500/10" },
  ];

  return (
    <div className="overflow-x-hidden">
      {/* Hero Section */}
      <section className="relative min-h-[85vh] flex items-center overflow-hidden">
        {/* Ambient background */}
        <div className="absolute inset-0 bg-gradient-to-br from-gold/5 via-background to-background" />
        <div className="absolute top-20 right-10 rtl:right-auto rtl:left-10 w-96 h-96 bg-gold/10 rounded-full blur-3xl" />
        <div className="absolute bottom-20 left-10 rtl:left-auto rtl:right-10 w-64 h-64 bg-gold/5 rounded-full blur-3xl" />

        <div className="container mx-auto px-4 relative z-10">
          <div className="max-w-3xl">
            <motion.div
              initial={{ opacity: 0, y: 30 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.8 }}
            >
              <span className="inline-block text-gold font-semibold text-sm tracking-widest uppercase mb-6 border border-gold/30 px-4 py-1 rounded-full bg-gold/5">
                Mezen Bijouterie
              </span>
              <h1 className="font-serif text-5xl md:text-7xl font-bold mb-6 leading-tight tracking-tight">
                {t('heroTitle')}
              </h1>
              <p className="text-foreground/70 text-xl leading-relaxed mb-10 max-w-xl">
                {t('heroDesc')}
              </p>
              <Link
                href="/products"
                className="inline-flex items-center gap-3 bg-gold hover:bg-gold-dark text-white font-bold text-lg px-8 py-4 rounded-2xl shadow-lg hover:shadow-xl hover:-translate-y-1 transition-all duration-300"
              >
                {t('heroBtn')}
                <ArrowRight size={20} className="rtl:rotate-180" />
              </Link>
            </motion.div>
          </div>
        </div>

        {/* Decorative gold elements */}
        <motion.div
          initial={{ opacity: 0, scale: 0.8 }}
          animate={{ opacity: 1, scale: 1 }}
          transition={{ duration: 1, delay: 0.3 }}
          className="absolute right-0 rtl:right-auto rtl:left-0 top-1/2 -translate-y-1/2 w-80 h-80 md:w-[500px] md:h-[500px] opacity-20"
        >
          <div className="w-full h-full rounded-full border-2 border-gold/40 flex items-center justify-center">
            <div className="w-3/4 h-3/4 rounded-full border border-gold/30 flex items-center justify-center">
              <div className="w-1/2 h-1/2 rounded-full bg-gold/20" />
            </div>
          </div>
        </motion.div>
      </section>

      {/* Categories Grid */}
      <section className="py-20 container mx-auto px-4">
        <div className="flex items-end justify-between mb-12">
          <div>
            <h2 className="font-serif text-4xl font-bold mb-2">{t('collection')}</h2>
            <div className="h-1 w-16 bg-gold rounded-full" />
          </div>
          <Link href="/products" className="flex items-center gap-2 text-gold hover:text-gold-dark font-semibold transition-colors group">
            {t('exploreAll')}
            <ArrowRight size={18} className="group-hover:translate-x-1 rtl:rotate-180 rtl:group-hover:-translate-x-1 transition-transform" />
          </Link>
        </div>

        <div className="grid grid-cols-2 md:grid-cols-4 gap-4 md:gap-6">
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
                className={`group flex flex-col items-center justify-center p-8 rounded-3xl bg-gradient-to-br ${cat.color} border border-gold/10 hover:border-gold/30 hover:shadow-lg hover:-translate-y-1 transition-all duration-300 aspect-square`}
              >
                <span className="text-5xl mb-4">{cat.icon}</span>
                <span className="font-serif font-bold text-lg text-center">{t(`categories.${cat.key}`)}</span>
              </Link>
            </motion.div>
          ))}
        </div>
      </section>

      {/* Featured Products */}
      <section className="py-20 bg-foreground/[0.02]">
        <div className="container mx-auto px-4">
          <div className="mb-12 text-center">
            <h2 className="font-serif text-4xl font-bold mb-3">{t('collection')}</h2>
            <div className="h-1 w-16 bg-gold rounded-full mx-auto" />
          </div>
          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
            {featuredProducts.map((product, idx) => (
              <motion.div
                key={product.id}
                initial={{ opacity: 0, y: 20 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true }}
                transition={{ delay: idx * 0.1 }}
              >
                <ProductCard product={product} />
              </motion.div>
            ))}
          </div>
          <div className="text-center mt-12">
            <Link
              href="/products"
              className="inline-flex items-center gap-2 border border-gold text-gold hover:bg-gold hover:text-white font-bold px-8 py-3 rounded-xl transition-all duration-300"
            >
              {t('exploreAll')} <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* Features / USP Section */}
      <section className="py-20 container mx-auto px-4">
        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
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
              className="text-center p-8 rounded-3xl border border-gold/10 hover:border-gold/30 hover:shadow-lg transition-all duration-300 group"
            >
              <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-6 group-hover:bg-gold/20 transition-colors">
                <feat.icon size={28} className="text-gold" />
              </div>
              <h3 className="font-serif text-xl font-bold mb-3">{t(`features.${feat.titleKey}`)}</h3>
              <p className="text-foreground/60 leading-relaxed">{t(`features.${feat.descKey}`)}</p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
