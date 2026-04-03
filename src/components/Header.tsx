"use client";

import { ShoppingBag, Globe, Menu, X, Home, ShoppingCart, Package, Phone } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Header');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    const handleScroll = () => setScrolled(window.scrollY > 10);
    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  useEffect(() => { setMobileOpen(false); }, [pathname]);

  const toggleLang = () => {
    const nextLocale = locale === "fr" ? "ar" : "fr";
    router.replace(pathname, { locale: nextLocale });
  };

  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/products", label: t('products'), icon: ShoppingBag },
    { href: "/orders", label: t('orders'), icon: Package },
    { href: "/contact", label: t('contact'), icon: Phone },
  ];

  return (
    <>
      <header
        className={`sticky top-0 z-50 w-full transition-all duration-300 ${
          scrolled
            ? "backdrop-blur-md bg-background/90 border-b border-gold/20 shadow-md"
            : "bg-background/70 border-b border-transparent"
        }`}
      >
        <div className="container mx-auto px-3 sm:px-4 h-16 md:h-20 flex items-center justify-between gap-2">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 group shrink-0">
            <div className="relative w-9 h-9 sm:w-11 sm:h-11 overflow-hidden transition-transform duration-300 group-hover:scale-110">
              <img
                src="/aura_logo.png"
                alt="Aura Design Logo"
                className="w-full h-full object-contain"
              />
            </div>
            <span className="font-serif text-lg sm:text-2xl font-bold text-foreground tracking-wide whitespace-nowrap">
              Aura Design
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-6 lg:gap-8 font-medium text-sm lg:text-base">
            {navItems.map((item) => (
              <Link
                key={item.href}
                href={item.href}
                className="hover:text-gold transition-colors whitespace-nowrap"
              >
                {item.label}
              </Link>
            ))}
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-1.5 sm:gap-3 shrink-0">
            {/* Language toggle */}
            <button
              onClick={toggleLang}
              className="hidden sm:flex items-center gap-1 hover:text-gold transition-colors group px-2 py-1 rounded-lg hover:bg-gold/10"
            >
              <Globe size={16} className="group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold uppercase">{locale}</span>
            </button>

            <ThemeToggle />

            {/* Cart */}
            <Link href="/cart" className="relative p-1.5 hover:text-gold transition-colors group">
              <ShoppingBag size={22} className="group-hover:scale-105 transition-transform" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-0.5 -right-1 bg-gold text-white text-[9px] font-bold w-4 h-4 flex items-center justify-center rounded-full shadow-sm">
                  {totalItems > 9 ? "9+" : totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-1.5 rounded-lg hover:bg-foreground/5 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={20} /> : <Menu size={20} />}
            </button>
          </div>
        </div>
      </header>

      {/* Mobile Menu Overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 bg-black/60 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: locale === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 28, stiffness: 220 }}
              className="fixed top-0 right-0 rtl:right-auto rtl:left-0 h-full w-[280px] bg-background border-l rtl:border-l-0 rtl:border-r border-gold/20 z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-5 border-b border-gold/20 flex items-center justify-between">
                <span className="font-serif text-lg font-bold">Aura Design</span>
                <button
                  onClick={() => setMobileOpen(false)}
                  className="p-1.5 hover:text-gold hover:bg-gold/10 rounded-lg transition-colors"
                >
                  <X size={20} />
                </button>
              </div>

              {/* Nav Items */}
              <div className="flex-1 py-4 px-3 space-y-1 overflow-y-auto">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gold/10 hover:text-gold transition-all font-medium text-base"
                  >
                    <item.icon size={20} className="text-gold shrink-0" />
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/cart"
                  className="flex items-center gap-3 px-4 py-3.5 rounded-xl hover:bg-gold/10 hover:text-gold transition-all font-medium text-base"
                >
                  <ShoppingBag size={20} className="text-gold shrink-0" />
                  {t('cart')}
                  {mounted && totalItems > 0 && (
                    <span className="ml-auto rtl:mr-auto rtl:ml-0 bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {/* Footer */}
              <div className="p-5 border-t border-gold/20 flex items-center justify-between">
                <button
                  onClick={toggleLang}
                  className="flex items-center gap-2 font-semibold hover:text-gold transition-colors text-sm"
                >
                  <Globe size={16} />
                  <span className="uppercase">{locale === "fr" ? "AR العربية" : "FR Français"}</span>
                </button>
                <ThemeToggle />
              </div>
            </motion.nav>
          </>
        )}
      </AnimatePresence>
    </>
  );
}
