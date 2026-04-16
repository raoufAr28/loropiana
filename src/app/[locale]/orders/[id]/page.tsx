"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/utils/currency";
import { StatusBadge } from "@/components/StatusBadge";
import { TrackingTimeline } from "@/components/TrackingTimeline";
import Link from "next/link";
import { ChevronRight, ArrowLeft, ArrowRight, Package, MapPin, Receipt, ShieldCheck } from "lucide-react";
import { useParams, useRouter } from "next/navigation";

export default function OrderDetailsPage() {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const { id } = useParams();
  const router = useRouter();
  
  const [order, setOrder] = useState<any>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrder = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user && id) {
        const { data, error } = await supabase.from('orders')
          .select('*, order_items(*, products(*, product_images(*)))')
          .eq('id', id)
          .eq('user_id', user.id)
          .single();
        
        if (error || !data) {
          router.push(`/${locale}/orders`);
          return;
        }
        // Cast numeric fields to prevent NaN display
        const safeOrder = {
          ...data,
          total_amount: Number(data.total_amount) || 0,
          order_items: data.order_items?.map((item: any) => ({
            ...item,
            unit_price: Number(item.unit_price) || 0,
            quantity: Number(item.quantity) || 1,
          })),
        };
        setOrder(safeOrder);
      }
      setLoading(false);
    };
    fetchOrder();
  }, [id]);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#00487A] rounded-full animate-spin" />
      </div>
    );
  }

  if (!order) return null;

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      {/* HEADER & NAVIGATION */}
      <Link 
        href={`/${locale}/orders`} 
        className="inline-flex items-center gap-2 text-[10px] font-black uppercase tracking-[0.3em] text-[#00487A] hover:opacity-70 transition-all mb-8 group"
      >
        <ArrowLeft size={16} className={`${isRTL ? 'rotate-180' : ''} group-hover:-translate-x-1 transition-transform`} />
        {locale === 'fr' ? 'Retour aux Commandes' : 'العودة للطلبات'}
      </Link>

      <div className="flex flex-col md:flex-row justify-between items-start md:items-end gap-6 mb-12">
        <div>
          <h1 className="text-4xl md:text-5xl font-playfair font-black uppercase tracking-widest text-slate-900 leading-tight">
            #{order.id.split('-')[0].toUpperCase()}
          </h1>
          <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-[10px] flex items-center gap-2">
            <ShieldCheck size={14} className="text-[#00487A]" />
            Loro Piana • Excellence Verified
          </p>
        </div>
        <div className="flex flex-col items-end gap-2">
           <StatusBadge status={order.status} />
           <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("tracking")}</p>
        </div>
      </div>

      {/* TRACKING TIMELINE */}
      <div className="bg-white p-8 md:p-12 rounded-[3.5rem] border border-slate-100 shadow-xl mb-12 relative overflow-hidden">
         <div className="absolute top-0 right-0 w-32 h-32 bg-[#00487A]/5 blur-[60px] rounded-full" />
         <TrackingTimeline currentStatus={order.status} />
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
         {/* LEFT COLUMN: ITEMS */}
         <div className="lg:col-span-2 space-y-6">
            <div className="bg-white p-8 md:p-10 rounded-[3rem] border border-slate-100 shadow-sm">
               <h3 className="font-playfair text-2xl uppercase tracking-widest mb-10 flex items-center gap-4">
                  <Package className="text-[#00487A]" size={24} />
                  {t("items")}
               </h3>
               <div className="space-y-6">
                  {order.order_items?.map((item: any) => (
                    <div key={item.id} className="flex justify-between items-center group">
                      <div className="flex gap-6 items-center">
                         <div className="w-16 h-20 rounded-2xl overflow-hidden bg-slate-50 border border-slate-100 flex-shrink-0">
                            <img src={item.products?.product_images?.[0]?.image_url} className="w-full h-full object-cover transition-transform duration-700 group-hover:scale-110" />
                         </div>
                         <div>
                            <p className="text-sm font-black text-slate-950 uppercase tracking-widest">{item.products?.name_fr}</p>
                            <p className="text-[10px] font-bold text-slate-400 uppercase tracking-[0.2em] mt-1 italic">
                               Loro Piana • {locale === 'fr' ? 'Art de Vivre' : 'فن الحياة'}
                            </p>
                            <p className="text-[10px] font-black text-[#00487A] uppercase mt-2">Qté: {item.quantity}</p>
                         </div>
                      </div>
                      <div className="text-right">
                        <p className="text-sm font-black text-slate-900">{formatPrice(item.unit_price * item.quantity, locale)}</p>
                        <p className="text-[9px] text-slate-400 font-bold opacity-60 uppercase">{formatPrice(item.unit_price, locale)} unit</p>
                      </div>
                    </div>
                  ))}
               </div>
            </div>
         </div>

         {/* RIGHT COLUMN: ADDRESS & SUMMARY */}
         <div className="space-y-8">
            <div className="bg-slate-50 p-8 rounded-[3rem] border border-slate-100">
               <h4 className="text-[10px] font-black text-slate-400 uppercase tracking-[0.3em] mb-6 flex items-center gap-3">
                  <MapPin size={16} className="text-[#00487A]" />
                  {t("shipping_address")}
               </h4>
               <div className="space-y-1 text-[#00487A]">
                  <p className="text-sm font-black uppercase">{order.shipping_address?.firstName} {order.shipping_address?.lastName}</p>
                  <p className="text-xs font-bold leading-relaxed opacity-80">{order.shipping_address?.address}</p>
                  <p className="text-xs font-bold uppercase">{order.shipping_address?.city}, {order.shipping_address?.postalCode}</p>
                  <p className="text-xs font-black mt-4 border-t border-[#00487A]/10 pt-4">{order.shipping_address?.phone}</p>
               </div>
            </div>

            <div className="bg-[#00487A] p-8 rounded-[3rem] text-white shadow-2xl relative overflow-hidden group">
               <div className="absolute top-0 right-0 w-32 h-32 bg-white/10 blur-[50px] rounded-full group-hover:scale-150 transition-transform duration-1000" />
               <h4 className="text-[10px] font-black uppercase tracking-[0.4em] mb-10 opacity-70 flex items-center gap-3">
                  <Receipt size={16} />
                  {t("summary")}
               </h4>
               <div className="space-y-4">
                  <div className="flex justify-between items-center text-[10px] font-black uppercase tracking-widest opacity-60">
                     <span>{locale === 'fr' ? 'Livraison' : 'الشحن'}</span>
                     <span className="text-green-400">{locale === 'fr' ? 'Offerte' : 'مجاني'}</span>
                  </div>
                  <div className="pt-4 border-t border-white/10 flex justify-between items-end">
                     <span className="text-[10px] font-black uppercase tracking-[0.2em]">{t("total")}</span>
                     <span className="text-3xl font-black">{formatPrice(order.total_amount, locale)}</span>
                  </div>
                  <p className="text-[9px] font-bold text-center mt-8 opacity-40 uppercase tracking-[0.2em]">
                     {locale === 'fr' ? 'Paiement à la livraison' : 'الدفع عند الاستلام'} (COD)
                  </p>
               </div>
            </div>
         </div>
      </div>
    </div>
  );
}
