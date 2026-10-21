import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    if (req.method !== "POST") {
      return new Response(JSON.stringify({ error: "Method not allowed" }), {
        status: 405,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const supabase = createClient(
      Deno.env.get("SUPABASE_URL") ?? "",
      Deno.env.get("SUPABASE_SERVICE_ROLE_KEY") ?? "",
    );

    const body = await req.json().catch(() => ({}));
    const postId: string | undefined = body.postId;
    const contentType: string = body.contentType ?? "blog";

    if (!postId) {
      return new Response(JSON.stringify({ error: "postId is required" }), {
        status: 400,
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const { data: subscribers, error: subError } = await supabase
      .from("subscribers")
      .select("id, email")
      .eq("confirmed", true);

    if (subError) throw subError;
    if (!subscribers || subscribers.length === 0) {
      return new Response(JSON.stringify({ message: "No subscribers to notify", sent: 0 }), {
        headers: { ...corsHeaders, "Content-Type": "application/json" },
      });
    }

    const url = new URL(req.url);
    const siteUrl = Deno.env.get("SITE_URL") ?? `${url.protocol}//${url.host}`;

    let subject = "New travel content from Raji KRR Travel Vlogs";
    let htmlBody = "";
    let contentId = postId;
    let postTitle = "";
    let postThumbnail = "";
    let postUrl = "";

    if (contentType === "blog") {
      const { data: post } = await supabase
        .from("blog_posts")
        .select("title, excerpt, thumbnail, slug, video_url")
        .eq("id", postId)
        .maybeSingle();

      if (post) {
        postTitle = post.title;
        postThumbnail = post.thumbnail;
        postUrl = `${siteUrl}/#blog/${post.slug}`;
        subject = `New Blog Post: ${post.title}`;
        htmlBody = `
          <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f6f1; padding: 32px;">
            <div style="text-align: center; margin-bottom: 24px;">
              <h1 style="color: #0f766e; font-size: 22px; margin: 0;">Raji KRR Travel Vlogs</h1>
              <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">New blog post published</p>
            </div>
            ${post.thumbnail ? `<img src="${post.thumbnail}" alt="${post.title}" style="width: 100%; border-radius: 16px; margin-bottom: 24px;" />` : ""}
            <h2 style="color: #1f2937; font-size: 20px; line-height: 1.3;">${post.title}</h2>
            <p style="color: #4b5563; font-size: 15px; line-height: 1.6;">${post.excerpt}</p>
            <a href="${postUrl}" style="display: inline-block; background: #0f766e; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 15px; font-weight: 600; margin-top: 16px;">Read the Article</a>
            <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">You are receiving this email because you subscribed to Raji KRR Travel Vlogs.</p>
          </div>`;
      }
    } else if (contentType === "video") {
      contentId = body.videoId ?? postId;
      postTitle = body.title ?? "New Video Published";
      postThumbnail = body.thumbnail ?? "";
      postUrl = body.url ?? siteUrl;
      subject = `New Video: ${postTitle}`;
      htmlBody = `
        <div style="font-family: Georgia, serif; max-width: 600px; margin: 0 auto; background: #f8f6f1; padding: 32px;">
          <div style="text-align: center; margin-bottom: 24px;">
            <h1 style="color: #0f766e; font-size: 22px; margin: 0;">Raji KRR Travel Vlogs</h1>
            <p style="color: #6b7280; font-size: 13px; margin-top: 4px;">New video on YouTube</p>
          </div>
          ${postThumbnail ? `<img src="${postThumbnail}" alt="${postTitle}" style="width: 100%; border-radius: 16px; margin-bottom: 24px;" />` : ""}
          <h2 style="color: #1f2937; font-size: 20px; line-height: 1.3;">${postTitle}</h2>
          <a href="${postUrl}" style="display: inline-block; background: #0f766e; color: #fff; padding: 14px 32px; border-radius: 12px; text-decoration: none; font-size: 15px; font-weight: 600; margin-top: 16px;">Watch Now</a>
          <p style="color: #9ca3af; font-size: 12px; margin-top: 32px; text-align: center;">You are receiving this email because you subscribed to Raji KRR Travel Vlogs.</p>
        </div>`;
    }

    let sentCount = 0;
    const resendApiKey = Deno.env.get("RESEND_API_KEY");

    for (const subscriber of subscribers) {
      const { data: alreadySent } = await supabase
        .from("notification_log")
        .select("id")
        .eq("subscriber_id", subscriber.id)
        .eq("content_type", contentType)
        .eq("content_id", contentId)
        .maybeSingle();

      if (alreadySent) continue;

      if (resendApiKey) {
        try {
          const emailResponse = await fetch("https://api.resend.com/emails", {
            method: "POST",
            headers: {
              "Authorization": `Bearer ${resendApiKey}`,
              "Content-Type": "application/json",
            },
            body: JSON.stringify({
              from: "Raji KRR Travel Vlogs <noreply@resend.dev>",
              to: [subscriber.email],
              subject,
              html: htmlBody,
            }),
          });

          if (!emailResponse.ok) {
            continue;
          }
        } catch {
          continue;
        }
      }

      await supabase.from("notification_log").insert({
        subscriber_id: subscriber.id,
        post_id: contentType === "blog" ? postId : null,
        content_type: contentType,
        content_id: contentId,
      });
      sentCount++;
    }

    return new Response(JSON.stringify({ message: `Notifications sent to ${sentCount} subscriber(s)`, sent: sentCount }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to send notifications";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
