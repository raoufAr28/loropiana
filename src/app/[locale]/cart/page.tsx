"use client";

import { useCartStore } from "@/store/useCartStore";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/utils/currency";
import Link from "next/link";
import { Trash2 } from "lucide-react";

export default function CartPage() {
  const { items, updateQuantity, removeItem, getTotalPrice } = useCartStore();
  const locale = useLocale();
  const t = useTranslations("Navigation");

  return (
    <div className="container mx-auto px-4 py-12 md:py-20 max-w-5xl">
      <h1 className="text-4xl font-playfair font-bold uppercase tracking-wide mb-12">
        {t("cart")}
      </h1>

      {items.length === 0 ? (
        <div className="text-center py-20 border border-gray-200 dark:border-gray-800 flex flex-col items-center gap-6">
          <p className="text-taupe text-xl">Votre panier est vide.</p>
          <Link
            href={`/${locale}/shop`}
            className="bg-foreground text-background px-8 py-3 font-bold uppercase tracking-widest hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
          >
            Découvrir nos collections
          </Link>
        </div>
      ) : (
        <div className="flex flex-col lg:flex-row gap-12">
          <div className="flex-1 flex flex-col gap-8">
            {items.map((item) => (
              <div key={item.id} className="flex gap-6 border-b border-gray-200 dark:border-gray-800 pb-8">
                <div className="w-32 aspect-[3/4] bg-beige dark:bg-[#1a1a1a] flex-shrink-0">
                  <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                </div>
                <div className="flex-1 flex flex-col justify-between">
                  <div className="flex justify-between items-start">
                    <div>
                      <h3 className="font-playfair text-xl font-bold">{item.name}</h3>
                      <p className="font-semibold mt-2">{formatPrice(item.price, locale)}</p>
                    </div>
                    <button onClick={() => removeItem(item.id)} className="text-taupe hover:text-red-500 transition-colors">
                      <Trash2 size={20} />
                    </button>
                  </div>
                  
                  <div className="flex items-center mt-4 border border-gray-300 dark:border-gray-700 w-max">
                    <button 
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => updateQuantity(item.id, item.quantity - 1)}
                    >-</button>
                    <span className="w-12 text-center">{item.quantity}</span>
                    <button 
                      className="px-4 py-2 hover:bg-gray-100 dark:hover:bg-gray-800"
                      onClick={() => updateQuantity(item.id, item.quantity + 1)}
                    >+</button>
                  </div>
                </div>
              </div>
            ))}
          </div>
          
          <div className="w-full lg:w-96 bg-gray-50 dark:bg-[#111] p-8 h-fit">
            <h3 className="font-bold uppercase tracking-wider mb-6">Résumé de la commande</h3>
            <div className="flex justify-between mb-4 text-taupe">
              <span>Sous-total</span>
              <span>€{getTotalPrice().toFixed(2)}</span>
            </div>
            <div className="flex justify-between mb-6 text-taupe">
              <span>Livraison</span>
              <span>Offerte</span>
            </div>
            <div className="border-t border-gray-200 dark:border-gray-800 my-6 pt-6 flex justify-between font-bold text-xl">
              <span>Total</span>
              <span>€{getTotalPrice().toFixed(2)}</span>
            </div>
            <Link 
              href={`/${locale}/checkout`}
              className="w-full block text-center bg-foreground text-background py-4 font-bold uppercase tracking-widest hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors"
            >
              Passer la commande
            </Link>
          </div>
        </div>
      )}
    </div>
  );
}
