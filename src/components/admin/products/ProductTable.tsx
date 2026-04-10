"use client";

import { useState } from "react";
import { Search, Edit, Trash2, Star, AlertCircle, Package } from "lucide-react";
import { formatPrice } from "@/utils/currency";
import { Product } from "@/hooks/admin/useProducts";

interface ProductTableProps {
  products: Product[];
  onEdit: (p: Product) => void;
  onDelete: (id: string) => void;
  locale: string;
}

const STOCK_THRESHOLD = 5;

export function ProductTable({ products, onEdit, onDelete, locale }: ProductTableProps) {
  const [search, setSearch] = useState("");

  const filtered = products.filter(p =>
    p.name_fr.toLowerCase().includes(search.toLowerCase()) ||
    p.slug.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
        <input
          placeholder="Search products..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full bg-card border border-border pl-10 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--foreground)_5%,transparent)] focus:border-foreground transition-all shadow-sm"
        />
      </div>

      {/* Table Container */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] border-b border-border text-muted-foreground font-medium">
              <tr>
                <th className="px-6 py-4">Product</th>
                <th className="px-6 py-4">Category</th>
                <th className="px-6 py-4">Price</th>
                <th className="px-6 py-4">Stock</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((p) => {
                const primaryImage = p.product_images?.[0]?.image_url;
                const isLowStock = p.stock_quantity <= STOCK_THRESHOLD;

                return (
                  <tr key={p.id} className="hover:bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] transition-colors group">
                    <td className="px-6 py-4">
                      <div className="flex items-center gap-4">
                        <div className="w-12 h-12 bg-muted rounded-lg overflow-hidden border border-border flex-shrink-0 relative">
                          {primaryImage ? (
                            <img src={primaryImage} alt={p.name_fr} className="w-full h-full object-cover" />
                          ) : (
                            <div className="w-full h-full flex items-center justify-center text-muted-foreground">
                              <Package size={20} />
                            </div>
                          )}
                          {p.is_featured && (
                            <div className="absolute top-0 right-0 p-0.5 bg-secondary rounded-bl-lg">
                              <Star size={8} fill="white" className="text-white" />
                            </div>
                          )}
                        </div>
                        <div>
                          <p className="font-bold text-foreground truncate max-w-[200px]">{p.name_fr}</p>
                          <p className="text-[11px] text-muted-foreground font-medium">/{p.slug}</p>
                        </div>
                      </div>
                    </td>
                    <td className="px-6 py-4">
                      <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                        {p.categories?.name_fr || 'Uncategorized'}
                      </span>
                    </td>
                    <td className="px-6 py-4">
                      <p className="font-semibold text-foreground">
                        {formatPrice(p.price, locale)}
                      </p>
                    </td>
                    <td className="px-6 py-4">
                      <div className="flex flex-col gap-1">
                        <span className={`font-bold ${isLowStock ? 'text-danger' : 'text-foreground'}`}>
                          {p.stock_quantity}
                        </span>
                        {isLowStock && (
                          <div className="flex items-center gap-1 text-[10px] font-black uppercase text-danger animate-pulse">
                            <AlertCircle size={10} />
                            Critical Stock
                          </div>
                        )}
                        {p.is_new_arrival && (
                          <span className="text-[10px] font-black uppercase text-primary">New Arrival</span>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-4 text-right">
                      <div className="flex justify-end gap-2">
                        <button
                          onClick={() => onEdit(p)}
                          className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                        >
                          <Edit size={16} />
                        </button>
                        <button
                          onClick={() => onDelete(p.id)}
                          className="p-2 text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] rounded-lg transition-all"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground italic">
                    No products found Matching your search.
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
