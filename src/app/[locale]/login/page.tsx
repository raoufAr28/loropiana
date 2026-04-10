"use client";

import { useLocale, useTranslations } from "next-intl";
import Link from "next/link";
import { useState } from "react";
import { supabase } from "@/utils/supabase/client";
import { motion, AnimatePresence } from "framer-motion";
import { Mail, Lock, Eye, EyeOff, ArrowRight, Loader2, PlayCircle } from "lucide-react";

import { useRouter } from "next/navigation";

export default function LoginPage() {
  const router = useRouter();
  const locale = useLocale();
  const t = useTranslations("Navigation");
  const isRTL = locale === "ar";
  
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [showPassword, setShowPassword] = useState(false);
  const [loading, setLoading] = useState(false);
  const [errorMsg, setErrorMsg] = useState("");

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setErrorMsg("");

    const { error } = await supabase.auth.signInWithPassword({
      email,
      password,
    });

    if (error) {
      setErrorMsg(error.message);
    } else {
      if (email === "raoufarioua96@gmail.com") {
        router.push(`/${locale}/admin`);
      } else {
        router.push(`/${locale}`);
      }
    }
    setLoading(false);
  };

  const containerVariants = {
    hidden: { opacity: 0 },
    visible: { 
      opacity: 1,
      transition: { staggerChildren: 0.1, delayChildren: 0.2 }
    }
  };

  const itemVariants = {
    hidden: { y: 20, opacity: 0 },
    visible: { y: 0, opacity: 1 }
  };

  return (
    <div className="min-h-screen flex flex-col md:flex-row relative overflow-hidden bg-background">
      {/* Left Visual Section */}
      <div className={`hidden md:flex relative w-1/2 h-screen overflow-hidden group ${isRTL ? 'order-last' : 'order-first'}`}>
        <img 
          src="https://images.unsplash.com/photo-1539109136881-3be0616acf4b?q=80&w=2000&auto=format&fit=crop" 
          alt="Luxury Fashion" 
          className="w-full h-full object-cover transition-transform duration-[2000ms] group-hover:scale-105"
        />
        <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-black/20 to-transparent" />
        <div className={`absolute bottom-20 ${isRTL ? 'right-12 text-right' : 'left-12 text-left'} max-w-lg`}>
          <motion.div
            initial={{ opacity: 0, y: 30 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.8, delay: 0.5 }}
          >
            <h2 className="text-5xl font-playfair font-bold text-white mb-6 uppercase tracking-[0.1em] leading-tight">
              {isRTL ? 'إرث من الأناقة' : 'Héritage d\'élégance'}
            </h2>
            <p className="text-white/70 text-sm uppercase tracking-[0.3em] font-bold">
              Loro Piana • Excellence since 1924
            </p>
          </motion.div>
        </div>
      </div>

      {/* Right Login Form Section */}
      <div className="flex-1 flex items-center justify-center p-8 md:p-20 relative z-10">
        <motion.div 
          variants={containerVariants}
          initial="hidden"
          animate="visible"
          className="w-full max-w-md"
        >
          {/* Header */}
          <motion.div variants={itemVariants} className="text-center mb-12">
            <Link href={`/${locale}`} className="inline-block mb-8">
               <h3 className="text-2xl font-playfair tracking-[0.4em] uppercase font-bold hover:scale-110 transition-transform">Loro Piana</h3>
            </Link>
            <h1 className="text-4xl font-playfair font-bold uppercase tracking-widest mb-4">
              {isRTL ? 'تسجيل الدخول' : t('login')}
            </h1>
            <p className="text-taupe uppercase tracking-[0.2em] text-[10px] font-bold">
              Entrez dans l'univers du raffinement
            </p>
          </motion.div>

          {/* Form */}
          <div className="glass-panel-ultra p-8 md:p-10 rounded-[2.5rem] shadow-2xl border border-white/20 dark:border-white/5 relative overflow-hidden group">
            {/* Soft Glow decoration */}
            <div className="absolute -top-20 -right-20 w-40 h-40 bg-gold-dark/10 rounded-full blur-3xl opacity-0 group-hover:opacity-100 transition-opacity duration-1000" />
            
            <form onSubmit={handleLogin} className="space-y-6 relative z-10">
              <motion.div variants={itemVariants} className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-widest text-taupe ml-2">Email</label>
                <div className="relative group/input">
                  <Mail className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe group-focus-within/input:text-foreground transition-colors" size={18} />
                  <input
                    type="email"
                    required
                    placeholder="example@loropiana.com"
                    className="w-full bg-foreground/5 border border-transparent focus:border-foreground/20 rounded-2xl p-4 pl-12 pr-4 outline-none transition-all text-sm font-inter"
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                  />
                </div>
              </motion.div>

              <motion.div variants={itemVariants} className="space-y-2">
                <div className="flex justify-between items-center px-2">
                  <label className="text-[10px] font-bold uppercase tracking-widest text-taupe">Mot de passe</label>
                  <Link href="#" className="text-[9px] uppercase font-bold tracking-widest text-taupe hover:text-foreground transition-colors">Oublié ?</Link>
                </div>
                <div className="relative group/input">
                  <Lock className="absolute left-4 top-1/2 -translate-y-1/2 text-taupe group-focus-within/input:text-foreground transition-colors" size={18} />
                  <input
                    type={showPassword ? "text" : "password"}
                    required
                    placeholder="••••••••"
                    className="w-full bg-foreground/5 border border-transparent focus:border-foreground/20 rounded-2xl p-4 pl-12 pr-12 outline-none transition-all text-sm font-inter"
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                  />
                  <button 
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-taupe hover:text-foreground transition-colors"
                  >
                    {showPassword ? <EyeOff size={18} /> : <Eye size={18} />}
                  </button>
                </div>
              </motion.div>

              {errorMsg && (
                <motion.div 
                  initial={{ opacity: 0, y: -10 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="bg-red-500/10 border border-red-500/20 text-red-500 p-4 rounded-xl text-xs flex items-center gap-3"
                >
                  <AlertCircle size={14} className="shrink-0" />
                  {errorMsg}
                </motion.div>
              )}

              <motion.button 
                variants={itemVariants}
                type="submit"
                disabled={loading}
                className="btn-glow-gold w-full bg-foreground text-background py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs shadow-luxury group overflow-hidden transition-all active:scale-95"
              >
                <span className="relative z-10 flex items-center justify-center gap-3">
                  {loading ? (
                    <Loader2 className="animate-spin" size={18} />
                  ) : (
                    <>
                      {isRTL ? 'تسجيل الدخول' : 'Se connecter'}
                      <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                    </>
                  )}
                </span>
                <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
              </motion.button>
            </form>
          </div>

          {/* Footer */}
          <motion.div variants={itemVariants} className="mt-12 text-center">
            <p className="text-taupe uppercase tracking-[0.2em] text-[10px] font-bold">
              {isRTL ? 'ليس لديك حساب؟' : 'Pas encore de compte ?'}
            </p>
            <Link 
              href={`/${locale}/register`} 
              className="inline-block mt-3 text-xs uppercase font-bold tracking-widest border-b border-foreground/20 pb-1 hover:border-foreground transition-all"
            >
              {isRTL ? 'أنشئ حسابك الآن' : 'Créer un compte'}
            </Link>
          </motion.div>
        </motion.div>
      </div>
    </div>
  );
}

function AlertCircle({ size, className }: { size: number, className: string }) {
    return (
        <svg xmlns="http://www.w3.org/2000/svg" width={size} height={size} viewBox="0 0 24 24" fill="none" stroke="currentColor" strokeWidth="2" strokeLinecap="round" strokeLinejoin="round" className={className}>
            <circle cx="12" cy="12" r="10" />
            <line x1="12" y1="8" x2="12" y2="12" />
            <line x1="12" y1="16" x2="12.01" y2="16" />
        </svg>
    )
}
