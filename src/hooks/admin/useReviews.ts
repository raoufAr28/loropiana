"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";
import { createClient } from "@supabase/supabase-js";

export interface Review {
  id: string;
  full_name: string;
  comment: string;
  rating: number;
  locale: string;
  is_approved: boolean;
  email?: string;
  created_at: string;
}

// Admin client uses service role to bypass RLS and see ALL reviews
const adminClient = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export function useReviews(showToast: (m: string, t: "success" | "error") => void) {
  const [reviews, setReviews] = useState<Review[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState<string | null>(null);

  const fetchAll = useCallback(async () => {
    setLoading(true);
    try {
      // Admin fetches ALL reviews regardless of approval status
      const { data, error } = await adminClient
        .from("reviews")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;
      setReviews(data || []);
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement des avis", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const approveReview = async (id: string, approve: boolean) => {
    setUpdating(id);
    try {
      const { error } = await adminClient
        .from("reviews")
        .update({ is_approved: approve })
        .eq("id", id);

      if (error) throw error;
      showToast(
        approve ? "Avis publié avec succès" : "Avis masqué avec succès",
        "success"
      );
      await fetchAll();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUpdating(null);
    }
  };

  const deleteReview = async (id: string) => {
    setUpdating(id);
    try {
      const { error } = await adminClient
        .from("reviews")
        .delete()
        .eq("id", id);

      if (error) throw error;
      showToast("Avis supprimé définitivement", "success");
      await fetchAll();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUpdating(null);
    }
  };

  const pendingCount = reviews.filter((r) => !r.is_approved).length;

  return {
    reviews,
    loading,
    updating,
    approveReview,
    deleteReview,
    pendingCount,
    refresh: fetchAll,
  };
}
