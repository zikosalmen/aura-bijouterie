"use client";

import { Package } from "lucide-react";
import { useTranslations } from "next-intl";

export default function OrdersPage() {
  const t = useTranslations('Orders');

  return (
    <div className="container mx-auto px-4 py-12 min-h-[50vh]">
      <h1 className="font-serif text-3xl md:text-5xl font-bold mb-8 tracking-wide text-center md:text-left rtl:md:text-right">
        {t('title')}
      </h1>
      
      <div className="bg-background border border-gold/10 rounded-3xl p-8 shadow-sm flex flex-col items-center justify-center py-20">
        <Package size={64} className="text-gold/50 mb-4" />
        <h2 className="text-xl font-bold font-serif mb-2">{t('noOrders')}</h2>
        <p className="text-foreground/60 text-center max-w-md">
          {t('noOrdersDesc')}
        </p>
      </div>
    </div>
  );
}
