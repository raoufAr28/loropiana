"use client";

import { MessageSquare } from "lucide-react";
import { useReviews } from "@/hooks/admin/useReviews";
import { ReviewsTable } from "./reviews/ReviewsTable";

interface ReviewsModuleProps {
  showToast: (m: string, t: "success" | "error") => void;
}

export function ReviewsModule({ showToast }: ReviewsModuleProps) {
  const { reviews, loading, updating, approveReview, deleteReview } =
    useReviews(showToast);

  const pendingCount = reviews.filter((r) => !r.is_approved).length;
  const approvedCount = reviews.filter((r) => r.is_approved).length;

  if (loading) {
    return (
      <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-card rounded-xl border border-border">
        <div className="w-10 h-10 border-4 border-muted border-t-primary animate-spin rounded-full" />
        <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">
          Chargement des avis...
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <header className="bg-card p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
          <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-foreground border border-border shadow-inner">
            <MessageSquare size={22} />
          </div>
          <div>
            <h3 className="font-black text-2xl text-foreground uppercase tracking-tighter">
              Modération des Avis
            </h3>
            <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">
              {reviews.length} avis total · {pendingCount} en attente · {approvedCount} publiés
            </p>
          </div>
        </div>

        {/* Quick stats */}
        <div className="flex gap-4">
          <div className="text-center px-4 py-2 bg-muted border border-border rounded-xl">
            <p className="text-2xl font-black text-foreground">{pendingCount}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-muted-foreground">En attente</p>
          </div>
          <div className="text-center px-4 py-2 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-xl">
            <p className="text-2xl font-black text-primary">{approvedCount}</p>
            <p className="text-[9px] font-black uppercase tracking-widest text-primary">Publiés</p>
          </div>
        </div>
      </header>

      <ReviewsTable
        reviews={reviews}
        updating={updating}
        onApprove={approveReview}
        onDelete={deleteReview}
      />
    </div>
  );
}
