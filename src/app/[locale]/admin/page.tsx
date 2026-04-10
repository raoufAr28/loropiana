"use client";

import { useState, useEffect } from "react";
import { 
  CheckCircle2, 
  AlertCircle,
  AlertTriangle 
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";

// Modular Components
import { AdminSidebar } from "@/components/admin/AdminSidebar";
import { DashboardModule } from "@/components/admin/DashboardModule";
import { CategoriesModule } from "@/components/admin/CategoriesModule";
import { ProductsModule } from "@/components/admin/ProductsModule";
import { OrdersModule } from "@/components/admin/OrdersModule";
import { ReviewsModule } from "@/components/admin/ReviewsModule";

const STOCK_THRESHOLD = 5;

const TABS: Record<string, { fr: string; ar: string }> = {
  overview: { fr: "Tableau de Bord", ar: "لوحة التحكم" },
  categories: { fr: "Catégories", ar: "الأصناف" },
  products: { fr: "Produits", ar: "المنتجات" },
  orders: { fr: "Commandes", ar: "الطلبات" },
  reviews: { fr: "Avis Clients", ar: "آراء العملاء" },
  alerts: { fr: "Alertes Stock", ar: "تنبيهات المخزون" },
};

export default function AdminDashboard() {
  const [activeTab, setActiveTab] = useState("overview");
  const [loading, setLoading] = useState(true);
  const [isAdmin, setIsAdmin] = useState(false);
  const [stats, setStats] = useState({
    revenue: { total: 0, confirmed: 0, today: 0, thisWeek: 0, thisMonth: 0 },
    orders: { total: 0, pending: 0, confirmed: 0, cancelled: 0 },
    inventory: { total: 0, lowStock: 0 },
    reviews: { total: 0, pending: 0, approved: 0 }
  });
  const [recentOrders, setRecentOrders] = useState<any[]>([]);
  const [lowStockItems, setLowStockItems] = useState<any[]>([]);
  const [pendingOrdersCount, setPendingOrdersCount] = useState(0);
  const [pendingReviewsCount, setPendingReviewsCount] = useState(0);
  const [toast, setToast] = useState<any>(null);

  const locale = useLocale() as "fr" | "ar";
  const isRTL = locale === "ar";
  const router = useRouter();

  useEffect(() => { checkAdmin(); }, []);

  const checkAdmin = async () => {
    const { data: { user }, error: authError } = await supabase.auth.getUser();
    if (!user || authError) { router.push(`/${locale}/login`); return; }
    
    // Safety check for developer account OR admin role in profiles
    const isAdminEmail = user.email === "raoufarioua96@gmail.com";
    const { data: profile } = await supabase.from('profiles').select('role').eq('id', user.id).single();
    
    if (isAdminEmail || profile?.role === 'admin') { 
      setIsAdmin(true); 
      fetchGlobalData(); 
    } else { 
      router.push(`/${locale}`); 
    }
  };

  useEffect(() => {
    if (!isAdmin) return;

    const channel = supabase
      .channel('global_admin_updates')
      .on(
        'postgres_changes',
        { event: 'INSERT', schema: 'public', table: 'orders' },
        () => {
          showToast(locale === 'fr' ? 'Nouvelle Collection Registrée' : 'تم تسجيل طلب جديد', 'success');
          // Play subtle notification sound
          try { new Audio('https://assets.mixkit.co/active_storage/sfx/2869/2869-preview.mp3').play(); } catch(e) {}
          fetchGlobalData();
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [isAdmin, locale]);

  const fetchGlobalData = async () => {
    try {
      const [{ data: allOrders }, { data: recentOrdersData }, { data: allReviews }, { count: productsCount }, { data: lowStockRes }] = await Promise.all([
        supabase.from('orders').select('total_amount, status, created_at'),
        supabase.from('orders').select('*, profiles(email)').order('created_at', { ascending: false }).limit(5),
        supabase.from('reviews').select('is_approved'),
        supabase.from('products').select('*', { count: 'exact', head: true }),
        supabase.from('products').select('*, product_images(*)').lte('stock_quantity', STOCK_THRESHOLD).order('stock_quantity', { ascending: true })
      ]);
      
      const now = new Date();
      const today = new Date(now.getFullYear(), now.getMonth(), now.getDate());
      const firstDayOfWeek = new Date(now.setDate(now.getDate() - now.getDay()));
      const firstDayOfMonth = new Date(now.getFullYear(), now.getMonth(), 1);

      let revTotal = 0, revConfirmed = 0, revToday = 0, revWeek = 0, revMonth = 0;
      let ordPending = 0, ordConfirmed = 0, ordCancelled = 0;

      (allOrders || []).forEach(o => {
         const amount = Number(o.total_amount) || 0;
         const d = new Date(o.created_at);
         revTotal += amount;
         
         if (o.status === 'confirmed') {
            revConfirmed += amount;
            if (d >= today) revToday += amount;
            if (d >= firstDayOfWeek) revWeek += amount;
            if (d >= firstDayOfMonth) revMonth += amount;
            ordConfirmed++;
         } else if (o.status === 'pending') {
            ordPending++;
         } else if (o.status === 'cancelled') {
            ordCancelled++;
         }
      });

      let revPending = 0, revApproved = 0;
      (allReviews || []).forEach(r => {
         if (r.is_approved) revApproved++;
         else revPending++;
      });

      setStats({
        revenue: { total: revTotal, confirmed: revConfirmed, today: revToday, thisWeek: revWeek, thisMonth: revMonth },
        orders: { total: (allOrders || []).length, pending: ordPending, confirmed: ordConfirmed, cancelled: ordCancelled },
        inventory: { total: productsCount || 0, lowStock: (lowStockRes || []).length },
        reviews: { total: (allReviews || []).length, pending: revPending, approved: revApproved }
      });
      
      setRecentOrders(recentOrdersData || []);
      setLowStockItems(lowStockRes || []);
      setPendingOrdersCount(ordPending);
      setPendingReviewsCount(revPending);
    } catch (err) { 
      console.error("[FETCH_ADMIN_ERROR]", err); 
    } finally { 
      setLoading(false); 
    }
  };

  const showToast = (m: string, t: 'success' | 'error') => {
    setToast({ m, t });
    setTimeout(() => setToast(null), 5000);
  };

  if (loading || !isAdmin) {
    return (
      <div className="min-h-screen bg-background flex flex-col items-center justify-center gap-6">
        <div className="w-12 h-12 border-4 border-muted border-t-primary animate-spin rounded-full shadow-sm" />
        <p className="text-[10px] font-black uppercase tracking-[0.2em] text-muted-foreground">Authenticating Executive...</p>
      </div>
    );
  }

  return (
    <div
      className={`bg-background flex flex-col lg:flex-row font-inter text-foreground pt-28 ${
        isRTL ? "lg:flex-row-reverse" : ""
      }`}
      dir={isRTL ? "rtl" : "ltr"}
    >
      {/* Toast Notifications */}
      <AnimatePresence>
        {toast && (
          <motion.div 
            initial={{ opacity: 0, y: 10, scale: 0.95 }} 
            animate={{ opacity: 1, y: 0, scale: 1 }} 
            exit={{ opacity: 0, y: 20, scale: 0.95 }} 
            className={`fixed bottom-8 ${isRTL ? 'left-8' : 'right-8'} z-[200] px-6 py-4 rounded-xl ${toast.t === 'success' ? 'bg-primary text-primary-foreground' : 'bg-danger text-danger-foreground'} text-[11px] font-bold uppercase tracking-wider shadow-2xl flex items-center gap-4`}
          >
            {toast.t === 'success' ? <CheckCircle2 size={18} /> : <AlertCircle size={18} />}
            {toast.m}
          </motion.div>
        )}
      </AnimatePresence>

      <AdminSidebar 
        activeTab={activeTab} 
        setActiveTab={setActiveTab} 
        lowStockCount={lowStockItems.length} 
        pendingCount={pendingOrdersCount}
        pendingReviewsCount={pendingReviewsCount}
      />

      <div className="flex-1 flex flex-col relative overflow-hidden min-h-[calc(100vh-7rem)]">
        {/* Aesthetic Background Accents */}
        <div className="absolute top-0 right-0 w-[500px] h-[500px] bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] blur-[150px] rounded-full -translate-y-1/2 translate-x-1/2 pointer-events-none" />
        
        <div className="p-6 md:p-8 max-w-7xl mx-auto w-full relative z-10 flex-1">
          <AnimatePresence mode="wait">
            <motion.div 
              key={activeTab} 
              initial={{ opacity: 0, y: 10 }} 
              animate={{ opacity: 1, y: 0 }} 
              exit={{ opacity: 0, y: -10 }} 
              transition={{ duration: 0.4, ease: "easeOut" }}
            >
              {activeTab === "overview" && (
                <DashboardModule stats={stats} recentOrders={recentOrders} lowStockItems={lowStockItems} />
              )}
              {activeTab === "categories" && (
                <CategoriesModule showToast={showToast} locale={locale} />
              )}
              {activeTab === "products" && (
                <ProductsModule showToast={showToast} locale={locale} />
              )}
              {activeTab === "orders" && (
                <OrdersModule showToast={showToast} locale={locale} />
              )}
              {activeTab === "reviews" && (
                <ReviewsModule showToast={showToast} />
              )}
              {activeTab === "alerts" && (
                <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
                   <div className="bg-[color-mix(in_srgb,var(--danger)_5%,transparent)] border border-[color-mix(in_srgb,var(--danger)_20%,transparent)] p-8 rounded-[3rem] shadow-sm flex items-center gap-6">
                      <div className="w-14 h-14 bg-card rounded-2xl flex items-center justify-center text-danger shadow-sm">
                         <AlertTriangle size={24} />
                      </div>
                      <div>
                         <h3 className="font-playfair text-2xl font-black text-danger uppercase tracking-widest">Alerte Stocks Critiques</h3>
                         <p className="text-xs font-bold text-danger/70 mt-1 uppercase tracking-widest">Fulfillment à haut risque • Réassort Immédiat</p>
                      </div>
                   </div>
                   <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
                      {lowStockItems.map(item => (
                        <div key={item.id} className="bg-card p-8 rounded-[2.5rem] border border-border shadow-sm hover:shadow-xl hover:border-[color-mix(in_srgb,var(--danger)_20%,transparent)] transition-all group">
                           <div className="w-full h-48 bg-muted rounded-3xl mb-6 overflow-hidden border border-border">
                              <img src={item.product_images?.[0]?.image_url} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                           </div>
                           <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{item.categories?.name_fr || 'Collection'}</p>
                           <h4 className="text-lg font-black text-foreground uppercase tracking-tighter truncate">{item.name_fr}</h4>
                           <div className="flex justify-between items-end mt-4 pt-4 border-t border-border">
                              <div className="text-danger">
                                 <p className="text-[9px] font-black uppercase tracking-widest opacity-80">Restant</p>
                                 <p className="text-2xl font-black">{item.stock_quantity}</p>
                              </div>
                              <button 
                                onClick={() => setActiveTab("products")}
                                className="bg-primary text-primary-foreground px-5 py-2 rounded-xl text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-colors shadow-sm"
                              >
                                Réapprovisionner
                              </button>
                           </div>
                        </div>
                      ))}
                      {lowStockItems.length === 0 && (
                        <div className="col-span-full py-40 text-center text-muted-foreground italic font-black uppercase text-sm tracking-[0.5em] opacity-80">
                           Tout l'écrin est à pleine capacité.<br/>Félicitations.
                        </div>
                      )}
                   </div>
                </div>
              )}
            </motion.div>
          </AnimatePresence>
        </div>
      </div>
    </div>
  );
}