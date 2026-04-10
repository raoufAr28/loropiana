"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Star, Plus, Check } from "lucide-react";
import { ProductFormData } from "@/hooks/admin/useProducts";

interface ProductFormProps {
  initialData?: ProductFormData;
  categories: any[];
  onSubmit: (data: ProductFormData) => void;
  loading: boolean;
  locale: string;
}

export function ProductForm({ initialData, categories, onSubmit, loading, locale }: ProductFormProps) {
  const [form, setForm] = useState<ProductFormData>(initialData || {
    name_fr: "",
    name_ar: "",
    description_fr: "",
    description_ar: "",
    slug: "",
    price: 0,
    stock_quantity: 0,
    category_id: "",
    is_featured: false,
    is_new_arrival: true,
    image_url: ""
  });

  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) setForm(initialData);
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    // Basic validation
    const newErrors: Record<string, boolean> = {};
    if (!form.name_fr) newErrors.name_fr = true;
    if (!form.name_ar) newErrors.name_ar = true;
    if (!form.slug) newErrors.slug = true;
    if (!form.category_id) newErrors.category_id = true;
    if (form.price <= 0) newErrors.price = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(form);
  };

  const handleChange = (field: keyof ProductFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const labelClass = "text-xs font-bold text-muted-foreground uppercase tracking-wider mb-2 block";
  const inputClass = (field: string) => `w-full bg-card border ${errors[field] ? 'border-danger ring-[color-mix(in_srgb,var(--danger)_10%,transparent)]' : 'border-border focus:border-foreground focus:ring-[color-mix(in_srgb,var(--foreground)_5%,transparent)]'} px-4 py-2.5 rounded-xl text-sm outline-none transition-all shadow-sm`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8">

        {/* Section: Basic Information */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Basic Information
          </h4>
          <div className="space-y-4">
            <div>
              <label className={labelClass}>Product Name (FR)</label>
              <input
                value={form.name_fr}
                onChange={(e) => handleChange('name_fr', e.target.value)}
                className={inputClass('name_fr')}
                placeholder="Polo Iconic en Cachemire"
              />
            </div>

            <div>
              <label className={`${labelClass} text-right`}>اسم المنتج (AR)</label>
              <input
                value={form.name_ar}
                onChange={(e) => handleChange('name_ar', e.target.value)}
                className={`${inputClass('name_ar')} text-right`}
                dir="rtl"
                placeholder=" اسم المنتج بالعربية"
              />
            </div>

            <div>
              <label className={labelClass}>Reference URL (Slug)</label>
              <input
                value={form.slug}
                onChange={(e) => handleChange('slug', e.target.value)}
                className={inputClass('slug')}
                placeholder="polo-cashmere-iconic"
              />
            </div>

            <div>
              <label className={labelClass}>Category</label>
              <select
                value={form.category_id}
                onChange={(e) => handleChange('category_id', e.target.value)}
                className={inputClass('category_id')}
              >
                <option value="">Select a category...</option>
                {categories.map(c => <option key={c.id} value={c.id}>{c.name_fr}</option>)}
              </select>
            </div>
          </div>
        </div>

        {/* Section: Pricing & Stock */}
        <div className="space-y-6">
          <h4 className="text-sm font-black text-foreground flex items-center gap-2">
            <span className="w-1.5 h-1.5 rounded-full bg-primary" />
            Pricing & Inventory
          </h4>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className={labelClass}>Price (DZD)</label>
              <input
                type="number"
                value={form.price}
                onChange={(e) => handleChange('price', Number(e.target.value))}
                className={inputClass('price')}
                min="0"
              />
            </div>
            <div>
              <label className={labelClass}>Current Stock</label>
              <input
                type="number"
                value={form.stock_quantity}
                onChange={(e) => handleChange('stock_quantity', Number(e.target.value))}
                className={inputClass('stock_quantity')}
                min="0"
              />
            </div>
          </div>

          <div className="space-y-4">
            <label className={labelClass}>Product Status</label>
            <div className="grid grid-cols-2 gap-4">
              <button
                type="button"
                onClick={() => handleChange('is_featured', !form.is_featured)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${form.is_featured ? 'bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border-primary text-primary' : 'bg-card border-border text-muted-foreground'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">Featured</span>
                <Star size={14} fill={form.is_featured ? "currentColor" : "none"} />
              </button>
              <button
                type="button"
                onClick={() => handleChange('is_new_arrival', !form.is_new_arrival)}
                className={`flex items-center justify-between px-4 py-3 rounded-xl border transition-all ${form.is_new_arrival ? 'bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border-primary text-primary' : 'bg-card border-border text-muted-foreground'}`}
              >
                <span className="text-[10px] font-black uppercase tracking-widest">New Arrival</span>
                <Check size={14} />
              </button>
            </div>
          </div>

          <div className="space-y-4">
            <label className={labelClass}>Product Media</label>
            <div className="space-y-3">
              <div className="flex gap-4 items-center">
                <div className="w-16 h-16 rounded-xl bg-muted border border-border flex-shrink-0 flex items-center justify-center overflow-hidden">
                  {form.image_url ? (
                    <div className="relative w-full h-full group">
                      <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                      <button
                        type="button"
                        onClick={() => handleChange('image_url', '')}
                        className="absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_40%,transparent)] text-background opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                      >
                        <X size={16} />
                      </button>
                    </div>
                  ) : (
                    <ImageIcon className="text-muted-foreground" size={24} />
                  )}
                </div>
                <input
                  value={form.image_url}
                  onChange={(e) => handleChange('image_url', e.target.value)}
                  className={inputClass('image_url')}
                  placeholder="Image URL (https://...)"
                />
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Description Section */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-8 border-t border-border pt-8">
        <div className="space-y-4">
          <label className={labelClass}>Description (FR)</label>
          <textarea
            value={form.description_fr}
            onChange={(e) => handleChange('description_fr', e.target.value)}
            className={`${inputClass('description_fr')} min-h-[120px] py-4 resize-none`}
            placeholder="Detailed description in French..."
          />
        </div>
        <div className="space-y-4">
          <label className={`${labelClass} text-right`}>الوصف (AR)</label>
          <textarea
            value={form.description_ar}
            onChange={(e) => handleChange('description_ar', e.target.value)}
            className={`${inputClass('description_ar')} min-h-[120px] py-4 resize-none text-right`}
            dir="rtl"
            placeholder="وصف مفصل باللغة العربية..."
          />
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button
          type="submit"
          disabled={loading}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.25em] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <>
              <div className="w-3 h-3 border-2 border-[color-mix(in_srgb,var(--background)_30%,transparent)] border-t-background animate-spin rounded-full" />
              Processing...
            </>
          ) : (
            <>
              <Plus size={16} />
              {initialData ? 'Update Product' : 'Create Product'}
            </>
          )}
        </button>
      </div>
    </form>
  );
}
