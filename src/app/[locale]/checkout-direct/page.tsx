"use client";

import { useCartStore } from "@/store/useCartStore";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useMemo } from "react";
import { formatPrice } from "@/utils/currency";
import { supabase } from "@/utils/supabase/client";
import { Loader2, Package, Truck, CheckCircle, ChevronRight, MapPin } from "lucide-react";
import { getShippingFee } from "@/utils/delivery/pricing";
import { WILAYAS } from "@/utils/delivery/wilayas";

export default function CheckoutDirectPage() {
  const { items, getTotalPrice, clearCart } = useCartStore();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const [loading, setLoading] = useState(false);

  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    phone: "",
    wilaya: "",
    commune: "",
    address: "",
    deliveryType: "domicile" as "domicile" | "bureau"
  });

  const currentWilayaCode = useMemo(() =>
    WILAYAS.find(w => w.name === formData.wilaya)?.code,
    [formData.wilaya]);

  const shippingFee = useMemo(() =>
    getShippingFee(currentWilayaCode, formData.deliveryType),
    [currentWilayaCode, formData.deliveryType]);

  const baseDomicileFee = useMemo(() => getShippingFee(currentWilayaCode, 'domicile'), [currentWilayaCode]);
  const baseBureauFee = useMemo(() => getShippingFee(currentWilayaCode, 'bureau'), [currentWilayaCode]);


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({
      ...prev,
      [name]: value,
      // Clear commune if wilaya changes
      ...(name === 'wilaya' ? { commune: "" } : {})
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    if (items.length === 0) return;
    setLoading(true);

    try {
      // 0. Validation
      if (formData.deliveryType === 'domicile' && formData.address.trim().length < 5) {
        alert(locale === 'fr' ? "Veuillez entrer une adresse complète (min 5 caractères)" : "يرجى إدخال عنوان كامل (5 أحرف على الأقل)");
        setLoading(false);
        return;
      }

      // 1. Create order in Supabase
      const total = getTotalPrice();
      const { data: order, error: orderError } = await supabase
        .from('orders')
        .insert({
          total_amount: total + shippingFee,
          status: 'pending',
          shipping_address: {
            ...formData,
            country: 'Algérie',
            code_wilaya: WILAYAS.find(w => w.name === formData.wilaya)?.code
          },
          shipping_fee: shippingFee,
          delivery_type: formData.deliveryType,
          payment_method: 'cash_on_delivery'
        })
        .select()
        .single();

      if (orderError) throw orderError;

      // 2. Insert Items
      const { error: itemsError } = await supabase
        .from('order_items')
        .insert(items.map(item => ({
          order_id: order.id,
          product_id: item.id,
          quantity: item.quantity,
          unit_price: item.price
        })));

      if (itemsError) throw itemsError;

      // 3. Clear cart and redirect
      clearCart();
      router.push(`/${locale}/checkout/success?orderId=${order.id}`);

    } catch (err: any) {
      console.error(err);
      alert(locale === 'fr' ? `Erreur: ${err.message}` : `خطأ: ${err.message}`);
    } finally {
      setLoading(false);
    }
  };


  if (items.length === 0) {
    return (
      <div className="min-h-screen flex items-center justify-center text-center py-40 font-playfair text-2xl animate-pulse">
        {locale === 'fr' ? "Votre écrin est vide." : "حقيبتكم فارغة."}
      </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-16 md:py-32 max-w-7xl" dir={isRTL ? "rtl" : "ltr"}>
      <div className="grid lg:grid-cols-2 gap-20 items-start">

        {/* FORM */}
        <div className="space-y-12">
          <div className="space-y-4">
            <h2 className="text-4xl font-black uppercase tracking-tighter">
              {locale === 'fr' ? "Finalisation Express" : "إتمام الطلب السريع"}
            </h2>
            <p className="text-muted-foreground uppercase text-[10px] font-bold tracking-[0.2em] opacity-60 flex items-center gap-2">
              <Truck size={14} /> Expédition via Ecotrack (Traitement Manuel)
            </p>
          </div>

          <form onSubmit={handleCheckout} className="space-y-8">
            <div className="grid grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{locale === 'fr' ? "Prénom" : "الاسم"}</label>
                <input required name="firstName" value={formData.firstName} onChange={handleChange} className="luxury-input" placeholder="..." />
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{locale === 'fr' ? "Nom" : "اللقب"}</label>
                <input required name="lastName" value={formData.lastName} onChange={handleChange} className="luxury-input" placeholder="..." />
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{locale === 'fr' ? "Téléphone" : "رقم الهاتف"}</label>
              <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="luxury-input" placeholder="+213 -- -- -- -- --" />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{locale === 'fr' ? "Wilaya" : "الولاية"}</label>
                <select required name="wilaya" value={formData.wilaya} onChange={handleChange} className="luxury-input appearance-none bg-background">
                  <option value="">{locale === 'fr' ? "Sélectionner..." : "اختر الولاية"}</option>
                  {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                </select>
              </div>
              <div className="space-y-2">
                <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{locale === 'fr' ? "baladia" : "البلدية"}</label>
                <input required name="commune" value={formData.commune} onChange={handleChange} className="luxury-input" placeholder="..." />
              </div>
            </div>

            <div className="space-y-4 pt-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">{locale === 'fr' ? "Type de Livraison" : "نوع التوصيل"}</label>
              <div className="grid grid-cols-2 gap-4">
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: 'domicile' })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.deliveryType === 'domicile' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{locale === 'fr' ? "À Domicile" : "توصيل للمنزل"}</span>
                  <span className="text-[10px] font-black text-primary">{baseDomicileFee} DZD</span>
                </button>
                <button
                  type="button"
                  onClick={() => setFormData({ ...formData, deliveryType: 'bureau' })}
                  className={`p-4 rounded-2xl border-2 transition-all flex flex-col items-center gap-2 ${formData.deliveryType === 'bureau' ? 'border-primary bg-primary/5' : 'border-border hover:border-primary/50'}`}
                >
                  <span className="text-xs font-bold uppercase tracking-widest">{locale === 'fr' ? "Bureau / Relais" : "مكتب / نقطة استلام"}</span>
                  <span className="text-[10px] font-black text-primary">{baseBureauFee} DZD</span>
                </button>
              </div>
            </div>

            <div className="space-y-2">
              <label className="text-[10px] font-black uppercase tracking-widest text-muted-foreground ml-1">
                {locale === 'fr' ? "Adresse complète" : "العنوان الكامل"}
              </label>
              <textarea 
                required={formData.deliveryType === 'domicile'} 
                name="address" 
                value={formData.address} 
                onChange={handleChange as any} 
                rows={3} 
                className="luxury-input resize-none" 
                placeholder={formData.deliveryType === 'bureau' 
                  ? (locale === 'fr' ? "Facultatif (ex: point de repère, quartier...)" : "اختياري (مثال: معلم مميز، حي...)")
                  : "..."
                } 
              />
            </div>

            <div className="pt-6">
              <button
                type="submit"
                disabled={loading}
                className="w-full btn-glow-blue py-6 rounded-3xl text-[10px] font-black uppercase tracking-[0.4em] shadow-2xl transition-all hover:scale-[1.02] disabled:opacity-50 flex items-center justify-center gap-3"
              >
                {loading ? <Loader2 className="animate-spin" size={18} /> : null}
                {locale === 'fr' ? "CONFIRMER L'ACHAT" : "تأكيد الشراء"}
              </button>
            </div>
          </form>
        </div>

        {/* SUMMARY */}
        <div className="lg:sticky lg:top-32 bg-muted/30 p-10 rounded-[3rem] border border-border/50">
          <h3 className="text-xl font-playfair uppercase tracking-widest mb-10 text-center">{locale === 'fr' ? "VOTRE ÉCRIN" : "حقيبة التسوق"}</h3>

          <div className="space-y-8 mb-12 max-h-[400px] overflow-y-auto custom-scrollbar pr-4">
            {items.map(item => (
              <div key={item.id} className="flex justify-between items-center group">
                <div className="flex items-center gap-4">
                  <div className="w-16 h-20 bg-muted rounded-2xl overflow-hidden border border-border shadow-sm">
                    <img src={item.image_url} alt={item.name} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                  </div>
                  <div>
                    <p className="text-xs font-black uppercase tracking-widest">{item.name}</p>
                    <p className="text-[10px] text-muted-foreground font-bold mt-1">Qté: {item.quantity}</p>
                  </div>
                </div>
                <span className="font-black text-sm">{formatPrice(item.price * item.quantity, locale)}</span>
              </div>
            ))}
          </div>

          <div className="pt-8 border-t border-border space-y-4">
            <div className="flex justify-between text-muted-foreground text-[10px] font-black uppercase tracking-widest">
              <span>{locale === 'fr' ? "LIVRAISON" : "الشحن"}</span>
              <span className="text-primary">+{formatPrice(shippingFee, locale)}</span>
            </div>
            <div className="flex justify-between items-end pt-4">
              <span className="text-xs font-black uppercase tracking-[0.2em] opacity-40">{locale === 'fr' ? "TOTAL À PAYER" : "المجموع الكلي"}</span>
              <span className="text-4xl font-black tracking-tighter text-gradient leading-none">
                {formatPrice(getTotalPrice() + shippingFee, locale)}
              </span>
            </div>
          </div>

          <div className="mt-12 p-6 bg-primary/5 rounded-2xl border border-primary/10 flex items-center gap-4">
            <div className="w-10 h-10 bg-primary/10 rounded-full flex items-center justify-center text-primary">
              <MapPin size={20} />
            </div>
            <div>
              <p className="text-[10px] font-black uppercase tracking-widest text-primary leading-tight">Paiement à la livraison</p>
              <p className="text-[8px] font-bold text-muted-foreground mt-1 uppercase">Algérie • Livraison Express Secured</p>
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
