"use client";

import { useState } from "react";
import { Search, Filter, CheckCircle, XCircle, Trash2, Star } from "lucide-react";
import { format } from "date-fns";
import { Review } from "@/hooks/admin/useReviews";

type StatusFilter = "all" | "approved" | "pending";

interface ReviewsTableProps {
  reviews: Review[];
  updating: string | null;
  onApprove: (id: string, approve: boolean) => void;
  onDelete: (id: string) => void;
}

const StarRating = ({ rating }: { rating: number }) => (
  <div className="flex gap-0.5">
    {[1, 2, 3, 4, 5].map((s) => (
      <Star
        key={s}
        size={12}
        fill={s <= rating ? "currentColor" : "transparent"}
        className={s <= rating ? "text-primary" : "text-muted-foreground"}
      />
    ))}
  </div>
);

export function ReviewsTable({ reviews, updating, onApprove, onDelete }: ReviewsTableProps) {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState<StatusFilter>("all");

  const FILTERS: StatusFilter[] = ["all", "pending", "approved"];

  const filtered = reviews.filter((r) => {
    const q = search.toLowerCase();
    const matchSearch =
      r.full_name.toLowerCase().includes(q) ||
      r.comment.toLowerCase().includes(q);
    const matchStatus =
      statusFilter === "all" ||
      (statusFilter === "approved" && r.is_approved) ||
      (statusFilter === "pending" && !r.is_approved);
    return matchSearch && matchStatus;
  });

  return (
    <div className="space-y-4">
      {/* Search + Filters */}
      <div className="flex flex-col md:flex-row gap-4 items-start md:items-center justify-between">
        <div className="relative group w-full max-w-sm">
          <Search
            className="absolute left-3 top-1/2 -translate-y-1/2 text-muted-foreground group-focus-within:text-foreground transition-colors"
            size={16}
          />
          <input
            placeholder="Rechercher un avis..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="w-full bg-card border border-border pl-9 pr-4 py-2.5 rounded-xl text-sm outline-none focus:ring-2 focus:ring-[color-mix(in_srgb,var(--foreground)_5%,transparent)] focus:border-foreground transition-all shadow-sm"
          />
        </div>

        <div className="flex items-center gap-2">
          <Filter size={14} className="text-muted-foreground flex-shrink-0" />
          {FILTERS.map((f) => (
            <button
              key={f}
              onClick={() => setStatusFilter(f)}
              className={`px-4 py-2 rounded-lg text-[10px] font-black uppercase tracking-widest transition-all border ${
                statusFilter === f
                  ? "bg-primary text-primary-foreground border-primary"
                  : "bg-card text-muted-foreground border-border hover:border-[color-mix(in_srgb,var(--foreground)_20%,transparent)]"
              }`}
            >
              {f === "all" ? "Tous" : f === "approved" ? "Approuvés" : "En attente"}
            </button>
          ))}
        </div>
      </div>

      {/* Table */}
      <div className="bg-card rounded-xl border border-border shadow-sm overflow-hidden">
        <div className="overflow-x-auto">
          <table className="w-full text-left text-sm">
            <thead className="bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] border-b border-border text-muted-foreground font-medium text-[11px] uppercase tracking-wider">
              <tr>
                <th className="px-6 py-4">Client</th>
                <th className="px-6 py-4">Avis</th>
                <th className="px-6 py-4">Note</th>
                <th className="px-6 py-4">Date</th>
                <th className="px-6 py-4">Statut</th>
                <th className="px-6 py-4 text-right">Actions</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-border">
              {filtered.map((r) => {
                const isUpdating = updating === r.id;
                return (
                  <tr key={r.id} className="hover:bg-[color-mix(in_srgb,var(--muted)_50%,transparent)] transition-colors group">
                    <td className="px-6 py-5">
                      <div>
                        <p className="font-bold text-foreground text-sm">{r.full_name}</p>
                        {r.email && (
                          <p className="text-[10px] text-muted-foreground mt-0.5">{r.email}</p>
                        )}
                      </div>
                    </td>
                    <td className="px-6 py-5 max-w-xs">
                      <p className="text-sm text-muted-foreground line-clamp-2 leading-relaxed">
                        "{r.comment}"
                      </p>
                    </td>
                    <td className="px-6 py-5">
                      <StarRating rating={r.rating} />
                      <span className="text-[10px] text-muted-foreground font-bold mt-1 block">{r.rating}/5</span>
                    </td>
                    <td className="px-6 py-5">
                      <span className="text-xs font-medium text-muted-foreground">
                        {format(new Date(r.created_at), "dd MMM yyyy")}
                      </span>
                    </td>
                    <td className="px-6 py-5">
                      {r.is_approved ? (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary border border-[color-mix(in_srgb,var(--primary)_20%,transparent)] rounded-lg text-[9px] font-black uppercase tracking-widest">
                          <span className="w-1.5 h-1.5 bg-primary rounded-full" />
                          Approuvé
                        </span>
                      ) : (
                        <span className="inline-flex items-center gap-1.5 px-2.5 py-1 bg-muted text-muted-foreground border border-border rounded-lg text-[9px] font-black uppercase tracking-widest animate-pulse">
                          <span className="w-1.5 h-1.5 bg-muted-foreground rounded-full" />
                          En attente
                        </span>
                      )}
                    </td>
                    <td className="px-6 py-5 text-right">
                      <div className="flex items-center justify-end gap-1.5 opacity-0 group-hover:opacity-100 transition-opacity">
                        {r.is_approved ? (
                          <button
                            onClick={() => onApprove(r.id, false)}
                            disabled={isUpdating}
                            title="Masquer l'avis"
                            className="p-2 text-muted-foreground hover:text-foreground hover:bg-muted rounded-lg transition-all disabled:opacity-40"
                          >
                            <XCircle size={16} />
                          </button>
                        ) : (
                          <button
                            onClick={() => onApprove(r.id, true)}
                            disabled={isUpdating}
                            title="Approuver l'avis"
                            className="p-2 text-muted-foreground hover:text-primary hover:bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] rounded-lg transition-all disabled:opacity-40"
                          >
                            <CheckCircle size={16} />
                          </button>
                        )}
                        <button
                          onClick={() => onDelete(r.id)}
                          disabled={isUpdating}
                          title="Supprimer définitivement"
                          className="p-2 text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] rounded-lg transition-all disabled:opacity-40"
                        >
                          <Trash2 size={16} />
                        </button>
                      </div>
                    </td>
                  </tr>
                );
              })}
              {filtered.length === 0 && (
                <tr>
                  <td colSpan={6} className="px-6 py-20 text-center text-muted-foreground italic text-sm">
                    Aucun avis trouvé.
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
