import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

function decodeHtml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&quot;/g, '"')
    .replace(/&#x27;/g, "'")
    .replace(/&#39;/g, "'");
}

function readOgImage(html: string): string {
  const match = html.match(/<meta[^>]+property=["']og:image["'][^>]+content=["']([^"']+)["']/i)
    ?? html.match(/<meta[^>]+content=["']([^"']+)["'][^>]+property=["']og:image["']/i);
  return match ? decodeHtml(match[1]) : "";
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );
    const { data, error } = await supabase
      .from("instagram_posts")
      .select("id, shortcode, caption, image_url, post_url, likes, sort_order, created_at")
      .order("sort_order", { ascending: true })
      .limit(6);

    if (error) throw error;

    const reels = await Promise.all((data ?? []).map(async (reel) => {
      try {
        const response = await fetch(reel.post_url, {
          headers: { "User-Agent": "Mozilla/5.0" },
        });
        const html = await response.text();
        return { ...reel, image_url: response.ok ? readOgImage(html) || reel.image_url : reel.image_url };
      } catch {
        return reel;
      }
    }));

    return new Response(JSON.stringify({ reels }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load Instagram Reels";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
