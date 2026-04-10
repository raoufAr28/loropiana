"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface SaaSModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  subtitle?: string;
  children: ReactNode;
  width?: string;
}

export function SaaSModal({ 
  isOpen, 
  onClose, 
  title, 
  subtitle, 
  children, 
  width = "max-w-2xl" 
}: SaaSModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[150] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_60%,transparent)] backdrop-blur-sm" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.95, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.95, y: 20 }}
            className={`relative w-full ${width} bg-card rounded-xl shadow-sm overflow-hidden border border-border`}
          >
            <header className="px-8 py-6 flex justify-between items-start bg-card border-b border-border">
               <div>
                  <h3 className="text-xl font-black text-foreground uppercase tracking-tighter leading-none">{title}</h3>
                  {subtitle && <p className="text-xs font-bold text-muted-foreground mt-2 uppercase tracking-widest">{subtitle}</p>}
               </div>
               <button 
                 onClick={onClose} 
                 className="p-2 rounded-lg text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] transition-all shadow-sm border border-transparent hover:border-danger"
               >
                  <X size={20} />
               </button>
            </header>
            <div className="p-8 overflow-y-auto max-h-[80vh] custom-scrollbar bg-card">
               {children}
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
