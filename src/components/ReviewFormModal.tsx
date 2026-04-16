"use client";

import { useState, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { X, Star, Send, Loader2, CheckCircle2, MessageSquare } from "lucide-react";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/utils/supabase/client";

interface Product {
  id: string;
  name_fr: string;
  name_ar: string;
  slug: string;
}

interface ReviewFormModalProps {
  isOpen: boolean;
  onClose: () => void;
  products: Product[];
}

export function ReviewFormModal({ isOpen, onClose, products }: ReviewFormModalProps) {
  const t = useTranslations("Reviews");
  const locale = useLocale() as "fr" | "ar";
  const isRTL = locale === "ar";

  const [form, setForm] = useState({
    full_name: "",
    email: "",
    rating: 0,
    comment_fr: "",
    comment_ar: "",
    product_id: ""
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [hoveredStar, setHoveredStar] = useState(0);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};

    if (!form.full_name) newErrors.full_name = true;
    if (!form.rating) newErrors.rating = true;
    if (locale === 'fr' && !form.comment_fr) newErrors.comment_fr = true;
    if (locale === 'ar' && !form.comment_ar) newErrors.comment_ar = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setSubmitting(true);
    try {
      const { error } = await supabase.from("reviews").insert({
        full_name: form.full_name,
        email: form.email || null,
        rating: form.rating,
        comment_fr: form.comment_fr || (locale === 'ar' ? "" : form.comment_fr),
        comment_ar: form.comment_ar || (locale === 'fr' ? "" : form.comment_ar),
        product_id: form.product_id || null,
        locale: locale,
        is_approved: false
      });

      if (error) throw error;
      setSubmitted(true);
      setTimeout(() => {
        onClose();
        setSubmitted(false);
        setForm({ full_name: "", email: "", rating: 0, comment_fr: "", comment_ar: "", product_id: "" });
      }, 3000);
    } catch (err) {
      console.error("Error submitting review:", err);
    } finally {
      setSubmitting(false);
    }
  };

  const inputClasses = (field: string) => `
    w-full bg-foreground/5 dark:bg-white/5 border 
    ${errors[field] ? 'border-rose-500/50' : 'border-white/10'} 
    rounded-2xl px-6 py-4 text-sm outline-none transition-all 
    focus:border-[#00487A] focus:bg-white/10 placeholder:opacity-30
  `;

  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4" dir={isRTL ? "rtl" : "ltr"}>
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-black/60 backdrop-blur-md"
            onClick={onClose}
          />

          <motion.div
            initial={{ opacity: 0, scale: 0.9, y: 20 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className="relative w-full max-w-2xl glass-panel-heavy rounded-[3rem] border border-white/10 shadow-2xl overflow-hidden"
          >
            {/* Background Accents */}
            <div className={`absolute top-0 ${isRTL ? 'left-0' : 'right-0'} w-64 h-64 bg-[#00487A]/10 blur-[100px] pointer-events-none`} />

            <div className="p-8 md:p-12 relative z-10">
              <header className="flex justify-between items-start mb-10">
                <div className="space-y-2">
                   <h2 className="text-3xl md:text-4xl font-playfair font-black uppercase tracking-tight text-gradient">
                     {t('write_review')}
                   </h2>
                   <p className="text-taupe uppercase tracking-[0.3em] text-[10px] font-bold">
                     Partagez votre expérience Loro Piana
                   </p>
                </div>
                <button 
                  onClick={onClose}
                  className="p-3 rounded-full bg-white/5 border border-white/10 hover:bg-white/10 transition-colors"
                >
                  <X size={20} />
                </button>
              </header>

              <AnimatePresence mode="wait">
                {submitted ? (
                  <motion.div 
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    className="py-20 flex flex-col items-center text-center space-y-6"
                  >
                    <div className="w-20 h-20 rounded-full bg-emerald-500/20 border border-emerald-500/30 flex items-center justify-center">
                      <CheckCircle2 size={40} className="text-emerald-500" />
                    </div>
                    <div className="space-y-2">
                       <h3 className="text-2xl font-bold uppercase tracking-tight">Merci beaucoup</h3>
                       <p className="text-taupe max-w-sm mx-auto">Votre avis est en cours de modération et sera publié très prochainement.</p>
                    </div>
                  </motion.div>
                ) : (
                  <form onSubmit={handleSubmit} className="space-y-8">
                    {/* Stars */}
                    <div className="flex flex-col items-center space-y-4 py-4 bg-foreground/5 dark:bg-white/5 rounded-3xl border border-white/5">
                       <span className="text-[10px] uppercase tracking-[0.4em] font-black text-taupe">Votre Note</span>
                       <div className="flex gap-2">
                         {[1, 2, 3, 4, 5].map((s) => (
                           <button
                             key={s}
                             type="button"
                             onMouseEnter={() => setHoveredStar(s)}
                             onMouseLeave={() => setHoveredStar(0)}
                             onClick={() => { setForm({ ...form, rating: s }); setErrors({ ...errors, rating: false }); }}
                             className="transition-transform active:scale-90"
                           >
                             <Star 
                               size={32} 
                               fill={(hoveredStar || form.rating) >= s ? "#00487A" : "transparent"} 
                               className={(hoveredStar || form.rating) >= s ? "text-[#00487A] scale-110" : "text-taupe/30 hover:text-taupe/50 transition-all"} 
                             />
                           </button>
                         ))}
                       </div>
                    </div>

                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest font-black text-taupe px-2">Nom Complet</label>
                         <input 
                           type="text"
                           value={form.full_name}
                           onChange={(e) => { setForm({ ...form, full_name: e.target.value }); setErrors({ ...errors, full_name: false }); }}
                           className={inputClasses('full_name')}
                           placeholder="Sophie L."
                         />
                      </div>
                      <div className="space-y-2">
                         <label className="text-[10px] uppercase tracking-widest font-black text-taupe px-2">Email (Confidentiel)</label>
                         <input 
                           type="email"
                           value={form.email}
                           onChange={(e) => setForm({ ...form, email: e.target.value })}
                           className={inputClasses('email')}
                           placeholder="sophie@example.com"
                         />
                      </div>
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-black text-taupe px-2">
                         {locale === 'fr' ? "Commentaire (Français)" : "التعليق (بالعربية)"}
                       </label>
                       <textarea 
                         rows={4}
                         value={locale === 'fr' ? form.comment_fr : form.comment_ar}
                         onChange={(e) => {
                           if (locale === 'fr') {
                              setForm({ ...form, comment_fr: e.target.value });
                              setErrors({ ...errors, comment_fr: false });
                           } else {
                              setForm({ ...form, comment_ar: e.target.value });
                              setErrors({ ...errors, comment_ar: false });
                           }
                         }}
                         className={`${inputClasses(locale === 'fr' ? 'comment_fr' : 'comment_ar')} resize-none`}
                         placeholder={locale === 'fr' ? "Décrivez votre expérience..." : "اصف تجربتك..."}
                       />
                    </div>

                    <div className="space-y-2">
                       <label className="text-[10px] uppercase tracking-widest font-black text-taupe px-2">Produit Concerné (Facultatif)</label>
                       <select 
                         value={form.product_id}
                         onChange={(e) => setForm({ ...form, product_id: e.target.value })}
                         className={inputClasses('product_id')}
                       >
                         <option value="">Sélectionnez un article</option>
                         {products.map(p => (
                           <option key={p.id} value={p.id}>
                             {locale === 'fr' ? p.name_fr : p.name_ar}
                           </option>
                         ))}
                       </select>
                    </div>

                    <button
                      type="submit"
                      disabled={submitting}
                      className="w-full py-6 bg-foreground text-background dark:bg-white dark:text-black rounded-3xl font-black uppercase text-xs tracking-[0.4em] flex items-center justify-center gap-4 hover:scale-[1.02] transition-transform active:scale-95 disabled:opacity-50"
                    >
                      {submitting ? (
                        <>
                          <Loader2 size={16} className="animate-spin" />
                          Envoi...
                        </>
                      ) : (
                        <>
                          <Send size={16} />
                          Envoyer mon avis
                        </>
                      )}
                    </button>
                  </form>
                )}
              </AnimatePresence>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
