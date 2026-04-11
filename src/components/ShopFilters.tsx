"use client";

import { useTranslations } from "next-intl";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { useCallback, useState, useMemo } from "react";
import {
  SlidersHorizontal, X, Footprints, ShoppingBag, Gem, Sparkles, Brush, Watch, Glasses,
  CheckCircle2, Tag, RotateCcw
} from "lucide-react";

interface Category {
  slug: string;
  name: string;
}

const getCategoryIcon = (slug: string) => {
  switch (slug) {
    case 'shoes': return <Footprints size={14} />;
    case 'bags': return <ShoppingBag size={14} />;
    case 'accessories': return <Gem size={14} />;
    case 'perfumes': return <Sparkles size={14} />;
    case 'makeup': return <Brush size={14} />;
    case 'watches': return <Watch size={14} />;
    case 'glasses': return <Glasses size={14} />;
    default: return <Tag size={14} />;
  }
};

const FilterCard = ({ title, children }: { title: string, children: React.ReactNode }) => (
  <div className="flex flex-col gap-4 animate-in fade-in slide-in-from-bottom-2 duration-500">
    <h3 className="font-playfair text-xl uppercase tracking-widest font-semibold text-foreground/90">{title}</h3>
    <div className="flex flex-wrap gap-2.5">
      {children}
    </div>
  </div>
);

const FilterChip = ({
  label, icon, active, onClick
}: {
  label: string, icon?: React.ReactNode, active: boolean, onClick: () => void
}) => (
  <button
    onClick={onClick}
    className={`flex items-center gap-2 px-4 py-2 rounded-full text-xs uppercase tracking-wider transition-all duration-300 border
      ${active
        ? "bg-foreground text-background border-foreground shadow-[0_4px_12px_rgba(0,0,0,0.1)] dark:shadow-[0_4px_12px_rgba(255,255,255,0.05)] scale-[1.02]"
        : "bg-transparent text-taupe border-gray-200 dark:border-gray-800 hover:border-gray-400 dark:hover:border-gray-500 hover:text-foreground hover:bg-gray-50 dark:hover:bg-[#252525]"
      }`}
  >
    {icon}
    <span>{label}</span>
  </button>
);

const FilterBadge = ({ label, onRemove }: { label: string, onRemove: () => void }) => (
  <span className="flex items-center gap-2 px-3 py-1.5 bg-background rounded-full text-[10px] md:text-xs uppercase tracking-wider text-foreground border border-gray-200 dark:border-gray-800 shadow-sm animate-in fade-in zoom-in duration-200">
    {label}
    <button onClick={onRemove} className="text-taupe hover:text-red-500 transition-colors rounded-full hover:bg-gray-100 dark:hover:bg-gray-800 p-0.5">
      <X size={12} />
    </button>
  </span>
);

