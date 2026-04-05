"use client";

import Image from "next/image";
import { useCartStore } from "@/store/cartStore";
import { useUserStore } from "@/store/userStore";
import { useOrderStore } from "@/store/orderStore";
import { formatPrice } from "@/lib/utils";
import {
  Trash2,
  Plus,
  Minus,
  ArrowRight,
  ShoppingBag,
  X,
  Send,
  CheckCircle,
  Loader2,
  User,
  Phone,
  AlertCircle,
} from "lucide-react";
import { useEffect, useState, useCallback } from "react";
import { useTranslations, useLocale } from "next-intl";
import { Link } from "@/navigation";

// ─── Checkout Modal ──────────────────────────────────────────────────────────
type ModalState = "idle" | "loading" | "success" | "error";

interface CheckoutModalProps {
  onClose: () => void;
  onSuccess: () => void;
  total: number;
}

function CheckoutModal({ onClose, onSuccess, total }: CheckoutModalProps) {
  const t = useTranslations("Cart");
  const locale = useLocale();
  const { user, setUser } = useUserStore();
  const { items, clearCart } = useCartStore();
  const { browserUuid } = useUserStore();
  const { addOrder } = useOrderStore();

  const [prenom, setPrenom] = useState(user?.prenom || "");
  const [nom, setNom] = useState(user?.nom || "");
  const [phone, setPhone] = useState(user?.phone || "");
  const [state, setState] = useState<ModalState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    prenom?: string;
    nom?: string;
    phone?: string;
  }>({});

  const isReturning = !!user;

  // Validate fields
  function validate(): boolean {
    const errors: typeof fieldErrors = {};
    if (!prenom.trim() || prenom.trim().length < 2)
      errors.prenom = t("validation.prenomRequired");
    if (!nom.trim() || nom.trim().length < 2)
      errors.nom = t("validation.nomRequired");
    if (!/^\+?[0-9\s\-()]{7,20}$/.test(phone.trim()))
      errors.phone = t("validation.phoneInvalid");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  const handleSubmit = useCallback(
    async (e: React.FormEvent) => {
      e.preventDefault();
      if (!validate()) return;
      setState("loading");
      setErrorMsg("");

      const payload = {
        prenom: prenom.trim(),
        nom: nom.trim(),
        phone: phone.trim(),
        locale,
        browserUuid,
        items: items.map((item) => ({
          reference: item.product.reference,
          quantity: item.quantity,
          pricePerGram: item.product.pricePerGram,
          weightGrams: item.product.weightGrams,
        })),
      };

      try {
        const res = await fetch("/api/order", {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(payload),
        });
        const data = await res.json();
        if (!res.ok) throw new Error(data.error || "Erreur inconnue");

        // Persist user info
        setUser({ prenom: prenom.trim(), nom: nom.trim(), phone: phone.trim() });

        // ✅ Sauvegarder la commande en localStorage (cache browser)
        addOrder({
          prenom: prenom.trim(),
          nom: nom.trim(),
          phone: phone.trim(),
          locale,
          dbId: data.orderId ?? undefined,
          items: items.map((item) => ({
            reference:    item.product.reference,
            quantity:     item.quantity,
            weightGrams:  item.product.weightGrams,
            pricePerGram: item.product.pricePerGram,
            itemTotal:    item.product.weightGrams * item.product.pricePerGram * item.quantity,
          })),
          totalMad: total,
        });

        setState("success");
        clearCart();
        setTimeout(() => {
          onSuccess();
          onClose();
        }, 2800);
      } catch (err) {
        setState("error");
        setErrorMsg(err instanceof Error ? err.message : "Erreur réseau.");
      }
    },
    // eslint-disable-next-line react-hooks/exhaustive-deps
    [prenom, nom, phone, locale, items]
  );

  // Close on ESC
  useEffect(() => {
    const handler = (e: KeyboardEvent) => {
      if (e.key === "Escape") onClose();
    };
    window.addEventListener("keydown", handler);
    return () => window.removeEventListener("keydown", handler);
  }, [onClose]);

  const inputBase =
    "w-full bg-background border rounded-xl px-4 py-3 placeholder:text-foreground/30 outline-none transition-all text-sm focus:ring-2";

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center p-4"
      aria-modal="true"
      role="dialog"
      aria-labelledby="checkout-modal-title"
    >
      {/* Backdrop */}
      <div
        className="absolute inset-0 bg-black/60 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* Panel */}
      <div className="relative w-full max-w-md bg-background border border-gold/20 rounded-3xl shadow-2xl overflow-hidden animate-in fade-in zoom-in-95 duration-200">
        {/* Header */}
        <div className="bg-gradient-to-r from-amber-900/20 via-gold/10 to-amber-900/20 border-b border-gold/15 px-6 py-5 flex items-center justify-between">
          <h2
            id="checkout-modal-title"
            className="font-serif text-xl font-bold tracking-wide"
          >
            {t("modalTitle")}
          </h2>
          <button
            onClick={onClose}
            className="p-2 rounded-full hover:bg-foreground/10 transition-colors text-foreground/60 hover:text-foreground"
            aria-label="Fermer"
          >
            <X size={20} />
          </button>
        </div>

        {/* Content */}
        <div className="p-6">
          {state === "success" ? (
            <div className="flex flex-col items-center justify-center py-8 text-center gap-4">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle size={44} className="text-green-500" />
              </div>
              <h3 className="font-serif text-2xl font-bold text-foreground">
                {t("successTitle")}
              </h3>
              <p className="text-foreground/60 text-sm leading-relaxed max-w-xs">
                {t("successDesc")}
              </p>
            </div>
          ) : (
            <>
              {/* Returning user badge */}
              {isReturning && (
                <div className="mb-4 flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-2.5 text-sm text-foreground/70">
                  <User size={16} className="text-gold shrink-0" />
                  <span>{t("returningUser", { name: user!.prenom })}</span>
                </div>
              )}

              {/* Order summary mini */}
              <div className="mb-5 bg-foreground/5 rounded-xl p-4 border border-gold/10">
                <p className="text-xs text-foreground/50 mb-2 uppercase tracking-widest">
                  {t("orderSummaryLabel")}
                </p>
                <div className="flex justify-between items-center">
                  <span className="text-sm text-foreground/70">
                    {items.length} {t("itemsLabel")}
                  </span>
                  <span className="font-bold text-xl text-gold">
                    {formatPrice(total, locale)}
                  </span>
                </div>
              </div>

              <form onSubmit={handleSubmit} className="space-y-4" noValidate>
                {/* Prenom */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-foreground/80">
                    {t("prenomLabel")} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-prenom"
                    type="text"
                    autoComplete="given-name"
                    value={prenom}
                    onChange={(e) => {
                      setPrenom(e.target.value);
                      if (fieldErrors.prenom) setFieldErrors((p) => ({ ...p, prenom: undefined }));
                    }}
                    placeholder="Mohamed"
                    className={`${inputBase} ${
                      fieldErrors.prenom
                        ? "border-red-400 focus:ring-red-400/30"
                        : "border-transparent focus:border-gold/30 focus:ring-gold/20"
                    }`}
                  />
                  {fieldErrors.prenom && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.prenom}
                    </p>
                  )}
                </div>

                {/* Nom */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-foreground/80">
                    {t("nomLabel")} <span className="text-red-400">*</span>
                  </label>
                  <input
                    id="checkout-nom"
                    type="text"
                    autoComplete="family-name"
                    value={nom}
                    onChange={(e) => {
                      setNom(e.target.value);
                      if (fieldErrors.nom) setFieldErrors((p) => ({ ...p, nom: undefined }));
                    }}
                    placeholder="Alami"
                    className={`${inputBase} ${
                      fieldErrors.nom
                        ? "border-red-400 focus:ring-red-400/30"
                        : "border-transparent focus:border-gold/30 focus:ring-gold/20"
                    }`}
                  />
                  {fieldErrors.nom && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.nom}
                    </p>
                  )}
                </div>

                {/* Phone */}
                <div className="space-y-1">
                  <label className="text-sm font-semibold text-foreground/80">
                    {t("phoneLabel")} <span className="text-red-400">*</span>
                  </label>
                  <div className="relative">
                    <Phone
                      size={16}
                      className="absolute left-4 top-1/2 -translate-y-1/2 text-foreground/40 rtl:left-auto rtl:right-4"
                    />
                    <input
                      id="checkout-phone"
                      type="tel"
                      autoComplete="tel"
                      value={phone}
                      onChange={(e) => {
                        setPhone(e.target.value);
                        if (fieldErrors.phone)
                          setFieldErrors((p) => ({ ...p, phone: undefined }));
                      }}
                      placeholder="+212 6 00 00 00 00"
                      className={`${inputBase} pl-10 rtl:pl-4 rtl:pr-10 ${
                        fieldErrors.phone
                          ? "border-red-400 focus:ring-red-400/30"
                          : "border-transparent focus:border-gold/30 focus:ring-gold/20"
                      }`}
                    />
                  </div>
                  {fieldErrors.phone && (
                    <p className="text-red-400 text-xs flex items-center gap-1">
                      <AlertCircle size={12} /> {fieldErrors.phone}
                    </p>
                  )}
                </div>

                {/* Server error */}
                {state === "error" && errorMsg && (
                  <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-300/40 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                    <AlertCircle size={16} className="shrink-0 mt-0.5" />
                    <span>{errorMsg}</span>
                  </div>
                )}

                {/* Submit */}
                <button
                  id="checkout-submit-btn"
                  type="submit"
                  disabled={state === "loading"}
                  className="w-full bg-gold hover:bg-gold-dark disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-0.5 transition-all duration-300 flex items-center justify-center gap-2 mt-2"
                >
                  {state === "loading" ? (
                    <>
                      <Loader2 size={20} className="animate-spin" />
                      {t("sending")}
                    </>
                  ) : (
                    <>
                      <Send size={18} />
                      {t("checkout")}
                    </>
                  )}
                </button>
              </form>
            </>
          )}
        </div>
      </div>
    </div>
  );
}

