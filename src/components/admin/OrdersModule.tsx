"use client";

import { useState } from "react";
import { PackageOpen } from "lucide-react";
import { useOrders, Order, OrderStatus } from "@/hooks/admin/useOrders";
import { OrderTable } from "./orders/OrderTable";
import { OrderDetails } from "./orders/OrderDetails";
import { SaaSModal } from "./SaaSModal";

interface OrdersModuleProps {
  showToast: (m: string, t: 'success' | 'error') => void;
  locale: string;
}

export function OrdersModule({ showToast, locale }: OrdersModuleProps) {
  const {
    orders,
    loading,
    updating,
    updateStatus,
    fetchOrderItems
  } = useOrders(showToast);

  const [selected, setSelected] = useState<Order | null>(null);
  const [itemsLoading, setItemsLoading] = useState(false);

  // Lazy loading orchestrator
  const handleViewDetails = async (order: Order) => {
    setSelected(order);
    setItemsLoading(true);

    // Fetch items only if they don't exist yet on the object
    if (!order.order_items || order.order_items.length === 0) {
      const items = await fetchOrderItems(order.id);
      if (items) {
        setSelected({ ...order, order_items: items });
      }
    }
    setItemsLoading(false);
  };

  const handleUpdateStatus = async (id: string, status: OrderStatus) => {
    const success = await updateStatus(id, status);
    if (success && selected?.id === id) {
      setSelected(prev => prev ? { ...prev, status } : null);
    }
  };

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-card rounded-xl border border-border">
        <div className="w-10 h-10 border-4 border-muted border-t-primary animate-spin rounded-full" />
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Processing Fulfillment...</p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="bg-card p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-foreground border border-border shadow-inner">
            <PackageOpen size={24} />
          </div>
          <div>
            <h3 className="font-black text-2xl text-foreground uppercase tracking-tighter">Order Management</h3>
            <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Fulfillment Queue • {orders.length} Active Records</p>
          </div>
        </div>
      </header>

      {/* Main Table Content */}
      <OrderTable 
        orders={orders}
        onView={handleViewDetails}
        onUpdateStatus={handleUpdateStatus}
        updating={updating}
        locale={locale}
      />

      {/* Order Details Modal */}
      <SaaSModal
        isOpen={!!selected}
        onClose={() => setSelected(null)}
        title={`Registry Entry : #${String(selected?.id ?? "").padStart(4, "0")}`}
        subtitle="Order Processing Details & Shipment"
        width="max-w-4xl"
      >
        {selected && (
          <OrderDetails 
            order={selected}
            onUpdateStatus={(s) => handleUpdateStatus(selected.id, s)}
            updating={updating || itemsLoading}
            locale={locale}
          />
        )}
      </SaaSModal>
    </div>
  );
}
