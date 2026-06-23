import type { APIRoute } from 'astro';
import { registrarUsuario } from '../../../lib/sheets';

export const POST: APIRoute = async ({ request }) => {
  try {
    const datos = await request.json();
    if (!datos.nombre_completo || !datos.correo || !datos.usuario_login || !datos.contrasena) {
      return new Response(JSON.stringify({ error: 'Faltan campos requeridos' }), { status: 400 });
    }
    if (datos.contrasena.length < 6) {
      return new Response(JSON.stringify({ error: 'La contrasena debe tener al menos 6 caracteres' }), { status: 400 });
    }
    const result = await registrarUsuario(datos);
    if (result.error) {
      return new Response(JSON.stringify(result), { status: 400 });
    }
    return new Response(JSON.stringify(result));
  } catch (e: any) {
    console.error('[API] Error en registro:', e.message);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};
