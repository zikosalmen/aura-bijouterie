"use client";

import { ShoppingBag, Globe, Menu, X, Home, ShoppingCart, Package } from "lucide-react";
import { useState, useEffect } from "react";
import { useCartStore } from "@/store/cartStore";
import { ThemeToggle } from "@/components/ThemeToggle";
import { Link, usePathname, useRouter } from "@/navigation";
import { useLocale, useTranslations } from "next-intl";
import { motion, AnimatePresence } from "framer-motion";

export default function Header() {
  const [mounted, setMounted] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);
  const totalItems = useCartStore((state) => state.getTotalItems());
  
  const locale = useLocale();
  const router = useRouter();
  const pathname = usePathname();
  const t = useTranslations('Header');

  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMounted(true);
  }, []);

  // Close mobile menu on route change
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setMobileOpen(false);
  }, [pathname]);

  const toggleLang = () => {
    const nextLocale = locale === "fr" ? "ar" : "fr";
    router.replace(pathname, { locale: nextLocale });
  };

  const navItems = [
    { href: "/", label: t('home'), icon: Home },
    { href: "/products", label: t('products'), icon: ShoppingBag },
    { href: "/orders", label: t('orders'), icon: Package },
    { href: "/contact", label: t('contact'), icon: ShoppingCart },
  ];

  return (
    <>
      <header className="sticky top-0 z-50 w-full backdrop-blur-md bg-background/80 border-b border-gold/20 shadow-sm">
        <div className="container mx-auto px-4 h-20 flex items-center justify-between">
          <Link href="/" className="flex items-center gap-2 group">
            <div className="w-10 h-10 rounded-full bg-gold flex items-center justify-center text-white font-serif font-bold text-xl shadow-md transition-transform duration-300 group-hover:scale-110">
              M
            </div>
            <span className="font-serif text-2xl font-bold text-foreground tracking-wide">
              Mezen
            </span>
          </Link>

          {/* Desktop Nav */}
          <nav className="hidden md:flex items-center gap-8 font-medium">
            <Link href="/" className="hover:text-gold transition-colors">{t('home')}</Link>
            <Link href="/products" className="hover:text-gold transition-colors">{t('products')}</Link>
            <Link href="/orders" className="hover:text-gold transition-colors">{t('orders')}</Link>
            <Link href="/contact" className="hover:text-gold transition-colors">{t('contact')}</Link>
          </nav>

          {/* Actions */}
          <div className="flex items-center gap-4">
            <button onClick={toggleLang} className="flex items-center gap-1.5 hover:text-gold transition-colors group">
              <Globe size={18} className="group-hover:rotate-12 transition-transform" />
              <span className="text-sm font-semibold uppercase">{locale}</span>
            </button>
            
            <ThemeToggle />

            <Link href="/cart" className="relative hover:text-gold transition-colors group p-1 z-10">
              <ShoppingBag size={24} className="group-hover:scale-105 transition-transform" />
              {mounted && totalItems > 0 && (
                <span className="absolute -top-1 -right-2 bg-gold text-white text-[10px] font-bold px-[5px] py-[1px] rounded-full shadow-sm min-w-[16px] text-center">
                  {totalItems}
                </span>
              )}
            </Link>

            {/* Mobile Menu Toggle */}
            <button
              onClick={() => setMobileOpen(!mobileOpen)}
              className="md:hidden p-2 rounded-lg hover:bg-foreground/5 transition-colors"
              aria-label="Menu"
            >
              {mobileOpen ? <X size={22} /> : <Menu size={22} />}
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
              className="fixed inset-0 bg-black/50 z-40 md:hidden"
              onClick={() => setMobileOpen(false)}
            />
            <motion.nav
              initial={{ x: locale === "ar" ? "-100%" : "100%" }}
              animate={{ x: 0 }}
              exit={{ x: locale === "ar" ? "-100%" : "100%" }}
              transition={{ type: "spring", damping: 25, stiffness: 200 }}
              className="fixed top-0 right-0 rtl:right-auto rtl:left-0 h-full w-72 bg-background border-l rtl:border-l-0 rtl:border-r border-gold/20 z-50 flex flex-col md:hidden shadow-2xl"
            >
              {/* Header */}
              <div className="p-6 border-b border-gold/20 flex items-center justify-between">
                <span className="font-serif text-xl font-bold">Mezen</span>
                <button onClick={() => setMobileOpen(false)} className="p-1 hover:text-gold transition-colors">
                  <X size={20} />
                </button>
              </div>

              {/* Nav Items */}
              <div className="flex-1 py-6 px-4 space-y-1">
                {navItems.map((item) => (
                  <Link
                    key={item.href}
                    href={item.href}
                    className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/10 hover:text-gold transition-all font-medium"
                  >
                    <item.icon size={20} className="text-gold" />
                    {item.label}
                  </Link>
                ))}

                <Link
                  href="/cart"
                  className="flex items-center gap-3 px-4 py-3 rounded-xl hover:bg-gold/10 hover:text-gold transition-all font-medium"
                >
                  <ShoppingBag size={20} className="text-gold" />
                  {t('cart')}
                  {mounted && totalItems > 0 && (
                    <span className="ml-auto rtl:mr-auto rtl:ml-0 bg-gold text-white text-xs font-bold px-2 py-0.5 rounded-full">
                      {totalItems}
                    </span>
                  )}
                </Link>
              </div>

              {/* Footer */}
              <div className="p-6 border-t border-gold/20 flex items-center justify-between">
                <button onClick={toggleLang} className="flex items-center gap-2 font-semibold hover:text-gold transition-colors">
                  <Globe size={18} />
                  <span className="uppercase">{locale === "fr" ? "العربية" : "Français"}</span>
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
