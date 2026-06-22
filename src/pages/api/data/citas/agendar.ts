import type { APIRoute } from 'astro';
import { getSession } from '../../../../lib/auth';
import { createWithId } from '../../../../lib/sheets';

export const POST: APIRoute = async ({ request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });
  const datos = await request.json();
  datos.id_usuario_solicitante = session.id_usuario;
  const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);
  const id = await createWithId('Citas_Zootecnista', 'CIT', {
    ...datos,
    estado: 'Pendiente',
    fecha_creacion: ahora,
  });
  return new Response(JSON.stringify({ success: true, id_cita: id }));
};
