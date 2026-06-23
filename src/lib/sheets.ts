import { google } from 'googleapis';
import { sha256 } from './utils';

/* ============================================================
   AUTH: Solo variables de entorno (compatible con Vercel)
   GOOGLE_CLIENT_EMAIL  — client_email de la service account
   GOOGLE_PRIVATE_KEY   — private_key de la service account
   GOOGLE_SHEET_ID      — ID del spreadsheet
   ============================================================ */

function validateEnv(): void {
  const missing: string[] = [];
  if (!process.env.GOOGLE_CLIENT_EMAIL) missing.push('GOOGLE_CLIENT_EMAIL');
  if (!process.env.GOOGLE_PRIVATE_KEY) missing.push('GOOGLE_PRIVATE_KEY');
  if (!process.env.GOOGLE_SHEET_ID) missing.push('GOOGLE_SHEET_ID');

  if (missing.length > 0) {
    const msg = `[AGROVELAS] Faltan variables de entorno: ${missing.join(', ')}. ` +
      'Configuralas en Vercel (Settings > Environment Variables) o en .env para desarrollo local.';
    console.error(msg);
    throw new Error(msg);
  }

  console.log('[AGROVELAS] Variables de entorno validadas correctamente.');
  console.log(`[AGROVELAS] GOOGLE_CLIENT_EMAIL: ${process.env.GOOGLE_CLIENT_EMAIL}`);
  console.log(`[AGROVELAS] GOOGLE_SHEET_ID: ${process.env.GOOGLE_SHEET_ID?.substring(0, 10)}...`);
  console.log(`[AGROVELAS] GOOGLE_PRIVATE_KEY ${process.env.GOOGLE_PRIVATE_KEY ? 'presente' : 'ausente'} (${(process.env.GOOGLE_PRIVATE_KEY?.length || 0)} chars)`);
}

let authInitialized = false;
let sheetsClient: any = null;

async function getSheet(): Promise<any> {
  if (sheetsClient) return sheetsClient;

  if (!authInitialized) {
    validateEnv();
    authInitialized = true;
  }

  const privateKey = (process.env.GOOGLE_PRIVATE_KEY || '').replace(/\\n/g, '\n');

  const auth = new google.auth.JWT({
    email: process.env.GOOGLE_CLIENT_EMAIL!,
    key: privateKey,
    scopes: ['https://www.googleapis.com/auth/spreadsheets'],
  });

  try {
    await auth.authorize();
    console.log('[AGROVELAS] Autenticacion JWT con Google Sheets exitosa.');
  } catch (err: any) {
    console.error('[AGROVELAS] Error de autenticacion JWT:', err.message);
    throw new Error(`Error de autenticacion con Google Sheets: ${err.message}`);
  }

  sheetsClient = google.sheets({ version: 'v4', auth });
  return sheetsClient;
}

function getSheetId(): string {
  return process.env.GOOGLE_SHEET_ID!;
}

/* ============================================================
   LECTURA / ESCRITURA
   ============================================================ */

