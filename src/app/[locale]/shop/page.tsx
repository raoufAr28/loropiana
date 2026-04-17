import { getTranslations } from "next-intl/server";
import { createSupabaseServer } from "@/utils/supabase/server";
import { ProductCard } from "@/components/ProductCard";
import { ShopFilters } from "@/components/ShopFilters";
import { ShopSearch } from "@/components/ShopSearch";

export default async function ShopPage({
  params: { locale },
  searchParams
}: {
  params: { locale: string },
  searchParams: { [key: string]: string | undefined }
}) {
  const t = await getTranslations("Navigation");
  const f = await getTranslations("Filters");
  const supabase = createSupabaseServer();

  // Fetch Categories for Sidebar Filtering
  const { data: rawCategories } = await supabase.from('categories').select('slug, name_fr, name_ar');
  const categories = (rawCategories || []).map((cat: any) => ({
    slug: cat.slug,
    name: locale === 'fr' ? cat.name_fr : cat.name_ar
  }));

  // Build Supabase Query
  let query = supabase.from('products').select(`
      id, slug, name_fr, name_ar, price, stock_quantity, created_at,
      categories!inner(slug, name_fr, name_ar),
      product_images(image_url, is_primary)
  `);

  if (searchParams.category) {
    query = query.eq('categories.slug', searchParams.category);
  }


  if (searchParams.search) {
    const searchTerm = `%${searchParams.search}%`;
    query = query.or(`name_fr.ilike.${searchTerm},name_ar.ilike.${searchTerm},description_fr.ilike.${searchTerm},description_ar.ilike.${searchTerm}`);
  }

  if (searchParams.inStock === 'true') {
    query = query.gt('stock_quantity', 0);
  }

  if (searchParams.sort === 'price_asc') {
    query = query.order('price', { ascending: true });
  } else if (searchParams.sort === 'price_desc') {
    query = query.order('price', { ascending: false });
  } else {
    query = query.order('created_at', { ascending: false });
  }

  const { data: rawProducts, error } = await query;

  if (error) {
    console.error("Supabase Error during filtering:", error.message);
  }

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
      category: locale === 'fr' ? p.categories?.name_fr : p.categories?.name_ar,
    };
  });

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="mt-12 md:mt-4 flex flex-col items-center text-center mb-16 gap-10">
        <div>
          <h1 className="text-5xl md:text-7xl font-playfair font-black uppercase tracking-[0.1em] text-gradient mb-6">
            {t('shop')}
          </h1>
          <p className="text-taupe max-w-2xl mx-auto text-lg md:text-xl font-medium opacity-80 leading-relaxed">
            {locale === 'fr'
              ? "Explorez notre collection de pièces intemporelles, confectionnées avec les matériaux les plus nobles pour une élégance absolue."
              : "استكشف مجموعتنا من القطع الخالدة، المصنوعة من أنبل المواد لأناقة مطلقة."}
          </p>
        </div>
        <ShopSearch locale={locale} categories={categories} />
      </div>

      <div className="flex flex-col md:flex-row gap-8 lg:gap-16">
        <ShopFilters categories={categories} />

        <div className="flex-1">
          <div className="flex justify-between items-center mb-8 text-sm uppercase tracking-widest text-taupe border-b border-gray-100 dark:border-gray-900 pb-4">
            <span>{products.length} {products.length > 1 ? 'articles' : 'article'}</span>
          </div>

          <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-x-8 gap-y-12">
            {products.map((product: any) => (
              <ProductCard key={product.id} product={product} />
            ))}
            {products.length === 0 && (
              <p className="text-taupe col-span-full py-20 text-center border border-dashed border-gray-300 dark:border-gray-800">
                Aucun produit ne correspond à ces filtres. Essayez d'élargir votre recherche.
              </p>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
