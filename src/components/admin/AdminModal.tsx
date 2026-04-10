"use client";

import { motion, AnimatePresence } from "framer-motion";
import { X } from "lucide-react";
import { ReactNode } from "react";

interface AdminModalProps {
  isOpen: boolean;
  onClose: () => void;
  title: string;
  children: ReactNode;
  width?: string;
}

export function AdminModal({ isOpen, onClose, title, children, width = "max-w-2xl" }: AdminModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[100] flex items-center justify-center p-4">
          <motion.div 
            initial={{ opacity: 0 }} 
            animate={{ opacity: 1 }} 
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_60%,transparent)] backdrop-blur-md" 
            onClick={onClose} 
          />
          <motion.div 
            initial={{ opacity: 0, scale: 0.9, y: 20 }} 
            animate={{ opacity: 1, scale: 1, y: 0 }} 
            exit={{ opacity: 0, scale: 0.9, y: 20 }}
            className={`relative w-full ${width} bg-card rounded-[3rem] shadow-sm overflow-hidden border border-border p-2`}
          >
             <div className="bg-muted rounded-[2.5rem] overflow-hidden">
                <header className="px-10 py-8 flex justify-between items-center bg-card border-b border-border">
                   <div>
                      <p className="text-[10px] font-black text-muted-foreground uppercase tracking-[0.3em] mb-1 leading-none">Console Executive</p>
                      <h3 className="font-playfair text-2xl font-black text-foreground uppercase tracking-widest">{title}</h3>
                   </div>
                   <button 
                     onClick={onClose} 
                     className="w-10 h-10 rounded-2xl bg-muted text-muted-foreground hover:text-danger hover:bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] transition-all flex items-center justify-center shadow-sm"
                   >
                      <X size={20} />
                   </button>
                </header>
                <div className="p-10 overflow-y-auto max-h-[80vh] custom-scrollbar">
                   {children}
                </div>
             </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
