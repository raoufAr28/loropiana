import { getTranslations } from "next-intl/server";
import Link from "next/link";
import { XCircle } from "lucide-react";

export default async function CheckoutCancelPage({ params: { locale } }: { params: { locale: string } }) {
  const t = await getTranslations("Checkout");

  return (
    <div className="flex flex-col items-center justify-center min-h-[70vh] px-4 text-center">
      <XCircle size={64} className="text-red-500 mb-8 opacity-80" />
      <h1 className="text-4xl md:text-5xl font-playfair font-bold uppercase tracking-wide mb-6">
        {t('cancel_title')}
      </h1>
      <p className="text-taupe text-lg max-w-xl mb-12 leading-relaxed">
        {t('cancel_desc')}
      </p>
      <div className="flex gap-4">
        <Link href={`/${locale}/cart`} className="bg-foreground text-background px-8 py-4 uppercase text-sm tracking-widest font-bold hover:bg-[#383838] dark:hover:bg-[#ccc] transition-colors">
          {t('back_to_cart')}
        </Link>
      </div>
    </div>
  );
}
