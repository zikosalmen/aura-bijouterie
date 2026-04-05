"use client";

import { useEffect, useState } from "react";
import { useTranslations, useLocale } from "next-intl";
import { useOrderStore, type Order } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";
import {
  Package,
  ChevronDown,
  ChevronUp,
  Clock,
  CheckCircle,
  XCircle,
  ShoppingBag,
  Calendar,
  Hash,
} from "lucide-react";
import { Link } from "@/navigation";

// ─── Status badge ─────────────────────────────────────────────────────────────
function StatusBadge({ status }: { status: Order["status"] }) {
  const t = useTranslations("Orders");
  const map = {
    pending:   { icon: Clock,         color: "text-amber-500  bg-amber-50  dark:bg-amber-900/20  border-amber-200/60",  label: t("status.pending")   },
    confirmed: { icon: CheckCircle,   color: "text-green-500  bg-green-50  dark:bg-green-900/20  border-green-200/60",  label: t("status.confirmed") },
    cancelled: { icon: XCircle,       color: "text-red-400    bg-red-50    dark:bg-red-900/20    border-red-200/60",    label: t("status.cancelled") },
  };
  const { icon: Icon, color, label } = map[status];
  return (
    <span className={`inline-flex items-center gap-1.5 text-xs font-semibold px-3 py-1 rounded-full border ${color}`}>
      <Icon size={12} /> {label}
    </span>
  );
}

// ─── Single order card ────────────────────────────────────────────────────────
function OrderCard({ order, index }: { order: Order; index: number }) {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const [expanded, setExpanded] = useState(index === 0); // first open by default

  const date = new Date(order.createdAt);
  const dateStr = date.toLocaleDateString(locale === "ar" ? "ar-MA" : "fr-MA", {
    day: "2-digit", month: "long", year: "numeric",
  });
  const timeStr = date.toLocaleTimeString(locale === "ar" ? "ar-MA" : "fr-MA", {
    hour: "2-digit", minute: "2-digit",
  });

  return (
    <div className="bg-background border border-gold/15 rounded-2xl overflow-hidden shadow-sm hover:border-gold/35 hover:shadow-md transition-all duration-300">
      {/* ── Header (always visible) */}
      <button
        onClick={() => setExpanded(!expanded)}
        className="w-full flex items-center justify-between gap-4 px-5 py-4 text-left group"
        aria-expanded={expanded}
      >
        <div className="flex items-center gap-4 flex-wrap">
          {/* Order number */}
          <div className="flex items-center gap-1.5 text-foreground/50 text-xs font-mono">
            <Hash size={12} />
            <span>{order.dbId ?? order.id.slice(-6)}</span>
          </div>

          {/* Date */}
          <div className="flex items-center gap-1.5 text-foreground/60 text-sm">
            <Calendar size={14} className="text-gold shrink-0" />
            <span>{dateStr} · {timeStr}</span>
          </div>

          {/* Status */}
          <StatusBadge status={order.status} />
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <span className="font-bold text-xl text-gold">
            {formatPrice(order.totalMad, locale)}
          </span>
          <span className="text-foreground/40 group-hover:text-foreground/70 transition-colors">
            {expanded ? <ChevronUp size={18} /> : <ChevronDown size={18} />}
          </span>
        </div>
      </button>

      {/* ── Expanded detail */}
      {expanded && (
        <div className="border-t border-gold/10 px-5 pb-5 pt-4 space-y-4 animate-in fade-in slide-in-from-top-1 duration-200">
          {/* Customer info */}
          <div className="flex flex-wrap gap-6 text-sm text-foreground/70 bg-foreground/5 rounded-xl px-4 py-3">
            <span>
              <span className="font-semibold text-foreground">{t("detail.client")} : </span>
              {order.prenom} {order.nom}
            </span>
            <span>
              <span className="font-semibold text-foreground">{t("detail.phone")} : </span>
              {order.phone}
            </span>
          </div>

          {/* Items table */}
          <div className="overflow-x-auto rounded-xl border border-gold/10">
            <table className="w-full text-sm">
              <thead>
                <tr className="bg-foreground/5 text-foreground/50 text-xs uppercase tracking-widest">
                  <th className="px-4 py-3 text-left rtl:text-right">{t("detail.ref")}</th>
                  <th className="px-4 py-3 text-center">{t("detail.weight")}</th>
                  <th className="px-4 py-3 text-center">{t("detail.qty")}</th>
                  <th className="px-4 py-3 text-right rtl:text-left">{t("detail.total")}</th>
                </tr>
              </thead>
              <tbody>
                {order.items.map((item, i) => (
                  <tr key={i} className="border-t border-gold/8 hover:bg-gold/5 transition-colors">
                    <td className="px-4 py-3 font-mono font-bold text-gold tracking-wider">
                      {item.reference}
                    </td>
                    <td className="px-4 py-3 text-center text-foreground/60">
                      {item.weightGrams}g
                    </td>
                    <td className="px-4 py-3 text-center">
                      <span className="inline-flex items-center justify-center w-8 h-8 rounded-full bg-foreground/8 font-semibold text-sm">
                        {item.quantity}
                      </span>
                    </td>
                    <td className="px-4 py-3 text-right rtl:text-left font-semibold text-gold">
                      {formatPrice(item.itemTotal, locale)}
                    </td>
                  </tr>
                ))}
              </tbody>
              <tfoot>
                <tr className="border-t border-gold/20 bg-gold/5">
                  <td colSpan={3} className="px-4 py-3 font-bold text-right rtl:text-left pr-8 text-foreground/60 text-xs uppercase tracking-widest">
                    {t("detail.grandTotal")}
                  </td>
                  <td className="px-4 py-3 text-right rtl:text-left font-bold text-2xl text-gold">
                    {formatPrice(order.totalMad, locale)}
                  </td>
                </tr>
              </tfoot>
            </table>
          </div>
        </div>
      )}
    </div>
  );
}

