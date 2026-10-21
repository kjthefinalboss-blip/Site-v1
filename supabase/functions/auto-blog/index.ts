import { createClient } from "npm:@supabase/supabase-js@2.57.4";

const corsHeaders = {
  "Access-Control-Allow-Origin": "*",
  "Access-Control-Allow-Methods": "GET, POST, PUT, DELETE, OPTIONS",
  "Access-Control-Allow-Headers": "Content-Type, Authorization, X-Client-Info, Apikey",
};

const channelHandle = "rajikrrtravelvlogs";

function decodeXml(value: string): string {
  return value
    .replace(/&amp;/g, "&")
    .replace(/&lt;/g, "<")
    .replace(/&gt;/g, ">")
    .replace(/&quot;/g, '"')
    .replace(/&#39;/g, "'");
}

function readTag(entry: string, tagName: string): string {
  const match = entry.match(new RegExp(`<${tagName}[^>]*>([\\s\\S]*?)<\\/${tagName}>`));
  return match ? decodeXml(match[1].trim()) : "";
}

function readAttribute(entry: string, tagName: string, attribute: string): string {
  const match = entry.match(new RegExp(`<${tagName}[^>]*\\b${attribute}=["']([^"']+)["'][^>]*>`));
  return match ? decodeXml(match[1]) : "";
}

function slugify(text: string): string {
  return text
    .toLowerCase()
    .replace(/[^a-z0-9\s-]/g, "")
    .replace(/\s+/g, "-")
    .replace(/-+/g, "-")
    .substring(0, 80);
}

function guessCategory(title: string): string {
  const lower = title.toLowerCase();
  if (lower.includes("road trip") || lower.includes("drive") || lower.includes("border")) return "Road Trips";
  if (lower.includes("family") || lower.includes("kids")) return "Family Travel";
  if (lower.includes("hidden") || lower.includes("gem") || lower.includes("secret")) return "Hidden Gems";
  if (lower.includes("hotel") || lower.includes("resort") || lower.includes("luxury") || lower.includes("stay")) return "Hotel Reviews";
  if (lower.includes("guide") || lower.includes("how to") || lower.includes("process")) return "Travel Guides";
  return "Travel Guides";
}

async function getChannelId(): Promise<string> {
  const response = await fetch(`https://www.youtube.com/@${channelHandle}/videos`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });
  if (!response.ok) throw new Error("Unable to reach the YouTube channel");
  const html = await response.text();
  const channelId = html.match(/(?:"channelId"|"externalId")\s*:\s*"(UC[a-zA-Z0-9_-]+)"/)?.[1];
  if (!channelId) throw new Error("Unable to identify the YouTube channel");
  return channelId;
}

async function getLatestVideos() {
  const channelId = await getChannelId();
  const response = await fetch(`https://www.youtube.com/feeds/videos.xml?channel_id=${channelId}`, {
    headers: {
      "User-Agent": "Mozilla/5.0 (Windows NT 10.0; Win64; x64) AppleWebKit/537.36 (KHTML, like Gecko) Chrome/120.0.0.0 Safari/537.36",
      "Accept": "application/xml, text/xml, */*",
    },
    redirect: "follow",
  });
  const xml = await response.text();
  if (!response.ok) throw new Error(`YouTube feed returned status ${response.status}`);
  return [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 10).flatMap((match) => {
    const entry = match[1];
    const videoId = readTag(entry, "yt:videoId");
    const title = readTag(entry, "title");
    const publishedAt = readTag(entry, "published");
    if (!videoId || !title || !publishedAt) return [];
    const thumbnail = readAttribute(entry, "media:thumbnail", "url") || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const description = readTag(entry, "media:description");
    return [{ id: videoId, title, publishedAt, thumbnail, description }];
  });
}

