"use client";

import { CheckCircle, XCircle, Truck, Package, User, MapPin, Calculator, Loader2 } from "lucide-react";
import { formatPrice } from "@/utils/currency";
import { Order, OrderStatus } from "@/hooks/admin/useOrders";
import { StatusBadge } from "../StatusBadge";

interface OrderDetailsProps {
  order: Order;
  onUpdateStatus: (status: OrderStatus) => void;
  updating: boolean;
  locale: string;
}

export function OrderDetails({ order, onUpdateStatus, updating, locale }: OrderDetailsProps) {
  const isPending = order.status === 'pending';
  const isCancelled = order.status === 'cancelled';
  const isConfirmed = order.status === 'confirmed';

  const actionButtonClass = "flex-1 px-6 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.2em] shadow-lg active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2";

  return (
    <div className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Dynamic Actions */}
      <div className="flex flex-wrap gap-4">
        {isPending && (
          <button 
            onClick={() => onUpdateStatus('confirmed')}
            disabled={updating}
            className={`${actionButtonClass} bg-primary text-white hover:opacity-90`}
          >
            <CheckCircle size={16} /> Confirm Order
          </button>
        )}
        
        {!isCancelled && (
          <button 
            onClick={() => onUpdateStatus('cancelled')}
            disabled={updating}
            className={`${actionButtonClass} bg-card text-danger border border-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)]`}
          >
            <XCircle size={16} /> Cancel Order
          </button>
        )}
      </div>

      {/* Info Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        
        {/* Customer Information */}
        <div className="bg-muted border border-border p-6 rounded-xl space-y-4">
          <div className="flex items-center gap-3 text-muted-foreground">
             <User size={16} />
             <h4 className="text-[10px] font-black uppercase tracking-widest">Customer Registry</h4>
          </div>
          <div className="space-y-1">
             <p className="text-sm font-bold text-foreground border-b border-border pb-2 mb-2">
               {order.shipping_address?.firstName} {order.shipping_address?.lastName}
             </p>
             <div className="flex items-start gap-2 pt-1 text-muted-foreground">
                <MapPin size={14} className="mt-0.5 flex-shrink-0" />
                <p className="text-xs font-medium leading-relaxed">
                  {order.shipping_address?.address}, <br/>
                  {order.shipping_address?.city}, {order.shipping_address?.wilaya || 'N/A'}
                </p>
             </div>
             <p className="text-xs font-black text-foreground mt-4 pt-4 border-t border-border font-inter">
               {order.shipping_address?.phone}
             </p>
             <p className="text-[10px] text-muted-foreground italic lowercase">{order.guest_email || "Direct Profile Link"}</p>
          </div>
        </div>

        {/* Totals & Payment */}
        <div className="bg-[color-mix(in_srgb,var(--primary)_5%,transparent)] border border-primary text-foreground p-6 rounded-xl space-y-4 flex flex-col justify-between">
           <div className="flex items-center justify-between">
              <div className="flex items-center gap-3 text-muted-foreground">
                 <Calculator size={16} />
                 <h4 className="text-[10px] font-black uppercase tracking-widest">Accounting</h4>
              </div>
              <StatusBadge status={order.status} />
           </div>

           <div className="space-y-4">
              <div className="flex justify-between items-center text-[10px] font-black uppercase opacity-60">
                 <span>Settlement / {order.payment_status || 'pending'}</span>
                 <span>{order.payment_method?.replace(/_/g, ' ') || 'Cash on Delivery'}</span>
              </div>
              <div className="pt-4 border-t border-[color-mix(in_srgb,var(--foreground)_10%,transparent)] flex justify-between items-end">
                 <span className="text-[10px] font-black uppercase tracking-widest opacity-60">Final Collection</span>
                 <span className="text-3xl font-black tracking-tighter text-foreground font-inter">
                   {formatPrice(order.total_amount, locale)}
                 </span>
              </div>
           </div>
        </div>
      </div>

      {/* Item Breakdown (Lazy Loaded) */}
      <div className="space-y-4 border-t border-border pt-8">
        <h4 className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.2em] ml-1">Selection Summary</h4>
        
        {(!order.order_items || order.order_items.length === 0) && updating ? (
          <div className="py-20 flex flex-col items-center justify-center gap-4 text-muted-foreground">
             <Loader2 size={32} className="animate-spin opacity-20" />
             <p className="text-[10px] font-black uppercase tracking-widest">Fetching registry items...</p>
          </div>
        ) : (
          <div className="grid gap-3">
            {order.order_items?.map((item: any) => {
               const visual = item.products?.product_images?.[0]?.image_url;
               return (
                 <div key={item.id} className="flex justify-between items-center bg-card p-4 rounded-xl border border-border group hover:border-foreground transition-all">
                    <div className="flex gap-4 items-center">
                      <div className="w-12 h-16 rounded-lg bg-muted border border-border overflow-hidden flex-shrink-0">
                         {visual ? (
                           <img src={visual} alt="Item" className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-700" />
                         ) : (
                           <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Package size={20} />
                           </div>
                         )}
                      </div>
                      <div>
                         <p className="text-sm font-bold text-foreground truncate max-w-[200px]">{item.products?.name_fr}</p>
                         <p className="text-[10px] text-muted-foreground font-bold mt-1 italic tracking-widest uppercase">
                           {item.quantity} Unit{item.quantity > 1 ? 's' : ''}
                         </p>
                      </div>
                    </div>
                    <div className="text-right">
                       <p className="text-sm font-black text-foreground">{formatPrice(item.unit_price * item.quantity, locale)}</p>
                       <p className="text-[9px] text-muted-foreground font-bold uppercase">{formatPrice(item.unit_price, locale)} / unit</p>
                    </div>
                 </div>
               );
            })}
          </div>
        )}
      </div>
    </div>
  );
}
