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
}

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
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;
      setOrders(data || []);
      
      const pc = (data || []).filter(o => o.status === 'pending').length;
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
      return data;
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

  return {
    orders,
    loading,
    updating,
    updateStatus,
    fetchOrderItems,
    pendingCount,
    refresh: fetchData
  };
}
