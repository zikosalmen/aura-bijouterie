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
  const [hidden, setHidden] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());

  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Header');

  useEffect(() => { setMounted(true); }, []);

  useEffect(() => {
    let lastY = window.scrollY;
    const handleScroll = () => {
      const currentY = window.scrollY;
      setScrolled(currentY > 10);
      // Hide on scroll down (only after 80px), show on scroll up
      if (currentY > lastY && currentY > 80) {
        setHidden(true);
      } else if (currentY < lastY) {
        setHidden(false);
      }
      lastY = currentY;
    };
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
        } ${
          hidden && !mobileOpen ? "-translate-y-full" : "translate-y-0"
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
          <div className="flex items-center gap-1 sm:gap-3 shrink-0">
            {/* Language toggle — visible on all screens */}
            <button
              onClick={toggleLang}
              className="flex items-center gap-1 hover:text-gold transition-colors group px-2 py-1.5 rounded-lg hover:bg-gold/10"
            >
              <Globe size={15} className="group-hover:rotate-12 transition-transform" />
              <span className="text-xs font-bold uppercase">{locale}</span>
            </button>

            <ThemeToggle />

            {/* Cart — visible on all screens */}
            <div className="flex items-center">
              {/* Confirm Order Button (Appears next to the cart) */}
              <AnimatePresence>
                {mounted && totalItems > 0 && (
                  <motion.div
                    initial={{ opacity: 0, x: 20, scale: 0.8 }}
                    animate={{ opacity: 1, x: 0, scale: 1 }}
                    exit={{ opacity: 0, x: 20, scale: 0.8 }}
                    transition={{ duration: 0.2 }}
                    className="mr-2 sm:mr-3 rtl:mr-0 rtl:ml-2 rtl:sm:ml-3"
                  >
                    <Link
  href="/cart"
  className="
    flex items-center gap-1
    bg-green-500 hover:bg-green-600 text-white font-bold
    text-[9px] sm:text-sm
    px-2 sm:px-4
    py-1 sm:py-2
    rounded-lg sm:rounded-xl
    shadow-sm transition-all hover:-translate-y-0.5
    whitespace-nowrap
  "
>
  <span>{locale === "fr" ? "Commander" : "تأكيد الطلب"}</span>
  <ShoppingCart size={10} className="opacity-90 hidden sm:block" />
</Link>
                  </motion.div>
                )}
              </AnimatePresence>
              
            </div>

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
