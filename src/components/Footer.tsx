import { Phone, Mail, MapPin } from "lucide-react";
import { useTranslations } from "next-intl";
import { Link } from "@/navigation";

export default function Footer() {
  const t = useTranslations('Footer');

  return (
    <footer className="bg-background border-t border-gold/20 pt-16 pb-8">
      <div className="container mx-auto px-4 grid grid-cols-1 md:grid-cols-4 gap-12 mb-12">
        {/* Brand */}
        <div className="space-y-4">
          <h2 className="font-serif text-2xl font-bold tracking-wide">Mezen Bijouterie</h2>
          <p className="text-sm text-foreground/70 hover:text-foreground transition-colors max-w-sm leading-relaxed">
            {t('aboutText')}
          </p>
        </div>

        {/* Liens Rapides */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg font-serif">{t('linksTitle')}</h3>
          <ul className="space-y-3 text-sm">
            <li><Link href="/products" className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">{t('products')}</Link></li>
            <li><Link href="/cart" className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">{t('cart')}</Link></li>
            <li><Link href="/orders" className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">{t('orders')}</Link></li>
            <li><Link href="/account" className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">{t('account')}</Link></li>
            <li><Link href="/contact" className="hover:text-gold transition-colors inline-block hover:translate-x-1 duration-200">{t('contact')}</Link></li>
          </ul>
        </div>

        {/* Contact */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg font-serif">{t('contactTitle')}</h3>
          <ul className="space-y-4 text-sm">
            <li className="flex items-center gap-3 group w-max">
              <Phone size={18} className="text-gold group-hover:scale-110 transition-transform" />
              <a href="tel:+212600000000" className="hover:text-gold transition-colors">+212 6 00 00 00 00</a>
            </li>
            <li className="flex items-center gap-3 group w-max">
              <Mail size={18} className="text-gold group-hover:scale-110 transition-transform" />
              <a href="mailto:contact@mezen.com" className="hover:text-gold transition-colors">contact@mezen.com</a>
            </li>
            <li className="flex items-start gap-3 group">
              <MapPin size={18} className="text-gold group-hover:scale-110 transition-transform mt-0.5" />
              <span className="leading-relaxed">123 Avenue de l&apos;Élégance,<br />75000 Paris</span>
            </li>
          </ul>
        </div>

        {/* Réseaux Sociaux */}
        <div className="space-y-4">
          <h3 className="font-bold text-lg font-serif">{t('socialTitle')}</h3>
          <div className="flex gap-4">
            <a href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-gold hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-instagram"><rect width="20" height="20" x="2" y="2" rx="5" ry="5"/><path d="M16 11.37A4 4 0 1 1 12.63 8 4 4 0 0 1 16 11.37z"/><line x1="17.5" x2="17.51" y1="6.5" y2="6.5"/></svg>
            </a>
            <a href="#" className="w-10 h-10 rounded-full bg-foreground/5 flex items-center justify-center hover:bg-gold hover:text-white hover:scale-110 hover:-translate-y-1 transition-all duration-300 shadow-sm">
              <svg xmlns="http://www.w3.org/2000/svg" width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className="lucide lucide-facebook"><path d="M18 2h-3a5 5 0 0 0-5 5v3H7v4h3v8h4v-8h3l1-4h-4V7a1 1 0 0 1 1-1h3z"/></svg>
            </a>
          </div>
        </div>
      </div>

      <div className="container mx-auto px-4 border-t border-gold/10 pt-8 flex flex-col md:flex-row items-center justify-between text-xs text-foreground/50">
        <p>© {new Date().getFullYear()} {t('rights')}</p>
        <p className="mt-2 md:mt-0 font-medium">{t('signature')}</p>
      </div>
    </footer>
  );
}
