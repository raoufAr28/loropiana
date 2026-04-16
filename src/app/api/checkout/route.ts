import { NextResponse } from 'next/server';
export const dynamic = 'force-dynamic';
import { createClient } from '@supabase/supabase-js';

// Use service role to bypass RLS when creating the order initially from server
const supabase = (process.env.NEXT_PUBLIC_SUPABASE_URL && process.env.SUPABASE_SERVICE_ROLE_KEY)
  ? createClient(process.env.NEXT_PUBLIC_SUPABASE_URL, process.env.SUPABASE_SERVICE_ROLE_KEY)
  : null;

async function sendTelegramNotification(order: any, baseUrl: string) {
  const botToken = process.env.TELEGRAM_BOT_TOKEN;
  const chatId = process.env.TELEGRAM_ADMIN_CHAT_ID;
  
  if (!botToken || !chatId) {
    console.warn('[TELEGRAM] Credentials missing (TELEGRAM_BOT_TOKEN or TELEGRAM_ADMIN_CHAT_ID), skipping notification.');
    return;
  }

  const shipping = order.shipping_address || {};
  const totalQuantity = order.items_count || "N/A";

  const message = `
🛎️ <b>Nouvelle Commande Loro Piana</b>

👤 <b>Client :</b> ${shipping.firstName} ${shipping.lastName}
📞 <b>Téléphone :</b> ${shipping.phone || 'N/A'}
📍 <b>Wilaya :</b> ${shipping.wilaya || 'N/A'}
🏙️ <b>Commune :</b> ${shipping.commune || 'N/A'}
🏠 <b>Adresse :</b> ${shipping.address || 'N/A'}

📦 <b>Type Livraison :</b> ${order.delivery_type === 'domicile' ? 'À Domicile' : 'Bureau / Point Relais'}
💰 <b>Frais Livraison :</b> ${order.shipping_fee} DZD
💵 <b>Montant Total :</b> <b>${order.total_amount} DZD</b>
🔢 <b>Quantité Totale :</b> ${totalQuantity}

🔗 <a href="${baseUrl}/fr/admin">Accéder au Dashboard Admin</a>
  `.trim();

  try {
    const response = await fetch(`https://api.telegram.org/bot${botToken}/sendMessage`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({
        chat_id: chatId,
        text: message,
        parse_mode: 'HTML',
      }),
    });

    if (!response.ok) {
      const errorText = await response.text();
      console.error('[TELEGRAM_ERROR] Failed to send message:', response.status, errorText);
    } else {
      console.log('[TELEGRAM_SUCCESS] Notification sent for order ->', order.id);
    }
  } catch (err: any) {
    console.error('[TELEGRAM_CRITICAL_ERROR] Exception caught while sending notification:', err.message);
  }
}

export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { items, email, shipping_address, total_amount, delivery_type, shipping_fee } = body;

    console.log('[CHECKOUT_PAYLOAD_RECEIVED]', {
      email,
      itemCount: items?.length,
      total_amount,
      shipping: shipping_address?.city
    });

    if (!items || items.length === 0) {
      return NextResponse.json({ error: "Cart is empty" }, { status: 400 });
    }

    if (!email || !shipping_address) {
      return NextResponse.json({ error: "Missing required checkout information" }, { status: 400 });
    }

    if (!supabase) {
       console.error('[CHECKOUT_ERROR] Supabase client configuration missing');
       return NextResponse.json({ error: "Server configuration error" }, { status: 500 });
    }

    // 1. Create the order in Supabase with Cash on Delivery status
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .insert({
        guest_email: email,
        user_id: body.user_id || null, 
        total_amount: total_amount,
        shipping_address: shipping_address,
        payment_method: 'cash_on_delivery',
        payment_status: 'pending',
        status: 'pending',
        delivery_type: delivery_type || 'domicile',
        shipping_fee: shipping_fee || 0
      })
      .select()
      .single();

    if (orderError) {
      console.error('[SUPABASE_ORDER_INSERT_ERROR]', orderError);
      return NextResponse.json({ 
        error: "Database error during order creation", 
        details: orderError.message 
      }, { status: 500 });
    }

    console.log('[ORDER_CREATED_SUCCESSFULLY]', { orderId: order.id });

    // 2. Insert order items
    const orderItemsToInsert = items.map((item: any) => ({
      order_id: order.id,
      product_id: item.id,
      quantity: item.quantity,
      unit_price: item.price,
    }));

    const { error: itemsError } = await supabase
      .from('order_items')
      .insert(orderItemsToInsert);

    if (itemsError) {
      console.error('[SUPABASE_ORDER_ITEMS_INSERT_ERROR]', itemsError);
      // Even if items fail, the order is created, so we log it heavily.
      return NextResponse.json({ 
        error: "Database error during items insertion", 
        details: itemsError.message,
        orderId: order.id 
      }, { status: 500 });
    }

    console.log('[ALL_ORDER_ITEMS_INSERTED]', { orderId: order.id, itemCount: items.length });

    // 3. Dispatch Telegram Notification (Does not block checkout success)
    let baseUrl = 'http://localhost:3000';
    try {
      baseUrl = new URL(req.url).origin;
    } catch(e) {}
    
    // Add item count for notification
    const totalQty = items.reduce((acc: number, item: any) => acc + (item.quantity || 1), 0);
    const orderWithDetails = { 
      ...order, 
      items_count: totalQty,
      delivery_type: delivery_type,
      shipping_fee: shipping_fee
    };

    await sendTelegramNotification(orderWithDetails, baseUrl);

    return NextResponse.json({ 
      success: true, 
      orderId: order.id 
    });

  } catch (error: any) {
    console.error('[CHECKOUT_CATCH_BLOCK_ERROR]', error);
    return NextResponse.json({ 
      error: "Critical Internal Server Error", 
      message: error.message 
    }, { status: 500 });
  }
}
