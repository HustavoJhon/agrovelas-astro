import type { APIRoute } from 'astro';
import { getSession } from '../../../lib/auth';
import { readSheet, appendRow, SHEET_HEADERS, createWithId } from '../../../lib/sheets';

const PREFIX_MAP: Record<string, string> = {
  Animales: 'ANI',
  Sanidad: 'SAN',
  Reproduccion: 'REP',
  Esquila: 'ESQ',
  Contabilidad: 'CTB',
  Animales_Alerta: 'ALE',
  Ubicacion_Manejo: 'MOV',
  Lotes_Cabanas: 'LOT',
  Multimedia: 'MUL',
  Calendario_Actividades: 'CAL',
  Citas_Zootecnista: 'CIT',
  IoT_Dispositivos: 'DIS',
  IoT_Lecturas: 'LEC',
  Notificaciones: 'NOT',
  Zootecnistas: 'ZOO',
  Usuarios: 'USR',
  Registro_Fenotipico: 'FEN',
  Registro_Genotipico: 'GEN',
};

export const GET: APIRoute = async ({ params, cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });

  const sheetName = params.sheet;
  if (!sheetName) return new Response(JSON.stringify({ error: 'Sheet requerido' }), { status: 400 });

  try {
    const data = await readSheet(sheetName);
    return new Response(JSON.stringify(data));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};

export const POST: APIRoute = async ({ params, request, cookies }) => {
  const session = getSession(cookies);
  if (!session) return new Response(JSON.stringify({ error: 'No autorizado' }), { status: 401 });

  const sheetName = params.sheet;
  if (!sheetName) return new Response(JSON.stringify({ error: 'Sheet requerido' }), { status: 400 });

  try {
    const body = await request.json();
    const prefix = PREFIX_MAP[sheetName];
    if (prefix) {
      const id = await createWithId(sheetName, prefix, body);
      return new Response(JSON.stringify({ success: true, id }));
    }
    const headers = SHEET_HEADERS[sheetName] || Object.keys(body);
    const row = headers.map((h) => String(body[h] || ''));
    await appendRow(sheetName, row);
    return new Response(JSON.stringify({ success: true }));
  } catch (e: any) {
    return new Response(JSON.stringify({ error: e.message }), { status: 500 });
  }
};