export async function readSheet(sheetName: string): Promise<Record<string, string>[]> {
  const sheets = await getSheet();
  const sheetId = getSheetId();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:ZZ`,
  });
  const rows = res.data.values || [];
  if (rows.length <= 1) return [];
  const headers = rows[0].map((h: string) => h.trim());
  return rows.slice(1).map((row: string[]) => {
    const obj: Record<string, string> = {};
    headers.forEach((h: string, i: number) => {
      obj[h] = row[i] || '';
    });
    return obj;
  });
}

export async function appendRow(sheetName: string, values: (string | number)[]): Promise<void> {
  const sheets = await getSheet();
  const sheetId = getSheetId();
  await sheets.spreadsheets.values.append({
    spreadsheetId: sheetId,
    range: `${sheetName}!A:ZZ`,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [values.map(v => String(v))] },
  });
}

export async function updateRow(
  sheetName: string,
  idValue: string,
  data: Record<string, string | number>,
  idColumnIndex = 0
): Promise<boolean> {
  const sheets = await getSheet();
  const sheetId = getSheetId();
  const all = await readSheet(sheetName);
  const headers = Object.keys(all[0] || {});
  const rowIndex = all.findIndex((row) => Object.values(row)[idColumnIndex] === idValue);
  if (rowIndex === -1) return false;
  const range = `${sheetName}!A${rowIndex + 2}`;
  const row = headers.map((h, i) => {
    if (data[h] !== undefined) return String(data[h]);
    return Object.values(all[rowIndex])[i] || '';
  });
  await sheets.spreadsheets.values.update({
    spreadsheetId: sheetId,
    range,
    valueInputOption: 'USER_ENTERED',
    requestBody: { values: [row] },
  });
  return true;
}

async function getNextId(prefix: string): Promise<string> {
  const sheets = await getSheet();
  const sheetId = getSheetId();
  const res = await sheets.spreadsheets.values.get({
    spreadsheetId: sheetId,
    range: 'Secuencias!A:B',
  });
  const rows = res.data.values || [];
  let found = false;
  for (let i = 1; i < rows.length; i++) {
    if (rows[i][0] === prefix) {
      const num = parseInt(rows[i][1]) + 1;
      await sheets.spreadsheets.values.update({
        spreadsheetId: sheetId,
        range: `Secuencias!B${i + 1}`,
        valueInputOption: 'USER_ENTERED',
        requestBody: { values: [[num]] },
      });
      found = true;
      return `${prefix}-${String(num).padStart(5, '0')}`;
    }
  }
  if (!found) {
    await sheets.spreadsheets.values.append({
      spreadsheetId: sheetId,
      range: 'Secuencias!A:B',
      valueInputOption: 'USER_ENTERED',
      requestBody: { values: [[prefix, 1]] },
    });
  }
  return `${prefix}-00001`;
}

export const SHEET_HEADERS: Record<string, string[]> = {
  Usuarios: ['id_usuario','nombre_completo','correo','usuario_login','contrasena_hash','sal','rol','telefono','foto_perfil_url','estado','fecha_creacion','ultimo_acceso','intentos_fallidos'],
  Zootecnistas: ['id_zootecnista','id_usuario','especialidad','anios_experiencia','calificacion_promedio','numero_calificaciones','tarifa_consulta','zona_cobertura','telefono_contacto','correo_contacto','biografia','foto_url','horario_disponible_json','estado'],
  Animales: ['id_animal','codigo_arete_rfid','nombre','especie','raza','sexo','fecha_nacimiento','edad_actual','color_principal','id_padre','id_madre','linea_genetica','procedencia','id_lote_cabana','estado','fecha_registro','registrado_por','codigo_qr_url','foto_principal_url','observaciones_generales'],
  Registro_Fenotipico: ['id_fenotipico','id_animal','fecha_evaluacion','peso_kg','altura_cruz_cm','longitud_corporal_cm','perimetro_toracico_cm','condicion_corporal','tipo_fibra','color_fibra','marcas_distintivas','evaluado_por','observaciones'],
  Registro_Genotipico: ['id_genotipico','id_animal','categoria_registro','pureza_genetica_pct','finura_fibra_um','categoria_fibra','densidad_vellon','uniformidad_vellon','certificado_genealogico_url','antecedentes_geneticos','enfermedades_hereditarias_conocidas','fecha_registro','observaciones'],
  Reproduccion: ['id_reproduccion','id_animal_hembra','tipo_evento','fecha_evento','id_macho','metodo','resultado','fecha_probable_parto','numero_crias','id_cria','responsable','observaciones'],
  Sanidad: ['id_sanidad','id_animal','fecha','tipo_evento','nombre_producto','dosis','via_aplicacion','diagnostico','sintomas_observados','veterinario_responsable','proxima_fecha_aplicacion','costo','estado','observaciones'],
  Animales_Alerta: ['id_alerta','id_animal','fecha_reporte','reportado_por','sintomas','nivel_urgencia','zootecnista_asignado','veterinario_asignado','estado','diagnostico_final','id_sanidad_relacionado','fecha_resolucion'],
  Ubicacion_Manejo: ['id_movimiento','id_animal','fecha','tipo_movimiento','id_lote_origen','id_lote_destino','latitud','longitud','responsable','motivo','observaciones'],
  Lotes_Cabanas: ['id_lote','nombre_lote','tipo_animal_predominante','capacidad_maxima','animales_actuales','ubicacion_descripcion','latitud_centro','longitud_centro','responsable','estado'],
  Esquila: ['id_esquila','id_animal','fecha_esquila','peso_vellon_kg','categoria_fibra','micronaje_um','longitud_mecha_cm','color_fibra','destino','comprador','precio_por_kg','ingreso_total','responsable','observaciones'],
  Contabilidad: ['id_movimiento_contable','fecha','tipo','categoria','monto','id_animal_relacionado','id_esquila_relacionada','descripcion','comprobante_url','registrado_por'],
  Multimedia: ['id_multimedia','id_animal','tipo_archivo','url_archivo','descripcion','fecha_subida','subido_por'],
  Calendario_Actividades: ['id_actividad','titulo','tipo','fecha','hora','id_animal_relacionado','id_lote_relacionado','responsable','estado','descripcion'],
  Notificaciones: ['id_notificacion','id_usuario_destino','tipo','mensaje','fecha_generacion','leido','prioridad','id_relacionado','tipo_relacionado'],
  Citas_Zootecnista: ['id_cita','id_zootecnista','id_usuario_solicitante','id_animal_relacionado','fecha','hora','motivo','estado','notas_zootecnista','calificacion_recibida','fecha_creacion'],
  IoT_Dispositivos: ['id_dispositivo','id_animal','tipo_dispositivo','codigo_dispositivo','fecha_instalacion','estado_bateria_pct','estado','ultima_latitud','ultima_longitud','fecha_ultima_lectura'],
  IoT_Lecturas: ['id_lectura','id_dispositivo','fecha_hora','latitud','longitud','temperatura_corporal','nivel_actividad'],
  Listas: ['categoria','valor','orden','activo'],
  Secuencias: ['prefijo','ultimo_numero'],
  Logs_Sistema: ['id_log','fecha_hora','id_usuario','accion','modulo','detalle'],
  Config_Sistema: ['clave','valor','descripcion'],
};

export async function getListas(categoria: string): Promise<string[]> {
  const all = await readSheet('Listas');
  return all
    .filter((r) => r.categoria === categoria && r.activo === 'Sí')
    .sort((a, b) => parseInt(a.orden) - parseInt(b.orden))
    .map((r) => r.valor);
}

export async function getConfig(clave: string): Promise<string | null> {
  const all = await readSheet('Config_Sistema');
  const found = all.find((r) => r.clave === clave);
  return found ? found.valor : null;
}

/* ============================================================
   AUTH
   ============================================================ */

export async function registrarUsuario(datos: {
  nombre_completo: string;
  correo: string;
  usuario_login: string;
  contrasena: string;
  rol?: string;
  telefono?: string;
}): Promise<{ success: boolean; id_usuario?: string; error?: string }> {
  const usuarios = await readSheet('Usuarios');
  if (usuarios.find((u) => u.usuario_login === datos.usuario_login)) {
    return { success: false, error: 'El nombre de usuario ya existe' };
  }
  if (usuarios.find((u) => u.correo === datos.correo)) {
    return { success: false, error: 'El correo ya esta registrado' };
  }
  const id = await getNextId('USR');
  const salt = Math.random().toString(36).substring(2, 10);
  const hash = sha256(datos.contrasena + salt);
  const hoy = new Date().toISOString().split('T')[0];
  await appendRow('Usuarios', [
    id, datos.nombre_completo, datos.correo, datos.usuario_login,
    hash, salt, datos.rol || 'Ganadero', datos.telefono || '',
    '', 'Activo', hoy, '', '0',
  ]);
  return { success: true, id_usuario: id };
}

export async function iniciarSesion(login: string, contrasena: string) {
  const usuarios = await readSheet('Usuarios');
  const user = usuarios.find(
    (u) => (u.correo === login || u.usuario_login === login) && u.estado === 'Activo'
  );
  if (!user) return { success: false, error: 'Usuario no encontrado o bloqueado' };

  const hash = sha256(contrasena + user.sal);
  if (hash !== user.contrasena_hash) {
    const intentos = parseInt(user.intentos_fallidos) + 1;
    await updateRow('Usuarios', user.id_usuario, { intentos_fallidos: intentos });
    if (intentos >= 5) {
      await updateRow('Usuarios', user.id_usuario, { estado: 'Bloqueado' });
    }
    return { success: false, error: `Contrasena incorrecta. Intento ${intentos}/5` };
  }

  const ahora = new Date().toISOString().replace('T', ' ').substring(0, 16);
  await updateRow('Usuarios', user.id_usuario, { intentos_fallidos: '0', ultimo_acceso: ahora });

  return {
    success: true,
    usuario: {
      id_usuario: user.id_usuario,
      nombre: user.nombre_completo,
      correo: user.correo,
      login: user.usuario_login,
      rol: user.rol,
      telefono: user.telefono,
      foto: user.foto_perfil_url,
    },
  };
}

export async function getDashboardData() {
  const [animales, alertas, actividades, notifs, zootecnistas, contabilidad] =
    await Promise.all([
      readSheet('Animales'),
      readSheet('Animales_Alerta'),
      readSheet('Calendario_Actividades'),
      readSheet('Notificaciones'),
      readSheet('Zootecnistas'),
      readSheet('Contabilidad'),
    ]);

  return {
    totalAnimales: animales.length,
    alertas: alertas.filter((a) => a.estado === 'En seguimiento').length,
    alertasLista: alertas,
    actividades,
    notificaciones: notifs,
    zootecnistas: zootecnistas.filter((z) => z.estado === 'Disponible'),
    contabilidad,
    animales,
  };
}

export async function createWithId(
  sheetName: string,
  prefix: string,
  data: Record<string, string | number>
): Promise<string> {
  const headers = SHEET_HEADERS[sheetName] || Object.keys(data);
  const id = await getNextId(prefix);
  const row = headers.map((h) => {
    if (h.startsWith('id_')) return id;
    return data[h] !== undefined ? String(data[h]) : '';
  });
  await appendRow(sheetName, row);
  return id;
}

export async function registrarAnimalCompleto(datos: any): Promise<{ id_animal: string }> {
  const id = await getNextId('ANI');
  const hoy = new Date().toISOString().split('T')[0];
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=200x200&data=${encodeURIComponent(id)}`;

  const animalHeaders = SHEET_HEADERS['Animales'];
  const animalRow = animalHeaders.map((h) => {
    if (h === 'id_animal') return id;
    if (h === 'fecha_registro') return hoy;
    if (h === 'estado') return 'Activo';
    if (h === 'codigo_qr_url') return qrUrl;
    if (h === 'procedencia' && !datos[h]) return 'Nacido en predio';
    return datos[h] !== undefined ? String(datos[h]) : '';
  });
  await appendRow('Animales', animalRow);

  if (datos.fenotipico && Object.values(datos.fenotipico).some((v: any) => v)) {
    const fenId = await getNextId('FEN');
    const fenHeaders = SHEET_HEADERS['Registro_Fenotipico'];
    const fenRow = fenHeaders.map((h) => {
      if (h === 'id_fenotipico') return fenId;
      if (h === 'id_animal') return id;
      if (h === 'fecha_evaluacion') return hoy;
      if (h === 'evaluado_por') return datos.registrado_por || '';
      return datos.fenotipico[h] !== undefined ? String(datos.fenotipico[h]) : '';
    });
    await appendRow('Registro_Fenotipico', fenRow);
  }

  if (datos.genotipico && Object.values(datos.genotipico).some((v: any) => v)) {
    const genId = await getNextId('GEN');
    const genHeaders = SHEET_HEADERS['Registro_Genotipico'];
    const genRow = genHeaders.map((h) => {
      if (h === 'id_genotipico') return genId;
      if (h === 'id_animal') return id;
      if (h === 'fecha_registro') return hoy;
      return datos.genotipico[h] !== undefined ? String(datos.genotipico[h]) : '';
    });
    await appendRow('Registro_Genotipico', genRow);
  }

  return { id_animal: id };
}
