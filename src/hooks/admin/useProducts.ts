"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

export interface Product {
  id: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  slug: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  created_at: string;
  categories?: {
    id: string;
    name_fr: string;
    name_ar: string;
  };
  product_images?: Array<{
    id: string;
    image_url: string;
    is_primary: boolean;
  }>;
}

export interface ProductFormData {
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  slug: string;
  price: number;
  stock_quantity: number;
  category_id: string;
  is_featured: boolean;
  is_new_arrival: boolean;
  image_url: string;
}

export function useProducts(
  showToast: (m: string, t: "success" | "error") => void
) {
  const [products, setProducts] = useState<Product[]>([]);
  const [categories, setCategories] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);

    try {
      const [pRes, cRes] = await Promise.all([
        supabase
          .from("products")
          .select(`
            *,
            categories (
              id,
              name_fr,
              name_ar
            ),
            product_images (
              id,
              image_url,
              is_primary
            )
          `)
          .order("created_at", { ascending: false }),

        supabase
          .from("categories")
          .select("id, name_fr, name_ar")
          .order("created_at", { ascending: false }),
      ]);

      if (pRes.error) throw pRes.error;
      if (cRes.error) throw cRes.error;

      setProducts((pRes.data as Product[]) || []);
      setCategories(cRes.data || []);
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveProduct = async (form: ProductFormData, editingId?: string) => {
    setSubmitting(true);

    try {
      const { image_url } = form;

      const productToSave = {
        name_fr: form.name_fr,
        name_ar: form.name_ar,
        description_fr: form.description_fr,
        description_ar: form.description_ar,
        slug: form.slug,
        price: Number(form.price),
        stock_quantity: Number(form.stock_quantity),
        category_id: Number(form.category_id),
        is_featured: form.is_featured,
        is_new_arrival: form.is_new_arrival,
      };

      let pid = editingId;

      if (editingId) {
        const { error } = await supabase
          .from("products")
          .update(productToSave)
          .eq("id", editingId);

        if (error) throw error;

        showToast("Produit actualisé", "success");
      } else {
        const { data, error } = await supabase
          .from("products")
          .insert([productToSave])
          .select()
          .single();

        if (error) throw error;

        pid = String(data.id);
        showToast("Produit créé avec succès", "success");
      }

      if (image_url && pid) {
        const { error: deleteImageError } = await supabase
          .from("product_images")
          .delete()
          .eq("product_id", pid);

        if (deleteImageError) throw deleteImageError;

        const { error: insertImageError } = await supabase
          .from("product_images")
          .insert([
            {
              product_id: pid,
              image_url,
              is_primary: true,
            },
          ]);

        if (insertImageError) throw insertImageError;
      }

      await fetchData();
      return true;
    } catch (err: any) {
      showToast(err.message || "Erreur lors de l'enregistrement", "error");
      return false;
    } finally {
      setSubmitting(false);
    }
  };

  const deleteProduct = async (id: string) => {
    try {
      const { error } = await supabase.from("products").delete().eq("id", id);

      if (error) throw error;

      showToast("Produit retiré", "success");
      await fetchData();
      return true;
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la suppression", "error");
      return false;
    }
  };

  return {
    products,
    categories,
    loading,
    submitting,
    saveProduct,
    deleteProduct,
    refresh: fetchData,
  };
}