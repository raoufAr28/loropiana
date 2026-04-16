"use client";

import { useCartStore } from "@/store/useCartStore";
import { useLocale } from "next-intl";
import { formatPrice } from "@/utils/currency";
import { motion, AnimatePresence, useMotionValue, useSpring, useTransform, Variants } from "framer-motion";
import { X, Plus, Minus, Trash2, ShoppingBag, ArrowRight } from "lucide-react";
import Link from "next/link";
import { useEffect, useState } from "react";
import { supabase } from "@/utils/supabase/client";

// Reusable 3D Tilt Wrapper for Items
function TiltItem({ children, className }: { children: React.ReactNode, className?: string }) {
  const x = useMotionValue(0);
  const y = useMotionValue(0);
  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });
  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["5deg", "-5deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-5deg", "5deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    x.set((e.clientX - rect.left) / rect.width - 0.5);
    y.set((e.clientY - rect.top) / rect.height - 0.5);
  };

  const handleMouseLeave = () => {
    x.set(0);
    y.set(0);
  };

  return (
    <motion.div
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      style={{ rotateX, rotateY, transformStyle: "preserve-3d" }}
      className={className}
    >
      {children}
    </motion.div>
  );
}

export function MiniCart() {
  const { items, isOpen, setIsOpen, removeItem, updateQuantity, getTotalPrice, addItem } = useCartStore();
  const locale = useLocale();
  const isRTL = locale === 'ar';
  const [recommendations, setRecommendations] = useState<any[]>([]);

  // Effect to handle scroll lock
  useEffect(() => {
    if (isOpen) {
      document.body.style.overflow = "hidden";
      fetchRecommendations();
    } else {
      document.body.style.overflow = "auto";
    }
    return () => { document.body.style.overflow = "auto"; };
  }, [isOpen]);

  const fetchRecommendations = async () => {
    const { data } = await supabase
      .from('products')
      .select('id, name_fr, name_ar, price, slug, product_images(image_url)')
      .eq('is_featured', true)
      .limit(3);
    
    if (data) {
      setRecommendations(data.map(p => ({
        id: p.id,
        name: locale === 'fr' ? p.name_fr : p.name_ar,
        price: p.price,
        slug: p.slug,
        image_url: p.product_images?.[0]?.image_url || ''
      })));
    }
  };

  const t = {
    title: isRTL ? 'سلتك' : 'Votre Panier',
    empty: isRTL ? 'السلة فارغة حالياً' : 'Votre panier est apparemment vide.',
    continue: isRTL ? 'مواصلة التسوق' : 'Continuer les achats',
    checkout: isRTL ? 'إتمام الطلب' : 'Valider la commande',
    subtotal: isRTL ? 'المجموع الفرعي' : 'Sous-total',
    shipping: isRTL ? 'يتم حساب الشحن في المرحلة التالية' : 'Livraison calculée à l’étape suivante',
    related: isRTL ? 'قد يعجبك أيضًا' : 'Vous aimerez aussi',
    freeShipping: isRTL ? 'شحن مجاني للطلبات فوق 20,000 دج' : 'Livraison offerte dès 20 000 DZD',
  };

  const slideVariants: Variants = {
    hidden: { x: isRTL ? "-100%" : "100%" },
    visible: { 
      x: 0, 
      transition: { 
        type: "spring", 
        stiffness: 300, 
        damping: 35,
        staggerChildren: 0.1,
        delayChildren: 0.2
      } 
    },
    exit: { x: isRTL ? "-100%" : "100%", transition: { duration: 0.4, ease: "easeInOut" } }
  };

  const itemVariants: Variants = {
    hidden: { opacity: 0, y: 20 },
    visible: { opacity: 1, y: 0 }
  };

  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!isOpen) return null;

  return (
    <AnimatePresence>
      {(isOpen && mounted) && (
        <>
          {/* Backdrop */}
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            onClick={() => setIsOpen(false)}
            className="fixed inset-0 z-[100] bg-background/40 dark:bg-black/60 backdrop-blur-md cursor-pointer"
          />

          {/* Drawer Panel */}
          <motion.div
            variants={slideVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`fixed top-0 bottom-0 z-[110] w-full sm:w-[480px] glass-panel-ultra shadow-2xl
                        flex flex-col border-white/20 dark:border-white/5
                        ${isRTL ? 'left-0 rounded-r-[2rem]' : 'right-0 rounded-l-[32px]'}`}
            dir={isRTL ? 'rtl' : 'ltr'}
          >
            {/* Header */}
            <div className="flex items-center justify-between p-8 border-b border-border">
              <div className="flex items-center gap-3">
                <ShoppingBag size={20} className="text-secondary" />
                <h2 className="font-playfair text-2xl uppercase tracking-widest font-bold">{t.title}</h2>
              </div>
              <motion.button 
                whileHover={{ rotate: 90, scale: 1.1 }}
                whileTap={{ scale: 0.9 }}
                onClick={() => setIsOpen(false)}
                className="p-2 rounded-full hover:bg-muted transition-colors"
              >
                <X size={20} />
              </motion.button>
            </div>

            {/* Scroll Area */}
            <div className="flex-1 overflow-y-auto px-8 py-6 custom-scrollbar space-y-12">
              {/* Cart List */}
              <div className="space-y-6">
                {items.length === 0 ? (
                  <div className="py-20 flex flex-col items-center justify-center text-center">
                    <p className="tracking-widest uppercase text-xs text-taupe font-semibold mb-6">{t.empty}</p>
                    <button 
                      onClick={() => setIsOpen(false)}
                      className="text-[10px] uppercase tracking-[0.3em] font-bold border-b border-foreground/20 pb-1 hover:border-foreground transition-all"
                    >
                      {t.continue}
                    </button>
                  </div>
                ) : (
                  items.map((item) => (
                    <motion.div 
                      layout
                      variants={itemVariants}
                      key={item.id} 
                      className="group relative flex gap-6 pb-6 border-b border-border"
                    >
                      <TiltItem className="w-28 h-36 relative overflow-hidden bg-muted rounded-2xl flex-shrink-0 cursor-pointer">
                        <img 
                          src={item.image_url} 
                          alt={item.name} 
                          className="object-cover w-full h-full transition-transform duration-1000 group-hover:scale-110" 
                        />
                      </TiltItem>
                      
                      <div className="flex flex-col justify-between flex-1 py-1">
                        <div>
                          <div className="flex justify-between items-start">
                             <Link 
                                href={`/${locale}/product/${item.id}`}
                                className="font-playfair text-lg leading-tight hover:text-secondary transition-colors"
                             >
                               {item.name}
                             </Link>
                             <button 
                                onClick={() => removeItem(item.id)}
                                className="text-muted-foreground hover:text-danger transition-colors p-1 opacity-0 group-hover:opacity-100"
                             >
                               <Trash2 size={16} />
                             </button>
                          </div>
                          <p className="text-sm font-bold mt-2 font-inter tracking-wide">{formatPrice(item.price, locale)}</p>
                        </div>
                        
                        <div className="flex items-center justify-between mt-4">
                          <div className="flex items-center border border-border rounded-full p-1 bg-background/50">
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item.id, Math.max(1, item.quantity - 1))}
                              className="w-8 h-8 flex items-center justify-center hover:bg-foreground/5 rounded-full transition-colors"
                            >
                              <Minus size={12} />
                            </motion.button>
                            <span className="w-10 text-center text-xs font-bold font-inter">{item.quantity}</span>
                            <motion.button 
                              whileTap={{ scale: 0.8 }}
                              onClick={() => updateQuantity(item.id, item.quantity + 1)}
                              className="w-8 h-8 flex items-center justify-center hover:bg-muted rounded-full transition-colors"
                            >
                              <Plus size={12} />
                            </motion.button>
                          </div>
                          
                          <span className="text-xs font-bold text-muted-foreground font-inter">
                            {formatPrice(item.price * item.quantity, locale)}
                          </span>
                        </div>
                      </div>
                    </motion.div>
                  ))
                )}
              </div>

              {/* Recommendations */}
              <div className="pt-8">
                <h3 className="uppercase tracking-[0.2em] text-[10px] font-bold text-muted-foreground mb-8 inline-block relative after:absolute after:bottom-[-8px] after:left-0 after:w-full after:h-[1px] after:bg-secondary/30">
                  {t.related}
                </h3>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-4">
                  {recommendations.map((rec) => (
                    <motion.div 
                      key={rec.id}
                      whileHover={{ y: -5 }}
                      onClick={() => {
                        addItem(rec, 1);
                      }}
                      className="cursor-pointer group flex flex-col gap-3"
                    >
                      <div className="aspect-[3/4] rounded-xl overflow-hidden bg-muted relative shadow-sm">
                        <img src={rec.image_url} alt={rec.name} className="w-full h-full object-cover transition-all duration-700 group-hover:scale-110" />
                        <div className="absolute inset-0 bg-black/20 opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center">
                          <Plus size={20} className="text-white" />
                        </div>
                      </div>
                      <div>
                        <h4 className="text-[10px] uppercase font-bold tracking-widest truncate">{rec.name}</h4>
                        <p className="text-[10px] font-bold text-muted-foreground mt-1 font-inter">{formatPrice(rec.price, locale)}</p>
                      </div>
                    </motion.div>
                  ))}
                </div>
              </div>
            </div>

            {/* Bottom Footer */}
            {items.length > 0 && (
              <div className="p-8 glass-panel-heavy border-t border-border rounded-t-[2rem]">
                <div className="space-y-4 mb-8">
                  {getTotalPrice() >= 20000 && (
                    <div className="flex items-center justify-center gap-2 py-2 px-4 rounded-full bg-secondary/10 text-secondary text-[10px] font-bold uppercase tracking-widest border border-secondary/20">
                      <span>✨</span> {t.freeShipping}
                    </div>
                  )}
                  <div className="flex justify-between items-end">
                    <span className="uppercase tracking-[0.2em] text-[10px] font-bold text-muted-foreground">{t.subtotal}</span>
                    <span className="text-3xl font-playfair font-bold">{formatPrice(getTotalPrice(), locale)}</span>
                  </div>
                  <p className="text-[10px] text-muted-foreground text-center italic tracking-wide">{t.shipping}</p>
                </div>
                
                <div className="flex flex-col gap-4">
                  <Link 
                    href={`/${locale}/checkout-direct`}
                    onClick={() => setIsOpen(false)}
                    className="group relative w-full overflow-hidden text-center bg-primary text-primary-foreground py-5 rounded-2xl font-bold uppercase tracking-[0.2em] text-xs transition-all hover:opacity-90 active:scale-[0.98]"
                  >
                     <span className="relative z-10 flex items-center justify-center gap-2 group-hover:translate-x-1 transition-transform">
                       {t.checkout}
                       <ArrowRight size={14} className={isRTL ? 'rotate-180' : ''} />
                     </span>
                     <div className="absolute inset-0 bg-gradient-to-r from-transparent via-white/5 to-transparent -translate-x-full group-hover:translate-x-full transition-transform duration-1000" />
                  </Link>

                  <Link 
                    href={`/${locale}/cart`}
                    onClick={() => setIsOpen(false)}
                    className="w-full text-center py-2 text-[10px] font-bold tracking-[0.2em] uppercase text-muted-foreground hover:text-foreground transition-colors"
                  >
                    Vue détaillée du panier
                  </Link>
                </div>
              </div>
            )}
          </motion.div>
        </>
      )}
    </AnimatePresence>
  );
}
