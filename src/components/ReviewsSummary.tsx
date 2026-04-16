"use client";

import { Star } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";

interface ReviewsSummaryProps {
  rating: number;
  totalReviews: number;
  distribution: {
    [key: number]: number; // 1 to 5 stars, value is the percentage (0-100)
  };
}

export function ReviewsSummary({ rating, totalReviews, distribution }: ReviewsSummaryProps) {
  const t = useTranslations("Reviews");
  const locale = useLocale();
  const isRTL = locale === "ar";

  const LUXURY_BLUE = "#00487A";

  return (
    <section className="mt-24 pt-16 border-t border-gray-100 dark:border-white/5">
      <div className="max-w-4xl mx-auto">
        <div className="flex flex-col md:flex-row justify-between items-start md:items-center mb-12 gap-6">
          <div className={isRTL ? "text-right" : "text-left"}>
            <h2 className="text-3xl md:text-4xl font-playfair font-bold uppercase tracking-widest mb-2">
              {t("title")}
            </h2>
            <p className="text-taupe uppercase tracking-[0.2em] text-xs font-semibold">
              {t("based_on", { count: totalReviews })}
            </p>
          </div>
          <button className="px-8 py-4 border border-foreground/10 dark:border-white/20 rounded-full text-[10px] uppercase font-bold tracking-[0.3em] hover:bg-foreground hover:text-background dark:hover:bg-white dark:hover:text-black transition-all active:scale-95">
            {t("write_review")}
          </button>
        </div>

        <div className="glass-panel-heavy rounded-[2.5rem] p-8 md:p-12 border border-white/10 dark:border-white/5 shadow-2xl relative overflow-hidden group">
          {/* Subtle Background Glow */}
          <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-[#00487A]/5 blur-[100px] rounded-full ${isRTL ? '-translate-x-1/2' : 'translate-x-1/2'} -translate-y-1/2 pointer-events-none`} />
          
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-12 lg:gap-20 items-center relative z-10">
            {/* Overview Column */}
            <div className={`lg:col-span-5 flex flex-col items-center ${isRTL ? 'lg:items-end lg:text-right' : 'lg:items-start lg:text-left'} text-center`}>
              <div className="flex items-baseline gap-2 mb-2">
                <span className="text-7xl md:text-8xl font-playfair font-black text-gradient">
                  {Number(rating).toFixed(1)}
                </span>
                <span className="text-2xl font-playfair text-taupe opacity-50">/ 5</span>
              </div>
              
              <div className="flex gap-1 mb-6">
                {[1, 2, 3, 4, 5].map((s) => (
                  <Star 
                    key={s} 
                    size={24} 
                    fill={s <= Math.round(Number(rating)) ? LUXURY_BLUE : "transparent"} 
                    className={s <= Math.round(Number(rating)) ? "text-[#00487A]" : "text-gray-200 dark:text-gray-800"} 
                  />
                ))}
              </div>
              <p className="text-sm uppercase tracking-[0.3em] font-bold text-taupe">
                {t("average")}
              </p>
            </div>

            {/* Distribution Column */}
            <div className="lg:col-span-7 w-full space-y-4">
              {[5, 4, 3, 2, 1].map((star) => (
                <div key={star} className={`flex items-center gap-4 group/row ${isRTL ? 'flex-row-reverse' : 'flex-row'}`}>
                  <div className={`flex items-center gap-1.5 w-12 flex-shrink-0 ${isRTL ? 'flex-row-reverse' : ''}`}>
                    <span className="text-xs font-bold font-inter group-hover/row:text-[#00487A] transition-colors">{star}</span>
                    <Star size={12} fill="currentColor" className="text-taupe opacity-30" />
                  </div>
                  
                  <div className="flex-1 h-2 bg-gray-100 dark:bg-white/5 rounded-full overflow-hidden relative">
                    <motion.div 
                      initial={{ width: 0 }}
                      whileInView={{ width: `${distribution[star] || 0}%` }}
                      viewport={{ once: true }}
                      transition={{ duration: 1.5, ease: [0.16, 1, 0.3, 1], delay: (5 - star) * 0.1 }}
                      className={`absolute top-0 bottom-0 ${isRTL ? 'right-0' : 'left-0'} rounded-full shadow-[0_0_15px_rgba(0,72,122,0.3)]`}
                      style={{ backgroundColor: LUXURY_BLUE }}
                    />
                  </div>
                  
                  <span className={`text-[10px] font-bold text-taupe w-10 ${isRTL ? 'text-left' : 'text-right'} opacity-50 group-hover/row:opacity-100 transition-opacity`}>
                    {distribution[star] || 0}%
                  </span>
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