async function generateBlogWithAI(video: { id: string; title: string; description: string }): Promise<{
  excerpt: string; content: string; category: string; seo_description: string; seo_keywords: string;
}> {
  const apiKey = Deno.env.get("OPENAI_API_KEY");
  if (!apiKey) {
    const fallbackContent = `## Overview\n\nThis video from Raji KRR Travel Vlogs covers ${video.title}.\n\nThe full adventure is captured in the video above, where you'll find detailed commentary, route information, and family travel tips.\n\n## Key Highlights\n\n- Full travel documentation with practical advice\n- Family-friendly travel perspective\n- Real experiences and honest recommendations\n\n## Tips for Travelers\n\n- Plan ahead and check border requirements if crossing internationally\n- Keep documents organized and accessible\n- Travel with flexibility — plans can change on the road\n\n## Watch the Full Video\n\nFor the complete experience including visuals, commentary, and step-by-step guidance, watch the full video on YouTube.\n\n*This article was automatically generated from the video and is awaiting review before publishing.*`;
    return {
      excerpt: video.description.substring(0, 160) || `A travel story about ${video.title}.`,
      content: fallbackContent,
      category: guessCategory(video.title),
      seo_description: video.description.substring(0, 155) || video.title,
      seo_keywords: "travel, saudi arabia, road trip, family travel",
    };
  }

  const prompt = `You are a travel blog writer. Write a detailed, engaging travel blog article based on this YouTube video from "Raji KRR Travel Vlogs", a family travel channel based in Saudi Arabia covering the Middle East and beyond.

Video title: ${video.title}
Video description: ${video.description || "No description available."}

Write the article in clean Markdown format. Include:
- An engaging opening paragraph
- 3-4 sections with ## headings (Overview, Key Highlights, Travel Tips, etc.)
- Practical travel advice (routes, costs, documents, best times to visit)
- A family-friendly perspective
- A closing paragraph linking back to the video
- Use **bold** for important terms

Also provide:
- A 1-2 sentence excerpt (no markdown)
- A category from: Travel Guides, Family Travel, Road Trips, Hidden Gems, Hotel Reviews
- An SEO meta description (under 155 characters)
- SEO keywords as comma-separated values

Respond as JSON with keys: excerpt, content, category, seo_description, seo_keywords`;

  const response = await fetch("https://api.openai.com/v1/chat/completions", {
    method: "POST",
    headers: {
      "Authorization": `Bearer ${apiKey}`,
      "Content-Type": "application/json",
    },
    body: JSON.stringify({
      model: "gpt-4o-mini",
      messages: [{ role: "user", content: prompt }],
      response_format: { type: "json_object" },
      max_tokens: 2000,
      temperature: 0.7,
    }),
  });

  if (!response.ok) {
    const errText = await response.text();
    throw new Error(`OpenAI API error: ${response.status} — ${errText.substring(0, 200)}`);
  }

  const result = await response.json();
  const text = result.choices?.[0]?.message?.content ?? "{}";
  return JSON.parse(text);
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

    const videos = await getLatestVideos();
    const results: { videoId: string; title: string; status: string }[] = [];

    for (const video of videos) {
      const { data: existing } = await supabase
        .from("blog_posts")
        .select("id, video_id")
        .eq("video_id", video.id)
        .maybeSingle();

      if (existing) {
        results.push({ videoId: video.id, title: video.title, status: "skipped" });
        continue;
      }

      try {
        const ai = await generateBlogWithAI(video);
        const baseSlug = slugify(video.title);
        let slug = baseSlug;
        let slugAttempt = 0;
        while (slugAttempt < 10) {
          const { data: slugCheck } = await supabase
            .from("blog_posts")
            .select("id")
            .eq("slug", slug)
            .maybeSingle();
          if (!slugCheck) break;
          slugAttempt++;
          slug = `${baseSlug}-${slugAttempt}`;
        }

        const { error } = await supabase.from("blog_posts").insert({
          slug,
          title: video.title,
          excerpt: ai.excerpt,
          content: ai.content,
          category: ai.category,
          destination: "",
          thumbnail: video.thumbnail,
          video_url: `https://www.youtube.com/watch?v=${video.id}`,
          video_id: video.id,
          source_type: "youtube",
          status: "draft",
          seo_description: ai.seo_description,
          seo_keywords: ai.seo_keywords,
        });

        if (error) {
          results.push({ videoId: video.id, title: video.title, status: `error: ${error.message}` });
        } else {
          results.push({ videoId: video.id, title: video.title, status: "created" });
        }
      } catch (genError) {
        const msg = genError instanceof Error ? genError.message : "Unknown error";
        results.push({ videoId: video.id, title: video.title, status: `error: ${msg}` });
      }
    }

    return new Response(JSON.stringify({ results, checked: videos.length }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to process videos";
    return new Response(JSON.stringify({ error: message }), {
      status: 500,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
