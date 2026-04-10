"use client";

import { motion, AnimatePresence } from "framer-motion";
import { AlertCircle, X } from "lucide-react";

interface DeleteConfirmationModalProps {
  isOpen: boolean;
  onClose: () => void;
  onConfirm: () => void;
  title: string;
  message: string;
  loading?: boolean;
}

export function DeleteConfirmationModal({ 
  isOpen, 
  onClose, 
  onConfirm, 
  title, 
  message, 
  loading 
}: DeleteConfirmationModalProps) {
  return (
    <AnimatePresence>
      {isOpen && (
        <div className="fixed inset-0 z-[200] flex items-center justify-center p-4">
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="absolute inset-0 bg-[color-mix(in_srgb,var(--foreground)_60%,transparent)] backdrop-blur-sm"
            onClick={onClose}
          />
          <motion.div
            initial={{ opacity: 0, scale: 0.95, y: 10 }}
            animate={{ opacity: 1, scale: 1, y: 0 }}
            exit={{ opacity: 0, scale: 0.95, y: 10 }}
            className="relative w-full max-w-md bg-card rounded-xl shadow-sm overflow-hidden border border-border p-6"
          >
            <div className="flex items-start gap-4">
              <div className="w-10 h-10 rounded-full bg-[color-mix(in_srgb,var(--danger)_10%,transparent)] flex items-center justify-center text-danger flex-shrink-0">
                <AlertCircle size={20} />
              </div>
              <div className="flex-1">
                <h3 className="text-lg font-black text-foreground uppercase tracking-tighter">{title}</h3>
                <p className="text-sm text-muted-foreground mt-1">{message}</p>
              </div>
              <button 
                onClick={onClose}
                className="text-muted-foreground hover:text-foreground transition-colors"
              >
                <X size={20} />
              </button>
            </div>

            <div className="flex gap-3 mt-8">
              <button
                onClick={onClose}
                className="flex-1 px-4 py-2.5 rounded-lg border border-border text-sm font-bold text-foreground hover:bg-muted transition-all"
              >
                Cancel
              </button>
              <button
                onClick={onConfirm}
                disabled={loading}
                className="flex-1 px-4 py-2.5 rounded-lg bg-danger text-white text-sm font-bold hover:opacity-90 active:scale-[0.98] transition-all disabled:opacity-50 flex items-center justify-center gap-2"
              >
                {loading ? (
                  <div className="w-4 h-4 border-2 border-white/30 border-t-white animate-spin rounded-full" />
                ) : (
                  'Confirm Delete'
                )}
              </button>
            </div>
          </motion.div>
        </div>
      )}
    </AnimatePresence>
  );
}
