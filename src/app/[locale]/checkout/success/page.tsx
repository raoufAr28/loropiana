"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { motion } from "framer-motion";

export default function CheckoutSuccessPage() {
  const locale = useLocale();
  
  const title = locale === 'ar' ? "تم تسجيل طلبك بنجاح" : "Commande Enregistrée";
  const desc = locale === 'ar' 
    ? "سنتواصل معك قريبًا لتأكيد الشحن." 
    : "Votre commande a bien été enregistrée. Nous vous contacterons bientôt pour confirmer l'expédition.";
  
  const returnText = locale === 'ar' ? "العودة إلى المتجر" : "Retour à la Boutique";

  return (
    <div className="min-h-[80vh] flex flex-col items-center justify-center p-8 bg-background relative overflow-hidden">
      {/* Decorative Glow elements */}
      <div className="absolute top-[20%] right-[30%] w-96 h-96 bg-gold-DEFAULT/10 dark:bg-gold-light/5 blur-[100px] rounded-full pointer-events-none" />
      <div className="absolute bottom-[10%] left-[20%] w-64 h-64 bg-taupe/20 dark:bg-gold-dark/10 blur-[80px] rounded-full pointer-events-none" />

      <motion.div 
        initial={{ opacity: 0, y: 30, scale: 0.95 }}
        animate={{ opacity: 1, y: 0, scale: 1 }}
        transition={{ duration: 0.8, ease: "easeOut" }}
        className="glass-panel-heavy z-10 p-12 md:p-16 max-w-2xl text-center shadow-luxury"
      >
        <motion.div 
          initial={{ scale: 0 }}
          animate={{ scale: 1 }}
          transition={{ delay: 0.3, type: "spring", stiffness: 200 }}
          className="w-24 h-24 mx-auto border border-foreground/20 dark:border-gold-light/40 rounded-full flex items-center justify-center mb-10 bg-background/50 shadow-inner"
        >
          <svg className="w-10 h-10 text-foreground dark:text-gold-light" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M5 13l4 4L19 7" />
          </svg>
        </motion.div>
        
        <h1 className="text-3xl md:text-5xl font-playfair font-bold uppercase tracking-widest mb-6 leading-tight text-foreground dark:text-gradient">
          {title}
        </h1>
        
        <p className="text-lg text-taupe mb-12 max-w-md mx-auto leading-relaxed">
          {desc}
        </p>
        
        <Link 
          href={`/${locale}/shop`} 
          className="inline-block relative overflow-hidden group bg-foreground text-background font-bold tracking-[0.2em] uppercase text-xs md:text-sm px-10 py-5 transition-transform hover:scale-105"
        >
          <span className="relative z-10 group-hover:text-champagne dark:group-hover:text-gold-light transition-colors">{returnText}</span>
          <div className="absolute inset-0 bg-white/20 dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
        </Link>
      </motion.div>
    </div>
  );
}
