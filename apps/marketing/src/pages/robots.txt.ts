import type { APIRoute } from 'astro';
import { robotsText } from '../application/site-metadata.mjs';

export const GET: APIRoute = ({ site }) => new Response(robotsText(site?.origin), {
  headers: { 'Content-Type': 'text/plain; charset=utf-8' },
});
