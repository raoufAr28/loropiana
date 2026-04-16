"use client";

import { useState } from "react";
import { Star, Calendar, CheckCircle2, ThumbsUp, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import Link from "next/link";

interface Review {
  id: string;
  user?: string;
  full_name?: string;
  date?: string;
  created_at?: string;
  rating: number;
  comment?: string;
  comment_fr?: string;
  comment_ar?: string;
  product_id?: string;
  is_verified?: boolean;
  is_approved?: boolean;
  status?: string;
  helpful_count?: number;
}

interface Product {
  id: string;
  name?: string;
  name_fr?: string;
  name_ar?: string;
  slug: string;
  image_url: string;
}

interface ReviewCardProps {
  review: Review;
  product?: Product;
}

const LUXURY_BLUE = "#00487A";

export function ReviewCard({ review, product }: ReviewCardProps) {
  const t = useTranslations("Reviews");
  const locale = useLocale();
  const isRTL = locale === "ar";
  
  const [helpfulCount, setHelpfulCount] = useState(review.helpful_count || 0);
  const [hasVoted, setHasVoted] = useState(false);

  const initials = (review.user || review.full_name || "??")
    .split(' ')
    .filter(Boolean)
    .map((n: string) => n[0])
    .join('')
    .toUpperCase()
    .substring(0, 2);

  const formattedDate = review.created_at 
    ? new Date(review.created_at).toLocaleDateString(locale === 'fr' ? 'fr-FR' : 'ar-SA', {
        day: 'numeric',
        month: 'long',
        year: 'numeric'
      })
    : (review.date || "");

  const handleHelpful = async () => {
    if (hasVoted) return;
    
    // Optimistic update
    setHelpfulCount(prev => prev + 1);
    setHasVoted(true);

    try {
      const response = await fetch(`/api/reviews/${review.id}/helpful`, {
        method: "POST"
      });

      if (!response.ok) throw new Error("Failed to update");
    } catch (err) {
      console.error("Error updating helpful count:", err);
      // Rollback on error
      setHelpfulCount(prev => (prev > 0 ? prev - 1 : 0));
      setHasVoted(false);
    }
  };

  return (
    <motion.div 
      layout
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true }}
      whileHover={{ y: -8, boxShadow: "0 25px 50px -12px rgba(0, 0, 0, 0.5)" }}
      className="glass-panel-heavy rounded-[2.5rem] p-8 md:p-10 border border-white/10 dark:border-white/5 shadow-xl transition-all group relative overflow-hidden h-full flex flex-col"
    >
      {/* Dynamic Background Glow */}
      <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-40 h-40 bg-[#00487A]/5 blur-[80px] rounded-full pointer-events-none group-hover:bg-[#00487A]/10 transition-colors`} />

      <div className="flex flex-col gap-8 relative z-10 h-full">
        
        {/* Header: User Info & Stars */}
        <div className={`flex flex-col sm:flex-row justify-between items-start sm:items-center gap-6 ${isRTL ? 'sm:flex-row-reverse' : ''}`}>
          <div className={`flex items-center gap-5 ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
            {/* Premium Avatar */}
            <div className="relative">
              <div className="w-16 h-16 rounded-full bg-gradient-to-br from-[#00487A]/20 to-[#00487A]/5 border border-white/10 flex items-center justify-center font-playfair font-black text-xl text-[#00487A] shadow-inner group-hover:scale-110 transition-transform duration-500">
                {initials}
              </div>
              <div className={`absolute -bottom-1 ${isRTL ? '-left-1' : '-right-1'} bg-background dark:bg-slate p-1 rounded-full border border-white/10`}>
                <CheckCircle2 size={16} fill={LUXURY_BLUE} className="text-white" />
              </div>
            </div>
            
            <div className="space-y-1">
               <p className={`font-bold tracking-wide text-lg text-foreground flex items-center gap-2 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 {review.user || review.full_name}
                 {(review.is_verified || review.is_approved || review.status === 'approved') && (
                   <span className="text-[10px] uppercase tracking-[0.2em] font-black text-[#00487A] bg-[#00487A]/10 px-2 py-0.5 rounded-full hidden xs:inline-block">
                      {t("verified")}
                   </span>
                 )}
               </p>
               <div className={`flex items-center gap-3 opacity-50 ${isRTL ? 'flex-row-reverse' : ''}`}>
                 <Calendar size={12} className="text-taupe" />
                 <span className="text-[10px] uppercase tracking-widest font-bold">{formattedDate}</span>
               </div>
            </div>
          </div>
          
          {/* Stars */}
          <div className="flex gap-0.5 bg-foreground/5 dark:bg-white/5 p-2 rounded-2xl border border-white/5">
            {[1, 2, 3, 4, 5].map((s) => (
              <Star 
                key={s} 
                size={16} 
                fill={s <= Number(review.rating) ? LUXURY_BLUE : "transparent"} 
                className={s <= Number(review.rating) ? "text-[#00487A]" : "text-gray-200 dark:text-gray-800"} 
              />
            ))}
          </div>
        </div>

        {/* Comment */}
        <div className="flex-1">
           <p className={`text-xl italic font-playfair leading-[1.8] opacity-90 ${isRTL ? "text-right" : "text-left"} text-foreground`}>
             "{locale === 'fr' ? (review.comment_fr || review.comment) : (review.comment_ar || review.comment)}"
           </p>
        </div>

        {/* Footer: Product Tag & Helpful Interaction */}
        <div className={`pt-8 border-t border-white/5 flex flex-col md:flex-row justify-between items-stretch md:items-center gap-6 mt-auto ${isRTL ? 'md:flex-row-reverse' : ''}`}>
           {product && (
             <div className={`flex items-center gap-5 group/product ${isRTL ? 'flex-row-reverse text-right' : ''}`}>
                <div className="w-14 h-20 rounded-2xl overflow-hidden bg-white/5 border border-white/10 p-1 shadow-2xl">
                   {product.image_url && (
                     <img src={product.image_url} alt={product.name_fr} className="w-full h-full object-cover rounded-xl transition-transform duration-700 group-hover/product:scale-125" />
                   )}
                </div>
                <div className="space-y-1">
                   <p className="text-[10px] uppercase font-bold text-taupe tracking-[0.3em]">Ambassadeur de style</p>
                   <Link href={`/${locale}/product/${product.slug}`} className="font-bold text-base hover:text-[#00487A] transition-colors">
                     {locale === 'fr' ? (product.name_fr || product.name) : (product.name_ar || product.name)}
                   </Link>
                   <p className={`text-[10px] uppercase font-bold text-[#00487A] cursor-pointer hover:underline flex items-center gap-1 group/buy ${isRTL ? 'flex-row-reverse' : ''}`}>
                     {t("buy_now")}
                     <ArrowRight size={10} className={`group-hover/buy:translate-x-1 transition-transform ${isRTL ? "rotate-180" : ""}`} />
                   </p>
                </div>
             </div>
           )}
           
           <div className={`flex items-center gap-4 ${isRTL ? 'flex-row-reverse' : ''}`}>
             <button 
              onClick={handleHelpful}
              disabled={hasVoted}
              className={`flex items-center gap-3 px-6 py-4 bg-foreground/5 dark:bg-white/5 hover:bg-foreground/10 dark:hover:bg-white/10 rounded-full text-[10px] uppercase font-bold tracking-[0.2em] transition-all group/helpful active:scale-95 border border-white/5 self-end md:self-auto ${hasVoted ? 'opacity-80' : ''}`}
             >
               <ThumbsUp size={14} className={`${hasVoted ? 'text-[#00487A] fill-[#00487A]' : 'text-taupe group-hover/helpful:-rotate-12'} transition-all group-hover/helpful:text-[#00487A]`} />
               <span className={`opacity-60 group-hover/helpful:opacity-100 group-hover/helpful:text-[#00487A] ${hasVoted ? 'text-[#00487A] opacity-100' : ''}`}>
                 {t("helpful")} {helpfulCount > 0 && `(${helpfulCount})`}
               </span>
             </button>
           </div>
        </div>
      </div>
    </motion.div>
  );
}
