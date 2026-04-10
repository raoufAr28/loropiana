"use client";

import { useState, useEffect, useRef } from "react";
import { useRouter, usePathname, useSearchParams } from "next/navigation";
import { Search, X, ArrowRight, Loader2, ChevronDown, CheckCircle2 } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { supabase } from "@/utils/supabase/client";
import { useLocale, useTranslations } from "next-intl";
import { formatPrice } from "@/utils/currency";

interface Category {
  slug: string;
  name: string;
}

interface Suggestion {
  id: string;
  slug: string;
  name: string;
  price: number;
  category: string;
  image_url: string;
}

interface ShopSearchProps {
  locale: string;
  categories: Category[];
}

export function ShopSearch({ locale, categories }: ShopSearchProps) {
  const t = useTranslations("Navigation");
  const f = useTranslations("Filters");
  const router = useRouter();
  const pathname = usePathname();
  const searchParams = useSearchParams();
  const isRTL = locale === "ar";
  
  const [query, setQuery] = useState(searchParams.get("search") || "");
  const [selectedCategory, setSelectedCategory] = useState(searchParams.get("category") || "");
  const [suggestions, setSuggestions] = useState<Suggestion[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [isOpen, setIsOpen] = useState(false);
  const [activeIndex, setActiveIndex] = useState(-1);
  const containerRef = useRef<HTMLDivElement>(null);

  // Debounced search for suggestions
  useEffect(() => {
    const timer = setTimeout(() => {
      if (query.trim().length > 1) {
        fetchSuggestions(query);
      } else {
        setSuggestions([]);
        setIsOpen(false);
      }
    }, 300);

    return () => clearTimeout(timer);
  }, [query]);

  // Click outside to close
  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (containerRef.current && !containerRef.current.contains(event.target as Node)) {
        setIsOpen(false);
      }
    };
    document.addEventListener("mousedown", handleClickOutside);
    return () => document.removeEventListener("mousedown", handleClickOutside);
  }, []);

  const fetchSuggestions = async (searchTerm: string) => {
    setIsLoading(true);
    try {
      const { data, error } = await supabase
        .from("products")
        .select(`
          id, slug, name_fr, name_ar, price,
          categories(name_fr, name_ar),
          product_images(image_url, is_primary)
        `)
        .or(`name_fr.ilike.%${searchTerm}%,name_ar.ilike.%${searchTerm}%,description_fr.ilike.%${searchTerm}%,description_ar.ilike.%${searchTerm}%`)
        .limit(5);

      if (error) throw error;

      if (data) {
        const formatted = data.map((p: any) => ({
          id: p.id,
          slug: p.slug,
          name: locale === "fr" ? p.name_fr : p.name_ar,
          price: p.price,
          category: locale === "fr" ? p.categories?.name_fr : p.categories?.name_ar,
          image_url: p.product_images?.find((img: any) => img.is_primary)?.image_url || p.product_images?.[0]?.image_url || "",
        }));
        setSuggestions(formatted);
        setIsOpen(true);
      }
    } catch (err) {
      console.error("Search error:", err);
    } finally {
      setIsLoading(false);
    }
  };

  const handleSearch = (term: string, cat?: string) => {
    const params = new URLSearchParams(searchParams.toString());
    if (term) {
      params.set("search", term);
    } else {
      params.delete("search");
    }
    
    if (cat !== undefined) {
      if (cat) params.set("category", cat);
      else params.delete("category");
    }

    router.push(`${pathname}?${params.toString()}`);
    setIsOpen(false);
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "ArrowDown") {
      setActiveIndex(prev => Math.min(prev + 1, suggestions.length - 1));
    } else if (e.key === "ArrowUp") {
      setActiveIndex(prev => Math.max(prev - 1, -1));
    } else if (e.key === "Enter") {
      if (activeIndex >= 0) {
        const selected = suggestions[activeIndex];
        router.push(`/${locale}/product/${selected.slug}`);
        setIsOpen(false);
      } else {
        handleSearch(query);
      }
    } else if (e.key === "Escape") {
      setIsOpen(false);
    }
  };

  const LUXURY_BLUE = "#00487A";

  return (
    <div className="w-full max-w-4xl mx-auto px-4" ref={containerRef} dir={isRTL ? "rtl" : "ltr"}>
      <div className="flex flex-col md:flex-row gap-4 items-center justify-center relative">
        
        {/* CENTERED UNIFIED BAR */}
        <div className="flex flex-col md:flex-row w-full glass-panel-heavy rounded-[1.5rem] md:rounded-full p-2 border border-white/20 dark:border-white/10 shadow-luxury group transition-all duration-500 focus-within:shadow-2xl focus-within:border-[#00487A]/30">
          
          {/* Search Input Section */}
          <div className="relative flex-1 group/input">
            <div className={`absolute inset-y-0 ${isRTL ? 'right-5' : 'left-5'} flex items-center pointer-events-none text-taupe group-focus-within/input:text-[#00487A] transition-colors`}>
              {isLoading ? <Loader2 size={18} className="animate-spin" /> : <Search size={18} />}
            </div>
            <input
              type="text"
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              onKeyDown={handleKeyDown}
              onFocus={() => query.trim().length > 1 && setIsOpen(true)}
              placeholder={t("search")}
              className={`w-full bg-transparent py-4 ${isRTL ? 'pr-12 pl-6' : 'pl-12 pr-6'} outline-none text-sm uppercase tracking-widest font-bold placeholder:text-taupe/50`}
            />
            {query && (
              <button 
                onClick={() => { setQuery(""); setSuggestions([]); handleSearch(""); }}
                className={`absolute inset-y-0 ${isRTL ? 'left-5' : 'right-5'} flex items-center text-taupe hover:text-red-500 transition-colors`}
              >
                <X size={16} />
              </button>
            )}
          </div>

          {/* Separation Line (Desktop) */}
          <div className="hidden md:block w-[1px] h-8 bg-gray-200 dark:bg-white/10 self-center mx-2" />

          {/* Categories Selector */}
          <div className="relative w-full md:w-[220px] group/select">
            <select 
              value={selectedCategory} 
              onChange={(e) => {
                const cat = e.target.value;
                setSelectedCategory(cat);
                handleSearch(query, cat);
              }}
              className={`w-full bg-transparent ${isRTL ? 'pr-6 pl-10' : 'pl-6 pr-10'} py-4 outline-none text-[10px] uppercase tracking-[0.2em] font-black appearance-none cursor-pointer text-taupe hover:text-[#00487A] transition-colors`}
            >
              <option value="" className="bg-slate">{f("all_products") || "Toutes les catégories"}</option>
              {categories.map(cat => (
                <option key={cat.slug} value={cat.slug} className="bg-slate">
                  {cat.name}
                </option>
              ))}
            </select>
            <div className={`absolute inset-y-0 ${isRTL ? 'left-4' : 'right-4'} flex items-center pointer-events-none text-taupe group-hover/select:text-[#00487A] transition-colors`}>
               <ChevronDown size={14} />
            </div>
          </div>
        </div>

        {/* Suggestions Dropdown (Full Width under the bar) */}
        <AnimatePresence>
          {isOpen && (
            <motion.div
              initial={{ opacity: 0, y: 10, scale: 0.98 }}
              animate={{ opacity: 1, y: 0, scale: 1 }}
              exit={{ opacity: 0, y: 10, scale: 0.98 }}
              transition={{ duration: 0.2, ease: "easeOut" }}
              className="absolute top-full left-0 right-0 mt-3 z-50 glass-panel-heavy rounded-[2rem] overflow-hidden shadow-2xl border border-white/20 dark:border-white/10"
            >
              <div className="p-3">
                {suggestions.length > 0 ? (
                  <>
                    <div className="px-5 py-3 text-[10px] uppercase tracking-[0.3em] font-black text-[#00487A] border-b border-gray-100 dark:border-white/5 mb-2 bg-[#00487A]/5 rounded-t-xl">
                      {isRTL ? "المنتجات المقترحة" : "Suggestions de produits"}
                    </div>
                    {suggestions.map((item, index) => (
                      <motion.div
                        key={item.id}
                        initial={{ opacity: 0, x: isRTL ? 10 : -10 }}
                        animate={{ opacity: 1, x: 0 }}
                        transition={{ delay: index * 0.05 }}
                        onClick={() => {
                          router.push(`/${locale}/product/${item.slug}`);
                          setIsOpen(false);
                        }}
                        onMouseEnter={() => setActiveIndex(index)}
                        className={`flex items-center gap-5 p-3 rounded-2xl cursor-pointer transition-all ${
                          activeIndex === index ? "bg-[#00487A]/10" : "hover:bg-foreground/5 dark:hover:bg-white/5"
                        }`}
                      >
                        <div className="w-14 h-20 bg-gray-100 dark:bg-white/5 rounded-xl overflow-hidden flex-shrink-0 shadow-lg border border-white/10">
                          {item.image_url && (
                            <img src={item.image_url} alt={item.name} className="w-full h-full object-cover" />
                          )}
                        </div>
                        <div className="flex-1 min-w-0">
                          <h4 className="text-sm uppercase font-black tracking-widest truncate">{item.name}</h4>
                          <p className="text-[10px] text-taupe uppercase tracking-widest mt-1 font-bold">{item.category}</p>
                        </div>
                        <div className="text-sm font-black font-inter text-[#00487A] bg-white/50 dark:bg-black/20 px-3 py-1 rounded-full border border-white/10 shadow-sm">
                          {formatPrice(item.price, locale)}
                        </div>
                      </motion.div>
                    ))}
                    
                    <button 
                      onClick={() => handleSearch(query)}
                      className="w-full mt-2 p-5 flex items-center justify-between text-[10px] uppercase font-black tracking-[0.3em] text-[#00487A] hover:bg-[#00487A] hover:text-white transition-all border-t border-gray-100 dark:border-white/5 rounded-b-[1.5rem] group"
                    >
                      <span>{t("view_all_results")}</span>
                      <ArrowRight size={16} className={`transition-transform duration-300 group-hover:translate-x-2 ${isRTL ? "rotate-180 group-hover:-translate-x-2" : ""}`} />
                    </button>
                  </>
                ) : (
                  <div className="p-12 text-center">
                    <div className="mb-4 text-[#00487A] opacity-20 flex justify-center"><Search size={40} /></div>
                    <p className="text-xs uppercase tracking-[0.3em] font-black text-taupe">
                      {t("no_results")}
                    </p>
                  </div>
                )}
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  );
}
