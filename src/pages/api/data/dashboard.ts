import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { getDashboardData } from '../../../lib/sheets';

export const GET: APIRoute = async ({ cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  const data = await getDashboardData();
  return new Response(JSON.stringify(data));
};
