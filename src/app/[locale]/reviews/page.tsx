"use client";

import { useState, useEffect, useMemo } from "react";
import { Star, CheckCircle2, ChevronDown, Search, Send, Loader2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useTranslations, useLocale } from "next-intl";
import { supabase } from "@/utils/supabase/client";
import { ReviewsSummary } from "@/components/ReviewsSummary";
import { ReviewCard } from "@/components/ReviewCard";

// ── Types ─────────────────────────────────────────────────────────────────────
interface DBReview {
  id: string;
  full_name: string;
  comment: string;
  rating: number;
  locale: string;
  is_approved: boolean;
  created_at: string;
}

// Map DB review → shape expected by legacy ReviewCard
function toCardShape(r: DBReview) {
  return {
    id: r.id,
    user: r.full_name,
    date: new Date(r.created_at).toLocaleDateString("fr-FR", { day: "numeric", month: "long", year: "numeric" }),
    rating: r.rating,
    comment_fr: r.comment,
    comment_ar: r.comment,
    is_verified: true,
  };
}

// ── Empty Star / Filled Star helper ───────────────────────────────────────────
function StarInput({ value, onChange }: { value: number; onChange: (v: number) => void }) {
  const [hovered, setHovered] = useState(0);
  return (
    <div className="flex gap-1">
      {[1, 2, 3, 4, 5].map((s) => (
        <button
          key={s}
          type="button"
          onClick={() => onChange(s)}
          onMouseEnter={() => setHovered(s)}
          onMouseLeave={() => setHovered(0)}
          className="transition-transform hover:scale-110 active:scale-95"
        >
          <Star
            size={28}
            fill={(hovered || value) >= s ? "#00487A" : "transparent"}
            className={(hovered || value) >= s ? "text-[#00487A]" : "text-slate-300"}
          />
        </button>
      ))}
    </div>
  );
}

