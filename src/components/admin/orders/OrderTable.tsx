"use client";

import { useState } from "react";
import { Search, Eye, Calendar, Hash, Filter, CreditCard, Mail, CheckCircle, XCircle, Trash2 } from "lucide-react";
import { format, isAfter, subMinutes } from "date-fns";
import { formatPrice } from "@/utils/currency";
import { Order, OrderStatus } from "@/hooks/admin/useOrders";
import { StatusBadge } from "../StatusBadge";
import { DeleteConfirmationModal } from "../DeleteConfirmationModal";

interface OrderTableProps {
  orders: Order[];
  onView: (o: Order) => void;
  onUpdateStatus: (id: string, s: OrderStatus) => void;
  onDelete: (id: string) => void;
  updating: boolean;
  locale: string;
}

const STATUS_FILTERS: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'cancelled'];

export function OrderTable({ orders, onView, onUpdateStatus, onDelete, updating, locale }: OrderTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');
  const [deletingId, setDeletingId] = useState<string | null>(null);

  const filtered = orders.filter((o) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      String(o.id).toLowerCase().includes(searchValue) ||
      String(o.guest_email || "").toLowerCase().includes(searchValue);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  const handleDeleteConfirm = () => {
    if (deletingId) {
      onDelete(deletingId);
      setDeletingId(null);
    }
  };

  return (
    <div className="space-y-4">
      {/* ... (rest of the search & filters UI) ... */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative group w-full max-w-md">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
          <input
            placeholder="Search Order ID or Customer..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--foreground)_5%,transparent)] focus:border-foreground transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2 overflow-x-auto pb-2 md:pb-0 no-scrollbar">
          <Filter size={14} className="text-muted-foreground mr-2 flex-shrink-0" />
          {STATUS_FILTERS.map((s) => (
            <button
              key={s}
              onClick={() => setStatusFilter(s)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest whitespace-nowrap transition-all border ${statusFilter === s
                ? 'bg-primary text-background border-primary'
                : 'bg-card text-muted-foreground border-border hover:border-foreground'
                }`}
            >
              {s}
            </button>
          ))}
        </div>
      </div>

      {/* Table Container */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] border-b border-border text-muted-foreground font-medium text-[10px] uppercase tracking-[0.2em]">
              <tr>
                <th className="px-6 py-4">Name</th>
                <th className="px-6 py-4">Phone</th>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Tracking</th>
                <th className="px-6 py-4 text-right">Details</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => {
                const isNew = isAfter(new Date(o.created_at), subMinutes(new Date(), 15));
                const shipping = o.shipping_address || {};
                const name = `${shipping.firstName || ''} ${shipping.lastName || ''}`.trim() || 'Guest';
                const phone = shipping.phone || 'N/A';
                const productSummary = o.order_items?.map((i: any) => 
                  `${i.products?.name_fr} (x${i.quantity})`
                ).join(', ') || 'Processing...';

                return (
                  <tr key={o.id} className={`hover:bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] transition-colors group relative ${isNew ? 'bg-[color-mix(in_srgb,var(--muted)_30%,transparent)]' : ''}`}>
                    <td className="px-6 py-6 border-l-2 border-transparent group-hover:border-primary">
                      <span className="font-bold text-foreground">{name}</span>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-medium tabular-nums">{phone}</span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="text-[10px] font-medium text-muted-foreground truncate max-w-[150px]" title={productSummary}>
                        {productSummary}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-foreground">
                        {formatPrice(o.total_amount, locale)}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <StatusBadge status={o.status} />
                        {o.delivery_status && (
                          <span className={`text-[8px] font-black uppercase tracking-widest ${o.delivery_status === 'created' ? 'text-primary' : 'text-danger'}`}>
                            DRV: {o.delivery_status}
                          </span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-[10px] font-black text-foreground tabular-nums tracking-widest">
                        {o.tracking_number || o.tracking_id || '-'}
                      </span>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex items-center justify-end gap-1.5">
                        {o.status === 'pending' && (
                          <>
                            <button 
                              onClick={() => onUpdateStatus(o.id, 'confirmed')}
                              disabled={updating}
                              className="p-2 text-muted-foreground hover:text-primary hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                              title="Confirm Collection"
                            >
                              <CheckCircle size={18} />
                            </button>
                            <button 
                              onClick={() => onUpdateStatus(o.id, 'cancelled')}
                              disabled={updating}
                              className="p-2 text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                              title="Cancel Submission"
                            >
                              <XCircle size={18} />
                            </button>
                          </>
                        )}
                        {o.status === 'cancelled' && (
                          <button 
                            onClick={() => setDeletingId(o.id)}
                            disabled={updating}
                            className="p-2 text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] rounded-lg transition-all opacity-0 group-hover:opacity-100 disabled:opacity-30"
                            title={locale === 'fr' ? "Supprimer définitivement" : "حذف نهائي"}
                          >
                            <Trash2 size={18} />
                          </button>
                        )}
                        <button
                          onClick={() => onView(o)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                          title="Open Archive"
                        >
                          <Eye size={18} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={7} className="px-6 py-20 text-center text-muted-foreground italic">
                    No orders matching your criteria.
                  </td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </div>

      <DeleteConfirmationModal
        isOpen={!!deletingId}
        onClose={() => setDeletingId(null)}
        onConfirm={handleDeleteConfirm}
        title={locale === 'fr' ? "Supprimer définitivement" : "حذف نهائي"}
        message={locale === 'fr' 
          ? "Cette commande annulée sera supprimée définitivement. Continuer ?" 
          : "سيتم حذف هذه الطلبية الملغاة نهائيا. هل تريد المتابعة؟"
        }
        loading={updating}
      />
    </div>
  );
}
