import { NextResponse } from "next/server";
import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.NEXT_PUBLIC_SUPABASE_URL!,
  process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!
);

export async function POST(
  req: Request,
  { params }: { params: { id: string } }
) {
  try {
    const { id } = params;

    // Use RPC or a safe update
    const { data, error } = await supabase.rpc('increment_helpful_count', { review_id: id });

    // Fallback if RPC is not defined
    if (error) {
       const { data: updated, error: updateError } = await supabase
        .from("reviews")
        .update({ helpful_count: supabase.rpc('increment', { x: 1 }) as any }) // This is a helper if available
        .eq("id", id)
        .select()
        .single();
        
       // Simple fallback
       if (updateError) {
          const { data: current } = await supabase.from("reviews").select("helpful_count").eq("id", id).single();
          await supabase.from("reviews").update({ helpful_count: (current?.helpful_count || 0) + 1 }).eq("id", id);
       }
    }

    return NextResponse.json({ success: true });
  } catch (err: any) {
    return NextResponse.json({ error: err.message }, { status: 500 });
  }
}
