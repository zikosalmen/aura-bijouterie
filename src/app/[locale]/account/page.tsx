"use client";

import { useState } from "react";
import { User, Phone, Lock, Eye, EyeOff } from "lucide-react";
import { useRouter } from "@/navigation";
import { useTranslations } from "next-intl";

export default function AccountPage() {
  const [isLogin, setIsLogin] = useState(true);
  const [showPassword, setShowPassword] = useState(false);
  const router = useRouter();
  const t = useTranslations('Account');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    router.push("/products");
  };

  return (
    <div className="container mx-auto px-4 py-12 flex items-center justify-center min-h-[calc(100vh-80px-300px)]">
      <div className="w-full max-w-md bg-background border border-gold/20 rounded-3xl p-8 shadow-sm hover:shadow-xl transition-all duration-300">
        <div className="text-center mb-8">
          <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mx-auto mb-4">
            <User size={28} className="text-gold" />
          </div>
          <h1 className="font-serif text-3xl font-bold mb-2 tracking-wide">
            {isLogin ? t('welcome') : t('createAccount')}
          </h1>
          <p className="text-foreground/60 text-sm leading-relaxed">
            {isLogin ? t('loginDesc') : t('registerDesc')}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-5">
          {!isLogin && (
            <div className="grid grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">{t('firstName')}</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-3" />
                  <input type="text" required className="w-full bg-foreground/5 border border-transparent rounded-xl pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="John" />
                </div>
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">{t('lastName')}</label>
                <div className="relative">
                  <User size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-3" />
                  <input type="text" required className="w-full bg-foreground/5 border border-transparent rounded-xl pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="Doe" />
                </div>
              </div>
            </div>
          )}

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">{t('phone')}</label>
            <div className="relative">
              <Phone size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-3" />
              <input type="tel" required className="w-full bg-foreground/5 border border-transparent rounded-xl pl-10 pr-4 rtl:pl-4 rtl:pr-10 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="+212 6 00 00 00 00" />
            </div>
          </div>

          <div className="space-y-1.5">
            <label className="text-sm font-semibold text-foreground/80">{t('password')}</label>
            <div className="relative">
              <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-3" />
              <input type={showPassword ? "text" : "password"} required className="w-full bg-foreground/5 border border-transparent rounded-xl pl-10 pr-10 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="••••••••" />
              <button type="button" onClick={() => setShowPassword(!showPassword)} className="absolute right-3 top-1/2 -translate-y-1/2 text-foreground/40 hover:text-gold transition-colors rtl:right-auto rtl:left-3">
                {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
              </button>
            </div>
          </div>

          {!isLogin && (
            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80">{t('verifyPassword')}</label>
              <div className="relative">
                <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-3" />
                <input type={showPassword ? "text" : "password"} required className="w-full bg-foreground/5 border border-transparent rounded-xl pl-10 pr-4 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="••••••••" />
              </div>
            </div>
          )}

          <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-3.5 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mt-4">
            {isLogin ? t('loginBtn') : t('registerBtn')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm">
          <p className="text-foreground/60">
            {isLogin ? t('newToMezen') : t('alreadyHaveAccount')}
            <button onClick={() => setIsLogin(!isLogin)} className="ml-2 rtl:mr-2 rtl:ml-0 font-bold text-gold hover:text-gold-dark hover:underline transition-all">
              {isLogin ? t('createAccountBtn') : t('loginLink')}
            </button>
          </p>
        </div>
      </div>
    </div>
  );
}