export function ShopFilters({ categories }: { categories: Category[] }) {
  const t = useTranslations("Filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const [isMobileOpen, setIsMobileOpen] = useState(false);

  const createQueryString = useCallback(
    (name: string, value: string) => {
      const params = new URLSearchParams(searchParams.toString());
      if (value) {
        if (name === "category") {
          if (params.get(name) === value) {
            params.delete(name);
          } else {
            params.set(name, value);
          }
        } else {
          params.set(name, value);
        }
      } else {
        params.delete(name);
      }
      return params.toString();
    },
    [searchParams]
  );

  const toggleParam = (name: string, value: string) => {
    router.replace(pathname + "?" + createQueryString(name, value), { scroll: false });
  };

  const handleStockToggle = () => {
    const current = searchParams.get('inStock');
    router.replace(pathname + "?" + createQueryString('inStock', current === 'true' ? '' : 'true'), { scroll: false });
  };

  const clearFilters = () => {
    router.replace(pathname, { scroll: false });
    setIsMobileOpen(false);
  };

  const currentCategory = searchParams.get('category');
  const currentInStock = searchParams.get('inStock') === 'true';

  const activeFilters = useMemo(() => {
    const filters = [];
    if (currentCategory) {
      const cat = categories.find(c => c.slug === currentCategory);
      filters.push({ key: 'category', value: currentCategory, label: cat ? cat.name : currentCategory });
    }
    if (currentInStock) {
      filters.push({ key: 'inStock', value: 'true', label: t('in_stock') });
    }
    return filters;
  }, [currentCategory, currentInStock, categories, t]);

  const FiltersContent = () => (
    <div className="flex flex-col gap-10">

      {/* Active Filters Header */}
      {activeFilters.length > 0 && (
        <div className="flex flex-col gap-3">
          <div className="flex justify-between items-center">
            <span className="text-xs uppercase tracking-widest text-taupe font-semibold">
              {activeFilters.length} Filtre{activeFilters.length > 1 ? 's' : ''} actif{activeFilters.length > 1 ? 's' : ''}
            </span>
            <button
              onClick={clearFilters}
              className="group flex items-center gap-1.5 text-xs uppercase tracking-widest hover:text-red-500 transition-colors text-taupe"
            >
              <RotateCcw size={12} className="group-hover:-rotate-180 transition-transform duration-500" />
              {t('clear_filters')}
            </button>
          </div>
          <div className="flex flex-wrap gap-2">
            {activeFilters.map(filter => (
              <FilterBadge
                key={filter.key}
                label={filter.label}
                onRemove={() => {
                  if (filter.key === 'inStock') handleStockToggle();
                  else toggleParam(filter.key, filter.value);
                }}
              />
            ))}
          </div>
          <div className="h-[1px] bg-gradient-to-r from-transparent via-gray-200 dark:via-gray-800 to-transparent w-full mt-2" />
        </div>
      )}


      <div className="h-[1px] bg-gray-100 dark:bg-gray-800/60 w-full rounded-full" />

      {/* Availability */}
      <FilterCard title={t('availability')}>
        <FilterChip
          label={t('in_stock')}
          icon={<CheckCircle2 size={14} className={currentInStock ? "text-background" : "text-green-600"} />}
          active={currentInStock}
          onClick={handleStockToggle}
        />
      </FilterCard>

      <div className="h-[1px] bg-gray-100 dark:bg-gray-800/60 w-full rounded-full" />

      {/* Sorting */}
      <div className="flex flex-col gap-4">
        <h3 className="font-playfair text-xl uppercase tracking-widest font-semibold text-foreground/90">{t('sort_by')}</h3>
        <div className="relative">
          <select
            className="w-full appearance-none bg-background/50 backdrop-blur border border-gray-200 dark:border-gray-800 hover:border-gray-300 dark:hover:border-gray-600 rounded-2xl px-5 py-4 outline-none text-sm uppercase tracking-wider cursor-pointer shadow-sm transition-colors"
            value={searchParams.get('sort') || 'newest'}
            onChange={(e) => toggleParam('sort', e.target.value)}
          >
            <option value="newest">{t('sort_newest')}</option>
            <option value="price_asc">{t('sort_price_asc')}</option>
            <option value="price_desc">{t('sort_price_desc')}</option>
          </select>
          <div className="absolute top-1/2 -translate-y-1/2 right-5 pointer-events-none text-taupe">
            <svg width="12" height="8" viewBox="0 0 12 8" fill="none" xmlns="http://www.w3.org/2000/svg">
              <path d="M1 1.5L6 6.5L11 1.5" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
            </svg>
          </div>
        </div>
      </div>

    </div>
  );

  return (
    <>
      {/* Mobile Toggle Button */}
      <div className="md:hidden flex justify-between items-center mb-6 w-full">
        <button
          onClick={() => setIsMobileOpen(true)}
          className="flex items-center justify-center gap-3 w-full bg-foreground text-background rounded-full px-6 py-4 uppercase text-sm font-bold tracking-widest shadow-lg hover:bg-opacity-90 transition-all active:scale-95"
        >
          <SlidersHorizontal size={18} /> {t('filter_title')}
          {activeFilters.length > 0 && (
            <span className="bg-background text-foreground rounded-full w-5 h-5 flex items-center justify-center text-[10px]">
              {activeFilters.length}
            </span>
          )}
        </button>
      </div>

      {/* Mobile Drawer Overlay */}
      {isMobileOpen && (
        <div className="fixed inset-0 z-[100] flex md:hidden animate-in fade-in duration-300">
          <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={() => setIsMobileOpen(false)} />
          <div className="relative w-[85%] max-w-md bg-[#FAF9F6] dark:bg-[#1C1A19] h-full p-8 overflow-y-auto flex flex-col transform transition-transform animate-in slide-in-from-left shadow-2xl rounded-r-3xl">
            <div className="flex justify-between items-center mb-8 border-b border-gray-200 dark:border-gray-800 pb-6">
              <span className="font-playfair text-2xl font-bold uppercase tracking-widest">{t('filter_title')}</span>
              <button onClick={() => setIsMobileOpen(false)} className="text-taupe hover:text-foreground bg-gray-100 dark:bg-gray-800 p-2 rounded-full transition-colors"><X size={20} /></button>
            </div>
            <FiltersContent />
            <button
              onClick={() => setIsMobileOpen(false)}
              className="mt-12 w-full bg-foreground text-background py-4 rounded-full uppercase font-bold tracking-widest shadow-lg active:scale-95 transition-transform"
            >
              {t('apply')}
            </button>
          </div>
        </div>
      )}

      {/* Desktop Sticky Luxury Sidebar */}
      <aside className="hidden md:block w-80 flex-shrink-0 sticky top-28 h-fit self-start">
        <div className="bg-[#FAF9F6]/80 dark:bg-[#1C1A19]/80 backdrop-blur-xl border border-white/20 dark:border-white/5 rounded-3xl p-8 shadow-[0_8px_30px_rgb(0,0,0,0.04)] dark:shadow-[0_8px_30px_rgb(0,0,0,0.2)]">
          <FiltersContent />
        </div>
      </aside>
    </>
  );
}
