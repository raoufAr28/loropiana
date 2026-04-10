-- 1. Add user_id column to orders table (nullable for guest checkouts)
ALTER TABLE IF EXISTS orders 
ADD COLUMN IF NOT EXISTS user_id UUID REFERENCES auth.users(id);

-- 2. Enable Row-Level Security (RLS) for orders and order_items
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;
ALTER TABLE order_items ENABLE ROW LEVEL SECURITY;

-- 3. DROP old policies if they exist (clean slate)
DROP POLICY IF EXISTS "Admin can manage all orders" ON orders;
DROP POLICY IF EXISTS "Users can view their own orders" ON orders;
DROP POLICY IF EXISTS "Admin can manage all order items" ON order_items;
DROP POLICY IF EXISTS "Users can view their own order items" ON order_items;

-- 4. Create NEW Policies for orders
-- Admin Policy: Full CRUD for service role or admin profile
CREATE POLICY "Admin can manage all orders" 
ON orders 
FOR ALL 
USING (
  auth.role() = 'service_role' OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- User Policy: Users can only see orders where user_id matches
CREATE POLICY "Users can view their own orders" 
ON orders 
FOR SELECT 
USING (auth.uid() = user_id);

-- 5. Create NEW Policies for order_items
-- Admin Policy: Full CRUD
CREATE POLICY "Admin can manage all order items" 
ON order_items 
FOR ALL 
USING (
  auth.role() = 'service_role' OR 
  EXISTS (SELECT 1 FROM profiles WHERE profiles.id = auth.uid() AND profiles.role = 'admin')
);

-- User Policy: Users can only see items belonging to their orders
CREATE POLICY "Users can view their own order items" 
ON order_items 
FOR SELECT 
USING (
  EXISTS (
    SELECT 1 FROM orders 
    WHERE orders.id = order_items.order_id 
    AND orders.user_id = auth.uid()
  )
);
