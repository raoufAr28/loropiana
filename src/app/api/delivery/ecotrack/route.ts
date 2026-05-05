import { NextResponse } from 'next/server';
import { createClient } from '@supabase/supabase-js';

// ─── Global State ────────────────────────────────────────────────────────
let verifiedApiEndpoint: string | null = null;
let payloadFormat: 'json' | 'form' = 'json';

// ─── Supabase Client ─────────────────────────────────────────────────────
const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.SUPABASE_SERVICE_ROLE_KEY!
);

// ─── Configuration ───────────────────────────────────────────────────────
const TOKEN = process.env.ECOTRACK_API_TOKEN ?? '';
const TIMEOUT_MS = 15_000;

const DEFAULT_BASE_URL = 'https://api.ecotrack.dz';
const BASE_URL = process.env.ECOTRACK_BASE_URL 
  ? process.env.ECOTRACK_BASE_URL.replace(/\/+$/, '') 
  : DEFAULT_BASE_URL;

interface EcotrackPayload {
  nom_client:  string;
  telephone:   string;
  adresse:     string;
  commune:     string;
  code_wilaya: string;
  montant:     string;
  type:        '1';
  stop_desk:   '0' | '1';
}

// ─── Core HTTP Helper ────────────────────────────────────────────────────
async function fetchWithTimeout(url: string, init: RequestInit, ms: number): Promise<Response> {
  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), ms);
  try {
    return await fetch(url, { ...init, signal: controller.signal });
  } finally {
    clearTimeout(timer);
  }
}

// ─── Discovery Engine ────────────────────────────────────────────────────

/**
 * Attempts to locate and parse an OpenAPI/Swagger schema to dynamically
 * extract the exact POST orders endpoint.
 */
async function discoverFromOpenAPI(): Promise<string | null> {
  const schemaPaths = [
    '/openapi.json',
    '/swagger.json',
    '/api/docs?format=json',
    '/api/v1/docs',
    '/api/documentation',
    '/docs',
    '/swagger'
  ];

  for (const path of schemaPaths) {
    const url = `${BASE_URL}${path}`;
    console.log(`[DISCOVERY] Probing Schema Path: ${url}`);
    try {
      const res = await fetchWithTimeout(url, { method: 'GET', headers: { 'Accept': 'application/json' } }, 5000);
      
      console.log(`[DISCOVERY] ${url} -> Status: ${res.status}`);
      const contentType = res.headers.get('content-type') || '';
      
      if (res.status === 200 && contentType.includes('application/json')) {
        const text = await res.text();
        let schema: any;
        try { schema = JSON.parse(text); } catch { continue; }

        if (schema.openapi || schema.swagger) {
          console.log(`[DISCOVERY] ✅ OpenAPI Schema found at ${url}`);
          // Scan for order creation paths
          const paths = schema.paths || {};
          for (const [endpointPath, methods] of Object.entries(paths)) {
            const hasPost = (methods as any).post;
            const p = endpointPath.toLowerCase();
            if (hasPost && (p.includes('/order') || p.includes('/colis') || p.includes('/shipment'))) {
               console.log(`[DISCOVERY] Extracted Schema Endpoint: POST ${endpointPath}`);
               return `${BASE_URL}${endpointPath}`;
            }
          }
        }
      }
    } catch {
      // Ignore network errors on discovery
    }
  }

  return null;
}

/**
 * If no schema exists, infer the correct endpoint by analyzing standard REST
 * patterns and reading HTTP 405 (Method Not Allowed) or 422 (Unprocessable)
 * which proves an endpoint's explicit existence.
 */
async function discoverViaRestPatterns(): Promise<string | null> {
  const patterns = [
    '/api/v1/orders',
    '/api/v1/order',
    '/api/v1/colis',
    '/api/v1/shipments',
    '/api/v1/livraisons',
    '/api/orders',
    '/api/v1/store',
    '/api/v1/orders/store'
  ];

  for (const path of patterns) {
    const url = `${BASE_URL}${path}`;
    console.log(`[DISCOVERY] Probing REST Endpoint: OPTIONS ${url}`);
    try {
      // Use OPTIONS to avoid triggering destructive creation
      const res = await fetchWithTimeout(url, { 
        method: 'OPTIONS', 
        headers: { 
          'Authorization': `Bearer ${TOKEN}`,
          'Accept': 'application/json' 
        } 
      }, 5000);

      const status = res.status;
      const text = await res.text();
      const isHtml = text.toLowerCase().includes('<html');

      console.log(`[DISCOVERY] OPTIONS ${url} -> Status: ${status} | isHTML: ${isHtml}`);

      if (isHtml) continue;

      // If an endpoint exists but refuses OPTIONS with 405 Method Not Allowed,
      // or allows OPTIONS (200/204), it proves the route is legally registered.
      if (status === 405 || status === 200 || status === 204 || status === 422) {
         console.log(`[DISCOVERY] ✅ API Route Confirmed via Pattern Match: POST ${url}`);
         return url;
      }
    } catch {
      // Ignore network errors
    }
  }

  return null;
}

/**
 * Initializes the discovery sequence. Caches the result if successful.
 */
