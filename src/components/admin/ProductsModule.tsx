"use client";

import { useState } from "react";
import { Plus, Package } from "lucide-react";
import { useProducts, Product } from "@/hooks/admin/useProducts";
import { ProductTable } from "./products/ProductTable";
import { ProductForm } from "./products/ProductForm";
import { DeleteConfirmationModal } from "./DeleteConfirmationModal";
import { SaaSModal } from "./SaaSModal";

interface ProductsModuleProps {
  showToast: (m: string, t: 'success' | 'error') => void;
  locale: string;
}

export function ProductsModule({ showToast, locale }: ProductsModuleProps) {
  const { 
    products, 
    categories, 
    loading, 
    submitting, 
    saveProduct, 
    deleteProduct 
  } = useProducts(showToast);

  const [modalOpen, setModalOpen] = useState(false);
  const [editing, setEditing] = useState<Product | null>(null);
  const [deleteModal, setDeleteModal] = useState<{ open: boolean, id: string }>({ open: false, id: "" });

  const handleOpenCreate = () => {
    setEditing(null);
    setModalOpen(true);
  };

  const handleOpenEdit = (p: Product) => {
    setEditing(p);
    setModalOpen(true);
  };

  const handleCloseModal = () => {
    setModalOpen(false);
  };

  const handleFormSubmit = async (data: any) => {
    const success = await saveProduct(data, editing?.id);
    if (success) {
      setModalOpen(false);
    }
  };

  const handleDeleteClick = (id: string) => {
    setDeleteModal({ open: true, id });
  };

  const handleConfirmDelete = async () => {
    const success = await deleteProduct(deleteModal.id);
    if (success) {
      setDeleteModal({ open: false, id: "" });
    }
  };

  if (loading) {
     return (
        <div className="min-h-[400px] flex flex-col items-center justify-center gap-4 bg-card rounded-xl border border-border">
           <div className="w-10 h-10 border-4 border-muted border-t-primary animate-spin rounded-full" />
           <p className="text-[10px] font-black uppercase text-muted-foreground tracking-widest">Organizing Collection...</p>
        </div>
     );
  }

  return (
    <div className="space-y-6">
      {/* Header Section */}
      <header className="bg-card p-8 rounded-xl border border-border shadow-sm flex flex-col md:flex-row justify-between items-start md:items-center gap-6">
        <div className="flex items-center gap-4">
           <div className="w-12 h-12 bg-muted rounded-lg flex items-center justify-center text-foreground border border-border shadow-inner">
              <Package size={24} />
           </div>
           <div>
              <h3 className="font-black text-2xl text-foreground uppercase tracking-tighter">Products Catalog</h3>
              <p className="text-xs font-bold text-muted-foreground mt-1 uppercase tracking-widest">Inventory Management • {products.length} References</p>
           </div>
        </div>
        
        <button 
          onClick={handleOpenCreate}
          className="bg-primary text-white px-8 py-3.5 rounded-xl text-[10px] font-black uppercase tracking-widest flex items-center gap-3 hover:opacity-90 active:scale-[0.98] transition-all shadow-sm text-center"
        >
          <Plus size={16} />
          {locale === 'fr' ? 'New Product' : 'منتج جديد'}
        </button>
      </header>

      {/* Main Table Content */}
      <ProductTable
        products={products}
        onEdit={handleOpenEdit}
        onDelete={handleDeleteClick}
        locale={locale}
      />

      {/* Product Form Modal */}
      <SaaSModal
        isOpen={modalOpen}
        onClose={handleCloseModal}
        title={editing ? "Update Product Reference" : "Register New Product"}
        subtitle={editing ? `Editing ID: ${editing.id}` : "Collection Registry Entry"}
        width="max-w-4xl"
      >
        <ProductForm
          categories={categories}
          initialData={editing ? {
            ...editing,
            image_url: editing.product_images?.[0]?.image_url || ""
          } : undefined}
          onSubmit={handleFormSubmit}
          loading={submitting}
          locale={locale}
        />
      </SaaSModal>

      {/* Delete Confirmation */}
      <DeleteConfirmationModal
        isOpen={deleteModal.open}
        onClose={() => setDeleteModal({ open: false, id: "" })}
        onConfirm={handleConfirmDelete}
        title="Archive Reference"
        message="Are you sure you want to retire this product from the inventory? This action is permanent and will remove it from the digital catalog."
        loading={submitting}
      />
    </div>
  );
}
