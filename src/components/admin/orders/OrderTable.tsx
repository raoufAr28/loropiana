"use client";

import { useState } from "react";
import { Search, Eye, Calendar, Hash, Filter, CreditCard, Mail, CheckCircle, XCircle } from "lucide-react";
import { format, isAfter, subMinutes } from "date-fns";
import { formatPrice } from "@/utils/currency";
import { Order, OrderStatus } from "@/hooks/admin/useOrders";
import { StatusBadge } from "../StatusBadge";

interface OrderTableProps {
  orders: Order[];
  onView: (o: Order) => void;
  onUpdateStatus: (id: string, s: OrderStatus) => void;
  updating: boolean;
  locale: string;
}

const STATUS_FILTERS: (OrderStatus | 'all')[] = ['all', 'pending', 'confirmed', 'cancelled'];

export function OrderTable({ orders, onView, onUpdateStatus, updating, locale }: OrderTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<OrderStatus | 'all'>('all');

  const filtered = orders.filter((o) => {
    const searchValue = search.toLowerCase();
    const matchesSearch =
      String(o.id).toLowerCase().includes(searchValue) ||
      String(o.guest_email || "").toLowerCase().includes(searchValue);
    const matchesStatus = statusFilter === "all" || o.status === statusFilter;
    return matchesSearch && matchesStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search & Filters */}
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
            <thead className="bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Reference</th>
                <th className="px-6 py-4">Customer</th>
                <th className="px-6 py-4">Payment</th>
                <th className="px-6 py-4">Status</th>
                <th className="px-6 py-4">Order Date</th>
                <th className="px-6 py-4">Total</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((o) => {
                const isNew = isAfter(new Date(o.created_at), subMinutes(new Date(), 15));
                
                return (
                  <tr key={o.id} className={`hover:bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] transition-colors group relative ${isNew ? 'bg-[color-mix(in_srgb,var(--muted)_30%,transparent)]' : ''}`}>
                    <td className="px-6 py-6 border-l-2 border-transparent group-hover:border-primary">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 rounded-lg bg-muted flex items-center justify-center text-muted-foreground group-hover:bg-primary group-hover:text-background transition-all relative">
                          <Hash size={14} />
                          {isNew && (
                            <span className="absolute -top-1 -right-1 w-2.5 h-2.5 bg-danger rounded-full border-2 border-card animate-pulse" />
                          )}
                        </div>
                        <div className="flex flex-col">
                           <span className="font-bold text-foreground leading-none">#{String(o.id).toUpperCase()}</span>
                           {isNew && <span className="text-[8px] font-black text-danger uppercase tracking-widest mt-1 opacity-80">New Order</span>}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2">
                        <Mail size={12} className="text-muted-foreground" />
                        <p className="font-semibold text-foreground lowercase truncate max-w-[150px]">{o.guest_email || "Registered User"}</p>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <div className="space-y-1">
                        <div className="flex items-center gap-1.5">
                          <CreditCard size={12} className="text-muted-foreground" />
                          <span className="text-[10px] font-black uppercase tracking-tight text-foreground">
                            {o.payment_method?.replace(/_/g, ' ') || 'N/A'}
                          </span>
                        </div>
                        <div className={`text-[9px] font-bold px-1.5 py-0.5 rounded inline-block uppercase tracking-wider ${o.payment_status === 'paid' ? 'bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary' : 'bg-muted text-muted-foreground'
                          }`}>
                          {o.payment_status || 'pending'}
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <StatusBadge status={o.status} />
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-2 text-muted-foreground">
                        <Calendar size={14} className="opacity-40" />
                        <span className="text-xs font-medium">{format(new Date(o.created_at), 'dd MMM, HH:mm')}</span>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="font-black text-foreground">
                        {formatPrice(o.total_amount, locale)}
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
    </div>
  );
}
