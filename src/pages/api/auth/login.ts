import type { APIRoute } from 'astro';
import { iniciarSesion } from '../../../lib/sheets';
import { setSession } from '../../../lib/auth';

export const POST: APIRoute = async ({ request, cookies }) => {
  const { login, contrasena } = await request.json();
  const result = await iniciarSesion(login, contrasena);
  if (!result.success) {
    return new Response(JSON.stringify(result), { status: 401 });
  }
  setSession(cookies, result.usuario!);
  return new Response(JSON.stringify(result));
};