// ─── Main Orders Page ─────────────────────────────────────────────────────────
export default function OrdersPage() {
  const t = useTranslations("Orders");
  const { orders } = useOrderStore();
  const [mounted, setMounted] = useState(false);

  useEffect(() => { setMounted(true); }, []);
  if (!mounted) return null;

  return (
    <div className="container mx-auto px-4 py-8 md:py-16 min-h-[60vh]">
      {/* Title */}
      <div className="mb-8 md:mb-12 flex flex-col md:flex-row md:items-end justify-between gap-4">
        <div>
          <h1 className="font-serif text-3xl md:text-5xl font-bold tracking-wide rtl:text-right">
            {t("title")}
          </h1>
          {orders.length > 0 && (
            <p className="text-foreground/50 mt-2 text-sm">
              {orders.length} {t("ordersCount")}
            </p>
          )}
        </div>

        {orders.length > 0 && (
          <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-foreground/70 shrink-0">
            <ShoppingBag size={14} className="text-gold" />
            <span>{t("cacheNotice")}</span>
          </div>
        )}
      </div>

      {/* Empty state */}
      {orders.length === 0 ? (
        <div className="bg-background border border-gold/10 rounded-3xl p-8 flex flex-col items-center justify-center py-24 gap-6">
          <div className="w-24 h-24 rounded-full bg-gold/10 flex items-center justify-center">
            <Package size={44} className="text-gold/60" />
          </div>
          <div className="text-center">
            <h2 className="text-xl font-bold font-serif mb-2">{t("noOrders")}</h2>
            <p className="text-foreground/60 max-w-md leading-relaxed">{t("noOrdersDesc")}</p>
          </div>
          <Link
            href="/products"
            className="mt-2 bg-gold hover:bg-gold-dark text-white font-bold px-8 py-3.5 rounded-xl transition-all hover:-translate-y-0.5 hover:shadow-lg"
          >
            {t("exploreBtn")}
          </Link>
        </div>
      ) : (
        <div className="space-y-4">
          {orders.map((order, i) => (
            <OrderCard key={order.id} order={order} index={i} />
          ))}
        </div>
      )}
    </div>
  );
}
