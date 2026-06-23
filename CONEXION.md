# Guia de Conexion: AGROVELAS + Google Sheets

Esta guia explica como conectar el proyecto Astro con Google Sheets para usar como base de datos en local y en produccion (Vercel).

---

## Paso 1: Inicializar el Google Sheet

### Opcion A: Crear desde cero con el script
1. Ve a https://sheets.new
2. Renombra el spreadsheet a `AGROVELAS_Data`
3. Ve a **Extensiones > Apps Script**
4. Borra el codigo vacio y pega TODO el contenido de `task/agrovelas/init_and_demo.gs`
5. Guarda (Ctrl+S) y nombralo `AGROVELAS Init`
6. Selecciona la funcion `inicializarBaseDeDatos` y haz click en **Ejecutar**
7. Acepta los permisos (primera ejecucion pide autorizacion)
8. Listo - se crearan 22 hojas con sus encabezados

### Opcion B: Crear manualmente
Crea las hojas con los nombres y columnas definidos en `SHEET_HEADERS` en `src/lib/sheets.ts`

---

## Paso 2: Obtener el ID del Google Sheet

1. Abre tu Google Sheet
2. La URL se ve asi:
   ```
   https://docs.google.com/spreadsheets/d/1AbCdEf2GhIjKlMnOpQrStUvWxYz1234567890/edit
   ```
3. Copia el ID (la parte larga entre `/d/` y `/edit`)
4. Ejemplo: `1AbCdEf2GhIjKlMnOpQrStUvWxYz1234567890`

---

## Paso 3: Crear Service Account en Google Cloud

1. Ve a https://console.cloud.google.com
2. Crea un proyecto (o usa uno existente):
   - Click en el selector de proyecto > **Nuevo proyecto**
   - Nombre: `AGROVELAS` > **Crear**
3. Habilita la API de Google Sheets:
   - Menu lateral > **APIs y servicios > Biblioteca**
   - Busca "Google Sheets API" > **Habilitar**
4. Crea una Cuenta de Servicio:
   - Menu lateral > **APIs y servicios > Credenciales**
   - **Crear credenciales > Cuenta de servicio**
   - Nombre: `agrovelas-service`
   - Rol: **Editor** (o roles/sheets.admin)
   - **Listo**
5. Genera la clave JSON:
   - Click en la cuenta de servicio creada
   - Pestaña **Claves > Agregar clave > Crear clave nueva > JSON**
   - Se descargara un archivo `.json`

---

## Paso 4: Compartir el Sheet con la cuenta de servicio

1. Abre el archivo `.json` descargado
2. Copia el valor de `client_email` (ej: `agrovelas-service@tu-proyecto.iam.gserviceaccount.com`)
3. Abre tu Google Sheet de AGROVELAS
4. Click en **Compartir** (boton azul arriba a la derecha)
5. Pega el email de la cuenta de servicio
6. Dale rol de **Editor**
7. Click en **Enviar**

---

## Paso 5: Configurar variables de entorno

### Desarrollo local
Crea o edita el archivo `.env` en la raiz del proyecto:

```bash
cp .env.example .env
```

Edita `.env` con los valores de tu Service Account y Sheet:

```
GOOGLE_SHEET_ID=1AbCdEf2GhIjKlMnOpQrStUvWxYz1234567890
GOOGLE_CLIENT_EMAIL=agrovelas-service@tu-proyecto.iam.gserviceaccount.com
GOOGLE_PRIVATE_KEY="-----BEGIN PRIVATE KEY-----\nMIIEvQIBADANBgkqhkiG9w0BAQEFAASCBKcwggSjAgEAAoIBAQ...\n-----END PRIVATE KEY-----\n"
```

**Importante**: `GOOGLE_PRIVATE_KEY` debe tener `\n` literales (no saltos de linea reales). El sistema los convierte automaticamente.

### Produccion (Vercel)
1. Ve a tu proyecto en Vercel > **Settings > Environment Variables**
2. Agrega las 3 variables:
   - `GOOGLE_SHEET_ID`
   - `GOOGLE_CLIENT_EMAIL`
   - `GOOGLE_PRIVATE_KEY` (pega el valor con `\n` literales)
3. Marca "Include in preview deployments" y "Include in production"

---

## Paso 6: Ejecutar el proyecto

```bash
npm install
npm run dev
```

Disponible en `http://localhost:4321`

---

## Estructura del proyecto

```
agrovelas-astro/
├── src/
│   ├── pages/          # Paginas + API endpoints
│   ├── components/     # Componentes reutilizables
│   ├── layouts/        # Layouts base
│   ├── lib/            # Conexion a Google Sheets (JWT)
│   │   ├── sheets.ts   # CRUD + autenticacion (solo env vars)
│   │   ├── auth.ts     # Sesion via cookies
│   │   └── utils.ts    # SHA-256, formatos
│   └── styles/         # CSS global
├── .env                # Variables locales (NO SUBIR A GIT)
├── .env.example        # Template de variables
├── CONEXION.md         # Esta guia
└── package.json
```

---

## Solucion de problemas

### Error: "Faltan variables de entorno"
- Asegurate de tener las 3 variables: `GOOGLE_CLIENT_EMAIL`, `GOOGLE_PRIVATE_KEY`, `GOOGLE_SHEET_ID`
- En local: en tu archivo `.env`
- En Vercel: en **Settings > Environment Variables**

### Error de autenticacion JWT
- Verifica que `GOOGLE_PRIVATE_KEY` tenga los `\n` literales (no saltos de linea reales)
- En Vercel, si pegas la key desde un JSON, asegurate de escapar los saltos de linea como `\n`

### Error: "The caller does not have permission"
- Comparte el Google Sheet con el email de la cuenta de servicio (Paso 4)
- Debe tener rol de **Editor**

### Error: "Google Sheets API has not been used"
- Ve a Google Cloud Console y habilita la API de Google Sheets (Paso 3.3)

### Verificar conexion en Vercel
- Revisa los logs de Vercel para ver:
  - `[AGROVELAS] Variables de entorno validadas correctamente.`
  - `[AGROVELAS] Autenticacion JWT con Google Sheets exitosa.`
- Si ves errores de conexion, verifica las variables de entorno en Vercel

---

## Usuarios demo (si cargaste los datos demo)

| Usuario | Contrasena | Rol |
|---------|-----------|------|
| juan | 123456 | Ganadero |
| maria | 123456 | Administrador |
| carlos | 123456 | Zootecnista |
| rosa | 123456 | Veterinario |
| pedro | 123456 | Productor |
