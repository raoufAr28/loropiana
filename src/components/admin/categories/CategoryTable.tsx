"use client";

import { useState } from "react";
import { Search, Edit, Trash2, Hash, Image as ImageIcon } from "lucide-react";
import { Category } from "@/hooks/admin/useCategories";

interface CategoryTableProps {
  categories: Category[];
  onEdit: (c: Category) => void;
  onDelete: (id: string) => void;
  locale: string;
}

export function CategoryTable({ categories, onEdit, onDelete, locale }: CategoryTableProps) {
  const [search, setSearch] = useState("");

  const filtered = categories.filter(c => 
    c.name_fr.toLowerCase().includes(search.toLowerCase()) || 
    c.name_ar.toLowerCase().includes(search.toLowerCase())
  );

  return (
    <div className="space-y-4">
      {/* Search Header */}
      <div className="relative group max-w-md">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors" size={18} />
        <input 
          placeholder="Search categories..." 
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
                <th className="px-6 py-4">Visual</th>
                <th className="px-6 py-4">Category Name (FR/AR)</th>
                <th className="px-6 py-4">Slug</th>
                <th className="px-6 py-4">Total Products</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((cat) => (
                <tr key={cat.id} className="hover:bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] transition-colors group">
                  <td className="px-6 py-4">
                    <div className="w-14 h-14 bg-muted rounded-lg border border-border overflow-hidden shadow-sm flex items-center justify-center">
                      {cat.image_url ? (
                        <img src={cat.image_url} alt={cat.name_fr} className="w-full h-full object-cover group-hover:scale-110 transition-transform duration-500" />
                      ) : (
                        <ImageIcon className="text-muted-foreground" size={24} />
                      )}
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <div>
                      <p className="font-bold text-foreground uppercase tracking-tight">{cat.name_fr}</p>
                      <p className="text-[10px] font-bold text-muted-foreground mt-0.5" dir="rtl">{cat.name_ar}</p>
                    </div>
                  </td>
                  <td className="px-6 py-4">
                    <span className="text-xs font-semibold text-muted-foreground bg-muted px-2.5 py-1 rounded-md border border-border">
                      /{cat.slug}
                    </span>
                  </td>
                  <td className="px-6 py-4">
                    <div className="flex items-center gap-2">
                       <Hash size={14} className="text-muted-foreground" />
                       <span className="text-sm font-bold text-foreground">-</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 text-right">
                    <div className="flex justify-end gap-2">
                      <button 
                        onClick={() => onEdit(cat)} 
                        className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all"
                      >
                        <Edit size={16} />
                      </button>
                      <button 
                        onClick={() => onDelete(cat.id)} 
                        className="p-2 text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] rounded-lg transition-all"
                      >
                        <Trash2 size={16} />
                      </button>
                    </div>
                  </td>
                </tr>
              ))}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={5} className="px-6 py-20 text-center text-muted-foreground font-medium italic">
                    No results found for your search.
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
