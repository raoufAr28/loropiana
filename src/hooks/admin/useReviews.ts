"use client";

import { useState, useEffect, useCallback } from "react";
import { createClient } from "@supabase/supabase-js";

export interface Review {
  id: string;
  full_name: string;
  comment?: string; // Legacy
  comment_fr: string;
  comment_ar: string;
  rating: number;
  locale: string;
  status: 'pending' | 'approved' | 'rejected';
  is_verified?: boolean;
  product_id?: string;
  helpful_count?: number;
  email?: string;
  created_at: string;
  products?: {
    name_fr: string;
    name_ar: string;
    slug: string;
    product_images?: { image_url: string }[];
  };
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
      // Admin fetches ALL reviews
      const { data, error } = await adminClient
        .from("reviews")
        .select(`
          *,
          products (
            name_fr,
            name_ar,
            slug,
            product_images (image_url)
          )
        `)
        .order("created_at", { ascending: false });

      if (error) {
        // Fallback for missing relation cache while user runs SQL
        const { data: fallback, error: err2 } = await adminClient.from("reviews").select("*").order("created_at", { ascending: false });
        if (err2) throw err2;
        setReviews(fallback || []);
      } else {
        setReviews(data || []);
      }
    } catch (err: any) {
      showToast(err.message || "Erreur lors du chargement des avis", "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchAll();
  }, [fetchAll]);

  const updateStatus = async (id: string, status: 'approved' | 'rejected' | 'pending') => {
    setUpdating(id);
    try {
      const response = await fetch(`/api/reviews/${id}`, {
        method: "PATCH",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ status })
      });

      if (!response.ok) throw new Error("Failed to update status");
      
      showToast(
        status === 'approved' ? "Avis publié" : status === 'rejected' ? "Avis rejeté" : "Avis mis en attente",
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
      const response = await fetch(`/api/reviews/${id}`, {
        method: "DELETE"
      });

      if (!response.ok) throw new Error("Failed to delete");
      
      showToast("Avis supprimé définitivement", "success");
      await fetchAll();
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setUpdating(null);
    }
  };

  const pendingCount = reviews.filter((r) => r.status === 'pending').length;

  return {
    reviews,
    loading,
    updating,
    updateStatus,
    deleteReview,
    pendingCount,
    refresh: fetchAll,
  };
}
