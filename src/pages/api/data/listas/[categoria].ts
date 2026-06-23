import type { APIRoute } from 'astro';
import { getSession } from '../../../../lib/auth';
import { getListas } from '../../../../lib/sheets';

export const GET: APIRoute = async ({ params, cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  try {
    const data = await getListas(params.categoria || '');
    return new Response(JSON.stringify(data));
  } catch (e: any) {
    console.error('[API] Error al obtener listas:', e.message);
    return new Response(JSON.stringify({ error: 'Error al cargar las listas' }), { status: 500 });
  }
};
