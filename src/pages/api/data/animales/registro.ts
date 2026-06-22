import type { APIRoute } from 'astro';
import { getSession } from '../../../../lib/auth';
import { registrarAnimalCompleto } from '../../../../lib/sheets';

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });

  const datos = await request.json();
  datos.registrado_por = session.id_usuario;
  try {
    const result = await registrarAnimalCompleto(datos);
    return new Response(JSON.stringify({ success: true, ...result }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
