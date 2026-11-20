// Finds the newest long-form upload on Dino's YouTube channel for the
// "Watch these first" section on /work. Runs on the server only (at build
// time and in /api/latest-video), so the browser never hits YouTube directly.

export type Video = { id: string; title: string };

export const CHANNEL_ID = 'UCwwS3crzfs_n77XKRb4_Esw';
const FEED_URL = `https://www.youtube.com/feeds/videos.xml?channel_id=${CHANNEL_ID}`;

export const PINNED_VIDEOS: (Video & { label: string })[] = [
  { id: 'bR7LU0avhXg', title: 'I Visited EVERY Pool at Disney World', label: '163K+ views' },
  { id: '7XRKi_T_dnw', title: 'I Tried EVERY Ride at Islands of Adventure', label: '123K+ views' },
];

export const FALLBACK_VIDEO: Video = {
  id: 'W_KwYfgxGlM',
  title: 'I Tried EVERY Ride at Animal Kingdom',
};

const TIMEOUT_MS = 5000;

function decodeXml(s: string): string {
  return s
    .replace(/&lt;/g, '<')
    .replace(/&gt;/g, '>')
    .replace(/&quot;/g, '"')
    .replace(/&#39;|&apos;/g, "'")
    .replace(/&#(\d+);/g, (_, n) => String.fromCodePoint(Number(n)))
    .replace(/&amp;/g, '&');
}

type FeedEntry = Video & { link: string };

function parseFeed(xml: string): FeedEntry[] {
  const entries: FeedEntry[] = [];
  for (const [, body] of xml.matchAll(/<entry>([\s\S]*?)<\/entry>/g)) {
    const id = body.match(/<yt:videoId>([^<]+)<\/yt:videoId>/)?.[1];
    const title = body.match(/<title>([^<]*)<\/title>/)?.[1];
    const link = body.match(/<link rel="alternate" href="([^"]+)"/)?.[1] ?? '';
    if (id && title) entries.push({ id, title: decodeXml(title), link });
  }
  return entries; // feed is newest first
}

// Second opinion on Shorts: youtube.com/shorts/{id} answers 200 for a Short
// and redirects (303) to /watch for a regular video. If the check itself
// fails we trust the feed link instead.
async function isShortByRedirect(id: string): Promise<boolean | null> {
  try {
    const res = await fetch(`https://www.youtube.com/shorts/${id}`, {
      method: 'HEAD',
      redirect: 'manual',
      signal: AbortSignal.timeout(TIMEOUT_MS),
    });
    if (res.status === 200) return true;
    if (res.status >= 300 && res.status < 400) return false;
    return null;
  } catch {
    return null;
  }
}

export async function getLatestLongFormVideo(): Promise<Video> {
  try {
    const res = await fetch(FEED_URL, { signal: AbortSignal.timeout(TIMEOUT_MS) });
    if (!res.ok) throw new Error(`Feed returned ${res.status}`);
    const entries = parseFeed(await res.text());

    const pinnedIds = new Set(PINNED_VIDEOS.map(v => v.id));
    const candidates = entries.filter(
      e => !pinnedIds.has(e.id) && !e.link.includes('/shorts/'),
    );

    // Check only the first few candidates so a slow YouTube can't stall us.
    for (const c of candidates.slice(0, 3)) {
      if ((await isShortByRedirect(c.id)) === true) continue;
      return { id: c.id, title: c.title };
    }
  } catch (err) {
    console.error('[youtube] latest video lookup failed:', err);
  }
  return FALLBACK_VIDEO;
}
