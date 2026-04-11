"use client";

import { useState } from "react";
import { Plus, ListTree } from "lucide-react";
import { useCategories, Category } from "@/hooks/admin/useCategories";
import { CategoryTable } from "./categories/CategoryTable";
import { CategoryForm } from "./categories/CategoryForm";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { SaaSModal } from "./SaaSModal";

interface CategoriesModuleProps {
  showToast: (m: string, t: 'success' | 'error') => void;
  locale: string;
}

export function CategoriesModule({ showToast, locale }: CategoriesModuleProps) {
  const { 
    categories, 
    loading, 
    submitting, 
    saveCategory, 
    deleteCategory 
  } = useCategories(showToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Category | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string }>({ open: false, id: "" });

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (c: Category) => {
    setEditing(c);
    setModalOpen(true);
  };

  const handleFormSubmit = async (data: any) => {
    const success = await saveCategory(data, editing?.id);
    if (success) {
      setModalOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const success = await deleteCategory(deleteModal.id);
    if (success) {
      setDeleteModal({ open: false, id: "" });
    }
  };

  if (loading) {
     return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-card rounded-xl border border-border">
           <div className="w-10 h-10 border-4 border-muted border-t-primary animate-spin rounded-full" />
           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Mapping Collections...</p>
        </div>
     );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="bg-card p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-foreground border border-border shadow-inner">
              <ListTree size={24} />
           </div>
           <div>
              <h3 className="font-black text-2xl text-foreground uppercase tracking-tighter">Categories Registry</h3>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Structure • {categories.length} Collections</p>
           </div>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm"
        >
          <Plus size={16} />
          {locale === 'fr' ? 'New Category' : 'صنف جديد'}
        </button>
      </header>

      {/* Main Table Content */}
      <CategoryTable 
        categories={categories}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        locale={locale}
      />

      {/* Category Modal */}
      <SaaSModal
        isOpen={modalOpen}
        onClose={() => setModalOpen(false)}
        title={editing ? "Update Category Archive" : "Register New Collection"}
        subtitle={editing ? `Editing ID: ${editing.id}` : "Collection Registry Entry"}
        width="max-w-4xl"
      >
        <CategoryForm 
          initialData={editing || undefined}
          onSubmit={handleFormSubmit}
          loading={submitting}
          locale={locale}
          showToast={showToast}
        />
      </SaaSModal>

      {/* Delete Confirmation */}
      <DeleteConfirmationModal 
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: "" })}
        onConfirm={handleConfirmDelete}
        title="Retire Collection"
        message="Are you sure you want to retire this category? This will not delete the products inside, but they will become uncategorized in the registry."
        loading={submitting}
      />
    </div>
  );
}