async function performApiDiscovery(): Promise<string> {
  if (verifiedApiEndpoint) return verifiedApiEndpoint;

  console.log(`[DISCOVERY] Initiating diagnostic discovery against Host: ${BASE_URL}`);

  // 1. Try to find Swagger / OpenAPI maps
  let endpoint = await discoverFromOpenAPI();

  // 2. Fallback to intelligent REST structure probing
  if (!endpoint) {
    endpoint = await discoverViaRestPatterns();
  }

  if (endpoint) {
    verifiedApiEndpoint = endpoint;
    return endpoint;
  }

  throw new Error("Ecotrack API is not publicly documented or is restricted. Manual Postman collection or backend access required.");
}

// ─── Main Execution ────────────────────────────────────────────────────────
export async function POST(req: Request) {
  if (!TOKEN) {
    return NextResponse.json(
      { success: false, error: 'Server error: Missing ECOTRACK_API_TOKEN.' },
      { status: 500 }
    );
  }

  let orderId: string | undefined;
  try {
    const body = await req.json();
    orderId = body.orderId;
  } catch {
    return NextResponse.json({ success: false, error: 'Invalid JSON request format.' }, { status: 400 });
  }

  if (!orderId) {
    return NextResponse.json({ success: false, error: 'Request body must contain orderId.' }, { status: 400 });
  }

  // A. Execute Safe Discovery (No Guessing Loops Here)
  let targetEndpoint: string;
  try {
    targetEndpoint = await performApiDiscovery();
  } catch (error: any) {
    console.error(`[DIAGNOSTIC] Discovery Failed: ${error.message}`);
    await supabase.from('orders').update({ delivery_status: 'failed', delivery_provider: 'ecotrack' }).eq('id', orderId);
    return NextResponse.json({ success: false, error: error.message }, { status: 502 });
  }

  console.log(`[EXECUTION] Using Verified Endpoint: ${targetEndpoint}`);

  // B. Fetch Local Database Record
  const { data: order, error: orderErr } = await supabase
    .from('orders')
    .select('*')
    .eq('id', orderId)
    .single();

  if (orderErr || !order) {
    return NextResponse.json({ success: false, error: 'Order not found in database.' }, { status: 404 });
  }

  // C. Assemble Payload
  const ship = (order.shipping_address || {}) as any;
  const deliveryData: EcotrackPayload = {
    nom_client:  `${(ship.firstName || '').trim()} ${(ship.lastName || '').trim()}`.trim() || 'N/A',
    telephone:   (ship.phone || '').replace(/\s+/g, ''),
    adresse:     (ship.address || '').trim(),
    commune:     (ship.commune || '').trim(),
    code_wilaya: String(ship.code_wilaya || '').trim(),
    montant:     String(order.total_amount || 0),
    type:        '1',
    stop_desk:   order.delivery_type === 'bureau' ? '1' : '0',
  };

  // D. Execute Payload against single Verified Route
  let res: Response;
  let rawResponse = '';
  
  try {
    const bodyFormat = payloadFormat === 'json' 
      ? JSON.stringify(deliveryData) 
      : new URLSearchParams(deliveryData as any).toString();

    const contentType = payloadFormat === 'json' 
      ? 'application/json' 
      : 'application/x-www-form-urlencoded';

    console.log(`[REQUEST] POST ${targetEndpoint}`);
    console.log(`[REQUEST] Format: ${contentType}`);

    res = await fetchWithTimeout(targetEndpoint, {
      method: 'POST',
      headers: {
        'Accept': 'application/json',
        'Authorization': `Bearer ${TOKEN}`,
        'Content-Type': contentType
      },
      body: bodyFormat
    }, TIMEOUT_MS);

    rawResponse = await res.text();
  } catch (err: any) {
    return NextResponse.json({ success: false, error: `Connection failed: ${err.message}` }, { status: 504 });
  }

  console.log(`[RESPONSE] Status: ${res.status}`);
  console.log(`[RESPONSE] Body: ${rawResponse}`);

  let parsed: any;
  try { parsed = JSON.parse(rawResponse); } 
  catch { parsed = { raw: rawResponse }; }

  // E. Handle Output and Save state
  if (res.status >= 400) {
    // If we receive a validation error indicating wrong content type, flip the format strategy for next time.
    if (res.status === 422 || (res.status === 400 && String(rawResponse).toLowerCase().includes('format'))) {
       payloadFormat = payloadFormat === 'json' ? 'form' : 'json';
       console.warn(`[EXECUTION] Payload format seems rejected. Auto-switched future requests to: ${payloadFormat}`);
    }

    await supabase.from('orders').update({ delivery_status: 'failed', delivery_provider: 'ecotrack' }).eq('id', orderId);
    
    return NextResponse.json({
      success: false,
      error: 'Ecotrack API Error',
      providerStatus: res.status,
      providerResponse: parsed,
      diagnostic_metadata: {
        verified_endpoint: targetEndpoint,
        format_used: payloadFormat
      }
    }, { status: 400 });
  }

  // Success 
  const trackingNumber = String(
    parsed?.tracking_number ||
    parsed?.tracking_code ||
    parsed?.tracking ||
    parsed?.id ||
    'SENT'
  );

  await supabase.from('orders').update({
    delivery_status: 'sent_to_delivery',
    delivery_provider: 'ecotrack',
    tracking_number: trackingNumber,
    sent_to_delivery_at: new Date().toISOString(),
  }).eq('id', orderId);

  return NextResponse.json({
    success: true,
    trackingNumber,
    diagnostic_metadata: {
      verified_endpoint: targetEndpoint,
      format_used: payloadFormat
    },
    providerResponse: parsed
  });
}
