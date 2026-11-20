export const prerender = false;

import type { APIRoute } from 'astro';
import { getLatestLongFormVideo } from '../../lib/youtube';

// Vercel's CDN keeps this for an hour, then serves the old copy for up to a
// day while it refreshes in the background.
export const GET: APIRoute = async () => {
  const video = await getLatestLongFormVideo();
  return new Response(JSON.stringify(video), {
    headers: {
      'Content-Type': 'application/json',
      'Cache-Control': 'public, max-age=300, s-maxage=3600, stale-while-revalidate=86400',
    },
  });
};
