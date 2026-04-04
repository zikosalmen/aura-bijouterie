"use client";

import { useTranslations } from "next-intl";
import { Link } from "@/navigation";
import { motion } from "framer-motion";
import { ArrowRight, Gem, Award, Shield, ChevronDown } from "lucide-react";
import { useState, useEffect, useRef, useCallback } from "react";
import { fetchProducts } from "@/lib/products";
import ProductCard, { Product } from "@/components/ProductCard";

/* ─────────────────────────────────────────────────────────────────────────
   Apple-style scroll-scrub section
   300 vh outer wrapper → sticky inner viewport → video scrubbed by scroll
───────────────────────────────────────────────────────────────────────── */
function ScrollScrubVideo() {
  const containerRef = useRef<HTMLDivElement>(null);
  const videoRef = useRef<HTMLVideoElement>(null);
  const rafRef = useRef<number | null>(null);
  const [mounted, setMounted] = useState(false);
  const [progress, setProgress] = useState(0);

  const captions = [
    {
      tag: "Savoir-faire",
      title: "L'art de la bijouterie",
      desc: "Chaque pièce est façonnée à la main par nos artisans, avec une précision millimétrée.",
    },
    {
      tag: "Matériaux nobles",
      title: "Or, argent & pierres précieuses",
      desc: "Nous sélectionnons les métaux et gemmes les plus purs pour une qualité irréprochable.",
    },
    {
      tag: "Finition parfaite",
      title: "Détails qui font la différence",
      desc: "La dernière touche transforme un bijou en une œuvre d'art que vous porterez toute une vie.",
    },
  ];

  const activeIdx = mounted
    ? Math.min(Math.floor(progress * captions.length), captions.length - 1)
    : 0;

  const scrub = useCallback(() => {
    const el = containerRef.current;
    const video = videoRef.current;
    if (!el || !video || !video.duration) return;

    const rect = el.getBoundingClientRect();
    const scrollable = el.offsetHeight - window.innerHeight;
    if (scrollable <= 0) return;
    const scrolled = Math.max(0, -rect.top);
    const p = Math.min(1, scrolled / scrollable);

    setProgress(p);
    // Direct DOM write — no paint delay
    video.currentTime = p * video.duration;
  }, []);

  useEffect(() => {
    setMounted(true);

    const video = videoRef.current;

    // Call scrub once metadata is ready (duration available)
    const onMeta = () => scrub();
    if (video) video.addEventListener("loadedmetadata", onMeta);

    const onScroll = () => {
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      rafRef.current = requestAnimationFrame(scrub);
    };
    window.addEventListener("scroll", onScroll, { passive: true });
    scrub();

    return () => {
      window.removeEventListener("scroll", onScroll);
      if (rafRef.current) cancelAnimationFrame(rafRef.current);
      if (video) video.removeEventListener("loadedmetadata", onMeta);
    };
  }, [scrub]);

  const p = mounted ? progress : 0;

  return (
    <div ref={containerRef} className="relative h-[300vh]">
      {/* Sticky viewport — fills 100dvh so mobile toolbars are accounted for */}
      <div className="sticky top-0 h-screen w-full overflow-hidden bg-black">
        {/* ── Video ── */}
        <video ref={videoRef} src="https://res.cloudinary.com/dc3lyg55d/video/upload/v1775326874/vd_scroll_finit2_zd2sib.mp4" muted playsInline preload="auto" /* keeps the first decoded frame visible */ onLoadedData={(e) => { (e.target as HTMLVideoElement).currentTime = 0.001; }} className="absolute inset-0 h-full w-full object-cover" />

        {/* ── Overlay ── */}
        <div className="absolute inset-0 bg-black/50 pointer-events-none" />

        {/* ── Bottom vignette ── */}
        <div className="absolute inset-x-0 bottom-0 h-40 bg-gradient-to-t from-background to-transparent pointer-events-none" />

        {/* ── Progress bar ── */}
        <div className="absolute bottom-0 left-0 right-0 h-[2px] bg-white/10 z-20">
          <div
            suppressHydrationWarning
            className="h-full bg-gold"
            style={{ width: `${p * 100}%` }}
          />
        </div>

        {/* ── Section label ── */}
        <div className="absolute top-8 left-6 sm:left-12 z-20 pointer-events-none">
          <span className="text-white/40 text-[10px] sm:text-xs tracking-[0.3em] uppercase font-medium">
            Notre univers
          </span>
        </div>

        {/* ── Step dots ── */}
        <div className="absolute top-8 right-6 sm:right-12 z-20 flex gap-2">
          {captions.map((_, i) => (
            <div
              key={i}
              suppressHydrationWarning
              className="w-1.5 h-1.5 rounded-full"
              style={{
                backgroundColor: mounted && i === activeIdx ? "#D4AF37" : "rgba(255,255,255,0.25)",
                transform: mounted && i === activeIdx ? "scale(1.5)" : "scale(1)",
                transition: "background-color 0.5s ease, transform 0.5s ease",
              }}
            />
          ))}
        </div>

        {/* ── Caption cards ── */}
        <div className="absolute inset-0 flex items-end z-10 px-5 sm:px-12 lg:px-20 pb-20 sm:pb-28">
          {captions.map((cap, i) => {
            const capProgress = p * captions.length - i;
            const visible = mounted ? activeIdx === i : i === 0;
            return (
              <div
                key={i}
                suppressHydrationWarning
                className="absolute max-w-[260px] sm:max-w-md"
                style={{
                  opacity: visible ? 1 : 0,
                  transform: visible ? "translateY(0px)" : "translateY(28px)",
                  transition: mounted
                    ? "opacity 0.6s ease, transform 0.6s ease"
                    : "none",
                  pointerEvents: visible ? "auto" : "none",
                }}
              >
                <span className="inline-block text-gold text-[9px] sm:text-xs font-bold tracking-[0.2em] uppercase border border-gold/40 px-2.5 py-0.5 rounded-full bg-black/50 backdrop-blur-sm mb-3">
                  {cap.tag}
                </span>
                <h2 className="font-serif text-xl sm:text-4xl md:text-5xl font-bold text-white leading-tight mb-2 sm:mb-4">
                  {cap.title}
                </h2>
                <p className="text-white/70 text-xs sm:text-base leading-relaxed max-w-[220px] sm:max-w-sm mb-3 sm:mb-5">
                  {cap.desc}
                </p>
                {/* Sub-progress line */}
                <div className="w-16 h-[1px] bg-white/20 overflow-hidden rounded-full">
                  <div
                    suppressHydrationWarning
                    className="h-full bg-gold"
                    style={{
                      width:
                        mounted && visible
                          ? `${Math.max(0, Math.min(capProgress, 1)) * 100}%`
                          : "0%",
                      transition: "width 0.1s linear",
                    }}
                  />
                </div>
              </div>
            );
          })}
        </div>

        {/* ── CTA appears at end of scrub ── */}
        <div
          suppressHydrationWarning
          className="absolute inset-x-0 bottom-16 sm:bottom-24 flex justify-center z-10"
          style={{
            opacity: mounted && p > 0.88 ? 1 : 0,
            transform: mounted && p > 0.88 ? "translateY(0)" : "translateY(18px)",
            transition: mounted ? "opacity 0.6s ease, transform 0.6s ease" : "none",
            pointerEvents: mounted && p > 0.88 ? "auto" : "none",
          }}
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-bold text-sm sm:text-base px-7 sm:px-9 py-3.5 sm:py-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.55)] hover:-translate-y-0.5 transition-all duration-300"
          >
            Explorer la Collection <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
        </div>
      </div>
    </div>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Hero Video — full-screen autoplay with subtle parallax text exit
