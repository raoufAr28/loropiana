-- Add delivery_type and shipping_fee to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_type TEXT DEFAULT 'domicile',
ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC(10,2) DEFAULT 0;

-- Optional: Add a comment explaining the values
COMMENT ON COLUMN public.orders.delivery_type IS 'Type of delivery: domicile or bureau';
COMMENT ON COLUMN public.orders.shipping_fee IS 'Shipping fee calculated at checkout';
