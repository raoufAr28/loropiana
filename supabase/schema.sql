-- Enable the pg_trgm extension for search capabilities
CREATE EXTENSION IF NOT EXISTS pg_trgm;

-- PROFILES
CREATE TABLE IF NOT EXISTS public.profiles (
  id uuid REFERENCES auth.users ON DELETE CASCADE NOT NULL PRIMARY KEY,
  email text UNIQUE NOT NULL,
  first_name text,
  last_name text,
  role text DEFAULT 'user' CHECK (role IN ('user', 'admin')),
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- CATEGORIES
CREATE TABLE IF NOT EXISTS public.categories (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  description_fr text,
  description_ar text,
  image_url text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCTS
CREATE TABLE IF NOT EXISTS public.products (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  category_id uuid REFERENCES public.categories(id) ON DELETE SET NULL,
  slug text UNIQUE NOT NULL,
  name_en text NOT NULL,
  name_fr text NOT NULL,
  name_ar text NOT NULL,
  description_fr text,
  description_ar text,
  price numeric(10,2) NOT NULL,
  stock_quantity integer DEFAULT 0,
  is_featured boolean DEFAULT false,
  is_new_arrival boolean DEFAULT true,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  updated_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- PRODUCT IMAGES
CREATE TABLE IF NOT EXISTS public.product_images (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  image_url text NOT NULL,
  alt_text text,
  is_primary boolean DEFAULT false,
  display_order integer DEFAULT 0,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDERS
CREATE TABLE IF NOT EXISTS public.orders (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE SET NULL,
  guest_email text,
  total_amount numeric(10,2) NOT NULL,
  status text DEFAULT 'pending' CHECK (status IN ('pending', 'confirmed', 'preparing', 'shipped', 'delivered', 'cancelled')),
  payment_status text DEFAULT 'unpaid' CHECK (payment_status IN ('unpaid', 'paid', 'failed')),
  stripe_session_id text,
  shipping_address jsonb NOT NULL,
  payment_method text,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- ORDER ITEMS
CREATE TABLE IF NOT EXISTS public.order_items (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  order_id uuid REFERENCES public.orders(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE SET NULL,
  quantity integer NOT NULL CHECK (quantity > 0),
  unit_price numeric(10,2) NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL
);

-- WISHLISTS
CREATE TABLE IF NOT EXISTS public.wishlists (
  id uuid DEFAULT gen_random_uuid() PRIMARY KEY,
  user_id uuid REFERENCES public.profiles(id) ON DELETE CASCADE NOT NULL,
  product_id uuid REFERENCES public.products(id) ON DELETE CASCADE NOT NULL,
  created_at timestamp with time zone DEFAULT timezone('utc'::text, now()) NOT NULL,
  UNIQUE(user_id, product_id)
);

-- Set up Row Level Security (RLS)
ALTER TABLE public.profiles ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.products ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.product_images ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.order_items ENABLE ROW LEVEL SECURITY;
ALTER TABLE public.wishlists ENABLE ROW LEVEL SECURITY;

-- Basic Policies (Adjust for Production)
CREATE POLICY "Public profiles are viewable by everyone." ON public.profiles FOR SELECT USING (true);
CREATE POLICY "Users can insert their own profile." ON public.profiles FOR INSERT WITH CHECK (auth.uid() = id);
CREATE POLICY "Users can update own profile." ON public.profiles FOR UPDATE USING (auth.uid() = id);

CREATE POLICY "Categories are viewable by everyone." ON public.categories FOR SELECT USING (true);
CREATE POLICY "Products are viewable by everyone." ON public.products FOR SELECT USING (true);
CREATE POLICY "Product images are viewable by everyone." ON public.product_images FOR SELECT USING (true);

-- Orders Policies
CREATE POLICY "Users can view their own orders." ON public.orders FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can insert their own orders." ON public.orders FOR INSERT WITH CHECK (auth.uid() = user_id OR user_id IS NULL);

-- Order Items Policies
CREATE POLICY "Users can view their own order items." ON public.order_items FOR SELECT USING (EXISTS (SELECT 1 FROM public.orders WHERE id = public.order_items.order_id AND user_id = auth.uid()));
CREATE POLICY "Users can insert their own order items." ON public.order_items FOR INSERT WITH CHECK (true); -- Application logic should enforce this

-- Wishlists Policies
CREATE POLICY "Users can view their own wishlists." ON public.wishlists FOR SELECT USING (auth.uid() = user_id);
CREATE POLICY "Users can add to their own wishlists." ON public.wishlists FOR INSERT WITH CHECK (auth.uid() = user_id);
CREATE POLICY "Users can delete from their own wishlists." ON public.wishlists FOR DELETE USING (auth.uid() = user_id);