═══════════════════════════════════════════════════════════════════════ */
function HeroSection() {
  const t = useTranslations("Home");
  const [heroMounted, setHeroMounted] = useState(false);
  const [scrolled, setScrolled] = useState(0); // 0→1 as hero exits

  useEffect(() => {
    setHeroMounted(true);
    const handleScroll = () => {
      const windowH = window.innerHeight;
      setScrolled(Math.min(1, window.scrollY / windowH));
    };
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Overlay: 0.15 at top → 0.8 as we scroll away
  const overlayOpacity = heroMounted ? 0.15 + scrolled * 0.65 : 0.15;
  // Content: fade + move up as hero scrolls away
  const contentOpacity = heroMounted ? Math.max(0, 1 - scrolled * 2.5) : 1;
  const contentTranslateY = heroMounted ? scrolled * 60 : 0;
  // Video: parallax — moves at 30% of scroll speed
  const videoTranslateY = heroMounted ? scrolled * 30 : 0;

  return (
    <section className="relative h-[100dvh] min-h-[560px] flex items-center justify-center overflow-hidden bg-black">
      {/* ── Video Layer ── */}
      <div
        suppressHydrationWarning
        className="absolute inset-0 w-full h-full"
        style={{ transform: `translateY(${videoTranslateY}%)` }}
      >
        <video
          src="https://res.cloudinary.com/dc3lyg55d/video/upload/v1775326871/v_fond_principale_myjrd3.mp4"
          autoPlay
          muted
          loop
          playsInline
          preload="metadata"
          className="absolute inset-0 w-full h-full object-cover lg:scale-[1.5]"
        />
      </div>

      {/* ── Overlay ── */}
      <div
        suppressHydrationWarning
        className="absolute inset-0 bg-black pointer-events-none"
        style={{ opacity: overlayOpacity }}
      />

      {/* ── Vignette ── */}
      <div className="absolute inset-0 pointer-events-none">
        <div className="absolute inset-x-0 bottom-0 h-1/3 bg-gradient-to-t from-background/80 to-transparent" />
        <div className="absolute inset-x-0 top-0 h-24 bg-gradient-to-b from-background/30 to-transparent" />
      </div>

      {/* ── Gold accent lines ── */}
      <div className="absolute top-1/4 left-6 sm:left-12 w-[1px] h-16 sm:h-24 bg-gradient-to-b from-transparent via-gold/50 to-transparent pointer-events-none" />
      <div className="absolute top-1/4 right-6 sm:right-12 w-[1px] h-16 sm:h-24 bg-gradient-to-b from-transparent via-gold/50 to-transparent pointer-events-none" />

      {/* ── Content ── */}
      <div
        suppressHydrationWarning
        className="relative z-10 text-center px-5 sm:px-8 max-w-4xl mx-auto w-full"
        style={{
          opacity: contentOpacity,
          transform: `translateY(-${contentTranslateY}px)`,
        }}
      >
        <motion.span
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8, delay: 0.2 }}
          className="inline-block text-gold font-semibold text-[10px] sm:text-sm tracking-[0.2em] uppercase border border-gold/40 px-3 sm:px-6 py-1 sm:py-1.5 rounded-full bg-black/30 backdrop-blur-sm mb-4 sm:mb-8"
        >
          Aura Design
        </motion.span>

        <motion.h1
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.35 }}
          className="font-serif text-[2rem] xs:text-4xl sm:text-5xl md:text-7xl lg:text-8xl font-bold text-white leading-[1.1] tracking-tight mb-4 sm:mb-7"
        >
          {t("heroTitle")}
        </motion.h1>

        <motion.p
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.5 }}
          className="text-white/75 text-sm sm:text-lg lg:text-xl leading-relaxed max-w-[280px] sm:max-w-xl mx-auto mb-6 sm:mb-10"
        >
          {t("heroDesc")}
        </motion.p>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.9, delay: 0.65 }}
          className="flex flex-col xs:flex-row items-center justify-center gap-3 sm:gap-4"
        >
          <Link
            href="/products"
            className="inline-flex items-center gap-2 bg-gold hover:bg-gold/90 text-white font-bold text-sm sm:text-base px-6 sm:px-9 py-3 sm:py-4 rounded-2xl shadow-[0_0_30px_rgba(212,175,55,0.4)] hover:shadow-[0_0_45px_rgba(212,175,55,0.55)] hover:-translate-y-0.5 transition-all duration-300 w-full xs:w-auto justify-center"
          >
            {t("heroBtn")}
            <ArrowRight size={18} className="rtl:rotate-180" />
          </Link>
          <Link
            href="/contact"
            className="inline-flex items-center gap-2 border border-white/30 text-white hover:bg-white/10 backdrop-blur-sm font-semibold text-sm sm:text-base px-6 sm:px-8 py-3 sm:py-4 rounded-2xl transition-all duration-300 w-full xs:w-auto justify-center"
          >
            Contact
          </Link>
        </motion.div>
      </div>

      {/* ── Scroll indicator ── */}
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        transition={{ delay: 1.4, duration: 0.8 }}
        className="absolute bottom-8 left-1/2 -translate-x-1/2 z-10 flex flex-col items-center gap-1 text-white/50"
      >
        <span className="text-[10px] sm:text-xs tracking-[0.2em] uppercase font-medium">
          Scroll
        </span>
        <motion.div
          animate={{ y: [0, 6, 0] }}
          transition={{ repeat: Infinity, duration: 1.6, ease: "easeInOut" }}
        >
          <ChevronDown size={18} className="text-gold/70" />
        </motion.div>
      </motion.div>
    </section>
  );
}

