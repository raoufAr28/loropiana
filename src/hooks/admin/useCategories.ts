"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

export interface Category {
  id: string;
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  image_url: string;
  created_at: string;
}

export interface CategoryFormData {
  slug: string;
  name_fr: string;
  name_ar: string;
  description_fr: string;
  description_ar: string;
  image_url: string;
}

export function useCategories(
  showToast: (m: string, t: "success" | "error") => void
) {
  const [categories, setCategories] = useState<Category[]>([]);
  const [loading, setLoading] = useState(true);
  const [submitting, setSubmitting] = useState(false);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from("categories")
        .select("*")
        .order("name_fr", { ascending: true });

      if (error) throw error;

      setCategories(data || []);
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();
  }, [fetchData]);

  const saveCategory = async (
    form: CategoryFormData,
    editingId?: string
  ) => {
    setSubmitting(true);
    try {
      if (editingId) {
        const { error } = await supabase
          .from("categories")
          .update(form)
          .eq("id", editingId);

        if (error) throw error;

        showToast("Catégorie mise à jour", "success");
      } else {
        const { error } = await supabase
          .from("categories")
          .insert([form]);

        if (error) throw error;

        showToast("Nouvelle catégorie créée", "success");
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

  const deleteCategory = async (id: string) => {
    try {
      const { error } = await supabase
        .from("categories")
        .delete()
        .eq("id", id);

      if (error) throw error;

      showToast("Catégorie supprimée", "success");
      await fetchData();
      return true;
    } catch (err: any) {
      showToast(err.message || "Erreur lors de la suppression", "error");
      return false;
    }
  };

  return {
    categories,
    loading,
    submitting,
    saveCategory,
    deleteCategory,
    refresh: fetchData,
  };
}