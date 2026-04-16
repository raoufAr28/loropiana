"use client";

import { useState } from "react";
import { ReviewCard } from "./ReviewCard";
import { ReviewFormModal } from "./ReviewFormModal";
import { useTranslations } from "next-intl";
import { motion } from "framer-motion";

interface ReviewsGalleryProps {
  initialReviews: any[];
  products: any[];
  locale: string;
}

export function ReviewsGallery({ initialReviews, products, locale }: ReviewsGalleryProps) {
  const t = useTranslations("Reviews");
  const [isModalOpen, setIsModalOpen] = useState(false);

  return (
    <section className="container mx-auto px-6 pb-40">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
        {initialReviews.map((review, idx) => (
          <div 
            key={review.id} 
            className={idx % 2 === 1 ? "lg:mt-12" : ""}
          >
            <ReviewCard 
              review={review} 
              product={review.products} 
            />
          </div>
        ))}
        {initialReviews.length === 0 && (
          <div className="col-span-full py-40 text-center">
             <p className="text-muted-foreground italic font-playfair text-xl tracking-wider opacity-60">
                Sentez la douceur de notre héritage... aucun avis pour le moment.
             </p>
          </div>
        )}
      </div>
      
      {/* Bottom CTA */}
      <div className="mt-32 text-center border-t border-white/5 pt-20">
        <p className="text-taupe uppercase tracking-[0.3em] text-xs font-bold mb-8">
          Rejoignez l'élite
        </p>
        <button 
          onClick={() => setIsModalOpen(true)}
          className="px-12 py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-full uppercase text-xs font-black tracking-[.4em] hover:scale-105 transition-transform duration-500 shadow-2xl"
        >
          {t('write_review')}
        </button>
      </div>

      <ReviewFormModal 
        isOpen={isModalOpen} 
        onClose={() => setIsModalOpen(false)} 
        products={products}
      />
    </section>
  );
}
