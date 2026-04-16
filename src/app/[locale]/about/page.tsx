import { getTranslations } from 'next-intl/server';
import { ReviewsSummary } from "@/components/ReviewsSummary";
import { ReviewsGallery } from "@/components/ReviewsGallery";
import { supabase } from "@/utils/supabase/client";

export default async function AboutPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('Reviews');

  // Fetch Real Reviews (Approved Only)
  const { data: rawReviews } = await supabase
    .from("reviews")
    .select(`
      *,
      products (
        id,
        name_fr,
        name_ar,
        slug,
        product_images (image_url)
      )
    `)
    .eq("status", "approved")
    .order("created_at", { ascending: false });

  // Compute Stats
  const validReviews = rawReviews || [];
  const totalReviews = validReviews.length;
  const averageRating = totalReviews > 0 
    ? (validReviews.reduce((acc, r) => acc + r.rating, 0) / totalReviews).toFixed(1)
    : 0;

  const distribution = {
    5: validReviews.filter(r => r.rating === 5).length,
    4: validReviews.filter(r => r.rating === 4).length,
    3: validReviews.filter(r => r.rating === 3).length,
    2: validReviews.filter(r => r.rating === 2).length,
    1: validReviews.filter(r => r.rating === 1).length,
  };

  // Fetch Products (for the form selection)
  const { data: products } = await supabase
    .from("products")
    .select("id, name_fr, name_ar, slug")
    .limit(50);

  return (
    <main className="min-h-screen bg-background text-foreground overflow-hidden">
      {/* Hero Section */}
      <section className="relative pt-32 pb-20 px-6 overflow-hidden">
        {/* Decorative elements */}
        <div className="absolute top-0 left-1/2 -translate-x-1/2 w-full h-[500px] bg-secondary/10 dark:bg-secondary/5 blur-[120px] rounded-full pointer-events-none" />
        <div className="container mx-auto max-w-6xl relative z-10">
          <div className="flex flex-col items-center text-center space-y-8 animate-fade-in">
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
          rating={Number(averageRating)} 
          totalReviews={totalReviews} 
          distribution={distribution} 
        />
      </div>

      {/* Testimonials Gallery (Live Component) */}
      <ReviewsGallery 
        initialReviews={validReviews} 
        products={products || []} 
        locale={locale}
      />
    </main>
  );
}
