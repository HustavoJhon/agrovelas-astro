import type { APIRoute } from 'astro';
import { clearSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ cookies }) => {
  clearSession(cookies);
  return new Response(JSON.stringify({ success: true }));
};

export const GET: APIRoute = async ({ cookies, redirect }) => {
  clearSession(cookies);
  return redirect('/login', 302);
};
