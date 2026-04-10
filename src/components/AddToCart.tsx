"use client";

import { useState } from "react";
import { useCartStore } from "@/store/useCartStore";
import { motion } from "framer-motion";

export function AddToCart({ product }: { product: { id: string, name: string, price: number, image_url: string } }) {
  const [quantity, setQuantity] = useState(1);
  const addItem = useCartStore((state) => state.addItem);
  const setIsOpen = useCartStore((state) => state.setIsOpen);

  const handleAdd = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      image_url: product.image_url,
    }, quantity);
    
    // Open the mini cart drawer smoothly instead of annoying alert
    setIsOpen(true);
  };

  return (
    <div className="mt-8 flex flex-col gap-6 w-full max-w-sm">
      <div className="flex items-center gap-6">
        <span className="uppercase text-xs font-bold tracking-[0.2em] text-taupe">Quantité</span>
        <div className="flex items-center border border-gray-200 dark:border-gray-800 rounded-full bg-background overflow-hidden relative shadow-inner">
          <button 
             onClick={() => setQuantity(Math.max(1, quantity - 1))} 
             className="px-5 py-3 hover:bg-[#F0EEEA] dark:hover:bg-[#1A1A1A] transition-colors active:opacity-70"
          >
             -
          </button>
          <span className="w-10 text-center font-inter font-bold text-sm">{quantity}</span>
          <button 
             onClick={() => setQuantity(quantity + 1)} 
             className="px-5 py-3 hover:bg-[#F0EEEA] dark:hover:bg-[#1A1A1A] transition-colors active:opacity-70"
          >
             +
          </button>
        </div>
      </div>
      
      <motion.button 
        whileHover={{ scale: 1.02 }}
        whileTap={{ scale: 0.98 }}
        onClick={handleAdd} 
        className="relative w-full overflow-hidden bg-foreground text-background font-bold uppercase tracking-[0.2em] py-5 mt-4 rounded-full shadow-luxury dark:shadow-luxury-dark group"
      >
        <span className="relative z-10 transition-colors group-hover:text-champagne dark:group-hover:text-gold-light">
          Ajouter au panier
        </span>
        {/* Glow effect overlay */}
        <div className="absolute inset-0 bg-white/20 dark:bg-black/20 translate-y-full group-hover:translate-y-0 transition-transform duration-500 ease-out z-0" />
      </motion.button>
    </div>
  );
}