// ─── Main Cart Page ──────────────────────────────────────────────────────────
export default function CartPage() {
  const { items, removeItem, updateQuantity, getTotalPrice } = useCartStore();
  const t = useTranslations("Cart");
  const locale = useLocale();

  const [mounted, setMounted] = useState(false);
  const [showModal, setShowModal] = useState(false);
  const [orderSuccess, setOrderSuccess] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  const total = getTotalPrice();

  return (
    <>
      {showModal && (
        <CheckoutModal
          onClose={() => setShowModal(false)}
          onSuccess={() => setOrderSuccess(true)}
          total={total}
        />
      )}

      <div className="container mx-auto px-4 py-8 md:py-16">
        <h1 className="font-serif text-3xl md:text-5xl font-bold mb-8 md:mb-12 tracking-wide text-center md:text-left rtl:md:text-right">
          {t("title")}
        </h1>

        {/* Success banner */}
        {orderSuccess && (
          <div className="mb-8 flex items-center gap-3 bg-green-50 dark:bg-green-900/20 border border-green-300/50 text-green-700 dark:text-green-400 rounded-2xl px-6 py-4">
            <CheckCircle size={22} className="shrink-0" />
            <p className="font-medium">{t("successBanner")}</p>
          </div>
        )}

        {items.length === 0 ? (
          <div className="flex flex-col items-center justify-center py-20 bg-foreground/5 rounded-3xl border border-gold/10">
            <ShoppingBag size={64} className="text-gold mb-6" />
            <p className="text-xl md:text-2xl font-serif mb-6 text-foreground/70">
              {t("empty")}
            </p>
            <Link
              href="/products"
              className="bg-gold hover:bg-gold-dark text-white px-8 py-4 rounded-xl font-bold transition-colors inline-flex items-center gap-2"
            >
              {t("explore")} <ArrowRight size={20} className="rtl:rotate-180" />
            </Link>
          </div>
        ) : (
          <div className="flex flex-col lg:flex-row gap-12">
            {/* Cart Items */}
            <div className="lg:w-2/3 space-y-6">
              {items.map((item) => {
                const totalItemPriceText = formatPrice(
                  item.product.weightGrams * item.product.pricePerGram * item.quantity
                );
                return (
                  <div
                    key={item.product.id}
                    className="flex gap-4 md:gap-6 bg-background border border-gold/10 p-4 md:p-6 rounded-2xl shadow-sm relative group hover:border-gold/30 transition-all"
                  >
                    <div className="relative w-24 h-24 md:w-32 md:h-32 bg-foreground/5 rounded-xl overflow-hidden shrink-0">
                      <Image
                        src={item.product.images[0]}
                        alt={item.product.reference}
                        fill
                        sizes="(max-width: 768px) 100px, 150px"
                        className="object-cover"
                      />
                    </div>

                    <div className="flex-1 flex flex-col justify-between">
                      <div className="flex justify-between items-start gap-4">
                        <div>
                          <div className="flex items-baseline gap-1.5 mb-1">
                            <span className="text-foreground text-sm font-semibold font-mono">
                              Réf:
                            </span>
                            <span className="font-mono font-bold text-2xl tracking-wider text-gold">
                              {item.product.reference}
                            </span>
                          </div>
                          <p className="text-sm text-foreground/60 mt-1">
                            {item.product.weightGrams}g ×{" "}
                            {formatPrice(item.product.pricePerGram, locale)}/g
                          </p>
                        </div>
                        <button
                          onClick={() => removeItem(item.product.id)}
                          className="text-red-400 hover:text-red-500 bg-red-400/10 hover:bg-red-400/20 p-2 rounded-full transition-colors"
                        >
                          <Trash2 size={18} />
                        </button>
                      </div>

                      <div className="flex flex-wrap items-end justify-between gap-4 mt-4">
                        {/* Quantity */}
                        <div className="flex items-center bg-foreground/5 rounded-full p-1 border border-foreground/10">
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity - 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70"
                          >
                            <Minus size={16} />
                          </button>
                          <input
                            type="number"
                            min="1"
                            value={item.quantity || ""}
                            onChange={(e) => {
                              const val = parseInt(e.target.value);
                              if (!isNaN(val) && val > 0)
                                updateQuantity(item.product.id, val);
                            }}
                            className="w-12 bg-transparent text-center font-medium text-base outline-none focus:ring-2 focus:ring-gold/30 rounded"
                          />
                          <button
                            onClick={() =>
                              updateQuantity(item.product.id, item.quantity + 1)
                            }
                            className="w-8 h-8 flex items-center justify-center rounded-full hover:bg-background shadow-sm transition-colors text-foreground/70"
                          >
                            <Plus size={16} />
                          </button>
                        </div>

                        <div className="text-right rtl:text-left">
                          <p className="text-xs text-foreground/50 mb-0.5">
                            {t("itemTotal")}
                          </p>
                          <span className="font-bold text-xl text-gold">
                            {totalItemPriceText}
                          </span>
                        </div>
                      </div>
                    </div>
                  </div>
                );
              })}
            </div>

            {/* Cart Summary */}
            <div className="lg:w-1/3">
              <div className="bg-foreground/5 border border-gold/20 rounded-3xl p-6 md:p-8 sticky top-28">
                <h2 className="font-serif text-2xl font-bold mb-6">
                  {t("summary")}
                </h2>

                <div className="space-y-4 mb-8">
                  <div className="h-px bg-gold/20 w-full my-4" />
                  <div className="flex justify-between items-end">
                    <span className="font-bold text-lg">{t("total")}</span>
                    <span className="font-bold text-3xl text-gold">
                      {formatPrice(total, locale)}
                    </span>
                  </div>
                </div>

                <button
                  id="checkout-btn"
                  onClick={() => setShowModal(true)}
                  className="w-full bg-gold hover:bg-gold-dark text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 flex items-center justify-center gap-2"
                >
                  {t("checkout")} <ArrowRight size={20} className="rtl:rotate-180" />
                </button>

                <p className="text-xs text-foreground/40 text-center mt-4 leading-relaxed">
                  {t("securityInfo")}
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </>
  );
}
