export const prerender = false;

import type { APIRoute } from 'astro';

export const GET: APIRoute = async () => {
  try {
    const res = await fetch(
      'https://api.comick.fun/comic/one-piece/chapters?lang=en&limit=1&chap-order=1'
    );
    const data = await res.json();
    const chapter = data?.[0]?.chap ?? '1176';
    return new Response(JSON.stringify({ chapter }), {
      headers: { 'Content-Type': 'application/json' },
    });
  } catch {
    return new Response(JSON.stringify({ chapter: '1176' }), {
      headers: { 'Content-Type': 'application/json' },
    });
  }
};
