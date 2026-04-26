import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

/**
 * Official Ecotrack API docs (Postman collection Tz5je15g):
 *
 * type (integer, obligatoire):
 *   1 = Livraison
 *   2 = Échange
 *   3 = PICKUP
 *   4 = Recouvrement
 *
 * stop_desk (integer, optionnel) — SEPARATE field, NOT part of type:
 *   0 = Livraison à domicile
 *   1 = STOP DESK (point relais / bureau)
 *
 * Auth: Bearer token in Authorization header
 * Body: JSON
 */
export async function POST(req: Request) {
  try {
    const { orderId } = await req.json();
    if (!orderId) {
      return NextResponse.json({ success: false, error: 'Order ID is required' }, { status: 400 });
    }

    // 1. Fetch Order
    const { data: order, error: orderError } = await supabase
      .from('orders')
      .select('*')
      .eq('id', orderId)
      .single();

    if (orderError || !order) {
      console.error('[ECOTRACK] Order fetch error:', orderError);
      return NextResponse.json({ success: false, error: 'Order not found' }, { status: 404 });
    }

    // 2. Extract shipping fields
    const shipping = order.shipping_address || {};
    const firstName = (shipping.firstName || '').trim();
    const lastName = (shipping.lastName || '').trim();
    const nom_client = `${firstName} ${lastName}`.trim();
    const telephone = (shipping.phone || '').trim();
    const commune = (shipping.commune || '').trim();
    const address = (shipping.address || '').trim();
    const code_wilaya = (shipping.code_wilaya || '').toString().trim();
    const delivery_type = order.delivery_type || 'domicile';
    const montant = Number(order.total_amount);

    // 3. Build adresse
    const adresse = delivery_type === 'bureau'
      ? `Retrait bureau - ${commune}${address ? ' - ' + address : ''}`.trim()
      : address;

    // 4. Map delivery type per official docs:
    //    type (string): "1" = Livraison
    //    stop_desk (string): "0"=domicile, "1"=STOP DESK
    const type = "1";
    const stop_desk = delivery_type === 'bureau' ? "1" : "0";

    // 5. Load credentials
    const apiToken = process.env.ECOTRACK_API_TOKEN;
    const baseUrl = process.env.ECOTRACK_BASE_URL; // https://app.ecotrack.dz/api

    if (!apiToken || !baseUrl) {
      console.error('[ECOTRACK] Missing credentials in .env.local');
      return NextResponse.json({ success: false, error: 'Integration credentials missing' }, { status: 500 });
    }

    // 6. Build URL query parameters according to official documentation
    const params = new URLSearchParams({
      api_token: apiToken,
      nom_client: nom_client,
      telephone: telephone,
      adresse: adresse,
      code_wilaya: String(code_wilaya),
      commune: commune,
      montant: String(montant),
      type: type,
      stop_desk: stop_desk,
    });

    // 7. Build final URL with parameters in the query string
    const url = `${baseUrl}/v1/orders?${params.toString()}`;

    console.log("ECOTRACK FINAL URL:", url);
    console.log("ECOTRACK PARAMS:", Object.fromEntries(params.entries()));
    console.log("ECOTRACK METHOD: POST (No body)");

    // 8. Send to Ecotrack using POST but with all parameters in the URL
    const response = await fetch(url, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
      },
      // No body sent as per documentation
    });

    const rawText = await response.text();
    console.log("ECOTRACK STATUS:", response.status);
    console.log("ECOTRACK RAW RESPONSE:", rawText);

    let result: any;
    try {
      result = JSON.parse(rawText);
    } catch {
      result = { raw: rawText };
    }

    // 9. Handle provider failure
    if (!response.ok) {
      console.error('[ECOTRACK] Provider rejected:', result);

      await supabase.from('orders').update({
        delivery_status: 'failed',
        delivery_provider: 'ecotrack',
      }).eq('id', orderId);

      const providerMessage =
        result?.message ||
        result?.error ||
        (typeof result === 'string' ? result : null);

      const errorMsg = providerMessage
        ? `Ecotrack: ${providerMessage}`
        : `Ecotrack rejected (HTTP ${response.status}). Check server logs for raw response.`;

      return NextResponse.json({
        success: false,
        error: errorMsg,
        providerResponse: result,
        statusCode: response.status,
        urlUsed: url,
        paramsSent: Object.fromEntries(params.entries()),
      }, { status: 400 });
    }

    // 10. Handle success
    const trackingNo =
      result?.tracking_number ||
      result?.tracking_code ||
      result?.tracking ||
      result?.id ||
      'SENT';

    await supabase.from('orders').update({
      delivery_provider: 'ecotrack',
      delivery_status: 'sent_to_delivery',
      tracking_number: trackingNo.toString(),
      tracking_url: result?.tracking_url || null,
      shipment_reference: result?.reference || result?.id?.toString() || null,
      sent_to_delivery_at: new Date().toISOString(),
    }).eq('id', orderId);

    console.log('[ECOTRACK] SUCCESS — orderId:', orderId, '| tracking:', trackingNo);

    return NextResponse.json({
      success: true,
      trackingNumber: trackingNo,
      urlUsed: url,
      paramsSent: Object.fromEntries(params.entries()),
      providerResponse: result,
    });

  } catch (err: any) {
    console.error('[ECOTRACK] CRITICAL ERROR:', err);
    return NextResponse.json({
      success: false,
      error: `Critical Error: ${err.message}`,
      details: err.stack
    }, { status: 500 });
  }
}
