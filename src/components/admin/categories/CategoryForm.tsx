"use client";

import { useState, useEffect } from "react";
import { X, Image as ImageIcon, Loader2 } from "lucide-react";
import { supabase } from "@/utils/supabase/client";
import { CategoryFormData } from "@/hooks/admin/useCategories";
import { slugify } from "@/utils/slugify";

interface CategoryFormProps {
  initialData?: CategoryFormData;
  onSubmit: (data: CategoryFormData) => void;
  loading: boolean;
  locale: string;
  showToast: (m: string, t: "success" | "error") => void;
}

export function CategoryForm({
  initialData,
  onSubmit,
  loading,
  locale,
  showToast,
}: CategoryFormProps) {
  const [form, setForm] = useState<CategoryFormData>(
    initialData || {
      name_fr: "",
      name_ar: "",
      description_fr: "",
      description_ar: "",
      image_url: "",
      slug: "",
    }
  );

  const [previewUrl, setPreviewUrl] = useState<string>(
    initialData?.image_url || ""
  );

  const [isUploading, setIsUploading] = useState(false);
  const [errors, setErrors] = useState<Record<string, boolean>>({});

  useEffect(() => {
    if (initialData) {
      setForm(initialData);
      setPreviewUrl(initialData.image_url || "");
    }
  }, [initialData]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();

    const newErrors: Record<string, boolean> = {};
    if (!form.name_fr) newErrors.name_fr = true;
    if (!form.name_ar) newErrors.name_ar = true;

    if (Object.keys(newErrors).length > 0) {
      setErrors(newErrors);
      return;
    }

    setErrors({});

    const finalSlug = initialData?.slug || slugify(form.name_fr);

    onSubmit({
      ...form,
      slug: finalSlug,
    });
  };

  const handleChange = (field: keyof CategoryFormData, value: any) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (errors[field]) {
      setErrors((prev) => ({ ...prev, [field]: false }));
    }
  };

  const handleImageUpload = async (
    e: React.ChangeEvent<HTMLInputElement>
  ) => {
    const file = e.target.files?.[0];
    if (!file) return;

    console.log("File selected:", file.name);

    // preview local مباشر
    const localPreview = URL.createObjectURL(file);
    setPreviewUrl(localPreview);

    setIsUploading(true);

    try {
      const fileExt = file.name.split(".").pop();
      const safeName = file.name.replace(/\s+/g, "_");
      const fileName = `cat-${Date.now()}-${safeName}`;

      console.log("Uploading to bucket: categories", fileName);

      const { error } = await supabase.storage
        .from("categories")
        .upload(fileName, file, {
          cacheControl: "3600",
          upsert: false,
        });

      if (error) throw error;

      const {
        data: { publicUrl },
      } = supabase.storage.from("categories").getPublicUrl(fileName);

      console.log("Upload success. Public URL:", publicUrl);

      // خزّن الرابط الحقيقي للحفظ في DB
      setForm((prev) => ({
        ...prev,
        image_url: publicUrl,
      }));

      // لا تبدل preview بالرابط العمومي الآن
      // خلّي preview المحلي ظاهر
    } catch (err: any) {
      console.error("Category upload failed:", err);
      showToast(err.message || "Upload failed", "error");

      // رجوع للحالة السابقة إذا فشل الرفع
      setPreviewUrl(form.image_url || "");
    } finally {
      setIsUploading(false);
      e.target.value = "";
    }
  };

  const labelClass =
    "text-[10px] font-black text-muted-foreground uppercase tracking-widest mb-2 block ml-1";

  const inputClass = (field: string) =>
    `w-full bg-card border ${errors[field] ? "border-danger" : "border-border"
    } px-4 py-3 rounded-xl text-sm outline-none`;

  return (
    <form onSubmit={handleSubmit} className="space-y-8">
      {/* IMAGE */}
      <div className="flex gap-6 items-start">
        <div className="w-24 h-24 rounded-2xl bg-muted border flex items-center justify-center overflow-hidden relative group">
          {isUploading ? (
            <div className="absolute inset-0 bg-background/50 backdrop-blur-sm flex items-center justify-center">
              <Loader2 className="animate-spin text-primary" />
            </div>
          ) : previewUrl ? (
            <div className="relative w-full h-full">
              <img
                src={previewUrl}
                alt="Preview"
                className="w-full h-full object-cover"
              />
              <button
                type="button"
                onClick={() => {
                  setForm((prev) => ({ ...prev, image_url: "" }));
                  setPreviewUrl("");
                }}
                className="absolute inset-0 bg-red-500/80 text-white opacity-0 group-hover:opacity-100 flex items-center justify-center"
              >
                <X />
              </button>
            </div>
          ) : (
            <ImageIcon className="text-muted-foreground/40" size={28} />
          )}
        </div>

        <div className="flex-1">
          <input
            type="file"
            accept="image/*"
            onChange={handleImageUpload}
            className="hidden"
            id="category-image-upload"
            disabled={isUploading}
          />

          <label
            htmlFor="category-image-upload"
            className="cursor-pointer border-2 border-dashed px-6 py-4 rounded-xl block text-center"
          >
            {isUploading ? "Uploading..." : "Choose Collection Image"}
          </label>
        </div>
      </div>

      {/* NAME FR */}
      <div>
        <label className={labelClass}>Name FR</label>
        <input
          value={form.name_fr}
          onChange={(e) => handleChange("name_fr", e.target.value)}
          className={inputClass("name_fr")}
        />
      </div>

      {/* NAME AR */}
      <div>
        <label className={labelClass}> الاسم AR</label>
        <input
          value={form.name_ar}
          onChange={(e) => handleChange("name_ar", e.target.value)}
          className={inputClass("name_ar")}
        />
      </div>

      <button
        type="submit"
        disabled={loading || isUploading}
        className="bg-primary text-white px-6 py-3 rounded-xl"
      >
        {loading ? "Loading..." : "Save"}
      </button>
    </form>
  );
}