"use client";

interface StatusBadgeProps {
  status: string;
}

export function StatusBadge({ status }: StatusBadgeProps) {
  const getTheme = (s: string) => {
    const low = s.toLowerCase();
    switch (low) {
      case 'pending': 
        return "bg-muted text-muted-foreground border-border";
      case 'confirmed': 
        return "bg-[color-mix(in_srgb,var(--primary)_10%,transparent)] text-primary border-[color-mix(in_srgb,var(--primary)_20%,transparent)]";
      case 'cancelled': 
        return "bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger border-[color-mix(in_srgb,var(--danger)_20%,transparent)]";
      case 'low_stock':
        return "bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] text-danger border-[color-mix(in_srgb,var(--danger)_20%,transparent)] animate-pulse";
      default: 
        return "bg-muted text-muted-foreground border-border";
    }
  };

  const getLabel = (s: string) => {
    switch (s.toLowerCase()) {
      case 'pending': return 'En attente';
      case 'confirmed': return 'Confirmé';
      case 'cancelled': return 'Annulé';
      case 'low_stock': return 'Stock Faible';
      default: return s;
    }
  };

  return (
    <span className={`px-3 py-1 rounded-lg text-[9px] font-black uppercase tracking-widest border ${getTheme(status)} font-inter inline-flex items-center gap-1.5 whitespace-nowrap`}>
      <span className={`w-1 h-1 rounded-full ${getTheme(status).split(' ')[1].replace('text-', 'bg-')}`} />
      {getLabel(status)}
    </span>
  );
}
