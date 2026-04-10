"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Plus } from "lucide-react";
import { CategoryFormData } from "@/hooks/admin/useCategories";

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  loading: boolean;
  locale: string;
}

export function CategoryForm({ initialData, onSubmit, loading, locale }: CategoryFormProps) {
  const [form, setForm] = useState<CategoryFormData>(initialData || {
    slug: "",
    name_fr: "",
    name_ar: "",
    description_fr: "",
    description_ar: "",
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

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});
    onSubmit(form);
  };

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setForm(prev => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors(prev => ({ ...prev, [field]: false }));
    }
  };

  const labelClass = "text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block ml-1";
  const inputClass = (field: string) => `w-full bg-card border ${errors[field] ? 'border-danger ring-[color-mix(in_srgb,var(--danger)_10%,transparent)]' : 'border-border focus:border-foreground focus:ring-[color-mix(in_srgb,var(--foreground)_5%,transparent)]'} px-4 py-3 rounded-xl text-sm outline-none transition-all shadow-sm`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8 animate-in fade-in slide-in-from-bottom-4 duration-500">
      
      {/* Visual Identity Section */}
      <div className="space-y-6">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Visual Identity
        </h4>
        
        <div className="flex gap-6 items-start">
           <div className="w-24 h-24 rounded-2xl bg-muted border border-border flex-shrink-0 flex items-center justify-center overflow-hidden shadow-inner">
              {form.image_url ? (
                <div className="relative w-full h-full group">
                  <img src={form.image_url} alt="Preview" className="w-full h-full object-cover" />
                  <button 
                    type="button"
                    onClick={() => handleChange('image_url', '')}
                    className="absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_40%,transparent)] text-background opacity-0 group-hover:opacity-100 transition-opacity flex items-center justify-center"
                  >
                    <X size={20} />
                  </button>
                </div>
              ) : (
                <ImageIcon className="text-muted-foreground" size={32} />
              )}
           </div>
           
           <div className="flex-1 space-y-4">
              <div>
                 <label className={labelClass}>Collection Asset (Image URL)</label>
                 <input 
                   value={form.image_url} 
                   onChange={(e) => handleChange('image_url', e.target.value)} 
                   className={inputClass('image_url')} 
                   placeholder="https://images.unsplash.com/..." 
                 />
              </div>
              <div>
                 <label className={labelClass}>Registry Link (Slug)</label>
                 <div className="flex items-center gap-3">
                    <span className="text-muted-foreground font-bold">/</span>
                    <input 
                      value={form.slug} 
                      onChange={(e) => handleChange('slug', e.target.value)} 
                      className={inputClass('slug')} 
                      placeholder="men-collection-2024" 
                    />
                 </div>
              </div>
           </div>
        </div>
      </div>

      {/* Content Section (Bilingual) */}
      <div className="space-y-8 border-t border-border pt-8">
        <h4 className="text-[11px] font-black text-foreground uppercase tracking-[0.2em] flex items-center gap-2">
          <span className="w-1.5 h-1.5 rounded-full bg-primary" />
          Registry Entry (FR/AR)
        </h4>

        <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
          <div className="space-y-6">
            <div>
              <label className={labelClass}>Title (Français)</label>
              <input 
                value={form.name_fr} 
                onChange={(e) => handleChange('name_fr', e.target.value)} 
                className={inputClass('name_fr')} 
                placeholder="Nouvelle Collection" 
              />
            </div>
            <div>
              <label className={labelClass}>Description (Français)</label>
              <textarea 
                value={form.description_fr} 
                onChange={(e) => handleChange('description_fr', e.target.value)} 
                className={`${inputClass('description_fr')} min-h-[120px] py-4 resize-none`} 
                placeholder="L'essence du luxe transparaît..." 
              />
            </div>
          </div>

          <div className="space-y-6">
            <div>
              <label className={`${labelClass} text-right mr-1`}>العنوان (العربية)</label>
              <input 
                value={form.name_ar} 
                onChange={(e) => handleChange('name_ar', e.target.value)} 
                className={`${inputClass('name_ar')} text-right`} 
                dir="rtl" 
                placeholder="المجموعة الجديدة" 
              />
            </div>
            <div>
              <label className={`${labelClass} text-right mr-1`}>الوصف (العربية)</label>
              <textarea 
                value={form.description_ar} 
                onChange={(e) => handleChange('description_ar', e.target.value)} 
                className={`${inputClass('description_ar')} min-h-[120px] py-4 resize-none text-right`} 
                dir="rtl" 
                placeholder="جوهر الفخامة يتجلى في..." 
              />
            </div>
          </div>
        </div>
      </div>

      <div className="flex justify-end pt-4">
        <button 
          type="submit" 
          disabled={loading}
          className="w-full md:w-auto bg-primary text-white px-10 py-4 rounded-xl text-[10px] font-black uppercase tracking-[0.3em] shadow-sm hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-3"
        >
          {loading ? (
            <div className="w-3 h-3 border-2 border-[color-mix(in_srgb,var(--background)_30%,transparent)] border-t-background animate-spin rounded-full" />
          ) : (
            <Plus size={16} />
          )}
          {initialData ? 'Update Archive' : 'Register Collection'}
        </button>
      </div>
    </form>
  );
}
