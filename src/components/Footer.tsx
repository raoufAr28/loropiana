"use client";
import { useTranslations } from 'next-intl';
import { useLocale } from 'next-intl';
import { usePathname } from 'next/navigation';
import Link from 'next/link';


export function Footer() {
  const t = useTranslations('Navigation');
  const locale = useLocale();
  const pathname = usePathname();
  const isAdminPage = pathname.includes('/admin');
  if (isAdminPage) return null;

  return (
    <footer className="relative w-full overflow-hidden bg-background text-foreground pt-24 pb-12">
      {/* Decorative Top Glow */}
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-3/4 h-[1px] bg-gradient-to-r from-transparent via-secondary to-transparent opacity-50" />
      <div className="absolute top-0 left-1/2 -translate-x-1/2 w-1/2 h-32 bg-secondary/50 dark:bg-secondary/20 blur-[100px] pointer-events-none" />

      <div className="container relative z-10 mx-auto px-6 lg:px-12 grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-12 lg:gap-8">
        <div className="flex flex-col gap-6">
          <h3 className="font-playfair text-2xl tracking-[0.2em] uppercase text-gradient">Loro Piana</h3>
          <p className="text-sm text-muted-foreground leading-relaxed max-w-sm">
            L'élégance redéfinie. Découvrez notre collection exclusive avec des matériaux nobles et un savoir-faire inégalé.
          </p>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-foreground/80">Liens Rapides</h4>
          <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
            <li><Link href={`/${locale}`} className="hover:text-secondary transition-colors">Accueil</Link></li>
            <li><Link href={`/${locale}/shop`} className="hover:text-secondary transition-colors">Boutique</Link></li>
            <li><Link href={`/${locale}/reviews`} className="hover:text-secondary transition-colors">Reviews</Link></li>
            <li><Link href={`/${locale}/contact`} className="hover:text-secondary transition-colors">Contact</Link></li>
          </ul>
        </div>

        <div>
          <h4 className="font-bold mb-6 uppercase text-xs tracking-widest text-foreground/80">Légal</h4>
          <ul className="flex flex-col gap-4 text-sm text-muted-foreground">
            <li><a href="#" className="hover:text-secondary transition-colors">Politique de confidentialité</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Conditions générales</a></li>
            <li><a href="#" className="hover:text-secondary transition-colors">Livraison & Retours</a></li>
          </ul>
        </div>

        <div className="flex flex-col gap-6">
          <h4 className="font-bold uppercase text-xs tracking-widest text-foreground/80">Newsletter</h4>
          <p className="text-sm text-muted-foreground">Abonnez-vous pour recevoir nos dernières actualités et invitations privées.</p>
        </div>
      </div>

      <div className="container relative z-10 mx-auto px-6 lg:px-12 mt-20 pt-8 border-t border-border/50 flex flex-col md:flex-row justify-between items-center text-xs tracking-widest uppercase text-muted-foreground">
        <span>© {new Date().getFullYear()} Loro Piana. Tous droits réservés.</span>
        <span className="mt-4 md:mt-0 opacity-70">Design Haute Couture</span>
      </div>
    </footer>
  );
}
