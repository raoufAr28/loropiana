"use client";

import { useLocale } from "next-intl";

interface StatusBadgeProps {
  status: string;
  type?: 'order' | 'payment';
}

export function StatusBadge({ status, type = 'order' }: StatusBadgeProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';

  const getStatusConfig = (status: string) => {
    const s = status.toLowerCase();
    switch (s) {
      case 'pending':
        return { 
          bg: 'bg-slate-100', 
          text: 'text-slate-600', 
          border: 'border-slate-200',
          label: { fr: 'En attente', ar: 'قيد الانتظار' }
        };
      case 'confirmed':
        return { 
          bg: 'bg-blue-50', 
          text: 'text-blue-700', 
          border: 'border-blue-200',
          label: { fr: 'Confirmé', ar: 'تم التأكيد' }
        };
      case 'preparing':
        return { 
          bg: 'bg-indigo-50', 
          text: 'text-indigo-700', 
          border: 'border-indigo-200',
          label: { fr: 'En préparation', ar: 'قيد التحضير' }
        };
      case 'shipped':
        return { 
          bg: 'bg-orange-50', 
          text: 'text-orange-700', 
          border: 'border-orange-200',
          label: { fr: 'Expédié', ar: 'تم الشحن' }
        };
      case 'delivered':
        return { 
          bg: 'bg-green-50', 
          text: 'text-green-700', 
          border: 'border-green-200',
          label: { fr: 'Livré', ar: 'تم التسليم' }
        };
      case 'cancelled':
        return { 
          bg: 'bg-red-50', 
          text: 'text-red-700', 
          border: 'border-red-200',
          label: { fr: 'Annulé', ar: 'ملغى' }
        };
      case 'paid':
        return { 
          bg: 'bg-emerald-50', 
          text: 'text-emerald-700', 
          border: 'border-emerald-200',
          label: { fr: 'Payé', ar: 'مدفوع' }
        };
      case 'failed':
        return { 
          bg: 'bg-rose-50', 
          text: 'text-rose-700', 
          border: 'border-rose-200',
          label: { fr: 'Échoué', ar: 'فاشل' }
        };
      default:
        return { 
          bg: 'bg-slate-100', 
          text: 'text-slate-600', 
          border: 'border-slate-200',
          label: { fr: status, ar: status }
        };
    }
  };

  const config = getStatusConfig(status);

  return (
    <span className={`inline-flex items-center px-2.5 py-0.5 rounded-full text-[10px] font-bold uppercase tracking-wider border ${config.bg} ${config.text} ${config.border}`}>
      {locale === 'ar' ? config.label.ar : config.label.fr}
    </span>
  );
}
