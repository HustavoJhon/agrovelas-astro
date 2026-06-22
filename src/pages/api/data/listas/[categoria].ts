import type { APIRoute } from 'astro';
import { getSession } from '../../../../lib/auth';
import { getListas } from '../../../../lib/sheets';

export const GET: APIRoute = async ({ params, cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  const data = await getListas(params.categoria || '');
  return new Response(JSON.stringify(data));
};
