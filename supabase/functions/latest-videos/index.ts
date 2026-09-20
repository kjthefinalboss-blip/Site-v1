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

async function getChannelId(): Promise<string> {
  const response = await fetch(`https://www.youtube.com/@${channelHandle}/videos`, {
    headers: { "User-Agent": "Mozilla/5.0" },
  });

  if (!response.ok) {
    throw new Error("Unable to reach the YouTube channel");
  }

  const html = await response.text();
  const channelId = html.match(/(?:"channelId"|"externalId")\s*:\s*"(UC[a-zA-Z0-9_-]+)"/)?.[1];
  if (!channelId) {
    throw new Error("Unable to identify the YouTube channel");
  }

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

  if (!response.ok) {
    throw new Error(`YouTube feed returned status ${response.status}`);
  }
  const entries = [...xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)].slice(0, 6);

  const videos = entries.flatMap((match) => {
    const entry = match[1];
    const videoId = readTag(entry, "yt:videoId");
    const title = readTag(entry, "title");
    const publishedAt = readTag(entry, "published");
    if (!videoId || !title || !publishedAt) return [];
    const thumbnail = readAttribute(entry, "media:thumbnail", "url") || `https://i.ytimg.com/vi/${videoId}/hqdefault.jpg`;
    const url = `https://www.youtube.com/watch?v=${videoId}`;
    return [{ id: videoId, title, publishedAt, thumbnail, url, category: "Latest video" }];
  });

  if (videos.length === 0) {
    throw new Error("No videos were found in the channel feed.");
  }

  return videos;
}

Deno.serve(async (req: Request) => {
  if (req.method === "OPTIONS") {
    return new Response(null, { status: 200, headers: corsHeaders });
  }

  try {
    const videos = await getLatestVideos();
    return new Response(JSON.stringify({ videos }), {
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  } catch (error) {
    const message = error instanceof Error ? error.message : "Unable to load videos";
    return new Response(JSON.stringify({ error: message }), {
      status: 502,
      headers: { ...corsHeaders, "Content-Type": "application/json" },
    });
  }
});
