-- Add delivery integration fields to orders table
ALTER TABLE public.orders 
ADD COLUMN IF NOT EXISTS delivery_provider TEXT DEFAULT 'ecotrack',
ADD COLUMN IF NOT EXISTS delivery_status TEXT DEFAULT 'pending',
ADD COLUMN IF NOT EXISTS tracking_number TEXT,
ADD COLUMN IF NOT EXISTS tracking_url TEXT,
ADD COLUMN IF NOT EXISTS shipment_reference TEXT,
ADD COLUMN IF NOT EXISTS sent_to_delivery_at TIMESTAMP WITH TIME ZONE;

-- Add comment for clarity
COMMENT ON COLUMN public.orders.delivery_status IS 'Fulfillment status: pending, sent_to_delivery, failed';
