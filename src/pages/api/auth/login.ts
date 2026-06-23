import type { APIRoute } from 'astro';
import { iniciarSesion } from '../../../lib/sheets';
import { setSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  try {
    const { login, contrasena } = await request.json();
    const result = await iniciarSesion(login, contrasena);
    if (!result.success) {
      return new Response(JSON.stringify(result), { status: 401 });
    }
    setSession(cookies, result.usuario!);
    return new Response(JSON.stringify(result));
  } catch (e: any) {
    console.error('[API] Error en login:', e.message);
    return new Response(JSON.stringify({ error: 'Error interno del servidor' }), { status: 500 });
  }
};
