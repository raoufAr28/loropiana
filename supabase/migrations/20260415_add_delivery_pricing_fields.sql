-- Add missing delivery pricing and type fields
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_type TEXT,
ADD COLUMN IF NOT EXISTS shipping_fee NUMERIC;

-- Ensure previous tracking/provider fields exist explicitly
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_provider TEXT DEFAULT 'ecotrack',
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS shipment_reference TEXT,
ADD COLUMN IF NOT EXISTS sent_to_delivery_at TIMESTAMP WITH TIME ZONE;

-- Add tracking_id alias column if specifically requested
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS tracking_id TEXT;

-- Reload schema caches safely
NOTIFY pgrst, 'reload schema';
