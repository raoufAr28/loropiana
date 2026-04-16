"use client";

import { 
  DollarSign, 
  ShoppingCart, 
  Package, 
  Filter,
  AlertTriangle,
  ArrowUpRight,
  TrendingUp,
  Clock,
  ArrowRight
} from "lucide-react";
import { formatPrice } from "@/utils/currency";
import { useLocale } from "next-intl";
import { format } from "date-fns";

interface DashboardModuleProps {
  stats: {
    revenue: { 
      total: number; 
      product: number; 
      confirmed: number; 
      today: number; 
      thisWeek: number; 
      thisMonth: number; 
      shipping: number 
    };
    orders: { total: number; pending: number; confirmed: number; cancelled: number };
    inventory: { total: number; lowStock: number };
    reviews: { total: number; pending: number; approved: number };
  };
  recentOrders: any[];
  lowStockItems: any[];
}

export function DashboardModule({ stats, recentOrders, lowStockItems }: DashboardModuleProps) {
  const locale = useLocale();

  const cards = [
    { 
      label: { fr: "Revenus (Confirmés)", ar: "الإيرادات المؤكدة" }, 
      value: formatPrice(stats.revenue.confirmed, locale), 
      icon: <DollarSign size={20} />, 
      trend: "Mois: " + formatPrice(stats.revenue.thisMonth, locale), 
      status: "success" 
    },
    { 
      label: { fr: "Commandes (en attente)", ar: "طلبات قيد الانتظار" }, 
      value: `${stats.orders.pending} / ${stats.orders.total}`, 
      icon: <ShoppingCart size={20} />, 
      trend: stats.orders.confirmed + " Confirmées", 
      status: stats.orders.pending > 0 ? "neutral" : "success" 
    },
    { 
      label: { fr: "Inventaire (Faible stock)", ar: "المخزون" }, 
      value: `${stats.inventory.lowStock} Alertes`, 
      icon: <Package size={20} />, 
      trend: stats.inventory.total + " Produits", 
      status: stats.inventory.lowStock > 0 ? "warning" : "success" 
    },
    { 
      label: { fr: "Avis à modérer", ar: "الآراء" }, 
      value: `${stats.reviews.pending} Avis`, 
      icon: <Filter size={20} />, 
      trend: stats.reviews.approved + " Approuvés", 
      status: stats.reviews.pending > 0 ? "warning" : "success" 
    },
  ];

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-700">
      
      {/* Welcome & Date Section */}
      <header className="flex flex-col md:flex-row justify-between items-start md:items-center gap-4">
        <div>
           <h2 className="text-2xl font-black text-foreground tracking-tighter uppercase">Executive Overview</h2>
           <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest leading-none">Intelligence Hub • Current Registry Status</p>
        </div>
        <div className="flex items-center gap-3 bg-card px-4 py-2 rounded-xl border border-border shadow-sm">
           <Clock size={14} className="text-muted-foreground" />
           <span className="text-[10px] font-black text-foreground uppercase tracking-widest">{format(new Date(), 'dd MMMM, yyyy')}</span>
        </div>
      </header>

      {/* Stats Dashboard */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {cards.map((card, i) => (
          <div key={i} className="bg-card p-6 rounded-xl border border-border shadow-sm hover:shadow-md transition-all group relative overflow-hidden">
            <div className="flex items-center justify-between mb-6">
              <div className="w-10 h-10 bg-muted rounded-lg flex items-center justify-center text-foreground border border-border group-hover:bg-primary group-hover:text-background transition-all duration-300">
                {card.icon}
              </div>
              <span className={`text-[10px] font-black uppercase tracking-widest ${card.status === 'success' ? 'text-primary bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] px-2 py-0.5 rounded-md' : card.status === 'warning' ? 'text-danger bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] px-2 py-0.5 rounded-md' : 'text-muted-foreground'}`}>
                {card.trend}
              </span>
            </div>
            <p className="text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-1">{card.label[locale as 'fr' | 'ar']}</p>
            <h3 className="text-2xl font-black text-foreground tracking-tighter font-inter">{card.value}</h3>
            
            {/* Subtle line decoration */}
            <div className="absolute bottom-0 left-0 w-full h-[2px] bg-border group-hover:bg-primary transition-colors" />
          </div>
        ))}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Fulfillment Queue (Recent Orders) */}
        <div className="lg:col-span-2 bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col">
           <header className="p-6 border-b border-border flex justify-between items-center bg-[color-mix(in_srgb,var(--muted)_30%,transparent)]">
              <div className="flex items-center gap-3">
                 <div className="w-8 h-8 bg-primary text-background rounded-lg flex items-center justify-center shadow-sm">
                    <TrendingUp size={16} />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Recent Activity</h3>
              </div>
              <button className="text-[10px] font-black uppercase tracking-widest text-muted-foreground hover:text-foreground transition-all flex items-center gap-2 group">
                 View History <ArrowRight size={14} className="group-hover:translate-x-1 transition-transform" />
              </button>
           </header>
           
           <div className="p-6 space-y-4 flex-1">
              {recentOrders.map((order) => (
                <div key={order.id} className="flex items-center justify-between p-4 bg-card border border-border rounded-xl hover:border-border hover:shadow-sm transition-all group">
                   <div className="flex items-center gap-4">
                      <div className="w-10 h-10 bg-muted border border-border rounded-lg flex items-center justify-center text-[10px] font-black text-muted-foreground group-hover:text-foreground transition-colors">
                         #{order.id.split('-')[0].toUpperCase()}
                      </div>
                      <div className="min-w-0">
                         <p className="text-xs font-bold text-foreground truncate lowercase">{order.guest_email || order.profiles?.email}</p>
                         <p className="text-[10px] font-bold text-muted-foreground uppercase tracking-widest mt-1">
                           {format(new Date(order.created_at), 'HH:mm')} • Registry Entry
                         </p>
                      </div>
                   </div>
                   <div className="text-right">
                      <p className="text-sm font-black text-foreground font-inter">{formatPrice(order.total_amount, locale)}</p>
                      <div className="w-full h-1 bg-muted rounded-full mt-1.5 overflow-hidden">
                         <div className="w-full h-full bg-primary rounded-full" />
                      </div>
                   </div>
                </div>
              ))}
              {recentOrders.length === 0 && (
                <div className="py-20 text-center italic text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em]">
                   Archive is quiet. No recent collections.
                </div>
              )}
           </div>
        </div>

        {/* Inventory Risk Monitor (Stock Alerts) */}
        <div className={`bg-card rounded-xl border border-border shadow-sm overflow-hidden flex flex-col ${lowStockItems.length > 0 ? 'ring-2 ring-[color-mix(in_srgb,var(--danger)_10%,transparent)]' : ''}`}>
           <header className="p-6 border-b border-border bg-[color-mix(in_srgb,var(--danger)_5%,transparent)]">
              <div className="flex items-center gap-3">
                 <div className={`w-8 h-8 rounded-lg flex items-center justify-center shadow-sm ${lowStockItems.length > 0 ? 'bg-danger text-background' : 'bg-muted text-muted-foreground'}`}>
                    <AlertTriangle size={16} />
                 </div>
                 <h3 className="text-sm font-black uppercase tracking-widest text-foreground">Inventory Alert</h3>
              </div>
           </header>
           
           <div className="p-6 space-y-6 flex-1">
              {lowStockItems.map((item) => (
                <div key={item.id} className="flex items-start gap-4 group">
                   <div className="w-12 h-16 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0 group-hover:ring-2 group-hover:ring-danger transition-all shadow-sm">
                      <img src={item.product_images?.[0]?.image_url} alt={item.name_fr} className="w-full h-full object-cover" />
                   </div>
                   <div className="flex-1 min-w-0">
                      <p className="text-xs font-black text-foreground truncate uppercase mt-1 tracking-tight">{item.name_fr}</p>
                      <div className="flex items-center gap-2 mt-3">
                         <span className="w-2 h-2 bg-danger rounded-full animate-pulse" />
                         <p className="text-[10px] font-black text-danger uppercase tracking-widest">
                           {item.stock_quantity} Residue Left
                         </p>
                      </div>
                   </div>
                </div>
              ))}
              {lowStockItems.length === 0 && (
                <div className="py-20 text-center italic text-muted-foreground font-bold text-[10px] uppercase tracking-[0.3em] leading-relaxed">
                   Warehouse is fully<br/>capacitated.
                </div>
              )}
           </div>
           
           {lowStockItems.length > 0 && (
             <div className="p-6 bg-muted border-t border-border">
                <button className="w-full py-3 bg-primary text-background rounded-lg text-[10px] font-black uppercase tracking-widest hover:opacity-90 transition-all shadow-sm">
                   Action Procurement
                </button>
             </div>
           )}
        </div>
      </div>
    </div>
  );
}
