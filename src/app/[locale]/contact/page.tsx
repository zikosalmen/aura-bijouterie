"use client";

import { MapPin, Phone, Mail, Clock, Send, CheckCircle, Loader2, AlertCircle } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { useEffect, useState } from "react";
import { useUserStore } from "@/store/userStore";

type FormState = "idle" | "loading" | "success" | "error";

export default function ContactPage() {
  const t = useTranslations("Contact");
  const locale = useLocale();
  const { user } = useUserStore();

  const [mounted, setMounted] = useState(false);
  const [nom, setNom] = useState("");
  const [email, setEmail] = useState("");
  const [phone, setPhone] = useState("");
  const [message, setMessage] = useState("");
  const [formState, setFormState] = useState<FormState>("idle");
  const [errorMsg, setErrorMsg] = useState("");
  const [fieldErrors, setFieldErrors] = useState<{
    nom?: string;
    email?: string;
    phone?: string;
    message?: string;
  }>({});

  // Auto-fill from previous order (userStore persisted in localStorage)
  useEffect(() => {
    setMounted(true);
    if (user) {
      setNom(`${user.prenom} ${user.nom}`);
      setPhone(user.phone);
    }
  }, [user]);

  if (!mounted) return null;

  function validate(): boolean {
    const errors: typeof fieldErrors = {};
    if (!nom.trim() || nom.trim().length < 2) errors.nom = t("validation.nameRequired");
    if (!email.trim() || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.trim()))
      errors.email = t("validation.emailInvalid");
    if (phone && !/^\+?[0-9\s\-()]{7,20}$/.test(phone.trim()))
      errors.phone = t("validation.phoneInvalid");
    if (!message.trim() || message.trim().length < 5)
      errors.message = t("validation.messageRequired");
    setFieldErrors(errors);
    return Object.keys(errors).length === 0;
  }

  async function handleSubmit(e: React.FormEvent) {
    e.preventDefault();
    if (!validate()) return;
    setFormState("loading");
    setErrorMsg("");

    try {
      const res = await fetch("/api/contact", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          nom: nom.trim(),
          email: email.trim(),
          phone: phone.trim(),
          message: message.trim(),
          locale,
        }),
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.error || "Erreur inconnue");
      setFormState("success");
      // Reset non-prefilled fields
      setMessage("");
      setEmail("");
    } catch (err) {
      setFormState("error");
      setErrorMsg(err instanceof Error ? err.message : "Erreur réseau.");
    }
  }

  const inputBase =
    "w-full bg-background border rounded-xl px-4 py-3 placeholder:text-foreground/30 focus:ring-2 outline-none transition-all text-sm";
  const inputNormal = "border-transparent focus:border-gold/30 focus:ring-gold/20";
  const inputError = "border-red-400 focus:ring-red-400/30";

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-12 lg:gap-24">

        {/* ── Left: Infos ── */}
        <div className="space-y-8">
          <div>
            <h1 className="font-serif text-4xl md:text-5xl font-bold mb-4 tracking-wide rtl:text-right">
              {t("title")}
            </h1>
            <p className="text-foreground/70 text-lg leading-relaxed max-w-lg rtl:text-right">
              {t("subtitle")}
            </p>
          </div>

          <div className="space-y-6">
            {[
              { icon: MapPin, title: t("shopTitle"), content: t("shopAddress") },
              {
                icon: Phone,
                title: t("phoneTitle"),
                content: "+212 6 00 00 00 00",
                href: "tel:+21260000000",
              },
              {
                icon: Mail,
                title: t("emailTitle"),
                content: "auramezen@gmail.com",
                href: "mailto:auramezen@gmail.com",
              },
              { icon: Clock, title: t("hoursTitle"), content: t("hours") },
            ].map((item) => (
              <div
                key={item.title}
                className="flex items-start gap-4 rtl:flex-row-reverse group"
              >
                <div className="w-12 h-12 rounded-full bg-gold/10 group-hover:bg-gold/20 flex items-center justify-center shrink-0 transition-colors">
                  <item.icon className="text-gold" size={24} />
                </div>
                <div className="rtl:text-right">
                  <h3 className="font-bold text-lg mb-1">{item.title}</h3>
                  {item.href ? (
                    <a
                      href={item.href}
                      className="text-foreground/70 hover:text-gold transition-colors leading-relaxed"
                    >
                      {item.content}
                    </a>
                  ) : (
                    <p className="text-foreground/70 leading-relaxed whitespace-pre-line">
                      {item.content}
                    </p>
                  )}
                </div>
              </div>
            ))}
          </div>

          {/* Social links */}
          <div className="flex gap-4 rtl:justify-end">
            <a
              href="https://www.instagram.com/bijouterie.ayedi/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Instagram"
              className="w-12 h-12 rounded-full bg-gold/10 hover:bg-gold hover:text-white flex items-center justify-center text-gold hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <rect width="20" height="20" x="2" y="2" rx="5" ry="5"/>
                <path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/>
                <line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/>
              </svg>
            </a>
            <a
              href="https://www.facebook.com/bijouterie.sofien/"
              target="_blank"
              rel="noopener noreferrer"
              aria-label="Facebook"
              className="w-12 h-12 rounded-full bg-gold/10 hover:bg-gold hover:text-white flex items-center justify-center text-gold hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm"
            >
              <svg xmlns="http://www.w3.org/2000/svg" width="22" height="22" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round">
                <path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/>
              </svg>
            </a>
          </div>

          {/* Auto-fill notice */}
          {user && (
            <div className="flex items-center gap-2 bg-gold/10 border border-gold/20 rounded-xl px-4 py-3 text-sm text-foreground/70">
              <CheckCircle size={16} className="text-gold shrink-0" />
              <span>{t("autoFillNotice", { name: user.prenom })}</span>
            </div>
          )}
        </div>

        {/* ── Right: Form ── */}
        <div className="bg-foreground/5 rounded-3xl p-6 md:p-8 border border-gold/10">
          <h2 className="font-serif text-2xl font-bold mb-6 rtl:text-right">
            {t("formTitle")}
          </h2>

          {formState === "success" ? (
            <div className="flex flex-col items-center justify-center py-16 gap-5 text-center">
              <div className="w-20 h-20 rounded-full bg-green-100 dark:bg-green-900/30 flex items-center justify-center">
                <CheckCircle size={44} className="text-green-500" />
              </div>
              <h3 className="font-serif text-xl font-bold">{t("successTitle")}</h3>
              <p className="text-foreground/60 text-sm max-w-xs leading-relaxed">
                {t("successDesc")}
              </p>
              <button
                onClick={() => setFormState("idle")}
                className="mt-2 text-gold hover:underline text-sm font-medium"
              >
                {t("sendAnother")}
              </button>
            </div>
          ) : (
            <form className="space-y-5" onSubmit={handleSubmit} noValidate>
              {/* Name */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">
                  {t("nameLabel")} <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-nom"
                  type="text"
                  autoComplete="name"
                  value={nom}
                  onChange={(e) => {
                    setNom(e.target.value);
                    if (fieldErrors.nom) setFieldErrors((p) => ({ ...p, nom: undefined }));
                  }}
                  placeholder="Mohamed Alami"
                  className={`${inputBase} ${fieldErrors.nom ? inputError : inputNormal}`}
                />
                {fieldErrors.nom && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.nom}
                  </p>
                )}
              </div>

              {/* Email */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">
                  {t("emailLabel")} <span className="text-red-400">*</span>
                </label>
                <input
                  id="contact-email"
                  type="email"
                  autoComplete="email"
                  value={email}
                  onChange={(e) => {
                    setEmail(e.target.value);
                    if (fieldErrors.email) setFieldErrors((p) => ({ ...p, email: undefined }));
                  }}
                  placeholder="email@exemple.com"
                  className={`${inputBase} ${fieldErrors.email ? inputError : inputNormal}`}
                />
                {fieldErrors.email && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.email}
                  </p>
                )}
              </div>

              {/* Phone */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">
                  {t("phoneLabel")}
                </label>
                <input
                  id="contact-phone"
                  type="tel"
                  autoComplete="tel"
                  value={phone}
                  onChange={(e) => {
                    setPhone(e.target.value);
                    if (fieldErrors.phone) setFieldErrors((p) => ({ ...p, phone: undefined }));
                  }}
                  placeholder="+212 6..."
                  className={`${inputBase} ${fieldErrors.phone ? inputError : inputNormal}`}
                />
                {fieldErrors.phone && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.phone}
                  </p>
                )}
              </div>

              {/* Message */}
              <div className="space-y-1.5">
                <label className="text-sm font-semibold text-foreground/80">
                  {t("messageLabel")} <span className="text-red-400">*</span>
                </label>
                <textarea
                  id="contact-message"
                  required
                  rows={5}
                  value={message}
                  onChange={(e) => {
                    setMessage(e.target.value);
                    if (fieldErrors.message) setFieldErrors((p) => ({ ...p, message: undefined }));
                  }}
                  placeholder={t("messagePlaceholder")}
                  className={`${inputBase} resize-none ${fieldErrors.message ? inputError : inputNormal}`}
                />
                {fieldErrors.message && (
                  <p className="text-red-400 text-xs flex items-center gap-1">
                    <AlertCircle size={12} /> {fieldErrors.message}
                  </p>
                )}
              </div>

              {/* Server error */}
              {formState === "error" && errorMsg && (
                <div className="flex items-start gap-2 bg-red-50 dark:bg-red-900/20 border border-red-300/40 rounded-xl px-4 py-3 text-red-600 dark:text-red-400 text-sm">
                  <AlertCircle size={16} className="shrink-0 mt-0.5" />
                  <span>{errorMsg}</span>
                </div>
              )}

              <button
                id="contact-submit-btn"
                type="submit"
                disabled={formState === "loading"}
                className="w-full bg-gold hover:bg-gold-dark disabled:opacity-70 disabled:cursor-not-allowed text-white font-bold py-4 rounded-xl shadow-md hover:shadow-lg hover:-translate-y-1 transition-all duration-300 mt-4 flex items-center justify-center gap-2"
              >
                {formState === "loading" ? (
                  <>
                    <Loader2 size={18} className="animate-spin" />
                    {t("sending")}
                  </>
                ) : (
                  <>
                    {t("sendBtn")} <Send size={18} className="rtl:rotate-180" />
                  </>
                )}
              </button>
            </form>
          )}
        </div>
      </div>
    </div>
  );
}
