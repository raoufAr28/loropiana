"use client";

import { useState, useEffect } from "react";
import { supabase } from "@/utils/supabase/client";
import { useLocale, useTranslations } from "next-intl";
import { format } from "date-fns";
import { formatPrice } from "@/utils/currency";
import { StatusBadge } from "@/components/StatusBadge";
import Link from "next/link";
import { ShoppingBag, ChevronRight, Package, Calendar, ArrowRight } from "lucide-react";
import { motion } from "framer-motion";

export default function OrdersPage() {
  const t = useTranslations("Orders");
  const locale = useLocale();
  const isRTL = locale === "ar";
  const [orders, setOrders] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const fetchOrders = async () => {
      const { data: { user } } = await supabase.auth.getUser();
      if (user) {
        const { data } = await supabase.from('orders')
          .select('*, order_items(count)')
          .eq('user_id', user.id)
          .order('created_at', { ascending: false });
        if (data) setOrders(data.map(o => ({ ...o, total_amount: Number(o.total_amount) || 0 })));
      }
      setLoading(false);
    };
    fetchOrders();
  }, []);

  if (loading) {
    return (
      <div className="min-h-screen flex items-center justify-center">
        <div className="w-10 h-10 border-4 border-slate-100 border-t-[#00487A] rounded-full animate-spin" />
      </div>
    );
  }

  return (
    <div className="min-h-screen pt-32 pb-20 px-6 max-w-5xl mx-auto" dir={isRTL ? "rtl" : "ltr"}>
      <header className="mb-12">
        <h1 className="text-4xl md:text-5xl font-playfair font-black uppercase tracking-widest text-[#00487A]">
          {t("my_orders")}
        </h1>
        <p className="text-slate-400 mt-2 font-bold uppercase tracking-widest text-xs">
          Loro Piana • {locale === 'fr' ? 'Historique d\'Excellence' : 'سجل التميز'}
        </p>
      </header>

      {orders.length === 0 ? (
        <div className="text-center py-20 bg-slate-50 rounded-3xl border border-slate-100">
          <div className="w-20 h-20 bg-white rounded-full flex items-center justify-center mx-auto mb-6 shadow-sm">
             <ShoppingBag className="text-slate-200" size={32} />
          </div>
          <p className="text-slate-500 font-medium mb-8 italic">{t("empty")}</p>
          <Link 
            href={`/${locale}/shop`} 
            className="inline-flex items-center gap-2 bg-[#00487A] text-white px-8 py-4 rounded-full text-xs font-black uppercase tracking-widest hover:scale-105 transition-all shadow-lg"
          >
            {t("back_to_shop")}
            <ArrowRight size={16} />
          </Link>
        </div>
      ) : (
        <div className="grid gap-6">
          {orders.map((order, i) => (
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: i * 0.1 }}
              key={order.id}
              className="bg-white p-6 md:p-8 rounded-[2rem] border border-slate-100 shadow-sm hover:shadow-xl hover:border-[#00487A]/20 transition-all group"
            >
              <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
                 <div className="space-y-4">
                    <div className="flex items-center gap-3">
                       <span className="p-2 bg-slate-50 rounded-lg border border-slate-100 group-hover:bg-[#00487A]/5 transition-colors">
                          <Package size={20} className="text-[#00487A]" />
                       </span>
                       <div>
                          <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest">{t("order_id")}{order.id.split('-')[0].toUpperCase()}</p>
                          <div className="flex items-center gap-2 mt-1">
                             <Calendar size={12} className="text-slate-300" />
                             <p className="text-xs font-bold text-slate-600">{format(new Date(order.created_at), 'dd MMMM yyyy')}</p>
                          </div>
                       </div>
                    </div>
                 </div>

                 <div className="flex items-center gap-8 w-full md:w-auto justify-between md:justify-end border-t md:border-none pt-4 md:pt-0">
                    <div className="text-right">
                       <p className="text-[10px] font-black text-slate-400 uppercase tracking-widest mb-1">{t("total")}</p>
                       <p className="text-xl font-black text-slate-900 leading-none">{formatPrice(order.total_amount, locale)}</p>
                    </div>
                    <div className="flex flex-col items-center md:items-end gap-3">
                       <StatusBadge status={order.status} />
                       <Link 
                          href={`/${locale}/orders/${order.id}`}
                          className="flex items-center gap-2 text-[10px] font-black uppercase tracking-widest text-[#00487A] hover:opacity-70 transition-all"
                       >
                          {t("track_order")}
                          <ChevronRight size={14} className={isRTL ? "rotate-180" : ""} />
                       </Link>
                    </div>
                 </div>
              </div>
            </motion.div>
          ))}
        </div>
      )}
    </div>
  );
}
