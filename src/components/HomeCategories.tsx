import { createSupabaseServer } from "@/utils/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import Link from "next/link";
import { ArrowRight } from "lucide-react";

export async function HomeCategories({ locale }: { locale: string }) {
  const supabase = createSupabaseServer();
  
  // Fetch categories with nested products
  // Supabase limits on nested resources via inner join or we just fetch everything if catalog is small
  const { data: categories } = await supabase
    .from('categories')
    .select(`
      id, slug, name_fr, name_ar,
      products (
        id, slug, name_fr, name_ar, price,
        categories(name_fr, name_ar),
        product_images(image_url, is_primary)
      )
    `);

  if (!categories || categories.length === 0) return null;

  return (
    <section className="w-full max-w-7xl mx-auto px-6 lg:px-12 py-24 border-t border-gray-200/50 dark:border-white/5">
      <div className="mb-24 flex flex-col items-center text-center">
        <h2 className="text-4xl md:text-5xl font-playfair font-bold uppercase tracking-[0.2em] text-gradient inline-block">
          {locale === 'fr' ? 'Nos Catégories' : 'فئاتنا'}
        </h2>
        <p className="mt-6 text-taupe uppercase tracking-widest text-xs md:text-sm max-w-xl leading-relaxed">
          {locale === 'fr' 
             ? 'Une sélection de luxe méticuleusement étudiée pour parfaire votre élégance au quotidien.' 
             : 'مجموعة فاخرة مدروسة بعناية لإتقان أناقتك اليومية.'}
        </p>
      </div>

      <div className="flex flex-col gap-32">
        {categories.map((category) => {
          const catName = locale === 'fr' ? category.name_fr : category.name_ar;
          const displayProducts = (category.products || []).slice(0, 4).map((p: any) => ({
             id: p.id,
             slug: p.slug,
             name: locale === 'fr' ? p.name_fr : p.name_ar,
             price: p.price,
             image_url: p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url || '',
             category: locale === 'fr' ? (p.categories as any)?.name_fr : (p.categories as any)?.name_ar,
          }));

          // Avoid displaying empty categories
          if (displayProducts.length === 0) return null;

          return (
            <div key={category.id} className="flex flex-col gap-10">
              {/* Luxury Editorial Header for Category */}
              <div className="flex flex-col md:flex-row justify-between items-end border-b border-foreground/10 dark:border-white/10 pb-6 group">
                <h3 className="text-3xl md:text-4xl font-playfair font-bold uppercase tracking-widest text-foreground group-hover:text-taupe dark:group-hover:text-gold-light transition-colors">
                  {catName}
                </h3>
                
                <Link 
                  href={`/${locale}/shop?category=${category.slug}`}
                  className="flex flex-col items-end gap-2 text-taupe hover:text-foreground dark:hover:text-gold-light transition-colors mt-6 md:mt-0"
                >
                  <span className="uppercase tracking-[0.2em] text-[10px] font-bold opacity-70">
                    {locale === 'fr' ? 'Voir l\'intégralité de la collection' : 'عرض المجموعة كاملة'}
                  </span>
                  <div className="flex items-center gap-4">
                    <span className="text-xs uppercase tracking-widest font-semibold">{catName}</span>
                    <div className="w-12 h-[1px] bg-taupe group-hover:bg-foreground dark:group-hover:bg-gold-light group-hover:w-24 transition-all duration-500 relative flex items-center">
                       <ArrowRight size={14} className="absolute -right-2 transform group-hover:translate-x-2 transition-transform duration-500" />
                    </div>
                  </div>
                </Link>
              </div>

              {/* Products Row Grid */}
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
                 {displayProducts.map((p: any) => (
                   <ProductCard key={p.id} product={p} />
                 ))}
              </div>
            </div>
          );
        })}
      </div>
    </section>
  );
}
