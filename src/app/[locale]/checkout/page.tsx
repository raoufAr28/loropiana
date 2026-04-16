"use client";

import { useCartStore } from "@/store/useCartStore";
import { useLocale, useTranslations } from "next-intl";
import { useRouter } from "next/navigation";
import { useState, useEffect, useMemo } from "react";
import { formatPrice } from "@/utils/currency";
import { supabase } from "@/utils/supabase/client";
import { getShippingFee } from "@/utils/delivery/pricing";
import { WILAYAS } from "@/utils/delivery/wilayas";

export default function CheckoutPage() {
  const t = useTranslations("Checkout");
  const navigationT = useTranslations("Navigation");
  const { items, getTotalPrice, clearCart } = useCartStore();
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();
  const [userId, setUserId] = useState<string | null>(null);

  const [loading, setLoading] = useState(false);

  useEffect(() => {
    supabase.auth.getUser().then(({ data }) => {
      if (data?.user) {
        setUserId(data.user.id);
        // Pre-fill email if user is logged in
        setFormData(prev => ({ ...prev, email: data.user.email || "" }));
      }
    });
  }, []);
  const [formData, setFormData] = useState({
    firstName: "",
    lastName: "",
    email: "",
    phone: "",
    address: "",
    wilaya: "",
    commune: "",
    city: "",
    postalCode: "",
    country: "Algérie",
    note: "",
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

  const finalTotal = getTotalPrice() + shippingFee;


  const handleChange = (e: React.ChangeEvent<HTMLInputElement | HTMLSelectElement | HTMLTextAreaElement>) => {
    const { name, value } = e.target;
    setFormData(prev => ({ 
      ...prev, 
      [name]: value,
      ...(name === 'wilaya' ? { commune: "" } : {})
    }));
  };

  const handleCheckout = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);

    try {
      const response = await fetch('/api/checkout', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          items,
          email: formData.email,
          user_id: userId, // Pass sub user_id
          total_amount: finalTotal,
          delivery_type: formData.deliveryType,
          shipping_fee: shippingFee,
          shipping_address: {
            firstName: formData.firstName,
            lastName: formData.lastName,
            phone: formData.phone,
            email: formData.email,
            address: formData.address,
            wilaya: formData.wilaya,
            commune: formData.commune,
            city: formData.city,
            postalCode: formData.postalCode,
            country: formData.country,
            note: formData.note,
            deliveryType: formData.deliveryType,
            code_wilaya: WILAYAS.find(w => w.name === formData.wilaya)?.code
          }
        }),
      });

      // Check if response is JSON
      const contentType = response.headers.get("content-type");
      let result;

      if (contentType && contentType.indexOf("application/json") !== -1) {
        result = await response.json();
      } else {
        const textError = await response.text();
        console.error("Non-JSON API error:", textError);
        throw new Error(locale === 'fr'
          ? "Le serveur a renvoyé une réponse invalide (HTML). Veuillez consulter les journaux."
          : "أرجع الخادم استجابة غير صالحة. يرجى مراجعة السجلات.");
      }

      console.log("CHECKOUT RESPONSE:", result);

      // ❌ إذا فيه خطأ حقيقي
      if (!result.success) {
        throw new Error(result.details || result.error || "Checkout failed");

      }

      // ✅ نجاح (حتى لو response مش 200)
      clearCart();
      router.push(`/${locale}/checkout/success?orderId=${result.orderId}`);

    } catch (err: any) {
      console.error("Checkout process failed:", err);
      const displayMessage = err.message || (locale === 'fr' ? "Erreur inconnue" : "خطأ غير معروف");
      alert(locale === 'fr'
        ? `Échec de la commande : ${displayMessage}`
        : `فشل الطلب : ${displayMessage}`);
    } finally {
      setLoading(false);
    }
  };

  if (items.length === 0) return (
    <div className="text-center py-40 font-playfair text-2xl animate-pulse">
      {locale === 'fr' ? "Votre écrin est vide." : "حقيبتكم فارغة."}
    </div>
  );

  return (
    <div className={`container mx-auto px-4 py-12 md:py-24 max-w-6xl`} dir={isRTL ? "rtl" : "ltr"}>
      <div className="text-center mb-16">
        <h1 className="text-5xl md:text-6xl font-playfair font-black uppercase tracking-[0.2em] text-gradient">
          {locale === 'fr' ? "Finalisation Prestige" : "إتمام الطلب الفاخر"}
        </h1>
        <p className="text-muted-foreground mt-4 uppercase tracking-widest text-xs font-bold opacity-60">
          Loro Piana • Excellence Services
        </p>
      </div>

      <div className="flex flex-col lg:flex-row gap-16 items-start">
        {/* FORM SECTION */}
        <div className="flex-1 w-full translate-z-0">
          <form id="checkout-form" onSubmit={handleCheckout} className="flex flex-col gap-10">
            <div className="space-y-6">
              <h3 className="font-playfair text-2xl uppercase tracking-widest border-b border-border pb-4">
                {locale === 'fr' ? "Coordonnées de Livraison" : "تفاصيل الشحن"}
              </h3>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Prénom" : "الاسم الأول"}
                  </label>
                  <input required name="firstName" value={formData.firstName} onChange={handleChange} className="luxury-input" placeholder="Marc-Antoine" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Nom" : "اللقب"}
                  </label>
                  <input required name="lastName" value={formData.lastName} onChange={handleChange} className="luxury-input" placeholder="De la Roche" />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">Email</label>
                  <input required name="email" type="email" value={formData.email} onChange={handleChange} className="luxury-input" placeholder="excellence@loropiana.com" />
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Téléphone" : "الهاتف"}
                  </label>
                  <input required name="phone" type="tel" value={formData.phone} onChange={handleChange} className="luxury-input" placeholder="+213 --- -- -- --" />
                </div>
              </div>

              <div className="flex flex-col gap-6 p-6 glass-panel-heavy rounded-3xl border border-primary/20">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black text-primary block ml-1">
                  {locale === 'fr' ? "Type de Livraison" : "نوع التوصيل"}
                </label>
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

              <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Wilaya" : "الولاية"}
                  </label>
                  <select required name="wilaya" value={formData.wilaya} onChange={handleChange} className="luxury-input appearance-none bg-background">
                    <option value="">{locale === 'fr' ? "Sélectionner..." : "اختر الولاية"}</option>
                    {WILAYAS.map(w => <option key={w.code} value={w.name}>{w.name}</option>)}
                  </select>
                </div>
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Commune" : "البلدية"}
                  </label>
                  <input required name="commune" value={formData.commune} onChange={handleChange} className="luxury-input" placeholder="..." />
                </div>
              </div>

              {formData.deliveryType === 'domicile' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Adresse de Résidence" : "عنوان الإقامة"}
                  </label>
                  <input required name="address" value={formData.address} onChange={handleChange} className="luxury-input" placeholder="128 Rue de la Liberté" />
                </div>
              )}

              {formData.deliveryType === 'bureau' && (
                <div className="flex flex-col gap-2">
                  <label className="text-[10px] uppercase tracking-[0.2em] font-black text-muted-foreground block ml-1">
                    {locale === 'fr' ? "Nom du Bureau / Point Relais (Optionnel)" : "اسم المكتب / نقطة الاستلام (اختياري)"}
                  </label>
                  <input name="address" value={formData.address} onChange={handleChange} className="luxury-input" placeholder="Bureau de Poste Central..." />
                </div>
              )}

              <div className="flex flex-col gap-2 text-muted-foreground">
                <label className="text-[10px] uppercase tracking-[0.2em] font-black block ml-1">
                  {locale === 'fr' ? "Instructions Spéciales (Optionnel)" : "تعليمات خاصة (اختياري)"}
                </label>
                <textarea name="note" value={formData.note} onChange={handleChange} rows={3} className="luxury-input resize-none" placeholder="..." />
              </div>
            </div>

            <div className="space-y-6">
              <h3 className="font-playfair text-2xl uppercase tracking-widest border-b border-border pb-4">
                {locale === 'fr' ? "Art de Paiement" : "طريقة الدفع"}
              </h3>

              <div className="p-8 glass-panel-heavy border-2 border-primary bg-muted rounded-[2rem] flex items-center gap-6 relative overflow-hidden group">
                <div className="absolute top-0 right-0 w-32 h-32 bg-primary opacity-10 blur-[60px] rounded-full" />
                <div className="w-6 h-6 border-4 border-primary rounded-full flex items-center justify-center">
                  <div className="w-2 h-2 bg-primary rounded-full" />
                </div>
                <div className="flex-1 relative z-10">
                  <p className="font-black uppercase tracking-[0.2em] text-sm text-foreground">
                    {locale === 'fr' ? "Paiement à la livraison (COD)" : "الدفع عند الاستلام"}
                  </p>
                  <p className="text-[10px] text-muted-foreground font-bold mt-1 leading-relaxed max-w-md">
                    {locale === 'fr'
                      ? "Un service de coursiers d'élite assurera la remise de votre écrin. Le règlement s'effectue à la réception."
                      : "ستقوم خدمة التوصيل المتميزة بتسليم طلبيتك. يتم الدفع عند الاستلام."}
                  </p>
                </div>
              </div>
            </div>
          </form>
        </div>

        {/* SUMMARY SECTION */}
        <div className="w-full lg:w-[450px] sticky top-32">
          <div className="glass-panel-ultra rounded-[3rem] p-10 border border-border shadow-2xl overflow-hidden relative">
            <div className="absolute top-0 left-0 w-full h-2 bg-gradient-to-r from-transparent via-primary to-transparent opacity-50" />

            <h3 className="font-playfair text-2xl uppercase tracking-widest mb-10 text-center">
              {locale === 'fr' ? "Votre Sélection" : "اختياراتكم"}
            </h3>

            <div className="flex flex-col gap-6 mb-10 max-h-[400px] overflow-y-auto pr-2 custom-scrollbar">
              {items.map(item => (
                <div key={item.id} className="flex justify-between items-center group">
                  <div className="flex items-center gap-4">
                    <div className="w-12 h-16 rounded-xl overflow-hidden bg-white/5 border border-white/10">
                      <img src={item.image_url} alt={item.name} className="w-full h-full object-cover transition-transform group-hover:scale-110" />
                    </div>
                    <div className="space-y-0.5">
                      <p className="text-xs font-black uppercase tracking-widest truncate max-w-[150px]">{item.name}</p>
                      <p className="text-[10px] text-muted-foreground font-bold">Qté: {item.quantity}</p>
                    </div>
                  </div>
                  <span className="font-black text-sm font-inter">
                    {formatPrice(item.price * item.quantity, locale)}
                  </span>
                </div>
              ))}
            </div>

            <div className="space-y-4 pt-10 border-t border-border">
              <div className="flex justify-between text-muted-foreground text-xs uppercase tracking-widest font-bold">
                <span>{locale === 'fr' ? "Sous-total" : "المجموع الفرعي"}</span>
                <span className="font-inter">{formatPrice(getTotalPrice(), locale)}</span>
              </div>
              <div className="flex justify-between text-muted-foreground text-xs uppercase tracking-widest font-bold">
                <span>{locale === 'fr' ? "Livraison" : "الشحن"}</span>
                <span className="text-primary font-inter">+{formatPrice(shippingFee, locale)}</span>
              </div>
              <div className="flex justify-between font-black text-2xl pt-4 border-t border-border/50">
                <span className="font-playfair tracking-widest uppercase">{locale === 'fr' ? "Total" : "الإجمالي"}</span>
                <span className="text-gradient">
                  {formatPrice(finalTotal, locale)}
                </span>
              </div>
            </div>

            <button
              type="submit"
              form="checkout-form"
              disabled={loading}
              className="w-full mt-12 btn-glow-blue py-6 rounded-full text-[10px] font-black uppercase tracking-[0.4em] transition-all hover:scale-[1.03] active:scale-[0.97] disabled:opacity-50"
            >
              {loading
                ? (locale === 'fr' ? "Validation..." : "جاري التأكيد...")
                : (locale === 'fr' ? "Confirmer la Commande" : "تأكيد الطلب")}
            </button>

            <p className="text-[8px] text-center text-muted-foreground uppercase tracking-[0.3em] mt-6 font-bold opacity-40">
              Secure SSL Encryption • Loro Piana Private
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}
