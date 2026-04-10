"use client";

import { Check } from "lucide-react";
import { useLocale } from "next-intl";

interface TrackingTimelineProps {
  currentStatus: string;
}

const steps = [
  { id: 'pending', label: { fr: 'En attente', ar: 'قيد الانتظار' } },
  { id: 'confirmed', label: { fr: 'Confirmé', ar: 'تم التأكيد' } },
  { id: 'preparing', label: { fr: 'Préparation', ar: 'قيد التحضير' } },
  { id: 'shipped', label: { fr: 'Expédié', ar: 'تم الشحن' } },
  { id: 'delivered', label: { fr: 'Livré', ar: 'تم التسليم' } },
];

export function TrackingTimeline({ currentStatus }: TrackingTimelineProps) {
  const locale = useLocale();
  const isRTL = locale === 'ar';
  
  const currentStepIndex = steps.findIndex(step => step.id === currentStatus.toLowerCase());
  // If cancelled, show a different UI or just highlight nothing
  const isCancelled = currentStatus.toLowerCase() === 'cancelled';

  return (
    <div className="w-full py-12 px-4">
      <div className={`relative flex items-center justify-between w-full ${isRTL ? 'flex-row-reverse' : ''}`}>
        {/* Progress Line */}
        <div className="absolute left-0 right-0 top-1/2 -translate-y-1/2 h-1 bg-slate-100 z-0" />
        <div 
          className={`absolute top-1/2 -translate-y-1/2 h-1 bg-[#00487A] transition-all duration-1000 z-0 ${isRTL ? 'right-0 origin-right' : 'left-0 origin-left'}`}
          style={{ width: isCancelled ? '0%' : `${(currentStepIndex / (steps.length - 1)) * 100}%` }}
        />

        {steps.map((step, index) => {
          const isActive = index <= currentStepIndex && !isCancelled;
          const isCurrent = index === currentStepIndex && !isCancelled;

          return (
            <div key={step.id} className="relative z-10 flex flex-col items-center gap-4">
              <div 
                className={`w-10 h-10 rounded-full border-4 flex items-center justify-center transition-all duration-500 scale-100 hover:scale-110 shadow-sm
                  ${isActive ? 'bg-[#00487A] border-white text-white' : 'bg-white border-slate-100 text-slate-300'}`}
              >
                {isActive && index < currentStepIndex ? (
                  <Check size={16} strokeWidth={3} />
                ) : (
                  <div className={`w-2 h-2 rounded-full ${isActive ? 'bg-white animate-pulse' : 'bg-slate-200'}`} />
                )}
              </div>
              <div className="absolute -bottom-8 whitespace-nowrap text-center">
                <p className={`text-[10px] font-black uppercase tracking-widest transition-colors duration-500 ${isCurrent ? 'text-[#00487A]' : 'text-slate-400'}`}>
                  {locale === 'ar' ? step.label.ar : step.label.fr}
                </p>
                {isCurrent && (
                  <div className="w-1 h-1 bg-[#00487A] rounded-full mx-auto mt-1" />
                )}
              </div>
            </div>
          );
        })}
      </div>
      
      {isCancelled && (
        <div className="mt-16 text-center animate-bounce">
          <p className="text-red-600 font-black uppercase tracking-[0.2em] text-xs">
            {locale === 'fr' ? 'Commande Annulée' : 'الطلب ملغى'}
          </p>
        </div>
      )}
    </div>
  );
}
