"use client";

import { MapPin, Phone, Mail, Clock, Send } from "lucide-react";
import { useTranslations } from "next-intl";

export default function ContactPage() {
  const t = useTranslations('Contact');

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">
        
        {/* Informations */}
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-wide rtl:text-right">{t('title')}</h1>
            <p className="text-foreground/70 text-lg leading-relaxed max-w-lg rtl:text-right">
              {t('subtitle')}
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: MapPin, title: t('shopTitle'), content: t('shopAddress') },
              { icon: Phone, title: t('phoneTitle'), content: "+212 6 00 00 00 00" },
              { icon: Mail, title: t('emailTitle'), content: "contact@mezen.com" },
              { icon: Clock, title: t('hoursTitle'), content: t('hours') },
            ].map((item) => (
              <div key={item.title} className="flex items-start gap-4 rtl:flex-row-reverse">
                <div className="w-12 h-12 rounded-full bg-gold/10 flex items-center justify-center shrink-0">
                  <item.icon className="text-gold" size={24} />
                </div>
                <div className="rtl:text-right">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  <p className="text-foreground/70 leading-relaxed">{item.content}</p>
                </div>
              </div>
            ))}
          </div>
        </div>

        {/* Formulaire */}
        <div className="bg-foreground/5 rounded-3xl p-8 border border-gold/10">
          <h2 className="font-serif text-2xl font-bold mb-6 rtl:text-right">{t('formTitle')}</h2>
          <form className="space-y-5" onSubmit={(e) => { e.preventDefault(); }}>
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">{t('nameLabel')}</label>
                <input type="text" required className="w-full bg-background border border-transparent rounded-xl px-4 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="Doe" />
              </div>
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">{t('emailLabel')}</label>
                <input type="email" required className="w-full bg-background border border-transparent rounded-xl px-4 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="john@example.com" />
              </div>
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80">{t('phoneLabel')}</label>
              <input type="tel" className="w-full bg-background border border-transparent rounded-xl px-4 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm" placeholder="+212 6..." />
            </div>

            <div className="space-y-1.5">
              <label className="text-sm font-semibold text-foreground/80">{t('messageLabel')}</label>
              <textarea required rows={5} className="w-full bg-background border border-transparent rounded-xl px-4 py-3 placeholder:text-foreground/30 focus:border-gold/30 focus:ring-2 focus:ring-gold/20 outline-none transition-all text-sm resize-none" placeholder={t('messagePlaceholder')}></textarea>
            </div>

            <button type="submit" className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mt-4 flex items-center justify-center gap-2">
              {t('sendBtn')} <Send size={18} className="rtl:rotate-180" />
            </button>
          </form>
        </div>

      </div>
    </div>
  );
}
