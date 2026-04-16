import { getTranslations } from 'next-intl/server';
import { ReviewsSummary } from "@/components/ReviewsSummary";
import { ReviewCard } from "@/components/ReviewCard";
import { motion } from "framer-motion";

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('Reviews');
  const isRTL = locale === 'ar';

  // Mock Summary Data
  const summaryData = {
    rating: 4.9,
    totalReviews: 1240,
    distribution: {
      5: 85,
      4: 10,
      3: 3,
      2: 1,
      1: 1
    }
  };

  // Mock Reviews Collection
  const reviews = [
    {
      review: {
        id: "1",
        user: "Sophie L.",
        date: "12 Mars 2024",
        rating: 5,
        comment_fr: "Qualité exceptionnelle. Le cachemire est incroyablement doux et les finitions sont parfaites.",
        comment_ar: "جودة استثنائية. الكشمير ناعم بشكل لا يصدق والتشطيبات مثالية.",
        is_verified: true
      },
      product: {
        name_fr: "Sac Extra Pocket L19",
        name_ar: "حقيبة إكسترا بوكيت إل 19",
        slug: "extra-pocket-l19",
        image_url: "https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop"
      }
    },
    {
      review: {
        id: "2",
        user: "Marc A.",
        date: "05 Février 2024",
        rating: 5,
        comment_fr: "Une expérience d'achat haut de gamme. La livraison a été rapide et l'emballage était magnifique.",
        comment_ar: "تجربة شراء راقية. كان التوصيل سريعاً والتغليف رائعاً.",
        is_verified: true
      },
      product: {
        name_fr: "Mocassins Classiques en Cuir",
        name_ar: "حذاء لوفر جلد كلاسيكي",
        slug: "classic-leather-loafers",
        image_url: "https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop"
      }
    },
    {
      review: {
        id: "3",
        user: "Elena V.",
        date: "20 Janvier 2024",
        rating: 5,
        comment_fr: "Loro Piana ne déçoit jamais. Cette pièce est devenue un incontournable de ma garde-robe.",
        comment_ar: "لورو بيانا لا تخيب الأمل أبداً. أصبحت هذه القطعة أساسية في خزانة ملابسي.",
        is_verified: true
      },
      product: {
        name_fr: "Lunettes de Soleil Aviateur",
        name_ar: "نظارات شمسية طيار كلاسيكية",
        slug: "classic-aviator",
        image_url: "https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop"
      }
    },
    {
      review: {
        id: "4",
        user: "Hamza K.",
        date: "10 Janvier 2024",
        rating: 4,
        comment_fr: "Très satisfait de mon achat. Le design est intemporel et les matériaux sont nobles.",
        comment_ar: "راضٍ جداً عن مشترياتي. التصميم خالد والمواد راقية.",
        is_verified: true
      }
    }
  ];

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-secondary/10 dark:bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className={`flex flex-col items-center text-center space-y-8 animate-fade-in`}>
            <div className="space-y-4">
              <span className="text-taupe uppercase tracking-[0.4em] text-[10px] md:text-xs font-bold block mb-4">
                Testimonials
              </span>
              <h1 className="text-5xl md:text-7xl lg:text-8xl font-playfair font-black uppercase tracking-tight leading-[0.9] text-gradient">
                {t('title')}
              </h1>
            </div>
            <p className="max-w-2xl text-lg md:text-xl text-muted-foreground font-light leading-relaxed">
              {t('subtitle')}
            </p>
          </div>
        </div>
      </section>

      {/* Summary section */}
      <div className="container mx-auto px-6 mb-32">
        <ReviewsSummary 
          rating={summaryData.rating} 
          totalReviews={summaryData.totalReviews} 
          distribution={summaryData.distribution} 
        />
      </div>

      {/* Testimonials Grid */}
      <section className="container mx-auto px-6 pb-40">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 md:gap-12">
          {reviews.map((item, idx) => (
            <div 
              key={item.review.id} 
              className={idx % 2 === 1 ? "lg:mt-12" : ""}
            >
              <ReviewCard 
                review={item.review as any} 
                product={item.product as any} 
              />
            </div>
          ))}
        </div>
        
        {/* Bottom CTA */}
        <div className="mt-32 text-center border-t border-white/5 pt-20">
          <p className="text-taupe uppercase tracking-[0.3em] text-xs font-bold mb-8">
            Rejoignez l'élite
          </p>
          <button className="px-12 py-5 bg-foreground text-background dark:bg-white dark:text-black rounded-full uppercase text-xs font-black tracking-[.4em] hover:scale-105 transition-transform duration-500 shadow-2xl">
            {t('write_review')}
          </button>
        </div>
      </section>
    </main>
  );
}
