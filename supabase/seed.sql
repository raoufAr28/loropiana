-- Insert Categories if they don't exist
INSERT INTO public.categories (slug, name_en, name_fr, name_ar, description_fr, description_ar, image_url) VALUES 
('shoes', 'Shoes', 'Chaussures', 'أحذية', 'Découvrez notre collection de chaussures élégantes et confortables.', 'اكتشف مجموعتنا من الأحذية الأنيقة والمريحة.', 'https://images.unsplash.com/photo-1543163521-1bf539c55dd2?q=80&w=1000&auto=format&fit=crop'),
('bags', 'Bags', 'Sacs', 'حقائب', 'Sacs à main luxueux en cuir véritable.', 'حقائب يد فاخرة من الجلد الطبيعي.', 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop'),
('accessories', 'Accessories', 'Accessoires', 'إكسسوارات', 'Accessoires raffinés pour compléter votre look.', 'إكسسوارات راقية لإكمال إطلالتك.', 'https://images.unsplash.com/photo-1601121141461-9d6647bca1ed?q=80&w=1000&auto=format&fit=crop'),
('perfumes', 'Perfumes', 'Parfums', 'عطور', 'Fragrances intenses et envoûtantes.', 'عطور مكثفة وآسرة.', 'https://images.unsplash.com/photo-1594034184171-18b5cb66e1ae?q=80&w=1000&auto=format&fit=crop'),
('makeup', 'Makeup', 'Maquillage', 'مكياج', 'Produits de beauté pour souligner votre éclat naturel.', 'منتجات تجميل لإبراز إشراقتك الطبيعية.', 'https://images.unsplash.com/photo-1522337360788-8b13fee7a3ce?q=80&w=1000&auto=format&fit=crop'),
('watches', 'Watches', 'Montres', 'ساعات', 'L''horlogerie de précision à votre poignet.', 'صناعة الساعات الدقيقة على معصمك.', 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop'),
('glasses', 'Glasses', 'Lunettes', 'نظارات', 'Protégez vos yeux avec style.', 'احمِ عينيك بأناقة.', 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop')
ON CONFLICT (slug) DO NOTHING;

-- INSERT PRODUCTS CATEGORY BY CATEGORY
-- 1. SHOES
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'classic-leather-loafers', 'Classic Leather Loafers', 'Mocassins Classiques en Cuir', 'حذاء لوفر جلد كلاسيكي', 'Fabriqués en Italie avec le cuir le plus fin.', 'تمت صناعتها في إيطاليا باستخدام أجود أنواع الجلود.', 850.00, 50, true, true 
FROM public.categories WHERE slug = 'shoes' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'suede-summer-walk', 'Suede Summer Walk Mules', 'Mules d''été en Daim', 'حذاء صيفي من الجلد المدبوغ', 'Parfait pour les balades estivales. Finition daim.', 'مثالي للنزهات الصيفية. تشطيب من الجلد المدبوغ.', 690.00, 30, true, false
FROM public.categories WHERE slug = 'shoes' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'cashmere-lined-boots', 'Cashmere Lined Boots', 'Bottes Doublées Cachemire', 'أحذية شتوية مبطنة بالكشمير', 'Affrontez le froid avec une élégance absolue.', 'واجه البرد بأناقة مطلقة.', 1250.00, 20, false, true
FROM public.categories WHERE slug = 'shoes' ON CONFLICT (slug) DO NOTHING;

-- 2. BAGS
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'extra-pocket-l19', 'Extra Pocket L19 Bag', 'Sac Extra Pocket L19', 'حقيبة إكسترا بوكيت إل 19', 'Compact et élégant pour le quotidien.', 'مدمج وأنيق للاستخدام اليومي.', 1750.00, 15, true, true
FROM public.categories WHERE slug = 'bags' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'tote-sesia-calfskin', 'Tote Sesia Calfskin', 'Cabas Sesia Cuir', 'حقيبة توت سيسيا من الجلد', 'Spacieux et sophistiqué pour la femme moderne.', 'واسعة وراقية للمرأة العصرية.', 2900.00, 10, false, false
FROM public.categories WHERE slug = 'bags' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'micro-bale-bag', 'Micro Bale Bag', 'Micro Sac Bale', 'حقيبة مايكرو بيل', 'Un bijou miniature pour vos soirées mondaines.', 'جوهرة مصغرة لأمسياتك الاجتماعية.', 1200.00, 25, true, true
FROM public.categories WHERE slug = 'bags' ON CONFLICT (slug) DO NOTHING;

-- 3. ACCESSORIES
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'cashmere-scarf', 'Cashmere Scarf', 'Écharpe en Cachemire', 'وشاح من الكشمير', 'Doux, chaud et infiniment élégant.', 'ناعم ودافئ وأنيق بلا حدود.', 450.00, 100, false, false
FROM public.categories WHERE slug = 'accessories' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'gold-buckle-belt', 'Leather Belt with Gold Buckle', 'Ceinture Cuir Boucle Or', 'حزام جلدي بمشبك ذهبي', 'Une finition parfaite pour vos pantalons de tailleur.', 'لمسة نهائية مثالية لسراويل البدلة.', 600.00, 45, true, false
FROM public.categories WHERE slug = 'accessories' ON CONFLICT (slug) DO NOTHING;

-- 4. PERFUMES
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'signature-oud', 'Signature Oud Eau de Parfum', 'Eau de Parfum Signature Oud', 'عطر سيجنتشر عود', 'Des notes boisées profondes et intenses.', 'نفحات خشبية عميقة ومكثفة.', 320.00, 45, true, false
FROM public.categories WHERE slug = 'perfumes' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'rose-essence', 'Rose Essence Parfum', 'Eau de Parfum Rose Essence', 'عطر خلاصة الورد', 'Frais, floral et délicatement sucré.', 'منعش ومزهّر وحلو بدقة.', 280.00, 60, false, true
FROM public.categories WHERE slug = 'perfumes' ON CONFLICT (slug) DO NOTHING;

-- 5. MAKEUP
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'velvet-lipstick-rouge', 'Velvet Lipstick Rouge', 'Lèvres Velours Rouge Intemporel', 'أحمر شفاه مخملي', 'Couleur intense et hydratation pour des lèvres parfaites.', 'لون كثيف وترطيب لشفاه مثالية.', 65.00, 150, true, true
FROM public.categories WHERE slug = 'makeup' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'luminous-foundation', 'Luminous Silk Foundation', 'Fond de Teint Soie Lumineuse', 'كريم أساس حريري مضيء', 'Un teint radieux et naturel toute la journée.', 'بشرة مشرقة وطبيعية طوال اليوم.', 90.00, 110, false, false
FROM public.categories WHERE slug = 'makeup' ON CONFLICT (slug) DO NOTHING;

-- 6. WATCHES
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'perpetual-harmony', 'Perpetual Harmony Watch', 'Montre Harmonie Perpétuelle', 'ساعة التناغم الدائم', 'Mouvement automatique suisse, boîtier en or 18k.', 'حركة أوتوماتيكية سويسرية، علبة من الذهب عيار 18.', 8500.00, 5, true, false
FROM public.categories WHERE slug = 'watches' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'chronograph-elegance', 'Chronograph Elegance', 'Chronographe Élégance', 'كرونوغراف الأناقة', 'Design sportif chic pour l''homme d''affaires.', 'تصميم رياضي أنيق لرجل الأعمال.', 6200.00, 8, false, true
FROM public.categories WHERE slug = 'watches' ON CONFLICT (slug) DO NOTHING;

-- 7. GLASSES
INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'classic-aviator', 'Classic Aviator Sunglasses', 'Lunettes de Soleil Aviateur', 'نظارات شمسية طيار كلاسيكية', 'La silhouette iconique réinventée avec une monture en titane.', 'تم إعادة ابتكار الصورة الظلية الأيقونية بإطار من التيتانيوم.', 420.00, 40, true, true
FROM public.categories WHERE slug = 'glasses' ON CONFLICT (slug) DO NOTHING;

INSERT INTO public.products (category_id, slug, name_en, name_fr, name_ar, description_fr, description_ar, price, stock_quantity, is_featured, is_new_arrival)
SELECT id, 'tortoiseshell-square', 'Tortoiseshell Square Frames', 'Montures Carrées Écaille', 'إطارات مربعة صدفة السلحفاة', 'Style vintage et verres anti-reflets premium.', 'نمط عتيق وعدسات ممتازة مضادة للانعكاس.', 380.00, 35, false, false
FROM public.categories WHERE slug = 'glasses' ON CONFLICT (slug) DO NOTHING;


-- INSERT PRODUCT IMAGES (All URLs point to generic high-end aesthetic images from unsplash)
-- (We use DO NOTHING or just rely on the fact this script is manually run once. To handle duplicates we'd need a constraint on URL, but we'll just insert.)
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1614252235316-8c857d38b5f4?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'classic-leather-loafers' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1595341888016-a392ef81b7de?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'suede-summer-walk' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1584916201218-f4242ceb4809?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'extra-pocket-l19' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1520903920243-00d872a2d1c9?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'cashmere-scarf' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1594034184171-18b5cb66e1ae?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'signature-oud' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1627384113743-6bd5a479fffd?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'gold-buckle-belt' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1586495777744-4413f21062fa?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'velvet-lipstick-rouge' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1524592094714-0f0654e20314?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'perpetual-harmony' ON CONFLICT DO NOTHING;

INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT id, 'https://images.unsplash.com/photo-1511499767150-a48a237f0083?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products WHERE slug = 'classic-aviator' ON CONFLICT DO NOTHING;

-- Any product without an explicit image fallback to a neutral luxury placeholder image:
INSERT INTO public.product_images (product_id, image_url, is_primary)
SELECT p.id, 'https://images.unsplash.com/photo-1490481651871-ab68de25d43d?q=80&w=1000&auto=format&fit=crop', true 
FROM public.products p
LEFT JOIN public.product_images pi ON p.id = pi.product_id
WHERE pi.id IS NULL ON CONFLICT DO NOTHING;
