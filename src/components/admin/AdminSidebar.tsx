"use client";

import { 
  LayoutDashboard, 
  Package, 
  Filter, 
  ShoppingCart, 
  AlertTriangle, 
  LogOut,
  ChevronRight,
  MessageSquare
} from "lucide-react";
import { useLocale } from "next-intl";
import { useRouter } from "next/navigation";
import { supabase } from "@/utils/supabase/client";

interface AdminSidebarProps {
  activeTab: string;
  setActiveTab: (tab: string) => void;
  lowStockCount: number;
  pendingCount: number;
  pendingReviewsCount: number;
}

export function AdminSidebar({ activeTab, setActiveTab, lowStockCount, pendingCount, pendingReviewsCount }: AdminSidebarProps) {
  const locale = useLocale();
  const isRTL = locale === "ar";
  const router = useRouter();

  const menuItems = [
    { id: "overview", label: { fr: "Tableau de Bord", ar: "لوحة التحكم" }, icon: <LayoutDashboard size={18} /> },
    { id: "categories", label: { fr: "Catégories", ar: "الأصناف" }, icon: <Filter size={18} /> },
    { id: "products", label: { fr: "Produits", ar: "المنتجات" }, icon: <Package size={18} /> },
    { id: "orders", label: { fr: "Commandes", ar: "الطلبات" }, icon: <ShoppingCart size={18} />, badge: pendingCount },
    { id: "reviews", label: { fr: "Avis Clients", ar: "آراء العملاء" }, icon: <MessageSquare size={18} />, badge: pendingReviewsCount },
    { id: "alerts", label: { fr: "Alertes Stock", ar: "تنبيهات المخزون" }, icon: <AlertTriangle size={18} />, badge: lowStockCount },
  ];

  const handleLogout = async () => {
    await supabase.auth.signOut();
    router.push(`/${locale}/login`);
  };

  return (
    <aside className="w-full lg:w-64 h-auto lg:h-[calc(100vh-7rem)] static lg:sticky lg:top-28 bg-card border-b lg:border-b-0 lg:border-r border-border flex flex-col z-[40] group/sidebar shrink-0">
      <div className="hidden lg:flex p-8 border-b border-border items-center gap-3">
        <div className="w-6 h-6 bg-primary rounded-sm transform group-hover/sidebar:rotate-45 transition-transform duration-500" />
        <h1 className="font-black tracking-tighter text-foreground text-sm uppercase">Loro Piana</h1>
      </div>

      <nav className="p-3 lg:p-4 flex-none lg:flex-1 flex flex-row lg:flex-col gap-2 lg:gap-0 lg:space-y-1 overflow-x-auto lg:overflow-x-hidden overflow-y-hidden lg:overflow-y-auto custom-scrollbar no-scrollbar">
        {menuItems.map((item) => (
          <button
            key={item.id}
            onClick={() => setActiveTab(item.id)}
            className={`flex-none lg:w-full flex items-center justify-center lg:justify-between px-4 lg:px-3 py-2.5 lg:py-2.5 rounded-xl transition-all text-xs font-bold whitespace-nowrap ${
              activeTab === item.id 
                ? "bg-primary text-primary-foreground shadow-lg shadow-primary/10" 
                : "text-muted-foreground hover:bg-muted"
            }`}
          >
            <div className="flex items-center gap-2 lg:gap-3 text-foreground">
              <span className={`opacity-80 ${activeTab === item.id ? "scale-110" : ""}`}>{item.icon}</span>
              {item.label[locale as "fr" | "ar"]}
            </div>
            {item.badge ? (
              <span className={`ml-2 lg:ml-0 px-1.5 py-0.5 rounded-full text-[10px] font-black ${
                activeTab === item.id ? "bg-white text-primary" : "bg-danger text-white"
              }`}>
                {item.badge}
              </span>
            ) : (
              <ChevronRight size={14} className={`hidden lg:block opacity-0 group-hover:opacity-30 transition-opacity ${activeTab === item.id ? "hidden lg:hidden" : ""}`} />
            )}
          </button>
        ))}
      </nav>

      <div className="hidden lg:block p-4 border-t border-border bg-muted/50">
        <button
          onClick={handleLogout}
          className="w-full flex items-center gap-3 px-3 py-2.5 rounded-xl text-muted-foreground hover:bg-danger/10 hover:text-danger transition-all text-xs font-bold"
        >
          <LogOut size={18} /> 
          {locale === 'fr' ? 'Déconnexion' : 'تسجيل الخروج'}
        </button>
      </div>
    </aside>
  );
}