// ── Main Page ─────────────────────────────────────────────────────────────────
export default function ReviewsPage() {
  const t = useTranslations("Reviews");
  const locale = useLocale() as "fr" | "ar";
  const isRTL = locale === "ar";

  const [reviews, setReviews] = useState<DBReview[]>([]);
  const [loadingReviews, setLoadingReviews] = useState(true);

  // ── Fetch approved reviews ────────────────────────────────────────────────
  const fetchReviews = async () => {
    setLoadingReviews(true);
    const { data } = await supabase
      .from("reviews")
      .select("*")
      .eq("is_approved", true)
      .order("created_at", { ascending: false });
    setReviews(data || []);
    setLoadingReviews(false);
  };

  useEffect(() => { fetchReviews(); }, []);

  // ── Submission form state ─────────────────────────────────────────────────
  const [form, setForm] = useState({ full_name: "", comment: "", rating: 0, email: "" });
  const [errors, setErrors] = useState<Record<string, boolean>>({});
  const [submitting, setSubmitting] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const [submitError, setSubmitError] = useState("");

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    const newErrors: Record<string, boolean> = {};
    if (!form.full_name.trim()) newErrors.full_name = true;
    if (!form.comment.trim()) newErrors.comment = true;
    if (!form.rating) newErrors.rating = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }
    setErrors({});
    setSubmitting(true);
    setSubmitError("");

    try {
      const { error } = await supabase.from("reviews").insert({
        full_name: form.full_name.trim(),
        comment: form.comment.trim(),
        rating: form.rating,
        email: form.email.trim() || null,
        locale,
        is_approved: false,
      });
      if (error) throw error;

      setSubmitted(true);
      setForm({ full_name: "", comment: "", rating: 0, email: "" });
    } catch (err: any) {
      setSubmitError(err.message || "Erreur lors de l'envoi.");
    } finally {
      setSubmitting(false);
    }
  };

  // ── Stats (only approved) ─────────────────────────────────────────────────
  const stats = useMemo(() => {
    if (!reviews.length) return { rating: 0, total: 0, dist: { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } };
    const avg = reviews.reduce((acc, r) => acc + r.rating, 0) / reviews.length;
    const dist = { 5: 0, 4: 0, 3: 0, 2: 0, 1: 0 } as Record<number, number>;
    reviews.forEach((r) => { dist[r.rating] += 100 / reviews.length; });
    return { rating: avg, total: reviews.length, dist };
  }, [reviews]);

  const inputCls = (field: string) =>
    `w-full bg-white/5 border ${errors[field] ? "border-rose-500" : "border-white/10"} px-5 py-3.5 rounded-2xl outline-none text-sm transition-all focus:border-[#00487A] focus:bg-white/10 placeholder:text-taupe/50`;

  const labels = {
    title: locale === "fr" ? "Laisser un Avis" : "اترك تقييمك",
    nameLbl: locale === "fr" ? "Votre nom complet" : "اسمك الكامل",
    emailLbl: locale === "fr" ? "Email (optionnel)" : "البريد الإلكتروني (اختياري)",
    commentLbl: locale === "fr" ? "Votre commentaire" : "تعليقك",
    ratingLbl: locale === "fr" ? "Votre note" : "تقييمك",
    submit: locale === "fr" ? "Envoyer mon avis" : "إرسال تقييمي",
    successMsg: locale === "fr"
      ? "Votre avis a été envoyé avec succès. Il sera publié après validation."
      : "تم إرسال رأيك بنجاح. سيتم نشره بعد المراجعة.",
    required: locale === "fr" ? "Ce champ est requis." : "هذا الحقل مطلوب.",
    ratingRequired: locale === "fr" ? "Veuillez sélectionner une note." : "يرجى تحديد تقييم.",
  };

  return (
    <div className={`min-h-screen bg-transparent pt-32 pb-20 px-4 md:px-8`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="max-w-6xl mx-auto space-y-28">

        {/* ── Header ── */}
        <div className="text-center space-y-6">
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-5xl md:text-7xl font-playfair font-black uppercase tracking-[0.1em] text-gradient"
          >
            {t("title")}
          </motion.h1>
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="text-taupe max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-80"
          >
            {t("subtitle")}
          </motion.p>
        </div>

        {/* ── Summary ── */}
        {!loadingReviews && (
          <motion.div initial={{ opacity: 0, scale: 0.95 }} animate={{ opacity: 1, scale: 1 }}>
            <ReviewsSummary rating={stats.rating} totalReviews={stats.total} distribution={stats.dist} />
          </motion.div>
        )}

        {/* ── Reviews Grid ── */}
        {loadingReviews ? (
          <div className="flex justify-center py-20">
            <Loader2 size={32} className="animate-spin text-taupe opacity-40" />
          </div>
        ) : (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            <AnimatePresence mode="popLayout">
              {reviews.map((r) => (
                <ReviewCard key={r.id} review={toCardShape(r)} />
              ))}
            </AnimatePresence>
            {reviews.length === 0 && (
              <div className="col-span-full py-40 text-center glass-panel-heavy rounded-[3rem] border border-dashed border-white/10">
                <p className="text-2xl font-playfair italic text-taupe opacity-50 tracking-widest">
                  {locale === "fr" ? "Aucun avis publié pour l'instant." : "لا توجد آراء منشورة حتى الآن."}
                </p>
              </div>
            )}
          </div>
        )}

        {/* ── Submission Form ── */}
        <motion.section
          initial={{ opacity: 0, y: 24 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true }}
          transition={{ duration: 0.6 }}
          className="glass-panel-heavy rounded-[3rem] border border-white/10 p-10 md:p-16 shadow-2xl"
        >
          <div className="max-w-xl mx-auto">
            <h2 className="font-playfair text-3xl md:text-4xl font-black uppercase tracking-tight text-center mb-10">
              {labels.title}
            </h2>

            <AnimatePresence>
              {submitted ? (
                <motion.div
                  key="success"
                  initial={{ opacity: 0, scale: 0.95 }}
                  animate={{ opacity: 1, scale: 1 }}
                  className="flex flex-col items-center gap-5 py-10 text-center"
                >
                  <div className="w-16 h-16 rounded-full bg-emerald-500/10 border border-emerald-500/20 flex items-center justify-center">
                    <CheckCircle2 size={28} className="text-emerald-500" />
                  </div>
                  <p className="text-lg font-medium text-foreground/80 leading-relaxed max-w-sm">
                    {labels.successMsg}
                  </p>
                  <button
                    onClick={() => setSubmitted(false)}
                    className="text-[10px] font-black uppercase tracking-widest text-taupe hover:text-foreground transition-colors mt-2"
                  >
                    {locale === "fr" ? "Soumettre un autre avis →" : "إرسال تقييم آخر →"}
                  </button>
                </motion.div>
              ) : (
                <motion.form
                  key="form"
                  onSubmit={handleSubmit}
                  className="space-y-6"
                >
                  {/* Rating */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-taupe mb-3">
                      {labels.ratingLbl}
                    </label>
                    <StarInput value={form.rating} onChange={(v) => { setForm(p => ({ ...p, rating: v })); setErrors(p => ({ ...p, rating: false })); }} />
                    {errors.rating && <p className="text-rose-400 text-xs mt-1.5">{labels.ratingRequired}</p>}
                  </div>

                  {/* Full name */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-taupe mb-2">
                      {labels.nameLbl}
                    </label>
                    <input
                      value={form.full_name}
                      onChange={(e) => { setForm(p => ({ ...p, full_name: e.target.value })); setErrors(p => ({ ...p, full_name: false })); }}
                      className={inputCls("full_name")}
                      placeholder={locale === "fr" ? "Marc Dupont" : "محمد أمين"}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    {errors.full_name && <p className="text-rose-400 text-xs mt-1.5">{labels.required}</p>}
                  </div>

                  {/* Email (optional) */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-taupe mb-2">
                      {labels.emailLbl}
                    </label>
                    <input
                      type="email"
                      value={form.email}
                      onChange={(e) => setForm(p => ({ ...p, email: e.target.value }))}
                      className={inputCls("email")}
                      placeholder="email@example.com"
                    />
                  </div>

                  {/* Comment */}
                  <div>
                    <label className="block text-[10px] font-black uppercase tracking-widest text-taupe mb-2">
                      {labels.commentLbl}
                    </label>
                    <textarea
                      value={form.comment}
                      onChange={(e) => { setForm(p => ({ ...p, comment: e.target.value })); setErrors(p => ({ ...p, comment: false })); }}
                      className={`${inputCls("comment")} min-h-[120px] resize-none`}
                      placeholder={locale === "fr" ? "Un produit exceptionnel..." : "منتج رائع جداً..."}
                      dir={isRTL ? "rtl" : "ltr"}
                    />
                    {errors.comment && <p className="text-rose-400 text-xs mt-1.5">{labels.required}</p>}
                  </div>

                  {submitError && (
                    <p className="text-rose-400 text-sm text-center">{submitError}</p>
                  )}

                  <button
                    type="submit"
                    disabled={submitting}
                    className="w-full flex items-center justify-center gap-3 bg-[#00487A] text-white px-8 py-4 rounded-2xl text-[11px] font-black uppercase tracking-[0.25em] hover:bg-[#00487A]/90 active:scale-[0.98] transition-all disabled:opacity-60 shadow-lg shadow-[#00487A]/20"
                  >
                    {submitting ? <Loader2 size={16} className="animate-spin" /> : <Send size={15} />}
                    {labels.submit}
                  </button>
                </motion.form>
              )}
            </AnimatePresence>
          </div>
        </motion.section>

      </div>
    </div>
  );
}
