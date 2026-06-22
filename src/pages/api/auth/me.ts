import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';

export const GET: APIRoute = async ({ cookies }) => {
  const session = getSession(cookies);
  if (!session) {
    return new Response(JSON.stringify({ session: null }), { status: 401 });
  }
  return new Response(JSON.stringify({ session }));
};
