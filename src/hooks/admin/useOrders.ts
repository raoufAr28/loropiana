"use client";

import { useState, useEffect, useCallback } from "react";
import { supabase } from "@/utils/supabase/client";

export type OrderStatus = 'pending' | 'confirmed' | 'cancelled';

export interface Order {
  id: string;
  status: OrderStatus;
  total_amount: number;
  created_at: string;
  guest_email?: string;
  shipping_address?: any;
  payment_method?: string;
  payment_status?: string;
  user_id?: string;
  order_items?: Array<{
    id: string;
    quantity: number;
    unit_price: number;
    products?: {
      name_fr: string;
      product_images?: Array<{ image_url: string }>;
    };
  }>;
  delivery_provider?: string;
  delivery_status?: string;
  tracking_number?: string;
  tracking_url?: string;
  shipment_reference?: string;
  sent_to_delivery_at?: string;
  tracking_id?: string;
  shipping_fee?: number;
  delivery_type?: 'domicile' | 'bureau';
}

// Safely parse any value to a finite number, fallback to 0
const sanitizeNumber = (value: unknown): number => {
  const parsed = Number(value);
  return Number.isFinite(parsed) ? parsed : 0;
};

export function useOrders(showToast: (m: string, t: 'success' | 'error') => void) {
  const [orders, setOrders] = useState<Order[]>([]);
  const [loading, setLoading] = useState(true);
  const [updating, setUpdating] = useState(false);
  const [pendingCount, setPendingCount] = useState(0);

  const fetchData = useCallback(async () => {
    setLoading(true);
    try {
      const { data, error } = await supabase
        .from('orders')
        .select('*, order_items(id, quantity, unit_price, products(*, product_images(*)))')
        .order('created_at', { ascending: false });

      if (error) throw error;
      
      // Explicitly cast numeric fields to prevent NaN in UI
      const mappedData = (data || []).map(order => {
        const total_amount = sanitizeNumber(order.total_amount);
        const shipping_fee = sanitizeNumber((order as any).shipping_fee);

        // Debug logging for invalid order totals
        if (!Number.isFinite(Number(order.total_amount))) {
          console.warn(`[useOrders] Invalid total_amount detected for Order ${order.id}:`, order.total_amount);
        }

        return {
          ...order,
          total_amount,
          shipping_fee,
          order_items: order.order_items?.map((item: any) => {
            const unit_price = sanitizeNumber(item.unit_price ?? item.price);
            const quantity = sanitizeNumber(item.quantity) || 1;

            // Debug logging for invalid item values
            if (!Number.isFinite(Number(item.unit_price)) || !Number.isFinite(Number(item.quantity))) {
              console.warn(`[useOrders] Invalid item data for Order ${order.id}, Item ${item.id}:`, {
                unit_price: item.unit_price,
                quantity: item.quantity
              });
            }

            return {
              ...item,
              unit_price,
              quantity
            };
          })
        };
      }) as Order[];

      setOrders(mappedData);
      
      const pc = mappedData.filter(o => o.status === 'pending').length;
      setPendingCount(pc);
    } catch (err: any) {
      showToast(err.message, "error");
    } finally {
      setLoading(false);
    }
  }, [showToast]);

  useEffect(() => {
    fetchData();

    // Setup Real-time listener for the orders table
    const channel = supabase
      .channel('orders_real_time')
      .on(
        'postgres_changes',
        { event: '*', schema: 'public', table: 'orders' },
        (payload) => {
          console.log('[REAL_TIME_ORDER_UPDATE]', payload);
          
          if (payload.eventType === 'INSERT') {
            showToast('New Collection Registered – Fulfillment Required', 'success');
            // Play optional notification sound logic can go here
            fetchData();
          } else {
            // Update, Delete etc.
            fetchData();
          }
        }
      )
      .subscribe();

    return () => {
      supabase.removeChannel(channel);
    };
  }, [fetchData, showToast]);

  const fetchOrderItems = async (orderId: string) => {
    try {
      const { data, error } = await supabase
        .from('order_items')
        .select('*, products(*, product_images(*))')
        .eq('order_id', orderId);

      if (error) throw error;
      return (data || []).map(item => {
        const unit_price = sanitizeNumber(item.unit_price ?? item.price);
        const quantity = sanitizeNumber(item.quantity) || 1;

        if (!Number.isFinite(Number(item.unit_price)) || !Number.isFinite(Number(item.quantity))) {
          console.warn(`[useOrders] fetchOrderItems: Invalid data for item ${item.id} in order ${orderId}:`, {
            unit_price: item.unit_price,
            quantity: item.quantity
          });
        }

        return {
          ...item,
          unit_price,
          quantity
        };
      });
    } catch (err: any) {
      showToast(err.message, "error");
      return null;
    }
  };

  const updateStatus = async (id: string, status: OrderStatus) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('orders').update({ status }).eq('id', id);
      if (error) throw error;
      
      showToast(`Order status updated to ${status.toUpperCase()}`, "success");
      await fetchData();
      return true;
    } catch (err: any) {
      showToast(err.message, "error");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  const deleteOrder = async (id: string) => {
    setUpdating(true);
    try {
      const { error } = await supabase.from('orders').delete().eq('id', id);
      if (error) throw error;
      
      showToast("Order deleted permanently", "success");
      await fetchData();
      return true;
    } catch (err: any) {
      showToast(err.message, "error");
      return false;
    } finally {
      setUpdating(false);
    }
  };

  return {
    orders,
    loading,
    updating,
    updateStatus,
    deleteOrder,
    fetchOrderItems,
    pendingCount,
    refresh: fetchData
  };
};

