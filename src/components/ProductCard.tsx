"use client";

import Link from "next/link";
import { useLocale } from "next-intl";
import { formatPrice } from "@/utils/currency";
import { motion, useMotionValue, useSpring, useTransform } from "framer-motion";
import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { Plus } from "lucide-react";

interface Product {
  id: string;
  slug: string;
  name: string;
  price: number;
  image_url: string;
  category: string;
  is_new_arrival?: boolean;
}

export function ProductCard({ product }: { product: Product }) {
  const locale = useLocale();
  const [isHovered, setIsHovered] = useState(false);

  const addItem = useCartStore((state) => state.addItem);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  // 3D Tilt configuration
  const x = useMotionValue(0);
  const y = useMotionValue(0);

  const mouseXSpring = useSpring(x, { stiffness: 150, damping: 20 });
  const mouseYSpring = useSpring(y, { stiffness: 150, damping: 20 });

  const rotateX = useTransform(mouseYSpring, [-0.5, 0.5], ["7deg", "-7deg"]);
  const rotateY = useTransform(mouseXSpring, [-0.5, 0.5], ["-7deg", "7deg"]);

  const handleMouseMove = (e: React.MouseEvent<HTMLDivElement>) => {
    const rect = e.currentTarget.getBoundingClientRect();
    const width = rect.width;
    const height = rect.height;
    const mouseX = e.clientX - rect.left;
    const mouseY = e.clientY - rect.top;
    x.set(mouseX / width - 0.5);
    y.set(mouseY / height - 0.5);
  };

  const handleMouseLeave = () => {
    setIsHovered(false);
    x.set(0);
    y.set(0);
  };

  const handleQuickAdd = (e: React.MouseEvent) => {
    e.preventDefault();
    e.stopPropagation();
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    }, 1);
    setIsOpen(true);
  };

  return (
    <motion.div
      style={{
        rotateX,
        rotateY,
        transformStyle: "preserve-3d"
      }}
      className="group block relative perspective-1000"
      onMouseMove={handleMouseMove}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={handleMouseLeave}
    >
      {/* Glow shadow layer underneath */}
      <motion.div
        className="absolute inset-4 bg-foreground/5 dark:bg-secondary/10 rounded-3xl blur-2xl z-0 transition-opacity duration-500"
        initial={{ opacity: 0 }}
        animate={{ opacity: isHovered ? 1 : 0 }}
      />

      <div className="relative z-10 glass-panel-heavy rounded-3xl p-3 md:p-4 overflow-hidden transition-all duration-300 group-hover:border-white/40 dark:group-hover:border-white/20">
        {/* Image Container with 3D Pop */}
        <Link href={`/${locale}/product/${product.slug}`} className="block">
          <div className="relative aspect-[4/5] overflow-hidden rounded-2xl bg-muted mb-5 shadow-inner">
            {product.image_url ? (
              <motion.img
                src={product.image_url}
                alt={product.name}
                style={{ z: isHovered ? 40 : 0 } as any}
                className="object-cover w-full h-full transition-transform duration-[800ms] group-hover:scale-110"
              />
            ) : (
              <div className="w-full h-full flex items-center justify-center text-muted-foreground text-sm">No image available</div>
            )}

            {/* Stable Premium Badge */}
            {product.is_new_arrival && (
              <div className="absolute top-3 left-3 bg-background/80 backdrop-blur-md text-foreground text-[10px] uppercase font-bold tracking-widest px-3 py-1.5 rounded-full shadow-sm">
                New
              </div>
            )}
          </div>
        </Link>

        {/* Content Section */}
        <div className="flex flex-col gap-1.5 px-2 pb-2" style={{ transform: "translateZ(20px)" }}>
          <Link href={`/${locale}/product/${product.slug}`} className="block">
            <span className="text-[10px] md:text-xs uppercase tracking-[0.2em] text-muted-foreground font-semibold">{product.category}</span>
            <h3 className="font-playfair text-lg md:text-xl leading-tight transition-colors group-hover:text-foreground/80 dark:group-hover:text-secondary mt-1 text-foreground">
              {product.name}
            </h3>
          </Link>

          <div className="flex items-center justify-between mt-3">
             <Link href={`/${locale}/product/${product.slug}`} className="block">
                <p className="font-bold tracking-wide text-foreground/90 font-inter">
                  {formatPrice(product.price, locale)}
                </p>
             </Link>

             <button
               onClick={handleQuickAdd}
               className="z-20 flex items-center justify-center p-2 rounded-full border border-foreground/10 dark:border-white/10 text-muted-foreground hover:text-background hover:bg-foreground dark:hover:text-background dark:hover:bg-secondary transition-all shadow-sm"
               aria-label={locale === 'ar' ? 'أضف إلى السلة' : 'Ajouter au panier'}
             >
               <Plus size={14} strokeWidth={3} />
             </button>
          </div>
        </div>
      </div>
    </motion.div>
  );
}
