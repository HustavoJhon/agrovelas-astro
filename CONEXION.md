# Guia de Conexion: AGROVELAS + Google Sheets

Esta guia explica paso a paso como conectar tu pagina Astro con Google Sheets como base de datos.

---

## Paso 1: Inicializar el Google Sheet

### Opcion A: Crear desde cero con el script
1. Ve a https://sheets.new
2. Renombra el spreadsheet a `AGROVELAS_Data`
3. Ve a **Extensiones > Apps Script**
4. Borra el codigo vacio y pega TODO el contenido de `INIT_SHEETS.gs` (esta en la carpeta `task/agrovelas/`)
5. Guarda (Ctrl+S) y nombralo `AGROVELAS Init`
6. Selecciona la funcion `inicializarBaseDeDatos` y haz click en **Ejecutar**
7. Acepta los permisos (primera ejecucion pide autorizacion)
8. Listo - se crearan 22 hojas con sus encabezados

### Opcion B: Crear manualmente
1. Ve a https://sheets.new
2. Crea las hojas con los nombres y columnas de `AGROVELAS_Sheet_Schema.md`
3. Pobla la hoja `Listas` y `Secuencias` con los valores iniciales

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

## Paso 3: Crear credenciales de Google Cloud

1. Ve a https://console.cloud.google.com
2. Crea un proyecto nuevo (o usa uno existente):
   - Click en el selector de proyecto (barra superior) > **Nuevo proyecto**
   - Nombre: `AGROVELAS` > **Crear**
3. Habilita la API de Google Sheets:
   - Menu lateral > **APIs y servicios > Biblioteca**
   - Busca "Google Sheets API" > **Habilitar**
4. Crea una Cuenta de Servicio:
   - Menu lateral > **APIs y servicios > Credenciales**
   - **Crear credenciales > Cuenta de servicio**
   - Nombre: `agrovelas-service`
   - Rol: **Editor** (o roles/sheets.admin si quieres acceso total)
   - **Listo**
5. Genera la clave JSON:
   - Click en la cuenta de servicio creada
   - Pestaña **Claves > Agregar clave > Crear clave nueva > JSON**
   - Se descargara un archivo `.json`
6. **IMPORTANTE**: Renombra el archivo descargado a `google-credentials.json` y colocalo en la raiz del proyecto (`agrovelas-astro/`)

---

## Paso 4: Compartir el Sheet con la cuenta de servicio

1. Abre el archivo `google-credentials.json`
2. Copia el valor de `client_email` (ej: `agrovelas-service@tu-proyecto.iam.gserviceaccount.com`)
3. Abre tu Google Sheet de AGROVELAS
4. Click en **Compartir** (boton azul arriba a la derecha)
5. Pega el email de la cuenta de servicio
6. Dale rol de **Editor**
7. Click en **Enviar** (o **Compartir**)

---

## Paso 5: Configurar variables de entorno

1. Crea un archivo `.env` en la raiz del proyecto:
   ```bash
   cp .env.example .env
   ```
2. Edita `.env` y pon el ID de tu Google Sheet:
   ```
   GOOGLE_SHEET_ID=1AbCdEf2GhIjKlMnOpQrStUvWxYz1234567890
   ```

---

## Paso 6: Ejecutar el proyecto

```bash
# Instalar dependencias (si no lo has hecho)
npm install

# Iniciar servidor de desarrollo
npm run dev
```

El sitio estara disponible en `http://localhost:4321`

---

## Estructura del proyecto

```
agrovelas-astro/
├── src/
│   ├── pages/          # Paginas Astro (rutas)
│   │   ├── api/        # API endpoints (backend SSR)
│   │   │   ├── auth/   # Login, registro, logout
│   │   │   └── data/   # CRUD de cada modulo
│   │   ├── index.astro        # Landing page
│   │   ├── login.astro        # Pagina de login
│   │   ├── registro.astro     # Pagina de registro
│   │   ├── dashboard.astro    # Dashboard principal
│   │   ├── animales.astro     # Modulo Animales
│   │   ├── sanidad.astro      # Modulo Sanidad
│   │   ├── reproduccion.astro # Modulo Reproduccion
│   │   ├── esquila.astro      # Modulo Esquila
│   │   ├── iot.astro          # Modulo IoT / Mapa
│   │   ├── zootecnistas.astro # Directorio Zootecnistas
│   │   ├── contabilidad.astro # Modulo Contabilidad
│   │   └── alertas.astro      # Modulo Alertas
│   ├── components/     # Componentes reutilizables
│   ├── layouts/        # Layouts base
│   ├── lib/            # Libreria de conexion a Sheets
│   └── styles/         # CSS global
├── google-credentials.json  # Credenciales (NO SUBIR A GIT)
├── .env                     # Variables de entorno (NO SUBIR A GIT)
├── .env.example             # Ejemplo de .env
├── CONEXION.md              # Esta guia
└── package.json
```

---

## Solucion de problemas

### Error: "google-credentials.json no encontrado"
- Asegurate de haber descargado el archivo JSON de Google Cloud y renombrado a `google-credentials.json`
- Debe estar en la raiz del proyecto (`agrovelas-astro/`)

### Error: "GOOGLE_SHEET_ID no definido"
- Crea el archivo `.env` con el ID de tu Google Sheet
- Copia el ID desde la URL de tu sheet

### Error: "The caller does not have permission"
- Comparte el Google Sheet con el email de la cuenta de servicio (Paso 4)
- Asegurate de darle rol de **Editor**

### Error: "Google Sheets API has not been used in project"
- Ve a Google Cloud Console y habilita la API de Google Sheets (Paso 3.3)

### Si quieres usar los datos demo
- Copia el contenido de `INIT_SHEETS.gs` en el Apps Script del Google Sheet
- Ejecuta `inicializarBaseDeDatos`
- Ejecuta tambien `poblarDatosDemo` (del archivo `code.gs` en `task/agrovelas/appscript/`)
- Los datos demo incluyen: 10 animales, 4 usuarios, 3 zootecnistas, registros sanitarios, etc.

---

## Usuarios demo (si cargaste los datos demo)

| Usuario | Contrasena | Rol |
|---------|-----------|-----|
| juan | 123456 | Ganadero |
| maria | 123456 | Administrador |
| carlos | 123456 | Zootecnista |
| rosa | 123456 | Veterinario |
| pedro | 123456 | Productor |