/* ═══════════════════════════════════════════════════════════════════════
   Main Page
═══════════════════════════════════════════════════════════════════════ */
export default function HomePage() {
  const t = useTranslations("Home");
  const [featuredProducts, setFeaturedProducts] = useState<Product[]>([]);

  useEffect(() => {
    async function load() {
      const data = await fetchProducts();
      setFeaturedProducts(data.slice(0, 4));
    }
    load();
  }, []);

  return (
    <div>
      {/* ─── Hero Video ─────────────────────────────────────── */}
      <HeroSection />

      {/* ─── Scroll-Scrub Video (Apple style) ──────────────── */}
      <ScrollScrubVideo />

      {/* ─── Featured Products ──────────────────────────────── */}
      <section className="py-12 sm:py-20 bg-foreground/[0.02]">
        <div className="container mx-auto px-4">
          <div className="mb-8 sm:mb-12 text-center">
            <h2 className="font-serif text-2xl sm:text-4xl font-bold mb-3">
              {t("collection")}
            </h2>
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
              {t("exploreAll")} <ArrowRight size={18} className="rtl:rotate-180" />
            </Link>
          </div>
        </div>
      </section>

      {/* ─── USP Features ───────────────────────────────────── */}
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
              <h3 className="font-serif text-lg sm:text-xl font-bold mb-2 sm:mb-3">
                {t(`features.${feat.titleKey}`)}
              </h3>
              <p className="text-foreground/60 leading-relaxed text-sm sm:text-base">
                {t(`features.${feat.descKey}`)}
              </p>
            </motion.div>
          ))}
        </div>
      </section>
    </div>
  );
}
