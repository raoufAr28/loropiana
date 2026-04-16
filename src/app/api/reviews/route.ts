import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

// GET approved reviews
export async function GET() {
  try {
    const { data, error } = await supabase
      .from("reviews")
      .select(`
        *,
        products (
          id,
          name_fr,
          name_ar,
          slug,
          product_images (image_url)
        )
      `)
      .eq("status", "approved")
      .order("created_at", { ascending: false });

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}

// POST new pending review
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { full_name, email, rating, comment_fr, comment_ar, product_id, locale } = body;

    const { data, error } = await supabase
      .from("reviews")
      .insert({
        full_name,
        email,
        rating,
        comment_fr,
        comment_ar,
        product_id: product_id || null,
        status: "pending",
        is_verified: false
      })
      .select()
      .single();

    if (error) throw error;
    return NextResponse.json(data);
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
