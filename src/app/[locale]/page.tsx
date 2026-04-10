import { getTranslations } from 'next-intl/server';
import Link from 'next/link';
import { createSupabaseServer } from "@/utils/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { HeroSection } from "@/components/HeroSection";
import { HomeCategories } from "@/components/HomeCategories";

export default async function Home({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations('Home');
  const supabase = createSupabaseServer();

  const { data: rawProducts } = await supabase
    .from('products')
    .select(`
      id, slug, name_fr, name_ar, price,
      categories(name_fr, name_ar),
      product_images(image_url, is_primary)
    `)
    .eq('is_featured', true)
    .limit(4);

  const products = (rawProducts || []).map((p: any) => {
    const primaryImage = p.product_images?.find((img: any) => img.is_primary)?.image_url 
                         || p.product_images?.[0]?.image_url 
                         || '';
                         
    return {
      id: p.id,
      slug: p.slug,
      name: locale === 'fr' ? p.name_fr : p.name_ar,
      price: p.price,
      image_url: primaryImage,
      category: locale === 'fr' ? (p.categories as any)?.name_fr : (p.categories as any)?.name_ar,
    };
  });

  return (
    <div className="flex flex-col items-center justify-center min-h-screen">
      <HeroSection locale={locale} />

      {/* Featured Section */}
      <section className="w-full max-w-7xl mx-auto px-4 py-20 pb-32">
        <div className="flex justify-between items-end mb-12">
           <h2 className="text-3xl md:text-4xl font-playfair font-bold uppercase tracking-wide">
             {t('featured')}
           </h2>
           <Link href={`/${locale}/shop`} className="text-taupe hover:text-foreground transition-colors uppercase text-sm tracking-widest font-semibold flex gap-2 items-center">
              Voir tout →
           </Link>
        </div>

        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-8">
          {products.map((product: any) => (
            <ProductCard key={product.id} product={product} />
          ))}
          {products.length === 0 && (
            <div className="col-span-full py-16 text-center border border-dashed border-gray-300 dark:border-gray-800 text-taupe">
               <p className="text-xl font-playfair mb-2">Supabase non configuré ou base de données vide</p>
               <p className="text-sm">Insérez les données du fichier seed.sql pour voir les produits à la une.</p>
            </div>
          )}
        </div>
      </section>

      {/* Editorial Categories Section */}
      <HomeCategories locale={locale} />
    </div>
  );
}
