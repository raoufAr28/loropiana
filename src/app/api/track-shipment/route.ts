import { NextResponse } from 'next/server';

export async function GET(req: Request) {
  try {
    const { searchParams } = new URL(req.url);
    const trackingId = searchParams.get('tracking_id');

    if (!trackingId) {
      return NextResponse.json({ success: false, error: "Tracking ID is required" }, { status: 400 });
    }

    const token = process.env.ECOTRACK_API_TOKEN;
    if (!token) {
      return NextResponse.json({ success: false, error: "ECOTRACK_API_TOKEN missing" }, { status: 500 });
    }

    // Typical Ecotrack GET tracking endpoint
    const response = await fetch(`https://app.ecotrack.dz/api/v1/orders/${trackingId}/tracking`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Content-Type': 'application/json'
      }
    });

    const result = await response.json();

    if (!response.ok) {
      console.error('[TRACKING_API_FAILURE]', result);
      return NextResponse.json({ success: false, error: "Provider API failed", details: result }, { status: 400 });
    }

    // Map provider status to a clean response
    return NextResponse.json({ 
      success: true, 
      status: result.status_name || result.status || 'In Transit',
      last_update: result.last_update || new Date().toISOString(),
      details: result
    });

  } catch (err: any) {
    console.error('[TRACK_SHIPMENT_CRITICAL_ERROR]', err);
    return NextResponse.json({ success: false, error: err.message }, { status: 500 });
  }
}
