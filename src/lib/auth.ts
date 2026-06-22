import type { AstroCookies } from 'astro';

const SESSION_COOKIE = 'agrovelas_session';

export interface SessionUser {
  id_usuario: string;
  nombre: string;
  correo: string;
  login: string;
  rol: string;
  telefono?: string;
  foto?: string;
}

export function setSession(cookies: AstroCookies, user: SessionUser) {
  const encoded = Buffer.from(JSON.stringify(user)).toString('base64');
  cookies.set(SESSION_COOKIE, encoded, {
    httpOnly: true,
    sameSite: 'lax',
    path: '/',
    maxAge: 60 * 60 * 24 * 7,
  });
}

export function getSession(cookies: AstroCookies): SessionUser | null {
  const cookie = cookies.get(SESSION_COOKIE);
  if (!cookie) return null;
  try {
    return JSON.parse(Buffer.from(cookie.value, 'base64').toString('utf-8'));
  } catch {
    return null;
  }
}

export function clearSession(cookies: AstroCookies) {
  cookies.delete(SESSION_COOKIE, { path: '/' });
}
