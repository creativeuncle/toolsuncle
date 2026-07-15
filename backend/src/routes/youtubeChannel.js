import { Router } from "express";

const router = Router();
const API_BASE = "https://www.googleapis.com/youtube/v3";

function extractHandleOrId(rawInput) {
  const input = rawInput.trim();

  const urlMatch = input.match(
    /youtube\.com\/(?:channel\/(UC[\w-]+)|@([\w.-]+)|c\/([\w.-]+)|user\/([\w.-]+))/i
  );
  if (urlMatch) {
    const [, channelId, handle, cName, userName] = urlMatch;
    if (channelId) return { type: "id", value: channelId };
    if (handle) return { type: "handle", value: handle };
    if (cName) return { type: "search", value: cName };
    if (userName) return { type: "user", value: userName };
  }

  if (/^UC[\w-]{22}$/.test(input)) return { type: "id", value: input };

  const handle = input.replace(/^@/, "");
  return { type: "handle", value: handle };
}

async function fetchChannelResource(params) {
  const url = new URL(`${API_BASE}/channels`);
  Object.entries(params).forEach(([key, value]) => url.searchParams.set(key, value));
  url.searchParams.set("key", process.env.YOUTUBE_API_KEY);

  const res = await fetch(url);
  const data = await res.json();
  if (!res.ok) {
    const message = data?.error?.message || "YouTube API request failed";
    const err = new Error(message);
    err.status = res.status;
    throw err;
  }
  return data;
}

router.get("/", async (req, res, next) => {
  try {
    if (!process.env.YOUTUBE_API_KEY) {
      return res.status(500).json({ error: "YOUTUBE_API_KEY is not configured on the server." });
    }

    const query = (req.query.query || "").toString().trim();
    if (!query) {
      return res.status(400).json({ error: "Provide a channel handle or URL." });
    }

    const parts = "snippet,statistics";
    const ref = extractHandleOrId(query);

    let data;
    if (ref.type === "id") {
      data = await fetchChannelResource({ part: parts, id: ref.value });
    } else if (ref.type === "handle") {
      data = await fetchChannelResource({ part: parts, forHandle: ref.value });
    } else if (ref.type === "user") {
      data = await fetchChannelResource({ part: parts, forUsername: ref.value });
    } else {
      data = await fetchChannelResource({ part: parts, forHandle: ref.value });
    }

    if (!data.items?.length) {
      return res.status(404).json({ error: "Couldn't find a YouTube channel matching that input." });
    }

    const channel = data.items[0];
    res.json({
      id: channel.id,
      title: channel.snippet.title,
      description: channel.snippet.description,
      thumbnail:
        channel.snippet.thumbnails?.high?.url ||
        channel.snippet.thumbnails?.medium?.url ||
        channel.snippet.thumbnails?.default?.url,
      customUrl: channel.snippet.customUrl,
      publishedAt: channel.snippet.publishedAt,
      subscriberCount: channel.statistics.hiddenSubscriberCount
        ? null
        : Number(channel.statistics.subscriberCount || 0),
      viewCount: Number(channel.statistics.viewCount || 0),
      videoCount: Number(channel.statistics.videoCount || 0),
    });
  } catch (err) {
    if (err.status === 403) {
      return res.status(403).json({
        error: "YouTube API key is invalid, restricted, or quota has been exceeded.",
      });
    }
    next(err);
  }
});

export default router;
