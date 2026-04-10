import { getTranslations } from "next-intl/server";
import { createSupabaseServer } from "@/utils/supabase/server";
import { AddToCart } from "@/components/AddToCart";
import { ReviewsSummary } from "@/components/ReviewsSummary";
import { ReviewCard } from "@/components/ReviewCard";
import { notFound } from "next/navigation";

export default async function ProductDetailPage({ params: { slug, locale } }: { params: { slug: string, locale: string } }) {
  const t = await getTranslations("Navigation");
  const supabase = createSupabaseServer();
  
  const { data: product, error } = await supabase
    .from('products')
    .select(`
      id, slug, name_fr, name_ar, description_fr, description_ar, price,
      categories(name_fr, name_ar),
      product_images(image_url, is_primary)
    `)
    .eq('slug', slug)
    .single();

  if (error || !product) {
    notFound();
  }

  const name = locale === 'fr' ? product.name_fr : product.name_ar;
  const description = locale === 'fr' ? product.description_fr : product.description_ar;
  const categoryName = locale === 'fr' ? (product.categories as any)?.name_fr : (product.categories as any)?.name_ar;
  const primaryImage = product.product_images?.find((img: any) => img.is_primary)?.image_url 
                       || product.product_images?.[0]?.image_url;

  return (
    <div className="container mx-auto px-4 py-12 md:py-20">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12">
        {/* Gallery */}
        <div className="flex flex-col gap-4">
          <div className="aspect-[3/4] bg-beige dark:bg-[#1a1a1a] w-full relative overflow-hidden">
             {primaryImage ? (
                <img src={primaryImage} className="object-cover w-full h-full" alt={name} />
             ) : (
                <div className="w-full h-full flex items-center justify-center text-taupe">No image</div>
             )}
          </div>
        </div>

        {/* Product Info */}
        <div className="flex flex-col gap-6 sticky top-24 h-fit">
          <span className="text-sm uppercase tracking-widest text-taupe">{categoryName}</span>
          <h1 className="text-4xl md:text-5xl font-playfair font-bold uppercase">
            {name}
          </h1>
          <p className="text-2xl font-semibold">€{Number(product.price).toFixed(2)}</p>
          
          <div className="h-[1px] w-full bg-gray-200 dark:bg-gray-800 my-4" />
          
          <p className="text-taupe leading-relaxed">
            {description}
          </p>

          <AddToCart product={{
            id: product.id,
            name: name,
            price: product.price,
            image_url: primaryImage
          }} />
        </div>
      </div>
    </div>
  );
}
